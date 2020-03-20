<template>
    <div class="hqWrap">
        <!--页面头部-->
        <div class="headTitle" ref="headtitle">
            <!-- <div class="backWrap" @click='IsShowChangeSymbol'>
                <span class='backIconWrap hq_iconfont icon-liebiaoqiehuan'></span>
            </div> -->
            <div class="name-box">
              <span class="stockName">{{StockData.Name.Text}}({{Symbol}})</span>
            </div>
            <!-- <div class="horizontal">
              <span style="font-size:22px;" class="hq_iconfont icon-xing"></span>
            </div> -->
            <div class="horizontal" @click="GotoHorizontal">
              <span style="font-size:20px;" class="hq_iconfont icon-quanpingzuidahua"></span>
            </div>
            <!-- <div class="horizontal">
              <span style="font-size:22px;" class="hq_iconfont icon-jingshi"></span>
            </div> -->
        </div>
        <!-- 切换股票 -->
        <!-- <changeSymbol v-show="IsChangeSymbol" @ShowModal="ShowModal" @ChangeSymbol='ChangeSymbol'></changeSymbol> -->
        <!--价格部分-->
        <div class="exchangeData" red="exchangedata" id="main">
            <div class="clear">
              <div class="priceCurrent">
                <span class="priceCurrentNum" :class='StockData.Price.Color'>{{StockData.Price.Text}}</span>
                <span class="riseNum" :class='StockData.RiseFallPrice.Color'>{{StockData.RiseFallPrice.Text}}/{{StockData.Increase.Text}}</span>
              </div>
              <div class="priceOpen">
                <p class="open">今开<span :class='StockData.Open.Color'>{{StockData.Open.Text}}</span></p>
                <p class="low">最高<span :class='StockData.High.Color'>{{StockData.High.Text}}</span></p>                
              </div>
              <div class="priceOpen">
                <p class="open">昨收<span>{{StockData.YClose.Text}}</span></p>
                <p class="low">最低<span :class='StockData.Low.Color'>{{StockData.Low.Text}}</span></p>
              </div>
              <div class="priceOpen" style="width:40%;">               
                <p class="open">成交量<span>{{StockData.Vol.Text}}</span></p>
                <p class="low">成交额<span>{{StockData.Amount.Text}}</span></p>
              </div>
            </div>
            <!-- 显隐部分 -->
            <showHide :StockDataF='StockData' v-show='ExchangeInfoTShow'></showHide>
            <p class="shrinkWrap" @click='ShowOrHideExchangeInfoT'><span :class='CollapseImgClass'></span></p> 
        </div>
        <div class="segment"></div>
        <TabList v-show="!Tooltip.IsshowTooltip && !MinuteTooltip.IsshowTooltip" class="tabList" @ChangeChartTab="ChangeChartTab" @ChangeKlinRight="ChangeKlinRight" @ChangeKlinIndex="ChangeKlinIndex"></TabList>
        <div v-show="Tooltip.IsshowTooltip && Kline.IsShow" class="tabList kline-tip">
            <span class="tooltip-span">{{Tooltip.Data.Date}}</span>
            开 <span class="tooltip-span" :class="Tooltip.Data.Open.Color">{{Tooltip.Data.Open.Text}}</span>
            高 <span class="tooltip-span" :class="Tooltip.Data.High.Color">{{Tooltip.Data.High.Text}}</span>
            低 <span class="tooltip-span" :class="Tooltip.Data.Low.Color">{{Tooltip.Data.Low.Text}}</span>
            收 <span class="tooltip-span" :class="Tooltip.Data.Close.Color">{{Tooltip.Data.Close.Text}}</span>
        </div>
        <div v-show="MinuteTooltip.IsshowTooltip && Minute.IsShow" class="tabList kline-tip">
            <span class="tooltip-span">{{MinuteTooltip.Data.Time}}</span>
            开 <span class="tooltip-span" :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Open.Text}}</span>
            高 <span class="tooltip-span" :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.High.Text}}</span>
            低 <span class="tooltip-span" :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Low.Text}}</span>
            收 <span class="tooltip-span" :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Close.Text}}</span>
            幅 <span class="tooltip-span" :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Increase.Text}}%</span>
        </div>
        <!--k线部分-->
        <div class="tabs kLineTabs blockBg">
          <!-- 分时图部分 -->
          <div class="clear minuteWrap">
            <div id="minuteChart" ref="minute" v-show='Minute.IsShow'></div>
            <div id="kline" ref="kline" v-show='Kline.IsShow'></div>

            <!-- 分时图右侧内容 -->
            <div class="rightMinute" v-show='!IsFiveminute && Minute.IsShow'>
                <!-- <ul class="minute-tab clear tabsTitle">
                    <li class="tableSell active-minute" @click='ChangeMinuteTab(0)' :class='{active:MinuteMenuIndex == 0}'>五档</li>
                    <li class="tableBuy" @click='ChangeMinuteTab(1)' :class='{active:MinuteMenuIndex == 1}'>明细</li>
                </ul> -->
                <div class="tabsContent">
                   
                    <div id="minute" class="tableMinuteContent" v-show='MinuteMenuIndex == 0'>
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
          </div>
        </div>

        <subIndex :FrameID="FrameID" :FrameTitle='FrameTitle' @GetWindowID="GetWindowID" @ChangeSubindex='ChangeSubindex'></subIndex>
    </div>
</template>

<script>
    import Tools from "../../../services/tools"
    import TabList from "./iconTabList.vue"
    import $ from 'jquery'
    import subIndex from './subIndex.vue'
    import "../../../assets/hqiconfont.css";
    import changeSymbol from "./changeSymbol.vue";
    import showHide from './showhide.vue'
    import HQChart from 'hqchart'
    import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
    import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
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
            MaxPrice: { Text: '', Color: 'PriceNull' },
            MinPrice: { Text: '', Color: 'PriceNull' },
            YClose: { Text: '' },

            Excahngerate: { Text: '', Color: 'PriceNull' },
            Amount: { Text: '' }, Vol: { Text: '' },
            Pe: { Text: '' }, Roe: { Text: '' },
            MarketV: { Text: '' }, FlowMarketV: { Text: '' },
            Eps: { Text: '' }, ScrollEPS: { Text: '' },
            Pb: { Text: '' }, Amplitude: { Text: '' },
            BookRate: { Text: '' }, BookDiffer: { Text: '' },
            Volratio: { Text: '' },CapitalTatol: { Text: '' },
            CapitalA: { Text: '' },
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

    DefaultData.GetMinuteOption = function(symbol){
        let data = {
            Type: '分钟走势图', //历史分钟走势图
            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据

            IsShowRightMenu: false, //右键菜单
            IsShowCorssCursorInfo: false, //是否显示十字光标的刻度信息
            DayCount: 1,
            CorssCursorTouchEnd: true,       //手指离开屏幕 隐藏十字光标
            CorssCursorInfo:{ Left:2, Right:2, Bottom:1, IsShowCorss:true },  //十字光标刻度设置

            Border: //边框
            {
                Left: 1, //左边间距
                Right: 1, //右边间距
                Top: 1,
                Bottom: 20
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
                // {Name:'MinuteTooltip' }  //手机端tooltip
            ],
        };
        return data;
    }

    DefaultData.GetKlineOption = function(symbol){
        let data = {
            Type: '历史K线图',
            Windows: [
                { Index: "均线",Modify:false,Change:false},
                { Index: "VOL",Modify:false,Change:false, IsDrawTitleBG:false },
                { Index: "MACD",Modify:false,Change:false, IsDrawTitleBG:false },
            ], //窗口指标
            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据
            CorssCursorTouchEnd: true,       //手指离开屏幕 隐藏十字光标
            IsShowRightMenu: false, //右键菜单
            CorssCursorInfo:{ Left:2, Right:0, Bottom:1, IsShowCorss:true },  //十字光标刻度设置

            KLine: {
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
                Top: 1
            },

            Frame: //子框架设置
            [
              { 
                SplitCount: 5, 
                SplitType:1,  //平均分割
                IsShowLeftText:false, 	//不显示左边刻度文字
                IsShowRightText:true,    	//显示右边刻度文字                      
                Custom:
                [
                  { 
                      Type:0,
                      Position:'left',
                  }
                ]
              },
              { SplitCount: 3, StringFormat: 0,IsShowLeftText:false,IsShowRightText:true },
              { SplitCount: 3, StringFormat: 0,IsShowLeftText:false,IsShowRightText:true }
            ],
            ExtendChart:    //扩展图形
            [
                // {Name:'KLineTooltip' }  //手机端tooltip
            ],
        };
        return data;
    }

    DefaultData.GetPeriodData=function(name)
    {
        const mapPeriod=new Map([
            ["分时",{Value:1,KLineShow:false,MinuteShow:true}],
            ["五日",{Value:5,KLineShow:false,MinuteShow:true}],
            ["日线",{Value:0,KLineShow:true,MinuteShow:false}],
            ["周线",{Value:1,KLineShow:true,MinuteShow:false}],
            ["月线",{Value:2,KLineShow:true,MinuteShow:false}],
            ["年线",{Value:3,KLineShow:true,MinuteShow:false}],
            ["1分钟",{Value:4,KLineShow:true,MinuteShow:false}],
            ["5分钟",{Value:5,KLineShow:true,MinuteShow:false}],
            ["15分钟",{Value:6,KLineShow:true,MinuteShow:false}],
            ["30分钟",{Value:7,KLineShow:true,MinuteShow:false}],
            ["60分钟",{Value:8,KLineShow:true,MinuteShow:false}],
        ]);
        if (!mapPeriod.has(name)) return null;

        return mapPeriod.get(name);
    }

    export default{
      components:{TabList,subIndex,changeSymbol,showHide},
        data(){
            return {
                PhoneRightShow:false,
                ExchangeInfoTShow:false,
                CollapseImgClass:'el-icon-caret-bottom',
                MinuteMenuIndex:0,
                IsIndex:false,
                Symbol:'600000.sh',
                JSStock:null,
                ID: JSCommon.JSChart.CreateGuid(),
                StockData: DefaultData.GetStockData(),
                Minute:{
                    JSChart:null,
                    IsShow:true,
                    Option:null
                },
                Kline:{
                    JSChart:null,
                    IsShow:false,
                    Option:null
                },
                minutePeriod:4,  //分钟周期
                PageBackColor: "",  //背景颜色
                IsFiveminute:false,  //是否是5日
                TabTextIndex:0,
                FrameID:0,   //当前窗口ID
                FrameTitle:'',   //当前窗口标题
                IsChangeSymbol: false,   //切换股票

                Tooltip:{
                    IsshowTooltip:false,
                    Data:{
                        Date:{Text:''},
                        Open:{Text:'',Color:''},
                        High:{Text:'',Color:''},
                        Low:{Text:'',Color:''},
                        Close:{Text:'',Color:''},
                        YClose:{Text:''},
                        Vol:{Text:''},
                        Amount:{Text:''},
                    }
                },
                MinuteTooltip:{
                    IsshowTooltip:false,
                    Data:{
                        Time:{Text:''},
                        Open:{Text:'',Color:''},
                        High:{Text:'',Color:''},
                        Low:{Text:'',Color:''},
                        Close:{Text:'',Color:''},
                        Increase:{Text:'',Color:''},
                        Risefall:{Text:'',Color:''},
                        Vol:{Text:''},
                        Amount:{Text:''},
                    }
                }
            }
        },
        created(){
            if(Tools.getURLParams("symbol")){
                console.log("Tools.getURLParams::::::",Tools.getURLParams("symbol"))
                this.Symbol = Tools.getURLParams("symbol");
            }

            this.IsIndex = this.IsSHSZIndex();  //初始判断是否是指数

            this.JSStock = JSCommonStock.JSStockInit();
            this.InitalStock();
            this.JSStock.RequestData();

            this.Minute.Option = DefaultData.GetMinuteOption(this.Symbol);
            // this.FiveMinute.Option = DefaultData.GetFiveDayMinuteOption(this.Symbol);
            this.Kline.Option = DefaultData.GetKlineOption(this.Symbol);
        },
        mounted(){
            this.OnSize();
            var _this = this;
            window.onresize = function(){
                _this.OnSize();
            };

            this.CreateMinuteChart();
        },
        watch:{
            
        },
        destroyed(){
            clearInterval(this.myInterval);
        },
        methods:{
            OnSize(){
              var width = window.innerWidth;
              var chartHeight = window.innerHeight - $(".headTitle").outerHeight(true) - $(".exchangeData").outerHeight(true) - $(".tabList").outerHeight(true) - 50;

              if(this.IsFiveminute){
                $('#minuteChart').width(width);
                $('#minuteChart').height(chartHeight);
              }else{
                $('#minuteChart').width(width - $('.rightMinute').outerWidth(true));
                $('#minuteChart').height(chartHeight);
              }

              // $('#kline').width(width - $('.phoneRight').outerWidth(true));
              $('#kline').width(width);
              $('#kline').height(chartHeight);
            },
            //横屏
            GotoHorizontal(){
              window.open("./horizontalHq.html?symbol="+this.Symbol + "&index="+this.TabTextIndex,"_self")
            },
            //切换股票
            ChangeSymbol(symbol){
              this.IsChangeSymbol = false;
              this.Symbol = symbol;
              if(this.Minute.IsShow){
                this.Minute.JSChart.ChangeSymbol(symbol);
              }else if(this.Kline.IsShow){
                this.Kline.JSChart.ChangeSymbol(symbol);
              }  
              this.InitalStock();
              this.JSStock.RequestData();           
            },
            ChangeKlinIndex(indexItem,flag){  //修改k线指标
                // this.KlineIndexFlag = flag;
                var indexName = indexItem;
                if(this.Kline.JSChart) this.Kline.JSChart.ChangeIndex(1,indexName);
            },
            ChangeKlinRight(rightFlag){  //修改复权
                // this.KlineRightFlag = rightFlag;
                if(this.Kline.JSChart) this.Kline.JSChart.ChangeRight(rightFlag);
            },
            ChangeChartTab(name,num){
              this.TabTextIndex = num;
              var period=DefaultData.GetPeriodData(name);
              if (!period) return;
              if (period.KLineShow) this.ChangeKLinePeriod(period.Value);
              this.Kline.IsShow=period.KLineShow;
              if (period.MinuteShow) this.ChangeMinutePeriod(period.Value);
              this.Minute.IsShow=period.MinuteShow;           
            },
            ChangeKLinePeriod(period)  //历史K线周期切换
            {
              if (!this.Kline.JSChart)    //不存在创建
              {
                  this.Kline.Option.KLine.Period=period;
                  this.CreateKLineChart();
              }
              else
              {
                  this.Kline.JSChart.ChangePeriod(period);
              }
            },
            CreateKLineChart()  //创建K线图
            {
              if (this.Kline.JSChart) return;
              this.Kline.Option.Symbol=this.Symbol;
              let chart=JSCommon.JSChart.Init(this.$refs.kline);
              // console.log("获取指标详情4",this.KLine.Option.Windows)
              chart.SetOption(this.Kline.Option);
              chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE, callback:this.OnClickIndexTitle});//点击事件通知回调
              chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW, callback:(event, data, obj)=>{ this.UpdateTitle(event, data, obj); }});
              this.Kline.JSChart=chart;
            },

            UpdateTitle(event, data, obj){
                // console.log('[UpdateTitle]  data',data)
                var objNew = {
                    Date:{Text:''},
                    Open:{Text:'',Color:''},
                    High:{Text:'',Color:''},
                    Low:{Text:'',Color:''},
                    Close:{Text:'',Color:''},
                    YClose:{Text:''},
                    Vol:{Text:''},
                    Amount:{Text:''},
                };
                var data = data.Draw;
                objNew.Date = data.Date.toString().substring(0,4)+"-"+data.Date.toString().substring(4,6)+"-"+data.Date.toString().substring(6,8);

                objNew.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High, 2);
                objNew.High.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.High, data.YClose);

                objNew.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low, 2);
                objNew.Low.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Low, data.YClose);

                objNew.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open, 2);
                objNew.Open.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Open, data.YClose);

                objNew.Close.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Close, 2);
                objNew.Close.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Close, data.YClose);

                objNew.YClose.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.YClose, 2);
                objNew.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol, 2);
                objNew.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount, 2);
                
                // console.log(objNew,"[UpdateTitle]  objNew::")
                this.Tooltip.Data = objNew;
                this.Tooltip.IsshowTooltip = false;
                if (this.Kline.JSChart.JSChartContainer.IsOnTouch==true && event.FunctionName=='DrawDynamicInfo') //手是否在屏幕上
                {
                    this.Tooltip.IsshowTooltip = true;
                }
            },

            CreateMinuteChart() //创建日线图
            {
                if (this.Minute.JSChart) return;
                
                this.Minute.Option.Symbol=this.Symbol;
                let chart=JSCommon.JSChart.Init(this.$refs.minute);
                var blackStyle = JSCommon.HQChartStyle.GetStyleConfig(JSCommon.STYLE_TYPE_ID.BLACK_ID);
                blackStyle.FrameTitleBGColor = "#1a1c30";
                JSCommon.JSChart.SetStyle(blackStyle);
                this.$refs.minute.style.backgroundColor='#1a1c30';
                chart.SetOption(this.Minute.Option);
                chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW, callback:(event, data, obj)=>{ this.UpdateMinuteTitle(event, data, obj); }});
                this.Minute.JSChart=chart;
            },
            UpdateMinuteTitle(event, data, obj){
                // console.log('[UpdateMinuteTitle]  data',data.Draw.Time,data)
                var objNew = {
                    Time:{Text:''},
                    Open:{Text:'',Color:''},
                    High:{Text:'',Color:''},
                    Low:{Text:'',Color:''},
                    Close:{Text:'',Color:''},
                    Increase:{Text:'',Color:''},
                    Risefall:{Text:'',Color:''},
                    Vol:{Text:''},
                    Amount:{Text:''},
                };
                var data = data.Draw;
                if(data == null) return;
                if(data.Time >= 1000){
                    objNew.Time = data.Time.toString().substring(0,2)+":"+data.Time.toString().substring(2,4);
                }else{
                    objNew.Time = data.Time.toString().substring(0,1)+":"+data.Time.toString().substring(1,3);
                }
                objNew.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High, 2);
                objNew.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low, 2);
                objNew.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open, 2);
                objNew.Close.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Close, 2);

                objNew.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase, 2);
                objNew.Increase.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Increase);

                objNew.Risefall.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Risefall, 2);
                objNew.Risefall.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.Risefall);

                objNew.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol, 2);
                objNew.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount, 2);

                this.MinuteTooltip.Data = objNew;
                this.MinuteTooltip.IsshowTooltip = false;

                if (this.Minute.JSChart.JSChartContainer.IsOnTouch==true && event.FunctionName=='DrawDynamicInfo') //手是否在屏幕上
                {
                    this.MinuteTooltip.IsshowTooltip = true;
                }

                // console.log(objNew,"UpdateMinuteTitle::::")
            },

            //走势图多日切换
            ChangeMinutePeriod(period)
            {
              if (!this.Minute.JSChart)   //不存在创建
              {
                this.Minute.Option.DayCount=period;
                this.CreateMinuteChart();
              }
              else
              {
                if(period == 1){
                  this.IsFiveminute = false;
                  
                }else if(period == 5){
                  this.IsFiveminute = true;
                  
                }
                this.OnSize();
                this.Minute.JSChart.OnSize();
                this.Minute.JSChart.ChangeDayCount(period);
              }
            },

            //点击指标标题回调
            OnClickIndexTitle(event, data, obj)
            {
              console.log('[OnClickIndexTitle] data', data);
              var title = data.Title.split('(');
              console.log(title,"title:::")

              this.FrameTitle = title[0]; 
              this.GetWindowID(data.FrameID);
            },
            //向子组件传递当前窗口数
            GetWindowID(val){
              this.FrameID = val;
            },
            //切换副图指标
            ChangeSubindex(windowIndex,indexName){
              this.Kline.JSChart.ChangeIndex(windowIndex,indexName);
            },
            
            IsSHSZIndex: function () {
                return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
            },
            ShowOrHideExchangeInfoT(){
                this.ExchangeInfoTShow = !this.ExchangeInfoTShow;
                this.CollapseImgClass = this.ExchangeInfoTShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
            },
            ChangeMinuteTab(index){
                this.MinuteMenuIndex = index;
            },
            UpdateData: function (id, arySymbol, dataType, jsStock) {
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
                data.BookRate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE), Text: '--' };
                data.BookDiffer = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER), Text: '--' };
                data.Volratio = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.VOLRATIO), Text: '--' };
                data.CapitalTatol = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.CAPITAL_TOTAL), Text: '--' };
                data.CapitalA = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.CAPITAL_A), Text: '--' };
                data.MaxPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MAX_PRICE), Text: '--' };
                data.MinPrice = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.MIN_PRICE), Text: '--' };
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
                this.PageBackColor = this.FormatBackColor(data.Price.Value, yClose);

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

                data.MaxPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MaxPrice.Value, 2);
                data.MaxPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.MaxPrice.Value, yClose);

                data.MinPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.MinPrice.Value, 2);
                data.MinPrice.Color = JSCommon.IFrameSplitOperator.FormatValueColor(data.MinPrice.Value, yClose);

                data.YClose.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.YClose.Value, 2);

                data.Amount.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Amount.Value, 2);
                data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value, 2);
                data.BookRate.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.BookRate.Value, 2);
                data.BookDiffer.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.BookDiffer.Value, 2);
                data.Volratio.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Volratio.Value, 2);
                data.CapitalTatol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.CapitalTatol.Value, 2);
                data.CapitalA.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.CapitalA.Value, 2);
                
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

            //字段颜色格式化
            FormatBackColor(value, value2) 
            {
                if (value != null && value2 == null)  //只传一个值的 就判断value正负
                {
                    if (value == 0) return 'BackNull';
                    else if (value > 0) return 'BackUp';
                    else return 'BackDown';
                }

                //2个数值对比 返回颜色
                if (value == null || value2 == null) return 'BackNull';
                if (value == value2) return 'BackNull';
                else if (value > value2) return 'BackUp';
                else return 'BackDown';
            },
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
            IsShowChangeSymbol() {
              this.IsChangeSymbol = true;
            },
            ShowModal(){
              this.IsChangeSymbol = false;
            },
            
        }
    }

</script>

<style lang="less">
* {margin: 0; padding: 0;}
body,html {color: #333;}
body {background-color: #1a1c30;}
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
    color: #ffffff!important;
}

// BackNull
.BackNull {
  background-color: #cccccc!important;
  color: #ffffff;
}
.BackUp {
  background-color: #ee1515!important;
  color: #ffffff;
}
.BackDown {
  background-color: #1a1c30!important;
  color: #ffffff; 
}

.kline-tip{
    height: 3.4rem;
    line-height: 3.4rem;
    color: #ffffff;
    font-size: 1.1rem;
}
.tooltip-span{
    margin-right: 5px;
}
.segment{
  height:5px;
  width:100%;
  background-color: #f3f3f3;
}

.segment{
    width: 100%;
    height: 10px;
    background: #000000;
}

    //返回
.backWrap {
  padding: 0 4%;
  font-size: 1.5rem;
  .backIconWrap {
    display: inline-block;
    /*padding-right: 22px;*/
    height: 40px;
    width: 20px;
    line-height: 40px;
    font-size:20px;
  }
}
.horizontal{
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

/*页面头部*/
.name-box{flex:1;height: 40px;line-height: 40px;font-size:14px;text-align: left; }
.headTitle {display:flex; height: 3.3rem; box-sizing: border-box; padding-top: 4px;background: #1a1c30;color: #ffffff;}
.nameWrap {text-align: left; line-height: 21px; font-family: "PingFangSC-Light";}
.stockName {/*font-family: "PingFang-SC-Heavy";*/ margin-left: 20px;margin-right: 1.2%;}
.flagBox { width: 1.6%; height: 12px; border-radius: 2px; line-height: 12px; color: #fff; font-size: 0.786rem; text-align: center; margin-right: 1px;}
.rFlag { background-color: #f39800;}
.tFlag { background-color: #125fd9;}
.exchangeInfo { font-size: 0.714rem; color: #f5f5f5; height: 15px; line-height: 15px; font-weight: bold; text-align: left;}
.exchangeInfo>span {margin-right: 1.3%; font-family: "PingFangSC-Light";}

.bodyBg {background-color: #f8f9fc;}
.blockBg {background: #1a1c30;color:#ffffff;}

/*价格部分*/
.exchangeData { font-size: 1.3rem;background: #1a1c30;color: #ffffff;}
.exchangeData .priceCurrent,.exchangeData .priceHL,.exchangeData .priceOpen,.exchangeData .priceAmount {float: left;}
.exchangeData .priceCurrent {width: 100%;margin: 15px 0 0 15px;}
.exchangeData .priceHL {width: 24%; box-sizing: border-box; padding-right: 4.3%;}
.exchangeData .priceOpen {width: 27%; box-sizing: border-box;padding-left: 5%;}
.exchangeData .priceAmount {width: 23.9%;}
.exchangeData .priceHL .low, .exchangeData .priceOpen .change, .exchangeData .priceAmount .totalValue { height: 20px; line-height: 20px;}
.exchangeData .priceOpen .low{
  margin-top:5px;
}
.exchangeData .priceHL span,.exchangeData .priceOpen span,.exchangeData .priceAmount span {float: right;}
.priceCurrent .priceCurrentNum {font-size: 2.4rem; padding-left: 1.4%; height: 29px; line-height: 29px;margin-right: 10px;}
.priceCurrent .riseNum,.priceCurrent .risePrecent { font-size: 1.2rem; height: 18px; line-height: 18px;}
.priceCurrent .riseNum { margin-right: 11.4%;}
.priceHL .high,.priceOpen .open,.priceAmount .num { padding-top: 7px; height: 20px; line-height: 20px;}

.shrinkWrap {margin-bottom: 10px;text-align: center; height: 15px;}
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
#minute td { line-height: 29px;font-size: 1rem;}
.phoneRight { border: 1px solid #ececec; float: right; margin-right: 0.7%; width: 12.5%; height: 335px; margin-top: 20px; background-color: #f4f4f4;}
.phoneRight li {line-height: 37px; font-size: 0.786rem; text-align: center;}
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