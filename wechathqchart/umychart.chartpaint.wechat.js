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
    ChartData, HistoryData,
    SingleData, MinuteData,
    Rect,RectV2,
    JSCHART_EVENT_ID,
    OVERLAY_STATUS_ID,
    JSCHART_CORSSCURSOR_STATUS_ID,
    CloneData
} from "./umychart.data.wechat.js";

import 
{
    g_JSChartResource,
    g_JSChartLocalization,
    JSChartResource,
} from './umychart.resource.wechat.js'

import 
{
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

import
{
    JSCommonCoordinateData,
    MARKET_SUFFIX_NAME
} from "./umychart.coordinatedata.wechat.js";

import { JSConsole } from "./umychart.console.wechat.js";
import { Path2DHelper } from "./umychart.data.wechat.js"

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


function GetFontHeight(context, font, word)
{
    if (!context) return null;

    if (font) context.font=font;

    var text='擎';
    if (IFrameSplitOperator.IsString(word)) text=word;

    var fontInfo=context.measureText(text);
    //var textHeight=fontInfo.fontBoundingBoxAscent + fontInfo.fontBoundingBoxDescent;
    var textHeight=fontInfo.width+2;

    return textHeight;
}

function ColorToRGBA(color,opacity)
{
    var reg = /^(rgb|RGB)/;
    if (reg.test(color)) 
    {
        var strHex = "#";
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");    // 把RGB的3个数值变成数组
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) 
        {
            var hex = Number(colorArr[i]).toString(16);
            if (hex === "0")  hex += hex;
            strHex += hex;
        }

        color=strHex;
    }
    
    return "rgba(" + parseInt("0x" + color.slice(1, 3)) + "," + parseInt("0x" + color.slice(3, 5)) + "," + parseInt("0x" + color.slice(5, 7)) + "," + opacity + ")";
}


//图新画法接口类
function IChartPainting() 
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName = 'IChartPainting';    //类名
    this.Data = new ChartData();          //数据区
    this.Script;                        //图形对应的指标脚本 (只有指标图形才有)

    this.NotSupportMessage = null;
    this.MessageFont = g_JSChartPaintResource.Index.NotSupport.Font;
    this.MessageColor = g_JSChartPaintResource.Index.NotSupport.TextColor;

    this.IsDrawFirst = false;             //是否比K线先画
    this.IsShow = true;                   //是否显示
    this.IsVisible=true;                  //是否显示 (预留给外部单独设置线段显隐)
    this.GetEventCallback;

    this.Draw = function () { }

    this.BuildKey=function(item)
    {
        if (IFrameSplitOperator.IsNumber(item.Time)) return `${item.Date}-${item.Time}`;
        else return item.Date;
    }

    this.GetYFromData=function(value,isLimit)
    {
        return this.ChartFrame.GetYFromData(value,isLimit);
    }

    this.GetBorder=function()
    {
        if (this.ChartFrame.IsHScreen) return this.ChartBorder.GetHScreenBorder();
        return this.ChartBorder.GetBorder();
    }
    
    this.IsMinuteFrame=function()
    {
        var isMinute=(this.ChartFrame.ClassName=="MinuteFrame" || this.ChartFrame.ClassName=="MinuteHScreenFrame" ||
            this.ChartFrame.ClassName=="OverlayMinuteFrame" || this.ChartFrame.ClassName=="OverlayMinuteHScreenFrame");

        return isMinute
    }

    //是否隐藏指标
    this.IsHideScriptIndex=function()
    {
        if (this.Script && this.Script.IsShow==false) return true;
        return false;
    }

    this.DrawNotSupportmessage=function() 
    {
        this.Canvas.font = this.MessageFont;
        this.Canvas.fillStyle = this.MessageColor;

        var left = this.ChartBorder.GetLeft();
        var width = this.ChartBorder.GetWidth();
        var top = this.ChartBorder.GetTopEx();
        var height = this.ChartBorder.GetHeightEx();

        var x = left + width / 2;
        var y = top + height / 2;

        var bHScreen=this.ChartFrame.IsHScreen;
        if (bHScreen)
        {
            this.Canvas.save(); 
            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);
            x=0,y=0;
        }

        this.Canvas.textAlign = "center";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillText(this.NotSupportMessage, x, y);

        if (bHScreen)  this.Canvas.restore();
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

    this.GetDynamicFontEx=function(dataWidth, distanceWidth,  maxSize, minSize, zoom, fontname)    //根据宽度自动获取对应字体
    {
        if (maxSize==minSize)
        {
            var font=`${maxSize.toFixed(0)}px ${fontname}` ;
            return font;
        }

        var fontSize=(dataWidth+distanceWidth);
        if (zoom)
        {
            if (zoom.Type==0) 
            {
                if (zoom.Value>0) fontSize=(dataWidth*zoom.Value);
            }
            else if (zoom.Type==1)
            {
                if (zoom.Value>0) fontSize=(dataWidth+distanceWidth)*zoom.Value;
            }
            else if (zoom.Type==2)
            {
                if (IFrameSplitOperator.IsNumber(zoom.Value)) 
                    fontSize=(dataWidth+distanceWidth) + (2*zoom.Value);
            }
        }

        if (fontSize<minSize) fontSize=minSize;
        else if (fontSize>maxSize) fontSize=maxSize;

        var font=`${fontSize.toFixed(0)}px ${fontname}` ;
        return font;
    }

    this.SetFillStyle = function (color, x0, y0, x1, y1) 
    {
        if (Array.isArray(color)) 
        {
            let gradient = this.Canvas.createLinearGradient(x0, y0, x1, y1);
            var offset = 1 / (color.length-1);
            for (var i=0;i<color.length;++i)
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

    this.GetFontHeight=function(font)
    {
        return GetFontHeight(this.Canvas, font, "擎");
    }

    this.GetLockRect=function()
    {
        return this.ChartFrame.GetLockRect();
    }

    this.ClipClient=function(isHScreen)          //裁剪客户端
    {
        if (isHScreen==true)
        {
            var left=this.ChartBorder.GetLeftEx();
            var right=this.ChartBorder.GetRightEx();
            var top=this.ChartBorder.GetTop();
            var bottom=this.ChartBorder.GetBottom();
        }
        else
        {
            var left=this.ChartBorder.GetLeft();
            var right=this.ChartBorder.GetRight();
            var top=this.ChartBorder.GetTopEx();
            var bottom=this.ChartBorder.GetBottomEx();
        }

        this.Canvas.beginPath();
        this.Canvas.rect(left,top,(right-left),(bottom-top));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();
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
    this.DrawType = 0;    // 0=K线  1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积 6=空心阴线阳线柱 9=自定义颜色K线
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

    this.MinBarWidth=g_JSChartResource.MinKLineBarWidth; //最小的柱子宽度
    this.MinColorBarWidth=g_JSChartResource.MinColorKBarWidth;

    this.CustomKLine;       //自定义K线, key=date*1000000+time,  key={ Color:, DrawType: }

    //当前屏显示K线信息
    this.ShowRange={ };     //K线显示范围 { Start:, End:,  DataCount:, ShowCount: }
    this.DrawKRange={ Start:null, End:null };   //当前屏K线的索引{ Start: , End:}

    //未回补的价格缺口
    this.PriceGap={ Enable:false, Count:1 };
    this.PriceGapStyple=
    { 
        Line:{ Color:g_JSChartResource.PriceGapStyple.Line.Color }, 
        Text:{ Color:g_JSChartResource.PriceGapStyple.Text.Color, Font: g_JSChartResource.PriceGapStyple.Text.Font } 
    };
    this.AryPriceGapCache=[];   //缺口数据 { }
    this.OneLimitBarType=0;    //一字板颜色类型 4个价格全部都在同一个价位上 0=使用平盘颜色 1=跟昨收比较
    this.EnableColorBar=false;  //K线柱子是否支持自定义颜色

    this.DrawAKLine = function ()  //美国线
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.DrawKRange.Start=this.Data.DataOffset;

        var eventUnchangeKLine=null;    //定制平盘K线颜色事件
        if (this.GetEventCallback)
        {
            eventUnchangeKLine=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_UNCHANGE_KLINE_COLOR);
        }

        var upColor=this.UpColor;
        var downColor=this.DownColor;
        var unchagneColor=this.UnchagneColor; 

        var ptMax = { X: null, Y: null, Value: null, Align: 'left' };
        var ptMin = { X: null, Y: null, Value: null, Align: 'left' };
        var preKItemInfo=null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
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
            this.DrawKRange.End=i;
            var kItemInfo={ Data:data, Coordinate:{ X:x, Low:yLow, High:yHigh, Close:yClose, Open:yOpen, Left:left, Right:right } };

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

            if (data.Open < data.Close) 
            {
                this.Canvas.strokeStyle =upColor; //阳线
            }
            else if (data.Open > data.Close) 
            {
                this.Canvas.strokeStyle = downColor; //阴线
            }
            else 
            {
                if (eventUnchangeKLine && eventUnchangeKLine.Callback)
                {
                    var sendData={ KItem:data, DataIndex:i, DefaultColor:unchagneColor, BarColor:null };
                    eventUnchangeKLine.Callback(eventUnchangeKLine, sendData, this);
                    if (sendData.BarColor) unchagneColor=sendData.BarColor;
                }

                this.Canvas.strokeStyle =unchagneColor; //平线
            }

            this.Canvas.beginPath();   //最高-最低
            if (isHScreen) 
            {
                if (data.High==data.Low && dataWidth < this.MinBarWidth)
                {
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow-1, ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow, ToFixedPoint(x));
                }
            }
            else 
            {
                if (data.High==data.Low && dataWidth < this.MinBarWidth)
                {
                    this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x), yLow+1);
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x), yLow);
                }
            }

            this.Canvas.stroke();

            if (dataWidth >= this.MinBarWidth) 
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

            if (this.Data.DataType == 0 && ChartData.IsDayPeriod(this.Data.Period,true)) //信息地雷
            {
                var infoItem = { X: x, Xleft: left, XRight: right, YMax: yHigh, YMin: yLow, DayData: data, Index: j };
                this.DrawInfoDiv(infoItem);
            }

            if (this.PriceGap.Enable && preKItemInfo)
            {
                this.CheckPriceGap(kItemInfo);

                var value=this.IsPriceGap(kItemInfo,preKItemInfo);
                if (value>0)
                    this.AryPriceGapCache.push({ Data:[preKItemInfo, kItemInfo], Type:value });
            }
    
            preKItemInfo=kItemInfo;
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

        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.DrawKRange.Start=this.Data.DataOffset;

        var bFirstPoint = true;
        this.Canvas.beginPath();
        this.Canvas.strokeStyle = this.CloseLineColor;
        var preKItemInfo=null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            this.DrawKRange.End=i;

            if (bFirstPoint) {
                if (isHScreen) this.Canvas.moveTo(yClose, x);
                else this.Canvas.moveTo(x, yClose);
                bFirstPoint = false;
            }
            else {
                if (isHScreen) this.Canvas.lineTo(yClose, x);
                else this.Canvas.lineTo(x, yClose);
            }

            if (this.PriceGap.Enable )
            {
                var yLow=this.GetYFromData(data.Low, false);
                var yHigh=this.GetYFromData(data.High, false);
                var yOpen=this.GetYFromData(data.Open, false);

                var kItemInfo={ Data:data, Coordinate:{ X:x, Low:yLow, High:yHigh, Close:yClose, Open:yOpen, Left:left, Right:right }};

                if (preKItemInfo)
                {
                    this.CheckPriceGap(kItemInfo);
                    var value=this.IsPriceGap(kItemInfo,preKItemInfo);
                    if (value>0) this.AryPriceGapCache.push({ Data:[preKItemInfo, kItemInfo], Type:value });
                }

                preKItemInfo=kItemInfo;
            }
        }

        if (bFirstPoint == false) this.Canvas.stroke();
    }

    this.DrawCloseArea = function ()   //收盘价面积
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xPointCount = this.ChartFrame.XPointCount;

        if (isHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.BottomEx;
            var borderLeft=border.TopEx;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var borderLeft=border.LeftEx;
        }

        var bFirstPoint = true;
        var firstPoint = null;
        this.Canvas.beginPath();
        this.Canvas.strokeStyle = this.CloseLineColor;
        var ptLast=null;
        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.DrawKRange.Start=this.Data.DataOffset;

        if (this.Data.DataOffset>0) //把最左边的一个点连上
        {
            var data=this.Data.Data[this.Data.DataOffset-1];
            if (data && IFrameSplitOperator.IsNumber(data.Close))
            {
                var x=borderLeft;
                var yClose=this.GetYFromData(data.Close,false);
                if (isHScreen) 
                {
                    this.Canvas.moveTo(yClose,x);
                    firstPoint={ X:yClose, Y:x };
                }
                else 
                {
                    this.Canvas.moveTo(x,yClose);
                    firstPoint={ X:x, Y:yClose };
                }
                bFirstPoint=false;
            }
        }

        var preKItemInfo=null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            this.DrawKRange.End=i;

            if (bFirstPoint) 
            {
                if (isHScreen) 
                {
                    this.Canvas.moveTo(yClose, x);
                    firstPoint = { X: yClose, Y: x };
                }
                else
                {
                    this.Canvas.moveTo(x, yClose);
                    firstPoint = { X: x, Y: yClose };
                }
                bFirstPoint = false;
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(yClose, x);
                else this.Canvas.lineTo(x, yClose);
            }

            if (i==this.Data.Data.length-1)
            {
                ptLast={ X:x, Y:yClose, XLeft:left, XRight:right, KItem:data, ChartRight:chartright };
            }

            if (this.PriceGap.Enable )
            {
                var yLow=this.GetYFromData(data.Low, false);
                var yHigh=this.GetYFromData(data.High, false);
                var yOpen=this.GetYFromData(data.Open, false);

                var kItemInfo={ Data:data, Coordinate:{ X:x, Low:yLow, High:yHigh, Close:yClose, Open:yOpen, Left:left, Right:right }};

                if (preKItemInfo)
                {
                    this.CheckPriceGap(kItemInfo);
                    var value=this.IsPriceGap(kItemInfo,preKItemInfo);
                    if (value>0) this.AryPriceGapCache.push({ Data:[preKItemInfo, kItemInfo], Type:value });
                }

                preKItemInfo=kItemInfo;
            }
        }

        this.DrawLastPointEvent(ptLast);  //通知外部绘制最后一个点

        if (bFirstPoint) return;

        this.Canvas.stroke();
        //画面积
        if (isHScreen) 
        {
            this.Canvas.lineTo(this.ChartBorder.GetLeft(), x);
            this.Canvas.lineTo(this.ChartBorder.GetLeft(), firstPoint.Y);
        }
        else 
        {
            this.Canvas.lineTo(x, this.ChartBorder.GetBottom());
            this.Canvas.lineTo(firstPoint.X, this.ChartBorder.GetBottom());
        }
        this.Canvas.closePath();

        if (Array.isArray(this.CloseLineAreaColor)) 
        {
            if (isHScreen) 
            {
                let gradient = this.Canvas.createLinearGradient(this.ChartBorder.GetRightEx(), this.ChartBorder.GetTop(), this.ChartBorder.GetLeft(), this.ChartBorder.GetTop());
                gradient.addColorStop(0, this.CloseLineAreaColor[0]);
                gradient.addColorStop(1, this.CloseLineAreaColor[1]);
                this.Canvas.fillStyle = gradient;
            }
            else 
            {
                let gradient = this.Canvas.createLinearGradient(firstPoint.X, this.ChartBorder.GetTopEx(), firstPoint.X, this.ChartBorder.GetBottom());
                gradient.addColorStop(0, this.CloseLineAreaColor[0]);
                gradient.addColorStop(1, this.CloseLineAreaColor[1]);
                this.Canvas.fillStyle = gradient;
            }
        }
        else 
        {
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
        var border=this.ChartBorder.GetBorder();
        
        if (isHScreen) 
        {
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            chartright = this.ChartBorder.GetBottom();
        }

        var ptMax = { X: null, Y: null, Value: null, Align: 'left' };
        var ptMin = { X: null, Y: null, Value: null, Align: 'left' };

        var upColor = this.UpColor;
        var downColor = this.DownColor;
        var unchagneColor = this.UnchagneColor;
        var ptLast=null;
        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.DrawKRange.Start=this.Data.DataOffset;

        var eventUnchangeKLine=null;    //定制平盘K线颜色事件
        if (this.GetEventCallback)
        {
            eventUnchangeKLine=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_UNCHANGE_KLINE_COLOR);
        }

        var preKItemInfo=null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth), ++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;

            this.DrawKRange.End=i;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low);
            var yHigh = this.ChartFrame.GetYFromData(data.High);
            var yOpen = this.ChartFrame.GetYFromData(data.Open);
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            var y = yHigh;

            var kItemInfo={ Data:data, Coordinate:{ X:x, Low:yLow, High:yHigh, Close:yClose, Open:yOpen, Left:left, Right:right }};

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

            var kLineOption=this.GetCustomKLine(data);

            if (kLineOption)
            {
                var barColor=kLineOption.Color;
                if (!barColor)
                {
                    if (data.Open<data.Close) barColor=upColor;
                    else if (data.Open>data.Close) barColor=downColor;
                    else barColor=unchagneColor;
                }

                var drawType=this.DrawType;
                if (IFrameSplitOperator.IsNumber(kLineOption.DrawType)) drawType=kLineOption.DrawType;

                this.DrawKBar_Custom(data, dataWidth, barColor, drawType, kLineOption, x, y, left, right, yLow, yHigh, yOpen, yClose, border, isHScreen);
            }
            else if ((this.DrawType==9 || this.EnableColorBar) && data.ColorData)
            {
                this.DrawColorKBar(data, data.ColorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
            }
            else if (data.Open < data.Close)       //阳线
            {
                this.DrawKBar_Up(data, dataWidth, upColor, this.DrawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
            }
            else if (data.Open > data.Close)  //阴线
            {
                this.DrawKBar_Down(data, dataWidth, downColor, this.DrawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
            }
            else // 平线
            {
                var barColor=unchagneColor;
                if (eventUnchangeKLine && eventUnchangeKLine.Callback)
                {
                    var sendData={ KItem:data, DataIndex:i, DefaultColor:barColor, BarColor:null };
                    eventUnchangeKLine.Callback(eventUnchangeKLine, sendData, this);
                    if (sendData.BarColor) barColor=sendData.BarColor;
                }

                this.DrawKBar_Unchagne(data, dataWidth, barColor, this.DrawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
            }

            if (this.Data.DataType == 0 && ChartData.IsDayPeriod(this.Data.Period,true)) //信息地雷
            {
                var infoItem = { X: x, Xleft: left, XRight: right, YMax: yHigh, YMin: yLow, DayData: data, Index: j };
                this.DrawInfoDiv(infoItem);
            }

            if (i==this.Data.Data.length-1)
            {
                ptLast={ X:x, Y:yClose, XLeft:left, XRight:right, KItem:data, ChartRight:chartright };
            }

            if (this.PriceGap.Enable && preKItemInfo)
            {
                this.CheckPriceGap(kItemInfo);
                var value=this.IsPriceGap(kItemInfo,preKItemInfo);
                if (value>0) this.AryPriceGapCache.push({ Data:[preKItemInfo, kItemInfo], Type:value });
            }
    
            preKItemInfo=kItemInfo;
        }

        this.DrawLastPointEvent(ptLast);  //通知外部绘制最后一个点
        this.PtMax = ptMax;
        this.PtMin = ptMin;
    }

    this.DrawKBar_Up = function(data, dataWidth, upColor, drawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen) //阳线
    {
        var isEmptyBar=(drawType==3 || drawType==6);
        if (dataWidth >= this.MinBarWidth) 
        {
            if (isEmptyBar)
            {
                if ((dataWidth%2)!=0) dataWidth-=1;
            }

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
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(Math.min(yClose,yOpen)));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yClose));
                    }
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
                    if (isEmptyBar) //空心柱
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
                    if (isEmptyBar) //空心柱
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
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(Math.max(yClose,yOpen)));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yLow));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                    }
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

    this.DrawKBar_Down=function(data, dataWidth, downColor, drawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen) //阴线
    {
        var isEmptyBar=(drawType==6);
        if (dataWidth >= this.MinBarWidth) 
        {
            if (isEmptyBar)
            {
                if ((dataWidth%2)!=0) dataWidth-=1;
            }

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
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(Math.min(yClose,yOpen)));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yOpen));
                    }
                    
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
                if (Math.abs(yClose - y) < 1) 
                {
                    this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), 1);    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (isEmptyBar) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(y), ToFixedRect(dataWidth), ToFixedRect(yClose - y));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(y), ToFixedRect(dataWidth), ToFixedRect(yClose - y));
                    }
                }
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
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(Math.max(yClose,yOpen)));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yLow));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x), ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x), ToFixedPoint(yLow));
                    }
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

    this.DrawKBar_Unchagne=function(data, dataWidth, unchagneColor, drawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen) //平线
    {
        if (this.OneLimitBarType===1 && this.IsOneLimitBar(data))    //一字板
        {
            unchagneColor=this.GetOneLimitBarColor(data);
        }

        if (dataWidth >= this.MinBarWidth) 
        {
            if ((dataWidth%2)!=0) dataWidth-=1;

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
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed), y);
                    this.Canvas.lineTo(ToFixedPoint(xFixed), yOpen);
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
                this.Canvas.lineTo(ToFixedPoint(left+dataWidth), ToFixedPoint(y));
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
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed), ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(xFixed), ToFixedPoint(yLow));
                }
            }

            this.Canvas.stroke();
        }
        else 
        {
            this.Canvas.beginPath();
            if (isHScreen) 
            {
                if (data.High==data.Low)
                {
                    this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                    this.Canvas.lineTo(yLow-1,ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow, ToFixedPoint(x));
                }
            }
            else 
            {
                if (data.High==data.Low)
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow+1);
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x), yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x), yLow);
                }
               
            }
            this.Canvas.strokeStyle = unchagneColor;
            this.Canvas.stroke();
        }
    }

    //是否是一字板
    this.IsOneLimitBar=function(kItem)
    {
        if (kItem.Open==kItem.Close && kItem.High==kItem.Low && kItem.Open==kItem.High) return true;
        return false;
    }
 
    //一字板颜色 和昨收比较
    this.GetOneLimitBarColor=function(kItem)
    {
        if (!kItem || !IFrameSplitOperator.IsNumber(kItem.YClose)) return this.UnchagneColor;

        if (kItem.Close>kItem.YClose) return this.UpColor;
        else if (kItem.Close<kItem.YClose) return this.DownColor;
        else return this.UnchagneColor;
    }

    this.DrawKBar_Custom=function(data, dataWidth, barColor, drawType, option, x, y, left, right, yLow, yHigh, yOpen, yClose, border, isHScreen)
    {
        if (option.BGColor) //画背景色
        {
            this.Canvas.fillStyle=option.BGColor;
            var distanceWidth=this.ChartFrame.DistanceWidth;
            if (isHScreen)
            {
                var yLeft=left-(distanceWidth/2);
                var yRight=right+(distanceWidth/2);
                var xTop=border.RightEx;
                var xBottom=border.LeftEx;

                this.Canvas.fillRect(ToFixedRect(xBottom),ToFixedRect(yLeft),ToFixedRect(xTop-xBottom),ToFixedRect(yRight-yLeft));
            }
            else
            {
                var xLeft=left-(distanceWidth/2);
                var xRight=right+(distanceWidth/2);
                var yTop=border.TopEx;
                var yBottom=border.BottomEx;
                
                this.Canvas.fillRect(ToFixedRect(xLeft),ToFixedRect(yTop),ToFixedRect(xRight-xLeft),ToFixedRect(yBottom-yTop));
            }
        }

        if (dataWidth>=4)
        {
            this.Canvas.strokeStyle=barColor;
            if (data.High>data.Close)   //上影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(drawType==3?Math.max(yClose,yOpen):yClose),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(drawType==3?Math.min(yClose,yOpen):yClose));
                }
                this.Canvas.stroke();
                y=yClose;
            }
            else
            {
                y=yClose;
            }

            this.Canvas.fillStyle=barColor;
            if (isHScreen)
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (drawType==3) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(y),ToFixedPoint(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                    }
                }
            }
            else
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (drawType==3) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(left),ToFixedPoint(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(Math.min(y,yOpen)),ToFixedRect(dataWidth),ToFixedRect(Math.abs(yOpen-y)));
                    }
                }
            }

            if (data.Open>data.Low) //下影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(drawType==3?Math.min(yClose,yOpen):y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(drawType==3?Math.max(yClose,yOpen):y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            this.Canvas.strokeStyle=barColor;
            this.Canvas.stroke();
        }
    }

    //绘制自定义K线
    this.DrawColorKBar=function(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (Math.abs(yClose-yOpen)<1)
            this.DrawColorKBar_Line(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
        else if (colorData.Border || colorData.Type===0) 
            this.DrawColorKBar_Border(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
        else 
            this.DrawColorKBar_NoBorder(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
    }

    //带边框柱子
    this.DrawColorKBar_Border=function(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (dataWidth>=this.MinColorBarWidth)
        {
            if ((dataWidth%2)!=0) dataWidth-=1;
            var topPrice=Math.max(data.Close,data.Open);
            var bottomPrice=Math.min(data.Close,data.Open);
            if (isHScreen)
            {
                var yBarTop=Math.max(yClose,yOpen);
                var yBarBottom=Math.min(yClose,yOpen);
            }
            else
            {
                var yBarTop=Math.min(yClose,yOpen);
                var yBarBottom=Math.max(yClose,yOpen);
            }
            var yBarHeight=Math.abs(yClose-yOpen);

            //上影线
            if (data.High>topPrice && colorData.Line)   
            {
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yHigh),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yBarTop),ToFixedPoint(x));
                }
                else
                {
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(yHigh));
                    this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yBarTop));
                }
                this.Canvas.stroke();
            }

            //下影线
            if (bottomPrice>data.Low && colorData.Line) 
            {
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yBarBottom),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(yBarBottom));
                    this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }

            //中心柱子
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.rect(ToFixedPoint(yBarBottom),ToFixedPoint(left),ToFixedRect(yBarHeight),ToFixedRect(dataWidth)); 
            }
            else
            {
                this.Canvas.rect(ToFixedPoint(left),ToFixedPoint(yBarTop),ToFixedRect(dataWidth),ToFixedRect(yBarHeight));
            }
            this.Canvas.closePath();

            if (colorData.Type==0) //空心柱子
            {
                if (colorData.BarColor) //边框
                {
                    this.Canvas.strokeStyle=colorData.BarColor;
                    this.Canvas.stroke();
                }

                if (colorData.Border)
                {
                    this.Canvas.strokeStyle=colorData.Border.Color;
                    this.Canvas.stroke();
                }
            }
            else if (colorData.Type==1) //实心
            {
                if (colorData.BarColor) //内部填充
                {
                    this.Canvas.fillStyle=colorData.BarColor;
                    this.Canvas.fill();
                }

                if (colorData.Border)   //边框
                {
                    this.Canvas.strokeStyle=colorData.Border.Color;
                    this.Canvas.stroke();
                }
            }
            
        }
        else
        {
            this.DrawColorKBar_MinBar(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
        }
    }

    //不带边框柱子
    this.DrawColorKBar_NoBorder=function(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (dataWidth>=this.MinColorBarWidth)
        {
            var topPrice=Math.max(data.Close,data.Open);
            var bottomPrice=Math.min(data.Close,data.Open);
            if (isHScreen)
            {
                var yBarTop=Math.max(yClose,yOpen);
                var yBarBottom=Math.min(yClose,yOpen);
            }
            else
            {
                var yBarTop=Math.min(yClose,yOpen);
                var yBarBottom=Math.max(yClose,yOpen);
            }
            var yBarHeight=Math.abs(yClose-yOpen);

            //上影线
            if (data.High>topPrice && colorData.Line)   
            {
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yHigh),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yBarTop),ToFixedPoint(x));
                }
                else
                {
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(yHigh));
                    this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yBarTop));
                }
                this.Canvas.stroke();
            }

            //下影线
            if (bottomPrice>data.Low && colorData.Line) 
            {
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yBarBottom),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    var xFixed=left+dataWidth/2;
                    this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(yBarBottom));
                    this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }

            //中心柱子
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.rect(ToFixedPoint(yBarBottom),ToFixedPoint(left),ToFixedRect(yBarHeight),ToFixedRect(dataWidth));
            }
            else
            {
                this.Canvas.rect(ToFixedRect(left),ToFixedRect(yBarTop),ToFixedRect(dataWidth),ToFixedRect(yBarHeight));
            }
            this.Canvas.closePath();

            if (colorData.Type==1) //实心
            {
                if (colorData.BarColor) //内部填充
                {
                    this.Canvas.fillStyle=colorData.BarColor;
                    this.Canvas.fill();
                }
            }
        }
        else
        {
            this.DrawColorKBar_MinBar(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
        }
    }

    this.DrawColorKBar_MinBar=function(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (colorData.Line)
        {
            this.Canvas.strokeStyle=colorData.Line.Color;
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(ToFixedPoint(yHigh),ToFixedPoint(x));
                this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(yHigh));
                this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
            }
            this.Canvas.stroke();
        }

        /*
        var barColor;
        if (colorData.Type==0) //空心柱子
        {
            if (colorData.Border) barColor=colorData.Border.Color; 
            else if (colorData.BarColor) barColor=colorData.BarColor; 
        }
        else if (colorData.Type==1) //实心
        {
            if (colorData.Border) barColor=colorData.Border.Color; 
            else if (colorData.BarColor) barColor=colorData.BarColor; 
        }

        if (barColor)
        {
            this.Canvas.strokeStyle=barColor;
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(ToFixedPoint(yOpen),ToFixedPoint(x));
                this.Canvas.lineTo(ToFixedPoint(yClose),ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
            }
            this.Canvas.stroke();
        }
        */
    }

    //十字线
    this.DrawColorKBar_Line=function(data, colorData, dataWidth, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (dataWidth>=this.MinColorBarWidth)
        {
            
            if (colorData.Line)
            {
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yHigh),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(yHigh));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
                
                this.Canvas.stroke();
            }

            var barColor;
            if (colorData.Type==0) //空心柱子
            {
                if (colorData.Border) barColor=colorData.Border.Color; 
                else if (colorData.BarColor) barColor=colorData.BarColor; 
            }
            else if (colorData.Type==1) //实心
            {
                if (colorData.Border) barColor=colorData.Border.Color; 
                else if (colorData.BarColor) barColor=colorData.BarColor; 
            }

            if (barColor)
            {
                this.Canvas.strokeStyle=barColor;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yOpen),ToFixedPoint(left));
                    this.Canvas.lineTo(ToFixedPoint(yOpen),ToFixedPoint(right));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(yOpen));
                    this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(yOpen));
                }
                this.Canvas.stroke();
            }
        }
        else
        {
            if (colorData.Line)
            {
                var xFixed=left+dataWidth/2;
                this.Canvas.strokeStyle=colorData.Line.Color;
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(yHigh),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(yHigh));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }
        }
    }

    this.ClearCustomKLine=function()
    {
        this.CustomKLine=null;
    }

    this.GetCustomKLine=function(kItem)
    {
        if (!this.CustomKLine) return null;
        if (!kItem) return null;

        var key=kItem.Date*1000000;
        if (IFrameSplitOperator.IsNumber(kItem.Time)) key+=kItem.Time;
        if (!this.CustomKLine.has(key)) return null;

        var value=this.CustomKLine.get(key);
        return value;
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

    this.Draw = function () 
    {
        this.PtMax = { X: null, Y: null, Value: null, Align: 'left' }; //清空最大
        this.PtMin = { X: null, Y: null, Value: null, Align: 'left' }; //清空最小
        this.ChartFrame.ChartKLine = { Max: null, Min: null };   //保存K线上 显示最大最小值坐标
        this.DrawKRange={ Start:null, End:null }; 
        this.AryPriceGapCache=[];

        if (this.IsShow == false) return;

        if (this.DrawType == 1) 
        {
            this.DrawCloseLine();
            if (this.PriceGap.Enable) this.DrawPriceGap();
            return;
        }
        else if (this.DrawType == 2) 
        {
            this.DrawAKLine();
        }
        else if (this.DrawType == 4) 
        {
            this.DrawCloseArea();
        }
        else if (this.DrawType==9)
        {
            this.DrawKBar();
        }
        else 
        {
            this.DrawKBar();
        }

        this.DrawTrade();

        if (this.PriceGap.Enable) this.DrawPriceGap();

        if (this.IsShowMaxMinPrice)     //标注最大值最小值
        {
            if (this.ChartFrame.IsHScreen === true) this.HScreenDrawMaxMinPrice(this.PtMax, this.PtMin);
            else this.DrawMaxMinPrice(this.PtMax, this.PtMin);
        }
    }

    this.OnFormatHighLowTitle=function(ptMax, ptMin)
    {
        if (!ptMax || !ptMin) return null;
        if (!IFrameSplitOperator.IsNumber(ptMax.Value) || !IFrameSplitOperator.IsNumber(ptMin.Value)) return null;

        var defaultfloatPrecision=JSCommonCoordinateData.GetfloatPrecision(this.Symbol);   //小数位数
        var title=
        { 
            High:ptMax.Value.toFixed(defaultfloatPrecision), 
            Low:ptMin.Value.toFixed(defaultfloatPrecision) 
        };
       
        if (!this.GetEventCallback) return title;
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_KLINE_HIGH_LOW_TITLE);
        if (!event || !event.Callback) return title;

        var data={ Max:ptMax, Min:ptMin, Symbol:this.Symbol, Title:{ High:title.High, Low:title.Low }, Decimal:defaultfloatPrecision, PreventDefault:false };
        event.Callback(event, data, this);
        if (data.PreventDefault) return data.Title;    //使用外部回调的数值

        return title;
    }

    this.DrawMaxMinPrice = function (ptMax, ptMin) 
    {
        if (ptMax.X == null || ptMax.Y == null || ptMax.Value == null) return;
        if (ptMin.X == null || ptMin.Y == null || ptMin.Value == null) return;
        var title=this.OnFormatHighLowTitle(ptMax,ptMin);
        if (!title) return;

        var leftArrow=g_JSChartResource.KLine.MaxMin.LeftArrow;
        var rightArrow=g_JSChartResource.KLine.MaxMin.RightArrow;
        var highYOffset=g_JSChartResource.KLine.MaxMin.HighYOffset;
        var lowYOffset=g_JSChartResource.KLine.MaxMin.LowYOffset;

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        this.Canvas.font = this.TextFont;
       
        this.Canvas.textAlign = ptMax.Align;
        this.Canvas.textBaseline = 'bottom';
        var left = ptMax.X;
        if (IFrameSplitOperator.IsNumber(highYOffset)) ptMax.Y+=highYOffset;
        //var text = ptMax.Value.toFixed(defaultfloatPrecision);
        var text=title.High;
        var textColor=this.TextColor;
        if (title.HighColor) textColor=title.HighColor;
        this.Canvas.fillStyle = textColor;
        if (ptMax.Align == 'left') text = leftArrow + text;
        else text = text + rightArrow;
        this.Canvas.fillText(text, left, ptMax.Y);
        this.ChartFrame.ChartKLine.Max = { X: left, Y: ptMax.Y, Text: { BaseLine: 'bottom' } };

        this.Canvas.textAlign = ptMin.Align;
        this.Canvas.textBaseline = 'top';
        var left = ptMin.X;
        if (IFrameSplitOperator.IsNumber(lowYOffset)) ptMin.Y+=lowYOffset;
        //text = ptMin.Value.toFixed(defaultfloatPrecision);
        var text=title.Low;
        var textColor=this.TextColor;
        if (title.LowColor) textColor=title.LowColor;
        this.Canvas.fillStyle = textColor;
        if (ptMin.Align == 'left') text = leftArrow + text;
        else text = text + rightArrow;
        this.Canvas.fillText(text, left, ptMin.Y);
        this.ChartFrame.ChartKLine.Min = { X: left, Y: ptMin.Y, Text: { BaseLine: 'top' } };
    }

    this.HScreenDrawMaxMinPrice = function (ptMax, ptMin)   //横屏模式下显示最大最小值
    {
        if (ptMax.X == null || ptMax.Y == null || ptMax.Value == null) return;
        if (ptMin.X == null || ptMin.Y == null || ptMin.Value == null) return;
        var title=this.OnFormatHighLowTitle(ptMax,ptMin);
        if (!title) return;

        var leftArrow=g_JSChartResource.KLine.MaxMin.LeftArrow;
        var rightArrow=g_JSChartResource.KLine.MaxMin.RightArrow;
        var highYOffset=g_JSChartResource.KLine.MaxMin.HighYOffset;
        var lowYOffset=g_JSChartResource.KLine.MaxMin.LowYOffset;

        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
        var xText = ptMax.Y;
        var yText = ptMax.X;
        if (IFrameSplitOperator.IsNumber(highYOffset)) xText+=highYOffset;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
         if (title.HighColor) this.Canvas.fillStyle=title.HighColor;
        else this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign = ptMax.Align;
        this.Canvas.textBaseline = 'bottom';
        var text=title.High;
        //var text = ptMax.Value.toFixed(defaultfloatPrecision);
        if (ptMax.Align == 'left') text = leftArrow + text;
        else text = text + rightArrow;
        this.Canvas.fillText(text, 0, 0);
        this.Canvas.restore();


        var xText = ptMin.Y;
        var yText = ptMin.X;
        if (IFrameSplitOperator.IsNumber(lowYOffset)) xText+=lowYOffset;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
        if (title.LowColor) this.Canvas.fillStyle=title.LowColor;
        else this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign = ptMin.Align;
        this.Canvas.textBaseline = 'top';
        var text=title.Low;
        //var text = ptMin.Value.toFixed(defaultfloatPrecision);
        if (ptMin.Align == 'left') text = leftArrow + text;
        else text = text + rightArrow;
        this.Canvas.fillText(text, 0, 0);
        this.Canvas.restore();
    }

    //画某一天的信息地雷 画在底部
    this.DrawInfoDiv = function (item) {
        if (!this.InfoData || this.InfoData.size <= 0) return;

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

        if (this.DrawType==1 || this.DrawType==4 )    // 1=收盘价线 4=收盘价面积图
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
            {
                var data=this.Data.Data[i];
                if (!IFrameSplitOperator.IsNumber(data.Close)) continue;

                if (range.Max==null) range.Max=data.Close;
                if (range.Min==null) range.Min=data.Close;

                if (range.Max<data.Close) range.Max=data.Close;
                if (range.Min>data.Close) range.Min=data.Close;
            }
        }
        else
        {
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
            {
                var data = this.Data.Data[i];
                if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;
    
                if (range.Max == null) range.Max = data.High;
                if (range.Min == null) range.Min = data.Low;
    
                if (range.Max < data.High) range.Max = data.High;
                if (range.Min > data.Low) range.Min = data.Low;
            }
    
        }
        
        return range;
    }

    this.DrawLastPointEvent=function(ptLast)
    {
        if (!this.GetEventCallback)  return;
        
        //通知外部绘制最后一个点
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_KLINE_LAST_POINT);
        if (event)
        {
            var kWidth={ Data: this.ChartFrame.DataWidth, Distance:this.ChartFrame.DistanceWidth };
            if (ptLast) var data={ LastPoint:{ X:ptLast.X, Y:ptLast.Y, XLeft:ptLast.XLeft, XRight:ptLast.XRight }, KItem:ptLast.KItem, DrawType:this.DrawType, KWidth:kWidth, ChartRight:ptLast.ChartRight };
            else var data={ LastPoint:null, KItem:null, KWidth:kWidth };
            event.Callback(event,data,this);
        }
    }

    //////////////////////////////////////////////////////////////
    // 标识缺口
    /////////////////////////////////////////////////////////////
    this.DrawPriceGap=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryPriceGapCache)) return;
        if (this.PriceGap.Count<=0) return;

        var index=this.AryPriceGapCache.length-this.PriceGap.Count;
        if (index<0) index=0;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var border=null;
        
        if (isHScreen) border=this.ChartBorder.GetHScreenBorder();
        else border=this.ChartBorder.GetBorder();

        this.Canvas.font=this.PriceGapStyple.Text.Font;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        var textHeight=this.Canvas.measureText("擎").width;
        var decNum=JSCommonCoordinateData.GetfloatPrecision(this.Symbol);

        for(var i=index;i<this.AryPriceGapCache.length;++i)
        {
            var item=this.AryPriceGapCache[i];
            var start=item.Data[0];
            var end=item.Data[1];
            var rect=null, rtText=null, text=null;
            if (item.Type==1)   //上缺口
            {
                if (isHScreen)
                {
                    rect={ Left:start.Coordinate.High, Right:end.Coordinate.Low, Top:start.Coordinate.X, Bottom: border.Bottom };
                    rect.Width=rect.Right-rect.Left;
                    rect.Height=rect.Bottom-rect.Top;

                    rtText={ Left:start.Coordinate.High-textHeight-2, Top:start.Coordinate.Right+2, Height:textHeight };
                    rtText.Bottom=rtText.Top+rtText.Height;
                }
                else
                {
                    rect={ Left:start.Coordinate.X, Right:border.Right, Top:end.Coordinate.Low, Bottom:start.Coordinate.High };
                    rect.Width=rect.Right-rect.Left;
                    rect.Height=rect.Bottom-rect.Top;
    
                    rtText={ Left:start.Coordinate.Right+2, Top:rect.Bottom+2, Right:rect.Right, Height:textHeight };
                    rtText.Bottom=rtText.Top+rtText.Height;
                }

                text=`${start.Data.High.toFixed(decNum)}-${end.Data.Low.toFixed(decNum)}`;
                
            }
            else if (item.Type==2)  //下缺口 
            {
                if (isHScreen)
                {
                    rect={ Left:start.Coordinate.Low, Right:end.Coordinate.High, Top:start.Coordinate.X, Bottom: border.Bottom };
                    rect.Width=rect.Right-rect.Left;
                    rect.Height=rect.Bottom-rect.Top;

                    rtText={ Left:start.Coordinate.Low+2, Top:start.Coordinate.Right+2, Height:textHeight };
                    rtText.Bottom=rtText.Top+rtText.Height;
                }
                else
                {
                    rect={ Left:start.Coordinate.X, Right:border.Right, Top:start.Coordinate.Low, Bottom:end.Coordinate.High };
                    rect.Width=rect.Right-rect.Left;
                    rect.Height=rect.Bottom-rect.Top;
    
                    rtText={ Left:start.Coordinate.Right+2, Bottom:rect.Top, Right:rect.Right, Height:textHeight };
                    rtText.Top=rtText.Bottom-rtText.Height;
                }

                text=`${start.Data.Low.toFixed(decNum)}-${end.Data.High.toFixed(decNum)}`;
            }
            else
            {
                continue;
            }

            if (!rect) return;

            this.Canvas.fillStyle=this.PriceGapStyple.Line.Color;
            this.Canvas.fillRect(rect.Left, rect.Top,rect.Width, rect.Height);
           
            if (rtText)
            {
                var textWidth=this.Canvas.measureText(text).width;
                rtText.Width=textWidth;
                rtText.Right=rtText.Left+rtText.Width;

                this.Canvas.fillStyle=this.PriceGapStyple.Text.Color;

                if (isHScreen)
                {
                    this.Canvas.save(); 
                    this.Canvas.translate(rtText.Left, rtText.Top);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(text,0,0);
                    this.Canvas.restore();
                }
                else
                {
                    if (rtText.Right>rect.Right)
                    {
                        rtText.Right=rect.Right;
                        rtText.Left=rtText.Right-rtText.Width;
                    }

                    this.Canvas.fillStyle=this.PriceGapStyple.Text.Color;
                    this.Canvas.fillText(text,rtText.Left,rtText.Bottom);
                }
    
                //this.Canvas.fillStyle="rgb(250,250,250)"
                //this.Canvas.fillRect(rtText.Left, rtText.Top, rtText.Width, rtText.Height);
    
                
            }
        }
        
    }

    //是否有缺口
    this.IsPriceGap=function(item, preItem)
    {
        if (!preItem || !item) return 0;

        if (preItem.Data.Low>item.Data.High) return 2;    //下缺口 

        if (preItem.Data.High<item.Data.Low) return 1;  //上缺口

        return -1;
    }

    //检测缺口是不回补了
    this.CheckPriceGap=function(kItemInfo)
    {
        var kItem=kItemInfo.Data;
        for(var i=0;i<this.AryPriceGapCache.length;++i)
        {
            var item=this.AryPriceGapCache[i];
            var start=item.Data[0];
            var end=item.Data[1];
            if (item.Type==1) //上缺口
            {
                if (kItem.Low<=start.Data.High)
                {
                    this.AryPriceGapCache.splice(i,1);
                    --i;
                    continue;
                }

                if (kItem.Low<end.Data.Low) item.Data[1]=kItemInfo;
            }
            else if (item.Type==2)  //下缺口 
            {
                if (kItem.High>=start.Data.Low)
                {
                    this.AryPriceGapCache.splice(i,1);
                    --i;
                    continue;
                }

                if (kItem.High>end.Data.High) item.Data[1]=kItemInfo;
            }
        }
    }
}

function ChartColorKline()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartColorKline';    //类名
    this.Symbol;        //股票代码
    this.Color='rgb(0,255,44)';
    this.IsEmptyBar=false;
    this.DrawType=0;    //0=实心K线柱子  3=空心K线柱子 
    this.KLineColor;    //Map key=K线索引 value=设置
    this.DrawName;

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.DrawName=="DRAWCOLORKLINE")
        {
            this.DrawColorBar();
        }
        else
        {
            if (!this.KLineColor) return;
            this.DrawBar();
        }
    }

    this.DrawUpBarItem=function(data, xOffset, dataWidth, option)
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var left=xOffset;
        var right=xOffset+dataWidth;
        var x=left+(right-left)/2;

        var yLow=this.ChartFrame.GetYFromData(data.Low);
        var yHigh=this.ChartFrame.GetYFromData(data.High);
        var yOpen=this.ChartFrame.GetYFromData(data.Open);
        var yClose=this.ChartFrame.GetYFromData(data.Close);
        var y=yHigh;

        if (dataWidth>=4)
        {
            if (data.High>data.Close)   //上影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(this.DrawType==3?Math.max(yClose,yOpen):yClose),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(this.DrawType==3?Math.min(yClose,yOpen):yClose));
                }
                this.Canvas.stroke();
                y=yClose;
            }
            else
            {
                y=yClose;
            }

            if (isHScreen)
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (this.DrawType==3) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(y),ToFixedPoint(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                    }
                }
            }
            else
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (this.DrawType==3) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(left),ToFixedPoint(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(Math.min(y,yOpen)),ToFixedRect(dataWidth),ToFixedRect(Math.abs(yOpen-y)));
                    }
                }
            }

            if (data.Open>data.Low) //下影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(this.DrawType==3?Math.min(yClose,yOpen):y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(this.DrawType==3?Math.max(yClose,yOpen):y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            this.Canvas.stroke();
        }
    }

    this.DrawDownBarItem=function(data, xOffset, dataWidth, option)
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var left=xOffset;
        var right=xOffset+dataWidth;
        var x=left+(right-left)/2;

        var yLow=this.ChartFrame.GetYFromData(data.Low);
        var yHigh=this.ChartFrame.GetYFromData(data.High);
        var yOpen=this.ChartFrame.GetYFromData(data.Open);
        var yClose=this.ChartFrame.GetYFromData(data.Close);
        var y=yHigh;

        if (dataWidth>=4)
        {
            if (data.High>data.Close)   //上影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yOpen),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                }
                this.Canvas.stroke();
                y=yOpen;
            }
            else
            {
                y=yOpen
            }

            if (isHScreen)
            {
                if (Math.abs(yClose-y)<1) this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                else this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yClose-y),ToFixedRect(dataWidth));
            }
            else
            {
                if (Math.abs(yClose-y)<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(Math.min(y,yClose)),ToFixedRect(dataWidth),ToFixedRect(Math.abs(yClose-y)));
            }

            if (data.Open>data.Low) //下影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
                this.Canvas.stroke();
            }
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            this.Canvas.stroke();
        }
    }

    this.DrawUnChangeBarItem=function(data, xOffset, dataWidth, option)
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var left=xOffset;
        var right=xOffset+dataWidth;
        var x=left+(right-left)/2;

        var yLow=this.ChartFrame.GetYFromData(data.Low);
        var yHigh=this.ChartFrame.GetYFromData(data.High);
        var yOpen=this.ChartFrame.GetYFromData(data.Open);
        var yClose=this.ChartFrame.GetYFromData(data.Close);
        var y=yHigh;

        if (dataWidth>=4)
        {
            this.Canvas.beginPath();
            if (data.High>data.Close)   //上影线
            {
                if (isHScreen)
                {
                    this.Canvas.moveTo(y,ToFixedPoint(x));
                    this.Canvas.lineTo(yOpen,ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),y);
                    this.Canvas.lineTo(ToFixedPoint(x),yOpen);
                }
                y=yOpen;
            }
            else
            {
                y=yOpen;
            }

            if (isHScreen)
            {
                this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(left));
                this.Canvas.lineTo(ToFixedPoint(y),ToFixedPoint(right));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(y));
            }

            if (data.Open>data.Low) //下影线
            {
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
            }

            this.Canvas.stroke();
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            this.Canvas.stroke();
        }
    }

    this.DrawBar=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        if (this.IsHScreen) 
        {
            xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+2.0;
            chartright=this.ChartBorder.GetBottom();
        }

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            if (!this.KLineColor.has(i)) continue;
            var itemOption=this.KLineColor.get(i);

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;

            if (itemOption.Color)
            {
                this.Canvas.strokeStyle=itemOption.Color;
                this.Canvas.fillStyle=itemOption.Color;
            }
            else
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.fillStyle=this.Color;
            }

            if (data.Open<data.Close)   //阳线
            {
                this.DrawUpBarItem(data,xOffset,dataWidth,itemOption);
            }
            else if (data.Open>data.Close)  //阴线
            {
                this.DrawDownBarItem(data,xOffset,dataWidth,itemOption);
            }
            else    //平线
            {
                this.DrawUnChangeBarItem(data,xOffset,dataWidth,itemOption);
            }
        }
    }

    this.DrawColorBar=function()
    {
        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var border=this.ChartBorder.GetBorder();
        var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var chartright=border.RightEx;
        var xPointCount=this.ChartFrame.XPointCount;

        if (isHScreen) 
        {
            var border=this.ChartBorder.GetHScreenBorder();
            xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            chartright=border.BottomEx;
        }

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (!data) continue;
            if (!IFrameSplitOperator.IsNumber(data.Open) || !IFrameSplitOperator.IsNumber(data.High) || 
                !IFrameSplitOperator.IsNumber(data.Low) || !IFrameSplitOperator.IsNumber(data.Close)) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.GetYFromData(data.Low, false);
            var yHigh=this.GetYFromData(data.High, false);
            var yOpen=this.GetYFromData(data.Open, false);
            var yClose=this.GetYFromData(data.Close, false);
            var y=yHigh;

            if (data.Open==data.Close) 
                this.DrawKBar_Unchagne(data, dataWidth, this.Color, this.IsEmptyBar, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
            else 
                this.DrawKBar_Custom(data, dataWidth, this.Color, this.IsEmptyBar, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen);
        }
    }

    this.DrawKBar_Unchagne=function(data, dataWidth, unchagneColor, drawType, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (dataWidth>=4)
        {
            if ((dataWidth%2)!=0) dataWidth-=1;
            this.Canvas.strokeStyle=unchagneColor;
            this.Canvas.beginPath();
            if (data.High>data.Close)   //上影线
            {
                if (isHScreen)
                {
                    this.Canvas.moveTo(y,ToFixedPoint(x));
                    this.Canvas.lineTo(yOpen,ToFixedPoint(x));
                }
                else
                {
                    var xFixed=ToFixedPoint(left+dataWidth/2);
                    this.Canvas.moveTo(xFixed,y);
                    this.Canvas.lineTo(xFixed,yOpen);
                }
                y=yOpen;
            }
            else
            {
                y=yOpen;
            }

            if (isHScreen)
            {
                this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(left));
                this.Canvas.lineTo(ToFixedPoint(y),ToFixedPoint(right));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                this.Canvas.lineTo(ToFixedPoint(left+dataWidth),ToFixedPoint(y));
            }

            if (data.Open>data.Low) //下影线
            {
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    var xFixed=ToFixedPoint(left+dataWidth/2);
                    this.Canvas.moveTo(xFixed,ToFixedPoint(y));
                    this.Canvas.lineTo(xFixed,ToFixedPoint(yLow));
                }
            }

            this.Canvas.stroke();
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                if (data.High==data.Low)
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow+1);
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                }
                
            }
            this.Canvas.strokeStyle=unchagneColor;
            this.Canvas.stroke();
        }
    }

    this.DrawKBar_Custom=function(data, dataWidth, barColor, isEmptyBar, x, y, left, right, yLow, yHigh, yOpen, yClose, isHScreen)
    {
        if (isEmptyBar)
        {
            if ((dataWidth%2)!=0) dataWidth-=1;
        }

        if (dataWidth>=4)
        {
            this.Canvas.strokeStyle=barColor;
            if (data.High>data.Close)   //上影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(isEmptyBar?Math.max(yClose,yOpen):yClose),ToFixedPoint(x));
                }
                else
                {
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(Math.min(yClose,yOpen)));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
                    }
                    
                }
                this.Canvas.stroke();
                y=yClose;
            }
            else
            {
                y=yClose;
            }

            
            this.Canvas.fillStyle=barColor;
            if (isHScreen)
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),1,ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (isEmptyBar) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(y),ToFixedPoint(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(y),ToFixedRect(left),ToFixedRect(yOpen-y),ToFixedRect(dataWidth));
                    }
                }
            }
            else
            {
                if (Math.abs(yOpen-y)<1)  
                {
                    this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                }
                else 
                {
                    if (isEmptyBar) //空心柱
                    {
                        this.Canvas.beginPath();
                        this.Canvas.rect(ToFixedPoint(left),ToFixedPoint(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));
                        this.Canvas.stroke();
                    }
                    else
                    {
                        this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(Math.min(y,yOpen)),ToFixedRect(dataWidth),ToFixedRect(Math.abs(yOpen-y)));
                    }
                }
            }
            
            if (data.Open>data.Low) //下影线
            {
                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(ToFixedPoint(isEmptyBar?Math.min(yClose,yOpen):y),ToFixedPoint(x));
                    this.Canvas.lineTo(ToFixedPoint(yLow),ToFixedPoint(x));
                }
                else
                {
                    if (isEmptyBar)
                    {
                        var xFixed=left+dataWidth/2;
                        this.Canvas.moveTo(ToFixedPoint(xFixed),ToFixedPoint(Math.max(yClose,yOpen)));
                        this.Canvas.lineTo(ToFixedPoint(xFixed),ToFixedPoint(yLow));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                    }
                    
                }
                this.Canvas.stroke();
            }
        }
        else
        {
            this.Canvas.beginPath();
            if (isHScreen)
            {
                this.Canvas.moveTo(yHigh,ToFixedPoint(x));
                this.Canvas.lineTo(yLow,ToFixedPoint(x));
            }
            else
            {
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);
            }
            this.Canvas.strokeStyle=barColor;
            this.Canvas.stroke();
        }
    }

    this.GetMaxMin=function()
    {
        var range={Max:null,Min:null };

        if (this.DrawName=="DRAWCOLORKLINE")
        {
            var xPointCount=this.ChartFrame.XPointCount;
        
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
            {
                var data=this.Data.Data[i];
                if (!data) continue;
                if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
               
                if (range.Max==null) range.Max=data.High;
                if (range.Min==null) range.Min=data.Low;

                if (range.Max<data.High) range.Max=data.High;
                if (range.Min>data.Low) range.Min=data.Low;
            }
        }

        return range;
    }
}

function ChartDrawIcon()
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartDrawIcon";
    this.IsHScreen=false;   //是否横屏
    this.DrawCallback;      //function(op, obj)  op:1=开始 2=绘制 4=销毁
    this.IsDestroy=false;   //是否已销毁
    this.TextAlign = 'left';
    this.TextBaseline="middle";
    this.IconID;
    this.Color;
    this.FixedIconSize;
    this.DrawItem=[];
    this.Identify;

    this.Draw=function()
    {
        this.DrawItem=[];
        if (this.DrawCallback) this.DrawCallback(1, {Self:this} );

        this.DrawAllText();
        
        if (this.DrawCallback) this.DrawCallback(2, { Self:this, Draw:this.DrawItem } );
    }

    this.DrawAllText=function()
    {
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

        
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);
            if (x > chartright) break;

            var drawTextInfo=
            { 
                Text:
                { 
                    Color:this.Color,
                    Align:this.TextAlign,
                    Baseline:this.TextBaseline,
                },
                X:x, Y:y,
                IconID:this.IconID
            };

            this.DrawItem.push(drawTextInfo);
        }
    }

    this.OnDestroy=function()
    {
        this.IsDestroy=true;
        if (this.DrawCallback) this.DrawCallback(4, { Self:this } );
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
    this.Direction = 0;         //0=middle 1=bottom 2=top
    this.FixedFontSize=-1;      //固定字体大小
    this.YOffset = 0;
    this.Position;          //指定输出位置
    this.TextBG;            //{ Color:"rgb(0,0,92)", Border:"rgb(205,0,92)", Margin:[0,1,1,1],  }   // { Color:背景色, Border:边框颜色, Margin=[上,下,左, 右] }
    this.ShowOffset={ X:0, Y:0 };   //显示偏移
    this.TextSize=
    {
        Max: g_JSChartResource.DRAWICON.Text.MaxSize, Min:g_JSChartResource.DRAWICON.Text.MinSize, //字体的最大最小值
        Zoom:{ Type:g_JSChartResource.DRAWICON.Text.Zoom.Type , Value:g_JSChartResource.DRAWICON.Text.Zoom.Value }, //放大倍数
        FontName:g_JSChartResource.DRAWICON.Text.FontName
    }

    this.ReloadResource=function(resource)
    {
        if (this.Name=="DRAWTEXT")
        {
            this.TextSize=
            {
                Max: g_JSChartResource.DRAWTEXT.MaxSize, Min:g_JSChartResource.DRAWTEXT.MinSize, //字体的最大最小值
                Zoom:{ Type:g_JSChartResource.DRAWTEXT.Zoom.Type , Value:g_JSChartResource.DRAWTEXT.Zoom.Value }, //放大倍数
                FontName:g_JSChartResource.DRAWTEXT.FontName
            }
        }
        else if (this.Name=="DRAWNUMBER")
        {
            this.TextSize=
            {
                Max: g_JSChartResource.DRAWNUMBER.MaxSize, Min:g_JSChartResource.DRAWNUMBER.MinSize, //字体的最大最小值
                Zoom:{ Type:g_JSChartResource.DRAWNUMBER.Zoom.Type , Value:g_JSChartResource.DRAWNUMBER.Zoom.Value }, //放大倍数
                FontName:g_JSChartResource.DRAWNUMBER.FontName
            }
        }
    }

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.Name=="DRAWTEXTREL" || this.Name=="DRAWTEXTABS")
        {
            this.DrawRectText();
            return;
        }

        if (this.Position) 
        {
            this.DrawPosition();
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
        var drawTextInfo={ Text:{ }, Font:{ } };

        //上下位置
        if (this.Direction == 1) 
        {
            this.Canvas.textBaseline = 'bottom';
            drawTextInfo.Text={ Baseline: 'bottom'};
        }
        else if (this.Direction == 2) 
        {
            this.Canvas.textBaseline = 'top';
            drawTextInfo.Text={ Baseline: 'top'};
        }
        else 
        {
            this.Canvas.textBaseline = 'middle';
            drawTextInfo.Text={ Baseline: 'middle'};
        }

        //字体大小
        if (this.FixedFontSize>0) 
            this.TextFont=`${this.FixedFontSize}px ${this.TextSize.FontName}`;
        else
            this.TextFont = this.GetDynamicFontEx(dataWidth,distanceWidth,this.TextSize.Max,this.TextSize.Min,this.TextSize.Zoom,this.TextSize.FontName);

        drawTextInfo.Font={ Height:this.GetFontHeight(this.TextFont) };
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            y+=this.ShowOffset.Y;
            x+=this.ShowOffset.X;

            this.Canvas.textAlign = this.TextAlign;
            this.Canvas.fillStyle = this.Color;
            this.Canvas.font = this.TextFont;

            drawTextInfo.Text.Color=this.Color;
            drawTextInfo.Text.Align=this.TextAlign;
            drawTextInfo.X=x;
            drawTextInfo.Y=y;

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
                if (isHScreen)
                {
                    if (this.Name=='DRAWNUMBER')
                    {
                        if (this.Direction==1) y+=g_JSChartResource.DRAWABOVE.YOffset;
                        else if (this.Direction==2) y-=4;
                    }
                }
                else
                {
                    if (this.Name=='DRAWNUMBER')
                    {
                        if (this.Direction==1) y-=g_JSChartResource.DRAWABOVE.YOffset;
                        else if (this.Direction==2) y+=4;
                    }
                }

                if (this.Name=="DRAWTEXT") 
                    this.DrawTextV2(text,drawTextInfo,isHScreen);
                else
                    this.DrawText(text, x, y, isHScreen);
            }
            else 
            {
                if (this.Name=="DRAWTEXT")
                {
                    this.DrawTextV2(this.Text,drawTextInfo,isHScreen);
                }
                else
                {
                    this.DrawText(this.Text, x, y, isHScreen);
                }
            }
        }
    }

    this.DrawPosition=function()    //绘制在指定位置上
    {
        if (!this.Text) return;
        var isHScreen=(this.ChartFrame.IsHScreen===true)
        if (isHScreen)
        {
            var y=this.ChartBorder.GetRightEx()-this.ChartBorder.GetWidthEx()*this.Position.Y;
            var x=this.ChartBorder.GetTop()+this.ChartBorder.GetHeight()*this.Position.X;
        }
        else
        {
            var x=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*this.Position.X;
            var y=this.ChartBorder.GetTopEx()+this.ChartBorder.GetHeight()*this.Position.Y;
        }

        this.Canvas.fillStyle=this.Color;

        //TYPE:0为左对齐,1为右对齐.
        if (this.Position.Type==0) this.Canvas.textAlign='left';
        else if (this.Position.Type==1) this.Canvas.textAlign='right';
        else this.Canvas.textAlign='center';

        if (this.Direction==1) this.Canvas.textBaseline='bottom';
        else if (this.Direction==2) this.Canvas.textBaseline='top';
        else this.Canvas.textBaseline='middle';

        this.DrawText(this.Text,x,y,isHScreen);
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

    this.DrawTextV2=function(text, drawInfo, isHScreen)
    {
        var textWidth=this.Canvas.measureText(text).width;

        if (isHScreen)
        {
            var x=drawInfo.Y;
            var y=drawInfo.X;

            if (drawInfo.Text.Align=="right") y=y-textWidth;
            else if (drawInfo.Text.Align=="center") y=y-textWidth/2;

            if (drawInfo.Text.Baseline=="top") x-=drawInfo.Font.Height;
            else if (drawInfo.Text.Baseline=="middle") x-=drawInfo.Font.Height/2;

            if (this.TextBG && (this.TextBG.Color || this.TextBG.Border))
            {
                var margin=this.TextBG.Margin;  //0=上 1=下 2=左 3=右
                var xRect=x-margin[0];
                var yRect=y-margin[2];
                var bgWidth=textWidth+margin[2]+margin[3];
                var bgHeight=drawInfo.Font.Height+margin[0]+margin[1];
                if (this.TextBG.Color)
                {
                    this.Canvas.fillStyle=this.TextBG.Color;
                    this.Canvas.fillRect(xRect,yRect,bgHeight,bgWidth);
                }

                if (this.TextBG.Border)
                {
                    this.Canvas.strokeStyle=this.TextBG.Border;
                    this.Canvas.strokeRect(ToFixedPoint(xRect),ToFixedPoint(yRect),ToFixedRect(bgHeight),ToFixedRect(bgWidth));
                }
            }

            this.Canvas.textBaseline="bottom";
            this.Canvas.textAlign="left";
            this.Canvas.fillStyle=drawInfo.Text.Color;

            this.Canvas.save(); 
            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();
        }
        else
        {
            var x=drawInfo.X;
            var y=drawInfo.Y;
            if (drawInfo.Text.Align=="right") x=x-textWidth;
            else if (drawInfo.Text.Align=="center") x=x-textWidth/2;

            if (drawInfo.Text.Baseline=="top") y+=drawInfo.Font.Height;
            else if (drawInfo.Text.Baseline=="middle") y+=drawInfo.Font.Height/2;

            if (this.TextBG && (this.TextBG.Color || this.TextBG.Border))
            {
                var margin=this.TextBG.Margin;  //0=上 1=下 2=左 3=右
                var xRect=x-margin[2];
                var yRect=y-drawInfo.Font.Height-margin[1];
                var bgWidth=textWidth+margin[2]+margin[3];
                var bgHeight=drawInfo.Font.Height+margin[0]+margin[1];
                if (this.TextBG.Color)
                {
                    this.Canvas.fillStyle=this.TextBG.Color;
                    this.Canvas.fillRect(xRect,yRect,bgWidth,bgHeight);
                }

                if (this.TextBG.Border)
                {
                    this.Canvas.strokeStyle=this.TextBG.Border;
                    this.Canvas.strokeRect(ToFixedPoint(xRect),ToFixedPoint(yRect),ToFixedRect(bgWidth),ToFixedRect(bgHeight));
                }
            }

            this.Canvas.textBaseline="bottom";
            this.Canvas.textAlign="left";
            this.Canvas.fillStyle=drawInfo.Text.Color;
            this.Canvas.fillText(text,x,y);
        }
    }

    this.DrawRectText=function()
    {
        if (!this.DrawData) return;
        var isHScreen=(this.ChartFrame.IsHScreen===true)
        var border=this.ChartFrame.GetBorder();

        if (this.Name=="DRAWTEXTREL")
        {
            if (isHScreen)
            {
                var height=border.RightTitle-border.LeftEx;
                var width=border.BottomEx-border.TopEx;
                var x=this.DrawData.Point.X/1000*width+border.TopEx;
                var y=border.RightTitle-this.DrawData.Point.Y/1000*width;
            }
            else
            {
                var width=border.RightEx-border.LeftEx;
                var height=border.BottomEx-border.TopTitle;
                var x=this.DrawData.Point.X/1000*width+border.LeftEx;
                var y=this.DrawData.Point.Y/1000*height+border.TopTitle;
            }
            
        }
        else if (this.Name=="DRAWTEXTABS")
        {
            if (isHScreen)
            {
                var x=this.DrawData.Point.X+border.TopEx;
                var y=border.RightTitle-this.DrawData.Point.Y;
            }
            else
            {
                var x=this.DrawData.Point.X+border.LeftEx;
                var y=this.DrawData.Point.Y+border.TopTitle;
            }
        }
        else
        {
            return;
        }

        if (this.Direction==1) this.Canvas.textBaseline='bottom';
        else if (this.Direction==2) this.Canvas.textBaseline='top';
        else this.Canvas.textBaseline='middle';
        this.Canvas.textAlign=this.TextAlign;
        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.Color;
        this.DrawText(this.DrawData.Text,x,y,isHScreen);
    }


    this.SuperGetMaxMin=this.GetMaxMin;
    this.GetMaxMin=function()
    {
        if (this.Name=="DRAWTEXTREL" || this.Name=="DRAWTEXTABS")
        {
            return { Min:null,Max:null };
        }
        else
        {
            return this.SuperGetMaxMin();
        }
    }
}

function ChartDrawText()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawText';         //类名
    this.Color = "rgb(255,193,37)";           //线段颜色
    this.TextFont = "14px 微软雅黑";           //字体
    this.Text;
    this.TextAlign = 'left';
    this.TextBaseline="middle";
    this.FixedFontSize=-1;      //固定字体大小
    this.YOffset = 0;
    this.FixedPosition=-1;  //固定位置输出 1顶部, 2底部  
    this.TextBG;            //{ Color:"rgb(0,0,92)", Border:"rgb(205,0,92)", Margin:[0,1,1,1],  }   // { Color:背景色, Border:边框颜色, Margin=[上,下,左, 右] }
    this.VerticalLine;      //垂直线
    this.ShowOffset={ X:0, Y:0 };   //显示偏移

    this.TextSize=
    {
        Max: g_JSChartResource.DRAWICON.Text.MaxSize, Min:g_JSChartResource.DRAWICON.Text.MinSize, //字体的最大最小值
        Zoom:{ Type:g_JSChartResource.DRAWICON.Text.Zoom.Type , Value:g_JSChartResource.DRAWICON.Text.Zoom.Value }, //放大倍数
        FontName:g_JSChartResource.DRAWICON.Text.FontName
    }

    this.ReloadResource=function(resource)
    {
       this.TextSize=
        {
            Max: g_JSChartResource.DRAWTEXT.MaxSize, Min:g_JSChartResource.DRAWTEXT.MinSize, //字体的最大最小值
            Zoom:{ Type:g_JSChartResource.DRAWTEXT.Zoom.Type , Value:g_JSChartResource.DRAWTEXT.Zoom.Value }, //放大倍数
            FontName:g_JSChartResource.DRAWTEXT.FontName
        }
    }

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;

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
        var drawTextInfo={ Text:{ Color:this.Color, Align:this.TextAlign, Baseline:this.TextBaseline }, Font:{ } };

        //字体大小
        if (this.FixedFontSize>0) 
            this.TextFont=`${this.FixedFontSize}px ${this.TextSize.FontName}`;
        else
            this.TextFont = this.GetDynamicFontEx(dataWidth,distanceWidth,this.TextSize.Max,this.TextSize.Min,this.TextSize.Zoom,this.TextSize.FontName);

        drawTextInfo.Font={ Height:this.GetFontHeight(this.TextFont) };
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
            var x = this.ChartFrame.GetXFromIndex(j);
            var y;
            if (this.FixedPosition===1) y=top;
            else if (this.FixedPosition===2) y=bottom;
            else y=this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            y+=this.ShowOffset.Y;
            x+=this.ShowOffset.X;
            
            drawTextInfo.X=x;
            drawTextInfo.Y=y;

            if (isArrayText) 
            {
                text = this.Text[i];
                if (!text) continue;
                this.DrawText(text,drawTextInfo,isHScreen);
            }
            else 
            {
                this.DrawText(this.Text,drawTextInfo,isHScreen);
            }

            this.DrawVerticalLine(i, drawTextInfo, isHScreen);
        }
    }

    this.DrawText=function(text, drawInfo, isHScreen)
    {
        var textWidth=this.Canvas.measureText(text).width;

        if (isHScreen)
        {
            var x=drawInfo.Y;
            var y=drawInfo.X;

            if (drawInfo.Text.Align=="right") y=y-textWidth;
            else if (drawInfo.Text.Align=="center") y=y-textWidth/2;

            if (drawInfo.Text.Baseline=="top") x-=drawInfo.Font.Height;
            else if (drawInfo.Text.Baseline=="middle") x-=drawInfo.Font.Height/2;

            if (this.TextBG && (this.TextBG.Color || this.TextBG.Border))
            {
                var margin=this.TextBG.Margin;  //0=上 1=下 2=左 3=右
                var xRect=x-margin[0];
                var yRect=y-margin[2];
                var bgWidth=textWidth+margin[2]+margin[3];
                var bgHeight=drawInfo.Font.Height+margin[0]+margin[1];
                if (this.TextBG.Color)
                {
                    this.Canvas.fillStyle=this.TextBG.Color;
                    this.Canvas.fillRect(xRect,yRect,bgHeight,bgWidth);
                }

                if (this.TextBG.Border)
                {
                    this.Canvas.strokeStyle=this.TextBG.Border;
                    this.Canvas.strokeRect(ToFixedPoint(xRect),ToFixedPoint(yRect),ToFixedRect(bgHeight),ToFixedRect(bgWidth));
                }

                drawInfo.Rect={Bottom:xRect, Top:xRect+bgHeight };
            }
            else
            {
                var xRect=x;
                var bgHeight=drawInfo.Font.Height;
                drawInfo.Rect={Bottom:xRect, Top:xRect+bgHeight };
            }

            this.Canvas.textBaseline="bottom";
            this.Canvas.textAlign="left";
            this.Canvas.fillStyle=drawInfo.Text.Color;

            this.Canvas.save(); 
            this.Canvas.translate(x, y);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();
        }
        else
        {
            var x=drawInfo.X;
            var y=drawInfo.Y;
            if (drawInfo.Text.Align=="right") x=x-textWidth;
            else if (drawInfo.Text.Align=="center") x=x-textWidth/2;

            if (drawInfo.Text.Baseline=="top") y+=drawInfo.Font.Height;
            else if (drawInfo.Text.Baseline=="middle") y+=drawInfo.Font.Height/2;

            if (this.TextBG && (this.TextBG.Color || this.TextBG.Border))
            {
                var margin=this.TextBG.Margin;  //0=上 1=下 2=左 3=右
                var xRect=x-margin[2];
                var yRect=y-drawInfo.Font.Height-margin[1];
                var bgWidth=textWidth+margin[2]+margin[3];
                var bgHeight=drawInfo.Font.Height+margin[0]+margin[1];
                if (this.TextBG.Color)
                {
                   
                    this.Canvas.fillStyle=this.TextBG.Color;
                    this.Canvas.fillRect(xRect,yRect,bgWidth,bgHeight);
                }

                if (this.TextBG.Border)
                {
                    this.Canvas.strokeStyle=this.TextBG.Border;
                    this.Canvas.strokeRect(ToFixedPoint(xRect),ToFixedPoint(yRect),ToFixedRect(bgWidth),ToFixedRect(bgHeight));
                }

                drawInfo.Rect={Top:yRect, Bottom:yRect+bgHeight };
            }
            else
            {
                var yRect=y-drawInfo.Font.Height;
                var bgHeight=drawInfo.Font.Height;
                drawInfo.Rect={Top:yRect, Bottom:yRect+bgHeight };
            }

            this.Canvas.textBaseline="bottom";
            this.Canvas.textAlign="left";
            this.Canvas.fillStyle=drawInfo.Text.Color;
            this.Canvas.fillText(text,x,y);
        }
    }

    //画连线
    this.DrawVerticalLine=function(index, drawTextInfo, isHScreen)
    {
        if (!this.VerticalLine) return;

        var item=this.VerticalLine.Data[index];
        if (!item) return;
        if (!IFrameSplitOperator.IsNumber(item.High)) return;
        if (!IFrameSplitOperator.IsNumber(item.Low)) return;
        var yHigh=this.ChartFrame.GetYFromData(item.High);
        var yLow=this.ChartFrame.GetYFromData(item.Low);

        var yLine, yLine2;
        if (isHScreen)
        {
            if (drawTextInfo.Rect.Bottom>yHigh)
            {
                yLine=drawTextInfo.Rect.Bottom-1;
                yLine2=yHigh+1;
            }
            else if (drawTextInfo.Rect.Top<yLow)
            {
                yLine=drawTextInfo.Rect.Top-1;
                yLine2=yLow-1;
            }
            else
            {
                return;
            }
        }
        else
        { 
            if (drawTextInfo.Rect.Bottom<yHigh)
            {
                yLine=drawTextInfo.Rect.Bottom+1;
                yLine2=yHigh-1;
            }
            else if (drawTextInfo.Rect.Top>yLow)
            {
                yLine=drawTextInfo.Rect.Top-1;
                yLine2=yLow+1;
            }
            else
            {
                return;
            }
        }

        this.Canvas.save(); 
        var pixelTatio =1;
        var xLine=drawTextInfo.X;
        if (this.VerticalLine.LineType==1)
        {
            if (this.VerticalLine.LineDotted)
                this.Canvas.setLineDash(this.VerticalLine.LineDotted);
            else 
                this.Canvas.setLineDash([3,3]);
        }

        if (IFrameSplitOperator.IsPlusNumber(this.VerticalLine.LineWidth))
        {
            this.Canvas.lineWidth=this.VerticalLine.LineWidth*pixelTatio;
        }
        
        this.Canvas.strokeStyle=this.VerticalLine.Color;
        this.Canvas.beginPath();
        if (isHScreen)
        {
            this.Canvas.moveTo(ToFixedPoint(yLine),ToFixedPoint(xLine));
            this.Canvas.lineTo(ToFixedPoint(yLine2),ToFixedPoint(xLine));
        }
        else
        {
            this.Canvas.moveTo(ToFixedPoint(xLine),ToFixedPoint(yLine));
            this.Canvas.lineTo(ToFixedPoint(xLine),ToFixedPoint(yLine2));
        }
        this.Canvas.stroke();

        this.Canvas.restore();
    }
}

function ChartDrawNumber()
{
    this.newMethod=ChartDrawText;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawNumber';         //类名

    this.ReloadResource=function(resource)
    {
        this.TextSize=
        {
            Max: g_JSChartResource.DRAWNUMBER.MaxSize, Min:g_JSChartResource.DRAWNUMBER.MinSize, //字体的最大最小值
            Zoom:{ Type:g_JSChartResource.DRAWNUMBER.Zoom.Type , Value:g_JSChartResource.DRAWNUMBER.Zoom.Value }, //放大倍数
            FontName:g_JSChartResource.DRAWNUMBER.FontName
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
    this.LineDash=g_JSChartResource.DOTLINE.LineDash;

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;
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
        var isMinute=this.IsMinuteFrame();
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var chartright = this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        if (bHScreen) xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var xPointCount = this.ChartFrame.XPointCount;

        var lockRect=this.GetLockRect();
        if (lockRect)
        {
            if (bHScreen) chartright=lockRect.Top;
            else chartright=lockRect.Left;
        }

        this.Canvas.save();
        if (this.LineWidth > 0) this.Canvas.lineWidth = this.LineWidth;
        this.Canvas.strokeStyle = this.Color;
        if (this.IsDotLine) this.Canvas.setLineDash(this.LineDash); //画虚线

        var bFirstPoint = true;
        var drawCount = 0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        //for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) 
            {
                if (drawCount > 0) this.Canvas.stroke();
                bFirstPoint = true;
                drawCount = 0;
                continue;
            }

            if (isMinute)
            {
                var x = this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }
            
           
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

//独立线段
//独立线段
function ChartSingleLine()
{
    this.newMethod=ChartLine;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartSingleLine';     //类名
    this.MaxMin=null;    //当前的显示范围

    this.Draw=function()
    {
        this.MaxMin=null;
        if (!this.IsShow || this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;

        if (!this.Data || !this.Data.Data) return;

        this.MaxMin=this.GetCurrentMaxMin();
        if (!this.MaxMin) return;
        if (!IFrameSplitOperator.IsNumber(this.MaxMin.Max) || !IFrameSplitOperator.IsNumber(this.MaxMin.Min)) return;

        switch(this.DrawType)
        {
            
            default: 
                return this.DrawStraightLine();
        }
    }

    //获取当前页的最大最小值
    this.GetCurrentMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={ Max:null, Min:null };

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }

    this.GetMaxMin=function()
    {
        return { Max:null, Min:null };
    }

    this.GetYFromData=function(value)
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);

        if (bHScreen)
        {
            if (value <= this.MaxMin.Min) return this.ChartBorder.GetLeftEx();
            if (value >= this.MaxMin.Max) return this.ChartBorder.GetRightEx();

            var width = this.ChartBorder.GetWidthEx() * (value - this.MaxMin.Min) / (this.MaxMin.Max - this.MaxMin.Min);
            return this.ChartBorder.GetLeftEx() + width;
        }
        else
        {
            if(value<=this.MaxMin.Min) return this.ChartBorder.GetBottomEx();
            if(value>=this.MaxMin.Max) return this.ChartBorder.GetTopEx();
    
            var height=this.ChartBorder.GetHeightEx()*(value-this.MaxMin.Min)/(this.MaxMin.Max-this.MaxMin.Min);
            return this.ChartBorder.GetBottomEx()-height;
        }
    }
}

//彩色线段
function ChartPartLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartPartLine';     //类名
    this.LineWidth;                     //线段宽度    
    this.IsDotLine=false;               //虚线
    this.LineDash=[3,5];                //虚线设置    

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;
        if (!this.Data || !this.Data.Data) return;

        this.DrawLine();
    }

    this.DrawLine=function()
    {
        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        if (bHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var chartright=border.BottomEx;
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
        }

        var xPointCount=this.ChartFrame.XPointCount;
        var isMinute=this.IsMinuteFrame();

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        if (this.IsDotLine) this.Canvas.setLineDash(this.LineDash);         //画虚线
        
        var drawCount=0;
        var lastColor;
        var lastPoint={X:null,Y:null};
        var isPerNull=false;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var item=this.Data.Data[i];
            if (item==null || item.Value==null) 
            {
                lastPoint.X=null;
                lastPoint.Y=null;
                isPerNull=true;
                continue;
            }

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            var value=item.Value;
            var color=item.RGB;
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (color!=lastColor || isPerNull==true)
            {
                if (lastColor && drawCount>0) this.Canvas.stroke();

                drawCount=0;
                lastColor=color;
                this.Canvas.strokeStyle=color;
                this.Canvas.beginPath();

                if (lastPoint.X!=null && lastPoint.Y!=null) //接着上一个点连线
                {
                    if (bHScreen) this.Canvas.moveTo(lastPoint.Y,lastPoint.X);  //横屏坐标轴对调
                    else this.Canvas.moveTo(lastPoint.X,lastPoint.Y);

                    if (bHScreen) this.Canvas.lineTo(y,x);
                    else this.Canvas.lineTo(x,y);

                    ++drawCount;
                }
                else
                {
                    if (bHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
                    else this.Canvas.moveTo(x,y);
                }
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
                ++drawCount;
            }

            lastPoint.X=x;
            lastPoint.Y=y;
            isPerNull=false;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var item = this.Data.Data[i];
            if (!item || !item.Value) continue;
            if (range.Max == null || range.Max<item.Value) range.Max = item.Value;
            if (range.Min == null || range.Min>item.Value) range.Min = item.Value;
        }

        return range;
    }
}

//面积图 支持横屏
function ChartArea()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartArea';    //类名
    this.Color="rgb(255,193,37)";   //线段颜色
    this.AreaColor;                 //面积颜色
    this.LineWidth;                 //线段宽度
    this.LineDash;                  //虚线
    this.AreaDirection=0            //0=向下 1=向上

    this.DrawSelectedStatus=this.DrawLinePoint;
    this.PtInChart=this.PtInLine;

    this.ExportData=this.ExportArrayData;
    this.GetItemData=this.GetArrayItemData;

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        this.DrawArea();
    }

    //无效数不画
    this.DrawArea=function()
    {
        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var isMinute=this.IsMinuteFrame();
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;

        if (bHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var chartright=border.BottomEx;
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
        }

        var lockRect=this.GetLockRect();
        if (lockRect)
        {
            if (bHScreen) chartright=lockRect.Top;
            else chartright=lockRect.Left;
        }

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        this.Canvas.strokeStyle=this.Color;
        if (this.AreaColor) this.Canvas.fillStyle=this.AreaColor;
        else this.Canvas.fillStyle=ColorToRGBA(this.Color,0.6);
        if (IFrameSplitOperator.IsNonEmptyArray(this.LineDash)) this.Canvas.setLineDash(this.LineDas); //画虚线

        var bFirstPoint=true;
        var ptFirst=null, ptEnd=null   //起始结束点
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var value=this.Data.Data[i];
            if (!IFrameSplitOperator.IsNumber(value)) 
            {
                if (drawCount>0) this.Canvas.stroke();
                if (ptFirst && ptEnd)
                {
                    if (bHScreen)
                    {
                       if (this.AreaDirection==1)
                        {
                            this.Canvas.lineTo(border.RightEx,ptEnd.X);
                            this.Canvas.lineTo(border.RightEx,ptFirst.X);
                        }
                        else
                        {
                            this.Canvas.lineTo(border.LeftEx,ptEnd.X);
                            this.Canvas.lineTo(border.LeftEx,ptFirst.X);
                        }
                        this.Canvas.closePath();
                        this.Canvas.fill();
                    }
                    else
                    {
                        if (this.AreaDirection==1)
                        {
                            this.Canvas.lineTo(ptEnd.X, border.TopEx);
                            this.Canvas.lineTo(ptFirst.X, border.TopEx);
                        }
                        else
                        {
                            this.Canvas.lineTo(ptEnd.X, border.BottomEx);
                            this.Canvas.lineTo(ptFirst.X, border.BottomEx);
                        }
                        this.Canvas.closePath();
                        this.Canvas.fill();
                    }
                }

                bFirstPoint=true;
                drawCount=0;
                ptFirst=null;
                ptEnd=null;
                continue;
            }

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }
            
            var y=this.GetYFromData(value,false);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;
                ptFirst={ X:x, Y:y };
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y,x);
                else this.Canvas.lineTo(x,y);
                ptEnd={ X:x, Y:y };
            }

            ++drawCount;
        }

        if (drawCount>0) 
        {
            if (drawCount==1 && ptFirst)    //如果只有1个点, 画一个像素的横线
            {
                if (bHScreen) this.Canvas.lineTo(ptFirst.Y,ptFirst.X+1*GetDevicePixelRatio());
                else this.Canvas.lineTo(ptFirst.X+1*GetDevicePixelRatio(),ptFirst.Y);
            }
           
            this.Canvas.stroke();

            if (ptFirst && ptEnd)
            {
                if (bHScreen)
                {
                    if (this.AreaDirection==1)
                    {
                        this.Canvas.lineTo(border.RightEx,ptEnd.X);
                        this.Canvas.lineTo(border.RightEx,ptFirst.X);
                    }
                    else
                    {
                        this.Canvas.lineTo(border.LeftEx,ptEnd.X);
                        this.Canvas.lineTo(border.LeftEx,ptFirst.X);
                    }
                    this.Canvas.closePath();
                    this.Canvas.fill();
                }
                else
                {
                    if (this.AreaDirection==1)
                    {
                        this.Canvas.lineTo(ptEnd.X, border.TopEx);
                        this.Canvas.lineTo(ptFirst.X, border.TopEx);
                    }
                    else
                    {
                        this.Canvas.lineTo(ptEnd.X, border.BottomEx);
                        this.Canvas.lineTo(ptFirst.X, border.BottomEx);
                    }
                    this.Canvas.closePath();
                    this.Canvas.fill();
                }
            }
        }
        this.Canvas.restore();
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
    this.EnableUpDownColor=false;   //是否是红绿点
    this.HistoryData;

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;

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
        var colorDot;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            if (this.EnableUpDownColor)
            {
                var kItem=this.HistoryData.Data[i];

                if (kItem.Close>value) colorDot="rgb(255,61,61)";
                else colorDot='rgb(0,199,65)';

                this.Canvas.fillStyle=colorDot;
            }


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
        if (this.ChartFrame.IsMinSize) return;
        if (this.IsHideScriptIndex()) return;
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
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (this.IsHideScriptIndex()) return;
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
    this.BarType = 0;                 //柱子类型  0=实心 1=空心 -1=画虚线空心柱
    this.LineDotted=[3,3];            //虚线设置
    this.Width=0;                       //柱子宽度 0=1 3,50=k线宽度 101=K线宽度+间距宽度
    this.MinBarWidth=g_JSChartResource.MinKLineBarWidth; //最小的柱子宽度
    this.IsHScreen=false;
    this.BarCache={ Type:0 };                  //Type:1=线段 2=柱子

    this.SetEmptyBar=function()         //设置空心柱子
    {
        if (this.BarType!=1 && this.BarType!=-1) return false;

        this.Canvas.lineWidth=1;
        this.Canvas.strokeStyle=this.Color;
        var emptyBGColor=g_JSChartResource.EmptyBarBGColor;
        if (emptyBGColor) this.BarCache.EmptyBGColor=emptyBGColor;
        if (this.BarType==-1) this.BarCache.LineDotted=this.LineDotted;   //虚线

        return true;
    }

    this.IsEmptyBar=function()
    {
        return (this.BarType==1 || this.BarType==-1);
    }

    this.Draw = function () 
    {
        if (this.ChartFrame.IsMinSize) return;
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        this.BarCache={ Color:this.Color, EmptyBGColor:null, Width:1, Type:0, LineDotted:null };
        this.IsHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        var isMinute=this.IsMinuteFrame();

        if (this.IsHScreen)
        {
            chartright = this.ChartBorder.GetBottom();
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + g_JSChartResource.FrameLeftMargin;
        } 

        if (isMinute)
        {
            if (this.Width>1) this.BarCache.Width=2;
            this.BarCache.Type=1;
        }
        else if(this.Width==0)
        {
            this.BarCache.Type=1;
            this.SetEmptyBar();
        }
        else if (this.Width==50 || this.Width==3)   //3和50 K线宽度
        {
            this.BarCache.Type=1;
            if (dataWidth >= this.MinBarWidth) 
            {
                this.BarCache.Type=2;
                this.BarCache.Width=dataWidth;
                this.SetEmptyBar();
            }
        }
        else if (this.Width==101)   //柱子+间距
        {
            var lineWidth=dataWidth+distanceWidth+1;
            this.BarCache.Type=1;
            if (lineWidth >= this.MinBarWidth) 
            {
                this.BarCache.Type=2;
                this.BarCache.Width=lineWidth;
            }
        }
        else if (this.Width <=3) 
        {
            var minWidth=2;
            var barWidth=dataWidth*(this.Width/3);
            if (barWidth<minWidth) barWidth=minWidth;
            this.BarCache.Type=1;
            if (barWidth >= this.MinBarWidth) 
            {
                this.BarCache.Type=2;
                this.BarCache.Width=barWidth;
                this.SetEmptyBar();
            }
        }
        else 
        {
            var barWidth=this.Width;
            this.BarCache.Type=2;
            this.BarCache.Width=barWidth;
            this.SetEmptyBar();
        }

        this.Canvas.save();
        this.Canvas.strokeStyle=this.BarCache.Color;
        if (this.BarCache.EmptyBGColor) this.Canvas.fillStyle=this.BarCache.EmptyBGColor;   //空心柱子
        else this.Canvas.fillStyle=this.BarCache.Color;
        if (IFrameSplitOperator.IsNonEmptyArray(this.BarCache.LineDotted)) this.Canvas.setLineDash(this.BarCache.LineDotted);   //虚线
        if (this.BarCache.Type==1) this.Canvas.lineWidth=this.BarCache.Width;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var value = this.Data.Data[i];
            if (!value) continue;
            if (!IFrameSplitOperator.IsNumber(value.Value)) continue;
            
            var price = value.Value;
            var price2 =0;
            if (IFrameSplitOperator.IsNumber(value.Value2)) price2=value.Value2;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                var x=left+(right-left)/2;
            }

            var y = this.ChartFrame.GetYFromData(price);
            var y2 = this.ChartFrame.GetYFromData(price2);

            if (x > chartright) break;

            var xCenter=x;
            var yTop=Math.min(y,y2);
            var barHeight=Math.abs(y-y2);   //柱子高度

            this.DrawBar(xCenter, yTop, barHeight);
        }

        this.Canvas.restore();
    }

    this.DrawBar=function(xCenter, ytop, barHeight)
    {
        if (barHeight<1) barHeight=1;

        if (this.BarCache.Type==1)  //线段
        {
            if (this.IsHScreen)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ytop,ToFixedPoint(xCenter));
                this.Canvas.lineTo(ytop+barHeight,ToFixedPoint(xCenter));
                this.Canvas.stroke();
            }
            else
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(xCenter),ytop);
                this.Canvas.lineTo(ToFixedPoint(xCenter),ytop+barHeight);  
                this.Canvas.stroke();
            }
        }
        else if (this.BarCache.Type==2) //柱子
        {
            if (this.IsHScreen)
            {
                var xLeft=xCenter-this.BarCache.Width/2;
                if (this.IsEmptyBar()) //空心
                {
                    if (this.BarCache.EmptyBGColor) //背景色填充
                        this.Canvas.fillRect(ToFixedRect(ytop),ToFixedRect(xLeft),ToFixedRect(barHeight),ToFixedRect(this.BarCache.Width));

                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(ytop),ToFixedPoint(xLeft),ToFixedRect(barHeight),ToFixedRect(this.BarCache.Width));
                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.fillRect(ToFixedRect(ytop),ToFixedRect(xLeft),ToFixedRect(barHeight),ToFixedRect(this.BarCache.Width));
                }
            }
            else
            {
                var xLeft=xCenter-this.BarCache.Width/2;
                if (this.IsEmptyBar()) //空心
                {
                    if (this.BarCache.EmptyBGColor) //背景色填充
                        this.Canvas.fillRect(ToFixedRect(xLeft),ToFixedRect(ytop),ToFixedRect(this.BarCache.Width),ToFixedRect(barHeight));

                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(xLeft),ToFixedPoint(ytop),ToFixedRect(this.BarCache.Width),ToFixedRect(barHeight));
                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.fillRect(ToFixedRect(xLeft),ToFixedRect(ytop),ToFixedRect(this.BarCache.Width),ToFixedRect(barHeight));
                }
            }
        }
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
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
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
        this.Canvas.beginPath();
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
    this.Status=OVERLAY_STATUS_ID.STATUS_NONE_ID;
    this.ShowRange={ };     //K线显示范围 { Start:, End:,  DataCount:, ShowCount: }
    this.DrawKRange={ Start:null, End:null };       //当前屏K线的索引{ Start: , End:}
    this.YInfoType=4;
    
    this.SetOption = function (option) 
    {
        if (!option) return;
        if (IFrameSplitOperator.IsNumber(option.DrawType)) this.CustomDrawType = option.DrawType;
        if (IFrameSplitOperator.IsNumber(option.YInfoType)) this.YInfoType=option.YInfoType;
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

        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.ShowRange.FirstOpen=firstOpen;
        this.DrawKRange.Start=this.Data.DataOffset;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (!data || data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) 
            {
                firstOverlayOpen = data.Open;
                this.ShowRange.FirstOverlayOpen=data.Open;
            }

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
            this.DrawKRange.End=i;

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
        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.ShowRange.FirstOpen=firstOpen;
        this.DrawKRange.Start=this.Data.DataOffset;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) 
            {
                firstOverlayOpen = data.Open;
                this.ShowRange.FirstOverlayOpen=data.Open;
            }
            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low / firstOverlayOpen * firstOpen);
            var yHigh = this.ChartFrame.GetYFromData(data.High / firstOverlayOpen * firstOpen);
            var yOpen = this.ChartFrame.GetYFromData(data.Open / firstOverlayOpen * firstOpen);
            var yClose = this.ChartFrame.GetYFromData(data.Close / firstOverlayOpen * firstOpen);
            this.DrawKRange.End=i;

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
        this.ShowRange.Start=this.Data.DataOffset;
        this.ShowRange.End=this.ShowRange.Start;
        this.ShowRange.DataCount=0;
        this.ShowRange.ShowCount=xPointCount;
        this.ShowRange.FirstOpen=firstOpen;
        this.DrawKRange.Start=this.Data.DataOffset;

        this.Canvas.strokeStyle = this.Color;
        this.Canvas.beginPath();
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth),++this.ShowRange.DataCount) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            if (firstOverlayOpen == null) 
            {
                firstOverlayOpen = data.Open;
                this.ShowRange.FirstOverlayOpen=data.Open;
            }
            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yClose = this.ChartFrame.GetYFromData(data.Close / firstOverlayOpen * firstOpen);
            this.DrawKRange.End=i;

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

    this.GetFirstOpen=function()
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var firstOpen = null; //主线数据第1个开盘价
        for (var i = this.Data.DataOffset, j = 0; i < this.MainData.Data.length && j < xPointCount; ++i, ++j) 
        {
            var data = this.MainData.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;
            firstOpen = data.Open;
            break;
        }

        return firstOpen;
    }

    this.Draw = function () 
    {
        this.TooltipRect = [];
        this.DrawKRange={ Start:null, End:null };
        if (!this.MainData || !this.Data) return;

        var firstOpen = this.GetFirstOpen(); //主线数据第1个开盘价
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

        var firstOpen = this.GetFirstOpen(); //主线数据第1个收盘价
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

// 多文本集合2.0  支持横屏
function ChartMultiText() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartMultiText';
    this.Texts = [];  //[ {Date, Time:, Value:, Text:, Color:, Font: , Baseline:, Line:{ Color:, Dash:[虚线点], KData:"H/L", Offset:[5,10], Width:线粗细 } } ]
    this.Font = g_JSChartResource.DefaultTextFont;
    this.Color = g_JSChartResource.DefaultTextColor;
    this.IsHScreen = false;   //是否横屏

    this.MapCache=null; //key=date/date-time  value={ Data:[] }
    this.GetKValue=ChartData.GetKValue;

    this.BuildCacheData=function()
    {
        var mapData=new Map();
        this.MapCache=mapData;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Texts)) return;

        for(var i=0;i<this.Texts.length;++i)
        {
            var item=this.Texts[i];
            var key=this.BuildKey(item);
            if (mapData.has(key))
            {
                var mapItem=mapData.get(key);
                mapItem.Data.push(item);
            }
            else
            {
                mapData.set(key,{ Data:[item] });
            }
        }
    }

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return; //k线数据
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Texts)) return;
        if (!this.MapCache || this.MapCache.size<=0) return;

        this.IsHScreen = (this.ChartFrame.IsHScreen === true);

        this.Canvas.save();
        this.ClipClient(this.IsHScreen);

        this.DrawAllText();
        this.Canvas.restore();
    }

    this.DrawAllText=function()
    {
        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var isMinute=this.IsMinuteFrame();
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;

        if (bHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var chartright=border.BottomEx;
            var chartleft=border.TopEx;
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var left=this.ChartBorder.GetTop();
            var right=this.ChartBorder.GetBottom();
            var top=border.RightEx;
            var bottom=border.LeftEx;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var chartleft=border.LeftEx;
            var left=this.ChartBorder.GetLeft();
            var right=this.ChartBorder.GetRight();
            var top=border.TopEx;
            var bottom=border.BottomEx;
        }

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=this.Data.Data[i];
            if (!kItem) continue;

            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            for(var k=0;k<mapItem.Data.length;++k)
            {
                var item=mapItem.Data[k];
                var y=top;
                if (item.Value=="TOP") y=top;
                else if (item.Value=="BOTTOM") y=bottom;
                else
                {
                    var price=item.Value;
                    if (IFrameSplitOperator.IsString(item.Value)) price=this.GetKValue(kItem,item.Value);
                    
                    y=this.ChartFrame.GetYFromData(price, false);
                }
                

                if (item.Color)  this.Canvas.fillStyle = item.Color;
                else this.Canvas.fillStyle = this.Color;
                if (item.Font) this.Canvas.font = item.Font;
                else this.Canvas.font=this.Font;

                var textWidth=this.Canvas.measureText(item.Text).width;
                this.Canvas.textAlign='center';
                if (x+textWidth/2>=chartright) 
                {
                    this.Canvas.textAlign='right';
                    x=chartright;
                }
                else if (x-textWidth/2<chartleft)
                {
                    this.Canvas.textAlign = 'left';
                    x=chartleft;
                }
                
                if (item.Baseline==1) this.Canvas.textBaseline='top';
                else if (item.Baseline==2) this.Canvas.textBaseline='bottom';
                else this.Canvas.textBaseline = 'middle';

                if (this.IsHScreen)
                {
                    this.Canvas.save(); 
                    this.Canvas.translate(y, x);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Text,0,0);
                    this.Canvas.restore();
                }
                else
                {
                    if (IFrameSplitOperator.IsNumber(item.YMove)) y+=item.YMove;
                    this.Canvas.fillText(item.Text, x, y);
                }

                if (item.Line)
                {
                    var price=item.Line.KData=="H"? kItem.High:kItem.Low;
                    var yPrice=this.ChartFrame.GetYFromData(price, false);
                    var yText=y;
                    if (Array.isArray(item.Line.Offset) && item.Line.Offset.length==2)
                    {
                        if (yText>yPrice) //文字在下方
                        {
                            yText-=item.Line.Offset[1];
                            yPrice+=item.Line.Offset[0]
                        }
                        else if (yText<yPrice)
                        {
                            yText+=item.Line.Offset[1];
                            yPrice-=item.Line.Offset[0]
                        }
                    }
                    this.Canvas.save();
                    if (item.Line.Dash) this.Canvas.setLineDash(item.Line.Dash);    //虚线
                    if (item.Line.Width>0) this.Canvas.lineWidth=item.Line.Width;   //线宽
                    this.Canvas.strokeStyle = item.Line.Color;
                    this.Canvas.beginPath();
                    if (this.IsHScreen)
                    {
                        this.Canvas.moveTo(yText, ToFixedPoint(x));
                        this.Canvas.lineTo(yPrice,ToFixedPoint(x));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),yText);
                        this.Canvas.lineTo(ToFixedPoint(x),yPrice);
                    }
                    
                    this.Canvas.stroke();
                    this.Canvas.restore();
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

// 多dom节点
function ChartMultiHtmlDom()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartMultiHtmlDom";
    this.Texts=[];  //[ {Index:, Value:, Text: ] Text=dom内容
    this.IsHScreen=false;   //是否横屏
    this.DrawCallback;  //function(op, obj)  op:1=开始 2=结束 3=绘制单个数据 4=销毁
    this.DrawItem=[];
    this.IsDestroy=false;   //是否已销毁

    this.Draw=function()
    {
        this.DrawItem=[];
        if (this.DrawCallback) this.DrawCallback(1, {Self:this} );

        this.DrawDom();
        
        if (this.DrawCallback) this.DrawCallback(2, { Self:this, Draw:this.DrawItem } );
    }

    this.OnDestroy=function()
    {
        this.IsDestroy=true;
        if (this.DrawCallback) this.DrawCallback(4, { Self:this } );
    }

    this.DrawDom=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || this.Data.length<=0) return;

        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        var xPointCount=this.ChartFrame.XPointCount;
        var offset=this.Data.DataOffset;
        
        for(var i in this.Texts)
        {
            var item=this.Texts[i];

            if (!item.Text) continue;
            if (!IFrameSplitOperator.IsNumber(item.Index)) continue;

            var index=item.Index-offset;
            var kItem=this.Data.Data[item.Index];   //K线数据
            var obj={ KData:kItem, Item:item, IsShow:false, Self:this };
            if (index>=0 && index<xPointCount)
            {
                var x=this.ChartFrame.GetXFromIndex(index);
                var y=this.ChartFrame.GetYFromData(item.Value);

                obj.X=x;
                obj.Y=y;
                obj.IsShow=true;
            }

            this.DrawItem.push(obj);

            if (this.DrawCallback) this.DrawCallback(3, obj);
        }
    }

    this.GetMaxMin=function()
    {
        var range={ Min:null, Max:null };
        var xPointCount=this.ChartFrame.XPointCount;
        var start=this.Data.DataOffset;
        var end=start+xPointCount;

        for(var i in this.Texts)
        {
            var item=this.Texts[i];
            if (!IFrameSplitOperator.IsNumber(item.Index)) continue;
            if (item.Index>=start && item.Index<end)
            {
                if (range.Max==null) range.Max=item.Value;
                else if (range.Max<item.Value) range.Max=item.Value;
                if (range.Min==null) range.Min=item.Value;
                else if (range.Min>item.Value) range.Min=item.Value;
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

    this.ClassName="ChartMultiLine";
    this.Lines = [];   // [ {Point:[ {Index, Value }, ], Color: }, ] 
    this.IsHScreen = false;
    this.LineWidth=1;
    this.LineDash;

    //箭头配置
    this.ArrawAngle=35;     //三角斜边一直线夹角
    this.ArrawLength=10;    //三角斜边长度
    this.ArrawLineWidth=5;  //箭头粗细
    this.Arrow={ Start:false, End:false };  //Start=是否绘制开始箭头 <-   End=是否绘制结束箭头 ->

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || this.Data.length <= 0) return;

        this.IsHScreen = (this.ChartFrame.IsHScreen === true);
        var xPointCount = this.ChartFrame.XPointCount;
        var offset = this.Data.DataOffset;

        var drawLines = [];
        var arrowLines=[];
        for (var i=0; i<this.Lines.length; ++i) 
        {
            var line = this.Lines[i];
            var drawPoints = { Point: [], Color: line.Color };
            var drawArrowPoints={ Start:[], End:[] };
            if (line.BGColor) drawPoints.BGColor=line.BGColor;
            for (var j=0;j<line.Point.length; ++j) 
            {
                var point = line.Point[j];
                if (!IFrameSplitOperator.IsNumber(point.Index)) continue;

                var index = point.Index - offset;
                if (index >= 0 && index < xPointCount) 
                {
                    var x = this.ChartFrame.GetXFromIndex(index);
                    var y = this.ChartFrame.GetYFromData(point.Value);
                    var pointItem={X:x, Y:y, End:false };
                    drawPoints.Point.push({ X: x, Y: y });

                    if (j==0 || j==1) drawArrowPoints.Start.push(pointItem);    //起始点
                    if (j==line.Point.length-1 || j==line.Point.length-2) drawArrowPoints.End.push(pointItem);  //结束点
                }
                else
                {
                    if (drawPoints.Point.length>0) drawPoints.Point[drawPoints.Point.length-1].End=true;  //点断开
                }
            }

            if (drawPoints.Point.length >= 2) 
            {
                drawLines.push(drawPoints);
                arrowLines.push(drawArrowPoints);
            }
        }

        this.Canvas.save();
        for (var i=0; i<drawLines.length; ++i) 
        {
            if (this.LineDash) this.Canvas.setLineDash(this.LineDash);
            if (IFrameSplitOperator.IsPlusNumber(this.LineWidth)) this.Canvas.lineWidth=this.LineWidth;
            else this.Canvas.lineWidth=1;

            var item = drawLines[i];
            this.DrawLine(item, arrowLines[i]);
        }
        this.Canvas.restore();
    }

    this.DrawLine = function (line, arrow) 
    {
        if (line.BGColor)   //背景色
        {
            this.Canvas.fillStyle=line.BGColor;
            for(var i=0; i<line.Point.length; ++i)
            {
                var item=line.Point[i];
                if (i==0)
                {
                    this.Canvas.beginPath();
                    if (this.IsHScreen) this.Canvas.moveTo(item.Y,item.X);
                    else this.Canvas.moveTo(item.X,item.Y);
                }
                else
                {
                    if (this.IsHScreen) this.Canvas.lineTo(item.Y,item.X);
                    else this.Canvas.lineTo(item.X,item.Y);
                }
            }
            this.Canvas.closePath();
            this.Canvas.fill();
        }

        this.Canvas.strokeStyle = line.Color;
        var drawCount=0;
        for (var i=0; i<line.Point.length; ++i) 
        {
            var item = line.Point[i];
            if (drawCount==0) 
            {
                this.Canvas.beginPath();
                if (this.IsHScreen) this.Canvas.moveTo(item.Y, item.X);
                else this.Canvas.moveTo(item.X, item.Y);
                ++drawCount;
            }
            else 
            {
                if (this.IsHScreen) this.Canvas.lineTo(item.Y, item.X);
                else this.Canvas.lineTo(item.X, item.Y);
                ++drawCount;
            }

            if (item.End==true) //点断了 要重新画
            {
                if (drawCount>0) this.Canvas.stroke();
                drawCount=0;
            }
        }

        if (drawCount>0) this.Canvas.stroke();

        //绘制箭头
        if (arrow.End.length==2 && this.Arrow.End==true)    
            this.DrawArrow(arrow.End[0],arrow.End[1]);

        if (arrow.Start.length==2 && this.Arrow.Start==true)
            this.DrawArrow(arrow.Start[1],arrow.Start[0]);
    }

    this.DrawArrow=function(ptStart,ptEnd)
    {
        //计算箭头
        var theta=this.ArrawAngle;       //三角斜边一直线夹角
        var headlen=this.ArrawLength;    //三角斜边长度
        var angle = Math.atan2(ptStart.Y - ptEnd.Y, ptStart.X - ptEnd.X) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

        this.Canvas.beginPath();
        var arrowX = ptEnd.X + topX;
        var arrowY = ptEnd.Y + topY;
        this.Canvas.moveTo(arrowX,arrowY);

        this.Canvas.lineTo(ptEnd.X, ptEnd.Y);

        arrowX = ptEnd.X + botX;
        arrowY = ptEnd.Y + botY;
        this.Canvas.lineTo(arrowX,arrowY);

        this.Canvas.setLineDash([]);
        this.Canvas.lineWidth=this.ArrawLineWidth;
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

// 多个点集合2.0 支持横屏
function ChartMultiPoint()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    
    this.ClassName="ChartMultiPoint";
    this.PointGroup=[];   // [ {Point:[ { {Date, Time, Value } }, ], Color:  }, ] 

    this.IsHScreen=false;
    this.LineWidth=1;
    this.PointRadius=5;

    this.MapCache=null; //key=date/date-time  value={ Data:[] }
    this.GetKValue=ChartData.GetKValue;

    this.GetItem=function(kItem)
    {
        if (!this.MapCache || this.MapCache.size<=0) return null;

        var key=this.BuildKey(kItem);
        if (!this.MapCache.has(key)) return null;

        return this.MapCache.get(key);
    }

    this.BuildCacheData=function()
    {
        var mapData=new Map();
        this.MapCache=mapData;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.PointGroup)) return;

        for(var i=0; i<this.PointGroup.length; ++i)
        {
            var groupItem=this.PointGroup[i];
            if (!groupItem || !IFrameSplitOperator.IsNonEmptyArray(groupItem.Point)) continue;

            var clrConfig= { Color:groupItem.Color, BGColor:groupItem.BGColor, LineWidth:this.LineWidth, Radius:this.PointRadius, Name:groupItem.Name };
            if (IFrameSplitOperator.IsNumber(groupItem.PointRadius)) clrConfig.Radius=groupItem.PointRadius;
            if (IFrameSplitOperator.IsNumber(groupItem.LineWidth)) clrConfig.LineWidth=groupItem.LineWidth;
            
            for(var j=0; j<groupItem.Point.length; ++j)
            {
                var point=groupItem.Point[j];
                var key=this.BuildKey(point);
                
                var item={ Data:point, ColorConfig:clrConfig }
                if (mapData.has(key))
                {
                    var mapItem=mapData.get(key);
                    mapItem.Data.push(item);
                }
                else
                {
                    mapData.set(key,{ Data:[item] });
                }
            }
        }
    }

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return; //k线数据
        if (!IFrameSplitOperator.IsNonEmptyArray(this.PointGroup)) return;
        if (!this.MapCache || this.MapCache.size<=0) return;

        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        var xPointCount=this.ChartFrame.XPointCount;
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var isMinute=this.IsMinuteFrame();
        var border=this.GetBorder();

        if (this.IsHScreen)
        {
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.BottomEx;
            var chartLeft=border.TopEx;
        }
        else
        {
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var chartLeft=border.LeftEx;
        }

        //计算所有的点位置
        var mapPoint=new Map();
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            this.CalculateItem(mapItem, kItem, x, mapPoint);
        }

        if (mapPoint.size<=0) return;

        this.Canvas.save();
        this.DrawAllPoint(mapPoint);
        this.Canvas.restore();
    }

    this.CalculateItem=function(groupItem, kItem, x, mapPoint)
    {
        for(var i=0; i<groupItem.Data.length; ++i)
        {
            var item=groupItem.Data[i];
            var value=item.Data.Value;
            if (IFrameSplitOperator.IsString(item.Data.Value)) value=this.GetKValue(kItem,item.Data.Value);
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            var y=this.ChartFrame.GetYFromData(value,false);

            var strConfig=JSON.stringify(item.ColorConfig);
            if (!mapPoint.has(strConfig)) mapPoint.set(strConfig, { AryPoint:[]});
            var mapItem=mapPoint.get(strConfig);

            mapItem.AryPoint.push({ X:x, Y:y, Data:item });
        }
    }

    this.DrawAllPoint=function(mapPoint)
    {
        for(var mapItem of mapPoint)
        {
            var aryPoint=mapItem[1].AryPoint;
            if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) continue;
            var config=null;
            this.Canvas.beginPath();
            var count=0;
            for(var i=0;i<aryPoint.length;++i)
            {
                var item=aryPoint[i];
                if (!config) config=item.Data.ColorConfig;

                if (this.IsHScreen) 
                {
                    this.Canvas.moveTo(item.Y+config.Radius,item.X);
                    this.Canvas.arc(item.Y,item.X,config.Radius,0,360,false);
                }
                else
                {
                    this.Canvas.moveTo(item.X+config.Radius,item.Y);
                    this.Canvas.arc(item.X,item.Y,config.Radius,0,360,false);
                }
                    
                ++count;
            }

            if (count>0 && config)
            {
                if (config.BGColor) 
                {
                    this.Canvas.fillStyle=config.BGColor;      //背景填充颜色
                    this.Canvas.fill();
                }

                if (config.Color) 
                {
                    this.Canvas.lineWidth=config.LineWidth;
                    this.Canvas.strokeStyle=config.Color;
                    this.Canvas.stroke();
                }
            }
        }
    }

    this.GetMaxMin=function()
    {
        var range={ Min:null, Max:null };
        if(!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return range;
        if (!this.MapCache || this.MapCache.size<=0) return;
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i=this.Data.DataOffset,j=0, k=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            for(k=0;k<mapItem.Data.length;++k)
            {
                var item=mapItem.Data[k];
                var value=item.Data.Value;
                if (IFrameSplitOperator.IsString(item.Data.Value)) value=this.GetKValue(kItem,item.Data.Value);
                if (!IFrameSplitOperator.IsNumber(value)) continue;

                if (range.Max==null) range.Max=value;
                else if (range.Max<value) range.Max=value;
                if (range.Min==null) range.Min=value;
                else if (range.Min>value) range.Min=value;
            }
        }

        return range;
    }
}

// 柱子集合2.0  支持横屏
function ChartMultiBar() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Bars = [];   // [ {Point:[ {Date, Time, Value, Value2 }, ], Color:, Width: , Type: 0 实心 1 空心 }, ] 
    this.IsHScreen = false;

    this.MapCache=null; //key=date/date-time  value={ Data:[] }
    this.GetKValue=ChartData.GetKValue;

    this.GetItem=function(kItem)
    {
        if (!this.MapCache || this.MapCache.size<=0) return null;

        var key=this.BuildKey(kItem);
        if (!this.MapCache.has(key)) return null;

        return this.MapCache.get(key);
    }

    this.BuildCacheData=function()
    {
        var mapData=new Map();
        this.MapCache=mapData;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Bars)) return;

        for(var i=0; i<this.Bars.length; ++i)
        {
            var groupItem=this.Bars[i];
            if (!groupItem || !IFrameSplitOperator.IsNonEmptyArray(groupItem.Point)) continue;

            var clrConfig= { Color:groupItem.Color, Width:5, Name:groupItem.Name, Type:0 };
            if (IFrameSplitOperator.IsNumber(groupItem.Width)) clrConfig.Width=groupItem.Width;
            if (IFrameSplitOperator.IsNumber(groupItem.Type)) clrConfig.Type=groupItem.Type;

            for(var j=0; j<groupItem.Point.length; ++j)
            {
                var point=groupItem.Point[j];
                var key=this.BuildKey(point);
                
                var item={ Data:point, ColorConfig:clrConfig }
                if (mapData.has(key))
                {
                    var mapItem=mapData.get(key);
                    mapItem.Data.push(item);
                }
                else
                {
                    mapData.set(key,{ Data:[item] });
                }
            }
        }
    }

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return; //k线数据
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Bars)) return;
        if (!this.MapCache || this.MapCache.size<=0) return;

        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        var xPointCount=this.ChartFrame.XPointCount;
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var isMinute=this.IsMinuteFrame();

        var border=this.GetBorder();
        if (this.IsHScreen)
        {
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.BottomEx;
            var chartLeft=border.TopEx;
        }
        else
        {
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var chartLeft=border.LeftEx;
        }

        //计算所有柱子位置
        var mapBar=new Map();
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            this.CalculateItem(mapItem, kItem, x, mapBar);
        }

        if (mapBar.size<=0) return;

        this.Canvas.save();
        this.ClipClient(this.IsHScreen);

        this.DrawAllBar(mapBar);

        this.Canvas.restore();
    }

    this.CalculateItem=function(groupItem, kItem, x, mapBar)
    {
        for(var i=0; i<groupItem.Data.length; ++i)
        {
            var item=groupItem.Data[i];
            var value=item.Data.Value;
            if (IFrameSplitOperator.IsString(item.Data.Value)) value=this.GetKValue(kItem,item.Data.Value);
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            var value2=item.Data.Value2;
            if (IFrameSplitOperator.IsString(item.Data.Value2)) value2=this.GetKValue(kItem,item.Data.Value2);
            if (!IFrameSplitOperator.IsNumber(value2)) continue;

            var y=this.ChartFrame.GetYFromData(value, false);
            var y2=this.ChartFrame.GetYFromData(value2, false);

            var strConfig=JSON.stringify(item.ColorConfig);
            if (!mapBar.has(strConfig)) mapBar.set(strConfig, { AryBar:[]});
            var mapItem=mapBar.get(strConfig);

            mapItem.AryBar.push({ X:x, Y:y, Y2:y2, Data:item });
        }
    }

    this.DrawAllBar=function(mapBar)
    {
        var dataWidth=this.ChartFrame.DataWidth;
        for(var mapItem of mapBar)
        {
            var aryBar=mapItem[1].AryBar;
            if (!IFrameSplitOperator.IsNonEmptyArray(aryBar)) continue;

            var config=null;
            var count=0;
            var drawType=-1;    //1=直线 2=实心 3=空心
            var barWidth=dataWidth;
            this.Canvas.beginPath();
            for(var i=0;i<aryBar.length;++i)
            {
                var item=aryBar[i];
                if (!config)
                {
                    barWidth=dataWidth;
                    config=item.Data.ColorConfig;
                    if (IFrameSplitOperator.IsNumber(config.Width)) barWidth=config.Width;
                    if (barWidth>4)
                    {
                        if (config.Type==0) drawType=2;         //实心
                        else if (config.Type==1)  drawType=3;    //空心
                        else continue;
                    }
                    else    //太细了， 直线
                    {
                        drawType=1;
                    }
                }

                if (drawType<=0) continue;

                if (drawType==1)
                {
                    if (this.IsHScreen)
                    {
                        this.Canvas.moveTo(ToFixedPoint(item.Y),ToFixedPoint(item.X));
                        this.Canvas.lineTo(ToFixedPoint(item.Y2),ToFixedPoint(item.X));
                    }
                    else
                    {
                        this.Canvas.moveTo(ToFixedPoint(item.X),ToFixedPoint(item.Y));
                        this.Canvas.lineTo(ToFixedPoint(item.X),ToFixedPoint(item.Y2));
                    }
                    ++count;
                }
                else if (drawType==2)   //实心
                {
                    var x=item.X-(barWidth/2);
                    var y=Math.min(item.Y,item.Y2);
                    var barWidth=barWidth;
                    var barHeight=Math.abs(item.Y-item.Y2);

                    if (this.IsHScreen) 
                        this.Canvas.rect(ToFixedRect(y),ToFixedRect(x),ToFixedRect(barHeight),ToFixedRect(barWidth))
                    else
                        this.Canvas.rect(ToFixedRect(x),ToFixedRect(y),ToFixedRect(barWidth),ToFixedRect(barHeight))

                    ++count;
                }
                else if (drawType==3)    //空心
                {
                    var x=item.X-(barWidth/2);
                    var y=Math.min(item.Y,item.Y2);
                    var barWidth=barWidth;
                    var barHeight=Math.abs(item.Y-item.Y2);

                    if (this.IsHScreen) 
                        this.Canvas.rect(ToFixedPoint(y),ToFixedPoint(x),ToFixedPoint(barHeight),ToFixedPoint(barWidth))
                    else
                        this.Canvas.rect(ToFixedPoint(x),ToFixedPoint(y),ToFixedPoint(barWidth),ToFixedPoint(barHeight))

                    ++count;
                }
            }

            if (count>0 && drawType>0 && config)
            {
                if (drawType==1)
                {
                    this.Canvas.lineWidth=1;
                    this.Canvas.strokeStyle=config.Color;
                    this.Canvas.stroke();
                }
                else if (drawType==2)
                {
                    this.Canvas.fillStyle=config.Color;      //背景填充颜色
                    this.Canvas.fill();
                }
                else if (drawType==3)
                {
                    this.Canvas.lineWidth=1;
                    this.Canvas.strokeStyle=config.Color;
                    this.Canvas.stroke();
                }
            }

        }
    }

    this.GetMaxMin = function () 
    {
        var range={ Min:null, Max:null };
        if(!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return range;
        if (!this.MapCache || this.MapCache.size<=0) return range;
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i=this.Data.DataOffset,j=0, k=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            for(k=0;k<mapItem.Data.length;++k)
            {
                var item=mapItem.Data[k];
                var value=item.Data.Value;
                if (IFrameSplitOperator.IsString(item.Data.Value)) value=this.GetKValue(kItem,item.Data.Value);
                if (!IFrameSplitOperator.IsNumber(value)) continue;
                var value2=item.Data.Value2;
                if (IFrameSplitOperator.IsString(item.Data.Value2)) value2=this.GetKValue(kItem,item.Data.Value2);
                if (!IFrameSplitOperator.IsNumber(value2)) continue;

                var minValue=Math.min(value, value2);
                var maxValue=Math.max(value, value2);
                if (range.Max==null) range.Max=maxValue;
                else if (range.Max<maxValue) range.Max=maxValue;
                if (range.Min==null) range.Min=minValue;
                else if (range.Min>minValue) range.Min=minValue;
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
    this.PointRadius=g_JSChartResource.MinuteInfo.PointRadius;
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
        if (showItem.Content) InfoDrawItem.Content=showItem.Content;
        if (showItem.Link) InfoDrawItem.Link=showItem.Link;
        if (showItem.Color) InfoDrawItem.Color=showItem.Color;
        if (showItem.BGColor) InfoDrawItem.BGColor=showItem.BGColor;

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
        if (showItem.Content) InfoDrawItem.Content=showItem.Content;
        if (showItem.Link) InfoDrawItem.Link=showItem.Link;
        if (showItem.Color) InfoDrawItem.Color=showItem.Color;
        if (showItem.BGColor) InfoDrawItem.BGColor=showItem.BGColor;

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
        this.Canvas.arc(item.Start.X, item.Start.Y, this.PointRadius, 0, 2 * Math.PI);
        this.Canvas.closePath();
        this.Canvas.fill();
    }

    this.DrawInfoText = function (item) 
    {
        var rtBorder = item.Border;
        var x = rtBorder.X, y = rtBorder.Y;
        if (item.BGColor) this.Canvas.fillStyle=item.BGColor
        else this.Canvas.fillStyle = this.TextBGColor;
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
        if (item.Color) this.Canvas.fillStyle=item.Color;
        else this.Canvas.fillStyle = this.TextColor;
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
    this.LastDataDrawType=0;    //0=画在最后一个数据上 1=画在指定索引上
    this.LastDataIndex=-1;

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

            var bDrawLastData=false;
            if (this.LastDataDrawType==1)
            {
                if (i==this.LastDataIndex) bDrawLastData=true;
            }
            else
            {
                if (i==this.Data.Data.length-1) bDrawLastData=true;
            }

            if (bDrawLastData) 
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

//分钟成交量
function ChartMinuteVolumBar() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;
    this.UnchangeColor=g_JSChartResource.UnchagneBarColor;  //平盘
    this.BarColorType=1;   //柱子颜色显示类型 0=红绿 1=红绿白

    this.CustomColor=g_JSChartResource.Minute.VolBarColor;
    this.YClose;    //前收盘
    this.Symbol;

    this.GetVolUnit=function()
    {
        var upperSymbol=this.Symbol?this.Symbol.toUpperCase():null;
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);
        return unit;
    }

    this.Draw = function () 
    {
        var isHScreen = (this.ChartFrame.IsHScreen === true)
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var yBottom = this.ChartFrame.GetYFromData(0);
        var yPrice = this.YClose; //上一分钟的价格
        var unit=this.GetVolUnit();
        if (this.CustomColor) this.Canvas.strokeStyle=this.CustomColor;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var item = this.Data.Data[i];
            if (!item || !item.Vol) continue;
    
            var y = this.ChartFrame.GetYFromData(item.Vol/unit);
            var x = this.ChartFrame.GetXFromIndex(i);
            if (x > chartright) break;
            //价格>=上一分钟价格 红色 否则绿色
            if (!this.CustomColor) this.Canvas.strokeStyle = this.GetMinuteBarColor(item.Close, yPrice);
            this.Canvas.beginPath();
            if (isHScreen) 
            {
                this.Canvas.moveTo(y, ToFixedPoint(x));
                this.Canvas.lineTo(yBottom, ToFixedPoint(x));
            }
            else 
            {
                this.Canvas.moveTo(ToFixedPoint(x), y);
                this.Canvas.lineTo(ToFixedPoint(x), yBottom);
            }
            this.Canvas.stroke();
            yPrice = item.Close;
        }
    }

    //连续交易成交量柱子颜色
    this.GetMinuteBarColor=function(price, yPrice)
    {
        if (this.BarColorType==1)   //通达信模式
        {
            if (price>yPrice) return this.UpColor;
            else if (price<yPrice) return this.DownColor;
            else return this.UnchangeColor;
        }
        else    //东方财富模式
        {
            return price >= yPrice ? this.UpColor:this.DownColor;
        }
    }
  
    this.GetMaxMin = function () 
    {
        var unit=this.GetVolUnit();
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = 0;
        range.Max = null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var item = this.Data.Data[i];
            if (!item || !item.Vol) continue;
            var value=item.Vol/unit;
            if (range.Max == null || range.Max < value) range.Max = value;
        }
    
        return range;
    }
  }

//MACD森林线 支持横屏
function ChartMACD() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartMACD';
    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;
    this.LineWidth=1;

    this.Draw = function () 
    {
        if (this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var isMinute=this.IsMinuteFrame();
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;

        var lineWidth=this.LineWidth;
        if (this.LineWidth==50) lineWidth=dataWidth;
        else if (lineWidth>dataWidth) lineWidth=dataWidth;

        this.Canvas.save();
        this.Canvas.lineWidth=lineWidth;

        var bFirstPoint = true;
        var drawCount = 0;
        var yBottom = this.ChartFrame.GetYFromData(0);
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        //for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            if (isMinute)
            {
                var x = this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            var xFix = parseInt(x.toString()) + 0.5;    //毛边修正
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix, yBottom);
            this.Canvas.lineTo(xFix, y);

            if (value >= 0) this.Canvas.strokeStyle = this.UpColor;
            else this.Canvas.strokeStyle = this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }

        this.Canvas.restore();
    }

    this.HScreenDraw = function () 
    {
        var isMinute=this.IsMinuteFrame();
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetTop()+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var yBottom = this.ChartFrame.GetYFromData(0);

        var lineWidth=this.LineWidth;
        if (this.LineWidth==50) lineWidth=dataWidth;
        else if (lineWidth>dataWidth) lineWidth=dataWidth;

        this.Canvas.save();
        this.Canvas.lineWidth=lineWidth;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        //for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            if (isMinute)
            {
                var x = this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.beginPath();
            this.Canvas.moveTo(yBottom, ToFixedPoint(x));
            this.Canvas.lineTo(y, ToFixedPoint(x));

            if (value >= 0) this.Canvas.strokeStyle = this.UpColor;
            else this.Canvas.strokeStyle = this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }

        this.Canvas.restore();
    }
}

//堆积柱状图
function ChartStackedBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartStackedBar";
    this.Data;      //{ Data:[ [bar1, bar2], [bar1,bar2 ] ] };
    this.BarName=[];
    this.BarColor=['rgb(255,165,0)',"rgb(95,158,160)"];
    this.LineWidth=1;
    this.BarType=0; //0=线段    1=K线宽度一致
    this.IsHScreen;

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;

        if (this.IsHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.BottomEx;
            var top=border.RightEx;
            var bottom=border.LeftEx;
        }
        else
        {
            var border=this.ChartFrame.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var top=border.TopEx;
            var bottom=border.BottomEx;
        }

        var isMinute=this.IsMinuteFrame();
       
        this.Canvas.save();
        if (this.BarType==1)
        {
           
        }
        else
        {
            if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
            var lineWidth=this.Canvas.lineWidth;
        }

        var yZero=this.ChartFrame.GetYFromData(0);
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var bars=this.Data.Data[i];
            if (!IFrameSplitOperator.IsNonEmptyArray(bars)) continue;

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            if (x>chartright) break;

            if (this.BarType==1)
            {
                if (dataWidth>=4)   //柱子太细就直接画竖线
                    this.DrawKBarItem(bars, x, left, right, top, bottom, yZero, dataWidth);
                else
                    this.DrawBarItem(bars, x, top, bottom, yZero, lineWidth);
            }  
            else
            {
                this.DrawBarItem(bars, x, top, bottom, yZero, lineWidth);
            }
                

        }
      
        this.Canvas.restore();
    }

    this.DrawKBarItem=function(aryBar, x, left, right, top, bottom,yZero,  barWidth)
    {
        var plusValue=0, yPlus=yZero;               //正数
        var negativeValue=0, yNegative= yZero;      //负数
        for(var i=0;i<aryBar.length;++i)
        {
            var item=aryBar[i];
            if (!IFrameSplitOperator.IsNumber(item)) continue;
            if(item==0) continue;

            this.Canvas.fillStyle=this.BarColor[i];
            if (item>0) 
            {
                plusValue+=item;
                var y=this.ChartFrame.GetYFromData(plusValue);
                var rtBar={Left: left, Top:y, Width:barWidth, Height:(yPlus-y)};
                yPlus=y;
            }
            else
            {
                negativeValue+=item;
                var y=this.ChartFrame.GetYFromData(negativeValue);
                var rtBar={Left:left, Top:y, Width:barWidth, Height:(yNegative-y)};
                yNegative=y;
            }


            if (this.IsHScreen)
                this.Canvas.fillRect(rtBar.Top,rtBar.Left, rtBar.Height, rtBar.Width);
            else 
                this.Canvas.fillRect(rtBar.Left, rtBar.Top, rtBar.Width, rtBar.Height);
        }
    }

    this.DrawBarItem=function(aryBar,x, top, bottom, yZero, lineWidth)
    {
        var x=ToFixedPoint(x);
        var plusValue=0, yPlus=yZero;               //正数
        var negativeValue=0, yNegative=yZero;      //负数

        for(var i=0;i<aryBar.length;++i)
        {
            var item=aryBar[i];
            if (!IFrameSplitOperator.IsNumber(item)) continue;
            if(item==0) continue;

            var line={};
            if (item>0) 
            {
                plusValue+=item;
                var y=this.ChartFrame.GetYFromData(plusValue);
                var line={X:x, Y:yPlus, X2:x, Y2:y};

                yPlus=y;
            }
            else
            {
                negativeValue+=item;
                var y=this.ChartFrame.GetYFromData(negativeValue);
                var line={X:x, Y:yNegative, X2:x, Y2:y};
                yNegative=y;
            }

            this.Canvas.beginPath();
            if (this.IsHScreen)
            {
                this.Canvas.moveTo(line.Y,line.X);
                this.Canvas.lineTo(line.Y2,line.X2);
            }
            else
            {
                this.Canvas.moveTo(line.X,line.Y);
                this.Canvas.lineTo(line.X2,line.Y2);
            }
            
            this.Canvas.strokeStyle=this.BarColor[i];
            this.Canvas.stroke();
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var bars=this.Data.Data[i];
            if (!bars || !IFrameSplitOperator.IsNonEmptyArray(bars)) continue;

            var plusValue=0;          //正数
            var negativeValue=0;      //负数
            for(var k=0;k<bars.length;++k)
            {
                var barValue=bars[k];
                if (!IFrameSplitOperator.IsNumber(barValue)) continue;
                if (barValue==0) continue;

                if (barValue>0) plusValue+=barValue;
                else if (barValue<0) negativeValue+=barValue;
            }

            if (range.Max==null) 
            {
                range.Max=plusValue;
                range.Min=negativeValue;
            }

            if (range.Max<plusValue) range.Max=plusValue;
            if (range.Min>negativeValue) range.Min=negativeValue;
        }

        return range;
    }

    
}

function ChartStepLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartStepLine';     //类名
    this.LineWidth=1;                    //线段宽度  
    this.DotLine;
    this.IsHScreen;
    this.IsDotLine=false;           //虚线

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;
        this.IsHScreen=(this.ChartFrame.IsHScreen===true);

        this.Canvas.save();
        this.DrawLine();
        this.Canvas.restore();
    }

    this.DrawLine=function()
    {
        var isMinute=this.IsMinuteFrame();
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;
        var lockRect=this.GetLockRect();

        if (this.IsHScreen)
        {
            var border=this.ChartBorder.GetHScreenBorder();
            var chartright=border.BottomEx;
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            if (lockRect) chartright=lockRect.Top;
        }
        else
        {
            var border=this.ChartBorder.GetBorder();
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            if (lockRect) chartright=lockRect.Left;
        }

        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        if (this.IsDotLine) this.Canvas.setLineDash(g_JSChartResource.DOTLINE.LineDash); //画虚线
        if (this.DotLine) this.Canvas.setLineDash(this.DotLine); //画虚线
        this.Canvas.strokeStyle=this.Color;
        var bFirstPoint=true;
        var drawCount=0;
        var prePoint={ X:null, Y:null };

        for(var i=this.Data.DataOffset; i>=0; --i)
        {
            var value=this.Data.Data[i];
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            var y=this.GetYFromData(value,false);
            var x=null;
            
            if (isMinute) x=this.ChartFrame.GetXFromIndex(0);
            else x=xOffset;

            this.Canvas.beginPath();
            if (this.IsHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
            else this.Canvas.moveTo(x,y);
            bFirstPoint=false;

            prePoint.Y=y;
            prePoint.X=x;
        }


        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            if (x>chartright) break;

            var value=this.Data.Data[i];
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            var y=this.GetYFromData(value,false);

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                if (this.IsHScreen) this.Canvas.moveTo(y,x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x,y);
                bFirstPoint=false;

                prePoint.X=x;
                prePoint.Y=y;
            }
            else
            {
                if (this.IsHScreen) 
                {
                    this.Canvas.lineTo(prePoint.Y,x)
                    this.Canvas.lineTo(y,x);
                }
                else 
                {
                    this.Canvas.lineTo(x,prePoint.Y)
                    this.Canvas.lineTo(x,y);
                }

                prePoint.X=x;
                prePoint.Y=y;
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
    }


}

////////////////////////////////////////////////////////////////////////////////
// 等待提示
function ChartSplashPaint() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.Font = g_JSChartResource.DefaultTextFont;            //字体
    this.TextColor = g_JSChartResource.DefaultTextColor;      //文本颜色
    this.IsEnableSplash = false;
    this.SplashTitle = '数据加载中.....';
    this.HQChart;

    this.EnableSplash=function(bEnable)
    {
        this.IsEnableSplash=bEnable;
        if (this.HQChart)
        {
            var event=this.HQChart.GetEnableSplashEvent();
            if (event)
            {
                var data={ Enable:bEnable };
                event.Callback(event,data,this);
            }
        }
    }

    this.SetTitle=function(title)
    {
        this.SplashTitle=title;
    }
  
    this.Draw = function () 
    {
        if (!this.IsEnableSplash) return;
    
        if (this.Frame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }
  
        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.SplashTitle, xCenter, yCenter);
    }
  
    this.HScreenDraw = function () //横屏
    {
        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;
    
        this.Canvas.save();
        this.Canvas.translate(xCenter, yCenter);
        this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
    
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.SplashTitle, 0, 0);
    
        this.Canvas.restore();
    }
}

//填充背景 支持横屏
function ChartBackground()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartBackground";
    this.Color=null;
    this.ColorAngle=0;  //0 竖向 1 横向
    this.IsDrawFirst = true;    //面积图在K线前面画,否则回挡住K线的
    this.IsHScreen=false;

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!this.Color) return;
        if (this.Color.length<=0) return;
        this.IsHScreen=(this.ChartFrame.IsHScreen===true);

        if (this.Color.length==2)
        {
            if (this.IsHScreen)
            {
                if (this.ColorAngle==0)
                {
                    var ptStart={ X:this.ChartBorder.GetRight(), Y:this.ChartBorder.GetTopEx() };
                    var ptEnd={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetTopEx() };
                }
                else
                {
                    var ptStart={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetTopEx() };
                    var ptEnd={ X:this.ChartBorder.GetLeft(), Y:this.ChartBorder.GetBottomEx() };
                }
            }
            else
            {
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
            }
            
            let gradient = this.Canvas.createLinearGradient(ptStart.X,ptStart.Y, ptEnd.X,ptEnd.Y);
            gradient.addColorStop(0, this.Color[0]);
            gradient.addColorStop(1, this.Color[1]);
            this.Canvas.fillStyle=gradient;
        }
        else if (this.Color.length==1)
        {
            this.Canvas.fillStyle=this.Color[0];
        }
        else
        {
            return;
        }

        if (this.Name=="DRAWGBK2" || this.Name=="KLINE_BG")
        {
            this.DrawRegion();
            return;
        }

        if (this.IsHScreen)
        {
            var left=this.ChartBorder.GetLeftEx();
            var top=this.ChartBorder.GetTop();
            var width=this.ChartBorder.GetWidthEx();
            var height=this.ChartBorder.GetHeight();
        }
        else
        {
            var left=this.ChartBorder.GetLeft();
            var top=this.ChartBorder.GetTopEx();
            var width=this.ChartBorder.GetWidth();
            var height=this.ChartBorder.GetHeightEx();
        }
        this.Canvas.fillRect(left, top,width, height);
    }

    this.DrawRegion=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var top=this.ChartBorder.GetTopEx();
        var bottom=this.ChartBorder.GetBottomEx();
        if (this.IsHScreen)
        {
            top=this.ChartBorder.GetRightEx();
            bottom=this.ChartBorder.GetLeftEx();
        }

        var aryPoint=[];    //点坐标
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var value=this.Data.Data[i];
            aryPoint[i]=null;
            if (!IFrameSplitOperator.IsNumber(value) || value<=0) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value.Value);

            if (this.IsHScreen)
                aryPoint[i]={ Line:{ X:bottom, Y:x }, Line2:{ X:top, Y:x } };
            else
                aryPoint[i]={ Line:{ X:x, Y:top }, Line2:{ X:x, Y:bottom } };
        }

        this.DrawBG(aryPoint);
    }

    this.DrawBG=function(aryPoint)
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var halfWidth=(distanceWidth+dataWidth)/2;
        var firstPoint=true;
        var pointCount=0;
        var aryLine2=[];
        var color=null;
        for(var i in aryPoint)
        {
            var item=aryPoint[i];
            if (!item || (color && item.Color!=color) )
            {
                if (pointCount>0)
                {
                    for(var j=aryLine2.length-1; j>=0; --j)
                    {
                        var item2=aryLine2[j];
                        if (this.IsHScreen)
                        {
                            this.Canvas.lineTo(item2.Line2.X, item2.Line2.Y+halfWidth);
                            this.Canvas.lineTo(item2.Line2.X, item2.Line2.Y-halfWidth);
                        }
                        else
                        {
                            this.Canvas.lineTo(item2.Line2.X+halfWidth, item2.Line2.Y);
                            this.Canvas.lineTo(item2.Line2.X-halfWidth, item2.Line2.Y);
                        }
                    }
                    this.Canvas.closePath();
                    this.Canvas.fill();
                }

                firstPoint=true;
                pointCount=0;
                aryLine2=[];
                color=null;
            }

            if (!item) continue;

            if (firstPoint)
            {
                this.Canvas.beginPath();
                if (this.IsHScreen)
                {
                    this.Canvas.moveTo(item.Line.X, item.Line.Y-halfWidth);
                    this.Canvas.lineTo(item.Line.X, item.Line.Y+halfWidth);
                }
                else
                {
                    this.Canvas.moveTo(item.Line.X-halfWidth, item.Line.Y);
                    this.Canvas.lineTo(item.Line.X+halfWidth, item.Line.Y);
                }
                firstPoint=false;
                color=item.Color;
            }
            else
            {
                if (this.IsHScreen)
                {
                    this.Canvas.lineTo(item.Line.X, item.Line.Y-halfWidth);
                    this.Canvas.lineTo(item.Line.X, item.Line.Y+halfWidth);
                }
                else
                {
                    this.Canvas.lineTo(item.Line.X-halfWidth, item.Line.Y);
                    this.Canvas.lineTo(item.Line.X+halfWidth, item.Line.Y);
                }
            }

            aryLine2.push(item);
            ++pointCount;
        }

        if (pointCount>0)
        {
            for(var j=aryLine2.length-1; j>=0; --j)
            {
                var item2=aryLine2[j];
                if (this.IsHScreen)
                {
                    this.Canvas.lineTo(item2.Line2.X, item2.Line2.Y+halfWidth);
                    this.Canvas.lineTo(item2.Line2.X, item2.Line2.Y-halfWidth);
                }
                else
                {
                    this.Canvas.lineTo(item2.Line2.X+halfWidth, item2.Line2.Y);
                    this.Canvas.lineTo(item2.Line2.X-halfWidth, item2.Line2.Y);
                }
                
            }
            this.Canvas.closePath();
            this.Canvas.fill();
        }
    }

    this.GetMaxMin=function()
    {
        return { Min:null, Max:null };
    }
}

//填充部分背景 支持横屏
function ChartBackgroundDiv()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartBackgroundDiv";

    this.AryColor;
    this.ColorType=0;

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryColor)) return;

        if (!this.Data || !this.Data.Data) return;

        var bHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;
        var border,xOffset, chartright, yTop, yBottom;

        if (bHScreen) 
        {
            border=this.ChartBorder.GetHScreenBorder();
            xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            chartright=border.BottomEx;
            yTop=border.LeftEx;
            yBottom=border.RightEx;
        }
        else 
        {
            border=this.ChartBorder.GetBorder();
            xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            chartright=border.RightEx;
            yTop=border.TopEx;
            yBottom=border.BottomEx;
        }

        var rtBG=null //{ Left:null, Top:null, Right:null, Bottom:null };
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var item=this.Data.Data[i];

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;

            if (!item)
            {
                if (rtBG) this.DrawDiv(rtBG,bHScreen);

                rtBG=null;
            }
            else
            {
                var y=yTop;
                var y2=yBottom;
                if (IFrameSplitOperator.IsNonEmptyArray(item.AryValue))
                {
                    var value=this.ChartFrame.GetYFromData(item.AryValue[0]);
                    var value2=this.ChartFrame.GetYFromData(item.AryValue[1]);
                    y=Math.min(value, value2);
                    y2=Math.max(value, value2);
                }

                if (bHScreen)
                {
                    if (!rtBG)
                    {
                        rtBG={ Left:y, Right:y2, Top:left, Bottom:right };
                    }
                    else
                    {
                        rtBG.Bottom=right;
                        if (rtBG.Left>y) rtBG.Left=y;
                        if (rtBG.Right<y2) rtBG.Right=y2;
                    }
                }
                else
                {
                    if (!rtBG)
                    {
                        rtBG={ Left:left, Right:right, Top:y, Bottom:y2 };
                    }
                    else
                    {
                        rtBG.Right=right;
                        if (rtBG.Top>y) rtBG.Top=y;
                        if (rtBG.Bottom<y2) rtBG.Bottom=y2;
                    }
                }
            }
        }
    }

    this.DrawDiv=function(rtBG, bHScreen)
    {
        if (this.ColorType==2)          //2=用COLOR1画框线
        {
            this.Canvas.strokeStyle = this.AryColor[0];
            this.Canvas.strokeRect(ToFixedPoint(rtBG.Left),ToFixedPoint(rtBG.Top),ToFixedRect(rtBG.Right-rtBG.Left),ToFixedRect(rtBG.Bottom-rtBG.Top));
        }
        else if (this.ColorType==3)     //3=用COLOR1画框线,用COLOR2填充
        {
            this.Canvas.fillStyle=this.AryColor[1];
            this.Canvas.fillRect(ToFixedRect(rtBG.Left),ToFixedRect(rtBG.Top),ToFixedRect(rtBG.Right-rtBG.Left),ToFixedRect(rtBG.Bottom-rtBG.Top));

            this.Canvas.strokeStyle = this.AryColor[0];
            this.Canvas.strokeRect(ToFixedPoint(rtBG.Left),ToFixedPoint(rtBG.Top),ToFixedRect(rtBG.Right-rtBG.Left),ToFixedRect(rtBG.Bottom-rtBG.Top));
        }
        else if (this.ColorType==0 || this.ColorType==1)      //0=上下渐进 1=左右渐进
        {
            var gradient=null;
            if (bHScreen)
            {
                if (this.ColorType==0)
                    gradient = this.Canvas.createLinearGradient(rtBG.Left,rtBG.Top, rtBG.Right,rtBG.Top);
                else 
                    gradient = this.Canvas.createLinearGradient(rtBG.Left,rtBG.Top, rtBG.Left,rtBG.Bottom); 
            }
            else
            {
                if (this.ColorType==0)
                    gradient = this.Canvas.createLinearGradient(rtBG.Left,rtBG.Top, rtBG.Left,rtBG.Bottom);
                else 
                    gradient = this.Canvas.createLinearGradient(rtBG.Left,rtBG.Top, rtBG.Right,rtBG.Top);
            }
    
            gradient.addColorStop(0.5, this.AryColor[0]);
            gradient.addColorStop(1, this.AryColor[1]);
    
            this.Canvas.fillStyle=gradient;
            this.Canvas.fillRect(ToFixedRect(rtBG.Left),ToFixedRect(rtBG.Top),ToFixedRect(rtBG.Right-rtBG.Left),ToFixedRect(rtBG.Bottom-rtBG.Top));
        }
        else
        {
            return;
        }
    }
}

//锁  支持横屏
function ChartLock()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartLock";
    this.AryData=null;
    this.LockRect=null; //上锁区域

    this.LockCount = 20; // 锁最新的几个数据
    this.BGColor = g_JSChartResource.IndexLock.BGColor;
    this.TextColor = g_JSChartResource.IndexLock.TextColor;
    this.Font = g_JSChartResource.IndexLock.Font;
    this.Title = g_JSChartResource.IndexLock.Title;
    this.LockID;        //锁ID
    this.Callback;      //回调
    this.IndexName;     //指标名字
    this.IndexID;       //指标ID

    this.MinWidthText="  付费指标  "

    this.SetData=function(aryData)
    {
        this.AryData=aryData;

        if (IFrameSplitOperator.IsNonEmptyArray(this.AryData))
        {
            var item=this.AryData[0].Data;   //取第一个锁

            this.LockCount = item.LockCount; 
            this.BGColor = item.BGColor
            this.TextColor = item.TextColor
            this.Font = item.Font
            this.Title = item.Title
            this.LockID=item.LockID;            //锁ID
            this.Callback=item.Callback;        //回调
            this.IndexName=item.IndexName;      //指标名字
            this.IndexID=item.IndexID;          //指标ID
        }
    }

    this.CalculateTextSize=function(aryText, defaultFont, out)
    {
        if (!out || !IFrameSplitOperator.IsNonEmptyArray(aryText)) return false;

        this.Canvas.font=defaultFont;
        var defaultLineHeight=this.Canvas.measureText("擎").width; //行高
        var lineHeight=defaultLineHeight;
        var height=0, width=0;
        out.AryText=[];
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            if (!item || (!item.Text && !item.Image)) continue;
            if (item.Image)
            {
                textWidth=item.Image.Width;
                lineHeight=item.Image.Height;
            }
            else
            {
                if (item.Font) 
                {
                    this.Canvas.font=item.Font;
                    lineHeight=this.Canvas.measureText("擎").width;
                }
                else 
                {
                    this.Canvas.font=defaultFont;
                    lineHeight=defaultLineHeight;
                }
                var textWidth=this.Canvas.measureText(item.Text).width;
            }
           
            var lineItem={ Text:item.Text, Width:textWidth, Height:lineHeight, Color:item.Color, TextMargin:{ Top:0, Bottom:0, Left:0, Right:0 }, YOffset:0 };
            if (IFrameSplitOperator.IsNumber(item.YOffset)) lineItem.YOffset=item.YOffset;
            if (item.Font) lineItem.Font=item.Font;
            if (IFrameSplitOperator.IsNumber(item.Align)) lineItem.Align=item.Align;    //左右对齐 0=左 1=中 2=右
            if (item.Image) lineItem.Image=item.Image;
            if (item.TextMargin)
            {
                var margin=item.TextMargin;
                if (IFrameSplitOperator.IsNumber(margin.Top)) lineItem.TextMargin.Top=margin.Top;
                if (IFrameSplitOperator.IsNumber(margin.Bottom)) lineItem.TextMargin.Bottom=margin.Bottom;
                if (IFrameSplitOperator.IsNumber(margin.Left)) lineItem.TextMargin.Left=margin.Left;
                if (IFrameSplitOperator.IsNumber(margin.Right)) lineItem.TextMargin.Right=margin.Right;
            }

            lineItem.Height+=lineItem.TextMargin.Top+lineItem.TextMargin.Bottom;
            lineItem.Width+=lineItem.TextMargin.Left+lineItem.TextMargin.Right;

            if (width<lineItem.Width) width=lineItem.Width;

            out.AryText.push(lineItem);
            height+=lineItem.Height;
        }

        out.Width=width;
        out.Height=height;

        return true;
    }

    this.Draw=function(bDraw)
    {
        this.LockRect=null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryData)) return;

        var bHScreen=this.ChartFrame.IsHScreen;
        var bMinute=this.IsMinuteFrame();
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;
        var border=this.ChartFrame.GetBorder();
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

        var kData=this.ChartFrame.Data;
        var left=xOffset;
        if (kData && IFrameSplitOperator.IsNonEmptyArray(kData.Data))
        {
            for(var i=kData.DataOffset,j=0;i<kData.Data.length-this.LockCount && j<xPointCount-this.LockCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var kItem=kData.Data[i];
                if (kItem.Open==null || kItem.High==null || kItem.Low==null || kItem.Close==null) continue;

                if (bMinute)
                {
                    left=this.ChartFrame.GetXFromIndex(j);
                }
                else
                {
                    left=xOffset;
                    var right=xOffset+dataWidth;
                    if (right>chartright) break;
                }
            }
        }

        this.Canvas.font=this.Font;
        var minWidth=this.Canvas.measureText(this.MinWidthText).width;

        var aryText=null;
        if (Array.isArray(this.Title)) aryText=this.Title;
        else aryText=[{Text:this.Title}];
            
        var outSize={ };
        if (!this.CalculateTextSize(aryText, this.Font, outSize)) outSize=null;;
        if (outSize && outSize.Width+8>minWidth) minWidth=outSize.Width+4;  //确保文字可以显示

        if (bHScreen)
        {
            var rtBG={ Left:border.Left, Right:border.RightEx, Top:left, Bottom:border.Bottom };
            rtBG.Width=rtBG.Right-rtBG.Left;
            rtBG.Height=rtBG.Bottom-rtBG.Top;
            if (rtBG.Height<minWidth)
            {
                rtBG.Height=minWidth;
                rtBG.Top=rtBG.Bottom-rtBG.Height;
            }
            this.LockRect=rtBG;    //保存上锁区域

            if (bDraw)
            {
                var bgColor=this.SetFillStyle(this.BGColor, rtBG.Left, rtBG.Top, rtBG.Right, rtBG.Top);
                this.Canvas.fillStyle =bgColor;
                this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);
            }
        }
        else
        {
            var rtBG={ Left:left, Right:border.RightEx, Top:border.TopTitle, Bottom:border.Bottom };
            rtBG.Width=rtBG.Right-rtBG.Left;
            rtBG.Height=rtBG.Bottom-rtBG.Top;
            if (rtBG.Width<minWidth)
            {
                rtBG.Width=minWidth;
                rtBG.Left=rtBG.Right-rtBG.Width;
            }
            this.LockRect=rtBG;    //保存上锁区域

            if (bDraw)
            {
                var bgColor=this.SetFillStyle(this.BGColor, rtBG.Left, rtBG.Top, rtBG.Left, rtBG.Bottom);   //上下渐变
                this.Canvas.fillStyle =bgColor;
                this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);
            }
        }

        if (!bDraw) return;
        if (!outSize) return;

        this.Canvas.textAlign='left';
        this.Canvas.textBaseline='bottom';
        this.Canvas.font = this.Font;

        if (bHScreen)
        {
            var top=rtBG.Top+(rtBG.Height-outSize.Width)/2;
            if (outSize.Width>rtBG.Height) top=rtBG.Bottom-outSize.Width;
            var left=rtBG.Left+(rtBG.Width-outSize.Height)/2;
            this.Canvas.save(); 
            this.Canvas.translate(left, top);
            this.Canvas.rotate(90 * Math.PI / 180);
            var left=0,top=0;
        }
        else
        {
            var left=rtBG.Left+(rtBG.Width-outSize.Width)/2;
            if (outSize.Width>rtBG.Width) left=rtBG.Right-outSize.Width;
            var top=rtBG.Top+(rtBG.Height-outSize.Height)/2;
        }

        var yText=top, xText=left;
        for(var i=0;i<outSize.AryText.length;++i)
        {
            var item=outSize.AryText[i];
            xText=left;
            if (item.Image)
            {
                if (item.Align===1)
                {
                    if (outSize.Width>item.Width) xText+=(outSize.Width-item.Width)/2;
                }

                this.Canvas.drawImage(item.Image.Data, xText, yText, item.Image.Width, item.Image.Height);

                yText+=item.Height;
            }
            else
            {
                if (item.Color)  this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=this.TextColor;

                if (item.Font) this.Canvas.font = item.Font;
                else this.Canvas.font = this.Font;

                yText+=item.Height;
               
                if (item.Align===1)
                {
                    if (outSize.Width>item.Width) xText+=(outSize.Width-item.Width)/2;
                }

                this.Canvas.fillText(item.Text, xText, yText+item.YOffset);
            }
        }

        if (bHScreen)  this.Canvas.restore();
    }

    //x,y是否在上锁区域
    this.GetTooltipData=function(x,y,tooltip)
    {
        if (!this.LockRect) return false;

        if (Path2DHelper.PtInRect(x,y,this.LockRect))
        {
            tooltip.Data={ ID:this.LockID, Callback:this.Callback, IndexName:this.IndexName, IndexID:this.IndexID, Data:this.AryData };
            tooltip.ChartPaint=this;
            return true;
        }
        
        return false;
    }
}

//通达信语法 VOLSTICK 支持横屏
function ChartVolStick() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;
    this.HistoryData;               //历史数据
    this.KLineDrawType = 0;
    this.BarType;                   //柱子状态 1=实心 0=空心 2=涨实跌空 如果设置了这个属性， 属性KLineDrawType无效
    this.ClassName = 'ChartVolStick';
    this.MinBarWidth=g_JSChartResource.MinKLineBarWidth; //最小的柱子宽度

    this.Draw = function () 
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;
        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;
        var yBottom = this.ChartFrame.GetYFromData(0);
        var isMinute=this.IsMinuteFrame();

        this.Canvas.save();
        if (dataWidth >= this.MinBarWidth) 
        {   //只有K线, 分时图dataWidth=1
            yBottom = ToFixedRect(yBottom);
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;
                if (value===0) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartright) break;

                var y = this.ChartFrame.GetYFromData(value);
                var barColor=this.GetBarColor(kItem);
                var bUp = barColor.IsUp;

                //高度调整为整数
                var height = ToFixedRect(Math.abs(yBottom - y)>=1 ? yBottom - y : 1);
                y = yBottom - height;
                var bSolidBar=this.IsSolidBar(bUp); //实心柱子
                if (bSolidBar)
                {
                    this.Canvas.fillStyle=barColor.Color;
                    this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(dataWidth), height);
                }
                else
                {
                    this.Canvas.strokeStyle=barColor.Color;
                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(y), ToFixedRect(dataWidth), height);
                    this.Canvas.stroke();
                }
            }
        }
        else    //太细了直接话线
        {
            var preKItem=null;
            var barColor=null;
            this.Canvas.lineWidth=1;
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;

                var y = this.ChartFrame.GetYFromData(value);

                if (isMinute)
                {
                    var x=this.ChartFrame.GetXFromIndex(j);
                }
                else
                {
                    var left=xOffset;
                    var right=xOffset+dataWidth;
                    var x=left+(right-left)/2;
                }

                if (x > chartright) break;

                if (isMinute) barColor=this.GetMinuteBarColor(kItem,preKItem);    //分时图颜色单独计算
                else barColor=this.GetBarColor(kItem);
                
                this.Canvas.strokeStyle=barColor.Color;

                //var x = this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), y);
                this.Canvas.lineTo(ToFixedPoint(x), yBottom);
                this.Canvas.stroke();

                preKItem=kItem;
            }
        }

        this.Canvas.restore();
    }

    this.GetBarColor=function(kItem)
    {
        if (kItem.Close>=kItem.Open) return { Color:this.UpColor, IsUp:true };  //颜色, 是否是上涨
        else return { Color:this.DownColor, IsUp:false };
    }

    this.GetMinuteBarColor=function(kItem, preItem)
    {
        var prePrice=kItem.YClose;
        if (preItem) prePrice=preItem.Close;

        if (kItem.Close>=prePrice) return { Color:this.UpColor, IsUp:true };  //颜色, 是否是上涨
        else return { Color:this.DownColor, IsUp:false };
    }

     //true=实心 false=空心
     this.IsSolidBar=function(bUp)
     {
         var bSolidBar=true; //实心柱子
 
         if (this.BarType===0 || this.BarType===1 || this.BarType===2)
         {
             if (this.BarType===0)   //空心
                 bSolidBar=false;
             else if (this.BarType===2)  //涨实跌空
                 bSolidBar=bUp;
         }
         else
         {
             if (this.KLineDrawType==6) //完全空心柱
                 bSolidBar=false;    
             else if (bUp && (this.KLineDrawType==1 || this.KLineDrawType==2 || this.KLineDrawType==3)) //空心柱子
                 bSolidBar=false;
         }
 
         return bSolidBar;
     }

    this.HScreenDraw = function () //横屏画法
    {
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartBottom = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var isMinute=this.IsMinuteFrame();
        var yBottom = this.ChartFrame.GetYFromData(0);

        if (dataWidth >= this.MinBarWidth) 
        {
            yBottom = ToFixedRect(yBottom);
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartBottom) break;

                var y = this.ChartFrame.GetYFromData(value);
                var barColor=this.GetBarColor(kItem);
                var bUp=barColor.IsUp;

                //高度调整为整数
                var height = ToFixedRect(y - yBottom);
                var bSolidBar=this.IsSolidBar(bUp); //实心柱子

                if (bSolidBar)
                {
                    this.Canvas.fillStyle=barColor.Color;
                    this.Canvas.fillRect(yBottom, ToFixedRect(left), height, ToFixedRect(dataWidth));
                }
                else
                {
                    this.Canvas.strokeStyle=barColor.Color;
                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(yBottom), ToFixedPoint(left), height, ToFixedRect(dataWidth));
                    this.Canvas.stroke();
                }
            }
        }
        else    //太细了直接话线
        {
            var preKItem=null;
            var barColor=null;
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;

                var y = this.ChartFrame.GetYFromData(value);

                if (isMinute)
                {
                    var x=this.ChartFrame.GetXFromIndex(j);
                }
                else
                {
                    var left=xOffset;
                    var right=xOffset+dataWidth;
                    var x=left+(right-left)/2;
                }
                if (x > chartBottom) break;

                if (isMinute) barColor=this.GetMinuteBarColor(kItem,preKItem);    //分时图颜色单独计算
                else barColor=this.GetBarColor(kItem);
                
                this.Canvas.strokeStyle=barColor.Color;

                //var x = this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(y, ToFixedPoint(x));
                this.Canvas.lineTo(yBottom, ToFixedPoint(x));
                this.Canvas.stroke();

                preKItem=kItem;
            }
        }
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = { Min:null, Max:null };
        
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (!IFrameSplitOperator.IsNumber(range.Max) || range.Max<value) range.Max=value;
            if (!IFrameSplitOperator.IsNumber(range.Min) || range.Min>value) range.Min=value
        }

        if (range.Max>0 && range.Min>0) range.Min=0;
        else if (range.Max<0 && range.Min<0) range.Max=0;

        return range;
    }
}

function ChartText() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.TextFont = "14px 微软雅黑";
  
    this.Draw = function () 
    {
        if (this.ChartFrame.IsMinSize) return;
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }
  
        if (!this.Data || !this.Data.Data) return;
    
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;
  
        for (var i in this.Data.Data) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;
    
            var price = value.Value;
            var position = value.Position;
    
            if (position == 'Left') {
            var x = this.ChartFrame.GetXFromIndex(0);
            var y = this.ChartFrame.GetYFromData(price);
    
            if (x > chartright) continue;
    
            this.Canvas.textAlign = 'left';
            this.Canvas.textBaseline = 'middle';
            this.Canvas.fillStyle = value.Color;
            this.Canvas.font = this.TextFont;
            this.Canvas.fillText(value.Message, x, y);
            }
        }
    }
  
    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;
    
        if (!this.Data || !this.Data.Data) return range;
    
        for (var i in this.Data.Data) 
        {
            var data = this.Data.Data[i];
            if (data == null || isNaN(data.Value)) continue;
    
            var value = data.Value;
    
            if (range.Max == null) range.Max = value;
            if (range.Min == null) range.Min = value;
    
            if (range.Max < value) range.Max = value;
            if (range.Min > value) range.Min = value;
        }
    
        return range;
    }
}

/*  水平面积 只有1个数据
    Data 数据结构 
    Value, Value2  区间最大最小值
    Color=面积的颜色
    Title=标题 TitleColor=标题颜色
    支持横屏
*/
function ChartStraightArea() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.Color = "rgb(255,193,37)";   //线段颜色
    this.Font = '11px 微软雅黑';
  
    this.Draw = function () 
    {
        if (this.ChartFrame.IsMinSize) return;
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }
  
        if (!this.Data || !this.Data.Data) return;
  
        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }
  
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var left = this.ChartBorder.GetLeft();
        var xPointCount = this.ChartFrame.XPointCount;
  
        var xRight = this.ChartFrame.GetXFromIndex(xPointCount - 1);
  
        //画背景
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color == null) continue;
    
            let valueMax = Math.max(item.Value, item.Value2);
            let valueMin = Math.min(item.Value, item.Value2);
    
            let yTop = this.ChartFrame.GetYFromData(valueMax);
            let yBottom = this.ChartFrame.GetYFromData(valueMin);
    
            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(yTop), ToFixedRect(xRight - left), ToFixedRect(yBottom - yTop));
        }
  
        for (let i in this.Data.Data)
        {
            let item = this.Data.Data[i];
            if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color == null) continue;
    
            let valueMax = Math.max(item.Value, item.Value2);
            let valueMin = Math.min(item.Value, item.Value2);
    
            let yTop = this.ChartFrame.GetYFromData(valueMax);
            let yBottom = this.ChartFrame.GetYFromData(valueMin);
    
            if (item.Title && item.TitleColor) 
            {
                let x = xRight;
                if (item.Align == 'left') 
                {
                    this.Canvas.textAlign = 'left';
                    x = left;
                }
                else 
                {
                    this.Canvas.textAlign = 'right';
                    x = xRight;
                }
        
                this.Canvas.textBaseline = 'middle';
                this.Canvas.fillStyle = item.TitleColor;
                this.Canvas.font = this.Font;
                let y = yTop + (yBottom - yTop) / 2;
                this.Canvas.fillText(item.Title, x, y);
            }
        }
    }
  
    this.HScreenDraw = function () 
    {
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTop();
        var height = this.ChartBorder.GetHeight();
  
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color == null) continue;
    
            let valueMax = Math.max(item.Value, item.Value2);
            let valueMin = Math.min(item.Value, item.Value2);
    
            var yTop = this.ChartFrame.GetYFromData(valueMax);
            var yBottom = this.ChartFrame.GetYFromData(valueMin);
    
            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(yBottom), ToFixedRect(top), ToFixedRect(yTop - yBottom), ToFixedRect(height));
    
            if (item.Title && item.TitleColor) 
            {
                var xText = yTop + (yBottom - yTop) / 2;
                var yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
        
                this.Canvas.textAlign = 'right';
                this.Canvas.textBaseline = 'middle';
                this.Canvas.fillStyle = item.TitleColor;
                this.Canvas.font = this.Font;
                this.Canvas.fillText(item.Title, 0, -2);
        
                this.Canvas.restore();
            }
        }
    }
  
    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;
    
        if (!this.Data || !this.Data.Data) return range;
  
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
    
            let valueMax = Math.max(item.Value, item.Value2);
            let valueMin = Math.min(item.Value, item.Value2);
    
            if (range.Max == null) range.Max = valueMax;
            if (range.Min == null) range.Min = valueMin;
    
            if (range.Max < valueMax) range.Max = valueMax;
            if (range.Min > valueMin) range.Min = valueMin;
        }
        return range;
    }
}

// DRAWBAND 面积图 支持横屏
function ChartBand() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.IsDrawFirst = true;
    this.ClassName="ChartBand";
    this.FirstColor = g_JSChartResource.Index.LineColor[0];
    this.SecondColor = g_JSChartResource.Index.LineColor[1];
  
    this.Draw = function ()
    {
        if (this.ChartFrame.IsMinSize) return;
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        var isHScreen=this.ChartFrame.IsHScreen;
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xPointCount = this.ChartFrame.XPointCount;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        var x = 0;
        var y = 0;
        var y2 = 0;
        var firstlinePoints = [];
        var secondlinePoints = [];
        var lIndex = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var value = this.Data.Data[i];
            if (value == null || value.Value == null || value.Value2 == null) continue;
            x = this.ChartFrame.GetXFromIndex(j);
            y = this.ChartFrame.GetYFromData(value.Value);
            y2 = this.ChartFrame.GetYFromData(value.Value2);

            if (isHScreen)
            {
                firstlinePoints[lIndex] = { x: y, y: x };
                secondlinePoints[lIndex] = { x: y2, y: x };
            }
            else
            {
                firstlinePoints[lIndex] = { x: x, y: y };
                secondlinePoints[lIndex] = { x: x, y: y2 };
            }
            
            lIndex++;
        }

        if (firstlinePoints.length>1 && secondlinePoints.length>1)
        {
            this.DrawBand(firstlinePoints, secondlinePoints);
        }
    }

    this.ClipTop=function(aryFrist)
    {
        var isHScreen=this.ChartFrame.IsHScreen;
        this.Canvas.beginPath();
        for(var i=0;i<aryFrist.length;++i)
        {
            if (i == 0)
                this.Canvas.moveTo(aryFrist[i].x, aryFrist[i].y);
            else
                this.Canvas.lineTo(aryFrist[i].x, aryFrist[i].y);
        }
        var ptStart=aryFrist[0];
        var ptEnd=aryFrist[aryFrist.length-1];

       
        if (isHScreen)
        {
            var xLeft=this.ChartBorder.GetRightEx();
            this.Canvas.lineTo(xLeft, ptEnd.y);
            this.Canvas.lineTo(xLeft, ptStart.y);
        }
        else
        {
            var yTop=this.ChartBorder.GetTopEx();
            this.Canvas.lineTo(ptEnd.x, yTop);
            this.Canvas.lineTo(ptStart.x, yTop);
        }
       
        this.Canvas.closePath();
        this.Canvas.clip();
    }

    this.ClipBottom=function(aryFrist)
    {
        var isHScreen=this.ChartFrame.IsHScreen;
        this.Canvas.beginPath();
        for(var i=0;i<aryFrist.length;++i)
        {
            if (i == 0)
                this.Canvas.moveTo(aryFrist[i].x, aryFrist[i].y);
            else
                this.Canvas.lineTo(aryFrist[i].x, aryFrist[i].y);
        }
        var ptStart=aryFrist[0];
        var ptEnd=aryFrist[aryFrist.length-1];

        if (isHScreen)
        {
            var xLeft=this.ChartBorder.GetLeftEx();
            this.Canvas.lineTo(xLeft, ptEnd.y);
            this.Canvas.lineTo(xLeft, ptStart.y);
        }
        else
        {
            var yBottom=this.ChartBorder.GetBottomEx();
            this.Canvas.lineTo(ptEnd.x, yBottom);
            this.Canvas.lineTo(ptStart.x, yBottom);
        }
      
        this.Canvas.closePath();
        //this.Canvas.fillStyle = "rgb(255,0,0)";
        //this.Canvas.fill();
        this.Canvas.clip();
    }

    this.DrawArea=function(aryFrist, arySecond, clrArea)
    {
        this.Canvas.beginPath();
        for(var i=0;i<aryFrist.length;++i)
        {
            if (i == 0)
                this.Canvas.moveTo(aryFrist[i].x, aryFrist[i].y);
            else
                this.Canvas.lineTo(aryFrist[i].x, aryFrist[i].y);
        }

        for (var i = arySecond.length-1; i >= 0; --i)
        {
            this.Canvas.lineTo(arySecond[i].x, arySecond[i].y);
        }  
        this.Canvas.closePath();
        this.Canvas.fillStyle = clrArea;
        this.Canvas.fill();
    }

    this.DrawBand=function(aryFrist, arySecond)
    {
        if (this.FirstColor)
        {
            this.Canvas.save();
            this.ClipTop(aryFrist);
            this.DrawArea(aryFrist, arySecond, this.FirstColor);
            this.Canvas.restore();
        }
       
        if (this.SecondColor)
        {
            this.Canvas.save();
            this.ClipBottom(aryFrist);
            this.DrawArea(aryFrist, arySecond, this.SecondColor);
            this.Canvas.restore();
        }
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null || value.Value == null || value.Value2 == null) continue;
            var maxData = value.Value > value.Value2 ? value.Value : value.Value2;
            var minData = value.Value < value.Value2 ? value.Value : value.Value2;
            if (range.Max == null)
            range.Max = maxData;
            else if (range.Max < maxData)
            range.Max = maxData;
    
            if (range.Min == null)
            range.Min = minData;
            else if (range.Min > minData)
            range.Min = minData;
        }
        return range;
    }
}

//分钟线叠加 支持横屏
function ChartOverlayMinutePriceLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.Color = "rgb(65,105,225)";
    this.MainData;                  //主图数据
  
    this.Name = "ChartOverlayMinutePriceLine";
    this.Title;
    this.Symbol;                    //叠加的股票代码
    this.YClose;                    //叠加的股票前收盘
    this.Status=OVERLAY_STATUS_ID.STATUS_NONE_ID;
    this.OverlayType=0; //叠加方式 0=百分比叠加  1=绝对叠加
  
    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }
  
        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var minuteCount = this.ChartFrame.MinuteCount;
  
        var yClose=null, mainYClose=null;
        var bFirstPoint = true;
        var drawCount = 0, showValue=0, pointCount=0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var item=this.Data.Data[i];
            if (item && IFrameSplitOperator.IsNumber(item.Close))
            {
                if (bFirstPoint)    //百分比使用每天的昨收计算
                {
                    yClose=item.YClose;
                    var minItem=this.MainData.Data[i];
                    mainYClose=minItem.YClose;
                }

                var value=item.Close;
                showValue=value;           //绝对叠加
                if (this.OverlayType==0) showValue=value/yClose*mainYClose;   //百分比

                var x = this.ChartFrame.GetXFromIndex(j);
                var y = this.ChartFrame.GetYFromData(showValue, false);
            
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
  
            ++pointCount;

            if (pointCount>=minuteCount) //上一天的数据和这天地数据线段要断开
            {
                bFirstPoint=true;
                pointCount=0;
                if (drawCount>0) this.Canvas.stroke();
                drawCount=0;
            }
        }
  
        if (drawCount > 0) this.Canvas.stroke();
    }
  
    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range={ Min:null, Max:null };
        
        var minuteCount=this.ChartFrame.MinuteCount;
        var yClose=null, mainYClose=null;
        var bFirstPoint=true;
        var pointCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var item=this.Data.Data[i];
            if (!item || !IFrameSplitOperator.IsNumber(item.Close)) 
            {
                ++pointCount;
                continue;
            }

            if (bFirstPoint)
            {
                yClose=item.YClose;
                var minItem=this.MainData.Data[i];
                mainYClose=minItem.YClose;
                bFirstPoint=false;
            }

            var value=item.Close;
            if (this.OverlayType==0) value=value/yClose*mainYClose;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;

            ++pointCount;

            if (pointCount>=minuteCount)
            {
                bFirstPoint=true;
                pointCount=0;
            }
        }
  
        return range;
    }
}

//线段 多数据(一个X点有多条Y数据) 支持横屏
function ChartLineMultiData() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.Color = "rgb(255,193,37)"; //线段颜色
  
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
  
        var bFirstPoint = true;
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var aryValue = this.Data.Data[i];
            if (aryValue == null) continue;
    
            var x = this.ChartFrame.GetXFromIndex(j);
            if (x > chartright) break;
  
            for (var index in aryValue) 
            {
                var value = aryValue[index].Value;
                var y = this.ChartFrame.GetYFromData(value);
  
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
        }
  
        if (drawCount > 0) this.Canvas.stroke();
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
            var aryValue = this.Data.Data[i];
            if (aryValue == null) continue;
    
            for (var index in aryValue) 
            {
                var value = aryValue[index].Value;
                if (range.Max == null) range.Max = value;
                if (range.Min == null) range.Min = value;
        
                if (range.Max < value) range.Max = value;
                if (range.Min > value) range.Min = value;
            }
        }
         return range;
    }
}

//直线 水平直线 只有1个数据 支持横屏
function ChartStraightLine() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
  
    this.Color = "rgb(255,193,37)";   //线段颜色
  
    this.Draw = function () 
    {
        if (!this.Data || !this.Data.Data) return;
        if (this.Data.Data.length != 1) return;
    
        var isHScreen = this.ChartFrame.IsHScreen;
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetTop();
        var xPointCount = this.ChartFrame.XPointCount;
    
        var yValue = this.Data.Data[0];
        var y = this.ChartFrame.GetYFromData(yValue);
        var xLeft = this.ChartFrame.GetXFromIndex(0);
        var xRight = this.ChartFrame.GetXFromIndex(xPointCount - 1);
    
        var yFix = parseInt(y.toString()) + 0.5;
        this.Canvas.beginPath();
        if (isHScreen) 
        {
            this.Canvas.moveTo(yFix, xLeft);
            this.Canvas.lineTo(yFix, xRight);
        }
        else 
        {
            this.Canvas.moveTo(xLeft, yFix);
            this.Canvas.lineTo(xRight, yFix);
        }
        this.Canvas.strokeStyle = this.Color;
        this.Canvas.stroke();
    }
  
    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = null;
        range.Max = null;
    
        if (!this.Data || !this.Data.Data) return range;
        if (this.Data.Data.length != 1) return range;
    
        range.Min = this.Data.Data[0];
        range.Max = this.Data.Data[0];
    
        return range;
    }
}

//图标集合(2.0) 支持横屏
function ChartMultiSVGIconV2()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartMultiSVGIconV2";
    this.AryIcon;  //[ {Index:, Value:, Baseline:, Line:{ Color:, Dash:[虚线点], KData:"H/L", Offset:[5,10], Width:线粗细 }, Image:{ Data:Image图片, Width, Height } } ]
    this.IsHScreen=false;
    this.MapCache=null; //key=date/date-time  value={ Data:[] }

    this.BuildKey=function(item)
    {
        if (IFrameSplitOperator.IsNumber(item.Time)) return `${item.Date}-${item.Time}`;
        else return item.Date;
    }

    this.BuildCacheData=function()
    {
        var mapData=new Map();
        this.MapCache=mapData;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryIcon)) return;

        for(var i=0;i<this.AryIcon.length;++i)
        {
            var item=this.AryIcon[i];
            var key=this.BuildKey(item);
            if (mapData.has(key))
            {
                var mapItem=mapData.get(key);
                mapItem.Data.push(item);
            }
            else
            {
                mapData.set(key,{ Data:[item] });
            }
        }
    }

    this.ClipClient=function(isHScreen)          //裁剪客户端
    {
        if (isHScreen==true)
        {
            var left=this.ChartBorder.GetLeft();
            var right=this.ChartBorder.GetRight();
            var top=this.ChartBorder.GetTop();
            var bottom=this.ChartBorder.GetBottom();
        }
        else
        {
            var left=this.ChartBorder.GetLeft();
            var right=this.ChartBorder.GetRight();
            var top=this.ChartBorder.GetTop();
            var bottom=this.ChartBorder.GetBottom();
        }

        this.Canvas.beginPath();
        this.Canvas.rect(left,top,(right-left),(bottom-top));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();
    }

    this.Draw=function()
    {
        if (!this.IsShow || this.ChartFrame.IsMinSize || !this.IsVisible) return;
        if (this.IsHideScriptIndex()) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return; //k线数据
        if (!this.Family) return;
        if (!this.MapCache || this.MapCache.size<=0) return;

        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        var xPointCount=this.ChartFrame.XPointCount;
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var isMinute=this.IsMinuteFrame();

        var border=this.GetBorder();
        if (this.IsHScreen)
        {
            var xOffset=border.TopEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.BottomEx;
            var chartLeft=border.TopEx;
        }
        else
        {
            var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
            var chartright=border.RightEx;
            var chartLeft=border.LeftEx;
        }

        this.Canvas.save();
        this.ClipClient(this.ChartFrame.IsHScreen);

        var drawInfo={ Left:chartLeft, Right:chartright,  DataWidth:dataWidth, DistanceWidth:distanceWidth };
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);

            if (isMinute)
            {
                var x=this.ChartFrame.GetXFromIndex(j);
            }
            else
            {
                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;
                var x=left+(right-left)/2;
            }

            this.DrawItem(mapItem, kItem, x, drawInfo);
        }

        this.Canvas.restore();
    }

    this.GetKValue=function(kItem, valueName)
    {
        switch(valueName)
        {
            case "HIGH":
            case "H":
                return kItem.High;
            case "L":
            case "LOW":
                return kItem.Low;
            case "C":
            case "CLOSE":
                return kItem.Close;
            case "O":
            case "OPEN":
                return KItem.Open;
            default:
                return null;
        }
    }

    this.DrawItem=function(groupItem, kItem, x, drawInfo)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(groupItem.Data)) return;

        //var left=drawInfo.Left, right=drawInfo.Right;
        //var dataWidth=drawInfo.DataWidth;
        //var distanceWidth=drawInfo.DistanceWidth;

        for(var i=0;i<groupItem.Data.length;++i)
        {
            var item=groupItem.Data[i]; 
            var value=item.Value;
            if (IFrameSplitOperator.IsString(item.Value)) value=this.GetKValue(kItem,item.Value);
            if (!IFrameSplitOperator.IsNumber(value)) continue;
            if (!item.Image) continue;

            var y=this.ChartFrame.GetYFromData(item.Value,false);
            var imageHeight=item.Image.Height;
            var imageWidth=item.Image.Width;
            

            if (this.IsHScreen)
            {
                var xImage=x-imageWidth/2, yImage=y;
                if (item.Baseline==1) yImage=y-imageHeight;
                else if (item.Baseline==2)  yImage=y; 
                else yImage=y-imageHeight/2;

                if (IFrameSplitOperator.IsNumber(item.YMove)) 
                {
                    yImage-=item.YMove;
                    y-=item.YMove;
                }

                //this.Canvas.drawImage(item.Image.Data, yImage, xImage,item.Image.Width, item.Image.Height);
                
                this.Canvas.save(); 
                this.Canvas.translate(yImage+imageWidth/2, xImage+imageHeight/2);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.drawImage(item.Image.Data, -imageWidth/2, -imageHeight/2, item.Image.Width, item.Image.Height);
                this.Canvas.restore();
                
            }
            else
            {
                var rtIcon=new RectV2(x-imageWidth/2,y-imageHeight/2,imageWidth,imageHeight);
                if (item.Baseline==1)  rtIcon.Y=y;
                else if (item.Baseline==2)  rtIcon.Y=y-imageHeight;
                else rtIcon.Y=y-imageHeight/2;

                if (IFrameSplitOperator.IsNumber(item.YMove)) 
                {
                    y+=item.YMove;
                    rtIcon.Y+=item.YMove;
                }
    
                this.Canvas.drawImage(item.Image.Data, rtIcon.X, rtIcon.Y, item.Image.Width, item.Image.Height);
            }

            if (item.Line)
            {
                var price=item.Line.KData=="H"? kItem.High:kItem.Low;
                var yPrice=this.ChartFrame.GetYFromData(price, false);
                var yText=y;
                if (Array.isArray(item.Line.Offset) && item.Line.Offset.length==2)
                {
                    if (yText>yPrice) //文字在下方
                    {
                        yText-=item.Line.Offset[1];
                        yPrice+=item.Line.Offset[0]
                    }
                    else if (yText<yPrice)
                    {
                        yText+=item.Line.Offset[1];
                        yPrice-=item.Line.Offset[0]
                    }
                }
                this.Canvas.save();
                if (item.Line.Dash) this.Canvas.setLineDash(item.Line.Dash);    //虚线
                if (item.Line.Width>0) this.Canvas.lineWidth=item.Line.Width;   //线宽
                this.Canvas.strokeStyle = item.Line.Color;
                this.Canvas.beginPath();
                if (this.IsHScreen)
                {
                    this.Canvas.moveTo(yText, ToFixedPoint(x));
                    this.Canvas.lineTo(yPrice,ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yText);
                    this.Canvas.lineTo(ToFixedPoint(x),yPrice);
                }
                
                this.Canvas.stroke();
                this.Canvas.restore();
            }
        }
    }

    this.GetMaxMin=function()
    {
        this.IsHScreen=(this.ChartFrame.IsHScreen===true);
        var range={ Min:null, Max:null };
        if(!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return range;
        if (!this.MapCache || this.MapCache.size<=0) return;
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i=this.Data.DataOffset,j=0, k=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var kItem=this.Data.Data[i];
            var key=this.BuildKey(kItem);
            if (!this.MapCache.has(key)) continue;
            var mapItem=this.MapCache.get(key);
            if (!IFrameSplitOperator.IsNonEmptyArray(mapItem.Data)) continue;

            for(k=0;k<mapItem.Data.length;++k)
            {
                var item=mapItem.Data[k];
                var value=item.Value;
                if (IFrameSplitOperator.IsString(item.Value)) value=this.GetKValue(kItem,item.Value);
                if (!IFrameSplitOperator.IsNumber(value)) continue;

                if (range.Max==null) range.Max=value;
                else if (range.Max<value) range.Max=value;
                if (range.Min==null) range.Min=value;
                else if (range.Min>value) range.Min=value;
            }
        }

        return range;
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
    this.LineDash=g_JSChartResource.CorssCursorLineDash.slice();    //虚线

    this.TextHeight = 15;                     //文本字体高度
    this.LastPoint;
    this.CursorIndex;       //当前数据的位置

    this.PointX;
    this.PointY;

    this.StringFormatX;
    this.StringFormatY;

    this.IsShow = true;       //是否显示
    this.ShowTextMode = { Left: 1, Right: 1, Bottom: 1 }; //0=不显示  1=显示在框架外 2=显示在框架内
    this.TextFormat= { Right:0 };               //0=默认 1=价格显示(分时图才有用)
    this.IsShowCorss = true;    //是否显示十字光标
    this.IsShowClose = false;     //Y轴始终显示收盘价
    this.IsOnlyDrawMinute=false;  //是否只能画在走势图价格线上
    this.IsFixXLastTime=false;    //是否修正X轴,超出当前时间的,X轴调整到当前最后的时间.

    this.CorssPointConfig=
    { 
        Enable:false, 
        Center:CloneData(g_JSChartResource.CorssCursor.CorssPoint.Center),
        Border:CloneData(g_JSChartResource.CorssCursor.CorssPoint.Border)
    }

    this.BottomConfig=CloneData(g_JSChartResource.CorssCursor.BottomText);     //底部输出配置
    this.LeftConfig=CloneData(g_JSChartResource.CorssCursor.LeftText);
    this.RightConfig=CloneData(g_JSChartResource.CorssCursor.RightText);        //右侧输出配置

    this.BottomButton={ Enable:false, Rect:null };  //底部按钮

    //内部使用
    this.Close = null;     //收盘价格
    this.Status=0;         //当前状态 0=隐藏 1=显示

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

    this.GetMinuteCloseYPoint=function(index)
    {
        if (!IFrameSplitOperator.IsNumber(index)) return null;
        index=parseInt(index.toFixed(0));
        if (!this.StringFormatX.Data) return null;
        var data = this.StringFormatX.Data;
        if (!data.Data || data.Data.length <= 0) return null;
        var dataIndex = data.DataOffset + index;
        if (dataIndex >= data.Data.length) dataIndex = data.Data.length - 1;
        if (dataIndex < 0) return null;

        var close = data.Data[dataIndex];
        if (!IFrameSplitOperator.IsNumber(index)) return null;
        this.Close=close;
        var yPoint = this.Frame.GetYFromData(this.Close);
        return yPoint;
    }

    this.FixMinuteLastTimeXPoint=function(index)
    {
        if (!IFrameSplitOperator.IsNumber(index)) return null;
        index=parseInt(index);
        if (!this.StringFormatX.Data) return null;
        var data = this.StringFormatX.Data;
        if (!data.Data || data.Data.length <= 0) return null;
        var dataIndex = data.DataOffset + index;
        if (dataIndex<data.Data.length) return null;

        dataIndex=data.Data.length - 1;
        dataIndex-=data.DataOffset;
        var xPoint=this.Frame.GetXFromIndex(dataIndex);

        return { X:xPoint, Index:dataIndex };
    }

    this.Draw = function () 
    {
        this.Status=JSCHART_CORSSCURSOR_STATUS_ID.NONE_ID;
        this.BottomButton.Rect=null;
        
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

        if (this.IsShowClose)  //手机端 十字只能画在K线上
        {
            var yPoint = this.GetCloseYPoint(this.CursorIndex);
            if (yPoint != null) y = yPoint;
        }
        else if (this.IsOnlyDrawMinute)
        {
            var yPoint = this.GetMinuteCloseYPoint(this.CursorIndex);
            if (yPoint != null) y=yPoint;
        }

        if (this.IsFixXLastTime)
        {
            var value=this.FixMinuteLastTimeXPoint(this.CursorIndex)
            if (value)
            {
                x=value.X;
                this.CursorIndex=value.Index;
            }
        }

        this.PointY = [[left, y], [right, y]];
        this.PointX = [[x, top], [x, bottom]];

        if (this.IsShowCorss)   //十字线
        {
            if (this.HPenType==1 || this.HPenType==0)
            {
                this.Canvas.strokeStyle = this.HPenColor;
                if (this.HPenType == 0) this.Canvas.setLineDash(this.LineDash);   //虚线
                //this.Canvas.lineWidth=0.5
                this.Canvas.beginPath();
                this.Canvas.moveTo(left, ToFixedPoint(y));
                this.Canvas.lineTo(right, ToFixedPoint(y));
                this.Canvas.stroke();
                this.Canvas.setLineDash([]);
            }
            
            this.Canvas.save();
            this.Canvas.strokeStyle = this.VPenColor;
            if (this.VPenType == 0) 
            {
                this.Canvas.setLineDash(this.LineDash);   //虚线
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

            this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LINE_ID;
            this.Canvas.stroke();
            this.Canvas.restore();

            this.Canvas.save();
            this.DrawCorssPoint(x,y);
            this.Canvas.restore();
        }

        var xValue = this.Frame.GetXData(x);
        var yValueExtend = {};
        var yValue = this.Frame.GetYData(y, yValueExtend);
        this.StringFormatY.RValue = yValueExtend.RightYValue; //右侧子坐标
        if (this.IsShowClose && this.Close != null) yValue = this.Close;

        this.StringFormatX.Value = this.CursorIndex;
        this.StringFormatY.Value = yValue;
        this.StringFormatY.RValue=yValueExtend.RightYValue; //右侧子坐标
        this.StringFormatY.Point={X:x, Y:y};
        this.StringFormatY.FrameID = yValueExtend.FrameID;

        this.Canvas.font = this.Font;
        var textHeight=this.GetFontHeight();
        if (textHeight>this.TextHeight) this.TextHeight=textHeight;

        if (((this.ShowTextMode.Left == 1 && this.Frame.ChartBorder.Left >= 30) || this.ShowTextMode.Left == 2 ||
            (this.ShowTextMode.Right == 1 && this.Frame.ChartBorder.Right >= 30) || this.ShowTextMode.Right == 2) && this.StringFormatY.Operator()) 
        {
            var text = this.StringFormatY.Text;
            var textWidth = this.Canvas.measureText(text).width;    //前后各空2个像素
            var textSize={ Width:textWidth+4, Height:this.TextHeight, Text:[] };
            var margin=this.LeftConfig.Margin;
            var textOffset=this.LeftConfig.TextOffset;
            var rtBG=null;

            if (this.Frame.ChartBorder.Left >= 30 && this.ShowTextMode.Left==1) 
            {
                var rtBG={ Right:left, Width:textWidth+margin.Left+margin.Right, YCenter:y, Height:textHeight+margin.Top+margin.Bottom };
                rtBG.Left=rtBG.Right-rtBG.Width;
                rtBG.Top=rtBG.YCenter-rtBG.Height/2;
                rtBG.Bottom=rtBG.Top+rtBG.Height;

                if (rtBG.Left<0) 
                {
                    rtBG.Left=0;
                    rtBG.Right=rtBG.Left+rtBG.Width;
                }
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LEFT_TEXT_ID;
            } 
            else if (this.ShowTextMode.Left==2) //在框架内显示
            {
                var rtBG={ Left:left, Width:textWidth+margin.Left+margin.Right, YCenter:y, Height:textHeight+margin.Top+margin.Bottom };
                rtBG.Right=rtBG.Left+rtBG.Width;
                rtBG.Top=rtBG.YCenter-rtBG.Height/2;
                rtBG.Bottom=rtBG.Top+rtBG.Height;
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LEFT_INTER_TEXT_ID;
            }

            if (rtBG)
            {
                this.DrawTextBGRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="bottom";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,rtBG.Left+textOffset.X, rtBG.Bottom+textOffset.Y);
            }

            var complexText=
            { 
                ShowType:0, //0=单行(默认)  1=多行 
                Font:this.Font, Color:this.TextColor,
                Text:[ { Text:text, Margin:this.RightConfig.Margin, TextOffset:this.RightConfig.TextOffset } ],
            };
            var yTop=y-this.TextHeight/2;
            var textSize={ Width:0, Height:0, Text:[] };

            if (this.StringFormatY.PercentageText)
            {
                if (this.TextFormat.Right==0)
                {
                    text=this.StringFormatY.PercentageText+'%';
                    complexText.Text[0].Text=text;
                }
            }

            if (this.StringFormatY.RText) 
            {
                text = this.StringFormatY.RText;
                complexText.Text[0].Text=text;
            }

            if (this.StringFormatY.RComplexText && IFrameSplitOperator.IsNonEmptyArray(this.StringFormatY.RComplexText.Text))
            {
                complexText=this.StringFormatY.RComplexText;
                if (!complexText.Font) complexText.Font=this.Font;
                if (!complexText.Font) complexText.Color=this.TextColor;
            }
                
            this.CalculateComplexTextSize(complexText, textSize);

            //计算右侧文本输出顶部位置
            function _Temp_CalculateRightTextBGTop(rtBG, complexText, defatulTextHeight)
            {
                if (complexText.ShowType==1)
                {
                    var yValue=defatulTextHeight/2;
                    if (IFrameSplitOperator.IsNonEmptyArray(textSize.Text) && textSize.Text[0])
                    {
                        var itemSize=textSize.Text[0];
                        if (IFrameSplitOperator.IsNumber(itemSize.Height)) yValue=itemSize.Height/2;
                    }  

                    rtBG.Top=rtBG.YCenter-yValue;
                    rtBG.Bottom=rtBG.Top+rtBG.Height;
                }
                else
                {
                    rtBG.Top=rtBG.YCenter-rtBG.Height/2;
                    rtBG.Bottom=rtBG.Top+rtBG.Height;
                }
            }

            if (this.Frame.ChartBorder.Right >= 30 && this.ShowTextMode.Right == 1) 
            {
                var rtBG={ Left:right+1, Width:textSize.Width, YCenter:y, Height:textSize.Height };
                rtBG.Right=rtBG.Left+rtBG.Width;
                _Temp_CalculateRightTextBGTop(rtBG, complexText, this.TextHeight);
                
                if (rtBG.Right>chartRight) 
                {
                    rtBG.Right=chartRight;
                    rtBG.Left=rtBG.Right-rtBG.Width;
                }

                this.DrawTextBGRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                this.DrawComplexRightText(rtBG,complexText,textSize);
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.RIGHT_TEXT_ID;
            }
            else if (this.ShowTextMode.Right == 2) 
            {
                var rtBG={ Right:right, Width:textSize.Width, YCenter:y, Height:textSize.Height };
                rtBG.Left=rtBG.Right-rtBG.Width;
                _Temp_CalculateRightTextBGTop(rtBG, complexText, this.TextHeight);

                this.Canvas.fillStyle=this.TextBGColor;
                this.DrawTextBGRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                this.DrawComplexRightText(rtBG,complexText,textSize);
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.RIGHT_INTER_TEXT_ID;
            }
        }

        //Bottom==8 自定义X轴文字位置
        if ((this.ShowTextMode.Bottom == 1 || this.ShowTextMode.Bottom==8) && this.StringFormatX.Operator()) 
        {
            var text = this.StringFormatX.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width;    //前后各空2个像素
            var margin=this.BottomConfig.Margin;
            var textOffset=this.BottomConfig.TextOffset;
            var rtBG=
            { 
                Top:bottom, Height:margin.Top+margin.Bottom+textHeight, 
                XCenter:x, Width:textWidth+margin.Left+margin.Right 
            };
            rtBG.Bottom=rtBG.Top+rtBG.Height;
            rtBG.Left=rtBG.XCenter-rtBG.Width/2;
            rtBG.Right=rtBG.Left+rtBG.Width;

            if (rtBG.Left<=0)
            {
                rtBG.Left=0;
                rtBG.Right=rtBG.Left+rtBG.Width;
            }
            else if (rtBG.Right>=right)
            {
                rtBG.Right=right;
                rtBG.Left=rtBG.Right-rtBG.Width;
            }

            var bShowText=true;
            if (this.ShowTextMode.Bottom==2)
            {
                rtBG.Bottom=bottom;
                rtBG.Top=rtBG.Bottom-rtBG.Height;
            }
            else if (this.ShowTextMode.Bottom==8)
            {
                var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_CORSSCURSOR_POSITION);
                if (event && event.Callback)
                {
                    var sendData={ RectText:rtBG, IsShowText:bShowText, X:x, Y:y };
                    event.Callback(event, sendData, this);
                    bShowText=sendData.IsShowText;
                }
            }

            //JSConsole.Chart.Log('[ChartCorssCursor::Draw] ',yCenter);
            if (bShowText)
            {
                this.DrawTextBGRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="bottom";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,rtBG.Left+textOffset.X,rtBG.Bottom+textOffset.Y,textWidth);

                var buttonData={X:x, Y:y, XValue:xValue, FrameID:yValueExtend.FrameID };
                if (this.StringFormatX.KItem) buttonData.KItem=this.StringFormatX.KItem;
                this.BottomButton.Rect=rtBG;
                this.BottomButton.Data=buttonData;
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.BOTTOM_TEXT_ID;
            }
        }
    }

    this.GetFontHeight=function(font)
    {
        if (font) this.Canvas.font=font;
        var textHeight= this.Canvas.measureText("擎").width;
        return textHeight;
    }

    this.DrawTextBGRect=function(x,y, height, width)
    {
        this.Canvas.fillStyle=this.TextBGColor;
        this.Canvas.fillRect(ToFixedPoint(x),ToFixedPoint(y),ToFixedRect(height),ToFixedRect(width));
        //this.Canvas.fillRect(x,y,height,width);
    }

    this.CalculateComplexTextSize=function(complexText, size)
    {
        if (!complexText || !IFrameSplitOperator.IsNonEmptyArray(complexText.Text)) return;

        var showType=0;
        if (complexText.ShowType==1) showType=complexText.ShowType;
        if (showType==1)    //多行
        {
            var textWidth=0, textHeight=0;
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;
                var itemWidth=this.Canvas.measureText(item.Text).width;    //前后各空2个像素
                var itemHeight=this.GetFontHeight();
                if (item.Margin)
                {
                    var margin=item.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) itemWidth+=margin.Left;
                    if (IFrameSplitOperator.IsNumber(margin.Right)) itemWidth+=margin.Right;
                    if (IFrameSplitOperator.IsNumber(margin.Top)) itemHeight+=margin.Top;
                    if (IFrameSplitOperator.IsNumber(margin.Bottom)) itemHeight+=margin.Bottom;
                }

                size.Text[i]={ Width:itemWidth, Height:itemHeight };    //保存所有文字的大小信息

                if (textWidth<itemWidth) textWidth=itemWidth;
                textHeight+=itemHeight;
            }

            size.Width=textWidth;
            size.Height=textHeight;
        }
        else    //水平 单行
        {
            var textWidth=0, textHeight=this.GetFontHeight();
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;

                var itemWidth=this.Canvas.measureText(item.Text).width;    //前后各空2个像素
                var itemHeight=this.Canvas.measureText("擎").width;
                if (item.Margin)
                {
                    var margin=item.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) itemWidth+=margin.Left;
                    if (IFrameSplitOperator.IsNumber(margin.Right)) itemWidth+=margin.Right;
                    if (IFrameSplitOperator.IsNumber(margin.Top)) itemHeight+=margin.Top;
                    if (IFrameSplitOperator.IsNumber(margin.Bottom)) itemHeight+=margin.Bottom;
                }

                size.Text[i]={ Width:itemWidth, Height:itemHeight };    //保存所有文字的大小信息

                textWidth+=itemWidth;
                if (textHeight<itemHeight) textHeight=itemHeight;
            }

            size.Width=textWidth;
            size.Height=textHeight;
        }
    }

    this.DrawComplexTextV2=function(left, yTop, complexText, size)
    {
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        var showType=0;
        if (complexText.ShowType==1) showType=complexText.ShowType;
        if (showType==1)    //多行
        {
            var xLeft=left;
            var yText=yTop;    //顶
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                var itemSize=size.Text[i];

                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;
                
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=complexText.Color;

                var y=yText+itemSize.Height;
                var x=xLeft;
                if (item.Margin)
                {
                    var margin=item.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Bottom)) y-=margin.Bottom;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) x+=margin.Left;
                }

                this.Canvas.fillText(item.Text,x,y,itemSize.Width);
                
                yText+=itemSize.Height;
            }
        }
        else    //水平 单行
        {
            var xText=left;
            var yBottom=yTop+size.Height;
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                var itemSize=size.Text[i];

                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;
                
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=complexText.Color;

                var y=yBottom;
                var x=xText;
                if (item.Margin)
                {
                    var margin=item.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Bottom)) y-=margin.Bottom;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) x+=margin.Left;
                }

                this.Canvas.fillText(item.Text,x,y,itemSize.Width);
                
                xText+=itemSize.Width;
            }
        }
    }

    this.DrawComplexRightText=function(rtBG, complexText, size)
    {
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        var showType=0;
        if (complexText.ShowType==1) showType=complexText.ShowType;
        if (showType==1)    //多行
        {
            var xLeft=rtBG.Left;
            var yTop=rtBG.Top;    //顶
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                var itemSize=size.Text[i];

                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;
                
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=complexText.Color;

                var y=yTop+itemSize.Height;
                var x=xLeft;

                if (item.TextOffset)
                {
                    var textOffset=item.TextOffset;
                    if (IFrameSplitOperator.IsNumber(textOffset.X)) x+=textOffset.X;
                    if (IFrameSplitOperator.IsNumber(textOffset.Y)) y+=textOffset.Y;
                }

                this.Canvas.fillText(item.Text,x,y,itemSize.Width);
                
                yTop+=itemSize.Height;
            }
        }
        else    //水平 单行
        {
            var xText=rtBG.Left;
            var yBottom=rtBG.Bottom;
            for(var i=0; i<complexText.Text.length; ++i)
            {
                var item=complexText.Text[i];
                var itemSize=size.Text[i];

                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=complexText.Font;
                
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=complexText.Color;

                var x=xText;
                var y=yBottom;

                if (item.TextOffset)
                {
                    var textOffset=item.TextOffset;
                    if (IFrameSplitOperator.IsNumber(textOffset.X)) x+=textOffset.X;
                    if (IFrameSplitOperator.IsNumber(textOffset.Y)) y+=textOffset.Y;
                }
               
                this.Canvas.fillText(item.Text,x,y,itemSize.Width);
                
                xText+=itemSize.Width;
            }
        }
    }

    this.HScreenDraw = function () 
    {
        this.Status=JSCHART_CORSSCURSOR_STATUS_ID.NONE_ID;
        var x = this.LastPoint.X;
        var y = this.LastPoint.Y;

        y = this.Frame.GetXFromIndex(this.CursorIndex); //手机端 十字只能画在K线上
        if (this.IsShowClose)  //手机端 十字只能画在K线上
        {
            var yPoint = this.GetCloseYPoint(this.CursorIndex);
            if (yPoint != null) x = yPoint;
        }
        else if (this.IsOnlyDrawMinute)
        {
            var yPoint = this.GetMinuteCloseYPoint(this.CursorIndex);
            if (yPoint != null) x=yPoint;
        }

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
            if (this.HPenType == 0) this.Canvas.setLineDash(this.LineDash);   //虚线
           
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
                this.Canvas.setLineDash(this.LineDash);   //虚线
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

            this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LINE_ID;
            this.Canvas.stroke();
            this.Canvas.restore();

            this.Canvas.save();
            this.DrawCorssPoint(x,y);
            this.Canvas.restore();
        }

        var xValue = this.Frame.GetXData(y);
        var yValueExtend = {};
        var yValue = this.Frame.GetYData(x, yValueExtend);

        this.StringFormatX.Value = xValue;
        this.StringFormatY.Value = yValue;
        this.StringFormatY.RValue=yValueExtend.RightYValue; //右侧子坐标
        this.StringFormatY.Point={X:x, Y:y};
        this.StringFormatY.FrameID = yValueExtend.FrameID;

        if (((this.ShowTextMode.Left == 1 && this.Frame.ChartBorder.Top >= 30) || this.ShowTextMode.Left == 2 ||
            (this.ShowTextMode.Right == 1 && this.Frame.ChartBorder.Bottom >= 30) || this.ShowTextMode.Right == 2) && this.StringFormatY.Operator()) {
            var text = this.StringFormatY.Text;
            this.Canvas.font = this.Font;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素

            if (this.Frame.ChartBorder.Top >= 30 && this.ShowTextMode.Left == 1) 
            {
                var xText = x, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                this.Canvas.fillStyle = this.TextBGColor;

                if (top >= textWidth) 
                {
                    this.Canvas.fillRect(-textWidth, -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, -2, 0, textWidth);
                }
                else 
                {
                    this.Canvas.fillRect((textWidth - top), -(this.TextHeight / 2), -textWidth, this.TextHeight);
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, (textWidth - top) - 2, 0, textWidth);
                }
                this.Canvas.restore();
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LEFT_TEXT_ID;
            }
            else if (this.ShowTextMode.Left == 2) 
            {
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
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.LEFT_INTER_TEXT_ID;
            }

            if (this.StringFormatY.RText) 
            {
                text=this.StringFormatY.RText;
                var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素
            }

            if (this.Frame.ChartBorder.Bottom >= 30 && this.ShowTextMode.Right == 1) 
            {
                var xText = x, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
                this.Canvas.fillStyle = this.TextBGColor;

                if (bottomWidth > textWidth) 
                {
                    this.Canvas.fillRect(0, -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, 2, 0, textWidth);
                }
                else 
                {
                    this.Canvas.fillRect((bottomWidth - textWidth), -(this.TextHeight / 2), textWidth, this.TextHeight);
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.fillStyle = this.TextColor;
                    this.Canvas.fillText(text, (bottomWidth - textWidth) + 2, 0, textWidth);
                }
                this.Canvas.restore();
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.RIGHT_TEXT_ID;
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
                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.RIGHT_INTER_TEXT_ID;
            }
        }

        if ((this.ShowTextMode.Bottom === 1 ||this.ShowTextMode.Bottom==8)  && this.StringFormatX.Operator()) 
        {
            var text = this.StringFormatX.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            var bShowText=true;
            var yText = y;
            var xText=left;

            if (this.ShowTextMode.Bottom==8)
            {
                var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_CORSSCURSOR_POSITION);
                if (event && event.Callback)
                {
                    var sendData={ XText:xText, Height:this.TextHeight, IsShowText:bShowText };
                    event.Callback(event, sendData, this);

                    xText=sendData.XText;
                    bShowText=sendData.IsShowText;
                }
            }

            if (bShowText)
            {
                if (y - textWidth / 2 < 3)    //左边位置不够了, 顶着左边画
                {
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
                else 
                {
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

                this.Status|=JSCHART_CORSSCURSOR_STATUS_ID.BOTTOM_TEXT_ID;
            }
        }
    }

    this.DrawCorssPoint=function(x,y)
    {
        var config=this.CorssPointConfig;
        if (!config.Enable) return;

        this.Canvas.beginPath();
        this.Canvas.arc(x,y,config.Center.Radius,0,360,false);
        this.Canvas.closePath();

        if (config.Center && config.Center.Color)
        {
            this.Canvas.fillStyle=config.Center.Color;
            this.Canvas.fill(); 
        }
                                
        if (config.Border && config.Border.Color)
        {
            this.Canvas.strokeStyle=config.Border.Color;
            if (IFrameSplitOperator.IsNumber(config.Border.Width)) this.Canvas.lineWidth=config.Border.Width;
            this.Canvas.stroke();
        }
    }

    this.PtInButton=function(x,y)
    {
        var item=this.PtInButtomButton(x,y);
        if (item) return item;

        return null;
    }

    this.PtInButtomButton=function(x,y)
    {
        if (!this.BottomButton.Enable) return null;
        if (!this.BottomButton.Rect) return null;

        var rect=this.BottomButton.Rect;
        if (x>=rect.Left && x<=rect.Right && y>=rect.Top && y<=rect.Bottom)
        {
            return { Data:this.BottomButton.Data, Rect:rect , Type:2 }; //Type:1=右侧  2=底部
        }

        return null;
    }
}

//分钟线
function ChartMinutePriceLine() 
{
    this.newMethod = ChartLine;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;
    this.IsDrawArea = true;    //是否画价格面积图
    this.AreaColor = 'rgba(0,191,255,0.1)';

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.IsShow) return;
        if (!this.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var minuteCount = this.ChartFrame.MinuteCount;
        var bottom = this.ChartBorder.GetBottom();
        var left = this.ChartBorder.GetLeft();

        var bFirstPoint = true;
        var ptFirst = {}; //第1个点
        var drawCount = 0;
        var pointCount=0;

        this.Canvas.save();
        this.ClipClient(isHScreen);     //裁剪区域 防止线段毛刺超出图形

        if (IFrameSplitOperator.IsPlusNumber(this.LineWidth>0)) this.Canvas.lineWidth=this.LineWidth;

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            ++pointCount;
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (bFirstPoint) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
                ptFirst = { X: x, Y: y };
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;

            if (pointCount >= minuteCount) //上一天的数据和这天地数据线段要断开
            {
                bFirstPoint = true;
                this.Canvas.stroke();
                if (this.IsDrawArea)   //画面积
                {
                    if (isHScreen) 
                    {
                        this.Canvas.lineTo(left, x);
                        this.Canvas.lineTo(left, ptFirst.X);
                        this.SetFillStyle(this.AreaColor, this.ChartBorder.GetRight(), bottom, this.ChartBorder.GetLeftEx(), bottom);
                    }
                    else 
                    {
                        this.Canvas.lineTo(x, bottom);
                        this.Canvas.lineTo(ptFirst.X, bottom);
                        this.SetFillStyle(this.AreaColor, left, this.ChartBorder.GetTopEx(), left, bottom);
                    }
                    this.Canvas.fill();
                }
                drawCount = 0;
                pointCount=0;
            }
        }

        if (drawCount > 0) 
        {
            this.Canvas.stroke();
            if (this.IsDrawArea)   //画面积
            {
                if (isHScreen) 
                {
                    this.Canvas.lineTo(left, x);
                    this.Canvas.lineTo(left, ptFirst.X);
                    this.SetFillStyle(this.AreaColor, this.ChartBorder.GetRight(), bottom, this.ChartBorder.GetLeftEx(), bottom);
                }
                else 
                {
                    this.Canvas.lineTo(x, bottom);
                    this.Canvas.lineTo(ptFirst.X, bottom);
                    this.SetFillStyle(this.AreaColor, left, this.ChartBorder.GetTopEx(), left, bottom);
                }
                this.Canvas.fill();
            }
        }

        this.Canvas.restore();
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        if (this.YClose == null) return range;

        range.Min = this.YClose;
        range.Max = this.YClose;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (!value) continue;

            if (range.Max == null) range.Max = value;
            if (range.Min == null) range.Min = value;

            if (range.Max < value) range.Max = value;
            if (range.Min > value) range.Min = value;
        }

        if (range.Max == this.YClose && range.Min == this.YClose) 
        {
            range.Max = this.YClose + this.YClose * 0.1;
            range.Min = this.YClose - this.YClose * 0.1;
            return range;
        }

        var distance = Math.max(Math.abs(this.YClose - range.Max), Math.abs(this.YClose - range.Min));
        range.Max = this.YClose + distance;
        range.Min = this.YClose - distance;

        return range;
    }
}

////////////////////////////////////////////////////////////////////////////////
//深度图十字光标
function DepthChartCorssCursor()
{
    this.Frame;
    this.Canvas;                            //画布
    this.Data;
    this.Symbol;
    this.HQChart;

    this.HPenType=0;  //水平线样式 0=虚线 1=实线
    this.VPenType=0;  //垂直线颜色 0=虚线 1=实线
    this.LineDash=g_JSChartResource.DepthCorss.LineDash;

    this.AskColor=g_JSChartResource.DepthCorss.AskColor.Line;   //卖
    this.BidColor=g_JSChartResource.DepthCorss.BidColor.Line;   //买
    this.LineWidth=g_JSChartResource.DepthCorss.LineWidth;

    this.IsShowTooltip=true;
    this.Tooltip=
    { 
        LineHeight:g_JSChartResource.DepthCorss.Tooltip.LineHeight, 
        Border:
        { 
            Top:g_JSChartResource.DepthCorss.Tooltip.Border.Top, 
            Left:g_JSChartResource.DepthCorss.Tooltip.Border.Left, 
            Right:g_JSChartResource.DepthCorss.Tooltip.Border.Right,
            Bottom:g_JSChartResource.DepthCorss.Tooltip.Border.Bottom, 
            ItemSpace: g_JSChartResource.DepthCorss.Tooltip.Border.ItemSpace
        },
        Font:g_JSChartResource.DepthCorss.Tooltip.Font,
        TextColor:g_JSChartResource.DepthCorss.Tooltip.TextColor,
        BGColor:g_JSChartResource.DepthCorss.Tooltip.BGColor
    };    // Width: Height:

    this.Font=g_JSChartResource.CorssCursorTextFont;            //字体
    this.TextColor=g_JSChartResource.CorssCursorTextColor;      //文本颜色
    this.TextBGColor=g_JSChartResource.CorssCursorBGColor;      //文本背景色
    this.TextHeight=20;                                         //文本字体高度
    this.LastPoint;

    this.PointX;
    this.PointY;

    this.StringFormatX;
    this.StringFormatY;

    this.IsShowCorss=true;  //是否显示十字光标
    this.IsShow=true;

    this.GetVol=function(price, isAsk)
    {
        if (!this.Data) return null;
        var aryData=isAsk? this.Data.Asks:this.Data.Bids;
        if (!aryData || !Array.isArray(aryData) || aryData.length<=0) return null;

        for(var i in aryData)
        {
            var item=aryData[i];
            if (item.Price==price) return item.Vol;
        }

        return null;
    }

    this.Draw=function()
    {
        this.Status=0;
        if (!this.LastPoint) return;
        if (!this.Data) return;
        if (!this.IsShow) return;

        var x=this.LastPoint.X;
        var y=this.LastPoint.Y;

        var isInClient=false;
        var rtClient = new Rect(this.Frame.ChartBorder.GetLeft(), this.Frame.ChartBorder.GetTop(), this.Frame.ChartBorder.GetWidth(), this.Frame.ChartBorder.GetHeight());
        isInClient = rtClient.IsPointIn(x, y);
       
        this.PointY=null;
        this.PointY==null;

        if (!isInClient) return;

        if (this.Frame.IsHScreen===true)
        {
            return;
        }

        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        var top=this.Frame.ChartBorder.GetTopTitle();
        var bottom=this.Frame.ChartBorder.GetBottom();
        var rightWidth=this.Frame.ChartBorder.Right;
        var chartRight=this.Frame.ChartBorder.GetChartWidth();

        var xValue=this.Frame.GetXData(x);
        var xInfo=this.Frame.GetXFromPrice(xValue); //调整价格到有数据的点上

        if (!xInfo) return;

        var yVol=this.GetVol(xInfo.Price, xInfo.IsAsk);
        y=this.Frame.GetYFromData(yVol);    //调整Y轴, 让它在线段上

        xInfo.Vol=yVol;
        xInfo.Y=y;
        
        this.PointY=[[left,y],[right,y]];
        this.PointX=[[x,top],[x,bottom]];

        if (this.IsShowCorss)
        {
            if (xInfo.IsAsk) this.Canvas.strokeStyle=this.AskColor;
            else this.Canvas.strokeStyle=this.BidColor;
            this.Canvas.save();
            this.Canvas.lineWidth=this.LineWidth;
            var lineWidth=this.Canvas.lineWidth;

            if (this.HPenType==1 || this.HPenType==0)   //0=实线 1=虚线
            {
                if (this.HPenType==0) this.Canvas.setLineDash(this.LineDash);   //虚线
                var yFix=ToFixedPoint(y);
                this.Canvas.beginPath();
                this.Canvas.moveTo(left,yFix);
                this.Canvas.lineTo(right,yFix);
                this.Canvas.stroke();
                if (this.HPenType==0) this.Canvas.setLineDash([]);
            }
            
            if (this.VPenType==0) this.Canvas.setLineDash(this.LineDash);   //虚线
            var xFix=ToFixedPoint(xInfo.X);
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix,top);
            this.Canvas.lineTo(xFix,bottom);
            this.Canvas.stroke();
            if (this.VPenType==0) this.Canvas.setLineDash([]);

            this.Canvas.restore();
        }

        if (this.HQChart)
        {
            var event=this.HQChart.GetEvent(JSCHART_EVENT_ID.ON_DRAW_DEPTH_TOOLTIP);
            if (event)
            {
                event.Callback(event,xInfo,this);
            }
        }

        if (this.IsShowTooltip) 
        {
            var aryText=this.GetFormatTooltip(xInfo);
            this.DrawTooltip(aryText, xInfo);
        }
    }

    //[{Title:, TitleColor:,  Text:, Color:}]
    this.GetFormatTooltip=function(drawData)
    {
        var aryText=[];

        var floatPrecision=2;
        if (this.Symbol) floatPrecision=JSCommonCoordinateData.GetfloatPrecision(this.Symbol); //价格小数位数

        var item= 
        { 
            Title:g_JSChartLocalization.GetText('Depth-Price',this.HQChart.LanguageID),
            TitleColor:this.Tooltip.TextColor,
            Text:drawData.Price.toFixed(floatPrecision),
            Color:this.Tooltip.TextColor
        };
        aryText.push(item);

        var item= 
        { 
            Title:g_JSChartLocalization.GetText('Depth-Sum',this.HQChart.LanguageID),
            TitleColor:this.Tooltip.TextColor,
            Text:drawData.Vol.toFixed(4),
            Color:this.Tooltip.TextColor
        };
        aryText.push(item);

        return aryText;
    }

    this.DrawTooltip=function(aryText,data)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryText)) return;

        this.Canvas.font=this.Tooltip.Font;
        var maxWidth=0, lineCount=0, itemCount=0;
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            if (!item) continue;

            var isVaild=false;
            if (item.Title)
            {
                var textWidth=this.Canvas.measureText(item.Title).width;
                if (maxWidth<textWidth) maxWidth=textWidth;
                ++lineCount;
                isVaild=true;
            }

            if (item.Text)
            {
                var textWidth=this.Canvas.measureText(item.Text).width;
                if (maxWidth<textWidth) maxWidth=textWidth;
                ++lineCount;
                isVaild=true;
            }

            if (isVaild) ++itemCount;
        }

        if (maxWidth<=0 || lineCount<=0) return;

        var border=this.Tooltip.Border;
        var chartRight=this.Frame.ChartBorder.GetRight();
        var chartTop=this.Frame.ChartBorder.GetTop();

        this.Tooltip.LineHeight=this.Canvas.measureText("擎").width+2;
        this.Tooltip.Width=maxWidth+(border.Left+border.Right);
        this.Tooltip.Height=this.Tooltip.LineHeight*lineCount + (border.Top+border.Bottom) + (border.ItemSpace)*(itemCount-1);

        var left=data.X;
        var top=data.Y-this.Tooltip.Height
        if (left+this.Tooltip.Width>=chartRight) left=data.X-this.Tooltip.Width;
        if (top<chartTop) top=data.Y;

        this.Canvas.fillStyle=this.Tooltip.BGColor;
        this.Canvas.fillRect(left,top,this.Tooltip.Width,this.Tooltip.Height);

        this.Canvas.textBaseline="top";
        this.Canvas.textAlign="left";
        var x=border.Left+left;
        var y=border.Top+top;

        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            var isVaild=false;
            if (item.Title)
            {
                if (item.TitleColor) this.Canvas.fillStyle=item.TitleColor;
                else this.Canvas.fillStyle=this.Tooltip.TextColor;
                this.Canvas.fillText(item.Title,x,y);
                y+=this.Tooltip.LineHeight;
                isVaild=true;
            }

            if (item.Text)
            {
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=this.Tooltip.TextColor;

                this.Canvas.fillText(item.Text,x,y);
                y+=this.Tooltip.LineHeight;
                isVaild=true;
            }

            if (isVaild) y+=border.ItemSpace;
        }
       
    }
}

//深度图
function ChartOrderbookDepth()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="ChartOrderbookDepth";
    this.Data=null;

    this.AskColor={ Line:g_JSChartResource.DepthChart.AskColor.Line, Area:g_JSChartResource.DepthChart.AskColor.Area }      //卖
    this.BidColor={ Line:g_JSChartResource.DepthChart.BidColor.Line, Area:g_JSChartResource.DepthChart.BidColor.Area }      //买
    this.LineWidth=g_JSChartResource.DepthChart.LineWidth;

    this.Draw=function()
    {
        if (!this.Data) return;

        this.Canvas.save();
        this.Canvas.lineWidth=this.LineWidth;
        this.DrawArea(this.Data.Bids, this.BidColor.Line, this.BidColor.Area, true);
        this.DrawArea(this.Data.Asks, this.AskColor.Line, this.AskColor.Area, false);
        this.Canvas.restore();
    }

    this.DrawArea=function(aryData, colorLine, colorArea, isLeft)
    {
        var xRange=this.ChartFrame.VerticalRange;
        var aryPoint=[];
        for(var i in aryData)
        {
            var item=aryData[i];
            if (isLeft)
            {
                if (item.Price<xRange.Min) break;
            }
            else
            {
                if (item.Price>xRange.Max) break;
            }

            var x=this.ChartFrame.GetXFromIndex(item.Price);
            var y=this.ChartFrame.GetYFromData(item.Vol);
            aryPoint.push({X:x,Y:y});
        }
        if (aryPoint.length<=1) return;

        var left=this.ChartBorder.GetLeft();
        var bottom=this.ChartBorder.GetBottom();
        var right=this.ChartBorder.GetRight();

        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X, bottom);
        for(var i in aryPoint)
        {
            var item=aryPoint[i];
            this.Canvas.lineTo(item.X,item.Y);
        }

        this.Canvas.lineTo(isLeft?left:right,aryPoint[aryPoint.length-1].Y);
        this.Canvas.lineTo(isLeft?left:right,bottom);
        this.Canvas.lineTo(aryPoint[0].X,bottom);
        this.Canvas.closePath();
        this.Canvas.fillStyle = colorArea;
        this.Canvas.fill();

        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X, bottom);
        for(var i in aryPoint)
        {
            var item=aryPoint[i];
            this.Canvas.lineTo(item.X,item.Y);
        }
        this.Canvas.lineTo(isLeft?left:right,aryPoint[aryPoint.length-1].Y);
        this.Canvas.strokeStyle=colorLine;
        this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var range={ Min:null, Max:null, XMin:null, XMax:null };
        var xRange=this.ChartFrame.VerticalRange;

        for(var i in this.Data.Asks)
        {
            var item=this.Data.Asks[i];
            if (item.Price>xRange.Max) break;
            
            if (range.XMin==null || range.XMin>item.Price) range.XMin=item.Price;
            if (range.XMax==null || range.XMax<item.Price) range.XMax=item.Price;
            if (range.Min==null || range.Min>item.Vol) range.Min=item.Vol;
            if (range.Max==null || range.Max<item.Vol) range.Max=item.Vol;
        }

        for(var i in this.Data.Bids)
        {
            var item=this.Data.Bids[i];
            if (item.Price<xRange.Min) break;

            if (range.XMin==null || range.XMin>item.Price) range.XMin=item.Price;
            if (range.XMax==null || range.XMax<item.Price) range.XMax=item.Price;
            if (range.Min==null || range.Min>item.Vol) range.Min=item.Vol;
            if (range.Max==null || range.Max<item.Vol) range.Max=item.Vol;
        }

        return range;
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
export
{
    IChartPainting,
    ChartKLine,
    ChartColorKline,
    ChartLine,
    ChartArea,
    ChartStepLine,
    ChartSubLine,
    ChartSingleText,
    ChartDrawIcon,
    ChartDrawText,
    ChartDrawNumber,
    ChartPointDot,
    ChartStick,
    ChartLineStick,
    ChartStickLine,
    ChartBackground,
    ChartBackgroundDiv,
    ChartMinuteVolumBar,
    ChartOverlayKLine,
    ChartLock,
    ChartVolStick,
    ChartBand,
    ChartMinutePriceLine,
    ChartOverlayMinutePriceLine,
    ChartLineMultiData,
    ChartStraightLine,
    ChartMultiSVGIconV2,
    ChartMinuteInfo,
    ChartRectangle,
    ChartMultiText,
    ChartMultiLine,
    ChartMultiPoint,
    ChartMultiHtmlDom,
    ChartMultiBar,
    ChartBuySell,
    ChartMACD,
    ChartStackedBar,
    ChartText,
    ChartStraightArea,
    ChartCorssCursor,
    DepthChartCorssCursor,
    ChartOrderbookDepth,
    ChartSplashPaint,
    GetFontHeight,
    ColorToRGBA,
    ChartSingleLine,
    ChartPartLine,
};
