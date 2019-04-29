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
* 支持画图工具(小程序不支持)<br>
     线段，射线，矩形，圆弧线,水平线,趋势线,平行线,平行通道,价格通道线,文本,江恩角度线,阻速线,黄金分割,百分比线,波段线,三角形,对称角度,斐波那契周期线,平行四边形,圆, iconfont图片 <br>
* 支持区间统计， 区间形态匹配 (微信小程序版本不支持) <br>
* 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 <br>
* 支持通达信语法指标
* 支持五彩K线(目前录入系统五彩K线30多个), 支持自定义通达信语法脚本的五彩K线
* 支持专家系统指标
* 支持个股筹码图
# 2. 走势图
* 支持指标 <br>
* 支持股票叠加<br>
* 支持沪深和港股,国内期货(开发中)<br>
* 分钟数据显示 <br>
* 支持多日分钟数据显示<br>
# 3. 网页demo  <br>
* K线图  https://opensource.zealink.com/hqweb/demo/phone7.html  <br>
* 走势图 https://opensource.zealink.com/hqweb/demo/phone8.html  <br>
* 走势图手机页面 https://opensource.zealink.com/hqweb/demo/phone2.html  <br>
* K线图手机页面  https://opensource.zealink.com/hqweb/demo/phone.html  <br>
* 横版走势图手机页面 https://opensource.zealink.com/hqweb/demo/phone10.html  <br>
* 横版K线图手机页面  https://opensource.zealink.com/hqweb/demo/phone9.html  <br>
* 多日走势图 https://opensource.zealink.com/hqweb/demo/phone15.html <br>
* 个股筹码图 https://opensource.zealink.com/hqweb/demo/phone18.html <br>

* 小程序demo 请搜索 ‘知临信息软件及数据服务介绍’ 或微信扫描 ![二维码](/小程序行情模块用例/image/wechatrcode.jpg)
* QQ交流群(950092318) ![QQ群](/小程序行情模块用例/image/qqcode.png)

* pc网页版行情目前正在开发中,基于VUE框架开发 <br>
  ![走势图2](/小程序行情模块用例/image/pch5hq.PNG)
   行情页面地址(v1.0） https://opensource.zealink.com/vuehqweb/hq.demo.page.html <br>
  ![历史高频数据查询图2](/小程序行情模块用例/image/pch5history.PNG)
   查询页面地址 https://opensource.zealink.com/vuehqweb/queryContent.demo.page.html <br>
  ![多周期图2](/小程序行情模块用例/image/pch5hq2.png)
   多周期页面地址 https://opensource.zealink.com/vuehqweb/stockmultiperiod.demo.page.html <br>
   ![综合排名2](/小程序行情模块用例/image/pch5hq3.png)
   综合排名页面地址 https://opensource.zealink.com/vuehqweb/stockmultiorder.demo.page.html <br>
