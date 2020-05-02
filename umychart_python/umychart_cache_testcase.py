#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


import sys
import codecs
from umychart_complier_jscomplier import JSComplier, SymbolOption, HQ_DATA_TYPE
from umychart_complier_data import PERIOD_ID
from umychart_complier_jscomplier import ScriptIndexConsole, ScriptIndexItem, SymbolOption, RequestOption, HQ_DATA_TYPE, ArgumentItem
from umychart_complier_pandas_help import JSComplierPandasHelper
from umychart_complier_jssymboldata import JSSymbolData
from umychart_complier_jssymboldata_cache import SymbolDataCache



# 加载自己的外部数据
def LoadCacheData(symbolData):
    print("[LoadCacheData] start load [{0},Period={1},Right={2}] cache to hqchart".format(symbolData.Symbol, symbolData.Period, symbolData.Right))

    # 对应股票的K线数据 (必须设置)
    symbolData.Data.Data['CLOSE']=[10, 11, 10.3, 11.2, 11.3, 10.3, 10.4]
    symbolData.Data.Data['DATE']=[20200413, 20200414, 20200415, 20200416, 20200417, 20200418, 20200419]

    # 财务数据
    #FINANCE(7)
    symbolData.FinanceData[7]=[110, 121, 140.3, 161.2, 181.3, 110.3, 120.4]

    # 大盘数据 数据要和对应这个股票的日期对应上
    symbolData.IndexData.Data["CLOSE"]=[210, 211, 210.3, 211.2, 211.3, 210.3, 210.4]

    # 最新行情
    # DYNAINFO(4) 
    symbolData.LatestKCache[4]=15
    pass

def ToScprit(code):
    scprit=""
    for item in code:
        scprit+=item
        scprit+='\n'
    return scprit

def RunTestCase():

    SymbolDataCache.LoadCallback=LoadCacheData

    name='测试脚本'

    # 指标脚本代码
    code=[
        "T1:INDEXC;",
        "T3:FINANCE(7);",
        "T2:C;",
        "T4:DYNAINFO(4);"
    ]
    script=ToScprit(code)

    # 参数
    args=[ ArgumentItem(name='M1', value=5), ArgumentItem(name='M2', value=10), ArgumentItem(name='M3', value=20)] 

    scpritInfo=ScriptIndexItem(name=name, id=888888, script=script, args=args)
    indexConsole = ScriptIndexConsole(scpritInfo)
    
    option = SymbolOption(
        symbol='600000.sh',
        right=1, # 复权 0 不复权 1 前复权 2 后复权
        period=PERIOD_ID.DAY, # 周期
        request=RequestOption(maxDataCount=500,maxMinuteDayCount=3)
        )

    # 替换成自己的数据类
    option.ProcCreateSymbolData=SymbolDataCache.Create  
    result=indexConsole.ExecuteScript(option)

    return result




RunTestCase()