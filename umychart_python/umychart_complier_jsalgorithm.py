import sys
import math
from umychart_complier_jssymboldata import JSSymbolData, g_JSComplierResource
from umychart_complier_help import JSComplierHelper ,Variant


#######################################################################################################
#   
#   算法类
#
#######################################################################################################
class JSAlgorithm() :
    def __init__(self, errorHandler, symbolData) :
        self.ErrorHandler=errorHandler
        self.SymbolData=symbolData         # 股票数据

    @staticmethod
    def IsNumber(value):
        return JSComplierHelper.IsNumber(value)

    @staticmethod
    def IsDivideNumber(value):
        return JSComplierHelper.IsDivideNumber(value)

    @staticmethod
    def IsArray(value) :
        return isinstance(value,list)
    
    @staticmethod   # value 和 value2 是否都是数值型
    def Is2Number(value,value2) :
        return JSComplierHelper.IsNumber(value) and JSComplierHelper.IsNumber(value2)

    @staticmethod  # value 和 value2 是否有1个是非数值行
    def Is2NaN(value, value2) :
        bValue=JSComplierHelper.IsNaN(value)
        bValue2=JSComplierHelper.IsNaN(value2)
        return bValue or bValue2
        #return JSComplierHelper.IsNaN(value) or JSComplierHelper.IsNaN(value2)

    @staticmethod
    def IsNaN(value) :
        return JSComplierHelper.IsNaN(value)

    @staticmethod
    def CreateArray(count, value=None) :
        return JSComplierHelper.CreateArray(count,value)
    
    @staticmethod   # 是否是一个有效素组 data!=null and data.length>0
    def IsVaildArray(data) :
        if not data :
            return False
        if not isinstance(data,list):
            return False
        if len(data)<=0 :
            return False
        return True

    @staticmethod   # 计算数组均值
    def ArrayAverage(data,n) :
        dataLen=len(data)
        averageData=JSAlgorithm.CreateArray(dataLen) # 平均值
        for i in range(n-1, dataLen) :
            total=0
            for j in range(n) :
                if JSAlgorithm.IsNumber(data[i-j]) :
                    total+=data[i-j]
            averageData[i]=total/n
        return averageData


    ######################################################################################
    #
    #   四则运算 + - * /
    #
    ########################################################################################

    # 相加
    def Add(self, data, data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        if isNumber and isNumber2 : # 单数值相加
            return data+data2

        # 都是数组相加
        if not isNumber and not isNumber2 :
            len1=len(data)
            len2=len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.Is2Number(data[i],data2[i]) :
                    result[i]=data[i]+data2[i]

            return result

        # 单数据和数组相加
        if isNumber :
            value=data
            aryData=data2
        else :
            value=data2
            aryData=data

        result=[None]*len(aryData)
        for i in range(len(aryData)) :
            if JSAlgorithm.Is2Number(aryData[i],value) :
                result[i]=value+aryData[i]

        return result

    # 相减
    def Subtract(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

         # 单数值相减
        if isNumber and isNumber2 :
            return data-data2

        # 都是数组相减
        
        if not isNumber and not isNumber2 :
            len1=len(data)
            len2=len(data2)
            count=max(len1, len2)
            result=[None]*count
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.Is2Number(data[i],data2[i]) :
                    result[i]=data[i]-data2[i]

            return result

        if isNumber :   # 单数据-数组
            result=[None]*len(data2)
            for i in range(len(data2)) :
                result[i]=None
                if JSAlgorithm.Is2Number(data,data2[i]) :
                    result[i]=data-data2[i]
        else :           # 数组-单数据
            result=[None]*len(data)
            for i in range(len(data)) :
                result[i]=None
                if JSAlgorithm.Is2Number(data[i],data2) :
                    result[i]=data[i]-data2

        return result

    # 相乘
    def Multiply(self,data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值相乘
        if isNumber and isNumber2 :
            return data*data2

        # 都是数组相乘
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.Is2Number(data[i],data2[i]) :
                    result[i]=data[i]*data2[i]

            return result

        # 单数据和数组相乘
        if isNumber :
            value=data
            aryData=data2
        else :
            value=data2
            aryData=data

        result=[None]*len(aryData) # 初始化
        for i in range(len(aryData)) :
            if JSAlgorithm.Is2Number(aryData[i],value) :
                result[i]=value*aryData[i]

        return result

    # 相除
    def Divide(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值相除
        if isNumber and isNumber2 :
            if data2==0 :   # 除0判断
                return None  
            return data/data2

        # 都是数组相除
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.IsNumber(data[i]) and JSAlgorithm.IsDivideNumber(data2[i]) :
                    result[i]=data[i]/data2[i]

            return result

        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                result[i]=None
                if JSAlgorithm.IsNumber(data) and JSAlgorithm.IsDivideNumber(data2[i]) :
                    result[i]=data/data2[i]
        else : # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                result[i]=None
                if JSAlgorithm.IsNumber(data[i]) and JSAlgorithm.IsDivideNumber(data2) :
                    result[i]=data[i]/data2

        return result

    ############################################################################################
    #
    # 逻辑运算 > >= < <= = != 
    #
    #############################################################################################

    # 大于 >
    def GT(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=JSComplierHelper.CreateArray(count) # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]>data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data>data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]>data2 else 0

        return result

    # 大于等于 >=
    def GTE(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]>=data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data>=data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]>=data2 else 0

        return result

    # 小于 <
    def LT(self,data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]<data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data<data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]<data2 else 0

        return result

    # 小于等于
    def LTE(self,data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]<=data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data<=data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]<=data2 else 0

        return result
    
    # 等于
    def EQ(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]==data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data==data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]==data2 else 0

        return result

    # 不等于
    def NEQ(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i]!=data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data!=data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data2) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i]!=data2 else 0

        return result

    ############################################################################################
    #
    # 逻辑运算 and, or
    #
    #############################################################################################

    # AND  &&
    def And(self, data,data2):
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        result=[]
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i] and data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data and data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i] and data2 else 0

        return result

    # OR  ||
    def Or(self, data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  1 if data>=data2 else 0

        # 都是数组比较
        result=[]
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count # 初始化
            for i in range(count) :
                if i<len1 and i<len2 and not JSAlgorithm.Is2NaN(data[i],data2[i]) :
                    result[i]= 1 if data[i] or data2[i] else 0

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2) # 初始化
            for i in range(len(data2)) :
                if not JSAlgorithm.Is2NaN(data,data2[i]) :
                    result[i]=1 if data or data2[i] else 0
        
        else :           # 数组-单数据
            result=[None]*len(data) # 初始化
            for i in range(len(data)) :
                if not JSAlgorithm.Is2NaN(data[i],data2) :
                    result[i]=1 if data[i] or data2 else 0

        return result

    ##########################################################################
    #
    #   条件语句 if , ifn
    #
    #########################################################################

    def IF(self,data,trueData,falseData) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(trueData)
        isNumber3=JSAlgorithm.IsNumber(falseData)
        
        # 单数值
        if isNumber :
            if isNumber2 and isNumber3 :
                return trueData if data else falseData
            return trueData if data else falseData
        
        # 都是数组
        result=[None]*len(data)
        for i in range(len(data)) :
            if data[i] :
                if isNumber2 :
                    result[i]=trueData
                else :
                    result[i]=trueData[i]
            else :
                if isNumber3 :
                    result[i]=falseData
                else :
                    result[i]=falseData[i]

        return result

    
    # 根据条件求不同的值,同IF判断相反.
    # 用法: IFN(X,A,B)若X不为0则返回B,否则返回A
    # 例如: IFN(CLOSE>OPEN,HIGH,LOW)表示该周期收阴则返回最高值,否则返回最低值
    def IFN(self, data,trueData,falseData) :
        return self.IF(data,falseData,trueData)

    ########################################################################
    #
    #   指标函数 函数名全部大写
    #
    #########################################################################

    def REF(self,data,n) :
        result=[]
        if JSAlgorithm.IsNumber(n) :
            count=len(data)
            if count<=0 :
                return result
            if n>=count :
                return result

            result=data[0:count-n]

            for i in range(n) :
                result.insert(0,None)

        else :   # n 为数组的情况
            nCount=len(n)
            for i in range(len(data)) :
                result[i]=None
                if i>=nCount :
                    continue

                value=n[i]
                if value>0 and value<=i :
                    result[i]=data[i-value]
                elif i : 
                    result[i]=result[i-1]
                else :
                    result[i]=data[i]

        return result

    def MAX(self,data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  max(data,data2)

        # 都是数组比较
        
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.Is2Number(data[i],data2[i]) :
                    result[i]= max(data[i],data2[i])

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2)
            for i in range(len(data2)) :
                if JSAlgorithm.Is2Number(data,data2[i]) :
                    result[i]=max(data,data2[i])
        
        else :           # 数组-单数据
            result=[None]*len(data)
            for i in range(len(data)) :
                if JSAlgorithm.Is2Number(data[i],data2) :
                    result[i]=max(data[i],data2)

        return result


    def MIN(self,data,data2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(data2)

        # 单数值比较
        if isNumber and isNumber2 :
            return  max(data,data2)

        # 都是数组比较
        result=[]
        if not isNumber and not isNumber2 :
            len1, len2 = len(data), len(data2)
            count=max(len1, len2)
            result=[None]*count
            for i in range(count) :
                if i<len1 and i<len2 and JSAlgorithm.Is2Number(data[i],data2[i]) :
                    result[i]= min(data[i],data2[i])

            return result


        if isNumber :  # 单数据-数组
            result=[None]*len(data2)
            for i in range(len(data2)) :
                if JSAlgorithm.Is2Number(data,data2[i]) :
                    result[i]=min(data,data2[i])
        
        else :           # 数组-单数据
            result=[None]*len(data)
            for i in range(len(data)) :
                if JSAlgorithm.Is2Number(data[i],data2) :
                    result[i]=min(data[i],data2)

        return result

    # 取正数
    def ABS(self, data) :
        isNumber=JSAlgorithm.IsNumber(data)
        if isNumber :
            return abs(data)
        
        result=[None]*len(data)
        for i in range(len(data)) :
            result[i]=None
            if not JSAlgorithm.IsNaN(data[i]) :
                 result[i]=abs(data[i])

        return result

    def MA(self, data,dayCount) :
        if dayCount<=0:
            dayCount=1
        
        result=[]
        if not data or len(data)<=0:
            return result
        
        result=[None]*len(data) # 初始化数据
        for i in range(len(data)) :
            if JSAlgorithm.IsNumber(data[i]):
                break

        data2=data[0:] # 复制一份数据出来
        days=-1
        for i in range(i,len(data2)) :
            days+=1

            if days<dayCount-1 :
                continue

            preValue=data[i-(dayCount-1)]
            sum=0

            for j in range(dayCount-1,-1,-1) :
                value=data[i-j]
                if not JSAlgorithm.IsNumber(value) :
                    value=preValue  # 空数据就取上一个数据
                    data[i-j]=value 
                else :
                    preValue=value
                sum+=value

            result[i]=sum/dayCount

        return result

    # 指数平均数指标 EMA(close,10)
    def EMA(self,data,dayCount) :
        result = []
        offset=0
        if offset>=len(data) :
            return result

        result=[None]*len(data) # 初始化数据

        # 取首个有效数据
        for i in range(len(data)) :
            if JSAlgorithm.IsNumber(data[i]) :
                break
        
        offset=i
        p1Index=offset
        p2Index=offset+1
        result[p1Index]=data[p1Index]
        for i in range(offset+1,len(data)) :
            result[p2Index]=((2*data[p2Index]+(dayCount-1)*result[p1Index]))/(dayCount+1)
            p1Index+=1
            p2Index+=1

        return result
 
    # SMA 移动平均
    # 返回移动平均。
    # 用法：　SMA(X，N，M)　X的M日移动平均，M为权重，如Y=(X*M+Y'*(N-M))/N 
    def SMA(self,data,n,m) :
        result = [None]*len(data)
        lastData=None
        for i in range(len(data)) :
            if JSAlgorithm.IsNumber(data[i]) :
                lastData=data[i]
                result[i]=lastData # 第一天的数据
                break

        for i in range(i+1,len(data)) :
            result[i]=(m*data[i]+(n-m)*lastData)/n
            lastData=result[i]

        return result

    
    # 求动态移动平均.
    # 用法: DMA(X,A),求X的动态移动平均.
    # 算法: 若Y=DMA(X,A)则 Y=A*X+(1-A)*Y',其中Y'表示上一周期Y值,A必须小于1.
    # 例如:DMA(CLOSE,VOL/CAPITAL)表示求以换手率作平滑因子的平均价
    def DMA(self,data,data2) :
        result = []
        len1, len2 = len(data), len(data2)
        if len1<0 or len2!=len2 :
            return result

        result = [None]*len(data)
        for index in range(len1) :
            if JSAlgorithm.Is2Number(data[index],data2[index]) :
                result[index]=data[index]
                break

        for index in range(index+1,len1) :
            if JSAlgorithm.Is2Number(data[index],data2[index]) :
                if data2[index]<1 :
                    result[index]=(data2[index]*data[index])+(1-data2[index])*result[index-1]
                else :
                    result[index]= data[index]
        return result

    
    # 返回加权移动平均
    # 用法:WMA(X,N):X的N日加权移动平均.
    # 算法:Yn=(1*X1+2*X2+...+n*Xn)/(1+2+...+n)
    def WMA(self,data, dayCount) :
        result=[]
        len1=len(data)
        if not data or len1<=0 :
            return result
        if dayCount < 1 :
            dayCount = 1

        result=[None]*len1 # 初始化
        for i in range(len1) :
            if JSAlgorithm.IsNumber(data[i]) :
                break
        
        data2 = data[0:]
        days=-1
        for i in range(i,len1):
            days+=1

            if days < dayCount-1 :
                continue
            
            preValue = data2[i - (dayCount-1)]
            sum = 0
            count = 0
            for j in range(dayCount-1,-1,-1) :
                value = data2[i-j]
                if JSAlgorithm.IsNumber(value) :
                    value = preValue
                    data2[i-j] = value
                else :
                    preValue = value

                count += dayCount - j
                sum += value * (dayCount - j)
            
            result[i] = sum / count
        
        return result

    
    # 返回平滑移动平均
    # 用法:MEMA(X,N):X的N日平滑移动平均,如Y=(X+Y'*(N-1))/N
    # MEMA(X,N)相当于SMA(X,N,1)
    def MEMA(self, data, dayCount):
        result=[]
        dataLen=len(data)
        if not data or dataLen<=0 :
            return result

        result=[None]*dataLen
        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                break
        
        if dayCount<1 or i+dayCount>=dataLen :
            return result

        sum = 0
        data2 = data[0:]
        for i in range(i,i+dayCount) :
            if not JSAlgorithm.IsNumber(data2[i]) and i-1 >= 0 :
                data2[i] = data2[i-1]
                sum += data2[i]

        result[i-1] = sum / dayCount
        for i in range(i,dataLen) :
            if self.IsNumber(result[i-1]) and self.IsNumber(data[i]) :
                result[i] = (data[i]+result[i-1]*(dayCount-1)) / dayCount
            elif i-1 > -1 and self.IsNumber(result[i-1]) :
                result[i] = result[i-1]

        return result

    
    # 加权移动平均
    # 返回加权移动平均
    # 用法:EXPMA(X,M):X的M日加权移动平均
    # EXPMA[i]=buffer[i]*para+(1-para)*EXPMA[i-1] para=2/(1+__para)
    def EXPMA(self,data,dayCount) :
        result=[]
        dataLen=len(data)
        if dayCount>=dataLen :
            return result
    
        result=[None]*dataLen # 初始化
        for i in range(dayCount,dataLen) :      # 获取第1个有效数据
            if JSAlgorithm.IsNumber(data[i]) :
                result[i]=data[i]
                break

        for i in range(i+1,dataLen) :
            if JSAlgorithm.Is2Number(result[i-1], data[i]) :
                result[i]=(2*data[i]+(dayCount-1)*result[i-1])/(dayCount+1)
            elif JSAlgorithm.IsNumber(result[i-1]) :
                result[i]=result[i-1]
    
        return result

    # 加权平滑平均,MEMA[i]=SMA[i]*para+(1-para)*SMA[i-1] para=2/(1+__para)
    def EXPMEMA(self,data,dayCount) :
        result=[]
        dataLen=len(data)
        if dayCount>=dataLen : 
            return result

        result=[None]*dataLen # 初始化
        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                break
        
        index=i
        sum=0
        for i in range(dayCount) :
            if index>=dataLen : 
                break

            if JSAlgorithm.IsNumber(data[index]) :
                sum+=data[index]
            else :
                sum+=data[index-1]

            index+=1

        result[index-1]=sum/dayCount
        for index in range(index,dataLen) :
            if JSAlgorithm.Is2Number(result[index-1], data[index]) :
                result[index]=(2*data[index]+(dayCount-1)*result[index-1])/(dayCount+1)
            elif JSAlgorithm.IsNumber(result[index-1]) :
                result[index] = result[index-1]

        return result

    # 向前累加到指定值到现在的周期数.
    # 用法:SUMBARS(X,A):将X向前累加直到大于等于A,返回这个区间的周期数
    # 例如:SUMBARS(VOL,CAPITAL)求完全换手到现在的周期数
    def SUMBARS(self, data, data2) :
        result = []
        if not data or not data2:
            return result
        len1, len2 = len(data), len(data2)
        if len1<=0 or len2<=0: 
            return result

        result=[None]*len1
        for start in range(len1) :
            if JSAlgorithm.IsNumber(data[start]) :
                break

        for i in range(len1-1,start-1,-1) :
            total = 0
            for j in range(i,start-1,-1) :
                if total>=data2[i]:
                    break
                total += data[j]

            if j < start: 
                pass
            else :
                result[i] = i - j

        for i in range(start+1,len1) :
            if result[i]==None :
                result[i] = result[i-1]
        
        return result

    
    # 求相反数.
    # 用法:REVERSE(X)返回-X.
    # 例如:REVERSE(CLOSE)返回-CLOSE
    def REVERSE(self,data) :
        isNumber=JSAlgorithm.IsNumber(data)
        if isNumber :
            return 0-data

        count=len(data)
        result = [None]*count
        for i in range(count) :
            if JSAlgorithm.IsNumber(data[i]) :
                result[i]=0-data[i]

        return result

    def COUNT(self, data,n):
        dataLen=len(data)
        result=[None]*dataLen

        for i in range(dataLen) :
            count=0
            for j in range(n) :
                if i-j<0 :
                    break
                if data[i-j] :
                    count+=1
            result[i]=count
        
        return result

    # HHV 最高值
    # 求最高值。
    # 用法：　HHV(X，N)　求N周期内X最高值，N=0则从第一个有效值开始。
    # 例如：　HHV(HIGH,30)　表示求30日最高价。
    def HHV(self,data,n):
        dataLen=len(data)
        result = JSAlgorithm.CreateArray(dataLen)
        isNumber=JSAlgorithm.IsNumber(n)
        if not isNumber : # n是一个数组 周期变动
            max=None
            nLen=len(n)
            for i in range(dataLen) :
                if i>nLen :
                    continue
                max=None
                count=int(n[i])
                if count>0 and count<=i :
                    for j in range(i-count,i+1) :
                        if max==None or max<data[j] :
                            max=data[j]
                else :
                    count=i
                    for j in range(i+1) :
                        if max==None or  max<data[j] :
                            max=data[j]
                result[i]=max
            
        else :
            n=int(n)
            if n>dataLen :
                 return result

            if n<=0: 
                n=dataLen-1

            for nMax in range(dataLen) :
                if JSAlgorithm.IsNumber(data[nMax]) :
                    break

            if nMax<dataLen :
                result[nMax]=data[nMax]

            j=2
            for i in range(nMax+1,dataLen):
                if j>=n :
                    break
                if data[i]>=data[nMax] :
                    nMax=i
                result[i]=data[nMax]
                j+=1

            for i in range(i,dataLen) :
                if i-nMax<n :
                    nMax=nMax if data[i]<data[nMax] else i
                else :
                    nMax=(i-n+2)
                    for j in range(nMax,i+1) :
                        nMax=nMax if data[j]<data[nMax] else j
                result[i]=data[nMax]

            return result

    # LLV 最低值
    # 求最低值。
    # 用法：　LLV(X，N)　求N周期内X最低值，N=0则从第一个有效值开始。
    # 例如：　LLV(LOW，0)　表示求历史最低价。
    def LLV(self,data,n) :
        dataLen=len(data)
        result = JSAlgorithm.CreateArray(dataLen)
        isNumber=JSAlgorithm.IsNumber(n)
        if not isNumber : # n是数组
            for i in range(dataLen) :
                if i>=dataLen :
                    continue
                min=None
                count=int(n[i])
                if count>0 and count<=i :
                    for j in range(i-count,i+1):
                        if min==None or min>data[j] :
                            min=data[j]
                else :
                    count=i
                    for j in range(i+1) :
                        if min==None or min>data[j] :
                            min=data[j]
                result[i]=min
        else :
            n=int(n)
            if n>dataLen :
                return result
            if n<=0 :
                n=dataLen-1

            min=n
            for i in range(n,dataLen):
                if i<n+min :
                    min=min if data[i]>data[min] else i
                else :
                    min=i-n+1
                    for j in range(min+1,i+1) :
                        if data[j]<data[min] :
                            min=j
                result[i] = data[min]

        return result

    # STD(X,N) 返回估算标准差
    def STD(self,data,n) :
        if not data or len(data)<=0 :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        if n<=0:
            n=dataLen-1

        averageData=JSAlgorithm.ArrayAverage(data,n) # 平均值
        for i in range(dataLen) :
            total=0
            for j in range(n) :
                if JSAlgorithm.Is2Number(data[i-j],averageData[i]) :
                    total+=(data[i-j]-averageData[i])*(data[i-j]-averageData[i])
            result[i]=math.sqrt(total/n)

        return result

    # 平均绝对方差
    def AVEDEV(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []
        
        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        if n<=0:
            n=dataLen-1

        averageData=JSAlgorithm.ArrayAverage(data,n) # 平均值
        for i in range(n-1,dataLen) :
            total=0
            for j in range(n) :
                if JSAlgorithm.Is2Number(data[i-j],averageData[i]) :
                    total+=abs(data[i-j]-averageData[i])
            result[i]=total/n

        return result

    # 上穿
    def CROSS(self, data,data2) :
        if JSAlgorithm.IsArray(data) and JSAlgorithm.IsArray(data2) :
            len1, len2 = len(data), len(data2)
            if len1!=len2 :
                return []

            result=JSAlgorithm.CreateArray(len1,0)
            for index in range(len1) :
                if JSAlgorithm.Is2Number(data[index],data2[index]) :
                    break
            
            for index in range(index+1, len1) :
                result[index]= 1 if data[index]>data2[index] and data[index-1]<data2[index-1] else 0

        elif JSAlgorithm.IsArray(data) and JSAlgorithm.IsNumber(data2):
            data2=int(data2)
            len1=len(data)
            result=JSAlgorithm.CreateArray(len1,0)
            for index in range(len1) :
                if JSAlgorithm.IsNumber(data[index]) :
                    break

            for index in range(index+1, len1) :
                result[index]= 1 if data[index]>data2 and data[index-1]<data2 else 0

        elif JSAlgorithm.IsNumber(data) and JSAlgorithm.IsArray(data2) :
            data=int(data)
            len2=len(data2)
            result=JSAlgorithm.CreateArray(len2,0)
            for index in range(len2) :
                if JSAlgorithm.IsNumber(data2[index]) :
                    break

            for index in range(index+1, len2) :
                result[index]= 1 if data2[index]<data and data2[index-1]>data else 0

        else :
            return []

        return result

    # 累乘
    def MULAR(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)   
        if dataLen<n:
            return []

        result=JSAlgorithm.CreateArray(dataLen)

        for index in range(dataLen) :
            if JSAlgorithm.IsNumber(data[index]):
                result[index]=data[index]
                break
        
        for index in range(index+1, dataLen):
            if JSAlgorithm.IsNumber(data[index]):
                result[index]=result[index-1]*data[index]
            else :
                result[index]=result[index-1]

        return result

    def SUM(self, data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)   
        if dataLen<n:
            return []

        result=JSAlgorithm.CreateArray(dataLen)
        
        if n==0 :
            result[0]=data[0]
            for i in range(1,dataLen) :
                result[i] = result[i-1]+data[i]

        else :
            j=0
            for i in range(n-1, dataLen) :
                for k in range(n) :
                    if k==0:
                        result[i]=data[k+j]
                    else :
                        result[i]+=data[k+j]
                j+=1

        return result

    
    # BARSCOUNT 有效数据周期数
    # 求总的周期数。
    # 用法：　BARSCOUNT(X)　第一个有效数据到当前的天数。
    # 例如：　BARSCOUNT(CLOSE)　对于日线数据取得上市以来总交易日数，对于分笔成交取得当日成交笔数，对于1分钟线取得当日交易分钟数。
    def BARSCOUNT(self,data):
        if not JSAlgorithm.IsVaildArray(data) :
            return []
        dataLen=len(data)  
        result=JSAlgorithm.CreateArray(dataLen,0)

        days=None
        for i in range(dataLen) :
            if days==None :
                if not JSAlgorithm.IsNumber(data[i]) :
                    continue
                days=0
                
            result[i]=days
            days+=1

        return result

    # DEVSQ 数据偏差平方和
    # DEVSQ(X，N) 　返回数据偏差平方和。
    def DEVSQ(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        num = n
        datanum = len(data)
        i,k = 0, 0
        DEV = 0
        for i in range(datanum) :   # 第1个有效数
            if JSAlgorithm.IsNumber(data[i]) :
                break

        if num < 1 or i+num>datanum:
            return []

        result=JSAlgorithm.CreateArray(datanum)
        j, E = 0 ,0
        for i in range(i,datanum) :
            if j>=num :
                break
            E += data[i]/num
            j+=1

        if j==num:
            DEV = 0
            i-=1
            for k in range(num) :
                DEV += (data[i-k]-E) * (data[i-k]-E)
            result[i] = DEV
            i+=1

        for i in range(i,datanum) :
            E += (data[i] - data[i-num]) / num
            DEV=0
            for k in range(num) :
                DEV += (data[i-k]-E) * (data[i-k]-E)
            result[i] = DEV
            
        return result

    # NOT 取反
    # 求逻辑非。
    # 用法：　NOT(X)　返回非X，即当X=0时返回1，否则返回0。
    # 例如：　NOT(ISUP)　表示平盘或收阴。
    def NOT(self,data) :
        if JSAlgorithm.IsNumber(data) :
            return 0 if data else 1
        
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)

        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                result[i]=0 if data[i] else 1

        return result

    # FORCAST 线性回归预测值
    # FORCAST(X，N)　 返回线性回归预测值。
    def FORCAST(self,data,n):
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        num = n
        datanum = len(data)
        if num < 1 or num >= datanum :
            return []

        result=JSAlgorithm.CreateArray(datanum)

        for j in range(datanum) :
            if JSAlgorithm.IsNumber(data[j]) :
                break

        for i in range(j+num-1,datanum) :
            Ex, Ey, Sxy, Sxx =0, 0, 0, 0
            for j in range(num) :
                if j>i :
                    break
                Ex += (i - j)
                Ey += data[i - j]
            Ex /= num
            Ey /= num
            for j in range(num) :
                if j>i :
                    break
                Sxy += (i-j-Ex)*(data[i-j]-Ey)
                Sxx += (i-j-Ex)*(i-j-Ex)

            Slope = Sxy / Sxx
            Const = (Ey - Ex*Slope) / num
            result[i] = Slope * num + Const

        return result

    # SLOPE 线性回归斜率
    # SLOPE(X，N)　 返回线性回归斜率。
    def SLOPE(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        if n<1 or n>=dataLen :
            return []
        
        result=JSAlgorithm.CreateArray(dataLen)
        for start in range(dataLen) :
            if JSAlgorithm.IsNumber(data[start]) :
                break

        for i in range(start+n-1,dataLen) :
            x, y, xy, xx = 0,0,0,0
            for j in range(n) :
                if j>i: 
                    break
                x+=(i-j)       # 数据索引相加
                y+=data[i-j]   # 数据相加

            x=x/n
            y=y/n

            for j in range(n) :
                if j>i :
                    break
                xy+=(i-j-x)*(data[i-j]-y)
                xx+=(i-j-x)*(i-j-x)

            if xx :
                result[i]= xy/xx
            elif i :
                result[i]=result[i-1]

        return result

    # STDP 总体标准差
    # STDP(X，N)　 返回总体标准差。
    def STDP(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        num = n
        datanum = len(data)
        if num < 1 or num >= datanum :
            return []

        result=JSAlgorithm.CreateArray(datanum)
        for i in range(datanum) :
            if JSAlgorithm.IsNumber(data[i]) :
                break

        SigmaPowerX ,SigmaX, MidResult =0,0,0
        for j in range(num) :
            if i>=datanum :
                break
            SigmaPowerX += data[i] * data[i]
            SigmaX += data[i]
            i+=1

        if j == num:
            MidResult = num*SigmaPowerX - SigmaX*SigmaX
            result[i-1] = math.sqrt(MidResult) / num
        
        for i in range(i,datanum) :
            SigmaPowerX += data[i]*data[i] - data[i-num]*data[i-num]
            SigmaX += data[i] - data[i-num]
            MidResult = num*SigmaPowerX - SigmaX*SigmaX
            result[i] = math.sqrt(MidResult) / num

        return result

    # VAR 估算样本方差
    # VAR(X，N)　 返回估算样本方差。
    def VAR(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        num = n
        datanum = len(data)
        if num <= 1 or num >= datanum :
            return []

        result=JSAlgorithm.CreateArray(datanum)
        for i in range(datanum) :
            if JSAlgorithm.IsNumber(data[i]) :
                break

        for i in range(i+num-1,datanum) :
            SigmaPowerX = SigmaX = 0
            for j in range(num) :
                if j>i :
                    break
                SigmaPowerX += data[i-j] * data[i-j]
                SigmaX += data[i-j]
            
            result[i] = (num*SigmaPowerX - SigmaX*SigmaX) / num * (num -1)

        return result

    # VARP 总体样本方差
    # VARP(X，N)　 返回总体样本方差 。
    def VARP(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        num = n
        datanum = len(data)
        if num < 1 or num >= datanum :
            return []

        result=JSAlgorithm.CreateArray(datanum)

        for i in range(datanum) :
            if JSAlgorithm.IsNumber(data[i]) :
                break

        SigmaPowerX , SigmaX = 0,0
        for j in range(num) :
            if i>=datanum :
                break
            SigmaPowerX += data[i] * data[i]
            SigmaX += data[i]
            i+=1

        if j == num :
            result[i-1] = (num*SigmaPowerX - SigmaX*SigmaX) / (num*num)

        for i in range(i,datanum) : 
            SigmaPowerX += data[i]*data[i] - data[i-num]*data[i-num]
            SigmaX += data[i] - data[i-num]
            result[i] = (num*SigmaPowerX - SigmaX*SigmaX) / (num*num)
        
        return result

    # RANGE(A,B,C)表示A>B AND A<C;
    def RANGE(self, data,range,range2) :
        isNumber=JSAlgorithm.IsNumber(data)
        isNumber2=JSAlgorithm.IsNumber(range)
        isNumber3=JSAlgorithm.IsNumber(range2)

        if isNumber and isNumber2 and isNumber3 :
            if data>min(range,range2) and data<max(range,range2):
                return 1
            else :
                return 0

        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)

        for i in range(dataLen) :
            value=data[i]
            if JSAlgorithm.IsNumber(value) :
                continue

            if not isNumber2 :
                if i>=len(range) :
                    continue
                rangeValue=range[i]
            else :
                rangeValue=range
            

            if not JSAlgorithm.IsNumber(rangeValue) :
                continue

            if not isNumber3 :
                if i>=len(range2) :
                    continue

                rangeValue2=range2[i]
            else :
                rangeValue2=range2
            
            if not JSAlgorithm.IsNumber(rangeValue2) :
                continue

            result[i]= 1 if value>min(rangeValue,rangeValue2) and value<max(rangeValue,rangeValue2) else 0

        return result

    def EXIST(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen = len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        latestID=None # 最新满足条件的数据索引
        
        for i in range(dataLen) :
            value=data[i]
            if JSAlgorithm.IsNumber(value) and value>0:
                latestID=i  # 最新满足条件的数据索引

            if latestID!=None and i-latestID<n :
                result[i]=1
            else :
                result[i]=0

        return result

    def TFILTER(self, data,data2,n) :
        # TODO: 待完成
        return []

    # 过滤连续出现的信号.
    # 用法:FILTER(X,N):X满足条件后,将其后N周期内的数据置为0,N为常量.
    # 例如: FILTER(CLOSE>OPEN,5)查找阳线,5天内再次出现的阳线不被记录在内
    def FILTER(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen = len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        for i in range(dataLen) :
            if data[i] :
                result[i]=1
                for j in range(j<n) :
                    if j+i+1>=dataLen :
                        break
                    result[j+i+1]=0
                i+=n
            else :
                result[i]=0
                
        return result

    def BARSLAST(self, data) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen = len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        day=None
        for i in range(dataLen) :
            if data[i]>0:
                day=0
            elif day!=None : 
                day+=1

            if day!=None :
                result[i]=day

        return result

    
    # N周期内第一个条件成立到当前的周期数.
    # 用法: BARSSINCEN(X,N):N周期内第一次X不为0到现在的天数,N为常量
    # 例如: BARSSINCEN(HIGH>10,10)表示10个周期内股价超过10元时到当前的周期数
    def BARSSINCEN(self, data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []
    
        dataLen = len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        
        day=None
        for i in range(dataLen) :
            if day==None :
                if data[i] :
                    day=0
            else :
                if data[i] :
                    if day+1<n :
                        day+=1
                else :
                    day=None

            if day: 
                result[i]=day

        return result

    
    # 第一个条件成立到当前的周期数.
    # 用法: BARSSINCE(X):第一次X不为0到现在的天数
    # 例如: BARSSINCE(HIGH>10)表示股价超过10元时到当前的周期数
    def BARSSINCE(self, data) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen = len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        day=None
        for i in range(dataLen) :
            if day==None :
                if data[i] :
                    day=0
            else :
                day+=1

            if day :
                result[i]=day

        return result

    # 三角函数调用 func 三角函数 
    # 反正切值. 用法: ATAN(X)返回X的反正切值
    # 反余弦值. 用法: ACOS(X)返回X的反余弦值
    # 反正弦值. 用法: ASIN(X)返回X的反正弦值
    # 余弦值.  用法: COS(X)返回X的余弦值
    # 正弦值.  用法: SIN(X)返回X的正弦值
    # 正切值.  用法: TAN(X)返回X的正切值
    #
    # 求自然对数. 用法: LN(X)以e为底的对数 例如: LN(CLOSE)求收盘价的对数
    # 求10为底的对数. 用法: LOG(X)取得X的对数 例如: LOG(100)等于2
    # 指数. 用法: EXP(X)为e的X次幂 例如: EXP(CLOSE)返回e的CLOSE次幂
    # 开平方. 用法: SQRT(X)为X的平方根 例如: SQRT(CLOSE)收盘价的平方根
    def Trigonometric(self, data,func) :
        if JSAlgorithm.IsNumber(data) :
            return func(data)

        if not JSAlgorithm.IsVaildArray(data) :
            return []
        
        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        for i in range(dataLen) :
            item=data[i]
            if JSAlgorithm.IsNumber(item) :
                result[i]=func(item)

        return result

    # LAST(X,A,B):持续存在.
    # 用法: LAST(CLOSE>OPEN,10,5) 
    # 表示从前10日到前5日内一直阳线
    # 若A为0,表示从第一天开始,B为0,表示到最后日止
    def LAST(self, data,n,n2) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        if n2<=0: 
            n2=dataLen-1
        if n2>n :
            return []

        result=JSAlgorithm.CreateArray(dataLen,0)
        for i in range(dataLen) :
            day=0
            start=i-n
            end=i-n2
            if start<0 or end<0 :
                continue

            for j in range(start, dataLen) :
                if j>end :
                    break
                if not data[j] :
                    break
                day+=1

            if day==end-start+1 :   #[start,end]
                result[i]=1

        return result

    # 返回是否连涨周期数.
    # 用法: UPNDAY(CLOSE,M)
    # 表示连涨M个周期,M为常量
    def UPNDAY(self, data,n) :
        if not JSAlgorithm.IsVaildArray(data) or n<1 :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen,0)
        days=0
        for i in range(dataLen) :
            if i-1<0 :
                continue

            if not JSAlgorithm.IsNumber(data[i]) or  not JSAlgorithm.IsNumber(data[i-1]) : # 无效数都不算连涨
                days=0
                continue

            if data[i]>data[i-1] :
                days+=1
            else : 
                days=0

            if days==n :
                result[i]=1
                days-=1

        return result

    
    # 返回是否连跌周期.
    # 用法: DOWNNDAY(CLOSE,M)
    # 表示连跌M个周期,M为常量
    def DOWNNDAY(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) or n<1 :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen,0)
        days=0
        for i in range(dataLen) :
            if i-1<0 :
                continue
            if not JSAlgorithm.IsNumber(data[i]) or not JSAlgorithm.IsNumber(data[i-1]) : # 无效数都不算连涨
                days=0
                continue

            if data[i]<data[i-1] :
                days+=1
            else :
                days=0

            if days==n :
                result[i]=1
                days-=1

        return result

    #返回是否持续存在X>Y
    #用法:
    #NDAY(CLOSE,OPEN,3)
    #表示连续3日收阳线
    def NDAY(self,data,data2,n):
        if n<1:
            return []
        if not JSAlgorithm.IsArray(data) and not JSAlgorithm.IsArray(data2):
            return []

        if JSAlgorithm.IsArray(data) and JSAlgorithm.IsArray(data2) :
            len1 , len2= len(data), len(data2)
            if n>=len1 or n>=len2 :
                return []

            count=max(len1,len2)
            result=JSAlgorithm.CreateArray(count,0)
            days=0
            for i in range(count):
                if i>=len1 or i>=len2:
                    continue
                if not JSAlgorithm.IsNumber(data[i]) or not JSAlgorithm.IsNumber(data2[i]) :
                    days=0
                    continue

                if data[i]>data2[i] :
                    days+=1
                else :
                    days=0

                if days==n :
                    result[i]=1
                    days-=1

        elif JSAlgorithm.IsArray(data) and JSAlgorithm.IsNumber(data2) :
            len1=len(data)
            if n>=len1 :
                return []

            result=JSAlgorithm.CreateArray(len1,0)
            days=0
            for i in range(len1) :
                if not JSAlgorithm.IsNumber(data[i])  :                
                    days=0
                    continue

                if data[i]>data2 :
                    day+=1
                else :
                    days=0

                if days==n :
                    result[i]=1
                    days-=1

        elif JSAlgorithm.IsNumber(data) and JSAlgorithm.IsArray(data2) :
            len2=len(data2)
            if n>=len2 :
                return []

            result=JSAlgorithm.CreateArray(len2,0) 
            days=0
            for i in range(len2) :
                if not JSAlgorithm.IsNumber(data2[i]) :
                    days=0
                    continue

                if data>data2[i] :
                    days+=1
                else :
                    days=0

                if days==n :
                    result[i]=1
                    days-=1

        return result

    # 两条线维持一定周期后交叉.
    # 用法:LONGCROSS(A,B,N)表示A在N周期内都小于B,本周期从下方向上穿过B时返回1,否则返回0
    def LONGCROSS(self,data,data2,n) :
        if not JSAlgorithm.IsArray(data) and not JSAlgorithm.IsArray(data2) :
            return []

        if n<1 : 
            return []

        len1 , len2= len(data), len(data2)  
        count=max(len1,len2)
        result=JSAlgorithm.CreateArray(count,0)
        for i in range(count) :
            if i-1<0:
                continue
            if i>=len1 or i>=len2 :
                continue

            if not JSAlgorithm.Is2Number(data[i], data2[i]) or  not JSAlgorithm.Is2Number(data[i-1],data2[i-1]) :
                continue

            if data[i]>data2[i] and data[i-1]<data2[i-1] :
                result[i]=1

        for i in range(count) :
            if not result[i] :
                continue
            for j in range(n) :
                if i-j<0 :
                    break
                if data[i-j]>=data2[i-j] :
                    result[i]=0
                    break

        return result

    # EXISTR(X,A,B):是否存在(前几日到前几日间).
    # 例如: EXISTR(CLOSE>OPEN,10,5) 
    # 表示从前10日内到前5日内存在着阳线
    # 若A为0,表示从第一天开始,B为0,表示到最后日止
    def EXISTR(self,data,n,n2) :
        if not JSAlgorithm.IsArray(data) :
            return []

        dataLen=len(data)
        
        if n<=0 :
            n=dataLen
        if n2<=0: 
            n2=1
        if n2>n :
            return []

        result=JSAlgorithm.CreateArray(dataLen)
        for i in range(dataLen) :
            if i-n<0 or i-n2<0 :
                continue

            result[i]=0
            for j in range(n,n2-1,-1) :
                value=data[i-j]
                if JSAlgorithm.IsNumber(value) and value :
                    result[i]=1
                    break

        return result

    # RELATE(X,Y,N) 返回X和Y的N周期的相关系数
    # RELATE(X,Y,N)=(∑[(Xi-Avg(X))(Yi-Avg(y))])/N ÷ √((∑(Xi-Avg(X))^2)/N * (∑(Yi-Avg(Y))^2)/N)
    # 其中 avg(x)表示x的N周期均值：  avg(X) = (∑Xi)/N  
    # √(...)表示开平方
    def RELATE(self,data,data2,n) :
        if not JSAlgorithm.IsVaildArray(data) or not JSAlgorithm.IsVaildArray(data2) :
            return []

        if n<1:
            n=1

        dataAverage=JSAlgorithm.ArrayAverage(data,n)
        data2Average=JSAlgorithm.ArrayAverage(data2,n)

        count=max(len(data),len(data2))
        result=JSAlgorithm.CreateArray(count)
        for i in range(count) :
            if i>=len(data) or i>=len(data2) or i>=len(dataAverage) or i>=len(data2Average) :
                continue

            average=dataAverage[i]
            average2=data2Average[i]

            total,total2,total3 = 0,0,0
            for j in range(i-n+1, i+1) :
                total+=(data[j]-average)*(data2[j]-average2)   # ∑[(Xi-Avg(X))(Yi-Avg(y))])
                total2+=math.pow(data[j]-average,2)            # ∑(Xi-Avg(X))^2
                total3+=math.pow(data2[j]-average2,2)          # ∑(Yi-Avg(Y))^2)

            result[i]=(total/n)/(math.sqrt(total2/n)*math.sqrt(total3/n))

        return result

    
    # COVAR(X,Y,N) 返回X和Y的N周期的协方差
    def COVAR(self,data,data2,n) :
        if not JSAlgorithm.IsArray(data) or not JSAlgorithm.IsArray(data2) :
            return []

        if n<1:
            n=1

        dataAverage=JSAlgorithm.ArrayAverage(data,n)
        data2Average=JSAlgorithm.ArrayAverage(data2,n)
        len1, len2= len(data), len(data2)
        count=max(len1,len2)
        result=JSAlgorithm.CreateArray(count)

        for i in range(count) :
            if i>=len1 or i>=len2 or i>=len(dataAverage) or i>=len(data2Average) :
                continue

            average=dataAverage[i]
            average2=data2Average[i]

            total=0
            for j in range(i-n+1, i+1) :
                total+=(data[j]-average)*(data2[j]-average2)  
            result[i]=(total/n)

        return result


    
    # 求上一高点到当前的周期数.
    # 用法: HHVBARS(X,N):求N周期内X最高值到当前周期数,N=0表示从第一个有效值开始统计
    # 例如: HHVBARS(HIGH,0)求得历史新高到到当前的周期数
    def HHVBARS(self,data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        if n<1:
            n=dataLen

        result=JSAlgorithm.CreateArray(dataLen)
        nMax=None  # 最大值索引
        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                nMax=i
                break

        j=0
        for i in range(nMax+1,dataLen) :   # 求第1个最大值
            if j>=n :
                break

            if data[i]>=data[nMax]:
                nMax=i
            if n==dataLen :
                result[i]=(i-nMax)
            j+=1
            
        for i in range(i,dataLen) :
            if i-nMax<n :
                if data[i]>=data[nMax] :
                    nMax=i
            else :
                nMax=i-n+1
                for j in range(nMax, i+1) : # 计算区间最大值
                    if data[j]>=data[nMax] :
                        nMax=j

            result[i]=i-nMax

        return result


    # 求上一低点到当前的周期数.
    # 用法: LLVBARS(X,N):求N周期内X最低值到当前周期数,N=0表示从第一个有效值开始统计
    # 例如: LLVBARS(HIGH,20)求得20日最低点到当前的周期数
    def LLVBARS(self, data,n) :
        if not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)  
        if n<1 : 
            n=dataLen

        result=JSAlgorithm.CreateArray(dataLen)
        nMin=None  # 最小值索引
        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                nMin=i
                break

        j=0
        for i in range(nMin+1,dataLen) :    # 求第1个最大值
            if j>=n :
                break
            if data[i]<=data[nMin] :
                nMin=i
            if n==dataLen :
                result[i]=i-nMin
            j+=1

        for i in range(i,dataLen) :
            if i-nMin<n :
                if data[i]<=data[nMin] :
                    nMin=i
            else :
                nMin=i-n+1
                for j in range(nMin, i+1):  # 计算区间最小值
                    if data[j]<=data[nMin] :
                        nMin=j

            result[i]=i-nMin

        return result


    # β(Beta)系数
    # BETA(N) 返回当前证券N周期收益与对应大盘指数收益相比的贝塔系数
    # 需要下载上证指数历史数据
    # 涨幅(X)=(现价-上一个交易日收盘价）/上一个交易日收盘价
    # 公式=股票和指数协方差/指数方差
    def BETA(self,n) :
        stockData=self.SymbolData.Data
        indexData=self.SymbolData.IndexData
        if n<=0 :
            n=1

        dataLen=len(stockData.Data)
        stockProfit=JSAlgorithm.CreateArray(dataLen,0)    # 股票涨幅
        indexProfit=JSAlgorithm.CreateArray(dataLen,0)    # 指数涨幅
        for i in range(dataLen) :
            stockItem=stockData.Data[i]
            indexItem=indexData.Data[i]

            if stockItem.Close>0 and stockItem.YClose>0 :
                stockProfit[i]=(stockItem.Close-stockItem.YClose)/stockItem.YClose
            if indexItem.Close>0 and indexItem.YClose>0 :
                indexProfit[i]=(indexItem.Close-indexItem.YClose)/indexItem.YClose


        # 计算均值数组
        averageStockProfit=JSAlgorithm.ArrayAverage(stockProfit,n)   
        averageIndexProfit=JSAlgorithm.ArrayAverage(indexProfit,n)

        result=JSAlgorithm.CreateArray(dataLen)

        for i in range(dataLen) :
            if i>=len(stockProfit) or i>=len(indexProfit) or i>=len(averageStockProfit) or i>=len(averageIndexProfit) :
                continue

            averageStock=averageStockProfit[i]
            averageIndex=averageIndexProfit[i]

            covariance=0   # 协方差
            variance=0     # 方差
            for j in range(i-n+1, i+1) :
                value=(indexProfit[j]-averageIndex)
                value2=(stockProfit[j]-averageStock)
                covariance+=value*value2 
                variance+=value*value 

            if JSAlgorithm.IsDivideNumber(variance) and JSAlgorithm.IsNumber(covariance) :
                result[i]=covariance/variance  # (covariance/n)/(variance/n)=covariance/variance;

        return result


    # 用法:BETA2(X,Y,N)为X与Y的N周期相关放大系数,表示Y变化1%,则X将变化N%
    # 例如:BETA2(CLOSE,INDEXC,10)表示收盘价与大盘指数之间的10周期相关放大率
    def BETA2(self,x,y,n) :
        if not JSAlgorithm.IsVaildArray(x) or not JSAlgorithm.IsVaildArray(y) :
            return []

        xLen, yLen = len(x), len(y)
        if n<=0 : 
            n=1

        xProfit=JSAlgorithm.CreateArray(xLen,0) # x数据的涨幅
        yProfit=JSAlgorithm.CreateArray(yLen,0) # y数据的涨幅

        count=max(xLen,yLen)

        lastX, lastY = x[0], y[0]
        for i in range(count) :
            xItem=x[i]
            yItem=y[i]

            if lastX>0 :
                xProfit[i]=(xItem-lastX)/lastX
            if lastY>0 : 
                yProfit[i]=(yItem-lastY)/lastY

            lastX=xItem
            lastY=yItem

        # 计算均值数组
        averageXProfit=JSAlgorithm.ArrayAverage(xProfit,n)    
        averageYProfit=JSAlgorithm.ArrayAverage(yProfit,n)

        result=JSAlgorithm.CreateArray(count)

        for i in range(count) :
            if i>=len(xProfit) or i>=len(yProfit) or i>=len(averageXProfit) or i>=len(averageYProfit) :
                continue

            averageX=averageXProfit[i]
            averageY=averageYProfit[i]

            covariance=0   # 协方差
            variance=0     # 方差
            for j in range(i-n+1, i+1) :
                value=(xProfit[j]-averageX)
                value2=(yProfit[j]-averageY)
                covariance+=value*value2 
                variance+=value*value

            if JSAlgorithm.IsDivideNumber(variance) and JSAlgorithm.IsNumber(covariance) :
                result[i]=covariance/variance  # (covariance/n)/(variance/n)=covariance/variance;

        return result

    # 一直存在.
    # 例如: EVERY(CLOSE>OPEN,N) 
    # 表示N日内一直阳线(N应大于0,小于总周期数,N支持变量)
    def EVERY(self,data,n):
        if n<1 or  not JSAlgorithm.IsVaildArray(data) :
            return []

        dataLen=len(data)
        result=JSAlgorithm.CreateArray(dataLen)
        for i in range(dataLen) :
            if JSAlgorithm.IsNumber(data[i]) :
                break
        
        flag=0
        for i in range(i,dataLen) :
            if data[i]: 
                flag+=1
            else :
                flag=0
            
            if flag==n :
                result[i]=1
                flag-=1
            else :
                result[i]=0

        return result

    
    # 抛物转向.
    # 用法: SAR(N,S,M),N为计算周期,S为步长,M为极值
    # 例如: SAR(10,2,20)表示计算10日抛物转向,步长为2%,极限值为20%
    def SAR(self,n,step,exValue) :
        stockData= self.SymbolData.Data
        dataLen=len(stockData.Data)
        if n>=dataLen  :
            return []
        
        result=JSAlgorithm.CreateArray(dataLen)
        high, low =None, None
        for i in range(n) :
            item=stockData.Data[i]
            if high==None:
                high=item.High
            elif high<item.High :
                high=item.High

            if low==None : 
                low=item.Low
            elif low>item.Low :
                low=item.Low

        SAR_LONG=0
        SAR_SHORT=1
        position=SAR_LONG
        result[n-1]=low
        nextSar=low
        sip=stockData.Data[0].High
        af=exValue/100
        for i in range(n,dataLen) :
            ysip=sip
            item=stockData.Data[i]
            yitem=stockData.Data[i-1]

            if (position==SAR_LONG) :
                if (item.Low<result[i-1]) :
                    position=SAR_SHORT
                    sip=item.Low
                    af=step/100
                    nextSar =max(item.High,yitem.High)
                    nextSar =max(nextSar,ysip+af*(sip-ysip))
                else :
                    position = SAR_LONG
                    if (item.High>ysip) :
                        sip=item.High
                        af=min(af+step/100,exValue/100)
                    nextSar=min(item.Low,yitem.Low)
                    nextSar=min(nextSar,result[i-1]+af*(sip-result[i-1]))
            elif (position==SAR_SHORT) :
                if (item.High>result[i-1]) :
                    position=SAR_LONG
                    sip=item.High
                    af=step/100
                    nextSar =min(item.Low,yitem.Low)
                    nextSar =min(nextSar,result[i-1]+af*(sip-ysip))
                else :
                    position = SAR_SHORT
                    if(item.Low<ysip) :
                        sip=item.Low
                        af=min(af+step/100,exValue/100)
                    nextSar=max(item.High,yitem.High)
                    nextSar=max(nextSar,result[i-1]+af*(sip-result[i-1]))

            result[i]=nextSar

        return result


    # 抛物转向点.
    # 用法: SARTURN(N,S,M),N为计算周期,S为步长,M为极值,若发生向上转向则返回1,若发生向下转向则返回-1,否则为0
    # 其用法与SAR函数相同
    def SARTURN(self,n,step,exValue) :
        sar=self.SAR(n,step,exValue)
        stockData= self.SymbolData.Data
        dataLen=len(stockData)
        result=JSAlgorithm.CreateArray(dataLen)

        for index in range(len(sar)) :
            if JSAlgorithm.IsNumber(sar[index]) :
                break
        
        flag=0
        if index<dataLen :
            flag=stockData.Data[index].Close>sar[index]

        for i in range(index+1,dataLen) :
            item=stockData.Data[i]
            if item.Close<sar[i] and flag :
                result[i]=-1
            else :
                result[i]= 1 if (item.Close>sar[i] and not flag) else 0

            flag=item.Close>sar[i]

        return result

    
    # 属于未来函数,将当前位置到若干周期前的数据设为1.
    # 用法: BACKSET(X,N),若X非0,则将当前位置到N周期前的数值设为1.
    # 例如: BACKSET(CLOSE>OPEN,2)若收阳则将该周期及前一周期数值设为1,否则为0
    def BACKSET(self,condition,n) :
        if not condition :
            return []
        dataCount=len(condition)
        if dataCount<=0 :
            return []

        result=JSAlgorithm.CreateArray(dataCount,0)   # 初始化0

        for pos in range(dataCount) :
            if JSAlgorithm.IsNumber(condition[pos]) :
                break

        if pos==dataCount :
            return result

        num=min(dataCount-pos,max(n,1))
        for i in range(dataCount-1, -1,-1) :
            value=condition[i]
            if JSAlgorithm.IsNumber(value) and value :
                for j in range(i, i-num,-1) :
                    result[j]=1

        if condition[i] :
            for j in range(i, pos+1) :
                result[j]=1

        return result



    # 函数调用
    def CallFunction(self,name,args,node,symbolData=None) :
        if name=='MAX':
            return self.MAX(args[0], args[1])
        elif name=='MIN':
            return self.MIN(args[0], args[1])
        elif name=='REF':
            return self.REF(args[0], int(args[1]))
        elif name=='ABS':
            return self.ABS(args[0])
        elif name=='MA':
            return self.MA(args[0], int(args[1]))
        elif name=="EMA":
            return self.EMA(args[0], int(args[1]))
        elif name=="SMA":
            return self.SMA(args[0], int(args[1]),int(args[2]))
        elif name=="DMA":
            return self.DMA(args[0], args[1])
        elif name=='EXPMA':
            return self.EXPMA(args[0], int(args[1]))
        elif name=='EXPMEMA':
            return self.EXPMEMA(args[0], int(args[1]))
        elif name=='COUNT':
            return self.COUNT(args[0], int(args[1]))
        elif name=='LLV':
            return self.LLV(args[0], args[1])
        elif name=='LLVBARS':
            return self.LLVBARS(args[0], int(args[1]))
        elif name=='HHV':
            return self.HHV(args[0], args[1])
        elif name=='HHVBARS':
            return self.HHVBARS(args[0], int(args[1]))
        elif name=='MULAR':
            return self.MULAR(args[0], int(args[1]))
        elif name=='CROSS':
            return self.CROSS(args[0], args[1])
        elif name=='LONGCROSS':
            return self.LONGCROSS(args[0], args[1], int(args[2]))
        elif name=='AVEDEV':
            return self.AVEDEV(args[0], int(args[1]))
        elif name=='STD':
            return self.STD(args[0], int(args[1]))
        elif name in ('IF','IFF'):
            return self.IF(args[0], args[1], args[2])
        elif name=='IFN':
            return self.IFN(args[0], args[1], args[2])
        elif name=='NOT':
            return self.NOT(args[0])
        elif name=='SUM':
            return self.SUM(args[0], int(args[1]))
        elif name=='RANGE':
            return self.RANGE(args[0],args[1],args[2])
        elif name=='EXIST':
            return self.EXIST(args[0],int(args[1]))
        elif name=='EXISTR':
            return self.EXISTR(args[0],int(args[1]),int(args[2]))
        elif name=='FILTER':
            return self.FILTER(args[0],args[1])
        elif name=='TFILTER':
            return self.TFILTER(args[0],args[1],int(args[2]))
        elif name=='SLOPE':
            return self.SLOPE(args[0],int(args[1]))
        elif name=='BARSLAST':
            return self.BARSLAST(args[0])
        elif name=='BARSCOUNT':
            return self.BARSCOUNT(args[0])
        elif name=='BARSSINCEN':
            return self.BARSSINCEN(args[0],int(args[1]))
        elif name=='BARSSINCE':
            return self.BARSSINCE(args[0])
        elif name=='LAST':
            return self.LAST(args[0],int(args[1]),int(args[2]))
        elif name=='EVERY':
            return self.EVERY(args[0],int(args[1]))
        elif name=='DEVSQ':
            return self.DEVSQ(args[0], int(args[1]))
        elif name=='ZIG':
            return self.ZIG(args[0],args[1])
        elif name=='TROUGHBARS':
            return self.TROUGHBARS(args[0],args[1],args[2])
        elif name=='PEAKBARS':
            return self.PEAKBARS(args[0],args[1],args[2])
        elif name=='COST':
            return self.COST(args[0])
        elif name=='WINNER':
            return self.WINNER(args[0])
        elif name=='FORCAST':
            return self.FORCAST(args[0], int(args[1]))
        elif name=='STDP':
            return self.STDP(args[0], int(args[1]))
        elif name=='VAR':
            return self.VAR(args[0], int(args[1]))
        elif name=='VARP':
            return self.VARP(args[0], int(args[1]))
        elif name=='UPNDAY':
            return self.UPNDAY(args[0],int(args[1]))
        elif name=='DOWNNDAY':
            return self.DOWNNDAY(args[0],int(args[1]))
        elif name=='NDAY':
            return self.NDAY(args[0],args[1],int(args[2]))
        elif name=='RELATE':
            return self.RELATE(args[0],args[1],int(args[2]))
        elif name=='COVAR':
            return self.COVAR(args[0],args[1],int(args[2]))
        elif name=='BETA':
            return self.BETA(int(args[0]))
        elif name=='BETA2':
            return self.BETA2(args[0],args[1],int(args[2]))
        elif name=='WMA':
            return self.WMA(args[0], int(args[1]))
        elif name=='MEMA':
            return self.MEMA(args[0], int(args[1]))
        elif name=='SUMBARS':
            return self.SUMBARS(args[0], args[1])
        elif name=='REVERSE':
            return self.REVERSE(args[0])
        elif name=='SAR':
            return self.SAR(int(args[0]), args[1], args[2])
        elif name=='SARTURN':
            return self.SARTURN(int(args[0]), args[1], args[2])
        elif name=='BACKSET':
            return self.BACKSET(args[0], int(args[1]))
            # 三角函数
        elif name=='ATAN':
            return self.Trigonometric(args[0],math.atan)
        elif name=='ACOS':
            return self.Trigonometric(args[0],math.acos)
        elif name=='ASIN':
            return self.Trigonometric(args[0],math.asin)
        elif name=='COS':
            return self.Trigonometric(args[0],math.cos)
        elif name=='SIN':
            return self.Trigonometric(args[0],math.sin)
        elif name=='TAN':
            return self.Trigonometric(args[0],math.tan)
        elif name=='LN':
            return self.Trigonometric(args[0],math.log)
        elif name=='LOG':
            return self.Trigonometric(args[0],math.log10)
        elif name=='EXP':
            return self.Trigonometric(args[0],math.exp)
        elif name=='SQRT':
            return self.Trigonometric(args[0],math.sqrt)
        else:
            self.ThrowUnexpectedNode(node,'函数'+name+'不存在')


    def ThrowUnexpectedNode(self, node,message='执行异常') :
        marker=node.Marker
        msg=message
        return self.ErrorHandler.ThrowError(marker.Index,marker.Line,marker.Column,msg)


#######################################################################################################
#
#  绘图函数 
#
#######################################################################################################

class DrawItem:
    def __init__(self, drawType, drawData=[], text=None) :
        self.DrawType=drawType
        self.DrawData=drawData
        self.Text=None

class JSDraw():
    def __init__(self, errorHandler, symbolData) :
        self.ErrorHandler=errorHandler
        self.SymbolData=symbolData

    @staticmethod
    def IsDrawFunction(name) :
        return name in ("STICKLINE","DRAWTEXT",'SUPERDRAWTEXT','DRAWLINE','DRAWBAND','DRAWKLINE','DRAWKLINE_IF',
                            'PLOYLINE','POLYLINE','DRAWNUMBER','DRAWICON','DRAWCHANNEL')

    def DRAWTEXT(self, condition,price,text) :
        result=DrawItem(drawType='DRAWTEXT', text=text)
        if (len(condition)<=0) :
            return result
        
        dataLen=len(condition)
        drawData=JSComplierHelper.CreateArray(dataLen)
        IsNumber=JSComplierHelper.IsNumber(price)

        for i in range(dataLen) :
            if JSComplierHelper.IsNaN(condition[i]) or not condition[i] :
                continue

            if (IsNumber) : 
                drawData[i]=price
            else :
                if (JSComplierHelper.IsNumber(price[i])) :
                    drawData[i]=price[i]

        result.DrawData=drawData
        return result

    # direction 文字Y轴位置 0=middle 1=价格的顶部 2=价格的底部
    # offset 文字Y轴偏移
    def SUPERDRAWTEXT(self,condition,price,text,direction,offset) :
        result=DrawItem(drawType='SUPERDRAWTEXT', text=text)
        result.YOffset=offset
        result.Direction=direction
        result.TextAlign='center'
        if len(condition)<=0 :
            return result

        dataLen=len(condition)
        drawData=JSComplierHelper.CreateArray(dataLen)
        IsNumber=JSComplierHelper.IsNumber(price)

        for i in range(dataLen) :
            if JSComplierHelper.IsNaN(condition[i]) or not condition[i] :
                continue

            if IsNumber :
                drawData[i]=price
            else :
                if JSComplierHelper.IsNumber(price[i]) :
                    drawData[i]=price[i]

        result.DrawData=drawData
        return result


    # STICKLINE 绘制柱线
    # 在图形上绘制柱线。
    # 用法：　STICKLINE(COND，PRICE1，PRICE2，WIDTH，EMPTY)，当COND条件满足时，在PRICE1和PRICE2位置之间画柱状线，宽度为WIDTH(10为标准间距)，EMPTH不为0则画空心柱。
    # 例如：　STICKLINE(CLOSE>OPEN，CLOSE，OPEN，0.8，1)表示画K线中阳线的空心柱体部分。
    def STICKLINE(self, condition,data,data2,width,type) :
        result=DrawItem(drawType='STICKLINE')
        result.Width=width 
        result.Type=int(type)

        if len(condition)<=0 :
            return result

        dataLen=len(condition)
        drawData=JSComplierHelper.CreateArray(dataLen)
        isNumber=JSComplierHelper.IsNumber(data)
        isNumber2=JSComplierHelper.IsNumber(data2)
   
        for i in range(dataLen) :
            if JSComplierHelper.IsNaN(condition[i]) or not condition[i] :
                continue

            if isNumber and isNumber2 :
                item=Variant()
                item.Value,item.Value2 = data,data2
                drawData[i]=item
            elif isNumber and not isNumber2 :
                if JSComplierHelper.IsNaN(data2[i]) :
                    continue
                item=Variant()
                item.Value,item.Value2 = data,data2[i]
                drawData[i]=item
            elif not isNumber and isNumber2 :
                if JSComplierHelper.IsNaN(data[i]) :
                    continue
                item=Variant()
                item.Value,item.Value2 = data[i],data2
                drawData[i]=item
            else :
                if JSComplierHelper.IsNaN(data[i]) or JSComplierHelper.IsNaN(data2[i]) : 
                    continue
                item=Variant()
                item.Value,item.Value2 = data[i],data2[i]
                drawData[i]=item

        result.DrawData=drawData
        return result

    # 画出带状线.
    # 用法: DRAWBAND(VAL1,COLOR1,VAL2,COLOR2),当VAL1>VAL2时,在VAL1和VAL2之间填充COLOR1;当VAL1<VAL2时,填充COLOR2,这里的颜色均使用RGB函数计算得到.
    # 例如: DRAWBAND(OPEN,RGB(0,224,224),CLOSE,RGB(255,96,96));
    def DRAWBAND(self,data,color,data2,color2) :
        result=DrawItem(drawType='DRAWBAND')
        result.Color=[color.lower(),color2.lower()]  # 颜色使用小写字符串
        len1, len2=len(data), len(data2)
        count=max(len1, len2)

        drawData=[]
        for i in range(count) :
            item=Variant()
            item.Value, item.Value2 = None, None
            if (i<len1) :
                item.Value=data[i]
            if (i<len2) :
                item.Value2=data2[i]

            drawData.append(item)

        result.DrawData=drawData
        return result

    def DRAWKLINE(self,high,open,low,close) :
        result=DrawItem(drawType='DRAWKLINE')
        highLen, openLen, lowLen, closeLen=len(high),len(open), len(low), len(close)
        count=max(highLen, openLen,lowLen,closeLen)
        drawData=JSComplierHelper.CreateArray(count)
        for i in range(count) :
            item=Variant()
            item.Open, item.High, item.Low,item.Close = None, None, None, None
            if (i<highLen and i<openLen and i<lowLen and i<closeLen) :
                item.Open=open[i]
                item.High=high[i]
                item.Low=low[i]
                item.Close=close[i]

            drawData[i]=item

        result.DrawData=drawData
        return result

    # 满足条件画一根K线
    def DRAWKLINE_IF(self, condition,high,open,low,close) :
        result=DrawItem(drawType='DRAWKLINE_IF')
        highLen, openLen, lowLen, closeLen=len(high),len(open), len(low), len(close)
        count=max(highLen, openLen,lowLen,closeLen)
        drawData=JSComplierHelper.CreateArray(count)

        for i in range(count) :
            item=Variant()
            item.Open, item.High, item.Low,item.Close = None, None, None, None

            if (i<highLen and i<openLen and i<lowLen and i<closeLen and i<len(condition)) :
                if (condition[i]) :
                    item.Open=open[i]
                    item.High=high[i]
                    item.Low=low[i]
                    item.Close=close[i]

            drawData[i]=item

        result.DrawData=drawData
        return result

    
    # 画出数字.
    # 用法: DRAWNUMBER(COND,PRICE,NUMBER),当COND条件满足时,在PRICE位置书写数字NUMBER.
    # 例如: DRAWNUMBER(CLOSE/OPEN>1.08,LOW,C)表示当日实体阳线大于8%时在最低价位置显示收盘价.
    def DRAWNUMBER(self, condition,data,data2) :
        drawData=Variant()
        drawData.Value, drawData.Text = [], []
        result=DrawItem(drawType='DRAWNUMBER', drawData=drawData)

        isNumber=JSComplierHelper.IsNumber(data2)
        if (isNumber) :
            text= '%.2f' % data2

        count=len(condition)
        drawData.Value=JSComplierHelper.CreateArray(count)
        drawData.Text=JSComplierHelper.CreateArray(count)

        for i in range(count) :
            if not condition[i] :
                continue
            if i>=len(data) or not JSComplierHelper.IsNumber(data[i]) :
                continue

            if (isNumber) :
                drawData.Value[i]=data[i]
                drawData.Text[i]=text
            else :
                if i>=len(data2) or data2[i]==None :
                    continue
                drawData.Value[i]=data[i]
                if JSComplierHelper.IsNumber(data2[i]) :
                    drawData.Text[i] = '%.2f' % data2[i]
                else :
                    drawData.Text[i] = str(data2[i])

        result.DrawData=drawData
        return result

    # 在图形上绘制小图标.
    # 用法: DRAWICON(COND,PRICE,TYPE),当COND条件满足时,在PRICE位置画TYPE号图标(TYPE为1--41).
    # 例如: DRAWICON(CLOSE>OPEN,LOW,1)表示当收阳时在最低价位置画1号图标.
    def DRAWICON(self, condition,data,type) :
        icon=Variant()
        if (type not in g_JSComplierResource.DrawIcon.Data) :
            type=11 #默认图标
        iconfont=g_JSComplierResource.DrawIcon.Data[type]
        icon=Variant()
        icon.Symbol, icon.Color, icon.Family, icon.IconFont, icon.ID = iconfont.Text, iconfont.Color, g_JSComplierResource.DrawIcon.Family, True, type

        result=DrawItem(drawType='DRAWICON')
        result.Icon=icon
        if (len(condition)<=0) :
            return result

        isNumber=JSComplierHelper.IsNumber(data)
        if JSComplierHelper.IsNumber(condition) :
            if not condition : 
                return result

            drawData=JSComplierHelper.CreateArray(len(self.SymbolData.Data.Data))
            for i in range(len(self.SymbolData.Data.Data)) :
                if isNumber : 
                    drawData[i]=data
                else :
                    if i<len(data) and JSComplierHelper.IsNumber(data[i]) :
                        drawData[i]=data[i]
            return result

        drawData=JSComplierHelper.CreateArray(len(condition))
        for i in range(len(condition)) :
            if not condition[i] :
                continue

            if isNumber :
                drawData[i]=data
            else :
                if JSComplierHelper.IsNumber(data[i]) :
                    drawData[i]=data[i]

        result.DrawData=drawData
        return result

    # PLOYLINE 折线段
    # 在图形上绘制折线段。
    # 用法：　PLOYLINE(COND，PRICE)，当COND条件满足时，以PRICE位置为顶点画折线连接。
    # 例如：　PLOYLINE(HIGH>=HHV(HIGH,20),HIGH)表示在创20天新高点之间画折线。
    def POLYLINE(self, condition,data) :
        result=DrawItem(drawType='POLYLINE')
        isNumber=JSComplierHelper.IsNumber(data)

        drawData=JSComplierHelper.CreateArray(len(condition))
        bFirstPoint=False
        bSecondPont=False
        if isNumber :
            for i in range(len(condition)) :
                if bFirstPoint==False :
                    if not condition[i] :
                        continue

                    drawData[i]=data
                    bFirstPoint=True
                else :
                    drawData[i]=data

        else :
            lineCache=Variant()
            lineCache.Start, lineCache.End, lineCache.List = Variant(), Variant(), []
            for i in range (len(condition)) :
                if (bFirstPoint==False and bSecondPont==False) :
                    if condition[i]==None or not condition[i] :
                        continue
                    if i>=len(data) or not JSComplierHelper.IsNumber(data[i]) :
                        continue

                    bFirstPoint=True
                    # 第1个点
                    lineCache.Start.ID=int(i)
                    lineCache.Start.Value=data[i]  

                elif (bFirstPoint==True and bSecondPont==False) :
                    if condition[i]==None or not condition[i] :
                        continue
                    if i>=len(data) or not JSComplierHelper.IsNumber(data[i]) :
                        continue

                    # 第2个点
                    lineCache.End.ID=int(i)
                    lineCache.End.Value=data[i]  
                    # 根据起始点和结束点 计算中间各个点的数据
                    lineData=JSComplierHelper.CalculateDrawLine(lineCache)     # 计算2个点的线上 其他点的数值

                    for item in lineData :
                        drawData[item.ID]=item.Value

                    start=Variant()
                    start.ID, start.Value = lineCache.End.ID, lineCache.End.Value
                    lineCache=Variant()
                    lineCache.Start, lineCache.End = start, Variant()

        result.DrawData=drawData
        return result

    
    # DRAWLINE 绘制直线段
    # 在图形上绘制直线段。
    # 用法：　DRAWLINE(COND1，PRICE1，COND2，PRICE2，EXPAND)
    # 当COND1条件满足时，在PRICE1位置画直线起点，当COND2条件满足时，在PRICE2位置画直线终点，EXPAND为延长类型。
    # 例如：　DRAWLINE(HIGH>=HHV(HIGH,20),HIGH,LOW<=LLV(LOW,20),LOW,1)　表示在创20天新高与创20天新低之间画直线并且向右延长。
    def DRAWLINE(self, condition,data,condition2,data2,expand) :
        result=DrawItem(drawType='DRAWLINE')
        result.Expand=expand

        if len(condition)<=0 :
            return result

        condLen1, condLen2 = len(condition), len(condition2)
        count=max(condLen1,condLen2)

        drawData=JSComplierHelper.CreateArray(count)
        bFirstPoint=False
        bSecondPont=False
        lineCache=Variant()
        lineCache.Start, lineCache.End, lineCache.List = Variant(), Variant(), []

        for i in range(count) :
            if (i<condLen1 and i<condLen2) :
                if (bFirstPoint==False and bSecondPont==False) :
                    if condition[i]==None or not condition[i] :
                        continue

                    bFirstPoint=True
                    # 第1个点
                    lineCache.Start.ID=i
                    lineCache.Start.Value=data[i]

                elif (bFirstPoint==True and bSecondPont==False) :
                    bCondition=(condition[i]!=None and condition[i])     # 条件1
                    bCondition2=(condition2[i]!=None and condition2[i])  # 条件2

                    if not bCondition and not bCondition2 :
                        continue

                    if bCondition :
                        # 移动第1个点
                        lineCache.Start.ID=i
                        lineCache.Start.Value=data[i]  
                    elif bCondition2:
                        bSecondPont=True
                        # 第2个点
                        lineCache.End.ID=i
                        lineCache.End.Value=data2[i]   

                elif (bFirstPoint==True and bSecondPont==True) :   # 2个点都有了, 等待下一次的点出现
                    bCondition=(condition[i]!=None and condition[i])     # 条件1
                    bCondition2=(condition2[i]!=None and condition2[i])  # 条件2

                    if bCondition :
                        lineData=JSComplierHelper.CalculateDrawLine(lineCache)     # 计算2个点的线上 其他点的数值

                        for item in lineData :
                            drawData[item.ID]=item.Value

                        bFirstPoint=bSecondPont=False
                        lineCache=Variant()
                        lineCache.Start, lineCache.End = Variant(), Variant()
                    elif bCondition2 :
                        lineCache.End.ID=i
                        lineCache.End.Value=data2[i]   # 移动第2个点

        if bFirstPoint==True and bSecondPont==True :     # 最后一组数据
            lineData=JSComplierHelper.CalculateDrawLine(lineCache)     
            for item in lineData :
                drawData[item.ID]=item.Value

        result.DrawData=drawData
        return result

    
    # 绘制通道
    # condition:条件
    # data,data2:通道顶部和底部
    # borderColor: 通道顶部和底部线段颜色RGB(24,30,40) 不填就不画
    # borderWidth: 通道顶部和底部线段宽度
    # areaColor: 通道面积颜色 RGB(200,30,44) 不填使用默认颜色
    # dotted: 通道顶部和底部虚线设置 '3,4' , 不填默认 3,3
    def DRAWCHANNEL(self,condition, data, data2, borderColor, borderWidth, dotted, areaColor) :
        result=DrawItem(drawType='DRAWCHANNEL')
        result.Border=Variant()

        if borderColor:
            result.Border.Color=borderColor
        if borderWidth>0:
            result.Border.Width=borderWidth
        if areaColor: 
            result.AreaColor=areaColor

        if dotted :
            ary=dotted.split(',')
            result.Border.Dotted=[]
            for item in ary :
                if not item :
                    continue
                value=int(item)
                if value<=0 :
                    continue
                result.Border.Dotted.append(value)
            if len(result.Border.Dotted)<=0:
                 result.Border.Dotted=None

        isNumber=JSComplierHelper.IsNumber(data)
        isNumber2=JSComplierHelper.IsNumber(data2)
        if JSComplierHelper.IsNumber(condition) :
            if not condition :
                return result  # 条件是否

            drawData=JSComplierHelper.CreateArray(len(self.SymbolData.Data.Data))
            for i in range(len(self.SymbolData.Data.Data)) :
                if (isNumber and isNumber2) :
                    item=Variant()
                    item.Value, item.Value2 = data, data2
                    drawData[i]=item
                elif (isNumber and not isNumber2) :
                    if JSComplierHelper.IsNaN(data2[i]) :
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data, data2[i]
                    drawData[i]=item
                elif (not isNumber and isNumber2) :
                    if JSComplierHelper.IsNaN(data[i]):
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data[i], data2
                    drawData[i]=item
                else :
                    if JSComplierHelper.IsNaN(data[i]) or JSComplierHelper.IsNaN(data2[i]) : 
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data[i], data2[i]
                    drawData[i]=item
        else :
            drawData=JSComplierHelper.CreateArray(len(condition))
            for i in range(len(condition)) :
                if JSComplierHelper.IsNaN(condition[i]) or  not condition[i] :
                    continue

                if isNumber and isNumber2 :
                    item=Variant()
                    item.Value, item.Value2 = data, data2
                    drawData[i]=item
                elif (isNumber and not isNumber2) :
                    if JSComplierHelper.IsNaN(data2[i]) :
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data, data2[i]
                    drawData[i]=item
                elif (not isNumber and isNumber2) :
                    if JSComplierHelper.IsNaN(data[i]) :
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data[i], data2
                    drawData[i]=item
                else :
                    if JSComplierHelper.IsNaN(data[i]) or JSComplierHelper.IsNaN(data2[i]) :
                        continue
                    item=Variant()
                    item.Value, item.Value2 = data[i], data2[i]
                    drawData[i]=item

        result.DrawData=drawData
        return result

    