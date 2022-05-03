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

        if (option.Symbol) chart.Symbol=option.Symbol;
        if (option.Name) chart.Name=option.Name;

        var requestOption={ Callback:null };
        if (chart.Symbol) requestOption.Callback=function(){ chart.RequestMemberListData(); };

        chart.RequestStockListData(requestOption);   //下载码表     
    }

    this.CreateJSReportChartContainer=function(option)
    {
        var chart=new JSReportChartContainer(this.CanvasElement);
        chart.Create(option);

        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;
        if (IFrameSplitOperator.IsNonEmptyArray(option.Column))  chart.SetColumn(option.Column);
        if (IFrameSplitOperator.IsNonEmptyArray(option.Tab)) chart.SetTab(option.Tab);
        if (IFrameSplitOperator.IsNumber(option.TabSelected)) chart.SetSelectedTab(option.TabSelected);

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
}


JSReportChart.Init=function(divElement)
{
    var jsChartControl=new JSReportChart(divElement);
    jsChartControl.OnSize();

    return jsChartControl;
}

function HQReportItem()
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

    this.ExtendData;    //扩展数据
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
    this.ShowCanvas=null;

    this.Symbol;    //板块代码
    this.Name;      //板块名称
    this.NetworkFilter;                                 //数据回调接口
    this.Data={ XOffset:0, YOffset:0, Data:[] };        //股票列表
    this.SourceData={ Data:[] } ; //原始股票顺序
    this.MapStockData=new Map();                        //原始股票数据

    this.SortInfo={ Field:-1, Sort:0 };                //排序信息 {Field:排序字段id, Sort:0 不排序 1升序 2降序 }

    //事件回调
    this.mapEvent=new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}

    this.AutoUpdateTimer=null;
    this.AutoUpdateFrequency=15000;             //15秒更新一次数据

    this.DelayUpdateTimer=null;     //延迟更新
    this.DelayUpdateFrequency=500;  //延迟更新时间
    
    this.UIElement=uielement;
    this.LastPoint=new Point();     //鼠标位置

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
        chart.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        chart.GetStockDataCallback=(symbol)=>{ return this.GetStockData(symbol);}
        chart.Data=this.Data;
        chart.SortInfo=this.SortInfo;
        chart.Tab=new ChartReportTab();
        chart.Tab.Frame=this.Frame;
        chart.Tab.Canvas=this.Canvas;
        chart.Tab.ChartBorder=this.Frame.ChartBorder;
        chart.Tab.Report=chart;
        this.ChartPaint[0]=chart;

        if (option)
        {
            if (IFrameSplitOperator.IsBool(option.IsSingleTable)) chart.IsSingleTable=option.IsSingleTable;  //单表模式
            if (IFrameSplitOperator.IsBool(option.IsShowHeader)) chart.IsShowHeader=option.IsShowHeader;    //是否显示表头
            if (IFrameSplitOperator.IsNumber(option.FixedColumn)) chart.FixedColumn=option.FixedColumn;     //固定列

            if (IFrameSplitOperator.IsNumber(option.BorderLine)) this.Frame.BorderLine=option.BorderLine;   //边框
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
        this.UIElement.oncontextmenu=(e)=> { this.UIOnContextMenu(e); }
        this.UIElement.onmousemove=(e)=>{ this.UIOnMouseMove(e);}
        this.UIElement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        this.UIElement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
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


    this.ResetReportStatus=function()
    {
        this.Data.XOffset=0;
        this.Data.YOffset=0;
    }

    this.ResetReportSelectStatus=function()
    {
        var chart=this.GetReportChart();
        if (chart) chart.SelectedRow=-1;
    }

    this.ClearData=function()
    {
        this.SourceData.Data=[];
        this.Data.Data=[];
    }

    this.ResetSortStatus=function()
    {
        this.SortInfo.Field=-1;
        this.SortInfo.Sort=0;
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
        }

        this.RequestMemberListData();
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
            this.NetworkFilter(obj, function(data) 
            { 
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvMemberListData(data);
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }

        throw { Name:'JSReportChartContainer::RequestMemberListData', Error:'(板块成分数据)不提供内置测试数据' };
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

        this.Draw();
        this.UpdateStockData();
    }

    this.AutoUpdateEvent=function(bStart, explain)          //自定更新事件, 是给websocket使用
    {
        var eventID=bStart ? JSCHART_EVENT_ID.RECV_START_AUTOUPDATE:JSCHART_EVENT_ID.RECV_STOP_AUTOUPDATE;
        if (!this.mapEvent.has(eventID)) return;

        var self=this;
        var event=this.mapEvent.get(eventID);
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

        throw { Name:'JSReportChartContainer::RequestStockListData', Error:'(码表数据)不提供内置测试数据' };
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
                    this.MapStockData.set(symbol, stock);
                }

                stock.Symbol=this.GetSymbolNoSuffix(symbol);
                stock.Name=item[1];
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

    //获取个股数据
    this.GetStockData=function(symbol)
    {
        if (!this.MapStockData) return null;
        if (!this.MapStockData.has(symbol)) return null;
        
        return this.MapStockData.get(symbol);
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
                Request:{ Data: { stocks: arySymbol } }, 
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

        throw { Name:'JSReportChartContainer::RequestStockData', Error:'(报价列表股票数据)不提供内置测试数据' };
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
                    stock.Symbol=this.GetSymbolNoSuffix(symbol);
                    this.MapStockData.set(symbol, stock);
                }

                this.ReadStockJsonData(stock, item);

                if (!setUpdateSymbol.has(symbol)) setUpdateSymbol.add(symbol);
            }
        }

        var chart=this.ChartPaint[0];
        if (!chart) return;

        //更新的股票在当前页面,需要重绘
        var bUpdate=false;
        var aryStock=chart.ShowSymbol;
        for(var i=0;i<aryStock.length;++i)
        {
            if (setUpdateSymbol.has(aryStock[i].Symbol))
            {
                bUpdate=true;
                break;
            }
        }

        if (bUpdate) this.Draw();
    }

    //读取单条股票json数据
    this.ReadStockJsonData=function(stock, item)
    {
        //0=证券代码 1=股票名称 2=昨收 3=开 4=高 5=低 6=收 7=成交量 8=成交金额, 9=买价 10=买量 11=卖价 12=卖量 13=均价 14=流通股 15=总股本 16=涨停价 17=跌停价
        //18=内盘 19=外盘 20=现量

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

        if (item[30]) stock.ExtendData=item[30];    //30扩展数据
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
        this.AutoUpdateEvent(false,'JSDealChartContainer::StopAutoUpdate');
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
        var chart=this.ChartPaint[0];
        if (chart) chart.SizeChange=bChanged;
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

        if (wheelValue<0)   //下一页
        {
            if (this.GotoNextPage()) 
            {
                this.Draw();
                this.DelayUpdateStockData();
            }
        }
        else if (wheelValue>0)  //上一页
        {
            if (this.GotoPreviousPage()) 
            {
                this.Draw();
                this.DelayUpdateStockData();
            }
        }

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }

    this.OnKeyDown=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var keyID = e.keyCode ? e.keyCode :e.which;
        switch(keyID)
        {
            case 33:    //page up
                if (this.GotoPreviousPage()) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
                break;
            case 34:    //page down
                if (this.GotoNextPage()) 
                {
                    this.Draw();
                    this.DelayUpdateStockData();
                }
                break;
            case 38:    //up
                if (this.MoveSelectedRow(-1))
                {
                    this.Draw();
                }
                break;
            case 40:    //down
                if (this.MoveSelectedRow(1))
                {
                    this.Draw();
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

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        var chart=this.ChartPaint[0];
        if (chart) 
        {
            var clickData=chart.OnMouseDown(x,y,e);
            if (!clickData) return;
            if (e.button!=0) return;

            if (clickData.Type==2)  //点击行
            {
                if (clickData.Redraw==true)
                    this.Draw();
            }
            else if (clickData.Type==3) //表头
            {
                this.OnClickHeader(clickData, e);
            }
            else if (clickData.Type==1) //底部工具栏
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

        var tabChart=this.GetTabChart();
        if (tabChart)
        {
            var tabData=tabChart.PtInTab(x,y);
            if (tabData)
            {
                var index=tabData.Index;
                if (tabChart.MoveOnTabIndex!=index)
                {
                    tabChart.MoveOnTabIndex=index;
                    this.Draw();
                }
            }
        }

    }

    this.UIOnMounseOut=function(e)
    {
        var tabChart=this.GetTabChart();
        if (tabChart && tabChart.MoveOnTabIndex>=0)
        {
            tabChart.MoveOnTabIndex=-1;
            this.Draw();
        }
    }

    this.UIOnMouseleave=function(e)
    {
        var tabChart=this.GetTabChart();
        if (tabChart && tabChart.MoveOnTabIndex>=0)
        {
            tabChart.MoveOnTabIndex=-1;
            this.Draw();
        }
    }

    this.DocOnMouseMove=function(e)
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (this.DragXScroll)
        {
            var chart=this.ChartPaint[0];
            if (!chart || !chart.Tab) return;

            this.DragXScroll.LastMove.X=x;
            this.DragXScroll.LastMove.Y=y;
            var pos=chart.Tab.GetScrollPostionByPoint(x,y);
            if (this.SetXOffset(pos)) this.Draw();
        }
    }

    this.DocOnMouseUp=function(e)
    {
        //清空事件
        document.onmousemove=null;
        document.onmouseup=null;

        this.DragXScroll=null;
    }

    this.GetTabChart=function()
    {
        var chart=this.ChartPaint[0];
        if (!chart) return null;
        
        return chart.Tab;
    }

    this.GetReportChart=function()
    {
        var chart=this.ChartPaint[0];
        return chart;
    }

    this.GotoNextPage=function()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageSize=chart.GetPageSize();
        if (pageSize>this.Data.Data.length) return false;

        if (this.Data.YOffset+pageSize>=this.Data.Data.length) return false;

        this.Data.YOffset+=pageSize;
        var showDataCount=this.Data.Data.length-this.Data.YOffset;

        if (chart.SelectedModel==0)
        {
            if (chart.SelectedRow>showDataCount-1) chart.SelectedRow=showDataCount-1;
        }

        return true;
    }

    this.GotoPreviousPage=function()
    {
        if (!this.Data || !IFrameSplitOperator.IsNonEmptyArray(this.Data.Data)) return false;
        var chart=this.ChartPaint[0];
        if (!chart) return false;
        if (this.Data.YOffset<=0) return false;

        var pageSize=chart.GetPageSize();
        var offset=this.Data.YOffset;
        offset-=pageSize;
        if (offset<0) offset=0;
        this.Data.YOffset=offset;
        return true;
    }

    this.MoveSelectedRow=function(step)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return false;

        var pageSize=chart.GetPageSize();
        if (chart.SelectedModel==0)
        {
            var selected=chart.SelectedRow;
            if (step>0)
            {
                selected+=step;
                selected=selected%pageSize;
                chart.SelectedRow=selected;
                return true;
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
                return true;
            }
        }

        return false;
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

        if (option && option.Redraw)
        {
            this.SetSizeChange(true);
            this.Draw();
        }
    }

    //点表头
    this.OnClickHeader=function(clickData, e)
    {
        var header=clickData.Header;
        if (header.Column && (header.Column.Sort==1 || header.Column.Sort==2))
        {
            var index=header.Index;
            var sortInfo={Field:this.SortInfo.Field, Sort:this.SortInfo.Sort };
            if (sortInfo.Field!=index)
            {
                sortInfo.Field=index;
                sortInfo.Sort=1;
            }
            else
            {
                sortInfo.Sort=(this.SortInfo.Sort+1)%3;
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

    //点击标签
    this.OnClickTab=function(tabData, e)
    {
        if (!tabData.Tab) return;

        var redraw=false;
        var pixelTatio = GetDevicePixelRatio();
        var x = (e.clientX-this.UIElement.getBoundingClientRect().left)*pixelTatio;
        var y = (e.clientY-this.UIElement.getBoundingClientRect().top)*pixelTatio;

        if (tabData.Tab.IsMenu)
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CLICK_REPORT_TABMENU);
            if (event && event.Callback)
            {
                redraw=true;
                var rtItem=tabData.Rect;
                var rtDOM={ Left: rtItem.Left/pixelTatio, Right:rtItem.Right/pixelTatio, Top:rtItem.Top/pixelTatio, Bottom:rtItem.Bottom/pixelTatio };

                var sendData={ Data:tabData, IsSide:{X:x, Y:x}, Rect:rtDOM, e:e , Redraw:redraw };
                event.Callback(event, sendData, this);
                if (IFrameSplitOperator.IsBool(sendData.Redraw)) redraw=sendData.Redraw;
            }

            this.SetSelectedTab(tabData.Index); //选中tab
        }
        else
        {
            var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_CLICK_REPORT_TAB);
            if (event && event.Callback)
            {
                var sendData={ Data:tabData, IsSide:{X:x, Y:x}, e:e , Redraw:redraw };
                event.Callback(event, sendData, this);
                if (IFrameSplitOperator.IsBool(sendData.Redraw)) redraw=sendData.Redraw;
            }

            this.SetSelectedTab(tabData.Index);
        }

        if (redraw) this.Draw();
    }

    //本地排序
    this.LocalSort=function(left, right, column, sortType)
    {
        switch(column.Type)
        {
            case REPORT_COLUMN_ID.SYMBOL_ID:
            case REPORT_COLUMN_ID.NAME_ID:
                return this.LocalStringSort(left, right, column, sortType);
            default:
                return 0;
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

        if (column.Type==REPORT_COLUMN_ID.SYMBOL_ID)
        {
            if (leftStock && leftStock.Symbol) leftValue=leftStock.Symbol;
            if (rightStock && rightStock.Symbol) rightValue=rightStock.Symbol;
        }
        else if (column.Type==REPORT_COLUMN_ID.NAME_ID)
        {
            if (leftStock && leftStock.Name) leftValue=leftStock.Name;
            if (rightStock && rightStock.Name) rightValue=rightStock.Name;
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

    this.RequestStockSortData=function(column, filedid, sortType)
    {
        var chart=this.ChartPaint[0];
        if (!chart) return;

        var self=this;
        var startIndex=this.Data.YOffset;
        var pageSize=chart.GetPageSize();
        var endIndex=startIndex+pageSize+5;

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
                        range:{ start:startIndex, end:endIndex }, 
                        column:{ name: column.Title, type: column.Type, index:filedid }, 
                        sort:sortType, symbol:this.Symbol, name:this.Name,
                        pageSize:pageSize
                    } 
                }, 
                Self:this,
                PreventDefault:false
            };

            this.NetworkFilter(obj, function(data) 
            { 
                self.RecvStockSortData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;  
        }

        throw { Name:'JSReportChartContainer::RequestStockSortData', Error:'(报价列表股票排序数据)不提供内置测试数据' };
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

        var chart=this.ChartPaint[0];
        if (!chart) return;

        //更新的股票在当前页面,需要重绘
        var bUpdate=true;
        if (bUpdate) this.Draw();
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

    VOL_IN_ID:25,
    VOL_OUT_ID:26,

    CUSTOM_STRING_TEXT_ID:100,   //自定义字符串文本
    CUSTOM_NUMBER_TEXT_ID:101    //自定义数值型
}

function ChartReport()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.ClassName='ChartReport';       //类名
    this.IsDrawFirst=false;
    this.GetEventCallback;              //获取事件
    this.GetStockDataCallback;          //获取股票数据
    this.Data;                          //数据 { XOffset:0, YOffset:0, Data:['600000.sh', '000001.sz'] }
    this.SortInfo;                      //排序信息 {Field:排序字段id, Sort:0 不排序 1升序 2降序 }    
    this.FixedColumn=2;                 //固定列
    
    this.IsShowHeader=true;             //是否显示表头
    this.SizeChange=true;

    this.SelectedModel=0;               //选中模式 0=SelectedRow表示当前屏索引
    this.SelectedRow=-1;                 //选中行ID

    this.ShowSymbol=[];                 //显示的股票列表 { Index:序号(排序用), Symbol:股票代码 }

    this.Tab;

    //涨跌颜色
    this.UpColor=g_JSChartResource.Report.UpTextColor;
    this.DownColor=g_JSChartResource.Report.DownTextColor;
    this.UnchagneColor=g_JSChartResource.Report.UnchagneTextColor; 

    this.BorderColor=g_JSChartResource.Report.BorderColor;          //边框线
    this.SelectedColor=g_JSChartResource.Report.SelectedColor;      //选中行

    //表头配置
    this.HeaderFontConfig={ Size:g_JSChartResource.Report.Header.Font.Size, Name:g_JSChartResource.Report.Header.Font.Name };
    this.HeaderColor=g_JSChartResource.Report.Header.Color;
    this.SortColor=g_JSChartResource.Report.Header.SortColor;      //排序箭头颜色
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

    //缓存
    this.HeaderFont=12*GetDevicePixelRatio() +"px 微软雅黑";
    this.ItemFont=15*GetDevicePixelRatio() +"px 微软雅黑";
    this.RowCount=0;
    this.HeaderHeight=0;
    this.BottomToolbarHeight=30;  //底部工具条高度
    this.IsShowAllColumn=false;   //是否已显示所有列

    this.Column=    //{ Type:列id, Title:标题, TextAlign:文字对齐方式, MaxText:文字最大宽度 , TextColor:文字颜色, Sort:0=不支持排序 1=本地排序 0=远程排序 }
    [
        { Type:REPORT_COLUMN_ID.INDEX_ID, Title:"序号", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.Index, MaxText:"8888"},
        { Type:REPORT_COLUMN_ID.SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null,  TextColor:g_JSChartResource.DealList.FieldColor.Symbol, MaxText:"888888"},
        { Type:REPORT_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.Name, MaxText:"擎擎擎擎" },
        { Type:REPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88" },
    ];

    this.RectClient={};

    this.ReloadResource=function(resource)
    {
        this.UpColor=g_JSChartResource.Report.UpTextColor;
        this.DownColor=g_JSChartResource.Report.DownTextColor;
        this.UnchagneColor=g_JSChartResource.Report.UnchagneTextColor; 
    
        this.BorderColor=g_JSChartResource.Report.BorderColor;    //边框线

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
        this.ItemFontConfig={ Size:g_JSChartResource.Report.Row.Font.Size, Name:g_JSChartResource.Report.Row.Font.Name };
        this.RowMergin={ Top:g_JSChartResource.Report.Row.Mergin.Top, Bottom:g_JSChartResource.Report.Row.Mergin.Bottom };

        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (item.Type==REPORT_COLUMN_ID.INDEX_ID) 
                item.TextColor=g_JSChartResource.DealList.FieldColor.Index;
            else if (item.Type==REPORT_COLUMN_ID.VOL_ID) 
                item.TextColor=g_JSChartResource.DealList.FieldColor.Vol;
        }
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

            if (item.Type==REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID)
            {
                if (!IFrameSplitOperator.IsNumber(item.DataIndex)) continue;
                colItem.DataIndex=item.DataIndex;   //数据在扩展数据索引列
            }
            else if (item.Type==REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID)
            {
                if (!IFrameSplitOperator.IsNumber(item.DataIndex)) continue;
                colItem.DataIndex=item.DataIndex;   //数据在扩展数据索引列
                colItem.Decimal=2;
                colItem.FormatType=0;   //0=默认格式化 1=原始输出 2=科学计数 3=成交量格式化
                if (IFrameSplitOperator.IsNumber(item.Decimal)) colItem.Decimal=item.Decimal;   //小数位数
                if (IFrameSplitOperator.IsNumber(item.FormatType)) colItem.FormatType=item.FormatType;   //小数位数
            }

            this.Column.push(colItem);
        }
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

    this.GetDefaultColunm=function(id)
    {
        var DEFAULT_COLUMN=
        [
            { Type:REPORT_COLUMN_ID.INDEX_ID, Title:"序号", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Index, MaxText:"8888"},
            { Type:REPORT_COLUMN_ID.SYMBOL_ID, Title:"代码", TextAlign:"left", Width:null,  TextColor:g_JSChartResource.Report.FieldColor.Symbol, MaxText:"888888"},
            { Type:REPORT_COLUMN_ID.NAME_ID, Title:"名称", TextAlign:"left", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Name, MaxText:"擎擎擎擎" },

            { Type:REPORT_COLUMN_ID.INCREASE_ID, Title:"涨幅%", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.PRICE_ID, Title:"现价", TextAlign:"right", Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.UPDOWN_ID, Title:"涨跌", TextAlign:"right", Width:null, MaxText:"-888.88" },
            { Type:REPORT_COLUMN_ID.AMPLITUDE_ID, Title:"振幅%", TextAlign:"right", Width:null, MaxText:"888.88" },
            { Type:REPORT_COLUMN_ID.BUY_PRICE_ID, Title:"买价", TextAlign:"right", Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.SELL_PRICE_ID, Title:"卖价", TextAlign:"right", Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.AVERAGE_PRICE_ID, Title:"均价", TextAlign:"right", Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.OPEN_ID, Title:"今开", TextAlign:"right", Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.HIGH_ID, Title:"最高", TextAlign:"right", Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.LOW_ID, Title:"最低", TextAlign:"right",  Width:null, MaxText:"8888.88" },
            { Type:REPORT_COLUMN_ID.YCLOSE_ID, Title:"昨收", TextAlign:"right",  Width:null, MaxText:"8888.88" },

            { Type:REPORT_COLUMN_ID.VOL_ID, Title:"总量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.AMOUNT_ID, Title:"总金额", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Amount, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.EXCHANGE_RATE_ID, Title:"换手%", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"88.88" },

            { Type:REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID, Title:"流通股本", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.TOTAL_SHARES_ID, Title:"总股本", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID, Title:"流通市值", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.MARKET_VALUE_ID, Title:"总市值", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Text, Width:null, MaxText:"8888.8擎" },

            
            { Type:REPORT_COLUMN_ID.VOL_IN_ID, Title:"内盘", TextAlign:"right", TextColor:g_JSChartResource.Report.DownTextColor, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.VOL_OUT_ID, Title:"外盘", TextAlign:"right", TextColor:g_JSChartResource.Report.UpTextColor, Width:null, MaxText:"8888.8擎" },


            { Type:REPORT_COLUMN_ID.BUY_VOL_ID, Title:"买量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
            { Type:REPORT_COLUMN_ID.SELL_VOL_ID, Title:"卖量", TextAlign:"right", TextColor:g_JSChartResource.Report.FieldColor.Vol, Width:null, MaxText:"8888.8擎" },
           
            //{ Type:REPORT_COLUMN_ID.MULTI_BAR_ID, Title:"柱子", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.BarTitle, MaxText:"888888" },
            //{ Type:REPORT_COLUMN_ID.CENTER_BAR_ID, Title:"柱子2", TextAlign:"center", Width:null, TextColor:g_JSChartResource.DealList.FieldColor.BarTitle, MaxText:"888888" },
            { Type:REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID, Title:"自定义", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎" },
            { Type:REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID, Title:"自定义", TextAlign:"center", Width:null, TextColor:g_JSChartResource.Report.FieldColor.Text, MaxText:"擎擎擎擎擎" }
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
        
        if (this.Tab && this.BottomToolbarHeight>0)
        {
            var bottom=this.ChartBorder.GetBottom();
            this.Tab.DrawTab(this.RectClient.Left,bottom-this.BottomToolbarHeight, this.RectClient.Right, bottom)
            this.Tab.DrawScrollbar(this.RectClient.Left,bottom-this.BottomToolbarHeight, this.RectClient.Right, bottom);
        }

        this.DrawBorder();
        
        this.SizeChange=false;
    }

    //更新缓存变量
    this.UpdateCacheData=function()
    {
        this.RectClient.Left=this.ChartBorder.GetLeft();
        this.RectClient.Right=this.ChartBorder.GetRight();
        this.RectClient.Top=this.ChartBorder.GetTop();
        this.RectClient.Bottom=this.ChartBorder.GetBottom()-this.BottomToolbarHeight;
        this.Decimal=GetfloatPrecision(this.Symbol);
    }

    this.GetPageSize=function(recalculate) //recalculate 是否重新计算
    {
        if (recalculate) this.CalculateSize();
        var size=this.RowCount;
        return size;
    }

    this.CalculateSize=function()   //计算大小
    {
        this.UpdateCacheData();

        var pixelRatio=GetDevicePixelRatio();
        this.HeaderFont=`${this.HeaderFontConfig.Size*pixelRatio}px ${ this.HeaderFontConfig.Name}`;
        this.ItemFont=`${this.ItemFontConfig.Size*pixelRatio}px ${ this.ItemFontConfig.Name}`;

        this.Canvas.font=this.ItemFont;
        var itemWidth=0;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            itemWidth=this.Canvas.measureText(item.MaxText).width;
            item.Width=itemWidth+4+this.ItemMergin.Left+this.ItemMergin.Right;
        }

        this.Canvas.font=this.HeaderFont;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            if (!item.Title || item.Title.length<=0) continue;
            itemWidth=this.Canvas.measureText(item.Title).width;
            itemWidth+=(4+this.HeaderMergin.Left+this.HeaderMergin.Right);
            if (item.Width<itemWidth) item.Width=itemWidth;
        }

        this.HeaderHeight=this.GetFontHeight(this.HeaderFont,"擎")+ this.HeaderMergin.Top+ this.HeaderMergin.Bottom;
        if (!this.IsShowHeader) this.HeaderHeight=0;
        this.RowHeight=this.GetFontHeight(this.ItemFont,"擎")+ this.HeaderMergin.Top+ this.HeaderMergin.Bottom;
        this.RowCount=parseInt((this.RectClient.Bottom-this.RectClient.Top-this.HeaderHeight)/this.RowHeight);

        var subWidth=0;
        var reportWidth=this.RectClient.Right-this.RectClient.Left;
        for(var i=0;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            subWidth+=item.Width;
        }

        this.IsShowAllColumn=(subWidth<reportWidth);

        if (this.Tab)
        {
            this.Tab.CalculateSize();
            this.BottomToolbarHeight=this.Tab.Height;
        }
        else
        {
            this.BottomToolbarHeight=0;
        }

    }

    this.DrawHeader=function()
    {
        if (!this.IsShowHeader) return;

        var left=this.RectClient.Left;
        var top=this.RectClient.Top;
        var y=top+this.HeaderMergin.Top+(this.HeaderHeight-this.HeaderMergin.Top-this.HeaderMergin.Bottom)/2;

        this.Canvas.font=this.HeaderFont;
        this.Canvas.fillStyle=this.HeaderColor;
        
        var textLeft=left;
        //固定列
        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width;
            var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;
            var x=textLeft+this.HeaderMergin.Left;

            if (this.SortInfo && this.SortInfo.Field==i && this.SortInfo.Sort>0)
            {
                this.DrawSortHeader(item.Title,item.TextAlign,x,y,textWidth,this.SortInfo.Sort);
            }
            else
            {
                this.DrawText(item.Title,item.TextAlign,x,y,textWidth);
            }

            textLeft+=item.Width;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            var itemWidth=item.Width;
            var textWidth=itemWidth-this.HeaderMergin.Left-this.HeaderMergin.Right;
            var x=textLeft+this.HeaderMergin.Left;

            if (this.SortInfo && this.SortInfo.Field==i && this.SortInfo.Sort>0)
            {
                this.DrawSortHeader(item.Title,item.TextAlign,x,y,textWidth,this.SortInfo.Sort);
            }
            else
            {
                this.DrawText(item.Title,item.TextAlign,x,y,textWidth);
            }

            textLeft+=item.Width;
        } 
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


    this.DrawBorder=function()
    {
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
            var symbol=this.Data.Data[i];

            var bFillRow=false;
            if (this.SelectedModel==0)
            {
                if (j==this.SelectedRow) bFillRow=true; //选中行
            }
            else
            {
                if (i==this.SelectedRow) bFillRow=true; //选中行
            }

            if (bFillRow)
            {
                this.Canvas.fillStyle=this.SelectedColor;;
                this.Canvas.fillRect(left,textTop,rowWidth,this.RowHeight);   
            }

            
            this.DrawRow(symbol, textTop, i);

            this.ShowSymbol.push( {Index:i, Symbol:symbol,} );

            textTop+=this.RowHeight;
        }
    }

    this.DrawRow=function(symbol, top, dataIndex)
    {
        var left=this.RectClient.Left;
        var chartRight=this.RectClient.Right;
        var data= { Symbol:symbol , Stock:null };
        if (this.GetStockDataCallback) data.Stock=this.GetStockDataCallback(symbol);
        data.Decimal=GetfloatPrecision(symbol); //小数位数

        for(var i=0;i<this.FixedColumn && i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top);
            left+=item.Width;

            if (left>=chartRight) break;
        }

        for(var i=this.FixedColumn+this.Data.XOffset;i<this.Column.length;++i)
        {
            var item=this.Column[i];
            this.DrawItem(dataIndex, data, item, left, top);
            left+=item.Width;

            if (left>=chartRight) break;
        }
    }

    this.DrawItem=function(index, data, column, left, top)
    {
        var itemWidth=column.Width;
        var x=left+this.ItemMergin.Left;
        var textWidth=column.Width-this.ItemMergin.Left-this.ItemMergin.Right;
        var stock=data.Stock;
        var drawInfo={ Text:null, TextColor:column.TextColor , TextAlign:column.TextAlign };
        if (column.Type==REPORT_COLUMN_ID.INDEX_ID)
        {
            drawInfo.Text=(index+1).toString();
        }
        else if (column.Type==REPORT_COLUMN_ID.SYMBOL_ID)
        {
            if (stock && stock.Symbol) drawInfo.Text=stock.Symbol;
            else drawInfo.Text=data.Symbol;
        }
        else if (column.Type==REPORT_COLUMN_ID.NAME_ID)
        {
            if (stock && stock.Name) 
            {
                drawInfo.Text=stock.Name;
                drawInfo.TextColor=this.GetNameColor(column,data.Symbol);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.Price, stock, data, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.OPEN_ID)
        {
            //如果行情开盘价为涨停价或跌停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.Open, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.Open, stock, data, drawInfo);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.HIGH_ID)
        {
            //如果行情最高价为涨停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.High, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.High, stock, data, drawInfo);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.LOW_ID)
        {
            //如果行情最低价为跌停价,则对内容加灰框
            if (stock) 
            {
                this.DrawLimitPriceBorder(stock.Low, stock, left, top, column.Width);
                this.GetPriceDrawInfo(stock.Low, stock, data, drawInfo);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.YCLOSE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.YClose, stock, data, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.BUY_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.BuyPrice, stock, data, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.SELL_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.SellPrice, stock, data, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.AVERAGE_PRICE_ID)
        {
            if (stock) this.GetPriceDrawInfo(stock.AvPrice, stock, data, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.EXCHANGE_RATE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Vol) && IFrameSplitOperator.IsNumber(stock.OutShares) && stock.OutShares>0)
            {
                var value=stock.Vol/stock.OutShares*100;
                drawInfo.Text=value.toFixed(2);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.BUY_VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.BuyVol)) drawInfo.Text=this.FormatVolString(stock.BuyVol);
        }
        else if (column.Type==REPORT_COLUMN_ID.SELL_VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.SellVol)) drawInfo.Text=this.FormatVolString(stock.SellVol);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Vol)) drawInfo.Text=this.FormatVolString(stock.Vol);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_IN_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.VolIn)) drawInfo.Text=this.FormatVolString(stock.VolIn);
        }
        else if (column.Type==REPORT_COLUMN_ID.VOL_OUT_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.VolOut)) drawInfo.Text=this.FormatVolString(stock.VolOut);
        }
        else if (column.Type==REPORT_COLUMN_ID.TOTAL_SHARES_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.TotalShares)) drawInfo.Text=this.FormatVolString(stock.TotalShares);
        }
        else if (column.Type==REPORT_COLUMN_ID.OUTSTANDING_SHARES_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.OutShares)) drawInfo.Text=this.FormatVolString(stock.OutShares);
        }
        else if (column.Type==REPORT_COLUMN_ID.CIRC_MARKET_VALUE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.OutShares) && IFrameSplitOperator.IsNumber(stock.Price)) 
                drawInfo.Text=this.FormatVolString(stock.OutShares*stock.Price);
        }
        else if (column.Type==REPORT_COLUMN_ID.MARKET_VALUE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.TotalShares) && IFrameSplitOperator.IsNumber(stock.Price)) 
                drawInfo.Text=this.FormatVolString(stock.TotalShares*stock.Price);
        }
        else if (column.Type==REPORT_COLUMN_ID.AMOUNT_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Amount))
                drawInfo.Text=this.FormatVolString(stock.Amount);
        }
        else if (column.Type==REPORT_COLUMN_ID.INCREASE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Price) && IFrameSplitOperator.IsNumber(stock.YClose) && stock.YClose!=0)
            {
                var value=(stock.Price-stock.YClose)/stock.YClose*100;
                drawInfo.Text=value.toFixed(2);
                drawInfo.TextColor=this.GetUpDownColor(value,0);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.AMPLITUDE_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.High) && IFrameSplitOperator.IsNumber(stock.Low) && IFrameSplitOperator.IsNumber(stock.YClose) && stock.YClose!=0)
            {
                var value=(stock.High-stock.Low)/stock.YClose*100;
                drawInfo.Text=value.toFixed(2);
                drawInfo.TextColor=this.GetUpDownColor(value,0);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.UPDOWN_ID)
        {
            if (stock && IFrameSplitOperator.IsNumber(stock.Price) && IFrameSplitOperator.IsNumber(stock.YClose))
            {
                var value=stock.Price-stock.YClose;
                drawInfo.Text=value.toFixed(data.Decimal);
                drawInfo.TextColor=this.GetUpDownColor(value,0);
            }
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_STRING_TEXT_ID)
        {
            this.GetCustomStringDrawInfo(data, column, drawInfo);
        }
        else if (column.Type==REPORT_COLUMN_ID.CUSTOM_NUMBER_TEXT_ID)
        {
            this.GetCustomNumberDrawInfo(data, column, drawInfo);
        }

        this.DrawItemText(drawInfo.Text, drawInfo.TextColor, drawInfo.TextAlign, x, top, textWidth);
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

    this.GetCustomStringDrawInfo=function(data, column, drawInfo)
    {
        if (!data.Stock || !data.Stock.ExtendData) return;
        if (!IFrameSplitOperator.IsNumber(column.DataIndex)) return;
        if (column.DataIndex<0) return;

        var value=data.Stock.ExtendData[column.DataIndex];
        if (!IFrameSplitOperator.IsString(value)) return;

        drawInfo.Text=value;

        this.GetCustomTextConfig(column, data.Symbol, value, drawInfo);
    }

    this.GetCustomNumberDrawInfo=function(data, column, drawInfo)
    {
        if (!data.Stock || !data.Stock.ExtendData) return;
        if (!IFrameSplitOperator.IsNumber(column.DataIndex)) return;
        if (column.DataIndex<0) return;

        var value=data.Stock.ExtendData[column.DataIndex];
        if (!IFrameSplitOperator.IsNumber(value)) return;

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

        this.GetCustomTextDrawInfo(column, data.Symbol, value, drawInfo);
    }

    this.GetPriceDrawInfo=function(price, stock, data, drawInfo)
    {
        if (!IFrameSplitOperator.IsNumber(price)) return false;

        drawInfo.Text=price.toFixed(data.Decimal);
        if (!IFrameSplitOperator.IsNumber(stock.YClose))  
            drawInfo.TextColor=this.UnchagneColor;
        else  
            drawInfo.TextColor=this.GetUpDownColor(price, stock.YClose);
    }

    this.GetUpDownColor=function(price, price2)
    {
        if (price>price2) return this.UpColor;
        else if (price<price2) return this.DownColor;
        else return this.UnchagneColor;
    }

    //单独处理成交量显示
    this.FormatVolString=function(value,languageID)
    {
        var absValue = Math.abs(value);
        if (absValue<100000) 
            return absValue.toFixed(0);
        else if (absValue<10000000)
            return (value/10000).toFixed(1)+"万";
        else if (absValue<100000000)
            return (value/10000).toFixed(0)+"万";
        else if (absValue<1000000000)
            return (value/100000000).toFixed(2)+"亿";
        else if (absValue < 1000000000000)
            return (value/100000000).toFixed(1)+"亿";
        else
            return (value/1000000000000).toFixed(1)+"万亿";
    }

    this.DrawItemText=function(text, textColor, textAlign, left, top, width)
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

        this.Canvas.textBaseline="middle";
        this.Canvas.fillStyle=textColor;
        this.Canvas.fillText(text,x,top+this.ItemMergin.Top+this.RowHeight/2);
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

    //外部配置显示格式 颜色 对齐方式
    this.GetCustomTextDrawInfo=function(columnInfo, symbol, value, drawInfo)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_CUSTOM_TEXT);
        if (!event || !event.Callback) return false;

        var sendData=
        { 
            Symbol:symbol, Column:columnInfo, Value:value,
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
    this.GetNameColor=function(colunmInfo, symbol)
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_REPORT_NAME_COLOR);
        if (event && event.Callback)
        {
            var sendData={ Symbol:symbol, TextColor:null };
            event.Callback(event,sendData,this);
            if (sendData.TextColor) return sendData.TextColor;
        }

        return colunmInfo.TextColor;
    }

    this.GetFontHeight=function(font,word)
    {
        return GetFontHeight(this.Canvas, font, word);
    }

    this.OnMouseDown=function(x,y,e)
    {
        if (!this.Data) return null;

        if (this.Tab)
        {
            var tab=this.Tab.OnMouseDown(x,y,e);
            if (tab) return { Type:1, Tab: tab };   //顶部工具栏
        }

        var row=this.PtInBody(x,y);
        if (row)
        {
            var bRedraw=true;
            if (this.SelectedModel==0) 
            {
                if (this.SelectedRow==row.Index) bRedraw=false;
                this.SelectedRow=row.Index;
            }
            else 
            {
                if (this.SelectedRow==row.DataIndex) bRedraw=false;
                this.SelectedRow=row.DataIndex;
            }
    
            var eventID=JSCHART_EVENT_ID.ON_CLICK_REPORT_ROW;
            if (e.button==2) eventID=JSCHART_EVENT_ID.ON_RCLICK_REPORT_ROW;
            this.SendClickEvent(eventID, { Data:row, X:x, Y:y, e:e });

            return { Type:2, Redraw:bRedraw, Row:row };  //行
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

            this.SendClickEvent(eventID, { Data:row, X:x, Y:y , e:e });
            return { Type:3, Redraw:bRedraw, Header:header };  //表头
        }

        return null;
    }

    this.OnDblClick=function(x,y,e)
    {
        if (!this.Data) return false;

        var row=this.PtInBody(x,y);
        if (row)
        {
            this.SendClickEvent(JSCHART_EVENT_ID.ON_DBCLICK_REPORT_ROW, { Data:row, X:x, Y:y });
            return true;
        }

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
 
        var textTop=top;
        this.Canvas.font=this.ItemFont;
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
                return { Rect:header, Column:item, Index:i };
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
                return { Rect:header, Column:item, Index:i };
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

    this.SendClickEvent=function(id, data)
    {
        var event=this.GetEventCallback(id);
        if (event && event.Callback)
        {
            event.Callback(event,data,this);
        }
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

    //Tab
    this.TabList=[];                //{ Title:标题, ID:, IsMenu: 是否菜单 }
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
    this.Mergin=
    { 
        Left:2, 
        Right:2, 
        Top:2, 
        Bottom:2
    };

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

    this.SetTabList=function(aryTab)
    {
        this.TabList=[];
        for(var i=0;i<aryTab.length;++i)
        {
            var item=aryTab[i];
            if (!item.Title) continue;

            var tabItem={ Title:item.Title, IsMenu:false };
            if (item.ID) tabItem.ID=item.ID;
            if (item.MenuID) tabItem.MenuID=item.MenuID;
            if (IFrameSplitOperator.IsBool(item.IsMenu)) tabItem.IsMenu=item.IsMenu;
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
	    x = rtLeft.Right + 2 + xOffset;

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
