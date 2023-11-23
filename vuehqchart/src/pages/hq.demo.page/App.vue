<template>
    <div id="app2" >
      <div class="demoPageTop">
        <span>HQChart测试用例 版本号:1.1.12314</span> 
        <a href="https://github.com/jones2000/HQChart" target="_blank">代码地址: https://github.com/jones2000/HQChart</a>
        <div class="changeColorBtns">
          <button type="button" @click="OnChangeStyle('black')">黑色风格</button>
          <button type="button" @click="OnChangeStyle('white')">白色风格</button>
        </div>
        
      </div>
        
        <!--
        <a v-on:click="OnChangeSymbol('002230.sz')">科大讯飞</a>
        <a v-on:click="OnChangeSymbol('600016.sh')">民生银行</a>
        <a v-on:click="OnChangeSymbol('000001.sh')">上证指数</a>
        !-->
        <div class='divstockfull'>
            <StockFull ref='stockfull' DefaultPeriod='分时' :DefaultSymbol=this.Symbol 
                :KLineOption=this.KLineOption :MinuteOption=this.MinuteOption />
        </div>
    </div>
</template>

<script>
import StockFull from '../../jscommon/umychart.vue.components/stockfull.vue'
import HQChart from '../../jscommon/umychart.vue/umychart.vue'

//定制K线设置
const CUSTOM_KLINE_OPTION=
{
    Windows: //窗口指标
    [
        {Index:"MA", Overlay:true, Export:true, OverlayIndexType:{ Position:1, LineSpace:3 }},
        {Index:"MACD", Overlay:true, OverlayIndexType:{ Position:1, LineSpace:3 }},
    ], 

    //TradeIndex: {Index:'交易系统-BIAS'},    //交易系统
    //ColorIndex:{ Index:'五彩K线-十字星'},     //五彩K线

    KLine:
    {
        //Info:["公告","互动易","调研"],              //信息地雷
        Right:0,                                   //复权 0 不复权 1 前复权 2 后复权
    }
}

const CUSTOM_MINUTE_OPTION=
{
    Windows: //窗口指标
    [
        {Index:"RSI", Export:true },
    ]
}




export default 
{
    data () 
    {
        return {
          KLineOption:CUSTOM_KLINE_OPTION,
          MinuteOption:CUSTOM_MINUTE_OPTION,
          Symbol:'000001.sz'
        }
    },   

    components: { StockFull},

    created:function()
    {
        var symbol = this.GetURLParams('symbol');
        if (symbol != null) this.Symbol = symbol;
        var isLog=this.GetURLParams('log');
        if (isLog=='false') 
        {
            HQChart.JSConsole.Chart.Log=()=>{}
            HQChart.JSConsole.Complier.Log=()=>{}
        }
    },

    mounted:function()
    {
        var stockfull=this.$refs.stockfull;

        var self=this;
        window.onresize = function() { self.OnSize() }

        this.OnSize();
    },


    methods:
    {
        OnChangeSymbol:function(symbol)
        {
            this.$refs.stockfull.SetSymbol(symbol);
        },
        
        OnSize:function()
        {
            var height= $(window).height();
            var width = $(window).width();

            $('.divstockfull').height(height-70);

            this.$refs.stockfull.OnSize();
        },

        GetURLParams:function(name) 
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },

        OnChangeStyle(styleName)
        {
            this.$refs.stockfull.OnChangeStyle(styleName);
        }
    }
}

</script>

<style lang="less">
* 
{
    font: 14px/normal "Microsoft Yahei";
    color: #666;
    padding: 0;
    margin: 0;
}

.demoPageTop{
  position: relative;
  height: 40px;
  line-height: 40px;
  text-align: center;

  .changeColorBtns{
    position: absolute;
    top: 0;
    right: 15px;
    height: 100%;
    width: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.divstockfull
{
    height:800px;
    margin: 5px;   
    border:4px solid #FFA500; 
}
  
</style>
