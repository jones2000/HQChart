# 一、环境引入 HQChart


## 1.1 CDN 直接引入（纯 HTML 项目）
```html

<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hqchart/src/jscommon/umychart.resource/js/webfont.js"></script>
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

```

## 1.3 DOM 容器准备
图表必须挂载到一个DOM上 

```html
<div id="KLineCtrl"></div>

.......

<style>

 #KLineCtrl 
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

    NetworkFilter:(data, callback)=>
    { 
        //TODO:对接K线数据 
    }
    
}

chart.SetOption(option);

```

# 三、配置参数详解 SetOption

## 3.1 基础类型参数

|参数|取值|说明|类型|
|----|----|---- |----|
|Type  |   1."历史K线图" PC或手机竖屏使用<br> 2."历史K线图横屏" 手机横屏使用      |    图形属性名称 | 字符串 |
|Windows| 详见 3.2 指标窗口参数详解 | 窗口指标设置|  数组|
|Symbol|如 "600000.sh"|标的代码 | 字符串|
|IsAutoUpdate| true/false | 是否在交易时间段自动更新数据 | bool|
|AutoUpdateFrequency| 如 10000| 自动更新数据频率, 默认30s, 单位ms (可选)| bool|
|Language| 英文 'EN' 中文:'CN' 繁体:'TC'| UI语言(可选) |字符串 |
|IsApiPeriod| false=周期数据是前端合并<br> true=周期和复权数据都使用后台api数据| 周期和复权数据计算方式,默认false,(可选)|bool|
|CorssCursorInfo| 详见3.5 十字光标参数详解 | 十字光标设置| object|
|KLine| 详见3.6 K线主图参数详解 |K线主图设置| object|
|KLineTitle| 详见3.7 K线标题参数详解 |K线标题设置| object|
|SplashTitle| | 数据下载提示信息文字 (可选)| 字符串 |
|Border| 详见3.8 边框四周间距参数详解 | 边框四周间距设置 (可选)| object|
|Overlay| 详见3.9 叠加股票参数详解 |叠加股票 (可选)| 数组|
|OverlayIndex| 详见3.10 叠加指标参数详解 | 叠加指标 (可选)| 数组 |
|Frame| 详见3.11 指标窗口坐标参数详解 | 指标窗口坐标设置 (可选)| 数组 |
|StepPixel| | 移动一个K线需要的手势移动的像素(默认4) (可选)| 数值 |
|ZoomStepPixel| |缩放一次,2个手指需要移动的间距像素(默认5) (可选)| 数值 |
|SplashTitle| | 数据下载提示信息 默认是"数据加载中" (可选) | 字符串|
|EnableZoomIndexWindow| true/false | 双击缩放附图指标窗口大小 默认false.  (可选)|bool|
|CtrlMoveStep| | K线Ctrl+(left/right)快速移动步长,默认移动5个数据.  (可选)|数值 |
|EnableResize| true/false | 图形画布自适应div大小, 默认false. (可选)| bool |
|EnableZoomUpDown| EnableZoomUpDown:{ <br>Wheel:true/false 滚轴上下缩放K线,  <br>Keyboard:true/false 键盘上下键缩放K线,  <br>Touch:true/false 手势缩放k线 },| 允许缩放K线 | object|
|DragSelectRect| 详见3.13 区间选择参数详解| 区间选择 (可选)| object |
|PopMinuteChart| 详见3.14 双击弹出分时图参数详解| 双击弹出分时图 (可选)| object |
|EnableZoomIndexWindow| true/false | 双击附图放大图形  (可选)| bool |
|NetworkFilter| 如:NetworkFilter:(data, callback)=>{ //TODO:处理各种不同的K线数据 }  | 数据拦截回调|  回调函数|
|手机端属性|
|CorssCursorTouchEnd| true/false |手离开屏幕十字光标自动隐藏 | bool|
|IsClickShowCorssCursor| true/false | 手势点击出现十字光标| bool|
|EnableScrollUpDown| true/false |手势上下允许滚动页面 | bool|
|图形选中和拖动| 
|SelectedChart| SelectedChart:{ EnableSelected: true, EnableMoveOn:true }<br>EnableSelected 图形是否可以选中<br>EnableMoveOn 鼠标在图形上是否变成手形状 | 图形选中 | object|
|EnableIndexChartDrag| true/false | 是否开始图形拖动功能 | bool|



## 3.2 指标窗口参数详解 Windows
|参数|取值|说明|类型|
|----|----|---- |----|
|Index        | "MA" 或"VOL"| 系统指标ID | 字符串|
|TitleHeight  | 如 25  | 指标窗口标题栏高度 (可选)|  数值|
|StringFormat | 1 默认格式 2位小数, 如果数值太大会自动转化为万或亿<br>2 原始数据输出<br>3 整形数据输出, 如果数值不为整形， 就使用格式1<br>21 千分位分割   | 标题栏指标数值输出格式 (可选)|数值|
|TitleFont    |如 "8px 微软雅黑"|标题字体设置 (可选) |字符串|
|IsShortTitle | true/false | 指标标题缩写模式，只显示指标名字，隐藏指标参数.<br> 默认false, 指标名字是MA(5,10,15) 设置true后就只显示MA 后面的参数就不显示了 (可选)| bool |
|IsShowIndexName| true/false | 指标标题是否显示指标名称 (可选)| bool |
|IsShowOverlayIndexName| true/false | 指标标题是否显示叠加指标信息 (可选)| bool |
|IsDrawTitleBG| true/false | 指标标题中的指标名称是否增加背景色 (可选)| bool |
|IndexParamSpace| |指标标题中的指标参数显示间距(可选)|数值|
|IndexTitleSpace| |指标标题中的指标名称显示间距(可选)|数值|
|IsShowNameArrow| true/false | 指标标题中的指标名称后面是否显示"▼" (可选)| bool |
|IsShowTitleArrow| true/false | 指标标题中指标数值后面否是显示上涨下跌箭头"↑↓" (可选)| bool |
|TitleArrowType|0=独立颜色(默认值)<br>1=跟指标名字颜色一致 | 上涨下跌箭头类型 (可选)| 数值 |
|API| 详见3.3 后台API指标参数详解 |后台API指标| object|
|Lock| 详见3.4 指标锁参数详解 |指标锁 | object|
|自定义通达信指标|
|Name|如 "指标1" | 自定指标名称 | 字符串|
|Script|如 "T2:MA(C,10);" | 指标执行的脚本|字符串|
|IsMainIndex| true/false | 是否是主图指标 (可选) 默认false| bool |
|Args| 如: Args: [{ Name: 'N', Value: 10 }]  | 指标参数, Name:参数名称, Value:参数数值 | 数组 |
|OutName|如 ：OutName:[ <br>{Name:'MA1',DynamicName:"MA{M1}" }, <br> {Name:'MA2',DynamicName:"MA{M2}" },<br>{Name:'MA3',DynamicName:"MA{M3}"<br> }], |输出变量名称格式化 (可选), <br>Name:原始的输出变量名称, <br>DynamicName:替换的以后的格式 {参数名称} | 数组 |
|KLineType| -1 主图不显示K线(只在主图有效)<br> 0 在副图显示K线<br> 1 在副图显示K线(收盘价线)<br> 2在副图显示K线(美国线)<br>|指标中配置K线 (可选)|数值 |
|指标栏右侧按钮(只支持h5)|
|Modify | true/false | 是否显示修改指标参数按钮 (可选)| bool |
|Change |true/false | 是否显示切换指标按钮 (可选)| bool |
|Close |true/false | 是否显示关闭按钮 (可选)| bool |
|Overlay|true/false | 是否显示叠加指标按钮 (可选)| bool |
|Export|true/false | 是否显示导出数据按钮 (可选)| bool |
|MaxMin|true/false | 是否显示附图最大最小化按钮 (可选)| bool |
|TitleWindow|true/false | 是否显示附图标题栏模式按钮 (可选)| bool |
|IndexHelp|true/false | 是否显示帮助按钮 (可选)| bool |
|IndexAIAnalyze|true/false | 是否显示AI分析按钮 (可选)| bool |
|AddIndexWindow|true/false | 是否显示'增加指标窗口'按钮 (可选)| bool |


## 3.3 后台API指标参数详解 API
|参数|取值|说明|类型|
|----|----|---- |----|
|Name| 如 "指标1"| 指标名字| 字符串|
|ID | 如 "API_Index_01" | 指标ID| 字符串|
|Script| |指标脚本 (可选) | 字符串|
|Args| 如: Args: [{ Name: 'N', Value: 10 }] |指标参数, Name:参数名称, Value:参数数值 | 数组 |
|Url| 如: "http://127.0.0.1/API_Index_01" | 后台指标计算api地址 | 字符串|


## 3.4 指标锁参数详解 Lock
|参数|取值|说明|类型|
|----|----|---- |----|
|IsLocked| true/false | 是否上锁| bool|
|BG| |锁区域的背景颜色 (可选)| color |
|TextColor| |锁区域文字颜色()(可选)| color |
|Text| |锁区域显示文字 (可选)|字符串|
|Font| |锁区域文字字体 (可选)|字符串|
|Count| | 锁右边几根K线 (可选) |数值 |
|IsFullFrame| true/false | 是否锁住整个指标窗口 (可选)|bool|

## 3.5 十字光标参数详解 CorssCursorInfo

|参数|取值|说明|类型|
|----|----|---- |----|
|Left|0 隐藏<br> 1显示在框架外<br> 2显示在框架内<br>|左边的十字光标文字输出位置 (可选) | 数值 |
|Right|0 隐藏<br> 1 显示在框架外<br> 2 显示在框架内<br>|右边的十字光标文字输出位置 (可选) | 数值 |
|Bottom| 0 隐藏<br> 1 显示在框架外 |底部十字光标日期位子输出位置 (可选) | 数值 |
|IsShowCorss| true/false | 是否显示十字线 (可选) |bool|
|VPenType|  0 虚线<br> 1 实线<br> 2 实线线段宽度和K线一样 |垂直线类型 (可选) | 数值 |
|HPenType| 0 虚线<br> 1 实线<br> -1 隐藏| 水平线类型 (可选) | 数值 |
|IsShowClose | true/false | Y轴只能在K线收盘价移动 (可选) | 数值 |
|DateFormatType| 缺省0<br> 0 YYYY-MM-DD => 2020-12-01<br> 1 YYYY/MM/DD =>2020/12/01<br> 2 YYYY/MM/DD/W => 2020/12/01/二<br> 3 DD/MM/YYYY => 01/12/2020 |K线X轴日期显示格式 (可选) | 数值 |
|PriceFormatType| 0 默认 1 千分位分割| 主图Y轴文字 (可选) | 数值 |
|DataFormatType| 0 默认 1 千分位分割 | 副图Y轴文字 (可选) | 数值 |
|VLineType| 默认0<br> 0 标题栏不画竖线<br> 1 竖线不中断| X轴的竖线类型 (可选) | 数值 |
|EnableKeyboard| true/false | 是否支持键盘esc隐藏十字线, left, right显示十字线， 默认false  (可选) | bool|
|RightButton| RightButton:{ Enable:true/false } | 十字光标右侧按钮配置 (可选)| object|

## 3.6 K线主图参数详解 KLine

|参数|取值|说明|类型|
|----|----|---- |----|
|DragMode| 0 禁止拖拽 1 数据拖拽 | 拖拽模式 (可选) | 数值 |
|Right| 0 不复权 1 前复权 2 后复权 | 复权方式 (可选) | 数值 |
|Period| 0 日线<br> 1 周线<br> 2 月线<br> 3 年线<br> 9 季线<br> 4 1分钟<br> 5 5分钟<br> 6 15分钟<br> 7 30分钟<br> 8 60分钟<br> 11 120分钟<br> 12 240分钟<br>  10 分笔线<br>  20001-30000 自定义分钟<br> 40001-50000 自定义天数<br> 30001-32000 自定义秒 |周期 (可选) | 数值 |
|MaxRequestDataCount| |日线请求的最大个数  (可选) | 数值 |
|MaxRequestMinuteDayCount| |1分钟K线请求最大天数 (可选) | 数值 |
|PageSize| | 初始一屏显示多少个K线数据  (可选) | 数值 |
|DataWidth| | 初始一屏显示的K线宽度。K线个数由K线宽度内部计算得到 注意： PageSize / DataWidth 只能设置一模式 (可选)| 数值 |
|Info| 如: Info:["互动易","大宗交易",'龙虎榜',"调研","业绩预告","公告"] | 信息地雷, 可以放多个  (可选) | 数组|
|InfoPosition| 0 显示在K线上 1 显示底部 2 显示顶部 | 信息地雷显示位置 (可选) | 数组|
|IsShowTooltip| true/false | 是否显示内置tooltip, 包含k线提示信息，图标提示信息等等， h5支持  (可选) | bool|
|DrawType| 0 实心K线柱子<br> 1 收盘价线<br> 2 美国线<br> 3 空心K线柱子<br> 4 收盘价面积图<br> 5 订单流<br> 6完全空心K线柱子| K线类型 (可选) | 数值 |
|FirstShowDate| 如: FirstShowDate:20180401 | 首屏显示的起始日期 格式 yyyymmdd (可选) | 数值 |
|ZoomType| 1 以十字光标为中心缩放 | K线缩放方式 (可选) | 数值 |
|IsShowMaxMinPrice| true/false | K线上是否显示最大最小值 (可选) | bool |
|RightSpaceCount| | 最后数据和右边框空白间距,空白的宽度=RightSpaceCount*k线宽度 (可选) | 数值 |
|~~KLineDoubleClick~~| ~~true/false~~ |~~是否启动双击K线弹出内置分时对话框. 默认是开启 (可选) ~~| ~~bool~~|
|RightFormula| 0 简单复权， 1 使用复权系数（复权因子）计算复权 缺省为0 |内置复权算法类型,只有在IsApiPeriod=false的时候才会使用前端计算复权， 否在都是后台计算复权 (可选)|数值 |
|PriceGap| 如:PriceGap: { Enable:true, Count:3 } | 显示未回补缺口<br> Enable true=显示缺口 false=隐藏缺口<br> Count:显示缺口个数 | object|
|UnchangeBarType| 0 使用平盘的颜色<br>1 与昨收价比较 上涨红 下跌绿|十字星K线颜色 默认0 (可选)| 数值 |
|EnableDaySummary| true/false | 是否在K线图左侧底部显示当前屏K线的天数 (可选) | bool|

## 3.7 K线标题参数详解 KLineTitle

|参数|取值|说明|类型|
|----|----|---- |----|
|IsShowName| true/false |是否显示股票名称  (可选)|bool|
|IsShowSettingInfo| true/false |是否显示周期/复权 (可选)|bool|
|IsShowDateTime| true/false |标题栏是否显示日期和时间 (可选)|bool|
|IsTitleShowLatestData| true/false | 十字光标不在图形上， 标题栏显示最后一个数据， 默认(false) (可选)|bool|
|ShowPostion| 如: ShowPostion:{ Margin:{ Bottom:10, Left:10 } }<br>Margin.Bottom 底部间距<br> Margin.Left 左边间距 | 标题栏文字输出位置高级设置  (可选)| object|


## 3.8 边框四周间距参数详解 Border

|参数|取值|说明|类型|
|----|----|---- |----|
|Left| | 左间距|  数值 |
|Right| | 右间距|数值 |
|Bottom| | 底部间距|数值 |
|Top| | 顶部间距|数值 |
|AutoLeft| 如: AutoLeft:{ Blank:10, MinWidth:30 } | 根据刻度文字自适应左边边框间距  (可选)<br> {Blank: 留白宽度, MinWidth:最小宽度 } 这个设置必须是Left>10 或者Right>10才有效.<br> 只支持刻度在边框外部显示的模式| object |
|AutoRight| 如: AutoRight:{ Blank:10, MinWidth:30 } | 根据刻度文字自适应右边边框间距  (可选)| object |

Y轴刻度显示在框架外部或内部是通过Border的Left,和Right 来控制的
当Border. Left<10 Y轴左侧刻度会显示在框架内部
当Border. Left>=10 Y轴左侧刻度会显示在框架外部
当Border. Right<10 Y轴右侧刻度会显示在框架内部
当Border. Right>=10 Y轴右侧刻度会显示在框架外部


## 3.9 叠加股票参数详解 Overlay

|参数|取值|说明|类型|
|----|----|---- |----|
|Symbol| 如 "600000.sh" | 叠加股票代码 |  字符串 |
|DrawType| 0 实心K线柱子<br> 1 收盘价线<br> 2 美国线<br> 3 空心K线柱子<br> |叠加股票K线图 默认跟主图K线类型一致 (可选)| 数值 |
|Color| 如 "rgb(240,0,10)"| 线段颜色,不填随机选一个颜色 (可选)| color|


## 3.10 叠加指标参数详解 OverlayIndex

单个叠加指标参数详解

|参数|取值|说明|类型|
|----|----|---- |----|
|Index| 如："MACD" | 指标ID |字符串 |
|Windows| 如 0 | 叠加到对应的窗口索引 0开始| 数值 |
|IsShareY| true/false | 是否和主图指标公用Y轴 (默认是false, 独立Y轴坐标) (可选)| bool|
|IsCalculateYMaxMin| true/false | 共享Y轴时，叠加指标的数据是否影响共享Y轴最大最小值，默认true (可选)| bool|
|ShowRightText| true/false | 是否显示右侧子坐标，默认true (可选) | bool |
|Args| 如: Args: [{ Name: 'N', Value: 10 }]  | 指标参数, Name:参数名称, Value:参数数值 | 数组 |
|Name|如 "指标1" | 自定指标名称 | 字符串 |
|IndexName| | 自定义指标ID| 字符串 |
|Script|如 "T2:MA(C,10);" | 指标执行的脚本 (可选) |字符串|
|Identify| "index_9999" | 指标实例ID (可选) | 字符串 |
|API| 详见3.3 后台API指标参数详解 |后台API指标| object|

### 例子 1

第1个指标窗口 配置1个后台（多线段指标）指标，一个MACD指标, 一个动态指标）  
第2个指标窗口 配置一个MA指标

```javascript
var option=
{
    //.....

    OverlayIndex:
    [
        {
            Index:'多线段指标', Windows:0 ,
            API: 
            {
                Name:'多线段指标',
                Script:null,
                Args:null, 
                Url:'http://127.0.0.1:18080/api/jsindex' 
            }, 
            ShowRightText:true
        },

        {Index:'MACD', Windows:0 },

        {Windows:0, IndexName:"指标ID", Name:"自定义指标", Script:"T:MA(O,20);", Identify:"guid_66990"}

        {Index:'MA', Windows:1 }
    ],  //叠加指标

    //........
}


```



# 3.11 指标窗口坐标参数详解 Frame

|参数|取值|说明|类型|
|----|----|---- |----|
|SplitCount|  | y轴刻度个数 (可选) | 数值|
|IsShowLeftText| true/false | 是否显示左侧Y轴刻度 左侧刻度如果间距不够会显示在框架内部， 必须设置这个值才能去掉左侧Y轴刻度显示 (可选) | bool|
|IsShowRightText| true/false | 是否显示右侧Y轴刻度  (可选) | bool|
|Height| |窗口高度比值 (可选) | 数值|
|SplitType| 0 自动分割(会自动调整最大最小)<br>1 根据当前屏最大最小值平均分割 | Y轴刻度风格方式 (可选) | 数值|
|EnableRemoveZero| true/false| 所有Y轴显示刻度如果小数位后面是0， 就抹去0. 默认是开启的 (可选)<br>如刻度 [10.00， 15.00， 20.00] 抹零以后显示为[10, 15, 20]  | bool|
|BorderLine| 1=上 2=下 4=左 8=右 |边框线显示控制 (可选) | 数值|
|IsShowYLine| ture/false |是否显示Y轴刻度线 (可选) |bool|
|IsShowXLine| true/false |是否显示X轴刻度线 (可选) |bool|
|TopSpace| |顶部留白 (可选) | 数值|
|BottomSpace| | 底部留白 (可选) | 数值 |
|IsShowIndexTitle| 是否显示指标标题信息. 默认是true (可选) |bool|
|HorizontalReserved| 如: HorizontalReserved:{Top:10, Bottom:15 } | 上下预留空间大小 { Top：， Bottom: } (可选) | object|
|YCoordinateType| 默认0. 注意只对主图Y轴有效<br>0 普通坐标<br> 1 百分比坐标<br> (右边坐标刻度)<br> 2对数对标| Y轴坐标类型(可选) |数值|
|IsYReverse| true/false | Y轴坐标是否反转,默认false (可选) |bool|
|YTextBaseline|  0 middle<br> 1 bottom|Y轴内部刻度文字上下对齐方式 (可选)|数值|
|Custom| 详见3.12 自定义Y刻度参数详解| 自定义Y刻度 (可选)| 数组|


# 3.12 自定义Y刻度参数详解 Custom

|参数|取值|说明|类型|
|----|----|---- |----|
|Type| 0 最新价格刻度<br> 1 固定价格刻度<br> 2 当前屏最后一个K线收盘价刻度<br> 3 当前屏数据涨幅<br> 4 指标前屏最后一个数据刻度|数值|
|Position| "left", "right"| 文字显示位置,默认:right (可选) | 字符串|
|PositionEx| 0 文字绘制在坐标框架外部<br>1 文字绘制在坐标框架内部 | 文字绘制在坐标框架内部或外部, 默认0. (可选)| 数组|
|IsShowLine| true/false |是否显示刻度虚线 默认:true  (可选)| bool|
|LineType | 0 直线<br> 2 虚线<br> -1 不画线<br> |线段类型,默认2 (可选)| 数值|
|Data| Data:{ Value：刻度Y轴价格,<br>Text:显示文本 (可以缺省，缺省就使用Value的值输出), 支持多行文字输出,<br>Color:线段及文字背景色,<br> TextColor:文字颜色 } |自定义刻度信息,当Type=1时才才需要填 | object|

## 示例1 右侧显示最近价格

```javascript

var option=
{
    Type:'历史K线图',
    //.........
    Frame:  //子框架设置
    [
        { 
            //.........  
            Custom: [{ Type:0, Position:'left',}]
        },
    ]

}
```

## 示例2 在K线上15.55， 17.55价格位置增加刻度

```javascript
var option=
{
    Type:'历史K线图',
    //......
    Frame:  //子框架设置
    [
        {                 
            Custom:
            [
                { 
                    Type:1, 
                    Position:'left', IsShowLine:true,
                    Data:
                    [
                        {
                            Value:15.55,
                            Color:'rgb(255,185,255)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        }，
                        {
                            Value:17.55,
                            Color:'rgb(255,185,0)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        }
                    ] 
                },
            ]
        },
    ]
}

```

## 示例3 在K线上15.55的位置显示止损线， 17.55价格位置显示止盈线

```javascript
var option=
{
    Type:'历史K线图',
    //......
    Frame:  //子框架设置
    [
        {               
            Custom:
            [
                { 
                    Type:1, 
                    Position:'left',IsShowLine:true,
                    Data:
                    [
                        {
                            Value:15.55,
                            Text:'止损线',  //Text:显示文本
                            Color:'rgb(255,185,255)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        },
                        {
                            Value:17.55,
                            Text:'止盈线',  //Text:显示文本
                            Color:'rgb(255,185,0)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        }
                    ] 
                }
            ]
        },
    ]
}

```


# 3.13 区间选择参数详解 DragSelectRect

|参数|取值|说明|类型|
|----|----|---- |----|
|Enable| true/false | 是否启动区间选择 |bool|
|ShowMode| 0 选中区域框起来<br> 1 模糊没有选中区域<br> 2 模糊没有选中区域,选中区域框贯穿整个窗口  | 区间选择样式 (可选)| 数值|
|EnableRButton|  true/false | 是否启动鼠标右键选择| bool|
|EnableLButton|  true/false | 是否启动鼠标左键选择| bool|


# 3.14 双击弹出分时图参数详解 PopMinuteChart
|参数|取值|说明|类型|
|----|----|---- |----|
|Enable|true/false |是否启动 | bool|
|EnableMarkBG| true/false| 是否在图上标记当前弹出分时对应的K线日期| bool|
|Option| | 分时图的配置 (可选)| object|

## 示例
```javascript
var option=
{
    Type:'历史K线图',
    //......

    //双击K线图 弹分时图配置
    PopMinuteChart:
    { 
        Enable:true, 
        EnableMarkBG:true,
        Option:
        { 
            Windows:
            [
                { Index:"RSI", Overlay:false,MaxMin:false }
            ]
        }
    },
}
```

