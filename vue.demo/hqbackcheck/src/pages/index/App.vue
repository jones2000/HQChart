<template>
    <div id="app2">
        <p class='pageTitle' ref='pageTitle'>策略回测</p>
        <div class='backCheckWrap'>
            <div class="bigDataCheck" id='bigDataCheck' ref='bigDataCheck'>
                <div class="blockTitle indexTitle">{{IndexName}}</div>
                <div class="container klineTab" ref='timeTabForBigData'>
                    <span class="timeInterval" v-for='(time,index) in KlinePageData.TimeIntervalForBack' :key='index' @click='ChangeDate(time.Date,index,true)' :class='{active:index==TimeIntervalIndexSecond}'>{{time.Text}}</span>
                </div>
                <div class="bigDataContent">
                    <p class='profitAmount'>
                        <span class='text'>总收益</span>
                        <span :class='BigDataPageData.Profit.Color'>
                            <span class='sign' v-show='BigDataPageData.SignText != ""'>{{BigDataPageData.SignText}}</span><span class='value'>{{BigDataPageData.Profit.Text}}</span><span class='unit'>%</span>
                        </span>
                        
                    </p>
                    <div class="countCheck clear">
                        <div class="circleChartWrap" ref='circleChartWrap'>
                            <div id="pieChart" ref='pieChart'></div>
                        </div>
                        <div class='tradeStutusCount'>
                            <p class='successRate clear'><span>成功率</span> <span>{{BigDataPageData.Trade.SuccessRate}}</span></p>
                            <p class='success'><span>成功</span><span :class='BigDataPageData.Trade.Success.Color'>{{BigDataPageData.Trade.Success.Value}}</span></p>
                            <p class='fail'><span>失败</span><span :class='BigDataPageData.Trade.Fail.Color'>{{BigDataPageData.Trade.Fail.Value}}</span></p>
                        </div>
                        <div class="runTimeCount">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td>最长运行</td>
                                        <td>{{BigDataPageData.Day.Max}}个交易日</td>
                                    </tr>
                                    <tr>
                                        <td>最短运行</td>
                                        <td>{{BigDataPageData.Day.Min}}个交易日</td>
                                    </tr>
                                    <tr>
                                        <td>平均运行</td>
                                        <td>{{BigDataPageData.Day.Average}}个交易日</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="profitCoefficient">
                        <div class="excessReturn">
                            <p>超额收益</p>
                            <p :class='BigDataPageData.Excess.Color'>{{BigDataPageData.Excess.Text}}</p>
                        </div>
                        <div class="coefficient">
                            <p>β系数</p>
                            <p :class='BigDataPageData.BTcoefficient.Color'>{{BigDataPageData.BTcoefficient.Text}}</p>
                        </div>
                        <div class="maxBack">
                            <p>最大回撤</p>
                            <p>{{BigDataPageData.MaxBackRate.Text}}</p>
                        </div>
                    </div>
                    <div class="blockTitle" ref='blockTitle'>收益走势图</div>
                    <div class="lineChartWrap" ref='lineChartWrap'>
                        <div id="lineChart" ref='lineChart'></div>
                    </div>
                </div>
        
        
            </div>
        </div>
        <div class="hqWrap" ref='hqWrap'>
            <div class="klineWrap" ref='klineWrap' style="width: 900px;height:400px;position: relative;">
                <StockChart ref='stockchart' :DefaultSymbol='Symbol' :DefaultOption='KLineOption'></StockChart>
            </div>
            <div class="indexTools">
                <div id="tools_top" class="top" ref='toolstop'>
                    <span>指标名称：</span>
                    <input class="input" v-model="IndexName" />
                    <select class="changeIndex" v-model="ChangeIndex">
                        <option value="0">主图</option>
                        <option value="1">副图</option>
                    </select>
                    <button class="toolsButton" @click="Execute()">执行</button>
    
                    <span>股票代码：</span>
                    <span style='display:inline-block;width:145px;'>
                        <SearchSymbol @inputValue='GetSearchSymbol'></SearchSymbol>
                    </span>
                    <button class="toolsButton" @click="Change()">切换股票</button>
    
                    <button class="toolsButton" @click="Save()">保存</button>
    
                    <a href="https://opensourcecdn.zealink.com/cache/webcache/hqfunctionhelp/index.html#/13"
                        target="_blank">函数帮助</a>
                    
                    <input type="radio" id="scriptTextRadio" value='script' v-model="ScriptType">
                    <label for="scriptTextRadio">麦语法脚本</label>

                    <button class="toolsButton" @click="ShowDemoText">示例</button>
                </div>
                <div class="editorWrap clear" ref='editorWrap'>
                    <div class="code">
                        <codemirror v-model="Code" :options="CMOptions"></codemirror>
                    </div>
                    <div class="cache" id="tools_cache">
                        <ul>
                            <li v-bind:class="{ active: index == activeIndex }" v-for="(item, index) in ScriptIndexList"
                                @click="SelectCacheIndex(index)">
                                {{item.name}}
                                <span @click.stop="DeleteCacheIndex(index)">删除</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="tooltipWrap" v-show='Demo.IsShow'>
            <textarea id="tArea" cols="30" rows="10" v-model='Demo.DemoCode'></textarea>
            <p class='promptText PriceUp'>{{Demo.PromptText}}</p>
            <button type='button' class='promptBtn' @click='CloseTooltip'>确定</button>
        </div>
        
        
    </div>

</template>

<script>
    import $ from 'jquery'
    import HQChart from 'hqchart'
    import JSRegressionTest from 'hqchart/src/jscommon/umychart.vue/umychart.regressiontest.vue.js'
    import StockChart from '../../components/stockchart.vue'
    import SearchSymbol from '../../components/searchsymbol.vue'
    
    // language js
    import 'codemirror/mode/javascript/javascript.js'

    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require("echarts/lib/component/legend");

    //预加载行情iconfont资源
    var WebFont = require('webfontloader');
    WebFont.load({ custom: { families: ['iconfont'] } });

    function DefaultData(){}

    DefaultData.GetKLineOption = function () 
    {
        let data = 
        {
            Type: '历史K线图', 
            Windows: //窗口指标
            [
                {Index:"Zealink-操盘BS点2",Modify: true, Change: true}, 
                {Index:"VOL",Modify: true, Change: true}
            ], 
            IsShowCorssCursorInfo:true,
            Border: //边框
            {
                Right: 50 //右边间距
            },
            JSStock: null,
            KLine:
            {
                Right:1,                            //复权 0 不复权 1 前复权 2 后复权
                Period:0,          //周期: 0 日线 1 周线 2 月线 3 年线 
                FirstShowDate:20190101,
                PageSize:70,
                IsShowTooltip:true
            },
            
        };
        return data;
    }

    DefaultData.GetListData = function() {
        var dataAry = [];
        for(let i = 0; i < 5; ++i){
            dataAry.push({
                name:{isEdit:false,value:''},
                min:{isEdit:false,value:''},
                max:{isEdit:false,value:''},
                value:{isEdit:false,value:''}
            });
        }
        return dataAry;
    }
    DefaultData.GetBigDataPageData = function() {
        let data = {
                SignText:'',
                Day: {Count: 0, Max: 0, Min: 0, Average: 0},//Count:总运行
                Excess: {Text:'',Color:''},//超额收益
                IndexProfit: 0,//大盘收益
                NetValue: [],
                BTcoefficient:{Text:'',Color:''},
                Profit: {Text:'',Color:''},  //总收益
                Trade:{//Count 交易次数  Days:交易天数
                    Count: 0,
                    Days: 0,
                    Fail: {Fail:0,Color:''},
                    Success: {Fail:0,Color:''},
                    SuccessRate: ''
                },
                MaxBackRate:{Text:'',Color:''},
                LineChartDateAry:[],
                ClosePerAry:[],
                NetPerAry:[]
        };
        return data;
    }

    //回归测试
    var DATA_NAME=
    {
        ONE_YEAR:0,     //最近1年
        THREE_YEAR:1,    //最近3年
        THIS_YEAR:2,    //今年以来
        THREE_MONTH:4,  //最近3月
    }

    export default {
        data() {
            return {

                KLineOption:null,

                IndexName: "",
                Symbol: "",
                ChangeIndex: 0,
                ScriptType:'script',

                JSChart:null,

                List:DefaultData.GetListData(),

                Code:'',
                CMOptions: {
                    tabSize: 4,
                    mode: 'text/javascript',
                    lineNumbers: true,
                    line: true,
                },

                ScriptIndexList: [],
                activeIndex: -1,
                cacheKye: "i_s_c",
                KlinePageData:{
                    TimeIntervalForBack:[
                        {Text:'最近1年',Date:0},
                        {Text:'最近3年',Date:0},
                        {Text:'今年以来',Date:0}
                    ]
                },
                TimeIntervalIndexSecond:0,
                BigDataPageData:DefaultData.GetBigDataPageData(),
                JSChart:null,
                LineChart:null,
                PieChart:null,
                LineChartOption:null,
                PieChartOption:null,
                IsRegressionTest:true,
                RegressionTestModel:0,
                // QCodeImage:'',
                // IsDisabled:false,
                // QCodeIsShow:false,
                Demo:{
                    DemoCode:'',
                    PromptText:'',
                    IsShow:false
                }

            }

        },
        components:{StockChart,SearchSymbol},
        created(){
            var symbol = this.getURLParams('symbol');
            this.Symbol = symbol != null ? symbol : '600000.sh';

            var model=this.getURLParams('model');        //计算模型
            if (model) this.RegressionTestModel=parseInt(model);
    
            this.KLineOption = DefaultData.GetKLineOption();

            console.log('HQChart:',HQChart);
            // console.log('HQChart.Chart',HQChart.Chart);
            var jsIndexData = new (HQChart.Chart.JSIndexScript)();
            let testIndex = jsIndexData.Get(this.KLineOption.Windows[0].Index);
            // let testIndex = jsIndexData.Get('MACD');
            this.Code = testIndex.Script;
            var args = testIndex.Args;
            this.setTableList(args);
            this.IndexName = testIndex.Name;
           
            this.GetCacheList();
        },
        mounted(){
            this.OnSize();
            var that = this;
            window.onresize = function() {
                that.OnSize();
            }

            var stockchart = this.$refs.stockchart;
            this.JSChart = stockchart.JSChart; //通过子组件获取JSChart,$refs在mounted中才有
            this.JSChart.AddEventCallback({event:HQChart.Chart.JSCHART_EVENT_ID.RECV_INDEX_DATA,callback:this.BSCallBack});

        },
        watch:{
            TimeIntervalIndexSecond:function(dateIndex){ //切换日期
                var startDateData = this.BigDataAllData.get(dateIndex);
                console.log('[::watch]startDateData:',startDateData);
                this.FormatPageData(startDateData);

                this.PieChartOption.series[0].data[0].value = this.BigDataPageData.Trade.Success.Value;
                this.PieChartOption.series[0].data[1].value = this.BigDataPageData.Trade.Fail.Value;
                this.PieChart.setOption(this.PieChartOption);

                this.LineChartOption.xAxis.data = this.BigDataPageData.LineChartDateAry;
                this.LineChartOption.series[0].data = this.BigDataPageData.NetPerAry;
                this.LineChartOption.series[1].data = this.BigDataPageData.ClosePerAry;
                this.LineChart.setOption(this.LineChartOption);
                
            }
        },
        methods:{
            ShowDemoText(){
                var demoCode = `B1:=WEEK==1;
S1:=WEEK==5;
DRAWICON(B1,L*0.97,13);      //买点
DRAWICON(S1,H*1.03,14);      //卖点
INDEXCLOSE:INDEXC,EXDATA;    //取指数的收盘价 回测的时候计算BATE系数用
                `;//保留换行格式
                var promptText = `注意：样例为基本代码构成；左侧的收益等数据是根据“买点”和“卖点”的值进行计算的，是必写项；指数的收盘价是计算BATE系数用的，不需要可以不填；`;
                this.Demo.DemoCode = demoCode;
                this.Demo.PromptText = promptText;
                this.Demo.IsShow = true;
            },
            CloseTooltip(){
                this.Demo.IsShow = false;
            },
            OnSize(){
                var hqWrap = this.$refs.hqWrap;
                var hqWrapWPer = 0.7;
                var borderWidth = 1;
                var hqPadLeft = 5;
                var hqClientWid = window.innerWidth * hqWrapWPer - borderWidth - hqPadLeft;
                var width = hqWrap.clientWidth;
                var klineWrap = this.$refs.klineWrap;
                var toolstop = this.$refs.toolstop;
                var editorWrap = this.$refs.editorWrap;
                var pageTitle = this.$refs.pageTitle
                var height= $(window).height() - pageTitle.offsetHeight - toolstop.offsetHeight - editorWrap.offsetHeight; //300高度给指标编辑器
                var klineWidth = hqClientWid;
                klineWrap.style.width=klineWidth+'px';
                klineWrap.style.height=height+'px';
                this.$refs.stockchart.OnSize();

                var circleChartWrap = this.$refs.circleChartWrap;
                var pieChart = this.$refs.pieChart;
                var lineChartWrap = this.$refs.lineChartWrap;
                var lineChart = this.$refs.lineChart;
                var circleChartWrapWidth = circleChartWrap.clientWidth;
                var paddingTopWrap = 8;
                var circleChartWrapHeight = circleChartWrap.clientHeight - paddingTopWrap;
                var pieChartWidth = circleChartWrapWidth > circleChartWrapHeight ? circleChartWrapWidth : circleChartWrapHeight;
                pieChartWidth = pieChartWidth > 88 ? 88 : pieChartWidth;
                pieChart.style.width = pieChartWidth + 'px';
                pieChart.style.height = pieChartWidth + 'px';
                
                var lineChartWidth = lineChartWrap.clientWidth;
                lineChart.style.width = lineChartWidth + 'px';
                lineChart.style.height = '269px'; //设计图折线图高度

                this.PieChartRefresh();
                this.LineChartRefresh();


            },
            GetSearchSymbol(symbol){
                this.Symbol = symbol;
            },
            PieChartRefresh(){
                if(this.PieChart != null){
                    this.PieChart.resize();
                }
            },
            LineChartRefresh(){
                if(this.LineChart != null){
                    this.LineChart.resize();
                }
            },
            getURLParams(name) 
            {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURI(r[2]);
                return null;
            },
            Execute: function () 
            {
                this.ClearBackCheckData();
                this.IsRegressionTest=true;
                console.log('[::Execute]IndexName:',this.IndexName);
                this.JSChart.ChangeScriptIndex(parseInt(this.ChangeIndex), { Name: this.IndexName, Script: this.Code, Args: this.GetArgs(), "Modify": true, "Change": true });
                
            },
            ClearBackCheckData(){
                this.BigDataPageData = DefaultData.GetBigDataPageData();
            },
            Change: function () {
                this.ClearBackCheckData();
                this.IsRegressionTest=true;
                this.JSChart.ChangeSymbol(this.Symbol);
            },
            GetArgs: function () {
                var args = [];

                for (var i = 0; i < this.List.length; i++) {
                    var name = this.List[i].name.value,
                        value = this.List[i].value.value;

                    if (!name || !value)
                        continue;

                    value = parseInt(value);

                    args.push({
                        Name: name,
                        Value: value
                    });
                }

                return args;
            },
            ChangeDate(date,index,isClickBack){
                this.TimeIntervalIndexSecond = index;
                console.log(`[::ChangeDate]index:${index},TimeIntervalIndexSecond:${this.TimeIntervalIndexSecond}`);
                
            },
            InitPieChart(){
                if(this.PieChart == null){
                    this.PieChart = echarts.init(document.getElementById('pieChart'));
                }
                var pieChartOption = {
                        series: [
                            {
                                name:'',
                                type:'pie',
                                radius: ['70%', '100%'],
                                hoverAnimation:false,
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[
                                    {value:this.BigDataPageData.Trade.Success.Value, name:'成功次数', itemStyle: { color: 'rgb(92,153,235)' },
                                            emphasis:{
                                                itemStyle:{
                                                    color:'rgb(92,153,235)'
                                                } }
                                    },
                                    {value:this.BigDataPageData.Trade.Fail.Value, name:'失败次数', itemStyle: { color: 'rgb(239,241,244)'},
                                            emphasis:{
                                                itemStyle:{
                                                    color:'rgb(239,241,244)'
                                                } }
                                    }
                                ]
                            }
                        ]
                };
                this.PieChartOption = pieChartOption;
                // 绘制图表
                this.PieChart.setOption(pieChartOption);
            },
            InitLineChart(){
                if(this.LineChart == null){
                    this.LineChart = echarts.init(document.getElementById('lineChart'));
                }
                var lineChartOption = {
                        legend: {
                            data:['策略收益','股价走势'],
                            top:'0',
                            textStyle:{
                                fontSize: 12
                            }
                        },
                        // tooltip: {
                        //     trigger: 'axis',
                        //     formatter: '{a0}: {c0}</br>{a1}: {c1}'
                        // },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top: '8%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: this.BigDataPageData.LineChartDateAry
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel:{
                                formatter:function(value, index){
                                    var percent = value * 100 + '%';
                                    return percent;
                                }
                            }
                        },
                        series: [
                            {
                                name:'策略收益',
                                type:'line',
                                smooth: true,
                                data:this.BigDataPageData.NetPerAry,
                                itemStyle: { color: 'rgb(239,136,53)'}
                            },
                            {
                                name:'股价走势',
                                type:'line',
                                smooth: true,
                                data:this.BigDataPageData.ClosePerAry, 
                                itemStyle: { color: 'rgb(84,114,219)'}
                            }
                        ]
                };
                this.LineChartOption = lineChartOption;
                this.LineChart.setOption(lineChartOption);
            },
            
            BSCallBack(event,data,obj)
            {
                this.loading = false;
                console.log('[BSCallBack]Name',data.Name,data);
                if(data.Name == this.IndexName)
                {
                    
                    if(this.IsRegressionTest)
                    {
                        var test=new JSRegressionTest.RegressionTest();
                        test.NetCalculateModel=this.RegressionTestModel;
                        var policyData=JSRegressionTest.RegressionTest.GetPolicyData(data); //从指标的数据里提起回测需要的计算数据
                        test.SetPolicyData(policyData); //设置指标结果数据
                        
                        var periodData=[];  //计算周期数据
                        var today=new Date();
                        

                        var startDate=(today.getFullYear()-1)*10000+(today.getMonth()+1)*100+today.getDate();
                        periodData.push({Name:DATA_NAME.ONE_YEAR,Date:startDate});
                        
                        var startDate=(today.getFullYear() - 3)*10000+(today.getMonth()+1)*100+today.getDate();
                        periodData.push({Name:DATA_NAME.THREE_YEAR,Date:startDate});

                        var startDate=today.getFullYear()*10000+1*100+1;
                        periodData.push({Name:DATA_NAME.THIS_YEAR,Date:startDate});

                        test.Execute(periodData);

                        console.log('[BSCallBack] RegressionTest data', test.Data);
                        this.BigDataAllData = test.Data;
                        var startDateData = test.Data.get(DATA_NAME.ONE_YEAR);
                        this.FormatPageData(startDateData);

                        this.InitPieChart();
                        this.InitLineChart();
                        
                        this.IsRegressionTest = false;
                        console.log('[BSCallBack] IsRegressionTest',this.IsRegressionTest);
                    }
                    
                }
            },
            FormatPageData(startDateData){
                if(startDateData.Profit > 0){
                    this.BigDataPageData.SignText = '+';
                }else if(startDateData.Profit == 0){
                    this.BigDataPageData.SignText = '';
                }else{
                    this.BigDataPageData.SignText = '-';
                }
                console.log('[::FormatPageData]Profit:',startDateData.Profit);
                var profitValue = Math.abs(startDateData.Profit * 100);
                this.BigDataPageData.Profit.Text = HQChart.Chart.IFrameSplitOperator.FormatValueString( profitValue , 2);
                this.BigDataPageData.Profit.Color = HQChart.Chart.IFrameSplitOperator.FormatValueColor(startDateData.Profit,0); //PriceUp PriceDown

                
                this.BigDataPageData.Trade.SuccessRate = HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.Trade.SuccessRate*100, 2) + '%';
                this.BigDataPageData.Trade.Success.Value = startDateData.Trade.Success;
                this.BigDataPageData.Trade.Success.Color = 'PriceUp';
                this.BigDataPageData.Trade.Fail.Value = startDateData.Trade.Fail;
                this.BigDataPageData.Trade.Fail.Color = 'PriceDown';
                
                this.BigDataPageData.Day.Count = startDateData.Day.Count;
                this.BigDataPageData.Day.Max = startDateData.Day.Max;
                this.BigDataPageData.Day.Min = startDateData.Day.Min;
                this.BigDataPageData.Day.Average = HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.Day.Average,1);

                if(startDateData.Excess > 0){
                    this.BigDataPageData.Excess.Text = '+' + HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.Excess*100,2) + '%';
                }else{
                    this.BigDataPageData.Excess.Text = HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.Excess*100,2) + '%';
                }
                this.BigDataPageData.Excess.Color = HQChart.Chart.IFrameSplitOperator.FormatValueColor(startDateData.Excess,0);

                this.BigDataPageData.BTcoefficient.Text = HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.Beta,2)
                this.BigDataPageData.BTcoefficient.Color = HQChart.Chart.IFrameSplitOperator.FormatValueColor(Number(this.BigDataPageData.BTcoefficient.Text),0);

                this.BigDataPageData.MaxBackRate.Text = HQChart.Chart.IFrameSplitOperator.FormatValueString(startDateData.MaxDropdown*100,2) + '%';
                
                this.BigDataPageData.LineChartDateAry.splice(0,this.BigDataPageData.LineChartDateAry.length);

                var aryClose=[], aryNet=[];
                for(let i = 0; i < startDateData.NetValue.length; i++)
                {
                    var item = startDateData.NetValue[i];
                    var date = item.Date;
                    this.BigDataPageData.LineChartDateAry.push(date);
                    aryClose.push(item.Close);
                    aryNet.push(item.Net);
                }

                //计算叠加
                var overlayData=JSRegressionTest.RegressionTest.CaclulateOverlayData({Main:aryClose, Sub:[aryNet]});
                this.BigDataPageData.ClosePerAry=overlayData[0];
                this.BigDataPageData.NetPerAry=overlayData[1];
            },
            setTableList(args){
                for(let i = 0; i < args.length; ++i){
                    var item = args[i];
                    this.List[i].name.value = item.Name;
                    this.List[i].min.value = 1;
                    this.List[i].max.value = 100;
                    this.List[i].value.value = item.Value;

                    this.List[i].name.isEdit = false;
                    this.List[i].min.isEdit = false;
                    this.List[i].max.isEdit = false;
                    this.List[i].value.isEdit = false;
                }
            },
            Save: function () {
                var cacheValue = this.GetScriptNameValue();
                console.log('[::save]cacheValue:',cacheValue);

                var hasIndex = -1;

                for (var i = 0; i < cacheValue.length; i++) {
                    if (cacheValue[i].name == this.IndexName) {
                        hasIndex = i;
                        break;
                    }
                }

                var data = {
                    indexName: this.IndexName,
                    code: this.Code,
                    args: this.List
                };

                if (hasIndex > -1 && confirm("【" + this.IndexName + "】已存在，是否覆盖？")) {
                    cacheValue[hasIndex].value = data;
                } else {
                    cacheValue.push({
                        name: this.IndexName,
                        value: data
                    });
                }

                this.SetScriptNameValue(cacheValue);
            },
            SelectCacheIndex: function (index) {
                var _this = this;

                _this.activeIndex = index;

                var data = _this.GetScriptNameValue()[index].value;

                this.IndexName = data.indexName;
                this.Code = data.code;
                this.setTableList(data.args);
                // jsEditor.setValue(data.code);
                // Root.table.setValue(data.args);
            },
            DeleteCacheIndex: function (index) {
                var _this = this;

                var list = _this.GetScriptNameValue();

                if (confirm("是否删除【" + list[index].name + "】")) {
                    list.splice(index, 1);

                    _this.SetScriptNameValue(list);
                }
            },
            GetCacheList(){
                this.ScriptIndexList = this.GetScriptNameValue();
            },
            GetScriptNameValue(){
                var _this = this;

                var cacheValue = localStorage[_this.cacheKye] || [];
                cacheValue = typeof cacheValue == "string" ? JSON.parse(cacheValue) : cacheValue;

                return cacheValue;
            },
            SetScriptNameValue(val){
                var _this = this;

                localStorage[_this.cacheKye] = JSON.stringify(val);

                this.GetCacheList();
            }
        }
    }
</script>

<style lang='scss' scoped>
* {margin: 0;padding: 0;}
$border: 1px solid #e9e9e9;
$contentPadding: 0 4%;
.PriceUp{
    color: rgb(212,63,62);
}
.PriceDown{
    color: rgb(81,171,92);
}
@mixin afterline(){
    content: '';
    height: 2px;
    border-radius: 2px;
    background-color: #fff;
    position: absolute;
    bottom: -2px;
}
#app2{
    font: 14px 'Microsoft Yahei';
    position: relative;
    .clear::after{
        content: '';
        width: 0;
        height: 0;
        display: block;
        overflow: hidden;
        clear: both;
    }
    .pageTitle {
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        border-bottom: $border;
    }
    .backCheckWrap,.hqWrap{
        position: absolute;
        top: 36px;
        box-sizing: border-box;
    }
    .backCheckWrap{
        left: 0;
        width: 30%;
        padding-right: 5px;
        box-sizing: border-box;
        .bigDataCheck{
            font: 14px 'Microsoft Yahei';
            .klineTab{
                height: 32px;
                padding-top: 7px;
                border-bottom: $border;
                border-top: $border;
                /* box-shadow: 0 2px 10px #e9e9e9; */
                white-space: nowrap;
                overflow: hidden;
                .timeInterval{
                    line-height: 1;
                    display: inline-block;
                    padding: 5px 0;
                    margin-right: 10px;
                    position: relative;
                }
                .timeInterval::after{
                    @include afterline();
                    width: 100%;
                    left: 0;
                }
                .timeInterval.active{
                    color: #3669c4;
                }
                .timeInterval.active::after{
                    background-color: #3669c4
                }
                .periodWrap{
                    position: relative;
                    height: 24px;
                }
                .periodWrap::after{
                    content: '';
                    width: 0;
                    height: 0;
                    position: absolute;
                    right: 8px;
                    top: 8px;
                    border-style: solid;
                    border-width: 6px 5px 0 5px;
                    border-color: #666 transparent transparent transparent;

                }
                .rightWrap {
                    line-height: 1;
                    padding: 3px 4px;
                    border: 1px solid #fff;
                    margin-right: 6px;
                    font-size: 12px;
                    border-radius: 3px;
                }
                .rightWrap.active {
                    color: #ff9340;
                    border: 1px solid #ff9340;
                }
                .rightWrap:last-child{
                    margin-right: 0;
                }
            }
            .profitAmount{
                padding: 5px 4% 0 4%;
                height: 30px;
                margin-bottom: 9px;
                .sign{
                    font-size: 16px;
                }
                .value {
                    font-size: 30px;
                    line-height: 1;
                }
                .unit{
                    font-size: 12px;
                    margin-left: 6px;
                }
                .text{
                    margin-right: 14px;
                    font-size: 15px;
                }
            }
            .countCheck{
                padding: $contentPadding;
                padding-bottom: 21px;
                font-size: 12px;
                >div{
                    float: left;
                }
                .circleChartWrap{
                    width: 24%;
                    height: auto;
                    margin-right: 4%;
                    padding-top: 8px;
                    /* .successRate{
                        line-height: 21px;
                        font-size: 12px;
                    } */
                }
                .tradeStutusCount{
                    width: 28%;
                    margin-right: 5%;
                    /* padding-top: 27px; */
                    /* font-size: 15px; */
                    .success,.fail{
                        line-height: 30px;
                        >span {
                            display: inline-block;
                            width: 50%;
                        }
                        >span:last-child{
                            text-align: right;
                        }
                        border-bottom: $border;
                    }
                    .successRate{
                        line-height: 30px;
                        border-bottom: $border;
                        >span:last-child{
                            float: right;
                        }
                    }
                    
                }
                .runTimeCount{
                    width: 39%;
                    .table{
                        width: 100%;
                        border-collapse: collapse;
                    }
                    tr{ 
                        >td{
                            line-height: 30px;
                            border-bottom: 1px dashed #e9e9e9;
                        }
                        >td:nth-of-type(1){
                            width: 41%;
                        }
                        >td:nth-of-type(2){
                            width: 59%;
                            text-align: right;
                        }
                    }
                }

            }
            .blockTitle{
                padding: 0 4%;
                line-height: 44px;
            }
            .blockTitle.indexTitle{
                text-align: center;
                line-height: 28px;
            }
            .profitCoefficient{
                display: flex;
                flex-direction: row;
                border-top: $border;
                border-bottom: $border;
                padding: $contentPadding;
                font-size: 15px;
                .excessReturn,.coefficient,.maxBack{
                    width: 32.6%;
                    padding: 10px 0 8px 0;
                    >p {
                        text-align: center;
                    }
                }
                .excessReturn,.coefficient{
                    border-right: $border;
                }
            }

           
        }
    }
    .hqWrap{
        right: 0;
        width: 70%;
        padding-left: 5px;
        border-left: $border;
        box-sizing: border-box;
        .indexTools{
            width: 100%;
            .top{
                padding-bottom:2px;
                white-space: nowrap;
                /* overflow: hidden; */
                .toolsButton{
                    height:32px;
                    padding:0 8px;
                    cursor:pointer;
                }
                span{
                    padding-left:2px;
                }
                .input {
                    height:28px;
                    padding-left:5px;
                }
                .changeIndex {
                    height:32px;
                    width:90px;
                }
            }
            .table {
                width:19%;
                float:left;
                table {
                    width:100%;
                    border-left: 1px solid #ccc;
                    border-top: 1px solid #ccc;
                    margin-left:1px;
                    border-collapse: collapse;
                    tbody td,thead th{
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;
                        height:32px;
                        padding:5px;
                        width:95px;
                    }
                    td input{
                        width:50px;
                    }
                }
            }
            .code {
                float:left;
                width:70%;
                border:1px solid #ccc;
                box-sizing: border-box;
            }
            .cache {
                float:left;
                width:30%;
                border:1px solid #ccc;
                height:300px;
                margin-left:-1px;
                overflow-y:auto;
                box-sizing: border-box;
                li {
                    padding:5px;
                    height:18px;
                    span{
                        float:right;
                        margin-right:5px;
                    }
                }
                li.active,li:hover{
                    background-color:#26B99A;
                    color:#fff;
                    cursor:pointer;
                }
            }
        }
    }
    .tooltipWrap{
        width: 400px;
        height: 300px;
        box-shadow: 0 0 10px 10px #ccc;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -150px;
        padding-top: 20px;
        z-index: 999;
        background-color: #fff;
        box-sizing: border-box;
        .promptText{
            padding: 0 10px;
            margin-bottom: 50px;
        }
        #tArea{
            width: 380px;
            height: 110px;
            margin: 0 auto;
            display: block;
            resize:none;
            margin-bottom: 15px;
        }
        .promptBtn{
            display: block;
            width: 50%;
            margin: 0 auto;
            height: 34px;
            line-height: 34px;
            background-color: #3669c4;
            border-radius: 5px;
            font: 14px 'Microsoft Yahei';
            font-size: 15px;
            color: #fff;
            text-align: center;
            text-decoration: none;
            outline: none;
            margin-top: 14px;
            border: none;
            
        }
    }
}

</style>