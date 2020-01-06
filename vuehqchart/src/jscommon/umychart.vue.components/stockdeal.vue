<!-- 
    历史分笔
-->
<template>
  <div class="divstockdeal" ref="divstockdeal">
    <div class="table_content" ref="tableContent" v-show="IsTradeDay">
      <div class="tableWrap" v-for="(curTable,index) in TableData.CurentTables" :key="index">
        <table class="tabHori">
          <thead ref="tableHeader">
            <tr>
              <td>时间</td>
              <td class="alignCenter">价格</td>
              <td class="alignCenter">成交量(手)</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowItem,ind) in curTable" :key="ind">
              <td>{{rowItem.Time}}</td>
              <td class="alignRight" :class="rowItem.PriceColor">{{rowItem.Price}}</td>
              <td class="alignRight">
                {{parseInt(rowItem.Vol)}}&nbsp;
                <span
                  :class="rowItem.Flag == 'B' ? 'red' : 'green'"
                >{{rowItem.Flag}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="notTradeDay" v-show="!IsTradeDay">不是交易日</div>
    <div id="paginationWrap" ref="paginationWrap" v-show="IsTradeDay">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="Pagination.CurrentPage"
        :page-size="Pagination.PageSize"
        layout="prev, pager, next, jumper"
        :total="Pagination.Total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import JSCommonStock from "../umychart.vue/umychart.stock.vue.js"
import StringFormat from '../umychart.vue/stockstringformat.js'

export default {
  name: "StockDeal",
  data() {
    return {
      Symbol: "600000.sh",
      ChoiceCountIndex: "",
      CurrentDate: "20180508",
      IsReverseData: false,
      DealDay: null,
      TableData: {
        Meta: [],
        Selected: [],
        SelectedReverse: [],
        Paginationed: [],
        CurrentPageData: [],
        CurentTables: []
      }, //Meta:接口返回的数据，Selected：筛选后的数据，Paginationed：筛选后分页过的数据,CurrentPageData：当前页面所有表格的数据
      Pagination: {
        SingleTableCount: 0,
        CurrentPage: 1,
        PageSize: 20 * 6,
        Total: 10
        // IsShow:false
      },
      loadingBody: false,
      IsTradeDay: true
    };
  },

  props: ["ChoiceIndex", "ChoiceDate", "IsReverse", "DealSymbol"],

  //创建
  created: function() {
    console.log("[stockdeal::created]");
    this.ChoiceCountIndex = this.ChoiceIndex != null ? this.ChoiceIndex : "";
    this.CurrentDate = this.ChoiceDate != null ? this.ChoiceDate : "20180508";
    this.IsReverseData = this.IsReverse != null ? this.IsReverse : false;
    this.Symbol = this.DealSymbol != null ? this.DealSymbol : "600000.sh";

    this.DealDay = JSCommonStock.JSStock.GetDealDay(this.Symbol);
    this.DealDay.Date = this.CurrentDate;
    this.DealDay.InvokeUpdateUICallback = this.UpdateData;
    this.DealDay.RequestData();
  },

  mounted: function() {
    console.log("[stockdeal::mounted]");
    this.loadingBody = true;
    this.OnSize();
  },
  watch: {
    DealSymbol: function(val) {
      this.DealDay = JSCommonStock.JSStock.GetDealDay(val);
      this.DealDay.Date = this.CurrentDate;
      this.DealDay.InvokeUpdateUICallback = this.UpdateData;
      this.DealDay.RequestData();
    },
    ChoiceIndex: function(val) {
      //val: "",100,200,500,1000,2000,5000,10000
      console.log("[stockdeal::ChoiceIndex]:", val);
      var deal = this.TableData.Meta;
      this.ChoiceData(val, deal);
    },
    ChoiceDate: function(val) {
      console.log("[stockdeal::ChoiceDate]:", val);
      this.DealDay = JSCommonStock.JSStock.GetDealDay(this.Symbol);
      this.DealDay.Date = val;
      this.DealDay.InvokeUpdateUICallback = this.UpdateData;
      this.DealDay.RequestData();
    },
    IsReverse: function(val) {
      var data = val ? this.TableData.SelectedReverse : this.TableData.Selected;
      this.PaginationAllData(data);
      this.InitPageData(this.TableData.CurrentPageData);
    }
  },

  methods: {
    UpdateData() {
      console.log("[stockdeal::UpdateData]data:", this.DealDay.Data);
      var data = this.DealDay.Data;
      this.$emit("DealDay", data);
      if (data != null) {
        this.loadingBody = false;
        var yClose = data.YClose;
        var open = data.Open;
        if (data.Deal) {
          this.TableData.Meta = data.Deal;
          this.IsTradeDay = true;
          this.Pagination.CurrentPage = 1;
          this.ChoiceData(this.ChoiceCountIndex, data.Deal, open); //接收传入的筛选条件
          console.log("[stockdeal::UpdateData]ChoiceIndex:", this.ChoiceIndex);
        }
      } else {
        this.IsTradeDay = false;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log("[::handleCurrentChange val]", val);
      this.TableData.CurrentPageData = this.TableData.Paginationed[val - 1];
      this.InitPageData(this.TableData.CurrentPageData);
    },
    // 成交量筛选方法
    ChoiceData(num, data, open) {
      var dataAry = [];
      console.log("[stockdeal::ChoiceData]data:", data);
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          var item = data[i];
          var color = this.FormatValueColor(item.Price, open);
          var dataObj = {
            Time: this.processingTime(item.Time),
            Price: StringFormat.StockStringFormat.FormatValueString(item.Price,2),
            PriceColor: color,
            Vol: parseInt(item.Vol),
            Flag: item.Flag,
            Amount: item.Amount
          };

          if (num != "") {
            if (item.Vol >= num) {
              dataAry.push(dataObj);
            }
          } else {
            dataAry.push(dataObj);
          }
        }
        console.log("[::ChoiceData dataAry]", dataAry);
        this.TableData.Selected = dataAry;
        this.TableData.SelectedReverse = dataAry
          .slice(0, dataAry.length)
          .reverse(); //数组倒序
        this.Pagination.Total = this.TableData.Selected.length;
        this.PaginationAllData(this.TableData.Selected);
        this.InitPageData(this.TableData.CurrentPageData);
        console.log("[stockdeal::ChoiceData]TableData:", this.TableData);
      }
    },
    InitPageData(data) {
      var count = this.Pagination.SingleTableCount;
      console.log("[::InitPageData]count:", count);
      this.TableData.CurentTables = this.CutDataAry(count, 6, data);
    },
    UpdateDataShow(count) {
      this.Pagination.SingleTableCount = count;
      this.Pagination.PageSize = count * 6;
      this.PaginationAllData(this.TableData.Selected);
      this.InitPageData(this.TableData.CurrentPageData);
    },
    FormatValueColor(currentValue, targetValue) {
      var color = "";
      if (currentValue > targetValue) {
        color = "red";
      } else if (currentValue < targetValue) {
        color = "green";
      } else {
        color = "";
      }
      return color;
    },
    OnSize() {
      var divstockdeal = this.$refs.divstockdeal;
      var tableContent = this.$refs.tableContent;
      var paginationWrap = this.$refs.paginationWrap;
      var width = divstockdeal.clientWidth;
      var height = divstockdeal.clientHeight;
      if (height <= 0) return;

      var mainHight = height - paginationWrap.offsetHeight;
      var mainWdith = width + "px";
      var tdHeight = 20;
      var borderHeight = 1;
      var everyTableCount = Math.floor(
        (mainHight - tdHeight - borderHeight) / tdHeight
      );
      if (everyTableCount <= 0) {
        everyTableCount = 1;
      }

      this.UpdateDataShow(everyTableCount);

      tableContent.style.height = mainHight + "px";
    },
    //处理时间
    processingTime(mss) {
      var hours = parseInt(mss / 10000);
      var minutes = parseInt((mss / 100) % 100);
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return hours + ":" + minutes;
    },
    //处理SB
    // processingNum(num) {
    //     if (num == 0) {
    //         return "B";
    //     } else if (num == 1) {
    //         return "S";
    //     } else {
    //         return "C";
    //     }
    // },
    PaginationAllData(data) {
      var dataAry = [];
      if (data.length > 0) {
        var everyCount = this.Pagination.PageSize;
        var pageCount = 0;
        var val = this.Pagination.Total % everyCount;
        if (val > 0) {
          pageCount = Math.floor(this.Pagination.Total / everyCount) + 1;
        } else {
          pageCount = Math.floor(this.Pagination.Total / everyCount);
        }
        console.log(
          "[::PaginationAllData everyCount pageCount]",
          everyCount,
          pageCount
        );
        this.TableData.Paginationed = this.CutDataAry(
          everyCount,
          pageCount,
          data
        );
        this.TableData.CurrentPageData = this.TableData.Paginationed[
          this.Pagination.CurrentPage - 1
        ];
      }
    },
    CutDataAry(everyCount, cutIndex, data) {
      var paginationAry = [];
      for (let i = 0; i < cutIndex; i++) {
        paginationAry.push(data.slice(everyCount * i, everyCount * (i + 1)));
      }
      return paginationAry;
    }
  }
};
</script>

<style lang='less' scoped>
.divstockdeal {
  width: 100%;
  height: 100%;
  .red {
    color: #ff0000;
  }

  .green {
    color: #009900;
  }
  .table_content {
    overflow-y: auto;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;

    .tableWrap {
      flex-grow: 1;
      height: 100%;

      .tabHori {
        font: 12px "Microsoft Yahei";
        width: 100%;
        box-sizing: border-box;
        border-collapse: collapse;
        border: none;
        td,
        th {
          border: none;
          padding: 0 10px;
          line-height: 20px;
        }
        tr>td:last-child,tr>th:last-child{
            padding-left: 0;
        }
        .alignRight {
          text-align: right;
        }
        .alignCenter {
          text-align: center;
        }
        thead {
          td,
          th {
            border-bottom: 1px solid #ebeef5;
          }
        }
        tbody {
          tr > td:last-child,
          tr > th:last-child {
            border-right: 1px solid #ebeef5;
          }
        }
        tr > td:nth-of-type(n + 2),
        tr > th:nth-of-type(n + 2) {
          font-size: 14px;
        }
      }
    }
  }
}
</style>