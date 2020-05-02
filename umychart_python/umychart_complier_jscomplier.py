#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


import sys
import json
from umychart_complier_scanner import Error
from umychart_complier_jsparser import JSParser, Tokenizer
from umychart_complier_jssymboldata import g_JSComplierResource
from umychart_complier_jsexecute import JSExecute , ArgumentItem
from umychart_complier_job import SymbolOption ,RequestOption ,HQ_DATA_TYPE
from umychart_complier_help import Variant
#################################################################################################
#
#
#
##################################################################################################



class JSComplier:
    @staticmethod   # 词法分析
    def Tokenize(code):
        print ('[JSComplier::Tokenize] ', code)
        tokenizer=Tokenizer(code)
        tokens=[]
        try:
            while True :
                token=tokenizer.GetNextToken()
                if not token:
                    break

                tokens.append(token)
        except Error as e:
            print ('[JSComplier::Tokenize] Error', e)

        return tokens

    @staticmethod   #语法解析 生成抽象语法树(Abstract Syntax Tree)
    def Parse(code):
        print('[JSComplier::Parse]', code)

        parser=JSParser(code)
        parser.Initialize()
        program=parser.ParseScript()
        ast=program
        return ast

    @staticmethod   #执行器
    def Execute(code,option=SymbolOption()) :
        print('[JSComplier::Execute] ', code)
        parser=JSParser(code)
        parser.Initialize()
        program=parser.ParseScript()
        ast=program
        print('[JSComplier.Execute] parser finish.')

        execute=JSExecute(ast,option)
        execute.JobList=parser.Node.GetDataJobList()
        result=execute.Execute()

        print('[JSComplier.Execute] execute finish.')
        return result

    @staticmethod   # 修改API地址
    def SetDomain(domain=None, cacheDomain=None) :
        if domain:
            g_JSComplierResource.Domain = domain
        if cacheDomain:
            g_JSComplierResource.CacheDomain = cacheDomain


# 指标信息
class ScriptIndexItem:
    def __init__(self, name, id, script, args=[]) :
        self.Name=name  #指标名字 ,
        self.ID=id      #指标ID
        self.Script=script  #指标脚本
        self.Arguments=args #指标参数  ArgumentItem 数组

class StockInfo :
    def __init__(self, name=None, symbol=None) :
        self.Name=name
        self.Symbol=symbol

class IndexResult:
    def __init__(self, error=None, outVar=None) :
        self.Error=error
        self.OutVar=outVar
        self.Stock=None
        self.Date=None
        self.Time=None

    # 把返回的结果转换成json格式
    def ToJson(self) : 
        try :
            jsonData=json.dumps(self, default=lambda obj:obj.__dict__)    # ScriptIndexConsole.Serializable)
            return jsonData
            # with open('data.txt','w') as file:
            #     file.write(jsonData)
        except BaseException as error :
            print(error)

class ScriptIndexConsole:
    def __init__(self, obj) : # obj = ScriptIndexItem()
        self.Script=obj.Script
        self.ID=obj.ID
        self.Arguments=obj.Arguments    # 指标默认参数
        self.Name=obj.Name
        self.OutVar=None
        self.AST=None           # 语法树
        self.Parser=None

    def ExecuteScript(self, obj=SymbolOption(), rebuild=True) : # rebuild 是否重新编译执行
        try :
            print('[ScriptIndexConsole::ExecuteScript] ', self.Script)
            if (self.AST and self.Parser and rebuild==False):
                parser=self.Parser
                ast= self.AST
                print('[ScriptIndexConsole.ExecuteScript] use cache ast.')
            else :
                parser=JSParser(self.Script)
                parser.Initialize()
                program=parser.ParseScript()
                ast=program
                self.AST=ast        #缓存语法树
                self.Parser=parser
                print('[ScriptIndexConsole.ExecuteScript] parser finish.')

            option=SymbolOption(symbol=obj.Symbol, hqDataType=obj.HQDataType, right=obj.Right, period=obj.Period, 
                    request=RequestOption(maxDataCount=obj.MaxRequestDataCount, maxMinuteDayCount=obj.MaxRequestMinuteDayCount), 
                    args=self.Arguments if obj.Arguments==None else obj.Arguments) # 个股指定指标参数优先使用
            
            if obj and obj.ProcCreateSymbolData:
                option.ProcCreateSymbolData=obj.ProcCreateSymbolData

            execute=JSExecute(ast,option)
            execute.JobList=parser.Node.GetDataJobList()
            outVar=execute.Execute() 
            print('[ScriptIndexConsole.ExecuteScript]  execute finish.')

            result=IndexResult(outVar=outVar)
            result.Stock=StockInfo(name=execute.SymbolData.Name, symbol=execute.SymbolData.Symbol)  # 股票信息
            result.Date=execute.SymbolData.Data.GetDate()   # 数据对应的日期
            if (obj.HQDataType==HQ_DATA_TYPE.KLINE_ID and obj.Period>=4) :
                result.Time=execute.SymbolData.Data.GetTime()   # 数据对应的时间

            return result
        except Error as error :
            result=IndexResult(error=error)
            return result

        except ValueError as error:
            result=IndexResult(error=error)
            return result
        
        except BaseException as error :
            result=IndexResult(error=error)
            return result

    @staticmethod   # 把返回的结果转换成json格式
    def ToJson(data) : 
        try :
            jsonData=json.dumps(data, default=lambda obj:obj.__dict__)    # ScriptIndexConsole.Serializable)
            return jsonData
            # with open('data.txt','w') as file:
            #     file.write(jsonData)
        except BaseException as error :
            print(error)



