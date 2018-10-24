# 目录结构
--node.jccomplier  nodejs通达信脚本选股后台api模块. 使用restify webapi框架 <br>
--webhqchart 行情前端js代码模块 <br>
--wechathqchart 微信小程序行情前端js代码模块 <br>

--webhqchart.demo 页面行情测试用例 <br>
   |--jscommon 行情前端js代码 是webhqchart的一个拷贝 <br>
   |--demo  测试用 <br>

--小程序行情模块用例 小程序测试用例<br>

# HQChart 3.0
* 分网页版本 及 微信小程序版本 <br>
  ![走势图](/小程序行情模块用例/image/hqchart_minute.PNG)
  ![走势图2](/小程序行情模块用例/image/hqchart_minute2.PNG)
  ![走势图3](/小程序行情模块用例/image/hqchart_minute_hscreen.PNG)
  ![K线图](/小程序行情模块用例/image/hqchart_kline.PNG)
  ![K线图2](/小程序行情模块用例/image/hqchart_kline_lock.PNG)
  ![K线图3](/小程序行情模块用例/image/hqchart_kline_hscreen.PNG)
  
# 1. K线图
* 支持前复权,后复权 <br>
* 支持日线,月线,周线,年线.<br>
* 主图支持股票叠加 <br>
* 支持常用指标指标 <br>
    均线，BOLL，MACD，KDJ，VOL，RSI，BRAR，WR，BIAS，OBV，DMI，CR，PSY，CCI，
    DMA，TRIX，VR，EMV，ROC，MIM，FSL，CYR，MASS，WAD，CHO <br>
* 支持画图工具(小程序不支持)<br>
     线段，射线，矩形，圆弧线 <br>
* 支持区间统计， 区间形态匹配 (微信小程序版本不支持) <br>
* 数据鼠标左右拖拽移动, 键盘移动十字光标移动，键盘缩放 <br>
* 支持通达信语法指标
# 2. 走势图
* 支持指标 <br>
* 支持沪深和港股
* 分钟数据显示 <br>
# 3. 网页demo  <br>
* K线图  https://opensource.zealink.com/hqcomplier/phone7.html  <br>
* 走势图 https://opensource.zealink.com/hqcomplier/phone8.html  <br>
* 小程序demo 请搜索 ‘知临信息软件及数据服务介绍’ 或微信扫描 ![二维码](/小程序行情模块用例/image/wechatrcode.jpg)
