
<!-- 
    多周期图 
!-->

<template>
    <div class="multiPeriodWrap" ref='multiPeriodWrap' style="width:100%;height:100%">
        <div class='perioditem' ref='perioditem' v-for='(periodItem,index) in ShowPeriod.CurrentPeriod' :key='index'>
            <StockChart ref='stockchart' :DefaultSymbol='Symbol' :DefaultOption='GetChartOption(periodItem)'></StockChart>
        </div>
    </div>
</template>


<script>
import JSCommon from "../umychart.vue/umychart.vue.js";
import StockChart from './stockchart.vue'
import '../../jscommon/umychart.resource/font/iconfont.css'
import '../../jscommon/umychart.resource/css/tools.css'

//股票周期枚举
var STOCK_PERIOD=
{
    PERIOD_MINUTE_ID:0,         //走势图
    PERIOD_KLINE_DAY_ID:1,      //日线
    PERIOD_KLINE_WEEK_ID:2,     //周
    PERIOD_KLINE_MONTH_ID:3,    //月
    PERIOD_KLINE_YEAR_ID:4,     //年

    PERIOD_KLINE_MINUTE_ID:5,   //1分钟
    PERIOD_KLINE_5_MINUTE_ID:6,   //5分钟
    PERIOD_KLINE_15_MINUTE_ID:7,   //15分钟
    PERIOD_KLINE_30_MINUTE_ID:8,   //30分钟

    //周期往后加
};

function DefaultData(){}

DefaultData.GetKLineOption = function (option) 
{
    let data = 
    {
        Type: '历史K线图', 
        IsShowCorssCursorInfo:true,
        Windows:        //指定指标
        [
            { Index: "MA",Modify: true, Change: true },
            { Index: "KDJ" ,Modify: true, Change: true, Close:true},
            { Index: "VOL" ,Modify: true, Change: true, Close:true}
        ],
        KLine:
        {
            Right:1,                            //复权 0 不复权 1 前复权 2 后复权
            Period:option.Period - 1,          //周期: 0 日线 1 周线 2 月线 3 年线 
        }
    };

    if (option.Right>=0) data.KLine.Right=option.Right;
    if (option.Windows) data.Windows=option.Windows;
    return data;
}

DefaultData.GetMinuteOption = function (option) 
{
    let data = 
    {
        Type: '分钟走势图',
        DayCount:1,     //1 走势图 2,3,4,5 多日走势图
        Windows:        //指定指标
        [
            //{ Index: "KDJ" }
        ]
    };

    if (option.Windows) data.Windows=option.Windows;
    return data;
}

export default 
{
    name: 'StockMultiPeriod',

    components: { StockChart },

    props:
    [
        'DefaultShowPeriod',    //显示的周期
        'DefaultSymbol',        //默认股票
    ],

    STOCK_PERIOD:STOCK_PERIOD,  //枚举导出
    
    data() 
    {
        let data =
        {
            ShowPeriod: {MetaPeriod:[],CurrentPeriod:[]},//UI显示的图形 Period=周期 Windows:[指标] Right=复权
            Symbol:'600000.sh',
        }
        return data;
    },

    created:function() 
    {
        if (this.DefaultShowPeriod) this.ShowPeriod.MetaPeriod=this.DefaultShowPeriod;
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol;
        var count = this.ShowPeriod.MetaPeriod.length;
        if(count >= 4 && count < 6){
            count = 4
        }else if(count >=6 && count < 9){
            count = 6
        }else if(count >= 9){
            count = 9;
        }
        this.ShowPeriod.CurrentPeriod = this.ShowPeriod.MetaPeriod.slice(0,count);
    },

    mounted:function()
    {
        this.OnSize();
    },

    methods:
    {
        GetChartOption(item)
        {
            if (item.Period===STOCK_PERIOD.PERIOD_MINUTE_ID) return DefaultData.GetMinuteOption(item);
            else return DefaultData.GetKLineOption(item);
        },


        CalculateChartSize:function()   //计算布局
        {
            var divMultiPeriod=this.$refs.multiPeriodWrap;
            var height= divMultiPeriod.offsetHeight;
            var width = divMultiPeriod.offsetWidth; //获取外层div的大小
            console.log(`[StockMultiPeriod::CalculateChartSize] height=${height} width=${width}`);

            var itemHeight = 0;
            var itemWidth = 0;
            var count = this.ShowPeriod.CurrentPeriod.length;
            var rowCount = 0;  //一行放几个图

            if(count == 9)
            {
                itemHeight = height / 3;
                itemWidth = width / 3;
                rowCount = 3;
            }
            else if(count == 6)
            {
                itemHeight = height / 3;
                itemWidth = width / 2;
                rowCount = 2;
            }
            else if(count == 4)
            {
                itemHeight = height / 2;
                itemWidth = width / 2;
                rowCount = 2;
            }

            //调整div位置
            var divPeriods=this.$refs.perioditem;
            for(let i = 0; i < divPeriods.length; i++)
            {
                var divPeriod=divPeriods[i];
                var rowIndex = i % rowCount;
                var colIndex = Math.floor(i / rowCount);
                divPeriod.style.left = itemWidth * rowIndex + 'px';
                divPeriod.style.top = itemHeight * colIndex + 'px';
                divPeriod.style.width = itemWidth + 'px';
                divPeriod.style.height = itemHeight + 'px';
            }
        },

        OnSize()
        {
            this.CalculateChartSize();
            var stockcharts = this.$refs.stockchart;
            for(let i = 0; i < stockcharts.length; i++)
            {
                stockcharts[i].OnSize();
            }
        },

        //切换股票代码
        ChangeSymbol:function(symbol)
        {
            var stockcharts = this.$refs.stockchart;
            for(let i = 0; i < stockcharts.length; i++)
            {
                stockcharts[i].ChangeSymbol(symbol);
            }
        }
    }

}

</script>

<style scoped lang="less">
    .multiPeriodWrap{
        position: relative;
        .perioditem {
            position: absolute;
        }
        /* width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .periodRow{
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            .priodItem{
                flex-grow: 1;
            }
        } */
    }
</style>