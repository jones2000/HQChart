<template>
    <div class="tradeinfo" ref="tradeinfo">
        <div class="firstLine" ref="bookWrap">
            <p>
                <span>
                    委比：
                    <span :class="BookData.BookRate.Color">{{BookData.BookRate.Text}}</span>
                </span>
            </p>
            <p>
                <span>
                    委差：
                    <span :class="BookData.BookDiff.Color">{{BookData.BookDiff.Text}}</span>
                </span>
            </p>
        </div>
        <div class="sellFive" ref='sellFive'>
            <div>
                <p v-for="(item,index) in SellData" :key="index">
                    <span>{{item.Title}}</span>
                </p>
            </div>
            <div>
                <p v-for="(item,index) in SellData" :key="index" :class="item.Price.Color">
                    <span>{{item.Price.Text}}</span>
                </p>
            </div>
            <div>
                <p v-for="(item,index) in SellData" :key="index">
                    <span>{{item.Vol.Text}}</span>
                </p>
            </div>
        </div>
        <div class="buyFive" ref='buyFive'>
            <div>
                <p v-for="(itemBuy,ind) in BuyData" :key="ind">
                    <span>{{itemBuy.Title}}</span>
                </p>
            </div>
            <div>
                <p v-for="(itemBuy,ind) in BuyData" :key="ind" :class="itemBuy.Price.Color">
                    <span>{{itemBuy.Price.Text}}</span>
                </p>
            </div>
            <div>
                <p v-for="(itemBuy,ind) in BuyData" :key="ind">
                    <span>{{itemBuy.Vol.Text}}</span>
                </p>
            </div>
        </div>
        <div class="detailList" ref="detailList" v-show="IsShowTradeData">
            <div>
                <p v-for="(itemTrade,indexT) in TradeData" :key="indexT">
                    <span>{{itemTrade.Time.Text}}</span>
                </p>
            </div>
            <div>
                <p v-for="(itemTrade,indexT) in TradeData" :key="indexT" :class="itemTrade.Price.Color">
                    <span>{{itemTrade.Price.Text}}</span>
                </p>
            </div>
            <div>
                <p v-for="(itemTrade,indexT) in TradeData" :key="indexT">
                    <span>{{itemTrade.Vol.Text}}&nbsp;<span :class="itemTrade.BS.Color">{{itemTrade.BS.Text}}</span></span>
                </p>
            </div>
            <a :href="MoreDealLink" target='_blank' class="seeMoreDeal">点击查看更多分时成交</a>
        </div>
        <div class="shorttermlist" ref='shorttermlist' v-show="ShortTerm.IsShow">
            <div>
                <p v-for="(item,index) in ShortTerm.Data" :key="index" :class="item.Color">{{item.Time.Text}}</p>
            </div>
            <div>
                <p v-for="(item,index) in ShortTerm.Data" :key="index" :class="item.Color">{{item.Name}}</p>
            </div>
            <div>
                <p v-for="(item,index) in ShortTerm.Data" :key="index" :class="item.Color">{{item.Type.Text}}</p>
            </div>
        </div>
        <div class="capitalList" ref='capitalList' v-show='CapitalFlow.IsShow'><!-- 资金流 -->
            <p class='tabTop'>
                <span v-for='(item,index) in CapitalFlowDayType' :key='index' :class='{active:CapitalFlowDayIndex == index}' @click='ChangeCapitalFlowDay(index)'>{{item}}</span>
            </p>
            <div class='mainFlow'>
                <p><span>主力流入</span><span :class='CurrentDayCapitaData.MainFlowData.In.Color'>{{CurrentDayCapitaData.MainFlowData.In.Text}}</span></p>
                <p><span>主力流出</span><span :class='CurrentDayCapitaData.MainFlowData.Out.Color'>{{CurrentDayCapitaData.MainFlowData.Out.Text}}</span></p>
                <p><span>主力净流向</span><span :class='CurrentDayCapitaData.MainFlowData.NetFlow.Color'>{{CurrentDayCapitaData.MainFlowData.NetFlow.Text}}</span></p>
            </div>
            <div class="orderList">
                <table>
                    <thead>
                        <tr>
                            <td>{{CurrentDayCapitaData.ValueUnit.Text}}</td>
                            <td>流入</td>
                            <td>流出</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='(item,index) in CurrentDayCapitaData.OrderData' :key='index'>
                            <td>{{item.TiTle}}</td>
                            <td :class='item.In.Color'>{{item.In.Text}}</td>
                            <td :class='item.Out.Color'>{{item.Out.Text}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="netValueWrap" ref='netValueWrap'>
                <div class="charWrap" ref='charWrap'>
                    <div class="middleLine" ref='middleLine'></div>
                    <div class="bars">
                        <div class="realArea" v-for='(item,index) in CurrentDayCapitaData.ChartStyleData' :key='index'>
                            <div class='label' :style='item.Label'>{{CurrentDayCapitaData.NetValueData[index].Text}}</div>
                            <div>
                                <div class="content" :style='item.Content'>
                                    <div class='bar' :style='item.Bar'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="xLabels">
                    <span>净超大</span>
                    <span>净大单</span>
                    <span>净中单</span>
                    <span>净小单</span>
                </div>
            </div>
        </div>
        <div class='dealpricelist' ref='dealpricelist' v-show='DealPrice.IsShow' ><!-- 分价表 -->
            <table class='table'>
                <tbody>
                    <tr v-for='(item,index) in DealPriceData' :key='index+"dealprice"'>
                        <td :class='item.Price.Color'>{{item.Price.Text}}</td>
                        <td>{{item.Vol}}</td>
                        <td><span :style='item.Bar'>
                            <span class="buy" :style='item.BuyRate'></span><span class="none" :style='item.NoneRate'></span><span class="sell" :style='item.SellRate'></span>
                            </span>
                        </td>
                        <td>{{item.Rate}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>
<script>
import $ from "jquery";
import JSCommon from "../umychart.vue/umychart.vue.js";
import JSCommonStock from "../umychart.vue/umychart.stock.vue.js";

//默认数据输出
class DefaultData {
    static GetBuyData() {
        let dataAry = [];
        for(let i = 0; i < 5; ++i){
            var obj = {
                Vol: {Text: ""},
                Price: {Text: "",Color: ""},
                Title: ""
            };
            dataAry.push(obj);
        }

        return dataAry;
  }

  static GetSellData() {
    return DefaultData.GetBuyData();
  }

  static GetTradeData() {
    var data = [];
    for (var i = 0; i < 10; ++i) {
      var item = {
        Time: { Text: "" },
        Price: { Text: "", Color: "" },
        Vol: { Text: "" },
        BS: { Text: "", Color: "" }
      };

      data.push(item);
    }

    return data;
  }

  static GetBookData() {
    const data = {
      BookRate: {
        Text: "",
        Color: ""
      },
      BookDiff: {
        Text: "",
        Color: ""
      }
    };
    return data;
  }

  static GetRowStyle() {
    let data = {
      Sell: {
        top: 0,
        height: 0,
        display: "none"
      },
      Buy: {
        top: 0,
        height: 0,
        display: "none"
      },
      Trade: {
        top: 0,
        height: 0,
        display: "none"
      }
    }; //默认都不显示

    return data;
  }

  static GetRowShortStyle() {
    let data = {
      Sell: {
        top: 0,
        height: 0,
        display: "none"
      },
      Buy: {
        top: 0,
        height: 0,
        display: "none"
      },
      Short: {
        top: 0,
        height: 0,
        display: "none"
      }
    }; //默认都不显示

    return data;
  }

  static GetCapitalFlowSingle() {
    let data = {
      MainFlowData: {
        In: { Value: "", Text: "", Color: "PriceUp" },
        Out: { Value: "", Text: "", Color: "PriceDown" },
        NetFlow: { Value: "", Text: "", Color: "" }
      },
      OrderData: [
        {
          TiTle: "超大",
          In: { Value: "", Text: "", Color: "PriceUp" },
          Out: { Value: "", Text: "", Color: "PriceDown" }
        },
        {
          TiTle: "大单",
          In: { Value: "", Text: "", Color: "PriceUp" },
          Out: { Value: "", Text: "", Color: "PriceDown" }
        },
        {
          TiTle: "中单",
          In: { Value: "", Text: "", Color: "PriceUp" },
          Out: { Value: "", Text: "", Color: "PriceDown" }
        },
        {
          TiTle: "小单",
          In: { Value: "", Text: "", Color: "PriceUp" },
          Out: { Value: "", Text: "", Color: "PriceDown" }
        }
      ],
      NetValueData: [
        { TiTle: "净超大", Value: "", Text: "", Color: "", Direction: "" },
        { TiTle: "净大单", Value: "", Text: "", Color: "", Direction: "" },
        { TiTle: "净中单", Value: "", Text: "", Color: "", Direction: "" },
        { TiTle: "净小单", Value: "", Text: "", Color: "", Direction: "" }
      ],
      ValueUnit: { Text: "万元" },
      ChartStyleData: [
        {
          Content: { bottom: "", top: "" },
          Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
          Label: { bottom: "", top: "", color: "" }
        },
        {
          Content: { bottom: "", top: "" },
          Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
          Label: { bottom: "", top: "", color: "" }
        },
        {
          Content: { bottom: "", top: "" },
          Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
          Label: { bottom: "", top: "", color: "" }
        },
        {
          Content: { bottom: "", top: "" },
          Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
          Label: { bottom: "", top: "", color: "" }
        }
      ]
    };
    return data;
  }

  static GetCapitalFlow() {
    let data = [];
    for (let i = 0; i < 4; i++) {
      var dataItem = {
        MainFlowData: {
          In: { Value: "", Text: "", Color: "PriceUp" },
          Out: { Value: "", Text: "", Color: "PriceDown" },
          NetFlow: { Value: "", Text: "", Color: "" }
        },
        OrderData: [
          {
            TiTle: "超大",
            In: { Value: "", Text: "", Color: "PriceUp" },
            Out: { Value: "", Text: "", Color: "PriceDown" }
          },
          {
            TiTle: "大单",
            In: { Value: "", Text: "", Color: "PriceUp" },
            Out: { Value: "", Text: "", Color: "PriceDown" }
          },
          {
            TiTle: "中单",
            In: { Value: "", Text: "", Color: "PriceUp" },
            Out: { Value: "", Text: "", Color: "PriceDown" }
          },
          {
            TiTle: "小单",
            In: { Value: "", Text: "", Color: "PriceUp" },
            Out: { Value: "", Text: "", Color: "PriceDown" }
          }
        ],
        NetValueData: [
          { TiTle: "净超大", Value: "", Text: "", Color: "", Direction: "" },
          { TiTle: "净大单", Value: "", Text: "", Color: "", Direction: "" },
          { TiTle: "净中单", Value: "", Text: "", Color: "", Direction: "" },
          { TiTle: "净小单", Value: "", Text: "", Color: "", Direction: "" }
        ],
        ValueUnit: { Text: "万元" },
        ChartStyleData: [
          {
            Content: { bottom: "", top: "" },
            Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
            Label: { bottom: "", top: "", color: "" }
          },
          {
            Content: { bottom: "", top: "" },
            Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
            Label: { bottom: "", top: "", color: "" }
          },
          {
            Content: { bottom: "", top: "" },
            Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
            Label: { bottom: "", top: "", color: "" }
          },
          {
            Content: { bottom: "", top: "" },
            Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
            Label: { bottom: "", top: "", color: "" }
          }
        ]
      };
      data.push(dataItem);
    }
    return data;
  }

  static GetDealPriceData(){
      let data = [{
        Price:{Text:'',Color:''},
        Vol:0,
        Bar:{width:'20px'},
        Rate:'',
        WidthRate:0,
        BuyRate:{width:'20px'},
        SellRate:{width:'20px'},
        NoneRate:{width:'20px'}
      }];
      return data;
  }
}

function CapticalFlowChartStyle() {}

CapticalFlowChartStyle.DefaultStyleData = function() {
  var chartStyleData = [];
  for (let i = 0; i < 4; i++) {
    var data = {
      Content: { bottom: "", top: "" },
      Bar: { bottom: "", top: "", height: "", bagckgroundColor: "" },
      Label: { bottom: "", top: "", color: "" }
    };
    chartStyleData.push(data);
  }
  return chartStyleData;
};

export default {
  JSCommonStock: JSCommonStock,

  name: "StockTradeInfo",
  props: [
    "IsShareStock", //是否共享使用一个Stock类,
    "DefaultSymbol"
  ],

  data() {
    let data = {
      Symbol: "600000.sh",
      ID: [
        JSCommon.JSChart.CreateGuid(),
        JSCommon.JSChart.CreateGuid(),
        JSCommon.JSChart.CreateGuid(),
        JSCommon.JSChart.CreateGuid()
      ], //[0]=买卖盘  [1]=分笔 [2]=委比委差 [3]=资金流
      JSStock: null,
      RowStyle: DefaultData.GetRowStyle(),

      BuyData: DefaultData.GetBuyData(), //买盘
      SellData: DefaultData.GetSellData(), //卖盘
      IsBuySellInital: false, //第1次 需要初始化

      TradeData: null, //分笔数据
      IsTradeDataInital: false, //第1次 需要初始化
      IsShowTradeData: true, //是否显示

      //短线
      ShortTerm: {
        Data: null, //短线精灵
        IsShow: false, //是否显示
        JSStock: null //数据请求控制器
      },

      //资金流
      CapitalFlow: {
        Data: DefaultData.GetCapitalFlow(), //数据
        IsShow: false //是否显示
      },
      CurrentDayCapitaData: DefaultData.GetCapitalFlowSingle(), //当前类型下的资金流数据
      CapitalFlowDayType: ["当日", "3日", "5日", "10日"],
      CapitalFlowDayIndex: 0,
      CapitalFlowUnit: {
        TextAry: [],
        IsTenThousand: true
      },

      BookData: DefaultData.GetBookData(), //委比委差数据

      DealPrice:
      {
        IsShow:false,
        Data:null,
        JSStock: null //数据请求控制器
      },
      DealPriceData:DefaultData.GetDealPriceData(),
      MoreDealLink:''
    };

    return data;
  },

  mounted() {
    console.log(
      `[StockTradeInfo::mounted] IsShareStock=${this.IsShareStock} ID=${
        this.ID
      }`
    );
    if (this.IsShareStock == true || this.IsShareStock == "true") {
      //外部调用SetJSStock()设置， 内部不创建
    } else {
      this.JSStock = JSCommonStock.JSStockInit();
      this.InitalStock();
      this.JSStock.RequestData();

      // this.MoreDealLink = './stockdeallastest.demo.page.html?symbol=' + this.Symbol;
    }

    this.MoreDealLink = './stockdeallastest.demo.page.html?symbol=' + this.Symbol;

    this.OnSize();
  },

  created() {
    if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol; //默认股票
    
  },

  methods: {
    ChangeCapitalFlowDay(index) {
      this.CapitalFlowDayIndex = index;
      this.CurrentDayCapitaData = this.CapitalFlow.Data[index];
    },
    UpdateBuySell: function(id, arySymbol, dataType, jsStock) {
      if (arySymbol.indexOf(this.Symbol) < 0) return;

      let read = jsStock.GetStockRead(this.ID[0], this.UpdateBuySell); //获取一个读取数据类,并绑定id和更新数据方法
      let aryBuy = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BUY5);
      let arySell = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.SELL5); //买盘数据需要倒序排列
      let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

      let SellTitle = ["卖一", "卖二", "卖三", "卖四", "卖五"];
      let BuyTitle = ["买一", "买二", "买三", "买四", "买五"];

      if (!this.IsPlusNumber(yClose)) return;

      if (
        this.IsBuySellInital == true &&
        (id != this.ID[0] ||
          dataType != JSCommonStock.RECV_DATA_TYPE.BUY_SELL_DATA)
      )
        return;

      console.log("[StockTradeInfo::UpdateBuySell]",this.Symbol,aryBuy,arySell,yClose);

      let buyData = DefaultData.GetBuyData();
      for (var i in aryBuy) 
      {
        var item = aryBuy[i];

        var buyItem = buyData[i];
        buyItem.Title = BuyTitle[i];

        if (item.Price<=0) continue;  //没有价格的 为无效数据

        buyItem.Vol.Text = item.Vol.toString();
        buyItem.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(item.Price,2);
        buyItem.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(item.Price,yClose);
      }

      let sellData = DefaultData.GetSellData();
      for (var i in arySell) 
      {
        var item = arySell[i];

        var selItem = sellData[i];
        selItem.Title = SellTitle[i];

        if (item.Price<=0) continue;  //没有价格的 为无效数据
        
        selItem.Vol.Text = item.Vol.toString();
        selItem.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(item.Price,2);
        selItem.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(item.Price,yClose);
      }

      this.IsBuySellInital = true; //已经初始化了
      this.SellData = sellData.reverse();
      this.BuyData = buyData;
    },
    //设置外部共享的股票数据类
    SetJSStock: function(jsStock) {
      this.JSStock = jsStock;
    },

    //窗口变化UI自适应调整
    OnSize() {
        var tradeinfo = this.$refs.tradeinfo;
        var bookWrap = this.$refs.bookWrap;
        var sellFive = this.$refs.sellFive;
        var buyFive = this.$refs.buyFive;
        var dealpricelist = this.$refs.dealpricelist
        var detailList = this.$refs.detailList;
        var height = tradeinfo.clientHeight;

        var dealpricelistHeight = height - bookWrap.offsetHeight - sellFive.offsetHeight - buyFive.offsetHeight;
        dealpricelist.style.height = dealpricelistHeight + 'px';
        detailList.style.height = (height - 67 - 24* 10 - 3) + 'px';
        
    },

    RequestData: function() {
      this.JSStock.RequestData();
    },

    UpdateBookRate: function(id, arySymbol, dataType, jsStock) 
    {
        if (arySymbol.indexOf(this.Symbol) < 0) return;

        let read = jsStock.GetStockRead(this.ID[2], this.UpdateBookRate); //获取一个读取数据类,并绑定id和更新数据方法
        var bookRate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE) }; //委比
        var bookDiffer = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER) }; //委差

        if ( id != this.ID[2] || dataType != JSCommonStock.RECV_DATA_TYPE.DERIVATIVE_DATA ) return;

        let bookData = DefaultData.GetBookData();
        bookData.BookRate.Text = JSCommon.IFrameSplitOperator.FormatValueString(bookRate.Value, 2) + "%";
        bookData.BookRate.Color = JSCommon.IFrameSplitOperator.FormatValueColor(bookRate.Value,0);
        bookData.BookDiff.Text = bookDiffer.Value;
        bookData.BookDiff.Color = JSCommon.IFrameSplitOperator.FormatValueColor(bookDiffer.Value,0);
        this.BookData = bookData;
        // console.log('[UpdateBookRate BookData]',this.BookData);
    },

    UpdateTrade: function(id, arySymbol, dataType, jsStock) {
      if (arySymbol.indexOf(this.Symbol) < 0) return;

      let read = jsStock.GetStockRead(this.ID[1], this.UpdateTrade); //获取一个读取数据类,并绑定id和更新数据方法
      let aryDeal = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.DEAL);
      let yClose = read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.YCLOSE);

      console.log(
        "[StockTradeInfo::UpdateTrade]",
        this.Symbol,
        aryDeal,
        yClose
      );

      if (!this.IsPlusNumber(yClose) || !aryDeal) return;
      if (
        this.IsTradeDataInital == true &&
        (id != this.ID[1] || dataType != JSCommonStock.RECV_DATA_TYPE.DEAL_DATA)
      )
        return;

      let data = DefaultData.GetTradeData();
      console.log(data)
      for (let i = 0; i < aryDeal.length && i < data.length; i++) {
        var item = aryDeal[i];
        var tradeItem = data[i];
        var newTime = parseInt(item.Time / 100); //去掉秒

        tradeItem.Time.Text = JSCommon.IFrameSplitOperator.FormatTimeString(
          newTime
        );
        tradeItem.Price.Text = JSCommon.IFrameSplitOperator.FormatValueString(
          item.Price,
          2
        );
        tradeItem.Price.Color = JSCommon.IFrameSplitOperator.FormatValueColor(
          item.Price,
          yClose
        );
        tradeItem.Vol.Text = parseInt(item.Vol / 100).toString(); //单位是股 需要/100

        if (item.BS == "B") tradeItem.BS = { Color: "PriceUp", Text: " B" };
        else if (item.BS == "S")
          tradeItem.BS = { Color: "PriceDown", Text: " S" };
        else tradeItem.BS = { Color: "Transparent", Text: " B" }; //使用透明色
      }

      this.IsTradeDataInital = true; //已经初始化了
      this.TradeData = data;
    },

    //资金流
    InitalCapitalFlow: function() {
      //订阅字段
      var field = [
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY3,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY5,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY10
        //JSCommonStock.STOCK_FIELD_NAME.DDE,
        //JSCommonStock.STOCK_FIELD_NAME.DDE3,
        //JSCommonStock.STOCK_FIELD_NAME.DDE5,
        //JSCommonStock.STOCK_FIELD_NAME.DDE10,
      ];
      var read = this.JSStock.GetStockRead(this.ID[3], this.UpdateCapitalFlow); //订阅资金流
      if (this.Symbol != "") {
        read.SetQueryField(this.Symbol, field);
      }
    },

    UpdateCapitalFlow: function(id, arySymbol, dataType, jsStock) 
    {
      let read = jsStock.GetStockRead(this.ID[3], this.UpdateCapitalFlow); //获取一个读取数据类,并绑定id和更新数据方法
      if (!this.CapitalFlow.IsShow) return; //不显示直接返回 不订阅了
      if (arySymbol.indexOf(this.Symbol) < 0) return;

      var flowDay = read.Get(
        this.Symbol,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY
      );
      var flowDay3 = read.Get(
        this.Symbol,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY3
      );
      var flowDay5 = read.Get(
        this.Symbol,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY5
      );
      var flowDay10 = read.Get(
        this.Symbol,
        JSCommonStock.STOCK_FIELD_NAME.CAPITAL_FLOW_DAY10
      );
      if (flowDay) this.RecvCapticalData(flowDay, 0);
      if (flowDay3) this.RecvCapticalData(flowDay3, 1);
      if (flowDay5) this.RecvCapticalData(flowDay5, 2);
      if (flowDay10) this.RecvCapticalData(flowDay10, 3);

      this.CurrentDayCapitaData = this.CapitalFlow.Data[
        this.CapitalFlowDayIndex
      ];

      console.log(
        "[StockTradeInfo::UpdateCapitalFlow]",
        this.Symbol,
        flowDay,
        flowDay3,
        flowDay5,
        flowDay10
      );
    },
    InitCapitalFlowChart(netValueData, chartStyleData) {
      //资金流柱状图
      var data = netValueData;
      var maxValue = 0;
      for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i].Value) > maxValue) {
          maxValue = Math.abs(data[i].Value);
        }
      }

      for (let i = 0; i < data.length; i++) {
        var absValue = Math.abs(data[i].Value);
        var rate = Number(absValue / maxValue).toFixed(4);
        var contentHeight = ($(".charWrap").height() - 1) / 2;
        var rateHeight = Math.floor(rate * contentHeight);
        if(rateHeight == 0 && absValue !== 0){
            rateHeight = 2;
        }
        var contentPos = contentHeight + 1;
        var direction = data[i].Direction;
        // var labelHeight = 18;
        if (direction == "upper") {
          chartStyleData[i] = {
            Content: { bottom: contentPos + "px", top: "auto" },
            Bar: {
              bottom: "0",
              top: "auto",
              height: rateHeight + "px",
              backgroundColor: "#ee1515"
            },
            Label: {
              bottom: "auto",
              top: contentHeight+"px",
              color: "#ee1515"
            }
          };
        } else if (direction == "below") {
          chartStyleData[i] = {
            Content: { bottom: "auto", top: contentPos + "px" },
            Bar: {
              bottom: "auto",
              top: "0",
              height: rateHeight + "px",
              backgroundColor: "#199e00"
            },
            Label: {
              bottom: contentHeight+"px",
              top: "auto",
              color: "#199e00"
            }
          };
        }
      }
    },
    RecvCapticalData(data, index) {
      var superIn = data.SuperIn; //超大单流入
      var superOut = data.SuperOut; //超大单流出
      var bigIn = data.BigIn; //大单流入
      var bigOut = data.BigOut; //大单流出
      var midIn = data.MidIn; //中单流入
      var midOut = data.MidOut; //中单流出
      var smallIn = data.SmallIn; //小单流入
      var smallOut = data.SmallOut; //小单流出
      var mainIn = data.MainIn; //主力流入
      var mainOut = data.MainOut; //主力流出
      var mainNetIn = data.MainNetIn; //主力净流入

      var superNetValue = superIn - superOut;
      var bigNetValue = bigIn - bigOut;
      var midNetValue = midIn - midOut;
      var smallNetValue = smallIn - smallOut;

      var mainFlowData = this.CapitalFlow.Data[index].MainFlowData;
      mainFlowData.In.value = mainIn;
      mainFlowData.In.Text = this.FormatValueString(mainIn,true,0);
      mainFlowData.Out.value = mainOut;
      mainFlowData.Out.Text = this.FormatValueString(mainOut,true,0);
      mainFlowData.NetFlow.value = mainNetIn;
      mainFlowData.NetFlow.Text = this.FormatValueString(mainNetIn,true,0);
      mainFlowData.NetFlow.Color = JSCommon.IFrameSplitOperator.FormatValueColor(
        mainNetIn,
        0
      );

      var orderAry = [
        { In: superIn, Out: superOut },
        { In: bigIn, Out: bigOut },
        { In: midIn, Out: midOut },
        { In: smallIn, Out: smallOut }
      ];
      var OrderData = this.CapitalFlow.Data[index].OrderData;
      for (let i = 0; i < orderAry.length; i++) {
        var orderItem = orderAry[i];
        OrderData[i].In.Value = orderItem.In;
        OrderData[i].In.Text = this.FormatValueString(orderItem.In,false,0);
        OrderData[i].Out.Value = orderItem.Out;
        OrderData[i].Out.Text = this.FormatValueString(orderItem.Out,false,0);
      }

      var netValue = [
        { Value: superNetValue },
        { Value: bigNetValue },
        { Value: midNetValue },
        { Value: smallNetValue }
      ];
      var netValueData = this.CapitalFlow.Data[index].NetValueData;
      for (let j = 0; j < netValue.length; j++) {
        var netItem = netValue[j];
        netValueData[j].Value = netItem.Value;
        netValueData[j].Text = this.FormatValueString(netItem.Value,false,0);
        netValueData[j].Color = JSCommon.IFrameSplitOperator.FormatValueColor(
          netItem.Value,
          0
        );
        netValueData[j].Direction = netItem.Value > 0 ? "upper" : "below";
      }

      var chartStyleData = this.CapitalFlow.Data[index].ChartStyleData;
      this.InitCapitalFlowChart(netValueData, chartStyleData);

      this.CapitalFlow.Data[index].MainFlowData = mainFlowData;
      this.CapitalFlow.Data[index].OrderData = OrderData;
      this.CapitalFlow.Data[index].NetValueData = netValueData;
      this.CapitalFlow.Data[index].ChartStyleData = chartStyleData;
    },
    FormatValueString:function(value,HasUnit,floatCount){
        if(HasUnit){
            return Number(value / 10000).toFixed(floatCount) + '万元';
        }else{
            return Number(value / 10000).toFixed(floatCount);
        }
    },
    //切换股票代码
    SetSymbol: function(symbol) {
      if (this.Symbol == symbol) return;

      console.log(`[StockTradeInfo::SetSymbol] symbol=${this.Symbol}`);

      this.Symbol = symbol;
      this.IsBuySellInital = false;
      this.IsTradeDataInital = false;
      this.InitalStock(); //订阅数据
      if (this.IsSHSZIndex(this.Symbol)) this.ShowCapitalFlow(false);
      else this.InitalCapitalFlow();
      if (!this.IsShareStock) this.JSStock.RequestData();

      this.MoreDealLink = './stockdeallastest.demo.page.html?symbol=' + this.Symbol;

      //分价表是显示的状态,切换股票更新
      if (this.DealPrice.JSStock && this.DealPrice.IsShow) 
      {
        this.DealPrice.JSStock.Symbol=this.Symbol;
        this.DealPrice.JSStock.RequestData();
      }
    },

    //初始化
    InitalStock: function() {
      if (this.IsSHSZIndex()) return; //指数没有买卖盘

      // 分成3个ID 分开取
      let read = this.JSStock.GetStockRead(this.ID[0], this.UpdateBuySell); //订阅买卖盘数据
      read.SetQueryField(this.Symbol, [
        JSCommonStock.STOCK_FIELD_NAME.BUY5,
        JSCommonStock.STOCK_FIELD_NAME.SELL5,
        JSCommonStock.STOCK_FIELD_NAME.YCLOSE
      ]);

      read = this.JSStock.GetStockRead(this.ID[1], this.UpdateTrade); //订阅成交明细
      read.SetQueryField(this.Symbol, [
        JSCommonStock.STOCK_FIELD_NAME.DEAL,
        JSCommonStock.STOCK_FIELD_NAME.YCLOSE
      ]);

      read = this.JSStock.GetStockRead(this.ID[2], this.UpdateBookRate); //订阅委比委差
      read.SetQueryField(this.Symbol, [
        JSCommonStock.STOCK_FIELD_NAME.BOOK_RATE,
        JSCommonStock.STOCK_FIELD_NAME.BOOK_DIFFER
      ]);
    },

    IsSHSZIndex: function() {
      return JSCommon.MARKET_SUFFIX_NAME.IsSHSZIndex(this.Symbol);
    },

    //改变显示数据
    ChangeShowData: function(name, value) {
      console.log("[StockTradeInfo::ChangeShowData]", name, value);
      switch (name) {
        case "分笔":
          this.IsShowTradeData = true;
          this.ShowShortTerm(false);
          this.ShowCapitalFlow(false);
          this.ShowDealPrice(false);
          break;
        case "异动":
          this.IsShowTradeData = false;
          this.ShowCapitalFlow(false);
          this.ShowDealPrice(false);
          this.ShowShortTerm(true);
          break;
        case "资金":
          this.IsShowTradeData = false;
          this.ShowShortTerm(false);
          this.ShowDealPrice(false);
          this.ShowCapitalFlow(true);
          break;
        case "分价":
          this.IsShowTradeData=false;
          this.ShowShortTerm(false);
          this.ShowCapitalFlow(false);
          this.ShowDealPrice(true);
          break;
      }
      this.OnSize();
    },

    //移动显示
    ShowShortTerm: function(isShow) {
      if (isShow) {
        if (!this.ShortTerm.JSStock) this.ShortTerm.JSStock = JSCommonStock.JSStock.GetShortTerm();
        var shortTerm = this.ShortTerm.JSStock;
        shortTerm.UpdateUICallback = this.UpdateShortTerm;
        shortTerm.IsAutoUpdate = true;
        shortTerm.RequestData();
        this.ShortTerm.IsShow = true;
      } else {
        this.ShortTerm.IsShow = false;
        if (!this.ShortTerm.JSStock) return;
        this.ShortTerm.JSStock.IsAutoUpdate = false;
        this.ShortTerm.JSStock.Stop();
      }
    },

    //资金流显示
    ShowCapitalFlow: function(isShow) {
      if (isShow) {
        this.CapitalFlow.IsShow = true;
        this.InitalCapitalFlow();
        this.RequestData();
      } else 
      {
        this.JSStock.Unsubscribe(this.ID[3]);
        this.CapitalFlow.IsShow = false;
      }
    },

    UpdateShortTerm: function(data) {
      console.log("[StockTradeInfo::UpdateShortTerm] recv data", data);
      var showData = [];
      for (var i in data.Data) {
        var item = data.Data[i];
        var showItem = {
          Name: item.Name,
          Symbol: item.Symbol,
          Type: {
            Text: item.TypeInfo,
            Value: item.Type
          },
          Time: {
            Value: item.Time
          },
          Color: "PriceNull"
        };
        showItem.Time.Text = JSCommon.IFrameSplitOperator.FormatTimeString(
          parseInt(showItem.Time.Value / 100)
        );
        showItem.Color =
          showItem.Type.Value % 10 === 1 ? "PriceUp" : "PriceDown";
        showData.push(showItem);
      }
      this.ShortTerm.Data = showData;
      this.OnSize();
    },


    ShowDealPrice:function(isShow)
    {
      if (isShow)
      {
        this.DealPrice.IsShow=true;
        if (!this.DealPrice.JSStock) this.DealPrice.JSStock = JSCommonStock.JSStock.GetDealPriceListData();
        var dealPrice = this.DealPrice.JSStock;
        dealPrice.Symbol=this.Symbol;
        dealPrice.UpdateUICallback = this.UpdateDealPrice;
        dealPrice.IsAutoUpdate = true;
        dealPrice.RequestData();
      }
      else
      {
        this.DealPrice.IsShow=false;
        if (!this.DealPrice.JSStock) return;
        this.DealPrice.JSStock.IsAutoUpdate = false;
        this.DealPrice.JSStock.Stop();
      }
    },

    UpdateDealPrice:function(dealPrice)  //分价表
    {
        console.log('[StockTradeInfo::UpdateDealPrice]', dealPrice.Data);
        var yClose = dealPrice.Data.Day.YClose;
        var priceList = dealPrice.Data.PriceList;
        var maxVol = 0;
        for(let i = 0; i < priceList.length; ++i){
            var item = priceList[i];
            if(item.Vol > maxVol){
                maxVol = item.Vol;
            }
        }
        var tdWPer = 0.25;
        var paddingRight = 5;
        var barWidth = this.$refs.dealpricelist.clientWidth * tdWPer - paddingRight;
        var data = [];
        for(let i = 0; i < priceList.length; ++i){
            var item = priceList[i];
            var vol = item.Vol;
            var buyRate = item.BuyVol / vol;
            var sellRate = item.SellVol / vol;
            var noneRate = item.NoneVol / vol;

            var dealPriceObj = {};
            
            var barStyle = {width:'20px'};
            dealPriceObj.Price = {Text:JSCommon.IFrameSplitOperator.FormatValueString(item.Price,2),Color:'',Value:item.Price} ;
            dealPriceObj.Vol = parseInt(item.Vol/100);
            dealPriceObj.Rate = JSCommon.IFrameSplitOperator.FormatValueString(item.Proportion * 100, 2) + '%';
            var color = JSCommon.IFrameSplitOperator.FormatValueColor(item.Price,yClose);
            dealPriceObj.Price.Color = color;
            // if(color == 'PriceUp'){
            //     barStyle.backgroundColor = '#f00';
            // }else if(color == 'PriceDown'){
            //     barStyle.backgroundColor = '#0f0';
            // }else{
            //     barStyle.backgroundColor = '#ccc';
            // }
            
            dealPriceObj.WidthRate = item.Vol / maxVol;
            var totalWidth = barWidth * dealPriceObj.WidthRate > 1 ? barWidth * dealPriceObj.WidthRate : 1;
            barStyle.width = totalWidth + 'px';
            
            var buyWidth = buyRate * totalWidth + 'px';
            var sellWidth = sellRate * totalWidth + 'px';
            var noneWidth = noneRate * totalWidth + 'px';
            dealPriceObj.BuyRate = {width:buyWidth};
            dealPriceObj.SellRate = {width:sellWidth};
            dealPriceObj.NoneRate = {width:noneWidth};

            dealPriceObj.Bar = barStyle;
            data.push(dealPriceObj);
        }
        data.sort( (l,r) => r.Price.Value-l.Price.Value );
        this.DealPriceData = data;
        console.log(`[::StockTradeInfo]backgroundColor:`,this.DealPriceData);
    },


    IsNumber: JSCommon.IFrameSplitOperator.IsNumber, //是否是数值型
    IsPlusNumber: JSCommon.IFrameSplitOperator.IsPlusNumber //是否是>0的数值型
  }
};
</script>

<style lang="less" scoped>
@border: 1px solid #e1ecf2;

html,
body,
div,
p,
span,
li {
  font: 14px / normal "Microsoft Yahei";
}

* {
  padding: 0;
  margin: 0;
}

ol,
ul {
  list-style: none;
}

.PriceUp,
.PriceUp > span {
  color: #ee1515 !important;
}

.PriceDown,
.PriceDown > span {
  color: #199e00 !important;
}

.PriceNull {
  color: inherit;
}

.Transparent {
  color: rgba(255, 0, 255, 0);
}

.tradeinfo {
  border: @border;
  width: 100%;
  height: 100%;
  position: relative;

  .firstLine {
    width: 100%;
    border-bottom: @border;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;

    > p {
      flex-grow: 1;
      line-height: 67px;
    }
  }

  .buyFive,
  .sellFive,
  .detailList,
  .shorttermlist {
    border-bottom: @border;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;

    > div {
      flex-grow: 1;
      height: 100%;

      p {
        line-height: 24px;
      }
    }

    > div:nth-of-type(3),
    > div:nth-of-type(2) {
      p {
        width: 100%;
        text-align: right;
      }
    }
  }

  .detailList,
  .shorttermlist {
    border-bottom: none;
  }
  .detailList{
      position: relative;
      width: 100%;
      overflow-y: hidden;
      .seeMoreDeal{
        text-decoration: none;
        color: #317ef3;
        opacity: 0.7;
        position: absolute;
        right: 10px;
        bottom: 5px;
        display: inline-block;
        padding: 2px 3px;
        background-color: #fff;
      }
      .seeMoreDeal:hover{
        opacity: 1;
      }
  }
  .capitalList {
    .tabTop {
      width: 100%;
      display: flex;
      flex-direction: row;
      border-bottom: @border;
      > span {
        flex-grow: 1;
        border-right: @border;
        display: inline-block;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
      }
      > span:hover {
        color: #093e8a;
      }
      > span.active {
        color: #093e8a;
        background-color: #e1ecf2;
      }
      > span:last-child {
        border-right: none;
      }
    }
    .mainFlow {
      border-bottom: @border;
      > p {
        display: flex;
        flex-direction: row;
        > span {
          flex-grow: 1;
          padding: 0 8px;
          display: inline-block;
          line-height: 22px;
        }
        > span:last-child {
          text-align: right;
        }
      }
    }
    .orderList {
      border-bottom: @border;
      table {
        width: 100%;
        td {
          line-height: 22px;
          padding: 0 8px;
        }
        tr > td:nth-of-type(2),
        tr > td:nth-of-type(3) {
          text-align: right;
        }
      }
    }
    .netValueWrap {
      padding: 4px 8px;
      > .charWrap {
        border: @border;
        width: 100%;
        height: 93px;
        position: relative;
        .middleLine {
          width: 100%;
          height: 1px;
          background-color: #e1ecf2;
          position: absolute;
          left: 0;
          top: 46px;
        }
        .bars {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: row;
          .realArea {
            /*横向平铺*/
            flex-grow: 1;
            height: 100%;
            padding: 0 15px;
            position: relative;
            .label {
                font-size: 12px;
                height: 18px;
                width: 100%;
                position: absolute;
                left:0;
                text-align: center;
            }
            > div {
              width: 100%;
              height: 100%;
              position: relative;
              .content {
                /*包含柱条，文本，left，bottom值确定方向*/
                position: absolute;
                width: 100%;
                height: 46px;
                bottom: 47px; /*上方*/
                .bar{
                  position: absolute;
                  left: 0;
                  display: inline-block;
                  width: 100%;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      > .xLabels {
        width: 100%;
        display: flex;
        height: 22px;
        flex-direction: row;
        > span {
          flex-grow: 1;
          line-height: 22px;
          display: inline-block;
          text-align: center;
        }
      }
    }
  }
  .dealpricelist{
      overflow-y: auto;
    .table{
        border-collapse: collapse;
        border-spacing: 0;
        border: none;
        tr>td{
            width: 25%;
            line-height: 22px;
            box-sizing: border-box;
        }
        tr>td:nth-of-type(2),tr>td:last-child{
            text-align: right;
        }
        tr>td:nth-of-type(2){
            padding-right: 5px;
        }
        td>span{
            vertical-align: middle;
            display:inline-block;
            height: 14px;
            .buy,.sell,.none{
                display: inline-block;
                height: 14px;
            }
            .buy{
                background-color: red;
            }
            .sell{
                background-color: green;
            }
            .none{
                background-color: #ccc;
            }
        }

    }  
  }
  
}
</style>