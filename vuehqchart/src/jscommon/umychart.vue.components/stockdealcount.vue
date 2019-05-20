<!-- 
    历史分价表
-->

<template>
  <div class="divstockdealcount" ref="divstockdealcount">
    <div class="tableContent" ref="tableContent">
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
                <div
                  class="down"
                  :style="{width: item.widthItem + '%', background: ColorDeal,height: item.heightItem + 'px',}"
                ></div>
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
  name: "Stockdealcount",
  data() {
    return {
      Symbol: "600000.sh", //板块代码
      DealData: null, //数据类
      PriceList: [],
      ProportionList: [], //占比数组
      ColorDeal: "",
      Date: "20190102"
    };
  },
  props: {
    DefaultSymbol: String,
    DefaultDate: String
  },
  watch: {
    DefaultSymbol(newV, oldV) {
      this.Symbol = newV;
    },
    DefaultSymbol(newV, oldV) {
      this.Date = newV;
    }
  },
  created() {
    this.Symbol = this.DefaultSymbol != null ? this.DefaultSymbol : "600000.sh";
    this.Date = this.DefaultDate != null ? this.DefaultDate : "20190102";
  },
  mounted: function() {
    this.DealData = JSCommonStock.JSStock.GetDealDay(this.Symbol);
    this.DealData.Date = this.Date;
    this.DealData.InvokeUpdateUICallback = this.GetData;
    this.DealData.RequestData();
    this.OnSize();
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
          this.ColorDeal = "#f00";
        } else {
          this.ColorDeal = "#008000";
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
            widthItem: 0,
            heightItem: 0
          };
          object.Price = value.Price;
          object.Vol = value.Vol;
          object.Proportion = this.toPercent(value.Proportion);
          object.widthItem = (value.Proportion / maxProportion) * 100; //最大占比为1，其余按比例
          object.heightItem = 14;
          this.PriceList.push(object);
        });
      }
    },
    OnSize() {
      var divstockdealcount = this.$refs.divstockdealcount;
      console.log(divstockdealcount);
      var tableContent = this.$refs.tableContent;
      // var paginationWrap = this.$refs.paginationWrap;
      var width = divstockdealcount.clientWidth;
      var height = divstockdealcount.clientHeight;
      if (height <= 0) return;

      var mainHight = height;
      var mainWdith = width + "px";
      var tdHeight = 20;
      var borderHeight = 1;
      var everyTableCount = Math.floor(
        (mainHight - tdHeight - borderHeight) / tdHeight
      );
      if (everyTableCount <= 0) {
        everyTableCount = 1;
      }

      // this.UpdateDataShow(everyTableCount);

      tableContent.style.height = mainHight + "px";
    }
  }
};
</script>


<style lang="scss" type="text/scss">
.divstockdealcount {
  width: 100%;
  height: 100%;
  border: 1px solid #d7d7df;
  border-top: none;
  // padding: 10px;
  .tableContent {
    overflow-y: auto;
    height: 100%;
    width: 100%;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    overflow-x: hidden;
    .myTable {
      font-size: 12px;
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
        // height: 22px;
        line-height: 20px;
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
        // padding-top: 8px;
        background: #fafbfd;
        // padding: 4px auto;
        width: 500px;
      }
    }
  }
}
</style>
