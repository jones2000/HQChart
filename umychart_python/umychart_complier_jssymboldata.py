#####################################################################
#
#   股票数据类
#
#####################################################################

import sys
import requests     # 网络数据下载
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem
from umychart_complier_data import ChartData,HistoryData

# 全局api域名变量
class JSComplierResource :
    def __init__(self) :
        self.Domain = "https://opensource.zealink.com"               # API域名  
        self.CacheDomain = "https://opensourcecache.zealink.com"     # 缓存域名

g_JSComplierResource=JSComplierResource()

class JSSymbolData() :
    def __init__(self, ast, option=None) :
        self.AST=ast              # 语法树

        self.Symbol='600000.sh'
        self.Name=None
        self.Data=None             # 个股数据 (ChartData)
        self.SourceData=None       # 不复权的个股数据 (ChartData)
        self.MarketValue=None      # 总市值
        self.Period=5              # 周期
        self.Right=2               # 复权
        self.DataType=0            # 默认K线数据 2=分钟走势图数据 3=多日分钟走势图

        self.MaxRequestDataCount=1000   # 读取日线数据天数
        self.MaxRequestMinuteDayCount=5 # 读取分钟数据天数

        self.KLineApiUrl= g_JSComplierResource.Domain+"/API/KLine2"                   # 日线
        self.MinuteKLineApiUrl= g_JSComplierResource.Domain+'/API/KLine3'             # 分钟K线
        self.RealtimeApiUrl= g_JSComplierResource.Domain+'/API/stock'                 # 实时行情

    # 准备数据
    def RunDownloadJob(self, jobList) :
        for job in jobList :
            if job.ID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA :
                self.GetSymbolData()
    
    # 下载股票数据
    def GetSymbolData(self) :
        if self.Data:
            return
        if self.Period<=3 : # 请求日线数据
            url=self.KLineApiUrl
            postData={
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol",'up','down','stop','unchanged'],
                    "symbol": [self.Symbol],
                    "start": -1,
                    "count": self.MaxRequestDataCount
                }
            print('[JSSymbolData::GetSymbolData] ',self.Period,  url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToHistoryData(jsonData)
            self.SourceData=ChartData(data=data,dataType=self.DataType)
            self.Data=ChartData(data=data, dataType=self.DataType)
            if self.Right>0 :    # 复权
                rightData=self.Data.GetRightDate(self.Right)
                self.Data.Data=rightData

            if self.Period>0 and self.Period<=3 :   # 周期数据
                periodData=self.Data.GetPeriodData(self.Period)
                self.Data.Data=periodData

            self.Data.Right=self.Right
            self.Data.Period=self.Period
            self.Name=jsonData['name']
            
        else :
            url=self.MinuteKLineApiUrl
            postData= {
                "field": ["name","symbol","yclose","open","price","high","low","vol"],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxRequestMinuteDayCount
            }
            print('[JSSymbolData::GetSymbolData] ',self.Period,  url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToMinuteHistoryData(jsonData)
            self.SourceData=ChartData(data=data,dataType=self.DataType)
            self.Data=ChartData(data=data, dataType=self.DataType)

            if self.Period>=5:   # 周期数据
                periodData=self.Data.GetPeriodData(self.Period)
                self.Data.Data=periodData

            self.Data.Period=self.Period
            self.Name=jsonData['name']

    @staticmethod # 日线数据转类
    def JsonDataToHistoryData(data) :
        list = data['data']
        aryDayData=[]
        date = 0
        yclose = 1
        open = 2
        high = 3
        low = 4
        close = 5
        vol = 6
        amount = 7
        up=8
        down=9
        stop=10 
        unchanged=11
        for item in list :
            if item[open]<=0 :  #停牌的数据剔除
                continue
            kData=HistoryData()
            kData.Date = item[date]
            kData.Open = item[open]
            kData.YClose =item[yclose]
            kData.Close = item[close]
            kData.High = item[high]
            kData.Low = item[low]
            kData.Vol = item[vol]    # 原始单位股
            kData.Amount = item[amount]

            # 上涨 下跌家数
            fieldCount=len(item)
            if fieldCount>up :
                kData.Up=item[up]
            if fieldCount>down :
                kData.Down=item[down]
            if fieldCount>stop :
                kData.Stop=item[stop]
            if fieldCount>unchanged :
                kData.Unchanged=item[unchanged]

            aryDayData.append(kData)
            
        return aryDayData


    @staticmethod # 1分钟K线数据转类
    def JsonDataToMinuteHistoryData(data):
        list = data['data']
        aryDayData=[]
        date = 0
        yclose = 1
        open = 2
        high = 3
        low = 4
        close = 5
        vol = 6
        amount = 7
        time = 8
        for item in list :
            kData = HistoryData()

            kData.Date = item[date]
            kData.Time=item[time]
            kData.Open = item[open]
            kData.YClose = item[yclose]
            kData.Close = item[close]
            kData.High = item[high]
            kData.Low = item[low]
            kData.Vol = item[vol]    # 原始单位股
            kData.Amount = item[amount]
            
            aryDayData.append(kData)

        # 无效数据处理
        for i, minData in enumerate(aryDayData) :
            if not minData.IsVaild(5):
                if i == 0 :
                    if minData.YClose > 0:
                        minData.Open = minData.YClose
                        minData.High = minData.YClose
                        minData.Low = minData.YClose
                        minData.Close = minData.YClose
                else : # 用前一个有效数据填充
                    for j in range(i-1,-1,-1) :
                        minData2 = aryDayData[j]
                        if minData2.IsVaild(4) :
                            if minData.YClose<=0 or minData.YClose==None:
                                minData.YClose = minData2.Close
                            minData.Open = minData2.Open
                            minData.High = minData2.High
                            minData.Low = minData2.Low
                            minData.Close = minData2.Close
                            break
        return aryDayData


    def GetSymbolCacheData(self, dataName) :
        if not self.Data :
            return []

        if dataName in ('CLOSE','C') :
            return self.Data.GetClose()
        elif dataName in ('VOL', 'V') :
            return self.Data.GetVol()
        elif dataName in ('OPEN', 'O') :
            return self.Data.GetOpen()
        elif dataName in ('HIGH', 'H') :
            return self.Data.GetHigh()
        elif dataName in ('LOW', 'AMOUNT') :
            return self.Data.GetLow()
        elif dataName in ('AMOUNT') :
            return self.Data.GetAmount()

    # CODELIKE 模糊股票代码
    def CODELIKE(self, value) :
        if self.Symbol and self.Symbol.find(value)==0 :
            return 1
        return 0
    
    def NAMELIKE(self, value) :
        if self.Name and self.Name.find(value)==0 :
            return 1
        return 0

    
    # SETCODE 市场类型
    # 0:深圳 1:上海,47:中金所期货 28:郑州商品 29:大连商品 30:上海商品,27:香港指数 31:香港主板,48:香港创业板... 
    def SETCODE(self) :
        if '.sh' in self.Symbol :
            return 1
        if '.sz' in self.Symbol :
            return 0
        return 0

    def DATE(self) :
        result=[]
        if not self.Data :
            return result
        return self.Data.GetDate()

    def YEAR(self) :
        result=[]
        if not self.Data :
            return result
        return self.Data.GetYear()

    def MONTH(self) :
        result=[]
        if not self.Data :
            return result
        return self.Data.GetMonth()

    def WEEK(self) :
        result=[]
        if not self.Data :
            return result
        return self.Data.GetWeek()

    # 用法:结果从0到11,依次分别是1/5/15/30/60分钟,日/周/月,多分钟,多日,季,年
    def PERIOD(self) :
        # Period周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
        PERIOD_MAP=[5,6,7,11, 0,1,2,3,4,5]
        return PERIOD_MAP[self.Period]
