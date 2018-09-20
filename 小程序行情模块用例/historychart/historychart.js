//index.js
//获取应用实例
const app = getApp()

import { JSCommon } from "../../jscommon/umychart.wechat.3.0.js";

Page(
  {
    data:
    {
      Height: 0,
      Width: 0
    },

    HistoryChart: null,

    HistoryOption:
    {
      Type: '历史K线图',
      Windows: //窗口指标
      [
        { "Index": "均线", "Modify": false, "Change": false, TitleHeight: 16 },
        { "Index": "VOL", "Modify": false, "Change": false, TitleHeight: 16 }
      ],
      Symbol: "000001.sh",
      IsAutoUpate: true,       //是自动更新数据

      IsShowCorssCursorInfo: false,    //是否显示十字光标的刻度信息

      KLine:
      {
        DragMode: 1,                 //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
        Right: 1,                    //复权 0 不复权 1 前复权 2 后复权
        Period: 0,                   //周期 0 日线 1 周线 2 月线 3 年线
        MaxReqeustDataCount: 1000,   //数据个数
        PageSize: 40,               //一屏显示多少数据
      },

      KLineTitle: //标题设置
      {
        IsShowName: false,       //不显示股票名称
        IsShowSettingInfo: false //不显示周期/复权
      },

      Border: //边框
      {
        Left: 2,    //左边间距
        Right: 2     //右边间距
      },

      Frame:  //子框架设置
      [
        { SplitCount: 3, StringFormat: 1 },
        { SplitCount: 3, StringFormat: 1 }
      ]
    },

    onLoad: function () {
      var self = this

      // 获取系统信息
      wx.getSystemInfo({
        success: function (res) {
          console.log(res);
          // 可使用窗口宽度、高度
          console.log('height=' + res.windowHeight);
          console.log('width=' + res.windowWidth);
          self.setData({ Height: res.windowHeight, Width: res.windowWidth });
        }
      });

    },

    onReady: function () 
    {
        //创建历史K线类
        var element = new JSCommon.JSCanvasElement();
        element.ID = 'historychart';

        element.Height = this.data.Height;   //高度宽度需要手动绑定!! 微信没有元素类
        element.Width = this.data.Width;
        this.HistoryChart = JSCommon.JSChart.Init(element); //把画布绑定到行情模块中
        this.HistoryChart.SetOption(this.HistoryOption);

        /*
        element.Height = this.data.Width;   //高度宽度需要手动绑定!! 微信没有元素类
        element.Width = this.data.Height;
        this.HistoryChart = JSCommon.JSChart.Init(element);
        this.HistoryChart.SetOption(this.HistoryOption);
        this.HistoryChart.ForceLandscape(true);  //强制横屏
        */
    },

    //K线图事件
    historytouchstart: function (event) {
      if (this.HistoryChart) this.HistoryChart.OnTouchStart(event);
    },
    historytouchmove: function (event) {
      if (this.HistoryChart) this.HistoryChart.OnTouchMove(event);
    },
    historytouchend: function (event) {
      if (this.HistoryChart) this.HistoryChart.OnTouchEnd(event);
    },


  })
