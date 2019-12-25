#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com

import pandas as pd
import numpy as np

class JSComplierPandasHelper :
    @staticmethod # 把指标结果数据转化为pandas格式的时间序列
    def ToDateTimeSeries(data) :
        result={}
        if data.Time :  # 分钟K线
            aryIndex=[]
            for i in range(len(data.Date)) :
                date=data.Date[i]
                time=data.Time[i]
                year, month, day = int(date/10000), int(date%10000/100),int(date%100)
                hour, minute= int(time/100), int(time%100)
                aryIndex.append(pd.Timestamp(year=year,month=month,day=day,hour=hour, minute=minute))
        else :          # 日线K线
            aryIndex=[]
            for item in data.Date :
                year, month, day = int(item/10000), int(item%10000/100),int(item%100)
                aryIndex.append(pd.Timestamp(year=year,month=month,day=day))

        for outItem in data.OutVar :
            indexName=outItem.Name
            if outItem.Type==0: # 暂时只输出线段的
                aryValue=[]
                for item in outItem.Data:
                    if item==None :
                        aryValue.append(np.NaN)
                    else :
                        aryValue.append(item)

                result[indexName]=pd.Series(aryValue, index=pd.to_datetime(aryIndex))
                print('[JSComplierPandasHelper::ToDateTimeSeries] name=' ,indexName)
                print(result[indexName])
        return result


    @staticmethod # 转化为DataFrame格式
    def ToDataFrame(data) :
        if data.Time :  # 分钟K线
            aryIndex=[]
            for i in range(len(data.Date)) :
                date=data.Date[i]
                time=data.Time[i]
                year, month, day = int(date/10000), int(date%10000/100),int(date%100)
                hour, minute= int(time/100), int(time%100)
                aryIndex.append(pd.Timestamp(year=year,month=month,day=day,hour=hour, minute=minute))
        else :          # 日线K线
            aryIndex=[]
            for item in data.Date :
                year, month, day = int(item/10000), int(item%10000/100),int(item%100)
                aryIndex.append(pd.Timestamp(year=year,month=month,day=day))

        df=pd.DataFrame(index=pd.to_datetime(aryIndex))

        for outItem in data.OutVar :
            indexName=outItem.Name
            if outItem.Type==0: # 暂时只输出线段的
                aryValue=[]
                for item in outItem.Data:
                    if item==None :
                        aryValue.append(np.NaN)
                    else :
                        aryValue.append(item)

                df[indexName]=aryValue

        print('[JSComplierPandasHelper::ToDateTimeSeries] dispaly data\n' ,df)
        return df


         