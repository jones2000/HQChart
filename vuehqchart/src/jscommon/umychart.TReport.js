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
        //画布大小通过div获取
        var height=parseInt(this.DivElement.style.height.replace("px",""));
        this.CanvasElement.height=height;
        this.CanvasElement.width=parseInt(this.DivElement.style.width.replace("px",""));
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

    this.IsDestroy=false;        //是否已经销毁了

    this.ChartDestory=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();
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

        /*
        this.UIElement.onmouseup=(e)=>{ this.UIOnMounseUp(e); }
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
        

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
        this.MapStockData=null;
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
        if (IFrameSplitOperator.IsNonEmptyArray(data.data))
        {
            this.MapExePriceData=new Map();
            this.MapStockData=new Map();
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
            var obj=
            {
                Name:'JSTReportChartContainer::RequestStockData', //类名::函数名
                Explain:'T型报价列表期权数据',
                Request:{ Data: { stocks: arySymbol, symbol:this.Symbol } }, 
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
        

        //实时数据排序
        var chart=this.ChartPaint[0];
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
                if (leftMaxPosition.Max==null || leftMaxPosition.Max<rightData.Position) 
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

    this.GetTReportChart=function()
    {
        var chart=this.ChartPaint[0];
        return chart;
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
            var result=this.MoveSelectedRow(1)
            if (result)
            {
                if (result.Redraw) this.Draw();
                if (result.Update) this.DelayUpdateStockData();
            }
        }
        else if (wheelValue>0)  //上
        {
            var result=this.MoveSelectedRow(-1);
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
                var result=this.MoveSelectedRow(-1);
                if (result)
                {
                    if (result.Redraw) this.Draw();
                    if (result.Update) this.DelayUpdateStockData();
                }
                break;
            case 40:    //down
                var result=this.MoveSelectedRow(1)
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

    this.MoveSelectedRow=function(step)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

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
        
        if (step>0)
        {
            if (selectedIndex<0 || selectedIndex<pageStatus.Start || selectedIndex>pageStatus.End)
            {
                chart.SelectedRow={ ExePrice:this.Data.Data[pageStatus.Start], CellType:cellType };
                result.Redraw=true;
                return result;
            }

            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
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

            return result;
        }
        else if (step<0)
        {
            if (selectedIndex<0 || selectedIndex<pageStatus.Start || selectedIndex>pageStatus.End)
            {
                chart.SelectedRow={ ExePrice:this.Data.Data[pageStatus.End], CellType:cellType };
                result.Redraw=true;
                return result;
            }

            step=Math.abs(step);
            var offset=this.Data.YOffset;
            for(var i=0;i<step;++i)
            {
                --selectedIndex;
                if (selectedIndex<pageStatus.Start) --offset;

                if (selectedIndex<0)
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
    
    CUSTOM_STRING_TEXT_ID:100,      //自定义字符串文本
    CUSTOM_NUMBER_TEXT_ID:101,      //自定义数值型
    CUSTOM_DATETIME_TEXT_ID:102,    //自定义日期类型
    CUSTOM_ICON_ID:103,             //自定义图标
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

        this.RowHeight=this.GetFontHeight(this.ItemFont,"擎")+ this.ItemMergin.Top+ this.ItemMergin.Bottom;

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
        
        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top-this.HeaderHeight)/this.RowHeight);

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

        var textTop=top;
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

    this.DrawRow=function(exePrice, top, dataIndex)
    {
        var rtCenterItem=this.GetCenterItemRect();
        
        var xLeft=rtCenterItem.Left;    //左边
        var xRight=rtCenterItem.Right;  //右边

        var reportleft=this.RectClient.Left;
        var reportRight=this.RectClient.Right;

        var data= { ExePrice:exePrice , TData:null, Decimal:2 };
        if (this.GetExePriceDataCallback) data.TData=this.GetExePriceDataCallback(exePrice);
        if (this.GetFlashBGDataCallback && data.TData) 
        {
            if (data.TData.LeftData)    //左侧
            {
                var item=data.TData.LeftData;
                data.TData.LeftFlashBG=this.GetFlashBGDataCallback(item.Symbol, Date.now());
                data.Decimal=JSTReportChart.GetfloatPrecision(item.Symbol);
            }

            if (data.TData.RightData)   //右侧
            {
                var item=data.TData.RightData;
                data.TData.RightFlashBG=this.GetFlashBGDataCallback(item.Symbol, Date.now());
                data.Decimal=JSTReportChart.GetfloatPrecision(item.Symbol);
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

    this.DrawCenterItem=function(index, data, column, rtItem, cellType) //cellType 0=中间字段 1=左侧 2=右侧
    {
        //tooltip提示
        if (column.EnableTooltip===true)  this.TooltipRect.push({ Rect:rtItem, data:data, Index:index, Column:column, CellType:cellType });

        var rtText={ Left:rtItem.Left+this.ItemMergin.Left, Right:rtItem.Right-this.ItemMergin.Right, Top:rtItem.Top+this.ItemMergin.Top, Bottom:rtItem.Bottom-this.ItemMergin.Bottom };
        rtText.Width=rtText.Right-rtText.Left;
        rtText.Height=rtText.Bottom-rtText.Top;

        var drawInfo={ Text:null, TextColor:this.CenterItemConfig.TextColor, BGColor:this.CenterItemConfig.BGColor, TextAlign:column.TextAlign, Rect:rtItem, RectText:rtText };
        drawInfo.Text=`${data.ExePrice.toFixed(data.Decimal)}`;

        this.DrawCell(drawInfo);
    }

    this.DrawItem=function(index, exePriceData, data, column, rtItem, cellType)
    {
        if (column.EnableTooltip===true)  this.TooltipRect.push({ Rect:rtItem, data:data, Index:index, Column:column, CellType:cellType });

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

                default:
                    drawInfo.Text=`-----`;
            }

            this.GetMarkBorderData(drawInfo, exePriceData.ExePrice, column.Type, cellType);
            this.GetFlashBGData(drawInfo, exePriceData, column.Type, cellType);
        }

        this.DrawCell(drawInfo, exePriceData, column.Type, cellType);
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

    this.DrawCell=function(drawInfo)
    {
        var rtText=drawInfo.RectText;
        var yCenter=rtText.Top+(rtText.Height/2);

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

    this.PtInBody=function(x,y)
    {
        if (!this.Data) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return null;

        var top=this.RectClient.Top+this.HeaderHeight;
        var left=this.RectClient.Left;
        var right=this.RectClient.Right;

        var textTop=top;
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


