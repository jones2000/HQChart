/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    图形扩展画法
*/ 

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import 
{
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData,
    JSCommon_Guid as Guid,
    JSCommon_ToFixedPoint as ToFixedPoint,
    JSCommon_ToFixedRect as ToFixedRect,
} from "./umychart.data.wechat.js";

import 
{
    JSCommonCoordinateData as JSCommonCoordinateData,
    JSCommonCoordinateData_MARKET_SUFFIX_NAME as MARKET_SUFFIX_NAME
} from "./umychart.coordinatedata.wechat.js";

import 
{
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
    JSCommonResource_JSCHART_LANGUAGE_ID as JSCHART_LANGUAGE_ID,
    JSCommonResource_Global_JSChartLocalization as g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import 
{
    JSCommonSplit_IFrameSplitOperator as IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

function IExtendChartPainting() 
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.Data;  // = new ChartData();        //数据区
    this.ClassName = 'IExtendChartPainting';
    this.IsDynamic = false;
    this.IsEraseBG = false;               //是否每次画的时候需要擦除K线图背景
    this.IsAnimation=false;
    this.DrawAfterTitle = false;          //是否在动态标题画完以后再画,防止动态标题覆盖

    //上下左右间距
    this.Left = 5;
    this.Right = 5;
    this.Top = 5;
    this.Bottom = 5;

    this.Draw = function () { } //画图接口
    this.SetOption = function (option) { }  //设置参数接口
}

//K线Tooltip, 显示在左边或右边
function KLineTooltipPaint() 
{
    this.newMethod = IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic = true;
    this.IsEraseBG = true;
    this.DrawAfterTitle = true;
    this.ClassName = 'KLineTooltipPaint';

    this.BorderColor = g_JSChartResource.TooltipPaint.BorderColor;    //边框颜色
    this.BGColor = g_JSChartResource.TooltipPaint.BGColor;            //背景色
    this.TitleColor = g_JSChartResource.TooltipPaint.TitleColor;      //标题颜色
    this.Font = [g_JSChartResource.TooltipPaint.TitleFont];

    this.Width = 50;
    this.Height = 100;
    this.LineHeight = 15; //行高

    this.Left = 1;
    this.Top = 0;

    this.HQChart;
    this.KLineTitlePaint;
    this.IsHScreen = false;   //是否横屏
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;

    this.GetLeft = function () 
    {
        if (this.IsHScreen) return this.ChartBorder.GetRightEx() - this.Height - this.Top;
        return this.ChartBorder.GetLeft() + this.Left;
    }

    this.GetTop = function () 
    {
        if (this.IsHScreen) return this.ChartBorder.GetTop();
        return this.ChartBorder.GetTopEx() + this.Top;
    }

    this.Draw = function () 
    {
        if (!this.HQChart || !this.HQChart.TitlePaint || !this.HQChart.TitlePaint[0]) return;
        if (!this.HQChart.IsOnTouch) return;

        this.KLineTitlePaint = this.HQChart.TitlePaint[0];
        var klineData = this.KLineTitlePaint.GetCurrentKLineData();
        if (!klineData) return;

        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol = this.HQChart.Symbol.toUpperCase();
        var isFutures=MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol)?true:false;

        var lineCount = 8;    //显示函数
        if (this.ClassName === 'MinuteTooltipPaint') 
        {
            lineCount=7;
            if (isFutures && IFrameSplitOperator.IsNumber(klineData.Position)) ++lineCount;    //期货多一个持仓量
        }
        else
        {
            if (IFrameSplitOperator.IsNumber(klineData.Time)) ++lineCount;      //分钟K线多一列时间
            if (isFutures && IFrameSplitOperator.IsNumber(klineData.Position)) ++lineCount;   //持仓量
        }

        this.IsHScreen = this.ChartFrame.IsHScreen === true;
        this.Canvas.font = this.Font[0];
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var maxText = ' 擎: 9999.99亿 ';
        if (defaultfloatPrecision >= 5) maxText = ` 擎: ${99.99.toFixed(defaultfloatPrecision)} `;  //小数位数太多了
        this.Width = this.Canvas.measureText(maxText).width;
        this.Height = this.LineHeight * lineCount + 2 * 2;

        this.DrawBG();
        this.DrawTooltipData(klineData);
        this.DrawBorder();
    }

    this.DrawBorder = function () 
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var left = this.GetLeft();
        var top = this.GetTop();
        this.Canvas.strokeStyle = this.BorderColor;
        if (isHScreen)
        { 
            this.Canvas.strokeRect(this.HQChart.ToFixedPoint(left), this.HQChart.ToFixedPoint(top), 
                this.HQChart.ToFixedRect(this.Height), this.HQChart.ToFixedRect(this.Width));
        }
        else 
        {
            this.Canvas.strokeRect(this.HQChart.ToFixedPoint(left), this.HQChart.ToFixedPoint(top), 
                this.HQChart.ToFixedRect(this.Width), this.HQChart.ToFixedRect(this.Height));
        }
    }

    this.DrawBG = function () 
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var left = this.GetLeft();
        var top = this.GetTop();
        this.Canvas.fillStyle = this.BGColor;
        if (isHScreen) this.Canvas.fillRect(left, top, this.Height, this.Width);
        else this.Canvas.fillRect(left, top, this.Width, this.Height);
    }

    this.DrawTooltipData = function (item) 
    {
        //console.log('[KLineTooltipPaint::DrawKLineData] ', item);

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var left = this.GetLeft() + 2;
        var top = this.GetTop() + 3;

        if (this.IsHScreen) 
        {
            this.Canvas.save();
            var x = this.GetLeft() + this.Height, y = this.GetTop();

            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);

            //x, y 作为原点
            left = 2;
            top = 3;
        }

        this.Canvas.textBaseline = "top";
        this.Canvas.textAlign = "left";
        this.Canvas.font = this.Font[0];
        var labelWidth = this.Canvas.measureText('擎: ').width;

        var text = this.HQChart.FormatDateString(item.Date);
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText(text, left, top);
        var period = this.HQChart.Period;
        if (ChartData.IsMinutePeriod(period, true) && item.Time)
        {
            top += this.LineHeight;
            text = this.HQChart.FormatTimeString(item.Time);
            this.Canvas.fillText(text, left, top);
        }
        else if (ChartData.IsSecondPeriod(period) && item.Time)
        {
            top += this.LineHeight;
            text = this.HQChart.FormatTimeString(item.Time,"HH:MM:SS");
            this.Canvas.fillText(text, left, top);
        }
        
        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Open', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var color = this.KLineTitlePaint.GetColor(item.Open, item.YClose);
        text = item.Open.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-High', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var color = this.KLineTitlePaint.GetColor(item.High, item.YClose);
        var text = item.High.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Low', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var color = this.KLineTitlePaint.GetColor(item.Low, item.YClose);
        var text = item.Low.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Close', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var color = this.KLineTitlePaint.GetColor(item.Close, item.YClose);
        var text = item.Close.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Increase', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        if (item.YClose>0)
        {
            var value = (item.Close - item.YClose) / item.YClose * 100;
            var color = this.KLineTitlePaint.GetColor(value, 0);
            var text = value.toFixed(2) + '%';
        }
        else
        {
            var text='--.--';
            var color = this.KLineTitlePaint.GetColor(0, 0);
        }
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        this.Canvas.fillStyle = this.TitleColor;

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Vol', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = this.HQChart.FormatValueString(item.Vol, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Amount',this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = this.HQChart.FormatValueString(item.Amount, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }

        //持仓量
        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol = this.HQChart.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) && IFrameSplitOperator.IsNumber(item.Position)) 
        {
            this.Canvas.fillStyle = this.TitleColor;
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Position', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }

        if (this.IsHScreen) this.Canvas.restore();
    }

    //设置参数接口
    this.SetOption = function (option) 
    {
        if (option.LineHeight > 0) this.LineHeight = option.LineHeight;
        if (option.BGColor) this.BGColor = option.BGColor;
        if (option.LanguageID > 0) this.LanguageID = option.LanguageID;
    }
}

function MinuteTooltipPaint() 
{
    this.newMethod = KLineTooltipPaint;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'MinuteTooltipPaint';

    this.GetTop = function () 
    {
        if (this.IsHScreen) return this.ChartBorder.GetTop();
        return this.ChartBorder.GetTop() + this.Top;
    }

    this.DrawTooltipData = function (item) 
    {
        //console.log('[KLineTooltipPaint::DrawKLineData] ', item);
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var left = this.GetLeft() + 2;
        var top = this.GetTop() + 3;
        this.YClose = this.KLineTitlePaint.YClose;

        if (this.IsHScreen) 
        {
            this.Canvas.save();
            var x = this.GetLeft() + this.Height, y = this.GetTop();

            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);

            //x, y 作为原点
            left = 2;
            top = 3;
        }

        this.Canvas.textBaseline = "top";
        this.Canvas.textAlign = "left";
        this.Canvas.font = this.Font[0];
        var labelWidth = this.Canvas.measureText('擎: ').width;

        var aryDateTime = item.DateTime.split(' ');
        if (aryDateTime && aryDateTime.length == 2)
        {
            var text = this.HQChart.FormatDateString(aryDateTime[0]);
            this.Canvas.fillStyle = this.TitleColor;
            this.Canvas.fillText(text, left, top);

            top += this.LineHeight;
            text = this.HQChart.FormatTimeString(aryDateTime[1]);
            this.Canvas.fillText(text, left, top);
        }

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Price', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var color = this.KLineTitlePaint.GetColor(item.Close, this.YClose);
        text = item.Close.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        if (IFrameSplitOperator.IsNumber(item.AvPrice))
        {
            top += this.LineHeight;
            this.Canvas.fillStyle = this.TitleColor;
            text = g_JSChartLocalization.GetText('Tooltip-AvPrice', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var color = this.KLineTitlePaint.GetColor(item.AvPrice, this.YClose);
            var text = item.AvPrice.toFixed(defaultfloatPrecision);
            this.Canvas.fillStyle = color;
            this.Canvas.fillText(text, left + labelWidth, top);
        }

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        text = g_JSChartLocalization.GetText('Tooltip-Increase', this.LanguageID);
        this.Canvas.fillText(text, left, top);
        var value = (item.Close - this.YClose) / this.YClose * 100;
        var color = this.KLineTitlePaint.GetColor(value, 0);
        var text = value.toFixed(2) + '%';
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            this.Canvas.fillStyle = this.TitleColor;
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Vol', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = this.HQChart.FormatValueString(item.Vol, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }
        
        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Amount', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = this.HQChart.FormatValueString(item.Amount, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }

        //持仓量
        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol = this.HQChart.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) && IFrameSplitOperator.IsNumber(item.Position)) 
        {
            this.Canvas.fillStyle = this.TitleColor;
            top += this.LineHeight;
            text = g_JSChartLocalization.GetText('Tooltip-Position', this.LanguageID);
            this.Canvas.fillText(text, left, top);
            var text = IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            this.Canvas.fillText(text, left + labelWidth, top);
        }
        

        if (this.IsHScreen) this.Canvas.restore();
    }
}


//////////////////////////////////////////////////////////////////////////////
// 弹幕
//弹幕数据 { X:X偏移, Y:Y偏移, Text:内容, Color:颜色 }
function BarrageList() 
{
    this.PlayList = [];   //正在播放队列
    this.Cache = [];      //没有播放的弹幕数据
    this.MinLineHeight = 40;
    this.Height;        //高度
    this.Step = 1;

    //{Canves:画布, Right:右边坐标, Left:左边坐标, Font:默认字体 }
    this.GetPlayList = function (obj) 
    {
        var canves = obj.Canves;
        var right = obj.Right;
        var left = obj.Left;
        var width = right - left;
        var isMoveStep = obj.IsMoveStep;

        var list = [];
        var yOffset = 0;
        for (var i = 0; i < this.PlayList.length; ++i) 
        {
            var ary = this.PlayList[i];
            var lineHeight = this.MinLineHeight;
            if (ary.Height > this.MinLineHeight) lineHeight = ary.Height;

            var bAddNewItem = true;  //是否需要加入新弹幕
            var bRemoveFirst = false; //是否删除第1个数据
            for (var j = 0; j < ary.Data.length; ++j) 
            {
                var item = ary.Data[j];
                var playItem = { X: item.X, Y: yOffset, Text: item.Text, Color: item.Color, Height: lineHeight, Font: item.Font, Info: item.Info };
                list.push(playItem);

                if (!isMoveStep) continue;

                if (j == ary.Data.length - 1 && this.Cache.length > 0)    //最后一个数据了 判断是否需要增加弹幕
                {
                    bAddNewItem = false;
                    if (!item.TextWidth) 
                    {
                        if (item.Font && item.Font.Name) canves.font = item.Font.Name;
                        else canves.font = obj.Font;
                        item.TextWidth = canves.measureText(playItem.Text + '擎擎').width;
                    }

                    if (item.X >= item.TextWidth)
                        bAddNewItem = true;
                }
                else if (j == 0) 
                {
                    bRemoveFirst = false;
                    if (!item.TextWidth) 
                    {
                        if (item.Font && item.Font.Name) canves.font = item.Font.Name;
                        else canves.font = obj.Font;
                        item.TextWidth = canves.measureText(playItem.Text + '擎擎').width;
                    }

                    if (item.X > width + item.TextWidth) bRemoveFirst = true;
                }

                item.X += this.Step;
            }

            if (isMoveStep && bAddNewItem && this.Cache.length > 0)    //最后一个数据了 判断是否需要增加弹幕
            {
                var cacheItem = this.Cache.shift();
                var newItem = { X: 0, Text: cacheItem.Text, Color: cacheItem.Color, Font: cacheItem.Font, Info: cacheItem.Info };
                ary.Data.push(newItem);
            }

            if (isMoveStep && bRemoveFirst && ary.Data.length > 0) 
            {
                var removeItem = ary.Data.shift();
                this.OnItemPlayEnd(obj.HQChart, removeItem);
            }

            yOffset += lineHeight;
        }

        return list;
    }

    //根据高度计算播放队列个数
    this.CacluatePlayLine = function (height) 
    {
        this.Height = height;
        var lineCount = parseInt(height / this.MinLineHeight);
        if (this.PlayList.length < lineCount)
         {
            var addCount = lineCount - this.PlayList.length;
            for (var i = 0; i < addCount; ++i) 
            {
                this.PlayList.push({ Data: [] });
            }
        }
        else if (this.PlayList.length > lineCount) 
        {
            var removeCount = this.PlayList.length - lineCount;
            for (var i = 0; i < removeCount; ++i) 
            {
                var ary = this.PlayList.pop();
                for (var j = 0; j < ary.Data.length; ++j) 
                {
                    var item = ary.Data[j];
                    var cacheItem = { Text: item.Text, Color: item.Color, Font: item.Font, Info: item.Info };
                    this.Cache.unshift(cacheItem);
                }
            }
        }

        console.log(`[BarrageList::CacluatePlayLine] LineCount=${this.PlayList.length} Height=${this.Height}`)
    }

    //添加弹幕
    this.AddBarrage = function (barrageData) 
    {
        for (var i in barrageData) {
            var item = barrageData[i];
            this.Cache.push(item);
        }
    }

    this.OnItemPlayEnd = function (hqChart, item)  //单挑弹幕播放完毕
    {
        //监听事件
        var event = hqChart.GetBarrageEvent();
        if (!event || !event.Callback) return;

        event.Callback(event, item, this);
    }

    this.Count = function () { return this.Cache.length; } //未播放的弹幕个数
}

//背景图 支持横屏
function BackgroundPaint() 
{
    this.newMethod = IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'BackgroundPaint';

    this.IsDynamic = false;
    this.IsCallbackDraw = true;   //在回调函数里绘制, 不在Draw()中绘制

    this.FrameID = 0;
    this.Data;      //背景数据 { Start:, End:, Color:[] }
    this.ID = Guid(); //唯一的ID

    /*
    this.Data=
    [ 
        { Start:{ Date:20181201 }, End:{ Date:20181230 }, Color:'rgb(44,55,44)' } , 
        { Start:{ Date:20190308 }, End:{ Date:20190404 }, Color:['rgb(44,55,255)','rgb(200,55,255)'] } 
    ]
    */

    this.ChartSubFrame;
    this.ChartBorder;
    this.KData;
    this.Period;
    this.XPointCount = 0;

    this.SetOption = function (option) //设置
    {
        if (option.FrameID > 0) this.FrameID = option.FrameID;
        if (IFrameSplitOperator.IsObjectExist(option.ID)) this.ID = option.ID;
    }

    this.Draw = function () 
    {
        if (!this.Data || !this.HQChart) return;
        if (!this.ChartFrame || !this.ChartFrame.SubFrame || this.ChartFrame.SubFrame.length <= this.FrameID) return;
        var klineChart = this.HQChart.ChartPaint[0];
        if (!klineChart || !klineChart.Data) return;

        this.ChartSubFrame = this.ChartFrame.SubFrame[this.FrameID].Frame;
        this.ChartBorder = this.ChartSubFrame.ChartBorder;
        this.KData = klineChart.Data;
        this.Period = this.HQChart.Period;
        if (!this.KData || this.KData.Data.length <= 0) return;

        var isHScreen = (this.ChartSubFrame.IsHScreen === true);
        this.XPointCount = this.ChartSubFrame.XPointCount;
        var xPointCount = this.ChartSubFrame.XPointCount;

        var firstKItem = this.KData.Data[this.KData.DataOffset];
        var endIndex = this.KData.DataOffset + xPointCount - 1;
        if (endIndex >= this.KData.Data.length) endIndex = this.KData.Data.length - 1;
        var endKItem = this.KData.Data[endIndex];
        var showData = this.GetShowData(firstKItem, endKItem);
        if (!showData || showData.length <= 0) return;

        var kLineMap = this.BuildKLineMap();
        var bottom = this.ChartBorder.GetBottomEx();
        var top = this.ChartBorder.GetTopEx();
        var height = this.ChartBorder.GetHeightEx();
        if (isHScreen) 
        {
            top = this.ChartBorder.GetRightEx();
            bottom = this.ChartBorder.GetLeftEx();
            height = this.ChartBorder.GetWidthEx();
        }

        for (var i in showData) 
        {
            var item = showData[i];
            var rt = this.GetBGCoordinate(item, kLineMap);
            if (!rt) continue;

            if (Array.isArray(item.Color)) 
            {
                var gradient;
                if (isHScreen) gradient = this.Canvas.createLinearGradient(bottom, rt.Left, top, rt.Left);
                else gradient = this.Canvas.createLinearGradient(rt.Left, top, rt.Left, bottom);
                var offset = 1 / item.Color.length;
                for (var i in item.Color) 
                {
                    gradient.addColorStop(i * offset, item.Color[i]);
                }
                this.Canvas.fillStyle = gradient;
            }
            else 
            {
                this.Canvas.fillStyle = item.Color;
            }

            if (isHScreen) this.Canvas.fillRect(ToFixedRect(bottom), ToFixedRect(rt.Left), ToFixedRect(height), ToFixedRect(rt.Width));
            else this.Canvas.fillRect(ToFixedRect(rt.Left), ToFixedRect(top), ToFixedRect(rt.Width), ToFixedRect(height));
        }
    }

    this.GetShowData = function (first, end) 
    {
        var aryData = [];
        for (var i in this.Data) {
            var item = this.Data[i];
            var showItem = {};
            if (item.Start.Date >= first.Date && item.Start.Date <= end.Date) showItem.Start = item.Start;
            if (item.End.Date >= first.Date && item.End.Date <= end.Date) showItem.End = item.End;
            if (showItem.Start || showItem.End) 
            {
                showItem.Color = item.Color;
                aryData.push(showItem);
            }
        }

        return aryData;
    }

    this.BuildKLineMap = function () 
    {
        var isHScreen = (this.ChartSubFrame.IsHScreen === true);
        var dataWidth = this.ChartSubFrame.DataWidth;
        var distanceWidth = this.ChartSubFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();

        var mapKLine = { Data: new Map() }; //Key: date / date time, Value:索引
        for (var i = this.KData.DataOffset, j = 0; i < this.KData.Data.length && j < this.XPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var kItem = this.KData.Data[i];
            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;

            if (j == 0) mapKLine.XLeft = left;
            mapKLine.XRight = right;

            var value = { Index: i, ShowIndex: j, X: x, Right: right, Left: left, Date: kItem.Date };
            if (ChartData.IsMinutePeriod(this.Period, true)) 
            {
                var key = `Date:${kItem.Date} Time:${kItem.Time}`;
                value.Time = kItem.Time;
            }
            else 
            {
                var key = `Date:${kItem.Date}`;
            }

            mapKLine.Data.set(key, value);
        }

        return mapKLine;
    }

    this.GetBGCoordinate = function (item, kLineMap) 
    {
        var xLeft = null, xRight = null;
        if (item.Start) 
        {
            if (ChartData.IsMinutePeriod(this.Period, true))
                var key = `Date:${item.Start.Date} Time:${item.Start.Time}`;
            else
                var key = `Date:${item.Start.Date}`;

            if (kLineMap.Data.has(key)) 
            {
                var findItem = kLineMap.Data.get(key);
                xLeft = findItem.Left;
            }
            else 
            {
                for (var kItem of kLineMap.Data) 
                {
                    var value = kItem[1];
                    if (value.Date > item.Start.Date) 
                    {
                        xLeft = value.Left;
                        break;
                    }
                }
            }
        }
        else 
        {
            xLeft = kLineMap.XLeft;
        }

        if (item.End) 
        {
            if (ChartData.IsMinutePeriod(this.Period, true))
                var key = `Date:${item.End.Date} Time:${item.End.Time}`;
            else
                var key = `Date:${item.End.Date}`;

            if (kLineMap.Data.has(key)) 
            {
                var findItem = kLineMap.Data.get(key);
                xRight = findItem.Right;
            }
            else 
            {
                var previousX = null;
                for (var kItem of kLineMap.Data) 
                {
                    var value = kItem[1];
                    if (value.Date > item.End.Date) 
                    {
                        xRight = previousX;
                        break;
                    }
                    previousX = value.Right;
                }
            }
        }
        else 
        {
            xRight = kLineMap.XRight;
        }

        if (xLeft == null || xRight == null) return null;

        return { Left: xLeft, Right: xRight, Width: xRight - xLeft };
    }
}


//弹幕
function BarragePaint() 
{
    this.newMethod = IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'BarragePaint';
    this.IsAnimation = true;
    this.IsEraseBG = true;
    this.HQChart;

    this.Font = g_JSChartResource.Barrage.Font;
    this.TextColor = g_JSChartResource.Barrage.Color;
    this.FontHeight = g_JSChartResource.Barrage.Height;

    this.BarrageList = new BarrageList();  //字幕列表
    this.IsMoveStep = false;

    
    this.SetOption = function (option) //设置参数接口
    {
        if (option) 
        {
            if (option.Step > 0) this.BarrageList.Step = option.Step;
            if (option.MinLineHeight) this.Barrage.MinLineHeight = option.MinLineHeight;
        }
    }

    this.DrawHScreen = function () 
    {
        var height = this.ChartBorder.GetWidth();
        var left = this.ChartBorder.GetTop();
        var right = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetRightEx();
        var wdith = this.ChartBorder.GetChartWidth();

        if (height != this.BarrageList.Height)
            this.BarrageList.CacluatePlayLine(height);

        this.Canvas.textBaseline = "middle";
        this.Canvas.textAlign = "left";

        var play = this.BarrageList.GetPlayList({ Canves: this.Canvas, Right: right, Left: left, Font: this.Font, IsMoveStep: this.IsMoveStep, HQChart: this.HQChart });
        this.IsMoveStep = false;
        if (!play) return;

        this.Canvas.save();
        this.Canvas.translate(this.ChartBorder.GetChartHeight(), 0);
        this.Canvas.rotate(90 * Math.PI / 180);

        for (var i = 0; i < play.length; ++i) 
        {
            var item = play[i];
            if (item.Color) this.Canvas.fillStyle = item.Color;
            else this.Canvas.fillStyle = this.TextColor;
            if (item.Font) this.Canvas.font = item.Font.Name;
            else this.Canvas.font = this.Font;

            var fontHeight = this.FontHeight;
            if (item.Font && item.Font.Height > 0) fontHeight = item.Font.Height;
            var yOffset = item.Y + parseInt((item.Height - fontHeight) / 2);

            this.Canvas.fillText(item.Text, right - item.X, top + yOffset);
        }

        this.Canvas.restore();
    }

    this.Draw = function () 
    {
        if (this.ChartFrame.IsHScreen) 
        {
            this.DrawHScreen();
            return;
        }

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var top = this.ChartBorder.GetTopEx();
        var height = this.ChartBorder.GetHeight();

        if (height != this.BarrageList.Height)
            this.BarrageList.CacluatePlayLine(height);

        this.Canvas.textBaseline = "middle";
        this.Canvas.textAlign = "left";

        var play = this.BarrageList.GetPlayList({ Canves: this.Canvas, Right: right, Left: left, Font: this.Font, IsMoveStep: this.IsMoveStep, HQChart: this.HQChart });
        this.IsMoveStep = false;
        if (!play) return;

        for (var i = 0; i < play.length; ++i) 
        {
            var item = play[i];
            if (item.Color) this.Canvas.fillStyle = item.Color;
            else this.Canvas.fillStyle = this.TextColor;
            if (item.Font) this.Canvas.font = item.Font.Name;
            else this.Canvas.font = this.Font;

            var fontHeight = this.FontHeight;
            if (item.Font && item.Font.Height > 0) fontHeight = item.Font.Height;
            var yOffset = item.Y + parseInt((item.Height - fontHeight) / 2);

            this.Canvas.fillText(item.Text, right - item.X, top + yOffset);
        }
    }
}

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonExtendChartPaint:
    {
        IExtendChartPainting: IExtendChartPainting,
        KLineTooltipPaint: KLineTooltipPaint,
        BarragePaint: BarragePaint,
        MinuteTooltipPaint: MinuteTooltipPaint,
        BackgroundPaint: BackgroundPaint,
    },

    //单个类导出
    JSCommonExtendChartPaint_IExtendChartPainting: IExtendChartPainting,
    JSCommonExtendChartPaint_KLineTooltipPaint: KLineTooltipPaint,
    JSCommonExtendChartPaint_BarragePaint: BarragePaint,
    JSCommonExtendChartPaint_MinuteTooltipPaint: MinuteTooltipPaint,
    JSCommonExtendChartPaint_BackgroundPaint: BackgroundPaint,
};