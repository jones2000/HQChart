//行情列表


class HQ_CLASS_SYMBOL
{
    static SH_STOCKA={ Symbol:"SH_STOCKA", Name:"上证A股" };
    static SH_STOCK_STAR={ Symbol:"SH_STOCK_STAR", Name:"科创板" };
   
    static SZ_STOCKA={ Symbol:"SZ_STOCKA", Name:"深证A股" };
    static SZ_GEM={ Symbol:"SZ_GEM", Name:"创业板" };

    static BJ_STOCKA={ Symbol:"BJ_STOCKA", Name:"北交所" };

    static HK_STOCK_CONNECT={ Symbol:"HK_STOCK_C", Name:"港股通" };

    static SZSH_HK_STOCK={ Symbol:"SZSH_HK_STOCK", Name:"A+H股" };

    static SHSZ_FUND={ Symbol:"SHSZ_FUND", Name:"深证基金" };

    static USA_STOCK_CN={ Symbol:"USA_STOCK_CN", Name:"中概股"};

    //期货
    static CFFEX_FUTRUES={ Symbol:"CFFEX_FUTRUES", Name:"中金所期货" };
    static SHFE_FUTRUES={ Symbol:"SHFE_FUTRUES", Name:"上海商品" };
    static DCE_FUTRUES={ Symbol:"DCE_FUTRUES", Name:"大连商品" };
    static CZCE_FUTRUES={ Symbol:"CZCE_FUTRUES", Name:"郑州商品" };
    static INE_FUTRUES={ Symbol:"INE_FUTRUES", Name:"上期能源" };

    //期权
    static SHSZ_ETF_OPTION={Symbol:"SHSZ_ETF_OPTION", Name:"ETF期权" };
    static CFFEX_OPTION={ Symbol:"CFFEX_OPTION", Name:"中金所期权" };
    static SHFE_OPTION={ Symbol:"SHFE_OPTION", Name:"上海商品期权" };
    static DCE_OPTION={ Symbol:"DCE_OPTION", Name:"大连商品期权" };
    static CZCE_OPTION={ Symbol:"CZCE_OPTION", Name:"郑州商品期权" };
    static INE_OPTION={ Symbol:"INE_OPTION", Name:"上期能源期权" };
   


    static SHSZ_OPTION_ETF={ Symbol:"SHSZ_OPTION_ETF", Name:"ETF期权" };            //沪深期权ETF
    static CFFEX_OPTION_INDEX={ Symbol:"CFFEX_OPTION_INDEX", Name:"指数期权" };      //中金所期权指数

    static CZCE_OPTION_FUTRUES={ Symbol:"CZCE_OPTION_FUTRUES", Name:"郑商期权" };
    static SHFE_OPTION_FUTRUES={ Symbol:"SHFE_OPTION_FUTRUES", Name:"上海期权" };
    static DCE_OPTION_FUTRUES={ Symbol:"DCE_OPTION_FUTRUES", Name:"大商期权" };
    static GZFE_OPTION_FUTRUES={ Symbol:"GZFE_OPTION_FUTRUES", Name:"广期期权" };
    static INE_OPTION_FUTRUES={ Symbol:"INE_OPTION_FUTRUES", Name:"上期能源期权" };

    static FUTRUES_OPTION={ Symbol:"FUTRUES_OPTION", Name:"商品期权" };

    
    
}


class FullReportChart
{
    Name="FullReportChart";
    DivReport=null;
    Chart=null              //JSReportChart.Init(divReport);   //把报价列表绑定到一个Div上
    HQData=new HQData();            //数据
    OnClickRowCallback=null;

    AryData=[];              //全部的码表
    MapSHSZ_HK=new Map();    //A+H股

    //配置信息
    Option= 
    {
        Type:'报价列表',   //创建图形类型
        
        Symbol:HQ_CLASS_SYMBOL.SH_STOCKA.Symbol,  //板块代码
        Name:HQ_CLASS_SYMBOL.SH_STOCKA.Name,

        IsAutoUpdate:true,              //是自动更新数据
        AutoUpdateFrequency:10000,      //数据更新频率
        
        //显示列
        Column:
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ],
        
        FixedColumn:2,      //固定列

        //SortInfo:{ Field:2, Sort: 1 },   //默认排序信息
        //IsShowHeader:false,

        //KeyDown:false,
        //Wheel:false,

        //BorderLine:0,
        //SelectedModel:1,

        EnablePopMenuV2:true,
        EnableDragRow:true,
        EnableDragHeader:true,
        //CellBorder:{ IsShowVLine:false, IsFullLine:false },
        EnableResize:true,

        Border: //边框
        {
            Left:0,        //左边间距
            Right:0,       //右边间距
            Bottom:0,      //底部间距
            Top:0          //顶部间距
        },

        MinuteChartTooltip:
        { 
            Enable:true,
            Option:{ EnableResize:false }
        },

        KLineChartTooltip:
        { 
            Enable:false,
            Option:{ EnableResize:false }
        },

        //VScrollbar:{ Enable:true , Style:1, BarWidth:3 , Margin:{ Left:0, Right:0, Top:1, Bottom:1 }},

        WheelPage:{ Type:0 },
        SelectedModel:1,
        PageUpDownCycle:true,
        //BottomTab:{ IsShow:false },
        FloatTooltip:{ Enable:true },

        Tab:
        [
            { Title:HQ_CLASS_SYMBOL.SH_STOCKA.Name, ID:HQ_CLASS_SYMBOL.SH_STOCKA.Symbol , CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.SH_STOCK_STAR.Name, ID:HQ_CLASS_SYMBOL.SH_STOCK_STAR.Symbol , CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},

            

            { Title:HQ_CLASS_SYMBOL.SZ_STOCKA.Name, ID:HQ_CLASS_SYMBOL.SZ_STOCKA.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.SZ_GEM.Name, ID:HQ_CLASS_SYMBOL.SZ_GEM.Symbol , CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},

            { Title:HQ_CLASS_SYMBOL.BJ_STOCKA.Name, ID:HQ_CLASS_SYMBOL.BJ_STOCKA.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            
            { Title:HQ_CLASS_SYMBOL.SHSZ_FUND.Name, ID:HQ_CLASS_SYMBOL.SHSZ_FUND.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            
            { Title:HQ_CLASS_SYMBOL.HK_STOCK_CONNECT.Name, ID:HQ_CLASS_SYMBOL.HK_STOCK_CONNECT.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.SZSH_HK_STOCK.Name, ID:HQ_CLASS_SYMBOL.SZSH_HK_STOCK.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},

            { Title:HQ_CLASS_SYMBOL.USA_STOCK_CN.Name, ID:HQ_CLASS_SYMBOL.USA_STOCK_CN.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            

            { Title:HQ_CLASS_SYMBOL.CFFEX_FUTRUES.Name, ID:HQ_CLASS_SYMBOL.CFFEX_FUTRUES.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.SHFE_FUTRUES.Name, ID:HQ_CLASS_SYMBOL.SHFE_FUTRUES.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.DCE_FUTRUES.Name, ID:HQ_CLASS_SYMBOL.DCE_FUTRUES.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.CZCE_FUTRUES.Name, ID:HQ_CLASS_SYMBOL.CZCE_FUTRUES.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.INE_FUTRUES.Name, ID:HQ_CLASS_SYMBOL.INE_FUTRUES.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},


            { Title:HQ_CLASS_SYMBOL.SHSZ_ETF_OPTION.Name, ID:HQ_CLASS_SYMBOL.SHSZ_ETF_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.CFFEX_OPTION.Name, ID:HQ_CLASS_SYMBOL.CFFEX_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.SHFE_OPTION.Name, ID:HQ_CLASS_SYMBOL.SHFE_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.DCE_OPTION.Name, ID:HQ_CLASS_SYMBOL.DCE_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.CZCE_OPTION.Name, ID:HQ_CLASS_SYMBOL.CZCE_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
            { Title:HQ_CLASS_SYMBOL.INE_OPTION.Name, ID:HQ_CLASS_SYMBOL.INE_OPTION.Symbol, CommandID:JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID},
        ],
    };
            
    Create(divReport)  //创建图形
    {
        var resource=JSChart.GetResource();
        var pixelRatio=GetDevicePixelRatio();
        resource.Report.KLine.DataWidth=5*pixelRatio;  
        resource.Report.KLine.DistanceWidth=2*pixelRatio;

        this.DivReport=divReport;
        this.Chart=JSReportChart.Init(divReport);   //把报价列表绑定到一个Div上

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };

        this.Option.EventCallback= 
        [ 
            {   //单击
                event:JSCHART_EVENT_ID.ON_CLICK_REPORT_ROW, 
                callback:(event, data, obj)=>{ this.OnClickRow(event, data, obj); }  
            },
            {   //表头菜单
                event:JSCHART_EVENT_ID.ON_CREATE_REPORT_HEADER_MENU, 
                callback:(event, data, obj)=>{ this.OnCreateHeaderMenu(event, data, obj); }  
                
            },
            {
                event:JSCHART_EVENT_ID.ON_MENU_COMMAND, 
                callback:(event, data, obj)=>{ this.OnMenuCommand(event, data, obj); }  
            },
            {
                event:JSCHART_EVENT_ID.ON_CLICK_REPORT_TAB, 
                callback:(event, data, obj)=>{ this.OnClickTab(event, data, obj); }  
            }
        ];

        this.OnCreate();
        this.Chart.SetOption(this.Option);  //设置配置
    }

    OnCreate()
    {

    }

    //股票
    GetSHSZStockOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }


    //股票
    GetHKStockOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }

    GetUSAStockOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }


    //期货
    GetFuturesOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 }, MaxText:"擎擎8888" },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.FUTURES_POSITION_ID},
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.FUTURES_YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            {Type:REPORT_COLUMN_ID.YCLOSE_ID},

            {Type:REPORT_COLUMN_ID.OPEN_DATE_ID, TitleAlign:"center" },
            {Type:REPORT_COLUMN_ID.DELIVERY_DATE_ID, TitleAlign:"center" },
            {Type:REPORT_COLUMN_ID.EXPIRE_DATE_ID, TitleAlign:"center" },

            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }

    //期权
    GetOptionOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 }, MaxText:"AA0000-P-0000A" },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.FUTURES_POSITION_ID},
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.FUTURES_YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            {Type:REPORT_COLUMN_ID.YCLOSE_ID},

            {Type:REPORT_COLUMN_ID.OPEN_DATE_ID, TitleAlign:"center" },
            {Type:REPORT_COLUMN_ID.DELIVERY_DATE_ID, TitleAlign:"center" },
            {Type:REPORT_COLUMN_ID.EXPIRE_DATE_ID, TitleAlign:"center" },

            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }

    //基金
    GetSHSZFundOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }

    //A+H
    GetSHSZ_HKOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},

            {Type:REPORT_COLUMN_ID.RESERVE_STRING1_ID, Title:"H股代码", MaxText:"888888", TextAlign:"left"},
            {Type:REPORT_COLUMN_ID.RESERVE_STRING2_ID, Title:"H股名称", MaxText:"擎擎擎擎擎擎擎擎擎", TextAlign:"left"},
            {Type:REPORT_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"H涨幅%", MaxText:"888.88", ColorType:1 },
            {Type:REPORT_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"H股现价", MaxText:"888.888", FloatPrecision:3, ColorType:4 },
            {Type:REPORT_COLUMN_ID.RESERVE_NUMBER3_ID, Title:"H股涨跌", MaxText:"888.888", ColorType:1, FloatPrecision:3 },

            {Type:REPORT_COLUMN_ID.RESERVE_STRING3_ID, Title:"H股更新日期", MaxText:"9999-99-99", TextAlign:"center"},
            {Type:REPORT_COLUMN_ID.RESERVE_STRING4_ID, Title:"H股更新时间", MaxText:"99:99:99", TextAlign:"center"},
        ];

        return { Column:column };

    }

    GetSHSZ_ETFOption()
    {
        var column=
        [
            {Type:REPORT_COLUMN_ID.INDEX_ID },
            {Type:REPORT_COLUMN_ID.SYMBOL_ID,  SortType:[0], EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:20 } },
            {Type:REPORT_COLUMN_ID.NAME_ID ,EnableDragWidth:true, ChartTooltip:{ Enable:true, Type:21 }, MaxText:"擎擎擎擎擎擎擎擎擎擎"},
            {Type:REPORT_COLUMN_ID.INCREASE_ID, ID:REPORT_COLUMN_ID.INCREASE_ID },
            {Type:REPORT_COLUMN_ID.PRICE_ID, ID:REPORT_COLUMN_ID.PRICE_ID },
            {Type:REPORT_COLUMN_ID.UPDOWN_ID,  },
            {Type:REPORT_COLUMN_ID.BUY_PRICE_ID, ID:REPORT_COLUMN_ID.BUY_PRICE_ID},
            {Type:REPORT_COLUMN_ID.SELL_PRICE_ID, ID:REPORT_COLUMN_ID.SELL_PRICE_ID},
            {Type:REPORT_COLUMN_ID.VOL_ID },
            {Type:REPORT_COLUMN_ID.OPEN_ID},
            {Type:REPORT_COLUMN_ID.HIGH_ID },
            {Type:REPORT_COLUMN_ID.LOW_ID},
            {Type:REPORT_COLUMN_ID.AMOUNT_ID},
            {Type:REPORT_COLUMN_ID.YCLOSE_ID, },
            {Type:REPORT_COLUMN_ID.AMPLITUDE_ID },
            
            {Type:REPORT_COLUMN_ID.DATE_ID, Title:"更新日期", TitleAlign:"center"},
            {Type:REPORT_COLUMN_ID.TIME_ID,  Title:"更新时间", TitleAlign:"center", ValueType:1,  MaxText:"99:99:99"},
        ];

        return { Column:column };
    }

    NetworkFilter(data, callback)
    {
        console.log('[FullReportChart::NetworkFilter] data', data);
        var option={ ChartName:this.Name, AryData:this.AryData, MapSHSZ_HK:this.MapSHSZ_HK };
        switch(data.Name)
        {
            case "JSReportChartContainer::RequestMemberListData":   //板块成分
                this.RequestMemberListData(data, callback);
                break;
            
            default:
                this.HQData.NetworkFilter(data, callback, option);  
                break;
        }
    }

    RequestMemberListData(data, callback)
    {
        var symbol=data.Request.Data.symbol;    //板块代码
        data.PreventDefault=true;

        var hqchartData= { symbol:symbol , name:symbol, data:this.GetStockList(symbol), code:0 };
        
        callback(hqchartData);
    }

    GetStockList(classSymbol)
    {
        if (classSymbol==HQ_CLASS_SYMBOL.SHSZ_OPTION_ETF.Symbol)    //沪深期权ETF
        {
            return ["510050.sh", "510300.sh", "510500.sh","588080.sh","588000.sh","159919.sz", "159922.sz", "159915.sz","159901.sz" ];
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.CFFEX_OPTION_INDEX.Symbol)    //中金所期权指数
        {
            return [ "000852.sh", "000300.sh","000016.sh" ];
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.CZCE_OPTION_FUTRUES.Symbol)   //郑商期权 标的主连
        {
            var arySymbol=
            [
                "AP0.czc","CF0.czc","CJ0.czc","CY0.czc","FG0.czc","JR0.czc","LR0.czc","MA0.czc","OI0.czc","PF0.czc","PK0.czc",
                "PL0.czc","PM0.czc","PR0.czc","PX0.czc","RI0.czc","RM0.czc","RS0.czc","SA0.czc","SF0.czc","SH0.czc",
                "SM0.czc","SR0.czc","TA0.czc","UR0.czc","WH0.czc","ZC0.czc",
            ];

            return arySymbol;
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.SHFE_OPTION_FUTRUES.Symbol)   //上海期权 标的主连
        {
            var arySymbol=
            [
                "AD0.shfe","AG0.shfe","AL0.shfe","AO0.shfe","AU0.shfe","BR0.shfe","BU0.shfe","CU0.shfe","FU0.shfe",
                "HC0.shfe","NI0.shfe","OP0.shfe","PB0.shfe","RB0.shfe","RU0.shfe","SN0.shfe","SP0.shfe","SP0.shfe","ZN0.shfe",
            ];

            return arySymbol;
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.DCE_OPTION_FUTRUES.Symbol)        //大商期权 标的主连
        {
            var arySymbol=
            [
                "A0.dce","B0.dce","BB0.dce","BZ0.dce","C0.dce","CS0.dce","EB0.dce","EG0.dce","FB0.dce","I0.dce","J0.dce","JD0.dce",
                "JM0.dce","L0.dce","LG0.dce","LH0.dce","M0.dce","P0.dce","PG0.dce","PP0.dce","RR0.dce","V0.dce","Y0.dce",
            ];

            return arySymbol;
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.GZFE_OPTION_FUTRUES.Symbol)   //广州期货交易所期权 标的主连
        {
            var arySymbol=
            [
                "LC0.gzfe", "PD0.gzfe", "PS0.gzfe", "PT0.gzfe", "SI0.gzfe",
            ];

            return arySymbol;
        }
        else if (classSymbol==HQ_CLASS_SYMBOL.INE_OPTION_FUTRUES.Symbol)
        {
            var arySymbol=
            [
                "SC0.ine"
            ];

            return arySymbol;
        }

        var aryData=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryData)) return aryData;

        for(var i=0;i<this.AryData.length;++i)
        {
            var bMatch=false;
            var item=this.AryData[i];
            var upperSymbol=item.Symbol.toUpperCase();
            switch(classSymbol)
            {
                case HQ_CLASS_SYMBOL.SH_STOCKA.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSH(upperSymbol) && MARKET_SUFFIX_NAME.IsSHSZStockA(item.Symbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SZ_STOCKA.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSZ(upperSymbol) && MARKET_SUFFIX_NAME.IsSHSZStockA(item.Symbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SHSZ_FUND.Symbol:
                    if ((MARKET_SUFFIX_NAME.IsSH(upperSymbol) || MARKET_SUFFIX_NAME.IsSZ(upperSymbol)) && item.Type==5) bMatch=true;
                    break;

                case HQ_CLASS_SYMBOL.CFFEX_FUTRUES.Symbol:
                    if (MARKET_SUFFIX_NAME.IsCFFEX(upperSymbol) && item.Type==3) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SHFE_FUTRUES.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSHFE(upperSymbol) && item.Type==3) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.DCE_FUTRUES.Symbol:
                    if (MARKET_SUFFIX_NAME.IsDCE(upperSymbol) && item.Type==3) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.CZCE_FUTRUES.Symbol:
                    if (MARKET_SUFFIX_NAME.IsCZCE(upperSymbol)&& item.Type==3) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.INE_FUTRUES.Symbol:
                    if (MARKET_SUFFIX_NAME.IsINE(upperSymbol)&& item.Type==3) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SZ_GEM.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSZGEM(item.Symbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SH_STOCK_STAR.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSHStockSTAR(item.Symbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.BJ_STOCKA.Symbol:
                    if (MARKET_SUFFIX_NAME.IsBJStock(item.Symbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.HK_STOCK_CONNECT.Symbol:
                    if (MARKET_SUFFIX_NAME.IsHK(upperSymbol) && this.IncludeProperty(item, ["港股通"]))
                        bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SZSH_HK_STOCK.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSHSZStockA(item.Symbol) && this.IncludeProperty(item, ["A+H"]))
                        bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SHSZ_ETF_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSHO(upperSymbol) || MARKET_SUFFIX_NAME.IsSZO(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.CFFEX_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsCFFEXOption(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.SHFE_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsSHFEOption(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.DCE_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsDCEOption(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.CZCE_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsCZCEOption(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.INE_OPTION.Symbol:
                    if (MARKET_SUFFIX_NAME.IsINEOption(upperSymbol)) bMatch=true;
                    break;
                case HQ_CLASS_SYMBOL.USA_STOCK_CN.Symbol:
                    if (MARKET_SUFFIX_NAME.IsUSA(upperSymbol))
                    {
                        bMatch=true;
                    }
                    break;
            }

            if (bMatch) aryData.push(item.Symbol)
        }

        aryData.sort((left, right)=>
        { 
            if (left>right) return 1;
            if (left<right) return -1;
            return 0;
        })

        return aryData;
    }

    BuildSHSZ_HKMap()
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.AryData)) return;

        for(var i=0, j=0;i<this.AryData.length; ++i)
        {
            var stockItem=this.AryData[i];
            if (!IFrameSplitOperator.IsNonEmptyArray(stockItem.AryProperty)) continue;

            for(j=0; j<stockItem.AryProperty.length; ++j)
            {
                var item=stockItem.AryProperty[j];
                if (item.Name=="A+H")
                {
                    this.MapSHSZ_HK.set(item.HK.Symbol, item);
                    this.MapSHSZ_HK.set(item.SHSZ.Symbol, item);
                    break;
                }
            }
        }
    }

    IncludeProperty(stockItem, aryProperty)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(stockItem.AryProperty)) return false;

        for(var i=0;i<stockItem.AryProperty.length;++i)
        {
            var item=stockItem.AryProperty[i];
            if (aryProperty.includes(item.Name)) return true;
        }

        return false;
    }

    OnClickRow(event, data, obj)
    {
        console.log("[FullReportChart::OnClickRow] data=",data);
        if (this.OnClickRowCallback) this.OnClickRowCallback(data, obj, this);
    }

    OnCreateHeaderMenu(event, data, obj)
    {
        console.log("[FullReportChart::OnCreateHeaderMenu] data=",data);
    }

    OnMenuCommand(event, data, obj)
    {
        console.log("[FullReportChart::OnMenuCommand] data=",data);
    }

    OnClickTab(event, data, obj)
    {
        console.log("[FullReportChart::OnClickTab] data=",data);
        var tabData=data.Data;
        if (tabData.Tab.CommandID==JSCHART_MENU_ID.CMD_REPORT_CHANGE_BLOCK_ID)
        {
            data.PreventDefault=true;
            var symbol=tabData.Tab.ID;
            this.ChangeSymbol(symbol);
            obj.SetSelectedTab(tabData.Index);
        }
    }

    ChangeSymbol(symbol)
    {
        var option=null;
        switch(symbol)
        {
            case HQ_CLASS_SYMBOL.SH_STOCKA.Symbol:
            case HQ_CLASS_SYMBOL.SH_STOCK_STAR.Symbol:
            case HQ_CLASS_SYMBOL.SZ_STOCKA.Symbol:
            case HQ_CLASS_SYMBOL.SZ_GEM.Symbol:
            case HQ_CLASS_SYMBOL.BJ_STOCKA.Symbol:
                option=this.GetSHSZStockOption();
                break;
            case HQ_CLASS_SYMBOL.CFFEX_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.SHFE_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.DCE_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.CZCE_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.INE_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.SHFE_OPTION_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.CZCE_OPTION_FUTRUES.Symbol:
            case HQ_CLASS_SYMBOL.DCE_OPTION_FUTRUES.Symbol:
                option=this.GetFuturesOption();
                break;
            case HQ_CLASS_SYMBOL.HK_STOCK_CONNECT.Symbol:
                option=this.GetHKStockOption();
                break;
            case HQ_CLASS_SYMBOL.SZSH_HK_STOCK.Symbol:
                option=this.GetSHSZ_HKOption();
                this.BuildSHSZ_HKMap();
                break;
            case HQ_CLASS_SYMBOL.SHSZ_OPTION_ETF.Symbol:
            case HQ_CLASS_SYMBOL.CFFEX_OPTION_INDEX.Symbol:
                option=this.GetSHSZ_ETFOption();
                break;
            case HQ_CLASS_SYMBOL.SHSZ_ETF_OPTION.Symbol:
            case HQ_CLASS_SYMBOL.CFFEX_OPTION.Symbol:
            case HQ_CLASS_SYMBOL.SHFE_OPTION.Symbol:
            case HQ_CLASS_SYMBOL.DCE_OPTION.Symbol:
            case HQ_CLASS_SYMBOL.CZCE_OPTION.Symbol:
            case HQ_CLASS_SYMBOL.INE_OPTION.Symbol:
                option=this.GetOptionOption();
                break;
            case HQ_CLASS_SYMBOL.SHSZ_FUND.Symbol:
                option=this.GetSHSZFundOption();
                break;
            case HQ_CLASS_SYMBOL.USA_STOCK_CN.Symbol:
                option=this.GetUSAStockOption()
                break;
        }

        this.Chart.ChangeSymbol(symbol, option);
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

}
