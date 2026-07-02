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

## 数据名称详解

|数据名称|说明|数据格式|
|----|----|----|
|KLineChartContainer::RequestHistoryData|日线全量数据下载| |
|KLineChartContainer::RequestRealtimeData|日线实时数据更新| |
|KLineChartContainer::ReqeustHistoryMinuteData|分钟全量数据下载| |
|KLineChartContainer::RequestMinuteRealtimeData|分钟增量数据更新| |
|KLineChartContainer::RequestFlowCapitalData| 流通股本 | |
|KLineChartContainer::RequestOverlayHistoryData|叠加股票日线| |
|KLineChartContainer::RequestOverlayHistoryMinuteData| 分钟K叠加股票| |


# 二、数据格式详解

## 2.1 日线全量数据下载 KLineChartContainer::RequestHistoryData

日线全量数据格式
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


### 示例

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


