/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装T型报价列表控件 (H5版本)
   不提供内置测试数据
*/

function JSTReportChart(divElement)
{
    this.DivElement=divElement;
    this.JSChartContainer;              //表格控件
    this.ResizeListener;                //大小变动监听

     //h5 canvas
     this.CanvasElement=document.createElement("canvas");
     this.CanvasElement.className='jstreport-drawing';
     this.CanvasElement.id=Guid();
     this.CanvasElement.setAttribute("tabindex",0);
     if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
     if(divElement.hasChildNodes())
     {
         JSConsole.Chart.Log("[JSTReportChart::JSReportChart] divElement hasChildNodes", divElement.childNodes);
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

        JSConsole.Chart.Log(`[JSTReportChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    this.SetOption=function(option)
    {
        var chart=this.CreateJSTReportChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        if (option.EnableResize==true) this.CreateResizeListener();

        if (option.MinuteChartTooltip && option.MinuteChartTooltip.Enable) chart.InitalMinuteChartTooltip(option.MinuteChartTooltip);   //分时图
        if (option.FloatTooltip && option.FloatTooltip.Enable) chart.InitalFloatTooltip(option.FloatTooltip);   //提示信息

        if (option.Symbol)
        {
            chart.Draw();

            var name=option.Symbol;
            if (option.Name) name=option.Name;
            chart.ChangeSymbol(option.Symbol, {Name:name});   //下载列表码表
        }
        
    }

    this.CreateJSTReportChartContainer=function(option)
    {
        var chart=new JSTReportChartContainer(this.CanvasElement);
        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;
        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (IFrameSplitOperator.IsNonEmptyArray(option.Tab)) chart.SetTab(option.Tab);
        if (IFrameSplitOperator.IsNumber(option.TabSelected)) chart.SetSelectedTab(option.TabSelected);
        if (IFrameSplitOperator.IsBool(option.EnableDragRow)) chart.EnableDragRow=option.EnableDragRow;
        if (IFrameSplitOperator.IsNumber(option.DragRowType)) chart.DragRowType=option.DragRowType;
        if (IFrameSplitOperator.IsBool(option.EnableDragHeader)) chart.EnableDragHeader=option.EnableDragHeader;
        if (IFrameSplitOperator.IsBool(option.EnablePageCycle)) chart.EnablePageCycle=option.EnablePageCycle;
        if (IFrameSplitOperator.IsNumber(option.FixedRowCount)) chart.SetFixedRowCount(option.FixedRowCount);   //固定行
        if (option.SortInfo)
        {
            var item=option.SortInfo;
            if (IFrameSplitOperator.IsNumber(item.Field)) chart.SortInfo.Field=item.Field;
            if (IFrameSplitOperator.IsNumber(item.Sort)) chart.SortInfo.Sort=item.Sort;
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
        JSConsole.Chart.Log("[JSTReportChart::OnDivResize] entries=", entries);

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

    //事件回调
    this.AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSTReportChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    this.ReloadResource=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSTReportChart:ReloadResource] ');
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
            JSConsole.Chart.Log('[JSTReportChart:Draw] ');
            this.JSChartContainer.Draw();
        }
    }
}

JSTReportChart.Init=function(divElement)
{
    var jsChartControl=new JSTReportChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

//自定义风格
JSTReportChart.SetStyle=function(option)
{
    if (option) g_JSChartResource.SetStyle(option);
}

//获取颜色配置 (设置配必须啊在JSChart.Init()之前)
JSTReportChart.GetResource=function()  
{
    return g_JSChartResource;
}

JSTReportChart.GetfloatPrecision=function(symbol)
{
    return GetfloatPrecision(symbol);
}

function HQTReportItem()
{
    this.Symbol;
    this.Name;
    this.YClose;
    this.Open;
    this.Price;
    this.High;
    this.Low;
    this.Amount;
    this.Vol;
    this.Positon;   //持仓量

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

    this.CloseLine;     //{Data:[], Max:, Min:, Count: }

    this.ExtendData;    //扩展数据
}

function JSTReportChartContainer(uielement)
{
    this.ClassName='JSTReportChartContainer';
    this.Frame;                                     //框架画法
    this.ChartPaint=[];                             //图形画法
    this.ChartSplashPaint=null;                     //等待提示
    this.LoadDataSplashTitle="数据加载中";           //下载数据提示信息

    this.SplashTitle={ StockList:"下载码表中....." } ;
    this.Canvas=uielement.getContext("2d");         //画布

    this.Tooltip=document.createElement("div");
    this.Tooltip.className='jstreport-tooltip';
    this.Tooltip.style.background=g_JSChartResource.TooltipBGColor;
    this.Tooltip.style.opacity=g_JSChartResource.TooltipAlpha;
    this.Tooltip.style["pointer-events"]="none";
    this.Tooltip.id=Guid();
    uielement.parentNode.appendChild(this.Tooltip);

    this.Symbol;    //期权对应的品种代码
    this.Name;      //期权对应的品种名称
    this.NetworkFilter;                                 //数据回调接口
    this.Data={ XOffset:0, YOffset:0, Data:[], Price:null };        //股票列表 Price=标的物市场价格
    this.BorderData={ MapData:null }; //key=Field Value:[null, {ExePrice} ,{ExePrice} ]
    this.SourceData={ Data:[] } ;                       //原始股票顺序(排序还原用) {ExePrice=行权价格 LeftData:, RightData}

    this.FixedRowData={ Data:[] }; //[ { TData:{ LeftData:[], RightData:[] }} , ...];   顶部固定行Data:[{ Value:, Text:, Color:, TextAgiln: }] 

    this.DelayUpdateTimer=null;     //延迟更新
    this.DelayUpdateFrequency=500;  //延迟更新时间

    this.MapStockData;
    this.MapExePriceData;

    this.FlashBG=new Map();  
    this.FlashBGTimer=null;                            //闪烁背景 Value:{ LastTime:数据最后的时间, Data: { Key:ID, BGColor:, Time: , Count: 次数 } };
    this.GlobalOption={ FlashBGCount:0 }

    this.SortInfo={ Field:-1, Sort:0 };                //排序信息 {Field:排序字段id, Sort:0 不排序 1升序 2降序 }

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.AutoUpdateTimer=null;
    this.AutoUpdateFrequency=15000;             //15秒更新一次数据

    this.UIElement=uielement;
    this.LastPoint=new Point();     //鼠标位置
    this.IsOnTouch=false;
    this.TouchDrag;
    this.TouchMoveMinAngle=70;          //左右移动最小角度
    this.YStepPixel=5*GetDevicePixelRatio();
    this.XStepPixel=10*GetDevicePixelRatio();   
    
    //拖拽滚动条
    this.DragXScroll=null;  //{Start:{x,y}, End:{x, y}}
    this.EnablePageCycle=false; //是否循环翻页

    this.TooltipMinuteChart;    //分时图
    this.FloatTooltip;          //浮框提示
    this.LastMouseStatus={ MoveStatus:null, TooltipStatus:null, MouseOnStatus:null };

    this.IsDestroy=false;        //是否已经销毁了

    this.ChartDestroy=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();
        this.DestroyMinuteChartTooltip();
        this.DestroyFloatTooltip();
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
            DataType:4,
        };

        this.FloatTooltip.Update(sendData);
    }

    //清空固定行数据
    this.ClearFixedRowData=function()
    {
        this.FixedRowData.Data=[];
    }

    //设置固定行
    this.SetFixedRowCount=function(value)
    {
        var chart=this.ChartPaint[0];
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
        this.Frame=new JSTReportFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;

        //创建表格
        var chart=new ChartTReport();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetExePriceDataCallback=(exePrice)=>{ return this.GetExePriceData(exePrice);}
        chart.GetFlashBGDataCallback=(symbol, time)=>{ return this.GetFlashBGData(symbol, time); }
        chart.Data=this.Data;
        chart.BorderData=this.BorderData;
        chart.GlobalOption=this.GlobalOption;
        chart.FixedRowData=this.FixedRowData;
        chart.SortInfo=this.SortInfo;
        this.ChartPaint[0]=chart;

        
        if (option)
        {
            if (IFrameSplitOperator.IsBool(option.IsShowHeader)) chart.IsShowHeader=option.IsShowHeader;    //是否显示表头
            if (IFrameSplitOperator.IsNumber(option.FixedColumn)) chart.FixedColumn=option.FixedColumn;     //固定列

            if (IFrameSplitOperator.IsNumber(option.BorderLine)) this.Frame.BorderLine=option.BorderLine;   //边框
            if (IFrameSplitOperator.IsBool(option.ItemBorder)) chart.IsDrawBorder=option.ItemBorder;            //单元格边框
            if (IFrameSplitOperator.IsNumber(option.SelectedModel)) chart.SelectedModel=option.SelectedModel;
        }

        var bRegisterKeydown=true;
        var bRegisterWheel=true;

        if (option)
        {
            if (option.KeyDown===false) 
            {
                bRegisterKeydown=false;
                JSConsole.Chart.Log('[JSTReportChartContainer::Create] not register keydown event.');
            }

            if (option.Wheel===false) 
            {
                bRegisterWheel=false;
                JSConsole.Chart.Log('[JSTReportChartContainer::Create] not register wheel event.');
            }
        }

        if (bRegisterKeydown) this.UIElement.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true);            //键盘消息
        if (bRegisterWheel) this.UIElement.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true);                  //上下滚动消息

        
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }

        /*
        this.UIElement.onmouseup=(e)=>{ this.UIOnMounseUp(e); }
        
        

        //手机拖拽
        this.UIElement.ontouchstart=(e)=> { this.OnTouchStart(e); } 
        this.UIElement.ontouchmove=(e)=> {this.OnTouchMove(e); }
        this.UIElement.ontouchend=(e)=> {this.OnTouchEnd(e); } 
        */
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
                item.Draw();
        }

        for(var i=0; i<this.ChartPaint.length; ++i)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw();
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

    this.ClearData=function()
    {
        this.SourceData.Data=[];
        this.Data.Data=[];
        this.Data.Price=null;
        this.Data.XOffset=0;    //清空偏移
        this.Data.YOffset=0;
        this.MapStockData=new Map();
        this.MapExePriceData=null;
        this.BorderData.MapData=null;
    }

    this.StopAutoUpdate=function()
    {
        this.CancelAutoUpdate();
        this.AutoUpdateEvent(false,'JSTReportChartContainer::StopAutoUpdate');
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

    this.ChangeSymbol=function(symbol, option)
    {
        this.CancelAutoUpdate();
        this.ClearData();
        this.Symbol=symbol;
        this.Name=symbol;
        if (option)
        {
            if (option.Name) this.Name=option.Name;
        }

        this.RequestStockListData();
    }

    this.CancelAutoUpdate=function()    //关闭停止更新
    {
        if (typeof (this.AutoUpdateTimer) == 'number') 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
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

    //请求列表
    this.RequestStockListData=function()
    {
        this.ChartSplashPaint.SetTitle(this.SplashTitle.StockList);
        this.ChartSplashPaint.EnableSplash(true);
        this.Draw();

        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSTReportChartContainer::RequestStockListData', //类名::
                Explain:'T型报价列表数据',
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                if (!data) return;
                if (data.symbol!=self.Symbol) return;

                self.ChartSplashPaint.EnableSplash(false);
                self.RecvStockListData(data);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        throw { Name:'JSTReportChartContainer::RequestStockListData', Error:'(T型报价列表数据)不提供内置测试数据' };
    }

    this.RecvStockListData=function(data)
    {
        this.MapExePriceData=new Map();
        this.MapStockData=new Map();

        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            //0=行权价格 1=左边期权代码 2=右侧期权代码 3=左侧期权名称 4=右侧期权名称
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var exePrice=item[0];

                var leftData=new HQTReportItem();
                leftData.Symbol=leftData.Name=item[1];
                if (item[3]) leftData.Name=item[3];

                var rightData=new HQTReportItem();
                rightData.Symbol=rightData.Name=item[2];
                if (item[4]) rightData.Name=item[4];

                this.MapStockData.set(leftData.Symbol, leftData);
                this.MapStockData.set(rightData.Symbol, rightData);

                var dataItem={ ExePrice:exePrice, LeftData:leftData, RightData:rightData };
                this.MapExePriceData.set(dataItem.ExePrice, dataItem);

                this.SourceData.Data.push(exePrice);
                this.Data.Data.push(exePrice);
            }
        }

        if (IFrameSplitOperator.IsNumber(data.price))
        {
            this.Data.Price=data.price;
        }

        if ( IFrameSplitOperator.IsNumber(data.Decimal)) 
        {
            var chart=this.ChartPaint[0];
            if (chart) chart.DefaultDecimal=data.Decimal;
        }

        this.Draw();
        
        this.UpdateStockData();
    }

    this.GetExePriceData=function(exePrice)
    {
        if (!this.MapExePriceData) return null;
        if (!this.MapExePriceData.has(exePrice)) return null;

        return this.MapExePriceData.get(exePrice);
    }

    this.UpdateStockData=function()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;
        if (this.MapStockData.size<=0) return;

        var arySymbol=[];
        for(var mapItem of this.MapStockData)
        {
            arySymbol.push(mapItem[0]);
        }

        if (!IFrameSplitOperator.IsNonEmptyArray(arySymbol)) return;
        this.RequestStockData(arySymbol);
    }

    //下载期权数据
    this.RequestStockData=function(arySymbol)
    {
        var self=this;
        if (this.NetworkFilter)
        {
            var chart=this.ChartPaint[0];
            var obj=
            {
                Name:'JSTReportChartContainer::RequestStockData', //类名::函数名
                Explain:'T型报价列表期权数据',
                Request:{ Data: { stocks: arySymbol, symbol:this.Symbol, fixedRowCount:chart.FixedRowCount } }, 
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

        throw { Name:'JSTReportChartContainer::RequestStockData', Error:'(T型报价列表期权数据)不提供内置测试数据' };
    }

    this.RecvStockData=function(data)
    {
        var setUpdateSymbol=new Set(); //更新的股票列表
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            for(var i=0;i<data.data.length;++i)
            {
                var item=data.data[i];
                var symbol=item[0];  //0=证券代码;
                if (!symbol) continue;
                var stock=null;
                if (this.MapStockData.has(symbol))
                {
                    stock=this.MapStockData.get(symbol);
                }
                else
                {
                    stock=new HQTReportItem();
                    stock.Symbol=symbol;
                    this.MapStockData.set(symbol, stock);
                }

                this.ReadStockJsonData(stock, item);

                if (!setUpdateSymbol.has(symbol)) setUpdateSymbol.add(symbol);
            }
        }

        if (IFrameSplitOperator.IsNumber(data.price)) this.Data.Price=data.price;

        if (IFrameSplitOperator.IsNonEmptyArray(data.fixedRowData))
        {
            for(var i=0;i<data.fixedRowData.length;++i)
            {
                var item=data.fixedRowData[i];
                if (!item || !item.TData) continue;

                this.FixedRowData.Data[i]=item;
            }
        }

        var chart=this.ChartPaint[0];
        //实时数据排序
        if (chart && (this.SortInfo.Sort==1 || this.SortInfo.Sort==2 ) && IFrameSplitOperator.IsNumber(this.SortInfo.Field) && this.SortInfo.Field>=0)
        {
            var column=chart.Column[this.SortInfo.Field];
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_TREPORT_LOCAL_SORT);
            if (event && event.Callback)
            {
                var sendData={ Column:column, SortInfo:this.SortInfo, SymbolList:this.Data.Data, Result:null };
                event.Callback (event, sendData, this);
                if (Array.isArray(sendData.Result)) this.Data.Data=sendData.Result;
            }
            else
            {
                this.Data.Data.sort((left, right)=> { return this.LocalSort(left, right, column, this.SortInfo.Sort, this.SortInfo.CellType); });
            }
        }
        
        this.CalculateData();

        this.Draw();
    }

    //计算统计数据
    this.CalculateData=function()
    {
        if (!this.MapExePriceData || this.MapExePriceData.size<=0) return;

        var leftMaxPosition={ Max:null, ExePrice:null, CellType:1 };
        var rightMaxPosition={ Max:null,ExePrice:null, CellType:2 };
        this.BorderData.MapData=new Map();
        for(var mapItem of this.MapExePriceData)
        {
            var item=mapItem[1];
            var leftData=item.LeftData;
            var rightData=item.RightData;
            if (leftData && IFrameSplitOperator.IsNumber(leftData.Position))
            {
                if (leftMaxPosition.Max==null || leftMaxPosition.Max<leftData.Position) 
                {
                    leftMaxPosition.Max=leftData.Position;
                    leftMaxPosition.ExePrice=mapItem[0];
                }
            }

            if (rightData && IFrameSplitOperator.IsNumber(rightData.Position))
            {
                if (rightMaxPosition.Max==null || rightMaxPosition.Max<rightData.Position) 
                {
                    rightMaxPosition.Max=rightData.Position;
                    rightMaxPosition.ExePrice=mapItem[0];
                }
            }
        }

        var aryData=[null, null, null];
        if (leftMaxPosition.ExePrice) aryData[1]=leftMaxPosition;
        if (rightMaxPosition.ExePrice) aryData[2]=rightMaxPosition;
        
        this.BorderData.MapData.set(TREPORT_COLUMN_ID.POSITION_ID, { Data:aryData });
    }

    //读取单条股票json数据
    this.ReadStockJsonData=function(stock, item)
    {
        //0=证券代码 1=股票名称 2=昨收 3=开 4=高 5=低 6=收 7=成交量 8=成交金额, 9=买价 10=买量 11=卖价 12=卖量 13=均价 14=持仓 16=涨停价 17=跌停价
        //21=涨幅% 22=涨跌 24=振幅% 
        //30=全局扩展数据  31=当前板块扩展数据
        // 101-110 数值

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
        if (IFrameSplitOperator.IsNumber(item[13])) stock.AvPrice=item[13];           //均价
        if (IFrameSplitOperator.IsNumber(item[14])) stock.Position=item[14];          //持仓
       
        if (IFrameSplitOperator.IsNumber(item[16])) stock.LimitHigh=item[16];        //涨停价
        if (IFrameSplitOperator.IsNumber(item[17])) stock.LimitLow=item[17];         //跌停价
       
        if (IFrameSplitOperator.IsNumber(item[21])) stock.Increase=item[21];         //涨幅%
        if (IFrameSplitOperator.IsNumber(item[22])) stock.UpDown=item[22];           //涨跌
       
        if (IFrameSplitOperator.IsNumber(item[24])) stock.Amplitude=item[24];        //振幅%
      
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

        if (!IFrameSplitOperator.IsNumber(item[24]))    //振幅%
        {
            if (IFrameSplitOperator.IsNumber(stock.High) && IFrameSplitOperator.IsNumber(stock.Low) && IFrameSplitOperator.IsNumber(stock.YClose) && stock.YClose!=0)
                stock.Amplitude=(stock.High-stock.Low)/stock.YClose*100;
        }

        if (item[30]) 
            stock.ExtendData=item[30];                              //30=全局扩展数据

        if (item[32]) stock.CloseLine=item[32];                     //32=收盘价线
        if (item[33]) stock.KLine=item[33];                         //33=K线
        if (item[34]) stock.ExePrice=item[34];                      //34=行权价设置 { BGColor:背景色, Text:, TextColor }

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
        if (IFrameSplitOperator.IsString(item[201]) || IFrameSplitOperator.IsObject(item[201])) stock.ReserveString1=item[201];
        if (IFrameSplitOperator.IsString(item[202]) || IFrameSplitOperator.IsObject(item[202])) stock.ReserveString2=item[202];
        if (IFrameSplitOperator.IsString(item[203]) || IFrameSplitOperator.IsObject(item[203])) stock.ReserveString3=item[203];
        if (IFrameSplitOperator.IsString(item[204]) || IFrameSplitOperator.IsObject(item[204])) stock.ReserveString4=item[204];
        if (IFrameSplitOperator.IsString(item[205]) || IFrameSplitOperator.IsObject(item[205])) stock.ReserveString5=item[205];
        if (IFrameSplitOperator.IsString(item[206]) || IFrameSplitOperator.IsObject(item[206])) stock.ReserveString6=item[206];
        if (IFrameSplitOperator.IsString(item[207]) || IFrameSplitOperator.IsObject(item[207])) stock.ReserveString7=item[207];
        if (IFrameSplitOperator.IsString(item[208]) || IFrameSplitOperator.IsObject(item[208])) stock.ReserveString8=item[208];
        if (IFrameSplitOperator.IsString(item[209]) || IFrameSplitOperator.IsObject(item[209])) stock.ReserveString9=item[209];
        if (IFrameSplitOperator.IsString(item[210]) || IFrameSplitOperator.IsObject(item[210])) stock.ReserveString10=item[210];
    }

    
    this.AutoUpdate=function(waitTime)  //waitTime 更新时间
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        
        var self = this;
        var marketStatus=2;
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_TREPORT_MARKET_STATUS);
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

    this.UIOnDblClick=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.GetTReportChart();
        if (chart) chart.OnDblClick(x,y,e);
    }

    this.UIOnMouseDown=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (!chart) return;
            
        var clickData=chart.OnMouseDown(x,y,e);
        if (!clickData) return;

        if ((clickData.Type==2) && (e.button==0 || e.button==2))  //点击行
        {
            if (clickData.Redraw==true) this.Draw();
        }
        else if (clickData.Type==3 && e.button==0) //表头
        {
            this.OnClickHeader(clickData, e);
        }
        
        //document.onmousemove=(e)=>{ this.DocOnMouseMove(e); }
        //document.onmouseup=(e)=> { this.DocOnMouseUp(e); }
    }

    this.GetTReportChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart)  return null;

        return chart;
    }

    this.UIOnMouseMove=function(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        
        var oldMouseOnStatus=this.LastMouseStatus.MouseOnStatus;
        this.LastMouseStatus.OnMouseMove=null;

        var bShowTooltip=false;
        this.LastMouseStatus.TooltipStatus=null;

        var bShowChartTooltip=false;
        var chartTooltipData=null;
        
        this.LastMouseStatus.OnMouseMove={ X:x, Y:y };
        var mouseStatus={ Cursor:"default", Name:"Default"};;   //鼠标状态
        var report=this.GetTReportChart();
        var bDraw=false;
        
        if (report)
        {
            var tooltipData=report.GetTooltipData(x,y);  //单元格提示信息
            if (tooltipData)
            {
                if (tooltipData.Type==20)
                {
                    if (tooltipData.Data && tooltipData.Data.Symbol)
                    {
                        bShowChartTooltip=true;
                        chartTooltipData={ Symbol:tooltipData.Data.Symbol, Rect:tooltipData.Rect };
                    }
                }
                else
                {
                    this.LastMouseStatus.TooltipStatus={ X:x, Y:y, Data:tooltipData, ClientX:e.clientX, ClientY:e.clientY };
                    bShowTooltip=true;
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

        if (bShowChartTooltip)
        {
            this.ShowMinuteChartTooltip(null, null, chartTooltipData);
        }
        else
        {
            this.HideMinuteChartTooltip();
        }

        if (bShowTooltip)
        {
            var xTooltip = e.clientX-this.UIElement.getBoundingClientRect().left;
            var yTooltip = e.clientY-this.UIElement.getBoundingClientRect().top;
            this.DrawFloatTooltip({X:xTooltip, Y:yTooltip, YMove:20/pixelTatio},this.LastMouseStatus.TooltipStatus.Data);
        }
        else
        {
            this.HideFloatTooltip();
        }
    }

    this.UIOnMounseOut=function(e)
    {
        this.HideMinuteChartTooltip();
    }

    this.UIOnMouseleave=function(e)
    {
        this.HideMinuteChartTooltip();
    }

    this.UIOnContextMenu=function(e)
    {
        e.preventDefault();
        
        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        this.OnRightMenu(x,y,e);   //右键菜单事件
    }

    this.OnRightMenu=function(x,y,e)
    {
        
    }

    //点表头
    this.OnClickHeader=function(clickData, e)
    {
        var header=clickData.Header;

        if (header.Column && header.Column.Sort==1) 
        {
            var data={ CellType:header.CellType, ColumnIndex:header.ColumnIndex }
            this.SortHeader(header.Column, data);
        }

    }

    //排序
    this.SortHeader=function(column, sortData)
    {
        var sortInfo={ Field:this.SortInfo.Field, Sort:this.SortInfo.Sort, CellType:this.SortInfo.CellType };
        var arySortType=column.SortType;

        if (sortInfo.Field!=sortData.ColumnIndex || sortInfo.CellType!=sortData.CellType)
        {
            sortInfo.Field=sortData.ColumnIndex;
            sortInfo.CellType=sortData.CellType;
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

        if (sortInfo.Sort==0)   //还原
        {
            this.Data.Data=[];
            for(var i=0;i<this.SourceData.Data.length;++i)
            {
                this.Data.Data.push(this.SourceData.Data[i]);
            }
        } 
        else
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_TREPORT_LOCAL_SORT);
            if (event && event.Callback)
            {
                var sendData={ Column:column, SortInfo:sortInfo, SymbolList:this.Data.Data, Result:null };
                event.Callback (event, sendData, this);
                if (Array.isArray(sendData.Result)) this.Data.Data=sendData.Result;
            }
            else
            {
                this.Data.Data.sort((left, right)=> { return this.LocalSort(left, right, column, sortInfo.Sort, sortInfo.CellType); });
            }
        }

        this.Data.YOffset=0;
        this.SortInfo.Field=sortInfo.Field;
        this.SortInfo.Sort=sortInfo.Sort;
        this.SortInfo.CellType=sortInfo.CellType;
        this.Draw();
        this.DelayUpdateStockData();
    }

    //本地排序
    this.LocalSort=function(left, right, column, sortType, cellType)
    {
        switch(column.Type)
        {
            case TREPORT_COLUMN_ID.SYMBOL_ID:
            case TREPORT_COLUMN_ID.NAME_ID:
                return this.LocalStringSort(left, right, column, sortType, cellType);

            case TREPORT_COLUMN_ID.PRICE_ID:
            case TREPORT_COLUMN_ID.VOL_ID:
            case TREPORT_COLUMN_ID.UPDOWN_ID:
            case TREPORT_COLUMN_ID.BUY_PRICE_ID:
            case TREPORT_COLUMN_ID.SELL_PRICE_ID:
            case TREPORT_COLUMN_ID.AMOUNT_ID:
            case TREPORT_COLUMN_ID.BUY_VOL_ID:
            case TREPORT_COLUMN_ID.SELL_VOL_ID:
            case TREPORT_COLUMN_ID.YCLOSE_ID:
            case TREPORT_COLUMN_ID.OPEN_ID:
            case TREPORT_COLUMN_ID.HIGH_ID:
            case TREPORT_COLUMN_ID.LOW_ID:
            case TREPORT_COLUMN_ID.AVERAGE_PRICE_ID:
            case TREPORT_COLUMN_ID.EXE_PRICE_ID:     //行权价格
            case TREPORT_COLUMN_ID.POSITION_ID:      //持仓量
            case TREPORT_COLUMN_ID.AMPLITUDE_ID:
            case TREPORT_COLUMN_ID.INCREASE_ID:

            case TREPORT_COLUMN_ID.RESERVE_NUMBER1_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER2_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER3_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER4_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER5_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER6_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER7_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER8_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER9_ID:
            case TREPORT_COLUMN_ID.RESERVE_NUMBER10_ID:
                return this.LocalNumberSort(left, right, column, sortType, cellType);
           
            default:

                return 0;
        }
    }

    this.LocalNumberSort=function(left, right, column, sortType, cellType)
    {
        var leftStock=this.GetExePriceData(left);
        var rightStock=this.GetExePriceData(right);

        var leftValue=-99999999999999, rightValue=-99999999999999;
        if (sortType==2) leftValue=rightValue=99999999999999;

        var filedName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);

        if (cellType==0)    //行权价格
        {
            if (leftStock && IFrameSplitOperator.IsNumber(leftStock.ExePrice)) leftValue=leftStock.ExePrice;
            if (rightStock && IFrameSplitOperator.IsNumber(rightStock.ExePrice)) rightValue=rightStock.ExePrice;
        }
        else if (cellType==1)
        {
            if (leftStock && leftStock.LeftData) 
            {
                var value=leftStock.LeftData[filedName];
                if (IFrameSplitOperator.IsNumber(value)) leftValue=value;
            }
            if (rightStock && rightStock.LeftData)
            {
                var value=rightStock.LeftData[filedName];
                if (IFrameSplitOperator.IsNumber(value)) rightValue=value;
            } 
        }
        else if (cellType==2)
        {
            if (leftStock && leftStock.RightData)
            {
                var value=leftStock.RightData[filedName];
                if (IFrameSplitOperator.IsNumber(value)) leftValue=value;
            }  
            if (rightStock && rightStock.RightData)
            {
                var value=rightStock.RightData[filedName]
                if (IFrameSplitOperator.IsNumber(value)) rightValue=value;
            }
        }

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

    this.OnWheel=function(e)    //滚轴
    {
        JSConsole.Chart.Log('[JSTReportChartContainer::OnWheel]',e);
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);
        if (!isInClient) return;

        var chart=this.GetTReportChart();
        if (!chart) return;

        var wheelValue=e.wheelDelta;
        if (!IFrameSplitOperator.IsObjectExist(e.wheelDelta))
            wheelValue=e.deltaY* -0.01;

        if (wheelValue<0)   //下
        {
            this.LastMouseStatus.TooltipStatus=null;
            this.HideMinuteChartTooltip();
            this.HideFloatTooltip();
            var result=this.MoveSelectedRow(1,{ EnablePageCycle:this.EnablePageCycle })
            if (result)
            {
                if (result.Redraw) this.Draw();
                if (result.Update) this.DelayUpdateStockData();
            }
        }
        else if (wheelValue>0)  //上
        {
            this.LastMouseStatus.TooltipStatus=null;
            this.HideMinuteChartTooltip();
            this.HideFloatTooltip();
            var result=this.MoveSelectedRow(-1,{ EnablePageCycle:this.EnablePageCycle} );
            if (result)
            {
                if (result.Redraw) this.Draw();
                if (result.Update) this.DelayUpdateStockData();
            }
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnKeyDown=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        var reportChart=this.GetTReportChart();
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

        this.HideMinuteChartTooltip();
        this.HideFloatTooltip();

        switch(keyID)
        {
            /*
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
            */
            case 38:    //up
                var result=this.MoveSelectedRow(-1,{EnablePageCycle:this.EnablePageCycle});
                if (result)
                {
                    if (result.Redraw) this.Draw();
                    if (result.Update) this.DelayUpdateStockData();
                }
                break;
            case 40:    //down
                var result=this.MoveSelectedRow(1, {EnablePageCycle:this.EnablePageCycle} )
                if (result)
                {
                    if (result.Redraw) this.Draw();
                    if (result.Update) this.DelayUpdateStockData();
                }
                break;
        }

        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.MoveSelectedRowEvent=function(oldData, nowData)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;

        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MOVE_SELECTED_TREPORT_ROW);
        if (!event || !event.Callback) return;

        if (oldData && nowData)
        {
            if (oldData.ExePrice==nowData.ExePrice && oldData.CellType==nowData.CellType) return;
        }

        if (oldData)
        {
            if (chart.GetExePriceDataCallback) oldData.TData=chart.GetExePriceDataCallback(oldData.ExePrice);
            if (oldData.TData)
            {
                if (oldData.CellType==1) oldData.Item=oldData.TData.LeftData;
                else if (oldData.CellType==2) oldData.Item=oldData.TData.RightData;
            }
        }

        if (nowData)
        {
            if (chart.GetExePriceDataCallback) nowData.TData=chart.GetExePriceDataCallback(nowData.ExePrice);
            if (nowData.TData)
            {
                if (nowData.CellType==1) nowData.Item=nowData.TData.LeftData;
                else if (nowData.CellType==2) nowData.Item=nowData.TData.RightData;
            }
        }

        var endData={ Old:oldData, Now:nowData, Symbol:this.Symbol };
        event.Callback(event, endData, this);
    }

    //是否循环翻页 { EnablePageCycle: true/false }
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

        var result={ Redraw:false, Update:false };  //Redraw=重绘, Update=更新数据
       
        var pageStatus=chart.GetCurrentPageStatus();
        var pageSize=pageStatus.PageSize;

        var selectedIndex=pageStatus.Start;
        var cellType=1;
        if (pageStatus.SelectedRow)
        {
            cellType=pageStatus.SelectedRow.CellType;
            for(var i=0;i<this.Data.Data.length;++i)
            {
                if (pageStatus.SelectedRow.ExePrice==this.Data.Data[i])
                {
                    selectedIndex=i;
                    break;
                }
            }
        }

        var oldData=null, nowData=null;
        if (chart.SelectedRow) oldData=CloneData(chart.SelectedRow);    //上一个数据保存下

        if (step>0)
        {
            if (selectedIndex<0 || selectedIndex<pageStatus.Start || selectedIndex>pageStatus.End)
            {
                chart.SelectedRow={ ExePrice:this.Data.Data[pageStatus.Start], CellType:cellType };
                result.Redraw=true;

                nowData=CloneData(chart.SelectedRow);
                this.MoveSelectedRowEvent(oldData,nowData);
                return result;
            }

            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
                if (selectedIndex+1>=this.Data.Data.length && !bPageCycle)
                    break;

                ++selectedIndex;
                if (selectedIndex>pageStatus.End) ++offset;

                if (selectedIndex>=this.Data.Data.length)
                {
                    selectedIndex=0;
                    offset=0;
                }
            }

            result.Redraw=true;
            result.Update=(offset!=this.Data.YOffset);

            chart.SelectedRow={ ExePrice:this.Data.Data[selectedIndex], CellType:cellType };
            this.Data.YOffset=offset;

            nowData=CloneData(chart.SelectedRow);
            this.MoveSelectedRowEvent(oldData,nowData);
            return result;
        }
        else if (step<0)
        {
            if (selectedIndex<0 || selectedIndex<pageStatus.Start || selectedIndex>pageStatus.End)
            {
                chart.SelectedRow={ ExePrice:this.Data.Data[pageStatus.End], CellType:cellType };
                result.Redraw=true;

                nowData=CloneData(chart.SelectedRow);
                this.MoveSelectedRowEvent(oldData,nowData);
                return result;
            }

            step=Math.abs(step);
            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
                if (selectedIndex<=0 && !bPageCycle)    //不能循环翻页
                    break;
                
                --selectedIndex;
                if (selectedIndex<pageStatus.Start) --offset;

                if (selectedIndex<0)    //自动翻到最后一页
                {
                    selectedIndex=this.Data.Data.length-1;
                    offset=this.Data.Data.length-pageSize;
                    if (offset<0) offset=0;
                }
            }

            result.Redraw=true;
            result.Update=(offset!=this.Data.YOffset);

            chart.SelectedRow={ ExePrice:this.Data.Data[selectedIndex], CellType:cellType };
            this.Data.YOffset=offset;

            nowData=CloneData(chart.SelectedRow);
            this.MoveSelectedRowEvent(oldData,nowData);
            return result;
        }

        return null;
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
}

function JSTReportFrame()
{
    this.ChartBorder;
    this.Canvas;                            //画布

    this.BorderLine=null;                   //1=上 2=下 4=左 8=右
    this.ClassName="JSTReportFrame";

    this.BorderColor=g_JSChartResource.TReport.BorderColor;    //边框线

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.ReloadResource=function(resource)
    {
        this.BorderColor=g_JSChartResource.TReport.BorderColor;    //边框线
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

var TREPORT_COLUMN_ID=
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
    EXE_PRICE_ID:17,     //行权价格
    POSITION_ID:18,     //持仓量

    AMPLITUDE_ID:22,            //振幅

    LIMIT_HIGH_ID:23,       //涨停价
    LIMIT_LOW_ID:24,        //跌停价

    VOL_IN_ID:25,           //内盘
    VOL_OUT_ID:26,          //外盘
    NAME_EX_ID:27,          //扩展名字
    CLOSE_LINE_ID:28,       //收盘价线
    KLINE_ID:29,            //K线

    EXE_PRICE_EX_ID:30,       //行权价格 扩张设置
    
    //预留数值类型 10个  201-299
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
}

var MAP_TREPORT_COLUMN_FIELD=new Map(
[
    [TREPORT_COLUMN_ID.SYMBOL_ID, "Symbol"],
    [TREPORT_COLUMN_ID.NAME_ID, "Name"],
    [TREPORT_COLUMN_ID.PRICE_ID, "Price"],
    [TREPORT_COLUMN_ID.INCREASE_ID, "Increase"],
    [TREPORT_COLUMN_ID.UPDOWN_ID, "UpDown"],
    [TREPORT_COLUMN_ID.VOL_ID, "Vol"],
    [TREPORT_COLUMN_ID.BUY_PRICE_ID, "BuyPrice"],
    [TREPORT_COLUMN_ID.SELL_PRICE_ID, "SellPrice"],
    [TREPORT_COLUMN_ID.AMOUNT_ID, "Amount"],
    [TREPORT_COLUMN_ID.BUY_VOL_ID, "BuyVol"],
    [TREPORT_COLUMN_ID.SELL_VOL_ID, "SellVol"],
    [TREPORT_COLUMN_ID.YCLOSE_ID, "YClose"],
    [TREPORT_COLUMN_ID.OPEN_ID, "Open"],
    [TREPORT_COLUMN_ID.HIGH_ID, "High"],
    [TREPORT_COLUMN_ID.LOW_ID, "Low"],
    [TREPORT_COLUMN_ID.AVERAGE_PRICE_ID,"AvPrice"],
    [TREPORT_COLUMN_ID.POSITION_ID,"Position"],
    [TREPORT_COLUMN_ID.AMPLITUDE_ID,"Amplitude"],
    [TREPORT_COLUMN_ID.EXE_PRICE_EX_ID, "ExePrice"],

    [TREPORT_COLUMN_ID.RESERVE_NUMBER1_ID,"ReserveNumber1"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER2_ID,"ReserveNumber2"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER3_ID,"ReserveNumber3"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER4_ID,"ReserveNumber4"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER5_ID,"ReserveNumber5"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER6_ID,"ReserveNumber6"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER7_ID,"ReserveNumber7"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER8_ID,"ReserveNumber8"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER9_ID,"ReserveNumber9"],
    [TREPORT_COLUMN_ID.RESERVE_NUMBER10_ID,"ReserveNumber10"],


    [TREPORT_COLUMN_ID.RESERVE_STRING1_ID,"ReserveString1"],
    [TREPORT_COLUMN_ID.RESERVE_STRING2_ID,"ReserveString2"],
    [TREPORT_COLUMN_ID.RESERVE_STRING3_ID,"ReserveString3"],
    [TREPORT_COLUMN_ID.RESERVE_STRING4_ID,"ReserveString4"],
    [TREPORT_COLUMN_ID.RESERVE_STRING5_ID,"ReserveString5"],
    [TREPORT_COLUMN_ID.RESERVE_STRING6_ID,"ReserveString6"],
    [TREPORT_COLUMN_ID.RESERVE_STRING7_ID,"ReserveString7"],
    [TREPORT_COLUMN_ID.RESERVE_STRING8_ID,"ReserveString8"],
    [TREPORT_COLUMN_ID.RESERVE_STRING9_ID,"ReserveString9"],
    [TREPORT_COLUMN_ID.RESERVE_STRING10_ID,"ReserveString10"],
]);


function ChartTReport()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartTReport';       //类名
    this.UIElement;
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件
    this.GetExePriceDataCallback;          //获取行权价格数据
    this.GetFlashBGDataCallback;            //获取闪烁背景
    this.GetBlockDataCallback;          //获取当前板块的数据
    this.Data;                          //数据 { XOffset:0, YOffset:0, Data:[ 50000.0, 500025.0] }
    this.BorderData;
    this.FixedRowData;                  //固定行
    this.SortInfo;                      //排序信息 { Field:排序字段id, Sort:0 不排序 1升序 2降序, CellType: }    
    this.FixedColumn=2;                 //固定列
    this.FixedRowCount=0;               //固定行         
    
    this.IsShowHeader=true;             //是否显示表头
    this.SizeChange=true;

    this.SelectedRow;                  //{ ExePrice:exePrice, CellType:0  }
    this.RectSelectedRow;
    this.IsDrawBorder=1;                //是否绘制单元格边框

    this.ShowSymbol=[];                 //显示的列表 { ExePrice:行权价格 }

    this.GlobalOption;

    this.DefaultDecimal=2;

    //涨跌颜色
    this.UpColor=g_JSChartResource.TReport.UpTextColor;
    this.DownColor=g_JSChartResource.TReport.DownTextColor;
    this.UnchangeColor=g_JSChartResource.TReport.UnchangeTextColor; 

    this.BorderColor=g_JSChartResource.TReport.BorderColor;          //边框线
    this.SelectedColor=g_JSChartResource.TReport.SelectedColor;      //选中行

    this.UpBGColor=g_JSChartResource.TReport.UpBGColor;
    this.DownBGColor=g_JSChartResource.TReport.DownBGColor;

    //表头配置
    this.HeaderFontConfig={ Size:g_JSChartResource.TReport.Header.Font.Size, Name:g_JSChartResource.TReport.Header.Font.Name };
    this.HeaderColor=g_JSChartResource.TReport.Header.Color;
    this.SortColor=g_JSChartResource.TReport.Header.SortColor;      //排序箭头颜色
    this.HeaderMergin=
    { 
        Left:g_JSChartResource.TReport.Header.Mergin.Left, 
        Right:g_JSChartResource.TReport.Header.Mergin.Right, 
        Top:g_JSChartResource.TReport.Header.Mergin.Top, 
        Bottom:g_JSChartResource.TReport.Header.Mergin.Bottom
    };

    this.MarkBorderConfig={ MaxPositionColor: g_JSChartResource.TReport.MarkBorder.MaxPositionColor };

    //表格内容配置
    this.ItemFontConfig={ Size:g_JSChartResource.TReport.Item.Font.Size, Name:g_JSChartResource.TReport.Item.Font.Name };
    this.ItemFixedFontConfg={ Size:g_JSChartResource.TReport.FixedItem.Font.Size, Name:g_JSChartResource.TReport.FixedItem.Font.Name }; //固定行
    this.ItemMergin=
    { 
        Left:g_JSChartResource.TReport.Item.Mergin.Left, 
        Right:g_JSChartResource.TReport.Item.Mergin.Right, 
        Top:g_JSChartResource.TReport.Item.Mergin.Top, 
        Bottom:g_JSChartResource.TReport.Item.Mergin.Bottom 
    };

    this.CenterItemConfig=
    { 
        TextColor:g_JSChartResource.TReport.CenterItem.TextColor, 
        BaseTextColor:g_JSChartResource.TReport.CenterItem.BaseTextColor, 
        BGColor: g_JSChartResource.TReport.CenterItem.BGColor
    };
    
    //缓存
    this.HeaderFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemFixedFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemSymbolFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemNameHeight=0;
    this.RowCount=0;            //一屏显示行数
    this.HeaderHeight=0;        //表头高度
    this.RowHeight=0;           //行高度
    this.IsShowAllColumn=false;   //是否已显示所有列
    this.ItemExtraWidth=0;      //每列额外的宽度

    this.Column=    //{ Type:列id, Title:标题, TextAlign:文字对齐方式, MaxText:文字最大宽度 , TextColor:文字颜色, Sort:0=不支持排序 1=本地排序 0=远程排序 }
    [
        { Type:TREPORT_COLUMN_ID.PRICE_ID, Title:"现价", TextAlign:"right", Width:null, MaxText:"-888.88" },
        { Type:TREPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88" },
        { Type:TREPORT_COLUMN_ID.BUY_PRICE_ID, Title:"买价", TextAlign:"right", Width:null, MaxText:"-888.88" },
        { Type:TREPORT_COLUMN_ID.BUY_VOL_ID, Title:"买量", TextAlign:"right", Width:null, MaxText:"88888", TextColor:g_JSChartResource.TReport.FieldColor.Vol },

        //{ Type:TREPORT_COLUMN_ID.SELL_PRICE_ID, Title:"卖价", TextAlign:"right", Width:null, MaxText:"-888.88" },
        //{ Type:TREPORT_COLUMN_ID.SELL_VOL_ID, Title:"卖量", TextAlign:"right", Width:null, MaxText:"88888", TextColor:g_JSChartResource.TReport.FieldColor.Vol },

        //{ Type:TREPORT_COLUMN_ID.POSITION_ID, Title:"持仓量", TextAlign:"right", Width:null, MaxText:"88888", TextColor:g_JSChartResource.TReport.FieldColor.Position },

        { Type:TREPORT_COLUMN_ID.NAME_ID, Title:"合约代码", TextAlign:"right", Width:null,  TextColor:g_JSChartResource.TReport.FieldColor.Name, MaxText:"AAAAAA-A-AAAA"},
       
    ];

    this.CenterColumn={ Type:TREPORT_COLUMN_ID.EXE_PRICE_ID, Title:"购<行权价>沽", TextAlign:"center", Width:null, MaxText:"99999.99", Sort:1, SortType:[1,2] }

    this.RectClient={};

    this.TooltipRect=[];

    this.ReloadResource=function(resource)
    {
    }

    this.SetColumn=function(aryColumn)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;

        this.Column=[];
        for(var i=0;i<aryColumn.length;++i)
        {
            var item=aryColumn[i];
            var colItem=this.GetDefaultColunm(item.Type);
            if (!colItem) continue;

            if (item.Title) colItem.Title=item.Title;
            if (item.TextAlign) colItem.TextAlign=item.TextAlign;
            if (item.TextColor) colItem.TextColor=item.TextColor;
            if (item.MaxText) colItem.MaxText=item.MaxText;
            if (item.ID) colItem.ID=item.ID;
            if (IFrameSplitOperator.IsNumber(item.Sort)) colItem.Sort=item.Sort;
            if (IFrameSplitOperator.IsBool(item.EnableTooltip)) colItem.EnableTooltip=item.EnableTooltip;
            if (IFrameSplitOperator.IsNumber(item.FixedWidth)) colItem.FixedWidth=item.FixedWidth;
            if (IFrameSplitOperator.IsNumber(item.FloatPrecision)) colItem.FloatPrecision=item.FloatPrecision;    //小数位数
            if (IFrameSplitOperator.IsNumber(item.ColorType))  colItem.ColorType=item.ColorType;        //0=默认 1=(>0, =0, <0) 2=(>=0, <0)
            if (item.DefaultText) colItem.DefaultText=item.DefaultText;
            if (IFrameSplitOperator.IsBool(item.EnableChartTooltip)) colItem.EnableChartTooltip=item.EnableChartTooltip;

            if (item.Sort==1)   //1本地排序 2=远程排序
            {
                colItem.SortType=[1,2];         //默认 降序 ，升序
                if (IFrameSplitOperator.IsNonEmptyArray(item.SortType)) colItem.SortType=item.SortType.slice();
            }

            this.Column.push(colItem);
        }
    }

    this.GetDefaultColunm=function(id)
    {
        var DEFAULT_COLUMN=
        [
            { Type:TREPORT_COLUMN_ID.INDEX_ID, Title:"序号", TextAlign:"center", Width:null, TextColor:g_JSChartResource.TReport.FieldColor.Index, MaxText:"8888"},
            { Type:TREPORT_COLUMN_ID.SYMBOL_ID, Title:"代码", TextAlign:"right", Width:null,  TextColor:g_JSChartResource.TReport.FieldColor.Symbol, MaxText:"888888"},
            { Type:TREPORT_COLUMN_ID.NAME_ID, Title:"合约名称", TextAlign:"right", Width:null, TextColor:g_JSChartResource.TReport.FieldColor.Name, MaxText:"AAAAAA-A-AAAA" },

            { Type:TREPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.PRICE_ID, Title:"现价", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.UPDOWN_ID, Title:"涨跌", TextAlign:"right", Width:null, MaxText:"-888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.AMPLITUDE_ID, Title:"振幅%", TextAlign:"right", Width:null, MaxText:"888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.BUY_PRICE_ID, Title:"买价", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.SELL_PRICE_ID, Title:"卖价", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.AVERAGE_PRICE_ID, Title:"均价", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.OPEN_ID, Title:"今开", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.HIGH_ID, Title:"最高", TextAlign:"right", Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.LOW_ID, Title:"最低", TextAlign:"right",  Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.YCLOSE_ID, Title:"昨收", TextAlign:"right",  Width:null, MaxText:"88888.88", Sort:1, SortType:[1,2,0] },

            { Type:TREPORT_COLUMN_ID.POSITION_ID, Title:"持仓量", TextAlign:"right", Width:null, MaxText:"88888", Sort:1, SortType:[1,2,0], TextColor:g_JSChartResource.TReport.FieldColor.Position },

            { Type:TREPORT_COLUMN_ID.VOL_ID, Title:"总量", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Vol, Width:null, MaxText:"88888", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.AMOUNT_ID, Title:"总金额", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Amount, Width:null, MaxText:"8888.8擎", Sort:1, SortType:[1,2,0] },
          
            { Type:TREPORT_COLUMN_ID.BUY_VOL_ID, Title:"买量", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Vol, Width:null, MaxText:"88888", Sort:1, SortType:[1,2,0] },
            { Type:TREPORT_COLUMN_ID.SELL_VOL_ID, Title:"卖量", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Vol, Width:null, MaxText:"88888", Sort:1, SortType:[1,2,0] },

            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"数值1", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"数值2", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER3_ID, Title:"数值3", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER4_ID, Title:"数值4", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER5_ID, Title:"数值5", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER6_ID, Title:"数值6", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER7_ID, Title:"数值7", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER8_ID, Title:"数值8", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER9_ID, Title:"数值9", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:TREPORT_COLUMN_ID.RESERVE_NUMBER10_ID, Title:"数值10", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },


            { Type:TREPORT_COLUMN_ID.RESERVE_STRING1_ID, Title:"文字1", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING2_ID, Title:"文字2", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING3_ID, Title:"文字3", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING4_ID, Title:"文字4", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING5_ID, Title:"文字5", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING6_ID, Title:"文字6", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING7_ID, Title:"文字7", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING8_ID, Title:"文字8", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING9_ID, Title:"文字9", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:TREPORT_COLUMN_ID.RESERVE_STRING10_ID, Title:"文字10", TextAlign:"right", TextColor:g_JSChartResource.TReport.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
        ];

        for(var i=0;i<DEFAULT_COLUMN.length;++i)
        {
            var item=DEFAULT_COLUMN[i];
            if (item.Type==id) return item;
        }

        return null;
    }

    this.Draw=function()
    {
        this.ShowSymbol=[];
        this.TooltipRect=[];
        this.RectSelectedRow=null;
       
        if (this.GlobalOption) this.GlobalOption.FlashBGCount=0;

        if (this.SizeChange) this.CalculateSize();
        else this.UpdateCacheData();

        this.Canvas.save();

        this.Canvas.beginPath();
        this.Canvas.rect(this.RectClient.Left,this.RectClient.Top,(this.RectClient.Right-this.RectClient.Left),(this.RectClient.Bottom-this.RectClient.Top));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();

        this.DrawHeader();
        this.DrawBody();
        this.Canvas.restore();
        
        //this.DrawBorder();

        this.SizeChange=false;
    }

    //更新缓存变量
    this.UpdateCacheData=function()
    {
        this.RectClient.Left=this.ChartBorder.GetLeft();
        this.RectClient.Right=this.ChartBorder.GetRight();
        this.RectClient.Top=this.ChartBorder.GetTop();
        this.RectClient.Bottom=this.ChartBorder.GetBottom();
    }

    this.CalculateSize=function()   //计算大小
    {
        this.UpdateCacheData();

        var pixelRatio=GetDevicePixelRatio();
        this.HeaderFont=`${this.HeaderFontConfig.Size*pixelRatio}px ${ this.HeaderFontConfig.Name}`;
        this.ItemFont=`${this.ItemFontConfig.Size*pixelRatio}px ${ this.ItemFontConfig.Name}`;
        this.ItemFixedFont=`${this.ItemFixedFontConfg.Size*pixelRatio}px ${ this.ItemFixedFontConfg.Name}`;

        this.RowHeight=this.GetFontHeight(this.ItemFont,"擎")+ this.ItemMergin.Top+ this.ItemMergin.Bottom;
        this.FixedRowHeight=this.GetFontHeight(this.ItemFixedFont,"擎")+ this.ItemMergin.Top+ this.ItemMergin.Bottom;

        this.Canvas.font=this.ItemFont;
        var itemWidth=0;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (IFrameSplitOperator.IsNumber(item.FixedWidth)) itemWidth=item.FixedWidth;
            else itemWidth=this.Canvas.measureText(item.MaxText).width;

            item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;
        }

        //表头中间列
        var item=this.CenterColumn;
        if (IFrameSplitOperator.IsNumber(item.FixedWidth)) itemWidth=item.FixedWidth;
        else itemWidth=this.Canvas.measureText(item.MaxText).width;
        item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;

        this.Canvas.font=this.HeaderFont;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (!item.Title || item.Title.length<=0) continue;
            var text=item.Title;
            if (item.Sort>0) text+="↓"; 
            itemWidth=this.Canvas.measureText(text).width;
            itemWidth+=(4+this.HeaderMergin.Left+this.HeaderMergin.Right);
            if (item.Width<itemWidth) item.Width=itemWidth;
        }

        //表头中间列
        var item=this.CenterColumn;
        if (!item.Title || item.Title.length>0)
        {
            var text=item.Title;
            if (item.Sort>0) text+="↓"; 
            itemWidth=this.Canvas.measureText(text).width;
            itemWidth+=(4+this.HeaderMergin.Left+this.HeaderMergin.Right);
            if (item.Width<itemWidth) item.Width=itemWidth;
        }
        

        this.HeaderHeight=this.GetFontHeight(this.HeaderFont,"擎")+ this.HeaderMergin.Top+ this.HeaderMergin.Bottom;
        if (!this.IsShowHeader) this.HeaderHeight=0;
        if (this.FixedRowCount<=0) this.FixedRowHeight=0;
        
        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top-this.HeaderHeight-(this.FixedRowHeight*this.FixedRowCount))/this.RowHeight);

        var subWidth=this.CenterColumn.Width;
        var reportWidth=this.RectClient.Right-this.RectClient.Left;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            subWidth+=item.Width*2;
        }

        if (subWidth<reportWidth)
        {
            this.IsShowAllColumn=true;
            this.ItemExtraWidth=0;
            if (reportWidth-subWidth-4>0)
                this.ItemExtraWidth=(reportWidth-subWidth-4)/(this.Column.length*2+1);
        }
        else
        {
            this.IsShowAllColumn=false;
            this.ItemExtraWidth=0;
        }
    }

    this.DrawHeader=function()
    {
        if (!this.IsShowHeader) return;

        var left=this.RectClient.Left;
        var top=this.RectClient.Top;
        var y=top+this.HeaderMergin.Top+(this.HeaderHeight-this.HeaderMergin.Top-this.HeaderMergin.Bottom)/2;
        var xCenter=(this.RectClient.Right-this.RectClient.Left)/2+this.RectClient.Left;

        this.Canvas.font=this.HeaderFont;
        this.Canvas.fillStyle=this.HeaderColor;

        var reportleft=this.RectClient.Left;
        var reportRight=this.RectClient.Right;
        
        //中间列
        var item=this.CenterColumn;
        var rtCenterItem=this.GetCenterItemRect();
        if (this.SortInfo && this.SortInfo.Sort>0 && this.SortInfo.CellType==0) 
            this.DrawSortHeader(item.Title,item.TextAlign,rtCenterItem.Left,y,rtCenterItem.TextWidth,this.SortInfo.Sort);
        else 
            this.DrawText(item.Title,item.TextAlign,rtCenterItem.Left,y,rtCenterItem.TextWidth);
        
        var xLeft=rtCenterItem.Left;  //左边
        var xRight=rtCenterItem.Right;//右边
        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width+this.ItemExtraWidth;
            var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;
            var x=xLeft-itemWidth+this.HeaderMergin.Left;

            if (xLeft-itemWidth<reportleft) break;

            var bSort=(this.SortInfo && this.SortInfo.Field==i && this.SortInfo.Sort>0);
            if (bSort && this.SortInfo.CellType==1) this.DrawSortHeader(item.Title,item.TextAlign,x,y,textWidth,this.SortInfo.Sort);
            else this.DrawText(item.Title,item.TextAlign,x,y,textWidth);
            xLeft-=itemWidth;

            var x=xRight+this.HeaderMergin.Left;
            if (bSort && this.SortInfo.CellType==2) this.DrawSortHeader(item.Title,item.TextAlign,x,y,textWidth,this.SortInfo.Sort);
            else this.DrawText(item.Title,item.TextAlign,x,y,textWidth);
            xRight+=itemWidth;
        } 
    }

    this.DrawSortHeader=function(text, textAlign, x, y, width, sortType)
    {
        var sortText=sortType==1?"↓":"↑";
        var sortTextWidth=this.Canvas.measureText(sortText).width;
        var textWidth=this.Canvas.measureText(text).width+2;
        this.Canvas.textBaseline="middle";
        this.Canvas.textAlign="left";

        if (textAlign=='center')
        {
            x=x+width/2-(sortTextWidth+textWidth)/2;
        }
        else if (textAlign=='right')
        {
            x=(x+width)-sortTextWidth-textWidth;
        }
        else
        {
            
        }

        this.Canvas.fillText(text,x,y);
        this.Canvas.fillStyle=this.SortColor;
        this.Canvas.fillText(sortText,x+textWidth,y);
        this.Canvas.fillStyle=this.HeaderColor;
    }

    this.DrawText=function(text, textAlign, x, y, textWidth)
    {
        if (textAlign=='center')
        {
            x=x+textWidth/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=x+textWidth;
            this.Canvas.textAlign="right";
        }
        else
        {
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="middle";
        this.Canvas.fillText(text,x,y);
    }

    this.GetFontHeight=function(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    this.DrawBody=function()
    {
        if (!this.Data) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        this.Canvas.font=this.ItemFont;
        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var rowWidth=this.RectClient.Right-this.RectClient.Left;

        //固定行
        var textTop=top;
        this.Canvas.font=this.ItemFixedFont;
        for(var i=0; i<this.FixedRowCount; ++i)
        {
            /*
            if (this.SelectedFixedRow==i)
            {
                this.Canvas.fillStyle=this.SelectedColor;
                this.Canvas.fillRect(left,textTop,rowWidth,this.FixedRowHeight);   
            }
            */
            
            this.DrawFixedRow(textTop, i);
            
            textTop+=this.FixedRowHeight;
        }


        textTop=top+this.FixedRowHeight*this.FixedRowCount;
        this.Canvas.font=this.ItemFont;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var exePrice=this.Data.Data[i];

            this.DrawRow(exePrice, textTop, i);

            this.ShowSymbol.push( { Index:i, ExePrice:exePrice } );

            textTop+=this.RowHeight;
        }

        if (this.RectSelectedRow)
        {
            this.Canvas.fillStyle=this.SelectedColor;
            var lineWidth=2;
            this.Canvas.fillRect(this.RectSelectedRow.Left,this.RectSelectedRow.Bottom-lineWidth, (this.RectSelectedRow.Right-this.RectSelectedRow.Left), lineWidth); 
        }
    }

    this.GetCenterItemRect=function()
    {
        var xCenter=(this.RectClient.Right-this.RectClient.Left)/2+this.RectClient.Left;
 
        //中间列
        var item=this.CenterColumn;
        var itemWidth=item.Width+this.ItemExtraWidth;
        var left=xCenter-itemWidth/2;
        var right=xCenter+itemWidth/2;
        var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;
        
        return { Left:left, Right:right, TextWidth:textWidth, Width:itemWidth };
    }

    this.DrawFixedRow=function(top, dataIndex)
    {
        if (!this.FixedRowData || !IFrameSplitOperator.IsNonEmptyArray(this.FixedRowData.Data)) return;

        var rtCenterItem=this.GetCenterItemRect();
        var xLeft=rtCenterItem.Left;    //左边
        var xRight=rtCenterItem.Right;  //右边

        var reportleft=this.RectClient.Left;
        var reportRight=this.RectClient.Right;

        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width+this.ItemExtraWidth;
            xLeft-=itemWidth;
            if (xLeft<reportleft) break;

            var rowData=this.FixedRowData.Data[dataIndex];
            if (!rowData || !rowData.TData) continue;

            var leftData=null, rightData=null;
            if (rowData.TData && rowData.TData.LeftData) leftData=rowData.TData.LeftData;
            if (rowData.TData && rowData.TData.RightData) rightData=rowData.TData.RightData;

            var rtItem={ Left:xLeft, Right:xLeft+itemWidth, Top:top, Height:this.FixedRowHeight, Width:itemWidth };
            rtItem.Bottom=rtItem.Top+rtItem.Height;

            this.DrawFixedItem(dataIndex, i, rowData, leftData, item, rtItem, 1);


            rtItem={ Left:xRight, Right:xRight+itemWidth, Top:top, Height:this.RowHeight, Width:itemWidth };
            rtItem.Bottom=rtItem.Top+rtItem.Height;

            this.DrawFixedItem(dataIndex, i, rowData, rightData, item, rtItem, 2);
            xRight+=itemWidth;
        }
    }

    this.DrawFixedItem=function(dataIndex, colIndex, rowData, data, column, rtItem, cellType)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(data)) return;

        var rtText={ Left:rtItem.Left+this.ItemMergin.Left, Right:rtItem.Right-this.ItemMergin.Right, Top:rtItem.Top+this.ItemMergin.Top, Bottom:rtItem.Bottom-this.ItemMergin.Bottom };
        rtText.Width=rtText.Right-rtText.Left;
        rtText.Height=rtText.Bottom-rtText.Top;

        var itemData=data[colIndex];
        if (!itemData) return;

        var drawInfo={ Text:null, TextColor:column.TextColor , TextAlign:column.TextAlign, Rect:rtItem, RectText:rtText };

        drawInfo.Text=itemData.Text;
        if (itemData.Color) drawInfo.TextColor=itemData.Color;
        if (itemData.TextAlign) drawInfo.TextAlign=itemData.TextAlign;

        this.DrawCell(drawInfo);
    }

    this.DrawRow=function(exePrice, top, dataIndex)
    {
        var rtCenterItem=this.GetCenterItemRect();
        
        var xLeft=rtCenterItem.Left;    //左边
        var xRight=rtCenterItem.Right;  //右边

        var reportleft=this.RectClient.Left;
        var reportRight=this.RectClient.Right;

        var data= { ExePrice:exePrice , TData:null, Decimal:this.DefaultDecimal };
        if (this.GetExePriceDataCallback) data.TData=this.GetExePriceDataCallback(exePrice);
        if (this.GetFlashBGDataCallback && data.TData) 
        {
            if (data.TData.LeftData)    //左侧
            {
                var item=data.TData.LeftData;
                data.TData.LeftFlashBG=this.GetFlashBGDataCallback(item.Symbol, Date.now());
                if (item.Symbol) data.Decimal=JSTReportChart.GetfloatPrecision(item.Symbol);
            }

            if (data.TData.RightData)   //右侧
            {
                var item=data.TData.RightData;
                data.TData.RightFlashBG=this.GetFlashBGDataCallback(item.Symbol, Date.now());
                if (item.Symbol) data.Decimal=JSTReportChart.GetfloatPrecision(item.Symbol);
            }
        }

        var bSelected=false;
        if (this.SelectedRow && this.SelectedRow.ExePrice==exePrice) bSelected=true;

        var rtItem={ Left:xLeft, Right:xRight, Top:top, Height:this.RowHeight };
        rtItem.Bottom=rtItem.Top+rtItem.Height;
        rtItem.Width=rtItem.Right-rtItem.Left;
        this.DrawCenterItem(dataIndex, data, this.CenterColumn, rtItem, 0);
        if (bSelected && this.SelectedRow.CellType==0) this.RectSelectedRow=rtItem;

        if (IFrameSplitOperator.IsNumber(this.Data.Price))
        {
            var leftBGColor=null, rightBGColor=null;
            if (exePrice>this.Data.Price)
            {
                leftBGColor=this.UpBGColor;
                rightBGColor=this.DownBGColor;
            }
            else
            {
                leftBGColor=this.DownBGColor;
                rightBGColor=this.UpBGColor;
            }

            if (leftBGColor)
            {
                var rtBG={Left:reportleft+1, Right:rtCenterItem.Left, Top:top, Height:this.RowHeight };
                rtBG.Bottom=rtBG.Top+rtBG.Height;
                rtBG.Width=rtBG.Right-rtBG.Left;
                this.Canvas.fillStyle=leftBGColor;
                this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);   
            }

            if (rightBGColor)
            {
                var rtBG={Left:rtCenterItem.Right, Right:reportRight, Top:top, Height:this.RowHeight };
                rtBG.Bottom=rtBG.Top+rtBG.Height;
                rtBG.Width=rtBG.Right-rtBG.Left;
                this.Canvas.fillStyle=rightBGColor;
                this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height); 
            }
        }

        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width+this.ItemExtraWidth;
            xLeft-=itemWidth;
            if (xLeft<reportleft) break;

            var leftData=null, rightData=null;
            if (data.TData) leftData=data.TData.LeftData;
            if (data.TData) rightData=data.TData.RightData;

            rtItem={ Left:xLeft, Right:xLeft+itemWidth, Top:top, Height:this.RowHeight, Width:itemWidth };
            rtItem.Bottom=rtItem.Top+rtItem.Height;

            this.DrawItem(dataIndex, data, leftData, item, rtItem, 1);

            if (bSelected && this.SelectedRow.CellType==1)
            {
                if (!this.RectSelectedRow) this.RectSelectedRow=rtItem;
                else this.RectSelectedRow.Left=rtItem.Left;
            }

            rtItem={ Left:xRight, Right:xRight+itemWidth, Top:top, Height:this.RowHeight, Width:itemWidth };
            rtItem.Bottom=rtItem.Top+rtItem.Height;

            this.DrawItem(dataIndex, data, rightData, item, rtItem, 2);
            xRight+=itemWidth;

            if (bSelected && this.SelectedRow.CellType==2)
            {
                if (!this.RectSelectedRow) this.RectSelectedRow=rtItem;
                else this.RectSelectedRow.Right=rtItem.Right;
            }
        }
    }

    this.FormatCenterItem=function(data,drawInfo)
    {
        if (!data || !data.TData) return;
        var leftData=this.GetExePriceExtendData(data.TData.LeftData);
        var rightData=this.GetExePriceExtendData(data.TData.RightData);

        if (leftData)
        {
            if (leftData.BGColor) drawInfo.BGColor=leftData.BGColor;
            if (leftData.TitleColor) drawInfo.TextColor=leftData.TitleColor;
            if (leftData.Text && leftData.TextColor)
            {
                drawInfo.Left={ Text:leftData.Text, TextColor:leftData.TextColor, Tooltip:leftData.Tooltip};
            }
            else if (leftData.IconFont && leftData.TextColor)
            {
                drawInfo.Left={ IconFont:leftData.IconFont, TextColor:leftData.TextColor, Tooltip:leftData.Tooltip};
            }
           
        }

        if (rightData)
        {
            if (rightData.BGColor) drawInfo.BGColor=rightData.BGColor;
            if (rightData.TitleColor) drawInfo.TextColor=rightData.TitleColor;

            if (rightData.Text && rightData.TextColor)
            {
                drawInfo.Right={ Text:rightData.Text, TextColor:rightData.TextColor, Tooltip:rightData.Tooltip};
            }
            else if (rightData.IconFont && rightData.TextColor)
            {
                drawInfo.Right={ IconFont:rightData.IconFont, TextColor:rightData.TextColor, Tooltip:rightData.Tooltip};
            }
        }
    }

    //行权价列扩展信息
    this.GetExePriceExtendData=function(data)
    {
        if (!data) return null;

        var fieldName=MAP_TREPORT_COLUMN_FIELD.get(TREPORT_COLUMN_ID.EXE_PRICE_EX_ID);
        if (!fieldName) return null;

        var value=data[fieldName];
        return value;
    }

    this.DrawCenterItem=function(index, data, column, rtItem, cellType) //cellType 0=中间字段 1=左侧 2=右侧
    {
        //tooltip提示
        if (column.EnableTooltip===true)  this.TooltipRect.push({ Rect:rtItem, Data:data, Index:index, Column:column, CellType:cellType, Type:1 });

        var rtText={ Left:rtItem.Left+this.ItemMergin.Left, Right:rtItem.Right-this.ItemMergin.Right, Top:rtItem.Top+this.ItemMergin.Top, Bottom:rtItem.Bottom-this.ItemMergin.Bottom };
        rtText.Width=rtText.Right-rtText.Left;
        rtText.Height=rtText.Bottom-rtText.Top;

        var drawInfo={ Text:null, TextColor:this.CenterItemConfig.TextColor, BGColor:this.CenterItemConfig.BGColor, TextAlign:column.TextAlign, Rect:rtItem, RectText:rtText };
        drawInfo.Text=`${data.ExePrice.toFixed(data.Decimal)}`;

        this.FormatCenterItem(data,drawInfo);

        this.DrawCell(drawInfo);

        if (drawInfo.LeftIconTooltip)
        {
            var tooltipItem=drawInfo.LeftIconTooltip;
            var tooltipData={ Rect:tooltipItem.Rect, Data:tooltipItem.Data, Index:index, Column:column, CellType:cellType, Type:2 };
            this.TooltipRect.push(tooltipData);
        }

        if (drawInfo.RightIconTooltip)
        {
            var tooltipItem=drawInfo.RightIconTooltip;
            var tooltipData={ Rect:tooltipItem.Rect, Data:tooltipItem.Data, Index:index, Column:column, CellType:cellType, Type:3 };
            this.TooltipRect.push(tooltipData);
        }
    }

    this.DrawItem=function(index, exePriceData, data, column, rtItem, cellType)
    {
        if (column.EnableTooltip===true)  this.TooltipRect.push({ Rect:rtItem, Data:data, Index:index, Column:column, CellType:cellType, Type:1 });

        var rtText={ Left:rtItem.Left+this.ItemMergin.Left, Right:rtItem.Right-this.ItemMergin.Right, Top:rtItem.Top+this.ItemMergin.Top, Bottom:rtItem.Bottom-this.ItemMergin.Bottom };
        rtText.Width=rtText.Right-rtText.Left;
        rtText.Height=rtText.Bottom-rtText.Top;

        var drawInfo={ Text:null, TextColor:column.TextColor , TextAlign:column.TextAlign, Rect:rtItem, RectText:rtText };

        if (data)
        {
            switch(column.Type)
            {
                case TREPORT_COLUMN_ID.SYMBOL_ID:
                case TREPORT_COLUMN_ID.NAME_ID:
                    var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
                    if (fieldName) drawInfo.Text=data[fieldName];
                    break;

                case TREPORT_COLUMN_ID.PRICE_ID:        //最新价格
                case TREPORT_COLUMN_ID.BUY_PRICE_ID:    //买价
                case TREPORT_COLUMN_ID.SELL_PRICE_ID:   //卖价
                    var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
                    if (fieldName) this.GetPriceDrawInfo(data[fieldName], data, exePriceData, drawInfo);
                    break;
               
                case TREPORT_COLUMN_ID.SELL_VOL_ID:     //卖量
                case TREPORT_COLUMN_ID.BUY_VOL_ID:      //买量
                case TREPORT_COLUMN_ID.POSITION_ID:     //持仓量
                case TREPORT_COLUMN_ID.VOL_ID:          //成交量
                case TREPORT_COLUMN_ID.AMOUNT_ID:       //成交金额
                    var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
                    if (fieldName) drawInfo.Text=this.FormatVolString(data[fieldName]);
                    break;
                case TREPORT_COLUMN_ID.INCREASE_ID:
                case TREPORT_COLUMN_ID.UPDOWN_ID:
                case TREPORT_COLUMN_ID.AMPLITUDE_ID:
                    var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
                    if (fieldName) 
                    {
                        var value=data[fieldName];
                        if (IFrameSplitOperator.IsNumber(value))
                        {
                            drawInfo.Text=value.toFixed(2);
                            drawInfo.TextColor=this.GetUpDownColor(value,0);
                        }
                        else
                        {
                            this.GetNullDrawInfo(drawInfo);
                        }
                    }
                    break;
                case TREPORT_COLUMN_ID.RESERVE_NUMBER1_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER2_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER3_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER4_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER5_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER6_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER7_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER8_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER9_ID:
                case TREPORT_COLUMN_ID.RESERVE_NUMBER10_ID:
                    this.FormatReserveNumber(column, data, drawInfo);
                    break;

                case TREPORT_COLUMN_ID.RESERVE_STRING1_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING2_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING3_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING4_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING5_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING6_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING7_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING8_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING9_ID:
                case TREPORT_COLUMN_ID.RESERVE_STRING10_ID:
                    this.FormatReserveString(column, data, drawInfo);
                    break;


                default:
                    drawInfo.Text=`-----`;
            }

            this.GetMarkBorderData(drawInfo, exePriceData.ExePrice, column.Type, cellType);
            this.GetFlashBGData(drawInfo, exePriceData, column.Type, cellType);
        }

        this.DrawCell(drawInfo, exePriceData, column.Type, cellType);

        if (column.EnableChartTooltip)
        {
            var tooltipData={ Rect:rtItem, Data:data, Index:index, Column:column, CellType:cellType, Type:20 };
            this.TooltipRect.push(tooltipData);
        }
    }

    this.FormatReserveNumber=function(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
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

        //TODO: 不同类型的 格式化输出 
        drawInfo.Text=value.toFixed(column.FloatPrecision);
    }

    this.FormatReserveString=function(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_TREPORT_COLUMN_FIELD.get(column.Type);
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

    this.GetFlashBGData=function(drawInfo, exePriceData, columnType, cellType)
    {
        if (!exePriceData.TData) return;

        var data=null;
        if (cellType==1) data=exePriceData.TData.LeftFlashBG;
        else if (cellType==2) data=exePriceData.TData.RightFlashBG;

        if (!data || !data.Data) return;

        if (data.Data.has(columnType))
        {
            var item=data.Data.get(columnType);
            drawInfo.FlashBGColor=item.Color;
            --item.Count;

            if (this.GlobalOption) ++this.GlobalOption.FlashBGCount;
        }
    }

    this.GetMarkBorderData=function(drawInfo, exePrice, columnType, cellType)
    {
        if (!this.BorderData || !this.BorderData.MapData) return;
        if (!this.BorderData.MapData.has(columnType)) return;
        var borderData=this.BorderData.MapData.get(columnType);
        if (!IFrameSplitOperator.IsNonEmptyArray(borderData.Data)) return;

        if (cellType==1)
        {
            var leftBorder=borderData.Data[1];
            if (!leftBorder) return;
            
            if (leftBorder.ExePrice==exePrice)
            {
                drawInfo.BorderColor=this.MarkBorderConfig.MaxPositionColor;
            }
            
        }
        else if (cellType==2)
        {
            var rightBorder=borderData.Data[2];
            if (!rightBorder) return;
            if (rightBorder.ExePrice==exePrice)
            {
                drawInfo.BorderColor=this.MarkBorderConfig.MaxPositionColor;
            }
        }
    }

    this.GetNullDrawInfo=function(drawInfo)
    {
        drawInfo.Text="--";
        drawInfo.TextColor=this.UnchangeColor;
    }

    this.GetPriceDrawInfo=function(price, stock, data, drawInfo)
    {
        if (!IFrameSplitOperator.IsNumber(price)) 
        {
            this.GetNullDrawInfo(drawInfo);
            return;
        }

        drawInfo.Text=price.toFixed(data.Decimal);
        if (!IFrameSplitOperator.IsNumber(stock.YClose))  
            drawInfo.TextColor=this.UnchangeColor;
        else  
            drawInfo.TextColor=this.GetUpDownColor(price, stock.YClose);
    }

    //单独处理成交量显示
    this.FormatVolString=function(value,languageID)
    {
        if (!IFrameSplitOperator.IsNumber(value)) return null;

        return IFrameSplitOperator.FormatVolString(value, languageID);
    }

    this.GetUpDownColor=function(price, price2)
    {
        if (price>price2) return this.UpColor;
        else if (price<price2) return this.DownColor;
        else return this.UnchangeColor;
    }

    this.GetUpDownColorV2=function(price, price2)
    {
        if (price>=price2) return this.UpColor;
        else return this.DownColor;
    }

    this.DrawCell=function(drawInfo)
    {
        var rtText=drawInfo.RectText;
        var yCenter=rtText.Top+(rtText.Height/2);
        var fontBackup=null;    //字体备份
        if (drawInfo.BGColor)   //背景
        {
            var rtItem=drawInfo.Rect;
            this.Canvas.fillStyle=drawInfo.BGColor;
            this.Canvas.fillRect(rtItem.Left,rtItem.Top,rtItem.Width,rtItem.Height);   
        }

        if (drawInfo.FlashBGColor)   //闪动背景
        {
            var rtItem=drawInfo.Rect;
            this.Canvas.fillStyle=drawInfo.FlashBGColor;
            this.Canvas.fillRect(rtItem.Left,rtItem.Top,rtItem.Width,rtItem.Height);   
        }

        if (drawInfo.BorderColor)   //边框
        {
            var rtItem=drawInfo.Rect;
            this.Canvas.strokeStyle=drawInfo.BorderColor;
            this.Canvas.strokeRect(ToFixedPoint(rtItem.Left),ToFixedPoint(rtItem.Top+1),ToFixedRect(rtItem.Width),ToFixedRect(rtItem.Height-3)); 
        }

        if (drawInfo.Text)      //文字
        {
            if(drawInfo.TextColor) this.Canvas.fillStyle=drawInfo.TextColor;
            this.DrawText(drawInfo.Text, drawInfo.TextAlign, rtText.Left, yCenter, rtText.Width);
        }

        if (drawInfo.Left)  //左边图标
        {
            var item=drawInfo.Left;
            this.Canvas.textAlign="left";
            this.Canvas.textBaseline="middle";
            this.Canvas.fillStyle=item.TextColor;
            if (item.IconFont)
            {
                if (!fontBackup) fontBackup=this.Canvas.font;
                this.Canvas.font=item.IconFont.Font;
                this.Canvas.fillText(item.IconFont.Symbol,rtText.Left,yCenter);
                if (item.Tooltip)
                {
                    var iconWidth=this.Canvas.measureText(item.IconFont.Symbol).width;
                    var rtIcon={ Left:rtText.Left, Top:rtText.Top, Bottom:rtText.Bottom, Height:rtText.Height, Width:iconWidth };
                    rtIcon.Right=rtIcon.Left+rtIcon.Width;
                    drawInfo.LeftIconTooltip={ Rect:rtIcon, Data:item.Tooltip };
                }
            }
            else if (item.Text)
            {
                this.Canvas.fillText(item.Text,rtText.Left,yCenter);
            }
        }

        if (drawInfo.Right) //右边图标
        {
            var item=drawInfo.Right;
            this.Canvas.textAlign="right";
            this.Canvas.textBaseline="middle";
            this.Canvas.fillStyle=item.TextColor;
            if (item.IconFont)
            {
                if (!fontBackup) fontBackup=this.Canvas.font;
                this.Canvas.font=item.IconFont.Font;
                this.Canvas.fillText(item.IconFont.Symbol,rtText.Right,yCenter);

                if (item.Tooltip)
                {
                    var iconWidth=this.Canvas.measureText(item.IconFont.Symbol).width;
                    var rtIcon={ Right:rtText.Right, Top:rtText.Top, Bottom:rtText.Bottom, Height:rtText.Height, Width:iconWidth };
                    rtIcon.Left=rtIcon.Right-rtIcon.Width;
                    drawInfo.RightIconTooltip={ Rect:rtIcon, Data:item.Tooltip };
                }
            }
            else if (item.Text)
            {
                this.Canvas.fillText(item.Text,rtText.Right,yCenter);
            }
        }

        if (fontBackup) this.Canvas.font=fontBackup;
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
                return { Rect:item.Rect, Data:item.Data, Column:item.Column, Index:item.Index, Type:item.Type, CellType:item.CellType };
            }
        }

        return null;
    }

    this.OnMouseDown=function(x,y,e)    //Type: 2=行 3=表头
    {
        if (!this.Data) return null;

        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};

        if (this.UIElement)
            var uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else
            var uiElement={Left:null, Top:null};

        var row=this.PtInBody(x,y);
        if (row)
        {
            var bRedraw=false;
            if (!this.SelectedRow)
            {
                this.SelectedRow={ ExePrice:row.ExePrice, CellType:row.CellType };
                bRedraw=true;
            }
            else if (this.SelectedRow.ExePrice!=row.ExePrice || this.SelectedRow.CellType!=row.CellType)
            {
                this.SelectedRow.ExePrice=row.ExePrice;
                this.SelectedRow.CellType=row.CellType;
                bRedraw=true;
            }
    
            var eventID=JSCHART_EVENT_ID.ON_CLICK_TREPORT_ROW;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_TREPORT_ROW;
            
            this.SendClickEvent(eventID, { Data:row, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement });

            return { Type:2, Redraw:bRedraw, Row:row };  //行
        }

        var header=this.PtInHeader(x,y);
        if (header)
        {
            var eventID=JSCHART_EVENT_ID.ON_CLICK_TREPORT_HEADER;
            if (e.button==2) 
            {
                eventID=JSCHART_EVENT_ID.ON_RCLICK_TREPORT_HEADER;
            }
            else if (e.button==0)
            {
                eventID=JSCHART_EVENT_ID.ON_CLICK_TREPORT_HEADER;
            }

            this.SendClickEvent(eventID, { Data:header, X:x, Y:y , e:e, Inside:insidePoint, UIElement:uiElement});
            return { Type:3, Redraw:bRedraw, Header:header };  //表头
        }

        return null;
    }

    //获取一行位置 option={ Symbol:, RowIndex:}
    this.GetRowRect=function(option)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var symbol=null;
        var rowIndex=null;
        if (option)
        {
            if (option.Symbol) symbol=option.Symbol;
            if (IFrameSplitOperator.IsNumber(option.RowIndex)) rowIndex=option.RowIndex;
        }
        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        var textTop=top+this.FixedRowHeight*this.FixedRowCount;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j, textTop+=this.RowHeight)
        {
            var exePrice=this.Data.Data[i];
            var rtRow={ Left:left, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };
            rtRow.Height=rtRow.Bottom-rtRow.Top;
            rtRow.Width=rtRow.Right-rtRow.Left;
            
            var data={ RectRow:rtRow, DataIndex:i, Index:j, ExePrice:exePrice };
            var item=this.GetExePriceDataCallback(exePrice);
            if (!item) continue;
            
            var bLeftFind=false, bRightFind=false;
            if (symbol)
            {
                if (item.LeftData && item.LeftData.Symbol && item.LeftData.Symbol==symbol) bLeftFind=true;
                if (item.RightData && item.RightData.Symbol && item.RightData.Symbol==symbol) bRightFind=true;
            }
            else if (IFrameSplitOperator.IsNumber(rowIndex))
            {
                if (rowIndex==i)
                {
                    bLeftFind=true;
                    bRightFind=true;
                }
            }
            
            if (bLeftFind || bRightFind)
            {
                data.Item=item;
                data.AryLeftRect=[];
                data.AryRightRect=[];
                data.ElementRect=this.UIElement.getBoundingClientRect();
                data.PixelRatio=GetDevicePixelRatio();

                var rtCenterItem=this.GetCenterItemRect();
                var rtCenter={Left:rtCenterItem.Left, Right:rtCenterItem.Right, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom };

                var xLeft=rtCenterItem.Left;    //左边
                var xRight=rtCenterItem.Right;  //右边
        
                var reportleft=this.RectClient.Left;
                var reportRight=this.RectClient.Right;
                for(var k=this.Data.XOffset;k<this.Column.length;++k)
                {
                    var colItem=this.Column[k];
                    var itemWidth=colItem.Width+this.ItemExtraWidth;
                    xLeft-=itemWidth;
                    if (xLeft<reportleft) break;
        
                    var rtItem={ Left:xLeft, Right:xLeft+itemWidth, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom, Width:itemWidth };
                    data.AryLeftRect.push({ Rect:rtItem, ColumnIndex:k, Column:colItem })
        
                    rtItem={ Left:xRight, Right:xRight+itemWidth, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom, Width:itemWidth };
                    data.AryRightRect.push({ Rect:rtItem, ColumnIndex:k, Column:colItem });

                    xRight+=itemWidth;
                }

                return data;
            }
        }

        return null;
    }

    this.PtInBody=function(x,y)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        var textTop=top+this.FixedRowHeight*this.FixedRowCount;
        for(var i=this.Data.YOffset, j=0; i<this.Data.Data.length && j<this.RowCount ;++i, ++j)
        {
            var exePrice=this.Data.Data[i];
            var rtRow={ Left:left, Top:textTop, Right:right, Bottom: textTop+this.RowHeight };
            rtRow.Height=rtRow.Bottom-rtRow.Top;
            rtRow.Width=rtRow.Right-rtRow.Left;
            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ RectRow:rtRow, DataIndex:i, Index:j, ExePrice:exePrice };
                return this.PtInItem(x,y, data);
            }

            textTop+=this.RowHeight;
        }

        return null;
    }

    this.PtInItem=function(x, y, info, exePrice)
    {
        var rtCenterItem=this.GetCenterItemRect();
        var rtRow=info.RectRow;
        var rtCenter={Left:rtCenterItem.Left, Right:rtCenterItem.Right, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom };

        if (x>=rtCenter.Left && x<=rtCenter.Right && y>=rtCenter.Top && y<=rtCenter.Bottom)
        {
            var data={ Rect:rtCenter, DataIndex:info.DataIndex, Index:info.Index , ExePrice:info.ExePrice, CellType:0, Column:this.CenterColumn };
            data.Item=this.GetExePriceDataCallback(info.ExePrice);
            return data;
        }

        var xLeft=rtCenterItem.Left;    //左边
        var xRight=rtCenterItem.Right;  //右边

        var reportleft=this.RectClient.Left;
        var reportRight=this.RectClient.Right;

        for(var i=this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width+this.ItemExtraWidth;
            xLeft-=itemWidth;
            if (xLeft<reportleft) break;

            var rtItem={ Left:xLeft, Right:xLeft+itemWidth, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom, Width:itemWidth };
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom)
            {
                var data={ Rect:rtCenter, DataIndex:info.DataIndex, Index:info.Index , ExePrice:info.ExePrice, CellType:1, ColumnIndex:i, Column:item };
                data.Item=this.GetExePriceDataCallback(info.ExePrice);
                return data;
            }

            rtItem={ Left:xRight, Right:xRight+itemWidth, Top:rtRow.Top, Height:rtRow.Height, Bottom:rtRow.Bottom, Width:itemWidth };
            if (x>=rtItem.Left && x<=rtItem.Right && y>=rtItem.Top && y<=rtItem.Bottom)
            {
                var data={ Rect:rtCenter, DataIndex:info.DataIndex, Index:info.Index , ExePrice:info.ExePrice, CellType:2, ColumnIndex:i, Column:item };
                data.Item=this.GetExePriceDataCallback(info.ExePrice);
                return data;
            }

            xRight+=itemWidth;
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

        var rtHeader={Left:left, Right:right, Top:top, Bottom:bottom};
        rtHeader.Width=rtHeader.Right-rtHeader.Left;
        rtHeader.Height=rtHeader.Bottom-rtHeader.Top;
        var data={ RectRow:rtHeader, DataIndex:-1, Index:-1, ExePrice:null };
        return this.PtInItem(x,y, data);
    }

    this.SendClickEvent=function(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
    }

    
    this.GetCurrentPageStatus=function()    //{ Start:起始索引, End:结束索引（数据）, PageSize:页面可以显示几条记录, IsEnd:是否是最后一页, IsSinglePage:是否只有一页数据}
    {
        var result={ Start:this.Data.YOffset, PageSize:this.RowCount, IsEnd:false, SelectedRow:this.SelectedRow, IsSinglePage:false, DataCount:0 };
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

    this.OnDblClick=function(x,y,e)
    {
        if (!this.Data) return false;

        var row=this.PtInBody(x,y);
        if (row)
        {
            this.SendClickEvent(JSCHART_EVENT_ID.ON_DBCLICK_TREPORT_ROW, { Data:row, X:x, Y:y });
            return true;
        }

        return false;
    }

}


