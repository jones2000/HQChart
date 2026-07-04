# 一、环境引入 HQChart


## 1.1 CDN 直接引入（纯 HTML 项目）
```html

<!-- 
    HQChart插件内置样式和iconfont图标文件
-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/css/tools.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/font/iconfont.css" />


<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/webfont.js"></script>

<!-- HQChart源码地址 -->
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart/umychart.min.js"></script>

```

## 1.2 NPM 安装（Vue/React 工程）

```bash

# npm
npm install hqchart --save
# yarn
yarn add hqchart
# pnpm
pnpm add hqchart

```

项目内导入

```javascript

import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/font/drawtool/iconfont.css';     //HQChart插件内部使用的iconfont图标
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'   //HQChart插件内置样式

```

## 1.3 DOM 容器准备
图表必须挂载到一个DOM上 

```html
<div id="MinuteCtrl"></div>

.......

<style>

 #MinuteCtrl 
 {
        width: 500px;
        height: 300px;
        position: relative;
}
</style>

```

# 二、基础初始化（K 线图）

## 2.1 最简示例（原生 JS）

```javascript

// 1. 创建图表实例
var divMinute=document.getElementById('MinuteCtrl');
var chart=JSChart.Init(divMinute, false, true);  //注意:  原生不要添加头HQChart.Chart.， 这个是在npm方式引入才需要

// 2. 配置图表基础参数
var option = 
{
    Type:'分钟走势图',   //创建图形类型 '分钟走势图','分钟走势图横屏'
    Windows: //窗口指标
    [
        { Index:"MACD",  },
    ], 

    Symbol: '000001.sh',

    NetworkFilter:(data, callback)=>
    { 
        //TODO:对接K线数据 
    }
    
}

chart.SetOption(option);

```


## 2.1 最简示例（Vue2）

```javascript

<template>
    <div id="Minute" ref='Minute' style="width:100%;height:100%">
        <div id="MinuteChart" ref="MinuteChart"></div>
    </div>
</template>

<script type="text/javascript">

import HQChart from 'hqchart';
import 'hqchart/src/jscommon/umychart.resource/font/drawtool/iconfont.css';
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'


// 1. 创建图表实例
var chart=HQChart.Chart.JSChart.Init(this.$refs.MinuteChart);

// 2. 配置图表基础参数
var option = 
{
    Type:'分钟走势图',   //创建图形类型 '分钟走势图','分钟走势图横屏'
    Windows: //窗口指标
    [
        { Index:"MACD",  },
    ], 

    Symbol: '000001.sh',

    NetworkFilter:(data, callback)=>
    { 
        //TODO:对接K线数据 
    }
    
}

chart.SetOption(option);

</script>

<style>

#MinuteChart
{
    left:0px;
    top:0px;
    position: relative;
    width:100%;
    height:100%;
}
</style>

```

# 三、配置参数详解 SetOption

## 3.1 基础类型参数

|参数|取值|说明|类型|
|----|----|---- |----|
|Type  |   1."分钟走势图" PC或手机竖屏使用<br> 2."分钟走势图横屏" 手机横屏使用      |    图形属性名称 | 字符串 |
|Windows| 详见 K线图创建及SetOption参数详解.md -> 3.2 指标窗口参数详解 | 窗口指标设置|  数组|
|Symbol|如 "600000.sh"|标的代码 | 字符串|
|IsAutoUpdate| true/false | 是否在交易时间段自动更新数据 | bool|
|AutoUpdateFrequency| 如 10000| 自动更新数据频率, 默认30s, 单位ms (可选)| bool|
|DayCount| | 显示几天分时图, 默认1 (可选) | 数值|
|Language| 英文 'EN' 中文:'CN' 繁体:'TC'| UI语言(可选) |字符串 |
|EnableResize| true/false | 图形画布自适应div大小, 默认false. (可选)| bool |
|Border| 详见 K线图创建及SetOption参数详解.md -> 3.8 边框四周间距参数详解 | 边框四周间距设置 (可选)| object|
|NetworkFilter| 如:NetworkFilter:(data, callback)=>{ //TODO:处理各种不同的K线数据 }  | 数据拦截回调|  回调函数|
|EventCallback| 详见 K线图创建及SetOption参数详解.md -> 3.17 注册事件回调 | 注册多个事件回调数组 | 数组 |
|CorssCursorInfo| 详见 K线图创建及SetOption参数详解.md -> 3.5 十字光标参数详解 | 十字光标设置| object|
|MinuteLine| 详见3.2 分时图主图参数详解 |分时图主图设置| object|
|MinuteTitle| 详见3.3 分时图标题参数详解 | 分时图标题设置| object|


## 3.2 分时图主图参数详解

|参数|取值|说明|类型|
|----|----|---- |----|
|IsDrawAreaPrice| true/false| 是否画价格面积图| bool|
|IsShowAveragePrice| true/false |是否显示均线 | bool|
|IsShowLead| true/false| 是否显示领先指标| bool|
|SplitType| 0 默认根据最大最小值分割<br> 1 涨跌停分割<br> 2 数据最大最大值分割| 主图分割方式| 数值|

## 3.3 分时图标题参数详解

|参数|取值|说明|类型|
|----|----|---- |----|
|IsShowTime| true/false| 是否显示时间 (可选)| bool|
|IsShowName| true/false| 是否显示品种名称 (可选)| bool|
|IsShowDate| true/false| 是否显示日期 (可选)| bool|
|IsShowVolTitle| true/false| 是否显示成交量数值 (可选)| bool|
|IsTitleShowLatestData| true/false| 十字光标不在图形上， 标题栏显示最后一个数据， 默认(false) (可选)| bool|
|OverlayTitleName| 如: OverlayTitleName: ["MTitle-Close", "MTitle-Increase"]<br> "MTitle-Close" 价格 <br> "MTitle-Increase" 涨幅 | 叠加股票显示数据| 数组|