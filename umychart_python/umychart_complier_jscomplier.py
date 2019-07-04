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


class ScriptIndexConsole:
    def __init__(self, obj) : # obj = ScriptIndexItem()
        self.Script=obj.Script
        self.ID=obj.ID
        self.Arguments=obj.Arguments    # 指标默认参数
        self.Name=obj.Name
        self.OutVar=None

    def ExecuteScript(self, obj=SymbolOption()) :
        try :
            print('[ScriptIndexConsole::ExecuteScript] ', self.Script)
            parser=JSParser(self.Script)
            parser.Initialize()
            program=parser.ParseScript()
            ast=program
            print('[ScriptIndexConsole.ExecuteScript] parser finish.')

            option=SymbolOption(symbol=obj.Symbol, hqDataType=obj.HQDataType, right=obj.Right, period=obj.Period, 
                    reqeust=RequestOption(maxDataCount=obj.MaxRequestDataCount, maxMinuteDayCount=obj.MaxRequestMinuteDayCount), 
                    args=self.Arguments if obj.Arguments==None else obj.Arguments) # 个股指定指标参数优先使用
            
            execute=JSExecute(ast,option)
            execute.JobList=parser.Node.GetDataJobList()
            result=Variant()
            result.Stock=Variant()
            result.OutVar=execute.Execute()
            print('[ScriptIndexConsole.ExecuteScript]  execute finish.')

            # 股票信息
            result.Stock.Name=execute.SymbolData.Name
            result.Stock.Symbol=execute.SymbolData.Symbol

            result.Date=execute.SymbolData.Data.GetDate()   # 数据对应的日期
            if (obj.HQDataType==HQ_DATA_TYPE.KLINE_ID) :
                result.Time=execute.SymbolData.Data.GetTime()   # 数据对应的时间

            return result
        except Error as error :
           ErrorInfo=Variant()
           ErrorInfo.Error=error
           return ErrorInfo

        except ValueError as error:
            ErrorInfo=Variant()
            ErrorInfo.Error=error
            return ErrorInfo
        
        except BaseException as error :
            ErrorInfo=Variant()
            ErrorInfo.Error=error
            return ErrorInfo



