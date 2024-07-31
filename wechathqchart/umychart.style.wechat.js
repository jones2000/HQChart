/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    不同风格行情配置文件 (微信小程序版本)
*/
function GetBlackStyle()
{
    var BLACK_STYLE =    //黑色风格
    {
        BGColor:'rgb(0,0,0)',
        TooltipBGColor: "rgb(255, 255, 255)", //背景色
        TooltipAlpha: 0.92,                  //透明度

        SelectRectBGColor: "rgba(1,130,212,0.06)", //背景色
        //  SelectRectAlpha: 0.06;                  //透明度

        UpBarColor: "rgb(238,21,21)",
        DownBarColor: "rgb(25,158,0)",
        UnchagneBarColor: "rgb(199,199,199)",

        Minute: {
        VolBarColor: null,
        PriceColor: "rgb(25,180,231)",
        AvPriceColor: "rgb(255,236,0)",
        },


        DefaultTextColor: "rgb(101,104,112)",
        DefaultTextFont: '14px 微软雅黑',
        IndexTitleBGColor:'rgb(211,211,211)',
        IndexTitleColor:"rgb(101,104,112)",
        OverlayIndexTitleBGColor:'rgba(0,0,0,0.7)', //叠加指标背景色
        DynamicTitleFont: '12px 微软雅黑', //指标动态标题字体


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
        FrameSplitTextFont: "12px 微软雅黑",        //坐标刻度文字字体
        FrameTitleBGColor: "rgb(246,251,253)",      //标题栏背景色
        Frame: { XBottomOffset: 0 },   //X轴文字向下偏移

        FrameLatestPrice: {
            TextColor: 'rgb(255,255,255)',   //最新价格文字颜色
            UpBarColor: "rgb(238,21,21)",    //上涨
            DownBarColor: "rgb(25,158,0)",   //下跌
            UnchagneBarColor: "rgb(190,190,190)",   //平盘
            BGAlpha: 0.6
        },

        CorssCursorBGColor: "rgb(43,54,69)",            //十字光标背景
        CorssCursorTextColor: "rgb(255,255,255)",
        CorssCursorTextFont: "12px 微软雅黑",
        CorssCursorHPenColor: "rgb(130,130,130)",           //十字光标线段颜色
        CorssCursorVPenColor: "rgb(130,130,130)",           //十字光标线段颜色

        KLine:
        {
            MaxMin: { Font: '12px 微软雅黑', Color: 'rgb(111,111,111)', RightArrow:"→", LeftArrow:"←", HighYOffset:0, LowYOffset:0 },   //K线最大最小值显示
            Info:  //信息地雷
            {
                Color: 'rgb(205,149,12)',
                TextColor: '#afc0da',
                TextBGColor: '#1a283e',
                Investor:
                {
                    ApiUrl: '/API/NewsInteract', //互动易
                },
                Announcement:                                           //公告
                {
                    ApiUrl: '/API/ReportList',
                },
                Pforecast:  //业绩预告
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                Research:   //调研
                {
                    ApiUrl: '/API/InvestorRelationsList',
                },
                BlockTrading:   //大宗交易
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                TradeDetail:    //龙虎榜
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                Policy: //策略
                {
                    ApiUrl: '/API/StockHistoryDay',
                }
            }
        },

        PriceGapStyple:
        { 
            Line:{ Color:"rgb(128,128,128)" }, 
            Text:{ Color:"rgb(219,220,220)", Font:`12px 微软雅黑` } 
        },

        Index: {      //指标线段颜色
        LineColor: [
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
        //画图工具
        DrawPicture: 
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

        TooltipPaint:   //Tooltip
        {
            BGColor: 'rgba(20,20,20,0.8)',          //背景色
            BorderColor: 'rgb(210,210,210)',        //边框颜色
            TitleColor: 'rgb(210,210,210)',         //标题颜色
            TitleFont:'13px 微软雅黑'               //字体
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
                Font:"14px 微软雅黑",
                LineHeight:16   //单行高度
            }
        },

        //报价列表
        Report:
        {
            BorderColor:'rgb(38,38,41)',    //边框线
            SelectedColor:"rgb(49,48,56)",  //选中行
            Header:
            {
                Color:"rgb(245,245,245)",
                SortColor:"rgb(255,0,0)",
                Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
                Font:{ Size:15, Name:"微软雅黑" }
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

function GetWhiteStyle()
{
    var WHITE_STYLE=    //白色风格
    {
        BGColor:'rgb(255,255,255)',
        TooltipBGColor: "rgb(255, 255, 255)", //背景色
        TooltipAlpha: 0.92,                  //透明度

        SelectRectBGColor:"rgba(1,130,212,0.06)", //背景色
        //   this.SelectRectAlpha=0.06;                  //透明度

        UpBarColor: "rgb(238,21,21)",
        DownBarColor: "rgb(25,158,0)",
        UnchagneBarColor: "rgb(0,0,0)",

        Minute:
        {
            VolBarColor : "rgb(238,127,9)",
            PriceColor : "rgb(50,171,205)",
            AvPriceColor : "rgb(238,127,9)",

            NightDay:
            { 
                NightBGColor:"rgb(22,22,22)",
                Font:`12px 微软雅黑`,
                Day: { Color:"rgb(153,153,153)", BGColor:"rgb(51,51,51)", BorderColor:"rgb(51,51,51)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
                Night: { Color:"rgb(153,153,153)", BGColor:"rgb(51,51,51)", BorderColor:"rgb(51,51,51)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
            }
        },

        DefaultTextColor: "rgb(43,54,69)",
        DefaultTextFont: '14px 微软雅黑',

        DynamicTitleFont: '12px 微软雅黑', //指标动态标题字体


        UpTextColor: "rgb(238,21,21)",
        DownTextColor: "rgb(25,158,0)",
        UnchagneTextColor: "rgb(0,0,0)",
        CloseLineColor: 'rgb(178,34,34)',

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

        FrameBorderPen: "rgb(225,236,242)",     //边框
        FrameSplitPen: "rgb(225,236,242)",          //分割线
        FrameSplitTextColor: "rgb(51,51,51)",     //刻度文字颜色
        FrameSplitTextFont: "12px 微软雅黑",        //坐标刻度文字字体
        FrameTitleBGColor: "rgb(246,251,253)",      //标题栏背景色

        CorssCursorBGColor: "rgb(43,54,69)",            //十字光标背景
        CorssCursorTextColor: "rgb(255,255,255)",
        CorssCursorTextFont: "12px 微软雅黑",
        CorssCursorPenColor: "rgb(130,130,130)",           //十字光标线段颜色

        KLine:
        {
            MaxMin: { Font: '12px 微软雅黑', Color: 'rgb(111,111,111)' },   //K线最大最小值显示
            Info:  //信息地雷
            {
                Color: 'rgb(205,149,12)',
                TextColor: '#197de9',
                TextBGColor: '#e1e4ef',
                Investor:
                {
                    ApiUrl: '/API/NewsInteract', //互动易
                },
                Announcement:                                           //公告
                {
                    ApiUrl: '/API/ReportList',
                },
                Pforecast:  //业绩预告
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                Research:   //调研
                {
                    ApiUrl: '/API/InvestorRelationsList',
                },
                BlockTrading:   //大宗交易
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                TradeDetail:    //龙虎榜
                {
                    ApiUrl: '/API/StockHistoryDay',
                },
                Policy: //策略
                {
                    ApiUrl: '/API/StockHistoryDay',
                }
            }
        },

        Index: 
        {      //指标线段颜色
            LineColor: 
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

        //画图工具
        DrawPicture:
        {
            LineColor: "rgb(30,144,255)",
            PointColor: "rgb(105,105,105)",
        },
    }

    return WHITE_STYLE;
}

var STYLE_TYPE_ID=
{
    BLACK_ID:1, //黑色风格
    WHITE_ID:2  //白色风格
}


function GetStyleConfig(styleid)    //获取一个风格的配置变量
{
  switch (styleid)
    {
        case STYLE_TYPE_ID.BLACK_ID:
            return GetBlackStyle();
        case STYLE_TYPE_ID.WHITE_ID:
            return GetWhiteStyle();
        default:
            return null;
    }
}

var JSCommonHQStyle=
{
    GetStyleConfig:GetStyleConfig,
    STYLE_TYPE_ID:STYLE_TYPE_ID
};

export
{
    JSCommonHQStyle
}

/*
module.exports =
  {
    JSCommonHQStyle:
    {
        GetStyleConfig:GetStyleConfig,
        STYLE_TYPE_ID:STYLE_TYPE_ID
    }
  };
  */


