/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   股票买卖5档 (H5版本)
   不提供内置测试数据
*/

function JSStockInfoChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsstockinfo-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
    if(divElement.hasChildNodes())
    {
        JSConsole.Chart.Log("[JSStockInfoChart::JSStockInfoChart] divElement hasChildNodes", divElement.childNodes);
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

        JSConsole.Chart.Log(`[JSStockInfoChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSStockInfoChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        if (option.EnableResize==true) this.CreateResizeListener();
        if (option.EnablePopMenuV2===true) chart.InitalPopMenu();

        if (option.Symbol)
        {
            chart.ChangeSymbol(option.Symbol);   //下载列表码表
        }
        else
        {
            chart.Draw();
        }
    }

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSStockInfoChart::OnDivResize] entries=", entries);

        this.OnSize();
    }

    //切换股票代码接口
    this.ChangeSymbol=function(symbol, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol,option);
    }

    this.CreateJSStockInfoChartContainer=function(option)
    {
        var chart=new JSStockInfoChartContainer(this.CanvasElement);
        chart.Create(option);

        this.SetChartBorder(chart, option);

        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (IFrameSplitOperator.IsNonEmptyArray(option.HeaderColumn))  chart.SetHeaderColumn(option.HeaderColumn);
        if (IFrameSplitOperator.IsNonEmptyArray(option.MouseOnKey)) chart.SetMouseOnKey(option.MouseOnKey);

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
            JSConsole.Chart.Log('[JSStockInfoChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSStockInfoChart:ReloadResource] ');
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
            JSConsole.Chart.Log('[JSStockInfoChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }
}

JSStockInfoChart.Init=function(divElement)
{
    var jsChartControl=new JSStockInfoChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSStockInfoChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (JSStockInfoChart.Init()之前)
JSStockInfoChart.GetResource=function()  
{
    return g_JSChartResource;
}

JSStockInfoChart.GetfloatPrecision=function(symbol)
{
    return GetfloatPrecision(symbol);
}


function JSStockInfoChartContainer(uielement)
{
    this.ClassName='JSStockInfoChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法
    this.ChartSplashPaint=null;                     //等待提示
    this.LoadDataSplashTitle="数据加载中";           //下载数据提示信息

    this.Canvas=uielement.getContext("2d");         //画布

    this.Symbol;    //代码
    this.NetworkFilter;                                 //数据回调接口
    this.Data=
    { 
        Name:null,
        YClose:null,    //昨收盘
        YFClose:null,   //昨计算价
        Symbol:null,

        Buys:
        [ 
            { Name:"买一", Price:null, Vol:null, Amount:null },
            { Name:"买二", Price:null, Vol:null, Amount:null },
            { Name:"买三", Price:null, Vol:null, Amount:null },
            { Name:"买四", Price:null, Vol:null, Amount:null },
            { Name:"买五", Price:null, Vol:null, Amount:null },
            { Name:"买六", Price:null, Vol:null, Amount:null },
            { Name:"买七", Price:null, Vol:null, Amount:null },
            { Name:"买八", Price:null, Vol:null, Amount:null },
            { Name:"买九", Price:null, Vol:null, Amount:null },
            { Name:"买十", Price:null, Vol:null, Amount:null },
        ],

        Sells:
        [
            { Name:"卖一", Price:null, Vol:null, Amount:null },
            { Name:"卖二", Price:null, Vol:null, Amount:null },
            { Name:"卖三", Price:null, Vol:null, Amount:null },
            { Name:"卖四", Price:null, Vol:null, Amount:null },
            { Name:"卖五", Price:null, Vol:null, Amount:null },
            { Name:"卖六", Price:null, Vol:null, Amount:null },
            { Name:"卖七", Price:null, Vol:null, Amount:null },
            { Name:"卖八", Price:null, Vol:null, Amount:null },
            { Name:"卖九", Price:null, Vol:null, Amount:null },
            { Name:"卖十", Price:null, Vol:null, Amount:null },
        ],

        MapData:new Map(),  //key=, { Value:, Text:, }
    }; 
           //股票数据
    this.BorderData={ MapData:null }; //key=Field Value:[null, {ExePrice} ,{ExePrice} ]

    this.MapStockData;

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.AutoUpdateTimer=null;
    this.AutoUpdateFrequency=15000;             //15秒更新一次数据

    this.JSPopMenu;             //内置菜单

    this.UIElement=uielement;
   
    this.IsDestroy=false;        //是否已经销毁了

    this.ChartDestroy=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();

        this.DestroyPopMenu();
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

    this.InitalPopMenu=function()   //初始化弹出窗口
    {
        if (this.JSPopMenu) return;

        this.JSPopMenu=new JSPopMenu();     //内置菜单
        this.JSPopMenu.Inital();
    }

    this.DestroyPopMenu=function()
    {
        if (!this.JSPopMenu) return;
        
        this.JSPopMenu.Destroy();
        this.JSPopMenu=null;
    }


    this.ClearData=function()
    {
        this.Data.Name=null;
        this.Data.YClose=null;
        this.Data.YFClose=null;

        this.Data.Buys= 
        [ 
            { Name:"买一", Price:null, Vol:null, Amount:null },
            { Name:"买二", Price:null, Vol:null, Amount:null },
            { Name:"买三", Price:null, Vol:null, Amount:null },
            { Name:"买四", Price:null, Vol:null, Amount:null },
            { Name:"买五", Price:null, Vol:null, Amount:null },
            { Name:"买六", Price:null, Vol:null, Amount:null },
            { Name:"买七", Price:null, Vol:null, Amount:null },
            { Name:"买八", Price:null, Vol:null, Amount:null },
            { Name:"买九", Price:null, Vol:null, Amount:null },
            { Name:"买十", Price:null, Vol:null, Amount:null },
        ];

        this.Data.Sells=
        [
            { Name:"卖一", Price:null, Vol:null, Amount:null },
            { Name:"卖二", Price:null, Vol:null, Amount:null },
            { Name:"卖三", Price:null, Vol:null, Amount:null },
            { Name:"卖四", Price:null, Vol:null, Amount:null },
            { Name:"卖五", Price:null, Vol:null, Amount:null },
            { Name:"卖六", Price:null, Vol:null, Amount:null },
            { Name:"卖七", Price:null, Vol:null, Amount:null },
            { Name:"卖八", Price:null, Vol:null, Amount:null },
            { Name:"卖九", Price:null, Vol:null, Amount:null },
            { Name:"卖十", Price:null, Vol:null, Amount:null },
        ];

        this.Data.MapData=new Map();
    }

    this.ChangeSymbol=function(symbol, option)
    {
        this.CancelAutoUpdate();
        this.ClearData();
        this.ChartClearMouseOnData();
        this.Symbol=symbol;
        this.Data.Symbol=symbol;

        if (option)
        {
            if (IFrameSplitOperator.IsArray(option.Column)) this.SetColumn(option.Column);
            if (IFrameSplitOperator.IsNumber(option.BuySellCount)) this.SetBuySellCount(option.BuySellCount);
            if (IFrameSplitOperator.IsArray(option.MouseOnKey)) this.SetMouseOnKey(option.MouseOnKey);
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
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSStockInfoChartContainer::RequestStockData', //类名::函数名
                Explain:'股票5档实时数据',
                Request: { Data:{symbol:this.Symbol} },
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, (data)=>
            { 
                this.RecvStockData(data);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }
    }

    this.RecvStockData=function(recv)
    {
        if (!recv) return;

        if (recv.name) this.Data.Name=recv.Name;
        if (IFrameSplitOperator.IsNumber(recv.yclose)) this.Data.YClose=recv.yclose;
        if (IFrameSplitOperator.IsNumber(recv.yfclose)) this.Data.YFClose=recv.yfclose;
        
        if (recv.name) this.Data.Name=recv.name;

        if (IFrameSplitOperator.IsNonEmptyArray(recv.data))
        {
            for(var i=0;i<recv.data.length;++i)
            {
                var item=recv.data[i];
                if (item.Name=="Buys")
                {
                    if (IFrameSplitOperator.IsNonEmptyArray(item.Value))
                    {
                        for(var j=0;j<item.Value.length && j<this.Data.Buys.length;++j)
                        {
                            var srcItem=item.Value[j];
                            var destItem=this.Data.Buys[j];
                            destItem.Price=srcItem.Price;
                            destItem.Vol=srcItem.Vol;
                        }
                    }
                }
                else if (item.Name=="Sells")
                {
                    if (IFrameSplitOperator.IsNonEmptyArray(item.Value))
                    {
                        for(var j=0;j<item.Value.length && j<this.Data.Sells.length;++j)
                        {
                            var srcItem=item.Value[j];
                            var destItem=this.Data.Sells[j];
                            destItem.Price=srcItem.Price;
                            destItem.Vol=srcItem.Vol;
                        }
                    }
                }
                else if (item.Name=="Symbol")
                {
                    this.Data.Symbol=item.Value.Text;
                }
                else
                {
                    this.Data.MapData.set(item.Name, item.Value);
                }
            }
        }

        this.Draw();
    }

    //创建
    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建框架
        this.Frame=new JSStockInfoFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        //创建表格
        var chart=new ChartStockData();
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

       
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        /*
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        
        */
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
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_CLICK_STOCKINFO_ITEM, ptClick, e);
            }
            else if (e.button==2)   //右键点击
            {
                var ptClick={ X:this.ClickDownPoint.X, Y:this.ClickDownPoint.Y };
                this.TryClickPaintEvent(JSCHART_EVENT_ID.ON_RCLICK_STOCKINFO_ITEM, ptClick, e);
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

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        this.OnRightMenu(x, y, e);
    }

    this.OnRightMenu=function(x,y,e)
    {
        if (!this.JSPopMenu) return;

        var pixelTatio = GetDevicePixelRatio();
        var toolTip=new TooltipData();
        var data=null;
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item.GetTooltipData(x*pixelTatio,y*pixelTatio,toolTip))
            {
                if (toolTip.Data)
                {
                    data= { Cell:toolTip.Data};
                    break;
                }
            }
        }

        if (!data) return;

        data.e=e;
        var menuData={ Menu:null, Position:JSPopMenu.POSITION_ID.RIGHT_MENU_ID };
        menuData.ClickCallback=(data)=>{ this.OnClickRightMenu(data); }

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CREATE_RIGHT_MENU);
        if (event && event.Callback)
        {
            var sendData={ MenuData:menuData, Data:data };
            event.Callback(event, sendData, this);
        }

        if (menuData.Menu) this.PopupMenuByRClick(menuData, x, y);
    }

     //右键菜单
    this.PopupMenuByRClick=function(menuData, x, y)
    {
        if (!this.JSPopMenu) return;

        var rtClient=this.UIElement.getBoundingClientRect();
        var rtScroll=GetScrollPosition();

        x+=rtClient.left+rtScroll.Left;
        y+=rtClient.top+rtScroll.Top;

        this.JSPopMenu.CreatePopMenu(menuData);
        this.JSPopMenu.PopupMenuByRight(x,y);
    }

    //点击右键菜单
    this.OnClickRightMenu=function(data)
    {
        JSConsole.Chart.Log('[JSStockInfoChartContainer::OnClickRightMenu] ',data);
        if (!data || !data.Data) return;

        var cmdID=data.Data.ID;     //命令ID
        var aryArgs=data.Data.Args; //参数

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MENU_COMMAND);  //回调通知外部
        if (event && event.Callback)
        {
            var data={ PreventDefault:false, CommandID:cmdID, Args:aryArgs, SrcData:data };
            event.Callback(event,data,this);
            if (data.PreventDefault) return;
        }

        this.ExecuteMenuCommand(cmdID, aryArgs);
    }

    this.ExecuteMenuCommand=function(cmdID, aryArgs)
    {

    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var option={ Update:false };

        this.OnChartMouseMove(x,y,e,option);

        if (option.Update===true) this.Draw();
    }

    this.OnChartMouseMove=function(x, y, e, option)
    {
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item && item.OnMouseMove)
            {
                if (item.OnMouseMove(x,y,e,option)) return true;
            }
        }

        return false;
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
                        var data= { X:e.clientX, Y:e.clientY, Tooltip:toolTip };
                        event.Callback(event, data, this);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    this.UIOnMouseleave=function(e)
    {
        var option={ Update:false }
        
        this.ChartClearMouseOnData(option);

        if (option.Update===true) this.Draw();
    }

    this.UIOnMounseOut=function(e)
    {
        var option={ Update:false }

        this.ChartClearMouseOnData(option);

        if (option.Update===true) this.Draw();

        //this.HideAllTooltip();
    }

    this.ChartClearMouseOnData=function(option)
    {
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var item=this.ChartPaint[i];
            if (item && item.ClearMouseOnData)
            {
                item.ClearMouseOnData(option);
            }
        }
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
    }

    this.SetColumn=function(aryColunm, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetColumn(aryColunm);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.SetHeaderColumn=function(aryColunm, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetHeaderColumn(aryColunm);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.SetBuySellCount=function(count, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.BuySellCount=count;
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.SetMouseOnKey=function(aryKey)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetMouseOnKey(aryKey);
    }
}

function JSStockInfoFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右
    this.ClassName="JSStockInfoFrame";

    this.BorderColor=g_JSChartResource.StockInfo.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.StockInfo.BorderColor;    //边框线
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
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'right';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetRight()-30;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
    }
}


function ChartStockData()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartStockData';       //类名
    this.UIElement;
    this.GetEventCallback;              //获取事件
    this.Data;                          //数据
    this.BorderData;
    this.SizeChange=true;
    this.Decimal=2;                     //价格小数位数

    this.UpColor=g_JSChartResource.StockInfo.UpTextColor;
    this.DownColor=g_JSChartResource.StockInfo.DownTextColor;
    this.UnchangeColor=g_JSChartResource.StockInfo.UnchangeTextColor; 

    this.HeaderConfig=CloneData(g_JSChartResource.StockInfo.Header);
    this.HeaderColumn=
    [
        { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1, DefaultText:"--.--" }, 
        { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%", DefaultText:"--.--%" }, 
        { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1, DefaultText:"--.--" }
    ]

    //买卖5档配置
    this.BuySellConfig=CloneData(g_JSChartResource.StockInfo.BuySell);
    this.BuySellCount=5;    //显示几档买卖盘

    this.TableConfig=CloneData(g_JSChartResource.StockInfo.Table);
    
    //显示的字段
    this.Column=
    [
        [{ Name:"涨停价", Key:"UpLimit",ColorType:3, FloatPrecision:-1 }, { Name:"跌停价",  Key:"DownLimit" , ColorType:3, FloatPrecision:-1 }],
        [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, { Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1 }],
        [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1 }, { Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1 }],
        [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 }],
        [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"换手率", Key:"Exchange", FloatPrecision:2, StringFormat:"{Value}%" }],
        
        [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总额",  Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
        [{ Name:"内盘", Key:"InVol", ColorType:4, FloatPrecision:0 }, { Name:"外盘",  Key:"OutVol",ColorType:5, FloatPrecision:0 }],
        [{ Name:"TTM", Key:"PE_TTM",  FloatPrecision:2 }, { Name:"市净率",  Key:"PB", FloatPrecision:2 }],
        [{ Name:"流通市值", Key:"FlowMarketValue",  FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总市值",  Key:"TotalMarketValue", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
    ];

    this.AryCellRect=[];
    this.MouseOnItem=null; //{ Key:, Rect: }
    //this.MouseOnItem={ Key:"SELL_PRICE_0" };
    this.MouseOnConfig=CloneData(g_JSChartResource.StockInfo.MouseOn); 

    this.MapMouseOnKey=new Map();
    
    
    this.ReloadResource=function(resource)
    {
        this.UpColor=g_JSChartResource.StockInfo.UpTextColor;
        this.DownColor=g_JSChartResource.StockInfo.DownTextColor;
        this.UnchangeColor=g_JSChartResource.StockInfo.UnchangeTextColor; 

        this.HeaderConfig=CloneData(g_JSChartResource.StockInfo.Header);

        //买卖5档配置
        this.BuySellConfig=CloneData(g_JSChartResource.StockInfo.BuySell);

        this.TableConfig=CloneData(g_JSChartResource.StockInfo.Table);

        this.MouseOnConfig=CloneData(g_JSChartResource.StockInfo.MouseOn); 
    }

    this.ClearMouseOnData=function(option)
    {
        if (this.MouseOnItem)
        {
            this.MouseOnItem=null;
            if (option) option.Update=true; //需要更新
        }
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

    this.SetHeaderColumn=function(aryColumn)
    {
        this.HeaderColumn=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;

        for(var i=0;i<aryColumn.length;++i)
        {
            var item=aryColumn[i];
            if (!item) continue;
            this.HeaderColumn.push(CloneData(item));
        }
    }

    this.SetMouseOnKey=function(aryKey)
    {
        this.MapMouseOnKey.clear();
        if (!IFrameSplitOperator.IsNonEmptyArray(aryKey)) return;

        for(var i=0;i<aryKey.length;++i)
        {
            var key=aryKey[i];
            if (!key) continue;

            this.MapMouseOnKey.set(key, { Key:key });
        }
        
    }

    this.OnMouseMove=function(x, y, e, option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryCellRect)) return false;

        if (this.MouseOnItem && this.MouseOnItem.Rect)
        {
            var rect=this.MouseOnItem.Rect;
            if (Path2DHelper.PtInRect(x,y,rect )) return true;
        }

        for(var i=0;i<this.AryCellRect.length;++i)
        {
            var item=this.AryCellRect[i];
            var rect=item.Rect;
            if (Path2DHelper.PtInRect(x,y, rect))
            {
                this.MouseOnItem={ Key:item.Data.Key, Rect:rect };
                if (option) option.Update=true;
                return true;
            }
        }

        if (this.MouseOnItem)
        {
            this.MouseOnItem=null;
            if (option) option.Update=true;
        }

        return false;
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryCellRect)) return false;

        for(var i=0;i<this.AryCellRect.length;++i)
        {
            var item=this.AryCellRect[i];
            var rect=item.Rect;
            if (Path2DHelper.PtInRect(x,y, rect))
            {
                tooltip.Data=item;
                tooltip.ChartPaint=this;
                tooltip.Type=151;
                return true;
            }
        }

        return false;
    }

    this.Draw=function()
    {
        this.AryCellRect=[];
        this.Decimal=GetfloatPrecision(this.Data.Symbol);
        var border=this.ChartBorder.GetBorder();
        var position = { Left:border.Left, Right:border.Right, Top:border.Top, Width:border.Right-border.Left, Border:border };
        this.DrawHeader(position);
        this.DrawBuySell(position);
        this.DrawTable(position);
    }

    this.DrawHeader=function(position)
    {
        var config=this.HeaderConfig;
        var top=position.Top;
        var left=position.Left;
        var xText=left;
        var yText=top;

        this.Canvas.font=config.Name.Font;
        var nameHeight=this.Canvas.measureText("擎").width;
        nameHeight+=config.Name.Margin.Top+config.Name.Margin.Bottom;

        this.Canvas.font=config.Symbol.Font;
        var symbolHeight=this.Canvas.measureText("擎").width;
        symbolHeight+=config.Symbol.Margin.Top+config.Symbol.Margin.Bottom;

        var lineHeight=Math.max(symbolHeight, nameHeight);

        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        if (this.Data.Name)
        {
            var text=this.Data.Name;
            xText+=config.Name.Margin.Left;
            var yBottom=yText+lineHeight-config.Name.Margin.Bottom+config.Name.Margin.YOffset;

            this.Canvas.font=config.Name.Font;
            this.Canvas.fillStyle=config.Name.Color;
            this.Canvas.fillText(text,xText,yBottom);
            var textWidth=this.Canvas.measureText(text).width;

            xText+=textWidth+config.Name.Margin.Right;
        }

        if (this.Data.Symbol)
        {
            var text=MARKET_SUFFIX_NAME.GetShortSymbol(this.Data.Symbol);
            xText+=config.Symbol.Margin.Left;
            var yBottom=yText+lineHeight-config.Symbol.Margin.Bottom+config.Symbol.Margin.YOffset;

            this.Canvas.font=config.Symbol.Font;
            this.Canvas.fillStyle=config.Symbol.Color;
            this.Canvas.fillText(text,xText,yBottom);
            var textWidth=this.Canvas.measureText(text).width;

            xText+=textWidth+config.Symbol.Margin.Right;
        }

        yText+=lineHeight;

        if (IFrameSplitOperator.IsNonEmptyArray(this.HeaderColumn))
        {
            lineHeight=0;
            for(var i=0;i<this.HeaderColumn.length && i<config.AryCell.length;++i)
            {
                var subConfig=config.AryCell[i];
                this.Canvas.font=subConfig.Font;
                var textHeight=this.Canvas.measureText("擎").width;
                textHeight+=subConfig.Margin.Top+subConfig.Margin.Bottom;
                if (lineHeight<textHeight) lineHeight=textHeight;
            }

            var xText=left;
            for(var i=0;i<this.HeaderColumn.length && i<config.AryCell.length;++i)
            {
                var item=this.HeaderColumn[i];
                var text="--.--";
                color=config.TextColor;
                if (item.DefaultText) text=item.DefaultText;
                var subConfig=config.AryCell[i];
                if (this.Data.MapData && this.Data.MapData.has(item.Key))
                {
                    var dataItem=this.Data.MapData.get(item.Key);
                    var text=this.FormatValue(item, dataItem);
                    
                    if (item.ColorType===3 && IFrameSplitOperator.IsNumber(dataItem.Value))
                        color=this.GetPriceColor(dataItem.Value);
                    else if (item.ColorType==1 && IFrameSplitOperator.IsNumber(dataItem.Value))
                        color=this.GetUpDownColor(dataItem.Value,0);
                    else if (item.ColorType==4) 
                        color=this.UpColor;
                    else if (item.ColorType==5)
                        color=this.DownColor;
                }

                if (item.TextColor) color=item.TextColor;

                if (text)
                {
                    this.Canvas.font=subConfig.Font;
                    var textWidth=this.Canvas.measureText(text).width;
                    var x=xText+subConfig.Margin.Left;
                    this.Canvas.fillStyle=color;
                    var yBottom=yText+lineHeight-subConfig.Margin.Bottom+subConfig.Margin.YOffset;
                    this.Canvas.fillText(text,x,yBottom);

                    xText+=subConfig.Margin.Left+subConfig.Margin.Right+textWidth;
                }
            }

            yText+=lineHeight;
        }

        position.Top=yText;

        if (config.BottomLine && config.BottomLine.Enable)
        {
            var xLeft=position.Border.Left, xRight=position.Border.Right;
            this.Canvas.strokeStyle=config.BottomLine.Color;
            var lineWidth=1*GetDevicePixelRatio();;
            this.Canvas.lineWidth=lineWidth;
            this.Canvas.beginPath();
            this.Canvas.moveTo(xLeft,ToFixedPoint(yText));
            this.Canvas.lineTo(xRight,ToFixedPoint(yText));
            this.Canvas.stroke();
            position.Top=ToFixedPoint(yText);
        }
    }

    //买卖5档
    this.DrawBuySell=function(position)
    {
        if (this.BuySellCount<=0) return;

        var config=this.BuySellConfig;
        var top=position.Top;
        var left=position.Left+config.Margin.Left;
        var cellWidth=(position.Width-config.Margin.Left-config.Margin.Right)/4;

        var yText=top+config.Margin.Top;
        var xText=left;
        
        this.Canvas.font=config.Font;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        var cellHeight=this.Canvas.measureText("擎").width+config.CellMargin.Top+config.CellMargin.Bottom;
        var count=this.BuySellCount;
        var sellVol=0, buyVol=0;
        for(var i=count-1;i>=0;--i)
        {
            xText=left;
            var item=this.Data.Sells[i];
            this.DrawBuySellItem(item, xText, yText, cellWidth, cellHeight, { Type:1, Index:i});
            if (IFrameSplitOperator.IsNumber(item.Vol)) sellVol+=item.Vol;
            yText+=cellHeight;
        }

        var yCenter=null;
        if (config.CenterLine)  //留出画线的位置
        {
            yCenter=yText;
            var lineConfig=config.CenterLine;
            var lineWidth=lineConfig.Width;
            yText+=lineWidth;
        }
        

        for(var i=0;i<count && i<this.Data.Buys.length;++i)
        {
            xText=left;
            var item=this.Data.Buys[i];
            this.DrawBuySellItem(item, xText, yText, cellWidth, cellHeight, { Type:2, Index:i});
            if (IFrameSplitOperator.IsNumber(item.Vol)) buyVol+=item.Vol;
            yText+=cellHeight;
        }

        position.Top=yText;

        if (IFrameSplitOperator.IsNumber(yCenter) && config.CenterLine)
        {
            var lineConfig=config.CenterLine;
            var xLeft=position.Border.Left, xRight=position.Border.Right;
            var lineWidth=lineConfig.Width;
            if (buyVol+sellVol>0)
            {
                var buyRate=buyVol/(buyVol+sellVol);
                var barWidth=xRight-xLeft;
                var buyWidth=barWidth*buyRate;
                var xCenter=xLeft+buyWidth;
                this.Canvas.lineWidth=lineWidth;
                this.Canvas.strokeStyle=lineConfig.BuyColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(xLeft,ToFixedPoint2(lineWidth,yCenter));
                this.Canvas.lineTo(xCenter,ToFixedPoint2(lineWidth,yCenter));
                this.Canvas.stroke();

                this.Canvas.strokeStyle=lineConfig.SellColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(xCenter,ToFixedPoint2(lineWidth,yCenter,));
                this.Canvas.lineTo(xRight,ToFixedPoint2(lineWidth,yCenter));
                this.Canvas.stroke();
            }
            else
            {
                this.Canvas.strokeStyle=lineConfig.NoneColor;
                this.Canvas.lineWidth=lineWidth;
                this.Canvas.beginPath();
                this.Canvas.moveTo(xLeft,ToFixedPoint2(lineWidth,yCenter));
                this.Canvas.lineTo(xRight,ToFixedPoint2(lineWidth,yCenter));
                this.Canvas.stroke();
            }
        }

        if (config.BottomLine && config.BottomLine.Enable)
        {
            var xLeft=position.Border.Left, xRight=position.Border.Right;
            this.Canvas.strokeStyle=config.BottomLine.Color;
            this.Canvas.lineWidth=1*GetDevicePixelRatio();
            this.Canvas.beginPath();
            this.Canvas.moveTo(xLeft,ToFixedPoint(yText));
            this.Canvas.lineTo(xRight,ToFixedPoint(yText));
            this.Canvas.stroke();
        }

        if (config.TopLine && config.TopLine.Enable)
        {
            var xLeft=position.Border.Left, xRight=position.Border.Right;
            this.Canvas.strokeStyle=config.BottomLine.Color;
            this.Canvas.lineWidth=1*GetDevicePixelRatio();
            this.Canvas.beginPath();
            this.Canvas.moveTo(xLeft,ToFixedPoint(top));
            this.Canvas.lineTo(xRight,ToFixedPoint(top));
            this.Canvas.stroke();
        }
    }

    //itemInfo={ Type:2(1=买 2=卖), Index:数据索引 }
    this.DrawBuySellItem=function(item, left, top, cellWidth, cellHeight, itemInfo)
    {
        var config=this.BuySellConfig;
        var xText=left;
        var yBottom=top+cellHeight-config.CellMargin.Bottom+config.CellMargin.YOffset;

        if (item.Name)
        {
            this.Canvas.fillStyle=config.TitleColor;
            this.Canvas.fillText(item.Name,xText+config.CellMargin.Left,yBottom);
        }
        xText+=cellWidth;

        if (IFrameSplitOperator.IsNumber(item.Price))
        {
            var key=`${itemInfo.Type==1?"BUY":"SELL"}_PRICE_${itemInfo.Index}`;
            var mouseOnItem=this.IsMouseOn(key);

            var text=item.Price.toFixed(this.Decimal);
            var textWidth=this.Canvas.measureText(text).width;
            var x=xText+cellWidth-textWidth-config.CellMargin.Right;
            var rtCell={ Left:xText, Width:cellWidth, Top:top, Height:cellHeight };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;
            if (mouseOnItem) this.DrawMouseOnRect(rtCell);

            this.Canvas.fillStyle=this.GetPriceColor(item.Price);
            this.Canvas.fillText(text,x,yBottom);
            
            if (this.MapMouseOnKey.has(key))
                this.AryCellRect.push({ Rect:rtCell, Data:{ Type:1, Key:key, Value:item.Price }});
        }
        xText+=cellWidth;

        xText+=cellWidth;

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            var text=item.Vol.toFixed(0);
            var textWidth=this.Canvas.measureText(text).width;
            var x=xText+cellWidth-textWidth-config.CellMargin.Right;
            this.Canvas.fillStyle=config.VolColor;
            this.Canvas.fillText(text,x,yBottom);
        }
    }

    this.IsMouseOn=function(key)
    {
        if (!this.MouseOnItem) return null;

        if (this.MouseOnItem.Key===key) return this.MouseOnItem;

        return null;
    }

    this.DrawMouseOnRect=function(rect)
    {
        if (!this.MouseOnItem) return;

        this.Canvas.fillStyle=this.MouseOnConfig.BGColor;
        this.Canvas.fillRect(rect.Left, rect.Top, rect.Width, rect.Height);

        this.MouseOnItem.Rect=rect;
    }


    this.DrawTable=function(position)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Column)) return;

        var config=this.TableConfig;
        var top=position.Top;
        var left=position.Left+config.Margin.Left;
        var cellWidth=(position.Width-config.Margin.Left-config.Margin.Right)/4;

        var yText=top+config.Margin.Top;
        var xText=left;
        
        this.Canvas.font=config.Font;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        var cellHeight=this.Canvas.measureText("擎").width+config.CellMargin.Top+config.CellMargin.Bottom;

        for(var i=0;i<this.Column.length;++i)
        {
            xText=left;
            var item=this.Column[i];
            if (!item || !IFrameSplitOperator.IsNonEmptyArray(item)) continue;
            this.DrawRowItem(item, xText, yText, cellWidth, cellHeight);

            yText+=cellHeight;
        }
    }

    this.DrawRowItem=function(aryData, left, top, cellWidth, cellHeight)
    {
        var config=this.TableConfig;
        var xText=left;
        var yBottom=top+cellHeight-config.CellMargin.Bottom+config.CellMargin.YOffset;

        for(var i=0;i<aryData.length && i<2;++i)
        {
            var item=aryData[i];
            if (item)
            {
                if (item.Name)
                {
                    this.Canvas.fillStyle=config.TitleColor;
                    this.Canvas.fillText(item.Name,xText+config.CellMargin.Left,yBottom);
                }
                xText+=cellWidth;

                if (this.Data.MapData && this.Data.MapData.has(item.Key))
                {
                    var dataItem=this.Data.MapData.get(item.Key);
                    color=config.TextColor;

                    var text=this.FormatValue(item, dataItem);
                    
                    if (item.ColorType===3 && IFrameSplitOperator.IsNumber(dataItem.Value))
                        color=this.GetPriceColor(dataItem.Value);
                    else if (item.ColorType==1 && IFrameSplitOperator.IsNumber(dataItem.Value))
                        color=this.GetUpDownColor(dataItem.Value,0);
                    else if (item.ColorType==4) 
                        color=this.UpColor;
                    else if (item.ColorType==5)
                        color=this.DownColor;

                    if (item.TextColor) color=item.TextColor;

                    if (text)
                    {
                        if (i==0 && item.ShowType==1)   //整行显示
                        {
                            var mouseOnItem=this.IsMouseOn(item.Key);
                            var textWidth=this.Canvas.measureText(text).width;
                            var x=xText+(cellWidth*3)-textWidth-config.CellMargin.Right;
                            var rtCell={ Left:xText+cellWidth, Top:top, Width:cellWidth*2, Height:cellHeight};
                            rtCell.Right=rtCell.Left+rtCell.Width;
                            rtCell.Bottom=rtCell.Top+rtCell.Height;
                            if (mouseOnItem) this.DrawMouseOnRect(rtCell);

                            this.Canvas.fillStyle=color;
                            this.Canvas.fillText(text,x,yBottom);

                            if (this.MapMouseOnKey.has(item.Key))
                                this.AryCellRect.push({ Rect:rtCell, Data:{ Type:2, Key:item.Key, Value:dataItem }});
                            break;
                        }
                        else
                        {
                            var mouseOnItem=this.IsMouseOn(item.Key);
                            var textWidth=this.Canvas.measureText(text).width;
                            var x=xText+cellWidth-textWidth-config.CellMargin.Right;
                            var rtCell={ Left:xText, Top:top, Width:cellWidth, Height:cellHeight};
                            rtCell.Right=rtCell.Left+rtCell.Width;
                            rtCell.Bottom=rtCell.Top+rtCell.Height;
                            if (mouseOnItem) this.DrawMouseOnRect(rtCell);

                            this.Canvas.fillStyle=color;
                            this.Canvas.fillText(text,x,yBottom);

                            if (this.MapMouseOnKey.has(item.Key))
                                this.AryCellRect.push({ Rect:rtCell, Data:{ Type:2, Key:item.Key, Value:dataItem }});
                        }
                        
                    }
                }
                xText+=cellWidth;
            }
            else
            {
                xText+=cellWidth+cellWidth;
            }
        }
        
    }


    this.FormatValue=function(column, data)
    {
        var dec=0;  //小数位数
        if (IFrameSplitOperator.IsNumber(column.FloatPrecision))
        {
            if (column.FloatPrecision===-1) dec=this.Decimal;
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

    this.GetPriceColor=function(price)
    {
        var upperSymbol=null;
        if (this.Data.Symbol) upperSymbol=this.Data.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol))
        {
            if (!IFrameSplitOperator.IsNumber(this.Data.YFClose)) return  this.UnchangeColor;
            return this.GetUpDownColor(price, this.Data.YFClose);
        }
        else
        {
            if (!IFrameSplitOperator.IsNumber(this.Data.YClose)) return this.UnchangeColor;
            return this.GetUpDownColor(price, this.Data.YClose);
        }
    }

    this.GetUpDownColor=function(price, price2)
    {
        if (price>price2) return this.UpColor;
        else if (price<price2) return this.DownColor;
        else return this.UnchangeColor;
    }
}







