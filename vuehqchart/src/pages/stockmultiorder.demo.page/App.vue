  <template>
  <div id="app2">
    <div class="tab" ref="tab">
      <span v-for="(tabItem,index) in SymbolsForTab" :class="{active:TabIndex == index}" @click="ChangeSymbol(tabItem.Symbol,index)" >{{tabItem.Text}}</span>
    </div>
    <div class="divmultiorder" ref="divmultiorder" style="left:10px; position: absolute">
      <StockMultiOrder ref="stockmultiorder" :DefaultSymbol="Symbol" :DefaultOrderFileds="OrderFileds" />
    </div>
  </div>
</template>

  <script>
import StockMultiOrder from "../../jscommon/umychart.vue.components/stockmultiorder.vue";

export default 
{
    data() 
    {
        return {
            OrderFileds: null,
            SymbolsForTab: [
                { Symbol: "CNA.ci", Text: "沪深A股" },
                { Symbol: "SHA.ci", Text: "上证A股" },
                { Symbol: "SZA.ci", Text: "深证A股" },
                { Symbol: "GEM.ci", Text: "创业板" },
                { Symbol: "SME.ci", Text: "中小板" }
            ],
            TabIndex: 0,
            Symbol: "CNA.ci"
            };
    },
    components: { StockMultiOrder },

  //创建
    created: function() 
    {
        this.OrderFileds = [
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.INCREASE,
            Order: -1
        }, //涨幅排名
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.RISEFALLSPEED_5,
            Order: -1
        },
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.RISEFALLSPEED_15,
            Order: -1
        }, //1分钟涨速排名

        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.INCREASE,
            Order: 1
        }, //跌幅排名
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.RISEFALLSPEED_5,
            Order: 1
        }, //5分钟跌速排名
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.RISEFALLSPEED_15,
            Order: 1
        }, //5分钟振幅排名

        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_5,
            Order: -1
        }, //5分钟振幅排名
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.MINUTE_AMOUNT_5,
            Order: -1
        }, //5分钟成交金额排名
        {
            OrderFiled: StockMultiOrder.STOCK_FIELD_NAME.MINUTE_AMOUNT_15,
            Order: -1
        } //15分钟成交金额排名
        ];
    },

    mounted: function() 
    {
        this.OnSize();
        var that = this;
        window.onresize = function() { that.OnSize(); };
    },

    methods:
    {
        ChangeSymbol(symbol, index) 
        {
            this.TabIndex = index;
            this.Symbol = symbol;
            var stockmultiorder = this.$refs.stockmultiorder;
            stockmultiorder.ChangeSymbol(symbol);
            // console.log(`[demo page] symbol: ${symbol}`);
        },

        OnSize() 
        {
            var width = document.documentElement.clientWidth || document.body.clientWidth;
            var height = document.documentElement.clientHeight || document.body.clientHeight;
            width = width * 0.8;
            height = height * 0.8;
            var tab = this.$refs.tab;
            var divmultiorder = this.$refs.divmultiorder;
            var orderHeight = height - tab.offsetHeight;
            divmultiorder.style.width = width + "px";
            divmultiorder.style.height = orderHeight + "px";
            var stockmultiorder = this.$refs.stockmultiorder;
            stockmultiorder.OnSize();
        }
    }
};
</script>

<style scoped lang='less'>
* 
{
  margin: 0;
  padding: 0;
}

html,
body 
{
    .tab 
    {
        font: 14px "Simsun";
        /* display: inline-block; */
        padding: 5px 0;
        > span 
        {
            display: inline-block;
            line-height: 25px;
            padding: 0 8px;
            border: 1px solid #ccc;
            margin-right: -1px;
            cursor: pointer;
        }
        > span:last-child
        {
            margin-right: 0;
        }
        > span.active 
        {
            color: blue;
        }
    }
}
</style>