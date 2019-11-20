<template>
    <div id="stockinfo">
        <p>{{ Symbol }}</p>
    </div>
</template>
 
<script type="text/javascript">

//数据通道demo类, 没有加入UI, 行情数据订阅-> 接收

import $ from 'jquery'
import JSCommon from '../umychart.vue/umychart.vue.js'
import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'  

export default 
{
    JSCommonStock: JSCommonStock,

    name:'StockInfo',
    props: 
    [
        'IsShareStock',     //是否共享使用一个Stock类,
    ],

    data()
    {
        let data=
        { 
            Symbol:'600000.sh',
            ID:JSCommon.JSChart.CreateGuid(),
            JSStock:null,
            ChangeSymbolCallback:null, //股票代码修改回调事件
        }

        return data;
    },

    created:function()
    {
        
    },

    mounted:function()
    {
        console.log(`[StockInfo::mounted] IsShareStock=${this.IsShareStock} ID=${this.ID}`);
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
        //数据到达
        UpdateData:function(id, arySymbol, dataType, jsStock)
        {
            console.log('[StockInfo::UpdateData] ',id,arySymbol,dataType,jsStock,this.ID);
            if(id!=this.ID) return;
            if (arySymbol.indexOf(this.Symbol)<0) return;   //判断下是否是需要个股票

            let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
            let data={ };    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}
            data.Name={ Text:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.NAME) };
            data.Date={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DATE) };
            data.Time={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.TIME) };
            data.Price={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PRICE), Text:'--' };
            data.RiseFallPrice={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE) };
            data.Increase={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.INCREASE) };
            data.High={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.HIGH) };
            data.Low={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.LOW) };
            data.Open={ Value:read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.OPEN) };
            let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

            data.Price.Text=JSCommon.IFrameSplitOperator.FormatValueString(data.Price.Value,2);
            data.Price.Color=JSCommon.IFrameSplitOperator.FormatValueColor(data.Price.Value,yClose);

            console.log('[StockInfo::UpdateData]', this.Symbol, data);
        },

        //设置外部共享的股票数据类
        SetJSStock:function(jsStock)
        {
            this.JSStock=jsStock;
        },

        //切换股票代码
        SetSymbol:function(symbol)
        {
            if (this.Symbol==symbol) return;

            this.InitalStock();
            this.JSStock.ReqeustData();
        },

        //初始化
        InitalStock:function()
        {
            let read = this.JSStock.GetStockRead(this.ID, this.UpdateData);         //获取一个读取数据类,并绑定id和更新数据方法

            const stockField=//需要获取的数据字段
            [
                JSCommonStock.STOCK_FIELD_NAME.NAME,
                JSCommonStock.STOCK_FIELD_NAME.DATE,
                JSCommonStock.STOCK_FIELD_NAME.TIME,
                JSCommonStock.STOCK_FIELD_NAME.PRICE,
                JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE,
                JSCommonStock.STOCK_FIELD_NAME.INCREASE,
                JSCommonStock.STOCK_FIELD_NAME.HIGH,
                JSCommonStock.STOCK_FIELD_NAME.LOW,
                JSCommonStock.STOCK_FIELD_NAME.OPEN,
                JSCommonStock.STOCK_FIELD_NAME.YCLOSE
            ];

            const indexField=
            [
                JSCommonStock.STOCK_FIELD_NAME.NAME,
                JSCommonStock.STOCK_FIELD_NAME.DATE,
                JSCommonStock.STOCK_FIELD_NAME.TIME,
                JSCommonStock.STOCK_FIELD_NAME.PRICE,
                JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE,
                JSCommonStock.STOCK_FIELD_NAME.YCLOSE
            ];

            if (this.IsSHSZIndex())
                read.SetQueryField(this.Symbol,indexField);
            else 
                read.SetQueryField(this.Symbol,stockField);
        },

        //是否是指数
        IsSHSZIndex:function () 
        {
            return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
        },

        //股票代码编辑框切换股票事件
        OnChangeSymbol:function(symbol)
        {
            this.SetSymbol(symbol);
            if (this.ChageSymbolCallback) this.ChageSymbolCallback(symbol);            
        },

        SetChangeSymbolCallback:function(func)
        {
            this.ChangeSymbolCallback=func;
        }
    }
}
</script>
