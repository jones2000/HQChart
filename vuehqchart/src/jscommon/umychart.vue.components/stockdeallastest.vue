<!--
    最新分笔
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
  import JSCommonStock from "../umychart.vue/umychart.stock.vue.js";
  import StringFormat from '../umychart.vue/stockstringformat.js'
  
  export default {
    name: "StockDealLastest",
    data() {
      return {
        Symbol: "600000.sh",
        ChoiceCountIndex: "",
        IsReverseData: false,
        LatestDetail: null,
        TableData: {
          Meta: [],
          Selected: [],
          SelectedReverse: [],
          Paginationed: [],
          CurrentPageData: [],
          CurentTables: []
        }, //Meta:接口返回的缓存数据，Selected：筛选后的数据，Paginationed：筛选后分页过的数据,CurrentPageData：当前页面所有表格的数据
        Pagination: {
          SingleTableCount: 20,
          CurrentPage: 1,
          PageSize: 20 * 6,
          Total: 10
          // IsShow:false
        },
        loadingBody: false,
        IsTradeDay: true
      };
    },
  
    props: ["DealSymbol"],
  
    //创建
    created: function() {
      console.log("[stockdeal::created]");
      this.ChoiceCountIndex = this.ChoiceIndex != null ? this.ChoiceIndex : "";
    //   this.IsReverseData = this.IsReverse != null ? this.IsReverse : false;
      this.Symbol = this.DealSymbol != null ? this.DealSymbol : "600000.sh";

      this.LatestDetail = JSCommonStock.JSStock.GetLatestDetailData(this.Symbol);
      this.LatestDetail.InvokeUpdateUICallback = this.UpdateData;

    },
    
    mounted: function() {
      console.log("[stockdeal::mounted]");
      this.loadingBody = true;
      // this.OnSize();
    },
    watch: {
      // DealSymbol: function(val) {
      //   this.LatestDetail = JSCommonStock.JSStock.GetDealDay(val);
      //   this.LatestDetail.PageSize = this.Pagination.PageSize;
      //   this.LatestDetail.InvokeUpdateUICallback = this.UpdateData;
      //   this.LatestDetail.RequestData();
      // },
    },
  
    methods: {
      UpdateData() {
        let test = 0;
        console.log("[stockdeallastest::UpdateData]data:",++test, this.LatestDetail.Data);
        var data = this.LatestDetail.Data;
        // this.$emit("LatestDetail", data);
        if (data != null) {
          this.loadingBody = false;
          var count = data.Count;
          var start = data.Response.Start;
          var end = data.Response.End;
          var yClose = data.Day.YClose;
          var symbol = data.Stock.Symbol;
          var name = data.Stock.Name;
          document.title = name + '-' + symbol;
          if (data.Deal) {
            this.TableData.Meta = data.Deal;
            this.IsTradeDay = true;
            this.Pagination.Total = count;
            var currentPageData = [];
            var endIndex = end < count ? end : count;
            for(let i = start; i < endIndex; ++i){
                var item = data.Deal[i];
                currentPageData.push(item);
            }
            console.log("[stockdeallastest::UpdateData]currentPageData:",currentPageData);
            this.ChoiceData("",currentPageData, yClose); //接收传入的筛选条件
          }
        } else {
          this.IsTradeDay = false;
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.LatestDetail.RequestPage(val - 1);
      },
      // 成交量筛选方法
      ChoiceData(num, data, yClose) {
        var dataAry = [];
        console.log("[stockdeal::ChoiceData]data:", data);
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            var item = data[i];
            var color = this.FormatValueColor(item.Price, yClose);
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
          this.TableData.CurrentPageData = dataAry;
          this.InitPageData(this.TableData.CurrentPageData);
        }
      },
      InitPageData(data) {
        var count = this.Pagination.SingleTableCount;
        console.log("[::InitPageData]count:", count);
        this.TableData.CurentTables = this.CutDataAry(count, 6, data);
      },
      UpdateDataShow(count) {
          console.log('[StockDealLastest::UpdateDataShow]count:',count);
        this.Pagination.SingleTableCount = count;
        this.Pagination.PageSize = count * 6;
        this.LatestDetail.PageSize = this.Pagination.PageSize;
        this.LatestDetail.RequestPage(this.Pagination.CurrentPage - 1);
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
        if(everyTableCount < 0){
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
      CutDataAry(everyCount, cutIndex, data) {
        var paginationAry = [];
        var total = this.Pagination.Total;
        for (let i = 0; i < cutIndex; i++) {
            if(everyCount * (i + 1) < total){
                paginationAry.push(data.slice(everyCount * i, everyCount * (i + 1)));
            }else{
                paginationAry.push(data.slice(everyCount * i, total));
            }
          
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
    #paginationWrap{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
  }
  </style>