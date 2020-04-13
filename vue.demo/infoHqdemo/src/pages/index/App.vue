<template>
  <div id="app" :class="blackStyle ? 'appB' : 'appW'">
    <div class="contentBox app" ref='stockfull' :style="{width:appWidth,height:appHeight}">
        <!-- 股票最新信息 -->
        <div ref='divstockinfo' v-show="isNoFullChart">
            <StockInfo ref='stockinfo' 
            IsShareStock=0 
            :DefaultSymbol="DefaultSymbol" 
            :blackStyle = this.blackStyle></StockInfo>
        </div>

        <!--  走势图|K线图 !   :TradeInfoTabWidth=this.TradeInfo.Width as-->
        <div :class='blackStyle?"divstockmainB":"divstockmainW"' ref='divstockmain' >
            <div ref='divstockkline' style="height:200px;position: relative">
                <StockKLine ref='stockkline' 
                :DefaultSymbol=this.DefaultSymbol 
                :DefaultPeriod=this.DefaultPeriod 
                :KLineOption=this.KLineOption 
                :MinuteOption=this.MinuteOption
                :isNoFullChart=this.isNoFullChart
                :blackStyle = this.blackStyle
                @changeFullChart="changeFullChart">
                </StockKLine> 
            </div>
        </div>

        <div class="mskBg" v-show="!isNoFullChart"></div>
    </div>
    
  </div>
</template>

<script>
//定制K线设置
const CUSTOM_KLINE_OPTION = {
  //窗口指标
  Windows: [{ Index: "MA" }, { Index: "VOL" }, { Index: "MACD" }],

  //TradeIndex: {Index:'交易系统-BIAS'},    //交易系统
  //ColorIndex:{ Index:'五彩K线-十字星'},     //五彩K线

  KLine: {
    //Info:["公告","互动易","调研"],              //信息地雷
    Right: 0 //复权 0 不复权 1 前复权 2 后复权
  }
};
const CUSTOM_MINUTE_OPTION = {
  //窗口指标
  Windows: [{ Index: "RSI" }],
  MinuteLine: {
    IsDrawAreaPrice: false //是否画价格面积图
  }
};

import commTool from "../../utils/commTool.js";
import StockInfo from "./components/StockInfo.vue";
import StockKLine from "./components/StockKLine.vue";
// import JSCommon from "../../jscommon/umychart.vue/umychart.vue.js";
import HQChart from 'hqchart'

export default {
  components: { StockInfo: StockInfo, StockKLine: StockKLine },
  data() {
    return {
      DefaultSymbol: "000001.sz",
      Symbol: "",
      DefaultPeriod: "分时",
      TradeInfo: {
        Width: 230
      },
      KLineOption: CUSTOM_KLINE_OPTION,
      MinuteOption: CUSTOM_MINUTE_OPTION,
      isNoFullChart: true, //是否全屏显示
      appWidth: "1100px",
      appHeight: "calc(100% - 36px)",
      marginTop: "0px",
      colorType: "white", //white || black
      blackStyle: null
    };
  },
  created() {
    document.title = "个股行情图";
    this.DefaultSymbol = commTool.getURLParams("symbol")
      ? commTool.getURLParams("symbol")
      : "000001.sz";

    if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol;
    this.JSStock = StockInfo.JSCommonStock.JSStockInit(); //创建股票数据类
    // this.isIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);

    //判断是黑色版本还是白色版本
    this.colorType = commTool.getURLParams("colorType")
      ? commTool.getURLParams("colorType")
      : "white";
    if (this.colorType == "black") {
      this.blackStyle = HQChart.Chart.HQChartStyle.GetStyleConfig(
        HQChart.Chart.STYLE_TYPE_ID.BLACK_ID             
      );
    } else {
      this.blackStyle = null;
    }

    // var isLog = commTool.getURLParams("log");
    // if(isLog == 'false'){
    //   HQChart.JSConsole.Chart.Log=function() { }  //不输出图形日志
    //   HQChart.JSConsole.Complier.Log=function() { }	//不输出指标脚本执行日志
    // }   
  },
  mounted() {
    this.OnSize();

    // var stockInfo = this.$refs.stockinfo;
    // stockInfo.SetJSStock(this.JSStock); //绑定一个外部的stock ( 五档买卖盘和分笔数据可以共享这一个股票数据类)
    // stockInfo.SetChangeSymbolCallback(this.OnChangeSymbol); //股票切换以后通知
    // stockInfo.SetSymbol(this.Symbol);
    // stockInfo.InitalStock();

    var kline = this.$refs.stockkline;
    // kline.Event.ChangePeriodEvent=this.OnChangePeriod;    //设置周期切换回调

    this.JSStock.ReqeustData();

    var self = this;
    window.onresize = function() {
      self.OnSize();
    };
  },
  methods: {
    OnChangeSymbol: function(symbol) {
      console.log(`[StockFull::OnChangeSymbol] symbol=${symbol}`);
      this.SetSymbol(symbol);
    },
    //切换股票
    SetSymbol: function(symbol) {
      if (this.Symbol == symbol) return;

      var oldIsIndex = StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(
        this.Symbol
      );

      this.Symbol = symbol;
      this.$refs.stockinfo.SetSymbol(symbol);
      this.JSStock.ReqeustData();

      // this.UpdateUIPosition();
    },
    OnSize: function() {
      console.log("[app :: OnSize]", this.$refs.stockfull.offsetWidth);
      var stockFull = this.$refs.stockfull;
      var divStockInfo = this.$refs.divstockinfo;
      var divStockMain = this.$refs.divstockmain;
      var divStockKLine = this.$refs.divstockkline;

      var width = stockFull.offsetWidth;
      var height = stockFull.offsetHeight;
      var stockInfoHeight = divStockInfo.offsetHeight;
      var stockKLineHeight = height - stockInfoHeight;
      var stockKLineWidth = width;

      if (this.TradeInfo.IsShow) stockKLineWidth = width - this.TradeInfo.Width;

      divStockMain.style.height = stockKLineHeight + "px";
      divStockMain.style.width = width + "px";

      divStockKLine.style.height = stockKLineHeight + "px";
      divStockKLine.style.width = stockKLineWidth + "px";

      this.$refs.stockinfo.OnSize();

      this.$refs.stockkline.OnSize();
    },
    //是否全屏显示
    changeFullChart() {
      this.isNoFullChart = !this.isNoFullChart;
      if (this.isNoFullChart == false) {
        this.appWidth = "96%";
        this.appHeight = "98%";
      } else {
        this.appWidth = "1100px";
        this.appHeight = "calc(100% - 36px)";
      }
      var self = this;
      setTimeout(function() {
        self.OnSize();
      }, 50);
    }
  }
};
</script>

<style lang="scss">
* {
  font: 14px / normal "Microsoft Yahei";
  padding: 0;
  margin: 0;
}

html,
body {
  color: #666;
}

/*链接不显示下划线*/
a {
  text-decoration: none;
}

#app {
  width: 100%;
  height: 100%;
}

.appW {
  color: #666;
}

.appB {
  background: black;
  color: #fff;
}

.app {
  overflow: hidden;
  margin: 0 auto;
  .divstockmainB {
    background: #000;
  }
  .divstockmainW {
    background: #fff;
  }
}

.mskBg {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: -1;
  top: 0px;
  left: 0px;
}

.noMarginTop {
  margin-top: 0px;
}

.marginTop {
  margin-top: 10px;
  box-sizing: border-box;
}
</style>
