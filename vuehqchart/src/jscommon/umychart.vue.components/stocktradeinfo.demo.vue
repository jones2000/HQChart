<!--
    5档买卖盘,成交笔数
!-->

<template>
    <div id="stockinfo">
        <p>{{ Symbol }}</p>
        <p>5档买卖盘,成交笔数</p>
        <p>买一</p>
        <p>{{BuyData[0].Vol.Text}}</p>
        <p>卖一</p>
        <p>{{SellData[0].Vol.Text}}</p>
    </div>
</template>

<script type="text/javascript">

import $ from 'jquery'
import JSCommon from '../umychart.vue/umychart.vue.js'
import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'


//默认数据输出
class DefaultData
{
    static GetBuyData()
    {
        const data=
        [
            { Vol:{Text:''}, Price:{Text:'', Color:''} },
            { Vol:{Text:''}, Price:{Text:'', Color:''} },
            { Vol:{Text:''}, Price:{Text:'', Color:''} },
            { Vol:{Text:''}, Price:{Text:'', Color:''} },
            { Vol:{Text:''}, Price:{Text:'', Color:''} },
        ];

        return data;
    }

    static GetSellData()
    {
        return DefaultData.GetBuyData();
    }

    static GetTradeData()
    {

    }

    static GetBookData()
    {
        
    }
}

export default 
{
    JSCommonStock: JSCommonStock,

    name:'StockTradeInfo',
    props: 
    [
        'IsShareStock',     //是否共享使用一个Stock类,
    ],

    data()
    {
        let data=
        { 
            Symbol:'600000.sh',
            ID:[ JSCommon.JSChart.CreateGuid(), JSCommon.JSChart.CreateGuid(), JSCommon.JSChart.CreateGuid()],   //[0]=买卖盘  [1]=分笔 [2]=委比委差
            JSStock:null,

            BuyData:DefaultData.GetBuyData(),       //买盘
            SellData:DefaultData.GetSellData(),     //卖盘
            IsBuySellInital:false, //第1次 需要初始化

            TradeData:null, //分笔数据
            IsTradeDataInital:false, //第1次 需要初始化

            BookData:null, //委比委差数据
        }

        return data;
    },

    created:function()
    {
        
    },

    mounted:function()
    {
        console.log(`[StockTradeInfo::mounted] IsShareStock=${this.IsShareStock} ID=${this.ID}`);
        if (this.IsShareStock==true)    //外部调用SetJSStock()设置， 内部不创建
        {

        }
        else
        {
            this.JSStock=JSCommonStock.JSStockInit();
        }
    },

    methods:
    {
        UpdateBuySell:function(id, arySymbol, dataType, jsStock)
        {
            if(arySymbol.indexOf(this.Symbol)<0) return;

            let read = jsStock.GetStockRead(this.ID[0], this.UpdateBuySell);                     //获取一个读取数据类,并绑定id和更新数据方法
            let aryBuy=read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BUY5);
            let arySell=read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.SELL5);
            let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

            if (!this.IsPlusNumber(yClose)) return;

            if (this.IsBuySellInital==true && (id!=this.ID[0] || dataType!=JSCommonStock.RECV_DATA_TYPE.BUY_SELL_DATA)) return;

            console.log('[StockTradeInfo::UpdateBuySell]', this.Symbol, aryBuy,arySell,yClose);
            let buyData=DefaultData.GetBuyData();
            for(var i in aryBuy)
            {
                var item=aryBuy[i];
                var buyItem=buyData[i];
                buyItem.Vol.Text=item.Vol.toString();
            }
            
            let sellData=DefaultData.GetSellData();
            for(var i in arySell)
            {
                var item=arySell[i];
                var selItem=sellData[i];
                selItem.Vol.Text=item.Vol.toString();
            }

            this.IsBuySellInital=true;  //已经初始化了
            this.SellData=sellData;
            this.BuyData=buyData;
        },

        UpdateTrade:function(id, arySymbol, dataType, jsStock)
        {
            if(arySymbol.indexOf(this.Symbol)<0) return;

            let read = jsStock.GetStockRead(this.ID[1], this.UpdateTrade); //获取一个读取数据类,并绑定id和更新数据方法
            let aryDeal={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DEAL) };
            let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

            console.log('[StockTradeInfo::UpdateTrade]', this.Symbol,aryDeal,yClose);
            if (!this.IsPlusNumber(yClose)) return;

            if (id!=this.ID[1] || dataType!=JSCommonStock.RECV_DATA_TYPE.DEAL_DATA) return;
        },

        UpdateBookRate:function(id, arySymbol, dataType, jsStock)
        {
            if(arySymbol.indexOf(this.Symbol)<0) return;

            let read = jsStock.GetStockRead(this.ID[2], this.UpdateBookRate); //获取一个读取数据类,并绑定id和更新数据方法
            var bookRate={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE) } ; //委比
            var bookDiffer={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER) };  //委差

            if (id!=this.ID[2] || dataType!=JSCommonStock.RECV_DATA_TYPE.DERIVATIVE_DATA) return;
            console.log('[StockTradeInfo::UpdateBookRate]', this.Symbol,bookRate,bookDiffer);
        },

        //设置外部共享的股票数据类
        SetJSStock:function(jsStock)
        {
            this.JSStock=jsStock;
        },

        RequestData:function()
        {
            this.JSStock.RequestData();
        },

        //切换股票代码
        SetSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            var isIndexBackup=this.IsSHSZIndex();
            this.Symbol=symbol;
            var isIndex=this.IsSHSZIndex();   //是否是指数

            console.log(`[StockTradeInfo::SetSymbol] symbol=${this.Symbol} isIndex=${isIndex} isIndexBackup=${isIndexBackup}`);

            //TODO: 更新UI, 指数和个股显示字段不一样
            if (isIndexBackup!=isIndex)
            {

            }

            this.IsBuySellInital=false;
            this.IsTradeDataInital=false;
            this.InitalStock();     //订阅数据
        },

        //初始化
        InitalStock:function()
        {
            if (this.IsSHSZIndex()) return; //指数没有买卖盘
            
            // 分成3个ID 分开取
            let read = this.JSStock.GetStockRead(this.ID[0], this.UpdateBuySell);          //订阅买卖盘数据
            read.SetQueryField(this.Symbol,[ JSCommonStock.STOCK_FIELD_NAME.BUY5,
                                                JSCommonStock.STOCK_FIELD_NAME.SELL5,
                                                JSCommonStock.STOCK_FIELD_NAME.YCLOSE]);

            read= this.JSStock.GetStockRead(this.ID[1], this.UpdateTrade);               //订阅成交明细
            read.SetQueryField(this.Symbol,[ JSCommonStock.STOCK_FIELD_NAME.DEAL,
                                                JSCommonStock.STOCK_FIELD_NAME.YCLOSE]);

            read= this.JSStock.GetStockRead(this.ID[2], this.UpdateBookRate);            //订阅委比委差
            read.SetQueryField(this.Symbol,[  JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE,
                                                JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER]);
        },

        //窗口变化UI自适应调整
        OnSize:function()
        {

        },

        IsSHSZIndex:function () 
        {
                return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
        },

        IsNumber:JSCommon.IFrameSplitOperator.IsNumber,          //是否是数值型
        IsPlusNumber:JSCommon.IFrameSplitOperator.IsPlusNumber,  //是否是>0的数值型
    }

}


</script>

<style lang="less" scoped>
*{
  padding:0; margin: 0;
}
    
ul,ol{
  list-style:none;
}
</style>

