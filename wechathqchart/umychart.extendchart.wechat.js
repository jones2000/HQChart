/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    图形扩展画法
*/ 
//日志
import { JSConsole } from "./umychart.console.wechat.js"

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import 
{
    ChartData, HistoryData,
    SingleData, MinuteData,
    Guid,
    ToFixedPoint,
    ToFixedRect,
    JSCHART_EVENT_ID,
    JSCHART_BUTTON_ID,
    CloneData,
} from "./umychart.data.wechat.js";

import 
{
    JSCommonCoordinateData,
    MARKET_SUFFIX_NAME
} from "./umychart.coordinatedata.wechat.js";

import 
{
    g_JSChartResource,
    JSCHART_LANGUAGE_ID,
    g_JSChartLocalization,
    JSChartResource,
} from './umychart.resource.wechat.js'

import 
{
    IFrameSplitOperator,
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

    this.ID=Guid(),
    
    //上下左右间距
    this.Left = 5;
    this.Right = 5;
    this.Top = 5;
    this.Bottom = 5;

    this.Draw = function () { } //画图接口
    this.SetOption = function (option) { }  //设置参数接口

    this.SetFillStyle=function(color, x0, y0, x1, y1)
    {
        if (Array.isArray(color))
        {
            let gradient = this.Canvas.createLinearGradient(x0, y0, x1, y1);
            var offset=1/(color.length-1);
            for(var i=0; i<color.length; ++i)
            {
                var value=i*offset;
                gradient.addColorStop(value, color[i]);
            }
            this.Canvas.fillStyle=gradient;
        }
        else
        {
            this.Canvas.fillStyle=color;
        }
    }
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
    this.LatestPoint;               //手势位置
    this.ShowPosition=0;            //显示位置 0=左 1=右

    this.BorderColor = g_JSChartResource.TooltipPaint.BorderColor;    //边框颜色
    this.BGColor = g_JSChartResource.TooltipPaint.BGColor;            //背景色
    this.TitleColor = g_JSChartResource.TooltipPaint.TitleColor;      //标题颜色
    this.Font = [g_JSChartResource.TooltipPaint.TitleFont];
    this.Mergin={ Left:2, Top:3, Bottom:5, Right:5 };
    this.ExtendLineWidth=5;

    this.Width = 50;
    this.Height = 100;
    this.LineHeight = 15; //行高
    this.LineSpace=2;   //行间距

    this.Left = 1;
    this.Top = 0;

    this.HQChart;
    this.KLineTitlePaint;
    this.IsHScreen = false;   //是否横屏
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;

    this.GetVolUnit=function()
    {
        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol=this.HQChart.Symbol.toUpperCase();
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);

        return unit;
    }

    this.GetLeft = function () 
    {
        if (this.IsHScreen) 
        {
            return this.ChartBorder.GetRightEx()-this.Height-this.Top;
        }
        else
        {
            if (this.ShowPosition==0)
                return this.ChartBorder.GetLeft()+this.Left;
            else 
                return this.ChartBorder.GetRight()-this.Width-this.Left;
        }
    }

    this.GetTop = function () 
    {
        if (this.IsHScreen) 
        {
            if (this.ShowPosition==0)
                return this.ChartBorder.GetTop()+this.Left;
            else
                return this.ChartBorder.GetBottom()-this.Width-this.Left;
        }
        else
        {
            return this.ChartBorder.GetTopEx()+this.Top;
        }
    }

    //是否显示
    this.IsEnableDraw=function()
    {
        if (!this.HQChart || !this.HQChart.TitlePaint || !this.HQChart.TitlePaint[0]) return false;

        if (this.HQChart.EnableClickModel)
        {
            if (this.HQChart.ClickModel.IsShowCorssCursor===false) return false;
        }
        else if (!this.HQChart.IsOnTouch) 
        {
            return false;
        }

        return true;
    }

    this.Draw = function () 
    {
        if (!this.IsEnableDraw()) return;

        this.IsHScreen=this.ChartFrame.IsHScreen===true;
        this.KLineTitlePaint = this.HQChart.TitlePaint[0];
        var klineData = this.KLineTitlePaint.GetCurrentKLineData();
        if (!klineData) return;

        var titleData=this.GetFormatTitle({Data:klineData});
        if (!titleData || !IFrameSplitOperator.IsNonEmptyArray(titleData.AryText)) return;

        this.CalculateTooltipSize(titleData);
        this.CalculateShowPosition();
        this.DrawBG();
        this.DrawTooltipData(titleData);
        this.DrawBorder();
    }

    //[{ Text:, Color, Title:, TitleColor, }]
    this.GetFormatTitle=function(data)
    {
        if (!data || !data.Data) return;

        var item=data.Data;
        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol = this.HQChart.Symbol.toUpperCase();
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var unit=this.GetVolUnit();
        var aryText=[];
        var result={ AryText:aryText };
        var text, title, color;

        text=IFrameSplitOperator.FormatDateString(item.Date);
        aryText.push({ Text:text, Color:this.TitleColor });

        var period = this.HQChart.Period;
        if (ChartData.IsMinutePeriod(period, true) && IFrameSplitOperator.IsNumber(item.Time))
        {
            text = this.HQChart.FormatTimeString(item.Time);
            aryText.push({ Text:text, Color:this.TitleColor });
        }
        else if (ChartData.IsSecondPeriod(period) && IFrameSplitOperator.IsNumber(item.Time))
        {
            text = this.HQChart.FormatTimeString(item.Time,"HH:MM:SS");
            aryText.push({ Text:text, Color:this.TitleColor });
        }
        
        if (IFrameSplitOperator.IsNumber(item.Open))   //开
        {
            title = g_JSChartLocalization.GetText('Tooltip-Open', this.LanguageID);
            var color = this.KLineTitlePaint.GetColor(item.Open, item.YClose);
            text = item.Open.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.High))    //高
        {
            title=g_JSChartLocalization.GetText('Tooltip-High',this.LanguageID);
            color=this.KLineTitlePaint.GetColor(item.High,item.YClose);
            text=item.High.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Low))    //低
        {
            title=g_JSChartLocalization.GetText('Tooltip-Low',this.LanguageID);
            color=this.KLineTitlePaint.GetColor(item.Low,item.YClose);
            text=item.Low.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Close))    //收
        {
            title=g_JSChartLocalization.GetText('Tooltip-Close',this.LanguageID);
            color=this.KLineTitlePaint.GetColor(item.Close,item.YClose);
            text=item.Close.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }
       
        //涨幅
        title=g_JSChartLocalization.GetText('Tooltip-Increase',this.LanguageID);
        if (item.YClose>0)
        {
            var value = (item.Close - item.YClose) / item.YClose * 100;
            color = this.KLineTitlePaint.GetColor(value, 0);
            text = value.toFixed(2) + '%';
        }
        else
        {
            text='--.--';
            color = this.KLineTitlePaint.GetColor(0, 0);
        }
        aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });


        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            title = g_JSChartLocalization.GetText('Tooltip-Vol', this.LanguageID);
            text = this.HQChart.FormatValueString(item.Vol/unit, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            title = g_JSChartLocalization.GetText('Tooltip-Amount',this.LanguageID);
            text = this.HQChart.FormatValueString(item.Amount, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }

        //换手率
        if (IFrameSplitOperator.IsNumber(item.FlowCapital) )
        {
            var text="--.--%";
            title=g_JSChartLocalization.GetText('Tooltip-Exchange',this.LanguageID);
            if (item.FlowCapital!=0)
            {
                var value=item.Vol/item.FlowCapital*100;
                text=value.toFixed(2)+'%';
            }
            
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }

        //持仓量
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) && IFrameSplitOperator.IsNumber(item.Position)) 
        {
            title = g_JSChartLocalization.GetText('Tooltip-Position', this.LanguageID);
            text = IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }

        return result;
    }

    this.CalculateTooltipSize=function(titleData)
    {
        this.Canvas.font=this.Font[0];
        this.LineHeight=this.Canvas.measureText("擎").width;
        var height=0;
        var maxTitleWidth=0, maxTextWidth=0, maxLineWidth=0;
        for(var i=0; i<titleData.AryText.length; ++i)
        {
            var item=titleData.AryText[i];

            if (height>0) height+=this.LineSpace;

            var lineWidth=0;
            if (item.Title)
            {
                var textWidth=this.Canvas.measureText(item.Title).width+2;
                if (maxTitleWidth<textWidth) maxTitleWidth=textWidth;
                lineWidth+=textWidth;
            }

            if (item.Text)
            {
                var textWidth=this.Canvas.measureText(item.Text).width+2;
                if (maxTextWidth<textWidth) maxTextWidth=textWidth;
                lineWidth+=textWidth;
            }

            if (maxLineWidth<lineWidth) maxLineWidth=lineWidth;

            height+=this.LineHeight;
        }

        this.Height=height+(this.Mergin.Top+this.Mergin.Bottom);
        this.Width=(maxLineWidth)+(this.Mergin.Left+this.Mergin.Right)+this.ExtendLineWidth;

        return { Height:this.Height, Width:this.Width, MaxTitleWidth:maxTitleWidth, MaxTextWidth:maxTextWidth };
    }

    //判断显示位置
    this.CalculateShowPosition=function()
    {
        this.ShowPosition=0;
        if (!this.LatestPoint) return;

        if(this.IsHScreen)
        {
            var top=this.ChartBorder.GetTop();
            var height=this.ChartBorder.GetHeight();
            var yCenter=top+height/2;
            if (this.LatestPoint.Y<yCenter) this.ShowPosition=1;
        }
        else
        {
            var left=this.ChartBorder.GetLeft();
            var width=this.ChartBorder.GetWidth();
            var xCenter=left+width/2;
            if (this.LatestPoint.X<xCenter) this.ShowPosition=1;
        }
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

    this.DrawTooltipData = function (titleData) 
    {
        //console.log('[KLineTooltipPaint::DrawKLineData] ', item);
        var left = this.GetLeft();
        var top = this.GetTop();

        if (this.IsHScreen) 
        {
            this.Canvas.save();
            var x = this.GetLeft() + this.Height, y = this.GetTop();

            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);

            //x, y 作为原点
            left =0;
            top = 0;
        }

        this.Canvas.textBaseline="top";
        var right=left+this.Width-this.Mergin.Right;
        left+=this.Mergin.Left;
        top+=this.Mergin.Top;

        for(var i=0; i<titleData.AryText.length; ++i)
        {
            var item=titleData.AryText[i];

            if (item.Title)
            {
                this.Canvas.textAlign="left";
                this.Canvas.fillStyle=item.TitleColor;
                this.Canvas.fillText(item.Title,left,top);
            }

            if (item.Text)
            {
                this.Canvas.textAlign="right";
                this.Canvas.fillStyle=item.Color;
                this.Canvas.fillText(item.Text,right,top);
            }

            top+=this.LineHeight+this.LineSpace;
        }

        if (this.IsHScreen) this.Canvas.restore();
    }

    //设置参数接口
    this.SetOption = function (option) 
    {
        if (!option) return;
        if (option.LineHeight > 0) this.LineHeight = option.LineHeight;
        if (option.BGColor) this.BGColor = option.BGColor;
        if (option.LanguageID > 0) this.LanguageID = option.LanguageID;
        if (IFrameSplitOperator.IsNumber(option.LineSpace)) this.LineSpace=option.LineSpace;
        if (IFrameSplitOperator.IsNumber(option.ExtendLineWidth)) this.ExtendLineWidth=option.ExtendLineWidth;
        JSChartResource.CopyMargin(this.Mergin, option.Mergin);
    }
}

function MinuteTooltipPaint() 
{
    this.newMethod = KLineTooltipPaint;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'MinuteTooltipPaint';
    this.IsShowAveragePrice=true;

    this.GetTop=function()
    {
        if (this.IsHScreen) 
        {
            if (this.ShowPosition==0)
                return this.ChartBorder.GetTop()+this.Left;
            else
                return this.ChartBorder.GetBottom()-this.Width-this.Left;
        }
        else
        {
            return this.ChartBorder.GetTop()+this.Top;
        }
    }

    this.GetLeft=function()
    {
        if (this.IsHScreen) 
        {
            return this.ChartBorder.GetRight()-this.Height-this.Top;
        }
        else
        {
            if (this.ShowPosition==0)
                return this.ChartBorder.GetLeft()+this.Left;
            else 
                return this.ChartBorder.GetRight()-this.Width-this.Left;
        }
    }

    this.GetFormatTitle=function(data)
    {
        if (!data || !data.Data) return;
        var item=data.Data;
        var upperSymbol;
        if (this.HQChart.Symbol) upperSymbol=this.HQChart.Symbol.toUpperCase();
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var isFutures=MARKET_SUFFIX_NAME.IsFutures(upperSymbol);    //期货
        var unit=this.GetVolUnit();
        this.YClose = this.KLineTitlePaint.YClose;
        this.YClose=item.YClose;
        if (isFutures && IFrameSplitOperator.IsNumber(item.YClearing)) this.YClose=item.YClearing;

        var aryText=[];
        var result={ AryText:aryText };
        var text, title, color, value;

        if (IFrameSplitOperator.IsNumber(item.Date))
        {
            text=IFrameSplitOperator.FormatDateString(item.Date);
            aryText.push({ Text:text, Color:this.TitleColor });
        }

        if (IFrameSplitOperator.IsNumber(item.Time))
        {
            text=IFrameSplitOperator.FormatTimeString(item.Time);
            aryText.push({ Text:text, Color:this.TitleColor });
        }

        if (IFrameSplitOperator.IsNumber(item.Close))    //最新
        {
            title = g_JSChartLocalization.GetText('Tooltip-Price', this.LanguageID);
            color = this.KLineTitlePaint.GetColor(item.Close, this.YClose);
            text = item.Close.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }
        
        if (IFrameSplitOperator.IsNumber(item.AvPrice) && this.IsShowAveragePrice==true)    //均价
        {
            title = g_JSChartLocalization.GetText('Tooltip-AvPrice', this.LanguageID);
            color = this.KLineTitlePaint.GetColor(item.AvPrice, this.YClose);
            text = item.AvPrice.toFixed(defaultfloatPrecision);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Close) && IFrameSplitOperator.IsNumber(this.YClose))   //涨幅
        {
            title = g_JSChartLocalization.GetText('Tooltip-Increase', this.LanguageID);
            value = (item.Close - this.YClose) / this.YClose * 100;
            color = this.KLineTitlePaint.GetColor(value, 0);
            text = value.toFixed(2) + '%';
            if (this.YClose===0)
            {
                text="--.--";
                color=this.TitleColor;
            }
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            title = g_JSChartLocalization.GetText('Tooltip-Vol', this.LanguageID);
            text = this.HQChart.FormatValueString(item.Vol/unit, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }
        
        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            title = g_JSChartLocalization.GetText('Tooltip-Amount', this.LanguageID);
            text = this.HQChart.FormatValueString(item.Amount, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }
        
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) && IFrameSplitOperator.IsNumber(item.Position)) //持仓量
        {
            title = g_JSChartLocalization.GetText('Tooltip-Position', this.LanguageID);
            text = IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            aryText.push({Title:title, TitleColor:this.TitleColor, Text:text, Color:this.TitleColor });
        }
        
        return result;
    }

    /*
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

        if (IFrameSplitOperator.IsNumber(item.AvPrice) && this.IsShowAveragePrice==true)
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
    */
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

        JSConsole.Chart.Log(`[BarrageList::CacluatePlayLine] LineCount=${this.PlayList.length} Height=${this.Height}`)
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

    this.IsDrawAllFrame=false;          //全部的指标框都画
    this.SetDrawFrameID=new Set([0]);   //指定几个指标框画

    this.FrameID = 0;
    this.Data;      //背景数据[ { Start:{ Date:, Time: }, End:{ Date:, Time }, Color:['rgb(44,55,255)','rgb(200,55,255)'] }]
    this.IsShow=true;
    this.SubFrame=null;
    this.ID = Guid(); //唯一的ID

    this.HQChart;

    this.SetOption = function (option) //设置
    {
        if (!option) return;

        if (IFrameSplitOperator.IsNumber(option.FrameID)) this.FrameID=option.FrameID;
        if (IFrameSplitOperator.IsObjectExist(option.ID)) this.ID=option.ID;
        if (IFrameSplitOperator.IsBool(option.IsDrawAllFrame)) this.IsDrawAllFrame=option.IsDrawAllFrame;
        if (IFrameSplitOperator.IsNonEmptyArray(option.AryFrameID)) this.SetDrawFrameID=new Set(option.AryFrameID);
    }

    this.Draw=function()
    {
        this.SubFrame=null;

        if (this.FrameID<0) return;
        if (!this.HQChart) return;
        if (!this.ChartFrame || !IFrameSplitOperator.IsNonEmptyArray(this.ChartFrame.SubFrame)) return;
        if (!this.IsShow) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data)) return;
        if (!this.ChartFrame.SubFrame[this.FrameID]) return;
        this.SubFrame=this.ChartFrame.SubFrame[this.FrameID].Frame;
        if (!this.SubFrame) return;

        var kData=this.HQChart.GetKData();
        if (!kData || !IFrameSplitOperator.IsNonEmptyArray(kData.Data)) return;

        var bHScreen=(this.SubFrame.IsHScreen===true);
        this.IsHScreen=bHScreen;
        var isMinute=this.SubFrame.IsMinuteFrame();
        var dataWidth=this.SubFrame.DataWidth;
        var distanceWidth=this.SubFrame.DistanceWidth;
        var xPointCount=this.SubFrame.XPointCount;
        
        var border=this.SubFrame.GetBorder();
        if (bHScreen)
        {
            var chartright=border.BottomEx;
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        }
        else
        {
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
        }

        var mapBG=new Map();    //key= index, Value={  Start:{Left, Center, Right, Item:}, End:{ Left, Center, Right, Item:} }
        var startIndex=kData.DataOffset;
        for(var i=startIndex,j=0;i<kData.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=kData.Data[i];
            var aryFind=this.FindMatchData(kItem);
            if (!aryFind) continue;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
                var left=x;
                var right=x;
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                var x=left+(right-left)/2;
            }

            for(var k=0;k<aryFind.length;++k)
            {
                var findItem=aryFind[k];
                if (mapBG.has(findItem.Index))
                {
                    var bgItem=mapBG.get(findItem.Index);
                    bgItem.End.Left=left;
                    bgItem.End.Right=right;
                    bgItem.End.Item=findItem.Item;
                }
                else
                {
                    mapBG.set(findItem.Index, { Item:findItem.Item, Start:{ Left:left, Right:right, Item:findItem.Item }, End:{ Left:left, Right:right, Item:findItem.Item }})
                }
            }
        }

        if (mapBG.size>0)
        {
            this.Canvas.save();
            //this.ClipClient(bHScreen);
            
            this.DrawBG(mapBG);
    
            this.Canvas.restore();
        }
    }

    this.FindMatchData=function(kItem)
    {
        var aryFind=[];
        for(var i=0;i<this.Data.length;++i)
        {
            var item=this.Data[i];
            var start=item.Start;
            var end=item.End;
            var bMatch=false;
            if (IFrameSplitOperator.IsNumber(kItem.Date) && IFrameSplitOperator.IsNumber(kItem.Time))
            {
                if (kItem.Date>start.Date && kItem.Date<end.Date)
                {
                    bMatch=true;
                }
                else if (kItem.Date==start.Date && kItem.Date==end.Date)
                {
                    if (kItem.Time>=start.Time && kItem.Time<=end.Time)bMatch=true;
                }
                else if (kItem.Date==start.Date)
                {
                    if (kItem.Time>=start.Time) bMatch=true;
                }
                else if (kItem.Date==end.Date)
                {
                    if ((kItem.Time<=end.Time)) bMatch=true;
                }
            }
            else if (IFrameSplitOperator.IsNumber(kItem.Date) && !IFrameSplitOperator.IsNumber(kItem.Time))
            {
                if (kItem.Date>=start.Date && kItem.Date<=end.Date) bMatch=true;
            }

            if (bMatch) aryFind.push({ Index:i, Item:item });
        }

        if (aryFind.Length<=0) return null;

        return aryFind;
    }

    this.DrawBG=function(mapBG)
    {
        for(var mapItem of mapBG)
        {
            var bgItem=mapItem[1];
            //this.DrawBGItem(this.SubFrame, bgItem);
            
            for(var i=0;i<this.ChartFrame.SubFrame.length;++i)
            {
                var subFrame=this.ChartFrame.SubFrame[i].Frame;
                if (this.IsDrawAllFrame || this.SetDrawFrameID.has(i))
                {
                    this.DrawBGItem(subFrame, bgItem);
                }
            }
        }
    }

    this.DrawBGItem=function(frame, bgItem)
    {
        var border=frame.GetBorder();
        if (this.IsHScreen)
        {
            var top=border.RightEx;
            var bottom=border.LeftEx;
            var left=border.Top;
        }
        else
        {
            var top=border.TopEx;
            var bottom=border.BottomEx;
            var left=border.Left;
        }

        if (this.IsHScreen)
        {
            this.SetFillStyle(bgItem.Item.Color,top,left,bottom,left);
            var start=bgItem.Start;
            var end=bgItem.End;
            var rtBG={ Left:bottom, Right:top, Top:start.Left, Bottom:end.Right };
            rtBG.Width=rtBG.Right-rtBG.Left;
            rtBG.Height=rtBG.Bottom-rtBG.Top;
            this.Canvas.fillRect(ToFixedRect(rtBG.Left),ToFixedRect(rtBG.Top),ToFixedRect(rtBG.Width),ToFixedRect(rtBG.Height));
        }
        else
        {
            this.SetFillStyle(bgItem.Item.Color, left,top, left,bottom);
            var start=bgItem.Start;
            var end=bgItem.End;
            var rtBG={ Left:start.Left, Right:end.Right, Top:top, Bottom:bottom };
            rtBG.Width=rtBG.Right-rtBG.Left;
            rtBG.Height=rtBG.Bottom-rtBG.Top;
            this.Canvas.fillRect(ToFixedRect(rtBG.Left),ToFixedRect(rtBG.Top),ToFixedRect(rtBG.Width),ToFixedRect(rtBG.Height));
        }
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

//////////////////////////////////////////////////////////////////////////////////
// 筹码图
function StockChipPhone()
{
    this.newMethod=IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Name='筹码分布手机版';
    this.ClassName='StockChipPhone';

    this.HQChart;
    this.PenBorder=g_JSChartResource.FrameBorderPen;    //边框
    this.ColorProfit='rgb(255,0,0)';                    //盈利的线段
    this.ColorNoProfit='rgb(90,141,248)';               //非盈利
    this.ColorAveragePrice='rgb(0,139,0)';              //平均价线
    this.ColorBG='rgb(190,190,190)';                    //筹码背景线段颜色
    this.Font=g_JSChartResource.StockChip.Font;
    this.InfoColor=g_JSChartResource.StockChip.InfoColor;
    this.CloseButtonConfig=CloneData(g_JSChartResource.StockChip.PhoneCloseButton);
    this.DayInfoColor=g_JSChartResource.StockChip.DayInfoColor;
    this.PeriodTextTemplate="999周期内成本99.9%";

    this.ShowType=0;                                    //0=所有筹码
    this.PixelRatio=1;
    this.LineHeight=16;
    this.Left=50;         //左边间距
    this.Width=150;       //筹码图宽度
    this.CalculateType=0;   //0=平均分布 1=三角分布
    this.PriceZoom=100;     //价格放大倍数
    this.Buttons=[];

    this.DAY_COLOR=
    [
        ['rgb(255,0,0)','rgb(255,128,128)','rgb(255,0,128)','rgb(255,100,0)','rgb(192,128,0)','rgb(255,192,0)'],
        ['rgb(120,80,225)','rgb(160,160,225)','rgb(80,80,255)','rgb(120,120,255)','rgb(32,64,192)','rgb(0,64,128)'],
    ];

    this.SetOption=function(option)
    {
        if (!option) return;
        if (IFrameSplitOperator.IsNumber(option.ShowType)) this.ShowType=option.ShowType;
        if (option.Width>100) this.Width=option.Width;
        if (option.CalculateType>0) this.CalculateType=option.CalculateType;
        if (IFrameSplitOperator.IsNumber(option.PriceZoom)) this.PriceZoom=option.PriceZoom;
    }

    this.ReloadResource=function(resource)
    {
        this.PenBorder=g_JSChartResource.FrameBorderPen;
        this.Font=g_JSChartResource.StockChip.Font;
        this.InfoColor=g_JSChartResource.StockChip.InfoColor;
        this.CloseButtonConfig=CloneData(g_JSChartResource.StockChip.PhoneCloseButton);
        this.DayInfoColor=g_JSChartResource.StockChip.DayInfoColor;
    }

    this.Draw=function()
    {
        this.Buttons=[];
        this.IsHScreen=this.ChartFrame.IsHScreen==true;
        if (this.IsHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var left=ToFixedPoint(border.Left);
            var right=ToFixedPoint(border.Right);
            var top=ToFixedPoint(border.Bottom+this.Left);
            var bottom=ToFixedPoint(border.ChartHeight-2*this.PixelRatio);
            this.ClientRect={Left:left,Top:top, Right:right, Bottom:bottom};
            this.ClientRect.Width=this.ClientRect.Right-this.ClientRect.Left;
            this.ClientRect.Height=this.ClientRect.Bottom-this.ClientRect.Top;
        }
        else
        {
            var left=ToFixedPoint(this.ChartBorder.GetRight()+this.Left);
            var top=ToFixedPoint(this.ChartBorder.GetTop());
            var right=ToFixedPoint(left+this.Width-1*this.PixelRatio);
            var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
            this.ClientRect={Left:left,Top:top,Right:right, Bottom:bottom};
            this.ClientRect.Width=this.ClientRect.Right-this.ClientRect.Left;
            this.ClientRect.Height=this.ClientRect.Bottom-this.ClientRect.Top;
        }
        
        if (ChartData.IsTickPeriod(this.HQChart.Period))
        {

        }
        else
        {
            if (this.CalculateChip())
            {
                this.DrawAllChip();
                if (this.ShowType==1|| this.ShowType==2) this.DrawDayChip();

                this.CalculateCast();   //计算成本 
                if (this.IsHScreen) this.DrawHScreenChipInfo(); 
                else this.DrawChipInfo();      
            }
        }

        this.DrawBorder();
        this.DrawCloseButton();
        this.SizeChange=false;
    }

    this.DrawBorder=function()
    {
        this.Canvas.strokeStyle=this.PenBorder;
        this.Canvas.strokeRect(this.ClientRect.Left,this.ClientRect.Top,this.ClientRect.Width,this.ClientRect.Height);
    }

    this.DrawAllChip=function()
    {
        var KLineFrame=this.HQChart.Frame.SubFrame[0].Frame;
        var selectPrice=this.Data.SelectData.Close;
        var aryProfitPoint=[];
        var aryNoProfitPoint=[];
        var totalVol=0,totalAmount=0,totalProfitVol=0, totalYProfitVol=0;   //总的成交量, 总的成交金额, 总的盈利的成交量
        var yPrice=this.Data.YPrice;

        var maxPrice=KLineFrame.HorizontalMax;
        var minPrice=KLineFrame.HorizontalMin;

        var MaxVol=1;
        for(var i=0;i<this.Data.AllChip.length;++i)
        {
            var vol=this.Data.AllChip[i];
            if(!vol) continue;
            var price=(i+this.Data.MinPrice)/this.PriceZoom;
            totalVol+=vol;
            totalAmount+=price*vol;

            if (price<yPrice) totalYProfitVol+=vol;     //获利的成交量
            if (price<selectPrice) totalProfitVol+=vol; //鼠标当前位置 获利的成交量

            if (price<=maxPrice && price>=minPrice)
            {
                if (MaxVol<vol) MaxVol=vol;
            }
        }
        this.Data.MaxVol=MaxVol;    //把成交量最大值替换成 当前屏成交量最大值
        
        for(var i=0;i<this.Data.AllChip.length;++i)
        {
            var vol=this.Data.AllChip[i];
            if(!vol) continue;
            var price=(i+this.Data.MinPrice)/this.PriceZoom;
            if (price>maxPrice || price<minPrice) continue;

            if (this.IsHScreen)
            {
                var y=KLineFrame.GetYFromData(price,false);
                var x=(vol/this.Data.MaxVol)*this.ClientRect.Height+this.ClientRect.Top;
            }
            else
            {
                var y=KLineFrame.GetYFromData(price,false);
                var x=(vol/this.Data.MaxVol)*this.ClientRect.Width+this.ClientRect.Left;
            }

            if (price<selectPrice) aryProfitPoint.push({X:x,Y:y});
            else aryNoProfitPoint.push({X:x,Y:y});
        }

        this.Data.ChipInfo=
        {
            Vol:totalVol, AveragePrice:totalAmount/totalVol, ProfitVol:totalProfitVol, 
            ProfitRate:totalVol>0?totalProfitVol/totalVol*100:0,
            YProfitRate:totalVol>0?totalYProfitVol/totalVol*100:0
        };

        if (this.ShowType==0)
        {
            this.DrawLines(aryProfitPoint,this.ColorProfit);
            this.DrawLines(aryNoProfitPoint,this.ColorNoProfit);
            var averagePrice=this.Data.ChipInfo.AveragePrice;
            if (averagePrice>0 && averagePrice<=maxPrice && averagePrice>=minPrice) 
            {
                averagePrice=averagePrice.toFixed(2);
                this.DrawAveragePriceLine(aryProfitPoint,aryNoProfitPoint,KLineFrame.GetYFromData(averagePrice),this.ColorAveragePrice);
            }
        }
        else    //在火焰山模式下, 筹码用一个颜色
        {
            this.DrawLines(aryProfitPoint,this.ColorBG);
            this.DrawLines(aryNoProfitPoint,this.ColorBG);
        }
    }

    this.DrawLines=function(aryPoint,color)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) return;

        this.Canvas.strokeStyle=color;
        this.Canvas.beginPath();
        for(var i =0; i<aryPoint.length; ++i)
        {
            var item=aryPoint[i];
            if (this.IsHScreen)
            {
                this.Canvas.moveTo(item.Y,this.ClientRect.Top);
                this.Canvas.lineTo(item.Y,item.X);
            }
            else
            {
                this.Canvas.moveTo(this.ClientRect.Left,item.Y);
                this.Canvas.lineTo(item.X,item.Y);
            }
            
        }
        this.Canvas.stroke();
    }
    this.DrawAveragePriceLine=function(aryProfitPoint,aryNoProfitPoint,y,color)
    {
        for(var i=0; i<aryProfitPoint.length; ++i)
        {
            var item=aryProfitPoint[i];
            if (item.Y==y)
            {
                this.Canvas.strokeStyle=color;
                this.Canvas.beginPath();
                if (this.IsHScreen)
                {
                    this.Canvas.moveTo(item.Y,this.ClientRect.Top);
                    this.Canvas.lineTo(item.Y,item.X);
                }
                else
                {
                    this.Canvas.moveTo(this.ClientRect.Left,item.Y);
                    this.Canvas.lineTo(item.X,item.Y);
                }
                
                this.Canvas.stroke();
                return;
            }
        }

        for(var i=0; i<aryNoProfitPoint.length; ++i)
        {
            var item=aryNoProfitPoint[i];
            if (item.Y==y)
            {
                this.Canvas.strokeStyle=color;
                this.Canvas.beginPath();
                if (this.IsHScreen)
                {
                    this.Canvas.moveTo(item.Y,this.ClientRect.Top);
                    this.Canvas.lineTo(item.Y,item.X);
                }
                else
                {
                    this.Canvas.moveTo(this.ClientRect.Left,item.Y);
                    this.Canvas.lineTo(item.X,item.Y);
                }
                this.Canvas.stroke();
                return;
            }
        }
    }

    this.GetChipInfoTitle=function()
    {
        var aryText=[]; //从底部往上

        if (ChartData.IsDayPeriod(this.HQChart.Period, true))
        {
            var item={ Title:"日期:", Text:IFrameSplitOperator.FormatDateString(this.Data.SelectData.Date) };
            aryText.push(item);
        }
        else if (ChartData.IsMinutePeriod(this.HQChart.Period, true))
        {
            var item={ Title:`${IFrameSplitOperator.FormatDateString(this.Data.SelectData.Date)} ${IFrameSplitOperator.FormatTimeString(this.Data.SelectData.Time, "HH:MM")}` };
            aryText.push(item);
        }

        var item={ Title:"集中度:", Text:"--.--%", };
        if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Cast)) item.Text=`${this.Data.Cast[0].Rate.toFixed(2)}%`;
        aryText.push(item);

        var item={ Title:"90%成本:", Text:"--.--", };
        if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Cast)) item.Text=`${this.Data.Cast[0].MinPrice.toFixed(2)}-${this.Data.Cast[0].MaxPrice.toFixed(2)}`;
        aryText.push(item);


        var item={ Title:"平均成本：:", Text:"--.--",  };
        if (this.Data.ChipInfo && IFrameSplitOperator.IsNumber(this.Data.ChipInfo.AveragePrice)) item.Text=`${this.Data.ChipInfo.AveragePrice.toFixed(2)}`;

        if (IFrameSplitOperator.IsNumber(this.Data.YPrice) && IFrameSplitOperator.IsNumber(this.Data.ChipInfo.YProfitRate))
        {
            var item={ Title:`${this.Data.YPrice.toFixed(2)}获利:`, Text:`${this.Data.ChipInfo.YProfitRate.toFixed(2)}%` };
            aryText.push(item);
        }

        if (this.IsHScreen) //横屏直接就显示数值 画进度条太麻烦了
        {
            var item={ Title:"获利比例:", Text: `${this.Data.ChipInfo.ProfitRate.toFixed(2)}%`};
            aryText.push(item);
        }
        else
        {
            var item={ Title:"获利比例:", Type:1 };
            aryText.push(item);
        }

        return aryText;
    }

    this.DrawHScreenChipInfo=function()
    {
        var aryText=this.GetChipInfoTitle();
        if (!IFrameSplitOperator.IsNonEmptyArray(aryText)) return;

        this.Canvas.font=this.Font;
        this.Canvas.fillStyle=this.InfoColor;
        this.Canvas.textBaseline='bottom';
        this.Canvas.textAlign='left';

        var top=this.ClientRect.Top+2*this.PixelRatio;
        var left=this.ClientRect.Left+2*this.PixelRatio;
        var bottom=this.ClientRect.Bottom;
        var lineHeight=this.LineHeight;

        this.Canvas.save();
        this.Canvas.translate(left, top);
        this.Canvas.rotate(90 * Math.PI / 180);

        var yText=0, xText=0;
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            yText=0;
            var textColor=item.TitleColor;
            if (item.TitleColor) textColor=item.TitleColor;
            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(item.Title,yText,xText);
            var textWidth=this.Canvas.measureText(item.Title).width+4*this.PixelRatio;
            var yText=textWidth;

            if (item.Text)
            {
                var textColor=item.TitleColor;
                if (item.TextColor) textColor=item.TextColor;
                this.Canvas.fillStyle=textColor;
                this.Canvas.fillText(item.Text,yText,xText);
            }

            xText-=lineHeight;
        }


        this.Canvas.restore();
    }

    this.DrawChipInfo=function()    
    {
        var aryText=this.GetChipInfoTitle();
        if (!IFrameSplitOperator.IsNonEmptyArray(aryText)) return;

        var bottom=this.ClientRect.Top+this.ClientRect.Height-1;
        var left=this.ClientRect.Left+2;
        var right=this.ClientRect.Left+this.ClientRect.Width;

        this.Canvas.font=this.Font;
        this.Canvas.fillStyle=this.InfoColor;
        this.Canvas.textBaseline='bottom';
        this.Canvas.textAlign='left';

        var lineHeight=this.LineHeight;
        var yText=bottom;
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            var textColor=item.TitleColor;
            if (item.TitleColor) textColor=item.TitleColor;
            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(item.Title,left,yText);
            var textWidth=this.Canvas.measureText(item.Title).width+4;
            var xText=left+textWidth;

            if (item.Text)
            {
                var textColor=item.TitleColor;
                if (item.TextColor) textColor=item.TextColor;
                this.Canvas.fillStyle=textColor;
                this.Canvas.fillText(item.Text,xText,yText);
            }

            if (item.Type==1)
            {
                var barLeft=left+textWidth+2;
                var barWidth=(right-5-barLeft);
                this.Canvas.strokeStyle=this.ColorNoProfit;
                this.Canvas.strokeRect(barLeft,yText-lineHeight,barWidth,lineHeight);
                this.Canvas.strokeStyle=this.ColorProfit;
                this.Canvas.strokeRect(barLeft,yText-lineHeight,barWidth*(this.Data.ChipInfo.ProfitRate/100),lineHeight);
                var text=this.Data.ChipInfo.ProfitRate.toFixed(2)+'%';
                this.Canvas.textAlign='center';
                this.Canvas.fillText(text,barLeft+barWidth/2,yText);
            }

            yText-=lineHeight;
        }

        this.DrawChipPeriodInfo(yText);

    }

    this.DrawChipPeriodInfo=function(bottom)
    {
        if (this.ShowType!=1 && this.ShowType!=2) return;

        var lineHeight=this.LineHeight;
        var right=this.ClientRect.Left+this.ClientRect.Width-1;
        this.Canvas.textAlign='right';
        var maxTextWidth=this.Canvas.measureText(this.PeriodTextTemplate).width+2;
        this.PeriodTextTemplate
        this.Data.DayChip.sort(function(a,b){return b.Day-a.Day;})
        for(var i=0;i<this.Data.DayChip.length;++i)
        {
            var item=this.Data.DayChip[i];
            var rate=0;
            if (this.Data.ChipInfo && this.Data.ChipInfo.Vol>0) rate=item.Vol/this.Data.ChipInfo.Vol*100;
            var text=item.Day+'周期'+(this.ShowType==1?'前':'内')+'成本'+(IFrameSplitOperator.IsNumber(rate)? (rate.toFixed(1)+'%'):"--.-%");

            this.Canvas.fillStyle=item.Color;
            this.Canvas.fillRect(right-maxTextWidth,bottom-lineHeight,maxTextWidth,lineHeight);

            this.Canvas.fillStyle=this.DayInfoColor;
            this.Canvas.fillText(text,right-1,bottom);
            bottom-=lineHeight;
        }
    }

    this.DrawDayChip=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.DayChip)) return;

        var KLineFrame=this.HQChart.Frame.SubFrame[0].Frame;
        for(var i=0;i<this.Data.DayChip.length;++i)
        {
            var aryPoint=[];
            var chipData=this.Data.DayChip[i].Chip;
            if (!chipData) continue;
            var totalVol=0;
            for(var j=0;j<chipData.length;++j)
            {
                var vol=chipData[j];
                if(!vol) continue;
                totalVol+=vol;
                var price=(j+this.Data.MinPrice)/100;
                if (this.IsHScreen)
                {
                    var y=KLineFrame.GetYFromData(price);
                    var x=(vol/this.Data.MaxVol)*this.ClientRect.Height+this.ClientRect.Top;
                }
                else
                {
                    var y=KLineFrame.GetYFromData(price);
                    var x=(vol/this.Data.MaxVol)*this.ClientRect.Width+this.ClientRect.Left;
                }
               
                aryPoint.push({X:x,Y:y});
            }
            this.Data.DayChip[i].Vol=totalVol;
            this.DrawArea(aryPoint,this.Data.DayChip[i].Color);
        }
    }

    this.DrawArea=function(aryPoint,color)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) return;

        this.Canvas.fillStyle=color;
        this.Canvas.beginPath();
        if (this.IsHScreen)
        {
            this.Canvas.moveTo(aryPoint[0].Y,this.ClientRect.Top);
            for(var i=0; i<aryPoint.length; ++i)
            {
                var item=aryPoint[i];
                this.Canvas.lineTo(item.Y,item.X);
            }
            this.Canvas.lineTo(aryPoint[aryPoint.length-1].Y,this.ClientRect.Top);
        }
        else
        {
            this.Canvas.moveTo(this.ClientRect.Left,aryPoint[0].Y);
            for(var i=0; i<aryPoint.length; ++i)
            {
                var item=aryPoint[i];
                this.Canvas.lineTo(item.X,item.Y);
            }
            this.Canvas.lineTo(this.ClientRect.Left,aryPoint[aryPoint.length-1].Y);
        }
        
        this.Canvas.fill();
    }

    //关闭按钮
    this.DrawCloseButton=function()
    {
        var config=this.CloseButtonConfig;
        var rtButton=null;
        if (this.IsHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var right=border.Left-2;
            var bottom=border.ChartHeight-2;
            var left=right-config.Size;
            var top=bottom-config.Size;

            var rtButton={ Left:left, Top:top, Bottom:bottom, Right:right };
            rtButton.Width=rtButton.Right-rtButton.Left;
            rtButton.Height=rtButton.Bottom-rtButton.Top;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var top=border.Bottom+2;
            var bottom=top+config.Size;
            var right=border.ChartWidth-2;
            var left=right-config.Size;

            var rtButton={ Left:left, Top:top, Bottom:bottom, Right:right };
            rtButton.Width=rtButton.Right-rtButton.Left;
            rtButton.Height=rtButton.Bottom-rtButton.Top;
        }

        if (!rtButton) return;

        if (config.Border)
        {
            if (config.Border.BGColor) 
            {
                this.Canvas.fillStyle=config.Border.BGColor;
                this.Canvas.fillRect(rtButton.Left,rtButton.Top,rtButton.Width,rtButton.Height);
            }
        }

        var rtIcon={ Left:rtButton.Left+2, Right:rtButton.Right-2, Top:rtButton.Top+2, Bottom:rtButton.Bottom-2 };
        this.Canvas.strokeStyle=config.Color;
        this.Canvas.beginPath();
        this.Canvas.moveTo(rtIcon.Left,rtIcon.Top);
        this.Canvas.lineTo(rtIcon.Right,rtIcon.Bottom);
        this.Canvas.moveTo(rtIcon.Right,rtIcon.Top);
        this.Canvas.lineTo(rtIcon.Left,rtIcon.Bottom);
        this.Canvas.stroke();

        var btnItem={ ID:JSCHART_BUTTON_ID.CHIP_CLOSE, Rect:rtButton };
        this.Buttons.push(btnItem);
    }

    this.PtInButtons=function(x,y) //坐标是否在按钮上
    {
        for(var i=0;i<this.Buttons.length;++i)
        {
            var item=this.Buttons[i];
            if (!item.Rect) continue;
            var rect=item.Rect;
            if (x>=rect.Left && x<=rect.Right && y>=rect.Top && y<=rect.Bottom)
            {
                return { ID:item.ID, Rect:rect };
            }
        }

        return null;
    }

    /////////////////////////////////////////////////////////////////////////
    //计算
    this.CalculateChip=function()   //计算筹码
    {
        if (!this.HQChart) return false;
        if (!this.HQChart.FlowCapitalReady) return false;
        var symbol=this.HQChart.Symbol;
        if (!symbol) return false;

        var recvData=this.SendCalculateChipEvent();
        if (recvData && recvData.PreventDefault)
            return recvData.Result;

        if (MARKET_SUFFIX_NAME.IsSHSZIndex(symbol)) return false;   //指数暂时不支持移动筹码

        var bindData=this.HQChart.ChartPaint[0].Data;
        //if (bindData.Period>=4) return false;   //分钟K线不支持, 没时间做,以后再做吧
        var count=bindData.DataOffset+parseInt(this.HQChart.CursorIndex);
        if (count>=bindData.Data.length) count=bindData.Data.length-1;
        var selData=bindData.Data[count];
        var yPrice=selData.Close;

        var mouseY=this.HQChart.LastPoint.Y;
        if (mouseY) yPrice=this.HQChart.Frame.SubFrame[0].Frame.GetYData(mouseY);
        
        //JSConsole.Chart.Log("[StockChip::CalculateChip]",count,this.HQChart.CursorIndex,selData);
        const rate=1;
        var aryVol=[];
        var seed=1,vol,maxPrice,minPrice;
        for(let i=count;i>=0;--i)
        {
            var item=bindData.Data[i];
            var changeRate=1;   //换手率
            if (item.FlowCapital>0) changeRate=item.Vol/item.FlowCapital;
            if (i==count) vol=item.Vol*changeRate;
            else vol=item.Vol*seed;
            var dataItem={Vol:vol,High:item.High,Low:item.Low};
            aryVol.push(dataItem);
            seed*=(1-changeRate*rate);

            if (!maxPrice || maxPrice<item.High) maxPrice=item.High;
            if (!minPrice || minPrice>item.Low) minPrice=item.Low;
        }

        //JSConsole.Chart.Log("[StockChip::CalculateChip]",maxPrice,minPrice);
        if (!maxPrice || !minPrice) return true;

        var priceZoom=this.PriceZoom;

        maxPrice=parseInt(maxPrice*priceZoom);
        minPrice=parseInt(minPrice*priceZoom);

        var dataCount=maxPrice-minPrice;
        var aryChip=new Array()
        for(let i=0;i<=dataCount;++i)
        {
            aryChip.push(0);
        }

        var dayChip=[];
        var distributeData;
        if (this.ShowType==2)
        {
            var dayChip=
            [
                {Day:100, Color:this.DAY_COLOR[1][5]}, {Day:60, Color:this.DAY_COLOR[1][4]}, {Day:30, Color:this.DAY_COLOR[1][3]},
                {Day:20, Color:this.DAY_COLOR[1][2]}, {Day:10, Color:this.DAY_COLOR[1][1]}, {Day:5, Color:this.DAY_COLOR[1][0]}
            ];
            for(let i in aryVol)
            {
                var item=aryVol[i];
                var high=parseInt(item.High*priceZoom);
                var low=parseInt(item.Low*priceZoom);
                var averageVol=item.Vol;
                if (high-low>0) averageVol=item.Vol/(high-low);
                if (averageVol<=0.000000001) continue;

                for(var k=0;k<dayChip.length;++k)
                {
                    if (i==dayChip[k].Day) 
                    {
                        dayChip[k].Chip=aryChip.slice(0);
                        break;
                    }
                }

                distributeData={Low:low, High:high, Vol:item.Vol, MaxPrice:maxPrice, MinPrice:minPrice};
                this.CalculateDistribute(aryChip, distributeData );
            }
        }
        else if (this.ShowType==1)
        {
            var dayChip=
            [
                {Day:5, Color:this.DAY_COLOR[0][0]},{Day:10, Color:this.DAY_COLOR[0][1]},{Day:20, Color:this.DAY_COLOR[0][2]},
                {Day:30, Color:this.DAY_COLOR[0][3]},{Day:60, Color:this.DAY_COLOR[0][4]},{Day:100, Color:this.DAY_COLOR[0][5]}
            ];

            for(let i=aryVol.length-1;i>=0;--i)
            {
                var item=aryVol[i];
                var high=parseInt(item.High*priceZoom);
                var low=parseInt(item.Low*priceZoom);
                var averageVol=item.Vol;
                if (high-low>0) averageVol=item.Vol/(high-low);
                if (averageVol<=0.000000001) continue;

                for(var k=0;k<dayChip.length;++k)
                {
                    if (i==dayChip[k].Day) 
                    {
                        dayChip[k].Chip=aryChip.slice(0);
                        break;
                    }
                }
                
                distributeData={Low:low, High:high, Vol:item.Vol, MaxPrice:maxPrice, MinPrice:minPrice};
                this.CalculateDistribute(aryChip, distributeData);
            }
        }
        else
        {
            for(let i in aryVol)
            {
                var item=aryVol[i];
                var high=parseInt(item.High*priceZoom);
                var low=parseInt(item.Low*priceZoom);
                var averageVol=item.Vol;
                if (high-low>0) averageVol=item.Vol/(high-low);
                if (averageVol<=0.000000001) continue;

                distributeData={Low:low, High:high, Vol:item.Vol, MaxPrice:maxPrice, MinPrice:minPrice};
                this.CalculateDistribute(aryChip, distributeData);
            }
        }

        if (!distributeData) return false;

        this.Data={AllChip:aryChip, MaxVol:distributeData.MaxVol, MaxPrice:maxPrice, MinPrice:minPrice,SelectData:selData, DayChip:dayChip, YPrice:yPrice};
        return true;
    }

    this.SendCalculateChipEvent=function()
    {
        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_CALCULATE_CHIP_DATA);
        if (!event) return null;

        var bindData=this.HQChart.ChartPaint[0].Data;
        var curIndex=bindData.DataOffset+parseInt(this.HQChart.CursorIndex);
        var sendData=
        { 
            Symbol:this.HQChart.Symbol, Period:this.HQChart.Period, KData:bindData, 
            CurrentIndex:curIndex, Y:this.HQChart.LastPoint.Y, HQChart:this.HQChart,
            ShowType:this.ShowType, CalculateType:this.CalculateType,
            PreventDefault:false,
            Result:null,    //true/false
        };

        event.Callback(event, sendData, this);

        return sendData;
    }

    this.EvenlyDistribute=function(aryChip, data)    //平均分布 data={Low, High, Vol, MaxVol, MaxPrice, MinPrice }
    {
        var low=data.Low, high=data.High, maxPrice=data.MaxPrice, minPrice=data.MinPrice, maxVol=1;
        if ( (high-low)== 0) return;
        var averageVol=data.Vol/(high-low);

        for(var j=low;j<=high && j<=maxPrice;++j)
        {
            var index=j-minPrice;
            aryChip[index]+=averageVol;
            if (maxVol<aryChip[index]) maxVol=aryChip[index];
        }

        data.MaxVol=maxVol;
    }

    this.TriangleDistribute=function(aryChip, data)  //三角分布
    {
        var low=data.Low, high=data.High, maxPrice=data.MaxPrice, minPrice=data.MinPrice, maxVol=1;
        var ANGLE = 45, PI=3.1415926535;
        var middlePrice = (high - low) / 2.0 + low;

        var totalValue=0;
        var aryVol=[];
        for(var i=low+1, j=1 ;i<=middlePrice;++i,++j)
        {
            var y = Math.tan(ANGLE* PI / 180)*j;

            totalValue+=y;
            aryVol.push({Index:i-minPrice, Value:y});
        }

        for(var i=high-1, j=1 ;i>middlePrice;--i,++j)
        {
            var y = Math.tan(ANGLE* PI / 180)*j;

            totalValue+=y
            aryVol.push({Index:i-minPrice, Value:y});
        }

        if (totalValue>0)
        {
            for(var i=0;i<aryVol.length;++i)
            {
                var item=aryVol[i];
                aryChip[item.Index]+=item.Value*data.Vol/totalValue;
                if (maxVol<aryChip[item.Index]) maxVol=aryChip[item.Index];
            }

            data.MaxVol=maxVol;
        }
    }

    this.CalculateDistribute=function(aryChip, data)
    {
        if (this.CalculateType==1) this.TriangleDistribute(aryChip, data);
        else this.EvenlyDistribute(aryChip, data);
    }

    this.CalculateCast=function()   //计算 90% 70%的成本价
    {
        if (!this.Data.ChipInfo || !this.Data.ChipInfo.Vol) return;

        var aryCast=
        [
            {Start:0.05,End:0.95, MaxPrice:0, MinPrice:0, Rate:0},
            {Start:0.15,End:0.85, MaxPrice:0, MinPrice:0, Rate:0}
        ];

        var averagePrice=this.Data.ChipInfo.AveragePrice;
        var totalProfitVol=this.Data.ChipInfo.ProfitVol;
        var tempVol=0;
        for(var i=0, castCount=0;i<this.Data.AllChip.length;++i)
        {
            if (castCount==4) break;
            var vol=this.Data.AllChip[i];
            if (vol<=0) continue;

            var price=(i+this.Data.MinPrice)/this.PriceZoom;
            tempVol+=vol;
            var rate=tempVol/totalProfitVol;
            
            for(var j=0; j<aryCast.length; ++j)
            {
                var itemCast=aryCast[j];
                if (itemCast.MinPrice<=0 && rate>itemCast.Start)
                {
                    itemCast.MinPrice=price;
                    ++castCount;
                }

                if (itemCast.MaxPrice<=0 && rate>itemCast.End)
                {
                    itemCast.MaxPrice=price;
                    ++castCount;
                }
            }
        }

        for(var i=0; i<aryCast.length; ++i)
        {
            var item=aryCast[i];
            var addPrice=item.MaxPrice+item.MinPrice;
            if (addPrice) item.Rate=Math.abs(item.MaxPrice-item.MinPrice)/addPrice*100;
        }

        this.Data.Cast=aryCast;
    }

}   

/*
    扩展图形
*/
function ExtendChartPaintFactory()
{
    this.DataMap=new Map(
        [
            //["FrameSplitPaint", { Create:function() { return new FrameSplitPaint(); } }],
        ]
    );

    this.SetCallbackDraw=new Set();

    this.Create=function(name)
    {
        if (!this.DataMap.has(name)) return null;

        var item=this.DataMap.get(name);
        return item.Create();
    }

    this.Add=function(name, option)
    {
        this.DataMap.set(name, { Create:option.Create } );
    }

    this.AddCallbackDrawClassName=function(className)
    {
        if (!className) return;

        this.SetCallbackDraw.add(className);
    }

    this.IsCallbackDraw=function(className)
    {
        return this.SetCallbackDraw.has(className);
    }
}

var g_ExtendChartPaintFactory=new ExtendChartPaintFactory();

//导出统一使用JSCommon命名空间名
export
{
    IExtendChartPainting,
    KLineTooltipPaint,
    BarragePaint,
    MinuteTooltipPaint,
    BackgroundPaint,
    g_ExtendChartPaintFactory,
    StockChipPhone,
}
/*
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
*/