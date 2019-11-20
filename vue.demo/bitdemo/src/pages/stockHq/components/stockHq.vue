<template>
    <div ref='divklinechart' style="height:600px">
        <!--代码名称-->
        <div class="headTitle" ref='divsymbol'>
            <div class="name-box">
                <div class="nameWrap">
                    <span class="stockName">{{Name}}</span>
                    <span class="exchangeInfo">{{PairName}}</span>
                </div>
            </div>
        </div>

        <!--k线周期-->
        <div class="tabs kLineTabs blockBg" ref='divperiod'>
            <p class="tabsTitle">
                <span
                    v-for='(item,index) in Period.Menu'
                    :key='index'
                    :class='{active : item.Name == Period.SelItem.Name}'
                    @click='ChangePeriod(item)'>{{item.Name}}</span>
            </p>
        </div>

        <!-- k线图 -->
        <div class="klineWrap" id="kline" ref='divkline' v-show='KLine.IsShow'></div>
        <div class="klineWrap" id="kline" ref='divkminute' v-show='Minute.IsShow'></div>

        <!-- k线图指标 -->
        <div class="indexWrap" ref='divindex' v-show="Index.IsShow">
            <span
                :key="index2"
                v-for='(item,index2) in Index.Menu'
                @click='ChangeIndex(item)'
                class="indexItem">
                {{item.Name}}</span>
        </div>   
    </div>
</template>

<script>
import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'

import sha256 from "js-sha256"
import moment from 'moment'
import $ from 'jquery'

var JSCommon=HQChart.Chart;

const API_KEY = 'e623cde183dd55841a2515d18488be48';
const SECRET_KEY = '03f2cf1a6c5c426ad9957cfb8e5ceb0a';


function DefaultData() {}

DefaultData.GetKlineOption = function()
{
    let data = 
    {
        Type: '历史K线图',
        //窗口指标
        Windows: 
        [
            { Index: "均线", Modify:false, Change:false },
            { Index: "VOL", Modify:false, Change:false },
            { Index: "RSI", Modify:false, Change:false },
        ],
        //Symbol: '600000.sh',
        IsAutoUpdate: true,
        AutoUpdateFrequency: 10000, //数据更新频率 ms

        IsShowRightMenu: false, //右键菜单
        IsApiPeriod: true, //使用Api计算周期

        IsClickShowCorssCursor:true,    //手势点击出现十字光标
        IsCorssOnlyDrawKLine:true,      //十字光标在K线中间
        CorssCursorTouchEnd:true,       //手势离开屏幕十字光标自动隐藏
        EnableScrollUpDown:true,        //允许手势上下操作滚动页面
        CorssCursorInfo:{ Left:0, Right:2, Bottom:1, IsShowCorss:true },  //十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内

        KLine: 
        {
            DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right: 1, //复权 0 不复权 1 前复权 2 后复权
            Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
            MaxReqeustDataCount: 1000, //日线数据最近1000天
            MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
            PageSize: 30, //一屏显示多少数据
            IsShowTooltip: false //是否显示K线提示信息
        },
        //标题设置
        KLineTitle: 
        {
            IsShowName: false, //不显示股票名称
            IsShowSettingInfo: false //不显示周期/复权
        },
        //边框
        Border: 
        {
            Left: 0, //左边间距
            Right: 1, //右边间距
            Top: 20,
            Bottom:20,
        },
        //子框架设置
        Frame: 
        [
            { SplitCount: 3, IsShowLeftText:false, Custom:[{Type:0}] },
            { SplitCount: 3, IsShowLeftText:false, },
            { SplitCount: 3, IsShowLeftText:false, },
        ],

        ExtendChart:[ { Name:'KLineTooltip' } ],    //tooltip十字光标提示信息
    };
    return data;
}

DefaultData.GetKMinuteOption = function()
{
    let data = 
    {
        Type: '历史K线图',
        //窗口指标
        Windows: 
        [
            { Index: "EMPTY", Modify:false, Change:false, TitleHeight:0 },
            { Index: "VOL", Modify:false, Change:false },
        ],
        //Symbol: '600000.sh',
        IsAutoUpdate: true,
        AutoUpdateFrequency: 10000, //数据更新频率 ms

        IsShowRightMenu: false, //右键菜单
        IsApiPeriod: true,      //使用Api计算周期

        IsClickShowCorssCursor:true,    //手势点击出现十字光标
        IsCorssOnlyDrawKLine:true,      //十字光标在K线中间
        CorssCursorTouchEnd:true,       //手势离开屏幕十字光标自动隐藏
        EnableScrollUpDown:true,        //允许手势上下操作滚动页面
        CorssCursorInfo:{ Left:0, Right:2, Bottom:1, IsShowCorss:true },  //十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内

        KLine: 
        {
            DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right: 1, //复权 0 不复权 1 前复权 2 后复权
            Period: 4, //周期 0 日线 1 周线 2 月线 3 年线
            MaxReqeustDataCount: 1000, //日线数据最近1000天
            MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
            PageSize: 30, //一屏显示多少数据
            IsShowTooltip: false, //是否显示K线提示信息
            DrawType:4,    
        },
        //标题设置
        KLineTitle: 
        {
            IsShowName: false, //不显示股票名称
            IsShowSettingInfo: false //不显示周期/复权
        },
        //边框
        Border: 
        {
            Left: 0, //左边间距
            Right: 1, //右边间距
            Top: 1,
            Bottom:20,
        },
        //子框架设置
        Frame: 
        [
            { SplitCount: 3, IsShowLeftText:false, Custom:[{Type:0}] },
            { SplitCount: 3, IsShowLeftText:false, },
            { SplitCount: 3, IsShowLeftText:false, },
        ],

        ExtendChart:[ { Name:'KLineTooltip' } ],    //tooltip十字光标提示信息
    };
    return data;
}

DefaultData.GetPeriod=function()    //周期菜单
{
    var data=
    [
        {Name:'分时', Period:4, Type:0, Min:1 },
        {Name:'1', Period:4, Type:0, Min:1 },
        {Name:'5', Period:5, Type:0, Min:5 },
        {Name:'15', Period:6, Type:0, Min:15 },
        {Name:'30', Period:7, Type:0, Min:30 },
        {Name:'1H', Period:8, Type:0, Min:60 },
        {Name:'4H', Period:12, Type:0, Min:240 },

        {Name:'D', Period:0, Type:1, Min:0 },
        {Name:'W', Period:1, Type:2, Min:0 },
        {Name:'M', Period:2, Type:3, Min:0 },
    ];

    return data;
}

DefaultData.GetIndexMenu=function() //指标菜单配置
{
    var data=   //ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
    [
        {Name:'KDJ', ID:'KDJ', WindowIndex:1 },
        {Name:'MACD', ID:'MACD', WindowIndex:2 },
        {Name:'RSI', ID:'RSI', WindowIndex:1 },
        {Name:'BOLL', ID:'BOLL', WindowIndex:0 },
        {Name:'VOL', ID:'VOL', WindowIndex:1 },
        {Name:'均线', ID:'均线', WindowIndex:0 },
    ];

    return data;
}

export default 
{
    name:'BitKLine',

    props: 
    [
        'DefaultPairName',          //代码
        'DefaultName',              //名称 
        'DefaultfloatPrecision',    //小数位数
        'DefaultPeriod',            //周期
    ],

    data()
    {
        return {
            Symbol: 'ETH/BTC.bit',
            Name:'',
            PairName:'ETH/BTC', //货币代码
            FloatPrecision:2,   //品种的小数位数

            KLine:  //K线
            {
                JSChart: null,
                Option: DefaultData.GetKlineOption(),
                IsShow:true,
            },

            Minute: //分时 (使用K线面积图来做分时图)
            {
                JSChart: null,
                Option: DefaultData.GetKMinuteOption(),
                IsShow:false,
            },

            Period:     //周期菜单
            {
                Menu:DefaultData.GetPeriod(),       //菜单项
                SelItem:DefaultData.GetPeriod()[6], //当前选中
            },  
            
            Index:      //指标菜单
            {
                Menu:DefaultData.GetIndexMenu(),       //菜单项
                SelItem:DefaultData.GetIndexMenu()[0],
                IsShow:true,
            },
        }
    },

    created()
    {
        if (this.DefaultPairName) this.PairName=this.DefaultPairName;
        if (this.DefaultName) this.Name=this.DefaultName;
        if (this.DefaultfloatPrecision) this.FloatPrecision=parseInt(this.DefaultfloatPrecision);
        if (this.DefaultPeriod) 
        {
            var periodItem=this.GetPeriodInfo(this.DefaultPeriod);
            if (periodItem) this.Period.SelItem=periodItem;
        }
        this.Symbol=this.PairName+'.BIT';
    },

    mounted()
    {
        this.OnSize();
        this.CreateKLine();
    },

    methods: 
    {
        //////////////////////////////////////////////////////////////////////////////////
        //公共对外接口
        //
        /////////////////////////////////////////////////////////////////////////////////

        OnSize()    //动态调整
        {
            var divKLineChart=this.$refs.divklinechart;
            var height=divKLineChart.offsetHeight;
            var width=divKLineChart.offsetWidth;
            var divPeriod=this.$refs.divperiod;
            var divSymbol=this.$refs.divsymbol;
            var divIndex=this.$refs.divindex;

            var klineHeight=height-divPeriod.offsetHeight-divSymbol.offsetHeight-divIndex.offsetHeight-4; //总的高度减去其他控件高度就是图形高度
            var divKLine=this.$refs.divkline;
            divKLine.style.width=width+'px';
            divKLine.style.height=klineHeight+'px';
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize();

            var divKMinute=this.$refs.divkminute;
            var kMinuteHeight=height-divPeriod.offsetHeight-divSymbol.offsetHeight-4; //总的高度减去其他控件高度就是图形高度
            divKMinute.style.width=width+'px';
            divKMinute.style.height=kMinuteHeight+'px';
            if (this.Minute.JSChart) this.Minute.JSChart.OnSize();
        },

        ChangeSymbol(symbol,name,floatPrecision) //切换股票
        {
            if (this.PairName==symbol) return;
            this.PairName=symbol;
            this.Symbol=symbol+'.BIT';
            this.Name=name;
            this.FloatPrecision=floatPrecision;
            if (this.KLine.JSChart) this.KLine.JSChart.ChangeSymbol(this.Symbol);
            if (this.Minute.JSChart) this.Minute.JSChart.ChangeSymbol(this.Symbol);
        },

        ChangeIndex(item)   //切换指标
        {
            if (this.KLine.JSChart) this.KLine.JSChart.ChangeIndex(item.WindowIndex,item.ID );
        },

        ChangePeriod(item)
        {
            this.Period.SelItem=item;
            if (item.Name=='分时')
            {
                if (!this.Minute.JSChart) this.CreateMinute();

                this.Index.IsShow=false;
                this.KLine.IsShow=false;
                this.Minute.IsShow=true;
            }
            else
            {
                if (this.KLine.JSChart) this.KLine.JSChart.ChangePeriod(item.Period);
                else this.CreateKLine();

                this.Index.IsShow=true;
                this.KLine.IsShow=true;
                this.Minute.IsShow=false;
            }
        },


        /////////////////////////////////////////////////////////////////////////////////////////////
        // 私有内部函数
        /////////////////////////////////////////////////////////////////////////////////////////////
        CreateKLine()
        {
            if(this.KLine.JSChart) return;

            JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol)=> {return this.FloatPrecision; } // 不同品种虚拟币，使用不同小数位数
            var divKLine=this.$refs.divkline;
            this.KLine.JSChart = JSCommon.JSChart.Init(divKLine);
            this.KLine.Option.KLine.Period = this.Period.SelItem.Period;
            this.KLine.Option.Symbol=this.Symbol;
            this.KLine.Option.NetworkFilter = (data, callback) => { this.NetworkFilter(data, callback); };  //网络请求回调函数
            this.KLine.JSChart.SetOption(this.KLine.Option);
        },

        CreateMinute()
        {
            if(this.Minute.JSChart) return;

            JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = (symbol)=> {return this.FloatPrecision; } // 不同品种虚拟币，使用不同小数位数
            var divKLine=this.$refs.divkminute;
            this.Minute.JSChart = JSCommon.JSChart.Init(divKLine);
            this.Minute.Option.Symbol=this.Symbol;
            this.Minute.Option.NetworkFilter = (data, callback) => { this.MinuteNetworkFilter(data, callback); };  //网络请求回调函数
            this.Minute.JSChart.SetOption(this.Minute.Option);
        },

        GetPeriodInfo(period)
        {
            for(var i in this.Period.Menu)
            {
                var item=this.Period.Menu[i];
                if (item.Period==period) return item;
            }

            return null;
        },

        MinuteNetworkFilter(data, callback)
        {
            console.log('[BitKLine::NetworkFilter] data', data);
            switch(data.Name) 
            {
                case 'KLineChartContainer::ReqeustHistoryMinuteData':   //分钟全量数据下载
                    this.ReqeustHistoryMinuteData(data,callback, { PageSize:500 });
                    break;
                case 'KLineChartContainer::RequestMinuteRealtimeData':  //分钟实时数据更新
                    this.RequestMinuteRealtimeData(data,callback);
                    break;
            }
        },

        NetworkFilter(data, callback)   //第3方数据替换接口
        {
            console.log('[BitKLine::NetworkFilter] data', data);
            switch(data.Name) 
            {
                case 'KLineChartContainer::ReqeustHistoryMinuteData':   //分钟全量数据下载
                    this.ReqeustHistoryMinuteData(data,callback,{ PageSize:50 });
                    break;
                case 'KLineChartContainer::RequestHistoryData':         //日线全量数据下载
                    this.RequestHistoryData(data,callback);
                    break;
                case 'KLineChartContainer::RequestMinuteRealtimeData':  //分钟实时数据更新
                    this.RequestMinuteRealtimeData(data,callback);
                    break;
                case 'KLineChartContainer::RequestRealtimeData':        //日线实时数据更新
                    this.RequestRealtimeData(data,callback);
                    break;
            }
        },

        ReqeustHistoryMinuteData(data,callback,option) //第3方分钟线历史数据请求
        {
            data.PreventDefault = true;
            var period=data.Self.Period;    //获取周期
            var symbol=this.Symbol;
            var name=this.Name;
            var peirodMenu=this.GetPeriodInfo(period)
            var type=peirodMenu.Type, min=peirodMenu.Min, count=500;

            var startDateTime = moment().format('YYYYMMDDHHmmss');
            var hash = sha256.create();
            hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
            var secretHash = hash.hex();

            $.ajax({
                url: 'https://bit.zealink.com/api/selectchart',
                type: 'post',
                data: 
                {
                    pairname: this.PairName,
                    apikey: API_KEY,
                    type: type,
                    min: min,
                    startdatetime: startDateTime,
                    count: count,
                    secrethash: secretHash
                },
                success: (recvData) => {
                    this.RecvMinuteHistoryData(recvData, callback, { Name:name, Symbol:symbol ,Chart:data.Self}, option);
                }
            })
        },

        RecvMinuteHistoryData(recvData, callback, stockData, option) 
        {
            console.log('[BitKLine::RecvMinuteHistoryData]',recvData);
            var klineData=this.JsonToHQChartMinuteHistoryData(recvData);

            var hqChartData={code:0, data:klineData};
            hqChartData.symbol=stockData.Symbol;
            hqChartData.name=stockData.Name;
            stockData.Chart.PageSize=option.PageSize;    //设置一屏显示数据个数

            console.log('[BitKLine::RecvMinuteHistoryData] hqchartdata',hqChartData);
            callback(hqChartData);
        },

        RequestHistoryData(data, callback)  //第3方日线历史数据请求
        {
            data.PreventDefault = true;
            var period=data.Self.Period;    //获取周期
            var symbol=this.Symbol;
            var name=this.Name;
            var peirodMenu=this.GetPeriodInfo(period)
            var type=peirodMenu.Type, min=peirodMenu.Min, count=500;

            var startDateTime = moment().format('YYYYMMDDHHmmss');
            var hash = sha256.create();
            hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
            var secretHash = hash.hex();

            $.ajax({
                url: 'https://bit.zealink.com/api/selectchart',
                type: 'post',
                data: 
                {
                    pairname: this.PairName,
                    apikey: API_KEY,
                    type: type,
                    min: min,
                    startdatetime: startDateTime,
                    count: count,
                    secrethash: secretHash
                },
                success: (recvData) => {
                    this.RecvHistoryData(recvData, callback, { Name:name, Symbol:symbol, Chart:data.Self });
                }
            })
        },

        RecvHistoryData(recvData, callback, stockData)
        {
            console.log('[BitKLine::RecvHistoryData]',recvData);
            var klineData=this.JsonToHQChartHistoryData(recvData);

            var hqChartData={code:0, data:klineData};
            hqChartData.symbol=stockData.Symbol;
            hqChartData.name=stockData.Name;
            stockData.Chart.PageSize=15;    //设置一屏显示数据个数

            console.log('[BitKLine::RecvHistoryData] hqchartdata',hqChartData);
            callback(hqChartData);
        },

        RequestMinuteRealtimeData(data,callback)    //第3方分钟实时数据更新请求
        {
            data.PreventDefault = true;
            var period=data.Self.Period;    //获取周期
            var symbol=this.Symbol;
            var name=this.Name;
            var peirodMenu=this.GetPeriodInfo(period)
            var type=peirodMenu.Type, min=peirodMenu.Min, count=2;  //取最新5条数据 分时数据多取几条更新

            var startDateTime = moment().format('YYYYMMDDHHmmss');
            var hash = sha256.create();
            hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
            var secretHash = hash.hex();

            $.ajax({
                url: 'https://bit.zealink.com/api/selectchart',
                type: 'post',
                data: 
                {
                    pairname: this.PairName,
                    apikey: API_KEY,
                    type: type,
                    min: min,
                    startdatetime: startDateTime,
                    count: count,
                    secrethash: secretHash
                },
                success: (recvData) => {
                    this.RecvMinuteRealtimeData(recvData, callback, { Name:name, Symbol:symbol });
                }
            })
        },

        RecvMinuteRealtimeData(recvData, callback, stockData)
        {
            console.log('[BitKLine::RecvMinuteRealtimeData]',recvData);

            var klineData=this.JsonToHQChartMinuteHistoryData(recvData);

            var hqChartData={code:0, data:klineData, ver:2.0};  //数字货币使用ver2.0数据格式
            hqChartData.symbol=stockData.Symbol;
            hqChartData.name=stockData.Name;

            console.log('[BitKLine::RecvMinuteRealtimeData] hqchartdata',hqChartData);
            callback(hqChartData);

        },

        RequestRealtimeData(data,callback)  //第3方日线实时数据更新请求
        {
            data.PreventDefault = true;
            var period=data.Self.Period;    //获取周期
            var symbol=this.Symbol;
            var name=this.Name;
            var peirodMenu=this.GetPeriodInfo(period)
            var type=peirodMenu.Type, min=peirodMenu.Min, count=2;  //取最新2条数据

            var startDateTime = moment().format('YYYYMMDDHHmmss');
            var hash = sha256.create();
            hash.update(API_KEY + this.PairName + type + min + startDateTime + count + SECRET_KEY);
            var secretHash = hash.hex();

            $.ajax({
                url: 'https://bit.zealink.com/api/selectchart',
                type: 'post',
                data: 
                {
                    pairname: this.PairName,
                    apikey: API_KEY,
                    type: type,
                    min: min,
                    startdatetime: startDateTime,
                    count: count,
                    secrethash: secretHash
                },
                success: (recvData) => {
                    this.RecvRealtimeData(recvData, callback, { Name:name, Symbol:symbol });
                }
            })
        },

        RecvRealtimeData(recvData, callback, stockData)
        {
            console.log('[BitKLine::RecvRealtimeData]',recvData);

            var stockItem=this.JsonToHQChartRealtimeData(recvData);
            stockItem.symbol=stockData.Symbol;
            stockItem.name=stockData.Name;
            var hqChartData={code:0, stock:[stockItem]};
            
            console.log('[BitKLine::RecvRealtimeData] hqchartdata',hqChartData);
            callback(hqChartData);
        },

        JsonToHQChartMinuteHistoryData(recvData)  //分钟（历史/最新）数据转化为hqchart数据格式
        {
            var data=recvData.data.series;
            var yClose=null;
            var klineData=[];
            for(var i in data)
            {
                var item=data[i];
                var aryItem = item.split('|');
                var date=parseInt(aryItem[0]/1000000);
                var time=parseInt(aryItem[0]%1000000);
                var open = parseFloat(aryItem[1]);
                var high = parseFloat(aryItem[2]);
                var low = parseFloat(aryItem[3]);
                var close = parseFloat(aryItem[4]);
                var vol = parseFloat(aryItem[5]);
                klineData.push([date, yClose, open, high, low, close, vol, null, time]);

                yClose=close;
            }

            return klineData;
        },

        JsonToHQChartHistoryData(recvData)  //日线历史数据转化为hqchart数据格式
        {
            var data=recvData.data.series;
            var yClose=null;
            var klineData=[];
            for(var i in data)
            {
                var item=data[i];
                var aryItem = item.split('|');
                var date=parseInt(aryItem[0]/1000000);
                var open = parseFloat(aryItem[1]);
                var high = parseFloat(aryItem[2]);
                var low = parseFloat(aryItem[3]);
                var close = parseFloat(aryItem[4]);
                var vol = parseFloat(aryItem[5]);
                klineData.push([date, yClose, open, high, low, close, vol, null]);

                yClose=close;
            }

            return klineData;
        },

        JsonToHQChartRealtimeData(recvData) //日线最新数据转化为hqchart数据格式
        {
            var stockData={};
            var data=recvData.data.series;
            var yClose=null;
            for(var i in data)
            {
                var item=data[i];
                var aryItem = item.split('|');
                stockData.date=parseInt(aryItem[0]/1000000);
                stockData.open = parseFloat(aryItem[1]);
                stockData.high = parseFloat(aryItem[2]);
                stockData.low = parseFloat(aryItem[3]);
                stockData.price = parseFloat(aryItem[4]);   //收盘价
                stockData.vol = parseFloat(aryItem[5]);
                stockData.yclose=yClose;
                stockData.amount=null;

                yClose=stockData.price;
            }

            return stockData;
        },
    }
}

</script>

<style lang="less">
/*页面头部*/
.name-box{flex:1;text-align: center;position: relative;}
.headTitle {display:flex; box-sizing: border-box; padding-top: 4px;}
.nameWrap {text-align: center; line-height: 21px; font-family: "PingFangSC-Light";}
.stockName {/*font-family: "PingFang-SC-Heavy";*/ margin-right: 1.2%;}
.exchangeInfo { font-size: 12px; color: #666; height: 15px; line-height: 15px; font-weight: bold; text-align: center; font-family: "PingFangSC-Light";}

/*k线部分*/
.blockBg {background: #fff; margin-top: 5px;}
.tabsTitle {height: 28px; line-height: 28px; border-bottom: 1px solid #ececec; border-top: 1px solid #ececec; padding: 0 4%; font-size: 1.3rem; display: flex; flex-direction: row;}
.tabsTitle span{width: 15%; height: 27px; line-height: 27px; border-bottom: 2px solid transparent; display: inline-block; text-align: center; vertical-align: top;}
.tabsTitle span.active{ border-bottom-color: #217cd9; color: #217cd9;}
.klineWrap {float: left; position: relative; overflow: hidden;}
.kLineTabs .tabsTitle { padding-left: 2%;}
.kLineTabs .tabsTitle span {font-size: 1.3rem; width: 16%;}
.kLineTabs .tabsTitle span:last-child {width: 18%;}
.indexWrap{width: 100%;height: 30px;background-color: #f6fbfe;font-size: 12px;overflow: hidden;display: flex;flex-direction: row;}
.indexWrap .indexItem {display: block;line-height: 30px;flex-grow: 1;text-align: center;}
.indexWrap .indexItem.active {color: #333; background-color: #e1ecf2;}
</style>