

class OrderChart
{
    DivOrder=null;
    Chart=null;   //把报价列表绑定到一个Div上
    Name="OrderChart";
    HQData=new HQData();            //数据

    Symbol=null;    //"MO2601.cffex";
    
    MoveOnCellCallback=null;

    Option= 
    {
        Type:'价格明细',            //创建图形类型
        
        Symbol:'600000.sh',
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:5000,   //数据更新频率

        Column:
        {
            Left:
            { 
                Data:
                [ 
                    { Type:ORDER_COLUMN_ID.RESERVE_NUMBER1_ID, TextAlign:"center", TextColor:"rgb(255,215,0)", Title:"买量", TitleAlign:"center", FloatPrecision:0, MoveOn:{ LineColorID:6, LineWidth:2 }}, 
                    { Type:ORDER_COLUMN_ID.RESERVE_NUMBER2_ID, TextAlign:"center", Title:"买5档", FloatPrecision:0, MoveOn:{ LineColorID:6, LineWidth:2 } },
                ] 
            },

            Right:
            { 
                Data:
                [ 
                    { Type:ORDER_COLUMN_ID.RESERVE_NUMBER3_ID, TextAlign:"center", TextColor:"rgb(0,0,255)", Title:"卖5档", TitleAlign:"center", FloatPrecision:0, Format:{ Type:3 }, MoveOn:{ LineColorID:7, LineWidth:2 } }, 
                    { Type:ORDER_COLUMN_ID.RESERVE_NUMBER4_ID, TextAlign:"center", TextColor:"rgb(0,0,255)", Title:"卖量", TitleAlign:"center", FloatPrecision:0, MoveOn:{ LineColorID:7, LineWidth:2 } }, 
                ] 
            },

            Center:{ Type:ORDER_COLUMN_ID.PRICE_ID, TextAlign:"center", TextColor:"rgb(255,215,0)", Title:"价格", }
        },
        
        Header:
        {
            IsShow:true,
            IsShowBorder:false
        },

        //KeyDown:false,
        //Wheel:false,

        //BorderLine:0,

        EnableSelected:true,

        EnableResize:true,
        
        Border: //边框
        {
            Left:5,         //左边间距
            Right:5,       //右边间距
            Bottom:5,      //底部间距
            Top:5          //顶部间距
        }
    };


    Create(divOrder)  //创建图形
    {
        this.DivOrder=divOrder;
        this.Chart=JSOrderChart.Init(divOrder)
        
        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        
        this.Option.EventCallback= 
        [ 
            {   
                event:JSCHART_EVENT_ID.ON_MOVEON_ORDER_CELL, 
                callback:(event, data, obj)=>{ this.OnMoveOnCell(event, data, obj); }  
            },
            {
                event:JSCHART_EVENT_ID.ON_CLICK_ORDER_CELL,
                callback:(event, data, obj)=>{ this.OnClickCell(event, data, obj); }  
            }
        ];


        this.OnCreate();

        this.Option.Symbol=this.Symbol;
        this.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };

        this.Chart.SetOption(this.Option);  //设置配置
    }

    OnCreate()
    {

    }

    OnCreateHQChart(chart)
    {
        
    }

    ChangeSymbol(symbol)
    {
        this.Symbol=symbol;
        if (this.Chart) this.Chart.ChangeSymbol(symbol);
    }

    NetworkFilter(data, callback)
    {
        console.log(`[OrderChart::NetworkFilter] ${HQData.Explain}`, data);
        var option={ ChartName:this.Name };
        switch(data.Name) 
        {
            default:
                this.HQData.NetworkFilter(data, callback, option);
                break;
        }
    }


    OnMoveOnCell(event, data, obj)
    {
        if (this.MoveOnCellCallback) this.MoveOnCellCallback(data, obj);
    }

    OnClickCell(event, data, obj)
    {
        console.log(`[OrderChart::OnClickCell] data=`, data);
        if (data.Data && data.Data.CellInfo)
        {
            var cell=data.Data.CellInfo;
            var price=data.Data.Price;
            var log=`Todo:\r\n${obj.Symbol} ${price} ${cell.Type==1?"买入 xxxx 手":"卖出 xxxx 手"}`;
            alert(log);
        }
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true , Update:true });  //动态更新颜色配置  
    }

}