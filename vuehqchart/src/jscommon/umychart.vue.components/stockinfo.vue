<template>
    <div id="stockinfo" class="topWrap clearfix" ref='stockinfo'>
        <div class="stockInfo" :style='CellStyle[0]'>
            <p class="stockName">
                <span class='nameText'>{{StockData.Name.Text}}</span>
                <span title='融资融券标的' v-if='StockData.IsMargin'>
                    <svg class="symbolIkcon iconStockinfo" aria-hidden="true">
                        <use xlink:href="#icon-margin"></use>
                    </svg>
                </span>
                <span title='沪港通标的' v-if='StockData.IsSHHK'>
                    <svg class="symbolIkcon iconStockinfo" aria-hidden="true">
                        <use xlink:href="#icon-shhk"></use>
                    </svg>
                </span>
                <span :title='"AH股\n港股："+StockData.HK.Symbol' v-if='StockData.IsHK'>
                    <svg class="symbolIkcon iconStockinfo" aria-hidden="true">
                        <use xlink:href="#icon-hk"></use>
                    </svg>
                </span>
                <span :title='科创板' v-if='IsStockStar'>
                    <svg class="symbolIkcon iconStockinfo" aria-hidden="true">
                        <use xlink:href="#icon-stockStar"></use>
                    </svg>
                </span>
            </p>
            <div class="codeInfo">
                <span class="code">{{Symbol}}</span>
                <button class="searchBtn" v-if="IsShow.IconStyle" @click='GoSearch'>股票查询</button>
                <button class="cancelBtn" v-if="!IsShow.IconStyle" @click='CancelSearch'>取消</button>
                <div class="editSymbol" v-show='IsShow.SearchSymbol'>
                    <SearchSymbol ref="mySymbol" @inputValue='OnChangeSymbol'></SearchSymbol>
                </div>
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
            <div class="change" v-if='IsIndex==false?true:false'>换手：<span
                    :class='StockData.Excahngerate.Color'>{{StockData.Excahngerate.Text}}</span></div>
            <div class="change" v-if='IsIndex==true?true:false'>昨收：<span>{{StockData.YClose.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[4]'>
            <div class="num">成交额：<span>{{StockData.Amount.Text}}</span></div>
            <div class="totalValue">成交量：<span>{{StockData.Vol.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[5]'>
            <div class="pe" v-if='IsIndex==false?true:false'>PE：<span>{{StockData.Pe.Text}}</span></div>
            <div class="roe" v-if='IsIndex==false?true:false'>ROE：<span
                    :class='StockData.Roe.Color'>{{StockData.Roe.Text}}</span></div>
            <div class="change" v-if='IsIndex==true?true:false'>上涨家数：<span>{{StockData.Up.Text}}</span></div>
            <div class="change" v-if='IsIndex==true?true:false'>下跌家数：<span>{{StockData.Down.Text}}</span></div>
        </div>
        <div class='otherInfo' :style='CellStyle[6]'>
            <div class="marketV" v-if='IsIndex==true?true:false'>平盘：<span>{{StockData.Unchanged.Text}}</span></div>
            <div class="marketV" v-if='IsIndex==false?true:false'>总市值：<span>{{StockData.MarketV.Text}}</span></div>
            <div class="flowMarketV" v-if='IsIndex==false?true:false'>流通市值：<span>{{StockData.FlowMarketV.Text}}</span>
            </div>
        </div>
        <div class='otherInfo' :style='CellStyle[7]'>
            <div class="eps" v-if='IsIndex==false?true:false'>EPS：<span>{{StockData.Eps.Text}}</span></div>
            <div class="scrollEPS" v-if='IsIndex==false?true:false'>EPS(动)：<span>{{StockData.ScrollEPS.Text}}</span>
            </div>
        </div>
        <div class='otherInfo' :style='CellStyle[8]'>
            <div class="pb" v-if='IsIndex==false?true:false'>PB：<span>{{StockData.Pb.Text}}</span></div>
            <div class="amplitude" v-if='IsIndex==false?true:false'>振幅：<span>{{StockData.Amplitude.Text}}</span></div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import JSCommon from '../umychart.vue/umychart.vue.js'
    import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'
    import SearchSymbol from './searchsymbol.vue'
    import '../umychart.resource/font/fontSymbol.js'
    import '../umychart.resource/font/fontSymbol.css'

    function DefaultData() {

    }

    DefaultData.GetStockData = function () //数据默认显示值
    {
        const data =
        {
            Name: { Text: '' },
            Price: { Text: '', Color: 'PriceNull' },
            RiseFallPrice: { Text: '', Color: 'PriceNull' },
            Increase: { Text: '', Color: 'PriceNull' },
            High: { Text: '', Color: 'PriceNull' },
            Low: { Text: '', Color: 'PriceNull' },
            Open: { Text: '', Color: 'PriceNull' },
            YClose: { Text: '' },

            Excahngerate: { Text: '', Color: 'PriceNull' },
            Amount: { Text: '' }, Vol: { Text: '' },
            Pe: { Text: '' }, Roe: { Text: '' },
            MarketV: { Text: '' }, FlowMarketV: { Text: '' },
            Eps: { Text: '' }, ScrollEPS: { Text: '' },
            Pb: { Text: '' }, Amplitude: { Text: '' },

            //指数才有
            Down: { Text: '' }, //上涨
            Up: { Text: '' },   //下跌
            Unchanged: { Text: '' },   //平盘
            Stop: { Text: '' },         //停牌

            HK:{Symbol: "", Name: ""},
            IsMargin:false,     //融资融券
            IsSHHK:false,       //沪港通
            IsHK:false,         //港股
        };

        return data;
    }

    DefaultData.GetCellStyle = function () {
        let data =
            [
                { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' },
                { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' },
                { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' }, { left: 0, width: 0, display: 'none' }
            ];  //默认都不显示

        return data;
    }

    export default {
        JSCommonStock: JSCommonStock,
        JSCommon: JSCommon,

        name: 'StockInfo',
        props:
            [
                'IsShareStock',     //是否共享使用一个Stock类,
                'DefaultSymbol',    //默认股票
            ],
        components: { SearchSymbol },
        data() {
            let data =
            {
                Symbol: '600000.sh',
                ID: JSCommon.JSChart.CreateGuid(),
                JSStock: null,
                ChangeSymbolCallback: null, //股票代码修改回调事件
                StockData: DefaultData.GetStockData(),
                CellStyle: DefaultData.GetCellStyle(),
                WrapWidth: 1366,
                IsIndex: false,            //是否是指数
                IsShow: {
                    SearchSymbol: false,
                    IconStyle: true
                },
                IsStockStar:false
            }

            return data;
        },
        watch:
        {
            /*
            Symbol: function (newValue, oldValue) 
            {

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
            */
        },
        mounted() {
            console.log(`[StockInfo::mounted] IsShareStock=${this.IsShareStock} ID=${this.ID}`);
            if (this.IsShareStock == true || this.IsShareStock == 'true')    //外部调用SetJSStock()设置， 内部不创建, 请求和订阅 都由外部调用
            {

            }
            else {
                //不共享的JSStock, 直接创建->订阅->请求数据
                this.JSStock = JSCommonStock.JSStockInit();
                this.InitalStock();
                this.JSStock.RequestData();
            }

            this.OnSize();

            var self = this;
            document.addEventListener('click', (e) => {
                //弹出菜单 在其他区域点击 自动隐藏
                if (!$('.codeInfo').is(e.target) && $('.codeInfo').has(e.target).length === 0)
                    self.CancelSearch();
            });

        },
        created() {
            if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol; //默认股票

            this.IsIndex = this.IsSHSZIndex();  //初始判断是否是指数
            console.log('::created IsIndex', this.IsIndex);
            this.IsStockStar = this.IsSHStockSTAR();
        },
        methods: {
            GoSearch() {
                this.IsShow.SearchSymbol = true;
                this.IsShow.IconStyle = false;
                this.$refs.mySymbol.DeletSymbel();
            },
            
            CancelSearch() {
                this.IsShow.SearchSymbol = false;
                this.IsShow.IconStyle = true;
            },
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
                        JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE,
                        JSCommonStock.STOCK_FIELD_NAME.EVENTS
                    ];

                const indexField =
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
                        JSCommonStock.STOCK_FIELD_NAME.AMOUNT,
                        JSCommonStock.STOCK_FIELD_NAME.VOL,
                        JSCommonStock.STOCK_FIELD_NAME.INDEXTOP,
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
            IsSHStockSTAR: function(){
                return JSCommon.MARKET_SUFFIX_NAME.IsSHStockSTAR(this.Symbol);
            },
            GetHeight() {
                return $('#stockinfo').outerHeight(true) + 1;
            },
            //数据到达
            UpdateData: function (id, arySymbol, dataType, jsStock) {
                console.log('[StockInfo::UpdateData] ', id, arySymbol, dataType, jsStock, this.ID);
                if (id != this.ID) return;
               
                let isIndex = this.IsSHSZIndex();
                let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
                if (arySymbol.indexOf(this.Symbol) < 0) return;

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
                data.Amount = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMOUNT), Text: '--' };
                data.Vol = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.VOL), Text: '--' };
                let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);
                data.YClose = { Value: yClose, Text: '--' };

                data.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Price.Value, 2);  //保留2位小数
                data.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Price.Value, yClose); //价格颜色判断

                if (data.RiseFallPrice.Value == 0) data.RiseFallPrice.Text = '0.00';
                else data.RiseFallPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.RiseFallPrice.Value, 2);
                data.RiseFallPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.RiseFallPrice.Value, 0);

                if (data.Increase.Value == 0) data.Increase.Text = '0.00%';
                else data.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase.Value, 2) + '%';
                data.Increase.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Increase.Value, 0);

                data.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High.Value, 2);
                data.High.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.High.Value, yClose);

                data.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low.Value, 2);
                data.Low.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Low.Value, yClose);

                data.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open.Value, 2);
                data.Open.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Open.Value, yClose);

                data.YClose.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.YClose.Value, 2);

                data.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount.Value, 2);
                data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value, 2);

                if (isIndex) 
                {
                    //指数才有
                    data.Down = { Text: '' }; //上涨
                    data.Up = { Text: '' };   //下跌
                    data.Unchanged = { Text: '' }; //平盘
                    data.Stop = { Text: '' };
                    let indexTop = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.INDEXTOP);
                    if (indexTop) 
                    {
                        data.Down.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Down, 0);
                        data.Up.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Up, 0);
                        data.Unchanged.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Unchanged, 0);
                        data.Stop.Text = JSCommon.IFrameSplitOperator.FormatValueString(indexTop.Stop, 0);
                    }
                } 
                else 
                {
                    data.Excahngerate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EXCHANGE_RATE), Color: '', Text: '--' };
                    data.Pe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PE), Text: '--' };
                    data.MarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MARKET_VALUE), Text: '--' };
                    data.FlowMarketV = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE), Text: '--' };
                    data.Eps = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING), Text: '--' };
                    data.ScrollEPS = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.FINANCE_EPS), Text: '--' };
                    data.Roe = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.ROE), Color: '', Text: '--' };
                    data.Pb = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.PB), Text: '--' };
                    data.Amplitude = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.AMPLITUDE), Text: '--' };

                    data.Roe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Roe.Value, 2);
                    data.Roe.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Roe.Value, yClose);
                    data.Excahngerate.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Excahngerate.Value, 2);
                    data.Excahngerate.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Excahngerate.Value, yClose);
                    data.MarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MarketV.Value, 0);
                    data.FlowMarketV.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.FlowMarketV.Value, 0);
                    data.Pe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pe.Value, 2);
                    data.Eps.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Eps.Value, 2);
                    data.ScrollEPS.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.ScrollEPS.Value, 2);
                    data.Pb.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pb.Value, 2);
                    data.Amplitude.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amplitude.Value, 2);

                    let events=read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EVENTS);
                    if (events)
                    {
                        console.log('[StockInfo::UpdateData] events data ', this.Symbol, events);
                        data.HK = events.HK;
                        data.IsMargin=events.IsMargin; ////是否是融资融券标题
                        data.IsHK=events.IsHK;  //是否有港股
                        data.IsSHHK=events.IsSHHK;  //沪港通
                        

                    }
                }

                this.StockData = data;

                console.log('[StockInfo::UpdateData]', this.Symbol, data);
            },
            //设置外部共享的股票数据类
            SetJSStock: function (jsStock) {
                this.JSStock = jsStock;
            },
            //股票代码编辑框切换股票事件
            OnChangeSymbol: function (symbol) {
                this.IsShow.SearchSymbol = false;
                this.IsShow.IconStyle = true;
                this.SetSymbol(symbol);
                if (this.ChangeSymbolCallback) this.ChangeSymbolCallback(symbol);
            },

            SetChangeSymbolCallback: function (func) {
                this.ChangeSymbolCallback = func;
            },

            //切换股票代码
            SetSymbol: function (symbol) {
                if (this.Symbol == symbol) return;

                this.Symbol = symbol;
                this.IsStockStar = this.IsSHStockSTAR();
                //UI数据初始化　确保每个字段都有 防止报错
                this.StockData = DefaultData.GetStockData();
                this.CellStyle = DefaultData.GetCellStyle();
                this.IsIndex = this.IsSHSZIndex();
                this.InitalStock();
                if (!this.IsShareStock) this.JSStock.RequestData();
                this.OnSize();
            },

            OnSize: function ()   //动态调整UI
            {
                var stockInfo = this.$refs.stockinfo;
                var width = stockInfo.offsetWidth;
                const MAX_CELL_WIDTH = 100;    //最小宽度
                console.log('[StockInfo::OnSize]', width);

                const CELL_WIDTH_RATE =
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
                var sumRate = 0;
                for (var i = 0; i < CELL_WIDTH_RATE.length; ++i) sumRate += CELL_WIDTH_RATE[i];

                const LEFT_SPACE = 20;   //左边留白
                var cellWidth = (width - LEFT_SPACE) / sumRate;
                var cellStyle = [];
                if (cellWidth >= MAX_CELL_WIDTH) {
                    for (var i = 0, left = LEFT_SPACE; i < CELL_WIDTH_RATE.length; ++i) {
                        var itemWidth = CELL_WIDTH_RATE[i] * cellWidth;
                        if (parseInt(left + itemWidth) > width) cellStyle.push({ width: itemWidth + 'px', display: 'none' });
                        else cellStyle.push({ left: LEFT_SPACE + 'px', width: (itemWidth - 4) + 'px' });
                        left += itemWidth;
                    }
                }
                else {
                    cellStyle = DefaultData.GetCellStyle();
                    cellWidth = MAX_CELL_WIDTH;
                    var showCount = 0;
                    for (var i = 0, left = LEFT_SPACE; i < CELL_WIDTH_RATE.length; ++i, ++showCount) {
                        var itemWidth = CELL_WIDTH_RATE[i] * cellWidth;
                        if (left + itemWidth > width) break;
                        left += itemWidth;
                    }
                    console.log(`[StockInfo::OnSize] showCont=${showCount}`);

                    if (showCount > 0) {
                        sumRate = 0;
                        for (var i = 0; i < showCount; ++i) sumRate += CELL_WIDTH_RATE[i];
                        var cellWidth = (width - LEFT_SPACE) / sumRate;   //对现有的显示字段宽度自动调整下

                        for (var i = 0, left = LEFT_SPACE; i < CELL_WIDTH_RATE.length && i < showCount; ++i) {
                            var itemWidth = CELL_WIDTH_RATE[i] * cellWidth;
                            cellStyle[i] = { left: LEFT_SPACE + 'px', width: (itemWidth - 4) + 'px' };
                            left += itemWidth;
                        }
                    }
                }

                console.log('[StockInfo::OnSize]', cellStyle);
                this.CellStyle = cellStyle;
            }
        }
    }
</script>

<style scoped lang="less">
    @border: 1px solid #e1ecf2;

    * {
        font: 14px/normal "Microsoft Yahei";
        padding: 0;
        margin: 0;
    }
    html,body {color: #666;}
    
    .PriceUp,
    .PriceUp>span {
        color: #ee1515 !important;
    }

    .PriceDown,
    .PriceDown>span {
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
        .stockInfo{
            white-space: nowrap;
            /* overflow: hidden; */
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
            z-index: 33333333;

            .code {
                font-size: 18px;
                line-height: 1;
                color: #333;
                margin-right: 15px;
            }

            .searchBtn {
                position: absolute;
                width: 55px;
                left: 90px;
                top: 0px;
                height: 22px;
                line-height: 22px;
                font-size: 12px;
                background: #2061a5;
                border: none;
                color: #fff;
            }

            .cancelBtn {
                position: absolute;
                width: 59px;
                left: 139px;
                top: 0px;
                height: 24px;
                font-size: 14px;
                background: #2061a5;
                border: none;
                color: #fff;
                z-index: 9999;
            }

            .icon-style {
                color: #217cd9;
                font-size: 18px;
                cursor: pointer;
                position: relative;
                left: -15px;
            }

            .icon-change {
                color: #217cd9;
                font-size: 18px;
                cursor: pointer;
                position: relative;
                left: 26px;
            }

            .editSymbol {
                width: 169px;
                box-sizing: border-box;
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 999999;
                /* input {
                    border: none;
                    width: 67px;
                }

                .icon-close {
                    font-size: 14px;
                } */
            }

           
        }
    }

    .stockInfo .stockName {
        height: 24px;
        color: #333;
        .nameText{
            display:inline-block;
            font-size: 20px;
            line-height:1;
            padding-bottom: 2px;
        }
        .iconStockinfo {
            font-size: 22px;
        }
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