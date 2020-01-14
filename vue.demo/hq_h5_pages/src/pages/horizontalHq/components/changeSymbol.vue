<template>
  <div class="change-symbol">
    <div class="change-list">
      <div class="change-content" :style="{width:Height + 'px',height:Height + 'px'}">
        <div class="change-title">
          <span class="el-icon-arrow-left" @click="GoBack"></span>
          选择股票
        </div>
        <div class="project">
          <div class="project-left">
            <ul>
              <li v-for="(item,index) in ConceptObj.Concept" :key='index' :class="{activeCon:ConceptObj.ConceptIndex==index}" @click="GetConindex(item,index)">{{item.Name}}</li>
            </ul>
          </div>
          <div class="project-right">
            <ul>
              <li v-for="(item,index) in SymbolList" :key='index' :class="{active:SymbolCur==item.Symbol}" @click="ChangeSymbolFn(item.Symbol)">
                <div class="symbol-info">
                  <span class="symbol-name">{{item.Name}}</span>
                  <span class="symbol-code">{{item.Symbol}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
  import HQChart from 'hqchart'
  import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
  import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
  import $ from 'jquery'

  var JSCommon=HQChart.Chart;
  var JSCommonStock=HQChart.Stock;

  export default {
    name:'changeSymbol',
    props:[],
    data () {
      return {
        ConceptObj:{
            Concept:[
              {Name:'黄金概念',Symbol:'CE9C.ci'},
              {Name:'稀土永磁',Symbol:'CE4E.ci'},
              {Name:'家用电器',Symbol:'DC19.ci'},
              {Name:'玉米',Symbol:'D9BC.ci'}
            ],   //概念
            ConceptIndex:0,  //概念索引
            ConceptName:'',   //概念名称
        },
        SymbolList:[],   //股票
        SymbolCur:'',   //当前选中股票代码
        DayUpDown: 
        [
          JSCommonStock.STOCK_FIELD_NAME.SYMBOL,
          JSCommonStock.STOCK_FIELD_NAME.PRICE,
          JSCommonStock.STOCK_FIELD_NAME.NAME,
          JSCommonStock.STOCK_FIELD_NAME.VOL,
          JSCommonStock.STOCK_FIELD_NAME.INCREASE
        ],
        Height:0,
        Width:0,
      }  
    },
    created(){
      var width = window.innerWidth;
      var height = window.innerHeight;
      
      this.Height = width;
      this.Width = height;
    },
    watch:{
      
    },
    mounted(){
      this.GetSymbol(this.ConceptObj.Concept[0].Symbol);
    },
    methods:{
      GoBack(){
        this.$emit('ShowModal');        
      },
      GetConindex(item,index){
        this.ConceptObj.ConceptIndex = index;
        this.ConceptObj.ConceptName = item.Name;
        this.GetSymbol(item.Symbol);
      },
      GetSymbol(symbol){
        this.UpList = JSCommonStock.JSStock.GetBlockMember(symbol);
        this.UpList.OrderNull = 1;
        this.UpList.IsAutoUpdate = false; 
        this.todayUp();
      },
      // 涨幅排名
      todayUp:function(){
        this.UpList.SetField(this.DayUpDown);
        this.UpList.SetOrder(JSCommonStock.STOCK_FIELD_NAME.INCREASE, -1);
        this.UpList.UpdateUICallback = this.dayUp;
        this.UpList.RequestData();
      },
      dayUp: function (data) {
        // this.SymbolList  = [];
        var uplist = [];
        for (var i in data.Data) {
            var item = data.Data[i];
            var upInfo = {
                Symbol: '--',
                Name: '--',
                Price: { Text: '--', Class: 'PriceNull' },
                Increase: { Text: '--', Class: 'PriceNull' },
                Amplitude: { Text: '--', Class: 'PriceNull'},
                Risefallspeed: { Text: '--', Class: 'PriceNull' }
            };
            upInfo.Symbol = item.Symbol;
            upInfo.Name = item.Name;
            upInfo.Price.Text = Number(item.Price).toFixed(2);
            upInfo.Price.Class = JSCommon.IFrameSplitOperator.FormatValueColor(item.Increase);
            upInfo.Increase.Text = Number(item.Increase).toFixed(2);
            upInfo.Increase.Class = JSCommon.IFrameSplitOperator.FormatValueColor(item.Increase);

            uplist.push(upInfo);
        }
        this.SymbolList = uplist;
      },
      ChangeSymbolFn(symbol){
        this.SymbolCur = symbol;
        this.$emit('ChangeSymbol',symbol);
      },
    },
  }
</script>

<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
    overflow: hidden;
  }
  .active{
    color: #217cd9!important;
  }
  .activeCon{
    background-color: #4092ef;
    color: #ffffff!important;
  }
  .change-symbol{
    overflow: hidden;
    .change-list{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      color: #333333;
      .change-content{
        // width: 100%;
        // height: 60%;
        position: relative;
        top:-10px;
        background-color: #ffffff;
        border-radius: 0px 15px 15px 0px;
        transform:rotate(90deg);
        transform-origin:center 50%;
        .change-title{
          width: 100%;
          height: 55px;
          line-height: 55px;
          border-bottom: 1px solid #d9d9d9;
          span{
            padding-left:15px;
            display: inline-block;
            width: 20px;
            height: 30px;
          }
        }
        .project{
          display: flex;
          height:calc(100% - 56px);
          .project-left{
            width: 110px;
            height: 100%;
            border-right: 1px solid #d9d9d9;
            li{
              padding-left: 15px;
              box-sizing: border-box;
              width: 100%;
              height: 50px;
              line-height: 50px;
              font-size: 14px;
              color: #666666;
              border-bottom: 1px solid #d9d9d9;
            }
          }
          .project-right{
            width: 100%;
            overflow: auto;
            text-align: left;
            ul{
              padding-top: 15px;
              box-sizing: border-box;
              li{
                width: 160px;
                color: #7f7f7f;
                height: 50px;
                div{
                  padding-left: 30px;
                  text-align: center;
                  span{
                    display: block;
                  }
                  .symbol-name{
                    font-size: 14px;
                  }
                  .symbol-code{
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

</style>