![logo](./logo2.png)

[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)
[![github star](https://img.shields.io/github/stars/jones2000/HQChart.svg)]('https://github.com/jones2000/HQChart/stargazers')
[![github fork](https://img.shields.io/github/forks/jones2000/HQChart.svg)]('https://github.com/jones2000/HQChart/members')
[![gitee star](https://gitee.com/jones2000/HQChart/badge/star.svg?theme=dark)]('https://gitee.com/jones2000/HQChart/stargazers')
[![gitee fork](https://gitee.com/jones2000/HQChart/badge/fork.svg?theme=dark)]('https://gitee.com/jones2000/HQChart/members')
[![npm package](https://img.shields.io/npm/v/hqchart.svg?style=flat-square)](https://www.npmjs.org/package/hqchart)
[![npm dw](https://img.shields.io/npm/dw/hqchart)](https://img.shields.io/npm/dw/hqchart)

如果你觉得我们的行情模块对你有帮助， 请给我们点下star. (●ˇ∀ˇ●)


# 目录结构
--node.jccomplier  nodejs通达信脚本选股后台api模块. 使用restify webapi框架 <br>
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

--umychart_python 分析家语法（麦语法）python版本 (2019-6-26 开始立项开发) ❗这个是我第1次使用py, 进度会比较慢点， 大家多包含 😄， 有兴趣的朋友也可以加入一起开发。
  * 2019-7-1 进度 词法分析(完成) 语法分析(完成) AST(完成), 执行器框架迁移完成(K线数据完成, 四则运算完成, 逻辑运算完成, 部分指标函数完成)
  * 2019-7-8 麦语法执行器基本移植完成
  
--umychart_indexapi nodejs指标后台计算demo (包括docker打包文件)

# npm 安装
npm install jquery <br>
npm install hqchart <br>
[https://www.npmjs.com/package/hqchart](https://www.npmjs.com/package/hqchart) <br>
VUE 例子:[demo-vue.md](/教程/demo-vue.md) <br>
React 例子:[demo-react.md](/教程/demo-react.md) <br>

# 声明
  本项目只提供行情图形库及麦语法脚本执行器.<br>
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
* 支持画图工具,支持保存到本地或保存在内存中(小程序不支持)<br>
     线段，射线，矩形，圆弧线,水平线,趋势线,平行线,平行通道,价格通道线,文本,江恩角度线,阻速线,黄金分割,百分比线,波段线,三角形,对称角度,斐波那契周期线,平行四边形,圆, iconfont图片 <br>
* 支持区间统计， 区间形态匹配 (微信小程序版本不支持) <br>
* 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 <br>
* 支持麦语法 [内置系统函数说明](https://opensourcecdn.zealink.com/cache/webcache/hqfunctionhelp/index.html)
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

# 2. 走势图
* 支持指标 <br>
* 支持股票叠加<br>
* 支持沪深和港股,国内期货(开发中)<br>
* 分钟数据显示 <br>
* 支持多日分钟数据显示<br>
* 支持A股集合竞价显示/隐藏 (2019-7-12 新加功能)  <br>
![走势图2](/小程序行情模块用例/image/hqchart_minute3.png)
* 支持指数领先指标(2019-7-15  新加功能)  <br>
![领先指标](/小程序行情模块用例/image/hqchart_kline_lock3.png)
* 支持信息地雷 <br>
![信息地雷](/小程序行情模块用例/image/hqchart_minute_info.png)
* 支持涨停坐标 <br>

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
11. [HQChart使用教程8- 如何快速创建一个横屏分时图页面](https://blog.csdn.net/jones2000/article/details/90453776) <br>
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
31. [HQChart使用教程33-如何在麦语法中自定义变量](https://blog.csdn.net/jones2000/article/details/100710615) <br>
32. [HQChart使用教程34-如何在麦语法中自定义函数](https://blog.csdn.net/jones2000/article/details/100734839) <br>
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
47. [HQChart使用教程54- K线缩放控制按钮接口说明](https://blog.csdn.net/jones2000/article/details/104346016) <br>
48. [HQChart使用教程55- 自定义PC端K线图Tooltip](https://blog.csdn.net/jones2000/article/details/104443471) <br>
49. [HQChart使用教程56-内置品种对应后缀列表说明](https://blog.csdn.net/jones2000/article/details/104457569) <br>
50. [HQChart使用教程57-如何调整K线的柱子缩放大小](https://blog.csdn.net/jones2000/article/details/104817724)<br>
51. [HQChart使用教程58-如何在K线右侧绘制面积图(如深度图)](https://blog.csdn.net/jones2000/article/details/105026997)<br>
52. [HQChart使用教程59-跨周期跨股票函数STKINDI使用说明](https://blog.csdn.net/jones2000/article/details/105401909)<br>
53. [HQChart使用教程60-新版k线训练使用教程](https://blog.csdn.net/jones2000/article/details/105760924)<br>
54. [HQChart使用教程61-画图工具接口使用教程](https://blog.csdn.net/jones2000/article/details/105835428)<br>
55. [HQChart使用教程62-品种小数位数设置](https://blog.csdn.net/jones2000/article/details/106592730)<br>

## 小程序教程
1. [HQChart小程序教程1-如何快速的创建一个K线图](https://developers.weixin.qq.com/community/develop/article/doc/0006c451ac81589915b89d1c55bc13) <br>
2. [HQChart小程序教程2-如何使用新版2D画布创建一个K线图](https://blog.csdn.net/jones2000/article/details/105632095)<br>

## uni-app教程
1. [HQChart使用教程35-如何在uni-app创建K线图(h5)](https://blog.csdn.net/jones2000/article/details/101039026) <br>
2. [HQChart使用教程36-如何在uni-app创建走势图(h5)](https://blog.csdn.net/jones2000/article/details/101039673) <br>
3. [HQChart使用教程37-如何在uni-app创建k线图(app)](https://blog.csdn.net/jones2000/article/details/101075683) <br>
4. [HQChart使用教程38-如何在uni-app创建走势图(app)](https://blog.csdn.net/jones2000/article/details/101481960) <br>
5. [HQChart使用教程44-uniapp使用条件编译同时支持h5,app,小程序](https://blog.csdn.net/jones2000/article/details/102529190) <br>
6. [HQChart使用教程60-解决uniapp-app页面隐藏后在显示白屏的问题](https://blog.csdn.net/jones2000/article/details/105484202) <br>

## 第3方数据前端接入教程(走势图)
1. [HQChart使用教程29-走势图如何对接第3方数据1](https://blog.csdn.net/jones2000/article/details/100132357) <br>
2. [HQChart使用教程29-走势图如何对接第3方数据2-最新分时数据](https://blog.csdn.net/jones2000/article/details/100149703) <br>
3. [HQChart使用教程29-走势图如何对接第3方数据3-多日分时数据](https://blog.csdn.net/jones2000/article/details/100150842) <br>
4. [HQChart使用教程29-走势图如何对接第3方数据4-叠加股票分时数据](https://blog.csdn.net/jones2000/article/details/100167703) <br>
5. [HQChart使用教程29-走势图如何对接第3方数据4-异动提示信息](https://blog.csdn.net/jones2000/article/details/100516071) <br>
6. [HQChart使用教程29-走势图如何对接第3方数据5-指标数据](https://blog.csdn.net/jones2000/article/details/102426337) <br>
7. [HQChart使用教程29-走势图如何对接第3方数据6-websocket分钟数据](https://blog.csdn.net/jones2000/article/details/102568258) <br>

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
20. [HQChart使用教程30-K线图如何对接第3方数据20-信息地雷公告数据](https://blog.csdn.net/jones2000/article/details/105876161)<br>


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

## 火币对接完整教程（付费文章）
1. [HQChart实战教程10-全ws数据对接HQChart(数字货币对接实战)](https://blog.csdn.net/jones2000/article/details/105698038) <br>
2. [HQChart实战教程11-火币网ws数据对接](https://blog.csdn.net/jones2000/article/details/105721190) <br>
3. [HQChart实战教程12-火币网ws数据对接分时图](https://blog.csdn.net/jones2000/article/details/105756659) <br>
4. [HQChart实战教程13-火币网ws数据对接K线（uniapp)](https://blog.csdn.net/jones2000/article/details/105804461)<br>
5. [HQChart实战教程15-火币网ws数据对接拖拽下载历史K线图](https://blog.csdn.net/jones2000/article/details/106205584)<br>
6. [HQChart实战教程16-K线图风格配色篇-仿火币网H5配色](https://blog.csdn.net/jones2000/article/details/106226272)<br>


## 设计文档:
1. [如何(c++,js)写一个传统的K线图和走势图1](https://blog.csdn.net/jones2000/article/details/84779481) <br>
2. [如何(c++,js)写一个传统的K线图和走势图2-走势图](https://blog.csdn.net/jones2000/article/details/84840770) <br>
3. [如何(c++,js)写一个传统的K线图和走势图3-多指标窗口模式如何实现的](https://blog.csdn.net/jones2000/article/details/84979910) <br>
4. [如何(c++,js)写一个传统的K线图和走势图3-十字光标的绘制](https://blog.csdn.net/jones2000/article/details/85123680) <br>
5. [如何(c++,js)写一个传统的K线图和走势图4-K线图](https://blog.csdn.net/jones2000/article/details/85235463) <br>
6. [如何(c++,js)写一个传统的K线图和走势图5-移动筹码图](https://blog.csdn.net/jones2000/article/details/85356163) <br>

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


# QQ交流群(950092318) 
有bug,问题,新的功能需求都可以在QQ群里提 <br>
![QQ群](/小程序行情模块用例/image/qqcode.png)

# 商务
定制开发,数据购买，合作等商务事宜请联系 QQ:1586140774 

# 奖项
![GVP](/小程序行情模块用例/image/gvp.jpg)

# 赞助
![微信二维码](/小程序行情模块用例/image/wx_code.PNG)
