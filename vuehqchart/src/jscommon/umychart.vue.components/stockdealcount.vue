<!-- 
    历史分价表
-->

<template>
    <div class="divstockdealcount" ref="divstockdealcount">
        <div class="tableContent" ref="tableContent" v-show="IsShow.HiddenDealcount">
            <table class="myTable">
                <thead>
                <tr>
                    <td>成交价(元)</td>
                    <td>成交量(手)</td>
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
                                :style="{width: item.widthItem + '%', background: item.ColorDeal,height: item.heightItem + 'px',}"
                                ></div>
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-show="!IsShow.HiddenDealcount">不是交易日</div>
        <div id="paginationWrap" ref="paginationWrap" v-show="IsShow.HiddenDealcount">
            <el-pagination
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

    export default {
    name: "Stockdealcount",
    data() {
        return {
        Symbol: "600000.sh", //板块代码
        DealData: null, //数据类
        PriceList: [],
        ProportionList: [], //占比数组
        Date: "20180508",
        IsShow: {
            HiddenDealcount: true
        },
        Pagination: {
            CurrentPage: 0,
            PageSize: 0,
            Total: 0
        },
        DataList: []
        };
    },
    props: {
        DefaultSymbol: String,
        DefaultDate: String
    },
    watch: {
        DefaultSymbol(newV) {
        this.Symbol = newV;
        this.GetDealCountData();
        },
        DefaultDate(newV) {
        this.Date = newV;
        this.GetDealCountData();
        }
    },
    created() {
        this.Symbol = this.DefaultSymbol != null ? this.DefaultSymbol : "600000.sh";
        this.Date = this.DefaultDate != null ? this.DefaultDate : "20180508";
        this.GetDealCountData();
    },
    mounted: function() {
        this.PriceList = this.DataList.slice(0, this.Pagination.PageSize);
        this.OnSize();
    },

    methods: {
        GetDealCountData() {
        this.DealData = JSCommonStock.JSStock.GetDealDay(this.Symbol);
        this.DealData.Date = this.Date;
        this.DealData.InvokeUpdateUICallback = this.GetData;
        this.DealData.RequestData();
        },

        // 小数转换成百分数
        ToPercent(point) {
        let percent = Number(point * 100).toFixed(2);
        percent += "%";
        return percent;
        },
        // 获取数据
        GetData() {
            if (this.DealData.Data) {
                this.Pagination.CurrentPage = 1;
                this.DataList = [];
                this.ProportionList = [];
                this.IsShow.HiddenDealcount = true;
                let DealData = this.DealData.Data;
                let dataList1 = this.DealData.Data.PriceList;
                let dataList2 = this.DealData.Data.PriceList;
                dataList1.forEach(value => {
                this.ProportionList.push(value.Proportion);
                });
                // 拿占比最大值
                let arr = this.ProportionList;
                arr.sort(function(a, b) {
                return a - b;
                });
                let maxProportion = arr[arr.length - 1]; //占比最大值

                dataList2.forEach(value => {
                let object = {
                    Price: 0,
                    Proportion: 0,
                    Vol: 0,
                    widthItem: 0,
                    heightItem: 0,
                    ColorDeal: ""
                };
                object.Price = value.Price.toFixed(2); //保留两位小数
                object.Vol = value.Vol / 100; // 股转换成手
                object.Proportion = this.ToPercent(value.Proportion);
                object.widthItem = (value.Proportion / maxProportion) * 100; //最大占比为1，其余按比例
                object.heightItem = 14;
                // 判断占比图颜色
                if (object.Price - DealData.YClose > 0) {
                    object.ColorDeal = "#f00";
                } else {
                    object.ColorDeal = "#008000";
                }
                this.DataList.push(object);
                });
                this.PriceList = this.DataList.slice(0, this.Pagination.PageSize);
                this.Pagination.Total = this.DataList.length;
            } else {
                this.IsShow.HiddenDealcount = false;
            }
        },

        OnSize() {
        let divstockdealcount = this.$refs.divstockdealcount;
        let tableContent = this.$refs.tableContent;
        var paginationWrap = this.$refs.paginationWrap;
        let width = divstockdealcount.clientWidth;
        let height = divstockdealcount.clientHeight;
        if (height <= 0) return;
        let lineHeight = 20; //占比高度
        let borderHeight = 1;
        let mainHight =
            height - lineHeight - borderHeight - paginationWrap.offsetHeight;
        let mainWdith = width + "px";
        let tdHeight = 23;
        let everyTableCount = Math.floor(
            (mainHight - tdHeight - borderHeight) / tdHeight
        );
        if (everyTableCount <= 0) {
            everyTableCount = 1;
        }
        this.UpdateDataShow(everyTableCount);
        tableContent.style.height = mainHight + "px";
        },
        UpdateDataShow(count) {
        this.Pagination.PageSize = count;
        },
        handleCurrentChange(val) {
        var start = this.Pagination.PageSize * (val - 1);
        var end = this.Pagination.PageSize * val;
        this.PriceList = this.DataList.slice(start, end);
        }
    }
    };
</script>


<style lang="scss" type="text/scss">
.divstockdealcount {
  height: 100%;
  border-top: none;
  padding: 0 10px;
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
      width: 100%;
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
        width: 6%;
      }
      th {
        padding-left: 3%;
        text-align: left;
      }

      .chart {
        padding-top: 8px;
        background: #fafbfd;
        // padding: 4px auto;
      }
    }
  }
}
</style>
