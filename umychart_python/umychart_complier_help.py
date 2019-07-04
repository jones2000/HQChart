import sys
import math

class JSComplierHelper:

    # 公共帮助方法
    @staticmethod
    def IsNumber(value):
        return isinstance(value,(int,float))

    @staticmethod
    def IsJsonNumber(jsData,name):
        if name not in jsData.keys() :
            return False
        return JSComplierHelper.IsNumber(jsData[name])

    @staticmethod   # 是否存在字段
    def IsJsonExist(jsData,name) :
        if name in jsData.keys() :
            return True
        return False


    @staticmethod
    def IsDivideNumber(value):
        return isinstance(value,(int,float)) and value!=0

    @staticmethod
    def IsJsonDivideNumber(jsData,name):
        if name not in jsData.keys() :
            return False
        return JSComplierHelper.IsNumber(jsData[name]) and jsData[name]!=0

    @staticmethod
    def IsArray(value) :
        return isinstance(value,list)

    @staticmethod   # 是否是一个有效素组 data!=null and data.length>0
    def IsVaildArray(data) :
        if not data :
            return False
        if not isinstance(data,list):
            return False
        if len(data)<=0 :
            return False
        return True

    # The usual way to test for a NaN is to see if it's equal to itself:
    # For people stuck with python <= 2.5. Nan != Nan did not work reliably. Used numpy instead." Having said that, I've not actually ever seen it fail
    @staticmethod
    def IsNaN(value) :
        return not isinstance(value,(int,float))

    @staticmethod
    def CreateArray(count, value=None) :
        if count<=0 :
            return []
        else :
            return [value]*count

    @staticmethod # 计算2个点之间线段
    def CalculateDrawLine(lineCache) :
        lineCache.List=[]
        for i in range(lineCache.Start.ID, lineCache.End.ID+1) :
            lineCache.List.append(i)

        height=abs(lineCache.Start.Value-lineCache.End.Value)  # 高端起始点和结束点的数值的差
        width=len(lineCache.List)-1

        result=[]
        item=Variant()
        item.ID, item.Value = lineCache.Start.ID, lineCache.Start.Value
        result.append(item)  # 第1个点

        if (lineCache.Start.Value>lineCache.End.Value) :
            for i in range(1, len(lineCache.List)-1) :
                value=height*(len(lineCache.List)-1-i)/width+lineCache.End.Value
                item=Variant()
                item.ID, item.Value = lineCache.List[i], value
                result.append(item)
        else :
            for i in range(1, len(lineCache.List)-1) :
                value=height*i/width+lineCache.Start.Value
                item=Variant()
                item.ID, item.Value = lineCache.List[i], value
                result.append(item)

        item=Variant()
        item.ID, item.Value = lineCache.End.ID, lineCache.End.Value
        result.append(item)      # 最后一个点

        return result


class Variant:
    def __init__(self) :
        pass
        