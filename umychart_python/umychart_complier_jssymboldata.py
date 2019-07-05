#####################################################################
#
#   股票数据类
#
#####################################################################

import sys
import requests     # 网络数据下载
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem, HQ_DATA_TYPE,SymbolOption
from umychart_complier_data import ChartData, HistoryData, MinuteData, SingleData
from umychart_complier_help  import JSComplierHelper, Variant

# 全局api域名变量
class TextItem:
    def __init__(self, color,text=None,symbol=None) :
        self.Text=text,
        self.Color=color
        self.Symbol=symbol

class JSComplierResource :
    def __init__(self) :
        self.Domain = "https://opensource.zealink.com"               # API域名  
        self.CacheDomain = "https://opensourcecache.zealink.com"     # 缓存域名

        drawIcon=Variant()
        drawIcon.Family='iconfont'
        drawIcon.Data={ 
            1 : TextItem(text='\ue625', color='rgb(255,106,106)'),     # 向上箭头
            2 : TextItem(text='\ue68b', color='rgb(46,139,87)'),       # 向下箭头
            11: TextItem(text='\ue624', color='rgb(245,159,40)'),      # 点赞
            12: TextItem(text='\ue600', color='rgb(245,159,40)'),
            13: TextItem(text='\ue70f', color='rgb(209,37,35)'),         # B
            14: TextItem(text='\ue64c', color='rgb(127,209,59)'),        # S
            9 : TextItem(text='\ue626', color='rgb(245,159,40)'),        # $
            36: TextItem(text='\ue68c', color='rgb(255,106,106)'),       # 关闭 红色
            37: TextItem(text='\ue68c', color='rgb(46,139,87)'),         # 关闭 绿色
            38: TextItem(text='\ue68d', color='rgb(238,44,44)'),         # ▲
            39: TextItem(text='\ue68e', color='rgb(0,139,69)'),          # ▼
            46: TextItem(text='\ue64d', color='rgb(51,51,51)'),        # message
        }
        self.DrawIcon=drawIcon

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

# http://www.newone.com.cn/helpcontroller/index?code=zszy_pc
class DYNAINFO_ARGUMENT_ID :
    YCLOSE=3
    OPEN=4
    HIGH=5
    LOW=6
    CLOSE=7
    VOL=8
    AMOUNT=10
    AMPLITUDE=13        # 振幅
    INCREASE=14         # 涨幅
    EXCHANGERATE=37     # 换手率


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
        self.LatestData=None           # 最新行情
        self.MarginData={}             # 融资融券
        self.ExtendData={}             # 其他扩展数据
        self.NewsAnalysisData={}       # 新闻统计

        self.MaxRequestDataCount=option.MaxRequestDataCount   # 读取日线数据天数
        self.MaxRequestMinuteDayCount=option.MaxRequestMinuteDayCount # 读取分钟数据天数

        self.KLineApiUrl= g_JSComplierResource.Domain+"/API/KLine2"                   # 日线
        self.MinuteKLineApiUrl= g_JSComplierResource.Domain+'/API/KLine3'             # 分钟K线
        self.RealtimeApiUrl= g_JSComplierResource.Domain+'/API/stock'                 # 实时行情
        self.StockHistoryDayApiUrl= g_JSComplierResource.Domain+'/API/StockHistoryDay'  # 历史财务数据
        self.StockNewsAnalysisApiUrl= g_JSComplierResource.CacheDomain+'/cache/newsanalyze'    # 新闻分析数据


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
            elif job.ID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_SYMBOL_LATEST_DATA : # 最新行情数据
                self.GetLatestData()
            elif job.ID in  (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE,
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE,       # 买入信息-融资余额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT,        # 买入信息-买入额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY,         # 买入信息-偿还额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET,           # 买入信息-融资净买入
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE,      # 卖出信息-融券余量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,       # 卖出信息-卖出量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY,        # 卖出信息-偿还量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET) :        # 卖出信息-融券净卖出
                self.GetMarginData(job.ID)
            elif job.ID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA:         # 涨停个股统计
                self.GetIndexIncreaseData(job)
            elif job.ID in (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE,             # 负面新闻
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH,             # 机构调研
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT,             # 互动易
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE,         # 股东增持
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2,        # 股东减持
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER,          # 信托持股
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING,         # 大宗交易
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS,          # 官网新闻
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS,          # 高管要闻
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE) :             # 股权质押
                self.GetNewsAnalysisData(job.ID)



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


    # 下载最新行情
    def GetLatestData(self) :
        if self.LatestData:
            return

        url=self.RealtimeApiUrl
        postData={
                "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","time","increase","exchangerate","amplitude"],
                "symbol": [self.Symbol] }

        print('[JSSymbolData::GetLatestData]  ',url, postData)
        response=requests.post(url,postData)
        jsonData=response.json()

        if not JSComplierHelper.IsJsonExist(jsonData,'stock') :
            return

        if (len(jsonData['stock'])!=1) :
            return

        stock=jsonData['stock'][0]
        item=Variant()
        item.Symbol=stock['symbol']
        item.Name=stock['name']
        item.Date=stock['date']
        item.Time=stock['time']
        item.YClose=stock['yclose']
        item.Price=stock['price']
        item.Open:stock['open'] 
        item.High:stock['high'] 
        item.Low:stock['low'] 
        item.Vol:stock['vol']
        item.Amount=stock['amount']
        item.Increase=stock['increase']
        item.Exchangerate=stock['exchangerate']
        item.Amplitude=stock['amplitude']
        self.LatestData=item

    # 最新行情
    def GetLatestCacheData(self, dataname) :
        if not self.LatestData :
            return  None

        if dataname==DYNAINFO_ARGUMENT_ID.YCLOSE:
            return self.LatestData.YClose
        elif dataname==DYNAINFO_ARGUMENT_ID.OPEN:
            return self.LatestData.Open
        elif dataname==DYNAINFO_ARGUMENT_ID.HIGH:
            return self.LatestData.High
        elif dataname==DYNAINFO_ARGUMENT_ID.LOW:
            return self.LatestData.Low
        elif dataname==DYNAINFO_ARGUMENT_ID.VOL:
            return self.LatestData.Vol
        elif dataname==DYNAINFO_ARGUMENT_ID.AMOUNT:
            return self.LatestData.Amount
        elif dataname==DYNAINFO_ARGUMENT_ID.INCREASE:
            return self.LatestData.Increase
        elif dataname==DYNAINFO_ARGUMENT_ID.EXCHANGERATE:
            return self.LatestData.Exchangerate
        elif dataname==DYNAINFO_ARGUMENT_ID.AMPLITUDE:
            return self.LatestData.Amplitude
        elif dataname==DYNAINFO_ARGUMENT_ID.CLOSE:
            return self.LatestData.Price
        else :
            return None

    # 下载融资融券
    def GetMarginData(self, jobID) :
        if jobID in self.MarginData :
            return True
       
        fieldList=["name","date","symbol"]
        
        if jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:           # 融资融券余额
            fieldList.append("margin.balance")
            
        elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:              # 融资占比
            fieldList.append("margin.rate")
            
        elif jobID in ( JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE,       # 买入信息-融资余额
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT,        # 买入信息-买入额
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY,         # 买入信息-偿还额
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET ) :        # 买入信息-融资净买入
            fieldList.append("margin.buy")
    
        elif jobID in ( JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE,      # 卖出信息-融券余量
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,       # 卖出信息-卖出量
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY,        # 卖出信息-偿还量
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET ) :       # 卖出信息-融券净卖出
            fieldList.append("margin.sell")
            
        url=self.StockHistoryDayApiUrl
        postData={
                "field": fieldList,
                "symbol": [self.Symbol],
                "orderfield":"date" }

        print('[JSSymbolData::GetMarginData] jobID , url, postData', jobID,url, postData)

        # 请求数据
        response=requests.post(url,postData)
        jsonData=response.json()
        self.RecvMarginData(jsonData,jobID)
        return True


    def RecvMarginData(self, jsonData,jobID) :
        if not JSComplierHelper.IsJsonExist(jsonData,'stock') :
            return

        if (len(jsonData['stock'])!=1) :
            return

        stock=jsonData['stock'][0]
        aryData, aryData2, aryData3, aryData4 = [] ,[], [], []
        for item in stock['stockday'] :   
            if not JSComplierHelper.IsJsonExist(item,'margin') :
                continue
            marginData=item['margin']
            if not marginData :
                continue

            indexData=SingleData()
            indexData.Date=item['date']

            if jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE:
                if not JSComplierHelper.IsNumber(marginData['balance']) :
                    continue
                indexData.Value=marginData['balance'] # 融资融券余额
                aryData.append(indexData)
                    
            elif jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE:
                if not JSComplierHelper.IsNumber(marginData.rate):
                    continue
                indexData.Value=marginData['rate']    # 融资占比
                aryData.append(indexData)
                
            elif jobID in ( JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE,       # 买入信息-融资余额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT,        # 买入信息-买入额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY,         # 买入信息-偿还额
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET ) :        # 买入信息-融资净买入

                    if not JSComplierHelper.IsJsonExist(marginData,'buy') :
                        continue
                    buyData=marginData['buy']
                    if not buyData :
                        continue

                    if (not JSComplierHelper.IsNumber(buyData['balance']) or not JSComplierHelper.IsNumber(buyData['amount']) or 
                            not JSComplierHelper.IsNumber(buyData['repay']) or not JSComplierHelper.IsNumber(buyData['net'])) :
                        continue

                    indexData.Value=buyData['balance']
                    indexData2=SingleData()
                    indexData2.Date=item['date']
                    indexData2.Value=buyData['amount']
                    indexData3=SingleData()
                    indexData3.Date=item['date']
                    indexData3.Value=buyData['repay']
                    indexData4=SingleData()
                    indexData4.Date=item['date']
                    indexData4.Value=buyData['net']

                    aryData.append(indexData)
                    aryData2.append(indexData2)
                    aryData3.append(indexData3)
                    aryData4.append(indexData4)
                    
            elif jobID in ( JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE,      # 卖出信息-融券余量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,       # 卖出信息-卖出量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY,        # 卖出信息-偿还量
                            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET ) :       # 卖出信息-融券净卖出
                if not JSComplierHelper.IsJsonExist(marginData,'sell') :
                    continue
                sellData=marginData['sell']
                if not sellData :
                    continue
                if (not JSComplierHelper.IsNumber(sellData['balance']) or not JSComplierHelper.IsNumber(sellData['volume']) or 
                        not JSComplierHelper.IsNumber(sellData['repay']) or not JSComplierHelper.IsNumber(sellData['net'])) :
                    continue

                indexData.Value=buyData['balance']
                indexData2=SingleData()
                indexData2.Date=item['date']
                indexData2.Value=buyData['volume']
                indexData3=SingleData()
                indexData3.Date=item['date']
                indexData3.Value=buyData['repay']
                indexData4=SingleData()
                indexData4.Date=item['date']
                indexData4.Value=buyData['net']

                aryData.append(indexData)
                aryData2.append(indexData2)
                aryData3.append(indexData3)
                aryData4.append(indexData4)

            else:
                continue

        allData=[]
        if (jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BALANCE or jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_RATE) :
            item=Variant()
            item.JobID, item.Data = jobID, aryData
            allData.append(item)
        elif jobID in (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE , JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT ,
                    JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY , JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET) :
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_BALANCE, aryData
            allData.append(item)
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_AMOUNT, aryData2
            allData.append(item)
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_REPAY, aryData3
            allData.append(item)
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_BUY_NET, aryData4
            allData.append(item)
        elif jobID in (JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME,
                        JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY, JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET) :
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_BALANCE, aryData
            allData.append(item)         
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_VOLUME, aryData2
            allData.append(item)
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_REPAY, aryData3
            allData.append(item)
            item=Variant()
            item.JobID, item.Data = JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_MARGIN_SELL_NET, aryData4
            allData.append(item)

        for item in allData :
            aryFixedData=self.SourceData.GetFittingData(item.Data)

            bindData=ChartData(data=aryFixedData)
            bindData.Period=self.Period    # 周期

            if bindData.Period>0 :         # 周期数据
                periodData=bindData.GetPeriodSingleData(bindData.Period)
                bindData.Data=periodData

            data=bindData.GetValue()
            self.MarginData[item.JobID]=data

    # 融资融券函数
    def GetMarginCacheData(self, id, node) :
        jobID=JS_EXECUTE_JOB_ID.GetMarginJobID(id)
        if not jobID :
            self.ThrowUnexpectedNode(node,'不支持MARGIN('+str(id)+')')
        if jobID in self.MarginData :
            return self.MarginData[jobID]

        return []

    # 分钟涨幅股票个数统计数据下载
    def GetIndexIncreaseData(self,job) :
        upKey=str(job.ID)+'-UpCount-'+job.Symbol
        downKey=str(job.ID)+'-DownCount-'+job.Symbol
        if upKey in self.ExtendData and downKey in self.ExtendData:
            return

        symbol=job.Symbol
        symbol=symbol.replace('.CI','.ci')
        if (self.DataType==HQ_DATA_TYPE.MINUTE_ID or self.DataType==HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) :  # 走势图数据
            url=g_JSComplierResource.CacheDomain+'/cache/analyze/increaseanalyze/'+symbol+'.json'
            print('[JSSymbolData::GetIndexIncreaseData] minute Get url= ' , url)
            # 请求数据
            response=requests.get(url)
            jsonData=response.json()

        elif (self.DataType==HQ_DATA_TYPE.KLINE_ID and self.Period==0) : # K线图 日线
            url=self.KLineApiUrl
            postData= {"symbol": symbol,"start": -1,"count": self.MaxRequestDataCount }
            print('[JSSymbolData::GetIndexIncreaseData] KLine jobID , url, postData', job.ID, url, postData)
            # 请求数据
            response=requests.post(url,postData)
            jsonData=response.json()
            self.RecvHistoryIncreaseData(jsonData,upKey,downKey)

    def RecvHistoryIncreaseData(self,jsonData,upKey,downKey) :
        if not JSComplierHelper.IsJsonExist(jsonData,'data') :
            return
        upData,downData = [], []
        for item in jsonData['data'] :
            upItem=SingleData()
            downItem=SingleData()
            upItem.Date=item[0]
            upItem.Value=item[8]
            upData.append(upItem)
            downItem.Date=item[0]
            downItem.Value=item[9]
            downData.append(downItem)

        aryFixedData=self.SourceData.GetFittingData(upData)
        bindData=ChartData(data=aryFixedData)
        bindData.Period=self.Period    # 只支持日线
        data=bindData.GetValue()
        self.ExtendData[upKey]=data

        aryFixedData=self.SourceData.GetFittingData(downData)
        bindData=ChartData(data=aryFixedData)
        bindData.Period=self.Period    # 只支持日线
        data=bindData.GetValue()
        self.ExtendData[downKey]=data

    def RecvMinuteIncreaseData(self,jsonData,upKey,downKey) :
        if not JSComplierHelper.IsJsonExist(jsonData,'minute') :
            return
        
        minuteData=jsonData['minute']
        if ( not JSComplierHelper.IsJsonExist(minuteData,'time') or  not JSComplierHelper.IsJsonExist(minuteData,'up') or
                not JSComplierHelper.IsJsonExist(minuteData,'down'))  :
                return

        dataLen=len(len(self.SourceData.Data))
        upData,downData =JSComplierHelper.CreateArray(dataLen),JSComplierHelper.CreateArray(dataLen)
        jsonUp=minuteData['up']
        jsonDown=minuteData['down']
        j=0
        for i in range(dataLen) :
            item=self.SourceData.Data[i]
            dateTime=item.DateTime # 日期加时间
            if not dateTime :
                continue
            aryValue=dateTime.split(' ')
            if len(aryValue)!=2 : 
                continue
            date=int(aryValue[0])
            if date!=jsonData['date'] :
                continue

            upData[i]=jsonUp[j]
            downData[i]=jsonDown[j]
            j+=1

        self.ExtendData[upKey]=upData
        self.ExtendData[downKey]=downData

            

    # 分钟涨幅股票个数统计数据
    def GetIndexIncreaseCacheData(self,funcName,symbol,node) :
        key=None
        if (funcName=='UPCOUNT') :
            key=str(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA)+'-UpCount-'+symbol
        elif (funcName=='DOWNCOUNT') :
            key=str(JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_INDEX_INCREASE_DATA)+'-DownCount-'+symbol
        
        if not key or key not in self.ExtendData :
            self.ThrowUnexpectedNode(node,'不支持函数'+funcName+'('+symbol+')')

        return self.ExtendData[key]

    # 下载新闻统计
    def GetNewsAnalysisData(self,jobID) :
        if  jobID in self.NewsAnalysisData :
            return

        mapFolder={ 
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_NEGATIVE : "negative",
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_INTERACT : 'interact',
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_RESEARCH :  'research',            # NEWS(3) 调研
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE: 'holderchange',      # NEWS(4)   股东增持
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2:'holderchange',      # NEWS(5)   股东减持
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TRUSTHOLDER:  'trustholder',       # NEWS(6)   信托持股
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_BLOCKTRADING: 'Blocktrading',      # NEWS(7)   大宗交易
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_COMPANYNEWS:  'companynews',       # NEWS(8)   官网新闻
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_TOPMANAGERS:  'topmanagers',       # NEWS(9)   高管要闻
            JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_PLEDGE:       'Pledge',            # NEWS(10)  股权质押
        }
            

        if jobID not in mapFolder :
            return

        folderName=mapFolder[jobID]
        url=self.StockNewsAnalysisApiUrl+'/'+folderName+'/'+self.Symbol+'.json'

        # 请求数据
        try :
            print('[JSSymbolData::GetNewsAnalysisData] jobID , url ', jobID, url)
            response=requests.get(url)
            jsonData=response.json()
        except :
            # 没有新闻使用0数据填充
            aryData=[]
            for kline in self.SourceData.Data :
                item=SingleData()
                item.Date=kline.Date
                item.Value=0
                aryData.append(item)

            bindData=ChartData(data=aryData)
            self.NewsAnalysisData[jobID]=bindData.GetValue()
            return 

        if not JSComplierHelper.IsJsonExist(jsonData,'data') or not JSComplierHelper.IsJsonExist(jsonData,'date') :
            return
        analyzeData=jsonData['data']    # 数据
        analyzeDate=jsonData['date']    # 日期
        dataLen=len(analyzeData)
        if dataLen <=0 :
            return

        # console.log('[JSSymbolData::RecvNewsAnalysisData] jobID',jobID, data.update);
        if (jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE or jobID==JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2) :
            
            aryData, aryData2 = [],[]
            analyzeData2=jsonData['data2'] # 第2组数据
            for i in range(dataLen) :
                item=SingleData()
                item.Date=analyzeDate[i]
                item.Value=analyzeData[i]
                if JSComplierHelper.IsNumber(item.Value) :
                    aryData.append(item)

                if i<len(analyzeData2) :
                    item=SingleData()
                    item.Date=analyzeDate[i]
                    item.Value=analyzeData2[i]
                    if JSComplierHelper.IsNumber(item.Value) :
                        aryData2.append(item)

            aryFixedData=self.SourceData.GetFittingData2(aryData,0)
            bindData=ChartData(data=aryFixedData)
            self.NewsAnalysisData[JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE]=bindData.GetValue()

            aryFixedData=self.SourceData.GetFittingData2(aryData2,0)
            bindData=ChartData(data=aryFixedData)
            self.NewsAnalysisData[JS_EXECUTE_JOB_ID.JOB_DOWNLOAD_NEWS_ANALYSIS_HOLDERCHANGE2]=bindData.GetValue()

        else :
            aryData=[]
            for i in range(dataLen) :
                item=SingleData()
                item.Date=analyzeDate[i]
                item.Value=analyzeData[i]
                aryData.append(item)

            aryFixedData=self.SourceData.GetFittingData2(aryData,0)
            bindData=ChartData(data=aryFixedData)
            self.NewsAnalysisData[jobID]=bindData.GetValue()

    
    # 资讯统计数据
    def GetNewsAnalysisCacheData(self,id,node) :
        jobID=JS_EXECUTE_JOB_ID.GetNewsAnalysisID(id)
        if not jobID :
            self.ThrowUnexpectedNode(node,'不支持NEWS('+int(id)+')')

        if jobID in self.NewsAnalysisData :
            return self.NewsAnalysisData[jobID]

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

    def REFDATE(self,data,date) :
        index=None
        for i in range(len(self.Data.Data)) :   # 查找日期对应的索引
            if self.Data.Data[i].Date==date :
                index=i
                break

        if index==None or index>=len(data) :
            return None

        return data[index]

    # 用法:结果从0到11,依次分别是1/5/15/30/60分钟,日/周/月,多分钟,多日,季,年
    def PERIOD(self) :
        # Period周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
        PERIOD_MAP=[5,6,7,11, 0,1,2,3,4,5]
        return PERIOD_MAP[self.Period]
