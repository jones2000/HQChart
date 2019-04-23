
<!-- 
    多周期图 
!-->

<template>

</template>


<script>

import JSCommon from "../umychart.vue/umychart.vue.js";
import StockChart from 'stockchart.vue'

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
    PERIOD_KLINE_10_MINUTE_ID:7,   //10分钟

    //周期往后加

};


export default 
{
    name: 'StockMultiPeriod',

    components: { StockChart },

    props:
    [
        'DefaultShowPeriod',    //显示的周期
        'DefaultSymbol',        //默认股票
    ],
    
    data() 
    {
        let data =
        {
            ShowPeriod: //UI显示的图形 Period=周期 Windows:[指标] Right=复权
            [
                { Period:STOCK_PERIOD.PERIOD_MINUTE_ID, },
                { Period:STOCK_PERIOD.PERIOD_KLINE_DAY_ID, },
                { Period:STOCK_PERIOD.PERIOD_KLINE_MONTH_ID, },
                { Period:STOCK_PERIOD.PERIOD_KLINE_5_MINUTE_ID }
            ],
            Symbol:'600000.sh'
        }

        return data;
    },

    created:function() 
    {
       
    },

    mounted:function()
    {
       
    },

    methods:
    {
        OnSize:function()
        {
            
        },

        //切换股票代码
        ChangeSymbol:function(symbol)
        {

        }
    }

}

</script>