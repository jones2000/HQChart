import {getCookie} from "../services/tools.js"
import axios from 'axios'

var instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
    // transformResponse: [function (res) {
    //     // 在此转码数据
    //     return res;
    // }],
});
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    console.log("对响应错误做点什么",error);
    return Promise.reject(error);
});

var post = function (apiurl, data, fn,err) {
    var header = {headers: {"Authorization": 'Basic ' + getCookie('token')}};
    return instance.post(apiurl, data, header).then(res => {
        fn(res)
        return res;
    }).catch(e => {
        err && err(e);
    });
}
var get = function (url, data, fn,err) {
    var header = {headers: {"Authorization": 'Basic ' + getCookie('token')}};
    return instance.get(url, data,header).then(res => {
        fn(res)
        return res;
    }).catch(e=>{
        err && err(e);
    });
}

//html
const assemblUrl = function(url){
    var pageDomain = {
        release: "http://zkquant-h5.lianghuaren.com",
        // release: "http://web.zealink.net/QuantitativeManH5",
        // deBug:"http://web.zealink.net/QuantitativeManH5",
        // deBug:"http://127.0.0.1:8010",
        // deBug: "http://192.168.0.136:8010",//李
        isDeBug: true  //给张航：true,发布测试服务器：false
    };

    var page = pageDomain.isDeBug ? pageDomain.release : pageDomain.deBug;

    if (url == undefined) {
        return page;
    }
    return page + url;
}

//OSS
const assemblOSS = function(url){
    var OSSDomain = 'http://cfebb09fcache.zealink.com';

    if (url == undefined) {
      return OSSDomain;
    }
    return OSSDomain + url;
}

//北上资金OSS
const assemblBSOSS = function(url){
    var OSSDomain = 'http://beigo.oss-cn-beijing.aliyuncs.com';  // /cache/historyday/all/hk2shsz.json

    if (url == undefined) {
      return OSSDomain;
    }
    return OSSDomain + url;
}

const assemblZKOSS = function(url){
  var OSSDomain = 'https://zkquant.oss-cn-beijing.aliyuncs.com';  // /cache/historyday/all/hk2shsz.json

  if (url == undefined) {
    return OSSDomain;
  }
  return OSSDomain + url;
}

//opensource
const assemblOPEN = function(url){
    var OPENDomain = 'https://cfebb09f.zealink.com';

    if (url == undefined) {
        return OPENDomain;
    }
    return OPENDomain + url;
}


//api
const assemblApi = function(url){
    var apiDomain = {
        release: "https://zkquant-api.lianghuaren.com",
        deBug: "https://zkquant-api.zealink.com",
        isDeBug : true //给张航：true,发布测试服务器：false
    };

    var api = apiDomain.isDeBug ? apiDomain.release : apiDomain.deBug;

    if (url == undefined) {
        return api;
    }
    return api + url;
}


const urlObj = {
    //方法
    post: post,
    get: get,
    assemblApi:assemblApi,
    assemblUrl:assemblUrl,

    //页面url
    htmlQuantiManIndex: assemblUrl("/index.html"),  //量化人首页
    htmlTacticsList: assemblUrl("/tacticsList.html"),  //指标列表
    htmlTacticsDetail: assemblUrl("/tacticsDetail.html"),  //指标详情
    htmlDateLine: assemblUrl("/dateLine.html"),  //日线行情
    htmlMarketflowInfo:assemblUrl("/marketflowInfo.html"),//资金流列表
    htmlTacticsSearch:assemblUrl('/tacticsSearch.html'),  //多空页面（自选股搜索）
    htmlBackCheck:assemblUrl('/backCheck.html'),  //策略页面
    htmlNewsInfo: assemblUrl("/newsInfo.html"), //新闻详情
    htmlSurveyInfo: assemblUrl("/surveyInfo.html"), //调研详情
    htmlBlockInfo: assemblUrl("/blockInfo.html"), //板块列表详情
    htmlIndexHq:assemblUrl("/indexHq.html"), //指数行情
    htmlLogon:assemblUrl("/logon.html"), //登录
    htmlForget:assemblUrl("/forget.html"), //找回密码
    htmlRegister:assemblUrl("/register.html"),//注册页面
    htmlUserCenter:assemblUrl("/userCenter.html"),//我的
    htmlFeed:assemblUrl("/feedback.html"),//意见反馈
    htmlBindingPhone:assemblUrl("/bindingPhone.html"),//绑定手机
    htmlGeneralTrend:assemblUrl("/generalTrend.html"),//大势
    htmlImportantNews: assemblUrl("/importantNews.html"),//要闻
    htmlImportantNewsInfo: assemblUrl("/importantNewsInfo.html"),//要闻详情
    htmlAboutUs:assemblUrl("/aboutUs.html"),//关于我们
    htmlPolicyIndex:assemblUrl("/policyIndex.html"),//策略首页
    htmlSelectedStocksList:assemblUrl("/selectedStocks.html"),//选股列表
    htmlPay:assemblUrl("/pay.html"),//充值
    htmlTest:assemblUrl("/test.html"),//测试
    htmlShare: assemblUrl("/share.html"),//分享
    htmlInvitationList:assemblUrl("/invitationList.html"),//佣金收入榜
    htmlSubscribeSuccess:assemblUrl("/subscribeSuccess.html"),//订阅成功
    htmlPayHistory:assemblUrl("/payHistory.html"),//历史充值

    //api url
    apiGetUpDown:assemblOSS("/cache/analyze/increaseanalyze/CNA.ci.json"),  //全市场涨跌分布
    apiNorthBound:assemblOSS("/cache/analyze/hk2shsz/hk2shsz.json"),  //北上资金
    apiSouthBound: assemblOSS("/cache/analyze/hk2shsz/hk3shsz.json"),  //南下资金
    apiNewsList:assemblOPEN("/API/NewsStockList"),//新闻列表
    apiNewsInteract:assemblOPEN("/API/NewsInteract"),//互易动即董秘连线接口
    apiInvestorRelationsList:assemblOPEN("/API/InvestorRelationsList"),//调研
    apiReportStockList:assemblOPEN("/API/reportStockList"),//公告
    apiNewsInfo:assemblOPEN("/API/NewsStockDetail2"),//新闻详情
    apiSurveyInfo:assemblOPEN("/API/InvestorRelationsDetail"),//调研详情
    apiIndexList:assemblApi('/api/GetIndexPageList'), //指标列表
    apiIndexDetail:assemblApi('/api/GetIndexPageInfo'), //指标详情
    apiStock:assemblOPEN('/API/Stock'),  //股票基本数据
    apiRegister:assemblApi('/api/Register'), //注册
    apiLogon:assemblApi('/api/Logon'), //登录
    apiGetVerificationCode:assemblApi('/api/GetVerificationCode'), //获取验证码
    apiGetInvitationList:assemblApi('/api/GetInvitationList'), //获取邀请人列表
    apiAddSelfStock:assemblApi('/api/AddSelfStock'), //添加自选股
    apiDeleteSelfStock:assemblApi('/api/DeleteSelfStock'), //删除自选股
    apiGetSelfStockList:assemblApi('/api/GetSelfStockList'), //获取自选股列表
    apiGetInvitationList:assemblApi('/api/GetInvitationList'), //获取邀请人列表
    apiMarketflow:assemblOSS("/cache/analyze/shszevent/marketflow/"),//市场资金流json数据，后面还需跟当天日期  如：20190905.json 
    apiRegister:assemblApi("/api/Register"),//注册
    apiLogon:assemblApi("/api/Logon"),//登录
    apiGetUserInfo:assemblApi("/api/GetUserInfo"),//获取用户信息
    apiGetSelfIndex:assemblApi("/api/IsHasIndex"),   //我的指标列表
    apiFindPassword:assemblApi("/api/FindPassword"),//找回密码
    apiAddSuggest:assemblApi("/api/AddSuggest"),//提交反馈意见接口
    apiBs:assemblBSOSS('/cache/historyday/all/hk2shsz.json'),  //北上资金历史数据
    apiImportantNews: assemblApi('/API/GetNewsList'),     //要闻
    apiImportantNewsInfo: assemblApi('/API/GetNewsInfo'),     //要闻详情
    apiBalance:assemblOPEN('/API/StockHistoryDay'),  //融资融券余额
    apiSelectedStocks:assemblOSS('/zkquant/policy'), //选股
    apiGetWeChatSign:assemblApi("/api/GetWeChatSign"),//获取微信sdk签名
    apiCreateRechargeOrder:assemblApi("/api/CreateRechargeOrder"),//创建订单
    apiGetOpenId:assemblApi("/api/GetOpenId"),//获取openid
    apiUnifiedOrder:assemblApi("/api/UnifiedOrder"),//创建支付订单
    apiIndexInfo:assemblApi("/api/GetIndexPageInfo"),//获取战法详情
    apiBuyIndexPage:assemblApi("/api/BuyIndexPage"),//购买战法
    apiUnlockList:assemblApi("/api/GetUnlockList"),//解套列表
    apiUnlockInfo:assemblApi("/api/GetUnlockInfo"),//解套详情
    apiShareList: assemblApi("/api/GetInvitationList"),//解套详情
    apiSubscribe: assemblApi("/api/SubscribePolicy"),//策略订阅
    // apiStrategyDetail: assemblOSS("/zkquant/retest/"),  //策略详情
    apiStrategyDetail: assemblZKOSS("/retest/"),  //策略详情2
    apiStrategyDetail2: assemblApi("/api/GetPolicyInfo"),//策略详情2
    apiIsSubscribePolicy: assemblApi("/api/IsSubscribePolicy"),//是否订阅该策略
    apiPolicyList: assemblApi("/api/GetPolicyList"),//策略列表
    apiFirstImportantNews: assemblApi("/api/GetNewsTop"),//策略列表
    apiGetTacticsDescriptionInfo: assemblApi("/api/GetTacticsDescriptionInfo"),//战法描述信息
    apiGetCostList: assemblApi("/api/GetCostList"),//充值商品价格列表
    apiRechargeLog: assemblApi("/api/RechargeLog"),//历史充值
    apiSubscribePolicyFree:assemblApi("/api/SubscribePolicyFree"),  //免费订阅策略
    apiIsTradeDay:assemblOPEN("/API/StockTradeDate"),  //是否是交易日
    apiGetIndexPageStockList:assemblApi("/api/GetIndexPageStockList"),  //获取战法最近2个股票池
    policyImgSrc:assemblBSOSS("/zkquant/image/ed6a165a84004876b1eee1c39a323f15.png"),
}

export default urlObj;