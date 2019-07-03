#####################################################################
#
#   股票数据类
#
#####################################################################

import sys
import requests     # 网络数据下载
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem, HQ_DATA_TYPE,SymbolOption
from umychart_complier_data import ChartData, HistoryData, MinuteData, SingleData
from umychart_complier_help  import JSComplierHelper

# 全局api域名变量
class JSComplierResource :
    def __init__(self) :
        self.Domain = "https://opensource.zealink.com"               # API域名  
        self.CacheDomain = "https://opensourcecache.zealink.com"     # 缓存域名

g_JSComplierResource=JSComplierResource()

#股票财务数据
class FinanceData :
    def __init__(self, date=None, finance=None,announcement=None) :
        self.Date=date          # 日期
        self.Finance=finance    # 数据  (可以是一个数组)
        self.Announcement=announcement

    def Get(self, name) :
        if not self.Finance :
            return None
        if not JSComplierHelper.IsJsonNumber(self.Finance,name) :
            return None

        value=self.Finance[name]
        return value


class JSSymbolData() :
    def __init__(self, ast, option=SymbolOption(), procThrow=None) :
        self.AST=ast              # 语法树

        self.Symbol=option.Symbol
        self.Name=None
        self.Data=None             # 个股数据 (ChartData)
        self.SourceData=None       # 不复权的个股数据 (ChartData)
        self.MarketValue=None      # 总市值
        self.Period=option.Period  # 周期
        self.Right=option.Right    # 复权
        self.DataType=option.HQDataType            # 默认K线数据 2=分钟走势图数据 3=多日分钟走势图
        self.ThrowUnexpectedNode=procThrow         # 抛异常

        self.IndexData=None            # 大盘指数
        self.FinanceData={}            # 财务数据
        self.MarketValue=None          # 市值

        self.MaxRequestDataCount=option.MaxRequestDataCount   # 读取日线数据天数
        self.MaxRequestMinuteDayCount=option.MaxRequestMinuteDayCount # 读取分钟数据天数

        self.KLineApiUrl= g_JSComplierResource.Domain+"/API/KLine2"                   # 日线
        self.MinuteKLineApiUrl= g_JSComplierResource.Domain+'/API/KLine3'             # 分钟K线
        self.RealtimeApiUrl= g_JSComplierResource.Domain+'/API/stock'                 # 实时行情
        self.StockHistoryDayApiUrl= g_JSComplierResource.Domain+'/API/StockHistoryDay'  # 历史财务数据


    # 准备数据
    def RunDownloadJob(self, jobList) :
        self.GetSymbolData()    # 先下载个股的数据

        for job in jobList :
            if job.ID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_DATA :
                self.GetSymbolData()
            elif job.ID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_DATA :
                self.GetIndexData()
            elif job.ID in (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA,JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA
                            ) :
                self.GetFinanceData(job.ID) 


    # 下载股票数据
    def GetSymbolData(self) :
        if self.Data:
            return
        
        if self.DataType==HQ_DATA_TYPE.MINUTE_ID:  # 当天分钟数据
            url=self.RealtimeApiUrl
            postData={
                    "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","minute","time","minutecount"],
                    "symbol": [self.Symbol],
                    "start": -1
                }
            print('[JSSymbolData::GetSymbolData] Download minute ',url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToMinuteData(jsonData)
            self.SourceData=ChartData(data=data,dataType=self.DataType)
            self.Data=ChartData(data=data,dataType=self.DataType)
            self.Name=jsonData['stock'][0]['name']
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

    @staticmethod    # 走势图分钟数据 转化为array[]
    def JsonDataToMinuteData(data) :
        aryMinuteData=[]
        stockData=data['stock'][0]
        minuteData=stockData['minute']

        for i in range(len(minuteData)) :
            jsData=minuteData[i]

            item=MinuteData()
            item.Close=jsData['price']
            item.Open=jsData['open']
            item.High=jsData['high']
            item.Low=jsData['low']
            item.Vol=jsData['vol']     # 股
            item.Amount=jsData['amount']

            if i==0 :      # 第1个数据 写死9：25
                item.DateTime=str(stockData['date']) + " 0925"
            else :
                item.DateTime=str(stockData['date']) + " " +str(jsData['time'])

            item.Increase=jsData['increase']
            item.Risefall=jsData['risefall']
            item.AvPrice=jsData['avprice']

            aryMinuteData.append(item)

        return aryMinuteData

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


    # 获取大盘指数数据
    def GetIndexData(self) :
        if self.IndexData :
            return

        if self.DataType==HQ_DATA_TYPE.MINUTE_ID:  # 当天分钟数据
            url=self.RealtimeApiUrl
            postData={
                    "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","minute","time","minutecount"],
                    "symbol": ['000001.sh'],
                    "start": -1
                }

            print('[JSSymbolData::GetIndexData] Download minute ',url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToMinuteData(jsonData)
            self.IndexData=ChartData(data=data,dataType=self.DataType)
            return

        if self.Period<=3 : # 请求日线数据
            url=self.KLineApiUrl
            postData={
                    "field": [ "name", "symbol","yclose","open","price","high","low","vol",'up','down','stop','unchanged'],
                    "symbol": ['000001.sh'],
                    "start": -1,
                    "count": self.MaxRequestDataCount+200  # 多请求点的数据 确保股票剔除停牌日期以后可以对上
                }
            print('[JSSymbolData::GetIndexData] ',self.Period,  url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToHistoryData(jsonData)
            self.IndexData=ChartData(data=data, dataType=self.DataType)

            aryOverlayData=self.SourceData.GetOverlayData(self.IndexData.Data)      # 和主图数据拟合以后的数据
            self.IndexData.Data=aryOverlayData

            if self.Period>0 and self.Period<=3 :   # 周期数据
                periodData=self.IndexData.GetPeriodData(self.Period)
                self.IndexData.Data=periodData
            
            self.IndexData.Period=self.Period
        else :
            url=self.MinuteKLineApiUrl
            postData= {
                "field": ["name","symbol","yclose","open","price","high","low","vol"],
                "symbol": '000001.sh',
                "start": -1,
                "count": self.MaxRequestMinuteDayCount+5
            }
            print('[JSSymbolData::GetIndexData] ',self.Period,  url, postData)
            response=requests.post(url,postData)
            jsonData=response.json()
            data=JSSymbolData.JsonDataToMinuteHistoryData(jsonData)
            self.IndexData=ChartData(data=data,dataType=self.DataType)

            aryOverlayData=self.SourceData.GetOverlayMinuteData(self.IndexData.Data)      # 和主图数据拟合以后的数据
            self.IndexData.Data=aryOverlayData

            if self.Period>=5:   # 周期数据
                periodData=self.IndexData.GetPeriodData(self.Period)
                self.IndexData.Data=periodData

            self.IndexData.Period=self.Period

    # 获取大盘指数缓存数据
    def GetIndexCacheData(self, dataName) :
        if not self.IndexData :
            return []

        if dataName=='INDEXA':
            return self.IndexData.GetAmount()
        elif dataName=='INDEXC':
            return self.IndexData.GetClose()
        elif dataName=='INDEXH':
            return self.IndexData.GetHigh()
        elif dataName=='INDEXL':
            return self.IndexData.GetLow()
        elif dataName=='INDEXO':
            return self.IndexData.GetOpen()
        elif dataName=='INDEXV':
            return self.IndexData.GetVol()
        elif dataName=='INDEXADV':
            return self.IndexData.GetUp()
        elif dataName=='INDEXDEC':
            return self.IndexData.GetDown()

    # 下载财务数据
    def GetFinanceData(self, jobID) :
        if jobID in self.FinanceData :
            return

        print('[JSSymbolData::GetFinanceData] jobID=', jobID)
       
        fieldList=["name","date","symbol"]
        
        if jobID in (   JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA,    # 流通股本（万股）
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA,        # 流通股本 手
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA ,   #流通市值
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA        #换手率
                    ) :
            fieldList.append("capital.a")
        elif jobID in ( JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA,   # 总股本（万股）
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA                       # 总市值
                    ) :
            fieldList.append('capital.total')      
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
            fieldList.append('finance.peruprofit')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
            fieldList.append('finance.pernetasset')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
            fieldList.append('finance.percreserve')
        elif jobID in (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA ):
            fieldList.append('finance.persearning')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
            fieldList.append('finance.nprofit')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
            fieldList.append('finance.alratio')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
            fieldList.append('finance.profityoy')
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:    # 过去4个季度现金分红总额
            fieldList.append('execdividend.quarter4')
        else :
            return

        # 请求数据
        url=self.StockHistoryDayApiUrl
        postData= { "field": fieldList,"symbol": [self.Symbol], "orderfield":"date" }
        print('[JSSymbolData::GetFinanceData]  ',url, postData)
        response=requests.post(url,postData)
        jsonData=response.json()
        self.RecvStockDayData(jsonData,jobID)

    @staticmethod # 财务数据格式转换
    def JsonDataToFinance(data) :
        financeData=None

        for i in range(1,5) :
            if i==1 :
                finance=data['finance1']
                announcement=data['announcement1']
            elif i==2 :
                finance=data['finance2']
                announcement=data['announcement2']
            elif i==3 :
                finance=data['finance3']
                announcement=data['announcement3']
            elif i==4 :
                finance=data['finance4']
                announcement=data['announcement4']

            if not finance or not announcement or not JSComplierHelper.IsNumber(announcement['year']) or not JSComplierHelper.IsNumber(announcement['quarter']):
                continue

            date=data['date']
            if financeData :    # 如果存在1天公布多个报告期数据 只取最新的一个公告期数据
                if financeData.Announcement['year'] < announcement['year'] :
                    financeData=FinanceData(date,finance=finance,announcement=announcement)

            else :
                financeData=FinanceData(date,finance=finance,announcement=announcement)

        return financeData
    
    # 获取某一个财务数据 (返回 True/False 返回数据保存在 resData)
    def GetFinanceValue(self,jsData, name, resData) :
        financeData=JSSymbolData.JsonDataToFinance(jsData)
        if not financeData :
            return False
        value=financeData.Get(name)
        if value==None :
            return False
        resData.Value=value
        return True
        

    # 把历史json数据转换为内存数据
    def RecvStockDayData(self, recvData,jobID) :
        stocks=recvData['stock']
        if not stocks or  len(stocks)!=1 :
            return

        aryStockDay=stocks[0]['stockday']
        bFinanceData=False # 是否是定期的财务数据
        bMarketValue=False # 是否计算市值
        aryData=[]

        for item in aryStockDay :
            indexData=SingleData()
            indexData.Date=item['date']

            if jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_CAPITAL_DATA :
                capitalData=item['capital']
                if not capitalData or not JSComplierHelper.IsJsonNumber(capitalData,'a'):
                    continue
                indexData.Value=capitalData['a']/100    # 流通股本（手）
                bFinanceData=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_TOTAL_EQUITY_DATA:
                capitalData=item['capital']
                if not capitalData or not JSComplierHelper.IsJsonNumber(capitalData,'total'):
                    continue
                indexData.Value=capitalData['total']/10000 #总股本（万股）
                bFinanceData=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_EQUITY_DATA: 
                    capitalData=item['capital']
                    if not capitalData or not JSComplierHelper.IsJsonNumber(capitalData,'a'):
                        continue
                    indexData.Value=capitalData['a']/10000 # 流通股本（万股）
                    bFinanceData=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_FLOW_MARKETVALUE_DATA:   #流通市值
                    capitalData=item['capital']
                    if not capitalData or not  JSComplierHelper.IsJsonNumber(capitalData,'a') :
                        continue
                    indexData.Value=capitalData['a'] # 流通股本
                    bMarketValue=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:       # 总市值
                    capitalData=item['capital']
                    if not capitalData or not  JSComplierHelper.IsJsonNumber(capitalData,'total') :
                        continue
                    indexData.Value=capitalData['total'] # 总股本
                    bMarketValue=True
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_EXCHANGE_DATA:          # 换手率
                    capitalData=item['capital']
                    if not financeData or not  JSComplierHelper.IsJsonNumber(capitalData,'a') :
                        continue
                    indexData.Value=capitalData['a'] # 流通股本
                    bFinanceData=True

                   
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_U_PROFIT_DATA:
                    if not self.GetFinanceValue(item,'peruprofit',indexData) :  # 每股未分配利润
                        continue
                    bFinanceData=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_NETASSET_DATA:
                    if not self.GetFinanceValue(item,'pernetasset',indexData) : # 每股净资产
                        continue
                    bFinanceData=True
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_C_RESERVE_DATA:
                    if not self.GetFinanceValue(item,'percreserve',indexData) : # 每股资本公积金
                        continue
                    bFinanceData=True
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING_DATA:
                    if not self.GetFinanceValue(item,'persearning',indexData) : # 每股收益
                        continue
                    bFinanceData=True
                   
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PER_S_EARNING2_DATA:
                    financeData=JSSymbolData.JsonDataToFinance(item)
                    if not financeData or not financeData.Finance or not financeData.Announcement: 
                        continue

                    if not JSComplierHelper.IsJsonNumber(financeData.Finance,'persearning') or not JSComplierHelper.IsJsonDivideNumber(financeData.Announcement,'quarter'):
                        continue
                    
                    indexData.Value=financeData.Finance['persearning']/financeData.Announcement['quarter']*4       # 每股收益(折算为全年收益)  报告期每股收益/报告期*4
                    bFinanceData=True
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_N_PROFIT_DATA:
                    if not self.GetFinanceValue(item,'nprofit',indexData) : # 净利润
                        continue
                    bFinanceData=True
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_AL_RATIO_DATA:
                    if not self.GetFinanceValue(item,'alratio',indexData) : # 资产负债率
                        continue
                    bFinanceData=True

            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_PROFIT_YOY_DATA:
                    if not self.GetFinanceValue(item,'profityoy',indexData) : # 净利润同比增长率
                        continue
                    bFinanceData=True
                   
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA:
                    if not self.GetFinanceValue(item,'quarter4',indexData) : # 净利润同比增长率
                        continue
            else :
                    continue
                    
            aryData.append(indexData)

        if bFinanceData:
            aryFixedData=self.SourceData.GetFittingFinanceData(aryData)
        elif bMarketValue :
            aryFixedData=self.SourceData.GetFittingMarketValueData(aryData)   # 总市值用不复权的价格计算
            if jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARKETVALUE_DATA:
                self.MarketValue=aryFixedData  # 总市值保存下 算其他数据可能要用

        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_DIVIDEND_YIELD_DATA :          # 股息率TTM：过去4个季度现金分红总额/总市值 * 100%
            aryFixedData=self.SourceData.CalculateDividendYield(aryData,self.MarketValue)
        else :
            aryFixedData=self.SourceData.GetFittingData(aryData)

        bindData=ChartData(data=aryFixedData)
        bindData.Period=self.Period

        if bindData.Period>0 :         # 周期数据
            periodData=bindData.GetPeriodSingleData(bindData.Period)
            bindData.Data=periodData

        data=bindData.GetValue()
        self.FinanceData[jobID]=data


    # 财务函数
    def GetFinanceCacheData(self, id, node) :
        jobID=JS_EXECUTE_JOB_ID.GetFinnanceJobID(id)
        if not jobID :
            self.ThrowUnexpectedNode(node,'不支持FINANCE('+str(int(id))+')')

        if jobID in self.FinanceData :
            return self.FinanceData.get(jobID)

        return []


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
