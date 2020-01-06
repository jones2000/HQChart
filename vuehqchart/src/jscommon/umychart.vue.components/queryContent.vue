<template>
  <div id="content">
    <div class="pagePrompt">历史数据从2018年开始，当天数据每天18:00以后才有</div>
    <div class="content_top">
      <div class="top_title">
        <p class="name">{{ContentTopData.Name}}</p>
        <div class="topSearchWrap">
          <div>
            <p class="symbolText">{{ContentTopData.Symbol}}</p>
            <button class="searchBtn" @click="GoSearch">股票查询</button>
          </div>

          <div class="editSymbol" v-show="IsShow.Search">
            <SearchSymbol ref="mySymbol" @inputValue="searchSymbol"></SearchSymbol>
            <button class="cancelBtn" @click="CancelSearch">取消</button>
          </div>
        </div>
      </div>
      <div class="top_title2">
        <p>成交日期</p>
        <p>{{ContentTopData.TradeDate}}</p>
      </div>
      <div class="priceWrap">
        <p class="price" :class="ContentTopData.Price.Color">收盘：{{ContentTopData.Price.Text}}</p>
      </div>
      <div class="stockInfoWrap">
        <p class="open" :class="ContentTopData.Open.Color">开盘：{{ContentTopData.Open.Text}}</p>
        <p class="yclose">昨收：{{ContentTopData.YClose}}</p>
      </div>
      <div class="datePickerWrap">
        <el-date-picker
          v-model="DataPicker"
          format="yyyyMMdd"
          value-format="yyyyMMdd"
          type="date"
          placeholder="选择日期"
          @change="changeTime"
          :picker-options="pickerOptions0"
        ></el-date-picker>
      </div>
      <div id="searchContainer">
        <el-button @click="downJson" type="primary">下载</el-button>
      </div>
    </div>

    <div ref="selectOrderWrap" id="selectOrderWrap">
      <div class="tabWrap">
        <span
          v-for="(item,index) in TabTexts"
          :key="index"
          :class="{active:index == TabIndex}"
          @click="ChangeContentShow(index)"
        >{{item}}</span>
      </div>
      <div class="selectorForDealDetail" v-show="IsShow.DealDetail">
        <span style="padding-left:20px;">筛选大单：</span>
        <el-radio-group v-model="OrderType">
          <el-radio :label="''">全部</el-radio>
          <el-radio :label="100">≥100手</el-radio>
          <el-radio :label="200">≥200手</el-radio>
          <el-radio :label="500">≥500手</el-radio>
          <el-radio :label="1000">≥1000手</el-radio>
          <el-radio :label="2000">≥2000手</el-radio>
          <el-radio :label="5000">≥5000手</el-radio>
          <el-radio :label="10000">≥10000手</el-radio>
        </el-radio-group>
        <span style="padding-left:40px;">排列顺序：</span>
        <el-checkbox v-model="RerverChecked">倒序</el-checkbox>
      </div>
      <div class="historyDayLineTool" v-show='IsShow.HistoryDayLine'>
            <div class="datePickerWrap">
                <el-date-picker
                    v-model="PickerStartDate"
                    format="yyyyMMdd"
                    value-format="yyyyMMdd"
                    type="date"
                    placeholder="选择开始日期"
                    @change="ChangeStartTime"
                    :picker-options="pickerOptions1"
                ></el-date-picker>
                至
                <el-date-picker
                    v-model="PickerEndDate"
                    format="yyyyMMdd"
                    value-format="yyyyMMdd"
                    type="date"
                    placeholder="选择结束日期"
                    @change="ChangeEndTime"
                    :picker-options="pickerOptions2"
                ></el-date-picker>
            </div>
            <span>频率：
                <select v-model='DateType'>
                    <option value="0">日度</option>
                    <option value="1">周度</option>
                    <option value="2">月度</option>
                </select>
            </span>
            <button type='button' @click='DownloadCsv'>下载csv文件</button>
      </div>
    </div>
    <div class="divdealday" ref="tableContent">
      <StockDeal
        ref="stockdeal"
        :ChoiceIndex="ChoiceIndex"
        :ChoiceDate="ChoiceDate"
        :IsReverse="IsReverse"
        :DealSymbol="OptionData.Symbol"
        @DealDay="GetStockInfo"
      ></StockDeal>
    </div>
    <div class="charWrap" id="charWrap" ref="charWrap">
      <StockChart
        ref="stockChart"
        :DefaultSymbol="OptionData.Symbol"
        :DefaultOption="OptionData.MinuteOption"
      ></StockChart>
    </div>
    <div class="divdealcount" ref="divdealcount">
      <StockDealCount
        ref="stockdealcount"
        :DefaultSymbol="OptionData.Symbol"
        :DefaultDate="ChoiceDate"
      ></StockDealCount>
    </div>
    <div class="divdayline" ref='divdayline'>
        <HistoryDayLine ref='historydayline' :DefaultSymbol='OptionData.Symbol' :DefaultStartDate='StartDate' :DefaultEndDate='EndDate' :DefaultDateType='DateType'></HistoryDayLine>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import JSCommonStock from "../umychart.vue/umychart.stock.vue.js";
import SearchSymbol from "./searchsymbol.vue";
import StockChart from "./stockchart.vue";
import StockDeal from "./stockdeal.vue";
import StockDealCount from "./stockdealcount.vue";
import HistoryDayLine from './historydayline.vue'

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

function ContentTop() {}
ContentTop.GetDeaultData = function() {
  let data = {
    Symbol: "",
    Name: "",
    TradeDate: "",
    Price: {
      Text: "",
      Color: ""
    },
    Open: {
      Text: "",
      Color: ""
    },
    YClose: 0
  };
  return data;
};

export default {
  data() {
    return {
      DataPicker: "",
      pickerOptions0: {
        disabledDate(time) {
          var dateValue = new Date("2018-01-01 00:00:00").getTime();
          return time.getTime() > Date.now() || time.getTime() < dateValue;
        }
      },
      pickerOptions1:{
        disabledDate(time){
            return;
        }
      },
      pickerOptions2:{
        disabledDate(time){
            return;
        }
      },
      // loadingBody: false,
      TabTexts: ["成交明细", "走势图", "分价表",'历史日线'],
      TabIndex: 0,
      OptionData: {
        Symbol: "",
        // Name:'',
        DatePicker: "",
        MinuteOption: {
          Type: "历史分钟走势图",
          //IsShowCorssCursorInfo:false,
          HistoryMinute: { TradeDate: 20180508 }
        }
      },
      IsShow: {
        Search: false,
        DealDetail: true,
        MinuteChart: false,
        DealCount: false,
        HistoryDayLine:false
      },
      ContentTopData: ContentTop.GetDeaultData(),
      mainHight: 0,
      OrderType: 1,
      RerverChecked: false,
      Pagination: {
        SingleTableCount: 0,
        CurrentPage: 1,
        PageSize: 20 * 6,
        Total: 10
      },
      ChoiceIndex: "",
      ChoiceDate: "20180508",
      IsReverse: false,
      StartDate:20181222,
      EndDate:20190502,
      PickerStartDate:'',
      PickerEndDate:'',
      DateType:'0'
    };
  },
  components: { SearchSymbol, StockChart, StockDeal, StockDealCount, HistoryDayLine },
  computed: {
    DateFormat: function() {
      return this.OptionData.DatePicker.replace(/-/g, "");
    },
    QueryUrl:function(){
    return "https://opensourcecache.zealink.com/cache/dealday/day/" + this.DateFormat + "/" + this.OptionData.Symbol + '.json';
    }
  },
  created() {
    document.title = "分时查询数据";
    var bodyWidth =
      document.documentElement.clientWidth || document.body.clientWidth;
    var bodyHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    var width = bodyWidth;
    var height = bodyHeight - 45 - 70 - 60;

    this.OptionData.Symbol =
      this.GetURLParams("symbol") != undefined
        ? this.GetURLParams("symbol")
        : "600000.sh";
    this.OptionData.DatePicker =
      this.GetURLParams("date") != undefined
        ? this.GetURLParams("date")
        : this.getLastFormatDate();

    var date = this.FormatDateString(this.OptionData.DatePicker, false); //走势图日期设置
    this.OptionData.MinuteOption.HistoryMinute.TradeDate = Number(date);
    this.ChoiceDate=date;
  },
  mounted() {
    const that = this;

    this.OnSize();

    // 初始化显示成交明细 隐藏走势图和分价表
    this.$refs.tableContent.style.display = "block";
    this.$refs.charWrap.style.display = "none";
    this.$refs.divdealcount.style.display = "none";
    this.$refs.divdayline.style.display = "none";
    this.IsShow.DealDetail = true;
  },
  methods: {
    ChangeContentShow(index) {
      this.TabIndex = index;
      switch (index) {
        case 0:
          this.$refs.tableContent.style.display = "block";
          this.$refs.stockdeal.OnSize();
          this.$refs.charWrap.style.display = "none";
          this.$refs.divdealcount.style.display = "none";
          this.$refs.divdayline.style.display = "none";
          this.IsShow.DealDetail = true;
          this.IsShow.HistoryDayLine = false;
          break;
        case 1:
          this.$refs.tableContent.style.display = "none";
          this.$refs.charWrap.style.display = "block"; //直接设置到dom里面 vue里面的设置是异步的
          this.$refs.stockChart.OnSize();
          this.$refs.divdealcount.style.display = "none";
          this.$refs.divdayline.style.display = "none";
          this.IsShow.DealDetail = false;
          this.IsShow.HistoryDayLine = false;
          break;
        case 2:
          this.$refs.tableContent.style.display = "none";
          this.$refs.charWrap.style.display = "none"; //直接设置到dom里面 vue里面的设置是异步的
          this.$refs.divdealcount.style.display = "block";
          this.$refs.divdayline.style.display = "none";
          this.$refs.stockdealcount.OnSize();
          this.IsShow.DealDetail = false;
          this.IsShow.HistoryDayLine = false;
          break;
        case 3:
          this.$refs.tableContent.style.display = "none";
          this.$refs.charWrap.style.display = "none"; //直接设置到dom里面 vue里面的设置是异步的
          this.$refs.divdealcount.style.display = "none";
          this.$refs.divdayline.style.display = "block";
          this.$refs.historydayline.OnSize();
          this.IsShow.DealDetail = false;
          this.IsShow.HistoryDayLine = true;
          break;  
      }
    },
    DownloadCsv(){
        var _this = this;
        var period = parseInt(this.DateType);
        $.ajax({
            url: 'http://opensource.zealink.com/api/KLineCSV',
            type:"post",
            dataType: 'json',
            data:{
                "Symbol": _this.OptionData.Symbol,
                "QueryDate": {
                    "StartDate": _this.StartDate,
                    "EndDate": _this.EndDate
                },
                "Period":period
            },
            async:true,
            success: function (data) 
            {
                _this.RecvDownloadCsv(data);
            },
            error: function (request) 
            {
                console.log(request.message);
            }
        });
    },
    RecvDownloadCsv(data){
        console.log('下载 data:',data);
        if(data.code == 0){
            var relativeUrl = data.relativeurl;
            window.open('https://downloadcache.zealink.com/'+relativeUrl);
        }
    },
    GetStockInfo(data) {
      if (data) {
        console.log("[queryContent::GetStockInfo]data:", data);
        this.ContentTopData.Symbol = data.Symbol;
        this.ContentTopData.Name = data.Name;
        this.ContentTopData.TradeDate = this.FormatDateString(
          data.Date + "",
          true
        );

        this.ContentTopData.Price.Text = data.Close;
        this.ContentTopData.Price.Color = this.$refs.stockdeal.FormatValueColor(
          data.Close,
          data.YClose
        );
        this.ContentTopData.Open.Text = data.Open;
        this.ContentTopData.Open.Color = this.$refs.stockdeal.FormatValueColor(
          data.Open,
          data.YClose
        );
        this.ContentTopData.YClose = data.YClose;
      }
    },
    GoSearch() {
      this.IsShow.Search = true;
      var mySymbol = this.$refs.mySymbol;
      mySymbol.DeletSymbel();
    },
    CancelSearch() {
      this.IsShow.Search = false;
    },
    getLastFormatDate() {
      //获取前一天，并且排除周末
      var day = new Date();
      day.setDate(day.getDate() - 1);
      let weekdayIndex = day.getDay();
      if (weekdayIndex == 0) {
        day.setDate(day.getDate() - 2);
      } else if (weekdayIndex == 6) {
        day.setDate(day.getDate() - 1);
      }
      return day.Format("yyyy-MM-dd");
    },
    GetURLParams: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
    OnSize() {
      var contentTopHeight = $(".content_top").outerHeight(true);
      var pagepromptHeight = $(".pagePrompt").outerHeight(true);
      var selectOrderWrapHeight = $("#selectOrderWrap").outerHeight(true);
      var mainHight =
        $(window).height() -
        contentTopHeight -
        selectOrderWrapHeight -
        pagepromptHeight;
      var mainWdith = $(".divdealday").width();

      $(".divdealday").height(mainHight);
      var stockdeal = this.$refs.stockdeal;
      stockdeal.OnSize();

      var bodyWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      var bodyHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var width = bodyWidth;
      var height = bodyHeight - 45 - 70 - 60;
      var divChart = this.$refs.charWrap;
      divChart.style.width = width + "px";
      divChart.style.height = height + "px";
      var stockChart = this.$refs.stockChart;
      stockChart.OnSize();

      var divdealcount = this.$refs.divdealcount;
      divdealcount.style.width = width + "px";
      divdealcount.style.height = height + "px";
      var stockdealcount = this.$refs.stockdealcount;
      stockdealcount.OnSize();

      var divdayline = this.$refs.divdayline;
      divdayline.style.width = width + "px";
      divdayline.style.height =  height + "px";
      this.$refs.historydayline.OnSize();

      var minWidth = 1062;
    },
    FormatDateString(date, hasLine) {
      if (hasLine) {
        return (
          date.substring(0, 4) +
          "-" +
          date.substring(4, 6) +
          "-" +
          date.substring(6, 8)
        );
      } else {
        return date.replace(/-/g, "");
      }
    },
    changeTime(val) {
      if (val) {
        this.OptionData.DatePicker = val;
        this.ChoiceDate = val;
        console.log("[querycontent::changeTime]date:", val);
        var date = this.FormatDateString(val, false);
        var stockChart = this.$refs.stockChart;
        stockChart.ChangeTradeDate(Number(date));
      }
    },
    ChangeStartTime(val){
        console.log('开始日期，model',this.PickerStartDate);
        this.StartDate = parseInt(val);
    },
    ChangeEndTime(val){
        this.EndDate = parseInt(val);
    },
    searchSymbol(symbol) {
      this.OptionData.Symbol = symbol;
      var stockChart = this.$refs.stockChart;
      stockChart.ChangeSymbol(symbol);
      // this.loadingBody = true;
      this.OrderType = 1;
      this.RerverChecked = false;
      this.IsShow.Search = false;
    },
    //下载json
    downJson() {
      window.open(this.QueryUrl);
    }
  },
  watch: {
    OrderType(val) {
      console.log("[::OrderType val]", val);
      // 成交量筛选
      this.ChoiceIndex = val;
    },
    RerverChecked(val) {
      this.IsReverse = val;
    }
  }
};
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  font: 14px "Microsoft Yahei";
}

#content {
  overflow: hidden;
  height: 100%;
  width: 100%;
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #0d4123;
  }

  .red {
    color: #ff0000;
  }

  .green {
    color: #009900;
  }

  .pagePrompt {
    font-size: 18px;
    line-height: 45px;
    text-align: center;
  }

  .content_top {
    height: 70px;
    background: #f6f6f6;
    position: relative;
    > div {
      position: absolute;
    }
    .top_title {
      padding-top: 15px;
      width: 160px;
      left: 15px;
      /* color: #019bdc; */
      .name {
        height: 18px;
        line-height: 1;
        color: #019bdc;
      }
      .topSearchWrap {
        position: relative;
        .symbolText {
          height: 25px;
          font-size: 18px;
          line-height: 1;
          color: #019bdc;
          display: inline-block;
        }
        .searchBtn {
          width: 55px;
          line-height: 22px;
          font-size: 12px;
          background: #2061a5;
          border: none;
          color: #fff;
          margin-left: 8px;
        }
        .cancelBtn {
          width: 59px;
          left: 139px;
          line-height: 24px;
          background: #2061a5;
          border: none;
          color: #fff;
          position: absolute;
          top: 0;
          left: 139px;
        }
        .editSymbol {
          width: 169px;
          box-sizing: border-box;
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 9;
        }
      }
    }
    .top_title2 {
      padding-top: 15px;
      left: 185px;
      width: 100px;
    }
    .priceWrap {
      width: 93px;
      left: 305px;
      padding-top: 15px;
      .price {
        font-size: 16px;
      }
    }
    .stockInfoWrap {
      padding-top: 15px;
      width: 80px;
      left: 425px;
    }
    .datePickerWrap {
      padding-top: 15px;
      left: 530px;
      width: 140px;
      .el-input__inner {
        border-radius: 0;
        height: 23px;
        border: 1px solid #999;
      }
    }
    #searchContainer {
      padding-top: 15px;
      left: 745px;
      #searchSymbolWrap {
        width: 149px;
        display: inline-block;
      }
      .el-button {
        border-radius: 0;
        padding: 3px 6px;
      }
    }

    .el-select {
      display: inline-block;
      position: relative;

      .el-input {
        .el-input__inner {
          width: 230px;
          border-right: 0;
          border-radius: 5px 0 0 5px;
        }
      }
    }

    .top {
      display: flex;
      justify-content: space-around;

      .top_title {
        padding-left: 20px;

        p {
          color: #019bdc;
        }
      }

      // .top_title2 {
      //   p {
      //   }
      // }
    }

    .input-with-button .el-input-group__prepend {
      background-color: #fff;
    }
  }

  #selectOrderWrap {
    height: 60px;
    .selectorForDealDetail {
        display: inline-block;
    }
    .historyDayLineTool{
        display: inline-block;
        margin-left: 100px;
        .datePickerWrap{
            display: inline-block;
            margin-right: 80px;
        }
        .el-input__inner {
            border-radius: 0;
            height: 23px;
            border: 1px solid #999;
        }
    }
    .tabWrap {
      display: inline-block;
      height: 20px;
      margin-top: 20px;
      margin-left: 20px;
      @tabBorder: 1px solid #2f2f2f;
      border: @tabBorder;
      > span {
        display: inline-block;
        line-height: 20px;
        padding: 0 10px;
        cursor: pointer;
        border-right: @tabBorder;
      }
      > span:last-child {
        border-right: none;
      }
      > span.active {
        color: blue;
      }
    }
  }

  .divdealday {
    overflow-y: auto;
    height: calc(100% - 118px);
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
  }

  #paginationWrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>