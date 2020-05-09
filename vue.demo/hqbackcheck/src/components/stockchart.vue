<template>
    <div :id='ID' class="stockchart" ref='stockchart' style="width:100%;height:100%">
        <div class='hqchart' id="hqchart" ref="hqchart"></div>
    </div>
</template>

<script type="text/javascript">

import $ from 'jquery'
import HQChart from 'hqchart'
var JSCommon=HQChart.Chart;
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
// import JSCommon from '../umychart.vue/umychart.vue.js'
// import '../../jscommon/umychart.resource/font/iconfont.css'
// import '../../jscommon/umychart.resource/css/tools.css'

function DefaultData()
{

}

//分钟数据默认配置
DefaultData.GetMinuteOption=function()
{
    const option=
    {
        Type: '分钟走势图', //历史分钟走势图
        Symbol: null,
        IsAutoUpdate: true, //是自动更新数据
        Windows:[], //窗口指标 [ { Index: "MACD" } ]

        DayCount: 1,

        IsShowRightMenu: false,         //右键菜单
        IsShowCorssCursorInfo: true,    //是否显示十字光标的刻度信息

        Border: //边框间距
        {
            Left: 60, Right: 60, Top: 25,Bottom: 20
        },

        Frame: //子框架设置,刻度小数位数设置
        [
            { SplitCount: 5, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 }
        ]
    };

    return option;
}

//历史分钟走势图
DefaultData.GetHistoryMinuteOption=function()
{
    var option=
    {
        Type:'历史分钟走势图',
        Windows:[],         //窗口指标
        Symbol:null,        //股票代码

        IsShowRightMenu:true,           //右键菜单
        IsShowCorssCursorInfo:true,     //是否显示十字光标的刻度信息

        HistoryMinute:          //显示的交易日期
        { 
            TradeDate:20180410 
        },   

        Border: //边框
        {
            Left: 60, Right: 60, Top: 25,Bottom: 20
        },

        Frame:  //子框架设置
        [
            { SplitCount: 5, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 }
        ]
    }

    return option;
}


DefaultData.GetKLineOption=function()
{
    const option=
    {
        Type:'历史K线图',
        
        Windows: //窗口指标
        [
            {Index:"MA",Modify: false, Change: false}, 
            {Index:"VOL",Modify: false, Change: false}, 
            //{Index:"MACD",Modify: false, Change: false},
        ], 
        
        IsAutoUpdate:true,       //是自动更新数据
        TradeIndex:[],           //交易系统 [ {Index:'交易系统-BIAS'}]

        IsShowRightMenu:false,          //右键菜单
        IsShowCorssCursorInfo:true,    //是否显示十字光标的刻度信息

        KLine:
        {
            DragMode:1,                 //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right:1,                    //复权 0 不复权 1 前复权 2 后复权
            Period:0,                   //周期 0 日线 1 周线 2 月线 3 年线 
            MaxReqeustDataCount:1000,   //数据个数
            PageSize:50,                //一屏显示多少数据
            Info:[], //信息地雷 ["互动易","大宗交易",'龙虎榜',"调研","业绩预告","公告"],       
            IsShowTooltip:false                  //是否显示K线提示信息
        },

        KLineTitle: //标题设置
        {
            IsShowName:true,       //不显示股票名称
            IsShowSettingInfo:true //不显示周期/复权
        },

        Border: //边框间距
        {
            Left: 1, Right: 60, Top: 25,Bottom: 20
        },

        Frame:  //子框架设置 (Height 窗口高度比例值)
        [
            {SplitCount:3,StringFormat:0,IsShowLeftText: false},
            {SplitCount:2,StringFormat:0,IsShowLeftText: false},
            {SplitCount:2,StringFormat:0,IsShowLeftText: false},
            {SplitCount:2,StringFormat:0,IsShowLeftText: false}
        ]
    };

    return option;
}

function ObjectHelper()
{

}

ObjectHelper.IsObjectExist=JSCommon.IFrameSplitOperator.IsObjectExist;  //字段是否存在
ObjectHelper.IsNumber=JSCommon.IFrameSplitOperator.IsNumber;            //是否是数组
ObjectHelper.IsPlusNumber=JSCommon.IFrameSplitOperator.IsPlusNumber;    //是否是正数


export default 
{
    name:'StockChart',
    //外部传入的参数
    props: 
    [
        'DefaultSymbol',     //默认股票
        'DefaultOption',     //走势图设置
        'DefaultAPIDomain',         //数据API域名设置
        'DefaultStyle',
        'IsCreateManual'  //是否是手动创建
    ],

    data()
    {
        let data=
        { 
            Symbol:'600000.sh', //股票
            ID:JSCommon.JSChart.CreateGuid(),
            JSChart:null,   //图形控件
            Option:DefaultData.GetMinuteOption(),   //设置
        }

        return data;
    },

    created:function()
    {
        //处理默认传入的参数
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol; //默认股票
        if(this.DefaultStyle) this.JSchartStyle = this.DefaultStyle;
        if (this.DefaultOption) this.SetOption(this.DefaultOption);
        if (this.DefaultAPIDomain) 
        {
            JSCommon.JSChart.SetDomain(this.DefaultAPIDomain.Domain,this.DefaultAPIDomain.CacheDomain);
            JSCommon.JSComplier.SetDomain(this.DefaultAPIDomain.Domain,this.DefaultAPIDomain.CacheDomain);
        }
    },

    mounted:function()
    {
        console.log(`[StockChart::mounted]`);
        this.OnSize();              //子组件的mounted在父组件的mounted之前执行了
        console.log('[stockchart::mounted]IsCreateManual:',this.IsCreateManual);
        if(!this.IsCreateManual){
            this.CreateJSChart();
        }
        
    },

    methods:
    {
        //内部方法
        SetOption:function(option)
        {
            if (!option) return;
            if (option.Type=='分钟走势图') this.SetMinuteOption(option);
            else if (option.Type=='历史K线图') this.SetKLineOption(option);
            else if (option.Type=='历史分钟走势图') this.SetHistoryMinuteOption(option);
        },

        SetBorderOption:function(option)    //设置属性 Border,
        {
            if (!option.Border) return;
            
            let border=option.Border;
            if (ObjectHelper.IsNumber(border.Left)) this.Option.Border.Left=border.Left;    
            if (ObjectHelper.IsNumber(border.Right)) this.Option.Border.Right=border.Right;    
            if (ObjectHelper.IsNumber(border.Top)) this.Option.Border.Top=border.Top;    
            if (ObjectHelper.IsNumber(border.Bottom)) this.Option.Border.Left=border.Bottom;    
        },

        SetMinuteOption:function(option)
        {
            this.Option=DefaultData.GetMinuteOption();  //先把设置还原成默认

            this.SetBorderOption(option);
            if (option.Windows) this.Option.Windows=option.Windows;
            if (ObjectHelper.IsPlusNumber(option.DayCount>0)) this.Option.DayCount=option.DayCount;
            if (ObjectHelper.IsObjectExist(option.IsShowCorssCursorInfo)) this.Option.IsShowCorssCursorInfo=option.IsShowCorssCursorInfo;   //十字光标
            if (option.MinuteLine) this.Option.MinuteLine=option.MinuteLine;
        },

        SetHistoryMinuteOption:function(option)
        {
            this.Option=DefaultData.GetHistoryMinuteOption();  //先把设置还原成默认
            this.SetBorderOption(option);
            if (option.Windows) this.Option.Windows=option.Windows;
            if (ObjectHelper.IsObjectExist(option.IsShowCorssCursorInfo)) this.Option.IsShowCorssCursorInfo=option.IsShowCorssCursorInfo;   //十字光标

            if (option.HistoryMinute)
            {
                if (ObjectHelper.IsPlusNumber(option.HistoryMinute.TradeDate)) this.Option.HistoryMinute.TradeDate=option.HistoryMinute.TradeDate;
            }
        },

        SetKLineOption:function(option)
        {
            this.Option=DefaultData.GetKLineOption();   //先把设置还原成默认

            this.SetBorderOption(option);
            if (option.Windows && option.Windows.length>0) this.Option.Windows=option.Windows;  //指标设置
            if (ObjectHelper.IsObjectExist(option.IsShowCorssCursorInfo)) this.Option.IsShowCorssCursorInfo=option.IsShowCorssCursorInfo;   //十字光标

            if (option.KLine)
            {
                let kline=option.KLine;
                if (ObjectHelper.IsNumber(kline.DragMode)) this.Option.KLine.DragMode=kline.DragMode;    //拖拽模式
                if (ObjectHelper.IsNumber(kline.Right)) this.Option.KLine.Right=kline.Right;
                if (ObjectHelper.IsNumber(kline.Period)) this.Option.KLine.Period=kline.Period;
                if (ObjectHelper.IsPlusNumber(kline.MaxReqeustDataCount)) this.Option.KLine.MaxReqeustDataCount=kline.MaxReqeustDataCount;
                if (ObjectHelper.IsPlusNumber(kline.PageSize)) this.Option.KLine.PageSize=kline.PageSize;
                if (ObjectHelper.IsObjectExist(kline.IsShowTooltip)) this.Option.KLine.IsShowTooltip=kline.IsShowTooltip;
                if (kline.FirstShowDate>20000101) this.Option.KLine.FirstShowDate=kline.FirstShowDate;
            }

            if (option.KLineTitle)
            {
                let klineTitle=option.KLineTitle;
                if (ObjectHelper.IsObjectExist(klineTitle.IsShowName)) this.Option.KLineTitle.IsShowName=klineTitle.IsShowName;
                if (ObjectHelper.IsObjectExist(klineTitle.IsShowSettingInfo)) this.Option.KLineTitle.IsShowSettingInfo=klineTitle.IsShowSettingInfo;
            }

            if (option.ExtendChart) this.Option.ExtendChart=option.ExtendChart;
        },

        //创建走势图
        CreateJSChart:function()
        {
            if (this.JSChart) return;
            this.Option.Symbol=this.Symbol;

            if(this.JSchartStyle) JSCommon.JSChart.SetStyle(this.JSchartStyle);  //设置图形样式
            
            let chart=JSCommon.JSChart.Init(this.$refs.hqchart);
            chart.SetOption(this.Option);
            this.JSChart=chart;
        },


        //对外接口

        //大小调整
        OnSize:function()
        { 
            var stockChart=this.$refs.stockchart;
            var height= stockChart.offsetHeight;
            var width = stockChart.offsetWidth;
            console.log(`[StockChart::OnSize] width=${width} height=${height}`); 

            var divChart=this.$refs.hqchart;
            divChart.style.width=width+'px';
            divChart.style.height=height+'px';

            if (this.JSChart && height>0 && width>0) this.JSChart.OnSize();
        },

        //切换股票代码
        ChangeSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            this.Symbol=symbol;
            if (this.JSChart) this.JSChart.ChangeSymbol(this.Symbol);
        },

        ChangeTradeDate(tradeDate)  //切换历史分钟走势图的交易日期
        {
            if (this.JSChart) this.JSChart.ChangeTradeDate(tradeDate);
        },

        GetDefaultMinuteOption:function()
        {
            return DefaultData.GetMinuteOption()
        },

        GetDefaultKLineOption:function()
        {
            return DefaultData.GetKLineOption();
        }
    }
}
</script>


<style scoped lang="less">

.hqchart
{
    left:0px;
    top:0px;
    position: relative;
    width:100%;
    height:100%;
}

</style>