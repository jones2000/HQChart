


class StockInfoChart
{
    DivStockInfo=null;
    Chart=null;   //把成交明细图绑定到一个Div上
    HQData=new HQData();            //数据
    Symbol=null;

    //K线配置信息
    Option= 
    {
        Type:'股票信息',   //创建图形类型
        
        Symbol:'600000.sh',
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:5000,   //数据更新频率
        EnableResize:true,
        EnablePopMenuV2:true,

        Column:
        [
            [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, { Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 }],
            [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1 }, { Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"换手率", Key:"Exchange", FloatPrecision:2, StringFormat:"{Value}%" }],
            [{ Name:"涨停价", Key:"UpLimit",ColorType:3, FloatPrecision:-1 }, { Name:"跌停价",  Key:"DownLimit" , ColorType:3, FloatPrecision:-1 }],
            [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总额",  Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
            [{ Name:"内盘", Key:"InVol", ColorType:4, FloatPrecision:0 }, { Name:"外盘",  Key:"OutVol",ColorType:5, FloatPrecision:0 }],
            [{ Name:"TTM", Key:"PE_TTM",  FloatPrecision:2 }, { Name:"市净率",  Key:"PB", FloatPrecision:2 }],
            [{ Name:"流通市值", Key:"FlowMarketValue",  FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总市值",  Key:"TotalMarketValue", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
        ],

        HeaderColumn:
        [
            { Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1, DefaultText:"--.--" }, 
            { Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%", DefaultText:"--.--%" }, 
            { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1, DefaultText:"--.--" }
        ],
        
        MouseOnKey:
        [
            "Price","UpLimit","DownLimit",
            "BUY_PRICE_0","BUY_PRICE_1","BUY_PRICE_2","BUY_PRICE_3","BUY_PRICE_4",
            "SELL_PRICE_0","SELL_PRICE_1","SELL_PRICE_2","SELL_PRICE_3","SELL_PRICE_4",
        ],

        Border: //边框
        {
            Left:1,         //左边间距
            Right:1,       //右边间距
            Bottom:1,      //底部间距
            Top:1          //顶部间距
        }
    };


    GetSZSHStockShowOption()
    {
        var column=
        [
            [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, { Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 }],
            [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1 }, { Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"换手率", Key:"Exchange", FloatPrecision:2, StringFormat:"{Value}%" }],
            [{ Name:"涨停价", Key:"UpLimit",ColorType:3, FloatPrecision:-1 }, { Name:"跌停价",  Key:"DownLimit" , ColorType:3, FloatPrecision:-1 }],
            [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总额",  Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
            [{ Name:"内盘", Key:"InVol", ColorType:4, FloatPrecision:0 }, { Name:"外盘",  Key:"OutVol",ColorType:5, FloatPrecision:0 }],
            [{ Name:"TTM", Key:"PE_TTM",  FloatPrecision:2 }, { Name:"市净率",  Key:"PB", FloatPrecision:2 }],
            [{ Name:"流通市值", Key:"FlowMarketValue",  FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总市值",  Key:"TotalMarketValue", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
        ];

        var mouseOnKey=
        [
            "Price","UpLimit","DownLimit",
            "BUY_PRICE_0","BUY_PRICE_1","BUY_PRICE_2","BUY_PRICE_3","BUY_PRICE_4",
            "SELL_PRICE_0","SELL_PRICE_1","SELL_PRICE_2","SELL_PRICE_3","SELL_PRICE_4",
        ];

        return { Column:column, BuySellCount:5, MouseOnKey:mouseOnKey };
    }

    GetHKStockShowOption()
    {
        var column=
        [
            [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, { Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 }],
            [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"昨收", Key:"YClose", ColorType:3, FloatPrecision:-1 } ],
            [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1 }, { Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"总额",  Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }],
        ];

        return { Column:column, BuySellCount:1, MouseOnKey:[] };
    }

    GetIndexShowOption()
    {
        var column=
        [
            [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1, ShowType:1 }],
            [{ Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1, ShowType:1 }],
            [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%", ShowType:1 }],
            [{ Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1, ShowType:1}],
            [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%", ShowType:1 } ],
            [{ Name:"昨收", Key:"YClose", ColorType:3, FloatPrecision:-1, ShowType:1}],
            [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1, ShowType:1 }],
            [{ Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1, ShowType:1 }],
            [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ShowType:1 }],
            [{ Name:"总额",  Key:"Amount", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 }, ShowType:1 }]
        ];

        return { Column:column, BuySellCount:0, MouseOnKey:[] };
    }

    //期货
    GetChinaFuturesShowOption()
    {
        var column=
        [
            [{ Name:"现价", Key:"Price", ColorType:3, FloatPrecision:-1 }, { Name:"今开",  Key:"Open",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"涨幅", Key:"Increase", ColorType:1, FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"涨跌", Key:"UpDown",ColorType:1, FloatPrecision:-1 }],
            [{ Name:"振幅", Key:"Amplitude", FloatPrecision:2, StringFormat:"{Value}%" }, { Name:"昨收", Key:"YClose", ColorType:3, FloatPrecision:-1 } ],
            [{ Name:"结算", Key:"FClose", ColorType:3, FloatPrecision:-1 }, { Name:"昨结",  Key:"YFClose",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"最高", Key:"High",ColorType:3, FloatPrecision:-1 }, { Name:"最低", Key:"Low",ColorType:3, FloatPrecision:-1 }],
            [{ Name:"总量", Key:"Vol", FloatPrecision:0, Format:{ Type:3, ExFloatPrecision:2 } }, { Name:"持仓",  Key:"Position", FloatPrecision:0 }],
        ];

        return { Column:column, BuySellCount:1, MouseOnKey:[] };
    }

            
    Create(divInfo)  //创建图形
    {
        this.DivStockInfo=divInfo;
        this.Chart=JSStockInfoChart.Init(divInfo);   //把成交明细图绑定到一个Div上

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        //$(window).resize(()=> { this.OnSize(); });    //绑定窗口大小变化事件
       // this.OnSize();  //全屏

        //黑色风格
        //var blackStyle=HQChartStyle.GetStyleConfig(STYLE_TYPE_ID.BLACK_ID); //读取黑色风格配置
        //JSChart.SetStyle(blackStyle);
       // this.DivDeal.style.backgroundColor=blackStyle.BGColor; //设置最外面的div背景

        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };
        this.Option.Symbol=this.Symbol;

        this.Option.EventCallback= 
        [ 
            {   //右键菜单
                event:JSCHART_EVENT_ID.ON_CREATE_RIGHT_MENU, 
                callback:(event, data, obj)=>{ this.OnCreateRightMenu(event, data, obj); }  
            },
            {   //菜单命令执行
                event:JSCHART_EVENT_ID.ON_MENU_COMMAND, 
                callback:(event, data, obj)=>{ this.OnMenuCommand(event, data, obj); }  
            },
        ];

        this.OnCreate();

        this.Chart.SetOption(this.Option);  //设置配置
    }

    OnCreate()
    {

    }

    ChangeSymbol(symbol)
    {
        this.Symbol=symbol;
        var upperSymbol=null;
        if (symbol) upperSymbol=symbol.toUpperCase();

        //设置显示内容
        var option=null;
        if (MARKET_SUFFIX_NAME.IsSHSZStockA(symbol) || MARKET_SUFFIX_NAME.IsBJStock(upperSymbol)) 
        {
            option=this.GetSZSHStockShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsSHSZIndex(symbol) || MARKET_SUFFIX_NAME.IsBJIndex(symbol)) 
        {
            option=this.GetIndexShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsHK(upperSymbol))
        {
            if (MARKET_SUFFIX_NAME.IsHKStock(symbol)) option=this.GetHKStockShowOption();
            else option=this.GetIndexShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol))
        {
             option=this.GetChinaFuturesShowOption();
        }
        
        this.Chart.ChangeSymbol(symbol, option);
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

    NetworkFilter(data, callback)
    {
        console.log('[StockInfoChart::NetworkFilter] data', data);
        var option={ ChartName:"StockInfoChart" };
        switch(data.Name)
        {
            //case "JSReportChartContainer::RequestMemberListData":   //板块成分
            //    this.RequestMemberListData(data, callback);
            //    break;
            
            default:
                this.HQData.NetworkFilter(data, callback, option);  
                break;
        }
    }

    OnCreateRightMenu(event, data, obj)
    {
        var price=null;
        var item=data.Data.Cell.Data;
        if (item.Type==1) 
        {
            price=item.Value;
        }
        else if (item.Type==2)
        {
            price=item.Value.Value;
        }

        if (!IFrameSplitOperator.IsNumber(price)) return;
        
        data.MenuData.Menu=
        [
            { Name:"闪电买入", Data:{ ID:"CUSTOM_MENU_BUY_ID", Args:[price] } },
            { Name:"闪电卖出", Data:{ ID:"CUSTOM_MENU_SELL_ID", Args:[price] } }
        ];
    }

    OnMenuCommand(event, data, obj)
    {

    }
}