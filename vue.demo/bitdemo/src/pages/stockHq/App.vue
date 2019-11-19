<template>
    <div id="app" ref='app' style="height:100%">
        <stockHq DefaultPairName="ETH/BTC" DefaultName="以太币" DefaultfloatPrecision=8 DefaultPeriod=0 ref='klinechart'>
        </stockHq>
        <coinList @ChangeSymbol="ChangeSymbol">
        </coinList>
    </div>
</template>
  
<script>
import stockHq from "./components/stockHq.vue";
import coinList from "./components/coinList.vue";


export default 
{
    name:'BitDemo',

    data() 
    {
        var data={};
        return data;
    },

    components: 
    { 
        stockHq: stockHq, 
        coinList: coinList
    },

    mounted()
    {
        this.OnSize();
    },

    methods: 
    {
        ChangeSymbol(symbol,name,floatPrecision)    //转发切换股票数据到图形
        {
            var klineChart=this.$refs.klinechart;
            klineChart.ChangeSymbol(symbol,name,floatPrecision);
        },

        OnSize()    //调整大小
        {
            var klineChart=this.$refs.klinechart; 
            klineChart.$refs.divklinechart.style.height='450px';   //动态调整K线图控件高度
            
            this.$nextTick(() => { klineChart.OnSize(); });
        }
    }
}
</script>
  
<style>
* {margin: 0; padding: 0;}
body,html {color: #333;}
body {background-color: #f7f7f7; min-height: 100%; height: initial !important;}
html,body,div,a,img,table {-webkit-tap-highlight-color:transparent;}
div:active { background: transparent;}
a {text-decoration: none;}
ul,ol {list-style: none;}
.clear:after {content: " "; height: 0; display: block; overflow: hidden; clear: both;}
</style>
