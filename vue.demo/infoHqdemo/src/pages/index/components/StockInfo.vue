<template>
  <div id="stockinfo" class="topWrap clearfix" ref='stockinfo' :class='blackStyle ? "klineDarkTheme" :"klineLightTheme"'>
      <!-- :style='CellStyle[0]' -->
      <div class="header_up">
          <!-- 股票名称 股票代码 -->
          <div class="stockName" >{{StockData.Name.Text}}</div>
          <div class="code">({{Symbol}})</div>
      </div>

      <div class="header_down">
          <!-- 股票价格 涨幅 日期 -->
          <div class="priceInfo">
              <div>
                  <div class="priceCurrentNum" :class='StockData.Price.Color'>
                      {{StockData.Price.Text}}
                  </div>
                  <div class="dateCurrent">
                      {{ StockData.Date.Text}}
                  </div>
              </div>
              <div>
                  <div 
                      v-if = "StockData.Price.Color == 'PriceUp'" 
                      :class='StockData.Price.Color' class="upDownIcon">↑</div>
                  <div 
                      v-else-if = "StockData.Price.Color == 'PriceDown' && StockData.Price.Text != 0" 
                      :class='StockData.Price.Color' class="upDownIcon">↓</div>
                  <div v-else  >--</div>
                  <div class="dateCurrent">
                      <!-- {{StockData.Time.Text}} -->
                      15:00
                  </div>
              </div>
              <!-- 股票增长、涨幅 -->
              <div>
                  <div class="riseNum" :class='StockData.RiseFallPrice.Color'>
                      {{StockData.RiseFallPrice.Text}}
                  </div>
                  <div class="risePrecent" :class='StockData.Increase.Color'>
                      {{StockData.Increase.Text}}
                  </div>
              </div>
          </div>

          <!-- 今开 昨收 -->
          <div class='otherInfo' >
              <div class="open">今开：<span :class='StockData.Open.Color'>{{StockData.Open.Text}}</span></div>
              <div class="yClose">昨收：<span :class='StockData.Open.Color'>{{StockData.YClose.Text}}</span></div>
              
          </div>
          
          <!--最高 最低  -->
          <div class='otherInfo' >
              <div class="high">最高：<span :class='StockData.High.Color'>{{StockData.High.Text}}</span></div>
              <div class="low">最低：<span :class='StockData.Low.Color'>{{StockData.Low.Text}}</span></div>
          </div>
          
          <!--成交额 成交量 :style='CellStyle[4]' -->
          <div class='otherInfo' >
              <div class="num">成交额：<span>{{StockData.Amount.Text}}</span></div>
              <div class="totalValue">成交量：<span>{{StockData.Vol.Text}}</span></div>
          </div>

          <!--振幅 换手 :style='CellStyle[4]' v-if='IsIndex==false?true:false'-->
          <!-- <div class='otherInfo' >
              <div class="num" >振幅：<span>{{StockData.Amplitude.Text}}%</span></div>
              <div class="change" v-if='IsIndex==false?true:false'>换手：
                  <span>{{StockData.Excahngerate.Text}}%</span>
              </div>
              <div class="change" v-if='IsIndex==true?true:false'>昨收：<span>{{StockData.YClose.Text}}</span></div>
          </div> -->

          <div class='otherInfo' v-if='IsIndex==false?true:false'>
              <div class="num" >市盈率：<span>{{StockData.Pe.Text}}</span></div>
              <!-- <div class="totalValue" v-if='IsIndex==false?true:false'>市净率：<span>{{StockData.Pb.Text}}</span></div> -->
              <div class="num" >市龄(年)：<span>{{StockData.ReleaseDate.Text}}</span></div>
          </div>

          <!-- <div class='otherInfo' v-if='IsIndex==false?true:false'>
              <div class="num">市龄(年)</div>
              <div class="totalValue"><span>{{StockData.ReleaseDate.Text}}</span></div>
          </div> -->

          <div class="symbolType" v-if='IsIndex==false?true:false'>
              <span title='融资融券标的' v-if='StockData.IsMargin'>
                  <svg class="icon iconStockinfo" aria-hidden="true">
                      <use xlink:href="#icon-margin"></use>
                  </svg>
              </span>
              <span title='沪港通|深股通' v-if='StockData.IsSHHK || StockData.IsSZHK'>
                  <svg class="icon iconStockinfo" aria-hidden="true">
                      <use xlink:href="#icon-shhk"></use>
                  </svg>
              </span>
              <span :title='"AH股\n港股："+StockData.HK.Symbol' v-if='StockData.IsHK'>
                  <svg class="icon iconStockinfo" aria-hidden="true">
                      <use xlink:href="#icon-hk"></use>
                  </svg>
              </span>
              <span title='科创板' v-if='IsKCB'>
                  <svg class="icon iconStockinfo" aria-hidden="true">
                      <use xlink:href="#icon-stockStar"></use>
                  </svg>
              </span>
          </div>
      </div>
      
  </div>
</template>

<script>
  import $ from 'jquery'
  // import JSCommon from '../../../jscommon/umychart.vue/umychart.vue.js'
  // import JSCommonStock from '../../../jscommon/umychart.vue/umychart.stock.vue.js'
  // import SearchSymbol from '../../../jscommon/umychart.vue.components/searchsymbol.vue'
  // import '../../../jscommon/umychart.resource/font/fontSymbol.js'
  // import '../../../jscommon/umychart.resource/font/fontSymbol.css'
  import moment from "moment"

  import HQChart from 'hqchart'
  import JSCommon from 'hqchart/src/jscommon/umychart.vue/umychart.vue.js'
  import JSCommonStock from 'hqchart/src/jscommon/umychart.vue/umychart.stock.vue.js'
  import 'hqchart/src/jscommon/umychart.resource/font/fontSymbol.js'
  import 'hqchart/src/jscommon/umychart.resource/font/fontSymbol.css'
  import SearchSymbol from '../../../components/searchsymbol.vue'

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
          Date:{Text:""},
          Time:{text:""},
          ReleaseDate:{Text:""},

          Excahngerate: { Text: '', Color: 'PriceNull' },
          Amount: { Text: '' }, Vol: { Text: '' },
          Pe: { Text: '' }, Roe: { Text: '' },
          MarketV: { Text: '' }, FlowMarketV: { Text: '' },
          Eps: { Text: '' }, ScrollEPS: { Text: '' },
          Pb: { Text: '' }, Amplitude: { Text: '',Value:null },

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
              "blackStyle"
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
              IsKCB: false,            //是否是科创板
              IsShow: {
                  SearchSymbol: false,
                  IconStyle: true
              },

          }

          return data;
      },
      watch:
      {

      },
      mounted() {
          console.log("IsShareStock",this.IsShareStock);
          // console.log(`[StockInfo::mounted] IsShareStock=${this.IsShareStock} ID=${this.ID}`);


          if (this.IsShareStock == true || this.IsShareStock == 'true')    //外部调用SetJSStock()设置， 内部不创建, 请求和订阅 都由外部调用
          {
              
          }
          else {
              console.log("//不共享的JSStock");
              //数据get1
              this.getHeaderData();
              
              //数据get2
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
          this.IsKCB = this.IsSHStockSTAR();//是否是科创板
      },
      methods: {
          //头部历史数据请求
          getHeaderData(){
              var inputData = {
                  "symbol":this.Symbol, 
                  "field":["price","date","increase","risefall","open","high","low","yclose","amount","vol","pe","exchangerate","eps"],     
                  "condition": [ {"item":["date","int32","gte",moment().add(-15,"day").format("YYYYMMDD"),"lte",moment().format("YYYYMMDD")]} ],
                  "orderfield":"date",         
                  "order":-1,   
                  "start":0,
                  "end":15
              },
              self = this;
              $.ajax({
                  url: "http://opensource.zealink.com/API/StockHistoryDay",
                  data: inputData,
                  method: 'POST',
                  dataType: 'json',
                  success: function (data) {
                      self.historyResult(data);
                  },
                  fail: function (request) {
                      console.log("接口错误！")
                  }
              });
          },
          //历史数据回调函数
          historyResult(res){
              console.log("historyResult",res.stock[0]);
              var result = res.stock[0].stockday;
              var currentDate = moment().format("YYYYMMDD");
              var prvData = Object.assign({}, res.stock[0]);
              for(var i in result){
                  var item = result[i];
                  if(currentDate != (item.date+"")){
                      prvData.stockday = item;
                      break;
                  }
              }
              
              console.log("historyResult prvData",prvData);
              this.UpdateData1(prvData);
          },
          GoSearch() {
              this.IsShow.SearchSymbol = true;
              this.IsShow.IconStyle = false;
              this.$refs.mySymbol.DeletSymbel();
          },
          
          CancelSearch() {
              this.IsShow.SearchSymbol = false;
              this.IsShow.IconStyle = true;
          },
          //无用 初始化
          InitalStock: function () {
              console.log("[StockInfo::InitalStock]");
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
                      JSCommonStock.STOCK_FIELD_NAME.COMPANY_RELEASEDATE,
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
                      JSCommonStock.STOCK_FIELD_NAME.INDEXTOP
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
          //是否是科创板
          IsSHStockSTAR: function(){
              return JSCommon.MARKET_SUFFIX_NAME.IsSHStockSTAR(this.Symbol);
          },
          GetHeight() {
              return $('#stockinfo').outerHeight(true) + 1;
          },
          //数据到达
          UpdateData1: function (res) {
              var isIndex = this.IsSHSZIndex();

              let data = {};    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}
              data.Name = { Text: res.name };
              data.Date = { Value: res.stockday.date, Text: '--' };
              data.Time = { Value: "", Text: '--' };
              data.Price = { Value: res.stockday.price, Color: '', Text: '--' };
              data.RiseFallPrice = { Value: res.stockday.risefall };
              data.Increase = { Value: res.stockday.increase, Color: '', Text: '--' };
              data.High = { Value: res.stockday.high, Color: '', Text: '--' };
              data.Low = { Value: res.stockday.low, Color: '', Text: '--' };
              data.Open = { Value: res.stockday.open, Color: '', Text: '--' };
              data.Amount = { Value: res.stockday.amount, Text: '--' };
              data.Vol = { Value: res.stockday.vol, Text: '--' };
              
              let yClose = res.stockday.yclose;
              data.YClose = { Value: yClose, Text: '--' };

              data.ReleaseDate = { Value: "",Text: '--'  };

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
              
              if (isIndex) 
              {
                  //成交量直接加上单位“手”
                  data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value, 2) + "手";
              } 
              else 
              {   
                  
                  data.Pe = { Value: res.stockday.pe, Text: '--' };
                  data.Pe.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Pe.Value, 2);
                  
                  //成交量需要除以100再加单位“手”
                  data.Vol.Text = JSCommon.IFrameSplitOperator.FormatValueString(data.Vol.Value/100, 2) + "手";
              }

              if(data.Date && data.Date.Value){
                  data.Date.Text = (data.Date.Value+"").substring(0,4)+"-"+(data.Date.Value+"").substring(4,6)+"-"+(data.Date.Value+"").substring(6,8);
              }

              if(data.Time && data.Time.Value){
                  data.Time.Text = (data.Time.Value+"").substring(0,2)+":"+(data.Time.Value+"").substring(2,4);
              }

              this.StockData = data;
  
              console.log('[StockInfo::UpdateData]', this.StockData);
          },
          //数据到达
          UpdateData: function (id, arySymbol, dataType, jsStock) {
              console.log('[StockInfo::UpdateData] ', id, arySymbol, dataType, jsStock, this.ID);
              if (id != this.ID) return;
              if (arySymbol.indexOf(this.Symbol) < 0) return;

              var isIndex = this.IsSHSZIndex();

              let read = jsStock.GetStockRead(this.ID, this.UpdateData); //获取一个读取数据类,并绑定id和更新数据方法
              let data = {};    //数据取到的数据 数据名称：{ Value:数值(可以没有), Color:颜色, Text:显示的文本字段(先给默认显示)}

              data.ReleaseDate = { Value: read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.COMPANY_RELEASEDATE),Text: '--'  };
              if(data.ReleaseDate.Value){
                  var myDate = new Date(),yy = myDate.getFullYear();
                  data.ReleaseDate.Text = yy - ((data.ReleaseDate.Value + "").substring(0,4) - 0);
              }
              console.log("data.ReleaseDate",data.ReleaseDate);
              if (!isIndex){
                  let events=read.Get(this.Symbol, JSCommonStock.STOCK_FIELD_NAME.EVENTS);
                  if (events)
                  {
                      console.log(events)
                      data.HK = events.HK;
                      data.IsMargin=events.IsMargin; ////是否是融资融券标题
                      data.IsHK=events.IsHK;  //是否有港股
                      data.IsSHHK=events.IsSHHK;  //沪港通
                      data.IsSZHK=events.IsSZHK;  //沪港通
                  }
              }

              this.StockData.ReleaseDate = data.ReleaseDate;
              this.StockData.HK = data.HK;
              this.StockData.IsMargin = data.IsMargin;
              this.StockData.IsHK = data.IsHK;
              this.StockData.IsSHHK = data.IsSHHK;
              this.StockData.IsSZHK = data.IsSZHK;
          },
          //无用 设置外部共享的股票数据类
          SetJSStock: function (jsStock) {
              this.JSStock = jsStock;
          },
          //无用 股票代码编辑框切换股票事件
          OnChangeSymbol: function (symbol) {
              this.IsShow.SearchSymbol = false;
              this.IsShow.IconStyle = true;
              this.SetSymbol(symbol);
              if (this.ChangeSymbolCallback) this.ChangeSymbolCallback(symbol);
          },
          //无用
          SetChangeSymbolCallback: function (func) {
              this.ChangeSymbolCallback = func;
          },

          //无用 切换股票代码
          SetSymbol: function (symbol) {
              if (this.Symbol == symbol) return;

              this.Symbol = symbol;
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
              var width = stockInfo ? stockInfo.offsetWidth :"";
              const MAX_CELL_WIDTH = 100;    //最小宽度
              // console.log('[StockInfo::OnSize]', width);

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
                  // console.log(`[StockInfo::OnSize] showCont=${showCount}`);

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

              // console.log('[StockInfo::OnSize]', cellStyle);
              this.CellStyle = cellStyle;
          }
      }
  }
</script>

<style scoped lang="scss">
  $border: 1px solid #e1ecf2;
  
  #stockinfo{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 112px;
      .header_up{
          height: 47px;
          width: 100%;
          border-bottom: 2px solid #1e52a6;
          display: flex;
          align-items: center;
          .stockName{
              font-size: 24px;
              margin-right: 20px;
          }
          .code{
              font-size: 14px;
              box-sizing: border-box;
              padding-top:10px;
          }
      }

      .header_down{
          display: flex;
          justify-content: space-between;
          width:100%;
          height: 64px;
          align-items: center;
          .priceInfo{
              display: flex;
              flex-direction: row;
              border-right: 1px solid #badbf6;
              padding-right: 24px;
              >div{
                  margin-right: 14px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
              }
              .priceCurrentNum {
                  font-size: 18px; 
              }
              .priceCurrent {
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                  .riseNum {
                      flex-grow: 1;
                  }
                  .risePrecent {
                      flex-grow: 2;
                  }
              }
              .upDownIcon{
                  font-size: 18px;
              }
 
          }
          .otherInfo{
              >div{
                  font-size: 14px;
              }
          }

          .dateCurrent{
              font-size: 14px;
          }
          .symbolType {
              flex-direction: row;
              .iconStockinfo {
                  font-size: 22px;
              }
          }
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

      .topWrap .otherInfo ul {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
      }

      .topWrap .otherInfo li {
          flex-grow: 1;
      }
      
  }
  .klineDarkTheme{
      .stockName,.code,.dateCurrent,.otherInfo>div{
          color:#fff !important;
      }
  }
      
  .klineLightTheme{
      .stockName,.code,.otherInfo>div{
          color:#1e52a6 !important;  
      }
      .dateCurrent{
          color:#888 !important;
      }
  }
  .icon{
      width:1em;
      height:1em;
  }
</style>