/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装滚动条控件 (H5版本)
*/


function JSScrollBarChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsscrollbar-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
    if(divElement.hasChildNodes())
    {
        JSConsole.Chart.Log("[JSScrollBarChart::JSScrollBarChart] divElement hasChildNodes", divElement.childNodes);
    }
    divElement.appendChild(this.CanvasElement);


    this.OnSize=function()
    {
        //画布大小通过div获取
        var height=this.DivElement.offsetHeight;
        var width=this.DivElement.offsetWidth;
        if (this.DivElement.style.height && this.DivElement.style.width)
        {
            if (this.DivElement.style.height.includes("px"))
                height=parseInt(this.DivElement.style.height.replace("px",""));
            if (this.DivElement.style.width.includes("px"))
                width=parseInt(this.DivElement.style.width.replace("px",""));
        }  

        this.CanvasElement.height=height;
        this.CanvasElement.width=width;
        this.CanvasElement.style.width=this.CanvasElement.width+'px';
        this.CanvasElement.style.height=this.CanvasElement.height+'px';

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.CanvasElement.height*=pixelTatio;
        this.CanvasElement.width*=pixelTatio;

        JSConsole.Chart.Log(`[JSScrollBarChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSScrollBarChartContainer(option);

        if (!chart) return false;

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        if (option.EnableResize==true) this.CreateResizeListener();

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        chart.Draw();
    }

    this.CreateJSScrollBarChartContainer=function(option)
    {
        var chart=new JSScrollBarChartContainer(this.CanvasElement);
        chart.Create(option);

        if (IFrameSplitOperator.IsNumber(option.DelayDragFrequency)) chart.DelayDragFrequency=option.DelayDragFrequency;

        this.SetChartBorder(chart, option);

        //注册事件
        if (option.EventCallback)
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        return chart;
    }

    this.SetChartBorder=function(chart, option)
    {
        if (!option.Border) return;

        var item=option.Border;
        if (IFrameSplitOperator.IsNumber(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
        if (IFrameSplitOperator.IsNumber(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
        if (IFrameSplitOperator.IsNumber(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        if (IFrameSplitOperator.IsNumber(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;

        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        chart.Frame.ChartBorder.Left*=pixelTatio;
        chart.Frame.ChartBorder.Right*=pixelTatio;
        chart.Frame.ChartBorder.Top*=pixelTatio;
        chart.Frame.ChartBorder.Bottom*=pixelTatio;

        if (IFrameSplitOperator.IsBool(item.AutoLeft)) chart.AutoMargin.Left=item.AutoLeft;
        if (IFrameSplitOperator.IsBool(item.AutoRight)) chart.AutoMargin.Right=item.AutoRight;
    }

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSScrollBarChart::OnDivResize] entries=", entries);
        this.OnSize( );
    }

    /////////////////////////////////////////////////////////////////////////////
    //对外接口
    
    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    this.ChartDestory=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestory) == 'function') 
        {
            this.JSChartContainer.ChartDestory();
        }
    }

    this.Draw=function()
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Draw)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }

    this.RecvData=function(data, option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.RecvData)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:RecvData] ');
            this.JSChartContainer.RecvData(data,option);
        }
    }

    this.UpdateSlider=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.UpdateSlider)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:UpdateSlider] ');
            this.JSChartContainer.UpdateSlider(obj);
        }
    }

    this.Reset=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Reset)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:Reset] ');
            this.JSChartContainer.Reset(option);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSScrollBarChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }
}


JSScrollBarChart.Init=function(divElement)
{
    var jsChartControl=new JSScrollBarChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSScrollBarChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (设置配必须啊在JSChart.Init()之前)
JSScrollBarChart.GetResource=function()  
{
    return g_JSChartResource;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function JSScrollBarChartContainer(uielement)
{
    this.ClassName='JSScrollBarChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法
    this.ChartSplashPaint=null;                     //等待提示
    this.LoadDataSplashTitle="无数据";           //下载数据提示信息

    this.Canvas=uielement.getContext("2d");         //画布
    this.ShowCanvas=null;

    this.XOffsetData={ Start:-1, End:-1, Count:0 };         //Count:一共的数据个数   
    this.SourceData//   new ChartData();                   //K线数据

    this.SliderChart;    //滑块
    
    this.DragMove;  //={ Click:{ 点击的点}, Move:{最后移动的点}, PreMove:{上一个点的位置} };
    this.DragSlider;
    this.DragTimer; //拖拽延迟定时器
    this.DelayDragFrequency=150;

    this.AutoMargin={ Left:false, Right:false };    //左右2边间距是否跟K线一致

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.UIElement=uielement;
    this.LastPoint=new Point();     //鼠标位置
    
    //this.XStepPixel=10*GetDevicePixelRatio();   
    this.IsDestroy=false;        //是否已经销毁了

    this.HQChart=null;

    this.ChartDestory=function()    //销毁
    {
        this.IsDestroy=true;
    }

    this.GetHQChart=function()
    {
        return this.HQChart;
    }

    //设置事件回调
    //{event:事件id, callback:回调函数}
    this.AddEventCallback=function(object)
    {
        if (!object || !object.event || !object.callback) return;

        var data={Callback:object.callback, Source:object};
        this.mapEvent.set(object.event,data);
    }

    this.RemoveEventCallback=function(eventid)
    {
        if (!this.mapEvent.has(eventid)) return;

        this.mapEvent.delete(eventid);
    }

    this.GetEventCallback=function(id)  //获取事件回调
    {
        if (!this.mapEvent.has(id)) return null;
        var item=this.mapEvent.get(id);
        return item;
    }

    //创建
    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.IsEnableSplash=true;

        //创建框架
        this.Frame=new JSScrollBarFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;

        //背景
        var chart=new ScrollBarBGChart();
        chart.ChartFrame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        this.ChartPaint.push(chart);

        //创建滑块
        var chart=new SliderChart();
        chart.ChartFrame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.OffsetData=this.XOffsetData;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        this.SliderChart=chart;
        this.ChartPaint.push(chart);

        //this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        

        //手机拖拽
        //this.UIElement.ontouchstart=(e)=> { this.OnTouchStart(e); } 
        //this.UIElement.ontouchmove=(e)=> {this.OnTouchMove(e); }
        //this.UIElement.ontouchend=(e)=> {this.OnTouchEnd(e); } 
    }

    //创建一个图形
    this.CreateChartPaint=function(name)
    {
        var chart=g_ChartPaintFactory.Create(name);
        if (!chart) return null;

        chart.ChartFrame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.Data=this.Frame.Data;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetHQChartCallback=()=>{ return this.GetHQChart(); }

        return chart;
    }

    this.GetChartPaintByClassName=function(name)
    {
        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (item.ClassName==name)
            {
                return { Chart:item, Index:i };
            }
        }

        return null;
    }

    this.Draw=function()
    {
        if (this.UIElement.width<=0 || this.UIElement.height<=0) return; 

        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.Canvas.lineWidth=pixelTatio;       //手机端需要根据分辨率比调整线段宽度

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)
        {
            this.Frame.Draw( { IsEnableSplash:this.ChartSplashPaint.IsEnableSplash} );
            this.ChartSplashPaint.Draw();
            return;
        }

        this.Frame.Draw();
        this.Frame.DrawLogo();
       
        //框架内图形
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.IsDrawFirst)
                item.Draw();
        }

        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw();
        }
    }

    
    this.OnSize=function()
    {
        if (!this.Frame) return;

        this.SetSizeChange(true);
        this.Draw();
    }

    this.SetSizeChange=function(bChanged)
    {
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var chart=this.ChartPaint[i];
            if (chart) chart.SizeChange=bChanged;
        }
    }

    this.UpdateFrameMaxMin=function()
    {
        var max=null, min=null;
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (!item.GetMaxMin) continue;

            var range=item.GetMaxMin();
            if (range==null || range.Max==null || range.Min==null) continue;

            if (max==null || max<range.Max) max=range.Max;
            if (min==null || min>range.Min) min=range.Min;
        }

        if (IFrameSplitOperator.IsNumber(max) && IFrameSplitOperator.IsNumber(min))
        {
            this.Frame.HorizontalMax=max;
            this.Frame.HorizontalMin=min;
        }
    }

    //未启动
    this.UIOnDblClick=function(e)
    {
      
    }

    this.CancelDragTimer=function()
    {
        if (this.DragTimer)
        {
            clearTimeout(this.DragTimer);
            this.DragTimer=null;
        }
    }

    this.UIOnMouseDown=function(e)
    {
        this.CancelDragTimer();
        this.DragSlider=null;
        this.DragMove={ Click:{ X:e.clientX, Y:e.clientY }, Move:{X:e.clientX, Y:e.clientY}, PreMove:{X:e.clientX, Y:e.clientY } };

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (this.SliderChart) 
        {
            var clickData=this.SliderChart.PtInChart(x,y);
            if (!clickData) 
            {
                if (!this.Frame.PtInClient(x,y)) return;

                //滚动块直接移动到鼠标点击的位置
                var index=this.Frame.GetXData(x);
                index=Math.round(index);
                var pageRange=this.GetPageRange();
                var showCount=pageRange.ShowCount;
                var start=index-parseInt(showCount/2);
                if (start<0) start=0;
                var end=start+showCount;
                if (end>=this.Frame.XPointCount) 
                {
                    end=this.Frame.XPointCount-1;
                    start=end-showCount;
                }

                var drag={ UpdateData:{  StartIndex:start, EndIndex:end, Type:3 } };
                this.DragUpdate(drag);
                return;
            }

            this.DragSlider={ Click:{ X:e.clientX, Y:e.clientY }, LastMove:{X:e.clientX, Y:e.clientY}, Data:clickData };
            this.DragSlider.DrawCount=0;    //重绘次数
        }

        document.onmousemove=(e)=>{ this.DocOnMouseMove(e); }
        document.onmouseup=(e)=> { this.DocOnMouseUp(e); }
    }


    //去掉右键菜单
    this.UIOnContextMenu=function(e)
    {
        e.preventDefault();
    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        
        if (this.DragSlider) return;

        var mouseStatus= mouseStatus={ Cursor:"default" };;   //鼠标状态
        var item=this.SliderChart.PtInChart(x,y);
        if (item)
        {
            switch(item.Data.Type)
            {
                case 0:
                    mouseStatus={ Cursor:"grab", Name:"SliderChart"};
                    break;
                case 1:
                case 2:
                    mouseStatus={ Cursor:"col-resize", Name:"SliderChart"};
                    break;
            }
        }

        if (mouseStatus)
            this.UIElement.style.cursor=mouseStatus.Cursor;
    }

    this.UIOnMounseOut=function(e)
    {
        
    }

    this.UIOnMouseleave=function(e)
    {
        
    }

    this.DocOnMouseMove=function(e)
    {
        this.DragMove.PreMove.X=this.DragMove.Move.X;
        this.DragMove.PreMove.Y=this.DragMove.Move.Y;
        this.DragMove.Move.X=e.clientX;
        this.DragMove.Move.Y=e.clientX;

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        JSConsole.Chart.Log(`[JSScrollBarChartContainer::DocOnMouseMove] x=${x}, y=${y}`);
        
        if (this.DragSlider)
        {
            var drag=this.DragSlider;
            var moveSetp=(e.clientX-drag.LastMove.X)*pixelTatio;
            if (Math.abs(moveSetp)<1) return;

            var pageRange=this.GetPageRange();
            var left=this.Frame.ChartBorder.GetLeft();
            var right=this.Frame.ChartBorder.GetRight();
            this.SliderChart.DragMode=true;
            var type=drag.Data.Data.Type;
            var xStart=this.SliderChart.XStart+moveSetp;
            var xEnd=this.SliderChart.XEnd+moveSetp;

            if (type==0) //整体移动
            {
                if (xStart<left)    //第1页
                {
                    xStart=pageRange.First.XStart;
                    xEnd=pageRange.First.XEnd;
                }
                else if (xEnd>=right)
                {
                    xStart=pageRange.Last.XStart;
                    xEnd=pageRange.Last.XEnd;
                }

                this.SliderChart.XStart=xStart;
                this.SliderChart.XEnd=xEnd;
            }
            else if (type==1)    //左移动
            {
                if (xStart<=left)
                {
                    xStart=pageRange.First.XStart;
                }
                else if (xStart>=right)
                {
                    xStart=pageRange.Last.XEnd;
                }

                this.SliderChart.XStart=xStart;
            }
            else if (type==2)
            {
                if (xEnd>=right) 
                {
                    xEnd=pageRange.Last.XEnd;
                }
                else if (xEnd<=left)
                {
                    xEnd=pageRange.First.XStart;
                }

                this.SliderChart.XEnd=xEnd;
            }

            drag.UpdateData={  XStart:xStart, XEnd:xEnd, Type:type };
            drag.LastMove.X=e.clientX;
            drag.LastMove.Y=e.clientY;

            if (drag.DrawCount==0)
            {
                this.DragUpdate(drag);
            }
            else
            {
                this.DragTimer=setTimeout(()=>
                {
                    this.DragUpdate(this.DragSlider);
                }, this.DelayDragFrequency);
            }
        }
    }

    this.DocOnMouseUp=function(e)
    {
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null;

        this.CancelDragTimer();
        var dragSlider=this.DragSlider;
        this.DragMove=null;
        this.DragSlider=null;
        this.SliderChart.DragMode=false;

        this.DragUpdate(dragSlider);
    }

    this.DragUpdate=function(dragData)
    {
        if (!dragData || !dragData.UpdateData) return;

        this.UpdateXDataOffset(dragData.UpdateData);
        this.Draw();
        ++dragData.DrawCount;
    }

    this.Reset=function(option)
    {
        this.SourceData=null;
        this.XOffsetData.Start=-1;
        this.XOffsetData.End=-1;
        this.XOffsetData.Count=0;

        this.Frame.Data=null;
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            item.Data=null;
        }

        if (this.ChartSplashPaint)
            this.ChartSplashPaint.IsEnableSplash=true;

        if (option.Draw) this.Draw();
    }

    //外部更新滑块 obj={ Start: , End: }
    this.UpdateSlider=function(obj)
    {
        if (this.SliderChart.DragMode) return;

        var bSizeChange=false;
        if ((this.AutoMargin.Left || this.AutoMargin.Right) && obj.Border)
        {
            if (this.AutoMargin.Left)
            {
                if (this.Frame.ChartBorder.Left!=obj.Border.Left) bSizeChange=true;
            }

            if (this.AutoMargin.Right)
            {
                if (this.Frame.ChartBorder.Right!=obj.Border.Right) bSizeChange=true;
            }
        }
        
        var data=obj.Data;
        if (this.XOffsetData.Start==obj.Start && this.XOffsetData.End==obj.End && this.SourceData==data && !bSizeChange) return;
            
        this.SourceData=data;
        var count=data.Data.length;
        if (IFrameSplitOperator.IsNumber(obj.RightSpaceCount)) count+=obj.RightSpaceCount;
        this.Frame.XPointCount=count;
        this.Frame.Data=data;
        this.XOffsetData.Count=count;
        this.XOffsetData.Start=obj.Start;
        this.XOffsetData.End=obj.End;

        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            item.Data=data;
        }

        if (this.AutoMargin.Left && obj.Border)
        {
            if (IFrameSplitOperator.IsNumber(obj.Border.Left)) 
                this.Frame.ChartBorder.Left=obj.Border.Left;
        }

        if (this.AutoMargin.Right && obj.Border)
        {
            if (IFrameSplitOperator.IsNumber(obj.Border.Right)) 
                this.Frame.ChartBorder.Right=obj.Border.Right;
        }

        this.UpdateFrameMaxMin();

        if (this.ChartSplashPaint)
            this.ChartSplashPaint.IsEnableSplash=false;

        if (obj.Draw) this.Draw();
    }

    //移动滑块
    this.UpdateXDataOffset=function(obj)
    {
        if (!obj) return;

        var type=obj.Type;
        if (obj.Type==0)
        {
            var start=this.Frame.GetXData(obj.XStart);
            start=parseInt(start+0.5);  //四舍五入
            var moveSetp=start-this.XOffsetData.Start;

            this.XOffsetData.Start=start;
            this.XOffsetData.End+=moveSetp;
        }
        else if (obj.Type==1)
        {
            var start=this.Frame.GetXData(obj.XStart);
            start=parseInt(start);
            this.XOffsetData.Start=start;
        }
        else if (obj.Type==2)
        {
            var end=this.Frame.GetXData(obj.XEnd);
            end=parseInt(end);
            this.XOffsetData.End=end;
        }
        else if (obj.Type==3)
        {
            this.XOffsetData.End=obj.EndIndex;
            this.XOffsetData.Start=obj.StartIndex;
            type=0;
        }

        var endItem=this.SourceData.Data[this.XOffsetData.End];
        var startItem=this.SourceData.Data[this.XOffsetData.Start];

        var sendData={ Type:type, Count:this.XOffsetData.Count };
        if (this.XOffsetData.End>this.XOffsetData.Start)
        {
            sendData.Start={ Index:this.XOffsetData.Start, Item:startItem};
            sendData.End={ Index:this.XOffsetData.End, Item:endItem};
        }
        else
        {
            sendData.Start={ Index:this.XOffsetData.End, Item:endItem };
            sendData.End={ Index:this.XOffsetData.Start, Item:startItem };
        }

        if (this.HQChart && this.HQChart.JSChartContainer)
        {
            var internalChart=this.HQChart.JSChartContainer;
            if (internalChart.ChartOperator)
            {
                var obj={ ID:JSCHART_OPERATOR_ID.OP_SCROOLBAR_SLIDER_CHANGED, Start:sendData.Start, End:sendData.End, Type:sendData.Type };
                internalChart.ChartOperator(obj);
            }
        }

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_SCROLLBAR_SLIDER_CHANGED);
        if (event)
        {
            event.Callback(event,sendData,this);
        }
    }

    
    this.ReloadResource=function(option)
    {
        this.Frame.ReloadResource(option);
        
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.ReloadResource) item.ReloadResource(option);
        }

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    this.GetPageRange=function()
    {
        var result={};
        var showCount=Math.abs(this.XOffsetData.Start-this.XOffsetData.End);
        result.ShowCount=showCount;

        //第1页
        var xStart=this.Frame.GetXFromIndex(0);
        var xEnd=this.Frame.GetXFromIndex(showCount);
        result.First={ XStart:xStart, XEnd:xEnd };

        //最后一页
        var end=this.Frame.XPointCount-1;
        var xEnd=this.Frame.GetXFromIndex(end);
        var xStart=this.Frame.GetXFromIndex(end-showCount);
        result.Last={ XStart:xStart, XEnd:xEnd };

        return result;
    }

    this.ReloadResource=function(option)
    {
        this.Frame.ReloadResource(option);
        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (item.ReloadResource) item.ReloadResource(option);
        }

        if (option.Draw==true) this.Draw(); //是否立即重绘
    }
}

/////////////////////////////////////////////////////////////////////////////////////////
//  框子
//
//
/////////////////////////////////////////////////////////////////////////////////////////

function JSScrollBarFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布
    this.BorderLine=null;                   //1=上 2=下 4=左 8=右
    this.Data;
    this.Count=0;
    this.ClassName='JSScrollBarFrame';     //类名

    this.HorizontalMax=10;                 //Y轴最大值
    this.HorizontalMin=5;                  //Y轴最小值
    this.XPointCount=0;

    this.XSplitTextFont=g_JSChartResource.ScrollBar.XSplitTextFont;
    this.XSplitTextColor=g_JSChartResource.ScrollBar.XSplitTextColor;
    this.XSplitLineColor=g_JSChartResource.ScrollBar.XSplitLineColor;

    this.BorderColor=g_JSChartResource.ScrollBar.BorderColor;    //边框线
    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.ScrollBar.BorderColor;    //边框线
        this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
        this.LogoTextFont=g_JSChartResource.FrameLogo.Font;
    }

    this.Draw=function()
    {
        this.DrawBorder();
        this.DrawLogo();
        this.DrawVertical();
    }

    this.DrawLogo=function()
    {
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'top';
       
        var x=this.ChartBorder.GetLeft()+2;
        var y=this.ChartBorder.GetTop()+2;
        this.Canvas.fillText(text,x,y); 
    }

    this.DrawBorder=function()
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;

        //JSConsole.Chart.Log(`[JSScrollBarFrame.DrawBorder] left=${left} `);
        if (!IFrameSplitOperator.IsNumber(this.BorderLine))
        {
            this.Canvas.strokeStyle=this.BorderColor;
            this.Canvas.strokeRect(left,top,width,height);
        }
        else
        {
            this.Canvas.strokeStyle=this.BorderColor;
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

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount;
        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetRight();
        }
        else
        {
            var offset=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*index/count;
            return offset;
        }
    }

    this.GetYFromData=function(value)
    {
        if(value<=this.HorizontalMin) return this.ChartBorder.GetBottomEx();
        if(value>=this.HorizontalMax) return this.ChartBorder.GetTopEx();

        var height=this.ChartBorder.GetHeightEx()*(value-this.HorizontalMin)/(this.HorizontalMax-this.HorizontalMin);
        return this.ChartBorder.GetBottomEx()-height;
    }

    //X坐标转x轴数值
    this.GetXData=function(x)
    {
        if (x<=this.ChartBorder.GetLeft()) return 0;
		if (x>=this.ChartBorder.GetRight()) return this.XPointCount;

		return (x-this.ChartBorder.GetLeft())*(this.XPointCount*1.0/this.ChartBorder.GetWidth());
    }

    this.GetPreSetpWidth=function()
    {
        return this.XPointCount*1.0/this.ChartBorder.GetWidth();
    }

    this.DrawVertical=function()
    {
        if (this.ChartBorder.Bottom<=5) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return

        var item=this.Data.Data[0];
        var preYear=parseInt(item.Date/10000);
        var preDay=item.Date%10000;

        this.Canvas.font=this.XSplitTextFont;
        this.Canvas.fillStyle=this.XSplitTextColor;
        this.Canvas.textBaseline="top";
        var yText=this.ChartBorder.GetBottom()+2;
        var top=this.ChartBorder.GetTop();
        var bottom=this.ChartBorder.GetBottom();
        var preXText=0;
        
        if (ChartData.IsMilliSecondPeriod(this.Data.Period))
        {
            var preHour=null;
            for(var i=0;i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                var day=item.Date%10000;
                var time=parseInt(item.Time/1000);
                var hour=parseInt(time/10000);
                if (i==0)
                {
                    var text=IFrameSplitOperator.FormatDateString(item.Date, "MM-DD");
                    var x=this.ChartBorder.GetLeft();
                    this.Canvas.textAlign="left";
                    this.Canvas.fillText(text,x,yText);
                    var textWidth=this.Canvas.measureText(text).width+2;
                    preXText=x+textWidth;
                    preDay=day;
                    preHour=hour;
                    continue;
                }

                if (hour!=preHour)
                {
                    var text=IFrameSplitOperator.FormatTimeString(item.Time, "HH:MM:SS.fff");
                    var x=this.GetXFromIndex(i);
                    var textWidth=this.Canvas.measureText(text).width+2;
                    if (x-textWidth/2>preXText)
                    {
                        this.Canvas.textAlign="center";
                        this.Canvas.fillText(text,x,yText);
                        preXText=x+textWidth/2;
                    }
    
                    x=ToFixedPoint(x);
                    this.Canvas.strokeStyle=this.XSplitLineColor;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(x,top);
                    this.Canvas.lineTo(x,bottom);
                    this.Canvas.stroke();
    
                    preHour=hour;
                }
            }
        }
        else if (ChartData.IsMinutePeriod(this.Data.Period,true))
        {
            for(var i=0;i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                var day=item.Date%10000;
                if (i==0)
                {
                    var text=IFrameSplitOperator.FormatDateString(item.Date, "MM-DD");
                    var x=this.ChartBorder.GetLeft();
                    this.Canvas.textAlign="left";
                    this.Canvas.fillText(text,x,yText);
                    var textWidth=this.Canvas.measureText(text).width+2;
                    preXText=x+textWidth;
                    preDay=day;
                    continue;
                }

                if (day!=preDay)
                {
                    var text=IFrameSplitOperator.FormatDateString(item.Date, "MM-DD");
                    var x=this.GetXFromIndex(i);
                    var textWidth=this.Canvas.measureText(text).width+2;
                    if (x-textWidth/2>preXText)
                    {
                        this.Canvas.textAlign="center";
                        this.Canvas.fillText(text,x,yText);
                        preXText=x+textWidth/2;
                    }
    
                    x=ToFixedPoint(x);
                    this.Canvas.strokeStyle=this.XSplitLineColor;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(x,top);
                    this.Canvas.lineTo(x,bottom);
                    this.Canvas.stroke();
    
                    preDay=day;
                }
            }
        }
        else
        {
            for(var i=0;i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                var year=parseInt(item.Date/10000);
                if (i==0)
                {
                    var text=`${year}`;
                    var x=this.ChartBorder.GetLeft();
                    var textWidth=this.Canvas.measureText(text).width+2;
                    this.Canvas.textAlign="left";
                    this.Canvas.fillText(text,x,yText);
                    preXText=x+textWidth;
                    preYear=year;
                    continue;
                }

                if (year!=preYear)
                {
                    var text=`${year}`;
                    var x=this.GetXFromIndex(i);
                    var textWidth=this.Canvas.measureText(text).width+2;
                    if (x-textWidth/2>preXText)
                    {
                        this.Canvas.textAlign="center";
                        this.Canvas.fillText(text,x,yText);
                        preXText=x+textWidth/2;
                    }
    
                    x=ToFixedPoint(x);
                    this.Canvas.strokeStyle=this.XSplitLineColor;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(x,top);
                    this.Canvas.lineTo(x,bottom);
                    this.Canvas.stroke();
    
                    preYear=year;
                }
            }
        }
    }

    this.PtInClient=function(x,y)
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());

        if (x>=left && x<=right && y>=top && y<=bottom) return true;

        return false;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////
// 滑块
//
/////////////////////////////////////////////////////////////////////////////////////////////////
function SliderChart()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='SliderChart';       //类名
    this.OffsetData;
    this.Color=g_JSChartResource.ScrollBar.Slider.BarAreaColor;

    this.BarColor=g_JSChartResource.ScrollBar.Slider.BarColor;
    this.BarWidth=g_JSChartResource.ScrollBar.Slider.BarWidth;
    this.BarPadding=g_JSChartResource.ScrollBar.Slider.BarPadding;  //上下留白
    this.MinCenterWidth=g_JSChartResource.ScrollBar.Slider.MinCenterWidth;

    this.DateFont=g_JSChartResource.ScrollBar.Slider.DateFont;
    this.DateColor=g_JSChartResource.ScrollBar.Slider.DateColor;

    this.AryRect=[];    //[{ Rect:{Left, Top, Right:, Bottom:, Width, Height:}, Type:0中间 1=左 2=右 }]
    this.XStart;
    this.XEnd;

    this.SizeChange=true;
    this.DragMode=false;

    this.ReloadResource=function(resource)
    {
        this.Color=g_JSChartResource.ScrollBar.Slider.BarAreaColor;
        this.BarColor=g_JSChartResource.ScrollBar.Slider.BarColor;

        this.DateFont=g_JSChartResource.ScrollBar.Slider.DateFont;
        this.DateColor=g_JSChartResource.ScrollBar.Slider.DateColor;
    }

    this.Draw=function()
    {
        this.AryRect=[];

        if (!this.OffsetData || !IFrameSplitOperator.IsPlusNumber(this.OffsetData.Count)) return;
        if (!IFrameSplitOperator.IsNumber(this.OffsetData.Start) || !IFrameSplitOperator.IsNumber(this.OffsetData.End)) return;

        var top=this.ChartBorder.GetTop();
        var bottom=this.ChartBorder.GetBottom();
        var startData, endData;
        if (this.DragMode)
        {
            var xStart=this.XStart;
            var xEnd=this.XEnd;

            var startIndex=this.ChartFrame.GetXData(xStart);
            var endIndx=this.ChartFrame.GetXData(xEnd);

            startIndex=parseInt(startIndex);
            endIndx=parseInt(endIndx);

            startData={ Data:this.Data.Data[this.OffsetData.Start], X:xStart, Type:startIndex<endIndx?0:1 };
            endData={Data:this.Data.Data[this.OffsetData.End], X:xEnd, Type:endIndx>startIndex?1:0 };
        }
        else
        {
            var start=this.OffsetData.Start, end=this.OffsetData.End;
            var xStart=this.ChartFrame.GetXFromIndex(start);
            var xEnd=this.ChartFrame.GetXFromIndex(end);
            this.XStart=xStart;
            this.XEnd=xEnd;
            startData={ Data:this.Data.Data[this.OffsetData.Start], X:xStart, Type:xStart<xEnd?0:1 };
            endData={Data:this.Data.Data[this.OffsetData.End], X:xEnd, Type:xEnd>xStart?1:0 };
        }
        
        this.Canvas.fillStyle=this.Color;
        var rtBar={ Left:Math.min(xStart,xEnd), Top:top, Width:Math.abs(xEnd-xStart), Height: bottom-top};
        rtBar.Right=rtBar.Left+rtBar.Width;
        rtBar.Bottom=rtBar.Top+rtBar.Height;
        if (rtBar.Width<this.MinCenterWidth)
        {
            rtBar.Left-=(this.MinCenterWidth-rtBar.Width)/2;
            rtBar.Width=this.MinCenterWidth;
            rtBar.Right=rtBar.Left+rtBar.Width;
        }
        this.Canvas.fillRect(rtBar.Left, rtBar.Top, rtBar.Width, rtBar.Height);
        this.AryRect.push({ Rect:rtBar, Type:0});


        //左右拖拽块
        var pixelRatio=GetDevicePixelRatio();
        var barWidth=this.BarWidth*pixelRatio;
        var barHeight=bottom-top-(this.BarPadding*2)*pixelRatio;
        var xBar=xStart-this.BarWidth/2;
        var yBar=top+this.BarPadding*pixelRatio;
        
        this.Canvas.fillStyle=this.BarColor;
        var rtBar={Left:xBar, Top:yBar, Width:barWidth, Height:barHeight};
        rtBar.Right=rtBar.Left+rtBar.Width;
        rtBar.Bottom=rtBar.Top+rtBar.Height;
        this.Canvas.fillRect(rtBar.Left, rtBar.Top, rtBar.Width, rtBar.Height);
        this.AryRect.push({ Rect:rtBar, Type:1});

        var xBar=xEnd-this.BarWidth/2;
        var rtBar={Left:xBar, Top:yBar, Width:barWidth, Height:barHeight};
        rtBar.Right=rtBar.Left+rtBar.Width;
        rtBar.Bottom=rtBar.Top+rtBar.Height;
        this.Canvas.fillRect(rtBar.Left, rtBar.Top, rtBar.Width, rtBar.Height);
        this.AryRect.push({ Rect:rtBar, Type:2});

        //最右边可能是空白区 要处理下
        if (endData.Type==1)
        {
            var dataIndex=this.OffsetData.End;
            if (dataIndex>=this.Data.Data.length) endData.Data=this.Data.Data[this.Data.Data.length-1];
        }

        this.DrawDateTime(startData);
        this.DrawDateTime(endData);
    }

    this.DrawDateTime=function(data)
    {
        if (!data || !data.Data) return;
        var text=IFrameSplitOperator.FormatDateString(data.Data.Date);
        var top=this.ChartBorder.GetTop();
        var bottom=this.ChartBorder.GetBottom();
        var timeText=null;

        if (ChartData.IsMilliSecondPeriod(this.Data.Period))
        {
            var time=parseInt(data.Data.Time/1000);
            text=IFrameSplitOperator.FormatTimeString(time,"HH:MM:SS");
        }
        else if (ChartData.IsMinutePeriod(this.Data.Period, true)) 
        {
            timeText=IFrameSplitOperator.FormatTimeString(data.Data.Time,"HH:MM");
        }

        if (data.Type==0) 
        {
            this.Canvas.textAlign="right";
            var x=data.X-this.BarWidth/2;
        }
        else if (data.Type==1) 
        {
            this.Canvas.textAlign="left";
            var x=data.X+this.BarWidth/2;
        }

        this.Canvas.font=this.DateFont;
        var fontHeight=this.Canvas.measureText("擎").width;
        this.Canvas.textBaseline="middle";
        this.Canvas.fillStyle=this.DateColor;

        var yText=top+(bottom-top)/2;
        this.Canvas.fillText(text,x,yText);

        if (timeText)
        {
            yText+=fontHeight;
            this.Canvas.fillText(timeText,x,yText);
        }
    }

    this.PtInChart=function(x,y)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryRect)) return null;

        for(var i=this.AryRect.length-1; i>=0; --i)
        {
            var item=this.AryRect[i];
            var rt=item.Rect;
            if (x>=rt.Left && x<=rt.Right && y>=rt.Top && y<=rt.Bottom)
            {
                return { Data:item };
            }
        }

        return null;
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////
// 滚动条K线背景色
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////
function ScrollBarBGChart()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ScrollBarBGChart';  //类名

    this.SizeChange=true;
    this.Data;

    this.Color=g_JSChartResource.ScrollBar.BGChart.Color;                       //线段颜色
    this.LineWidth=g_JSChartResource.ScrollBar.BGChart.LineWidth;                 //线段宽度
    this.AreaColor=g_JSChartResource.ScrollBar.BGChart.AreaColor;              //面积图颜色

    this.ReloadResource=function(resource)
    {
        this.Color=g_JSChartResource.ScrollBar.BGChart.Color;                       //线段颜色
        this.LineWidth=g_JSChartResource.ScrollBar.BGChart.LineWidth;                 //线段宽度
        this.AreaColor=g_JSChartResource.ScrollBar.BGChart.AreaColor;              //面积图颜色
    }

    this.Draw=function()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth * GetDevicePixelRatio();

        var bottom=this.ChartBorder.GetBottom();
        this.Canvas.strokeStyle=this.Color;
        var bFirstPoint=true;
        var drawCount=0,x,y;
        var firstPoint={ };
        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            var value=item.Close;
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            x=this.ChartFrame.GetXFromIndex(i);
            y=this.ChartFrame.GetYFromData(value);

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(x,y);
                bFirstPoint=false;
                firstPoint={ X:x, Y:y };
            }
            else
            {
                this.Canvas.lineTo(x,y);
            }

            ++drawCount;
        }

        if (drawCount>0) 
        {
            this.Canvas.stroke();

            
            this.Canvas.lineTo(x,bottom);
            this.Canvas.lineTo(firstPoint.X,bottom);
            this.Canvas.closePath();

            this.Canvas.fillStyle=this.AreaColor;
            this.Canvas.fill();
            
        }


        this.Canvas.restore();
    }

    this.GetMaxMin=function()
    {
        var range={ Max:null, Min:null };
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return range;
        
        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            var value=item.Close;

            if (!IFrameSplitOperator.IsNumber(value)) continue;

            if (range.Max==null || range.Max<value) range.Max=value;
            if (range.Min==null || range.Min>value) range.Min=value;
        }

        return range;
    }
}


