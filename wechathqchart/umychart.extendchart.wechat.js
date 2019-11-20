/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    图形扩展画法
*/ 

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import {
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData
} from "./umychart.data.wechat.js";

import { JSCommonCoordinateData as JSCommonCoordinateData } from "./umychart.coordinatedata.wechat.js";

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

//配色
function JSExtendChartPaintResource() 
{
    //K线tooltip
    this.TooltipPaint = 
    {
        BGColor: 'rgba(250,250,250,0.8)',    //背景色
        BorderColor: 'rgb(120,120,120)',     //边框颜色
        TitleColor: 'rgb(120,120,120)',       //标题颜色
        TitleFont: '13px 微软雅黑'   //字体
    },

    //弹幕
    this.Barrage = 
    {
        Font: '16px 微软雅黑',   //字体
        Height: 20,
        Color: 'RGB(109,109,109)'
    }
}

var g_JSExtendChartPaintResource = new JSExtendChartPaintResource();

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

    this.BorderColor = g_JSExtendChartPaintResource.TooltipPaint.BorderColor;    //边框颜色
    this.BGColor = g_JSExtendChartPaintResource.TooltipPaint.BGColor;            //背景色
    this.TitleColor = g_JSExtendChartPaintResource.TooltipPaint.TitleColor;      //标题颜色
    this.Font = [g_JSExtendChartPaintResource.TooltipPaint.TitleFont];

    this.Width = 50;
    this.Height = 100;
    this.LineHeight = 15; //行高

    this.Left = 1;
    this.Top = 0;

    this.HQChart;
    this.KLineTitlePaint;
    this.IsHScreen = false;   //是否横屏

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

        var lineCount = 8;    //显示函数
        if (this.ClassName === 'MinuteTooltipPaint') 
        {
            lineCount=7;
        }
        else
        {
            if (klineData.Time != null && !isNaN(klineData.Time) && klineData.Time > 0) lineCount = 9; //分钟K线多一列时间
        }

        //this.TitleColor=this.KLineTitlePaint.UnchagneColor;
        this.IsHScreen = this.ChartFrame.IsHScreen === true;
        this.Canvas.font = this.Font[0];
        this.Width = this.Canvas.measureText(' 擎: 9999.99亿 ').width;
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

        if (item.Time != null && !isNaN(item.Time) && item.Time > 0) 
        {
            top += this.LineHeight;
            text = this.HQChart.FormatTimeString(item.Time);
            this.Canvas.fillText(text, left, top);
        }

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('开:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.Open, item.YClose);
        text = item.Open.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('高:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.High, item.YClose);
        var text = item.High.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('低:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.Low, item.YClose);
        var text = item.Low.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('收:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.Close, item.YClose);
        var text = item.Close.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('幅:', left, top);
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

        top += this.LineHeight;
        this.Canvas.fillText('量:', left, top);
        var text = this.HQChart.FormatValueString(item.Vol, 2);
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillText('额:', left, top);
        var text = this.HQChart.FormatValueString(item.Amount, 2);
        this.Canvas.fillText(text, left + labelWidth, top);

        if (this.IsHScreen) this.Canvas.restore();
    }

    //设置参数接口
    this.SetOption = function (option) 
    {
        if (option.LineHeight > 0) this.LineHeight = option.LineHeight;
        if (option.BGColor) this.BGColor = option.BGColor;
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
        this.Canvas.fillText('价:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.Close, this.YClose);
        text = item.Close.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('均:', left, top);
        var color = this.KLineTitlePaint.GetColor(item.AvPrice, this.YClose);
        var text = item.AvPrice.toFixed(defaultfloatPrecision);
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillStyle = this.TitleColor;
        this.Canvas.fillText('幅:', left, top);
        var value = (item.Close - this.YClose) / this.YClose * 100;
        var color = this.KLineTitlePaint.GetColor(value, 0);
        var text = value.toFixed(2) + '%';
        this.Canvas.fillStyle = color;
        this.Canvas.fillText(text, left + labelWidth, top);

        this.Canvas.fillStyle = this.TitleColor;

        top += this.LineHeight;
        this.Canvas.fillText('量:', left, top);
        var text = this.HQChart.FormatValueString(item.Vol, 2);
        this.Canvas.fillText(text, left + labelWidth, top);

        top += this.LineHeight;
        this.Canvas.fillText('额:', left, top);
        var text = this.HQChart.FormatValueString(item.Amount, 2);
        this.Canvas.fillText(text, left + labelWidth, top);

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

    this.Font = g_JSExtendChartPaintResource.Barrage.Font;
    this.TextColor = g_JSExtendChartPaintResource.Barrage.Color;
    this.FontHeight = g_JSExtendChartPaintResource.Barrage.Height;

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
    },

    //单个类导出
    JSCommonExtendChartPaint_IExtendChartPainting: IExtendChartPainting,
    JSCommonExtendChartPaint_KLineTooltipPaint: KLineTooltipPaint,
    JSCommonExtendChartPaint_BarragePaint: BarragePaint,
    JSCommonExtendChartPaint_MinuteTooltipPaint: MinuteTooltipPaint,
};