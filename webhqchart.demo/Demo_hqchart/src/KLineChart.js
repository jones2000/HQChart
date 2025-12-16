//简单的把K线控件封装下
class KLineChart
{
    DivKLine=null;
    Chart=null; //JSChart.Init(divKLine, false, true);   //把K线图绑定到一个Div上
    HQData=new HQData();            //数据

    JSPopMenu=null;
    Symbol=null;
    
    //K线配置信息
    Option= 
    {
        Type:'历史K线图',   //创建图形类型
        //Type:'历史K线图横屏',

        //EnableBorderDrag:false,
        
        Windows: //窗口指标
        [
            /*
            {
                Name:'MA测试', Description:'均线', IsMainIndex:true,KLineType:-1, IsShortTitle:true,
                Args:[ { Name:'M1', Value:5}, { Name:'M2', Value:10 }, { Name:'M3', Value:20} ],
                OutName:[ {Name:'MA1',DynamicName:"MA{M1}" },  {Name:'MA2',DynamicName:"MA{M2}" },{Name:'MA3',DynamicName:"MA{M3}" }],
                Script: //脚本
                    'MA1:MA(CLOSE,M1);\n\
                    MA2:MA(CLOSE,M2);\n\
                    MA3:MA(CLOSE,M3);'
            },
            */

            { Index:"MA", Overlay:true, AddIndexWindow:true, Export:true, IsSync:true,IndexHelp:true },
            { Index:"VOL", Overlay:true, Export:true, IsSync:true, IndexHelp:true},
            { Index:"MACD", Overlay:true, Export:true, IsSync:true, IndexHelp:true},
            { Name:"测试", FloatPrecision:4, Script:
                //"T:=DYNAINFO(3);T2:=DYNAINFO(37);"
                
                /*
                `收:C("600999.SH"), NODRAW;
                    开:O("600999.SH"), NODRAW;;
                    低:L("600999.SH"), NODRAW;;
                    高:H("600999.SH"), NODRAW;
                    DRAWKLINE(高,开,低,收), COLORYELLOW;`
                */
                    
                /*
                `收:INDEXC, NODRAW;
                开:INDEXO, NODRAW;;
                低:INDEXL, NODRAW;;
                高:INDEXH, NODRAW;
                DRAWKLINE(高,开,低,收), COLORYELLOW;`
                */
               //`STKINDI('sz300059','KDJ.K#WEEK',9,4,4,)`
               //`T:CAPITAL;`
               //`T:DYNAINFO(37);`
               `FINANCE(7);`
            }
            
        ], 

        OverlayIndex:
        [
            
        ],  //叠加指标

        
        //OverlayIndexFrameWidth:1,
        //DragDownload: { Day:{ Enable:true } , Minute:{ Enable:true }}, 

        EnableZoomUpDown:
        {
            //Wheel:false,
            //Keyboard:false,
            //Touch:false,
        },

        EnableYDrag:
        {
            Right:true,
            Left:true,
            Wheel:true,
        },

        EnableXDrag:{ Bottom:true, LButton:{ Type:1 }, RButton:{ Type:2 }},

        //PressKeyboardConfig:{ PauseUpdate:true },

        //Language:'EN',

        Symbol:"600000.sh",
        IsAutoUpdate:false,       //是自动更新数据
        AutoUpdateFrequency:5000,   //数据更新频率
        //TradeIndex: {Index:'交易系统-BIAS'},    //交易系统
        IsApiPeriod:true,

        SplashTitle:'加载数据中......',

        IsShowRightMenu:true,          //右键菜单
        //CorssCursorTouchEnd:true,
        //IsClickShowCorssCursor:true,
        //IsCorssOnlyDrawKLine:true,

        CtrlMoveStep:10,
        EnablePopMenuV2:true,
        EnableDrawToolDialogV2:true,
        EnableModifyDrawDialogV2:true,
        EnableResize:true,
        EnableTooltipDialog:true,

        TooltipDialog:{ Enable:true, Style:0, IndexTitle:{ Enable:false }, MaxRowCount:50 },
        SelectRectDialog:{ Enable:true },
        KLineTooltip:{ Enable:true, EnableKeyDown:false },
        FloatTooltip:{ Enable:true, },
        SmallFloatTooltip:{ Enable:true, Style:1  },
        SearchIndexDialog:{ Enable:true, },
        ModifyIndexParamDialog:{ Enable:true, EnableRestoreParam:false },

        LatestPointFlash:{ Enable:true, Frequency:500 },

        KeyboardMove:{ Delay:50, PressTime:500 },

        //DataMove:{ Mouse:{ EnableLR:false } },

        //双击K线图 弹分时图配置
        PopMinuteChart:
        { 
            Enable:true, 
            EnableMarkBG:true,
            Option:
            { 
                Windows:
                [
                    { Index:"RSI", Overlay:false,MaxMin:false }
                ]
            }
        },

        //EnableVerifyRecvData:true,

        CorssCursorInfo: 
        { 
            Right:1, Bottom:1, DateFormatType:3, HPenType:0, VPenType:0, IsShowClose:false, VLineType:0,RightButton:{ Enable:true }, 
            IsShowCorss:true, PriceFormatType:0, DataFormatType:0, 
            EnableKeyboard:true,
            EnableDBClick:true,
            RangeIncrease:{ IsShow:true, Formula:1 }
            //IsShowIncrease:false,
        },

        EnableZoomIndexWindow:true,

        DrawTool:       //画图工具
        {
            //StorageKey:'4E7EA133-D6C8-4776-9869-1DDDCC5FA788', EnableCrossPeriod:true,
        },

        KLine:  //K线设置
        {
            DragMode:1,                 //拖拽模式 0=禁止拖拽 1=数据拖拽 2=区间选择
            Right:0,                    //复权 0 不复权 1 前复权 2 后复权
            Period:0,                   //周期 0 日线 1 周线 2 月线 3 年线 
            MaxRequestDataCount:8000,   //数据个数
            MaxRequestMinuteDayCount:100, //分钟数据获取几天数据  默认取5天数据
            
            //Info:["互动易","大宗交易",'龙虎榜',"调研","业绩预告","公告"],       //信息地雷
            //Info:["公告"], 
            //InfoPosition:0,
            IsShowTooltip:true,                 //是否显示K线提示信息
            DrawType:0,      //K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
            //FirstShowDate:20161201,
            //KLineDoubleClick:true, //禁止双击弹框 (废弃 使用(PopMinuteChart:{ }))
            RightSpaceCount:2,
            ZoomType:0,
            //OneLimitBarType:1,
            
            //PageSize:30,               //一屏显示多少数据
            //DataWidth:10,
            PageSizeV2:50,

            PriceGap:{ Enable:true, Count:3 },

            //EnablePrediction:true,      //启动预测线,
            EnableDaySummary:true,
        },

        StepPixel:0,

        IsDrawPictureXY:true,

        Listener:
        {
            //KeyDown:false,
            //Wheel:false
        },

        SelectedChart:{ EnableSelected: true, EnableMoveOn:true },
        EnableIndexChartDrag:true,

        GlobalOption:{ SelectedBorder:{ Mode:1} },

        SelectRect:
        {
            //Mark:{ IsShow:true, Position:{ Top:"TopEx" } },
            //PreventClose:true,
        },

        KLineTitle: //标题设置
        {
            IsShowName:true,       //不显示股票名称
            IsShowSettingInfo:true, //不显示周期/复权
            IsTitleShowLatestData:true,
            //IsShowDateTime:false,
        },

        //DragDownload: { Day:{ Enable:true } },   //拖拽下载

        
        DragSelectRect:
        {
            Enable:true,
            ShowMode:2,
            EnableRButton:false,    //左键区间选择
            EnableLButton:false,     //右键区间选择
            //ZIndex:3,
        },

        KLineCountDown:
        {
            //Enable:true,
        },

        DragKLine:
        {
            //EnableShfit:false,
        },
        
        Border: //边框
        {
            Left:0,        //左边间距
            Right:20,       //右边间距
            Bottom:20,      //底部间距
            Top:25,         //顶部间距

            AutoLeft:{ Blank:10, MinWidth:80 },
            AutoRight:{ Blank:5, MinWidth:80 },
        },
        
        Frame:  //子框架设置
        [
            {
                IsShowLeftText:false,
                Custom:
                [
                    { Type:0, Position:'right', LineType:1 }, 
                ]
            },

            {  IsShowLeftText:false, },
            {  IsShowLeftText:false, }
        ],

        ExtendChart:    //扩展图形
        [
            
        ],


        Overlay:
        [
            //{ Symbol:'399300.sz', DrawType:1, Color:'rgb(0,0,255)'},
            //{ Symbol:'600999.sh' }
        ],
    };

    constructor()
    {
        this.JSPopMenu=new JSPopMenu();
        this.JSPopMenu.Inital();
    }
            
    Create(divKLine)  //创建图形
    {
        this.DivKLine=divKLine;
        this.Chart=JSChart.Init(divKLine, false, true);
        //$(window).resize(function() { self.OnSize(); });    //绑定窗口大小变化事件
        //$(window).resize(function() { self.OnSize(  ); });    //绑定窗口大小变化事件

        var wsClient=new HQChartWSClient();
        wsClient.Create();
        this.HQData.WSClient=wsClient;
        
        //自定义函数和变量
        JSComplier.AddFunction({ Name:'FUNC_ALPHA', Description:'自定义Alpha函数', IsDownload:true, Invoke:(obj)=>{ return HQData.FUNC_ALPHA(obj); } } );
        JSComplier.AddVariant({ Name:'VAR_DEMO',   Description:'自定义变量1' } );

        this.Option.EventCallback=
        [
            {
                event:JSCHART_EVENT_ID.ON_SPLIT_YCOORDINATE, 
                callback:(event, data, obj)=>{ this.OnSplitYCoordinate(event, data, obj); }
            },
            {
                event:JSCHART_EVENT_ID.ON_SPLIT_XCOORDINATE, 
                callback:(event, data, obj)=>{ this.OnSplitXCoordinate(event, data, obj); }
            },
            {
                event:JSCHART_EVENT_ID.ON_CLICK_CROSSCURSOR_RIGHT, 
                callback:(event, data, obj)=>{ this.ClickCrossCursor(event, data, obj); }
            },
            {
                event:JSCHART_EVENT_ID.ON_CLICK_CHART_PAINT, 
                callback:(event, data, obj)=>{ this.OnClickChartPaint(event, data, obj); }
            }
        ];

        //this.Chart.CreateExtraCanvasElement(JSChart.CorssCursorCanvasKey, { ZIndex:5 }); //十字光标单独一个图层
        this.OnCreate();

        this.Option.Symbol=this.Symbol;
        this.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Option.ScriptError=(error)=> { this.ExecuteScriptError(error); }
        this.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        this.Chart.SetOption(this.Option);  //设置K线配置
        this.Chart.SetFocus();
    }

    OnCreate()
    {

    }

    OnCreateHQChart(chart)
    {
        
    }

    ExecuteScriptError(error)
    {
         console.warn(`[KLineChart::ExecuteScriptError]`, error);
    }

    NetworkFilter(data, callback)
    {
        console.log(`[KLineChart::NetworkFilter] ${HQData.Explain}`, data);
        var option={ };
        switch(data.Name) 
        {
            default:
                this.HQData.NetworkFilter(data, callback, option);
                break;
        }
    }

    OnSplitYCoordinate(event, data ,obj)
    {
        
    }

    OnSplitXCoordinate(event, data, obj)
    {
        
    }

    OnSize(option)  //自适应大小调整
    {
        var height= $(window).height()-300;
        var width = $(window).width();
        
        this.DivKLine.style.top='0px';
        this.DivKLine.style.left='0px';
        //this.DivKLine.style.width=width+'px';
        this.DivKLine.style.height=height+'px';
        //this.Chart.OnSize(option);
    }

    ClickCrossCursor(event, data, obj)
    {
        console.log('[KLineChart::ClickCrossCursor] event, data', event , data); //打印信息
    }

    
    Hide()
    {
        this.Chart.JSChartContainer.HideAllPopDiv();
    }

    ChangePeriod(value)
    {
        if (this.Chart) this.Chart.JSChartContainer.ChangePeriod(value);
    }

    ChangeSymbol(symbol, option)
    {
        if (this.Chart) this.Chart.ChangeSymbol(symbol, option);
    }

    ReloadResource()
    {
        if (this.Chart) this.Chart.ReloadResource({ Resource:null, Draw:true , Update:true });  //动态更新颜色配置  
    }


    EnableStockChip()
    {
        if (!this.Chart || !this.Chart.JSChartContainer) return;

        var hqchart=this.Chart.JSChartContainer;
        var bShowStockChip=false;
        if (hqchart.GetStockChipChart()) bShowStockChip=true;       //筹码
        var stockChipConfig={Name:'StockChip', ShowType:1, Width:230 };

        if (bShowStockChip)
        {
            hqchart.ExecuteMenuCommand(JSCHART_MENU_ID.CMD_HIDE_STOCKCHIP_ID);
        }
        else
        {
            hqchart.ExecuteMenuCommand(JSCHART_MENU_ID.CMD_SHOW_STOCKCHIP_ID, [stockChipConfig.Name, stockChipConfig]);
        }
    }

    ShowDrawTool()
    {
        if (!this.Chart || !this.Chart.JSChartContainer) return;
        var hqchart=this.Chart.JSChartContainer;
        var bShow=hqchart.IsShowDrawToolDialog();
        if (!bShow)  hqchart.ExecuteMenuCommand(JSCHART_MENU_ID.CMD_SHOW_DRAWTOOL_ID);
    }

    OnClickChartPaint(event, data, obj)
    {
        console.log("[KLineChart::OnClickChartPaint] data=", data);
    }

}
