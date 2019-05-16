<!-- 
    历史分价表
-->

<template>
  <div class="main">
    <div class="wrap">
      <table class="myTable">
        <thead>
          <tr>
            <td>成交价(元)</td>
            <td>成交量(股)</td>
            <td>占比</td>
            <th>占比图</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in PriceList" :key="index">
            <td>{{item.Price}}</td>
            <td>{{item.Vol}}</td>
            <td>{{item.Proportion}}</td>
            <th>
              <div class="chart">
                <div class="down" :style="{width: item.widthItem + '%', background: colorDeal}"></div>
              </div>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import JSCommonStock from "../umychart.vue/umychart.stock.vue.js";

export default {
  data() {
    return {
      Symbol: "600000.sh", //板块代码
      DealData: null, //数据类
      PriceList: [],
      ProportionList: [], //占比数组
      colorDeal: "",
      Date:'20190102'
    };
  },
  props: {
    DefaultSymbol: String,
    DefaultDate: String
  },
  created(){
    this.Symbol = this.DefaultSymbol != null ? this.DefaultSymbol : "600000.sh";
    this.Date = this.DefaultDate != null ? this.DefaultDate : '20190102';
  },
  mounted: function() {
    this.DealData = JSCommonStock.JSStock.GetDealDay(this.Symbol);
    this.DealData.Date = this.Date;
    this.DealData.InvokeUpdateUICallback = this.GetData;
    this.DealData.RequestData();
  },

  methods: {
    // 小数转换成百分数
    toPercent(point) {
      var percent = Number(point * 100).toFixed(2);
      percent += "%";
      return percent;
    },
    // 获取数据
    GetData() {
      if (this.DealData.Data) {
        var DealData = this.DealData.Data;
        var dataList1 = this.DealData.Data.PriceList;
        var dataList2 = this.DealData.Data.PriceList;
        // 判断占比图颜色
        if (DealData.Open - DealData.YClose > 0) {
          this.colorDeal = "#f00";
        } else {
          this.colorDeal = "#008000";
        }
        dataList1.forEach(value => {
          this.ProportionList.push(value.Proportion);
        });
        // 拿占比最大值
        var arr = this.ProportionList;
        arr.sort(function(a, b) {
          return a - b;
        });
        var maxProportion = arr[arr.length - 1]; //占比最大值

        dataList2.forEach(value => {
          var object = {
            Price: 0,
            Proportion: 0,
            Vol: 0,
            widthItem: 0
          };
          object.Price = value.Price;
          object.Vol = value.Vol;
          object.Proportion = this.toPercent(value.Proportion);
          object.widthItem = (value.Proportion / maxProportion) * 100; //最大占比为1，其余按比例
          this.PriceList.push(object);
        });
      }
    },
    OnSize(){
        
    }
  }
};
</script>


<style lang="scss" type="text/scss">
.main {
  border: 1px solid #d7d7df;
  border-top: none;
  //   margin: 0px auto 10px auto;
  padding: 10px;
  width: 755px;
  .wrap {
    .myTable {
      font-size: 12px;
      width: 755px;
      border-collapse: collapse;
      thead {
        td,
        th {
          background-color: #d4edff;
        }
      }
      td,
      th {
        border: 1px solid #d7d7df;
        border-left: none;
        border-right: none;
        font-size: 12px;
        font-weight: normal;
        height: 22px;
        line-height: 22px;
        padding: 0px;
      }
      td {
        padding-right: 10px;
        text-align: right;
      }
      th {
        padding-left: 10px;
        text-align: left;
      }

      .chart {
        padding-top: 8px;
        background: #fafbfd;
        height: 14px;
        padding: 4px auto;
        width: 500px;
        .down {
          height: 14px;
        }
      }
    }
  }
}
</style>
