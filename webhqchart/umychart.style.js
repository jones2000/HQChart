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
                AvPriceColor:'rgb(248,248,255)'     //均线
            }
        },
    
    
        DefaultTextColor: "rgb(101,104,112)",
        DefaultTextFont: 14*GetDevicePixelRatio() +'px 微软雅黑',
        TitleFont: 13*GetDevicePixelRatio() +'px 微软雅黑',    //标题字体(动态标题 K线及指标的动态信息字体)
        IndexTitleColor:"rgb(101,104,112)",                           //指标名字颜色
    
        UpTextColor: "rgb(238,21,21)",
        DownTextColor: "rgb(25,158,0)",
        UnchagneTextColor: "rgb(101,104,112)",
        CloseLineColor: 'rgb(178,34,34)',
    
        Title:
        {
            TradeIndexColor:'rgb(105,105,105)', //交易指标颜色
            ColorIndexColor:'rgb(112,128,144)',  //五彩K线颜色
    
            VolColor:"rgb(101,104,112)",       //标题成交量
            AmountColor:"rgb(101,104,112)",    //成交金额 
            DateTimeColor:"rgb(101,104,112)",  //时间,日期  
            SettingColor:"rgb(101,104,112)",   //周期,复权
            NameColor:"rgb(101,104,112)" ,     //股票名称
            TurnoverRateColor:'rgb(101,104,112)',       //换手率
            PositionColor:"rgb(101,104,112)"       //持仓
        },
    
        FrameBorderPen: "rgba(236,236,236,0.13)",     //边框
        FrameSplitPen: "rgba(236,236,236,0.13)",          //分割线
        FrameSplitTextColor: "rgb(101,104,112)",     //刻度文字颜色
        FrameSplitTextFont: 12*GetDevicePixelRatio() +"px 微软雅黑",        //坐标刻度文字字体
        FrameTitleBGColor: "rgb(0,0,0)",      //标题栏背景色
        OverlayIndexTitleBGColor:'rgba(0,0,0,0.7)', //叠加指标背景色
    
        Frame:
        { 
            XBottomOffset:1*GetDevicePixelRatio(), //X轴文字向下偏移
           
            PercentageText:      //百分比坐标文字颜色
            { 
                PriceColor:'rgb(101,104,112)', 
                PercentageColor:"rgb(101,104,112)", 
                SplitColor:"rgb(101,104,112)",
                Font:14*GetDevicePixelRatio() +"px 微软雅黑"
            }
        },   
    
    
        FrameLatestPrice : {
            TextColor:'rgb(255,255,255)',   //最新价格文字颜色
            UpBarColor:"rgb(238,21,21)",    //上涨
            DownBarColor:"rgb(25,158,0)",   //下跌
            UnchagneBarColor:"rgb(190,190,190)",   //平盘
            BGAlpha:0.6
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
            NotSupport: { Font: "14px 微软雅黑", TextColor: "rgb(52,52,52)" }
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
    
        DrawPicture:  //画图工具
        {
            LineColor: 
            [
                "rgb(255,255,0)"
            ],
    
            PointColor: 
            [
                "rgb(228,228,228)",
                "rgb(192,192,192)"
            ],
        },
    
        TooltipPaint : 
        {
            BGColor:'rgba(20,20,20,0.8)',    //背景色
            BorderColor:'rgb(210,210,210)',     //边框颜色
            TitleColor:'rgb(210,210,210)',       //标题颜色
            TitleFont:13*GetDevicePixelRatio() +'px 微软雅黑',   //字体
            DateTimeColor:'rgb(210,210,210)',
            VolColor:"rgb(210,210,210)",       //标题成交量
            AmountColor:"rgb(210,210,210)",    //成交金额
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
    
        //区间选择
        RectSelect:
        {
            LineColor:"rgb(115,83,64)",          //竖线  
            LineWidth:1*GetDevicePixelRatio(),
            LineDotted:[3,3], 
            AreaColor:"rgba(26,13,7,0.5)",     //面积
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
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
                Font:{ Size:12, Name:"微软雅黑" }
            },
    
            Item:
            {
                Mergin:{ Top:2, Bottom:0,Left:5, Right:5 },
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
                TabSelectedBGColor:"rgb(13,12,15)",
                TabMoveOnTitleColor:"rgb(255,255,255)",
                TabBGColor:"rgb(28,28,31)"
            },

            PageInfo:
            {
                Font:{ Size:15, Name:"微软雅黑"},
                TextColor:"rgb(255,255,255)",
                BGColor:"rgba(49,48,56,0.8)",
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
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



