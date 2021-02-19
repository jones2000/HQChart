
from hqchartpy2_fast import FastHQChart,IHQData,PERIOD_ID
import json
import time


class HQChartData(IHQData) :
    def __init__(self):
        self.Cache={}   #缓存
    
    def GetKLineData(self, symbol, period, right, jobID):
        if (symbol in self.Cache):
            return self.Cache[symbol]

        kdataFile="../data/kdata/0/{0}.json".format(symbol)    # 日线数据作为测试数据
        with open(kdataFile,encoding='utf-8') as f:
            kData = json.load(f)
            #kData['data']=kData['data'][0:500]

        dataCount=len(kData['data'])
        name=kData['name']

        cacheData={}
        cacheData['count']=dataCount    # 数据个数
        cacheData['name']=name          # 股票名称
        cacheData['period']=PERIOD_ID.DAY_ID # 日K
        cacheData['right']=0    # 不复权

        aryDate=[]
        aryClose=[]
        aryYClose=[]
        aryOpen=[]
        aryHigh=[]
        aryLow=[]
        aryVol=[]
        aryAmount=[]
        
        for i in range(dataCount) :
            item=kData['data'][i]
            aryDate.append(item[0])
            aryYClose.append(item[1])
            aryOpen.append(item[2])
            aryHigh.append(item[3])
            aryLow.append(item[4])
            aryClose.append(item[5])
            aryVol.append(item[6])
            aryAmount.append(item[7])

        cacheData["date"]=aryDate
        # cacheData["time"]=aryTime
        cacheData["yclose"]=aryYClose
        cacheData["open"]=aryOpen
        cacheData["high"]=aryHigh
        cacheData["low"]=aryLow
        cacheData["close"]=aryClose
        cacheData["vol"]=aryVol
        cacheData["amount"]=aryAmount

        # cacheData["advance"]=aryAdvance
        # cacheData["decline"]=aryDecline

        log="K线:{0} - period={1} right={2} count={3}".format(symbol,period,right,dataCount)
        print(log)

        self.Cache[symbol]=cacheData
        return cacheData

    def GetFinance(self,symbol, id, period,right,kcount,jobID) :

        if (id==7) :
            pyCacheData=[18653471415, 18653471415,21618279922,21618279922,28103763899, 28103763899,28103763899,28103763899]  # 数据
            pyCacheDate=[20170519, 20170830,20170906, 20180428,20180830, 20190326,20190824,20200425]  # 日期
            data={"type": 2, "date":pyCacheDate, "data":pyCacheData}
            return data
        else :
            pyCacheData=[]
            for i in range(kcount) :    # 生成财务数据
                pyCacheData.append(8976549.994+i)

            data={"type": 1, "data":pyCacheData}
            return data

    def GetDynainfo(self,symbol, id,period,right, kcount,jobID):
        data={"type": 0, "data":5}
        return data

    def GetCapital(self,symbol,period,right, kcount,jobID):
        data={"type": 0, "data":455555555.99}
        return data

    # 历史所有的流通股 
    def GetHisCapital(self,symbol, period, right, kcount,jobID):
        pyCacheData=[]
        for i in range(kcount) :    # 生成流通股数据
            pyCacheData.append(8976549.994+i)

        data={"type": 1, "data":pyCacheData}
        return data

    # 大盘数据
    def GetIndex(self, symbol, varName, period,right, kcount,jobID):
        if (varName==u'INDEXA') :   # 大盘成交额
            pass
        elif (varName==u'INDEXC') : # 大盘收盘价
            pass
        elif (varName==u'INDEXH') : # 大盘最高价
            pass
        elif (varName==u'INDEXL') : # 大盘最低价
            pass
        elif (varName==u'INDEXO') : # 大盘开盘价
            pass
        elif (varName==u'INDEXV') : # 大盘成交量
            pass
        elif (varName==u'INDEXADV') : # 上涨家数
            pass
        elif (varName==u'INDEXDEC') : # 下跌家数
            pass

        # 测试数据
        pyCacheData=[]
        for i in range(kcount) :
            pyCacheData.append(2888.8+i)
        data={"type": 1, "data":pyCacheData}
        return data

class HQResultTest():
    def __init__(self):
        self.Result = []    # 保存所有的执行结果
        self.IsOutLog=True  # 是否输出日志
    
     # 执行成功回调
    def RunSuccess(self, symbol, jsData, jobID):
        self.Result.append({"Symbol":symbol, "Data":jsData})  # 保存结果
        if (self.IsOutLog) :
            log="{0} success".format(symbol)
            print (log)
            print (jsData)

    # 执行失败回调
    def RunFailed(self, code, symbol, error,jobID) :
        log="{0}\n{1} failed\n{2}".format(code, symbol,error)
        print(log)


# 单股票指标
def TestSingleStock() :
    runConfig={
        # 系统指标名字
        # "Name":"MA",
        "Script":'''
       T2:FINANCE(7); 
       T3:FINONE(1,2,3);
        ''',
    # 脚本参数
        # "Args":[ { "Name": 'N1', "Value": 5 },{ "Name": 'N2', "Value": 10 },{ "Name": 'N3', "Value": 15 } ],
        "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ],
        # 周期 复权
        "Period":1, "Right":0,
        "Symbol":"600000.sh",

        #jobID (可选)
        "JobID":"1234-555-555"
    }

    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=HQChartData()    # 实例化数据类
    result=HQResultTest()   # 实例计算结果接收类
    result.IsOutLog=True

    start = time.process_time()

    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)

    elapsed = (time.process_time() - start)
    log="TestSingleStock() Time used:{0}, 股票{1}".format(elapsed, runConfig['Symbol'])
    print(log)



# 股票池
def TestMultiStock() :
    runConfig={
        # 系统指标名字
        # "Name":"MA",
        # 执行的脚本
        "Script":'''
        JJ:=(HIGH+LOW+CLOSE)/3;
        QJ0:=VOL/IF(HIGH=LOW,4,HIGH-LOW);
        QJ1:=QJ0*(MIN(OPEN,CLOSE)-LOW);
        QJ2:=QJ0*(JJ-MIN(CLOSE,OPEN));
        QJ3:=QJ0*(HIGH-MAX(OPEN,CLOSE));
        QJ4:=QJ0*(MAX(CLOSE,OPEN)-JJ);
        DDX:=IF(HIGH=LOW,4*QJ0,((QJ1+QJ2)-(QJ3+QJ4)))/SUM(VOL,10)*100;
        DDY:=((QJ2+QJ4)-(QJ1+QJ3))/SUM(VOL,10)*100;
        DDZ:=((QJ1+QJ2)-(QJ3+QJ4))/((QJ1+QJ2)+(QJ3+QJ4))*100*17;
        AA:((DDX+DDY+DDZ)/3);
        ''',
        # 脚本参数
        # "Args":[ { "Name": 'N1', "Value": 5 },{ "Name": 'N2', "Value": 10 },{ "Name": 'N3', "Value": 15 } ],
        "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ],
        # 周期 复权
        "Period":0, "Right":0,
        # 股票池
        "Symbol":["600000.sh","600007.sh","000001.sz","600039.sh"],
        # 输出数据个数 如果只需要最后几个数据可以填几个的个数, 数据从最后开始返回的, 如1=返回最后1个数据 2=返回最后2个数组,  -1=返回所有的数据
        "OutCount":1,
    }

    # 批量执行的股票
    #for i in range(3700) :
        # runConfig["Symbol"].append("600000.sh")
    #    runConfig["Symbol"].append("000421.sz")

    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=HQChartData()    # 实例化数据类
    result=HQResultTest()   # 实例计算结果接收类
    result.IsOutLog=False
   

    # 预加载K线数据
    # start = time.process_time()
    # loadCount=0
    # loadCount=HQChart.PreLoadKData(runConfig,data,guid=strGuid)
    # elapsed = (time.process_time() - start)
    # log="加载数据 Time used:{0}, 股票个数:{1}".format(elapsed, loadCount)
    # print(log)

    start = time.process_time()
    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)
    elapsed = (time.process_time() - start)
    log="执行指标 Time used:{0}, 股票个数:{1}".format(elapsed, len(runConfig['Symbol']))
    print(log)


if __name__ == "__main__":

    key="oTjOc1CNCuxtcAqs6+/FHeKmYcPpFv+M9y7seNd6eBTE9tq1El9mGLi7bj6gtMf3RpWtGJ0K7Tu2wbEBUjunGb5mgGskWii4vlUK+5XFr7fI/nDysxdWOebKqJ+RLif0MptDIGdQP8nbyw1osZdXJuWpb4RYYNrzeXtbQVDI2UNnuJUm8DpGs/SgKrw9l+Q2QT/hMnJ6/MMsjMpsgHmV5iHWQTzzAU2QXnX5rtMuAISFKcLlbPzKF809lexHbtqXqoPxQfJkqh0YzTyJOZLhkvZ+Sm5vIu4EhJjIQBTLrX229t8rIvwKwLZ/UEuewSQFgq2QkpBQMPlBU/HVy5h7WQ=="
    FastHQChart.Initialization(key)

    jsSystemIndex=json.dumps(FastHQChart.HQCHART_SYSTEM_INDEX)
    FastHQChart.AddSystemIndex(jsSystemIndex)

    TestSingleStock()

    TestMultiStock()

