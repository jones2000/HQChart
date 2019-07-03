import sys
from umychart_complier_scanner import Error
from umychart_complier_jsparser import JSParser, Tokenizer
from umychart_complier_jssymboldata import g_JSComplierResource
from umychart_complier_jsexecute import JSExecute
from umychart_complier_job import SymbolOption
from umychart_complier_job import HQ_DATA_TYPE
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


