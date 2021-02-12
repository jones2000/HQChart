from flask import Flask, render_template
from flask import request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO,emit,disconnect

from hqchartpy2_fast import FastHQChart
from hqchartpy2_pandas import HQChartPy2Helper
from hqchartpy2_tushare import TushareHQChartData,HQResultTest 
from hqchartpy2_tushare_config import TushareConfig

import json
import time
import numpy as np 
import pandas as pd
import datetime
import uuid


TEST_CODE=''' 
T:MA(C,M1);
T2:MA(C,M2);
T3:MA(C,M3);
T4:COST(10);
T5:TOTALCAPITAL;
T6:CAPITAL;
T9:DYNAINFO(8);
T7:FINANCE(18);
T8:FINANCE(40);
'''

app = Flask(__name__)
CORS(app) # 跨域 
app.config["DEBUG"] = True
socketio = SocketIO(app,async_mode=None,cors_allowed_origins="*")


@app.route('/', methods=['GET'])
def home():
    version=FastHQChart.GetVersion()
    return '''<h1>HQChartPy2</h1>
<p>版本号:{0}</p>
<p>授权信息:{1}</p>'''.format(version, FastHQChart.Authorize)

@app.route('/api/Run', methods=['POST', "GET"])
def HQChartPy_Run():
    symbol='600000.sh'
    startDate=20200421
    endDate=20201231
    period=0
    right=0
    jobID=str(uuid.uuid1())

    if (request.method=="POST") :
        # data = request.get_data()
        if (request.mimetype=="application/x-www-form-urlencoded") :
            requestData=request.form
        else :
            requestData = json.loads(request.get_data(as_text=True))

        symbol=requestData['Symbol']
        script=requestData["Script"]
        args=[]

        # 可选参数
        if ("Period" in requestData):
            period=requestData["Period"]
        if ("Right" in requestData) :
            right=requestData["Right"]
        if ("Args" in requestData) :
            args=requestData["Args"]
        if ("StartDate" in requestData) :
            startDate=requestData["StartDate"]
        if ("EndDate" in requestData) :
            endDate=requestData["EndDate"]



        runConfig={
            # 系统指标名字
            # "Name":"MA",
            "Script":script,
            # 脚本参数
            "Args":args,
            # 周期 复权
            "Period":period, "Right":right,
            "Symbol":symbol,
            # "OutCount":1,

            #jobID (可选)
            "JobID":jobID
        }

    else :
        runConfig={
            # 系统指标名字
            # "Name":"MA",
            "Script":TEST_CODE,
            # 脚本参数
            "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ],
            # 周期 复权
            "Period":period, "Right":right,
            "Symbol":symbol,

            #jobID (可选)
            "JobID":jobID
        }

    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=TushareHQChartData(TushareConfig.TUSHARE_AUTHORIZATION_KEY,startDate=startDate, endDate=endDate)    # 实例化数据类
    result=HQResultTest()   # 实例计算结果接收类

    start = time.process_time()

    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)
    
    elapsed = (time.process_time() - start)
    log='''
---------------------------------------------------------------------------
HQChartPy_Run() 
ID:{3}
执行时间:{0},
股票{1}, 
脚本:
{2}
---------------------------------------------------------------------------
    '''.format(elapsed, runConfig['Symbol'],script,jobID)

    print(log)

    if (res):
        jsonData=result.Result[0]["Data"]
        df=HQChartPy2Helper.JsonDataToPandas(jsonData)  # 指标数据转pandas
        print(df)
        responseData=json.loads(jsonData)
        responseData["Code"]=0          # 成功
        responseData['Tick']=elapsed    # 耗时
        responseData['StartDate']=startDate
        responseData["EndDate"]=endDate
        responseData["JobID"]=jobID
        return jsonify(responseData)
    else:
        responseData={'Code':1, "Tick":elapsed, "Error": result.Error, "JobID": jobID }
        return jsonify(responseData)


class HQSelectResult():
    def __init__(self):
        self.Result = []    # 保存所有的执行结果
        self.Error=[]
    
     # 执行成功回调
    def RunSuccess(self, symbol, jsData, jobID):
        self.Result.append({"Symbol":symbol, "Data":jsData})  # 保存结果
        log="[HQSelectResult::RunSuccess] {0} success".format(symbol)
        print (log)
        sendData={ "Symbol":symbol, "Data":jsData, "JobID":jobID ,"Success":True }
        emit('HQChartPy_SelectResult', sendData )
        # print (jsData)

    # 执行失败回调
    def RunFailed(self, code, symbol, error,jobID) :
        log="[HQSelectResult::RunFailed] {0}\n{1} failed\n{2}".format(code, symbol,error)
        self.Error.append(error)
        print(log)
        sendData={ "Symbol":symbol, "Error":error, "JobID":jobID ,"Success":False }
        emit('HQChartPy_SelectResult', sendData )

@socketio.on('run', namespace='/select')
def SelectRun(message):
    runConfig=message['data']
    startDate=20200421
    endDate=20201231
    jobID=str(uuid.uuid1())

    if ("StartDate" in runConfig) :
        startDate=runConfig["StartDate"]
    if ("EndDate" in runConfig) :
        endDate=runConfig["EndDate"]
        
    if ("JobID" in runConfig) :
        jobID=runConfig["JobID"]
    else :
        runConfig["JobID"]=jobID

    if("OutCount" not in runConfig) :
        runConfig["OutCount"]=1    # 默认输出最后一个数据

    script=runConfig["Script"]

    jsConfig = json.dumps(runConfig)    # 运行配置项
    hqData=TushareHQChartData(TushareConfig.TUSHARE_AUTHORIZATION_KEY,startDate=startDate, endDate=endDate)
    result=HQSelectResult()   # 实例计算结果接收类

    start = time.process_time()

    res=FastHQChart.Run(jsConfig,hqData,proSuccess=result.RunSuccess, procFailed=result.RunFailed)
    
    elapsed = (time.process_time() - start)
    log='''
---------------------------------------------------------------------------
HQChartPy_Run() 
ID:{3}
执行时间:{0},
股票个数:{1}, 
脚本:
{2}
---------------------------------------------------------------------------
    '''.format(elapsed, len(runConfig['Symbol']),script,jobID)

    print(log)

    emit('HQChartPy_SelectFinish', {'Result':res, "Tick":elapsed, "JobID":jobID })

@socketio.on('connect', namespace='/select')
def SelectOnConnect():
    version=FastHQChart.GetVersion()
    emit('HQChartPy_Ready', {'Version': version, "Authorize":FastHQChart.Authorize} )

@socketio.on('disconnect', namespace='/select')
def SelectOnDisconnect():
    print('Client disconnected')

if __name__ == '__main__':
    if (TushareConfig.HQCHART_AUTHORIZATION_KEY==None) :
        # 请求试用账户, 把mac地址改成你本机的mac地址
        TushareConfig.HQCHART_AUTHORIZATION_KEY=FastHQChart.GetTrialAuthorize(mac="A4-B1-C1-4B-4D-7B")
    FastHQChart.Initialization(TushareConfig.HQCHART_AUTHORIZATION_KEY)
    # app.run(host='127.0.0.1', port=8712, debug=True)
    socketio.run(app,debug=True, host="127.0.0.1", port=8712)



