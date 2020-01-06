<template>
    <div class="divHistoryDayLine" ref='divHistoryDayLine'>
        <table class="table" ref='daylinetable'>
            <thead>
                <tr>
                    <th v-for='(item,index) in TheadTitle' :key='index'>{{item}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(item,index) in PageData' :key="index+'d'">
                    <td>{{item.Date}}</td>
                    <td>{{item.MaxPrice}}</td>
                    <td>{{item.Open}}</td>
                    <td>{{item.MinPrice}}</td>
                    <td>{{item.Close}}</td>
                    <td>{{item.YClose}}</td>
                    <td>{{item.Vol}}</td>
                    <td>{{item.Amount}}</td>
                </tr>
            </tbody>
        </table>
        <div id="paginationWrap" ref="paginationWrap">
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

    function DefaultData(){}
    DefaultData.GetPageData = function() {
        let dataAry = [];
        let dataObj = {
            Date:'',
            MaxPrice:'',
            Open:'',
            MinPrice:'',
            Close:'',
            YClose:'',
            Vol:'',
            Amount:''
        }
        dataAry.push(dataObj);
        return dataAry;
    }
    export default {
        JSCommonStock:JSCommonStock,
        name: 'HistoryDayLine',
        data() {
            return {
                // JSStock:null,
                Symbol:'600000.sh',
                HistoryData:null,
                PageData:DefaultData.GetPageData(),
                SomeDatesDay:[],
                KLineDayData:[],
                KLineWeekData:[],
                KLineMonthData:[],
                KLinePageData:[],
                StartDate:20190102,
                EndDate:20190528,
                TheadTitle:['日期','最高价','开盘价','最低价','收盘价','昨收价','成交数量','成交金额'],
                Pagination: {
                    SingleTableCount: 0,
                    CurrentPage: 1,
                    PageSize: 50,
                    Total: 10
                }
            }
        },

        props:
        [
            'DefaultSymbol',    //默认股票
            'DefaultStartDate',
            'DefaultEndDate',
            'DefaultDateType'
        ],

        //创建
        created: function () {
            if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol; //默认股票
            if(this.DefaultStartDate) this.StartDate = this.DefaultStartDate;
            if(this.DefaultEndDate) this.EndDate = this.DefaultEndDate;

            this.HistoryData = JSCommonStock.JSStock.GetHistoryDayData(this.Symbol);
            this.HistoryData.InvokeUpdateUICallback = this.HistoryDataCallback;
            this.HistoryData.RequestData();
            
        },

        mounted: function () {
            this.OnSize();
        },
        watch:{
            DefaultStartDate(val){
                this.StartDate = val;
                this.GetSomeDatesData();
            },
            DefaultEndDate(val){
                this.EndDate = val;
                this.GetSomeDatesData();
            },
            DefaultSymbol(val){
                this.Symbol = val;
                this.HistoryData = JSCommonStock.JSStock.GetHistoryDayData(this.Symbol);
                this.HistoryData.InvokeUpdateUICallback = this.HistoryDataCallback;
                this.HistoryData.RequestData();
            },
            DefaultDateType(val){
                
                var data = [];
                switch(val){
                    case '0':
                        data = this.KLineDayData;
                        break;
                    case '1':
                        data = this.KLineWeekData;
                        break;
                    case '2':
                        data = this.KLineMonthData;
                        break;
                }
                this.KLinePageData = data;
                console.log('[historydayline::DefaultDateType]data:',data);
                this.GetSomeDatesData();
            }
        },

        methods: {
            HistoryDataCallback(){
                if(this.HistoryData.Data){
                    var data = this.HistoryData.Data;
                    this.KLineDayData = data.KLine;
                    this.KLineWeekData = this.HistoryData.GetWeekData();
                    this.KLineMonthData = this.HistoryData.GetMonthData();
                    this.KLinePageData = this.KLineDayData;
                    this.GetSomeDatesData();  
                }

            },
            GetSomeDatesData(){
                var data = this.KLinePageData;
                this.SomeDatesDay.splice(0,this.SomeDatesDay.length);
                for(let i = 0; i < data.length; i++){
                    var item = data[i];
                    if(item.Date >= this.StartDate && item.Date <= this.EndDate){
                        var obj = {
                            Date: item.Date,
                            MaxPrice: StringFormat.StockStringFormat.FormatValueString(item.High,2),
                            Open: StringFormat.StockStringFormat.FormatValueString(item.Open,2),
                            MinPrice: StringFormat.StockStringFormat.FormatValueString(item.Low,2),
                            Close: StringFormat.StockStringFormat.FormatValueString(item.Close,2),
                            YClose: StringFormat.StockStringFormat.FormatValueString(item.YClose,2),
                            Vol: item.Vol,
                            Amount: StringFormat.StockStringFormat.FormatValueString(item.Amount,2)
                        };
                        this.SomeDatesDay.push(obj);
                    }
                }
                this.Pagination.Total = this.SomeDatesDay.length;
                this.PaginationTotalData(this.Pagination.CurrentPage);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.PaginationTotalData(val);
            },
            PaginationTotalData(page){
                var count = this.Pagination.PageSize;
                var startIndex = (page - 1) * count;
                var endIndex = page * count;
                this.PageData = this.SomeDatesDay.slice(startIndex,endIndex);
            },
            OnSize(){
                var divHistoryDayLine = this.$refs.divHistoryDayLine;
                var paginationWrap = this.$refs.paginationWrap;
                var width = divHistoryDayLine.clientWidth;
                var height = divHistoryDayLine.clientHeight;
                var paginationWrapHeight = paginationWrap.offsetHeight;
                var theadHeight = 28;
                var borderWidth = 1;
                var tdHeight = 24;
                var dataHeight = height - theadHeight - borderWidth*1 - paginationWrapHeight;
                var dataCount = parseInt(dataHeight / (tdHeight + borderWidth));

                this.Pagination.PageSize = dataCount;
            }
        }
    }
</script>

<style scoped lang='less'>
*{margin: 0;padding: 0;}
.divHistoryDayLine{
    width: 100%;
    height: 100%;
    font: 14px "Microsoft Yahei";
    @border: 1px solid #ccc;
    .table{
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;
        thead>tr>th,thead>tr>td,tbody>tr>td{
            border: @border;
            padding: 0 10px;
        }
        thead>tr>th,thead>tr>td{
            height: 28px;
            line-height: 28px;
        }
        tbody>tr>td{
            height: 22px;
            line-height: 22px;
        }
    }
    #paginationWrap{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
}

</style>