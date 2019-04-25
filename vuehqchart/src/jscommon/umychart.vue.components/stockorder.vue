<!-- 
      个股排名
!-->

<template>

</template>


<script>
 
import $ from 'jquery'
import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'


export default 
{
    name: 'StockOrder',

    props:
    [
        'DefaultOrderFiled',    //显示的周期
        'DefaultOrder',         //默认排序方向
        'DefaultSymbol',        //默认板块代码
    ],

    STOCK_FIELD_NAME:JSCommonStock.STOCK_FIELD_NAME,    //把字段类型导出
    
    data() 
    {
        let data =
        {
            OrderFiled:JSCommonStock.STOCK_FIELD_NAME.INCREASE,      //排序字段
            Symbol:'600000.sh', //板块代码
            Order:-1,           //排序方向 -1 /1
            JSStock: null,      //数据模块
        }

        return data;
    },

    created() 
    {
        if (this.DefaultOrderFiled) this.OrderFiled=this.DefaultOrderFiled;
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol;
        if (this.DefaultOrder===-1 || this.DefaultOrder===1) this.Order=this.DefaultOrder;
    },

    mounted() 
    {
        this.JSStock = JSCommonStock.JSStock.GetBlockMember(this.Symbol);
        this.InitalStock();
        this.JSStock.RequestData();

        this.OnSize();
    },

    methods: 
    {
        OnSize: function ()   //动态调整UI
        {

        },

        InitalStock:function()
        {
            this.JSStock.SetField([
                JSCommonStock.STOCK_FIELD_NAME.SYMBOL, JSCommonStock.STOCK_FIELD_NAME.PRICE, 
                JSCommonStock.STOCK_FIELD_NAME.NAME,JSCommonStock.STOCK_FIELD_NAME.YCLOSE,this.OrderFiled]);
            this.JSStock.SetOrder(this.OrderFiled, this.Order);
            this.JSStock.OrderNull=1;   //过滤掉null股票
            this.JSStock.UpdateUICallback = this.UpdateData;
        },

        //数据到达
        UpdateData: function (jsStock) 
        {
            console.log('[StockOrder::UpdateData] recv data', jsStock);
            for(var i in jsStock.Data)
            {
                var item=jsStock.Data[i];
                var name=item.Name;         //股票名称
                var price=item.Price;       //最新价格
                var yClose=item.YClose;     //前收盘价
                var value;
                switch(this.OrderFiled)
                {
                    case JSCommonStock.STOCK_FIELD_NAME.INCREASE:
                        value=item.Increase;
                        break;

                    //涨速
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_1:
                        value=item.RiseFallSpeed.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_3:
                        value=item.RiseFallSpeed.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_5:
                        value=item.RiseFallSpeed.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_10:
                        value=item.RiseFallSpeed.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_15:
                        value=item.RiseFallSpeed.M15;
                        break;

                    //振幅
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_1:
                        value=item.MinuteAmplitude.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_3:
                        value=item.MinuteAmplitude.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_5:
                        value=item.MinuteAmplitude.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_10:
                        value=item.MinuteAmplitude.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_15:
                        value=item.MinuteAmplitude.M15;
                        break;

                    //成交金额
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_1:
                        value=item.MAmount.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_3:
                        value=item.MAmount.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_5:
                        value=item.MAmount.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_10:
                        value=item.MAmount.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_15:
                        value=item.MAmount.M15;
                        break;
                }
                console.log(`[StockOrder::UpdateData] name:${name} price:${price} yClose:${yClose} value:${value}`);
            }
        }
    }
        
}


</script>