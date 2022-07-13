/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    坐标轴相关算法
*/

import 
{
    g_JSChartResource,
    JSCHART_LANGUAGE_ID,
    g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import {
    ChartData, HistoryData,
    SingleData, MinuteData,
    JSCHART_EVENT_ID,
} from "./umychart.data.wechat.js";

import { JSCommonCoordinateData } from "./umychart.coordinatedata.wechat.js";
var MARKET_SUFFIX_NAME = JSCommonCoordinateData.MARKET_SUFFIX_NAME;

var WEEK_NAME=["日","一","二","三","四","五","六"];

//坐标信息
function CoordinateInfo() 
{
    this.Value;                                                   //坐标数据
    this.Message = new Array();                                   //坐标输出文字信息
    this.TextColor = g_JSChartResource.FrameSplitTextColor        //文字颜色
    this.Font = g_JSChartResource.FrameSplitTextFont;             //字体
    this.LineColor = g_JSChartResource.FrameSplitPen;             //线段颜色
    this.LineDash=null;                                           //当线段类型==2时 可以设置虚线样式
    this.LineType = 1;                                            //线段类型 -1=不画线段,  2=虚线
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//坐标分割
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function IFrameSplitOperator() 
{
    this.ChartBorder;                   //边框信息
    this.Frame;                         //框架信息
    this.FrameSplitData;                //坐标轴分割方法
    this.SplitCount = 5;                  //刻度个数
    this.StringFormat = 0;                //刻度字符串格式 -1 刻度文字全部不显示 -2 刻度文字右边不显示
    this.IsShowLeftText = true;           //显示左边刻度 
    this.IsShowRightText = true;          //显示右边刻度
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.GetEventCallback;              //事件回调

    //////////////////////
    // data.Min data.Max data.Interval data.Count
    //
    this.IntegerCoordinateSplit = function (data) 
    {
        var splitItem = this.FrameSplitData.Find(data.Interval);
        if (!splitItem) return false;
        if (data.Interval == splitItem.Interval) return true;

        var fixMax=data.Max, fixMin=data.Min;
        var maxValue=data.Max/splitItem.FixInterval;
        var minValue=data.Min/splitItem.FixInterval;
        //调整到整数倍数,不能整除的 +1
        if (IFrameSplitOperator.IsFloat(maxValue)) fixMax=parseInt((maxValue+0.5).toFixed(0))*splitItem.FixInterval;
        if (IFrameSplitOperator.IsFloat(minValue)) fixMin=parseInt((minValue-0.5).toFixed(0))*splitItem.FixInterval;
        if (data.Min == 0) fixMin = 0;  //最小值是0 不用调整了.
        if (fixMin < 0 && data.Min > 0) fixMin = 0;   //都是正数的, 最小值最小调整为0

        var count = 0;
        for (var i = fixMin; (i - fixMax) < 0.00000001; i += splitItem.FixInterval) 
        {
            ++count;
        }

        data.Interval = splitItem.FixInterval;
        data.Max = fixMax;
        data.Min = fixMin;
        data.Count = count;

        return true;
    }

    this.Filter = function (aryInfo, keepZero)   //keepZero 保留0轴
    {
        if (this.SplitCount <= 0 || aryInfo.length <= 0 || aryInfo.length <= this.SplitCount) return aryInfo;

        //分割线比预设的多, 过掉一些
        var filter = parseInt(aryInfo.length / this.SplitCount);
        if (filter <= 1) filter = 2;
        var data = [];

        for (var i = 0; i < aryInfo.length; i += filter) 
        {
            if (i + filter >= aryInfo.length && i != aryInfo.length - 1) //最后一个数据放进去
            {
                data.push(aryInfo[aryInfo.length - 1]);
            }
            else {
                data.push(aryInfo[i]);
            }
        }

        if (this.SplitCount == 2 && data.length > 2) //之显示第1个和最后一个刻度
        {
            for (var i = 1; i < data.length - 1; ++i) 
            {
                var item = data[i];
                item.Message[0] = null;
                item.Message[1] = null;
            }
        }

        if (keepZero)   //如果不存在0轴,增加一个0轴,刻度信息部显示
        {
            var bExsitZero = false;
            for (var i = 0; i < data.length; ++i) 
            {
                var item = data[i];
                if (Math.abs(item.Value) < 0.00000001) 
                {
                    bExsitZero = true;
                    break;
                }
            }

            if (bExsitZero == false) 
            {
                var zeroCoordinate = new CoordinateInfo();
                zeroCoordinate.Value = 0;
                zeroCoordinate.Message[0] = null
                zeroCoordinate.Message[1] = null;
                data.push(zeroCoordinate);
            }
        }

        return data;
    }

    this.RemoveZero = function (aryInfo)   //移除小数后面多余的0
    {
        //所有的数字小数点后面都0,才会去掉
        var isAllZero = [true, true];
        for (var i in aryInfo) {
            var item = aryInfo[i];
            var message = item.Message[0];
            if (!this.IsDecimalZeroEnd(message)) isAllZero[0] = false;

            var message = item.Message[1];
            if (!this.IsDecimalZeroEnd(message)) isAllZero[1] = false;
        }

        if (isAllZero[0] == false && isAllZero[1] == false) return;
        for (var i in aryInfo) 
        {
            var item = aryInfo[i];
            if (isAllZero[0]) 
            {
                var message = item.Message[0];
                if (message != null) 
                {
                    if (typeof (message) == 'number') message = message.toString();
                    item.Message[0] = message.replace(/[.][0]+/g, '');
                }
            }

            if (isAllZero[1]) 
            {
                var message = item.Message[1];
                if (message != null) 
                {
                    if (typeof (message) == 'number') message = message.toString();
                    item.Message[1] = message.replace(/[.][0]+/g, '');
                }
            }
        }
    }

    this.IsDecimalZeroEnd = function (text)   //是否是0结尾的小数
    {
        if (text == null) return true;
        if (text == '0') return true;
        if (typeof (text) == 'number') text = text.toString();

        var pos = text.search(/[.]/);
        if (pos < 0) return false;

        for (var i = pos + 1; i < text.length; ++i) 
        {
            var char = text.charAt(i);
            if (char >= '1' && char <= '9') return false;
        }

        return true;
    }
}

//字符串格式化 千分位分割
IFrameSplitOperator.FormatValueThousandsString=function(value,floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    var result='';
    var num=value.toFixed(floatPrecision);
    if(floatPrecision>0){
        var numFloat = num.split('.')[1];
        var numM = num.split('.')[0];
        while (numM.length > 3)
        {
            result = ',' + numM.slice(-3) + result;
            numM = numM.slice(0, numM.length - 3);
        }
        if (numM) { result = numM + result + '.' + numFloat; }
    }else{
        while (num.length > 3)
        {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
    }
    
    return result;
}

//数据输出格式化 floatPrecision=小数位数
IFrameSplitOperator.FormatValueString=function(value, floatPrecision,languageID)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    if (value<0.00000000001 && value>-0.00000000001)
    {
        return "0";
    }

    var absValue = Math.abs(value);
    if (languageID===JSCHART_LANGUAGE_ID.LANGUAGE_ENGLISH_ID)
    {
        if (absValue < 10000)
            return value.toFixed(floatPrecision);
        else if (absValue < 1000000)
            return (value/1000).toFixed(floatPrecision)+"K";
        else if (absValue < 1000000000)
            return (value/1000000).toFixed(floatPrecision)+"M";
        else if (absValue < 1000000000000)
            return (value/1000000000).toFixed(floatPrecision)+"B";
        else 
            return (value/1000000000000).toFixed(floatPrecision)+"T";
    }
    else if (languageID===JSCHART_LANGUAGE_ID.LANGUAGE_TRADITIONAL_CHINESE_ID)  //繁体
    {
        if (absValue < 10000)
            return value.toFixed(floatPrecision);
        else if (absValue < 100000000)
            return (value/10000).toFixed(floatPrecision)+"萬";
        else if (absValue < 1000000000000)
            return (value/100000000).toFixed(floatPrecision)+"億";
        else
            return (value/1000000000000).toFixed(floatPrecision)+"萬億";
    }
    else
    {
        if (absValue < 10000)
            return value.toFixed(floatPrecision);
        else if (absValue < 100000000)
            return (value/10000).toFixed(floatPrecision)+"万";
        else if (absValue < 1000000000000)
            return (value/100000000).toFixed(floatPrecision)+"亿";
        else
            return (value/1000000000000).toFixed(floatPrecision)+"万亿";
    }

    return '';
}

//整形输出格式化 floatPrecision=小数位数
IFrameSplitOperator.FromatIntegerString=function(value, floatPrecision,languageID)
{
    if (value<10000 && IFrameSplitOperator.IsInteger(value)) floatPrecision=0;  //<10000的整形 去掉小数位数
    return IFrameSplitOperator.FormatValueString(value, floatPrecision,languageID);
}

IFrameSplitOperator.NumberToString=function(value)
{
    if (value<10) return '0'+value.toString();
    return value.toString();
}

IFrameSplitOperator.FormatDateString=function(value,format,languageID)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var day=value%100;

    switch(format)
    {
        case 'MM-DD':
            return IFrameSplitOperator.NumberToString(month) + '-' + IFrameSplitOperator.NumberToString(day);
        case "YYYY-MM":
            return `${year}-${IFrameSplitOperator.NumberToString(month)}`;
        case "YYYY/MM/DD":
            return year.toString() + '/' + IFrameSplitOperator.NumberToString(month) + '/' + IFrameSplitOperator.NumberToString(day);
        case "YYYY/MM/DD/W":
            {
                var date=new Date(year,month-1,day);
                var week=g_JSChartLocalization.GetText(WEEK_NAME[date.getDay()],languageID);
                return year.toString() + '/' + IFrameSplitOperator.NumberToString(month) + '/' + IFrameSplitOperator.NumberToString(day)+"/"+ week.toString();
            }
        case "DD/MM/YYYY":
            return IFrameSplitOperator.NumberToString(day) + '/' + IFrameSplitOperator.NumberToString(month) + '/' + year.toString();
        default:
            return year.toString() + '-' + IFrameSplitOperator.NumberToString(month) + '-' + IFrameSplitOperator.NumberToString(day);
    }
}

IFrameSplitOperator.FormatTimeString=function(value, format)    //format hh:mm:ss
{
    if (format=='HH:MM:SS')
    {
        var hour=parseInt(value/10000);
        var minute=parseInt((value%10000)/100);
        var second=value%100;
        return IFrameSplitOperator.NumberToString(hour)+':'+ IFrameSplitOperator.NumberToString(minute) + ':' + IFrameSplitOperator.NumberToString(second);
    }
    else if (format == 'HH:MM') 
    {
        var hour = parseInt(value / 100);
        var minute = value % 100;
        return IFrameSplitOperator.NumberToString(hour) + ':' + IFrameSplitOperator.NumberToString(minute);
    }
    else 
    {
        if (value < 10000)
        {
            var hour = parseInt(value / 100);
            var minute = value % 100;
            return IFrameSplitOperator.NumberToString(hour) + ':' + IFrameSplitOperator.NumberToString(minute);
        }
        else
        {
            var hour = parseInt(value / 10000);
            var minute = parseInt((value % 10000) / 100);
            var second = value % 100;
            return IFrameSplitOperator.NumberToString(hour) + ':' + IFrameSplitOperator.NumberToString(minute) + ':' + IFrameSplitOperator.NumberToString(second);
        }
        
    }
}

//报告格式化
IFrameSplitOperator.FormatReportDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var monthText;
    switch(month)
    {
        case 3:
            monthText="一季度报";
            break;
        case 6:
            monthText="半年报";
            break;
        case 9:
            monthText="三季度报";
            break;
        case 12:
            monthText="年报";
            break;
    }

    return year.toString()+ monthText;
}

IFrameSplitOperator.FormatDateTimeString=function(value,isShowDate)
{
    var aryValue=value.split(' ');
    if (aryValue.length<2) return "";
    var time=parseInt(aryValue[1]);
    var minute=time%100;
    var hour=parseInt(time/100);
    var text=(hour<10? ('0'+hour.toString()):hour.toString()) + ':' + (minute<10?('0'+minute.toString()):minute.toString());

    if (isShowDate==true)
    {
        var date=parseInt(aryValue[0]);
        var year=parseInt(date/10000);
        var month=parseInt(date%10000/100);
        var day=date%100;
        text=year.toString() +'-'+ (month<10? ('0'+month.toString()) :month.toString()) +'-'+ (day<10? ('0'+day.toString()):day.toString()) +" " +text;
    }

    return text;
}

//字段颜色格式化
IFrameSplitOperator.FormatValueColor = function (value, value2) 
{
    if (value != null && value2 == null)  //只传一个值的 就判断value正负
    {
        if (value == 0) return 'PriceNull';
        else if (value > 0) return 'PriceUp';
        else return 'PriceDown';
    }

    //2个数值对比 返回颜色
    if (value == null || value2 == null) return 'PriceNull';
    if (value == value2) return 'PriceNull';
    else if (value > value2) return 'PriceUp';
    else return 'PriceDown';
}

IFrameSplitOperator.IsNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return true;
}

//判断是否是正数
IFrameSplitOperator.IsPlusNumber=function(value)
{
    if (value==null) return false;
    if (isNaN(value)) return false;

    return value>0;
}

//是否是整形
IFrameSplitOperator.IsInteger=function(x) 
{
    return (typeof x === 'number') && (x % 1 === 0);
}

//判断字段是否存在
IFrameSplitOperator.IsObjectExist=function(obj)
{
    if (obj===undefined) return false;
    if (obj==null) return false;
    
    return true;
}

//是否时bool
IFrameSplitOperator.IsBool=function(value)
{
    if (value===true || value===false) return true;
    return false;
}

IFrameSplitOperator.IsString=function(value)
{
    var type=typeof(value);
    if (type=='string') return true;
    return false;
}

IFrameSplitOperator.IsFloat=function(value)
{
    if (value===undefined) return false;
    if (value==null) return false;
    if (isNaN(value)) return false;

    return value!=parseInt(value);
}

//是否是非空的数组
IFrameSplitOperator.IsNonEmptyArray=function(ary)
{
    if (!ary) return;
    if (!Array.isArray(ary)) return;

    return ary.length>0;
}

//K线Y轴分割
function FrameSplitKLinePriceY() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.CoordinateType = 0;  //坐标类型 0=普通坐标  1=百分比坐标 (右边坐标刻度)
    this.Symbol;
    this.Data;              //K线数据 (计算百分比坐标)
    this.FrameSplitData2;   //坐标轴分割方法(计算百分比刻度)
    this.FloatPrecision = null;   //小数位数 (设置了就使用这个位数,否则使用品种对应的小数位数)

    this.Custom = []; //[{Type:0}];   定制刻度 0=显示最后的价格刻度
    this.SplitType = 0;       //0=自动分割  1=固定分割
    this.DefaultSplitType=0;

    this.Operator = function () 
    {
        var splitData = {};
        splitData.Max = this.Frame.HorizontalMax;
        splitData.Min = this.Frame.HorizontalMin;
        splitData.Count = this.SplitCount;
        if (splitData.Max==splitData.Min)   //如果一样上下扩大下
		{
			splitData.Max+=splitData.Max*0.01;
			splitData.Min-=splitData.Min*0.01
		}
        splitData.Interval = (splitData.Max - splitData.Min) / (splitData.Count - 1);

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        if (JSCommonCoordinateData.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol)) defaultfloatPrecision = 0;    //手机端指数不显示小数位数
        if (this.FloatPrecision != null) defaultfloatPrecision = this.FloatPrecision;

        var bFilter=true;
        if (FrameSplitKLinePriceY.SplitCustom)
        {
            FrameSplitKLinePriceY.SplitCustom(this,splitData,defaultfloatPrecision);    //自定义分割
            bFilter=false;
        }
        else
        {
            switch (this.CoordinateType)
            {
                case 1:
                    this.SplitPercentage(splitData, defaultfloatPrecision);
                    break;
                default:
                    if (this.SplitType == 1) this.SplitFixed(splitData, defaultfloatPrecision);
                    else this.SplitDefault(splitData, defaultfloatPrecision);
                    this.CustomCoordinate(defaultfloatPrecision);
                    break;
            }
        }

        if (bFilter) this.Frame.HorizontalInfo = this.Filter(this.Frame.HorizontalInfo, false);
        this.Frame.HorizontalMax = splitData.Max;
        this.Frame.HorizontalMin = splitData.Min;

        if (this.GetEventCallback)
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_SPLIT_YCOORDINATE);
            if (event && event.Callback)
            {
                var data={ID:this.Frame.Identify, Frame:this.Frame };
                event.Callback(event,data,this);
            }
        }
    }

    this.SplitDefault = function (splitData, floatPrecision)       //默认坐标
    {
        this.IntegerCoordinateSplit(splitData);

        this.Frame.HorizontalInfo = [];
        for (var i = 0, value = splitData.Min; i < splitData.Count; ++i, value += splitData.Interval)
        {
            this.Frame.HorizontalInfo[i] = new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value = value;
            if (this.IsShowLeftText) this.Frame.HorizontalInfo[i].Message[0] = value.toFixed(floatPrecision);
            if (this.IsShowRightText) this.Frame.HorizontalInfo[i].Message[1] = value.toFixed(floatPrecision);
        }
    }

    this.SplitPercentage = function (splitData, floatPrecision)    //百分比坐标
    {
        var firstOpenPrice = this.GetFirstOpenPrice();
        splitData.Max = (splitData.Max - firstOpenPrice) / firstOpenPrice;
        splitData.Min = (splitData.Min - firstOpenPrice) / firstOpenPrice;
        splitData.Interval = (splitData.Max - splitData.Min) / (splitData.Count - 1);
        this.IntegerCoordinateSplit2(splitData);

        var maxValue=(1 + splitData.Max) * firstOpenPrice;
        var minValue=(1 + splitData.Min) * firstOpenPrice; 

        this.Frame.HorizontalInfo = [];
        for (var i = 0, value = splitData.Min; i < splitData.Count; ++i, value += splitData.Interval) 
        {
            var price = (value + 1) * firstOpenPrice;
            if (price<minValue || price>maxValue) continue;

            this.Frame.HorizontalInfo[i] = new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value = price;
            if (this.IsShowLeftText) this.Frame.HorizontalInfo[i].Message[0] = price.toFixed(floatPrecision);   //左边价格坐标      
            if (this.IsShowRightText) this.Frame.HorizontalInfo[i].Message[1] = (value * 100).toFixed(2) + '%';      //右边百分比
        }

        splitData.Min = (1 + splitData.Min) * firstOpenPrice; //最大最小值调整
        splitData.Max = (1 + splitData.Max) * firstOpenPrice;
    }

    this.SplitFixed = function (splitData, floatPrecision)      //固定分割坐标
    {
        this.Frame.HorizontalInfo = [];
        for (var i = 0, value = splitData.Min; i < splitData.Count; ++i, value += splitData.Interval) {
            this.Frame.HorizontalInfo[i] = new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value = value;
            if (this.IsShowLeftText) this.Frame.HorizontalInfo[i].Message[0] = value.toFixed(floatPrecision);
            if (this.IsShowRightText) this.Frame.HorizontalInfo[i].Message[1] = value.toFixed(floatPrecision);
        }
    }

    this.CustomCoordinate = function (floatPrecision) 
    {
        this.Frame.CustomHorizontalInfo = [];
        for (var i=0;i<this.Custom.length; ++i) 
        {
            var item = this.Custom[i];
            if (item.Type == 0 || item.Type==3 || item.Type==2 )     //最新价格刻度
            {
                var dec=floatPrecision;
                //外部设置小数位数
                if (IFrameSplitOperator.IsNumber(item.FloatPrecision) && item.FloatPrecision>=0) dec=item.FloatPrecision;
                var latestItem = this.GetLatestPrice(dec, item);
                if (latestItem) this.Frame.CustomHorizontalInfo.push(latestItem);
            }
            else if (item.Type == 1)    //固定价格刻度
            {
                this.CustomFixedCoordinate(item);
            }
        }
    }

    this.GetLatestPrice = function (floatPrecision, option) 
    {
        if (!this.Data || !this.Data.Data) return null;
        if (this.Data.Data.length <= 0) return null;
        var latestItem = this.Data.Data[this.Data.Data.length - 1];
        var info = new CoordinateInfo();
        info.Type = 0;
        if (option && IFrameSplitOperator.IsNumber(option.Type)) info.Type=option.Type;
        info.Value = latestItem.Close;
        info.TextColor = g_JSChartResource.FrameLatestPrice.TextColor;
        info.LineType = 2;    //虚线
        if (option.Position == 'left') info.Message[0] = latestItem.Close.toFixed(floatPrecision);
        else info.Message[1] = latestItem.Close.toFixed(floatPrecision);
        if (latestItem.Close > latestItem.Open) info.LineColor = g_JSChartResource.FrameLatestPrice.UpBarColor;
        else if (latestItem.Close < latestItem.Open) info.LineColor = g_JSChartResource.FrameLatestPrice.DownBarColor;
        else info.LineColor = g_JSChartResource.FrameLatestPrice.UnchagneBarColor;

        if (IFrameSplitOperator.IsNumber(option.LineType)) info.LineType=option.LineType;
        if (option.IsShowLine == false) info.LineType = -1;
        if (option.CountDown===true) info.CountDown=true;   //倒计时设置
        if (option.PositionEx===1) info.ExtendData={ Custom:{ Position:1 } };   //强制画在内部
        return info;
    }

    this.GetFirstOpenPrice = function ()   //获取显示第1个数据的开盘价
    {
        if (!this.Data) return null;
        var xPointCount = this.Frame.XPointCount;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            return data.Open;
        }
        return null;
    }

    this.CustomFixedCoordinate = function (option)    //固定坐标刻度
    {
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        for (var i=0; i<option.Data.length; ++i) 
        {
            var item = option.Data[i];
            var info = new CoordinateInfo();
            info.Type = 1;
            info.TextColor = item.TextColor;
            info.LineColor = item.Color;
            info.LineType = 2;    //虚线
            if (IFrameSplitOperator.IsNumber(option.LineType)) info.LineType=option.LineType;
            if (option.IsShowLine == false) info.LineType = -1;

            info.Value = item.Value;
            var text;
            if (item.Text) text = item.Text;
            else text = info.Value.toFixed(defaultfloatPrecision);
            if (option.Position == 'left') info.Message[0] = text;
            else info.Message[1] = text;
            if (option.PositionEx===1) info.ExtendData={ Custom:{ Position:1 } };   //强制画在内部
            this.Frame.CustomHorizontalInfo.push(info);
        }
    }


    //////////////////////
    // data.Min data.Max data.Interval data.Count
    //
    this.IntegerCoordinateSplit2 = function (data) 
    {
        var splitItem = this.FrameSplitData2.Find(data.Interval);
        if (!splitItem) return false;
        if (data.Interval == splitItem.FixInterval) return true;

        var fixMax=data.Max, fixMin=data.Min;
        var maxValue=data.Max/splitItem.FixInterval;
        var minValue=data.Min/splitItem.FixInterval;
        //调整到整数倍数,不能整除的 +1
        if (IFrameSplitOperator.IsFloat(maxValue)) fixMax=parseInt((maxValue+0.5).toFixed(0))*splitItem.FixInterval;
        if (IFrameSplitOperator.IsFloat(minValue)) fixMin=parseInt((minValue-0.5).toFixed(0))*splitItem.FixInterval;
        if (data.Min == 0) fixMin = 0;  //最小值是0 不用调整了.
        if (fixMin < 0 && data.Min > 0) fixMin = 0;   //都是正数的, 最小值最小调整为0

        var count = 0;
        for (var i = fixMin; (i - fixMax) < 0.00000001; i += splitItem.FixInterval) 
        {
            ++count;
        }

        data.Interval = splitItem.FixInterval;
        data.Max = fixMax;
        data.Min = fixMin;
        data.Count = count;

        return true;
    }

}

//一般的Y轴分割
function FrameSplitY() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;
    this.SplitType=0;                         //0=自动分割  1=固定分割 2=百分比(0-100)
    this.DefaultSplitType=0;
    this.FloatPrecision = 2;                  //坐标小数位数(默认2)
    this.FLOATPRECISION_RANGE = [1, 0.1, 0.01, 0.001, 0.0001];
    this.IgnoreYValue = null;                 //在这个数组里的数字不显示在刻度上 
    this.LineType=null;     //线段样式

    this.IsShowYZero = true;
    this.IntegerSplitData = null;

    this.Operator = function () 
    {
        var splitData = {};
        splitData.Max = this.Frame.HorizontalMax;
        splitData.Min = this.Frame.HorizontalMin;

        if (splitData.Max==splitData.Min)   //如果一样上下扩大下
		{
            if (splitData.Max==0)
            {
                splitData.Max=1;
                splitData.Min=-1;
            }
            else
            {
                splitData.Max+=splitData.Max*0.01;
                splitData.Min-=splitData.Min*0.01;
            }
        }
        
        if (this.Frame.YSpecificMaxMin) 
        {
            splitData.Count = this.Frame.YSpecificMaxMin.Count;
            splitData.Interval = (splitData.Max - splitData.Min) / (splitData.Count - 1);
        }
        else if (this.SplitType==1)
        {
            splitData.Count=this.SplitCount;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        }
        else if (this.SplitType==2)
        {
            splitData.Max=100;
            splitData.Min=0;
            splitData.Count=this.SplitCount;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        }
        else 
        {
            splitData.Count = this.SplitCount * 2;  //放大两倍
            if (this.FloatPrecision == 0)       //页面配置了纵坐标小数位数FloatPrecision=0时执行
            {
                splitData.Interval = (splitData.Max - splitData.Min) / (splitData.Count - 1);
                this.IntegerCoordinateSplit2(splitData);
            }
            else {
                splitData.Interval = (splitData.Max - splitData.Min) / (splitData.Count - 1);
                this.IntegerCoordinateSplit(splitData);
            }
        }

        this.Frame.HorizontalInfo = [];
        if (this.Frame.YSplitScale) 
        {
            for (var i in this.Frame.YSplitScale) 
            {
                var value = this.Frame.YSplitScale[i];
                var coordinate = new CoordinateInfo();
                coordinate.Value = value;
                if (IFrameSplitOperator.IsNumber(this.LineType)) coordinate.LineType=this.LineType;

                var absValue = Math.abs(value);
                var floatPrecision = this.FloatPrecision;   //数据比小数位数还小, 调整小数位数
                if (absValue < 0.0000000001)
                    coordinate.Message[1] = 0;
                else if (absValue < this.FLOATPRECISION_RANGE[this.FLOATPRECISION_RANGE.length - 1])
                    coordinate.Message[1] = value.toExponential(2).toString();
                else 
                {
                    if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                    if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                    if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                    coordinate.Message[1] = IFrameSplitOperator.FormatValueString(value, floatPrecision, this.LanguageID);
                }
                coordinate.Message[0] = coordinate.Message[1];

                if (this.StringFormat == -2) coordinate.Message[1] = null;    //刻度右边不显示
                else if (this.StringFormat == -3) coordinate.Message[0] = null;   //刻度左边不显示
                else if (this.StringFormat == -1) coordinate.Message[0] = coordinate.Message[1] = null;   //刻度左右都不显示

                this.Frame.HorizontalInfo.push(coordinate);
            }
        }
        else 
        {
            for (var i = 0, value = splitData.Min; i < splitData.Count; ++i, value += splitData.Interval) 
            {
                var coordinate=new CoordinateInfo();
                this.Frame.HorizontalInfo[i] = coordinate;
                coordinate.Value=value;
                if (IFrameSplitOperator.IsNumber(this.LineType)) coordinate.LineType=this.LineType;

                if (this.StringFormat == 1)   //手机端格式 如果有万,亿单位了 去掉小数
                {
                    var floatPrecision = this.FloatPrecision;
                    if (!isNaN(value) && Math.abs(value) > 1000) floatPrecision = 0;
                    this.Frame.HorizontalInfo[i].Message[1] = IFrameSplitOperator.FormatValueString(value, floatPrecision, this.LanguageID);
                }
                else if (this.StringFormat == -1) //刻度不显示
                {

                }
                else 
                {
                    var absValue = Math.abs(value);
                    var floatPrecision = this.FloatPrecision;   //数据比小数位数还小, 调整小数位数
                    if (absValue < 0.0000000001)
                        this.Frame.HorizontalInfo[i].Message[1] = 0;
                    else if (absValue < this.FLOATPRECISION_RANGE[this.FLOATPRECISION_RANGE.length - 1])
                        this.Frame.HorizontalInfo[i].Message[1] = value.toExponential(2).toString();
                    else {
                        if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                        if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                        if (floatPrecision < this.FLOATPRECISION_RANGE.length && absValue < this.FLOATPRECISION_RANGE[floatPrecision])++floatPrecision;
                        this.Frame.HorizontalInfo[i].Message[1] = IFrameSplitOperator.FormatValueString(value, floatPrecision, this.LanguageID);
                    }
                }

                this.Frame.HorizontalInfo[i].Message[0] = this.Frame.HorizontalInfo[i].Message[1];

                if (this.StringFormat == -2) this.Frame.HorizontalInfo[i].Message[1] = null;    //刻度右边不显示
                else if (this.StringFormat == -3) this.Frame.HorizontalInfo[i].Message[0] = null;   //刻度左边不显示
            }
        }

        this.FilterIgnoreYValue();
        this.Frame.HorizontalInfo = this.Filter(this.Frame.HorizontalInfo, (splitData.Max > 0 && splitData.Min < 0 && this.IsShowYZero));
        this.RemoveZero(this.Frame.HorizontalInfo);
        this.DynamicMessageText();
        this.Frame.HorizontalMax = splitData.Max;
        this.Frame.HorizontalMin = splitData.Min;

        if (this.GetEventCallback)
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_SPLIT_YCOORDINATE);
            if (event && event.Callback)
            {
                var data={ID:this.Frame.Identify, Frame:this.Frame };
                event.Callback(event,data,this);
            }
        }
    }

    this.FilterIgnoreYValue = function () 
    {
        if (!this.IgnoreYValue || this.IgnoreYValue.length <= 0) return;

        var setValue = new Set(this.IgnoreYValue);
        this.Frame.HorizontalInfo = this.Frame.HorizontalInfo.filter(item => !setValue.has(item.Value));
        this.IsShowYZero = !setValue.has(0);    //是否显示0刻度
    }

    this.DynamicMessageText=function()
    {
        if (this.SplitType==2)
        {
            for(var i=0;i<this.Frame.HorizontalInfo.length; ++i)
            {
                var item=this.Frame.HorizontalInfo[i];
                if (item.Message[0]) item.Message[0]+='%';
                if (item.Message[1]) item.Message[1]+='%';
            }
        }
    }

    this.IntegerCoordinateSplit2 = function (data) //整数分割
    {
        if (this.IntegerSplitData == null) this.IntegerSplitData = new IntegerSplitData();
        var splitItem = this.IntegerSplitData.Find(data.Interval);
        if (!splitItem) return false;
        if (data.Interval == splitItem.FixInterval) return true;

        var fixMax=data.Max, fixMin=data.Min;
        var maxValue=data.Max/splitItem.FixInterval;
        var minValue=data.Min/splitItem.FixInterval;
        //调整到整数倍数,不能整除的 +1
        if (IFrameSplitOperator.IsFloat(maxValue)) fixMax=parseInt((maxValue+0.5).toFixed(0))*splitItem.FixInterval;
        if (IFrameSplitOperator.IsFloat(minValue)) fixMin=parseInt((minValue-0.5).toFixed(0))*splitItem.FixInterval;
        if (data.Min == 0) fixMin = 0;  //最小值是0 不用调整了.
        if (fixMin < 0 && data.Min > 0) fixMin = 0;   //都是正数的, 最小值最小调整为0

        var count = 0;
        for (var i = fixMin; (i - fixMax) < 0.00000001; i += splitItem.FixInterval) 
        {
            ++count;
        }

        data.Interval = splitItem.FixInterval;
        data.Max = fixMax;
        data.Min = fixMin;
        data.Count = count;

        return true;
    }
}

function FrameSplitKLineX() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText = true;                 //是否显示坐标信息
    this.MinDistance = 12;                //刻度间隔
    this.Period;                          //周期
    this.Symbol;                          //股票代码
    this.MinTextDistance = 50;

    this.SplitDateTime = function ()   //根据时间分割
    {
        this.Frame.VerticalInfo = [];
        var itemWidth = this.Frame.DistanceWidth + this.Frame.DataWidth;
        var xOffset = this.Frame.Data.DataOffset;
        var xPointCount = this.Frame.XPointCount;
        var lastYear = null, lastMonth = null;
        var textDistance = 0;

        for (var i = 0, index = xOffset; i < xPointCount && index < this.Frame.Data.Data.length; ++i, ++index) 
        {
            textDistance += itemWidth;
            var infoData = null;
            if (i == 0) 
            {
                var date = IFrameSplitOperator.FormatDateString(this.Frame.Data.Data[index].Date, 'MM-DD');
                infoData = { Value: index - xOffset, Text: date };
            }
            else if (textDistance > this.MinTextDistance) 
            {
                var time = IFrameSplitOperator.FormatTimeString(this.Frame.Data.Data[index].Time);
                infoData = { Value: index - xOffset, Text: time };
            }

            if (infoData) 
            {
                var info = new CoordinateInfo();
                info.Value = infoData.Value;
                if (this.ShowText) info.Message[0] = infoData.Text;
                if (info.Value==0) info.LineType=-1;    //第1个分割线不画
                this.Frame.VerticalInfo.push(info);
                textDistance = 0;
                if (i == 0) textDistance = -(this.MinTextDistance / 2);
            }
        }
    }

    this.SplitSecond = function ()   //根据时间分割
    {
        this.Frame.VerticalInfo = [];
        var itemWidth = this.Frame.DistanceWidth + this.Frame.DataWidth;
        var xOffset = this.Frame.Data.DataOffset;
        var xPointCount = this.Frame.XPointCount;
        var lastYear = null, lastMonth = null;
        var textDistance = 0;

        for (var i = 0, index = xOffset; i < xPointCount && index < this.Frame.Data.Data.length; ++i, ++index) 
        {
            textDistance += itemWidth;
            var infoData = null;
            if (i == 0) 
            {
                var date = IFrameSplitOperator.FormatDateString(this.Frame.Data.Data[index].Date, 'MM-DD');
                infoData = { Value: index - xOffset, Text: date };
            }
            else if (textDistance > this.MinTextDistance) 
            {
                var time = IFrameSplitOperator.FormatTimeString(this.Frame.Data.Data[index].Time,"HH:MM:SS");
                infoData = { Value: index - xOffset, Text: time };
            }

            if (infoData) 
            {
                var info = new CoordinateInfo();
                info.Value = infoData.Value;
                if (this.ShowText) info.Message[0] = infoData.Text;
                this.Frame.VerticalInfo.push(info);
                textDistance = 0;
                if (i == 0) textDistance = -(this.MinTextDistance / 2);
            }
        }
    }

    this.SplitDate = function ()   //根据日期分割
    {
        this.Frame.VerticalInfo = [];
        var xOffset = this.Frame.Data.DataOffset;
        var xPointCount = this.Frame.XPointCount;
        var lastYear = null, lastMonth = null;
        var monthCount=0;

        for (var i = 0, index = xOffset, distance = this.MinDistance; i < xPointCount && index < this.Frame.Data.Data.length; ++i, ++index) 
        {
            var year = parseInt(this.Frame.Data.Data[index].Date / 10000);
            var month = parseInt(this.Frame.Data.Data[index].Date / 100) % 100;
            if (lastMonth != month) ++monthCount;

            if ((distance < this.MinDistance && lastYear == year) ||
                (lastYear != null && lastYear == year && lastMonth != null && lastMonth == month)) 
            {
                lastMonth = month;
                ++distance;
                continue;
            }

            var info = new CoordinateInfo();
            info.Value = index - xOffset;
            //info.TextColor = "rgb(51,51,51)";
            var text;
            if (lastYear == null || lastYear != year) 
            {
                text = year.toString();
            }
            else if (lastMonth == null || lastMonth != month) 
            {
                text = month.toString() + "月";
            }

            lastYear = year;
            lastMonth = month;

            if (this.ShowText)  info.Message[0] = text;
            if (info.Value==0) info.LineType=-1;    //第1个分割线不画

            this.Frame.VerticalInfo.push(info);
            distance = 0;
        }

        if (this.Period == 0 && monthCount <= 2)
            this.SplitShortDate();
    }

    //分隔在2个月一下的格式
    this.SplitShortDate = function () 
    {
        this.Frame.VerticalInfo = [];
        var xOffset = this.Frame.Data.DataOffset;
        var xPointCount = this.Frame.XPointCount;
        var minDistance = 12;
        var isFirstYear = true;
        for (var i = 0, index = xOffset, distance = minDistance; i < xPointCount && index < this.Frame.Data.Data.length; ++i, ++index) 
        {
            var year = parseInt(this.Frame.Data.Data[index].Date / 10000);
            //var month=parseInt(this.Frame.Data.Data[index].Date/100)%100;
            //var day=parseInt(this.Frame.Data.Data[index].Date%100);

            if (distance < minDistance) 
            {
                ++distance;
                continue;
            }

            var info = new CoordinateInfo();
            info.Value = index - xOffset;
            var text;
            if (isFirstYear) 
            {
                text = year.toString();
                isFirstYear = false;
            }
            else 
            {
                text = IFrameSplitOperator.FormatDateString(this.Frame.Data.Data[index].Date, 'MM-DD');
            }

            if (this.ShowText)  info.Message[0] = text;
            if (info.Value==0) info.LineType=-1;    //第1个分割线不画

            this.Frame.VerticalInfo.push(info);
            distance = 0;
        }

        if (this.Frame.VerticalInfo.length==1)  //只有1个刻度, 就显示年+月
        {
            var item=this.Frame.VerticalInfo[0];
            var index=item.Value+xOffset;
            var kitem=this.Frame.Data.Data[index];
            var text=IFrameSplitOperator.FormatDateString(kitem.Date,'YYYY-MM');
            if (this.ShowText) item.Message[0]=text;
        }
    }

    this.Operator = function () 
    {
        if (this.Frame.Data == null) return;
        if (FrameSplitKLineX.SplitCustom) FrameSplitKLineX.SplitCustom(this);   //自定义分割
        else if (ChartData.IsMinutePeriod(this.Period, true)) this.SplitDateTime();
        else if (ChartData.IsSecondPeriod(this.Period)) this.SplitSecond();
        else this.SplitDate();
    }

    this.CreateCoordinateInfo=function()
    {
        return new CoordinateInfo();    //创建一个节点坐标
    }
}

//FrameSplitKLineX.SplitCustom=function(split) { }

function FrameSplitMinutePriceY() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.High = null;                 //最高最低价
    this.Low = null;

    this.YClose;                        //昨收
    this.Data;                          //分钟数据
    this.AverageData;                   //分钟均线数据
    this.OverlayChartPaint;
    this.SplitCount = 7;
    this.Symbol;
    this.SplitType=0;                   //0=默认根据最大最小值分割 1=涨跌停分割 2=数据最大最大值分割
    this.DefaultSplitType=0;
    this.LimitPrice;                    //{Max: Min:} 涨跌停价
    this.Custom;

    this.Operator = function () 
    {
        this.Frame.HorizontalInfo = [];
        this.Frame.CustomHorizontalInfo = [];
        if (!this.Data) return;

        var range=this.GetMaxMin();

        if (this.Symbol && MARKET_SUFFIX_NAME.IsUSA(this.Symbol.toUpperCase()))
        {
            this.USASplit(range);
        }
        else if (this.SplitType==2)
        {
            this.USASplit(range);
        }
        else
        {
            this.DefaultSplit(range);
        }

        this.CustomCoordinate();

        if (this.GetEventCallback)
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_SPLIT_YCOORDINATE);
            if (event && event.Callback)
            {
                var data={ID:this.Frame.Identify, Frame:this.Frame };
                event.Callback(event,data,this);
            }
        }
    }

    this.GetMaxMin = function ()   //计算图中所有的数据的最大最小值
    {
        var max = this.YClose;
        var min = this.YClose;

        for (var i in this.Data.Data) 
        {
            if (!this.Data.Data[i]) continue;   //价格必须大于0
            if (max < this.Data.Data[i]) max = this.Data.Data[i];
            if (min > this.Data.Data[i]) min = this.Data.Data[i];
        }

        if (this.AverageData) 
        {
            for (var i in this.AverageData.Data) 
            {
                if (!this.AverageData.Data[i]) continue;    //价格必须大于0
                if (max < this.AverageData.Data[i]) max = this.AverageData.Data[i];
                if (min > this.AverageData.Data[i]) min = this.AverageData.Data[i];
            }
        }

        if (this.OverlayChartPaint && this.OverlayChartPaint.length > 0 && this.OverlayChartPaint[0] && this.OverlayChartPaint[0].Symbol) 
        {
            var range = this.OverlayChartPaint[0].GetMaxMin();
            if (range.Max && range.Max > max) max = range.Max;
            if (range.Min && range.Min < min) min = range.Min;
        }

        if (this.SplitType==1 && this.LimitPrice)
        {
            if (max<this.LimitPrice.Max) max=this.LimitPrice.Max;
            if (min>this.LimitPrice.Min) min=this.LimitPrice.Min;
        }

        if (IFrameSplitOperator.IsNumber(this.High) && IFrameSplitOperator.IsNumber(this.Low)) 
        {
            if (max < this.High) max = this.High;
            if (min > this.Low) min = this.Low;
        }

        return { Max: max, Min: min };
    }

    this.USASplit=function(range)
    {
        var max=range.Max;
        var min=range.Min;

        if (max==min)
        {
            max=max+max*0.1;
            min=min-min*0.1;
        }
        else
        {
            var height=this.Frame.ChartBorder.GetHeight();   //画布的高度
            var spacePrice=5*(max-min)/height;
            max+=spacePrice;
            min-=spacePrice;
            if (min<0) min=range.Min;
        }

        var showCount=this.SplitCount;
        var distance=(max-min)/(showCount-1);
        const minDistance=[1, 0.1, 0.01, 0.001, 0.0001];
        var defaultfloatPrecision=JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        if (distance<minDistance[defaultfloatPrecision]) 
        {
            distance=minDistance[defaultfloatPrecision];
            max=min+distance*showCount;
            //min=this.YClose-(distance*(showCount-1)/2);
        }

        for(var i=0;i<showCount;++i)
        {
            var price=min+(distance*i);
            if (this.YClose && price==this.YClose) continue;
            var coordinate=new CoordinateInfo();
            coordinate.Value=price;
            var strPrice=price.toFixed(defaultfloatPrecision);  //价格刻度字符串
            if (this.IsShowLeftText) coordinate.Message[0]=strPrice;

            if (this.YClose)
            {
                var per=(price/this.YClose-1)*100;
                if (per>0) coordinate.TextColor=g_JSChartResource.UpTextColor;
                else if (per<0) coordinate.TextColor=g_JSChartResource.DownTextColor;
                if (this.IsShowRightText) 
                {
                    if (this.RightTextFormat==1) coordinate.Message[1]=strPrice;
                    else coordinate.Message[1]=IFrameSplitOperator.FormatValueString(per,2)+'%'; //百分比
                }
            }

            this.Frame.HorizontalInfo.push(coordinate);
        }

        if (this.YClose>min && this.YClose<max) //前收盘线
        {
            var coordinate=new CoordinateInfo();
            coordinate.Value=this.YClose;
            coordinate.LineType=2;//中间的线画虚线
            if (g_JSChartResource.FrameDotSplitPen) coordinate.LineColor=g_JSChartResource.FrameDotSplitPen;

            var strPrice=this.YClose.toFixed(defaultfloatPrecision);  //价格刻度字符串
            if (this.IsShowLeftText) coordinate.Message[0]=strPrice;

            if (this.IsShowRightText) 
            {
                if (this.RightTextFormat==1) coordinate.Message[1]=strPrice;
                else coordinate.Message[1]='0.00%'; //百分比
            }

            this.Frame.HorizontalInfo.push(coordinate);
        }

        this.Frame.HorizontalInfo.sort(function(a,b) { return a.Value-b.Value; });

        this.Frame.HorizontalMax=max;
        this.Frame.HorizontalMin=min;
    }

    this.DefaultSplit = function (range)
    {
        var max = range.Max;
        var min = range.Min;

        if (this.YClose == max && this.YClose == min) 
        {
            max = this.YClose + this.YClose * 0.1;
            min = this.YClose - this.YClose * 0.1;
        }
        else 
        {
            var distanceValue = Math.max(Math.abs(this.YClose - max), Math.abs(this.YClose - min));
            max = this.YClose + distanceValue;
            min = this.YClose - distanceValue;
            if (min<0) min=range.Min;
        }

        var showCount = this.SplitCount;
        var distance = (max - min) / (showCount - 1);
        const minDistance = [1, 0.1, 0.01, 0.001, 0.0001];
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);;    //默认小数位数
        if (JSCommonCoordinateData.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol)) defaultfloatPrecision = 0;    //手机端指数不显示小数位数,太长了

        if (distance < minDistance[defaultfloatPrecision]) 
        {
            distance = minDistance[defaultfloatPrecision];
            max = this.YClose + (distance * (showCount - 1) / 2);
            min = this.YClose - (distance * (showCount - 1) / 2);
        }

        for (var i = 0; i < showCount; ++i) 
        {
            var price = min + (distance * i);
            this.Frame.HorizontalInfo[i] = new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value = price;

            this.Frame.HorizontalInfo[i].Message[0] = price.toFixed(defaultfloatPrecision);

            if (this.YClose)
             {
                var per = (price / this.YClose - 1) * 100;
                if (per > 0) this.Frame.HorizontalInfo[i].TextColor = g_JSChartResource.UpTextColor;
                else if (per < 0) this.Frame.HorizontalInfo[i].TextColor = g_JSChartResource.DownTextColor;
                this.Frame.HorizontalInfo[i].Message[1] = IFrameSplitOperator.FormatValueString(per, 2) + '%'; //百分比
            }
        }

        this.Frame.HorizontalMax = max;
        this.Frame.HorizontalMin = min;
    }

    this.CustomCoordinate = function ()    //自定义刻度
    {
        if (!this.Custom) return;

        for (var i in this.Custom) 
        {
            var item = this.Custom[i];
            if (item.Type == 1) 
                this.CustomFixedCoordinate(item);
            else if (item.Type==0)
            {
                var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
                var latestItem = this.GetLatestPrice(defaultfloatPrecision, item);
                if (latestItem) this.Frame.CustomHorizontalInfo.push(latestItem);
            }
        }
    }

    this.GetLatestPrice = function (floatPrecision, option) 
    {
        if (!this.Data || !this.Data.Data) return null;
        if (this.Data.Data.length <= 0) return null;
        var price = this.Data.Data[this.Data.Data.length - 1];
        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(this.YClose)) return null;

        var info = new CoordinateInfo();
        info.Type = 0;
        info.Value = price;
        info.TextColor = g_JSChartResource.FrameLatestPrice.TextColor;
        info.LineType = 2;    //虚线
        if (option.Position == 'left') info.Message[0] = price.toFixed(floatPrecision);
        else info.Message[1] = price.toFixed(floatPrecision);
        if (price > this.YClose) info.LineColor = g_JSChartResource.FrameLatestPrice.UpBarColor;
        else if (price < this.YClose) info.LineColor = g_JSChartResource.FrameLatestPrice.DownBarColor;
        else info.LineColor = g_JSChartResource.FrameLatestPrice.UnchagneBarColor;

        if (IFrameSplitOperator.IsNumber(option.LineType)) info.LineType=option.LineType;
        if (option.IsShowLine == false) info.LineType = -1;

        return info;
    }

    this.CustomFixedCoordinate = function (option)    //固定坐标刻度
    {
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        for (var i in option.Data) 
        {
            var item = option.Data[i];
            var info = new CoordinateInfo();
            info.Type = 1;
            info.TextColor = item.TextColor;
            info.LineColor = item.Color;
            info.LineType = 2;    //虚线
            if (IFrameSplitOperator.IsNumber(option.LineType)) info.LineType=option.LineType;
            if (option.IsShowLine == false) info.LineType = -1;

            if (IFrameSplitOperator.IsNumber(item.Increase)) //涨幅计算价格
            {
                if (!IFrameSplitOperator.IsNumber(this.YClose)) continue;
                info.Value = this.YClose * (1 + item.Increase);
            }
            else 
            {
                info.Value = item.Value;
            }

            var text;
            if (item.Text) text = item.Text;
            else text = info.Value.toFixed(defaultfloatPrecision);
            if (option.Position == 'left') info.Message[0] = text;
            else info.Message[1] = text;

            this.Frame.CustomHorizontalInfo.push(info);
        }
    }

}

function FrameSplitMinuteX() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText = true;                 //是否显示坐标信息
    this.Symbol = null;                   //股票代码 x轴刻度根据股票类型来调整
    this.DayCount = 1;
    this.DayData;

    this.Operator = function () 
    {
        this.Frame.VerticalInfo = [];
        var xPointCount = this.Frame.XPointCount;
        var width = this.Frame.ChartBorder.GetWidth();
        var isHScreen = (this.Frame.IsHScreen === true);
        if (isHScreen) width = this.Frame.ChartBorder.GetHeight();

        const minuteCoordinate = JSCommonCoordinateData.MinuteCoordinateData;
        var xcoordinateData = minuteCoordinate.GetCoordinateData(this.Symbol, width);
        var minuteCount = xcoordinateData.Count;
        var minuteMiddleCount = xcoordinateData.MiddleCount > 0 ? xcoordinateData.MiddleCount : parseInt(minuteCount / 2);;

        var xcoordinate = xcoordinateData.Data;
        this.Frame.XPointCount = 243;

        this.Frame.XPointCount = minuteCount * this.DayCount;
        this.Frame.MinuteCount = minuteCount;
        this.Frame.VerticalInfo = [];

        if (this.DayCount <= 1) 
        {
            for (var i in xcoordinate) 
            {
                var info = new CoordinateInfo();
                //info.TextColor = "rgb(51,51,51)";
                info.Value = xcoordinate[i][0];
                if (this.ShowText)
                    info.Message[0] = xcoordinate[i][3];
                this.Frame.VerticalInfo[i] = info;
            }
        }
        else 
        {
            for (var i = this.DayData.length - 1, j = 0; i >= 0; --i, ++j) 
            {
                var info = new CoordinateInfo();
                info.Value = j * minuteCount + minuteMiddleCount;
                info.LineType = -1;
                if (this.ShowText) info.Message[0] = IFrameSplitOperator.FormatDateString(this.DayData[i].Date, 'MM-DD');
                this.Frame.VerticalInfo.push(info);

                var info = new CoordinateInfo();
                info.Value = (j + 1) * minuteCount;
                this.Frame.VerticalInfo.push(info);
            }
        }
    }
}

function FrameSplitXData() 
{
    this.newMethod = IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText = true;                 //是否显示坐标信息

    this.Operator = function () 
    {
        if (this.Frame.Data == null || this.Frame.XData == null) return;
        this.Frame.VerticalInfo = [];
        var xOffset = this.Frame.Data.DataOffset;
        var xPointCount = this.Frame.XPointCount;

        for (var i = 0, index = xOffset; i < xPointCount && index < this.Frame.Data.Data.length; ++i, ++index) 
        {
            var info = new CoordinateInfo();
            info.Value = index - xOffset;

            if (this.ShowText)
                info.Message[0] = this.Frame.XData[i];

            this.Frame.VerticalInfo.push(info);
        }
    }
}

//深度图X轴价格信息
function FrameSplitXDepth()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息
    this.SplitCount=3;
    this.Symbol;
    this.LineType=3;

    this.Operator=function()
    {
        var xRange=this.Frame.VerticalRange;
        if (!xRange) return;
        this.Frame.VerticalInfo=[];

        var floatPrecision=2;
        if (this.Symbol) floatPrecision=JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        var xMax=xRange.Max;
        var xMin=xRange.Min;
        if (xRange.Bid)
        {
            var interval=(xRange.Bid.Max-xMin)/this.SplitCount;
            for(var i=0;i<this.SplitCount;++i)
            {
                var info= new CoordinateInfo();
                info.Value=xMin+(interval*i);
                if (info.Value<=0) continue;
                if (IFrameSplitOperator.IsNumber(this.LineType)) info.LineType=this.LineType;
                if (this.ShowText) info.Message[0]=info.Value.toFixed(floatPrecision);
                this.Frame.VerticalInfo.push(info);
            }
        }

        var info=new CoordinateInfo();
        info.Value=xRange.Center;
        this.Frame.VerticalInfo.push(info);

        if (xRange.Ask)
        {
            var interval=(xMax-xRange.Ask.Min)/this.SplitCount;
            for(var i=1;i<=this.SplitCount;++i)
            {
                var info= new CoordinateInfo();
                info.Value=xRange.Ask.Min+(interval*i);
                if (IFrameSplitOperator.IsNumber(this.LineType)) info.LineType=this.LineType;
                if (this.ShowText) info.Message[0]=info.Value.toFixed(floatPrecision);
                this.Frame.VerticalInfo.push(info);
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  数据分割
//  [0]=Start起始 [1]=End结束 [2]=FixInterval修正的间隔 [3]=Increase
//
function SplitData() {
    this.Data = [
        [0.000001, 0.000002, 0.000001, 0.0000001],
        [0.000002, 0.000004, 0.000002, 0.0000002],
        [0.000004, 0.000005, 0.000004, 0.0000001],
        [0.000005, 0.00001, 0.000005, 0.0000005],

        [0.00001, 0.00002, 0.00001, 0.000001],
        [0.00002, 0.00004, 0.00002, 0.000002],
        [0.00004, 0.00005, 0.00004, 0.000001],
        [0.00005, 0.0001, 0.00005, 0.000005],

        [0.0001, 0.0002, 0.0001, 0.00001],
        [0.0002, 0.0004, 0.0002, 0.00002],
        [0.0004, 0.0005, 0.0004, 0.00001],
        [0.0005, 0.001, 0.0005, 0.00005],

        [0.001, 0.002, 0.001, 0.0001],
        [0.002, 0.004, 0.002, 0.0002],
        [0.004, 0.005, 0.004, 0.0001],
        [0.005, 0.01, 0.005, 0.0005],

        [0.01, 0.02, 0.01, 0.001],
        [0.02, 0.04, 0.02, 0.002],
        [0.04, 0.05, 0.04, 0.001],
        [0.05, 0.1, 0.05, 0.005],

        [0.1, 0.2, 0.1, 0.01],
        [0.2, 0.4, 0.2, 0.02],
        [0.4, 0.5, 0.4, 0.01],
        [0.5, 1, 0.5, 0.05],

        [1, 2, 1, 0.05],
        [2, 4, 2, 0.05],
        [4, 5, 4, 0.05],
        [5, 10, 5, 0.05],

        [10, 20, 10, 2],
        [20, 40, 20, 5],
        [40, 50, 40, 2],
        [50, 100, 50, 10],

        [100, 200, 100, 10],
        [200, 400, 200, 20],
        [400, 500, 400, 10],
        [500, 1000, 500, 50],

        [1000, 2000, 1000, 50],
        [2000, 4000, 2000, 50],
        [4000, 5000, 4000, 50],
        [5000, 10000, 5000, 100],

        [10000, 20000, 10000, 1000],
        [20000, 40000, 20000, 2000],
        [40000, 50000, 40000, 1000],
        [50000, 100000, 50000, 5000],

        [100000, 200000, 100000, 10000],
        [200000, 400000, 200000, 20000],
        [400000, 500000, 400000, 10000],
        [500000, 1000000, 500000, 50000],

        [1000000, 2000000, 1000000, 100000],
        [2000000, 4000000, 2000000, 200000],
        [4000000, 5000000, 4000000, 100000],
        [5000000, 10000000, 5000000, 500000],

        [10000000, 20000000, 10000000, 1000000],
        [20000000, 40000000, 20000000, 2000000],
        [40000000, 50000000, 40000000, 1000000],
        [50000000, 100000000, 50000000, 5000000],

        [100000000, 200000000, 100000000, 10000000],
        [200000000, 400000000, 100000000, 10000000],
        [400000000, 500000000, 100000000, 10000000],
        [500000000, 1000000000, 100000000, 10000000],

        [1000000000, 2000000000, 1000000000, 100000000],
        [2000000000, 4000000000, 2000000000, 200000000],
        [4000000000, 5000000000, 4000000000, 100000000],
        [5000000000, 10000000000, 5000000000, 500000000],
    ];

    this.Find = function (interval) {
        for (var i in this.Data) {
            var item = this.Data[i];
            if (interval > item[0] && interval <= item[1]) {
                var result = {};
                result.FixInterval = item[2];
                result.Increase = item[3];
                return result;
            }
        }

        return null;
    }
}

function PriceSplitData() {
    this.newMethod = SplitData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Data = [
        [0.000001, 0.000002, 0.000001, 0.0000001],
        [0.000002, 0.000004, 0.000002, 0.0000002],
        [0.000004, 0.000005, 0.000004, 0.0000001],
        [0.000005, 0.00001, 0.000005, 0.0000005],

        [0.00001, 0.00002, 0.00001, 0.000001],
        [0.00002, 0.00004, 0.00002, 0.000002],
        [0.00004, 0.00005, 0.00004, 0.000001],
        [0.00005, 0.0001, 0.00005, 0.000005],

        [0.0001, 0.0002, 0.0001, 0.00001],
        [0.0002, 0.0004, 0.0002, 0.00002],
        [0.0004, 0.0005, 0.0004, 0.00001],
        [0.0005, 0.001, 0.0005, 0.00005],

        [0.001, 0.002, 0.001, 0.0001],
        [0.002, 0.004, 0.002, 0.0002],
        [0.004, 0.005, 0.004, 0.0001],
        [0.005, 0.01, 0.005, 0.0005],

        [0.01, 0.02, 0.01, 0.001],
        [0.02, 0.04, 0.02, 0.002],
        [0.04, 0.05, 0.04, 0.001],
        [0.05, 0.1, 0.05, 0.005],

        [0.1, 0.2, 0.1, 0.01],
        [0.2, 0.4, 0.2, 0.02],
        [0.4, 0.5, 0.2, 0.01],
        [0.5, 0.8, 0.2, 0.05],
        [0.8, 1, 0.5, 0.05],

        [1, 2, 0.5, 0.05],
        [2, 4, 0.5, 0.05],
        [4, 5, 0.5, 0.05],
        [5, 10, 0.5, 0.05],

        [10, 12, 10, 2],
        [20, 40, 20, 5],
        [40, 50, 40, 2],
        [50, 100, 50, 10],

        [100, 200, 100, 10],
        [200, 400, 200, 20],
        [400, 500, 400, 10],
        [500, 1000, 500, 50],

        [1000, 2000, 1000, 50],
        [2000, 4000, 2000, 50],
        [4000, 5000, 4000, 50],
        [5000, 10000, 5000, 100],

        [10000, 20000, 10000, 1000],
        [20000, 40000, 20000, 2000],
        [40000, 50000, 40000, 1000],
        [50000, 100000, 50000, 5000],

        [100000, 200000, 100000, 10000],
        [200000, 400000, 200000, 20000],
        [400000, 500000, 400000, 10000],
        [500000, 1000000, 500000, 50000],

        [1000000, 2000000, 1000000, 100000],
        [2000000, 4000000, 2000000, 200000],
        [4000000, 5000000, 4000000, 100000],
        [5000000, 10000000, 5000000, 500000],

        [10000000, 20000000, 10000000, 1000000],
        [20000000, 40000000, 20000000, 2000000],
        [40000000, 50000000, 40000000, 1000000],
        [50000000, 100000000, 50000000, 5000000],

        [100000000, 200000000, 100000000, 10000000],
        [200000000, 400000000, 200000000, 20000000],
        [400000000, 500000000, 400000000, 10000000],
        [500000000, 1000000000, 500000000, 50000000],

        [1000000000, 2000000000, 1000000000, 100000000],
        [2000000000, 4000000000, 2000000000, 200000000],
        [4000000000, 5000000000, 4000000000, 100000000],
        [5000000000, 10000000000, 5000000000, 500000000],
    ];
}

//整数分割
function IntegerSplitData() {
    this.newMethod = SplitData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Data =
        [
            [0.000001, 0.000002, 0.000001, 0.0000001],
            [0.000002, 0.000004, 0.000002, 0.0000002],
            [0.000004, 0.000005, 0.000004, 0.0000001],
            [0.000005, 0.00001, 0.000005, 0.0000005],

            [0.00001, 0.00002, 0.00001, 0.000001],
            [0.00002, 0.00004, 0.00002, 0.000002],
            [0.00004, 0.00005, 0.00004, 0.000001],
            [0.00005, 0.0001, 0.00005, 0.000005],

            [0.0001, 0.0002, 0.0001, 0.00001],
            [0.0002, 0.0004, 0.0002, 0.00002],
            [0.0004, 0.0005, 0.0004, 0.00001],
            [0.0005, 0.001, 0.0005, 0.00005],

            [0.001, 0.002, 0.001, 0.0001],
            [0.002, 0.004, 0.002, 0.0002],
            [0.004, 0.005, 0.004, 0.0001],
            [0.005, 0.01, 0.005, 0.0005],

            [0.01, 0.02, 0.01, 0.001],
            [0.02, 0.04, 0.02, 0.002],
            [0.04, 0.05, 0.04, 0.001],
            [0.05, 0.1, 0.05, 0.005],

            [0.1, 0.2, 1, 1],
            [0.2, 0.4, 1, 1],
            [0.4, 0.5, 1, 1],
            [0.5, 0.8, 1, 1],
            [0.8, 1, 1, 1],

            [1, 2, 1, 1],
            [2, 4, 2, 1],
            [4, 5, 4, 1],
            [5, 10, 5, 1],

            [10, 12, 10, 2],
            [20, 40, 20, 5],
            [40, 50, 40, 2],
            [50, 100, 50, 10],

            [100, 200, 100, 10],
            [200, 400, 200, 20],
            [400, 500, 400, 10],
            [500, 1000, 500, 50],

            [1000, 2000, 1000, 50],
            [2000, 4000, 2000, 50],
            [4000, 5000, 4000, 50],
            [5000, 10000, 5000, 100],

            [10000, 20000, 10000, 1000],
            [20000, 40000, 20000, 2000],
            [40000, 50000, 40000, 1000],
            [50000, 100000, 50000, 5000],

            [100000, 200000, 100000, 10000],
            [200000, 400000, 200000, 20000],
            [400000, 500000, 400000, 10000],
            [500000, 1000000, 500000, 50000],

            [1000000, 2000000, 1000000, 100000],
            [2000000, 4000000, 2000000, 200000],
            [4000000, 5000000, 4000000, 100000],
            [5000000, 10000000, 5000000, 500000],

            [10000000, 20000000, 10000000, 1000000],
            [20000000, 40000000, 20000000, 2000000],
            [40000000, 50000000, 40000000, 1000000],
            [50000000, 100000000, 50000000, 5000000],

            [100000000, 200000000, 100000000, 10000000],
            [200000000, 400000000, 200000000, 20000000],
            [400000000, 500000000, 400000000, 10000000],
            [500000000, 1000000000, 500000000, 50000000],

            [1000000000, 2000000000, 1000000000, 100000000],
            [2000000000, 4000000000, 2000000000, 200000000],
            [4000000000, 5000000000, 4000000000, 100000000],
            [5000000000, 10000000000, 5000000000, 500000000],
        ];
}


/////////////////////////////////////////////////////////////////////////////////
//
function IChangeStringFormat() {
    this.Data;
    this.Value;     //数据
    this.Text;      //输出字符串
  
    this.Operator = function () {
      return false;
    }
  }
  
  
function HQPriceStringFormat() 
{
    this.newMethod = IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Symbol;
    this.FrameID;
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.PercentageText;    //百分比
    this.RValue;            //右边值
    this.RText;

    this.PriceFormatType=0; //主窗口格式    0=默认 1=科学计数
    this.DataFormatType=0;  //副图指标格式   0=默认 1=科学计数

    this.Operator = function () 
    {
        this.RText = null;
        if (IFrameSplitOperator.IsString(this.RValue)) this.RText = this.RValue;
        if (!this.Value) return false;

        var defaultfloatPrecision = 2;     //价格小数位数 
        if (this.FrameID == 0)    //第1个窗口显示原始价格
        {
            var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);

            if (this.PriceFormatType==1)
                this.Text=IFrameSplitOperator.FormatValueThousandsString(this.Value,defaultfloatPrecision);
            else
                this.Text = this.Value.toFixed(defaultfloatPrecision);
        }
        else 
        {
            if (this.DataFormatType==1)
                this.Text=IFrameSplitOperator.FormatValueThousandsString(this.Value,defaultfloatPrecision);
            else
                this.Text = IFrameSplitOperator.FormatValueString(this.Value, defaultfloatPrecision, this.LanguageID);
        }

        return true;
    }
}
  
function HQDateStringFormat() 
{
    this.newMethod = IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DateFormatType=0;  //0=YYYY-MM-DD 1=YYYY/MM/DD  2=YYYY/MM/DD/W 3=DD/MM/YYYY
    this.LanguageID=0;

    this.Operator = function () 
    {
        if (!IFrameSplitOperator.IsNumber(this.Value) || this.Value<0) return false;
        if (!this.Data) return false;

        var index = this.Value;
        index = parseInt(index.toFixed(0));
        if (this.Data.DataOffset + index >= this.Data.Data.length) return false;

        var currentData = this.Data.Data[this.Data.DataOffset + index];
        var date = currentData.Date;
        var dateFormatString="YYYY-MM-DD";
        if (this.DateFormatType==1) dateFormatString="YYYY/MM/DD";
        else if (this.DateFormatType==2) dateFormatString="YYYY/MM/DD/W";
        else if (this.DateFormatType==3) dateFormatString="DD/MM/YYYY";
        this.Text = IFrameSplitOperator.FormatDateString(date,dateFormatString,this.LanguageID);
        if (ChartData.IsMinutePeriod(this.Data.Period, true)) // 分钟周期
        {
            var time = IFrameSplitOperator.FormatTimeString(currentData.Time);
            this.Text = this.Text + " " + time;
        }
        else if (ChartData.IsSecondPeriod(this.Data.Period))
        {
            var time = IFrameSplitOperator.FormatTimeString(currentData.Time,"HH:MM:SS");
            this.Text = this.Text + " " + time;
        }

        return true;
    }
}
  
  function HQMinuteTimeStringFormat() 
  {
      this.newMethod = IChangeStringFormat;   //派生
      this.newMethod();
      delete this.newMethod;
  
      this.Frame;
      this.Symbol;
  
      this.Operator = function () 
      {
          if (this.Value == null || isNaN(this.Value)) return false;
  
          var index = Math.abs(this.Value);
          index = parseInt(index.toFixed(0));
          var showIndex = index;
          if (this.Frame && this.Frame.MinuteCount) showIndex = index % this.Frame.MinuteCount;
  
          var timeStringData = JSCommonCoordinateData.MinuteTimeStringData;
          var timeData = timeStringData.GetTimeData(this.Symbol);
          if (!timeData) return false;
  
          if (showIndex < 0) showIndex = 0;
          else if (showIndex > timeData.length) showIndex = timeData.length - 1;
          if (this.Frame && index >= this.Frame.XPointCount)
          showIndex = timeData.length - 1;
  
          var time = timeData[showIndex];
          this.Text = IFrameSplitOperator.FormatTimeString(time);
          return true;
      }
  }
  
  function DivTooltipDataForamt()
  {
      this.DataMap=new Map(
          [
              ["CorssCursor_XStringFormat", { Create:function() { return new HQDateStringFormat(); } }],
              ["CorssCursor_YStringFormat", { Create:function() { return new HQPriceStringFormat(); } }]
          ]
      );
  
      this.Create=function(name)
      {
          if (!this.DataMap.has(name)) return null;
          var item=this.DataMap.get(name);
          return item.Create();
      }
  }
  
  var g_DivTooltipDataForamt=new DivTooltipDataForamt();


//导出统一使用JSCommon命名空间名
export
{
    CoordinateInfo,
    IFrameSplitOperator,
    FrameSplitKLinePriceY,
    FrameSplitY,
    FrameSplitKLineX,
    FrameSplitMinutePriceY,
    FrameSplitMinuteX,
    FrameSplitXData,
    SplitData,
    PriceSplitData,
    FrameSplitXDepth,

    IChangeStringFormat,
    HQPriceStringFormat,
    HQDateStringFormat,
    HQMinuteTimeStringFormat,
    g_DivTooltipDataForamt,
}
/*
module.exports =
{
    JSCommonSplit: 
    {
        CoordinateInfo: CoordinateInfo,
        IFrameSplitOperator: IFrameSplitOperator,
        FrameSplitKLinePriceY: FrameSplitKLinePriceY,
        FrameSplitY: FrameSplitY,
        FrameSplitKLineX: FrameSplitKLineX,
        FrameSplitMinutePriceY: FrameSplitMinutePriceY,
        FrameSplitMinuteX: FrameSplitMinuteX,
        FrameSplitXData: FrameSplitXData,
        SplitData: SplitData,
        PriceSplitData: PriceSplitData,
        FrameSplitXDepth:FrameSplitXDepth,
        IChangeStringFormat:IChangeStringFormat,
        HQPriceStringFormat:HQPriceStringFormat,
        HQDateStringFormat:HQDateStringFormat,
        HQMinuteTimeStringFormat:HQMinuteTimeStringFormat,
    },

    JSCommonSplit_CoordinateInfo: CoordinateInfo,
    JSCommonSplit_IFrameSplitOperator: IFrameSplitOperator,
    JSCommonSplit_FrameSplitKLinePriceY: FrameSplitKLinePriceY,
    JSCommonSplit_FrameSplitY: FrameSplitY,
    JSCommonSplit_FrameSplitKLineX: FrameSplitKLineX,
    JSCommonSplit_FrameSplitMinutePriceY: FrameSplitMinutePriceY,
    JSCommonSplit_FrameSplitMinuteX: FrameSplitMinuteX,
    JSCommonSplit_FrameSplitXData: FrameSplitXData,
    JSCommonSplit_SplitData: SplitData,
    JSCommonSplit_PriceSplitData: PriceSplitData,
    JSCommonSplit_FrameSplitXDepth:FrameSplitXDepth,

    JSCommonFormat_IChangeStringFormat:IChangeStringFormat,
    JSCommonFormat_HQPriceStringFormat:HQPriceStringFormat,
    JSCommonFormat_HQDateStringFormat:HQDateStringFormat,
    JSCommonFormat_HQMinuteTimeStringFormat:HQMinuteTimeStringFormat,
    JSCommonFormat_Global_DataFormat :g_DivTooltipDataForamt,
};
*/