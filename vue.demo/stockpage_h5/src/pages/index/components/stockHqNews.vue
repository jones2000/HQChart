<template>
    <div class="tabs qATtabs blockBg">
        <ul class="tabsTitle">
            <li @click="ChangeCurrentNum(0)" :class="{active:CurrentNum==0}">新闻</li>
            <li @click="ChangeCurrentNum(1)" :class="{active:CurrentNum==1}">互动易</li>
            <li @click="ChangeCurrentNum(2)" :class="{active:CurrentNum==2}">调研</li>
            <li @click="ChangeCurrentNum(3)" :class="{active:CurrentNum==3}">公告</li>
            <li @click="ChangeCurrentNum(4)" :class="{active:CurrentNum==4}" >概况</li>
            <li @click="ChangeCurrentNum(5)" :class="{active:CurrentNum==5}">财务</li>
        </ul>
        <div class="tabContent qATabsContent">
            <div v-show="CurrentNum==0" class="newsList likeNewsList item" id="newsList">
                <div class='news-view-list' :class="index%2 > 0?'background-list':''"
                     v-for="(item,index) in NewsList" @click="goInfoNews(item.ID,item.Symbol)" :key="index">
                    <span class="footer-news-title">{{item.Title}}</span>
                    <span class='footer-news-froms'>{{item.Source}}</span>
                    <span class='footer-news-time'>{{NewsTime[index]}}</span>
                </div>
            </div>
            <div v-show="CurrentNum==1" id="qAList">
                <div class='interaction-list' :class="index%2 > 0?'background-list':''" v-for="(item,index) in interactionList" :key="index">
                    <div class='interaction-content question'>
                        <img class='iconImsge' src='../assets/images/ask.png'></img>
                        {{item.Title}}
                    </div>
                    <div class='subquestion'>
                        <span class='questionMan'>提问人：{{item.Author}}</span>
                        <span class='questionTime'>提问时间：{{item.Data}}</span>
                    </div>
                    <div  class='interaction-content answer'>
                        <img class='iconImsge' src='../assets/images/answer.png'></img>
                        {{item.Content}}
                    </div>
                    <div  class='subquestion'>
                        <span class=''>回答时间：{{item.Data2}}</span>
                    </div>
                </div>
            </div>
            <div v-show="CurrentNum==2" class="visitList item" id="visitList">
                <div class='Survey'
                 :class="index%2==1?'backColor':''"
                 v-for="(item,index) in MarketSearch"
                 v-if="MarketSearch.length>0"
                 @click="goInfoSurvey(item.Id)"  :key="index">
                    <div class='Survey-title'>
                        <span>高管接待:</span>
                        <span class='title-level' :class="level.Color" v-for="(level,index) in item.Level" :key="index">{{level.Name}}</span>
                    </div>
                    <div class='Survey-main' v-for="(title,index) in item.Title" :key="index">
                        <div class='Survey-question'>{{title[0]}}</div>
                        <div class='Survey-answer'>{{title[1]}}</div>
                    </div>
                    <div class='Survey-bottom'>
                        <div class='bottom-left'>{{item.Type}}</div>
                        <div class='bottom-right'>{{item.Releasedate}}</div>
                    </div>
                </div>
                <div class="noData" v-if="MarketSearch.length == 0">近一年内暂无数据</div>
            </div>

            <div v-show="CurrentNum==3" class="noticeList likeNewsList item" id="noticeList">
                <div class='notice-view-list'
                     :class="index%2 > 0?'background-list':''"
                     v-for="(item,index) in Notice"
                     @click="openNoticeURL(item.Showurl)" :key="index">
                    <div class="footer-notice-title">{{item.Title}}</div>
                    <div class='footer-notice-time'>{{item.Data}}</div>
                </div>
            </div>

            <div v-show="CurrentNum==4" class="item" style="min-height: 100px;">
                <div class='summary'>
                    <div class='summary_title'>公司简介</div>
                    <div class='summary_list'>
                        <div class='summary_item'>
                            <div class='item_title'>所属行业</div>
                            <!--@click='goToIndustry'    style='color:#217cd9;text-decoration:underline'-->
                            <div data-industrysymbol="summaryData.industry.industrySymbol" class='item_content'>{{summaryData.industry.industryName}}</div>
                        </div>
                        <div class='summary_item'><div class='item_title'>所属地区</div>
                            <!--@click='goToIndustry'   style='color:#217cd9;text-decoration:underline'-->
                            <div data-industrysymbol="summaryData.region.regionSymbol" class='item_content'>{{summaryData.region.regionName}}</div></div>
                        <div class='summary_item'><div class='item_title'>公司名称</div> <div class='item_content'>{{summaryData.companyName}}</div></div>
                        <div class='summary_item'><div class='item_title'>上市日期</div> <div class='item_content'>{{summaryData.releaseData}}</div></div>
                        <div class='summary_item'><div class='item_title'>发行价格</div> <div class='item_content'>{{summaryData.companyPrice}}</div></div>
                        <div class='summary_item'><div class='item_title'>发行数量</div> <div class='item_content'>{{summaryData.companyVol}}</div></div>
                        <div class='summary_item'>
                            <div class='item_title'>主营业务</div>
                            <div class='item_content'><span>{{summaryData.companyBusiness}}</span></div>
                        </div>
                    </div>
                    <!--<div class='summary_title' style='border-top:0.05rem solid #e5e6f2;margin-top:1rem;'>业绩趋势</div>-->
                    <!--<ul class='summary_profit'>-->
                        <!--<li style='border-radius: 0.3rem 0 0 0.3rem;' :class='activeIndex==0?"profit_active":""' id="showdata1" @click='switchTap(0)'>净利润涨幅</li>-->
                        <!--<li style='margin-left:-0.05rem;' data-index='1' :class='activeIndex==1?"profit_active":""' @click='switchTap(1)'>扣非净利润涨幅</li>-->
                        <!--<li style='margin-left:-0.05rem;border-radius: 0 0.3rem 0.3rem 0;' id="showdata3" :class='activeIndex==2?"profit_active":""' @click='switchTap(2)'>扣非净利润涨速</li>-->
                    <!--</ul>-->
                    <!--<div class="container">-->
                        <!--<div>-->
                            <!--<canvas class="chart-demo"  canvas-id="chart-demo"-->
                                    <!--:style="width:Chart.Width + px; height:Chart.Height + px; left:Chart.Left + px;"-->
                            <!--/>-->
                        <!--</div>-->
                    <!--</div>-->
                </div>
                <!--<div class="noData">暂无数据</div>-->
            </div>
            <div v-show="CurrentNum==5" class="item" style="min-height: 100px;">
                <div class='finance'>
                    <div class='finance_title'>
                        <div class='title'>关键指标</div>
                        <div style="margin-right:1rem;">
                            <!--{{summaryData.financeDate}}-->
                        </div>
                    </div>
                    <div class='finance_content'>
                        <div class='finance_item'>
                            <div>每股收益</div>
                            <div>{{FinanceData.persearning}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>每股净资产</div>
                            <div>{{FinanceData.pernetasset}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>每股资本公积金</div>
                            <div>{{FinanceData.percreserve}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>每股未分配利润</div>
                            <div>{{FinanceData.peruprofit}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>每股经营性现金流</div>
                            <div>{{FinanceData.perccfo}}</div>
                        </div>
                    </div>

                    <div class='finance_title'>
                        <div class='title'>利润表</div>
                        <div style="margin-right:1rem;">
                            <!--{{summaryData.financeDate}}-->
                        </div>
                    </div>
                    <div class='finance_content'>
                        <div class='finance_item'>
                            <div>营业总收入</div>
                            <div>{{FinanceData.orevenues}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>营业利润</div>
                            <div>{{FinanceData.oprofit}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>净利润</div>
                            <div>{{FinanceData.nprofit}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>主营业务利润</div>
                            <div>{{FinanceData.moprofit}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>三项费用</div>
                            <div>{{FinanceData.expenses3}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>归母净利润</div>
                            <div>{{FinanceData.pcnprofit}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>扣非净利润</div>
                            <div>{{FinanceData.nnetprofit}}</div>
                        </div>
                    </div>

                    <div class='finance_title'>
                        <div class='title'>资产负债表</div>
                        <div style="margin-right:1rem;">
                            <!--{{summaryData.financeDate}}-->
                        </div>
                    </div>
                    <div class='finance_content'>
                        <div class='finance_item'>
                            <div>流动资产</div>
                            <div>{{FinanceData.currentassets}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>货币资金</div>
                            <div>{{FinanceData.monetaryfunds}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>存货</div>
                            <div>{{FinanceData.inventory}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>应收账款</div>
                            <div>{{FinanceData.areceivable}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>流动负债</div>
                            <div>{{FinanceData.currentliabilities}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>非流动负债</div>
                            <div>{{FinanceData.ncurrentliabilities}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>资产总计</div>
                            <div>{{FinanceData.totalassets}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>负债总计</div>
                            <div>{{FinanceData.totalliabilities}}</div>
                        </div>
                        <div class='finance_item'>
                            <div>所有者权益总计</div>
                            <div>{{FinanceData.totalownersequity}}</div>
                        </div>
                    </div>

                    <div class='finance_title'>
                        <div class='title'>现金流量表</div>
                        <div style="margin-right:1rem;">
                            <!--{{summaryData.financeDate}}-->
                        </div>
                    </div>
                    <div class='finance_content'>
                        <div class='finance_item'>
                            <div>经营性现金流</div>
                            <div>{{FinanceData.ccfo}}</div>
                        </div>
                    </div>
                </div>
                <!--<div class="noData">暂无数据</div>-->
            </div>
        </div>
    </div>
</template>

<script>

    import $ from 'jquery'
    import Tools from "../../../services/tools"

    export default{
        data(){
            return{
                CurrentNum:0,
                Symbol:'600000.sh',
                NewsList: [
                  { ID: "314873863",
                    Name: "风华高科",
                    Releasedate: "2020-01-10 05:51:00",
                    Source: "东方财富网",
                    Symbol: "000636.sz",
                    Title: "主业不振并购遇坑 信雅达加码炒股支撑业绩"
                  },
                  {
                    ID: "314836247",
                    Name: "机器人",
                    Releasedate: "2020-01-09 18:23:00",
                    Source: "东方财富网",
                    Symbol: "300024.sz",
                    Title: "马上金融赵国庆：2020年在金融科技投入将达8亿元",
                  },
                  {
                    ID: "314833168",
                    Name: "浦发银行",
                    Releasedate: "2020-01-09 17:30:40",
                    Source: "同花顺",
                    Symbol: "600000.sh",
                    Title: "大连着力推动金融服务实体经济"
                  },
                  {
                    ID: "314833168",
                    Name: "浦发银行",
                    Releasedate: "2020-01-09 17:30:40",
                    Source: "同花顺",
                    Symbol: "600000.sh",
                    Title: "大连着力推动金融服务实体经济"
                  }
                ],    // 新闻列表
                NewsTime: ["01-10", "01-09", "01-09"],
                interactionList:[
                  {
                    ID: "507684",
                    Data: "2019-12-20",
                    Title: "测试提问",
                    Author: "矜筱诺",
                    Data2: "2019-12-25",
                    Author2: "浦发银行",
                    Content: "感谢您的关注！"
                  },
                  {
                    ID: "506988",
                    Data: "2019-12-18",
                    Title: "请问公司四季度原材料采购价格变动趋势如何？稳中有降还是基本不变。",
                    Author: "elistone",
                    Data2: "2019-12-25",
                    Author2: "浦发银行",
                    Content: "公司为金融服务业，不涉及原材料采购。感谢您的关注！"
                  },
                  {
                    ID: "507612",
                    Data: "2019-12-20",
                    Title: "请问今年什么时候出年报",
                    Author: "可爱的志龙",
                    Data2: "2019-12-25",
                    Author2: "浦发银行",
                    Content: "公司将根据法律法规、监管机构和股票上市规则的要求编制定期报告，并在交易所预约披露时间，您可通过交易系统查询相关信息。感谢您的关注！"
                  }
                ],  //互动易
                MarketSearch:[],    //调研
                ManLevel: ["证券代表", "董秘", "总经理", "董事长"],
                Notice:[
                  {
                    Name: "浦发银行",
                    Symbol: "600000.sh",
                    Title: "浦发银行：第七届董事会第二次会议决议公告",
                    Data: "2020-01-02",
                    ID: "205767935",
                    Source: "http://rpt.zealink.com/zealinkrptsrc/2020/01/02/205767935.PDF",
                    Showurl: "https://reporth5.zealink.com/zealinkrpt/2020/01/02/205767935/index.html"
                  },
                  {
                    Name: "浦发银行",
                    Symbol: "600000.sh",
                    Title: "浦发银行：第七届董事会第二次会议决议公告",
                    Data: "2020-01-02",
                    ID: "205767935",
                    Source: "http://rpt.zealink.com/zealinkrptsrc/2020/01/02/205767935.PDF",
                    Showurl: "https://reporth5.zealink.com/zealinkrpt/2020/01/02/205767935/index.html"
                  },
                  {
                    Name: "浦发银行",
                    Symbol: "600000.sh",
                    Title: "浦发银行：第七届董事会第二次会议决议公告",
                    Data: "2020-01-02",
                    ID: "205767935",
                    Source: "http://rpt.zealink.com/zealinkrptsrc/2020/01/02/205767935.PDF",
                    Showurl: "https://reporth5.zealink.com/zealinkrpt/2020/01/02/205767935/index.html"
                  },
                  {
                    Name: "浦发银行",
                    Symbol: "600000.sh",
                    Title: "浦发银行：第七届董事会第二次会议决议公告",
                    Data: "2020-01-02",
                    ID: "205767935",
                    Source: "http://rpt.zealink.com/zealinkrptsrc/2020/01/02/205767935.PDF",
                    Showurl: "https://reporth5.zealink.com/zealinkrpt/2020/01/02/205767935/index.html"
                  }
                ],  //公告
                FinanceData: {
                  persearning: 1.62,
                  pernetasset: 18.4,
                  percreserve: 2.7855,
                  peruprofit: 5.4908,
                  perccfo: -2.2979,
                  orevenues: "1463.86亿",
                  oprofit: "577.74亿",
                  nprofit: "488.64亿",
                  moprofit: "577.74亿",
                  expenses3: "--",
                  pcnprofit: "483.50亿",
                  nnetprofit: "471.14亿",
                  currentassets: "--",
                  monetaryfunds: "4248.88亿",
                  inventory: "--",
                  areceivable: "--",
                  currentliabilities: "--",
                  ncurrentliabilities: "--",
                  totalassets: "6.79万亿",
                  totalliabilities: "6.24万亿",
                  totalownersequity: "5471.63亿",
                  ccfo: "-674.49亿"
                },   //财务数据
                summaryData:{                   
                    "industry": {
                        industryName: "银行",
                        industrySymbol: "S48.ci"
                    },
                    "companyName": "上海浦东发展银行股份有限公司",
                    "region": {
                        regionName: "上海",
                        regionSymbol: "310000.ci"
                    },
                    "releaseData": "1999-11-10",
                    "companyPrice": 10,
                    "companyVol": "4 亿股",
                    "companyBusiness": "金融与信托投资业务。"
                },
                financeDetail:{},
                Chart: { Top: 0, Left: 0, Width: 0, Height: 0, Display: 'none' },

                activeIndex:0,
            }
        },

        created(){

            if(Tools.getURLParams("symbol")){
                console.log("Tools.getURLParams::::::",Tools.getURLParams("symbol"))
                this.Symbol = Tools.getURLParams("symbol");
            }
        },

        mounted(){
            this.isloading = false;

        },

        methods:{
            OnSize(){
                var width = window.innerWidth;

                var barChart = { Top: 40, Left: 0, Width: width, Height: 200, Display: 'block' };
                this.Chart = barChart;
            },

            
            ChangeCurrentNum:function (index) {
//                console.log(index,"index::::::")
                this.CurrentNum = index;
            },

            switchTap:function (index) {
                this.activeIndex = index;
            },

           
            //监听滚动条
            handleScroll(e){
               
            }

        }

    }
</script>

<style lang="less">
* {margin: 0;padding: 0;}
body,html {font: 62.5% 'PingFang-SC-Regular', 'Microsoft Yahei';}
.PriceUp {color: red;}
.PriceDown {color: green;}

.tabsTitle li.active,.tabsTitle li.active { border-bottom-color: #217cd9; color: #217cd9;}

.tabContent{
    min-height: 10rem;
}
.footer-news-title{
    width:100%;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.3rem;
}
.footer-item{
    height: 100%;
    overflow: auto;
}
.footer-news-froms{
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #8b8b8b;
}
.footer-news-time{
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #656870;
    position: absolute;
    right: 0.5rem;
}
.news-view-list{
    height: 3.3rem;
    padding: 0.4rem 0;
    position: relative;
    border-bottom: 1px solid #ececec;
}
.background-list{
    background-color: #fafafa;
}

.interaction-list{
    position: relative;
    padding: 1rem 1.5rem 0.5rem;
    border-bottom: 1px solid #ececec;
    font-size: 1.3rem;
    color: #333333;
}

.question{
    color: #f39800;
    line-height: 1.7rem;
}
.answer{
    color: #217cd9;
    line-height: 1.7rem;
}

.subquestion{
    position: relative;
    margin: 0.75rem 0;
    font-size: 1.3rem;
    color: #8b8b8b;
}
.questionTime{
    position: absolute;
    right: 0.5rem;
}
.iconImsge{
    display: inline-block;
    position: relative;
    top: 0.5rem;
    width: 1.8rem;
    height: 1.8rem;
}

/* 调研 */
/*.Survey{*/
    /*!*width: 750px;*!*/
    /*max-height: 450px;*/
    /*overflow: hidden;*/
/*}*/
.noData{
    /*width: 750px;*/
    height: 10rem;
    line-height: 10rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    background-color: #fafafa;
}
.backColor{
    background-color: #fafafa;
}
.Survey-title{
    margin:0 1.5rem;
    height: 3.5rem;
    line-height: 4rem;
    font-size: 1.3rem;
    color: #333333;
}
.title-level{
    margin-left: 1rem;
}
.Survey-main{
    margin: 0 1.5rem;
    font-size: 1.3rem;
    color: #333333;
    line-height: 2rem;
}
.Survey-answer{
    line-height: 2rem;
    text-indent: 2rem;
    color: #666666;
}
.Survey-bottom{
    position: relative;
    margin: 0 1.5rem;
    height: 4rem;
    line-height: 3rem;
    font-size: 1rem;
    color: #999999;
    border-bottom: 1px solid #e5e6f2;
}
.bottom-left{
    position: absolute;
    left: 0;
}
.bottom-right{
    position: absolute;
    right: 0;
}
.man-color{
    color:#f39800 !important;
}
.bottom-tip{
    color: #999999;
    text-align: center;
}
.summary{
    padding: 0 1.5rem;
    font-size: 1.3rem;
}
.summary_title{
    height: 4rem;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 1.3rem;
}
.summary_list{
    display: flex;
    flex-direction: column;
}
.summary_item{
    line-height: 2.5rem;
    color: #666;
    display: flex;
}
.item_title{
    width: 7rem;
    /* flex-grow: 1; */
}
.item_content{
    width:22.5rem;
    /* flex-grow: 8; */
}
.summary_profit{
    display: flex;
    color: #125fd9;
    font-size: 1.3rem;
    justify-content: center;
}
.summary_profit li{
    border: solid 1px #125fd9;
    padding: 0.2rem 0.5rem;
}
.summary_profit li.profit_active{
    background-color: #125fd9;
    color: #ffffff;
}
.finance{
    font-size: 1.3rem;
}
.finance_title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    /*width: 750px;*/
    border-bottom: 1px solid #ececec;
}
.finance_title .title{
    text-align: center;
    line-height: 2.5rem;
    width: 8.3rem;
    height: 3rem;
    border-bottom: 1px solid #217cd9;
    color: #217cd9;
}
.finance_content{
    border-bottom: 1px solid #ececec;
    padding: 1.5rem 0;
}
.finance_item{
    /*width: 750px;*/
    box-sizing: border-box;
    padding: 0 1.5rem;
    display: flex;
    line-height: 2.5rem;
    justify-content: space-between;
}

/* .hqbuttonlist {
  position:absolute;
  display: flex;
  top:0px;
  font-size: 13px;
  text-align:center;
} */

.chart-demo {
    position:absolute;
}

.hqbuttonselected
{
    width:2rem;
    border-bottom: 2px solid #125fd9;
}

.hqbutton
{
    width:2rem;
}

/* 公告 */
.notice-view-list{
    width: 100%;
    /*margin: 0 5% 0 5%;*/
    padding-bottom: 0.8rem;
    padding-top: 0.4rem;
    position: relative;
    border-bottom: 1px solid #ececec;
}
.footer-notice-title{
    width:100%;
    display: block;
    color: #217cd9;
    line-height: 2rem;
    font-size: 1.3rem;
}

.footer-notice-froms,.footer-notice-symbol,.footer-notice-time{
    font-size: 1.3rem;
    color: #666666;
}
.footer-notice-symbol{
    margin-left: 0.5rem;
}
.footer-notice-time{
    text-align: right;
}



</style>