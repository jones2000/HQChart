import HQChartPy2
import platform


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

    # FINANCE()  财务数据 数组
    def GetFinance(self, symbol, id, period,right,kcount,jobID) :
        pass

    # DYNAINFO()  最新数据 单值
    def GetDynainfo(self, symbol, id, period,right, kcount,jobID):
        pass

    # INDEXA, INDEXC .... 获取指数数据 数组
    def GetIndex(self, symbol, varName, period,right, kcount,jobID):
        pass

    # CAPITAL 最新流通股本 单值
    def GetCapital(self,symbol, period, right, kcount,jobID):
        pass

    def GetDataByNumber(self, symbol,funcName,id, period,right,kcount, jobID):
        if (funcName==u'FINANCE') : # 财务数据
            return self.GetFinance(symbol,id, period,right,kcount, jobID)
        elif (funcName==u"DYNAINFO") : # 最新数据
            return self.GetDynainfo(symbol,id, period,right,kcount, jobID)
        else :
            return False

    def GetDataByName(self, symbol,funcName,period,right,kcount, jobID) :
        if (funcName==u"CAPITAL"):
            return self.GetCapital(symbol,period,right,kcount, jobID)
        elif (funcName in (u"INDEXA", u"INDEXC", u"INDEXH", u"INDEXL", u"INDEXO",u"INDEXV", u"INDEXADV", u"INDEXDEC")) : # 大盘数据 其他的大盘数据也在这里
            return self.GetIndex(symbol,funcName,period,right,kcount, jobID)
        else :
            return false

    def GetDataByString(self, symbol,funcName,period,right,kcount, jobID):
        return false


class FastHQChart :
     # 初始化
    @staticmethod 
    # key= 授权码
    def Initialization(Key=None) :
        # 加载dll
        strOS = platform.system()
        dllVersion=HQChartPy2.GetVersion()
        if (Key) :
            HQChartPy2.LoadAuthorizeInfo(Key)
        authorize=HQChartPy2.GetAuthorizeInfo()

        print("*******************************************************************************************")
        print("*  欢迎使用HQChart c++ 技术指标计算引擎")
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
        callbackConfig={};
        callbackConfig['GetKLineData']=hqData.GetKLineData
        callbackConfig['GetDataByNumber']=hqData.GetDataByNumber
        callbackConfig['GetDataByName']=hqData.GetDataByName
        callbackConfig['GetDataByString']=hqData.GetDataByString

        # 计算结果返回
        if (proSuccess) :
            callbackConfig['Success']=proSuccess
        if (procFailed) :
            callbackConfig['Failed']=procFailed

        bResult=HQChartPy2.Run(jsonConfig,callbackConfig)
        return bResult

    @staticmethod
    def Run2(jsonConfig, hqData, proSuccess=None,procFailed=None):
        callbackConfig={};
        callbackConfig['GetKLineData']=hqData.GetKLineData
        callbackConfig['GetDataByNumber']=hqData.GetDataByNumber
        callbackConfig['GetDataByName']=hqData.GetDataByName
        callbackConfig['GetDataByString']=hqData.GetDataByString

        # 计算结果返回
        if (proSuccess) :
            callbackConfig['Success']=proSuccess
        if (procFailed) :
            callbackConfig['Failed']=procFailed

        bResult=HQChartPy2.Run2(jsonConfig,callbackConfig)
        return bResult