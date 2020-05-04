#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


#####################################################################
#
#   股票数据类(读取缓存数据)
#   禁用所有数据下载, 数据直接读缓存
#
#####################################################################
import json
from umychart_complier_jssymboldata import JSSymbolData
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem, HQ_DATA_TYPE,SymbolOption
from umychart_complier_data import ChartData, HistoryData, MinuteData, SingleData
from umychart_complier_help  import JSComplierHelper, Variant

class ChartDataCache():
    def __init__(self) :
        self.Data={}  # key = CLOSE|OPEN|HIGH|LOW|AMOUNT|VOL
    
    def GetCount(self):
        return len(self.GetClose())

    # 获取最大最小值
    def GetMaxMin(self):
        aryHigh=self.GetHigh()
        aryLow=self.GetLow()
        dMaxPrice=aryHigh[0]
        dMinPrice=aryLow[0]
        for i in range(len(aryHigh)) :
            itemHigh=aryHigh[i]
            itemLow=aryLow[i]
            dMinPrice = min(dMinPrice,itemLow)
            dMaxPrice = max(dMaxPrice,itemHigh)
        return {"Max":dMaxPrice, "Min":dMinPrice}
        
    def GetItem(self,index):
        item=Variant()
        item.Date=self.GetDate()[index]
        item.Close=self.GetClose()[index]
        item.Open=self.GetOpen()[index]
        item.High=self.GetHigh()[index]
        item.Low=self.GetLow()[index]
        item.Vol=self.GetVol()[index]
        item.Amount=self.GetAmount()[index]
        if ("TIME" in self.Data.keys()) :
            item.Time=self.GetTime()[index]
            
        return item

    def GetClose(self) :
        return self.Data.get("CLOSE",[])
    
    def GetYClose(self):
        return self.Data.get("YCLOSE",[])

    def GetHigh(self) :
        return self.Data.get("HIGH",[])

    def GetLow(self) :
       return self.Data.get("LOW",[])

    def GetOpen(self) :
        return self.Data.get("OPEN",[])

    def GetVol(self) :
        return self.Data.get("VOL",[])

    def GetAmount(self) :
        return self.Data.get("AMOUNT",[])

    def GetUp(self) :   # 上涨家数
        return self.Data.get("ADVANCE",[])

    def GetDown(self) : # 下跌家数
        return self.Data.get("DECLINE",[])

    def GetYear(self) :
        return self.Data.get("YEAR",[])

    def GetMonth(self) :
        return self.Data.get("MONTH",[])

    def GetDate(self) :
        return self.Data.get("DATE",[])

    def GetTime(self) :
        return self.Data.get("TIME",[])

    def GetWeek(self) :
        return self.Data.get("WEEK",[])

class SymbolDataCache(JSSymbolData):
    LoadCallback:None # 外部数据加载回调

    def __init__(self, ast, option=SymbolOption(), procThrow=None):
        super(SymbolDataCache, self).__init__(ast=ast, option=option, procThrow=procThrow)
        # 使用基类变量
        self.Data=ChartDataCache()          # K线数据
        self.IndexData=ChartDataCache()     # 大盘数据
        self.FinanceData={}                 # 财务数据

        self.LatestKCache={}                # 最新行情

    @staticmethod # 创建函数,静态
    def Create(ast, option=None, procThrow=None):
        obj=SymbolDataCache(ast,option,procThrow)
        if SymbolDataCache.LoadCallback :
            SymbolDataCache.LoadCallback(obj)
        return obj

    # 下载股票数据
    def GetSymbolData(self) :
        pass

    # 下载最新行情
    def GetLatestData(self) :
        pass

    # 下载财务数据
    def GetFinanceData(self, jobID, job) :
        pass

    # 获取大盘指数数据
    def GetIndexData(self) :
        pass

    # 最新行情
    def GetLatestCacheData(self, dataName) :
        if (not dataName in self.LatestKCache.keys()) :
            print("[SymbolDataCache::GetLatestCacheData] can't find {0} in LatestKCache",dataName )
            return None

        return self.LatestKCache.get(dataName)