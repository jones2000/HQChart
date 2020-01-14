

//通过url获取参数
var getURLParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};


/**
 * 获取开始日期 shaoshiyu
 * today 当前时间的最近多少天：值null表示获取的是当前时间的最近多少天；指定日期的最近多少天：today格式为yy/mm/dd
 * addDayCount 表示增加的事件，如最近一月，-1；最近一周为-7
 * str  有值的，d（日），m（月），y（年）
 * 出参格式 YYMMDD
 * */
var startDate = function (today, addDayCount, str) {
    var dd;
    if (today) {
        dd = new Date(today);
    } else {
        dd = new Date();
    }
    var y, m, d;

    switch (str) {
        case "d":
            dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
            break;
        case "m":
            dd.setMonth(dd.getMonth()+ addDayCount);//获取AddDayCount天后的日期
            break;
        case "y":
            // return (dd.getFullYear() * 10000 + 101).toString();
            dd.setFullYear(dd.getFullYear() + addDayCount);
            break;
    }
    var value = dd.getFullYear() * 10000 + (dd.getMonth() + 1) * 100 + dd.getDate();
    return value.toString();
}

/**
 * 获取结束日期,即当前时间
 * 出参格式 YYMMDD
 **/
var endTime = function () {
    var now = new Date();
    var value = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    return value.toString();
}

/*
 * 获取指定日期的最近天数
 * 调用规则 :
 * 第一个入参格式支持字符串："2017/11/26"、"2017.10.27"、"20171027"、"2017-10-27"
 * 指定日期n天前日期：date_getPointDate("2017/11/26", -30)
 * 指定日期n天后日期：date_getPointDate("2017.10.27", 30)
 */
var date_getPointDate = function(currDate, num) {  //num表示天数，接受正负数
    // console.log("currDate", currDate);
    if (!num) {//做num简单验证
        return currDate;
    }
    num = Math.floor(num);
    this.symbol = '';  //需要什么格式出参自己定义 - /

    // console.log("currDate", currDate);
    if(currDate.indexOf('-') > -1) //格式yy-mm-dd
    {
        currDate = currDate.replace(/-/g, '/');
    }
    else if (currDate.indexOf('.') > -1) //格式yy.mm.dd
    {
        currDate = currDate.replace(/\./g, '/');
    }
    else
    {
        currDate = currDate.substring(0, 4) + "/" + currDate.substring(4, 6) + "/" + currDate.substring(6, 8);
    }

    //到这一步前，currDate格式要为YY/MM/DD
    var myDate = new Date(currDate),
        lw = new Date(Number(myDate) + 1000 * 60 * 60 * 24 * num), //num天数
        lastY = lw.getFullYear(),
        lastM = lw.getMonth() + 1,
        lastD = lw.getDate(),
        startdate = lastY + this.symbol + (lastM < 10 ? "0" + lastM : lastM) + this.symbol + (lastD < 10 ? "0" + lastD : lastD);
    // console.log("currDate", currDate, startdate);
    return startdate;
}

function NumberToString(value)
{
    if (value<10) return '0'+value.toString();
    return value.toString();
}

function FormatDateString(value,format)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var day=value%100;

    switch(format)
    {
        case 'MM-DD':
            return NumberToString(month) + '-' + NumberToString(day);
        default:
            return year.toString() + '-' + NumberToString(month) + '-' + NumberToString(day);
    }
}



const tools = {
  getURLParams:getURLParams,//获取url参数
  startDate:startDate,//获取开始日期
  endTime:endTime,//获取结束日期,即当前时间
  FormatDateString:FormatDateString, //时间格式转化
  date_getPointDate:date_getPointDate,//获取指定日期的最近天数
}


export default tools;


//转换金钱类数据
export function formatBillion(num) {
    var result = "";

    var strValue = num + "";
    var negative = "";
    var _decimal = "";
        

    if (strValue.indexOf(".") > -1){
        var temp = strValue.split('.');
        strValue = temp[0];
        _decimal = temp[1];
    }

    if (strValue.indexOf("-") > -1) {
        negative = "-";
        strValue = strValue.split('-')[1];
    }

    if (strValue.length >= 11) {
        result = negative + Math.floor(parseInt(strValue) / 100000000) + "亿";
    } else if (strValue.length >= 9 && strValue.length <= 10) {
        result = negative + (parseInt(strValue) / 100000000).toFixed(2) + "亿";
    } else if (strValue.length >= 5 && strValue.length <= 8) {
        result = negative + Math.floor(parseInt(strValue) / 10000) + "万";
    }else{
        result = strValue;
    }

    return result;
}

//排序，-1从大到小  1从小到大
export function compare(property,type) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if(type == -1){
        return value2 - value1; //从大到小
        }

        if(type == 1){
        return value1 - value2; //从小到大
        }
        
    }
}

//密码加密
export function encode(mi)
{  
  var str = mi + "";
  var r = "";
  for (var i = 0; i < str.length; i++)
  {
    var code = str.charCodeAt(i);
    r += code;
    if(i != (str.length-1)){
      r += ",";
    }
  }
  return r;
}

//密码解密
export function decode(mi)
{
  var str = mi + "";
  var arr = str.split(",");
  var r = "";
  for (var i = 0; i < arr.length; i++)
  {
    var code = parseInt(arr[i]);
    r += String.fromCharCode(code);
  }
  return r;
}

//设置cookie
export function setCookie(cname, cvalue, exdays) {
  var exp = new Date();
  exp.setTime(exp.getTime() + (exdays*24*60*60*1000));
  document.cookie = cname + "="+ encodeURIComponent (cvalue) + ";expires=" + exp.toGMTString();

}

//获取cookie
export function getCookie(sName)
{
  var aCookie = document.cookie.split("; ");
  for (var i=0; i < aCookie.length; i++)
  {
    var aCrumb = aCookie[i].split("=");
    if (sName == aCrumb[0]){
      return decodeURIComponent(aCrumb[1]);
    }
      
  }
  return null;
}

//清除cookie  
export function clearCookie(name) {  
  setCookie(name, "", -1); 
} 

export function GetSign (queryObj) {
  var sign = '';
  if (queryObj != null) {
      var keyArry = Object.keys(queryObj);
      keyArry.sort();
      for (let i = 0; i < keyArry.length; ++i) {
          var keyText = keyArry[i];
          var keyValue = queryObj[keyText] == null ? '' : queryObj[keyText];

          if (keyValue == true || keyValue == 'true') {
              keyValue = 'True';
          }
          sign += (sign == '' ? `${keyText}=${keyValue}` : `&${keyText}=${keyValue}`);
      }

      sign += `&Key=${AccessKey}`;
      sign = md5(sign).toUpperCase();
  } else {
      sign = `Key=${AccessKey}`;
      sign = md5(sign).toUpperCase();
  }
  return sign;
}

