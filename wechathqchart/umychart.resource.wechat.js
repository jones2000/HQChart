/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    全局配置颜色
*/


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
    this.MinKLineBarWidth=4;                        //最小的柱子宽度 比这个还小就画直线 

    this.Minute = {};
    this.Minute.VolBarColor = null;
    this.Minute.PriceColor = "rgb(50,171,205)";
    this.Minute.AreaPriceColor = 'rgba(50,171,205,0.1)';
    this.Minute.AvPriceColor = "rgb(238,127,9)";

    this.DefaultTextColor = "rgb(43,54,69)";
    this.DefaultTextFont = '14px 微软雅黑';
    this.IndexTitleBGColor='rgb(217,219,220)';     //指标名字背景色
    this.DynamicTitleFont = '12px 微软雅黑';        //指标动态标题字体

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
        YTopOffset:2    //Y轴顶部文字向下偏移
    };   

    this.FrameLatestPrice = 
    {
        TextColor: 'rgb(255,255,255)',   //最新价格文字颜色
        UpBarColor: "rgb(238,21,21)",    //上涨
        DownBarColor: "rgb(25,158,0)",   //下跌
        UnchagneBarColor: "rgb(0,0,0)",   //平盘
        BGAlpha: 0.6
    };

    this.FrameMargin = 4;     //左右一共的边距
    this.FrameLeftMargin = 2;
    this.FrameRightMargin=2;

    this.CorssCursorBGColor = "rgb(43,54,69)";            //十字光标背景
    this.CorssCursorTextColor = "rgb(255,255,255)";
    this.CorssCursorTextFont = "12px 微软雅黑";
    this.CorssCursorHPenColor = "rgb(130,130,130)";          //十字光标线段颜色(水平)
    this.CorssCursorVPenColor = "rgb(130,130,130)";          //十字光标线段颜色(垂直)

    this.Domain = "https://opensource.zealink.com";               //API域名
    this.CacheDomain = "https://opensourcecache.zealink.com";     //缓存域名

    this.KLine =
        {
            MaxMin: { Font: '12px 微软雅黑', Color: 'rgb(111,111,111)' },   //K线最大最小值显示
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
    this.DrawPicture = {};
    this.DrawPicture.LineColor =
    [
        "rgb(30,144,255)",
    ];

    this.DrawPicture.PointColor =
    [
        "rgb(105,105,105)",
    ];

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
        TextBGColor: 'rgba(255,255,255,0.8)'
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
            Border:{ Top:5, Left:20, Bottom:5, Center: 5},
            Font:"14px 微软雅黑",
            LineHeight:16   //单行高度
        }
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
        if (style.Minute) 
        {
            if (style.Minute.VolBarColor) this.Minute.VolBarColor = style.Minute.VolBarColor;
            if (style.Minute.PriceColor) this.Minute.PriceColor = style.Minute.PriceColor;
            if (style.Minute.AvPriceColor) this.Minute.AvPriceColor = style.Minute.AvPriceColor;
            if (style.Minute.AreaPriceColor) this.Minute.AreaPriceColor = style.Minute.AreaPriceColor;
        }
        if (style.DefaultTextColor) this.DefaultTextColor = style.DefaultTextColor;
        if (style.DefaultTextFont) this.DefaultTextFont = style.DefaultTextFont;
        if (style.DynamicTitleFont) this.DynamicTitleFont = style.DynamicTitleFont;
        if (style.IndexTitleBGColor) this.IndexTitleBGColor=style.IndexTitleBGColor;
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

        if (style.Frame) 
        {
            if (style.Frame.XBottomOffset) this.Frame.XBottomOffset = style.Frame.XBottomOffset;
            if (style.Frame.YTopOffset) this.Frame.YTopOffset = style.Frame.YTopOffset;
        }

        if (style.FrameLatestPrice) 
        {
            if (style.FrameLatestPrice.TextColor) this.FrameLatestPrice.TextColor = style.FrameLatestPrice.TextColor;
            if (style.FrameLatestPrice.UpBarColor) this.FrameLatestPrice.UpBarColor = style.FrameLatestPrice.UpBarColor;
            if (style.FrameLatestPrice.DownBarColor) this.FrameLatestPrice.DownBarColor = style.FrameLatestPrice.DownBarColor;
            if (style.FrameLatestPrice.UnchagneBarColor) this.FrameLatestPrice.UnchagneBarColor = style.FrameLatestPrice.UnchagneBarColor;
            if (style.FrameLatestPrice.BGAlpha) this.FrameLatestPrice.BGAlpha = style.FrameLatestPrice.BGAlpha;
        }

        if (style.CorssCursorBGColor) this.CorssCursorBGColor = style.CorssCursorBGColor;
        if (style.CorssCursorTextColor) this.CorssCursorTextColor = style.CorssCursorTextColor;
        if (style.CorssCursorTextFont) this.CorssCursorTextFont = style.CorssCursorTextFont;
        if (style.CorssCursorHPenColor) this.CorssCursorHPenColor = style.CorssCursorHPenColor;
        if (style.CorssCursorVPenColor) this.CorssCursorVPenColor = style.CorssCursorVPenColor;
        if (style.KLine) this.KLine = style.KLine;
        if (style.Index) 
        {
            if (style.Index.LineColor) this.Index.LineColor = style.Index.LineColor;
            if (style.Index.NotSupport) this.Index.NotSupport = style.Index.NotSupport;
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
                if (IFrameSplitOperator.IsPlusNumber(item.MaxSize)) this.DRAWICON.Text.MaxSize=item.MaxSize;
                if (IFrameSplitOperator.IsPlusNumber(item.MinSize)) this.DRAWICON.Text.MinSize=item.MinSize;
                if (item.Zoom) this.DRAWICON.Text.Zoom=item.Zoom;
                if (item.FontName) this.DRAWICON.Text.FontName=item.FontName;
            }
        }

        if (style.DRAWTEXT)
        {
            var item=style.DRAWTEXT;
            if (IFrameSplitOperator.IsPlusNumber(item.MaxSize)) this.DRAWICON.MaxSize=item.MaxSize;
            if (IFrameSplitOperator.IsPlusNumber(item.MinSize)) this.DRAWICON.MinSize=item.MinSize;
            if (item.Zoom) this.DRAWICON.Zoom=item.Zoom;
            if (item.FontName) this.DRAWICON.FontName=item.FontName;
        }

        if (style.DRAWNUMBER)
        {
            var item=style.DRAWNUMBER;
            if (this.IsPlusNumber(item.MaxSize)) this.DRAWNUMBER.Text.MaxSize=item.MaxSize;
            if (this.IsPlusNumber(item.MinSize)) this.DRAWNUMBER.Text.MinSize=item.MinSize;
            if (item.Zoom) this.DRAWNUMBER.Text.Zoom=item.Zoom;
            if (item.FontName) this.DRAWNUMBER.Text.FontName=item.FontName;
        }

        if (style.DRAWABOVE)
        {
            var item=style.DRAWABOVE;
            if (this.IsNumber(item.YOffset)) this.DRAWABOVE.YOffset=item.YOffset;
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
                if (this.IsNumber(border.Bottom)) this.DepthCorss.Tooltip.Border.Bottom=border.Bottom;
                if (this.IsNumber(border.Center)) this.DepthCorss.Tooltip.Border.Center=border.Center;
            }
        }
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
}

var g_JSChartResource = new JSChartResource();

var JSCHART_LANGUAGE_ID =
{
    LANGUAGE_CHINESE_ID: 0,
    LANGUAGE_ENGLISH_ID: 1
};

function JSChartLocalization() 
{
    this.TextResource = new Map([
        //内部tooltip
        ['Tooltip-Open', { CN: '开:', EN: 'O:' }],
        ['Tooltip-High', { CN: '高:', EN: 'H:' }],
        ['Tooltip-Low', { CN: '低:', EN: 'L:' }],
        ['Tooltip-Close', { CN: '收:', EN: 'C:' }],
        ['Tooltip-Increase', { CN: '幅:', EN: 'I:' }],
        ['Tooltip-Vol', { CN: '量:', EN: 'V:' }],
        ['Tooltip-Amount', { CN: '额:', EN: 'A:' }],
        ['Tooltip-AvPrice', { CN: '均:', EN: 'AP:' }],
        ['Tooltip-Price', { CN: '价:', EN: 'P:' }],
        ['Tooltip-Exchange', { CN: '换:', EN: 'E:' }],
        ['Tooltip-Position', { CN: '持:', EN: 'P:' }],

        //K线动态标题
        ['KTitle-Open', { CN: '开:', EN: 'O:' }],
        ['KTitle-High', { CN: '高:', EN: 'H:' }],
        ['KTitle-Low', { CN: '低:', EN: 'L:' }],
        ['KTitle-Close', { CN: '收:', EN: 'C:' }],
        ['KTitle-Increase', { CN: '幅:', EN: 'I:' }],
        ['KTitle-Vol', { CN: '量:', EN: 'V:' }],
        ['KTitle-Amount', { CN: '额:', EN: 'A:' }],
        ['KTitle-Exchange', { CN: '换:', EN: 'E:' }],
        ['KTitle-Position', { CN: '持:', EN: 'P:' }],

        //走势图动态标题
        ['MTitle-Close', { CN: '价:', EN: 'C:' }],
        ['MTitle-AvPrice', { CN: '均:', EN: 'AC:' }],
        ['MTitle-Increase', { CN: '幅:', EN: 'I:' }],
        ['MTitle-Vol', { CN: '量:', EN: 'V:' }],
        ['MTitle-Amount', { CN: '额:', EN: 'A:' }],
        ['MTitle-Position', { CN: '持:', EN: 'P:' }],

        //周期
        ['日线', { CN: '日线', EN: '1D' }],
        ['周线', { CN: '周线', EN: '1W' }],
        ['双周', { CN: '双周', EN: "2W" }],
        ['月线', { CN: '月线', EN: '1M' }],
        ['年线', { CN: '年线', EN: '1Y' }],
        ['1分', { CN: '1分', EN: '1Min' }],
        ['5分', { CN: '5分', EN: '5Min' }],
        ['15分', { CN: '15分', EN: '15Min' }],
        ['30分', { CN: '30分', EN: '30Min' }],
        ['60分', { CN: '60分', EN: '60Min' }],
        ['季线', { CN: '季线', EN: '1Q' }],
        ['分笔', { CN: '分笔', EN: 'Tick' }],
        ['2小时', { CN: '2小时', EN: '2H' }],
        ['4小时', { CN: '4小时', EN: '4H' }],

        //复权
        ['不复权', { CN: '不复权', EN: 'No Right' }],
        ['前复权', { CN: '前复权', EN: 'Pro Right' }],
        ['后复权', { CN: '后复权', EN: 'Post Right' }],

        //week
        ['日', { CN: '日', EN: 'Sun.' }],
        ['一', { CN: '一', EN: 'Mon.' }],
        ['二', { CN: '二', EN: 'Tues.' }],
        ['三', { CN: '三', EN: 'Wed.' }],
        ['四', { CN: '四', EN: 'Thur.' }],
        ['五', { CN: '五', EN: 'Fri.' }],
        ['六', { CN: '六', EN: 'Sat.' }],

        ['1月', { CN: '1月', EN: 'Jan' }],
        ['2月', { CN: '2月', EN: 'Feb' }],
        ['3月', { CN: '3月', EN: 'Mar' }],
        ['4月', { CN: '4月', EN: 'Apr' }],
        ['5月', { CN: '5月', EN: 'May' }],
        ['6月', { CN: '6月', EN: 'Jun' }],
        ['7月', { CN: '7月', EN: 'Jul' }],
        ['8月', { CN: '8月', EN: 'Aug' }],
        ['9月', { CN: '9月', EN: 'Sept' }],
        ['10月', { CN: '10月', EN: 'Oct' }],
        ['11月', { CN: '11月', EN: 'Nov' }],
        ['12月', { CN: '12月', EN: 'Dec' }],

        ['自定义分钟', { CN: '分', EN: 'Min' }],
        ['自定义日线', { CN: '日', EN: 'D' }],
        ['自定义秒', { CN: '秒', EN: 'S' }]

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
            default:
                return item.CN;
        }
    }

    this.SetTextResource = function (key, value) 
    {
        this.TextResource.set(key, value)
    }
};

var g_JSChartLocalization = new JSChartLocalization();

//导出统一使用JSCommon命名空间名
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