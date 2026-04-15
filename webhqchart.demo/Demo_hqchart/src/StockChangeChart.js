//盘口异动


 //简单的盘口异动图表, 支持小窗口和完整模式两种显示方式
class StockChangeChart
{
    DivDeal=null;
    Chart=null;   //把成交明细图绑定到一个Div上
    HQData=new HQData();            //数据
    ShowType=0; //0=成交明细(小窗口) 1=成交明细(完整模式)
    Symbol="SH|SZ";
    CacheData={ Time:0, Keys:new Set() };  //数据缓存, 避免重复数据
    OnDBClickRowCallback=null;

    //K线配置信息
    Option= 
    {
        Type:'成交明细',   //创建图形类型
        
        Symbol:'SH|SZ',
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:10000,   //数据更新频率

        Column:
        [
            {Type:DEAL_COLUMN_ID.TIME_ID, Foramt:"hh:mm:ss" },
            {Type:DEAL_COLUMN_ID.PRICE_ID },
            {Type:DEAL_COLUMN_ID.VOL_ID },
            {Type:DEAL_COLUMN_ID.BS_ID, },
        ],

        ShowOrder:0,
        EnableResize:true,
        IsSingleTable:true,
        IsShowHeader:true,
        EnableSelected:true,

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
            {Type:DEAL_COLUMN_ID.RESERVE_STRING1_ID, Title:"时间", MaxText:"88:88:88" },
            {Type:DEAL_COLUMN_ID.RESERVE_STRING2_ID, Title:"名称",TextAlign:"center", ChartTooltip:{ Enable:true, Type:20 }, MaxText:"擎擎擎擎-W" },
            {Type:DEAL_COLUMN_ID.RESERVE_STRING3_ID, Title:"类型", TextAlign:"center", MaxText:"擎擎擎擎擎擎" },
            {Type:DEAL_COLUMN_ID.RESERVE_STRING4_ID, Title:"相关信息" , ColorType:1, MaxText:"100.00擎"},
        ];

        return data;
    }
            
    Create(divDeal)  //创建图形
    {
        this.DivDeal=divDeal;
        this.Chart=JSDealChart.Init(divDeal);   //把成交明细图绑定到一个Div上

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };
        this.Option.Column=this.GetColumn();
        this.Option.Symbol=this.Symbol;

        this.Option.EventCallback= 
        [ 
           {
                event:JSCHART_EVENT_ID.ON_DBCLICK_DEAL_ROW,
                callback:(event, data, obj)=>{ this.OnDBClickRow(event, data, obj); }  
            }
        ];

        this.OnCreate();

        this.Chart.SetOption(this.Option);  //设置配置
    }

    OnCreate()
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
        console.log('[StockChangeChart::NetworkFilter] data', data);
        var option={ ChartName:"StockChangeChart" , Cache:this.CacheData };
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

    Show(bShow, option)
    {
        if (bShow)
        {
            if (this.DivDeal.style["display"]=="none")
            {
                this.DivDeal.style["display"]="block";
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

    OnDBClickRow(event, data, obj)
    {
        console.log('[StockChangeChart::OnDBClickRow] event, data, obj', event, data, obj);
        if (this.OnDBClickRowCallback) this.OnDBClickRowCallback(data, obj, this);
    }
}