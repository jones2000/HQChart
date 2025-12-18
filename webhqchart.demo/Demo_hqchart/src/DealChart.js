


 //简单的把K线控件封装下
class DealChart
{
    DivDeal=null;
    Chart=null;   //把成交明细图绑定到一个Div上
    HQData=new HQData();            //数据
    ShowType=0; //0=成交明细(小窗口) 1=成交明细(完整模式) 2=分价表(小窗口) 3=分价表(完整模式)
    Symbol=null;

    //K线配置信息
    Option= 
    {
        Type:'成交明细',   //创建图形类型
        
        Symbol:'600000.sh',
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:5000,   //数据更新频率

        Column:
        [
            //{Type:DEAL_COLUMN_ID.STRING_TIME_ID }, //自定义时间格式
            //{Type:DEAL_COLUMN_ID.INDEX_ID },
            {Type:DEAL_COLUMN_ID.TIME_ID, Foramt:"hh:mm:ss" },
            {Type:DEAL_COLUMN_ID.PRICE_ID },
            {Type:DEAL_COLUMN_ID.VOL_ID },
            {Type:DEAL_COLUMN_ID.BS_ID, },
        ],

        ShowOrder:0,
        EnableResize:true,
        IsSingleTable:true,
        IsShowHeader:true,

        //KeyDown:false,  //禁止键盘
        //Wheel:false,    //禁止滚轴
        
        Border: //边框
        {
            Left:1,         //左边间距
            Right:1,       //右边间距
            Bottom:1,      //底部间距
            Top:1          //顶部间距
        }
    };

    GetColumn()
    {
        var data=
        [
            //{Type:DEAL_COLUMN_ID.STRING_TIME_ID }, //自定义时间格式
            //{Type:DEAL_COLUMN_ID.INDEX_ID },
            {Type:DEAL_COLUMN_ID.TIME_ID, Foramt:"hh:mm:ss" },
            {Type:DEAL_COLUMN_ID.PRICE_ID },
            {Type:DEAL_COLUMN_ID.VOL_ID },
            {Type:DEAL_COLUMN_ID.BS_ID, },
        ];

        if (this.ShowType==3)
        {
            var data=
            [
                {Type:DEAL_COLUMN_ID.PRICE_ID },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER3_ID, Format:{ Type:1 }, Title:"成交量(手)", FloatPrecision:0},
                {Type:DEAL_COLUMN_ID.MULTI_BAR_ID, Title:" " },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"占比", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"竞买率", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" }
            ]
        }
        else if (this.ShowType==2)
        {
            var data=
            [
                {Type:DEAL_COLUMN_ID.PRICE_ID },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER3_ID, Format:{ Type:1 }, Title:"成交量(手)", FloatPrecision:0},
                {Type:DEAL_COLUMN_ID.MULTI_BAR_ID, Title:" " },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"占比", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" },
                //{Type:DEAL_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"竞买率", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" }
            ]
        }

        return data;
    }
            
    Create(divDeal)  //创建图形
    {
        this.DivDeal=divDeal;
        this.Chart=JSDealChart.Init(divDeal);   //把成交明细图绑定到一个Div上

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
        this.Option.Column=this.GetColumn();
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

    ChangeSymbol(symbol, option)
    {
        this.Symbol=symbol;
        this.Chart.ChangeSymbol(symbol, option);
    }

    ChangeShowType(showType, option)
    {
        this.ShowType=showType;
        if (!this.Chart) return;

        this.Chart.SetColumn(this.GetColumn());
        if (option)
        {
            if (option.Symbol) this.Symbol=option.Symbol;
        }
        this.Chart.ChangeSymbol(this.Symbol);
        
    }

    GetVolColor(event, data, obj)
    {

    }

    OnFilterData(event, data, obj)
    {

    }

    GetCustomText(event, data, obj)
    {

    }

    OnSize()  //自适应大小调整
    {
        var height= $(window).height()-50;
        var width = $(window).width();
        this.DivDeal.style.top='0px';
        this.DivDeal.style.left='0px';
        this.DivDeal.style.width=230+'px';
        this.DivDeal.style.height=400+'px';
        this.Chart.OnSize();
    }

    NetworkFilter(data, callback)
    {
        console.log('[DealChart::NetworkFilter] data', data);
        var option={ ShowType:this.ShowType };
        switch(data.Name) 
        {
            default:
                this.HQData.NetworkFilter(data, callback, option);
                break;
        }
    }

    ReloadResource()
    {
        if (this.Chart) 
        {
            this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
            this.Chart.ChangeSymbol(this.Symbol);
        }
    }
}

class MinDealChart extends DealChart
{
    ChangeSymbol(symbol, option)
    {
        this.Symbol=symbol;
        var option=this.GetShowOption();
        this.Chart.ChangeSymbol(symbol, option);
    }

    GetShowOption()
    {
        if (!this.Symbol) return null;

        var upperSymbol=this.Symbol.toUpperCase();
        var option=null;

        if (MARKET_SUFFIX_NAME.IsSHSZStockA(this.Symbol)) 
        {
            option=this.GetSZSHStockShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol)) 
        {
            option=this.GetSZSHStockShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsHK(upperSymbol))
        {
            option=this.GetSZSHStockShowOption();
        }
        else if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol))
        {
            option=this.GetChinaFuturesShowOption();
        }

        return option;
    }

    GetSZSHStockShowOption()
    {
        var column=
        [
            //{Type:DEAL_COLUMN_ID.STRING_TIME_ID }, //自定义时间格式
            //{Type:DEAL_COLUMN_ID.INDEX_ID },
            {Type:DEAL_COLUMN_ID.TIME_ID, Foramt:"hh:mm:ss" },
            {Type:DEAL_COLUMN_ID.PRICE_ID },
            {Type:DEAL_COLUMN_ID.VOL_ID },
            {Type:DEAL_COLUMN_ID.BS_ID, },
        ];

        return { Column:column };
    }

    GetChinaFuturesShowOption()
    {
        var column=
        [
            {Type:DEAL_COLUMN_ID.TIME_ID, Foramt:"hh:mm:ss" },
            {Type:DEAL_COLUMN_ID.PRICE_ID, MaxText:"88888.88" },
            {Type:DEAL_COLUMN_ID.VOL_ID, Title:"现量", MaxText:"88888"},
            {Type:DEAL_COLUMN_ID.RESERVE_STRING1_ID, Title:"仓差", MaxText:"88888", TextAlign:"right" },
            {Type:DEAL_COLUMN_ID.RESERVE_STRING2_ID, Title:"开平", MaxText:"擎擎", TextAlign:"right" },
        ];

        return { Column:column };
    }

    GetColumn()
    {
        if (this.ShowType===0)
        {
            var option=this.GetShowOption();
            if (option) return option.Column;
        }
        else if (this.ShowType==2)
        {
            var data=
            [
                {Type:DEAL_COLUMN_ID.PRICE_ID },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER3_ID, Format:{ Type:1 }, Title:"成交量(手)", FloatPrecision:0},
                {Type:DEAL_COLUMN_ID.MULTI_BAR_ID, Title:" " },
                {Type:DEAL_COLUMN_ID.RESERVE_NUMBER2_ID, Title:"占比", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" },
                //{Type:DEAL_COLUMN_ID.RESERVE_NUMBER1_ID, Title:"竞买率", MaxText:"100.0%", FloatPrecision:1, StringFormat:"{0}%" }
            ];
            return data;
        }

        return null;
    }

    Show(bShow, option)
    {
        if (bShow)
        {
            if (this.DivDeal.style["display"]=="none")
            {
                this.DivDeal.style["display"]="block";
            }

            if (option)
            {
                if (IFrameSplitOperator.IsNumber(option.ShowType)) 
                {
                    if (option.Symbol) 
                    {
                        this.ChangeShowType(option.ShowType, { Symbol: option.Symbol});
                    }
                    else
                    {
                        this.ChangeShowType(option.ShowType);
                    }
                }
                else if (option.Symbol)
                {
                    this.ChangeSymbol(option.Symbol);
                }
            }
        }
        else
        {
            this.DivDeal.style["display"]="none";
        }
    }

    IsShow()
    {
        return this.DivDeal.style["display"]!="none";
    }
}
