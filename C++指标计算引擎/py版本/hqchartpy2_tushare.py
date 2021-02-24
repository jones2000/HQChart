##########################################################################################################
##  hqchartpy2 对接tushare第3方数据
##
##
##
##########################################################################################################

from hqchartpy2_fast import FastHQChart,IHQData,PERIOD_ID
import json
import time
import numpy as np 
import pandas as pd
import tushare as ts
import datetime

from hqchartpy2_tushare_config import TushareConfig

##########################################################################################
## TushareHQChartData 全部使用Tushare数据接口
##
##
##########################################################################################
class TushareHQChartData(IHQData) :
    def __init__(self, token, startDate, endDate):
        ts.set_token(token) 
        self.TusharePro = ts.pro_api()
        self.StartDate=startDate
        self.EndDate=endDate
    
    def GetKLineData(self, symbol, period, right, jobID) :
        return self.GetKLineAPIData(symbol, period, right, self.StartDate, self.EndDate)

    # 获取其他K线数据
    def GetKLineData2(self, symbol, period, right, callInfo, kdataInfo, jobID) :
        if (callInfo.find('$')>0) :
            if (symbol.find(".")<=0) :
                if (symbol.find("SH")==0) :
                    symbol=symbol[2:]+".SH"
                elif (symbol.find("SZ")==0) :
                    symbol=symbol[2:]+".SZ"
                else :
                    if (symbol[:3]=='600' or symbol[:3]=="688") :
                        symbol+=".SH"
                    elif (symbol[:3]=="000" or symbol[:2]=="30") :
                        symbol+=".SZ"
                

        return self.GetKLineAPIData(symbol, period, right, kdataInfo["StartDate"], kdataInfo["EndDate"])
        
    # 获取K线API数据
    def GetKLineAPIData(self, symbol, period, right, startDate, endDate) :
        # 复权 0=不复权 1=前复权 2=后复权
        fq=None # 复权
        if (right==1) : # 前复权
            fq="qfq"
        elif (right==2) :   # 后复权
            fq="hfq"

        # 周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 9=季线 10=分笔
        freq='D'
        if (period==1) :
            freq="W"
        elif (period==2):
            freq="M"
        elif (period==4):
            freq="1MIN"
        elif (period==5):
            freq="5MIN"
        elif (period==6):
            freq="15MIN"
        elif (period==7):
            freq="30MIN"
        elif (period==8):
            freq="60MIN"

       
         # 指数
        if (IHQData.IsSHSZIndex(symbol)) :
            fq=None
            try:
                print("[TushareHQChartData::GetKLineAPIData] 指数 ts.pro_bar(ts_code={0}, adj={1}, start_date={2}, end_date={3}, freq={4}, asset='I')".format(symbol, fq, startDate, endDate, freq))
                df = ts.pro_bar(ts_code=symbol, adj=fq, start_date=str(startDate), end_date=str(endDate),freq=freq, asset='I')
            except Exception as e:
                print('[TushareHQChartData::GetKLineAPIData] Error. throw exception {0},'.format(e))
                return { "error":str(e) }
        else :
            try :
                print("[TushareHQChartData::GetKLineAPIData] 股票 ts.pro_bar(ts_code={0}, adj={1}, start_date={2}, end_date={3}, freq={4})".format(symbol, fq, startDate, endDate, freq))
                df = ts.pro_bar(ts_code=symbol, adj=fq, start_date=str(startDate), end_date=str(endDate),freq=freq)
                # df = self.TusharePro.daily(ts_code=symbol, start_date='20200101', end_date='20201231')
            except Exception as e:
                print('[TushareHQChartData::GetKLineAPIData] Error. throw exception {0},'.format(e))
                return { "error":str(e) }

        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        cacheData={}
        if (period in (0,1,2,3,9)) :
            # 日期转int
            aryDate=df["trade_date"]
            aryDate[aryDate == ''] = 0
            aryDate = aryDate.astype(np.int)
            dataCount=len(aryDate) 
            cacheData['count']=dataCount    # 数据个数
            cacheData["date"]=aryDate.tolist()
        else :
            aryDateTime=df["trade_time"]
            dataCount=len(aryDateTime) 
            cacheData['count']=dataCount    # 数据个数
            aryDateTime= pd.to_datetime(aryDateTime, format="%Y-%m-%d %H:%M:%S")
            print(aryDateTime)
            aryDate=[]
            aryTime=[]
            for item in aryDateTime :
                aryDate.append(item.year*10000 + item.month* 100  + item.day)
                aryTime.append(item.hour*100+item.minute)
            cacheData["time"]=aryTime
            cacheData["date"]=aryDate

        
        cacheData['name']=symbol        # 股票名称
        cacheData['period']=period      # 周期
        cacheData['right']=right       # 不复权

        cacheData["yclose"]=np.array(df["pre_close"]).tolist()
        cacheData["open"]=np.array(df["open"]).tolist()
        cacheData["high"]=np.array(df["high"]).tolist()
        cacheData["low"]=np.array(df["low"]).tolist()
        cacheData["close"]=np.array(df["close"]).tolist()
        cacheData["vol"]=np.array(df["vol"]).tolist()
        cacheData["amount"]=np.array(df["amount"]).tolist()


        log="K线:{0} - period={1} right={2} count={3} date=[{4}, {5}]".format(symbol,period,right,dataCount, startDate, endDate)
        print(log)

        return cacheData


    # 历史所有的流通股 
    def GetHisCapital(self,symbol, period, right, kcount, jobID):
        return self.GetDailyBasicData(symbol,"float_share")

    # TOTALCAPITAL  当前总股本
    def GetTotalCapital(self,symbol, period, right, kcount, jobID) :
        df=self.TusharePro.daily_basic(ts_code=symbol, trade_date=str(self.EndDate), fields='trade_date,total_share')
        print(df)

        result={"type": 0}  # 类型0 单值数据
        result["data"]=df["total_share"]*10000/100
        return result

    # CAPITAL 最新流通股本(手)
    def GetCapital(self,symbol, period, right, kcount,jobID):
        df=self.TusharePro.daily_basic(ts_code=symbol, trade_date=str(self.EndDate), fields='trade_date,float_share')
        print(df)

        result={"type": 0}  # 类型0 单值数据
        result["data"]=df["float_share"]*10000/100
        return result

    # https://waditu.com/document/2?doc_id=32
    def GetDailyBasicData(self, symbol,fieldname) :
        df=self.TusharePro.daily_basic(ts_code=symbol,start_date=str(self.StartDate), end_date=str(self.EndDate), fields='trade_date,{0}'.format(fieldname))
        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        aryDate=df["trade_date"]
        aryDate[aryDate == ''] = 0
        aryDate = aryDate.astype(np.int).tolist()

        if (fieldname in ("total_share","float_share" )) :
            aryShare=np.multiply(df[fieldname],10000).tolist()
        else :
            aryShare=df[fieldname].tolist()

        result={"type": 2}  # 类型2 根据'date'自动合并到K线数据上
        result["data"]=aryShare
        result["date"]=aryDate
        return result

    # https://waditu.com/document/2?doc_id=32
    def GetDailyBasicDataLatest(self, symbol,fieldname):
        df=self.TusharePro.daily_basic(ts_code=symbol, trade_date=str(self.EndDate), fields='trade_date,{0}'.format(fieldname))
        print(df)

        result={"type": 0}  # 类型0 单值数据
        if (fieldname=='circ_mv') : # 流通市值 万元
            result["data"]=df[fieldname]*10000
        else :
            result["data"]=df[fieldname]
        return result

    # https://waditu.com/document/2?doc_id=79
    def GetFinaIndicatorLatest(self,symbol,fieldname):
        df = self.TusharePro.fina_indicator(ts_code=symbol)
        print(df)

        result={"type": 0}  # 类型0 单值数据
        if (len(df[fieldname])>0) :
            result["data"]=df[fieldname][0] # 取最新一期的数据
        else :
            result["data"]=0
        return result

    # https://waditu.com/document/2?doc_id=36
    def GetBalanceSheetLatest(self,symbol,fieldname):
        df = self.TusharePro.balancesheet(ts_code=symbol, fields="end_date,{0}".format(fieldname))
        print(df)

        result={"type": 0}  # 类型0 单值数据
        if (len(df[fieldname])>0) :
            value=df[fieldname][0]
            if (np.isnan(value)) :
                result["data"]=0
            else :
                result["data"]=df[fieldname][0] # 取最新一期的数据
        else :
            result["data"]=0
        return result

    # FINANCE()  财务数据 数组
    def GetFinance(self, symbol, id, period,right,kcount,jobID) :
        if (id==1) : # FINANCE(1) 总股本(随时间可能有变化)
            return self.GetDailyBasicData(symbol,"total_share")
        elif (id==7) :# FINANCE(7)  流通股本(随时间可能有变化)
            return self.GetDailyBasicData(symbol,"float_share")
        elif (id==9) : # FINANCE(9)  资产负债率 即:(总资产-净资产-少数股东权益)/总资产*100,上市公司最近一期财报数据
            return self.GetFinaIndicatorLatest(symbol,"debt_to_assets")
        elif (id==15) : # FINANCE(15) 流动负债,上市公司最近一期财报数据
            return self.GetBalanceSheetLatest(symbol,"total_cur_liab")
        elif (id==17) : # FINANCE(17) 资本公积金,上市公司最近一期财报数据
            return self.GetBalanceSheetLatest(symbol,"capital_rese_ps")
        elif (id==18) : # FINANCE(18)  每股公积金,上市公司最近一期财报数据
            return self.GetBalanceSheetLatest(symbol, "cap_rese")
        elif (id==40) : # FINANCE(40)  流通市值
            return self.GetDailyBasicDataLatest(symbol,"circ_mv")
        elif (id==43) : # FINANCE(43)  净利润同比增长率,上市公司最近一期财报数据
            return self.GetFinaIndicatorLatest(symbol,"q_profit_yoy")
        elif (id==44) : # FINANCE(44)  收入同比增长率,上市公司最近一期财报数据
            return self.GetFinaIndicatorLatest(symbol,"q_sales_yoy")

    # 最新行情
    # https://waditu.com/document/2?doc_id=27
    def GetDailyDataLatest(self, symbol, fieldname) :
        now = datetime.datetime.now()
        date = now + datetime.timedelta(days = -20)  # 取最新的20个数据
        df = self.TusharePro.daily(ts_code=symbol,start_date=str(date.year*10000+date.month*100+date.day))
        print(df)

        result={"type": 0}  # 类型0 单值数据
        if (len(df[fieldname])>0) :
            value=df[fieldname][0]
            if (np.isnan(value)) :
                result["data"]=0
            else :
                result["data"]=df[fieldname][0] # 取最新一期的数据
        else :
            result["data"]=0
        return result

    # DYNAINFO(id) 及时行情数据
    def GetDynainfo(self,symbol, id,period,right, kcount,jobID):
        if (id==3) : # DYNAINFO(3)  前收盘价 即时行情数据 期货和期权品种为昨结算价
            return self.GetDailyDataLatest(symbol,"pre_close")
        elif (id==4) : # DYNAINFO(4)  开盘价 即时行情数据 在开盘前,值为0,在使用时需要判断
            return self.GetDailyDataLatest(symbol,"open")
        elif (id==5) : # DYNAINFO(5)  最高价 即时行情数据 在开盘前,值为0,在使用时需要判断
            return self.GetDailyDataLatest(symbol,"high")
        elif (id==6) : # DYNAINFO(6)  最低价 即时行情数据 在开盘前,值为0,在使用时需要判断
            return self.GetDailyDataLatest(symbol,"low")
        elif (id==7) : # DYNAINFO(7)  现价 即时行情数据 在开盘前,值为0,在使用时需要判断
            return self.GetDailyDataLatest(symbol,"close")
        elif (id==8) : # DYNAINFO(8) 总量 即时行情数据
            return self.GetDailyDataLatest(symbol,"vol")
        elif (id==10) : # DYNAINFO(10)  总金额 即时行情数据
            return self.GetDailyDataLatest(symbol,"amount")

    # 引用股票交易类数据.
    # GPJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
    # 股票交易类数据函数，数据编号如下:
    # 1--股东人数 股东户数(户)
    # 2--龙虎榜   买入总计(万元) 卖出总计(万元)[注：该指标展示最近一年的数据]
    # 3--融资融券1 融资余额(万元) 融券余量(股)
    # 4--大宗交易 成交均价(元) 成交额(万元)
    # 5--增减持   成交均价(元) 变动股数(股)
    # 6--陆股通持股量  持股数量(股) 持股占比
    # 7--陆股通市场成交净额  陆股通市场净买入(万元)[注：官方只公布了每日的前十名数据]
    # 8--龙虎榜机构(卖方)数据  卖方机构个数 机构卖出金额(万元)
    # 9--龙虎榜机构(买方)数据  买方机构个数 机构买入金额(万元)
    # 10--近3月机构调研情况  近3月机构调研次数 近3月调研机构数量
    # 11--融资融券2 融资买入额(万元) 融资偿还额(万元)
    # 12--融资融券3 融券卖出量(股) 融券偿还量(股)
    # 13--融资融券4 融资净买入(万元) 融券净卖出(股)
    # 14--暂无,原 发行价 指标移至 股票的单个数据(非序列)
    # 15--涨跌停 涨跌停状态 封单金额(万元)[注：涨停取2,曾涨停取1,跌停取-2,曾跌停取-1;跌停和曾跌停时,封单金额取负值]
    # 16--总市值 总市值(万元)

    def GetGPJYValue(self, symbol,args,period, right, kcount ,jobID):
        if (args[0]==1) :
            return self.GetHolderNumber(symbol, args)
        elif (args[0] in (3,11,12,13)) :
            return self.GetMarginDetail(symbol,args)
        elif (args[0]==4) :
            return self.GetBlockTrade(symbol, args)
        elif (args[0]==6):
            return self.GetHKHold(symbol,args)
        pass

    # 股东人数
    def GetHolderNumber(self, symbol,args) :
        df=self.TusharePro.stk_holdernumber(ts_code=symbol,start_date=str(self.StartDate), end_date=str(self.EndDate))
        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        aryDate=df["end_date"] # 截止日期
        aryDate[aryDate == ''] = 0
        aryDate = aryDate.astype(np.int).tolist()
        aryData=df['holder_num'].tolist()

        result={"type": 2}  # 类型2 根据'date'自动合并到K线数据上
        if (args[2]==0) :
            result["type"]=4    # 类型3 根据'date'自动合并到K线数据上 不做平滑处理
        result["data"]=aryData
        result["date"]=aryDate
        return result

    # 融资融券
    # 3--融资融券1 融资余额(万元) 融券余量(股)
    # 11--融资融券2 融资买入额(万元) 融资偿还额(万元)
    # 12--融资融券3 融券卖出量(股) 融券偿还量(股)
    # 13--融资融券4 融资净买入(万元) 融券净卖出(股)
    def GetMarginDetail(self, symbol, args) :
        df=self.TusharePro.margin_detail(ts_code=symbol,start_date=str(self.StartDate), end_date=str(self.EndDate))
        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        aryDate=df["trade_date"] # 截止日期
        aryDate[aryDate == ''] = 0
        aryDate = aryDate.astype(np.int).tolist()

        if (args[0]==3) :
            if (args[1]==2) : # 融券余量(股)
                aryData=np.multiply(df['rqyl'],100).tolist()
            else : # 融资余额(万元)
                aryData=np.divide(df['rzye'], 10000).tolist()
        elif (args[0]==11) :
            if (args[1]==2) : # 融资偿还额(万元)
                aryData=np.divide(df['rzche'],10000).tolist()
            else : # 融资买入额(万元)
                aryData=np.divide(df['rzmre'], 10000).tolist()
        elif (args[0]==12) :
            if (args[1]==2) : # 融券偿还量(股)
                aryData=np.multiply(df['rqchl'],100).tolist()
            else : # 融券卖出量(股)
                aryData=np.multiply(df['rqmcl'], 100).tolist()
        elif (args[0]==13) :
            if (args[1]==2) : # 融券净卖出(股) 融券卖出-融券偿还
                aryData=np.subtract(df['rqmcl'],df["rqchl"]).tolist()
            else : # 融资净买入(万元)  融资买入-融资偿还
                aryData=np.subtract(df['rzmre'], df['rzche']).tolist() 
        
        result={"type": 2}  # 类型2 根据'date'自动合并到K线数据上
        if (args[2]==0) :
            result["type"]=4    # 类型3 根据'date'自动合并到K线数据上 不做平滑处理
        result["data"]=aryData
        result["date"]=aryDate
        return result
    
    # 大宗交易
    def GetBlockTrade(self, symbol, args) :
        df=self.TusharePro.block_trade(ts_code=symbol,start_date=str(self.StartDate), end_date=str(self.EndDate))
        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        aryDate=df["trade_date"] # 截止日期
        aryDate[aryDate == ''] = 0
        aryDate = aryDate.astype(np.int).tolist()

        if (args[1]==2) : # 成交额(万元)
            aryData=np.divide(df['amount'],10000).tolist()
        else : # 成交均价(元)
            aryData=df['price'].tolist()
        
        result={"type": 2}  # 类型2 根据'date'自动合并到K线数据上
        if (args[2]==0) :
            result["type"]=4    # 类型3 根据'date'自动合并到K线数据上 不做平滑处理
        result["data"]=aryData
        result["date"]=aryDate
        return result

    # 沪深港股通持股明细
    def GetHKHold(self,symbol,args):
        df=self.TusharePro.hk_hold(ts_code=symbol,start_date=str(self.StartDate), end_date=str(self.EndDate))
        print(df)
        df=df.sort_index(ascending=False) # 数据要降序排
        print(df)

        aryDate=df["trade_date"] # 日期
        aryDate[aryDate == ''] = 0
        aryDate = aryDate.astype(np.int).tolist()

        if (args[1]==2) :   # 持股占比
            aryData=df['ratio'].tolist()
        else:   # 持股数量(股)
            aryData=df['vol'].tolist()

        result={"type": 2}  # 类型2 根据'date'自动合并到K线数据上
        if (args[2]==0) :
            result["type"]=4    # 类型3 根据'date'自动合并到K线数据上 不做平滑处理
        result["data"]=aryData
        result["date"]=aryDate
        return result

# 历史K线数据
class HistoryData() :
    def __init__(self) :
        self.Date=None
        self.YClose=None
        self.Open=None
        self.Close=None
        self.High=None
        self.Low=None
        self.Vol=None
        self.Amount=None
        self.Time=None
        self.FlowCapital=0   # 流通股本

        # 指数才有的数据
        self.Stop=None  # 停牌家数
        self.Up =None   # 上涨
        self.Down=None  # 下跌
        self.Unchanged=None # 平盘
        
####################################################################################################################
## TushareKLocalHQChartData K线使用文件读取, 其他全部使用Tushare数据接口
##
##
####################################################################################################################           
class TushareKLocalHQChartData(TushareHQChartData) :
    def __init__(self, token, startDate, endDate, cachePath):  
        TushareHQChartData.__init__(self, token, startDate, endDate)
        self.CachePath=cachePath  # K线缓存目录 /Day/日线 /Minute/分钟  
    
    # 获取K线API数据
    # right 复权 0=不复权 1=前复权 2=后复权
    # period 周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 9=季线
    # TODO: 分钟的没做
    def GetKLineAPIData(self, symbol, period, right, startDate, endDate) :
        filePath='{0}/day/{1}.csv'.format(self.CachePath,symbol)
        klineData=pd.read_csv(filePath)
        isSHSZIndex=IHQData.IsSHSZIndex(symbol) # 是否是指数

        aryDate=[]
        aryClose=[]
        aryYClose=[]
        aryOpen=[]
        aryHigh=[]
        aryLow=[]
        aryVol=[]
        aryAmount=[]

        aryDate=list(klineData["date"])
        aryClose=list(klineData["close"])
        aryYClose=list(klineData["yclose"])
        aryOpen=list(klineData["open"])
        aryHigh=list(klineData["high"])
        aryLow=list(klineData["low"])
        aryVol=list(klineData["vol"])
        aryAmount=list(klineData["amount"])
       
        # 复权 0=不复权 1=前复权 2=后复权
        if (isSHSZIndex==False and right in (1,2)) :
            self.CalculateRightDayData(right,aryDate,aryYClose,aryOpen,aryHigh,aryLow,aryClose)

        # 周期
        if (period in (1,2,3,9) or (period>=40001 and period<50000)) :
            periodData=self.CalcuatePeriodDayData(period,aryDate,aryYClose,aryOpen,aryHigh,aryLow,aryClose, aryVol, aryVol)
            aryDate=periodData["date"]
            aryYClose=periodData["yclose"]
            aryOpen=periodData["open"]
            aryHigh=periodData["high"]
            aryLow=periodData["low"]
            aryClose=periodData["close"]
            aryVol=periodData["vol"]
            aryAmount=periodData["amount"]

        cacheData={}
        cacheData['count']=len(aryDate)    # 数据个数
        cacheData['name']=symbol            # 股票名称
        cacheData['period']=period          # 周期
        cacheData['right']=right            # 复权

        cacheData["date"]=aryDate
        cacheData["yclose"]=aryYClose
        cacheData["open"]=aryOpen
        cacheData["high"]=aryHigh
        cacheData["low"]=aryLow
        cacheData["close"]=aryClose
        cacheData["vol"]=aryVol
        cacheData["amount"]=aryAmount

        start=startDate
        end=endDate
        if (cacheData['count']>0):
            start=aryDate[0]
            end=aryDate[-1]

        log="[TushareKLocalHQChartData::GetKLineAPIData] K线:{0} - period={1} right={2} count={3} date=[{4}, {5}]".format(symbol,period,right, cacheData['count'], start, end)
        print(log)

        return cacheData

    # 计算复权 0=不复权 1=前复权 2=后复权
    # Note:如果有复权因子,可以直接用复权因子算(财汇,万德等数据商的数据库都有)
    def CalculateRightDayData(self, right, aryDate, aryYClose,aryOpen,aryHigh, aryLow, aryClose) :
        if (right==0):
            return
        count=len(aryDate)
        if (count<=0):
            return

        if right==1 :
            index=count-1
            seed=1      #复权系数
            yClose=aryYClose[index]

            for i in range(index-1,-1,-1):
                index=i
                value=aryClose[index]
                if yClose != value : 
                    break

                yClose=aryYClose[index]

            for i in range(index,-1,-1) :
                index=i
                if yClose!=aryClose[index] :
                    seed *= yClose/aryClose[index]

                yClose=aryYClose[index]

                aryOpen[index]=aryOpen[index]*seed
                aryHigh[index]=aryHigh[index]*seed
                aryLow[index]=aryLow[index]*seed
                aryClose[index]=aryClose[index]*seed
                aryYClose[index]=aryYClose[index]*seed

        elif right==2 :
            index=0
            seed=1
            close=aryClose[index]

            for i in range(count) :
                index=i
                if close!=aryYClose[index]:
                    break

                close=aryClose[index]

            for i in range(index, count) :
                index=i
                if close!=aryYClose[index] :
                    seed *= close/aryYClose[index]

                close=aryClose[index]

                aryOpen[index]=aryOpen[index]*seed
                aryHigh[index]=aryHigh[index]*seed
                aryLow[index]=aryLow[index]*seed
                aryClose[index]=aryClose[index]*seed
                aryYClose[index]=aryYClose[index]*seed

    # 计算周期
    def CalcuatePeriodDayData(self,period, aryDate, aryYClose,aryOpen,aryHigh, aryLow, aryClose, aryVol, aryAmount) :
        # 新的周期数据
        aryDate2=[]
        aryYClose2=[]
        aryOpen2=[]
        aryHigh2=[]
        aryLow2=[]
        aryClose2=[]
        aryVol2=[]
        aryAmount2=[]
        
        startDate=0
        newData=None
        count=len(aryDate)
        dayCount=0
        for i in range(count) :
            isNewData=False
            date=aryDate[i]
            if period==1 : # 周线
                fridayDate=IHQData.GetFirday(date)
                if  fridayDate!=startDate :
                    isNewData=True
                    startDate=fridayDate
               
            elif period==2 : # 月线
                if int(date/100)!=int(startDate/100) :
                    isNewData=True
                    startDate=date
            elif period==3 : # 年线
                if int(date/10000)!=int(startDate/10000) :
                    isNewData=True
                    startDate=date
            elif (period>=40001 and period<50000):
                dayPeriod=period-40000
                if (dayCount>=dayPeriod) :
                    dayCount=0

                if (dayCount==0) :
                    isNewData=True
                    startDate=date

                dayCount+=1

            yClose=aryYClose[i]
            open=aryOpen[i]
            high=aryHigh[i]
            low=aryLow[i]
            close=aryClose[i]
            vol=aryVol[i]
            amount=aryAmount[i]
                  
            if isNewData :
                if (newData!=None):
                    aryYClose2.append(newData.YClose)
                    aryOpen2.append(newData.Open)
                    aryHigh2.append(newData.High)
                    aryLow2.append(newData.Low)
                    aryClose2.append(newData.Close)
                    aryVol2.append(newData.Vol)
                    aryAmount2.append(newData.Amount)
                    aryDate2.append(newData.Date)

                newData=HistoryData()
                newData.Date=date

                if open==None or close==None:
                    continue

                newData.Open=open
                newData.High=high
                newData.Low=low
                newData.YClose=yClose
                newData.Close=close
                newData.Vol=vol
                newData.Amount=amount
            else :
                if newData==None : 
                    continue
                if open==None or close==None :
                    continue

                if newData.Open==None or newData.Close==None :
                    newData.Open=open
                    newData.High=high
                    newData.Low=low
                    newData.YClose=yClose
                    newData.Close=close
                    newData.Vol=vol
                    newData.Amount=amount
                else :
                    if newData.High<high :
                        newData.High=high
                    if newData.Low>low :
                        newData.Low=low

                    newData.Close=close
                    newData.Vol+=vol
                    newData.Amount+=amount
                    newData.Date=date
         
        if (newData!=None):
            aryYClose2.append(newData.YClose)
            aryOpen2.append(newData.Open)
            aryHigh2.append(newData.High)
            aryLow2.append(newData.Low)
            aryClose2.append(newData.Close)
            aryVol2.append(newData.Vol)
            aryAmount2.append(newData.Amount)
            aryDate2.append(newData.Date)

        return { "date": aryDate2, "yclose":aryYClose2, "open":aryOpen2, "high":aryHigh2, "low":aryLow2, "close":aryClose2, "vol":aryVol2, "amount":aryAmount2 }

#####################################################################################################################
## 指标计算数据结果
##
##
##
#####################################################################################################################
class HQResultTest():
    def __init__(self):
        self.Result = []    # 保存所有的执行结果
        self.Error=[]
    
     # 执行成功回调
    def RunSuccess(self, symbol, jsData, jobID):
        self.Result.append({"Symbol":symbol, "Data":jsData})  # 保存结果
        log="{0} success".format(symbol)
        print (log)
        # print (jsData)

    # 执行失败回调
    def RunFailed(self, code, symbol, error,jobID) :
        log="{0}\n{1} failed\n{2}".format(code, symbol,error)
        self.Error.append(error)
        print(log)


def TestSingleStock() :
    TUSHARE_TOKEN=TushareConfig.TUSHARE_AUTHORIZATION_KEY
    if (TushareConfig.HQCHART_AUTHORIZATION_KEY==None) :
        TushareConfig.HQCHART_AUTHORIZATION_KEY=FastHQChart.GetTrialAuthorize(mac="A4-B1-C1-4B-4D-7B") # 请求试用账户, 把mac地址改成你本机的mac地址

    FastHQChart.Initialization(TushareConfig.HQCHART_AUTHORIZATION_KEY)

    runConfig={
        # 系统指标名字
        # "Name":"MA",
        "Script":'''
        //CALCSTOCKINDEX('SH600036', 'KDJ', 3);
        //STKINDI('sz300059','KDJ.T1#WEEK',9,4,4);
        //MA(C,M1);
        K:KDJ.K;
        D:KDJ.D;
        J:KDJ.J;

        K:KDJ.K#WEEK;
        D:KDJ.D#WEEK;
        J:KDJ.J#WEEK;
        //GPJYVALUE(1,1,0);
        //T2:C#WEEK;
        //T2:MA(C,M2);
        //T3:MA(C,M3);
        //T4:COST(10);
        //T5:TOTALCAPITAL;
        //T6:CAPITAL;
        //T9:DYNAINFO(8);
        //T7:FINANCE(18);
        //T8:FINANCE(40);
        ''',
        # 脚本参数
        "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ],
        # 周期 复权
        "Period":0, "Right":0,
        "Symbol":"600000.sh",

        #jobID (可选)
        "JobID":"1234-555-555"
    }

    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=TushareHQChartData(TUSHARE_TOKEN,startDate=20200421, endDate=20201231)    # 实例化数据类
    result=HQResultTest()   # 实例计算结果接收类

    start = time.process_time()

    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)

    elapsed = (time.process_time() - start)
    log="TestSingleStock() Time used:{0}, 股票{1}".format(elapsed, runConfig['Symbol'])
    print(log)



# TestSingleStock()