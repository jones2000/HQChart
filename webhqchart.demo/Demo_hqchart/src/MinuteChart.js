//分时图
//简单的把K线控件封装下


class MinuteChart
{
    DivKLine=null;
    Chart=null; //JSChart.Init(divKLine, false, false);   //把K线图绑定到一个Div上
    HQData=new HQData();            //数据
    Symbol=null;

    //分时图配置
    Option= {
        Type:'分钟走势图',   //创建图形类型
        //Type:'分钟走势图横屏',

        Windows: //窗口指标
        [
            //{ Index:"AMO", YAxis:{StringFormat:1} },
            { Index:"MACD", AddIndexWindow:true,IsSync:true, IndexHelp:true, },
            
        ], 

        OverlayIndex:
        [

        ],  //叠加指标
        
        Symbol:'600000.sh',         // cf1909.czc
        //Symbol:'HSI.hk',         // cf1909.czc
        IsAutoUpdate:true,          //是自动更新数据
        AutoUpdateFrequency:3000,   //数据更新频率
        DayCount:1,                     //1 最新交易日数据 >1 多日走势图
        IsShowRightMenu:true,       //是否显示右键菜单
        //CorssCursorTouchEnd:true,
        
        //EnableSelectRect:true,

        LatestPointFlash:{ Enable:true, Frequency:500 },

        //BeforeOpen:{ IsShow:true, Width:120, IsShowMultiDay:true, MulitiDayWidth:100 },
        //AfterClose:{IsShow:true, Width:100, IsShowMultiDay:true, MulitiDayWidth:50},

        DragSelectRect:
        {
            Enable:true,
            EnableLButton:true,
        },

        EnableZoomIndexWindow:true,

        EnablePopMenuV2:true,
        EnableDrawToolDialogV2:true,
        EnableNewIndex:true,
        TooltipDialog:{ Enable:false, Style:1 },
        EnableResize:true,
        Minute:{ DragMode:1, },

        MaxDayCount:5,
        
        CorssCursorInfo:
        {  
            HPenType:1,VPenType:1,
            Left:1, Right:1, Bottom:1, 
            //IsFixXLastTime:true, 
            RightButton:{ Enable:false }, 
            //IsOnlyDrawMinute:true 
            //EnableKeyboard:true,
            //IsFixXLastTime:true,
            //IsShowCorssPoint:true,
            EnableDBClick:true,
            TextStyle:{ Right:{ Type:2 }}
        },


        SelectRect:
        {
            ShowRangeText:{ Enable:true, Position:1 },
            //Mark:{ IsShow:true }
        },

        DragSelectRect:
        {
            Enable:true,
            ShowMode:2,
            EnableLButton:true,
        },

        SelectRectDialog:{ Enable:true },

        EnableYDrag:
        {
            Right:true,
            Left:true,
            Wheel:true,
        },

        
        /*
        DragSelectRect:
        {
            Enable:true
        },
        */

        MinuteLine:
        {
            IsDrawAreaPrice:true,      //是否画价格面积图
            //IsShowAveragePrice:false,   //不显示均线
            //SplitType:2,

            
        },

        MinuteTitle:
        {
            IsShowTime:true,
            IsShowName:true,
            IsShowDate:false,
            IsShowVolTitle:true,
            //IsAlwaysShowLastData:true,
            IsTitleShowLatestData:true,

            //ShowPostion:{ Type:0, Margin:{ Bottom:10 } }
        },

        MinuteVol:
        {
            BarColorType:1,
        },

        //Language:'EN',
        //EnableBorderDrag:false,

        IsDrawPictureXY:true,

        SelectedChart:{ EnableSelected: true, EnableMoveOn:true },
        EnableIndexChartDrag:true,

        FloatTooltip:{ Enable:true, },
        SearchIndexDialog:{ Enable:true },
        ModifyIndexParamDialog:{ Enable:true },

        
        EnableNightDayBG:true,
        //EnableBuySellBar:true,

        Border: //边框
        {
            Left:20,    //左边间距
            Right:20,     //右边间距
            Top:25,
            Bottom:25,

            AutoLeft:{ Blank:10, MinWidth:60 },
            AutoRight:{ Blank:10, MinWidth:60 },
        },
        
        Frame:  //子框架设置
        [
            { 
                Custom:
                [
                    { 
                        Type:0,  Position:'right',
                    }
                ]
            },
        ],


        Overlay:    //叠加股票
        [
            //{Symbol:'603190.sh', OverlayType:1, IsCalcuateMaxMin:true, Color:"rgb(250,0,0)" },
            //{Symbol:'000001.sz'},
            //{Symbol:'000151.sz'}
        ],

        ExtendChart:    //扩展图形
        [
            //{Name:'MinuteTooltip' }, //手机端tooltip
            {Name:'MinutePCTooltip' }, //PC端tooltip
        ]
    };
        

    Create(divKLine)  //创建图形
    {
        this.DivKLine=divKLine;
        this.Chart=JSChart.Init(divKLine, false, false);

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;

        //this.Option.EventCallback=[ ];
        
        this.OnCreate();

        this.Option.Symbol=this.Symbol;
        this.Option.ScriptError=(error)=> { this.ExecuteScriptError(error); }
        this.Option.NetworkFilter=(data, callback)=>{  this.NetworkFilter(data, callback); }
        this.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }

        this.Chart.SetOption(this.Option);  //设置K线配置
    }

    OnCreate()
    {

    }

    OnCreateHQChart(chart)
    {

    }

    NetworkFilter(data, callback)
    {
        console.log(`[MinuteChart::NetworkFilter] ${HQData.Explain}`, data);
        var option={ };
        switch(data.Name) 
        {
            default:
                this.HQData.NetworkFilter(data, callback, option);
                break;
        }
    }

    ChangeSymbol(symbol)
    {
        if (this.Chart) this.Chart.ChangeSymbol(symbol);
    }

    Hide()
    {
        this.Chart.JSChartContainer.HideAllPopDiv();
    }

    ChangeDayCount(count)
    {
        if (this.Chart) this.Chart.JSChartContainer.ChangeDayCount(count);
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true , Update:true });  //动态更新颜色配置  
    }

    ShowDrawTool()
    {
        if (!this.Chart || !this.Chart.JSChartContainer) return;
        var hqchart=this.Chart.JSChartContainer;
        var bShow=hqchart.IsShowDrawToolDialog();
        if (!bShow)  hqchart.ExecuteMenuCommand(JSCHART_MENU_ID.CMD_SHOW_DRAWTOOL_ID);
    }

    EnableBeforeOpen()
    {
        if (!this.Chart || !this.Chart.JSChartContainer) return;
        var hqchart=this.Chart.JSChartContainer;
        var bShow=hqchart.IsShowBeforeData && hqchart.IsShowMultiDayBeforeData;
        var data={ Left:!bShow, MultiDay:{ Left:!bShow }};
        hqchart.ExecuteMenuCommand(JSCHART_MENU_ID.CMD_SHOW_CALLCATION_ID,[data]);
    }
}



class MinMinuteChart extends MinuteChart
{
    IsIndexChart=false; //是否是指数图

    OnCreate()
    {
        this.Option=
        {
            Type:'分钟走势图',   //创建图形类型
            //Type:'分钟走势图横屏',

            ////窗口指标
            Windows: [ ], 

            OverlayIndex:[ ],  //叠加指标
        
            Symbol:'600000.sh',         // cf1909.czc
            IsAutoUpdate:true,          //是自动更新数据
            AutoUpdateFrequency:3000,   //数据更新频率
            DayCount:1,                     //1 最新交易日数据 >1 多日走势图
            IsShowRightMenu:false,       //是否显示右键菜单

            Listener:{ KeyDown:false, Wheel:false },
            
            EnableResize:true,

            MinuteLine:
            {
                IsDrawAreaPrice:true,      //是否画价格面积图
                //IsShowAveragePrice:false,   //不显示均线
                //SplitType:2,
            },

            MinuteTitle:
            {
                IsShowTime:true,
                IsShowName:true,
                IsShowDate:false,
                IsShowVolTitle:true,
                //IsAlwaysShowLastData:true,
                IsTitleShowLatestData:true,

                //ShowPostion:{ Type:0, Margin:{ Bottom:10 } }
            },

            MinuteVol:
            {
                BarColorType:1,
            },

            //Language:'EN',
            //EnableBorderDrag:false,

            Border: //边框
            {
                Left:0,    //左边间距
                Right:0,     //右边间距
                Top:25,
                Bottom:1,

                AutoLeft:{ Blank:10, MinWidth:60 },
                AutoRight:{ Blank:10, MinWidth:60 },
            },
        
            Frame:  //子框架设置
            [
                { 
                   
                },
            ],


            Overlay:    //叠加股票
            [
                //{Symbol:'603190.sh', OverlayType:1, IsCalcuateMaxMin:true, Color:"rgb(250,0,0)" },
                //{Symbol:'000001.sz'},
                //{Symbol:'000151.sz'}
            ],

            ExtendChart:    //扩展图形
            [
               
            ]
        };
    }

    OnCreateHQChart(chart)
    {
        //去掉鼠标操作
        chart.UIElement.onmousemove=(e)=>{ }
        chart.UIElement.ondblclick=(e)=>{  }
        chart.UIElement.onmousedown=(e)=> {  }

        //uielement.oncontextmenu=(e)=> { return this.UIOnContextMenu(e); }
        //uielement.onmouseout=(e)=>{ this.UIOnMounseOut(e); }
        //uielement.onmouseleave=(e)=>{ this.UIOnMouseleave(e); }
    }

    Show(bShow, option)
    {
        if (bShow)
        {
            if (this.DivKLine.style["display"]=="none")
            {
                this.DivKLine.style["display"]="block";
            }

            if (option)
            {
                if (IFrameSplitOperator.IsBool(option.IsIndexChart)) this.IsIndexChart=option.IsIndexChart;
                if (option.Symbol) this.ChangeSymbol(option.Symbol);
            }
        }
        else
        {
            this.DivKLine.style["display"]="none";
        }
    }

    IsShow()
    {
        return this.DivKLine.style["display"]!="none";
    }
}
