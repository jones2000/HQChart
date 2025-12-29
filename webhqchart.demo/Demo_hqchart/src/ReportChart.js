//自选股列表

class ReportChart
{
    DivReport=null;
    Chart=null              //JSReportChart.Init(divReport);   //把报价列表绑定到一个Div上
    HQData=new HQData();            //数据
    OnClickRowCallback=null;

    //配置信息
    Option= 
    {
        Type:'报价列表',   //创建图形类型
        
        Symbol:"自选股1",  //板块代码
        Name:"自选股1",

        IsAutoUpdate:true,              //是自动更新数据
        AutoUpdateFrequency:10000,      //数据更新频率
        
        //显示列
        Column:
        [
            {Type:REPORT_COLUMN_ID.SYMBOL_NAME_ID ,Sort:1 ,SortType:[0], Title:"名称", MaxText:"擎擎擎擎擎擎", ChartTooltip:{ Enable:true, Type:20 }, },
            //{ Type:REPORT_COLUMN_ID.PRICE_ID, Sort:1, MaxText:"88888.88" },
            { 
                Type:REPORT_COLUMN_ID.CLOSE_LINE_ID, IsDrawArea:true, MaxText:"88888.88",EnablePopupHeaderMenu:true,LineColorType:1,
                Icon:
                { 
                    Family:"iconfont", Size:14*GetDevicePixelRatio(), Symbol:"\ue620", Color:"rgb(169,169,169)", Margin:{Left:2, Bottom:0 },
                    //Tooltip:{ Data:{ AryText:[ {Title:"切换字段:", Color:"rgb(255,0,0)", Text:"切换字段"} ] } }
                },
            },
            { 
                Type:REPORT_COLUMN_ID.MULTI_LINE_CONTAINER, Sort:1, SortSubField:0,
                Title:"涨幅",TextAlign:"center", MaxText:"1000.88%",TextAlign:"right",
                AryField:
                [ 
                    { Type:REPORT_COLUMN_ID.PRICE_ID },
                    { Type:REPORT_COLUMN_ID.INCREASE_ID, DynamicFormat:"{Value}%" }
                ],
                TextColor:"rgb(250,250,250)",
            },
        ],
        
        FixedColumn:2,      //固定列

        SortInfo:{ Field:2, Sort: 1 },   //默认排序信息

        //IsShowHeader:false,

        //KeyDown:false,
        //Wheel:false,

        //BorderLine:0,
        //SelectedModel:1,

        EnablePopMenuV2:true,
        EnableDragRow:true,
        EnableDragHeader:true,
        CellBorder:{ IsShowVLine:false, IsFullLine:false },
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
            Enable:true,
            Option:{ EnableResize:false }
        },

        VScrollbar:{ Enable:true , Style:1, BarWidth:3 , Margin:{ Left:0, Right:0, Top:1, Bottom:1 }},

        WheelPage:{ Type:1 },
        SelectedModel:1,
        PageUpDownCycle:false,
        BottomTab:{ IsShow:false },
        FloatTooltip:{ Enable:true },
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
            }
        ];

        this.Chart.SetOption(this.Option);  //设置配置
    }

    NetworkFilter(data, callback)
    {
        console.log('[ReportChart::NetworkFilter] data', data);
        var option={ ChartName:"SelfReportChart" };
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

    RequestMemberListData(data, callback)
    {
        var symbol=data.Request.Data.symbol;    //板块代码
        data.PreventDefault=true;

        var SELF_STOCK_LIST=
        [
            "000400.sz","000682.sz","002058.sz","002090.sz","002121.sz","002169.sz","002184.sz","002322.sz","002334.sz","002339.sz",
            "002527.sz","002546.sz","002767.sz","002979.sz","300018.sz","300040.sz","300048.sz","300124.sz","300208.sz","300286.sz",
            "300360.sz","300407.sz","300427.sz","300466.sz","300484.sz","300490.sz","300514.sz","300745.sz","300880.sz",
            "300882.sz","301179.sz","600268.sh","600406.sh","600525.sh","600590.sh","601126.sh","601222.sh","601567.sh","603015.sh",
            "603025.sh","603050.sh","603063.sh","603100.sh","603416.sh","603583.sh","603859.sh","605288.sh","688191.sh","688248.sh",
            "688330.sh","688337.sh","688395.sh","688597.sh","688611.sh","688616.sh","688681.sh","688698.sh","688777.sh", "300356.sz",
        ];

        var SELF_STOCK_LIST=["600000.sh", "000001.sz","399006.sz", "000151.sz","000001.sh", "ICL8.cfe"];

        var hqchartData={ symbol:symbol , name:symbol, data:SELF_STOCK_LIST };
        
        console.log("[ReportChart::RecvMemberListDataV2] hqchartData",hqchartData);
        callback(hqchartData);
    }

    OnClickRow(event, data, obj)
    {
        console.log("[ReportChart::OnClickRow] data=",data);
        if (this.OnClickRowCallback) this.OnClickRowCallback(data, obj);
    }

    OnCreateHeaderMenu(event, data, obj)
    {
        console.log("[ReportChart::OnCreateHeaderMenu] data=",data);

        var e=data.e;
        var aryTDClassName=
        [
            "UMyChart_MenuItem_Td_Status",      //图标
            "UMyChart_MenuItem_Td_Content",     //文字
            "UMyChart_MenuItem_Td_None",        //快捷方式
            "UMyChart_MenuItem_Td_Arrow"        //箭头
        ];
        
        var Menu=
        [ 
            { Name:"分时简图",  Data:{ ID:"CMD_CHANGE_FILED", Args:[{ Type:REPORT_COLUMN_ID.CLOSE_LINE_ID} ] }, AryTDClassName:aryTDClassName, Checked: data.Column.Type==REPORT_COLUMN_ID.CLOSE_LINE_ID  },  
            { Name:"日K简图",  Data:{ ID:"CMD_CHANGE_FILED", Args:[{ Type:REPORT_COLUMN_ID.KLINE_ID}] },  AryTDClassName:aryTDClassName, Checked: data.Column.Type==REPORT_COLUMN_ID.KLINE_ID },  
            { Name:"现价",  Data:{ ID:"CMD_CHANGE_FILED", Args:[{ Type:REPORT_COLUMN_ID.PRICE_ID} ]},  AryTDClassName:aryTDClassName, Checked: data.Column.Type==REPORT_COLUMN_ID.PRICE_ID  },  
        ];

        data.MenuData.Menu=Menu;

        if(e.preventDefault) e.preventDefault();
        if(e.stopPropagation) e.stopPropagation();
    }

    OnMenuCommand(event, data, obj)
    {
        console.log("[ReportChart::OnMenuCommand] data=",data);
        if (data.CommandID=="CMD_CHANGE_FILED")
        {
            var type=data.Args[0].Type;
            if (type==REPORT_COLUMN_ID.KLINE_ID)
            {
                var columnItem=
                {
                    Type:REPORT_COLUMN_ID.KLINE_ID, MaxText:"88888.88",EnablePopupHeaderMenu:true, TitleAlign:"right", FixedWidth:null,
                    Icon:
                    { 
                        Family:"iconfont", Size:14*GetDevicePixelRatio(), Symbol:"\ue620", Color:"rgb(169,169,169)", Margin:{Left:2, Bottom:0 },
                        //Tooltip:{ Data:{ AryText:[ {Title:"切换字段:", Color:"rgb(255,0,0)", Text:"切换字段"} ] } }
                    },
                };
                obj.ChangeColumn(1, columnItem, { Redraw:true });
                obj.UpdateStockData();
            }
            else if (type==REPORT_COLUMN_ID.CLOSE_LINE_ID)
            {
                var columnItem=
                { 
                    Type:REPORT_COLUMN_ID.CLOSE_LINE_ID, IsDrawArea:true, MaxText:"88888.88",EnablePopupHeaderMenu:true, TitleAlign:"right",LineColorType:1,
                    Icon:
                    { 
                        Family:"iconfont", Size:14*GetDevicePixelRatio(), Symbol:"\ue620", Color:"rgb(169,169,169)", Margin:{Left:2, Bottom:0 },
                        //Tooltip:{ Data:{ AryText:[ {Title:"切换字段:", Color:"rgb(255,0,0)", Text:"切换字段"} ] } }
                    },
                };
                obj.ChangeColumn(1, columnItem, { Redraw:true });
                obj.UpdateStockData();
            }
            else if (type==REPORT_COLUMN_ID.PRICE_ID)
            {
                var columnItem=
                {
                    Type:REPORT_COLUMN_ID.PRICE_ID, MaxText:"88888.88",EnablePopupHeaderMenu:true, TextAlign:"right",
                    Icon:
                    { 
                        Family:"iconfont", Size:14*GetDevicePixelRatio(), Symbol:"\ue620", Color:"rgb(169,169,169)", Margin:{Left:2, Bottom:0 },
                        //Tooltip:{ Data:{ AryText:[ {Title:"切换字段:", Color:"rgb(255,0,0)", Text:"切换字段"} ] } }
                    },
                };
                obj.ChangeColumn(1, columnItem, { Redraw:true });
            }
        }
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true });  //动态更新颜色配置  
    }

}
