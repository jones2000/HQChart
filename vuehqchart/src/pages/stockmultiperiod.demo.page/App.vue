<template>
    <div>
        <p>多周期控件</p>
        <div ref='divmulitperiod' style="height:800px; width:1000px;">
            <StockMultiPeriod ref='stockMultiPeriod' :DefaultShowPeriod='ShowPeriod' DefaultSymbol='000001.sz'></StockMultiPeriod>
        </div>
    </div>
</template>

<script>
    import StockMultiPeriod from '../../jscommon/umychart.vue.components/stockmultiperiod.vue'
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
    export default
    {
        components:{StockMultiPeriod},

        methods:
        {
            OnSize()
            {
                console.log(`[demo page::OnSize]`);
                var width = document.documentElement.clientWidth || document.body.clientWidth;
                var height = document.documentElement.clientHeight || document.body.clientHeight;
                var divMultiPeriod=this.$refs.divmulitperiod;
                divMultiPeriod.style.width=width+'px';
                divMultiPeriod.style.height=(height-30)+'px';

                var stockMultiPeriod = this.$refs.stockMultiPeriod;
                stockMultiPeriod.OnSize();
            }
        },

        created()
        {
            this.ShowPeriod = [
                                { Period:STOCK_PERIOD.PERIOD_MINUTE_ID},

                                { Period:STOCK_PERIOD.PERIOD_KLINE_DAY_ID},
                                { Period:STOCK_PERIOD.PERIOD_KLINE_WEEK_ID},
                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_MONTH_ID },
                               // { Period:STOCK_PERIOD.PERIOD_KLINE_YEAR_ID },

                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_MINUTE_ID},
                                { Period:STOCK_PERIOD.PERIOD_KLINE_5_MINUTE_ID},
                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_15_MINUTE_ID},
                               // { Period:STOCK_PERIOD.PERIOD_KLINE_30_MINUTE_ID }
            ];
        },
        mounted(){
            var _this = this;
            this.OnSize();
            window.onresize = function () {
                _this.OnSize();
            }
        }
    }
</script>

<style scoped lang="scss">
</style>