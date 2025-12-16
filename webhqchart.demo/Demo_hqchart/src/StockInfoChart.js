


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
        AutoUpdateFrequency:3000,   //数据更新频率
        EnableResize:true,

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
        
        Border: //边框
        {
            Left:1,         //左边间距
            Right:1,       //右边间距
            Bottom:1,      //底部间距
            Top:1          //顶部间距
        }
    };

            
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
            {   //根据大小单显示成交量颜色
                event:JSCHART_EVENT_ID.ON_DRAW_DEAL_VOL_COLOR, 
                callback:(event, data, obj)=>{ this.GetVolColor(event, data, obj); }  
            },
            {   //自定义内容
                event:JSCHART_EVENT_ID.ON_DRAW_DEAL_TEXT, 
                callback:(event, data, obj)=>{ this.GetCustomText(event, data, obj); }  
            },
            {   //过滤数据
                event:JSCHART_EVENT_ID.ON_FILTER_DEAL_DATA, 
                callback:(event, data, obj)=>{ this.OnFilterData(event, data, obj); }  
            }
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
        this.Chart.ChangeSymbol(symbol);
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

    NetworkFilter(data, callback)
    {
        console.log('[StockInfoChart::NetworkFilter] data', data);
        var option={ };
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
}