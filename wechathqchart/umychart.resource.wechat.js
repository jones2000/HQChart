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
    this.BGColor = 'rgb(255,255,255)';          //背景色

    this.UpBarColor = "rgb(238,21,21)";
    this.DownBarColor = "rgb(25,158,0)";
    this.UnchagneBarColor = "rgb(0,0,0)";

    this.Minute = {};
    this.Minute.VolBarColor = "rgb(238,127,9)";
    this.Minute.PriceColor = "rgb(50,171,205)";
    this.Minute.AreaPriceColor = 'rgba(50,171,205,0.1)';
    this.Minute.AvPriceColor = "rgb(238,127,9)";

    this.DefaultTextColor = "rgb(43,54,69)";
    this.DefaultTextFont = '14px 微软雅黑';

    this.DynamicTitleFont = '12px 微软雅黑'; //指标动态标题字体

    this.UpTextColor = "rgb(238,21,21)";
    this.DownTextColor = "rgb(25,158,0)";
    this.UnchagneTextColor = "rgb(0,0,0)";
    this.CloseLineColor = 'rgb(0,191,255)';
    this.CloseLineAreaColor = ['rgba(0,191,255,0.8)', 'rgba(0,191,255,0.2)'];

    this.FrameBorderPen = "rgb(225,236,242)";
    this.FrameSplitPen = "rgb(225,236,242)";          //分割线
    this.FrameSplitTextColor = "rgb(51,51,51)";     //刻度文字颜色
    this.FrameSplitTextFont = "12px 微软雅黑";        //坐标刻度文字字体
    //this.FrameSplitTextFont = "14px PingFang-SC-Bold";//坐标刻度文字字体
    this.FrameTitleBGColor = "rgb(246,251,253)";      //标题栏背景色
    this.FrameLatestPrice = {
        TextColor: 'rgb(255,255,255)',   //最新价格文字颜色
        UpBarColor: "rgb(238,21,21)",    //上涨
        DownBarColor: "rgb(25,158,0)",   //下跌
        UnchagneBarColor: "rgb(0,0,0)",   //平盘
        BGAlpha: 0.6
    };

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

    //走势图 信息地雷
    this.MinuteInfo = {
        TextColor: 'rgb(84,143,255)',
        Font: '14px 微软雅黑',
        PointColor: 'rgb(38,113,254)',
        LineColor: 'rgb(120,167,255)',
        TextBGColor: 'rgba(255,255,255,0.8)'
    };

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
        }
        if (style.DefaultTextColor) this.DefaultTextColor = style.DefaultTextColor;
        if (style.DefaultTextFont) this.DefaultTextFont = style.DefaultTextFont;
        if (style.DynamicTitleFont) this.DynamicTitleFont = style.DynamicTitleFont;
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
    }

}

var g_JSChartResource = new JSChartResource();

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonResource:
    {
        JSChartResource: JSChartResource,
        Global_JSChartResource: g_JSChartResource
    },

    //单个类导出
    JSCommonResource_JSChartResource: JSChartResource,
    JSCommonResource_Global_JSChartResource: g_JSChartResource,
};