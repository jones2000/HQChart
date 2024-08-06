![logo](./logo2.png)

[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)
[![github star](https://img.shields.io/github/stars/jones2000/HQChart.svg)]('https://github.com/jones2000/HQChart/stargazers')
[![github fork](https://img.shields.io/github/forks/jones2000/HQChart.svg)]('https://github.com/jones2000/HQChart/members')
[![gitee star](https://gitee.com/jones2000/HQChart/badge/star.svg?theme=dark)]('https://gitee.com/jones2000/HQChart/stargazers')
[![gitee fork](https://gitee.com/jones2000/HQChart/badge/fork.svg?theme=dark)]('https://gitee.com/jones2000/HQChart/members')
[![npm package](https://img.shields.io/npm/v/hqchart.svg?style=flat-square)](https://www.npmjs.org/package/hqchart)
[![npm dw](https://img.shields.io/npm/dw/hqchart)](https://img.shields.io/npm/dw/hqchart)

HQChart是第1个基于国内传统PC股票客户端软件(C++)移植到js/py平台的一个项目, 包含**K线图图形库**及**麦语法(分析家语法)指标执行器**.  <br>
**支持平台**:js, vue2.0, vue3.0, uniapp,小程序 <br>
**支持品种**:支持股票，期货， 数字货币，外汇等和K线相关的品种。<br>
**麦语法指标计算引擎**(分析家语法)指标执行器支持js, nodejs, py, c#，c++. 支持前端worker线程计算指标<br>

# 交流
 前端技术交流群:719525615  
 有问题可以直接发issue.  

**教程列表和demo效果图在下面,下拉页面就可以看到!!!!!!!!!!!!**    

源码地址:[https://github.com/jones2000/HQChart](https://github.com/jones2000/HQChart)<br>
镜像地址:[https://gitee.com/jones2000/HQChart](https://gitee.com/jones2000/HQChart)<br>

uniapp 版本:
新版插件 ：[https://ext.dcloud.net.cn/plugin?id=4591](https://ext.dcloud.net.cn/plugin?id=4591)<br>
老版本手动导入插件 : [https://ext.dcloud.net.cn/plugin?id=790](https://ext.dcloud.net.cn/plugin?id=790)<br>

[HQChart用户使用协议](/用户协议.txt) <br>
[HQChart商业使用说明及用户使用协议](https://blog.csdn.net/jones2000/article/details/123170153)<br>

第3放数据对接案例:<br>
源码地址:[https://github.com/jones2000/HQChart-Super](https://github.com/jones2000/HQChart-Super)<br>
镜像地址:[https://gitee.com/jones2000/HQChart-Super](https://gitee.com/jones2000/HQChart-Super)<br>

如果你觉得我们的行情模块对你有帮助， 请给我们点下star. (●ˇ∀ˇ●) <br>

麦语法指标计算引擎，[https://github.com/jones2000/hqchartPy2/tree/master/HQChartPy2.Free](https://github.com/jones2000/hqchartPy2/tree/master/HQChartPy2.Free),
支持windows,和linux. 这个版本是用c++开发的，通过cpython来对接py，能高效的完成指标执行. 可以应用于回测, 选股等批量指标计算中.


# 目录结构
--webhqchart 行情前端js代码模块 <br>
--wechathqchart 微信小程序行情前端js代码模块 <br>
*注意！ 目前代码使用了ES6的特性， 所有会导致有些老的浏览器无法显示， 需要使用Babel转成es5

--webhqchart.demo 页面行情测试用例 <br>
   * |--jscommon 行情前端js代码 是webhqchart的一个拷贝 <br>
   * |--demo  测试用 <br>
   
--vuehqchart
   * |--src 行情控件
        * |--umychart.resource 行情用到的图片资源 及 css样式
        * |--umychart.vue 行情图形及行情数据模块
        * |--umychart.vue.components  行情VUE控件模块 
   * |--pages 测试和demo页面

--小程序行情模块用例 小程序测试用例<br>

--umychart_python 分析家语法（麦语法）python版本 <br>
--umychart_indexapi nodejs指标后台计算demo (包括docker打包文件) <br>

# npm 安装
npm install jquery <br>
npm install hqchart <br>
[https://www.npmjs.com/package/hqchart](https://www.npmjs.com/package/hqchart) <br>
VUE 例子:[demo-vue.md](/教程/demo-vue.md) <br>
React 例子:[demo-react.md](/教程/demo-react.md) <br>

# 本地调试
由于安全原因, 内置测试数据接口已经停止了。
如果需要数据对接可以参考第3放数据对接案例. [https://github.com/jones2000/HQChart-Super](https://github.com/jones2000/HQChart-Super)  

~~内置测试数据不支持跨域，如果要在本地chrome调试代码，参看教程[解决Chrome本地调试跨域](https://jones2000.blog.csdn.net/article/details/120008624). VUE项目本地调试请使用127.0.0.1:8080站点调试~~

# 声明
  本项目只提供行情图形库及麦语法脚本执行器.    
  页面中所有的行情数据都来自互联网或测试假数据, 不能确保数据的正确性, 仅供开发调试使用. 任何行情数据问题都与本项目无关. 请自行去交易所购买正版行情。    
 

# HQChart 3.0
* 分网页版本 及 微信小程序版本 <br>
  ![走势图](/小程序行情模块用例/image/hqchart_minute.PNG)
  ![走势图2](/小程序行情模块用例/image/hqchart_minute2.PNG)
  ![走势图3](/小程序行情模块用例/image/hqchart_minute_hscreen.PNG)
  ![K线图](/小程序行情模块用例/image/hqchart_kline.PNG)
  ![K线图2](/小程序行情模块用例/image/hqchart_kline_lock.PNG)
  ![K线图3](/小程序行情模块用例/image/hqchart_kline_hscreen.PNG)
  ![K线图4](/小程序行情模块用例/image/hqchart_kline_hscreen2.PNG)
  ![多日走势图1](/小程序行情模块用例/image/hqchart_minute_5day.PNG)
  ![多日走势图2](/小程序行情模块用例/image/hqchart_minute_5day2.PNG)
  ![多日走势图3](/小程序行情模块用例/image/hqchart_minute_5day3.PNG)
  
# 1. K线图
* 支持前复权,后复权 <br>
* 支持日线,月线,周线,年线.分钟线<br>
* 主图支持股票叠加 <br>
* K线形状支持 空心K线,实心K线,美国线,收盘价线
* 支持常用指标指标(目前以录入系统指标80多个),支持自定义通达信语法脚本指标<br>
    均线，BOLL，MACD，KDJ，VOL，RSI，BRAR，WR，BIAS，OBV，DMI，CR，PSY，CCI，
    DMA，TRIX，VR，EMV，ROC，MIM，FSL，CYR，MASS，WAD，CHO ..... <br>
* 支持画图工具,支持保存到本地或保存在内存中<br>
     线段，射线，矩形，圆弧线,水平线,趋势线,平行线,平行通道,价格通道线,文本,江恩角度线,阻速线,黄金分割,百分比线,波段线,三角形,对称角度,斐波那契周期线,平行四边形,圆, iconfont图片 <br>
* 支持区间统计， 区间形态匹配 (微信小程序版本不支持) <br>
* 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 <br>
* 支持麦语法
* 支持通达信语法指标
* 支持五彩K线(目前录入系统五彩K线30多个), 支持自定义通达信语法脚本的五彩K线
* 支持专家系统指标
* 支持个股筹码图  <br>
![K线图](/小程序行情模块用例/image/hqchart_kline2.png)
* 支持单指标单股票前端回测计算 (webhqchart\umychart.regressiontest.js) (2019-5-13 增加功能)<br>
     计算如下数据:  <br>   
          Trade: {Count 交易次数  Days:交易天数 Success:成功交易次数 Fail:失败交易次数} <br>
          Day: {Count:总运行  Max:最长运行 Min:最短运行 Average:平均运行} <br>
          Profit: 总收益 StockProfit:个股收益  Excess:超额收益 MaxDropdown:最大回撤 Beta:β(Beta)系数 <br>
          NetValue: [ {Date:日期, Net:净值, Close:股票收盘价, IndexClose:大盘的收盘价}, ] <br>
* 支持弹幕
* 支持多指标叠加 (2019-7-12 新加功能)   <br>
![K线图](/小程序行情模块用例/image/hqchart_kline_lock2.png)
* 支持截图 (2019-7-9 新加功能)
* 支持K线日线数据或分钟数据自动更新 (2019-7-23)
* 支持分笔K线图 (2019-9-9)  <br>
![K线图](/小程序行情模块用例/image/hqchart_kline3.png)
* 支持K线面积图
![K线图](/小程序行情模块用例/image/hqchart_kline_area.png)
* 支持深度图    
![深度图](/小程序行情模块用例/image/depth_demo.png)    
* 支持ox图
![ox图](/小程序行情模块用例/image/hqchart_ox.png)
* 支持指标图形拖拽
![指标图形拖拽](/小程序行情模块用例/image/hqchart_dragindechart.gif)
* Y轴拖拽缩放
![Y轴缩放](/小程序行情模块用例/image/hqchart_ydrag.gif)  
* 指标tab按钮
![指标tab按钮](/小程序行情模块用例/image/frame_button.gif)  

* 订单流  
![订单流](/小程序行情模块用例/image/hqchart_ordeflow.png)  
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow.html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow.html)  

* 订单流2   
![订单流样式2](/小程序行情模块用例/image/hqchart_ordeflow2.png)  
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=7).html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=7).html)    

* 订单流3   
![订单流样式3](/小程序行情模块用例/image/hqchart_ordeflow3.png)  
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=8).html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=8).html)    

* 订单流4   
![订单流样式4](/小程序行情模块用例/image/hqchart_ordeflow4.png)    
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=17).html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=17).html) 

* 订单流5   
![订单流样式4](/小程序行情模块用例/image/hqchart_ordeflow5.png)    
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=17).html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=18).html) 

* 固定范围成交量分布图
![成交量分布图](/小程序行情模块用例/image/hqchart_volprofile.gif)
* 可视范围成交量分布图
![成交量分布图](/小程序行情模块用例/image/hqchart_vol2.gif)
* 彩色K线柱子
![彩色K线柱子](/小程序行情模块用例/image/kline_color.gif)  
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_color_kline_v2.html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_color_kline_v2.html)   
* 指标窗口最大，最小化
![指标窗口最大，最小化](/小程序行情模块用例/image/index_title.gif)
* 区间选择支持拖拽移动
![区间选择支持拖拽移动](/小程序行情模块用例/image/kline_selectrect.gif)
* 散点图指标
![散点图指标](/小程序行情模块用例/image/kline_SCATTERPLOT.gif)
* renko 砖形图 
![砖形图](/小程序行情模块用例/image/hqchart_renko.png)
* line break
![line break](/小程序行情模块用例/image/hqchart_linebreak.png)
* OrderBook Heatmap
![heatmap](/小程序行情模块用例/image/hqchart_heatmap.png)
* 数据导出
![exportdata](/小程序行情模块用例/image/hqchart_exportdata.gif)  
* 横向滚动条
![scroll bar](/小程序行情模块用例/image/hqchart_scrollbar.gif)  
* 美国线(自动调整柱子宽度)
![bar](/小程序行情模块用例/image/kline_usabar.gif)  
* HLC Area
![HLC Area](/小程序行情模块用例/image/kline_HLCArea.png)   
* 未回补缺口显示
![未回补缺口显示](/小程序行情模块用例/image/hqchart_kline_pricegap.gif)   
* 小程序画图工具
![小程序画图工具](/小程序行情模块用例/image/wechat_drawtool.gif)  
![小程序画图工具](/小程序行情模块用例/image/drawtool_price_line.gif)  
* 背景分割
![背景分割](/小程序行情模块用例/image/kline_splitbg.png)  


# 2. 走势图
* 支持指标 <br>
* 支持股票叠加<br>
* 支持沪深和港股,国内期货等<br>
* 分钟数据显示 <br>
* 支持多日分钟数据显示<br>
* 支持A股集合竞价显示/隐藏 (2019-7-12 新加功能)  <br>
![走势图2](/小程序行情模块用例/image/hqchart_minute3.png)
* 支持指数领先指标(2019-7-15  新加功能)  <br>
![领先指标](/小程序行情模块用例/image/hqchart_kline_lock3.png)
* 支持信息标识 <br>
![信息标识](/小程序行情模块用例/image/hqchart_minute_info.png)   
[https://jones2000.github.io/HQChart/webhqchart.demo/samples/minute_mines.html](https://jones2000.github.io/HQChart/webhqchart.demo/samples/minute_mines.html)   
* 支持涨停坐标 <br>
* 支持美股盘前,盘中,盘后,全部全部行情展示   
![美股](/小程序行情模块用例/image/minute_usa.gif)

# 3. 其他图形
* 成交明细表, 支持键盘,滚轴翻页<br>
![成交明细表](/小程序行情模块用例/image/deal_list.png)
* 分价表, 支持键盘,滚轴翻页<br>
![分价表](/小程序行情模块用例/image/price_list.png)
* 报价列表  <br>
1. 纯画布手动打造, 虚拟表格, 操作不卡顿。<br>
2. 支持固定列, 键盘操作: PageUP/PageDown 翻页, Up/Down 移动当前选中股票, Left/Right 移动列, 滚轴上下翻页.<br>
3. 支持Tab页切换板块，横向滚动轴<br>
4. 支持配置列本地排序或远程排序<br>
5. 支持走势图
6. 支持单K线柱
7. 拖拽调整表头顺序和列宽度
![报价列表](/小程序行情模块用例/image/hqchart_report.gif)<br>
![报价列表](/小程序行情模块用例/image/hqchart_report2.gif)<br>
![报价列表](/小程序行情模块用例/image/hqchart_report_closeline.png)<br>
![报价列表](/小程序行情模块用例/image/hqchart_report_kbar.png)<br>
![报价列表](/小程序行情模块用例/image/hqchart_report_2.gif)<br>
* 键盘精灵<br>
![键盘精灵](/小程序行情模块用例/image/sendsymbol_demo.gif)<br>
* T型报价   
![T型报价](/小程序行情模块用例/image/TReport_demo.gif)  
* 大数据表格
![大数据表格](/小程序行情模块用例/image/report_bigdata_demo.gif)  
![大宗交易](/小程序行情模块用例/image/report_block_trade_demo.png)   




# 3. 网页demo  
## 公式编辑器
* [仿通达信公式编辑器](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_index_edit.html)  
* [仿通达信公式编辑器-分时图](https://jones2000.github.io/HQChart/webhqchart.demo/samples/minute_index_edit.html)  

## K线图
* [K线图](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_kline.html)   
* [K线图手机页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_kline_phone.html)   
* [K线图手机横屏页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_kline_phone_hScreen.html)    
* [K线1分钟K线更新速度测试](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_updata_speed.html)  
* [K线图滚动条](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_scrrollbar.html)    
* [毫秒收盘价K线图](https://jones2000.github.io/HQChart/webhqchart.demo/samples/msecond_kline.html)   
* [毫秒收盘价K线图滚动条模式](https://jones2000.github.io/HQChart/webhqchart.demo/samples/msecond_kline_scrrollbar.html)   
* [K线图沙盘推演](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_sandtable.html)   
* [K线对接后台指标(DRAWBAND)示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_DRAWBAND.html)  
* [K线对接后台指标(MULTI_LINE)示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_MULTI_LINE_index.html)  
* [K线对接后台指标(MULTI_SVGICON)示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_MULTI_SVGICON.html)  
* [K线对接后台指标(MULTI_TEXT)示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_MULTI_TEXT.html)  
* [自定义K线指标标题栏](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_indextitle.html)   
* [自定义彩色K线图](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_color_kline_v2.html)   
* [分钟K线拖动下载历史数据页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_DragDownload.html)  
* [日K线拖动下载历史数据页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_DragDownload_day.html)  
* [指标模板示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_kline_template_index.html)  

## 订单流
* [订单流样式1](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow.html)    
* [订单流样式2](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=7).html)    
* [订单流样式3](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=8).html)    
* [订单流样式4](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_orderflow_v2(type=17).html)    

## 走势图
* [走势图](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_minute.html)   
* [走势图手机页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_minute_phone.html)   
* [走势图手机横屏页面](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_minute_phone_hScreen.html)   
* [走势图-异动信息标示](https://jones2000.github.io/HQChart/webhqchart.demo/samples/minute_mines.html)  
* [指标模板示例](https://jones2000.github.io/HQChart/webhqchart.demo/samples/chart_minute_template_index.html)  

## K线训练
* [K线训练手机](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_ktrain.html)    
* [K线训练手机横屏](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_ktrain2.html)    

## 分笔
* [分笔列表](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_deallist.html)   
* [分笔列表-小窗口模式](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_deallist_small.html)   


## 画图工具
* [K线图画图工具](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_drawtool.html)   
* [K线图画图工具-横屏](https://jones2000.github.io/HQChart/webhqchart.demo/samples/kline_drawtool.hScreen.html)   


## 指标计算
* [前端工作线程批量计算指标](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_workerthread_sina.html)   

## 键盘精灵
* [键盘精灵](https://jones2000.github.io/HQChart/webhqchart.demo/samples/keyboard_demo.html)  

## T型报价
* [T型报价](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_TReport.html)  

## 报价列表
* [报价列表](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_report.html)  
* [大宗交易列表](https://jones2000.github.io/HQChart/webhqchart.demo/samples/demo_report_block_trade.html)  



# 4.使用教程
## 画图工具列表
[HQChart支持的画图工具列表](https://jones2000.blog.csdn.net/article/details/133781956)  
## 麦语法函数帮助文档
[HQChart麦语法内置函数帮助文档](https://jones2000.blog.csdn.net/article/details/129125330)   
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
40. ~~[HQChart使用教程47-如何自定义右键菜单](https://blog.csdn.net/jones2000/article/details/102720671)~~  
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
86. [HQChart使用教程96-指标图形双击](https://blog.csdn.net/jones2000/article/details/125735141)<br>
87. [HQChart使用教程97-K线X轴滚动条](https://jones2000.blog.csdn.net/article/details/134133670)   
88. [HQChart使用教程98-右键菜单2.0使用介绍](https://blog.csdn.net/jones2000/article/details/138841350)   
89. [HQChart使用教程99-K线窗口设置上下间距](https://jones2000.blog.csdn.net/article/details/139273770)   
90. [HQChart使用教程100-自定义Y轴分段背景色](https://jones2000.blog.csdn.net/article/details/139498872)   

##  微信小程序教程
1. [HQChart小程序教程1-如何快速的创建一个K线图](https://developers.weixin.qq.com/community/develop/article/doc/0006c451ac81589915b89d1c55bc13)   
2. [HQChart小程序教程2-如何使用新版2D画布创建一个K线图](https://blog.csdn.net/jones2000/article/details/105632095)   
3. [HQChart小程序教程3-新版2D单画布如何切换K线图和分时图](https://blog.csdn.net/jones2000/article/details/108378355)   
4. [HQChart小程序教程4-动态控制手势滚动页面](https://jones2000.blog.csdn.net/article/details/139497129)    

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
10. [HQChart使用教程100-uniapp如何在vue3运行微信小程序](https://jones2000.blog.csdn.net/article/details/139309202)    

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
35. [HQChart使用教程30-K线图如何对接第3方数据35-固定范围成交量分布图数据](https://blog.csdn.net/jones2000/article/details/125020448)  
36. [HQChart使用教程30-K线图如何对接第3方数据36--散点图](https://jones2000.blog.csdn.net/article/details/126944289)  
37. [HQChart使用教程30-K线图如何对接第3方数据37-如何绘制圆点](https://jones2000.blog.csdn.net/article/details/131244845)    
38. [HQChart使用教程30-K线图如何对接第3方数据38-通达信指标K线数据](https://jones2000.blog.csdn.net/article/details/131439180)  
39. [HQChart使用教程30-K线图如何对接第3方数据39-缩放下载K线数据历史数据](https://blog.csdn.net/jones2000/article/details/132355466)  
40. [HQChart使用教程30-K线图如何对接第3方数据40-日K叠加股票增量更新](https://jones2000.blog.csdn.net/article/details/139997350)    
41. [HQChart使用教程30-K线图如何对接第3方数据41-分钟K线叠加股票增量更新](https://jones2000.blog.csdn.net/article/details/139997565)   


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
13. [HQChart实战教程66-动态调整HQChart布局大小](https://jones2000.blog.csdn.net/article/details/133800739)  
14. [HQChart实战教程67-worker批量计算股票指标](https://jones2000.blog.csdn.net/article/details/134163955)    
15. [HQChart实战教程71-K线图附图双坐标配置](https://blog.csdn.net/jones2000/article/details/137610265)  
16. [HQChart实战教程73-仿tradingview指标MACD](https://blog.csdn.net/jones2000/article/details/139747247)    

## 付费教程
1. [HQChart对接火币完整教程](https://jones2000.github.io/HQChart/document/huobi_demo.html)   
2. [HQChart对接欧易完整教程](https://jones2000.github.io/HQChart/document/okx_demo.html)   



## 源码收费
1. [HQChart实战教程36-数字货币币安对接-uniapp版本](https://jones2000.github.io/HQChart/document/uniapp_binance.html)<br>
1. [HQChart实战教程36.2-数字货币Gate.IO对接-uniapp版本](https://jones2000.github.io/HQChart/document/uniapp_gateio.html)<br>
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

## 高级应用实战教程2(付费文章)
1. [HQChart实战教程54-renko砖形K线图](https://jones2000.blog.csdn.net/article/details/128461885)  
2. [HQChart实战教程55-heatmap热力图](https://jones2000.blog.csdn.net/article/details/128467231)  
3. [HQChart实战教程56-限制指标周期](https://blog.csdn.net/jones2000/article/details/128592810)  
4. [HQChart实战教程57-远程指标提示信息](https://jones2000.blog.csdn.net/article/details/128652645)
5. [HQChart实战教程58-K线主图仿tradingview](https://blog.csdn.net/jones2000/article/details/128795059)  
6. [HQChart实战教程59-深度图定制Tooltip输出内容](https://jones2000.blog.csdn.net/article/details/129951576)  
7. [HQChart实战教程60-如何定制十字光标输出内容](https://jones2000.blog.csdn.net/article/details/130079468)  
8. [HQChart实战教程61-自定义十字星K线颜色](https://blog.csdn.net/jones2000/article/details/130551867)    
9. [HQChart实战教程62-自定义K线标题栏](https://jones2000.blog.csdn.net/article/details/131174277)   
10. [HQChart实战教程63-自定义手机端K线tooltip显示数据](https://jones2000.blog.csdn.net/article/details/131206706)    
11. [HQChart实战教程64-自定义分时图标题栏](https://jones2000.blog.csdn.net/article/details/131319341)  
12. [HQChart实战教程65-自定义手机端分时图tooltip显示数据](https://jones2000.blog.csdn.net/article/details/131325837)   
13. [HQChart实战教程68-自定义分时图PC端tooltip显示数据](https://blog.csdn.net/jones2000/article/details/134182120)    
14. [HQChart实战教程69-分时图主图如何设置指标](https://jones2000.blog.csdn.net/article/details/136160187)   
15. [HQChart实战教程70-K线图增加成本线](https://jones2000.blog.csdn.net/article/details/136687070)   
16. [HQChart实战教程72-美股盘前,盘中,盘后分时图](https://blog.csdn.net/jones2000/article/details/138870447)   
17. [HQChart实战教程74-自定义指标标题栏](https://jones2000.blog.csdn.net/article/details/140488167)  
18. [HQChart实战教程75-分时图回放](https://blog.csdn.net/jones2000/article/details/140682155)   
19. [HQChart实战教程76-自定义Y轴刻度线](https://jones2000.blog.csdn.net/article/details/140949881)    

## HQChart报价列表高级应用教程(付费文章)
1. [HQChart报价列表高级应用教程1-雪球数据对接报价列表](https://blog.csdn.net/jones2000/article/details/124759574)   
2. [HQChart报价列表高级应用教程2-东方财富数据对接自选股列表](https://blog.csdn.net/jones2000/article/details/124940054)   
3. [HQChart报价列表高级应用教程3-雪球数据对接报价列表uniapp版本](https://blog.csdn.net/jones2000/article/details/128637380)    
4. [HQChart报价列表高级应用教程4-股票名称增加类型图标](https://blog.csdn.net/jones2000/article/details/128692571)    
5. [HQChart报价列表高级应用教程5-自定义单元格文字颜色](https://jones2000.blog.csdn.net/article/details/129665704)  
6. [HQChart报价列表高级应用教程6-自定义列数据对接](https://jones2000.blog.csdn.net/article/details/129678481)  
7. [HQChart报价列表高级应用教程7-走势列数据对接](https://blog.csdn.net/jones2000/article/details/140163584)   


## 设计文档:
1. [如何(c++,js)写一个传统的K线图和走势图1](https://blog.csdn.net/jones2000/article/details/84779481) <br>
2. [如何(c++,js)写一个传统的K线图和走势图2-走势图](https://blog.csdn.net/jones2000/article/details/84840770) <br>
3. [如何(c++,js)写一个传统的K线图和走势图3-多指标窗口模式如何实现的](https://blog.csdn.net/jones2000/article/details/84979910) <br>
4. [如何(c++,js)写一个传统的K线图和走势图3-十字光标的绘制](https://blog.csdn.net/jones2000/article/details/85123680) <br>
5. [如何(c++,js)写一个传统的K线图和走势图4-K线图](https://blog.csdn.net/jones2000/article/details/85235463) <br>
6. [如何(c++,js)写一个传统的K线图和走势图5-移动筹码图](https://blog.csdn.net/jones2000/article/details/85356163) <br>

## HQChartPy2介绍（py版本指标引擎）
1. [HQChart(C++)指标计算引擎-介绍](https://blog.csdn.net/jones2000/article/details/107464517) <br>
2. [HQChart(C++)指标计算引擎-安装](https://blog.csdn.net/jones2000/article/details/107712259) <br>
3. [HQChart(C++)指标计算引擎-py接口类FastHQChart介绍](https://blog.csdn.net/jones2000/article/details/107725170) <br>
4. [HQChart(C++)指标计算引擎-py接口类IHQData K线数据对接](https://blog.csdn.net/jones2000/article/details/107728903) <br>

## HQChartPy2数据对接教程 (以tushare数据为例子)
1. [hqchartPy2数据对接教程1-K线数据](https://blog.csdn.net/jones2000/article/details/112060412)<br>
2. [hqchartPy2数据对接教程2-股本数据,筹码分布函数](https://blog.csdn.net/jones2000/article/details/112060761)<br>
3. [hqchartPy2数据对接教程3-FINANCE数据](https://blog.csdn.net/jones2000/article/details/112095070)<br>
4. [hqchartPy2数据对接教程4-DYNAINFO函数](https://blog.csdn.net/jones2000/article/details/112334485)<br>
5. [hqchartPy2数据对接教程5-引用指定股票数据函数](https://blog.csdn.net/jones2000/article/details/112335307)<br>
6. [hqchartPy2指标选股-KDJ选股](https://blog.csdn.net/jones2000/article/details/113667444)<br>

# 5.VUE 行情项目
[代码地址(vuehqchart)](/vuehqchart) <br>
![大图](/小程序行情模块用例/image/pch5hq.PNG)   
页面名称 "hq.demo.page.html"   

![多周期图2](/小程序行情模块用例/image/pch5hq2.png)   
页面名称"stockmultiperiod.demo.page.html"


## 基于VUE版本给客户开发的样例
![PC行情页面](/小程序行情模块用例/image/hqchart_pc_demo1.png)    
[示例地址(https://jones2000.github.io/HQChart/vue.demo/infoHqdemo/release/index.html)](https://jones2000.github.io/HQChart/vue.demo/infoHqdemo/release/index.html)    
[代码地址(vue.demo/infoHqdemo)](/vue.demo/infoHqdemo)   

## VUE版本手机端样例1
![手机端行情页面](/小程序行情模块用例/image/hchart_phone_1.png) <br>
[示例地址(https://jones2000.github.io/HQChart/vue.demo/hq_h5_pages/release/stockHq.html)](https://jones2000.github.io/HQChart/vue.demo/hq_h5_pages/release/stockHq.html)     
[代码地址(vue.demo/hq_h5_pages)](/vue.demo/hq_h5_pages) <br>

## VUE版本手机端样例2 黑色风格
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_3.png) <br>
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_4.png) <br>
[示例地址(https://jones2000.github.io/HQChart/vue.demo/hq_h5_demo_black/release/stockHq.html)](https://jones2000.github.io/HQChart/vue.demo/hq_h5_demo_black/release/stockHq.html)   
[代码地址(vue.demo/hq_h5_demo_black)](/vue.demo/hq_h5_demo_black)   


## js页面样例
![手机端行情页面](/小程序行情模块用例/image/hqchart_phone_2.png) <br>
[代码地址(webhqchart.demo/h5demo)](/webhqchart.demo/h5demo) <br>
[VUE代码地址(vue.demo/stockpage_h5)](/vue.demo/stockpage_h5) <br>


# 奖项
![GVP](/小程序行情模块用例/image/gvp.jpg)

# 赞助
![微信二维码](/小程序行情模块用例/image/wx_code.PNG)

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jones2000/HQChart&type=Date)](https://star-history.com/#jones2000/HQChart&Date)


# HQChart付费技术支持

**注意:技术支持,不负责开发和部署.**

|名称|费用(每月)|内容|
| :-: | :-: | :-: | 
|单次技术支持| 500  |   |
|基础技术支持| 2000 |回答插件相关问题，如有对应的教程，提供对应的教程地址 |  
|高级技术支持| 5000 |回答插件相关问题，如有对应的教程，提供对应的教程地址, 对复杂的问题，可以提供demo示例. 如需自己定制图形，提供外挂图形接口.(定制图形由客户自己开发) |  
|图形定制开发| 5000起 |具体费用看具体的需求, 定制的部分提供源码，和开源的代码是分开的，以HQChart扩展插件的方式挂接进去。 |  

