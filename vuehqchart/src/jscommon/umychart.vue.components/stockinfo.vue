<template>
    <div id="stockinfo" class="topWrap clearfix" ref='stockinfo'>
        <div class="stockInfo" :style='CellStyle[0]'>
            <p class="stockName">{{StockData.Name.Text}}</p>
            <div class="codeInfo"><span class="code">{{Symbol}}</span><i class="iconfont icon-bianji" @click=''></i>
            </div>

        </div>
        <div class="priceInfo" :style='CellStyle[1]'>
            <p class="priceCurrentNum" :class='StockData.Price.Color'>{{StockData.Price.Text}}</p>
            <p class="priceCurrent"><span class="riseNum"
                    :class='StockData.RiseFallPrice.Color'>{{StockData.RiseFallPrice.Text}}</span><span
                    class="risePrecent" :class='StockData.Increase.Color'>{{StockData.Increase.Text}}</span></p>
        </div>
        <div class='otherInfo' :style='CellStyle[2]'>
            <div class="high">最高：<span :class='StockData.High.Color'>{{StockData.High.Text}}</span></div>
            <div class="low">最低：<span :class='StockData.Low.Color'>{{StockData.Low.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[3]'>
            <div class="open">今开：<span :class='StockData.Open.Color'>{{StockData.Open.Text}}</span></div>
            <div class="change">换手：<span :class='StockData.Excahngerate.Color'>{{StockData.Excahngerate.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[4]'>
            <div class="num">成交额：<span>{{StockData.Amount.Text}}</span></div>
            <div class="totalValue">成交量：<span>{{StockData.Vol.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[5]'>
            <div class="pe">PE：<span>{{StockData.Pe.Text}}</span></div>
            <div class="roe">ROE：<span :class='StockData.Roe.Color'>{{StockData.Roe.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[6]'>
            <div class="marketV">总市值：<span>{{StockData.MarketV.Text}}</span></div>
            <div class="flowMarketV">流通市值：<span>{{StockData.FlowMarketV.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[7]'>
            <div class="eps">EPS：<span>{{StockData.Eps.Text}}</span></div>
            <div class="scrollEPS">EPS(动)：<span>{{StockData.ScrollEPS.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[8]'>
            <div class="pb">PB：<span>{{StockData.Pb.Text}}</span></div>
            <div class="amplitude">振幅：<span>{{StockData.Amplitude.Text}}</span></div>
        </div>
        <!-- <div class="otherInfo">
            <ul>
                
            </ul>
        </div> -->
    </div>
</template>

<script>
    import $ from 'jquery'
    import JSCommon from '../umychart.vue/umychart.vue.js'
    import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'

    function DefaultData()
    {

    }

    DefaultData.GetStockData=function() //数据默认显示值
    {
        const data=
        { 
            Name:{Text:''},
            Price: {Text:'', Color:'PriceNull'},
            RiseFallPrice: {Text:'', Color:'PriceNull'} ,
            Increase: {Text:'', Color:'PriceNull'} ,
            High: {Text:'', Color:'PriceNull'} ,
            Low: {Text:'', Color:'PriceNull'} ,
            Open: {Text:'', Color:'PriceNull'} ,
            Excahngerate:  {Text:'', Color:'PriceNull'} ,

            Amount: {Text:''}, Vol: {Text:''},
            Pe: {Text:''}, Roe: {Text:''},
            MarketV: {Text:''},FlowMarketV: {Text:''},
            Eps: {Text:''},ScrollEPS: {Text:''},
            Pb: {Text:''},Amplitude: {Text:''},
        };

        return data;
    }

    DefaultData.GetCellStyle=function()
    {
        let data=
        [
            { left:0, width:0, display:'none' }, { left:0, width:0 ,display:'none'},
            { left:0, width:0 ,display:'none'}, { left:0, width:0 ,display:'none'}, { left:0, width:0 ,display:'none'}, { left:0, width:0 ,display:'none'},
            { left:0, width:0 ,display:'none'}, { left:0, width:0 ,display:'none'},{ left:0, width:0 ,display:'none'}
        ];  //默认都不显示

        return data;
    }

    export default {
        JSCommonStock: JSCommonStock,
        JSCommon:JSCommon,
        
        name: 'StockInfo',
        props:
            [
                'IsShareStock',     //是否共享使用一个Stock类,
                'DefaultSymbol',    //默认股票
            ],
        data() {
            let data =
            {
                Symbol: '600000.sh',
                ID: JSCommon.JSChart.CreateGuid(),
                JSStock: null,
                ChangeSymbolCallback: null, //股票代码修改回调事件
                StockData: DefaultData.GetStockData(),
                CellStyle:DefaultData.GetCellStyle(),
                WrapWidth: 1366
            }

            return data;
        },
        watch: {
            Symbol: function (newValue, oldValue) {

                var isIndexBackup = this.IsSHSZIndex();

                var isIndex = this.IsSHSZIndex();   //是否是指数

                //TODO: 更新UI, 指数和个股显示字段不一样
                if (isIndexBackup != isIndex) {

                }

                var symbolAry = new Array();
                symbolAry.push(newValue);
                this.UpdateData(null, symbolAry, null, this.JSStock);
                this.JSStock.ReqeustData();
            }
        },
        mounted() 
        {
            console.log(`[StockInfo::mounted] IsShareStock=${this.IsShareStock} ID=${this.ID}`);
            if (this.IsShareStock == true || this.IsShareStock=='true')    //外部调用SetJSStock()设置， 内部不创建, 请求和订阅 都由外部调用
            {

            }
            else 
            {
                //不共享的JSStock, 直接创建->订阅->请求数据
                this.JSStock = JSCommonStock.JSStockInit();
                this.InitalStock();
                this.JSStock.RequestData();
            }

            this.OnSize();
        },
        created() 
        {
            if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol; //默认股票
        },
        methods: {
            //初始化
            InitalStock: function () {
                let read = this.JSStock.GetStockRead(this.ID, this.UpdateData);         //获取一个读取数据类,并绑定id和更新数据方法

                const stockField =//需要获取的数据字段
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
                        JSCommonStock.STOCK_FIELD_NAME.YCLOSE,
                        JSCommonStock.STOCK_FIELD_NAME.EXCHANGE_RATE,
                        JSCommonStock.STOCK_FIELD_NAME.AMOUNT,
                        JSCommonStock.STOCK_FIELD_NAME.VOL,
                        JSCommonStock.STOCK_FIELD_NAME.PE,
                        JSCommonStock.STOCK_FIELD_NAME.MARKET_VALUE,
                        JSCommonStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE,
                        JSCommonStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING,
                        JSCommonStock.STOCK_FIELD_NAME.FINANCE_EPS,
                        JSCommonStock.STOCK_FIELD_NAME.ROE,
                        JSCommonStock.STOCK_FIELD_NAME.PB,
                        JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE
                    ];

                const indexField =
                    [
                        JSCommonStock.STOCK_FIELD_NAME.NAME,
                        JSCommonStock.STOCK_FIELD_NAME.DATE,
                        JSCommonStock.STOCK_FIELD_NAME.TIME,
                        JSCommonStock.STOCK_FIELD_NAME.PRICE,
                        JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE,
                        JSCommonStock.STOCK_FIELD_NAME.YCLOSE
                    ];

                if (this.IsSHSZIndex())
                    read.SetQueryField(this.Symbol, indexField);
                else
                    read.SetQueryField(this.Symbol, stockField);
            },
            //是否是指数
            IsSHSZIndex: function () {
                return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            },
            GetHeight() {
                return $('#stockinfo').outerHeight(true) + 1;
            },
            //数据到达
            UpdateData: function (id, arySymbol, dataType, jsStock) {
                console.log('[StockInfo::UpdateData] ', id, arySymbol, dataType, jsStock, this.ID);
                if (id != this.ID) return;
                if(arySymbol.indexOf(this.Symbol)<0) return;

                let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
                let data = {};    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}
                data.Name = { Text: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.NAME) };
                data.Date = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DATE), Text: '--' };
                data.Time = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.TIME), Text: '--' };
                data.Price = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PRICE), Color: '', Text: '--' };
                data.RiseFallPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.RISE_FALL_PRICE) };
                data.Increase = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.INCREASE), Color: '', Text: '--' };
                data.High = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.HIGH), Color: '', Text: '--' };
                data.Low = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.LOW), Color: '', Text: '--' };
                data.Open = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.OPEN), Color: '', Text: '--' };

                data.Excahngerate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EXCHANGE_RATE), Color: '', Text: '--' };
                data.Amount = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMOUNT), Text: '--' };
                data.Vol = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.VOL), Text: '--' };
                data.Pe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PE), Text: '--' };
                data.MarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MARKET_VALUE), Text: '--' };
                data.FlowMarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE), Text: '--' };
                data.Eps = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING), Text: '--' };
                data.ScrollEPS = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_EPS), Text: '--' };
                data.Roe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.ROE), Color: '', Text: '--' };
                data.Pb = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PB), Text: '--' };
                data.Amplitude = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE), Text: '--' };
                let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

                data.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Price.Value, 2);
                data.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Price.Value, yClose);

                if (data.RiseFallPrice.Value==0) data.RiseFallPrice.Text='0.00';
                else data.RiseFallPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.RiseFallPrice.Value, 2);
                data.RiseFallPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.RiseFallPrice.Value, yClose);

                if (data.Increase.Value==0) data.Increase.Text='0.00%';
                else data.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase.Value, 2)+'%';
                data.Increase.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Increase.Value, yClose);

                data.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High.Value, 2);
                data.High.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.High.Value, yClose);

                data.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low.Value, 2);
                data.Low.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Low.Value, yClose);

                data.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open.Value, 2);
                data.Open.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Open.Value, yClose);

                data.Roe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Roe.Value, 2);
                data.Roe.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Roe.Value, yClose);

                data.Excahngerate.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Excahngerate.Value, 2);
                data.Excahngerate.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Excahngerate.Value, yClose);

                data.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount.Value, 2);
                data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value, 2);
                data.MarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MarketV.Value, 0);
                data.FlowMarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.FlowMarketV.Value, 0);
                data.Pe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pe.Value, 2);
                data.Eps.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Eps.Value, 2);
                data.ScrollEPS.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.ScrollEPS.Value, 2);
                data.Pb.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pb.Value, 2);
                data.Amplitude.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amplitude.Value, 2);

                this.StockData = data;

                console.log('[StockInfo::UpdateData]', this.Symbol, data);
            },
            //设置外部共享的股票数据类
            SetJSStock: function (jsStock) {
                this.JSStock = jsStock;
            },
            //股票代码编辑框切换股票事件
            OnChangeSymbol: function (symbol) 
            {
                this.SetSymbol(symbol);
                if (this.ChageSymbolCallback) this.ChageSymbolCallback(symbol);
            },

            SetChangeSymbolCallback: function (func) {
                this.ChangeSymbolCallback = func;
            },

            //切换股票代码
            SetSymbol: function (symbol) 
            {
                if (this.Symbol == symbol) return;

                this.Symbol=symbol;
                this.InitalStock();
                if (!this.IsShareStock) this.JSStock.RequestData();
                this.OnSize();
            },

            OnSize:function()   //动态调整UI
            {
                var stockInfo=this.$refs.stockinfo;
                var width=stockInfo.offsetWidth;
                const MAX_CELL_WIDTH=100;    //最小宽度
                console.log('[StockInfo::OnSize]', width);

                const CELL_WIDTH_RATE=
                [
                    1.5, 
                    1.5, 
                    1,
                    1,
                    1.25,
                    1,
                    1.2,
                    1,
                    1
                ]; //每个UI的宽度比例
                var sumRate=0;
                for(var i=0;i<CELL_WIDTH_RATE.length;++i) sumRate+=CELL_WIDTH_RATE[i];

                const LEFT_SPACE=20;   //左边留白
                var cellWidth=(width-LEFT_SPACE)/sumRate;
                var cellStyle=[];
                if (cellWidth>=MAX_CELL_WIDTH)
                {
                    for(var i=0, left=LEFT_SPACE;i<CELL_WIDTH_RATE.length;++i)
                    {
                        var itemWidth=CELL_WIDTH_RATE[i]*cellWidth;
                        if (parseInt(left+itemWidth)>width) cellStyle.push({width:itemWidth+'px', display:'none'});
                        else cellStyle.push({left:LEFT_SPACE+'px',width:(itemWidth-4)+'px'});
                        left+=itemWidth;
                    }
                }
                else
                {
                    cellStyle=DefaultData.GetCellStyle();
                    cellWidth=MAX_CELL_WIDTH;
                    var showCount=0;
                    for(var i=0,left=LEFT_SPACE;i<CELL_WIDTH_RATE.length;++i,++showCount)
                    {
                        var itemWidth=CELL_WIDTH_RATE[i]*cellWidth;
                        if (left+itemWidth>width) break;
                        left+=itemWidth;
                    }
                    console.log(`[StockInfo::OnSize] showCont=${showCount}`);

                    if (showCount>0)
                    {
                        sumRate=0;
                        for(var i=0;i<showCount;++i) sumRate+=CELL_WIDTH_RATE[i];
                        var cellWidth=(width-LEFT_SPACE)/sumRate;   //对现有的显示字段宽度自动调整下

                        for(var i=0, left=LEFT_SPACE;i<CELL_WIDTH_RATE.length && i<showCount;++i)
                        {
                            var itemWidth=CELL_WIDTH_RATE[i]*cellWidth;
                            cellStyle[i]={left:LEFT_SPACE+'px', width:(itemWidth-4)+'px'};
                            left+=itemWidth;
                        }
                    }
                }
                
                console.log('[StockInfo::OnSize]', cellStyle);
                this.CellStyle=cellStyle;
            }
        }
    }
</script>

<style scoped lang="scss">
    $border: 1px solid #e1ecf2;

    * {
        font: 14px/normal "Microsoft Yahei";
        color: #666;
        padding: 0;
        margin: 0;
    }

    .PriceUp {
        color: #ee1515 !important;
    }

    .PriceDown {
        color: #199e00 !important;
    }

    .PriceNull {
        color: inherit;
    }

    .topWrap {
        background-color: #eee;
        height: 47px;
        padding-top: 15px;
        padding-bottom: 12px;

        .stockInfo,
        .priceInfo,
        .otherInfo {
            display: inline-block;
            position: relative;
        }
    }

    .topWrap .otherInfo div {
        line-height: 1;
    }

    .topWrap .stockInfo {
        box-sizing: border-box;
        .codeInfo {
            position: relative;
            height: 24px;
            z-index: 333;

            .code {
                font-size: 18px;
                line-height: 1;
                color: #333;
                margin-right: 15px;
            }

            .icon-bianji {
                color: #217cd9;
                font-size: 18px;
                cursor: pointer;
            }

            .editSymbol {
                height: 24px;
                width: 94px;
                box-sizing: border-box;
                padding-left: 5px;
                padding-top: 2px;
                border: 1px solid #999;
                background-color: #fff;
                position: absolute;
                top: 0;
                left: 0;

                input {
                    border: none;
                    width: 67px;
                }

                .icon-close {
                    font-size: 14px;
                }
            }

            .symbolList {
                position: absolute;
                top: 24px;
                left: 0;
                width: 169px;
                border: 1px solid #999;
                background-color: #fff;

                >li {
                    padding: 0 8px;
                    line-height: 24px;
                    cursor: pointer;

                    .symbol {
                        margin-right: 10px;
                    }
                }

                >li:hover {
                    background-color: #217cd9;

                    >span {
                        color: #fff;
                    }
                }
            }
        }
    }

    .stockInfo .stockName {
        font-size: 20px;
        line-height: 1;
        color: #333;
        margin-bottom: 4px;
    }

    .priceInfo .priceCurrentNum {
        font-size: 18px;
    }

    .priceInfo .priceCurrent {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .priceInfo .priceCurrent .riseNum {
        flex-grow: 1;
    }

    .priceInfo .priceCurrent .risePrecent {
        flex-grow: 2;
    }

    .topWrap .otherInfo ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .topWrap .otherInfo li {
        flex-grow: 1;
    }

</style>