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
* 支持画图工具,支持保存到本地或保存在内存中(小程序不支持)<br>
     线段，射线，矩形，圆弧线,水平线,趋势线,平行线,平行通道,价格通道线,文本,江恩角度线,阻速线,黄金分割,百分比线,波段线,三角形,对称角度,斐波那契周期线,平行四边形,圆, iconfont图片 <br>
* 支持区间统计， 区间形态匹配 (微信小程序版本不支持) <br>
* 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 <br>
* 支持麦语法 [内置系统函数说明](https://opensourcecdn.zealink.com/cache/webcache/hqfunctionhelp/index.html)
* 支持通达信语法指标
* 支持五彩K线(目前录入系统五彩K线30多个), 支持自定义通达信语法脚本的五彩K线
* 支持专家系统指标
* 支持个股筹码图 ![K线图](/小程序行情模块用例/image/hqchart_kline2.png)
* 支持单指标单股票前端回测计算 (webhqchart\umychart.regressiontest.js) (2019-5-13 增加功能)<br>
     计算如下数据:  <br>   
          Trade: {Count 交易次数  Days:交易天数 Success:成功交易次数 Fail:失败交易次数} <br>
          Day: {Count:总运行  Max:最长运行 Min:最短运行 Average:平均运行} <br>
          Profit: 总收益 StockProfit:个股收益  Excess:超额收益 MaxDropdown:最大回撤 Beta:β(Beta)系数 <br>
          NetValue: [ {Date:日期, Net:净值, Close:股票收盘价, IndexClose:大盘的收盘价}, ] <br>
* 支持弹幕
* 支持多指标叠加 (2019-7-12 新加功能)  ![K线图](/小程序行情模块用例/image/hqchart_kline_lock2.png)
* 支持截图 (2019-7-9 新加功能)
* 支持K线日线数据或分钟数据自动更新 (2019-7-23)

# 2. 走势图
* 支持指标 <br>
* 支持股票叠加<br>
* 支持沪深和港股,国内期货(开发中)<br>
* 分钟数据显示 <br>
* 支持多日分钟数据显示<br>
* 支持A股集合竞价显示/隐藏 (2019-7-12 新加功能) ![走势图2](/小程序行情模块用例/image/hqchart_minute3.png)
* 支持指数领先指标(2019-7-15  新加功能) ![K线图](/小程序行情模块用例/image/hqchart_kline_lock3.png)

# 3. 网页demo  <br>
* [K线图](https://opensource.zealink.com/hqweb/demo/phone7.html)  <br>
* [走势图](https://opensource.zealink.com/hqweb/demo/phone8.html)  <br>
* [走势图手机页面](https://opensource.zealink.com/hqweb/demo/phone2.html)  <br>
* [K线图手机页面](https://opensource.zealink.com/hqweb/demo/phone.html)  <br>
* [横版走势图手机页面](https://opensource.zealink.com/hqweb/demo/phone10.html)  <br>
* [横版K线图手机页面](https://opensource.zealink.com/hqweb/demo/phone9.html)  <br>
* [多日走势图](https://opensource.zealink.com/hqweb/demo/phone15.html) <br>
* [个股筹码图](https://opensource.zealink.com/hqweb/demo/phone18.html) <br>
* [指标回测(手机版)](https://opensource.zealink.com/hqweb/operatebsh5/index.html?symbol=000001.sz) <br>
* [K线训练](https://opensource.zealink.com/hqweb/demo/phone13.html) <br>
* [弹幕功能](https://opensource.zealink.com/hqweb/demo/phone21.html) <br>
* [多指标叠加](https://opensource.zealink.com/hqweb/demo/phone22.html) <br>
* [截面数据(财务数据)计算器](https://opensource.zealink.com/hqweb/demo/sectiondatatest.html) <br>

# 4.使用教程
1. [如何快速创建一个K线图页面](https://blog.csdn.net/jones2000/article/details/90272733) <br>
2. [如何把自定义指标显示在K线图页面](https://blog.csdn.net/jones2000/article/details/90273684) <br>
3. [如何把指标上锁显示在K线图页面](https://blog.csdn.net/jones2000/article/details/90285723) <br>
4. [如何自定义K线图颜色风格](https://blog.csdn.net/jones2000/article/details/90286933) <br>
5. [K线图控件操作函数说明](https://blog.csdn.net/jones2000/article/details/90301000) <br>
6. [如何获取K线图上的指标数据进行回测](https://blog.csdn.net/jones2000/article/details/90314625) <br>
7. [如何快速创建一个分时图页面](https://blog.csdn.net/jones2000/article/details/90319619) <br>
8. [如何快速创建K线训练页面](https://blog.csdn.net/jones2000/article/details/90478687) <br>
9. [手机端页面设置的几个特殊属性](https://blog.csdn.net/jones2000/article/details/90727468) <br>
10. [如何把K线数据API替换成自己的API数据](https://blog.csdn.net/jones2000/article/details/90747715) <br>
11. [如何快速创建一个横屏分时图页面](https://blog.csdn.net/jones2000/article/details/90453776) <br>
12. [分析家语法执行器](https://blog.csdn.net/jones2000/article/details/93731637) <br>
13. [分钟完成一个小程序K线图](https://blog.csdn.net/jones2000/article/details/91471252) <br>
14. [如何在K线图上添加弹幕](https://blog.csdn.net/jones2000/article/details/91125408) <br>
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
26. [HQChart小程序教程1-如何快速的创建一个K线图](https://developers.weixin.qq.com/community/develop/article/doc/0006c451ac81589915b89d1c55bc13) <br>
27. [HQChart使用教程26- K线图及走势图数据自动更新设置](https://blog.csdn.net/jones2000/article/details/99483328) <br>

**设计文档:**
1. [如何(c++,js)写一个传统的K线图和走势图1](https://blog.csdn.net/jones2000/article/details/84779481) <br>
2. [如何(c++,js)写一个传统的K线图和走势图2-走势图](https://blog.csdn.net/jones2000/article/details/84840770) <br>
3. [如何(c++,js)写一个传统的K线图和走势图3-多指标窗口模式如何实现的](https://blog.csdn.net/jones2000/article/details/84979910) <br>
4. [如何(c++,js)写一个传统的K线图和走势图3-十字光标的绘制](https://blog.csdn.net/jones2000/article/details/85123680) <br>
5. [如何(c++,js)写一个传统的K线图和走势图4-K线图](https://blog.csdn.net/jones2000/article/details/85235463) <br>
6. [如何(c++,js)写一个传统的K线图和走势图5-移动筹码图](https://blog.csdn.net/jones2000/article/details/85356163) <br>

* 小程序demo 请搜索 ‘知临信息软件及数据服务介绍’ 或微信扫描 ![二维码](/小程序行情模块用例/image/wechatrcode.jpg)
* QQ交流群(950092318) ![QQ群](/小程序行情模块用例/image/qqcode.png)

# 5.VUE 行情项目

* pc网页版行情目前正在开发中,基于VUE框架开发 <br>
  ![走势图2](/小程序行情模块用例/image/pch5hq.PNG)
   [行情页面地址(v1.0）](https://opensource.zealink.com/vuehqweb/hq.demo.page.html) <br><br>
  ![历史高频数据查询图2](/小程序行情模块用例/image/pch5history.PNG)
   [查询页面地址](https://opensource.zealink.com/vuehqweb/queryContent.demo.page.html) <br><br>
  ![多周期图2](/小程序行情模块用例/image/pch5hq2.png)
   [多周期页面地址](https://opensource.zealink.com/vuehqweb/stockmultiperiod.demo.page.html) <br><br>
   ![综合排名2](/小程序行情模块用例/image/pch5hq3.png)
   [综合排名页面地址](https://opensource.zealink.com/vuehqweb/stockmultiorder.demo.page.html) <br><br>
   
   ## 基于VUE版本给客户开发的样例
   [指数行情页面黑色风格](https://opensource.zealink.com/cninfoHq/oneStockHq.html?symbol=000001.sh&colorType=black) <br>
   [个股行情页面白色风格](https://opensource.zealink.com/cninfoHq/oneStockHq.html?symbol=000001.sz) <br>
   ## js页面样例
   [个股详情手机端h5](https://opensource.zealink.com/hqweb/hqpages/stockpage.html?) <br>
