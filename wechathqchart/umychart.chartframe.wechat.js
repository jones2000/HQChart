/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    指标窗口
*/

//日志
import { JSConsole } from "./umychart.console.wechat.js"

import
{
    g_JSChartResource,
    JSCHART_LANGUAGE_ID,
    g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import 
{
    Guid,
    JSCHART_EVENT_ID,
    ToFixedPoint,
    ToFixedRect,
    CloneData,
} from "./umychart.data.wechat.js";

import 
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
} from './umychart.framesplit.wechat.js'

import 
{ 
    g_MinuteTimeStringData
} from "./umychart.coordinatedata.wechat.js";


function IChartFramePainting() 
{
    this.HorizontalInfo = new Array();    //Y轴
    this.VerticalInfo = new Array();      //X轴
    this.ClassName='IChartFramePainting';
    this.Canvas;                        //画布

    this.Identify;                      //窗口标识
    this.Guid=Guid();                   //内部窗口唯一标识
    this.ChartBorder;
    this.PenBorder = g_JSChartResource.FrameBorderPen;        //边框颜色
    this.TitleBGColor = g_JSChartResource.FrameTitleBGColor;  //标题背景色
    this.IsShow = true;                   //是否显示
    this.SizeChange = true;               //大小是否改变
    this.XYSplit = true;                  //XY轴坐标信息改变
    this.XSplit=true;                     //X轴坐标信息改变
    this.YCustomSplit=true;               //Y轴自定刻度

    this.HorizontalMax;                 //Y轴最大值
    this.HorizontalMin;                 //Y轴最小值
    this.XPointCount = 10;              //X轴数据个数
    this.YMaxMin={ Max:null, Min:null };     //Y轴原始的最大值 最小值

    this.YSplitOperator;               //Y轴分割
    this.XSplitOperator;               //X轴分割
    this.Data;                         //主数据

    this.YSpecificMaxMin = null;         //指定Y轴最大最小值
    this.YSplitScale=null;               //固定分割刻度数组 [2,5,8]

    this.IsShowBorder = true;            //是否显示边框
    this.IsShowIndexName = true;         //是否显示指标名字
    this.IndexParamSpace = 2;            //指标参数数值显示间距
    this.IndexTitleSpace=0;             //指标标题到参数之间的间距

    this.IsShowTitleArrow=g_JSChartResource.IndexTitle.EnableIndexArrow;        //是否显示指标信息上涨下跌箭头
    this.TitleArrowType=g_JSChartResource.IndexTitle.ArrowType;             //指标信息上涨下跌箭头类型 0=独立颜色 1=跟指标名字颜色一致

    //上锁信息
    this.IsLocked = false;               //是否上锁
    this.LockPaint = null;

    this.BorderLine=null;               //1=上 2=下 4=左 8=右
    this.IsMinSize=false;               //窗口是否最小化

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.Draw = function () 
    {
        this.DrawFrame();
        this.DrawBorder();

        this.SizeChange = false;
        this.XYSplit = false;
        this.XSplit=false;
        this.YCustomSplit=false;
    }

    this.DrawFrame = function () { }

    this.GetBorder=function()
    {
        if (this.IsHScreen) return this.ChartBorder.GetHScreenBorder();
        else return this.ChartBorder.GetBorder();
    }

    this.ClearCoordinateText=function(option)
    {
        if (IFrameSplitOperator.IsNonEmptyArray(this.HorizontalInfo))
        {
            for(var i=0;i<this.HorizontalInfo.length;++i)
            {
                var item=this.HorizontalInfo[i];
                item.Message[0]=item.Message[1]=null;
            }
        }

        if (IFrameSplitOperator.IsNonEmptyArray(this.VerticalInfo))
        {
            for(var i=0;i<this.VerticalInfo.length;++i)
            {
                var item=this.VerticalInfo[i];
                item.Message[0]=item.Message[1]=null;
            }
        }
    }

    //画边框
    this.DrawBorder = function () 
    {
        if (!this.IsShowBorder) return;
        if (this.IsMinSize) return;

        var left = ToFixedPoint(this.ChartBorder.GetLeft());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var right = ToFixedPoint(this.ChartBorder.GetRight());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = right - left;
        var height = bottom - top;
        if (this.BorderLine==null)
        {
            this.Canvas.strokeStyle = this.PenBorder;
            this.Canvas.strokeRect(left, top, width, height);
        }
        else if (IFrameSplitOperator.IsNumber(this.BorderLine))
        {
            this.Canvas.strokeStyle=this.PenBorder;
            this.Canvas.beginPath();
            
            if ((this.BorderLine&1)>0) //上
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(right,top);
            }

            if ((this.BorderLine&2)>0)  //下
            {
                this.Canvas.moveTo(left,bottom);
                this.Canvas.lineTo(right,bottom);
            }

            if ((this.BorderLine&4)>0)  //左
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(left,bottom);
            }

            if ((this.BorderLine&8)>0)    //右
            {
                this.Canvas.moveTo(right,top);
                this.Canvas.lineTo(right,bottom);
            }
              
            this.Canvas.stroke();
        }
    }

    //左右刻度文字宽度
    this.GetScaleTextWidth=function() { }

    //画标题背景色
    this.DrawTitleBG = function () 
    {
        /* 指标信息背景色不画,画了感觉框架变小了
        if (this.ChartBorder.TitleHeight<=0) return;

        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetTopEx());
        var width=right-left;
        var height=bottom-top;

        this.Canvas.fillStyle=this.TitleBGColor;
        this.Canvas.fillRect(left,top,width,height);
        */
    }

    this.DrawLock = function () 
    {
        if (this.IsLocked) 
        {
            if (this.LockPaint == null) this.LockPaint = new ChartLock();

            this.LockPaint.Canvas = this.Canvas;
            this.LockPaint.ChartBorder = this.ChartBorder;
            this.LockPaint.ChartFrame = this;
            this.LockPaint.Draw();
        }
    }

    this.DrawLogo=function()
    {
        var border=this.GetBorder();
        var text=g_JSChartResource.FrameLogo.Text;
        if (!text) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        if (this.IsHScreen)
        {
            var x=border.Left+5;
            var y=border.Top+5;
            this.Canvas.save();
            this.Canvas.translate(x,y);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();
        }
        else
        {
            var x=border.Left+5;
            var y=border.Bottom-5;
            this.Canvas.fillText(text,x,y);
        }   
    }

    //设施上锁
    this.SetLock = function (lockData) 
    {
        if (!lockData)  //空数据不上锁
        {
            this.IsLocked = false;
            return;
        }

        this.IsLocked = true;
        if (!this.LockPaint) this.LockPaint = new ChartLock();    //创建锁
        if (lockData.Callback) this.LockPaint.Callback = lockData.Callback;       //回调
        if (lockData.IndexName) this.LockPaint.IndexName = lockData.IndexName;    //指标名字
        if (lockData.ID) this.LockPaint.LockID = lockData.ID;                     //锁ID
        if (lockData.BG) this.LockPaint.BGColor = lockData.BG;                    //背景色 
        if (lockData.Text) this.LockPaint.Title = lockData.Text;
        if (lockData.TextColor) this.LockPaint.TextColor = lockData.TextColor;
        if (lockData.Font) this.LockPaint.Font = lockData.Font;
        if (lockData.Count) this.LockPaint.LockCount = lockData.Count;
    }

    this.GetLockRect=function()
    {
        if (!this.IsLocked) return null;
        if (!this.LockPaint) return null; 
        return this.LockPaint.LockRect;
    }

    this.GetFontHeight=function(font)
    {
        if (font) this.Canvas.font=font;
        return this.Canvas.measureText("擎").width;
    }
}


//空框架只画边框
function NoneFrame() 
{
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='NoneFrame';

    this.Snapshot = function () { }

    this.DrawInsideHorizontal = function () { }

    this.SetSizeChage = function (sizeChange) 
    {
        this.SizeChange = sizeChange;

        //画布的位置
        this.Position =
        {
            X: this.ChartBorder.UIElement.offsetLeft,
            Y: this.ChartBorder.UIElement.offsetTop,
            W: this.ChartBorder.UIElement.clientWidth,
            H: this.ChartBorder.UIElement.clientHeight
        };
    }
}

function AverageWidthFrame() 
{
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='AverageWidthFrame';

    this.DataWidth = 50;
    this.DistanceWidth = 10;
    this.MinXDistance = 30;       //X轴刻度最小间距
    this.MinYDistance=10;
    this.XMessageAlign = 'top';   //X轴刻度文字上下对齐方式
    this.IsShowTitle = true;      //是否显示动态标题
    this.IsShowYText = [true, true];       //是否显示Y轴坐标坐标 [0=左侧] [1=右侧]
    this.XBottomOffset = g_JSChartResource.Frame.XBottomOffset;   //X轴文字显示向下偏移
    this.YTextTopOffset=g_JSChartResource.Frame.YTopOffset;         //Y轴顶部文字向下偏移
    this.YTextPosition=[0,0],       //是坐标否强制画在内部 [0=左侧] [1=右侧] 1=OUT" , 2=INSIDE
    this.YTextPadding=[g_JSChartResource.Frame.YTextPadding[0], g_JSChartResource.Frame.YTextPadding[1]],        //Y轴文字和边框间距 [0=左侧] [1=右侧]
    this.IsShowXLine=true;              //是否显示X轴刻度线
    this.IsShowYLine=true;
    this.YTextBaseline=0;  //0=居中 1=上部 (目前就支持内部刻度)

    this.ShortYLineLength=5;
    this.ShortXLineLength=5;
   
    this.DrawOtherChart;      //其他画法调用
    this.GetEventCallback;    //事件回调

    this.FrameData={ SubFrameItem:null };    //窗口框架信息

    this.DrawFrame = function () 
    {
        if (this.XPointCount > 0) 
        {
            this.DistanceWidth = this.ChartBorder.GetWidth() / (4 * this.XPointCount);
            this.DataWidth = 2 * this.DistanceWidth;
        }

        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetBottomEx();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetTopEx();

        var height = this.ChartBorder.GetHeightEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetBottomEx() - height;
    }

    //Y刻度画在内部
    this.DrawInsideHorizontal = function () 
    {
        if (this.IsHScreen === true) return;  //横屏不画
        if (this.IsMinSize) return;
        if (this.IsShowYText[0] === false && this.IsShowYText[1] === false) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;
        if (borderLeft >= 10 && borderRight>=10) return;
        if ((borderLeft < 10 && this.IsShowYText[0] === true) || (borderRight < 10 && this.IsShowYText[1] === true))
        {
            var yPrev = null; //上一个坐标y的值
            for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
            {
                var item = this.HorizontalInfo[i];
                if (!item) continue;
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev !=null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && borderLeft < 10 && this.IsShowYText[0] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    var textHeight=this.Canvas.measureText('擎').width;
                    var yText=y;
                    if (y >= bottom - 2) 
                    {
                        this.Canvas.textBaseline = 'bottom';
                    }
                    else if (y-textHeight/2 <= top) 
                    {
                        this.Canvas.textBaseline = 'top';
                        yText+=this.YTextTopOffset;
                    }
                    else 
                    {
                        if (this.YTextBaseline==1) this.Canvas.textBaseline = "bottom";
                        else this.Canvas.textBaseline = "middle";
                    }
                    var textObj = { X: left, Y: yText, Text: { BaseLine: this.Canvas.textBaseline, Font: this.Canvas.font, Value: item.Message[0] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj)) this.Canvas.fillText(item.Message[0], left + 1, yText);
                }

                if (item.Message[1] != null && borderRight < 10 && this.IsShowYText[1] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    var textHeight=this.Canvas.measureText('擎').width;
                    var yText=y;
                    if (y >= bottom - 2) 
                    {
                        this.Canvas.textBaseline = 'bottom';
                    }
                    else if (y-textHeight/2 <= top) 
                    {
                        this.Canvas.textBaseline = 'top';
                        yText+=this.YTextTopOffset;
                    }
                    else 
                    {
                        if (this.YTextBaseline==1) this.Canvas.textBaseline = "bottom";
                        else this.Canvas.textBaseline = "middle";
                    }
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: yText, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj))
                        this.Canvas.fillText(item.Message[1], right - 1, yText);
                }

                yPrev = y;
            }
        }
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;

        this.Canvas.save();
        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && yPrev != null && Math.abs(y - yPrev) <this.MinYDistance) continue;  //两个坐标在近了 就不画了

            var yFixed=ToFixedPoint(y);
            if (bottom!=y && this.IsShowYLine) //和底部线段重叠了就不绘制
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (item.LineDash) this.Canvas.setLineDash(item.LineDash);
                    else this.Canvas.setLineDash([5,5]);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, yFixed);
                    this.Canvas.lineTo(right,yFixed);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType==3)  //只在刻度边上画一个短横线
                {

                }
                else if (item.LineType>0)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if(g_JSChartResource.FrameYLineDash)
                    {
                        this.Canvas.setLineDash(g_JSChartResource.FrameYLineDash);   //虚线
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(left, yFixed);
                        this.Canvas.lineTo(right, yFixed);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(left, yFixed);
                        this.Canvas.lineTo(right, yFixed);
                        this.Canvas.stroke();
                    }
                }
            }
            var yText=y;
            if (y >= bottom - 2) 
            {
                this.Canvas.textBaseline = 'bottom';
            }
            else if (y <= top + 2) 
            {
                this.Canvas.textBaseline = 'top';
                yText+=this.YTextTopOffset;
            }
            else 
            {
                this.Canvas.textBaseline = "middle";
            }

            //坐标信息 左边 间距小于10 不画坐标
            this.Canvas.fillStyle = item.TextColor;
            this.Canvas.strokeStyle = item.TextColor;
            if (item.Message[0] != null && borderLeft > 10 && this.IsShowYText[0] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                
                this.Canvas.textAlign = "right";
                this.Canvas.fillText(item.Message[0], left - this.YTextPadding[0], yText);
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderRight > 10 && this.IsShowYText[1] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                var xText=right;
                if (item.LineType==3)
                {
                    var lineLength=this.ShortYLineLength;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xText,yFixed);
                    this.Canvas.lineTo(xText+lineLength,yFixed);
                    this.Canvas.stroke();

                    xText+=lineLength;
                }

                this.Canvas.textAlign = "left";
                this.Canvas.fillText(item.Message[1], xText + this.YTextPadding[1], yText);
            }

            yPrev = y;
        }

        this.Canvas.restore();
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount;

        if (count == 1) 
        {
            if (index == 0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count <= 0) 
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index >= count) 
        {
            return this.ChartBorder.GetRight();
        }
        else 
        {
            var offset = this.ChartBorder.GetLeft() + this.ChartBorder.GetWidth() * index / count;
            return offset;
        }
    }

    //画X轴
    this.DrawVertical = function ()
    {
        var top = this.ChartBorder.GetTopTitle();
        var bottom = this.ChartBorder.GetBottom();
        var right = this.ChartBorder.GetRight();

        var yText = bottom;
        if (this.XMessageAlign == 'bottom') yText = this.ChartBorder.GetChartHeight();
        else this.XMessageAlign = 'top';

        var xPrev = null; //上一个坐标x的值
        let xPrevTextRight = null;
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x > right) break;
            if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

            var item=this.VerticalInfo[i];
            var xFixed=ToFixedPoint(x);
            if (this.IsShowXLine && item.LineType > 0) 
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (item.LineDash) this.Canvas.setLineDash(item.LineDash);
                    else this.Canvas.setLineDash([5,5]);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xFixed, top);
                    this.Canvas.lineTo(xFixed, bottom);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType==3)
                {

                }
                else if (item.LineType>0)
                {
                    if(g_JSChartResource.FrameXLineDash)
                    {
                        this.Canvas.strokeStyle = item.LineColor;
                        this.Canvas.beginPath();
                        this.Canvas.setLineDash(g_JSChartResource.FrameXLineDash);
                        this.Canvas.moveTo(xFixed, top);
                        this.Canvas.lineTo(xFixed, bottom);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.strokeStyle = item.LineColor;
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(xFixed, top);
                        this.Canvas.lineTo(xFixed, bottom);
                        this.Canvas.stroke();
                    }
                }
                
            }

            if (this.VerticalInfo[i].Message[0] != null && this.ChartBorder.Bottom > 5) 
            {
                let xTextRight = null;
                let xTextLeft = null;
                if (this.VerticalInfo[i].Font != null)
                this.Canvas.font = this.VerticalInfo[i].Font;
                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.strokeStyle=item.TextColor;

                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else if ((x + testWidth / 2) >= this.ChartBorder.GetChartWidth()) 
                {
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else 
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth / 2;
                    xTextLeft = x - testWidth / 2;
                }

                if (xPrevTextRight != null && xPrevTextRight > xTextLeft) continue;

                var yText=bottom;
                if (item.LineType==3)
                {
                    var lineLength=this.ShortXLineLength;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xFixed,yText);
                    this.Canvas.lineTo(xFixed,yText+lineLength);
                    this.Canvas.stroke();

                    yText+=lineLength+2;
                }

                this.Canvas.fillText(this.VerticalInfo[i].Message[0], x, yText + this.XBottomOffset);
                xPrevTextRight = xTextRight;
            }

            xPrev = x;
        }
    }

    this.GetYData = function (y) //Y坐标转y轴数值
    {
        if (y < this.ChartBorder.GetTopEx()) return this.HorizontalMax;
        if (y > this.ChartBorder.GetBottomEx()) return this.HorizontalMin;

        return (this.ChartBorder.GetBottomEx() - y) / this.ChartBorder.GetHeightEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    this.GetXData = function (x) //X坐标转x轴数值
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount;

        return (x - this.ChartBorder.GetLeft()) * (this.XPointCount * 1.0 / this.ChartBorder.GetWidth());
    }

    this.DrawCustomItem = function (item) //显示自定义刻度
    {
        //if (this.IsHScreen === true) return;  //横屏不画
        if (!item.Message[1] && !item.Message[0]) return;
        if (item.Value > this.HorizontalMax || item.Value < this.HorizontalMin) 
        {
            if (item.CountDown===true) this.SendDrawCountDownEvent( { IsShow:false } );
            return;
        }

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;

        if (this.IsHScreen) 
        {
            borderLeft = this.ChartBorder.Top;
            borderRight = this.ChartBorder.Bottom;
            top = this.ChartBorder.GetTop();
            bottom = this.ChartBorder.GetBottom();
        }

        var defaultTextHeight=16
        var textHeight = defaultTextHeight;
        var y = this.GetYFromData(item.Value);
        var position=0;

        if (item.ExtendData && item.ExtendData.Custom)
        {
            var customItem=item.ExtendData.Custom;
            if (IFrameSplitOperator.IsNumber(customItem.Position)) position=customItem.Position;
        }

        if (item.Message[0]) 
        {
            if (borderLeft < 10 || position==1)    //左边
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textInfo=this.GetCustomItemTextInfo(item,true);
                var textWidth = textInfo.MaxWidth;
                var fontHeight=this.GetFontHeight();
                textHeight=fontHeight>defaultTextHeight? fontHeight:defaultTextHeight;
                var bgColor = item.LineColor;
                var rgb = this.RGBToStruct(item.LineColor);
                if (rgb) bgColor = `rgba(${rgb.R}, ${rgb.G}, ${rgb.B}, ${g_JSChartResource.FrameLatestPrice.BGAlpha})`;   //内部刻度 背景增加透明度

                var yText=y;
                for(var i=0;i<textInfo.Text.length;++i)
                {
                    var itemText=textInfo.Text[i];
                    if (this.IsHScreen) 
                    {
                        var bgTop = top;
                        var textLeft = yText - textHeight / 2 - 1;
                        this.Canvas.fillStyle = bgColor;
                        this.Canvas.fillRect(textLeft, bgTop, textHeight, textWidth);
                        this.DrawHScreenText({ X: yText, Y: bgTop }, { Text: itemText.Text, Color: item.TextColor, XOffset: 1, YOffset: 2 });
                        if (i==0) this.DrawLine(bgTop + itemText.Width, bottom, yText, item.LineColor,item.LineType);

                        yText-=textHeight+1;
                    }
                    else
                    {
                        var bgTop = yText - textHeight / 2 - 1;
                        var textLeft = left + 1;
                        this.Canvas.fillStyle = bgColor;
                        this.Canvas.fillRect(textLeft, bgTop, itemText.Width, textHeight);
                        this.Canvas.fillStyle = item.TextColor;
                        this.Canvas.fillText(itemText.Text, textLeft + 1, yText);
                        if (i==0) this.DrawLine(textLeft + itemText.Width, right, yText, item.LineColor,item.LineType);

                        yText+=textHeight+1;
                    }
                }
            }
            else 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";
                var textInfo=this.GetCustomItemTextInfo(item,true);
                var textWidth=textInfo.MaxWidth;
                var fontHeight=this.GetFontHeight();
                textHeight=fontHeight>defaultTextHeight? fontHeight:defaultTextHeight;

                var yText=y;
                for(var i=0;i<textInfo.Text.length;++i)
                {
                    var itemText=textInfo.Text[i];
                    if (this.IsHScreen) 
                    {
                        if (i==0) var bgTop=top-itemText.Width;
                        else var bgTop=top-textWidth;
                        var textLeft=yText-textHeight/2-1;
                        this.Canvas.fillStyle=item.LineColor;
                        this.Canvas.fillRect(textLeft,bgTop,textHeight,itemText.Width);
                        this.DrawHScreenText({ X: yText, Y: bgTop }, { Text: itemText.Text, Color: item.TextColor, XOffset: 1, YOffset: 2 });
                        if (i==0) this.DrawLine(bgTop + itemText.Width, bottom, yText, item.LineColor,item.LineType);

                        yText-=textHeight+1;
                    }
                    else
                    {
                        var bgTop = yText - textHeight / 2 - 1;
                        if (i==0)
                        {
                            var rectLeft=left-itemText.Width;
                            var textLeft=left;
                        }
                        else
                        {
                            var rectLeft=left-textWidth;
                            var textLeft=left-(textWidth-itemText.Width);
                        }

                        this.Canvas.fillStyle = item.LineColor;
                        this.Canvas.fillRect(rectLeft,bgTop,itemText.Width,textHeight);
                        this.Canvas.fillStyle = item.TextColor;
                        this.Canvas.fillText(itemText.Text, textLeft - 1, yText);
                        if (i==0) this.DrawLine(left, right, yText, item.LineColor,item.LineType);

                        yText+=textHeight+1;
                    }
                }
            }
        }
        else if (item.Message[1])   //右边
        {
            if (borderRight < 10 || position==1) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textInfo=this.GetCustomItemTextInfo(item,false);
                var textWidth=textInfo.MaxWidth;
                var fontHeight=this.GetFontHeight();
                textHeight=fontHeight>defaultTextHeight? fontHeight:defaultTextHeight;
                var bgColor = item.LineColor;
                var rgb = this.RGBToStruct(item.LineColor);
                if (rgb) bgColor = `rgba(${rgb.R}, ${rgb.G}, ${rgb.B}, ${g_JSChartResource.FrameLatestPrice.BGAlpha})`;   //内部刻度 背景增加透明度

                var yText=y;
                for(var i=0;i<textInfo.Text.length;++i)
                {
                    var itemText=textInfo.Text[i];
                    if (this.IsHScreen) 
                    {
                        var bgTop=bottom-itemText.Width;
                        var textLeft=yText-textHeight/2-1;
                        this.Canvas.fillStyle=bgColor;
                        this.Canvas.fillRect(textLeft,bgTop,textHeight,itemText.Width);
                        this.DrawHScreenText({X:yText, Y:bgTop}, {Text:itemText.Text, Color:item.TextColor, XOffset:1, YOffset:2});
                        if (i==0) this.DrawLine(top, bgTop, yText, item.LineColor,item.LineType);

                        yText-=textHeight+1;
                    }
                    else
                    {
                        var bgTop=yText-textHeight/2-1;
                        var textLeft=right-itemText.Width;
                        this.Canvas.fillStyle=bgColor;
                        this.Canvas.fillRect(textLeft, bgTop, itemText.Width, textHeight);
                        this.Canvas.fillStyle = item.TextColor;
                        this.Canvas.fillText(itemText.Text, textLeft + 1, yText);
                        if (i==0) this.DrawLine(left, textLeft,yText , item.LineColor,item.LineType);

                        if (item.CountDown===true)
                        {
                            if (this.GetEventCallback)
                            {
                                var bgTop=yText + textHeight / 2 + 1;
                                var sendData=
                                { 
                                    Top:bgTop, Right:right, Height:null, 
                                    IsShow:true, BGColor:bgColor, TextColor:item.TextColor, Position:"Right", IsInside:true
                                };
                                this.SendDrawCountDownEvent(sendData);
                            }
                        }

                        yText+=textHeight+1;
                    }
                }

                if (item.Type==3 || item.Type==4)
                {
                    if (item.Title)
                    {
                        var width=this.Canvas.measureText(item.Title).width+2;
                        if (this.IsHScreen)
                        {
                            var bgTop=bottom-itemText.Width-width;
                            var textLeft=y-textHeight/2-1;
                            this.Canvas.fillStyle=bgColor;
                            this.Canvas.fillRect(textLeft,bgTop,textHeight,width);
                            this.DrawHScreenText({X:y, Y:bgTop}, {Text:item.Title, Color:item.TextColor, XOffset:1, YOffset:2});
                        }
                        else
                        {
                            var bgTop=y-textHeight/2-1;
                            var textLeft=right-textWidth-width-1;
                            this.Canvas.fillStyle=bgColor;
                            this.Canvas.fillRect(textLeft,bgTop,width,textHeight);
                            this.Canvas.fillStyle = item.TextColor;
                            this.Canvas.fillText(item.Title, textLeft + 1, y);
                        }
                    }
                }
            }
            else 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textInfo=this.GetCustomItemTextInfo(item,false);
                var textWidth=textInfo.MaxWidth;
                var fontHeight=this.GetFontHeight();
                textHeight=fontHeight>defaultTextHeight? fontHeight:defaultTextHeight;

                var yText=y;
                for(var i=0;i<textInfo.Text.length;++i)
                {
                    var itemText=textInfo.Text[i];
                    
                    if (this.IsHScreen) 
                    {
                        var bgTop = bottom;
                        var textLeft=yText-textHeight/2-1;
                        this.Canvas.fillStyle=item.LineColor;
                        this.Canvas.fillRect(textLeft, bgTop, textHeight, itemText.Width);
                        this.DrawHScreenText({ X: yText, Y: bgTop }, { Text: itemText.Text, Color: item.TextColor, XOffset: 1 , YOffset: 2 });
                        if (i==0)  this.DrawLine(top, bgTop, yText, item.LineColor,item.LineType);

                        yText-=textHeight+1;
                    }
                    else
                    {
                        var bgTop=yText-textHeight/2-1;
                        if (i==0)
                        {
                            var textLeft=right;
                        }
                        else
                        {
                            var textLeft=right+textWidth-itemText.Width;
                        }

                        this.Canvas.fillStyle = item.LineColor;
                        this.Canvas.fillRect(textLeft,bgTop,itemText.Width,textHeight);
                        this.Canvas.fillStyle = item.TextColor;
                        this.Canvas.fillText(itemText.Text, textLeft+1, yText);
                        if (i==0) this.DrawLine(left, right, yText, item.LineColor,item.LineType);

                        if (item.CountDown===true)
                        {
                            if (this.GetEventCallback)
                            {
                                var bgTop=yText-textHeight/2-1;
                                var sendData=
                                { 
                                    Top:bgTop, Left:right, Right:this.ChartBorder.GetChartWidth(), Height:null, 
                                    IsShow:true, BGColor:item.LineColor, TextColor:item.TextColor, Position:"Right", IsInside:false
                                };
                                this.SendDrawCountDownEvent(sendData);
                            }
                        }

                        yText+=textHeight+1;
                    }
                }

                if (item.Type==3 || item.Type==4)
                {
                    if (item.Title)
                    {
                        var bgColor=item.LineColor;
                        var rgb=this.RGBToStruct(item.LineColor);
                        if (rgb) bgColor=`rgba(${rgb.R}, ${rgb.G}, ${rgb.B}, ${g_JSChartResource.FrameLatestPrice.BGAlpha})`;   //内部刻度 背景增加透明度
                        var width=this.Canvas.measureText(item.Title).width+2;
                        if (this.IsHScreen)
                        {
                            var bgTop=bottom-width;
                            var textLeft=y-textHeight/2-1;
                            this.Canvas.fillStyle=bgColor;
                            this.Canvas.fillRect(textLeft,bgTop,textHeight,width);
                            this.DrawHScreenText({X:y, Y:bgTop}, {Text:item.Title, Color:item.TextColor, XOffset:1, YOffset:2});
                        }
                        else
                        {
                            var bgTop=y-textHeight/2-1;
                            var textLeft=right-width-1;
                            this.Canvas.fillStyle=bgColor;
                            this.Canvas.fillRect(textLeft,bgTop,width,textHeight);
                            this.Canvas.fillStyle = item.TextColor;
                            this.Canvas.fillText(item.Title, textLeft + 1, y);
                        }
                    }
                }
            }
        }
    }

    this.GetCustomItemTextInfo=function(item, bLeft)
    {
        var text=bLeft?item.Message[0]:item.Message[1];
        var aryText=[];
        var width=0;
        if (Array.isArray(text))
        {
            for(var i=0;i<text.length;++i)
            {
                var item=text[i];
                if (item.Type===1)
                {
                    aryText.push({ Type: item.Type });
                }
                else
                {
                    var value=this.Canvas.measureText(item.Text).width;
                    if (value>width) width=value;
                    aryText.push({Text:item.Text, Width:value+3});
                }
            }

            if (width>0) width+=3;
        }
        else
        {
            width=this.Canvas.measureText(text).width+3;
            aryText.push( {Text:text, Width:width} );
        }
        
        return  { MaxWidth:width, Text:aryText };
    }

    this.SendDrawCountDownEvent=function(sendData)
    {
        if (!this.GetEventCallback) return false;
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_COUNTDOWN);
        if (!event || !event.Callback) return false;

        event.Callback(event,sendData,this);
        return true;
    }

    this.DrawLine=function(left, right, y, color, lineType)
    {
        if (lineType==-1) return;

        if (lineType==0)
        {
            this.Canvas.strokeStyle = color;
            this.Canvas.beginPath();
            if (this.IsHScreen) 
            {
                this.Canvas.moveTo(ToFixedPoint(y), left);
                this.Canvas.lineTo(ToFixedPoint(y), right);
            }
            else
            {
                this.Canvas.moveTo(left, ToFixedPoint(y));
                this.Canvas.lineTo(right, ToFixedPoint(y));
            }
            this.Canvas.stroke();
        }
        else
        {
            this.DrawDotLine(left, right, y, color);
        }
    }

    this.DrawDotLine = function (left, right, y, color) 
    {
        this.Canvas.save();
        this.Canvas.strokeStyle = color;
        this.Canvas.setLineDash([5, 5]);   //虚线
        this.Canvas.beginPath();
        if (this.IsHScreen) 
        {
            this.Canvas.moveTo(ToFixedPoint(y), left);
            this.Canvas.lineTo(ToFixedPoint(y), right);
        }
        else
        {
            this.Canvas.moveTo(left, ToFixedPoint(y));
            this.Canvas.lineTo(right, ToFixedPoint(y));
        }
        this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.RGBToStruct = function (rgb) 
    {
        if (/^(rgb|RGB)/.test(rgb)) 
        {
            var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var result = {};
            if (aColor.length != 3) return null;

            result.R = Number(aColor[0]);
            result.G = Number(aColor[1]);
            result.B = Number(aColor[2]);
            return result;
        }
        return null;
    }

    this.DrawHScreenText = function (center, data) 
    {
        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillStyle = data.Color;

        this.Canvas.save();
        this.Canvas.translate(center.X, center.Y);
        this.Canvas.rotate(90 * Math.PI / 180);
        this.Canvas.fillText(data.Text, data.XOffset, data.YOffset);
        this.Canvas.restore();
    }

    this.GetScaleTextWidth=function()
    {
        var border=this.ChartBorder.GetBorder();
        if (this.IsHScreen)
        {
            var borderTop = this.ChartBorder.Top;
            var borderBottom = this.ChartBorder.Bottom;
            var isDrawLeft=borderTop>10 && this.IsShowYText[0]===true;
            var isDrawRight=borderBottom>10 && this.IsShowYText[1]===true;
        }
        else
        {
            var borderRight=this.ChartBorder.Right;
            var borderLeft=this.ChartBorder.Left;
            var isDrawLeft=borderLeft>10 && this.IsShowYText[0]===true;
            var isDrawRight=borderRight>10 && this.IsShowYText[1]===true;
        }
        
        var width={ Left:null, Right:null };
        if (!isDrawRight && !isDrawLeft) return width;

        for(var i=0;i<this.HorizontalInfo.length;++i)
        {
            var textWidth=null;
            var item=this.HorizontalInfo[i];
            if (!item) continue;
            if (item.Font!=null) this.Canvas.font=item.Font;

            if (item.Message[0]!=null && isDrawLeft)
            {
                textWidth=this.Canvas.measureText(item.Message[0]).width;
                if (width.Left==null || width.Left<textWidth)
                    width.Left=textWidth;
            }

            if (item.Message[1]!=null && isDrawRight)
            {
                textWidth=this.Canvas.measureText(item.Message[1]).width;
                if (width.Right==null || width.Right<textWidth)
                    width.Right=textWidth;
            }
        }

        if (IFrameSplitOperator.IsNumber(width.Left)) width.Left+=this.YTextPadding[0];
        if (IFrameSplitOperator.IsNumber(width.Right)) width.Right+=this.YTextPadding[1];
        
        return { TextWidth:width };
    }

    this.GetMainOverlayFrame=function()
    {
        if (!this.FrameData || !this.FrameData.SubFrameItem)  return null;

        var subFrame=this.FrameData.SubFrameItem;
        var leftFrame=null, rightFrame=null;
        for(var i=0;i<subFrame.OverlayIndex.length;++i)
        {
            var item=subFrame.OverlayIndex[i];
            var overlayFrame=item.Frame;
            if (overlayFrame.IsShowMainFrame==2) rightFrame=overlayFrame;
            else if (overlayFrame.IsShowMainFrame==1) leftFrame=overlayFrame;
        }

        if (!leftFrame && !rightFrame) return null;

        return [leftFrame, rightFrame];
    }
}

function MinuteFrame() 
{
    this.newMethod = AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='MinuteFrame';

    this.DataWidth=1;
    this.DistanceWidth=1;
    this.MinXDistance = 10;
    this.CustomHorizontalInfo = [];

    this.NightDayConfig=CloneData(g_JSChartResource.Minute.NightDay);


    this.DrawFrame = function () 
    {
        if (this.IsMinSize) return;

        this.SplitXYCoordinate();
        this.DrawNightDayBG();  //绘制夜盘 日盘背景
        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate = function () 
    {
        if (this.XYSplit == false) 
        {
            if (this.YCustomSplit)
            {
                if (this.YSplitOperator && this.YSplitOperator.CustomCoordinate) this.YSplitOperator.CustomCoordinate();
            }
            return;
        }

        if (this.YSplitOperator != null) this.YSplitOperator.Operator();
        if (this.XSplitOperator != null) this.XSplitOperator.Operator();
    }

    this.DrawNightDayBG=function()
    {
        if (this.DayCount!=1) return;
        if (!this.HQChart) return;
        if (!this.HQChart.EnableNightDayBG) return;

        var symbol=this.HQChart.Symbol;
        if (!symbol) return;

        var xIndex=-1;
        //获取夜盘和日期的分界线X索引位置
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_MINUTE_NIGHT_DAY_X_INDEX)
        if (!event || !event.Callback) return;

        var sendData={ Symbol:symbol, XIndex:xIndex, MinuteTimeStringData:g_MinuteTimeStringData };
        event.Callback(event,sendData,this);
        xIndex=sendData.XIndex;
        if (xIndex<0) return;

        var border=this.ChartBorder.GetBorder();
        var x=this.GetXFromIndex(xIndex);

        var rtNight={ Left: border.Left, Top:border.TopEx, Right:x, Bottom:border.Bottom };
        rtNight.Width=rtNight.Right-rtNight.Left;
        rtNight.Height=rtNight.Bottom-rtNight.Top;

        this.Canvas.fillStyle = this.NightDayConfig.NightBGColor;
        this.Canvas.fillRect(rtNight.Left, rtNight.Top, rtNight.Width, rtNight.Height);

        if (this.Identify!=0) return;

        //显示 日盘夜盘文字
        this.Canvas.font=this.NightDayConfig.Font;
		this.Canvas.textBaseline = "bottom";
		this.Canvas.textAlign = 'left';
		var aryTitle=[{ Title:"夜盘", Position:1, Config:this.NightDayConfig.Night }, { Title:"日盘", Position:0,Config:this.NightDayConfig.Day }];
		var textHeight= this.Canvas.measureText("擎").width;
		for(var i=0;i<aryTitle.length;++i)
		{
			var item=aryTitle[i];
            var text=g_JSChartLocalization.GetText(item.Title,this.HQChart.LanguageID);
			var testWidth = this.Canvas.measureText(text).width;
			var rtItem=
			{ 
				Width:testWidth+item.Config.Margin.Left+item.Config.Margin.Right, 
				Height:textHeight+item.Config.Margin.Top+item.Config.Margin.Bottom,
				Bottom:border.Bottom
			};
			rtItem.Top=rtItem.Bottom-rtItem.Height;

			if (item.Position===1) 
			{
				rtItem.Right=x-1;
				rtItem.Left=rtItem.Right-rtItem.Width;
			}
			else 
			{
				rtItem.Left=x+1;
				rtItem.Right=rtItem.Left+rtItem.Width;
			}

			if (item.Config.BGColor)
			{
				this.Canvas.fillStyle = item.Config.BGColor;
				this.Canvas.fillRect(rtItem.Left, rtItem.Top, rtItem.Width, rtItem.Height);
			}

			if (item.Config.BorderColor)
			{
				this.Canvas.strokeStyle = item.Config.BorderColor;
				this.Canvas.strokeRect(ToFixedPoint(rtItem.Left), ToFixedPoint(rtItem.Top), ToFixedRect(rtItem.Width), ToFixedRect(rtItem.Height));
			}
            
			this.Canvas.fillStyle = item.Config.Color;
			this.Canvas.fillText(text, rtItem.Left+item.Config.Margin.Left, rtItem.Bottom-item.Config.Margin.Bottom );
		}
        
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount - 1;

        if (count == 1) 
        {
            if (index == 0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count <= 0) 
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index >= count) 
        {
            return this.ChartBorder.GetRight();
        }
        else 
        {
            var offset = this.ChartBorder.GetLeft() + this.ChartBorder.GetWidth() * index / count;
            return offset;
        }
    }

    //X坐标转x轴数值
    this.GetXData = function (x) 
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount;

        return (x - this.ChartBorder.GetLeft()) * (this.XPointCount * 1.0 / this.ChartBorder.GetWidth());
    }

    this.DrawCustomHorizontal = function ()    //Y轴刻度定制显示
    {
        if (this.IsMinSize) return;
        for (var i in this.CustomHorizontalInfo) 
        {
            var item = this.CustomHorizontalInfo[i];
            switch (item.Type) 
            {
                case 0:
                case 1:
                    this.DrawCustomItem(item);  //自定义刻度
                    break;
            }
        }
    }
}

function MinuteHScreenFrame() 
{
    this.newMethod = MinuteFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='MinuteHScreenFrame';
    this.IsHScreen = true;        //是否是横屏

    //画标题背景色
    this.DrawTitleBG = function () 
    {
        /*
        if (this.ChartBorder.TitleHeight <= 0) return;

        var left = ToFixedPoint(this.ChartBorder.GetRightEx());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = this.ChartBorder.TitleHeight;
        var height = bottom - top;

        this.Canvas.fillStyle = this.TitleBGColor;
        this.Canvas.fillRect(left, top, width, height);
        */
    }

    this.DrawInsideHorizontal = function () 
    {
        if (this.IsMinSize) return;
        if (this.IsShowYText[0] === false && this.IsShowYText[1] === false) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;
        var titleHeight = this.ChartBorder.TitleHeight;
        var pixelTatio = 1;

        var isDrawLeft = (borderTop < 10 * pixelTatio || this.YTextPosition[0] == 2) && this.IsShowYText[0] === true;
        var isDrawRight = (borderBottom < 10 * pixelTatio || this.YTextPosition[1] == 2) && this.IsShowYText[1] === true;

        if (isDrawLeft || isDrawRight) 
        {
            var yPrev = null; //上一个坐标y的值
            for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
            {
                var item = this.HorizontalInfo[i];
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev != null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && isDrawLeft) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";

                    var textObj = { X: left, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[0] } };
                    var xText = y, yText = top;
                    this.Canvas.save();
                    this.Canvas.translate(xText, yText);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Message[0], 2, 0);
                    this.Canvas.restore();
                }

                if (item.Message[1] != null && isDrawRight) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };

                    var xText = y, yText = bottom;
                    this.Canvas.save();
                    this.Canvas.translate(xText, yText);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Message[1], -2, 0);
                    this.Canvas.restore();
                }
                yPrev = y;
            }
        }
    }

    //Y坐标转y轴数值
    this.GetYData = function (x) 
    {
        if (x < this.ChartBorder.GetLeftEx()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeftEx()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData = function (y) 
    {
        if (y <= this.ChartBorder.GetTop()) return 0;
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount;

        var count=this.XPointCount-1;
        return (y - this.ChartBorder.GetTop()) * (count * 1.0 / this.ChartBorder.GetHeight());
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount - 1;

        if (count == 1) 
        {
            if (index == 0) return this.ChartBorder.GetTop();
            else return this.ChartBorder.GetBottom();
        }
        else if (count <= 0) 
        {
            return this.ChartBorder.GetTop();
        }
        else if (index >= count) 
        {
            return this.ChartBorder.GetBottom();
        }
        else 
        {
            var offset = this.ChartBorder.GetTop() + this.ChartBorder.GetHeight() * index / count;
            return offset;
        }
    }


    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeftEx();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width = this.ChartBorder.GetWidthEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeftEx() + width;
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle = item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y), top);
            this.Canvas.lineTo(ToFixedPoint(y), bottom);
            this.Canvas.stroke();

            if (y >= right - 2) 
            {
                this.Canvas.textBaseline = 'top';
                y = right;
            }
            else if (y <= left + 2) 
            {
                this.Canvas.textBaseline = 'bottom';
                y=left;
                if (y != null && Math.abs(y - yPrev) < 2*this.MinYDistance) continue;  //两个坐标在近了 就不画了
            }
            else 
            {
                this.Canvas.textBaseline = "middle";
            }

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                //this.Canvas.textBaseline = "middle";

                var xText = y, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderBottom > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "left";
                //this.Canvas.textBaseline = "middle";
                var xText = y, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev = y;
        }
    }

    //画X轴
    this.DrawVertical = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var bottom = this.ChartBorder.GetBottom();

        var xPrev = null; //上一个坐标x的值
        for (var i in this.VerticalInfo) {
        var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
        if (x > bottom) break;
        if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

        this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(left, ToFixedPoint(x));
        this.Canvas.lineTo(right, ToFixedPoint(x));
        this.Canvas.stroke();

        if (this.VerticalInfo[i].Message[0] != null) {
            if (this.VerticalInfo[i].Font != null)
            this.Canvas.font = this.VerticalInfo[i].Font;

            this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
            var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
            if (x < testWidth / 2) {
            this.Canvas.textAlign = "left";
            this.Canvas.textBaseline = "top";
            }
            else if ((x + testWidth / 2) >= this.ChartBorder.GetChartHeight()) {
            this.Canvas.textAlign = "right";
            this.Canvas.textBaseline = "top";
            }
            else {
            this.Canvas.textAlign = "center";
            this.Canvas.textBaseline = "top";
            }

            var xText = left, yText = x;
            this.Canvas.save();
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, 0);
            this.Canvas.restore();
        }

        xPrev = x;
        }
    }

    this.DrawNightDayBG=function()
    {
        if (this.DayCount!=1) return;
        if (!this.HQChart) return;
        if (!this.HQChart.EnableNightDayBG) return;

        var symbol=this.HQChart.Symbol;
        if (!symbol) return;

        var xIndex=-1;
        //获取夜盘和日期的分界线X索引位置
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CUSTOM_MINUTE_NIGHT_DAY_X_INDEX)
        if (!event || !event.Callback) return;

        var sendData={ Symbol:symbol, XIndex:xIndex, MinuteTimeStringData:g_MinuteTimeStringData };
        event.Callback(event,sendData,this);
        xIndex=sendData.XIndex;
        if (xIndex<0) return;

        var border=this.ChartBorder.GetHScreenBorder();
        var y=this.GetXFromIndex(xIndex);

        var rtNight={ Left: border.Left, Top:border.Top, Right:border.RightEx, Bottom:y };
        rtNight.Width=rtNight.Right-rtNight.Left;
        rtNight.Height=rtNight.Bottom-rtNight.Top;

        this.Canvas.fillStyle = this.NightDayConfig.NightBGColor;
        this.Canvas.fillRect(rtNight.Left, rtNight.Top, rtNight.Width, rtNight.Height);

        if (this.Identify!=0) return;

        //显示 日盘夜盘文字
        this.Canvas.font=this.NightDayConfig.Font;
		this.Canvas.textBaseline = "bottom";
		this.Canvas.textAlign = 'left';
		var aryTitle=[{ Title:"夜盘", Position:1, Config:this.NightDayConfig.Night }, { Title:"日盘", Position:0,Config:this.NightDayConfig.Day }];
		var textHeight= this.Canvas.measureText("擎").width;
		for(var i=0;i<aryTitle.length;++i)
		{
			var item=aryTitle[i];
            var text=g_JSChartLocalization.GetText(item.Title,this.HQChart.LanguageID);
			var testWidth = this.Canvas.measureText(text).width;
			var rtItem=
			{ 
				Height:testWidth+item.Config.Margin.Left+item.Config.Margin.Right, 
				Width:textHeight+item.Config.Margin.Top+item.Config.Margin.Bottom,
				Left:border.Left
			};
			rtItem.Right=rtItem.Left+rtItem.Width;

			if (item.Position===1) 
			{
				rtItem.Bottom=y-1;
				rtItem.Top=rtItem.Bottom-rtItem.Height;
			}
			else 
			{
				rtItem.Top=y+1;
				rtItem.Bottom=rtItem.Top+rtItem.Height;
			}

			if (item.Config.BGColor)
			{
				this.Canvas.fillStyle = item.Config.BGColor;
				this.Canvas.fillRect(rtItem.Left, rtItem.Top, rtItem.Width, rtItem.Height);
			}

			if (item.Config.BorderColor)
			{
				this.Canvas.strokeStyle = item.Config.BorderColor;
				this.Canvas.strokeRect(ToFixedPoint(rtItem.Left), ToFixedPoint(rtItem.Top), ToFixedRect(rtItem.Width), ToFixedRect(rtItem.Height));
			}

			this.Canvas.fillStyle = item.Config.Color;
            var xText=rtItem.Left;
            var yText=rtItem.Top;
            this.Canvas.save();
            this.Canvas.translate(xText,yText);
            this.Canvas.rotate(90 * Math.PI / 180);
			this.Canvas.fillText(text, item.Config.Margin.Left, -item.Config.Margin.Bottom);
            this.Canvas.restore();
		}
    }

}

function OverlayMinuteFrame()
{
    this.newMethod=MinuteFrame;     //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="OverlayMinuteFrame";
    this.IsShow=true;               //坐标是否显示
    this.IsShareY=false;            //使用和主框架公用Y轴
    this.IsCalculateYMaxMin=true;   //是否计算Y最大最小值

    this.Draw=function()
    {
        this.SplitXYCoordinate();
        if (this.IsShow)
        {

        }

        this.SizeChange=false;
        this.XYSplit=false;
        this.XSplit=false;
        this.YCustomSplit=false;
    }

    this.GetScaleTextWidth=function()
    {
        return { TextWidth:0 };
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;

        if (this.IsShareY)  //和主图指标共享Y轴坐标
        {
            this.HorizontalMax=this.MainFrame.HorizontalMax;
            this.HorizontalMin=this.MainFrame.HorizontalMin;
            this.HorizontalInfo=[];
            for(var i=0; i<this.MainFrame.HorizontalInfo.length; ++i)
            {
                var item=this.MainFrame.HorizontalInfo[i];
                this.HorizontalInfo.push(item);
            }
        }
        else    //独立Y轴坐标
        {
            if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        }
    }
}

function OverlayMinuteHScreenFrame()
{
    this.newMethod=MinuteHScreenFrame;     //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="OverlayMinuteHScreenFrame";
    this.IsShow=true;                   //坐标是否显示

    this.Draw=function()
    {
        this.SplitXYCoordinate();
        if (this.IsShow)
        {

        }

        this.SizeChange=false;
        this.XYSplit=false;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;

        if (this.IsShareY)  //和主图指标共享Y轴坐标
        {
            this.HorizontalMax=this.MainFrame.HorizontalMax;
            this.HorizontalMin=this.MainFrame.HorizontalMin;
            this.HorizontalInfo=[];
            for(var i=0; i<this.MainFrame.HorizontalInfo.length; ++i)
            {
                var item=this.MainFrame.HorizontalInfo[i];
                this.HorizontalInfo.push(item);
            }
        }
        else    //独立Y轴坐标
        {
            if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        }
    }
}


//缩放因子
var ZOOM_SEED = //0=柱子宽度  1=间距
[
    [48, 10], [44, 10],
    [40, 9], [36, 9],
    [32, 8], [28, 8],
    [24, 7], [20, 7],
    [18, 6], [17, 6],
    [15, 5], [13, 5],
    [9, 4],  [5, 4], [3, 3],
    [3, 1],  [2,1], [1,1], [1,0]
    /*
    [49, 10], [46, 9], [43, 8],
    [41, 7.5], [39, 7], [37, 6],
    [31, 5.5], [27, 5], [23, 4.5],
    [21, 4], [18, 3.5], [16, 3],
    [13, 2.5], [11, 2], [8, 1.5],
    [6, 1], [3, 0.6], [2.2, 0.5],
    */
    //太多了卡,
    //[1.1,0.3],
    //[0.9,0.2],	[0.7,0.15],
    //[0.6,0.12],	[0.5,0.1],	[0.4,0.08],
    //[0.3,0.06],	[0.2,0.04],	[0.1,0.02]
];

//K线框架
function KLineFrame() 
{
    this.newMethod = AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='KLineFrame';
    this.ToolbarID = Guid();  //工具条Div id
    this.ModifyIndex = true;  //是否显示'改参数'菜单
    this.ChangeIndex = true;  //是否显示'换指标'菜单
    this.CustomHorizontalInfo = [];

    this.LastCalculateStatus = { Width: 0, XPointCount: 0 };    //最后一次计算宽度的状态

    //定制X轴刻度 
    //Type:0,  Date:, Time: , Name:名字,       Line:{ Color:线段颜色, Type:线段类型 0 直线 1 虚线 }
    //Type: 1, Space: 第几个空白间距, Name:名字, Line: { Color: 线段颜色, Type: 线段类型 0 直线 1 虚线 }
    this.CustomVerticalInfo = [];               
    this.DrawCustomVerticalEvent;
    this.RightSpaceCount = 0;
    this.TitleBorderLine=
    { 
        Color:g_JSChartResource.Frame.TitleBorderLine.Color, 
        Dash:g_JSChartResource.Frame.TitleBorderLine.Dash 
    };//标题栏底部边框线

    this.DrawFrame = function () 
    {
         if (this.IsMinSize) return;

        this.SplitXYCoordinate();
        if (this.SizeChange == true) this.CalculateDataWidth();
        if (this.DrawOtherChart) this.DrawOtherChart();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex = function (index) 
    {
        if (index < 0) index = 0;
        if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset = this.ChartBorder.GetLeft() + g_JSChartResource.FrameLeftMargin + this.DistanceWidth / 2 + this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) { offset += this.DistanceWidth + this.DataWidth; }
        return offset;
    }

    //X坐标转x轴数值
    this.GetXData = function (x) 
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount-1;

        var left=this.ChartBorder.GetLeft()+g_JSChartResource.FrameLeftMargin;
        var right=this.ChartBorder.GetRight()-g_JSChartResource.FrameRightMargin;
        var distanceWidth = this.DistanceWidth;
        var dataWidth = this.DataWidth;

        var index = 0;
        var xPoint = left + distanceWidth/2 + dataWidth + distanceWidth;
        while (xPoint < right && index < 10000 && index+1<this.XPointCount )  //自己算x的数值
        {
            if (xPoint > x) break;
            xPoint += (dataWidth + distanceWidth);
            ++index;
        }

        //var test=(x-this.ChartBorder.GetLeft())*(this.XPointCount*1.0/this.ChartBorder.GetWidth());
        return index;
    }

    this.DrawCustomHorizontal = function ()    //Y轴刻度定制显示
    {
        if (this.IsMinSize) return;
        for (var i=0; i<this.CustomHorizontalInfo.length; ++i) 
        {
            var item = this.CustomHorizontalInfo[i];
            switch (item.Type) 
            {
                case 0: //最新价格刻度
                case 1: //固定价格刻度
                    this.DrawCustomItem(item);
                    break;
                case 2: //当前屏最后一个K线价格刻度
                case 3: //主图K线涨幅刻度
                case 4: //叠加K线涨幅刻度
                    this.DrawCustomItem(item);  
            }
        }
    }

    this.DrawCustomVerticalItem = function (item) {
        this.Canvas.save();
        if (item.Data.Line.Type == 1) this.Canvas.setLineDash([5, 5]);   //虚线
        this.Canvas.strokeStyle = item.Data.Line.Color;
        this.Canvas.beginPath();
        if (item.IsHScreen) {
            this.Canvas.moveTo(item.Top, ToFixedPoint(item.X));
            this.Canvas.lineTo(item.Bottom, ToFixedPoint(item.X));
        }
        else {
            this.Canvas.moveTo(ToFixedPoint(item.X), item.Top);
            this.Canvas.lineTo(ToFixedPoint(item.X), item.Bottom);
        }
        this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.DrawCustomVertical = function ()  //X轴定制刻度显示
    {
        if (!this.CustomVerticalInfo) return;
        if (this.CustomVerticalInfo.length <= 0) return;
        if (!this.Data) return;

        var isHScreen = this.IsHScreen;
        var top = this.ChartBorder.GetTopEx();
        var bottom = this.ChartBorder.GetBottomEx();

        var dataWidth = this.DataWidth;
        var distanceWidth = this.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;

        if (isHScreen) 
        {
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            top = this.ChartBorder.GetLeftEx();
            bottom = this.ChartBorder.GetRightEx();
        }

        var j = 0;
        for (var i = this.Data.DataOffset; i < this.Data.Data.length && j < this.XPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var kItem = this.Data.Data[i];
            for (var k in this.CustomVerticalInfo) 
            {
                var item = this.CustomVerticalInfo[k];
                if (item.Type != 0) continue;

                if (IFrameSplitOperator.IsNumber(item.Time)) 
                {
                    if (kItem.Date != item.Date || kItem.Time != item.Time) continue;
                }
                else 
                {
                    if (kItem.Date != item.Date) continue;
                }

                var left = xOffset;
                var right = xOffset + dataWidth;
                var x = left + (right - left) / 2;

                var DrawData = { X: x, Top: top, Bottom: bottom, Data: item, IsHScreen: isHScreen };
                this.DrawCustomVerticalItem(DrawData);
                if (this.DrawCustomVerticalEvent)
                    this.DrawCustomVerticalEvent.Callback(this.DrawCustomVerticalEvent, DrawData, this);

                break;
            }
        }

        for (var i = 1; j < this.XPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            for (var k in this.CustomVerticalInfo) 
            {
                var item = this.CustomVerticalInfo[k];
                if (item.Type != 1) continue;
                if (item.Space != i) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                var x = left + (right - left) / 2;

                var DrawData = { X: x, Top: top, Bottom: bottom, Data: item, IsHScreen: isHScreen };
                this.DrawCustomVerticalItem(DrawData);
                if (this.DrawCustomVerticalEvent)
                    this.DrawCustomVerticalEvent.Callback(this.DrawCustomVerticalEvent, DrawData, this);

                break;
            }
        }
    }

    this.CalculateDataWidth = function ()   //计算数据宽度
    {
        if (this.XPointCount < 2) return;
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;    //预留4个像素 防止最后1个柱子不够画

        if (this.ZoomIndex>=0 && this.LastCalculateStatus.Width==width && this.LastCalculateStatus.XPointCount==this.XPointCount) //宽度没变 尝试使用原来的柱子宽度
        {
            var caclWidth=(this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin)+(this.DataWidth + this.DistanceWidth)*(this.XPointCount-1);
            var caclWidth2=(this.DataWidth + this.DistanceWidth) * this.XPointCount;
            if (caclWidth<= width) //当前的柱子宽度够用 就不调整了
                return;
        }

        this.LastCalculateStatus.Width=width;
        this.LastCalculateStatus.XPointCount=this.XPointCount;

        for (var i = 0; i < ZOOM_SEED.length; ++i) 
        {
            let barWidth = ZOOM_SEED[i][0];         //数据宽度
            let distanceWidth = ZOOM_SEED[i][1];    //间距宽度
            if ((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width) 
            {
                this.ZoomIndex = i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                this.TrimKLineDataWidth(width);

                JSConsole.Chart.Log(`[KLineFrame::CalculateDataWidth] ZoomIndex=${this.ZoomIndex} DataWidth=${this.DataWidth} DistanceWidth=${this.DistanceWidth}` );
                return;
            }
        }

        //太多了 就平均分了
        this.ZoomIndex = ZOOM_SEED.length - 1;
        this.DataWidth = width / this.XPointCount;
        this.DistanceWidth = 0;
    }

    this.OnSize=function(obj)
    {
        var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin;
        var xPointCount=0;
        var y=this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin+(this.DataWidth+this.DistanceWidth);
        for(;y<width; y+=(this.DataWidth+this.DistanceWidth), ++xPointCount) { }

        obj.CurCount=this.XPointCount;
        obj.CalcCount=xPointCount;
        obj.DataWidth=this.DataWidth;
        obj.DistanceWidth=this.DistanceWidth;
        obj.Changed=false;

        this.LastCalculateStatus.Width=width;
        if (obj.CurCount==obj.CalcCount) return obj;

        this.XPointCount=xPointCount;
        this.LastCalculateStatus.XPointCount=this.XPointCount;
        if (this.Data)
        {
            this.Data.DataOffset+=(obj.CurCount-obj.CalcCount);
            if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            obj.Changed=true;
        }
        return obj;
    }

    this.SetDataWidth=function(dataWidth)
    {
        var zoomIndex=ZOOM_SEED.length-1;
        for(var i in ZOOM_SEED)
        {
            var item=ZOOM_SEED[i];
            if (item[0]<=dataWidth) 
            {
                zoomIndex=parseInt(i)-1;
                break;
            }
        }

        this.ZoomIndex=zoomIndex;
        this.DataWidth=ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth=ZOOM_SEED[this.ZoomIndex][1];
        var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin;
        var xPointCount=0;
        var y=this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin+(this.DataWidth+this.DistanceWidth);
        for(;y<=width; y+=(this.DataWidth+this.DistanceWidth), ++xPointCount) { }

        this.XPointCount=xPointCount;
        this.LastCalculateStatus.XPointCount=this.XPointCount;
        this.LastCalculateStatus.Width=width;

        var obj={ XPointCount:this.XPointCount, DataWidth:this.DataWidth, DistanceWidth:this.DistanceWidth };
        return obj;
    }

    this.TrimKLineDataWidth = function (width) 
    {
        var zoom = ZOOM_SEED[this.ZoomIndex];
        var dataWidth = ZOOM_SEED[this.ZoomIndex][0];
        var distanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        if (dataWidth == 1 && distanceWidth == 0) 
        {
            this.DataWidth = width / this.XPointCount;
            return;
        }

        while(true)
        {
            if((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width)
            {
                this.DistanceWidth -= 0.01;
                break;
            }
            this.DistanceWidth += 0.01;
        }
        /*
        if (zoom[0]<4) //最后2个缩放,调整间距不调整数据宽度, 数据都是画竖线的
        {
            while (true) 
            {
                if ((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width) 
                {
                    this.DistanceWidth -= 0.01;
                    break;
                }
                this.DistanceWidth += 0.01;
            }
        }
        else
        {
            while (true) 
            {
                if ((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width) 
                {
                    this.DataWidth -= 0.01;
                    break;
                }
                this.DataWidth += 0.01;
            }
        }
        */
    }

    this.IsOverlayMaxMin = function (obj) //当前坐标信息 是否覆盖最大 最小值输出
    {
        if (!this.ChartKLine) return false;
        if (!this.ChartKLine.Max || !this.ChartKLine.Min) return false;

        var textWidth = this.Canvas.measureText(obj.Text.Value).width + 4;    //刻度文字宽度
        var max = this.ChartKLine.Max, min = this.ChartKLine.Min;
        var isOverlayMax = false, isOverlayMin = false;
        const textHeight = 20;    //字体高度
        if (max.X >= obj.X && max.X <= obj.X + textWidth) 
        {
            var y1 = max.Y + textHeight, y2 = max.Y - textHeight;
            if ((y1 >= obj.Y - textHeight && y1 <= obj.Y + textHeight) || (y2 >= obj.Y - textHeight && y2 <= obj.Y + textHeight))
                isOverlayMax = true;
        }

        if (isOverlayMax == true) return true;

        if (min.X >= obj.X && min.X <= obj.X + textWidth) //最小值X 坐标不在 刻度文字范围内
        {
            var y1 = min.Y + textHeight, y2 = min.Y - textHeight;
            if ((y1 >= obj.Y - textHeight && y1 <= obj.Y + textHeight) || (y2 >= obj.Y - textHeight && y2 <= obj.Y + textHeight))
                isOverlayMin = true;
        }

        return isOverlayMax || isOverlayMin;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate = function () 
    {
        if (this.XYSplit == false) 
        {
            if (this.XSplit)
            {
                if (this.XSplitOperator) this.XSplitOperator.Operator();
            }

            if (this.YCustomSplit)
            {
                if (this.YSplitOperator && this.YSplitOperator.CustomCoordinate) this.YSplitOperator.CustomCoordinate();
            }
            return;
        }

        if (this.YSplitOperator != null) this.YSplitOperator.Operator();
        if (this.XSplitOperator != null) this.XSplitOperator.Operator();
    }

    this.CalculateCount = function (zoomIndex) 
    {
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        return parseInt(width / (ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp = function (cursorIndex) 
    {
        if (this.ZoomIndex <= 0) return false;
        if (this.Data.DataOffset < 0) return false;
        var dataCount = this.Data.Data.length;
        var maxDataCount = dataCount + this.RightSpaceCount;

        var rightSpaceCount = 0;
        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex >= dataCount)
         {
            rightSpaceCount = lastDataIndex - (this.Data.Data.length - 1);    //计算右边预留空间
            lastDataIndex = this.Data.Data.length - 1;
            if (rightSpaceCount > this.RightSpaceCount) rightSpaceCount = this.RightSpaceCount;
        }

        var xPointCount = this.CalculateCount(this.ZoomIndex-1);

        --this.ZoomIndex;
        this.XPointCount = xPointCount;
        if (cursorIndex.IsLockRight==true) //固定右边
        {
            var rightDataIndex=this.Data.DataOffset + this.XPointCount;    //最右边的数据索引
            if (xPointCount>rightDataIndex)
            {
                xPointCount=rightDataIndex;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=0;
            }
            else
            {
                var dataOffset=lastDataIndex - (xPointCount-rightSpaceCount)+1;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=dataOffset;
                if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            }
        }
        else if (xPointCount >= maxDataCount) 
        {
            xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
            if (this.Data.DataOffset<0)  
            {
                JSConsole.Chart.Log(`[KLineFrame::ZoomDown] this.Data.DataOffset=${this.Data.DataOffset}, reset this.Data.DataOffset=0`);
                this.Data.DataOffset=0;
            }
        }

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        this.TrimKLineDataWidth(width);

        this.LastCalculateStatus.XPointCount = this.XPointCount;
        cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;

        return true;
    }

    this.ZoomDown = function (cursorIndex) 
    {
        if (this.ZoomIndex + 1 >= ZOOM_SEED.length) return false;
        if (this.Data.DataOffset < 0) return false;
        if (this.Data.DataOffset<=0 && cursorIndex.IsLockRight==true) return false;
        var dataCount = this.Data.Data.length;
        var maxDataCount = dataCount + this.RightSpaceCount;
        //if (this.XPointCount >= dataCount) return false;

        var rightSpaceCount = 0;
        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex >= this.Data.Data.length) 
        {
            rightSpaceCount = lastDataIndex - (this.Data.Data.length - 1);    //计算右边预留空间
            lastDataIndex = this.Data.Data.length - 1;
            if (rightSpaceCount > this.RightSpaceCount) rightSpaceCount = this.RightSpaceCount;
        }

        var xPointCount = this.CalculateCount(this.ZoomIndex + 1);
        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        if (cursorIndex.IsLockRight==true) //固定右边
        {
            var rightDataIndex=this.Data.DataOffset + this.XPointCount;    //最右边的数据索引
            if (xPointCount>rightDataIndex)
            {
                xPointCount=rightDataIndex;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=0;
            }
            else
            {
                var dataOffset=lastDataIndex - (xPointCount-rightSpaceCount)+1;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=dataOffset;
                if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            }
        }
        else if (xPointCount >= maxDataCount) 
        {
            //xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
            if (this.Data.DataOffset<0) 
            {
                JSConsole.Chart.Log(`[KLineFrame::ZoomDown] this.Data.DataOffset=${this.Data.DataOffset}, reset this.Data.DataOffset=0`);
                this.Data.DataOffset=0;
            }
               
        }

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        this.TrimKLineDataWidth(width);

        this.LastCalculateStatus.XPointCount = this.XPointCount;
        cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;

        return true;
    }

    this.GetFrameWidth = function () 
    {
        if (this.IsHScreen) return this.ChartBorder.GetHeight();
        return this.ChartBorder.GetWidth();
    }

    this.SetXShowCount=function(showCount)
    {
        var index=-1;
        var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin;
        for(var i=0; i<ZOOM_SEED.length; ++i)
        {
            var item=ZOOM_SEED[i];
            var dataWidth=item[0];
            var distanceWidth=item[1];
            var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin-distanceWidth/2;

            var value=parseInt((width-distanceWidth/2)/(dataWidth + distanceWidth));
            if (value>=showCount)
            {
                index=i;
                this.XPointCount=showCount;
                this.ZoomIndex=index;
                this.DataWidth=dataWidth;
                this.DistanceWidth=distanceWidth;
                if (dataWidth==1 && distanceWidth==0)
                    this.DataWidth=width/this.XPointCount;
                this.LastCalculateStatus.XPointCount=this.XPointCount;
                this.LastCalculateStatus.Width=width;

                return;
            }
        }

        //太多了 就平均分了
        this.XPointCount=showCount;
        this.ZoomIndex=ZOOM_SEED.length-1;
        this.DataWidth=width/this.XPointCount;
        this.DistanceWidth=0;
        this.LastCalculateStatus.XPointCount=this.XPointCount;
        this.LastCalculateStatus.Width=width;
    }

    //画标题背景色
    this.DrawTitleBG=function()
    {
        if (!this.TitleBorderLine || !this.TitleBorderLine.Color) return;

        var border=this.GetBorder();
        if (this.ChartBorder.TopSpace<5) return;

        this.Canvas.save();
        this.Canvas.strokeStyle=this.TitleBorderLine.Color;
        if (this.TitleBorderLine.Dash) this.Canvas.setLineDash(this.TitleBorderLine.Dash);   //虚线
        var x=ToFixedPoint(border.TopTitle);
        this.Canvas.beginPath();
        this.Canvas.moveTo(border.Left,x);
        this.Canvas.lineTo(border.Right,x);
        this.Canvas.stroke();
        this.Canvas.restore();
    }
}

//K线横屏框架
function KLineHScreenFrame() 
{
    this.newMethod = KLineFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='KLineHScreenFrame';
    this.IsHScreen = true;        //是否是横屏

    this.DrawInsideHorizontal = function () 
    {
        if (this.IsMinSize) return;
        if (this.IsShowYText[0] === false && this.IsShowYText[1] === false) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;
        var titleHeight = this.ChartBorder.TitleHeight;
        var pixelTatio = 1;

        var isDrawLeft = (borderTop < 10 * pixelTatio || this.YTextPosition[0] == 2) && this.IsShowYText[0] === true;
        var isDrawRight = (borderBottom < 10 * pixelTatio || this.YTextPosition[1] == 2) && this.IsShowYText[1] === true;

        if (isDrawLeft || isDrawRight) 
        {
            var yPrev = null; //上一个坐标y的值
            for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
            {
                var item = this.HorizontalInfo[i];
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev != null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && isDrawLeft) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";

                    var textObj = { X: left, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[0] } };
                    var xText = y, yText = top;
                    this.Canvas.save();
                    this.Canvas.translate(xText, yText);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Message[0], 2, 0);
                    this.Canvas.restore();
                }

                if (item.Message[1] != null && isDrawRight) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };

                    var xText = y, yText = bottom;
                    this.Canvas.save();
                    this.Canvas.translate(xText, yText);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Message[1], -2, 0);
                    this.Canvas.restore();
                }
                yPrev = y;
            }
        }
    }

    //画标题背景色
    this.DrawTitleBG = function () 
    {
        /*
        if (this.ChartBorder.TitleHeight <= 0) return;

        var left = ToFixedPoint(this.ChartBorder.GetRightEx());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = this.ChartBorder.TitleHeight;
        var height = bottom - top;

        this.Canvas.fillStyle = this.TitleBGColor;
        this.Canvas.fillRect(left, top, width, height);
        */
    }

    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeftEx();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width = this.ChartBorder.GetWidthEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeftEx() + width;
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;
        var left=this.ChartBorder.GetLeft();

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

            if (y!=left)
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    this.Canvas.setLineDash([5,5]);   //虚线
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(ToFixedPoint(y),top);
                    this.Canvas.lineTo(ToFixedPoint(y),bottom);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType>0)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (g_JSChartResource.FrameYLineDash)
                    {
                        this.Canvas.setLineDash(g_JSChartResource.FrameYLineDash);   //虚线
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),top);
                        this.Canvas.lineTo(ToFixedPoint(y),bottom);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), top);
                        this.Canvas.lineTo(ToFixedPoint(y), bottom);
                        this.Canvas.stroke();
                    }
                }
            }
            
            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10 && this.IsShowYText[0] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";

                var xText = y, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderBottom > 10 && this.IsShowYText[1] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var xText = y, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev = y;
        }
    }

    this.GetXFromIndex = function (index) 
    {
        if (index < 0) index = 0;
        if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset = this.ChartBorder.GetTop() + g_JSChartResource.FrameLeftMargin + this.DistanceWidth / 2 + this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) 
        {
            offset += this.DistanceWidth + this.DataWidth;
        }

        return offset;
    }

    //画X轴
    this.DrawVertical = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightTitle();
        var bottom = this.ChartBorder.GetBottom();

        var xPrev = null; //上一个坐标x的值
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x >= bottom) break;
            if (xPrev != null && Math.abs(x - xPrev) < 80) continue;
            var item=this.VerticalInfo[i];
            if (item.LineType==2)
            {
                this.Canvas.setLineDash([5,5]);
                this.Canvas.beginPath();
                this.Canvas.moveTo(left, ToFixedPoint(x));
                this.Canvas.lineTo(right, ToFixedPoint(x));
                this.Canvas.stroke();
                this.Canvas.setLineDash([]);
            }
            else if (item.LineType>0)
            {
                this.Canvas.strokeStyle = item.LineColor;
                if (g_JSChartResource.FrameXLineDash)
                {
                    this.Canvas.setLineDash(g_JSChartResource.FrameXLineDash);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, ToFixedPoint(x));
                    this.Canvas.lineTo(right, ToFixedPoint(x));
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, ToFixedPoint(x));
                    this.Canvas.lineTo(right, ToFixedPoint(x));
                    this.Canvas.stroke();
                }
            }

            if (this.VerticalInfo[i].Message[0] != null) 
            {
                if (this.VerticalInfo[i].Font != null)
                this.Canvas.font = this.VerticalInfo[i].Font;

                this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "top";
                }
                else
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = "top";
                }

                var xText = left, yText = x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, this.XBottomOffset);
                this.Canvas.restore();
            }

            xPrev = x;
        }
    }

    //Y坐标转y轴数值
    this.GetYData = function (x) 
    {
        if (x < this.ChartBorder.GetLeftEx()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeftEx()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData = function (y) 
    {
        if (y <= this.ChartBorder.GetTop()) return 0;
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount-1;

        var distanceWidth=this.DistanceWidth;
        var dataWidth=this.DataWidth;
        var left=this.ChartBorder.GetTop()+g_JSChartResource.FrameLeftMargin;
        var right=this.ChartBorder.GetBottom()-g_JSChartResource.FrameRightMargin;

        var index=0;
        var xPoint=left+distanceWidth/2+dataWidth+distanceWidth;
        while(xPoint<right && index<10000 && index+1<this.XPointCount)  //自己算x的数值
        {
            if (xPoint>=y) break;
            xPoint+=(dataWidth+distanceWidth);
            ++index;
        }

        return index;
    }

}


function OverlayKLineFrame()
{
    this.newMethod=KLineFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='OverlayKLineFrame';

    this.MainFrame=null;    //主框架
    this.IsShareY=false;    //使用和主框架公用Y轴
    this.IsShowMainFrame=0; //是否显示在主框架坐标上 1=左边 2=右边
    this.IsCalculateYMaxMin=true;   //是否计算Y最大最小值
    this.RightOffset=50;
    this.PenBorder=g_JSChartResource.OverlayFrame.BolderPen; //'rgb(0,0,0)'
    this.IsShow=false;           //坐标是否显示
    this.IsShowToolbar=true;    //是否显示工具条
    this.Title=null;
    this.TitleColor=g_JSChartResource.OverlayFrame.TitleColor;
    this.TitleFont=g_JSChartResource.OverlayFrame.TitleFont;

    this.KLineFrame_ReloadResource=this.ReloadResource;
    this.ReloadResource=function(resource)
    {
        this.KLineFrame_ReloadResource(resource);
    
        if (!resource)
        {
            this.PenBorder=g_JSChartResource.OverlayFrame.BolderPen; //'rgb(0,0,0)'
            this.TitleColor=g_JSChartResource.OverlayFrame.TitleColor;
            this.TitleFont=g_JSChartResource.OverlayFrame.TitleFont;
        }
    }

    this.Draw=function()
    {
        this.Buttons=[];
        if (this.ChartBorder.IsShowTitleOnly) return;
        this.SplitXYCoordinate();

        if (this.IsShow)
        {
            this.DrawVertical();
            this.DrawHorizontal();
        }
        
        this.SizeChange=false;
        this.XYSplit=false;
    }

    this.GetScaleTextWidth=function()
    {
        return { TextWidth:0 };
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;

        if (this.IsShareY)  //和主图指标共享Y轴坐标
        {
            this.HorizontalMax=this.MainFrame.HorizontalMax;
            this.HorizontalMin=this.MainFrame.HorizontalMin;
            this.HorizontalInfo=[];
            for(var i in this.MainFrame.HorizontalInfo)
            {
                var item=this.MainFrame.HorizontalInfo[i];
                this.HorizontalInfo.push(item);
            }

            this.CoordinateType=this.MainFrame.CoordinateType;
        }
        else    //独立Y轴坐标
        {
            if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        }
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
        var border=this.ChartBorder.GetBorder();
        var left=border.Left;
        var right=border.Right;
        var bottom = border.Bottom;
        var top = this.ChartBorder.GetTopTitle();
        var borderRight=this.ChartBorder.Right;
        right+=this.RightOffset;

        var yPrev=null; //上一个坐标y的值
        for(var i=this.HorizontalInfo.length-1; i>=0; --i)  //从上往下画分割线
        {
            var item=this.HorizontalInfo[i];
            var y=this.GetYFromData(item.Value);
            if (y!=null && Math.abs(y-yPrev)<this.MinYDistance) continue;  //两个坐标在近了 就不画了

            if (y >= bottom - 2) this.Canvas.textBaseline = 'bottom';
            else if (y <= top + 2) this.Canvas.textBaseline = 'top';
            else this.Canvas.textBaseline = "middle";

            this.Canvas.strokeStyle=this.PenBorder;
            this.Canvas.beginPath();
            this.Canvas.moveTo(right-2,ToFixedPoint(y));
            this.Canvas.lineTo(right,ToFixedPoint(y));
            this.Canvas.stroke();

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1]!=null && borderRight>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                var text=item.Message[1];
                if (Array.isArray(item.Message[1])) text=item.Message[1][0];
               
                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="left";
                this.Canvas.fillText(text,right+2,y);
            }

            yPrev=y;
        }
    }

    //画X轴
    this.DrawVertical=function()
    {
        var border=this.ChartBorder.GetBorder();
        var top=border.TopEx;
        //var left=this.ChartBorder.GetLeft();
        var right=border.Right;
        var bottom=border.BottomEx;
        right+=this.RightOffset;

        this.Canvas.strokeStyle=this.PenBorder;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ToFixedPoint(right),ToFixedPoint(top));
        this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(bottom));
        this.Canvas.stroke();
    }
}


function OverlayKLineHScreenFrame()
{
    this.newMethod=KLineHScreenFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='OverlayKLineHScreenFrame';
    this.MainFrame=null;    //主框架
    this.IsShareY=false;    //使用和主框架公用Y轴
    this.IsCalculateYMaxMin=true;   //是否计算Y最大最小值
    this.RightOffset=50;
    this.PenBorder=g_JSChartResource.OverlayFrame.BolderPen; //'rgb(0,0,0)'
    this.IsShow=true;   //坐标是否显示
    this.Title=null;
    this.TitleColor=g_JSChartResource.OverlayFrame.TitleColor;
    this.TitleFont=g_JSChartResource.OverlayFrame.TitleFont;

    this.Draw=function()
    {
        this.SplitXYCoordinate();

        if (this.IsShow)
        {
            this.DrawVertical();
            this.DrawHorizontal();
        }
        
        this.SizeChange=false;
        this.XYSplit=false;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.IsShareY)  //和主图指标共享Y轴坐标
        {
            this.HorizontalMax=this.MainFrame.HorizontalMax;
            this.HorizontalMin=this.MainFrame.HorizontalMin;
            this.HorizontalInfo=[];
            for(var i=0; i<this.MainFrame.HorizontalInfo.length; ++i)
            {
                var item=this.MainFrame.HorizontalInfo[i];
                this.HorizontalInfo.push(item);
            }
        }
        else
        {
            if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        }
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
       
    }

    //画X轴
    this.DrawVertical=function()
    {
       
    }

    this.GetScaleTextWidth=function()
    {
        return { TextWidth:0 };
    }
}



//深度图框架
function DepthChartFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ScreenImageData;                   //截图
    this.Position;                          //画布的位置
    this.ClassName="DepthChartFrame";

    //X轴价格 最大,最小
    this.VerticalRange={ Max:null, Min:null, Center:null, MaxDiffer:null, Differ:null, Step:0.05 };
    this.AskPrice;
    this.BidPrice;
    this.MinZoom=0.05;  //最小缩放

    this.SetPriceList=function(aryAskPrice, aryBidPrice)
    {
        this.AskPrice=aryAskPrice;
        this.BidPrice=aryBidPrice;
    }

    this.SetDrawOtherChart = function (callback)  //在画完框架以后调用的扩展画法
    {
        
    }

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex=function(value)
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var width=this.ChartBorder.GetWidth();
        var offset=width*(value-this.VerticalRange.Min)/(this.VerticalRange.Max-this.VerticalRange.Min);
        return left+offset;
    }

    this.GetXData=function(x)
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var width=this.ChartBorder.GetWidth();

        return (x-left)/width*(this.VerticalRange.Max-this.VerticalRange.Min)+this.VerticalRange.Min;
    }

    this.GetXFromPrice=function(price)
    {
        var isAskPrice=false;
        var find=this.GetPrice(this.BidPrice, price);
        if (find==null) 
        {
            find=this.GetPrice(this.AskPrice, price);
            isAskPrice=true;
        }

        if (find==null) 
        {
            if (this.BidPrice && Array.isArray(this.BidPrice) && this.BidPrice.length>0)
            {
                var minPrice=this.BidPrice[0];
                if (price<minPrice) 
                {
                    isAskPrice=false;
                    find= minPrice;
                }
            }
        }

        if (find==null)   
        {      
            if (this.AskPrice && Array.isArray(this.AskPrice) && this.AskPrice.length>0)
            {
                var maxPrice=this.AskPrice[this.AskPrice.length-1];
                if (price>maxPrice) 
                {
                    isAskPrice=true;
                    find=maxPrice;
                }
            }
        }

        if (find==null) return null;

        var x=this.GetXFromIndex(find);

        return { X:x, Price:find, IsAsk:isAskPrice };
    }

    this.GetPrice=function(aryPrice, price)
    {
        if (!aryPrice || !Array.isArray(aryPrice) || aryPrice.length<=0) return null;

        if (price<aryPrice[0] || price>aryPrice[aryPrice.length-1]) return null;

        var lastPrice=null;
        for(var i in aryPrice)
        {
            var item=aryPrice[i];
            if (price==item)
            {
                return item;
            }

            if (price<item)
                return lastPrice;

            lastPrice=item;
        }
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    //图形快照
    this.Snapshot=function()
    {
        this.ScreenImageData=this.Canvas.getImageData(0,0,this.ChartBorder.GetChartWidth(),this.ChartBorder.GetChartHeight());
    }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }

    this.ZoomUp=function()  //放大
    {
        var xRange=this.VerticalRange;
        var differ=xRange.Differ;
        var minDiffer=xRange.MaxDiffer*this.MinZoom;
        if (differ<minDiffer) return false;

        var offsetDiffer=xRange.Differ*xRange.Step;
        differ-=offsetDiffer;
        xRange.Differ=differ;
        xRange.Min=xRange.Center-xRange.Differ;
        xRange.Max=xRange.Center+xRange.Differ;

        return true;
    }

    this.ZoomDown=function() //缩小
    {
        var xRange=this.VerticalRange;
        var differ=xRange.Differ;
        if (differ==xRange.MaxDiffer) return false;

        var offsetDiffer=xRange.Differ*xRange.Step;
        differ+=offsetDiffer;
        if (differ>xRange.MaxDiffer) differ=xRange.MaxDiffer;

        xRange.Differ=differ;
        xRange.Min=xRange.Center-xRange.Differ;
        xRange.Max=xRange.Center+xRange.Differ;

        return true;
    }
}


//导出统一使用JSCommon命名空间名
export
{
    IChartFramePainting, 
    AverageWidthFrame,

    MinuteFrame,
    MinuteHScreenFrame,

    OverlayMinuteFrame,
    OverlayMinuteHScreenFrame,

    OverlayKLineFrame,
    OverlayKLineHScreenFrame,

    ZOOM_SEED,
    KLineFrame,
    KLineHScreenFrame,

    DepthChartFrame,
};