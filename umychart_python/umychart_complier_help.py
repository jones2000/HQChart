#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com

import sys
import math

class JSComplierHelper:

    # 无效数值
    NoneNumber=float('nan')

    # 公共帮助方法
    @staticmethod
    def IsNumber(value):
        if not isinstance(value,(int,float)) :
            return False
        if (math.isnan(value)):
            return False
        return True

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
        if (not JSComplierHelper.IsNumber(value)):
            return False
        return value!=0

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
        if (not isinstance(value,(int,float))):
            return True
        if (math.isnan(value)) :
            return True
        return False

    @staticmethod
    def CreateArray(count, value=NoneNumber) :
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

    @staticmethod # result 数组长度由外部创建
    def CalculateZIGLine(firstData,secondData,thridData,data,result) :
        isUp=secondData.Up
        findData=firstData
        if (isUp) :
            for i in range(firstData.ID+1, thridData.ID) :  # 查找最高点
                subItem=data[i]
                if not JSComplierHelper.IsNumber(subItem) :
                    continue
                if findData.Value<subItem :
                    findData=Variant()
                    findData.ID=i
                    findData.Value=subItem
        else :
            for i in range(firstData.ID+1, thridData.ID) : #查找最低点
                subItem=data[i]
                if not JSComplierHelper.IsNumber(subItem) :
                    continue
                if findData.Value>subItem :
                    findData=Variant()
                    findData.ID=i
                    findData.Value=subItem
            
        secondData.Value=findData.Value
        secondData.ID=findData.ID

        lineCache=Variant()
        lineCache.Start, lineCache.End =Variant(), Variant()
        lineCache.Start.ID=firstData.ID
        lineCache.Start.Value=firstData.Value
        lineCache.End.ID=secondData.ID
        lineCache.End.Value=secondData.Value

        lineData=JSComplierHelper.CalculateDrawLine(lineCache) #计算2个点的线上 其他点的数值
        for lineItem in lineData :
            result[lineItem.ID]=lineItem.Value

        if thridData.ID==len(data)-1:   # 最后一组数据
            # 最后2个点的数据连成线
            lineCache=Variant()
            lineCache.Start, lineCache.End = Variant(), Variant()
            lineCache.Start.ID=secondData.ID
            lineCache.Start.Value=secondData.Value
            lineCache.End.ID=thridData.ID
            lineCache.End.Value=thridData.Value
            lineData=JSComplierHelper.CalculateDrawLine(lineCache) # 计算2个点的线上 其他点的数值
            for lineItem in lineData :
                result[lineItem.ID]=lineItem.Value
        else :
            firstData.ID=secondData.ID
            firstData.Value=secondData.Value

            secondData.ID=thridData.ID
            secondData.Value=thridData.Value
            secondData.Up=firstData.Value < secondData.Value


class Variant:
    def __init__(self) :
        pass
        