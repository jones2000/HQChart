/*
   Copyright (c) 2018 jones
 
    http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   配色
*/

/*
    不同风格行情配置文件
    !!手机上字体大小需要*分辨率比
*/

/* umychart.js 里面已经有了
function GetDevicePixelRatio()
{
    return window.devicePixelRatio || 1;
}
*/

//黑色风格

function GetBlackStyle()
{
    var BLACK_STYLE=
    {
        BGColor:'rgb(0,0,0)', //背景色
        TooltipBGColor: "rgb(255, 255, 255)", //背景色
        TooltipAlpha: 0.92,                  //透明度
    
        SelectRectBGColor: "rgba(1,130,212,0.06)", //背景色
        //  SelectRectAlpha: 0.06;                  //透明度
    
        //K线颜色
        UpBarColor: "rgb(238,21,21)",   //上涨
        DownBarColor: "rgb(25,158,0)",  //下跌
        UnchagneBarColor: "rgb(228,228,228)", //平盘
        EmptyBarBGColor:'rgb(0,0,0)',   //空心柱子背景色

        SplashScreen:
        {
            BGColor:"rgba(112,128,144,0.5)",
            TextColor:"rgb(230,230,230)",
        },

        HLCArea:
        {
            HighLineColor:'rgb(238,21,21)',
            LowLineColor:"rgb(25,158,0)",
            CloseLineColor:"rgb(156,156,156)",
            LineWidth:2*GetDevicePixelRatio(),

            UpAreaColor:"rgba(238,21,21, 0.3)",
            DownAreaColor:"rgba(25,158,0, 0.3)",
        },
    
        Minute: 
        {
            VolBarColor: null,
            PriceColor: "rgb(25,180,231)",
            AreaPriceColor:"rgba(63,158,255,.3)",
            AvPriceColor: "rgb(255,236,0)",
            PositionColor:'rgb(218,165,32)', 
            VolTitleColor:"rgb(190,190,190)",
            Before:
            {
                BGColor:"rgba(105,105,105,0.5)",
                AvPriceColor:'rgb(248,248,255)',     //均线

                CloseIcon:
                { 
                    MoveOnColor:"rgb(255,255,255)",
                    Color:"rgb(156,156,156)"
                }    
            },
            After:
            {
                BGColor:"rgba(105,105,105,0.5)",
                AvPriceColor:'rgb(248,248,255)'     //均线
            },
            NightDay:
            { 
                NightBGColor:"rgb(22,22,22)",
                Font:`${12*GetDevicePixelRatio()}px 微软雅黑`,
                Day: { Color:"rgb(153,153,153)", BGColor:"rgb(51,51,51)", BorderColor:"rgb(51,51,51)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
                Night: { Color:"rgb(153,153,153)", BGColor:"rgb(51,51,51)", BorderColor:"rgb(51,51,51)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
            }
        },

        PopMinuteChart:
        {
            BGColor:"rgba(0,0,0,0.95)",
            BorderColor:"rgb(230,230,230)",
        },
    
    
        DefaultTextColor: "rgb(101,104,112)",
        DefaultTextFont: 14*GetDevicePixelRatio() +'px 微软雅黑',
        TitleFont: 13*GetDevicePixelRatio() +'px 微软雅黑',    //标题字体(动态标题 K线及指标的动态信息字体)
        IndexTitleColor:"rgb(190, 190 ,190)",                       //指标名字颜色
        IndexTitleBGColor:'rgb(0,0,0)',                     //指标名字背景色
        IndexTitleBorderColor:'rgb(211, 211, 211)',                 //指标名字边框颜色
        IndexTitleBorderMoveOnColor:'rgb(30,144,255)',         //指标名字边框颜色(鼠标在上面)
    
        UpTextColor: "rgb(238,21,21)",
        DownTextColor: "rgb(25,158,0)",
        UnchagneTextColor: "rgb(190, 190 ,190)",
        CloseLineColor: 'rgb(250,250,250)',

        IndexTitle:
        {
            UpDownArrow:    //数值涨跌箭头
            {
                UpColor:"rgb(238,21,21)",   //上涨
                DownColor:"rgb(25,158,0)",  //下跌
                UnchangeColor:"rgb(190, 190 ,190)"  //不变
            },

            NameArrow:{ Color:"rgb(190, 190 ,190)", Space:2, Symbol:'▼' },
        },
    
        Title:
        {
            TradeIndexColor:'rgb(105,105,105)', //交易指标颜色
            ColorIndexColor:'rgb(112,128,144)',  //五彩K线颜色
    
            VolColor:"rgb(190, 190 ,190)",       //标题成交量
            AmountColor:"rgb(190, 190 ,190)",    //成交金额 
            DateTimeColor:"rgb(190, 190 ,190)",  //时间,日期  
            SettingColor:"rgb(190, 190 ,190)",   //周期,复权
            NameColor:"rgb(190, 190 ,190)" ,     //股票名称
            TurnoverRateColor:'rgb(101,104,112)',       //换手率
            PositionColor:"rgb(101,104,112)"       //持仓
        },
    
        FrameBorderPen: "rgb(47,51,62)",     //边框
        MultiDayBorderPen:"rgba(236,236,236,0.5)",
        FrameSplitPen: "rgba(236,236,236,0.13)",          //分割线
        FrameSplitTextColor: "rgb(220,220,220)",     //刻度文字颜色
        FrameSplitTextFont: 12*GetDevicePixelRatio() +"px 微软雅黑",        //坐标刻度文字字体
        FrameTitleBGColor: "rgb(0,0,0)",      //标题栏背景色
        OverlayIndexTitleBGColor:'rgba(0,0,0,0.7)', //叠加指标背景色
    
        Frame:
        { 
            XBottomOffset:2*GetDevicePixelRatio(), //X轴文字向下偏移
           
            PercentageText:      //百分比坐标文字颜色
            { 
                PriceColor:'rgb(101,104,112)', 
                PercentageColor:"rgb(101,104,112)", 
                SplitColor:"rgb(101,104,112)",
                Font:14*GetDevicePixelRatio() +"px 微软雅黑"
            }
        }, 
        
        //叠加指标框架
        OverlayFrame:
        {
            BolderPen:'rgb(130,130,130)',                       //指标边框线
            TitleColor:'rgb(181,181,181)',                      //指标名字颜色
            TitleFont:11*GetDevicePixelRatio() +'px arial',     //指标名字字体
        },
    
        FrameLatestPrice : {
            TextColor:'rgb(255,255,255)',   //最新价格文字颜色
            UpBarColor:"rgb(238,21,21)",    //上涨
            DownBarColor:"rgb(25,158,0)",   //下跌
            UnchagneBarColor:"rgb(190,190,190)",   //平盘
            BGAlpha:0.6,
            EmptyBGColor:"rgb(0,0,0)"
        },
    
        CorssCursorBGColor: "rgb(43,54,69)",            //十字光标背景
        CorssCursorTextColor: "rgb(255,255,255)",
        CorssCursorTextFont: 12*GetDevicePixelRatio() +"px 微软雅黑",
        CorssCursorHPenColor: "rgb(130,130,130)",           //十字光标线段颜色
        CorssCursorVPenColor: "rgb(130,130,130)",           //十字光标线段颜色
    
        CorssCursor:
        { 
            RightButton : 
            { 
                BGColor:'rgb(43,54,69)', 
                PenColor:'rgb(255,255,255)',
                Icon: { Text:'\ue6a3', Color:'rgb(255,255,255)', Family:"iconfont", Size:18 }
            } 
        },
    
        //订单流配置
        OrderFlow:
        { 
            UpColor:{BG:'rgb(223,191,180)', Border:"rgb(196,84,86)" },          //阳线
            DownColor:{ BG:"rgb(176,212,184)", Border:'rgb(66,94,74)' },        //阴线
            UnchagneColor: {BG:"rgb(216,221,177)", Border:"rgb(209,172,129)"},  //平盘
            Text:{ Color: "rgb(248,248,255)" , Family:'Arial', FontMaxSize:16, MaxValue:"8888" },  //文字
            Line:{ UpDownColor: "rgb(220,220,220)", MiddleColor:"rgb(211,211,211)" }  //最大, 最低,中间 竖线
        },
    
        KLine:
        {
            MaxMin: { Font: 12*GetDevicePixelRatio() +'px 微软雅黑', Color: 'rgb(255,250,240)', RightArrow:"→", LeftArrow:"←", HighYOffset:0, LowYOffset:0 },   //K线最大最小值显示
            Info:  //信息地雷
            {
                Investor:
                    {
                        ApiUrl:'/API/NewsInteract', //互动易
                        IconFont: { Family:'iconfont', Text:'\ue631' , HScreenText:'\ue684', Color:'#1c65db'} //SVG 文本
                    },
                    Announcement:                                           //公告
                    {
                        ApiUrl:'/API/ReportList',
                        IconFont: { Family:'iconfont', Text:'\ue633', HScreenText:'\ue685', Color:'#f5a521' }, //SVG 文本
                        IconFont2: { Family:'iconfont', Text:'\ue634', HScreenText:'\ue686', Color:'#ed7520' } //SVG 文本 //季报
                    },
                    Pforecast:  //业绩预告
                    {
                        ApiUrl:'/API/StockHistoryDay',
                        IconFont: { Family:'iconfont', Text:'\ue62e', HScreenText:'\ue687', Color:'#986cad' } //SVG 文本
                    },
                    Research:   //调研
                    {
                        ApiUrl:'/API/InvestorRelationsList',
                        IconFont: { Family:'iconfont', Text:'\ue632', HScreenText:'\ue688', Color:'#19b1b7' } //SVG 文本
                    },
                    BlockTrading:   //大宗交易
                    {
                        ApiUrl:'/API/StockHistoryDay',
                        IconFont: { Family:'iconfont', Text:'\ue630', HScreenText:'\ue689', Color:'#f39f7c' } //SVG 文本
                    },
                    TradeDetail:    //龙虎榜
                    {
                        ApiUrl:'/API/StockHistoryDay',
                        IconFont: { Family:'iconfont', Text:'\ue62f', HScreenText:'\ue68a' ,Color:'#b22626' } //SVG 文本
                    }
    
            },
            NumIcon:
            {
                Color:'rgb(251,80,80)',Family:'iconfont',
                Text:[  '\ue649',
                        '\ue63b','\ue640','\ue63d','\ue63f','\ue645','\ue641','\ue647','\ue648','\ue646','\ue636',
                        '\ue635','\ue637','\ue638','\ue639','\ue63a','\ue63c','\ue63e','\ue642','\ue644','\ue643'
                    ]
            },
            TradeIcon:  //交易指标 图标
            {
                Family:'iconfont', 
                Buy: { Color:'rgb(255,15,4)', Text:'\ue683', HScreenText:'\ue682'}, 
                Sell: { Color:'rgb(64,122,22)', Text:'\ue681',HScreenText:'\ue680'},
            }
        },

        VirtualKLine:
        {
            Color:'rgb(119,136,153)', 
            LineDash:[2,2]
        },

        PriceGapStyple:
        { 
            Line:{ Color:"rgb(128,128,128)" }, 
            Text:{ Color:"rgb(219,220,220)", Font:`${12*GetDevicePixelRatio()}px 微软雅黑` } 
        },
    
        Index: 
        {      
            LineColor:  //指标线段颜色
            [
                "rgb(255,189,09)",
                "rgb(22,198,255)",
                "rgb(174,35,161)",
                "rgb(236,105,65)",
                "rgb(68,114,196)",
                "rgb(229,0,79)",
                "rgb(0,128,255)",
                "rgb(252,96,154)",
                "rgb(42,230,215)",
                "rgb(24,71,178)",
            ],
            NotSupport: { Font: `${14*GetDevicePixelRatio()}px 微软雅黑`, TextColor: "rgb(250,250,250)" }
        },
          
        ColorArray:       //自定义指标默认颜色
        [
            "rgb(255,174,0)",
            "rgb(25,199,255)",
            "rgb(175,95,162)",
            "rgb(236,105,65)",
            "rgb(68,114,196)",
            "rgb(229,0,79)",
            "rgb(0,128,255)",
            "rgb(252,96,154)",
            "rgb(42,230,215)",
            "rgb(24,71,178)",
        ],

        //按钮
        Buttons:
        {
            CloseOverlayIndex:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            CloseWindow:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            ChangeIndex:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            OverlayIndex:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            ModifyIndexParam:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            //最大化, 最小化
            MaxMinWindow:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            TitleWindow:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },
            ExportData:
            {
                MoveOnColor:"rgb(255,255,255)",
                Color:"rgb(156,156,156)"
            },

            Tooltip:
            {
                //Font:12*GetDevicePixelRatio() +"px 微软雅黑",
                Color:'rgb(204,204,204)',
                ColorBG:'rgb(32,32,32)',
                ColorBorder:'rgb(69,69,69)',
                //BorderRadius:4,
                //Mergin:{ Left:4, Right:4, Top:2, Bottom:4 },
            }
        },
        
        DrawPicture:  //画图工具
        {
            LineColor: 
            [
                "rgb(41,98,255)" 
            ],
    
            PointColor: 
            [
                "rgb(41,98,255)",           //选中颜色
                "rgb(89,135,255)",          //moveon颜色
                "rgb(0,0,0)"                //空心点背景色
            ],

        },
    
        TooltipPaint : 
        {
            BGColor:'rgba(20,20,20,0.8)',    //背景色
            BorderColor:'rgb(210,210,210)',     //边框颜色
            TitleColor:'rgb(210,210,210)',       //标题颜色
            TitleFont:13*GetDevicePixelRatio() +'px 微软雅黑',   //字体
            DateTimeColor:'rgb(210,210,210)',
            VolColor:"rgb(255, 185, 15)",       //标题成交量
            AmountColor:"rgb(210,210,210)",    //成交金额
        },

        PCTooltipPaint:
        {
            BGColor:'rgba(20,20,20,0.8)',    //背景色
            BorderColor:'rgb(210,210,210)',     //边框颜色
            TitleColor:'rgb(210,210,210)',       //标题颜色
            TitleFont:12*GetDevicePixelRatio() +'px 微软雅黑',   //字体
            DateTimeColor:'rgb(210,210,210)',
            VolColor:"rgb(161,154,3)",       //标题成交量
            AmountColor:"rgb(161,154,3)",    //成交金额
        },
    
        //走势图 信息地雷
        MinuteInfo:
        {
            TextColor: 'rgb(84,143,255)',
            Font: 14*GetDevicePixelRatio() +'px 微软雅黑',
            PointColor:'rgb(38,113,254)',
            LineColor:'rgb(120,167,255)',
            TextBGColor:'rgba(255,255,255,1)'
        },

        DepthMapPaint:
        {
            LineColor:"rgba(255,185,15)",
            AreaColor:"rgba(255,185,15,0.8)",
            TextColor:"rgba(255,255,255)",
            TextBGColor:'rgb(43,54,69)'
        },

        KLineYAxisBGPaint:
        {
            Font:12*GetDevicePixelRatio() +'px 微软雅黑',
            TextColor:"rgb(255,255,255)",
            LineColor:"rgb(255,255,255)"
        },
    
        //筹码分布图
        StockChip:
        {
            InfoColor:'rgb(255,255,255)', //文字颜色
            DayInfoColor:'rgb(0,0,0)' //周期颜色内文字颜色
        },
    
        //深度图
        DepthChart:
        {
            BidColor: { Line:"rgb(82,176,123)", Area:"rgba(82,176,123,0.5)"},  //卖
            AskColor: { Line:"rgb(207,76,89)", Area:"rgba(207,76,89, 0.5)"},   //买
            LineWidth:4
        },
    
        DepthCorss:
        {
            BidColor: { Line:"rgb(82,176,123)" },  //卖
            AskColor: { Line:"rgb(207,76,89)" },   //买
            LineWidth:2,    //线段宽度
            LineDash:[3,3],
            Tooltip:
            { 
                BGColor:'rgba(54,54,54, 0.8)', TextColor:"rgb(203,215,224)",
                Border:{ Top:5, Left:20, Bottom:5, Center: 5},
                Font:14*GetDevicePixelRatio() +"px 微软雅黑",
                LineHeight:16   //单行高度
            }
        },

        ChartDrawVolProfile:
        {
            BGColor:"rgba(244,250,254,0.3)",
            BorderColor:"rgba(255,255,255)",
            VolLineColor:"rgb(232,5,9)",
    
            UpVolColor:"rgba(103,179,238, 0.24)",
            DownVolColor:"rgba(237,208,105,0.24)",
            AreaUpColor:"rgb(103,179,238,0.7)",
            AreaDonwColor:"rgba(237,208,105,0.7)",
    
            Text:{ Color: "rgb(0,0,0)" , Family:'Arial', FontMaxSize:18, FontMinSize:6 },  //文字
        },
    
        //区间选择
        RectSelect:
        {
            LineColor:"rgb(115,83,64)",          //竖线  
            LineWidth:1*GetDevicePixelRatio(),
            LineDotted:[3,3], 
            AreaColor:"rgba(26,13,7,0.5)",     //面积
        },

        RectDrag:
        {
            LineColor:"rgb(220,220,220)",          
            LineWidth:1*GetDevicePixelRatio(),
            BGColor:"rgba(220,220,220,0.2)",     //面积
        },

        SelectedChart:
        {
            LineWidth:1,
            LineColor:'rgb(55,100,100)',
            Radius:4,
            MinSpace:200, //点和点间最小间距
            BGColor:"rgb(255,255,255)"
        },

        DragMovePaint:
        {
            TextColor:"rgb(255,255,255)",
            //Font:14*GetDevicePixelRatio() +"px 微软雅黑"
        },

        SessionBreaksPaint:
        {
            BGColor:[null, "rgb(42,46,57)"],
            SplitLine:{ Color:'rgb(73,133,231)', Width:1*GetDevicePixelRatio(), Dash:[5*GetDevicePixelRatio(),5*GetDevicePixelRatio()] }
        },
    
        //成交明细
        DealList:
        {
            BorderColor:'rgb(38,38,41)',    //边框线
            Header:
            {
                Color:"RGB(245,245,245)",
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
                Font:{ Size:12, Name:"微软雅黑" }
            },
    
            Row:
            {
                Mergin:{ Top:2, Bottom:2 },
                Font:{ Size:15, Name:"微软雅黑"},
                BarMergin:{ Top:2, Left:3, Right:3, Bottom:2 }
            },
    
            FieldColor:
            {
                Vol:"rgb(192,192,0)",      //成交量
                Time:"rgb(245,245,245)",   //时间
                Deal:"rgb(111,128,112)",    //成交笔数
                Index:"rgb(245,245,245)",   //序号
                BarTitle:'rgb(245,245,245)',   //柱子文字
                Text:"rgb(245,245,245)",   //默认文本
            },
    
            UpTextColor:"rgb(238,21,21)",      //上涨文字颜色
            DownTextColor:"rgb(25,158,0)",     //下跌文字颜色
            UnchagneTextColor:"rgb(228,228,228)"    //平盘文字颜色 
        },
    
        //报价列表
        Report:
        {
            BorderColor:'rgb(38,38,41)',    //边框线
            SelectedColor:"rgb(49,48,56)",  //选中行
            Header:
            {
                Color:"RGB(245,245,245)",
                SortColor:"rgb(255,0,0)",
                //Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
                Font:{ Size:12, Name:"微软雅黑" }
            },
    
            Item:
            {
                Mergin:{ Top:2, Bottom:4,Left:5, Right:5 },
                Font:{ Size:15, Name:"微软雅黑"},
                BarMergin:{ Top:2, Left:3, Right:3, Bottom:2 },
                NameFont:{ Size:14, Name:"微软雅黑" },
                SymbolFont:{ Size:12, Name:"微软雅黑" }
            },

             //固定行
            FixedItem:
            {
                Font:{ Size:15, Name:"微软雅黑"},
            },
    
            LimitBorder:
            {
                Color:"rgb(64,64,64)",
                Mergin:{ Top:1, Bottom:1,Left:0, Right:0 },
            },
    
            FieldColor:
            {
                Index:"rgb(245,245,245)",  //序号
                Symbol:"rgb(255,255,255)",
                Name:"rgb(255,255,255)",
                Amount:"rgb(2,226,244)",    //成交金额
                Vol:"rgb(192,192,0)",       //成交量
                BarTitle:'rgb(245,245,245)',   //柱子文字
                Text:"rgb(245,245,245)",    //默认文本
            },

            CloseLine:
            {
                CloseColor:"rgb(30,144,255)",
                YCloseColor:"rgba(220,220,220,0.5)",  //昨收线
                AreaColor:'rgba(220,220,220,0.2)',
            },

            KLine:
            {
                UpColor:"rgb(255,0,0)",
                DownColor:"rgb(0,128,0)",
                UnchagneColor:'rgb(240,240,240)',
                DataWidth:16,
                DistanceWidth:3
            },
    
            UpTextColor:"rgb(238,21,21)",           //上涨文字颜色
            DownTextColor:"rgb(25,158,0)",          //下跌文字颜色
            UnchagneTextColor:"rgb(228,228,228)",    //平盘文字颜色 
    
            Tab:
            {
                Font:{ Size:12, Name:"微软雅黑" },
                ScrollBarWidth:100,
                ButtonColor:"rgb(13,12,15)",
                BarColor:"rgb(48,48,48)",
                BorderColor:'rgb(48,48,48)',
    
                TabTitleColor:'rgb(153,153,153)',
                TabSelectedTitleColor:'rgb(255,255,255)',
                TabSelectedBGColor:"rgb(234,85,4)",
                TabMoveOnTitleColor:"rgb(255,255,255)",
                TabBGColor:"rgb(28,28,31)"
            },

            PageInfo:
            {
                Font:{ Size:15, Name:"微软雅黑"},
                TextColor:"rgb(255,255,255)",
                BGColor:"rgba(49,48,56,0.8)",
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
            },

            DragRow:
            {
                Color:"rgba(255,250, 250,0.8)",
                TextColor:'rgba(0,0, 0, 0.8)',

                MoveRowColor:'rgb(135,206,250)',
                SrcRowColor:'rgb(49,48,56)',
            },

            VScrollbar:
            {
                BarWidth:40,
                ScrollBarHeight:60,
                ButtonColor:"rgba(13,12,15,0.8)",
                BarColor:"rgba(48,48,48,0.9)",
                BorderColor:'rgba(48,48,48,0.9)',
                BGColor:"rgba(211,211,211,0.5)",
            },

            CheckBox:
            {
                Family:"iconfont", Size:15,
                Checked:{ Color:"rgb(69,147,238)", Symbol:"\ue6b3", DisableColor:"rgb(120,120,120)", MouseOnColor:"rgb(69,147,238)" },
                Unchecked:{ Color:"rgb(210,210,210)", Symbol:"\ue6b4", DisableColor:"rgb(120,120,120)", MouseOnColor:"rgb(69,147,238)" },
            },

            Link:
            {
                Font:`${12*GetDevicePixelRatio()}px 微软雅黑`,
                TextColor:"rgb(0,144,255)",

                Disable:{ TextColor:"rgb(211,211,211)" },
                MouseOn:{ TextColor:"rgb(0,144,255)" },
            },

            ProgressBar:
            {
                BGColor:"rgb(20,24,28)",
                BarColor:"rgb(47,124,197)",
                Margin:{ Left:2, Right:2, Bottom:2, Top:2 },
                BarMargin:{ Left:2, Right:2, Bottom:2, Top:2 },
                TextColor:"rgb(230,230,230)",
                Font:`${12*GetDevicePixelRatio()}px 微软雅黑`,
                TextMargin:{ Left:40, Right:2, Bottom:2, Top:2},
                Disable:{ BGColor:"rgb(61,61,61)", BarColor:"rgb(131,131,131)", TextColor:"rgb(159,161,159)"}
            }
        },

        //T型报价
        TReport:
        {
            BorderColor:'rgb(38,38,41)',    //边框线
            SelectedColor:"rgb(180,180,180)",     //选中行
            Header:
            {
                Color:"rgb(187,187,187)",      //表头文字颜色
                SortColor:"rgb(255,0,0)",      //排序箭头颜色
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2},    //表头四周间距
                Font:{ Size:14, Name:"微软雅黑" }   //表头字体
            },

            Item:
            {
                Mergin:{ Top:2, Bottom:0,Left:5, Right:5 }, //单元格四周间距
                Font:{ Size:15, Name:"微软雅黑"},
                BarMergin:{ Top:2, Left:3, Right:3, Bottom:2 },//单元格字体
                NameFont:{ Size:14, Name:"微软雅黑" },
                SymbolFont:{ Size:12, Name:"微软雅黑" }
            },

            CenterItem:
            {
                TextColor:"rgb(16,226,217)",
                BaseTextColor:"rgb(60,60,83)",
                BGColor:"rgb(65,65,65)"
            },

            FieldColor:
            {
                Index:"rgb(250,250,250)",  //序号
                Symbol:"rgb(60,60,60)",
                Name:"rgb(250,250,250)",
                Vol:"rgb(192,165,3)",        //成交量
                Position:"rgb(250,250,250)",   //持仓量
                Amount:"rgb(16,226,217)", //成交金额
                Text:"rgb(250,250,250)",   //默认文本
            },

            UpTextColor:"rgb(238,21,21)",      //上涨文字颜色
            DownTextColor:"rgb(25,158,0)",     //下跌文字颜色
            UnchangeTextColor:"rgb(187,187,187)",     //平盘文字颜色 

            UpBGColor:"rgb(35,5,5)",
            DownBGColor:"rgb(5,35,5)",

            MarkBorder:
            {
                MaxPositionColor:"rgb(192,192,0)"
            },
        },

        ScrollBar:
        {
            BorderColor:'rgb(38,38,41)',    //边框线
            XSplitTextColor:"rgb(240,240,240)",
            XSplitLineColor:'rgb(38,38,41)',

            Slider:
            {
                DateFont:`${14*GetDevicePixelRatio()}px 微软雅黑`,
                DateColor:'rgb(240,240,240)',
                BarColor:"rgb(105,105,105)",
                BarAreaColor:"rgba(128,128,128,0.65)"
            },

            BGChart:
            {
                Color:"rgb(105,113,125)",
                LineWidth:1,
                AreaColor:"rgba(24,28,42,0.5)",
            },
        },

        FrameButtomToolbar:
        {
            BGColor:"rgb(25,25,25)",
            BorderColor:"rgb(60,60,60)",
            Button:
            {
                Font:{ Family:"微软雅黑" },
                TitleColor: { Selected:"rgb(255,255,255)", Default:"rgb(140,140,140)", MoveOn:"rgb(255,255,255)" },
                BGColor: {  Selected:"rgb(234,85,4)", Default:"rgb(25,25,25)", MoveOn:"rgb(59,59,59)" },
                BorderColor:"rgb(60,60,60)",
            }
        }
        
    };
    
    return BLACK_STYLE;
}

var STYLE_TYPE_ID=
{
    BLACK_ID:1, //黑色风格
    WHITE_ID:0, //白色风格
}

function HQChartStyle()
{

}

HQChartStyle.GetStyleConfig=function(styleid)    //获取一个风格的配置变量
{
    switch (styleid)
    {
        case STYLE_TYPE_ID.BLACK_ID:
            return GetBlackStyle();
        case STYLE_TYPE_ID.WHITE_ID:
            return new JSChartResource();
        default:
            return null;
    }
}



