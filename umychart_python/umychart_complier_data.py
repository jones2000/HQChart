###########################################################################
#
#   数据结构类
#
############################################################################
import sys
import time
import datetime

from umychart_complier_help  import JSComplierHelper

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

    def IsVaild(self, type=5) : # 开高低收昨收数据时候有效
        if type==5 :
            return self.Open>0 and self.High>0 and self.Low>0 and self.Close>0 and self.YClose>0
        elif type==4 :
            return self.Open>0 and self.High>0 and self.Low>0 and self.Close>0

    @staticmethod
    def Copy(data) :
        newData=HistoryData()
        newData.Date=data.Date
        newData.YClose=data.YClose
        newData.Open=data.Open
        newData.Close=data.Close
        newData.High=data.High
        newData.Low=data.Low
        newData.Vol=data.Vol
        newData.Amount=data.Amount
        newData.Time=data.Time
        newData.FlowCapital=data.FlowCapital

        newData.Stop=data.Stop
        newData.Up=data.Up
        newData.Down=data.Down
        newData.Unchanged=data.Unchanged

        return newData

    @staticmethod   # 数据复权拷贝
    def CopyRight(data,seed=1) :
        newData=HistoryData()
        newData.Date=data.Date
        newData.YClose=data.YClose*seed
        newData.Open=data.Open*seed
        newData.Close=data.Close*seed
        newData.High=data.High*seed
        newData.Low=data.Low*seed

        newData.Vol=data.Vol
        newData.Amount=data.Amount
        newData.FlowCapital=data.FlowCapital

        return newData


class MinuteData :
    def __init__(self) :
        self.Close=None
        self.Open=None
        self.High=None
        self.Low=None
        self.Vol=None
        self.Amount=None
        self.DateTime=None
        self.Increase=None
        self.Risefall=None
        self.AvPrice=None

# 单指标数据
class SingleData() :
    def __init__(self, date=None, value=None) :
        self.Date=date      # 日期
        self.Value=value    # 数据  (可以是一个数组)
        self.TestData=None  # 内部测试用

class ChartData:
    def __init__(self, data, dataType=None) :
        self.Data=data
        self.Period=0                           # 周期 0=日线 1=周线 2=月线 3=年线
        self.Right=0                            # 复权 0=不复权 1=前复权 2=后复权
        self.DataType=dataType

    # 获取收盘价
    def GetClose(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Close
        return result

    def GetYClose(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].YClose
        return result

    def GetHigh(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].High
        return result

    def GetLow(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Low
        return result

    def GetOpen(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Open
        return result

    def GetVol(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Vol
        return result

    def GetAmount(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Amount
        return result

    def GetUp(self) :   # 上涨家数
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Up
        return result

    def GetDown(self) : # 下跌家数
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Down
        return result

    def GetYear(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=int(self.Data[i].Date/10000)
        return result

    def GetMonth(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            result[i]=int(self.Data[i].Date%10000/100)
        return result

    def GetDate(self) :
        result=JSComplierHelper.CreateArray(len(self.Data))
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Date
        return result

    def GetTime(self) :
        result=JSComplierHelper.CreateArray(len(self.Data))
        for i in range(len(self.Data)) :
            result[i]=self.Data[i].Time
        return result

    def GetWeek(self) :
        result=[None] * len(self.Data)
        for i in range(len(self.Data)) :
            value=self.Data[i].Date
            if value==None :
                result[i]=None
                continue

            date = datetime.datetime.strptime(str(value), '%Y%m%d')
            day=date.weekday()
            result[i]=day+1
                
        return result

    
    # 复权  0 不复权 1 前复权 2 后复权
    def GetRightDate(self,right) :
        result=[]
        if len(self.Data)<=0 :
             return result
        
        result=[None] * len(self.Data)
        if right==1 :
            count=len(self.Data)
            index=count-1
            seed=1      #复权系数
            yClose=self.Data[index].YClose
            result[index]=HistoryData.Copy(self.Data[index])

            for i in range(index-1,-1,-1):
                index=i
                if yClose!=self.Data[index].Close : 
                    break

                result[index]=HistoryData.Copy(self.Data[index])
                yClose=self.Data[index].YClose

            for i in range(index,-1,-1) :
                index=i
                if yClose!=self.Data[index].Close:
                    seed *= yClose/self.Data[index].Close

                result[index]=HistoryData.CopyRight(self.Data[index],seed)
                yClose=self.Data[index].YClose

        elif right==2 :
            index=0
            seed=1
            close=self.Data[index].Close
            result[index]=HistoryData.Copy(self.Data[index])

            for i in range(len(self.Data)) :
                index=i
                if close!=self.Data[index].YClose:
                    break

                result[index]=HistoryData.Copy(self.Data[index])
                close=self.Data[index].Close

            for i in range(index, len(self.Data)) :
                index=i
                if close!=self.Data[index].YClose :
                    seed *= close/self.Data[index].YClose

                result[index]=HistoryData.CopyRight(self.Data[index],seed)
                close=self.Data[index].Close

        return result


    # 周期数据 1=周 2=月 3=年
    def GetPeriodData(self, period) :
        if period in (1,2,3) :
            return self.GetDayPeriodData(period)
        if period in (5,6,7,8) :
            return self.GetMinutePeriodData(period)

    # 计算周,月,年
    def GetDayPeriodData(self, period) :
        result=[]
        startDate=0
        newData=None
        for dayData in self.Data :
            isNewData=False

            if period==1 : # 周线
                fridayDate=ChartData.GetFirday(dayData.Date)
                if  fridayDate!=startDate :
                    isNewData=True
                    startDate=fridayDate
               
            elif period==2 : # 月线
                if int(dayData.Date/100)!=int(startDate/100) :
                    isNewData=True
                    startDate=dayData.Date
            elif period==3 : # 年线
                if int(dayData.Date/10000)!=int(startDate/10000) :
                    isNewData=True
                    startDate=dayData.Date
                  
            if isNewData :
                newData=HistoryData()
                newData.Date=dayData.Date
                result.append(newData)

                if dayData.Open==None or dayData.Close==None:
                    continue

                newData.Open=dayData.Open
                newData.High=dayData.High
                newData.Low=dayData.Low
                newData.YClose=dayData.YClose
                newData.Close=dayData.Close
                newData.Vol=dayData.Vol
                newData.Amount=dayData.Amount
                newData.FlowCapital=dayData.FlowCapital
            else :
                if newData==None : 
                    continue
                if dayData.Open==None or dayData.Close==None :
                    continue

                if newData.Open==None or newData.Close==None :
                    newData.Open=dayData.Open
                    newData.High=dayData.High
                    newData.Low=dayData.Low
                    newData.YClose=dayData.YClose
                    newData.Close=dayData.Close
                    newData.Vol=dayData.Vol
                    newData.Amount=dayData.Amount
                    newData.FlowCapital=dayData.FlowCapital
                else :
                    if newData.High<dayData.High :
                        newData.High=dayData.High
                    if newData.Low>dayData.Low :
                        newData.Low=dayData.Low

                    newData.Close=dayData.Close
                    newData.Vol+=dayData.Vol
                    newData.Amount+=dayData.Amount
                    newData.FlowCapital+=dayData.FlowCapital
                    newData.Date=dayData.Date
         
        return result

    @staticmethod 
    def GetFirday(value) :
        date = datetime.datetime.strptime(str(value), '%Y%m%d')
        day=date.weekday()
        if day==4 : 
            return value

        date+=datetime.timedelta(days=4-day)
        fridayDate= date.year*10000+date.month*100+date.day
        return fridayDate

    # 计算分钟
    def GetMinutePeriodData(self, period) :
        result = []
        periodDataCount = 5
        if period == 5 :
            periodDataCount = 5
        elif period == 6 :
            periodDataCount = 15
        elif period == 7 :
            periodDataCount = 30
        elif period == 8 :
            periodDataCount = 60
        else :
            return self.Data
        
        bFirstPeriodData = False
        newData = None
        dataCount=len(self.Data)
        i=-1
        while i<dataCount :    # for (var i = 0; i < this.Data.length; )
            bFirstPeriodData = True

            # for (var j = 0; j < periodDataCount && i < this.Data.length; ++i)
            j=0 
            while j<periodDataCount and i<dataCount :
                i+=1
                if i>=dataCount :
                    break
            
                if bFirstPeriodData :
                    newData = HistoryData()
                    result.append(newData)
                    bFirstPeriodData = False

                minData = self.Data[i]
                if minData == None :
                    j+=1
                    continue

                if minData.Time in(925 ,930 ,1300) :
                    pass
                else :
                    j+=1

                newData.Date = minData.Date
                newData.Time = minData.Time
                if minData.Open==None or minData.Close==None :
                    continue
                if newData.Open==None or newData.Close==None :
                    newData.Open=minData.Open
                    newData.High=minData.High
                    newData.Low=minData.Low
                    newData.YClose=minData.YClose
                    newData.Close=minData.Close
                    newData.Vol=minData.Vol
                    newData.Amount=minData.Amount    
                    newData.FlowCapital=minData.FlowCapital 
                else :
                    if newData.High<minData.High :
                        newData.High=minData.High
                    if newData.Low>minData.Low :
                        newData.Low=minData.Low
                    newData.Close=minData.Close
                    newData.Vol+=minData.Vol
                    newData.Amount+=minData.Amount
                    newData.FlowCapital+=minData.FlowCapital  

        return result


    # 叠加数据和主数据拟合,去掉主数据没有日期的数据
    def GetOverlayData(self,overlayData) :
        count=len(self.Data)
        overlayDataLen=len(overlayData)
        result=[None]*len(self.Data)

        i,j =0,0
        while i<count :
            date=self.Data[i].Date
            if j>overlayDataLen :
                result[i]=HistoryData()
                result[i].Date=date
                i+=1
                continue

            overlayDate=overlayData[j].Date

            if overlayDate==date :
                result[i]=HistoryData()
                result[i].Date=overlayData[j].Date
                result[i].YClose=overlayData[j].YClose
                result[i].Open=overlayData[j].Open
                result[i].High=overlayData[j].High
                result[i].Low=overlayData[j].Low
                result[i].Close=overlayData[j].Close
                result[i].Vol=overlayData[j].Vol
                result[i].Amount=overlayData[j].Amount

                # 涨跌家数数据
                result[i].Stop=overlayData[j].Stop
                result[i].Up=overlayData[j].Up
                result[i].Down=overlayData[j].Down
                result[i].Unchanged=overlayData[j].Unchanged

                j+=1
                i+=1
            elif overlayDate<date :
                j+=1
            else :
                result[i]= HistoryData()
                result[i].Date=date
                i+=1

        return result

    # 叠加数据和主数据拟合,去掉主数据没有日期的数据 分钟K线
    def GetOverlayMinuteData(self,overlayData) :
        count=len(self.Data)
        overlayDataLen=len(overlayData)
        result=[None]*len(self.Data)

        i,j =0,0
        while i<count :
            date=self.Data[i].Date
            time=self.Data[i].Time
            if j>overlayDataLen :
                result[i]=HistoryData()
                result[i].Date=date
                result[i].Time=time
                i+=1
                continue

            overlayDate=overlayData[j].Date
            overlayTime=overlayData[j].Time

            if overlayDate==date and overlayTime==time:
                result[i]=HistoryData()
                result[i].Date=overlayData[j].Date
                result[i].Time=overlayData[j].Time
                result[i].YClose=overlayData[j].YClose
                result[i].Open=overlayData[j].Open
                result[i].High=overlayData[j].High
                result[i].Low=overlayData[j].Low
                result[i].Close=overlayData[j].Close
                result[i].Vol=overlayData[j].Vol
                result[i].Amount=overlayData[j].Amount

                # 涨跌家数数据
                result[i].Stop=overlayData[j].Stop
                result[i].Up=overlayData[j].Up
                result[i].Down=overlayData[j].Down
                result[i].Unchanged=overlayData[j].Unchanged

                j+=1
                i+=1
            elif overlayDate<date or (overlayData==date and overlayTime<time):
                j+=1
            else :
                result[i]= HistoryData()
                result[i].Date=date
                result[i].Time=time
                i+=1

        return result


    # 把财报数据拟合到主图数据,返回 SingleData 数组
    def GetFittingFinanceData(self,financeData) :
        dataLen=len(self.Data)
        financeLen=len(financeData)
        result=JSComplierHelper.CreateArray(dataLen)

        i,j = 0,0
        while i<dataLen :
            date=self.Data[i].Date
            if j+1<financeLen :
                if financeData[j].Date<date and financeData[j+1].Date<=date :
                    j+=1
                    continue

            item=SingleData()
            item.Date=date
            if j<financeLen :
                item.Value=financeData[j].Value
                item.TestData=financeData[j].Date   # 财务日期 调试用
            else :
                item.Value=None
                item.TestData=None
            
            result[i]=item

            i+=1
              
        return result


    # 市值计算 financeData.Value 是股数
    def GetFittingMarketValueData(self,financeData) :
        dataLen=len(self.Data)
        financeLen=len(financeData)
        result=JSComplierHelper.CreateArray(dataLen)

        i,j =0,0
        while i<dataLen :
            date=self.Data[i].Date
            price=self.Data[i].Close

            if j+1<financeLen :
                if financeData[j].Date<date and financeData[j+1].Date<=date :
                    j+=1
                    continue

            item=SingleData()
            item.Date=date
            item.Value=financeData[j].Value*price  # 市值计算 收盘价*股数
            item.TestDate=financeData[j].Date   # 财务日期 调试用
            result[i]=item

            i+=1

        return result

    # SingleData 转成单数组
    def GetValue(self) :
        dataLen=len(self.Data)
        result=JSComplierHelper.CreateArray(dataLen)

        for i in range(dataLen) :
            if self.Data[i] and self.Data[i].Value!=None :
                    result[i]=self.Data[i].Value
           
        return result

    # SingleData 周期合并 日线
    def GetPeriodSingleData(self,period) :
        result=[]
        startDate ,newData =0,None
        
        for i in range (len(self.Data)) :
            isNewData=False
            dayData=self.Data[i]
            if dayData==None or dayData.Date==None :
                continue

            if period==1 :   # 周线
                fridayDate=ChartData.GetFirday(dayData.Date)
                if fridayDate!=startDate :
                    isNewData=True
                    startDate=fridayDate
                    
            elif period==2 :# 月线
                if int(dayData.Date/100)!=int(startDate/100) :
                    isNewData=True
                    startDate=dayData.Date
               
            elif period==3: # 年线
                if int(dayData.Date/10000)!=int(startDate/10000) :
                    isNewData=True
                    startDate=dayData.Date
                   

            if (isNewData) :
                newData=SingleData()
                newData.Date=dayData.Date
                newData.Value=dayData.Value
                result.append(newData)
            else :
                if newData==None :
                    continue
                if dayData.Value==None :
                    continue
                if newData.Value==None :
                    newData.Value=dayData.Value

        return result

    # 计算股息率 股息率TTM：过去4个季度现金分红总额/总市值 * 100%
    def CalculateDividendYield(self,cashData, marketValue) :
        if not marketValue :
            return []

        dataLen, cashLen = len(self.Data), len(cashData)
        dividendYield=[]
        j=0
        for i in range(dataLen) :
            day=self.Data.Data[i]
            market=marketValue.MarketValue[i]
            if not day or not market :
                continue

            item=SingleData()
            item.Date=day.Date
            item.Value=0

            if (j+1<cashLen) :
                if (cashData[j].Date<day.Date and cashData[j+1].Date<=day.Date) :
                    j+=1
                    i-=1
                   
            if (j<cashLen) :
                cash=cashData[j]
                endDate=cash.Date+10000    # 1年有效

                if (day.Date>=cash.Date and day.Date<=endDate and JSComplierHelper.IsDivideNumber(market.Value) and JSComplierHelper.IsNumber(cash.Value)) :
                    item.Value=cash.Value/market.Value*100
           
            dividendYield.append(item)

        return dividendYield


    # 以主图数据 拟合,返回 SingleData 数组
    def GetFittingData(self, overlayData) :
        dataLen=len(self.Data)
        result=JSComplierHelper.CreateArray(dataLen)

        i,j =0,0
        while i<dataLen :
            date=self.Data[i].Date
            if j>=len(overlayData) :
                i+=1
                continue

            overlayDate=overlayData[j].Date

            if overlayDate==date :
                item=SingleData()
                item.Date=overlayData[j].Date
                item.Value=overlayData[j].Value
                result[i]=item
                j+=1
                i+=1
            
            elif overlayDate<date :
                j+=1
            else :
                result[i]=SingleData()
                result[i].Date=date
                i+=1

        return result

    # 缺省数据使用 emptyValue填充
    def GetFittingData2(self,overlayData,defaultValue) :
        dataLen=len(self.Data)
        result=JSComplierHelper.CreateArray(dataLen)
        i,j = 0,0
        while i<dataLen :
            date=self.Data[i].Date
            if j>=len(overlayData) :
                result[i]=SingleData()
                result[i].Date=date
                result[i].Value=defaultValue
                i+=1
                continue

            overlayDate=overlayData[j].Date

            if overlayDate==date :
                item=SingleData()
                item.Date=overlayData[j].Date
                item.Value=overlayData[j].Value
                result[i]=item
                j+=1
                i+=1
            elif overlayDate<date :
                j+=1
            else :
                result[i]=SingleData()
                result[i].Date=date
                result[i].Value=defaultValue
                i+=1

        return result

    
