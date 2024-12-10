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
 import HQData from "hqchart/src/jscommon/umychart.vue.testdataV2/umychart.NetworkFilterTest.vue.js"
  var JSCommon=HQChart.Chart;
  var JSCommonStock=HQChart.Stock;

  function DefaultData() {}
  DefaultData.GetStockData = function () //数据默认显示值
    {
        const data =
        {
            Name: { Text: '浦发银行' },
            Price: { Text: '7.04', Color: 'PriceNull' },
            RiseFallPrice: { Text: '-0.05', Color: 'PriceNull' },
            Increase: { Text: '-0.71%', Color: 'PriceNull' },
            High: { Text: '7.10', Color: 'PriceNull' },
            Low: { Text: '7.02', Color: 'PriceNull' },
            Open: { Text: '7.09', Color: 'PriceNull' },
            MaxPrice: { Text: '7.15', Color: 'PriceNull' },
            MinPrice: { Text: '7.00', Color: 'PriceNull' },
            YClose: { Text: '7.09' },

            Excahngerate: { Text: '0.07%', Color: 'PriceNull' },
            Amount: { Text: '1.43亿' }, Vol: { Text: '20.27万' },
            Pe: { Text: '4.47' }, Roe: { Text: '3.73%' },
            MarketV: { Text: '2300亿' }, FlowMarketV: { Text: '2010亿' },
            Eps: { Text: '3.3' }, ScrollEPS: { Text: '1.4' },
            Pb: { Text: '2.3' }, Amplitude: { Text: '3.4' },
            BookRate: { Text: '0.5%' }, BookDiffer: { Text: '2.4' },
            Volratio: { Text: '0.3%' },CapitalTatol: { Text: '20.1亿' },
            CapitalA: { Text: '20.3亿' },
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
        this.Kline.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        chart.SetOption(this.Kline.Option);
        chart.AddEventCallback({event:JSCommon.JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE, callback:this.OnClickIndexTitle});//点击事件通知回调
        this.Kline.JSChart=chart;
      },

      CreateMinuteChart() //创建日线图
      {
        if (this.Minute.JSChart) return;
        this.Minute.Option.Symbol=this.Symbol;
        let chart=JSCommon.JSChart.Init(this.$refs.minute);
        this.Minute.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        chart.SetOption(this.Minute.Option);
        this.Minute.JSChart=chart;
      },

        NetworkFilter(data, callback)
        {
            HQData.HQData.NetworkFilter(data, callback);
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