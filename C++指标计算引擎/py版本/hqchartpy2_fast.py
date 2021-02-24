import sys
import os
curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)

import HQChartPy2
import platform
import datetime
import requests     # 网络数据下载
import json



##############################################################
#   周期
#
#
#################################################################
class PERIOD_ID:
    DAY_ID=0
    WEEK_ID=1
    MONTH_ID=2
    YEAR_ID=3
    QUARTER_ID=9
    TWO_WEEK_ID=21
    MIN1_ID=4
    MIN5_ID=5
    MIN15_ID=6
    MIN30_ID=7
    MIN60_ID=8
    TICK_ID=10	#分笔

############################################################################################
# IHQData 数据接口类
#
#
#
############################################################################################
class IHQData(object):

    # K线数据
    def GetKLineData(self, symbol, period, right, jobID):
        pass

    def GetKLineData2(self, symbol, period, right, callInfo, kdataInfo, jobID):
        pass

    # FINANCE()  财务数据 数组
    def GetFinance(self, symbol, id, period,right,kcount,jobID) :
        pass

    # DYNAINFO()  最新数据 单值
    def GetDynainfo(self, symbol, id, period,right, kcount,jobID):
        pass

    # CAPITAL 最新流通股本(手)
    def GetCapital(self,symbol, period, right, kcount,jobID):
        pass

    # TOTALCAPITAL  当前总股本(手)
    def GetTotalCapital(self,symbol, period, right, kcount,jobID):
        pass

    # 历史所有的流通股本 时间序列
    def GetHisCapital(self,symbol, period, right, kcount,jobID):
        pass

    def GetDataByNumber(self, symbol,funcName,id, period,right,kcount, jobID):
        if (funcName==u'FINANCE') : # 财务数据
            return self.GetFinance(symbol,id, period,right,kcount, jobID)
        elif (funcName==u"DYNAINFO") : # 最新数据
            return self.GetDynainfo(symbol,id, period,right,kcount, jobID)
        else :
            return False

    def GetDataByNumbers(self, symbol,funcName,args, period,right,kcount, jobID):
        if (funcName==u"GPJYVALUE") :
            return self.GetGPJYValue(symbol, args, period, right, kcount, jobID)
        pass

    def GetDataByName(self, symbol,funcName,period,right,kcount, jobID) :
        if (funcName==u"CAPITAL"):
            return self.GetCapital(symbol,period,right,kcount, jobID)
        elif (funcName==u"GetHisCapital"):
            return self.GetHisCapital(symbol,period,right,kcount, jobID)
        elif (funcName==u'TOTALCAPITAL'):
            return self.GetTotalCapital(symbol,period,right,kcount, jobID)
        else :
            return False

    def GetDataByString(self, symbol,funcName,period,right,kcount, jobID):
        return False

    # 引用股票交易类数据.
    # GPJYVALUE(ID,N,TYPE),ID为数据编号,N表示第几个数据,TYPE:为1表示做平滑处理,没有数据的周期返回上一周期的值;为0表示不做平滑处理
    def GetGPJYValue(self, symbol,args,period, right, kcount ,jobID):
        pass

    # 系统指标
    def GetIndexScript(self,name,callInfo, jobID):
        if (name=="MA") :
            indexScript = {
                # 系统指标名字
                "Name":name,
                "Script":'''
                T1:MA(C,M1);
                T2:MA(C,M2);
                T3:MA(C,M3);
                ''',
                # 脚本参数
                "Args": [ { "Name":"M1", "Value":15 }, { "Name":"M2", "Value":20 }, { "Name":"M3", "Value":30} ]
            }
            return indexScript
        elif (name=="KDJ"):
            indexScript = {
                # 系统指标名字
                "Name":name,
                "Script":'''
                RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;
                K:SMA(RSV,M1,1);
                D:SMA(K,M2,1);
                J:3*K-2*D;
                ''',
                # 脚本参数
                "Args": [ { "Name":"N", "Value":9 }, { "Name":"M1", "Value":3 }, { "Name":"M2", "Value":3} ]
            }
            return indexScript
        elif (name=="MACD"):
            indexScript = {
                # 系统指标名字
                "Name":name,
                "Script":'''
                DIF:EMA(CLOSE,SHORT)-EMA(CLOSE,LONG);
                DEA:EMA(DIF,MID);
                MACD:(DIF-DEA)*2,COLORSTICK;
                ''',
                # 脚本参数
                "Args": [ { "Name":"SHORT", "Value":12 }, { "Name":"LONG", "Value":26 }, { "Name":"MID", "Value":9 } ]
            }
            return indexScript
        
        return None

    # 星期五
    @staticmethod 
    def GetFirday(value) :
        date = datetime.datetime.strptime(str(value), '%Y%m%d')
        day=date.weekday()
        if day==4 : 
            return value

        date+=datetime.timedelta(days=4-day)
        fridayDate= date.year*10000+date.month*100+date.day
        return fridayDate

    # 是否是沪深指数
    @staticmethod
    def IsSHSZIndex(symbol) :
        upperSymbol=symbol.upper()
        if (upperSymbol.find('.SH')>0) :
            upperSymbol=upperSymbol.replace('.SH','')
            if (upperSymbol[0]=='0' or int(upperSymbol)<=3000) :
                return True
        elif (upperSymbol.find('.SZ')>0) :
            upperSymbol=upperSymbol.replace('.SZ','')
            if (upperSymbol[0]=='3' and upperSymbol[1]=='9') :
                return True
        
        return False



class FastHQChart :
    DllVersion=0
    Authorize=None  # 授权信息

    @staticmethod
    def GetVersion():
        version=FastHQChart.DllVersion
        return "{0}.{1}".format(int(version/100000), (version%100000))

    # 初始化
    @staticmethod 
    # key= 授权码
    def Initialization(Key=None) :
        # 加载dll
        strOS = platform.system()
        dllVersion=HQChartPy2.GetVersion()
        FastHQChart.DllVersion=dllVersion
        if (Key) :
            HQChartPy2.LoadAuthorizeInfo(Key)
        authorize=HQChartPy2.GetAuthorizeInfo()
        FastHQChart.Authorize=authorize

        print("*******************************************************************************************")
        print("*  欢迎使用HQChartPy2 C++ 技术指标计算引擎")
        log="*  版本号:{0}.{1}".format(int(dllVersion/100000), (dllVersion%100000))
        print(log)
        log="*  授权信息:{0}".format(authorize)
        print(log)
        log="*  运行系统:{0}".format(strOS)
        print(log)
        print("*******************************************************************************************")
        pass

    @staticmethod
    def Run(jsonConfig, hqData, proSuccess=None,procFailed=None):
        callbackConfig={}
        callbackConfig['GetKLineData']=hqData.GetKLineData
        callbackConfig['GetKLineData2']=hqData.GetKLineData2
        callbackConfig['GetDataByNumber']=hqData.GetDataByNumber
        callbackConfig['GetDataByNumbers']=hqData.GetDataByNumbers
        callbackConfig['GetDataByName']=hqData.GetDataByName
        callbackConfig['GetDataByString']=hqData.GetDataByString
        callbackConfig["GetIndexScript"]=hqData.GetIndexScript
        

        # 计算结果返回
        if (proSuccess) :
            callbackConfig['Success']=proSuccess
        if (procFailed) :
            callbackConfig['Failed']=procFailed

        bResult=HQChartPy2.Run(jsonConfig,callbackConfig)
        return bResult

    # 获取试用注册码
    @staticmethod
    def GetTrialAuthorize(mac, url="http://py2.hqchart.cn:8712/api/v1/CreateAuthorize"):

        headers = {
            "Content-Type": "application/json; charset=UTF-8"
        }

        postData = { "MAC":mac, "Version":"hqchartPy" }
        print('[FastHQChart::GetTrialAuthorize] 获取试用账户',url, postData)

        try:
            response=requests.post(url,data=json.dumps(postData),headers=headers)
            if (response.status_code!=200) :
                print("获取测试账户请求失败, {0}".format(response.text))
                return None
            jsonData=response.json()
            if (jsonData['code']==0) :
                if ('message' in jsonData.keys()):
                    if (jsonData['message']!=None) :
                        print(jsonData['message'])
                return jsonData['key']
        except requests.exceptions.HTTPError as http_err:
            print("获取测试账户请求异常,{0}".format(http_err))
        except Exception as err:
            print("获取测试账户请求异常,{0}".format(err))
        except :
            print("获取测试账户请求异常")

        return None