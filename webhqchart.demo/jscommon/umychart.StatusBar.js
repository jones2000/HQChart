/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   底部状态栏 (H5版本)
   不提供内置测试数据
*/

function JSStatusBarChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsstatusbar-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
    if(divElement.hasChildNodes())
    {
        JSConsole.Chart.Log("[JSStatusBarChart::JSStatusBarChart] divElement hasChildNodes", divElement.childNodes);
    }
    divElement.appendChild(this.CanvasElement);


    this.OnSize=function()
    {
        //画布大小通过div获取 如果有style里的大小 使用style里的
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

        JSConsole.Chart.Log(`[JSStatusBarChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSStatusBarChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        if (option.EnableResize==true) this.CreateResizeListener();

        if (option.MinuteChartTooltip && option.MinuteChartTooltip.Enable) chart.InitalMinuteChartTooltip(option.MinuteChartTooltip);

        chart.Draw();
        chart.RequestData();
    }

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSStatusBarChart::OnDivResize] entries=", entries);

        this.OnSize();
    }

    this.CreateJSStatusBarChartContainer=function(option)
    {
        var chart=new JSStatusBarChartContainer(this.CanvasElement);
        chart.Create(option);

        this.SetChartBorder(chart, option);

        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (option.RightToolbar) chart.SetRightToolbar(option.RightToolbar);

        //是否自动更新
        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;

        if (option.IsAutoUpdate!=null) chart.IsAutoUpdate=option.IsAutoUpdate;
        if (option.AutoUpdateFrequency>0) chart.AutoUpdateFrequency=option.AutoUpdateFrequency;

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
    }

    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSStatusBarChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSStatusBarChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    this.ChartDestroy=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestroy) == 'function') 
        {
            this.JSChartContainer.ChartDestroy();
        }
    }

    this.Draw=function()
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.Draw)=='function')
        {
            JSConsole.Chart.Log('[JSStatusBarChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }
}

JSStatusBarChart.Init=function(divElement)
{
    var jsChartControl=new JSStatusBarChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSStatusBarChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (JSStatusBarChart.Init()之前)
JSStatusBarChart.GetResource=function()  
{
    return g_JSChartResource;
}

JSStatusBarChart.GetfloatPrecision=function(symbol)
{
    return GetfloatPrecision(symbol);
}


function JSStatusBarChartContainer(uielement)
{
    this.ClassName='JSStatusBarChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法

    this.Canvas=uielement.getContext("2d");         //画布

    this.NetworkFilter;                                 //数据回调接口
    this.Data=
    { 
        MapSymbol:new Map(),  //key=symbol, { Value:, Text:, }    股票数据
    }; 
           
    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{ Callback:回调,}

    this.AutoUpdateTimer=null;
    this.AutoUpdateFrequency=15000;             //15秒更新一次数据

    this.ToolbarTimer=null;

    this.TooltipMinuteChart;                    //分时图

    this.UIElement=uielement;
   
    this.IsDestroy=false;        //是否已经销毁了

    this.ChartDestroy=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();

        if (this.ToolbarTimer) 
        {
            clearInterval(this.ToolbarTimer);
            this.ToolbarTimer=null;
        }

        this.DestroyMinuteChartTooltip();
    }

    this.InitalMinuteChartTooltip=function(option)
    {
        if (this.TooltipMinuteChart) return;

        this.TooltipMinuteChart=new JSTooltipMinuteChart();
        this.TooltipMinuteChart.Inital(this, option);
        this.TooltipMinuteChart.Create();
    }

    this.DestroyMinuteChartTooltip=function()
    {
        if (!this.TooltipMinuteChart) return;

        this.TooltipMinuteChart.Destroy();
        this.TooltipMinuteChart=null;
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

    this.ClearData=function()
    {
        this.Data.MapSymbol=new Map();
    }

    this.RequestData=function(option)
    {
        this.CancelAutoUpdate();
        this.ClearData();

        if (option)
        {
            if (IFrameSplitOperator.IsNonEmptyArray(option.Column)) this.SetColumn(option.Column);
        }

        this.Draw();
        this.RequestStockData();

        if (this.IsAutoUpdate)
        {
            var frequency=this.AutoUpdateFrequency;
            setInterval(()=>
            { 
                var marketStatus=MARKET_SUFFIX_NAME.GetMarketStatus(this.Symbol);
                if (marketStatus==0 || marketStatus==3)  //闭市,盘后
                    return;

                this.RequestStockData();
            }, frequency)
        }
    }

    this.CancelAutoUpdate=function()    //关闭停止更新
    {
        if (this.AutoUpdateTimer) 
        {
            clearInterval(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    this.StopAutoUpdate=function()
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        this.IsAutoUpdate=false;
    }

    this.RequestStockData=function()
    {
        if (!this.NetworkFilter) return;
        
        var chart=this.ChartPaint[0];
        if (!chart)  return;
        if (!IFrameSplitOperator.IsNonEmptyArray(chart.Column)) return;

        var arySymbol=[];
        for(var i=0;i<chart.Column.length;++i)
        {
            var item=chart.Column[i];
            var newItem={ Symbol:item.Symbol, Fields:[] };
            arySymbol.push(newItem);
        }

        var obj=
        {
            Name:'JSStatusBarChartContainer::RequestStockData', //类名::函数名
            Explain:'工具栏股票数据',
            Request: { Data:{ stocks:arySymbol } },
            Self:this,
            PreventDefault:false
        };

        this.NetworkFilter(obj, (data)=>
        { 
            this.RecvStockData(data);
        });

        if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        
    }

    this.RecvStockData=function(recv)
    {
        if (!recv) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(recv.data)) return;

        for(var i=0;i<recv.data.length;++i)
        {
            var item=recv.data[i];
            if (!item.Symbol) continue;

            var stockItem=null;
            if (this.Data.MapSymbol.has(item.Symbol))
            {
                stockItem=this.Data.MapSymbol.get(item.Symbol);
            }
            else
            {
                stockItem={ Symbol:item.Symbol, MapData:new Map() };
                stockItem.YClose=item.YClose;
                if (IFrameSplitOperator.IsNumber(item.FYClose)) stockItem.YClose=item.FYClose;
                this.Data.MapSymbol.set(item.Symbol,stockItem);
            }

            for(var j=0;j<item.Data.length;++j)
            {
                var itemData=item.Data[j];
                stockItem.MapData.set(itemData.Key,itemData.Value);
            }
        }

        if (!this.ToolbarTimer) this.Draw();
    }

    //创建
    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建框架
        this.Frame=new JSStatusBarFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        //创建表格
        var chart=new ChartStatusBarStockData();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.Data=this.Data;
        chart.BorderData=this.BorderData;
        chart.GlobalOption=this.GlobalOption;
        chart.FixedRowData=this.FixedRowData;
        chart.SortInfo=this.SortInfo;
        this.ChartPaint[0]=chart;

        
        if (option)
        {
           
        }

        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e); }
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }

        /*
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        
       
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        
        */

        var frequency=500;
        this.ToolbarTimer=setInterval(()=>
        { 
            this.Draw();
        }, frequency)
    }

    this.UIOnMouseDown=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        this.ClickDownPoint={ X:e.clientX, Y:e.clientY };
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (e)   
        {
            if (e.button==0)        //左键点击
            {
                var ptClick={ X:this.ClickDownPoint.X, Y:this.ClickDownPoint.Y };
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_CLICK_STATUSBAR_ITEM, ptClick, e);
            }
            else if (e.button==2)   //右键点击
            {
                this.HideAllTooltip();
                var ptClick={ X:this.ClickDownPoint.X, Y:this.ClickDownPoint.Y };
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_RCLICK_STATUSBAR_ITEM, ptClick, e);
            }
        }
    }

    this.UIOnContextMenu=function(e)
    {
        if (e)  //去掉系统右键菜单
        {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.returnValue=false;
        } 
    }

    this.GetChartTooltipData=function(x,y,option)
    {
        var toolTip=new TooltipData();
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.GetTooltipData(x,y,toolTip))
            {
               return toolTip;
            }
        }

        return null;
    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        //var bShowKLineTooltip=false;
        var bShowMinuteTooltip=false;
        var chartTooltipData=null;
        var tooltipData=this.GetChartTooltipData(x,y);

        if (tooltipData)
        {
            if (tooltipData.Type==121)
            {
                var item=tooltipData.Data;
                if (item && item.Data && item.Data.Symbol)
                {
                    bShowMinuteTooltip=true;
                    chartTooltipData={ Symbol:item.Data.Symbol, Rect:item.Rect, Position:1 };
                }
            }
        }

        //if (!bShowKLineTooltip) this.HideKLineChartTooltip();
        if (!bShowMinuteTooltip) this.HideMinuteChartTooltip();

        if (bShowMinuteTooltip) this.ShowMinuteChartTooltip(null, null, chartTooltipData);
        //if (bShowKLineTooltip) this.ShowKLineChartTooltip(null, null, chartTooltipData);
    }

    this.UIOnMounseOut=function(e)
    {
        this.HideAllTooltip();
    }



    this.TryClickPaintEvent=function(eventID, ptClick, e)
    {
        var event=this.GetEventCallback(eventID);
        if (!event) return false;

        if (ptClick.X==e.clientX && ptClick.Y==e.clientY)
        {
            var pixelTatio = GetDevicePixelRatio();
            var x = (e.clientX-uielement.getBoundingClientRect().left)*pixelTatio;
            var y = (e.clientY-uielement.getBoundingClientRect().top)*pixelTatio;

            var toolTip=new TooltipData();
            for(var i=0;i<this.ChartPaint.length;++i)
            {
                var item=this.ChartPaint[i];
                if (item.GetTooltipData(x,y,toolTip))
                {
                    if (toolTip.Data)
                    {
                        var data= { X:e.clientX, Y:e.clientY, Tooltip:toolTip, e:e };
                        event.Callback(event, data, this);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    this.Draw=function()
    {
        if (this.UIElement.width<=0 || this.UIElement.height<=0) return; 

        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.Canvas.lineWidth=pixelTatio;       //手机端需要根据分辨率比调整线段宽度

        this.Frame.Draw();
        this.Frame.DrawLogo();
       
        //框架内图形
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
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

    this.ReloadResource=function(option)
    {
        this.Frame.ReloadResource(option);
        
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.ReloadResource) item.ReloadResource(option);
        }

        if (option && (option.Redraw || option.Draw))
        {
            this.SetSizeChange(true);
            this.Draw();
        }

        if (this.TooltipMinuteChart) this.TooltipMinuteChart.ReloadResource(option);    //分时图
    }

    this.SetColumn=function(aryColunm, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetColumn(aryColunm);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.SetRightToolbar=function(toolbar, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetRightToolbar(toolbar);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.GetStatusBarChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return null;

        return chart;
    }

    //data={ Symbol }
    this.ShowMinuteChartTooltip=function(x,y, data)
    {
        if (!this.TooltipMinuteChart) return;

        var rtClient=this.UIElement.getBoundingClientRect();
        var rtScroll=GetScrollPosition();

        var offsetLeft=rtClient.left+rtScroll.Left;
        var offsetTop=rtClient.top+rtScroll.Top;

        data.Offset={ Left:offsetLeft, Top:offsetTop };

        this.TooltipMinuteChart.Show(data, x,y);
    }

    this.HideMinuteChartTooltip=function()
    {
        if (!this.TooltipMinuteChart) return;

        this.TooltipMinuteChart.Hide();
    }

    this.HideAllTooltip=function()
    {
        //this.HideKLineChartTooltip();
        this.HideMinuteChartTooltip();
    }

}

function JSStatusBarFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右
    this.ClassName="JSStatusBarFrame";

    this.BorderColor=g_JSChartResource.StatusBar.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.StatusBar.BorderColor;    //边框线
        this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
        this.LogoTextFont=g_JSChartResource.FrameLogo.Font;
    }

    this.Draw=function()
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;

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

    this.DrawLogo=function()
    {
        /*
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'right';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetRight()-30;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
        */
    }
}


function ChartStatusBarStockData()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartStatusBarStockData';       //类名
    this.UIElement;
    this.GetEventCallback;              //获取事件
    this.Data;                          //数据
    this.SizeChange=true;

    this.UpColor=g_JSChartResource.StatusBar.UpTextColor;
    this.DownColor=g_JSChartResource.StatusBar.DownTextColor;
    this.UnchangeColor=g_JSChartResource.StatusBar.UnchangeTextColor; 
 
    this.TableConfig=CloneData(g_JSChartResource.StatusBar.Table);
    this.DateTimeConfig=CloneData(g_JSChartResource.StatusBar.DateTime);

    //显示的字段
    this.Column=
    [
        { 
            Symbol:"000001.sh",
            Column:
            [
                { Name:"名称", Key:"Name", Text:"000001", },
                { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1, MaxText:"88888.88" }, 
                { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%", MaxText:"888.88%"  }, 
                { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ColorID:1 }
            ]
        },

        { 
            Symbol:"600000.sh", 
            Column:
            [
                { Name:"名称", Key:"Name", Text:"600000", },
                { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, 
                { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, 
                { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 },
                { Name:"总额", Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }
            ]
        }
    ]

    this.RightToolbarConfig=CloneData(g_JSChartResource.StatusBar.RightToolbar);
    this.MapToolbarFlash=new Map(); //key=id, Value:{ Counter:, Enable: }
    

    //右侧工具栏
    this.RightToolbar=
    {
        /*
        AryButton:
        [
            { ID:2, Type:1, Icon:[{ Symbol:"\ue609", Color:"rgb(180,180,180)"} ] },

            { 
                ID:1, Type:2, Icon:[{ Symbol:"\ue6d0", Color:"rgb(180,180,180)"} ], 
                Flash:
                {
                    AryIcon:
                    [
                        [{ Symbol:"\ue6cb", Color:"rgb(0,191,255)"}],
                        [{ Symbol:"\ue6cb", Color:"rgb(255,165,0)"}],
                        [{ Symbol:"\ue6cb", Color:"rgb(255,215,0)"}],
                    ]
                }
            },
        ]
        */
    }

    this.AryRectCell=[];
    this.AryRectButton=[];

    this.ReloadResource=function(resource)
    {
        this.UpColor=g_JSChartResource.StatusBar.UpTextColor;
        this.DownColor=g_JSChartResource.StatusBar.DownTextColor;
        this.UnchangeColor=g_JSChartResource.StatusBar.UnchangeTextColor; 
 
        this.TableConfig=CloneData(g_JSChartResource.StatusBar.Table);
        this.DateTimeConfig=CloneData(g_JSChartResource.StatusBar.DateTime);
    }

    this.SetColumn=function(aryColumn)
    {
        this.Column=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;

        for(var i=0;i<aryColumn.length;++i)
        {
            var item=aryColumn[i];
            if (!item) continue;
            this.Column.push(CloneData(item));
        }
    }

    this.SetRightToolbar=function(toolbar, option)
    {
        if (IFrameSplitOperator.IsNonEmptyArray(toolbar.AryButton))
        {
            this.RightToolbar.AryButton=toolbar.AryButton.slice();
            for(var i=0;i<this.RightToolbar.AryButton.length;++i)
            {
                var item=this.RightToolbar.AryButton[i];
                if (item.Type===2)
                {
                    var value={ Counter:1, Enable:true };
                    if (IFrameSplitOperator.IsBool(item.Enable)) value.Enable=item.Enable;
                    this.MapToolbarFlash.set(item.ID, value)
                }
            }

        }

       
    }

    this.Draw=function()
    {
        this.AryRectCell=[];
        this.AryRectButton=[];

        var border=this.ChartBorder.GetBorder();
        var position = { Left:border.Left, Right:border.Right, Top:border.Top, Bottom:border.Bottom, Width:border.Right-border.Left, Border:border };
        this.DrawRightToolbar(position);
        this.DrawTable(position);
    }

    this.DrawTable=function(position)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Column)) return;

        var config=this.TableConfig;
        var top=position.Top;
        var left=position.Left+config.Margin.Left;

        var yText=top+config.Margin.Top;
        var xText=left;
        
        this.Canvas.font=config.Font;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        var cellHeight=this.Canvas.measureText("擎").width+config.CellMargin.Top+config.CellMargin.Bottom;
        var itemPos={ Left:xText, Right:position.Right, Top:yText, Height:cellHeight, Bottom:yText+cellHeight, IsBreak:false, CellCount:0 };

        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (!item || !item.Symbol) continue;
            
            var rtCell={ Left:itemPos.Left, Top:itemPos.Top, Bottom:itemPos.Bottom, Right:itemPos.Left };
            if (i>0) rtCell.Left-=config.Separator.Right;
            this.DrawCellItem(item, itemPos );
            if (itemPos.CellCount>0)
            {
                rtCell.Right=itemPos.Left;
                rtCell.Width=rtCell.Right-itemPos.Left;
                rtCell.Height=rtCell.Bottom-rtCell.Top;

                this.AryRectCell.push({ Rect:rtCell, Data:item, Type:1 });
            }
            
            if (itemPos.IsBreak)
            {
                break;
            }

            itemPos.Left+=config.Separator.Left;
            if (config.Separator.Line && config.Separator.Line.Color)  //分割线
            {
                if (itemPos.Left>=itemPos.Right) break;

                var subConfig=config.Separator.Line;
                var lineWidth=1*GetDevicePixelRatio();
                if (IFrameSplitOperator.IsNumber(subConfig.Width)) lineWidth=subConfig.Width;

                this.Canvas.strokeStyle=subConfig.Color;
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(itemPos.Left),itemPos.Top+subConfig.Top);
                this.Canvas.lineTo(ToFixedPoint(itemPos.Left),itemPos.Bottom-subConfig.Bottom);
                this.Canvas.stroke();
            }

            itemPos.Left+=config.Separator.Right;
        }
    }

    this.DrawCellItem=function(cellItem, itemPos)
    {
        var config=this.TableConfig;
        var xText=itemPos.Left;
        var yBottom=itemPos.Top+itemPos.Height-config.CellMargin.Bottom+config.CellMargin.YOffset;
        var text=null;
        
        var stockItem=null;
        if (this.Data.MapSymbol.has(cellItem.Symbol)) stockItem=this.Data.MapSymbol.get(cellItem.Symbol);

        for(var i=0;i<cellItem.Column.length ;++i)
        {
            var item=cellItem.Column[i];
            if (!item) continue;

            var color=config.AryTextColor[0];
            var text=null;
            if (stockItem && stockItem.MapData.has(item.Key))
            {
                var dataItem=stockItem.MapData.get(item.Key);
                text=this.FormatValue(item, dataItem, stockItem);

                if (IFrameSplitOperator.IsNumber(item.ColorID) && item.ColorID>=0 && item.ColorID<config.AryTextColor.length)
                    color=config.AryTextColor[item.ColorID];
                
                if (item.ColorType===3 && IFrameSplitOperator.IsNumber(dataItem.Value))
                    color=this.GetPriceColor(dataItem.Value, stockItem);
                else if (item.ColorType==1 && IFrameSplitOperator.IsNumber(dataItem.Value))
                    color=this.GetUpDownColor(dataItem.Value,0);
                else if (item.ColorType==4) 
                    color=this.UpColor;
                else if (item.ColorType==5)
                    color=this.DownColor;

                if (item.TextColor) color=item.TextColor;
            }
            
            if (!text && item.Text) text=item.Text;

            if (text)
            {
                var textWidth=this.Canvas.measureText(text).width;
                if (xText+textWidth+config.CellMargin.Left+config.CellMargin.Right>itemPos.Right)
                {
                    itemPos.IsBreak=true;
                    break;
                }
                this.Canvas.fillStyle=color;
                this.Canvas.fillText(text,xText+config.CellMargin.Left,yBottom);
                xText+=(textWidth+config.CellMargin.Left+config.CellMargin.Right);
            }
            else if (item.MaxText)
            {
                text=item.MaxText;
                var textWidth=this.Canvas.measureText(text).width;
                xText+=(textWidth+config.CellMargin.Left+config.CellMargin.Right);
                if (xText>itemPos.Right)
                {
                    itemPos.IsBreak=true;
                    break;
                }
            }

            ++itemPos.CellCount;
        }
            
        itemPos.Left=xText;
        
    }


    this.FormatValue=function(column, data, stockItem)
    {
        var dec=0;  //小数位数
        if (IFrameSplitOperator.IsNumber(column.FloatPrecision))
        {
            if (column.FloatPrecision===-1) dec=GetfloatPrecision(stockItem.Symbol);
            else dec=column.FloatPrecision;
        }
                    
        var text=null;
        if (!data) return text;

        if (data.Text)
        {
            text=data.Text;
        }
        else if (IFrameSplitOperator.IsNumber(data.Value)) 
        {
            var value=data.Value;
            text=value.toFixed(dec);

            //格式化
            if (column.Format && IFrameSplitOperator.IsNumber(column.Format.Type))
            {
                var format=column.Format;
                switch(format.Type)
                {
                    case 1: //原始数据
                        text=value.toFixed(dec);
                        break;
                    case 2: //千分位分割
                        text=IFrameSplitOperator.FormatValueThousandsString(value, dec);
                        break;
                    case 3:
                        var exfloatPrecision=1;
                        if (IFrameSplitOperator.IsNumber(format.ExFloatPrecision)) exfloatPrecision=format.ExFloatPrecision;
                        text=IFrameSplitOperator.FormatValueStringV2(value, dec,exfloatPrecision);
                        break;
                }
            }
        }

        if (column.StringFormat && text) text=column.StringFormat.replace('{Value}',text);

        return text;
    }

    this.GetPriceColor=function(price, stockItem)
    {
        var upperSymbol=null;
        if (stockItem.Symbol) upperSymbol=stockItem.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol))
        {
            if (!IFrameSplitOperator.IsNumber(stockItem.YFClose)) return  this.UnchangeColor;
            return this.GetUpDownColor(price, stockItem.YFClose);
        }
        else
        {
            if (!IFrameSplitOperator.IsNumber(stockItem.YClose)) return this.UnchangeColor;
            return this.GetUpDownColor(price, stockItem.YClose);
        }
    }

    this.GetUpDownColor=function(price, price2)
    {
        if (price>price2) return this.UpColor;
        else if (price<price2) return this.DownColor;
        else return this.UnchangeColor;
    }

    this.DrawRightToolbar=function(position)
    {
        var config=this.DateTimeConfig;
        var top=position.Top;
        var right=position.Right;

        this.Canvas.font=config.Font;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        var cellHeight=this.Canvas.measureText("擎").width+config.Margin.Top+config.Margin.Bottom;

        var yBottom=top+cellHeight-config.Margin.Bottom+config.Margin.YOffset;
        var xText=right;

        //时间
        var datetime=new Date();
        var text=IFrameSplitOperator.FormatDateTimeStringV2(datetime, config.Format);
        var textWidth=this.Canvas.measureText(config.MaxText).width+config.Margin.Left+config.Margin.Right;
        xText-=textWidth;
        this.Canvas.fillStyle=config.TitleColor;
        this.Canvas.fillText(text,xText+config.Margin.Left,yBottom);

        position.Right=xText;

        if (this.RightToolbar && IFrameSplitOperator.IsNonEmptyArray(this.RightToolbar.AryButton))
        {
            var config=this.RightToolbarConfig;
            
            xText-=config.Margin.Right;
            for(var i=this.RightToolbar.AryButton.length-1;i>=0;--i)
            {
                var item=this.RightToolbar.AryButton[i];
                var aryItem=null;
                if (item.Type==2) aryItem=this.GetFlashToolbarItem(item);
                else aryItem=item.Icon;
                if (!IFrameSplitOperator.IsNonEmptyArray(aryItem)) continue;
                var iconFont=`${config.Icon.Size}px ${config.Icon.Family}`;
                this.Canvas.font=iconFont;
                var textWidth=config.Icon.Size+config.CellMargin.Left+config.CellMargin.Right;
                xText-=textWidth;
                yBottom=top+config.Margin.Top+(config.Icon.Size+config.CellMargin.Top+config.CellMargin.Bottom)-config.CellMargin.Bottom+config.CellMargin.YOffset;
                for(var j=0;j<aryItem.length;++j)
                {
                    var iconItem=aryItem[j];
                    var text=iconItem.Symbol;
                    this.Canvas.fillStyle=iconItem.Color;
                    this.Canvas.fillText(text,xText+config.CellMargin.Left,yBottom);
                }

                var rtButton={ Left:xText, Bottom:yBottom, Height:config.Icon.Size, Width:config.Icon.Size };
                rtButton.Right=rtButton.Left+rtButton.Width;
                rtButton.Top=rtButton.Bottom-rtButton.Height;
                this.AryRectButton.push({ Rect:rtButton, Data:item, Type:2 });
            }
        }

        position.Right=xText;
    }

    this.GetFlashToolbarItem=function(btnItem)
    {
        if (!btnItem.Flash || !IFrameSplitOperator.IsNonEmptyArray(btnItem.Flash.AryIcon)) return btnItem.Icon;
        if (!this.MapToolbarFlash.has(btnItem.ID))  return btnItem.Icon;

        var item=this.MapToolbarFlash.get(btnItem.ID);
        if (!item.Enable) return btnItem.Icon;

        item.Counter++;

        var index=item.Counter%btnItem.Flash.AryIcon.length;

        return btnItem.Flash.AryIcon[index];
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i=0;i<this.AryRectCell.length;++i)
        {
            var item=this.AryRectCell[i];
            if (Path2DHelper.PtInRect(x,y, item.Rect))
            {
                tooltip.Data=item;
                tooltip.ChartPaint=this;
                tooltip.Type=121;
                return true;
            }
        }

        for(var i=0;i<this.AryRectButton.length;++i)
        {
            var item=this.AryRectButton[i];
            if (Path2DHelper.PtInRect(x,y, item.Rect))
            {
                tooltip.Data=item;
                tooltip.ChartPaint=this;
                tooltip.Type=122;
                return true;
            }
        }

        return false;
    }
}






