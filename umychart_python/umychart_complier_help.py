import sys

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

    @staticmethod
    def IsNaN(value) :
        return value!=None

    @staticmethod
    def CreateArray(count, value=None) :
        if count<=0 :
            return []
        else :
            return [value]*count