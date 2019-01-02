/*
    图形库 继承 IChartPainting的类都需要迁移到这个文件里面
*/

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import 
{
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData
} from "umychart.data.wechat.js";

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

    this.Color = "rgb(255,193,37)"; //线段颜色
    this.LineWidth;               //线段宽度
    this.DrawType = 0;            //画图方式  0=无效数平滑  1=无效数不画断开

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
            var y = this.ChartFrame.GetYFromData(value);

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
            var y = this.ChartFrame.GetYFromData(value);

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

    this.Color = "rgb(255,193,37)";   //线段颜色
    this.LineWidth = 2;               //线段宽度

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
        var LineWidth = this.LineWidth;
        if (dataWidth <= 4) LineWidth = 1;
        else if (dataWidth < LineWidth) LineWidth = parseInt(dataWidth);
        this.Canvas.strokeStyle = this.Color;
        this.Canvas.lineWidth = LineWidth;
        var bFillBar = false;
        if (this.LineWidth < 100) 
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
                if (isHScreen) this.Canvas.fillRect(Math.min(y, y2), left, Math.abs(y - y2), dataWidth + distanceWidth + fixedWidth * 2);
                else this.Canvas.fillRect(left, ToFixedRect(Math.min(y, y2)), dataWidth + distanceWidth + fixedWidth * 2, ToFixedRect(Math.abs(y - y2)));
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
        ChartLine: ChartLine,
        ChartSingleText: ChartSingleText,
        ChartPointDot: ChartPointDot,
        ChartStick: ChartStick,
        ChartLineStick: ChartLineStick,
        ChartStickLine: ChartStickLine,
    },

    //单个类导出
    JSCommonChartPaint_IChartPainting: IChartPainting,
    JSCommonChartPaint_ChartLine: ChartLine,
    JSCommonChartPaint_ChartSingleText: ChartSingleText,
    JSCommonChartPaint_ChartPointDot: ChartPointDot,
    JSCommonChartPaint_ChartStick: ChartStick,
    JSCommonChartPaint_ChartLineStick: ChartLineStick,
    JSCommonChartPaint_ChartStickLine: ChartStickLine,
};