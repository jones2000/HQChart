<template>
<div id="app2" >
    <p>全屏宽度测试用例</p>
    <StockInfo ref='stockinfo' IsShareStock=true></StockInfo>
    <!-- <p>百分比宽度+默认股票测试用例</p>
    <div id='app4' style="width:80%">
        <StockInfo ref='stockinfo3' DefaultSymbol='399001.sz'></StockInfo> 
    </div>

    <p>固定宽度测试用例</p>
    <div id="app3" style=" left:20px;width:600px; position: relative;"> 
        <StockInfo ref='stockinfo2' IsShareStock=true></StockInfo> 
    </div>


    <StockTradeInfo ref='stocktradeinfo' IsShareStock=true></StockTradeInfo> -->

</div>
</template>

<script>
import StockInfo from '../../jscommon/umychart.vue.components/stockinfo.vue'
import StockTradeInfo from '../../jscommon/umychart.vue.components/stocktradeinfo.demo.vue'

export default 
{
    data () 
    {
        return {
          JSStock:null,  //共享的股票数据类
        }
    },   

    components: { StockInfo, StockTradeInfo },

    created:function()
    {
        this.JSStock=StockInfo.JSCommonStock.JSStockInit(); //创建股票数据类
    },

    mounted:function()
    {
        console.log('[page::mounted]',this,this.$refs.stockinfo);
        var stockInfo=this.$refs.stockinfo;
        stockInfo.SetJSStock(this.JSStock); //绑定一个外部的stock ( 五档买卖盘和分笔数据可以共享这一个股票数据类)
        stockInfo.SetChangeSymbolCallback(this.OnChangeSymbol); //股票切换以后通知
        stockInfo.SetSymbol("000001.sz");
        stockInfo.InitalStock();

        // var tradeInfo=this.$refs.stocktradeinfo;
        // tradeInfo.SetJSStock(this.JSStock); //绑定一个外部的stock
        // tradeInfo.SetSymbol("000001.sz");
        // tradeInfo.InitalStock();

        // var stockInfo2=this.$refs.stockinfo2;
        // stockInfo2.SetJSStock(this.JSStock); //绑定一个外部的stock ( 五档买卖盘和分笔数据可以共享这一个股票数据类)
        // stockInfo2.SetChangeSymbolCallback(this.OnChangeSymbol); //股票切换以后通知
        // stockInfo2.SetSymbol("600000.sh");
        // stockInfo2.InitalStock();

        this.JSStock.ReqeustData();

        // var stockInfo3=this.$refs.stockinfo3;

        var self=this;
        window.onresize = function() { self.OnSize() }
    },


    methods:
    {
        OnChangeSymbol:function(symbol)
        {

        },
        
        OnSize:function()
        {
            this.$refs.stockinfo.OnSize();
            // this.$refs.stockinfo2.OnSize();
            // this.$refs.stockinfo3.OnSize();
            // this.$refs.stocktradeinfo.OnSize();
        }
    }
}

</script>

<style>

  
</style>
