/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    全局配置颜色
*/

import { IFrameSplitOperator } from "./umychart.framesplit.wechat";





function JSChartResource() 
{
    this.TooltipBGColor = "rgb(255, 255, 255)"; //背景色
    this.TooltipAlpha = 0.92;                  //透明度

    this.SelectRectBGColor = "rgba(1,130,212,0.06)"; //背景色
    //   this.SelectRectAlpha=0.06;                  //透明度
    this.BGColor = 'rgb(255,255,255)';              //背景色

    this.UpBarColor = "rgb(238,21,21)";
    this.DownBarColor = "rgb(25,158,0)";
    this.UnchagneBarColor = "rgb(0,0,0)";
    this.EmptyBarBGColor="rgb(255,255,255)";  //空心柱子背景色
    this.MinKLineBarWidth=4;                        //最小的柱子宽度 比这个还小就画直线 
    this.MinColorKBarWidth=4;

    this.Minute = {};
    this.Minute.VolBarColor = null;
    this.Minute.PriceColor = "rgb(50,171,205)";
    this.Minute.PriceLineWidth=1; //价格线宽度
    this.Minute.AreaPriceColor = 'rgba(50,171,205,0.1)';
    this.Minute.AvPriceColor = "rgb(238,127,9)";

    this.Minute.NightDay=
    { 
        NightBGColor:"rgba(0,0,0,0.2)",
        Font:`12px 微软雅黑`,
        Day: { Color:"rgb(0,0,0)", BGColor:"rgb(179,179,179)", BorderColor:"rgb(179,179,179)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
        Night: { Color:"rgb(0,0,0)", BGColor:"rgb(179,179,179)", BorderColor:"rgb(179,179,179)", Margin:{ Left:5, Top:2, Bottom:2, Right:5 } },
    }

    this.DefaultTextColor = "rgb(43,54,69)";
    this.DefaultTextFont = '14px 微软雅黑';
    this.IndexTitleBGColor='rgb(217,219,220)';     //指标名字背景色
    this.IndexTitleBorderColor='rgb(180,180,180)';
    this.IndexTitleColor="rgb(43,54,69)";
    this.DynamicTitleFont = '12px 微软雅黑';        //指标动态标题字体
    this.OverlayIndexTitleBGColor='rgba(255,255,255,0.7)';
    this.IndexTitleButton=
    {
        Mergin:{ Left:5, Top:2, Bottom:1, Right:5 },
        Font:"11px 微软雅黑" ,
        RightSpace:5,
    }

    this.IndexTitle=
    {
        UpDownArrow:    //数值涨跌箭头
        {
            UpColor:"rgb(238,21,21)",   //上涨
            DownColor:"rgb(25,158,0)",  //下跌
            UnchangeColor:"rgb(0,0,0)"  //不变
        },

        ArrowType:0,
        EnableIndexArrow:true,  //指标数值是否带上涨下跌箭头

        NameArrow:{ Color:"rgb(43,54,69)", Space:2, Symbol:'▼' },
    }

    this.UpTextColor = "rgb(238,21,21)";
    this.DownTextColor = "rgb(25,158,0)";
    this.UnchagneTextColor = "rgb(0,0,0)";
    this.CloseLineColor = 'rgb(0,191,255)';
    this.CloseLineAreaColor = ['rgba(0,191,255,0.8)', 'rgba(0,191,255,0.2)'];

    this.Title = {
        TradeIndexColor:'rgb(105,105,105)', //交易指标颜色
        ColorIndexColor:'rgb(112,128,144)',  //五彩K线颜色

        VolColor:"rgb(43,54,69)",       //标题成交量
        AmountColor:"rgb(43,54,69)",    //成交金额 
        DateTimeColor:"rgb(43,54,69)",  //时间,日期  
        SettingColor:"rgb(43,54,69)",   //周期,复权
        NameColor:"rgb(43,54,69)" ,     //股票名称
        TurnoverRateColor:'rgb(43,54,69)',       //换手率
        PositionColor:"rgb(43,54,69)"       //持仓
    };

    this.FrameBorderPen = "rgb(225,236,242)";
    this.FrameSplitPen = "rgb(225,236,242)";          //分割线
    this.FrameSplitTextColor = "rgb(51,51,51)";     //刻度文字颜色
    this.FrameSplitTextFont = "12px 微软雅黑";        //坐标刻度文字字体
    this.FrameYLineDash=[2, 2];                     //Y轴线段虚线点间距,填null 就是实线
    this.FrameXLineDash=null;                      //X轴线段虚线点间距,填null 就是实线
    //this.FrameSplitTextFont = "14px PingFang-SC-Bold";//坐标刻度文字字体
    this.FrameTitleBGColor = "rgb(246,251,253)";      //标题栏背景色
    this.Frame = { 
        XBottomOffset: 0 ,  //X轴文字向下偏移
        YTopOffset:2,    //Y轴顶部文字向下偏移
        YTextPadding:[2,2],
        StringFormat:0,
        EnableRemoveZero:true,                  //移除小数点后面的0

        TitleBorderLine:{ Color:null, Dash:null },
    };  
    
    this.FrameLogo=
    {
        TextColor:'rgb(178,34,34)',
        Font:"bold 16px 微软雅黑",
        Text:"*仅学习使用*"     //请求不要修改声明, 任何修改声明产生的任何法律责任由修改者自行独立承担，与HQChart插件作者无关。
    };

    this.FrameLatestPrice = 
    {
        TextColor: 'rgb(255,255,255)',   //最新价格文字颜色
        UpBarColor: "rgb(238,21,21)",    //上涨
        DownBarColor: "rgb(25,158,0)",   //下跌
        UnchagneBarColor: "rgb(0,0,0)",   //平盘
        BGAlpha: 0.6,

        OverlayTextColor:"rgb(255,255,255)",       //叠加股票的文字颜色
    };

    this.FrameMargin = 4;     //左右一共的边距
    this.FrameLeftMargin = 2;
    this.FrameRightMargin=2;

    //叠加指标框架
    this.OverlayFrame=
    {
        BolderPen:'rgb(190,190,190)',                    //指标边框线
        TitleColor:'rgb(105,105,105)',                   //指标名字颜色
        TitleFont:'11px arial',                          //指标名字字体
    };

    this.CorssCursorBGColor = "rgb(43,54,69)";            //十字光标背景
    this.CorssCursorTextColor = "rgb(255,255,255)";
    this.CorssCursorTextFont = "12px 微软雅黑";
    this.CorssCursorHPenColor = "rgb(130,130,130)";          //十字光标线段颜色(水平)
    this.CorssCursorVPenColor = "rgb(130,130,130)";          //十字光标线段颜色(垂直)
    this.CorssCursorLineDash=[3,2];            //十字光标虚线

    this.CorssCursor=
    {
        CorssPoint:
        {
            Center:{ Radius:5, Color:"rgb(50,171,205)"},
            Border:{ Color:'rgb(255,255,255)', Width:1} 
        },

        BottomText:{ Margin: { Left:4, Right:4, Top:2, Bottom:2 }, TextOffset:{X:4, Y:0 } },
        LeftText:{ Margin: { Left:4, Right:4, Top:2, Bottom:2 }, TextOffset:{X:4, Y:0 } },
        RightText:{ Margin: { Left:4, Right:4, Top:2, Bottom:2 }, TextOffset:{X:4, Y:0 } },
    }

    //指标锁
    this.IndexLock=
    {
        BGColor:"rgb(220, 220, 220)",
        TextColor:"rgb(210, 34, 34)",
        Font:'14px 微软雅黑',
        Title:'🔒开通权限'
    }

    this.Domain = "http://127.0.0.1:8080";               //API域名
    this.CacheDomain = "http://127.0.0.1:8087";     //缓存域名

    this.KLine =
        {
            MaxMin: { Font: '12px 微软雅黑', Color: 'rgb(111,111,111)', RightArrow:"→", LeftArrow:"←", HighYOffset:0, LowYOffset:0 },   //K线最大最小值显示
            Info:  //信息地雷
            {
                Color: 'rgb(205,149,12)',
                Color2: 'rgb(255,133,3)',  //三角图形颜色
                TextColor: '#197de9',
                TextBGColor: 'rgba(220,220,220,0.5)',
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
        };

    this.PriceGapStyple=
    { 
        Line:{ Color:"rgb(186,186,186)" }, 
        Text:{ Color:"rgb(105,105,105)", Font:'12px 微软雅黑' } 
    };

    this.Index = {};
    //指标线段颜色
    this.Index.LineColor =
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

        ];

    this.ColorArray =       //自定义指标默认颜色
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
        ];

    this.OverlaySymbol={ Random:0 };    //Random 颜色的随机数
    this.OverlaySymbol.Color=   //叠加股票颜色
    [
        "rgb(38,198,218)",
        "rgb(103,58,183)",
        "rgb(0,191,165)",
        "rgb(130,177,255)",
    ];

    //历史数据api
    this.Index.StockHistoryDayApiUrl = "https://opensource.zealink.com/API/StockHistoryDay";
    //市场多空
    this.Index.MarketLongShortApiUrl = "https://opensource.zealink.com/API/FactorTiming";
    //市场关注度
    this.Index.MarketAttentionApiUrl = "https://opensource.zealink.com/API/MarketAttention";
    //行业,指数热度
    this.Index.MarketHeatApiUrl = "https://opensource.zealink.com/API/MarketHeat"
    //自定义指数热度
    this.Index.CustomIndexHeatApiUrl = "https://opensource.zealink.com/API/QuadrantCalculate";

    //指标不支持信息
    this.Index.NotSupport = { Font: "14px 微软雅黑", TextColor: "rgb(52,52,52)" };

    //画图工具
    this.DrawPicture =
    {
        LineColor:
        [ 
            "rgb(41,98,255)" 
        ],
        PointColor:
        [
            "rgb(41,98,255)",          //选中颜色
            "rgb(89,135,255)",          //moveon颜色
            "rgb(255,255,255)"          //空心点背景色
        ],
    }

    this.KLineTrain =
    {
        Font: 'bold 14px 宋体',
        LastDataIcon: { Color: 'rgb(0,0,205)', Text: '⬇' },
        BuyIcon: { Color: 'rgb(255,185, 15)', Text: '买' },
        SellIcon: { Color: 'rgb(70,130,180)', Text: '卖' }
    };

    //K线tooltip
    this.TooltipPaint =
    {
        BGColor: 'rgba(250,250,250,0.8)',    //背景色
        BorderColor: 'rgb(120,120,120)',     //边框颜色
        TitleColor: 'rgb(120,120,120)',       //标题颜色
        TitleFont: '13px 微软雅黑'   //字体
    },

    //弹幕
    this.Barrage =
    {
        Font: '16px 微软雅黑',   //字体
        Height: 20,
        Color: 'RGB(109,109,109)'
    }

    //走势图 信息地雷
    this.MinuteInfo = {
        TextColor: 'rgb(84,143,255)',
        Font: '14px 微软雅黑',
        PointColor: 'rgb(38,113,254)',
        LineColor: 'rgb(120,167,255)',
        TextBGColor: 'rgba(255,255,255,0.8)',
        PointRadius:4,  //圆点半径
    };

    //单图标指标ChartSingleText -> DRAWICON
    this.DRAWICON=
    {
        Text:
        {
            MaxSize:50,  //字体最大
            MinSize:20,  //字体最小
    
            Zoom:
            {
                Type:2,    //0=放大(K线宽度*Value) 1=放大(K线+间距)*Value 2=(K线+间距)+2*Value;
                Value:1
            },

            FontName:'Arial'    //字体
        }
    }

    this.DRAWTEXT=
    {
        MaxSize:18,  //字体最大
        MinSize:18,  //字体最小

        Zoom:
        {
            Type:1,    //0=放大(K线宽度*Value) 1=放大(K线+间距)*Value 2=(K线+间距)+2*Value;
            Value:1
        },

        FontName:'微软雅黑'    //字体
    }

    this.DRAWNUMBER=
    {
        MaxSize:18,  //字体最大
        MinSize:18,  //字体最小

        Zoom:
        {
            Type:1,    //0=放大(K线宽度*Value) 1=放大(K线+间距)*Value 2=(K线+间距)+2*Value;
            Value:1
        },

        FontName:'微软雅黑'    //字体
    }

    this.DRAWABOVE=
    {
        YOffset:0   //y坐标向上偏移
    }

    this.CIRCLEDOT=
    {
        Radius:1.3
    }

    this.POINTDOT=
    {
        Radius:2
    }

    this.DOTLINE=
    {
        LineDash:[3,5]
    }

    this.StockChip=
    {
        InfoColor:'rgb(0,0,0)', //文字颜色
        Font:'12px 微软雅黑',
        DayInfoColor:'rgb(255,255,255)', //周期颜色内文字颜色

        PhoneCloseButton:
        {
            Color:"rgb(255,255,255)",
            Size:15,
            Border:{ BGColor:"rgb(169,169,169)" }
        }
    }

    //深度图
    this.DepthChart=
    {
        BidColor: { Line:"rgb(82,176,123)", Area:"rgba(82,176,123,0.8)"},  //卖
        AskColor: { Line:"rgb(207,76,89)", Area:"rgba(207,76,89, 0.8)"},   //买
        LineWidth:4
    }

    this.DepthCorss=
    {
        BidColor: { Line:"rgb(82,176,123)" },  //卖
        AskColor: { Line:"rgb(207,76,89)" },   //买
        LineWidth:2,    //线段宽度
        LineDash:[3,3],
        Tooltip:
        { 
            BGColor:'rgba(236,240,245, 0.8)', TextColor:"rgb(130,140,151)",
            Border:{ Top:5, Left:20, Right:20, Bottom:5, ItemSpace: 5},
            Font:"14px 微软雅黑",
        }
    }

    //报价列表
    this.Report=
    {
        BorderColor:'rgb(192,192,192)',    //边框线
        SelectedColor:"rgb(180,240,240)",  //选中行
        Header:
        {
            Color:"rgb(60,60,60)",      //表头文字颜色
            SortColor:"rgb(255,0,0)",   //排序箭头颜色
            Mergin:{ Left:5, Right:5, Top:4, Bottom:2},    //表头四周间距
            Font:{ Size:15, Name:"微软雅黑" }   //表头字体
        },

        Item:
        {
            Mergin:{ Top:2, Bottom:0,Left:5, Right:5 }, //单元格四周间距
            Font:{ Size:15, Name:"微软雅黑"},
            BarMergin:{ Top:2, Left:3, Right:3, Bottom:2 },//单元格字体
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
            Color:"rgb(180,180,180)",
            Mergin:{ Top:1, Bottom:1,Left:0, Right:0 },
        },

        FieldColor:
        {
            Index:"rgb(60,60,60)",  //序号
            Symbol:"rgb(60,60,60)",
            Name:"rgb(60,60,60)",
            Vol:"rgb(90,90,90)",    //成交量
            Amount:"rgb(90,90,90)", //成交金额
            Text:"rgb(60,60,60)",   //默认文本
        },

        UpTextColor:"rgb(238,21,21)",      //上涨文字颜色
        DownTextColor:"rgb(25,158,0)",     //下跌文字颜色
        UnchagneTextColor:"rgb(90,90,90)",     //平盘文字颜色 
        CloseLineColor:"rgb(30,144,255)",
        PageInfo:
        {
            Font:{ Size:15, Name:"微软雅黑"},
            TextColor:"rgb(0,0,0)",
            BGColor:"rgba(180,180,180,0.5)",
            Mergin:{ Left:5, Right:5, Top:4, Bottom:2 },
        },

        CloseLine:
        {
            CloseColor:"rgb(30,144,255)",
            YCloseColor:"rgba(105,105,105,0.5)",  //昨收线
            AreaColor:'rgba(0,191,255,0.2)',
        },
    }

    // //自定义风格
    this.SetStyle = function (style) 
    {
        if (style.TooltipBGColor) this.TooltipBGColor = style.TooltipBGColor;
        if (style.TooltipAlpha) this.TooltipAlpha = style.TooltipAlpha;
        if (style.BGColor) this.BGColor = style.BGColor;
        if (style.SelectRectBGColor) this.SelectRectBGColor = style.SelectRectBGColor;
        if (style.UpBarColor) this.UpBarColor = style.UpBarColor;
        if (style.DownBarColor) this.DownBarColor = style.DownBarColor;
        if (style.UnchagneBarColor) this.UnchagneBarColor = style.UnchagneBarColor;
        if (style.EmptyBarBGColor) this.EmptyBarBGColor=style.EmptyBarBGColor;
        if (style.Minute) 
        {
            if (style.Minute.VolBarColor) this.Minute.VolBarColor = style.Minute.VolBarColor;
            if (style.Minute.PriceColor) this.Minute.PriceColor = style.Minute.PriceColor;
            if (style.Minute.AvPriceColor) this.Minute.AvPriceColor = style.Minute.AvPriceColor;
            if (style.Minute.AreaPriceColor) this.Minute.AreaPriceColor = style.Minute.AreaPriceColor;
            if (IFrameSplitOperator.IsNumber(style.Minute.PriceLineWidth)) this.Minute.PriceLineWidth = style.Minute.PriceLineWidth;
            
            if (style.Minute.NightDay)
            {
                var item=style.Minute.NightDay;
                if (item.NightBGColor) this.Minute.NightDay.NightBGColor=item.NightBGColor;
                if (item.Font) this.Minute.NightDay.Font=item.Font;
                if (item.Day)
                {
                    var subItem=item.Day;
                    if (subItem.Color) this.Minute.NightDay.Day.Color=subItem.Color;
                    if (subItem.BGColor) this.Minute.NightDay.Day.BGColor=subItem.BGColor;
                    if (subItem.BorderColor) this.Minute.NightDay.Day.BorderColor=subItem.BorderColor;
                    JSChartResource.CopyMargin(this.Minute.NightDay.Day.Margin,subItem.Margin);
                }
                if (item.Night)
                {
                    var subItem=item.Night;
                    if (subItem.Color) this.Minute.NightDay.Night.Color=subItem.Color;
                    if (subItem.BGColor) this.Minute.NightDay.Night.BGColor=subItem.BGColor;
                    if (subItem.BorderColor) this.Minute.NightDay.Night.BorderColor=subItem.BorderColor;
                    JSChartResource.CopyMargin(this.Minute.NightDay.Night.Margin,subItem.Margin);
                }
            }
        }
        if (style.DefaultTextColor) this.DefaultTextColor = style.DefaultTextColor;
        if (style.DefaultTextFont) this.DefaultTextFont = style.DefaultTextFont;
        if (style.DynamicTitleFont) this.DynamicTitleFont = style.DynamicTitleFont;
        if (style.IndexTitleBGColor) this.IndexTitleBGColor=style.IndexTitleBGColor;
        if (style.OverlayIndexTitleBGColor) this.OverlayIndexTitleBGColor=style.OverlayIndexTitleBGColor;
        if (style.IndexTitleBorderColor) this.IndexTitleBorderColor=style.IndexTitleBorderColor;
        if (style.IndexTitleColor) this.IndexTitleColor=style.IndexTitleColor;
        if (style.UpTextColor) this.UpTextColor = style.UpTextColor;
        if (style.DownTextColor) this.DownTextColor = style.DownTextColor;
        if (style.UnchagneTextColor) this.UnchagneTextColor = style.UnchagneTextColor;
        if (style.CloseLineColor) this.CloseLineColor = style.CloseLineColor;
        if (style.CloseLineAreaColor) this.CloseLineAreaColor = style.CloseLineAreaColor;
        if (style.FrameBorderPen) this.FrameBorderPen = style.FrameBorderPen;
        if (style.FrameSplitPen) this.FrameSplitPen = style.FrameSplitPen;
        if (style.FrameSplitTextColor) this.FrameSplitTextColor = style.FrameSplitTextColor;
        if (style.FrameSplitTextFont) this.FrameSplitTextFont = style.FrameSplitTextFont;
        if (style.FrameTitleBGColor) this.FrameTitleBGColor = style.FrameTitleBGColor;

        if (style.IndexTitle)
        {
            var item=style.IndexTitle;
            if (item.UpDownArrow)
            {
                var subItem=item.UpDownArrow;
                if (subItem.UpColor) this.IndexTitle.UpDownArrow.UpColor = subItem.UpColor;
                if (subItem.DownColor) this.IndexTitle.UpDownArrow.DownColor = subItem.DownColor;
                if (subItem.UnchangeColor) this.IndexTitle.UpDownArrow.UnchangeColor = subItem.UnchangeColor;
            }

            if (IFrameSplitOperator.IsNumber(item.ArrowType)) this.IndexTitle.ArrowType=item.ArrowType;
            if (IFrameSplitOperator.IsBool(item.EnableIndexArrow)) this.IndexTitle.EnableIndexArrow=item.EnableIndexArrow;
            
            if (item.NameArrow)
            {
                var subItem=item.NameArrow;
                if (subItem.Color) this.IndexTitle.NameArrow.Color = subItem.Color;
                if (subItem.Symbol) this.IndexTitle.NameArrow.Symbol = subItem.Symbol;
                if (IFrameSplitOperator.IsNumber(subItem.Space)) this.IndexTitle.NameArrow.Space = subItem.Space;
            }
        }

        if (style.Frame) 
        {
            var item=style.Frame;
            if (style.Frame.XBottomOffset) this.Frame.XBottomOffset = style.Frame.XBottomOffset;
            if (style.Frame.YTopOffset) this.Frame.YTopOffset = style.Frame.YTopOffset;
            if (item.TitleBorderLine)
            {
                var subItem=item.TitleBorderLine;
                var destItem=this.Frame.TitleBorderLine;
                if (subItem.Color) destItem.Color=subItem.Color;
                if (IFrameSplitOperator.IsNonEmptyArray(subItem.Dash)) destItem.Dash=subItem.Dash.slice();
            }
        }

        if (style.FrameLatestPrice) 
        {
            if (style.FrameLatestPrice.TextColor) this.FrameLatestPrice.TextColor = style.FrameLatestPrice.TextColor;
            if (style.FrameLatestPrice.UpBarColor) this.FrameLatestPrice.UpBarColor = style.FrameLatestPrice.UpBarColor;
            if (style.FrameLatestPrice.DownBarColor) this.FrameLatestPrice.DownBarColor = style.FrameLatestPrice.DownBarColor;
            if (style.FrameLatestPrice.UnchagneBarColor) this.FrameLatestPrice.UnchagneBarColor = style.FrameLatestPrice.UnchagneBarColor;
            if (style.FrameLatestPrice.BGAlpha) this.FrameLatestPrice.BGAlpha = style.FrameLatestPrice.BGAlpha;
            if (style.FrameLatestPrice.OverlayTextColor) this.FrameLatestPrice.OverlayTextColor = style.FrameLatestPrice.OverlayTextColor;
        }

        if (style.CorssCursorBGColor) this.CorssCursorBGColor = style.CorssCursorBGColor;
        if (style.CorssCursorTextColor) this.CorssCursorTextColor = style.CorssCursorTextColor;
        if (style.CorssCursorTextFont) this.CorssCursorTextFont = style.CorssCursorTextFont;
        if (style.CorssCursorHPenColor) this.CorssCursorHPenColor = style.CorssCursorHPenColor;
        if (style.CorssCursorVPenColor) this.CorssCursorVPenColor = style.CorssCursorVPenColor;
        if (style.CorssCursorLineDash) this.CorssCursorLineDash = style.CorssCursorLineDash.slice();

        if (style.CorssCursor && style.CorssCursor.CorssPoint)
        {
            var item=style.CorssCursor.CorssPoint;
            if (item.Center)
            {
                var subItem=item.Center;
                var subDest=this.CorssCursor.CorssPoint.Center;
                if (IFrameSplitOperator.IsNumber(subItem.Radius)) subDest.Radius=subItem.Radius;
                if (subItem.Color) subDest.Color=subItem.Color;
            }

            if (item.Border)
            {
                var subItem=item.Border;
                var subDest=this.CorssCursor.CorssPoint.Border;
                if (IFrameSplitOperator.IsNumber(subItem.Width)) subDest.Width=subItem.Width;
                if (subItem.Color) subDest.Color=subItem.Color;
            }
        }
        
        if (style.KLine) this.KLine = style.KLine;
        if (style.Index) 
        {
            if (style.Index.LineColor) this.Index.LineColor = style.Index.LineColor;
            if (style.Index.NotSupport) this.Index.NotSupport = style.Index.NotSupport;
        }

        if (style.PriceGapStyple)
        {
            var item=style.PriceGapStyple;
            if (item.Line && item.Line.Color) this.PriceGapStyple.Line.Color=item.Line.Color;
            if (item.Text)
            {
                if (item.Text.Color) this.PriceGapStyple.Text.Color=item.Text.Color;
                if (item.Text.Font) this.PriceGapStyple.Text.Font=item.Text.Font;
            }
        }
        
        if (style.ColorArray) this.ColorArray = style.ColorArray;

        if (style.DrawPicture) 
        {
            this.DrawPicture.LineColor = style.DrawPicture.LineColor;
            this.DrawPicture.PointColor = style.DrawPicture.PointColor;
        }

        if (style.TooltipPaint) 
        {
            if (style.TooltipPaint.BGColor) this.TooltipPaint.BGColor = style.TooltipPaint.BGColor;
            if (style.TooltipPaint.BorderColor) this.TooltipPaint.BorderColor = style.TooltipPaint.BorderColor;
            if (style.TooltipPaint.TitleColor) this.TooltipPaint.TitleColor = style.TooltipPaint.TitleColor;
            if (style.TooltipPaint.TitleFont) this.TooltipPaint.TitleFont = style.TooltipPaint.TitleFont;
        }

        if (style.MinuteInfo)
        {
            var item=style.MinuteInfo;
            if (style.MinuteInfo.TextColor) this.MinuteInfo.TextColor=style.MinuteInfo.TextColor;
            if (style.MinuteInfo.Font) this.MinuteInfo.Font=style.MinuteInfo.Font;
            if (style.MinuteInfo.PointColor) this.MinuteInfo.PointColor=style.MinuteInfo.PointColor;
            if (style.MinuteInfo.LineColor) this.MinuteInfo.LineColor=style.MinuteInfo.LineColor;
            if (style.MinuteInfo.TextBGColor) this.MinuteInfo.TextBGColor=style.MinuteInfo.TextBGColor;
            if (IFrameSplitOperator.IsNumber(item.PointRadius)) this.MinuteInfo.PointRadius=item.PointRadius;
        }

        if (style.Title)
        {
            if (style.Title.TradeIndexColor) this.Title.TradeIndexColor=style.Title.TradeIndexColor;
            if (style.Title.ColorIndexColor) this.Title.ColorIndexColor=style.Title.ColorIndexColor;

            if (style.Title.VolColor) this.Title.VolColor=style.Title.VolColor;
            if (style.Title.AmountColor) this.Title.AmountColor=style.Title.AmountColor;
            if (style.Title.DateTimeColor) this.Title.DateTimeColor=style.Title.DateTimeColor;
            if (style.Title.NameColor) this.Title.NameColor=style.Title.NameColor;
            if (style.Title.SettingColor) this.Title.SettingColor=style.Title.SettingColor;
            if (style.Title.TurnoverRateColor) this.Title.TurnoverRateColor=style.Title.TurnoverRateColor;
            if (style.Title.PositionColor) this.Title.PositionColor=style.Title.PositionColor;
        }

        if (style.DRAWICON) 
        {
            if (style.DRAWICON.Text)
            {
                var item=style.DRAWICON.Text;
                if (this.IsPlusNumber(item.MaxSize)) this.DRAWICON.Text.MaxSize=item.MaxSize;
                if (this.IsPlusNumber(item.MinSize)) this.DRAWICON.Text.MinSize=item.MinSize;
                if (item.Zoom) this.DRAWICON.Text.Zoom=item.Zoom;
                if (item.FontName) this.DRAWICON.Text.FontName=item.FontName;
            }
        }

        if (style.DRAWTEXT)
        {
            var item=style.DRAWTEXT;
            if (this.IsPlusNumber(item.MaxSize)) this.DRAWICON.MaxSize=item.MaxSize;
            if (this.IsPlusNumber(item.MinSize)) this.DRAWICON.MinSize=item.MinSize;
            if (item.Zoom) this.DRAWICON.Zoom=item.Zoom;
            if (item.FontName) this.DRAWICON.FontName=item.FontName;
        }

        if (style.DRAWNUMBER)
        {
            var item=style.DRAWNUMBER;
            if (this.IsPlusNumber(item.MaxSize)) this.DRAWNUMBER.MaxSize=item.MaxSize;
            if (this.IsPlusNumber(item.MinSize)) this.DRAWNUMBER.MinSize=item.MinSize;
            if (item.Zoom) this.DRAWNUMBER.Zoom=item.Zoom;
            if (item.FontName) this.DRAWNUMBER.FontName=item.FontName;
        }

        if (style.DRAWABOVE)
        {
            var item=style.DRAWABOVE;
            if (this.IsNumber(item.YOffset)) this.DRAWABOVE.YOffset=item.YOffset;
        }

        if (style.StockChip)
        {
            var item=style.StockChip;
            if (item.Font) this.StockChip.Font=item.Font;
            if (item.InfoColor) this.StockChip.InfoColor=item.InfoColor;
            if (item.DayInfoColor) this.StockChip.DayInfoColor=item.DayInfoColor;
            if (item.PhoneCloseButton)
            {
                var subItem=item.PhoneCloseButton;
                if (subItem.Color) this.StockChip.PhoneCloseButton.Color=subItem.Color;
                if (IFrameSplitOperator.IsNumber(subItem.Size)) this.StockChip.PhoneCloseButton.Size=subItem.Size;
                if (subItem.Border)
                {
                    if (subItem.Border.BGColor) this.StockChip.PhoneCloseButton.Border.BGColor=subItem.Border.BGColor;
                }
            }
        }

        if (style.DepthChart)
        {
            var item=style.DepthChart;
            if (item.BidColor)
            {
                if (item.BidColor.Line) this.DepthChart.BidColor.Line=item.BidColor.Line;
                if (item.BidColor.Area) this.DepthChart.BidColor.Area=item.BidColor.Area;
            }
            if (item.AskColor)
            {
                if (item.AskColor.Line) this.DepthChart.AskColor.Line=item.AskColor.Line;
                if (item.AskColor.Area) this.DepthChart.AskColor.Area=item.AskColor.Area;
            }

            if (item.LineWidth) this.DepthChart.LineWidth=item.LineWidth;
        }

        if (style.DepthCorss)
        {
            var item=style.DepthCorss;
            if (item.BidColor)
            {
                if (item.BidColor.Line) this.DepthCorss.BidColor.Line=item.BidColor.Line;
            }

            if (item.AskColor)
            {
                if (item.AskColor.Line) this.DepthCorss.AskColor.Line=item.AskColor.Line;
            }

            if (item.LineWidth) this.DepthCorss.LineWidth=item.LineWidth;
            if (item.LineDash) this.DepthCorss.LineDash=item.LineDash;

            if (item.Tooltip)
            {
                var tooltip=item.Tooltip;
                if (tooltip.BGColor) this.DepthCorss.Tooltip.BGColor=tooltip.BGColor;
                if (tooltip.TextColor) this.DepthCorss.Tooltip.TextColor=tooltip.TextColor;
                if (tooltip.Font) this.DepthCorss.Tooltip.Font=tooltip.Font;
                if (tooltip.LineHeight) this.DepthCorss.Tooltip.LineHeight=tooltip.LineHeight;

                var border=tooltip.Border;
                if (this.IsNumber(border.Top)) this.DepthCorss.Tooltip.Border.Top=border.Top;
                if (this.IsNumber(border.Left)) this.DepthCorss.Tooltip.Border.Left=border.Left;
                if (this.IsNumber(border.Right)) this.DepthCorss.Tooltip.Border.Right=border.Right;
                if (this.IsNumber(border.Bottom)) this.DepthCorss.Tooltip.Border.Bottom=border.Bottom;
                if (this.IsNumber(border.ItemSpace)) this.DepthCorss.Tooltip.Border.ItemSpace=border.ItemSpace;
            }
        }

        if (style.CIRCLEDOT)
        {
            var item=style.CIRCLEDOT;
            if (this.IsNumber(item.Radius)) this.CIRCLEDOT.Radius=item.Radius;
        }

        if (style.POINTDOT)
        {
            var item=style.POINTDOT;
            if (this.IsNumber(item.Radius)) this.POINTDOT.Radius=item.Radius;
        }

        if (style.DOTLINE)
        {
            var item=style.DOTLINE;
            if (IFrameSplitOperator.IsNonEmptyArray(item.LineDash)) this.DOTLINE.LineDash=item.LineDash.slice();
        }

        if (style.Report)
        {
            var item=style.Report;
            if (item.BorderColor) this.Report.BorderColor=item.BorderColor;
            if (item.UpTextColor) this.Report.UpTextColor=item.UpTextColor;
            if (item.DownTextColor) this.Report.DownTextColor=item.DownTextColor;
            if (item.UnchagneTextColor) this.Report.UnchagneTextColor=item.UnchagneTextColor;
            if (item.BorderColor) this.Report.SelectedColor=item.SelectedColor;
            if (item.CloseLineColor) this.Report.CloseLineColor=item.CloseLineColor;
            
            if (item.Header)
            {
                var header=item.Header;
                if (header.Color) this.Report.Header.Color=header.Color;
                if (header.SortColor) this.Report.Header.SortColor=header.SortColor;
                if (header.Mergin)
                {
                    var mergin=header.Mergin;
                    if (this.IsNumber(mergin.Left)) this.Report.Header.Mergin.Left=mergin.Left;
                    if (this.IsNumber(mergin.Right)) this.Report.Header.Mergin.Left=mergin.Right;
                    if (this.IsNumber(mergin.Top)) this.Report.Header.Mergin.Top=mergin.Top;
                    if (this.IsNumber(mergin.Bottom)) this.Report.Header.Mergin.Bottom=mergin.Bottom;
                }
                if (header.Font)
                {
                    var font=header.Font;
                    if (font.Name) this.Report.Header.Font.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.Header.Font.Size=font.Size;
                }
            }

            if (item.Item)
            {
                var row=item.Item;
                if (row.Mergin)
                {
                    var mergin=row.Mergin;
                    if (this.IsNumber(mergin.Left)) this.Report.Item.Mergin.Left=mergin.Left;
                    if (this.IsNumber(mergin.Right)) this.Report.Item.Mergin.Right=mergin.Right;
                    if (this.IsNumber(mergin.Top)) this.Report.Item.Mergin.Top=mergin.Top;
                    if (this.IsNumber(mergin.Bottom)) this.Report.Item.Mergin.Bottom=mergin.Bottom;
                }

                if (row.Font)
                {
                    var font=row.Font;
                    if (font.Name) this.Report.Item.Font.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.Item.Font.Size=font.Size;
                }

                if (row.BarMergin)
                {
                    var mergin=row.BarMergin;
                    if (this.IsNumber(mergin.Left)) this.Report.Item.BarMergin.Left=mergin.Left;
                    if (this.IsNumber(mergin.Top)) this.Report.Item.BarMergin.Top=mergin.Top;
                    if (this.IsNumber(mergin.Right)) this.Report.Item.BarMergin.Right=mergin.Right;
                    if (this.IsNumber(mergin.Bottom)) this.Report.Item.BarMergin.Bottom=mergin.Bottom;
                }

                if (row.NameFont)
                {
                    var font=row.NameFont;
                    if (font.Name) this.Report.Item.NameFont.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.Item.NameFont.Size=font.Size;
                }

                if (row.SymbolFont)
                {
                    var font=row.SymbolFont;
                    if (font.Name) this.Report.Item.SymbolFont.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.Item.SymbolFont.Size=font.Size;
                }
            }

            if (item.FixedItem)
            {
                var row=item.FixedItem;
                if (row.Font)
                {
                    var font=row.Font;
                    if (font.Name) this.Report.FixedItem.Font.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.FixedItem.Font.Size=font.Size;
                }
            }

            if (item.LimitBorder)
            {
                var limit=item.LimitBorder;
                if (limit.Color) this.Report.LimitBorder.Color=limit.Color;
                if (limit.Mergin)
                {
                    var mergin=limit.Mergin;
                    if (this.IsNumber(mergin.Left)) this.Report.LimitBorder.Mergin.Left=mergin.Left;
                    if (this.IsNumber(mergin.Top)) this.Report.LimitBorder.Mergin.Top=mergin.Top;
                    if (this.IsNumber(mergin.Right)) this.Report.LimitBorder.Mergin.Right=mergin.Right;
                    if (this.IsNumber(mergin.Bottom)) this.Report.LimitBorder.Mergin.Bottom=mergin.Bottom;
                }
            }

            if (item.FieldColor)
            {
                var filed=item.FieldColor;
                if (filed.Name) this.Report.FieldColor.Name=filed.Name;
                if (filed.Symbol) this.Report.FieldColor.Symbol=filed.Symbol;
                if (filed.Vol) this.Report.FieldColor.Vol=filed.Vol;
                if (filed.Amount) this.Report.FieldColor.Amount=filed.Amount;
                if (filed.Index) this.Report.FieldColor.Index=filed.Index;
                if (filed.BarTitle) this.Report.FieldColor.BarTitle=filed.BarTitle;
                if (filed.Text) this.Report.FieldColor.Text=filed.Text;

                if (this.IsNonEmptyArray(filed.Bar))
                {
                    for(var i=0;i<filed.Bar.length;++i)
                        this.Report.FieldColor.Bar[i]=filed.Bar[i];
                }
            }

            if (item.PageInfo)
            {
                var pageinfo=item.PageInfo;
                if (pageinfo.Font)
                {
                    var font=pageinfo.Font;
                    if (font.Name) this.Report.PageInfo.Font.Name=font.Name;
                    if (this.IsNumber(font.Size)) this.Report.PageInfo.Font.Size=font.Size;
                }

                if (pageinfo.TextColor) this.Report.PageInfo.TextColor=pageinfo.TextColor;
                if (pageinfo.BGColor) this.Report.PageInfo.BGColor=pageinfo.BGColor;

                if (pageinfo.Mergin)
                {
                    var mergin=pageinfo.Mergin;
                    if (this.IsNumber(mergin.Left)) this.Report.PageInfo.Mergin.Left=mergin.Left;
                    if (this.IsNumber(mergin.Top)) this.Report.PageInfo.Mergin.Top=mergin.Top;
                    if (this.IsNumber(mergin.Right)) this.Report.PageInfo.Mergin.Right=mergin.Right;
                    if (this.IsNumber(mergin.Bottom)) this.Report.PageInfo.Mergin.Bottom=mergin.Bottom;
                }
            }
        }

        if (style.KLineTrain)  this.SetKLineTrain(style.KLineTrain);
        if (style.IndexLock) this.SetIndexLock(style.IndexLock);
    }

    this.SetKLineTrain=function(style)
    {
        var dest=this.KLineTrain;
        if (style.Font) dest.Font=style.Font;
        if (style.LastDataIcon)
        {
            var subItem=style.LastDataIcon;
            if (subItem.Color) dest.LastDataIcon.Color=subItem.Color;
            if (subItem.Text) dest.LastDataIcon.Text=subItem.Text;
        }

        if (style.BuyIcon)
        {
            var subItem=style.BuyIcon;
            if (subItem.Color) dest.BuyIcon.Color=subItem.Color;
            if (subItem.Text) dest.BuyIcon.Text=subItem.Text;
        }

        if (style.SellIcon)
        {
            var subItem=style.SellIcon;
            if (subItem.Color) dest.SellIcon.Color=subItem.Color;
            if (subItem.Text) dest.SellIcon.Text=subItem.Text;
        }
    }

    this.SetIndexLock=function(style)
    {
        var item=style;
        var dest=this.IndexLock;
        if (item.BGColor) dest.BGColor=item.BGColor;
        if (item.TextColor) dest.TextColor=item.TextColor;
        if (item.Font) dest.Font=item.Font;
        if (item.Title) dest.Title=item.Title;
    }

    
    this.IsNumber=function(value)
    {
        if (value==null) return false;
        if (isNaN(value)) return false;

        return true;
    }

    //判断是否是正数
    this.IsPlusNumber=function(value)
    {
        if (value==null) return false;
        if (isNaN(value)) return false;

        return value>0;
    }

    //是否是非空的数组
    this.IsNonEmptyArray=function(ary)
    {
        if (!ary) return;
        if (!Array.isArray(ary)) return;

        return ary.length>0;
    }
}


JSChartResource.CopyMargin=function(dest,src)
{
    if (!src || !dest) return;

    if (IFrameSplitOperator.IsNumber(src.Left)) dest.Left=src.Left;
    if (IFrameSplitOperator.IsNumber(src.Top)) dest.Top=src.Top;
    if (IFrameSplitOperator.IsNumber(src.Right)) dest.Right=src.Right;
    if (IFrameSplitOperator.IsNumber(src.Bottom)) dest.Bottom=src.Bottom;
}


var g_JSChartResource = new JSChartResource();

var JSCHART_LANGUAGE_ID =
{
    LANGUAGE_CHINESE_ID: 0, //简体中文 CN
    LANGUAGE_ENGLISH_ID: 1, //英文 EN
    LANGUAGE_TRADITIONAL_CHINESE_ID:2,  //繁体中文 TC
};

function JSChartLocalization() 
{
    this.TextResource = new Map([
        //内部tooltip
        ['Tooltip-Open', {CN:'开:', EN:'O:', TC:'開'}],
        ['Tooltip-High', {CN:'高:', EN:'H:', TC:'高'}],
        ['Tooltip-Low', {CN:'低:', EN:'L:', TC:'低'}],
        ['Tooltip-Close', {CN:'收:', EN:'C:', TC:'收'}],
        ['Tooltip-Increase', {CN:'幅:', EN:'I:', TC:'幅'}],
        ['Tooltip-Vol', {CN:'量:', EN:'V:', TC:'量'}],
        ['Tooltip-Amount', {CN:'额:', EN:'A:', TC:'額'}],
        ['Tooltip-AvPrice', {CN:'均:', EN:'AP:', TC:'均'}],
        ['Tooltip-Price', {CN:'价:', EN:'P:', TC:'價'}],
        ['Tooltip-Exchange', {CN:'换:', EN:'E:', TC:'換'}],
        ['Tooltip-Position',{CN:'持:', EN:'P:', TC:'持'}],

        //K线动态标题
        ['KTitle-Open', {CN:'开:', EN:'O:', TC:'開'}],
        ['KTitle-High', {CN:'高:', EN:'H:', TC:'高'}],
        ['KTitle-Low', {CN:'低:', EN:'L:', TC:'低'}],
        ['KTitle-Close', {CN:'收:', EN:'C:', TC:'收'}],
        ['KTitle-Increase', {CN:'幅:', EN:'I:', TC:'幅'}],
        ['KTitle-Vol', {CN:'量:', EN:'V:', TC:'量'}],
        ['KTitle-Amount', {CN:'额:', EN:'A:', TC:'額'}],
        ['KTitle-Exchange', {CN:'换:', EN:'E:', TC:'換'}],
        ['KTitle-Position', {CN:'持:', EN:'P:', TC:'持'}],
        ['KTitle-Price', {CN:'价:', EN:'Price:', TC:'價'}],

        //走势图动态标题
        ['MTitle-Close', {CN:'价:', EN:'C:', TC:'價'}],
        ['MTitle-AvPrice', {CN:'均:', EN:'AC:', TC:'均'}],
        ['MTitle-Increase', {CN:'幅:', EN:'I:', TC:'幅'}],
        ['MTitle-Vol', {CN:'量:', EN:'V:', TC:'量'}],
        ['MTitle-Amount', {CN:'额:', EN:'A:', TC:'額'}],
        ['MTitle-Position', {CN:'持:', EN:'P:', TC:'持'}],


        //周期
        ['日线', {CN:'日线', EN:'1D', TC:'日綫'}],
        ['周线', {CN:'周线', EN:'1W', TC:'周綫'}],
        ['双周', {CN:'双周', EN:"2W", TC:'雙周'}],
        ['月线', {CN:'月线', EN:'1M', TC:'月綫'}],
        ["半年", {CN:'半年', EN:'HY', TC:'半年'}],
        ['年线', {CN:'年线', EN:'1Y', TC:'年綫'}],
        ['1分', {CN:'1分', EN:'1Min', TC:'1分'}],
        ['5分', {CN:'5分', EN:'5Min', TC:'5分'}],
        ['15分', {CN:'15分', EN:'15Min', TC:'15分'}],
        ['30分', {CN:'30分', EN:'30Min', TC:'30分'}],
        ['60分', {CN:'60分', EN:'60Min', TC:'60分'}],
        ['季线', {CN:'季线', EN:'1Q', TC:'季綫'}],
        ['分笔', {CN:'分笔', EN:'Tick', TC:'分筆'}],
        ['2小时', {CN:'2小时', EN:'2H', TC:'2小時'}],
        ['4小时', {CN:'4小时', EN:'4H', TC:'4小時'}],

        //复权
        ['不复权', {CN:'不复权', EN:'No Right', TC:'不復權'}],
        ['前复权', {CN:'前复权', EN:'Pro Right', TC:'前復權'}],
        ['后复权', {CN:'后复权', EN:'Post Right', TC:'后復權'}],

        //week
        ['日', {CN:'日', EN:'Sun.', TC:'日'}],
        ['一', {CN:'一', EN:'Mon.', TC:'壹'}],
        ['二', {CN:'二', EN:'Tues.', TC:'貳'}],
        ['三', {CN:'三', EN:'Wed.', TC:'叁'}],
        ['四', {CN:'四', EN:'Thur.', TC:'肆'}],
        ['五', {CN:'五', EN:'Fri.', TC:'伍'}],
        ['六', {CN:'六', EN:'Sat.', TC:'陸'}],

        ['1月', {CN:'1月', EN:'Jan', TC:'1月'}],
        ['2月', {CN:'2月', EN:'Feb', TC:'2月'}],
        ['3月', {CN:'3月', EN:'Mar', TC:'3月'}],
        ['4月', {CN:'4月', EN:'Apr', TC:'4月'}],
        ['5月', {CN:'5月', EN:'May', TC:'5月'}],
        ['6月', {CN:'6月', EN:'Jun', TC:'6月'}],
        ['7月', {CN:'7月', EN:'Jul', TC:'7月'}],
        ['8月', {CN:'8月', EN:'Aug', TC:'8月'}],
        ['9月', {CN:'9月', EN:'Sept', TC:'9月'}],
        ['10月', {CN:'10月', EN:'Oct', TC:'10月'}],
        ['11月', {CN:'11月', EN:'Nov', TC:'11月'}],
        ['12月', {CN:'12月', EN:'Dec', TC:'12月'}],

        ['自定义分钟', {CN:'分', EN:'Min', TC:'分'}],
        ['自定义日线', {CN:'日', EN:'D', TC:'日'}],
        ['自定义秒', {CN:'秒', EN:'S', TC:'秒'}],

        //深度图
        ["Depth-Price", {CN:"委托价", EN:"Price", TC:'委托價'}],
        ["Depth-Sum", {CN:"累计", EN:"Sum", TC:'累計'}],

        //日盘|夜盘
        ["日盘",{CN:'日盘', EN:'Day', TC:'日盤'}],
        ["夜盘",{CN:'夜盘', EN:'Night', TC:'夜盤'} ]

    ]);

    this.GetText = function (key, language) 
    {
        var item = this.TextResource.get(key);
        if (!item) return '';

        switch (language) 
        {
            case JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID:
                return item.CN;
            case JSCHART_LANGUAGE_ID.LANGUAGE_ENGLISH_ID:
                return item.EN;
            case JSCHART_LANGUAGE_ID.LANGUAGE_TRADITIONAL_CHINESE_ID:
                return item.TC;
            default:
                return item.CN;
        }
    }

    this.SetTextResource = function (key, value) 
    {
        this.TextResource.set(key, value)
    }

    this.GetLanguageID=function(languageName)
    {
        var languageID=null;
        switch(languageName)
        {
            case 'EN':
                languageID=JSCHART_LANGUAGE_ID.LANGUAGE_ENGLISH_ID;
                break;
            case 'CN':
                languageID=JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
                break;
            case "TC":
                languageID=JSCHART_LANGUAGE_ID.LANGUAGE_TRADITIONAL_CHINESE_ID;
                break;
            default:
                break;
        }

        return languageID;
    }
};

var g_JSChartLocalization = new JSChartLocalization();

//导出统一使用JSCommon命名空间名
export
{
    JSChartResource,
    g_JSChartResource,
    g_JSChartLocalization,
    JSCHART_LANGUAGE_ID,
};
/*
module.exports =
{
    JSCommonResource:
    {
        JSChartResource: JSChartResource,
        Global_JSChartResource: g_JSChartResource,
        Global_JSChartLocalization: g_JSChartLocalization,
        JSCHART_LANGUAGE_ID: JSCHART_LANGUAGE_ID,
    },

    //单个类导出
    JSCommonResource_JSChartResource: JSChartResource,
    JSCommonResource_Global_JSChartResource: g_JSChartResource,
    JSCommonResource_Global_JSChartLocalization: g_JSChartLocalization,
    JSCommonResource_JSCHART_LANGUAGE_ID: JSCHART_LANGUAGE_ID
};
*/