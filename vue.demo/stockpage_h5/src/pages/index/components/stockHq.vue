<template>
    <div class="hqWrap">
        <!--页面头部-->
        <div class="headTitle">
            <div class="name-box">
                <div class="nameWrap"><span class="stockName">{{StockData.Name.Text}}</span><span class="flagBox rFlag" v-show='StockData.IsMargin'>融</span><span
                        class="flagBox tFlag" v-show='StockData.IsSHHK'>通</span></div>
                <div class="exchangeInfo"><span class="date">{{StockData.Date}}</span><span class="time">{{StockData.Time}}</span></div>
            </div>
        </div>
        <!--价格部分-->
        <div class="exchangeData" id="main">
            <div class="clear">
                <div class="priceCurrent">
                    <p class="priceCurrentNum" :class='StockData.Price.Color'>{{StockData.Price.Text}}</p>
                    <p class="riseInfo" :class='StockData.RiseFallPrice.Color'><span class="riseNum">{{StockData.RiseFallPrice.Text}}</span><span class="risePrecent">{{StockData.Increase.Text}}</span></p>
                </div>
                <div class="priceHL">
                    <p class="high">高<span :class='StockData.High.Color'>{{StockData.High.Text}}</span></p>
                    <p class="low">低<span :class='StockData.Low.Color'>{{StockData.Low.Text}}</span></p>
                </div>
                <div class="priceOpen">
                    <p class="open">开<span :class='StockData.Open.Color'>{{StockData.Open.Text}}</span></p>
                    <p class="change" v-if='!IsIndex'>换<span :class='StockData.Excahngerate.Color'>{{StockData.Excahngerate.Text}}</span></p>
                    <p class="change" v-if='IsIndex'>昨收<span>{{StockData.YClose.Text}}</span></p>
                </div>
                <div class="priceAmount">
                    <p class="num">额<span>{{StockData.Amount.Text}}</span></p>
                    <p class="totalValue">量<span>{{StockData.Vol.Text}}</span></p>
                </div>
            </div>
            <table :class="[IsIndex ?'indexExchangeInfoT':'exchangeInfoT']" v-if='!IsIndex && ExchangeInfoTShow'>
                <tbody>
                    <tr>
                        <td>PE</td>
                        <td><div class="pe">{{StockData.Pe.Text}}</div></td>
                        <td class="clear"><span class="name">总市值</span><span class="marketV">{{StockData.MarketV.Text}}</span></td>
                        <td>流通市值</td>
                        <td><div class="flowMarketV">{{StockData.FlowMarketV.Text}}</div></td>
                    </tr>
                    <tr>
                        <td>EPS</td>
                        <td><div class="eps">{{StockData.Eps.Text}}</div></td>
                        <td class="clear"><span class="name">滚动EPS</span><span class="scrollEPS">{{StockData.ScrollEPS.Text}}</span></td>
                        <td>ROE</td>
                        <td><div class="roe">{{StockData.Roe.Text}}</div></td>
                    </tr>
                    <tr>
                        <td>PB</td>
                        <td><span class="pb">{{StockData.Pb.Text}}</span></td>
                        <td class="clear"><span class="name">振幅</span><span class="amplitude">{{StockData.Amplitude.Text}}</span></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table :class="[IsIndex ?'indexExchangeInfoT':'exchangeInfoT']" v-if='IsIndex && ExchangeInfoTShow'>
              <tbody>
                  <tr>
                      <td>上涨家数</td>
                      <td><span class="pe">{{StockData.Up.Text}}</span></td>
                      <td>上涨家数</td>
                      <td><span class="flowMarketV">{{StockData.Down.Text}}</span></td>
                  </tr>
                  <tr>
                      <td>平盘</td>
                      <td><span class="eps">{{StockData.Unchanged.Text}}</span></td>
                      <td></td>
                      <td></td>
                  </tr>
              </tbody>
            </table>
            <p class="shrinkWrap" @click='ShowOrHideExchangeInfoT'><img class="shrinkBtn" :class='CollapseImgClass' src="../assets/images/shrink_icon.png" alt=""></p>
        </div>
        <!--k线部分-->
        <div class="tabs kLineTabs blockBg">
            <p class="tabsTitle"><span v-for='(item,index) in PeriodObj.TabTextAry' :key='index' :class='{active : PeriodObj.TabTextIndex == index}' @click='ChangeChartTab(index)'>{{item}}</span>
                <select v-model='MinutePeriod.minutePeriod' @click="ChangeMinuteIndex" :class='{selectActive : PeriodObj.TabTextIndex == 6}'>
                    <option v-for='(minuteItem,ind) in MinutePeriod.SelectOptionList' :value="minuteItem.Value" :key='ind'>{{minuteItem.Text}}</option>
                </select>
            </p>
            <!-- 分时图部分 -->
            <div class="clear minuteWrap">
                <div id="minuteChart" v-show='Minute.IsShow'></div>
                <div id="minuteFiveDaychart" v-show='FiveMinute.IsShow'></div>
                <div id="kline" v-show='Kline.IsShow'></div>

                <!-- 分时图右侧内容 -->
                <div class="rightMinute" v-show='!IsIndex && Minute.IsShow'>
                    <ul class="minute-tab clear tabsTitle">
                        <li class="tableSell active-minute" @click='ChangeMinuteTab(0)' :class='{active:MinuteMenuIndex == 0}'>五档</li>
                        <li class="tableBuy" @click='ChangeMinuteTab(1)' :class='{active:MinuteMenuIndex == 1}'>明细</li>
                    </ul>
                    <div class="tabsContent">
                        <div id="minuteFive" class="tableMinuteContent" v-show='MinuteMenuIndex == 0'>
                            <table class="tableOne">
                                <!-- 卖五 -->
                                <tbody>
                                    <tr v-for='item in StockData.SellerFive'>
                                        <td>{{item.name}}</td>
                                        <td class="color-change" v-bind:class="item.color">{{item.dataPrice}}</td>
                                        <td>{{item.dataVol}}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="tableTwo">
                                <!-- 买五 -->
                                <tbody>
                                    <tr v-for='item in StockData.BuyerFive'>
                                        <td>{{item.name}}</td>
                                        <td class="color-change" v-bind:class="item.color">{{item.dataPrice}}</td>
                                        <td>{{item.dataVol}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="minute" class="tableMinuteContent" v-show='MinuteMenuIndex == 1'>
                            <table class="tableInfo">
                                <tbody>
                                    <tr v-for='item in StockData.Dealer'>
                                        <td>{{item.timer}}</td>
                                        <td class="color-change symbolAve" v-bind:class="item.color">{{item.dataPrice}}</td>
                                        <td>{{item.dataVol}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <!-- k线图右侧内容 -->
                <div class="phoneRight" v-show='!IsIndex && RightMenu.IsShow'>
                    <ul class="ulOne">
                        <li v-for='item in RightMenu.List' :key="item.ID" @click='ChangeKlinRight(item)' class="noRight" :class='{active:item==RightMenu.Selected}'>{{item.Name}}</li>
                    </ul>
                </div>

                <!-- k线图指标 -->
                <div class="indexWrap" v-show='Kline.IsShow'><span v-for='item in IndexMenu' :key="item.ID" @click='ChangeKlinIndex(item)' class="indexItem" :class='{active : item.Selected == true }'>{{item.Name}}</span></div>

            </div>
        </div>
        <!--新闻部分-->
        <StockHqNews class="link-newslist" ref="stockHqNews"></StockHqNews>
    </div>
</template>

<script>
    import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
    import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
    import HQChart from 'hqchart'
    //import JSCommon from 'hqchart/src/jscommon/umychart.vue/umychart.vue.js'
    //import JSCommonStock from 'hqchart/src/jscommon/umychart.vue/umychart.stock.vue.js'
    import StockHqNews from './stockHqNews.vue'
    import Tools from "../../../services/tools"
    import urlObj from "../../../utils/urlObj"

    import $ from 'jquery'

    var JSCommon=HQChart.Chart;
    var JSCommonStock=HQChart.Stock;

    function DefaultData() {}

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

            SellerFive:[],
            BuyerFive:[],
            Dealer:[]
        };

        return data;
    }

    DefaultData.GetMinuteOption = function(symbol)
    {
        let data = 
        {
            Type: '分钟走势图', //走势图
            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据

            IsShowRightMenu: false,     //禁用右键菜单
            CorssCursorTouchEnd:true,   //手势离开屏幕 十字光标自动消失
            EnableScrollUpDown:true,    //允许上下拖动图形
            DayCount: 1,

            Border: //边框
            {
                Left: 1, //左边间距
                Right: 1, //右边间距
                Top: 20,
                Bottom: 1
            },

            KLineTitle: //标题设置
            {
                IsShowName: false, //不显示股票名称
                IsShowSettingInfo: false, //不显示周期/复权
            },

            Frame: //子框架设置,刻度小数位数设置
            [
                { SplitCount: 5, StringFormat: 0 },
                { SplitCount: 3, StringFormat: 0 }
            ],

            ExtendChart:    //扩展图形
            [
                {Name:'MinuteTooltip' }  //手机端tooltip
            ],
        };
        return data;
    }

    DefaultData.GetFiveDayMinuteOption = function(symbol)
    {
        let data = 
        {
            Type: '分钟走势图',
            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据

            IsShowRightMenu: false, //右键菜单
            DayCount: 5,  //5日
            CorssCursorTouchEnd:true,   //手势离开屏幕 十字光标自动消失
            EnableScrollUpDown:true,    //允许上下拖动图形

            Border: //边框
            {
                Left: 1, //左边间距
                Right: 1, //右边间距
                Top: 20,
                Bottom: 20
            },

            KLineTitle: //标题设置
            {
                IsShowName: false, //不显示股票名称
                IsShowSettingInfo: false, //不显示周期/复权
            },

            Frame: //子框架设置,刻度小数位数设置
            [
                { SplitCount: 5, StringFormat: 1 },
                { SplitCount: 3, StringFormat: 1 }
            ],

            ExtendChart:    //扩展图形
            [
                {Name:'MinuteTooltip' }  //手机端tooltip
            ],
        };
        return data;
    }

    DefaultData.GetKlineOption = function(symbol)
    {
        let data = 
        {
            Type: '历史K线图',
            Windows: 
            [
                { Index: "均线",Modify:false,Change:false},
                { Index: "VOL",Modify:false,Change:false },
            ], //窗口指标

            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据

            CorssCursorTouchEnd:true,   //手势离开屏幕 十字光标自动消失
            EnableScrollUpDown:true,    //允许上下拖动图形
            IsShowRightMenu: false,     //右键菜单

            KLine: 
            {
                DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 1, //复权 0 不复权 1 前复权 2 后复权
                Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
                MaxReqeustDataCount: 1000, //日线数据最近1000天
                MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
                PageSize: 50, //一屏显示多少数据
                IsShowTooltip: false //是否显示K线提示信息
            },

            KLineTitle: //标题设置
            {
                IsShowName: false, //不显示股票名称
                IsShowSettingInfo: false //不显示周期/复权
            },

            Border: //边框
            {
                Left: 0, //左边间距
                Right: 1, //右边间距
                Top: 20
            },

            Frame: //子框架设置
            [
                { SplitCount: 3, StringFormat: 0 },
                { SplitCount: 3, StringFormat: 0 },
                { SplitCount: 3, StringFormat: 0 },
                { SplitCount: 3, StringFormat: 0 }
            ],

            ExtendChart:    //扩展图形
            [
                {Name:'KLineTooltip' }  //手机端tooltip
            ],
        };
        return data;
    }

    export default
    {
        name:'HQChartDemo',
        data()
        {
            let data=
            {
                ExchangeInfoTShow:false,
                CollapseImgClass:'',
                MinuteMenuIndex:0,
                IsIndex:false,
                Symbol:'600000.sh', //399006.sz
                JSStock:null,
                ID: JSCommon.JSChart.CreateGuid(),
                StockData: DefaultData.GetStockData(),

                Minute:         //分时
                {
                    JSChart:null,
                    IsShow:true,
                    Option:null
                },

                FiveMinute:     //多日分时
                {
                    JSChart:null,
                    IsShow:false,
                    Option:null
                },

                Kline:          //K线图
                {
                    JSChart:null,
                    IsShow:false,
                    Option:null
                },

                IndexMenu:      //指标Tab
                [
                    {Name:'KDJ', ID: 'KDJ', WindowsID:1, Selected:false },
                    {Name:'MACD', ID: 'MACD', WindowsID:1, Selected:false },
                    {Name:'RSI', ID: 'RSI', WindowsID:1, Selected:false },
                    {Name:'BOLL', ID: 'BOLL', WindowsID:0, Selected:false },
                    {Name:'VOL', ID: 'VOL', WindowsID:1, Selected:false },
                    {Name:'均线', ID: '均线', WindowsID:0, Selected:false },
                ],

                RightMenu:  //复权
                {
                    List:[ {Name:'不复权', ID:0 }, {Name:'前复权', ID:1 }, {Name:'后复权', ID:2 } ],
                    IsShow:false,
                    Selected:null
                },

                PeriodObj:{  //周期数据
                  TabTextAry:['分时','五日','日线','周线','月线'],
                  TabTextIndex:0
                },
                MinutePeriod:{   //分钟周期
                  SelectOptionList:[
                      {
                          Text:'1分钟',
                          Value:4
                      },
                      {
                          Text:'5分钟',
                          Value:5
                      },
                      {
                          Text:'15分钟',
                          Value:6
                      },
                      {
                          Text:'30分钟',
                          Value:7
                      },
                      {
                          Text:'60分钟',
                          Value:8
                      }
                  ],                  
                  minutePeriod:4,  //分钟周期
                },
                
                // KLineOption:null
            };

            return data;
        },

        components:{StockHqNews},

        created()
        {
            var symbol=Tools.getURLParams("symbol");
            if(symbol)
            {
                console.log(`[HQChartDemo::created] symbol=${symbol}`)
                this.Symbol = symbol;
            }

            this.IsIndex = this.IsSHSZIndex();  //初始判断是否是指数

            this.JSStock = JSCommonStock.JSStockInit();
            this.InitalStock();
            this.JSStock.RequestData();

            this.Minute.Option = DefaultData.GetMinuteOption(this.Symbol);
            this.FiveMinute.Option = DefaultData.GetFiveDayMinuteOption(this.Symbol);
            this.Kline.Option = DefaultData.GetKlineOption(this.Symbol);
        },

        mounted()
        {
            this.OnSize();
            window.onresize = ()=>
            {
                this.$refs.stockHqNews.OnSize();
                this.OnSize();
            };

            this.Minute.JSChart = JSCommon.JSChart.Init(document.getElementById('minuteChart'));
            this.Minute.JSChart.SetOption(this.Minute.Option);
        },
        computed: {
        minutePeriod() {
        　　　　return this.MinutePeriod.minutePeriod
        　　}
        },
        watch:{
            minutePeriod:function(value, oldValue){
                if(value == oldValue) return;
                this.Minute.IsShow = false;
                this.FiveMinute.IsShow = false;
                this.Kline.IsShow = true;
                this.RightMenu.IsShow=false;    //分钟K线没有复权
                this.OnSize();
                if(this.Kline.JSChart == null)
                {
                    this.Kline.JSChart = JSCommon.JSChart.Init(document.getElementById('kline'));
                    this.Kline.Option.KLine.Period = value;
                    this.Kline.JSChart.SetOption(this.Kline.Option);
                }else
                {
                    this.Kline.JSChart.ChangePeriod(value);
                }
            }
        },

        methods:
        {
            ChangeMinuteIndex() 
            {
                this.PeriodObj.TabTextIndex = 6;
            },

            OnSize()
            {
                var width = window.innerWidth;
                var chartHeight = 360;
                if(this.Minute.IsShow)
                {
                    var chartWidth = this.IsIndex ? width : width - $('.rightMinute').outerWidth(true);
                    $('#minuteChart').width(chartWidth);
                    $('#minuteChart').height(chartHeight);
                }else if(this.FiveMinute.IsShow)
                {
                    var chartWidth = width;
                    $('#minuteFiveDaychart').width(chartWidth);
                    $('#minuteFiveDaychart').height(chartHeight);
                }else if(this.Kline.IsShow)
                {
                    var chartWidth = width;
                    if (this.RightMenu.IsShow) chartWidth = this.IsIndex ? width : width - $('.phoneRight').outerWidth(true);
                    $('#kline').width(chartWidth);
                    $('#kline').height(chartHeight);
                    if (this.Kline.JSChart) this.Kline.JSChart.OnSize();
                }
            },

            //修改k线指标
            ChangeKlinIndex(item)
            {  
                if (!this.Kline.JSChart) return;
                
                this.Kline.JSChart.ChangeIndex(item.WindowsID,item.ID);
                this.UpdateIndexTab();
            },

            UpdateIndexTab()
            {
                if (!this.Kline.JSChart) return;

                this.IndexMenu.forEach((item)=>
                {
                    item.Selected=false;
                });

                var indexList=this.Kline.JSChart.GetIndexInfo();
                for(var i in indexList)
                {
                    var item=indexList[i];
                    for(var j in this.IndexMenu)
                    {
                        var menuItem=this.IndexMenu[j];
                        if (menuItem.ID==item.ID)
                        {
                            menuItem.Selected=true;
                            break;
                        }
                    }
                }
            },

            UpdateRightTab()
            {
                if (!this.Kline.JSChart) return;

                var right=this.Kline.JSChart.JSChartContainer.Right;
                for(var i in this.RightMenu.List)
                {
                    var item=this.RightMenu.List[i];
                    if (item.ID==right)
                    {
                        this.RightMenu.Selected=item;
                        break;
                    }
                }
            },

            //修改复权
            ChangeKlinRight(item)
            {  
                if(!this.Kline.JSChart) return;
                
                this.Kline.JSChart.ChangeRight(item.ID);
                this.UpdateRightTab();
            },

            ChangeChartTab(index)
            {
                this.PeriodObj.TabTextIndex = index;
                
                switch(index)
                {
                    case 0:  //分时图
                        this.Minute.IsShow = true;
                        this.FiveMinute.IsShow = false;
                        this.Kline.IsShow = false;
                        this.RightMenu.IsShow=false;
                        this.OnSize();
                        break;
                    case 1:  //5日分时图
                        this.Minute.IsShow = false;
                        this.FiveMinute.IsShow = true;
                        this.Kline.IsShow = false;
                        this.RightMenu.IsShow=false;
                        this.OnSize();
                        if(this.FiveMinute.JSChart == null)
                        {
                            this.FiveMinute.JSChart = JSCommon.JSChart.Init(document.getElementById('minuteFiveDaychart'));
                            this.FiveMinute.JSChart.SetOption(this.FiveMinute.Option);
                        }
                        break;
                    case 2:  //历史K线图
                    case 3:
                    case 4:
                        this.Minute.IsShow = false;
                        this.FiveMinute.IsShow = false;
                        this.Kline.IsShow = true;
                        this.RightMenu.IsShow=true;
                        this.OnSize();
                        if(this.Kline.JSChart == null)
                        {
                            this.Kline.JSChart = JSCommon.JSChart.Init(document.getElementById('kline'));
                            this.Kline.JSChart.SetOption(this.Kline.Option);
                        }
                        else
                        {
                            this.Kline.JSChart.ChangePeriod(index - 2);
                        }

                        this.UpdateIndexTab();
                        this.UpdateRightTab();
                        break;
                }
            },

            IsSHSZIndex () 
            {
                return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            },

            ShowOrHideExchangeInfoT(){
                this.ExchangeInfoTShow = !this.ExchangeInfoTShow;
                this.CollapseImgClass = this.ExchangeInfoTShow ? 'open' : '';
            },

            ChangeMinuteTab(index){
                this.MinuteMenuIndex = index;
            },

            UpdateData (id, arySymbol, dataType, jsStock) 
            {
                console.log('[StockInfo::UpdateData] ', id, arySymbol, dataType, jsStock, this.ID);
                if (id != this.ID) return;
               
                let isIndex = this.IsSHSZIndex();
                let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
                if (arySymbol.indexOf(this.Symbol) < 0) return;

                let data = {};    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}
                data.Name = { Text: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.NAME) };
                let date = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DATE);
                let time = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.TIME);
                if(date != null && time != null){
                    data.Date = date.toString().substring(4,6)+"-"+date.toString().substring(6,8);
                    if(time.toString().length == 5){
                        data.Time = 0 + time.toString().substring(0,1)+":"+time.toString().substring(1,3)+":"+time.toString().substring(3,5);
                    }else{
                        data.Time = time.toString().substring(0,2)+":"+time.toString().substring(2,4)+":"+time.toString().substring(4,6)
                    }
                }

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

                let SellFive = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.SELL5);
                let BuyFive = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BUY5);
                let Deal = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DEAL);
                //卖五
                if (SellFive && SellFive.length == 5) {
                    var str1 = [];
                    for (var i in SellFive) {
                        var dataN = SellFive[i];
                        var arr = ["卖五", "卖四", "卖三", "卖二", "卖一"];
                        str1.push({
                            name: arr[4 - i],
                            dataPrice: dataN.Price != null ? dataN.Price != 0 ? dataN.Price.toFixed(2) : '' : '--',
                            dataVol: dataN.Vol != 0 ? dataN.Vol : "",
                            color: JSCommon.IFrameSplitOperator.FormatValueColor(dataN.Price, yClose)
                        })
                    }
                    data.SellerFive = str1.reverse();
                }
                //买五
                if (BuyFive && BuyFive.length == 5) {
                    var str2 = [];
                    for (var i in BuyFive) {
                        var dataM = BuyFive[i];
                        var arr = ["买一", "买二", "买三", "买四", "买五"];
                        str2.push({
                            name: arr[i],
                            dataPrice: dataM.Price != null ? dataM.Price != 0 ? dataM.Price.toFixed(2) : '' : '--',
                            dataVol: dataM.Vol != 0 ? dataM.Vol : "",
                            color: JSCommon.IFrameSplitOperator.FormatValueColor(dataM.Price, yClose)
                        })
                    }
                    data.BuyerFive = str2;
                }
                //分笔
                if (Deal != undefined) {
                    var str3 = [];
                    for (var i in Deal) {
                        var item = Deal[i];
                        var timer = item.Time;
                        timer = timer.toString();
                        var timeStr, newTime;
                        if (timer.length == 5) {
                            timeStr = "0" + timer;
                        } else if (timer.length == 6) {
                            timeStr = timer;
                        }
                        newTime = timeStr.substring(0, 2) + ":" + timeStr.substring(2, 4);

                        str3.push({
                            timer: newTime,
                            dataPrice: item.Price != null ? item.Price != 0 ? item.Price.toFixed(2) : '' : '--',
                            dataVol: item.Vol != 0 ? item.Vol : '',
                            color: JSCommon.IFrameSplitOperator.FormatValueColor(item.Price, yClose)
                        })
                    }
                    data.Dealer = str3;
                }


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
            },

            InitalStock() 
            {
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
                        JSCommonStock.STOCK_FIELD_NAME.EVENTS,
                        JSCommonStock.STOCK_FIELD_NAME.SELL5,
                        JSCommonStock.STOCK_FIELD_NAME.BUY5,
                        JSCommonStock.STOCK_FIELD_NAME.DEAL,
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

            BackLastPage() 
            {
                history.go(-1);
            },

            goToBusiness() 
            {
                window.open(urlObj.htmlSimulateTrade + "?oprTypeIndex=0" + '&symbol=' + this.Symbol + '&symbolName=' + this.StockData.Name.Text, "_self");
            }
        }
    }

</script>

<style lang="less">
* {margin: 0; padding: 0;}
body,html {color: #333;}
body {background-color: #f7f7f7;}
html,body,div,a,img,table {-webkit-tap-highlight-color:transparent;}
div:active { background: transparent;}
a {text-decoration: none;}
ul,ol {list-style: none;}
.clear:after {content: " "; height: 0; display: block; overflow: hidden; clear: both;}
.upColor {color: #ee1515;}
.lowColor {color: #199e00; }
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

    //返回
.backWrap {
    padding: 0 4%;
    font-size: 1.5rem;
    .backIconWrap {
        display: inline-block;
        /*padding-right: 22px;*/
        height: 40px;
        width: 50px;
        line-height: 40px;
    }
}

.tabsTitle .selectActive option {
    color: #333333;
}

/*页面头部*/
.name-box{flex:1;text-align: center;position: relative;right:0; }
.headTitle {display:flex; height: 44px; box-sizing: border-box; padding-top: 4px;}
.nameWrap {text-align: center; line-height: 21px; font-family: "PingFangSC-Light";}
.stockName {/*font-family: "PingFang-SC-Heavy";*/ margin-right: 1.2%;}
.flagBox { width: 1.6%; height: 12px; border-radius: 2px; line-height: 12px; color: #fff; font-size: 0.786rem; text-align: center; margin-right: 1px;}
.rFlag { background-color: #f39800;}
.tFlag { background-color: #125fd9;}
.exchangeInfo { font-size: 0.714rem; color: #666; height: 15px; line-height: 15px; font-weight: bold; text-align: center;}
.exchangeInfo>span {margin-right: 1.3%; font-family: "PingFangSC-Light";}

.bodyBg {background-color: #f8f9fc;}
.blockBg {background: #fff; margin-top: 5px;}

/*价格部分*/
.exchangeData {padding: 0 2%; border-bottom: 1px solid #ececec; background-color: #fff; font-size: 1.3rem;}
.exchangeData .priceCurrent,.exchangeData .priceHL,.exchangeData .priceOpen,.exchangeData .priceAmount {float: left;}
.exchangeData .priceCurrent {width: 30%;}
.exchangeData .priceHL {width: 22%; box-sizing: border-box; padding-right: 2.3%;}
.exchangeData .priceOpen {width: 24.1%; box-sizing: border-box; padding-right: 2%;}
.exchangeData .priceAmount {width: 23.9%;}
.exchangeData .priceHL .low, .exchangeData .priceOpen .change, .exchangeData .priceAmount .totalValue { height: 20px; line-height: 20px;}
.exchangeData .priceHL span,.exchangeData .priceOpen span,.exchangeData .priceAmount span {float: right;}
.priceCurrent .priceCurrentNum {font-size: 2rem; padding-left: 1.4%; height: 29px; line-height: 29px;}
.priceCurrent .riseNum,.priceCurrent .risePrecent { font-size: 0.926rem; font-weight: bold; height: 18px; line-height: 18px;}
.priceCurrent .riseNum { margin-right: 11.4%;}
.priceHL .high,.priceOpen .open,.priceAmount .num { padding-top: 7px; height: 20px; line-height: 20px;}
.exchangeInfoT,.indexExchangeInfoT {width: 100%; border-collapse: collapse; border: none;}
.exchangeInfoT tr,
.indexExchangeInfoT tr {height: 1.6rem; line-height: 1.6rem;}
.exchangeInfoT tr>td { font-size: 1.3rem;}
/* .exchangeInfoT .pe {box-sizing: border-box;width: 10%; text-align: right;} */
.exchangeInfoT tr>td:nth-of-type(2) { width: 22%; padding-right: 3%; text-align: right;}
.exchangeInfoT tr>td:nth-of-type(3) { width: 35.5%; padding-right: 6%; text-align: right;}
.exchangeInfoT .name{float: left;}
.exchangeInfoT tr>td:last-child{text-align: right;}

.indexExchangeInfoT tr>td:first-child{width: 30%;}
.indexExchangeInfoT tr>td:nth-of-type(2){width: 22%;}
.indexExchangeInfoT tr>td:nth-of-type(3){width:24.1%;}

.shrinkWrap {text-align: center; height: 15px;}
.shrinkWrap img {display: inline-block; height: 12px; vertical-align: top;transform: rotate(180deg);-webkit-transform: rotate(180deg);}
.shrinkWrap img.open {transform: rotate(0deg);-webkit-transform: rotate(0deg);}

/*k线部分*/
.tabsContent .item {display: none; overflow: hidden;}
.tabsContent .item.active {display: block;}
.tabsTitle {height: 28px; line-height: 28px; border-bottom: 1px solid #ececec; border-top: 1px solid #ececec; padding: 0 4%; font-size: 1.3rem; display: flex; flex-direction: row;}
.tabsTitle span,.tabsTitle li {width: 15%; height: 27px; line-height: 27px; border-bottom: 2px solid transparent; display: inline-block; text-align: center; vertical-align: top;}
.tabsTitle span.active,.tabsTitle li.active { border-bottom-color: #217cd9; color: #217cd9;}
.tabsTitle select {border: 1px solid #fff; color: #666; font: 12px 'PingFang-SC-Regular','Microsoft Yahei'; outline: none; background: transparent; margin-right: 10px;}
.tabsTitle .selectActive{border-bottom: 2px solid #217cd9; color: #217cd9;}
/* .tabsTitle select::after { content: ""; width: 0; height: 0; position: absolute; right: 8px; top: 8px; border-style: solid; border-width: 6px 5px 0; border-color: #666 transparent transparent;} */
#minuteKline,#kline {float: left; position: relative; overflow: hidden;}
/*#kline,#minuteKline { margin-left: 4%;}*/
.rightMinute {float: right; width: 33.3%;}
.minute-tab { border-top: none;}
.minute-tab li { float: left; width: 50%; font-size: 1.2rem;}
.kLineTabs .tabsTitle { padding-left: 2%;}
.kLineTabs .tabsTitle span {font-size: 1.3rem; width: 16%;}
.kLineTabs .tabsTitle span:last-child {width: 18%;}
.minuteWrap #minuteChart,.minuteWrap #minuteFiveDaychart,.minuteWrap #kline{float: left;overflow: hidden;}
.minuteWrap .indexWrap{width: 100%;height: 30px;background-color: #f6fbfe;font-size: 12px;overflow: hidden;display: flex;flex-direction: row;}
.indexWrap .indexItem {display: block;line-height: 30px;flex-grow: 1;text-align: center;}
.indexWrap .indexItem.active {color: #333; background-color: #e1ecf2;}
#minuteFive .tableOne { margin-bottom: 12px; padding-top: 13px;}
#minuteFive .tableTwo {padding-top: 10px; border-top: 1px solid #ececec;}
#minuteFive td,#minute td {font: 1.2rem "Microsoft YaHei"; line-height: 27px;}
#minute td { line-height: 29px;}
.phoneRight { border: 1px solid #ececec; float: right; margin-right: 0.7%; width: 12.5%; height: 335px; margin-top: 20px; background-color: #f4f4f4;}
.phoneRight li {line-height: 37px; font-size: 1.2rem; text-align: center;}
.phoneRight li.active {color: #217cd9;}
#showMinute {position: relative;}
#showMinute:after {content: ""; border-width: 6px; border-style: solid; border-color: #217cd9 transparent transparent transparent; position: absolute; bottom: 6px; right: -6px;}
.tableOne,.tableTwo { width: 98%; margin-left: 1%; margin-right: 1%;}
.tableInfo {width: 100%; margin-top: 13px;}
.tableOne tr>td:nth-of-type(1),.tableTwo tr>td:nth-of-type(1),.tableInfo tr>td:nth-of-type(1) {width: 26%;}
.tableOne tr>td:nth-of-type(2),.tableTwo tr>td:nth-of-type(2),.tableInfo tr>td:nth-of-type(2) {width: 37%; text-align: right;}
.tableOne tr>td:nth-of-type(3),.tableTwo tr>td:nth-of-type(3),.tableInfo tr>td:nth-of-type(3) {width: 37%; text-align: right;}

.fiveDayMinuteWrap {display: none;}

/*问答部分*/
.qAList { padding: 0 4%;}
.qAList>li { padding: 13px 0 7px 0; border-bottom: 1px solid #ececec;}
.qAList>li:last-child {border-bottom: none;}
.qATtabs .tabsTitle span {width: 16%;}
.qATtabs .tabsTitle span:nth-of-type(2) {width: 20%;}
.qAList .qText {color: #f39800; font: 1.071rem "PingFang-SC-Regular";}
.qAList .aText{margin-top: 9px; color: #217cd9; font: 1.071rem "PingFang-SC-Regular";}
.qAList .time,.qAList .time>span {font: 0.857rem "PingFang-SC-Regular"; color: #8b8b8b;}
.qAList .time>.author { margin-right: 9.6%;}
.qAList>li>.qText,.qAList>li>.aText,.qAList>li>.time { line-height: 25px;}
.bgQA { display: inline-block; width: 21px; height: 21px; box-sizing: border-box; padding-top: 2px; font-size: 1.071rem; line-height: 21px; text-align: center; border-radius: 4px; color: #fff; font-weight: 500; position: relative; background-color: #ccc; margin-right: 2.5%;}
.bgQA:after {content: ""; border-width: 4px; border-style: solid; border-color: #ccc transparent transparent transparent; position: absolute; bottom: -8px; left: 50%; margin-left: -4px;}
.qAList .qText .bgQA {background-color: #f39800;}
.qAList .qText .bgQA:after {border-color: #f39800 transparent transparent transparent;}
.qAList .aText .bgQA {background-color: #217cd9;}
.qAList .aText .bgQA:after {border-color: #217cd9 transparent transparent transparent;}
.likeNewsList {padding: 0 4%;}
.likeNewsList li { border-bottom: 1px solid #ececec; padding: 10px 0 3px 0;}
.likeNewsList li:last-child {border-bottom: none;}
.likeNewsList li:nth-of-type(even) {background-color: #fafafa;}
.likeNewsList .title,.likeNewsList .sourceInfo { line-height: 23px;}
.likeNewsList .title {font: 1.071rem "PingFang-SC-Regular"; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333;}
.likeNewsList .source {font: 0.857rem "PingFang-SC-Regular"; color: #8b8b8b;}
.likeNewsList .time {font: 0.857rem "ArialMT"; color: #656870; float: right; line-height: 23px;}
.noticeList .title {color: #217cd9; white-space: pre-wrap;}
.noData {font-size: 1.786rem; font-weight: bold; line-height: 100px; height: 100px; text-align: center;}
.qATtabs .tabsContent {min-height: 100px;}
/* .exchangeInfoT {display: none;} */

@media screen and (max-width: 320px) {
	.exchangeData {padding: 0 2%;};
	.exchangeData .priceAmount {width: 27.9%;}
}

    .link-newslist{
        margin-bottom: 40px;
    }
    .bottom-link{
        position: fixed;
        left: 0;
        bottom:0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #ffffff;
        border: solid 1px #e8e8e8;
        font-size: 15px;
        color: #666666;
    }
    .business-img{
        position: relative;
        top: 7px;
        display: inline-block;
        width: 26px;
        height: 26px;
    }
</style>