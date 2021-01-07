import sys
import os
curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)

import HQChartPy2
import platform



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

    # INDEXA, INDEXC .... 获取指数数据 数组
    def GetIndex(self, symbol, varName, period,right, kcount,jobID):
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
        pass

    def GetDataByName(self, symbol,funcName,period,right,kcount, jobID) :
        if (funcName==u"CAPITAL"):
            return self.GetCapital(symbol,period,right,kcount, jobID)
        elif (funcName==u"GetHisCapital"):
            return self.GetHisCapital(symbol,period,right,kcount, jobID)
        elif (funcName==u'TOTALCAPITAL'):
            return self.GetTotalCapital(symbol,period,right,kcount, jobID)
        elif (funcName in (u"INDEXA", u"INDEXC", u"INDEXH", u"INDEXL", u"INDEXO",u"INDEXV", u"INDEXADV", u"INDEXDEC")) : # 大盘数据 其他的大盘数据也在这里
            return self.GetIndex(symbol,funcName,period,right,kcount, jobID)
        else :
            return False

    def GetDataByString(self, symbol,funcName,period,right,kcount, jobID):
        return False

    # 系统指标
    def GetIndexScript(self,name,callInfo, jobID):
        pass


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
        print("*  欢迎使用HQChart.Py C++ 技术指标计算引擎")
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


