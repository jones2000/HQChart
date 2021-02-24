#############################################################
## hqchartPy2使用tushare数据对接测试用例
##
##
#############################################################

from hqchartpy2_fast import FastHQChart,PERIOD_ID
from hqchartpy2_pandas import HQChartPy2Helper
from hqchartpy2_tushare import TushareHQChartData, TushareKLocalHQChartData, HQResultTest 
from hqchartpy2_tushare_config import TushareConfig

import json
import time
import numpy as np 
import pandas as pd
import datetime
import uuid

class HQSelectDataFrameResult():
    def __init__(self):
        self.dfResult={}    #保存所有的执行结果 key=代码 value=df数据
        self.Error=[]
    
     # 执行成功回调
    def RunSuccess(self, symbol, jsData, jobID):
        log="[HQSelectDataFrameResult::RunSuccess] {0} success".format(symbol)
        print (log)
        data=HQChartPy2Helper.JsonDataToPandas(jsData, symbol)  # 指标数据转dataFrame
        self.dfResult[symbol]=data
        
    # 执行失败回调
    def RunFailed(self, code, symbol, error,jobID) :
        log="[HQSelectDataFrameResult::RunFailed] {0}\n{1} failed\n{2}".format(code, symbol,error)
        self.Error.append(error)
        print(log)



# 股票执行测试
def RunIndexTest(runConfig):
    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=TushareKLocalHQChartData(TushareConfig.TUSHARE_AUTHORIZATION_KEY,startDate=20200421, endDate=20201231, cachePath="test_data\\")    # 实例化数据类

    result=HQSelectDataFrameResult()   # 实例计算结果接收类

    start = time.process_time()

    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)

    elapsed = (time.process_time() - start)
    
    log='''RunSingleStockIndex() 
---------------------------------------------------------------
耗时:{0}s, 
股票个数:{1}, 
脚本:
{2}
执行是否成功:{3}
---------------------------------------------------------------'''.format(elapsed,len(runConfig['Symbol']), runConfig["Script"], res)
    print(log)
    if (res==True):
        for item in result.dfResult.items() :
            symbol= item[0]
            print('{0} 数据：'.format(symbol))
            print(item[1])


if __name__ == '__main__':
    if (TushareConfig.HQCHART_AUTHORIZATION_KEY==None) :
        # 请求试用账户, 把mac地址改成你本机的mac地址
        TushareConfig.HQCHART_AUTHORIZATION_KEY=FastHQChart.GetTrialAuthorize(mac="A4-B1-C1-4B-4D-7B")
    FastHQChart.Initialization(TushareConfig.HQCHART_AUTHORIZATION_KEY) # 初始化HQChartPy插件

    runConfig={
        # 指标脚本
        "Script":'''
MO:MACD.MACD#MONTH,COLORYELLOW;     
WE:MACD.MACD#WEEK,COLORMAGENTA,LINETHICK1;             
DA2:MACD.MACD#MULTIDAY,COLORWHITE,LINETHICK1;    
DA:MACD.MACD#DAY,COLORGREEN;
        ''',
        # 脚本参数
        "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ],
        # 周期 复权
        "Period":0, # 周期 0=日线 1=周线 2=月线 3=年线 9=季线
        "Right":0,  # 复权 0=不复权 1=前复权 2=后复权
        "Symbol":["000001.sz","600000.sh"],

        "OutCount":100, # 输出最新的100条数据
    
        #jobID (可选)
        "JobID":str(uuid.uuid1())
    }

    # 测试股票指标计算
    RunIndexTest(runConfig)