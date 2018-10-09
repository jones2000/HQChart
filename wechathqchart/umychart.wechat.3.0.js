/*
    开源项目 https://github.com/jones2000/HQChart

    封装图形控件 (微信小程序版本)
*/

 //行情数据结构体 及涉及到的行情算法(复权,周期等) 
import { 
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData, 
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData } from "umychart.data.wechat.js";            

import { JSCommonComplier } from "umychart.complier.wechat.js";     //通达信编译器
import { JSCommonIndexScript } from "umychart.index.data.wechat.js"; //系统指标定义
import { JSCommon_HQIndexFormula as HQIndexFormula } from "umychart.hqIndexformula.wechat.js";     //通达信编译器

function JSCanvasElement()
{
    this.Height;
    this.Width;
    this.ID;

    //获取画布
    this.GetContext=function()
    {
        return wx.createCanvasContext(this.ID);
    }
}

function JSChart(element)
{
    this.JSChartContainer;              //画图控件
    this.CanvasElement=element;

    this.OnSize=function()
    {
        if (this.JSChartContainer && this.JSChartContainer.Frame)
            this.JSChartContainer.Frame.SetSizeChage(true);

        if (this.JSChartContainer) this.JSChartContainer.Draw();
    }

    //历史K线图
    this.CreateKLineChartContainer=function(option)
    {
        var chart = null;
        if (option.Type === "历史K线图横屏") chart = new KLineChartHScreenContainer(this.CanvasElement);
        else chart=new KLineChartContainer(this.CanvasElement);

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.DragMode>=0) chart.DragMode=option.KLine.DragMode;
            if (option.KLine.Right>=0) chart.Right=option.KLine.Right;
            if (option.KLine.Period>=0) chart.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) chart.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.KLineDoubleClick==false) chart.MinuteDialog=this.MinuteDialog=null;
            
            if (option.KLine.MaxRequestMinuteDayCount>0) chart.MaxRequestMinuteDayCount=option.KLine.MaxRequestMinuteDayCount;
        }

        if (!option.Windows || option.Windows.length<=0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.KLine)
        {
            if (option.KLine.PageSize > 0) 
            {
                let maxPageSize = chart.GetMaxPageSize();
                if (maxPageSize < option.KLine.PageSize) chart.PageSize = maxPageSize;
                else chart.PageSize = option.KLine.PageSize;
            }
        }

        if (option.IsShowCorssCursorInfo == false)    //取消显示十字光标刻度信息
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;

        if (option.IsShowCorssCursor == false) 
            chart.ChartCorssCursor.IsShow = option.IsShowCorssCursor;
        
        if (typeof (option.UpdateUICallback) == 'function') //数据到达回调
            chart.UpdateUICallback = option.UpdateUICallback;

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
                if (!isNaN(item.Height)) chart.Frame.SubFrame[i].Height = item.Height;
                if (item.IsShowBorder == false) chart.Frame.SubFrame[i].Frame.IsShowBorder = item.IsShowBorder;
                if (item.IsShowXLine == false) chart.Frame.SubFrame[i].Frame.IsShowXLine = item.IsShowXLine;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
                if (item.IsShowTitle == false) chart.Frame.SubFrame[i].Frame.IsShowTitle = false;
                if (item.UpdateTitleUICallback && chart.Frame.SubFrame[i].Frame.TitlePaint) 
                    chart.Frame.SubFrame[i].Frame.TitlePaint.UpdateUICallback = item.UpdateTitleUICallback;
            }
        }

        if (option.KLine)
        {
          if (option.KLine.ShowKLine == false) chart.ChartPaint[0].IsShow=false;
        }

        if(option.KLineTitle)
        {
            if(option.KLineTitle.IsShowName==false) chart.TitlePaint[0].IsShowName=false;
            if(option.KLineTitle.IsShowSettingInfo==false) chart.TitlePaint[0].IsShowSettingInfo=false;
            if(option.KLineTitle.IsShow == false) chart.TitlePaint[0].IsShow=false;
            if (option.KLineTitle.UpdateUICallback) chart.TitlePaint[0].UpdateUICallback = option.KLineTitle.UpdateUICallback
        }

        //叠加股票
        if (option.Overlay && option.Overlay.length) 
        {
            chart.OverlayChartPaint[0].Symbol = option.Overlay[0].Symbol;
        }

        //创建子窗口的指标
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[i] = new ScriptIndex(item.Name, item.Script, item.Args,item);    //脚本执行
            }
            else
            {
                var indexItem = JSIndexMap.Get(item.Index); //自定义指标
                if (indexItem)
                {
                    chart.WindowIndex[i] = indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else    //系统指标里查找
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock = item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
                }
            }

            if (item.Modify!=null) chart.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null) chart.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;
            if (typeof (item.UpdateUICallback) == 'function') chart.WindowIndex[i].UpdateUICallback = item.UpdateUICallback;
            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight = item.TitleHeight;
        }

        return chart;
    }

      //自定义指数历史K线图
    this.CreateCustomKLineChartContainer=function(option)
    {
        var chart=new CustomKLineChartContainer(this.CanvasElement);

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.DragMode>=0) chart.DragMode=option.KLine.DragMode;
            if (option.KLine.Right>=0) chart.Right=option.KLine.Right;
            if (option.KLine.Period>=0) chart.Period=option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount>0) chart.MaxReqeustDataCount=option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length>0) chart.SetKLineInfo(option.KLine.Info,false);
            if (option.KLine.KLineDoubleClick==false) chart.MinuteDialog=this.MinuteDialog=null;
            if (option.KLine.PageSize>0)  chart.PageSize=option.KLine.PageSize;
            if (option.KLine.IsShowTooltip==false) chart.IsShowTooltip=false;
        }

        if (option.CustomStock) chart.CustomStock=option.CustomStock;
        if (option.QueryDate) chart.QueryDate=option.QueryDate;
        if (typeof (option.UpdateUICallback) == 'function') chart.UpdateUICallback = option.UpdateUICallback;

        if (!option.Windows || option.Windows.length<=0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
            
        }

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
            }
        }

        if(option.KLineTitle)
        {
            if(option.KLineTitle.IsShowName==false) chart.TitlePaint[0].IsShowName=false;
            if(option.KLineTitle.IsShowSettingInfo==false) chart.TitlePaint[0].IsShowSettingInfo=false;
        }

        //创建子窗口的指标
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[i] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
            }
            else
            {
                var indexItem=JSIndexMap.Get(item.Index);
                if (indexItem)
                {
                    chart.WindowIndex[i]=indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else //系统指标里查找
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock = item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
                }
            }

            if (item.Modify!=null)
                chart.Frame.SubFrame[i].Frame.ModifyIndex=item.Modify;
            if (item.Change!=null)
                chart.Frame.SubFrame[i].Frame.ChangeIndex=item.Change;

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight=item.TitleHeight;
        }

        return chart;
    }

    //分钟走势图
    this.CreateMinuteChartContainer=function(option)
    {
        var chart = null;
        if (option.Type === "分钟走势图横屏") chart = new MinuteChartHScreenContainer(this.CanvasElement);
        else chart=new MinuteChartContainer(this.CanvasElement);

        var windowsCount=2;
        if (option.Windows && option.Windows.length>0) windowsCount+=option.Windows.length; //指标窗口从第3个窗口开始

        chart.Create(windowsCount);                            //创建子窗口

        if (option.IsShowCorssCursorInfo==false)    //取消显示十字光标刻度信息
        {
            chart.ChartCorssCursor.IsShowText=option.IsShowCorssCursorInfo;
        }

        if (option.Border)
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.Frame)
        {
            for(var i in option.Frame)
            {
                var item=option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount=item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat=item.StringFormat;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
            }
        }

        
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        for (var i in option.Windows)   //分钟数据指标从第3个指标窗口设置
        {
            var item = option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[2 + parseInt(i)] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
            }
            else 
            {
                var indexItem = JSIndexMap.Get(item.Index);
                if (indexItem) 
                {
                    chart.WindowIndex[2 + parseInt(i)] = indexItem.Create();       //创建子窗口的指标
                    chart.CreateWindowIndex(2 + parseInt(i));
                }
                else 
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock = item.Lock;
                    chart.WindowIndex[2 + parseInt(i)] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
                }
            }
        }

        return chart;
    }

    //历史分钟走势图
    this.CreateHistoryMinuteChartContainer=function(option)
    {
        var chart=new HistoryMinuteChartContainer(this.CanvasElement);

        var windowsCount=2;
        if (option.Windows && option.Windows.length>0) windowsCount+=option.Windows.length; //指标窗口从第3个窗口开始

        chart.Create(windowsCount);                            //创建子窗口

        for(var i in option.Windows)
        {
            var item=option.Windows[i];
            var indexItem=JSIndexMap.Get(item.Index);
            if (!indexItem) return null;

            chart.WindowIndex[2+parseInt(i)]=indexItem.Create();       //创建子窗口3的指标
            chart.CreateWindowIndex(2+parseInt(i));
        }

        if (!option.HistoryMinute.TradeDate) return null;

        chart.TradeDate=option.HistoryMinute.TradeDate;
        if (option.HistoryMinute.IsShowName!=null) chart.TitlePaint[0].IsShowName=option.HistoryMinute.IsShowName;  //动态标题是否显示股票名称
        if (option.HistoryMinute.IsShowDate!=null) chart.TitlePaint[0].IsShowDate=option.HistoryMinute.IsShowDate;  //动态标题是否显示日期

        return chart;
    }

    //根据option内容绘制图形
    this.SetOption=function(option)
    { 
      console.log(option,'option')
        var chart=null;
        switch(option.Type)
        {
            case "历史K线图":
            case '历史K线图横屏':
                chart=this.CreateKLineChartContainer(option);
                break;
            case "自定义指数历史K线图":
                chart=this.CreateCustomKLineChartContainer(option);
                break;
            case "分钟走势图":
            case "分钟走势图横屏":
                chart=this.CreateMinuteChartContainer(option);
                break;
            case "历史分钟走势图":
                chart=this.CreateHistoryMinuteChartContainer(option);
                break;
            case "简单图形":
                return this.CreateSimpleChart(option);
            case "饼图":
                return this.CreatePieChart(option);
            case '地图':
                return this.CreateMapChart(option);
            default:
                return false;
        }

        if (!chart) return false;

        //是否自动更新
        if(option.IsAutoUpate!=null) chart.IsAutoUpate=option.IsAutoUpate;

        //设置股票代码
        if (!option.Symbol) return false;
        chart.Draw();
        chart.ChangeSymbol(option.Symbol);

        this.JSChartContainer=chart;
        this.JSChartContainer.Draw();
    }

    //切换股票代码接口
    this.ChangeSymbol=function(symbol)
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol);
    }

    //K线切换指标
    this.ChangeIndex=function(windowIndex,indexName)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeIndex)=='function')
            this.JSChartContainer.ChangeIndex(windowIndex,indexName);
    }

    //切换K线指标
    this.ChangeScriptIndex=function(windowIndex,indexData)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeScriptIndex)=='function')
            this.JSChartContainer.ChangeScriptIndex(windowIndex,indexData);
    }

    //K线周期切换
    this.ChangePeriod=function(period)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangePeriod)=='function')
            this.JSChartContainer.ChangePeriod(period);
    }

    //K线复权切换
    this.ChangeRight=function(right)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.ChangeRight)=='function')
            this.JSChartContainer.ChangeRight(right);
    }

    //切换数据类
    this.ChangMainDataControl=function(dataControl)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.SetMainDataConotrl)=='function') 
            this.JSChartContainer.SetMainDataConotrl(dataControl);
    }

    //叠加股票
    this.OverlaySymbol = function (symbol)
    {
      if (this.JSChartContainer && typeof (this.JSChartContainer.OverlaySymbol) == 'function')
          this.JSChartContainer.OverlaySymbol(symbol);
    }

    //设置强制横屏
    this.ForceLandscape=function(bForceLandscape)
    {
        if (this.JSChartContainer) 
        {
            console.log("[JSChart::ForceLandscape] bForceLandscape="+bForceLandscape);
            this.JSChartContainer.IsForceLandscape=bForceLandscape;
        }
    }

    //锁|解锁指标
    this.LockIndex = function (lockData) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.LockIndex) == 'function') 
        {
            console.log('[JSChart:LockIndex] lockData', lockData);
            this.JSChartContainer.LockIndex(lockData);
        }
    }

    this.StopAutoUpdata=function()
    {
      if (this.JSChartContainer && typeof (this.JSChartContainer.Stop)=='function')
      {
          console.log("[JSChart::StopAutoUpdata] Stop.");
          this.JSChartContainer.Stop();
      }
    }

    this.CreateSimpleChart=function(option)
    {
        var chart=new SimlpleChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl=option.MainDataControl;
        if (option.FrameType>0) chart.FrameType=option.FrameType;
        if (!isNaN(option.SplitCount)) chart.YSplitCount = option.SplitCount;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
            if (!isNaN(option.Border.TitleHeight)) chart.Frame.ChartBorder.TitleHeight = option.Border.TitleHeight;
        }

        if (option.XFontType) chart.Frame.XFontType = option.XFontType;

        if (option.Frame) 
        {
            if (option.Frame[0].MaxDistanceWidth) chart.Frame.MaxDistanceWidth = option.Frame[0].MaxDistanceWidth;
            if (option.Frame[0].IsShowBorder !=null) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
            if (option.Frame[0].StringFormat) chart.Frame.YSplitOperator.StringFormat = option.Frame[0].StringFormat;
        }

        chart.Draw();
        chart.RequestData();

        this.JSChartContainer=chart;
        this.JSChartContainer.Draw();
    }

    //创建饼图
    this.CreatePieChart = function (option) 
    {
        var chart = new PieChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl = option.MainDataControl;

        if (option.Radius) chart.Radius = option.Radius;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.Frame ) 
        {
          if (option.Frame[0].IsShowBorder == false) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
        }

        chart.Draw();
        chart.RequestData();

        this.JSChartContainer = chart;
        this.JSChartContainer.Draw();

    }

    //中国地图
    this.CreateMapChart = function (option) 
    {
        var chart = new MapChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl = option.MainDataControl;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.Frame) 
        {
          if (option.Frame[0].IsShowBorder == false) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
        }

        chart.Draw();
        chart.RequestData();

        this.JSChartContainer = chart;
        this.JSChartContainer.Draw();
    }

    this.OnTouchStart=function(e)
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchstart(e);
    }

    this.OnTouchMove=function(e)
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchmove(e);
    }

    this.OnTouchEnd=function(e)
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchend(e);
    }

    this.SaveToImage=function(callback)
    {
      if (this.JSChartContainer && typeof (this.JSChartContainer.SaveToImage) == 'function')
          this.JSChartContainer.SaveToImage(callback);
    }
}

//初始化
JSChart.Init = function (uielement)
{
    var jsChartControl = new JSChart(uielement);
    jsChartControl.OnSize();

    return jsChartControl;
}

JSChart.SetDomain=function(domain,cacheDomain)
{
    if (domain) 
    {
      g_JSChartResource.Domain=domain;
      
      g_JSChartResource.Index.StockHistoryDayApiUrl = domain + "/API/StockHistoryDay";  //历史数据api
      g_JSChartResource.Index.MarketLongShortApiUrl = domain + "/API/FactorTiming";     //市场多空
      g_JSChartResource.Index.MarketAttentionApiUrl = domain + "/API/MarketAttention";  //市场关注度
      g_JSChartResource.Index.MarketHeatApiUrl = domain + "/API/MarketHeat";            //行业,指数热度
      
    }

    if (cacheDomain) g_JSChartResource.CacheDomain=cacheDomain;

    JSCommonComplier.JSComplier.SetDomain(domain, cacheDomain);     //编译器数据api域名修改      
}

/*
    图形控件
*/
function JSChartContainer(uielement)
{
    this.ClassName = 'JSChartContainer';
    var _self = this;
    this.Frame;                                     //框架画法
    this.ChartPaint=new Array();                    //图形画法
    this.ChartInfo=new Array();                     //K线上信息地雷
    this.ExtendChartPaint=new Array();              //扩展画法
    this.TitlePaint=new Array();                    //标题画法
    this.OverlayChartPaint=new Array();             //叠加信息画法
    this.ChartDrawPicture=new Array();              //画图工具
    this.CurrentChartDrawPicture=null;              //当前的画图工具
    this.SelectChartDrawPicture=null;               //当前选中的画图
    this.ChartCorssCursor;                          //十字光标
    this.ChartSplashPaint=null;                     //等待提示
    this.SplashTitle ='数据加载中';
    this.Canvas=uielement.GetContext("2d");         //画布
    this.UIElement=uielement;
    this.MouseDrag;
    this.DragMode=1;                                //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择

    this.TouchTimer=null;         //触屏定时器  

    this.CursorIndex=0;             //十字光标X轴索引
    this.LastPoint=new Point();     //鼠标位置
    this.IsForceLandscape=false;    //是否强制横屏

    //坐标轴风格方法 double-更加数值型分割  price-更加股票价格分割
    this.FrameSplitData=new Map();
    this.FrameSplitData.set("double",new SplitData());
    this.FrameSplitData.set("price",new PriceSplitData());

    this.UpdateUICallback;  //数据到达通知前端

    //判断是单个手指
    function IsPhoneDragging(e)
    {
        // console.log(e);
        var changed=e.changedTouches.length;
        var touching=e.touches.length;

        return changed==1 && touching==1;
    }

    //是否是2个手指操所
    function IsPhonePinching(e)
    {
        var changed=e.changedTouches.length;
        var touching=e.touches.length;

        return (changed==1 || changed==2) && touching==2;
    }

    function GetToucheData(e, isForceLandscape)
    {
        var touches=new Array();
        for(var i=0; i<e.touches.length; ++i)
        {
            var item=e.touches[i];
            if (isForceLandscape)
            {
                touches.push(
                    {
                        clientX:item.y, clientY:item.x, 
                        pageX:item.y, pageY:item.x
                    });
            }
            else
            {
                touches.push(
                    {
                        clientX:item.x, clientY:item.y, 
                        pageX:item.x, pageY:item.y
                    });
            }
        }

        return touches;
    }

    //手机拖拽
    this.ontouchstart=function(e)
    {
        var jsChart = this;
        if (jsChart.DragMode==0) return;

        jsChart.PhonePinch=null;

        if (IsPhoneDragging(e))
        {
            if (jsChart.TryClickLock)
            {
                var touches = GetToucheData(e, jsChart.IsForceLandscape);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            if (this.TouchTimer!=null) clearTimeout(this.TouchTimer);
            if (this.ChartCorssCursor.IsShow==true)
            {
              this.TouchTimer=setTimeout(function()
              {
                  if (drag.Click.X==drag.LastMove.X && drag.Click.Y==drag.LastMove.Y) //手指没有移动，出现十字光标
                  {
                      var mouseDrag=jsChart.MouseDrag;
                      jsChart.MouseDrag=null;
                      //移动十字光标
                      var x = drag.Click.X;
                      var y = drag.Click.Y;
                      if (jsChart.IsForceLandscape) y = jsChart.UIElement.Height-drag.Click.Y;    //强制横屏Y计算
                      jsChart.OnMouseMove(x,y,e);
                  }

              }, 800);
            }

            var drag=
            {
                "Click":{},
                "LastMove":{},  //最后移动的位置
            };

            var touches=GetToucheData(e,jsChart.IsForceLandscape);

            drag.Click.X=touches[0].clientX;
            drag.Click.Y=touches[0].clientY;
            drag.LastMove.X=touches[0].clientX;
            drag.LastMove.Y=touches[0].clientY;

            jsChart.MouseDrag=drag;
        }
        else if (IsPhonePinching(e))
        {
            var phonePinch=
            {
                "Start":{},
                "Last":{}
            };

            var touches=GetToucheData(e,jsChart.IsForceLandscape);

            phonePinch.Start={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
            phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};

            jsChart.PhonePinch=phonePinch;
        }
    }


    this.ontouchmove = function (e) 
    {
      var jsChart = this;

      var touches = GetToucheData(e, jsChart.IsForceLandscape);

      if (IsPhoneDragging(e)) 
      {
          var drag = jsChart.MouseDrag;
          if (drag == null) 
          {
            var x = touches[0].clientX;
            var y = touches[0].clientY;
            jsChart.OnMouseMove(x, y, e);
          }
          else 
          {
              var moveSetp = Math.abs(drag.LastMove.X - touches[0].clientX);
              moveSetp = parseInt(moveSetp);
              if (jsChart.DragMode == 1)  //数据左右拖拽
              {
                  if (moveSetp < 5) return;

                  var isLeft = true;
                  if (drag.LastMove.X < touches[0].clientX) isLeft = false;//右移数据

                  if (jsChart.DataMove(moveSetp, isLeft)) 
                  {
                      jsChart.UpdataDataoffset();
                      jsChart.UpdatePointByCursorIndex();
                      jsChart.UpdateFrameMaxMin();
                      jsChart.ResetFrameXYSplit();
                      jsChart.Draw();
                  }

                  drag.LastMove.X = touches[0].clientX;
                  drag.LastMove.Y = touches[0].clientY;
              }
          } 
      }
      else if (IsPhonePinching(e)) 
      {
          var phonePinch = jsChart.PhonePinch;
          if (!phonePinch) return;

          var yHeight = Math.abs(touches[0].pageY - touches[1].pageY);
          var yLastHeight = Math.abs(phonePinch.Last.Y - phonePinch.Last.Y2);
          var yStep = yHeight - yLastHeight;
          if (Math.abs(yStep) < 5) return;

          if (yStep > 0)    //放大
          {
            var cursorIndex = {};
            cursorIndex.Index = parseInt(Math.abs(jsChart.CursorIndex - 0.5).toFixed(0));
            if (!jsChart.Frame.ZoomUp(cursorIndex)) return;
            jsChart.CursorIndex = cursorIndex.Index;
            jsChart.UpdatePointByCursorIndex();
            jsChart.UpdataDataoffset();
            jsChart.UpdateFrameMaxMin();
            jsChart.ResetFrameXYSplit();
            jsChart.Draw();
          }
          else        //缩小
          {
            var cursorIndex = {};
            cursorIndex.Index = parseInt(Math.abs(jsChart.CursorIndex - 0.5).toFixed(0));
            if (!jsChart.Frame.ZoomDown(cursorIndex)) return;
            jsChart.CursorIndex = cursorIndex.Index;
            jsChart.UpdataDataoffset();
            jsChart.UpdatePointByCursorIndex();
            jsChart.UpdateFrameMaxMin();
            jsChart.ResetFrameXYSplit();
            jsChart.Draw();
          }

          phonePinch.Last = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
      }
    }

    this.ontouchend = function (e) 
    {
        if (this.TouchTimer!=null)
          clearTimeout(this.TouchTimer);
    }

    this.Draw=function()
    {
        var self=this;
        this.Canvas.clearRect(0,0,this.UIElement.Width,this.UIElement.Height);
        
        //框架 
        this.Frame.Draw();

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)
        {
            this.Frame.DrawInsideHorizontal();
            this.ChartSplashPaint.Draw();
            this.Canvas.draw(); 
            return;
        }

        for (var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (item.IsDrawFirst)
                item.Draw();
        }

        //框架内图形
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (!item.IsDrawFirst)
                item.Draw();
        }


        //叠加股票
        for(var i in this.OverlayChartPaint)
        {
            var item=this.OverlayChartPaint[i];
            item.Draw();
        }

        //框架外图形
        for(var i in this.ExtendChartPaint)
        {
            var item=this.ExtendChartPaint[i];
            item.Draw();
        }

        //框架内部坐标
        this.Frame.DrawInsideHorizontal();

        this.Frame.DrawLock();

        for (var i in this.TitlePaint) 
        {
          var item = this.TitlePaint[i];
          if (!item.IsDynamic) continue;
          if (typeof (item.DrawTitle) == 'function')
                item.DrawTitle();
        }

        //坑!!.画图是异步, 保存当前屏图放在回调里面
        console.log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw and save snapshot .....');

        this.Canvas.draw(false, function () {
          self.Frame.Snapshot();
        });

        //console.log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw dynamic info ......');

        //动态标题都不画了(Canvas.draw 异步画的,如果下面再画会被截屏进去) 只有数据移动的时候在画
        /*
        if (this.LastPoint.X != null || this.LastPoint.Y != null)
        {
          if (this.ChartCorssCursor) 
          {
            this.ChartCorssCursor.LastPoint = this.LastPoint;
            this.ChartCorssCursor.Draw();
          }
        }

        for (var i in self.TitlePaint) 
        {
          var item = self.TitlePaint[i];
          if (!item.IsDynamic) continue;

          item.CursorIndex = self.CursorIndex;
          item.Draw();
        }

        self.Canvas.draw(true); 
        */
    }

    //画动态信息
    this.DrawDynamicInfo=function()
    {
      if (this.Frame.ScreenImagePath == null) return;

        var self=this;
        var isErase=false;
        if (this.ChartCorssCursor)
        {
            if (this.ChartCorssCursor.PointX!=null || this.ChartCorssCursor.PointY!=null)
                isErase=true;
        }

        isErase=true;

        if (isErase) 
        {
          var width = this.Frame.ChartBorder.GetChartWidth();
          var height = this.Frame.ChartBorder.GetChartHeight();
          self.Canvas.drawImage(this.Frame.ScreenImagePath, 0, 0, width, height);
        }

        if (self.ChartCorssCursor) 
        {
          self.ChartCorssCursor.LastPoint = self.LastPoint;
          self.ChartCorssCursor.Draw();
        }

        for (var i in self.TitlePaint) 
        {
          var item = self.TitlePaint[i];
          if (!item.IsDynamic) continue;

          item.CursorIndex = self.CursorIndex;
          item.Draw();
        }

        self.Canvas.draw(); 
    }

    this.OnMouseMove=function(x,y,e)
    {
        var lastY = this.LastPoint.Y;
        this.LastPoint.X=x;
        this.LastPoint.Y=y;
        var lastCursorIndex = this.CursorIndex;
        this.CursorIndex=this.Frame.GetXData(x);
        if (parseInt(lastCursorIndex - 0.5) == parseInt(this.CursorIndex - 0.5) && Math.abs(lastY-y)<1 ) return;  //一个一个数据移动

        if (this.IsForceLandscape)
        {
          //横屏图片太大不让贴,分两张图贴,多次截图的函数是坏的, 直接重画了
          this.Draw();
        }
        else
        {
          this.DrawDynamicInfo();
        }
    }


    this.OnDoubleClick=function(x,y,e)
    {
        //console.log(e);
    }

    this.UpdatePointByCursorIndex=function()
    {
        this.LastPoint.X=this.Frame.GetXFromIndex(this.CursorIndex);

        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var data=this.Frame.Data;
        if (data.DataOffset+index>=data.Data.length)
        {
            return;
        }
        var close=data.Data[data.DataOffset+index].Close;

        this.LastPoint.Y=this.Frame.GetYFromData(close);
    }

    this.ResetFrameXYSplit = function () 
    {
        if (typeof (this.Frame.ResetXYSplit) == 'function')
            this.Frame.ResetXYSplit();
    }

    this.UpdateFrameMaxMin=function()
    {
        var frameMaxMinData=new Array();

        var chartPaint=new Array();

        for(var i in this.ChartPaint)
        {
            chartPaint.push(this.ChartPaint[i]);
        }
        for(var i in this.OverlayChartPaint)
        {
            chartPaint.push(this.OverlayChartPaint[i]);
        }

        for(var i in chartPaint)
        {
            var paint=chartPaint[i];
            var range=paint.GetMaxMin();
            if (range==null || range.Max==null || range.Min==null) continue;
            var frameItem=null;
            for(var j in frameMaxMinData)
            {
                if (frameMaxMinData[j].Frame==paint.ChartFrame)
                {
                    frameItem=frameMaxMinData[j];
                    break;
                }
            }

            if (frameItem)
            {
                if (frameItem.Range.Max<range.Max) frameItem.Range.Max=range.Max;
                if (frameItem.Range.Min>range.Min) frameItem.Range.Min=range.Min;
            }
            else
            {
                frameItem={};
                frameItem.Frame=paint.ChartFrame;
                frameItem.Range=range;
                frameMaxMinData.push(frameItem);
            }
        }

        for(var i in frameMaxMinData)
        {
            var item=frameMaxMinData[i];
            if (!item.Frame || !item.Range) continue;
            if (item.Range.Max==null || item.Range.Min==null) continue;
            if (item.Frame.YSpecificMaxMin)
            {
                item.Frame.HorizontalMax=item.Frame.YSpecificMaxMin.Max;
                item.Frame.HorizontalMin=item.Frame.YSpecificMaxMin.Min;
            }
            else
            {
                item.Frame.HorizontalMax=item.Range.Max;
                item.Frame.HorizontalMin=item.Range.Min;
            }
            item.Frame.XYSplit=true;
        }
    }

    this.DataMoveLeft=function()
    {
        var data=null;
        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;
        if (data.DataOffset<=0) return false;
        --data.DataOffset;
        return true;
    }

    this.DataMoveRight=function()
    {
        var data=null;
        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;

        var xPointcount=0;
        if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount;
        else xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (xPointcount+data.DataOffset>=data.Data.length) return false;

        ++data.DataOffset;
        return true;
    }

    this.UpdataDataoffset=function()
    {
        var data=null;
        if (this.Frame.Data)
            data=this.Frame.Data;
        else
            data=this.Frame.SubFrame[0].Frame.Data;

        if (!data) return;

        for(var i in this.ChartPaint)
        {
            var item =this.ChartPaint[i];
            if (!item.Data) continue;
            item.Data.DataOffset=data.DataOffset;
        }

        for(var i in this.OverlayChartPaint)
        {
            var item =this.OverlayChartPaint[i];
            if (!item.Data) continue;
            item.Data.DataOffset=data.DataOffset;
        }
    }

    this.DataMove=function(step,isLeft)
    {
        var data=null;

        if (!this.Frame.Data) data=this.Frame.Data;
        else data=this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;

        var xPointcount=0;
        if (this.Frame.XPointCount) xPointcount=this.Frame.XPointCount;
        else xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (isLeft) //-->
        {
            if (xPointcount+data.DataOffset>=data.Data.length) return false;

            data.DataOffset+=step;

            if (data.DataOffset+xPointcount>=data.Data.length)
                data.DataOffset=data.Data.length-xPointcount;

            return true;
        }
        else        //<--
        {
            if (data.DataOffset<=0) return false;

            data.DataOffset-=step;
            if (data.DataOffset<0) data.DataOffset=0;

            return true;
        }
    }

    //获取鼠标在当前子窗口id
    this.GetSubFrameIndex=function(x,y)
    {
        if (!this.Frame.SubFrame || this.Frame.SubFrame.length<=0) return -1;

        for(var i in this.Frame.SubFrame)
        {
            var frame=this.Frame.SubFrame[i].Frame;
            var left=frame.ChartBorder.GetLeft();
            var top=frame.ChartBorder.GetTop();
            var height=frame.ChartBorder.GetHeight();
            var width=frame.ChartBorder.GetWidth();

            this.Canvas.rect(left,top,width,height);
            if (this.Canvas.isPointInPath(x,y)) return parseInt(i);

        }
        return 0;
    }

    //根据X坐标获取数据索引
    this.GetDataIndexByPoint=function(x)
    {
        var frame=this.Frame;
        if (this.Frame.SubFrame && this.Frame.SubFrame.length>0) frame=this.Frame.SubFrame[0].Frame;

        var data=null;
        if (this.Frame.Data)
            data=this.Frame.Data;
        else
            data=this.Frame.SubFrame[0].Frame.Data;

        if (!data || !frame) return;

        var index=parseInt(frame.GetXData(x));

        //console.log('x='+ x +' date='+data.Data[data.DataOffset+index].Date);
        return data.DataOffset+index;
    }

    this.SaveToImage=function(callback)
    {
        let width = this.UIElement.Width;
        let height = this.UIElement.Height;;

        console.log('[JSChartContainer::SaveToImage]', this.UIElement);

        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: width,
          height: height,
          canvasId: this.UIElement.ID,
          success: function (res) 
          {
            let data = { ImagePath: res.tempFilePath, Width: width, Height: height};
            if (typeof (callback) == 'function') callback(data);
          }
        })
    }
}

function ToFixed(number, precision)
{
    var b = 1;
    if (isNaN(number)) return number;
    if (number < 0) b = -1;
    var multiplier = Math.pow(10, precision);
    var value=Math.round(Math.abs(number) * multiplier) / multiplier * b;

    var s = value.toString();
    var rs = s.indexOf('.');
    if (rs < 0 && precision>0)
    {
        rs = s.length;
        s += '.';
    }

    while (s.length <= rs + precision)
    {
        s += '0';
    }

    return s;
}

Number.prototype.toFixed = function( precision )
{
    return ToFixed(this,precision)
}

function Guid()
{
    function S4()
    {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function GetScrollPosition()
{
    var scrollPos={};
    var scrollTop=0;
    var scrollLeft=0;
    if(document.documentElement && document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
        scrollLeft=document.documentElement.scrollLeft;
    }else if(document.body)
    {
        scrollTop=document.body.scrollTop;
        scrollLeft=document.body.scrollLeft;
    }

    scrollPos.Top=scrollTop;
    scrollPos.Left=scrollLeft;
    return scrollPos;
}

//修正线段有毛刺
function ToFixedPoint(value)
{
    //return value;
    return parseInt(value)+0.5;
}

function ToFixedRect(value)
{
    //return value;
    // With a bitwise or.
    //rounded = (0.5 + somenum) | 0;
    // A double bitwise not.
    //rounded = ~~ (0.5 + somenum);
    // Finally, a left bitwise shift.
    var rounded;
    return rounded = (0.5 + value) << 0;
}



function Point()
{
    this.X;
    this.Y;
}

function SelectRectData()
{
    this.Data;                  //主数据
    this.JSChartContainer;      //行情控件

    this.Start; //数据起始位子
    this.End;   //数据结束位置

    this.XStart;//X坐标起始位置
    this.XEnd;  //X位置结束为止
}

//坐标信息
function CoordinateInfo()
{
    this.Value;                                                 //坐标数据
    this.Message=new Array();                                   //坐标输出文字信息
    this.TextColor=g_JSChartResource.FrameSplitTextColor        //文字颜色
    this.Font=g_JSChartResource.FrameSplitTextFont;             //字体
    this.LineColor=g_JSChartResource.FrameSplitPen;             //线段颜色
}


//边框信息
function ChartBorder()
{
    this.UIElement;

    //四周间距
    this.Left=50;
    this.Right=80;
    this.Top=50;
    this.Bottom=50;
    this.TitleHeight=24;    //标题高度

    this.GetChartWidth=function()
    {
        return this.UIElement.Width;
    }

    this.GetChartHeight=function()
    {
        return this.UIElement.Height;
    }

    this.GetLeft=function()
    {
        return this.Left;
    }

    this.GetRight=function()
    {
        return this.UIElement.Width-this.Right;
    }

    this.GetTop=function()
    {
        return this.Top;
    }

    this.GetTopEx=function()    //去掉标题
    {
        return this.Top+this.TitleHeight;
    }

    this.GetBottom=function()
    {
        return this.UIElement.Height-this.Bottom;
    }

    this.GetWidth=function()
    {
        return this.UIElement.Width-this.Left-this.Right;
    }

    this.GetHeight=function()
    {
        return this.UIElement.Height-this.Top-this.Bottom;
    }

    this.GetHeightEx=function() //去掉标题的高度
    {
        return this.UIElement.Height-this.Top-this.Bottom-this.TitleHeight;
    }

    this.GetRightEx = function ()  //横屏去掉标题高度的
    {
        return this.UIElement.Width - this.Right - this.TitleHeight;
    }

    this.GetWidthEx = function ()  //横屏去掉标题宽度
    {
        return this.UIElement.Width - this.Left - this.Right - this.TitleHeight;
    }

    this.GetTitleHeight=function()
    {
        return this.TitleHeight;
    }
}

function IChartFramePainting()
{
    this.HorizontalInfo=new Array();    //Y轴
    this.VerticalInfo=new Array();      //X轴

    this.Canvas;                        //画布

    this.Identify;                      //窗口标识

    this.ChartBorder;
    this.PenBorder=g_JSChartResource.FrameBorderPen;        //边框颜色
    this.TitleBGColor=g_JSChartResource.FrameTitleBGColor;  //标题背景色
    this.IsShow=true;                   //是否显示
    this.SizeChange=true;               //大小是否改变
    this.XYSplit=true;                  //XY轴坐标信息改变

    this.HorizontalMax;                 //Y轴最大值
    this.HorizontalMin;                 //Y轴最小值
    this.XPointCount=10;                //X轴数据个数

    this.YSplitOperator;               //Y轴分割
    this.XSplitOperator;               //X轴分割
    this.Data;                         //主数据

    this.YSpecificMaxMin=null;         //指定Y轴最大最小值

    this.IsShowBorder=true;            //是否显示边框

    //上锁信息
    this.IsLocked = false;               //是否上锁
    this.LockPaint = null;

    this.Draw=function()
    {
        this.DrawFrame();
        this.DrawBorder();

        this.SizeChange=false;
        this.XYSplit=false;
    }

    this.DrawFrame=function() { }

    //画边框
    this.DrawBorder=function()
    {
        if (!this.IsShowBorder) return;

        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetBottom());
        var width=right-left;
        var height=bottom-top;
        this.Canvas.strokeStyle=this.PenBorder;
        this.Canvas.strokeRect(left,top,width,height);
    }

    //画标题背景色
    this.DrawTitleBG=function()
    {
        /* 指标信息背景色不画,画了感觉框架变小了
        if (this.ChartBorder.TitleHeight<=0) return;

        var left=ToFixedPoint(this.ChartBorder.GetLeft());
        var top=ToFixedPoint(this.ChartBorder.GetTop());
        var right=ToFixedPoint(this.ChartBorder.GetRight());
        var bottom=ToFixedPoint(this.ChartBorder.GetTopEx());
        var width=right-left;
        var height=bottom-top;

        this.Canvas.fillStyle=this.TitleBGColor;
        this.Canvas.fillRect(left,top,width,height);
        */
    }

    this.DrawLock = function () 
    {
        if (this.IsLocked) 
        {
            if (this.LockPaint == null) this.LockPaint = new ChartLock();

            this.LockPaint.Canvas = this.Canvas;
            this.LockPaint.ChartBorder = this.ChartBorder;
            this.LockPaint.ChartFrame = this;
            this.LockPaint.Draw();
        }
    }

    //设施上锁
    this.SetLock = function (lockData) 
    {
        if (!lockData)  //空数据不上锁
        {
            this.IsLocked = false;
            return;
        }

        this.IsLocked = true;
        if (!this.LockPaint) this.LockPaint = new ChartLock();    //创建锁

        if (lockData.Callback) this.LockPaint.Callback = lockData.Callback;       //回调
        if (lockData.IndexName) this.LockPaint.IndexName = lockData.IndexName;    //指标名字
        if (lockData.ID) this.LockPaint.LockID = lockData.ID;                     //锁ID
        if (lockData.BG) this.LockPaint.BGColor = lockData.BG;                    //背景色 
        if (lockData.Text) this.LockPaint.Title = lockData.Text;
        if (lockData.TextColor) this.LockPaint.TextColor = lockData.TextColor;
        if (lockData.Font) this.LockPaint.Font = lockData.Font;
        if (lockData.Count) this.LockPaint.LockCount = lockData.Count;
    }
}


//空框架只画边框
function NoneFrame() 
{
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Snapshot = function () 
    {

    }

    this.DrawInsideHorizontal = function () 
    {
      
    }

    this.SetSizeChage = function (sizeChange) 
    {
        this.SizeChange = sizeChange;

        //画布的位置
        this.Position = 
        {
          X: this.ChartBorder.UIElement.offsetLeft,
          Y: this.ChartBorder.UIElement.offsetTop,
          W: this.ChartBorder.UIElement.clientWidth,
          H: this.ChartBorder.UIElement.clientHeight
        };
    }
}

function AverageWidthFrame()
{
    this.newMethod=IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DataWidth=50;
    this.DistanceWidth=10;
    this.MinXDistance=30;       //X轴刻度最小间距
    this.IsShowXLine=true;      //是否显示X轴分割线
    this.XMessageAlign='top';   //X轴刻度文字上下对齐方式
    this.IsShowTitle=true;      //是否显示动态标题

    this.DrawFrame=function()
    {
        if (this.XPointCount>0)
        {
            this.DistanceWidth=this.ChartBorder.GetWidth()/(4*this.XPointCount);
			      this.DataWidth=2*this.DistanceWidth;
        }

        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetYFromData=function(value)
    {
        if(value<=this.HorizontalMin) return this.ChartBorder.GetBottom();
        if(value>=this.HorizontalMax) return this.ChartBorder.GetTopEx();

        var height=this.ChartBorder.GetHeightEx()*(value-this.HorizontalMin)/(this.HorizontalMax-this.HorizontalMin);
        return this.ChartBorder.GetBottom()-height;
    }

    //Y刻度画在内部
    this.DrawInsideHorizontal=function()
    {
      var left = this.ChartBorder.GetLeft();
      var right = this.ChartBorder.GetRight();
      var bottom = this.ChartBorder.GetBottom();
      var top=this.ChartBorder.GetTopEx();
      var borderRight = this.ChartBorder.Right;
      var borderLeft = this.ChartBorder.Left;
      var titleHeight = this.ChartBorder.TitleHeight;
      if (borderLeft>=10) return;

      var yPrev = null; //上一个坐标y的值
      for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
      {
        var item = this.HorizontalInfo[i];
        var y = this.GetYFromData(item.Value);
        if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

        //坐标信息 左边 间距小于10 画在内部
        if (item.Message[0] != null && borderLeft < 10) 
        {
          if (item.Font != null) this.Canvas.font = item.Font;
          this.Canvas.fillStyle = item.TextColor;
          this.Canvas.textAlign = "left";
          if (y >= bottom-2) 
              this.Canvas.textBaseline ='bottom';
          else if (y <= top+2)
            this.Canvas.textBaseline = 'top';
          else
            this.Canvas.textBaseline = "middle";
          this.Canvas.fillText(item.Message[0], left + 1, y);
        }

        yPrev = y;
      }
    }

    //画Y轴
    this.DrawHorizontal=function()
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var borderRight=this.ChartBorder.Right;
        var borderLeft=this.ChartBorder.Left;
        var titleHeight=this.ChartBorder.TitleHeight;

        this.Canvas.save();
        this.Canvas.setLineDash([2, 2]);   //虚线

        var yPrev=null; //上一个坐标y的值
        for(var i=this.HorizontalInfo.length-1; i>=0; --i)  //从上往下画分割线
        {
            var item=this.HorizontalInfo[i];
            var y=this.GetYFromData(item.Value);
            if (y != null && yPrev!=null && Math.abs(y-yPrev)<15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle=item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left,ToFixedPoint(y));
            this.Canvas.lineTo(right,ToFixedPoint(y));
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderLeft > 10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;
               
                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="right";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillText(item.Message[0],left-2,y);
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1]!=null && borderRight>10)
            {
                if (item.Font!=null) this.Canvas.font=item.Font;

                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillText(item.Message[1],right+2,y);
            }

            yPrev=y;
        }

        this.Canvas.restore();
    }

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount;

        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetRight();
        }
        else
        {
            var offset=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*index/count;
            return offset;
        }
    }

    //画X轴
    this.DrawVertical=function()
    {
        var top=this.ChartBorder.GetTopEx();
        var bottom=this.ChartBorder.GetBottom();
        var right=this.ChartBorder.GetRight();

        var yText = bottom;
        if (this.XMessageAlign == 'bottom')
          yText = this.ChartBorder.GetChartHeight();
        else this.XMessageAlign='top';
        
        var xPrev=null; //上一个坐标x的值
        let xPrevTextRight =null;
        for(var i in this.VerticalInfo)
        {
            var x=this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x>=right) break;
            if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

            if (this.IsShowXLine)
            {
                this.Canvas.strokeStyle=this.VerticalInfo[i].LineColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),top);
                this.Canvas.lineTo(ToFixedPoint(x),bottom);
                this.Canvas.stroke();
            }

            if (this.VerticalInfo[i].Message[0]!=null)
            {
                let xTextRight=null;
                let xTextLeft=null;
                if (this.VerticalInfo[i].Font!=null)
                    this.Canvas.font=this.VerticalInfo[i].Font;

                this.Canvas.fillStyle=this.VerticalInfo[i].TextColor;
                
                var testWidth=this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x<testWidth/2)
                {
                    this.Canvas.textAlign="left";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else
                {
                    this.Canvas.textAlign="center";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth/2;
                    xTextLeft = x - testWidth/2;
                }

                if (xPrevTextRight != null && xPrevTextRight > xTextLeft) continue;

                //console.log('[AverageWidthFrame::DrawVertical]', this.Canvas.fillStyle,x, yText);

                this.Canvas.fillText(this.VerticalInfo[i].Message[0], x, yText);
                xPrevTextRight = xTextRight;
            }

            xPrev=x;
        }
    }

    //Y坐标转y轴数值
    this.GetYData=function(y)
    {
        if (y<this.ChartBorder.GetTopEx()) return this.HorizontalMax;
		if (y>this.ChartBorder.GetBottom()) return this.HorizontalMin;

		return (this.ChartBorder.GetBottom()-y)/this.ChartBorder.GetHeightEx()*(this.HorizontalMax-this.HorizontalMin)+this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData=function(x)
    {
        if (x<=this.ChartBorder.GetLeft()) return 0;
		if (x>=this.ChartBorder.GetRight()) return this.XPointCount;

		return (x-this.ChartBorder.GetLeft())*(this.XPointCount*1.0/this.ChartBorder.GetWidth());
    }
}

function MinuteFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    this.GetXFromIndex=function(index)
    {
        var count=this.XPointCount-1;

        if (count==1)
        {
            if (index==0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count<=0)
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index>=count)
        {
            return this.ChartBorder.GetRight();
        }
        else
        {
            var offset=this.ChartBorder.GetLeft()+this.ChartBorder.GetWidth()*index/count;
            return offset;
        }
    }
}

function MinuteHScreenFrame() 
{
    this.newMethod = MinuteFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen = true;        //是否是横屏

    //画标题背景色
    this.DrawTitleBG = function () 
    {
        /*
        if (this.ChartBorder.TitleHeight <= 0) return;

        var left = ToFixedPoint(this.ChartBorder.GetRightEx());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = this.ChartBorder.TitleHeight;
        var height = bottom - top;

        this.Canvas.fillStyle = this.TitleBGColor;
        this.Canvas.fillRect(left, top, width, height);
        */
    }

    this.DrawInsideHorizontal = function ()
    {

    }

    //Y坐标转y轴数值
    this.GetYData = function (x) 
    {
        if (x < this.ChartBorder.GetLeft()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeft()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData = function (y) 
    {
        if (y <= this.ChartBorder.GetTop()) return 0;
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount;

        return (y - this.ChartBorder.GetTop()) * (this.XPointCount * 1.0 / this.ChartBorder.GetHeight());
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount - 1;

        if (count == 1) 
        {
            if (index == 0) return this.ChartBorder.GetTop();
            else return this.ChartBorder.GetBottom();
        }
        else if (count <= 0) 
        {
            return this.ChartBorder.GetTop();
        }
        else if (index >= count) 
        {
            return this.ChartBorder.GetBottom();
        }
        else 
        {
            var offset = this.ChartBorder.GetTop() + this.ChartBorder.GetHeight() * index / count;
            return offset;
        }
    }


    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeft();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width = this.ChartBorder.GetWidthEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeft() + width;
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle = item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y), top);
            this.Canvas.lineTo(ToFixedPoint(y), bottom);
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";

                var xText = y, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderBottom > 10)
             {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var xText = y, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev = y;
        }
    }

    //画X轴
    this.DrawVertical = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var bottom = this.ChartBorder.GetBottom();

        var xPrev = null; //上一个坐标x的值
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x >= bottom) break;
            if (xPrev != null && Math.abs(x - xPrev) < 80) continue;

            this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left, ToFixedPoint(x));
            this.Canvas.lineTo(right, ToFixedPoint(x));
            this.Canvas.stroke();

            if (this.VerticalInfo[i].Message[0] != null) 
            {
                if (this.VerticalInfo[i].Font != null)
                    this.Canvas.font = this.VerticalInfo[i].Font;

                this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "top";
                }
                else 
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = "top";
                }

                var xText = left, yText = x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, 0);
                this.Canvas.restore();
            }

            xPrev = x;
        }
    }
}

//K线框架
function KLineFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ToolbarID=Guid();  //工具条Div id

    this.ModifyIndex=true;  //是否显示'改参数'菜单
    this.ChangeIndex=true;  //是否显示'换指标'菜单

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();

        if (this.SizeChange==true) this.CalculateDataWidth();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex=function(index)
    {
        if (index < 0) index = 0;
	    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset=this.ChartBorder.GetLeft()+2+this.DistanceWidth/2+this.DataWidth/2;
        for(var i=1;i<=index;++i)
        {
            offset+=this.DistanceWidth+this.DataWidth;
        }

        return offset;
    }

    //计算数据宽度
    this.CalculateDataWidth=function()
    {
        if (this.XPointCount<2) return;

        var width=this.ChartBorder.GetWidth()-4;    //预留4个像素 防止最后1个柱子不够画

        for(var i=0;i<ZOOM_SEED.length;++i)
        {
            if((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width)
            {
                this.ZoomIndex=i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                if (i == 0) break;      // 如果是最大的缩放因子，不再调整数据宽度

                this.TrimKLineDataWidth(width);
                return;
            }
        }
    }

    this.TrimKLineDataWidth=function(width)
    {
        while(true)
        {
            if((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width)
            {
                this.DataWidth -= 0.01;
                break;
            }
            this.DataWidth += 0.01;
        }
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    this.CalculateCount=function(zoomIndex)
    {
        var width=this.ChartBorder.GetWidth();

        return parseInt(width/(ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp=function(cursorIndex)
    {
        if (this.ZoomIndex<=0) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex>this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;

        --this.ZoomIndex;
        var xPointCount=this.CalculateCount(this.ZoomIndex);

        this.XPointCount=xPointCount;

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	      this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetWidth());

        if (lastDataIndex>=this.Data.Data.length)
        {
            this.Data.DataOffset=this.Data.Data.length-this.XPointCount-2;
            cursorIndex.Index=this.Data.Data.length-this.Data.DataOffset-1;
        }
        else
        {
            if (lastDataIndex<this.XPointCount)
            {
                this.Data.DataOffset=0;
                cursorIndex.Index=lastCursorIndex;
            }
            else
            {
                this.Data.DataOffset = lastDataIndex - this.XPointCount+1;
                cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;
            }
        }

        return true;
    }

    this.ZoomDown=function(cursorIndex)
    {
        if (this.ZoomIndex+1>=ZOOM_SEED.length) return false;
        if (this.Data.DataOffset<0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex>=this.Data.Data.length) lastDataIndex=this.Data.Data.length-1;
        var xPointCount=this.CalculateCount(this.ZoomIndex+1);

        var lastCursorIndex=this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        this.XPointCount=xPointCount;
        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
	      this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetWidth());

        if (lastDataIndex-xPointCount+1<0)
            this.Data.DataOffset=0;
        else
            this.Data.DataOffset = lastDataIndex - this.XPointCount+1;

        cursorIndex.Index=lastCursorIndex-this.Data.DataOffset;

        return true;
    }
}

//K线横屏框架
function KLineHScreenFrame() 
{
    this.newMethod = KLineFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen = true;        //是否是横屏

    this.DrawInsideHorizontal = function ()
    {
        
    }

    //画标题背景色
    this.DrawTitleBG = function () 
    {
        /*
        if (this.ChartBorder.TitleHeight <= 0) return;

        var left = ToFixedPoint(this.ChartBorder.GetRightEx());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = this.ChartBorder.TitleHeight;
        var height = bottom - top;

        this.Canvas.fillStyle = this.TitleBGColor;
        this.Canvas.fillRect(left, top, width, height);
        */
    }

    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeft();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width = this.ChartBorder.GetWidthEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeft() + width;
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle = item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y), top);
            this.Canvas.lineTo(ToFixedPoint(y), bottom);
            this.Canvas.stroke();

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";

                var xText = y, yText = top;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[0], -2, 0);
                this.Canvas.restore();
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderBottom > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var xText = y, yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(item.Message[1], 2, 0);
                this.Canvas.restore();
            }

            yPrev = y;
        }
    }

    this.GetXFromIndex = function (index) 
    {
        if (index < 0) index = 0;
        if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset = this.ChartBorder.GetTop() + 2 + this.DistanceWidth / 2 + this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) 
        {
            offset += this.DistanceWidth + this.DataWidth;
        }

        return offset;
    }

    //画X轴
    this.DrawVertical = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var bottom = this.ChartBorder.GetBottom();

        var xPrev = null; //上一个坐标x的值
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x >= bottom) break;
            if (xPrev != null && Math.abs(x - xPrev) < 80) continue;

            this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left, ToFixedPoint(x));
            this.Canvas.lineTo(right, ToFixedPoint(x));
            this.Canvas.stroke();

            if (this.VerticalInfo[i].Message[0] != null) 
            {
                if (this.VerticalInfo[i].Font != null)
                    this.Canvas.font = this.VerticalInfo[i].Font;

                this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "top";
                }
                else 
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = "top";
                }

                var xText = left, yText = x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, 0);
                this.Canvas.restore();
            }

            xPrev = x;
        }
    }

    //Y坐标转y轴数值
    this.GetYData = function (x) 
    {
        if (x < this.ChartBorder.GetLeft()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeft()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData = function (y) 
    {
        if (y <= this.ChartBorder.GetTop()) return 0;
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount;

        return (y - this.ChartBorder.GetTop()) * (this.XPointCount * 1.0 / this.ChartBorder.GetHeight());
    }

    //计算数据宽度
    this.CalculateDataWidth = function () 
    {
        if (this.XPointCount < 2) return;

        var width = this.ChartBorder.GetHeight() - 4;

        for (var i = 0; i < ZOOM_SEED.length; ++i) 
        {
            if ((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width) 
            {
                this.ZoomIndex = i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                if (i == 0) break;      // 如果是最大的缩放因子，不再调整数据宽度

                this.TrimKLineDataWidth(width);
                return;
            }
        }
    }

    this.CalculateCount = function (zoomIndex) //计算当天的缩放比例下 一屏显示的数据个数
    {
        var width = this.ChartBorder.GetHeight();
        return parseInt(width / (ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp = function (cursorIndex)
    {
        if (this.ZoomIndex <= 0) return false;
        if (this.Data.DataOffset < 0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex > this.Data.Data.length) lastDataIndex = this.Data.Data.length - 1;

        --this.ZoomIndex;
        var xPointCount = this.CalculateCount(this.ZoomIndex);

        this.XPointCount = xPointCount;

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetHeight());

        if (lastDataIndex >= this.Data.Data.length) 
        {
            this.Data.DataOffset = this.Data.Data.length - this.XPointCount - 2;
            cursorIndex.Index = this.Data.Data.length - this.Data.DataOffset - 1;
        }
        else {
            if (lastDataIndex < this.XPointCount) 
            {
                this.Data.DataOffset = 0;
                cursorIndex.Index = lastCursorIndex;
            }
            else 
            {
                this.Data.DataOffset = lastDataIndex - this.XPointCount + 1;
                cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;
            }
        }

        return true;
    }

    this.ZoomDown = function (cursorIndex) 
    {
        if (this.ZoomIndex + 1 >= ZOOM_SEED.length) return false;
        if (this.Data.DataOffset < 0) return false;

        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex >= this.Data.Data.length) lastDataIndex = this.Data.Data.length - 1;
        var xPointCount = this.CalculateCount(this.ZoomIndex + 1);

        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        this.XPointCount = xPointCount;
        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];

        this.TrimKLineDataWidth(this.ChartBorder.GetHeight());

        if (lastDataIndex - xPointCount + 1 < 0)
            this.Data.DataOffset = 0;
        else
            this.Data.DataOffset = lastDataIndex - this.XPointCount + 1;

        cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;

        return true;
    }
}

function SubFrameItem()
{
    this.Frame;
    this.Height;
}

//行情框架
function HQTradeFrame()
{
    this.SubFrame=new Array();              //SubFrameItem 数组
    this.SizeChange=true;                   //大小是否改变
    this.ChartBorder;
    this.Canvas;                            //画布
    this.ScreenImagePath;                   //截图路径           
    this.Data;                              //主数据
    this.Position;                          //画布的位置
    this.SizeChange=true;

    this.CalculateChartBorder=function()    //计算每个子框架的边框信息
    {
        if (this.SubFrame.length<=0) return;

        var top=this.ChartBorder.GetTop();
        var height=this.ChartBorder.GetHeight();
        var totalHeight=0;

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            totalHeight+=item.Height;
        }

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.ChartBorder.Top=top;
            item.Frame.ChartBorder.Left=this.ChartBorder.Left;
            item.Frame.ChartBorder.Right=this.ChartBorder.Right;
            var frameHeight=height*(item.Height/totalHeight)+top;
            item.Frame.ChartBorder.Bottom=this.ChartBorder.GetChartHeight()-frameHeight;
            top=frameHeight;
        }

    }

    this.Draw=function()
    {
        if (this.SizeChange===true) this.CalculateChartBorder();

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.Draw();
        }

        this.SizeChange=false;
    }

    this.DrawLock = function () 
    {
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.DrawLock();
        }
    }

    this.DrawInsideHorizontal=function()
    {
      for (var i in this.SubFrame) 
      {
          var item = this.SubFrame[i];
          item.Frame.DrawInsideHorizontal();
      }
    }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            item.Frame.SizeChange=sizeChange;
        }

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }

    //图形快照
    this.Snapshot=function()
    {
      var self=this;
      var width = this.ChartBorder.GetChartWidth();
      var height = this.ChartBorder.GetChartHeight();
      
      console.log('[HQTradeFrame::Snapshot][ID=' + this.ChartBorder.UIElement.ID +'] invoke canvasToTempFilePath'+'(width=' + width + ',height=' + height+')' );

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: width,
        height: height,
        canvasId: this.ChartBorder.UIElement.ID,
        success: function (res) 
        {
          self.ScreenImagePath = res.tempFilePath;
          console.log(res.tempFilePath)
        }
      })
    }

    this.GetXData=function(x)
    {
        return this.SubFrame[0].Frame.GetXData(x);
    }

    this.GetYData=function(y)
    {
        var frame;
        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            var left=item.Frame.ChartBorder.GetLeft();
            var top=item.Frame.ChartBorder.GetTopEx();
            var width=item.Frame.ChartBorder.GetWidth();
            var height=item.Frame.ChartBorder.GetHeightEx();

            var rtItem = new Rect(left, top, width, height);
            if (rtItem.IsPointIn(left,y))
            {
                frame=item.Frame;
                break;
            }
        }

        if (frame!=null) return frame.GetYData(y);
    }

    this.GetXFromIndex=function(index)
    {
        return this.SubFrame[0].Frame.GetXFromIndex(index);
    }

    this.GetYFromData=function(value)
    {
        return this.SubFrame[0].Frame.GetYFromData(value);
    }

    this.ZoomUp=function(cursorIndex)
    {
        var result=this.SubFrame[0].Frame.ZoomUp(cursorIndex);
        for(var i=1;i<this.SubFrame.length;++i)
        {
            this.SubFrame[i].Frame.XPointCount= this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex= this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth= this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth= this.SubFrame[0].Frame.DistanceWidth;
        }

        return result;
    }

    this.ZoomDown=function(cursorIndex)
    {
        var result=this.SubFrame[0].Frame.ZoomDown(cursorIndex);
        for(var i=1;i<this.SubFrame.length;++i)
        {
            this.SubFrame[i].Frame.XPointCount= this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex= this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth= this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth= this.SubFrame[0].Frame.DistanceWidth;
        }

        return result;
    }

    //设置重新计算刻度坐标
    this.ResetXYSplit = function () 
    {
        for (let i in this.SubFrame) 
        {
            this.SubFrame[i].Frame.XYSplit = true;
        }
    }
}

//行情框架横屏
function HQTradeHScreenFrame() 
{
    this.newMethod = HQTradeFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsHScreen = true;        //是否是横屏

    this.CalculateChartBorder = function ()    //计算每个子框架的边框信息
    {
        if (this.SubFrame.length <= 0) return;

        var right = this.ChartBorder.Right;
        var left = this.ChartBorder.GetRight();
        var width = this.ChartBorder.GetWidth();
        var totalHeight = 0;

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            totalHeight += item.Height;
        }

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.ChartBorder.Top = this.ChartBorder.Top;
            item.Frame.ChartBorder.Bottom = this.ChartBorder.Bottom;

            var frameWidth = width * (item.Height / totalHeight);
            item.Frame.ChartBorder.Right = right;
            item.Frame.ChartBorder.Left = left - frameWidth;

            right += frameWidth;
            left -= frameWidth;
        }
    }

    this.GetYData = function (x) 
    {
        var frame;
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            var left = item.Frame.ChartBorder.GetLeft();
            var top = item.Frame.ChartBorder.GetTop();
            var width = item.Frame.ChartBorder.GetWidthEx();
            var height = item.Frame.ChartBorder.GetHeight();

            var rtItem = new Rect(left, top, width, height);
            if (rtItem.IsPointIn(x, top)) 
            {
                frame = item.Frame;
                break;
            }
        }

        if (frame != null) return frame.GetYData(x);
    }
}

//一般的图形框架
function SimpleChartFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ScreenImageData;                   //截图
    this.Position;                          //画布的位置
    
    this.IsShowBorder=false;                //是否显示边框
    this.IsShowVertical=false;              //是否显示X轴
    this.XFontType=0;                       //X轴文本文字类型

    this.MaxDistanceWidth=4;

    this.BarCount=0;    //多柱子个数

    this.Draw = function () 
    {
      this.DrawFrame();
      if (this.IsShowBorder) this.DrawBorder();

      this.SizeChange = false;
      this.XYSplit = false;
    }

    this.DrawFrame=function()
    {
        if (this.XPointCount>0)
        {
            let dInterval=this.ChartBorder.GetWidth()/(10*this.XPointCount); //分6份, 数据4 间距2
            this.DistanceWidth=4*dInterval;
			this.DataWidth=6*dInterval;

            if (this.DistanceWidth > this.MaxDistanceWidth)
            {
                this.DistanceWidth = this.MaxDistanceWidth;
                dInterval = this.ChartBorder.GetWidth() / this.XPointCount;
                this.DataWidth = dInterval - this.MaxDistanceWidth;
            }
        }

        this.SplitXYCoordinate();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex=function(index)
    {
        if (index < 0) index = 0;
	    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset=this.ChartBorder.GetLeft()+2+this.DistanceWidth/2+this.DataWidth/2;
        for(var i=1;i<=index;++i)
        {
            offset+=this.DistanceWidth+this.DataWidth;
        }

        return offset;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    //画X轴
    this.DrawVertical = function () 
    {
      var top = this.ChartBorder.GetTopEx();
      var bottom = this.ChartBorder.GetBottom();
      var right = this.ChartBorder.GetRight();

      var xPrev = null; //上一个坐标x的值
      for (var i in this.VerticalInfo) 
      {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x >= right) break;
            if (this.XFontType==1)
            {
                if (xPrev != null && Math.abs(x - xPrev) < 20) continue;
            }
            else
            {
                if (xPrev != null && Math.abs(x - xPrev) < 60) continue;
            }

            if (this.IsShowVertical)
            {
                this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), top);
                this.Canvas.lineTo(ToFixedPoint(x), bottom);
                this.Canvas.stroke();
            }

            if (this.VerticalInfo[i].Message[0] != null) 
            {
                if (this.VerticalInfo[i].Font != null)
                    this.Canvas.font = this.VerticalInfo[i].Font;

                this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "top";
                }
                else 
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = "top";
                }

                if (this.XFontType==1)
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = "middle";
                    this.Canvas.save();
                    this.Canvas.translate(x, bottom);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(this.VerticalInfo[i].Message[0], 2, 0);
                    this.Canvas.restore();
                }
                else
                    this.Canvas.fillText(this.VerticalInfo[i].Message[0], x, bottom);
            }

            xPrev = x;
      }
    }

    //图形快照
    this.Snapshot=function()
    {
        var self = this;
        var width = this.ChartBorder.GetChartWidth();
        var height = this.ChartBorder.GetChartHeight();

        console.log('[SimpleChartFrame::Snapshot][ID=' + this.ChartBorder.UIElement.ID + '] invoke canvasToTempFilePath' + '(width=' + width + ',height=' + height + ')');

        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: width,
          height: height,
          canvasId: this.ChartBorder.UIElement.ID,
          success: function (res) {
            self.ScreenImagePath = res.tempFilePath;
            console.log(res.tempFilePath)
          }
        })
    }

    this.SetSizeChage=function(sizeChange)
    {
        this.SizeChange=sizeChange;

        //画布的位置
        this.Position={
            X:this.ChartBorder.UIElement.offsetLeft,
            Y:this.ChartBorder.UIElement.offsetTop,
            W:this.ChartBorder.UIElement.clientWidth,
            H:this.ChartBorder.UIElement.clientHeight
        };
    }
}

//旋转90度坐标
function Rotate90SimpleChartFrame()
{
    this.newMethod=SimpleChartFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DrawFrame = function () 
    {
        if (this.XPointCount > 0) 
        {
            let dInterval = this.ChartBorder.GetHeightEx() / (10 * this.XPointCount); //分10份, 数据4 间距6
            this.DistanceWidth = 4 * dInterval;
            this.DataWidth = 6 * dInterval;

            if (this.DistanceWidth > this.MaxDistanceWidth) 
            {
                this.DistanceWidth = this.MaxDistanceWidth;
                dInterval = this.ChartBorder.GetHeightEx() / this.XPointCount;
                this.DataWidth = dInterval - this.MaxDistanceWidth;
            }
        }

        this.SplitXYCoordinate();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeft();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRight();

        var width = this.ChartBorder.GetWidth() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeft() + width;
    }

    this.GetYFromData = function (index) 
    {
        if (index < 0) index = 0;
        if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset = this.ChartBorder.GetBottom() - 2 - this.DistanceWidth / 2 - this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) 
        {
            offset -= this.DistanceWidth + this.DataWidth;
        }

        return offset;
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTopEx();
        var bottom = this.ChartBorder.GetBottom();
        var right = this.ChartBorder.GetRight();
        var left = this.ChartBorder.GetLeft();

        var yPrev = null; //上一个坐标y的值
        for (var i in this.VerticalInfo) 
        {
            let item = this.VerticalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && yPrev != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

            if (item.Message[0] != null) 
            {
                if (this.VerticalInfo[i].Font != null)
                    this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";
                this.Canvas.fillText(item.Message[0], left-2, y);
            }
            yPrev = y;
        }
    }

    //画X轴
    this.DrawVertical = function ()
    {
        var top = this.ChartBorder.GetTopEx();
        var bottom = this.ChartBorder.GetBottom();
        var right = this.ChartBorder.GetRight();
        var left = this.ChartBorder.GetLeft();

        var yText = bottom;
        if (this.XMessageAlign == 'bottom')
            yText = this.ChartBorder.GetChartHeight();
        else this.XMessageAlign = 'top';

        var xPrev = null; //上一个坐标x的值
        let xPrevTextRight = null;
        for (var i in this.HorizontalInfo) 
        {
            let item = this.HorizontalInfo[i];
            var x = this.GetXFromIndex(item.Value);
            if (x > right) break;
            if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

            if (this.IsShowXLine) 
            {
                this.Canvas.strokeStyle = item.LineColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), top);
                this.Canvas.lineTo(ToFixedPoint(x), bottom);
                this.Canvas.stroke();
            }

            if (item.Message[0] != null) 
            {
                let xTextRight = null;
                let xTextLeft = null;
                if (item.Font != null)
                    this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;

                var testWidth = this.Canvas.measureText(item.Message[0]).width;
                if (x < testWidth / 2) {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth / 2;
                    xTextLeft = x - testWidth / 2;
                }

                if (xPrevTextRight != null && xPrevTextRight > xTextLeft) continue;

                //console.log('[AverageWidthFrame::DrawVertical]', this.Canvas.fillStyle,x, yText);

                this.Canvas.fillText(item.Message[0], x, yText);
                xPrevTextRight = xTextRight;
            }

            xPrev = x;
        }
    }
    
}

var KLINE_INFO_TYPE=
{
    INVESTOR:1,         //互动易
    ANNOUNCEMENT:2,     //公告
    PFORECAST:3,        //业绩预告

    ANNOUNCEMENT_QUARTER_1:4,   //一季度报
    ANNOUNCEMENT_QUARTER_2:5,   //半年报
    ANNOUNCEMENT_QUARTER_3:6,   //2季度报
    ANNOUNCEMENT_QUARTER_4:7,   //年报

    RESEARCH:8,                 //调研
    BLOCKTRADING:9,             //大宗交易
    TRADEDETAIL:10              //龙虎榜


}

function KLineInfoData()
{
    this.ID;
    this.Date;
    this.Title;
    this.InfoType;
    this.ExtendData;    //扩展数据
}

function TooltipData()              //提示信息
{
    this.ChartPaint;
    this.Data;
}

function Rect(x,y,width,height)
{
    this.Left=x,
    this.Top=y;
    this.Right=x+width;
    this.Bottom=y+height;

    this.IsPointIn=function(x,y)
    {
      if (x>=this.Left && x<=this.Right && y>=this.Top && y<=this.Bottom) return true;

      return false;
    }
}

//图新画法接口类
function IChartPainting()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.Data=new ChartData();          //数据区

    this.NotSupportMessage=null;
    this.MessageFont=g_JSChartResource.Index.NotSupport.Font;
    this.MessageColor=g_JSChartResource.Index.NotSupport.TextColor;

    this.IsDrawFirst=false;             //是否比K线先画
    this.IsShow=true;                   //是否显示

    this.Draw=function()
    {

    }

    this.DrawNotSupportmessage=function()
    {
        this.Canvas.font=this.MessageFont;
        this.Canvas.fillStyle=this.MessageColor;

        var left=this.ChartBorder.GetLeft();
        var width=this.ChartBorder.GetWidth();
        var top=this.ChartBorder.GetTopEx();
        var height=this.ChartBorder.GetHeightEx();

        var x=left+width/2;
        var y=top+height/2;

        this.Canvas.textAlign="center";
        this.Canvas.textBaseline="middle";
        this.Canvas.fillText(this.NotSupportMessage,x,y);
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        return false;
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null || isNaN(value)) continue;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }
}


//缩放因子
var ZOOM_SEED=
[
    [49,10],	[46,9],		[43,8],
    [41,7.5],	[39,7],		[37,6],
    [31,5.5],	[27,5],		[23,4.5],
    [21,4],		[18,3.5],	[16,3],
    [13,2.5],	[11,2],		[8,1.5],
    [6,1],		[3,0.6],	[2.2,0.5],
    //太多了卡,
    //[1.1,0.3],
    //[0.9,0.2],	[0.7,0.15],
    //[0.6,0.12],	[0.5,0.1],	[0.4,0.08],
    //[0.3,0.06],	[0.2,0.04],	[0.1,0.02]
];

//K线画法
function ChartKLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.UnchagneColor=g_JSChartResource.UnchagneBarColor;          //平盘

    this.IsShowMaxMinPrice=true;                 //是否显示最大最小值
    this.TextFont=g_JSChartResource.KLine.MaxMin.Font;
    this.TextColor=g_JSChartResource.KLine.MaxMin.Color;

    this.InfoData;      //信息地雷 key=日期  value=信息数据
    this.InfoDiv=new Array();

    this.InfoTooltipEvent;  //信息地雷悬停事件

    this.Draw=function()
    {
        if (this.IsShow==false) return;

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var ptMax={X:null,Y:null,Value:null,Align:'left'};
        var ptMin={X:null,Y:null,Value:null,Align:'left'};

        this.Canvas.save();

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (left > chartright) break;
            if (right> (chartright+2)) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);
            var y=yHigh;

            if (ptMax.Value==null || ptMax.Value<data.High)     //求最大值
            {
                ptMax.X=x;
                ptMax.Y=yHigh;
                ptMax.Value=data.High;
                ptMax.Align=j<xPointCount/2?'left':'right';
            }

            if (ptMin.Value==null || ptMin.Value>data.Low)      //求最小值
            {
                ptMin.X=x;
                ptMin.Y=yLow;
                ptMin.Value=data.Low;
                ptMin.Align=j<xPointCount/2?'left':'right';
            }

            if (data.Open<data.Close)       //阳线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle = this.UpColor;

                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
                        this.Canvas.stroke();
                        y=yClose;
                    }
                    else
                    {
                        y=yClose;
                    }
                    
                    this.Canvas.fillStyle = this.UpColor;
                    if (yOpen-y<1)  this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));

                    if (data.Open>data.Low)
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.strokeStyle = this.UpColor;
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.stroke();
                }
            }
            else if (data.Open>data.Close)  //阴线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.DownColor;

                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                        this.Canvas.stroke();
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen
                    }
                   
                    this.Canvas.fillStyle = this.DownColor;
                    if (yClose-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yClose-y));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                        this.Canvas.stroke();
                    }
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.strokeStyle = this.DownColor;
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.stroke();
                }
            }
            else // 平线
            {
                if (dataWidth>=4)
                {
                    this.Canvas.strokeStyle=this.UnchagneColor;
                    this.Canvas.beginPath();
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),y);
                        this.Canvas.lineTo(ToFixedPoint(x),yOpen);
                        y=yOpen;
                    }
                    else
                    {
                        y=yOpen;
                    }

                    this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(y));

                    if (data.Open>data.Low) //下影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                    }

                    this.Canvas.stroke();
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.strokeStyle = this.UnchagneColor;
                    this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                    this.Canvas.lineTo(ToFixedPoint(x),yLow);
                    this.Canvas.stroke();
                }
            }

            if(this.Data.DataType==0)
            {
                var infoItem={Xleft:left,XRight:right, YMax:yHigh, YMin:yLow, DayData:data, Index:j};
                this.DrawInfoDiv(infoItem);
            }
        }

        this.Canvas.restore();

        if (this.IsShowMaxMinPrice) this.DrawMaxMinPrice(ptMax,ptMin);
    }

    this.HScreenDraw = function () 
    {
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var ptMax = { X: null, Y: null, Value: null, Align: 'left' };
        var ptMin = { X: null, Y: null, Value: null, Align: 'left' };

        this.TooltipRect = [];
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var data = this.Data.Data[i];
            if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

            var left = xOffset;
            var right = xOffset + dataWidth;
            if (right > chartright) break;
            var x = left + (right - left) / 2;
            var yLow = this.ChartFrame.GetYFromData(data.Low);
            var yHigh = this.ChartFrame.GetYFromData(data.High);
            var yOpen = this.ChartFrame.GetYFromData(data.Open);
            var yClose = this.ChartFrame.GetYFromData(data.Close);
            var y = yHigh;

            if (ptMax.Value == null || ptMax.Value < data.High)     //求最大值
            {
                ptMax.X = x;
                ptMax.Y = yHigh;
                ptMax.Value = data.High;
                ptMax.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (ptMin.Value == null || ptMin.Value > data.Low)      //求最小值
            {
                ptMin.X = x;
                ptMin.Y = yLow;
                ptMin.Value = data.Low;
                ptMin.Align = j < xPointCount / 2 ? 'left' : 'right';
            }

            if (data.Open < data.Close)       //阳线
            {
                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = this.UpColor;
                    if (data.High > data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yClose), ToFixedPoint(x));
                        this.Canvas.stroke();
                        y = yClose;
                    }
                    else 
                    {
                        y = yClose;
                    }

                    this.Canvas.fillStyle = this.UpColor;
                    if (Math.abs(yOpen - y) < 1) this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), ToFixedRect(yOpen - y), ToFixedRect(dataWidth), );

                    if (data.Open > data.Low) 
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        this.Canvas.stroke();
                    }
                }
                else 
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    this.Canvas.strokeStyle = this.UpColor;
                    this.Canvas.stroke();
                }
            }
            else if (data.Open > data.Close)  //阴线
            {

                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = this.DownColor;
                    if (data.High > data.Close)   //上影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yOpen), ToFixedPoint(x));
                        this.Canvas.stroke();
                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen
                    }

                    this.Canvas.fillStyle = this.DownColor;
                    if (Math.abs(yClose - y) < 1) this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), 1, ToFixedRect(dataWidth));    //高度小于1,统一使用高度1
                    else this.Canvas.fillRect(ToFixedRect(y), ToFixedRect(left), ToFixedRect(yClose - y), ToFixedRect(dataWidth));

                    if (data.Open > data.Low) //下影线
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                        this.Canvas.stroke();
                    }
                }
                else 
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    this.Canvas.strokeStyle = this.DownColor;
                    this.Canvas.stroke();
                }

            }
            else // 平线
            {
                if (dataWidth >= 4) 
                {
                    this.Canvas.strokeStyle = this.UnchagneColor;
                    this.Canvas.beginPath();
                    if (data.High > data.Close)   //上影线
                    {
                        this.Canvas.moveTo(y, ToFixedPoint(x));
                        this.Canvas.lineTo(yOpen, ToFixedPoint(x));
                        y = yOpen;
                    }
                    else 
                    {
                        y = yOpen;
                    }

                    this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(left));
                    this.Canvas.lineTo(ToFixedPoint(y), ToFixedPoint(right));

                    if (data.Open > data.Low) //下影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(y), ToFixedPoint(x));
                        this.Canvas.lineTo(ToFixedPoint(yLow), ToFixedPoint(x));
                    }

                    this.Canvas.stroke();
                }
                else 
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(yHigh, ToFixedPoint(x));
                    this.Canvas.lineTo(yLow, ToFixedPoint(x));
                    this.Canvas.strokeStyle = this.UnchagneColor;
                    this.Canvas.stroke();
                }
            }
        }

        if (this.IsShowMaxMinPrice) this.HScreenDrawMaxMinPrice(ptMax, ptMin);
    }

    this.DrawMaxMinPrice=function(ptMax,ptMin)
    {
        if (ptMax.X==null || ptMax.Y==null || ptMax.Value==null) return;
        if (ptMin.X==null || ptMin.Y==null || ptMin.Value==null) return;

        this.Canvas.font=this.TextFont;
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.textAlign=ptMax.Align;
        this.Canvas.textBaseline='bottom';
        var left=ptMax.X;
        this.Canvas.fillText(ptMax.Value.toFixed(2),left,ptMax.Y);

        this.Canvas.textAlign=ptMin.Align;
        this.Canvas.textBaseline='top';
        var left=ptMin.X;
        this.Canvas.fillText(ptMin.Value.toFixed(2),left,ptMin.Y);
    }

    this.HScreenDrawMaxMinPrice = function (ptMax, ptMin)   //横屏模式下显示最大最小值
    {
        if (ptMax.X == null || ptMax.Y == null || ptMax.Value == null) return;
        if (ptMin.X == null || ptMin.Y == null || ptMin.Value == null) return;

        var xText = ptMax.Y;
        var yText = ptMax.X;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.textAlign = ptMax.Align;
        this.Canvas.textBaseline = 'top';
        var left = ptMax.Align == 'left' ? 10 : -10;
        this.Canvas.fillText(ptMax.Value.toFixed(2), left, 0);

        this.Canvas.restore();

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMax.Y, ptMax.X);
        this.Canvas.lineTo(ptMax.Y - 8, ptMax.X + left);
        this.Canvas.strokeStyle = this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();


        var xText = ptMin.Y;
        var yText = ptMin.X;
        this.Canvas.save();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.font = this.TextFont;
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.textAlign = ptMin.Align;
        this.Canvas.textBaseline = 'bottom';
        var left = ptMin.Align == 'left' ? 10 : -10;
        this.Canvas.fillText(ptMin.Value.toFixed(2), left, 0);
        this.Canvas.restore();

        this.Canvas.beginPath();
        this.Canvas.moveTo(ptMin.Y, ptMin.X, );
        this.Canvas.lineTo(ptMin.Y + 8, ptMin.X + left);
        this.Canvas.strokeStyle = this.TextColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
    }

    this.ClearInfoDiv=function()
    {
        if (this.InfoDiv.length<=0) return;

        for(var i in this.InfoDiv)
        {
            var item=this.InfoDiv[i];
            var div=document.getElementById(item.id);
            this.ChartBorder.UIElement.parentNode.removeChild(div);
        }

        this.InfoDiv=[];
    }

    //画某一天的信息地雷
    this.DrawInfoDiv=function(item)
    {
        if (!this.InfoData || this.InfoData.length<=0) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;

        var infoData=this.InfoData.get(item.DayData.Date.toString());
        if (!infoData || infoData.Data.length<=0) return;

        var divInfo=document.createElement("div");
        divInfo.className='kline-info';
        divInfo.id=Guid();
        var iconWidth=Math.abs(item.Xleft-item.XRight);
        if (iconWidth>16)
        {
            iconWidth=16;
            item.Xleft=item.Xleft+(Math.abs(item.Xleft-item.XRight)-iconWidth)/2;
        }

        var text='', title='';
        var mapImage=new Map();
        for(var i in infoData.Data)
        {
            var infoItem=infoData.Data[i];
            var iconSrc=JSKLineInfoMap.GetIconUrl(infoItem.InfoType);
            var imageInfo=mapImage.get(infoItem.InfoType);
            if (!imageInfo)
            {
                divInfo.innerHTML+="<img src='"+iconSrc+"'"+ " infotype='"+infoItem.InfoType+"' />";
                mapImage.set(infoItem.InfoType,new Array(infoItem) );
            }
            else
            {
                imageInfo.push(infoItem);
            }
            title+='\n'+infoItem.Title;
        }

        //divInfo.innerHTML=text;
        var scrollPos=GetScrollPosition();
        var left = item.Xleft+ this.ChartBorder.UIElement.getBoundingClientRect().left+scrollPos.Left;
        var top = item.YMax+this.ChartBorder.UIElement.getBoundingClientRect().top+scrollPos.Top-5;

        divInfo.style.left = left + "px";
        divInfo.style.top = top-(mapImage.size*16) + "px";
        //divInfo.title=title;
        this.ChartBorder.UIElement.parentNode.appendChild(divInfo);

        if (this.InfoTooltipEvent && this.InfoTooltipEvent.length>=2)
        {
            if (typeof(this.InfoTooltipEvent[0])=='function')
            {
                var chart=this.ChartBorder.UIElement.JSChartContainer;
                var self=this;
                mapImage.forEach(function(item,key,data)
                {
                    //绑定鼠标悬浮消息
                    $("#"+divInfo.id+" img[infotype='"+key+"']").mouseover(
                    {
                            Chart:chart,    //图形类
                            InfoType:key,   //信息地雷类型
                            InfoList:item,  //信息数据列表
                    },
                    self.InfoTooltipEvent[0]);
                });
            }

            if (typeof(this.InfoTooltipEvent[1])=='function')
            {
                var chart=this.ChartBorder.UIElement.JSChartContainer;
                var self=this;
                mapImage.forEach(function(item,key,data)
                {
                    //绑定鼠标离开
                    $("#"+divInfo.id+" img[infotype='"+key+"']").mouseleave(
                    {
                            Chart:chart,    //图形类
                    },
                    self.InfoTooltipEvent[1]);
                });
            }
        }

        this.InfoDiv.push(divInfo);
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i in this.TooltipRect)
        {
            var rect=this.TooltipRect[i][1];
            this.Canvas.beginPath();
            this.Canvas.rect(rect.X,rect.Y,rect.Width,rect.Height);
            if (this.Canvas.isPointInPath(x,y))
            {
                var index=this.TooltipRect[i][0];
                tooltip.Data=this.Data.Data[index];
                tooltip.ChartPaint=this;
                return true;
            }
        }
        return false;
    }

    //计算当天显示数据的最大最小值
    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Max=null;
        range.Min=null;

        if (this.IsShow == false) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            if (range.Max==null) range.Max=data.High;
            if (range.Min==null) range.Min=data.Low;

            if (range.Max<data.High) range.Max=data.High;
            if (range.Min>data.Low) range.Min=data.Low;
        }

        return range;
    }
}

/*
    K线画法 只有线段
*/
function ChartKLine2()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.UnchagneColor=g_JSChartResource.UnchagneBarColor;      //平盘

    this.Draw=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low);
            var yHigh=this.ChartFrame.GetYFromData(data.High);
            var yOpen=this.ChartFrame.GetYFromData(data.Open);
            var yClose=this.ChartFrame.GetYFromData(data.Close);
            var y=yHigh;

            if (data.Open<data.Close)       //阳线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(x,ToFixedPoint(yOpen));

                this.Canvas.moveTo(x,ToFixedPoint(yClose));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.UpColor;
                this.Canvas.stroke();
            }
            else if (data.Open>data.Close)  //阴线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(x,ToFixedPoint(yOpen));

                this.Canvas.moveTo(x,ToFixedPoint(yClose));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.DownColor;
                this.Canvas.stroke();
            }
            else // 平线
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),yHigh);
                this.Canvas.lineTo(ToFixedPoint(x),yLow);

                this.Canvas.moveTo(left,ToFixedPoint(yOpen));
                this.Canvas.lineTo(right,ToFixedPoint(yClose));

                this.Canvas.strokeStyle=this.UnchagneColor;
                this.Canvas.stroke();
            }

        }
    }

     //计算当天显示数据的最大最小值
     this.GetMaxMin=function()
     {
         var xPointCount=this.ChartFrame.XPointCount;
         var range={};
         range.Max=null;
         range.Min=null;
         for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
         {
             var data=this.Data.Data[i];
             if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

             if (range.Max==null) range.Max=data.High;
             if (range.Min==null) range.Min=data.Low;

             if (range.Max<data.High) range.Max=data.High;
             if (range.Min>data.Low) range.Min=data.Low;
         }

         return range;
     }
}

//K线叠加
function ChartOverlayKLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(65,105,225)";
    this.MainData;                  //主图K线数据
    this.SourceData;                //叠加的原始数据
    this.Name="ChartOverlayKLine";
    this.Title;

    this.Draw=function()
    {
        if (!this.MainData || !this.Data) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        this.TooltipRect=[];
        var isFristDraw=true;

        var firstOpen=null; //主线数据第1个收盘价
        for(var i=this.Data.DataOffset,j=0;i<this.MainData.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.MainData.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            firstOpen=data.Close;
            break;
        }

        if (firstOpen==null) return;

        var firstOverlayOpen=null;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var data=this.Data.Data[i];
            if (!data || data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;

            if (firstOverlayOpen==null) firstOverlayOpen=data.Open;

            if (isFristDraw)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.fillStyle=this.Color;
                this.Canvas.beginPath();
                isFristDraw=false;
            }

            var left=xOffset;
            var right=xOffset+dataWidth;
            if (right>chartright) break;
            var x=left+(right-left)/2;
            var yLow=this.ChartFrame.GetYFromData(data.Low/firstOverlayOpen*firstOpen);
            var yHigh=this.ChartFrame.GetYFromData(data.High/firstOverlayOpen*firstOpen);
            var yOpen=this.ChartFrame.GetYFromData(data.Open/firstOverlayOpen*firstOpen);
            var yClose=this.ChartFrame.GetYFromData(data.Close/firstOverlayOpen*firstOpen);
            var y=yHigh;

            if (data.Open<data.Close)       //阳线
            {
                if (dataWidth>=4)
                {
                    if (data.High>data.Close)   //上影线
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yClose));
                        y=yClose;
                    }
                    else
                    {
                        y=yClose;
                    }

                    this.Canvas.fillStyle=this.Color;
                    if (yOpen-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);
                    else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yOpen-y));

                    if (data.Open>data.Low)
                    {
                        this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                        this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                    }
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),yLow);
                    this.Canvas.lineTo(ToFixedPoint(x),yHigh);
                }
            }
            else if (data.Open>data.Close)  //阴线
            {
                this.Canvas.strokeStyle=this.Color;
                if (data.High>data.Close)   //上影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));
                    y=yOpen;
                }
                else
                {
                    y=yOpen
                }

                this.Canvas.fillStyle=this.Color;
                if (yOpen-y<1) this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),1);
                else this.Canvas.fillRect(ToFixedRect(left),ToFixedRect(y),ToFixedRect(dataWidth),ToFixedRect(yClose-y));

                if (data.Open>data.Low) //下影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
            }
            else // 平线
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (data.High>data.Close)   //上影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yOpen));

                    y=yOpen;
                }
                else
                {
                    y=yOpen;
                }

                this.Canvas.moveTo(ToFixedPoint(left),ToFixedPoint(y));
                this.Canvas.lineTo(ToFixedPoint(right),ToFixedPoint(y));

                if (data.Open>data.Low) //下影线
                {
                    this.Canvas.moveTo(ToFixedPoint(x),ToFixedPoint(y));
                    this.Canvas.lineTo(ToFixedPoint(x),ToFixedPoint(yLow));
                }
            }

            //添加tooltip区域
            {
                var yTop=Math.min(yLow,yHigh,yOpen,yClose);
                var yBottom=Math.max(yLow,yHigh,yOpen,yClose);
                var rect=new Rect(left,yTop,dataWidth,yBottom-yTop);
                //this.Canvas.fillStyle="rgb(0,0,100)";
                //this.Canvas.fillRect(rect.X,rect.Y,rect.Width,rect.Height);
                this.TooltipRect.push([i,rect]);    //[0]数据索引 [1]数据区域
            }
        }

        if (isFristDraw==false) this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Max=null;
        range.Min=null;

        if (!this.MainData || !this.Data) return range;

        var firstOpen=null; //主线数据第1个收盘价
        for(var i=this.Data.DataOffset,j=0;i<this.MainData.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.MainData.Data[i];
            if (data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            firstOpen=data.Close;
            break;
        }

        if (firstOpen==null) return range;

        var firstOverlayOpen=null;
        var high,low;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (!data || data.Open==null || data.High==null || data.Low==null || data.Close==null) continue;
            if (firstOverlayOpen==null) firstOverlayOpen=data.Open;

            high=data.High/firstOverlayOpen*firstOpen;
            low=data.Low/firstOverlayOpen*firstOpen;
            if (range.Max==null) range.Max=high;
            if (range.Min==null) range.Min=low;

            if (range.Max<high) range.Max=high;
            if (range.Min>low) range.Min=low;
        }

        return range;
    }

    this.GetTooltipData=function(x,y,tooltip)
    {
        for(var i in this.TooltipRect)
        {
            var rect=this.TooltipRect[i][1];
            this.Canvas.beginPath();
            this.Canvas.rect(rect.X,rect.Y,rect.Width,rect.Height);
            if (this.Canvas.isPointInPath(x,y))
            {
                var index=this.TooltipRect[i][0];
                tooltip.Data=this.Data.Data[index];
                tooltip.ChartPaint=this;
                return true;
            }
        }
        return false;
    }
}

//历史成交量柱子
function ChartKVolumeBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.Data.Data[i];
                if (data.Vol==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (left > chartright) break;
                if (right>(chartright+2)) break;

                var y=this.ChartFrame.GetYFromData(data.Vol);

                if (data.Close>data.Open)
                    this.Canvas.fillStyle=this.UpColor;
                else
                    this.Canvas.fillStyle=this.DownColor;

                //高度调整为整数
                var height=ToFixedRect(yBottom-y);
                y=yBottom-height;
                this.Canvas.fillRect(ToFixedRect(left),y,ToFixedRect(dataWidth),height);
            }
        }
        else    //太细了直接话线
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var data=this.Data.Data[i];
                if (data.Vol==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var y=this.ChartFrame.GetYFromData(data.Vol);
                var x=this.ChartFrame.GetXFromIndex(j);

                if (data.Close>data.Open)
                    this.Canvas.strokeStyle=this.UpColor;
                else
                    this.Canvas.strokeStyle=this.DownColor;

                var x=this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),y);
                this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (range.Max==null) range.Max=data.Vol;

            if (range.Max<data.Vol) range.Max=data.Vol;
        }

        return range;
    }
}

//分钟成交量
function ChartMinuteVolumBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(200,200,200)";

    this.Draw=function()
    {
        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var vol=this.Data.Data[i];
            if (!vol) continue;

            var y=this.ChartFrame.GetYFromData(vol);
            var x=this.ChartFrame.GetXFromIndex(i);
            if (x>chartright) break;

            if (drawCount==0) this.Canvas.beginPath();

            this.Canvas.moveTo(ToFixedPoint(x),y);
            this.Canvas.lineTo(ToFixedPoint(x),yBottom);

            ++drawCount;
        }

        if (drawCount>0)
        {
            this.Canvas.strokeStyle=this.Color;
            this.Canvas.stroke();
        }
    }

    this.HScreenDraw = function () 
    {
        var chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var yBottom = this.ChartFrame.GetYFromData(0);

        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var vol = this.Data.Data[i];
            if (!vol) continue;

            var y = this.ChartFrame.GetYFromData(vol);
            var x = this.ChartFrame.GetXFromIndex(i);
            if (x > chartright) break;

            if (drawCount == 0) this.Canvas.beginPath();

            this.Canvas.moveTo(y, ToFixedPoint(x));
            this.Canvas.lineTo(yBottom, ToFixedPoint(x));

            ++drawCount;
        }

        if (drawCount > 0) 
        {
            this.Canvas.strokeStyle = this.Color;
            this.Canvas.stroke();
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var vol=this.Data.Data[i];
            if (range.Max==null) range.Max=vol;

            if (range.Max<vol) range.Max=vol;
        }

        return range;
    }
}


//线段
function ChartLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)"; //线段颜色
    this.LineWidth;               //线段宽度
    this.DrawType=0;              //画图方式  0=无效数平滑  1=无效数不画断开

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        switch(this.DrawType)
        {
            case 0:
                return this.DrawLine();
            case 1: 
                return this.DrawStraightLine();
        }
    }

    this.DrawLine=function()
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y, x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x, y);
                bFirstPoint=false;
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    //无效数不画
    this.DrawStraightLine=function()
    {
        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        this.Canvas.strokeStyle=this.Color;

        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) 
            {
                if (drawCount>0) this.Canvas.stroke();
                bFirstPoint=true;
                drawCount=0;
                continue;
            }

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.beginPath();
                if (bHScreen) this.Canvas.moveTo(y, x);  //横屏坐标轴对调
                else this.Canvas.moveTo(x, y);
                bFirstPoint=false;
            }
            else
            {
                if (bHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }
}

//POINTDOT 圆点 支持横屏
function ChartPointDot()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.Radius=1;                  //点半径

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var bHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (bHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        this.Canvas.fillStyle=this.Color;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.beginPath();
            if (bHScreen) this.Canvas.arc(y, x, this.Radius, 0, Math.PI * 2, true);
            else this.Canvas.arc(x, y, this.Radius, 0, Math.PI*2, true);
            this.Canvas.closePath();
            this.Canvas.fill();
        }

        this.Canvas.restore();
    }
}

//通达信语法  STICK 支持横屏
function ChartStick()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.LineWidth;               //线段宽度

    this.DrawLine=function()
    {
        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        if (this.LineWidth>0) this.Canvas.lineWidth=this.LineWidth;
        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint=false;
            }
            else
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount>0) this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.DrawStick=function()
    {
        if (!this.Data || !this.Data.Data) return;

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDrawStick();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;
        var yBottom = this.ChartBorder.GetBottom();

        this.Canvas.save();
        this.Canvas.strokeStyle=this.Color;
        if (this.LineWidth) this.Canvas.lineWidth=this.LineWidth;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            var xFix=parseInt(x.toString())+0.5;
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix,y);  
            this.Canvas.lineTo(xFix, yBottom);
            this.Canvas.stroke();
        }

        this.Canvas.restore();
    }

    this.HScreenDrawStick = function () 
    {
        var chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var xLeft = this.ChartBorder.GetLeft();

        this.Canvas.save();
        this.Canvas.strokeStyle = this.Color;
        if (this.LineWidth) this.Canvas.lineWidth = this.LineWidth;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.beginPath();
            this.Canvas.moveTo(xLeft, x);
            this.Canvas.lineTo(y, x);
            this.Canvas.stroke();
        }

        this.Canvas.restore();
    }

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
    }
}

//通达信语法 LINESTICK 支持横屏
function ChartLineStick()
{
    this.newMethod=ChartStick;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        this.DrawStick();
        this.DrawLine();
    }
}

//通达信语法 VOLSTICK 支持横屏
function ChartVolStick()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;
    this.HistoryData;               //历史数据

    this.Draw=function()
    {
        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yBottom=this.ChartFrame.GetYFromData(0);

        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var y=this.ChartFrame.GetYFromData(value);

                if (kItem.Close>=kItem.Open)
                    this.Canvas.fillStyle=this.UpColor;
                else
                    this.Canvas.fillStyle=this.DownColor;

                //高度调整为整数
                var height=ToFixedRect(yBottom-y);
                y=yBottom-height;
                this.Canvas.fillRect(ToFixedRect(left),y,ToFixedRect(dataWidth),height);
            }
        }
        else    //太细了直接话线
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                var kItem=this.HistoryData.Data[i];
                if (value==null || kItem==null) continue;

                var y=this.ChartFrame.GetYFromData(value);
                var x=this.ChartFrame.GetXFromIndex(j);
                if (x > chartright) break;

                if (kItem.Close>kItem.Open)
                    this.Canvas.strokeStyle=this.UpColor;
                else
                    this.Canvas.strokeStyle=this.DownColor;

                var x=this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x),y);
                this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                this.Canvas.stroke();
            }
        }
    }

    this.HScreenDraw = function () //横屏画法
    {
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
        var chartBottom = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var yBottom = this.ChartFrame.GetYFromData(0);

        if (dataWidth >= 4) 
        {
            yBottom = ToFixedRect(yBottom);
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartBottom) break;

                var y = this.ChartFrame.GetYFromData(value);

                if (kItem.Close >= kItem.Open)
                    this.Canvas.fillStyle = this.UpColor;
                else
                    this.Canvas.fillStyle = this.DownColor;

                //高度调整为整数
                var height = ToFixedRect(y - yBottom);
                this.Canvas.fillRect(yBottom, ToFixedRect(left), height, ToFixedRect(dataWidth));
            }
        }
        else    //太细了直接话线
        {
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                var kItem = this.HistoryData.Data[i];
                if (value == null || kItem == null) continue;

                var y = this.ChartFrame.GetYFromData(value);
                var x = this.ChartFrame.GetXFromIndex(j);
                if (x > chartBottom) break;

                if (kItem.Close > kItem.Open)
                    this.Canvas.strokeStyle = this.UpColor;
                else
                    this.Canvas.strokeStyle = this.DownColor;

                var x = this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(y, ToFixedPoint(x));
                this.Canvas.lineTo(yBottom, ToFixedPoint(x));
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (range.Max==null) range.Max=value;

            if (range.Max<value) range.Max=value;
        }

        return range;
    }
}

//线段 多数据(一个X点有多条Y数据) 支持横屏
function ChartLineMultiData() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)"; //线段颜色

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var bFirstPoint = true;
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
        var aryValue = this.Data.Data[i];
        if (aryValue == null) continue;

        var x = this.ChartFrame.GetXFromIndex(j);
        if (x > chartright) break;

        for (var index in aryValue) 
        {
            var value = aryValue[index].Value;
            var y = this.ChartFrame.GetYFromData(value);

            if (bFirstPoint) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }
    }

    if (drawCount > 0) this.Canvas.stroke();
}

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = null;
    range.Max = null;

    if (!this.Data || !this.Data.Data) return range;

    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var aryValue = this.Data.Data[i];
      if (aryValue == null) continue;

      for (var index in aryValue) {
        var value = aryValue[index].Value;
        if (range.Max == null) range.Max = value;
        if (range.Min == null) range.Min = value;

        if (range.Max < value) range.Max = value;
        if (range.Min > value) range.Min = value;
      }
    }

    return range;
  }
}

//支持 横屏
function ChartStickLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色
    this.LineWidth=2;               //线段宽度

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        this.Canvas.save();
        var LineWidth=this.LineWidth;
        if (dataWidth<=4) LineWidth=1;
        else if (dataWidth<LineWidth) LineWidth=parseInt(dataWidth);
        this.Canvas.strokeStyle=this.Color;
        this.Canvas.lineWidth=LineWidth;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var price=value.Value;
            var price2=value.Value2;
            if (price2 == null) price2=0;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(price);
            var y2=this.ChartFrame.GetYFromData(price2);

            if (x>chartright) break;

            if (isHScreen)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(y,ToFixedPoint(x));
                this.Canvas.lineTo(y2,ToFixedPoint(x));
                this.Canvas.stroke();
            }
            else
            {
                var xFix=parseInt(x.toString())+0.5;
                this.Canvas.beginPath();
                this.Canvas.moveTo(xFix,y);  
                this.Canvas.lineTo(xFix,y2);
                this.Canvas.stroke();
            }
        }

        this.Canvas.restore();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var data=this.Data.Data[i];
            if (data == null) continue;
            var value2 = data.Value2;
            if (value2 == null) value2=0;
            if (data == null || isNaN(data.Value) || isNaN(value2)) continue;

            var valueMax = Math.max(data.Value, value2);
            var valueMin = Math.min(data.Value, value2);
            
            if (range.Max==null) range.Max=valueMax;
            if (range.Min==null) range.Min=valueMin;

            if (range.Max<valueMax) range.Max=valueMax;
            if (range.Min>valueMin) range.Min=valueMin;
        }

        return range;
    }
}

function ChartText()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.TextFont="14px 微软雅黑";

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        for(var i in this.Data.Data)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var price=value.Value;
            var position=value.Position;

            if (position=='Left')
            {
                var x=this.ChartFrame.GetXFromIndex(0);
                var y=this.ChartFrame.GetYFromData(price);

                if (x>chartright) continue;

                this.Canvas.textAlign='left';
                this.Canvas.textBaseline='middle';
                this.Canvas.fillStyle=value.Color;
                this.Canvas.font=this.TextFont;
                this.Canvas.fillText(value.Message,x,y);
            }

        }

    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if(!this.Data || !this.Data.Data) return range;

        for(var i in this.Data.Data)
        {
            var data=this.Data.Data[i];
            if (data==null || isNaN(data.Value)) continue;

            var value=data.Value;
            
            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }
}

/*
    数组不为null的数据中输出 this.Text文本
*/
function ChartSingleText()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";           //线段颜色
    this.TextFont="14px 微软雅黑";           //线段宽度
    this.Text;
    this.TextAlign ='left';

    this.Draw=function()
    {
        if (!this.IsShow) return;

        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.Data || !this.Data.Data) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var isArrayText = Array.isArray(this.Text);
        var text;

        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            this.Canvas.textAlign = this.TextAlign;
            this.Canvas.textBaseline='middle';
            this.Canvas.fillStyle=this.Color;
            this.Canvas.font=this.TextFont;

            if (isArrayText) 
            {
                text = this.Text[i];
                if (!text) continue;
                this.Canvas.fillText(text, x, y);
            }
            else 
            {
                this.Canvas.fillText(this.Text, x, y);
            }
        }
    }
}

//直线 水平直线 只有1个数据
function ChartStraightLine()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color="rgb(255,193,37)";   //线段颜色

    this.Draw=function()
    {
        if (!this.Data || !this.Data.Data) return;
        if (this.Data.Data.length!=1) return;

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var yValue=this.Data.Data[0];
        var y=this.ChartFrame.GetYFromData(yValue);
        var xLeft=this.ChartFrame.GetXFromIndex(0);
        var xRight=this.ChartFrame.GetXFromIndex(xPointCount-1);

        var yFix=parseInt(y.toString())+0.5;
        this.Canvas.beginPath();
        this.Canvas.moveTo(xLeft,yFix);
        this.Canvas.lineTo(xRight,yFix);
        this.Canvas.strokeStyle=this.Color;
        this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if (!this.Data || !this.Data.Data) return range;
        if (this.Data.Data.length!=1) return range;

        range.Min=this.Data.Data[0];
        range.Max=this.Data.Data[0];

        return range;
    }
}

/*  水平面积 只有1个数据
    Data 数据结构 
    Value, Value2  区间最大最小值
    Color=面积的颜色
    Title=标题 TitleColor=标题颜色
    支持横屏
*/
function ChartStraightArea() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Color = "rgb(255,193,37)";   //线段颜色
    this.Font ='11px 微软雅黑';

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
          this.DrawNotSupportmessage();
          return;
        }

        if (!this.Data || !this.Data.Data) return;

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var left = this.ChartBorder.GetLeft();
        var xPointCount = this.ChartFrame.XPointCount;

        var xRight = this.ChartFrame.GetXFromIndex(xPointCount - 1);

        //画背景
        for(let i in this.Data.Data)
        {
            let item=this.Data.Data[i];
            if (item==null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color==null) continue;

            let valueMax=Math.max(item.Value,item.Value2);
            let valueMin=Math.min(item.Value,item.Value2);

            let yTop=this.ChartFrame.GetYFromData(valueMax);
            let yBottom=this.ChartFrame.GetYFromData(valueMin);

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(yTop), ToFixedRect(xRight - left), ToFixedRect(yBottom - yTop));
        }

        for(let i in this.Data.Data)
        {
          let item = this.Data.Data[i];
          if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
          if (item.Color == null) continue;

          let valueMax = Math.max(item.Value, item.Value2);
          let valueMin = Math.min(item.Value, item.Value2);

          let yTop = this.ChartFrame.GetYFromData(valueMax);
          let yBottom = this.ChartFrame.GetYFromData(valueMin);

          if (item.Title && item.TitleColor) 
          {
            let x = xRight;
            if (item.Align == 'left') 
            {
              this.Canvas.textAlign = 'left';
              x = left;
            }
            else 
            {
              this.Canvas.textAlign = 'right';
              x = xRight;
            }

            this.Canvas.textBaseline = 'middle';
            this.Canvas.fillStyle = item.TitleColor;
            this.Canvas.font = this.Font;
            let y = yTop + (yBottom - yTop) / 2;
            this.Canvas.fillText(item.Title, x, y);
          }
        }
    }

    this.HScreenDraw = function () 
    {
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTop();
        var height = this.ChartBorder.GetHeight();

        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
            if (item.Color == null) continue;

            let valueMax = Math.max(item.Value, item.Value2);
            let valueMin = Math.min(item.Value, item.Value2);

            var yTop = this.ChartFrame.GetYFromData(valueMax);
            var yBottom = this.ChartFrame.GetYFromData(valueMin);

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(ToFixedRect(yBottom), ToFixedRect(top), ToFixedRect(yTop - yBottom), ToFixedRect(height));

            if (item.Title && item.TitleColor) 
            {
                var xText = yTop + (yBottom - yTop) / 2;
                var yText = bottom;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);

                this.Canvas.textAlign = 'right';
                this.Canvas.textBaseline = 'middle';
                this.Canvas.fillStyle = item.TitleColor;
                this.Canvas.font = this.Font;
                this.Canvas.fillText(item.Title, 0, -2);

                this.Canvas.restore();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;

        if (!this.Data || !this.Data.Data) return range;
        
        for (let i in this.Data.Data)
        {
          let item = this.Data.Data[i];
            if (item==null || isNaN(item.Value) || isNaN(item.Value2)) continue;

            let valueMax=Math.max(item.Value,item.Value2);
            let valueMin=Math.min(item.Value,item.Value2);

            if (range.Max==null) range.Max=valueMax;
            if (range.Min==null) range.Min=valueMin;

            if (range.Max<valueMax) range.Max=valueMax;
            if (range.Min>valueMin) range.Min=valueMin;
        }

        return range;
    }
}

//分钟线
function ChartMinutePriceLine()
{
    this.newMethod=ChartLine;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        var drawCount=0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (bFirstPoint)
            {
                this.Canvas.strokeStyle=this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint=false;
            }
            else
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;
        }

        if (drawCount>0)
            this.Canvas.stroke();
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        if (this.YClose==null) return range;

        range.Min=this.YClose;
        range.Max=this.YClose;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (!value) continue;

            if (range.Max==null) range.Max=value;
            if (range.Min==null) range.Min=value;

            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        if (range.Max==this.YClose && range.Min==this.YClose)
        {
            range.Max=this.YClose+this.YClose*0.1;
            range.Min=this.YClose-this.YClose*0.1;
            return range;
        }

        var distance=Math.max(Math.abs(this.YClose-range.Max),Math.abs(this.YClose-range.Min));
        range.Max=this.YClose+distance;
        range.Min=this.YClose-distance;

        return range;
    }
}

//MACD森林线 支持横屏
function ChartMACD()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpBarColor;
    this.DownColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        var xPointCount=this.ChartFrame.XPointCount;

        var bFirstPoint=true;
        var drawCount=0;
        var yBottom=this.ChartFrame.GetYFromData(0);
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null) continue;

            var x=this.ChartFrame.GetXFromIndex(j);
            var y=this.ChartFrame.GetYFromData(value);

            if (x>chartright) break;

            var xFix=parseInt(x.toString())+0.5;    //毛边修正
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix,yBottom);
            this.Canvas.lineTo(xFix,y);

            if (value>=0) this.Canvas.strokeStyle=this.UpColor;
            else this.Canvas.strokeStyle=this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }
    }

    this.HScreenDraw = function () 
    {
        var chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;

        var yBottom = this.ChartFrame.GetYFromData(0);

        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            this.Canvas.beginPath();
            this.Canvas.moveTo(yBottom, ToFixedPoint(x));
            this.Canvas.lineTo(y, ToFixedPoint(x));

            if (value >= 0) this.Canvas.strokeStyle = this.UpColor;
            else this.Canvas.strokeStyle = this.DownColor;
            this.Canvas.stroke();
            this.Canvas.closePath();
        }
    }
}

//基础图形的XY坐标互换柱子
function ChartXYSubBar()
{
    this.newMethod = ChartBar;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BarID = 0;
    
    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartTop = this.ChartBorder.GetTopEx();
        var xPointCount = this.ChartFrame.XPointCount;
        var yOffset = this.ChartBorder.GetBottom() - distanceWidth / 2.0 - 2.0;

        var xMiddle = this.ChartFrame.GetXFromIndex(0); //0 刻度

        if (dataWidth >= 4) 
        {
            var barCount = this.ChartFrame.BarCount;
            var subBarWidth = dataWidth;
            var subBarOffset = 0;
            if (barCount > 0)     //多柱子需要把框架柱子宽度的平均分割
            {
                subBarWidth = dataWidth / barCount;
                subBarOffset = subBarWidth * this.BarID;
                //console.log('[ChartXYSubBar::Draw] ', subBarWidth, this.BarID, subBarOffset);
            }

            xMiddle = ToFixedRect(xMiddle);   //调整为整数
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, yOffset -= (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                if (value == null || value == 0) continue;

                var yBottom = yOffset + subBarOffset;
                var yTop = yOffset + subBarOffset-dataWidth;
                if (yBottom < chartTop) break;

                var x = this.ChartFrame.GetXFromIndex(value);

                if (value > 0) 
                {
                    this.Canvas.fillStyle = this.UpBarColor;
                    let barWidth = ToFixedRect(Math.abs(x - xMiddle));
                    let barHeight = subBarWidth;
                    if (Math.abs(chartTop - yBottom) < dataWidth) subBarWidth = Math.abs(chartTop - yBottom); //最后一根柱子可能会超出框架
                    this.Canvas.fillRect(xMiddle, ToFixedRect(yTop), barWidth, ToFixedRect(barHeight+0.5));
                }
                else 
                {
                    this.Canvas.fillStyle = this.DownBarColor;
                    //高度调整为整数
                    let barWidth = ToFixedRect(Math.abs(x - xMiddle));
                    let barHeight = subBarWidth;
                    if (Math.abs(chartTop - yBottom) < subBarWidth) barHeight = Math.abs(chartTop - yBottom); //最后一根柱子可能会超出框架
                    this.Canvas.fillRect(xMiddle, ToFixedRect(yTop), -barWidth, ToFixedRect(barHeight+0.5));
                }


            }
        }
        else    //太细了 直接画柱子
        {
            for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, yOffset -= (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                if (value == null || value == 0) continue;

                var yBottom = yOffset;
                var yTop = yOffset - dataWidth;
                if (yTop < chartTop) break;

                var x = this.ChartFrame.GetXFromIndex(value);
                var y = this.ChartFrame.GetYFromData(j);

                if (value > 0) this.Canvas.strokeStyle = this.UpBarColor;
                else this.Canvas.strokeStyle = this.DownBarColor;

                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), y);
                this.Canvas.lineTo(ToFixedPoint(xMiddle), y);
                this.Canvas.stroke();
            }
        }
    }
}

function ChartSubBar()
{
    this.newMethod = ChartBar;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BarID=0;

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        

        var yBottom = this.ChartFrame.GetYFromData(0);
        if (dataWidth >= 4) 
        {
            var barCount = this.ChartFrame.BarCount;
            var subBarWidth = dataWidth;
            var subBarOffset=0;
            if (barCount>0)     //多柱子需要把框架柱子宽度的平均分割
            {
                subBarWidth = dataWidth / barCount;
                subBarOffset = subBarWidth*this.BarID;
                //console.log('[ChartSubBar::Draw] ', subBarWidth, this.BarID, subBarOffset);
            }

            yBottom = ToFixedRect(yBottom);   //调整为整数
            for (let i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                if (value == null || value == 0) continue;

                var left = xOffset + subBarOffset
                var right = xOffset + subBarOffset + subBarWidth;
                if (left > chartright) break;

                var x = this.ChartFrame.GetXFromIndex(j);
                var y = this.ChartFrame.GetYFromData(value);

                if (value > 0) 
                {
                    this.Canvas.fillStyle = this.UpBarColor;
                    //高度调整为整数
                    let height = ToFixedRect(Math.abs(yBottom - y));
                    let barWidth = subBarWidth;
                    if (chartright - left < subBarWidth) barWidth = chartright - left;
                    if (yBottom - y > 0) y = yBottom - height;
                    else y = yBottom + height;
                    this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(barWidth), height);
                }
                else 
                {
                    this.Canvas.fillStyle = this.DownBarColor;
                    //高度调整为整数
                    let height = ToFixedRect(Math.abs(yBottom - y));
                    let barWidth = subBarWidth;
                    if (chartright - left < subBarWidth) barWidth = chartright - left;
                    if (yBottom - y > 0) y = yBottom - height;
                    else y = yBottom + height;
                    this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(subBarWidth), -height);
                }
            }
        }
        else    //太细了 直接画柱子
        {
            for (let i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var value = this.Data.Data[i];
                if (value == null || value == 0) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartright) break;

                var x = this.ChartFrame.GetXFromIndex(j);
                var y = this.ChartFrame.GetYFromData(value);

                if (value > 0) this.Canvas.strokeStyle = this.UpBarColor;
                else this.Canvas.strokeStyle = this.DownBarColor;

                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), y);
                this.Canvas.lineTo(ToFixedPoint(x), yBottom);
                this.Canvas.stroke();
            }
        }
    }
}

//柱子 支持横屏
function ChartBar()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpBarColor=g_JSChartResource.UpBarColor;
    this.DownBarColor=g_JSChartResource.DownBarColor;

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var isHScreen=(this.ChartFrame.IsHScreen===true);
        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var chartright=this.ChartBorder.GetRight();
        if (isHScreen) chartright=this.ChartBorder.GetBottom();
        var xPointCount=this.ChartFrame.XPointCount;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;

        var bFirstPoint=true;
        var drawCount=0;
        var yBottom=this.ChartFrame.GetYFromData(0);
        if (dataWidth>=4)
        {
            yBottom=ToFixedRect(yBottom);   //调整为整数
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                if (value==null || value==0) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var x=this.ChartFrame.GetXFromIndex(j);
                var y=this.ChartFrame.GetYFromData(value);

                if (value>0) 
                {
                    this.Canvas.fillStyle=this.UpBarColor;
                    if (isHScreen)
                    {
                        let height = ToFixedRect(Math.abs(yBottom - y));  //高度调整为整数
                        y=Math.min(yBottom,y);
                        this.Canvas.fillRect(y, ToFixedRect(left), height, ToFixedRect(dataWidth));
                    }
                    else
                    {
                        let height = ToFixedRect(Math.abs(yBottom - y));  //高度调整为整数
                        if (yBottom - y > 0) y = yBottom - height;
                        else y = yBottom + height;
                        this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(dataWidth), height);
                    }
                }
                else 
                {
                    this.Canvas.fillStyle=this.DownBarColor;
                    //高度调整为整数
                    let height = ToFixedRect(Math.abs(yBottom - y));
                    if (yBottom - y > 0) y = yBottom - height;
                    else y = yBottom + height;
                    this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(dataWidth), -height);
                }
            }
        }
        else    //太细了 直接画柱子
        {
            for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
            {
                var value=this.Data.Data[i];
                if (value==null || value==0) continue;

                var left=xOffset;
                var right=xOffset+dataWidth;
                if (right>chartright) break;

                var x=this.ChartFrame.GetXFromIndex(j);
                var y=this.ChartFrame.GetYFromData(value);

                if (value>0) this.Canvas.strokeStyle=this.UpBarColor;
                else this.Canvas.strokeStyle=this.DownBarColor;

                this.Canvas.beginPath();
                if (isHScreen)
                {
                    this.Canvas.moveTo(y, ToFixedPoint(x),);
                    this.Canvas.lineTo(yBottom, ToFixedPoint(x));
                }
                else
                {
                    this.Canvas.moveTo(ToFixedPoint(x),y);
                    this.Canvas.lineTo(ToFixedPoint(x),yBottom);
                }
                this.Canvas.stroke();
            }
        }
    }

    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=0;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (range.Max==null) range.Max=value;
            if (range.Max<value) range.Max=value;
            if (range.Min>value) range.Min=value;
        }

        return range;
    }
}
// 面积图
function ChartBand()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.IsDrawFirst = true;

    this.FirstColor = g_JSChartResource.Index.LineColor[0];
    this.SecondColor = g_JSChartResource.Index.LineColor[1];

    this.Draw=function()
    {
        if (this.NotSupportMessage)
        {
            this.DrawNotSupportmessage();
            return;
        }

        var dataWidth=this.ChartFrame.DataWidth;
        var distanceWidth=this.ChartFrame.DistanceWidth;
        var xPointCount=this.ChartFrame.XPointCount;
        var xOffset=this.ChartBorder.GetLeft()+distanceWidth/2.0+2.0;
        var x = 0;
        var y = 0;
        var y2 = 0;
        var firstlinePoints = [];
        var secondlinePoints = [];
        var lIndex = 0;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var value=this.Data.Data[i];
            if (value==null || value.Value==null || value.Value2 == null) continue;
            x=this.ChartFrame.GetXFromIndex(j);
            y=this.ChartFrame.GetYFromData(value.Value);
            y2 = this.ChartFrame.GetYFromData(value.Value2);
            firstlinePoints[lIndex] = {x:x,y:y};
            secondlinePoints[lIndex] = {x:x,y:y2};
            lIndex++;
        }
        if (firstlinePoints.length > 1)
        {
            this.Canvas.save();
            this.Canvas.beginPath();
            for (var i = 0; i < firstlinePoints.length; ++i)
            {
                if (i == 0)
                    this.Canvas.moveTo(firstlinePoints[i].x, firstlinePoints[i].y);
                else
                    this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
            }  
            for (var j = secondlinePoints.length-1; j >= 0; --j)
            {
                this.Canvas.lineTo(secondlinePoints[j].x, secondlinePoints[j].y);
            }  
            this.Canvas.closePath();
            this.Canvas.strokeStyle = "rgba(255,255,255,0)";
            this.Canvas.stroke();
            this.Canvas.clip();
            this.Canvas.beginPath();
            this.Canvas.moveTo(firstlinePoints[0].x, this.ChartBorder.GetBottom());
            for (var i = 0; i < firstlinePoints.length; ++i)
            {
                this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
            }
            this.Canvas.lineTo(firstlinePoints[firstlinePoints.length-1].x, this.ChartBorder.GetBottom());
            this.Canvas.closePath();
            this.Canvas.fillStyle = this.FirstColor;
            this.Canvas.fill();
            this.Canvas.beginPath();
            this.Canvas.moveTo(secondlinePoints[0].x, this.ChartBorder.GetBottom());
            for (var i = 0; i < secondlinePoints.length; ++i)
            {
                this.Canvas.lineTo(secondlinePoints[i].x, secondlinePoints[i].y);
            }
            this.Canvas.lineTo(secondlinePoints[secondlinePoints.length-1].x, this.ChartBorder.GetBottom());
            this.Canvas.closePath();
            this.Canvas.fillStyle = this.SecondColor;
            this.Canvas.fill();
            this.Canvas.restore();
        }
    }
    this.GetMaxMin=function()
    {
        var xPointCount=this.ChartFrame.XPointCount;
        var range={};
        range.Min=null;
        range.Max=null;
        for(var i=this.Data.DataOffset,j=0;i<this.Data.Data.length && j<xPointCount;++i,++j)
        {
            var value=this.Data.Data[i];
            if (value==null || value.Value==null || value.Value2 == null) continue;
            var maxData = value.Value>value.Value2?value.Value:value.Value2;
            var minData = value.Value<value.Value2?value.Value:value.Value2;
            if (range.Max==null) 
                range.Max = maxData;
            else if (range.Max < maxData)
                range.Max = maxData;
            
            if (range.Min==null)
                range.Min = minData;
            else if (range.Min > minData)
                range.Min = minData; 
        }

        return range;
    }
}

//锁  支持横屏
function ChartLock() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.WidthDiv = 0.2;  // 框子宽度占比
    this.LockCount = 10; // 锁最新的几个数据
    this.BGColor = g_JSChartResource.LockBGColor;
    this.TextColor = g_JSChartResource.LockTextColor;
    this.Font = g_JSChartResource.DefaultTextFont;
    this.Title = '🔒开通权限';
    this.LockRect = null; //上锁区域
    this.LockID;        //锁ID
    this.Callback;      //回调
    this.IndexName;     //指标名字

    this.Draw = function () 
    {
        this.LockRect = null;

        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var xOffset = this.ChartBorder.GetRight();
        var lOffsetWidth = 0;
        if (this.ChartFrame.Data != null) 
        {
            var dataWidth = this.ChartFrame.DataWidth;
            var distanceWidth = this.ChartFrame.DistanceWidth;
            xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
            var chartright = this.ChartBorder.GetRight();
            var xPointCount = this.ChartFrame.XPointCount;
            for (var i = this.ChartFrame.Data.DataOffset, j = 0; i < this.ChartFrame.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
                var data = this.ChartFrame.Data.Data[i];
                if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartright) break;
            }
            lOffsetWidth = (dataWidth + distanceWidth) * this.LockCount;
        }
        if (lOffsetWidth == 0) 
        {
            lOffsetWidth = (xOffset - this.ChartBorder.GetLeft()) * this.WidthDiv;
        }
        var lLeft = xOffset - lOffsetWidth;
        if (lLeft < this.ChartBorder.GetLeft())
            lLeft = this.ChartBorder.GetLeft();
        var lHeight = this.ChartBorder.GetBottom() - this.ChartBorder.GetTop();
        var lWidth = this.ChartBorder.GetRight() - lLeft;
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.fillRect(lLeft, this.ChartBorder.GetTop(), lWidth, lHeight);
        var xCenter = lLeft + lWidth / 2;
        var yCenter = this.ChartBorder.GetTop() + lHeight / 2;
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.Title, xCenter, yCenter);

        this.LockRect = { Left: lLeft, Top: this.ChartBorder.GetTop(), Width: lWidth, Heigh: lHeight };    //保存上锁区域
    }

    this.HScreenDraw = function () 
    {
        var xOffset = this.ChartBorder.GetBottom();

        var lOffsetWidth = 0;
        if (this.ChartFrame.Data != null) 
        {
            var dataWidth = this.ChartFrame.DataWidth;
            var distanceWidth = this.ChartFrame.DistanceWidth;
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            var chartright = this.ChartBorder.GetBottom();
            var xPointCount = this.ChartFrame.XPointCount;
            //求最后1个数据的位置
            for (var i = this.ChartFrame.Data.DataOffset, j = 0; i < this.ChartFrame.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
            {
                var data = this.ChartFrame.Data.Data[i];
                if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                if (right > chartright) break;
            }
            lOffsetWidth = (dataWidth + distanceWidth) * this.LockCount;
        }
        if (lOffsetWidth == 0) 
        {
            lOffsetWidth = (xOffset - this.ChartBorder.GetTop()) * this.WidthDiv;
        }

        var lLeft = xOffset - lOffsetWidth;
        if (lLeft < this.ChartBorder.GetTop()) lLeft = this.ChartBorder.GetTop();
        var lHeight = this.ChartBorder.GetRight() - this.ChartBorder.GetLeft();
        var lWidth = this.ChartBorder.GetBottom() - lLeft;
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.fillRect(this.ChartBorder.GetLeft(), lLeft, lHeight, lWidth);

        var xCenter = this.ChartBorder.GetLeft() + lHeight / 2;
        var yCenter = lLeft + lWidth / 2;
        this.Canvas.save();
        this.Canvas.translate(xCenter, yCenter);
        this.Canvas.rotate(90 * Math.PI / 180);
        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.Title, 0, 0);
        this.Canvas.restore();

        this.LockRect = { Left: this.ChartBorder.GetLeft(), Top: lLeft, Width: lHeight, Heigh: lWidth };    //保存上锁区域
    }

    //x,y是否在上锁区域
    this.GetTooltipData = function (x, y, tooltip) 
    {
        if (this.LockRect == null) return false;

        if (this.IsPointInRect(x, y, this.LockRect.Left, this.LockRect.Top, this.LockRect.Width, this.LockRect.Heigh)) 
        {
            tooltip.Data = { ID: this.LockID, Callback: this.Callback, IndexName: this.IndexName };
            tooltip.ChartPaint = this;
            return true;
        }

        return false;
    }

    this.IsPointInRect=function(x,y,left,top,width,heigh)
    {
        if (x>left && x<left+width && y>top && y<top+heigh) return true;

        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
// 等待提示
function ChartSplashPaint()
{
    this.newMethod=IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Font=g_JSChartResource.DefaultTextFont;            //字体
    this.TextColor=g_JSChartResource.DefaultTextColor;      //文本颜色
    this.IsEnableSplash=false;
    this.SplashTitle='数据加载中.....';

    this.Draw=function()
    {
        if (!this.IsEnableSplash) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;
        this.Canvas.textAlign='center';
        this.Canvas.textBaseline='middle';
        this.Canvas.fillStyle=this.TextColor;
        this.Canvas.font=this.Font;
        this.Canvas.fillText(this.SplashTitle,xCenter,yCenter);
    }

    this.HScreenDraw = function () //横屏
    {
        var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
        var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;

        this.Canvas.save();
        this.Canvas.translate(xCenter, yCenter);
        this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

        this.Canvas.textAlign = 'center';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = this.TextColor;
        this.Canvas.font = this.Font;
        this.Canvas.fillText(this.SplashTitle, 0, 0);

        this.Canvas.restore();
    }
}

/*
    饼图
*/
function ChartPie() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw = function () 
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length > 0)) return this.DrawEmptyData();

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let radius=width/4*0.8;
        this.Canvas.save();
        this.Canvas.translate(left + radius, top + height / 2);

        let totalValue = 0;   //求和
        for (let i in this.Data.Data) 
        {
            totalValue += this.Data.Data[i].Value;
        }

        let startAngle = Math.PI * 1.5;
        let start = startAngle;
        let end = startAngle;
        //画饼图
        for (let i in this.Data.Data)
        {
            let item = this.Data.Data[i];
            let rate = item.Value / totalValue; //占比

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0, 0);

            end += rate * 2 * Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0, 0, radius, start, end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();

            start += rate * 2 * Math.PI;//起始角度
        }

        //画文字
        this.Canvas.restore();
        let textLeft = left + width/2+5;
        let textTop = top + height/2+20;
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font ="14px 微软雅黑";

        for(let i=0,j=0 ;i<this.Data.Data.length; ++i)
        {
            let item=this.Data.Data[i];
            if (!item.Text) continue;

            this.Canvas.fillStyle = item.Color;
            this.Canvas.fillRect(textLeft,textTop-15,13,13);
            
            this.Canvas.fillStyle ='rgb(102,102,102)';
            this.Canvas.fillText(item.Text, textLeft+16, textTop);
            textTop += 20;
            if (textTop > top + height/2 + radius) 
            {
                ++j;
                if (j>=2) break;

                textTop = top + height / 2+20;
                textLeft = right- (width/4) +5;
            }
        }
  }

    //空数据
    this.DrawEmptyData = function () 
    {
        console.log('[ChartPie::DrawEmptyData]')

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let radius = width / 4 * 0.8;
        this.Canvas.save();
        this.Canvas.translate(left + radius, top + height / 2);

        this.Canvas.beginPath();
        this.Canvas.fillStyle = 'rgb(211,211,211)';
        this.Canvas.strokeStyle = "white";
        this.Canvas.arc(0, 0, radius * 0.8, 0, 2 * Math.PI);
        this.Canvas.fill();
        this.Canvas.closePath();
        this.Canvas.stroke();

        this.Canvas.restore();
    }
}


/*
    圆环
*/
function ChartCircle()
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.BGColor ='white';  //背景色
    this.TextHeight=25;

    //空数据
    this.DrawEmptyData = function () 
    {
        console.log('[ChartCircle::DrawEmptyData]')
    }

    this.Draw = function() 
    {
        if (!this.Data || !this.Data.Data || !(this.Data.Data.length > 0)) return this.DrawEmptyData();

        let left = this.ChartBorder.GetLeft();
        let right = this.ChartBorder.GetRight();
        let top = this.ChartBorder.GetTop();
        let bottom = this.ChartBorder.GetBottom();
        let width = this.ChartBorder.GetWidth();
        let height = this.ChartBorder.GetHeight();

        //圆半径
        let lTextHeight = this.TextHeight;
        let size = width - lTextHeight;
        if (size > height - lTextHeight) size = height - lTextHeight;
        let radius = (size - lTextHeight)/2;
        this.Canvas.save();
        this.Canvas.translate(left + width/2, top + height/2 - lTextHeight/2);

        let totalValue = 0;   //求和
        for (let i in this.Data.Data) 
        {
            totalValue += this.Data.Data[i].Value;
        }

        let startAngle = Math.PI*1.5;
        let start = startAngle;
        let end = startAngle;
        //画饼图
        for (let i in this.Data.Data) 
        {
            let item = this.Data.Data[i];
            let rate = item.Value / totalValue; //占比
            //console.log('[ChartPie::Draw]', i, rate, item);

            // 绘制扇形
            this.Canvas.beginPath();
            this.Canvas.moveTo(0, 0);

            end += rate * 2 * Math.PI;//终止角度
            this.Canvas.strokeStyle = "white";
            this.Canvas.fillStyle = item.Color;
            this.Canvas.arc(0, 0, radius, start, end);
            this.Canvas.fill();
            this.Canvas.closePath();
            this.Canvas.stroke();

            start += rate * 2 * Math.PI;//起始角度
        }

        //中心画一个背景色的圆
        this.Canvas.beginPath();
        this.Canvas.fillStyle = this.BGColor;
        this.Canvas.arc(0, 0, radius*0.5, 0, 2 * Math.PI);
        this.Canvas.fill();
        this.Canvas.closePath();
        this.Canvas.stroke();

        this.Canvas.restore();

        //画文字
        this.Canvas.restore();
        let textLeft = left;
        let textTop = top + height / 2 - lTextHeight / 2 + radius+5 + 20;
        this.Canvas.textBaseline = "bottom";
        this.Canvas.textAlign = 'left';
        this.Canvas.font = "14px 微软雅黑";
        let textWidth=0;
        //以圆心左右显示
        for (let i = 0,j=0; i < this.Data.Data.length; ++i) 
        {
            let item = this.Data.Data[i];
            if (!item.Text) continue;

            this.Canvas.fillStyle = item.Color;
            
            if (j%2==0)
            {
                textLeft = left + width / 2 -10;
                textWidth = this.Canvas.measureText(item.Text).width;
                textLeft = textLeft - textWidth-16;
                this.Canvas.fillRect(textLeft, textTop - 15, 13, 13);
                this.Canvas.fillStyle = 'rgb(102,102,102)';
                this.Canvas.fillText(item.Text, textLeft + 16, textTop);
            }
            else
            {
                textLeft =left+width/2+10+10;
                this.Canvas.fillRect(textLeft, textTop - 15, 13, 13);
                this.Canvas.fillStyle = 'rgb(102,102,102)';
                this.Canvas.fillText(item.Text, textLeft + 16, textTop);
                textTop += 20;
            }

            if (textTop > bottom) break;

            ++j;
        }
    }
}

/*
    中国地图
*/


function ChartChinaMap() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ImageData = null;
    this.Left;
    this.Top;
    this.Width;
    this.Height;
    this.ImageWidth;
    this.ImageHeight;

    this.DefaultColor = [217, 222, 239];

    this.Color =
      [
        { Name: '海南', Color: 'rgb(217,222,223)' },
        { Name: '内蒙古', Color: 'rgb(217,222,225)' },
        { Name: '新疆', Color: 'rgb(217,222,226)' },
        { Name: '青海', Color: 'rgb(217,222,227)' },
        { Name: '西藏', Color: 'rgb(217,222,228)' },
        { Name: '云南', Color: 'rgb(217,222,229)' },
        { Name: '黑龙江', Color: 'rgb(217,222,230)' },
        { Name: '吉林', Color: 'rgb(217,222,231)' },
        { Name: '辽宁', Color: 'rgb(217,222,232)' },
        { Name: '河北', Color: 'rgb(217,222,233)' },
        { Name: '山东', Color: 'rgb(217,222,234)' },
        { Name: '江苏', Color: 'rgb(217,222,235)' },
        { Name: '浙江', Color: 'rgb(217,222,236)' },
        { Name: '福建', Color: 'rgb(217,222,237)' },
        { Name: '广东', Color: 'rgb(217,222,238)' },
        { Name: '广西', Color: 'rgb(217,222,239)' },
        { Name: '贵州', Color: 'rgb(217,222,240)' },
        { Name: '湖南', Color: 'rgb(217,222,241)' },
        { Name: '江西', Color: 'rgb(217,222,242)' },
        { Name: '安徽', Color: 'rgb(217,222,243)' },
        { Name: '湖北', Color: 'rgb(217,222,244)' },
        { Name: '重庆', Color: 'rgb(217,222,245)' },
        { Name: '四川', Color: 'rgb(217,222,246)' },
        { Name: '甘肃', Color: 'rgb(217,222,247)' },
        { Name: '陕西', Color: 'rgb(217,222,248)' },
        { Name: '山西', Color: 'rgb(217,222,249)' },
        { Name: '河南', Color: 'rgb(217,222,250)' }
      ];

  this.Draw = function () 
  {
      let left = this.ChartBorder.GetLeft() + 1;
      let right = this.ChartBorder.GetRight() - 1;
      let top = this.ChartBorder.GetTop() + 1;
      let bottom = this.ChartBorder.GetBottom() - 1;
      let width = this.ChartBorder.GetWidth() - 2;
      let height = this.ChartBorder.GetHeight() - 2;

      let imageWidth = CHINA_MAP_IMAGE.width;
      let imageHeight = CHINA_MAP_IMAGE.height;

      let drawImageWidth = imageWidth;
      let drawImageHeight = imageHeight;

      if (height < drawImageHeight || width < drawImageWidth) 
      {
        this.ImageData = null;
        return;
      }

      if (this.Left != left || this.Top != top || this.Width != width || this.Height != height || this.ImageWidth != imageWidth || this.ImageHeight != imageHeight) 
      {
          this.ImageData = null;

          this.ImageWidth = imageWidth;
          this.ImageHeight = imageHeight;
          this.Left = left;
          this.Top = top;
          this.Width = width;
          this.Height = height;

          console.log(imageWidth, imageHeight);
      }

      if (this.ImageData == null) 
      {
          this.Canvas.drawImage(CHINA_MAP_IMAGE, 0, 0, imageWidth, imageHeight, left, top, drawImageWidth, drawImageHeight);
          this.ImageData = this.Canvas.getImageData(left, top, drawImageWidth, drawImageHeight);

          let defaultColorSet = new Set();  //默认颜色填充的色块
          let colorMap = new Map();         //定义颜色填充的色块

          let nameMap = new Map();
          if (this.Data.length > 0) 
          {
            for (let i in this.Data) 
            {
                let item = this.Data[i];
                nameMap.set(item.Name, item.Color)
            }
          }

          console.log(this.Data);
          for (let i in this.Color) 
          {
              let item = this.Color[i];
              if (nameMap.has(item.Name)) 
              {
                colorMap.set(item.Color, nameMap.get(item.Name));
              }
              else 
              {
                defaultColorSet.add(item.Color);
              }
          }

          var color;
          for (let i = 0; i < this.ImageData.data.length; i += 4) 
          {
              color = 'rgb(' + this.ImageData.data[i] + ',' + this.ImageData.data[i + 1] + ',' + this.ImageData.data[i + 2] + ')';

              if (defaultColorSet.has(color)) 
              {
                  this.ImageData.data[i] = this.DefaultColor[0];
                  this.ImageData.data[i + 1] = this.DefaultColor[1];
                  this.ImageData.data[i + 2] = this.DefaultColor[2];
              }
              else if (colorMap.has(color)) 
              {
                  let colorValue = colorMap.get(color);
                  this.ImageData.data[i] = colorValue[0];
                  this.ImageData.data[i + 1] = colorValue[1];
                  this.ImageData.data[i + 2] = colorValue[2];
              }
          }
          this.Canvas.clearRect(left, top, drawImageWidth, drawImageHeight);
          this.Canvas.putImageData(this.ImageData, left, top, 0, 0, drawImageWidth, drawImageHeight);
      }
      else 
      {
          this.Canvas.putImageData(this.ImageData, left, top, 0, 0, drawImageWidth, drawImageHeight);
      }
  }
}

/*
    扩展图形
*/

function IExtendChartPainting()
{
    this.Canvas;                        //画布
    this.ChartBorder;                   //边框信息
    this.ChartFrame;                    //框架画法
    this.Name;                          //名称
    this.Data=new ChartData();          //数据区

    //上下左右间距
    this.Left=5;
    this.Right=5;
    this.Top=5;
    this.Bottom=5;

    this.Draw=function()
    {

    }

}

function StockInfoExtendChartPaint()
{
    this.newMethod=IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Left=80;
    this.Right=1;
    this.Top=1;
    this.Bottom=1;

    this.BorderColor=g_JSChartResource.FrameBorderPen;

    this.Symbol;
    this.Name;

    this.TitleFont=["14px 微软雅黑"];

    this.Draw=function()
    {
        var left=this.ChartBorder.GetRight()+this.Left;
        var right=this.ChartBorder.GetChartWidth()-this.Right;
        var y=this.Top+18;
        var middle=left+(right-left)/2;

        if (this.Symbol && this.Name)
        {
            this.Canvas.font=this.TitleFont[0];

            this.Canvas.textAlign="right";
            this.Canvas.textBaseline="bottom";
            this.Canvas.fillText(this.Symbol,middle-2,y);

            this.Canvas.textAlign="left";
            this.Canvas.fillText(this.Name,middle+2,y);
        }
        ;
        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.moveTo(left,y);
        this.Canvas.lineTo(right,y);
        this.Canvas.stroke();

        y+=30;

        this.DrawBorder();
    }

    this.DrawBorder=function()
    {
        var left=this.ChartBorder.GetRight()+this.Left;
        var right=this.ChartBorder.GetChartWidth()-this.Right;
        var top=this.Top;
        var bottom=this.ChartBorder.GetChartHeight()-this.Bottom;

        this.Canvas.strokeStyle=this.BorderColor;
        this.Canvas.strokeRect(left,top,(right-left),(bottom-top));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//坐标分割
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function IFrameSplitOperator()
{
    this.ChartBorder;                   //边框信息
    this.Frame;                         //框架信息
    this.FrameSplitData;                //坐标轴分割方法
    this.SplitCount=5;                  //刻度个数
    this.StringFormat=0;                //刻度字符串格式 -1 刻度文字全部不显示 -2 刻度文字右边不显示

    //////////////////////
    // data.Min data.Max data.Interval data.Count
    //
    this.IntegerCoordinateSplit=function(data)
    {
        var splitItem=this.FrameSplitData.Find(data.Interval);
        if (!splitItem) return false;

        if (data.Interval==splitItem.Interval) return true;

        //调整到整数倍数,不能整除的 +1
        var fixMax=parseInt((data.Max/(splitItem.FixInterval)+0.5).toFixed(0))*splitItem.FixInterval;
        var fixMin=parseInt((data.Min/(splitItem.FixInterval)-0.5).toFixed(0))*splitItem.FixInterval;
        if (data.Min==0) fixMin=0;  //最小值是0 不用调整了.

        var count=0;
        for(var i=fixMin;(i-fixMax)<0.00000001;i+=splitItem.FixInterval)
        {
            ++count;
        }

        data.Interval=splitItem.FixInterval;
        data.Max=fixMax;
        data.Min=fixMin;
        data.Count=count;

        return true;
    }
}

//字符串格式化 千分位分割
IFrameSplitOperator.FormatValueThousandsString=function(value,floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    var result='';
    var num=value.toFixed(floatPrecision);
    while (num.length > 3)
    {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

//数据输出格式化 floatPrecision=小数位数
IFrameSplitOperator.FormatValueString=function(value, floatPrecision)
{
    if (value==null || isNaN(value))
    {
        if (floatPrecision>0)
        {
            var nullText='-.';
            for(var i=0;i<floatPrecision;++i)
                nullText+='-';
            return nullText;
        }

        return '--';
    }

    if (value<0.00000000001 && value>-0.00000000001)
    {
        return "0";
    }

    var absValue = Math.abs(value);
    if (absValue < 10000)
    {
        return value.toFixed(floatPrecision);
    }
    else if (absValue < 100000000)
    {
        return (value/10000).toFixed(floatPrecision)+"万";
    }
    else if (absValue < 1000000000000)
    {
        return (value/100000000).toFixed(floatPrecision)+"亿";
    }
    else
    {
        return (value/1000000000000).toFixed(floatPrecision)+"万亿";
    }

    return TRUE;
}

IFrameSplitOperator.FormatDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var day=value%100;

    return year.toString()+'-'+month.toString()+'-'+day.toString();
}

IFrameSplitOperator.FormatTimeString=function(value)
{
    var hour=parseInt(value/100);
    var minute=value%100;
    var strHour=hour>=10?hour.toString():'0'+hour.toString();
    var strMinute=minute>=10?minute.toString():'0'+minute.toString();

    return strHour+':'+ strMinute;
}

//报告格式化
IFrameSplitOperator.FormatReportDateString=function(value)
{
    var year=parseInt(value/10000);
    var month=parseInt(value/100)%100;
    var monthText;
    switch(month)
    {
        case 3:
            monthText="一季度报";
            break;
        case 6:
            monthText="半年报";
            break;
        case 9:
            monthText="三季度报";
            break;
        case 12:
            monthText="年报";
            break;
    }

    return year.toString()+ monthText;
}

IFrameSplitOperator.FormatDateTimeString=function(value,isShowDate)
{
    var aryValue=value.split(' ');
    if (aryValue.length<2) return "";
    var time=parseInt(aryValue[1]);
    var minute=time%100;
    var hour=parseInt(time/100);
    var text=(hour<10? ('0'+hour.toString()):hour.toString()) + ':' + (minute<10?('0'+minute.toString()):minute.toString());

    if (isShowDate==true)
    {
        var date=parseInt(aryValue[0]);
        var year=parseInt(date/10000);
        var month=parseInt(date%10000/100);
        var day=date%100;
        text=year.toString() +'-'+ (month<10? ('0'+month.toString()) :month.toString()) +'-'+ (day<10? ('0'+day.toString()):day.toString()) +" " +text;
    }

    return text;
}

function FrameSplitKLinePriceY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        var splitData={};
        splitData.Max=this.Frame.HorizontalMax;
        splitData.Min=this.Frame.HorizontalMin;
        splitData.Count=this.SplitCount;
        splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        this.IntegerCoordinateSplit(splitData);

        this.Frame.HorizontalInfo=[];

        for(var i=0,value=splitData.Min;i<splitData.Count;++i,value+=splitData.Interval)
        {
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=value;
            //this.Frame.HorizontalInfo[i].TextColor = "rgb(51,51,51)";

            if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
            {
                var floatPrecision=2;
                if (!isNaN(value) && Math.abs(value) > 1000) floatPrecision=0;
                this.Frame.HorizontalInfo[i].Message[1]=value.toFixed(floatPrecision);
            }
            else if (this.StringFormat==-1)
            {

            }
            else
            {
                this.Frame.HorizontalInfo[i].Message[1]=value.toFixed(2);
            }
            this.Frame.HorizontalInfo[i].Message[0]=this.Frame.HorizontalInfo[i].Message[1];
            //this.Frame.HorizontalInfo[i].Font="14px 微软雅黑";
            //this.Frame.HorizontalInfo[i].TextColor="rgb(100,0,200)";
            //this.Frame.HorizontalInfo[i].LineColor="rgb(220,220,220)";
        }

        this.Frame.HorizontalMax=splitData.Max;
        this.Frame.HorizontalMin=splitData.Min;
    }

}

function FrameSplitY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        var splitData={};
        splitData.Max=this.Frame.HorizontalMax;
        splitData.Min=this.Frame.HorizontalMin;
        if(this.Frame.YSpecificMaxMin)
        {
            splitData.Count=this.Frame.YSpecificMaxMin.Count;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
        }
        else
        {
            splitData.Count=this.SplitCount;
            splitData.Interval=(splitData.Max-splitData.Min)/(splitData.Count-1);
            this.IntegerCoordinateSplit(splitData);
        }

        this.Frame.HorizontalInfo=[];

        for(var i=0,value=splitData.Min;i<splitData.Count;++i,value+=splitData.Interval)
        {
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=value;
            //this.Frame.HorizontalInfo[i].TextColor="rgb(51,51,51)";

            if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
            {
                var floatPrecision=2;
                if (!isNaN(value) && Math.abs(value) > 1000) floatPrecision=0;
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(value,floatPrecision);
            }
            else if (this.StringFormat == -1) //刻度不显示
            {

            }
            else
            {
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(value,2);
            }
            
            this.Frame.HorizontalInfo[i].Message[0]=this.Frame.HorizontalInfo[i].Message[1];

            if (this.StringFormat == -2)     //刻度右边不显示
                this.Frame.HorizontalInfo[i].Message[1]=null;
            else if (this.StringFormat == -3)
                this.Frame.HorizontalInfo[i].Message[0]=null;
            
            //this.Frame.HorizontalInfo[i].Font="14px 微软雅黑";
            //this.Frame.HorizontalInfo[i].TextColor="rgb(100,0,200)";
            //this.Frame.HorizontalInfo[i].LineColor="rgb(220,220,220)";
        }

        this.Frame.HorizontalMax=splitData.Max;
        this.Frame.HorizontalMin=splitData.Min;
    }
}

function FrameSplitKLineX()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息
    this.MinDistance=12;                //刻度间隔

    this.Operator=function()
    {
        if (this.Frame.Data==null) return;
        this.Frame.VerticalInfo=[];
        var xOffset=this.Frame.Data.DataOffset;
        var xPointCount=this.Frame.XPointCount;

        var lastYear=null, lastMonth=null;

        for (var i = 0, index = xOffset, distance = this.MinDistance;i<xPointCount && index<this.Frame.Data.Data.length ;++i,++index)
        {
            var year=parseInt(this.Frame.Data.Data[index].Date/10000);
            var month=parseInt(this.Frame.Data.Data[index].Date/100)%100;

            if ( (distance < this.MinDistance && lastYear == year) ||
                (lastYear!=null && lastYear==year && lastMonth!=null && lastMonth==month) )
            {
                lastMonth=month;
                ++distance;
                continue;
            }

            var info= new CoordinateInfo();
            info.Value=index-xOffset;
            //info.TextColor = "rgb(51,51,51)";
            var text;
            if (lastYear==null || lastYear!=year)
            {
                text=year.toString();
            }
            else if (lastMonth==null || lastMonth!=month)
            {
                text=month.toString()+"月";
            }

            lastYear=year;
            lastMonth=month;

            if (this.ShowText)
            {
                info.Message[0]=text;
            }

            this.Frame.VerticalInfo.push(info);
            distance=0;
        }
    }
}

function FrameSplitMinutePriceY()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;                        //昨收
    this.Data;                          //分钟数据
    this.AverageData;                   //分钟均线数据
    this.SplitCount=7;

    this.Operator=function()
    {
        this.Frame.HorizontalInfo=[];
        if (!this.Data) return;

        var max=this.YClose;
        var min=this.YClose;

        for(var i in this.Data.Data)
        {
            if (!this.Data.Data[i]) continue;   //价格必须大于0
            if (max<this.Data.Data[i]) max=this.Data.Data[i];
            if (min>this.Data.Data[i]) min=this.Data.Data[i];
        }

        if (this.AverageData)
        {
            for(var i in this.AverageData.Data)
            {
                if (!this.AverageData.Data[i]) continue;    //价格必须大于0
                if (max<this.AverageData.Data[i]) max=this.AverageData.Data[i];
                if (min>this.AverageData.Data[i]) min=this.AverageData.Data[i];
            }
        }

        if (this.YClose==max && this.YClose==min)
        {
            max=this.YClose+this.YClose*0.1;
            min=this.YClose-this.YClose*0.1
        }
        else
        {
            var distanceValue=Math.max(Math.abs(this.YClose-max),Math.abs(this.YClose-min));
            max=this.YClose+distanceValue;
            min=this.YClose-distanceValue;
        }

        var showCount=this.SplitCount;
        var distance=(max-min)/(showCount-1);
        for(var i=0;i<showCount;++i)
        {
            var price=min+(distance*i);
            this.Frame.HorizontalInfo[i]= new CoordinateInfo();
            this.Frame.HorizontalInfo[i].Value=price;

            if (i>0)
            {
                if (this.StringFormat==1)   //手机端格式 如果有万,亿单位了 去掉小数
                {
                    var floatPrecision=2;
                    if (!isNaN(price) && Math.abs(price) > 1000) floatPrecision=0;
                    this.Frame.HorizontalInfo[i].Message[0]=IFrameSplitOperator.FormatValueString(price,floatPrecision);
                }
                else
                {
                    this.Frame.HorizontalInfo[i].Message[0]=IFrameSplitOperator.FormatValueString(price,2);
                }
                var per=(price/this.YClose-1)*100;
                if (per>0) this.Frame.HorizontalInfo[i].TextColor=g_JSChartResource.UpTextColor;
                else if (per<0) this.Frame.HorizontalInfo[i].TextColor=g_JSChartResource.DownTextColor;
                this.Frame.HorizontalInfo[i].Message[1]=IFrameSplitOperator.FormatValueString(per,2)+'%'; //百分比
            }
        }

        this.Frame.HorizontalMax=max;
        this.Frame.HorizontalMin=min;
    }

}

//沪深走势图时间刻度
var SHZE_MINUTE_X_COORDINATE=
[
    [0,     0,"rgb(200,200,200)",   "09:30"],
    [31,	0,"RGB(200,200,200)",	"10:00"],
	[61,	0,"RGB(200,200,200)",	"10:30"],
	[91,	0,"RGB(200,200,200)",	"11:00"],
	[122,	1,"RGB(200,200,200)",	"13:00"],
	[152,	0,"RGB(200,200,200)",	"13:30"],
	[182,	0,"RGB(200,200,200)",	"14:00"],
	[212,	0,"RGB(200,200,200)",	"14:30"],
	[242,	1,"RGB(200,200,200)",	""], // 15:00
];

//港股走势图时间刻度
var HK_MINUTE_X_COORDINATE =
[
    [0, 1, "RGB(200,200,200)", "09:30"],
    [30, 0, "RGB(200,200,200)", "10:00"],
    [60, 1, "RGB(200,200,200)", "10:30"],
    [90, 0, "RGB(200,200,200)", "11:00"],
    [120, 1, "RGB(200,200,200)", "11:30"],
    [151, 0, "RGB(200,200,200)", "13:00"],
    [181, 1, "RGB(200,200,200)", "13:30"],
    [211, 0, "RGB(200,200,200)", "14:00"],
    [241, 1, "RGB(200,200,200)", "14:30"],
    [271, 0, "RGB(200,200,200)", "15:00"],
    [301, 1, "RGB(200,200,200)", "15:30"],
    [331, 1, "RGB(200,200,200)", ""] //16:00
];

function FrameSplitMinuteX()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息
    this.Symbol = null;                   //股票代码 x轴刻度根据股票类型来调整

    this.Operator=function()
    {
        this.Frame.VerticalInfo=[];
        var xPointCount=this.Frame.XPointCount;

        //默认沪深股票
        var xcoordinate = SHZE_MINUTE_X_COORDINATE;
        this.Frame.XPointCount = 243;

        if (this.Symbol != null) 
        {   
            if (this.Symbol.indexOf('.hk') > 0) //港股用港股的刻度 及数据个数
            {
                xcoordinate = HK_MINUTE_X_COORDINATE;
                this.Frame.XPointCount = 332;
            }
        }

        for (var i in xcoordinate)
        {
            var info=new CoordinateInfo();
            //info.TextColor = "rgb(51,51,51)";
            info.Value = xcoordinate[i][0];
            if (this.ShowText)
                info.Message[0] = xcoordinate[i][3];
            this.Frame.VerticalInfo[i]=info;
        }
    }
}

function FrameSplitXData()
{
    this.newMethod=IFrameSplitOperator;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ShowText=true;                 //是否显示坐标信息

    this.Operator=function()
    {
        if (this.Frame.Data==null || this.Frame.XData==null) return;
        this.Frame.VerticalInfo=[];
        var xOffset=this.Frame.Data.DataOffset;
        var xPointCount=this.Frame.XPointCount;

        for(var i=0, index=xOffset; i<xPointCount && index<this.Frame.Data.Data.length ;++i,++index)
        {
            var info= new CoordinateInfo();
            info.Value=index-xOffset;
            
            if (this.ShowText)
                info.Message[0]=this.Frame.XData[i];

            this.Frame.VerticalInfo.push(info);
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
//十字光标
function ChartCorssCursor()
{
    this.Frame;
    this.Canvas;                            //画布
    this.PenColor=g_JSChartResource.CorssCursorPenColor;        //十字线颜色
    this.Font=g_JSChartResource.CorssCursorTextFont;            //字体
    this.TextColor=g_JSChartResource.CorssCursorTextColor;      //文本颜色
    this.TextBGColor=g_JSChartResource.CorssCursorBGColor;      //文本背景色
    this.TextHeight=20;                     //文本字体高度
    this.LastPoint;

    this.PointX;
    this.PointY;

    this.StringFormatX;
    this.StringFormatY;

    this.IsShowText=true;   //是否显示十字光标刻度
    this.IsShow=true;       //是否显示

    this.Draw=function()
    {
        if (!this.LastPoint) return;

        var x=this.LastPoint.X;
        var y=this.LastPoint.Y;

        var isInClient=false;
        var rtClient = new Rect(this.Frame.ChartBorder.GetLeft(), this.Frame.ChartBorder.GetTop(), this.Frame.ChartBorder.GetWidth(), this.Frame.ChartBorder.GetHeight());
        isInClient = rtClient.IsPointIn(x,y);
        this.PointY=null;
        this.PointY==null;

        if (!isInClient) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();
        var top=this.Frame.ChartBorder.GetTopEx();
        var bottom=this.Frame.ChartBorder.GetBottom();

        this.PointY=[[left,y],[right,y]];
        this.PointX=[[x,top],[x,bottom]];

        //十字线
        this.Canvas.beginPath();
        this.Canvas.save();
        this.Canvas.strokeStyle=this.PenColor;
        this.Canvas.setLineDash([3,2]);   //虚线
        //this.Canvas.lineWidth=0.5

        this.Canvas.moveTo(left,ToFixedPoint(y));
        this.Canvas.lineTo(right,ToFixedPoint(y));

        if (this.Frame.SubFrame.length>0)
        {
            for(var i in this.Frame.SubFrame)
            {
                var frame=this.Frame.SubFrame[i].Frame;
                top=frame.ChartBorder.GetTopEx();
                bottom=frame.ChartBorder.GetBottom();
                this.Canvas.moveTo(ToFixedPoint(x),top);
                this.Canvas.lineTo(ToFixedPoint(x),bottom);
            }
        }
        else
        {
            this.Canvas.moveTo(ToFixedPoint(x),top);
            this.Canvas.lineTo(ToFixedPoint(x),bottom);
        }

        this.Canvas.stroke();
        this.Canvas.restore();
        this.Canvas.closePath();

        var xValue=this.Frame.GetXData(x);
        var yValue=this.Frame.GetYData(y);

        this.StringFormatX.Value=xValue;
        this.StringFormatY.Value=yValue;

        if (this.IsShowText && this.StringFormatY.Operator())
        {
            var text=this.StringFormatY.Text;
            this.Canvas.font=this.Font;

            this.Canvas.fillStyle=this.TextBGColor;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素
            if (textWidth < this.Frame.ChartBorder.Right)           //右边不够就不画
            {
                this.Canvas.fillRect(right+2,y-this.TextHeight/2,textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="middle";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,right+4,y,textWidth);
            }
        }

        if (this.IsShowText && this.StringFormatX.Operator())
        {
            var text=this.StringFormatX.Text;
            this.Canvas.font=this.Font;

            this.Canvas.fillStyle=this.TextBGColor;
            var textWidth=this.Canvas.measureText(text).width+4;    //前后各空2个像素
            if (x-textWidth/2<3)    //左边位置不够了, 顶着左边画
            {
                this.Canvas.fillRect(x-1,bottom+2,textWidth,this.TextHeight);
                this.Canvas.textAlign="left";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,x+1,bottom+2,textWidth);
            }
            else if ((right - left) - x < textWidth){            //右边位置不够用，顶着右边画
              this.Canvas.fillRect(x - textWidth, bottom + 2, textWidth, this.TextHeight);
              this.Canvas.textAlign = "right";
              this.Canvas.textBaseline = "top";
              this.Canvas.fillStyle = this.TextColor;
              this.Canvas.fillText(text, x - 1, bottom + 2, textWidth);
            }
            else
            {
                this.Canvas.fillRect(x-textWidth/2,bottom+2,textWidth,this.TextHeight);
                this.Canvas.textAlign="center";
                this.Canvas.textBaseline="top";
                this.Canvas.fillStyle=this.TextColor;
                this.Canvas.fillText(text,x,bottom+2,textWidth);
            }
        }
    }

    this.HScreenDraw = function () 
    {
        var x = this.LastPoint.X;
        var y = this.LastPoint.Y;

        var left = this.Frame.ChartBorder.GetLeft();
        var right = this.Frame.ChartBorder.GetRightEx();
        var top = this.Frame.ChartBorder.GetTop();
        var bottom = this.Frame.ChartBorder.GetBottom();

        this.PointY = [[left, y], [right, y]];
        this.PointX = [[x, top], [x, bottom]];

        //十字线
        this.Canvas.save();
        this.Canvas.strokeStyle = this.PenColor;
        this.Canvas.setLineDash([3, 2]);   //虚线
        //this.Canvas.lineWidth=0.5
        this.Canvas.beginPath();

        //画竖线
        this.Canvas.moveTo(ToFixedPoint(x), top);
        this.Canvas.lineTo(ToFixedPoint(x), bottom);

        //画横线
        if (this.Frame.SubFrame.length > 0) 
        {
            for (var i in this.Frame.SubFrame) 
            {
                var frame = this.Frame.SubFrame[i].Frame;
                this.Canvas.moveTo(frame.ChartBorder.GetLeft(), ToFixedPoint(y));
                this.Canvas.lineTo(frame.ChartBorder.GetRightEx(), ToFixedPoint(y));
            }
        }
        else 
        {
            this.Canvas.moveTo(left, ToFixedPoint(y));
            this.Canvas.lineTo(right, ToFixedPoint(y));
        }

        this.Canvas.stroke();
        this.Canvas.restore();

        var xValue = this.Frame.GetXData(y);
        var yValue = this.Frame.GetYData(x);

        this.StringFormatX.Value = xValue;
        this.StringFormatY.Value = yValue;

        if (this.IsShowText && this.StringFormatY.Operator()) 
        {
            var text = this.StringFormatY.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            var xText = x;
            var yText = bottom;

            this.Canvas.save();
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

            this.Canvas.fillRect(0, -(this.TextHeight / 2), textWidth, this.TextHeight);
            this.Canvas.textAlign = "left";
            this.Canvas.textBaseline = "top";
            this.Canvas.fillStyle = this.TextColor;
            this.Canvas.fillText(text, 2, -(this.TextHeight / 2), textWidth);

            this.Canvas.restore();
        }

        if (this.IsShowText && this.StringFormatX.Operator()) 
        {
            var text = this.StringFormatX.Text;
            this.Canvas.font = this.Font;

            this.Canvas.fillStyle = this.TextBGColor;
            var textWidth = this.Canvas.measureText(text).width + 4;    //前后各空2个像素
            if (y - textWidth / 2 < 3)    //左边位置不够了, 顶着左边画
            {
                var xText = left;
                var yText = y;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(0, 0, textWidth, this.TextHeight);
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, 2, 0, textWidth);

                this.Canvas.restore();
            }
            else 
            {
                var xText = left;
                var yText = y;

                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180); //数据和框子旋转180度

                this.Canvas.fillRect(-textWidth / 2, 0, textWidth, this.TextHeight);
                this.Canvas.textAlign = "center";
                this.Canvas.textBaseline = "top";
                this.Canvas.fillStyle = this.TextColor;
                this.Canvas.fillText(text, 0, 0, textWidth);

                this.Canvas.restore();
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////
//
function IChangeStringFormat()
{
    this.Data;
    this.Value;     //数据
    this.Text;      //输出字符串

    this.Operator=function()
    {
        return false;
    }
}


function HQPriceStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;

        this.Text=IFrameSplitOperator.FormatValueString(this.Value,2);
        return true;
    }
}

function HQDateStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;
        if (!this.Data) return false;

        var index=Math.abs(this.Value-0.5);
        index=parseInt(index.toFixed(0));
        if (this.Data.DataOffset+index>=this.Data.Data.length) return false;

        var date=this.Data.Data[this.Data.DataOffset+index].Date;
        this.Text=IFrameSplitOperator.FormatDateString(date);

        return true;
    }
}

function HQMinuteTimeStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator=function()
    {
        if (!this.Value) return false;

        var index=Math.abs(this.Value);
        index=parseInt(index.toFixed(0));

        if(index == 0)
        {
            this.Text="9:25";
        }
        else if(index<122)
        {
            var time=9*60+30+index-1;
            var minute=time%60;
            if (minute<10) this.Text= parseInt(time/60)+":"+'0'+minute;
            else this.Text= parseInt(time/60)+":"+minute;
        }
        else if(index<243)
        {
            var time=13*60+index-(122);
            var minute=time%60;
            if (minute<10) this.Text= parseInt(time/60)+":"+'0'+minute;
            else this.Text= parseInt(time/60)+":"+minute;
        }
        else
        {
            this.Text="15:00";
        }

        return true;
    }
}


//行情tooltip提示信息格式
var WEEK_NAME=["日","一","二","三","四","五","六"];
function HistoryDataStringFormat()
{
    this.newMethod=IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

    this.VolColor=g_JSChartResource.DefaultTextColor;
    this.AmountColor=g_JSChartResource.DefaultTextColor;

    this.Operator=function()
    {
        var data=this.Value.Data;
        if (!data) return false;

        var date=new Date(parseInt(data.Date/10000),(data.Date/100%100-1),data.Date%100);
        var week=WEEK_NAME[date.getDay()];
        var strText=
            "<span class='tooltip-title'>"+data.Date+"&nbsp&nbsp"+week+"</span>"+
            "<span class='tooltip-con'>开盘:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Open,data.YClose)+";'>"+data.Open.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>最高:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.High,data.YClose)+";'>"+data.High.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>最低:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Low,data.YClose)+";'>"+data.Low.toFixed(2)+"</span><br/>"+
            "<span class='tooltip-con'>收盘:</span>"+
            "<span class='tooltip-num' style='color:"+this.GetColor(data.Close,data.YClose)+";'>"+data.Close.toFixed(2)+"</span><br/>"+
            //"<span style='color:"+this.YClose+";font:微软雅黑;font-size:12px'>&nbsp;前收: "+IFrameSplitOperator.FormatValueString(data.YClose,2)+"</span><br/>"+
            "<span class='tooltip-con'>数量:</span>"+
            "<span class='tooltip-num' style='color:"+this.VolColor+";'>"+IFrameSplitOperator.FormatValueString(data.Vol,2)+"</span><br/>"+
            "<span class='tooltip-con'>金额:</span>"+
            "<span class='tooltip-num' style='color:"+this.AmountColor+";'>"+IFrameSplitOperator.FormatValueString(data.Amount,2)+"</span><br/>";

        //叠加股票
        if (this.Value.ChartPaint.Name=="Overlay-KLine")
        {
            var title="<span style='color:rgb(0,0,0);font:微软雅黑;font-size:12px;text-align:center;display: block;'>"+this.Value.ChartPaint.Title+"</span>";
            strText=title+strText;
        }

        this.Text=strText;
        return true;
    }

    this.GetColor=function(price,yclse)
    {
        if(price>yclse) return this.UpColor;
        else if (price<yclse) return this.DownColor;
        else return this.UnchagneColor;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                      标题
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function IChartTitlePainting()
{
    this.Frame;
    this.Data=new Array();
    this.Canvas;                        //画布
    this.IsDynamic=false;               //是否是动态标题
    this.Position=0;                    //标题显示位置 0 框架里的标题  1 框架上面
    this.CursorIndex;                   //数据索引
    this.Font = g_JSChartResource.DynamicTitleFont;//"12px 微软雅黑";
    this.Title;                         //固定标题(可以为空)
    this.TitleColor=g_JSChartResource.DefaultTextColor;
    this.UpdateUICallback;              //通知外面更新标题
}

var PERIOD_NAME = ["日线", "周线", "月线", "年线", "1分", "5分", "15分", "30分", "60分", "", ""];
var RIGHT_NAME=['不复权','前复权','后复权'];

function DynamicKLineTitlePainting()
{
    this.newMethod=IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic=true;
    this.IsShow=true;       //是否显示

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchagneColor=g_JSChartResource.UnchagneTextColor;

    this.VolColor=g_JSChartResource.DefaultTextColor;
    this.AmountColor=g_JSChartResource.DefaultTextColor;

    this.Symbol;
    this.Name;

    this.IsShowName=true;           //是否显示股票名称
    this.IsShowSettingInfo=true;    //是否显示设置信息(周期 复权)

    this.SendUpdateUIMessage=function(funcName) //通知外面 标题变了
    {
        if (!this.UpdateUICallback) return;

        var sendData = { TitleName: 'K线标题', CallFunction: funcName, Stock: { Name: this.Name, Symbol: this.Symbol, },
            Rect: 
            { 
                Left: this.Frame.ChartBorder.GetLeft(), Right: this.Frame.ChartBorder.GetRight(),
                 Top: 0, Bottom: this.Frame.ChartBorder.GetTop(),
            }
         }; 
        
        //有数据
        if (this.Data && this.Data.Data && this.Data.Data.length>0)
        {
            let index = this.Data.Data.length-1;    //默认最后一天的数据
            if (this.CursorIndex)
            {
                let cursorIndex = Math.abs(this.CursorIndex - 0.5);
                cursorIndex = parseInt(cursorIndex.toFixed(0));
                index = this.Data.DataOffset + cursorIndex;
                if (index >= this.Data.Data.length) index = this.Data.Data.length - 1;
            }

            if (index>=0)
            {
                let item = this.Data.Data[index];
                sendData.Stock.Data = 
                { 
                    Date:item.Date,
                    YClose: item.YClose, Open: item.Open, High: item.High, Low: item.Low, Close: item.Close,
                    Vol: item.Vol, Amount: item.Amount
                }
                if (item.Time) sendData.Date.Time = item.Time;  //分钟K线才有时间
            }
            

            if (this.Data.Period != null) sendData.Stock.PeriodName = PERIOD_NAME[this.Data.Period];   //周期名字
            if (this.Data.Right != null) sendData.Stock.RightName = RIGHT_NAME[this.Data.Right];       //复权名字
        }

        //console.log('[DynamicKLineTitlePainting::SendUpdateUIMessage', sendData);
        this.UpdateUICallback(sendData);
    }

    this.DrawTitle = function () 
    {
        this.SendUpdateUIMessage('DrawTitle');

        if (!this.IsShow) return;
        if (!this.IsShowName && !this.IsShowSettingInfo) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.HScreenDrawTitle();
            this.Canvas.restore();
            return;
        }

        var left = this.Frame.ChartBorder.GetLeft();
        var bottom = this.Frame.ChartBorder.GetTop();
        var right = this.Frame.ChartBorder.GetRight();
        if (bottom<5) return;

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        if (this.IsShowName && this.Name) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var textWidth = this.Canvas.measureText(this.Name).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(this.Name, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.IsShowSettingInfo && this.Data.Period != null && this.Data.Right!=null) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var periodName = PERIOD_NAME[this.Data.Period];
            var rightName = RIGHT_NAME[this.Data.Right];
            var text = "(" + periodName + " " + rightName + ")";
            if (this.Data.Period>=4) text = "(" + periodName + ")"; 
            var textWidth = this.Canvas.measureText(text).width + 2;
            if (left + textWidth > right) return;
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }
    }

    this.HScreenDrawTitle=function()
    {
        var xText = this.Frame.ChartBorder.GetRight();
        var yText = this.Frame.ChartBorder.GetTop();
        var right = this.Frame.ChartBorder.GetHeight();
        if (this.Frame.ChartBorder.Right<10) return;

        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var left = 2;
        var bottom = -2;
        if (this.IsShowName && this.Name) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var textWidth = this.Canvas.measureText(this.Name).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(this.Name, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.IsShowSettingInfo && this.Data.Period != null && this.Data.Right != null) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var periodName = PERIOD_NAME[this.Data.Period];
            var rightName = RIGHT_NAME[this.Data.Right];
            var text = "(" + periodName + " " + rightName + ")";
            if (this.Data.Period >= 4) text = "(" + periodName + ")";
            var textWidth = this.Canvas.measureText(text).width + 2;
            if (left + textWidth > right) return;
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }
    }

    this.Draw=function()
    {
        this.SendUpdateUIMessage('Draw');

        if (!this.IsShow) return;
        if (this.CursorIndex==null || !this.Data) return;
        if (this.Data.length <= 0) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        var index=Math.abs(this.CursorIndex-0.5);
        index=parseInt(index.toFixed(0));
        var dataIndex=this.Data.DataOffset+index;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;
        if (dataIndex<0) return;

        var item=this.Data.Data[dataIndex];

        var left=this.Frame.ChartBorder.GetLeft();
        //var bottom=this.Frame.ChartBorder.GetTop()-this.Frame.ChartBorder.Top/2;
        var bottom=this.Frame.ChartBorder.GetTop();
        var right=this.Frame.ChartBorder.GetRight();
        if (bottom < 5) return;

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline ="bottom";
        this.Canvas.font=this.Font;

        if (this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            //this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.IsShowSettingInfo)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var periodName=PERIOD_NAME[this.Data.Period];
            var rightName=RIGHT_NAME[this.Data.Right];
            var text="("+periodName+" "+rightName+")";
            if(item.Time!=null)  text="("+periodName+")"; 
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth>right) return;
            //this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.UnchagneColor;
        var text=IFrameSplitOperator.FormatDateString(item.Date);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        if(item.Time!=null && !isNaN(item.Time) && item.Time>0)
        {
            var text=IFrameSplitOperator.FormatTimeString(item.Time);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.GetColor(item.Open,item.YClose);
        var text="开:"+item.Open.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.High,item.YClose);
        var text="高:"+item.High.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Low,item.YClose);
        var text="低:"+item.Low.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.GetColor(item.Close,item.YClose);
        var text="收:"+item.Close.toFixed(2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }

    this.HScreenDraw = function () 
    {
        var index = Math.abs(this.CursorIndex - 0.5);
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;
        if (dataIndex < 0) return;

        var item = this.Data.Data[dataIndex];

        var right = this.Frame.ChartBorder.GetHeight();

        var xText = this.Frame.ChartBorder.GetRight();
        var yText = this.Frame.ChartBorder.GetTop();

        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var left = 2;
        var bottom = -2;
        if (this.IsShowName) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var textWidth = this.Canvas.measureText(this.Name).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            //this.Canvas.fillText(this.Name, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.IsShowSettingInfo) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var periodName = PERIOD_NAME[this.Data.Period];
            var rightName = RIGHT_NAME[this.Data.Right];
            var text = "(" + periodName + " " + rightName + ")";
            if (item.Time != null) text = "(" + periodName + ")";           //分钟K线没有复权
            var textWidth = this.Canvas.measureText(text).width + 2;
            if (left + textWidth > right) return;
            //this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }

        this.Canvas.fillStyle = this.UnchagneColor;
        var text = IFrameSplitOperator.FormatDateString(item.Date);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        if (item.Time != null && !isNaN(item.Time) && item.Time > 0) 
        {
            var text = IFrameSplitOperator.FormatTimeString(item.Time);
            var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }

        this.Canvas.fillStyle = this.GetColor(item.Open, item.YClose);
        var text = "开:" + item.Open.toFixed(2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.GetColor(item.High, item.YClose);
        var text = "高:" + item.High.toFixed(2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.GetColor(item.Low, item.YClose);
        var text = "低:" + item.Low.toFixed(2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.GetColor(item.Close, item.YClose);
        var text = "收:" + item.Close.toFixed(2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.VolColor;
        var text = "量:" + IFrameSplitOperator.FormatValueString(item.Vol, 2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.AmountColor;
        var text = "额:" + IFrameSplitOperator.FormatValueString(item.Amount, 2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;
    }

    this.GetColor=function(price,yclse)
    {
        if(price>yclse) return this.UpColor;
        else if (price<yclse) return this.DownColor;
        else return this.UnchagneColor;
    }

}

function DynamicMinuteTitlePainting()
{
    this.newMethod=DynamicKLineTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;
    this.IsShowDate=false;  //标题是否显示日期
    this.IsShowName=true;   //标题是否显示股票名字

    this.DrawTitle=function()
    {

    }

    this.Draw=function()
    {
        if (!this.IsShow) return;
        if (this.CursorIndex==null || !this.Data || !this.Data.Data) return;
        if (this.Data.Data.length<=0) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        //var index=Math.abs(this.CursorIndex-0.5);
        var index=this.CursorIndex;
        index=parseInt(index.toFixed(0));
        var dataIndex=index+this.Data.DataOffset;
        if (dataIndex>=this.Data.Data.length) dataIndex=this.Data.Data.length-1;

        var item=this.Data.Data[dataIndex];

        var left=this.Frame.ChartBorder.GetLeft();
        var bottom=this.Frame.ChartBorder.GetTop()-this.Frame.ChartBorder.Top/2;
        //var bottom = this.Frame.ChartBorder.GetTop() - this.Frame.ChartBorder.Top - 15;
        var right=this.Frame.ChartBorder.GetRight();
        if (bottom < 5) return;

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="middle";
        this.Canvas.font=this.Font;

        if(this.IsShowName)
        {
            this.Canvas.fillStyle=this.UnchagneColor;
            var textWidth=this.Canvas.measureText(this.Name).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(this.Name,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.UnchagneColor;
        var text=IFrameSplitOperator.FormatDateTimeString(item.DateTime,this.IsShowDate);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        if (item.Close != null) 
        {
            this.Canvas.fillStyle=this.GetColor(item.Close,this.YClose);
            var text="价格:"+item.Close.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (item.AvPrice != null)
        {
            this.Canvas.fillStyle=this.GetColor(item.AvPrice,this.YClose);
            var text="均价:"+item.AvPrice.toFixed(2);
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            if (left+textWidth>right) return;
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        this.Canvas.fillStyle=this.VolColor;
        var text="量:"+IFrameSplitOperator.FormatValueString(item.Vol,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;

        this.Canvas.fillStyle=this.AmountColor;
        var text="额:"+IFrameSplitOperator.FormatValueString(item.Amount,2);
        var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
        if (left+textWidth>right) return;
        this.Canvas.fillText(text,left,bottom,textWidth);
        left+=textWidth;
    }

    this.HScreenDraw = function ()
     {
        var xText = this.Frame.ChartBorder.GetRight();
        var yText = this.Frame.ChartBorder.GetTop();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = index + this.Data.DataOffset;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;

        var item = this.Data.Data[dataIndex];

        var left = 2;
        var bottom = -2;    //上下居中显示
        var right = this.Frame.ChartBorder.GetHeight();

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        if (this.IsShowName) 
        {
            this.Canvas.fillStyle = this.UnchagneColor;
            var textWidth = this.Canvas.measureText(this.Name).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(this.Name, left, bottom, textWidth);
            left += textWidth;
        }

        this.Canvas.fillStyle = this.UnchagneColor;
        var text = IFrameSplitOperator.FormatDateTimeString(item.DateTime, this.IsShowDate);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        if (item.Close != null) 
        {
            this.Canvas.fillStyle = this.GetColor(item.Close, this.YClose);
            var text = "价格:" + item.Close.toFixed(2);
            var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }

        if (item.AvPrice != null) 
        {
            this.Canvas.fillStyle = this.GetColor(item.AvPrice, this.YClose);
            var text = "均价:" + item.AvPrice.toFixed(2);
            var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
            if (left + textWidth > right) return;
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }

        this.Canvas.fillStyle = this.VolColor;
        var text = "量:" + IFrameSplitOperator.FormatValueString(item.Vol, 2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;

        this.Canvas.fillStyle = this.AmountColor;
        var text = "额:" + IFrameSplitOperator.FormatValueString(item.Amount, 2);
        var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
        if (left + textWidth > right) return;
        this.Canvas.fillText(text, left, bottom, textWidth);
        left += textWidth;
    }
}

//字符串输出格式
var STRING_FORMAT_TYPE =
{
    DEFAULT: 1,     //默认 2位小数 单位自动转化 (万 亿)
    THOUSANDS:21,   //千分位分割
};

function DynamicTitleData(data,name,color)
{
    this.Data=data;
    this.Name=name;
    this.Color=color;   //字体颜色
    this.DataType;      //数据类型
    this.StringFormat=STRING_FORMAT_TYPE.DEFAULT;   //字符串格式
    this.FloatPrecision=2;                          //小数位数
    this.GetTextCallback;                           //自定义数据转文本回调
}

function DynamicChartTitlePainting()
{
    this.newMethod=IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic=true;
    this.Data=new Array();
    this.Explain;
    this.TitleBG;             //标题背景色
    this.TitleBGHeight = 20;  //标题背景色高度
    this.TitleAlign ='middle';//对其方式
    this.TitleBottomDistance=1; //标题靠底部输出的时候 字体和底部的间距

    this.Text=new Array();  //副标题 Text:'文本', Color:'颜色'

    this.FormatValue = function (value, item) {
      if (item.StringFormat == STRING_FORMAT_TYPE.DEFAULT)
        return IFrameSplitOperator.FormatValueString(value, item.FloatPrecision);
      else if (item.StringFormat = STRING_FORMAT_TYPE.THOUSANDS)
        return IFrameSplitOperator.FormatValueThousandsString(value, item.FloatPrecision);
    }

    this.FormatMultiReport = function (data, format) {
      var text = "";
      for (var i in data) {
        var item = data[i];
        let quarter = item.Quarter;
        let year = item.Year;
        let value = item.Value;

        if (text.length > 0) text += ',';

        text += year.toString();
        switch (quarter) {
          case 1:
            text += '一季报 ';
            break;
          case 2:
            text += '半年报 ';
            break;
          case 3:
            text += '三季报 ';
            break;
          case 4:
            text += '年报 ';
            break;
        }

        text += this.FormatValue(value, format);
      }

      return text;
    }

    this.SendUpdateUIMessage = function (funcName) //通知外面 标题变了
    {
        if (!this.UpdateUICallback) return;

        var sendData = { TitleName: '指标标题', CallFunction: funcName, 
            TitleData: { Title: this.Title, Identify: this.Frame.Identify, Data:[] },
            Rect:   //标题的位置
            { 
                Top: this.Frame.ChartBorder.GetTop(),Left: this.Frame.ChartBorder.GetLeft(),
                Right: this.Frame.ChartBorder.GetRight(),Bottom: this.Frame.ChartBorder.GetBottom()
            }
            };

        for (var i in this.Data) 
        {
            var item = this.Data[i];
            if (!item || !item.Data || !item.Data.Data) continue;
            if (item.Data.Data.length <= 0) continue;

            var titleItem = { Name: item.Name, Color: item.Color};
            if (item.DataType) titleItem.DataType=item.DataType;

            if (item.DataType == "StraightLine")  //直线只有1个数据
            {
                titleItem.Value=item.Data.Data[0];
            }
            else 
            {
                var index=item.Data.Data.length-1;
                if (this.CursorIndex!=null)
                {
                    var cursorIndex = Math.abs(this.CursorIndex - 0.5);
                    cursorIndex = parseInt(cursorIndex.toFixed(0));
                    index = item.Data.DataOffset + cursorIndex
                }
                if (index >= item.Data.Data.length) index = item.Data.Data.length - 1;

                titleItem.Value=item.Data.Data[index];
            }

            sendData.TitleData.Data.push(titleItem);
        }

        //console.log('[DynamicChartTitlePainting::SendUpdateUIMessage', sendData);
        this.UpdateUICallback(sendData);
    }

    this.DrawTitle=function()
    {
        this.SendUpdateUIMessage('DrawTitle');
        if (this.Frame.ChartBorder.TitleHeight < 5) return;
        if (this.Frame.IsShowTitle==false) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.HScreenDrawTitle();
            this.Canvas.restore();
            return;
        }

        let left = this.Frame.ChartBorder.GetLeft() + 1;
        let bottom = this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.TitleHeight / 2;    //上下居中显示
        if (this.TitleAlign == 'bottom') bottom = this.Frame.ChartBorder.GetTopEx() - this.TitleBottomDistance;            
        let right = this.Frame.ChartBorder.GetRight();

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = this.TitleAlign;
        this.Canvas.font = this.Font;
        
        let textWidth=10;
        if (this.TitleBG && this.Title)
        {
            textWidth = this.Canvas.measureText(this.Title).width + 2;
            let height = this.Frame.ChartBorder.TitleHeight;
            let top = this.Frame.ChartBorder.GetTop();
            if (height>20) 
            {
                top += (height - 20) / 2 + (height - 45) / 2;
                height=20;
            }

            if (this.TitleAlign == 'bottom')  //底部输出文字
            {
                top = this.Frame.ChartBorder.GetTopEx()-20;
                if (top<0) top=0;
            }

            this.Canvas.fillStyle=this.TitleBG;
            this.Canvas.fillRect(left, top, textWidth, height);
        }

        if (this.Title)
        {
            this.Canvas.fillStyle = this.TitleColor;
            const metrics=this.Canvas.measureText(this.Title);
            textWidth = metrics.width+2;
            this.Canvas.fillText(this.Title, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.Text && this.Text.length > 0) 
        {
            for (let i in this.Text) 
            {
                let item = this.Text[i];
                this.Canvas.fillStyle = item.Color;
                textWidth = this.Canvas.measureText(item.Text).width + 2;
                this.Canvas.fillText(item.Text, left, bottom, textWidth);
                left += textWidth;
            }
        }

    }

    this.Draw=function()
    {
        this.SendUpdateUIMessage('Draw');

        if (this.CursorIndex==null ) return;
        if (!this.Data) return;
        if (this.Frame.ChartBorder.TitleHeight<5) return;
        if (this.Frame.IsShowTitle == false) return;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.HScreenDraw();
            this.Canvas.restore();
            return;
        }

        var left=this.Frame.ChartBorder.GetLeft()+1;
        var bottom=this.Frame.ChartBorder.GetTop()+this.Frame.ChartBorder.TitleHeight/2;    //上下居中显示
        if (this.TitleAlign == 'bottom') bottom = this.Frame.ChartBorder.GetTopEx() - this.TitleBottomDistance;   
        var right=this.Frame.ChartBorder.GetRight();

        this.Canvas.textAlign="left";
        this.Canvas.textBaseline = this.TitleAlign;
        this.Canvas.font=this.Font;

        if (this.Title)
        {
            this.Canvas.fillStyle=this.TitleColor;
            let textWidth=this.Canvas.measureText(this.Title).width+2;
            //this.Canvas.fillText(this.Title,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.Text && this.Text.length > 0) 
        {
          for (let i in this.Text) 
          {
            let item = this.Text[i];
            this.Canvas.fillStyle = item.Color;
            let textWidth = this.Canvas.measureText(item.Text).width + 2;
            //this.Canvas.fillText(item.Text, left, bottom, textWidth);
            left += textWidth;
          }
        }

        for(var i in this.Data)
        {
            var item=this.Data[i];
            if (!item || !item.Data || !item.Data.Data) continue;

            if (item.Data.Data.length<=0) continue;

            var value=null;
            var valueText = null;
            if (item.DataType=="StraightLine")  //直线只有1个数据
            {
                value=item.Data.Data[0];
                valueText = this.FormatValue(value, item);
            }
            else
            {
                var index=Math.abs(this.CursorIndex-0.5);
                index=parseInt(index.toFixed(0));
                if (item.Data.DataOffset+index>=item.Data.Data.length) continue;

                value=item.Data.Data[item.Data.DataOffset+index];
                if (value==null) continue;

                if (item.DataType=="HistoryData-Vol")
                {
                  value = value.Vol;
                  valueText = this.FormatValue(value, item);
                }
                else if (item.DataType == "MultiReport") 
                {
                  valueText = this.FormatMultiReport(value, item);
                }
                else 
                {
                  if (item.GetTextCallback) valueText = item.GetTextCallback(value, item);
                  else valueText = this.FormatValue(value, item);
                }
            }

            this.Canvas.fillStyle=item.Color;

            var text=item.Name+":"+valueText;
            var textWidth=this.Canvas.measureText(text).width+2;    //后空2个像素
            this.Canvas.fillText(text,left,bottom,textWidth);
            left+=textWidth;
        }

        if (this.Explain)   //说明信息
        {
            this.Canvas.fillStyle=this.TitleColor;
            var text="说明:"+this.Explain;
            var textWidth=this.Canvas.measureText(text).width+2;
            if (left+textWidth<right)
            {
                this.Canvas.fillText(text,left,bottom,textWidth);
                left+=textWidth;
            }
        }
    }

    this.HScreenDraw = function () 
    {
        var xText = this.Frame.ChartBorder.GetRightEx();
        var yText = this.Frame.ChartBorder.GetTop();
        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        var left = 1;
        var bottom = -this.Frame.ChartBorder.TitleHeight / 2;    //上下居中显示
        var right = this.Frame.ChartBorder.GetHeight();

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "middle";
        this.Canvas.font = this.Font;

        if (this.Title) 
        {
            this.Canvas.fillStyle = this.TitleColor;
            var textWidth = this.Canvas.measureText(this.Title).width + 2;
            //this.Canvas.fillText(this.Title, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.Text && this.Text.length > 0) 
        {
            for (let i in this.Text) 
            {
                let item = this.Text[i];
                this.Canvas.fillStyle = item.Color;
                let textWidth = this.Canvas.measureText(item.Text).width + 2;
                //this.Canvas.fillText(item.Text, left, bottom, textWidth);
                left += textWidth;
            }
        }

        for (var i in this.Data) 
        {
            var item = this.Data[i];
            if (!item || !item.Data || !item.Data.Data || !item.Name) continue;

            if (item.Data.Data.length <= 0) continue;

            var value = null;
            var valueText = null;
            if (item.DataType == "StraightLine")  //直线只有1个数据
            {
                value = item.Data.Data[0];
                valueText = this.FormatValue(value, item);
            }
            else 
            {
                var index = Math.abs(this.CursorIndex - 0.5);
                index = parseInt(index.toFixed(0));
                if (item.Data.DataOffset + index >= item.Data.Data.length) continue;

                value = item.Data.Data[item.Data.DataOffset + index];
                if (value == null) continue;

                if (item.DataType == "HistoryData-Vol") 
                {
                    value = value.Vol;
                    valueText = this.FormatValue(value, item);
                }
                else if (item.DataType == "MultiReport")
                {
                    valueText = this.FormatMultiReport(value, item);
                }
                else 
                {
                    if (item.GetTextCallback) valueText = item.GetTextCallback(value, item);
                    else valueText = this.FormatValue(value, item);
                }
            }

            this.Canvas.fillStyle = item.Color;

            var text = item.Name + ":" + valueText;
            var textWidth = this.Canvas.measureText(text).width + 2;    //后空2个像素
            this.Canvas.fillText(text, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.Explain)   //说明信息
        {
            this.Canvas.fillStyle = this.TitleColor;
            var text = "说明:" + this.Explain;
            var textWidth = this.Canvas.measureText(text).width + 2;
            if (left + textWidth < right) 
            {
                this.Canvas.fillText(text, left, bottom, textWidth);
                left += textWidth;
            }
        }
    }

    this.HScreenDrawTitle=function()
    {
        var xText = this.Frame.ChartBorder.GetRightEx();
        var yText = this.Frame.ChartBorder.GetTop();

        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        let left = 1;
        let bottom = -(this.Frame.ChartBorder.TitleHeight/2);    //上下居中显示
        if (this.TitleAlign == 'bottom') bottom = -this.TitleBottomDistance;
        let right = this.Frame.ChartBorder.GetHeight();

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = this.TitleAlign;
        this.Canvas.font = this.Font;

        let textWidth = 10;
        if (this.TitleBG && this.Title) 
        {
            textWidth = this.Canvas.measureText(this.Title).width + 2;
            let height = this.Frame.ChartBorder.TitleHeight;
            let top = this.Frame.ChartBorder.GetTop();
            if (height > 20) 
            {
                top += (height - 20) / 2 + (height - 45) / 2;
                height = 20;
            }

            if (this.TitleAlign == 'bottom')  //底部输出文字
            {
                top = this.Frame.ChartBorder.GetTopEx() - 20;
                if (top < 0) top = 0;
            }

            this.Canvas.fillStyle = this.TitleBG;
            this.Canvas.fillRect(left, top, textWidth, height);
        }

        if (this.Title) 
        {
            this.Canvas.fillStyle = this.TitleColor;
            const metrics = this.Canvas.measureText(this.Title);
            textWidth = metrics.width + 2;
            this.Canvas.fillText(this.Title, left, bottom, textWidth);
            left += textWidth;
        }

        if (this.Text && this.Text.length > 0) 
        {
            for (let i in this.Text) 
            {
                let item = this.Text[i];
                this.Canvas.fillStyle = item.Color;
                textWidth = this.Canvas.measureText(item.Text).width + 2;
                this.Canvas.fillText(item.Text, left, bottom, textWidth);
                left += textWidth;
            }
        }
    }
}


/*
    画图工具
*/
function IChartDrawPicture()
{
    this.Frame;
    this.Canvas;
    this.Point=new Array()                      //画图的点
    this.Value=new Array();                     //XValue,YValue
    this.PointCount=2;                          //画点的个数
    this.Status=0;                              //0 开始画 1 完成第1个点  2 完成第2个点    10 完成 20 移动
    this.MovePointIndex=null;                        //移动哪个点 0-10 对应Point索引  100 整体移动

    this.LineColor=g_JSChartResource.DrawPicture.LineColor[0];                            //线段颜色
    this.PointColor=g_JSChartResource.DrawPicture.PointColor[0];

    this.Draw=function()
    {

    }

    //Point => Value
    this.PointToValue=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        for(var i in this.Point)
        {
            var item=this.Point[i];
            var xValue=parseInt(this.Frame.GetXData(item.X))+data.DataOffset;
            var yValue=this.Frame.GetYData(item.Y);

            this.Value[i]={};
            this.Value[i].XValue=xValue;
            this.Value[i].YValue=yValue;
        }

        return true;
    }

    this.IsPointIn=function(x,y)
    {
        return false;
    }

    //Value => Point
    this.ValueToPoint=function()
    {
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        this.Point=[];
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);
            this.Point[i]=pt;
        }
    }

    //xStep,yStep 移动的偏移量
    this.Move=function(xStep,yStep)
    {
        if (this.Status!=20) return fasle;
        if (!this.Frame) return false;
        var data=this.Frame.Data;
        if (!data) return false;

        if (this.MovePointIndex==100)    //整体移动
        {
            for(var i in this.Point)
            {
                this.Point[i].X+=xStep;
                this.Point[i].Y+=yStep;
            }
        }
        else if (this.MovePointIndex==0 || this.MovePointIndex==1)
        {
            this.Point[this.MovePointIndex].X+=xStep;
            this.Point[this.MovePointIndex].Y+=yStep;
        }
    }

    this.ClipFrame=function()
    {
        var left=this.Frame.ChartBorder.GetLeft();
        var top=this.Frame.ChartBorder.GetTopEx();
        var width=this.Frame.ChartBorder.GetWidth();
        var height=this.Frame.ChartBorder.GetHeightEx();

        this.Canvas.save();
        this.Canvas.beginPath();
        this.Canvas.rect(left,top,width,height);
        this.Canvas.clip();
    }

    //计算需要画的点的坐标
    this.CalculateDrawPoint=function()
    {
        if (this.Status<2) return null;
        if(!this.Point.length || !this.Frame) return null;

        var drawPoint=new Array();
        if (this.Status==10)
        {
            var data=this.Frame.Data;
            if (!data) return null;

            for(var i in this.Value)
            {
                var item=this.Value[i];
                var pt=new Point();
                pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
                pt.Y=this.Frame.GetYFromData(item.YValue);
                drawPoint.push(pt);
            }
        }
        else
        {
            drawPoint=this.Point;
        }

        return drawPoint;
    }

    this.DrawPoint=function(aryPoint)
    {
        if (!aryPoint || aryPoint.length<=0) return;

        //画点
        this.ClipFrame();
        for(var i in aryPoint)
        {
            var item=aryPoint[i];

            this.Canvas.beginPath();
            this.Canvas.arc(item.X,item.Y,5,0,360,false);
            this.Canvas.fillStyle=this.PointColor;      //填充颜色
            this.Canvas.fill();                         //画实心圆
            this.Canvas.closePath();
        }

        this.Canvas.restore();
    }
}

/*
    画图工具-线段
*/

function ChartDrawPictureLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint) return;

        this.ClipFrame();

        for(var i in drawPoint)
        {
            var item=drawPoint[i];
            if (i==0)
            {
                this.Canvas.beginPath();
                this.Canvas.moveTo(item.X,item.Y);
            }
            else
            {
                this.Canvas.lineTo(item.X,item.Y);
            }

        }

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }


    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在线段上
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return 100;

        return -1;
    }
}

/*
    画图工具-射线
*/
function ChartDrawPictureHaflLine()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        this.Canvas.beginPath();
        this.Canvas.moveTo(drawPoint[0].X,drawPoint[0].Y);
        this.Canvas.lineTo(drawPoint[1].X,drawPoint[1].Y);

        var endPoint=this.CalculateEndPoint(drawPoint);
        this.Canvas.lineTo(endPoint.X,endPoint.Y);

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    this.CalculateEndPoint=function(aryPoint)
    {
        var left=this.Frame.ChartBorder.GetLeft();
        var right=this.Frame.ChartBorder.GetRight();

        var a=aryPoint[1].X-aryPoint[0].X;
        var b=aryPoint[1].Y-aryPoint[0].Y;

        if (a>0)
        {
            var a1=right-aryPoint[0].X;
            var b1=a1*b/a;
            var y=b1+aryPoint[0].Y;

            var pt=new Point();
            pt.X=right;
            pt.Y=y;
            return pt;
        }
        else
        {
            var a1=aryPoint[0].X-left;
            var b1=a1*b/Math.abs(a);
            var y=b1+aryPoint[0].Y;

            var pt=new Point();
            pt.X=left;
            pt.Y=y;
            return pt;
        }
    }


    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在线段上
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return 100;

        return -1;
    }
}

/*
    画图工具-矩形
*/
function ChartDrawPictureRect()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        this.Canvas.beginPath();
        this.Canvas.rect(drawPoint[0].X,drawPoint[0].Y,drawPoint[1].X-drawPoint[0].X,drawPoint[1].Y-drawPoint[0].Y);

        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在矩形边框上
        var linePoint=[ {X:aryPoint[0].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[0].Y}];
        if (this.IsPointInLine(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[1].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[1].Y}];
        if (this.IsPointInLine2(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[1].X,Y:aryPoint[1].Y},{X:aryPoint[0].X,Y:aryPoint[1].Y}];
        if (this.IsPointInLine(linePoint,x,y))
            return 100;

        linePoint=[ {X:aryPoint[0].X,Y:aryPoint[1].Y},{X:aryPoint[0].X,Y:aryPoint[0].Y}];
        if (this.IsPointInLine2(linePoint,x,y))
            return 100;

        return -1;
    }

    //点是否在线段上 水平线段
    this.IsPointInLine=function(aryPoint,x,y)
    {
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X,aryPoint[0].Y+5);
        this.Canvas.lineTo(aryPoint[0].X,aryPoint[0].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y-5);
        this.Canvas.lineTo(aryPoint[1].X,aryPoint[1].Y+5);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return true;
    }

    //垂直线段
    this.IsPointInLine2=function(aryPoint,x,y)
    {
        this.Canvas.beginPath();
        this.Canvas.moveTo(aryPoint[0].X-5,aryPoint[0].Y);
        this.Canvas.lineTo(aryPoint[0].X+5,aryPoint[0].Y);
        this.Canvas.lineTo(aryPoint[1].X+5,aryPoint[1].Y);
        this.Canvas.lineTo(aryPoint[1].X-5,aryPoint[1].Y);
        this.Canvas.closePath();
        if (this.Canvas.isPointInPath(x,y))
            return true;
    }
}

/*
    画图工具-弧形
*/
function ChartDrawPictureArc()
{
    this.newMethod=IChartDrawPicture;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Draw=function()
    {
        var drawPoint=this.CalculateDrawPoint();
        if (!drawPoint || drawPoint.length!=2) return;

        this.ClipFrame();

        //this.Canvas.beginPath();
        //this.Canvas.rect(drawPoint[0].X,drawPoint[0].Y,drawPoint[1].X-drawPoint[0].X,drawPoint[1].Y-drawPoint[0].Y);
        if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第一象限
        {
            var a = drawPoint[1].X - drawPoint[0].X;
            var b = drawPoint[0].Y - drawPoint[1].Y;
            var step = (a > b) ? 1/a : 1 / b;
            var xcenter = drawPoint[0].X;
            var ycenter = drawPoint[1].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 1.5*Math.PI; i < 2*Math.PI; i+=step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter+b*Math.sin(i)*-1);
            }
            for (var j = 0; j <= 0.5*Math.PI; j += step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(j), ycenter+b*Math.sin(j)*-1);
            }
        }
        else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第二象限
        {
            var a = drawPoint[0].X - drawPoint[1].X;
            var b = drawPoint[0].Y - drawPoint[1].Y;
            var step = (a > b) ? 1/a:1/b;
            var xcenter = drawPoint[1].X;
            var ycenter = drawPoint[0].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 0; i <= Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }
        else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第三象限
        {
            var a = drawPoint[0].X - drawPoint[1].X;
            var b = drawPoint[1].Y - drawPoint[0].Y;
            var step = (a > b) ? 1/a:1/b;
            var xcenter = drawPoint[0].X;
            var ycenter = drawPoint[1].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = 0.5*Math.PI; i <= 1.5*Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }
        else if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第四象限
        {
            var a = drawPoint[1].X - drawPoint[0].X;
            var b = drawPoint[1].Y - drawPoint[0].Y;
            var step = (a > b) ? 1/a : 1/b;
            var xcenter = drawPoint[1].X;
            var ycenter = drawPoint[0].Y;
            this.Canvas.beginPath();
            this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
            for (var i = Math.PI; i <= 2*Math.PI; i += step)
            {
                this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
            }
        }


        this.Canvas.strokeStyle=this.LineColor;
        this.Canvas.stroke();
        //this.Canvas.closePath();
        this.Canvas.restore();

        //画点
        this.DrawPoint(drawPoint);
    }

    //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
    this.IsPointIn=function(x,y)
    {
        if (!this.Frame || this.Status!=10) return -1;

        var data=this.Frame.Data;
        if (!data) return -1;

        //是否在点上
        var aryPoint=new Array();
        for(var i in this.Value)
        {
            var item=this.Value[i];
            var pt=new Point();
            pt.X=this.Frame.GetXFromIndex(item.XValue-data.DataOffset);
            pt.Y=this.Frame.GetYFromData(item.YValue);

            this.Canvas.beginPath();
            this.Canvas.arc(pt.X,pt.Y,5,0,360);
            //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
            if (this.Canvas.isPointInPath(x,y))
                return i;

            aryPoint.push(pt);
        }

        //是否在弧线上
        var ArcPoint=[ {X:aryPoint[0].X,Y:aryPoint[0].Y},{X:aryPoint[1].X,Y:aryPoint[1].Y}];
        if (this.IsPointInArc(ArcPoint, x, y))
            return 100;

        return -1;
    }
    this.IsPointInArc=function(aryPoint,x,y)
    {
        if (aryPoint.length != 2)
         return false;
        if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第一象限
        {
             var a = aryPoint[1].X - aryPoint[0].X;
             var b = aryPoint[0].Y - aryPoint[1].Y;
             var step = (a > b) ? 1/a : 1 / b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[0].X;
             var ycenter = aryPoint[1].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 1.5*Math.PI; i < 2*Math.PI; i+=step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter+b*Math.sin(i)*-1);
             }
             for (var j = 0; j <= 0.5*Math.PI; j += step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(j), ycenter+b*Math.sin(j)*-1);
             }
             for (var k = 0.5*Math.PI; k >= 0; k -= stepiner)
             {
                 this.Canvas.lineTo(xcenter+ainer*Math.cos(k), ycenter + biner*Math.sin(j)*-1);
             }
             for (var l = 2*Math.PI; l >= 1.5*Math.PI; l -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer*Math.cos(l), ycenter + biner*Math.sin(l)*-1);
             }
             this.Canvas.closePath();
        }
         else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第二象限
         {
             var a = aryPoint[0].X - aryPoint[1].X;
             var b = aryPoint[0].Y - aryPoint[1].Y;
             var step = (a > b) ? 1/a:1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
             var xcenter = aryPoint[1].X;
             var ycenter = aryPoint[0].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 0; i <= Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = Math.PI; j >= 0; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第三象限
         {
             var a = aryPoint[0].X - aryPoint[1].X;
             var b = aryPoint[1].Y - aryPoint[0].Y;
             var step = (a > b) ? 1/a:1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[0].X;
             var ycenter = aryPoint[1].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = 0.5*Math.PI; i <= 1.5*Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter + a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = 1.5*Math.PI; j >= 0.5*Math.PI; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         else if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第四象限
         {
             var a = aryPoint[1].X - aryPoint[0].X;
             var b = aryPoint[1].Y - aryPoint[0].Y;
             var step = (a > b) ? 1/a : 1/b;
             var ainer = a * 0.8;
             var biner = b * 0.8;
             var stepiner = (ainer > biner) ? 1/ainer : 1/biner;
             var xcenter = aryPoint[1].X;
             var ycenter = aryPoint[0].Y;
             this.Canvas.beginPath();
             this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
             for (var i = Math.PI; i <= 2*Math.PI; i += step)
             {
                 this.Canvas.lineTo(xcenter+a*Math.cos(i), ycenter + b*Math.sin(i)*-1);
             }
             for (var j = 2*Math.PI; j >= Math.PI; j -= stepiner)
             {
                 this.Canvas.lineTo(xcenter + ainer*Math.cos(j), ycenter + biner*Math.sin(j)*-1);
             }
             this.Canvas.closePath();
         }
         if (this.Canvas.isPointInPath(x,y))
            return true;
         else
            return false;

    }

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  数据分割
//  [0]=Start起始 [1]=End结束 [2]=FixInterval修正的间隔 [3]=Increase
//
function SplitData()
{
    this.Data=[
        [0.000001,	0.000002,	0.000001,	0.0000001],
        [0.000002,	0.000004,	0.000002,	0.0000002],
        [0.000004,	0.000005,	0.000004,	0.0000001],
        [0.000005,	0.00001,	0.000005,	0.0000005],

        [0.00001,	0.00002,	0.00001,	0.000001],
        [0.00002,	0.00004,	0.00002,	0.000002],
        [0.00004,	0.00005,	0.00004,	0.000001],
        [0.00005,	0.0001,		0.00005,	0.000005],

        [0.0001,		0.0002,		0.0001,	0.00001],
        [0.0002,		0.0004,		0.0002,	0.00002],
        [0.0004,		0.0005,		0.0004,	0.00001],
        [0.0005,		0.001,		0.0005,	0.00005],

        [0.001,		0.002,		0.001,	0.0001],
        [0.002,		0.004,		0.002,	0.0002],
        [0.004,		0.005,		0.004,	0.0001],
        [0.005,		0.01,		0.005,	0.0005],

        [0.01,		0.02,		0.01,	0.001],
        [0.02,		0.04,		0.02,	0.002],
        [0.04,		0.05,		0.04,	0.001],
        [0.05,		0.1,		0.05,	0.005],

        [0.1,		0.2,		0.1,	0.01],
        [0.2,		0.4,		0.2,	0.02],
        [0.4,		0.5,		0.4,	0.01],
        [0.5,		1,			0.5,	0.05],

        [1,		2,		1,	0.05],
        [2,		4,		2,	0.05],
        [4,		5,		4,	0.05],
        [5,		10,		5,	0.05],

        [10,		12,		10,	2],
        [20,		40,		20,	5],
        [40,		50,		40,	2],
        [50,		100,	50,	10],

        [100,		200,		100,	10],
        [200,		400,		200,	20],
        [400,		500,		400,	10],
        [500,		1000,		500,	50],

        [1000,		2000,		1000,	50],
        [2000,		4000,		2000,	50],
        [4000,		5000,		4000,	50],
        [5000,		10000,		5000,	100],

        [10000,		20000,		10000,	1000],
        [20000,		40000,		20000,	2000],
        [40000,		50000,		40000,	1000],
        [50000,		100000,		50000,	5000],

        [100000,		200000,		100000,	10000],
        [200000,		400000,		200000,	20000],
        [400000,		500000,		400000,	10000],
        [500000,		1000000,	500000,	50000],

        [1000000,		2000000,		1000000,	100000],
        [2000000,		4000000,		2000000,	200000],
        [4000000,		5000000,		4000000,	100000],
        [5000000,		10000000,		5000000,	500000],

        [10000000,		20000000,		10000000,	1000000],
        [20000000,		40000000,		20000000,	2000000],
        [40000000,		50000000,		40000000,	1000000],
        [50000000,		100000000,		50000000,	5000000],

        [100000000,		200000000,		100000000,	10000000],
        [200000000,		400000000,		200000000,	20000000],
        [400000000,		500000000,		400000000,	10000000],
        [500000000,		1000000000,		500000000,	50000000],

        [1000000000,		2000000000,		1000000000,	100000000],
        [2000000000,		4000000000,		2000000000,	200000000],
        [4000000000,		5000000000,		4000000000,	100000000],
        [5000000000,		10000000000,	5000000000,	500000000],
    ];

    this.Find=function(interval)
    {
        for(var i in this.Data)
        {
            var item =this.Data[i];
            if (interval>item[0] && interval<=item[1])
            {
                var result={};
                result.FixInterval=item[2];
                result.Increase=item[3];
                return result;
            }
        }

        return null;
    }
}

function PriceSplitData()
{
    this.newMethod=SplitData;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Data=[
        [0.000001,	0.000002,	0.000001,	0.0000001],
        [0.000002,	0.000004,	0.000002,	0.0000002],
        [0.000004,	0.000005,	0.000004,	0.0000001],
        [0.000005,	0.00001,	0.000005,	0.0000005],

        [0.00001,	0.00002,	0.00001,	0.000001],
        [0.00002,	0.00004,	0.00002,	0.000002],
        [0.00004,	0.00005,	0.00004,	0.000001],
        [0.00005,	0.0001,		0.00005,	0.000005],

        [0.0001,		0.0002,		0.0001,	0.00001],
        [0.0002,		0.0004,		0.0002,	0.00002],
        [0.0004,		0.0005,		0.0004,	0.00001],
        [0.0005,		0.001,		0.0005,	0.00005],

        [0.001,		0.002,		0.001,	0.0001],
        [0.002,		0.004,		0.002,	0.0002],
        [0.004,		0.005,		0.004,	0.0001],
        [0.005,		0.01,		0.005,	0.0005],

        [0.01,		0.02,		0.01,	0.001],
        [0.02,		0.04,		0.02,	0.002],
        [0.04,		0.05,		0.04,	0.001],
        [0.05,		0.1,		0.05,	0.005],

        [0.1,		0.2,		0.1,	0.01],
        [0.2,		0.4,		0.2,	0.02],
        [0.4,		0.5,		0.2,	0.01],
        [0.5,		0.8,		0.2,	0.05],
        [0.8,		1,			0.5,	0.05],

        [1,		2,		1,	0.05],
        [2,		4,		2,	0.05],
        [4,		5,		4,	0.05],
        [5,		10,		5,	0.05],

        [10,		12,		10,	2],
        [20,		40,		20,	5],
        [40,		50,		40,	2],
        [50,		100,	50,	10],

        [100,		200,		100,	10],
        [200,		400,		200,	20],
        [400,		500,		400,	10],
        [500,		1000,		500,	50],

        [1000,		2000,		1000,	50],
        [2000,		4000,		2000,	50],
        [4000,		5000,		4000,	50],
        [5000,		10000,		5000,	100],

        [10000,		20000,		10000,	1000],
        [20000,		40000,		20000,	2000],
        [40000,		50000,		40000,	1000],
        [50000,		100000,		50000,	5000],

        [100000,		200000,		100000,	10000],
        [200000,		400000,		200000,	20000],
        [400000,		500000,		400000,	10000],
        [500000,		1000000,	500000,	50000],

        [1000000,		2000000,		1000000,	100000],
        [2000000,		4000000,		2000000,	200000],
        [4000000,		5000000,		4000000,	100000],
        [5000000,		10000000,		5000000,	500000],

        [10000000,		20000000,		10000000,	1000000],
        [20000000,		40000000,		20000000,	2000000],
        [40000000,		50000000,		40000000,	1000000],
        [50000000,		100000000,		50000000,	5000000],

        [100000000,		200000000,		100000000,	10000000],
        [200000000,		400000000,		200000000,	20000000],
        [400000000,		500000000,		400000000,	10000000],
        [500000000,		1000000000,		500000000,	50000000],

        [1000000000,		2000000000,		1000000000,	100000000],
        [2000000000,		4000000000,		2000000000,	200000000],
        [4000000000,		5000000000,		4000000000,	100000000],
        [5000000000,		10000000000,	5000000000,	500000000],
    ];
}

/////////////////////////////////////////////////////////////////////////////
//   全局配置颜色
//
//
function JSChartResource()
{
    this.TooltipBGColor="rgb(255, 255, 255)"; //背景色
    this.TooltipAlpha=0.92;                  //透明度

    this.SelectRectBGColor="rgba(1,130,212,0.06)"; //背景色
 //   this.SelectRectAlpha=0.06;                  //透明度

    this.UpBarColor="rgb(238,21,21)";
    this.DownBarColor="rgb(25,158,0)";
    this.UnchagneBarColor="rgb(0,0,0)";

    this.Minute={};
    this.Minute.VolBarColor="rgb(238,127,9)";
    this.Minute.PriceColor="rgb(50,171,205)";
    this.Minute.AvPriceColor="rgb(238,127,9)";

    this.DefaultTextColor="rgb(43,54,69)";
    this.DefaultTextFont='14px 微软雅黑';

    this.DynamicTitleFont ='12px 微软雅黑'; //指标动态标题字体


    this.UpTextColor="rgb(238,21,21)";
    this.DownTextColor="rgb(25,158,0)";
    this.UnchagneTextColor="rgb(0,0,0)";

    this.FrameBorderPen="rgb(225,236,242)";
    this.FrameSplitPen="rgb(225,236,242)";          //分割线
    this.FrameSplitTextColor="rgb(51,51,51)";     //刻度文字颜色
    this.FrameSplitTextFont="12px 微软雅黑";        //坐标刻度文字字体
    //this.FrameSplitTextFont = "14px PingFang-SC-Bold";//坐标刻度文字字体
    this.FrameTitleBGColor="rgb(246,251,253)";      //标题栏背景色

    this.CorssCursorBGColor="rgb(43,54,69)";            //十字光标背景
    this.CorssCursorTextColor="rgb(255,255,255)";
    this.CorssCursorTextFont="14px 微软雅黑";
    this.CorssCursorPenColor="rgb(130,130,130)";           //十字光标线段颜色

    this.Domain="https://opensource.zealink.com";               //API域名
    this.CacheDomain="https://opensourcecache.zealink.com";     //缓存域名

    this.KLine={
            MaxMin: {Font:'12px 微软雅黑',Color:'rgb(111,111,111)'},   //K线最大最小值显示
            Info:  //信息地雷
            {
                Investor:
                {
                    ApiUrl:'https://opensource.zealink.com/API/NewsInteract', //互动易
                    Icon:'https://opensourcecache.zealink.com/cache/test/investor.png',
                },
                Announcement:                                           //公告
                {
                    ApiUrl:'https://opensource.zealink.com/API/ReportList',
                    Icon:'https://opensourcecache.zealink.com/cache/test/announcement.png',
                    IconQuarter:'https://opensourcecache.zealink.com/cache/test/announcement2.png',  //季报
                },
                Pforecast:  //业绩预告
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/pforecast.png',
                },
                Research:   //调研
                {
                    ApiUrl:'https://opensource.zealink.com/API/InvestorRelationsList',
                    Icon:'https://opensourcecache.zealink.com/cache/test/research.png',
                },
                BlockTrading:   //大宗交易
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/blocktrading.png',
                },
                TradeDetail:    //龙虎榜
                {
                    ApiUrl:'https://opensource.zealink.com/API/StockHistoryDay',
                    Icon:'https://opensourcecache.zealink.com/cache/test/tradedetail.png',
                }

            }
        };

    this.Index={};
    //指标线段颜色
    this.Index.LineColor=
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

    ];

    //历史数据api
    this.Index.StockHistoryDayApiUrl="https://opensource.zealink.com/API/StockHistoryDay";
    //市场多空
    this.Index.MarketLongShortApiUrl="https://opensource.zealink.com/API/FactorTiming";
    //市场关注度
    this.Index.MarketAttentionApiUrl="https://opensource.zealink.com/API/MarketAttention";
    //行业,指数热度
    this.Index.MarketHeatApiUrl="https://opensource.zealink.com/API/MarketHeat"
    //自定义指数热度
    this.Index.CustomIndexHeatApiUrl="https://opensource.zealink.com/API/QuadrantCalculate";

    //指标不支持信息
    this.Index.NotSupport={Font:"14px 微软雅黑", TextColor:"rgb(52,52,52)"};

    //画图工具
    this.DrawPicture={};
    this.DrawPicture.LineColor=
    [
        "rgb(30,144,255)",
    ];

    this.DrawPicture.PointColor=
    [
        "rgb(105,105,105)",
    ];



}

var g_JSChartResource=new JSChartResource();



/*
    指标列表 指标信息都在这里,不够后面再加字段
*/
function JSIndexMap()
{

}

JSIndexMap.Get=function(id)
{
    var indexMap=new Map(
    [
        //公司自己的指标
        ["市场多空",    {IsMainIndex:false,  Create:function(){ return new MarketLongShortIndex()}  }],
        ["市场择时",    {IsMainIndex:false,  Create:function(){ return new MarketTimingIndex()}  }],
        ["融资占比",    {IsMainIndex:false,  Create:function(){ return new MarginRateIndex()}  }],
        ["市场关注度",  {IsMainIndex:false,  Create:function(){ return new MarketAttentionIndex()}  }],
        ["指数热度",    {IsMainIndex:false,  Create:function(){ return new MarketHeatIndex()}  }],
        ["自定义指数热度", { IsMainIndex: false, Create: function () { return new CustonIndexHeatIndex() }, Name: '自定义指数热度' }],
        ["财务粉饰", { IsMainIndex: false, Create: function () { return new BenfordIndex() } }],

        //能图指标
        ["能图-趋势",       {IsMainIndex:false,  Create:function(){ return new LighterIndex1()},   Name:'大盘/个股趋势'  }],
        ["能图-位置研判",   {IsMainIndex:false,  Create:function(){ return new LighterIndex2()},   Name:'位置研判'  }],
        ["能图-点位研判",   {IsMainIndex:false,  Create:function(){ return new LighterIndex3()},   Name:'点位研判'  }],
        ["能图-资金分析",   {IsMainIndex:false,  Create:function(){ return new LighterIndex4()},   Name:'资金分析'  }],
        ["能图-市场关注度", { IsMainIndex: false, Create: function () { return new LighterIndex5() }, Name:'市场关注度' }]
    ]
    );

    return indexMap.get(id);
}

/////////////////////////////////////////////////////////////////////////////////////////////
//  K线图 控件
//  this.ChartPaint[0] K线画法 这个不要修改
//
//
function KLineChartContainer(uielement)
{
    var _self =this;
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'KLineChartContainer';
    this.WindowIndex=new Array();
    this.Symbol;
    this.Name;
    this.Period=0;                      //周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟
    this.Right=0;                       //复权 0 不复权 1 前复权 2 后复权
    this.SourceData;                    //原始的历史数据
    this.MaxReqeustDataCount=3000;      //数据个数
    this.MaxRequestMinuteDayCount=5;    //分钟数据请求的天数
    this.PageSize=200;                  //每页数据个数
    this.SplashTitle ='下载历史数据';

    //this.KLineApiUrl="http://opensource.zealink.com/API/KLine2";                    //历史K线api地址
    this.KLineApiUrl = g_JSChartResource.Domain+"/API/KLine2";                        //历史K线api地址
    this.MinuteKLineApiUrl = g_JSChartResource.Domain+'/API/KLine3';                  //历史分钟数据
    this.RealtimeApiUrl = g_JSChartResource.Domain+"/API/Stock";                      //实时行情api地址
    this.KLineMatchUrl = g_JSChartResource.Domain+"/API/KLineMatch";                  //形态匹配

    this.MinuteDialog;  //双击历史K线 弹出分钟走势图

    //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.SplashTitle;

        //创建框架容器
        this.Frame=new HQTradeFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;
            this.Frame.SubFrame[i].Frame.TitlePaint = titlePaint;

            this.TitlePaint.push(titlePaint);
        }
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new KLineFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            frame.Identify=i;                   //窗口序号

            frame.HorizontalMax=20;
            frame.HorizontalMin=10;

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitKLineX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;

            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;

            for(var j=frame.HorizontalMin;j<=frame.HorizontalMax;j+=1)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=j;
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=j.toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }

    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        var kline=new ChartKLine();
        kline.Canvas=this.Canvas;
        kline.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        kline.ChartFrame=this.Frame.SubFrame[0].Frame;
        kline.Name="Main-KLine";

        this.ChartPaint[0]=kline;

        this.TitlePaint[0]=new DynamicKLineTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;

        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;

    }

    //绑定主图K线数据
    this.BindMainData=function(hisData,showCount)
    {
        this.ChartPaint[0].Data=hisData;
        for(var i in this.Frame.SubFrame)
        {
            var item =this.Frame.SubFrame[i].Frame;
            item.XPointCount=showCount+5;
            item.Data=this.ChartPaint[0].Data;
        }

        this.TitlePaint[0].Data=this.ChartPaint[0].Data;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=this.Name;

        this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount;
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=dataOffset;
    }

    //创建指定窗口指标
    this.CreateWindowIndex=function(windowIndex)
    {
        this.WindowIndex[windowIndex].Create(this,windowIndex);
    }

    this.BindIndexData=function(windowIndex,hisData)
    {
        if (!this.WindowIndex[windowIndex]) return;
        if (typeof(this.WindowIndex[windowIndex].RequestData)=="function")  //数据需要另外下载的.
        {
            this.WindowIndex[windowIndex].RequestData(this,windowIndex,hisData);
            return;
        }
        if (typeof(this.WindowIndex[windowIndex].ExecuteScript)=='function')    //脚本指标
        {
            this.WindowIndex[windowIndex].ExecuteScript(this,windowIndex,hisData);
            return;
        }

        this.WindowIndex[windowIndex].BindData(this,windowIndex,hisData);
    }

    //获取子窗口的所有画法
    this.GetChartPaint=function(windowIndex)
    {
        var paint=new Array();
        for(var i in this.ChartPaint)
        {
            if (i==0) continue; //第1个K线数据除外

            var item=this.ChartPaint[i];
            if (item.ChartFrame==this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    this.RequestHistoryData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        wx.request({
            url: this.KLineApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol"
                ],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxReqeustDataCount
            },
            method: 'POST',
            dataType: 'json',
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistroyData(data);
            }
        });
    }

    this.RecvHistroyData=function(recvData)
    {
        var data=recvData.data;
        var aryDayData = KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=0;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=this.Right;
        bindData.Period=this.Period;
        bindData.DataType=0;

        if (bindData.Right>0)    //复权
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0 && bindData.Period<=3)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }

        //请求叠加数据 (主数据下载完再下载))
        this.RequestOverlayHistoryData();

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistroyData', this);
    }

    this.ReqeustHistoryMinuteData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        wx.request({
            url: this.MinuteKLineApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol"
                ],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxRequestMinuteDayCount
            },
            method: 'POST',
            dataType: "json",
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteHistroyData(data);
            }
        });
    }


    this.RecvMinuteHistroyData = function (recvData)
    {
        var data = recvData.data;
        var aryDayData=KLineChartContainer.JsonDataToMinuteHistoryData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=1;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=this.Right;
        bindData.Period=this.Period;
        bindData.DataType=1; 

        if (bindData.Period>=5)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }

        this.OverlayChartPaint[0].Data = null; //分钟数据不支持叠加 清空

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvMinuteHistroyData', this);
    }

    //请求实时行情数据
    this.ReqeustRealtimeData=function()
    {
        var self=this;

        $.ajax({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "time"
                ],
                "symbol": [self.Symbol],
                "start": -1
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                self.RecvRealtimeData(data);
            }
        });
    }

    this.RecvRealtimeData=function(data)
    {
        var realtimeData=KLineChartContainer.JsonDataToRealtimeData(data);
        if (this.Symbol==data.symbol)
        {
            if (this.SourceData.Data[this.SourceData.Data.length-1].Date==realtimeData.Date)    //实时行情数据更新
            {
                var item =this.SourceData.Data[this.SourceData.Data.length-1];
                item.Close=realtimeData.Close;
                item.High=realtimeData.High;
                item.Low=realtimeData.Low;
                item.Vol=realtimeData.Vol;
                item.Amount=realtimeData.Amount;
            }
        }
    }

    //周期切换
    this.ChangePeriod=function(period)
    {
        if (this.Period==period) return;

        var isDataTypeChange=false;
        switch(period)
        {
            case 0:     //日线
            case 1:     //周
            case 2:     //月
            case 3:     //年
                if (this.SourceData.DataType!=0) isDataTypeChange=true;
                break;
            case 4:     //1分钟
            case 5:     //5分钟
            case 6:     //15分钟
            case 7:     //30分钟
            case 8:     //60分钟
                if (this.SourceData.DataType!=1) isDataTypeChange=true;
                break;
        }
        
        this.Period=period;
        if (isDataTypeChange==false)
        {
            this.Update();
            return;
        }

        if (this.Period<=3)
        {
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else 
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }  
    }

    //复权切换
    this.ChangeRight=function(right)
    {
        if (IsIndexSymbol(this.Symbol)) return; //指数没有复权

        if (right<0 || right>2) return;

        if (this.Right==right) return;

        this.Right=right;

        this.Update();
    }

    //删除某一个窗口的指标
    this.DeleteIndexPaint = function (windowIndex) 
    {
        let paint = new Array();  //踢出当前窗口的指标画法
        for (let i in this.ChartPaint) 
        {
            let item = this.ChartPaint[i];

            if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = null;
        this.Frame.SubFrame[windowIndex].Frame.IsLocked = false;          //解除上锁

        this.ChartPaint = paint;

        //清空东条标题
        var titleIndex = windowIndex + 1;
        this.TitlePaint[titleIndex].Data = [];
        this.TitlePaint[titleIndex].Title = null;
    }

    //切换成 脚本指标
    this.ChangeScriptIndex=function(windowIndex,indexData)
    {
        this.DeleteIndexPaint(windowIndex);
        this.WindowIndex[windowIndex] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行

        var bindData=this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex,bindData);   //执行脚本

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }


    //切换指标 指定切换窗口指标
    this.ChangeIndex=function(windowIndex,indexName)
    {
        var indexItem=JSIndexMap.Get(indexName);
        if (!indexItem) 
        {
            //查找系统指标
            let scriptData = new JSCommonIndexScript.JSIndexScript();
            let indexInfo = scriptData.Get(indexName);
            if (!indexInfo) return;
            if (indexInfo.IsMainIndex) 
            {
                windowIndex = 0;  //主图指标只能在主图显示
            }
            else 
            {
                if (windowIndex == 0) windowIndex = 1;  //幅图指标,不能再主图显示
            }
            let indexData = { Name: indexInfo.Name, Script: indexInfo.Script, Args: indexInfo.Args };
            return this.ChangeScriptIndex(windowIndex, indexData);
        }

        //主图指标
        if (indexItem.IsMainIndex)
        {
            if (windowIndex>0)  windowIndex=0;  //主图指标只能在主图显示
        }
        else
        {
            if (windowIndex==0) windowIndex=1;  //幅图指标,不能再主图显示
        }

        var paint=new Array();  //踢出当前窗口的指标画法
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];

            if (i==0 || item.ChartFrame!=this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin=null;

        this.ChartPaint=paint;

        //清空东条标题
        var titleIndex=windowIndex+1;
        this.TitlePaint[titleIndex].Data=[];
        this.TitlePaint[titleIndex].Title=null;

        this.WindowIndex[windowIndex]=indexItem.Create();
        this.CreateWindowIndex(windowIndex);

        var bindData=this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex,bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //锁|解锁指标 { Index:指标名字,IsLocked:是否要锁上,Callback:回调 }
    this.LockIndex = function (lockData) 
    {
        if (!lockData) return;
        if (!lockData.IndexName) return;

        for (let i in this.WindowIndex) 
        {
            let item = this.WindowIndex[i];
            if (!item) conintue;
            if (item.Name == lockData.IndexName) 
            {
                item.SetLock(lockData);
                this.Update();
                break;
            }
        }
    }

    this.TryClickLock = function (x, y) 
    {
        for (let i in this.Frame.SubFrame) 
        {
            var item = this.Frame.SubFrame[i];
            if (!item.Frame.IsLocked) continue;
            if (!item.Frame.LockPaint) continue;

            var tooltip = new TooltipData();
            if (!item.Frame.LockPaint.GetTooltipData(x, y, tooltip)) continue;

            tooltip.HQChart = this;
            if (tooltip.Data.Callback) tooltip.Data.Callback(tooltip);
            return true;
        }

        return false;
    }

    this.Update=function()
    {
        if (!this.SourceData) return;

        var bindData=new ChartData();
        bindData.Data=this.SourceData.Data;
        bindData.Period=this.Period;
        bindData.Right=this.Right;

        if (bindData.Right>0 && bindData.Period<=3)    //复权(日线数据才复权)
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0 && bindData.Period!=4)   //周期数据 (0= 日线,4=1分钟线 不需要处理))   //周期数据
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }

        //叠加数据周期调整
        if (this.OverlayChartPaint[0].SourceData)
        {
            if (this.Period >= 4)  //分钟不支持 清空掉
            {
                this.OverlayChartPaint[0].Data = null;
            }
            else
            {
                var bindData=new ChartData();
                bindData.Data=this.OverlayChartPaint[0].SourceData.Data;
                bindData.Period=this.Period;
                bindData.Right=this.Right;

                if (bindData.Right>0 && !IsIndexSymbol(this.OverlayChartPaint[0].Symbol))       //复权数据
                {
                    var rightData=bindData.GetRightDate(bindData.Right);
                    bindData.Data=rightData;
                }

                var aryOverlayData=this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
                bindData.Data=aryOverlayData;

                if (bindData.Period>0)   //周期数据
                {
                    var periodData=bindData.GetPeriodData(bindData.Period);
                    bindData.Data=periodData;
                }

                this.OverlayChartPaint[0].Data=bindData;
            }
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //切换股票代码
    this.ChangeSymbol=function(symbol)
    {
        this.Symbol=symbol;
        if (IsIndexSymbol(symbol)) this.Right=0;    //指数没有复权

        if (this.Period<=3)
        {
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else 
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }  
    }

    this.ReqeustKLineInfoData=function()
    {
        if (this.ChartPaint.length>0)
        {
            var klinePaint=this.ChartPaint[0];
            klinePaint.InfoData=new Map();
        }

        //信息地雷信息
        for(var i in this.ChartInfo)
        {
            this.ChartInfo[i].RequestData(this);
        }
    }

    //设置K线信息地雷
    this.SetKLineInfo=function(aryInfo,bUpdate)
    {
        for(var i in aryInfo)
        {
            var infoItem=JSKLineInfoMap.Get(aryInfo[i]);
            if (!infoItem) continue;
            var item=infoItem.Create();
            item.MaxReqeustDataCount=this.MaxReqeustDataCount;
            this.ChartInfo.push(item);
        }

        if (bUpdate==true) this.ReqeustKLineInfoData();
    }

    //叠加股票
    this.OverlaySymbol=function(symbol)
    {
        if (!this.OverlayChartPaint[0].MainData) return false;

        this.OverlayChartPaint[0].Symbol = symbol;
        if (this.Period <= 3) this.RequestOverlayHistoryData();                  //请求日线数据

        return true;
    }

    this.RequestOverlayHistoryData = function ()
     {
        if (!this.OverlayChartPaint.length) return;

        var symbol = this.OverlayChartPaint[0].Symbol;
        if (!symbol) return;

        var self = this;

        //请求数据
        wx.request({
            url: this.KLineApiUrl,
            data:
                {
                    "field": 
                    [
                        "name",
                        "symbol",
                        "yclose",
                        "open",
                        "price",
                        "high"
                    ],
                    "symbol": symbol,
                    "start": -1,
                    "count": this.MaxReqeustDataCount
                },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) 
            {
                self.RecvOverlayHistoryData(data);
            }
        });

    }

    this.RecvOverlayHistoryData=function(recvData)
    {
        var data=recvData.data; 
        var aryDayData=KLineChartContainer.JsonDataToHistoryData(data);

        //原始叠加数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;

        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Period=this.Period;
        bindData.Right=this.Right;

        if (bindData.Right>0 && !IsIndexSymbol(data.symbol))    //复权数据 ,指数没有复权)
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        var aryOverlayData=this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
        bindData.Data=aryOverlayData;

        if (bindData.Period>0)   //周期数据
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        this.OverlayChartPaint[0].Data=bindData;
        this.OverlayChartPaint[0].SourceData=sourceData;
        this.OverlayChartPaint[0].Title=data.name;
        this.OverlayChartPaint[0].Symbol=data.symbol;

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //取消叠加股票
    this.ClearOverlaySymbol=function()
    {
        this.OverlayChartPaint[0].Symbol=null;
        this.OverlayChartPaint[0].Data=null;
        this.OverlayChartPaint[0].SourceData=null;
        this.OverlayChartPaint[0].TooltipRect=[];

        this.UpdateFrameMaxMin();
        this.Draw();
    }

    //创建画图工具
    this.CreateChartDrawPicture=function(name)
    {
        var drawPicture=null;
        switch(name)
        {
            case "线段":
                drawPicture=new ChartDrawPictureLine();
                break;
            case "射线":
                drawPicture=new ChartDrawPictureHaflLine();
                break;
            case "矩形":
                drawPicture=new ChartDrawPictureRect();
                break;
            case "圆弧线":
                drawPicture=new ChartDrawPictureArc();
                break;

            default:
                return false;
        }

        drawPicture.Canvas=this.Canvas;
        drawPicture.Status=0;
        this.CurrentChartDrawPicture=drawPicture;
        return true;
    }

    this.SetChartDrawPictureFirstPoint=function(x,y)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (!this.Frame.SubFrame || this.Frame.SubFrame.length<=0) return false;

        for(var i in this.Frame.SubFrame)
        {
            var frame=this.Frame.SubFrame[i].Frame;
            var left=frame.ChartBorder.GetLeft();
            var top=frame.ChartBorder.GetTopEx();
            var height=frame.ChartBorder.GetHeight();
            var width=frame.ChartBorder.GetWidth();

            this.Canvas.rect(left,top,width,height);
            if (this.Canvas.isPointInPath(x,y))
            {
                drawPicture.Frame=frame;
                break;
            }
        }

        if (!drawPicture.Frame) return false;

        drawPicture.Point[0]=new Point();
        drawPicture.Point[0].X=x-this.UIElement.getBoundingClientRect().left;
        drawPicture.Point[0].Y=y-this.UIElement.getBoundingClientRect().top;
        drawPicture.Status=1;   //第1个点完成
    }

    this.SetChartDrawPictureSecondPoint=function(x,y)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;

        drawPicture.Point[1]=new Point();
        drawPicture.Point[1].X=x-this.UIElement.getBoundingClientRect().left;
        drawPicture.Point[1].Y=y-this.UIElement.getBoundingClientRect().top;

        drawPicture.Status=2;   //设置第2个点
    }

    //xStep,yStep 移动的偏移量
    this.MoveChartDrawPicture=function(xStep,yStep)
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;

        //console.log("xStep="+xStep+" yStep="+yStep);
        drawPicture.Move(xStep,yStep);

        return true;
    }

    this.FinishChartDrawPicturePoint=function()
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (drawPicture.PointCount!=drawPicture.Point.length) return false;

        drawPicture.Status=10;  //完成
        drawPicture.PointToValue();

        this.ChartDrawPicture.push(drawPicture);
        this.CurrentChartDrawPicture=null;

        return true;
    }

    this.FinishMoveChartDrawPicture=function()
    {
        var drawPicture=this.CurrentChartDrawPicture;
        if (!drawPicture) return false;
        if (drawPicture.PointCount!=drawPicture.Point.length) return false;

        drawPicture.Status=10;  //完成
        drawPicture.PointToValue();

        this.CurrentChartDrawPicture=null;
        return true;
    }

    //清空所有的画线工具
    this.ClearChartDrawPicture=function(drawPicture)
    {
        if (!drawPicture)
        {
            this.ChartDrawPicture=[];
            this.Draw();
        }
        else
        {
            for(var i in this.ChartDrawPicture)
            {
                if (this.ChartDrawPicture[i]==drawPicture)
                {
                    this.ChartDrawPicture.splice(i,1);
                    this.Draw();
                }
            }
        }
    }

    //形态匹配
    // scopeData.Plate 板块范围 scopeData.Symbol 股票范围
    this.RequestKLineMatch=function(selectRectData,scopeData,fun)
    {
        var _self =this;

        var aryDate=new Array();
        var aryValue=new Array();

        for(var i=selectRectData.Start;i<selectRectData.End && i<selectRectData.Data.Data.length;++i)
        {
            aryDate.push(selectRectData.Data.Data[i].Date);
            aryValue.push(selectRectData.Data.Data[i].Close);
        }

        //请求数据
        $.ajax({
            url: this.KLineMatchUrl,
            data:
            {
                "userid": "guest",
                "plate": scopeData.Plate,
                "period": this.Period,
                "right": this.Right,
                "dayregion": 365,
                "minsimilar": scopeData.Minsimilar,
                "sampledate":aryDate,
                "samplevalue":aryValue
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (data)
            {
                if($.type(fun) == "function")
                {
                   // console.log(data);
                    fun(data);
                }
            }
        });
    }

    //更新信息地雷
    this.UpdataChartInfo=function()
    {
        //TODO: 根据K线数据日期来做map, 不在K线上的合并到下一个k线日期里面
        var mapInfoData=new Map();
        for(var i in this.ChartInfo)
        {
            var infoData=this.ChartInfo[i].Data;
            for(var j in infoData)
            {
                var item=infoData[j];
                if (mapInfoData.has(item.Date.toString()))
                {
                    mapInfoData.get(item.Date.toString()).Data.push(item);
                }
                else
                {

                    mapInfoData.set(item.Date.toString(),{Data:new Array(item)});
                }
            }
        }

        var klinePaint=this.ChartPaint[0];
        klinePaint.InfoData=mapInfoData;
    }

    //更新窗口指标
    this.UpdateWindowIndex=function(index)
    {
        var bindData=new ChartData();
        bindData.Data=this.SourceData.Data;
        bindData.Period=this.Period;
        bindData.Right=this.Right;

        if (bindData.Right>0)    //复权
        {
            var rightData=bindData.GetRightDate(bindData.Right);
            bindData.Data=rightData;
        }

        if (bindData.Period>0)   //周期数据
        {
            var periodData=bindData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        this.WindowIndex[index].BindData(this,index,bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //修改参数指标
    this.ChangeWindowIndexParam=function(index)
    {
        this.WindowIndex[index].Index[0].Param+=1;
        this.WindowIndex[index].Index[1].Param+=1;

        this.UpdateWindowIndex(index);
    }


    this.OnDoubleClick=function(x,y,e)
    {
        if (!this.MinuteDialog) return;

        var tooltip=new TooltipData();
        for(var i in this.ChartPaint)
        {
            var item=this.ChartPaint[i];
            if (item.GetTooltipData(x,y,tooltip))
            {
                break;
            }
        }

        if (!tooltip.Data) return;

        e.data={Chart:this,Tooltip:tooltip};

        this.MinuteDialog.DoModal(e);
    }

    this.GetMaxPageSize=function()
    {
        let width = this.Frame.ChartBorder.GetWidth();
        let barWidth = (ZOOM_SEED[ZOOM_SEED.length - 1][0] + ZOOM_SEED[ZOOM_SEED.length - 1][1]);
        return parseInt(width / barWidth)-8;
    }

}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToHistoryData=function(data)
{
    var list = data.data;
    var aryDayData=new Array();
    if (!list) return aryDayData;

    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7;
    for (var i = 0; i < list.length; ++i)
    {
        var item = new HistoryData();

        item.Date = list[i][date];
        item.Open = list[i][open];
        item.YClose = list[i][yclose];
        item.Close = list[i][close];
        item.High = list[i][high];
        item.Low = list[i][low];
        item.Vol = list[i][vol];    //原始单位股
        item.Amount = list[i][amount];

        if (isNaN(item.Open) || item.Open<=0) continue; //停牌的数据剔除

        aryDayData.push(item);
    }

    return aryDayData;
}

KLineChartContainer.JsonDataToRealtimeData=function(data)
{
    var item=new HistoryData();
    item.Date=data.stock[0].date;
    item.Open=data.stock[0].open;
    item.YClose=data.stock[0].yclose;
    item.High=data.stock[0].high;
    item.Low=data.stock[0].low;
    item.Vol=data.stock[0].vol/100; //原始单位股
    item.Amount=data.stock[0].amount;
}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToMinuteHistoryData=function(data)
{
    var list = data.data;
    var aryDayData=new Array();
    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, time = 8;
    for (var i = 0; i < list.length; ++i)
    {
        var item = new HistoryData();

        item.Date = list[i][date];
        item.Open = list[i][open];
        item.YClose = list[i][yclose];
        item.Close = list[i][close];
        item.High = list[i][high];
        item.Low = list[i][low];
        item.Vol = list[i][vol];    //原始单位股
        item.Amount = list[i][amount];
        item.Time=list[i][time];

        aryDayData.push(item);
    }

    // 无效数据处理
    for (var i = 0; i < aryDayData.length; ++i) {
      var minData = aryDayData[i];
      if (minData == null) coninue;
      if (isNaN(minData.Open) || minData.Open <= 0 || isNaN(minData.High) || minData.High <= 0 || isNaN(minData.Low) || minData.Low <= 0
        || isNaN(minData.Close) || minData.Close <= 0 || isNaN(minData.YClose) || minData.YClose <= 0) {
        if (i == 0) {
          if (minData.YClose > 0) {
            minData.Open = minData.YClose;
            minData.High = minData.YClose;
            minData.Low = minData.YClose;
            minData.Close = minData.YClose;
          }
        }
        else // 用前一个有效数据填充
        {
          for (var j = i - 1; j >= 0; --j) {
            var minData2 = aryDayData[j];
            if (minData2 == null) coninue;
            if (minData2.Open > 0 && minData2.High > 0 && minData2.Low > 0 && minData2.Close > 0) {
              if (minData.YClose <= 0) minData.YClose = minData2.Close;
              minData.Open = minData2.Open;
              minData.High = minData2.High;
              minData.Low = minData2.Low;
              minData.Close = minData2.Close;
              break;
            }
          }
        }
      }
    }

    return aryDayData;
}


///////////////////////////////////////////////////////////////////////////////////////////
//  走势图
//
function MinuteChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'MinuteChartContainer';
    this.WindowIndex=new Array();
    this.Symbol;
    this.Name;
    this.SourceData;                          //原始的历史数据
    this.IsAutoUpate=false;                   //是否自动更新行情数据
    this.TradeDate=0;                         //行情交易日期
    this.SplashTitle = '下载分钟数据';
    this.MinuteApiUrl=g_JSChartResource.Domain+"/API/Stock";

    //判断是单个手指
    function IsPhoneDragging(e) 
    {
        var changed = e.changedTouches.length;
        var touching = e.touches.length;
        return changed == 1 && touching == 1;
    }

    //是否是2个手指操所
    function IsPhonePinching(e) 
    {
        var changed = e.changedTouches.length;
        var touching = e.touches.length;
        return (changed == 1 || changed == 2) && touching == 2;
    }

    function GetToucheData(e, isForceLandscape) 
    {
        var touches = new Array();
        for (var i = 0; i < e.touches.length; ++i) 
        {
            var item = e.touches[i];
            if (isForceLandscape) 
            {
                touches.push( { clientX: item.y, clientY: item.x, pageX: item.y, pageY: item.x });
            }
            else 
            {
                touches.push( { clientX: item.x, clientY: item.y, pageX: item.x, pageY: item.y });
            }
        }
        return touches;
    }

    //手机拖拽
    this.ontouchstart = function (e) 
    {
        var jsChart = this;
        if (jsChart.DragMode == 0) return;

        if (IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock) 
            {
                var touches = GetToucheData(e, jsChart.IsForceLandscape);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            if (this.TouchTimer != null) clearTimeout(this.TouchTimer);
            
            var drag = 
            { 
                "Click": {},
                "LastMove": {},  //最后移动的位置
            };

            var touches = GetToucheData(e, jsChart.IsForceLandscape);

            drag.Click.X = touches[0].clientX;
            drag.Click.Y = touches[0].clientY;
            drag.LastMove.X = touches[0].clientX;
            drag.LastMove.Y = touches[0].clientY;

            if (this.ChartCorssCursor.IsShow === true)    //移动十字光标
            {
                var x = drag.Click.X;
                var y = drag.Click.Y;
                if (jsChart.IsForceLandscape) y = jsChart.UIElement.Height - drag.Click.Y;    //强制横屏Y计算
                jsChart.OnMouseMove(x, y, e);
            }
        }
    }

    this.ontouchmove = function (e) 
    {
        var jsChart = this;
        var touches = GetToucheData(e, jsChart.IsForceLandscape);
        if (this.ChartCorssCursor.IsShow === true && IsPhoneDragging(e)) 
        {
            var drag = jsChart.MouseDrag;
            if (drag == null) 
            {
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                jsChart.OnMouseMove(x, y, e);
            }
        }
    }

    //创建
    //windowCount 窗口个数
    this.Create=function(windowCount)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new ChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.StringFormatX=new HQMinuteTimeStringFormat();
        this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.SplashTitle;

        //创建框架容器
        this.Frame=new HQTradeFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=25;
        this.Frame.ChartBorder.Left=50;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for(var i in this.Frame.SubFrame)
        {
            var titlePaint=new DynamicChartTitlePainting();
            titlePaint.Frame=this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas=this.Canvas;

            this.TitlePaint.push(titlePaint);
        }
    }

    //创建子窗口
    this.CreateChildWindow=function(windowCount)
    {
        for(var i=0;i<windowCount;++i)
        {
            var border=new ChartBorder();
            border.UIElement=this.UIElement;

            var frame=new MinuteFrame();
            frame.Canvas=this.Canvas;
            frame.ChartBorder=border;
            if (i<2) frame.ChartBorder.TitleHeight=0;
            frame.XPointCount=243;

            var DEFAULT_HORIZONTAL=[9,8,7,6,5,4,3,2,1];
            frame.HorizontalMax=DEFAULT_HORIZONTAL[0];
            frame.HorizontalMin=DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length-1];

            if (i==0)
            {
                frame.YSplitOperator=new FrameSplitMinutePriceY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('price');
            }
            else
            {
                frame.YSplitOperator=new FrameSplitY();
                frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
            }

            frame.YSplitOperator.Frame=frame;
            frame.YSplitOperator.ChartBorder=border;
            frame.XSplitOperator=new FrameSplitMinuteX();
            frame.XSplitOperator.Frame=frame;
            frame.XSplitOperator.ChartBorder=border;
            if (i!=windowCount-1) frame.XSplitOperator.ShowText=false;
            frame.XSplitOperator.Operator();

            for(var j in DEFAULT_HORIZONTAL)
            {
                frame.HorizontalInfo[j]= new CoordinateInfo();
                frame.HorizontalInfo[j].Value=DEFAULT_HORIZONTAL[j];
                if (i==0 && j==frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1]=DEFAULT_HORIZONTAL[j].toString();
                frame.HorizontalInfo[j].Font="14px 微软雅黑";
            }

            var subFrame=new SubFrameItem();
            subFrame.Frame=frame;
            if (i==0)
                subFrame.Height=20;
            else
                subFrame.Height=10;

            this.Frame.SubFrame[i]=subFrame;
        }
    }

    //删除某一个窗口的指标
    this.DeleteIndexPaint = function (windowIndex) 
    {
        let paint = new Array();         
        for (let i in this.ChartPaint)  //踢出当前窗口的指标画法
        {
            let item = this.ChartPaint[i];

            if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = null;
        this.Frame.SubFrame[windowIndex].Frame.IsLocked = false;          //解除上锁

        this.ChartPaint = paint;

        //清空东条标题
        var titleIndex = windowIndex + 1;
        this.TitlePaint[titleIndex].Data = [];
        this.TitlePaint[titleIndex].Title = null;
    }

    this.CreateStockInfo=function()
    {
        this.ExtendChartPaint[0]=new StockInfoExtendChartPaint();
        this.ExtendChartPaint[0].Canvas=this.Canvas;
        this.ExtendChartPaint[0].ChartBorder=this.Frame.ChartBorder;
        this.ExtendChartPaint[0].ChartFrame=this.Frame;

        this.Frame.ChartBorder.Right=300;
    }

    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        //分钟线
        var minuteLine=new ChartMinutePriceLine();
        minuteLine.Canvas=this.Canvas;
        minuteLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        minuteLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        minuteLine.Name="Minute-Line";
        minuteLine.Color=g_JSChartResource.Minute.PriceColor;

        this.ChartPaint[0]=minuteLine;

        //分钟线均线
        var averageLine=new ChartLine();
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        averageLine.Name="Minute-Average-Line";
        averageLine.Color=g_JSChartResource.Minute.AvPriceColor;
        this.ChartPaint[1]=averageLine;

        var averageLine=new ChartMinuteVolumBar();
        averageLine.Color=g_JSChartResource.Minute.VolBarColor;
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[1].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[1].Frame;
        averageLine.Name="Minute-Vol-Bar";
        this.ChartPaint[2]=averageLine;


        this.TitlePaint[0]=new DynamicMinuteTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;

        /*
        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;
        */
    }

    //切换成 脚本指标
    this.ChangeScriptIndex = function (windowIndex, indexData) 
    {
        this.DeleteIndexPaint(windowIndex);
        this.WindowIndex[windowIndex] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行

        var bindData = this.SourceData;
        this.BindIndexData(windowIndex, bindData);   //执行脚本

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //切换股票代码
    this.ChangeSymbol=function(symbol)
    {
        this.Symbol=symbol;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.RequestData();
    }

    this.TryClickLock = function (x, y) 
    {
        for (let i in this.Frame.SubFrame) 
        {
            var item = this.Frame.SubFrame[i];
            if (!item.Frame.IsLocked) continue;
            if (!item.Frame.LockPaint) continue;

            var tooltip = new TooltipData();
            if (!item.Frame.LockPaint.GetTooltipData(x, y, tooltip)) continue;

            tooltip.HQChart = this;
            if (tooltip.Data.Callback) tooltip.Data.Callback(tooltip);
            return true;
        }

        return false;
    }

    this.RequestData=function()
    {
        this.RequestMinuteData();               //请求数据
    }

    //请求分钟数据
    this.RequestMinuteData=function()
    {
        var self=this;

        wx.request({
            url: this.MinuteApiUrl,
            data:
            {
                "field": [
                    "name",
                    "symbol",
                    "yclose",
                    "open",
                    "price",
                    "high",
                    "low",
                    "vol",
                    "amount",
                    "date",
                    "minute",
                    "time",
                    "minutecount",
                ],
                "symbol": [this.Symbol],
                "start": -1
            },
            method:"post",
            dataType: "json",
            success: function (data)
            {
                self.ChartSplashPaint.IsEnableSplash=false;
                self.RecvMinuteData(data);
            }
        });
    }

    this.RecvMinuteData=function(data)
    {
        var aryMinuteData=MinuteChartContainer.JsonDataToMinuteData(data.data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryMinuteData;

        this.TradeDate=data.data.stock[0].date;

        this.SourceData=sourceData;
        this.Symbol=data.data.stock[0].symbol;
        this.Name=data.data.stock[0].name;

        this.BindMainData(sourceData,data.data.stock[0].yclose);

        if (this.Frame.SubFrame.length>2)
        {
            var bindData=new ChartData();
            bindData.Data=aryMinuteData;
            for(var i=2; i<this.Frame.SubFrame.length; ++i)
            {
                this.BindIndexData(i,bindData);
            }
        }

        for (let i in this.Frame.SubFrame)  //把股票代码设置到X轴刻度类里
        {
            var item = this.Frame.SubFrame[i];
            item.Frame.XSplitOperator.Symbol = this.Symbol;
        }

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        this.AutoUpdata();
    }

    //数据自动更新
    this.AutoUpdata=function()
    {
        var _self = this;

        if (!this.IsAutoUpate) return;

        //9:30 - 15:40 非周6，日 每隔30秒更新一次 this.RequestMinuteData();
        var nowDate= new Date(),
            day = nowDate.getDay(),
            time = nowDate.getHours() * 100 + nowDate.getMinutes();

        if(day == 6 || day== 0) return ;

        if(time>1540) return ;

        if(time <930){
            setTimeout(function(){
                _self.AutoUpdata();
            },30000);
        }else{
            setTimeout(function(){
                _self.RequestMinuteData();
            },30000);
        }
    }

    this.Stop=function()
    {
      this.IsAutoUpate=false;
    }

    this.BindIndexData=function(windowIndex,hisData)
    {
        if (!this.WindowIndex[windowIndex]) return;

        if (typeof (this.WindowIndex[windowIndex].RequestData) == "function")          //数据需要另外下载的.
        {
            this.WindowIndex[windowIndex].RequestData(this, windowIndex, hisData);
            return;
        }
        if (typeof (this.WindowIndex[windowIndex].ExecuteScript) == 'function') 
        {
            this.WindowIndex[windowIndex].ExecuteScript(this, windowIndex, hisData);
            return;
        }

        this.WindowIndex[windowIndex].BindData(this,windowIndex,hisData);
    }

    //绑定分钟数据
    this.BindMainData=function(minuteData,yClose)
    {
        //分钟数据
        var bindData=new ChartData();
        bindData.Data=minuteData.GetClose();
        this.ChartPaint[0].Data=bindData;
        this.ChartPaint[0].YClose=yClose;
        this.ChartPaint[0].NotSupportMessage=null;

        this.Frame.SubFrame[0].Frame.YSplitOperator.YClose=yClose;
        this.Frame.SubFrame[0].Frame.YSplitOperator.Data=bindData;

        //均线
        bindData=new ChartData();
        bindData.Data=minuteData.GetMinuteAvPrice();
        this.ChartPaint[1].Data=bindData;

        this.Frame.SubFrame[0].Frame.YSplitOperator.AverageData=bindData;

        //成交量
        bindData=new ChartData();
        bindData.Data=minuteData.GetVol();
        this.ChartPaint[2].Data=bindData;

        this.TitlePaint[0].Data=this.SourceData;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=this.Name;
        this.TitlePaint[0].YClose=yClose;

        if (this.ExtendChartPaint[0])
        {
            this.ExtendChartPaint[0].Symbol=this.Symbol;
            this.ExtendChartPaint[0].Name=this.Name;
        }

        /*
        this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data=this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData=this.ChartPaint[0].Data;         //K线叠加

        var dataOffset=hisData.Data.length-showCount;
        if (dataOffset<0) dataOffset=0;
        this.ChartPaint[0].Data.DataOffset=dataOffset;

        this.CursorIndex=showCount;
        if (this.CursorIndex+dataOffset>=hisData.Data.length) this.CursorIndex=dataOffset;
        */
    }

    //获取子窗口的所有画法
    this.GetChartPaint=function(windowIndex)
    {
        var paint=new Array();
        for(var i in this.ChartPaint)
        {
            if (i<3) continue; //分钟 均线 成交量 3个线不能改

            var item=this.ChartPaint[i];
            if (item.ChartFrame==this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    //创建指定窗口指标
    this.CreateWindowIndex=function(windowIndex)
    {
        this.WindowIndex[windowIndex].Create(this,windowIndex);
    }
}

//API 返回数据 转化为array[]
MinuteChartContainer.JsonDataToMinuteData=function(data)
{
    var aryMinuteData=new Array();
    for(var i in data.stock[0].minute)
    {
        var jsData=data.stock[0].minute[i];
        var item=new MinuteData();

        item.Close=jsData.price;
        item.Open=jsData.open;
        item.High=jsData.high;
        item.Low=jsData.low;
        item.Vol=jsData.vol/100; //原始单位股
        item.Amount=jsData.amount;
        item.Increate = jsData.increate;
        item.Risefall = jsData.risefall;
        item.AvPrice = jsData.avprice;

        if (i==0)      //第1个数据 写死9：25
        {
            item.DateTime=data.stock[0].date.toString()+" 0925";
            if (item.Close <= 0) //第1分钟 没数据就用开盘价
            {
              item.Close = data.stock[0].open;
              item.High = item.Low = data.stock[0].open;
              item.AvPrice = data.stock[0].open;
              console.log('[MinuteChartContainer::JsonDataToMinuteData] first minute data is empty.', data.stock[0].symbol, jsData);
            }
        }
        else
            item.DateTime=data.stock[0].date.toString()+" "+jsData.time.toString();

        //价格是0的 都用空
        if (item.Open <= 0) item.Open = null;
        if (item.Close <= 0) item.Close = null;
        if (item.AvPrice <= 0) item.AvPrice = null;
        if (item.High <= 0) item.High = null;
        if (item.Low <= 0) item.Low = null;

        aryMinuteData[i]=item;
    }

    return aryMinuteData;
}

/*
    历史分钟走势图
*/
function HistoryMinuteChartContainer(uielement)
{
    this.newMethod=MinuteChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.HistoryMinuteApiUrl="https://opensourcecache.zealink.com/cache/minuteday/day/";


    //创建主图K线画法
    this.CreateMainKLine=function()
    {
        //分钟线
        var minuteLine=new ChartMinutePriceLine();
        minuteLine.Canvas=this.Canvas;
        minuteLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        minuteLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        minuteLine.Name="Minute-Line";
        minuteLine.Color=g_JSChartResource.Minute.PriceColor;

        this.ChartPaint[0]=minuteLine;

        //分钟线均线
        var averageLine=new ChartLine();
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[0].Frame;
        averageLine.Name="Minute-Average-Line";
        averageLine.Color=g_JSChartResource.Minute.AvPriceColor;
        this.ChartPaint[1]=averageLine;

        var averageLine=new ChartMinuteVolumBar();
        averageLine.Color=g_JSChartResource.Minute.VolBarColor;
        averageLine.Canvas=this.Canvas;
        averageLine.ChartBorder=this.Frame.SubFrame[1].Frame.ChartBorder;
        averageLine.ChartFrame=this.Frame.SubFrame[1].Frame;
        averageLine.Name="Minute-Vol-Bar";
        this.ChartPaint[2]=averageLine;


        this.TitlePaint[0]=new DynamicMinuteTitlePainting();
        this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas=this.Canvas;
        this.TitlePaint[0].IsShowDate=true;

        /*
        //主图叠加画法
        var paint=new ChartOverlayKLine();
        paint.Canvas=this.Canvas;
        paint.ChartBorder=this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame=this.Frame.SubFrame[0].Frame;
        paint.Name="Overlay-KLine";
        this.OverlayChartPaint[0]=paint;
        */

    }

    this.RequestData=function()
    {
        var date=new Date();
        var nowDate=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        if (nowDate==this.TradeDate) this.RequestMinuteData();
        else this.RequestHistoryMinuteData();
    }

    //请求分钟数据
    this.RequestHistoryMinuteData=function()
    {
        var _self=this;
        var url=this.HistoryMinuteApiUrl+this.TradeDate.toString()+"/"+this.Symbol+".json";

        $.ajax({
            url: url,
            type:"get",
            dataType: "json",
            async:true,
            success: function (data)
            {
                _self.RecvHistoryMinuteData(data);
            },
            error:function(reqeust)
            {
                _self.RecvHistoryMinuteError(reqeust);
            }
        });
    }

    this.RecvHistoryMinuteError=function(reqeust)
    {
        if (reqeust.status!=404) return;

        var sourceData=new ChartData();
        this.SourceData=sourceData;

        for(var i in this.ChartPaint)
        {
            this.ChartPaint[i].Data=sourceData;
            if (i==0) this.ChartPaint[i].NotSupportMessage='没有权限访问!';
        }

        this.TitlePaint[0].Data=this.SourceData;                    //动态标题
        this.TitlePaint[0].Symbol=this.Symbol;
        this.TitlePaint[0].Name=null;

        this.Draw();
    }

    this.RecvHistoryMinuteData=function(data)
    {
        var aryMinuteData=HistoryMinuteChartContainer.JsonDataToMinuteData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryMinuteData;

        this.TradeDate=data.date;

        this.SourceData=sourceData;
        this.Symbol=data.symbol;
        this.Name=data.name;

        this.BindMainData(sourceData,data.day.yclose);

        if (this.Frame.SubFrame.length>2)
        {
            var bindData=new ChartData();
            bindData.Data=aryMinuteData;
            for(var i=2; i<this.Frame.SubFrame.length; ++i)
            {
                this.BindIndexData(i,bindData);
            }
        }

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        //this.AutoUpdata();
    }

}

//API 返回数据 转化为array[]
HistoryMinuteChartContainer.JsonDataToMinuteData=function(data)
{
    var aryMinuteData=new Array();
    for(var i in data.minute.time)
    {
        var item=new MinuteData();

        if (data.minute.price[i]<=0 && i>0) //当前这一分钟价格为空,使用上一分钟的数据
        {
            item.Close=aryMinuteData[i-1].Close;
            item.Open=aryMinuteData[i-1].Close;
            item.High=item.Close;
            item.Low=item.Close;
            item.Vol=data.minute.vol[i]/100; //原始单位股
            item.Amount=data.minute.amount[i];
            item.DateTime=data.date.toString()+" "+data.minute.time[i].toString();
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice=aryMinuteData[i-1].AvPrice;
        }
        else
        {
            item.Close=data.minute.price[i];
            item.Open=data.minute.open[i];
            item.High=data.minute.high[i];
            item.Low=data.minute.low[i];
            item.Vol=data.minute.vol[i]/100; //原始单位股
            item.Amount=data.minute.amount[i];
            item.DateTime=data.date.toString()+" "+data.minute.time[i].toString();
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice=data.minute.avprice[i];
        }

        aryMinuteData[i]=item;
    }

    return aryMinuteData;
}

/////////////////////////////////////////////////////////////////////////////
//  自定义指数
//
function CustomKLineChartContainer(uielement)
{
    this.newMethod=KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'CustomKLineChartContainer';
    this.ChangeRight=null;  //没有复权设置
    this.SplashTitle = '计算指数数据';

    this.CustomKLineApiUrl = g_JSChartResource.Domain + "/API/IndexCalculate";  //自定义指数计算地址
    this.CustomStock;   //成分
    this.QueryDate={Start:20180101,End:20180627} ;     //计算时间区间

    this.RequestHistoryData=function()
    {
        var self=this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.Draw();
        wx.request({
          url: this.CustomKLineApiUrl,
            data:
            {
                "stock": self.CustomStock,
                "Name": self.Symbol,
                "date": { "startdate":self.QueryDate.Start,"enddate":self.QueryDate.End }
            },
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (data)
            {         
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistroyData(data);
            }
        });
    }

    this.RecvHistroyData=function(recvData)
    {
        var data=recvData.data;
        var aryDayData=KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData=new ChartData();
        sourceData.Data=aryDayData;
        sourceData.DataType=0;      //0=日线数据 1=分钟数据

        //显示的数据
        var bindData=new ChartData();
        bindData.Data=aryDayData;
        bindData.Right=0;   //指数没有复权
        bindData.Period=this.Period;
        bindData.DataType=0;

        if (bindData.Period>0 && bindData.Period<=3)   //周期数据
        {
            var periodData=sourceData.GetPeriodData(bindData.Period);
            bindData.Data=periodData;
        }

        //绑定数据
        this.SourceData=sourceData;
        this.Name=data.name;
        this.BindMainData(bindData,this.PageSize);

        for(var i=0; i<this.Frame.SubFrame.length; ++i)
        {
            this.BindIndexData(i,bindData);
        }
        //this.BindIndexData(0,hisData);
        //this.BindIndexData(1,hisData);
        //this.BindIndexData(2,hisData);

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
        
        if (typeof(this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistroyData', this);
    }

}

////////////////////////////////////////////////////////////////////////////////
//  K线横屏显示
//
function KLineChartHScreenContainer(uielement) 
{
    this.newMethod = KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'KLineChartHScreenContainer';

    //判断是单个手指
    function IsPhoneDragging(e) 
    {
        // console.log(e);
        var changed = e.changedTouches.length;
        var touching = e.touches.length;

        return changed == 1 && touching == 1;
    }

    //是否是2个手指操所
    function IsPhonePinching(e) 
    {
        var changed = e.changedTouches.length;
        var touching = e.touches.length;

        return (changed == 1 || changed == 2) && touching == 2;
    }

    function GetToucheData(e) 
    {
        var touches = new Array();
        for (var i = 0; i < e.touches.length; ++i) 
        {
            var item = e.touches[i];
            
            touches.push(
            {
                clientX: item.x, clientY: item.y,
                pageX: item.x, pageY: item.y
            });
            
        }

        return touches;
    }

    this.OnMouseMove = function (x, y, e) 
    {
        this.LastPoint.X = x;
        this.LastPoint.Y = y;
        this.CursorIndex = this.Frame.GetXData(y);

        this.DrawDynamicInfo();
    }

    //手机拖拽
    this.ontouchstart = function (e) 
    {
        var jsChart = this;
        if (jsChart.DragMode == 0) return;

        jsChart.PhonePinch = null;

        if (IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock) {
                var touches = GetToucheData(e);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            if (this.TouchTimer != null) clearTimeout(this.TouchTimer);
            if (this.ChartCorssCursor.IsShow == true) 
            {
                this.TouchTimer = setTimeout(function () 
                {
                    if (drag.Click.X == drag.LastMove.X && drag.Click.Y == drag.LastMove.Y) //手指没有移动，出现十字光标
                    {
                        var mouseDrag = jsChart.MouseDrag;
                        jsChart.MouseDrag = null;
                        //移动十字光标
                        var x = drag.Click.X;
                        var y = drag.Click.Y;
                        jsChart.OnMouseMove(x, y, e);
                    }

                }, 800);
            }

            var drag =
                {
                    "Click": {},
                    "LastMove": {},  //最后移动的位置
                };

            var touches = GetToucheData(e);

            drag.Click.X = touches[0].clientX;
            drag.Click.Y = touches[0].clientY;
            drag.LastMove.X = touches[0].clientX;
            drag.LastMove.Y = touches[0].clientY;

            jsChart.MouseDrag = drag;
        }
        else if (IsPhonePinching(e)) 
        {
            var phonePinch =
            {
                "Start": {},
                "Last": {}
            };

            var touches = GetToucheData(e);

            phonePinch.Start = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
            phonePinch.Last = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };

            jsChart.PhonePinch = phonePinch;
        }
    }


    this.ontouchmove = function (e) 
    {
        var jsChart = this;

        var touches = GetToucheData(e);

        if (IsPhoneDragging(e))
        {
            var drag = jsChart.MouseDrag;
            if (drag == null) 
            {
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                jsChart.OnMouseMove(x, y, e);
            }
            else 
            {
                var moveSetp = Math.abs(drag.LastMove.Y - touches[0].clientY);
                moveSetp = parseInt(moveSetp);
                if (jsChart.DragMode == 1)  //数据左右拖拽
                {
                    if (moveSetp < 5) return;

                    var isLeft = true;
                    if (drag.LastMove.Y < touches[0].clientY) isLeft = false;//右移数据

                    if (jsChart.DataMove(moveSetp, isLeft)) 
                    {
                        jsChart.UpdataDataoffset();
                        jsChart.UpdatePointByCursorIndex();
                        jsChart.UpdateFrameMaxMin();
                        jsChart.ResetFrameXYSplit();
                        jsChart.Draw();
                    }

                    drag.LastMove.X = touches[0].clientX;
                    drag.LastMove.Y = touches[0].clientY;
                }
            }
        }
        else if (IsPhonePinching(e)) 
        {
            var phonePinch = jsChart.PhonePinch;
            if (!phonePinch) return;

            var yHeight = Math.abs(touches[0].pageX - touches[1].pageX);
            var yLastHeight = Math.abs(phonePinch.Last.X - phonePinch.Last.X2);
            var yStep = yHeight - yLastHeight;
            if (Math.abs(yStep) < 5) return;

            if (yStep > 0)    //放大
            {
                var cursorIndex = {};
                cursorIndex.Index = parseInt(Math.abs(jsChart.CursorIndex - 0.5).toFixed(0));
                if (!jsChart.Frame.ZoomUp(cursorIndex)) return;
                jsChart.CursorIndex = cursorIndex.Index;
                jsChart.UpdatePointByCursorIndex();
                jsChart.UpdataDataoffset();
                jsChart.UpdateFrameMaxMin();
                jsChart.ResetFrameXYSplit();
                jsChart.Draw();
            }
            else        //缩小
            {
                var cursorIndex = {};
                cursorIndex.Index = parseInt(Math.abs(jsChart.CursorIndex - 0.5).toFixed(0));
                if (!jsChart.Frame.ZoomDown(cursorIndex)) return;
                jsChart.CursorIndex = cursorIndex.Index;
                jsChart.UpdataDataoffset();
                jsChart.UpdatePointByCursorIndex();
                jsChart.UpdateFrameMaxMin();
                jsChart.ResetFrameXYSplit();
                jsChart.Draw();
            }

            phonePinch.Last = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
        }
    }


    uielement.onmousedown = function (e)   //鼠标拖拽
    {
        if (!this.JSChartContainer) return;
        if (this.JSChartContainer.DragMode == 0) return;

        if (this.JSChartContainer.TryClickLock) 
        {
            var x = e.clientX - this.getBoundingClientRect().left;
            var y = e.clientY - this.getBoundingClientRect().top;
            if (this.JSChartContainer.TryClickLock(x, y)) return;
        }


        var drag =
        {
            "Click": {},
            "LastMove": {},  //最后移动的位置
        };

        drag.Click.X = e.clientX;
        drag.Click.Y = e.clientY;
        drag.LastMove.X = e.clientX;
        drag.LastMove.Y = e.clientY;

        this.JSChartContainer.MouseDrag = drag;
        document.JSChartContainer = this.JSChartContainer;
        this.JSChartContainer.SelectChartDrawPicture = null;

        uielement.ondblclick = function (e) 
        {
            var x = e.clientX - this.getBoundingClientRect().left;
            var y = e.clientY - this.getBoundingClientRect().top;

            if (this.JSChartContainer)
                this.JSChartContainer.OnDoubleClick(x, y, e);
        }

        document.onmousemove = function (e) 
        {
            if (!this.JSChartContainer) return;
            //加载数据中,禁用鼠标事件
            if (this.JSChartContainer.ChartSplashPaint && this.JSChartContainer.ChartSplashPaint.IsEnableSplash == true) return;

            var drag = this.JSChartContainer.MouseDrag;
            if (!drag) return;

            var moveSetp = Math.abs(drag.LastMove.Y - e.clientY);

            if (this.JSChartContainer.DragMode == 1)  //数据左右拖拽
            {
                if (moveSetp < 5) return;

                var isLeft = true;
                if (drag.LastMove.Y < e.clientY) isLeft = false;//右移数据

                if (this.JSChartContainer.DataMove(moveSetp, isLeft)) 
                {
                    this.JSChartContainer.UpdataDataoffset();
                    this.JSChartContainer.UpdatePointByCursorIndex();
                    this.JSChartContainer.UpdateFrameMaxMin();
                    this.JSChartContainer.ResetFrameXYSplit();
                    this.JSChartContainer.Draw();
                }

                drag.LastMove.X = e.clientX;
                drag.LastMove.Y = e.clientY;
            }
        };

        document.onmouseup = function (e) 
        {
            //清空事件
            document.onmousemove = null;
            document.onmouseup = null;

            //清空数据
            this.JSChartContainer.MouseDrag = null;
            this.JSChartContainer.CurrentChartDrawPicture = null;
            this.JSChartContainer = null;
        }
    }

    //创建
    //windowCount 窗口个数
    this.Create = function (windowCount) 
    {
        this.UIElement.JSChartContainer = this;

        //创建十字光标
        this.ChartCorssCursor = new ChartCorssCursor();
        this.ChartCorssCursor.Canvas = this.Canvas;
        this.ChartCorssCursor.StringFormatX = new HQDateStringFormat();
        this.ChartCorssCursor.StringFormatY = new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame = new HQTradeHScreenFrame();
        this.Frame.ChartBorder = new ChartBorder();
        this.Frame.ChartBorder.UIElement = this.UIElement;
        this.Frame.ChartBorder.Top = 30;
        this.Frame.ChartBorder.Left = 5;
        this.Frame.ChartBorder.Bottom = 20;
        this.Frame.Canvas = this.Canvas;
        this.ChartCorssCursor.Frame = this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for (var i in this.Frame.SubFrame) 
        {
            var titlePaint = new DynamicChartTitlePainting();
            titlePaint.Frame = this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas = this.Canvas;

            this.TitlePaint.push(titlePaint);
        }
    }

    //创建子窗口
    this.CreateChildWindow = function (windowCount) 
    {
        for (var i = 0; i < windowCount; ++i) 
        {
            var border = new ChartBorder();
            border.UIElement = this.UIElement;

            var frame = new KLineHScreenFrame();
            frame.Canvas = this.Canvas;
            frame.ChartBorder = border;
            frame.Identify = i;                   //窗口序号

            if (this.ModifyIndexDialog) frame.ModifyIndexEvent = this.ModifyIndexDialog.DoModal;        //绑定菜单事件
            if (this.ChangeIndexDialog) frame.ChangeIndexEvent = this.ChangeIndexDialog.DoModal;

            frame.HorizontalMax = 20;
            frame.HorizontalMin = 10;

            if (i == 0) 
            {
                frame.YSplitOperator = new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
            }
            else 
            {
                frame.YSplitOperator = new FrameSplitY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
                //frame.IsLocked = true;
            }

            frame.YSplitOperator.Frame = frame;
            frame.YSplitOperator.ChartBorder = border;
            frame.XSplitOperator = new FrameSplitKLineX();
            frame.XSplitOperator.Frame = frame;
            frame.XSplitOperator.ChartBorder = border;

            if (i != windowCount - 1) frame.XSplitOperator.ShowText = false;

            for (var j = frame.HorizontalMin; j <= frame.HorizontalMax; j += 1) 
            {
                frame.HorizontalInfo[j] = new CoordinateInfo();
                frame.HorizontalInfo[j].Value = j;
                if (i == 0 && j == frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1] = j.toString();
                frame.HorizontalInfo[j].Font = "14px 微软雅黑";
            }

            var subFrame = new SubFrameItem();
            subFrame.Frame = frame;
            if (i == 0)
                subFrame.Height = 20;
            else
                subFrame.Height = 10;

            this.Frame.SubFrame[i] = subFrame;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//  走势图横屏显示
//
function MinuteChartHScreenContainer(uielement) 
{
    this.newMethod = MinuteChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'MinuteChartHScreenContainer';

    this.OnMouseMove = function (x, y, e) 
    {
        this.LastPoint.X = x;
        this.LastPoint.Y = y;
        this.CursorIndex = this.Frame.GetXData(y);

        this.DrawDynamicInfo();
    }

    //创建
    //windowCount 窗口个数
    this.Create = function (windowCount) 
    {
        this.UIElement.JSChartContainer = this;

        //创建十字光标
        this.ChartCorssCursor = new ChartCorssCursor();
        this.ChartCorssCursor.Canvas = this.Canvas;
        this.ChartCorssCursor.StringFormatX = new HQMinuteTimeStringFormat();
        this.ChartCorssCursor.StringFormatY = new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.SplashTitle;

        //创建框架容器
        this.Frame = new HQTradeHScreenFrame();
        this.Frame.ChartBorder = new ChartBorder();
        this.Frame.ChartBorder.UIElement = this.UIElement;
        this.Frame.ChartBorder.Top = 25;
        this.Frame.ChartBorder.Left = 50;
        this.Frame.ChartBorder.Bottom = 20;
        this.Frame.Canvas = this.Canvas;
        this.ChartCorssCursor.Frame = this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateChildWindow(windowCount);
        this.CreateMainKLine();

        //子窗口动态标题
        for (var i in this.Frame.SubFrame) 
        {
            var titlePaint = new DynamicChartTitlePainting();
            titlePaint.Frame = this.Frame.SubFrame[i].Frame;
            titlePaint.Canvas = this.Canvas;

            this.TitlePaint.push(titlePaint);
        }
    }

    //创建子窗口
    this.CreateChildWindow = function (windowCount) 
    {
        for (var i = 0; i < windowCount; ++i) 
        {
            var border = new ChartBorder();
            border.UIElement = this.UIElement;

            var frame = new MinuteHScreenFrame();
            frame.Canvas = this.Canvas;
            frame.ChartBorder = border;
            if (i < 2) frame.ChartBorder.TitleHeight = 0;
            frame.XPointCount = 243;

            var DEFAULT_HORIZONTAL = [9, 8, 7, 6, 5, 4, 3, 2, 1];
            frame.HorizontalMax = DEFAULT_HORIZONTAL[0];
            frame.HorizontalMin = DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length - 1];

            if (i == 0) 
            {
                frame.YSplitOperator = new FrameSplitMinutePriceY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
            }
            else 
            {
                frame.YSplitOperator = new FrameSplitY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
            }

            frame.YSplitOperator.Frame = frame;
            frame.YSplitOperator.ChartBorder = border;
            frame.XSplitOperator = new FrameSplitMinuteX();
            frame.XSplitOperator.Frame = frame;
            frame.XSplitOperator.ChartBorder = border;
            if (i != windowCount - 1) frame.XSplitOperator.ShowText = false;
            frame.XSplitOperator.Operator();

            for (var j in DEFAULT_HORIZONTAL) 
            {
                frame.HorizontalInfo[j] = new CoordinateInfo();
                frame.HorizontalInfo[j].Value = DEFAULT_HORIZONTAL[j];
                if (i == 0 && j == frame.HorizontalMin) continue;

                frame.HorizontalInfo[j].Message[1] = DEFAULT_HORIZONTAL[j].toString();
                frame.HorizontalInfo[j].Font = "14px 微软雅黑";
            }

            var subFrame = new SubFrameItem();
            subFrame.Frame = frame;
            if (i == 0)
                subFrame.Height = 20;
            else
                subFrame.Height = 10;

            this.Frame.SubFrame[i] = subFrame;
        }
    }

}


////////////////////////////////////////////////////////////////////////////////
//  简单的图形框架
//
function SimlpleChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.WindowIndex=new Array();
    this.MainDataControl;    //主数据类(对外的接口类)
    this.SubDataControl=new Array();
    this.FrameType=0;       //框架类型

    this.YSplitCount=3;

    //创建
    this.Create=function()
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        //this.ChartCorssCursor=new ChartCorssCursor();
        //this.ChartCorssCursor.Canvas=this.Canvas;
        //this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
        //this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        if (this.FrameType==1) this.Frame=new Rotate90SimpleChartFrame();
        else this.Frame=new SimpleChartFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.Canvas=this.Canvas;
        if (this.ChartCorssCursor) this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        this.CreateMainChart();

    }

    this.SetMainDataConotrl = function (dataControl) 
    {
        if (!dataControl) return;

        this.MainDataControl = dataControl;
        this.ChartPaint = []; //图形
        this.Frame.BarCount=0;

        let yStringFormat = this.Frame.YSplitOperator.StringFormat;//保存配置

        this.CreateMainChart();
        this.Frame.YSplitOperator.StringFormat = yStringFormat;//还原配置
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart=function()
    {
        if (!this.MainDataControl) return;

        let barIndex=0;
        for(let i in this.MainDataControl.DataType)
        {
           let item=this.MainDataControl.DataType[i];
           if (item.Type=="BAR")
           {
               let chartItem;
               if (this.FrameType == 1) chartItem= new ChartXYSubBar();
               else chartItem = new ChartSubBar();

               chartItem.BarID=barIndex;
               chartItem.Canvas=this.Canvas;
               chartItem.ChartBorder=this.Frame.ChartBorder;
               chartItem.ChartFrame=this.Frame;
               chartItem.Name=item.Name;
               if (item.Color) chartItem.UpBarColor=item.Color;
               if (item.Color2) chartItem.DownBarColor=item.Color2;

               this.ChartPaint.push(chartItem);
               ++this.Frame.BarCount;
               ++barIndex;
           }
           else if (item.Type=="LINE")
           {
                let chartItem=new ChartLine();
                chartItem.Canvas=this.Canvas;
                chartItem.ChartBorder=this.Frame.ChartBorder;
                chartItem.ChartFrame=this.Frame;
                chartItem.Name=item.Name;
                if (item.Color) chartItem.Color=item.Color;

                this.ChartPaint.push(chartItem);
           }
        }

        this.Frame.YSplitOperator=new FrameSplitY();
        this.Frame.YSplitOperator.SplitCount = this.YSplitCount;
        this.Frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
        this.Frame.YSplitOperator.Frame=this.Frame;
        this.Frame.YSplitOperator.ChartBorder=this.Frame.ChartBorder;

        this.Frame.XSplitOperator=new FrameSplitXData();
        this.Frame.XSplitOperator.Frame=this.Frame;
        this.Frame.XSplitOperator.ChartBorder=this.Frame.ChartBorder;


       // this.TitlePaint[0]=new DynamicKLineTitlePainting();
       // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
       // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData=function()
    {
        if(!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer=this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData=function(dataControl)
    {
        let lCount=0;
        for(let i in dataControl.Data)
        {
            let itemData=new ChartData();
            itemData.Data=dataControl.Data[i];
            this.ChartPaint[i].Data=itemData;
            if (lCount<itemData.Data.length) lCount=itemData.Data.length;
        }

        this.Frame.XPointCount=lCount;
        this.Frame.Data=this.ChartPaint[0].Data;
        this.Frame.XData=dataControl.XData;

        this.UpdateFrameMaxMin();               //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

}

////////////////////////////////////////////////////////////////////////////////
//  饼图图形框架
//
function PieChartContainer(uielement) 
{
    this.Radius;    //半径
    this.newMethod = JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.MainDataControl;    //主数据类(对外的接口类)

    //鼠标移动
    this.OnMouseMove = function (x, y, e) 
    {

    }

  //创建
    this.Create = function () 
    {
        this.UIElement.JSChartContainer = this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame = new NoneFrame();
        this.Frame.ChartBorder = new ChartBorder();
        this.Frame.ChartBorder.UIElement = this.UIElement;
        this.Frame.ChartBorder.Top = 30;
        this.Frame.ChartBorder.Left = 5;
        this.Frame.ChartBorder.Bottom = 20;
        this.Frame.Canvas = this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;
        this.CreateMainChart();
    }

    this.SetMainDataConotrl = function (dataControl) 
    {
        if (!dataControl) return;

        this.MainDataControl = dataControl;
        this.ChartPaint = []; //图形

        this.CreateMainChart();
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart = function () 
    {
        if (!this.MainDataControl) return;

        for (let i in this.MainDataControl.DataType) 
        {
          let item = this.MainDataControl.DataType[i];
          if (item.Type == "PIE") 
          {
              var chartItem = new ChartPie();
              chartItem.Canvas = this.Canvas;
              chartItem.ChartBorder = this.Frame.ChartBorder;
              chartItem.ChartFrame = this.Frame;
              chartItem.Name = item.Name;

              this.ChartPaint.push(chartItem);
          }
          else if (item.Type =='CIRCLE')
          {
              var chartItem = new ChartCircle();
              chartItem.Canvas = this.Canvas;
              chartItem.ChartBorder = this.Frame.ChartBorder;
              chartItem.ChartFrame = this.Frame;
              chartItem.Name = item.Name;

              this.ChartPaint.push(chartItem);
          }
        }

        // this.TitlePaint[0]=new DynamicKLineTitlePainting();
        // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData = function () 
    {
        if (!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer = this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData = function (dataControl) 
    {
        for (let i in dataControl.Data) 
        {
            let itemData = new ChartData();
            itemData.Data = dataControl.Data[i];
            this.ChartPaint[i].Data = itemData;
        }
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

}

//地图
function MapChartContainer(uielement) 
{
    this.newMethod = JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.MainDataControl;    //主数据类(对外的接口类)

    //鼠标移动
    this.OnMouseMove = function (x, y, e) 
    {

    }

    //创建
    this.Create = function () 
    {
        this.UIElement.JSChartContainer = this;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;

        //创建框架容器
        this.Frame = new NoneFrame();
        this.Frame.ChartBorder = new ChartBorder();
        this.Frame.ChartBorder.UIElement = this.UIElement;
        this.Frame.ChartBorder.Top = 30;
        this.Frame.ChartBorder.Left = 5;
        this.Frame.ChartBorder.Bottom = 20;
        this.Frame.Canvas = this.Canvas;

        this.ChartSplashPaint.Frame = this.Frame;
        this.CreateMainChart();
    }

    this.SetMainDataConotrl = function (dataControl) 
    {
        if (!dataControl) return;

        this.MainDataControl = dataControl;
        this.ChartPaint = []; //图形

        this.CreateMainChart();
        this.Draw();
        this.RequestData();
    }

    //创建主数据画法
    this.CreateMainChart = function () 
    {
        if (!this.MainDataControl) return;

        let chartItem = new ChartChinaMap();
        chartItem.Canvas = this.Canvas;
        chartItem.ChartBorder = this.Frame.ChartBorder;
        chartItem.ChartFrame = this.Frame;
        chartItem.Name = this.MainDataControl.DataType[0].Name;

        if (this.Radius) chartItem.Radius = this.Radius;

        this.ChartPaint.push(chartItem);

        // this.TitlePaint[0]=new DynamicKLineTitlePainting();
        // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        // this.TitlePaint[0].Canvas=this.Canvas;
    }

    this.RequestData = function () 
    {
        if (!this.MainDataControl) return;

        this.MainDataControl.JSChartContainer = this;
        this.MainDataControl.RequestData();
    }

    this.UpdateMainData = function (dataControl) 
    {
        this.ChartPaint[0].Data = dataControl.Data[0];

        this.Frame.SetSizeChage(true);
        this.Draw();
    }
}

//////////////////////////////////////////////////////////
//
//  指标信息
//
function IndexInfo(name,param)
{
    this.Name=name;                 //名字
    this.Param=param;               //参数
    this.LineColor;                 //线段颜色
    this.ReqeustData=null;          //数据请求
}

function BaseIndex(name)
{
    this.Index;               //指标阐述
    this.Name=name;           //指标名字
    this.UpdateUICallback;    //数据到达回调

    //默认创建都是线段
    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            if (!this.Index[i].Name) continue;

            var maLine=new ChartLine();
            maLine.Canvas=hqChart.Canvas;
            maLine.Name=this.Name+'-'+i.toString();
            maLine.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            maLine.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            maLine.Color=this.Index[i].LineColor;

            hqChart.ChartPaint.push(maLine);
        }
    }

    //指标不支持 周期/复权/股票等
    this.NotSupport=function(hqChart,windowIndex,message)
    {
        var paint=hqChart.GetChartPaint(windowIndex);
        for(var i in paint)
        {
            paint[i].Data.Data=[];    //清空数据
            if (i==0) paint[i].NotSupportMessage=message;
        }
    }

    //格式化指标名字+参数
    //格式:指标名(参数1,参数2,参数3,...)
    this.FormatIndexTitle=function()
    {
        var title=this.Name;
        var param=null;

        for(var i in this.Index)
        {
            var item = this.Index[i];
            if (item.Param==null) continue;

            if (param)
                param+=','+item.Param.toString();
            else
                param=item.Param.toString();
        }

        if (param)
        {
            title+='('+param+')';
        }

        return title;
    }

    this.InvokeUpdateUICallback = function(paint)
    {
        if (typeof (this.UpdateUICallback) != 'function') return;

        let indexData = new Array();
        for (let i in paint) 
        {
          indexData.push({ Name: this.Index[i].Name, Data: paint[i].Data });
        }

        this.UpdateUICallback(indexData);
    }
      
}

//脚本指标
//name=指标名字 args=参数名字 参数值
function ScriptIndex(name, script, args, option)
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod(name);
    delete this.newMethod;

    this.Script=script;
    this.Arguments=[];
    this.OutVar=[];

    //指标上锁配置信息
    this.IsLocked = false;    //是否锁住指标
    this.LockCallback = null;
    this.LockID = null;
    this.LockBG = null;       //锁背景色
    this.LockTextColor = null;
    this.LockText = null;
    this.LockFont = null;
    this.LockCount = 10;

    if (option && option.Lock) 
    {
        if (option.Lock.IsLocked == true) this.IsLocked = true;  //指标上锁
        if (option.Lock.Callback) this.LockCallback = option.Lock.Callback;    //锁回调
        if (option.Lock.ID) this.LockID = option.Lock.ID;                      //锁ID
        if (option.Lock.BG) this.LockBG = option.Lock.BG;
        if (option.Lock.TextColor) this.LockTextColor = option.Lock.TextColor;
        if (option.Lock.Text) this.LockText = option.Lock.Text;
        if (option.Lock.Font) this.LockFont = option.Lock.Font;
        if (option.Lock.Count) this.LockCount = option.Lock.Count;
    }

    if (args) this.Arguments=args;

    this.SetLock = function (lockData) 
    {
        if (lockData.IsLocked == true) 
        {
            this.IsLocked = true;  //指标上锁
            if (lockData.Callback) this.LockCallback = lockData.Callback;    //锁回调
            if (lockData.ID) this.LockID = lockData.ID;                      //锁ID
            if (lockData.BG) this.LockBG = lockData.BG;
            if (lockData.TextColor) this.LockTextColor = lockData.TextColor;
            if (lockData.Text) this.LockText = lockData.Text;
            if (lockData.Font) this.LockFont = lockData.Font;
            if (lockData.Count) this.LockCount = lockData.Count;
        }
        else 
        {   //清空锁配置信息
            this.IsLocked = false;    //是否锁住指标
            this.LockCallback = null;
            this.LockID = null;
            this.LockBG = null;       //锁背景色
            this.LockTextColor = null;
            this.LockText = null;
            this.LockFont = null;
            this.LockCount = 10;
        }
    }

    this.ExecuteScript=function(hqChart,windowIndex,hisData)
    {
        this.OutVar=[];
        let self = this;
        let param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData,
            Self:this
        };

        let hqDataType = 0;   //默认K线
        if (hqChart.ClassName === 'MinuteChartContainer') hqDataType = 2;   //分钟数据
        let option=
        {
            HQDataType: hqDataType,
            Symbol:hqChart.Symbol, 
            Data:hisData,
            Callback:this.RecvResultData, CallbackParam:param,
            Async:true,
            MaxReqeustDataCount:hqChart.MaxReqeustDataCount,
            MaxRequestMinuteDayCount:hqChart.MaxRequestMinuteDayCount,
            Arguments:this.Arguments
        };

        let code=this.Script;
        let run =JSCommonComplier.JSComplier.Execute(code,option,hqChart.ScriptErrorCallback);
    }

    this.RecvResultData=function(outVar,param)
    {
        let hqChart=param.HQChart;
        let windowIndex=param.WindowIndex;
        let hisData=param.HistoryData;
        param.Self.OutVar=outVar;
        param.Self.BindData(hqChart,windowIndex,hisData);

        if (param.Self.IsLocked == false) //不上锁
        {
            param.HQChart.Frame.SubFrame[windowIndex].Frame.SetLock(null);
        }
        else    //上锁
        {
            let lockData = 
            {
                IsLocked: true, Callback: param.Self.LockCallback, IndexName: param.Self.Name, ID: param.Self.LockID,
                BG: param.Self.LockBG, Text: param.Self.LockText, TextColor: param.Self.LockTextColor, Font: param.Self.LockFont,
                Count: param.Self.LockCount
            };
            param.HQChart.Frame.SubFrame[windowIndex].Frame.SetLock(lockData);
        }

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }

    this.CreateLine=function(hqChart,windowIndex,varItem,id)
    {
        let line=new ChartLine();
        line.Canvas=hqChart.Canvas;
        line.DrawType = 1;  //无效数不画
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

        hqChart.ChartPaint.push(line);
    }

    //创建柱子
    this.CreateBar=function(hqChart,windowIndex,varItem,id)
    {
        let bar=new ChartStickLine();
        bar.Canvas=hqChart.Canvas;
        bar.LineWidth=varItem.Draw.Width;

        bar.Name=varItem.Name;
        bar.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        bar.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) bar.Color=this.GetColor(varItem.Color);
        else bar.Color=this.GetDefaultColor(id);
        
        let titleIndex=windowIndex+1;
        bar.Data.Data=varItem.Draw.DrawData;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        hqChart.ChartPaint.push(bar);
    }

    //创建文本
    this.CreateText=function(hqChart,windowIndex,varItem,id)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;

        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);

        let titleIndex=windowIndex+1;
        chartText.Data.Data=varItem.Draw.DrawData;
        chartText.Text=varItem.Draw.Text;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        hqChart.ChartPaint.push(chartText);

    }

    //COLORSTICK 
    this.CreateMACD=function(hqChart,windowIndex,varItem,id)
    {
        let chartMACD=new ChartMACD();
        chartMACD.Canvas=hqChart.Canvas;

        chartMACD.Name=varItem.Name;
        chartMACD.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartMACD.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        let titleIndex=windowIndex+1;
        chartMACD.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chartMACD.Data,varItem.Name,this.GetDefaultColor(id));

        hqChart.ChartPaint.push(chartMACD);
    }

    this.CreatePointDot=function(hqChart,windowIndex,varItem,id)
    {
        let pointDot=new ChartPointDot();
        pointDot.Canvas=hqChart.Canvas;
        pointDot.Name=varItem.Name;
        pointDot.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        pointDot.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) pointDot.Color=this.GetColor(varItem.Color);
        else pointDot.Color=this.GetDefaultColor(id);

        if (varItem.Radius) pointDot.Radius=varItem.Radius;

        if (varItem.LineWidth) 
        {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) pointDot.Radius = width;
        }

        let titleIndex=windowIndex+1;
        pointDot.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(pointDot.Data,varItem.Name,pointDot.Color);

        hqChart.ChartPaint.push(pointDot);
    }

    this.CreateStick=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        hqChart.ChartPaint.push(chart);
    }

    this.CreateLineStick=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartLineStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        hqChart.ChartPaint.push(chart);
    }

    this.CreateStraightLine=function(hqChart,windowIndex,varItem,id)
    {
        let line=new ChartLine();
        line.DrawType=1;
        line.Canvas=hqChart.Canvas;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

        hqChart.ChartPaint.push(line);
    }

    this.CreateVolStick=function(hqChart,windowIndex,varItem,id,hisData)
    {
        let chart=new ChartVolStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        chart.HistoryData=hisData;
        hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        hqChart.ChartPaint.push(chart);
    }

    this.CreateBand=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartBand();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.FirstColor = varItem.Draw.Color[0];
        chart.SecondColor = varItem.Draw.Color[1];
        chart.Data.Data=varItem.Draw.DrawData;

        hqChart.ChartPaint.push(chart);
    }

    this.CreatePolyLine = function (hqChart, windowIndex, varItem, id) 
    {
        let line = new ChartLine();
        line.Canvas = hqChart.Canvas;
        line.Name = varItem.Name;
        line.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color = this.GetColor(varItem.Color);
        else line.Color = this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) line.LineWidth = width;
        }

        let titleIndex = windowIndex + 1;
        line.Data.Data = varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(line.Data, ' ', line.Color); //给一个空的标题

        hqChart.ChartPaint.push(line);
    }

    //创建K线图
    this.CreateKLine = function (hqChart, windowIndex, varItem, id) 
    {
        let chart = new ChartKLine();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data = varItem.Draw.DrawData;
        chart.IsShowMaxMinPrice = false;

        hqChart.ChartPaint.push(chart);
    }

    this.CreateNumberText = function (hqChart, windowIndex, varItem, id)
    {
        let chartText = new ChartSingleText();
        chartText.Canvas = hqChart.Canvas;

        chartText.Name = varItem.Name;
        chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
        else chartText.Color = this.GetDefaultColor(id);

        let titleIndex = windowIndex + 1;
        chartText.Data.Data = varItem.Draw.DrawData.Value;
        chartText.Text = varItem.Draw.DrawData.Text;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
    }

    //创建图标
    this.CreateIcon = function (hqChart, windowIndex, varItem, id) 
    {
        let chartText = new ChartSingleText();
        chartText.Canvas = hqChart.Canvas;
        chartText.TextAlign = 'center';

        chartText.Name = varItem.Name;
        chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        let titleIndex = windowIndex + 1;
        chartText.Data.Data = varItem.Draw.DrawData;
        chartText.Text = varItem.Draw.Icon.Symbol;
        if (varItem.Draw.Icon.Color) chartText.Color = varItem.Draw.Icon.Color;
        else chartText.Color = 'rgb(0,0,0)';

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        hqChart.ChartPaint.push(chartText);
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        //清空指标图形
        hqChart.DeleteIndexPaint(windowIndex);

        if (this.OutVar==null || this.OutVar.length<0) return;

        for(let i in this.OutVar)
        {
            let item=this.OutVar[i];
            if (item.Type==0)  
            {
                this.CreateLine(hqChart,windowIndex,item,i);
            }
            else if (item.Type==1)
            {
                switch(item.Draw.DrawType)
                {
                    case 'STICKLINE':
                        this.CreateBar(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT':
                        this.CreateText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWLINE':
                        this.CreateStraightLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWBAND':
                        this.CreateBand(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE':
                        this.CreateKLine(hqChart, windowIndex, item, i);
                        break;
                    case 'POLYLINE':
                        this.CreatePolyLine(hqChart, windowIndex, item, i);
                        break;
                    case 'DRAWNUMBER':
                        this.CreateNumberText(hqChart, windowIndex, item, i);
                        break;
                    case 'DRAWICON':
                        this.CreateIcon(hqChart, windowIndex, item, i);
                        break;
                }
            }
            else if (item.Type==2)
            {
                this.CreateMACD(hqChart,windowIndex,item,i);
            }
            else if (item.Type==3)
            {
                this.CreatePointDot(hqChart,windowIndex,item,i);
            }
            else if (item.Type==4)
            {
                this.CreateLineStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==5)
            {
                this.CreateStick(hqChart,windowIndex,item,i);
            }
            else if (item.Type==6)
            {
                this.CreateVolStick(hqChart,windowIndex,item,i,hisData);
            }
        }

        let titleIndex=windowIndex+1;
        hqChart.TitlePaint[titleIndex].Title=this.Name;

        let indexParam='';
        for(let i in this.Arguments)
        {
            let item=this.Arguments[i];
            if (indexParam.length>0) indexParam+=',';
            indexParam+=item.Value.toString();
        }

        if (indexParam.length>0) hqChart.TitlePaint[titleIndex].Title=this.Name+'('+indexParam+')';

        return true;
    }
}

//给一个默认的颜色
ScriptIndex.prototype.GetDefaultColor=function(id)
{
    let COLOR_ARRAY=
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
    ];

    let number=parseInt(id);
    return COLOR_ARRAY[number%(COLOR_ARRAY.length-1)];
}

//获取颜色
ScriptIndex.prototype.GetColor=function(colorName)
{
    let COLOR_MAP=new Map([
        ['COLORBLACK','rgb(0,0,0)'],
        ['COLORBLUE','rgb(18,95,216)'],
        ['COLORGREEN','rgb(25,158,0)'],
        ['COLORCYAN','rgb(0,255,198)'],
        ['COLORRED','rgb(238,21,21)'],
        ['COLORMAGENTA','rgb(255,0,222)'],
        ['COLORBROWN','rgb(149,94,15)'],
        ['COLORLIGRAY','rgb(218,218,218)'],      //画淡灰色
        ['COLORGRAY','rgb(133,133,133)'],        //画深灰色
        ['COLORLIBLUE','rgb(94,204,255)'],       //淡蓝色
        ['COLORLIGREEN','rgb(183,255,190)'],      //淡绿色
        ['COLORLICYAN','rgb(154,255,242)'],      //淡青色
        ['COLORLIRED','rgb(255,172,172)'],       //淡红色
        ['COLORLIMAGENTA','rgb(255,145,241)'],   //淡洋红色
        ['COLORWHITE','rgb(255,255,255)'],       //白色
        ['COLORYELLOW','rgb(255,198,0)']
    ]);

    if (COLOR_MAP.has(colorName)) return COLOR_MAP.get(colorName);

    //COLOR 自定义色
    //格式为COLOR+“RRGGBB”：RR、GG、BB表示红色、绿色和蓝色的分量，每种颜色的取值范围是00-FF，采用了16进制。
    //例如：MA5：MA(CLOSE，5)，COLOR00FFFF　表示纯红色与纯绿色的混合色：COLOR808000表示淡蓝色和淡绿色的混合色。
    if (colorName.indexOf('COLOR')==0) return '#'+colorName.substr(5);

    return 'rgb(30,144,255)';
}

//市场多空
function MarketLongShortIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Long-Short');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("市场多空指标",null),
        new IndexInfo("多头区域",null),
        new IndexInfo("空头区域",null)
    );

    this.Index[0].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[1].LineColor=g_JSChartResource.UpBarColor;
    this.Index[2].LineColor=g_JSChartResource.DownBarColor;

    this.LongShortData; //多空数据

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0)
                paint=new ChartLine();
            else
                paint=new ChartStraightLine();

            paint.Color=this.Index[i].LineColor;
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.LongShortData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.LongShortData;
        paint[0].NotSupportMessage=null;
        paint[1].Data.Data[0]=8;
        paint[2].Data.Data[0]=1;

        //指定[0,9]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:9,Min:0,Count:3};

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
            if (i>0) hqChart.TitlePaint[titleIndex].Data[i].DataType="StraightLine";
        }

        return true;
    }

}

//市场择时
function MarketTimingIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Timing');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("因子择时",null)
    );

    this.TimingData; //择时数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=new ChartMACD();
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.LongShortData=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        $.ajax({
            url: g_JSChartResource.Index.MarketLongShortApiUrl,
            data:
            {

            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.data.length<=0) return;

        var aryData=new Array();
        for(var i in recvData.data)
        {
            var item=recvData.data[i];
            var indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[2];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.TimingData=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.TimingData;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
        }

        return true;
    }
}

//融资占比
function MarginRateIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('融资占比');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("融资占比(%)",null)
    );

    this.Index[0].LineColor=g_JSChartResource.Index.LineColor[0];

    this.MarginRate;    //融资占比

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.MarginRate=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        wx.request({
            url: g_JSChartResource.Index.StockHistoryDayApiUrl,
            data:
            {
                "field": ["name","date","symbol"," margin.rate"],
                "condition":
                [
                    { "item": ["margin.rate","double","gte","0.000001"]}
                ],
                "orderfield":"date",
                "symbol": [param.HQChart.Symbol],
            },
            method: 'POST',
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        this.MarginRate=[];
        let data=recvData.data;
        if (data.stock.length<=0) return;

        var aryData=new Array();
        for (var i in data.stock[0].stockday)
        {
          var item = data.stock[0].stockday[i];
            var indexData=new SingleData();
            indexData.Date=item.date;
            indexData.Value=item.margin.rate;
            aryData.push(indexData);
        }

        var aryMarginRate=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryMarginRate;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        if (bindData.Period>0)   //周期数据
        {
            var periodData=bindData.GetPeriodSingleData(bindData.Period);
            bindData.Data=periodData;
        }

        this.MarginRate=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].Data.Data=this.MarginRate;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
        }

        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();
        return true;
    }
}



//市场关注度
function MarketAttentionIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('市场关注度');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("市场关注度指数",null)
    );

    this.Data; //关注度数据
    this.TitleColor=g_JSChartResource.FrameSplitTextColor;
    this.ApiUrl=g_JSChartResource.Index.MarketAttentionApiUrl;

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint = new ChartBar();   //柱子
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            paint.UpBarColor = paint.DownBarColor = 'rgb(243,152,0)';

            hqChart.ChartPaint.push(paint);
        }
    }

    //调整框架
    this.SetFrame=function(hqChart,windowIndex,hisData)
    {
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin={Max:6,Min:0,Count:3};
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        wx.request({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            method: 'POST',
            dataType: "json",
            success: function (recvData)
            {
                self.RecvData(recvData.data,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);
        this.SetFrame(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();

      // if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistroyData', this);
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.TitleColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.THOUSANDS;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=0;
        }

        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();
        return true;
    }
}


/*
    行业,指数热度
*/
function MarketHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('指数/行业热度');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("热度指数",5),
        new IndexInfo('MA',10),
        new IndexInfo('MA',null)
    );

    this.Data; //关注度数据

    this.ApiUrl=g_JSChartResource.Index.MarketHeatApiUrl;

    this.Index[0].LineColor=g_JSChartResource.FrameSplitTextColor;
    this.Index[1].LineColor=g_JSChartResource.Index.LineColor[0];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[1];

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0) 
            {
                paint=new ChartMACD();   //柱子
            }
            else 
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        wx.request({
            url: this.ApiUrl,
            data:
            {
               "symbol":param.HQChart.Symbol,
               "startdate":20100101,
            },
            method: 'POST',
            dataType: "json",
            success: function (recvData)
            {
                self.RecvData(recvData.data,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.date.length<0) return;

        var aryData=new Array();
        for(var i in recvData.date)
        {
            var indexData=new SingleData();
            indexData.Date=recvData.date[i];
            indexData.Value=recvData.value[i];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        paint[0].Data.Data=this.Data;
        paint[0].NotSupportMessage=null;

        var MA=HQIndexFormula.MA(this.Data,this.Index[0].Param);
        paint[1].Data.Data=MA;

        var MA2=HQIndexFormula.MA(this.Data,this.Index[1].Param);
        paint[2].Data.Data=MA2;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            var name="";    //显示的名字特殊处理
            if(i==0)
                name=hqChart.Name+this.Index[i].Name;
            else
                name="MA"+this.Index[i-1].Param;

            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,name,this.Index[i].LineColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat=STRING_FORMAT_TYPE.DEFAULT;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision=2;
        }

        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

        return true;
    }

}

//自定义指数热度
function CustonIndexHeatIndex()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Market-Heat');
    delete this.newMethod;

    this.Index=new Array(
      new IndexInfo('区域', 3),
      new IndexInfo("热度指数", 10),
      new IndexInfo('MA', 5),
      new IndexInfo('MA', 10)
    );

    this.Data; //热度数据

    this.ApiUrl=g_JSChartResource.Index.CustomIndexHeatApiUrl;

    this.Index[1].LineColor = g_JSChartResource.Index.LineColor[1];
    this.Index[2].LineColor=g_JSChartResource.Index.LineColor[2];
    this.Index[3].LineColor=g_JSChartResource.Index.LineColor[3];

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i==0) 
            {
              paint = new ChartStraightArea();
            }
            else 
            {
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name+"-"+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

            hqChart.ChartPaint.push(paint);
        }
    }

    //请求数据
    this.RequestData=function(hqChart,windowIndex,hisData)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
            WindowIndex:windowIndex,
            HistoryData:hisData
        };

        this.Data=[];

        if (param.HQChart.Period>0)   //周期数据
        {
            this.NotSupport(param.HQChart,param.WindowIndex,"不支持周期切换");
            param.HQChart.Draw();
            return false;
        }

        //请求数据
        wx.request({
            url: this.ApiUrl,
            data:
            {
               "stock":param.HQChart.CustomStock,
               "date":{"startdate":param.HQChart.QueryDate.Start,"enddate":param.HQChart.QueryDate.End},
               "day":[this.Index[0].Param,this.Index[1].Param],
            },
            method: 'POST',
            dataType: "json",
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        let data=recvData.data;
        if (data.data==null || data.data.length<0) return;

        //console.log(recvData.data);
        let aryData=new Array();
        for(let i in data.data)
        {
            let item=data.data[i];
            let indexData=new SingleData();
            indexData.Date=item[0];
            indexData.Value=item[1];
            aryData.push(indexData);
        }

        var aryFittingData=param.HistoryData.GetFittingData(aryData);

        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        bindData.Period=param.HQChart.Period;   //周期
        bindData.Right=param.HQChart.Right;     //复权

        this.Data=bindData.GetValue();
        this.BindData(param.HQChart,param.WindowIndex,param.HistoryData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();
    }


    this.BindData=function(hqChart,windowIndex,hisData)
    {
        let paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length != this.Index.length) return false;

        paint[0].NotSupportMessage = null;

        paint[0].Data.Data =
          [
            { Value: 0, Value2: 0.2, Color: 'rgb(46,139,87)', Title: '较差区', TitleColor: 'rgb(245,255 ,250)' },
            { Value: 0.19, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '变热区', TitleColor: 'rgb(245,255 ,250)' },
            { Value: 0.39, Value2: 0.8, Color: 'rgb(255,106,106)', Title: '较好区', TitleColor: 'rgb(245,255 ,250)' },
            { Value: 0.79, Value2: 1, Color: 'rgb(255,69,0)', Title: '过热区', TitleColor: 'rgb(245,255 ,250)' }
          ];

        paint[1].Data.Data = this.Data;

        let MA=HQIndexFormula.MA(this.Data,this.Index[2].Param);
        paint[2].Data.Data=MA;

        let MA2=HQIndexFormula.MA(this.Data,this.Index[3].Param);
        paint[3].Data.Data=MA2;

        //指定框架最大最小[0,1]
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };

        let titleIndex=windowIndex+1;

        for (let i = 1; i < paint.length; ++i) 
        {
          let name = this.Index[i].Name;    //显示的名字特殊处理
          if (name == 'MA') name = "MA" + this.Index[i].Param;

          hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, name, this.Index[i].LineColor);
          hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.DEFAULT;
          hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 2;
        }


        hqChart.TitlePaint[titleIndex].Title='热度'+'('+this.Index[0].Param+','+this.Index[1].Param+','+this.Index[2].Param+','+this.Index[3].Param+')';

        return true;
    }

}

/*
    本福特系数(财务粉饰)
*/
function BenfordIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('财务风险');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo('区域', null),
    new IndexInfo("系数", null),
  );

  this.Data; //财务数据

  this.ApiUrl = g_JSChartResource.Index.StockHistoryDayApiUrl;

  this.Index[0].LineColor = g_JSChartResource.Index.LineColor[0];
  this.Index[1].LineColor = 'rgb(105,105,105)';

  this.Create = function (hqChart, windowIndex) 
  {
    for (var i in this.Index) 
    {
      var paint = null;
      if (i == 0)
          paint = new ChartStraightArea();
      else if (i==1)
         paint = new ChartLineMultiData();

      if (paint)
      {
        paint.Color = this.Index[i].LineColor;
        paint.Canvas = hqChart.Canvas;
        paint.Name = this.Name + "-" + i.toString();
        paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        hqChart.ChartPaint.push(paint);
      }
    }
  }

  //请求数据
  this.RequestData = function (hqChart, windowIndex, hisData) {
    var self = this;
    var param =
      {
        HQChart: hqChart,
        WindowIndex: windowIndex,
        HistoryData: hisData
      };

    this.Data = [];

    if (param.HQChart.Period != 2)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "只支持月线");
      param.HQChart.Draw();
      return false;
    }

    var aryField = ["finance.benford", "announcement2.quarter", "announcement1.quarter", "announcement3.quarter", "announcement4.quarter"];
    var aryCondition =
      [
        { item: ["date", "int32", "gte", "20130101"] },
        {
          item: ["announcement1.year", "int32", "gte", 0,
            "announcement2.year", "int32", "gte", 0,
            "announcement3.year", "int32", "gte", 0,
            "announcement4.year", "int32", "gte", 0,
            "or"]
        }
      ];
    //请求数据
    wx.request({
      url: this.ApiUrl,
      data:
      {
        "symbol": [param.HQChart.Symbol],
        "field": aryField,
        "condition": aryCondition
      },
      method: 'POST',
      dataType: "json",
      success: function (recvData) {
        self.RecvData(recvData, param);
      }
    });

    return true;
  }

  this.JsonDataToMapSingleData = function (recvData) {
    var stockData = recvData.stock[0].stockday;
    var mapData = new Map();
    for (var i in stockData) {
      var item = stockData[i];
      var indexData = new SingleData();
      indexData.Date = item.date;
      indexData.Value = new Array();
      if (item.finance1 != null && item.announcement1 != null) {
        let year = item.announcement1.year;
        let quarter = item.announcement1.quarter;
        let value = item.finance1.benford;
        indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
      }
      if (item.finance2 != null && item.announcement2 != null) {
        let year = item.announcement2.year;
        let quarter = item.announcement2.quarter;
        let value = item.finance2.benford;
        indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
      }
      if (item.finance3 != null && item.announcement3 != null) {
        let year = item.announcement3.year;
        let quarter = item.announcement3.quarter;
        let value = item.finance3.benford;
        indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
      }
      if (item.finance4 != null && item.announcement4 != null) {
        let year = item.announcement4.year;
        let quarter = item.announcement4.quarter;
        let value = item.finance4.benford;
        indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
      }

      mapData.set(indexData.Date, indexData);
    }

    var aryData = new Array();
    for (var item of mapData) {
      aryData.push(item[1]);
    }

    return aryData;
  }

  this.RecvData = function (recvData, param) {
    console.log(recvData);
    if (recvData.data.stock == null || recvData.data.stock.length <= 0) return;

    var aryData = this.JsonDataToMapSingleData(recvData.data);
    var aryFittingData = param.HistoryData.GetFittingMonthData(aryData);

    var bindData = new ChartData();
    bindData.Data = aryFittingData;
    bindData.Period = param.HQChart.Period;   //周期
    bindData.Right = param.HQChart.Right;     //复权

    this.Data = bindData.GetValue();
    this.BindData(param.HQChart, param.WindowIndex, param.HistoryData);

    param.HQChart.UpdataDataoffset();           //更新数据偏移
    param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
    param.HQChart.Draw();
  }


  this.BindData = function (hqChart, windowIndex, hisData) {
    var paint = hqChart.GetChartPaint(windowIndex);

    if (paint.length != this.Index.length) return false;

    paint[0].NotSupportMessage = null;

    paint[0].Data.Data=
    [
      { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '安全区', TitleColor:'rgb(245,255 ,250)'},
      { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '预警区', TitleColor:'rgb(245,255 ,250)'},
      { Value: 0.4, Value2: 1, Color: 'rgb(255,106,106)', Title: '警示区', TitleColor:'rgb(245,255 ,250)'}
    ];
    
    paint[1].Data.Data = this.Data;
    
    //指定框架最大最小[0,1]
    hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };

    var titleIndex = windowIndex + 1;

    hqChart.TitlePaint[titleIndex].Data[1] = new DynamicTitleData(paint[1].Data, this.Index[1].Name, this.Index[1].LineColor);
    hqChart.TitlePaint[titleIndex].Data[1].DataType = "MultiReport";
     
    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

    return true;
  }
}


///////////////////////////////////////////////////////////////////////
//  能图指标
//

/*
    大盘趋势函数
    个股趋势函数

    上线:=SMA(C,6.5,1);
    下线:=SMA(C,13.5,1);
    STICKLINE(上线>下线 , 上线,下线 ,2, 0),COLORRED,LINETHICK2;
    STICKLINE(下线>上线,上线,下线,2,0),COLORBLUE,LINETHICK2;
*/

function LighterIndex1()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('Lighter-Trend');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("STICKLINE",null),
        new IndexInfo('STICKLINE',null)
    );

    this.Index[0].LineColor='rgb(255,0,0)';
    this.Index[1].LineColor='rgb(0,0,255)';

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=new ChartStickLine();
            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name;
            paint.Name=this.Name+'-'+i.toString();
            paint.Color=this.Index[i].LineColor;
            paint.LineWidth=2;
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            hqChart.ChartPaint.push(paint);
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=2) return false;

        var closeData=hisData.GetClose();
        var upData=HQIndexFormula.SMA(closeData,6.5,1);
        var downData=HQIndexFormula.SMA(closeData,13.5,1);

        var stickLine=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(upData,downData),upData,downData);;
        var stickLine2=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(downData,upData),upData,downData);;

        paint[0].Data.Data=stickLine;
        paint[1].Data.Data=stickLine2;

        var titleIndex=windowIndex+1;
        hqChart.TitlePaint[titleIndex].Title="大盘/个股 趋势函数";

        return true;
    }
}

/*
    位置研判函数
    N:=34;M:=3;
    28,COLORFFFFFF;
    STICKLINE(C>0,0,2,5,0),COLOR00008A;
    STICKLINE(C>0,2,5,5,0),COLOR85008A;
    STICKLINE(C>0,5,10,5,0),COLOR657600;
    STICKLINE(C>0,10,21.5,5,0),COLOR690079;
    STICKLINE(C>0,21.5,23,5,0),COLOR79B715;
    STICKLINE(C>0,23,28,5,0),COLOR00008A;
    VAR1:=EMA(100*(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N)),M)/4,COLORFFFF00,LINETHICK2;

    财貌双拳:VAR1,COLORFFFF00,LINETHICK2;
    DRAWTEXT(CURRBARSCOUNT=128,1,'底部区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,3.5,'介入区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,7.5,'稳健区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,16,'高位区域'),COLOR00FFFF;
    DRAWTEXT(CURRBARSCOUNT=128,22,'风险区域'),COLOR0000FF;
    DRAWTEXT(CURRBARSCOUNT=128,25.5,'顶部区域'),COLORFF00FF;
*/

function LighterIndex2()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('位置研判');
    delete this.newMethod;

    this.Index=new Array(
      new IndexInfo("区域",34),
      new IndexInfo('位置研判',3),
    );

    this.Index[0].LineColor='rgb(0,0,138)';
    this.Index[1].LineColor ='rgb(246,46,47)';

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            if (i == 0)
            {
              paint = new ChartStraightArea();
            }
            else
            {
              paint = new ChartLine();
              paint.Color = this.Index[i].LineColor;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name;
            paint.Name=this.Name+'-'+i.toString();
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            hqChart.ChartPaint.push(paint);
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        var closeData=hisData.GetClose();
        var highData=hisData.GetHigh();
        var lowData=hisData.GetLow();

        paint[0].NotSupportMessage = null;

        paint[0].Data.Data =
        [
          { Value: 0, Value2: 2, Color: 'rgb(230,238 ,247)', Title: '底部区域', TitleColor: 'rgb(0,0 ,0)', Align: 'left' },
          { Value: 1.9, Value2: 5, Color: 'rgb(255,255 ,255)', Title: '介入区域', TitleColor: 'rgb(0,0 ,0)', Align: 'left'},
          { Value: 5, Value2: 10, Color: 'rgb(230,238 ,247)', Title: '稳健区域', TitleColor: 'rgb(0,0 ,0)', Align: 'left' },
          { Value: 10, Value2: 21.5, Color: 'rgb(255,255 ,255)', Title: '高位区域', TitleColor: 'rgb(0,0 ,0)', Align: 'left'},
          { Value: 21.4, Value2: 23.5, Color: 'rgb(230,238 ,247)', Title: '风险区域', TitleColor: 'rgb(0,0 ,0)',Align: 'left' },
          { Value: 23, Value2: 28, Color: 'rgb(255,255 ,255)', Title: '顶部区域', TitleColor: 'rgb(0,0 ,0)', Align:'left'}
        ];

        //VAR1:=EMA(100*(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N)),M)/4
        var lineData=HQIndexFormula.ARRAY_DIVIDE(
            HQIndexFormula.EMA(
                HQIndexFormula.ARRAY_MULTIPLY(
                    HQIndexFormula.ARRAY_DIVIDE(
                        HQIndexFormula.ARRAY_SUBTRACT(closeData,HQIndexFormula.LLV(lowData,this.Index[0].Param)),
                        HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.HHV(highData,this.Index[0].Param),HQIndexFormula.LLV(lowData,this.Index[0].Param))
                    ),
                    100),
                this.Index[1].Param),
            4
        );

        paint[1].Data.Data=lineData;

        var titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[0] = new DynamicTitleData(paint[1].Data, '目前处于',paint[1].Color);
        //hqChart.TitlePaint[titleIndex].Data[0].GetTextCallback = this.GetTextCallback;

        hqChart.TitlePaint[titleIndex].Title='位置研判';
        hqChart.TitlePaint[titleIndex].TitleBG ='rgb(242,242,242)';
        hqChart.TitlePaint[titleIndex].TitleAlign='bottom';
        hqChart.TitlePaint[titleIndex].TitleBottomDistance=2; //底部间距设置为2

        if (lineData.length>0)
        {
          let value = lineData[lineData.length-1];
          let text = this.GetTextCallback(value);
          hqChart.TitlePaint[titleIndex].Text=[];
          hqChart.TitlePaint[titleIndex].Text[0] = { Text: ' 目前处于:', Color:'rgb(0,0,0)'};
          hqChart.TitlePaint[titleIndex].Text[1] = text;
        }

        this.InvokeUpdateUICallback(paint);
        
        return true;
    }

    this.GetTextCallback=function(value)
    {
      if (value >= 0 && value <= 2) return { Text: '底部区域', Color:'rgb(255,69,0)'};
      else if (value >= 2 && value <= 5) return { Text: '介入区域', Color: 'rgb(255,69,0)' };
      else if (value >= 5 && value <= 10) return { Text: '稳健区域', Color: 'rgb(255,69,0)' };
      else if (value >= 10 && value <= 21.5) return { Text: '高位区域', Color: 'rgb(255,69,0)' };
      else if (value >= 21.5 && value <= 23.5) return { Text: '风险区域', Color: 'rgb(255,69,0)' };
      else return { Text: '顶部区域', Color: 'rgb(255,69,0)' };
    }
}


/*
    点位研判函数

    HJ_1:=REF(LOW,1);
    HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
    HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
    HJ_4:=LLV(LOW,34);
    HJ_5:=HHV(HJ_3,34);
    HJ_6:=IF(LLV(LOW,56),1,0);
    HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
    HJ_8:=HJ_7>REF(HJ_7,1);
    HJ_9:=REF(LLV(LOW,100),3);
    HJ_10:=REFDATE(HJ_9,DATE);
    HJ_11:=LOW=HJ_10;
    HJ_12:=HJ_8 AND HJ_11;
    HJ_13:=HJ_12>REF(HJ_12,1);
    启动买点:HJ_13>REF(HJ_13,1),COLORRED,LINETHICK1;
*/
function LighterIndex3()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('点位研判函数');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("启动买点",null)
    );

    this.Index[0].LineColor='rgb(255,0,0)';

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        var paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        var closeData=hisData.GetClose();
        var highData=hisData.GetHigh();
        var lowData=hisData.GetLow();

        //HJ_1:=REF(LOW,1);
        var hj_1=HQIndexFormula.REF(lowData,1);

        //HJ_2:=SMA(ABS(LOW-HJ_1),13,1)/SMA(MAX(LOW-HJ_1,0),13,1)*100;
        var hj_2=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.SMA(HQIndexFormula.ABS(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1)),13,1),
                HQIndexFormula.SMA(HQIndexFormula.MAX(HQIndexFormula.ARRAY_SUBTRACT(lowData,hj_1),0),13,1)
            ),
            100
        );

        //HJ_3:=EMA(IF(CLOSE*1.2,HJ_2*13,HJ_2/13),13);
        var hj_3=HQIndexFormula.EMA(
            HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_MULTIPLY(closeData,1.2),HQIndexFormula.ARRAY_MULTIPLY(hj_2,13),HQIndexFormula.ARRAY_DIVIDE(hj_2,13)),
            13
        );
        
        //HJ_4:=LLV(LOW,34);
        var hj_4=HQIndexFormula.LLV(lowData,34);

        //HJ_5:=HHV(HJ_3,34);
        var hj_5=HQIndexFormula.HHV(hj_3,34);

        //HJ_6:=IF(LLV(LOW,56),1,0);
        var hj_6=HQIndexFormula.ARRAY_IF(HQIndexFormula.LLV(lowData,56),1,0);

        //HJ_7:=EMA(IF(LOW<=HJ_4,(HJ_3+HJ_5*2)/2,0),3)/618*HJ_6;
        //hj_7_temp=(HJ_3+HJ_5*2)/2,0)  太长了 这部分单独算下
        var hj_7_temp=HQIndexFormula.ARRAY_DIVIDE(HQIndexFormula.ARRAY_ADD(hj_3,HQIndexFormula.ARRAY_MULTIPLY(hj_5,2)),2);

        var hj_7=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.EMA(
                    HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_LTE(lowData,hj_4),hj_7_temp,0),
                    3
                ),
                618
            ),
            hj_6
        );

        //HJ_8:=HJ_7>REF(HJ_7,1);
        var hj_8=HQIndexFormula.ARRAY_GT(hj_7,HQIndexFormula.REF(hj_7,1));

        //HJ_9:=REF(LLV(LOW,100),3);
        var hj_9=HQIndexFormula.REF(HQIndexFormula.LLV(lowData,100),3);

        //HJ_10:=REFDATE(HJ_9,DATE); 用当日的数据 产生数组
        var hj_10=HQIndexFormula.REFDATE(hj_9,-1);

        //HJ_11:=LOW=HJ_10;
        var hj_11=HQIndexFormula.ARRAY_EQ(lowData,hj_10);

        //HJ_12:=HJ_8 AND HJ_11;
        var hj_12=HQIndexFormula.ARRAY_AND(hj_8,hj_11);
       
        var buyData=null;
        paint[0].Data.Data=hj_12;

        var titleIndex=windowIndex+1;

        for(var i in paint)
        {
            hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
        }

        hqChart.TitlePaint[titleIndex].Title=this.FormatIndexTitle();

        return true;
    }
}

/*
能图-资金分析
M:=55;
N:=34;
LC:=REF(CLOSE,1);
RSI:=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);
FF:=EMA(CLOSE,3);
MA15:=EMA(CLOSE,21); DRAWTEXT(CROSS(85,RSI),75,'▼'),COLORGREEN;
VAR1:=IF(YEAR>=2038 AND MONTH>=1,0,1);
VAR2:=REF(LOW,1)*VAR1;
VAR3:=SMA(ABS(LOW-VAR2),3,1)/SMA(MAX(LOW-VAR2,0),3,1)*100*VAR1;
VAR4:=EMA(IF(CLOSE*1.3,VAR3*10,VAR3/10),3)*VAR1;
VAR5:=LLV(LOW,30)*VAR1;
VAR6:=HHV(VAR4,30)*VAR1;
VAR7:=IF(MA(CLOSE,58),1,0)*VAR1;
VAR8:=EMA(IF(LOW<=VAR5,(VAR4+VAR6*2)/2,0),3)/618*VAR7*VAR1;
吸筹A:IF(VAR8>100,100,VAR8)*VAR1,COLORRED;
吸筹B:STICKLINE(吸筹A>-150,0,吸筹A,8,0),COLORRED;

散户线: 100*(HHV(HIGH,M)-CLOSE)/(HHV(HIGH,M)-LLV(LOW,M)),COLORFFFF00,LINETHICK2;
RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;
K:=SMA(RSV,3,1);
D:=SMA(K,3,1);
J:=3*K-2*D;
主力线:EMA(J,5),COLORFF00FF,LINETHICK2;
DRAWICON(CROSS(主力线,散户线),主力线,1);
DRAWICON(CROSS(散户线,主力线),主力线,2);
*/

function LighterIndex4()
{
    this.newMethod=BaseIndex;   //派生
    this.newMethod('资金分析');
    delete this.newMethod;

    this.Index=new Array(
        new IndexInfo("吸筹",55),
        new IndexInfo("散户线",34),
        new IndexInfo("主力线",null),
        new IndexInfo("吸筹B", null),
    );

    this.Index[0].LineColor='rgb(251,47,59)';
    this.Index[1].LineColor='rgb(170,137,189)';
    this.Index[2].LineColor='rgb(243,152,0)';
    this.Index[3].LineColor='rgb(251,47,59)';

    this.Create=function(hqChart,windowIndex)
    {
        for(var i in this.Index)
        {
            var paint=null;
            switch(this.Index[i].Name)
            {
            case '吸筹':
            case '散户线':
            case '主力线':
                paint=new ChartLine();
                paint.Color=this.Index[i].LineColor;
                break;
            case '吸筹B':
                paint=new ChartStickLine();
                paint.Color=this.Index[i].LineColor;
                paint.LineWidth=8;
                break;
            }

            paint.Canvas=hqChart.Canvas;
            paint.Name=this.Name;
            paint.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
            hqChart.ChartPaint.push(paint);
        }
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        let paint=hqChart.GetChartPaint(windowIndex);

        if (paint.length!=this.Index.length) return false;

        let closeData=hisData.GetClose();
        let highData=hisData.GetHigh();
        let lowData = hisData.GetLow();
        let yearData=hisData.GetYear();
        let monthData=hisData.GetMonth();

        //LC:=REF(CLOSE,1);
        let LC=HQIndexFormula.REF(closeData,1);

        //RSI:=((SMA(MAX((CLOSE - LC),0),3,1) / SMA(ABS((CLOSE - LC)),3,1)) * 100);
        let RSI=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(HQIndexFormula.SMA(HQIndexFormula.MAX(HQIndexFormula.ARRAY_SUBTRACT(closeData,LC),0),3,1),
                                        HQIndexFormula.SMA(HQIndexFormula.ABS(HQIndexFormula.ARRAY_SUBTRACT(closeData,LC)),3,1)),
            100);

        //FF:=EMA(CLOSE,3);
        let FF=HQIndexFormula.EMA(closeData,3);
        //MA15:=EMA(CLOSE,21);
        let MA15=HQIndexFormula.EMA(closeData,21);
        //VAR1:=IF(YEAR>=2038 AND MONTH>=1,0,1);
        let VAR1=HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_ADD(
            HQIndexFormula.ARRAY_GTE(yearData,2038),HQIndexFormula.ARRAY_LTE(monthData,1)),
            0,1);
        //VAR2:=REF(LOW,1)*VAR1;
        let VAR2=HQIndexFormula.ARRAY_MULTIPLY(HQIndexFormula.REF(lowData,1),VAR1);
        //VAR3:=SMA(ABS(LOW-VAR2),3,1)/SMA(MAX(LOW-VAR2,0),3,1)*100*VAR1;
        let VAR3=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.SMA(HQIndexFormula.ABS(HQIndexFormula.ARRAY_SUBTRACT(lowData,VAR2)),3,1),
                HQIndexFormula.SMA(HQIndexFormula.MAX(HQIndexFormula.ARRAY_SUBTRACT(lowData,VAR2),0),3,1)),
            100,VAR1);
        //VAR4:=EMA(IF(CLOSE*1.3,VAR3*10,VAR3/10),3)*VAR1;
        let VAR4=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.EMA(HQIndexFormula.ARRAY_IF(
                HQIndexFormula.ARRAY_MULTIPLY(closeData,1.3),
                HQIndexFormula.ARRAY_MULTIPLY(VAR3,10),
                HQIndexFormula.ARRAY_DIVIDE(VAR3,10)),3),
            VAR1);
        //VAR5:=LLV(LOW,30)*VAR1;
        let VAR5=HQIndexFormula.ARRAY_MULTIPLY(HQIndexFormula.LLV(lowData,30),VAR1);
        //VAR6:=HHV(VAR4,30)*VAR1;
        let VAR6=HQIndexFormula.ARRAY_MULTIPLY(HQIndexFormula.HHV(VAR4,30),VAR1);
        //VAR7:=IF(MA(CLOSE,58),1,0)*VAR1;
        let VAR7=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_IF(HQIndexFormula.MA(closeData,58),1,0),
            VAR1);
        //VAR8:=EMA(IF(LOW<=VAR5,(VAR4+VAR6*2)/2,0),3)/618*VAR7*VAR1;
        let VAR8=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.EMA(
                    HQIndexFormula.ARRAY_IF(
                        HQIndexFormula.ARRAY_LTE(lowData,VAR5),
                        HQIndexFormula.ARRAY_DIVIDE(HQIndexFormula.ARRAY_ADD(HQIndexFormula.ARRAY_MULTIPLY(VAR6,2),VAR4),2),
                        0),
                    3),
                618),
            VAR7,VAR1);

        //吸筹A:IF(VAR8>100,100,VAR8)*VAR1,COLORRED;
        let XiChouA=HQIndexFormula.ARRAY_MULTIPLY(HQIndexFormula.ARRAY_IF(HQIndexFormula.ARRAY_GT(VAR8,100),100,VAR8),VAR1);
        //吸筹B:STICKLINE(吸筹A>-150,0,吸筹A,8,0),COLORRED;
        let XiChouB=HQIndexFormula.STICKLINE(HQIndexFormula.ARRAY_GT(XiChouA,-150),0,XiChouA,0);

        //散户线: 100*(HHV(HIGH,M)-CLOSE)/(HHV(HIGH,M)-LLV(LOW,M)),COLORFFFF00,LINETHICK2;
        let SanHuXian=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.HHV(highData,this.Index[0].Param),closeData),
                HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.HHV(highData,this.Index[0].Param),HQIndexFormula.LLV(lowData,this.Index[0].Param)))
            ,100);

        
        //RSV:=(CLOSE-LLV(LOW,N))/(HHV(HIGH,N)-LLV(LOW,N))*100;
        let RSV=HQIndexFormula.ARRAY_MULTIPLY(
            HQIndexFormula.ARRAY_DIVIDE(
                HQIndexFormula.ARRAY_SUBTRACT(closeData,HQIndexFormula.LLV(lowData,this.Index[1].Param)),
                HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.HHV(highData,this.Index[1].Param),HQIndexFormula.LLV(lowData,this.Index[1].Param)))
            ,100);
        //K:=SMA(RSV,3,1);
        let K=HQIndexFormula.SMA(RSV,3,1);
        //D:=SMA(K,3,1);
        let D=HQIndexFormula.SMA(K,3,1);
        //J:=3*K-2*D;
        let J=HQIndexFormula.ARRAY_SUBTRACT(HQIndexFormula.ARRAY_MULTIPLY(K,3),HQIndexFormula.ARRAY_MULTIPLY(D,2));
        //主力线:EMA(J,5),COLORFF00FF,LINETHICK2;
        let ZhuLiXian=HQIndexFormula.EMA(J,5);

        paint[0].Data.Data=XiChouA;
        paint[1].Data.Data=SanHuXian;
        paint[2].Data.Data=ZhuLiXian;
        paint[3].Data.Data=XiChouB;

        let titleIndex=windowIndex+1;

        for (let i in paint)
        {
          if (i>=3) break;
          hqChart.TitlePaint[titleIndex].Data[i]=new DynamicTitleData(paint[i].Data,this.Index[i].Name,this.Index[i].LineColor);
        }


        // if (XiChouA.length > 0) {
        //   let value = XiChouA[XiChouA.length - 1];
        //   // let text = this.GetTextCallback(value);
        //   console.log("valueoooooo", value)
        //   hqChart.TitlePaint[titleIndex].Text = [];
        //   hqChart.TitlePaint[titleIndex].Text[0] = { Text: ' 吸筹:', Color: 'rgb(251,47,59)' };
        //   hqChart.TitlePaint[titleIndex].Text[1] = { Text: value, Color: 'rgb(251,47,59)' };
        // }



      // hqChart.TitlePaint[titleIndex].Title = this.Name;

        this.InvokeUpdateUICallback(paint);

        return true;
    }
}


/*
    能图-市场关注度
*/

function LighterIndex5()
{
    this.newMethod = MarketAttentionIndex;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Name = '资金关注度';

/*
    this.Index = new Array(
        new IndexInfo('0-2', null),
        new IndexInfo('3-4', null),
        new IndexInfo('5', null),
    );

    //线段颜色 找UI要
    this.Index[0].LineColor = 'rgb(0,0,138)';
    this.Index[1].LineColor = 'rgb(246,46,47)';
    this.Index[2].LineColor = 'rgb(246,46,47)';


    this.Create = function (hqChart, windowIndex) 
    {
        for (var i in this.Index) 
        {
            var paint = new ChartBar();   //柱子
            paint.Canvas = hqChart.Canvas;
            paint.Name = this.Name + "-" + i.toString();
            paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
            paint.UpBarColor = paint.DownBarColor = 'rgb(243,152,0)';

            hqChart.ChartPaint.push(paint);
        }
    }
*/

    this.BindData = function (hqChart, windowIndex, hisData) 
    {
        var paint = hqChart.GetChartPaint(windowIndex);

        if (paint.length != this.Index.length) return false;

        //TODO: 把this.Data 根据 [0-2] ,(2-4] (4-5] 拆成3个数组 赋值给画法 paint[0] - paint[1]

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data = this.Data;
        paint[0].NotSupportMessage = null;

        //把0的数据都换成0.1 这样柱子可以画出来
        for (let i in this.Data)
        {
            var item=this.Data[i];
            if (item == 0) this.Data[i]=0.2;
        }

        var titleIndex = windowIndex + 1;

        for (let i in paint) 
        {
            hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, this.Index[i].Name, this.TitleColor);
            hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.THOUSANDS;
            hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 0;
        }

        hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

        this.InvokeUpdateUICallback(paint);

        return true;
    }
}

/*
    信息地雷
*/

/*
    信息地雷列表
*/
function JSKLineInfoMap()
{
}

JSKLineInfoMap.Get=function(id)
{
    var infoMap=new Map(
        [
            ["互动易",      {Create:function(){ return new InvestorInfo()}  }],
            ["公告",        {Create:function(){ return new AnnouncementInfo()}  }],
            ["业绩预告",    {Create:function(){ return new PforecastInfo()}  }],
            ["调研",        {Create:function(){ return new ResearchInfo()}  }],
            ["大宗交易",    {Create:function(){ return new BlockTrading()}  }],
            ["龙虎榜",      {Create:function(){ return new TradeDetail()}  }]
        ]
        );

    return infoMap.get(id);
}

JSKLineInfoMap.GetIconUrl=function(type)
{
    switch(type)
    {
        case KLINE_INFO_TYPE.INVESTOR:
            return g_JSChartResource.KLine.Info.Investor.Icon;
            break;
        case KLINE_INFO_TYPE.PFORECAST:
            return g_JSChartResource.KLine.Info.Pforecast.Icon;
        case KLINE_INFO_TYPE.ANNOUNCEMENT:
            return g_JSChartResource.KLine.Info.Announcement.Icon;
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3:
        case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4:
            return g_JSChartResource.KLine.Info.Announcement.IconQuarter;
        case KLINE_INFO_TYPE.RESEARCH:
            return g_JSChartResource.KLine.Info.Research.Icon;
        case KLINE_INFO_TYPE.BLOCKTRADING:
            return g_JSChartResource.KLine.Info.BlockTrading.Icon;
        case KLINE_INFO_TYPE.TRADEDETAIL:
            return g_JSChartResource.KLine.Info.TradeDetail.Icon;
        default:
            return g_JSChartResource.KLine.Info.Announcement.Icon;
    }
}


function IKLineInfo()
{
    this.MaxReqeustDataCount=1000;
    this.StartDate=20160101;
    this.Data;

    this.GetToday=function()
    {
        var date=new Date();
        var today=date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
        return today;
    }
}


/*
    互动易
*/
function InvestorInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Investor.ApiUrl,
            data:
            {
                "filed": ["question","answerdate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.list.length<=0) return;

        for(var i in recvData.list)
        {
            var item=recvData.list[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.answerdate;
            infoData.Title=item.question;
            infoData.InfoType=KLINE_INFO_TYPE.INVESTOR;
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    公告
*/
function AnnouncementInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Announcement.ApiUrl,
            data:
            {
                "filed": ["title","releasedate","symbol","id"],
                "symbol": [param.HQChart.Symbol],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.report.length<=0) return;

        for(var i in recvData.report)
        {
            var item=recvData.report[i];
            var infoData=new KLineInfoData();
            infoData.Date=item.releasedate;
            infoData.Title=item.title;
            infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT;
            for(var j in item.type)
            {
                var typeItem=item.type[j];
                switch(typeItem)
                {
                    case "一季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1;
                        break;
                    case "半年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2;
                        break;
                    case "三季度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3;
                        break;
                    case "年度报告":
                        infoData.InfoType=KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4;
                        break;
                }
            }
            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    业绩预告
*/
function PforecastInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Pforecast.ApiUrl,
            data:
            {
                "field": ["pforecast.type","pforecast.reportdate","fweek"],
                "condition":
                [
                    {"item":["pforecast.reportdate","int32","gte",this.StartDate]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];
            if (item.pforecast.length>0)
            {
                var dataItem=item.pforecast[0];
                var infoData=new KLineInfoData();
                infoData.Date= item.date;
                infoData.Title=dataItem.type;
                infoData.InfoType=KLINE_INFO_TYPE.PFORECAST;
                infoData.ExtendData={ Type:dataItem.type, ReportDate:dataItem.reportdate}
                if(item.fweek)  //未来周涨幅
                {
                    infoData.ExtendData.FWeek={};
                    if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                    if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
                }
                this.Data.push(infoData);
            }
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
   投资者关系 (调研)
*/
function ResearchInfo()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.Research.ApiUrl,
            data:
            {
                "filed": ["releasedate","researchdate","level","symbol","id"],
                "querydate":{"StartDate":this.StartDate,"EndDate":this.GetToday()},
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.list.length<=0) return;

        for(var i in recvData.list)
        {
            var item=recvData.list[i];
            var infoData=new KLineInfoData();
            infoData.ID=item.id;
            infoData.Date= item.researchdate;
            infoData.InfoType=KLINE_INFO_TYPE.RESEARCH;
            infoData.ExtendData={ Level:item.level };
            this.Data.push(infoData);

        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

/*
    大宗交易
*/
function BlockTrading()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.BlockTrading.ApiUrl,
            data:
            {
                "field": ["blocktrading.price","blocktrading.vol","blocktrading.premium","fweek","price"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["blocktrading.vol","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];
            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.BLOCKTRADING;
            infoData.ExtendData=
            {
                Price:item.blocktrading.price,          //交易价格
                Premium:item.blocktrading.premium,      //溢价 （百分比%)
                Vol:item.blocktrading.vol,              //交易金额单位（万元)
                ClosePrice:item.price,                  //收盘价
            };

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}


/*
    龙虎榜
*/
function TradeDetail()
{
    this.newMethod=IKLineInfo;   //派生
    this.newMethod();
    delete this.newMethod;

    this.RequestData=function(hqChart)
    {
        var self = this;
        var param=
        {
            HQChart:hqChart,
        };

        this.Data=[];

        //请求数据
        $.ajax({
            url: g_JSChartResource.KLine.Info.TradeDetail.ApiUrl,
            data:
            {
                "field": ["tradedetail.typeexplain","tradedetail.type","fweek"],
                "condition":
                [
                    {"item":["date","int32","gte",this.StartDate]},
                    {"item":["tradedetail.type","int32","gte","0"]}
                ],
                "symbol": [param.HQChart.Symbol],
                "start":0,
                "end":this.MaxReqeustDataCount,
            },
            type:"post",
            dataType: "json",
            async:true,
            success: function (recvData)
            {
                self.RecvData(recvData,param);
            }
        });

        return true;
    }

    this.RecvData=function(recvData,param)
    {
        if (recvData.stock.length!=1) return;
        if (recvData.stock[0].stockday.length<=0) return;

        for(var i in recvData.stock[0].stockday)
        {
            var item=recvData.stock[0].stockday[i];

            var infoData=new KLineInfoData();
            infoData.Date= item.date;
            infoData.InfoType=KLINE_INFO_TYPE.TRADEDETAIL;
            infoData.ExtendData={Detail:new Array()};

            for(var j in item.tradedetail)
            {
                var tradeItem=item.tradedetail[j]; 
                infoData.ExtendData.Detail.push({"Type":tradeItem.type,"TypeExplain":tradeItem.typeexplain});
            }

            if(item.fweek)  //未来周涨幅
            {
                infoData.ExtendData.FWeek={};
                if (item.fweek.week1!=null) infoData.ExtendData.FWeek.Week1=item.fweek.week1;
                if (item.fweek.week4!=null) infoData.ExtendData.FWeek.Week4=item.fweek.week4;
            }

            this.Data.push(infoData);
        }

        param.HQChart.UpdataChartInfo();
        param.HQChart.Draw();
    }
}

//是否是指数代码
function IsIndexSymbol(symbol)
{
    var upperSymbol=symbol.toUpperCase();
    if (upperSymbol.indexOf('.SH')>0)
    {
        upperSymbol=upperSymbol.replace('.SH','');
        if (upperSymbol.charAt(0)=='0' && parseInt(upperSymbol)<=3000) return true;

    }
    else if (upperSymbol.indexOf('.SZ')>0)
    {
        upperSymbol=upperSymbol.replace('.SZ','');
        if (upperSymbol.charAt(0)=='3' && upperSymbol.charAt(1)=='9') return true;
    }
    else if (upperSymbol.indexOf('.CI')>0)  //自定义指数
    {
        return true;
    }

    return false;
}


//导出统一使用JSCommon命名空间名
module.exports=
{
    JSCommon:
    {
        JSCanvasElement:JSCanvasElement,
        JSChart:JSChart,
        Guid:Guid,
        IFrameSplitOperator: IFrameSplitOperator,
    }
};



