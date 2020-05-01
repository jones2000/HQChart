#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


#####################################################################
#
#   股票数据类(读取本地json文件)
#   如果要对接自己的格式数据 参看这个样式对接就可以
#
#####################################################################
import json
from umychart_complier_jssymboldata import JSSymbolData
from umychart_complier_job import JS_EXECUTE_JOB_ID, JobItem, HQ_DATA_TYPE,SymbolOption
from umychart_complier_data import ChartData, HistoryData, MinuteData, SingleData
from umychart_complier_help  import JSComplierHelper, Variant


# 派生数据类 重写的自己需要数据
class SymbolDataJson(JSSymbolData):

    @staticmethod # 创建函数,静态
    def Create(ast, option=None, procThrow=None):
        obj=SymbolDataJson(ast,option,procThrow)
        return obj  

    # 下载股票数据
    def GetSymbolData(self) :
        if self.Data:   # 已经有了就不要下载了
            return

        if self.DataType==HQ_DATA_TYPE.MINUTE_ID:  # 当天分钟数据
            # 格式和1分钟K线一样
            return 
        
        bDayPeriod=ChartData.IsDayPeriod(self.Period,True)
        bMinutePeriod=ChartData.IsMinutePeriod(self.Period,True)
        filePath="./data/kdata/{0}/{1}.json".format(self.Period, self.Symbol)
        print('[SymbolDataJson::GetSymbolData] read file', filePath)
        with open(filePath,'r', encoding='utf-8') as jsonFile:
            jsonRoot = json.load(jsonFile)
        data=jsonRoot['data']

        kData=[]
        for item in data :
            if item[2]<=0 :  #停牌的数据剔除
                continue
            kItem=HistoryData()
            kItem.Date = item[0]
            kItem.Open = item[2]
            kItem.YClose =item[1]
            kItem.Close = item[5]
            kItem.High = item[3]
            kItem.Low = item[4]
            kItem.Vol = item[6]    # 原始单位股
            kItem.Amount = item[7]
            if bMinutePeriod :
                kItem.Time=item[8] # 分钟K线 时间字段
            kData.append(kItem)
        
        self.SourceData=ChartData(data=kData,dataType=self.DataType)
        self.Data=ChartData(data=kData, dataType=self.DataType)
        self.Data.Right=self.Right
        self.Data.Period=self.Period
        self.Name=jsonRoot['name']

        # !!如果你的数据已经复权了或计算周期了 可以不执行下面的
        if self.Right>0 :    # 复权
            rightData=self.Data.GetRightDate(self.Right)
            self.Data.Data=rightData

        if ( ChartData.IsDayPeriod(self.Period, False) or ChartData.IsMinutePeriod(self.Period,False) ) :   # 周期数据
            periodData=self.Data.GetPeriodData(self.Period)
            self.Data.Data=periodData

    # 下载财务数据
    def GetFinanceData(self, jobID, job) :
        if jobID in self.FinanceData :
            return
        
        # jobID对应关系详见 JS_EXECUTE_JOB_ID.MAP_FINNANCE_ID
        id=JS_EXECUTE_JOB_ID.GetFinanceIDByJobID(jobID)
        print("[JSSymbolData::GetFinanceData] jobID={0}, id={1}, Function={2} variant={3}".format(jobID, id, job.FunctionName, job.VariantName ))

        filePath="./data/finance/{0}/{1}.json".format(id, self.Symbol)
        print('[SymbolDataJson::GetFinanceData] read file', filePath)
        with open(filePath,'r', encoding='utf-8') as jsonFile:
            jsonRoot = json.load(jsonFile)
        data=jsonRoot['data']

        aryData=[]
        for item in data :
            dataItem=SingleData()
            dataItem.Date=item[0]
            dataItem.Value=item[1]
            aryData.append(dataItem)

        aryFixedData=self.Data.GetFittingFinanceData(aryData) # 财务数据和K线数据对齐
        bindData=ChartData(data=aryFixedData)
        aryValue=bindData.GetValue()
        self.FinanceData[jobID]=aryValue
   