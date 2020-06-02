/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    小程序图形库
*/

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import 
{
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData,
    JSCommon_Rect as Rect,
} from "./umychart.data.wechat.js";

import 
{
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
} from './umychart.resource.wechat.js'

import 
{
    JSCommonSplit_IFrameSplitOperator as IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

import
{
    JSCommonCoordinateData as JSCommonCoordinateData,
    JSCommonCoordinateData_MARKET_SUFFIX_NAME as MARKET_SUFFIX_NAME
} from "./umychart.coordinatedata.wechat.js";

//配色
function JSChartPaintResource() 
{
    //指标不支持信息
    this.Index= 
    {
        NotSupport : { Font: "14px 微软雅黑", TextColor: "rgb(52,52,52)" }
    }
}
var g_JSChartPaintResource = new JSChartPaintResource();


//图新画法接口类
function IChartPainting() 
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName = 'IChartPainting';    //类名
    this.Data = new ChartData();          //数据区

    this.NotSupportMessage = null;
    this.MessageFont = g_JSChartPaintResource.Index.NotSupport.Font;
    this.MessageColor = g_JSChartPaintResource.Index.NotSupport.TextColor;

    this.IsDrawFirst = false;             //是否比K线先画
    this.IsShow = true;                   //是否显示

    this.Draw = function () { }

    this.DrawNotSupportmessage = function () 
    {
        this.Canvas.font = this.MessageFont;
        this.Canvas.fillStyle = this.MessageColor;

        var left = this.ChartBorder.GetLeft();
        var width = this.ChartBorder.GetWidth();
        var top = this.ChartBorder.GetTopEx();
        var height = this.ChartBorder.GetHeightEx();

        var x = left + width / 2;
        var y = top + height / 2;

        this.Canvas.textAlign = "center";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillText(this.NotSupportMessage, x, y);
    }

    this.GetTooltipData = function (x, y, tooltip) 
    {
        return false;
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;

        if (!this.Data || !this.Data.Data) return range;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null || isNaN(value)) continue;

            if (range.Max == null) range.Max = value;
            if (range.Min == null) range.Min = value;

            if (range.Max < value) range.Max = value;
            if (range.Min > value) range.Min = value;
        }

        return range;
    }

    this.GetDynamicFont = function (dataWidth) //根据宽度自动获取对应字体
    {
        var font;
        if (dataWidth < 5) font = '4px Arial';           //字体根据数据宽度动态调整
        else if (dataWidth < 7) font = '6px Arial';
        else if (dataWidth < 9) font = '8px Arial';
        else if (dataWidth < 11) font = '10px Arial';
        else if (dataWidth < 13) font = '12px Arial';
        else if (dataWidth < 15) font = '14px Arial';
        else font = '16px Arial';

        return font;
    }

    this.SetFillStyle = function (color, x0, y0, x1, y1) 
    {
        if (Array.isArray(color)) 
        {
            let gradient = this.Canvas.createLinearGradient(x0, y0, x1, y1);
            var offset = 1 / (color.length);
            for (var i in color)
            {
                gradient.addColorStop(i * offset, color[i]);
            }
            this.Canvas.fillStyle = gradient;
        }
        else 
        {
            this.Canvas.fillStyle = color;
        }
    }
}

//K线画法
function ChartKLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'ChartKLine';
    this.Symbol;        //股票代码
    this.DrawType = 0;    // 0=K线  1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积
    this.CloseLineColor = g_JSChartResource.CloseLineColor;
    this.CloseLineAreaColor = g_JSChartResource.CloseLineAreaColor;
    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;
    this.UnchagneColor = g_JSChartResource.UnchagneBarColor;          //平盘
    this.ColorData;             //五彩K线颜色 >0 UpColor 其他 DownColor
    this.TradeData;             //交易系统 包含买卖数据{Buy:, Sell:}

    this.IsShowMaxMinPrice = true;                 //是否显示最大最小值
    this.TextFont = g_JSChartResource.KLine.MaxMin.Font;
    this.TextColor = g_JSChartResource.KLine.MaxMin.Color;
    this.InfoPointColor = g_JSChartResource.KLine.Info.Color;
    this.InfoPointColor2 = g_JSChartResource.KLine.Info.Color2;
    this.InfoDrawType = 0;    //0=在底部画远点  1=在最低价画三角

    this.PtMax;     //最大值的位置
    this.PtMin;     //最小值的位置

    this.DrawAKLine = function ()  //美国线
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var ptMax = { X: null, Y: null, Value: null, Align: 'left' };
        var ptMin = { X: null, Y: null, Value: null, Align: 'left' };
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low);
            var yHigh = this.ChartFrame.GetYFromData(data.High);
            var yOpen = this.ChartFrame.GetYFromData(data.Open);
            var yClose = this.ChartFrame.GetYFromData(data.Close);

            if (ptMax.Value == null || ptMax.Value < data.High)     //求最大值
            {
                ptMax.X = x;
                ptMax.Y = yHigh;
                ptMax.Value = data.High;
                ptMax.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (ptMin.Value == null || ptMin.Value > data.Low)      //求最小值
            {
                ptMin.X = x;
                ptMin.Y = yLow;
                ptMin.Value = data.Low;
                ptMin.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (data.Open < data.Close) this.Canvas.strokeStyle = this.UpColor; //阳线
            else if (data.Open > data.Close) this.Canvas.strokeStyle = this.DownColor; //阳线
            else this.Canvas.strokeStyle = this.UnchagneColor; //平线

            this.Canvas.beginPath();   //最高-最低
            if (isHScreen) {
                this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                this.Canvas.lineTo(yLow, ToFixedPoint(x));
            }
            else {
                this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                this.Canvas.lineTo(ToFixedPoint(x), yLow);
            }

            this.Canvas.stroke();

            if (dataWidth >= 4) {
                this.Canvas.beginPath();    //开盘
                if (isHScreen) {
                    this.Canvas.moveTo(ToFixedPoint(yOpen), left);
                    this.Canvas.lineTo(ToFixedPoint(yOpen), x);
                }
                else {
                    this.Canvas.moveTo(left, ToFixedPoint(yOpen));
                    this.Canvas.lineTo(x, ToFixedPoint(yOpen));
                }
                this.Canvas.stroke();

                this.Canvas.beginPath();    //收盘
                if (isHScreen) {
                    this.Canvas.moveTo(ToFixedPoint(yClose), right);
                    this.Canvas.lineTo(ToFixedPoint(yClose), x);
                }
                else {
                    this.Canvas.moveTo(right, ToFixedPoint(yClose));
                    this.Canvas.lineTo(x, ToFixedPoint(yClose));
                }
                this.Canvas.stroke();
            }

            if (this.Data.DataType == 0 && this.Data.Period === 0) //信息地雷
            {
                var infoItem = { X: x, Xleft: left, XRight: right, YMax: yHigh, YMin: yLow, DayData: data, Index: j };
                this.DrawInfoDiv(infoItem);
            }
        }

        this.PtMax = ptMax;
        this.PtMin = ptMin;
    }

    this.DrawCloseLine = function ()   //收盘价线
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var bFirstPoint = true;
        this.Canvas.beginPath();
        this.Canvas.strokeStyle = this.CloseLineColor;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close);

            if (bFirstPoint) {
                if (isHScreen) this.Canvas.moveTo(yClose, x);
                else this.Canvas.moveTo(x, yClose);
                bFirstPoint = false;
            }
            else {
                if (isHScreen) this.Canvas.lineTo(yClose, x);
                else this.Canvas.lineTo(x, yClose);
            }
        }

        if (bFirstPoint == false) this.Canvas.stroke();
    }

    this.DrawCloseArea = function ()   //收盘价面积
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var bFirstPoint = true;
        var firstPoint = null;
        this.Canvas.beginPath();
        this.Canvas.strokeStyle = this.CloseLineColor;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close);

            if (bFirstPoint) {
                if (isHScreen) {
                    this.Canvas.moveTo(yClose, x);
                    firstPoint = { X: yClose, Y: x };
                }
                else {
                    this.Canvas.moveTo(x, yClose);
                    firstPoint = { X: x, Y: yClose };
                }
                bFirstPoint = false;
            }
            else {
                if (isHScreen) this.Canvas.lineTo(yClose, x);
                else this.Canvas.lineTo(x, yClose);
            }
        }

        if (bFirstPoint) return;

        this.Canvas.stroke();
        //画面积
        if (isHScreen) {
            this.Canvas.lineTo(this.ChartBorder.GetLeft(), x);
            this.Canvas.lineTo(this.ChartBorder.GetLeft(), firstPoint.Y);
        }
        else {
            this.Canvas.lineTo(x, this.ChartBorder.GetBottom());
            this.Canvas.lineTo(firstPoint.X, this.ChartBorder.GetBottom());
        }
        this.Canvas.closePath();

        if (Array.isArray(this.CloseLineAreaColor)) {
            if (isHScreen) {
                let gradient = this.Canvas.createLinearGradient(this.ChartBorder.GetRightEx(), this.ChartBorder.GetTop(), this.ChartBorder.GetLeft(), this.ChartBorder.GetTop());
                gradient.addColorStop(0, this.CloseLineAreaColor[0]);
                gradient.addColorStop(1, this.CloseLineAreaColor[1]);
                this.Canvas.fillStyle = gradient;
            }
            else {
                let gradient = this.Canvas.createLinearGradient(firstPoint.X, this.ChartBorder.GetTopEx(), firstPoint.X, this.ChartBorder.GetBottom());
                gradient.addColorStop(0, this.CloseLineAreaColor[0]);
                gradient.addColorStop(1, this.CloseLineAreaColor[1]);
                this.Canvas.fillStyle = gradient;
            }
        }
        else {
            this.Canvas.fillStyle = this.CloseLineAreaColor;
        }
        this.Canvas.fill();
    }

    this.DrawKBar = function () 
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;

        if (isHScreen) {
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            chartright = this.ChartBorder.GetBottom();
        }

        var ptMax = { X: null, Y: null, Value: null, Align: 'left' };
        var ptMin = { X: null, Y: null, Value: null, Align: 'left' };

        var upColor = this.UpColor;
        var downColor = this.DownColor;
        var unchagneColor = this.UnchagneColor;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright)
                break;

            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low);
            var yHigh = this.ChartFrame.GetYFromData(data.High);
            var yOpen = this.ChartFrame.GetYFromData(data.Open);
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            var y = yHigh;

            if (ptMax.Value == null || ptMax.Value < data.High)     //求最大值
            {
                ptMax.X = x;
                ptMax.Y = yHigh;
                ptMax.Value = data.High;
                ptMax.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (ptMin.Value == null || ptMin.Value > data.Low)      //求最小值
            {
                ptMin.X = x;
                ptMin.Y = yLow;
                ptMin.Value = data.Low;
                ptMin.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (this.ColorData) ///五彩K线颜色设置
            {
                if (i < this.ColorData.length)
                    upColor = downColor = unchagneColor = (this.ColorData[i] > 0 ? this.UpColor : this.DownColor);
                else
                    upColor = downColor = unchagneColor = this.DownColor;
            }

            if (data.Open < data.Close)       //阳线
            {
                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = upColor;
                    if (data.High > data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(this.DrawType == 3 ? Math.max(yClose, yOpen) : yClose), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(this.DrawType == 3 ? Math.min(yClose, yOpen) : yClose));
                        }
                        this.Canvas.stroke();
                        y = yClose;
                    }
                    else 
                    {
                        y = yClose;
                    }

                    this.Canvas.fillStyle = upColor;
                    if (isHScreen) 
                    {
                        if (Math.abs(yOpen - y) < 1) 
                        {
                            this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                        }
                        else 
                        {
                            if (this.DrawType == 3) //空心柱
                            {
                                this.Canvas.beginPath();
                                this.Canvas.rect(ToFixedPoint(y), ToFixedPoint(left), ToFixedRect(yOpen - y), ToFixedRect(dataWidth));
                                this.Canvas.stroke();
                            }
                            else 
                            {
                                //宽度是负数竟然不会画, h5就可以
                                //this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), ToFixedRect(yOpen - y), ToFixedRect(dataWidth));
                                this.Canvas.fillRect(ToFixedRect(Math.min(yOpen, y)), ToFixedRect(left), ToFixedRect(Math.abs(yOpen - y)), ToFixedRect(dataWidth));
                            }
                        }
                    }
                    else 
                    {
                        if (Math.abs(yOpen - y) < 1) 
                        {
                            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), 1);    //高度小于1,统一使用高度1
                        }
                        else 
                        {
                            if (this.DrawType == 3) //空心柱
                            {
                                this.Canvas.beginPath();
                                this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(y), ToFixedRect(dataWidth), ToFixedRect(yOpen - y));
                                this.Canvas.stroke();
                            }
                            else 
                            {
                                this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), ToFixedRect(yOpen - y));
                            }
                        }
                    }

                    if (data.Open > data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(this.DrawType == 3 ? Math.min(yClose, yOpen) : y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(this.DrawType == 3 ? Math.max(yClose, yOpen) : y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                        this.Canvas.stroke();
                    }
                }
                else 
                {
                    this.Canvas.beginPath();
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                    this.Canvas.strokeStyle = upColor;
                    this.Canvas.stroke();
                }
            }
            else if (data.Open > data.Close)  //阴线
            {
                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = downColor;
                    if (data.High > data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        if (isHScreen)
                         {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yOpen), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yOpen));
                        }
                        this.Canvas.stroke();
                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen
                    }

                    this.Canvas.fillStyle = downColor;
                    if (isHScreen) 
                    {
                        if (Math.abs(yClose - y) < 1) 
                        {
                            this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                        }
                        else 
                        {
                            //宽度是负数竟然不会画, h5就可以
                            this.Canvas.fillRect(ToFixedRect(Math.min(yClose, y)), ToFixedRect(left), ToFixedRect(Math.abs(yClose - y)), ToFixedRect(dataWidth));
                        }
                    }
                    else 
                    {
                        if (Math.abs(yClose - y) < 1) this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), 1);    //高度小于1,统一使用高度1
                        else this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), ToFixedRect(yClose - y));
                    }

                    if (data.Open > data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                        this.Canvas.stroke();
                    }
                }
                else 
                {
                    this.Canvas.beginPath();
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                    this.Canvas.strokeStyle = downColor;
                    this.Canvas.stroke();
                }
            }
            else // 平线
            {
                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = unchagneColor;
                    this.Canvas.beginPath();
                    if (data.High > data.Close)   //上影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(y, ToFixedPoint(x));
                            this.Canvas.lineTo(yOpen, ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), y);
                            this.Canvas.lineTo(ToFixedPoint(x), yOpen);
                        }
                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen;
                    }

                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(left));
                        this.Canvas.lineTo(ToFixedPoint(y), ToFixedPoint(right));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(left), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(y));
                    }

                    if (data.Open > data.Low) //下影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                    }

                    this.Canvas.stroke();
                }
                else 
                {
                    this.Canvas.beginPath();
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                    this.Canvas.strokeStyle = unchagneColor;
                    this.Canvas.stroke();
                }
            }

            if (this.Data.DataType == 0 && this.Data.Period === 0) //信息地雷
            {
                var infoItem = { X: x, Xleft: left, XRight: right, YMax: yHigh, YMin: yLow, DayData: data, Index: j };
                this.DrawInfoDiv(infoItem);
            }
        }

        this.PtMax = ptMax;
        this.PtMin = ptMin;
    }

    this.DrawTrade = function ()       //交易系统
    {
        if (!this.TradeData) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;

        if (isHScreen) {
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            chartright = this.ChartBorder.GetBottom();
        }

        var sellData = this.TradeData.Sell;
        var buyData = this.TradeData.Buy;
        var arrowWidth = dataWidth;
        if (arrowWidth > 10) arrowWidth = 10;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var buy = false, sell = false;
            if (sellData && i < sellData.length) sell = sellData[i] > 0;
            if (buyData && i < buyData.length) buy = buyData[i] > 0;
            if (!sell && !buy) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low);
            var yHigh = this.ChartFrame.GetYFromData(data.High);
            var yOpen = this.ChartFrame.GetYFromData(data.Open);
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            var y = yHigh;

            if (buy) {
                this.Canvas.fillStyle = this.UpColor;
                this.Canvas.strokeStyle = this.UnchagneColor;
                this.Canvas.beginPath();
                if (isHScreen) {
                    this.Canvas.moveTo(yLow - 1, x);
                    this.Canvas.lineTo(yLow - arrowWidth - 1, x - arrowWidth / 2);
                    this.Canvas.lineTo(yLow - arrowWidth - 1, x + arrowWidth / 2);
                }
                else {
                    this.Canvas.moveTo(x, yLow + 1);
                    this.Canvas.lineTo(x - arrowWidth / 2, yLow + arrowWidth + 1);
                    this.Canvas.lineTo(x + arrowWidth / 2, yLow + arrowWidth + 1);
                }
                this.Canvas.closePath();
                this.Canvas.fill();
                this.Canvas.stroke();
            }

            if (sell) {
                this.Canvas.fillStyle = this.DownColor;
                this.Canvas.strokeStyle = this.UnchagneColor;
                this.Canvas.beginPath();
                if (isHScreen) {
                    this.Canvas.moveTo(yHigh + 1, x);
                    this.Canvas.lineTo(yHigh + arrowWidth + 1, x - arrowWidth / 2);
                    this.Canvas.lineTo(yHigh + arrowWidth + 1, x + arrowWidth / 2);
                }
                else {
                    this.Canvas.moveTo(x, yHigh - 1);
                    this.Canvas.lineTo(x - arrowWidth / 2, yHigh - arrowWidth - 1);
                    this.Canvas.lineTo(x + arrowWidth / 2, yHigh - arrowWidth - 1);
                }
                this.Canvas.closePath();
                this.Canvas.fill();
                this.Canvas.stroke();
            }
        }
    }

    this.Draw = function () {
        this.PtMax = { X: null, Y: null, Value: null, Align: 'left' }; //清空最大
        this.PtMin = { X: null, Y: null, Value: null, Align: 'left' }; //清空最小
        this.ChartFrame.ChartKLine = { Max: null, Min: null };   //保存K线上 显示最大最小值坐标

        if (this.IsShow == false) return;

        if (this.DrawType == 1) {
            this.DrawCloseLine();
            return;
        }
        else if (this.DrawType == 2) {
            this.DrawAKLine();
        }
        else if (this.DrawType == 4) {
            this.DrawCloseArea();
        }
        else {
            this.DrawKBar();
        }

        this.DrawTrade();

        if (this.IsShowMaxMinPrice)     //标注最大值最小值
        {
            if (this.ChartFrame.IsHScreen === true) this.HScreenDrawMaxMinPrice(this.PtMax, this.PtMin);
            else this.DrawMaxMinPrice(this.PtMax, this.PtMin);
        }
    }

    this.DrawMaxMinPrice = function (ptMax, ptMin) {
        if (ptMax.X == null || ptMax.Y == null || ptMax.Value == null) return;
        if (ptMin.X == null || ptMin.Y == null || ptMin.Value == null) return;

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        this.Canvas.font = this.TextFont;
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.textAlign = ptMax.Align;
        this.Canvas.textBaseline = 'bottom';
        var left = ptMax.X;
        var text = ptMax.Value.toFixed(defaultfloatPrecision);
        if (ptMax.Align == 'left') text = '←' + text;
        else text = text + '→';
        this.Canvas.fillText(text, left, ptMax.Y);
        this.ChartFrame.ChartKLine.Max = { X: left, Y: ptMax.Y, Text: { BaseLine: 'bottom' } };

        this.Canvas.textAlign = ptMin.Align;
        this.Canvas.textBaseline = 'top';
        var left = ptMin.X;
        text = ptMin.Value.toFixed(defaultfloatPrecision);
        if (ptMin.Align == 'left') text = '←' + text;
        else text = text + '→';
        this.Canvas.fillText(text, left, ptMin.Y);
        this.ChartFrame.ChartKLine.Min = { X: left, Y: ptMin.Y, Text: { BaseLine: 'top' } };
    }

    this.HScreenDrawMaxMinPrice = function (ptMax, ptMin)   //横屏模式下显示最大最小值
    {
        if (ptMax.X == null || ptMax.Y == null || ptMax.Value == null) return;
        if (ptMin.X == null || ptMin.Y == null || ptMin.Value == null) return;

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        var xText = ptMax.Y;
        var yText = ptMax.X;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.textAlign = ptMax.Align;
        this.Canvas.textBaseline = 'bottom';
        var text = ptMax.Value.toFixed(defaultfloatPrecision);
        if (ptMax.Align == 'left') text = '←' + text;
        else text = text + '→';
        this.Canvas.fillText(text, 0, 0);
        this.Canvas.restore();


        var xText = ptMin.Y;
        var yText = ptMin.X;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.textAlign = ptMin.Align;
        this.Canvas.textBaseline = 'top';
        var text = ptMin.Value.toFixed(defaultfloatPrecision);
        if (ptMin.Align == 'left') text = '←' + text;
        else text = text + '→';
        this.Canvas.fillText(text, 0, 0);
        this.Canvas.restore();
    }

    //画某一天的信息地雷 画在底部
    this.DrawInfoDiv = function (item) {
        if (!this.InfoData || this.InfoData.length <= 0) return;

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;

        var infoData = this.InfoData.get(item.DayData.Date.toString());
        if (!infoData || infoData.Data.length <= 0) return;
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        if (this.InfoDrawType === 1) {
            this.Canvas.font = this.GetDynamicFont(dataWidth);
            this.Canvas.fillStyle = this.InfoPointColor2;
            this.Canvas.textAlign = 'center';
            this.Canvas.textBaseline = 'top';
            if (bHScreen) {
                var xText = item.YMin;
                var yText = item.X;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText('▲', 0, 0);
                this.Canvas.restore();
            }
            else {
                var left = ToFixedPoint(item.X);
                this.Canvas.fillText('▲', left, item.YMin);
            }
        }
        else {
            var dataWidth = this.ChartFrame.DataWidth;
            var radius = dataWidth / 2;
            if (radius > 3) radius = 3;
            var x = item.X;
            var y = this.ChartFrame.ChartBorder.GetBottom() - 2 - radius;
            if (bHScreen) y = this.ChartFrame.ChartBorder.GetLeft() + 2 + radius;

            this.Canvas.fillStyle = this.InfoPointColor;
            this.Canvas.beginPath();
            if (bHScreen) this.Canvas.arc(y, x, radius, 0, Math.PI * 2, true);
            else this.Canvas.arc(ToFixedPoint(x), y, radius, 0, Math.PI * 2, true);
            this.Canvas.closePath();
            this.Canvas.fill();
        }
    }

    this.GetTooltipData = function (x, y, tooltip) {
        return false;
    }

    this.GetMaxMin = function () //计算当天显示数据的最大最小值
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Max = null;
        range.Min = null;

        if (this.IsShow == false) return range;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (range.Max == null) range.Max = data.High;
            if (range.Min == null) range.Min = data.Low;

            if (range.Max < data.High) range.Max = data.High;
            if (range.Min > data.Low) range.Min = data.Low;
        }

        return range;
    }
}



/*
    文字输出 支持横屏
    数组不为null的数据中输出 this.Text文本
*/
function ChartSingleText() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)";           //线段颜色
    this.TextFont = "14px 微软雅黑";           //字体
    this.Text;
    this.TextAlign = 'left';
    this.Direction = 0;       //0=middle 1=bottom 2=top
    this.YOffset = 0;

    this.Draw = function () 
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true)
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var top = this.ChartBorder.GetTopEx();
        var bottom = this.ChartBorder.GetBottomEx();
        if (isHScreen) 
        {
            chartright = this.ChartBorder.GetBottom();
            top = this.ChartBorder.GetRightEx();
            bottom = this.ChartBorder.GetLeftEx();
        }
        var xPointCount = this.ChartFrame.XPointCount;

        var isArrayText = Array.isArray(this.Text);
        var text;
        if (this.Direction == 1) this.Canvas.textBaseline = 'bottom';
        else if (this.Direction == 2) this.Canvas.textBaseline = 'top';
        else this.Canvas.textBaseline = 'middle';
        this.TextFont = this.GetDynamicFont(dataWidth);
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.textAlign = this.TextAlign;
            this.Canvas.fillStyle = this.Color;
            this.Canvas.font = this.TextFont;

            if (this.YOffset > 0 && this.Direction > 0) 
            {
                var yPrice = y;
                
                this.Canvas.save();
                this.Canvas.setLineDash([5, 10]);
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    if (this.Direction == 1) 
                    {
                        y = top - this.YOffset;
                        yPrice += 5;
                    }
                    else 
                    {
                        y = bottom + this.YOffset;
                        yPrice -= 5;
                    }
                    this.Canvas.moveTo(ToFixedPoint(yPrice), ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(y), ToFixedPoint(x));
                }
                else
                {
                    if (this.Direction == 1) 
                    {
                        y = top + this.YOffset;
                        yPrice += 5;
                    }
                    else 
                    {
                        y = bottom - this.YOffset;
                        yPrice -= 5;
                    }
                    this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(yPrice));
                    this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(y));
                }
                
                this.Canvas.stroke();
                this.Canvas.restore();
            }

            if (isArrayText) 
            {
                text = this.Text[i];
                if (!text) continue;
                this.DrawText(text, x, y, isHScreen);
            }
            else 
            {
                this.DrawText(this.Text, x, y, isHScreen);
            }
        }
    }

    this.DrawText = function (text, x, y, isHScreen) 
    {
        if (isHScreen) 
        {
            this.Canvas.save();
            this.Canvas.translate(y, x);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text, 0, 0);
            this.Canvas.restore();
        }
        else 
        {
            this.Canvas.fillText(text, x, y);
        }
    }
}


//线段
function ChartLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartLine';
    this.Color = "rgb(255,193,37)"; //线段颜色
    this.LineWidth;               //线段宽度
    this.DrawType = 0;            //画图方式  0=无效数平滑  1=无效数不画断开
    this.IsDotLine = false;           //虚线

    this.Draw = function () 
    {
        if (!this.IsShow) return;
        if (this.NotSupportMessage)
         {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        switch (this.DrawType) 
        {
            case 0:
                return this.DrawLine();
            case 1:
                return this.DrawStraightLine();
        }
    }

    this.DrawLine = function () 
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth > 0) this.Canvas.lineWidth = this.LineWidth;
        var bFirstPoint = true;
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.GetYFromData(value);

            if (x > chartright) break;

            if (bFirstPoint) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y, x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
            }
            else 
            {
                if (bHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount > 0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    //无效数不画
    this.DrawStraightLine = function () 
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth > 0) this.Canvas.lineWidth = this.LineWidth;
        this.Canvas.strokeStyle = this.Color;
        if (this.IsDotLine) this.Canvas.setLineDash([3, 5]); //画虚线

        var bFirstPoint = true;
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) 
            {
                if (drawCount > 0) this.Canvas.stroke();
                bFirstPoint = true;
                drawCount = 0;
                continue;
            }

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.GetYFromData(value);

            if (x > chartright) break;

            if (bFirstPoint) 
            {
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y, x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
            }
            else 
            {
                if (bHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount > 0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.GetYFromData = function (value) 
    {
        return this.ChartFrame.GetYFromData(value);
    }
}

//子线段
function ChartSubLine() 
{
    this.newMethod = ChartLine;       //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'ChartSubLine';     //类名
    this.Color = "rgb(255,193,37)";   //线段颜色
    this.LineWidth;                 //线段宽度
    this.DrawType = 0;                //画图方式  0=无效数平滑  1=无效数不画断开
    this.IsDotLine = false;           //虚线

    this.SubFrame = { Max: null, Min: null };

    this.Draw = function () 
    {
        if (!this.IsShow) return;
        if (!this.Data || !this.Data.Data) return;

        this.CalculateDataMaxMin();

        switch (this.DrawType) 
        {
            case 0:
                return this.DrawLine();
            case 1:
                return this.DrawStraightLine();
        }
    }

    this.GetYFromData = function (value) 
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);

        if (bHScreen)
        {
            if (value <= this.SubFrame.Min) return this.ChartBorder.GetLeftEx();
            if (value >= this.SubFrame.Max) return this.ChartBorder.GetRightEx();

            var width = this.ChartBorder.GetWidthEx() * (value - this.SubFrame.Min) / (this.SubFrame.Max - this.SubFrame.Min);
            return this.ChartBorder.GetLeftEx() + width;
        }
        else
        {
            if (value <= this.SubFrame.Min) return this.ChartBorder.GetBottomEx();
            if (value >= this.SubFrame.Max) return this.ChartBorder.GetTopEx();

            var height = this.ChartBorder.GetHeightEx() * (value - this.SubFrame.Min) / (this.SubFrame.Max - this.SubFrame.Min);
            return this.ChartBorder.GetBottomEx() - height;
        }        
    }

    this.CalculateDataMaxMin = function () 
    {
        this.SubFrame = { Max: null, Min: null };

        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            if (x > chartright) break;

            if (this.SubFrame.Min == null || this.SubFrame.Min > value) this.SubFrame.Min = value;
            if (this.SubFrame.Max == null || this.SubFrame.Max < value) this.SubFrame.Max = value;
        }
    }

    this.GetMaxMin = function ()   //数据不参与坐标轴最大最小值计算
    {
        var range = { Min: null, Max: null };
        return range;
    }
}

//POINTDOT 圆点 支持横屏
function ChartPointDot() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)";   //线段颜色
    this.Radius = 1;                  //点半径
    this.ClassName = 'ChartPointDot';

    this.Draw = function () 
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        this.Canvas.save();
        this.Canvas.fillStyle = this.Color;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.beginPath();
            if (bHScreen) this.Canvas.arc(y, x, this.Radius, 0, Math.PI * 2, true);
            else this.Canvas.arc(x, y, this.Radius, 0, Math.PI * 2, true);
            this.Canvas.closePath();
            this.Canvas.fill();
        }

        this.Canvas.restore();
    }
}

//通达信语法  STICK 支持横屏
function ChartStick() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)";   //线段颜色
    this.LineWidth;               //线段宽度
    this.ClassName = 'ChartStick';

    this.DrawLine = function () 
    {
        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth > 0) this.Canvas.lineWidth = this.LineWidth;
        var bFirstPoint = true;
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            if (bFirstPoint) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount > 0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.DrawStick = function () 
    {
        if (!this.Data || !this.Data.Data) return;
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var yBottom = this.ChartBorder.GetBottom();
        var xLeft = this.ChartBorder.GetLeft();

        this.Canvas.save();
        this.Canvas.strokeStyle = this.Color;
        if (this.LineWidth) this.Canvas.lineWidth = this.LineWidth;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.beginPath();
            if (bHScreen) 
            {
                this.Canvas.moveTo(xLeft, x);
                this.Canvas.lineTo(y, x);
                this.Canvas.stroke();
            }
            else 
            {
                var xFix = parseInt(x.toString()) + 0.5;
                this.Canvas.moveTo(xFix, y);
                this.Canvas.lineTo(xFix, yBottom);
            }
            this.Canvas.stroke();
        }
        this.Canvas.restore();
    }

    this.Draw = function () 
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
    }
}

//通达信语法 LINESTICK 支持横屏
function ChartLineStick() 
{
    this.newMethod = ChartStick;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = 'ChartLineStick';

    this.Draw = function () 
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
        this.DrawLine();
    }
}

//柱子 支持横屏
function ChartStickLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartStickLine';
    this.Color = "rgb(255,193,37)";   //线段颜色
    this.LineWidth = 2;               //线段宽度
    this.BarType = 0; //柱子类型 0=实心 1=空心

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;

        this.Canvas.save();
        var bFillBar = false;
        var bFillKLine = false;

        if (this.LineWidth==50)
        {
            if (dataWidth >= 4) 
            {
                bFillKLine = true;
                this.Canvas.fillStyle = this.Color;
                this.Canvas.strokeStyle = this.Color;
            }
            else    //太细了 画竖线
            {
                this.Canvas.lineWidth = 1;
                this.Canvas.strokeStyle = this.Color;
            }  
        }
        else if (this.LineWidth < 100) 
        {
            var LineWidth = this.LineWidth;
            if (dataWidth <= 4) LineWidth = 1;
            else if (dataWidth < LineWidth) LineWidth = parseInt(dataWidth);
            this.Canvas.lineWidth = LineWidth;
            this.Canvas.strokeStyle = this.Color;
        }
        else 
        {
            bFillBar = true;
            this.Canvas.fillStyle = this.Color;
            var fixedWidth = 2;
        }

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var price = value.Value;
            var price2 = value.Value2;
            if (price2 == null) price2 = 0;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(price);
            var y2 = this.ChartFrame.GetYFromData(price2);

            if (x > chartright) break;

            if (bFillBar) 
            {
                var left = xOffset - fixedWidth;
                if (isHScreen) 
                {
                    this.Canvas.fillRect(Math.min(y, y2), left, Math.abs(y - y2), dataWidth + distanceWidth + fixedWidth * 2);
                }
                else 
                {
                    var barWidth = dataWidth + distanceWidth + fixedWidth * 2;
                    if (left + barWidth > chartright) barWidth = chartright - left; //不要超过右边框子
                    this.Canvas.fillRect(left, ToFixedRect(Math.min(y, y2)), barWidth, ToFixedRect(Math.abs(y - y2)));
                }
            }
            else if (bFillKLine) 
            {
                if (this.BarType == 1)    //实心
                {
                    if (isHScreen) 
                    {
                        this.Canvas.beginPath();
                        this.Canvas.fillRect(ToFixedRect(Math.min(y, y2)), ToFixedRect(xOffset), ToFixedRect(Math.abs(y - y2)), ToFixedRect(dataWidth));
                        this.Canvas.stroke();
                    }
                    else 
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedRect(xOffset), ToFixedRect(Math.min(y, y2)), ToFixedRect(dataWidth), ToFixedRect(Math.abs(y - y2)));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    if (isHScreen)
                        this.Canvas.fillRect(ToFixedRect(Math.min(y, y2)), ToFixedRect(xOffset), ToFixedRect(Math.abs(y - y2)), ToFixedRect(dataWidth));
                    else
                        this.Canvas.fillRect(ToFixedRect(xOffset), ToFixedRect(Math.min(y, y2)), ToFixedRect(dataWidth), ToFixedRect(Math.abs(y - y2)));
                }
            }
            else 
            {
                if (isHScreen) 
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(y, ToFixedPoint(x));
                    this.Canvas.lineTo(y2, ToFixedPoint(x));
                    this.Canvas.stroke();
                }
                else 
                {
                    var xFix = parseInt(x.toString()) + 0.5;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xFix, y);
                    this.Canvas.lineTo(xFix, y2);
                    this.Canvas.stroke();
                }
            }
        }

        this.Canvas.restore();
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;

        if (!this.Data || !this.Data.Data) return range;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.Data.Data[i];
            if (data == null) continue;
            var value2 = data.Value2;
            if (value2 == null) value2 = 0;
            if (data == null || isNaN(data.Value) || isNaN(value2)) continue;

            var valueMax = Math.max(data.Value, value2);
            var valueMin = Math.min(data.Value, value2);

            if (range.Max == null) range.Max = valueMax;
            if (range.Min == null) range.Min = valueMin;

            if (range.Max < valueMax) range.Max = valueMax;
            if (range.Min > valueMin) range.Min = valueMin;
        }

        return range;
    }
}

//画矩形
function ChartRectangle() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartRectangle';
    this.Color = [];
    this.Rect;
    this.BorderColor = g_JSChartResource.FrameBorderPen;

    this.Draw = function ()
    {
        if (!this.IsShow) return;
        if (!this.Color || !this.Rect) return;
        if (this.Color.length <= 0) return;

        this.Canvas.strokeStyle = this.BorderColor;
        var bFill = false;
        if (this.Color.length == 2) 
        {
            /*  TODO 渐变下次做吧
            if (this.ColorAngle==0)
            {
                var ptStart={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetTopEx() };
                var ptEnd={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetBottomEx() };
            }
            else
            {
                var ptStart={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetTopEx() };
                var ptEnd={ X:this.ChartBorder.GetRight(), Y:this.ChartBorder.GetTopEx() };
            }

            let gradient = this.Canvas.createLinearGradient(ptStart.X,ptStart.Y, ptEnd.X,ptEnd.Y);
            gradient.addColorStop(0, this.Color[0]);
            gradient.addColorStop(1, this.Color[1]);
            this.Canvas.fillStyle=gradient;
            */

            this.Canvas.fillStyle = this.Color[0];
            bFill = true;
        }
        else if (this.Color.length == 1) 
        {
            if (this.Color[0]) 
            {
                this.Canvas.fillStyle = this.Color[0];
                bFill = true;
            }
        }
        else 
        {
            return;
        }

        var chartWidth = this.ChartBorder.GetWidth();
        var chartHeight = this.ChartBorder.GetHeightEx();
        var left = this.Rect.Left / 1000 * chartWidth;
        var top = this.Rect.Top / 1000 * chartHeight;
        var right = this.Rect.Right / 1000 * chartWidth;
        var bottom = this.Rect.Bottom / 1000 * chartHeight;

        left = this.ChartBorder.GetLeft() + left
        top = this.ChartBorder.GetTopEx() + top;
        right = this.ChartBorder.GetLeft() + right;
        bottom = this.ChartBorder.GetTopEx() + bottom;
        var width = Math.abs(left - right);
        var height = Math.abs(top - bottom);
        if (bFill) this.Canvas.fillRect(left, top, width, height);
        this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(top), ToFixedRect(width), ToFixedRect(height));
        this.Canvas.stroke();
    }
}

//K线叠加
function ChartOverlayKLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(65,105,225)";
    this.MainData;                  //主图K线数据
    this.SourceData;                //叠加的原始数据
    this.Name = "ChartOverlayKLine";
    this.Title;
    this.DrawType = 0;
    this.ClassName ='ChartOverlayKLine';
    this.CustomDrawType = null;       //图形类型

    this.SetOption = function (option) 
    {
        if (!option) return;
        if (IFrameSplitOperator.IsNumber(option.DrawType)) this.CustomDrawType = option.DrawType;
    }

    this.DrawKBar = function (firstOpen)   //firstOpen 当前屏第1个显示数据
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var isFristDraw = true;
        var firstOverlayOpen = null;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var data = this.Data.Data[i];
            if (!data || data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) firstOverlayOpen = data.Open;

            if (isFristDraw) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.fillStyle = this.Color;
                this.Canvas.beginPath();
                isFristDraw = false;
            }

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low / firstOverlayOpen * firstOpen);
            var yHigh = this.ChartFrame.GetYFromData(data.High / firstOverlayOpen * firstOpen);
            var yOpen = this.ChartFrame.GetYFromData(data.Open / firstOverlayOpen * firstOpen);
            var yClose = this.ChartFrame.GetYFromData(data.Close / firstOverlayOpen * firstOpen);
            var y = yHigh;

            if (data.Open < data.Close)       //阳线
            {
                if (dataWidth >= 4) 
                {
                    if (data.High > data.Close)   //上影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(this.DrawType == 3 ? Math.max(yClose, yOpen) : yClose), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(this.DrawType == 3 ? Math.min(yClose, yOpen) : yClose));
                        }
                        y = yClose;
                    }
                    else 
                    {
                        y = yClose;
                    }

                    if (isHScreen) {
                        if (Math.abs(yOpen - y) < 1) 
                        {
                            this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                        }
                        else 
                        {
                            if (this.DrawType == 3) this.Canvas.rect(ToFixedPoint(y), ToFixedPoint(left), ToFixedRect(yOpen - y), ToFixedRect(dataWidth));   //空心柱
                            else this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), ToFixedRect(yOpen - y), ToFixedRect(dataWidth));
                        }
                    }
                    else 
                    {
                        if (Math.abs(yOpen - y) < 1) 
                        {
                            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), 1);    //高度小于1,统一使用高度1
                        }
                        else 
                        {
                            if (this.DrawType == 3) this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(y), ToFixedRect(dataWidth), ToFixedRect(yOpen - y));   //空心柱
                            else this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), ToFixedRect(yOpen - y));
                        }
                    }

                    if (data.Open > data.Low) 
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(this.DrawType == 3 ? Math.min(yClose, yOpen) : y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(this.DrawType == 3 ? Math.max(yClose, yOpen) : y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                    }
                }
                else 
                {
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                }
            }
            else if (data.Open > data.Close)  //阴线
            {
                if (dataWidth >= 4) 
                {
                    if (data.High > data.Close)   //上影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yOpen), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yOpen));
                        }
                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen
                    }

                    if (isHScreen) 
                    {
                        if (Math.abs(yClose - y) < 1) this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                        else this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), ToFixedRect(yClose - y), ToFixedRect(dataWidth));
                    }
                    else 
                    {
                        if (Math.abs(yClose - y) < 1) this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), 1);    //高度小于1,统一使用高度1
                        else this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), ToFixedRect(yClose - y));
                    }

                    if (data.Open > data.Low) //下影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                    }
                }
                else 
                {
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                }
            }
            else // 平线
            {
                if (dataWidth >= 4) 
                {
                    if (data.High > data.Close)   //上影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(y, ToFixedPoint(x));
                            this.Canvas.lineTo(yOpen, ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), y);
                            this.Canvas.lineTo(ToFixedPoint(x), yOpen);
                        }

                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen;
                    }

                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(left));
                        this.Canvas.lineTo(ToFixedPoint(y), ToFixedPoint(right));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(left), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(right), ToFixedPoint(y));
                    }

                    if (data.Open > data.Low) //下影线
                    {
                        if (isHScreen) 
                        {
                            this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                            this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        }
                        else 
                        {
                            this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                            this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                        }
                    }
                }
                else 
                {
                    if (isHScreen) 
                    {
                        this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                        this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    }
                    else 
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                        this.Canvas.lineTo(ToFixedPoint(x), yLow);
                    }
                }
            }

        }

        if (isFristDraw == false) this.Canvas.stroke();
    }

    this.DrawAKLine = function (firstOpen) //美国线
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var firstOverlayOpen = null;
        this.Canvas.strokeStyle = this.Color;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) firstOverlayOpen = data.Open;
            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low / firstOverlayOpen * firstOpen);
            var yHigh = this.ChartFrame.GetYFromData(data.High / firstOverlayOpen * firstOpen);
            var yOpen = this.ChartFrame.GetYFromData(data.Open / firstOverlayOpen * firstOpen);
            var yClose = this.ChartFrame.GetYFromData(data.Close / firstOverlayOpen * firstOpen);

            this.Canvas.beginPath();   //最高-最低
            if (isHScreen) 
            {
                this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                this.Canvas.lineTo(yLow, ToFixedPoint(x));
            }
            else 
            {
                this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                this.Canvas.lineTo(ToFixedPoint(x), yLow);
            }

            this.Canvas.stroke();

            if (dataWidth >= 4) 
            {
                this.Canvas.beginPath();    //开盘
                if (isHScreen) 
                {
                    this.Canvas.moveTo(ToFixedPoint(yOpen), left);
                    this.Canvas.lineTo(ToFixedPoint(yOpen), x);
                }
                else 
                {
                    this.Canvas.moveTo(left, ToFixedPoint(yOpen));
                    this.Canvas.lineTo(x, ToFixedPoint(yOpen));
                }
                this.Canvas.stroke();

                this.Canvas.beginPath();    //收盘
                if (isHScreen) 
                {
                    this.Canvas.moveTo(ToFixedPoint(yClose), right);
                    this.Canvas.lineTo(ToFixedPoint(yClose), x);
                }
                else 
                {
                    this.Canvas.moveTo(right, ToFixedPoint(yClose));
                    this.Canvas.lineTo(x, ToFixedPoint(yClose));
                }
                this.Canvas.stroke();
            }
        }

    }

    this.DrawCloseLine = function (firstOpen)  //收盘价线
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var firstOverlayOpen = null;
        var bFirstPoint = true;
        this.Canvas.strokeStyle = this.Color;
        this.Canvas.beginPath();
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) firstOverlayOpen = data.Open;
            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close / firstOverlayOpen * firstOpen);

            if (bFirstPoint) 
            {
                if (isHScreen) this.Canvas.moveTo(yClose, x);
                else this.Canvas.moveTo(x, yClose);
                bFirstPoint = false;
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(yClose, x);
                else this.Canvas.lineTo(x, yClose);
            }
        }

        if (bFirstPoint == false) this.Canvas.stroke();
    }

    this.Draw = function () 
    {
        this.TooltipRect = [];
        if (!this.MainData || !this.Data) return;

        var xPointCount = this.ChartFrame.XPointCount;
        var firstOpen = null; //主线数据第1个开盘价
        for (var i = this.Data.DataOffset, j = 0; i < this.MainData.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.MainData.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;
            firstOpen = data.Open;
            break;
        }

        if (firstOpen == null) return;

        var drawTypeBackup = this.DrawType; //备份下线段类型
        if (this.CustomDrawType != null) this.DrawType = this.CustomDrawType;

        if (this.DrawType == 1) this.DrawCloseLine(firstOpen);
        else if (this.DrawType == 2) this.DrawAKLine(firstOpen);
        else this.DrawKBar(firstOpen);

        this.DrawType = drawTypeBackup; //还原线段类型
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Max = null;
        range.Min = null;

        if (!this.MainData || !this.Data) return range;

        var firstOpen = null; //主线数据第1个收盘价
        for (var i = this.Data.DataOffset, j = 0; i < this.MainData.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.MainData.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;
            firstOpen = data.Close;
            break;
        }

        if (firstOpen == null) return range;

        var firstOverlayOpen = null;
        var high, low;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.Data.Data[i];
            if (!data || data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;
            if (firstOverlayOpen == null) firstOverlayOpen = data.Open;

            high = data.High / firstOverlayOpen * firstOpen;
            low = data.Low / firstOverlayOpen * firstOpen;
            if (range.Max == null) range.Max = high;
            if (range.Min == null) range.Min = low;

            if (range.Max < high) range.Max = high;
            if (range.Min > low) range.Min = low;
        }

        return range;
    }
}

// 多文本集合  支持横屏
function ChartMultiText() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartMultiText';
    this.Texts = [];  //[ {Index:, Value:, Text:, Color:, Font: , Baseline:} ]
    this.Font = g_JSChartResource.DefaultTextFont;
    this.Color = g_JSChartResource.DefaultTextColor;
    this.IsHScreen = false;   //是否横屏

    this.Draw = function () 
    {
        if (!this.IsShow) return;
        if (!this.Data || this.Data.length <= 0) return;
        if (!this.Texts) return;

        this.IsHScreen = (this.ChartFrame.IsHScreen === true);
        var xPointCount = this.ChartFrame.XPointCount;
        var offset = this.Data.DataOffset;
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();

        if (this.IsHScreen) 
        {
            left = this.ChartBorder.GetTop();
            right = this.ChartBorder.GetBottom();
        }

        for (var i in this.Texts) 
        {
            var item = this.Texts[i];
            if (!item.Text) continue;
            if (!IFrameSplitOperator.IsNumber(item.Index)) continue;

            var index = item.Index - offset;
            if (index >= 0 && index < xPointCount) 
            {
                var x = this.ChartFrame.GetXFromIndex(index);
                var y = this.ChartFrame.GetYFromData(item.Value);

                if (item.Color) this.Canvas.fillStyle = item.Color;
                else this.Canvas.fillStyle = this.Color;
                if (item.Font) this.Canvas.font = item.Font;
                else this.Canvas.font = this.Font;

                var textWidth = this.Canvas.measureText(item.Text).width;
                this.Canvas.textAlign = 'center';
                if (x + textWidth / 2 >= right)
                {
                    this.Canvas.textAlign = 'right';
                    x = right;
                }
                else if (x - textWidth / 2 < left) 
                {
                    this.Canvas.textAlign = 'left';
                    x = left;
                }
                if (item.Baseline == 1) this.Canvas.textBaseline = 'top';
                else if (item.Baseline == 2) this.Canvas.textBaseline = 'bottom';
                else this.Canvas.textBaseline = 'middle';
                if (this.IsHScreen) //横屏旋转
                {
                    this.Canvas.save();
                    this.Canvas.translate(y, x);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Text, 0, 0);
                    this.Canvas.restore();
                }
                else
                {
                    this.Canvas.fillText(item.Text, x, y);
                }
                
            }
        }
    }

    this.GetMaxMin = function () 
    {
        var range = { Min: null, Max: null };
        if (!this.Texts) return range;

        var xPointCount = this.ChartFrame.XPointCount;
        var start = this.Data.DataOffset;
        var end = start + xPointCount;

        for (var i in this.Texts) 
        {
            var item = this.Texts[i];
            if (item.Index >= start && item.Index < end) 
            {
                if (range.Max == null) range.Max = item.Value;
                else if (range.Max < item.Value) range.Max = item.Value;
                if (range.Min == null) range.Min = item.Value;
                else if (range.Min > item.Value) range.Min = item.Value;
            }
        }

        return range;
    }
}

// 线段集合  支持横屏
function ChartMultiLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Lines = [];   // [ {Point:[ {Index, Value }, ], Color: }, ] 
    this.IsHScreen = false;

    this.Draw = function () 
    {
        if (!this.IsShow) return;
        if (!this.Data || this.Data.length <= 0) return;

        this.IsHScreen = (this.ChartFrame.IsHScreen === true);
        var xPointCount = this.ChartFrame.XPointCount;
        var offset = this.Data.DataOffset;

        var drawLines = [];
        for (var i in this.Lines) 
        {
            var line = this.Lines[i];
            var drawPoints = { Point: [], Color: line.Color };
            for (var j in line.Point) 
            {
                var point = line.Point[j];
                if (!IFrameSplitOperator.IsNumber(point.Index)) continue;

                var index = point.Index - offset;
                if (index >= 0 && index < xPointCount) 
                {
                    var x = this.ChartFrame.GetXFromIndex(index);
                    var y = this.ChartFrame.GetYFromData(point.Value);
                    drawPoints.Point.push({ X: x, Y: y });
                }
            }

            if (drawPoints.Point.length >= 2) drawLines.push(drawPoints)
        }

        for (var i in drawLines) 
        {
            var item = drawLines[i];
            this.DrawLine(item);
        }
    }

    this.DrawLine = function (line) 
    {
        this.Canvas.strokeStyle = line.Color;
        for (var i in line.Point) 
        {
            var item = line.Point[i];
            if (i == 0) 
            {
                this.Canvas.beginPath();
                if (this.IsHScreen) this.Canvas.moveTo(item.Y, item.X);
                else this.Canvas.moveTo(item.X, item.Y);
            }
            else 
            {
                if (this.IsHScreen) this.Canvas.lineTo(item.Y, item.X);
                else this.Canvas.lineTo(item.X, item.Y);
            }
        }
        this.Canvas.stroke();
    }

    this.GetMaxMin = function () 
    {
        var range = { Min: null, Max: null };
        var xPointCount = this.ChartFrame.XPointCount;
        var start = this.Data.DataOffset;
        var end = start + xPointCount;

        for (var i in this.Lines) 
        {
            var line = this.Lines[i];
            for (var j in line.Point) 
            {
                var point = line.Point[j];
                if (point.Index >= start && point.Index < end) 
                {
                    if (range.Max == null) range.Max = point.Value;
                    else if (range.Max < point.Value) range.Max = point.Value;
                    if (range.Min == null) range.Min = point.Value;
                    else if (range.Min > point.Value) range.Min = point.Value;
                }
            }
        }

        return range;
    }
}

// 柱子集合  支持横屏
function ChartMultiBar() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Bars = [];   // [ {Point:[ {Index, Value, Value2 }, ], Color:, Width: , Type: 0 实心 1 空心 }, ] 
    this.IsHScreen = false;

    this.Draw = function () 
    {
        if (!this.IsShow) return;
        if (!this.Data || this.Data.length <= 0) return;

        this.IsHScreen = (this.ChartFrame.IsHScreen === true);
        var xPointCount = this.ChartFrame.XPointCount;
        var offset = this.Data.DataOffset;
        var dataWidth = this.ChartFrame.DataWidth;

        var drawBars = [];
        for (var i in this.Bars) 
        {
            var item = this.Bars[i];
            var drawPoints = { Point: [], Color: item.Color, Width: dataWidth, Type: 0 };
            if (item.Type > 0) drawPoints.Type = item.Type;
            if (item.Width > 0) 
            {
                drawPoints.Width = item.Width;
                if (drawPoints.Width > dataWidth) drawPoints.Width = dataWidth;
            }
            else 
            {
                if (drawPoints.Width < 4) drawPoints.Width = 1;
            }

            for (var j in item.Point) 
            {
                var point = item.Point[j];
                if (!IFrameSplitOperator.IsNumber(point.Index)) continue;

                var index = point.Index - offset;
                if (index >= 0 && index < xPointCount) 
                {
                    var x = this.ChartFrame.GetXFromIndex(index);
                    var y = this.ChartFrame.GetYFromData(point.Value);
                    var y2 = this.ChartFrame.GetYFromData(point.Value2);
                    drawPoints.Point.push({ X: x, Y: y, Y2: y2 });
                }
            }

            if (drawPoints.Point.length > 0) drawBars.push(drawPoints)
        }

        for (var i in drawBars) 
        {
            var item = drawBars[i];
            if (item.Width >= 4) 
            {
                if (item.Type == 1) this.DrawHollowBar(item);
                else this.DrawFillBar(item);
            }
            else 
            {
                this.DrawLineBar(item);
            }
        }
    }

    this.DrawLineBar = function (bar) 
    {
        this.Canvas.strokeStyle = bar.Color;
        var backupLineWidth = this.Canvas.lineWidth;
        this.Canvas.lineWidth = bar.Width;
        for (var i in bar.Point) 
        {
            var item = bar.Point[i];

            this.Canvas.beginPath();
            if (this.IsHScreen) 
            {
                this.Canvas.moveTo(ToFixedPoint(item.Y), ToFixedPoint(item.X));
                this.Canvas.lineTo(ToFixedPoint(item.Y2), ToFixedPoint(item.X));
            }
            else 
            {
                this.Canvas.moveTo(ToFixedPoint(item.X), ToFixedPoint(item.Y));
                this.Canvas.lineTo(ToFixedPoint(item.X), ToFixedPoint(item.Y2));
            }

            this.Canvas.stroke();
        }

        this.Canvas.lineWidth = backupLineWidth;
    }

    this.DrawFillBar = function (bar) 
    {
        this.Canvas.fillStyle = bar.Color;
        for (var i in bar.Point) 
        {
            var item = bar.Point[i];
            var x = item.X - (bar.Width / 2);
            var y = Math.min(item.Y, item.Y2);
            var barWidth = bar.Width;
            var barHeight = Math.abs(item.Y - item.Y2);
            if (this.IsHScreen)
                this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(x), ToFixedRect(barHeight), ToFixedRect(barWidth));
            else
                this.Canvas.fillRect(ToFixedRect(x), ToFixedRect(y), ToFixedRect(barWidth), ToFixedRect(barHeight));
        }
    }

    this.DrawHollowBar = function (bar)    //空心柱子
    {
        this.Canvas.strokeStyle = bar.Color;
        var backupLineWidth = 1;
        for (var i in bar.Point) 
        {
            var item = bar.Point[i];
            var x = item.X - (bar.Width / 2);
            var y = Math.min(item.Y, item.Y2);
            var barWidth = bar.Width;
            var barHeight = Math.abs(item.Y - item.Y2);
            this.Canvas.beginPath();
            if (this.IsHScreen)
                this.Canvas.rect(ToFixedPoint(y), ToFixedPoint(x), ToFixedRect(barHeight), ToFixedRect(barWidth));
            else
                this.Canvas.rect(ToFixedPoint(x), ToFixedPoint(y), ToFixedRect(barWidth), ToFixedRect(barHeight));

            this.Canvas.stroke();
        }

        this.Canvas.lineWidth = backupLineWidth;
    }

    this.GetMaxMin = function () 
    {
        var range = { Min: null, Max: null };
        var xPointCount = this.ChartFrame.XPointCount;
        var start = this.Data.DataOffset;
        var end = start + xPointCount;
        for (var i in this.Bars) 
        {
            var item = this.Bars[i];
            for (var j in item.Point) 
            {
                var point = item.Point[j];
                if (point.Index >= start && point.Index < end) 
                {
                    var minValue = Math.min(point.Value, point.Value2);
                    var maxValue = Math.max(point.Value, point.Value2);
                    if (range.Max == null) range.Max = maxValue;
                    else if (range.Max < maxValue) range.Max = maxValue;
                    if (range.Min == null) range.Min = minValue;
                    else if (range.Min > minValue) range.Min = minValue;
                }
            }
        }

        return range;
    }
}

//分钟信息地雷 支持横屏
function ChartMinuteInfo() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = "ChartMinuteInfo";
    this.Data = new Map()  //Map key=date-time, value=[{Date, Time, Title, Type, ID:}]
    this.SourceData;
    this.ChartMinutePrice;
    this.YClose;

    this.TextColor = g_JSChartResource.MinuteInfo.TextColor;
    this.Font = g_JSChartResource.MinuteInfo.Font;
    this.PointColor = g_JSChartResource.MinuteInfo.PointColor;
    this.LineColor = g_JSChartResource.MinuteInfo.LineColor;
    this.TextBGColor = g_JSChartResource.MinuteInfo.TextBGColor;
    this.TextHeight = 18;

    this.TextRectCache = [];
    this.InfoDrawCache = [];
    this.FrameBottom;
    this.FrameTop;
    this.FrameLeft;
    this.FrameRight;
    this.YOffset = 5;
    this.IsHScreen = false;

    this.SetOption = function (option) 
    {
        if (option.TextColor) this.TextColor = option.TextColor;
        if (option.TextBGColor) this.TextBGColor = option.TextBGColor;
        if (option.Font) this.Font = option.Font;
        if (option.PointColor) this.PointColor = option.PointColor;
        if (option.LineColor) this.LineColor = option.LineColor;
        if (option.TextHeight > 0) this.TextHeight = option.TextHeight;
    }

    this.Draw = function () 
    {
        if (!this.ChartMinutePrice) return;
        if (!this.Data || this.Data.size <= 0) return;

        this.TextRectCache = [];
        this.InfoDrawCache = [];
        this.IsHScreen = (this.ChartFrame.IsHScreen === true);

        var xPointCount = this.ChartFrame.XPointCount;
        var minuteCount = this.ChartFrame.MinuteCount;

        this.FrameBottom = this.ChartBorder.GetBottom();
        this.FrameTop = this.ChartBorder.GetTop();
        this.FrameLeft = this.ChartBorder.GetLeft();
        this.FrameRight = this.ChartBorder.GetRight();
        if (this.IsHScreen) 
        {
            this.FrameRight = this.ChartBorder.GetBottom();
            this.FrameLeft = this.ChartBorder.GetTop();
            this.FrameBottom = this.ChartBorder.GetLeft();
            this.FrameTop = this.ChartBorder.GetRight();
        }

        this.YClose = this.ChartMinutePrice.YClose;

        var data = this.ChartMinutePrice.Data;
        var isBeforeData = false;
        if (this.ChartMinutePrice.SourceData) 
        {
            data = this.ChartMinutePrice.SourceData;
            isBeforeData = true;
        }

        this.Canvas.font = this.Font;
        for (var i = data.DataOffset, j = 0; i < data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var item = this.SourceData.Data[i];
            if (isBeforeData && item.Before) continue;
            if (!item) continue;

            var dateTime = item.DateTime;
            if (!this.Data.has(dateTime)) continue;
            if (this.IsHScreen)
                this.CalcuateInfoHScreenPosition(this.Data.get(dateTime), j, item);
            else
                this.CalcuateInfoPosition(this.Data.get(dateTime), j, item);
        }

        for (var i in this.InfoDrawCache) 
        {
            var item = this.InfoDrawCache[i];
            this.DrawInfoLines(item);
        }

        for (var i in this.InfoDrawCache) 
        {
            var item = this.InfoDrawCache[i];
            this.DrawInfoText(item);
        }

        this.TextRectCache = [];
        this.InfoDrawCache = [];
    }

    this.CalcuateInfoPosition = function (infoItem, index, minuteItem) 
    {
        if (!infoItem || !infoItem.Data || infoItem.Data.length <= 0) return;

        var showItem = infoItem.Data[0];
        var textWidth = this.Canvas.measureText(showItem.Title).width + 4;
        var textHeight = this.TextHeight;

        var x = this.ChartFrame.GetXFromIndex(index);
        var y = this.ChartFrame.GetYFromData(minuteItem.Close);
        x = ToFixedPoint(x);

        var isDrawLeft = x < (this.FrameLeft + Math.abs(this.FrameLeft - this.FrameRight) / 2);

        var ARRAY_OFFSET = [2, 4, 3, 2, 3, 3, 2];
        var offset = textHeight + ARRAY_OFFSET[index % ARRAY_OFFSET.length];
        var yData =
        {
            Y:
                [
                    { Value: y + (textHeight + this.YOffset), Offset: offset },
                    { Value: y - (2 * textHeight + this.YOffset), Offset: -offset }
                ]
        };

        if (minuteItem.Close < this.YClose)
            yData.Y = yData.Y.reverse();

        var rtBorder = { X: x, Y: null, Width: textWidth, Height: textHeight };
        if (!isDrawLeft) rtBorder.X -= rtBorder.Width;

        this.FixTextRect(rtBorder, yData);
        var InfoDrawItem = { Border: rtBorder, Start: { X: x, Y: y }, IsLeft: isDrawLeft, Title: showItem.Title };

        this.InfoDrawCache.push(InfoDrawItem);
        this.TextRectCache.push(rtBorder);
    }

    this.CalcuateInfoHScreenPosition = function (infoItem, index, minuteItem) 
    {
        if (!infoItem || !infoItem.Data || infoItem.Data.length <= 0) return;

        var showItem = infoItem.Data[0];
        var textHeight = this.Canvas.measureText(showItem.Title).width + 4;
        var textWidth = this.TextHeight;

        var y = this.ChartFrame.GetXFromIndex(index);
        var x = this.ChartFrame.GetYFromData(minuteItem.Close);
        y = ToFixedPoint(y);

        var isDrawLeft = y < (this.FrameLeft + Math.abs(this.FrameLeft - this.FrameRight) / 2);

        var ARRAY_OFFSET = [2, 4, 3, 2, 3, 3, 2];
        var offset = textWidth + ARRAY_OFFSET[index % ARRAY_OFFSET.length];
        var xData =
        {
            X:
                [
                    { Value: x + (textWidth + this.YOffset), Offset: offset },
                    { Value: x - (2 * textWidth + this.YOffset), Offset: -offset }
                ]
        };

        if (minuteItem.Close > this.YClose)
            xData.X = xData.X.reverse();

        var rtBorder = { X: null, Y: y, Width: textWidth, Height: textHeight };
        if (!isDrawLeft) rtBorder.Y -= rtBorder.Height;

        this.FixHScreenTextRect(rtBorder, xData);
        var InfoDrawItem = { Border: rtBorder, Start: { X: x, Y: y }, IsLeft: isDrawLeft, Title: showItem.Title };

        this.InfoDrawCache.push(InfoDrawItem);
        this.TextRectCache.push(rtBorder);
    }

    this.DrawInfoLines = function (item) 
    {
        var rtBorder = item.Border;
        var isDrawLeft = item.IsLeft;
        this.Canvas.strokeStyle = this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(item.Start.X, item.Start.Y);
        if (isDrawLeft) 
        {
            this.Canvas.lineTo(rtBorder.X, rtBorder.Y);
        }
        else 
        {
            if (this.IsHScreen) this.Canvas.lineTo(rtBorder.X, rtBorder.Y + rtBorder.Height);
            else this.Canvas.lineTo(rtBorder.X + rtBorder.Width, rtBorder.Y);
        }
        this.Canvas.stroke();

        this.Canvas.fillStyle = this.PointColor;
        this.Canvas.beginPath();
        this.Canvas.arc(item.Start.X, item.Start.Y, 5, 0, 2 * Math.PI);
        this.Canvas.closePath();
        this.Canvas.fill();
    }

    this.DrawInfoText = function (item) 
    {
        var rtBorder = item.Border;
        var x = rtBorder.X, y = rtBorder.Y;
        this.Canvas.fillStyle = this.TextBGColor;
        this.Canvas.fillRect(x, y, rtBorder.Width, rtBorder.Height);

        this.Canvas.strokeStyle = this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.rect(x, y, rtBorder.Width, rtBorder.Height);
        this.Canvas.stroke();

        if (this.IsHScreen) 
        {
            this.Canvas.save();
            this.Canvas.translate(rtBorder.X, rtBorder.Y);
            this.Canvas.rotate(90 * Math.PI / 180);
            x = 0; y = 0;
        }

        this.Canvas.textAlign = 'left'
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        if (this.IsHScreen) this.Canvas.fillText(item.Title, x + 2, y - rtBorder.Width / 2);
        else this.Canvas.fillText(item.Title, x+2, y + rtBorder.Height / 2);

        if (this.IsHScreen) this.Canvas.restore();
    }

    this.FixTextRect = function (rect, yData) 
    {
        for (var k in yData.Y) 
        {
            var yItem = yData.Y[k];
            rect.Y = yItem.Value;

            var y;
            for (var j = 0; j < 10; ++j) 
            {
                var isOverlap = false;
                for (var i in this.TextRectCache) 
                {
                    var item = this.TextRectCache[i];
                    if (this.IsOverlap(item, rect)) 
                    {
                        isOverlap = true;
                        break;
                    }
                }

                if (isOverlap == false) return;

                y = rect.Y;
                y += yItem.Offset;
                if (y + rect.Height > this.FrameBottom || y < this.FrameTop) break;

                rect.Y = y;
            }
        }
    }

    this.FixHScreenTextRect = function (rect, xData) 
    {
        for (var k in xData.X) 
        {
            var xItem = xData.X[k];
            rect.X = xItem.Value;

            var x;
            for (var j = 0; j < 10; ++j) 
            {
                var isOverlap = false;
                for (var i in this.TextRectCache) 
                {
                    var item = this.TextRectCache[i];
                    if (this.IsOverlap(item, rect)) 
                    {
                        isOverlap = true;
                        break;
                    }
                }

                if (isOverlap == false) return;

                x = rect.X;
                x += xItem.Offset;
                if (x + rect.Width < this.FrameBottom || x > this.FrameTop) break;

                rect.X = x;
            }
        }
    }

    this.IsOverlap = function (rc1, rc2) 
    {
        if (rc1.X + rc1.Width > rc2.X && rc2.X + rc2.Width > rc1.X && rc1.Y + rc1.Height > rc2.Y && rc2.Y + rc2.Height > rc1.Y)
            return true;
        else
            return false;
    }

    this.GetMaxMin = function () 
    {
        var range = { Min: null, Max: null };
        return range;
    }
}

//买卖盘
function ChartBuySell() 
{
    this.newMethod = ChartSingleText;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName = "ChartBuySell";
    this.TextFont = g_JSChartResource.KLineTrain.Font;                //"bold 14px arial";           //买卖信息字体
    this.LastDataIcon = g_JSChartResource.KLineTrain.LastDataIcon; //{Color:'rgb(0,0,205)',Text:'↓'};
    this.BuyIcon = g_JSChartResource.KLineTrain.BuyIcon; //{Color:'rgb(0,0,205)',Text:'B'};
    this.SellIcon = g_JSChartResource.KLineTrain.SellIcon; //{Color:'rgb(0,0,205)',Text:'S'};
    this.BuySellData = new Map();   //Key=数据索引index Value:Data:[ { Op: 买/卖 0=buy 1=sell, Date:, Time, Price: Vol:}, ] 

    this.AddTradeItem = function (tradeItem) 
    {
        if (this.BuySellData.has(tradeItem.Key)) 
        {
            var Trade = this.BuySellData.get(tradeItem.Key);
            Trade.Data.push(tradeItem);
        }
        else 
        {
            this.BuySellData.set(tradeItem.Key, { Data: [tradeItem] });
        }
    }

    this.ClearTradeData = function () 
    {
        this.BuySellData = new Map();
    }

    this.Draw = function () 
    {
        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var bottom = this.ChartBorder.GetBottomEx();
        var top = this.ChartBorder.GetTopEx();
        var height = this.ChartBorder.GetHeightEx();
        if (isHScreen) 
        {
            top = this.ChartBorder.GetRightEx();
            bottom = this.ChartBorder.GetLeftEx();
            height = this.ChartBorder.GetWidthEx();
        }

        this.Canvas.font = this.TextFont;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
            if (x > chartright) break;

            if (i == this.Data.Data.length - 1) 
            {
                var x = this.ChartFrame.GetXFromIndex(j);
                var yHigh = this.ChartFrame.GetYFromData(value.High);
                if (this.LastDataIcon.Text)
                {
                    this.Canvas.textAlign = 'center';
                    this.Canvas.textBaseline = 'bottom';
                    this.Canvas.fillStyle = this.LastDataIcon.Color;
                    this.Canvas.font = this.TextFont;
                    this.DrawText(this.LastDataIcon.Text, x, yHigh, isHScreen);
                }
                else
                {
                    var obj = 
                    { 
                        X: x, Top: top, Bottom: bottom, Height: height, 
                        DataWidth: dataWidth, Color: this.LastDataIcon.Color, IsHScreen: isHScreen,
                    };
                    this.DrawLastData(obj);
                }
            }

            var key = i;
            if (!this.BuySellData.has(key)) continue;

            var trade = this.BuySellData.get(key);
            var x = this.ChartFrame.GetXFromIndex(j);
            var yHigh = this.ChartFrame.GetYFromData(value.High);
            var yLow = this.ChartFrame.GetYFromData(value.Low);
            var drawInfo = [false, false];    //0=buy 1=sell
            for (var k in trade.Data)
            {
                if (drawInfo[0] == true && drawInfo[1] == true) break;  //买卖图标只画一次

                var bsItem = trade.Data[k];
                if (bsItem.Op == 0 && drawInfo[0] == false)   //买 标识在最低价上
                {
                    this.Canvas.textAlign = 'center';
                    this.Canvas.textBaseline = 'top';
                    this.Canvas.fillStyle = this.BuyIcon.Color;
                    this.DrawText(this.BuyIcon.Text, x, yLow, isHScreen);
                    drawInfo[0] = true;
                }
                else if (bsItem.Op == 1 && drawInfo[1] == false)   //卖 标识在最高价上
                {
                    this.Canvas.textAlign = 'center';
                    this.Canvas.textBaseline = 'bottom';
                    this.Canvas.fillStyle = this.SellIcon.Color;
                    this.DrawText(this.SellIcon.Text, x, yHigh, isHScreen);
                    drawInfo[1] = true;
                }
            }
        }
    }

    this.DrawLastData=function(obj)
    {
        this.Canvas.fillStyle = obj.Color;

        var width = obj.DataWidth;
        if (this.LastDataIcon.Width >= 2 && this.LastDataIcon.Width < obj.DataWidth) 
            width = this.LastDataIcon.Width;
        var left = obj.X - width / 2;

        if (obj.IsHScreen)
        {
            this.Canvas.fillRect(ToFixedRect(obj.Bottom), ToFixedRect(left), ToFixedRect(obj.Height), ToFixedRect(width));
        }
        else
        {
            var left = obj.X - width/2;
            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(obj.Top), ToFixedRect(width), ToFixedRect(obj.Height));
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 其他图形
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    饼图
*/
function ChartPie() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw = function () 
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length > 0)) return this.DrawEmptyData();

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let radius = width / 4 * 0.8;
        this.Canvas.save();
        this.Canvas.translate(left + radius, top + height / 2);

        let totalValue = 0;   //求和
        for (let i in this.Data.Data) {
            totalValue += this.Data.Data[i].Value;
        }

        let startAngle = Math.PI * 1.5;
        let start = startAngle;
        let end = startAngle;
        //画饼图
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            let rate = item.Value / totalValue; //占比

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0, 0);

            end += rate * 2 * Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0, 0, radius, start, end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();

            start += rate * 2 * Math.PI;//起始角度
        }

        //画文字
        this.Canvas.restore();
        let textLeft = left + width / 2 + 5;
        // let textTop = top + height / 2 + 20;
        let textTop = top;
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = "12px 微软雅黑";

        for (let i = 0, j = 0; i < this.Data.Data.length; ++i) 
        {
            let item = this.Data.Data[i];
            if (!item.Text) continue;

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(textLeft, textTop - 15, 13, 13);

            this.Canvas.fillStyle = 'rgb(102,102,102)';
            this.Canvas.fillText(item.Text, textLeft + 16, textTop);
            // textTop += 20;
            textTop += 17;
            if (textTop > top + height / 2 + radius) {
                ++j;
                if (j >= 2) break;

                // textTop = top + height / 2 + 20;
                textTop = top;
                textLeft = right - (width / 4) + 5;
            }
        }
    }

    //空数据
    this.DrawEmptyData = function () 
    {
        console.log('[ChartPie::DrawEmptyData]')

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let radius = width / 4 * 0.8;
        this.Canvas.save();
        this.Canvas.translate(left + radius, top + height / 2);

        this.Canvas.beginPath();
        this.Canvas.fillStyle = 'rgb(211,211,211)';
        this.Canvas.strokeStyle = "white";
        this.Canvas.arc(0, 0, radius * 0.8, 0, 2 * Math.PI);
        this.Canvas.fill();
        this.Canvas.closePath();
        this.Canvas.stroke();

        this.Canvas.restore();
    }
}


/*
    圆环
*/
function ChartCircle() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BGColor = 'white';  //背景色
    this.TextHeight = 25;

    //空数据
    this.DrawEmptyData = function () 
    {
        console.log('[ChartCircle::DrawEmptyData]')
    }

    this.Draw = function () 
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length > 0)) return this.DrawEmptyData();

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let lTextHeight = this.TextHeight;
        let size = width - lTextHeight;
        if (size > height - lTextHeight) size = height - lTextHeight;
        let radius = (size - lTextHeight) / 2;
        this.Canvas.save();
        this.Canvas.translate(left + width / 2, top + height / 2 - lTextHeight / 2);

        let totalValue = 0;   //求和
        for (let i in this.Data.Data) 
        {
            totalValue += this.Data.Data[i].Value;
        }

        let startAngle = Math.PI * 1.5;
        let start = startAngle;
        let end = startAngle;
        //画饼图
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            let rate = item.Value / totalValue; //占比
            //console.log('[ChartPie::Draw]', i, rate, item);

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0, 0);

            end += rate * 2 * Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0, 0, radius, start, end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();

            start += rate * 2 * Math.PI;//起始角度
        }

        //中心画一个背景色的圆
        this.Canvas.beginPath();
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.arc(0, 0, radius * 0.5, 0, 2 * Math.PI);
        this.Canvas.fill();
        this.Canvas.closePath();
        this.Canvas.stroke();

        this.Canvas.restore();

        //画文字
        this.Canvas.restore();
        let textLeft = left;
        let textTop = top + height / 2 - lTextHeight / 2 + radius + 5 + 20;
        this.Canvas.textBaseline = "bottom";
        this.Canvas.textAlign = 'left';
        this.Canvas.font = "14px 微软雅黑";
        let textWidth = 0;
        //以圆心左右显示
        for (let i = 0, j = 0; i < this.Data.Data.length; ++i) 
        {
            let item = this.Data.Data[i];
            if (!item.Text) continue;

            this.Canvas.fillStyle = item.Color;

            if (j % 2 == 0) 
            {
                textLeft = left + width / 2 - 10;
                textWidth = this.Canvas.measureText(item.Text).width;
                textLeft = textLeft - textWidth - 16;
                this.Canvas.fillRect(textLeft, textTop - 15, 13, 13);
                this.Canvas.fillStyle = 'rgb(102,102,102)';
                this.Canvas.fillText(item.Text, textLeft + 16, textTop);
            }
            else 
            {
                textLeft = left + width / 2 + 10 + 10;
                this.Canvas.fillRect(textLeft, textTop - 15, 13, 13);
                this.Canvas.fillStyle = 'rgb(102,102,102)';
                this.Canvas.fillText(item.Text, textLeft + 16, textTop);
                textTop += 20;
            }

            if (textTop > bottom) break;

            ++j;
        }
    }
}



//  中国地图
function ChartChinaMap() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ImageData = null;
    this.Left;
    this.Top;
    this.Width;
    this.Height;
    this.ImageWidth;
    this.ImageHeight;

    this.DefaultColor = [217, 222, 239];

    this.Color =
    [
        { Name: '海南', Color: 'rgb(217,222,223)' },
        { Name: '内蒙古', Color: 'rgb(217,222,225)' },
        { Name: '新疆', Color: 'rgb(217,222,226)' },
        { Name: '青海', Color: 'rgb(217,222,227)' },
        { Name: '西藏', Color: 'rgb(217,222,228)' },
        { Name: '云南', Color: 'rgb(217,222,229)' },
        { Name: '黑龙江', Color: 'rgb(217,222,230)' },
        { Name: '吉林', Color: 'rgb(217,222,231)' },
        { Name: '辽宁', Color: 'rgb(217,222,232)' },
        { Name: '河北', Color: 'rgb(217,222,233)' },
        { Name: '山东', Color: 'rgb(217,222,234)' },
        { Name: '江苏', Color: 'rgb(217,222,235)' },
        { Name: '浙江', Color: 'rgb(217,222,236)' },
        { Name: '福建', Color: 'rgb(217,222,237)' },
        { Name: '广东', Color: 'rgb(217,222,238)' },
        { Name: '广西', Color: 'rgb(217,222,239)' },
        { Name: '贵州', Color: 'rgb(217,222,240)' },
        { Name: '湖南', Color: 'rgb(217,222,241)' },
        { Name: '江西', Color: 'rgb(217,222,242)' },
        { Name: '安徽', Color: 'rgb(217,222,243)' },
        { Name: '湖北', Color: 'rgb(217,222,244)' },
        { Name: '重庆', Color: 'rgb(217,222,245)' },
        { Name: '四川', Color: 'rgb(217,222,246)' },
        { Name: '甘肃', Color: 'rgb(217,222,247)' },
        { Name: '陕西', Color: 'rgb(217,222,248)' },
        { Name: '山西', Color: 'rgb(217,222,249)' },
        { Name: '河南', Color: 'rgb(217,222,250)' }
    ];

    this.Draw = function () 
    {
        let left = this.ChartBorder.GetLeft() + 1;
        let right = this.ChartBorder.GetRight() - 1;
        let top = this.ChartBorder.GetTop() + 1;
        let bottom = this.ChartBorder.GetBottom() - 1;
        let width = this.ChartBorder.GetWidth() - 2;
        let height = this.ChartBorder.GetHeight() - 2;

        let imageWidth = CHINA_MAP_IMAGE.width;
        let imageHeight = CHINA_MAP_IMAGE.height;

        let drawImageWidth = imageWidth;
        let drawImageHeight = imageHeight;

        if (height < drawImageHeight || width < drawImageWidth) 
        {
            this.ImageData = null;
            return;
        }

        if (this.Left != left || this.Top != top || this.Width != width || this.Height != height || this.ImageWidth != imageWidth || this.ImageHeight != imageHeight) 
        {
            this.ImageData = null;

            this.ImageWidth = imageWidth;
            this.ImageHeight = imageHeight;
            this.Left = left;
            this.Top = top;
            this.Width = width;
            this.Height = height;

            console.log(imageWidth, imageHeight);
        }

        if (this.ImageData == null) 
        {
            this.Canvas.drawImage(CHINA_MAP_IMAGE, 0, 0, imageWidth, imageHeight, left, top, drawImageWidth, drawImageHeight);
            this.ImageData = this.Canvas.getImageData(left, top, drawImageWidth, drawImageHeight);

            let defaultColorSet = new Set();  //默认颜色填充的色块
            let colorMap = new Map();         //定义颜色填充的色块

            let nameMap = new Map();
            if (this.Data.length > 0) 
            {
                for (let i in this.Data) 
                {
                    let item = this.Data[i];
                    nameMap.set(item.Name, item.Color)
                }
            }

            console.log(this.Data);
            for (let i in this.Color) 
            {
                let item = this.Color[i];
                if (nameMap.has(item.Name)) 
                {
                    colorMap.set(item.Color, nameMap.get(item.Name));
                }
                else 
                {
                    defaultColorSet.add(item.Color);
                }
            }

            var color;
            for (let i = 0; i < this.ImageData.data.length; i += 4) 
            {
                color = 'rgb(' + this.ImageData.data[i] + ',' + this.ImageData.data[i + 1] + ',' + this.ImageData.data[i + 2] + ')';

                if (defaultColorSet.has(color)) 
                {
                    this.ImageData.data[i] = this.DefaultColor[0];
                    this.ImageData.data[i + 1] = this.DefaultColor[1];
                    this.ImageData.data[i + 2] = this.DefaultColor[2];
                }
                else if (colorMap.has(color)) 
                {
                    let colorValue = colorMap.get(color);
                    this.ImageData.data[i] = colorValue[0];
                    this.ImageData.data[i + 1] = colorValue[1];
                    this.ImageData.data[i + 2] = colorValue[2];
                }
            }
            this.Canvas.clearRect(left, top, drawImageWidth, drawImageHeight);
            this.Canvas.putImageData(this.ImageData, left, top, 0, 0, drawImageWidth, drawImageHeight);
        }
        else 
        {
            this.Canvas.putImageData(this.ImageData, left, top, 0, 0, drawImageWidth, drawImageHeight);
        }
    }
}


//  雷达图
function ChartRadar() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BorderPoint = [];    //边框点
    this.DataPoint = [];      //数据点
    this.CenterPoint = {};
    this.StartAngle = 0;
    this.Color = 'rgb(198,198,198)';
    this.AreaColor = 'rgba(242,154,118,0.4)';    //面积图颜色
    this.AreaLineColor = 'rgb(242,154,118)';
    this.TitleFont = '24px 微软雅黑';
    this.TitleColor = 'rgb(102,102,102)';
    this.BGColor = ['rgb(255,255,255)', 'rgb(224,224,224)']//背景色

    this.DrawBorder = function ()  //画边框
    {
        if (this.BorderPoint.length <= 0) return;

        this.Canvas.font = this.TitleFont;
        this.Canvas.strokeStyle = this.Color;

        const aryBorder = [1, 0.8, 0.6, 0.4, 0.2];
        for (let j in aryBorder) 
        {
            var rate = aryBorder[j];
            var isFirstDraw = true;
            for (let i in this.BorderPoint) 
            {
                var item = this.BorderPoint[i];
                item.X = this.CenterPoint.X + item.Radius * Math.cos(item.Angle * Math.PI / 180) * rate;
                item.Y = this.CenterPoint.Y + item.Radius * Math.sin(item.Angle * Math.PI / 180) * rate;
                if (isFirstDraw) 
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(item.X, item.Y);
                    isFirstDraw = false;
                }
                else 
                {
                    this.Canvas.lineTo(item.X, item.Y);
                }

                if (j == 0) this.DrawText(item);
            }

            this.Canvas.closePath();
            this.Canvas.stroke();
            this.Canvas.fillStyle = this.BGColor[j % 2 == 0 ? 0 : 1];
            this.Canvas.fill();
        }

        this.Canvas.beginPath();
        for (let i in this.BorderPoint) 
        {
            var item = this.BorderPoint[i];
            item.X = this.CenterPoint.X + item.Radius * Math.cos(item.Angle * Math.PI / 180);
            item.Y = this.CenterPoint.Y + item.Radius * Math.sin(item.Angle * Math.PI / 180);
            this.Canvas.moveTo(this.CenterPoint.X, this.CenterPoint.Y);
            this.Canvas.lineTo(item.X, item.Y);
        }
        this.Canvas.stroke();
    }

    this.DrawArea = function () 
    {
        if (!this.DataPoint || this.DataPoint.length <= 0) return;

        this.Canvas.fillStyle = this.AreaColor;
        this.Canvas.strokeStyle = this.AreaLineColor;
        this.Canvas.beginPath();
        var isFirstDraw = true;
        for (let i in this.DataPoint) 
        {
            var item = this.DataPoint[i];
            if (isFirstDraw) 
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(item.X, item.Y);
                isFirstDraw = false;
            }
            else 
            {
                this.Canvas.lineTo(item.X, item.Y);
            }
        }

        this.Canvas.closePath();
        this.Canvas.fill();
        this.Canvas.stroke();
    }

    this.DrawText = function (item) 
    {
        if (!item.Text) return;

        //console.log(item.Text, item.Angle);
        this.Canvas.fillStyle = this.TitleColor;
        var xText = item.X, yText = item.Y;

        //显示每个角度的位置
        if (item.Angle > 0 && item.Angle < 45) 
        {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'middle';
            xText += 2;
        }
        else if (item.Angle >= 0 && item.Angle < 90) {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'top';
            xText += 2;
        }
        else if (item.Angle >= 90 && item.Angle < 135) 
        {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'top';
            xText -= 2;
        }
        else if (item.Angle >= 135 && item.Angle < 180) 
        {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'top';
            xText -= 2;
        }
        else if (item.Angle >= 180 && item.Angle < 225) {
            this.Canvas.textAlign = 'right';
            this.Canvas.textBaseline = 'middle';
            xText -= 2;
        }
        else if (item.Angle >= 225 && item.Angle <= 270) {
            this.Canvas.textAlign = 'center';
            this.Canvas.textBaseline = 'bottom';
        }
        else if (item.Angle > 270 && item.Angle < 315) 
        {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'bottom';
            xText += 2;
        }
        else 
        {
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'middle';
            xText += 2;
        }

        this.Canvas.fillText(item.Text, xText, yText);
    }

    this.Draw = function () 
    {
        this.BorderPoint = [];
        this.DataPoint = [];
        this.InternalBorderPoint = [];
        this.CenterPoint = {};
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length > 0))
            this.CalculatePoints(null);
        else
            this.CalculatePoints(this.Data.Data);

        this.DrawBorder();
        this.DrawArea();
    }

    this.CalculatePoints = function (data) 
    {
        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        let ptCenter = { X: left + width / 2, Y: top + height / 2 };  //中心点
        let radius = Math.min(width / 2, height / 2) - 2         //半径
        let count = Math.max(5, data ? data.length : 0);
        let averageAngle = 360 / count;
        for (let i = 0; i < count; ++i) 
        {
            let ptBorder = { Index: i, Radius: radius, Angle: i * averageAngle + this.StartAngle };
            let angle = ptBorder.Angle;

            if (data && i < data.length) 
            {
                var item = data[i];
                let ptData = { Index: i, Text: item.Text };
                ptBorder.Text = item.Name;
                if (!item.Value)
                 {
                    ptData.X = ptCenter.X;
                    ptData.Y = ptCenter.Y;
                }
                else 
                {
                    var value = item.Value;
                    if (value >= 1) value = 1;
                    var dataRadius = radius * value;
                    ptData.X = ptCenter.X + dataRadius * Math.cos(angle * Math.PI / 180);
                    ptData.Y = ptCenter.Y + dataRadius * Math.sin(angle * Math.PI / 180);
                }

                this.DataPoint.push(ptData);
            }

            this.BorderPoint.push(ptBorder);
        }
        this.CenterPoint = ptCenter;
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
//十字光标
function ChartCorssCursor() 
{
    this.Frame;
    this.Canvas;                            //画布

    this.HPenColor = g_JSChartResource.CorssCursorHPenColor; //水平线颜色
    this.HPenType = 0;  //水平线样式 0=虚线 1=实线

    this.VPenColor = g_JSChartResource.CorssCursorVPenColor; //垂直线颜色
    this.VPenType = 0;  //垂直线颜色 0=虚线 1=实线 2=K线宽度

    this.Font = g_JSChartResource.CorssCursorTextFont;            //字体
    this.TextColor = g_JSChartResource.CorssCursorTextColor;      //文本颜色
    this.TextBGColor = g_JSChartResource.CorssCursorBGColor;      //文本背景色
    this.TextHeight = 15;                     //文本字体高度
    this.LastPoint;
    this.CursorIndex;       //当前数据的位置

    this.PointX;
    this.PointY;

    this.StringFormatX;
    this.StringFormatY;

    this.IsShow = true;       //是否显示
    this.ShowTextMode = { Left: 1, Right: 1, Bottom: 1 }; //0=不显示  1=显示在框架外 2=显示在框架内
    this.IsShowCorss = true;    //是否显示十字光标
    this.IsShowClose = false;     //Y轴始终显示收盘价

    //内部使用
    this.Close = null;     //收盘价格

    this.GetCloseYPoint = function (index) 
    {
        this.Close = null;
        if (!this.StringFormatX.Data) return null;
        var data = this.StringFormatX.Data;
        if (!data.Data || data.Data.length <= 0) return null;
        var dataIndex = data.DataOffset + index;
        if (dataIndex >= data.Data.length) dataIndex = data.Data.length - 1;
        if (dataIndex < 0) return null;

        var klineData = data.Data[dataIndex];
        if (!klineData) return null;
        this.Close = klineData.Close;
        var yPoint = this.Frame.GetYFromData(this.Close);
        return yPoint;
    }

    this.Draw = function () 
    {
        if (!this.LastPoint) return;

        var x = this.LastPoint.X;
        var y = this.LastPoint.Y;

        var isInClient = false;
        var rtClient = new Rect(this.Frame.ChartBorder.GetLeft(), this.Frame.ChartBorder.GetTop(), this.Frame.ChartBorder.GetWidth(), this.Frame.ChartBorder.GetHeight());
        isInClient = rtClient.IsPointIn(x, y);
        this.PointY = null;
        this.PointY == null;

        if (!isInClient) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var left = this.Frame.ChartBorder.GetLeft();
        var right = this.Frame.ChartBorder.GetRight();
        var top = this.Frame.ChartBorder.GetTopTitle();
        var bottom = this.Frame.ChartBorder.GetBottom();
        var rightWidth = this.Frame.ChartBorder.Right;
        var chartRight = this.Frame.ChartBorder.GetChartWidth();
        x = this.Frame.GetXFromIndex(this.CursorIndex); //手机端 十字只能画在K线上
        if (this.IsShowClose) 
        {
            var yPoint = this.GetCloseYPoint(this.CursorIndex);
            if (yPoint != null) y = yPoint;
        }

        this.PointY = [[left, y], [right, y]];
        this.PointX = [[x, top], [x, bottom]];

        if (this.IsShowCorss)   //十字线
        {
            this.Canvas.save();
            this.Canvas.strokeStyle = this.HPenColor;
            if (this.HPenType == 0) this.Canvas.setLineDash([3, 2]);   //虚线
            //this.Canvas.lineWidth=0.5
            this.Canvas.beginPath();
            this.Canvas.moveTo(left, ToFixedPoint(y));
            this.Canvas.lineTo(right, ToFixedPoint(y));
            this.Canvas.stroke();
            this.Canvas.restore();


            this.Canvas.save();
            this.Canvas.strokeStyle = this.VPenColor;
            if (this.VPenType == 0) 
            {
                this.Canvas.setLineDash([3, 2]);   //虚线
            }
            else if (this.VPenType == 2) 
            {
                let barWidth = this.Frame.SubFrame[0].Frame.DataWidth;    //和K线一样宽度
                if (barWidth > 2) this.Canvas.lineWidth = barWidth;
            }

            this.Canvas.beginPath();
            if (this.Frame.SubFrame.length > 0) 
            {
                for (var i in this.Frame.SubFrame) 
                {
                    var frame = this.Frame.SubFrame[i].Frame;
                    top = frame.ChartBorder.GetTopTitle();
                    bottom = frame.ChartBorder.GetBottom();
                    this.Canvas.moveTo(ToFixedPoint(x), top);
                    this.Canvas.lineTo(ToFixedPoint(x), bottom);
                }
            }
            else 
            {
                this.Canvas.moveTo(ToFixedPoint(x), top);
                this.Canvas.lineTo(ToFixedPoint(x), bottom);
            }

            this.Canvas.stroke();
            this.Canvas.restore();
        }

        var xValue = this.Frame.GetXData(x);
        var yValueExtend = {};
        var yValue = this.Frame.GetYData(y, yValueExtend);
        this.StringFormatY.RValue = yValueExtend.RightYValue; //右侧子坐标
        if (this.IsShowClose && this.Close != null) yValue = this.Close;

        this.StringFormatX.Value = this.CursorIndex;
        this.StringFormatY.Value = yValue;
        this.StringFormatY.FrameID = yValueExtend.FrameID;

        if (((this.ShowTextMode.Left == 1 && this.Frame.ChartBorder.Left >= 30) || this.ShowTextMode.Left == 2 ||
            (this.ShowTextMode.Right == 1 && this.Frame.ChartBorder.Right >= 30) || this.ShowTextMode.Right == 2) && this.StringFormatY.Operator()) 
        {
            var text = this.StringFormatY.Text;
            this.Canvas.font = this.Font;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素

            if (this.Frame.ChartBorder.Left >= 30 && this.ShowTextMode.Left == 1) 
            {
                this.Canvas.fillStyle = this.TextBGColor;
                if (left < textWidth) //左边空白的地方太少了画布下
                {
                    this.Canvas.fillRect(2, y - this.TextHeight / 2, textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, 2 + 2, y, textWidth);
                }
                else 
                {
                    this.Canvas.fillRect(left - 2, y - this.TextHeight / 2, -textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, left - 4, y, textWidth);
                }
            }
            else if (this.ShowTextMode.Left == 2) 
            {
                this.Canvas.fillStyle = this.TextBGColor;
                this.Canvas.fillRect(left, y - this.TextHeight / 2, textWidth, this.TextHeight);
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, left + 2, y, textWidth);
            }

            if (this.StringFormatY.RText) 
            {
                text = this.StringFormatY.RText;
                var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            }

            if (this.Frame.ChartBorder.Right >= 30 && this.ShowTextMode.Right == 1) 
            {
                this.Canvas.fillStyle = this.TextBGColor;
                if (rightWidth > textWidth)               //右边不够就不画
                {
                    this.Canvas.fillRect(right + 2, y - this.TextHeight / 2, textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, right + 4, y, textWidth);
                }
                else 
                {
                    this.Canvas.fillRect(chartRight - 2 - textWidth, y - this.TextHeight / 2, textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, chartRight - 4, y, textWidth);
                }
            }
            else if (this.ShowTextMode.Right == 2) 
            {
                this.Canvas.fillStyle = this.TextBGColor;
                var showLeft = right - textWidth;
                this.Canvas.fillRect(showLeft, y - this.TextHeight / 2, textWidth, this.TextHeight);
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, showLeft + 2, y, textWidth);
            }
        }

        if (this.ShowTextMode.Bottom == 1 && this.StringFormatX.Operator()) 
        {
            var text = this.StringFormatX.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            if (x - textWidth / 2 < 3)    //左边位置不够了, 顶着左边画
            {
                this.Canvas.fillRect(x - 1, bottom + 2, textWidth, this.TextHeight);
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, x + 1, bottom + 2, textWidth);
            }
            else if ((right - left) - x < textWidth) 
            {            //右边位置不够用，顶着右边画
                this.Canvas.fillRect(x - textWidth, bottom + 2, textWidth, this.TextHeight);
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, x - 1, bottom + 2, textWidth);
            }
            else 
            {
                this.Canvas.fillRect(x - textWidth / 2, bottom + 2, textWidth, this.TextHeight);
                this.Canvas.textAlign = "center";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, x, bottom + 2, textWidth);
            }
        }
    }

    this.HScreenDraw = function () 
    {
        var x = this.LastPoint.X;
        var y = this.LastPoint.Y;

        y = this.Frame.GetXFromIndex(this.CursorIndex); //手机端 十字只能画在K线上

        var left = this.Frame.ChartBorder.GetLeft();
        var right = this.Frame.ChartBorder.GetRightEx();
        var top = this.Frame.ChartBorder.GetTop();
        var bottom = this.Frame.ChartBorder.GetBottom();
        var bottomWidth = this.Frame.ChartBorder.Bottom;

        this.PointY = [[left, y], [right, y]];
        this.PointX = [[x, top], [x, bottom]];

        if (this.IsShowCorss)   //十字线
        {
            this.Canvas.save();
            this.Canvas.strokeStyle = this.HPenColor;
            if (this.HPenType == 0) this.Canvas.setLineDash([3, 2]);   //虚线
           
            //画竖线
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(x), top);
            this.Canvas.lineTo(ToFixedPoint(x), bottom);
            this.Canvas.stroke();
            this.Canvas.restore();

            this.Canvas.save();
            this.Canvas.strokeStyle = this.VPenColor;
            if (this.VPenType == 0) 
            {
                this.Canvas.setLineDash([3, 2]);   //虚线
            }
            else if (this.VPenType == 2) 
            {
                let barWidth = this.Frame.SubFrame[0].Frame.DataWidth;    //和K线一样宽度
                if (barWidth > 2) this.Canvas.lineWidth = barWidth;
            }
            this.Canvas.beginPath();
            //画横线
            if (this.Frame.SubFrame.length > 0) 
            {
                for (var i in this.Frame.SubFrame) 
                {
                    var frame = this.Frame.SubFrame[i].Frame;
                    this.Canvas.moveTo(frame.ChartBorder.GetLeft(), ToFixedPoint(y));
                    this.Canvas.lineTo(frame.ChartBorder.GetRightTitle(), ToFixedPoint(y));
                }
            }
            else 
            {
                this.Canvas.moveTo(left, ToFixedPoint(y));
                this.Canvas.lineTo(right, ToFixedPoint(y));
            }

            this.Canvas.stroke();
            this.Canvas.restore();
        }

        var xValue = this.Frame.GetXData(y);
        var yValueExtend = {};
        var yValue = this.Frame.GetYData(x, yValueExtend);

        this.StringFormatX.Value = xValue;
        this.StringFormatY.Value = yValue;
        this.StringFormatY.FrameID = yValueExtend.FrameID;

        if (((this.ShowTextMode.Left == 1 && this.Frame.ChartBorder.Top >= 30) || this.ShowTextMode.Left == 2 ||
            (this.ShowTextMode.Right == 1 && this.Frame.ChartBorder.Bottom >= 30) || this.ShowTextMode.Right == 2) && this.StringFormatY.Operator()) {
            var text = this.StringFormatY.Text;
            this.Canvas.font = this.Font;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素

            if (this.Frame.ChartBorder.Top >= 30 && this.ShowTextMode.Left == 1) {
                var xText = x, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                this.Canvas.fillStyle = this.TextBGColor;

                if (top >= textWidth) {
                    this.Canvas.fillRect(-textWidth, -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, -2, 0, textWidth);
                }
                else {
                    this.Canvas.fillRect((textWidth - top), -(this.TextHeight / 2), -textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, (textWidth - top) - 2, 0, textWidth);
                }
                this.Canvas.restore();
            }
            else if (this.ShowTextMode.Left == 2) {
                var xText = x;
                var yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillStyle = this.TextBGColor;
                this.Canvas.fillRect(0, -(this.TextHeight / 2), textWidth, this.TextHeight);
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, 2, 0, textWidth);

                this.Canvas.restore();
            }

            if (this.Frame.ChartBorder.Bottom >= 30 && this.ShowTextMode.Right == 1) {
                var xText = x, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                this.Canvas.fillStyle = this.TextBGColor;

                if (bottomWidth > textWidth) {
                    this.Canvas.fillRect(0, -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, 2, 0, textWidth);
                }
                else {
                    this.Canvas.fillRect((bottomWidth - textWidth), -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, (bottomWidth - textWidth) + 2, 0, textWidth);
                }
                this.Canvas.restore();
            }
            else if (this.ShowTextMode.Right == 2) {
                var xText = x;
                var yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillStyle = this.TextBGColor;
                this.Canvas.fillRect(0, -(this.TextHeight / 2), -textWidth, this.TextHeight);
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, -2, 0, textWidth);

                this.Canvas.restore();
            }
        }

        if (this.ShowTextMode.Bottom === 1 && this.StringFormatX.Operator()) {
            var text = this.StringFormatX.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            if (y - textWidth / 2 < 3)    //左边位置不够了, 顶着左边画
            {
                var xText = left;
                var yText = y;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(0, 0, textWidth, this.TextHeight);
                this.Canvas.textAlign = "center";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, 0, 0, textWidth);

                this.Canvas.restore();
            }
            else {
                var xText = left;
                var yText = y;

                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(-(textWidth / 2), 0, textWidth, this.TextHeight);
                this.Canvas.textAlign = "center";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, 0, 0, textWidth);

                this.Canvas.restore();
            }
        }
    }
}



///////////////////////////////////////////////////////////////////////////////////////
// 公共函数

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
    JSCommonChartPaint:
    {
        IChartPaintin: IChartPainting,
        ChartKLine: ChartKLine,
        ChartLine: ChartLine,
        ChartSubLine: ChartSubLine,
        ChartSingleText: ChartSingleText,
        ChartPointDot: ChartPointDot,
        ChartStick: ChartStick,
        ChartLineStick: ChartLineStick,
        ChartStickLine: ChartStickLine,
        ChartOverlayKLine: ChartOverlayKLine,
        ChartMinuteInfo: ChartMinuteInfo,
        ChartRectangle: ChartRectangle,
        ChartMultiText: ChartMultiText,
        ChartMultiLine: ChartMultiLine,
        ChartBuySell: ChartBuySell,
        ChartMultiBar: ChartMultiBar,

        ChartPie: ChartPie,
        ChartCircle: ChartCircle,
        ChartChinaMap: ChartChinaMap,
        ChartRadar: ChartRadar, 

        ChartCorssCursor: ChartCorssCursor, //十字光标 
    },

    //单个类导出
    JSCommonChartPaint_IChartPainting: IChartPainting,
    JSCommonChartPaint_ChartKLine: ChartKLine,
    JSCommonChartPaint_ChartLine: ChartLine,
    JSCommonChartPaint_ChartSubLine: ChartSubLine,
    JSCommonChartPaint_ChartSingleText: ChartSingleText,
    JSCommonChartPaint_ChartPointDot: ChartPointDot,
    JSCommonChartPaint_ChartStick: ChartStick,
    JSCommonChartPaint_ChartLineStick: ChartLineStick,
    JSCommonChartPaint_ChartStickLine: ChartStickLine,
    JSCommonChartPaint_ChartOverlayKLine: ChartOverlayKLine,
    JSCommonChartPaint_ChartPie: ChartPie,
    JSCommonChartPaint_ChartCircle: ChartCircle,
    JSCommonChartPaint_ChartChinaMap: ChartChinaMap,
    JSCommonChartPaint_ChartRadar: ChartRadar,
    JSCommonChartPaint_ChartMinuteInfo: ChartMinuteInfo,
    JSCommonChartPaint_ChartRectangle: ChartRectangle,
    JSCommonChartPaint_ChartMultiText: ChartMultiText,
    JSCommonChartPaint_ChartMultiLine: ChartMultiLine,
    JSCommonChartPaint_ChartMultiBar: ChartMultiBar,
    JSCommonChartPaint_ChartBuySell: ChartBuySell,
    JSCommonChartPaint_ChartCorssCursor: ChartCorssCursor,
};