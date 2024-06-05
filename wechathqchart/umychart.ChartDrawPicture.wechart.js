
import 
{ 
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

import 
{ 
    g_MinuteTimeStringData,
} from "./umychart.coordinatedata.wechat.js";

import 
{
    g_JSChartResource,
    g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import { JSConsole } from "./umychart.console.wechat.js";

function Guid() 
{
    function S4() 
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function Point() 
{
    this.X;
    this.Y;
}

//修正线段有毛刺
function ToFixedPoint(value) 
{
    return parseInt(value) + 0.5;
}
  
function ToFixedRect(value) 
{
    //return value;
    // With a bitwise or.
    //rounded = (0.5 + somenum) | 0;
    // A double bitwise not.
    //rounded = ~~ (0.5 + somenum);
    // Finally, a left bitwise shift.
    var rounded;
    return rounded = (0.5 + value) << 0;
}

function GetFontHeight(context, font, word)
{
    if (!context) return null;

    if (font) context.font=font;

    var text='擎';
    if (IFrameSplitOperator.IsString(word)) text=word;

    var fontInfo=context.measureText(text);
    var textHeight=fontInfo.width+2;

    return textHeight;
}
  

//画图工具
function IChartDrawPicture()
{
    this.Frame;
    this.Canvas;
    this.Point=new Array()                      //画图的点
    this.Value=new Array();                     //XValue,YValue
    this.LinePoint=[];
    this.PointCount=2;                          //画点的个数
    this.Status=0;                              //0=开始画 1=完成第1个点  2=完成第2个点 3=完成第3个点  10=完成 20=移动
    this.PointStatus=0;                         //2=第2个点完成
    this.MovePointIndex=null;                   //移动哪个点 0-10 对应Point索引  100 整体移动
    this.ClassName='IChartDrawPicture';
    this.FinishedCallback;                      //画图完成回调通知
    this.Guid=Guid();                            //ID标识
    this.Symbol;        //对应的股票
    this.Period;        //对应的周期
    this.Right;         //对应的复权
    this.IsSelected=false;  //是否选中
    this.Option;        //全局配置 对应外部 ChartDrawOption
    this.EnableMove=true;   //是否可以移动
    this.EnableSave=true;   //是否允许保存
    this.EnableCtrlMove=false;  //是否按住Ctrl才能移动
    this.OnlyMoveXIndex=false;  //只能在X轴刻度上移动
    this.IsSupportMagnet=false; //是否支持磁吸
    this.EnableMoveCheck=true;  //允许移动时监测是否超出边界

    this.IsDrawFirst=false;
    this.IsShowYCoordinate=false;    //是否在Y轴显示点的刻度
    this.IsShow=true;                //是否显示

    this.LineColor=g_JSChartResource.DrawPicture.LineColor[0];                            //线段颜色
    //this.LineColor="#1e90ff";      //线段颜色，input type="color" 不支持rgb和rgba 的格式
    this.LineWidth=2;              //线段宽度
    this.BackupLineWidth=null;
    this.AreaColor='rgba(25,25,25,0.4)';    //面积颜色
    this.PointColor=g_JSChartResource.DrawPicture.PointColor[0];
    this.MoveOnPointColor=g_JSChartResource.DrawPicture.PointColor[1];
    this.PointBGColor=g_JSChartResource.DrawPicture.PointColor[2];
    this.PointRadius=5;  //圆点半径
    this.SquareSize=8;   //方框点大小
    this.PointType=g_JSChartResource.DrawPicture.PointType;         // 0=圆点  1=方框 2= 空心圆
    this.IsShowPoint=g_JSChartResource.DrawPicture.IsShowPoint;     //是否始终显示点
    this.LimitFrameID;   //限制在指定窗口绘图

    this.TouchConfig={ Point:{ Radius:15 }, Line:{ Width:10 } },
    this.PixelRatio=null;   //分辨率

    //接口函数
    this.SetLastPoint=null; //this.SetLastPoint=function(obj)  obj={X:,Y:}
    this.Update=null;       //更新数据回调
    this.GetActiveDrawPicture=null;
    this.GetYCoordinatePoint=null;    

    this.Draw=function()
    {

    }

    this.SetOption=function(option)
    {
        if (!option) return;

        if (option.LineColor) this.LineColor=option.LineColor;
        if (option.LineWidth>0) this.LineWidth=option.LineWidth;
        if (option.AreaColor) this.AreaColor=option.AreaColor;
        if (option.PointColor) this.PointColor=option.PointColor;
        if (option.MoveOnPointColor) this.SelectPointColor=option.PointColor;
        if (option.PointRadius) this.PointRadius=option.PointRadius;
        if (IFrameSplitOperator.IsNumber(option.SquareSize)) this.SquareSize=option.SquareSize;
        if (IFrameSplitOperator.IsBool(option.IsShowPoint)) this.IsShowPoint=option.IsShowPoint;
        if (IFrameSplitOperator.IsNumber(option.LimitFrameID)) this.LimitFrameID=option.LimitFrameID;
        if (IFrameSplitOperator.IsBool(option.EnableCtrlMove)) this.EnableCtrlMove=option.EnableCtrlMove;
        if (IFrameSplitOperator.IsBool(option.IsShowYCoordinate)) this.IsShowYCoordinate=option.IsShowYCoordinate;
    }

    this.ReloadResource=function(resource)
    {
        if (!resource)
        {
            this.PointColor=g_JSChartResource.DrawPicture.PointColor[0];
            this.MoveOnPointColor=g_JSChartResource.DrawPicture.PointColor[1];
            this.PointBGColor=g_JSChartResource.DrawPicture.PointColor[2];
        }
    }

    this.SetLineWidth=function()
    {
        this.BackupLineWidth=null;
        if (this.LineWidth>0)
        {
            this.BackupLineWidth=this.Canvas.lineWidth;
            this.Canvas.lineWidth=this.LineWidth;
        }
    }

    this.GetFontHeight=function(font)
    {
        return GetFontHeight(this.Canvas, font, "擎");
    }

    this.RestoreLineWidth=function()
    {
        if (this.BackupLineWidth!=null)
        {
            this.Canvas.lineWidth=this.BackupLineWidth;
        }
    }

    //磁吸K线
    this.PointMagnetKLine=function()
    {
        if (!this.IsSupportMagnet) return false;
        if (!this.Frame) return false;
        if (this.Frame.ClassName=="MinuteFrame" || this.Frame.Class=="MinuteHScreenFrame") return false;
        if (this.Frame.Identify!=0) return false;

        var pointIndex=-1;
        if (this.Status==2) pointIndex=1;
        else if (this.Status==1) pointIndex=0;
        else if (IFrameSplitOperator.IsNumber(this.MovePointIndex)) pointIndex=this.MovePointIndex;
        if (pointIndex<0) return false;

        if (this.Option && this.Option.Magnet && this.Option.Magnet.Enable)
        {
            var option= 
            { 
                IsFixedX:false, 
                Magnet:
                {
                    Enable:true,
                    PointIndex:pointIndex,
                    Distance:this.Option.Magnet.Distance,
                    Type:this.Option.Magnet.Type
                }
            }

            return this.AdjustPoint(this.Point,option)
        }
          
        return false;
    }

    //Point => Value
    this.PointToValue=function()
    {
        if (!this.Frame) return false;

        if (this.Frame.ClassName=="MinuteFrame" || this.Frame.Class=="MinuteHScreenFrame")
        {
            return this.PointToValue_Minute();
        }
        else
        {
            return this.PointToValue_KLine();
        }
    }

    this.PointToKLine=function(aryPoint)
    {
        if (!this.Frame) return null;
        var data=this.Frame.Data;
        if (!data) return null;
        
        var kLine=[];
        var isHScreen=this.Frame.IsHScreen;
        if (isHScreen)
        {
            for(var i in aryPoint)
            {
                var item=aryPoint[i];
                var xValue=parseInt(this.Frame.GetXData(item.Y))+data.DataOffset;
                var yValue=this.Frame.GetYData(item.X);

                var valueItem={ XValue:xValue, YValue:yValue };
                var kline=data.Data[xValue];
                valueItem.DateTime={ Date:kline.Date };
                if (IFrameSplitOperator.IsNumber(kline.Time)) valueItem.DateTime.Time=kline.Time;

                kLine[i]=valueItem;
            }
        }
        else
        {
            for(var i in aryPoint)
            {
                var item=aryPoint[i];
                var index=parseInt(this.Frame.GetXData(item.X,false));
                var xValue=index+data.DataOffset;
                if (xValue<0) xValue=0;
                else if (xValue>=data.Data.length) 
                {
                    xValue=data.Data.length-1;
                    index=xValue-data.DataOffset;
                }
                var yValue=this.Frame.GetYData(item.Y,false);

                var valueItem={ XValue:xValue, YValue:yValue, XIndex:index };
                var kline=data.Data[xValue];
                valueItem.DateTime={ Date:kline.Date };
                if (IFrameSplitOperator.IsNumber(kline.Time)) valueItem.DateTime.Time=kline.Time;

                kLine[i]=valueItem;
            }
        }

        return kLine;
    }

    this.PointToValue_KLine=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        var isHScreen=this.Frame.IsHScreen;
        if (isHScreen)
        {
            for(var i in this.Point)
            {
                var item=this.Point[i];
                var xValue=parseInt(this.Frame.GetXData(item.Y,false))+data.DataOffset;
                var yValue=this.Frame.GetYData(item.X,false);

                var valueItem={ XValue:xValue, YValue:yValue };
                var kline=data.Data[xValue];
                valueItem.DateTime={ Date:kline.Date };
                if (IFrameSplitOperator.IsNumber(kline.Time)) valueItem.DateTime.Time=kline.Time;

                this.Value[i]=valueItem;
            }
        }
        else
        {
            for(var i in this.Point)
            {
                var item=this.Point[i];
                var xValue=parseInt(this.Frame.GetXData(item.X,false))+data.DataOffset;
                if (xValue<0) xValue=0;
                else if (xValue>=data.Data.length) xValue=data.Data.length-1;
                var yValue=this.Frame.GetYData(item.Y,false);

                var valueItem={ XValue:xValue, YValue:yValue };
                var kline=data.Data[xValue];
                valueItem.DateTime={ Date:kline.Date };
                if (IFrameSplitOperator.IsNumber(kline.Time)) valueItem.DateTime.Time=kline.Time;

                this.Value[i]=valueItem;
            }
        }

        return true;
    }

    this.PointToValue_Minute=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        var isHScreen=this.Frame.IsHScreen;
        if (isHScreen)
        {
            for(var i=0; i<this.Point.length; ++i)
            {
                var item=this.Point[i];
                var xValue=parseInt(this.Frame.GetXData(item.Y));
                var yValue=this.Frame.GetYData(item.X);

                var valueItem={ XValue:xValue, YValue:yValue };
                var minuteItem=data.Data[xValue];
                valueItem.DateTime={ Date:minuteItem.Date ,Time:minuteItem.Time};
                this.Value[i]=valueItem;
            }
        }
        else
        {
            var xDatetime=g_MinuteTimeStringData.GetTimeData(this.Symbol);
            for(var i=0; i<this.Point.length; ++i)
            {
                var item=this.Point[i];
                var xValue=parseInt(this.Frame.GetXData(item.X));
                var yValue=this.Frame.GetYData(item.Y);

                if (xValue>=data.Data.length) //超过当前数据,直接读固定时间
                {
                    var index=xValue%xDatetime.length;
                    var dataIndex=data.Data.length-1;
                    var valueItem={ XValue:xValue, YValue:yValue };
                    var minuteItem=data.Data[dataIndex];
                    var timeItem=xDatetime[index];
                    valueItem.DateTime={ Date:minuteItem.Date, Time:timeItem };
                    this.Value[i]=valueItem;
                }
                else
                {
                    var valueItem={ XValue:xValue, YValue:yValue };
                    var minuteItem=data.Data[xValue];
                    valueItem.DateTime={ Date:minuteItem.Date, Time:minuteItem.Time };
                    this.Value[i]=valueItem;
                }
            }
        }

        return true;
    }

    this.IsPointIn=function(x, y, option)
    {
        return false;
    }

    //Value => Point
    this.ValueToPoint=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        //this.UpdateXValue();
        var isHScreen=this.Frame.IsHScreen;
        this.Point=[];
        for(var i=0; i<this.Value.length; ++i)
        {
            var item=this.Value[i];
            var pt=new Point();
            if (isHScreen)
            {
                pt.Y=this.Frame.GetXFromIndex(item.XValue-data.DataOffset,false);
                pt.X=this.Frame.GetYFromData(item.YValue,false);
            }
            else
            {
                pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset, false);
                pt.Y=this.Frame.GetYFromData(item.YValue,false);
            }
            this.Point[i]=pt;
        }
    }

    this.UpdateXValue=function()    //通过datetime更新x的索引
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        var aryDateTime=[];
        for(var i=0; i<this.Value.length; ++i)
        {
            var item=this.Value[i];
            if (!item.DateTime) break;
            var dateTime={ Date:item.DateTime.Date };
            if (IFrameSplitOperator.IsNumber(item.DateTime.Time)) dateTime.Time=item.DateTime.Time;
            aryDateTime[i]=dateTime;
        }

        data.FindDataIndexByDateTime(aryDateTime);
        for(var i in aryDateTime)
        {
            var findItem=aryDateTime[i];
            var valueItem=this.Value[i];
            if (findItem.Index>=0) valueItem.XValue=findItem.Index;
        }
    }

    //xStep,yStep 移动的偏移量
    this.Move=function(xStep,yStep)
    {
        if (this.Status!=20) return false;
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;
        if (this.MovePointIndex==null) return false;

        var index=parseInt(this.MovePointIndex);
        if (index===100)    //整体移动
        {
            if (this.IsMoveOutOfBounds(this.Point, xStep, yStep)) return false;

            for(var i in this.Point)
            {
                this.Point[i].X+=xStep;
                this.Point[i].Y+=yStep;
            }
        }
        else if (index===0 || index===1 || index===2 || index===3 || index===4 || index===5)
        {
            if (index<this.Point.length)
            {
                this.Point[index].X+=xStep;
                this.Point[index].Y+=yStep;
            }
        }
        else
        {
            return false;
        }
    }

    //是否超出边界了
    this.IsMoveOutOfBounds=function(aryPoint,xStep,yStep)
    {
        if (!this.EnableMoveCheck) return false;

        if (!this.Frame) return false;

        if (this.Frame.ClassName=="MinuteFrame" || this.Frame.Class=="MinuteHScreenFrame")
            return false;

        
        var data=this.Frame.Data;
        if (!data) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(data.Data)) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) return false;
        var isHScreen=this.Frame.IsHScreen;
        if (isHScreen) 
        {
            //TODO:横屏以后再做
            return false;
        }
        else
        {
            var offset=data.DataOffset;
            var startIndex=0-offset;
            var endIndex=data.Data.length-offset;

            if (xStep>0)
            {
                var xEnd=this.Frame.GetXFromIndex(endIndex-1,false);
                for(var i=0;i<aryPoint.length;++i)
                {
                    var item=aryPoint[i];
                    if (item.X+xStep>xEnd) return true;
                }
            }
            else if (xStep<0)
            {
                var xStart=this.Frame.GetXFromIndex(startIndex,false);
                for(var i=0;i<aryPoint.length;++i)
                {
                    var item=aryPoint[i];
                    if (item.X+xStep<xStart) return true;
                }
            }

            return false;
        }
    }

    this.ClipFrame=function()
    {
        if (this.Frame.IsHScreen)
        {
            var left=this.Frame.ChartBorder.GetLeftEx();
            var top=this.Frame.ChartBorder.GetTop();
            var width=this.Frame.ChartBorder.GetWidthEx();
            var height=this.Frame.ChartBorder.GetHeight();
        }
        else
        {
            var left=this.Frame.ChartBorder.GetLeft();
            var top=this.Frame.ChartBorder.GetTopEx();
            var width=this.Frame.ChartBorder.GetWidth();
            var height=this.Frame.ChartBorder.GetHeightEx();
        }

        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(left,top,width,height);
        this.Canvas.clip();
    }

    //计算需要画的点的坐标option:{IsCheckX:是否检测X值, IsCheckY:是否检测Y值}
    this.CalculateDrawPoint=function(option)
    {
        if (this.Status<2) return null;
        if(!this.Point.length || !this.Frame) return null;

        var drawPoint=[];
        if (this.Status==10)
        {
            var data=this.Frame.Data;
            if (!data) return null;

            var showCount=this.Frame.XPointCount;
            var invaildX=0; //超出范围的x点个数
            var isHScreen=this.Frame.IsHScreen;
            for(var i=0; i<this.Value.length; ++i)
            {
                var item=this.Value[i];
                var dataIndex=item.XValue-data.DataOffset;
                if (dataIndex<0 || dataIndex>=showCount) ++invaildX;
            
                var pt=new Point();
                if (isHScreen)  //横屏X,Y对调
                {
                    pt.Y=this.Frame.GetXFromIndex(item.XValue-data.DataOffset,false);
                    pt.X=this.Frame.GetYFromData(item.YValue,false);
                }
                else
                {
                    pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset,false);
                    pt.Y=this.Frame.GetYFromData(item.YValue,false);
                }
                drawPoint.push(pt);
            }

            if (option && option.IsCheckX===true)
            {
                if (invaildX==this.Value.length) return null;
            }
        }
        else    //移动中
        {
            for(var i=0;i<this.Point.length;++i)
            {
                var item=this.Point[i];
                drawPoint.push({ X:item.X, Y:item.Y });
            }

            if (this.OnlyMoveXIndex)
            {
                var option= { IsFixedX:this.OnlyMoveXIndex };
                JSConsole.Chart.Log(`[IChartDrawPicture::CalculateDrawPoint] Status=${this.Status} MovePointIndex=${this.MovePointIndex} Identify=${this.Frame.Identify}`);

                //磁吸功能
                if (this.Option && this.Option.Magnet && this.Option.Magnet.Enable && this.IsSupportMagnet  && this.Frame.Identify==0)
                {
                    var pointIndex=-1;
                    if (this.Status==2) pointIndex=1;   //创建第2个点
                    if (IFrameSplitOperator.IsNumber(this.MovePointIndex)) pointIndex=this.MovePointIndex;
                        
                    if (pointIndex>=0)
                    {
                        option.Magnet=
                        {
                            Enable:true,
                            PointIndex:pointIndex,
                            Distance:this.Option.Magnet.Distance,
                            Type:this.Option.Magnet.Type
                        }
                    }
                }
                
                this.AdjustPoint(drawPoint,option)
            }
        }

        return drawPoint;
    }

    //修正X, Y轴坐标
    this.AdjustPoint=function(aryPoint, option)
    {
        if (!this.Frame) return false;

        if (this.Frame.ClassName=="MinuteFrame" || this.Frame.Class=="MinuteHScreenFrame")
            return false;
        

        return this.AdjustPoint_KLine(aryPoint, option);
    }

    this.AdjustPoint_KLine=function(aryPoint, option)
    {
        if (!option) return false;
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;
        
        var isHScreen=this.Frame.IsHScreen;
        if (isHScreen)
        {
            for(var i=0; i<aryPoint.length; ++i)
            {
                var item=aryPoint[i];
                var xValue=parseInt(this.Frame.GetXData(item.Y))+data.DataOffset;
            }
        }
        else
        {
            for(var i=0; i<aryPoint.length; ++i)
            {
                var item=aryPoint[i];
                var index=parseInt(this.Frame.GetXData(item.X,false));
                var xValue=index+data.DataOffset;
                if (xValue<0) xValue=0;
                else if (xValue>=data.Data.length) xValue=data.Data.length-1;

                if (option.IsFixedX)
                {
                    index=xValue-data.DataOffset;
                    item.X=this.Frame.GetXFromIndex(index,false);
                }

                //磁吸
                if (option.Magnet && option.Magnet.Enable && i==option.Magnet.PointIndex)
                {
                    var kline=data.Data[xValue];
                    var aryKValue=[kline.Open, kline.High, kline.Low, kline.Close];
                    var yMinDistance=null, yKLine=null;
                    for(var j=0; j<aryKValue.length; ++j)
                    {
                        var yPrice=this.Frame.GetYFromData(aryKValue[j]);
                        var value=Math.abs(item.Y-yPrice);
                        if (!IFrameSplitOperator.IsNumber(yMinDistance) || yMinDistance>value) 
                        {
                            yMinDistance=value;
                            yKLine=yPrice;
                        }
                    }

                    if (option.Magnet.Type==1)  //只能在K线上
                    {
                        if (IFrameSplitOperator.IsNumber(yKLine)) 
                            item.Y=yKLine;
                    }
                    else
                    {
                        if (yMinDistance<option.Magnet.Distance && IFrameSplitOperator.IsNumber(yKLine))
                            item.Y=yKLine;
                    }
                }
            }
        }
    }

    this.IsYValueInFrame=function(yValue)
    {
        if (!this.Frame) return false;

        if (yValue>this.Frame.HorizontalMax || yValue<this.Frame.HorizontalMin) return false;

        return true;
    }

    this.DrawPoint=function(aryPoint)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) return;

        var color=this.PointColor;
        var isMoveOn=false;
        if (this.IsShowPoint)
        {

        }
        else
        {
            if (this.GetActiveDrawPicture)
            {
                var active=this.GetActiveDrawPicture();
                if (active.Move.Guid!=this.Guid && active.Select.Guid!=this.Guid && active.MoveOn.Guid!=this.Guid) 
                    return;
                
                if (active.Select.Guid!=this.Guid && active.MoveOn.Guid==this.Guid)
                {
                    isMoveOn=true;
                    color=this.MoveOnPointColor;
                }
            }
        }
        
        //画点
        this.ClipFrame();
        var pixel=1;
        this.Canvas.fillStyle=color;      //填充颜色

        if (this.PointType==2)
        {
            this.Canvas.fillStyle=this.PointBGColor;      //背景填充颜色
            this.Canvas.strokeStyle=this.PointColor;

            if (isMoveOn) this.Canvas.lineWidth=1*pixel;
            else this.Canvas.lineWidth=2*pixel;
        }

        for(var i=0; i<aryPoint.length; ++i)
        {
            var item=aryPoint[i];

            if (this.PointType==1)  //正方形
            {
                var value=this.SquareSize*pixel;
                var x=item.X-value/2;
                var y=item.Y-value/2;
                this.Canvas.fillRect(x,y,value,value);   //画一个背景色, 不然是一个黑的背景
            }
            else if (this.PointType==2) //空心圆
            {
                var path=new Path2D();
                path.arc(item.X,item.Y,this.PointRadius*pixel,0,360,false);
                this.Canvas.fill(path); 
                this.Canvas.stroke(path);
            }
            else    //实心圆
            {
                this.Canvas.beginPath();
                this.Canvas.arc(item.X,item.Y,this.PointRadius*pixel,0,360,false);
                this.Canvas.fill();                         //画实心圆
                this.Canvas.closePath();
            }
            
        }

        this.Canvas.restore();
    }

    this.DrawArrow=function(ptStart,ptEnd)
    {
        //计算箭头
        var theta=35;       //三角斜边一直线夹角
        var headlen=10;    //三角斜边长度
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
        this.Canvas.stroke();
    }

    //计算2个点线的,左右的延长线的点
    this.CalculateExtendLinePoint=function(ptStart,ptEnd)
    {
        var result={};

        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        var top=this.Frame.ChartBorder.GetTopEx();
        var bottom=this.Frame.ChartBorder.GetBottom();

        var a=ptEnd.X-ptStart.X;
        var b=ptEnd.Y-ptStart.Y;

        if (a>0)
        {
            var b2=bottom-ptStart.Y;
            var a2=a*b2/b;

            var pt=new Point();
            pt.X=ptStart.X+a2;
            pt.Y=bottom;
            result.End=pt;


            var b2=ptEnd.Y-top;
            var a2=a*b2/b;
            var pt2=new Point();
            pt2.Y=top;
            pt2.X=ptEnd.X-a2;
            result.Start=pt2;
        }
        else
        {
            var b2=bottom-ptStart.Y;
            var a2=Math.abs(a)*b2/b;

            var pt=new Point();
            pt.X=ptStart.X-a2;;
            pt.Y=bottom;
            result.End=pt;

            var b2=ptEnd.Y-top;
            var a2=Math.abs(a)*b2/b;
            var pt2=new Point();
            pt2.Y=top;
            pt2.X=ptEnd.X+a2;
            result.Start=pt2;
        }

        return result;
    }

    //计算2个点线的,点0->点1->延长线的点
    this.CalculateExtendLineEndPoint=function(aryPoint)
    {
        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        var bottom=this.Frame.ChartBorder.GetBottomEx();
        var top=this.Frame.ChartBorder.GetTopEx();

        var a=aryPoint[1].X-aryPoint[0].X;
        var b=aryPoint[1].Y-aryPoint[0].Y;

        if (a>0)
        {
            var a1=right-aryPoint[0].X;
            var b1=a1*b/a;
            var y=b1+aryPoint[0].Y;

            if (y>=top && y<=bottom)
            {
                var pt=new Point();
                pt.X=right;
                pt.Y=y;
                return pt;
            }

            if (b>0)
            {
                var b2=bottom-aryPoint[0].Y;
                var a2=a*b2/b;
                var x=a2+aryPoint[0].X;
    
                var pt2=new Point();
                pt2.X=x;
                pt2.Y=bottom;
                return pt2;
            }
            else if (b==0)
            {
                var pt2=new Point();
                pt2.X=right;
                pt2.Y=aryPoint[0].Y;
                return pt2;
            }
            else
            {
                var b2=top-aryPoint[0].Y;
                var a2=a*b2/b;
                var x=a2+aryPoint[0].X;

                var pt2=new Point();
                pt2.X=x;
                pt2.Y=top;
                return pt2;
            }
        }
        else
        {
            var a1=aryPoint[0].X-left;
            var b1=a1*b/Math.abs(a);
            var y=b1+aryPoint[0].Y;

            if (y>=top && y<=bottom)
            {
                var pt=new Point();
                pt.X=left;
                pt.Y=y;
                return pt;
            }

            if (b>0)
            {
                var b2=bottom-aryPoint[0].Y;
                var a2=a*b2/b;
                var x=a2+aryPoint[0].X;
    
                var pt2=new Point();
                pt2.X=x;
                pt2.Y=bottom;
                return pt2;
            }
            else if (b==0)
            {
                var pt2=new Point();
                pt2.X=left;
                pt2.Y=aryPoint[0].Y;
                return pt2;
            }
            else
            {
                var b2=top-aryPoint[0].Y;
                var a2=a*b2/b;
                var x=a2+aryPoint[0].X;

                var pt2=new Point();
                pt2.X=x;
                pt2.Y=top;
                return pt2;
            }
        }
    }

    //坐标是否在点上 返回在第几个点上
    this.IsPointInXYValue=function(x, y, option)
    {
        if (!this.Frame) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;
        if (!this.Value) return -1;

        var radius=this.TouchConfig.Point.Radius;
        if (option && IFrameSplitOperator.IsNumber(option.Zoom)) radius+=option.Zoom;
        else if (this.Option && IFrameSplitOperator.IsNumber(this.Option.Zoom)) radius+=this.Option.Zoom;

        var isHScreen=this.Frame.IsHScreen;
        for(var i=0;i<this.Value.length; ++i)   //是否在点上
        {
            var item=this.Value[i];
            var pt=new Point();
            if (isHScreen)
            {
                pt.Y=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
                pt.X=this.Frame.GetYFromData(item.YValue);
            }
            else
            {
                pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
                pt.Y=this.Frame.GetYFromData(item.YValue);
            }
            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,radius,0,360);
            if (this.Canvas.isPointInPath(x,y))  return i;
        }

        return -1;
    }

    //坐标是否在线段上 返回在第几个线段上
    this.IsPointInLine=function(x, y, option)
    {
        if (!this.LinePoint) return -1;
        
        var lineWidth=this.TouchConfig.Line.Width;
        if (IFrameSplitOperator.IsPlusNumber(this.PixelRatio)) lineWidth=this.PixelRatio*this.TouchConfig.Line.Width

        for(var i=0;i<this.LinePoint.length; ++i)
        {
            var item=this.LinePoint[i];
            var ptStart=item.Start;
            var ptEnd=item.End;
            this.Canvas.beginPath();
            if (ptStart.X==ptEnd.X) //竖线
            {
                this.Canvas.moveTo(ptStart.X-lineWidth,ptStart.Y);
                this.Canvas.lineTo(ptStart.X+lineWidth,ptStart.Y);
                this.Canvas.lineTo(ptEnd.X+lineWidth,ptEnd.Y);
                this.Canvas.lineTo(ptEnd.X-lineWidth,ptEnd.Y);
            }
            else
            {
                this.Canvas.moveTo(ptStart.X,ptStart.Y+lineWidth);
                this.Canvas.lineTo(ptStart.X,ptStart.Y-lineWidth);
                this.Canvas.lineTo(ptEnd.X,ptEnd.Y-lineWidth);
                this.Canvas.lineTo(ptEnd.X,ptEnd.Y+lineWidth);
            }
            this.Canvas.closePath();

            //for debug
            //this.Canvas.fillStyle='RGB(22,100,100)';
            //this.Canvas.fill();
            if (this.Canvas.isPointInPath(x,y))
                return i;
        }

        return -1;
    }

    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn_XYValue_Line=function(x, y, option)
    {
        if (this.Status!=10) return -1;

        var value=this.IsPointInXYValue(x,y,option);
        if (value>=0) return value;

        value=this.IsPointInLine(x,y,option);
        if (value>=0) return 100;

        return -1;
    }

    this.DrawLine=function(ptStart,ptEnd,isDottedline)
    {
        if (isDottedline) this.Canvas.setLineDash([5,10]);

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ptStart.X,ptStart.Y);
        this.Canvas.lineTo(ptEnd.X,ptEnd.Y);
        this.Canvas.stroke();

        if (isDottedline) this.Canvas.setLineDash([]);
    }

    this.CreateLineData=function(ptStart,ptEnd)
    {
        var line={Start:new Point(), End:new Point()};
        line.Start.Y=ptStart.Y;
        line.Start.X=ptStart.X;
        line.End.Y=ptEnd.Y;
        line.End.X=ptEnd.X;

        return line;
    }

    //导出成存储格式
    this.ExportStorageData=function()
    {
        var storageData=
        { 
            ClassName:this.ClassName, 
            Symbol:this.Symbol, Guid:this.Guid, Period:this.Period,Value:[] ,
            FrameID:this.Frame.Identify, LineColor:this.LineColor, AreaColor:this.AreaColor,
            LineWidth:this.LineWidth, Right:this.Right, EnableSave:this.EnableSave,
            IsShowYCoordinate:this.IsShowYCoordinate
        };

        for(var i=0; i<this.Value.length; ++i)
        {
            var item=this.Value[i];
            storageData.Value.push({ XValue:item.XValue, YValue:item.YValue, DateTime:item.DateTime });
        }

        if (this.Text) storageData.Text=this.Text;  //如果有文本, 也导出
        if (this.FontOption) storageData.FontOption=this.FontOption;    //字体也导出

        return storageData;
    }

    //导出基础的配置 不包含点
    this.ExportBaseData=function()
    {
        var data=
        { 
            ClassName:this.ClassName, Guid:this.Guid, FrameID:this.Frame.Identify, 
            Symbol:this.Symbol,  Period:this.Period,Right:this.Right,
            LineColor:this.LineColor, 
            LineWidth:this.LineWidth,  
            EnableSave:this.EnableSave, IsShowYCoordinate:this.IsShowYCoordinate
        };

        if (this.AreaColor) data.AreaColor=this.AreaColor;
        if (this.Text) data.Text=this.Text;  //如果有文本, 也导出
        if (this.FontOption) 
        {
            data.FontOption={};
            this.SetFont(data.FontOption, this.FontOption); //字体也导出
        }

        return data;
    }

    this.IsFrameMinSize=function()   //框架是否是最小化模式
    {
        return this.Frame && this.Frame.IsMinSize;
    }


    this.PointRange=function(aryPoint)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryPoint)) return null;
        if (aryPoint.length==1) 
        {
            var data=
            { 
                Points:[ { X:aryPoint[0].X, Y:aryPoint[0].Y } ]
            };

            return data;
        }
        else
        {
            var xMax=aryPoint[0].X;
            var xMin=xMax;
    
            var yMax=aryPoint[0].Y;
            var yMin=yMax;
            var aryData=[{ X:aryPoint[0].X, Y:aryPoint[0].Y }];
            for(var i=1;i<aryPoint.length;++i)
            {
                if (xMax<aryPoint[i].X) xMax=aryPoint[i].X;
                if (xMin>aryPoint[i].X) xMin=aryPoint[i].X;
    
                if (yMax<aryPoint[i].Y) yMax=aryPoint[i].Y;
                if (yMin>aryPoint[i].Y) yMin=aryPoint[i].Y;
    
                aryData.push({X:aryPoint[i].X, Y:aryPoint[i].Y});
            }

            var data=
            { 
                X: { Max: { X:xMax }, Min: { X:xMin} }, 
                Y: { Max: { Y:yMax},  Min: { Y:yMin} },
                Points: aryData //所有的点
            };

            return data;
        }        
    }

    this.GetXYCoordinate_default=function()
    {
        if (this.IsFrameMinSize()) return null;
        var drawPoint=this.CalculateDrawPoint( {IsCheckX:true, IsCheckY:true} );

        return this.PointRange(drawPoint);
    }

    this.GetXYCoordinate=function()
    {
        return null;
    }

    this.CopyData_default=function()
    {
        if (!this.Frame) return null;

        var data=this.ExportStorageData();
        if (!data) return null;

        var dataOffset=0;
        if (this.Frame.ClassName=="MinuteFrame" || this.Frame.Class=="MinuteHScreenFrame")
        {
            
        }
        else
        {
            var kData=this.Frame.Data;
            if (!kData) return null;

            dataOffset=kData.DataOffset;
        }

        var height=this.Frame.ChartBorder.GetHeight();
        var yFirst=this.Frame.ChartBorder.GetBottomEx()-this.Point[0].Y;

        for(var i=0;i<data.Value.length; ++i)
        {
            var item=data.Value[i];
            var itemPoint=this.Point[i];

            item.XIndex=item.XValue-dataOffset+1;

            if (i==0) 
            {
                item.XOffset=0;
                item.YOffset=0;
            }
            else
            {
                var preItem=data.Value[i-1];
                var prePoint=this.Point[i-1];
                item.XOffset=item.XValue-preItem.XValue;
                item.YOffset=itemPoint.Y-prePoint.Y;
            }
        }

        data.DataOffset=dataOffset;
        data.YFristScale=yFirst/height;
        data.Height=height; //Y轴最大-最小差值

        return data;
    }

    this.SetFont=function(destFont, srcFont)
    {
        if (!srcFont) return;
        if (!destFont) return;
       
        if (srcFont.Family) destFont.Family=srcFont.Family;
        if (srcFont.Weight) destFont.Weight=srcFont.Weight;
        if (srcFont.Style) destFont.Style=srcFont.Style;
        if (IFrameSplitOperator.IsNumber(srcFont.Size)) destFont.Size=srcFont.Size;
    }

    this.GetFontString=function(fontOption)
    {
        const defaultFont="16px 微软雅黑";
        if (!fontOption || !fontOption.Family || !IFrameSplitOperator.IsPlusNumber(fontOption.Size)) return defaultFont;

        var font='';
        if (fontOption.Color) font+=fontOption.Color+' ';
        if (fontOption.Style) font+=fontOption.Style+' ';
        if (fontOption.Weight) font+=fontOption.Weight+' ';

        font+=fontOption.Size+'px ';
        font+=fontOption.Family;

        return font;
    }

    //获得多行文本
    this.GetMultiLineText=function(text, maxWidth, font , option)
    {
        if (font) this.Canvas.font=font;
        
        var textWidth=this.Canvas.measureText(text).width;
        if (textWidth<=maxWidth) return { AryText:[{Text:text }] };

        var singleWidth=this.Canvas.measureText("擎").width;
        var estimateCount=parseInt(maxWidth/singleWidth);    //预估个数
        var endPos=0;

        var aryText=[];
        while(endPos<text.length-1)
        {
            var count=estimateCount;
            var pos=endPos+count;
            if (pos>=text.length) 
            {
                pos=text.length-1;
                count=pos-endPos;
            }

            var subText=text.slice(endPos,endPos+count);
            var textWidth=this.Canvas.measureText(subText).width;
            if (textWidth>maxWidth)
            {
                for(var i=count; i>=0 ;--i)
                {
                    subText=text.slice(endPos, endPos+i);
                    textWidth=this.Canvas.measureText(subText).width;
                    if (textWidth<maxWidth)
                    {
                        aryText.push({Text:subText});
                        endPos+=i;
                        break;
                    }
                }
            }
            else if (textWidth<maxWidth)
            {
                var bFind=false;
                for(var i=count;(i+endPos)<=text.length;++i)
                {
                    subText=text.slice(endPos, endPos+i);
                    textWidth=this.Canvas.measureText(subText).width;
                    if (textWidth>maxWidth)
                    {
                        subText=text.slice(endPos, endPos+i-1);
                        aryText.push({Text:subText});
                        endPos+=i-1;
                        bFind=true;
                        break;
                    }
                }

                if (!bFind) 
                {
                    aryText.push({Text:subText});
                    endPos=text.length-1;
                }
            }
            else
            {
                aryText.push({Text:subText});
                endPos+=count;
            }
        }

        return { AryText:aryText };
    }

    this.CloneArrayText=function(aryText)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryText)) return [];

        var aryValue=[];
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            if (!item) continue;

            aryValue.push({ Text:item.Text });
        }

        return aryValue;
    }

    //计算角度
    this.CalculateAngle=function(x1, y1, x2,y2)
    {
        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = x / z;
        var radina = Math.acos(cos);   //用反三角函数求弧度
        var angle = 180 / (Math.PI / radina);//将弧度转换成角度 

        if (x2 == x1 && y2 < y1)    
            return 90;

        if (x2 == x1 && y2 > y1)    
            return 270;

        if (x2 > x1 && y2 == y1)    
            return 0;

        if (x2 < x1 && y2 == y1)
            return 180;

        if (x2 > x1 && y2 > y1)     //第四象限
            return 360 - angle;

        if (x2 < x1 && y2 > y1)     //第三象限
            return 180 + angle;
       
        if (x2 < x1 && y2 < y1)     //第二象限
            return 180 - angle;

        return angle;
    }

    //复制
    //this.CopyData=function() { }
    //this.PtInButtons=function(x, y) { }
}


IChartDrawPicture.ArrayDrawPricture=
[
    { Name:"线段", ClassName:'ChartDrawPictureLine',  Create:function() { return new ChartDrawPictureLine(); } },
    { Name:"射线", ClassName:'ChartDrawPictureHaflLine',  Create:function() { return new ChartDrawPictureHaflLine(); } },
    { Name:"箭头", ClassName:"ChartDrawArrowLine", Create:function() { return new ChartDrawArrowLine(); } },
    { Name:"水平线", ClassName:'ChartDrawPictureHorizontalLine',  Create:function() { return new ChartDrawPictureHorizontalLine(); }},
    { Name:"标价线2", ClassName:"ChartDrawPriceLineV2", Create:function() { return new ChartDrawPriceLineV2(); } },
];

IChartDrawPicture.GetDrawPictureByName=function(value)
{
    for(var i=0; i<IChartDrawPicture.ArrayDrawPricture.length; ++i)
    {
        var item=IChartDrawPicture.ArrayDrawPricture[i];
        if (item.Name==value) return item;
    }

    return null;
}

IChartDrawPicture.CreateChartDrawPicture=function(obj)    //创建画图工具
{
    var item=IChartDrawPicture.GetDrawPictureByClassName(obj.ClassName);
    if (!item) return null;

    var chartDraw=item.Create();    

    //TODO:后面都放到每一个SetOptin里面
    if (obj.Period>=0) chartDraw.Period=obj.Period;
    if (obj.Right>=0) chartDraw.Right=obj.Right;
    if (obj.Guid) chartDraw.Guid=obj.Guid;
    if (obj.Symbol) chartDraw.Symbol=obj.Symbol;
    if (obj.Value) chartDraw.Value=obj.Value;
    if (obj.Text) chartDraw.Text=obj.Text;
    if (obj.LineColor) chartDraw.LineColor=obj.LineColor;
    if (obj.AreaColor) chartDraw.AreaColor=obj.AreaColor;
    if (obj.FontOption) chartDraw.FontOption=obj.FontOption;
    if (obj.Label) chartDraw.Label=obj.Label;
    if (obj.LineWidth>0) chartDraw.LineWidth=obj.LineWidth;
    if (obj.EnableMove===false) chartDraw.EnableMove=obj.EnableMove;
    if (IFrameSplitOperator.IsBool(obj.EnableSave)) chartDraw.EnableSave=obj.EnableSave;
    if (IFrameSplitOperator.IsNumber(obj.ChannelWidth)) chartDraw.ChannelWidth=obj.ChannelWidth;
    if (IFrameSplitOperator.IsBool(obj.IsShowYCoordinate)) chartDraw.IsShowYCoordinate=obj.IsShowYCoordinate;

    if (chartDraw.SetOption) chartDraw.SetOption(obj);

    return chartDraw;
}

//画图工具-线段
function ChartDrawPictureLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawPictureLine';
    this.IsPointIn=this.IsPointIn_XYValue_Line;
    this.GetXYCoordinate=this.GetXYCoordinate_default;
    this.IsShowYCoordinate=false;
    this.CopyData=this.CopyData_default;
    this.OnlyMoveXIndex=true;
    this.IsSupportMagnet=true;

    this.Draw=function()
    {
        this.LinePoint=[];
        if (this.IsFrameMinSize()) return;
        if (!this.IsShow) return;

        var drawPoint=this.CalculateDrawPoint( {IsCheckX:true, IsCheckY:true} );
        if (!drawPoint) return;
        if (drawPoint.length!=2) return;

        this.ClipFrame();

        var ptStart=drawPoint[0];
        var ptEnd=drawPoint[1];

        this.SetLineWidth();
        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ptStart.X,ptStart.Y);
        this.Canvas.lineTo(ptEnd.X,ptEnd.Y);
        this.Canvas.stroke();
        this.RestoreLineWidth();

        /*
        if (this.IsSelected)
        {
            this.Canvas.strokeStyle='rgba(255,0,0,0.5)';
            this.Canvas.lineWidth=20 * GetDevicePixelRatio();
            this.Canvas.stroke();
        }
        */

        var line={Start:ptStart, End:ptEnd};
        this.LinePoint.push(line);
        
        this.DrawPoint(drawPoint);  //画点
        this.Canvas.restore();
    }

    this.GetYCoordinatePoint=function()
    {
        if (this.IsFrameMinSize()) return null;

        if (this.Status<2) return null;
        if(!this.Point.length || !this.Frame) return null;
        if (this.Status!=10)  return null;
          
        //完成
        var aryPoint=[];
        for(var i=0; i<this.Value.length; ++i)
        {
            var item=this.Value[i];
            var y=this.Frame.GetYFromData(item.YValue,false);

            aryPoint.push({ Y:y, YValue:item.YValue, Item:item, Color:this.PointColor });
        }

        return aryPoint;
    }
}

//画图工具-射线
function ChartDrawPictureHaflLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawPictureHaflLine';
    this.GetXYCoordinate=this.GetXYCoordinate_default;
    this.OnlyMoveXIndex=true;
    this.IsSupportMagnet=true;
    
    this.FullLine;

    this.IsPointIn=function(x, y, option)
    {
        var result=this.IsPointIn_XYValue_Line(x,y,option);
        if (result>=0) return result;

        if (!this.FullLine) return result;

        var ptStart=this.FullLine.Start;
        var ptEnd=this.FullLine.End;
        var lineWidth=this.TouchConfig.Line.Width;

        this.Canvas.beginPath();
        if (ptStart.X==ptEnd.X) //竖线
        {
            this.Canvas.moveTo(ptStart.X-lineWidth,ptStart.Y);
            this.Canvas.lineTo(ptStart.X+lineWidth,ptStart.Y);
            this.Canvas.lineTo(ptEnd.X+lineWidth,ptEnd.Y);
            this.Canvas.lineTo(ptEnd.X-lineWidth,ptEnd.Y);
        }
        else
        {
            this.Canvas.moveTo(ptStart.X,ptStart.Y+lineWidth);
            this.Canvas.lineTo(ptStart.X,ptStart.Y-lineWidth);
            this.Canvas.lineTo(ptEnd.X,ptEnd.Y-lineWidth);
            this.Canvas.lineTo(ptEnd.X,ptEnd.Y+lineWidth);
        }
        this.Canvas.closePath();

        if (this.Canvas.isPointInPath(x,y))
            return 100;

        return result;
    }

    this.Draw=function()
    {
        this.LinePoint=[];
        this.FullLine=null;
        if (this.IsFrameMinSize()) return;
        if (!this.IsShow) return;

        var drawPoint=this.CalculateDrawPoint({IsCheckX:false, IsCheckY:false});
        if (!drawPoint || drawPoint.length!=2) return;

        var ptStart=drawPoint[0];
        var ptEnd=drawPoint[1];
        this.ClipFrame();

        this.Canvas.strokeStyle=this.LineColor;
        this.SetLineWidth();
        this.Canvas.beginPath();
        this.Canvas.moveTo(drawPoint[0].X,drawPoint[0].Y);
        this.Canvas.lineTo(drawPoint[1].X,drawPoint[1].Y);
        var endPoint=this.CalculateExtendLineEndPoint(drawPoint);
        this.Canvas.lineTo(endPoint.X,endPoint.Y);
        this.Canvas.stroke();
        this.RestoreLineWidth();

        var line={Start:ptStart, End:ptEnd};
        this.LinePoint.push(line);

        this.DrawPoint(drawPoint);  //画点
        this.Canvas.restore();

        this.FullLine={Start:drawPoint[0], End:endPoint};
    }
}

//画图工具-箭头线
function ChartDrawArrowLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawArrowLine';
    this.IsPointIn=this.IsPointIn_XYValue_Line;
    this.ArrawLineWidth=5;
    this.ArrawLength=15;        //三角斜边长度
    this.ArrawAngle=35;         //三角斜边一直线夹角
    this.GetXYCoordinate=this.GetXYCoordinate_default;
    this.OnlyMoveXIndex=true;
    this.IsSupportMagnet=true;

    this.Draw=function()
    {
        this.LinePoint=[];
        if (this.IsFrameMinSize()) return;
        if (!this.IsShow) return;

        var drawPoint=this.CalculateDrawPoint( {IsCheckX:true, IsCheckY:true} );
        if (!drawPoint) return;
        if (drawPoint.length!=2) return;

        this.ClipFrame();

        var ptStart=drawPoint[0];
        var ptEnd=drawPoint[1];

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


        this.SetLineWidth();
        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ptStart.X,ptStart.Y);
        this.Canvas.lineTo(ptEnd.X,ptEnd.Y);
        this.Canvas.stroke();

        this.Canvas.beginPath();

        var arrowX = ptEnd.X + topX;
        var arrowY = ptEnd.Y + topY;
        this.Canvas.moveTo(arrowX,arrowY);

        this.Canvas.lineTo(ptEnd.X, ptEnd.Y);

        arrowX = ptEnd.X + botX;
        arrowY = ptEnd.Y + botY;
        this.Canvas.lineTo(arrowX,arrowY);

        this.Canvas.lineWidth=this.ArrawLineWidth;
        this.Canvas.stroke();

        this.RestoreLineWidth();

        /*
        if (this.IsSelected)
        {
            this.Canvas.strokeStyle='rgba(255,0,0,0.5)';
            this.Canvas.lineWidth=20 * GetDevicePixelRatio();
            this.Canvas.stroke();
        }
        */

        var line={Start:ptStart, End:ptEnd};
        this.LinePoint.push(line);
        
        this.DrawPoint([drawPoint[0]]);  //画点
        this.Canvas.restore();
    }
}

// 画图工具-水平线 支持横屏
function ChartDrawPictureHorizontalLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Super_SetOption=this.SetOption;    //父类函数
    this.Super_ExportStorageData=this.ExportStorageData;

    this.Label; //{Text:文本, Position: 0=左, 1=右 }

    this.SetOption=function(option)
    {
        if (this.Super_SetOption) this.Super_SetOption(option);
        if (option)
        {
            if (option.Label) this.Label=option.Label;
        }
    }

    this.ExportStorageData=function()
    {
        var storageData;
        if (this.Super_ExportStorageData) 
        {
            storageData=this.Super_ExportStorageData();
            if (this.Label) storageData.Label=this.Label;
        }

        return storageData;
    }

    this.PointCount=1;
    this.ClassName='ChartDrawPictureHorizontalLine';
    this.IsPointIn=this.IsPointIn_XYValue_Line;
    this.Font=16+"px 微软雅黑";

    this.GetXYCoordinate=function()
    {
        if (this.IsFrameMinSize()) return null;
        var drawPoint=this.CalculateDrawPoint();

        return this.PointRange(drawPoint);
    }

    this.Draw=function()
    {
        this.LinePoint=[];
        if (this.IsFrameMinSize()) return;
        if (!this.IsShow) return;

        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=1) return;
        if (!this.Frame) return;
        if (this.Value.length!=1) return;
        if (!this.IsYValueInFrame(this.Value[0].YValue)) return null;

        var isHScreen=this.Frame.IsHScreen;
        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        if (isHScreen)
        {
            left=this.Frame.ChartBorder.GetTop();
            right=this.Frame.ChartBorder.GetBottom();
        }
        this.ClipFrame();

        this.Canvas.strokeStyle=this.LineColor;
        this.SetLineWidth();
        this.Canvas.beginPath();
        if (isHScreen)
        {
            this.Canvas.moveTo(drawPoint[0].X,left);
            this.Canvas.lineTo(drawPoint[0].X,right);
        }
        else
        {
            this.Canvas.moveTo(left,drawPoint[0].Y);
            this.Canvas.lineTo(right,drawPoint[0].Y);
        }
        this.Canvas.stroke();
        this.RestoreLineWidth();

        var line={Start:new Point(), End:new Point()};
        if (isHScreen)
        {
            line.Start.X=drawPoint[0].X;
            line.Start.Y=left;
            line.End.X=drawPoint[0].X;
            line.End.Y=right;
        }
        else
        {
            line.Start.X=left;
            line.Start.Y=drawPoint[0].Y;
            line.End.X=right;
            line.End.Y=drawPoint[0].Y;
        }
        this.LinePoint.push(line);

        //画点
        this.DrawPoint(drawPoint);

        //显示价格
        this.LineText(drawPoint[0])
        /*
        this.Canvas.fillStyle=this.LineColor;
        this.Canvas.font=this.Font;
        if (isHScreen)
        {
            this.Canvas.textAlign="left";
            this.Canvas.textBaseline="bottom";
            var xText=drawPoint[0].X;
            var yText=left;
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
            var yValue=this.Frame.GetYData(drawPoint[0].X);
            var text=yValue.toFixed(2);
            if (this.Label)
            {
                if (this.Label.Position==0) text=this.Label.Text+yValue.toFixed(2);
                else if (this.Label.Position==1) text=yValue.toFixed(2)+this.Label.Text;
            }
            this.Canvas.fillText(text,0,0);
        }
        else
        {
            this.Canvas.textAlign="left";
            this.Canvas.textBaseline="bottom";
            var yValue=this.Frame.GetYData(drawPoint[0].Y);
            var text=yValue.toFixed(2);
            if (this.Label)
            {
                if (this.Label.Position==0) text=this.Label.Text+yValue.toFixed(2);
                else if (this.Label.Position==1) text=yValue.toFixed(2)+this.Label.Text;
            }
            this.Canvas.fillText(text,left,drawPoint[0].Y);
        }
        */
        
        this.Canvas.restore();
    }

    this.LineText=function(point)
    {
        if (!point) return;

        var isHScreen=this.Frame.IsHScreen;
        var left=this.Frame.ChartBorder.GetLeft();

        this.Canvas.fillStyle=this.LineColor;
        this.Canvas.font=this.Font;

        if (isHScreen)
        {
            left=this.Frame.ChartBorder.GetTop();
            this.Canvas.textAlign="left";
            this.Canvas.textBaseline="bottom";
            var xText=point.X;
            var yText=left;
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度
            var yValue=this.Frame.GetYData(point.X);
            var text=yValue.toFixed(2);
            if (this.Label)
            {
                if (this.Label.Position==0) text=this.Label.Text+yValue.toFixed(2);
                else if (this.Label.Position==1) text=yValue.toFixed(2)+this.Label.Text;
            }
            this.Canvas.fillText(text,2,0);
        }
        else
        {
            this.Canvas.textAlign="left";
            this.Canvas.textBaseline="bottom";
            var yValue=this.Frame.GetYData(point.Y);
            var text=yValue.toFixed(2);
            if (this.Label)
            {
                if (this.Label.Position==0) text=this.Label.Text+yValue.toFixed(2);
                else if (this.Label.Position==1) text=yValue.toFixed(2)+this.Label.Text;
            }
            this.Canvas.fillText(text,left,point.Y);
        }
    }
}

//画图工具-标价线2 支持横屏
function ChartDrawPriceLineV2()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName='ChartDrawPriceLineV2';
    this.Font="12px 微软雅黑";
    this.PointCount=1;
    this.IsPointIn=this.IsPointIn_XYValue_Line;
    this.IsHScreen=false;
    this.LineWidth=1;
    //this.IsDrawFirst=true;
    this.TextColor="rgb(255,255,255)";
    this.Title; //标题
    this.TextPosition=[null, 0];   //[0]=左侧(没有做)     [1]=右侧  0=自动 1=内部 2=外部

    this.Super_SetOption=this.SetOption;    //父类函数
    this.SetOption=function(option)
    {
        if (this.Super_SetOption) this.Super_SetOption(option);
        if (option)
        {
            if (option.TextColor) this.TextColor=option.TextColor;
            if (option.Title) this.Title=option.Title;
            if (IFrameSplitOperator.IsNonEmptyArray(option.TextPosition)) this.TextPosition=option.TextPosition.slice();
        }
    }

    this.Draw=function()
    {
        this.LinePoint=[];
        if (this.IsFrameMinSize()) return;
        if (!this.IsShow) return;

        var drawPoint=this.CalculateDrawPoint( { IsCheckX:false, IsCheckY:true } );
        if (!drawPoint) return;
        if (drawPoint.length!=1) return;
        if (!this.IsYValueInFrame(this.Value[0].YValue)) return;

        this.IsHScreen=this.Frame.IsHScreen;
        var chartBorder=this.Frame.ChartBorder;
        var border=this.Frame.GetBorder();
        if (this.IsHScreen)
        {
            var left=border.LeftEx;
            var right=border.RightEx;
            var bottom=border.Bottom;
            var top=border.Top;

            var ptStart={ X:drawPoint[0].X, Y:top };
            if (ptStart.X<left || ptStart.X>right) return;
            
            var ptEnd={X:drawPoint[0].X, Y:bottom };
            var price=this.Frame.GetYData(ptStart.X, false);
        }
        else
        {
            var bottom=border.BottomEx;
            var top=border.TopTitle;
            var left=border.Left;
            var right=border.Right;

            var ptStart={ X:left, Y:drawPoint[0].Y };
            if (ptStart.Y<top || ptStart.Y>bottom) return;

            var ptEnd={ X:right, Y:drawPoint[0].Y };
            var price=this.Frame.GetYData(ptStart.Y, false);
        }
        
        //this.ClipFrame();
       
        this.SetLineWidth();
        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ToFixedPoint(ptStart.X),ToFixedPoint(ptStart.Y));
        this.Canvas.lineTo(ToFixedPoint(ptEnd.X),ToFixedPoint(ptEnd.Y));
        this.Canvas.stroke();
        this.RestoreLineWidth();

        var line={Start:ptStart, End:ptEnd};
        this.LinePoint.push(line);

       
        
        var pixelTatio =1;
        this.Canvas.font=this.Font;
        var offset=2*pixelTatio;
        var xText=ptEnd.X;
        var yText=ptEnd.Y;

        this.Canvas.textBaseline='middle';
        this.Canvas.textAlign='left';
        var textHeight=this.GetFontHeight();
        var text=price.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2*offset;

        var centerPoint=null;
        if (this.IsHScreen)
        {
            var position=this.TextPosition[1];
            var bDrawInside=false;  //在内部绘制
            if (position==0) bDrawInside=chartBorder.Bottom<=10;
            else if (position==1) bDrawInside=true;
            else if (position==2) bDrawInside=false;

            if (!bDrawInside)
            {
                var rtBG={ Left:(xText-textHeight/2), Top:yText , Width: textHeight, Height:textWidth };
            }
            else    //框架内部显示
            {
                yText=yText-textWidth;
                var rtBG={ Left:(xText-textHeight/2), Top:yText , Width:textHeight, Height: textWidth};
            }
            
            this.Canvas.fillStyle=this.LineColor;
            this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);

            this.Canvas.save();
            this.Canvas.translate(xText,yText+1*pixelTatio);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillStyle=this.TextColor;
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();

            if (this.Title)
            {
                var textWidth=this.Canvas.measureText(this.Title).width+2*pixelTatio;
                if (!bDrawInside)
                {
                    var rtTitle={ Left:rtBG.Left, Top:bottom-textWidth-1*pixelTatio, Width:textHeight, Height:textWidth };
                }
                else
                {
                    var rtTitle={Left:rtBG.Left, Top:rtBG.Top-textWidth-1*pixelTatio, Width:textHeight, Height:textWidth}
                }

                this.Canvas.fillStyle=this.LineColor;
                this.Canvas.fillRect(rtTitle.Left, rtTitle.Top, rtTitle.Width, rtTitle.Height);

                this.Canvas.save();
                this.Canvas.translate(xText,rtTitle.Top+1*pixelTatio);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(this.Title,0,0);
                this.Canvas.restore();
            }

            centerPoint={ X:ptStart.X, Y:ptStart.Y+(ptEnd.Y-ptStart.Y)/2 };   //中心点
        }
        else
        {
            var position=this.TextPosition[1];
            var bDrawInside=false;  //在内部绘制
            if (position==0) bDrawInside=chartBorder.Right<=10;
            else if (position==1) bDrawInside=true;
            else if (position==2) bDrawInside=false;

            if (!bDrawInside)
            {
                var rtBG={ Left:xText, Top:(yText-textHeight/2-1*pixelTatio) , Width:textWidth, Height: textHeight};
                if (rtBG.Left+rtBG.Width>border.ChartWidth) rtBG.Left=border.ChartWidth-rtBG.Width-2*pixelTatio;
            }
            else    //框架内部显示
            {
                var rtBG={ Left:xText-textWidth, Top:(yText-textHeight/2-1*pixelTatio) , Width:textWidth, Height: textHeight};
            }
            
            this.Canvas.fillStyle=this.LineColor;
            this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);

            this.Canvas.fillStyle=this.TextColor;
            this.Canvas.fillText(text, rtBG.Left+offset, yText);

            if (this.Title)
            {
                var textWidth=this.Canvas.measureText(this.Title).width+2*pixelTatio;
                if (!bDrawInside)
                {
                    var rtTitle={ Left:right-textWidth-1*pixelTatio, Top:rtBG.Top, Width:textWidth, Height:textHeight };
                    if (rtBG.Left!=right) rtTitle.Left=rtBG.Left-textWidth-1*pixelTatio;
                }
                else
                {
                    var rtTitle={Left:rtBG.Left-textWidth, Top:rtBG.Top, Width:textWidth, Height:textHeight}
                }

                this.Canvas.fillStyle=this.LineColor;
                this.Canvas.fillRect(rtTitle.Left, rtTitle.Top, rtTitle.Width, rtTitle.Height);

                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(this.Title, rtTitle.Left+1*pixelTatio, yText);
            }

            centerPoint={ X:ptStart.X+(ptEnd.X-ptStart.X)/2, Y:ptStart.Y };   //中心点
        }
        
        if (centerPoint) this.DrawPoint([centerPoint]);
    }

    this.DrawPrice=function()
    {

    }
}

export
{
    IChartDrawPicture,

    ChartDrawPictureLine,
    ChartDrawPictureHaflLine,
    ChartDrawArrowLine,
    ChartDrawPictureHorizontalLine,
    ChartDrawPriceLineV2,
}