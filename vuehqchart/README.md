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


# 3. 网页demo  <br>
* [K线图](https://opensource2.zealink.com/hqweb/demo/phone7.html)  <br>
* [走势图](https://opensource2.zealink.com/hqweb/demo/phone8.html)  <br>
* [走势图手机页面](https://opensource2.zealink.com/hqweb/demo/phone2.html)  <br>
* [K线图手机页面](https://opensource2.zealink.com/hqweb/demo/phone.html)  <br>
* [横版走势图手机页面](https://opensource2.zealink.com/hqweb/demo/phone10.html)  <br>
* [横版K线图手机页面](https://opensource2.zealink.com/hqweb/demo/phone9.html)  <br>
* [多日走势图](https://opensource2.zealink.com/hqweb/demo/phone15.html) <br>
* [个股筹码图](https://opensource2.zealink.com/hqweb/demo/phone18.html) <br>
* [指标回测(手机版)](https://opensource2.zealink.com/hqweb/operatebsh5/index.html?symbol=000001.sz) <br>
* [手机K线训练](https://opensource2.zealink.com/hqweb/demo/demo_ktrain.html) <br>
* [手机K线训练横屏](https://opensource2.zealink.com/hqweb/demo/demo_ktrain2.html) <br>
* [弹幕功能](https://opensource2.zealink.com/hqweb/demo/phone21.html) <br>
* [多指标叠加](https://opensource2.zealink.com/hqweb/demo/phone22.html) <br>
* [截面数据(财务数据)计算器](https://opensource2.zealink.com/hqweb/demo/sectiondatatest.html) <br>
* [走势图-大盘异动](https://opensource2.zealink.com/hqweb/demo/phone23.html) <br>
* [分笔K线图](https://opensource2.zealink.com/hqweb/demo/phone24.html) <br>
* 小程序demo 请搜索 ‘知临信息软件及数据服务介绍’ 或微信扫描 ![二维码](/小程序行情模块用例/image/wechatrcode.jpg)


# 4.使用教程
## H5教程
1. [HQChart使用教程1-如何快速创建一个K线图页面](https://blog.csdn.net/jones2000/article/details/90272733) <br>
2. [HQChart使用教程2-如何把自定义指标显示在K线图页面](https://blog.csdn.net/jones2000/article/details/90273684) <br>
3. [HQChart使用教程3-如何把指标上锁显示在K线图页面](https://blog.csdn.net/jones2000/article/details/90285723) <br>
4. [HQChart使用教程4-如何自定义K线图颜色风格](https://blog.csdn.net/jones2000/article/details/90286933) <br>
5. [HQChart使用教程5-K线图控件操作函数说明](https://blog.csdn.net/jones2000/article/details/90301000) <br>
6. [HQChart使用教程6-如何获取K线图上的指标数据进行回测](https://blog.csdn.net/jones2000/article/details/90314625) <br>
7. [HQChart使用教程7-如何快速创建一个分时图页面](https://blog.csdn.net/jones2000/article/details/90319619) <br>
8. [HQChart使用教程9-如何快速创建K线训练页面](https://blog.csdn.net/jones2000/article/details/90478687) <br>
9. [HQChart使用教程10-手机端页面设置的几个特殊属性](https://blog.csdn.net/jones2000/article/details/90727468) <br>
10. [HQChart使用教程11-如何把K线数据API替换成自己的API数据](https://blog.csdn.net/jones2000/article/details/90747715) <br>
11. [HQChart使用教程8-如何快速创建一个横屏分时图页面](https://blog.csdn.net/jones2000/article/details/90453776) <br>
12. [HQChart使用教程14-分析家语法执行器](https://blog.csdn.net/jones2000/article/details/93731637) <br>
13. [HQChart使用教程13-5分钟完成一个小程序K线图](https://blog.csdn.net/jones2000/article/details/91471252) <br>
14. [HQChart使用教程12-如何在K线图上添加弹幕](https://blog.csdn.net/jones2000/article/details/91125408) <br>
15. [HQChart使用教程15-分析家语法执行器python版本](https://blog.csdn.net/jones2000/article/details/94738592) <br>
16. [HQChart使用教程16-py中使用麦语言指标可视化](https://blog.csdn.net/jones2000/article/details/94920596) <br>
17. [HQChart使用教程17-多技术指标独立坐标叠加](https://blog.csdn.net/jones2000/article/details/95618901) <br>
18. [HQChart使用教程18-K线截图](https://blog.csdn.net/jones2000/article/details/95738306) <br>
19. [HQChart使用教程19-基于HQChart的后台单股票指标计算服务](https://blog.csdn.net/jones2000/article/details/96479448) <br>
20. [HQChart使用教程20-单股票截面数据(财务数据)计算器](https://blog.csdn.net/jones2000/article/details/97135592) <br>
21. [HQChart使用教程21-十字光标设置说明](https://blog.csdn.net/jones2000/article/details/97682466) <br>
22. [HQChart使用教程22-如何创建移动筹码图](https://blog.csdn.net/jones2000/article/details/97928892) <br>
23. [HQChart使用教程23-Y轴刻度显示设置](https://blog.csdn.net/jones2000/article/details/98320020) <br>
24. [HQChart使用教程24-多语言设置](https://blog.csdn.net/jones2000/article/details/98734091) <br>
25. [HQChart使用教程25-叠加多个品种设置](https://blog.csdn.net/jones2000/article/details/98878463) <br>
26. [HQChart使用教程26-K线图及走势图数据自动更新设置](https://blog.csdn.net/jones2000/article/details/99483328) <br>
27. [HQChart使用教程27-动态设置K线图指标模板](https://blog.csdn.net/jones2000/article/details/100079989) <br>
28. [HQChart使用教程28-如何创建系统指标](https://blog.csdn.net/jones2000/article/details/100103486) <br>
29. [HQChart使用教程31-走势图异动数据设置](https://blog.csdn.net/jones2000/article/details/100191957) <br>
30. [HQChart使用教程32-如何K线图显示自定义SVG矢量图标](https://blog.csdn.net/jones2000/article/details/100613634) <br>
33. [HQChart使用教程39-指标中如何绘制文本分割线](https://blog.csdn.net/jones2000/article/details/101487482) <br>
34. [HQChart使用教程40-如何自定义分钟周期或日线周期K线](https://blog.csdn.net/jones2000/article/details/101722958) <br>
35. [HQChart使用教程41-分钟K线设置拖拽自动下载历史数据](https://blog.csdn.net/jones2000/article/details/102471720) <br>
36. [HQChart使用教程42-K线图如何对接数字货币](https://blog.csdn.net/jones2000/article/details/102493905) <br>
37. [HQChart使用教程43-日K线设置拖拽自动下载历史数据](https://blog.csdn.net/jones2000/article/details/102511317) <br>
38. [HQChart使用教程45-如何动态修改指标参数](https://blog.csdn.net/jones2000/article/details/102594672) <br>
39. [HQChart使用教程46-分钟周期数据计算外部接口](https://blog.csdn.net/jones2000/article/details/102628045) <br>
40. [HQChart使用教程47-如何自定义右键菜单](https://blog.csdn.net/jones2000/article/details/102720671) <br>
41. [HQChart使用教程48-如何自定义X轴刻度](https://blog.csdn.net/jones2000/article/details/102741428) <br>
42. [HQChart使用教程49-指标配置项说明](https://blog.csdn.net/jones2000/article/details/102928907) <br>
43. [HQChart使用教程50-Y轴自定义刻度设置说明](https://blog.csdn.net/jones2000/article/details/103174483) <br>
44. [HQChart使用教程51-指标切换按钮事件说明-h5版本](https://blog.csdn.net/jones2000/article/details/103187576) <br>
45. [HQChart使用教程52-自定义手机端K线图Tooltip](https://blog.csdn.net/jones2000/article/details/103820718) <br>
46. [HQChart使用教程53-log日志输出控制](https://blog.csdn.net/jones2000/article/details/104122774) <br>
47. [HQChart使用教程54-K线缩放控制按钮接口说明](https://blog.csdn.net/jones2000/article/details/104346016) <br>
48. [HQChart使用教程55-自定义PC端K线图Tooltip](https://blog.csdn.net/jones2000/article/details/104443471) <br>
49. [HQChart使用教程56-内置品种对应后缀列表说明](https://blog.csdn.net/jones2000/article/details/104457569) <br>
50. [HQChart使用教程57-如何调整K线的柱子缩放大小](https://blog.csdn.net/jones2000/article/details/104817724)<br>
51. [HQChart使用教程58-如何在K线右侧绘制面积图(如深度图)](https://blog.csdn.net/jones2000/article/details/105026997)<br>
52. [HQChart使用教程59-跨周期跨股票函数STKINDI使用说明](https://blog.csdn.net/jones2000/article/details/105401909)<br>
53. [HQChart使用教程60-新版k线训练使用教程](https://blog.csdn.net/jones2000/article/details/105760924)<br>
54. [HQChart使用教程61-画图工具接口使用教程](https://blog.csdn.net/jones2000/article/details/105835428)<br>
55. [HQChart使用教程62-品种小数位数设置](https://blog.csdn.net/jones2000/article/details/106592730)<br>
56. [HQChart使用教程64-前端自定义周期算法接口](https://blog.csdn.net/jones2000/article/details/107633707)<br>
57. [HQChart使用教程65-设置指标输出动态变量名](https://blog.csdn.net/jones2000/article/details/108675254)<br>
58. [HQChart使用教程66-自定义数据下载文字提示效果](https://blog.csdn.net/jones2000/article/details/109007027)<br>
59. [HQChart使用教程67-鼠标点击K线柱子监听事件](https://blog.csdn.net/jones2000/article/details/109119390)<br>
60. [HQChart使用教程68-配置DRAWTEXT,DRAWICON,DRAWNUMBER字体大小](https://blog.csdn.net/jones2000/article/details/109244069)<br>
61. [HQChart使用教程69-获取指定股票的K线数据](https://blog.csdn.net/jones2000/article/details/111736960)<br>
62. [HQChart使用教程70 -通达信语法检测/指标翻译](https://blog.csdn.net/jones2000/article/details/112998609)<br>
63. [HQChart使用教程71-如何自定义Y轴刻度线](https://blog.csdn.net/jones2000/article/details/113666565)<br>
64. [HQChart使用教程72-画图工具波浪尺刻度配置](https://blog.csdn.net/jones2000/article/details/113923817)<br>
65. [HQChart使用教程73-使用Vue3.0创建HQChart图形](https://blog.csdn.net/jones2000/article/details/114954091)<br>
66. [HQChart使用教程74-使用快速创建数字币深度图](https://blog.csdn.net/jones2000/article/details/115322752)<br>
67. [HQChart使用教程75-K线图鼠标单击事件接口](https://blog.csdn.net/jones2000/article/details/115707759)<br>
68. [HQChart使用教程76-K线图手势事件接口](https://blog.csdn.net/jones2000/article/details/115862159)<br>
69. [HQChart使用教程77-Y轴刻度文字创建事件回调](https://blog.csdn.net/jones2000/article/details/116376898)<br>
70. [HQChart使用教程78-分时图集合竞价](https://blog.csdn.net/jones2000/article/details/116523681)<br>
71. [HQChart使用教程79-异常处理接口](https://blog.csdn.net/jones2000/article/details/117524401)<br>
72. [HQChart使用教程80-自定义指标标题信息](https://blog.csdn.net/jones2000/article/details/117803420)<br>
73. [HQChart使用教程81-自定义指标窗口高度](https://jones2000.blog.csdn.net/article/details/118652171)<br>
74. [HQChart使用教程82-动态修改叠加指标参数](https://jones2000.blog.csdn.net/article/details/118681399)<br>
75. [HQChart使用教程83-K线图最高最低价显示配置](https://jones2000.blog.csdn.net/article/details/118856130)<br>
76. [HQChart使用教程84-十字光标右侧按钮事件](https://jones2000.blog.csdn.net/article/details/120562697)<br>
77. [HQChart使用教程85-股票复权计算](https://jones2000.blog.csdn.net/article/details/120700837)<br>
78. [HQChart使用教程86-技术指标OX图](https://jones2000.blog.csdn.net/article/details/122635700)<br>
79. [HQChart使用教程87-HQChart在VUE插件模式下源码调试配置](https://blog.csdn.net/jones2000/article/details/122759837)<br>
80. [HQChart使用教程88-DRAWTEXT添加背景色及边框](https://blog.csdn.net/jones2000/article/details/123132528)<br>
81. [HQChart使用教程89-最后一根k线倒计时功能](https://jones2000.blog.csdn.net/article/details/123674077)<br>
82. [HQChart使用教程90-DRAWTEXT添加连线](https://blog.csdn.net/jones2000/article/details/123750892)<br>
83. [HQChart使用教程91-如何在app中使用DRAWICON绘制图片](https://jones2000.blog.csdn.net/article/details/124140916)<br>
84. [HQChart使用教程92-如何创建分笔明细表](https://blog.csdn.net/jones2000/article/details/124360747)<br>
85. [HQChart使用教程94-如何创建报价列表](https://blog.csdn.net/jones2000/article/details/124544643)<br>

##  微信小程序教程
1. [HQChart小程序教程1-如何快速的创建一个K线图](https://developers.weixin.qq.com/community/develop/article/doc/0006c451ac81589915b89d1c55bc13) <br>
2. [HQChart小程序教程2-如何使用新版2D画布创建一个K线图](https://blog.csdn.net/jones2000/article/details/105632095)<br>
3. [HQChart小程序教程3-新版2D单画布如何切换K线图和分时图](https://blog.csdn.net/jones2000/article/details/108378355)<br>

## 钉钉小程序
1. [HQChart钉钉小程序教程1-创建K线图](https://blog.csdn.net/jones2000/article/details/125226287)<br>

## uni-app教程
1. [HQChart使用教程79-uniapp中hqchart内置组件使用教程](https://blog.csdn.net/jones2000/article/details/116592718)<br>
2. [HQChart使用教程35-如何在uni-app创建K线图(h5)](https://blog.csdn.net/jones2000/article/details/101039026) <br>
3. [HQChart使用教程36-如何在uni-app创建走势图(h5)](https://blog.csdn.net/jones2000/article/details/101039673) <br>
4. [HQChart使用教程37-如何在uni-app创建k线图(app)](https://blog.csdn.net/jones2000/article/details/101075683) <br>
5. [HQChart使用教程38-如何在uni-app创建走势图(app)](https://blog.csdn.net/jones2000/article/details/101481960) <br>
6. [HQChart使用教程44-uniapp使用条件编译同时支持h5,app,小程序](https://blog.csdn.net/jones2000/article/details/102529190) <br>
7. [HQChart使用教程60-解决uniapp-app页面隐藏后在显示白屏的问题](https://blog.csdn.net/jones2000/article/details/105484202) <br>
8. [HQChart使用教程63-uniapp使用renderjs+hqchart(h5)](https://blog.csdn.net/jones2000/article/details/106933985)<br>
9. [HQChart实战教程40-如何制作hqchart组件(uniapp版本)](https://blog.csdn.net/jones2000/article/details/116034602)<br>

## 第3方数据前端接入教程(走势图)
1. [HQChart使用教程29-走势图如何对接第3方数据1](https://blog.csdn.net/jones2000/article/details/100132357) <br>
2. [HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据](https://blog.csdn.net/jones2000/article/details/100149703) <br>
3. [HQChart使用教程29-走势图如何对接第3方数据3-多日分时数据](https://blog.csdn.net/jones2000/article/details/100150842) <br>
4. [HQChart使用教程29-走势图如何对接第3方数据4-叠加股票分时数据](https://blog.csdn.net/jones2000/article/details/100167703) <br>
5. [HQChart使用教程29-走势图如何对接第3方数据4-异动提示信息](https://blog.csdn.net/jones2000/article/details/100516071) <br>
6. [HQChart使用教程29-走势图如何对接第3方数据5-指标数据](https://blog.csdn.net/jones2000/article/details/102426337) <br>
7. [HQChart使用教程29-走势图如何对接第3方数据6-websocket分钟数据](https://blog.csdn.net/jones2000/article/details/102568258) <br>
8. [HQChart使用教程29-走势图如何对接第3方数据7-叠加股票最新分时数据](https://blog.csdn.net/jones2000/article/details/110525351) <br>
9. [HQChart使用教程29-走势图如何对接第3方数据8-量比数据](https://blog.csdn.net/jones2000/article/details/124286883)<br>

## 第3方数据前端接入教程(K线图)
1. [HQChart使用教程30-K线图如何对接第3方数据1](https://blog.csdn.net/jones2000/article/details/100181279) <br>
2. [HQChart使用教程30-K线图如何对接第3方数据2-日K数据](https://blog.csdn.net/jones2000/article/details/100552022) <br>
3. [HQChart使用教程30-K线图如何对接第3方数据3-1分钟K数据](https://blog.csdn.net/jones2000/article/details/100557649) <br>
4. [HQChart使用教程30-K线图如何对接第3方数据4-流通股本数据](https://blog.csdn.net/jones2000/article/details/100574186) <br>
5. [HQChart使用教程30-K线图如何对接第3方数据5-指标数据](https://blog.csdn.net/jones2000/article/details/100579223) <br>
6. [HQChart使用教程30-K线图如何对接第3方数据6-分笔K线数据](https://blog.csdn.net/jones2000/article/details/100671849) <br>
7. [HQChart使用教程30-K线图如何对接第3方数据7-日K数据分页下载](https://blog.csdn.net/jones2000/article/details/101275824)<br>
8. [HQChart使用教程30-K线图如何对接第3方数据8-1分钟K线数据分页下载](https://blog.csdn.net/jones2000/article/details/101277092) <br>
9. [HQChart使用教程30-K线图如何对接第3方数据9-BS指标数据](https://blog.csdn.net/jones2000/article/details/101350429) <br>
10. [HQChart使用教程30-K线图如何对接第3方数据10-如何绘制自定义线段或多边行指标数据](https://blog.csdn.net/jones2000/article/details/101694618)<br>
11. [HQChart使用教程30-K线图如何对接第3方数据11-如何绘制多组自定义图标](https://blog.csdn.net/jones2000/article/details/101757384) <br>
12. [HQChart使用教程30-K线图如何对接第3方数据12-如何在指标中绘制文字](https://blog.csdn.net/jones2000/article/details/101864046) <br>
13. [HQChart使用教程30-K线图如何对接第3方数据13-使用websocket更新最新K线数据](https://blog.csdn.net/jones2000/article/details/102138784) <br>
14. [HQChart使用教程30-K线图如何对接第3方数据14-轮询增量更新日K数据](https://blog.csdn.net/jones2000/article/details/102518334) <br>
15. [HQChart使用教程30-K线图如何对接第3方数据15-轮询增量更新1分钟K线数据](https://blog.csdn.net/jones2000/article/details/102518422) <br>
16. [HQChart使用教程30-K线图如何对接第3方数据16-日K叠加股票](https://blog.csdn.net/jones2000/article/details/102661873) <br>
17. [HQChart使用教程30-K线图如何对接第3方数据17-分钟K叠加股票](https://blog.csdn.net/jones2000/article/details/102887690) <br>
18. [HQChart使用教程30-K线图如何对接第3方数据18-如何绘制自定义柱子](https://blog.csdn.net/jones2000/article/details/104417736)<br>
19. [HQChart使用教程30-K线图如何对接第3方数据19-如何绘制彩色K线柱](https://blog.csdn.net/jones2000/article/details/104859784)<br>
20. [HQChart使用教程30-K线图如何对接第3方数据20-信息公告数据](https://blog.csdn.net/jones2000/article/details/105876161)<br>
21. [HQChart使用教程30-K线图如何对接第3方数据21-跨周期函数数据](https://blog.csdn.net/jones2000/article/details/109063625)<br>
22. [HQChart使用教程30-K线图如何对接第3方数据22-FINVALUE函数数据](https://blog.csdn.net/jones2000/article/details/111387095)<br>
23. [HQChart使用教程30-K线图如何对接第3方数据23-FINANCE函数数据](https://blog.csdn.net/jones2000/article/details/111999910)<br>
24. [HQChart使用教程30-K线图如何对接第3方数据24-如何填充K线背景色](https://blog.csdn.net/jones2000/article/details/112342980)<br>
25. [HQChart使用教程30-K线图如何对接第3方数据25-指标脚本自定义变量](https://blog.csdn.net/jones2000/article/details/112755911)<br>
26. [HQChart使用教程30-K线图如何对接第3方数据26-指标脚本自定义函数](https://blog.csdn.net/jones2000/article/details/112809781)<br>
27. [HQChart使用教程30-K线图如何对接第3方数据27-如何在指标中渲染DOM元素](https://blog.csdn.net/jones2000/article/details/114006164)<br>
28. [HQChart使用教程30-K线图如何对接第3方数据28-大盘数据](https://blog.csdn.net/jones2000/article/details/117712105)<br>
29. [HQChart使用教程30-K线图如何对接第3方数据29-板块字符串函数数据](https://jones2000.blog.csdn.net/article/details/118887416)<br>
30. [HQChart使用教程30-K线图如何对接第3方数据30-即时行情数据DYNAINFO](https://jones2000.blog.csdn.net/article/details/120276612)<br>
31. [HQChart使用教程30-K线图如何对接第3方数据31-获取指定品种的K线数据](https://blog.csdn.net/jones2000/article/details/122391707)<br>
32. [HQChart使用教程30-K线图如何对接第3方数据32-订单流](https://jones2000.blog.csdn.net/article/details/122888661)<br>
33. [HQChart使用教程30-K线图如何对接第3方数据33-日线叠加品种拖拽下载历史数据](https://blog.csdn.net/jones2000/article/details/123211234)<br>
34. [HQChart使用教程30-K线图如何对接第3方数据34-分钟K线叠加品种拖拽下载历史数据](https://blog.csdn.net/jones2000/article/details/123211941)<br>
35. [HQChart使用教程30-K线图如何对接第3方数据35-固定范围成交量分布图数据](https://blog.csdn.net/jones2000/article/details/125020448)<br>


## 第3方数据前端接入教程(分笔明细)
1. [HQChart使用教程93-分笔明细表对接第3方数据1-全量分笔明细数据](https://blog.csdn.net/jones2000/article/details/124362666)<br>
2. [HQChart使用教程93-分笔明细表对接第3方数据2-增量分笔明细数据](https://jones2000.blog.csdn.net/article/details/124362858)<br>

## 第3方数据前端接入教程(报价列表)
1. [HQChart使用教程95-报价列表对接第3方数据1-码表数据](https://jones2000.blog.csdn.net/article/details/124567637)<br>
2. [HQChart使用教程95-报价列表对接第3方数据2-板块成分数据](https://jones2000.blog.csdn.net/article/details/124572386)<br>
3. [HQChart使用教程95-报价列表对接第3方数据3-股票数据](https://jones2000.blog.csdn.net/article/details/124578516)<br>
4. [HQChart使用教程95-报价列表对接第3方数据4-股票排序数据](https://jones2000.blog.csdn.net/article/details/124579725)<br>

## 实战教程
1. [HQChart实战教程1-外汇分时图](https://blog.csdn.net/jones2000/article/details/103254501) <br>
2. [HQChart实战教程2-使用跨周期写指标](https://blog.csdn.net/jones2000/article/details/103275668) <br>
3. [HQChart实战教程3-http+ws对接分钟K线数据](https://blog.csdn.net/jones2000/article/details/103882063) <br>
4. [HQChart实战教程4-http+ws对接日K线数据](https://blog.csdn.net/jones2000/article/details/103966271) <br>
5. [HQChart实战教程5-http+ws对接单日分时图数据](https://blog.csdn.net/jones2000/article/details/103966925) <br>
6. [HQChart实战教程6-自定义分时图](https://blog.csdn.net/jones2000/article/details/104165374) <br>
7. [HQChart实战教程7-自定义显示手势点击K线显示信息](https://blog.csdn.net/jones2000/article/details/104168610) <br>
8. [HQChart实战教程8-如何手动重新初始化hqchart](https://blog.csdn.net/jones2000/article/details/105302626)<br>
9. [HQChart实战教程9-自定义A股分时图](https://blog.csdn.net/jones2000/article/details/105587559) <br>
10. [HQChart实战教程14-K线图对接第3方http/https数据教程整理](https://blog.csdn.net/jones2000/article/details/106064879)<br>
11. [HQChart实战教程17-K线沙盘推演](https://blog.csdn.net/jones2000/article/details/106776837) <br>
12. [HQChart实战教程18-多股同列](https://blog.csdn.net/jones2000/article/details/107193410)<br>
13. [HQChart实战教程45-自定义指标窗口背景](https://jones2000.blog.csdn.net/article/details/119886468)<br>

## 火币对接完整教程（付费文章）
1. [HQChart实战教程10-全ws数据对接HQChart(数字货币对接实战)](https://blog.csdn.net/jones2000/article/details/105698038) <br>
2. [HQChart实战教程11-火币网ws数据对接](https://blog.csdn.net/jones2000/article/details/105721190) <br>
3. [HQChart实战教程12-火币网ws数据对接分时图](https://blog.csdn.net/jones2000/article/details/105756659) <br>
4. [HQChart实战教程13-火币网ws数据对接K线（uniapp)](https://blog.csdn.net/jones2000/article/details/105804461)<br>
5. [HQChart实战教程15-火币网ws数据对接拖拽下载历史K线图](https://blog.csdn.net/jones2000/article/details/106205584)<br>
6. [HQChart实战教程16-K线图风格配色篇-仿火币网H5配色](https://blog.csdn.net/jones2000/article/details/106226272)<br>
7. [HQChart实战教程47-火币网ws数据对接深度图](https://jones2000.blog.csdn.net/article/details/120950486)<br>

## 欧易对接完整教程（付费文章)
1. [HQChart实战教程54-欧易网http+ws数据对接(vue)](https://blog.csdn.net/jones2000/article/details/125213143)<br>
2. [HQChart实战教程55-欧易网K线面积图(vue)](https://jones2000.blog.csdn.net/article/details/125229954)<br>
3. [HQChart实战教程56-欧易网http+ws数据对接 uniapp版本](https://blog.csdn.net/jones2000/article/details/125354005)<br>

## 源码收费
1. [HQChart实战教程36-数字货币币安对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/114468807)<br>
2. [HQChart实战教程41-新浪+腾讯A股数据源对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/117139756)<br>
3. [HQChart实战教程42-新浪期货数据源对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/117757956)<br>
4. [股票当日分时图例子,使用东方财富网页数据](https://download.csdn.net/download/jones2000/22589484)<br>
5. [股票5日分时图例子,使用东方财富网页数据](https://download.csdn.net/download/jones2000/22761465)<br>
6. [股票日K线图例子,使用东方财富网页数据](https://download.csdn.net/download/jones2000/27232461)<br>
7. [股票分钟K线图例子,使用东方财富网页数据](https://download.csdn.net/download/jones2000/27765290)<br>

## httpA股数据对接教程(付费文章)
### 日K线
1. [HQChart实战教程29-A股日K线数据对接-Vue版本](https://blog.csdn.net/jones2000/article/details/113099783)<br>
2. [HQChart实战教程30-A股日K线数据对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/113101342)<br>
3. [HQChart实战教程34-A股日K线数据对接-小程序版本](https://blog.csdn.net/jones2000/article/details/113577904)<br>
### 分钟K线
1. [HQChart实战教程31-A股分钟K线数据对接-Vue版本](https://blog.csdn.net/jones2000/article/details/113101407)<br>
2. [HQChart实战教程32-A股分钟K线数据对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/113101448)<br>
### 分时图
1. [HQChart实战教程33-A股分时图数据对接-Vue版本](https://blog.csdn.net/jones2000/article/details/113226866)<br>
2. [HQChart实战教程35-A股分时图数据对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/113777111)<br>
### 后台指标
1. [HQChart实战教程36-A股后台指标对接-uniapp版本](https://blog.csdn.net/jones2000/article/details/114991081)<br>
### 新浪接口对接
1. [HQChart实战教程37-新浪分钟K线数据对接-js版本](https://blog.csdn.net/jones2000/article/details/115388377)<br>
2. [HQChart实战教程38-新浪期货数据对接-js版本](https://blog.csdn.net/jones2000/article/details/115408971)<br>

## 高级应用实战教程(付费文章)
1. [HQChart实战教程19 - PC端分时图定制tooltip](https://blog.csdn.net/jones2000/article/details/108633991)<br>
2. [HQChart实战教程20 - PC端K线图定制tooltip](https://blog.csdn.net/jones2000/article/details/108639960)<br>
3. [HQChart实战教程21 - unapp app端分时图定制tooltip](https://blog.csdn.net/jones2000/article/details/108657043)<br>
4. [HQChart实战教程21 - uniapp app端K线图定制tooltip](https://blog.csdn.net/jones2000/article/details/108674679)<br>
5. [HQChart实战教程22 - PC端定制区间选择菜单](https://blog.csdn.net/jones2000/article/details/108907629)<br>
6. [HQChart实战教程23 - 点击K线显示历史分钟走势图](https://blog.csdn.net/jones2000/article/details/109127873)<br>
7. [HQChart实战教程24 - 自定义K线画图工具设置框（线段类）](https://blog.csdn.net/jones2000/article/details/109217719)<br>
8. [HQChart实战教程25 - 自定义K线画图工具设置框（文字类）](https://blog.csdn.net/jones2000/article/details/109267078)<br>
9. [HQChart实战教程30 - 配置K线画图](https://blog.csdn.net/jones2000/article/details/113819121)<br>
10. [HQChart实战教程26 - K线画图工具增加自定义图标](https://blog.csdn.net/jones2000/article/details/109529224)<br>
11. [HQChart实战教程27 - 走势图最后一个数据增加动画点](https://blog.csdn.net/jones2000/article/details/111599341)<br>
12. [HQChart实战教程28 - 动态切换颜色风格](https://blog.csdn.net/jones2000/article/details/112563596)<br>
13. [HQChart实战教程29 - 指标参数保存到本地缓存](https://blog.csdn.net/jones2000/article/details/113349967)<br>
14. [HQChart实战教程39 - K线图键盘事件重载](https://blog.csdn.net/jones2000/article/details/115921430)<br>
15. [HQChart实战教程43 - K线面积图最后一个数据增加动画点](https://jones2000.blog.csdn.net/article/details/118774299)<br>
16. [HQChart实战教程44 - 多指标窗口动态增长高度](https://jones2000.blog.csdn.net/article/details/119188383)<br>
17. [HQChart实战教程46 - 十字光标右侧按钮点击增加刻度线](https://jones2000.blog.csdn.net/article/details/120563461)<br>
18. [HQChart实战教程48 - 远程指标获取当前屏K线的范围](https://jones2000.blog.csdn.net/article/details/121913369)<br>
19. [HQChart实战教程49 - 点击修改K线颜色及背景色](https://jones2000.blog.csdn.net/article/details/121938122)<br>
20. [HQChart实战教程50 - 自定义指标栏工具按钮](https://blog.csdn.net/jones2000/article/details/122950050)<br>
21. [HQChart实战教程51 - 自定义指标列表](https://blog.csdn.net/jones2000/article/details/123538617)<br>
22. [HQChart实战教程52 - APP中使用DRAWICON绘制图标](https://jones2000.blog.csdn.net/article/details/124142225)<br>
23. [HQChart实战教程53 - 动态指定标识K线区间段背景颜色](https://blog.csdn.net/jones2000/article/details/124558493)<br>

## HQChart报价列表高级应用教程(付费文章)
1. [HQChart报价列表高级应用教程1-雪球数据对接报价列表](https://blog.csdn.net/jones2000/article/details/124759574)<br>
2. [HQChart报价列表高级应用教程2-东方财富数据对接自选股列表](https://blog.csdn.net/jones2000/article/details/124940054)<br>


## 设计文档:
1. [如何(c++,js)写一个传统的K线图和走势图1](https://blog.csdn.net/jones2000/article/details/84779481) <br>
2. [如何(c++,js)写一个传统的K线图和走势图2-走势图](https://blog.csdn.net/jones2000/article/details/84840770) <br>
3. [如何(c++,js)写一个传统的K线图和走势图3-多指标窗口模式如何实现的](https://blog.csdn.net/jones2000/article/details/84979910) <br>
4. [如何(c++,js)写一个传统的K线图和走势图3-十字光标的绘制](https://blog.csdn.net/jones2000/article/details/85123680) <br>
5. [如何(c++,js)写一个传统的K线图和走势图4-K线图](https://blog.csdn.net/jones2000/article/details/85235463) <br>
6. [如何(c++,js)写一个传统的K线图和走势图5-移动筹码图](https://blog.csdn.net/jones2000/article/details/85356163) <br>

## HQChartPy2数据对接教程 (以tushare数据为例子)
1. [hqchartPy2数据对接教程1-K线数据](https://blog.csdn.net/jones2000/article/details/112060412)<br>
2. [hqchartPy2数据对接教程2-股本数据,筹码分布函数](https://blog.csdn.net/jones2000/article/details/112060761)<br>
3. [hqchartPy2数据对接教程3-FINANCE数据](https://blog.csdn.net/jones2000/article/details/112095070)<br>
4. [hqchartPy2数据对接教程4-DYNAINFO函数](https://blog.csdn.net/jones2000/article/details/112334485)<br>
5. [hqchartPy2数据对接教程5-引用指定股票数据函数](https://blog.csdn.net/jones2000/article/details/112335307)<br>
6. [hqchartPy2指标选股-KDJ选股](https://blog.csdn.net/jones2000/article/details/113667444)<br>

# 5.VUE 行情项目
[代码地址(vuehqchart)](/vuehqchart) <br>
![走势图2](/小程序行情模块用例/image/pch5hq.PNG)
[行情页面地址(v1.0）](https://opensource2.zealink.com/vuehqweb/hq.demo.page.html) <br><br>
![历史高频数据查询图2](/小程序行情模块用例/image/pch5history.PNG)
[查询页面地址](https://opensource2.zealink.com/vuehqweb/queryContent.demo.page.html) <br><br>
![多周期图2](/小程序行情模块用例/image/pch5hq2.png)
[多周期页面地址](https://opensource2.zealink.com/vuehqweb/stockmultiperiod.demo.page.html) <br><br>
![综合排名2](/小程序行情模块用例/image/pch5hq3.png)
[综合排名页面地址](https://opensource2.zealink.com/vuehqweb/stockmultiorder.demo.page.html) <br><br>
   
## 基于VUE版本给客户开发的样例
![PC行情页面](/小程序行情模块用例/image/hqchart_pc_demo1.png) <br>
[指数行情页面黑色风格](https://opensource2.zealink.com/cninfoHq/oneStockHq.html?symbol=000001.sh&colorType=black) <br>
[个股行情页面白色风格](https://opensource2.zealink.com/cninfoHq/oneStockHq.html?symbol=000001.sz) <br>
[代码地址(vue.demo/infoHqdemo)](/vue.demo/infoHqdemo) <br>

## VUE版本手机端样例1
![手机端行情页面](/小程序行情模块用例/image/hchart_phone_1.png) <br>
[手机端行情页面](https://opensource2.zealink.com/product/hqNewdemoH5/stockHq.html#/StockHq)<br>
[代码地址(vue.demo/hq_h5_pages)](/vue.demo/hq_h5_pages) <br>

## VUE版本手机端样例2 黑色风格
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_3.png) <br>
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_4.png) <br>
[手机端行情页面](https://opensource2.zealink.com/hqweb/hq_h5_demo_black/stockHq.html#/StockHq)<br>
[代码地址(vue.demo/hq_h5_pages)](/vue.demo/hq_h5_demo_black) <br>


## js页面样例
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_2.png) <br>
[个股详情手机端h5](https://opensource2.zealink.com/hqweb/hqpages/stockpage.html?) <br>
[代码地址(webhqchart.demo/h5demo)](/webhqchart.demo/h5demo) <br>
[VUE代码地址(vue.demo/stockpage_h5)](/vue.demo/stockpage_h5) <br>

## 第3方数据对接样例
1. 数字货币对接 <br>
   数据来源： https://www.coinzeus.io/cn <br>
   ![行情页面](/小程序行情模块用例/image/hqchart_bit_demo1.png) <br>
   [h5测试页面](https://opensource.zealink.com/hqweb/bitdemo/stockhq.html) <br>
   [代码地址(vue.demo/bitdemo)](/vue.demo/bitdemo) <br>

