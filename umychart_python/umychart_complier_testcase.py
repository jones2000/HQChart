#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


import sys
import codecs
import webbrowser
from umychart_complier_jscomplier import JSComplier, SymbolOption, HQ_DATA_TYPE
from umychart_complier_jscomplier import ScriptIndexConsole, ScriptIndexItem, SymbolOption, RequestOption, HQ_DATA_TYPE, ArgumentItem
from umychart_webtemplate import *
from umychart_complier_pandas_help import JSComplierPandasHelper
from umychart_complier_jssymboldata import JSSymbolData

class TestCase :
    def __init__(self, code, option=SymbolOption()) :
        self.Code=code
        self.Option=option
    def Run(self):
        testCode=''
        for item in self.Code:
            testCode+=item
            testCode+='\n'

        result=JSComplier.Execute(testCode,self.Option)
        return True if result else False 
        

def Test_Tokenize():
    code1='VARHIGH:=IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;'
    code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);'
    tokens=JSComplier.Tokenize(code1+code2)
    return True if tokens else False

def Test_Parse():
    code1='VARHIGH:=IF(VAR1<=REF(HH,-1),REF(H,BARSLAST(VAR1>=REF(HH,1))),DRAWNULL),COLORYELLOW;'
    code2='VAR1=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);'
    ast=JSComplier.Parse(code1+code2)
    return True if ast else False

def Test_REF():
    result=JSComplier.Execute('VAR2:C-REF(O,1)')
    return True if result else False

def Test_Add() :
    result=JSComplier.Execute('VAR2:C+100')
    return True if result else False 

def Test_Multiply():
    code=[
        'VAR2:C*O;', 
        "VAR3:100*100;"
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 


def Test_MAX_MIN():
    code=[
        'VAR2:MAX(C,O);', 
        "VAR3:MAX(C,100);",
        "VAR4:MAX(100,C);",
        'VAR5:MIN(C,O);',
        'VAR5:MIN(C,4);'
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[4]+code[3])
    return True if result else False 

def Test_MA() :
    code=[
        'VAR2:MA(C,5);', 
        'VAR3:MA(C,10);',
        'VAR4:MA(C,15);',
        'VAR4:MA(C,30);', 
        'VAR4:MA(C,33);', 
        ]

    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_EMA():
    code=[
        'VAR2:EMA(C,5);', 
        'VAR3:EMA(C,10);',
        'VAR4:EMA(C,15);',
        'VAR4:EMA(C,30);', 
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_SMA():
    code=[
        'VAR2:SMA(C,5,10);', 
        'VAR3:SMA(C,10,10);',
        'VAR4:SMA(C,15,10);',
        'VAR4:SMA(C,30,10);', 
        ]
    result=JSComplier.Execute(code[0]+code[1]+code[2]+code[3])
    return True if result else False 

def Test_DMA():
    code=[
        'VAR3:C;',
        'VAR2:DMA(C,O/C);', 
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 

def Test_WMA() :
    code=[
        'VAR3:C;',
        'VAR2:WMA(C,20);', 
        ]
    result=JSComplier.Execute(code[0]+code[1])
    return True if result else False 

def Test_SUMBARS() :
    code=[
        'VAR3:SUMBARS(C,O)',
        'VAR2:C;', 
        ]

    option=SymbolOption()
    option.Symbol='000001.sz'
    option.HQDataType=HQ_DATA_TYPE.MINUTE_ID
    result=JSComplier.Execute(code[0]+code[1],option)
    return True if result else False 

def Test_INDEX():
    code=[
        'VAR3:INDEXA;',
        'VAR2:INDEXC;', 
        'VAR2:INDEXO;', 
        ]

    option=SymbolOption()
    option.Period=5

    result=JSComplier.Execute(code[0]+code[1]+code[2],option)
    return True if result else False 

def Test_COUNT():
    code=[
        'VAR3:COUNT(C,5);',
        'VAR2:COUNT(O,10);', 
        'VAR2:COUNT(H,20);', 
        ]

    option=SymbolOption()

    result=JSComplier.Execute(code[0]+code[1]+code[2],option)
    return True if result else False 

def Test_HHV_HHL() :
    case =TestCase(
        code=[
        'VAR3:HHV(C,5);',
        'VAR2:HHV(O,10);', 
        'VAR2:HHV(H,20);', 
        'VAR3:LLV(H,5);',
        'VAR4:LLV(H,10);',
        ])

    result=case.Run()
    return result

def Test_STD():
    case =TestCase(
        code=[
        'VAR3:STD(C,5);',
        'VAR2:STD(O,10);', 
        'VAR2:STD(H,20);', 
        'VAR3:STD(H,15);',
        'VAR4:STD(H,0);',
        ])

    result=case.Run()
    return result

def Test_AVEDEV():
    case =TestCase(
        code=[
        'VAR3:AVEDEV(C,5);',
        'VAR2:AVEDEV(O,10);', 
        'VAR2:AVEDEV(H,20);', 
        'VAR3:AVEDEV(H,15);',
        'VAR4:AVEDEV(H,0);',
        ])

    result=case.Run()
    return result

def Test_CROSS() :
    case =TestCase(
        code=[
        'VAR3:CROSS(C,O);',
        'VAR2:CROSS(O,10);', 
        'VAR2:CROSS(O,C);', 
        ])

    result=case.Run()
    return result

def Test_MULAR() :
    case =TestCase(
        code=[
        'VAR3:MULAR(C,5);',
        'VAR2:MULAR(O,10);', 
        'VAR2:MULAR(O,30);', 
        ])

    result=case.Run()
    return result


def Test_SUM() :
    case =TestCase(
        code=[
        'VAR3:SUM(C,5);',
        'VAR2:SUM(O,0);', 
        'VAR2:BARSCOUNT(O);', 
        ])

    result=case.Run()
    return result


def Test_DEVSQ():
    case =TestCase(
        code=[
        'VAR3:DEVSQ(C,5);',
        'VAR2:DEVSQ(O,0);', 
        'VAR2:DEVSQ(O,5);', 
        ])

    result=case.Run()
    return result

def Test_FINANCE(): # 财务数据测试
    case =TestCase(
        code=[
        'DRAWLINE(HIGH>=HHV(HIGH,20),HIGH,LOW<=LLV(LOW,20),LOW,1);'
        'VAR4:CAPITAL;',
        'VAR3:FINANCE(32);',
        'VAR2:FINANCE(1);', 
        'VAR2:MA(FINANCE(33),5);', 
        "DRAWTEXT(C<=O,O,'xxxx');",
        'STICKLINE(CLOSE>OPEN, CLOSE, OPEN, 0.8, 1);',
        'DRAWNUMBER(CLOSE/OPEN>1.0001,LOW,C);',
        'DRAWNUMBER(CLOSE/OPEN>1.0001,LOW,33);',
        'DRAWICON(CLOSE>OPEN,LOW,1);',
        'PLOYLINE(HIGH>=HHV(HIGH,20),HIGH);',
        'CYW: SUM(VAR4,10)/10000, COLORSTICK;',
        "DRAWCHANNEL(C>O,C,O,'rgb(20,20,20)',1,'3,4','rgb(40,40,40)');",
        'SAR(10,2,20);',
        'BACKSET(CLOSE>OPEN,2);',
        'TT:DYNAINFO(13);',
        'T2:MARGIN(1);',
        'T5:MARGIN(6);',
        "上涨家数:UPCOUNT('CNA.CI'),COLORRED;",
        "下跌家数:DOWNCOUNT('CNA.CI'),COLORGREEN;",
        "TTTT:NEWS(2)+NEWS(4);",
        "TTT2:NEWS(1);",
        'TT4:WINNER(CLOSE);',
        'TT5:COST(10);',
        ])

    result=case.Run()
    return result

# 派生数据类 重写的自己需要数据
class MySymbolData(JSSymbolData):
    pass

# 创建自己的数据类
def CreateMySymbolData(ast, option=None, procThrow=None):
    obj=MySymbolData(ast,option,procThrow)
    return obj


def Test_ScriptIndexConsole():

    # 创建脚本, 及参数
    scpritInfo=ScriptIndexItem(name='我的MA指标', id=888888,
        script=    # 指标脚本代码
            'V9:TROUGHBARS(3,15,1)<10;\n'
'T1:PEAKBARS(3,15,1)<10;\n',
        args=[ ArgumentItem(name='M1', value=5), ArgumentItem(name='M2', value=10), ArgumentItem(name='M3', value=20) ] # 参数
        )

    indexConsole = ScriptIndexConsole(scpritInfo)

    option = SymbolOption(
        symbol='000001.sz',
        right=1, # 复权 0 不复权 1 前复权 2 后复权
        period=0, # 周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
        request=RequestOption(maxDataCount=500,maxMinuteDayCount=3)
        )
    option.ProcCreateSymbolData=CreateMySymbolData
    result=indexConsole.ExecuteScript(option)

    if result.Error :
        print(result.Error)
        return

    print('run successfully.')
    JSComplierPandasHelper.ToDateTimeSeries(result) # 转化为pandas Series 数据格式
    JSComplierPandasHelper.ToDataFrame(result)      # 转化为pandas DataFrame 数据格式

    jsonData=result.ToJson()
    varName='jsonData'  # 数据变量名字
    
    HQChartOption= """g_KLineOption={
            Symbol:'%(symbol)s',    //股票代码
            Right:%(right)d,        //复权
            Period:%(period)d,      //周期

            Windows:
            [
                {   Modify:false,Change:false, 
                    Local: 
                    { 
                        Data:%(varName)s,   //py执行以后的json数据
                        Type:'LocalJsonDataIndex' ,
                        Name:'%(name)s',    //指标名字
                        Args:[              //指标参数
                            { Name: '%(arg1)s', Value: %(argvalue1)d },
                            { Name: '%(arg2)s', Value: %(argvalue2)d },
                            { Name: '%(arg3)s', Value: %(argvalue3)d }]
                    }
                },
                //{Index:"VOL", Modify:false,Change:false},
            ]
        } 
        """ %{"symbol":option.Symbol,'right':option.Right, 'period':option.Period, 'varName':varName, 'name':scpritInfo.Name,
            'arg1':scpritInfo.Arguments[0].Name, 'argvalue1': scpritInfo.Arguments[0].Value,
            'arg2':scpritInfo.Arguments[1].Name, 'argvalue2': scpritInfo.Arguments[1].Value,
            'arg3':scpritInfo.Arguments[2].Name, 'argvalue3': scpritInfo.Arguments[2].Value }

    localJsonData= varName + '=' + jsonData + '\n'
    filePath='data.html'
    # 生成图形化页面
    with codecs.open(filePath,'w',"utf-8") as file:
        file.write(HTML_PART1)
        file.write(localJsonData)
        file.write(HQChartOption)
        file.write(HTML_PART_END)
        file.close()

    webbrowser.open(filePath,new = 1)


#Test_Add()
#Test_Multiply()
#Test_MAX_MIN()
#Test_FINANCE()

Test_ScriptIndexConsole()