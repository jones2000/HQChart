# 一、K线样式切换

K线所有样式配置都是加载到全局变量g_JSChartResource里面的.
如果要修改背景色, 直接修改k线div的背景色就可以了. 插件背景色是透明的.

## 1.1 样式函数

### 1.1.1 获取当前全局样式配置信息 GetResource

```javascript
//静态函数
JSChart.GetResource=function()  //获全局样式配置配置
```

### 1.1.2 获取内置的样式配置信息 GetStyleConfig
HQChart插件内置2套样式， 白色风格和黑色风格. 

```javascript
//静态函数
HQChartStyle.GetStyleConfig=function(styleid) 
```

- styleid 风格ID   
  0 白色风格  STYLE_TYPE_ID.WHITE_ID
  1 黑色风格  STYLE_TYPE_ID.BLACK_ID

- 返回样式配置的信息

### 1.1.3 修改当前全局样式配置信息 SetStyle

```javascript
//静态函数
JSChart.SetStyle=function(config)  //获全局样式配置配置
```

- config 样式配置信息

### 1.1.4 图形实例动态刷新样式
```javascript
ReloadResource=function( option )
```
- option  { Draw:true , Update:true }
  Draw:是否清除缓存重绘图形
  Update:是否不清除缓存重绘图形


### 1.1.5 修改当前全局css样式变量

```javascript
//静态函数
JSChart.SetCSSStyle(styleID);
```

- styleID 风格ID



## 1.2 修改样式示例

### 1.2.1 内置风格样式切换示例（原生 JS）

```javascript

// 风格设置必须在SetOption之前.
// 原生不需要加前缀HQChart.Chart.
var blackStyle=HQChartStyle.GetStyleConfig(STYLE_TYPE_ID.BLACK_ID); //读取黑色风格配置
JSChart.SetStyle(blackStyle); 

var resource=JSChart.GetResource(); //获取当前的全局样式配置
//如果内置的颜色不满足需求，可以自己修改resource样式配置


```

### 1.2.2 内置风格样式切换示例（vue2）

```javascript

import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/font/drawtool/iconfont.css';     //HQChart插件内部使用的iconfont图标
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'   //HQChart插件内置样式


// 风格设置必须在SetOption之前. 
// npm导入插件, 需要加前缀HQChart.Chart.
var blackStyle=HQChart.Chart.HQChartStyle.GetStyleConfig(HQChart.Chart.STYLE_TYPE_ID.BLACK_ID); //读取黑色风格配置
HQChart.Chart.JSChart.SetStyle(blackStyle); 

var resource=HQChart.Chart.JSChart.GetResource(); //获取当前的全局样式配置
//如果内置的颜色不满足需求，可以自己修改resource样式配置

```

### 1.2.3 不刷新页面切换样式示例 (原生 JS)

```javascript

ChangeStyle( styleID )
{
    var style=HQChartStyle.GetStyleConfig(styleID); //读取黑色风格配置
    JSChart.SetCSSStyle(styleID);
    JSChart.SetStyle(style); 

    var resource=JSChart.GetResource(); //获取当前的全局样式配置
    //如果内置的颜色不满足需求，可以自己修改resource样式配置

    chart.ReloadResource({ Draw:true , Update:false}); //K线图实例重绘
}


```


### 1.2.3 不刷新页面切换样式示例 (vue2)

```javascript

ChangeStyle( styleID )
{
    var style=HQChart.Chart.HQChartStyle.GetStyleConfig(styleID); //读取黑色风格配置
    HQChart.Chart.JSChart.SetCSSStyle(styleID);
    HQChart.Chart.JSChart.SetStyle(style); 

    var resource=JSChart.GetResource(); //获取当前的全局样式配置
    //如果内置的颜色不满足需求，可以自己修改resource样式配置

    chart.ReloadResource({ Draw:true , Update:false}); //K线图实例重绘
}


```

# 二、样式配置信息详解

## 2.1 基础样式

|字段名|字段说明|类型|格式|
|----|----|----|----|
|UpBarColor| 上涨k线柱子颜色| color| |
|DownBarColor| 下跌k线柱子颜色| color| |
|UnchagneBarColor| 平盘k线柱子颜色| color| |
|EmptyBarBGColor| 空心柱子背景色| color| |
|HighLowBarColor| K线类型为(Hig-Low) 柱子颜色|color||
|HighLowText| K线类型为(Hig-Low) 字体设置 | object| HighLowText:{ FontName:"arial", MaxSize:30, MinSize:4, Color:"rgb(41,98,255)", MaxText:"9999.9" }<br> FontName:字体名称<br> MaxSize, MinSize: 字号最大最小范围<br> Color:文字颜色<br> MaxText:最长的文字
|DefaultTextColor| 图形中默认的字体颜色| color| |
|DefaultTextFont| 图形中默认的字体 | font | |
|TitleFont| 指标栏标题字体 | font | |
|IndexTitleBGColor| 指标名字背景色| color | |
|IndexTitleBorderColor| 指标名字边框颜色| color | |
|IndexTitleBorderMoveOnColor| 指标名字边框颜色(鼠标在上面)| color | |
|IndexTitleBorderStyle| 指标名字边框样式<br> 0 直角边框<br> 1 圆角边框  | 数值 |  |
|IndexTitleColor| 指标名字颜色| color| |

