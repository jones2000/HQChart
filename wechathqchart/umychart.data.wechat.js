/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com
    
    行情数据结构 及计算方法
*/

import 
{
    JSCommonCoordinateData_MARKET_SUFFIX_NAME as MARKET_SUFFIX_NAME
} from "./umychart.coordinatedata.wechat.js";

function Guid() 
{
    function S4() 
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//历史K线数据
function HistoryData()
{
    this.Date;
    this.YClose;
    this.Open;
    this.Close;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.Time;  //分钟 HHMM / 秒HHMMSS
    this.FlowCapital = 0;   //流通股本
    this.Position = null;   //持仓量

    //指数才有的数据
    this.Stop;  //停牌家数
    this.Up;    //上涨
    this.Down;  //下跌
    this.Unchanged; //平盘
}

//数据复制
HistoryData.Copy=function(data)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose;
    newData.Open=data.Open;
    newData.Close=data.Close;
    newData.High=data.High;
    newData.Low=data.Low;
    newData.Vol=data.Vol;
    newData.Amount=data.Amount;
    newData.Time=data.Time;
    newData.FlowCapital = data.FlowCapital;
    newData.Position = data.Position;

    //指数才有的数据
    newData.Stop = data.Stop;
    newData.Up = data.Up;
    newData.Down = data.Down;
    newData.Unchanged = data.Unchanged;

    return newData;
}

//把数据 src 复制到 dest中
HistoryData.CopyTo = function (dest, src)
{
    dest.Date = src.Date;
    dest.YClose = src.YClose;
    dest.Open = src.Open;
    dest.Close = src.Close;
    dest.High = src.High;
    dest.Low = src.Low;
    dest.Vol = src.Vol;
    dest.Amount = src.Amount;
    dest.Time = src.Time;
    dest.FlowCapital = src.FlowCapital;

    dest.Stop = src.Stop;
    dest.Up = src.Up;
    dest.Down = src.Down;
    dest.Unchanged = src.Unchanged;
}

//数据复权拷贝
HistoryData.CopyRight=function(data,seed)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose*seed;
    newData.Open=data.Open*seed;
    newData.Close=data.Close*seed;
    newData.High=data.High*seed;
    newData.Low=data.Low*seed;

    newData.Vol=data.Vol;
    newData.Amount=data.Amount;

    newData.FlowCapital = data.FlowCapital;
    newData.Position = data.Position;

    return newData;
}

//分钟数据
function MinuteData()
{
    this.Close;
    this.Open;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.DateTime;
    this.Increase;
    this.Risefall;
    this.AvPrice;
    this.Date;
    this.Time;
    this.Position = null;  //持仓量
}

//单指标数据
function SingleData()
{
    this.Date;  //日期
    this.Value; //数据
}


function DataPlus() { };            //外部数据计算方法接口
DataPlus.GetMinutePeriodData = null;
/*
DataPlus.GetMinutePeriodData=function(period,data,self)
{

}
*/

//////////////////////////////////////////////////////////////////////
// 数据集合
function ChartData()
{
    this.Data=new Array();
    this.DataOffset=0;                        //数据偏移
    this.Period=0;                            //周期 0 日线 1 周线 2 月线 3年线
    this.Right=0;                             //复权 0 不复权 1 前复权 2 后复权
    this.Symbol;                              //股票代码

    this.Data2=new Array();                   //第1组数据 走势图:历史分钟数据

    this.GetCloseMA=function(dayCount)
    {
        var result=new Array();
        for (var i = 0, len = this.Data.length; i < len; i++)
        {
            if (i < dayCount)
            {
                result[i]=null;
                continue;
            }

            var sum = 0;
            for (var j = 0; j < dayCount; j++)
            {
                sum += this.Data[i - j].Close;
            }
            result[i]=sum / dayCount;
        }
        return result;
    }

    this.GetVolMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Vol;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    this.GetAmountMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Amount;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    //获取收盘价
    this.GetClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Close;
        }

        return result;
    }

    this.GetYClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].YClose;
        }

        return result;
    }

    this.GetHigh=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].High;
        }

        return result;
    }

    this.GetLow=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Low;
        }

        return result;
    }

    this.GetOpen=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Open;
        }

        return result;
    }

    this.GetVol=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Vol;
        }

        return result;
    }

    this.GetAmount=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Amount;
        }

        return result;
    }

    this.GetPosition = function () 
    {
        var result = new Array();
        for (var i in this.Data) 
        {
            result[i] = this.Data[i].Position;
        }

        return result;
    }

    this.GetDate = function () 
    {
        var result = [];
        for (var i in this.Data) 
        {
            result[i] = this.Data[i].Date;
        }

        return result;
    }

    this.GetTime = function () 
    {
        var result = [];
        for (var i in this.Data) 
        {
            result[i] = this.Data[i].Time;
        }

        return result;
    }

    this.GetUp = function ()   //上涨家数
    {
        var result = [];
        for (var i in this.Data) {
            result[i] = this.Data[i].Up;
        }

        return result;
    }

    this.GetDown = function () //下跌家数
    {
        var result = [];
        for (var i in this.Data) {
            result[i] = this.Data[i].Down;
        }

        return result;
    }

    this.GetYear=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date/10000);
        }

        return result;
    }

    this.GetMonth=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date%10000/100);
        }

        return result;
    }

    
    this.GetDateIndex = function (data) //日期转化 对应数据索引
    {
        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;

            if (j >= data.length) break;

            var dateItem = data[j];

            if (dateItem.Date == date) 
            {
                dateItem.Index = i;
                ++j;
            }
            else if (dateItem.Date < date) 
            {
                ++j;
            }
            else 
            {
                ++i;
            }
        }
    }

    
    this.GetDateTimeIndex = function (data) //日期 时间转化 对应数据索引
    {
        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;
            var time = this.Data[i].Time;

            if (j >= data.length) break;

            var dateTimeItem = data[j];

            if (dateTimeItem.Date == date && dateTimeItem.Time == time) 
            {
                dateTimeItem.Index = i;
                ++j;
            }
            else if (dateTimeItem.Date < date || (dateTimeItem.Date == date && dateTimeItem.Time < time)) 
            {
                ++j;
            }
            else 
            {
                ++i;
            }
        }
    }

    this.GetMinutePeriodData=function(period)
    {
        if (DataPlus.GetMinutePeriodData) return DataPlus.GetMinutePeriodData(period, this.Data, this);

        if (period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END) 
            return this.GetMinuteCustomPeriodData(period - CUSTOM_MINUTE_PERIOD_START);

        var result = [];
        var periodDataCount = 5;
        if (period == 5)
            periodDataCount = 5;
        else if (period == 6)
            periodDataCount = 15;
        else if (period == 7)
            periodDataCount = 30;
        else if (period == 8)
            periodDataCount = 60;
        else if (period == 11)
            periodDataCount = 120;
        else if (period == 12)
            periodDataCount = 240;
        else
            return this.Data;
        var bFirstPeriodData = false;
        var newData = null;
        var preTime = null;   //上一次的计算时间
        for (var i = 0; i < this.Data.length; )
        {
            bFirstPeriodData = true;
            for (var j = 0; j < periodDataCount && i < this.Data.length; ++i)
            {
                if (bFirstPeriodData)
                {
                    newData = new HistoryData();
                    result.push(newData);
                    bFirstPeriodData = false;
                }
                var minData = this.Data[i];
                if (minData == null)
                {
                    ++j;
                    continue;    
                } 
                if (minData.Time == 925 && (preTime == null || preTime != 924))  //9：25, 9:30 不连续就不算个数
                {
                }
                else if (minData.Time == 930 && (preTime == null || preTime != 929))
                {
                }
                else if (minData.Time == 1300 && (preTime == null || preTime != 1259)) //1点的数据 如果不是连续的 就不算个数
                {

                }
                else
                    ++j;
                newData.Date = minData.Date;
                newData.Time = minData.Time;
                preTime = newData.Time;
                if (minData.Open==null || minData.Close==null)
                    continue;
                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=minData.Open;
                    newData.High=minData.High;
                    newData.Low=minData.Low;
                    newData.YClose=minData.YClose;
                    newData.Close=minData.Close;
                    newData.Vol=minData.Vol;
                    newData.Amount=minData.Amount;   
                    newData.Position = minData.Position;   
                    newData.FlowCapital = minData.FlowCapital;  
                }
                else
                {
                    if (newData.High<minData.High) 
                        newData.High=minData.High;
                    if (newData.Low>minData.Low) 
                        newData.Low=minData.Low;
                    newData.Close=minData.Close;
                    newData.Vol+=minData.Vol;
                    newData.Amount+=minData.Amount;
                    newData.Position = minData.Position;
                    newData.FlowCapital = minData.FlowCapital;  
                }

                if (i + 1 < this.Data.length) //判断下一个数据是否是不同日期的
                {
                    var nextItem = this.Data[i + 1];
                    if (nextItem && nextItem.Date != minData.Date)    //不同日期的, 周期结束
                    {
                        ++i;
                        break;
                    }
                }
            }
        }
        return result;
    }

    //自定义分钟
    this.GetMinuteCustomPeriodData = function (count) 
    {
        var result = new Array();
        var periodDataCount = count;
        var bFirstPeriodData = false;
        var newData = null;
        for (var i = 0; i < this.Data.length;) 
        {
            bFirstPeriodData = true;
            for (var j = 0; j < periodDataCount && i < this.Data.length; ++i, ++j) 
            {
                if (bFirstPeriodData) 
                {
                    newData = new HistoryData();
                    result.push(newData);
                    bFirstPeriodData = false;
                }
                var minData = this.Data[i];
                if (minData == null) continue;

                newData.Date = minData.Date;
                newData.Time = minData.Time;
                if (minData.Open == null || minData.Close == null) continue;
                if (newData.Open == null || newData.Close == null) 
                {
                    newData.Open = minData.Open;
                    newData.High = minData.High;
                    newData.Low = minData.Low;
                    newData.YClose = minData.YClose;
                    newData.Close = minData.Close;
                    newData.Vol = minData.Vol;
                    newData.Amount = minData.Amount;
                    newData.FlowCapital = minData.FlowCapital;
                    newData.Position = minData.Position; 
                }
                else 
                {
                    if (newData.High < minData.High) newData.High = minData.High;
                    if (newData.Low > minData.Low) newData.Low = minData.Low;
                    newData.Close = minData.Close;
                    newData.Vol += minData.Vol;
                    newData.Amount += minData.Amount;
                    newData.FlowCapital = minData.FlowCapital;
                    newData.Position = minData.Position;
                }
            }
        }
        return result;
    }

    this.GetDayPeriodData=function(period)
    {
        if (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END)    //自定义周期
            return this.GetDayCustomPeriodData(period - CUSTOM_DAY_PERIOD_START);

        var isBit = MARKET_SUFFIX_NAME.IsBIT(this.Symbol);
        var result=[];
        var index=0;
        var startDate=0;
        var weekCount = 2;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];

            switch(period)
            {
                case 1: //周线
                    if (isBit) var fridayDate = ChartData.GetSunday(dayData.Date);
                    else var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 21: //双周
                    if (isBit) var fridayDate = ChartData.GetSunday(dayData.Date);
                    else var fridayDate = ChartData.GetFirday(dayData.Date);
                    if (fridayDate != startDate) 
                    {
                        ++weekCount;
                        if (weekCount >= 2) 
                        {
                            isNewData = true;
                            weekCount = 0;
                        }
                        startDate = fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 9: //季线
                    var now = ChartData.GetQuarter(dayData.Date);
                    now = parseInt(dayData.Date / 10000) * 10 + now;
                    var last = ChartData.GetQuarter(startDate);
                    last = parseInt(startDate / 10000) * 10 + last;
                    if (now != last) 
                    {
                        isNewData = true;
                        startDate = dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new HistoryData();
                newData.Date=dayData.Date;
                result.push(newData);

                if (dayData.Open==null || dayData.Close==null) continue;

                newData.Open=dayData.Open;
                newData.High=dayData.High;
                newData.Low=dayData.Low;
                newData.YClose=dayData.YClose;
                newData.Close=dayData.Close;
                newData.Vol=dayData.Vol;
                newData.Amount=dayData.Amount;
                newData.FlowCapital = dayData.FlowCapital;
                newData.Position = dayData.Position; 
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Open==null || dayData.Close==null) continue;

                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=dayData.Open;
                    newData.High=dayData.High;
                    newData.Low=dayData.Low;
                    newData.YClose=dayData.YClose;
                    newData.Close=dayData.Close;
                    newData.Vol=dayData.Vol;
                    newData.Amount=dayData.Amount;
                    newData.FlowCapital = dayData.FlowCapital;
                    newData.Position = dayData.Position; 
                }
                else
                {
                    if (newData.High<dayData.High) newData.High=dayData.High;
                    if (newData.Low>dayData.Low) newData.Low=dayData.Low;

                    newData.Close=dayData.Close;
                    newData.Vol+=dayData.Vol;
                    newData.Amount+=dayData.Amount;
                    newData.Date=dayData.Date;
                    newData.FlowCapital = dayData.FlowCapital;
                    newData.Position = dayData.Position;
                }
            }
        }

        return result;
    }

    this.GetDayCustomPeriodData = function (count)  //自定义日线周期
    {
        var result = [];
        var periodDataCount = count;
        var bFirstPeriodData = false;
        var newData = null;
        for (var i = 0; i < this.Data.length;) 
        {
            bFirstPeriodData = true;
            for (var j = 0; j < periodDataCount && i < this.Data.length; ++i, ++j) 
            {
                if (bFirstPeriodData) 
                {
                    newData = new HistoryData();
                    result.push(newData);
                    bFirstPeriodData = false;
                }
                var dayData = this.Data[i];
                if (dayData == null) continue;

                newData.Date = dayData.Date;

                if (dayData.Open == null || dayData.Close == null) continue;
                if (newData.Open == null || newData.Close == null) 
                {
                    newData.Open = dayData.Open;
                    newData.High = dayData.High;
                    newData.Low = dayData.Low;
                    newData.YClose = dayData.YClose;
                    newData.Close = dayData.Close;
                    newData.Vol = dayData.Vol;
                    newData.Amount = dayData.Amount;
                    newData.FlowCapital = dayData.FlowCapital;
                    newData.Position = dayData.Position;  
                }
                else 
                {
                    if (newData.High < dayData.High) newData.High = dayData.High;
                    if (newData.Low > dayData.Low) newData.Low = dayData.Low;
                    newData.Close = dayData.Close;
                    newData.Vol += dayData.Vol;
                    newData.Amount += dayData.Amount;
                    newData.Position = dayData.Position;
                    newData.FlowCapital = dayData.FlowCapital;
                }
            }
        }
        return result;
    }

    //周期数据 1=周 2=月 3=年 9=季 
    this.GetPeriodData=function(period)
    {
        if (period == 1 || period == 2 || period == 3 || period == 9 || period == 21 || (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END)) return this.GetDayPeriodData(period);
        if (period == 5 || period == 6 || period == 7 || period == 8 || period == 11 || period == 12 ||(period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END)) return this.GetMinutePeriodData(period);
    }

    //复权  0 不复权 1 前复权 2 后复权
    this.GetRightDate=function(right)
    {
        var result=[];
        if (this.Data.length<=0) return result;

        if (right==1)
        {
            var index=this.Data.length-1;
            var seed=1; //复权系数
            var yClose=this.Data[index].YClose;

            result[index]=HistoryData.Copy(this.Data[index]);

            for(--index; index>=0; --index)
            {
                if (yClose!=this.Data[index].Close) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                yClose=this.Data[index].YClose;
            }

            for(; index>=0; --index)
            {
                if(yClose!=this.Data[index].Close)
                    seed *= yClose/this.Data[index].Close;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                yClose=this.Data[index].YClose;
            }
        }
        else if (right==2)
        {
            var index=0;
            var seed=1;
            var close=this.Data[index].Close;
            result[index]=HistoryData.Copy(this.Data[index]);

            for(++index;index<this.Data.length;++index)
            {
                if (close!=this.Data[index].YClose) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                close=this.Data[index].Close;
            }

            for(;index<this.Data.length;++index)
            {
                if(close!=this.Data[index].YClose)
                    seed *= close/this.Data[index].YClose;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                close=this.Data[index].Close;
            }
        }

        return result;
    }

    //叠加数据和主数据拟合,去掉主数据没有日期的数据
    this.GetOverlayData=function(overlayData)
    {
        var result=[];

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                result[i]=new HistoryData();
                result[i].Date=overlayData[j].Date;
                result[i].YClose=overlayData[j].YClose;
                result[i].Open=overlayData[j].Open;
                result[i].High=overlayData[j].High;
                result[i].Low=overlayData[j].Low;
                result[i].Close=overlayData[j].Close;
                result[i].Vol=overlayData[j].Vol;
                result[i].Amount=overlayData[j].Amount;

                //涨跌家数数据
                result[i].Stop = overlayData[j].Stop;
                result[i].Up = overlayData[j].Up;
                result[i].Down = overlayData[j].Down;
                result[i].Unchanged = overlayData[j].Unchanged;

                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }


    /*
        技术指标数据方法
    */
    //以主图数据 拟合,返回 SingleData 数组
    this.GetFittingData=function(overlayData)
    {
        var result=new Array();

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=null;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                var item=new SingleData();
                item.Date=overlayData[j].Date;
                item.Value=overlayData[j].Value;
                result[i]=item;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new SingleData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }

    // 缺省数据使用 emptyValue填充
    this.GetFittingData2 = function (overlayData, emptyValue) 
    {
        var result = new Array();

        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;

            if (j >= overlayData.length) 
            {
                result[i] = new SingleData();
                result[i].Date = date;
                result[i].Value = emptyValue;
                ++i;
                continue;;
            }

            var overlayDate = overlayData[j].Date;

            if (overlayDate == date) 
            {
                var item = new SingleData();
                item.Date = overlayData[j].Date;
                item.Value = overlayData[j].Value;
                result[i] = item;
                ++j;
                ++i;
            }
            else if (overlayDate < date) 
            {
                ++j;
            }
            else 
            {
                result[i] = new SingleData();
                result[i].Date = date;
                result[i].Value = emptyValue;
                ++i;
            }
        }

        return result;
    }

    
    this.GetMinuteFittingData = function (overlayData) //  分钟数据拟合
    {
        var result = [];
        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;
            var time = this.Data[i].Time;

            if (j >= overlayData.length) 
            {
                result[i] = null;
                ++i;
                continue;;
            }

            var overlayDate = overlayData[j].Date;
            var overlayTime = overlayData[j].Time;
            const overlayItem = overlayData[j];

            if (overlayDate == date && overlayTime == time) 
            {
                var item = new SingleData();
                item.Date = overlayItem.Date;
                item.Time = overlayItem.Time;
                item.Value = overlayItem.Value;
                result[i] = item;
                ++j;
                ++i;
            }
            else if (overlayDate < date || (overlayDate == date && overlayTime < time))
            {
                ++j;
            }
            else 
            {
                var item = new SingleData();
                item.Date = date;
                item.Time = time;
                result[i] = item;
                ++i;
            }
        }

        return result;
    }

    //把财报数据拟合到主图数据,返回 SingleData 数组
    this.GetFittingFinanceData = function (financeData)
    {
        var result = [];

        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;

            if (j + 1 < financeData.length) 
            {
                if (financeData[j].Date < date && financeData[j + 1].Date <= date) 
                {
                    ++j;
                    continue;
                }
            }

            var item = new SingleData();
            item.Date = date;
            item.Value = financeData[j].Value;
            item.FinanceDate = financeData[j].Date;   //财务日期 调试用
            result[i] = item;

            ++i;
        }

        return result;
    }

    //市值计算 financeData.Value 是股数
    this.GetFittingMarketValueData = function (financeData) 
    {
        var result = [];

        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;
            var price = this.Data[i].Close;

            if (j + 1 < financeData.length) 
            {
                if (financeData[j].Date < date && financeData[j + 1].Date <= date) 
                {
                    ++j;
                    continue;
                }
            }

            var item = new SingleData();
            item.Date = date;
            item.Value = financeData[j].Value * price;  //市值计算 收盘价*股数
            item.FinanceDate = financeData[j].Date;   //财务日期 调试用
            result[i] = item;

            ++i;
        }

        return result;
    }

    //月线数据拟合
    this.GetFittingMonthData = function (overlayData) {
      var result = new Array();

      var preDate = null;
      for (var i = 0, j = 0; i < this.Data.length;) {
        var date = this.Data[i].Date;

        if (j >= overlayData.length) {
          result[i] = null;
          ++i;
          continue;;
        }

        var overlayDate = overlayData[j].Date;

        if (overlayDate == date) {
          var item = new SingleData();
          item.Date = overlayData[j].Date;
          item.Value = overlayData[j].Value;
          item.Text = overlayData[j].Text;
          result[i] = item;
          ++j;
          ++i;
        }
        else if (preDate != null && preDate < overlayDate && date > overlayDate) {
          var item = new SingleData();
          item.Date = date;
          item.OverlayDate = overlayData[j].Date;
          item.Value = overlayData[j].Value;
          item.Text = overlayData[j].Text;
          result[i] = item;
          ++j;
          ++i;
        }
        else if (overlayDate < date) {
          ++j;
        }
        else {
          result[i] = new SingleData();
          result[i].Date = date;
          ++i;
        }

        preDate = date;
      }

      return result;
    }


    this.GetValue=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
          if (this.Data[i]==null || this.Data[i].Value == null)
          {
            result[i] = null;
          }
          else
          {
            // console.log(this.Data[i].Value);
            // console.log(i);
            if (!isNaN(this.Data[i].Value))
              result[i] = this.Data[i].Value;
            else if (this.Data[i].Value instanceof Array)   //支持数组
              result[i] = this.Data[i].Value;
            else
              result[i] = null;
          }
        }

        return result;
    }

    this.GetPeriodSingleData=function(period)
    {
        var result=new Array();
        var index=0;
        var startDate=0;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];
            if (dayData==null || dayData.Date==null) continue;

            switch(period)
            {
                case 1: //周线
                    var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new SingleData();
                newData.Date=dayData.Date;
                newData.Value=dayData.Value;
                result.push(newData);
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Value==null || isNaN(dayData.Value)) continue;
                if (newData.Value==null || isNaN(newData.Value)) newData.Value=dayData.Value;
            }
        }

        return result;
    }

    /*
        分钟数据方法
        this.GetClose()     每分钟价格
        this.GetVol()       每分钟成交量
    */

    //分钟均线
    this.GetMinuteAvPrice=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].AvPrice;
        }

        return result;
    }

    this.MergeMinuteData = function (data) //合并数据
    {
        var sourceFirstItem = this.Data[0];
        var firstItemID = 0;
        var firstItem = null;
        for (var i = 0; i < data.length; ++i)  //查找比原始数据起始位置大的数据位置
        {
            var item = data[i];
            if (item.Date >sourceFirstItem.Date)
            {
                firstItemID = i;
                firstItem = item;
                break;
            }

            if (item.Date == sourceFirstItem.Date && item.Time >= sourceFirstItem.Time) 
            {
                firstItemID = i;
                firstItem = item;
                break;
            }
        }
        if (firstItem == null) return false;

        var index = null;
        var bFind = false;    //第1个数据是否完全匹配
        for (var i = this.Data.length - 1; i >= 0; --i)
         {
            var date = this.Data[i].Date;
            var time = this.Data[i].Time;

            if (firstItem.Date > date || (firstItem.Date == date && firstItem.Time >= time) ) 
            {
                index = i;
                if (firstItem.Date == date && firstItem.Time == time) bFind = true;
                break;
            }
        }

        if (index == null) return false;
        var j = index;
        var i = firstItemID;
        if (bFind == true)    //第1个数据匹配,覆盖
        {
            var item = data[i];
            if (j - 1 > 0 && !item.YClose) item.YClose = this.Data[j - 1].Close;   //前收盘如果没有就是上一记录的收盘
            var newItem = HistoryData.Copy(item);
            this.Data[j] = newItem;
            ++j;
            ++i;
        }
        else
        {
            ++j;
        }

        for (; i < data.length;) 
        {
            var item = data[i];
            if (j >= this.Data.length - 1) 
            {
                if (j - 1 > 0 && !item.YClose) item.YClose = this.Data[j - 1].YClose;   //前收盘如果没有就是上一记录的收盘
                var newItem = HistoryData.Copy(item);
                this.Data[j] = newItem;
                ++j;
                ++i;
            }
            else 
            {
                var oldItem = this.Data[j];
                if (oldItem.Date == item.Date && oldItem.Time == item.Time) //更新数据
                {
                    HistoryData.CopyTo(oldItem, item);
                    ++j;
                    ++i;
                }
                else 
                {
                    ++j;
                }
            }
        }

        //console.log('[ChartData::MergeMinuteData] ', this.Data, data);
        return true;
    }
}

ChartData.GetFirday=function(value)
{
    var date=new Date(parseInt(value/10000),(value/100%100-1),value%100);
    var day=date.getDay();
    if (day==5) return value;

    var timestamp=date.getTime();
    if (day<5)
    {
        var prevTimestamp=(24*60*60*1000)*(5-day);
        timestamp+=prevTimestamp;
    }
    else
    {
        var prevTimestamp=(24*60*60*1000)*(day-5);
        timestamp-=prevTimestamp;
    }

    date.setTime(timestamp);
    var fridayDate= date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
    var week=date.getDay();
    return fridayDate;
}

ChartData.GetSunday = function (value) 
{
    var date = new Date(parseInt(value / 10000), (value / 100 % 100 - 1), value % 100);
    var day = date.getDay();
    if (day == 0) return value;

    var timestamp = date.getTime();
    if (day > 0) 
    {
        var prevTimestamp = (24 * 60 * 60 * 1000) * (7 - day);
        timestamp += prevTimestamp;
    }

    date.setTime(timestamp);
    var sundayDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    var week = date.getDay();
    return sundayDate;
}

ChartData.GetQuarter = function (value) 
{
    var month = parseInt(value % 10000 / 100);
    if (month == 1 || month == 2 || month == 3) return 1;
    else if (month == 4 || month == 5 || month == 6) return 2;
    else if (month == 7 || month == 8 || month == 9) return 3;
    else if (month == 10 || month == 11 || month == 12) return 4;
    else return 0;
}

//是否是日线周期  0=日线 1=周线 2=月线 3=年线 9=季线 21=双周 [40001-50000) 自定义日线 (isIncludeBase 是否包含基础日线周期)
var CUSTOM_DAY_PERIOD_START = 40000, CUSTOM_DAY_PERIOD_END = 49999;
ChartData.IsDayPeriod = function (period, isIncludeBase) 
{
    if (period == 1 || period == 2 || period == 3 || period == 9 || period==21 ) return true;
    if (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END) return true;
    if (period == 0 && isIncludeBase == true) return true;

    return false;
}

//是否是分钟周期 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 11=2h 12=4h[20001-30000) 自定义分钟 (isIncludeBase 是否包含基础1分钟周期)
var CUSTOM_MINUTE_PERIOD_START = 20000, CUSTOM_MINUTE_PERIOD_END = 29999;
ChartData.IsMinutePeriod = function (period, isIncludeBase) 
{
    if (period == 5 || period == 6 || period == 7 || period == 8 || period == 11 || period == 12) return true;
    if (period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END) return true;
    if (period == 4 && isIncludeBase == true) return true;

    return false;
}

//是否是秒周期 [30001-32000)
var CUSTOM_SECOND_PERIOD_START = 30000, CUSTOM_SECOND_PERIOD_END = 32000;
ChartData.IsSecondPeriod = function (period) 
{
    if (period > CUSTOM_SECOND_PERIOD_START && period <= CUSTOM_SECOND_PERIOD_END) return true;
    return false;
}


//是否是分笔图
ChartData.IsTickPeriod = function (period) 
{
    return period == 10;
}

//获取周期名字
ChartData.GetPeriodName = function (period) 
{
    var mapName = new Map(
        [
            [0, '日线'], [1, '周线'], [2, '月线'], [3, '年线'], [9, '季线'], [21, '双周'],
            [4, '1分'], [5, '5分'], [6, '15分'], [7, '30分'], [8, '60分'], [11, '2小时'], [12, '4小时'],
            [10, '分笔']
        ]);

    if (mapName.has(period)) return mapName.get(period);

    return '';
}

function Rect(x, y, width, height) 
{
    this.Left = x,
    this.Top = y;
    this.Right = x + width;
    this.Bottom = y + height;

    this.IsPointIn = function (x, y) 
    {
        if (x >= this.Left && x <= this.Right && y >= this.Top && y <= this.Bottom) return true;
        return false;
    }
}

//修正线段有毛刺
function ToFixedPoint(value) 
{
    //return value;
    return parseInt(value) + 0.5;
}

function ToFixedRect(value) 
{
    var rounded;
    return rounded = (0.5 + value) << 0;
}


//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonData:
    {
        HistoryData: HistoryData,
        ChartData: ChartData,
        SingleData: SingleData,
        MinuteData: MinuteData,
        Rect: Rect,
        DataPlus: DataPlus,
    },

    //单个类导出
    JSCommon_ChartData: ChartData,
    JSCommon_HistoryData: HistoryData,
    JSCommon_SingleData: SingleData,
    JSCommon_MinuteData: MinuteData,
    JSCommon_CUSTOM_DAY_PERIOD_START: CUSTOM_DAY_PERIOD_START,
    JSCommon_CUSTOM_DAY_PERIOD_END: CUSTOM_DAY_PERIOD_END,
    JSCommon_CUSTOM_MINUTE_PERIOD_START: CUSTOM_MINUTE_PERIOD_START,
    JSCommon_CUSTOM_MINUTE_PERIOD_END: CUSTOM_MINUTE_PERIOD_END,
    JSCommon_CUSTOM_SECOND_PERIOD_START: CUSTOM_SECOND_PERIOD_START,
    JSCommon_CUSTOM_SECOND_PERIOD_END: CUSTOM_SECOND_PERIOD_END,
    JSCommon_Rect: Rect,
    JSCommon_DataPlus: DataPlus,
    JSCommon_Guid: Guid,
    JSCommon_ToFixedPoint: ToFixedPoint,
    JSCommon_ToFixedRect: ToFixedRect,
};