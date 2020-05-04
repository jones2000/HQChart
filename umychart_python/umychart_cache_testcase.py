#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


import sys
import codecs
import time
import numpy as np
from umychart_complier_jscomplier import JSComplier, SymbolOption, HQ_DATA_TYPE
from umychart_complier_data import PERIOD_ID
from umychart_complier_jscomplier import ScriptIndexConsole, ScriptIndexItem, SymbolOption, RequestOption, HQ_DATA_TYPE, ArgumentItem
from umychart_complier_pandas_help import JSComplierPandasHelper
from umychart_complier_jssymboldata import JSSymbolData
from umychart_complier_jssymboldata_cache import SymbolDataCache

# 单个股票的数据都放这里, 脚本执行的时候直接读这里的数据
class CacheItem():
    def __init__(self, symbol) :
        self.Symbol=symbol
        self.KData=None # K线数据

    # 加载数据
    def Load(self):
        data = np.array([
            (20200326, 3.5, 3.51, 3.53, 3.49, 85418999.0),
            (20200327, 3.53, 3.52, 3.54, 3.51, 70252329.0),
            (20200330, 3.51, 3.52, 3.52, 3.5, 81439044.0),
            (20200331, 3.53, 3.48, 3.54, 3.48, 69618442.0),
            (20200401, 3.49, 3.48, 3.51, 3.48, 66160346.0),
            (20200402, 3.47, 3.5, 3.5, 3.46, 74938267.0),
            (20200403, 3.49, 3.49, 3.5, 3.48, 56193251.0),
            (20200407, 3.52, 3.51, 3.53, 3.5, 82141037.0),
            (20200408, 3.5, 3.49, 3.5, 3.48, 55274495.0),
            (20200409, 3.5, 3.49, 3.5, 3.49, 35858062.0)])
        self.KData=data


# 管理所有的股票缓存数据
class CacheData:
    Cache={} # 数据缓存

    @staticmethod
    def Load():
       arySymbol=['600000.sh','000001.sz']
       for item in arySymbol:
           stock=CacheItem(item)
           stock.Load()
           CacheData.Cache[item]=stock

    @staticmethod
    def LoadCacheData(symbolData) : # 加载自己的外部数据
        print("[CacheData::LoadCacheData] start load [{0},Period={1},Right={2}] cache to hqchart".format(symbolData.Symbol, symbolData.Period, symbolData.Right))
        if (not symbolData.Symbol in CacheData.Cache.keys()) :
            # 报错缓存里面没这个股票数据
            return 

        stock=CacheData.Cache[symbolData.Symbol]
        kData=stock.KData
        aryDate=list(kData[:, 0]) # !! 有问题 怎么是小数的 要转成int才可以
        aryOpen = list(kData[:, 1])
        aryHigh = list(kData[:, 3])
        aryLow = list(kData[:, 4])
        aryClose = list(kData[:, 2])
        aryVol = list(kData[:, 5])

        # 对应股票的K线数据 (必须设置)
        symbolData.Data.Data['CLOSE']=aryClose
        symbolData.Data.Data['DATE']=aryDate
        symbolData.Data.Data['VOL']=aryVol
        symbolData.Data.Data['LOW']=aryLow
        symbolData.Data.Data['HIGH']=aryHigh
        symbolData.Data.Data['OPEN']=aryOpen
        symbolData.Data.Data['AMOUNT']=aryVol

        # 财务数据
        #FINANCE(7)
        symbolData.FinanceData[7]=[14922777132.0, 114922777132.021, 14922777132.0, 14922777132.0, 14922777132.0, 
            21618279922.0, 14922777132.3, 14922777132.0, 21618279922.0, 21618279922.0]

        # 大盘数据 数据要和对应这个股票的日期对应上
        symbolData.IndexData.Data["CLOSE"]=[210, 211, 210.3, 211.2, 211.3, 210.3, 210.4]

        # 最新行情
        # DYNAINFO(4) 
        symbolData.LatestKCache[4]=15  # 最新行情单值

        pass




MACD_INDEX = '''
DIF:=EMA(C,12)-EMA(C,26);
DEA:=EMA(DIF,9);
MACD:(DIF-DEA)*2;
'''

TEST_INDEX = '''
T17:CURRBARSCOUNT;
T16:PEAKBARS(0,5,1);
T15:TROUGHBARS(2,5,2);
T14:ZIG(3,5);
T13:COSTEX(CLOSE,REF(CLOSE,1));
T12:PPART(5);
T11:COST(10);
T0:WINNER(CLOSE);
//T1:INDEXC;
T3:FINANCE(7);
T2:C;
T4:DYNAINFO(4);
T5:-5;
T6:-C;
'''

def RunTestCase():

    SymbolDataCache.LoadCallback=CacheData.LoadCacheData  # 设置第3放数据加载回调

    name='测试脚本'

    # 指标脚本代码
    script=TEST_INDEX

    # 参数
    args=[ ArgumentItem(name='M1', value=5), ArgumentItem(name='M2', value=10), ArgumentItem(name='M3', value=20)] 

    scpritInfo=ScriptIndexItem(name=name, id=888888, script=script, args=args)
    indexConsole = ScriptIndexConsole(scpritInfo)

    arySymbol=['600000.sh','000001.sz'] # 要执行策略的股票池
    aryResult=[] # 结果数据

    runTime=time.time()

    for item in arySymbol :
        startTime = time.time()
        option = SymbolOption(
            symbol=item,
            right=1, # 复权 0 不复权 1 前复权 2 后复权
            period=PERIOD_ID.DAY, # 周期
            request=RequestOption(maxDataCount=500,maxMinuteDayCount=3)
            )

        # 替换成自己的数据类
        option.ProcCreateSymbolData=SymbolDataCache.Create  
        result=indexConsole.ExecuteScript(option,False) # 使用缓存的AST执行
        endTime = time.time()

        print("[RunTestCase] 股票:{0} 耗时:{1}".format(item, endTime - startTime))

        aryResult.append(result)

    print("[RunTestCase] 股票个数:{0} 耗时:{1}".format(len(arySymbol), time.time() - runTime))

    return aryResult


CacheData.Load()    # 加载股票数据到内存

RunTestCase()