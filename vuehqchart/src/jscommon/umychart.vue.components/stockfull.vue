<!-- 
    完整的行情页面 (股票最新信息 买卖盘 分笔 走势图 K线图)
  !-->

<template>
    <div id="stockfull" ref='stockfull' style="width:100%;height:100%">
        <!--  股票最新信息 !-->
        <div ref='divstockinfo'>
            <StockInfo ref='stockinfo' IsShareStock=1 :DefaultSymbol=this.DefaultSymbol></StockInfo>
        </div>

        <div class='divstockmain' ref='divstockmain'>
            <!--  走势图|K线图 !-->
            <div ref='divstockkline' style="height:200px;position: relative">
                <StockKLine ref='stockkline' :DefaultSymbol=this.DefaultSymbol :DefaultPeriod=this.DefaultPeriod 
                    :KLineOption=this.KLineOption :MinuteOption=this.MinuteOption>
                </StockKLine> 
            </div>

            <!--  买卖盘信息 !-->
            <div class='divtradeinfo' ref='divtradeinfo' style='width:200px;position: relative' v-show="TradeInfo.IsShow">
                <StockTradeInfo ref='tradeinfo'  IsShareStock=1 :DefaultSymbol=this.DefaultSymbol ></StockTradeInfo> 
            </div>
        </div>
    </div>
</template>


<script>
import StockInfo from '../../jscommon/umychart.vue.components/stockinfo.vue'
import StockTradeInfo from '../../jscommon/umychart.vue.components/stocktradeinfo.vue'
import StockKLine from '../../jscommon/umychart.vue.components/stockkline.demo.vue'

export default 
{
    name:'StockFull',
    data () 
    {
        return {

            JSStock:null,  //共享的股票数据类
            Symbol:'600000.sh',

            TradeInfo:{ Width:230, IsShow:true }
        }
    }, 
    
    props: 
    [
        'DefaultSymbol',     //默认股票,
        'DefaultPeriod',
        'KLineOption',
        'MinuteOption',
    ],

    components: { StockInfo, StockTradeInfo, StockKLine },

    created:function()
    {
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol;
        this.JSStock=StockInfo.JSCommonStock.JSStockInit(); //创建股票数据类
    },

    mounted:function()
    {
        var isIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
        if (isIndex) this.TradeInfo.IsShow=false;    //指数不显示买卖盘

        this.OnSize();

        var stockInfo=this.$refs.stockinfo;
        stockInfo.SetJSStock(this.JSStock);                         //绑定一个外部的stock ( 五档买卖盘和分笔数据可以共享这一个股票数据类)
        //stockInfo.SetChangeSymbolCallback(this.OnChangeSymbol);   //股票切换以后通知
        stockInfo.SetSymbol(this.Symbol);
        stockInfo.InitalStock();

        var tradeInfo=this.$refs.tradeinfo;
        tradeInfo.SetJSStock(this.JSStock); 
        tradeInfo.SetSymbol(this.Symbol);
        tradeInfo.InitalStock();

        this.JSStock.ReqeustData();
    },

    methods:
    {
        //切换股票
        SetSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            var oldIsIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);

            this.Symbol=symbol;
            this.$refs.stockinfo.SetSymbol(symbol);
            
            this.$refs.tradeinfo.SetSymbol(symbol);
            this.$refs.stockkline.ChangeSymbol(symbol);

            this.JSStock.ReqeustData();

            var isIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            if (isIndex) this.TradeInfo.IsShow=false;    //指数不显示买卖盘
            else this.TradeInfo.IsShow=true;
            if (isIndex!=oldIsIndex) this.OnSize();
        },

        OnSize:function()
        {
            var stockFull=this.$refs.stockfull;
            var divStockInfo=this.$refs.divstockinfo;
            var divStockMain=this.$refs.divstockmain;
            var divStockKLine=this.$refs.divstockkline;
            var divTradeInfo=this.$refs.divtradeinfo;
            
            var width=stockFull.clientWidth;
            var height=stockFull.clientHeight;
            var stockInfoHeight=divStockInfo.clientHeight;
            var stockKLineHeight=height-stockInfoHeight;
            var stockKLineWidth=width;
            if (this.TradeInfo.IsShow) stockKLineWidth=width-this.TradeInfo.Width;;

            divStockMain.style.height=stockKLineHeight+'px';
            divStockMain.style.width=width+'px';

            divStockKLine.style.height=stockKLineHeight+'px';
            divStockKLine.style.width=stockKLineWidth+'px';

            divTradeInfo.style.width=this.TradeInfo.Width+'px';
            divTradeInfo.style.height=stockKLineHeight+'px';

            console.log(`[StockFull::OnSize] width=${width} height=${height}`);

            this.$refs.stockinfo.OnSize();
            this.$refs.tradeinfo.OnSize();
            this.$refs.stockkline.OnSize();
        },

        //obj:{IsShow:'是否显示'}
        ShowTradeInfo:function(obj)
        {
            if (!obj) return;
            this.TradeInfo.IsShow=obj.IsShow;
            this.OnSize();
        }
    }
}


</script>

<style>

* 
{
    font: 14px/normal "Microsoft Yahei";
    color: #666;
    padding: 0;
    margin: 0;
}

.divstockmain
{
    content: '';
    display: block;
    width: 0;
    height: 0;
    overflow: hidden;
    clear: both;
}

.divstockmain>div {float: left;}


</style>