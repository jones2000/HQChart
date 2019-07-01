import sys
from umychart_complier_jssymboldata import JSSymbolData


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
        return isinstance(value,(int,float))

    @staticmethod
    def IsDivideNumber(value):
        return isinstance(value,(int,float)) and value!=0
    
    @staticmethod 
    def Is2Number(value,value2) :
        return isinstance(value,(int,float)) and isinstance(value2,(int,float))

    @staticmethod
    def Is2NaN(value, value2) :
        return value!=None and value2!=None

    @staticmethod
    def IsNaN(value) :
        return value!=None


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
            result=[None]*count # 初始化
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
            return self.COUNT(args[0], args[1])
        elif name=='LLV':
            return self.LLV(args[0], args[1])
        elif name=='LLVBARS':
            return self.LLVBARS(args[0], args[1])
        elif name=='HHV':
            return self.HHV(args[0], args[1])
        elif name=='HHVBARS':
            return self.HHVBARS(args[0], args[1])
        elif name=='MULAR':
            return self.MULAR(args[0], args[1])
        elif name=='CROSS':
            return self.CROSS(args[0], args[1])
        elif name=='LONGCROSS':
            return self.LONGCROSS(args[0], args[1], args[2])
        elif name=='AVEDEV':
            return self.AVEDEV(args[0], args[1])
        elif name=='STD':
            return self.STD(args[0], args[1])
        elif name in ('IF','IFF'):
            return self.IF(args[0], args[1], args[2])
        elif name=='IFN':
            return self.IFN(args[0], args[1], args[2])
        elif name=='NOT':
            return self.NOT(args[0])
        elif name=='SUM':
            return self.SUM(args[0], args[1])
        elif name=='RANGE':
            return self.RANGE(args[0],args[1],args[2])
        elif name=='EXIST':
            return self.EXIST(args[0],args[1])
        elif name=='EXISTR':
            return self.EXISTR(args[0],args[1],args[2])
        elif name=='FILTER':
            return self.FILTER(args[0],args[1])
        elif name=='TFILTER':
            return self.TFILTER(args[0],args[1],args[2])
        elif name=='SLOPE':
            return self.SLOPE(args[0],args[1])
        if name=='BARSLAST':
            return self.BARSLAST(args[0])
        elif name=='BARSCOUNT':
            return self.BARSCOUNT(args[0])
        elif name=='BARSSINCEN':
            return self.BARSSINCEN(args[0],args[1])
        elif name=='BARSSINCE':
            return self.BARSSINCE(args[0])
        elif name=='LAST':
            return self.LAST(args[0],args[1],args[2])
        elif name=='EVERY':
            return self.EVERY(args[0],args[1])
        elif name=='DEVSQ':
            return self.DEVSQ(args[0], args[1])
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
            return self.FORCAST(args[0], args[1])
        elif name=='STDP':
            return self.STDP(args[0], args[1])
        elif name=='VAR':
            return self.VAR(args[0], args[1])
        elif name=='VARP':
            return self.VARP(args[0], args[1])
        elif name=='UPNDAY':
            return self.UPNDAY(args[0],args[1])
        elif name=='DOWNNDAY':
            return self.DOWNNDAY(args[0],args[1])
        elif name=='NDAY':
            return self.NDAY(args[0],args[1],args[2])
        elif name=='RELATE':
            return self.RELATE(args[0],args[1],args[2])
        elif name=='COVAR':
            return self.COVAR(args[0],args[1],args[2])
        elif name=='BETA':
            return self.BETA(args[0])
        elif name=='BETA2':
            return self.BETA2(args[0],args[1],args[2])
        elif name=='WMA':
            return self.WMA(args[0], int(args[1]))
        elif name=='MEMA':
            return self.MEMA(args[0], int(args[1]))
        elif name=='SUMBARS':
            return self.SUMBARS(args[0], args[1])
        elif name=='REVERSE':
            return self.REVERSE(args[0])
        elif name=='SAR':
            return self.SAR(args[0], args[1], args[2])
        elif name=='SARTURN':
            return self.SARTURN(args[0], args[1], args[2])
        elif name=='BACKSET':
            return self.BACKSET(args[0], args[1])
            # 三角函数
        elif name=='ATAN':
            return self.Trigonometric(args[0],Math.atan)
        elif name=='ACOS':
            return self.Trigonometric(args[0],Math.acos)
        elif name=='ASIN':
            return self.Trigonometric(args[0],Math.asin)
        elif name=='COS':
            return self.Trigonometric(args[0],Math.cos)
        elif name=='SIN':
            return self.Trigonometric(args[0],Math.sin)
        elif name=='TAN':
            return self.Trigonometric(args[0],Math.tan)
        elif name=='LN':
            return self.Trigonometric(args[0],Math.log)
        elif name=='LOG':
            return self.Trigonometric(args[0],Math.log10)
        elif name=='EXP':
            return self.Trigonometric(args[0],Math.exp)
        elif name=='SQRT':
            return self.Trigonometric(args[0],Math.sqrt)
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
class JSDraw():
    def __init__(self, errorHandler, symbolData) :
        self.ErrorHandler=errorHandler
        self.SymbolData=symbolData