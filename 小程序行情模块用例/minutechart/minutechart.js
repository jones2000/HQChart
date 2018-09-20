//index.js
//获取应用实例
const app = getApp()

import { JSCommon } from "../../jscommon/umychart.wechat.3.0.js";

Page(
  {
    data: 
    {
      Height:0,
      Width:0
    },

    MinuteChart: null,
    MinuteOption:
    {
      Type: '分钟走势图',
      Symbol: "600000.sh",
      IsAutoUpate: true,       //是自动更新数据

      IsShowCorssCursorInfo: false,    //是否显示十字光标的刻度信息

      Border: //边框
      {
        Left: 1,    //左边间距
        Right: 1,     //右边间距
        Top: 20
      },

      KLineTitle: //标题设置
      {
        IsShowName: false,       //不显示股票名称
        IsShowSettingInfo: false //不显示周期/复权
      },

      Frame:  //子框架设置,刻度小数位数设置
      [
        { SplitCount: 5, StringFormat: 1 },
        { SplitCount: 3, StringFormat: 1 }
      ]
    },

    onLoad:function()
    {
      var self = this

      // 获取系统信息
      wx.getSystemInfo({
        success: function (res) 
        {
          console.log(res);
          // 可使用窗口宽度、高度
          console.log('height=' + res.windowHeight);
          console.log('width=' + res.windowWidth);
          self.setData({ Height: res.windowHeight, Width: res.windowWidth});
        }
      });

    },

    onReady: function () 
    {
      //创建走势图类

        console.log(this);
        var element2 = new JSCommon.JSCanvasElement();
        element2.ID = 'minutechart';

        element2.Height = this.data.Height;  //高度宽度需要手动绑定!!
        element2.Width = this.data.Width;

        this.MinuteChart = JSCommon.JSChart.Init(element2);
        this.MinuteChart.SetOption(this.MinuteOption);


        /*    横板设置 小程序目前不支持
        element2.Height = this.data.Width;  //高度宽度需要手动绑定!!
        element2.Width = this.data.Height;

        this.MinuteChart = JSCommon.JSChart.Init(element2);
        this.MinuteChart.SetOption(this.MinuteOption);
        this.MinuteChart.ForceLandscape(true);  //强制横屏
        */
    },

    //走势图事件
    minutetouchstart: function (event) {
      if (this.MinuteChart) this.MinuteChart.OnTouchStart(event);
    },
    minutetouchmove: function (event) {
      if (this.MinuteChart) this.MinuteChart.OnTouchMove(event);
    },
    minutetouchend: function (event) {
      if (this.MinuteChart) this.MinuteChart.OnTouchEnd(event);
    }


  })
