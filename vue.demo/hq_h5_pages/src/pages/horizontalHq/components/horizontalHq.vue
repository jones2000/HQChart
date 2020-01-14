<template>
  
  <div>
    <div class="container">
      <div id="minuteChart" style="margin-left:39px;" ref="minute" v-show='Minute.IsShow'></div>
      <div id="kline" style="margin-left:39px;" ref="kline" v-show='Kline.IsShow'></div>

      <div class="topSwiper">
        <div class="oneItem" :class='{activeTopSwiper: TabTextIndex == index}' v-for="(item,index) in PeriodList" :key="index" @click='ChangeChartTab(item.Name,index)'>
          <span>{{item.Name}}</span>
        </div>
        <div class="oneItem" v-show='Kline.IsShow'>
          <div @click="ChangeIndexIcon">
            <span style="font-size:21px;" class="hq-icon hq_iconfont icon-zhibiao"></span>
          </div>
          <div class="index-type" v-show="IsLinetype">
            <ul class="phoneRight indexWrap">
              <li class="phone-tilte">主图指标</li>
              <li v-for='(indexItem,flag) in MainIndex.Content' :key="flag" @click='ChangeKlinIndex(indexItem,flag)' class="indexItem" :class='{active : KlineIndexFlag == flag }'>
                {{indexItem}}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="subindex-box">
        <div class="subindex-nei" @click="CloseSubindexNei" v-show="SubFrame.IsSubIndex">
          <ul>
            <li @click.stop="GetIndexNum"><span>
              <span>设</span>
              <span>置</span>
              <span>参</span>
              <span>数</span>
              </span></li>
            <li @click.stop="GetWindowIDMain"><span>
              <span>切</span>
              <span>换</span>
              <span>指</span>
              <span>标</span>
              </span></li>
          </ul>
        </div>
      </div>

      <div class="setindex-box">
        <div class="set-index" v-show="SubFrame.IsSubNum">
          <div class="set-content">
            <div class="setindex-close"><span class="el-icon-close" @click="CloseIndexNum"></span></div>
            <div class="set-title">设置参数</div>
            <ul>
              <li v-for="(item,index) in IndexList" :key="index">
                <span>{{item.Name}}</span>
                <el-input-number v-model="item.Value"></el-input-number>
              </li>
            </ul>
            <div class="set-ok" @click="SetIndexNum">确定</div>
          </div>
        </div>
      </div>  

      <subIndex :FrameID="Frame.FrameID" :FrameTitle='Frame.FrameTitle' @GetWindowID="GetWindowID" @ChangeSubindex='ChangeSubindex'></subIndex>
      <!-- 切换股票 -->
      <changeSymbol v-show="IsChangeSymbol" @ShowModal="ShowModal" @ChangeSymbol='ChangeSymbol'></changeSymbol>
      <!-- 股票详情 -->
      <div class="symbolInfo">
        <div class="symbolContent">
          <div class="symbol_left">
            <div class="symbol_left_0"  @click='IsShowChangeSymbol'>
              <span class='backIconWrap hq_iconfont icon-liebiaoqiehuan'></span>
            </div>
            <div class="symbol_left_1">
              <div class="symbolCss">{{Symbol}}</div>
              <div class="nameCss">{{StockData.Name.Text}}</div>
            </div>
            <div class="symbol_left_2" :class="StockData.Price.Color">
              {{StockData.Price.Text}}
            </div>
            <div class="symbol_left_1" :class="StockData.Increase.Color">
              <div class="increaseCss topCss ">{{StockData.Increase.Text}}</div>
              <div class="increaseCss_1 bottomCss">{{StockData.RiseFallPrice.Text}}</div>
            </div>
          </div>
          <div class="symbol_right">
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss ">低</span> <span :class="StockData.Low.Color">{{StockData.Low.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">高</span> <span :class="StockData.High.Color">{{StockData.High.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1">
              <div class="topCss1">
                <span class="titleCss">收</span> <span>{{StockData.YClose.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">开</span> <span :class="StockData.Open.Color">{{StockData.Open.Text}}</span>
              </div>
            </div>
            <div class="symbol_right_1 symbol_right_3">
              <div class="topCss1">
                <span class="titleCss">成交额</span> <span>{{StockData.Amount.Text}}</span>
              </div>
              <div class="bottomCss1">
                <span class="titleCss">成交量</span> <span>{{StockData.Vol.Text}}</span>
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
  import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
  import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
  import Tools from "../../../services/tools"
  import $ from 'jquery'
  import "../../../assets/hqiconfont.css"
  import changeSymbol from "./changeSymbol.vue"
  import subIndex from './subIndex.vue'
  import HQChart from 'hqchart'
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

          Border: //边框
          {
              Left: 20, //左边间距
              Right: 20, //右边间距
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
              { Index: "VOL",Modify:false,Change:false, IsDrawTitleBG:true },
              { Index: "MACD",Modify:false,Change:false, IsDrawTitleBG:true },
          ], //窗口指标
          Symbol: symbol,
          IsAutoUpate: true, //是自动更新数据

          IsShowRightMenu: false, //右键菜单

          KLine: {
              DragMode: 3, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
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
              Right: 20, //右边间距
              Top: 1,
              Bottom: 1
          },

          Frame: //子框架设置
          [
            { 
              SplitCount: 3, 
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
            { SplitCount: 2, StringFormat: 0 },
            { SplitCount: 2, StringFormat: 0 }
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
    components:{  changeSymbol,subIndex },
    data () {
      return{
        PeriodList:[
          {Name:"分时",Value:1},
          {Name:"五日",Value:5},
          {Name:"日线",Value:0},
          {Name:"周线",Value:1},
          {Name:"月线",Value:2},
          {Name:"年线",Value:3},
          {Name:"1分钟",Value:4},
          {Name:"5分钟",Value:5},
          {Name:"15分钟",Value:6},
          {Name:"30分钟",Value:7},
          {Name:"60分钟",Value:8}
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
        Frame:{
            FrameID:0,   //当前窗口ID
            FrameTitle:'',   //当前窗口标题
            FrameData:{
              ID:'',
              Title:''
            },
        },
        SubFrame:{
            IsSubIndex: false,    //副图指标选择 
            IsSubNum: false,     //副图指标修改
        },
        Name:"",
        StockData: DefaultData.GetStockData(),
        IsChangeSymbol: false,   //切换股票
        IsLinetype:false,   //切换主图指标
        MainIndex:{Title:'指标',Content:[ 'MA','BOLL','BBI','MIKE','PBX','ENE']},  //主图指标
        KlineIndexFlag:0,
        IndexList:[],    //参数
        Width: 0,
        Height: 0,
      }
    },

    created(){
      if(Tools.getURLParams("symbol")){
        console.log("Tools.getURLParams::::::",Tools.getURLParams("symbol"))
        this.Symbol = Tools.getURLParams("symbol");
      }
      if(Tools.getURLParams("index")){
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
        var width = window.innerWidth -90;
        var chartHeight = window.innerHeight;

        this.Width = window.innerWidth;
        this.Height = window.innerHeight;

        $('#minuteChart').width(width);
        $('#minuteChart').height(chartHeight);

        $('#kline').width(width);
        $('#kline').height(chartHeight);
      },
      ChangeChartTab(name,index){
        this.IsLinetype = false;
        this.IsLinetype = false;
        this.TabTextIndex = index;
        var period=DefaultData.GetPeriodData(name);
        if (!period) return;
        if (period.KLineShow) this.ChangeKLinePeriod(period.Value);
        this.Kline.IsShow=period.KLineShow;
        if (period.MinuteShow) this.ChangeMinutePeriod(period.Value);
        this.Minute.IsShow=period.MinuteShow;           
      },
      ChangeIndexIcon(){
        // this.TabTextIndex = "指标";
        this.IsLinetype = !this.IsLinetype;        
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
        chart.SetOption(this.Kline.Option);
        chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE, callback:this.OnClickIndexTitle});//点击事件通知回调
        this.Kline.JSChart=chart;
      },

      CreateMinuteChart() //创建日线图
      {
        if (this.Minute.JSChart) return;
        this.Minute.Option.Symbol=this.Symbol;
        let chart=JSCommon.JSChart.Init(this.$refs.minute);
        chart.SetOption(this.Minute.Option);
        this.Minute.JSChart=chart;
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

      ShowModal(){
        this.IsChangeSymbol = false;
      },
      ChangeKlinIndex(indexItem,flag){  //修改k线指标
        this.IsLinetype = false;
        this.KlineIndexFlag = flag;
        var indexName = indexItem;
        if(this.Kline.JSChart) this.Kline.JSChart.ChangeIndex(1,indexName);
      },
      
      //点击指标标题回调
      OnClickIndexTitle(event, data, obj)
      {
        console.log('[OnClickIndexTitle] data', data);
        var title = data.Title.split('(');
              
        this.SubFrame.IsSubIndex = true;

        var title1 = title[1].split(')');
        var title2 = title1[0].split(',');
        var list = [];
        for(var i in title2){
          var j = Number(i) + 1;
          var obj = {};
          obj.Name = "M"+j;
          obj.Value = title2[i];
          list.push(obj);
        }
        this.IndexList = list;
        this.Frame.FrameData.ID = data.FrameID;
        this.Frame.FrameData.Title = title[0]; 
      },
      //向子组件传递当前窗口数
      GetWindowIDMain(){
        this.SubFrame.IsSubIndex = false;
        this.Frame.FrameID = this.Frame.FrameData.ID;
        this.Frame.FrameTitle = this.Frame.FrameData.Title;
      },
      GetWindowID(val){
        this.Frame.FrameID = val;
      },
      //切换副图指标
      ChangeSubindex(windowIndex,indexName){
        this.Kline.JSChart.ChangeIndex(windowIndex,indexName);
      },
      CloseSubindexNei(){
        this.SubFrame.IsSubIndex = false;
      },
      GetIndexNum(){
        this.SubFrame.IsSubIndex = false;
        this.SubFrame.IsSubNum = true;
      },

      SetIndexNum(){
        var jsChartContainer=this.GetJSChartContainer();       
        var maIndex=jsChartContainer.WindowIndex[this.Frame.FrameData.ID];
        for(var i in maIndex.Arguments)
        {
          var item=maIndex.Arguments[i];
          for(var j in this.IndexList){
            if(i == j){
              item.Value = this.IndexList[j].Value;
            }
          }
        }
        jsChartContainer.UpdateWindowIndex(this.Frame.FrameData.ID); 
        this.SubFrame.IsSubNum = false;
      },
      GetJSChartContainer()
      {
          var jsChartContainer=null;
          if (this.Kline.IsShow)
          {
              jsChartContainer=this.Kline.JSChart.JSChartContainer;
          } 
          else if (this.Minute.IsShow)
          {
              jsChartContainer=this.Minute.JSChart.JSChartContainer;
          }
          return jsChartContainer;
      },
      CloseIndexNum(){
        this.SubFrame.IsSubNum = false;
      },


    },

  }
</script>
<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
  }
  
  .container
  {
      position:absolute;
      top:    0px;
      left:   0px;
      height: 100%;
      width:100%;
      overflow: hidden;
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
    color: inherit;
}

.subindex-box{
  .subindex-nei{
    position:absolute;
    top:0;
    left:0;
    z-index:101;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,0.8);
    ul{
      position:absolute;
      top:0;
      left:0;
      width: 100px;
      height: 100%;
      background-color: #ffffff;
      border-radius: 0 15px 15px 0;
      // transform:rotate(90deg);
      // transform-origin:center 50%;
      li{
        position: relative;
        display: inline-block;
        width: 45px;
        height: 100%;
        // line-height: 40px;
        text-align: center;
        color:#f29702;
        >span{
          position: absolute;
          top: calc((100% - 100px)/2);
          left:12px;
          display: inline-block;
          width: 20px;
          height: 100px;
          >span{
            display: inline-block;
            transform:rotate(90deg);
            transform-origin:center 50%;
          }
        }
      }
      li:first-child{
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.setindex-box{
  .set-index{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    color: #333333;
    .set-content{
      position: absolute;
      top:calc((100% - 340px)/2);
      left: calc((100% - 340px)/2);
      width: 340px;
      height: 340px;
      transform:rotate(90deg);
      transform-origin:center 50%;
      background-color:#ffffff;
      border-radius:15px;
      .setindex-close{
        position: absolute;
        top: 6px;
        right: 6px;
        font-size: 22px;
        color: #333333;
        >span{
          padding: 5px 10px;
        }
      }
      .set-title{
        padding: 20px 0 0 20px;
        line-height: 40px;
        font-size: 18px;
        color: #f39801;
      }
      ul{
        padding-left: 30px;
        box-sizing: box-sizing;
        li{
          margin: 15px 0;
          >span{
            margin-right:20px;
          }
          .el-input__inner{
            height: 36px;
            line-height: 36px;
          }
          .el-input-number{
            line-height: 34px;
          }
        }
      }
      .set-ok{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        color: #333333;
        border-top: 1px solid #f5f5f5;
      }
    }
  }
}

  .topSwiper{
    /* 80px */
    width: 40px; 
    height: 100%;
    position:absolute;
    top: 0px;
    // right: 100px;
    z-index:50;
    display: flex;
    flex:1;
    flex-direction: column;
    border-left:2px solid #e1ecf2;
    box-sizing: border-box;
    border-right:2px solid #e1ecf2;
    font-size: 1.4rem;
  }

  .oneItem{
    position:relative;
    width: 100%;
    flex:1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ececec;
  }
  .index-type{
    position: absolute;
    bottom:2px;
    left:40px;
    z-index: 100;
    width: 260px;
    height:80px;
    background-color: #ffffff;
    box-shadow: 5px 0px 8px 0 rgba(0, 0, 0, 0.6);
    ul{
      transform: rotate(90deg);
      width:80px;
      margin: -80px 0 0 90px;
      li{
        line-height: 35px;
      }
    }
  }

  .phone-tilte{
    margin-top: 0!important;
    line-height: 30px!important;
    background-color: #ececec;
  }

  .oneItem>span{
    display: block;
    white-space:nowrap;
    transform:rotate(90deg);
  }

  .activeTopSwiper{
    border: 1px solid #217cd9;
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
  display: flex;
  flex-direction: row;
  margin-left: 5px;
  // margin-right: -6px;
}

.symbol_left_1>div{
  width: 50%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  transform:rotate(90deg);
  white-space:nowrap;
}

.nameCss{
  font-size: 16px;
  font-weight: 600;
  padding-top:33px;
  box-sizing: border-box;
}

.symbolCss{
  font-size: 12px;
  color:#676767;
  padding-top:30px;
  box-sizing: border-box;
}



.symbol_left_1>.increaseCss,.symbol_left_1>.increaseCss_1{
  justify-content: flex-start;
  /* align-items: center; */
  font-size: 12px;
  font-weight: 600;
}

.topCss{
  padding-top:27px;
  box-sizing: border-box;
}

.bottomCss{
  padding-top:34px;
  box-sizing: border-box;
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
  height: 30%;
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
  color:#676767;
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