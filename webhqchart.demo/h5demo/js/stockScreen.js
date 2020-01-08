/**
 * 
 * @authors lixq
 * @date    2018-10-31 17:01:01
 */
var JSGLOBAL = {
    klinChart: {},
    minuteChart: {},
    minuteChart: null,
    klineChart: null,
    minuteOption: {},
    klineOption: {},
    symbol: 'symbol',
    jsStock: null,
    pageData: new Map(),
    KLineIndex: ['均线', 'VOL', 'MACD', 'KDJ', 'BOLL'], //K线指标
    JqUlOne: $('<ul class="ulOne"><li class="noRight">不复权</li><li class="noRight active">前复权</li><li class="noRight">后复权</li><ul>'),
    JqUlTwo: $('<ul class="ulTwo"></ul>'),
    chartHeight:500,
}

function updateBaseData(id, arySymbol, dataType, jsStock) {
    showBaseData(JSGLOBAL.jsStock);
}

function showBaseData(jsStock) {
    var read = jsStock.GetStockRead('main', updateBaseData); //获取一个读取数据类,并绑定id和更新数据方法
    var name = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.NAME);
    var symbolName = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.SYMBOL);
    var price = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.PRICE);
    var riseFallPrice = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.RISE_FALL_PRICE);
    var increase = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.INCREASE);
    var high = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.HIGH);
    var low = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.LOW);
    var open = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.OPEN);
    var excahngerate = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.EXCHANGE_RATE);
    var amount = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.AMOUNT);
    var vol = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.VOL);
    var yClose = read.Get(JSGLOBAL.symbol, STOCK_FIELD_NAME.YCLOSE);
    console.log(price, "price");
    JSGLOBAL.pageData.set('price', price);
    JSGLOBAL.pageData.set('rise', riseFallPrice);
    JSGLOBAL.pageData.set('riseRate', increase);
    JSGLOBAL.pageData.set('high', high);
    JSGLOBAL.pageData.set('low', low);
    JSGLOBAL.pageData.set('open', open);
    JSGLOBAL.pageData.set('exchange', excahngerate);
    JSGLOBAL.pageData.set('amount', amount);
    JSGLOBAL.pageData.set('vol', vol);
    baseDataFormat(JSGLOBAL.pageData);
    baseDataColor(JSGLOBAL.pageData, yClose);
    $(".nameWraps .name").html(name);
    document.title = name;
    $(".nameWraps .symbolName").html(symbolName);
    $(".priceCurrentNum").html(JSGLOBAL.pageData.get('price'));
    $(".riseInfo .riseNum").html(JSGLOBAL.pageData.get('rise'));
    $(".riseInfo .risePrecent").html(JSGLOBAL.pageData.get('riseRate'));
    $(".priceHL .high>span").html(JSGLOBAL.pageData.get('high'));
    $(".priceHL .low>span").html(JSGLOBAL.pageData.get('low'));
    $(".priceOpen .open>span").html(JSGLOBAL.pageData.get('open'));
    $(".priceOpen .change>span").html(JSGLOBAL.pageData.get('exchange'));
    $(".priceAmount .num>span").html(JSGLOBAL.pageData.get('amount'));
    $(".priceAmount .totalValue>span").html(JSGLOBAL.pageData.get('vol'));
    read.EndRead();
}

//股票基础数据没有时，显示--
function baseDataFormat(data) {
    data.forEach(function(item, key, mapObj) {
        if (item == undefined) {
            if (key == 'riseRate' || key == 'exchange') {
                item = '--%';
            } else {
                item = '--';
            }
        } else {
            if (key == 'amount' || key == 'vol') {
                item = numToCUnit(item);
            } else if (key == 'riseRate' || key == 'exchange' || key == 'roe' || key == 'amplitude') {
                item = Number(item).toFixed(2) + '%';
            } else {
                item = Number(item).toFixed(2);
            }
        }

        data.set(key, item);

    });
}

//与昨日收盘价相比，与0比
function baseDataColor(data, yClose) {
    data.forEach(function(item, key, mayobj) {
        if (item != undefined) {
            switch (key) {
                case 'exchange':
                    item = item.split('%')[0];
                    setColor($(".change>span"), item, 0);
                    break;
                case 'rise':
                case 'riseRate':
                    item = item.split('%')[0];
                    setColor($(".riseInfo"), item, 0);
                    break;
                case 'price':
                    setColor($(".priceCurrentNum"), item, yClose);
                    break;
                case 'high':
                    setColor($(".high>span"), item, yClose);
                    break;
                case 'low':
                    setColor($(".low>span"), item, yClose);
                    break;
                case 'open':
                    setColor($(".open>span"), item, yClose);
                    break;

            }
        }

    });
}

//给元素设置特定颜色
function setColor(element, item, yClose) {
    if (item > yClose) {
        element.addClass('upColor').removeClass('lowColor');
    } else if (item < yClose) {
        element.addClass('lowColor').removeClass('upColor');
    } else {
        element.removeClass('upColor').removeClass('lowColor');
    }
}

//时间字符串格式转化
function dateFormat(str, hasYear) { //eg:20181022
    if (str != 'undefined') {
        if (hasYear) {
            return str = str.substr(0, 4) + "&nbsp;-&nbsp;" + str.substr(4, 2) + "&nbsp;-&nbsp;" + str.substr(6, 2);
        } else {
            return str = str.substr(4, 2) + "&nbsp;-&nbsp;" + str.substr(6, 2);
        }

    }
}

//数字金额转中文单位
function numToCUnit(num) {
    if (num < 100000000 ) {
        return Number(num / 10000).toFixed(2) + '万';
    } else {
        return Number(num / 100000000).toFixed(2) + '亿';
    }
}

//显示K线
function showKline(symbol, period) {
    if (JSGLOBAL.klineChart == null) {
        // 创建股票K线图
        JSGLOBAL.klineChart = JSChart.Init(document.getElementById('klinebox'));
        var index = getURLParams('index'); //指标1
        if (index == null) index = 'MA';

        var index2 = getURLParams('index2'); //指标2
        if (index2 == null) index2 = 'VOL';

        var index3 = getURLParams('index3'); //指标3
        if (index3 == null) index3 = 'MACD';
        var aryIndex = new Array();
        aryIndex.push({ "Index": index, "Modify": false, "Change": false });
        aryIndex.push({ "Index": index2, "Modify": false, "Change": false });
        if (index3) aryIndex.push({ "Index": index3, "Modify": false, "Change": false });
        JSGLOBAL.klineOption = {
            Type: '历史K线图横屏',
            Windows: aryIndex, //窗口指标
            Symbol: symbol,
            IsAutoUpate: true, //是自动更新数据

            IsShowRightMenu: true, //右键菜单
            IsShowCorssCursorInfo: true, //是否显示十字光标的刻度信息

            KLine: {
                DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 1, //复权 0 不复权 1 前复权 2 后复权
                Period: 0, //周期 0 日线 1 周线 2 月线 3 年线 
                MaxReqeustDataCount: 1000, //数据个数
                PageSize: 50, //一屏显示多少数据
                IndexTreeApiUrl: "https://opensourcecache.zealink.com/cache/hqh5/index/commonindextree.json", //指标树下载地址
                //Info:["业绩预告","公告","互动易","调研","大宗交易"],       //信息地雷
                //Info:["业绩预告","公告"],          //信息地雷
                KLineDoubleClick: true, //双击分钟走势图
                IsShowTooltip: true //是否显示K线提示信息
            },

            KLineTitle: //标题设置
            {
                IsShowName: true, //不显示股票名称
                IsShowSettingInfo: true //不显示周期/复权
            },

            Border: //边框
            {
                Left: 20, //左边间距
                Right: 20, //右边间距
                Bottom: 1,
                Top: 50
            },

            Frame: //子框架设置
                [
                    { SplitCount: 3, StringFormat: 1 },
                    { SplitCount: 3, StringFormat: 1 },
                    { SplitCount: 3, StringFormat: 1 }
                ]
        }
        /*var windowHeight= $(window).height();
        var windowWidth = $(window).width();
        if (windowWidth<=420)   //手机小屏左右不显示坐标
        {
            option.KLine.IsShowTooltip=false;
        }*/

        JSGLOBAL.klineChart.SetOption(JSGLOBAL.klineOption);
    } else {
        JSGLOBAL.klineChart.ChangePeriod(period);
    }
    //k线图的右侧选项
    if (JSGLOBAL.JqUlTwo.find('li').length == 0) {
        showKlineIndexItems();
    }

}

//显示复权指标选项
function showKlineIndexItems() {
    $(".klineList").append(JSGLOBAL.JqUlOne);
    var items = "";
    JSGLOBAL.KLineIndex.forEach(function(item) {
        items += "<li>" + item + "</li>";
    });
    JSGLOBAL.JqUlTwo.append(items);
    JSGLOBAL.JqUlTwo.find('li').eq(0).addClass('active');
    $(".klineList").append(JSGLOBAL.JqUlTwo);
}

//显示分钟走势图
function showMinuteChart(symbol) {
    if (JSGLOBAL.minuteChart == null) {
        var index = getURLParams('index'); //指标3
        if (index == null) index = 'MACD';
        var aryIndex = new Array();
        if (index) aryIndex.push({ "Index": index });

        // 创建股票K线图
        JSGLOBAL.minuteChart = JSChart.Init(document.getElementById('minuteWrap'));
        JSGLOBAL.minuteOption = {
            Type: '分钟走势图横屏',
            Windows: aryIndex, //窗口指标
            Symbol: symbol, //股票代码
            IsAutoUpate: true, //是自动更新数据

            IsShowCorssCursorInfo: true, //是否显示十字光标的刻度信息

            Border: //边框
            {
                Left: 20, //左边间距
                Right: 20, //右边间距
                Top: 50,
                Bottom: 50
            },
            Frame: //子框架设置
                [
                    { SplitCount: 5, StringFormat: 1 },
                    { SplitCount: 3, StringFormat: 1 },
                    { SplitCount: 3, StringFormat: 0 },
                ]
        }

        /*var windowHeight= $(window).height();
        var windowWidth = $(window).width();
        if (windowWidth<=420)   //手机小屏左右不显示坐标
        {
            
        }*/

        JSGLOBAL.minuteChart.SetOption(JSGLOBAL.minuteOption);
    }

}

$(window).resize(resizeCanvas);

function resizeCanvas() {
    if (JSGLOBAL.minuteChart != null) {
        //分钟走势图宽高
        $("#minuteWrap").width($("body").width());
        $("#minuteWrap").height(JSGLOBAL.chartHeight);
        document.getElementById("minuteWrap").JSChart.OnSize();
    }
    if (JSGLOBAL.klineChart != null) {
        //K线图宽高
        var truewidth = $("body").width() * 0.903;
        $("#klinebox").width(truewidth);
        $("#klinebox").height(JSGLOBAL.chartHeight);
        document.getElementById("klinebox").JSChart.OnSize();
    }
}

function getURLParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
$(function() {


    JSGLOBAL.symbol = getURLParams('symbol');
    if (JSGLOBAL.symbol == null) JSGLOBAL.symbol = '600000.sh';

    JSGLOBAL.jsStock = JSStock.Init(); //初始化数据控件
    showBaseData(JSGLOBAL.jsStock);
    JSGLOBAL.jsStock.ReqeustData()

    //分钟走势图宽高
    $("#minuteWrap").width($("body").width());
    $("#minuteWrap").height(JSGLOBAL.chartHeight);
    //K线图宽高
    var truewidth = $("body").width() * 0.903;
    $("#klinebox").width(truewidth);
    $("#klinebox").height(JSGLOBAL.chartHeight);

    showMinuteChart(JSGLOBAL.symbol);

    //切换到分钟走势图
    $("#minuteChartSelect").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        $("#klineWraphq").hide();
        $("#minuteWrap").show();
        showMinuteChart(JSGLOBAL.symbol);
    });

    //复权切换
    JSGLOBAL.JqUlOne.on('click', 'li', function() {
        var num = $(this).index();
        JSGLOBAL.klineChart.ChangeRight(num);
        $(this).addClass("active").siblings().removeClass("active");
    });
    //指标切换
    JSGLOBAL.JqUlTwo.on('click', 'li', function() {
        var text = $(this).text();
        JSGLOBAL.klineChart.ChangeIndex(1, text);
        $(this).addClass("active").siblings().removeClass("active");
    });

    //根据周期显示k线
    $("#screenTitle .k").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        $("#minuteWrap").hide();
        $("#klineWraphq").show();
        //设置周期
        var period = $(this).index() - 1;
        showKline(JSGLOBAL.symbol, period);
    });
    //分钟周期下拉选择
    var showMinuteDOM = document.querySelector('#showMinute');
    var minuteIdDOM = document.querySelector('#minuteId');
    var data = [{
            "id": "4",
            "value": '1分钟'
        },
        {
            "id": "5",
            "value": '5分钟'
        },
        {
            "id": "6",
            "value": '15分钟'
        },
        {
            "id": "7",
            "value": '30分钟'
        },
        {
            "id": "8",
            "value": '60分钟'
        }
    ];
    showMinuteDOM.addEventListener('click', function() {
        $("#minuteWrap").hide();
        $("#klineWraphq").show();
        var minuteId = showMinute.dataset['id'];
        var minuteName = showMinute.dataset['value'];
        var bankSelect = new IosSelect(1,
            [data], {
                container: '.container',
                title: '',
                itemHeight: 30,
                itemShowCount: 3,
                oneLevelId: minuteId,
                callback: function(selectOneObj) {
                    minuteIdDOM.value = selectOneObj.id;
                    showMinuteDOM.innerHTML = selectOneObj.value;
                    showMinuteDOM.dataset['id'] = selectOneObj.id;
                    showMinuteDOM.dataset['value'] = selectOneObj.value;
                    var period = selectOneObj.id;
                    showKline(JSGLOBAL.symbol, period);
                    $(showMinuteDOM).addClass("active").siblings().removeClass("active");
                }
            });


    });
})