/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com
    
    行情数据结构 及计算方法
*/

import { MARKET_SUFFIX_NAME } from "./umychart.coordinatedata.wechat.js";

function Guid() 
{
    function S4() 
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function IsPlusNumber(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;
    return value>0;
}

function IsNumber(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//深拷贝
function CloneData(data)
{
    if (!data) return null;

    var strData=JSON.stringify(data);
    var item= JSON.parse(strData);
    
    return item;
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

    this.ExtendData;    //扩展数据

    this.BFactor;   //前复权
    this.AFactor;   //后复权

    this.ColorData; //自定义颜色 {Type:0=空心 1=实心, Line:{ Color:'上下线颜色'}, Border:{Color:柱子边框颜色}, BarColor:柱子颜色};
}

//数据复制
HistoryData.Copy=function(data)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    if (IsNumber(data.Time)) newData.Time=data.Time;
    newData.YClose=data.YClose;
    newData.Open=data.Open;
    newData.Close=data.Close;
    newData.High=data.High;
    newData.Low=data.Low;
    newData.Vol=data.Vol;
    newData.Amount=data.Amount;
    
    if (IsPlusNumber(data.FlowCapital)) newData.FlowCapital = data.FlowCapital;
    if (IsPlusNumber(data.Position)) newData.Position = data.Position;

    //指数才有的数据
    if (IsPlusNumber(data.Stop)) newData.Stop = data.Stop;
    if (IsPlusNumber(data.Up)) newData.Up = data.Up;
    if (IsPlusNumber(data.Down)) newData.Down = data.Down;
    if (IsPlusNumber(data.Unchanged)) newData.Unchanged = data.Unchanged;

    //复权因子
    if (IsPlusNumber(data.BFactor)) newData.BFactor = data.BFactor;
    if (IsPlusNumber(data.AFactor)) newData.AFactor = data.AFactor;

    if (data.ColorData) newData.ColorData=data.ColorData;
    if (data.ExtendData) newData.ExtendData=data.ExtendData;

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
    if (IsPlusNumber(src.Time))  dest.Time = src.Time;
    if (IsPlusNumber(src.FlowCapital)) dest.FlowCapital = src.FlowCapital;

    //指数才有的数据
    if (IsPlusNumber(src.Stop)) dest.Stop = src.Stop;
    if (IsPlusNumber(src.Up)) dest.Up = src.Up;
    if (IsPlusNumber(src.Down)) dest.Down = src.Down;
    if (IsPlusNumber(src.Unchanged)) dest.Unchanged = src.Unchanged;

    //复权因子
    if (IsPlusNumber(src.BFactor)) dest.BFactor = src.BFactor;
    if (IsPlusNumber(src.AFactor)) dest.AFactor = src.AFactor;

    if (src.ColorData) dest.ColorData=src.ColorData;
    if (src.ExtendData) dest.ExtendData=src.ExtendData;
}

//数据复权拷贝
HistoryData.CopyRight=function(data,seed)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    if (IsNumber(data.Time)) newData.Time=data.Time;

    newData.YClose=data.YClose*seed;
    newData.Open=data.Open*seed;
    newData.Close=data.Close*seed;
    newData.High=data.High*seed;
    newData.Low=data.Low*seed;

    newData.Vol=data.Vol;
    newData.Amount=data.Amount;

    newData.FlowCapital = data.FlowCapital;
    newData.Position = data.Position;
    
    if (data.ColorData) newData.ColorData=data.ColorData;       //K线颜色
    if (data.ExtendData) newData.ExtendData=data.ExtendData;    //扩张数据

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
    this.YClearing;         //昨结算价
    this.YClose;            //昨收

    this.ExtendData;    //扩展数据
}

//单指标数据
function SingleData()
{
    this.Date;  //日期
    this.Value; //数据
}

 //外部数据计算方法接口
function DataPlus() 
{ 
    this.PeriodCallback=new Map();  //key=周期id value={ Period, Callback(period,data,self): }

    this.GetPeriodCallback=function(period)
    {
        if (!this.PeriodCallback.has(period)) return null;
        
        return this.PeriodCallback.get(period);
    }

    this.AddPeriodCallback=function(obj)
    {
        if (!IFrameSplitOperator.IsNumber(obj.Period) || !obj.Callback) return;

        var item={ Period:obj.Period, Callback:obj.Callback };
        this.PeriodCallback.set(obj.Period, item);
    }

    this.RemovePeriodCallback=function(obj)
    {
        if (!this.PeriodCallback.has(obj.ID)) return;
        this.PeriodCallback.delete(obj.ID);
    }
};           

var g_DataPlus=new DataPlus();

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

    this.GetVol=function(unit)
    {
        var value=1;
        if (ChartData.IsNumber(unit)) value=unit;
        var result=[];
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Vol/value;
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

    //分时图均价
    this.GetAvPrice=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            var value=this.Data[i].AvPrice;
            if (ChartData.IsNumber(value))
                result[i]=value;
            else 
                result[i]=0;
        }

        return result;
    }

    this.GetSettlementPrice=function()  //结算价
    {
        var result=[]
        for(var i=0; i<this.Data.length; ++i)
        {
            result[i]=this.Data[i].FClose;
        }

        return result;
    }

    this.GetIsEqual=function()
    {
        var result=[];
        for(var i=0; i<this.Data.length; ++i)
        {
            var item=this.Data[i];
            result[i]=(item.Close==item.Open? 1:0);
        }

        return result;
    }

    this.GetIsUp=function()
    {
        var result=[];
        for(var i=0; i<this.Data.length; ++i)
        {
            var item=this.Data[i];
            result[i]=(item.Close>item.Open? 1:0);
        }

        return result;
    }

    this.GetIsDown=function()
    {
        var result=[];
        for(var i=0; i<this.Data.length; ++i)
        {
            var item=this.Data[i];
            result[i]=(item.Close<item.Open? 1:0);
        }

        return result;
    }

    //获取数据日期和时间范围
    this.GetDateRange=function()
    {
        if (!this.Data || this.Data.length<=0) return null;

        var start=this.Data[0];
        var end=this.Data[this.Data.length-1];
        var range={ Start:{Date:start.Date}, End:{Date:end.Date} };
        if (ChartData.IsNumber(start.Time)) range.Start.Time=start.Time;
        if (ChartData.IsNumber(end.Time)) range.End.Time=end.Time;

        return range;
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
        //外部自定义周期计算函数
        var itemCallback=g_DataPlus.GetPeriodCallback(period);
        if (itemCallback) return itemCallback.Callback(period,this.Data,this);

        //if (period == 1 || period == 2 || period == 3 || period == 9 || period == 21 || (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END)) 
        if (ChartData.IsDayPeriod(period,false))
            return this.GetDayPeriodData(period);

        //if (period == 5 || period == 6 || period == 7 || period == 8 || period == 11 || period == 12 ||(period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END)) 
        if (ChartData.IsMinutePeriod(period,false))    
            return this.GetMinutePeriodData(period);
    }

    //复权  0 不复权 1 前复权 2 后复权 option={ AlgorithmType:1 复权系数模式 }
    this.GetRightData=function(right, option)
    {
        var result=[];
        if (this.Data.length<=0) return result;

        if (option && option.AlgorithmType==1)  //使用复权因子计算
        {
            for(var i=0;i<this.Data.length;++i)
            {
                var item=this.Data[i];
                var seed=(right==1?item.BFactor:item.AFactor);
                result[i]=HistoryData.CopyRight(item,seed);
            }

            return result;
        }

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

    this.GetRightDate=this.GetRightData;

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

            if (j<financeData.length)
            {
                var fDate=financeData[j].Date;
                if (date<fDate)
                {
                    ++i;
                    continue;
                }
            }

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

    //财务数据拟合到分钟数据上 返回 SingleData 数组
    this.GetMinuteFittingFinanceData=function(financeData)
    {
        var result=[];
        if (!Array.isArray(financeData) || financeData.length<=0) return result;

        var i=0;
        var firstItem=financeData[0];
        for(i=0;i<this.Data.length;++i)
        {
            var date=this.Data[i].Date;
            var time=this.Data[i].Time;
            if (date>firstItem.Date || (date==firstItem.Date && time>=firstItem.Time))
            {
                break;
            }    
        }

        for(var j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;
            var time=this.Data[i].Time;

            if (j+1<financeData.length)
            {
                if ((financeData[j].Date<date && financeData[j+1].Date<=date) ||
                    (financeData[j].Date==date && financeData[j].Time<time && financeData[j+1].Time<=time) )
                {
                    ++j;
                    continue;
                }
            }

            var item=new SingleData();
            item.Date=date;
            item.Time=time;
            if (j<financeData.length)
            {
                item.Value=financeData[j].Value;
                item.FinanceDate=financeData[j].Date;   //财务日期 调试用
                item.FinanceTime=financeData[j].Time;   //财务日期 调试用
            }
            else
            {
                item.Value=null;
                item.FinanceDate=null;
                item.FinanceTime=null;
            }
            result[i]=item;

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

    this.GetObject=function()
    {
        var result=[];
        for(var i in this.Data)
        {
            if (this.Data[i] && this.Data[i].Value)
            { 
                var item=this.Data[i].Value;
                result[i]=item;
            }
            else
                result[i]=null;
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
        if (!this.Data || this.Data.length<=0)
        {
            this.Data=data;
            return true;
        }
        
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

    //拟合其他K线数据指标   
    this.FitKLineIndex=function(kLineData, outVar, peirod, indexPeriod)
    {
        var count=this.Data.length;         //原始K线数据
        var indexCount=kLineData.length;    //拟合K线数据
        var isMinutePeriod=[ChartData.IsMinutePeriod(peirod,true), ChartData.IsMinutePeriod(indexPeriod,true) ]; //0=原始K线 1=需要拟合的K线
        var isDayPeriod=[ChartData.IsDayPeriod(peirod,true), ChartData.IsDayPeriod(indexPeriod,true)  ];   //0=原始K线 1=需要拟合的K线
        var firstItem=ChartData.GetKLineDataTime(this.Data[0]);

        //计算拟合以后的数据索引
        var aryFixDataID=[];
        var indexStart=indexCount;
        for(var i=0;i<indexCount;++i)
        {
            var item=ChartData.GetKLineDataTime(kLineData[i]);

            if ( (isDayPeriod[0] && isDayPeriod[1]) || (isMinutePeriod[0] && isDayPeriod[1]) )   //日线(拟合) => 日线(原始)    日线(拟合 => 分钟(原始)
            {
                if (item.Date>=firstItem.Date)
                {
                    indexStart = i;
                    break;
                }
            }
            else if (isMinutePeriod[0] && isMinutePeriod[1]) //分钟(拟合 => 分钟(原始)
            {
                if (item.Date>firstItem.Date)
                {
                    indexStart = i;
                    break;
                }

                if (item.Date == firstItem.Date && item.Time >= firstItem.Time )
                {
                    indexStart = i;
                    break;
                }
            }
        }

        for(var i=0, j=indexStart; i<count; )
        {
            var item=ChartData.GetKLineDataTime(this.Data[i]);
            if (j>=indexCount)
            {
                var fitItem={ Date:item.Date, Time:item.Time, Index:-1 };
                aryFixDataID[i]=fitItem;
                ++i;
                continue;
            }

            var destItem=ChartData.GetKLineDataTime(kLineData[j]);
            if ( (isDayPeriod[0] && isDayPeriod[1]) || (isMinutePeriod[0] && isDayPeriod[1]) )  //日线(拟合) => 日线(原始)    日线(拟合 => 分钟(原始)
            {
                if (destItem.Date == item.Date)
                {
                    var fitItem={ Date:item.Date, Time:item.Time, Index:j, Data2:destItem.Date, Time2:destItem.Time };
                    aryFixDataID[i]=fitItem;
                    ++i;
                }
                else 
                {
                    if (j+1<indexCount)
                    {
                        var nextDestItem=ChartData.GetKLineDataTime(kLineData[j+1]);
                        if ( destItem.Date<=item.Date && nextDestItem.Date>item.Date )
                        {
                            var fitItem={ Date:item.Date, Time:item.Time, Index:j+1, Data2:nextDestItem.Date, Time2:nextDestItem.Time };
                            aryFixDataID[i]=fitItem;
                            ++i;
                        }
                        else if (nextDestItem.Date <= item.Date )
                        {
                            ++j;
                        }
                        else
                        {
                            var fitItem={ Date:item.Date, Time:item.Time, Index:-1 };
                            aryFixDataID[i]=fitItem;
                            ++i;
                        }
                    }
                    else
                    {
                        ++j;
                    }
                }
            }
            else if (isMinutePeriod[0] && isMinutePeriod[1])    //分钟(拟合 => 分钟(原始)
            {
                if (destItem.Date == item.Date && destItem.Time == item.Time)
                {
                    var fitItem={ Date:item.Date, Time:item.Time, Index:j, Data2:destItem.Date, Time2:destItem.Time };
                    aryFixDataID[i]=fitItem;
                    ++i;
                }
                else
                {
                    if (j+1<indexCount)
                    {
                        var nextDestItem=ChartData.GetKLineDataTime(kLineData[j+1]);
                        if ( (destItem.Date<item.Date && nextDestItem.Date>item.Date) || 
                            (destItem.Date == item.Date && destItem.Time < item.Time && nextDestItem.Date == item.Date && nextDestItem.Time > item.Time) ||
                            (destItem.Date == item.Date && destItem.Time < item.Time && nextDestItem.Date > item.Date) ||
                            (destItem.Date < item.Date && nextDestItem.Date == item.Date && nextDestItem.Time > item.Time) )
                        {
                            var fitItem={ Date:item.Date, Time:item.Time, Index:j+1, Data2:nextDestItem.Date, Time2:nextDestItem.Time };
                            aryFixDataID[i]=fitItem;
                            ++i;
                        }
                        else if (nextDestItem.Date < item.Date || (nextDestItem.Date == item.Date && nextDestItem.Time <= item.Time) )
                        {
                            ++j;
                        }
                        else
                        {
                            var fitItem={ Date:item.Date, Time:item.Time, Index:-1 };
                            aryFixDataID[i]=fitItem;
                            ++i;
                        }
                    }
                    else
                    {
                        ++j;
                    }
                }
            }
        }

        //拟合数据
        var result=[];
        for(var i in outVar)
        {
            var item=outVar[i];
            if (Array.isArray(item.Data)) 
            {
                var data=[];
                result[i]={ Data:data, Name:item.Name } ;
                for(var j=0;j<aryFixDataID.length;++j)
                {
                    var dataItem=aryFixDataID[j];
                    data[j]=null;
                    if ( dataItem && dataItem.Index>=0 && dataItem.Index<item.Data.length )
                        data[j]=item.Data[dataItem.Index];
                }
            }
            else 
            {
                result[i]={ Data:item.Data, Name:item.Name} ;
            }
        }

        return result;
    }

    //日线拟合交易数据, 不做平滑处理
    this.GetFittingTradeData=function(tradeData, nullValue, bExactMatch)
    {
        var result=[];
        var bMatch=false;
        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;
            if (j<tradeData.length)
            {
                if (tradeData[j].Date>date)
                {
                    var item=new SingleData();
                    item.Date=date;
                    item.Value=nullValue;
                    result[i]=item;
                    ++i;
                    continue;
                }
            }

            if (j+1<tradeData.length)
            {
                if (tradeData[j].Date<date && tradeData[j+1].Date<=date)
                {
                    ++j;
                    bMatch=false;
                    continue;
                }
            }

            var item=new SingleData();
            item.Date=date;
            item.Value=nullValue;
            item.FinanceDate=null;
            if (j<tradeData.length)
            {
                var tradeItem=tradeData[j];
                if (this.Period==0 && bExactMatch===true) //日线完全匹配
                {
                    if (tradeItem.Date==item.Date)
                    {
                        item.Value=tradeItem.Value;
                        item.FinanceDate=tradeItem.Date;   //财务日期 调试用
                        bMatch=true;
                    }
                }
                else    //其他日线周期
                {
                    if (bMatch==false)
                    {
                        item.Value=tradeItem.Value;
                        item.FinanceDate=tradeItem.Date;   //财务日期 调试用
                        bMatch=true;
                    }
                }
            }
           
            result[i]=item;
            ++i;
        }

        return result;
    }

    this.GetMinuteFittingTradeData=function(tradeData, nullValue,bExactMatch)
    {
        var result=[];
        var bMatch=false;

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;
            var time=this.Data[i].Time;

            if (j<tradeData.length)
            {
                if (tradeData[j].Date>date || (tradeData[j].Date==date && tradeData[j].Time>time))
                {
                    var item=new SingleData();
                    item.Date=date;
                    item.Time=time;
                    item.Value=nullValue;
                    result[i]=item;
                    ++i;
                    continue;
                }
            }

            if (j+1<tradeData.length)
            {
                if ( (tradeData[j].Date<date && tradeData[j+1].Date<=date) || 
                    (tradeData[j].Date==date && tradeData[j].Time<time && tradeData[j+1].Time<=time) )
                {
                    ++j;
                    bMatch=false;
                    continue;
                }
            }

            var item=new SingleData();
            item.Date=date;
            item.FinanceDate=null;
            item.Time=time;
            item.Value=nullValue;
            if (j<tradeData.length)
            {
                var tradeItem=tradeData[j];
                if (this.Period==4 && bExactMatch===true) //1分钟线完全匹配
                {
                    if (tradeItem.Date==item.Date && tradeItem.Time==item.Time)  //完全匹配
                    {
                        item.Value=tradeItem.Value;
                        item.FinanceDate=tradeItem.Date;   //财务日期 调试用
                        item.FinanceTime=tradeItem.Time;
                        bMatch=true;
                    }
                }
                else    //其他日线周期
                {
                    if (bMatch==false)
                    {
                        item.Value=tradeItem.Value;
                        item.FinanceDate=tradeItem.Date;   //财务日期 调试用
                        item.FinanceTime=tradeItem.Time;
                        bMatch=true;
                    }
                }
            }

            result[i]=item;
            ++i;
        }

        return result;
    }

     //K线数据拟合
    this.FixKData=function(aryKData, period)
    {
        if (ChartData.IsDayPeriod(period,true))
        {
            return this.FixKData_Day(aryKData);
        }
        else if (ChartData.IsMinutePeriod(period,true))
        {
            return this.FixKData_Minute(aryKData);
        }
        
        return null;
    }

     this.FixKData_Day=function(aryKData)
    {
        var result=[];
        var nOverlayDataCount=aryKData.length;
        for(var i=0,j=0; i<this.Data.length;)
        {
            var kItem=this.Data[i];
            if (j<nOverlayDataCount)
            {
                var fItem=aryKData[j];
                if (fItem.Date>kItem.Date)
                {
                    ++i;
                    continue;
                }
            }

            if (j+1<nOverlayDataCount)
            {
                var fItem = aryKData[j];
                var fItem2 = aryKData[j + 1];

                if (fItem.Date < kItem.Date && fItem2.Date <= kItem.Date)
                {
                    ++j;
                    continue;
                }
            }

            var item=new HistoryData();
            item.Date=kItem.Date;
            var index=j<nOverlayDataCount ? j : nOverlayDataCount-1;
            var fItem=aryKData[index];

            item.Close = fItem.Close;
			item.High = fItem.High;
			item.Low = fItem.Low;
			item.Open = fItem.Open;
			item.YClose = fItem.YClose;
			item.Amount = fItem.Amount;
            item.Vol = fItem.Vol;
            item.ExDate = fItem.Date;   //对应叠加数据的日期 调试用

            result[i]=item;
            ++i;
        }

        return result;
    }

    this.FixKData_Minute=function(aryKData)
    {
        var result=[];
        var nOverlayDataCount=aryKData.length;
        for(var i=0,j=0; i<this.Data.length;)
        {
            var kItem=this.Data[i];
            var kDateTime=ChartData.DateTimeToNumber(kItem);

            if (j<nOverlayDataCount)
            {
                var fItem=aryKData[j];
                var fDateTime=ChartData.DateTimeToNumber(fItem);
                if (fDateTime>kDateTime)
                {
                    ++i;
                    continue;
                }
            }

            if (j+1<nOverlayDataCount)
            {
                var fItem = aryKData[j];
                var fItem2 = aryKData[j + 1];
                var fDateTime=ChartData.DateTimeToNumber(fItem);
                var fDateTime2=ChartData.DateTimeToNumber(fItem2);

                if (fDateTime < kDateTime && fDateTime2 <= kDateTime)
                {
                    ++j;
                    continue;
                }
            }

            var item=new HistoryData();
            item.Date=kItem.Date;
            item.Time=kItem.Time;
            var index=j<nOverlayDataCount ? j : nOverlayDataCount-1;
            var fItem=aryKData[index];

            item.Close = fItem.Close;
			item.High = fItem.High;
			item.Low = fItem.Low;
			item.Open = fItem.Open;
			item.YClose = fItem.YClose;
			item.Amount = fItem.Amount;
            item.Vol = fItem.Vol;
            item.ExDate = fItem.Date;   //对应叠加数据的日期 调试用
            item.ExTime=fItem.Time;     //对应叠加数据的日期 调试用

            result[i]=item;
            ++i;
        }

        return result;
    }

}

ChartData.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

ChartData.DateTimeToNumber=function(kItem)
{
    return kItem.Date*10000+kItem.Time;
}

ChartData.GetKLineDataTime=function(kLineItem)   //获取K线的 日期和时间 如果时间没有就用0
{
    var result={ Date:kLineItem.Date, Time:0 };
    if (ChartData.IsNumber(kLineItem.Time)) result.Time=kLineItem.Time;

    return result;
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

var JSCHART_EVENT_ID =
{
    RECV_INDEX_DATA: 2,  //接收指标数据
    RECV_HISTROY_DATA: 3,//接收到历史数据
    RECV_TRAIN_MOVE_STEP: 4,    //接收K线训练,移动一次K线
    CHART_STATUS: 5,            //每次Draw() 以后会调用
    BARRAGE_PLAY_END: 6,        //单个弹幕播放完成
    RECV_OVERLAY_INDEX_DATA:7,  //接收叠加指标数据
    RECV_START_AUTOUPDATE: 9,    //开始自动更新
    RECV_STOP_AUTOUPDATE: 10,    //停止自动更新
    ON_TITLE_DRAW: 12,           //标题信息绘制事件
    RECV_MINUTE_DATA: 14,          //分时图数据到达
    ON_CLICK_INDEXTITLE:15,       //点击指标标题事件
    RECV_KLINE_UPDATE_DATA: 16,   //K线日,分钟更新数据到达 
    ON_CLICK_DRAWPICTURE:17,    //点击画图工具 
    ON_FINISH_DRAWPICTURE:18,    //完成画图工具    
    ON_INDEXTITLE_DRAW: 19,       //指标标题重绘事件 
    ON_CUSTOM_VERTICAL_DRAW: 20,  //自定义X轴绘制事件 
    ON_ENABLE_SPLASH_DRAW:22,          //开启/关闭过场动画事件

    ON_DRAW_DEPTH_TOOLTIP:25,             //绘制深度图tooltip事件
    ON_PHONE_TOUCH:27,                   //手势点击事件 包含 TouchStart 和 TouchEnd

    ON_SPLIT_YCOORDINATE:29,             //分割Y轴及格式化刻度文字
    ON_SPLIT_XCOORDINATE:31,             //分割X轴及格式化刻度文字
    
    ON_DRAW_KLINE_LAST_POINT:35,          //K线图绘制回调事件,返回最后一个点的坐标

    ON_DRAW_COUNTDOWN:41,                 //K线倒计时
    ON_BIND_DRAWICON:42,                  //绑定DRAWICON回调

    ON_DRAW_DEAL_VOL_COLOR:43,              //成交明细 成交量颜色 (h5)
    ON_DRAW_DEAL_TEXT:44,                   //成交明细 自定义字段 (h5)
    ON_FILTER_DEAL_DATA:45,                 //成交明细 数据过滤回调 (h5)

    ON_FILTER_REPORT_DATA:46,               //报价列表 数据过滤回调
    ON_CLICK_REPORT_ROW:47,                 //点击报价列表
    ON_REPORT_MARKET_STATUS:48,             //报价列表交易状态
    ON_DBCLICK_REPORT_ROW:49,               //双击报价列表 (h5)
    ON_RCLICK_REPORT_ROW:50,                //右键点击列表
    ON_CLICK_REPORT_HEADER:51,              //单击表头
    ON_RCLICK_REPORT_HEADER:52,             //右键点击表头
    ON_REPORT_LOCAL_SORT:53,                //报价列表本地排序
    ON_DRAW_REPORT_NAME_COLOR:54,           //报价列表股票名称列颜色
    ON_DRAW_CUSTOM_TEXT:55,                 //报价列表自定义列
    ON_CLICK_REPORT_TAB:56,                 //报价列表标签点击 (h5)
    ON_CLICK_REPORT_TABMENU:57,             //报价列表标签菜单点击 (h5)
    ON_DRAW_REPORT_FIXEDROW_TEXT:58,        //报价列表固定行绘制
    ON_CLICK_REPORT_FIXEDROW:59,            //点击报价列表点击固定行
    ON_RCLICK_REPORT_FIXEDROW:60,           //点击报价列表右键点击固定行

    ON_FORMAT_CORSSCURSOR_Y_TEXT:75,    //格式化十字光标Y轴文字
    ON_FORMAT_INDEX_OUT_TEXT:76,           //格式化指标标题文字
    ON_FORMAT_CORSSCURSOR_X_TEXT:77,    //格式化十字光标X轴文字


    ON_CUSTOM_UNCHANGE_KLINE_COLOR:95,  //定制平盘K线颜色

    ON_CHANGE_KLINE_PERIOD:101,                 //切换周期
    ON_MINUTE_TOUCH_ZOOM:102,                   //分时图手势缩放 

    ON_RELOAD_INDEX_CHART_RESOURCE:103,         //加载指标图形额外资源
    ON_RELOAD_OVERLAY_INDEX_CHART_RESOURCE:104, //加载叠加指标图形额外资源
    
    ON_CREATE_FRAME:105,
    ON_DELETE_FRAME:106,
    ON_SIZE_FRAME:107,
    
    ON_TOUCH_SCROLL_UP_DOWN:108,

    ON_FORMAT_KLINE_HIGH_LOW_TITLE:154,     //K线最高最低价格式化内容
    ON_CUSTOM_CORSSCURSOR_POSITION:155,     //自定义十字光标X轴的输出的位置
    ON_CUSTOM_MINUTE_NIGHT_DAY_X_INDEX:156,   //日盘夜盘的分界线
}

var JSCHART_DATA_FIELD_ID=
{
    MINUTE_MULTI_DAY_EXTENDDATA:21, //多日分时图扩展数据序号
    MINUTE_DAY_EXTENDDATA:21,
    MINUTE_BEFOREOPEN_EXTENDDATA:21,
    MINUTE_AFTERCLOSE_EXTENDDATA:21,

    KLINE_COLOR_DATA:66,            //K线自定义颜色数据
    KLINE_DAY_EXTENDDATA:25,
    KLINE_MINUTE_EXTENDDATA:25,
}

var HQ_DATA_TYPE=
{
    KLINE_ID:0,         //K线
    MINUTE_ID:2,        //当日走势图
    HISTORY_MINUTE_ID:3,//历史分钟走势图
    MULTIDAY_MINUTE_ID:4,//多日走势图
};

//K线叠加 支持横屏
var OVERLAY_STATUS_ID=
{
    STATUS_NONE_ID:0,           //空闲状态
    STATUS_REQUESTDATA_ID:1,    //请求数据
    STATUS_RECVDATA_ID:2,       //接收到数据
    STATUS_FINISHED_ID:3,       //数据下载完成
};

function PhoneDBClick()
{
    this.Start=[];

    this.Clear=function()
    {
        this.Start=[];
    }

    this.AddTouchStart=function(x, y, time)
    {
        if (this.Start.length>0)
        {
            var item=this.Start[this.Start.length-1];
            var spanTime=time-item.Time;
            if (spanTime>0 && spanTime<300)
            {
                this.Start.push({ X:x, Y:y, Time:time });
            }
            else
            {
                this.Start=[];
            }
        }
        else
        {
            this.Start.push({ X:x, Y:y, Time:time });
        }
    }

    this.IsVaildDBClick=function()
    {
        if (this.Start.length==2) return true;

        return false;
    }

    this.AddTouchEnd=function(time)
    {
        if (this.Start.length<=0) return;

        var item=this.Start[this.Start.length-1];
        var spanTime=time-item.Time;
        if (spanTime>=0 && spanTime<150)
        {
            
        }
        else
        {
            this.Start=[];
        }
    }
}

//导出统一使用JSCommon命名空间名
var JSCommonData=
{
    HistoryData: HistoryData,
    ChartData: ChartData,
    SingleData: SingleData,
    MinuteData: MinuteData,
    Rect: Rect,
    DataPlus: DataPlus,
    g_DataPlus:g_DataPlus,
    JSCHART_EVENT_ID:JSCHART_EVENT_ID,
    PhoneDBClick:PhoneDBClick,
    HQ_DATA_TYPE:HQ_DATA_TYPE,
    OVERLAY_STATUS_ID:OVERLAY_STATUS_ID,
};

export
{
    JSCommonData,

    ChartData,
    HistoryData,
    SingleData,
    MinuteData,
    CUSTOM_DAY_PERIOD_START,
    CUSTOM_DAY_PERIOD_END,
    CUSTOM_MINUTE_PERIOD_START,
    CUSTOM_MINUTE_PERIOD_END,
    CUSTOM_SECOND_PERIOD_START,
    CUSTOM_SECOND_PERIOD_END,
    Rect,
    DataPlus,
    g_DataPlus,
    Guid,
    ToFixedPoint,
    ToFixedRect,
    JSCHART_EVENT_ID,
    JSCHART_DATA_FIELD_ID,
    PhoneDBClick,
    HQ_DATA_TYPE,
    OVERLAY_STATUS_ID,
    CloneData
};

/*
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
        JSCHART_EVENT_ID:JSCHART_EVENT_ID,
        PhoneDBClick:PhoneDBClick,
        HQ_DATA_TYPE:HQ_DATA_TYPE,
        OVERLAY_STATUS_ID:OVERLAY_STATUS_ID,
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
    JSCommon_JSCHART_EVENT_ID:JSCHART_EVENT_ID,
    JSCommon_PhoneDBClick:PhoneDBClick,
    JSCommon_HQ_DATA_TYPE:HQ_DATA_TYPE,
    JSCommon_OVERLAY_STATUS_ID:OVERLAY_STATUS_ID,
};
*/