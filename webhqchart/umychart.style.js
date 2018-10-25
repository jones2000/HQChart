/*
    不同风格行情配置文件
*/


//黑色风格
var BLACK_STYLE=
{
  BGColor:'rgb(0,0,0)', //背景色
  TooltipBGColor: "rgb(255, 255, 255)", //背景色
  TooltipAlpha: 0.92,                  //透明度

  SelectRectBGColor: "rgba(1,130,212,0.06)", //背景色
  //  SelectRectAlpha: 0.06;                  //透明度

  UpBarColor: "rgb(238,21,21)",
  DownBarColor: "rgb(25,158,0)",
  UnchagneBarColor: "rgb(0,0,0)",

  Minute: 
  {
    VolBarColor: "rgb(255,236,0)",
    PriceColor: "rgb(25,180,231)",
    AvPriceColor: "rgb(255,236,0)",
  },


  DefaultTextColor: "rgb(101,104,112)",
  DefaultTextFont: '14px 微软雅黑',

  DynamicTitleFont: '12px 微软雅黑', //指标动态标题字体


  UpTextColor: "rgb(238,21,21)",
  DownTextColor: "rgb(25,158,0)",
  UnchagneTextColor: "rgb(101,104,112)",
  CloseLineColor: 'rgb(178,34,34)',

  FrameBorderPen: "rgba(236,236,236,0.13)",     //边框
  FrameSplitPen: "rgba(236,236,236,0.13)",          //分割线
  FrameSplitTextColor: "rgb(101,104,112)",     //刻度文字颜色
  FrameSplitTextFont: "12px 微软雅黑",        //坐标刻度文字字体
  FrameTitleBGColor: "rgb(0,0,0)",      //标题栏背景色

  CorssCursorBGColor: "rgb(43,54,69)",            //十字光标背景
  CorssCursorTextColor: "rgb(255,255,255)",
  CorssCursorTextFont: "12px 微软雅黑",
  CorssCursorPenColor: "rgb(130,130,130)",           //十字光标线段颜色

  KLine:
  {
    MaxMin: { Font: '12px 微软雅黑', Color: 'rgb(111,111,111)' },   //K线最大最小值显示
    Info:  //信息地雷
    {
      Color: 'rgb(205,149,12)',
      TextColor: '#afc0da',
      TextBGColor: '#1a283e',
    }
  },

  Index: 
  {      
    LineColor:  //指标线段颜色
    [
      "rgb(255,189,09)",
      "rgb(22,198,255)",
      "rgb(174,35,161)",
      "rgb(236,105,65)",
      "rgb(68,114,196)",
      "rgb(229,0,79)",
      "rgb(0,128,255)",
      "rgb(252,96,154)",
      "rgb(42,230,215)",
      "rgb(24,71,178)",

    ],
    NotSupport: { Font: "14px 微软雅黑", TextColor: "rgb(52,52,52)" }
  },
    
  ColorArray:       //自定义指标默认颜色
  [
    "rgb(255,174,0)",
    "rgb(25,199,255)",
    "rgb(175,95,162)",
    "rgb(236,105,65)",
    "rgb(68,114,196)",
    "rgb(229,0,79)",
    "rgb(0,128,255)",
    "rgb(252,96,154)",
    "rgb(42,230,215)",
    "rgb(24,71,178)",
  ],

  DrawPicture:  //画图工具
  {
    LineColor: "rgb(30,144,255)",
    PointColor: "rgb(105,105,105)",
  }
    
};

var STYLE_TYPE_ID=
{
    BLACK_ID:1, //黑色风格
}

function HQChartStyle()
{

}

HQChartStyle.GetStyleConfig=function(styleid)    //获取一个风格的配置变量
{
  switch (styleid)
  {
      case STYLE_TYPE_ID.BLACK_ID:
          return BLACK_STYLE;
      default:
          return null;
  }
}



