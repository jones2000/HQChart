<template>
    <div id="content">
        <div class="pagePrompt">历史数据从2018年开始，当天数据每天18:00以后才有</div>
        <div class="content_top">
            <div class="top_title">
                <p class='name'>{{ContentTopData.Name}}</p>
                <div class="topSearchWrap">
                    <div>
                        <p class='symbolText'>{{ContentTopData.Symbol}}</p>
                        <button class="searchBtn" @click='GoSearch'>股票查询</button>
                    </div>

                    <div class="editSymbol" v-show='IsShow.Search'>
                        <SearchSymbol ref="mySymbol" @inputValue='searchSymbol'></SearchSymbol>
                        <button class="cancelBtn"  @click='CancelSearch'>取消</button>
                    </div>
                </div>
            </div>
            <div class="top_title2">
                <p>成交日期</p>
                <p>{{ContentTopData.TradeDate}}</p>
            </div>
            <div class="priceWrap">
                <p class="price" :class='ContentTopData.Price.Color'>收盘：{{ContentTopData.Price.Text}}</p>
            </div>
            <div class="stockInfoWrap">
                <p class='open' :class='ContentTopData.Open.Color'>开盘：{{ContentTopData.Open.Text}}</p>
                <p class='yclose'>昨收：{{ContentTopData.YClose}}</p>
            </div>
            <div class="datePickerWrap">
                <el-date-picker v-model="DataPicker" format="yyyy-MM-dd" value-format="yyyyMMdd" type="date"
                    placeholder="选择日期" @change="changeTime" :picker-options="pickerOptions0"></el-date-picker>
            </div>
            <div id="searchContainer">
                <el-button @click="downJson" type="primary">下载</el-button>
            </div>
        </div>

        <div ref='selectOrderWrap' id='selectOrderWrap'>
            <div class="tabWrap"><span v-for='(item,index) in TabTexts' :class='{active:index == TabIndex}' @click='ChangeContentShow(index)'>{{item}}</span></div>
            <div class="selectorForDealDetail" v-show='IsShow.DealDetail'>
                <span style="padding-left:20px;">筛选大单：</span>
                <el-radio-group v-model="OrderType">
                    <el-radio :label="1">全部</el-radio>
                    <el-radio :label="2">≥100手</el-radio>
                    <el-radio :label="3">≥200手</el-radio>
                    <el-radio :label="4">≥500手</el-radio>
                    <el-radio :label="5">≥1000手</el-radio>
                    <el-radio :label="6">≥2000手</el-radio>
                    <el-radio :label="7">≥5000手</el-radio>
                    <el-radio :label="8">≥10000手</el-radio>
                </el-radio-group>
                <span style="padding-left:40px;">排列顺序：</span>
                <el-checkbox v-model="RerverChecked">倒序</el-checkbox>
            </div>
        </div>
        <div class="table_content" ref='tableContent' v-loading="loadingBody" v-show='IsShow.DealDetail'>
            <div class="tableWrap" v-for='(curTable,index) in TableData.CurentTables' :key='index'>
                <table class="tabHori">
                    <thead>
                        <tr>
                            <td>时间</td>
                            <td class="alignCenter">价格</td>
                            <td class="alignCenter">成交量(手)</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='(rowItem,ind) in curTable' :key='ind'>
                            <td>{{rowItem.Time}}</td>
                            <td class="alignRight" :class='rowItem.PriceColor'>{{rowItem.Price}}</td>
                            <td class="alignRight">{{parseInt(rowItem.Vol)}}&nbsp;<span :class="rowItem.Flag == 'B' ? 'red' : 'green'">{{rowItem.Flag}}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="charWrap" id='charWrap' ref='charWrap' v-show='IsShow.MinuteChart'>
            <StockChart ref='stockChart' :DefaultSymbol='OptionData.Symbol' :DefaultOption='OptionData.MinuteOption'></StockChart>
        </div>

        <el-row id='paginationWrap' v-show='IsShow.DealDetail'>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="Pagination.CurrentPage"
                :page-size="Pagination.PageSize"
                layout="prev, pager, next, jumper"
                :total="Pagination.Total">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    import $ from "jquery";
    import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'
    import SearchSymbol from './searchsymbol.vue'
    import StockChart from './stockchart.vue'

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function ContentTop(){}
    ContentTop.GetDeaultData = function() {
        let data = {
            Symbol:'',
            Name:'',
            TradeDate:'',
            Price:{
                Text:'',
                Color:'',
            },
            Open:{
                Text:'',
                Color:'',
            },
            YClose:0
        }
        return data;
    }

    export default {
        data() {
            return {
                DataPicker: '',
                // input1: "",
                pickerOptions0: {
                    disabledDate(time) {
                        var dateValue = new Date('2018-01-01 00:00:00').getTime();
                        return (time.getTime() > Date.now()) || (time.getTime() < dateValue);
                    }
                },
                TableData:{Meta:[],Selected:[],SelectedReverse:[],Paginationed:[],CurrentPageData:[],CurentTables:[]}, //Meta:接口返回的数据，Selected：筛选后的数据，Paginationed：筛选后分页过的数据,CurrentPageData：当前页面所有表格的数据
                AllPageData:[],
                CuttingIndex: 6,
                contentSpan: "", //span
                loadingBody: false,
                TabTexts:['成交明细','走势图'],
                TabIndex:0,
                OptionData:{
                    Symbol:'',
                    // Name:'',
                    DatePicker:'',
                    MinuteOption:{
                        Type: '历史分钟走势图', 
                        //IsShowCorssCursorInfo:false,
                        HistoryMinute: {TradeDate:0}
                    }
                    // DateFormat:''
                },
                IsShow:{
                    Search:false,
                    DealDetail:true,
                    MinuteChart:false
                },
                ContentTopData:ContentTop.GetDeaultData(),
                num: 0,
                ulHeight: 0,
                mainHight: 0,
                OrderType: 1,
                // QueryUrl:'',
                RerverChecked: false,
                Pagination:{
                    SingleTableCount:0,
                    CurrentPage:1,
                    PageSize:20 * 6,
                    Total:10
                }
            };
        },
        components:{SearchSymbol,StockChart},
        computed:{
            DateFormat:function(){
                return this.OptionData.DatePicker.replace(/-/g, "");
            },
            QueryUrl:function(){
                return "http://beigo.oss-cn-beijing.aliyuncs.com/cache/dealday/day/" + this.DateFormat + "/" + this.OptionData.Symbol + '.json';
            }
        },
        created() {
            document.title = "分时查询数据";
            var bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var width = bodyWidth;
            var height = bodyHeight - 45 -70 - 60;

            this.OptionData.Symbol = this.GetURLParams('symbol') != undefined ? this.GetURLParams('symbol') : '600000.sh';
            this.OptionData.DatePicker = this.GetURLParams('date') != undefined ? this.GetURLParams('date') : this.getLastFormatDate();

            var date = this.FormatDateString(this.OptionData.DatePicker,false);  //走势图日期设置
            this.OptionData.MinuteOption.HistoryMinute.TradeDate = Number(date);
        },
        mounted() 
        {
            const that = this;
            
            this.OnSize();
            this.loadingBody = true;
            
            this.getQueryData(this.QueryUrl, this.getQueryDataFn);
            

            // // 监听
        },
        methods: {
            ChangeContentShow(index){
                this.TabIndex = index;
                switch(index){
                    case 0:
                        this.IsShow.DealDetail = true;
                        this.$refs.charWrap.style.display='none';
                        break;
                    case 1:
                        this.IsShow.DealDetail = false;
                        this.$refs.charWrap.style.display='block';//直接设置到dom里面 vue里面的设置是异步的
                        this.$refs.stockChart.OnSize();
                        break;
                }

            },
            GoSearch(){
                this.IsShow.Search = true;
                var mySymbol = this.$refs.mySymbol;
                mySymbol.deletSymbel();
            },
            CancelSearch(){
                this.IsShow.Search = false;
            },
            UpdateDataShow(count){
                this.Pagination.SingleTableCount = count;
                this.Pagination.PageSize = count * 6;
                this.PaginationAllData(this.TableData.Selected);
                this.InitPageData(this.TableData.CurrentPageData);
            },
            handleSizeChange(val){
                console.log(`每页 ${val} 条`);
            },
            getLastFormatDate() { //获取前一天，并且排除周末
                var day = new Date();
                day.setDate(day.getDate() - 1);
                let weekdayIndex = day.getDay();
                if(weekdayIndex == 0){
                    day.setDate(day.getDate() - 2);
                }else if(weekdayIndex == 6){
                    day.setDate(day.getDate() - 1);
                }
                return day.Format("yyyy-MM-dd");
            },
            handleCurrentChange(val){
                console.log('[::handleCurrentChange val]',val);
                this.TableData.CurrentPageData = this.TableData.Paginationed[val - 1];
                this.InitPageData(this.TableData.CurrentPageData);
            },
            getQueryData: function (url, fn) {
                return $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        fn(res);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            },
            getQueryDataFn(data) {
                // console.log(data,"返回数据2")
                this.ContentTopData.Symbol = data.symbol;
                this.ContentTopData.Name = data.name;
                if(data.date){
                    this.ContentTopData.TradeDate = this.FormatDateString(data.date+'',true);
                }
                if(data.day){
                    this.ContentTopData.Price.Text = data.day.price;
                    this.ContentTopData.Price.Color = this.FormatValueColor(data.day.price,data.day.yclose);
                    this.ContentTopData.Open.Text = data.day.open;
                    this.ContentTopData.Open.Color = this.FormatValueColor(data.day.open,data.day.yclose);
                    this.ContentTopData.YClose = data.day.yclose;
                }
                if (data.deal) {
                    this.TableData.Meta = data.deal;

                    this.Pagination.CurrentPage = 1;
                    this.ChoiceData("", data.deal);
                    
                    this.loadingBody = false;
                }
            },
            InitPageData(data){
                var count = this.Pagination.SingleTableCount;
                this.TableData.CurentTables = this.CutDataAry(count,6,data);
            },
            PaginationAllData(data){
                var dataAry = [];
                if(data.length > 0){
                    var everyCount = this.Pagination.PageSize;
                    var pageCount = 0;
                    var val = this.Pagination.Total % everyCount;
                    if(val > 0){
                        pageCount = Math.floor(this.Pagination.Total / everyCount) + 1;
                    }else{
                        pageCount = Math.floor(this.Pagination.Total / everyCount);
                    }
                    console.log('[::PaginationAllData everyCount pageCount]',everyCount,pageCount);
                    this.TableData.Paginationed = this.CutDataAry(everyCount,pageCount,data);
                    this.TableData.CurrentPageData = this.TableData.Paginationed[this.Pagination.CurrentPage - 1];
                }
            },
            CutDataAry(everyCount,cutIndex,data){
                var paginationAry = [];
                for(let i = 0; i < cutIndex; i++){
                    paginationAry.push(data.slice(everyCount * i,everyCount * (i+1)));
                }
                return paginationAry;
            },
            GetURLParams: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURI(r[2]);
                return null;
            },
            // 成交量筛选方法
            ChoiceData(num,data){
                
                var dataAry = [];
                if(data.time.length > 0){
                    for(let i = 0; i < data.time.length; i++){
                        var color = this.FormatValueColor(data.price[i],this.ContentTopData.Open.Text);
                        var dataObj = {
                            Time: this.processingTime(data.time[i]),
                            Price: data.price[i].toFixed(2),
                            PriceColor:color,
                            Vol: Number(data.vol[i]).toFixed(2),
                            Flag: this.processingNum(data.flag[i])
                        };
                        if (num != '') {
                            if (data.vol[i] >= num) {
                                dataAry.push(dataObj);
                            }
                        } else {
                            dataAry.push(dataObj);
                        }
                    }
                    console.log('[::ChoiceData dataAry]',dataAry);
                    this.TableData.Selected = dataAry;
                    this.TableData.SelectedReverse = dataAry.slice(0,dataAry.length).reverse(); //数组倒序
                    this.Pagination.Total = this.TableData.Selected.length;
                    this.PaginationAllData(this.TableData.Selected);
                    this.InitPageData(this.TableData.CurrentPageData);
                }
            },
            OnSize()
            {
                var contentTopHeight = $('.content_top').outerHeight(true);
                var pagepromptHeight = $('.pagePrompt').outerHeight(true)
                var selectOrderWrapHeight = $('#selectOrderWrap').outerHeight(true);
                var paginationWrap = $('#paginationWrap').outerHeight(true);
                var mainHight = $(window).height() - contentTopHeight - selectOrderWrapHeight -paginationWrap - pagepromptHeight;
                var mainWdith = $('.table_content').width();
                var tdHeight = 20;
                var borderHeight = 1;
                var everyTableCount = Math.floor((mainHight - tdHeight - borderHeight) / tdHeight);
                this.UpdateDataShow(everyTableCount);
                
                $('.table_content').height(mainHight);

                var bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;
                var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var width = bodyWidth;
                var height = bodyHeight - 45 -70 - 60;
                var divChart=this.$refs.charWrap;
                divChart.style.width=width+'px';
                divChart.style.height=height+'px';
                var stockChart = this.$refs.stockChart;
                stockChart.OnSize();

                var minWidth = 1062;
                
            },
            FormatValueColor(currentValue,targetValue){
                var color = '';
                if(currentValue > targetValue){
                    color = 'red';
                }else if(currentValue < targetValue){
                    color = 'green';
                }else{
                    color = '';
                }
                return color;
            },
            FormatDateString(date,hasLine){
                if(hasLine){
                    return date.substring(0,4) +'-'+ date.substring(4,6) +'-'+ date.substring(6,8);
                }else{
                    return date.replace(/-/g, "");
                }
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
            processingNum(num) {
                if (num == 0) {
                    return "B";
                } else if (num == 1) {
                    return "S";
                } else {
                    return "C";
                }
            },
            changeTime(val) {
                this.OptionData.DatePicker = val;
                this.getQueryData(this.QueryUrl, this.getQueryDataFn);

                var date = this.FormatDateString(val,false);
                var stockChart = this.$refs.stockChart;
                stockChart.ChangeTradeDate(Number(date));
                // this.OptionData.MinuteOption.HistoryMinute.TradeDate = Number(date);
            },
            //将【接口Api】的改成可配置的
            getApiURL(url) {
                //将url的改成可配置的
                let AISimilarStatementsConfig = {
                    url: {
                        release: "http://web4.umydata.com",
                        deBug: "",
                    },
                    isRelease: true //本地测试false，生产环境true
                }

                let domain = "";
                if (AISimilarStatementsConfig.isRelease)
                    domain = AISimilarStatementsConfig.url.release;
                else
                    domain = AISimilarStatementsConfig.url.deBug;

                if (url == undefined)
                    return domain;
                return domain + url;
            },
            getPrompt:function(data,fn){
                var apiUrl = this.getApiURL("/API/StockSpell");
                return $.ajax({
                        url: apiUrl,
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json;charset=UTF-8',
                        data: JSON.stringify(data),
                        success: function (res) {
                            fn(res);
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    })
            },
            searchSymbol(symbol) {
                this.OptionData.Symbol = symbol;
                var stockChart = this.$refs.stockChart;
                stockChart.ChangeSymbol(symbol);
                this.loadingBody = true;
                this.OrderType = 1;
                this.RerverChecked = false;
                this.getQueryData(this.QueryUrl, this.getQueryDataFn);
                this.IsShow.Search = false;

            },
            //下载json
            downJson() {
                window.open(this.QueryUrl);
            }
        },
        watch: {
            OrderType(val){
                console.log('[::OrderType val]',val);
                // 成交量筛选
                var deal = this.TableData.Meta;
                if (val == 1) {  //全部
                    this.ChoiceData("",deal); 
                } else if (val == 2) {
                    this.ChoiceData(100,deal);
                } else if (val == 3) {
                    this.ChoiceData(200,deal);
                } else if (val == 4) {
                    this.ChoiceData(500,deal);
                } else if (val == 5) {
                    this.ChoiceData(1000,deal);
                } else if (val == 6) {
                    this.ChoiceData(2000,deal);
                } else if (val == 7) {
                    this.ChoiceData(5000,deal);
                } else if (val == 8) {
                    this.ChoiceData(10000,deal);
                }
                console.log('[::OrderType this.TableData.Selected]',this.TableData.Selected);
            },
            RerverChecked(val) {
                if (val) {
                    this.PaginationAllData(this.TableData.SelectedReverse);
                    this.InitPageData(this.TableData.CurrentPageData);
                }else{
                    this.PaginationAllData(this.TableData.Selected);
                    this.InitPageData(this.TableData.CurrentPageData);
                }
            }
        }
    };
</script>

<style lang='scss'>
    * {
        margin: 0;
        padding: 0;
    }

    html,body {
        width: 100%;
        height: 100%;
        font: 14px 'Microsoft Yahei';
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
            >div {
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
                .topSearchWrap{
                    position: relative;
                    .symbolText{
                        height: 25px;
                        font-size: 18px;
                        line-height: 1;
                        color: #019bdc;
                        display: inline-block;
                    }
                    .searchBtn{
                        width: 55px;
                        line-height: 22px;
                        font-size: 12px;
                        background: #2061a5;
                        border: none;
                        color: #fff;
                        margin-left: 8px;
                    }
                    .cancelBtn{
                        width: 59px;
                        left: 139px;
                        line-height: 23px;
                        background: #2061a5;
                        border: none;
                        color: #fff;
                        position: absolute;
                        top: 0;
                        left: 139px;
                    }
                    .editSymbol{
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
            .stockInfoWrap{
                padding-top: 15px;
                width: 80px;
                left: 425px;
            }
            .datePickerWrap {
                padding-top: 15px;
                left: 530px;
                width: 140px;
                .el-input__inner{
                    border-radius: 0;
                    height: 23px;
                    border: 1px solid #999;
                }
            }
            #searchContainer {
                padding-top: 15px;
                left: 745px;
                #searchSymbolWrap {width: 149px; display: inline-block;}
                .el-button {border-radius: 0; padding: 3px 6px;}
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

                .top_title2 {
                    p {}
                }
            }


            .input-with-button .el-input-group__prepend {
                background-color: #fff;
            }
        }

        #selectOrderWrap{
            height: 60px;
            .selectorForDealDetail {
                display: inline-block;
            }
            .tabWrap{
                display: inline-block;
                height: 20px;
                margin-top: 20px;
                margin-left: 20px;
                $tabBorder: 1px solid #2f2f2f;
                border: $tabBorder;
                >span {
                    display: inline-block;
                    line-height: 20px;
                    padding: 0 10px;
                    cursor: pointer;
                }
                >span:first-child{
                    border-right: $tabBorder;
                }
                >span.active {
                    color: blue;
                }
            }
        }

        .table_content {
            overflow-y: auto;
            height: calc(100% - 118px);
            width: 100%;
            display: flex;
            flex-direction: row;
            overflow-x: hidden;

            .tableWrap{
                flex-grow: 1;
                height: 100%;
                
                .tabHori{
                    font: 12px 'Microsoft Yahei';
                    width: 100%;
                    box-sizing: border-box;
                    border-collapse: collapse;
                    border: none;
                    td,th{
                        border:none;
                        padding: 0 10px;
                        line-height: 20px;
                    }
                    .alignRight {
                        text-align: right;
                    }
                    .alignCenter {
                        text-align: center;
                    }
                    thead {
                        td,th{
                            border-bottom: 1px solid #ebeef5;
                        }
                    }
                    tbody{
                        tr>td:last-child,tr>th:last-child{
                            border-right: 1px solid #ebeef5;
                        }
                    }
                    tr>td:nth-of-type(n+2),tr>th:nth-of-type(n+2){
                        font-size: 14px;
                        
                    }
                }
            }
        }

        .el-table {
            td,th{
                height: 30px;
            }
            td,
            th.is-leaf {
                border-bottom: none !important;
            }
        }

        #paginationWrap {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
</style>