import axios from 'axios'
import tools from "../services/tools"
// var tokenContent = tools.getCookie('token');
// var token = 'Basic ' + tokenContent;

var instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
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
  return instance.post(apiurl, data).then(res => {
    fn(res)
      return res;
  }).catch(e => {
      err && err(e);
  });
}
var get = function (url, data, fn) {
  return instance.get(url, data).then(res => {
      fn(res)
      return res;
  });
}

const assemblUrl = function(url){
  var pageDomain = {
    release: "https://opensource.zealink.com/product/hqNewdemoH5",
    deBug: "http://web.zealink.net:8082/temp/hq/hqNewdemoH5",
    isDeBug : true  //给张航：true,发布测试服务器：false
  };

  var page = pageDomain.isDeBug ? pageDomain.release : pageDomain.deBug;

  if (url == undefined) {
    return page;
  }
  return page + url;
}

//"https://opensource.zealink.com",
const assemblApi = function(url){
  var apiDomain = {
    release: "https://cusitscapi.zealink.com",
    deBug: "https://apitest.zealink.com",
    isDeBug : true //给张航：true,发布测试服务器：false
  };

  var api = apiDomain.isDeBug ? apiDomain.release : apiDomain.deBug;

  if (url == undefined) {
    return api;
  }
  return api + url;
}


const assemblOSS = function(url){
  var OSSDomain = 'https://projectcache.zealink.com';


  if (url == undefined) {
    return OSSDomain;
  }
  return OSSDomain + url;
}

const urlObj = {
  //方法
  post: post,
  get: get,
  assemblApi:assemblApi,
  assemblUrl:assemblUrl,
}

export default urlObj;