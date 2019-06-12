////////////////////////////////////////////////////////////////////////////////
//
// 扩展画法

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import {
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData
} from "umychart.data.wechat.js";

import { JSCommonCoordinateData as JSCommonCoordinateData } from "umychart.coordinatedata.wechat.js";

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
    };
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
        if (klineData.Time != null && !isNaN(klineData.Time) && klineData.Time > 0) lineCount = 9; //分钟K线多一列时间

        //this.TitleColor=this.KLineTitlePaint.UnchagneColor;
        this.IsHScreen = this.ChartFrame.IsHScreen === true;
        this.Canvas.font = this.Font[0];
        this.Width = this.Canvas.measureText(' 擎: 9999.99亿 ').width;
        this.Height = this.LineHeight * lineCount + 2 * 2;

        this.DrawBG();
        this.DrawKLineData(klineData);
        this.DrawBorder();
    }

    this.DrawBorder = function () 
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var left = this.GetLeft();
        var top = this.GetTop();
        this.Canvas.strokeStyle = this.BorderColor;
        if (isHScreen) this.Canvas.strokeRect(this.HQChart.ToFixedPoint(left), this.HQChart.ToFixedPoint(top), this.Height, this.Width);
        else this.Canvas.strokeRect(this.HQChart.ToFixedPoint(left), this.HQChart.ToFixedPoint(top), this.Width, this.Height);
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

    this.DrawKLineData = function (item) 
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
        var value = (item.Close - item.YClose) / item.YClose * 100;
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

    //设置参数接口
    this.SetOption = function (option) 
    {
        if (option.LineHeight > 0) this.LineHeight = option.LineHeight;
        if (option.BGColor) this.BGColor = option.BGColor;
    }
}

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonExtendChartPaint:
    {
        IExtendChartPainting: IExtendChartPainting,
        KLineTooltipPaint: KLineTooltipPaint,
    },

    //单个类导出
    JSCommonExtendChartPaint_IExtendChartPainting: IExtendChartPainting,
    JSCommonExtendChartPaint_KLineTooltipPaint: KLineTooltipPaint,
};