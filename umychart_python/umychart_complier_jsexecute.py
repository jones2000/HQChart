######################################################################################
#
#
#
#####################################################################################

import sys
from umychart_complier_scanner import ErrorHandler
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem
from umychart_complier_jsparser import Syntax,BinaryExpression,AssignmentExpression
from umychart_complier_jssymboldata import JSSymbolData, g_JSComplierResource
from umychart_complier_jsalgorithm import JSAlgorithm, JSDraw
from umychart_complier_help import JSComplierHelper

#################################################################################################
#
#   AST执行器
#
#################################################################################################

# 参数结构体
class ArgumentItem :
    def __init__(self, name, value) :
        self.Name=name
        self.Value=value

# 输出变量
class OutVariable:  
    def __init__(self, name, type, data=None, draw=None) :
        self.Name=name
        self.Data=data
        self.Type=type
        self.Draw=draw


class JSExecute :
    def __init__(self, ast, option=None) :
        self.AST=ast   # 语法树

        self.ErrorHandler=ErrorHandler()
        self.VarTable={}           # 变量表
        self.OutVarTable=[]        # 输出变量
        self.Arguments=[]

        # 脚本自动变量表, 只读
        self.ConstVarTable={
            # 个股数据
            'CLOSE':None, 'VOL':None, 'OPEN':None, 'HIGH':None, 'LOW':None, 'AMOUNT':None,
            'C':None, 'V':None, 'O':None, 'H':None, 'L':None, 'VOLR':None,

            # 日期类
            'DATE':None, 'YEAR':None, 'MONTH':None, 'PERIOD':None, 'WEEK':None,

            # 大盘数据
            'INDEXA':None, 'INDEXC':None, 'INDEXH':None, 'INDEXL':None, 'INDEXO':None, 'INDEXV':None, 'INDEXADV':None, 'INDEXDEC':None,

            # 到最后交易日的周期数
            'CURRBARSCOUNT':None,
            # 流通股本（手）
            'CAPITAL':None,
            # 换手率
            'EXCHANGE':None,
            'SETCODE':None  
        }  

        self.SymbolData=JSSymbolData(ast=ast,option=option, procThrow=self.ThrowUnexpectedNode)
        self.Algorithm=JSAlgorithm(errorHandler=self.ErrorHandler,symbolData=self.SymbolData)
        self.Draw=JSDraw(errorHandler=self.ErrorHandler,symbolData=self.SymbolData)
        
        self.JobList=[]    # 执行的任务队列

        if option and option.Arguments:
             self.Arguments=option.Arguments

    def Execute(self) :
        self.SymbolData.RunDownloadJob(self.JobList) # 准备数据
        outVar=self.RunAST()
        return outVar

    def ReadSymbolData(self,name,node) :
        if name in ('CLOSE','C','VOL','V','OPEN','O','HIGH','H','LOW','L','AMOUNT') :
            return self.SymbolData.GetSymbolCacheData(name)
        elif name == 'VOLR' :   # 量比
            pass
            # return self.SymbolData.GetVolRateCacheData(node)
        elif name in ('INDEXA','INDEXC','INDEXH','INDEXO','INDEXV','INDEXL','INDEXADV','INDEXDEC') : # 大盘数据
           return self.SymbolData.GetIndexCacheData(name)
        elif name== 'CURRBARSCOUNT':
            pass
            # return self.SymbolData.GetCurrBarsCount()
        elif name== 'CAPITAL':
            return self.SymbolData.GetFinanceCacheData(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA, node=node)
        elif name== 'EXCHANGE':
            return self.SymbolData.GetFinanceCacheData(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA, node=node)
        elif name== 'SETCODE':
            return self.SymbolData.SETCODE()

        elif name== 'DATE':
            return self.SymbolData.DATE()
        elif name== 'YEAR':
            return self.SymbolData.YEAR()
        elif name== 'MONTH':
            return self.SymbolData.MONTH()
        elif name== 'WEEK':
            return self.SymbolData.WEEK()
        elif name== 'PERIOD':
            return self.SymbolData.PERIOD()

    # 读取变量
    def ReadVariable(self, name,node) :
        if name in self.ConstVarTable :
            data=self.ConstVarTable[name]

            if not data : # 动态加载,用到再加载
                data=self.ReadSymbolData(name,node)
                self.ConstVarTable[name]=data
            return data

        if name in self.VarTable : 
            return self.VarTable[name]

        self.ThrowUnexpectedNode(node, '变量'+name+'不存在')
        return None

    # 单数据转成数组 个数和历史数据一致
    def SingleDataToArrayData(self,value) :
        count=len(self.SymbolData.Data.Data)
        result=[value]*count
        return result

    def RunAST(self) :
        # 预定义的变量
        for item in self.Arguments :
            self.VarTable[item.Name]=item.Value
        
        if not self.AST or not self.AST.Body :
            self.ThrowError()

        for item in self.AST.Body :
            self.VisitNode(item)
            if item.Type==Syntax.ExpressionStatement and item.Expression :
                if item.Expression.Type==Syntax.AssignmentExpression and item.Expression.Operator==':' and item.Expression.Left :
                    assignmentItem=item.Expression
                    varName=assignmentItem.Left.Name
                    outVar=self.VarTable[varName]
                    if not isinstance(outVar, list) : 
                        outVar=self.SingleDataToArrayData(outVar)

                    self.OutVarTable.append(OutVariable(name=varName,data=outVar,type=0))

                elif (item.Expression.Type==Syntax.CallExpression) :
                    callItem=item.Expression
                    if (JSDraw.IsDrawFunction(callItem.Callee.Name)) :
                        draw=callItem.Draw
                        draw.Name=callItem.Callee.Name
                        self.OutVarTable.append(OutVariable(name=draw.Name, draw=draw, type=1))

                elif (item.Expression.Type==Syntax.SequenceExpression) :
                    varName=None
                    draw=None
                    color=None
                    lineWidth=None
                    colorStick=False
                    pointDot=False
                    circleDot=False
                    lineStick=False
                    stick=False
                    volStick=False
                    isShow=True
                    isExData=False
                    for itemExpression in item.Expression.Expression :
                        if (itemExpression.Type==Syntax.AssignmentExpression and itemExpression.Operator==':' and itemExpression.Left) :
                            varName=itemExpression.Left.Name
                            varValue=self.VarTable[varName]
                            if not JSComplierHelper.IsArray(varValue) :
                                varValue=self.SingleDataToArrayData(varValue) 
                                self.VarTable[varName]=varValue            # 把单数值转化成数组放到变量表里
                        
                        elif (itemExpression.Type==Syntax.Identifier) :
                            value=itemExpression.Name
                            if (value=='COLORSTICK') :
                                colorStick=True
                            elif (value=='POINTDOT') :
                                pointDot=True
                            elif (value=='CIRCLEDOT') :
                                circleDot=True
                            elif (value=='LINESTICK') :
                                lineStick=True
                            elif (value=='STICK') :
                                stick=True
                            elif (value=='VOLSTICK') :
                                volStick=True
                            elif (value.find('COLOR')==0) :
                                color=value
                            elif (value.find('LINETHICK')==0) :
                                lineWidth=value
                            elif (value.find('NODRAW')==0) :
                                isShow=False
                            elif (value.find('EXDATA')==0) :
                                isExData=True # 扩展数据, 不显示再图形里面

                        elif (itemExpression.Type==Syntax.Literal) :    #常量
                            aryValue=self.SingleDataToArrayData(itemExpression.Value)
                            varName=str(itemExpression.Value)
                            self.VarTable[varName,aryValue]    # 把常量放到变量表里

                        elif (itemExpression.Type==Syntax.CallExpression and JSDraw.IsDrawFunction(itemExpression.Callee.Name)) :
                            draw=itemExpression.Draw
                            draw.Name=itemExpression.Callee.Name

                    if (pointDot and varName) :  # 圆点
                        outVar=self.VarTable[varName]
                        if (not JSComplierHelper.IsArray(outVar)) :
                            outVar=self.SingleDataToArrayData(outVar)
                        value=OutVariable(name=varName,data=outVar, type=3)
                        value.Radius=2
                        if color :
                            value.Color=color
                        if lineWidth :
                            value.LineWidth=lineWidth
                        self.OutVarTable.append(value)

                    elif (circleDot and varName) :  # 圆点
                        outVar=self.VarTable[varName]
                        if not JSComplierHelper.IsArray(outVar) :
                            outVar=self.SingleDataToArrayData(outVar)
                        value=OutVariable(name=varName,data=outVar, type=3)
                        value.Radius=1.3
                        if color:
                            value.Color=color
                        if lineWidth:
                            value.LineWidth=lineWidth
                        self.OutVarTable.append(value)

                    elif (lineStick and varName) :  # LINESTICK  同时画出柱状线和指标线
                        outVar=self.VarTable[varName]
                        value=OutVariable(name=varName, data=outVar, type=4)
                        if color:
                            value.Color=color
                        if lineWidth:
                            value.LineWidth=lineWidth
                        self.OutVarTable.append(value)
                    
                    elif (stick and varName) : # STICK 画柱状线
                        outVar=self.VarTable[varName]
                        value=OutVariable(name=varName,data=outVar, type=5)
                        if color :
                            value.Color=color
                        if lineWidth :
                            value.LineWidth=lineWidth
                        self.OutVarTable.append(value)
                    
                    elif (volStick and varName) :  # VOLSTICK   画彩色柱状线
                        outVar=self.VarTable[varName]
                        value=OutVariable(name=varName,data=outVar, type=6)
                        if color :
                            value.Color=color
                        self.OutVarTable.append(value)
                    
                    elif (varName and color) :
                        outVar=self.VarTable[varName]
                        if not JSComplierHelper.IsArray(outVar) :
                            outVar=self.SingleDataToArrayData(outVar)
                        value=OutVariable(name=varName,data=outVar, type=0)
                        value.Color=color
                        if (lineWidth) :
                            value.LineWidth=lineWidth
                        if (isShow == False) :
                            value.IsShow = False
                        if (isExData==True) :
                            value.IsExData = True
                        self.OutVarTable.append(value)
                    
                    elif (draw and color) :
                        value=OutVariable(name=draw.Name,data=draw, type=1)
                        value.Color=color
                        self.OutVarTable.append(value)
                    
                    elif (colorStick and varName) : # CYW: SUM(VAR4,10)/10000, COLORSTICK; 画上下柱子
                        outVar=self.VarTable[varName]
                        value=OutVariable(name=varName,data=outVar, type=2)
                        value.Color=color
                        self.OutVarTable.append(value)
                    
                    elif (varName) :
                        outVar=self.VarTable[varName]
                        value=OutVariable(name=varName,data=outVar, type=0)
                        if color :
                            value.Color=color
                        if lineWidth :
                            value.LineWidth=lineWidth
                        if isShow==False :
                            value.IsShow=False
                        if isExData==True :
                            value.IsExData = True
                        self.OutVarTable.append(value)
                    
        return self.OutVarTable


    def VisitNode(self, node) :
        if node.Type==Syntax.SequenceExpression :
            self.VisitSequenceExpression(node)
        elif node.Type==Syntax.ExpressionStatement :
            self.VisitNode(node.Expression)
        elif node.Type==Syntax.AssignmentExpression :
            self.VisitAssignmentExpression(node)
        elif node.Type in (Syntax.BinaryExpression, Syntax.LogicalExpression) :
            self.VisitBinaryExpression(node)
        elif node.Type==Syntax.CallExpression :
            self.VisitCallExpression(node)

    def VisitSequenceExpression(self, node) :
        for item in node.Expression :
            self.VisitNode(item)

    # 函数调用
    def VisitCallExpression(self, node) :
        funcName=node.Callee.Name
        args=[]
        for item in node.Arguments :
            if item.Type==Syntax.BinaryExpression or item.Type==Syntax.LogicalExpression :
                value=self.VisitBinaryExpression(item)
            elif item.Type==Syntax.CallExpression :
                value=self.VisitCallExpression(item)
            else :
                value=self.GetNodeValue(item)
            args.append(value)

        # console.log('[JSExecute::VisitCallExpression]' , funcName, '(', args.toString() ,')');

        if funcName=='DYNAINFO':    # 行情最新数据
            node.Out=self.SymbolData.GetLatestCacheData(int(args[0]))
        elif funcName=='STICKLINE':
            node.Draw=self.Draw.STICKLINE(args[0],args[1],args[2],args[3],args[4])
            node.Out=[]
        elif funcName=='DRAWTEXT':
            node.Draw=self.Draw.DRAWTEXT(args[0],args[1],args[2])
            node.Out=[]
        elif funcName=='SUPERDRAWTEXT':
            node.Draw=self.Draw.SUPERDRAWTEXT(args[0],args[1],args[2],args[3],args[4])
            node.Out=[]
        elif funcName=='DRAWICON':
            node.Draw=self.Draw.DRAWICON(args[0],args[1],int(args[2]))
            node.Out=[]
        elif funcName=='DRAWLINE':
            node.Draw=self.Draw.DRAWLINE(args[0],args[1],args[2],args[3],int(args[4]))
            node.Out=node.Draw.DrawData
        elif funcName=='DRAWBAND':
            node.Draw=self.Draw.DRAWBAND(args[0],args[1],args[2],args[3])
            node.Out=[]
        elif funcName=='DRAWKLINE':
            node.Draw=self.Draw.DRAWKLINE(args[0],args[1],args[2],args[3])
            node.Out=[]
        elif funcName=='DRAWKLINE_IF':
            node.Draw=self.Draw.DRAWKLINE_IF(args[0],args[1],args[2],args[3],args[4])
            node.Out=[]
        elif funcName in ('PLOYLINE','POLYLINE') :
            node.Draw=self.Draw.POLYLINE(args[0],args[1])
            node.Out=node.Draw.DrawData
        elif funcName=='DRAWNUMBER':
            node.Draw=self.Draw.DRAWNUMBER(args[0],args[1],args[2])
            node.Out=node.Draw.DrawData.Value
        elif funcName=="DRAWCHANNEL":
            node.Draw=self.Draw.DRAWCHANNEL(args[0],args[1],args[2],args[3],int(args[4]),args[5],args[6])
            node.Out=[]
        elif funcName=='CODELIKE':
            node.Out=self.SymbolData.CODELIKE(args[0])
        elif funcName=='NAMELIKE':
            node.Out=self.SymbolData.NAMELIKE(args[0])
        elif funcName=='REFDATE':
            node.Out=self.SymbolData.REFDATE(args[0],args[1])
        elif funcName=='FINANCE':
            node.Out=self.SymbolData.GetFinanceCacheData(args[0],node)
        elif funcName=="MARGIN":
            node.Out=self.SymbolData.GetMarginCacheData(int(args[0]),node)
        elif funcName=="HK2SHSZ":
            node.Out=self.SymbolData.GetHKToSHSZCacheData(args[0],node)
        elif funcName=="NEWS":
            node.Out=self.SymbolData.GetNewsAnalysisCacheData(args[0],node)
        elif funcName in ('UPCOUNT','DOWNCOUNT') :
            node.Out=self.SymbolData.GetIndexIncreaseCacheData(funcName,args[0],node)
        else :
            node.Out=self.Algorithm.CallFunction(funcName, args, node)

        return node.Out

    # 赋值
    def VisitAssignmentExpression(self, node) :
        left=node.Left
        if left.Type!=Syntax.Identifier :
            self.ThrowUnexpectedNode(node)

        varName=left.Name
        right=node.Right
        value=None

        if right.Type==Syntax.BinaryExpression or right.Type==Syntax.LogicalExpression :
            value=self.VisitBinaryExpression(right)
        elif right.Type==Syntax.CallExpression :
            value=self.VisitCallExpression(right)
        elif right.Type==Syntax.Literal :
            value=right.Value
        elif right.Type==Syntax.Identifier : # 右值是变量
            value=self.ReadVariable(right.Name,right)

        # console.log('[JSExecute::VisitAssignmentExpression]' , varName, ' = ',value);
        self.VarTable[varName]=value

    # 逻辑运算
    def VisitBinaryExpression(self, node) :
        stack=[]
        stack.append(node)
        temp=None

        while len(stack)!=0 :
            temp=stack[-1]
            if isinstance(temp,(BinaryExpression,AssignmentExpression)) and temp.Left and node!=temp.Left and node!=temp.Right :
                stack.append(temp.Left)
            elif isinstance(temp,(BinaryExpression,AssignmentExpression)) and temp.Right and node!=temp.Right :
                stack.append(temp.Right)
            else :
                value=stack.pop()
                if value.Type==Syntax.BinaryExpression :    # 只遍历操作符就可以
                    leftValue=self.GetNodeValue(value.Left)
                    rightValue=self.GetNodeValue(value.Right)

                    # console.log('[JSExecute::VisitBinaryExpression] BinaryExpression',value , leftValue, rightValue);
                    value.Out=None # 保存中间值

                    if value.Operator=='-':
                        value.Out=self.Algorithm.Subtract(leftValue,rightValue)
                    elif value.Operator=='*':
                        value.Out=self.Algorithm.Multiply(leftValue,rightValue)
                    elif value.Operator== '/':
                        value.Out=self.Algorithm.Divide(leftValue,rightValue)
                    elif value.Operator== '+':
                        value.Out=self.Algorithm.Add(leftValue,rightValue)
                    elif value.Operator== '>':
                        value.Out=self.Algorithm.GT(leftValue,rightValue)
                    elif value.Operator== '>=':
                        value.Out=self.Algorithm.GTE(leftValue,rightValue)
                    elif value.Operator== '<':
                        value.Out=self.Algorithm.LT(leftValue,rightValue)
                    elif value.Operator== '<=':
                        value.Out=self.Algorithm.LTE(leftValue,rightValue)
                    elif value.Operator== '==':
                        value.Out=self.Algorithm.EQ(leftValue,rightValue)
                    elif value.Operator in ('!=','<>') :
                        value.Out=self.Algorithm.NEQ(leftValue,rightValue)

                    # console.log('[JSExecute::VisitBinaryExpression] BinaryExpression',value);
                elif value.Type==Syntax.LogicalExpression :
                    leftValue=self.GetNodeValue(value.Left)
                    rightValue=self.GetNodeValue(value.Right)

                    # console.log('[JSExecute::VisitBinaryExpression] LogicalExpression',value , leftValue, rightValue);
                    value.Out=None # 保存中间值

                    if value.Operator in ('&&','AND') :
                        value.Out=self.Algorithm.And(leftValue,rightValue)
                    elif value.Operator in ('||','OR') :
                        value.Out=self.Algorithm.Or(leftValue,rightValue)

                    # console.log('[JSExecute::VisitBinaryExpression] LogicalExpression',value);
                
                node=temp

        return node.Out

    def GetNodeValue(self, node) :
        if node.Type==Syntax.Literal:    #数字
            return node.Value
        elif node.Type==Syntax.UnaryExpression:
            if node.Operator=='-' :
                value=self.GetNodeValue(node.Argument)
                return self.Algorithm.Subtract(0,value)
            return node.Argument.Value
        elif node.Type==Syntax.Identifier:
            value=self.ReadVariable(node.Name,node)
            return value
        elif node.Type in (Syntax.BinaryExpression,Syntax.LogicalExpression) :
            return node.Out
        elif node.Type==Syntax.CallExpression:
            return self.VisitCallExpression(node)
        else :
            self.ThrowUnexpectedNode(node)


    def ThrowUnexpectedNode(self, node,message="执行异常") :
        marker=node.Marker
        msg=message
       
        return self.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg)
       

    def ThrowError(self) :
        pass
