/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装股票列表控件 (H5版本)
   不提供内置测试数据
*/

function JSReportChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

    //h5 canvas
    this.CanvasElement=document.createElement("canvas");
    this.CanvasElement.className='jsreportlist-drawing';
    this.CanvasElement.id=Guid();
    this.CanvasElement.setAttribute("tabindex",0);
    if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
    if(divElement.hasChildNodes())
    {
        JSConsole.Chart.Log("[JSReportChart::JSReportChart] divElement hasChildNodes", divElement.childNodes);
    }
    divElement.appendChild(this.CanvasElement);

      //额外的画布
    this.MapExtraCanvasElement=new Map();   //key=画布名字, value={ Element:, Canvas:}

    this.CreateExtraCanvasElement=function(name, option)
    {
        if (this.MapExtraCanvasElement.has(name)) return this.MapExtraCanvasElement.get(name);

        var element=document.createElement("canvas");
        element.className='jsreportlist-drawing-extra';
        element.id=Guid();
        if (name==JSReportChart.CorssCursorCanvasKey)  
            element.setAttribute("tabindex",5);
        else 
            element.setAttribute("tabindex",1);

        if (element.style) 
        {
            element.style.outline='none';
            element.style.position="absolute";
            element.style.left='0px';
            element.style.top='0px';
            element.style["pointer-events"]="none";
        }

        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.TabIndex))  element.setAttribute("tabindex",option.TabIndex);
            if (IFrameSplitOperator.IsNumber(option.ZIndex))  element.style["z-index"]=option.ZIndex;
        }

        if (this.CanvasElement)
        {
            element.height=this.CanvasElement.height;
            element.width=this.CanvasElement.width;
            if (element.style)
            {
                element.style.width=this.CanvasElement.style.width;
                element.style.height=this.CanvasElement.style.height
            }
        }

        divElement.appendChild(element);

        var item={ Element:element, Canvas:null };
        this.MapExtraCanvasElement.set(name, item);
    }

    this.GetExtraCanvas=function(name)
    {
        if (!this.MapExtraCanvasElement.has(name)) return null;

        var item=this.MapExtraCanvasElement.get(name);
        if (!item.Element) return null;

        if (!item.Canvas) item.Canvas=item.Element.getContext("2d");
        
        return item;
    }

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

        //扩展画布
        for(var mapItem of this.MapExtraCanvasElement)
        {
            var item=mapItem[1];
            var element=item.Element;
            if (!element) continue;

            element.height=this.CanvasElement.height;
            element.width=this.CanvasElement.width;
            element.style.width=this.CanvasElement.style.width;
            element.style.height=this.CanvasElement.style.height;
        }

        JSConsole.Chart.Log(`[JSReportChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSReportChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        //注册事件
        if (option.EventCallback)
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        if (option.EnableResize==true) this.CreateResizeListener();

        if (option.EnablePopMenuV2===true) chart.InitalPopMenu();
        if (option.FloatTooltip && option.FloatTooltip.Enable) chart.InitalFloatTooltip(option.FloatTooltip);   //提示信息
        if (option.MinuteChartTooltip && option.MinuteChartTooltip.Enable) chart.InitalMinuteChartTooltip(option.MinuteChartTooltip);
        if (option.KLineChartTooltip && option.KLineChartTooltip.Enable) chart.InitalKLineChartTooltip(option.KLineChartTooltip);

        if (option.Symbol) chart.Symbol=option.Symbol;
        if (option.Name) chart.Name=option.Name;

        var requestOption={ Callback:null };
        if (chart.Symbol) requestOption.Callback=function(){ chart.RequestMemberListData(); };
        
        if (option.LoadStockList===false)
        {
           chart.ChartSplashPaint.IsEnableSplash=false;
           chart.Draw();
        }
        else
        {
            chart.RequestStockListData(requestOption);   //下载码表     
        }
    }

    this.CreateJSReportChartContainer=function(option)
    {
        var chart=new JSReportChartContainer(this.CanvasElement);
        chart.GetExtraCanvas=(name)=>{ return this.GetExtraCanvas(name); }

        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;
        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (IFrameSplitOperator.IsNonEmptyArray(option.Tab)) chart.SetTab(option.Tab);
        if (IFrameSplitOperator.IsNumber(option.TabSelected)) chart.SetSelectedTab(option.TabSelected);
        if (IFrameSplitOperator.IsBool(option.EnableDragRow)) chart.EnableDragRow=option.EnableDragRow;
        if (IFrameSplitOperator.IsNumber(option.DragRowType)) chart.DragRowType=option.DragRowType;
        if (IFrameSplitOperator.IsBool(option.EnableDragHeader)) chart.EnableDragHeader=option.EnableDragHeader;
        if (IFrameSplitOperator.IsNumber(option.WheelPageType)) chart.WheelPageType=option.WheelPageType;
        if (IFrameSplitOperator.IsBool(option.PageUpDownCycle)) chart.PageUpDownCycle=option.PageUpDownCycle;

        //数据下载提示信息
        if (IFrameSplitOperator.IsObject(option.SplashTitle)) 
        {
            var item=option.SplashTitle;
            if (item) chart.SplashTitle.StockList=item.StockList;
            if (item) chart.SplashTitle.MemberList=item.MemberList;
        }
       
        
        if (option.VScrollbar) chart.SetVScrollbar(option.VScrollbar);
        if (option.SortInfo)
        {
            var item=option.SortInfo;
            if (IFrameSplitOperator.IsNumber(item.Field)) chart.SortInfo.Field=item.Field;
            if (IFrameSplitOperator.IsNumber(item.Sort)) chart.SortInfo.Sort=item.Sort;
        }

        if (option.VirtualTable)
        {
            var item=option.VirtualTable;
            if (IFrameSplitOperator.IsBool(item.Enable)) chart.Data.Virtual.Enable=item.Enable;
        }

        var reportChart=chart.GetReportChart();
        if (reportChart)
        {
            if (IFrameSplitOperator.IsNumber(option.TextOverflowStyle)) reportChart.TextOverflowStyle=option.TextOverflowStyle;
            if (IFrameSplitOperator.IsNumber(option.MultiSelectModel)) reportChart.MultiSelectModel=option.MultiSelectModel;
            if (IFrameSplitOperator.IsNumber(option.SelectedStyle)) reportChart.SelectedStyle=option.SelectedStyle;
        }

        this.SetChartBorder(chart, option);

        //是否自动更新
        if (option.IsAutoUpdate!=null) chart.IsAutoUpdate=option.IsAutoUpdate;
        if (option.AutoUpdateFrequency>0) chart.AutoUpdateFrequency=option.AutoUpdateFrequency;
        if (IFrameSplitOperator.IsBool(option.EnableFilter)) chart.EnableFilter=option.EnableFilter;

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

    this.CreateResizeListener=function()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    this.OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSReportChart::OnDivResize] entries=", entries);

        this.OnSize();
    }

    /////////////////////////////////////////////////////////////////////////////
    //对外接口
    
    //切换股票代码接口
    this.ChangeSymbol=function(symbol, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol,option);
    }

    this.SetColumn=function(aryColumn, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.SetColumn(aryColumn,option);
    }

    this.SetSelectedRow=function(option)
    {
        if (this.JSChartContainer) this.JSChartContainer.SetSelectedRow(option);
    }

    this.DeleteSymbol=function(arySymbol, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.DeleteSymbol(arySymbol, option);
    }

    this.AddSymbol=function(arySymbol, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.AddSymbol(arySymbol, option);
    }

    this.EnableFilter=function(bEnable, option) //启动|关闭筛选
    {
        if (this.JSChartContainer) this.JSChartContainer.EnableFilter(bEnable, option);
    }

    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSReportChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSReportChart:ReloadResource] ');
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
            JSConsole.Chart.Log('[JSReportChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }
}


JSReportChart.Init=function(divElement)
{
    var jsChartControl=new JSReportChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSReportChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (设置配必须啊在JSChart.Init()之前)
JSReportChart.GetResource=function()  
{
    return g_JSChartResource;
}

function HQReportItem()
{
    this.OriginalSymbol;    //原始代码
    this.Symbol;
    this.Name;
    this.YClose;
    this.Open;
    this.Price;
    this.High;
    this.Low;
    this.Amount;
    this.Vol;

    this.Increase;      //涨幅
    this.UpDown;        //涨跌
    this.Exchange;      //换手
    this.Amplitude;     //振幅

    this.BuyPrice;      //买价/量
    this.BuyVol;
    this.SellPrice;     //卖价/量
    this.SellVol;

    this.AvPrice;   //均价

    this.LimitHigh;       //涨停价
    this.LimitLow;        //跌停价

    this.VolIn;         //内盘
    this.VolOut;        //外盘

    this.DealNum;       //现量

    this.OutShares;     //流通股本
    this.TotalShares;   //总股本
    this.MarketValue;   //总市值
    this.CircMarketValue;//流通市值

    this.CloseLine;     //{Data:[], Max:, Min:, Count: }

    this.ExtendData;    //扩展数据

    this.Time;
    this.Date;
}

function JSReportChartContainer(uielement)
{
    this.ClassName='JSReportChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法
    this.ChartSplashPaint=null;                     //等待提示
    this.LoadDataSplashTitle="数据加载中";           //下载数据提示信息

    this.SplashTitle={ StockList:"下载码表中.....", MemberList:"下载成分中....." } ;

    this.Canvas=uielement.getContext("2d");         //画布

    this.Symbol;    //板块代码
    this.Name;      //板块名称
    this.NetworkFilter;                                 //数据回调接口
    this.Data={ XOffset:0, YOffset:0, Data:[], Virtual:{ Enable:false, Count:0 } };        //股票列表  (Virtual 虚拟表)
    this.SourceData={ Data:[] } ;                       //原始股票顺序(排序还原用)
    this.BlockData=new Map();                           //当前板块数据
    this.MapStockData=new Map();                        //原始股票数据
    this.FixedRowData={ Data:[], Type:0, Symbol:[] };              //顶部固定行Data:[{ Value:, Text:, Color:, TextAgiln: }], Type:0=自定义数据, 1 =(股票数据) Symbol:[],

    this.FlashBG=new Map();  
    this.FlashBGTimer=null;                            //闪烁背景 Value:{ LastTime:数据最后的时间, Data: { Key:ID, BGColor:, Time: , Count: 次数 } };
    this.GlobalOption={ FlashBGCount:0 };

    //this.FixedRowData.Data=[ [null, {Value:11, Text:"11" }], [null, null, null, {Value:12, Text:"ddddd", Color:"rgb(45,200,4)"}]];

    this.SortInfo={ Field:-1, Sort:0 };                //排序信息 {Field:排序字段id, Sort:0 不排序 1升序 2降序 }

    //行拖拽
    this.DragRow;
    this.DragColumnWidth;   //列宽拖动
    
    this.EnableDragRow=false;
    this.DragRowType=0; //0=插入  1=交换
    this.AutoDragScrollTimer=null;
    this.EnablePageScroll=false;
    this.DragMove;  //={ Click:{ 点击的点}, Move:{最后移动的点}, PreMove:{上一个点的位置} };

    //表头拖拽
    this.DragHeader;
    this.EnableDragHeader=false;

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.AutoUpdateTimer=null;
    this.AutoUpdateFrequency=15000;             //15秒更新一次数据

    this.DelayUpdateTimer=null;     //延迟更新
    this.DelayUpdateFrequency=500;  //延迟更新时间
    
    this.UIElement=uielement;
    this.LastPoint=new Point();     //鼠标位置
    this.IsOnTouch=false;
    this.TouchDrag;
    this.TouchMoveMinAngle=70;          //左右移动最小角度
    this.YStepPixel=5*GetDevicePixelRatio();
    this.XStepPixel=10*GetDevicePixelRatio();   
    
    this.PageUpDownCycle=true;  //翻页循环
    this.DragPageCycle=true;    //手机翻页循环
    this.WheelPageType=0;       //鼠标滚轴翻页模式 0=一页一页翻  1=一条一条翻

    //拖拽滚动条
    this.DragXScroll=null;  //{Start:{x,y}, End:{x, y}}
    this.DragYScroll=null;
    this.IsShowVScrollbar=false;

    this.IsDestroy=false;        //是否已经销毁了

    this.JSPopMenu;             //内置菜单
    this.IsShowRightMenu=true;

    //
    this.TooltipMinuteChart;    //分时图
    this.TooltipKLineChart;     //分时图

    //MouseOnStatus:{ RowIndex:行, ColumnIndex:列} 
    this.LastMouseStatus={ MoveStatus:null, TooltipStatus:null, MouseOnStatus:null };
   
    this.ChartDestroy=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();

        this.DestroyMinuteChartTooltip();
        this.DestroyKLineChartTooltip();
        this.DestroyFloatTooltip();
    }

    this.StopAutoDragScrollTimer=function()
    {
        JSConsole.Chart.Log("[JSReportChartContainer::StopAutoDragScrollTimer] stop ");
        this.EnablePageScroll=false;
        if (this.AutoDragScrollTimer!=null) 
        {
            clearTimeout(this.AutoDragScrollTimer);
            this.AutoDragScrollTimer = null;
        }
    }

    this.InitalPopMenu=function()   //初始化弹出窗口
    {
        if (this.JSPopMenu) return;

        this.JSPopMenu=new JSPopMenu();     //内置菜单
        this.JSPopMenu.Inital();
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

    this.InitalKLineChartTooltip=function(option)
    {
        if (this.TooltipKLineChart) return;

        this.TooltipKLineChart=new JSTooltipKLineChart();
        this.TooltipKLineChart.Inital(this, option);
        this.TooltipKLineChart.Create();
    }

    this.DestroyKLineChartTooltip=function()
    {
        if (!this.TooltipKLineChart) return;

        this.TooltipKLineChart.Destroy();
        this.TooltipKLineChart=null;
    }
    

    this.InitalFloatTooltip=function(option)
    {
        if (this.FloatTooltip) return;

        this.FloatTooltip=new JSFloatTooltip();
        this.FloatTooltip.Inital(this, option);
        this.FloatTooltip.Create();
    }

    this.HideFloatTooltip=function()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Hide();
    }

    this.DestroyFloatTooltip=function()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Destroy();
        this.FloatTooltip=null;
    }

    this.DrawFloatTooltip=function(point,toolTip)
    {
        if (!this.FloatTooltip) return;

        this.UpdateFloatTooltip(point, toolTip)
    }

    this.UpdateFloatTooltip=function(point, toolTip)
    {
        if (!this.FloatTooltip) return;

        var sendData=
        {
            Tooltip:toolTip,
            Point:point,
            DataType:3,
        };

        this.FloatTooltip.Update(sendData);
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


    this.ShowKLineChartTooltip=function(x,y, data)
    {
        if (!this.TooltipKLineChart) return;

        var rtClient=this.UIElement.getBoundingClientRect();
        var rtScroll=GetScrollPosition();

        var offsetLeft=rtClient.left+rtScroll.Left;
        var offsetTop=rtClient.top+rtScroll.Top;

        data.Offset={ Left:offsetLeft, Top:offsetTop };

        this.TooltipKLineChart.Show(data, x,y);
    }

    this.HideKLineChartTooltip=function()
    {
        if (!this.TooltipKLineChart) return;

        this.TooltipKLineChart.Hide();
    }

    this.HideAllTooltip=function()
    {
        this.HideKLineChartTooltip();
        this.HideMinuteChartTooltip();
        this.HideFloatTooltip();
    }


    this.AutoScrollPage=function(step)
    {
        this.AutoDragScrollTimer=setTimeout(() =>
        {
            this.ChartOperator_Temp_ScrollPage(step);
        },300);
    }

    this.ChartOperator_Temp_ScrollPage=function(moveSetp)
    {
        if (!this.EnablePageScroll) return;
        var reportChart=this.GetReportChart() 
        if (!reportChart) return;

        if (moveSetp>0)
        {
            var pageStatus=reportChart.GetCurrentPageStatus();
            if (pageStatus.IsEnd) return;

            this.MoveYOffset(moveSetp, false);
            ++moveSetp;
        }
        else if (moveSetp<0)
        {
            if (this.Data.YOffset<=0) return;

            this.MoveYOffset(moveSetp, false);
            --moveSetp;
        }
        else
        {
            return;
        }

        this.Draw();

        if (!this.EnablePageScroll) return;

        this.AutoScrollPage(moveSetp);

        return;
    }


    //清空画布
    this.ClearCanvas=function(canvas)
    {
        if (!canvas) return;
        if (!this.UIElement) return;

        canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
    }

    //清空固定行数据
    this.ClearFixedRowData=function()
    {
        this.FixedRowData.Data=[];
        this.FixedRowData.Symbol=[];
    }

    //设置固定行
    this.SetFixedRowCount=function(value)
    {
        var chart=this.GetReportChart();
        if (!chart) return;

        chart.FixedRowCount=value;
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
        this.Frame=new JSReportFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;

        //创建表格
        var chart=new ChartReport();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetStockDataCallback=(symbol)=>{ return this.GetStockData(symbol);}
        chart.GetBlockDataCallback=(symbol)=>{ return this.GetBlockData(symbol);}
        chart.GetFlashBGDataCallback=(symbol, time)=>{ return this.GetFlashBGData(symbol, time); }
        chart.Data=this.Data;
        chart.GlobalOption=this.GlobalOption;
        chart.FixedRowData=this.FixedRowData;
        chart.SortInfo=this.SortInfo;

        chart.Tab=new ChartReportTab();
        chart.Tab.Frame=this.Frame;
        chart.Tab.Canvas=this.Canvas;
        chart.Tab.ChartBorder=this.Frame.ChartBorder;
        chart.Tab.Report=chart;

        chart.VScrollbar=new ChartVScrollbar();
        chart.VScrollbar.Frame=this.Frame;
        chart.VScrollbar.Canvas=this.Canvas;
        chart.VScrollbar.ChartBorder=this.Frame.ChartBorder;
        chart.VScrollbar.Report=chart;
        chart.VScrollbar.IsShowCallback=()=>
        { 
            if (this.DragYScroll) return true;
            return this.IsShowVScrollbar;
        }

        this.ChartPaint[0]=chart;

        //页脚
        if (option && option.PageInfo===true)
        {
            var pageInfoChart=new ChartReportPageInfo();
            pageInfoChart.Frame=this.Frame;
            pageInfoChart.ChartBorder=this.Frame.ChartBorder;
            pageInfoChart.Canvas=this.Canvas;
            pageInfoChart.Report=chart;
            this.ChartPaint[1]=pageInfoChart;
        }
        
        if (option)
        {
            if (IFrameSplitOperator.IsBool(option.IsShowHeader)) chart.IsShowHeader=option.IsShowHeader;    //是否显示表头
            if (IFrameSplitOperator.IsNumber(option.FixedColumn)) chart.FixedColumn=option.FixedColumn;     //固定列

            if (IFrameSplitOperator.IsNumber(option.BorderLine)) this.Frame.BorderLine=option.BorderLine;   //边框
            if (IFrameSplitOperator.IsBool(option.TabShow)) chart.Tab.IsShow=option.TabShow;
            if (IFrameSplitOperator.IsNumber(option.FixedRowCount)) chart.FixedRowCount=option.FixedRowCount;   //固定行
            if (IFrameSplitOperator.IsBool(option.ItemBorder)) chart.IsDrawBorder=option.ItemBorder;            //单元格边框
            if (IFrameSplitOperator.IsNumber(option.SelectedModel)) chart.SelectedModel=option.SelectedModel;
            if (IFrameSplitOperator.IsNumber(option.HeaderRowCount)) chart.HeaderRowCount=option.HeaderRowCount;

            if (IFrameSplitOperator.IsNonEmptyArray(option.FixedSymbol))
            {
                chart.FixedRowCount=0;
                this.FixedRowData.Type=1;
                this.FixedRowData.Symbol=[];
                var aryData=option.FixedSymbol;
                for(var i=0; i<aryData.length; ++i)
                {
                    var item=aryData[i];
                    this.FixedRowData.Symbol.push(item.Symbol);
                    ++chart.FixedRowCount;
                }
            }
        }

        var bRegisterKeydown=true;
        var bRegisterWheel=true;

        if (option)
        {
            if (option.KeyDown===false) 
            {
                bRegisterKeydown=false;
                JSConsole.Chart.Log('[JSDealChartContainer::Create] not register keydown event.');
            }

            if (option.Wheel===false) 
            {
                bRegisterWheel=false;
                JSConsole.Chart.Log('[JSDealChartContainer::Create] not register wheel event.');
            }
        }

        if (bRegisterKeydown) this.UIElement.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true);            //键盘消息
        if (bRegisterWheel) this.UIElement.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true);                  //上下滚动消息

        
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.onmouseup=(e)=>{ this.UIOnMounseUp(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        

        //手机拖拽
        this.UIElement.ontouchstart=(e)=> { this.OnTouchStart(e); } 
        this.UIElement.ontouchmove=(e)=> {this.OnTouchMove(e); }
        this.UIElement.ontouchend=(e)=> {this.OnTouchEnd(e); } 
    }

    this.Draw=function()
    {
        if (this.UIElement.width<=0 || this.UIElement.height<=0) return; 

        this.Canvas.clearRect(0,0,this.UIElement.width,this.UIElement.height);
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        this.Canvas.lineWidth=pixelTatio;       //手机端需要根据分辨率比调整线段宽度
        this.LastMouseStatus.MouseOnStatus=null;

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
                item.Draw(this.LastMouseStatus);
        }

        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw(this.LastMouseStatus);
        }

        if (this.GlobalOption.FlashBGCount>0)
        {
            this.DelayDraw(500);
        }
    }

    this.DelayDraw=function(frequency)
    {
        if (typeof (this.FlashBGTimer) == 'number') 
        {
            clearTimeout(this.FlashBGTimer);
            this.FlashBGTimer = null;
        }

        this.FlashBGTimer=setTimeout(()=> 
        { 
            this.Draw(); 
        },frequency);
    }

    this.ResetReportStatus=function()
    {
        this.Data.XOffset=0;
        this.Data.YOffset=0;
    }

    this.ResetReportSelectStatus=function()
    {
        var chart=this.GetReportChart();
        if (chart)
        {
            chart.SelectedRow=-1;
            chart.SelectedFixedRow=-1;
            chart.MultiSelectedRow=[];
        } 
    }

    this.ClearData=function()
    {
        this.SourceData.Data=[];
        this.Data.Data=[];
        this.Data.Virtual.Count=0;
        this.BlockData=new Map(); 
    }

    this.ClearMapStockData=function()
    {
        this.MapStockData=new Map();
    }

    this.ResetSortStatus=function()
    {
        this.SortInfo.Field=-1;
        this.SortInfo.Sort=0;
    }

    this.SetSelectedRow=function(option)
    {
        var reportChart=this.GetReportChart();
        if (!reportChart) return false;

        if (!reportChart.SetSelectedRow(option)) return false;

        this.Draw();
    }

    //设置股票列表
    this.SetSymbolList=function(arySymbol, option)
    {
        this.ClearData();
        this.ResetReportStatus();
        this.ResetSortStatus();
        
        if (IFrameSplitOperator.IsNonEmptyArray(arySymbol))
        {
            for(var i=0;i<arySymbol.length;++i)
            {
                this.Data.Data.push(arySymbol[i]);
            }
        }

        var chart=this.ChartPaint[0];
        if (chart) chart.Data=this.Data;

        this.Draw();
    }

    this.ChangeSymbol=function(symbol, option)
    {
        this.Symbol=symbol;
        this.ClearData();
        this.ResetReportStatus();
        this.ResetSortStatus();
        this.ResetReportSelectStatus();

        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.TabSelected))
            {
                var chartTab=this.GetTabChart();
                if (chartTab) chartTab.SelectedTabIndex=option.TabSelected;
            }

            if (Array.isArray(option.FixedSymbol))
            {
                var chart=this.GetReportChart();
                if (chart)
                {
                    chart.FixedRowCount=0;
                    this.FixedRowData.Type=1;
                    this.FixedRowData.Symbol=[];
                    var aryData=option.FixedSymbol;
                    for(var i=0; i<aryData.length; ++i)
                    {
                        var item=aryData[i];
                        this.FixedRowData.Symbol.push(item.Symbol);
                        ++chart.FixedRowCount;
                    }

                    this.SetSizeChange(true);
                }
            }

            if (option.SortInfo)
            {
                var item=option.SortInfo;
                if (IFrameSplitOperator.IsNumber(item.Field)) this.SortInfo.Field=item.Field;
                if (IFrameSplitOperator.IsNumber(item.Sort)) this.SortInfo.Sort=item.Sort;
            }

            if (IFrameSplitOperator.IsBool(option.IsReloadStockList) && option.IsReloadStockList)
            {
                var requestOption={ Callback:null };
                if (this.Symbol) requestOption.Callback=()=>{ this.RequestMemberListData(); };
                this.MapStockData=new Map();
                this.RequestStockListData(requestOption);
                return;
            }
                
        }

        this.RequestMemberListData();
    }

    //更新数据
    this.UpdateFullData=function(data)
    {
        var arySymbol=[];   
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            //0=证券代码 1=股票名称
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var symbol=item[0];
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQReportItem();
                    stock.OriginalSymbol=symbol;
                    this.MapStockData.set(symbol, stock);
                    
                }

                stock.Symbol=this.GetSymbolNoSuffix(symbol);
                stock.Name=item[1];
                this.ReadStockJsonData(stock, item);
                arySymbol.push(symbol);
            }
        }

        //设置显示数据
        this.Data.Data=[];
        this.SourceData.Data=[];
        if (IFrameSplitOperator.IsNonEmptyArray(arySymbol))
        {
            for(var i=0;i<arySymbol.length;++i)
            {
                this.Data.Data.push(arySymbol[i]);
                this.SourceData.Data.push(arySymbol[i]);
            }
        }

        this.Draw();
    }

    //设置全部的数据
    this.SetFullData=function(data)
    {
        this.ClearMapStockData();
        this.ClearData();
        this.ResetReportStatus();
        this.ResetSortStatus();
        this.ResetReportSelectStatus();

        this.UpdateFullData(data);

        /*
        //缓存所有数据
        var arySymbol=[];
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            //0=证券代码 1=股票名称
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var symbol=item[0];
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQReportItem();
                    stock.OriginalSymbol=symbol;
                    this.MapStockData.set(symbol, stock);
                }

                stock.Symbol=this.GetSymbolNoSuffix(symbol);
                stock.Name=item[1];
                this.ReadStockJsonData(stock, item);

                arySymbol.push(symbol);
            }
        }

        //设置显示数据
        if (IFrameSplitOperator.IsNonEmptyArray(arySymbol))
        {
            for(var i=0;i<arySymbol.length;++i)
            {
                this.Data.Data.push(arySymbol[i]);
                this.SourceData.Data.push(arySymbol[i]);
            }
        }

        this.Draw();
        */
    }

    this.RequestMemberListData=function()
    {
        //this.ChartSplashPaint.SetTitle(this.SplashTitle.MemberList);
        //this.ChartSplashPaint.EnableSplash(true);
        //this.Draw();

        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSReportChartContainer::RequestMemberListData', //类名::
                Explain:'板块成分数据',
                Request:{ Data: { symbol: this.Symbol } }, 
                Self:this,
                PreventDefault:false
            };

            if (this.SortInfo.Field>=0 && this.SortInfo.Sort>0)
            {
                var reportChart=this.GetReportChart();
                if (reportChart)
                {
                    var column=reportChart.Column[this.SortInfo.Field];
                    obj.Sort={ Column:column, Field:this.SortInfo.Field, Sort:this.SortInfo.Sort} ;
                }
            }

            this.NetworkFilter(obj, function(data) 
            { 
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvMemberListData(data);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        //throw { Name:'JSReportChartContainer::RequestMemberListData', Error:'(板块成分数据)不提供内置测试数据' };
    }

    this.RecvMemberListData=function(recvData)
    {
        this.ClearData();

        if (IFrameSplitOperator.IsNonEmptyArray(recvData.data))
        {
            for(var i=0;i<recvData.data.length;++i)
            {
                this.Data.Data.push(recvData.data[i]);
                this.SourceData.Data.push(recvData.data[i]);
            }
        }

        if (recvData.Virtual)   //虚拟表设置
        {
            var item=recvData.Virtual;
            if (IFrameSplitOperator.IsNumber(item.Count)) this.Data.Virtual.Count=item.Count;
        }

        this.Draw();
        this.UpdateStockData();
    }

    //删除股票
    this.DeleteSymbol=function(arySymbol, option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(arySymbol)) return false;

        var setSymbol=new Set(arySymbol);
        var bFinder=false;
        if (IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data))
        {
            var aryData=[];
            for(var i=0;i<this.SourceData.Data.length;++i)
            {
                var item=this.SourceData.Data[i];
                if (setSymbol.has(item)) 
                {
                    bFinder=true;
                    continue;
                }
                aryData.push(item);
            }

            if (bFinder) this.SourceData.Data=aryData;
        }

        if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Data))
        {
            var aryData=[];
            for(var i=0;i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                if (setSymbol.has(item)) 
                {
                    bFinder=true;
                    continue;
                }
                aryData.push(item);
            }

            if (bFinder) this.Data.Data=aryData;
        }

        if (!bFinder) return false;
        
        this.Draw();
        this.UpdateStockData();

        return true;
    }

    //添加股票
    this.AddSymbol=function(arySymbol, option)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(arySymbol)) return false;

        var bDuplicate=true;
        if (option && IFrameSplitOperator.IsBool(option.Duplicate)) bDuplicate=option.Duplicate; //是否去重

        var mapSymbol=new Map();
        for(var i=0;i<arySymbol.length;++i)
        {
            var item={ Symbol:arySymbol[i], IsExist:false, IsExist2:false };
            mapSymbol.set(item.Symbol, item);
        }

        if (bDuplicate)
        {
            if (IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data))
            {
                for(var i=0;i<this.SourceData.Data.length;++i)
                {
                    var item=this.Data.Data[i];
                    if (mapSymbol.has(item))
                    {
                        mapSymbol.get(item).IsExist=true;
                    }
                }
            }

            if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Data))
            {
                for(var i=0;i<this.Data.Data.length;++i)
                {
                    var item=this.Data.Data[i];
                    if (mapSymbol.has(item))
                    {
                        mapSymbol.get(item).IsExist2=true;
                    }
                }
            }
        }

        for(var mapItem of mapSymbol)
        {
            var item=mapItem[1];
            if (!item.IsExist) this.SourceData.Data.push(item.Symbol);
            if (!item.IsExist2) this.Data.Data.push(item.Symbol);
        }

        this.Draw();
        this.UpdateStockData();

        return true;
    }

    //下载码表
    this.RequestStockListData=function(option)
    {
        this.ChartSplashPaint.SetTitle(this.SplashTitle.StockList);
        this.ChartSplashPaint.EnableSplash(true);
        this.Draw();

        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSReportChartContainer::RequestStockListData', //类名::
                Explain:'码表数据',
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvStockListData(data,option);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        //throw { Name:'JSReportChartContainer::RequestStockListData', Error:'(码表数据)不提供内置测试数据' };
    }

    this.RecvStockListData=function(data, option)
    {
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            //0=证券代码 1=股票名称
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var symbol=item[0];
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQReportItem();
                    stock.OriginalSymbol=symbol;
                    this.MapStockData.set(symbol, stock);
                }

                stock.Symbol=this.GetSymbolNoSuffix(symbol);
                stock.Name=item[1];
                if (IFrameSplitOperator.IsNumber(item[88])) stock.PriceColorType=item[88];
                this.ReadStockJsonData(stock, item);
            }
        }

        if (option && option.Callback)
        {
            option.Callback();
            return;
        }

        this.Draw();
        
        this.UpdateStockData();
    }

    //更新股票数据
    this.UpdateMapStockData=function(data)
    {
        if (!data || !IFrameSplitOperator.IsNonEmptyArray(data.data)) return;
        
        //0=证券代码 1=股票名称
        for(var i=0;i<data.data.length;++i)
        {
            var item=data.data[i];
            var symbol=item[0];
            var stock=null;
            if (this.MapStockData.has(symbol))
            {
                stock=this.MapStockData.get(symbol);
            }
            else
            {
                stock=new HQReportItem();
                stock.OriginalSymbol=symbol;
                this.MapStockData.set(symbol, stock);
            }
            
            stock.Symbol=this.GetSymbolNoSuffix(symbol);
            stock.Name=item[1];
            this.ReadStockJsonData(stock, item);
        }
    }

    //获取个股数据
    this.GetStockData=function(symbol)
    {
        if (!this.MapStockData) return null;
        if (!this.MapStockData.has(symbol)) return null;
        
        return this.MapStockData.get(symbol);
    }

    this.GetBlockData=function(symbol)
    {
        if (!this.BlockData) return null;
        if (!this.BlockData.has(symbol)) return null;

        return this.BlockData.get(symbol);
    }

    //obj={ ID:, Color: , Time:, Count: }
    this.SetFlashBGItem=function(symbol, obj)
    {
        var item={ ID:obj.ID, Color:obj.Color, Count:1 };
        if (IFrameSplitOperator.IsNumber(obj.Count)) item.Count=obj.Count;
        if (IFrameSplitOperator.IsNumber(obj.Time)) item.Time=obj.Time;
        else item.Time=Date.now();

        if (this.FlashBG.has(symbol))
        {
            var stockItem=this.FlashBG.get(symbol);
            stockItem.LastTime=item.Time;
            stockItem.Data.set(item.ID, item);
        }
        else
        {
            var stockItem={ LastTime:item.Time,  Data:new Map([ [item.ID, item ] ])  };
            this.FlashBG.set(symbol, stockItem);
        }
    }

    this.GetFlashBGData=function(symbol, time)
    {
        if (!this.FlashBG) return null;
        if (!this.FlashBG.has(symbol)) return null;

        var timeDiff=3*1000;
        var stockItem=this.FlashBG.get(symbol);
        if (time-stockItem.LastTime>=timeDiff)   //超时的删除
        {
            this.FlashBG.delete(symbol);
            return null;
        }

        if (!stockItem.Data || stockItem.Data.size<=0) 
        {
            this.FlashBG.delete(symbol);
            return null;
        }

        var aryDelID=[];    //超时需要参数的
        for(var mapItem of stockItem.Data)
        {
            var item=mapItem[1];
            if (time-item.Time>=timeDiff || item.Count<=0) 
                aryDelID.push(item.ID);
        }

        if (IFrameSplitOperator.IsNonEmptyArray(aryDelID))
        {
            for(var i=0; i<aryDelID.length; ++i)
            {
                stockItem.Data.delete(aryDelID[i]);
            }

            if (stockItem.Data.size<=0)
            {
                this.FlashBG.delete(symbol);
                return null;
            }
        }

        return stockItem;
    }

    //delay=是否延迟
    this.DelayUpdateStockData=function()
    {
        if (this.DelayUpdateTimer!=null) 
        {
            clearTimeout(this.DelayUpdateTimer);
            this.DelayUpdateTimer = null;
        }

        var frequency=this.DelayUpdateFrequency;
        this.DelayUpdateTimer=setTimeout(()=> 
        { 
            this.UpdateStockData();

        },frequency);
    }

    this.UpdateStockData=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        var chart=this.ChartPaint[0];
        if (!chart) return;

        if (this.Data.Virtual && this.Data.Virtual.Enable)
        {
            this.RequestVirtualStockData(); //虚拟表格 全部取后台
            return;
        }

        if (this.SortInfo && this.SortInfo.Field>=0 && this.SortInfo.Sort>0)
        {
            var column=chart.Column[this.SortInfo.Field];
            if (column.Sort==2)
            {
                this.RequestStockSortData(column, this.SortInfo.Field, this.SortInfo.Sort);   //远程排序
                return;
            }
        }

        var arySymbol=chart.ShowSymbol;
        if (!IFrameSplitOperator.IsNonEmptyArray(arySymbol)) return;
        this.RequestStockData(arySymbol);
    }

    //下载股票数据
    this.RequestStockData=function(arySymbol)
    {
        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSDealChartContainer::RequestStockData', //类名::函数名
                Explain:'报价列表股票数据',
                Request:{ Data: { stocks: arySymbol } , symbol:this.Symbol, name:this.Name }, 
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvStockData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;  
        }

        //throw { Name:'JSReportChartContainer::RequestStockData', Error:'(报价列表股票数据)不提供内置测试数据' };
    }

    this.RecvStockData=function(data)
    {
        var setUpdateSymbol=new Set(); //更新的股票列表
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            //0=证券代码 1=股票名称 2=昨收 3=开 4=高 5=低 6=收 7=成交量 8=成交金额, 9=买价 10=买量 11=卖价 12=卖量 13=均价 14=流通股 15=总股本
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var symbol=item[0];
                if (!symbol) continue;
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQReportItem();
                    stock.OriginalSymbol=symbol;
                    stock.Symbol=this.GetSymbolNoSuffix(symbol);
                    this.MapStockData.set(symbol, stock);
                }

                this.ReadStockJsonData(stock, item);

                if (!setUpdateSymbol.has(symbol)) setUpdateSymbol.add(symbol);
            }
        }

        var chart=this.ChartPaint[0];
        if (!chart) return;

        var bUpdate=false;
        //实时本地数据排序
        var chart=this.ChartPaint[0];
        if (chart && this.SortInfo.Sort==1 && IFrameSplitOperator.IsNumber(this.SortInfo.Field) && this.SortInfo.Field>=0)
        {
            var column=chart.Column[this.SortInfo.Field];
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_LOCAL_SORT);
            if (event && event.Callback)
            {
                var sendData={ Column:column, SortInfo:this.SortInfo, SymbolList:this.Data.Data, Result:null };
                event.Callback (event, sendData, this);
                if (Array.isArray(sendData.Result)) this.Data.Data=sendData.Result;
            }
            else
            {
                this.Data.Data.sort((left, right)=> { return this.LocalSort(left, right, column, this.SortInfo.Sort); });
            }

            bUpdate=true;   //排序暂时每次都刷新
        }
        else
        {
            //更新的股票在当前页面,需要重绘
            var aryStock=chart.ShowSymbol;
            for(var i=0;i<aryStock.length;++i)
            {
                if (setUpdateSymbol.has(aryStock[i].Symbol))
                {
                    bUpdate=true;
                    break;
                }
            }
        }

        if (bUpdate) this.Draw();
    }

    //读取单条股票json数据
    this.ReadStockJsonData=function(stock, item)
    {
        //0=证券代码 1=股票名称 2=昨收 3=开 4=高 5=低 6=收 7=成交量 8=成交金额, 9=买价 10=买量 11=卖价 12=卖量 13=均价 14=流通股 15=总股本 16=涨停价 17=跌停价
        //18=内盘 19=外盘 20=现量 21=涨幅% 22=涨跌 23=换手率% 24=振幅% 25=流通市值 26=总市值
        //30=全局扩展数据  31=当前板块扩展数据 36=日期字段

        //88=价格颜色类型

        if (IFrameSplitOperator.IsString(item[1])) stock.Name=item[1];
        if (IFrameSplitOperator.IsNumber(item[2])) stock.YClose=item[2];
        if (IFrameSplitOperator.IsNumber(item[3])) stock.Open=item[3];
        if (IFrameSplitOperator.IsNumber(item[4])) stock.High=item[4];
        if (IFrameSplitOperator.IsNumber(item[5])) stock.Low=item[5];
        if (IFrameSplitOperator.IsNumber(item[6])) stock.Price=item[6];
        if (IFrameSplitOperator.IsNumber(item[7])) stock.Vol=item[7];
        if (IFrameSplitOperator.IsNumber(item[8])) stock.Amount=item[8];

        if (IFrameSplitOperator.IsNumber(item[9])) stock.BuyPrice=item[9];
        if (IFrameSplitOperator.IsNumber(item[10])) stock.BuyVol=item[10];
        if (IFrameSplitOperator.IsNumber(item[11])) stock.SellPrice=item[11];
        if (IFrameSplitOperator.IsNumber(item[12])) stock.SellVol=item[12];
        if (IFrameSplitOperator.IsNumber(item[13])) stock.AvPrice=item[13];          //均价
        if (IFrameSplitOperator.IsNumber(item[14])) stock.OutShares=item[14];        //流通股
        if (IFrameSplitOperator.IsNumber(item[15])) stock.TotalShares=item[15];      //总股本
        if (IFrameSplitOperator.IsNumber(item[16])) stock.LimitHigh=item[16];        //涨停价
        if (IFrameSplitOperator.IsNumber(item[17])) stock.LimitLow=item[17];         //跌停价
        if (IFrameSplitOperator.IsNumber(item[18])) stock.VolIn=item[18];            //内盘
        if (IFrameSplitOperator.IsNumber(item[19])) stock.VolOut=item[19];           //外盘
        if (IFrameSplitOperator.IsNumber(item[20])) stock.DealNum=item[20];          //现量

        if (IFrameSplitOperator.IsNumber(item[21])) stock.Increase=item[21];         //涨幅%
        if (IFrameSplitOperator.IsNumber(item[22])) stock.UpDown=item[22];           //涨跌
        if (IFrameSplitOperator.IsNumber(item[23])) stock.Exchange=item[23];         //换手率%
        if (IFrameSplitOperator.IsNumber(item[24])) stock.Amplitude=item[24];        //振幅%
        if (IFrameSplitOperator.IsNumber(item[25])) stock.CircMarketValue=item[25];  //流通市值
        if (IFrameSplitOperator.IsNumber(item[26])) stock.MarketValue=item[26];      //总市值

        if (item[27]) stock.NameEx=item[27];      //扩展名字

        //衍生数据计算
        if (!IFrameSplitOperator.IsNumber(item[21]))    //涨幅%
        {
            if (IFrameSplitOperator.IsNumber(stock.Price) && IFrameSplitOperator.IsNumber(stock.YClose) && stock.YClose!=0)
                stock.Increase=(stock.Price-stock.YClose)/stock.YClose*100;
        }

        if (!IFrameSplitOperator.IsNumber(item[22]))    //涨跌
        {
            if (IFrameSplitOperator.IsNumber(stock.Price) && IFrameSplitOperator.IsNumber(stock.YClose))
                stock.UpDown=stock.Price-stock.YClose;
        }   

        if (!IFrameSplitOperator.IsNumber(item[23]))    //换手率%
        {
            if (IFrameSplitOperator.IsNumber(stock.Vol) && IFrameSplitOperator.IsNumber(stock.OutShares) && stock.OutShares>0)
                stock.Exchange=stock.Vol/stock.OutShares*100;
        }

        if (!IFrameSplitOperator.IsNumber(item[24]))    //振幅%
        {
            if (IFrameSplitOperator.IsNumber(stock.High) && IFrameSplitOperator.IsNumber(stock.Low) && IFrameSplitOperator.IsNumber(stock.YClose) && stock.YClose!=0)
                stock.Amplitude=(stock.High-stock.Low)/stock.YClose*100;
        }

        if (!IFrameSplitOperator.IsNumber(item[25]))    //流通市值
        {
            if (IFrameSplitOperator.IsNumber(stock.OutShares) && IFrameSplitOperator.IsNumber(stock.Price)) 
                stock.CircMarketValue=stock.OutShares*stock.Price;
        }

        if (!IFrameSplitOperator.IsNumber(item[26]))     //总市值
        {
            if (IFrameSplitOperator.IsNumber(stock.TotalShares) && IFrameSplitOperator.IsNumber(stock.Price)) 
                stock.MarketValue=stock.TotalShares*stock.Price;
        }

        if (item[30]) 
            stock.ExtendData=item[30];                              //30=全局扩展数据

        if (item[31]) 
            this.BlockData.set(stock.OriginalSymbol,item[31]);      //31=当前板块数据

        if (item[32]) stock.CloseLine=item[32];                     //32=收盘价线
        if (item[33]) stock.KLine=item[33];                         //33=K线

        if (IFrameSplitOperator.IsNumber(item[35])) stock.Time=item[35];    //时间 hhmm / hhmmss / hhmmss.fff
        if (IFrameSplitOperator.IsNumber(item[36])) stock.Date=item[36];    //日期

        if (IFrameSplitOperator.IsBool(item[37])) stock.Checked=item[37];

        if (IFrameSplitOperator.IsNumber(item[38])) stock.Position=item[38];        //持仓量
        if (IFrameSplitOperator.IsNumber(item[39])) stock.FClose=item[39];          //结算价
        if (IFrameSplitOperator.IsNumber(item[40])) stock.YFClose=item[40];         //昨结算价
        if (IFrameSplitOperator.IsNumber(item[41])) stock.OpenPosition=item[41];    //开仓量
        if (IFrameSplitOperator.IsNumber(item[42])) stock.ClosePosition=item[42];   //平仓量

        //1,3,5,10,15 涨速%
        if (IFrameSplitOperator.IsNumber(item[43])) stock.RSpeed1M=item[43]; 
        if (IFrameSplitOperator.IsNumber(item[44])) stock.RSpeed3M=item[44]; 
        if (IFrameSplitOperator.IsNumber(item[45])) stock.RSpeed5M=item[45]; 
        if (IFrameSplitOperator.IsNumber(item[46])) stock.RSpeed10M=item[46]; 
        if (IFrameSplitOperator.IsNumber(item[47])) stock.RSpeed15M=item[47]; 

        //10个数值型 101-199
        if (IFrameSplitOperator.IsNumber(item[101])) stock.ReserveNumber1=item[101];
        if (IFrameSplitOperator.IsNumber(item[102])) stock.ReserveNumber2=item[102];
        if (IFrameSplitOperator.IsNumber(item[103])) stock.ReserveNumber3=item[103];
        if (IFrameSplitOperator.IsNumber(item[104])) stock.ReserveNumber4=item[104];
        if (IFrameSplitOperator.IsNumber(item[105])) stock.ReserveNumber5=item[105];
        if (IFrameSplitOperator.IsNumber(item[106])) stock.ReserveNumber6=item[106];
        if (IFrameSplitOperator.IsNumber(item[107])) stock.ReserveNumber7=item[107];
        if (IFrameSplitOperator.IsNumber(item[108])) stock.ReserveNumber8=item[108];
        if (IFrameSplitOperator.IsNumber(item[109])) stock.ReserveNumber9=item[109];
        if (IFrameSplitOperator.IsNumber(item[110])) stock.ReserveNumber10=item[110];

        //10个字符型 201-299
        if (IFrameSplitOperator.IsString(item[201])) stock.ReserveString1=item[201];
        if (IFrameSplitOperator.IsString(item[202])) stock.ReserveString2=item[202];
        if (IFrameSplitOperator.IsString(item[203])) stock.ReserveString3=item[203];
        if (IFrameSplitOperator.IsString(item[204])) stock.ReserveString4=item[204];
        if (IFrameSplitOperator.IsString(item[205])) stock.ReserveString5=item[205];
        if (IFrameSplitOperator.IsString(item[206])) stock.ReserveString6=item[206];
        if (IFrameSplitOperator.IsString(item[207])) stock.ReserveString7=item[207];
        if (IFrameSplitOperator.IsString(item[208])) stock.ReserveString8=item[208];
        if (IFrameSplitOperator.IsString(item[209])) stock.ReserveString9=item[209];
        if (IFrameSplitOperator.IsString(item[210])) stock.ReserveString10=item[210];

        //10个进度条 301-350  { Value:, BGColor: }
        if (IFrameSplitOperator.IsNumber(item[301]) || IFrameSplitOperator.IsObject(item[301])) stock.ReserveProgressBar1=item[301];
        if (IFrameSplitOperator.IsNumber(item[302]) || IFrameSplitOperator.IsObject(item[302])) stock.ReserveProgressBar2=item[302];
        if (IFrameSplitOperator.IsNumber(item[303]) || IFrameSplitOperator.IsObject(item[303])) stock.ReserveProgressBar3=item[303];
        if (IFrameSplitOperator.IsNumber(item[304]) || IFrameSplitOperator.IsObject(item[304])) stock.ReserveProgressBar4=item[304];
        if (IFrameSplitOperator.IsNumber(item[305]) || IFrameSplitOperator.IsObject(item[305])) stock.ReserveProgressBar5=item[305];
        if (IFrameSplitOperator.IsNumber(item[306]) || IFrameSplitOperator.IsObject(item[306])) stock.ReserveProgressBar6=item[306];
        if (IFrameSplitOperator.IsNumber(item[307]) || IFrameSplitOperator.IsObject(item[307])) stock.ReserveProgressBar7=item[307];
        if (IFrameSplitOperator.IsNumber(item[308]) || IFrameSplitOperator.IsObject(item[308])) stock.ReserveProgressBar8=item[308];
        if (IFrameSplitOperator.IsNumber(item[309]) || IFrameSplitOperator.IsObject(item[309])) stock.ReserveProgressBar9=item[309];
        if (IFrameSplitOperator.IsNumber(item[310]) || IFrameSplitOperator.IsObject(item[310])) stock.ReserveProgressBar10=item[310];

        //10个按钮 351-400 { Title, Enable:, BGColor, TextColor: }
        if (IFrameSplitOperator.IsObject(item[351])) stock.ReserveButton1=item[351];
        if (IFrameSplitOperator.IsObject(item[352])) stock.ReserveButton2=item[352];
        if (IFrameSplitOperator.IsObject(item[353])) stock.ReserveButton3=item[353];
        if (IFrameSplitOperator.IsObject(item[354])) stock.ReserveButton4=item[354];
        if (IFrameSplitOperator.IsObject(item[355])) stock.ReserveButton5=item[355];
        if (IFrameSplitOperator.IsObject(item[356])) stock.ReserveButton6=item[356];
        if (IFrameSplitOperator.IsObject(item[357])) stock.ReserveButton7=item[357];
        if (IFrameSplitOperator.IsObject(item[358])) stock.ReserveButton8=item[358];
        if (IFrameSplitOperator.IsObject(item[359])) stock.ReserveButton9=item[359];
        if (IFrameSplitOperator.IsObject(item[360])) stock.ReserveButton10=item[360];
        
    }



    this.GetSymbolNoSuffix=function(symbol)
    {
        var index=symbol.lastIndexOf(".");
        if (index>0) 
            return symbol.substring(0,index);
        else 
            return symbol;
    }

    this.CancelAutoUpdate=function()    //关闭停止更新
    {
        if (typeof (this.AutoUpdateTimer) == 'number') 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    this.AutoUpdate=function(waitTime)  //waitTime 更新时间
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        
        var self = this;
        var marketStatus=2;
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_MARKET_STATUS);
        if (event && event.Callback)
        {
            var sendData={ MarketStatus:2 };
            event.Callback(event, sendData, this);
            if (IFrameSplitOperator.IsNumber(sendData.MarketStatus)) marketStatus=sendData.MarketStatus;
        }
        
        if (marketStatus==0 || marketStatus==3) return; //闭市,盘后

        var frequency=this.AutoUpdateFrequency;
        if (marketStatus==1) //盘前
        {
            this.AutoUpdateTimer=setTimeout(function() 
            { 
                self.AutoUpdate(); 
            },frequency);
        }
        else if (marketStatus==2) //盘中
        {
            this.AutoUpdateTimer=setTimeout(function()
            {
                self.UpdateStockData();
            },frequency);
        }
    }

    this.StopAutoUpdate=function()
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        this.IsAutoUpdate=false;
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

    this.OnSize=function()
    {
        if (!this.Frame) return;

        this.SetSizeChange(true);
        this.Draw();
        this.DelayUpdateStockData();
    }

    this.SetSizeChange=function(bChanged)
    {
        for(var i=0;i<this.ChartPaint.length;++i)
        {
            var chart=this.ChartPaint[i];
            if (chart) chart.SizeChange=bChanged;
        }
    }


    this.OnWheel=function(e)    //滚轴
    {
        JSConsole.Chart.Log('[JSReportChartContainer::OnWheel]',e);
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);
        if (!isInClient) return;

        var chart=this.ChartPaint[0];
        if (!chart) return;

        var wheelValue=e.wheelDelta;
        if (!IFrameSplitOperator.IsObjectExist(e.wheelDelta))
            wheelValue=e.deltaY* -0.01;

        if (this.WheelPageType==1)
        {
            console.log(`[OnWheel] wheelValue=${wheelValue}`);
            if (wheelValue<0)   //下
            {
                this.LastMouseStatus.TooltipStatus=null;
                this.HideAllTooltip();
                if (this.GotoNextItem(1))
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
            }
            else if (wheelValue>0)  //上
            {
                this.LastMouseStatus.TooltipStatus=null;
                this.HideAllTooltip();
                if (this.GotoNextItem(-1))
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
            }
        }
        else
        {
            if (wheelValue<0)   //下一页
            {
                this.LastMouseStatus.TooltipStatus=null;
                this.HideAllTooltip();
                if (this.GotoNextPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
            }
            else if (wheelValue>0)  //上一页
            {
                this.LastMouseStatus.TooltipStatus=null;
                this.HideAllTooltip();
                if (this.GotoPreviousPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
            }
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnKeyDown=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        var keyID = e.keyCode ? e.keyCode :e.which;

         //回调事件
         var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_KEYDOWN);
         if (event && event.Callback)
         {
             var sendData={ e:e, KeyID:keyID, PreventDefault:false, ReportChart:reportChart };
             event.Callback(event, sendData, this);
             if (sendData.PreventDefault) return;
         }

        if (keyID==116) return; //F15刷新不处理

        this.HideAllTooltip();
        switch(keyID)
        {
            case 33:    //page up
                if (this.GotoPreviousPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
                break;
            case 34:    //page down
                if (this.GotoNextPage(this.PageUpDownCycle)) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
                break;
            case 38:    //up
                var result=this.MoveSelectedRow(-1, {EnablePageCycle: this.PageUpDownCycle});
                if (result)
                {
                    if (result.Redraw) this.Draw();
                    if (result.Update) this.DelayUpdateStockData();
                    this.MoveSelectedRowEvent(result.OldIndex, result.NewIndex);
                }
                break;
            case 40:    //down
                var result=this.MoveSelectedRow(1, {EnablePageCycle: this.PageUpDownCycle})
                if (result)
                {
                    if (result.Redraw) this.Draw();
                    if (result.Update) this.DelayUpdateStockData();
                    this.MoveSelectedRowEvent(result.OldIndex, result.NewIndex);
                }
                break;
            case 37: //left
                if (this.MoveXOffset(-1)) this.Draw();
                break
            case 39: //right
                if (this.MoveXOffset(1)) this.Draw();
                break;
        }

        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.UIOnDblClick=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (chart) chart.OnDblClick(x,y,e);
    }

    this.UIOnMouseDown=function(e)
    {
        this.DragXScroll=null;
        this.DragYScroll=null;
        this.DragHeader=null;
        this.DragColumnWidth=null;
        this.DragMove={ Click:{ X:e.clientX, Y:e.clientY }, Move:{X:e.clientX, Y:e.clientY}, PreMove:{X:e.clientX, Y:e.clientY } };

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (chart) 
        {
            var dragColumnWidth=chart.PtInHeaderDragBorder(x,y)
            if (dragColumnWidth)
            {
                this.DragColumnWidth=
                {
                    ClickPoint:{ X:x, Y:y }, 
                    LastPoint:{ X:x, Y:y },
                    //Click:{ X:e.clientX, Y:e.clientY }, 
                    //LastMove:{ X:e.clientX, Y:e.clientY}, 
                    ClickData:dragColumnWidth,
                    ColumnWidth:dragColumnWidth.Column.Width
                };
            }
            else
            {
                var clickData=chart.OnMouseDown(x,y,e);
                if (!clickData) return;
                //if (e.button!=0) return;

                if ((clickData.Type==2 || clickData.Type==4) && (e.button==0 || e.button==2))  //点击行|固定行
                {
                    if (e.button==0 && clickData.Type==2)
                    {
                        if (this.EnableDragRow && this.SortInfo.Sort<=0)
                        {
                            this.DragRow={ Click:{ X:e.clientX, Y:e.clientY }, LastMove:{ X:e.clientX, Y:e.clientY} , Data:clickData };
                        }
                    }

                    if (clickData.Redraw==true)
                        this.Draw();
                }
                else if (clickData.Type==3 && e.button==0) //表头
                {
                    this.DragHeader={ 
                        ClickPoint:{ X:x, Y:y }, Click:{ X:e.clientX, Y:e.clientY }, 
                        ClickData:clickData, 
                        LastMove:{ X:e.clientX, Y:e.clientY}, MovePoint:null,
                        MoveToData:null 
                    };
                }
                else if (clickData.Type==1 && e.button==0) //底部工具栏
                {
                    var tabData=clickData.Tab;
                    if (tabData.Type==1)    //左按钮
                    {
                        if (this.MoveXOffset(-1)) this.Draw();
                    }
                    else if (tabData.Type==2)   //右按钮
                    {
                        if (this.MoveXOffset(1)) this.Draw();
                    }
                    else if (tabData.Type==3)   //滚动条
                    {
                        this.DragXScroll={ Click:{X:x, Y:y}, LastMove:{X:x, Y:y} };
                    }
                    else if (tabData.Type==4)   //滚动条内部
                    {
                        if (this.SetXOffset(tabData.Pos)) this.Draw();
                    }
                    else if (tabData.Type==5)   //标签
                    {
                        this.OnClickTab(tabData, e);
                    }
                }
                else if (clickData.Type==5 && e.button==0)  //右侧滚动条
                {
                    var scroll=clickData.VScrollbar;
                    if (scroll.Type==1) //顶部按钮
                    {
                        if (this.MoveYOffset(-1)) 
                        {
                            this.Draw();
                            this.DelayUpdateStockData();
                        }
                    }
                    else if (scroll.Type==2)   //底部按钮
                    {
                        if (this.MoveYOffset(1)) 
                        {
                            this.Draw();
                            this.DelayUpdateStockData();
                        }
                    }
                    else if (scroll.Type==3)    //滚动条
                    {
                        this.DragYScroll={ Click:{X:x, Y:y}, LastMove:{X:x, Y:y} };
                    }
                    else if (scroll.Type==4)    //滚动条内部
                    {
                        if (this.SetYOffset(scroll.Pos)) 
                        {
                            this.Draw();
                            this.DelayUpdateStockData();
                        }
                    }
                }
            }
        }

        document.onmousemove=(e)=>{ this.DocOnMouseMove(e); }
        document.onmouseup=(e)=> { this.DocOnMouseUp(e); }
    }

    this.UIOnMounseUp=function(e)
    {
        console.log('"UIOnMounseUp');
    }

    //去掉右键菜单
    this.UIOnContextMenu=function(e)
    {
        e.preventDefault();
        
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        if (!this.IsShowRightMenu) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        if(typeof(this.OnRightMenu)=='function') this.OnRightMenu(x,y,e);   //右键菜单事件
    }

    this.OnRightMenu=function(x,y,e)
    {
        this.PopupRightMenu(x,y,e);
    }


    this.PtInReportChart=function(x,y)  //Type: 2=行  3=表头  4=固定行 
    {
        var chart=this.GetReportChart();
        if (!chart) return null;

        var row=chart.PtInHeader(x,y);
        if (row) return { Type:3, Row:row, X:x, Y:y };

        row=chart.PtInFixedBody(x,y);
        if (row) return { Type:4, Row:row , X:x, Y:y };

        row=chart.PtInBody(x,y);
        if (row) return { Type:2, Row:row , X:x, Y:y };

        return { Type:-1, Row:null, X:x, Y:y  };
    }

    this.PopupRightMenu=function(x,y, e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var data=this.PtInReportChart(x*pixelTatio,y*pixelTatio);   //x,y 需要乘以放大倍速
        if (!data) return;
        if (!this.JSPopMenu) return;

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
        JSConsole.Chart.Log('[JSReportChartContainer::OnClickRightMenu] ',data);
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

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        
        var oldMouseOnStatus=this.LastMouseStatus.MouseOnStatus;
        this.LastMouseStatus.OnMouseMove=null;

        var bDrawTooltip=false;
        if (this.LastMouseStatus.TooltipStatus) bDrawTooltip=true;
        this.LastMouseStatus.TooltipStatus=null;

        var bShowKLineTooltip=false;
        var bShowMinuteTooltip=false;
        var chartTooltipData=null;
        
        if (this.DragRow) return;
        if (this.DrawHeader) return;
        if (this.DragColumnWidth) return;

        var tabChart=this.GetTabChart();
        var bDrawTab=false;
        if (tabChart)
        {
            var tabData=tabChart.PtInTab(x,y);
            if (tabData)
            {
                var index=tabData.Index;
                if (tabChart.MoveOnTabIndex!=index)
                {
                    tabChart.MoveOnTabIndex=index;
                    bDrawTab=true;
                }
            }
            else
            {
                if (tabChart.MoveOnTabIndex>=0) 
                {
                    tabChart.MoveOnTabIndex=-1;
                    bDrawTab=true;
                }
                    
            }
        }

        this.LastMouseStatus.OnMouseMove={ X:x, Y:y };
        var mouseStatus={ Cursor:"default", Name:"Default"};;   //鼠标状态
        var report=this.GetReportChart();
        var bDraw=false;
        
        if (report)
        {
            var dragHeaderWidth=report.PtInHeaderDragBorder(x,y);
            if (dragHeaderWidth)
            {
                mouseStatus={ Cursor:"col-resize", Name:"DragHeaderWidth"};
                JSConsole.Chart.Log("[JSReportChartContainer::UIOnMouseMove] drag column width ",dragHeaderWidth);
            }
            else
            {
                var buttonData=report.GetButtonData(x,y);
                var mouseOnStatus=null;
                if (buttonData)
                {
                    mouseStatus={ Cursor:"pointer", Name:"Botton"};
                    if (buttonData.Type==1 || buttonData.Type==0 || buttonData.Type==2)
                    {
                        mouseOnStatus={ Index:buttonData.Index, ColumnIndex:buttonData.ColumnIndex };
                    }
                }

                //console.log("[UIOnMouseMove] ", oldMouseOnStatus, mouseOnStatus)
                if ((!oldMouseOnStatus && mouseOnStatus) || (oldMouseOnStatus && !mouseOnStatus))
                {
                    bDraw=true;
                }
                else if (oldMouseOnStatus && mouseOnStatus)
                {
                    if (oldMouseOnStatus.Index!=mouseOnStatus.Index || oldMouseOnStatus.ColumnIndex!=mouseOnStatus.ColumnIndex)
                        bDraw=true;
                }
                   
                var tooltipData=report.GetTooltipData(x,y);  //单元格提示信息
                if (tooltipData)
                {
                    if (tooltipData.Type==20)
                    {
                        if (tooltipData.Stock && tooltipData.Stock.Symbol)
                        {
                            bShowMinuteTooltip=true;
                            chartTooltipData={ Symbol:tooltipData.Stock.OriginalSymbol, Rect:tooltipData.Rect };
                        }
                    }
                    else if (tooltipData.Type==21)
                    {
                        if (tooltipData.Stock && tooltipData.Stock.Symbol)
                        {
                            bShowKLineTooltip=true;
                            chartTooltipData={ Symbol:tooltipData.Stock.OriginalSymbol, Rect:tooltipData.Rect };
                        }
                    }
                    else
                    {
                        this.LastMouseStatus.TooltipStatus={ X:x, Y:y, Data:tooltipData, ClientX:e.clientX, ClientY:e.clientY };
                        bDrawTooltip=true;
                    }
                }
            }

            var scrollbar=report.VScrollbar;
            if (scrollbar.Enable)
            {
                var bShowScrollbar=report.PtInClient(x,y);
                this.IsShowVScrollbar=bShowScrollbar;
                if (!this.DragYScroll)
                {
                    if (bShowScrollbar && !scrollbar.LastStatus.Draw) bDraw=true;
                    else if (!bShowScrollbar && scrollbar.LastStatus.Draw) bDraw=true;
                }
            }
        }


        /* 目前没有用到
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_MOUSE_MOVE);
        if (event)
        {
            var sendData={X:x, Y:y, Cell:cell };
            event.Callback(event,sendData,this);
        }
        */

        if (mouseStatus) this.UIElement.style.cursor=mouseStatus.Cursor;

        if (bDraw || bDrawTab) this.Draw();

        if (this.LastMouseStatus.TooltipStatus) 
        {
            var xTooltip = e.clientX-this.UIElement.getBoundingClientRect().left;
            var yTooltip = e.clientY-this.UIElement.getBoundingClientRect().top;
            this.DrawFloatTooltip({X:xTooltip, Y:yTooltip, YMove:20/pixelTatio},this.LastMouseStatus.TooltipStatus.Data);
        }
        else
        {
            this.HideFloatTooltip();
        }

        if (!bShowKLineTooltip) this.HideKLineChartTooltip();
        if (!bShowMinuteTooltip) this.HideMinuteChartTooltip();

        if (bShowMinuteTooltip) this.ShowMinuteChartTooltip(null, null, chartTooltipData);
        if (bShowKLineTooltip) this.ShowKLineChartTooltip(null, null, chartTooltipData);

    }

    this.UIOnMounseOut=function(e)
    {
        this.HideAllTooltip();
        
        var bDraw=false;
        var tabChart=this.GetTabChart();
        if (tabChart && tabChart.MoveOnTabIndex>=0)
        {
            tabChart.MoveOnTabIndex=-1;
            bDraw=true;
            this.Draw();
        }

        var scrollbar=this.GetVScrollbarChart();
        if (scrollbar.Enable)
        {
            this.IsShowVScrollbar=false;
            if (!this.DragYScroll)
            {
                if (scrollbar.LastStatus.Draw) bDraw=true;
            }
        }

        if (bDraw) this.Draw();
    }

    this.UIOnMouseleave=function(e)
    {
        this.HideAllTooltip();

        var tabChart=this.GetTabChart();
        if (tabChart && tabChart.MoveOnTabIndex>=0)
        {
            tabChart.MoveOnTabIndex=-1;
            this.Draw();
        }
    }

    this.DocOnMouseMove=function(e)
    {
        this.DragMove.PreMove.X=this.DragMove.Move.X;
        this.DragMove.PreMove.Y=this.DragMove.Move.Y;
        this.DragMove.Move.X=e.clientX;
        this.DragMove.Move.Y=e.clientX;

        if (this.DragMove.Move.X!=this.DragMove.PreMove.X || this.DragMove.Move.Y!=this.DragMove.PreMove.Y)
            this.StopAutoDragScrollTimer();

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        //JSConsole.Chart.Log(`[JSReportChartContainer::DocOnMouseMove] x=${x}, y=${y}`);
        
        if (this.DragRow)
        {
            var drag=this.DragRow;
            var moveSetpY=drag.LastMove.Y-e.clientY;
            if (Math.abs(moveSetpY)<2) return;
            var reportChart=this.GetReportChart();
            drag.LastMove.X=e.clientX;
            drag.LastMove.Y=e.clientY;
            drag.Inside={X:x, Y:y};

            if (reportChart) 
            {
                var moveRow=reportChart.OnDragRow(x,y,e);
                if (moveRow )
                {
                    if (moveRow.Type==2)
                    {
                        if (moveRow.Data.DataIndex!=drag.Data.Row.DataIndex)
                        {
                            drag.MoveRow=moveRow;
                        }
                    }
                    else if (moveRow.Type==7)
                    {
                        var pageStatus=reportChart.GetCurrentPageStatus();
                        if (!pageStatus.IsEnd)
                        {
                            this.MoveYOffset(1, false);
                            drag.MoveRow=null;

                            this.EnablePageScroll=true;
                            this.AutoScrollPage(2);
                        }
                    }
                    else if (moveRow.Type==5)
                    {
                        if (this.Data.YOffset>0)
                        {
                            this.MoveYOffset(-1, false);
                            drag.MoveRow=null;

                            this.EnablePageScroll=true;
                            this.AutoScrollPage(-2);
                        }
                    }
                }
                reportChart.DragRow=drag;
            }

            this.Draw();
        }
        else if (this.DragXScroll)
        {
            var chart=this.ChartPaint[0];
            if (!chart || !chart.Tab) return;

            this.DragXScroll.LastMove.X=x;
            this.DragXScroll.LastMove.Y=y;
            var pos=chart.Tab.GetScrollPostionByPoint(x,y);
            if (this.SetXOffset(pos)) this.Draw();
        }
        else if (this.DragYScroll)
        {
            var chart=this.ChartPaint[0];
            if (!chart || !chart.VScrollbar) return;

            this.DragYScroll.LastMove.X=x;
            this.DragYScroll.LastMove.Y=y;

            var pos=chart.VScrollbar.GetScrollPostionByPoint(x,y);
            if (this.SetYOffset(pos)) 
            {
                this.Draw();
                this.DelayUpdateStockData();
            }
        }
        else if (this.DragHeader && this.DragHeader.ClickData)   //表头拖拽
        {
            if (this.DragHeader.ClickData.Header.IsFixed) return;
            if (!this.EnableDragHeader) return;
            
            var xMove=e.clientX-this.DragHeader.Click.X;
            var yMove=e.clientY-this.DragHeader.Click.Y;
            if ( Math.abs(yMove)<=1 && Math.abs(xMove)<=1) return;

            var reportChart=this.GetReportChart();
            var clickData=this.DragHeader.ClickData;
            this.DragHeader.LastMove.X=e.clientX;
            this.DragHeader.LastMove.Y=e.clientY;
            if (!this.DragHeader.MovePoint) 
            {
                this.DragHeader.MovePoint={ X:x, Y:y };
            }
            else
            {
                this.DragHeader.MovePoint.X=x;
                this.DragHeader.MovePoint.Y=y;
            }

            var moveData=reportChart.OnDragHeader(x,y,e);
            if (!moveData) return;
            if (moveData.Type!=1) return;

            if (moveData.Header.Index!=clickData.Header.Index)
            {
                this.DragHeader.MoveToData=moveData;
            }

            reportChart.DragHeader=this.DragHeader;
            this.Draw();
        }
        else if (this.DragColumnWidth && this.DragColumnWidth.ClickData)    //列宽度拖拽
        {
            var xMove=x-this.DragColumnWidth.ClickPoint.X;
            if (Math.abs(xMove)<1) return;

            var fixedWidth=this.DragColumnWidth.ColumnWidth+xMove;
            if (fixedWidth<=10) return;

            var index=this.DragColumnWidth.ClickData.Index;

            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_DRAG_COLUMN_WIDTH);

            if (event && event.Callback)
            {
                var sendData={ Index:index, Width:fixedWidth, PreventDefault:false };
                if (this.DragColumnWidth && this.DragColumnWidth.ClickData) sendData.Column=this.DragColumnWidth.ClickData.Column
                event.Callback(event, sendData, this);
                if (sendData.PreventDefault) return;
            }

            this.SetColumnFixedWidth(index, fixedWidth);

            this.DragColumnWidth.LastPoint.X=x;
            this.DragColumnWidth.LastPoint.Y=y;
        }
    }

    this.SetColumnFixedWidth=function(index, width)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        var item=chart.Column[index];
        if (!item) return;

        item.FixedWidth=width;
        this.SetSizeChange(true);
        this.Draw();
    }

    this.DocOnMouseUp=function(e)
    {
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null;

        this.StopAutoDragScrollTimer();
        this.HideAllTooltip();
        var reportChart=this.GetReportChart();

        var mouseStatus={ Cursor:"default", Name:"Default"};;   //鼠标状态

        var bRedraw=false;
        if (this.DragRow) 
        { 
            if (reportChart) 
            {
                this.OnDragRow();
                reportChart.DragRow=null;
            }
            bRedraw=true;
        }

        var dragHeader=this.DragHeader;

        this.DragHeader=null;
        this.DragXScroll=null;
        if (this.DragYScroll) 
        {
            bRedraw=true;
            this.DragYScroll=null;
        }
        this.DragRow=null;
        this.DragMove=null;
        this.DragColumnWidth=null;

        if (reportChart.DragHeader)
        {
            bRedraw=true;
            reportChart.DragHeader=null;
        }
        
        if (bRedraw) this.Draw();

        if (dragHeader)
        {
            var clickData=dragHeader.ClickData;
            var moveToData=dragHeader.MoveToData;
            if (clickData && moveToData)
            {
                this.SwapColumn(clickData.Header.Index, moveToData.Header.Index, { Redraw:true });
            }
            else
            {
                this.OnClickHeader(clickData, e);
            }
        }

        if (mouseStatus) this.UIElement.style.cursor=mouseStatus.Cursor;
    }

    this.OnDragRow=function()
    {
        if (!this.SourceData || !IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data)) return;
        if (!this.DragRow || !this.DragRow.MoveRow) return;
        var drag=this.DragRow;
        var srcIndex=drag.Data.Row.DataIndex;
        var moveIndex=drag.MoveRow.Data.DataIndex;
        if (srcIndex==moveIndex || srcIndex<0 || moveIndex<0)  return;

        var data=this.SourceData.Data;
        if (srcIndex>=data.length || moveIndex>=data.length) return;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_DRAG_ROW);
        if (event)
        {
            var sendData=
            { 
                Symbol:this.Symbol,
                Src:{ Index:srcIndex, Symbol:data[srcIndex] },
                To:{ Index:moveIndex, Symbol:data[moveIndex] },
                PreventDefault:false    //PreventDefault 是否阻止内置的点击处理
            };    
            event.Callback(event,sendData,this);
            if (sendData.PreventDefault) return;
        }

        if (this.DragRowType==1)
        {
            //原始数据交换顺序
            var temp=data[srcIndex];
            data[srcIndex]=data[moveIndex];
            data[moveIndex]=temp;
            this.Data.Data=data.slice(0);
        }
        else
        {
            //插入模式
            var srcItem=data[srcIndex];
            data.splice(srcIndex,1);
            data.splice(moveIndex, 0, srcItem);
            this.Data.Data=data.slice(0);
        }

        //更新选中行
        var reportChart=this.GetReportChart();
        if (reportChart)
        {
            if (reportChart.SelectedModel==0)  reportChart.SelectedRow=drag.MoveRow.Data.Index;
            else reportChart.SelectedRow=drag.MoveRow.Data.DataIndex;
        }
    }

    //判断是单个手指
    this.IsPhoneDragging=function(e)
    {
        // JSConsole.Chart.Log(e);
        var changed=e.changedTouches.length;
        var touching=e.touches.length;

        return changed==1 && touching==1;
    }

    this.GetTouchData=function(e)
    {
        var touches=[];
        var pixelTatio = GetDevicePixelRatio(); //获取设备的分辨率
        for(var i=0; i<e.touches.length; ++i)
        {
            var item=e.touches[i];
            var toucheItem=
            { 
                clientX:item.clientX*pixelTatio,
                clientY:item.clientY*pixelTatio, 

                pageX:item.pageX*pixelTatio,
                pageY:item.pageY*pixelTatio,

                //内部相对坐标
                InsideX:(item.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio,
                InsideY:(item.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio
            };

            
            touches.push(toucheItem); 
        }

        return touches;
    }

    this.GetMoveAngle=function(pt,pt2)  //计算角度
    {
        var xMove=Math.abs(pt.X-pt2.X);
        var yMove=Math.abs(pt.Y-pt2.Y);
        var angle=Math.atan(xMove/yMove)*180/Math.PI;
        return angle;
    }

    this.PreventTouchEvent=function(e)
    {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    }

     //手势事件
    this.OnTouchStart=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        this.IsOnTouch=true;

        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        if (this.IsPhoneDragging(e))
        {
            var drag= { "Click":{}, "LastMove":{}, "InsideClick":{}  }; //LastMove 最后移动的位置
            var touches=this.GetTouchData(e);

            drag.Click.X=touches[0].clientX;
            drag.Click.Y=touches[0].clientY;
            drag.InsideClick.X=touches[0].InsideX;
            drag.InsideClick.Y=touches[0].InsideY;
            drag.LastMove.X=touches[0].clientX;
            drag.LastMove.Y=touches[0].clientY;
            drag.IsXMove=false;
            drag.IsYMove=false;


            if (reportChart.IsPtInBody(drag.InsideClick.X,drag.InsideClick.Y))
            {
                this.TouchDrag=drag;
            }

            this.TouchInfo={ InsideClick:{ X:touches[0].InsideX, Y:touches[0].InsideY }, Click:{ X:touches[0].clientX, Y:touches[0].clientY } };
            this.PreventTouchEvent(e);
        }
    }

    this.OnDragYOffset=function(drag, touches, moveUpDown, e)
    {
        if (moveUpDown<5) return false

        var isUp=true;
        if (drag.LastMove.Y<touches[0].clientY) isUp=false;     //Down

        var oneStep=this.YStepPixel;
        if (oneStep<=0) oneStep=5;

        var step=parseInt(moveUpDown/oneStep); 
        if (step<=0) return false

        if (isUp==false) step*=-1;

        if (this.MoveYOffset(step, this.DragPageCycle))
        {
            drag.IsYMove=true;
            this.Draw();
            this.DelayUpdateStockData();
        }

        return true;
    }

    this.OnDragXOffset=function(drag, touches, moveLeftRight, e)
    {
        if (moveLeftRight<5) return false;

        var isLeft=true;
        if (drag.LastMove.X<touches[0].clientX) isLeft=false;//右移数据

        var oneStep=this.XStepPixel;
        if (oneStep<=0) oneStep=5;

        var step=parseInt(moveLeftRight/oneStep);  //除以4个像素
        if (step<=0) return false;

        if (!isLeft) step*=-1;

        if (this.MoveXOffset(step))
        {
            drag.IsXMove=true;
            this.Draw();
        }

        return true;
    }

    this.OnTouchMove=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        var touches=this.GetTouchData(e);
        
        if (this.IsPhoneDragging(e))
        {
            var drag=this.TouchDrag;

            this.TouchInfo.Move={ X:touches[0].clientX, Y:touches[0].clientY };

            if (drag)
            {
                this.PreventTouchEvent(e);

                var moveAngle=this.GetMoveAngle(drag.LastMove,{X:touches[0].clientX, Y:touches[0].clientY});
                var moveLeftRight=Math.abs(drag.LastMove.X-touches[0].clientX);
                var moveUpDown=Math.abs(drag.LastMove.Y-touches[0].clientY);

               
                if (drag.IsYMove==true)
                {
                    this.ShowPageInfo(true);
                    if (!this.OnDragYOffset(drag, touches,moveUpDown, e)) return;
                }
                else if (drag.IsXMove==true)
                {
                    if (!this.OnDragXOffset(drag, touches,moveLeftRight, e)) return;
                }
                else if (moveUpDown>0 && moveAngle<this.TouchMoveMinAngle)
                {
                    this.ShowPageInfo(true);
                    if (!this.OnDragYOffset(drag, touches,moveUpDown, e)) return;
                }
                else if (moveLeftRight>0 && moveAngle>=this.TouchMoveMinAngle)
                {
                    if (!this.OnDragXOffset(drag, touches,moveLeftRight, e)) return;
                }
                else
                {
                    return;
                }

                drag.LastMove.X=touches[0].clientX;
                drag.LastMove.Y=touches[0].clientY;
            }

        }
    }

    this.OnTouchEnd=function(e)
    {
        JSConsole.Chart.Log('[JSReportChartContainer:OnTouchEnd]',e);
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        this.ShowPageInfo(false);
        this.OnTouchClick(this.TouchInfo, e);

        this.IsOnTouch=false;
        this.TouchDrag=null;
        this.TouchInfo=null;
    }

    this.OnTouchClick=function(touchInfo, e)
    {
        if (!touchInfo || !touchInfo.Click) return false;
        if (touchInfo.Move) return false;
        var clickPoint=touchInfo.InsideClick;
        var reportChart=this.GetReportChart();
        if (!reportChart) return false;

        var clickData=reportChart.OnMouseDown(clickPoint.X,clickPoint.Y,e);
        if (!clickData) return false;

        if (clickData.Type==2 || clickData.Type==4)  //点击行
        {
            if (clickData.Redraw==true)
                this.Draw();
        }
        else if (clickData.Type==3) //表头
        {
            this.OnClickHeader(clickData, e);
        }

        JSConsole.Chart.Log('[JSReportChartContainer:OnTouchClick] clickData', clickData);
    }

    this.GetTabChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;
        
        return chart.Tab;
    }

    this.GetVScrollbarChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;

        return chart.VScrollbar;
    }

    this.GetReportChart=function()
    {
        var chart=this.ChartPaint[0];
        return chart;
    }

    this.GotoNextItem=function(step)
    {
        if (step==0) return false;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;
        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;

        var moveCount=0;
        if (step>0)
        {
            for(var i=0;i<step;++i)
            {
                if (this.Data.YOffset+pageSize>=this.Data.Data.length)
                    break;

                ++this.Data.YOffset;
                ++moveCount;
            }
        }
        else if (step<0)
        {
            step=Math.abs(step);
            for(var i=0;i<step;++i)
            {
                if (this.Data.YOffset<=0) 
                    break;

                --this.Data.YOffset;
                ++moveCount;
            }
        }

        return moveCount>0
    }

    this.GotoNextPage=function(bCycle) //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageSize=chart.GetPageSize();
        var dataCount=chart.GetAllRowCount();
        if (pageSize>dataCount) return false;
        if (this.Data.YOffset+pageSize>=dataCount) 
        {
            if (bCycle===true)
            {
                this.Data.YOffset=0;    //循环到第1页
                return true;
            }
            else
            {
                return false;
            }
        }

        this.Data.YOffset+=pageSize;
        var showDataCount=dataCount-this.Data.YOffset;

        if (chart.SelectedModel==0)
        {
            if (chart.SelectedRow>showDataCount-1) chart.SelectedRow=showDataCount-1;
        }

        return true;
    }

    this.GotoPreviousPage=function(bCycle)  //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;
        var pageSize=chart.GetPageSize();
        var dataCount=chart.GetAllRowCount();
        if (pageSize>dataCount) return false;

        if (this.Data.YOffset<=0) 
        {
            if (bCycle===true)
            {
                this.Data.YOffset=dataCount-pageSize;   //循环到最后一页
                return true;
            }
            else
            {
                return false;
            }
        }
        
        var offset=this.Data.YOffset;
        offset-=pageSize;
        if (offset<0) offset=0;
        this.Data.YOffset=offset;
        return true;
    }

    this.MoveYOffset=function(setp, bCycle) //bCycle 是否循环
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageStatus=chart.GetCurrentPageStatus();
        if (pageStatus.IsSinglePage) return false;

        if (setp>0) //向上
        {
            var count=this.Data.Data.length;
            var pageSize=pageStatus.PageSize;
            var offset=this.Data.YOffset;
            if (bCycle)
            {
                for(var i=0;i<setp;++i)
                {
                    ++offset;
                    if (offset+pageSize>count) offset=0;
                }
            }
            else
            {
                if (offset+pageSize>=count) return false;

                for(var i=0;i<setp;++i)
                {
                    if (offset+pageSize+1>count) break;
                    ++offset;
                }
            }

            this.Data.YOffset=offset;
            return true;
        }
        else if (setp<0)   //向下
        {
            setp=Math.abs(setp);
            var offset=this.Data.YOffset;
            if (bCycle)
            {
                var pageSize=pageStatus.PageSize;
                for(var i=0;i<setp;++i)
                {
                    --offset;
                    if (offset<0) offset=this.Data.Data.length-pageSize;
                }
            }
            else
            {
                if (this.Data.YOffset<=0) return false;
                for(var i=0;i<setp;++i)
                {
                    if (offset-1<0) break;
                    --offset;
                }
            }

            this.Data.YOffset=offset;
            return true;
        }

        return false;
    }

    // option={ EnablePageCycle: true/false(是否循环翻页) }
    this.MoveSelectedRow=function(step, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;
        var bPageCycle=false;
        if (option)
        {
            if (IFrameSplitOperator.IsBool(option.EnablePageCycle)) bPageCycle=option.EnablePageCycle;
        }

        var result={ Redraw:false, Update:false, OldIndex:-1, NewIndex:-1 };  //Redraw=重绘, Update=更新数据

        if (chart.MultiSelectModel==1)
        {
            var pageStatus=chart.GetCurrentPageStatus();
            if (IFrameSplitOperator.IsNonEmptyArray(pageStatus.MultiSelectedRow))
            {
                var selected=pageStatus.MultiSelectedRow[0];
                if (step>0)
                {
                    if (selected==this.Data.Data.length-1) return result;

                    if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
                    {
                        chart.MultiSelectedRow=[pageStatus.Start];
                        result.Redraw=true;
                        return result;
                    }

                    var offset=this.Data.YOffset;
                    for(var i=0;i<step;++i)
                    {
                        ++selected;
                        if (selected>pageStatus.End) ++offset;

                        if (selected>=this.Data.Data.length)
                        {
                            selected=0;
                            offset=0;
                        }
                    }

                    result.Redraw=true;
                    result.Update=(offset!=this.Data.YOffset);

                    chart.MultiSelectedRow=[selected];
                    this.Data.YOffset=offset;

                    return result;
        
                }
                else if (step<0)
                {
                    if (selected==0) return result;

                    if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
                    {
                        chart.MultiSelectedRow=[pageStatus.End];
                        result.Redraw=true;
                        return result;
                    }
    
                    step=Math.abs(step);
                    var offset=this.Data.YOffset;
                    for(var i=0;i<step;++i)
                    {
                        --selected;
                        if (selected<pageStatus.Start) --offset;
    
                        if (selected<0)
                        {
                            selected=this.Data.Data.length-1;
                            offset=this.Data.Data.length-pageSize;
                            if (offset<0) offset=0;
                        }
                    }
    
                    result.Redraw=true;
                    result.Update=(offset!=this.Data.YOffset);
    
                    chart.MultiSelectedRow=[selected];
                    this.Data.YOffset=offset;
    
                    return result;
                }
                else
                {
                    return null;
                }

                return result;
            }
            else
            {
                var selected=-1;
                if (step>0) selected=pageStatus.Start;
                else if (step<0) selected=pageStatus.End;
                else return null;

                chart.MultiSelectedRow=[selected];
                result.Redraw=true;
            }

            return result;
        }

        
        if (chart.SelectedModel==0)     //不可翻页模式, 只能在当前页移动
        {
            var pageStatus=chart.GetCurrentPageStatus();
            var pageSize=pageStatus.End-pageStatus.Start+1;
            var selected=pageStatus.SelectedRow;
            result.OldIndex=this.Data.YOffset+selected;
            if (step>0)
            {
                selected+=step;
                selected=selected%pageSize;
                chart.SelectedRow=selected;
                chart.SelectedFixedRow=-1;
                result.Redraw=true;
                result.NewIndex=this.Data.YOffset+selected;
                return result;
            }
            else if (step<0)
            {
                selected+=step;
                if (selected<0)
                {
                    selected=selected%pageSize;
                    selected=pageSize+selected;
                }

                chart.SelectedRow=selected;
                chart.SelectedFixedRow=-1;
                result.NewIndex=this.Data.YOffset+selected;
                result.Redraw=true;
                return result;
            }
        }
        else if (chart.SelectedModel==1)    //可翻页模式
        {
            var pageStatus=chart.GetCurrentPageStatus();
            var pageSize=pageStatus.PageSize;
            var selected=pageStatus.SelectedRow;
            result.OldIndex=pageStatus.SelectedRow;
            if (step>0)
            {
                if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
                {
                    chart.SelectedRow=pageStatus.Start;
                    result.Redraw=true;
                    result.NewIndex=pageStatus.Start;
                    return result;
                }

                var offset=this.Data.YOffset;
                for(var i=0;i<step;++i)
                {
                    if (selected+1>=this.Data.Data.length && !bPageCycle)
                        break;

                    ++selected;
                    if (selected>pageStatus.End) ++offset;

                    if (selected>=this.Data.Data.length)
                    {
                        selected=0;
                        offset=0;
                    }
                }

                result.Redraw=true;
                result.Update=(offset!=this.Data.YOffset);

                chart.SelectedRow=selected;
                this.Data.YOffset=offset;
                result.NewIndex=selected;
                return result;
            }
            else if (step<0)
            {
                if (selected<0 || selected<pageStatus.Start || selected>pageStatus.End)
                {
                    chart.SelectedRow=pageStatus.End;
                    result.Redraw=true;
                    result.NewIndex=pageStatus.End;
                    return result;
                }

                step=Math.abs(step);
                var offset=this.Data.YOffset;
                for(var i=0;i<step;++i)
                {
                    if (selected<=0 && !bPageCycle)    //不能循环翻页
                        break;

                    --selected;
                    if (selected<pageStatus.Start) --offset;

                    if (selected<0)
                    {
                        selected=this.Data.Data.length-1;
                        offset=this.Data.Data.length-pageSize;
                        if (offset<0) offset=0;
                    }
                }

                result.Redraw=true;
                result.Update=(offset!=this.Data.YOffset);

                chart.SelectedRow=selected;
                this.Data.YOffset=offset;
                result.NewIndex=selected;

                return result;
            }
        }

        return null;
    }

    this.MoveSelectedRowEvent=function(oldIndex, newIndex)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;

        if (oldIndex==newIndex) return;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MOVE_SELECTED_REPORT_ROW);
        if (!event || !event.Callback) return;

        if (!IFrameSplitOperator.IsNonEmptyArray(chart.Data.Data)) return;
        var arySymbol=chart.Data.Data;

        var oldData=null, newData=null;
        if (oldIndex>=0 && oldIndex<arySymbol.length)
        {
            var symbol=arySymbol[oldIndex];
            oldData={ Symbol:symbol, Index:oldIndex };
        }

        if (newIndex>=0 && newIndex<arySymbol.length)
        {
            var symbol=arySymbol[newIndex];
            newData={ Symbol:symbol, Index:newIndex };
        }

        var endData={ Old:oldData, Now:newData };
        event.Callback(event, endData, this);
    }

    //左右移动
    this.MoveXOffset=function(step)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return false;
        var maxOffset=chart.GetXScrollRange();
        if (maxOffset<=0) return false;

        if (step>0)
        {
            if (this.Data.XOffset>=maxOffset) return false;
            for(var i=0;i<step;++i)
            {
                if (this.Data.XOffset>=maxOffset) break;
                ++this.Data.XOffset;
            }

            return true;
        }
        else if (step<0)
        {
            if (this.Data.XOffset<=0) return false;
            step=Math.abs(step);
            for(var i=0;i<step;++i)
            {
                if (this.Data.XOffset-1<0) break;
                --this.Data.XOffset;
            }
            return true;
        }

        return false;
    }

    this.SetXOffset=function(pos)
    {
        if (!IFrameSplitOperator.IsNumber(pos)) return false;

        var chart=this.ChartPaint[0];
        if (!chart) return false;
        var maxOffset=chart.GetXScrollRange();
        if (pos<0) pos=0;
        if (pos>maxOffset) pos=maxOffset;

        this.Data.XOffset=pos;

        return true;
    }

    this.SetYOffset=function(pos)
    {
        if (!IFrameSplitOperator.IsNumber(pos)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var maxOffset=chart.GetYScrollRange();
        if (pos<0) pos=0;
        if (pos>maxOffset) pos=maxOffset;

        this.Data.YOffset=pos;

        return true;
    }

    this.GotoLastPage=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        //显示最后一屏
        var pageSize=chart.GetPageSize(true);
        var offset=this.Data.Data.length-pageSize;
        if (offset<0) offset=0;
        this.Data.DataOffset=offset;
    }

    this.SetColumn=function(aryColunm, option)
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return;

        chart.SetColumn(aryColunm);
        chart.SizeChange=true;

        if (option && option.Redraw) this.Draw();
    }

    this.SetTab=function(aryTab, option)
    {
        var chart=this.ChartPaint[0];;
        if (!chart) return;

        var chartTab=chart.Tab;
        if (!chartTab) return;

        chartTab.SetTabList(aryTab);

        if (option && option.Redraw) this.Draw();
    }

    this.SetVScrollbar=function(option)
    {
        var chart=this.GetReportChart();
        if (!chart) return;

        var scrollbar=chart.VScrollbar;
        if (!scrollbar) return;

        scrollbar.SetOption(option);
    }

    this.SetSelectedTab=function(index, opiton)
    {
        var chart=this.ChartPaint[0];;
        if (!chart) return;

        var chartTab=chart.Tab;
        if (!chartTab) return;

        chartTab.SelectedTabIndex=index;
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
        if (this.TooltipKLineChart)   this.TooltipKLineChart.ReloadResource(option);  
    }

    //列排序
    this.SortColumn=function(index, sortType)
    {
        if (index<0) return false;
        var reportChart=this.GetReportChart();
        if (!reportChart) return false;

        var column=reportChart.Column[index];
        
        if (!column) return false;
        if (column.Sort!=1 && column.Sort!=2) return false;

        var sortInfo={ Field:index, Sort:sortType };
        if (this.Data.Virtual && this.Data.Virtual.Enable)
        {
            this.SortInfo.Field=sortInfo.Field;
            this.SortInfo.Sort=sortInfo.Sort;
            this.Data.YOffset=0;
            this.ResetReportSelectStatus();
            this.RequestVirtualStockData();   //虚拟表格
            return true;
        }
        else if (sortInfo.Sort==0)   //不排序还原
        {
            this.Data.Data=[];
            if (IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data))
                this.Data.Data=this.SourceData.Data.slice();
        }
        else if (sortInfo.Sort==1 || sortInfo.Sort==2)
        {
            if (column.Sort==1)  //本地排序
            {
                var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_LOCAL_SORT);
                if (event && event.Callback)
                {
                    var sendData={ Column:column, SortInfo:sortInfo, SymbolList:this.Data.Data, Result:null };
                    event.Callback (event, sendData, this);
                    if (Array.isArray(sendData.Result)) this.Data.Data=sendData.Result;
                }
                else
                {
                    this.Data.Data.sort((left, right)=> { return this.LocalSort(left, right, column, sortInfo.Sort); });
                }
            }
            else if (column.Sort==2) //远程排序
            {
                if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;
                
                this.SortInfo.Field=sortInfo.Field;
                this.SortInfo.Sort=sortInfo.Sort;
                this.Data.YOffset=0;
                this.ResetReportSelectStatus();
                this.RequestStockSortData(column, sortInfo.Field, sortInfo.Sort);   //远程排序
                return true;
            }
        }

        this.Data.YOffset=0;
        this.ResetReportSelectStatus();
        this.SortInfo.Field=sortInfo.Field;
        this.SortInfo.Sort=sortInfo.Sort;
        this.Draw();
        this.DelayUpdateStockData();
        return true;
    }

    //点表头
    this.OnClickHeader=function(clickData, e)
    {
        var header=clickData.Header;
        if (header.Column && header.Column.EnablePopupHeaderMenu)
        {
            this.PopupHeaderMenu(clickData, e);
            return;
        }

        if (header.Column && (header.Column.Sort==1 || header.Column.Sort==2))
        {
            var index=header.Index;
            var sortInfo={Field:this.SortInfo.Field, Sort:this.SortInfo.Sort };
            var arySortType=header.Column.SortType;
            if (sortInfo.Field!=index)
            {
                sortInfo.Field=index;
                sortInfo.Sort=arySortType[0]
            }
            else
            {
                if (arySortType.length==1) 
                {
                    sortInfo.Sort=arySortType[0];
                }
                else
                {
                    for(var i=0;i<arySortType.length;++i)
                    {
                        if (sortInfo.Sort==arySortType[i])
                        {
                            sortInfo.Sort=arySortType[(i+1)%arySortType.length];
                            break;
                        }
                    }
                }
            }

            if (header.Column.Sort==1 || header.Column.Sort==2)  
            {
                if (sortInfo.Sort==0)
                {
                    this.Data.Data=[];
                    for(var i=0;i<this.SourceData.Data.length;++i)
                    {
                        this.Data.Data.push(this.SourceData.Data[i]);
                    }
                } 
                else
                {
                    if (header.Column.Sort==1)  //本地排序
                    {
                        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_LOCAL_SORT);
                        if (event && event.Callback)
                        {
                            var sendData={ Column:header.Column, SortInfo:sortInfo, SymbolList:this.Data.Data, Result:null };
                            event.Callback (event, sendData, this);
                            if (Array.isArray(sendData.Result)) this.Data.Data=sendData.Result;
                        }
                        else
                        {
                            this.Data.Data.sort((left, right)=> { return this.LocalSort(left, right, header.Column, sortInfo.Sort); });
                        }
                    }
                    else if (header.Column.Sort==2) //远程排序
                    {
                        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;
                        
                        this.SortInfo.Field=sortInfo.Field;
                        this.SortInfo.Sort=sortInfo.Sort;
                        this.Data.YOffset=0;
                        this.ResetReportSelectStatus();
                        this.RequestStockSortData(header.Column, sortInfo.Field, sortInfo.Sort);   //远程排序
                        return;
                    }
                }

                this.Data.YOffset=0;
                this.ResetReportSelectStatus();
                this.SortInfo.Field=sortInfo.Field;
                this.SortInfo.Sort=sortInfo.Sort;
                this.Draw();
                this.DelayUpdateStockData();
            }
        }
    }

    this.PopupHeaderMenu=function(clickData, e)
    {
        if (!this.JSPopMenu) return;
        if (!this.GetEventCallback) return;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CREATE_REPORT_HEADER_MENU);
        if (!event || !event.Callback) return;

        var header=clickData.Header;
        var column=header.Column;
        var menuData={ Menu:null, Position:JSPopMenu.POSITION_ID.DROPDOWN_MENU_ID };
        menuData.ClickCallback=(data)=>{ this.OnClickHeaderMenu(column, data); }
        
        var sendData={ MenuData:menuData, Column:column, Index:header.Index, PreventDefault:false, e:e };
        event.Callback(event, sendData, this);
        if (sendData.PreventDefault==true) return;

        if (!menuData.Menu) return;

        this.PopupMenuByDrapdown(menuData, header.Rect);
    }

    //下拉菜单
    this.PopupMenuByDrapdown=function(menuData, rtButton)
    {
        if (!this.JSPopMenu) return;

        var pixelRatio=GetDevicePixelRatio();
        var rtCell={ Left:rtButton.Left/pixelRatio, Right:rtButton.Right/pixelRatio, Bottom:rtButton.Bottom/pixelRatio, Top:rtButton.Top/pixelRatio };
        rtCell.Width=rtCell.Right-rtCell.Left;
        rtCell.Height=rtCell.Bottom-rtCell.Top;

        var rtClient=this.UIElement.getBoundingClientRect();
        var rtScroll=GetScrollPosition();

        var offsetLeft=rtClient.left+rtScroll.Left;
        var offsetTop=rtClient.top+rtScroll.Top;
        rtCell.Left+=offsetLeft;
        rtCell.Right+=offsetLeft;
        rtCell.Top+=offsetTop;
        rtCell.Bottom+=offsetTop;

        this.JSPopMenu.CreatePopMenu(menuData);
        this.JSPopMenu.PopupMenuByDrapdown(rtCell);
    }

    this.GetTabPopMenu=function(tabItem)
    {
        var aryMenu=[ ];

        if (IFrameSplitOperator.IsNonEmptyArray(tabItem.ArySubMenu))
        {
            for(var i=0;i<tabItem.ArySubMenu.length;++i)
            {
                var item=tabItem.ArySubMenu[i];
                var menuItem={ Name:item.Title, Data:{ ID:item.CommandID, Args:[item.ID]} };
                if (item.Text) menuItem.Text=item.Text;

                aryMenu.push(menuItem);
            }
        }


        return aryMenu;
    }

    this.PopupTabMenu=function(menuData, tab, e)
    {
        if (!this.JSPopMenu) return;

        var rtTab=tab.Rect;
        var pixelRatio=GetDevicePixelRatio();
        var rtCell={ Left:rtTab.Left/pixelRatio, Right:rtTab.Right/pixelRatio, Bottom:rtTab.Bottom/pixelRatio, Top:rtTab.Top/pixelRatio };
        rtCell.Width=rtCell.Right-rtCell.Left;
        rtCell.Height=rtCell.Bottom-rtCell.Top;

        var rtClient=this.UIElement.getBoundingClientRect();
        var rtScroll=GetScrollPosition();

        var offsetLeft=rtClient.left+rtScroll.Left;
        var offsetTop=rtClient.top+rtScroll.Top;
        rtCell.Left+=offsetLeft;
        rtCell.Right+=offsetLeft;
        rtCell.Top+=offsetTop;
        rtCell.Bottom+=offsetTop;

        this.JSPopMenu.CreatePopMenu(menuData);
        this.JSPopMenu.PopupMenuByTab(rtCell);

        if(e.preventDefault) e.preventDefault();
        if(e.stopPropagation) e.stopPropagation();
    }

    //点击标签
    this.OnClickTab=function(tabData, e)
    {
        if (!tabData.Tab) return;

        var redraw=false;
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        var uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};

        if (tabData.Tab.IsMenu)
        {
            var menuData={ Menu:this.GetTabPopMenu(tabData.Tab), Position:JSPopMenu.POSITION_ID.TAB_MENU_ID };
            menuData.ClickCallback=(data)=>{ this.OnClickTabPopMenu(tabData, data); }

            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CLICK_REPORT_TABMENU);
            if (event && event.Callback)
            {
                var sendData={ MenuData:menuData, Tab:tabData, PreventDefault:false, e:e };
                event.Callback(event, sendData, this);
                if (sendData.PreventDefault==true) return;
            }

            this.PopupTabMenu(menuData, tabData.Tab, e);
        }
        else
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CLICK_REPORT_TAB);
            if (event && event.Callback)
            {
                var sendData={ Data:tabData, IsSide:{X:x, Y:x}, UIElement:uiElement, e:e , Redraw:redraw, PreventDefault:false };
                event.Callback(event, sendData, this);
                if (IFrameSplitOperator.IsBool(sendData.Redraw)) redraw=sendData.Redraw;
                if (sendData.PreventDefault==true) return;
            }

            if (tabData.Tab.CommandID==JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID)
            {
                this.ExecuteMenuCommand(tabData.Tab.CommandID,  [tabData.Tab.ID]);
                this.SetSelectedTab(tabData.Index);
                redraw=true;
            }
        }

        if (redraw) this.Draw();
    }

    this.OnClickTabPopMenu=function(tabData, data)
    {
        JSConsole.Chart.Log('[JSReportChartContainer::OnClickTabPopMenu] ',tabData, data);

        var cmdID=data.Data.ID;     //命令ID
        var aryArgs=data.Data.Args; //参数

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MENU_COMMAND);  //回调通知外部
        if (event && event.Callback)
        {
            var data={ PreventDefault:false, CommandID:cmdID, Args:aryArgs, SrcData:data, TabData:tabData };
            event.Callback(event,data,this);
            if (data.PreventDefault) return;
        }

        this.ExecuteMenuCommand(cmdID,aryArgs);
        
        this.SetSelectedTab(tabData.Index);
        this.Draw();
    }

    this.OnClickHeaderMenu=function(menuData, data)
    {
        JSConsole.Chart.Log('[JSReportChartContainer::OnClickHeaderMenu] ',menuData, data);

        var cmdID=data.Data.ID;
        var aryArgs=data.Data.Args;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MENU_COMMAND);  //回调通知外部
        if (event && event.Callback)
        {
            var data={ PreventDefault:false, CommandID:cmdID, Args:aryArgs, SrcData:data, MenuData:menuData };
            event.Callback(event,data,this);
            if (data.PreventDefault) return;
        }

        this.ExecuteMenuCommand(cmdID,aryArgs);
    }

    this.ExecuteMenuCommand=function(cmdID, aryArgs)
    {
        JSConsole.Chart.Log('[JSReportChartContainer::ExecuteMenuCommand] cmdID=, aryArgs=', cmdID,aryArgs);

        var param=null, srcParam=null;  //原始值
        if (IFrameSplitOperator.IsNonEmptyArray(aryArgs))
        {
            srcParam=aryArgs[0];
            if (IFrameSplitOperator.IsNumber(aryArgs[0])) param=aryArgs[0];
        }

        switch(cmdID)
        {
            case JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID:
                if (srcParam) this.ChangeSymbol(srcParam);
                break;
            case JSCHART_MENU_ID.CMD_REPORT_COLUMN_SORT_ID:
                if (IFrameSplitOperator.IsNumber(param) && IFrameSplitOperator.IsNumber(aryArgs[1]))
                    this.SortColumn(param, aryArgs[1]);
                break;
            case JSCHART_MENU_ID.CMD_REPORT_COLUMN_MOVE_ID:
                if (IFrameSplitOperator.IsNumber(param) && IFrameSplitOperator.IsNumber(aryArgs[1]))
                {
                    var leftIndex=param;
                    var rightIndex=param+aryArgs[1];
                    this.SwapColumn(leftIndex, rightIndex, {Redraw:true});
                }
                break;
            case JSCHART_MENU_ID.CMD_REPORT_COLUMN_DEL_ID:
                if (IFrameSplitOperator.IsNumber(param))
                    this.DeleteColumn(param, {Redraw:true});
                break;
            case JSCHART_MENU_ID.CMD_REPORT_CHANGE_COLUMN_ID:
                if (param!=null && aryArgs[1]) this.ChangeColumn(param, aryArgs[1], { Redraw:true})
                break;
        }
    }


    this.ChangeColumn=function(index, newColumn, option)
    {
        if (index<0) return;
        if (!newColumn) return;

        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        if (!reportChart.ChangeColumn(index, newColumn)) return;

        if (this.SortInfo && this.SortInfo.Field==index &&  this.SortInfo.Sort>0)    //去掉排序
        {
            this.SortInfo.Field=-1;
            this.SortInfo.Sort=0;
            this.Data.Data=[];
            if (IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data))
                this.Data.Data=this.SourceData.Data.slice();
        }

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    this.SwapColumn=function(leftIndex, rightIndex, option)
    {
        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        if (!reportChart.SwapColumn(leftIndex, rightIndex)) return;

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    this.DeleteColumn=function(index, option)
    {
        var reportChart=this.GetReportChart();
        if (!reportChart) return;

        if (!reportChart.DeleteColumn(index)) return;

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    //本地排序
    this.LocalSort=function(left, right, column, sortType)
    {
        switch(column.Type)
        {
            case REPORT_COLUMN_ID.SYMBOL_ID:
            case REPORT_COLUMN_ID.NAME_ID:
                return this.LocalStringSort(left, right, column, sortType);
            case REPORT_COLUMN_ID.NAME_EX_ID:
                return this.LocalNameExSort(left, right, column, sortType);
            case REPORT_COLUMN_ID.PRICE_ID:
            case REPORT_COLUMN_ID.VOL_ID:
            case REPORT_COLUMN_ID.INCREASE_ID:
            case REPORT_COLUMN_ID.UPDOWN_ID:
            case REPORT_COLUMN_ID.BUY_PRICE_ID:
            case REPORT_COLUMN_ID.SELL_PRICE_ID:
            case REPORT_COLUMN_ID.AMOUNT_ID:
            case REPORT_COLUMN_ID.BUY_VOL_ID:
            case REPORT_COLUMN_ID.SELL_VOL_ID:
            case REPORT_COLUMN_ID.YCLOSE_ID:
            case REPORT_COLUMN_ID.OPEN_ID:
            case REPORT_COLUMN_ID.HIGH_ID:
            case REPORT_COLUMN_ID.LOW_ID:
            case REPORT_COLUMN_ID.AVERAGE_PRICE_ID:

            case REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID:
            case REPORT_COLUMN_ID.TOTAL_SHARES_ID:
            case REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID:
            case REPORT_COLUMN_ID.MARKET_VALUE_ID:

            case REPORT_COLUMN_ID.EXCHANGE_RATE_ID:
            case REPORT_COLUMN_ID.AMPLITUDE_ID:

            case REPORT_COLUMN_ID.LIMIT_HIGH_ID:
            case REPORT_COLUMN_ID.LIMIT_LOW_ID:

            //期货字段
            case REPORT_COLUMN_ID.FUTURES_POSITION_ID:
            case REPORT_COLUMN_ID.FUTURES_CLOSE_ID:
            case REPORT_COLUMN_ID.FUTURES_YCLOSE_ID:
            case REPORT_COLUMN_ID.FUTURES_OPEN_POSITION_ID:
            case REPORT_COLUMN_ID.FUTURES_CLOSE_POSITION_ID:

            case REPORT_COLUMN_ID.VOL_IN_ID:
            case REPORT_COLUMN_ID.VOL_OUT_ID:
            case REPORT_COLUMN_ID.DATE_ID:

            case REPORT_COLUMN_ID.RESERVE_NUMBER1_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER2_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER3_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER4_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER5_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER6_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER7_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER8_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER9_ID:
            case REPORT_COLUMN_ID.RESERVE_NUMBER10_ID:
            
                return this.LocalNumberSort(left, right, column, sortType);
            case REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID:    //自定义数值字段
                return this.LoacCustomNumberSort(left, right, column, sortType);
            case REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID:    //自定义字符串字段
                return this.LoacCustomStringSort(left, right, column, sortType);
            case REPORT_COLUMN_ID.CUSTOM_DATETIME_TEXT_ID:
                return this.LoacCustomDateTimeSort(left, right, column, sortType);
            default:

                return 0;
        }
    }

    this.GetStockExtendData=function(symbol,column)
    {
        if (IFrameSplitOperator.IsNumber(column.DataIndex))
        {
            if (column.DataIndex<0) return null;
            var stock=this.GetStockData(symbol);
            if (!stock || !stock.ExtendData) return null;

            return stock.ExtendData[column.DataIndex];
        }

        if (IFrameSplitOperator.IsNumber(column.BlockIndex))
        {
            if (column.BlockIndex<0) return null;
            var stock=this.GetBlockData(symbol);
            if (!stock) return null;

            return stock[column.BlockIndex];
        }

        return null;
    }

    this.LocalNameExSort=function(left, right, column, sortType)
    {
        var leftStock=this.GetStockData(left);
        var rightStock=this.GetStockData(right);

        var leftValue="", rightValue="";
        if (sortType==2)
        {
            leftValue="啊啊啊啊啊";
            rightValue="啊啊啊啊啊";
        }

        if (leftStock && leftStock.Name) leftValue=leftStock.Name;
        if (rightStock && rightStock.Name) rightValue=rightStock.Name;

        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.LocalStringSort=function(left, right, column, sortType)
    {
        var leftStock=this.GetStockData(left);
        var rightStock=this.GetStockData(right);

        var leftValue="", rightValue="";
        if (sortType==2)
        {
            leftValue="啊啊啊啊啊";
            rightValue="啊啊啊啊啊";
        }

        var filedName=MAP_COLUMN_FIELD.get(column.Type);
        if (leftStock && leftStock[filedName]) leftValue=leftStock[filedName];
        if (rightStock && rightStock[filedName]) rightValue=rightStock[filedName];
        
        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.LocalNumberSort=function(left, right, column, sortType)
    {
        var leftStock=this.GetStockData(left);
        var rightStock=this.GetStockData(right);

        var leftValue=-99999999999999, rightValue=-99999999999999;
        if (sortType==2) leftValue=rightValue=99999999999999;

        var filedName=MAP_COLUMN_FIELD.get(column.Type);
        if (leftStock && IFrameSplitOperator.IsNumber(leftStock[filedName])) leftValue=leftStock[filedName];
        if (rightStock && IFrameSplitOperator.IsNumber(rightStock[filedName])) rightValue=rightStock[filedName];
        
      

        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.LoacCustomNumberSort=function(left, right, column, sortType)
    {
        var leftValue=-99999999999999, rightValue=-99999999999999;
        if (sortType==2) leftValue=rightValue=99999999999999;

        var value=this.GetStockExtendData(left, column);
        if (IFrameSplitOperator.IsNumber(value)) leftValue=value;

        var value=this.GetStockExtendData(right, column);
        if (IFrameSplitOperator.IsNumber(value)) rightValue=value;

        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.LoacCustomDateTimeSort=function(left, right, column, sortType)
    {
        var leftValue=-99999999999999, rightValue=-99999999999999;
        if (sortType==2) leftValue=rightValue=99999999999999;

        var value=this.GetStockExtendData(left, column);
        if (IFrameSplitOperator.IsNumber(value)) leftValue=value;

        var value=this.GetStockExtendData(right, column);
        if (IFrameSplitOperator.IsNumber(value)) rightValue=value;

        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.LoacCustomStringSort=function(left, right, column, sortType)
    {
        var leftValue="", rightValue="";
        if (sortType==2) rightValue=leftValue="啊啊啊啊啊";
        
        var value=this.GetStockExtendData(left, column);
        if (IFrameSplitOperator.IsString(value)) leftValue=value;

        var value=this.GetStockExtendData(right, column);
        if (IFrameSplitOperator.IsString(value)) rightValue=value;
        
        if (sortType==1)
        {
            if (rightValue<leftValue) return -1;
            else if (rightValue<leftValue) return 1;
            else return 0;
        }
        else
        {
            if (leftValue<rightValue) return -1;
            else if (leftValue>rightValue) return 1;
            else return 0;
        }
    }

    this.RequestStockSortData=function(column, filedid, sortType)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        var self=this;
        var startIndex=this.Data.YOffset;
        var pageSize=chart.GetPageSize();
        var endIndex=startIndex+pageSize;
        if (endIndex>=this.Data.Data.length) endIndex=this.Data.Data.length-1;

        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSDealChartContainer::RequestStockSortData', //类名::函数名
                Explain:'报价列表股票排序数据',
                Request:
                { 
                    Data: 
                    { 
                        range:{ start:startIndex, end:endIndex, count:this.Data.Data.length }, 
                        column:{ name: column.Title, type: column.Type, index:filedid, ID:column.ID }, 
                        sort:sortType, symbol:this.Symbol, name:this.Name,
                        pageSize:pageSize
                    } 
                }, 
                Self:this,
                PreventDefault:false
            };

            if (chart.FixedRowCount>0 && chart.FixedRowData.Type==1)
            {
                var arySymbol=[];
                for(var i=0;i<chart.FixedRowData.Symbol.length;++i)
                {
                    var item=chart.FixedRowData.Symbol[i];
                    if (item) arySymbol.push(item);
                }

                obj.Request.FixedSymbol=arySymbol;
            }

            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvStockSortData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;  
        }

        //throw { Name:'JSReportChartContainer::RequestStockSortData', Error:'(报价列表股票排序数据)不提供内置测试数据' };
    }

    this.RecvStockSortData=function(data)
    {
        //更新股票数据
        var arySymbol=[];
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];     //数据
                var symbol=item[0];
                if (!symbol) continue;
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQReportItem();
                    stock.OriginalSymbol=symbol;
                    stock.Symbol=this.GetSymbolNoSuffix(symbol);
                    this.MapStockData.set(symbol, stock);
                }

                this.ReadStockJsonData(stock, item);

                arySymbol.push(symbol);
            }
        }

        //更新股票顺序
        if (IFrameSplitOperator.IsNonEmptyArray(data.index))
        {
            for(var i=0;i<data.index.length;++i)
            {
                var index=data.index[i];
                var newSymbol=arySymbol[i];
                var oldSymbol=this.Data.Data[index];
                if (newSymbol==oldSymbol) continue;
                this.Data.Data[index]=newSymbol;
            }
        }

        if (data.Virtual)
        {
            var item=data.Virtual;
            if (IFrameSplitOperator.IsNumber(item.Count)) this.Data.Virtual.Count=item.Count;
        }

        var chart=this.ChartPaint[0];
        if (!chart) return;

        //更新的股票在当前页面,需要重绘
        var bUpdate=true;
        if (bUpdate) this.Draw();
    }

    //虚拟表格 请求序号 所有数据后台返回
    this.RequestVirtualStockData=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        var self=this;
        var startIndex=this.Data.YOffset;
        var pageSize=chart.GetPageSize();
        var endIndex=startIndex+pageSize;
        var dataCount=chart.GetAllRowCount();
        if (endIndex>=dataCount) endIndex=dataCount-1;

        if (!this.NetworkFilter) return;

        var requestData=
        {
            range:{ start:startIndex, end:endIndex, count:chart.GetAllRowCount() }, 
            column:null, 
            sort:0, symbol:this.Symbol, name:this.Name,
            pageSize:pageSize
        }

        if (this.SortInfo && this.SortInfo.Field>=0 && this.SortInfo.Sort>0) //排序
        {
            var column=chart.Column[this.SortInfo.Field];
            requestData.column={ name: column.Title, type: column.Type, index:this.SortInfo.Field, ID:column.ID };
            requestData.sort=this.SortInfo.Sort;
        }

        var obj=
        {
            Name:'JSDealChartContainer::RequestVirtualStockData', //类名::函数名
            Explain:'报价列表股票数据(虚拟表格)',
            Request:
            { 
                Data: requestData
            }, 
            Self:this,
            PreventDefault:false
        };

        if (chart.FixedRowCount>0 && chart.FixedRowData.Type==1)
        {
            var arySymbol=[];
            for(var i=0;i<chart.FixedRowData.Symbol.length;++i)
            {
                var item=chart.FixedRowData.Symbol[i];
                if (item) arySymbol.push(item);
            }

            obj.Request.FixedSymbol=arySymbol;
        }

        this.NetworkFilter(obj, function(data) 
        { 
            self.RecvStockSortData(data);
            self.AutoUpdate();
        });

        if (obj.PreventDefault==true) return;  
        
    }

    //底部标签
    this.ShowPageInfo=function(bShow)
    {
        var chart=this.ChartPaint[1];
        if (!chart) return false;

        chart.IsShow=bShow;

        return true;
    }
}



function JSReportFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右

    this.BorderColor=g_JSChartResource.Report.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.Report.BorderColor;    //边框线
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

var REPORT_COLUMN_ID=
{
    SYMBOL_ID:0,     
    NAME_ID:1,
    PRICE_ID:2,         //成交价格
    VOL_ID:3,           //成交量
    INCREASE_ID:4,      //涨幅
    UPDOWN_ID:5,        //涨跌
    BUY_PRICE_ID:6,     //买价
    SELL_PRICE_ID:7,     //卖价
    AMOUNT_ID:8,        //总金额
    BUY_VOL_ID:9,       //买量
    SELL_VOL_ID:10,     //卖量
    YCLOSE_ID:11,       //昨收
    OPEN_ID:12,
    HIGH_ID:13,
    LOW_ID:14,
    AVERAGE_PRICE_ID:15,//均价
    INDEX_ID:16,         //序号 从1开始

    OUTSTANDING_SHARES_ID:17,   //流通股本
    TOTAL_SHARES_ID:18,         //总股本
    CIRC_MARKET_VALUE_ID:19,    //流通市值
    MARKET_VALUE_ID:20,         //总市值

    EXCHANGE_RATE_ID:21,        //换手率 成交量/流通股本
    AMPLITUDE_ID:22,            //振幅

    LIMIT_HIGH_ID:23,       //涨停价
    LIMIT_LOW_ID:24,        //跌停价

    VOL_IN_ID:25,           //内盘
    VOL_OUT_ID:26,          //外盘
    NAME_EX_ID:27,          //扩展名字
    CLOSE_LINE_ID:28,       //收盘价线
    KLINE_ID:29,            //K线

    TIME_ID:31,             //时间 hhmmss / hhmm / hhmmss.fff
    DATE_ID:32,             //日期

    CHECKBOX_ID:33,         //单选框 

    FUTURES_POSITION_ID:34,      //期货持仓量
    FUTURES_CLOSE_ID:35,         //期货结算价
    FUTURES_YCLOSE_ID:36,        //期货昨结算
    FUTURES_OPEN_POSITION_ID:37,    //期货开仓量
    FUTURES_CLOSE_POSITION_ID:38,    //期货平仓量


    //1,3,5,10,15分钟涨速
    RISING_SPEED_1M_ID:60,  
    RISING_SPEED_3M_ID:61,  
    RISING_SPEED_5M_ID:62,
    RISING_SPEED_10M_ID:63,
    RISING_SPEED_15M_ID:64,

    SYMBOL_NAME_V2_ID:98,   //单行
    SYMBOL_NAME_ID:99,      //两行

    CUSTOM_STRING_TEXT_ID:100,      //自定义字符串文本
    CUSTOM_NUMBER_TEXT_ID:101,      //自定义数值型
    CUSTOM_DATETIME_TEXT_ID:102,    //自定义日期类型
    CUSTOM_ICON_ID:103,             //自定义图标
    CUSTOM_CHECKBOX_ID:104,         //自定义checkbox
    CUSTOM_BUTTON_ID:105,           //自定义按钮
    CUSTOM_PROGRESS_ID:106,         //进度条
    CUSTOM_LINK_ID:107,              //链接

    MULTI_LINE_CONTAINER:108,            //多行组合输出


    //预留数值类型 10个
    RESERVE_NUMBER1_ID:201,         //ReserveNumber1:
    RESERVE_NUMBER2_ID:202,
    RESERVE_NUMBER3_ID:203,
    RESERVE_NUMBER4_ID:204,
    RESERVE_NUMBER5_ID:205,
    RESERVE_NUMBER6_ID:206,
    RESERVE_NUMBER7_ID:207,
    RESERVE_NUMBER8_ID:208,
    RESERVE_NUMBER9_ID:209,
    RESERVE_NUMBER10_ID:210,


    //预留字符串类型 10个  301-399
    RESERVE_STRING1_ID:301,         //ReserveString1:
    RESERVE_STRING2_ID:302,
    RESERVE_STRING3_ID:303,
    RESERVE_STRING4_ID:304,
    RESERVE_STRING5_ID:305,
    RESERVE_STRING6_ID:306,
    RESERVE_STRING7_ID:307,
    RESERVE_STRING8_ID:308,
    RESERVE_STRING9_ID:309,
    RESERVE_STRING10_ID:310,

    //预留进度条类型  10个  401-450
    RESERVE_PROGRESS_BAR1_ID:401,    //ReserveProgressBar1:
    RESERVE_PROGRESS_BAR2_ID:402,
    RESERVE_PROGRESS_BAR3_ID:403,
    RESERVE_PROGRESS_BAR4_ID:404,
    RESERVE_PROGRESS_BAR5_ID:405,
    RESERVE_PROGRESS_BAR6_ID:406,
    RESERVE_PROGRESS_BAR7_ID:407,
    RESERVE_PROGRESS_BAR8_ID:408,
    RESERVE_PROGRESS_BAR9_ID:409,
    RESERVE_PROGRESS_BAR10_ID:410,

    //留按钮类型  10个  451-500     
    RESERVE_BUTTON1_ID:451,    //ReserveButton1:
    RESERVE_BUTTON2_ID:452,    //ReserveButton2:
    RESERVE_BUTTON3_ID:453,    //ReserveButton3:
    RESERVE_BUTTON4_ID:454,    //ReserveButton4:
    RESERVE_BUTTON5_ID:455,    //ReserveButton5:
    RESERVE_BUTTON6_ID:456,    //ReserveButton6:
    RESERVE_BUTTON7_ID:457,    //ReserveButton7:
    RESERVE_BUTTON8_ID:458,    //ReserveButton8:
    RESERVE_BUTTON9_ID:459,    //ReserveButton9:
    RESERVE_BUTTON10_ID:460,   //ReserveButton10:

}


//数据对应字段名对照表
var MAP_COLUMN_FIELD=new Map([
    [REPORT_COLUMN_ID.SYMBOL_ID, "Symbol"],
    [REPORT_COLUMN_ID.NAME_ID, "Name"],
    [REPORT_COLUMN_ID.PRICE_ID, "Price"],
    [REPORT_COLUMN_ID.INCREASE_ID, "Increase"],
    [REPORT_COLUMN_ID.UPDOWN_ID, "UpDown"],
    [REPORT_COLUMN_ID.VOL_ID, "Vol"],
    [REPORT_COLUMN_ID.BUY_PRICE_ID, "BuyPrice"],
    [REPORT_COLUMN_ID.SELL_PRICE_ID, "SellPrice"],
    [REPORT_COLUMN_ID.AMOUNT_ID, "Amount"],
    [REPORT_COLUMN_ID.BUY_VOL_ID, "BuyVol"],
    [REPORT_COLUMN_ID.SELL_VOL_ID, "SellVol"],
    [REPORT_COLUMN_ID.YCLOSE_ID, "YClose"],
    [REPORT_COLUMN_ID.OPEN_ID, "Open"],
    [REPORT_COLUMN_ID.HIGH_ID, "High"],
    [REPORT_COLUMN_ID.LOW_ID, "Low"],
    [REPORT_COLUMN_ID.AVERAGE_PRICE_ID,"AvPrice"],

    [REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID,"OutShares"],
    [REPORT_COLUMN_ID.TOTAL_SHARES_ID,"TotalShares"],
    [REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID,"CircMarketValue"],
    [REPORT_COLUMN_ID.MARKET_VALUE_ID,"MarketValue"],

    [REPORT_COLUMN_ID.EXCHANGE_RATE_ID, "Exchange"],
    [REPORT_COLUMN_ID.AMPLITUDE_ID, "Amplitude"],

    [REPORT_COLUMN_ID.LIMIT_HIGH_ID, "LimitHigh"],
    [REPORT_COLUMN_ID.LIMIT_LOW_ID,"LimitLow"],

    [REPORT_COLUMN_ID.VOL_IN_ID, "VolIn"],
    [REPORT_COLUMN_ID.VOL_OUT_ID,"VolOut"],

    [REPORT_COLUMN_ID.NAME_EX_ID, "NameEx"],

    [REPORT_COLUMN_ID.DATE_ID, "Date"],

    [REPORT_COLUMN_ID.FUTURES_POSITION_ID, "Position"],
    [REPORT_COLUMN_ID.FUTURES_CLOSE_ID, "FClose"],
    [REPORT_COLUMN_ID.FUTURES_YCLOSE_ID, "YFClose"],
    [REPORT_COLUMN_ID.FUTURES_OPEN_POSITION_ID, "OpenPosition"],
    [REPORT_COLUMN_ID.FUTURES_CLOSE_POSITION_ID, "ClosePosition"],

    [REPORT_COLUMN_ID.RISING_SPEED_1M_ID, "RSpeed1M"],
    [REPORT_COLUMN_ID.RISING_SPEED_3M_ID, "RSpeed3M"],
    [REPORT_COLUMN_ID.RISING_SPEED_5M_ID, "RSpeed5M"],
    [REPORT_COLUMN_ID.RISING_SPEED_10M_ID, "RSpeed10M"],
    [REPORT_COLUMN_ID.RISING_SPEED_15M_ID, "RSpeed15M"],

    [REPORT_COLUMN_ID.RESERVE_NUMBER1_ID,"ReserveNumber1"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER2_ID,"ReserveNumber2"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER3_ID,"ReserveNumber3"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER4_ID,"ReserveNumber4"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER5_ID,"ReserveNumber5"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER6_ID,"ReserveNumber6"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER7_ID,"ReserveNumber7"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER8_ID,"ReserveNumber8"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER9_ID,"ReserveNumber9"],
    [REPORT_COLUMN_ID.RESERVE_NUMBER10_ID,"ReserveNumber10"],

    [REPORT_COLUMN_ID.RESERVE_STRING1_ID,"ReserveString1"],
    [REPORT_COLUMN_ID.RESERVE_STRING2_ID,"ReserveString2"],
    [REPORT_COLUMN_ID.RESERVE_STRING3_ID,"ReserveString3"],
    [REPORT_COLUMN_ID.RESERVE_STRING4_ID,"ReserveString4"],
    [REPORT_COLUMN_ID.RESERVE_STRING5_ID,"ReserveString5"],
    [REPORT_COLUMN_ID.RESERVE_STRING6_ID,"ReserveString6"],
    [REPORT_COLUMN_ID.RESERVE_STRING7_ID,"ReserveString7"],
    [REPORT_COLUMN_ID.RESERVE_STRING8_ID,"ReserveString8"],
    [REPORT_COLUMN_ID.RESERVE_STRING9_ID,"ReserveString9"],
    [REPORT_COLUMN_ID.RESERVE_STRING10_ID,"ReserveString10"],

    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR1_ID,"ReserveProgressBar1"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR2_ID,"ReserveProgressBar2"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR3_ID,"ReserveProgressBar3"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR4_ID,"ReserveProgressBar4"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR5_ID,"ReserveProgressBar5"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR6_ID,"ReserveProgressBar6"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR7_ID,"ReserveProgressBar7"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR8_ID,"ReserveProgressBar8"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR9_ID,"ReserveProgressBar9"],
    [REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR10_ID,"ReserveProgressBar10"],

    
    [REPORT_COLUMN_ID.RESERVE_BUTTON1_ID,"ReserveButton1"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON2_ID,"ReserveButton2"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON3_ID,"ReserveButton3"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON4_ID,"ReserveButton4"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON5_ID,"ReserveButton5"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON6_ID,"ReserveButton6"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON7_ID,"ReserveButton7"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON8_ID,"ReserveButton8"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON9_ID,"ReserveButton9"],
    [REPORT_COLUMN_ID.RESERVE_BUTTON10_ID,"ReserveButton10"],
]);

function ChartReport()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartReport';       //类名
    this.UIElement;
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件
    this.GetStockDataCallback;          //获取股票数据
    this.GetFlashBGDataCallback;            //获取闪烁背景
    this.GetBlockDataCallback;          //获取当前板块的数据
    this.Data;                          //数据 { XOffset:0, YOffset:0, Data:['600000.sh', '000001.sz'] }
    this.FixedRowData;                  //固定行
    this.SortInfo;                      //排序信息 {Field:排序字段id, Sort:0 不排序 1升序 2降序 }    
    this.FixedColumn=2;                 //固定列
    this.FixedRowCount=0;               //固定行         
    
    this.IsShowHeader=true;             //是否显示表头
    this.SizeChange=true;

    this.SelectedModel=0;               //选中模式 0=SelectedRow表示当前屏索引
    this.SelectedRow=-1;                //选中行ID
    this.SelectedFixedRow=-1;           //选中固定行ID
    this.SelectedStyle=1;               //选中行样式 1=整行填充 2=底部绘制直线
    this.IsDrawBorder=1;                //是否绘制单元格边框
    this.HeaderRowCount=1;              //表头行数

    //多选模式
    this.MultiSelectModel=0;            //0=禁用 1=开启     
    this.MultiSelectedRow=[];           //选中行

    this.ShowSymbol=[];                 //显示的股票列表 { Index:序号(排序用), Symbol:股票代码 }
    this.DragRow;                       //拖拽行
    this.DragHeader;                    //拖拽表头

    this.Tab;
    this.VScrollbar;

    this.GlobalOption;
    this.TextOverflowStyle=0;                //输出内容比单元格长度大 0=裁剪  1=输出"####"

    //涨跌颜色
    this.UpColor=g_JSChartResource.Report.UpTextColor;
    this.DownColor=g_JSChartResource.Report.DownTextColor;
    this.UnchagneColor=g_JSChartResource.Report.UnchagneTextColor; 

    this.BorderColor=g_JSChartResource.Report.BorderColor;          //边框线
    this.SelectedColor=g_JSChartResource.Report.SelectedColor;      //选中行
    this.SelectedLineConfig={ Color:g_JSChartResource.Report.SelectedLine.Color, Width:g_JSChartResource.Report.SelectedLine.Width }; //选中行底部线段

    //表头配置
    this.HeaderFontConfig={ Size:g_JSChartResource.Report.Header.Font.Size, Name:g_JSChartResource.Report.Header.Font.Name };
    this.HeaderColor=g_JSChartResource.Report.Header.Color;
    
    this.HeaderMergin=
    { 
        Left:g_JSChartResource.Report.Header.Mergin.Left, 
        Right:g_JSChartResource.Report.Header.Mergin.Right, 
        Top:g_JSChartResource.Report.Header.Mergin.Top, 
        Bottom:g_JSChartResource.Report.Header.Mergin.Bottom
    };

    //排序图标
    this.SortConfig=
    {
        Size:g_JSChartResource.Report.SortIcon.Size, 
        Family:g_JSChartResource.Report.SortIcon.Family,
        Arrow:g_JSChartResource.Report.SortIcon.Arrow.slice(),
        Color:g_JSChartResource.Report.SortIcon.Color.slice(),
        Margin:
        { 
            Left:g_JSChartResource.Report.SortIcon.Margin.Left, 
            Right:g_JSChartResource.Report.SortIcon.Margin.Right,
            Bottom:g_JSChartResource.Report.SortIcon.Margin.Bottom
        }
    }

    //表格内容配置
    this.ItemFontConfig={ Size:g_JSChartResource.Report.Item.Font.Size, Name:g_JSChartResource.Report.Item.Font.Name };
    this.ItemFixedFontConfg={ Size:g_JSChartResource.Report.FixedItem.Font.Size, Name:g_JSChartResource.Report.FixedItem.Font.Name }; //固定行
    this.ItemMergin=
    { 
        Left:g_JSChartResource.Report.Item.Mergin.Left, 
        Right:g_JSChartResource.Report.Item.Mergin.Right, 
        Top:g_JSChartResource.Report.Item.Mergin.Top, 
        Bottom:g_JSChartResource.Report.Item.Mergin.Bottom,
    };
    this.BarMergin=
    { 
        Top:g_JSChartResource.Report.Item.BarMergin.Top, 
        Left:g_JSChartResource.Report.Item.BarMergin.Left, 
        Right:g_JSChartResource.Report.Item.BarMergin.Right,
        Bottom:g_JSChartResource.Report.Item.BarMergin.Bottom,
    };

    this.LimitDrawType=0;   //0=绘制边框  1=背景色
    this.LimitBorderColor=g_JSChartResource.Report.LimitBorder.Color;

    this.LimitUpBGColor=g_JSChartResource.Report.LimitColor.UpColor;
    this.LimitDownBGColor=g_JSChartResource.Report.LimitColor.DownColor;
    this.LimitTextColor=g_JSChartResource.Report.LimitColor.TextColor;

    this.LimitMergin=
    {
        Top:g_JSChartResource.Report.LimitBorder.Mergin.Top, 
        Left:g_JSChartResource.Report.LimitBorder.Mergin.Left, 
        Right:g_JSChartResource.Report.LimitBorder.Mergin.Right,
        Bottom:g_JSChartResource.Report.LimitBorder.Mergin.Bottom
    }

    this.DragRowColor=g_JSChartResource.Report.DragRow.Color;
    this.DragRowTextColor=g_JSChartResource.Report.DragRow.TextColor;
    this.DragMoveRowColor=g_JSChartResource.Report.DragRow.MoveRowColor;
    this.DragSrcRowColor=g_JSChartResource.Report.DragRow.SrcRowColor;

    //走势图
    this.CloseLineConfig=
    { 
        CloseColor:g_JSChartResource.Report.CloseLine.CloseColor,
        YCloseColor:g_JSChartResource.Report.CloseLine.YCloseColor,
        AreaColor:g_JSChartResource.Report.CloseLine.AreaColor
    }

    //K线配置
    this.KLineConfig=
    {
        UpColor:g_JSChartResource.Report.KLine.UpColor,
        DownColor:g_JSChartResource.Report.KLine.DownColor,
        UnchagneColor:g_JSChartResource.Report.KLine.UnchagneColor,
        DataWidth:g_JSChartResource.Report.KLine.DataWidth,
        DistanceWidth:g_JSChartResource.Report.KLine.DistanceWidth
    }

    this.CheckBoxConfig=CloneData(g_JSChartResource.Report.CheckBox);
    this.LinkConfig=CloneData(g_JSChartResource.Report.Link);
    this.ProgressBarConfig=CloneData(g_JSChartResource.Report.ProgressBar);
    this.ButtonConfig=CloneData(g_JSChartResource.Report.Button);

    //股票代码+股票名称
    this.ItemSymbolFontConfig={Size:g_JSChartResource.Report.Item.SymbolFont.Size, Name:g_JSChartResource.Report.Item.SymbolFont.Name};
    this.ItemNameFontConfg={Size:g_JSChartResource.Report.Item.NameFont.Size, Name:g_JSChartResource.Report.Item.NameFont.Name};

    //名称+代码
    this.NameSymbolV2Config=CloneData(g_JSChartResource.Report.NameSymbolV2);

    //缓存
    this.HeaderFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.SortFont=null,
    this.ItemFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemFontHeight=0;

    this.ItemFixedFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    
    this.ItemSymbolFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameHeight=0;
    this.ItemSymbolHeight=0;

    this.NameSymbolFont={ Symbol:null, Name:null };
    this.RowCount=0;            //一屏显示行数
    this.HeaderHeight=0;        //表头高度
    this.HeaderFontHeight=0;    //表头字体高度
    this.FixedRowHeight=0;      //固定行高度
    this.RowHeight=0;           //行高度
    this.ItemTextLines=1;           //单元格输出行数
    this.BottomToolbarHeight=0;  //底部工具条高度
    this.IsShowAllColumn=false;   //是否已显示所有列
    this.DevicePixelRatio=GetDevicePixelRatio();  //分辨率

    this.AryFullSelectedRow=[];     //选中行

    //{ 
    //  Type:列id, Title:标题, TextAlign:文字对齐方式, MaxText:文字最大宽度 , TextColor:文字颜色, Sort:0=不支持排序 1=本地排序 0=远程排序, 
    //  Icon:{ Family:"iconfont", Size:12, Symbol:"", Margin: { Left:, Bottom }} 
    //}
    this.Column=   
    [
        { Type:REPORT_COLUMN_ID.INDEX_ID, Title:"序号", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Index, MaxText:"8888"},
        { Type:REPORT_COLUMN_ID.SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null,  TextColor:g_JSChartResource.Report.FieldColor.Symbol, MaxText:"888888"},
        { Type:REPORT_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Name, MaxText:"擎擎擎擎" },
        { Type:REPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88" },
    ];

    this.RectClient={};

    //{ Rect:rtItem, Stock:stock, Index:index, Column:column, RowType:rowType, Type:drawInfo.Tooltip.Type, Data:{ AryText:[ {Text:xx} ]} };
    //Type:1=数据截断 2=表头提示信息  20=分时图
    // { Text, Color, Title:, TitleColor, Space, Margin:{ Left, Top, Right, Bottom }}
    this.TooltipRect=[];

    //{ Rect:rtItem, Type: 0=checkedbox, 1=button, 2=link , Stock, Index:index, Column:column }
    this.ButtonRect=[]; 

    this.LastMouseStatus;

    this.ReloadResource=function(resource)
    {
        this.DevicePixelRatio=GetDevicePixelRatio()

        this.UpColor=g_JSChartResource.Report.UpTextColor;
        this.DownColor=g_JSChartResource.Report.DownTextColor;
        this.UnchagneColor=g_JSChartResource.Report.UnchagneTextColor; 
    
        this.BorderColor=g_JSChartResource.Report.BorderColor;          //边框线
        this.SelectedColor=g_JSChartResource.Report.SelectedColor;      //选中行

        //表头配置
        this.HeaderFontConfig={ Size:g_JSChartResource.Report.Header.Font.Size, Name:g_JSChartResource.Report.Header.Font.Name };
        this.HeaderColor=g_JSChartResource.Report.Header.Color;
        
        this.HeaderMergin=
        { 
            Left:g_JSChartResource.Report.Header.Mergin.Left, 
            Right:g_JSChartResource.Report.Header.Mergin.Right, 
            Top:g_JSChartResource.Report.Header.Mergin.Top, 
            Bottom:g_JSChartResource.Report.Header.Mergin.Bottom
        };

        //表格内容配置
        this.ItemFontConfig={ Size:g_JSChartResource.Report.Item.Font.Size, Name:g_JSChartResource.Report.Item.Font.Name };
        this.ItemMergin=
        { 
            Left:g_JSChartResource.Report.Item.Mergin.Left, 
            Right:g_JSChartResource.Report.Item.Mergin.Right, 
            Top:g_JSChartResource.Report.Item.Mergin.Top, 
            Bottom:g_JSChartResource.Report.Item.Mergin.Bottom 
        };
        this.BarMergin=
        { 
            Top:g_JSChartResource.Report.Item.BarMergin.Top, 
            Left:g_JSChartResource.Report.Item.BarMergin.Left, 
            Right:g_JSChartResource.Report.Item.BarMergin.Right,
            Bottom:g_JSChartResource.Report.Item.BarMergin.Bottom
        };

        this.LimitBorderColor=g_JSChartResource.Report.LimitBorder.Color;
        this.LimitMergin=
        {
            Top:g_JSChartResource.Report.LimitBorder.Mergin.Top, 
            Left:g_JSChartResource.Report.LimitBorder.Mergin.Left, 
            Right:g_JSChartResource.Report.LimitBorder.Mergin.Right,
            Bottom:g_JSChartResource.Report.LimitBorder.Mergin.Bottom
        }

        this.DragRowColor=g_JSChartResource.Report.DragRow.Color;
        this.DragRowTextColor=g_JSChartResource.Report.DragRow.TextColor;
        this.DragMoveRowColor=g_JSChartResource.Report.DragRow.MoveRowColor;
        this.DragSrcRowColor=g_JSChartResource.Report.DragRow.SrcRowColor;

        //排序图标
        this.SortConfig=
        {
            Size:g_JSChartResource.Report.SortIcon.Size, 
            Family:g_JSChartResource.Report.SortIcon.Family,
            Arrow:g_JSChartResource.Report.SortIcon.Arrow.slice(),
            Color:g_JSChartResource.Report.SortIcon.Color.slice(),
            Margin:
            { 
                Left:g_JSChartResource.Report.SortIcon.Margin.Left, 
                Bottom:g_JSChartResource.Report.SortIcon.Margin.Bottom
            }
        }

        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (item.Type==REPORT_COLUMN_ID.INDEX_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Index;
            else if (item.Type==REPORT_COLUMN_ID.SYMBOL_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Symbol;
            else if (item.Type==REPORT_COLUMN_ID.NAME_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Name;
            else if (item.Type==REPORT_COLUMN_ID.VOL_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Vol;
            else if (item.Type==REPORT_COLUMN_ID.BUY_VOL_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Vol;
            else if (item.Type==REPORT_COLUMN_ID.SELL_VOL_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Vol;
            else if (item.Type==REPORT_COLUMN_ID.AMOUNT_ID) 
                item.TextColor=g_JSChartResource.Report.FieldColor.Amount;
            else if (item.Type==REPORT_COLUMN_ID.VOL_IN_ID) 
                item.TextColor=g_JSChartResource.Report.DownTextColor;
            else if (item.Type==REPORT_COLUMN_ID.VOL_OUT_ID) 
                item.TextColor=g_JSChartResource.Report.UpTextColor;
            else 
                item.TextColor=g_JSChartResource.Report.FieldColor.Text;
        }

        if (this.Tab) this.Tab.ReloadResource(resource);
        if (this.VScrollbar) this.VScrollbar.ReloadResource(resource);

        this.CheckBoxConfig=CloneData(g_JSChartResource.Report.CheckBox);
        this.LinkConfig=CloneData(g_JSChartResource.Report.Link);
        this.ProgressBarConfig=CloneData(g_JSChartResource.Report.ProgressBar);
    }

    this.CreateColumnItem=function(item)
    {
        var colItem=this.GetDefaultColunm(item.Type);
        if (!colItem) return null;

        if (item.Title) colItem.Title=item.Title;
        if (IFrameSplitOperator.IsNonEmptyArray(item.AryTitle)) colItem.AryTitle=item.AryTitle;
        if (item.TextAlign) colItem.TextAlign=item.TextAlign;
        if (item.TextColor) colItem.TextColor=item.TextColor;
        if (item.HeaderColor) colItem.HeaderColor=item.HeaderColor;
        if (item.MaxText) colItem.MaxText=item.MaxText;
        if (item.MaxText2) colItem.MaxText=item.MaxText2;
        if (IFrameSplitOperator.IsNumber(item.Space)) colItem.Space=item.Space;
        if (item.ID) colItem.ID=item.ID;
        if (item.FullColBGColor) colItem.FullColBGColor=item.FullColBGColor;    //整列背景色
        if (item.HeaderBGColor) colItem.HeaderBGColor=item.HeaderBGColor;       //表头背景色
        if (IFrameSplitOperator.IsNumber(item.Sort)) colItem.Sort=item.Sort;
        if (IFrameSplitOperator.IsNumber(item.FixedWidth)) colItem.FixedWidth=item.FixedWidth;
        if (IFrameSplitOperator.IsBool(item.EnableDragWidth)) colItem.EnableDragWidth=item.EnableDragWidth;

        colItem.IsDrawCallback=false;
        if (IFrameSplitOperator.IsBool(item.IsDrawCallback)) colItem.IsDrawCallback=item.IsDrawCallback;

        if (IFrameSplitOperator.IsBool(item.EnableFormatDrawInfoEvent)) colItem.EnableFormatDrawInfoEvent=item.EnableFormatDrawInfoEvent;

        if (IFrameSplitOperator.IsNumber(item.FloatPrecision)) colItem.FloatPrecision=item.FloatPrecision;    //小数位数
        if (IFrameSplitOperator.IsNumber(item.ColorType))  colItem.ColorType=item.ColorType;        //0=默认 1=(>0, =0, <0) 2=(>=0, <0)
        if (item.Icon) colItem.Icon=item.Icon;
        if (IFrameSplitOperator.IsBool(item.EnableChartTooltip)) colItem.ChartTooltip={ Enable:item.EnableChartTooltip, Type:20 };
        if (item.ChartTooltip) colItem.ChartTooltip={ Enable:item.ChartTooltip.Enable, Type:item.ChartTooltip.Type };

        //点击表头弹出菜单
        if (IFrameSplitOperator.IsBool(item.EnablePopupHeaderMenu)) colItem.EnablePopupHeaderMenu=item.EnablePopupHeaderMenu;

        if (item.Sort==1 || item.Sort==2)   //1本地排序 2=远程排序
        {
            colItem.SortType=[1,2];         //默认 降序 ，升序
            if (IFrameSplitOperator.IsNonEmptyArray(item.SortType)) colItem.SortType=item.SortType.slice();
        }

        if (item.Type==REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            colItem.FormatType=0;   //0=默认格式 1=长度不够使用...
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;   //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            if (IFrameSplitOperator.IsNumber(item.FormatType)) colItem.FormatType=item.FormatType;   //输出样式
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;   //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            colItem.Decimal=2;
            colItem.FormatType=0;   //0=默认格式化 1=原始输出 2=科学计数 3=成交量格式化
            colItem.ColorType=0;    //0=默认使用TextColor,  1=（>0涨,<0跌）2=(>昨收涨,<昨收跌)
            if (IFrameSplitOperator.IsNumber(item.Decimal)) colItem.Decimal=item.Decimal;            //小数位数
            if (IFrameSplitOperator.IsNumber(item.FormatType)) colItem.FormatType=item.FormatType;   //输出样式
            if (IFrameSplitOperator.IsNumber(item.ColorType)) colItem.ColorType=item.ColorType;      //颜色属性
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_DATETIME_TEXT_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;   //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            colItem.FormatType=0;   //0=yyyy-mm-dd 1=YYYY/MM/DD
            colItem.ValueType=0;    //0=yyyymmdd 1=hhmmss
            if (IFrameSplitOperator.IsNumber(item.FormatType)) colItem.FormatType=item.FormatType;   //输出样式
            if (IFrameSplitOperator.IsNumber(item.ValueType)) colItem.FormatType=item.ValueType;   //输出样式
            
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_CHECKBOX_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;                  //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            if (item.CheckBox) colItem.CheckBox=CloneData(item.CheckBox);
            else colItem.CheckBox=this.CheckBoxConfig;
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_BUTTON_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;                  //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            if (item.Button) colItem.Button=CloneData(item.Button);
            else colItem.Button=this.ButtonConfig;
        }
        else if (this.IsReserveButtonColumn(item.Type))
        {
            if (item.Button) colItem.Button=CloneData(item.Button);
            else colItem.Button=this.ButtonConfig;
        }
        else if (this.IsReserveNumber(item.Type))
        {
            if (item.Format) colItem.Format=item.Format;    //数据格式化设置{ Type:1=原始 2=千分位分割 3=万亿转换, ExFloatPrecision:万亿转换以后的小数位数 }
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_PROGRESS_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;                  //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            if (item.ProgressBar) colItem.ProgressBar=CloneData(item.ProgressBar);
            else colItem.ProgressBar=this.ProgressBarConfig;
        }
        else if (this.IsReserveProgressBarColumn(item.Type))
        {
            if (item.ProgressBar) colItem.ProgressBar=CloneData(item.ProgressBar);
            else colItem.ProgressBar=this.ProgressBarConfig;
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_LINK_ID)
        {
            if (!IFrameSplitOperator.IsNumber(item.DataIndex) && !IFrameSplitOperator.IsNumber(item.BlockIndex)) return null;
            if (IFrameSplitOperator.IsNumber(item.DataIndex)) colItem.DataIndex=item.DataIndex;                  //数据在扩展数据索引列
            if (IFrameSplitOperator.IsNumber(item.BlockIndex)) colItem.BlockIndex=item.BlockIndex;
            if (item.Link) colItem.Link=CloneData(item.Link);
            else colItem.Link=this.LinkConfig;
        }
        else if (item.Type==REPORT_COLUMN_ID.CUSTOM_ICON_ID)
        {

        }
        else if (item.Type==REPORT_COLUMN_ID.CLOSE_LINE_ID)
        {
            if (IFrameSplitOperator.IsBool(item.IsDrawArea)) colItem.IsDrawArea=item.IsDrawArea;
        }
        else if(item.Type==REPORT_COLUMN_ID.TIME_ID)
        {
            if (IFrameSplitOperator.IsNumber(item.ValueType)) colItem.ValueType=item.ValueType;
        }
        else if (item.Type==REPORT_COLUMN_ID.DATE_ID)
        {
            if (IFrameSplitOperator.IsNumber(item.FormatType)) colItem.FormatType=item.FormatType;
        }
        else if (item.Type==REPORT_COLUMN_ID.MULTI_LINE_CONTAINER)
        {
            if (IFrameSplitOperator.IsNonEmptyArray(item.AryField)) colItem.AryField=item.AryField.slice();
        }

        return colItem;
    }

    this.SetColumn=function(aryColumn)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;

        this.Column=[];
        for(var i=0;i<aryColumn.length;++i)
        {
            var item=aryColumn[i];
            var colItem=this.CreateColumnItem(item);
            if (!colItem) continue;

            this.Column.push(colItem);
        }
    }

    this.SwapColumn=function(leftIndex, rightIndex)
    {
        if (!IFrameSplitOperator.IsNumber(leftIndex) || !IFrameSplitOperator.IsNumber(rightIndex)) return false;

        var count=this.Column.length;
        if (leftIndex<0 || leftIndex>=count) return false;
        if (rightIndex<0 || rightIndex>=count) return false;
        if (leftIndex==rightIndex) return;

        var tempItem=this.Column[leftIndex];
        this.Column[leftIndex]=this.Column[rightIndex];
        this.Column[rightIndex]=tempItem;

        return true;
    }

    this.DeleteColumn=function(index)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Column)) return false;
        if (index<0 || index>=this.Column.length) return false;
       
        this.Column.splice(index,1);
        return true;
    }

    this.ChangeColumn=function(index, newColumn)
    {
        if (index<0 || index>=this.Column.length) return false;

        var colItem=this.CreateColumnItem(newColumn);
        if (!colItem) return false;
        this.Column[index]=colItem;

        return true;
    }

    this.GetXScrollPos=function()
    {
        return this.Data.XOffset;
    }

    this.GetXScrollRange=function()
    {
        var maxOffset=this.Column.length-this.FixedColumn-3;
        if (maxOffset<0) return 0;

        return maxOffset;
    } 

    this.GetYScrollRange=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return 0;
        var dataCount=this.GetAllRowCount();

        var maxOffset=dataCount-this.RowCount;

        return maxOffset;
    }

    this.GetDefaultColunm=function(id)
    {
        var DEFAULT_COLUMN=
        [
            { Type:REPORT_COLUMN_ID.INDEX_ID, Title:"序号", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Index, MaxText:"8888"},
            { Type:REPORT_COLUMN_ID.SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null,  TextColor:g_JSChartResource.Report.FieldColor.Symbol, MaxText:"888888"},
            { Type:REPORT_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Name, MaxText:"擎擎擎擎0" },
            { Type:REPORT_COLUMN_ID.NAME_EX_ID, Title:"名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Name, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.SYMBOL_NAME_ID, Title:"股票名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Name, MaxText:"擎擎擎擎0"},
            { Type:REPORT_COLUMN_ID.SYMBOL_NAME_V2_ID, Title:"名称/代码", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.NameSymbolV2.Name.Color, MaxText:"擎擎擎擎*", MaxText2:"999999", Space:5, TextColor2:g_JSChartResource.Report.NameSymbolV2.Symbol.Color },

            { Type:REPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.PRICE_ID, Title:"现价", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.UPDOWN_ID, Title:"涨跌", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.AMPLITUDE_ID, Title:"振幅%", TextAlign:"right", Width:null, MaxText:"888.88" },
            { Type:REPORT_COLUMN_ID.BUY_PRICE_ID, Title:"买价", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.SELL_PRICE_ID, Title:"卖价", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.AVERAGE_PRICE_ID, Title:"均价", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.OPEN_ID, Title:"今开", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.HIGH_ID, Title:"最高", TextAlign:"right", Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.LOW_ID, Title:"最低", TextAlign:"right",  Width:null, MaxText:"88888.88" },
            { Type:REPORT_COLUMN_ID.YCLOSE_ID, Title:"昨收", TextAlign:"right",  Width:null, MaxText:"88888.88" },

            { Type:REPORT_COLUMN_ID.VOL_ID, Title:"总量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.AMOUNT_ID, Title:"总金额", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Amount, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.EXCHANGE_RATE_ID, Title:"换手%", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"88.88擎" },

            { Type:REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID, Title:"流通股本", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.TOTAL_SHARES_ID, Title:"总股本", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID, Title:"流通市值", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.MARKET_VALUE_ID, Title:"总市值", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },

            
            { Type:REPORT_COLUMN_ID.VOL_IN_ID, Title:"内盘", TextAlign:"right", TextColor:g_JSChartResource.Report.DownTextColor, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.VOL_OUT_ID, Title:"外盘", TextAlign:"right", TextColor:g_JSChartResource.Report.UpTextColor, Width:null, MaxText:"8888.8擎" },

            { Type:REPORT_COLUMN_ID.CLOSE_LINE_ID, Title:"走势", TextAlign:"center", TextColor:g_JSChartResource.Report.CloseLineColor, Width:null, MaxText:"88888.88888" },


            { Type:REPORT_COLUMN_ID.BUY_VOL_ID, Title:"买量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.SELL_VOL_ID, Title:"卖量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
           
            //{ Type:REPORT_COLUMN_ID.MULTI_BAR_ID, Title:"柱子", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.BarTitle, MaxText:"888888" },
            //{ Type:REPORT_COLUMN_ID.CENTER_BAR_ID, Title:"柱子2", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.BarTitle, MaxText:"888888" },
            { Type:REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID, Title:"自定义", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID, Title:"自定义", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.CUSTOM_DATETIME_TEXT_ID, Title:"自定义", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999-99-99" },

            { Type:REPORT_COLUMN_ID.CUSTOM_ICON_ID, Title:"  ", TextAlign:"left", FixedWidth:20, TextColor:g_JSChartResource.Report.FieldColor.Text },
            { Type:REPORT_COLUMN_ID.KLINE_ID, Title:"K线", TextAlign:"left", FixedWidth:50, TextColor:g_JSChartResource.Report.FieldColor.Text },

            { Type:REPORT_COLUMN_ID.TIME_ID, Title:"时间", TextAlign:"left", ValueType:0, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"99:99:99.999" },
            { Type:REPORT_COLUMN_ID.DATE_ID, Title:"日期", TextAlign:"left", FormatType:0, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999-99-99" },

            { Type:REPORT_COLUMN_ID.CHECKBOX_ID, Title:"", TextAlign:"center", FixedWidth:20*GetDevicePixelRatio() },

            { Type:REPORT_COLUMN_ID.CUSTOM_CHECKBOX_ID, Title:"",  TextAlign:"center", FixedWidth:20*GetDevicePixelRatio() },

            { Type:REPORT_COLUMN_ID.CUSTOM_BUTTON_ID, Title:"", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.CUSTOM_PROGRESS_ID, Title:"进度条", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.CUSTOM_LINK_ID, Title:"链接地址", TextAlign:"center", MaxText:"擎擎擎擎擎" },

            { Type:REPORT_COLUMN_ID.FUTURES_POSITION_ID, Title:"持仓量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888888" },
            { Type:REPORT_COLUMN_ID.FUTURES_CLOSE_ID, Title:"结算价", TextAlign:"right", Width:null, MaxText:"8888888" },
            { Type:REPORT_COLUMN_ID.FUTURES_YCLOSE_ID, Title:"昨结算价", TextAlign:"right", Width:null, MaxText:"8888888" },
            { Type:REPORT_COLUMN_ID.FUTURES_OPEN_POSITION_ID, Title:"开仓量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888888" },
            { Type:REPORT_COLUMN_ID.FUTURES_CLOSE_POSITION_ID, Title:"平仓量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888888" },

            { Type:REPORT_COLUMN_ID.RISING_SPEED_1M_ID, Title:"涨速%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.RISING_SPEED_3M_ID, Title:"3分涨速%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.RISING_SPEED_5M_ID, Title:"5分涨速%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.RISING_SPEED_10M_ID, Title:"10分涨速%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.RISING_SPEED_15M_ID, Title:"15分涨速%", TextAlign:"right", Width:null, MaxText:"-888.88" },

            //组合多行字段
            { 
                Type:REPORT_COLUMN_ID.MULTI_LINE_CONTAINER, Title:"涨幅",TextAlign:"right", MaxText:"1000.00%",
                AryField:[ { Type:REPORT_COLUMN_ID.PRICE_ID},{ Type:REPORT_COLUMN_ID.INCREASE_ID, DynamicFormat:"{Value}%"} ] 
            },

            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"数值1", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"数值2", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER3_ID, Title:"数值3", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER4_ID, Title:"数值4", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER5_ID, Title:"数值5", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER6_ID, Title:"数值6", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER7_ID, Title:"数值7", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER8_ID, Title:"数值8", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER9_ID, Title:"数值9", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:REPORT_COLUMN_ID.RESERVE_NUMBER10_ID, Title:"数值10", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },

            { Type:REPORT_COLUMN_ID.RESERVE_STRING1_ID, Title:"文字1", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING2_ID, Title:"文字2", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING3_ID, Title:"文字3", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING4_ID, Title:"文字4", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING5_ID, Title:"文字5", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING6_ID, Title:"文字6", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING7_ID, Title:"文字7", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING8_ID, Title:"文字8", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING9_ID, Title:"文字9", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.RESERVE_STRING10_ID, Title:"文字10", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },


            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR1_ID, Title:"进度条1", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR2_ID, Title:"进度条2", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR3_ID, Title:"进度条3", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR4_ID, Title:"进度条4", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR5_ID, Title:"进度条5", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR6_ID, Title:"进度条6", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR7_ID, Title:"进度条7", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR8_ID, Title:"进度条8", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR9_ID, Title:"进度条9", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },
            { Type:REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR10_ID, Title:"进度条10", TextAlign:"center", FixedWidth:100*GetDevicePixelRatio()  },

            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON1_ID, Title:"按钮1", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON2_ID, Title:"按钮2", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON3_ID, Title:"按钮3", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON4_ID, Title:"按钮4", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON5_ID, Title:"按钮5", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON6_ID, Title:"按钮6", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON7_ID, Title:"按钮7", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON8_ID, Title:"按钮8", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON9_ID, Title:"按钮9", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            { Type:REPORT_COLUMN_ID.RESERVE_BUTTON10_ID, Title:"按钮10", TextAlign:"center", FixedWidth:50*GetDevicePixelRatio() },
            
        ];

        for(var i=0;i<DEFAULT_COLUMN.length;++i)
        {
            var item=DEFAULT_COLUMN[i];
            if (item.Type==id) return item;
        }

        return null;
    }

    this.ClipClient=function()
    {
        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(this.RectClient.Left,this.RectClient.Top,(this.RectClient.Right-this.RectClient.Left),(this.RectClient.Bottom-this.RectClient.Top));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();
    }

    this.Draw=function(lastMouseStatus)
    {
        this.ShowSymbol=[];
        this.TooltipRect=[];
        this.ButtonRect=[];
        this.AryFullSelectedRow=[];
        this.DevicePixelRatio=GetDevicePixelRatio()
        this.LastMouseStatus=lastMouseStatus;

        if (this.GlobalOption) this.GlobalOption.FlashBGCount=0;

        if (this.SizeChange) this.CalculateSize();
        else this.UpdateCacheData();

        this.ClipClient();

        this.DrawDragHeaderBG();
        this.DrawHeader();
        this.DrawBody();
        this.Canvas.restore();
        
        if (this.Tab && this.BottomToolbarHeight>0)
        {
            var bottom=this.ChartBorder.GetBottom();
            this.Tab.DrawTab(this.RectClient.Left,bottom-this.BottomToolbarHeight, this.RectClient.Right, bottom)
            this.Tab.DrawScrollbar(this.RectClient.Left,bottom-this.BottomToolbarHeight, this.RectClient.Right, bottom);
        }

        this.ClipClient();
        this.DrawBorder();
        this.DrawSelectedRow();
        this.Canvas.restore();

        this.DrawDragRow();

        this.DrawDragHeader();

        if (this.VScrollbar)
        {
            var bottom=this.ChartBorder.GetBottom();
            this.VScrollbar.DrawScrollbar(this.RectClient.Left,this.RectClient.Top+this.HeaderHeight, this.RectClient.Right, bottom-this.BottomToolbarHeight-4);
        }

        this.LastMouseStatus=null;
        this.SizeChange=false;
        this.AryFullSelectedRow=[];
    }

    this.DrawDragHeaderBG=function()
    {
        if (!this.DragHeader) return;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=top+this.HeaderHeight+this.RowHeight*this.RowCount+this.FixedRowHeight*this.FixedRowCount;

        //竖线
        var columnLeft=left;
        for(var i=0;i<this.FixedColumn && i<this.Column.length; ++i)
        {
            var item=this.Column[i];
            columnLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];

            if (this.DragHeader)
            {
                if (this.DragHeader.ClickData)
                {
                    var clickData=this.DragHeader.ClickData;
                    if (clickData.Header.Index==i)
                    {
                        var rtBG={ Left:columnLeft,Top:top, Bottom:bottom, Right:columnLeft+item.Width };
                        rtBG.Width=rtBG.Right-rtBG.Left;
                        rtBG.Height=rtBG.Bottom-rtBG.Top;
                        this.Canvas.fillStyle=this.DragSrcRowColor;
                        this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);   
                    }
                }
                
                if (this.DragHeader.MoveToData)
                {
                    var moveToData=this.DragHeader.MoveToData;
                    if (moveToData.Header.Index==i) 
                    {
                        var rtBG={ Left:columnLeft,Top:top, Bottom:bottom, Right:columnLeft+item.Width };
                        rtBG.Width=rtBG.Right-rtBG.Left;
                        rtBG.Height=rtBG.Bottom-rtBG.Top;
                        this.Canvas.fillStyle=this.DragMoveRowColor;
                        this.Canvas.fillRect(rtBG.Left, rtBG.Top, rtBG.Width, rtBG.Height);   
                    }
                }
            }

            columnLeft+=item.Width;
        }
    }

    //更新缓存变量
    this.UpdateCacheData=function()
    {
        this.RectClient.Left=this.ChartBorder.GetLeft();
        this.RectClient.Right=this.ChartBorder.GetRight();
        this.RectClient.Top=this.ChartBorder.GetTop();
        this.RectClient.Bottom=this.ChartBorder.GetBottom()-this.BottomToolbarHeight;
    }

    this.GetPageSize=function(recalculate) //recalculate 是否重新计算
    {
        if (recalculate) this.CalculateSize();
        var size=this.RowCount;
        return size;
    }

    this.GetCurrentPageStatus=function()    //{ Start:起始索引, End:结束索引（数据）, PageSize:页面可以显示几条记录, IsEnd:是否是最后一页, IsSinglePage:是否只有一页数据}
    {
        var result={ Start:this.Data.YOffset, PageSize:this.RowCount, IsEnd:false, SelectedRow:this.SelectedRow, IsSinglePage:false, DataCount:0, MultiSelectModel:this.MultiSelectModel };
        if (this.MultiSelectModel==1)
        {
            result.SelectedRow=-1;
            result.MultiSelectedRow=this.MultiSelectedRow.slice();
            result.MultiSelectedRow.sort((left, right)=>{ return left>right; });
        }

        if (IFrameSplitOperator.IsNonEmptyArray(this.Data.Data))
        {
            result.End=this.Data.YOffset+this.RowCount-1;
            result.IsSinglePage=this.Data.Data.length<=this.RowCount;
            result.DataCount=this.Data.Data.length;
            if (result.End>=this.Data.Data.length-1) result.IsEnd=true;
            if (result.End>=this.Data.Data.length) result.End=this.Data.Data.length-1;
        }
        else
        {
            result.Start=0;
            result.End=0;
            result.IsEnd=true;
            result.IsSinglePage=true;
        }

        return result;
    }

    this.CalculateSize=function()   //计算大小
    {
        if (this.Tab && this.Tab.IsShow)
        {
            this.Tab.CalculateSize();
            this.BottomToolbarHeight=this.Tab.Height;
        }
        else
        {
            this.BottomToolbarHeight=0;
        }

        if (this.VScrollbar && this.VScrollbar.Enable) this.VScrollbar.CalculateSize();

        this.UpdateCacheData();

        var pixelRatio=GetDevicePixelRatio();
        this.HeaderFont=`${this.HeaderFontConfig.Size*pixelRatio}px ${ this.HeaderFontConfig.Name}`;
        this.ItemFont=`${this.ItemFontConfig.Size*pixelRatio}px ${ this.ItemFontConfig.Name}`;
        this.ItemFixedFont=`${this.ItemFixedFontConfg.Size*pixelRatio}px ${ this.ItemFixedFontConfg.Name}`;
        this.ItemSymbolFont=`${this.ItemSymbolFontConfig.Size*pixelRatio}px ${ this.ItemSymbolFontConfig.Name}`;
        this.ItemNameFont=`${this.ItemNameFontConfg.Size*pixelRatio}px ${ this.ItemNameFontConfg.Name}`;

        this.NameSymbolFont.Symbol=`${this.NameSymbolV2Config.Symbol.Size*pixelRatio}px ${this.NameSymbolV2Config.Symbol.Name}`;
        this.NameSymbolFont.Name=`${this.ItemSymbolFontConfig.Name.Size*pixelRatio}px ${this.NameSymbolV2Config.Name.Name}`;

        this.ItemFontHeight=this.GetFontHeight(this.ItemFont,"擎");
        this.RowHeight=this.ItemFontHeight+ this.ItemMergin.Top+ this.ItemMergin.Bottom;
        this.ItemTextLines=1;
        this.FixedRowHeight=this.GetFontHeight(this.ItemFixedFont,"擎")+ this.ItemMergin.Top+ this.ItemMergin.Bottom;
        this.SortFont=`${this.SortConfig.Size*pixelRatio}px ${ this.SortConfig.Family}`;

        this.Canvas.font=this.ItemFont;
        var itemWidth=0;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (item.Type==REPORT_COLUMN_ID.SYMBOL_NAME_ID)
            {
                this.Canvas.font=this.ItemNameFont;
                var nameWidth=this.Canvas.measureText(item.MaxText).width;
                var nameHeight=this.GetFontHeight(this.ItemNameFont,"擎");
                this.ItemNameHeight=nameHeight;

                this.Canvas.font=this.ItemSymbolFont;
                var symbolWidth=this.Canvas.measureText(item.MaxText).width;
                var symboHeight=this.GetFontHeight(this.ItemSymbolFont,"擎");
                this.ItemSymbolHeight=symboHeight;

                this.Canvas.font=this.ItemFont;

                itemWidth=Math.max(nameWidth, symbolWidth);
                item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;

                var rowHeight=nameHeight+symboHeight+this.ItemMergin.Top+ this.ItemMergin.Bottom;
                this.ItemTextLines=2;
                if (rowHeight>this.RowHeight) this.RowHeight=rowHeight;
                if (rowHeight>this.FixedRowHeight) this.FixedRowHeight=rowHeight;
            }
            else if (item.Type==REPORT_COLUMN_ID.MULTI_LINE_CONTAINER)
            {
                if (IFrameSplitOperator.IsNumber(item.FixedWidth)) itemWidth=item.FixedWidth;
                else itemWidth=this.Canvas.measureText(item.MaxText).width;

                item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;
                this.ItemTextLines=item.AryField.length;
                var rowHeight=(this.ItemFontHeight*item.AryField.length)+this.ItemMergin.Top+ this.ItemMergin.Bottom;
                if (rowHeight>this.RowHeight) this.RowHeight=rowHeight;
                if (rowHeight>this.FixedRowHeight) this.FixedRowHeight=rowHeight;
            }
            else if (item.Type==REPORT_COLUMN_ID.SYMBOL_NAME_V2_ID) //单行显示
            {
                this.Canvas.font==this.NameSymbolFont.Name;
                var nameWidth=this.Canvas.measureText(item.MaxText).width;
                var nameHeight=this.GetFontHeight(this.ItemNameFont,"擎");
                

                this.Canvas.font==this.NameSymbolFont.Symbol;
                var symbolWidth=this.Canvas.measureText(item.MaxText2).width;
                var symboHeight=this.GetFontHeight(this.ItemSymbolFont,"擎");

                this.ItemNameHeight=Math.abs(nameHeight,symboHeight);

                var space=2;
                if (IFrameSplitOperator.IsNumber(item.Space)) space=item.Space;
                itemWidth=nameWidth+symbolWidth+space;
                
                item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;
            }
            else
            {
                if (IFrameSplitOperator.IsNumber(item.FixedWidth)) itemWidth=item.FixedWidth;
                else itemWidth=this.Canvas.measureText(item.MaxText).width;

                item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;
            }

            if (item.Icon && item.Icon.Symbol)
            {
                item.Width+=item.Icon.Size;
                if (item.Icon.Margin)
                {
                    var margin=item.Icon.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) item.Width+=margin.Left;
                    if (IFrameSplitOperator.IsNumber(margin.Right)) item.Width+=margin.Right;
                } 
            }
        }

        this.Canvas.font=this.HeaderFont;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (!item.Title || item.Title.length<=0) continue;
            var text=item.Title;
            itemWidth=this.Canvas.measureText(text).width;
            if (item.Sort>0) itemWidth+=this.SortConfig.Size*pixelRatio;
            
            itemWidth+=(4+this.HeaderMergin.Left+this.HeaderMergin.Right);
            if (item.Width<itemWidth) item.Width=itemWidth;
        }

        this.HeaderFontHeight=this.GetFontHeight(this.HeaderFont,"擎");
        if (this.HeaderRowCount<=1) //单行
        {
            this.HeaderHeight=this.HeaderFontHeight+(this.HeaderMergin.Top+this.HeaderMergin.Bottom);
        }
        else
        {
            this.HeaderHeight=(this.HeaderFontHeight*this.HeaderRowCount)+(this.HeaderMergin.Top+this.HeaderMergin.Bottom);
        }


        if (!this.IsShowHeader) this.HeaderHeight=0;
        if (this.FixedRowCount<=0) this.FixedRowHeight=0;
        
        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top-this.HeaderHeight-(this.FixedRowHeight*this.FixedRowCount))/this.RowHeight);

        var subWidth=0;
        var reportWidth=this.RectClient.Right-this.RectClient.Left;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            subWidth+=item.Width;
        }

        this.IsShowAllColumn=(subWidth<reportWidth);
    }

    this.DrawHeaderItem=function(column, rtCell, index, option)
    {
        if (column.HeaderBGColor)     //背景色
        {
            this.DrawItemBG({ Rect:rtCell, BGColor:column.HeaderBGColor });
        }

        var textWidth=rtCell.Width-this.HeaderMergin.Left-this.HeaderMergin.Right;
        //AryText=[ { Text:标题, Sort:{Type:排序}, Icon:图标 }]
        var drawInfo={ Rect:rtCell, AryText:[ { Text:null} ], YText:rtCell.Bottom-this.HeaderMergin.Bottom, Index:index, TextWidth:textWidth };

        if (this.HeaderRowCount>1)  //多行
        {
            if (IFrameSplitOperator.IsNonEmptyArray(column.AryTitle))
            {
                drawInfo.AryText=[];
                for(var i=0;i<column.AryTitle.length && i<this.HeaderRowCount;++i)
                {
                    var text=column.AryTitle[i];
                    drawInfo.AryText.push({ Text:text } );
                }
                drawInfo.YText-=((this.HeaderRowCount-1)*this.HeaderFontHeight);
            }
            else
            {
                if (column.Title) drawInfo.AryText[0].Text=column.Title;
                drawInfo.YText=rtCell.Bottom-this.HeaderMergin.Bottom-(this.HeaderRowCount*this.HeaderFontHeight)/2+this.HeaderFontHeight/2;
            }
        }
        else    //单行
        {
            if (column.Title) drawInfo.AryText[0].Text=column.Title;
        }

        var lastItem=drawInfo.AryText[drawInfo.AryText.length-1];

        //排序
        var bDrawSortBG=this.IsDrawSortBGIcon();
        if (this.SortInfo && this.SortInfo.Field==index && this.SortInfo.Sort>0) lastItem.Sort={ Type:this.SortInfo.Sort };
        else if (column.Sort>0 && bDrawSortBG && IFrameSplitOperator.IsNonEmptyArray(column.SortType) && column.SortType.length>=2) lastItem.Sort={ Type:0 };

        //图标
        if (column.Icon) lastItem.Icon=column.Icon;

        if (option)
        {
            if (option.HeaderColor) drawInfo.HeaderColor=option.HeaderColor;
        }

        this.DrawHeaderText(column, drawInfo);
    }

    this.DrawHeaderText=function(column, drawInfo)
    {
        if (drawInfo.HeaderColor) this.Canvas.fillStyle=drawInfo.HeaderColor;
        else if (column.HeaderColor) this.Canvas.fillStyle=column.HeaderColor;
        else this.Canvas.fillStyle=this.HeaderColor;

        var pixelRatio=GetDevicePixelRatio();
        var cellWidth=drawInfo.Rect.Width;
        var bDrawSortBG=this.IsDrawSortBGIcon();
        
        var y=drawInfo.YText;
        for(var i=0;i<drawInfo.AryText.length;++i)
        {
            var x=drawInfo.Rect.Left+this.HeaderMergin.Left;
            var item=drawInfo.AryText[i];
            var textSize={ TextMaxWidth:drawInfo.TextWidth };

            var iconWidth=0;
            if (item.Icon && item.Icon.Symbol)  //图标
            {
                var iconWidth=item.Icon.Size;
                if (item.Icon.Margin)
                {
                    var margin=item.Icon.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) iconWidth+=margin.Left;
                    if (IFrameSplitOperator.IsNumber(margin.Right)) iconWidth+=margin.Right;
                }
            }
            if (iconWidth>0) textSize.TextMaxWidth-=iconWidth;

            var sortWidth=0;    //排序图标
            if (item.Sort && this.SortConfig && IFrameSplitOperator.IsPlusNumber(this.SortConfig.Size))
            {
                sortWidth=this.SortConfig.Size*pixelRatio;
                if (this.SortConfig.Margin)
                {
                    var margin=this.SortConfig.Margin;
                    if (IFrameSplitOperator.IsNumber(margin.Left)) sortWidth+=margin.Left;
                    if (IFrameSplitOperator.IsNumber(margin.Right)) sortWidth+=margin.Right;
                }
            }
            if (sortWidth>0) textSize.TextMaxWidth-=sortWidth;
            

            var textWidth=0;
            if (item.Text) 
            {
                this.Canvas.font=this.HeaderFont;
                textWidth=this.Canvas.measureText(item.Text).width;
            }

            if (column.TextAlign=='center') x=x+(cellWidth-textWidth)/2;
            else if (column.TextAlign=='right') x=x+textSize.TextMaxWidth-textWidth;
            
            if (item.Text)      //文字
            {
                this.Canvas.fillText(item.Text,x,y);
                x+=textWidth;
            }

            if (sortWidth>1)    //排序
            {
                this.Canvas.font=this.SortFont;
                var xSort=x;
                if (this.SortConfig.Margin && IFrameSplitOperator.IsNumber(this.SortConfig.Margin.Left)) xSort+=this.SortConfig.Margin.Left;
                if (item.Sort.Type!=0 && bDrawSortBG)   //背景
                {
                    var sortText=this.SortConfig.Arrow[0];
                    var sortColor=this.SortConfig.Color[0];
                    this.Canvas.fillStyle=sortColor;
                    this.Canvas.fillText(sortText,xSort,y-this.SortConfig.Margin.Bottom);
                }

                var sortText=this.SortConfig.Arrow[item.Sort.Type];
                var sortColor=this.SortConfig.Color[item.Sort.Type];
                this.Canvas.fillStyle=sortColor;
                this.Canvas.fillText(sortText,xSort,y-this.SortConfig.Margin.Bottom);
                x+=sortWidth;
            }

            if (iconWidth>1)    //图标
            {
                var icon=item.Icon;
                var iconFont=`${icon.Size}px ${icon.Family}`;
                this.Canvas.font=iconFont;
                if (icon.Color) this.Canvas.fillStyle=icon.Color;
                var yOffset=0, xOffset=0;
                if (icon.Margin && IFrameSplitOperator.IsNumber(icon.Margin.Left)) xOffset=icon.Margin.Left;
                if (icon.Margin && IFrameSplitOperator.IsNumber(icon.Margin.Bottom)) yOffset=-icon.Margin.Bottom;
                this.Canvas.fillText(icon.Symbol, x+xOffset, y+yOffset);

                if (icon.Tooltip)
                {
                    var rtIcon={ Left:x+xOffset, Bottom:y+yOffset, Width:icon.Size, Height:icon.Size };
                    rtIcon.Right=rtIcon.Left+rtIcon.Width;
                    rtIcon.Top=rtIcon.Bottom-rtIcon.Height;
        
                    var tooltipData={ Rect:rtIcon, Type:2, Column:column, Index:drawInfo.Index, Data:icon.Tooltip.Data };
                    this.TooltipRect.push(tooltipData);
                }
            }

            y+=this.HeaderFontHeight;
        }
    }

    this.DrawHeader=function()
    {
        if (!this.IsShowHeader) return;

        var left=this.RectClient.Left;
        var top=this.RectClient.Top;
        this.Canvas.font=this.HeaderFont;
        
        var textLeft=left;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="bottom";
        //固定列
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width;
            //var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;

            var rtCell={ Left:textLeft, Width:itemWidth, Top:top, Height:this.HeaderHeight };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;

            this.DrawHeaderItem(item, rtCell, i);
            textLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width;
            //var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;

            var rtCell={ Left:textLeft, Width:itemWidth, Top:top, Height:this.HeaderHeight };
            rtCell.Right=rtCell.Left+rtCell.Width;
            rtCell.Bottom=rtCell.Top+rtCell.Height;

            this.DrawHeaderItem(item, rtCell, i);
            textLeft+=item.Width;
        } 
    }

    //是否绘制排序背景图标
    this.IsDrawSortBGIcon=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.SortConfig.Arrow)) return false;
        if (!this.SortConfig.Arrow[0]) return false;

        if (!IFrameSplitOperator.IsNonEmptyArray(this.SortConfig.Color)) return false;
        if (!this.SortConfig.Color[0]) return false;

        return true;
    }

    this.DrawBorder=function()
    {
        if (!this.IsDrawBorder) return;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=this.RectClient.Bottom;

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.beginPath();
       
        this.Canvas.moveTo(left,ToFixedPoint(top+this.HeaderHeight));
        this.Canvas.lineTo(right,ToFixedPoint(top+this.HeaderHeight));

        var rowTop=top+this.HeaderHeight+this.RowHeight;
        var rotBottom=rowTop;
        for(var i=0;i<this.FixedRowCount;++i)
        {
            var drawTop=ToFixedPoint(rowTop);
            this.Canvas.moveTo(left,drawTop);
            this.Canvas.lineTo(right,drawTop);
            rotBottom=rowTop;
            rowTop+=this.FixedRowHeight;
        }

        var rowTop=top+this.HeaderHeight+this.RowHeight+this.FixedRowHeight*this.FixedRowCount;
        var rotBottom=rowTop;
        //横线
        for(var i=0;i<this.RowCount;++i)
        {
            var drawTop=ToFixedPoint(rowTop);
            this.Canvas.moveTo(left,drawTop);
            this.Canvas.lineTo(right,drawTop);
            rotBottom=rowTop;
            rowTop+=this.RowHeight;
        }

        //竖线
        var columnLeft=left;
        for(var i=0;i<this.FixedColumn && i<this.Column.length; ++i)
        {
            var item=this.Column[i];
            var drawLeft=ToFixedPoint(columnLeft+item.Width);
            this.Canvas.moveTo(drawLeft,top);
            this.Canvas.lineTo(drawLeft,rotBottom);

            columnLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var drawLeft=ToFixedPoint(columnLeft+item.Width);
            this.Canvas.moveTo(drawLeft,top);
            this.Canvas.lineTo(drawLeft,rotBottom);

            columnLeft+=item.Width;
        }

        this.Canvas.stroke();
    }

    //获取一共多少行
    this.GetAllRowCount=function()
    {
        var count=this.Data.Data.length;
        if (this.Data.Virtual && this.Data.Virtual.Enable) count=this.Data.Virtual.Count;
        return count;
    }

    this.DrawBody=function()
    {
        if (!this.Data) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data) && !this.Data.Virtual.Enable) return;

        this.Canvas.font=this.ItemFont;
        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;

        var arySelectedRow=[];

        //固定行
        var textTop=top;
        this.Canvas.font=this.ItemFixedFont;
        for(var i=0; i<this.FixedRowCount; ++i)
        {
            if (this.SelectedFixedRow==i)
            {
                this.Canvas.fillStyle=this.SelectedColor;;
                this.Canvas.fillRect(left,textTop,rowWidth,this.FixedRowHeight);   
            }

            if (this.FixedRowData.Type==1)
                this.DrawFixedSymbolRow(textTop,i);
            else
                this.DrawFixedRow(textTop, i);
            
            textTop+=this.FixedRowHeight;
        }
        

        textTop=top+this.FixedRowHeight*this.FixedRowCount;
        this.Canvas.font=this.ItemFont;

        var eventDrawBG=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_REPORT_ROW_BG);
        var selectedSymbol=this.GetSelectedSymbol();

        var setSelected;
        if (this.MultiSelectModel==1) setSelected=new Set(this.MultiSelectedRow);

        var dataCount=this.GetAllRowCount();
        for(var i=this.Data.YOffset, j=0; i<dataCount && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];

            var bFillRow=false;
            if (this.MultiSelectModel==1)
            {
                if (setSelected.has(i)) bFillRow=true;
            }
            else
            {
                if (this.SelectedModel==0)
                {
                    if (j==this.SelectedRow) bFillRow=true; //选中行
                }
                else
                {
                    if (i==this.SelectedRow) bFillRow=true; //选中行
                }
            }
            

            if (this.DragRow)
            {
                if (this.DragRow.Data)
                {
                    var dataIndex=this.DragRow.Data.Row.DataIndex;
                    if (dataIndex==i)
                    {
                        this.Canvas.fillStyle=this.DragSrcRowColor;
                        this.Canvas.fillRect(left,textTop,rowWidth,this.RowHeight);  
                    }
                }

                if (this.DragRow.MoveRow)
                {
                    var dataIndex=this.DragRow.MoveRow.Data.DataIndex;
                    if (dataIndex==i)
                    {
                        this.Canvas.fillStyle=this.DragMoveRowColor;
                        this.Canvas.fillRect(left,textTop,rowWidth,this.RowHeight);  
                    }
                }

                bFillRow=false;
            }

            if (eventDrawBG && eventDrawBG.Callback)
            {
                //Out:{ BGColor: } 
                var sendData={ RowIndex:i, Symbol:symbol, Out:null, Selected:selectedSymbol, MultiSelectModel:this.MultiSelectModel };
                eventDrawBG.Callback(eventDrawBG,sendData,this);
                if (sendData.Out && sendData.Out.BGColor)
                {
                    this.Canvas.fillStyle=sendData.Out.BGColor;
                    this.Canvas.fillRect(left,textTop,rowWidth,this.RowHeight);   
                }
            }

            if (bFillRow)
            {
                var rtRowBG={ Left:left, Top:textTop, Width:rowWidth, Height:this.RowHeight };
                rtRowBG.Right=rtRowBG.Left+rtRowBG.Width;
                rtRowBG.Bottom=rtRowBG.Top+rtRowBG.Height;
                this.AryFullSelectedRow.push(rtRowBG);

                if (this.SelectedStyle===1)
                {
                    this.Canvas.fillStyle=this.SelectedColor;
                    this.Canvas.fillRect(rtRowBG.Left,rtRowBG.Top,rtRowBG.Width,rtRowBG.Height);   
                }
            }

            this.DrawRow(symbol, textTop, i);

            this.ShowSymbol.push( { Index:i, Symbol:symbol } );

            textTop+=this.RowHeight;
        }

        
    }

    this.DrawSelectedRow=function()
    {
        if (this.SelectedStyle===2 && IFrameSplitOperator.IsNonEmptyArray(this.AryFullSelectedRow))
        {
            this.Canvas.fillStyle=this.SelectedLineConfig.Color;
            var lineWidth=this.SelectedLineConfig.Width;
            for(var i=0;i<this.AryFullSelectedRow.length;++i)
            {
                var rtBG=this.AryFullSelectedRow[i];
                this.Canvas.fillRect(rtBG.Left,rtBG.Bottom-lineWidth,rtBG.Width,lineWidth); 
            }
        }
    }

    this.GetSelectedSymbol=function()
    {
        if (this.MultiSelectModel==1)
        {
            if (!IFrameSplitOperator.IsNonEmptyArray(this.MultiSelectedRow)) return null;

            var aryData=[];
            for(var i=0;i<this.MultiSelectedRow.length;++i)
            {
                var item=this.Data.Data[this.MultiSelectedRow[i]];
                if (!item) continue;

                aryData.push(item);
            }

            return aryData;
        }
        else
        {
            if (this.SelectedRow<0) return null;

            var index=this.SelectedRow;
            if (this.SelectedModel==0)  //当前屏选中
                index=this.Data.YOffset+this.SelectedRow;
    
            var symbol=this.Data.Data[index];
            return [symbol];
        }
    }


    this.DrawFixedSymbolRow=function(top, dataIndex)
    { 
        var left=this.RectClient.Left;
        var chartRight=this.RectClient.Right;

        if (!this.FixedRowData || !IFrameSplitOperator.IsNonEmptyArray(this.FixedRowData.Symbol)) return;
        var symbol=this.FixedRowData.Symbol[dataIndex];
        if (!symbol) return;

        this.DrawRow(symbol, top, dataIndex, 1);

        this.ShowSymbol.push( { Index:dataIndex, Symbol:symbol, RowType:1 } );
    }


    this.DrawFixedRow=function(top, dataIndex)
    {
        var left=this.RectClient.Left;
        var chartRight=this.RectClient.Right;

        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawFixedItem(dataIndex, i, item, left, top);
            left+=item.Width;

            if (left>=chartRight) break;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawFixedItem(dataIndex, i, item, left, top);
            left+=item.Width;

            if (left>=chartRight) break;
        }
    }

    this.DrawFixedItem=function(dataIndex, colIndex, column, left, top)
    {
        var x=left+this.ItemMergin.Left;
        var textWidth=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var drawInfo={ Text:null, TextColor:column.TextColor , TextAlign:column.TextAlign };

        if (this.GetFixedRowTextDrawInfo(dataIndex, colIndex, column, drawInfo)) 
        {
            this.DrawItemText(drawInfo.Text, drawInfo.TextColor, drawInfo.TextAlign, x, top, textWidth);
            return;
        }

        if (!this.FixedRowData || !IFrameSplitOperator.IsNonEmptyArray(this.FixedRowData.Data)) return;

        var data=this.FixedRowData.Data;
        var rowData=data[dataIndex];
        if (!IFrameSplitOperator.IsNonEmptyArray(rowData)) return;
        var itemData=rowData[colIndex];
        if (!itemData || !itemData.Text) return;

        drawInfo.Text=itemData.Text;
        if (itemData.Color) drawInfo.TextColor=itemData.Color;
        if (itemData.TextAlign) drawInfo.TextAlign=itemData.TextAlign;

        this.DrawItemText(drawInfo.Text, drawInfo.TextColor, drawInfo.TextAlign, x, top, textWidth);
    }

    this.DrawRow=function(symbol, top, dataIndex, rowType)  //rowType 0=表格行 1=顶部固定行 2=拖拽行
    {
        var left=this.RectClient.Left;
        var chartRight=this.RectClient.Right;
        var data= { Symbol:symbol , Stock:null, Block:null };
        if (this.GetStockDataCallback) data.Stock=this.GetStockDataCallback(symbol);
        if (this.GetBlockDataCallback) data.Block=this.GetBlockDataCallback(symbol);
        if (this.GetFlashBGDataCallback) data.FlashBG=this.GetFlashBGDataCallback(symbol, Date.now());
        data.Decimal=GetfloatPrecision(symbol); //小数位数

        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top, rowType, i);
            left+=item.Width;

            if (left>=chartRight) break;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top, rowType, i);
            left+=item.Width;

            if (left>=chartRight) break;
        }
    }

    this.BuildSubCellTextData=function(subItem, column, stock, drawInfo, data, option)
    {
        switch(subItem.Type)
        {
            case REPORT_COLUMN_ID.NAME_ID:
                if (stock && stock.Name) drawInfo.Text=stock.Name;
                else drawInfo.Text=data.Name;
                break;
            case REPORT_COLUMN_ID.SYMBOL_ID:
                if (stock && stock.Symbol) drawInfo.Text=stock.Symbol;
                else drawInfo.Text=data.Symbol;
                break;

            case REPORT_COLUMN_ID.PRICE_ID:
            case REPORT_COLUMN_ID.OPEN_ID:
            case REPORT_COLUMN_ID.HIGH_ID:
            case REPORT_COLUMN_ID.LOW_ID:
            case REPORT_COLUMN_ID.YCLOSE_ID:
            case REPORT_COLUMN_ID.BUY_PRICE_ID:
            case REPORT_COLUMN_ID.SELL_PRICE_ID:
            case REPORT_COLUMN_ID.AVERAGE_PRICE_ID:
            case REPORT_COLUMN_ID.FUTURES_CLOSE_ID:
            case REPORT_COLUMN_ID.FUTURES_YCLOSE_ID:
                var fieldName=MAP_COLUMN_FIELD.get(subItem.Type);
                if (stock && IFrameSplitOperator.IsNumber(stock[fieldName])) this.GetPriceDrawInfo(stock[fieldName], stock, data, drawInfo, option);
                break;

            case REPORT_COLUMN_ID.INCREASE_ID:
            case REPORT_COLUMN_ID.AMPLITUDE_ID:
            case REPORT_COLUMN_ID.UPDOWN_ID:
            case REPORT_COLUMN_ID.RISING_SPEED_1M_ID:
            case REPORT_COLUMN_ID.RISING_SPEED_3M_ID:
            case REPORT_COLUMN_ID.RISING_SPEED_5M_ID:
            case REPORT_COLUMN_ID.RISING_SPEED_10M_ID:
            case REPORT_COLUMN_ID.RISING_SPEED_15M_ID:
                var fieldName=MAP_COLUMN_FIELD.get(subItem.Type);
                if (stock && IFrameSplitOperator.IsNumber(stock[fieldName]))
                {
                    var value=stock[fieldName];
                    var text=value.toFixed(2);
                    if (subItem.DynamicFormat)
                        text=subItem.DynamicFormat.replace('{Value}',text);
                    
                    drawInfo.Text=text
                    drawInfo.TextColor=this.GetUpDownColor(value,0);
                }
                break;
        }
    }

    this.DrawSubCellText=function(drawInfo, column, rtText)
    {
        if (!drawInfo.Text) return;

        var text=drawInfo.Text;
        var x=rtText.Left;
        if (drawInfo.TextAlign=='center')
        {
            x=rtText.Left+rtText.Width/2;
            this.Canvas.textAlign="center";
        }
        else if (drawInfo.TextAlign=='right')
        {
            x=rtText.Left+rtText.Width-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        var bClip=false;

        this.Canvas.textBaseline="bottom";
        this.Canvas.fillStyle=drawInfo.TextColor;
        this.Canvas.fillText(text,x,rtText.Bottom);

        if (bClip) this.Canvas.restore();
    }

    this.DrawItem=function(index, data, column, left, top, rowType, columnIndex)
    {
        var itemWidth=column.Width;
        var x=left+this.ItemMergin.Left;
        var textWidth=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var stock=data.Stock;
        var drawInfo=
        { 
            Text:null, TextColor:column.TextColor , TextAlign:column.TextAlign, Tooltip:null, 
            Index:index, ColumnIndex:columnIndex
        };
        var rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
        rtItem.Right=rtItem.Left+rtItem.Width;
        rtItem.Bottom=rtItem.Top+rtItem.Height;
        drawInfo.Rect=rtItem;

        if (column.FullColBGColor)
        {
            this.DrawItemBG({ Rect:rtItem, BGColor:column.FullColBGColor });
        }
        
        if (column.Type==REPORT_COLUMN_ID.INDEX_ID)
        {
            if (rowType==1) return; //固定行序号空
            drawInfo.Text=(index+1).toString();
        }
        else if (column.Type==REPORT_COLUMN_ID.SYMBOL_ID)
        {
            if (stock && stock.Symbol) drawInfo.Text=stock.Symbol;
            else drawInfo.Text=data.Symbol;

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.SYMBOL_NAME_ID)
        {
            this.DrawSymbolName(data, column, left, top, rowType);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.SYMBOL_NAME_V2_ID)
        {
            this.DrawSymbolNameV2(data, column, left, top, rowType);
            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.NAME_ID)
        {
            if (stock && stock.Name) 
            {
                if (IFrameSplitOperator.IsString(stock.Name))
                {
                    drawInfo.Text=this.TextEllipsis(stock.Name, textWidth, column.MaxText);
                    drawInfo.TextColor=this.GetNameColor(column,data.Symbol, rowType);
                }
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.NAME_EX_ID)    
        {
            //复杂格式 { Text:, Symbol:{ Family:'iconfont', Size:,  Data:[ { Text:'\ue631', Color:'#1c65db'}, ...] } ]}
            if (stock && stock.NameEx)
            {
                var nameEx=stock.NameEx;
                drawInfo.Text=this.TextEllipsis(nameEx.Text, textWidth, column.MaxText);
                drawInfo.TextColor=this.GetNameColor(column,data.Symbol, rowType);
                if (nameEx.Symbol) drawInfo.Symbol=nameEx.Symbol;
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.Price, stock, data, drawInfo, { LimitBG:true });

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.OPEN_ID)
        {
            //如果行情开盘价为涨停价或跌停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.Open, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.Open, stock, data, drawInfo,  { LimitBG:true });
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.HIGH_ID)
        {
            //如果行情最高价为涨停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.High, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.High, stock, data, drawInfo, { LimitBG:true });
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.LOW_ID)
        {
            //如果行情最低价为跌停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.Low, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.Low, stock, data, drawInfo, { LimitBG:true });
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.YCLOSE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.YClose, stock, data, drawInfo);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.BUY_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.BuyPrice, stock, data, drawInfo);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.FUTURES_CLOSE_ID || column.Type==REPORT_COLUMN_ID.FUTURES_YCLOSE_ID)
        {
            var fieldName=MAP_COLUMN_FIELD.get(column.Type);
            if (stock && IFrameSplitOperator.IsNumber(stock[fieldName]))
            {
                var value=stock[fieldName];
                this.GetPriceDrawInfo(value, stock, data, drawInfo);
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.SELL_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.SellPrice, stock, data, drawInfo);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.AVERAGE_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.AvPrice, stock, data, drawInfo);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.EXCHANGE_RATE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Exchange))
                drawInfo.Text=stock.Exchange.toFixed(2);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.BUY_VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.BuyVol)) drawInfo.Text=this.FormatVolString(stock.BuyVol);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.SELL_VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.SellVol)) drawInfo.Text=this.FormatVolString(stock.SellVol);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Vol)) drawInfo.Text=this.FormatVolString(stock.Vol);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_IN_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.VolIn)) drawInfo.Text=this.FormatVolString(stock.VolIn);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_OUT_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.VolOut)) drawInfo.Text=this.FormatVolString(stock.VolOut);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.TOTAL_SHARES_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.TotalShares)) drawInfo.Text=this.FormatVolString(stock.TotalShares);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.OutShares)) drawInfo.Text=this.FormatVolString(stock.OutShares);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID || column.Type==REPORT_COLUMN_ID.MARKET_VALUE_ID || column.Type==REPORT_COLUMN_ID.AMOUNT_ID)
        {
            var fieldName=MAP_COLUMN_FIELD.get(column.Type);
            if (stock && IFrameSplitOperator.IsNumber(stock[fieldName])) 
                drawInfo.Text=this.FormatVolString(stock[fieldName]);

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.INCREASE_ID || column.Type==REPORT_COLUMN_ID.AMPLITUDE_ID || column.Type==REPORT_COLUMN_ID.UPDOWN_ID ||
            column.Type==REPORT_COLUMN_ID.RISING_SPEED_1M_ID || column.Type==REPORT_COLUMN_ID.RISING_SPEED_3M_ID || column.Type==REPORT_COLUMN_ID.RISING_SPEED_5M_ID || 
            column.Type==REPORT_COLUMN_ID.RISING_SPEED_10M_ID || column.Type==REPORT_COLUMN_ID.RISING_SPEED_15M_ID )
        {
            var fieldName=MAP_COLUMN_FIELD.get(column.Type);
            if (stock && IFrameSplitOperator.IsNumber(stock[fieldName]))
            {
                var value=stock[fieldName];
                drawInfo.Text=value.toFixed(2);
                drawInfo.TextColor=this.GetUpDownColor(value,0);
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.FUTURES_POSITION_ID || column.Type==REPORT_COLUMN_ID.FUTURES_OPEN_POSITION_ID || column.Type==REPORT_COLUMN_ID.FUTURES_CLOSE_POSITION_ID)
        {
            //持仓量原始值输出
            var fieldName=MAP_COLUMN_FIELD.get(column.Type);
            if (stock && IFrameSplitOperator.IsNumber(stock[fieldName]))
            {
                var value=stock[fieldName];
                drawInfo.Text=value.toFixed(0);
            }

            this.FormatDrawInfo(column, stock, drawInfo, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID)
        {
            this.GetCustomStringDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID)
        {
            this.GetCustomNumberDrawInfo(data, column, drawInfo);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_DATETIME_TEXT_ID)
        {
            this.GetCustomDateTimeDrawInfo(data, column, drawInfo);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_ICON_ID)
        {
            this.GetCustomIconDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CLOSE_LINE_ID)
        {
            var rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            if (stock) this.DrawLine(stock.CloseLine, column, rtItem);
        }
        else if (column.Type==REPORT_COLUMN_ID.KLINE_ID)
        {
            var rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            this.DrawKLine(stock.KLine, column, rtItem, data);
        }
        else if (column.Type==REPORT_COLUMN_ID.TIME_ID)
        {
            this.FormaTimeDrawInfo(column, stock, drawInfo, data);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.DATE_ID)
        {
            this.FormaDateDrawInfo(column, stock, drawInfo, data);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CHECKBOX_ID)
        {
            rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            drawInfo.Rect=rtItem;
            drawInfo.Checked=false;
            drawInfo.Enable=true;
            drawInfo.CheckBox=this.CheckBoxConfig;
            drawInfo.Data=stock;
            if (stock && IFrameSplitOperator.IsBool(stock.Checked))
                drawInfo.Checked=stock.Checked;
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_CHECKBOX_ID)
        {
            rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            drawInfo.Rect=rtItem;

            this.GetCustomCheckBoxDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_BUTTON_ID)
        {
            rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            drawInfo.Rect=rtItem;
            
            this.GetCustomButtonDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_PROGRESS_ID)
        {
            rtItem={ Left:left, Top:top,  Width:column.Width, Height:this.RowHeight };
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            drawInfo.Rect=rtItem;
            
            this.GetCustomProgressBarDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_LINK_ID)
        {
            this.GetCustomLinkDrawInfo(data, column, drawInfo);
        }
        else if (this.IsReserveNumber(column.Type))
        {
            this.FormatReserveNumber(column, stock, drawInfo);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (this.IsReserveString(column.Type))
        {
            this.FormatReserveString(column, stock, drawInfo);
            this.FormatDrawInfoEvent(stock, data, column, drawInfo);
        }
        else if (this.IsReserveProgressBarColumn(column.Type))
        {
            this.FormatReserveProgressBar(column, stock, drawInfo);
        }
        else if (this.IsReserveButtonColumn(column.Type))
        {
            this.FormatReserveButton(column, stock, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.MULTI_LINE_CONTAINER)
        {
            if (IFrameSplitOperator.IsNonEmptyArray(column.AryField))
            {
                var yBottom=rtItem.Bottom-this.ItemMergin.Bottom-(column.AryField.length-1)*this.ItemFontHeight;
                var rtText={ Left:left+this.ItemMergin.Left, Width:textWidth, Height:this.ItemFontHeight, Bottom:yBottom };
                rtText.Right=rtText.Left+rtText.Width;
                rtText.Top=rtText.Bottom-rtText.Height;
                for(var k=0;k<column.AryField.length;++k)
                {
                    drawInfo.Text=null;
                    var subItem=column.AryField[k];
                    this.BuildSubCellTextData(subItem, column, stock, drawInfo, data);
                    this.DrawSubCellText(drawInfo, column, rtText);

                    rtText.Bottom+=this.ItemFontHeight;
                    rtText.Top+=this.ItemFontHeight;
                }
            }
        }
        

        //拖拽行颜色
        if (rowType==3) 
            drawInfo.TextColor=this.DragRowTextColor;

        if (drawInfo.Symbol)
        {
            this.DrawItemTextEx(drawInfo, x, top, textWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_ICON_ID)
        {
            this.DrawIconItem(drawInfo, x, top, textWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.CHECKBOX_ID || column.Type==REPORT_COLUMN_ID.CUSTOM_CHECKBOX_ID)
        {
            this.DrawCheckbox(drawInfo, left, top, itemWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_BUTTON_ID || this.IsReserveButtonColumn(column.Type))
        {
            this.DrawButton(drawInfo, left, top, itemWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_PROGRESS_ID || this.IsReserveProgressBarColumn(column.Type))
        {
            this.DrawProgressBar(drawInfo, left, top, itemWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_LINK_ID)
        {
            this.DrawLinkText(drawInfo, x, top, textWidth);
        }
        else if (column.Type==REPORT_COLUMN_ID.MULTI_LINE_CONTAINER)
        {

        }
        else
        {
            if (data.FlashBG && data.FlashBG.Data && column.ID!=undefined)
            {
                if (data.FlashBG.Data.has(column.ID))
                {
                    var flashItem=data.FlashBG.Data.get(column.ID);
                    var drawBG={ Rect:drawInfo.Rect , BGColor:flashItem.Color };
                    --flashItem.Count;
                    this.DrawItemBG(drawBG);

                    if (this.GlobalOption) ++this.GlobalOption.FlashBGCount;
                }
            }

            this.DrawItemBG(drawInfo);

            if (column.Type==REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID || this.IsReserveString(column.Type)) 
                this.DrawCustomText(drawInfo,column, x, top, textWidth);
            else
                this.DrawItemText(drawInfo.Text, drawInfo.TextColor, drawInfo.TextAlign, x, top, textWidth, drawInfo.BGColor);
        }

        //tooltip提示
        if (drawInfo.Tooltip)
        {
            //Type:1=数据截断
            var tooltipData={ Rect:rtItem, Stock:stock, Index:index, Column:column, RowType:rowType, Type:drawInfo.Tooltip.Type, Data:drawInfo.Tooltip.Data };
            this.TooltipRect.push(tooltipData);
        }
        else if (column.ChartTooltip && column.ChartTooltip.Enable && IFrameSplitOperator.IsNumber(column.ChartTooltip.Type))   //Type 20分时图 21K线图
        {
            var tooltipData={ Rect:rtItem, Stock:stock, Index:index, Column:column, RowType:rowType, Type:column.ChartTooltip.Type };
            this.TooltipRect.push(tooltipData);
        }

        if (drawInfo.Botton)
        {
            var buttonData={ Stock:stock, Index:index, ColumnIndex:columnIndex, Column:column, Rect:drawInfo.Botton.Rect, Type:drawInfo.Botton.Type, Data:drawInfo.Data };
            this.ButtonRect.push(buttonData);
        }
    }

    this.FormatDrawInfoEvent=function(stock, data, column, drawInfo)
    {
        if (!column.EnableFormatDrawInfoEvent) return;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_FORMAT_DRAW_INFO);
        if (!event || !event.Callback) return;

        var sendData=
        {
            Stock:stock, Column:column, Data:data,
            DrawInfo:drawInfo
        };

        event.Callback(event, sendData, this);
    }

    this.IsReserveProgressBarColumn=function(value)
    {
        var ARARY_TYPE=
        [
            REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR1_ID, REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR2_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR3_ID,
            REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR4_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR5_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR6_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR7_ID,
            REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR8_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR9_ID,REPORT_COLUMN_ID.RESERVE_PROGRESS_BAR10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

    this.IsReserveButtonColumn=function(value)
    {
        var ARARY_TYPE=
        [
            REPORT_COLUMN_ID.RESERVE_BUTTON1_ID, REPORT_COLUMN_ID.RESERVE_BUTTON2_ID,REPORT_COLUMN_ID.RESERVE_BUTTON3_ID,
            REPORT_COLUMN_ID.RESERVE_BUTTON4_ID,REPORT_COLUMN_ID.RESERVE_BUTTON5_ID,REPORT_COLUMN_ID.RESERVE_BUTTON6_ID,REPORT_COLUMN_ID.RESERVE_BUTTON7_ID,
            REPORT_COLUMN_ID.RESERVE_BUTTON8_ID,REPORT_COLUMN_ID.RESERVE_BUTTON9_ID,REPORT_COLUMN_ID.RESERVE_BUTTON10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

    this.IsReserveNumber=function(value)
    {
        var ARARY_TYPE=
        [
            REPORT_COLUMN_ID.RESERVE_NUMBER1_ID,REPORT_COLUMN_ID.RESERVE_NUMBER2_ID,REPORT_COLUMN_ID.RESERVE_NUMBER3_ID,
            REPORT_COLUMN_ID.RESERVE_NUMBER4_ID,REPORT_COLUMN_ID.RESERVE_NUMBER5_ID,REPORT_COLUMN_ID.RESERVE_NUMBER6_ID,REPORT_COLUMN_ID.RESERVE_NUMBER7_ID,
            REPORT_COLUMN_ID.RESERVE_NUMBER8_ID,REPORT_COLUMN_ID.RESERVE_NUMBER9_ID,REPORT_COLUMN_ID.RESERVE_NUMBER10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

    this.IsReserveString=function(value)
    {
        var ARARY_TYPE=
        [
            REPORT_COLUMN_ID.RESERVE_STRING1_ID,REPORT_COLUMN_ID.RESERVE_STRING2_ID,REPORT_COLUMN_ID.RESERVE_STRING3_ID,REPORT_COLUMN_ID.RESERVE_STRING4_ID,
            REPORT_COLUMN_ID.RESERVE_STRING5_ID,REPORT_COLUMN_ID.RESERVE_STRING6_ID,REPORT_COLUMN_ID.RESERVE_STRING7_ID,REPORT_COLUMN_ID.RESERVE_STRING8_ID,
            REPORT_COLUMN_ID.RESERVE_STRING9_ID,REPORT_COLUMN_ID.RESERVE_STRING10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

   

    this.DrawCustomText=function(drawInfo, column, left, top, cellWidth)
    {
        if (!drawInfo.Text) return;

        var text=drawInfo.Text;
        var x=left;
        if (drawInfo.TextAlign=='center')
        {
            x=left+cellWidth/2;
            this.Canvas.textAlign="center";
        }
        else if (drawInfo.TextAlign=='right')
        {
            x=left+cellWidth-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        var textWidth=this.Canvas.measureText(text).width+1;
        var bClip=false;
        if (textWidth>=cellWidth)   //长度超过单元格 裁剪
        {
            if (column.FormatType==2)
            {
                var count=text.length+5;
                text="";
                for(var i=0;i<count;++i)
                    text+="#";
            }
            else if (column.FormatType==1)
            {
                text=this.TextEllipsis(text, cellWidth, column.MaxText);
            }

            this.Canvas.save();
            bClip=true;

            var rtCell={ Left:left, Top:top+this.ItemMergin.Top, Width:cellWidth, Height:this.RowHeight };
            this.Canvas.beginPath();
            this.Canvas.rect(rtCell.Left, rtCell.Top, rtCell.Width, rtCell.Height);
            //this.Canvas.stroke(); //调试用
            this.Canvas.clip();

            //数据截断提示信息
            drawInfo.Tooltip=
            { 
                Type:1, 
                Data:{ AryText:[ {Text:drawInfo.Text} ] }
            }
        }

        this.Canvas.textBaseline="bottom";
        this.Canvas.fillStyle=drawInfo.TextColor;
        this.Canvas.fillText(text,x,top+this.RowHeight-this.ItemMergin.Bottom);

        if (bClip) this.Canvas.restore();
    }

    this.DrawSymbolName=function(data, column, left, top, rowType)
    {
        var stock=data.Stock;
        var symbol=IFrameSplitOperator.RemoveMarketSuffix(data.Symbol);
        var name;
        if (stock)
        {
            symbol=stock.Symbol;
            name=stock.Name;
        }

        if (!symbol && !name) return;

        var y=top+this.ItemMergin.Top+this.ItemNameHeight;
        var textLeft=left+this.ItemMergin.Left;
        var x=textLeft;
        var width=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var textAlign=column.TextAlign;
        if (textAlign=='center')
        {
            x=textLeft+width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=textLeft+width-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        var textColor=this.GetNameColor(column,symbol,rowType);
        var text=name;
        if (text)
        {
            this.Canvas.textBaseline="bottom";
            this.Canvas.fillStyle=textColor;
            this.Canvas.font=this.ItemNameFont;
            text=this.TextEllipsis(text, width, column.MaxText);
            if (text) this.Canvas.fillText(text,x,y);
        }
       
        text=symbol;
        if (text)
        {
            this.Canvas.textBaseline="bottom";
            this.Canvas.font=this.ItemSymbolFont;
            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(text,x,y+this.ItemSymbolHeight);
        }
        
        this.Canvas.font=this.ItemFont; //还原字体
    }

    this.DrawSymbolNameV2=function(data, column, left, top, rowType)
    {
        var stock=data.Stock;
        var symbol=IFrameSplitOperator.RemoveMarketSuffix(data.Symbol);
        var name;
        if (stock)
        {
            symbol=stock.Symbol;
            name=stock.Name;
        }

        if (!symbol && !name) return;

        var y=top+this.ItemMergin.Top+this.ItemNameHeight;
        var textLeft=left+this.ItemMergin.Left;
        var x=textLeft;
        var width=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var textAlign=column.TextAlign;
        if (textAlign=='center')
        {
            x=textLeft+width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=textLeft+width-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="bottom";

        var textColor=column.TextColor;
        var text=name;
        if (text)
        {
            this.Canvas.fillStyle=textColor;
            this.Canvas.font=this.NameSymbolFont.Name;
            text=this.TextEllipsis(text, width, column.MaxText);
            if (text) 
            {
                this.Canvas.fillText(text,x,y);
                var textWidth=this.Canvas.measureText(text).width;
                var space=2;
                if (IFrameSplitOperator.IsNumber(column.Space)) space=column.Space;
                x+=(textWidth+space);
            }
           
        }
       
        var textColor=column.TextColor2;
        text=symbol;
        if (text)
        {
            this.Canvas.font=this.NameSymbolFont.Symbol;
            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(text,x,y);
        }
        
        this.Canvas.font=this.ItemFont; //还原字体
    }

    this.DrawLimitPriceBorder=function(value, stock, left, top, itemWidth)
    {
        if (!IFrameSplitOperator.IsNumber(value) || !stock) return;

        var bDraw=false;
        if (IFrameSplitOperator.IsNumber(stock.LimitHigh))
        {
            if (value>=stock.LimitHigh) bDraw=true;
        }

        if (IFrameSplitOperator.IsNumber(stock.LimitLow))
        {
            if (value<=stock.LimitLow) bDraw=true;
        }

        if (!bDraw) return;

        var x=left+this.ItemMergin.Left+this.LimitMergin.Left;
        var width=itemWidth-this.ItemMergin.Left-this.ItemMergin.Right-this.LimitMergin.Left-this.LimitMergin.Right;
        var y=top+this.ItemMergin.Top+this.LimitMergin.Top;
        var height=this.RowHeight-this.ItemMergin.Top-this.ItemMergin.Bottom-this.LimitMergin.Top-this.LimitMergin.Bottom;

        this.Canvas.strokeStyle=this.LimitBorderColor;
        this.Canvas.strokeRect(ToFixedPoint(x),ToFixedPoint(y),ToFixedRect(width),ToFixedRect(height));
    }

    this.GetExtendData=function(data, column)
    {
        if (IFrameSplitOperator.IsNumber(column.DataIndex))
        {
            if (!data.Stock || !data.Stock.ExtendData) return null;
            if (column.DataIndex<0) return;
            return data.Stock.ExtendData[column.DataIndex];
        }

        if (IFrameSplitOperator.IsNumber(column.BlockIndex))
        {
            if (!data.Block) return;
            if (column.BlockIndex<0) return;
            return data.Block[column.BlockIndex];
        }
        
        return null;
    }

    this.GetCustomStringDrawInfo=function(data, column, drawInfo)
    {
        var value=this.GetExtendData(data, column);
        if (!IFrameSplitOperator.IsString(value)) return;
        drawInfo.Text=value;
    }

    this.GetCustomNumberDrawInfo=function(data, column, drawInfo)
    {
        var value=this.GetExtendData(data, column);
        if (!IFrameSplitOperator.IsNumber(value)) return;

        //格式化输出
        switch(column.FormatType)
        {
            case 1:
                drawInfo.Text=value.toFixed(column.Decimal);
                break;
            case 2:
                drawInfo.Text=IFrameSplitOperator.FormatValueThousandsString(value, column.Decimal);
                break;
            case 3:
                drawInfo.Text=this.FormatVolString(value);
                break;
            default:
                drawInfo.Text=IFrameSplitOperator.FormatValueString(value, column.Decimal);
                break;
        }  

        //颜色
        switch(column.ColorType)
        {
            case 1:
                drawInfo.TextColor=this.GetUpDownColor(value,0);
                break;
            case 2:
                if (!IFrameSplitOperator.IsNumber(data.Stock.YClose))  
                    drawInfo.TextColor=this.UnchagneColor;
                else  
                    drawInfo.TextColor=this.GetUpDownColor(value, data.Stock.YClose);
                break;
            default:
                break;
        }
    }

    this.GetCustomDateTimeDrawInfo=function(data, column, drawInfo)
    {
        var value=this.GetExtendData(data, column);
        if (!IFrameSplitOperator.IsNumber(value)) return;

        if (column.ValueType==0)
        {
            if (column.FormatType==1)
                drawInfo.Text=IFrameSplitOperator.FormatDateString(value,"YYYY/MM/DD");
            else
                drawInfo.Text=IFrameSplitOperator.FormatDateString(value);
        }
    }

    this.GetCustomIconDrawInfo=function(data, column, drawInfo)
    {
        if (column.IsDrawCallback)  //外部处理输出格式
        {
            this.GetCustomIconData(column, data.Symbol, drawInfo, data);
            return;
        }
    }

    this.GetCustomCheckBoxDrawInfo=function(data, column, drawInfo)
    {
        var checkData=this.GetExtendData(data, column);
        if (!checkData) return;
        if (!IFrameSplitOperator.IsBool(checkData.Checked)) return;

        drawInfo.Checked=checkData.Checked;
        drawInfo.Enable=true;
        drawInfo.Data=checkData;
        if (IFrameSplitOperator.IsBool(checkData.DisableCheckBox)) drawInfo.Enable=!checkData.DisableCheckBox;
        drawInfo.CheckBox=column.CheckBox;
    }

    this.GetCustomButtonDrawInfo=function(data, column, drawInfo)
    {
        var buttonData=this.GetExtendData(data, column);
        if (!buttonData) return;

        drawInfo.Text=buttonData.Title;
        drawInfo.Button=column.Button;
        drawInfo.Font=column.Button.Font;
        drawInfo.Enable=true;
        drawInfo.Data=buttonData;
        if (IFrameSplitOperator.IsBool(buttonData.Enable)) drawInfo.Enable=buttonData.Enable;
    }

    this.GetCustomProgressBarDrawInfo=function(data, column, drawInfo)
    {
        var barData=this.GetExtendData(data, column);
        if (!barData) return;

        drawInfo.Text=barData.Title;
        drawInfo.ProgressBar=column.ProgressBar;
        drawInfo.Enable=true;
        drawInfo.Value=barData.Value;   //占比
        drawInfo.Data=barData;
        if (IFrameSplitOperator.IsBool(barData.Enable)) drawInfo.Enable=barData.Enable;
        if (barData.TextColor) drawInfo.TextColor=barData.TextColor;
        if (barData.BarColor) drawInfo.BarColor=barData.BarColor;
        if (barData.BGColor) drawInfo.BGColor=barData.BGColor;
    }

    this.GetCustomLinkDrawInfo=function(data, column, drawInfo)
    {
        var linkData=this.GetExtendData(data, column);
        if (!linkData) return;

        drawInfo.Text=linkData.Title;
        drawInfo.Link=column.Link;
        drawInfo.Enable=true;
        drawInfo.Data=linkData;
        drawInfo.MaxText=column.MaxText;
        if (IFrameSplitOperator.IsBool(linkData.Enable)) drawInfo.Enable=linkData.Enable;
        if (linkData.TextColor) drawInfo.TextColor=linkData.TextColor;
    }

    
    this.FormatReserveNumber=function(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_COLUMN_FIELD.get(column.Type);
        if (!data || !fieldName) return;

        var value=data[fieldName];
        if (!IFrameSplitOperator.IsNumber(value)) return;

        if (IFrameSplitOperator.IsNumber(column.ColorType))
        {
            if (column.ColorType==1)
            {
               drawInfo.TextColor=this.GetUpDownColor(value,0);
            }
            else if (column.ColorType==2)
            {
                drawInfo.TextColor=this.GetUpDownColorV2(value,0);
            }
        }

        var text=value.toFixed(column.FloatPrecision);
        if (column.Format && IFrameSplitOperator.IsNumber(column.Format.Type))
        {
            var format=column.Format;
            switch(format.Type)
            {
                case 1: //原始数据
                    text=value.toFixed(column.FloatPrecision);
                    break;
                case 2: //千分位分割
                    text=IFrameSplitOperator.FormatValueThousandsString(value, column.FloatPrecision);
                    break;
                case 3:
                    var exfloatPrecision=1;
                    if (IFrameSplitOperator.IsNumber(format.ExFloatPrecision)) exfloatPrecision=format.ExFloatPrecision;
                    text=IFrameSplitOperator.FormatValueStringV2(value, column.FloatPrecision,exfloatPrecision);
                    break;
            }
        }
        
        drawInfo.Text=text;
    }

    this.FormatReserveString=function(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_COLUMN_FIELD.get(column.Type);
        if (!data || !fieldName) return;

        var item=data[fieldName];
        if (IFrameSplitOperator.IsObject(item))
        {
            if (item.Text) drawInfo.Text=item.Text;
            if (item.TextColor) drawInfo.TextColor=item.TextColor;
            if (item.BGColor) drawInfo.BGColor=item.BGColor;
        }
        else if (IFrameSplitOperator.IsString(item))
        {
            drawInfo.Text=item;
        }
    }

    this.FormatReserveProgressBar=function(column, data, drawInfo)
    {
        var fieldName=MAP_COLUMN_FIELD.get(column.Type);
        if (!data || !fieldName) return;
        var item=data[fieldName];

        if (IFrameSplitOperator.IsNumber(item))
        {
            drawInfo.ProgressBar=column.ProgressBar;
            drawInfo.Enable=true;
            drawInfo.Value=item;   //占比
            drawInfo.Data={ Value:item };
        }
        else if (IFrameSplitOperator.IsObject(item))
        {
            if (item.Title) drawInfo.Text=item.Title;
            drawInfo.ProgressBar=column.ProgressBar;
            drawInfo.Enable=true;
            drawInfo.Value=item.Value;   //占比
            drawInfo.Data=item;
            if (IFrameSplitOperator.IsBool(item.Enable)) drawInfo.Enable=item.Enable;
            if (item.TextColor) drawInfo.TextColor=item.TextColor;
            if (item.BarColor) drawInfo.BarColor=item.BarColor;
            if (item.BGColor) drawInfo.BGColor=item.BGColor;
        }
    }

    this.FormatReserveButton=function(column, data, drawInfo)
    {
        var fieldName=MAP_COLUMN_FIELD.get(column.Type);
        if (!data || !fieldName) return;
        var item=data[fieldName];
        if (!item) return;

        drawInfo.Text=item.Title;
        drawInfo.Button=column.Button;
        drawInfo.Font=column.Button.Font;
        drawInfo.Enable=true;
        drawInfo.Data=item;

        if (IFrameSplitOperator.IsBool(item.Enable)) drawInfo.Enable=item.Enable;
    }

    this.FormaTimeDrawInfo=function(column, stock, drawInfo, data)
    {
        if (!IFrameSplitOperator.IsNumber(stock.Time)) return;

        if (column.ValueType==0) //0=hhmm 1=hhmmss 2=hhmmss.fff
        {
            drawInfo.Text=IFrameSplitOperator.FormatTimeString(stock.Time,"HH:MM");
        }   
        else if (column.ValueType==1)
        {
            drawInfo.Text=IFrameSplitOperator.FormatTimeString(stock.Time,"HH:MM:SS");
        }
        else if (column.ValueType==2)
        {
            drawInfo.Text=IFrameSplitOperator.FormatTimeString(stock.Time,"HH:MM:SS.fff");
        }
    }

    this.FormaDateDrawInfo=function(column, stock, drawInfo, data)
    {
        if (!IFrameSplitOperator.IsNumber(stock.Date)) return;

        if (column.FormatType==0)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"YYYY-MM-DD");
        else if (column.FormatType==1)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"YYYY/MM/DD");
        else if (column.FormatType==2)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"YYYY/MM/DD/W");
        else if (column.FormatType==3)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"YYYY-MM");
        else if (column.FormatType==4)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"MM/DD");
        else if (column.FormatType==4)
            drawInfo.Text=IFrameSplitOperator.FormatDateString(stock.Date,"MM-DD");
    }


    //自定义图标
    this.GetCustomIconData=function(columnInfo, symbol, drawInfo, data)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_DRAW_CUSTOM_ICON);
        if (!event || !event.Callback) return false;

        var sendData=
        { 
            Symbol:symbol, Column:columnInfo, Data:data,
            Out:{ Text:null, TextColor:null, TextAlign:null, Font:null } 
        };

        event.Callback(event,sendData,this);

        if (sendData.Out.Text) drawInfo.Text=sendData.Out.Text;
        if (sendData.Out.TextColor) drawInfo.TextColor=sendData.Out.TextColor;
        if (sendData.Out.TextAlign) drawInfo.TextAlign=sendData.Out.TextAlign;
        if (sendData.Out.BGColor) drawInfo.BGColor=sendData.Out.BGColor;
        if (sendData.Out.Font) drawInfo.Font=sendData.Out.Font;

        return true;
    }

    this.GetPriceDrawInfo=function(price, stock, data, drawInfo, option)
    {
        if (!IFrameSplitOperator.IsNumber(price)) return false;

        drawInfo.Text=price.toFixed(data.Decimal);

        var yClose=null;
        if (stock.PriceColorType===1)    //昨结算价 计算颜色
        {
            if (IFrameSplitOperator.IsNumber(stock.YFClose))  yClose=stock.YFClose;
        }
        else    //昨收价 计算颜色
        {
            if (IFrameSplitOperator.IsNumber(stock.YClose))  yClose=stock.YClose;
        }

        if (!IFrameSplitOperator.IsNumber(yClose))  
            drawInfo.TextColor=this.UnchagneColor;
        else  
            drawInfo.TextColor=this.GetUpDownColor(price, yClose);

        if (option && option.LimitBG)
        {
            if (IFrameSplitOperator.IsNumber(stock.LimitHigh))
            {
                if (price>=stock.LimitHigh)
                {
                    drawInfo.BGColor=this.LimitUpBGColor;
                    drawInfo.TextColor=this.LimitTextColor;
                }
            }

            if (IFrameSplitOperator.IsNumber(stock.LimitLow))
            {
                if (price<=stock.LimitLow)
                {
                    drawInfo.BGColor=this.LimitDownBGColor;
                    drawInfo.TextColor=this.LimitTextColor;
                }
            }
        }
    }

    this.GetUpDownColor=function(price, price2)
    {
        if (price>price2) return this.UpColor;
        else if (price<price2) return this.DownColor;
        else return this.UnchagneColor;
    }

    
    this.GetUpDownColorV2=function(price, price2)
    {
        if (price>=price2) return this.UpColor;
        else return this.DownColor;
    }

    //单独处理成交量显示
    this.FormatVolString=function(value,languageID)
    {
        return IFrameSplitOperator.FormatVolString(value, languageID);
    }

    this.DrawItemBG=function(drawInfo)
    {
        if (!drawInfo.BGColor) return;

        var rtItem=drawInfo.Rect;   //绘制背景色
        if (drawInfo.RectBG) rtItem=drawInfo.RectBG;

        if (rtItem)
        {
            this.Canvas.fillStyle=drawInfo.BGColor;
            this.Canvas.fillRect(rtItem.Left,rtItem.Top,rtItem.Width,rtItem.Height);   //画一个背景色, 不然是一个黑的背景
        }
    }

    this.DrawItemText=function(text, textColor, textAlign, left, top, width, bgColor)
    {
        if (!text) return;

        var x=left;
        if (textAlign=='center')
        {
            x=left+width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=left+width-2;
            this.Canvas.textAlign="right";
        }
        else
        {
            x+=2;
            this.Canvas.textAlign="left";
        }

        var textWidth=this.Canvas.measureText(text).width+1;
        var bClip=false;
        if (textWidth>=width)   //长度超过单元格 裁剪
        {
            this.Canvas.save();
            bClip=true;

            var rtCell={ Left:left, Top:top+this.ItemMergin.Top, Width:width, Height:this.RowHeight };
            this.Canvas.beginPath();
            this.Canvas.rect(rtCell.Left, rtCell.Top, rtCell.Width, rtCell.Height);
            //this.Canvas.stroke(); //调试用
            this.Canvas.clip();

            if (this.TextOverflowStyle==1)
            {
                var count=text.length+5;
                text="";
                for(var i=0;i<count;++i)
                {
                    text+="#";
                }
            }
        }

        this.Canvas.textBaseline="bottom";
        this.Canvas.fillStyle=textColor;

        if (this.ItemTextLines>1)   //多行模式要上下居中
        {
            var yOffset=(this.RowHeight-this.ItemMergin.Bottom-this.ItemMergin.Top-this.ItemFontHeight)/2;
            var yBottom=top+this.RowHeight-this.ItemMergin.Bottom-yOffset;
            this.Canvas.fillText(text,x,yBottom);
        }
        else
        {
            this.Canvas.fillText(text,x,top+this.RowHeight-this.ItemMergin.Bottom);
        }

        if (bClip) this.Canvas.restore();
    }

    //{ Text:, Symbol:{ Family:'iconfont', Size:,  Data:[ { Text:'\ue631', Color:'#1c65db'}, ...] } ]}
    this.DrawItemTextEx=function(drawInfo, left, top, width)
    {
        var text=drawInfo.Text;
        var clrText=drawInfo.TextColor;
        var symbol=drawInfo.Symbol; //符号
        var textAlign=drawInfo.TextAlign;

        var textWidth=this.Canvas.measureText(text).width+1;;
        var totalWidth=textWidth;

        var font= `${symbol.Size*GetDevicePixelRatio()}px ${symbol.Family}`;
        this.Canvas.font=font;
        var aryIconWidth=[];
        
        for(var i=0;i<symbol.Data.length;++i)
        {
            var item=symbol.Data[i];
            var iconWidth=this.Canvas.measureText(item.Text).width+1;
            
            if (totalWidth+iconWidth>width) 
                break;

            totalWidth+=iconWidth;
            aryIconWidth[i]=iconWidth;
        }

        var x=left;
        var y=top+this.ItemMergin.Top+this.RowHeight/2;
        if (textAlign=='center')
        {
            x=left+(width-totalWidth)/2;
        }
        else if (textAlign=='right')
        {
            x=left+(width-totalWidth);
        }
        else
        {
            x+=2;
        }

        this.Canvas.textBaseline="middle";
        this.Canvas.textAlign="left";
        this.Canvas.font=this.ItemFont;
        this.Canvas.fillStyle=clrText;
        this.Canvas.fillText(text,x,y);

        x+=textWidth;

        this.Canvas.font=font;
        for(var i=0;i<aryIconWidth.length;++i)
        {
            var item=symbol.Data[i];
            this.Canvas.fillStyle=item.Color;
            this.Canvas.fillText(item.Text,x,y);

            x+=aryIconWidth[i];
        }

        this.Canvas.font=this.ItemFont;
    }

    this.DrawIconItem=function(drawInfo, left, top, width)
    {
        if (!drawInfo || !drawInfo.Font || !drawInfo.Text) return;

        var text=drawInfo.Text;
        var clrText=drawInfo.TextColor;
        var textAlign=drawInfo.TextAlign;

        this.Canvas.font=drawInfo.Font;
        var textWidth=this.Canvas.measureText(text).width+1;;

        var x=left;
        var y=top+this.ItemMergin.Top+this.RowHeight/2;
        if (textAlign=='center')
        {
            x=left+(width-textWidth)/2;
        }
        else if (textAlign=='right')
        {
            x=left+(width-textWidth);
        }
        else
        {
            x+=2;
        }

        this.Canvas.textBaseline="middle";
        this.Canvas.textAlign="left";
        this.Canvas.fillStyle=clrText;
        this.Canvas.fillText(text,x,y);

        this.Canvas.font=this.ItemFont;
    }

    this.DrawCheckbox=function(drawInfo, left, top, width)
    {
        if (!IFrameSplitOperator.IsBool(drawInfo.Checked)) return;
        if (!drawInfo.CheckBox) return;

        var config=drawInfo.CheckBox;
        drawInfo.Font=`${config.Size*this.DevicePixelRatio}px ${config.Family}`;
        var textAlign=drawInfo.TextAlign;
        var size=drawInfo.CheckBox.Size*this.DevicePixelRatio;
        var x=left+drawInfo.CheckBox.Margin.Left;
        var y=top+this.RowHeight-drawInfo.CheckBox.Margin.Bottom;

        if (textAlign=='center') x=left+width/2-size/2;
        else if (textAlign=='right') x=left+width-config.Margin.Right;

        var rtBox={ Left:x, Bottom:y, Width:size, Height:size };
        rtBox.Right=rtBox.Left+rtBox.Width;
        rtBox.Top=rtBox.Bottom-rtBox.Height;

        //鼠标在上面
        var bMouseOn=false;
        if (drawInfo.Enable && this.LastMouseStatus && this.LastMouseStatus.OnMouseMove)
        {
            var xMouse=this.LastMouseStatus.OnMouseMove.X;
            var yMouse=this.LastMouseStatus.OnMouseMove.Y;
            if (xMouse>rtBox.Left && xMouse<rtBox.Right && yMouse>rtBox.Top && yMouse<rtBox.Bottom)
            {
                bMouseOn=true;
                this.LastMouseStatus.MouseOnStatus={ Index:drawInfo.Index, ColumnIndex:drawInfo.ColumnIndex, Type:0 };
            }
        }

        this.Canvas.font=drawInfo.Font;
        this.Canvas.textBaseline="bottom";
        this.Canvas.textAlign="left";
        if (drawInfo.Checked===true)
        {
            var textColor=config.Checked.Color;
            if (drawInfo.Enable===false) textColor=config.Checked.DisableColor;
            else if (bMouseOn) textColor=config.Checked.MouseOnColor;

            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(config.Checked.Symbol,x,y);
        }
        else if (drawInfo.Checked===false)
        {
            var textColor=config.Unchecked.Color;
            if (drawInfo.Enable===false)  textColor=config.Unchecked.DisableColor;
            else if (bMouseOn) textColor=config.Unchecked.MouseOnColor;

            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(config.Unchecked.Symbol,x,y);
        }

        if (drawInfo.Enable)
        {
            drawInfo.Botton={ Rect:rtBox, Type:0 };
        }
    }

    this.DrawButton=function(drawInfo, left, top, width)
    {
        if (!drawInfo.Button) return;

        var config=drawInfo.Button;
        var rtBG=
        { 
            Left:left+drawInfo.Button.Margin.Left, Top:top+drawInfo.Button.Margin.Top, 
            Height:this.RowHeight-drawInfo.Button.Margin.Top-drawInfo.Button.Margin.Bottom, 
            Width:width-drawInfo.Button.Margin.Left-drawInfo.Button.Margin.Right
        }
        rtBG.Right=rtBG.Left+rtBG.Width;
        rtBG.Bottom=rtBG.Top+rtBG.Height;

        var bgColor=config.BGColor, textColor=config.TextColor;
        if (drawInfo.Enable===false)
        {
            bgColor=config.Disable.BGColor;
            textColor=config.Disable.TextColor;
        }
        else
        {
            if (this.LastMouseStatus && this.LastMouseStatus.OnMouseMove && config.MouseOn)
            {
                var x=this.LastMouseStatus.OnMouseMove.X;
                var y=this.LastMouseStatus.OnMouseMove.Y;
                if (x>rtBG.Left && x<rtBG.Right && y>rtBG.Top && y<rtBG.Bottom)
                {
                    bgColor=config.MouseOn.BGColor;
                    textColor=config.MouseOn.TextColor;

                    this.LastMouseStatus.MouseOnStatus={ Index:drawInfo.Index, ColumnIndex:drawInfo.ColumnIndex, Type:1 };
                }
            }
        }

        this.Canvas.fillStyle=bgColor;
        this.Canvas.fillRect(rtBG.Left, rtBG.Top,rtBG.Width,rtBG.Height);

        this.Canvas.font=drawInfo.Font;
        this.Canvas.textBaseline="bottom";
        this.Canvas.textAlign="left";
        this.Canvas.fillStyle=textColor;
        var textWidth=this.Canvas.measureText(drawInfo.Text).width;

        var x=rtBG.Left;
        if (textWidth<rtBG.Width) x+=(rtBG.Width-textWidth)/2;
        var y=rtBG.Bottom-drawInfo.Button.TextMargin.Bottom;
        this.Canvas.fillText(drawInfo.Text,x,y);

        if (drawInfo.Enable)
        {
            drawInfo.Botton={ Rect:rtBG, Type:1 };
        }
    }

    this.DrawProgressBar=function(drawInfo, left, top, width)
    {
        if (!drawInfo.ProgressBar) return;

        var config=drawInfo.ProgressBar;
        var rtBG=
        { 
            Left:left+config.Margin.Left, Top:top+config.Margin.Top, 
            Height:this.RowHeight-config.Margin.Top-config.Margin.Bottom, 
            Width:width-config.Margin.Left-config.Margin.Right
        }
        rtBG.Right=rtBG.Left+rtBG.Width;
        rtBG.Bottom=rtBG.Top+rtBG.Height;

        var bgColor=config.BGColor;
        var barColor=config.BarColor;
        var textColor=config.TextColor;
        if (drawInfo.Enable===false)
        {
            bgColor=config.Disable.BGColor;
            barColor=config.Disable.BarColor;
            textColor=config.Disable.TextColor;
        }

        if (drawInfo.BGColor) bgColor=drawInfo.BGColor;
        if (drawInfo.TextColor) textColor=drawInfo.TextColor;
        if (drawInfo.BarColor) barColor=drawInfo.BarColor;

        if (bgColor)
        {
            this.Canvas.fillStyle=bgColor;
            this.Canvas.fillRect(rtBG.Left, rtBG.Top,rtBG.Width,rtBG.Height);
        }

        var fullBarWidth=rtBG.Width-config.BarMargin.Left-config.BarMargin.Right;
        var value=drawInfo.Value;   // 0-1 进度条
        var rtBar={ Left:rtBG.Left+config.BarMargin.Left, Top:rtBG.Top+config.BarMargin.Top, Bottom:rtBG.Bottom-config.BarMargin.Bottom, Width:0 };
        if (value>0)
        {
            if (value>1) value=1;
            rtBar.Width=fullBarWidth*value;
            rtBar.Height=rtBar.Bottom-rtBar.Top;
            if (rtBar.Width<1) rtBG.Width=1;

            if (Array.isArray(barColor)) this.Canvas.fillStyle=this.CreateLinearGradient(barColor, rtBG.Left, rtBG.Top, rtBG.Right, rtBG.Top);
            else this.Canvas.fillStyle=barColor;
            this.Canvas.fillRect(rtBar.Left, rtBar.Top,rtBar.Width,rtBar.Height);
        }

        if (textColor && drawInfo.Text)
        {
            this.Canvas.font=config.Font;
            this.Canvas.textBaseline="bottom";
            this.Canvas.textAlign="left";

            this.Canvas.fillStyle=textColor;
            var xText=rtBar.Left+config.TextMargin.Left;
            var yText=rtBar.Bottom-config.TextMargin.Bottom;
            this.Canvas.fillText(drawInfo.Text, xText, yText);
        }
    }

    //创建渐近色
    this.CreateLinearGradient=function(aryColor, x0, y0, x1, y1)
    {
        var gradient = this.Canvas.createLinearGradient(x0, y0, x1, y1);
        var offset=1/(aryColor.length-1);
        for(var i=0; i<aryColor.length; ++i)
        {
            var value=i*offset;
            gradient.addColorStop(value, aryColor[i]);
        }

        return gradient;
    }

    this.DrawLinkText=function(drawInfo, left, top, width)
    {
        if (!drawInfo.Link || !drawInfo.Text) return;

        var config=drawInfo.Link;
        var text=drawInfo.Text;
        var textAlign=drawInfo.TextAlign;
        var font=config.Font;
        var color=config.TextColor;

       

        this.Canvas.font=font;
        var textWidth=this.Canvas.measureText(text).width;
        var textHeight=this.Canvas.measureText("擎").width;
        var x=left;
        if (width>=textWidth)
        {
            if (textAlign=='center') x=left+(width-textWidth)/2;
            else if (textAlign=='right') x=left+width-textWidth;
        }
        else
        {
            text=this.TextEllipsis(text, width, drawInfo.MaxText);
            textWidth=this.Canvas.measureText(text).width;

            //数据截断提示信息
            drawInfo.Tooltip=
            { 
                Type:2, 
                Data:{ AryText:[ {Text:drawInfo.Text} ] }
            }
        }

        var rtText={Left:x, Bottom:top+this.RowHeight-this.ItemMergin.Bottom, Height:textHeight, Width:textWidth };
        rtText.Right=rtText.Left+rtText.Width;
        rtText.Top=rtText.Bottom-rtText.Height;

        var drawLine=false; //下划线
        if (drawInfo.Enable===false) 
        {
            color=config.Disable.TextColor;
        }
        else if (this.LastMouseStatus && this.LastMouseStatus.OnMouseMove && config.MouseOn)
        {
            var x=this.LastMouseStatus.OnMouseMove.X;
            var y=this.LastMouseStatus.OnMouseMove.Y;
            if (x>rtText.Left && x<rtText.Right && y>rtText.Top && y<rtText.Bottom)
            {
                color=config.MouseOn.TextColor;
                drawLine=true;
                this.LastMouseStatus.MouseOnStatus={ Index:drawInfo.Index, ColumnIndex:drawInfo.ColumnIndex, Type:2 };
            }
        }

        this.Canvas.textBaseline="bottom";
        this.Canvas.textAlign="left";
        this.Canvas.fillStyle=color;
        this.Canvas.fillText(text,rtText.Left, rtText.Bottom);

        if (drawLine)
        {
            this.Canvas.strokeStyle=color;
            this.Canvas.beginPath();
            this.Canvas.moveTo(rtText.Left,rtText.Bottom);
            this.Canvas.lineTo(rtText.Right,rtText.Bottom);
            this.Canvas.stroke();
        }

        if (drawInfo.Enable)
        {
            drawInfo.Botton={ Rect:rtText, Type:2 };
        }
    }

    //字体由外面设置
    this.TextEllipsis=function(text, maxWidth, maxText)
    {
        if (!text) return null;
        
        if (text.length<maxText.length) return text;

        var start=maxText.length-3;
        if (start<0) return null;
        var newText=text.slice(0,start);
        for(var i=start;i<text.length;++i)
        {
            var value=newText + text[i] + "...";
            var width=this.Canvas.measureText(value).width;
            if (width>maxWidth) 
            {
                newText+="...";
                break;
            }
            newText+=text[i];
        }

        return newText;
    }

    this.DrawMultiBar=function(colunmInfo, data, rtItem)
    {
        if (!data.Source || !IFrameSplitOperator.IsNonEmptyArray(data.Source)) return false;
        var barData=data.Source[colunmInfo.DataIndex]; //{ Value:[0.4,0,2], Color:[0,1] };
        if (!barData) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(barData.Value)) return false;

        var width=rtItem.Width-this.BarMergin.Left-this.BarMergin.Right;
        var left=rtItem.Left+this.BarMergin.Left;
        var top=rtItem.Top+this.RowMergin.Top+this.BarMergin.Top;
        var height=rtItem.Height-this.RowMergin.Top-this.RowMergin.Bottom-this.BarMergin.Top-this.BarMergin.Bottom;
        var right=left+width;
        for(var i=0;i<barData.Value.length;++i)
        {
            var value=barData.Value[i];
            if (value<=0) continue;
            if (left>=right) break;

            var barWidth=width*value;
            if (barWidth<1) barWidth=1;
            if (left+barWidth>right) barWidth=right-left;

            var colorIndex=i;
            if (IFrameSplitOperator.IsNonEmptyArray(barData.Color) && i<barData.Color.length) colorIndex= barData.Color[i];

            this.Canvas.fillStyle=g_JSChartResource.DealList.FieldColor.Bar[colorIndex];
            this.Canvas.fillRect(left,top,barWidth,height);

            left+=barWidth;
        }
        return true;
    }

    this.DrawCenterBar=function(colunmInfo, data, rtItem)
    {
        if (!data.Source || !IFrameSplitOperator.IsNonEmptyArray(data.Source)) return false;
        var barData=data.Source[colunmInfo.DataIndex]; //{ Value:[0.4,0,2], Color:[0,1] };
        if (!barData) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(barData.Value)) return false;

        var width=(rtItem.Width-this.BarMergin.Left-this.BarMergin.Right)/2;
        var left=rtItem.Left+this.BarMergin.Left;
        var center=left+width;
        var top=rtItem.Top+this.RowMergin.Top+this.BarMergin.Top;
        var height=rtItem.Height-this.RowMergin.Top-this.RowMergin.Bottom-this.BarMergin.Top-this.BarMergin.Bottom;
        var right=left+width;

        for(var i=0;i<barData.Value.length && i<2;++i)
        {
            var value=barData.Value[i];
            if (value<=0) continue;

            if (value>1) value=1;
            var barWidth=width*value;
            if (barWidth<1) barWidth=1;

            var colorIndex=i;
            if (IFrameSplitOperator.IsNonEmptyArray(barData.Color) && i<barData.Color.length) colorIndex= barData.Color[i];
            this.Canvas.fillStyle=g_JSChartResource.DealList.FieldColor.Bar[colorIndex];

            if (i==0)  //左边
            {
                this.Canvas.fillRect(center,top,-barWidth,height);
            }
            else    //右边
            {
                this.Canvas.fillRect(center,top,barWidth,height);
            }
        }
    }

    //绘制线段
    this.DrawLine=function(lineData, column, rtItem)
    {
        if (!lineData) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(lineData.Data)) return false;

        var width=rtItem.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var left=rtItem.Left+this.ItemMergin.Left;
        var top=rtItem.Top+this.ItemMergin.Top;
        var height=rtItem.Height-this.ItemMergin.Top-this.ItemMergin.Bottom;
        var right=left+width;
        var bottom=top+height;

        var Temp_GetXFromIndex=function(index)
        {
            var count=lineData.Count;
            if (count==1)
            {
                if (index==0) return left;
                else return right;
            }
            else if (count<=0)
            {
                return left;
            }
            else if (index>=count)
            {
                return right;
            }
            else
            {
                var offset=left+width*index/count;
                return offset;
            }
        }

        var priceMax=lineData.Max, priceMin=lineData.Min;
        if (IFrameSplitOperator.IsNumber(lineData.YClose))  //前收盘价
        {
            if (lineData.YClose==priceMax && lineData.YClose==priceMin)
            {
                priceMax=lineData.YClose+lineData.YClose*0.1;
                priceMin=lineData.YClose-lineData.YClose*0.1
            }
            else
            {
                var distanceValue=Math.max(Math.abs(lineData.YClose-priceMax),Math.abs(lineData.YClose-priceMin));
                priceMax=lineData.YClose+distanceValue;
                priceMin=lineData.YClose-distanceValue;
            }
        }

        var Temp_GetYFromData=function(value)
        {
            if(value<=priceMin) return bottom;
            if(value>=priceMax) return top;

            var value=height*(value-priceMin)/(priceMax-priceMin);
            return bottom-value;
        }

        this.Canvas.save();
        var yCenter=null;
        if (IFrameSplitOperator.IsNumber(lineData.YClose))
        {
            var y=Temp_GetYFromData(lineData.YClose);
            y=ToFixedPoint(y);
            yCenter=y;

            this.Canvas.setLineDash([2,2]);
            this.Canvas.strokeStyle=this.CloseLineConfig.YCloseColor; 
            this.Canvas.beginPath();
            this.Canvas.moveTo(left,y);
            this.Canvas.lineTo(right,y);
            this.Canvas.stroke();

            this.Canvas.setLineDash([]);
        }

        if (lineData.Color) this.Canvas.strokeStyle=lineData.Color;
        else this.Canvas.strokeStyle=this.CloseLineConfig.CloseColor; 

        var bFirstPoint=true;
        var ptFirst={}; //第1个点
        var drawCount=0, x,y;

        for(var i=0; i<lineData.Data.length; ++i)
        {
            var value=lineData.Data[i];
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            x=Temp_GetXFromIndex(i);
            y=Temp_GetYFromData(value);

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(x,y);
                bFirstPoint=false;
                ptFirst={ X:x, Y:y };
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

            if (column.IsDrawArea && IFrameSplitOperator.IsNumber(yCenter))
            {
                this.Canvas.lineTo(x,yCenter);
                this.Canvas.lineTo(ptFirst.X,yCenter);
                this.Canvas.closePath();
                var areaColor=this.CloseLineConfig.AreaColor;
                if (lineData.AreaColor) areaColor=lineData.AreaColor;
                this.SetFillStyle(areaColor,left,top, left,bottom);
                this.Canvas.fill();
            }
        }

        this.Canvas.restore();
    }

    //klineData={ Data:[ open, high, low, close ] }
    this.DrawKLine=function(klineData, column, rtItem, data)
    {
        if (column.IsDrawCallback)  //外部处理输出格式
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_REPORT_DRAW_KLINE);
            if (event || event.Callback)
            {
                var sendData=
                { 
                    Column:column, Data:data, KLineData:klineData, Rect:rtItem, PreventDefault:false
                };
        
                event.Callback(event,sendData,this);
                if (sendData.PreventDefault) return;
            }
        }

        if (!klineData) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(klineData.Data)) return;

        var high=klineData.Data[1];
        var low=klineData.Data[2];
        var aryKLine=
        [ 
            { Open:klineData.Data[0], High:high, Low:low, Close:klineData.Data[3]}, 
            //{ Open:klineData.Data[0], High:high, Low:low, Close:klineData.Data[3]}  
        ];
        this.DrawKLineBar(aryKLine, high, low, rtItem);
    }

    this.DrawKLineBar=function(aryKLine, high, low, rtItem)
    {
        var yMergin=4;
        var left=rtItem.Left+this.ItemMergin.Left;
        var width=rtItem.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var left=rtItem.Left+this.ItemMergin.Left;
        var top=rtItem.Top+this.ItemMergin.Top+yMergin;
        var height=rtItem.Height-this.ItemMergin.Top-this.ItemMergin.Bottom-yMergin*2;
        var right=left+width;
        var bottom=top+height;

        var Temp_GetYFromData=function(value)
        {
            if(value<=low) return bottom;
            if(value>=high) return top;

            var value=height*(value-low)/(high-low);
            return bottom-value;
        }

        var dataWidth=this.KLineConfig.DataWidth;
        var distanceWidth=this.KLineConfig.DistanceWidth;
        var xOffset=left;
        var x, xLeft, xRight;
        for(var i=0;i<aryKLine.length;++i,xOffset+=(dataWidth+distanceWidth))
        {
            var item=aryKLine[i];
            xLeft=xOffset;
            xRight=xOffset+dataWidth;
            x=xLeft+(xRight-xLeft)/2;
            if (xRight>right) break;

            var yLow=Temp_GetYFromData(item.Low, false);
            var yHigh=Temp_GetYFromData(item.High, false);
            var yOpen=Temp_GetYFromData(item.Open, false);
            var yClose=Temp_GetYFromData(item.Close, false);
            var y=yHigh;

            if (item.Open<item.Close)   //阳线
            {
                this.DrawKBarItem(item,dataWidth, this.KLineConfig.UpColor, 1, xLeft, xRight, yLow, yHigh, yOpen, yClose);
            }
            else if (item.Open>item.Close)  //阴线
            {
                this.DrawKBarItem(item,dataWidth, this.KLineConfig.DownColor, 0, xLeft, xRight, yLow, yHigh, yOpen, yClose);
            }
            else     //平线
            {
                this.DrawKBarItem(item,dataWidth, this.KLineConfig.UnchagneColor, 0, xLeft, xRight, yLow, yHigh, yOpen, yClose);
            }
        }
    }

    this.DrawKBarItem=function(data, dataWidth, barColor, drawType, left, right, yLow, yHigh, yOpen, yClose)
    {
        var isEmptyBar=false;
        if (drawType==1) isEmptyBar=true;
        var yBarTop=Math.min(yOpen, yClose);
        var yBarBottom=Math.max(yOpen, yClose);
        var barTopValue=Math.max(data.Open, data.Close);
        var barBottomValue=Math.min(data.Open, data.Close);
        this.Canvas.fillStyle=barColor;
        this.Canvas.strokeStyle=barColor;
        var x=left+(right-left)/2;

        if (isEmptyBar)
        {
            if ((dataWidth%2)!=0) dataWidth-=1;
        }

        if (dataWidth>=4)
        {
            if (data.High>barTopValue)
            {
                this.Canvas.beginPath();
                var xBar=x;
                if (isEmptyBar) xBar=left+dataWidth/2;
                this.Canvas.moveTo(ToFixedPoint(xBar),ToFixedPoint(yBarTop));
                this.Canvas.lineTo(ToFixedPoint(xBar),ToFixedPoint(yHigh));
                this.Canvas.stroke();
            }

            if (Math.abs(yBarBottom-yBarTop)<1)
            {
                this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(yBarTop),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
            }
            else
            {
                if (isEmptyBar)
                {
                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(left),ToFixedPoint(yBarTop),ToFixedRect(dataWidth),ToFixedRect(yBarBottom-yBarTop));
                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(yBarTop),ToFixedRect(dataWidth),ToFixedRect(yBarBottom-yBarTop));
                }
            }

            if (data.Low<barBottomValue)
            {
                this.Canvas.beginPath();
                var xBar=x;
                if (isEmptyBar) xBar=left+dataWidth/2;
                this.Canvas.moveTo(ToFixedPoint(xBar),ToFixedPoint(yBarBottom));
                this.Canvas.lineTo(ToFixedPoint(xBar),ToFixedPoint(yLow));
                this.Canvas.stroke();
            }
        }
        else
        {

        }
    }

    this.SetFillStyle=function(color, x0, y0, x1, y1)
    {
        if (Array.isArray(color))
        {
            let gradient = this.Canvas.createLinearGradient(x0, y0, x1, y1);
            var offset=1/(color.length);
            for(var i in color)
            {
                gradient.addColorStop(i*offset, color[i]);
            }
            this.Canvas.fillStyle=gradient;
        }
        else
        {
            this.Canvas.fillStyle=color;
        }
    }

    this.FormatDrawInfo=function(column, stock, drawInfo, data)
    {
        this.FormatDrawInfoEvent(stock, data, column, drawInfo);
    }

    this.GetFixedRowTextDrawInfo=function(rowIndex, colIndex, columnInfo, drawInfo)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_REPORT_FIXEDROW_TEXT);
        if (!event || !event.Callback) return false;

        var sendData=
        { 
            RowIndex:rowIndex, ColIndex:colIndex, Column:columnInfo, Data:this.FixedRowData,
            Out:{ Text:null, TextColor:null, TextAlign:null } 
        };

        event.Callback(event,sendData,this);

        if (sendData.Out.Text) drawInfo.Text=sendData.Out.Text;
        if (sendData.Out.TextColor) drawInfo.TextColor=sendData.Out.TextColor;
        if (sendData.Out.TextAlign) drawInfo.TextAlign=sendData.Out.TextAlign;

        return true;
        
    }

    this.GetVolColor=function(colunmInfo, data)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_DEAL_VOL_COLOR);
        if (event && event.Callback)
        {
            var sendData={ Data:data, TextColor:null };
            event.Callback(event,sendData,this);
            if (sendData.TextColor) return sendData.TextColor;
        }

        return colunmInfo.TextColor;
    }

    //获取股票名称颜色
    this.GetNameColor=function(colunmInfo, symbol, rowType)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_REPORT_NAME_COLOR);
        if (event && event.Callback)
        {
            var sendData={ Symbol:symbol, TextColor:null, RowType:rowType };
            event.Callback(event,sendData,this);
            if (sendData.TextColor) return sendData.TextColor;
        }

        return colunmInfo.TextColor;
    }

    this.GetFontHeight=function(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    this.OnMouseDown=function(x,y,e)    //Type: 1=tab  4=固定行 2=行 3=表头 5=右侧滚动条
    {
        if (!this.Data) return null;

        if (this.Tab)
        {
            var tab=this.Tab.OnMouseDown(x,y,e);
            if (tab) return { Type:1, Tab: tab };   //底部工具栏
        }

        if (this.VScrollbar)
        {
            var item=this.VScrollbar.OnMouseDown(x,y,e);
            if (item) return { Type:5, VScrollbar:item };   //右侧滚动条
        }

        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};

        if (this.UIElement)
            var uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else
            var uiElement={Left:null, Top:null};

        var row=this.PtInFixedBody(x,y)
        if (row)
        {
            var bRedraw=true;
            var eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_FIXEDROW;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_REPORT_FIXEDROW;
            this.SendClickEvent(eventID, { Data:row, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement });

            this.SelectedFixedRow=row.Index;
            this.SelectedRow=-1;
            this.MultiSelectedRow=[];

            return { Type:4, Redraw:bRedraw, Row:row };  //行
        }

        var row=this.PtInBody(x,y);
        if (row)
        {
            var btnStatus={ Redraw:false };
            this.OnClickButton(x, y, e, btnStatus);

            var bRedraw=true;
            if (this.MultiSelectModel==1)
            {
                if (e && e.ctrlKey) //多选
                {
                    var pos=this.MultiSelectedRow.indexOf(row.DataIndex);
                    if (pos>=0) this.MultiSelectedRow.splice(pos,1);
                    else this.MultiSelectedRow.push(row.DataIndex);
                    
                }
                else if (e && e.shiftKey)   //批量多选
                {
                    this.OnShiftClickRow(row);
                }
                else
                {
                    if (this.MultiSelectedRow.length==1 && this.MultiSelectedRow[0]==row.DataIndex) bRedraw=false;
                    else this.MultiSelectedRow=[row.DataIndex];
                }

                this.SelectedFixedRow=-1;
            }
            else
            {
                if (this.SelectedModel==0) 
                {
                    if (this.SelectedRow==row.Index) bRedraw=false;
                    this.SelectedRow=row.Index;
                    this.SelectedFixedRow=-1;
                }
                else 
                {
                    if (this.SelectedRow==row.DataIndex) bRedraw=false;
                    this.SelectedRow=row.DataIndex;
                    this.SelectedFixedRow=-1;
                }
            }
    
            var eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_ROW;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_REPORT_ROW;
            
            this.SendClickEvent(eventID, { Data:row, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement });

            return { Type:2, Redraw:bRedraw || btnStatus.Redraw, Row:row };  //行
        }

        var header=this.PtInHeader(x,y);
        if (header)
        {
            var eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_HEADER;
            if (e.button==2) 
            {
                eventID=JSCHART_EVENT_ID.ON_RCLICK_REPORT_HEADER;
            }
            else if (e.button==0)
            {
                eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_HEADER;
            }

            this.SendClickEvent(eventID, { Data:row, X:x, Y:y , e:e, Inside:insidePoint, UIElement:uiElement});
            return { Type:3, Redraw:bRedraw, Header:header };  //表头
        }

        return null;
    }

    this.OnShiftClickRow=function(row)
    {
        if (this.MultiSelectedRow.length<=0)
        {
            this.MultiSelectedRow.push(row.DataIndex);
            return;
        }

        var max=null, min=null;
        for(var i=0;i<this.MultiSelectedRow.length;++i)
        {
            var value=this.MultiSelectedRow[i];
            if (max==null || max<value) max=value;
            if (min==null || min>value) min=value;
            if (value==row.DataIndex)   //移除
            {
                this.MultiSelectedRow.splice(i,1);
                return;
            }
        }

        if (max==min)
        {
            var start=row.DataIndex, end=max;
            if (start>end)
            {
                start=max;
                end=row.DataIndex;
            }

            this.MultiSelectedRow=[];
            for(var i=start;i<=end;++i)
            {
                this.MultiSelectedRow.push(i);
            }
        }
        else
        {
            if (row.DataIndex<=max && row.DataIndex>=min)
            {
                this.MultiSelectedRow.push(row.DataIndex);
            }
            else
            {
                var start=Math.min(row.DataIndex, min);
                var end=Math.max(row.DataIndex, max);
                this.MultiSelectedRow=[];
                for(var i=start;i<=end;++i)
                {
                    this.MultiSelectedRow.push(i);
                }
            }
        }
        
    }

    this.OnDragRow=function(x, y, e) //Type: 5=顶部  6=空白行 2=行 7=底部
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var topOffset=this.RowHeight/2;
        var top=this.RectClient.Top+this.HeaderHeight;
        var right=this.ChartBorder.GetChartWidth();
        var textTop=top+this.FixedRowHeight*this.FixedRowCount;

        if (y<textTop+topOffset) return { Type:5 };


        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];
            var rtRow={ Left:0, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };
            rtRow.Top+=topOffset;
            rtRow.Bottom+=topOffset;

            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ DataIndex:i, Index:j , Symbol:symbol, Pos:0 };
                if (j==0) data.Pos=1;
                else if (j==this.RowCount-1) data.Pos=2;
                return { Type: 2, Data:data };
            }

            textTop+=this.RowHeight;
        }

        if (j<this.RowCount) return { Type:6 };

        return { Type:7 };
    }

    this.OnDragHeader=function(x,y,e)   //Type:1=行 2=左边  3=右边 4=空白 5=固定行
    {
        if (!this.IsShowHeader) return null;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=top+this.HeaderHeight;

        if (x<left) return { Type:2 };
        else if (x>right) return { Type:3 };

        var cell=this.PtInItem(x,top+2,top,bottom);
        if (!cell) return { Type:4 };

        if (cell.IsFixed) return { Type:5 }

        return { Type:1, Header:cell };
    }

    this.OnClickButton=function(x, y, e, status)
    {
        if (e.button!=0) return false;

        var buttonData=this.GetButtonData(x,y);
        if (!buttonData) return true;
        
        if (buttonData.Type===0)    //checkbox
        {
            var sendData=
            { 
                Column:buttonData.Column, Index:buttonData.Index, Stock:buttonData.Stock, ColumnIndex:buttonData.ColumnIndex, 
                Data:buttonData.Data, Value:true,
                PreventDefault: false 
            };
            if (IFrameSplitOperator.IsBool(buttonData.Data.Checked)) sendData.Value=!buttonData.Data.Checked;

            this.SendClickEvent(JSCHART_EVENT_ID.ON_CLICK_REPORT_CHECKBOX, sendData)

            if (!sendData.PreventDefault)
            {
                if (IFrameSplitOperator.IsBool(buttonData.Data.Checked))
                    buttonData.Data.Checked=!buttonData.Data.Checked;
                else 
                    buttonData.Data.Checked=true;
            }

            status.Redraw=true;
            return true;
        }
        else if (buttonData.Type===1)   //button
        {
            var sendData={ Column:buttonData.Column, Index:buttonData.Index, Stock:buttonData.Stock, ColumnIndex:buttonData.ColumnIndex, Data:buttonData.Data };
            this.SendClickEvent(JSCHART_EVENT_ID.ON_CLICK_REPORT_BUTTON, sendData)

            status.Redraw=true;
            return true;
        }
        else if (buttonData.Type===2)   //link
        {
            var sendData={ Column:buttonData.Column, Index:buttonData.Index, Stock:buttonData.Stock, ColumnIndex:buttonData.ColumnIndex, Data:buttonData.Data };
            this.SendClickEvent(JSCHART_EVENT_ID.ON_CLICK_REPORT_LINK, sendData)

            status.Redraw=true;
            return true;
        }
        
        return false;
    }

    this.OnDblClick=function(x,y,e)
    {
        if (!this.Data) return false;

        var header=this.PtInHeaderDragBorder(x,y);
        if (header)
        {
            this.SendClickEvent(JSCHART_EVENT_ID.ON_DBCLICK_REPORT_DRAG_COLUMN_WIDTH, { Data:header, X:x, Y:y });
            return true;
        }

        var row=this.PtInBody(x,y);
        if (row)
        {
            this.SendClickEvent(JSCHART_EVENT_ID.ON_DBCLICK_REPORT_ROW, { Data:row, X:x, Y:y });
            return true;
        }

        return false;
    }

    this.PtInClient=function(x,y)
    {
        if (x>this.RectClient.Left && x<this.RectClient.Right && y>this.RectClient.Top && y<this.RectClient.Bottom) return true;

        return false;
    }

    this.PtInBody=function(x,y)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;
 
        var textTop=top+this.FixedRowHeight*this.FixedRowCount;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];
            var rtRow={ Left:left, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };

            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ Rect:rtRow, DataIndex:i, Index:j , Symbol:symbol };
                data.Item=this.PtInItem(x,y, rtRow.Top, rtRow.Bottom);
                return data;
            }

            textTop+=this.RowHeight;
        }

        return null;
    }

    this.PtInFixedBody=function(x,y)
    {
        if (this.FixedRowCount<=0) return null;

        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;

        var textTop=top;
        for(var i=0; i<this.FixedRowCount; ++i)
        {
            var rtRow={ Left:left, Top:textTop, Right:right, Bottom: textTop+this.FixedRowHeight };

            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ Rect:rtRow, Index:i};
                data.Item=this.PtInItem(x,y, rtRow.Top, rtRow.Bottom);
                return data;
            }

            textTop+=this.FixedRowHeight;
        }

        return null;

    }

    this.PtInItem=function(x,y, top, bottom)
    {
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        var textLeft=left;
        //固定列
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var header={Left:textLeft, Right:textLeft+item.Width, Top:top, Bottom:bottom };

            if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
            {
                return { Rect:header, Column:item, Index:i, IsFixed:true };
            }

            textLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (textLeft>=right) break;
            
            var header={Left:textLeft, Right:textLeft+item.Width, Top:top, Bottom:bottom };

            if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
            {
                return { Rect:header, Column:item, Index:i, IsFixed:false };
            }
            textLeft+=item.Width;
        } 

        return null;
    }

    this.PtInHeader=function(x,y)
    {
        if (!this.IsShowHeader) return null;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=top+this.HeaderHeight;

        if (!(x>=left && x<=right && y>=top && y<=bottom)) return null;

        return this.PtInItem(x,y,top,bottom);
    }

    this.IsPtInBody=function(x,y)
    {
        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var bottom=this.RectClient.Bottom;

        if (x>=left && x<=right && y>=top && y<=bottom) return true;

        return false;
    }

    this.IsPtInHeader=function(x,y)
    {
        if (!this.IsShowHeader) return false;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=top+this.HeaderHeight;

        if (x>=left && x<=right && y>=top && y<=bottom) return true;

        return false;
    }

    this.SendClickEvent=function(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
    }

    this.DrawDragRow=function()
    {
        if (!this.DragRow) return;
        var drag=this.DragRow;

        if (!drag.Data || !drag.Inside || !drag.Data.Row) return;
        var dataIndex=drag.Data.Row.DataIndex;

        if (!IFrameSplitOperator.IsNumber(dataIndex) || dataIndex<0) return;
        
        var textTop=drag.Inside.Y-(this.RowHeight/2);
        var top=textTop;
        var left=this.RectClient.Left;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;

        //背景
        this.Canvas.fillStyle=this.DragRowColor;
        this.Canvas.fillRect(left,textTop,rowWidth,this.RowHeight);   

        var symbol=this.Data.Data[dataIndex];
        var data= { Symbol:symbol , Stock:null, Block:null };
        if (this.GetStockDataCallback) data.Stock=this.GetStockDataCallback(symbol);
        if (this.GetBlockDataCallback) data.Block=this.GetBlockDataCallback(symbol);
        data.Decimal=GetfloatPrecision(symbol); //小数位数
        var chartRight=this.RectClient.Right;

        this.Canvas.font=this.ItemFont;
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top, 3);
            left+=item.Width;

            if (left>=chartRight) break;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top, 3);
            left+=item.Width;

            if (left>=chartRight) break;
        }

    }

    this.DrawDragHeader=function()
    {
        if (!this.DragHeader) return;
        var drag=this.DragHeader;
        var clickData=drag.ClickData;
        var rtHeader=clickData.Header.Rect;
        var headerWidth=rtHeader.Right-rtHeader.Left;
        
        var rtRow={ Left:drag.MovePoint.X-headerWidth/2, Top:this.RectClient.Top+this.HeaderHeight, Width:headerWidth };
        rtRow.Bottom=rtRow.Top+this.HeaderHeight+this.RowHeight*this.RowCount+this.FixedRowHeight*this.FixedRowCount;
        rtRow.Right=rtRow.Left+rtRow.Width;
        rtRow.Height=rtRow.Bottom-rtRow.Top;

        //背景
        this.Canvas.fillStyle=this.DragRowColor;
        this.Canvas.fillRect(rtRow.Left, rtRow.Top, rtRow.Width, rtRow.Height);   

        //文字
        var cellHeader={ Left:rtRow.Left, Top:rtRow.Top, Right:rtRow.Right, Width:rtRow.Width, Height:this.HeaderHeight };
        cellHeader.Bottom=cellHeader.Top+cellHeader.Height;
        this.DrawHeaderItem(clickData.Header.Column, cellHeader, clickData.Header.Index, { HeaderColor:this.DragRowTextColor });

        var textTop=cellHeader.Bottom+this.FixedRowHeight*this.FixedRowCount;
        this.Canvas.font=this.ItemFont;
        var dataCount=this.GetAllRowCount();
        for(var i=this.Data.YOffset, j=0; i<dataCount && j<this.RowCount ;++i, ++j)
        {
            var symbol=this.Data.Data[i];

            var data= { Symbol:symbol , Stock:null, Block:null };
            if (this.GetStockDataCallback) data.Stock=this.GetStockDataCallback(symbol);
            if (this.GetBlockDataCallback) data.Block=this.GetBlockDataCallback(symbol);
            if (this.GetFlashBGDataCallback) data.FlashBG=this.GetFlashBGDataCallback(symbol, Date.now());
            data.Decimal=GetfloatPrecision(symbol); //小数位数

            var item=this.Column[clickData.Header.Index];
            this.DrawItem(i, data, item, cellHeader.Left, textTop, 3);

            textTop+=this.RowHeight;
        }
    }

    this.GetTooltipData=function(x,y)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.TooltipRect)) return null;

        for(var i=0;i<this.TooltipRect.length;++i)
        {
            var item=this.TooltipRect[i];
            var rt=item.Rect;
            if (!rt) continue;

            if (x>=rt.Left && x<=rt.Right && y>=rt.Top && y<=rt.Bottom)
            {
                return { Rect:item.Rect, Stock:item.Stock, Column:item.Column, Index:item.Index, Type:item.Type, Data:item.Data };
            }
        }

        return null;
    }

    this.GetButtonData=function(x,y)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.ButtonRect)) return null;

        for(var i=0;i<this.ButtonRect.length;++i)
        {
            var item=this.ButtonRect[i];

            var rt=item.Rect;
            if (!rt) continue;

            if (x>=rt.Left && x<=rt.Right && y>=rt.Top && y<=rt.Bottom)
            {
                return { Rect:item.Rect, Stock:item.Stock, Column:item.Column, Index:item.Index, Type:item.Type, Data:item.Data, ColumnIndex:item.ColumnIndex };
            }
        }
    }

    this.PtInHeaderDragBorder=function(x, y)
    {
        if (!this.IsShowHeader) return null;

        var left=this.RectClient.Left;
        var right=this.RectClient.Right;
        var top=this.RectClient.Top;
        var bottom=top+this.HeaderHeight;

        if (!(x>=left && x<=right && y>=top && y<=bottom)) return null;

        var textLeft=left;
        var dragBarWidth=5*GetDevicePixelRatio();
        //固定列
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];

            if (item.EnableDragWidth===true)
            {
                var header={ Right:textLeft+item.Width, Top:top, Bottom:bottom };
                header.Left=header.Right-dragBarWidth;
                if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
                {
                    return { Rect:header, Column:item, Index:i, IsFixed:true };
                }
            }

            textLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (textLeft>=right) break;
            if (item.EnableDragWidth===true)
            {
                var header={ Right:textLeft+item.Width, Top:top, Bottom:bottom };
                header.Left=header.Right-dragBarWidth;
                if (x>=header.Left && x<=header.Right && y>=header.Top && y<=header.Bottom)
                {
                    return { Rect:header, Column:item, Index:i, IsFixed:false };
                }
            }
            
            textLeft+=item.Width;
        } 

        return null;
    }

    //设置选中行 option={ Symbol:, AutoYScroll:true/false Y滚动条自定定位 }
    this.SetSelectedRow=function(option)
    {
        if (!option) return false;
        if (this.SelectedModel===0) return false;

        if (option.Symbol)
        {
            var symbol=option.Symbol;
            var bFinder=false;
            for(var i=0;i<this.Data.Data.length;++i)
            {
                var item=this.Data.Data[i];
                if (symbol==item)
                {
                    this.SelectedRow=i;
                    bFinder=true;
                    break;
                }
            }

            if (!bFinder) return false;

            if (option.AutoYScroll===true)
            {
               this.UpdatePageYOffset({ SelectedRow:this.SelectedRow });
            }

            return bFinder;
        }


        return false;
    }

    this.UpdatePageYOffset=function(option)
    {
        if (!option) return;
        var selectedRow=option.SelectedRow;
        if (selectedRow<0) return;

        var pageStatus=this.GetCurrentPageStatus();
        if (pageStatus.IsSinglePage) return;
        if (selectedRow>=pageStatus.Start && selectedRow<=pageStatus.End) return;

        this.Data.YOffset=selectedRow; //选中行不在当前屏 设置为第1行
    }
}

//报价列表底部tab和横向滚动条
function ChartReportTab()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartReportTab';       //类名
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件

    this.Report;

    this.IsShow=true;                   //是否显示

    //Tab
    this.TabList=[];                //{ Title:标题, ID:, IsMenu: 是否菜单, ArySubMenu:[ { Title:, ID: }] }
    this.SelectedTabIndex=-1;
    this.MoveOnTabIndex=-1;
    
    //滚动条信息
    this.MaxPos=15;             //滚动条可移动长度
    this.CurrentPos=15;         //当前滚动条移动位置
    this.Step=1;                //滚动条移动步长
    this.ScrollBarWidth=g_JSChartResource.Report.Tab.ScrollBarWidth;
    this.ButtonColor=g_JSChartResource.Report.Tab.ButtonColor;
    this.BarColor=g_JSChartResource.Report.Tab.BarColor;
    this.BorderColor=g_JSChartResource.Report.Tab.BorderColor;
    this.Mergin={ Left:2, Right:2, Top:2, Bottom:2 };

    this.TabFontConfig={ Size:g_JSChartResource.Report.Tab.Font.Size, Name:g_JSChartResource.Report.Tab.Font.Name };
    this.TabFont;
    this.TabTitleColor=g_JSChartResource.Report.Tab.TabTitleColor;
    this.TabSelectedTitleColor=g_JSChartResource.Report.Tab.TabSelectedTitleColor;
    this.TabSelectedBGColor=g_JSChartResource.Report.Tab.TabSelectedBGColor;
    this.TabMoveOnTitleColor=g_JSChartResource.Report.Tab.TabMoveOnTitleColor;
    this.TabBGColor=g_JSChartResource.Report.Tab.TabBGColor;
    this.TabMergin=
    { 
        Top:g_JSChartResource.Report.Tab.Mergin.Top, 
        Left:g_JSChartResource.Report.Tab.Mergin.Left, 
        Right:g_JSChartResource.Report.Tab.Mergin.Right,
        Bottom:g_JSChartResource.Report.Tab.Mergin.Bottom
    };

    this.Height;
    this.ButtonSize=25;
    this.TabWidth=0;

    this.RectScroll={ Left:null, Right:null, Bar:null, Client:null };   //滚动条区域    

    this.ReloadResource=function(resource)
    {
        //滚动条
        this.ScrollBarWidth=g_JSChartResource.Report.Tab.ScrollBarWidth;
        this.ButtonColor=g_JSChartResource.Report.Tab.ButtonColor;
        this.BarColor=g_JSChartResource.Report.Tab.BarColor;
        this.BorderColor=g_JSChartResource.Report.Tab.BorderColor;

        //tab
        this.TabFontConfig={ Size:g_JSChartResource.Report.Tab.Font.Size, Name:g_JSChartResource.Report.Tab.Font.Name };
        this.TabTitleColor=g_JSChartResource.Report.Tab.TabTitleColor;
        this.TabSelectedTitleColor=g_JSChartResource.Report.Tab.TabSelectedTitleColor;
        this.TabSelectedBGColor=g_JSChartResource.Report.Tab.TabSelectedBGColor;
        this.TabMoveOnTitleColor=g_JSChartResource.Report.Tab.TabMoveOnTitleColor;
        this.TabBGColor=g_JSChartResource.Report.Tab.TabBGColor;
        this.TabMergin=
        { 
            Top:g_JSChartResource.Report.Tab.Mergin.Top, 
            Left:g_JSChartResource.Report.Tab.Mergin.Left, 
            Right:g_JSChartResource.Report.Tab.Mergin.Right,
            Bottom:g_JSChartResource.Report.Tab.Mergin.Bottom
        };
    }

    this.SetTabList=function(aryTab)
    {
        this.TabList=[];
        for(var i=0;i<aryTab.length;++i)
        {
            var item=aryTab[i];
            if (!item.Title) continue;

            var tabItem={ Title:item.Title, IsMenu:false, FixedSymbol:[], FixedRowCount:0 };
            if (item.ID) tabItem.ID=item.ID;
            if (item.CommandID) tabItem.CommandID=item.CommandID;
            if (IFrameSplitOperator.IsBool(item.IsMenu)) tabItem.IsMenu=item.IsMenu;
            if (IFrameSplitOperator.IsNonEmptyArray(item.FixedSymbol))
            {
                for(var j=0;j<item.FixedSymbol.length;++j)
                {
                    var stockItem=item.FixedSymbol[j];
                    if (!stockItem || !stockItem.Symbol) continue;
                    tabItem.FixedSymbol.push(stockItem);
                    ++tabItem.FixedRowCount;
                }
            }

            if (IFrameSplitOperator.IsNonEmptyArray(item.ArySubMenu))
                tabItem.ArySubMenu=item.ArySubMenu.slice();
            
            this.TabList.push(tabItem);
        }
    }

    this.CalculateSize=function()   //计算大小
    {
        var pixelRatio=GetDevicePixelRatio();
        this.TabFont=`${this.TabFontConfig.Size*pixelRatio}px ${ this.TabFontConfig.Name}`;
        this.Height=this.GetFontHeight(this.TabFont,"8")+ this.Mergin.Top+ this.Mergin.Bottom;
        var buttonSize=Math.min(25, this.Height-this.Mergin.Top-this.Mergin.Bottom);
        this.ButtonSize=buttonSize;
    }

    this.DrawScrollbar=function(left, top, right, bottom)
    {
        this.RectScroll={ Left:null, Right:null, Bar:null, Client:null };
        var columnOffset = this.Report.GetXScrollPos();
	    var clolumCount =this.Report.GetXScrollRange();
	    if (clolumCount <= 0) return;
        if (this.Report.IsShowAllColumn) return;

        var left=left+this.TabWidth;
        if (left+this.ScrollBarWidth*2>right) return;

        this.MaxPos=clolumCount;
        this.CurrentPos=columnOffset;

        var buttonSize=this.ButtonSize;

        var rtLeft={ Left:left+this.Mergin.Left, Top:bottom-buttonSize-this.Mergin.Bottom, Width:buttonSize, Height:buttonSize };
        rtLeft.Right=rtLeft.Left+buttonSize;
        rtLeft.Bottom=rtLeft.Top+buttonSize;

        var rtRight={ Left:right-buttonSize-this.Mergin.Right, Top:rtLeft.Top, Width:buttonSize, Height:buttonSize };
        rtRight.Right=rtRight.Left+buttonSize;
        rtRight.Bottom=rtRight.Top+buttonSize;

        this.Canvas.fillStyle=this.ButtonColor;
        this.Canvas.fillRect(rtLeft.Left,rtLeft.Top,rtLeft.Width,rtLeft.Height);   
        this.Canvas.fillRect(rtRight.Left,rtRight.Top,rtRight.Width,rtRight.Height); 

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.strokeRect(rtLeft.Left,rtLeft.Top,rtLeft.Width,rtLeft.Height);
        this.Canvas.strokeRect(rtRight.Left,rtRight.Top,rtRight.Width,rtRight.Height);


        var centerWidth = (rtRight.Left - 2) - (rtLeft.Right + 2);
	    var value = centerWidth - this.ScrollBarWidth;
	    var xOffset = (value * this.CurrentPos) / this.MaxPos;
	    var x = rtLeft.Right + 2 + xOffset;

        var rtBar = {Left:x, Top:rtLeft.Top, Width:this.ScrollBarWidth, Height: rtLeft.Height };
        rtBar.Right=rtBar.Left+this.ScrollBarWidth;
        rtBar.Bottom=rtLeft.Bottom;

        this.Canvas.fillStyle=this.BarColor;
        this.Canvas.fillRect(rtBar.Left,rtBar.Top,rtBar.Width,rtBar.Height);

        this.RectScroll.Left=rtLeft;
        this.RectScroll.Right=rtRight;
        this.RectScroll.Bar=rtBar;
        this.RectScroll.Client={ Left:rtLeft.Right, Right: rtRight.Left, Top:rtLeft.Top, Bottom:rtLeft.Bottom };
    }

    this.DrawTab=function(left, top, right, bottom)
    {
        this.TabWidth=0;
        this.Canvas.font=this.TabFont;
        this.Canvas.textBaseline="bottom";

        var tabHeight=bottom-top;
        var itemLeft=left+1;
        var y=bottom-this.TabMergin.Bottom, x=0;
        var text;
        var itemWidth=0;
        var i=0;
        for(i=0;i<this.TabList.length;++i)
        {
            var item=this.TabList[i];
            text=item.Title;

            if (item.IsMenu) text+="▲";

            x=itemLeft+this.TabMergin.Left;
            itemWidth=this.Canvas.measureText(text).width;

            var rtItem={Left:itemLeft, Top:top, Width:itemWidth+this.TabMergin.Left+this.TabMergin.Right, Height:tabHeight};
            rtItem.Right=rtItem.Left+rtItem.Width;
            rtItem.Bottom=rtItem.Top+rtItem.Height;
            if (rtItem.Right>right) break;

            

            var bgColor=this.TabBGColor;
            if (i==this.SelectedTabIndex) bgColor=this.TabSelectedBGColor
            this.Canvas.fillStyle=bgColor;
            this.Canvas.fillRect(rtItem.Left,rtItem.Top,rtItem.Width,rtItem.Height);  

            this.Canvas.textAlign="left";
            var textColor=this.TabTitleColor;
            if (i==this.MoveOnTabIndex) textColor=this.TabMoveOnTitleColor;
            if (i==this.SelectedTabIndex) textColor=this.TabSelectedTitleColor;
            this.Canvas.fillStyle=textColor;
            this.Canvas.fillText(text,x,y);

            item.Rect=rtItem;
            itemLeft+=rtItem.Width+1;
            this.TabWidth+=rtItem.Width+1;
        }

        for(;i<this.TabList.length;++i)
        {
            var item=this.TabList[i];
            item.Rect=null;
        }
    }

    this.OnMouseDown=function(x,y, e)
    {
        var tab=this.PtInTab(x,y);
        if (tab) return tab;
        return this.PtInScroll(x,y);
    }

    // Type 1-4 滚动条
    this.PtInScroll=function(x,y)
    {
        if (!this.RectScroll) return null;

        if (this.RectScroll.Left)
        {
            var rtItem=this.RectScroll.Left;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 1, Rect: rtItem };
        }

        if (this.RectScroll.Right)
        {
            var rtItem=this.RectScroll.Right;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 2, Rect: rtItem };
        }

        if (this.RectScroll.Bar)
        {
            var rtItem=this.RectScroll.Bar;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 3, Rect: rtItem };
        }

        if (this.RectScroll.Client)
        {
            var rtItem=this.RectScroll.Client;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) 
            {
                return { Type: 4, Rect: rtItem , Pos: this.GetScrollPostionByPoint(x,y) };
            }
        }

        return null;
    }

    // Type=5 标签 6=标签菜单
    this.PtInTab=function(x,y)
    {
        for(var i=0;i<this.TabList.length;++i)
        {
            var item=this.TabList[i];
            if (!item.Rect) continue;
            var rtItem=item.Rect;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) 
            {
                var result= { Type: 5, Rect: rtItem, Tab:item, Index:i };
                if (item.IsMenu==true) result.Type==6;
                return result;
            }   
        }

        return null;
    }

    this.GetFontHeight=function(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    this.GetScrollPostionByPoint=function(x,y)
    {
        var rtItem=this.RectScroll.Client;
        var value=rtItem.Right-rtItem.Left-this.ScrollBarWidth;
        var pos =parseInt((this.MaxPos * (x - rtItem.Left)) / value);
        return pos;
    }
}


//页脚信息
function ChartReportPageInfo()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartPageInfo';     //类名
    this.IsDrawFirst=false;
    this.IsShow=false;                   //是否显示
    this.SizeChange=true;
    this.Report;

    this.FontConfig={ Size:g_JSChartResource.Report.PageInfo.Font.Size, Name:g_JSChartResource.Report.PageInfo.Font.Name };
    this.TextColor=g_JSChartResource.Report.PageInfo.TextColor;
    this.BGColor=g_JSChartResource.Report.PageInfo.BGColor;
    this.Mergin=
    {
        Top:g_JSChartResource.Report.PageInfo.Mergin.Top, 
        Left:g_JSChartResource.Report.PageInfo.Mergin.Left, 
        Right:g_JSChartResource.Report.PageInfo.Mergin.Right,
        Bottom:g_JSChartResource.Report.PageInfo.Mergin.Bottom
    }


    this.Font;
    this.TextHeight=0;

    this.ReloadResource=function(resource)
    {
        this.FontConfig={ Size:g_JSChartResource.Report.PageInfo.Font.Size, Name:g_JSChartResource.Report.PageInfo.Font.Name };
        this.TextColor=g_JSChartResource.Report.PageInfo.TextColor;
        this.BGColor=g_JSChartResource.Report.PageInfo.BGColor;
        this.Mergin=
        {
            Top:g_JSChartResource.Report.PageInfo.Mergin.Top, 
            Left:g_JSChartResource.Report.PageInfo.Mergin.Left, 
            Right:g_JSChartResource.Report.PageInfo.Mergin.Right,
            Bottom:g_JSChartResource.Report.PageInfo.Mergin.Bottom
        }
    }

    this.Draw=function()
    {
        if (!this.IsShow) return;
        if (!this.Report) return;

        var pageStatus=this.Report.GetCurrentPageStatus();
        if (pageStatus.IsSinglePage) return;

        if (this.SizeChange)
        {
            var pixelRatio=GetDevicePixelRatio();
            this.Font=`${this.FontConfig.Size*pixelRatio}px ${ this.FontConfig.Name}`;
            this.TextHeight=GetFontHeight(this.Canvas, this.Font, "擎")+this.Mergin.Top+this.Mergin.Bottom;
        }
        
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var bottom=this.ChartBorder.GetBottom()-2;

        var center=left+(right-left)/2;
        var text=`${pageStatus.DataCount}/${pageStatus.DataCount}`;
        this.Canvas.font=this.Font;
        var textWidth=this.Canvas.measureText(text).width+4;

        var bgLeft=center-textWidth/2-this.Mergin.Left;
        var bgTop=bottom-this.TextHeight;
        this.Canvas.fillStyle=this.BGColor;;
        this.Canvas.fillRect(bgLeft,bgTop,textWidth+(this.Mergin.Left+this.Mergin.Right),this.TextHeight);   

        text=`${pageStatus.Start+1}/${pageStatus.DataCount}`;
        this.Canvas.textAlign="center";
        this.Canvas.textBaseline="bottom";
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.fillText(text,center,bottom-this.Mergin.Bottom);

        this.SizeChange=false;
    }
}


function ChartVScrollbar()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartVScrollbar';       //类名
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件
    this.Report;

    this.MaxPos=15;             //滚动条可移动长度
    this.CurrentPos=15;         //当前滚动条移动位置
    this.Step=1;                //滚动条移动步长
    this.ButtonSize=25;
    this.Enable=false;    
    this.LastStatus={ Draw:false, };    
    this.GlobalOption; 

    this.Style=0;   //0=滚动条+按钮  1=滚动条

    this.ScrollBarHeight=g_JSChartResource.Report.VScrollbar.ScrollBarHeight;
    this.ButtonColor=g_JSChartResource.Report.VScrollbar.ButtonColor;
    this.BarColor=g_JSChartResource.Report.VScrollbar.BarColor;
    this.BorderColor=g_JSChartResource.Report.VScrollbar.BorderColor;
    this.BGColor=g_JSChartResource.Report.VScrollbar.BGColor;
    this.Margin={ Left:2, Right:2, Top:2, Bottom:2 };
    this.BarWithConfig={ Size:g_JSChartResource.Report.VScrollbar.BarWidth.Size };

    this.RectScroll={ Top:null, Bottom:null, Bar:null, Client:null };   //滚动条区域  

    //this.BarWithConfig.Size=2;
    //this.Mergin={ Left:1, Right:1, Top:1, Bottom:1 };

    this.SetOption=function(option)
    {
        if (!option) return;

        if (IFrameSplitOperator.IsBool(option.Enable)) this.Enable=option.Enable;
        if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
        if (IFrameSplitOperator.IsNumber(option.BarWidth)) this.BarWithConfig.Size=option.BarWidth;
        if (option.Margin)
        {
            var item=option.Margin;
            if (IFrameSplitOperator.IsNumber(item.Top)) this.Margin.Top=item.Top;
            if (IFrameSplitOperator.IsNumber(item.Bottom)) this.Margin.Bottom=item.Bottom;
            if (IFrameSplitOperator.IsNumber(item.Left)) this.Margin.Left=item.Left;
            if (IFrameSplitOperator.IsNumber(item.Right)) this.Margin.Right=item.Right;
        }
    }
    
    this.ReloadResource=function(resource)
    {
        this.ScrollBarHeight=g_JSChartResource.Report.VScrollbar.ScrollBarHeight;
        this.ButtonColor=g_JSChartResource.Report.VScrollbar.ButtonColor;
        this.BarColor=g_JSChartResource.Report.VScrollbar.BarColor;
        this.BorderColor=g_JSChartResource.Report.VScrollbar.BorderColor;
        this.BGColor=g_JSChartResource.Report.VScrollbar.BGColor;
        this.BarWithConfig={ Size:g_JSChartResource.Report.VScrollbar.BarWidth.Size };
    }

    this.CalculateSize=function()
    {
        var pixelRatio=GetDevicePixelRatio();

        var width=this.BarWithConfig.Size*pixelRatio+this.Margin.Left+this.Margin.Right;
        this.ButtonSize=Math.min(25, width);
    }

    //不带上下按钮的滚动条样式
    this.DrawScrollbarStyle2=function(left, top, right, bottom)
    {
        this.LastStatus.Draw=false;
        this.RectScroll={ Left:null, Right:null, Bar:null, Client:null };
        if (!this.Enable) return;

        var isShow=this.IsShowCallback();
        if (!isShow) return;
        
        var pageInfo=this.Report.GetCurrentPageStatus();
        if (pageInfo.IsSinglePage) return;

        var xOffset=pageInfo.Start;
        var dataCount=pageInfo.DataCount-pageInfo.PageSize;
        var buttonSize=this.ButtonSize;

        this.MaxPos=dataCount;
        this.CurrentPos=xOffset;

        var scrollTop=top+this.Margin.Top+2;
        var scrollBottom=bottom-this.Margin.Bottom-2;
        var centerHeight=scrollBottom-scrollTop;
        var value = centerHeight - this.ScrollBarHeight;
	    var yOffset = (value * this.CurrentPos) / this.MaxPos;
	    var y = scrollTop + 2 + yOffset;

        var rtBar = {Right:right-this.Margin.Right, Top:y, Width:buttonSize, Height: this.ScrollBarHeight };
        rtBar.Left=rtBar.Right-buttonSize;
        rtBar.Bottom=rtBar.Top+rtBar.Height;
        if (rtBar.Bottom>scrollBottom-2) 
        {
            rtBar.Bottom=scrollBottom-2;
            rtBar.Top=rtBar.Bottom-rtBar.Height;
        }

        this.RectScroll.Bar=rtBar;
        this.RectScroll.Client={ Left:rtBar.Left, Right: rtBar.Right, Top:scrollTop, Bottom:scrollBottom };

        var rtBG={ Right:right, Top:top, Bottom:bottom, Width:buttonSize+this.Margin.Right+this.Margin.Left };
        rtBG.Left=rtBG.Right-rtBG.Width;
        rtBG.Height=rtBG.Bottom-rtBG.Top;
        this.Canvas.fillStyle=this.BGColor;
        this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);   

        this.Canvas.fillStyle=this.BarColor;
        this.Canvas.fillRect(rtBar.Left,rtBar.Top,rtBar.Width,rtBar.Height);

        this.LastStatus.Draw=true;
    }

    this.DrawScrollbarStyle=function(left, top, right, bottom)
    {
        this.LastStatus.Draw=false;
        this.RectScroll={ Left:null, Right:null, Bar:null, Client:null };
        if (!this.Enable) return;

        var isShow=this.IsShowCallback();
        if (!isShow) return;
        
        var pageInfo=this.Report.GetCurrentPageStatus();
        if (pageInfo.IsSinglePage) return;

        var xOffset=pageInfo.Start;
        var dataCount=pageInfo.DataCount-pageInfo.PageSize;
        var buttonSize=this.ButtonSize;

        this.MaxPos=dataCount;
        this.CurrentPos=xOffset;

        var rtTop={ Right:right-this.Margin.Right, Top:top+this.Margin.Top, Width:buttonSize, Height:buttonSize };
        rtTop.Left=rtTop.Right-buttonSize;
        rtTop.Bottom=rtTop.Top+buttonSize;

        var rtBottom={ Right:right-this.Margin.Right, Bottom:bottom-this.Margin.Bottom, Width:buttonSize, Height:buttonSize };
        rtBottom.Left=rtBottom.Right-buttonSize;
        rtBottom.Top=rtBottom.Bottom-buttonSize;

        var centerHeight=(rtBottom.Top-2)-(rtTop.Bottom+2);
        var value = centerHeight - this.ScrollBarHeight;
	    var yOffset = (value * this.CurrentPos) / this.MaxPos;
	    var y = rtTop.Bottom + 2 + yOffset;

        var rtBar = {Right:right-this.Margin.Right, Top:y, Width:buttonSize, Height: this.ScrollBarHeight };
        rtBar.Left=rtBar.Right-buttonSize;
        rtBar.Bottom=rtBar.Top+rtBar.Height;
        if (rtBar.Bottom>rtBottom.Top-2) 
        {
            rtBar.Bottom=rtBottom.Top-2;
            rtBar.Top=rtBar.Bottom-rtBar.Height;
        }

        this.RectScroll.Top=rtTop;
        this.RectScroll.Bottom=rtBottom;
        this.RectScroll.Bar=rtBar;
        this.RectScroll.Client={ Left:rtTop.Left, Right: rtTop.Right, Top:rtTop.Bottom, Bottom:rtBottom.Top };

        var rtBG={ Right:right, Top:top, Bottom:bottom, Width:buttonSize+this.Margin.Right+this.Margin.Left };
        rtBG.Left=rtBG.Right-rtBG.Width;
        rtBG.Height=rtBG.Bottom-rtBG.Top;
        this.Canvas.fillStyle=this.BGColor;
        this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);   

        this.Canvas.fillStyle=this.ButtonColor;
        this.Canvas.fillRect(rtTop.Left,rtTop.Top,rtTop.Width,rtTop.Height);   
        this.Canvas.fillRect(rtBottom.Left,rtBottom.Top,rtBottom.Width,rtBottom.Height); 

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.strokeRect(rtTop.Left,rtTop.Top,rtTop.Width,rtTop.Height);
        this.Canvas.strokeRect(rtBottom.Left,rtBottom.Top,rtBottom.Width,rtBottom.Height);

        this.Canvas.fillStyle=this.BarColor;
        this.Canvas.fillRect(rtBar.Left,rtBar.Top,rtBar.Width,rtBar.Height);

        this.LastStatus.Draw=true;
    }

    this.DrawScrollbar=function(left, top, right, bottom)
    {
        if (this.Style==1) 
            this.DrawScrollbarStyle2(left, top, right, bottom);
        else
            this.DrawScrollbarStyle(left, top, right, bottom);
    }

    this.OnMouseDown=function(x,y, e)
    {
        return this.PtInScroll(x,y);
    }

    // Type 1-4 滚动条
    this.PtInScroll=function(x,y)
    {
        if (!this.RectScroll) return null;

        if (this.RectScroll.Top)
        {
            var rtItem=this.RectScroll.Top;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 1, Rect: rtItem };
        }

        if (this.RectScroll.Bottom)
        {
            var rtItem=this.RectScroll.Bottom;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 2, Rect: rtItem };
        }

        if (this.RectScroll.Bar)
        {
            var rtItem=this.RectScroll.Bar;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) return { Type: 3, Rect: rtItem };
        }

        if (this.RectScroll.Client)
        {
            var rtItem=this.RectScroll.Client;
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom) 
            {
                return { Type: 4, Rect: rtItem , Pos: this.GetScrollPostionByPoint(x,y) };
            }
        }

        return null;
    }

    this.GetScrollPostionByPoint=function(x,y)
    {
        var rtItem=this.RectScroll.Client;
        var value=rtItem.Bottom-rtItem.Top-this.ScrollBarHeight;
        var pos =parseInt((this.MaxPos * (y - rtItem.Top)) / value);
        return pos;
    }
}

/* 使用div替换掉了
function ChartCellTooltip()
{
    this.Canvas;                            //画布
    this.ChartBorder;                       //边框信息
    this.ChartFrame;                        //框架画法
    this.Name;                              //名称
    this.ClassName='ChartCellTooltip';      //类名
    
    this.BGColor="rgba(255,255,225, 0.9)";
    this.BorderColor="rgb(0,0,0)";
    this.Margin={ Left:5, Right:5, Top:4, Bottom:5 };
    this.Font=`${13*GetDevicePixelRatio()}px 微软雅黑`;
    this.TextColor="rgb(0,0,0)";
    this.YOffset=20;
    this.XOffset=5;

    this.Point; //{ X, Y}
    this.Data;  //{ AryText:[ { Text, Color, Title:, TitleColor, Space, Margin:{ Left, Top, Right, Bottom }}  ]}   
    

    this.Draw=function()
    {
        if (!this.Canvas) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.AryText)) return;
        if (!this.Point) return;

        var size={ Width:0, Height:0, Text:[] };
        this.CalculateTextSize(this.Data.AryText, size);
        if (!IFrameSplitOperator.IsNonEmptyArray(size.Text)) return;

        this.DrawTooltip(this.Data.AryText, size);
    }

    this.CalculateTextSize=function(aryText, size)
    {
        var width=0, height=0;
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            var titleHeight=0, titleWidth=0;
            if (!item.Title && !item.Text) continue;

            if (item.Title)
            {
                if (item.TitleFont) this.Canvas.font=item.TitleFont;
                else this.Canvas.font=this.Font;

                titleWidth=this.Canvas.measureText(item.Title).width;   
                titleHeight=this.Canvas.measureText("擎").width;
            }

            var textWidth=0, textHeight=0;
            if (item.Text)
            {
                if (item.Font) this.Canvas.font=item.Font;
                else this.Canvas.font=this.Font;

                textWidth=this.Canvas.measureText(item.Text).width;   
                textHeight=this.Canvas.measureText("擎").width;
            }

            var itemWidth=titleWidth+textWidth;
            var itemHeight=Math.max(textHeight,titleHeight);

            if (IFrameSplitOperator.IsNumber(item.Space)) itemWidth+=item.Space;

            if (item.Margin)
            {
                var margin=item.Margin;
                if (IFrameSplitOperator.IsNumber(margin.Left)) itemWidth+=margin.Left;
                if (IFrameSplitOperator.IsNumber(margin.Right)) itemWidth+=margin.Right;
                if (IFrameSplitOperator.IsNumber(margin.Top)) itemHeight+=margin.Top;
                if (IFrameSplitOperator.IsNumber(margin.Bottom)) itemHeight+=margin.Bottom;
            }

            if (width<itemWidth) width=itemWidth;
            height+=itemHeight;

            size.Text[i]={ Width: itemWidth, Height:itemHeight, TitleWidth:titleWidth, TextWidth:textWidth };
        }

        if (this.Margin)
        {
            var margin=this.Margin;
            if (IFrameSplitOperator.IsNumber(margin.Left)) width+=margin.Left;
            if (IFrameSplitOperator.IsNumber(margin.Right)) width+=margin.Right;
            if (IFrameSplitOperator.IsNumber(margin.Top)) height+=margin.Top;
            if (IFrameSplitOperator.IsNumber(margin.Bottom)) height+=margin.Bottom;
        }

        size.Width=width;
        size.Height=height;
    }

    this.DrawTooltip=function(aryText, size)
    {
        var rtBG={ Left:this.Point.X+this.XOffset, Top:this.Point.Y+this.YOffset, Width:size.Width, Height:size.Height };
        rtBG.Right=rtBG.Left+rtBG.Width;
        rtBG.Bottom=rtBG.Top+rtBG.Height;

        var border=this.ChartBorder.GetBorder();
        if (rtBG.Bottom>border.ChartHeight)
        {
            rtBG.Bottom=this.Point.Y;
            rtBG.Top=rtBG.Bottom-rtBG.Height;
        }

        if (rtBG.Right>border.ChartWidth)
        {
            rtBG.Right=this.Point.X;
            rtBG.Left=rtBG.Right-rtBG.Width;
        }

        if (this.BGColor)
        {
            this.Canvas.fillStyle=this.BGColor;
            this.Canvas.fillRect(ToFixedPoint(rtBG.Left),ToFixedPoint(rtBG.Top),ToFixedRect(rtBG.Width),ToFixedRect(rtBG.Height));
        }
        
        if (this.BorderColor)
        {
            this.Canvas.strokeStyle=this.BorderColor;
            this.Canvas.strokeRect(ToFixedPoint(rtBG.Left),ToFixedPoint(rtBG.Top),ToFixedRect(rtBG.Width),ToFixedRect(rtBG.Height));
        }

        var left=rtBG.Left;
        var top=rtBG.Top;
        if (this.Margin && IFrameSplitOperator.IsNumber(this.Margin.Left)) left+=this.Margin.Left;
        if (this.Margin && IFrameSplitOperator.IsNumber(this.Margin.Top)) top+=this.Margin.Top;

        var xText, yText=top;
        for(var i=0;i<aryText.length;++i)
        {
            var item=aryText[i];
            if (!item.Title && !item.Text) continue;
            var itemSize=size.Text[i];

            xText=left;
            yText+=itemSize.Height;

            if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Left)) xText+=item.Margin.Left;
            if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Bottom)) yText-=item.Margin.Bottom;
            if (item.Title)
            {
                if (item.TitleColor) this.Canvas.fillStyle=item.TitleColor;
                else this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(item.Title,xText,yText,itemSize.TitleWidth);
                xText+=itemSize.TitleWidth;
                if (IFrameSplitOperator.IsNumber(item.Space)) xText+=item.Space;
            }

            if (item.Text)
            {
                if (item.Color) this.Canvas.fillStyle=item.Color;
                else this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(item.Text,xText,yText,itemSize.TextWidth);
            }

        }
    }
}
*/
