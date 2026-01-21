/////////////////////////////////////////////////////////////////////
//  T型报价
//
//

class TReportChart
{
    DivReport=null;
    Chart=null;   //把报价列表绑定到一个Div上
    Name="TReportChart";
    HQData=new HQData();            //数据

    Symbol="MO2601.cffex";
    Underlying={ Symbol:null, Name:null };                          //标的物
    PeriodData={ AryData:null, Selected:null };                      //周期

    AllProduct={ AryData:null };     //{ Underlying:{ Symbol: }, Period:, AryData:[]    }

    OnClickRowCallback=null;
    OnRecvStockListCallback=null;

    //配置信息
    Option= 
    {
        Type:'T型报价列表',   //创建图形类型
        
        Symbol:"MO2601.cffex",  //合约代码
        Name:"MO2601",        //合约名称

        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:3000,   //数据更新频率

        EnableResize:true,

        MinuteChartTooltip:{ Enable:true },
        //FloatTooltip:{ Enable:true },

        //显示列
        Column:
        [
            { Type:TREPORT_COLUMN_ID.PRICE_ID ,MaxText:"888.88", ID:1, ID:TREPORT_COLUMN_ID.PRICE_ID },
            { Type:TREPORT_COLUMN_ID.INCREASE_ID },
            { Type:TREPORT_COLUMN_ID.AMPLITUDE_ID, MaxText:"888.88"},
             
            { Type:TREPORT_COLUMN_ID.AMOUNT_ID,},
            { Type:TREPORT_COLUMN_ID.VOL_ID,},
            { Type:TREPORT_COLUMN_ID.BUY_PRICE_ID ,MaxText:"8888.88" , ID:TREPORT_COLUMN_ID.BUY_PRICE_ID },
            { Type:TREPORT_COLUMN_ID.BUY_VOL_ID, MaxText:"8888" },
            { Type:TREPORT_COLUMN_ID.SELL_PRICE_ID ,MaxText:"8888.88", ID:TREPORT_COLUMN_ID.SELL_PRICE_ID },
            { Type:TREPORT_COLUMN_ID.SELL_VOL_ID, MaxText:"8888" },
            { Type:TREPORT_COLUMN_ID.POSITION_ID, MaxText:"88888"},
            { Type:TREPORT_COLUMN_ID.NAME_ID, EnableChartTooltip:true, },
        ],

        //FixedRowCount:3,   //固定行
        
        //IsShowHeader:false,

        //KeyDown:false,
        //Wheel:false,

        //EnablePageCycle:true,
        
        Border: //边框
        {
            Left:0,        //左边间距
            Right:0,       //右边间距
            Bottom:1,      //底部间距
            Top:1          //顶部间距
        },
    };
            
    Create(divReport)  //创建图形
    {
        this.DivReport=divReport;
        this.Chart=JSTReportChart.Init(divReport)
        
        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        
        this.Option.EventCallback= 
        [ 
            {   //单击
                event:JSCHART_EVENT_ID.ON_CLICK_TREPORT_ROW, 
                callback:(event, data, obj)=>{ this.OnClickRow(event, data, obj); }  
            },
            /*
            {   //右键单击
                event:JSCHART_EVENT_ID.ON_RCLICK_TREPORT_ROW, 
                callback:(event, data, obj)=>{ this.OnRClickRow(event, data, obj); }  
            },

            {   //双击
                event:JSCHART_EVENT_ID.ON_DBCLICK_TREPORT_ROW, 
                callback:(event, data, obj)=>{ this.OnDBClickRow(event, data, obj); }  
                
            },

            {   //滚轴 键盘选中行
                event:JSCHART_EVENT_ID.ON_MOVE_SELECTED_TREPORT_ROW, 
                callback:(event, data, obj)=>{ this.OnMoveSelectedRow(event, data, obj); }  
                
            },

            {   //单击表头
                event:JSCHART_EVENT_ID.ON_CLICK_TREPORT_HEADER, 
                callback:(event, data, obj)=>{ this.OnClickHeader(event, data, obj); }  
            },
            {   //右键单击表头
                event:JSCHART_EVENT_ID.ON_RCLICK_TREPORT_HEADER, 
                callback:(event, data, obj)=>{ this.OnRClickHeader(event, data, obj); }  
            },
            */
        ];
        

        this.OnCreate();

        this.Option.Symbol=this.Symbol;
        this.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); };
        //this.Option.MinuteChartTooltip.OnCreateCallback=(chart)=>{ this.OnCreateMinuteChart(chart); }

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
        this.PeriodData.Selected=null;
        this.PeriodData.AryData=null;
        this.Symbol=symbol;
        if (this.Chart) this.Chart.ChangeSymbol(symbol);
    }

    ChangePeriod(period, underlyingSymbol)
    {
        this.PeriodData.Selected={ Period:period, UnderlyingSymbol:underlyingSymbol };
        var symbol=`${this.Symbol}|${period}`;
        this.Symbol=symbol;
        if (this.Chart) this.Chart.ChangeSymbol(this.Symbol);
    }

    OnCreateMinuteChart=function(chart)
    {
        console.log('[ReportChart::OnCreateMinuteChart] data', chart);
    }

    NetworkFilter(data, callback)
    {
        console.log(`[TReportChart::NetworkFilter] ${HQData.Explain}`, data);
        var option={ ChartName:this.Name, Underlying:this.Underlying, AllProduct:this.AllProduct, PeriodData:this.PeriodData, MainSymbol:this.Symbol };
        switch(data.Name) 
        {
            case "JSTReportChartContainer::RequestStockListData":
                option.Callback=()=>{ if (this.OnRecvStockListCallback) this.OnRecvStockListCallback(this); }
                this.HQData.TReport_RequestStockListDataV2(data, callback, option);
                break;
            default:
                this.HQData.NetworkFilter(data, callback, option);
                break;
        }
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

    
    OnClickRow(event, data, obj)
    {
        console.log('[TReportChart::OnClickRow] event, data', event , data);
        if (this.OnClickRowCallback) this.OnClickRowCallback(data, obj, this);
    }

    OnRClickRow(event, data, obj)
    {
        console.log('[TReportChart::OnRClickRow] event, data', event , data);
    }

    OnDBClickRow(event, data, obj)
    {
        console.log('[ReportChart::OnDBClickRow] event, data', event , data);
    }

    OnClickHeader(event, data, obj)
    {
        console.log('[ReportChart::OnClickHeader] event, data', event , data);
    }

    OnRClickHeader(event, data, obj)
    {
        console.log('[ReportChart::OnRClickHeader] event, data', event , data);
    }  

    OnMoveSelectedRow(event, data, obj)
    {
        console.log('[ReportChart::OnMoveSelectedRow] event, data', event , data);
    }

    GetRowRect()
    {
        var chart=this.Chart.JSChartContainer.GetTReportChart();
        var data=chart.GetRowRect({ RowIndex:5});

        var item=data.AryLeftRect[data.AryLeftRect.length-1];
        var left=item.Rect.Left/data.PixelRatio;
        var top=item.Rect.Top/data.PixelRatio;

        var tooltip=$("#floatTooltip")[0];
        tooltip.style.top=`${top}px`;
        tooltip.style.left=`${left}px`;
    }
}
