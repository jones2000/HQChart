<template>
  
  <div>
    <div class="container">
      <div id="minuteChart" style="margin-left:28px;" ref="minute" v-show='Minute.IsShow'></div>
      <div id="kline" style="margin-left:28px;" ref="kline" v-show='Kline.IsShow'></div>

      <div class="topSwiper">
        <!-- <div class="oneItem" @click='GoBack'>
          <span style="font-size:22px;" class="hq_iconfont icon-suoxiao"></span>
        </div> -->
        <div class="oneItem" :class='{activeTopSwiper: TabTextIndex == index}' v-for="(item,index) in PeriodList" :key="index" @click='ChangeChartTab(item.Name,index)'>
          <span>{{item.Name}}</span>
        </div>
      </div>

      <div class="symbolInfo">
        <div class="symbolContent">
          <div class="symbol_left">
            <div class="symbol_left_Kline" v-show='Kline.IsShow'>
              <div class="nameCss-kline">{{StockData.Name.Text}}</div>
              <div class="symbolCss-kline">{{Symbol}}</div>             
            </div>
            <div class="symbol_left_1" v-show='Minute.IsShow'>
              <div class="symbolCss">{{Symbol}}</div>
              <div class="nameCss">{{StockData.Name.Text}}</div>
            </div>
            <div v-show='Minute.IsShow' class="symbol_left_2" :class="MinuteTooltip.Data.Increase.Color">
              {{MinuteTooltip.Data.AvPrice.Text}}
            </div>
            <!-- <div v-show='Minute.IsShow' class="symbol_left_1" :class="MinuteTooltip.Data.Increase.Color">
              <div class="increaseCss topCss ">{{MinuteTooltip.Data.Increase.Text}}</div>
              <div class="increaseCss_1 bottomCss">{{MinuteTooltip.Data.Risefall.Text}}</div>
            </div> -->
          </div>
          <div class="symbol_right" v-show='Kline.IsShow'>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">低</span> <span :class="Tooltip.Data.Low.Color">{{Tooltip.Data.Low.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">高</span> <span :class="Tooltip.Data.High.Color">{{Tooltip.Data.High.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">收</span> <span>{{Tooltip.Data.Close.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">开</span> <span :class="Tooltip.Data.Open.Color">{{Tooltip.Data.Open.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1 symbol_right_3">
              <div class="topCss1">
                <span class="titleCss">成交额</span> <span>{{Tooltip.Data.Amount.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">成交量</span> <span>{{Tooltip.Data.Vol.Text}}</span>
              </div>
            </div>
          </div>
          <div class="symbol_right symbol_right_minute" v-show='Minute.IsShow'>
            <div class="symbol_right_1" style="height:24%;">
              <div class="topCss1">
                <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Increase.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Risefall.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">低</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Low.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">高</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.High.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">收</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Close.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">开</span> <span :class="MinuteTooltip.Data.Increase.Color">{{MinuteTooltip.Data.Open.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1 symbol_right_3">
              <div class="topCss1">
                <span class="titleCss">成交额</span> <span>{{MinuteTooltip.Data.Amount.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">成交量</span> <span>{{MinuteTooltip.Data.Vol.Text}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="closeCss" @click='GoBack'>
          <span style="font-size:22px;" class="hq_iconfont icon-suoxiao"></span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Tools from "../../../services/tools"
  import $ from 'jquery'
  import "../../../assets/hqiconfont.css";
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
          Type: '分钟走势图横屏', //历史分钟走势图
          Symbol: symbol,
          IsAutoUpate: true, //是自动更新数据

          IsShowRightMenu: false, //右键菜单
          IsShowCorssCursorInfo: false, //是否显示十字光标的刻度信息
          DayCount: 1,
          CorssCursorTouchEnd: true,       //手指离开屏幕 隐藏十字光标
          CorssCursorInfo:{ Left:2, Right:2, Bottom:1, IsShowCorss:true },  //十字光标刻度设置

          Border: //边框
          {
              Left: 20, //左边间距
              Right: 1, //右边间距
              Top: 1,
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
          ]
      };
      return data;
  }

  DefaultData.GetKlineOption = function(symbol){
      let data = {
          Type: '历史K线图横屏',
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
              Left: 20, //左边间距
              Right: 1, //右边间距
              Top: 1,
              Bottom: 1
          },

          Frame: //子框架设置
          [
            { 
              SplitCount: 4, 
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
            { SplitCount: 3, StringFormat: 0,IsShowLeftText:false, IsShowRightText:true}
          ]
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
          ["60分钟",{Value:8,KLineShow:true,MinuteShow:false}]
      ]);
      if (!mapPeriod.has(name)) return null;

      return mapPeriod.get(name);
  }

  export default {
    name:'TabList',
    data () {
      return{
        PeriodList:[
          {Name:"分时",Value:1},
          {Name:"五日",Value:5},
          {Name:"日线",Value:0},
          {Name:"周线",Value:1},
          {Name:"月线",Value:2},
          // {Name:"年线",Value:3},
          // {Name:"1分钟",Value:4},
          {Name:"5分钟",Value:5},
          // {Name:"15分钟",Value:6},
          // {Name:"30分钟",Value:7},
          // {Name:"60分钟",Value:8}
        ],
        Minute:{
          JSChart:null,
          IsShow:true,
          Option:DefaultData.GetMinuteOption(this.Symbol)
        },
        Kline:{
          JSChart:null,
          IsShow:false,
          Option:DefaultData.GetKlineOption(this.Symbol)
        },
        Symbol:'600000.sh',
        TabTextIndex:0,
        Name:"",
        StockData: DefaultData.GetStockData(),
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
                AvPrice:{Text:'',Color:''},
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
      if(Tools.getURLParams("index")){
        // console.log("Tools.getURLParams::::::",Tools.getURLParams("index"))
        this.TabTextIndex = Tools.getURLParams("index");
        var index = Tools.getURLParams("index");
        this.Name = this.PeriodList[index].Name;
      }
    },

    mounted(){
      this.OnSize();
      var _this = this;
      window.onresize = function(){
        _this.OnSize();
      };

      this.JSStock = JSCommonStock.JSStockInit();
      this.InitalStock();
      this.JSStock.RequestData();

      this.ChangeChartTab(this.Name,this.TabTextIndex);
    },

    watch:{
            
    },

    methods:{
      OnSize(){
        var width = window.innerWidth -76;
        var chartHeight = window.innerHeight;

        $('#minuteChart').width(width);
        $('#minuteChart').height(chartHeight);

        $('#kline').width(width);
        $('#kline').height(chartHeight);
      },
      ChangeChartTab(name,index){
        this.TabTextIndex = index;
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
        var blackStyle = JSCommon.HQChartStyle.GetStyleConfig(JSCommon.STYLE_TYPE_ID.BLACK_ID);
        JSCommon.JSChart.SetStyle(blackStyle);
        this.$refs.kline.style.backgroundColor='#1a1c30';
        chart.SetOption(this.Kline.Option);
        chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE, callback:this.OnClickIndexTitle});//点击事件通知回调
        chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW, callback:(event, data, obj)=>{ this.UpdateTitle(event, data, obj); }});
        this.Kline.JSChart=chart;
      },

      UpdateTitle(event, data, obj){
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
        console.log('[UpdateMinuteTitle]  data',data)
        var objNew = {
            Time:{Text:''},
            AvPrice:{Text:'',Color:''},
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
        objNew.AvPrice.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.AvPrice, 2); 
        objNew.High.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.High, 2);       
        objNew.Low.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Low, 2);       
        objNew.Open.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Open, 2);       
        objNew.Close.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Close, 2);

        objNew.Increase.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Increase, 2)+"%";
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
      GoBack(){
        window.history.back(-1);
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
      IsSHSZIndex: function () {
        return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
      },

      IsShowChangeSymbol() {
        this.IsChangeSymbol = true;
      },
    },


  }
</script>
<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
    color: #ffffff;
    background-color: #1a1c30;
  }
  
  .container
  {
      position:absolute;
      top:    0px;
      left:   0px;
      height: 100%;
      width:100%;
  }

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

  .topSwiper{
    /* 80px */
    width: 30px; 
    height: 100%;
    position:absolute;
    top: 0px;
    // right: 100px;
    z-index:100;
    display: flex;
    flex:1;
    flex-direction: column;
    // border-left:2px solid #e1ecf2;
    box-sizing: border-box;
    // border-right:2px solid #e1ecf2;
    font-size: 1.4rem;
  }

  .oneItem{
    width: 100%;
    flex:1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid #ececec;
  }

  .oneItem>span{
    display: block;
    white-space:nowrap;
    transform:rotate(90deg);
  }

  .activeTopSwiper{
    // border: 1px solid #217cd9;
    box-sizing: border-box;
    color:#217cd9;
  }

  /* 股票信息 */
.symbolInfo{
  /* 128rpx */
  width: 50px; 
  height: 100%;
  position:absolute;
  top: 0px;
  right:0px;
}

.symbolContent{
  height: calc(100% - 44px);
  width: 100%;
  display: flex;
  flex:1;
  flex-direction: column;
}

.symbol_left{
  height: 40%;
}

.symbol_right{
  height: 60%;
}
.symbol_right_minute{
  height: 76%;
}

.symbol_left{
  /* background: red; */
  display: flex;
  flex:1;
  flex-direction: column;
}

// .symbol_left>div{
//   flex:1;
// }
.symbol_left_0{
  flex:1;
  padding-left: 13px;
  box-sizing: border-box;
  font-size: 20px;
  .backIconWrap {
    display: inline-block;
    /*padding-right: 22px;*/
    height: 40px;
    width: 20px;
    line-height: 40px;
    font-size:20px;
    transform:rotate(90deg);
  }
}

.symbol_left_1{
  flex:2;
  // display: flex;
  flex-direction: row;
  margin-left: -6px;
  margin-right: 8px;
  transform:rotate(90deg);
}
.symbol_left_Kline{
  margin: 35px -6px 0 10px;
  flex-direction: row;
  font-size: 16px;
  transform:rotate(90deg);
  display: flex;
}

.symbol_left_Kline>div{
  display: inline-block;
  // justify-content: center;
  /* align-items: center; */
  white-space:nowrap;
}

// .symbol_left_1>div{
//   width: 50%;
//   display: flex;
//   justify-content: center;
//   /* align-items: center; */
//   // transform:rotate(90deg);
//   white-space:nowrap;
// }

.nameCss{
  font-size: 15px;
  font-weight: 600;
  // padding-top:33px;
  box-sizing: border-box;
  width: 80px;
  margin-top: -3px;
}
.nameCss-kline{
  font-size: 16px;
  font-weight: 600;
  // padding-top:33px;
  box-sizing: border-box;
  width: 80px;
}

.symbolCss{
  font-size: 12px;
  color:#f5f5f5;
  padding-top:20px;
  box-sizing: border-box;
}
.symbolCss-kline{
  font-size: 16px;
  color:#f5f5f5;
  // padding-top:30px;
  box-sizing: border-box;
  margin-left: 10px;
}



.symbol_left_1>.increaseCss,.symbol_left_1>.increaseCss_1{
  justify-content: flex-start;
  /* align-items: center; */
  font-size: 12px;
  font-weight: 600;
}

.topCss{
  padding-top:20px;
  box-sizing: border-box;
}

.bottomCss{
  // padding-top:34px;
  box-sizing: border-box;
  margin-top: -3px;
}

.symbol_left_2{
  flex:1;
  display: flex;
  justify-content: center;
  align-items: center;
  transform:rotate(90deg);
  font-size: 19px;
  margin: 15px 0 0 0;
}

.redCss{
  color:red;
}

.greenCss{
  color:green;
}

.symbol_right{
  display: flex;
  flex-direction: column;
}

.symbol_right>div{
  height: 24%;
}

/* .symbol_right>.symbol_right_3{
  height:40%;
} */

.symbol_right_1{
  display: flex;
  /* align-items: center; */
  white-space:nowrap;
  flex-direction: row;
}

.symbol_right_1>div{
  width: 50%;
  transform:rotate(90deg);
  transform-origin: 25% 20%;
  font-size: 14px;
}

.titleCss{
  padding-right: 7px;
  color:#f5f5f5;
}

.topCss1{
  padding-top:1px;
  box-sizing: border-box;
}

.bottomCss1{
  padding-top:9px;
  box-sizing: border-box;
}

.closeCss{
  height: 44px;
  width: 100%;
  line-height: 54px;
  text-align: center;
}


</style>