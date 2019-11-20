<template>
    <div>
        <div ref='divstockinfo'>
            <StockInfo ref='stockinfo' IsShareStock=1 :DefaultSymbol='Symbol'></StockInfo>
        </div>
        <div ref='divmulitperiod'>
            <StockMultiPeriod ref='stockMultiPeriod' :DefaultShowPeriod='ShowPeriod' :DefaultSymbol='Symbol'></StockMultiPeriod>
        </div>
    </div>
</template>

<script>
    import StockMultiPeriod from '../../jscommon/umychart.vue.components/stockmultiperiod.vue'
    import StockInfo from '../../jscommon/umychart.vue.components/stockinfo.vue'
    
    export default
    {
        data(){
            return {
                Symbol:'000001.sz',
                JSStock:null
            };
        },
        components:{StockMultiPeriod,StockInfo},

        methods:
        {
            OnSize()
            {
                console.log(`[demo page::OnSize]`);
                var width = document.documentElement.clientWidth || document.body.clientWidth;
                var height = document.documentElement.clientHeight || document.body.clientHeight;
                var divMultiPeriod=this.$refs.divmulitperiod;
                var divstockinfo = this.$refs.divstockinfo;
                var stockinfoHeight = divstockinfo.offsetHeight;
                divMultiPeriod.style.width=width+'px';
                divMultiPeriod.style.height=(height-stockinfoHeight)+'px';

                var stockMultiPeriod = this.$refs.stockMultiPeriod;
                stockMultiPeriod.OnSize();
                var stockinfo = this.$refs.stockinfo;
                stockinfo.OnSize();
            },
            OnChangeSymbol(symbol){
                this.SetSymbol(symbol);
            },
            SetSymbol(symbol){
                this.Symbol=symbol;
                this.$refs.stockinfo.SetSymbol(symbol);
                this.JSStock.ReqeustData();

                this.$refs.stockMultiPeriod.ChangeSymbol(symbol);
            }
        },

        created()
        {
            this.JSStock=StockInfo.JSCommonStock.JSStockInit(); //创建股票数据类
            this.ShowPeriod = [
                                { Period:StockMultiPeriod.STOCK_PERIOD.PERIOD_MINUTE_ID},

                                { Period:StockMultiPeriod.STOCK_PERIOD.PERIOD_KLINE_DAY_ID},
                                { Period:StockMultiPeriod.STOCK_PERIOD.PERIOD_KLINE_WEEK_ID},
                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_MONTH_ID },
                               // { Period:STOCK_PERIOD.PERIOD_KLINE_YEAR_ID },

                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_MINUTE_ID},
                                { Period:StockMultiPeriod.STOCK_PERIOD.PERIOD_KLINE_5_MINUTE_ID},
                                //{ Period:STOCK_PERIOD.PERIOD_KLINE_15_MINUTE_ID},
                               // { Period:STOCK_PERIOD.PERIOD_KLINE_30_MINUTE_ID }
            ];
        },
        mounted(){
            var stockInfo = this.$refs.stockinfo;
            stockInfo.SetJSStock(this.JSStock);                         //绑定一个外部的stock ( 五档买卖盘和分笔数据可以共享这一个股票数据类)
            stockInfo.SetChangeSymbolCallback(this.OnChangeSymbol);   //股票切换以后通知
            stockInfo.SetSymbol(this.Symbol);
            stockInfo.InitalStock();
            this.JSStock.ReqeustData();
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