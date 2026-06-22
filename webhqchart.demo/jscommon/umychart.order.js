/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   封装订单表格控件 (H5版本)
   使用新的class语法
*/


class JSOrderChart
{
    DivElement=null;
    JSChartContainer=null;              //表格控件
    ResizeListener=null;                //大小变动监听
    CanvasElement=null;

    constructor(divElement)
    {
        this.DivElement=divElement;

        //h5 canvas
        this.CanvasElement=document.createElement("canvas");
        this.CanvasElement.className='jsorderlist-drawing';
        this.CanvasElement.id=Guid();
        this.CanvasElement.setAttribute("tabindex",0);
        if (this.CanvasElement.style) this.CanvasElement.style.outline='none';
        if(divElement.hasChildNodes())
        {
            JSConsole.Chart.Log("[JSOrderChart::JSOrderChart] divElement hasChildNodes", divElement.childNodes);
        }
        divElement.appendChild(this.CanvasElement);
    }


    OnSize()
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

        JSConsole.Chart.Log(`[JSOrderChart::OnSize] devicePixelRatio=${window.devicePixelRatio}, height=${this.CanvasElement.height}, width=${this.CanvasElement.width}`);

        if (this.JSChartContainer && this.JSChartContainer.OnSize)
        {
            this.JSChartContainer.OnSize();
        } 
    }

    SetOption(option)
    {
        var chart=this.CreateJSOrderChartContainer(option);

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        this.JSChartContainer=chart;
        this.DivElement.JSChart=this;   //div中保存一份

        //注册事件
        if (IFrameSplitOperator.IsNonEmptyArray(option.EventCallback))
        {
            for(var i=0;i<option.EventCallback.length;++i)
            {
                var item=option.EventCallback[i];
                chart.AddEventCallback(item);
            }
        }

        if (option.EnableResize==true) this.CreateResizeListener();

        //if (option.FloatTooltip && option.FloatTooltip.Enable) chart.InitalFloatTooltip(option.FloatTooltip);   //提示信息

        if (!option.Symbol) 
        {
            chart.Draw();
        }
        else
        {
            chart.ChangeSymbol(option.Symbol);
        }
    }

    CreateResizeListener()
    {
        this.ResizeListener = new ResizeObserver((entries)=>{ this.OnDivResize(entries); });
        this.ResizeListener.observe(this.DivElement);
    }

    OnDivResize=function(entries)
    {
        JSConsole.Chart.Log("[JSOrderChart::OnDivResize] entries=", entries);
        this.OnSize();
    }


    CreateJSOrderChartContainer(option)
    {
        var chart=new JSOrderChartContainer(this.CanvasElement);
        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;
        if (option.Column)  chart.SetColumn(option.Column);

        this.SetChartBorder(chart, option);

        //是否自动更新
        if (option.IsAutoUpdate!=null) chart.IsAutoUpdate=option.IsAutoUpdate;
        if (option.AutoUpdateFrequency>0) chart.AutoUpdateFrequency=option.AutoUpdateFrequency;

        var orderChart=chart.GetOrderChart();

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

    SetChartBorder(chart, option)
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

    /////////////////////////////////////////////////////////////////////////////
    //对外接口
    
    //切换股票代码接口
    ChangeSymbol(symbol, option)
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol,option);
    }

    //事件回调
    AddEventCallback=function(obj)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.AddEventCallback)=='function')
        {
            JSConsole.Chart.Log('[JSOrderChart:AddEventCallback] obj=', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //重新加载配置
    ReloadResource(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.ReloadResource)=='function')
        {
            JSConsole.Chart.Log('[JSOrderChart:ReloadResource] ');
            this.JSChartContainer.ReloadResource(option);
        }
    }

    ChartDestroy=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestroy) == 'function') 
        {
            this.JSChartContainer.ChartDestroy();
        }
    }
    
   
    //初始化 静态方法
    static Init(divElement)
    {
        var jsChartControl=new JSOrderChart(divElement);
        jsChartControl.OnSize();

        return jsChartControl;
    }
}


class JSOrderChartContainer
{
    ClassName='JSOrderChartContainer';
    Frame;                                     //框架画法
    ChartPaint=[];                             //图形画法
    ChartSplashPaint=null;                     //等待提示
    LoadDataSplashTitle="数据加载中";           //下载数据提示信息
    Canvas=null;         //画布

    Symbol=null;
    Name=null;
    TradeDate=null;
    NetworkFilter=null;                                                     //数据回调接口
    Data={ DataOffset:0, Data:[], BasePrice:null, FooterData:{ }  };                                        //显示数据
    SourceData={ Data:[], MapData:new Map(), BasePrice:null, FooterData:{ } };                //原始数据 { Price:, Color:, BGColor:, Data:{ } }

    //事件回调
    MapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    AutoUpdateTimer=null;
    AutoUpdateFrequency=15000; //更新频率

    GotoBasePageConfig={ Enable:true, Timer:null, Frequency:5000, StartTime:null, Locked:false };     //自动回到基准页面
    RefreshTimer=null;
    RefreshFrequency=100;

    FloatTooltip=null;          //提示浮框
    
    UIElement=null;
    LastPoint={ X:null, Y:null };     //鼠标位置

    //MouseOnStatus:{ RowIndex:行, ColumnIndex:列} 
    LastMouseStatus={ MoveStatus:null, TooltipStatus:null, MouseOnStatus:null };

    IsDestroy=false;        //是否已经销毁了

    constructor(uielement)
    {
        this.Canvas=uielement.getContext("2d");         //画布
        this.UIElement=uielement;
    }

    ChartDestroy()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();
        this.StopGotoBasePageTimer();

        this.DestroyFloatTooltip();
    }

    HideFloatTooltip()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Hide();
    }

    DestroyFloatTooltip()
    {
        if (!this.FloatTooltip) return;

        this.FloatTooltip.Destroy();
        this.FloatTooltip=null;
    }

    InitalFloatTooltip(option)
    {
        if (this.FloatTooltip) return;

        this.FloatTooltip=new JSFloatTooltip();
        this.FloatTooltip.Inital(this, option);
        this.FloatTooltip.Create();
    }

    DrawFloatTooltip(point,toolTip)
    {
        if (!this.FloatTooltip) return;

        this.UpdateFloatTooltip(point, toolTip)
    }

    UpdateFloatTooltip(point, toolTip)
    {
        if (!this.FloatTooltip) return;

        var sendData=
        {
            Tooltip:toolTip,
            Point:point,
            DataType:6,
        };

        this.FloatTooltip.Update(sendData);
    }

    HideAllTooltip()
    {
        this.HideFloatTooltip();
    }

    CloneArray=function(aryData)
    {
        var data=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) return data;

        for(var i=0;i<aryData.length;++i)
        {
            data.push(aryData[i]);
        }

        return data;
    }

    //创建
    //windowCount 窗口个数
    Create(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);

        //创建框架
        this.Frame=new JSOrderFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;

        //创建表格
        var chart=new ChartOrderList();
        chart.Frame=this.Frame;
        chart.ChartBorder=this.Frame.ChartBorder;
        chart.Canvas=this.Canvas;
        chart.UIElement=this.UIElement;
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetGotoBasePageProgressCallback=()=>{ return this.GetGotoBasePageProgress(); }
        chart.GotoBasePageConfig=this.GotoBasePageConfig;
        chart.SetOption(option);
        this.ChartPaint[0]=chart;

        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.BorderLine)) this.Frame.BorderLine=option.BorderLine;   //边框
            if (option.GotoBasePage)
            {
                var item=option.GotoBasePage;
                if (IFrameSplitOperator.IsNumber(item.Frequency)) this.GotoBasePageConfig.Frequency=item.Frequency;
                if (IFrameSplitOperator.IsBool(item.Enable)) this.GotoBasePageConfig.Enable=item.Enable;
            }
        }

        var bRegisterKeydown=true;
        var bRegisterWheel=true;

        if (option)
        {
            if (option.KeyDown===false) 
            {
                bRegisterKeydown=false;
                JSConsole.Chart.Log('[JSOrderChartContainer::Create] not register keydown event.');
            }

            if (option.Wheel===false) 
            {
                bRegisterWheel=false;
                JSConsole.Chart.Log('[JSOrderChartContainer::Create] not register wheel event.');
            }

            if (IFrameSplitOperator.IsBool(option.EnableSelected)) chart.SelectedData.Enable=option.EnableSelected;
        }

        if (bRegisterKeydown) this.UIElement.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true);            //键盘消息
        if (bRegisterWheel) this.UIElement.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true);                  //上下滚动消息

        this.UIElement.onmousedown=(e)=> { this.UIOnMouseDown(e); }
        this.UIElement.ondblclick=(e)=>{ this.UIOnDblClick(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }

        this.StartRefreshTimer();
    }

    SetColumn(columnData)
    {
        var chart=this.GetOrderChart();
        if (chart) chart.SetColumn(columnData);
    }

    Draw()
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

    ClearData()
    {
        this.Data={ DataOffset:0, Data:[], BasePrice:null, FooterData:{ } };                    //显示数据
        this.SourceData={ Data:[], MapData:new Map(), BasePrice:null, FooterData:{ } };         //原始数据
    }

    ChangeSymbol(symbol, option)
    {
        this.Symbol=symbol;
        this.ClearData();

        var chart=this.GetOrderChart()
        if (chart) 
        {
            chart.Data=null;
            chart.SelectedData.Data=null;
            chart.MoveOnData.Data=null;
        }

        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.TradeDate)) this.TradeDate=option.TradeDate;
        } 

        if (!this.Symbol)
        {
            this.Draw();
            return;
        }

        this.RequestOrderData();
    }

    CancelAutoUpdate()    //关闭停止更新
    {
        if (typeof (this.AutoUpdateTimer) == 'number') 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    AutoUpdateEvent(bStart, explain)          //自定更新事件, 是给websocket使用
    {
        var eventID=bStart ? JSCHART_EVENT_ID.RECV_START_AUTOUPDATE:JSCHART_EVENT_ID.RECV_STOP_AUTOUPDATE;
        if (!this.MapEvent.has(eventID)) return;

        var self=this;
        var event=this.MapEvent.get(eventID);
        var data={ Stock:{ Symbol:this.Symbol, Name:this.Name, DayCount:this.DayCount }, Explain: explain };
        if (bStart) 
        {
            data.Callback=function(data) //数据到达更新回调
            { 
                self.RecvDealUpdateData(data); 
            }
        }
        event.Callback(event,data,this);
    }

    //全量数据下载
    RequestOrderData()
    {
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
        this.Draw();

        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSOrderChartContainer::RequestOrderData', //类名::
                Explain:'价格列表',
                Request:{ Data: { symbol:self.Symbol, tradeDate:self.TradeDate }  }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(data) 
            { 
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvOrderData(data);
                self.AutoUpdateEvent(true,'JSOrderChartContainer::RecvOrderData');
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }
    }

    SortSourceData()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data)) return;

        this.SourceData.Data.sort((left,right)=>{ return right.Price-left.Price; });
    }

    RecvOrderData(data)
    {
        var chart=this.GetOrderChart();
        if (!chart) return;

        var aryOrder=JSOrderChartContainer.JsonDataToOrderData(data);
        var footerData=JSOrderChartContainer.JsonDataToFooterData(data);

        if (data && IFrameSplitOperator.IsNumber(data.basePrice)) this.SourceData.BasePrice=data.basePrice;

        if (IFrameSplitOperator.IsNonEmptyArray(aryOrder))
        {
            for(var i=0;i<aryOrder.length; ++i)
            {
                var item=aryOrder[i];
                if (!IFrameSplitOperator.IsNumber(item.Price)) continue;
                if (this.SourceData.MapData.has(item.Price)) continue;  //去重
                
                //插入
                this.SourceData.MapData.set(item.Price, item);
                this.SourceData.Data.push(item);
            }
        }
        
        this.SortSourceData();

        this.Data={ DataOffset:0, Data:this.SourceData.Data.slice(), BasePrice:this.SourceData.BasePrice, FooterData:footerData };
        
        this.Symbol=data.symbol;
        this.Name=data.name;

        var chart=this.GetOrderChart();
        chart.Data=this.Data;
        chart.Symbol=this.Symbol;

        this.GotoBasePage();

        this.Draw();
    }

    RecvOrderUpdateData(data)
    {
        var chart=this.GetOrderChart();
        if (!chart) return;

        var aryOrder=JSOrderChartContainer.JsonDataToOrderData(data);
        var footerData=JSOrderChartContainer.JsonDataToFooterData(data);
        if (data && IFrameSplitOperator.IsNumber(data.basePrice)) this.SourceData.BasePrice=data.basePrice;

        var bUpdate=false;
        if (data.ClearData)
        {
            this.ClearColumData(data.ClearData.AryColumn);
            bUpdate=true;
        }
        
        if (IFrameSplitOperator.IsNonEmptyArray(aryOrder))
        {
            for(var i=0;i<aryOrder.length; ++i)
            {
                var item=aryOrder[i];
                if (!IFrameSplitOperator.IsNumber(item.Price)) continue;
                if (this.SourceData.MapData.has(item.Price))    //更新
                {
                    var priceItem=this.SourceData.MapData.get(item.Price);
                    if (!priceItem.Data) 
                    {
                        priceItem.Data=item.Data;
                    }
                    else 
                    {
                        var merged=Object.assign({}, priceItem.Data, item.Data);    //合并
                        priceItem.Data=merged;
                    }
                    if (IFrameSplitOperator.IsNumber(item.ColorID)) priceItem.ColorID=item.ColorID;
                    if (item.Color) priceItem.Color=item.Color;
                    bUpdate=true;
                }
                else
                {
                    //插入
                    this.SourceData.MapData.set(item.Price, item);
                    this.SourceData.Data.push(item);
                    bUpdate=true;
                }
            }
        }
        
        this.SortSourceData();
        
        this.Data.Data=this.SourceData.Data.slice();
        this.Data.BasePrice=this.SourceData.BasePrice;
        this.Data.FooterData=footerData;

        if (bUpdate) this.Draw();
    }

    //清除列数据
    ClearColumData(aryColumn)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.SourceData.Data)) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(aryColumn)) return;

        var aryFiled=[];
        for(var i=0;i<aryColumn.length;++i)
        {
            var item=aryColumn[i];
            var fieldName=MAP_ORDER_COLUMN_FIELD.get(item.Type);
            if (!fieldName) continue;

            aryFiled.push(fieldName);
        }

        if (!IFrameSplitOperator.IsNonEmptyArray(aryFiled)) return;

        for(var i=0;i<this.SourceData.Data.length;++i)
        {
            var item=this.SourceData.Data[i];
            if (!item.Data) continue;

            for(var j=0;j<aryFiled.length;++j)
            {
                var fieldName=aryFiled[j];
                if (item.Data[fieldName]) 
                    delete item.Data[fieldName];
            }
        }
    }

    GotoBasePage(option)
    {
        if (!IFrameSplitOperator.IsNumber(this.SourceData.BasePrice)) return false;
        var chart=this.GetOrderChart();
        if (!chart) return false;

        var index=-1;
        for(var i=0;i<this.Data.Data.length;++i)
        {
            var item=this.Data.Data[i];
            if (item.Price===this.SourceData.BasePrice)
            {
                index=i;
                break;
            }
        }

        if (index<0) return false;
        var pageSize=chart.GetPageSize(chart.SizeChange);

        var offset=index-parseInt(pageSize/2);
        if (offset<0) offset=0;
        
        this.Data.DataOffset=offset;

        this.StopGotoBasePageTimer();

        if (option && option.Draw===true) this.Draw();
        
        return true;
    }

    IsInBasePage()
    {
        var chart=this.GetOrderChart();
        if (!chart) return false;

        if (!this.Data) return false;
        if (!IFrameSplitOperator.IsNumber(this.Data.BasePrice)) return false;

        if (chart.MapDrawPrice.has(this.Data.BasePrice)) return true;

        return false;
    }

    //增量数据下载
    RequestOrderUpdateData()
    {
        var self=this;

        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'JSOrderChartContainer::RequestOrderUpdateData', //类名::函数名
                Explain:'增量价格列表',
                Request:{ Data: { symbol: self.Symbol } }, 
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvOrderUpdateData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;  
        }
    }

    GetOrderChart()
    {
        return this.ChartPaint[0];
    }


    AutoUpdate(waitTime)  //waitTime 更新时间
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;

        var self = this;
        var marketStatus=MARKET_SUFFIX_NAME.GetMarketStatus(this.Symbol);
        if (marketStatus==0 || marketStatus==3) //闭市,盘后
        {
            this.AutoUpdateTimer=setTimeout(function() 
            { 
                self.AutoUpdate(); 
            },20000);
            return;
        } 

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
                self.RequestOrderUpdateData();
            },frequency);
        }
    }

    StopAutoUpdate()
    {
        this.CancelAutoUpdate();
        this.AutoUpdateEvent(false,'JSOrderChartContainer::StopAutoUpdate');
        if (!this.IsAutoUpdate) return;
        this.IsAutoUpdate=false;
    }

    //设置事件回调
    //{event:事件id, callback:回调函数}
    AddEventCallback(object)
    {
        if (!object || !object.event || !object.callback) return;

        var data={Callback:object.callback, Source:object};
        this.MapEvent.set(object.event,data);
    }

    RemoveEventCallback(eventid)
    {
        if (!this.MapEvent.has(eventid)) return;

        this.MapEvent.delete(eventid);
    }

    GetEventCallback(id)  //获取事件回调
    {
        if (!this.MapEvent.has(id)) return null;
        var item=this.MapEvent.get(id);
        return item;
    }

    OnSize()
    {
        if (!this.Frame) return;

        this.SetSizeChange(true);

        if (this.GotoBasePageConfig.Enable && this.GotoBasePageConfig.Locked===false)
        {
            this.GotoBasePage();
        }

        this.Draw();
    }

    SetSizeChange(bChanged)
    {
        var chart=this.GetOrderChart();
        if (chart) chart.SizeChange=bChanged;
    }


    OnWheel(e)    //滚轴
    {
        JSConsole.Chart.Log('[JSOrderChartContainer::OnWheel]',e);
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        var x = e.clientX-this.UIElement.getBoundingClientRect().left;
        var y = e.clientY-this.UIElement.getBoundingClientRect().top;

        var isInClient=false;
        this.Canvas.beginPath();
        this.Canvas.rect(this.Frame.ChartBorder.GetLeft(),this.Frame.ChartBorder.GetTop(),this.Frame.ChartBorder.GetWidth(),this.Frame.ChartBorder.GetHeight());
        isInClient=this.Canvas.isPointInPath(x,y);
        if (!isInClient) return;

        var chart=this.GetOrderChart();
        if (!chart) return;
        
        if (this.GotoBasePageConfig.Locked)
        {
            if(e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return;
        }

        var wheelValue=e.wheelDelta;
        if (!IFrameSplitOperator.IsObjectExist(e.wheelDelta))
            wheelValue=e.deltaY* -0.01;

        var option={ Move:{ Count:1 }};
        if (e && e.ctrlKey) option={ Move:{ Page:1 }}

        var pageType=0
        if (wheelValue<0)   //下一条
        {
            this.HideAllTooltip();
            if (this.GotoNextPage(option)) 
            {
                this.Draw();
                this.DelayGotoBasePage();
            }
        }
        else if (wheelValue>0)  //上一页
        {
            this.HideAllTooltip();
            if (this.GotoPreviousPage(option)) 
            {
                this.Draw();
                this.DelayGotoBasePage();
            }
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    OnKeyDown(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var keyID = e.keyCode ? e.keyCode :e.which;
        switch(keyID)
        {
            case 38:    //up
                this.HideAllTooltip();
                //if (this.GotoPreviousPage()) this.Draw();
                break;
            case 40:    //down
                this.HideAllTooltip();
                //if (this.GotoNextPage()) this.Draw();
                break;
        }

        //不让滚动条滚动
        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    UIOnMouseDown(e)
    {
        this.DragCenter=null;

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (this.TryDragCenter(x,y,e))  //拖动
        {
            return;
        }
         
        var chart=this.GetOrderChart();
        if (!chart) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var clickData=chart.OnMouseDown(x,y,e);
        if (!clickData) return;

        if (clickData.Type==10 && e.button==0)  //锁按钮
        {
            this.GotoBasePageConfig.Locked=!this.GotoBasePageConfig.Locked;

            if (this.GotoBasePageConfig.Locked)
            {
                this.GotoBasePage({ Draw:true });
            }
            else
            {
                 this.Draw();
                this.DelayGotoBasePage();
            }
        }
        else if (([1,2].includes(clickData.Type)) && (e.button==0 || e.button==2))  //点单元格 按钮
        {
            if (clickData.Redraw==true) this.Draw();
            if (clickData.Type==10) this.DelayGotoBasePage();
        }
    }

    TryDragCenter(x,y,e)
    {
        if (this.GotoBasePageConfig.Locked) return false;
        var chart=this.GetOrderChart();
        if (!chart) return false;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;

        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;

        if (!chart.PtInCenter(x,y)) return false;

        this.DragCenter=
        { 
            Click:{ X:e.clientX, Y:e.clientY }, 
            LastMove:{ X:e.clientX, Y:e.clientY} 
        };

        this.SetCursor({Cursor:"grabbing"});

        document.onmousemove=(e)=>{ this.DocOnMouseMove(e); }
        document.onmouseup=(e)=> { this.DocOnMouseUp(e); }

        return true;
    }

    DocOnMouseMove(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash) return;

        var chart=this.GetOrderChart();
        if (!chart) return;

        var dragCenter=this.DragCenter;
        if (!dragCenter) return;

        var moveYSetp=dragCenter.LastMove.Y-e.clientY;
        if(Math.abs(moveYSetp)<5) return;

        var pixelTatio = GetDevicePixelRatio();
        moveYSetp*=pixelTatio;
        var rowHeight=chart.RowHeight;
        if (Math.abs(moveYSetp)<rowHeight) return;

        var bDraw=false;
        if (moveYSetp>0)
        {
            var moveCount=Math.abs(moveYSetp)/rowHeight;
            if (this.GotoNextPage({ Move:{ Count:moveCount }})) bDraw=true;
        }
        else if (moveYSetp<0)
        {
             var moveCount=Math.abs(moveYSetp)/rowHeight;
            if (this.GotoPreviousPage({ Move:{ Count:moveCount }})) bDraw=true;
        }

        dragCenter.LastMove.X=e.clientX;
        dragCenter.LastMove.Y=e.clientY;

        this.SetCursor({Cursor:"grabbing"});

        if (bDraw) 
        {
            this.Draw();
            this.DelayGotoBasePage();
        }
    }

    DocOnMouseUp(e)
    {
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null;

        this.DragCenter=null;
        this.DelayGotoBasePage();

        this.SetCursor({Cursor:"default"});
    }

    UIOnMouseMove(e)
    {
        if (this.DragCenter) return;
        

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;
        
        var oldMouseOnStatus=this.LastMouseStatus.MouseOnStatus;
        this.LastMouseStatus.OnMouseMove=null;

        var bDrawTooltip=false;
        if (this.LastMouseStatus.TooltipStatus) bDrawTooltip=true;
        this.LastMouseStatus.TooltipStatus=null;
        var chartTooltipData=null;
        this.LastMouseStatus.OnMouseMove={ X:x, Y:y };
        var mouseStatus={ Cursor:"default", Name:"Default"};;   //鼠标状态
        
        var chart=this.GetOrderChart();
        var bDraw=false;
        var cell=null;
        if (chart)
        {
            var data=chart.OnMouseOn(x, y, e);  //单元格提示信息
            if (data)
            {
                if (data.Redraw===true) bDraw=data.Redraw;
                if (data.Cell)
                {
                    cell=data.Cell;
                    bDrawTooltip=true;
                }
                //this.LastMouseStatus.TooltipStatus={ X:x, Y:y, Data:tooltipData, ClientX:e.clientX, ClientY:e.clientY };
            }
        }

        if (bDraw) this.Draw();

        this.SendMouseOnEvent({ Data:cell, X:x, Y:y, FuncName:"UIOnMouseMove" });

        if (this.LastMouseStatus.TooltipStatus) 
        {
            var xTooltip = e.clientX-this.UIElement.getBoundingClientRect().left;
            var yTooltip = e.clientY-this.UIElement.getBoundingClientRect().top;
            //this.DrawFloatTooltip({X:xTooltip, Y:yTooltip, YMove:20/pixelTatio},this.LastMouseStatus.TooltipStatus.Data);
        }
        else
        {
            this.HideFloatTooltip();
        }
    }

    SendMouseOnEvent(data)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_MOVEON_ORDER_CELL);
        if (!event || !event.Callback) return;

        event.Callback(event,data, this)
    }

    //设置鼠标形状 {Cursor:鼠标形状 }
    SetCursor(obj)
    {
        if (!obj || !obj.Cursor) return;

        if (obj.Cursor=="default") 
            this.UIElement.style.cursor="default";
        else
            this.UIElement.style.cursor=obj.Cursor;
    }

    UIOnDblClick(e)
    {
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.GetOrderChart();
        if (chart) chart.OnDblClick(x,y,e);
    }

    UIOnContextMenu(e)
    {
        e.preventDefault();
    }

    UIOnMounseOut(e)
    {
        this.ClearMoveOnStatus("UIOnMouseleave");

        this.HideAllTooltip();
    }

    UIOnMouseleave(e)
    {
        this.ClearMoveOnStatus("UIOnMouseleave");

        this.HideAllTooltip();
    }

    ClearMoveOnStatus(funcName)
    {
        var chart=this.GetOrderChart();
        if (!chart) return;

        if (!chart.MoveOnData.Data) return;
        
        chart.MoveOnData.Data=null;
        this.Draw();

        this.SendMouseOnEvent({ Data:null, X:null, Y:null, FuncName:funcName });
    }

    //option ={ Move:{ Step:1, Page: 1 }}
    GotoNextPage(option)
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.GetOrderChart();
        if (!chart) return false;
       
        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;

        var moveStep=1;
        if (option && option.Move)
        {
            var item=option.Move;
            if (IFrameSplitOperator.IsPlusNumber(item.Step)) 
            {
                moveStep=item.Step;
            }
            else if (IFrameSplitOperator.IsPlusNumber(item.Page))
            {
                moveStep=pageSize;
            }
        }
       
        var offset=this.Data.DataOffset+moveStep;
        if (offset+pageSize==this.Data.Data.length-1) return false;

        if (offset+pageSize>this.Data.Data.length)  //最后一页不够一屏调整到满屏
        {
            this.Data.DataOffset=this.Data.Data.length-pageSize;
        }
        else
        {
            this.Data.DataOffset=offset;
        }

        return true;
    }

    //option ={ Move:{ Step:1, Page: 1 }}
    GotoPreviousPage(option)
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.GetOrderChart();
        if (!chart) return false;
        if (this.Data.DataOffset<=0) return false;

        var pageSize=chart.GetPageSize();

        var moveStep=1;
        if (option && option.Move)
        {
            var item=option.Move;
            if (IFrameSplitOperator.IsPlusNumber(item.Step)) 
            {
                moveStep=item.Step;
            }
            else if (IFrameSplitOperator.IsPlusNumber(item.Page))
            {
                moveStep=pageSize;
            }
        }

        var offset=this.Data.DataOffset-moveStep;
        if (offset<0) offset=0;
        this.Data.DataOffset=offset;

        return true;
    }

    ReloadResource(option)
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

    DelayGotoBasePage()
    {
        this.StopGotoBasePageTimer();
        if (this.IsInBasePage()) return;

        var config=this.GotoBasePageConfig;
        if (config.Enable===false) return;

        if (this.DragCenter) return;  //拖动中不启动自动回到基准页
        
        config.StartTime=new Date();
        config.Timer=setTimeout(()=> 
        { 
            if (this.IsInBasePage()) return;
            
            this.GotoBasePage({ Draw:true });

        },config.Frequency);
    }

    StopGotoBasePageTimer()
    {
        var config=this.GotoBasePageConfig;
        clearTimeout(config.Timer);
        config.Timer = null;
        config.StartTime=null;
    }

    StopRefreshTimer()
    {
        clearInterval(this.RefreshTimer);
        this.RefreshTimer=null;
    }

    StartRefreshTimer()
    {
        this.RefreshTimer=setInterval(()=>
        {
            var config=this.GotoBasePageConfig;
            if (config.Enable && config.Timer && config.StartTime)
                this.Draw();

        }, this.RefreshFrequency);
    }

    static JsonDataToOrderData(data)
    {
        var symbol=data.symbol;
        var result=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(data.data)) return result;

        for(var i=0;i<data.data.length;++i)
        {
            var item=data.data[i];

            var newItem={ Price:item.Price, Data:{ } };
            if (item.BGColor) newItem.BGColor=item.BGColor;
            if (IFrameSplitOperator.IsNumber(item.BGColorID)) newItem.BGColorID=item.BGColorID;
            if (item.Color) newItem.Color=item.Color;
            if (IFrameSplitOperator.IsNumber(item.ColorID)) newItem.ColorID=item.ColorID;

            if (item.Data)
            {
                if (IFrameSplitOperator.IsObject(item.Data[201])) newItem.Data.ReserveNumber1=item.Data[201];
                if (IFrameSplitOperator.IsObject(item.Data[202])) newItem.Data.ReserveNumber2=item.Data[202];
                if (IFrameSplitOperator.IsObject(item.Data[203])) newItem.Data.ReserveNumber3=item.Data[203];
                if (IFrameSplitOperator.IsObject(item.Data[204])) newItem.Data.ReserveNumber4=item.Data[204];
                if (IFrameSplitOperator.IsObject(item.Data[205])) newItem.Data.ReserveNumber5=item.Data[205];
                if (IFrameSplitOperator.IsObject(item.Data[206])) newItem.Data.ReserveNumber6=item.Data[206];
                if (IFrameSplitOperator.IsObject(item.Data[207])) newItem.Data.ReserveNumber7=item.Data[207];
                if (IFrameSplitOperator.IsObject(item.Data[208])) newItem.Data.ReserveNumber8=item.Data[208];
                if (IFrameSplitOperator.IsObject(item.Data[209])) newItem.Data.ReserveNumber9=item.Data[209];
                if (IFrameSplitOperator.IsObject(item.Data[210])) newItem.Data.ReserveNumber10=item.Data[210];
            }
            
            result.push(newItem);
        }

        return result;
    }

    static JsonDataToFooterData(data)
    {
        if (!data || !data.footer) return null;

        var footerData={ Left:[], Right:[] };
        if (IFrameSplitOperator.IsNonEmptyArray(data.footer.left))
        {
            for(var i=0;i<data.footer.left.length;++i)
            {
                var item=data.footer.left[i];
                if (!item) continue;

                var newItem={ };

                if (item.BGColor) newItem.BGColor=item.BGColor;
                if (IFrameSplitOperator.IsNumber(item.BGColorID)) newItem.BGColorID=item.BGColorID;
                if (item.Color) newItem.Color=item.Color;
                if (IFrameSplitOperator.IsNumber(item.ColorID)) newItem.ColorID=item.ColorID;
                if (item.Text) newItem.Text=item.Text;

                footerData.Left[i]=newItem;
            }
        }


        if (IFrameSplitOperator.IsNonEmptyArray(data.footer.right))
        {
            for(var i=0;i<data.footer.right.length;++i)
            {
                var item=data.footer.right[i];
                if (!item) continue;

                var newItem={ };

                if (item.BGColor) newItem.BGColor=item.BGColor;
                if (IFrameSplitOperator.IsNumber(item.BGColorID)) newItem.BGColorID=item.BGColorID;
                if (item.Color) newItem.Color=item.Color;
                if (IFrameSplitOperator.IsNumber(item.ColorID)) newItem.ColorID=item.ColorID;
                if (item.Text) newItem.Text=item.Text;

                 footerData.Right[i]=newItem;
            }
        }

        return footerData;
    }

}


class JSOrderFrame
{
    ChartBorder;
    Canvas;                            //画布

    //BorderColor=g_JSChartResource.DealList.BorderColor;    //边框线

    LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    LogoTextFont=g_JSChartResource.FrameLogo.Font;

    ReloadResource(resource)
    {
        this.BorderColor=g_JSChartResource.DealList.BorderColor;    //边框线
        this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
        this.LogoTextFont=g_JSChartResource.FrameLogo.Font;
    }

    Draw(option)
    {
        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;
    }

    DrawLogo()
    {
        var text=g_JSChartResource.FrameLogo.Text;
        if (!IFrameSplitOperator.IsString(text)) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
       
        var x=this.ChartBorder.GetLeft()+5;
        var y=this.ChartBorder.GetBottom()-5;
        this.Canvas.fillText(text,x,y); 
    }
}

var ORDER_COLUMN_ID=
{
    PRICE_ID:0,

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
}

var MAP_ORDER_COLUMN_FIELD=new Map(
[
    [ORDER_COLUMN_ID.RESERVE_NUMBER1_ID,"ReserveNumber1"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER2_ID,"ReserveNumber2"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER3_ID,"ReserveNumber3"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER4_ID,"ReserveNumber4"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER5_ID,"ReserveNumber5"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER6_ID,"ReserveNumber6"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER7_ID,"ReserveNumber7"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER8_ID,"ReserveNumber8"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER9_ID,"ReserveNumber9"],
    [ORDER_COLUMN_ID.RESERVE_NUMBER10_ID,"ReserveNumber10"],

    [ORDER_COLUMN_ID.RESERVE_STRING1_ID,"ReserveString1"],
    [ORDER_COLUMN_ID.RESERVE_STRING2_ID,"ReserveString2"],
    [ORDER_COLUMN_ID.RESERVE_STRING3_ID,"ReserveString3"],
    [ORDER_COLUMN_ID.RESERVE_STRING4_ID,"ReserveString4"],
    [ORDER_COLUMN_ID.RESERVE_STRING5_ID,"ReserveString5"],
    [ORDER_COLUMN_ID.RESERVE_STRING6_ID,"ReserveString6"],
    [ORDER_COLUMN_ID.RESERVE_STRING7_ID,"ReserveString7"],
    [ORDER_COLUMN_ID.RESERVE_STRING8_ID,"ReserveString8"],
    [ORDER_COLUMN_ID.RESERVE_STRING9_ID,"ReserveString9"],
    [ORDER_COLUMN_ID.RESERVE_STRING10_ID,"ReserveString10"],

]);


class ChartOrderList
{
    Canvas=null;                        //画布
    ChartBorder=null;                   //边框信息
    ChartFrame=null;                    //框架画法
    Name=null;                          //名称
    ClassName='ChartOrderList';     //类名
    IsDrawFirst=false;
    GetEventCallback=null;
    Data=null;                          //数据 { Data:[ { Price:, Color:, BGColor:, Data:{ } } ], Offset: }
    GotoBasePageConfig=null;
    Symbol=null;
    Decimal=2; //小数位数
    IsShowHeader=true;      //是否显示表头
    IsShowHeaderBorder=false; //是否显示表头边框线
    IsShowFooter=true;      //是否显示页脚
    SelectedData={ Data:null, Enable:true };         //{ Data:{ ColIndex:null, Price:null, Type:null }, Enable:是否启动 }
    MoveOnData={ Data:null, Enable:true };                         //鼠标在上面

    SizeChange=true;

    //涨跌颜色
    PriceConfig=
    {
        Up:{ Color:g_JSChartResource.OrderList.UpTextColor, ColorID:g_JSChartResource.OrderList.UpTextColorID },
        Down:{ Color:g_JSChartResource.OrderList.DownTextColor, ColorID:g_JSChartResource.OrderList.DownTextColorID },
        Unchange:{ Color:g_JSChartResource.OrderList.UnchangeTextColor, ColorID:g_JSChartResource.OrderList.UnchangeTextColorID }
    }
    
    BorderColor=g_JSChartResource.OrderList.BorderColor;    //边框线

    SelectedConfig={ BGColor:g_JSChartResource.OrderList.Selected.BGColor, LineColor:g_JSChartResource.OrderList.Selected.LineColor, LineWidth:g_JSChartResource.OrderList.Selected.LineWidth };
    MoveOnConfig={ LineColor:g_JSChartResource.OrderList.MoveOn.LineColor, LineWidth:g_JSChartResource.OrderList.MoveOn.LineWidth }

    //表头配置
    HeaderFontConfig={ Size:g_JSChartResource.OrderList.Header.Font.Size, Name:g_JSChartResource.OrderList.Header.Font.Name };
    HeaderColor=g_JSChartResource.OrderList.Header.Color;
    HeaderMargin=
    { 
        Left:g_JSChartResource.OrderList.Header.Margin.Left, 
        Right:g_JSChartResource.OrderList.Header.Margin.Right, 
        Top:g_JSChartResource.OrderList.Header.Margin.Top, 
        Bottom:g_JSChartResource.OrderList.Header.Margin.Bottom
    };

    //表格内容配置
    ItemFontConfig={ Size:g_JSChartResource.OrderList.Item.Font.Size, Name:g_JSChartResource.OrderList.Item.Font.Name };
    ItemMargin=
    { 
        Left:g_JSChartResource.OrderList.Item.Margin.Left, 
        Right:g_JSChartResource.OrderList.Item.Margin.Right, 
        Top:g_JSChartResource.OrderList.Item.Margin.Top, 
        Bottom:g_JSChartResource.OrderList.Item.Margin.Bottom,
    };

    FooterConfig=
    {
        Font:{ Size:g_JSChartResource.OrderList.Footer.Font.Size, Name:g_JSChartResource.OrderList.Footer.Font.Name },
        Margin:CloneData(g_JSChartResource.OrderList.Footer.Margin),
        ItemMargin:CloneData(g_JSChartResource.OrderList.Footer.ItemMargin),
        ResetButton:CloneData(g_JSChartResource.OrderList.Footer.ResetButton),
    }
   
    //缓存
    HeaderFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    ItemFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    FooterFont=12*GetDevicePixelRatio() +"px 微软雅黑";

    RowHeight=20;
    RowCount=0;
    HeaderHeight=0;
    FooterHeight=0;

    //自定义颜色
    AryColor=g_JSChartResource.OrderList.AryColor.slice();

    Column=
    {
        Left:
        [ 
            //{ Type:ORDER_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"数值1", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.Time, MaxText:"8888.88" },
        ],

        Right:
        [ 
            //{ Type:ORDER_COLUMN_ID.RESERVE_NUMBER3_ID, Title:"数值3", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.Time, MaxText:"888888" }
        ],

        Center:{ Title:"", TextAlign:"center", MaxText:"88888.88" },
    }
    

    RectClient={ };
    RectCenter=null;    //上下可以拖动的中间区域
    AryCellRect=[];    //{ Rect:, Type: 1=单行 }
    AryFooterRect=[];

    //Type:20=分时图
    //{ Rect, Data, Index, Column, Type }}
    TooltipRect=[];
    MapDrawPrice=new Map(); //当前绘制的价格列表


    SetOption(option)
    {
        if (!option) return;
        if (option.Header)
        {
            var item=option.Header;
            if (IFrameSplitOperator.IsBool(item.IsShow)) this.IsShowHeader=item.IsShow;
            if (IFrameSplitOperator.IsBool(item.IsShowBorder)) this.IsShowHeaderBorder=item.IsShowBorder;
        }

        if (option.Footer)
        {
            var item=option.Footer;
             if (IFrameSplitOperator.IsBool(item.IsShow)) this.IsShowFooter=item.IsShow;
        }
    }

    ReloadResource(resource)
    {
       //涨跌颜色
        PriceConfig=
        {
            Up:{ Color:g_JSChartResource.OrderList.UpTextColor, ColorID:g_JSChartResource.OrderList.UpTextColorID },
            Down:{ Color:g_JSChartResource.OrderList.DownTextColor, ColorID:g_JSChartResource.OrderList.DownTextColorID },
            Unchange:{ Color:g_JSChartResource.OrderList.UnchangeTextColor, ColorID:g_JSChartResource.OrderList.UnchangeTextColorID }
        }

        this.BorderColor=g_JSChartResource.OrderList.BorderColor;    //边框线

        //表头配置
        this.HeaderFontConfig={ Size:g_JSChartResource.OrderList.Header.Font.Size, Name:g_JSChartResource.OrderList.Header.Font.Name };
        this.HeaderColor=g_JSChartResource.OrderList.Header.Color;
        this.HeaderMargin=
        { 
            Left:g_JSChartResource.OrderList.Header.Margin.Left, 
            Right:g_JSChartResource.OrderList.Header.Margin.Right, 
            Top:g_JSChartResource.OrderList.Header.Margin.Top, 
            Bottom:g_JSChartResource.OrderList.Header.Margin.Bottom
        };

        //表格内容配置
        this.ItemFontConfig={ Size:g_JSChartResource.OrderList.Item.Font.Size, Name:g_JSChartResource.OrderList.Item.Font.Name };
        this.ItemMargin=
        { 
            Left:g_JSChartResource.OrderList.Item.Margin.Left, 
            Right:g_JSChartResource.OrderList.Item.Margin.Right, 
            Top:g_JSChartResource.OrderList.Item.Margin.Top, 
            Bottom:g_JSChartResource.OrderList.Item.Margin.Bottom,
        };

        this.FooterConfig=
        {
            Font:{ Size:g_JSChartResource.OrderList.Footer.Font.Size, Name:g_JSChartResource.OrderList.Footer.Font.Name },
            Margin:CloneData(g_JSChartResource.OrderList.Footer.Margin),
            ItemMargin:CloneData(g_JSChartResource.OrderList.Footer.ItemMargin),
            ResetButton:CloneData(g_JSChartResource.OrderList.Footer.ResetButton),
        }


        this.SelectedConfig=
        { 
            BGColor:g_JSChartResource.OrderList.Selected.BGColor, 
            LineColor:g_JSChartResource.OrderList.Selected.LineColor, 
            LineWidth:g_JSChartResource.OrderList.Selected.LineWidth 
        };
        
        this.AryColor=g_JSChartResource.OrderList.AryColor.slice();
    }

    GetColorByID(id)
    {
        if (!IFrameSplitOperator.IsNumber(id)) return null;
        if (id<0 || id>=this.AryColor.length) return null;

        return this.AryColor[id];
    }

    CreateColumnItem(item)
    {
        if (!item) return null;
        var colItem=this.GetDefaultColunm(item.Type);
        if (!colItem) return null;

        if (item.Title) colItem.Title=item.Title;
        if (item.TitleAlign) colItem.TitleAlign=item.TitleAlign;
        if (item.HeaderColor) colItem.HeaderColor=item.HeaderColor;
        if (item.TextAlign) colItem.TextAlign=item.TextAlign;
        if (item.TextColor) colItem.TextColor=item.TextColor;
        if (item.MaxText) colItem.MaxText=item.MaxText;

        if (this.IsReserveNumber(item.Type))
        {
            if (item.Format) colItem.Format=item.Format;        //数据格式化设置{ Type:1=原始 2=千分位分割 3=万亿转换, ExFloatPrecision:万亿转换以后的小数位数 }
            if (IFrameSplitOperator.IsNumber(item.ColorType))  colItem.ColorType=item.ColorType;        //0=默认 1=(>0, =0, <0) 2=(>=0, <0)
            if (IFrameSplitOperator.IsNumber(item.FloatPrecision)) colItem.FloatPrecision=item.FloatPrecision;
            if (item.StringFormat) colItem.StringFormat=item.StringFormat;      //"{0}%" 输出增加固定字符
        }

        if (item.MoveOn)
        {
            colItem.MoveOn={ };
            if (item.MoveOn.LineColor) colItem.MoveOn.LineColor=item.MoveOn.LineColor;
            if (IFrameSplitOperator.IsNumber(item.MoveOn.LineColorID)) colItem.MoveOn.LineColorID=item.MoveOn.LineColorID;
            if (IFrameSplitOperator.IsNumber(item.MoveOn.LineWidth)) colItem.MoveOn.LineWidth=item.MoveOn.LineWidth;
        }

        return colItem
    }

    SetColumn(columnData)
    {
        if (!columnData) return;

        if (columnData.Left && IFrameSplitOperator.IsArray(columnData.Left.Data))
        {
            this.Column.Left=[];
            var aryData=columnData.Left.Data;
            for(var i=0;i<aryData.length;++i)
            {
                var item=aryData[i];
                var colItem=this.CreateColumnItem(item);
                if (!colItem) continue;

                this.Column.Left.push(colItem);
            }
        }

        if (columnData.Right && IFrameSplitOperator.IsArray(columnData.Right.Data))
        {
            this.Column.Right=[];
            var aryData=columnData.Right.Data;
            for(var i=0;i<aryData.length;++i)
            {
                var item=aryData[i];
                var colItem=this.CreateColumnItem(item);
                if (!colItem) continue;

                this.Column.Right.push(colItem);
            }
        }

        if (columnData.Center)
        {
            item=columnData.Center;

            var colItem=this.CreateColumnItem(item);
            if (colItem) this.Column.Center=colItem;
        }

    }

    GetDefaultColunm(id)
    {
        var DEFAULT_COLUMN=
        [
            { Type:ORDER_COLUMN_ID.PRICE_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"99999.99", FloatPrecision:2 },

            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER3_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER4_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER5_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER6_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER7_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER8_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER9_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },
            { Type:ORDER_COLUMN_ID.RESERVE_NUMBER10_ID, Title:"", TextAlign:"right", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"9999.99", FloatPrecision:2 },


            { Type:ORDER_COLUMN_ID.RESERVE_STRING1_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING2_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING3_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING4_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING5_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING6_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING7_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING8_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING9_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
            { Type:ORDER_COLUMN_ID.RESERVE_STRING10_ID, Title:"", TextAlign:"center", TextColor:g_JSChartResource.OrderList.FieldColor.Text, MaxText:"擎擎擎擎擎擎" },
        ];

        for(var i=0;i<DEFAULT_COLUMN.length;++i)
        {
            var item=DEFAULT_COLUMN[i];
            if (item.Type==id) return item;
        }

        return null;
    }


    Draw()
    {
        this.AryCellRect=[];
        this.AryFooterRect=[];
        this.TooltipRect=[];
        this.RectCenter=null;
        this.MapDrawPrice.clear();
        if (this.SizeChange) this.CalculateSize();
        else this.UpdateCacheData();
        
        this.ClipClient();
        this.DrawHeader();
        this.DrawBodyBG();
        this.DrawBorder();
        this.DrawBody();
        this.DrawFooter();
        this.Canvas.restore();

        this.SizeChange=false;
    }

    ClipClient()
    {
        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(this.RectClient.Left,this.RectClient.Top,(this.RectClient.Right-this.RectClient.Left),(this.RectClient.Bottom-this.RectClient.Top));
        //this.Canvas.stroke(); //调试用
        this.Canvas.clip();
    }

    //更新缓存变量
    UpdateCacheData()
    {
        this.RectClient.Left=this.ChartBorder.GetLeft();
        this.RectClient.Right=this.ChartBorder.GetRight();
        this.RectClient.Top=this.ChartBorder.GetTop();
        this.RectClient.Bottom=this.ChartBorder.GetBottom();
        this.Decimal=GetfloatPrecision(this.Symbol);
    }

    GetPageSize(recalculate) //recalculate 是否重新计算
    {
        if (recalculate) this.CalculateSize();

        var size=this.RowCount;

        return size;
    }


    CalculateColumnWidth(item)
    {
        this.Canvas.font=this.ItemFont;
        var textWidth=this.Canvas.measureText(item.MaxText).width;
        var width=textWidth+4+this.ItemMargin.Left+this.ItemMargin.Right;

        if (item.Title) //标题文字宽度
        {
            this.Canvas.font=this.HeaderFont;
            textWidth=this.Canvas.measureText(item.Title).width;
            var titleWidth=textWidth+4+this.HeaderMargin.Right+this.HeaderMargin.Left;
            if (width<titleWidth) width=titleWidth;
        }

        return width;
    }

    CalculateSize()   //计算大小
    {
        this.UpdateCacheData();

        var pixelRatio=GetDevicePixelRatio();
        this.HeaderFont=`${this.HeaderFontConfig.Size*pixelRatio}px ${ this.HeaderFontConfig.Name}`;
        this.ItemFont=`${this.ItemFontConfig.Size*pixelRatio}px ${ this.ItemFontConfig.Name}`;
        
        var leftWidth=0, rightWidth=0, centerWidth=0, itemWidth=0;
        var aryData=this.Column.Left;
        for(var i=0; i<aryData.length; ++i)
        {
            var item=aryData[i];
            item.Width=this.CalculateColumnWidth(item);
            leftWidth+=item.Width;
        }

        var aryData=this.Column.Right;
        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            item.Width=this.CalculateColumnWidth(item);
            rightWidth+=item.Width;
        }

        var item=this.Column.Center;
        item.Width=this.CalculateColumnWidth(item);
        centerWidth=item.Width;

        var sumWidth=leftWidth+rightWidth+centerWidth;
       
        this.RectClient.TableWidth=sumWidth;
        this.RectClient.LeftTableWidth=leftWidth;
        this.RectClient.RightTableWidth=rightWidth;
        this.RectClient.CenterWidth=centerWidth;
        
        this.HeaderHeight=this.GetFontHeight(this.HeaderFont,"擎")+ this.HeaderMargin.Top+ this.HeaderMargin.Bottom;
        if (!this.IsShowHeader) this.HeaderHeight=0;

        this.FooterHeight=0;
        if (this.IsShowFooter)
        {
            var config=this.FooterConfig;
            var iconSize=config.ResetButton.Size*pixelRatio;
            var fontHeight=this.GetFontHeight(this.FooterFont,"擎")+config.ItemMargin.Top+config.ItemMargin.Bottom;
            this.FooterHeight=Math.max(iconSize,fontHeight)+config.Margin.Top+config.Margin.Bottom;
        }
        
        this.RowHeight=this.GetFontHeight(this.ItemFont,"擎")+ this.ItemMargin.Top+ this.ItemMargin.Bottom;
        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top-this.HeaderHeight-this.FooterHeight)/this.RowHeight);
    }

    DrawHeader()
    {
        if (!this.IsShowHeader) return;

        var clientWidth=this.RectClient.Right-this.RectClient.Left;
        var tableWidth=this.RectClient.TableWidth;
        var xCenter=this.RectClient.Left+clientWidth/2;

        this.Canvas.font=this.HeaderFont;
        this.Canvas.fillStyle=this.HeaderColor;

        //中间
        var item=this.Column.Center;
        var rtCenter={ Left:xCenter-item.Width/2, Width:item.Width, Top:this.RectClient.Top, Height:this.HeaderHeight };
        rtCenter.Right=rtCenter.Left+rtCenter.Width;
        rtCenter.Bottom=rtCenter.Top+rtCenter.Height;
        this.DrawHeaderItem(rtCenter, item);

        var aryData=this.Column.Left;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData))
        {
            var xRight=rtCenter.Left;
            for(var i=aryData.length-1; i>=0; --i)
            {
                var item=aryData[i];
                var rtItem={ Right:xRight, Width:item.Width, Top:this.RectClient.Top, Height:this.HeaderHeight };
                rtItem.Left=rtItem.Right-rtItem.Width;
                rtItem.Bottom=rtItem.Top+rtItem.Height;
                this.DrawHeaderItem(rtItem, item);

                xRight=rtItem.Left;
            }
        }

        var aryData=this.Column.Right;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData))
        {
            var xLeft=rtCenter.Right;
            for(var i=0;i<aryData.length; ++i)
            {
                var item=aryData[i];
                var rtItem={ Left:xLeft, Width:item.Width, Top:this.RectClient.Top, Height:this.HeaderHeight };
                rtItem.Right=rtItem.Left+rtItem.Width;
                rtItem.Bottom=rtItem.Top+rtItem.Height;
                this.DrawHeaderItem(rtItem, item);

                xLeft=rtItem.Right;
            }
        }
        
    }

    DrawHeaderItem(rtItem, item)
    {
        var y=rtItem.Bottom-this.HeaderMargin.Bottom;
        var x=this.HeaderMargin.Left+rtItem.Left;
        var textAlign=item.TextAlign;
        if (item.TitleAlign) textAlign=item.TitleAlign;

        if (textAlign=='center')
        {
            x=rtItem.Left+item.Width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=rtItem.Right-this.HeaderMargin.Right;
            this.Canvas.textAlign="right";
        }
        else
        {
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="bottom";

        var color=this.HeaderColor;
        if (item.HeaderColor) color=item.HeaderColor;
        this.Canvas.fillStyle=color;
        this.Canvas.fillText(item.Title,x,y);
    }

    DrawBorder()
    {
        var clientWidth=this.RectClient.Right-this.RectClient.Left;
        var tableWidth=this.RectClient.TableWidth;
        var xCenter=this.RectClient.Left+clientWidth/2;

        var left=ToFixedPoint(xCenter-this.RectClient.CenterWidth/2-this.RectClient.LeftTableWidth);
        var right=ToFixedPoint(left+tableWidth);
        var top=ToFixedPoint(this.RectClient.Top);
        var bottom=ToFixedPoint(this.RectClient.Bottom);
        var yCellTop=top;

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.beginPath();

        if (this.IsShowHeader)
        {
            this.Canvas.moveTo(left,top+this.HeaderHeight);
            this.Canvas.lineTo(right,top+this.HeaderHeight);
            yCellTop=top+this.HeaderHeight;

            if (this.IsShowHeaderBorder===false) top+=this.HeaderHeight;
        }

        if (this.IsShowFooter)
        {
            bottom-=this.FooterHeight;
        }

        //左右边框
        this.Canvas.moveTo(left, top);
        this.Canvas.lineTo(right, top);
        this.Canvas.lineTo(right, bottom);
        this.Canvas.lineTo(left, bottom);
        this.Canvas.lineTo(left, top);

        //横线
        var yLine=yCellTop;
        for(var i=0;i<this.RowCount;++i)
        {
            yLine+=this.RowHeight;
            this.Canvas.moveTo(left, ToFixedPoint(yLine));
            this.Canvas.lineTo(right, ToFixedPoint(yLine));
        }

        //竖线
        var item=this.Column.Center;
        var rtCenter={ Left:xCenter-item.Width/2, Width:item.Width, Top:this.RectClient.Top, Height:this.HeaderHeight };
        rtCenter.Right=rtCenter.Left+rtCenter.Width;
        rtCenter.Bottom=rtCenter.Top+rtCenter.Height;
        this.RectCenter={ Left:rtCenter.Left, Right:rtCenter.Right, Width:rtCenter.Width, Top:yCellTop, Bottom:bottom };
        this.RectCenter.Height=this.RectCenter.Bottom-this.RectCenter.Top;

        this.Canvas.moveTo(ToFixedPoint(rtCenter.Left), top);
        this.Canvas.lineTo(ToFixedPoint(rtCenter.Left), bottom);
        this.Canvas.moveTo(ToFixedPoint(rtCenter.Right), top);
        this.Canvas.lineTo(ToFixedPoint(rtCenter.Right), bottom);

        //左边
        var aryData=this.Column.Left;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData))
        {
            var xRight=rtCenter.Left;
            for(var j=aryData.length-1; j>=1; --j)
            {
                var columnItem=aryData[j];
                var rtItem={ Right:xRight, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                rtItem.Left=rtItem.Right-rtItem.Width;

                this.Canvas.moveTo(ToFixedPoint(rtItem.Left), top);
                this.Canvas.lineTo(ToFixedPoint(rtItem.Left), bottom);

                xRight=rtItem.Left;
            }
        }

        //右边
        var aryData=this.Column.Right;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData))
        {
            var xLeft=rtCenter.Right;
            for(var j=0; j<aryData.length-1; ++j)
            {
                var columnItem=aryData[j];
                var rtItem={ Left:xLeft, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                rtItem.Right=rtItem.Left+rtItem.Width;

                this.Canvas.moveTo(ToFixedPoint(rtItem.Right), top);
                this.Canvas.lineTo(ToFixedPoint(rtItem.Right), bottom);

                xLeft=rtItem.Right;
            }
        }
        

        this.Canvas.stroke();
    }

    DrawRowItemBG(rtItem, columnItem, data, cellInfo)
    {
        if (data.BGColor)
        {
            this.Canvas.fillStyle=data.BGColor;
            this.Canvas.fillRect(rtItem.Left,rtItem.Top, rtItem.Width, rtItem.Height);
        }
    }

    //单元格背景颜色
    DrawBodyBG()
    {
        var drawSelectedInfo=null, drawMoveOnInfo=null;
        this.DrawBody( (rtItem, columnItem, data, cellInfo)=>
        {
            this.DrawRowItemBG(rtItem, columnItem, data, cellInfo);
            if (this.SelectedData && this.SelectedData.Enable && this.SelectedData.Data)
            {
                var selData=this.SelectedData.Data;
                if (selData && selData.ColIndex==cellInfo.ColIndex && selData.Price==cellInfo.Price && selData.Type==cellInfo.Type)
                {
                    drawSelectedInfo={ Rect:rtItem, Column:columnItem, Data:data, CellInfo:cellInfo };
                }
            }

            if (this.MoveOnData && this.MoveOnData.Enable && this.MoveOnData.Data)
            {
                var selData=this.MoveOnData.Data;
                if (selData && selData.ColIndex==cellInfo.ColIndex && selData.Price==cellInfo.Price && selData.Type==cellInfo.Type)
                {
                    drawMoveOnInfo={ Rect:rtItem, Column:columnItem, Data:data, CellInfo:cellInfo };
                }
            }
        });

        if (drawSelectedInfo)
        {
            var rtItem=drawSelectedInfo.Rect;
            this.Canvas.fillStyle=this.SelectedConfig.BGColor;
            this.Canvas.fillRect(rtItem.Left+1,rtItem.Top+1, rtItem.Width-2, rtItem.Height-2);
        }

        if (drawMoveOnInfo)
        {
            var pixelTatio = GetDevicePixelRatio();
            var config=this.MoveOnConfig;
            var rtItem=drawMoveOnInfo.Rect;
            var column=drawMoveOnInfo.Column;
            var lineColor=config.LineColor;
            var lineWidth=config.LineWidth;
            if (column.MoveOn)
            {
                var config=column.MoveOn;
                if (config.LineColor) lineColor=config.LineColor;
                if (IFrameSplitOperator.IsNumber(config.LineColorID)) lineColor=this.GetColorByID(config.LineColorID);
                if (IFrameSplitOperator.IsNumber(config.LineWidth)) lineWidth=config.LineWidth;
            }
            
            this.Canvas.save();
            if (IFrameSplitOperator.IsNumber(lineWidth)) this.Canvas.lineWidth=lineWidth;
            this.Canvas.strokeStyle=lineColor;
            this.Canvas.beginPath();
            this.Canvas.rect(ToFixedRect(rtItem.Left),ToFixedRect(rtItem.Top),ToFixedRect(rtItem.Width),ToFixedRect(rtItem.Height));
            this.Canvas.stroke();
            this.Canvas.restore();
        }
       
        return true;
    }

   
    //绘制表格
    DrawBody(drawItemCallback)
    {
        if (!this.Data) return;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return;

        this.Canvas.font=this.ItemFont;
        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left+this.HeaderMargin.Left;
        var dataCount=this.Data.Data.length;
        var index=this.Data.DataOffset;
        var selectedRowData=null;

        var clientWidth=this.RectClient.Right-this.RectClient.Left;
        var tableWidth=this.RectClient.TableWidth;
        var xCenter=this.RectClient.Left+clientWidth/2;
        var yTop=this.RectClient.Top+this.HeaderHeight;

        for(var i=0; i<this.RowCount && index<dataCount; ++i,++index)
        {
            var columnItem=this.Column.Center;
            var rtCenter={ Top:yTop, Height:this.RowHeight, Left:xCenter-columnItem.Width/2, Width:columnItem.Width };
            rtCenter.Bottom=rtCenter.Top+rtCenter.Height;
            rtCenter.Right=rtCenter.Left+columnItem.Width;
            var item=this.Data.Data[index];
           
            //价格
            var drawInfo={ Color:"rgb(100,10,0)"};
            this.FormatCenterItem(columnItem, item, drawInfo);
            var cellInfo={ RowIndex:i, ColIndex:0, Type:0, Price:item.Price };
            if (drawItemCallback) 
            {
                drawItemCallback(rtCenter, columnItem, drawInfo, cellInfo );
            }
            else 
            {
                this.DrawRowItem(rtCenter, columnItem, drawInfo, cellInfo);
                this.MapDrawPrice.set(item.Price, item);
            }

            //左边
            var aryData=this.Column.Left;
            if (IFrameSplitOperator.IsNonEmptyArray(aryData))
            {
                var xRight=rtCenter.Left;
                for(var j=aryData.length-1; j>=0; --j)
                {
                    var columnItem=aryData[j];
                    var rtItem={ Right:xRight, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                    rtItem.Left=rtItem.Right-rtItem.Width;

                    var drawInfo={ Color:columnItem.TextColor };
                    if (this.IsReserveNumber(columnItem.Type))
                    {
                        this.FormatReserveNumber(columnItem, item, drawInfo);
                    }
                    
                    var cellInfo={ RowIndex:i, ColIndex:j, Type:1, Price:item.Price };
                    if (drawItemCallback) 
                    {
                        drawItemCallback(rtItem, columnItem, drawInfo, cellInfo);
                    }
                    else 
                    {
                        this.DrawRowItem(rtItem, columnItem, drawInfo, cellInfo);
                        this.AryCellRect.push({ Rect:rtItem, CellInfo:cellInfo, Price:item.Price, Data:drawInfo.Data });
                    }
                    xRight=rtItem.Left;
                }
            }

            //右边
            var aryData=this.Column.Right;
            if (IFrameSplitOperator.IsNonEmptyArray(aryData))
            {
                var xLeft=rtCenter.Right;
                for(var j=0; j<aryData.length; ++j)
                {
                    var columnItem=aryData[j];
                    var rtItem={ Left:xLeft, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                    rtItem.Right=rtItem.Left+rtItem.Width;

                    var drawInfo={ Color:columnItem.TextColor };
                    if (this.IsReserveNumber(columnItem.Type))
                    {
                        this.FormatReserveNumber(columnItem, item, drawInfo);
                    }
                    
                    var cellInfo={ RowIndex:i, ColIndex:j, Type:2, Price:item.Price };
                    if (drawItemCallback) 
                    {
                        drawItemCallback(rtItem, columnItem, drawInfo, cellInfo);
                    }
                    else 
                    {
                        this.DrawRowItem(rtItem, columnItem, drawInfo, cellInfo);
                        this.AryCellRect.push({ Rect:rtItem, CellInfo:cellInfo, Price:item.Price, Data:drawInfo.Data });
                    }

                    xLeft=rtItem.Right;
                }
            }

            yTop+=this.RowHeight;
        }
    }


    GetPriceColor(price)
    {
        var config=this.PriceConfig;

        if (!this.Data || !IFrameSplitOperator.IsNumber(this.Data.BasePrice) || !IFrameSplitOperator.IsNumber(price)) return config.Unchange;

        if (price>this.Data.BasePrice) return config.Up;
        else if (price<this.Data.BasePrice) return config.Down;
        else return config.Unchange
    }

    FormatCenterItem(column, data, drawInfo)
    {
        var config=this.GetPriceColor(data.Price);
        if (config)
        {
            if (config.Color) drawInfo.Color=config.Color;
            if (IFrameSplitOperator.IsNumber(config.ColorID)) drawInfo.Color=this.GetColorByID(config.ColorID);
        }

        if (data.Color) drawInfo.Color=data.Color;
        if (data.BGColor) drawInfo.BGColor=data.BGColor;
        if (IFrameSplitOperator.IsNumber(data.ColorID)) drawInfo.Color=this.GetColorByID(data.ColorID);
        if (IFrameSplitOperator.IsNumber(data.BGColorID)) drawInfo.BGColor=this.GetColorByID(data.BGColorID);

        if (data.Text) drawInfo.Text=data.Text;
        else if (IFrameSplitOperator.IsNumber(data.Price)) drawInfo.Text=`${data.Price.toFixed(this.Decimal)}`;
    }

    DrawRowItem(rtItem, columnItem, data, cellInfo)
    {
        var x=rtItem.Left+this.ItemMargin.Left;
        var y=rtItem.Bottom-this.ItemMargin.Bottom;
        if (columnItem.TextAlign=='center')
        {
            x=rtItem.Left+columnItem.Width/2;
            this.Canvas.textAlign="center";
        }
        else if (columnItem.TextAlign=='right')
        {
            x=rtItem.Right-this.ItemMargin.Right;
            this.Canvas.textAlign="right";
        }
        else
        {
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="bottom";
        if (data.Color) this.Canvas.fillStyle=data.Color;
        if (data.Text) this.Canvas.fillText(data.Text, x, y);
    }

    FormatReserveNumber(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_ORDER_COLUMN_FIELD.get(column.Type);
        if (!data || !data.Data || !fieldName) return;

        var item=data.Data[fieldName];
        if (!IFrameSplitOperator.IsObject(item)) return;

        drawInfo.Data=item;

        if (item.Color) drawInfo.Color=item.Color;
        if (item.BGColor) drawInfo.BGColor=item.BGColor;
        if (IFrameSplitOperator.IsNumber(item.ColorID)) drawInfo.Color=this.GetColorByID(item.ColorID);
        if (IFrameSplitOperator.IsNumber(item.BGColorID)) drawInfo.BGColor=this.GetColorByID(item.BGColorID);

        if (item.Text) 
        {
            drawInfo.Text=item.Text;
        }
        else if (IFrameSplitOperator.IsNumber(item.Value))
        {
            var dec=2;
            if (IFrameSplitOperator.IsNumber(column.FloatPrecision)) dec=column.FloatPrecision;
            var value=item.Value;
            var text=value.toFixed(dec);
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

            if (column.StringFormat && text) text=column.StringFormat.replace("{0}", text);

            drawInfo.Text=text;
        }
    }

    FormatReserveString(column, data, drawInfo)
    {
        if (column.DefaultText) drawInfo.Text=column.DefaultText;

        var fieldName=MAP_DEAL_COLUMN_FIELD.get(column.Type);
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

        if (item && item.Tooltip && IFrameSplitOperator.IsNonEmptyArray(item.Tooltip.AryText))
        {
            drawInfo.Tooltip=
            { 
                Type:2, 
                Data:{ AryText:item.Tooltip.AryText }
            }
        }
    }


    DrawResetButton()
    {
        var pixelRatio=GetDevicePixelRatio();
        var config=this.FooterConfig.ResetButton;
        var margin=this.FooterConfig.Margin;
        var iconSize=config.Icon.Size*pixelRatio;

        var clientWidth=this.RectClient.Right-this.RectClient.Left;
        var tableWidth=this.RectClient.TableWidth;
        var xCenter=this.RectClient.Left+clientWidth/2;
        var yCenter=this.RectClient.Bottom-this.FooterHeight+margin.Top+(this.FooterHeight-margin.Top-margin.Bottom)/2;

        var rtIcon={ Left:xCenter-iconSize/2, Top:yCenter-iconSize/2, Width:iconSize, Height:iconSize };
        rtIcon.Right=rtIcon.Left+rtIcon.Width;
        rtIcon.Bottom=rtIcon.Top+rtIcon.Height;

        var bgColor=null;
        if (this.MoveOnData && this.MoveOnData.Data && this.MoveOnData.Data.Type==10)
        {
            if (config.MoveOnColor) bgColor=config.MoveOnColor;
        }
        else if (config.BGColor)    //背景
        {
            bgColor=config.BGColor;
        }

        if (bgColor)
        {
            var btnSize=config.Size*pixelRatio;
            var rtButton={ Left:xCenter-btnSize/2, Top:yCenter-btnSize/2, Width:btnSize, Height:btnSize };
            rtButton.Right=rtButton.Left+rtButton.Width;
            rtButton.Bottom=rtButton.Top+rtButton.Height;
            this.Canvas.fillStyle=bgColor;
            this.Canvas.fillRect(rtButton.Left,rtButton.Top, rtButton.Width, rtButton.Height);
        }
        
        var bEnable=false;
        var text=config.Icon.LockedText;
        if (this.GotoBasePageConfig && this.GotoBasePageConfig.Locked===false)
        {
            bEnable=true;
            text=config.Icon.Text;
            //进度
            if (config.ArcColor)
            {
                var value=this.GetGotoBasePageProgress();
                if (value>=0)
                {
                    // 起始角度、结束角度（角度值）
                    const startAngle = -90;
                    const endAngle = startAngle+value*360;

                    // 转弧度
                    const startRad = Math.PI / 180 * startAngle;
                    const endRad = Math.PI / 180 * endAngle;

                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xCenter, yCenter);        // 移动到圆心
                    this.Canvas.arc(xCenter, yCenter,config.Size*pixelRatio/2, startRad, endRad); // 画圆弧
                    this.Canvas.closePath();           // 闭合路径（自动连回圆心）
                    this.Canvas.fillStyle=config.ArcColor;
                    this.Canvas.fill();
                }
            }
        }

        //图标
        var font=`${iconSize}px ${config.Icon.Family}`;
        this.Canvas.font=font;
        this.Canvas.textBaseline="bottom";
        this.Canvas.textAlign="left";
        this.Canvas.fillStyle=config.Icon.Color;
        this.Canvas.fillText(text,rtIcon.Left,rtIcon.Bottom);

        var cellInfo={ Type:10 };
        this.AryFooterRect.push({ Rect:rtIcon, CellInfo:cellInfo , Data:{ Enable:bEnable } });
    }

    GetGotoBasePageProgress()
    {
        var config=this.GotoBasePageConfig;
        if (!config) return -1;
        if (config.Timer==null) return -1;
        if (!config.StartTime) return -1;

        var maxValue=config.Frequency;
        var nowTime=new Date();
        var diff=nowTime-config.StartTime;

        var value=diff/config.Frequency;
        return value;
    }

    DrawFooter()
    {
        if (!this.IsShowFooter) return;

        this.DrawResetButton();
        this.DrawFooterBody();
    }


    DrawFooterBody()
    {
        if (!this.Data || !this.Data.FooterData) return;

        var clientWidth=this.RectClient.Right-this.RectClient.Left;
        var tableWidth=this.RectClient.TableWidth;
        var xCenter=this.RectClient.Left+clientWidth/2;

        var margin=this.FooterConfig.Margin;
        var columnItem=this.Column.Center;
        var rtCenter={ Bottom:this.RectClient.Bottom-margin.Bottom, Height:this.FooterHeight-(margin.Top+margin.Bottom), Left:xCenter-columnItem.Width/2, Width:columnItem.Width };
        rtCenter.Top=rtCenter.Bottom-rtCenter.Height;
        rtCenter.Right=rtCenter.Left+columnItem.Width;

        this.Canvas.font=this.FooterFont;

        var item=this.Data.FooterData;
        //左边
        var aryData=this.Column.Left;
        var aryLeftData=item.Left;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData) && IFrameSplitOperator.IsNonEmptyArray(aryLeftData))
        {
            var xRight=rtCenter.Left;
            for(var j=aryData.length-1; j>=0; --j)
            {
                var columnItem=aryData[j];
                var rtItem={ Right:xRight, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                rtItem.Left=rtItem.Right-rtItem.Width;

                var drawInfo={ };
                
                this.FormatFooterCell(columnItem, aryLeftData[j], drawInfo);
                if (drawInfo.BGColor)
                {
                    this.Canvas.fillStyle=drawInfo.BGColor;
                    this.Canvas.fillRect(rtItem.Left,rtItem.Top, rtItem.Width, rtItem.Height);
                }
                

                var cellInfo={ RowIndex:0, ColIndex:j, Type:3 };
                this.DrawFooterItem(rtItem, columnItem, drawInfo, cellInfo);
                //this.AryCellRect.push({ Rect:rtItem, CellInfo:cellInfo, Price:item.Price, Data:drawInfo.Data });
                
                xRight=rtItem.Left;
            }
        }

        //右边
        var aryData=this.Column.Right;
        var aryRightData=item.Right;
        if (IFrameSplitOperator.IsNonEmptyArray(aryData) && IFrameSplitOperator.IsNonEmptyArray(aryRightData))
        {
            var xLeft=rtCenter.Right;
            for(var j=0; j<aryData.length; ++j)
            {
                var columnItem=aryData[j];
                var rtItem={ Left:xLeft, Width:columnItem.Width, Top:rtCenter.Top, Bottom:rtCenter.Bottom, Height:rtCenter.Height };
                rtItem.Right=rtItem.Left+rtItem.Width;

                var drawInfo={ };
                this.FormatFooterCell(columnItem, aryRightData[j], drawInfo);
                if (drawInfo.BGColor)
                {
                    this.Canvas.fillStyle=drawInfo.BGColor;
                    this.Canvas.fillRect(rtItem.Left,rtItem.Top, rtItem.Width, rtItem.Height);
                }

                var cellInfo={ RowIndex:0, ColIndex:j, Type:4 };
                this.DrawFooterItem(rtItem, columnItem, drawInfo, cellInfo);
                //this.AryCellRect.push({ Rect:rtItem, CellInfo:cellInfo, Price:item.Price, Data:drawInfo.Data });

                xLeft=rtItem.Right;
            }
        }

    }

    FormatFooterCell(column, item, drawInfo)
    {
        if (!item) return;

        if (item.BGColor) drawInfo.BGColor=item.BGColor;
        if (item.Color) drawInfo.Color=item.Color;
        if (item.BGColor) drawInfo.BGColor=item.BGColor;
        if (IFrameSplitOperator.IsNumber(item.ColorID)) drawInfo.Color=this.GetColorByID(item.ColorID);
        if (IFrameSplitOperator.IsNumber(item.BGColorID)) drawInfo.BGColor=this.GetColorByID(item.BGColorID);
        if (item.Text) drawInfo.Text=item.Text;
    }

    DrawFooterItem(rtItem, columnItem, data, cellInfo)
    {
        var itemMargin=this.FooterConfig.ItemMargin;
        var x=rtItem.Left+itemMargin.Left;
        var y=rtItem.Bottom-itemMargin.Bottom;
        var textAlign="center";
        if (data.TextAlign) textAlign=data.TextAlign;

        if (textAlign=='center')
        {
            x=rtItem.Left+columnItem.Width/2;
            this.Canvas.textAlign="center";
        }
        else if (textAlign=='right')
        {
            x=rtItem.Right-itemMargin.Right;
            this.Canvas.textAlign="right";
        }
        else
        {
            this.Canvas.textAlign="left";
        }

        this.Canvas.textBaseline="bottom";
        if (data.Color) this.Canvas.fillStyle=data.Color;
        if (data.Text) this.Canvas.fillText(data.Text, x, y);
    }

 
    GetFontHeight(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    OnMouseDown(x,y,e)    //Type: 1=行
    {
        if (!this.Data) return null;

        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};
        var uiElement;
        if (this.UIElement) uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else uiElement={Left:null, Top:null};

        var cell=this.PtInCell(x,y);
        if (cell)
        {
            var bRedraw=true;
            var cellInfo=cell.CellInfo;
            var selData=this.SelectedData.Data;
            if (selData && selData.ColIndex==cellInfo.ColIndex && selData.Price==cell.Price && selData.Type==cellInfo.Type)
            {
                bRedraw=false;
            }
            else
            {
                this.SelectedData.Data={ ColIndex:cellInfo.ColIndex, Price:cell.Price, Type:cellInfo.Type };
            }

            var eventID=JSCHART_EVENT_ID.ON_CLICK_ORDER_CELL;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_ORDER_CELL;

            this.SendClickEvent(eventID, { Data:cell, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement });

            return { Type:cellInfo.Type, Redraw:bRedraw, Data:cell };
        }

        cell=this.PtInResetButton(x,y);
        if (cell)
        {
            var cellInfo=cell.CellInfo;
            
            return { Type:cellInfo.Type, Redraw:true, Data:cell };
        }

        return null;
    }

    OnDblClick(x,y,e)
    {
        if (!this.Data) return false;

        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};
        var uiElement;
        if (this.UIElement) uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else uiElement={Left:null, Top:null};

        var cell=this.PtInCell(x,y);
        if (cell)
        {
            this.SendClickEvent(JSCHART_EVENT_ID.ON_DBCLICK_ORDER_ROW, { Data:cell, X:x, Y:y, e:e, Inside:insidePoint, UIElement:uiElement } );
            return true;
        }

        return false;
    }

    PtInCell(x,y)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryCellRect)) return null;

        for(var i=0;i<this.AryCellRect.length;++i)
        {
            var item=this.AryCellRect[i];
            var rtRow=item.Rect;
            if (x>=rtRow.Left && x<=rtRow.Right && y>=rtRow.Top && y<=rtRow.Bottom)
            {
                var data={ Rect:rtRow, CellInfo:item.CellInfo, Data:item.Data, Price:item.Price };
                return data;
            }
        }

        return null;
    }

    PtInResetButton(x,y)
    {
        if (!this.IsShowFooter) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryFooterRect)) return null;

        for(var i=0;i<this.AryFooterRect.length;++i)
        {
            var item=this.AryFooterRect[i];
            var rt=item.Rect;
            if (x>=rt.Left && x<=rt.Right && y>=rt.Top && y<=rt.Bottom)
            {
                return { Rect:rt, CellInfo:item.CellInfo, Data:item.Data };
            }
        }

        return null;
    }

    PtInCenter(x,y)
    {
        if (!this.RectCenter) return null;

        if (x>=this.RectCenter.Left && x<=this.RectCenter.Right && y>=this.RectCenter.Top && y<=this.RectCenter.Bottom)
        {
            return { Rect:this.RectCenter };
        }

        return null;
    }

    SendClickEvent(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
    }

    IsReserveString(value)
    {
        var ARARY_TYPE=
        [
            ORDER_COLUMN_ID.RESERVE_STRING1_ID,ORDER_COLUMN_ID.RESERVE_STRING2_ID,ORDER_COLUMN_ID.RESERVE_STRING3_ID,ORDER_COLUMN_ID.RESERVE_STRING4_ID,
            ORDER_COLUMN_ID.RESERVE_STRING5_ID,ORDER_COLUMN_ID.RESERVE_STRING6_ID,ORDER_COLUMN_ID.RESERVE_STRING7_ID,ORDER_COLUMN_ID.RESERVE_STRING8_ID,
            ORDER_COLUMN_ID.RESERVE_STRING9_ID,ORDER_COLUMN_ID.RESERVE_STRING10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

    IsReserveNumber(value)
    {
        var ARARY_TYPE=
        [
            ORDER_COLUMN_ID.RESERVE_NUMBER1_ID,ORDER_COLUMN_ID.RESERVE_NUMBER2_ID,ORDER_COLUMN_ID.RESERVE_NUMBER3_ID,
            ORDER_COLUMN_ID.RESERVE_NUMBER4_ID,ORDER_COLUMN_ID.RESERVE_NUMBER5_ID,ORDER_COLUMN_ID.RESERVE_NUMBER6_ID,ORDER_COLUMN_ID.RESERVE_NUMBER7_ID,
            ORDER_COLUMN_ID.RESERVE_NUMBER8_ID,ORDER_COLUMN_ID.RESERVE_NUMBER9_ID,ORDER_COLUMN_ID.RESERVE_NUMBER10_ID
        ];

        return ARARY_TYPE.includes(value);
    }

    OnMouseOn(x,y,e)
    {
        if (!this.Data) return null;

        var pixelTatio = GetDevicePixelRatio();
        var insidePoint={X:x/pixelTatio, Y:y/pixelTatio};
        var uiElement;
        if (this.UIElement) uiElement={Left:this.UIElement.getBoundingClientRect().left, Top:this.UIElement.getBoundingClientRect().top};
        else uiElement={Left:null, Top:null};

        var bDraw=false;
        var cell=this.PtInCell(x,y);
        if (cell)
        {
            var cellInfo=cell.CellInfo;
            var selData=this.MoveOnData.Data;
            if (selData && selData.ColIndex==cellInfo.ColIndex && selData.Price==cell.Price && selData.Type==cellInfo.Type)
            {
                bDraw=false;
            }
            else
            {
                this.MoveOnData.Data={ ColIndex:cellInfo.ColIndex, Price:cell.Price, Type:cellInfo.Type };
                bDraw=true;
            }
            return { Redraw:bDraw, Cell:cell }
        }

        var cell=this.PtInResetButton(x,y);
        if (cell)
        {
            var cellInfo=cell.CellInfo;
            var selData=this.MoveOnData.Data;

            if (selData && selData.Type==cellInfo.Type)
            {
                bDraw=false;
            }
            else
            {
                this.MoveOnData.Data={ ColIndex:null, Price:null, Type:cellInfo.Type };
                bDraw=true;
            }
            return { Redraw:bDraw, Cell:cell }
        }

        if (this.MoveOnData.Data)
        {
            this.MoveOnData.Data=null;
            bDraw=true;
        }

        return { Redraw:bDraw, Cell:null }
    }

    GetTooltipData(x,y)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.TooltipRect)) return null;

        for(var i=0;i<this.TooltipRect.length;++i)
        {
            var item=this.TooltipRect[i];
            var rt=item.Rect;
            if (!rt) continue;

            if (x>=rt.Left && x<=rt.Right && y>=rt.Top && y<=rt.Bottom)
            {
                return { Rect:item.Rect, Data:item.Data, Column:item.Column, Index:item.Index, Type:item.Type, Data:item.Data };
            }
        }

        return null;
    }
}




