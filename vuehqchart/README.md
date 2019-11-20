# 介绍

> HQChart 

功能:
1. K线图
- 支持前复权,后复权 
- 支持日线,月线,周线,年线.分钟线
- 主图支持股票叠加 
- K线形状支持 空心K线,实心K线,美国线,收盘价线
- 支持常用指标指标(目前以录入系统指标80多个),支持自定义通达信语法脚本指标( 均线，BOLL，MACD，KDJ，VOL，RSI，BRAR，WR，BIAS，OBV，DMI，CR，PSY，CCI， DMA，TRIX，VR，EMV，ROC，MIM，FSL，CYR，MASS，WAD，CHO ..... )
- 支持画图工具(小程序不支持)
- 线段，射线，矩形，圆弧线,水平线,趋势线,平行线,平行通道,价格通道线,文本,江恩角度线,阻速线,黄金分割,百分比线,波段线,三角形,对称角度,斐波那契周期线,平行四边形,圆, iconfont图片 
- 支持区间统计， 区间形态匹配 (微信小程序版本不支持) 
- 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 
- 支持通达信语法指标
- 支持五彩K线(目前录入系统五彩K线30多个), 支持自定义通达信语法脚本的五彩K线
- 支持专家系统指标
- 支持个股筹码图
2. 走势图
- 支持指标 
- 支持股票叠加
- 支持沪深和港股,国内期货(开发中)
- 分钟数据显示 
- 支持多日分钟数据显示


 - [代码地址 github.com/jones2000/HQChart](https://github.com/jones2000/HQChart)
 - [行情页面](https://opensource.zealink.com/vuehqweb/hq.demo.page.html)
 - [历史数据查询](https://opensource.zealink.com/vuehqweb/queryContent.demo.page.html)

## Environment

`Node >= 6`

## Start

 - Clone or download this repository
 - Enter your local directory, and install dependencies:

``` bash
npm install
```

# VUE用例
## VUE创建走势图用例
```js
<template>

    <div id="app2">
        <div id="minute" ref="minute" ></div>
    </div>

</template>

<script>

import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'

function DefaultData(){}

DefaultData.GetMinuteOption=function()
{
    var option= 
    {
        Type:'分钟走势图',   //创建图形类型
            
        Windows: //窗口指标
        [
            
        ], 
            
        IsAutoUpdate:true,       //是自动更新数据
        DayCount:1,                 //1 最新交易日数据 >1 多日走势图
        IsShowCorssCursorInfo:true, //是否显示十字光标的刻度信息
        IsShowRightMenu:true,       //是否显示右键菜单
        CorssCursorTouchEnd:true,

        MinuteLine:
        {
            //IsDrawAreaPrice:false,      //是否画价格面积图
        },

        Border: //边框
        {
            Left:1,    //左边间距
            Right:1,   //右边间距
            Top:20,
            Bottom:20
        },
            
        Frame:  //子框架设置
        [
            {SplitCount:3,StringFormat:0},
            {SplitCount:2,StringFormat:0},
            {SplitCount:3,StringFormat:0},
        ],

        ExtendChart:    //扩展图形
        [
            //{Name:'MinuteTooltip' }  //手机端tooltip
        ],
    };

    return option;
}


export default 
{
    data() 
    {
        var data=
        {
            Symbol:'600000.sh',

            Minute:
            {
                JSChart:null,
                Option:DefaultData.GetMinuteOption(),
            }
        };

        return data;

    },

    created()
    {
        
    },

    mounted()
    {
        this.OnSize();

        window.onresize = ()=> { this.OnSize(); }

        this.CreateMinuteChart();
    },
        
    methods:
    {
        OnSize()
        {
            var chartHeight = window.innerHeight-30;
            var chartWidth = window.innerWidth-30;


            var minute=this.$refs.minute;
            minute.style.width=chartWidth+'px';
            minute.style.height=chartHeight+'px';
        },

        CreateMinuteChart() //创建日线图
        {
            if (this.Minute.JSChart) return;
            this.Minute.Option.Symbol=this.Symbol;
            let chart=HQChart.Chart.JSChart.Init(this.$refs.minute);
            chart.SetOption(this.Minute.Option);
            this.Minute.JSChart=chart;
        },
    }
}

```

## VUE创建K线图用例

```js
<template>

    <div id="app2">
        <div id="kline" ref='kline'></div>
    </div>

</template>

<script>
  
import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'

function DefaultData(){}

DefaultData.GetKLineOption = function () 
{
    let data = 
    {
        Type: '历史K线图', 
        
        Windows: //窗口指标
        [
            {Index:"MA",Modify: false, Change: false}, 
            {Index:"VOL",Modify: false, Change: false}
        ], 

        IsShowCorssCursorInfo:true,

        Border: //边框
        {
            Left:   1,
            Right:  1, //右边间距
            Top:    25,
            Bottom: 25,
        },

        KLine:
        {
            Right:1,                            //复权 0 不复权 1 前复权 2 后复权
            Period:0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
            PageSize:70,
            IsShowTooltip:true
        },
        
    };

    return data;
}

export default 
{
    data() 
    {
        var data=
        {
            Symbol:'600000.sh',
            KLine: 
            {
                JSChart:null,
                Option:DefaultData.GetKLineOption(),
            },

        };

        return data;

    },

    created()
    {
        
    },

    mounted()
    {
        this.OnSize();

        window.onresize = ()=> { this.OnSize(); }

       this.CreateKLineChart(); 
    },
        
    methods:
    {
        OnSize()
        {
            var chartHeight = window.innerHeight-30;
            var chartWidth = window.innerWidth-30;

            var kline=this.$refs.kline;
            kline.style.width=chartWidth+'px';
            kline.style.height=chartHeight+'px';
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize();
        },

        CreateKLineChart()  //创建K线图
        {
            if (this.KLine.JSChart) return;
            this.KLine.Option.Symbol=this.Symbol;
            let chart=HQChart.Chart.JSChart.Init(this.$refs.kline);
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart=chart;
        },

    }
}

```

# React用例
## React创建k线图用例
```js
import React from 'react';
import HQChart from 'hqchart';

class kline extends React.Component {
    constructor(props) { //构造函数
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.state = {
            Symbol:'600000.sh',
            KLine: 
            {
                JSChart:null,
                Option:{
                    Symbol:'',
                    Type: '历史K线图', 
                    
                    Windows: //窗口指标
                    [
                        {Index:"MA",Modify: false, Change: false}, 
                        {Index:"VOL",Modify: false, Change: false}
                    ], 
             
                    IsShowCorssCursorInfo:true,
             
                    Border: //边框
                    {
                        Left:   1,
                        Right:  1, //右边间距
                        Top:    25,
                        Bottom: 25,
                    },
             
                    KLine:
                    {
                        Right:1,                            //复权 0 不复权 1 前复权 2 后复权
                        Period:0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
                        PageSize:70,
                        IsShowTooltip:true
                    }
                    
                }
            }
        }
    }
    initCanvas() {

        if (this.state.KLine.JSChart) return;

        this.state.KLine.Option.Symbol=this.state.Symbol;
        let chart=HQChart.Chart.JSChart.Init(document.getElementById("time_graph_canvas"));
        chart.SetOption(this.state.KLine.Option);
        this.state.KLine.JSChart=chart;
    }

    componentDidMount() {
        this.initCanvas()
    }
    
    componentDidUpdate() {
        this.initCanvas()
    }
    render() {
        var chartHeight = window.innerHeight-30;
        var chartWidth = window.innerWidth-30;
        var styleText = {
            width: chartWidth+'px', 
            height: chartHeight+'px',
        };
        return (
          <div style={styleText} id="time_graph_canvas">
          </div>
        )
      }
}

export default kline;
```
## React创建走势图用例
```js
import React from 'react';
import HQChart from 'hqchart';

class minute extends React.Component {
    constructor(props) { //构造函数
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.state = {
            Symbol:'600000.sh',
            Minute:
            {
                JSChart:null,
                Option:{
                    Type:'分钟走势图',   //创建图形类型
                    Symbol:'',
                    Windows: //窗口指标
                    [
                        
                    ], 
                        
                    IsAutoUpdate:true,       //是自动更新数据
                    DayCount:1,                 //1 最新交易日数据 >1 多日走势图
                    IsShowCorssCursorInfo:true, //是否显示十字光标的刻度信息
                    IsShowRightMenu:true,       //是否显示右键菜单
                    CorssCursorTouchEnd:true,
            
                    MinuteLine:
                    {
                        //IsDrawAreaPrice:false,      //是否画价格面积图
                    },
            
                    Border: //边框
                    {
                        Left:1,    //左边间距
                        Right:1,   //右边间距
                        Top:20,
                        Bottom:20
                    },
                        
                    Frame:  //子框架设置
                    [
                        {SplitCount:3,StringFormat:0},
                        {SplitCount:2,StringFormat:0},
                        {SplitCount:3,StringFormat:0},
                    ],
            
                    ExtendChart:    //扩展图形
                    [
                        //{Name:'MinuteTooltip' }  //手机端tooltip
                    ],
                }
            }
        }
    }
    initCanvas() {

        if (this.state.Minute.JSChart) return;

        this.state.Minute.Option.Symbol=this.state.Symbol;
        let chart=HQChart.Chart.JSChart.Init(document.getElementById("time_graph_canvas"));
        chart.SetOption(this.state.Minute.Option);
        this.state.Minute.JSChart=chart;
    }

    componentDidMount() {
        this.initCanvas()
    }
    
    componentDidUpdate() {
        this.initCanvas()
    }
    render() {
        var chartHeight = window.innerHeight-30;
        var chartWidth = window.innerWidth-30;
        var styleText = {
            width: chartWidth+'px', 
            height: chartHeight+'px',
        };
        return (
          <div style={styleText} id="time_graph_canvas">
          </div>
        )
      }
}

export default minute;
```
