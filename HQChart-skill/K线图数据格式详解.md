# 一、k线数据对接流程
HQChart 所有数据都通过NetwrokFilter数据拦截回调, 图形显示了什么数据就会触发NetwrokFilter来获取数据, 图形没有使用的数据是不会触发NetwrokFilter.
NetwrokFilter回调函数是通过SetOption函数来设置的

## 1.1 NetwrokFilter回调函数参数说明
```javascript

//data 请求的品种信息, 如品种代码 复权，周期等信息
//callback 把数据给HQChart插件的回调函数
function(data, callback)
{
    //1. 从data获取需要请求的种代码 复权，周期等信息
    //2. 请求数据 并把数据转成HQChart数据格式
    //3. 通过callback回调把数据在传给HQChart插件。
}

```


## 1.2 最简示例（原生 JS）

```javascript

// 1. 创建图表实例
var divKLine=document.getElementById('KLineCtrl');
var chart=JSChart.Init(divKLine, false, true);  //注意:  原生不要添加头HQChart.Chart.， 这个是在npm方式引入才需要

// 2. 配置图表基础参数
var option = 
{
    Type:'历史K线图', //"历史K线图", "历史K线图横屏"
    Windows: //窗口指标
    [
        { Index:"MA"},
        { Index:"VOL", },
        { Index:"MACD",  },
    ], 
    Symbol: '000001.sh',

    KLine:  //K线设置
    {
        Right:0,    //复权 0 不复权 1 前复权 2 后复权
        Period:0,   //周期 0 日线 1 周线 2 月线 3 年线 
    },

    //数据对接函数
    NetworkFilter:(data, callback)=>
    { 
        console.log(`[NetworkFilter] ${data.Name} - ${data.Explain}`);
        //根据不同的data.Name(数据名称) 请求不同的接口数据
        switch(data.Name) 
        {
            //K线图
            case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
                //调用 K线日线全量数据处理函数
                break;
            case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
                break;
            //..........................
        }
    }
}

chart.SetOption(option);

```

## 1.2 最简示例（Vu2）

```javascript

<template>
    <div id="KLine" ref='KLine' style="width:100%;height:100%">
        <div id="KLineChart" ref="KLineChart"></div>
    </div>
</template>

<script type="text/javascript">

import HQChart from 'hqchart';
import 'hqchart/src/jscommon/umychart.resource/font/drawtool/iconfont.css';
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'


// 1. 创建图表实例
var chart=HQChart.Chart.JSChart.Init(this.$refs.KLineChart);

// 2. 配置图表基础参数
var option = 
{
    Type:'历史K线图', //"历史K线图", "历史K线图横屏"
    Windows: //窗口指标
    [
        { Index:"MA"},
        { Index:"VOL", },
        { Index:"MACD",  },
    ], 
    Symbol: '000001.sh',

    KLine:  //K线设置
    {
        Right:0,    //复权 0 不复权 1 前复权 2 后复权
        Period:0,   //周期 0 日线 1 周线 2 月线 3 年线 
    },

    NetworkFilter:(data, callback)=>
    { 
        console.log(`[NetworkFilter] ${data.Name} - ${data.Explain}`);
        //根据不同的data.Name(数据名称) 请求不同的接口数据,数据名称详见“数据名称详解”表格
        switch(data.Name) 
        {
            //K线图
            case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
                //调用 K线日线全量数据处理函数
                break;
            case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新
                break;
            //..........................
        }
    }
    
}

chart.SetOption(this.Option);

</script>

<style>

#KLineChart
{
    left:0px;
    top:0px;
    position: relative;
    width:100%;
    height:100%;
}
</style>

```

## 2.3 数据名称详解

|数据名称|说明|数据格式|
|----|----|----|
|"KLineChartContainer::RequestHistoryData"|日线全量数据下载| 详见2.1 日线全量数据下载 |
|"KLineChartContainer::RequestRealtimeData"|日线实时数据更新| 详见2.2 日线实时数据更新 |
|"KLineChartContainer::RequestFlowCapitalData"| 流通股本 | 详见2.3 流通股本|
|"KLineChartContainer::ReqeustHistoryMinuteData"|分钟全量数据下载| 详见2.4 分钟全量数据下载 |
|"KLineChartContainer::RequestMinuteRealtimeData"|分钟增量数据更新| 详见2.5 分钟增量数据更新 |
|"KLineChartContainer::RequestOverlayHistoryData"|叠加股票日线| |
|"KLineChartContainer::RequestOverlayHistoryMinuteData"| 分钟K叠加股票| |

## 1.4 周期对应数值表

|数值|周期说明|
|----|----|
|日周期|
|0 |日线| 
|1 |周线| 
|2 |月线|
|3 | 年线|
|9 | 季线|
|21 |双周|
|22 |半年|
|40001-49999| 自定义日线<br> 如:40055 表示55日周期的 |
|分钟周期|
|4 |1分钟|
|5 |5分钟|
|6 |15分钟|
|7 |30分钟|
|8 |60分钟|
|11|120分钟|
|12|240分钟|
|20001-29999| 自定义分钟<br> 如：20251 表示251分钟周期|
|秒级周期|
|30001-32000| 秒周期  如：30200 表示200秒周期|

## 1.5 复权对应数值表
|数值|复权说明|
|----|----|
|0 |不复权|
|1 | 前复权|
|2 | 后复权|

# 二、数据格式详解

## 2.1 日线全量数据下载 KLineChartContainer::RequestHistoryData

### 2.1.1 单条日线数据格式
|下标|字段说明|类型|格式|
|----|----|----|----|
|0| 日期    | 整型 | yyyymmdd 例：20260702|
|1| 前收盘价| 浮点 | |
|2| 开盘价| 浮点 | |
|3| 最高| 浮点 | |
|4| 最低| 浮点 | |
|5| 收盘价| 浮点 | |
|6| 成交量| 浮点 | |
|7| 成交金额| 浮点 | |
|8| 持仓量 (期货才有)| 浮点 ||
|9| 结算价 (期货才有)| 浮点 ||
|10| 前结算价 (期货才有)| 浮点 ||
|11| 前复权因子 (可选)| 浮点 ||
|12| 后复权因子 (可选)| 浮点 ||
|13| 是否是虚拟K线 (可选) | bool ||
|14| 是否是非交易日 (可选)| bool ||
|15| 流通股本 (可选)| 浮点||
|66| 指定K线颜色 (可选)| object| {<br> Type:0=空心 1=实心, <br>Line:{ Color:'上下线颜色'}, <br>Border:{Color:柱子边框颜色}, <br>BarColor:柱子颜色<br>} |

### 2.1.2 callback数据格式
```javascript
{ 
    symbol:"品种代码",
    name:"品种名称", 
    data:[] //K线数据  
}
```



### 2.1.3 示例 日线全量数据下载

```javascript

//定义一个K线处理函数 在NetworkFilter回调里面，调用
function Process_KLine_RequestHistoryData(data, callback, option)
{
    data.PreventDefault=true;   //通知插件数据已经外部出来好了, 不需要在内部处理了

    //获取图形需要请求 股票代码，复权，周期 信息
    var symbol=data.Request.Data.symbol;    //股票代码
    var right=data.Request.Data.right;      //复权 0 不复权 1 前复权 2 后复权
    var period=data.Request.Data.period;    //周期 0 日线 1 周线 2 月线 3 年线 9 季线

    //请求k线信息

    //把网络数据转成HQChart插件格式
    var hqchartData=
    { 
        name: '浦发银行', 
        symbol: '600000.sh',
        data:   //K线日线数据
        [
            [ 20231109, 6.9,6.9, 6.96, 6.88, 6.93, 21910400, 40011 ],
            [ 20231110, 6.93,6.91,6.96,6.86,6.88,20459000, 60003 ]
        ]
    }

    callback(hqchartData);  //把数据通过回调函数回传给HQChart插件
}

```


## 2.2 日线实时数据更新 KLineChartContainer::RequestRealtimeData

### 2.2.1 日线实时数据格式
日线实时数据格式与上面的日线全量数据格式是一样的
自动更新数据， 必须是在SetOption里面开启IsAutoUpdate:true, 并且时间在这个品种交易时间段内，才会触发。


### 2.2.2 callback数据格式
```javascript
{ 
    stock:
    [ 
        { 
            name:"品种代码", symbol:"品种名称", 
            data:[]    //K线数据
        }
    ],  //
    Ver: 3      //必须是3.0的数据格式
}
```

### 2.2.3 示例 日线实时数据更新

```javascript

//定义一个处理函数 在NetworkFilter回调里面，调用
function Process_KLine_RequestRealtimeData(data, callback, option)
{
    data.PreventDefault=true;   //通知插件数据已经外部出来好了, 不需要在内部处理了

    //获取图形需要请求 股票代码，复权，周期 信息
    var symbol=data.Request.Data.symbol[0];    //请求的股票代码
    var right=data.Request.Data.right;      //复权
    var period=data.Request.Data.period;    //周期
    var dateRange=data.Request.Data.dateRange;  //本地K线的数据范围

    //请求k线信息

    //把网络数据转成HQChart插件格式
    var hqchartData=
    {
        "Ver": 3,
        stock:
        [
            { 
                symbol: "600000.sh",
                name: "浦发银行",
                data: 
                [
                    [20260701,8.61,8.58,8.75,8.54,8.65,53417700,45678],
                    [20260702,8.65,8.71,8.84,8.56,8.7,71137600,56734]
                ]
            }
        ]
    }   

    callback(hqchartData);  //把数据通过回调函数回传给HQChart插件
}

```

## 2.3 流通股本 KLineChartContainer::RequestFlowCapitalData

### 2.3.1 单条流通股结构
```javascript

{
    capital:
    { 
        a: 3010001,  //流通股 某一日的流通股数据
    },
    date: 19991110, //日期 格式:yyyymmdd 19991110 表示 1999-11-10
}

```


### 2.3.2 callback数据格式

如果没有流通股数据直接返回 { stock:[], code:0 }.

```javascript
{ 
    stock:
    [ 
        { 
            symbol:"品种代码", 
            stockday:[],    //所有的流通股数据
        }
    ],
    code:0,
}

```

### 2.3.3 示例 流通股本

```javascript

//定义一个处理函数 在NetworkFilter回调里面，调用
function Process_KLine_RequestFlowCapitalData(data, callback, option)
{
    data.PreventDefault=true;               //通知插件数据已经外部出来好了, 不需要在内部处理了
    var symbol=data.Request.Data.symbol[0]; //股票代码

    //请求数据 

    //把网络数据转成HQChart插件格式
    var hqchartData=
    {
         stock:
        [ 
            { 
                symbol:"600000.sh", 
                stockday:
                [
                    { date: 19991110, capital: { a: 320000000 } },
                    { date: 20011231, capital: { a: 400000000 } }
                    //..........
                ],    //所有的流通股数据
            }
        ],
        code:0
    }

    callback(hqchartData);  //把数据通过回调函数回传给HQChart插件
}


```

## 2.4 分钟全量数据下载 KLineChartContainer::ReqeustHistoryMinuteData

### 2.4.1 单条分钟K线数据格式
|下标|字段说明|类型|格式|
|----|----|----|----|
|0| 日期    | 整型 | yyyymmdd 例：20260702|
|1| 前收盘价| 浮点 | |
|2| 开盘价| 浮点 | |
|3| 最高| 浮点 | |
|4| 最低| 浮点 | |
|5| 收盘价| 浮点 | |
|6| 成交量| 浮点 | |
|7| 成交金额| 浮点 | |
|8| 时间 | 整型  | 分钟周期格式: hhmm 例如 1003 表示 10:03<br> 秒级周期格式: hhmmss 如 123106 表示 12:31:06|
|9| 持仓量 (期货才有)| 浮点 ||
|10| 结算价 (期货才有)| 浮点 ||
|11| 前结算价 (期货才有)| 浮点 ||
|12| 前复权因子 (可选)| 浮点 ||
|13| 后复权因子 (可选)| 浮点 ||
|66| 指定K线颜色 (可选)| object| {<br> Type:0=空心 1=实心, <br>Line:{ Color:'上下线颜色'}, <br>Border:{Color:柱子边框颜色}, <br>BarColor:柱子颜色<br>} |

### 2.4.2 callback数据格式

```javascript
{ 
    ver:2.0, //必须填2.0 !!!!
    name:"品种名称", 
    symbol:"品种代码", 
    data:[], //分钟K线数据
    
};

```


### 2.4.3 示例 分钟全量数据

```javascript

//定义一个处理函数 在NetworkFilter回调里面，调用
function Process_KLine_ReqeustHistoryMinuteData(data, callback, option)
{
    data.PreventDefault=true;               //通知插件数据已经外部出来好了, 不需要在内部处理了
    var symbol=data.Request.Data.symbol;    //请求的股票代码
    var right=data.Request.Data.right;      //复权
    var period=data.Request.Data.period;    //周期

    //请求数据 

    //把网络数据转成HQChart插件格式
    var hqchartData=
    {
        ver:2.0,
        name: "浦发银行", symbol: "600000.sh",
        data:
        [
            [20260520,8.95,8.93,8.94,8.85,8.86,12932100,114922012,935],
            [20260520,8.86,8.86,8.96,8.85,8.95,8834100,78496457,936]
        ]
    }

    callback(hqchartData);  //把数据通过回调函数回传给HQChart插件
}


```



## 2.5 分钟增量数据更新 KLineChartContainer::RequestMinuteRealtimeData

### 2.5.1 单条分钟增量K线数据格式
数据格式与上面"2.4.1 单条分钟K线数据格式"一致

### 2.5.2 callback数据格式

```javascript
{ 
    Ver: 2      //必须是2的数据格式
    name:"品种代码", symbol:"品种名称", 
    data:[], //增量分钟K线数据
    overlay:[], //叠加股票的分钟增量数据 （可选)
}
```


### 2.5.3 示例 分钟增量数据


```javascript

//定义一个处理函数 在NetworkFilter回调里面，调用
function Process_KLine_RequestMinuteRealtimeData(data, callback, option)
{
    data.PreventDefault=true;               //通知插件数据已经外部出来好了, 不需要在内部处理了
    var symbol=data.Request.Data.symbol[0];     //请求的股票代码
    var right=data.Request.Data.right;          //复权
    var period=data.Request.Data.period;        //周期
    var dateRange=data.Request.Data.dateRange; //当前k线数据范围

    //请求数据 

    //把网络数据转成HQChart插件格式
    var hqchartData=
    {
        ver:2.0,
        name: "浦发银行", symbol: "600000.sh",
        data:
        [
            [20260520,8.95,8.93,8.94,8.85,8.86,12932100,114922012,935],
            [20260520,8.86,8.86,8.96,8.85,8.95,8834100,78496457,936]
        ]
    }

    callback(hqchartData);  //把数据通过回调函数回传给HQChart插件
}


```