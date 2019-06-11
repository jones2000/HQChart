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
                <StockKLine ref='stockkline' :DefaultSymbol=this.DefaultSymbol :DefaultPeriod=this.DefaultPeriod :TradeInfoTabWidth=this.TradeInfo.Width 
                    :KLineOption=this.KLineOption :MinuteOption=this.MinuteOption>
                </StockKLine> 
            </div>

            <!--  买卖盘信息 !-->
            <div class='divtradeinfo' ref='divtradeinfo' style='width:200px;position: relative' v-show="TradeInfo.IsShow">
                <StockTradeInfo ref='tradeinfo'  IsShareStock=1 :DefaultSymbol=this.DefaultSymbol ></StockTradeInfo> 
            </div>
        </div>
        <div class='divtradeinfotab'  v-show="TradeInfo.Tab.IsShow" ref='divtradeinfotab'>
            <span v-for='(item,index) in TradeInfo.Tab.Menu' :key='index' :class='{active:TradeInfo.Tab.Selected==index}' v-show='item.IsShow'
                @click="OnClickTradeInfoTab(item,index)">{{item.Name}}</span>
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

            TradeInfo:
            { 
                Width:230, IsShow:true,
                Tab:
                {
                    Menu:[ 
                        {Name:'分笔',Value:1, IsShow:true },
                        {Name:'分价',Value:5, IsShow:true},
                        {Name:'资金',Value:4, IsShow:true }, 
                        {Name:'筹码',Value:2, IsShow:true } ,
                        {Name:'异动',Value:3, IsShow:true}],
                    Selected:0,
                    IsShow:true,
                },
                
            }
        }
    }, 
    
    props: 
    [
        'DefaultSymbol',     //默认股票,
        'DefaultPeriod',
        'KLineOption',
        'MinuteOption',
    ],

    components: { StockInfo, StockTradeInfo, StockKLine},

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
        stockInfo.SetChangeSymbolCallback(this.OnChangeSymbol);   //股票切换以后通知
        stockInfo.SetSymbol(this.Symbol);
        stockInfo.InitalStock();

        var tradeInfo=this.$refs.tradeinfo;
        tradeInfo.SetJSStock(this.JSStock); 
        tradeInfo.SetSymbol(this.Symbol);
        tradeInfo.InitalStock();

        var kline=this.$refs.stockkline;
        kline.Event.ChangePeriodEvent=this.OnChangePeriod;    //设置周期切换回调

        this.JSStock.ReqeustData();

        this.UpdateUIPosition();
    },

    methods:
    {
        //切换股票
        SetSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            var oldSymbol=this.Symbol;
            this.Symbol=symbol;

            var oldIsIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(oldSymbol);
            this.JSStock.UnsubscribeStock(oldSymbol);

            this.$refs.stockinfo.SetSymbol(symbol);
            this.$refs.tradeinfo.SetSymbol(symbol);
            this.$refs.stockkline.ChangeSymbol(symbol);

            this.JSStock.ReqeustData();

            this.UpdateUIPosition();
        },

        OnChangeSymbol:function(symbol)
        {
            console.log(`[StockFull::OnChangeSymbol] symbol=${symbol}`);
            this.SetSymbol(symbol);
        },

        OnSize:function()
        {
            var stockFull=this.$refs.stockfull;
            var divStockInfo=this.$refs.divstockinfo;
            var divStockMain=this.$refs.divstockmain;
            var divStockKLine=this.$refs.divstockkline;
            var divTradeInfo=this.$refs.divtradeinfo;
            var divTradeInfoTab=this.$refs.divtradeinfotab;
            
            var width=stockFull.offsetWidth;
            var height=stockFull.offsetHeight;
            var stockInfoHeight=divStockInfo.offsetHeight;
            var tradeInfoTabHeight = divTradeInfoTab.offsetHeight;
            var stockKLineHeight=height-stockInfoHeight;
            var stockKLineWidth=width;
            if (this.TradeInfo.IsShow) stockKLineWidth=width-this.TradeInfo.Width;;

            divStockMain.style.height=stockKLineHeight+'px';
            divStockMain.style.width=width+'px';

            divStockKLine.style.height=stockKLineHeight+'px';
            divStockKLine.style.width=stockKLineWidth+'px';

            divTradeInfo.style.width=this.TradeInfo.Width+'px';
            divTradeInfo.style.height=stockKLineHeight - tradeInfoTabHeight +'px'; //交易数据高度
            
            divTradeInfoTab.style.width=this.TradeInfo.Width+'px';
            divTradeInfoTab.style.left=(width-this.TradeInfo.Width)+'px';

            this.$refs.stockinfo.OnSize();
            this.$refs.tradeinfo.OnSize();
            this.$refs.stockkline.OnSize();
        },

        UpdateUIPosition:function()
        {
            var isIndex=StockInfo.JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            var tabIndex=this.TradeInfo.Tab.Selected;
            var kline=this.$refs.stockkline;
            var selTabItem=this.TradeInfo.Tab.Menu[this.TradeInfo.Tab.Selected];
            if (isIndex)
            {
                //指数 隐藏右边的报价栏
                this.TradeInfo.IsShow=false;
                this.TradeInfo.Tab.IsShow=false;
                kline.ShowStockChip(false);
            }
            else
            {
                if (this.TradeInfo.Tab.Selected>=0 && selTabItem.Value===2)
                {
                    if (kline.KLine.IsShow)
                    {
                        this.TradeInfo.IsShow=false;
                        kline.ShowStockChip(true);
                    }
                    else
                    {
                        this.TradeInfo.Tab.Selected=0;  //分时默认第1个
                        this.TradeInfo.IsShow=true;
                        kline.ShowStockChip(false);
                    }
                }
                else
                {
                    this.TradeInfo.IsShow=true;
                    kline.ShowStockChip(false);
                }

                //筹码只在K线上出现
                if (kline.KLine.IsShow)
                {
                    this.TradeInfo.Tab.Menu[2].IsShow=true;
                    this.TradeInfo.Tab.Menu[3].IsShow=true;     //筹码
                    this.TradeInfo.Tab.Menu[4].IsShow=false;    //异动
                    if (selTabItem.Value==3) //异动
                        this.OnClickTradeInfoTab({Name:'分笔', Value:1}, 0);    //K线不显示移动， 切换到分笔上
                }   
                else
                {
                    this.TradeInfo.Tab.Menu[2].IsShow=true;
                    this.TradeInfo.Tab.Menu[3].IsShow=false;    //筹码
                    this.TradeInfo.Tab.Menu[4].IsShow=true;     //异动
                }
                
                this.TradeInfo.Tab.IsShow=true;
            }

            this.OnSize();
        },

        OnClickTradeInfoTab:function(item,index)
        {
            if (item.Value===2) //筹码显示
            {
                var kline=this.$refs.stockkline;
                kline.ShowStockChip(true);
                this.TradeInfo.IsShow=false;
                this.OnSize();
            }
            else
            {
                if (this.TradeInfo.Tab.Selected>=0 && this.TradeInfo.Tab.Menu[this.TradeInfo.Tab.Selected].Value===2) 
                {
                    var kline=this.$refs.stockkline;
                    kline.ShowStockChip(false);
                    this.TradeInfo.IsShow=true;
                    this.OnSize();
                }

                switch(item.Value)
                {
                    case 1:         //分笔
                    case 4:         //资金
                    case 3:         //异动
                    case 5:         //分价
                        this.$refs.tradeinfo.ChangeShowData(item.Name,item.Value);
                        break;
                }
            }

            this.TradeInfo.Tab.Selected=index;
        },

        //周期切换回调
        OnChangePeriod:function(name)
        {
            console.log('[StockFull::OnChangePeriod] ',name);
            this.UpdateUIPosition();
        },
    }
}


</script>

<style scoped>

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

.divtradeinfotab
{
    position: relative;
    height: 30px;
    top:-30px;
    display: flex;
    flex-direction: row;
    background-color: #e1ecf2;
}

.divtradeinfotab span 
{
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    flex-grow: 1;
}

.divtradeinfotab span.active 
{
    color: #fff;
    background-color: #125fd9;
}


</style>