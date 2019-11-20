<template>
  <div id='app'>
      <StockTradeInfo ref='stocktrade' IsShareStock=true  DefaultSymbol='601166.sh'></StockTradeInfo>
      <div style="width:250px; height:300px">
          <StockTradeInfo ref='stocktrade2' DefaultSymbol='600000.sh'></StockTradeInfo>
      </div>
  </div>
</template>
<script>
  import StockTradeInfo from '../../jscommon/umychart.vue.components/stocktradeinfo.vue'
  export default {
    components: {StockTradeInfo},
    data() {
      return {
        JSStock: null,  //共享的股票数据类
      }
    },
    methods: {
      OnSize: function () {
        this.$refs.stocktrade.OnSize();
        this.$refs.stocktrade2.OnSize();
      }
    },
    created: function () {
      this.JSStock = StockTradeInfo.JSCommonStock.JSStockInit(); //创建股票数据类
    },
    mounted() {
      var tradeInfo = this.$refs.stocktrade;
      tradeInfo.SetJSStock(this.JSStock); //绑定一个外部的stock
      tradeInfo.SetSymbol("000001.sz");
      tradeInfo.InitalStock();

      this.JSStock.ReqeustData();

      var self = this;
      window.onresize = function () { self.OnSize() }
    }

  }
</script>