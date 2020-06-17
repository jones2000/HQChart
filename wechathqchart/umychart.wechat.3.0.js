/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    封装图形控件 (微信小程序版本)
*/

//行情数据结构体 及涉及到的行情算法(复权,周期等) 
import {
    JSCommon_ChartData as ChartData, JSCommon_HistoryData as HistoryData,
    JSCommon_SingleData as SingleData, JSCommon_MinuteData as MinuteData,
    JSCommon_CUSTOM_DAY_PERIOD_START as CUSTOM_DAY_PERIOD_START,
    JSCommon_CUSTOM_DAY_PERIOD_END as CUSTOM_DAY_PERIOD_END,
    JSCommon_CUSTOM_MINUTE_PERIOD_START as CUSTOM_MINUTE_PERIOD_START,
    JSCommon_CUSTOM_MINUTE_PERIOD_END as CUSTOM_MINUTE_PERIOD_END,
    JSCommon_CUSTOM_SECOND_PERIOD_START as CUSTOM_SECOND_PERIOD_START,
    JSCommon_CUSTOM_SECOND_PERIOD_END as CUSTOM_SECOND_PERIOD_END,
    JSCommon_Rect as Rect,
    JSCommon_DataPlus as DataPlus,
} from "./umychart.data.wechat.js";

import {
    JSCommon_JSKLineInfoMap as JSKLineInfoMap, 
    JSCommon_KLINE_INFO_TYPE as KLINE_INFO_TYPE, 
    JSCommon_JSMinuteInfoMap as JSMinuteInfoMap,
} from "./umychart.klineinfo.wechat.js";

import 
{ 
    JSCommonCoordinateData as JSCommonCoordinateData,
    JSCommonCoordinateData_MARKET_SUFFIX_NAME as MARKET_SUFFIX_NAME 
} from "./umychart.coordinatedata.wechat.js";

import { JSCommonComplier } from "./umychart.complier.wechat.js";     //通达信编译器
import { JSCommonIndexScript } from "./umychart.index.data.wechat.js"; //系统指标定义
import { JSCommon_HQIndexFormula as HQIndexFormula } from "./umychart.hqIndexformula.wechat.js";     //通达信编译器

//图形库
import {
    JSCommonChartPaint_IChartPainting as IChartPainting, 
    JSCommonChartPaint_ChartSingleText as ChartSingleText, 
    JSCommonChartPaint_ChartKLine as ChartKLine,
    JSCommonChartPaint_ChartLine as ChartLine,
    JSCommonChartPaint_ChartSubLine as ChartSubLine,
    JSCommonChartPaint_ChartPointDot as ChartPointDot, 
    JSCommonChartPaint_ChartStick as ChartStick,
    JSCommonChartPaint_ChartLineStick as ChartLineStick,
    JSCommonChartPaint_ChartStickLine as ChartStickLine,
    JSCommonChartPaint_ChartOverlayKLine as ChartOverlayKLine,
    JSCommonChartPaint_ChartMinuteInfo as ChartMinuteInfo,
    JSCommonChartPaint_ChartRectangle as ChartRectangle,
    JSCommonChartPaint_ChartMultiText as ChartMultiText,
    JSCommonChartPaint_ChartMultiLine as ChartMultiLine,
    JSCommonChartPaint_ChartMultiBar as ChartMultiBar,
    JSCommonChartPaint_ChartPie as ChartPie,
    JSCommonChartPaint_ChartCircle as ChartCircle,
    JSCommonChartPaint_ChartChinaMap as ChartChinaMap,
    JSCommonChartPaint_ChartRadar as ChartRadar,
    JSCommonChartPaint_ChartCorssCursor as ChartCorssCursor,
    JSCommonChartPaint_ChartBuySell as ChartBuySell,
} from "./umychart.chartpaint.wechat.js";

//扩展画法图形库
import {
    JSCommonExtendChartPaint_IExtendChartPainting as IExtendChartPainting,
    JSCommonExtendChartPaint_KLineTooltipPaint as KLineTooltipPaint, 
    JSCommonExtendChartPaint_BarragePaint as BarragePaint,
    JSCommonExtendChartPaint_MinuteTooltipPaint as MinuteTooltipPaint,
    JSCommonExtendChartPaint_BackgroundPaint as BackgroundPaint,
} from "./umychart.extendchart.wechat.js";

import {
    JSCommonIndex_IndexInfo as IndexInfo,
    JSCommonIndex_BaseIndex as BaseIndex,
} from './umychart.index.wechat.js'

import{
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
    JSCommonResource_JSCHART_LANGUAGE_ID as JSCHART_LANGUAGE_ID,
    JSCommonResource_Global_JSChartLocalization as g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import { JSCommonUniApp } from './umychart.uniapp.canvas.helper.js'

import 
{ 
    JSCommonSplit_CoordinateInfo as CoordinateInfo,
    JSCommonSplit_IFrameSplitOperator as IFrameSplitOperator,
    JSCommonSplit_FrameSplitKLinePriceY as FrameSplitKLinePriceY,
    JSCommonSplit_FrameSplitY as FrameSplitY,
    JSCommonSplit_FrameSplitKLineX as FrameSplitKLineX,
    JSCommonSplit_FrameSplitMinutePriceY as FrameSplitMinutePriceY,
    JSCommonSplit_FrameSplitMinuteX as FrameSplitMinuteX,
    JSCommonSplit_FrameSplitXData as FrameSplitXData,
    JSCommonSplit_SplitData as SplitData,
    JSCommonSplit_PriceSplitData as PriceSplitData,
} from './umychart.framesplit.wechat.js'

import
{
    JSCommonChartTitle_IChartTitlePainting as IChartTitlePainting, 
    JSCommonChartTitle_DynamicKLineTitlePainting as DynamicKLineTitlePainting,
    JSCommonChartTitle_DynamicMinuteTitlePainting as DynamicMinuteTitlePainting,
    JSCommonChartTitle_DynamicChartTitlePainting as DynamicChartTitlePainting,
    JSCommonChartTitle_DynamicTitleData as DynamicTitleData,
    JSCommonChartTitle_STRING_FORMAT_TYPE as STRING_FORMAT_TYPE,
} from './umychart.charttitle.wechat.js'


function JSCanvasElement() 
{
    this.Height;
    this.Width;
    this.ID;
    this.WebGLCanvas;
    this.IsUniApp=false;
    this.CanvasNode=null;

    //获取画布
    this.GetContext = function () 
	{
        var canvas;
        if (this.CanvasNode && this.CanvasNode.node) 
        {
            const width = this.CanvasNode.width;
            const height = this.CanvasNode.height;

            var node = this.CanvasNode.node;
            node._height = height;
            node._width = width;
            console.log("[JSCanvasElement::GetContext] create by getContext('2d')");
            canvas = node.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio;
            node.width = width * dpr;
            node.height = height * dpr;
            canvas.scale(dpr, dpr);
            canvas.draw = (bDraw, callback) => { if (callback) callback(); };
            canvas.DomNode = node;
        }
        else 
        {
            canvas=wx.createCanvasContext(this.ID);
        }

        if (this.IsUniApp)
        {
            console.log('[JSCanvasElement::GetContext] measureText() => JSUniAppCanvasHelper.MeasureText()');
            canvas.measureText = function (text) //uniapp 计算宽度需要自己计算
            {
                var width = JSCommonUniApp.JSUniAppCanvasHelper.MeasureText(text, canvas);
                return { width: width };
            }
			
			canvas.fillText_backup=canvas.fillText;	//uniapp fillText 填了最大长度就会失真, 所以去掉
			canvas.fillText=function(text,x,y,maxWidth)
			{
				canvas.fillText_backup(text,x,y);
			}
			
        }

        return canvas;
    }

    this.GetWebGLCanvas=function(id)
    {
        var self=this;
        const query = wx.createSelectorQuery();
        query.select(id).node().exec((res) => {
            console.log('[JSCanvasElement::GetWebGLCanvas] res ', res)
            self.WebGLCanvas = res[0].node;
        })
    }
}

function JSChart(element) 
{
    this.JSChartContainer;              //画图控件
    this.CanvasElement = element;

    this.AddEventCallback = function (obj)   //事件回调  {event:事件id, callback:回调函数}
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.AddEventCallback) == 'function') 
        {
            console.log('[JSChart:AddEventCallback] ', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    this.OnSize = function () 
    {
        if (this.JSChartContainer && this.JSChartContainer.Frame) this.JSChartContainer.Frame.SetSizeChage(true);
        if (this.JSChartContainer) this.JSChartContainer.Draw();
    }

    //历史K线图
    this.CreateKLineChartContainer = function (option) 
    {
        var chart = null;
        if (option.Type === "历史K线图横屏") chart = new KLineChartHScreenContainer(this.CanvasElement);
        else chart = new KLineChartContainer(this.CanvasElement);

        if (option.NetworkFilter) chart.NetworkFilter = option.NetworkFilter;

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.DragMode >= 0) chart.DragMode = option.KLine.DragMode;
            if (option.KLine.Right >= 0) chart.Right = option.KLine.Right;
            if (option.KLine.Period >= 0) chart.Period = option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount > 0) chart.MaxReqeustDataCount = option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length > 0) chart.SetKLineInfo(option.KLine.Info, false);
            if (option.KLine.Policy && option.KLine.Policy.length > 0) chart.SetPolicyInfo(option.KLine.Policy, false);
            if (option.KLine.KLineDoubleClick == false) chart.MinuteDialog = this.MinuteDialog = null;
            if (option.KLine.MaxRequestMinuteDayCount > 0) chart.MaxRequestMinuteDayCount = option.KLine.MaxRequestMinuteDayCount;
            if (option.KLine.DrawType) chart.KLineDrawType = option.KLine.DrawType;
            if (option.KLine.RightSpaceCount > 0) chart.RightSpaceCount = option.KLine.RightSpaceCount;
        }

        if (option.SplashTitle) chart.SplashTitle = option.SplashTitle; //设置提示信息内容
        if (!option.Windows || option.Windows.length <= 0) return null;

        if (option.Language) 
        {
            if (option.Language === 'CN') chart.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
            else if (option.Language === 'EN') chart.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_ENGLISH_ID;
        }

        if (option.SourceDatatLimit) chart.SetSourceDatatLimit(option.SourceDatatLimit);

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border) 
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
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
            if (option.KLine.InfoDrawType) chart.ChartPaint[0].InfoDrawType = option.KLine.InfoDrawType;
        }

        if (option.DragDownload)
        {
            if (option.DragDownload.Day && option.DragDownload.Day.Enable == true) chart.DragDownload.Day.Enable = true;
            if (option.DragDownload.Minute && option.DragDownload.Minute.Enable == true) chart.DragDownload.Minute.Enable = true;
        }

        if (option.IsApiPeriod == true) chart.IsApiPeriod = option.IsApiPeriod;

        if (option.CorssCursorTouchEnd == true) chart.CorssCursorTouchEnd = option.CorssCursorTouchEnd;
        if (option.IsClickShowCorssCursor == true) chart.IsClickShowCorssCursor = option.IsClickShowCorssCursor;
        if (option.IsFullDraw == true) chart.IsFullDraw = option.IsFullDraw;
        if (option.CorssCursorInfo) 
        {
            if (!isNaN(option.CorssCursorInfo.Left)) chart.ChartCorssCursor.ShowTextMode.Left = option.CorssCursorInfo.Left;
            if (!isNaN(option.CorssCursorInfo.Right)) chart.ChartCorssCursor.ShowTextMode.Right = option.CorssCursorInfo.Right;
            if (!isNaN(option.CorssCursorInfo.Bottom)) chart.ChartCorssCursor.ShowTextMode.Bottom = option.CorssCursorInfo.Bottom;
            if (option.CorssCursorInfo.IsShowCorss === false) chart.ChartCorssCursor.IsShowCorss = option.CorssCursorInfo.IsShowCorss;
            if (option.CorssCursorInfo.IsShowClose == true) chart.ChartCorssCursor.IsShowClose = option.CorssCursorInfo.IsShowClose;    //Y轴显示收盘价
            if (option.CorssCursorInfo.HPenType > 0) chart.ChartCorssCursor.HPenType = option.CorssCursorInfo.HPenType;
            if (option.CorssCursorInfo.VPenType > 0) chart.ChartCorssCursor.VPenType = option.CorssCursorInfo.VPenType;
        }

        if (typeof (option.UpdateUICallback) == 'function') //数据到达回调
        chart.UpdateUICallback = option.UpdateUICallback;

        if (option.Frame) 
        {
            for (var i in option.Frame) 
            {
                var item = option.Frame[i];
                if (!chart.Frame.SubFrame[i]) continue;
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat = item.StringFormat;
                if (!isNaN(item.Height)) chart.Frame.SubFrame[i].Height = item.Height;
                if (item.IsShowBorder == false) chart.Frame.SubFrame[i].Frame.IsShowBorder = item.IsShowBorder;
                if (item.IsShowXLine == false) chart.Frame.SubFrame[i].Frame.IsShowXLine = item.IsShowXLine;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
                if (item.IsShowTitle == false) chart.Frame.SubFrame[i].Frame.IsShowTitle = false;
                if (item.UpdateTitleUICallback && chart.Frame.SubFrame[i].Frame.TitlePaint) chart.Frame.SubFrame[i].Frame.TitlePaint.UpdateUICallback = item.UpdateTitleUICallback;
                if (item.IsShowLeftText === false || item.IsShowLeftText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[0] = item.IsShowLeftText;            //显示左边刻度
                if (item.IsShowRightText === false || item.IsShowRightText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[1] = item.IsShowRightText;         //显示右边刻度 
                if (item.TopSpace >= 0) chart.Frame.SubFrame[i].Frame.ChartBorder.TopSpace = item.TopSpace;
                if (item.BottomSpace >= 0) chart.Frame.SubFrame[i].Frame.ChartBorder.BottomSpace = item.BottomSpace;
                if (item.Custom) chart.Frame.SubFrame[i].Frame.YSplitOperator.Custom = item.Custom;
                if (IFrameSplitOperator.IsNumber(item.SplitType)) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitType = item.SplitType;
                if (IFrameSplitOperator.IsNumber(item.FloatPrecision)) chart.Frame.SubFrame[i].Frame.YSplitOperator.FloatPrecision = item.FloatPrecision;   //强制指定小数位数(主图有效)
            }
        }

        if (option.KLine)
        {
            if (option.KLine.ShowKLine == false) chart.ChartPaint[0].IsShow = false;
            if (option.KLine.IsShowMaxMinPrice == false) chart.ChartPaint[0].IsShowMaxMinPrice = false;
        }

        if (option.KLineTitle) 
        {
            if (option.KLineTitle.IsShowName == false) chart.TitlePaint[0].IsShowName = false;
            if (option.KLineTitle.IsShowSettingInfo == false) chart.TitlePaint[0].IsShowSettingInfo = false;
            if (option.KLineTitle.IsShow == false) chart.TitlePaint[0].IsShow = false;
            if (option.KLineTitle.UpdateUICallback) chart.TitlePaint[0].UpdateUICallback = option.KLineTitle.UpdateUICallback
            if (option.KLineTitle.LineCount > 1) chart.TitlePaint[0].LineCount = option.KLineTitle.LineCount;
        }

        //叠加股票 只支持叠加1个股票
        for (var i in option.Overlay)
        {
            var item = option.Overlay[i];
            if (item.Symbol) 
            {
                chart.OverlayChartPaint[0].Symbol = item.Symbol;
                if (item.Color) chart.OverlayChartPaint[0].Color=item.Color;
                chart.OverlayChartPaint[0].SetOption(item);
                break;
            }
        }

        if (option.ExtendChart) //创建扩展画法
        {
            for (var i in option.ExtendChart) 
            {
                var item = option.ExtendChart[i];
                chart.CreateExtendChart(item.Name, item);
            }
        }

        let scriptData = new JSCommonIndexScript.JSIndexScript();   //系统指标

        if (option.ColorIndex)    //五彩K线
        {
            var item = option.ColorIndex;
            let indexInfo = scriptData.Get(item.Index);
            if (indexInfo) chart.ColorIndex = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
        }

        if (option.TradeIndex)  //交易指标
        {
            var item = option.TradeIndex;
            let indexInfo = scriptData.Get(item.Index);
            if (indexInfo) chart.TradeIndex = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
        }

        for (var i in option.Windows) //创建子窗口的指标
        {
            var item = option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[i] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
            }
            else if (item.API)  //使用API挂接指标数据 API:{ Name:指标名字, Script:指标脚本可以为空, Args:参数可以为空, Url:指标执行地址 }
            {
                var apiItem = item.API;
                chart.WindowIndex[i] = new APIScriptIndex(apiItem.Name, apiItem.Script, apiItem.Args, item);
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
                    indexInfo.ID = item.Index;
                    var args = indexInfo.Args;
                    if (item.Args) args = item.Args;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, args, indexInfo);    //脚本执行
                    if (item.StringFormat > 0) chart.WindowIndex[i].StringFormat = item.StringFormat;
                    if (item.FloatPrecision >= 0) chart.WindowIndex[i].FloatPrecision = item.FloatPrecision;
                }
            }

            if (item.Modify != null) chart.Frame.SubFrame[i].Frame.ModifyIndex = item.Modify;
            if (item.Change != null) chart.Frame.SubFrame[i].Frame.ChangeIndex = item.Change;
            if (typeof (item.UpdateUICallback) == 'function') chart.WindowIndex[i].UpdateUICallback = item.UpdateUICallback;
            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight = item.TitleHeight;
            if (item.IsShowIndexName == false) chart.Frame.SubFrame[i].Frame.IsShowIndexName = false;
            if (item.IndexParamSpace >= 0) chart.Frame.SubFrame[i].Frame.IndexParamSpace = item.IndexParamSpace;
        }

        return chart;
    }

  //自定义指数历史K线图
  this.CreateCustomKLineChartContainer = function (option) {
    var chart = new CustomKLineChartContainer(this.CanvasElement);

    if (option.KLine)   //k线图的属性设置
    {
      if (option.KLine.DragMode >= 0) chart.DragMode = option.KLine.DragMode;
      if (option.KLine.Right >= 0) chart.Right = option.KLine.Right;
      if (option.KLine.Period >= 0) chart.Period = option.KLine.Period;
      if (option.KLine.MaxReqeustDataCount > 0) chart.MaxReqeustDataCount = option.KLine.MaxReqeustDataCount;
      if (option.KLine.Info && option.KLine.Info.length > 0) chart.SetKLineInfo(option.KLine.Info, false);
      if (option.KLine.KLineDoubleClick == false) chart.MinuteDialog = this.MinuteDialog = null;
      if (option.KLine.PageSize > 0) chart.PageSize = option.KLine.PageSize;
      if (option.KLine.IsShowTooltip == false) chart.IsShowTooltip = false;
    }

    if (option.CustomStock) chart.CustomStock = option.CustomStock;
    if (option.QueryDate) chart.QueryDate = option.QueryDate;
    if (typeof (option.UpdateUICallback) == 'function') chart.UpdateUICallback = option.UpdateUICallback;

    if (!option.Windows || option.Windows.length <= 0) return null;

    //创建子窗口
    chart.Create(option.Windows.length);

    if (option.Border) {
      if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
      if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
      if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
      if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;

    }

    if (option.IsShowCorssCursorInfo == false)    //取消显示十字光标刻度信息
    {
      chart.ChartCorssCursor.IsShowText = option.IsShowCorssCursorInfo;
    }

    if (option.Frame) {
      for (var i in option.Frame) {
        var item = option.Frame[i];
        if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = item.SplitCount;
        if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat = item.StringFormat;
        if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
      }
    }

    if (option.KLineTitle) {
      if (option.KLineTitle.IsShowName == false) chart.TitlePaint[0].IsShowName = false;
      if (option.KLineTitle.IsShowSettingInfo == false) chart.TitlePaint[0].IsShowSettingInfo = false;
    }

    //创建子窗口的指标
    let scriptData = new JSCommonIndexScript.JSIndexScript();
    for (var i in option.Windows) {
      var item = option.Windows[i];
      if (item.Script) {
        chart.WindowIndex[i] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
      }
      else {
        var indexItem = JSIndexMap.Get(item.Index);
        if (indexItem) {
          chart.WindowIndex[i] = indexItem.Create();
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

      if (item.Modify != null)
        chart.Frame.SubFrame[i].Frame.ModifyIndex = item.Modify;
      if (item.Change != null)
        chart.Frame.SubFrame[i].Frame.ChangeIndex = item.Change;

      if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight = item.TitleHeight;
    }

    return chart;
  }

    //分钟走势图
    this.CreateMinuteChartContainer = function (option) 
    {
        var chart = null;
        if (option.Type === "分钟走势图横屏") chart = new MinuteChartHScreenContainer(this.CanvasElement);
        else chart = new MinuteChartContainer(this.CanvasElement);
        if (option.NetworkFilter) chart.NetworkFilter = option.NetworkFilter;

        var windowsCount = 2;
        if (option.Windows && option.Windows.length > 0) windowsCount += option.Windows.length; //指标窗口从第3个窗口开始

        if (option.Info && option.Info.length > 0) chart.SetMinuteInfo(option.Info, false);
        if (option.SplashTitle) chart.SplashTitle = option.SplashTitle; //设置提示信息内容

        if (option.Language) 
        {
            if (option.Language === 'CN') chart.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
            else if (option.Language === 'EN') chart.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_ENGLISH_ID;
        }

        chart.Create(windowsCount);                            //创建子窗口

        if (option.CorssCursorTouchEnd == true) chart.CorssCursorTouchEnd = option.CorssCursorTouchEnd;
        if (option.IsFullDraw == true) chart.IsFullDraw = option.IsFullDraw;
        if (option.CorssCursorInfo)     //十字光标设置
        {
            if (!isNaN(option.CorssCursorInfo.Left)) chart.ChartCorssCursor.ShowTextMode.Left = option.CorssCursorInfo.Left;
            if (!isNaN(option.CorssCursorInfo.Right)) chart.ChartCorssCursor.ShowTextMode.Right = option.CorssCursorInfo.Right;
            if (!isNaN(option.CorssCursorInfo.Bottom)) chart.ChartCorssCursor.ShowTextMode.Bottom = option.CorssCursorInfo.Bottom;
            if (option.CorssCursorInfo.IsShowCorss === false) chart.ChartCorssCursor.IsShowCorss = option.CorssCursorInfo.IsShowCorss;
        }

        if (option.MinuteInfo) chart.CreateMinuteInfo(option.MinuteInfo);
        if (option.DayCount > 1) chart.DayCount = option.DayCount;

        if (option.Border) 
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.Frame) 
        {
            for (var i in option.Frame) 
            {
                var item = option.Frame[i];
                if (!chart.Frame.SubFrame[i]) continue;
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat = item.StringFormat;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
                if (item.IsShowLeftText === false || item.IsShowLeftText===true ) chart.Frame.SubFrame[i].Frame.IsShowYText[0] = item.IsShowLeftText;            //显示左边刻度
                if (item.IsShowRightText === false || item.IsShowRightText===true) chart.Frame.SubFrame[i].Frame.IsShowYText[1] = item.IsShowRightText;         //显示右边刻度
                if (item.Height >= 0) chart.Frame.SubFrame[i].Height = item.Height; 
                if (item.Custom) chart.Frame.SubFrame[i].Frame.YSplitOperator.Custom = item.Custom;
            }
        }

        if (option.MinuteTitle) 
        {
            if (option.MinuteTitle.IsShowName == false) chart.TitlePaint[0].IsShowName = false;
            if (option.MinuteTitle.IsShow == false) chart.TitlePaint[0].IsShow = false;
            if (option.MinuteTitle.UpdateUICallback) chart.TitlePaint[0].UpdateUICallback = option.MinuteTitle.UpdateUICallback
            if (option.MinuteTitle.LineCount > 1) chart.TitlePaint[0].LineCount = option.MinuteTitle.LineCount;
        }

        if (typeof (option.UpdateUICallback) == 'function') //数据到达回调
            chart.UpdateUICallback = option.UpdateUICallback;

        if (option.ExtendChart) //创建扩展画法
        {
            for (var i in option.ExtendChart) {
                var item = option.ExtendChart[i];
                chart.CreateExtendChart(item.Name, item);
            }
        }

        //叠加股票 只支持1只股票
        for (var i in option.Overlay)
        {
            var item = option.Overlay[i];
            if (item.Symbol)
            {
                chart.OverlayChartPaint[0].Symbol = item.Symbol;
                if (item.Color) chart.OverlayChartPaint[0].Color = item.Color;
                break;
            }
        }
        if (option.Overlay && option.Overlay.length) 
        {
            chart.OverlayChartPaint[0].Symbol = option.Overlay[0].Symbol;
        }

        if (option.MinuteLine) 
        {
            if (option.MinuteLine.IsDrawAreaPrice == false) chart.ChartPaint[0].IsDrawArea = false;
            if (option.MinuteLine.IsShowAveragePrice == false) chart.ChartPaint[1].IsShow = false;
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
                    var args = indexInfo.Args;
                    if (item.Args) args = item.Args;
                    if (item.Lock) indexInfo.Lock = item.Lock;
                    chart.WindowIndex[2 + parseInt(i)] = new ScriptIndex(indexInfo.Name, indexInfo.Script, args, indexInfo);    //脚本执行
                    if (item.StringFormat > 0) chart.WindowIndex[2 + parseInt(i)].StringFormat = item.StringFormat;
                    if (item.FloatPrecision >= 0) chart.WindowIndex[2 + parseInt(i)].FloatPrecision = item.FloatPrecision;
                }
            }

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[2 + parseInt(i)].Frame.ChartBorder.TitleHeight = item.TitleHeight;   //指标标题高度
        }

        return chart;
    }

  //历史分钟走势图
  this.CreateHistoryMinuteChartContainer = function (option) {
    var chart = new HistoryMinuteChartContainer(this.CanvasElement);

    var windowsCount = 2;
    if (option.Windows && option.Windows.length > 0) windowsCount += option.Windows.length; //指标窗口从第3个窗口开始

    chart.Create(windowsCount);                            //创建子窗口

    if (option.IsShowCorssCursorInfo == false)    //取消显示十字光标刻度信息
    {
      chart.ChartCorssCursor.IsShowText = option.IsShowCorssCursorInfo;
    }

    if (option.Border) {
      if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
      if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
      if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
      if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
    }

    if (option.Frame) {
      for (var i in option.Frame) {
        var item = option.Frame[i];
        if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = item.SplitCount;
        if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat = item.StringFormat;
        if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
      }
    }

    let scriptData = new JSCommonIndexScript.JSIndexScript();
    for (var i in option.Windows)   //分钟数据指标从第3个指标窗口设置
    {
      var item = option.Windows[i];
      if (item.Script) {
        chart.WindowIndex[2 + parseInt(i)] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
      }
      else {
        var indexItem = JSIndexMap.Get(item.Index);
        if (indexItem) {
          chart.WindowIndex[2 + parseInt(i)] = indexItem.Create();       //创建子窗口的指标
          chart.CreateWindowIndex(2 + parseInt(i));
        }
        else {
          let indexInfo = scriptData.Get(item.Index);
          if (!indexInfo) continue;

          if (item.Lock) indexInfo.Lock = item.Lock;
          chart.WindowIndex[2 + parseInt(i)] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
        }
      }

      if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[2 + parseInt(i)].Frame.ChartBorder.TitleHeight = item.TitleHeight;
    }

    chart.TradeDate = 20181009;
    if (option.HistoryMinute) {
      if (option.HistoryMinute.TradeDate) chart.TradeDate = option.HistoryMinute.TradeDate;
      if (option.HistoryMinute.IsShowName != null) chart.TitlePaint[0].IsShowName = option.HistoryMinute.IsShowName;  //动态标题是否显示股票名称
      if (option.HistoryMinute.IsShowDate != null) chart.TitlePaint[0].IsShowDate = option.HistoryMinute.IsShowDate;  //动态标题是否显示日期
    }

    return chart;
  }

    this.CreateKLineTrainChartContainer = function (option) 
    {
        var bHScreen = (option.Type == 'K线训练横屏' ? true : false);
        var chart = new KLineTrainChartContainer(this.CanvasElement, bHScreen);

        if (option.NetworkFilter) chart.NetworkFilter = option.NetworkFilter;
        if (option.IsApiPeriod == true) chart.IsApiPeriod = option.IsApiPeriod;

        if (option.KLine)   //k线图的属性设置
        {
            if (option.KLine.Right >= 0) chart.Right = option.KLine.Right;
            if (option.KLine.Period >= 0) chart.Period = option.KLine.Period;
            if (option.KLine.MaxReqeustDataCount > 0) chart.MaxReqeustDataCount = option.KLine.MaxReqeustDataCount;
            if (option.KLine.Info && option.KLine.Info.length > 0) chart.SetKLineInfo(option.KLine.Info, false);
            if (option.KLine.PageSize > 0) chart.PageSize = option.KLine.PageSize;
            if (option.KLine.IsShowTooltip == false) chart.IsShowTooltip = false;
            if (option.KLine.MaxRequestMinuteDayCount > 0) chart.MaxRequestMinuteDayCount = option.KLine.MaxRequestMinuteDayCount;
            if (option.KLine.DrawType) chart.KLineDrawType = option.KLine.DrawType;
        }

        if (option.Train) 
        {
            if (option.Train.DataCount) chart.TrainDataCount = option.Train.DataCount;
            if (option.Train.Callback) chart.TrainCallback = option.Train.Callback;
            if (option.Train.StartDate) chart.TrainStartDate = option.Train.StartDate;
        }

        if (!option.Windows || option.Windows.length <= 0) return null;

        //创建子窗口
        chart.Create(option.Windows.length);

        if (option.Border) 
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
        }

        if (option.ExtendChart) //创建扩展画法
        {
            for (var i in option.ExtendChart) 
            {
                var item = option.ExtendChart[i];
                chart.CreateExtendChart(item.Name, item);
            }
        }

        if (option.IsShowCorssCursorInfo == false) chart.ChartCorssCursor.IsShowText = option.IsShowCorssCursorInfo;//取消显示十字光标刻度信息
        if (option.CorssCursorTouchEnd == true) chart.CorssCursorTouchEnd = option.CorssCursorTouchEnd;
        if (option.IsClickShowCorssCursor == true) chart.IsClickShowCorssCursor = option.IsClickShowCorssCursor;
        if (option.IsFullDraw == true) chart.IsFullDraw = option.IsFullDraw;

        if (option.CorssCursorInfo) 
        {
            if (!isNaN(option.CorssCursorInfo.Left)) chart.ChartCorssCursor.ShowTextMode.Left = option.CorssCursorInfo.Left;
            if (!isNaN(option.CorssCursorInfo.Right)) chart.ChartCorssCursor.ShowTextMode.Right = option.CorssCursorInfo.Right;
            if (!isNaN(option.CorssCursorInfo.Bottom)) chart.ChartCorssCursor.ShowTextMode.Bottom = option.CorssCursorInfo.Bottom;
            if (option.CorssCursorInfo.IsShowCorss === false) chart.ChartCorssCursor.IsShowCorss = option.CorssCursorInfo.IsShowCorss;
            if (option.CorssCursorInfo.IsShowClose == true) chart.ChartCorssCursor.IsShowClose = option.CorssCursorInfo.IsShowClose;    //Y轴显示收盘价
            if (option.CorssCursorInfo.HPenType > 0) chart.ChartCorssCursor.HPenType = option.CorssCursorInfo.HPenType;
            if (option.CorssCursorInfo.VPenType > 0) chart.ChartCorssCursor.VPenType = option.CorssCursorInfo.VPenType;
        }

        if (option.Frame) 
        {
            for (var i in option.Frame) 
            {
                if (!chart.Frame.SubFrame[i]) continue;
                var item = option.Frame[i];
                if (item.SplitCount) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = item.SplitCount;
                if (item.StringFormat) chart.Frame.SubFrame[i].Frame.YSplitOperator.StringFormat = item.StringFormat;
                if (item.Height>0) chart.Frame.SubFrame[i].Height = item.Height;
                if (item.IsShowLeftText === false || item.IsShowLeftText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[0] = item.IsShowLeftText;            //显示左边刻度
                if (item.IsShowRightText === false || item.IsShowRightText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[1] = item.IsShowRightText;         //显示右边刻度 
            }
        }

        //股票名称 日期 周期都不显示
        chart.TitlePaint[0].IsShowName = false;
        chart.TitlePaint[0].IsShowSettingInfo = false;
        chart.TitlePaint[0].IsShowDateTime = false;

        //创建子窗口的指标
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        for (var i in option.Windows) 
        {
            var item = option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[i] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
            }
            else 
            {
                let indexItem = JSIndexMap.Get(item.Index);
                if (indexItem) 
                {
                    chart.WindowIndex[i] = indexItem.Create();
                    chart.CreateWindowIndex(i);
                }
                else 
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;

                    if (item.Lock) indexInfo.Lock = item.Lock;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo);    //脚本执行
                }

            }

            if (item.Modify != null) chart.Frame.SubFrame[i].Frame.ModifyIndex = item.Modify;
            if (item.Change != null) chart.Frame.SubFrame[i].Frame.ChangeIndex = item.Change;
            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight = item.TitleHeight;
        }

        return chart;
    }

    //根据option内容绘制图形
    this.SetOption = function (option) 
    {
        console.log('[JSChart::SetOption]', option)
        var chart = null;
        switch (option.Type) 
        {
        case "历史K线图":
        case '历史K线图横屏':
            chart = this.CreateKLineChartContainer(option);
            break;
        case "自定义指数历史K线图":
            chart = this.CreateCustomKLineChartContainer(option);
            break;
        case "分钟走势图":
        case "分钟走势图横屏":
            chart = this.CreateMinuteChartContainer(option);
            break;
        case "历史分钟走势图":
            chart = this.CreateHistoryMinuteChartContainer(option);
            break;
        case 'K线训练':
        case 'K线训练横屏':
            chart = this.CreateKLineTrainChartContainer(option);
            break;
        case "简单图形":
            return this.CreateSimpleChart(option);
        case '雷达图':
        case "饼图":
            return this.CreatePieChart(option);
        case '地图':
            return this.CreateMapChart(option);
        default:
            return false;
        }

        if (!chart) return false;

        //是否自动更新
        if (option.IsAutoUpdate == true || option.IsAutoUpate == true) chart.IsAutoUpdate = true;
        if (option.AutoUpdateFrequency > 0) chart.AutoUpdateFrequency = option.AutoUpdateFrequency;

        //设置股票代码
        if (!option.Symbol) return false;
        chart.Draw();
        chart.ChangeSymbol(option.Symbol);

        this.JSChartContainer = chart;
        this.JSChartContainer.Draw();
    }

    //切换股票代码接口
    this.ChangeSymbol = function (symbol) 
    {
        if (this.JSChartContainer) this.JSChartContainer.ChangeSymbol(symbol);
    }

    //K线切换指标
    this.ChangeIndex = function (windowIndex, indexName, option) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeIndex) == 'function')
            this.JSChartContainer.ChangeIndex(windowIndex, indexName, option);
    }

    //切换K线指标
    this.ChangeScriptIndex = function (windowIndex, indexData) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeScriptIndex) == 'function')
            this.JSChartContainer.ChangeScriptIndex(windowIndex, indexData);
    }

    //获取当前显示的指标信息
    this.GetIndexInfo = function () 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.GetIndexInfo) == 'function')
            return this.JSChartContainer.GetIndexInfo();
        else
            return [];
    }

    //K线周期切换
    this.ChangePeriod = function (period, option) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangePeriod) == 'function')
            this.JSChartContainer.ChangePeriod(period, option);
    }

    //切换系统指示
    this.ChangeInstructionIndex = function (indexName)
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeInstructionIndex) == 'function')
            this.JSChartContainer.ChangeInstructionIndex(indexName);
    }

    //切换自定义指示
    this.ChangeInstructionScriptIndex = function (indexData) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeInstructionIndex) == 'function')
            this.JSChartContainer.ChangeInstructionScriptIndex(indexData);
    }

    //取消指示
    this.CancelInstructionIndex = function () 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.CancelInstructionIndex) == 'function')
            this.JSChartContainer.CancelInstructionIndex();
    }

    //切换指标模板
    this.ChangeIndexTemplate = function (option) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeIndexTemplate) == 'function') {
            console.log('[JSChart:ChangeIndexTemplate] ', option);
            this.JSChartContainer.ChangeIndexTemplate(option);
        }
    }

    //K线复权切换
    this.ChangeRight = function (right) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeRight) == 'function')
        this.JSChartContainer.ChangeRight(right);
    }

    //K线切换类型 0=实心K线 1=收盘价线 2=美国线 3=空心K线
    this.ChangeKLineDrawType = function (drawType) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeKLineDrawType) == 'function')
            this.JSChartContainer.ChangeKLineDrawType(drawType);
    }

    //切换数据类
    this.ChangMainDataControl = function (dataControl) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.SetMainDataConotrl) == 'function')
        this.JSChartContainer.SetMainDataConotrl(dataControl);
    }

    //叠加股票
    this.OverlaySymbol = function (symbol,option) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.OverlaySymbol) == 'function')
            this.JSChartContainer.OverlaySymbol(symbol, option);
    }

  //设置强制横屏
  this.ForceLandscape = function (bForceLandscape) {
    if (this.JSChartContainer) {
      console.log("[JSChart::ForceLandscape] bForceLandscape=" + bForceLandscape);
      this.JSChartContainer.IsForceLandscape = bForceLandscape;
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

    //历史分钟数据 更改日期
    this.ChangeTradeDate = function (tradeDate) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeTradeDate) == 'function') 
        {
            console.log('[JSChart:ChangeTradeDate] date', tradeDate);
            this.JSChartContainer.ChangeTradeDate(tradeDate);
        }
    }

    //多日走势图
    this.ChangeDayCount = function (count) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeDayCount) == 'function') 
        {
            console.log('[JSChart:ChangeDayCount] count', count);
            this.JSChartContainer.ChangeDayCount(count);
        }
    }

    this.StopAutoUpdate = function () 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.StopAutoUpdate) == 'function') {
            console.log("[JSChart::StopAutoUpdate] Stop.");
            this.JSChartContainer.StopAutoUpdate();
        }
    }
    this.StopAutoUpdata = this.StopAutoUpdate;

    this.CreateSimpleChart = function (option) 
    {
        var chart = new SimlpleChartContainer(this.CanvasElement);
        if (option.MainDataControl) chart.MainDataControl = option.MainDataControl;
        if (option.FrameType > 0) chart.FrameType = option.FrameType;
        if (!isNaN(option.SplitCount)) chart.YSplitCount = option.SplitCount;

        chart.Create();

        if (option.Border)  //边框设置
        {
            if (!isNaN(option.Border.Left)) chart.Frame.ChartBorder.Left = option.Border.Left;
            if (!isNaN(option.Border.Right)) chart.Frame.ChartBorder.Right = option.Border.Right;
            if (!isNaN(option.Border.Top)) chart.Frame.ChartBorder.Top = option.Border.Top;
            if (!isNaN(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom = option.Border.Bottom;
            if (!isNaN(option.Border.TitleHeight)) chart.Frame.ChartBorder.TitleHeight = option.Border.TitleHeight;
        }

        if (option.XFontType) chart.Frame.XFontType = option.XFontType;

        if (option.Frame) 
        {
            if (option.Frame[0].MaxDistanceWidth) chart.Frame.MaxDistanceWidth = option.Frame[0].MaxDistanceWidth;
            if (option.Frame[0].IsShowBorder != null) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
            if (option.Frame[0].StringFormat) chart.Frame.YSplitOperator.StringFormat = option.Frame[0].StringFormat;
            if (option.Frame[0].FloatPrecision >= 0) chart.Frame.YSplitOperator.FloatPrecision = option.Frame[0].FloatPrecision;
            if (option.Frame[0].IgnoreYValue) chart.Frame.YSplitOperator.IgnoreYValue = option.Frame[0].IgnoreYValue;
        }

        chart.Draw();
        chart.RequestData();

        this.JSChartContainer = chart;
        this.JSChartContainer.Draw();
    }

  //创建饼图
  this.CreatePieChart = function (option) {
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

    if (option.Frame) {
      if (option.Frame[0].IsShowBorder == false) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
    }

    chart.Draw();
    chart.RequestData();

    this.JSChartContainer = chart;
    this.JSChartContainer.Draw();

  }

  //中国地图
  this.CreateMapChart = function (option) {
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

    if (option.Frame) {
      if (option.Frame[0].IsShowBorder == false) chart.Frame.IsShowBorder = option.Frame[0].IsShowBorder;
    }

    chart.Draw();
    chart.RequestData();

    this.JSChartContainer = chart;
    this.JSChartContainer.Draw();
  }

  this.OnTouchStart = function (e) {
    if (this.JSChartContainer) this.JSChartContainer.ontouchstart(e);
  }

  this.OnTouchMove = function (e) {
    if (this.JSChartContainer) this.JSChartContainer.ontouchmove(e);
  }

  this.OnTouchEnd = function (e) {
    if (this.JSChartContainer) this.JSChartContainer.ontouchend(e);
  }

  this.SaveToImage = function (callback) {
    if (this.JSChartContainer && typeof (this.JSChartContainer.SaveToImage) == 'function')
      this.JSChartContainer.SaveToImage(callback);
  }
}

//初始化
JSChart.Init = function (uielement) {
  console.log('[JSChart.Init] uielement', uielement);
  var jsChartControl = new JSChart(uielement);
  jsChartControl.OnSize();

  return jsChartControl;
}

JSChart.SetDomain = function (domain, cacheDomain) {
  if (domain) {
    g_JSChartResource.Domain = domain;

    g_JSChartResource.Index.StockHistoryDayApiUrl = domain + "/API/StockHistoryDay";  //历史数据api
    g_JSChartResource.Index.MarketLongShortApiUrl = domain + "/API/FactorTiming";     //市场多空
    g_JSChartResource.Index.MarketAttentionApiUrl = domain + "/API/MarketAttention";  //市场关注度
    g_JSChartResource.Index.MarketHeatApiUrl = domain + "/API/MarketHeat";            //行业,指数热度

  }

  if (cacheDomain) g_JSChartResource.CacheDomain = cacheDomain;

  JSCommonComplier.JSComplier.SetDomain(domain, cacheDomain);     //编译器数据api域名修改  
}

//自定义风格
JSChart.SetStyle = function (style) {
  if (style) g_JSChartResource.SetStyle(style);
}

JSChart.GetResource = function ()  //获取颜色配置 (设置配必须啊在JSChart.Init()之前)
{
    return g_JSChartResource;
}

JSChart.GetKLineZoom = function () //K线缩放配置
{
    return ZOOM_SEED;
}

var JSCHART_EVENT_ID =
{
    RECV_INDEX_DATA: 2,  //接收指标数据
    RECV_HISTROY_DATA: 3,//接收到历史数据
    RECV_TRAIN_MOVE_STEP: 4,    //接收K线训练,移动一次K线
    CHART_STATUS: 5,            //每次Draw() 以后会调用
    BARRAGE_PLAY_END: 6,        //单个弹幕播放完成
    RECV_START_AUTOUPDATE: 9,    //开始自动更新
    RECV_STOP_AUTOUPDATE: 10,    //停止自动更新
    ON_TITLE_DRAW: 12,           //标题信息绘制事件
    RECV_MINUTE_DATA: 14,          //分时图数据到达
    RECV_KLINE_UPDATE_DATA: 16,   //K线日,分钟更新数据到达 
    ON_INDEXTITLE_DRAW: 19,       //指标标题重绘事件 
    ON_CUSTOM_VERTICAL_DRAW: 20,  //自定义X轴绘制事件 
}

var JSCHART_OPERATOR_ID =
{
    OP_SCROLL_LEFT: 1,
    OP_SCROLL_RIGHT: 2,
    OP_ZOOM_OUT: 3,  //缩小
    OP_ZOOM_IN: 4,   //放大
    OP_GOTO_HOME: 5, //第1页数据
}

/*
    图形控件
*/
function JSChartContainer(uielement) 
{
    this.ClassName = 'JSChartContainer';
    var _self = this;
    this.Frame;                                       //框架画法
    this.ChartPaint = new Array();                    //图形画法
    this.ChartPaintEx = [];                           //图形扩展画法
    this.ChartInfo = new Array();                     //K线上信息地雷
    this.ChartInfoPaint;                              //信息地理
    this.ExtendChartPaint = new Array();              //扩展画法
    this.TitlePaint = new Array();                    //标题画法
    this.OverlayChartPaint = new Array();             //叠加信息画法
    this.ChartDrawPicture = new Array();              //画图工具
    this.CurrentChartDrawPicture = null;              //当前的画图工具
    this.SelectChartDrawPicture = null;               //当前选中的画图
    this.ChartCorssCursor;                            //十字光标
    this.IsClickShowCorssCursor = false;              //手势点击显示十字光标
    this.ChartSplashPaint = null;                     //等待提示
    this.SplashTitle = '数据加载中';
    this.Canvas = uielement.GetContext("2d");         //画布
    this.UIElement = uielement;
    this.MouseDrag;
    this.DragMode = 1;                                //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择

    this.TouchTimer = null;         //触屏定时器
    this.LastDrawStatus;            //最后一次画的状态
    this.LastDrawID=1;              //最后一次画的ID
    this.SnapshotType = 0;

    this.CursorIndex = 0;             //十字光标X轴索引
    this.LastPoint = new Point();     //鼠标位置
    this.IsForceLandscape = false;    //是否强制横屏
    this.CorssCursorTouchEnd = false;   //手离开屏幕自动隐藏十字光标
    this.EnableAnimation = false;   //是否开启动画

    //坐标轴风格方法 double-更加数值型分割  price-更加股票价格分割
    this.FrameSplitData = new Map();
    this.FrameSplitData.set("double", new SplitData());
    this.FrameSplitData.set("price", new PriceSplitData());

    this.UpdateUICallback;      //数据到达通知前端
    this.IsOnTouch = false;     //当前是否正式手势操作
    this.IsFullDraw=false;       //是否使用重绘模式 (可能会卡)

    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;

    //公共函数转发,不然要导出麻烦
    this.FormatDateString = IFrameSplitOperator.FormatDateString;
    this.FormatValueString = IFrameSplitOperator.FormatValueString;
    this.ToFixedPoint = ToFixedPoint;
    this.ToFixedRect = ToFixedRect;
    this.FormatTimeString = IFrameSplitOperator.FormatTimeString;

    //this.JSCHART_EVENT_ID = JSCHART_EVENT_ID;

    //事件回调
    this.mapEvent = new Map();   //通知外部调用 key:JSCHART_EVENT_ID value:{Callback:回调,}
    this.NetworkFilter;         //网络请求回调 function(data, callback);

    this.AddEventCallback = function (object) //设置事件回调 {event:事件id, callback:回调函数}
    {
        if (!object || !object.event || !object.callback) return;

        var data = { Callback: object.callback, Source: object };
        this.mapEvent.set(object.event, data);
    }

    this.RemoveEventCallback = function (eventid) 
    {
        if (!this.mapEvent.has(eventid)) return;
        this.mapEvent.delete(eventid);
    }

    this.GetEvent=function(eventId)
    {
        if (!this.mapEvent.has(eventId)) return null;
        var item = this.mapEvent.get(eventId);
        return item;
    }
    
    this.GetIndexEvent = function () { return this.GetEvent(JSCHART_EVENT_ID.RECV_INDEX_DATA); }    //接收指标数据
    this.GetBarrageEvent=function() { return this.GetEvent(JSCHART_EVENT_ID.BARRAGE_PLAY_END);}     //获取弹幕事件

    //判断是单个手指
    this.IsPhoneDragging = function (e) 
    {
        // console.log(e);
        var changed = e.changedTouches.length;
        var touching = e.touches.length;

        return changed == 1 && touching == 1;
    }

    //是否是2个手指操所
    this.IsPhonePinching = function (e) 
    {
        var changed = e.changedTouches.length;
        var touching = e.touches.length;

        return (changed == 1 || changed == 2) && touching == 2;
    }

    this.GetToucheData = function (e, isForceLandscape) 
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
                touches.push( {clientX: item.x, clientY: item.y, pageX: item.x, pageY: item.y });
            }
        }

        return touches;
    }

    //手机拖拽
    this.ontouchstart = function (e) 
    {
        var jsChart = this;
        //if (jsChart.DragMode == 0) return;

        jsChart.IsOnTouch=true;
        jsChart.PhonePinch = null;

        if (this.IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock) {
                var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            if (this.TouchTimer != null) clearTimeout(this.TouchTimer);
            if (this.ChartCorssCursor.IsShow == true) 
            {
                this.TouchTimer = setTimeout(function () {
                    if (drag.Click.X == drag.LastMove.X && drag.Click.Y == drag.LastMove.Y) //手指没有移动，出现十字光标
                    {
                        var mouseDrag = jsChart.MouseDrag;
                        jsChart.MouseDrag = null;
                        //移动十字光标
                        var x = drag.Click.X;
                        var y = drag.Click.Y;
                        if (jsChart.IsForceLandscape) y = jsChart.UIElement.Height - drag.Click.Y;    //强制横屏Y计算
                        jsChart.OnMouseMove(x, y, e);
                    }

                }, 800);
            }

            var drag =
            {
                "Click": {},
                "LastMove": {},  //最后移动的位置
            };

            var touches = this.GetToucheData(e, jsChart.IsForceLandscape);

            drag.Click.X = touches[0].clientX;
            drag.Click.Y = touches[0].clientY;
            drag.LastMove.X = touches[0].clientX;
            drag.LastMove.Y = touches[0].clientY;

            if (jsChart.DragMode == 1) jsChart.MouseDrag = drag;

            if (jsChart.IsClickShowCorssCursor) 
            {
                var x = drag.Click.X;
                var y = drag.Click.Y;
                jsChart.OnMouseMove(x, y, e,true);
            }
        }
        else if (this.IsPhonePinching(e)) 
        {
            var phonePinch = { "Start": {}, "Last": {} };
            var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
            phonePinch.Start = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
            phonePinch.Last = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
            jsChart.PhonePinch = phonePinch;
        }
    }


    this.ontouchmove = function (e) 
    {
        var jsChart = this;
        var touches = this.GetToucheData(e, jsChart.IsForceLandscape);

        if (this.IsPhoneDragging(e)) 
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
                    else
                    {
                        if (jsChart.DragDownloadData) jsChart.DragDownloadData();
                    }

                    drag.LastMove.X = touches[0].clientX;
                    drag.LastMove.Y = touches[0].clientY;
                }
            }
        }
        else if (this.IsPhonePinching(e))
        {
            var phonePinch = jsChart.PhonePinch;
            if (!phonePinch) return;

            var yHeight = Math.abs(touches[0].pageY - touches[1].pageY);
            var yLastHeight = Math.abs(phonePinch.Last.Y - phonePinch.Last.Y2);
            var yStep = yHeight - yLastHeight;
            var xHeight = Math.abs(touches[0].pageX - touches[1].pageX);
            var xLastHeight = Math.abs(phonePinch.Last.X - phonePinch.Last.X2);
            var xStep = xHeight - xLastHeight;
            if (Math.abs(yStep) < 5 && Math.abs(xStep) < 5) return;

            var step = yStep;
            if (Math.abs(yStep) < 5) step = xStep;

            if (step > 0)    //放大
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
        this.IsOnTouch = false;
        console.log('[JSChartContainer:ontouchend] IsOnTouch=' + this.IsOnTouch +' LastDrawStatus=' + this.LastDrawStatus);
        if (this.TouchTimer != null) clearTimeout(this.TouchTimer);
        this.Draw();//手放开 重新绘制  
    }

    this.FullDraw=function(drawType)
    {
        var self = this;
        this.Canvas.clearRect(0, 0, this.UIElement.Width, this.UIElement.Height);

        this.Frame.SetDrawOtherChart(() => 
        {
            for (var i in this.ExtendChartPaint) 
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsCallbackDraw) item.Draw();
            }
        });

        this.Frame.Draw();  //框架 

        if (this.Frame.DrawCustomVertical) 
        {
            var eventCVericalDraw = this.GetEvent(JSCHART_EVENT_ID.ON_CUSTOM_VERTICAL_DRAW);
            this.Frame.DrawCustomVertical(eventCVericalDraw);
        }

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)  //动画
        {
            this.Frame.DrawInsideHorizontal();
            this.ChartSplashPaint.Draw();
            this.LastDrawStatus = 'FullDraw';
            this.Canvas.draw();
            return;
        }

        for (var i in this.ChartPaint) //图形
        {
            var item = this.ChartPaint[i];
            if (item.IsDrawFirst) item.Draw();
        }

        for (var i in this.ChartPaint) //图形2 框架内图形
        {
            var item = this.ChartPaint[i];
            if (!item.IsDrawFirst) item.Draw();
        }

        for (var i in this.ChartPaintEx) //扩展图形
        {
            var item = this.ChartPaintEx[i];
            item.Draw();
        }

        for (var i in this.OverlayChartPaint) //叠加股票
        {
            var item = this.OverlayChartPaint[i];
            item.Draw();
        }

        if (this.Frame.DrawInsideHorizontal) this.Frame.DrawInsideHorizontal();  //框架内部坐标
        if (this.Frame.DrawCustomHorizontal) this.Frame.DrawCustomHorizontal();
        if (this.ChartInfoPaint) this.ChartInfoPaint.Draw();
        this.Frame.DrawLock();

        var eventTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_TITLE_DRAW);
        var eventIndexTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_INDEXTITLE_DRAW);
        for (var i in this.TitlePaint)  //标题
        {
            var item = this.TitlePaint[i];
            if (!item.IsDynamic) continue;

            if (item.ClassName == 'DynamicChartTitlePainting') item.OnDrawEvent = eventIndexTitleDraw
            else item.OnDrawEvent = eventTitleDraw;

            if (typeof (item.DrawTitle) == 'function') item.DrawTitle();
        }

        if (drawType == 'DrawDynamicInfo' || this.IsOnTouch)
        {
            var self = this;
            if (self.ChartCorssCursor) //十字光标
            {
                self.ChartCorssCursor.LastPoint = self.LastPoint;
                self.ChartCorssCursor.CursorIndex = self.CursorIndex;
                self.ChartCorssCursor.Draw();
            }

            for (var i in self.TitlePaint) //标题
            {
                var item = self.TitlePaint[i];
                if (!item.IsDynamic) continue;

                item.CursorIndex = self.CursorIndex;
                item.Draw();
            }

            for (var i in this.ExtendChartPaint)    //动态扩展图形   在动态标题以后画
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsCallbackDraw) continue;
                if (item.IsDynamic && item.DrawAfterTitle) item.Draw();
            }
        }

        this.LastDrawStatus = 'FullDraw';
        this.Canvas.draw(false);
    }

    this.Draw = function () 
    {
        if (this.IsFullDraw)
        {
            this.FullDraw('Draw');
            return;
        }

        if (this.IsOnTouch == true && (this.ClassName == 'MinuteChartContainer' || this.ClassName =='MinuteChartHScreenContainer'))  return;

        var self = this;
        this.Canvas.clearRect(0, 0, this.UIElement.Width, this.UIElement.Height);

        this.Frame.SetDrawOtherChart(() => 
        {
            for (var i in this.ExtendChartPaint) 
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsCallbackDraw) item.Draw();
            }
        });

        //框架 
        this.Frame.Draw();

        if (this.Frame.DrawCustomVertical) 
        {
            var eventCVericalDraw = this.GetEvent(JSCHART_EVENT_ID.ON_CUSTOM_VERTICAL_DRAW);
            this.Frame.DrawCustomVertical(eventCVericalDraw);
        }

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash) 
        {
            this.Frame.DrawInsideHorizontal();
            this.ChartSplashPaint.Draw();
            this.LastDrawStatus = 'Draw';
            this.Canvas.draw();
            return;
        }

        for (var i in this.ChartPaint) 
        {
            var item = this.ChartPaint[i];
            if (item.IsDrawFirst) item.Draw();
        }

        //框架内图形
        for (var i in this.ChartPaint) 
        {
            var item = this.ChartPaint[i];
            if (!item.IsDrawFirst) item.Draw();
        }

        for (var i in this.ChartPaintEx) 
        {
            var item = this.ChartPaintEx[i];
            item.Draw();
        }

        //叠加股票
        for (var i in this.OverlayChartPaint) 
        {
            var item = this.OverlayChartPaint[i];
            item.Draw();
        }

        //框架外图形
        for (var i in this.ExtendChartPaint) 
        {
            var item = this.ExtendChartPaint[i];
            if (item.IsCallbackDraw) continue;
            if (!item.IsDynamic && !item.IsAnimation) item.Draw();
        }

        //框架内部坐标
        if (this.Frame.DrawInsideHorizontal) this.Frame.DrawInsideHorizontal();
        if (this.Frame.DrawCustomHorizontal) this.Frame.DrawCustomHorizontal();
        if (this.ChartInfoPaint) this.ChartInfoPaint.Draw();
        this.Frame.DrawLock();

        var eventTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_TITLE_DRAW);
        var eventIndexTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_INDEXTITLE_DRAW);
        for (var i in this.TitlePaint)
        {
            var item = this.TitlePaint[i];
            if (!item.IsDynamic) continue;

            if (item.ClassName == 'DynamicChartTitlePainting') item.OnDrawEvent = eventIndexTitleDraw
            else item.OnDrawEvent = eventTitleDraw;
            
            if (typeof (item.DrawTitle) == 'function') item.DrawTitle();
        }

        this.LastDrawStatus='Draw';

        if (this.IsOnTouch) //手势移动的时候不保存图片
        {
            this.Canvas.draw(false);
        }
        else
        {
            ++this.LastDrawID;
            //坑!!.画图是异步, 保存当前屏图放在回调里面
            //console.log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw and save snapshot. DrawID=' + this.LastDrawID + ' .....');
            var lastDrawID=this.LastDrawID;
            this.Canvas.draw(false, function () 
            {
                //if (lastDrawID == self.LastDrawID) 
                self.Frame.Snapshot(self.SnapshotType);  //只保存最后一次的截图
                //console.log('[JSChartContainer:Draw] finish. DrawID('+ lastDrawID +','+ self.LastDrawID +')');
            });
        }

        //console.log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw dynamic info ......');
        //动态标题都不画了(Canvas.draw 异步画的,如果下面再画会被截屏进去) 只有数据移动的时候在画
    }

    //画动态信息
    this.TempImage=null;
    this.DrawDynamicInfo = function () 
    {
        if (this.IsFullDraw) 
        {
            this.FullDraw('DrawDynamicInfo');
            return;
        }

        var self = this;
        var width = this.Frame.ChartBorder.GetChartWidth();
        var height = this.Frame.ChartBorder.GetChartHeight();

        if (self.SnapshotType==1)
        {
            if (this.Frame.ScreenImageData == null) return;
            wx.canvasPutImageData({
                canvasId: this.UIElement.ID,
                x: 0,y: 0,width: width,height: height,
                data: this.Frame.ScreenImageData,
                success(res) { self.DrawDynamicChart(true); }
            })
        }
        else
        {
            if (this.Frame.ScreenImagePath == null) return;
            if (self.Canvas && self.Canvas.DomNode) //新版本2D画布
            {
                //console.log("[DrawDynamicInfo] ScreenImagePath ", this.Frame.ScreenImagePath);
                if (!this.TempImage) this.TempImage= self.Canvas.DomNode.createImage();  //新版本的必须要装成image类 比较坑
                this.TempImage.src = this.Frame.ScreenImagePath;
                //console.log("[DrawDynamicInfo] tempImage ", this.TempImage);
                this.TempImage.onload=()=>
                {
                    //console.log("[DrawDynamicInfo] onload ", self.TempImage);
                    self.Canvas.clearRect(0, 0, width, height);
                    self.Canvas.drawImage(self.TempImage, 0, 0, width, height);
                    self.DrawDynamicChart(false);
                }
            }
            else
            {
                self.Canvas.drawImage(this.Frame.ScreenImagePath, 0, 0, width, height);
                self.DrawDynamicChart(false);
            }
           
        }
    }

    this.DrawDynamicChart = function (bReserve)
    {
        var self = this;
        if (self.ChartCorssCursor) 
        {
            self.ChartCorssCursor.LastPoint = self.LastPoint;
            self.ChartCorssCursor.CursorIndex = self.CursorIndex;
            self.ChartCorssCursor.Draw();
        }

        for (var i in self.TitlePaint) 
        {
            var item = self.TitlePaint[i];
            if (!item.IsDynamic) continue;

            item.CursorIndex = self.CursorIndex;
            item.Draw();
        }

        for (var i in this.ExtendChartPaint)    //动态扩展图形   在动态标题以后画
        {
            var item = this.ExtendChartPaint[i];
            if (item.IsDynamic && item.DrawAfterTitle) item.Draw();
        }

        if (this.EnableAnimation) 
        {
            for (var i in this.ExtendChartPaint)    //动画
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsAnimation === true) item.Draw();
            }
        }

        this.LastDrawStatus = 'DrawDynamicInfo';
        console.log('[JSChartContainer:DrawDynamicChart][ID=' + this.UIElement.ID + '] draw .....');
        self.Canvas.draw(bReserve, function () {
            console.log('[JSChartContainer:DrawDynamicChart] finish.');
        });
    }

    this.DrawAnimation = function ()   //绘制动画 如弹幕
    {
        if (!this.EnableAnimation) return;

        if (this.Frame.ScreenImagePath && !this.IsOnTouch) 
        {
            for (var i in this.ExtendChartPaint) 
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsAnimation === true) item.IsMoveStep = true;  //移动弹幕
            }

            this.DrawDynamicInfo();
        }

        var self = this;
        this.UIElement.WebGLCanvas.requestAnimationFrame(() => { this.DrawAnimation(); });
    }

    this.StartAnimation = function (option) 
    {
        console.log('[JSChartContainer::StartAnimation] ', this.UIElement.WebGLCanvas);
        if (!this.UIElement.WebGLCanvas) return;

        var bCreated = false; //是否已经创建了弹幕画法
        var barrageData = null;
        for (var i in this.ExtendChartPaint) 
        {
            var item = this.ExtendChartPaint[i];
            if (item.ClassName === 'BarragePaint') 
            {
                bCreated = true;
                barrageData = item.BarrageList;
                break;
            }
        }

        if (!bCreated) 
        {
            var chart = new BarragePaint();
            chart.Canvas = this.Canvas;
            chart.ChartBorder = this.Frame.ChartBorder;
            chart.ChartFrame = this.Frame;
            chart.HQChart = this;
            chart.SetOption(option);
            this.ExtendChartPaint.push(chart);
            barrageData = chart.BarrageList;
        }

        this.EnableAnimation = true;
        var self = this;

        this.UIElement.WebGLCanvas.requestAnimationFrame(()=> { this.DrawAnimation(); });
        return barrageData;
    }

    this.StopAnimation = function () 
    {
        this.EnableAnimation = false;
        this.DrawDynamicInfo();
    }

    this.OnMouseMove = function (x, y, e, bFullDraw) 
    {
        var lastY = this.LastPoint.Y;
        this.LastPoint.X = x;
        this.LastPoint.Y = y;
        var lastCursorIndex = this.CursorIndex;
        this.CursorIndex = this.Frame.GetXData(x);
        if (parseInt(lastCursorIndex - 0.5) == parseInt(this.CursorIndex - 0.5) && Math.abs(lastY - y) < 1) return;  //一个一个数据移动

        if (bFullDraw)
        {
            this.FullDraw();
        }
        else
        {
            if (this.IsForceLandscape) this.Draw();//横屏图片太大不让贴,分两张图贴,多次截图的函数是坏的, 直接重画了
            else this.DrawDynamicInfo();
        }
    }


  this.OnDoubleClick = function (x, y, e) {
    //console.log(e);
  }

    this.UpdatePointByCursorIndex = function () 
    {
        this.LastPoint.X = this.Frame.GetXFromIndex(this.CursorIndex);

        var index = Math.abs(this.CursorIndex - 0.5);
        index = parseInt(index.toFixed(0));
        if (this.ClassName == 'KLineChartContainer') index = this.CursorIndex;
        var data = this.Frame.Data;
        if (data.DataOffset + index >= data.Data.length) 
        {
            return;
        }
        var close = data.Data[data.DataOffset + index].Close;

        this.LastPoint.Y = this.Frame.GetYFromData(close);
    }

  this.ResetFrameXYSplit = function () {
    if (typeof (this.Frame.ResetXYSplit) == 'function')
      this.Frame.ResetXYSplit();
  }

  this.UpdateFrameMaxMin = function () {
    var frameMaxMinData = new Array();

    var chartPaint = new Array();

    for (var i in this.ChartPaint) {
      chartPaint.push(this.ChartPaint[i]);
    }
    for (var i in this.OverlayChartPaint) {
      chartPaint.push(this.OverlayChartPaint[i]);
    }

    for (var i in chartPaint) {
      var paint = chartPaint[i];
      var range = paint.GetMaxMin();
      if (range == null || range.Max == null || range.Min == null) continue;
      var frameItem = null;
      for (var j in frameMaxMinData) {
        if (frameMaxMinData[j].Frame == paint.ChartFrame) {
          frameItem = frameMaxMinData[j];
          break;
        }
      }

      if (frameItem) {
        if (frameItem.Range.Max < range.Max) frameItem.Range.Max = range.Max;
        if (frameItem.Range.Min > range.Min) frameItem.Range.Min = range.Min;
      }
      else {
        frameItem = {};
        frameItem.Frame = paint.ChartFrame;
        frameItem.Range = range;
        frameMaxMinData.push(frameItem);
      }
    }

    for (var i in frameMaxMinData) {
      var item = frameMaxMinData[i];
      if (!item.Frame || !item.Range) continue;
      if (item.Range.Max == null || item.Range.Min == null) continue;
      if (item.Frame.YSpecificMaxMin) {
        item.Frame.HorizontalMax = item.Frame.YSpecificMaxMin.Max;
        item.Frame.HorizontalMin = item.Frame.YSpecificMaxMin.Min;
      }
      else {
        item.Frame.HorizontalMax = item.Range.Max;
        item.Frame.HorizontalMin = item.Range.Min;
      }
      item.Frame.XYSplit = true;
    }
  }

  this.DataMoveLeft = function () {
    var data = null;
    if (!this.Frame.Data) data = this.Frame.Data;
    else data = this.Frame.SubFrame[0].Frame.Data;
    if (!data) return false;
    if (data.DataOffset <= 0) return false;
    --data.DataOffset;
    return true;
  }

  this.DataMoveRight = function () {
    var data = null;
    if (!this.Frame.Data) data = this.Frame.Data;
    else data = this.Frame.SubFrame[0].Frame.Data;
    if (!data) return false;

    var xPointcount = 0;
    if (this.Frame.XPointCount) xPointcount = this.Frame.XPointCount;
    else xPointcount = this.Frame.SubFrame[0].Frame.XPointCount;
    if (!xPointcount) return false;

    if (xPointcount + data.DataOffset >= data.Data.length) return false;

    ++data.DataOffset;
    return true;
  }

  this.UpdataDataoffset = function () {
    var data = null;
    if (this.Frame.Data)
      data = this.Frame.Data;
    else
      data = this.Frame.SubFrame[0].Frame.Data;

    if (!data) return;

    for (var i in this.ChartPaint) {
      var item = this.ChartPaint[i];
      if (!item.Data) continue;
      item.Data.DataOffset = data.DataOffset;
    }

    for (var i in this.OverlayChartPaint) {
      var item = this.OverlayChartPaint[i];
      if (!item.Data) continue;
      item.Data.DataOffset = data.DataOffset;
    }
  }

    this.DataMove = function (step, isLeft) 
    {
        step=parseInt(step/this.StepPixel);
        if (step<=0) return false;

        var data = null;
        if (!this.Frame.Data) data = this.Frame.Data;
        else data = this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;

        var xPointcount = 0;
        if (this.Frame.XPointCount) xPointcount = this.Frame.XPointCount;
        else xPointcount = this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (isLeft) //-->
        {
            if (this.RightSpaceCount > 0)
            {
                if (xPointcount + data.DataOffset >= data.Data.length + this.RightSpaceCount - 1) return false;

                data.DataOffset += step;

                if (data.DataOffset + xPointcount >= data.Data.length + this.RightSpaceCount)
                    data.DataOffset = data.Data.length - (xPointcount - this.RightSpaceCount);
            }
            else
            {
                if (xPointcount + data.DataOffset >= data.Data.length) return false;

                data.DataOffset += step;

                if (data.DataOffset + xPointcount >= data.Data.length)
                    data.DataOffset = data.Data.length - xPointcount;
            }
            return true;
        }
        else        //<--
        {
            if (data.DataOffset <= 0) return false;

            data.DataOffset -= step;
            if (data.DataOffset < 0) data.DataOffset = 0;

            return true;
        }
    }

  //获取鼠标在当前子窗口id
  this.GetSubFrameIndex = function (x, y) {
    if (!this.Frame.SubFrame || this.Frame.SubFrame.length <= 0) return -1;

    for (var i in this.Frame.SubFrame) {
      var frame = this.Frame.SubFrame[i].Frame;
      var left = frame.ChartBorder.GetLeft();
      var top = frame.ChartBorder.GetTop();
      var height = frame.ChartBorder.GetHeight();
      var width = frame.ChartBorder.GetWidth();

      this.Canvas.rect(left, top, width, height);
      if (this.Canvas.isPointInPath(x, y)) return parseInt(i);

    }
    return 0;
  }

  //根据X坐标获取数据索引
  this.GetDataIndexByPoint = function (x) {
    var frame = this.Frame;
    if (this.Frame.SubFrame && this.Frame.SubFrame.length > 0) frame = this.Frame.SubFrame[0].Frame;

    var data = null;
    if (this.Frame.Data)
      data = this.Frame.Data;
    else
      data = this.Frame.SubFrame[0].Frame.Data;

    if (!data || !frame) return;

    var index = parseInt(frame.GetXData(x));

    //console.log('x='+ x +' date='+data.Data[data.DataOffset+index].Date);
    return data.DataOffset + index;
  }

  this.SaveToImage = function (callback) {
    let width = this.UIElement.Width;
    let height = this.UIElement.Height;;

    console.log('[JSChartContainer::SaveToImage]', this.UIElement);

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      canvasId: this.UIElement.ID,
      success: function (res) {
        let data = { ImagePath: res.tempFilePath, Width: width, Height: height };
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
    var value = Math.round(Math.abs(number) * multiplier) / multiplier * b;

    if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(value))
        var s = value.toFixed2(precision);
    else
        var s = value.toString();
    var rs = s.indexOf('.');
    if (rs < 0 && precision > 0) 
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

Number.prototype.toFixed2 = Number.prototype.toFixed; //备份下老的

Number.prototype.toFixed = function (precision) {
  return ToFixed(this, precision)
}

function Guid() 
{
    function S4() 
    {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function GetScrollPosition() {
  var scrollPos = {};
  var scrollTop = 0;
  var scrollLeft = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
    scrollLeft = document.documentElement.scrollLeft;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
    scrollLeft = document.body.scrollLeft;
  }

  scrollPos.Top = scrollTop;
  scrollPos.Left = scrollLeft;
  return scrollPos;
}

//修正线段有毛刺
function ToFixedPoint(value) {
  //return value;
  return parseInt(value) + 0.5;
}

function ToFixedRect(value) {
  //return value;
  // With a bitwise or.
  //rounded = (0.5 + somenum) | 0;
  // A double bitwise not.
  //rounded = ~~ (0.5 + somenum);
  // Finally, a left bitwise shift.
  var rounded;
  return rounded = (0.5 + value) << 0;
}



function Point() {
  this.X;
  this.Y;
}

function SelectRectData() {
  this.Data;                  //主数据
  this.JSChartContainer;      //行情控件

  this.Start; //数据起始位子
  this.End;   //数据结束位置

  this.XStart;//X坐标起始位置
  this.XEnd;  //X位置结束为止
}

//边框信息
function ChartBorder() {
  this.UIElement;

  //四周间距
  this.Left = 50;
  this.Right = 80;
  this.Top = 50;
  this.Bottom = 50;
  this.TitleHeight = 15;    //标题高度
  //上下间距
  this.TopSpace = 0;
  this.BottomSpace = 0;

  this.GetChartWidth = function () {
    return this.UIElement.Width;
  }

  this.GetChartHeight = function () {
    return this.UIElement.Height;
  }

  this.GetLeft = function () {
    return this.Left;
  }

  this.GetRight = function () {
    return this.UIElement.Width - this.Right;
  }

  this.GetTop = function () {
    return this.Top;
  }

  this.GetTopEx = function ()    //去掉标题,上面间距
  {
    return this.Top + this.TitleHeight + this.TopSpace;
  }

  this.GetTopTitle = function () //去掉标题
  {
    return this.Top + this.TitleHeight;
  }

  this.GetBottom = function () {
    return this.UIElement.Height - this.Bottom;
  }

  this.GetBottomEx = function () {
    return this.UIElement.Height - this.Bottom - this.BottomSpace;
  }

  this.GetWidth = function () {
    return this.UIElement.Width - this.Left - this.Right;
  }

  this.GetHeight = function () {
    return this.UIElement.Height - this.Top - this.Bottom;
  }

  this.GetHeightEx = function () //去掉标题的高度 上下间距
  {
    return this.UIElement.Height - this.Top - this.Bottom - this.TitleHeight - this.TopSpace - this.BottomSpace;
  }

  this.GetRightEx = function ()  //横屏去掉标题高度的 上面间距
  {
    return this.UIElement.Width - this.Right - this.TitleHeight - this.TopSpace;
  }

  this.GetWidthEx = function ()  //横屏去掉标题宽度 上下间距
  {
    return this.UIElement.Width - this.Left - this.Right - this.TitleHeight - this.TopSpace - this.BottomSpace;
  }

  this.GetLeftEx = function () //横屏
  {
    return this.Left + this.BottomSpace;
  }

  this.GetRightTitle = function ()//横屏
  {
    return this.UIElement.Width - this.Right - this.TitleHeight;
  }

  this.GetTitleHeight = function () {
    return this.TitleHeight;
  }
}

function IChartFramePainting() 
{
    this.HorizontalInfo = new Array();    //Y轴
    this.VerticalInfo = new Array();      //X轴

    this.Canvas;                        //画布

    this.Identify;                      //窗口标识

    this.ChartBorder;
    this.PenBorder = g_JSChartResource.FrameBorderPen;        //边框颜色
    this.TitleBGColor = g_JSChartResource.FrameTitleBGColor;  //标题背景色
    this.IsShow = true;                   //是否显示
    this.SizeChange = true;               //大小是否改变
    this.XYSplit = true;                  //XY轴坐标信息改变

    this.HorizontalMax;                 //Y轴最大值
    this.HorizontalMin;                 //Y轴最小值
    this.XPointCount = 10;                //X轴数据个数

    this.YSplitOperator;               //Y轴分割
    this.XSplitOperator;               //X轴分割
    this.Data;                         //主数据

    this.YSpecificMaxMin = null;         //指定Y轴最大最小值
    this.YSplitScale=null;               //固定分割刻度数组 [2,5,8]

    this.IsShowBorder = true;            //是否显示边框
    this.IsShowIndexName = true;         //是否显示指标名字
    this.IndexParamSpace = 2;            //指标参数数值显示间距

    //上锁信息
    this.IsLocked = false;               //是否上锁
    this.LockPaint = null;

  this.Draw = function () {
    this.DrawFrame();
    this.DrawBorder();

    this.SizeChange = false;
    this.XYSplit = false;
  }

  this.DrawFrame = function () { }

  //画边框
  this.DrawBorder = function () {
    if (!this.IsShowBorder) return;

    var left = ToFixedPoint(this.ChartBorder.GetLeft());
    var top = ToFixedPoint(this.ChartBorder.GetTop());
    var right = ToFixedPoint(this.ChartBorder.GetRight());
    var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
    var width = right - left;
    var height = bottom - top;
    this.Canvas.strokeStyle = this.PenBorder;
    this.Canvas.strokeRect(left, top, width, height);
  }

  //画标题背景色
  this.DrawTitleBG = function () {
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

  this.DrawLock = function () {
    if (this.IsLocked) {
      if (this.LockPaint == null) this.LockPaint = new ChartLock();

      this.LockPaint.Canvas = this.Canvas;
      this.LockPaint.ChartBorder = this.ChartBorder;
      this.LockPaint.ChartFrame = this;
      this.LockPaint.Draw();
    }
  }

  //设施上锁
  this.SetLock = function (lockData) {
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
function NoneFrame() {
  this.newMethod = IChartFramePainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Snapshot = function () {

  }

  this.DrawInsideHorizontal = function () {

  }

  this.SetSizeChage = function (sizeChange) {
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
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.DataWidth = 50;
    this.DistanceWidth = 10;
    this.MinXDistance = 30;       //X轴刻度最小间距
    this.MinYDistance=10;
    this.IsShowXLine = true;      //是否显示X轴分割线
    this.XMessageAlign = 'top';   //X轴刻度文字上下对齐方式
    this.IsShowTitle = true;      //是否显示动态标题
    this.IsShowYText = [true, true];       //是否显示Y轴坐标坐标 [0=左侧] [1=右侧]
    this.XBottomOffset = g_JSChartResource.Frame.XBottomOffset;   //X轴文字显示向下偏移

    this.DrawOtherChart;      //其他画法调用

    this.DrawFrame = function () 
    {
        if (this.XPointCount > 0) 
        {
            this.DistanceWidth = this.ChartBorder.GetWidth() / (4 * this.XPointCount);
            this.DataWidth = 2 * this.DistanceWidth;
        }

        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetYFromData = function (value) 
    {
        if (value <= this.HorizontalMin) return this.ChartBorder.GetBottomEx();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetTopEx();

        var height = this.ChartBorder.GetHeightEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetBottomEx() - height;
    }

    //Y刻度画在内部
    this.DrawInsideHorizontal = function () 
    {
        if (this.IsHScreen === true) return;  //横屏不画
        if (this.IsShowYText[0] === false && this.IsShowYText[1] === false) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;
        if (borderLeft >= 10) return;

        if ((borderLeft < 10 && this.IsShowYText[0] === true) || (borderRight < 10 && this.IsShowYText[1] === true))
        {
            var yPrev = null; //上一个坐标y的值
            for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
            {
                var item = this.HorizontalInfo[i];
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev !=null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && borderLeft < 10 && this.IsShowYText[0] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    if (y >= bottom - 2) this.Canvas.textBaseline = 'bottom';
                    else if (y <= top + 2) this.Canvas.textBaseline = 'top';
                    else this.Canvas.textBaseline = "middle";
                    var textObj = { X: left, Y: y, Text: { BaseLine: this.Canvas.textBaseline, Font: this.Canvas.font, Value: item.Message[0] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj)) this.Canvas.fillText(item.Message[0], left + 1, y);
                }

                if (item.Message[1] != null && borderRight < 10 && this.IsShowYText[1] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    if (y >= bottom - 2) this.Canvas.textBaseline = 'bottom';
                    else if (y <= top + 2) this.Canvas.textBaseline = 'top';
                    else this.Canvas.textBaseline = "middle";
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj))
                        this.Canvas.fillText(item.Message[1], right - 1, y);
                }

                yPrev = y;
            }
        }
    }

    //画Y轴
    this.DrawHorizontal = function () 
    {
        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;

        this.Canvas.save();
        this.Canvas.setLineDash([2, 2]);   //虚线

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && yPrev != null && Math.abs(y - yPrev) <this.MinYDistance) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle = item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(left, ToFixedPoint(y));
            this.Canvas.lineTo(right, ToFixedPoint(y));
            this.Canvas.stroke();

            if (y >= bottom - 2) this.Canvas.textBaseline = 'bottom';
            else if (y <= top + 2) this.Canvas.textBaseline = 'top';
            else this.Canvas.textBaseline = "middle";

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderLeft > 10 && this.IsShowYText[0] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                this.Canvas.fillText(item.Message[0], left - 2, y);
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderRight > 10 && this.IsShowYText[1] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "left";
                this.Canvas.fillText(item.Message[1], right + 2, y);
            }

            yPrev = y;
        }

        this.Canvas.restore();
    }

  this.GetXFromIndex = function (index) {
    var count = this.XPointCount;

    if (count == 1) {
      if (index == 0) return this.ChartBorder.GetLeft();
      else return this.ChartBorder.GetRight();
    }
    else if (count <= 0) {
      return this.ChartBorder.GetLeft();
    }
    else if (index >= count) {
      return this.ChartBorder.GetRight();
    }
    else {
      var offset = this.ChartBorder.GetLeft() + this.ChartBorder.GetWidth() * index / count;
      return offset;
    }
  }

    //画X轴
    this.DrawVertical = function ()
    {
        var top = this.ChartBorder.GetTopTitle();
        var bottom = this.ChartBorder.GetBottom();
        var right = this.ChartBorder.GetRight();

        var yText = bottom;
        if (this.XMessageAlign == 'bottom') yText = this.ChartBorder.GetChartHeight();
        else this.XMessageAlign = 'top';

        var xPrev = null; //上一个坐标x的值
        let xPrevTextRight = null;
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x > right) break;
            if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

            if (this.IsShowXLine && this.VerticalInfo[i].LineType > 0) 
            {
                this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), top);
                this.Canvas.lineTo(ToFixedPoint(x), bottom);
                this.Canvas.stroke();
            }

            if (this.VerticalInfo[i].Message[0] != null && this.ChartBorder.Bottom > 5) 
            {
                let xTextRight = null;
                let xTextLeft = null;
                if (this.VerticalInfo[i].Font != null)
                this.Canvas.font = this.VerticalInfo[i].Font;
                this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;

                var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
                if (x < testWidth / 2) 
                {
                    this.Canvas.textAlign = "left";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else if ((x + testWidth / 2) >= this.ChartBorder.GetChartWidth()) 
                {
                    this.Canvas.textAlign = "right";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth;
                    xTextLeft = x;
                }
                else 
                {
                    this.Canvas.textAlign = "center";
                    this.Canvas.textBaseline = this.XMessageAlign;
                    xTextRight = x + testWidth / 2;
                    xTextLeft = x - testWidth / 2;
                }

                if (xPrevTextRight != null && xPrevTextRight > xTextLeft) continue;

                this.Canvas.fillText(this.VerticalInfo[i].Message[0], x, yText + this.XBottomOffset);
                xPrevTextRight = xTextRight;
            }

            xPrev = x;
        }
    }

    this.GetYData = function (y) //Y坐标转y轴数值
    {
        if (y < this.ChartBorder.GetTopEx()) return this.HorizontalMax;
        if (y > this.ChartBorder.GetBottomEx()) return this.HorizontalMin;

        return (this.ChartBorder.GetBottomEx() - y) / this.ChartBorder.GetHeightEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    this.GetXData = function (x) //X坐标转x轴数值
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount;

        return (x - this.ChartBorder.GetLeft()) * (this.XPointCount * 1.0 / this.ChartBorder.GetWidth());
    }

    this.DrawCustomItem = function (item) //显示自定义刻度
    {
        //if (this.IsHScreen === true) return;  //横屏不画
        if (!item.Message[1] && !item.Message[0]) return;
        if (item.Value > this.HorizontalMax || item.Value < this.HorizontalMin) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var bottom = this.ChartBorder.GetBottom();
        var top = this.ChartBorder.GetTopTitle();
        var borderRight = this.ChartBorder.Right;
        var borderLeft = this.ChartBorder.Left;
        var titleHeight = this.ChartBorder.TitleHeight;

        if (this.IsHScreen) 
        {
            borderLeft = this.ChartBorder.Top;
            borderRight = this.ChartBorder.Bottom;
            top = this.ChartBorder.GetTop();
            bottom = this.ChartBorder.GetBottom();
        }

        var textHeight = 18;
        var y = this.GetYFromData(item.Value);

        if (item.Message[0]) 
        {
            if (borderLeft < 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textWidth = this.Canvas.measureText(item.Message[0]).width + 2;
                var bgColor = item.LineColor;
                var rgb = this.RGBToStruct(item.LineColor);
                if (rgb) bgColor = `rgba(${rgb.R}, ${rgb.G}, ${rgb.B}, ${g_JSChartResource.FrameLatestPrice.BGAlpha})`;   //内部刻度 背景增加透明度
                this.Canvas.fillStyle = bgColor;
                if (this.IsHScreen) 
                {
                    var bgTop = top;
                    var textLeft = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(textLeft, bgTop, textHeight, textWidth);
                    this.DrawHScreenText({ X: y, Y: bgTop }, { Text: item.Message[0], Color: item.TextColor, XOffset: 1, YOffset: 2 });
                    if (item.LineType != -1) this.DrawDotLine(bgTop + textWidth, bottom, y, item.LineColor);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    var textLeft = left + 1;
                    this.Canvas.fillRect(textLeft, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[0], textLeft + 1, y);
                    if (item.LineType != -1) this.DrawDotLine(textLeft + textWidth, right, y, item.LineColor);
                }
            }
            else 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "right";
                this.Canvas.textBaseline = "middle";
                var textWidth = this.Canvas.measureText(item.Message[0]).width + 2;
                this.Canvas.fillStyle = item.LineColor;
                if (this.IsHScreen) 
                {
                    var bgTop = top - textWidth;
                    var textLeft = y - textHeight / 2 - 1 ;
                    this.Canvas.fillRect(textLeft, bgTop, textHeight, textWidth);
                    this.DrawHScreenText({ X: y, Y: bgTop }, { Text: item.Message[0], Color: item.TextColor, XOffset: 1, YOffset: 2 });
                    if (item.LineType != -1) this.DrawDotLine(bgTop + textWidth, bottom, y, item.LineColor);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(left - textWidth, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[0], left - 1, y);

                    if (item.LineType != -1) this.DrawDotLine(left, right, y, item.LineColor);
                }
            }
        }
        else if (item.Message[1]) 
        {
            if (borderRight < 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textWidth = this.Canvas.measureText(item.Message[1]).width + 2;
                var bgColor = item.LineColor;
                var rgb = this.RGBToStruct(item.LineColor);
                if (rgb) bgColor = `rgba(${rgb.R}, ${rgb.G}, ${rgb.B}, ${g_JSChartResource.FrameLatestPrice.BGAlpha})`;   //内部刻度 背景增加透明度
                this.Canvas.fillStyle = bgColor;
                if (this.IsHScreen) 
                {
                    var bgTop = bottom - textWidth;
                    var textLeft = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(textLeft, bgTop, textHeight, textWidth);
                    this.DrawHScreenText({ X: y, Y: bgTop }, { Text: item.Message[1], Color: item.TextColor, XOffset: 1, YOffset: 2 });
                    if (item.LineType != -1) this.DrawDotLine(top, bgTop, y, item.LineColor);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    var textLeft = right - textWidth;
                    this.Canvas.fillRect(textLeft, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[1], textLeft + 1, y);
                    if (item.LineType != -1) this.DrawDotLine(left, textLeft, y, item.LineColor);
                }
               
            }
            else 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                this.Canvas.textAlign = "left";
                this.Canvas.textBaseline = "middle";
                var textWidth = this.Canvas.measureText(item.Message[1]).width + 2;
                this.Canvas.fillStyle = item.LineColor;
                if (this.IsHScreen) 
                {
                    var bgTop = bottom;
                    var textLeft = y - textHeight / 2 - 1 ;
                    this.Canvas.fillRect(textLeft, bgTop, textHeight, textWidth);
                    this.DrawHScreenText({ X: y, Y: bgTop }, { Text: item.Message[1], Color: item.TextColor, XOffset: 1 , YOffset: 2 });
                    if (item.LineType != -1) this.DrawDotLine(top, bgTop, y, item.LineColor);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(right, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[1], right + 1, y);
                    if (item.LineType != -1) this.DrawDotLine(left, right, y, item.LineColor);
                }
            }
        }
    }

    this.DrawDotLine = function (left, right, y, color) 
    {
        this.Canvas.save();
        this.Canvas.strokeStyle = color;
        this.Canvas.setLineDash([5, 5]);   //虚线
        this.Canvas.beginPath();
        if (this.IsHScreen) 
        {
            this.Canvas.moveTo(ToFixedPoint(y), left);
            this.Canvas.lineTo(ToFixedPoint(y), right);
        }
        else
        {
            this.Canvas.moveTo(left, ToFixedPoint(y));
            this.Canvas.lineTo(right, ToFixedPoint(y));
        }
        this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.RGBToStruct = function (rgb) 
    {
        if (/^(rgb|RGB)/.test(rgb)) 
        {
            var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var result = {};
            if (aColor.length != 3) return null;

            result.R = Number(aColor[0]);
            result.G = Number(aColor[1]);
            result.B = Number(aColor[2]);
            return result;
        }
        return null;
    }

    this.DrawHScreenText = function (center, data) 
    {
        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillStyle = data.Color;

        this.Canvas.save();
        this.Canvas.translate(center.X, center.Y);
        this.Canvas.rotate(90 * Math.PI / 180);
        this.Canvas.fillText(data.Text, data.XOffset, data.YOffset);
        this.Canvas.restore();
    }
}

function MinuteFrame() 
{
    this.newMethod = AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.MinXDistance = 10;
    this.CustomHorizontalInfo = [];

    this.DrawFrame = function () 
    {
        this.SplitXYCoordinate();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate = function () 
    {
        if (this.XYSplit == false) return;
        if (this.YSplitOperator != null) this.YSplitOperator.Operator();
        if (this.XSplitOperator != null) this.XSplitOperator.Operator();
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount - 1;

        if (count == 1) 
        {
            if (index == 0) return this.ChartBorder.GetLeft();
            else return this.ChartBorder.GetRight();
        }
        else if (count <= 0) 
        {
            return this.ChartBorder.GetLeft();
        }
        else if (index >= count) 
        {
            return this.ChartBorder.GetRight();
        }
        else 
        {
            var offset = this.ChartBorder.GetLeft() + this.ChartBorder.GetWidth() * index / count;
            return offset;
        }
    }

    //X坐标转x轴数值
    this.GetXData = function (x) 
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount;

        return (x - this.ChartBorder.GetLeft()) * (this.XPointCount * 1.0 / this.ChartBorder.GetWidth());
    }

    this.DrawCustomHorizontal = function ()    //Y轴刻度定制显示
    {
        for (var i in this.CustomHorizontalInfo) 
        {
            var item = this.CustomHorizontalInfo[i];
            switch (item.Type) 
            {
                case 0:
                case 1:
                    this.DrawCustomItem(item);  //自定义刻度
                    break;
            }
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
        if (x < this.ChartBorder.GetLeftEx()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeftEx()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
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
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

            this.Canvas.strokeStyle = item.LineColor;
            this.Canvas.beginPath();
            this.Canvas.moveTo(ToFixedPoint(y), top);
            this.Canvas.lineTo(ToFixedPoint(y), bottom);
            this.Canvas.stroke();

            if (y >= right - 2) 
            {
                this.Canvas.textBaseline = 'top';
                y = right;
            }
            else if (y <= left + 2) 
            {
                this.Canvas.textBaseline = 'bottom';
                y=left;
                if (y != null && Math.abs(y - yPrev) < 2*this.MinYDistance) continue;  //两个坐标在近了 就不画了
            }
            else 
            {
                this.Canvas.textBaseline = "middle";
            }

            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                this.Canvas.fillStyle = item.TextColor;
                this.Canvas.textAlign = "right";
                //this.Canvas.textBaseline = "middle";

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
                //this.Canvas.textBaseline = "middle";
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
  this.DrawVertical = function () {
    var left = this.ChartBorder.GetLeft();
    var right = this.ChartBorder.GetRightEx();
    var bottom = this.ChartBorder.GetBottom();

    var xPrev = null; //上一个坐标x的值
    for (var i in this.VerticalInfo) {
      var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
      if (x > bottom) break;
      if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

      this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
      this.Canvas.beginPath();
      this.Canvas.moveTo(left, ToFixedPoint(x));
      this.Canvas.lineTo(right, ToFixedPoint(x));
      this.Canvas.stroke();

      if (this.VerticalInfo[i].Message[0] != null) {
        if (this.VerticalInfo[i].Font != null)
          this.Canvas.font = this.VerticalInfo[i].Font;

        this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
        var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
        if (x < testWidth / 2) {
          this.Canvas.textAlign = "left";
          this.Canvas.textBaseline = "top";
        }
        else if ((x + testWidth / 2) >= this.ChartBorder.GetChartHeight()) {
          this.Canvas.textAlign = "right";
          this.Canvas.textBaseline = "top";
        }
        else {
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
    this.newMethod = AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ToolbarID = Guid();  //工具条Div id
    this.ModifyIndex = true;  //是否显示'改参数'菜单
    this.ChangeIndex = true;  //是否显示'换指标'菜单
    this.CustomHorizontalInfo = [];

    this.LastCalculateStatus = { Width: 0, XPointCount: 0 };    //最后一次计算宽度的状态

    //定制X轴刻度 
    //Type:0,  Date:, Time: , Name:名字,       Line:{ Color:线段颜色, Type:线段类型 0 直线 1 虚线 }
    //Type: 1, Space: 第几个空白间距, Name:名字, Line: { Color: 线段颜色, Type: 线段类型 0 直线 1 虚线 }
    this.CustomVerticalInfo = [];               
    this.DrawCustomVerticalEvent;
    this.RightSpaceCount = 0;

    this.DrawFrame = function () 
    {
        //console.log('[KLineFrame::DrawFrame]', this.SizeChange);
        this.SplitXYCoordinate();
        if (this.SizeChange == true) this.CalculateDataWidth();
        if (this.DrawOtherChart) this.DrawOtherChart();

        this.DrawTitleBG();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex = function (index) 
    {
        if (index < 0) index = 0;
        if (index > this.xPointCount - 1) index = this.xPointCount - 1;

        var offset = this.ChartBorder.GetLeft() + 2 + this.DistanceWidth / 2 + this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) { offset += this.DistanceWidth + this.DataWidth; }
        return offset;
    }

    //X坐标转x轴数值
    this.GetXData = function (x) 
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRight();
        var distanceWidth = this.DistanceWidth;
        var dataWidth = this.DataWidth;

        var index = 0;
        var xPoint = left + dataWidth + distanceWidth;
        while (xPoint < right && index < 10000)  //自己算x的数值
        {
            if (xPoint > x) break;
            xPoint += (dataWidth + distanceWidth);
            ++index;
        }

        //var test=(x-this.ChartBorder.GetLeft())*(this.XPointCount*1.0/this.ChartBorder.GetWidth());
        return index;
    }

    this.DrawCustomHorizontal = function ()    //Y轴刻度定制显示
    {
        for (var i in this.CustomHorizontalInfo) 
        {
            var item = this.CustomHorizontalInfo[i];
            switch (item.Type) 
            {
                case 0: //最新价格刻度
                case 1: //固定价格刻度
                    this.DrawCustomItem(item);
                    break;
            }
        }
    }

    this.DrawCustomVerticalItem = function (item) {
        this.Canvas.save();
        if (item.Data.Line.Type == 1) this.Canvas.setLineDash([5, 5]);   //虚线
        this.Canvas.strokeStyle = item.Data.Line.Color;
        this.Canvas.beginPath();
        if (item.IsHScreen) {
            this.Canvas.moveTo(item.Top, ToFixedPoint(item.X));
            this.Canvas.lineTo(item.Bottom, ToFixedPoint(item.X));
        }
        else {
            this.Canvas.moveTo(ToFixedPoint(item.X), item.Top);
            this.Canvas.lineTo(ToFixedPoint(item.X), item.Bottom);
        }
        this.Canvas.stroke();
        this.Canvas.restore();
    }

    this.DrawCustomVertical = function ()  //X轴定制刻度显示
    {
        if (!this.CustomVerticalInfo) return;
        if (this.CustomVerticalInfo.length <= 0) return;
        if (!this.Data) return;

        var isHScreen = this.IsHScreen;
        var top = this.ChartBorder.GetTopEx();
        var bottom = this.ChartBorder.GetBottomEx();

        var dataWidth = this.DataWidth;
        var distanceWidth = this.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;

        if (isHScreen) 
        {
            xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
            top = this.ChartBorder.GetLeftEx();
            bottom = this.ChartBorder.GetRightEx();
        }

        var j = 0;
        for (var i = this.Data.DataOffset; i < this.Data.Data.length && j < this.XPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            var kItem = this.Data.Data[i];
            for (var k in this.CustomVerticalInfo) 
            {
                var item = this.CustomVerticalInfo[k];
                if (item.Type != 0) continue;

                if (IFrameSplitOperator.IsNumber(item.Time)) 
                {
                    if (kItem.Date != item.Date || kItem.Time != item.Time) continue;
                }
                else 
                {
                    if (kItem.Date != item.Date) continue;
                }

                var left = xOffset;
                var right = xOffset + dataWidth;
                var x = left + (right - left) / 2;

                var DrawData = { X: x, Top: top, Bottom: bottom, Data: item, IsHScreen: isHScreen };
                this.DrawCustomVerticalItem(DrawData);
                if (this.DrawCustomVerticalEvent)
                    this.DrawCustomVerticalEvent.Callback(this.DrawCustomVerticalEvent, DrawData, this);

                break;
            }
        }

        for (var i = 1; j < this.XPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) 
        {
            for (var k in this.CustomVerticalInfo) 
            {
                var item = this.CustomVerticalInfo[k];
                if (item.Type != 1) continue;
                if (item.Space != i) continue;

                var left = xOffset;
                var right = xOffset + dataWidth;
                var x = left + (right - left) / 2;

                var DrawData = { X: x, Top: top, Bottom: bottom, Data: item, IsHScreen: isHScreen };
                this.DrawCustomVerticalItem(DrawData);
                if (this.DrawCustomVerticalEvent)
                    this.DrawCustomVerticalEvent.Callback(this.DrawCustomVerticalEvent, DrawData, this);

                break;
            }
        }
    }

    this.CalculateDataWidth = function ()   //计算数据宽度
    {
        if (this.XPointCount < 2) return;
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;    //预留4个像素 防止最后1个柱子不够画

        for (var i = 0; i < ZOOM_SEED.length; ++i) 
        {
            let barWidth = ZOOM_SEED[i][0];         //数据宽度
            let distanceWidth = ZOOM_SEED[i][1];    //间距宽度
            if ((ZOOM_SEED[i][0] + ZOOM_SEED[i][1]) * this.XPointCount < width) 
            {
                this.ZoomIndex = i;
                this.DataWidth = ZOOM_SEED[i][0];
                this.DistanceWidth = ZOOM_SEED[i][1];
                this.TrimKLineDataWidth(width);

                console.log(`[KLineFrame::CalculateDataWidth] ZoomIndex=${this.ZoomIndex} DataWidth=${this.DataWidth} DistanceWidth=${this.DistanceWidth}` );
                return;
            }
        }

        //太多了 就平均分了
        this.ZoomIndex = ZOOM_SEED.length - 1;
        this.DataWidth = width / this.XPointCount;
        this.DistanceWidth = 0;
    }

    this.TrimKLineDataWidth = function (width) 
    {
        var zoom = ZOOM_SEED[this.ZoomIndex];
        var dataWidth = ZOOM_SEED[this.ZoomIndex][0];
        var distanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        if (dataWidth == 1 && distanceWidth == 0) 
        {
            this.DataWidth = width / this.XPointCount;
            return;
        }

        if (zoom[0]<4) //最后2个缩放,调整间距不调整数据宽度, 数据都是画竖线的
        {
            while (true) 
            {
                if ((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width) 
                {
                    this.DistanceWidth -= 0.01;
                    break;
                }
                this.DistanceWidth += 0.01;
            }
        }
        else
        {
            while (true) 
            {
                if ((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width) 
                {
                    this.DataWidth -= 0.01;
                    break;
                }
                this.DataWidth += 0.01;
            }
        }
    }

    this.IsOverlayMaxMin = function (obj) //当前坐标信息 是否覆盖最大 最小值输出
    {
        if (!this.ChartKLine) return false;
        if (!this.ChartKLine.Max || !this.ChartKLine.Min) return false;

        var textWidth = this.Canvas.measureText(obj.Text.Value).width + 4;    //刻度文字宽度
        var max = this.ChartKLine.Max, min = this.ChartKLine.Min;
        var isOverlayMax = false, isOverlayMin = false;
        const textHeight = 20;    //字体高度
        if (max.X >= obj.X && max.X <= obj.X + textWidth) 
        {
            var y1 = max.Y + textHeight, y2 = max.Y - textHeight;
            if ((y1 >= obj.Y - textHeight && y1 <= obj.Y + textHeight) || (y2 >= obj.Y - textHeight && y2 <= obj.Y + textHeight))
                isOverlayMax = true;
        }

        if (isOverlayMax == true) return true;

        if (min.X >= obj.X && min.X <= obj.X + textWidth) //最小值X 坐标不在 刻度文字范围内
        {
            var y1 = min.Y + textHeight, y2 = min.Y - textHeight;
            if ((y1 >= obj.Y - textHeight && y1 <= obj.Y + textHeight) || (y2 >= obj.Y - textHeight && y2 <= obj.Y + textHeight))
                isOverlayMin = true;
        }

        return isOverlayMax || isOverlayMin;
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate = function () 
    {
        if (this.XYSplit == false) return;
        if (this.YSplitOperator != null) this.YSplitOperator.Operator();
        if (this.XSplitOperator != null) this.XSplitOperator.Operator();
    }

    this.CalculateCount = function (zoomIndex) 
    {
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        return parseInt(width / (ZOOM_SEED[zoomIndex][0] + ZOOM_SEED[zoomIndex][1]));
    }

    this.ZoomUp = function (cursorIndex) 
    {
        if (this.ZoomIndex <= 0) return false;
        if (this.Data.DataOffset < 0) return false;
        var dataCount = this.Data.Data.length;
        var maxDataCount = dataCount + this.RightSpaceCount;

        var rightSpaceCount = 0;
        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        if (lastDataIndex >= dataCount)
         {
            rightSpaceCount = lastDataIndex - (this.Data.Data.length - 1);    //计算右边预留空间
            lastDataIndex = this.Data.Data.length - 1;
            if (rightSpaceCount > this.RightSpaceCount) rightSpaceCount = this.RightSpaceCount;
        }

        var xPointCount = this.CalculateCount(this.ZoomIndex-1);

        --this.ZoomIndex;
        this.XPointCount = xPointCount;
        if (xPointCount >= maxDataCount) 
        {
            xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
        }

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        this.TrimKLineDataWidth(width);

        this.LastCalculateStatus.XPointCount = this.XPointCount;
        cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;

        return true;
    }

    this.ZoomDown = function (cursorIndex) 
    {
        if (this.ZoomIndex + 1 >= ZOOM_SEED.length) return false;
        if (this.Data.DataOffset < 0) return false;
        var dataCount = this.Data.Data.length;
        var maxDataCount = dataCount + this.RightSpaceCount;
        if (this.XPointCount >= dataCount) return false;

        var rightSpaceCount = 0;
        var lastDataIndex = this.Data.DataOffset + this.XPointCount - 1;    //最右边的数据索引
        if (lastDataIndex >= this.Data.Data.length) 
        {
            rightSpaceCount = lastDataIndex - (this.Data.Data.length - 1);    //计算右边预留空间
            lastDataIndex = this.Data.Data.length - 1;
            if (rightSpaceCount > this.RightSpaceCount) rightSpaceCount = this.RightSpaceCount;
        }

        var xPointCount = this.CalculateCount(this.ZoomIndex + 1);
        var lastCursorIndex = this.Data.DataOffset + cursorIndex.Index;

        ++this.ZoomIndex;
        if (xPointCount >= maxDataCount) 
        {
            xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
        }

        this.DataWidth = ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth = ZOOM_SEED[this.ZoomIndex][1];
        var width = this.GetFrameWidth() - g_JSChartResource.FrameMargin;
        this.TrimKLineDataWidth(width);

        this.LastCalculateStatus.XPointCount = this.XPointCount;
        cursorIndex.Index = lastCursorIndex - this.Data.DataOffset;

        return true;
    }

    this.GetFrameWidth = function () 
    {
        if (this.IsHScreen) return this.ChartBorder.GetHeight();
        return this.ChartBorder.GetWidth();
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
        if (this.IsShowYText[0] === false && this.IsShowYText[1] === false) return;

        var left = this.ChartBorder.GetLeft();
        var right = this.ChartBorder.GetRightEx();
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;
        var titleHeight = this.ChartBorder.TitleHeight;
        var pixelTatio = 1;

        var isDrawLeft = (borderTop < 10 * pixelTatio || this.YTextPosition[0] == 2) && this.IsShowYText[0] === true;
        var isDrawRight = (borderBottom < 10 * pixelTatio || this.YTextPosition[1] == 2) && this.IsShowYText[1] === true;

        if (isDrawLeft || isDrawRight) 
        {
            var yPrev = null; //上一个坐标y的值
            for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
            {
                var item = this.HorizontalInfo[i];
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev != null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && isDrawLeft) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";

                    var textObj = { X: left, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[0] } };
                    var xText = y, yText = top;
                    this.Canvas.save();
                    this.Canvas.translate(xText, yText);
                    this.Canvas.rotate(90 * Math.PI / 180);
                    this.Canvas.fillText(item.Message[0], -2, 0);
                    this.Canvas.restore();
                }

                if (item.Message[1] != null && isDrawRight) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    if (y >= right - 2) this.Canvas.textBaseline = 'top';
                    else if (y <= left + 2) this.Canvas.textBaseline = 'bottom';
                    else this.Canvas.textBaseline = "middle";
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: y, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };

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
        if (value <= this.HorizontalMin) return this.ChartBorder.GetLeftEx();
        if (value >= this.HorizontalMax) return this.ChartBorder.GetRightEx();

        var width = this.ChartBorder.GetWidthEx() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
        return this.ChartBorder.GetLeftEx() + width;
    }

  //画Y轴
  this.DrawHorizontal = function () {
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
      if (item.Message[0] != null && borderTop > 10) {
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
      if (item.Message[1] != null && borderBottom > 10) {
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
  this.DrawVertical = function () {
    var left = this.ChartBorder.GetLeft();
    var right = this.ChartBorder.GetRightTitle();
    var bottom = this.ChartBorder.GetBottom();

    var xPrev = null; //上一个坐标x的值
    for (var i in this.VerticalInfo) {
      var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
      if (x >= bottom) break;
      if (xPrev != null && Math.abs(x - xPrev) < 80) continue;

      this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
      this.Canvas.beginPath();
      this.Canvas.moveTo(left, ToFixedPoint(x));
      this.Canvas.lineTo(right, ToFixedPoint(x));
      this.Canvas.stroke();

      if (this.VerticalInfo[i].Message[0] != null) {
        if (this.VerticalInfo[i].Font != null)
          this.Canvas.font = this.VerticalInfo[i].Font;

        this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
        var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
        if (x < testWidth / 2) {
          this.Canvas.textAlign = "left";
          this.Canvas.textBaseline = "top";
        }
        else {
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
        if (x < this.ChartBorder.GetLeftEx()) return this.HorizontalMin;
        if (x > this.ChartBorder.GetRightEx()) return this.HorizontalMax;

        return (x - this.ChartBorder.GetLeftEx()) / this.ChartBorder.GetWidthEx() * (this.HorizontalMax - this.HorizontalMin) + this.HorizontalMin;
    }

    //X坐标转x轴数值
    this.GetXData = function (y) 
    {
        if (y <= this.ChartBorder.GetTop()) return 0;
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount;

        return (y - this.ChartBorder.GetTop()) * (this.XPointCount * 1.0 / this.ChartBorder.GetHeight());
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
    this.SubFrame = new Array();              //SubFrameItem 数组
    this.SizeChange = true;                   //大小是否改变
    this.ChartBorder;
    this.Canvas;                            //画布
    this.ScreenImagePath;                   //截图路径  
    this.ScreenImageData=null;                   //截图数据         
    this.Data;                              //主数据
    this.Position;                          //画布的位置
    this.SizeChange = true;
    this.SnapshotID=0;
    this.CurrentSnapshotID=0;
    this.SnapshotStatus=0;                  //0空闲 1工作

    this.CalculateChartBorder = function ()    //计算每个子框架的边框信息
    {
        if (this.SubFrame.length <= 0) return;

        var top = this.ChartBorder.GetTop();
        var height = this.ChartBorder.GetHeight();
        var totalHeight = 0;

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            totalHeight += item.Height;
        }

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.ChartBorder.Top = top;
            item.Frame.ChartBorder.Left = this.ChartBorder.Left;
            item.Frame.ChartBorder.Right = this.ChartBorder.Right;
            var frameHeight = height * (item.Height / totalHeight) + top;
            item.Frame.ChartBorder.Bottom = this.ChartBorder.GetChartHeight() - frameHeight;
            top = frameHeight;
        }

    }

    this.Draw = function () 
    {
        if (this.SizeChange === true) this.CalculateChartBorder();

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            if (item.Height <= 0) continue;

            item.Frame.Draw();
        }

        this.SizeChange = false;
    }

    this.DrawLock = function () 
    {
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.DrawLock();
        }
    }

    this.DrawInsideHorizontal = function () {
        for (var i in this.SubFrame) {
            var item = this.SubFrame[i];
            item.Frame.DrawInsideHorizontal();
        }
    }

    this.DrawCustomHorizontal = function ()    //定制Y坐标
    {
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            if (item.Frame.DrawCustomHorizontal) item.Frame.DrawCustomHorizontal();
        }
    }

    this.DrawCustomVertical = function (event)  //定制X坐标
    {
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.DrawCustomVerticalEvent = event;
            if (item.Frame.DrawCustomVertical) item.Frame.DrawCustomVertical();
        }
    }

    this.SetSizeChage = function (sizeChange) 
    {
        this.SizeChange = sizeChange;

        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.SizeChange = sizeChange;
        }

        //画布的位置
        this.Position = 
        {
            X: this.ChartBorder.UIElement.offsetLeft,
            Y: this.ChartBorder.UIElement.offsetTop,
            W: this.ChartBorder.UIElement.clientWidth,
            H: this.ChartBorder.UIElement.clientHeight
        };
    }

    this.SetDrawOtherChart = function (callback)  //在画完框架以后调用的扩展画法
    {
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            item.Frame.DrawOtherChart = callback;
        }
    }

    this.Snapshot=function(type)
    {
        if (type == 1) this.SnapshotImageData();
        else this.SnapshotImagePath();
    }

    //图形快照
    this.SnapshotImagePath = function () 
    {
        var self = this;
        var width = this.ChartBorder.GetChartWidth();
        var height = this.ChartBorder.GetChartHeight();

        //console.log('[HQTradeFrame::SnapshotImageData][ID=' + this.ChartBorder.UIElement.ID + '] invoke canvasToTempFilePath' + '(width=' + width + ',height=' + height + ')' + ' SnapshotStatus='+ this.SnapshotStatus);
        //if (this.SnapshotStatus==1) return;

        ++this.SnapshotID;
        var id = this.SnapshotID;
        this.SnapshotStatus=1;
        if (this.Canvas && this.Canvas.DomNode) //新版2D画布
        {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                canvas: this.Canvas.DomNode,
                success: function (res) {
                    self.ScreenImagePath = res.tempFilePath;
                    self.SnapshotStatus = 0;
                    self.CurrentSnapshotID = id;
                    console.log(`[HQTradeFrame::SnapshotImagePath] SnapshotID(${self.SnapshotID}, ${self.CurrentSnapshotID}), Path=${res.tempFilePath}`);
                }
            })
        }
        else
        {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                canvasId: this.ChartBorder.UIElement.ID,
                success: function (res) {
                    self.ScreenImagePath = res.tempFilePath;
                    self.SnapshotStatus = 0;
                    self.CurrentSnapshotID = id;
                    //console.log('[HQTradeFrame::SnapshotImagePath] SnapshotID(' + self.SnapshotID + ',' + self.CurrentSnapshotID + ') Path ='+ res.tempFilePath);
                }
            })
        }
    }

    this.SnapshotImageData=function()
    {
        var self = this;
        var width = this.ChartBorder.GetChartWidth();
        var height = this.ChartBorder.GetChartHeight();

        console.log(`[HQTradeFrame::SnapshotImageData][ID=${this.ChartBorder.UIElement.ID} invoke canvasGetImageData(${width}, ${height}) SnapshotStatus=${this.SnapshotStatus}`);
        ++this.SnapshotID;
        var id = this.SnapshotID;
        this.SnapshotStatus = 1;

        wx.canvasGetImageData({
            canvasId: this.ChartBorder.UIElement.ID,
            x: 0,
            y: 0,
            width: width,
            height: height,
            success(res) 
            {
                self.ScreenImageData = res.data;
                self.SnapshotStatus = 0;
                self.CurrentSnapshotID = id;
                console.log(`[HQTradeFrame::SnapshotImageData] SnapshotID=${self.SnapshotID}, CurrentSnapshotID=${self.CurrentSnapshotID}, size=${res.data.length}`);
            }
        })
    }

    this.GetXData = function (x) { return this.SubFrame[0].Frame.GetXData(x); }

    this.GetYData = function (y, outObject) //outObject 可以保存返回的额外数据) 
    {
        var frame;
        for (var i in this.SubFrame) 
        {
            var item = this.SubFrame[i];
            var left = item.Frame.ChartBorder.GetLeft();
            var top = item.Frame.ChartBorder.GetTopEx();
            var width = item.Frame.ChartBorder.GetWidth();
            var height = item.Frame.ChartBorder.GetHeightEx();

            var rtItem = new Rect(left, top, width, height);
            if (rtItem.IsPointIn(left, y)) 
            {
                frame = item.Frame;
                if (outObject) outObject.FrameID = i;
                break;
            }
        }

        if (frame != null) 
        {
            var yValue=frame.GetYData(y);
            if (frame.YSplitOperator.CoordinateType == 1) //百分比坐标 右边显示百分比信息
            {
                var firstOpenPrice = frame.YSplitOperator.GetFirstOpenPrice();
                outObject.RightYValue = ((yValue - firstOpenPrice) / firstOpenPrice * 100).toFixed(2) + '%';
            }
            return yValue;
        }
    }

    this.GetXFromIndex = function (index) { return this.SubFrame[0].Frame.GetXFromIndex(index); }

    this.GetYFromData = function (value) { return this.SubFrame[0].Frame.GetYFromData(value); }

    this.ZoomUp = function (cursorIndex) 
    {
        var result = this.SubFrame[0].Frame.ZoomUp(cursorIndex);
        for (var i = 1; i < this.SubFrame.length; ++i) 
        {
            this.SubFrame[i].Frame.XPointCount = this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex = this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth = this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth = this.SubFrame[0].Frame.DistanceWidth;
        }

        return result;
    }

    this.ZoomDown = function (cursorIndex) 
    {
        var result = this.SubFrame[0].Frame.ZoomDown(cursorIndex);
        for (var i = 1; i < this.SubFrame.length; ++i) 
        {
            this.SubFrame[i].Frame.XPointCount = this.SubFrame[0].Frame.XPointCount;
            this.SubFrame[i].Frame.ZoomIndex = this.SubFrame[0].Frame.ZoomIndex;
            this.SubFrame[i].Frame.DataWidth = this.SubFrame[0].Frame.DataWidth;
            this.SubFrame[i].Frame.DistanceWidth = this.SubFrame[0].Frame.DistanceWidth;
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

    this.GetCurrentPageSize = function ()  //获取当前页显示的数据个数
    {
        if (this.SubFrame.length <= 0) return null;
        var item = this.SubFrame[0];
        if (!item || !item.Frame) return null;

        return item.Frame.XPointCount;
    }
}

//行情框架横屏
function HQTradeHScreenFrame() {
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

    for (var i in this.SubFrame) {
      var item = this.SubFrame[i];
      totalHeight += item.Height;
    }

    for (var i in this.SubFrame) {
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

  this.GetYData = function (x, outObject) {
    var frame;
    for (var i in this.SubFrame) {
      var item = this.SubFrame[i];
      var left = item.Frame.ChartBorder.GetLeftEx();
      var top = item.Frame.ChartBorder.GetTop();
      var width = item.Frame.ChartBorder.GetWidthEx();
      var height = item.Frame.ChartBorder.GetHeight();

      var rtItem = new Rect(left, top, width, height);
      if (rtItem.IsPointIn(x, top)) {
        frame = item.Frame;
        if (outObject) outObject.FrameID = i;
        break;
      }
    }

    if (frame != null) return frame.GetYData(x);
  }
}

//一般的图形框架
function SimpleChartFrame() {
  this.newMethod = AverageWidthFrame;   //派生
  this.newMethod();
  delete this.newMethod;

  this.ScreenImageData;                   //截图
  this.Position;                          //画布的位置

  this.IsShowBorder = false;                //是否显示边框
  this.IsShowVertical = false;              //是否显示X轴
  this.XFontType = 0;                       //X轴文本文字类型

  this.MaxDistanceWidth = 4;

  this.BarCount = 0;    //多柱子个数

  this.Draw = function () {
    this.DrawFrame();
    if (this.IsShowBorder) this.DrawBorder();

    this.SizeChange = false;
    this.XYSplit = false;
  }

  this.DrawFrame = function () {
    if (this.XPointCount > 0) {
      let dInterval = this.ChartBorder.GetWidth() / (10 * this.XPointCount); //分6份, 数据4 间距2
      this.DistanceWidth = 4 * dInterval;
      this.DataWidth = 6 * dInterval;

      if (this.DistanceWidth > this.MaxDistanceWidth) {
        this.DistanceWidth = this.MaxDistanceWidth;
        dInterval = this.ChartBorder.GetWidth() / this.XPointCount;
        this.DataWidth = dInterval - this.MaxDistanceWidth;
      }
    }

    this.SplitXYCoordinate();
    this.DrawHorizontal();
    this.DrawVertical();
  }

  this.GetXFromIndex = function (index) {
    if (index < 0) index = 0;
    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

    var offset = this.ChartBorder.GetLeft() + 2 + this.DistanceWidth / 2 + this.DataWidth / 2;
    for (var i = 1; i <= index; ++i) {
      offset += this.DistanceWidth + this.DataWidth;
    }

    return offset;
  }

  //分割x,y轴坐标信息
  this.SplitXYCoordinate = function () {
    if (this.XYSplit == false) return;
    if (this.YSplitOperator != null) this.YSplitOperator.Operator();
    if (this.XSplitOperator != null) this.XSplitOperator.Operator();
  }

  //画X轴
  this.DrawVertical = function () {
    var top = this.ChartBorder.GetTopEx();
    var bottom = this.ChartBorder.GetBottom();
    var right = this.ChartBorder.GetRight();

    var xPrev = null; //上一个坐标x的值
    for (var i in this.VerticalInfo) {
      var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
      if (x >= right) break;
      if (this.XFontType == 1) {
        if (xPrev != null && Math.abs(x - xPrev) < 20) continue;
      }
      else {
        if (xPrev != null && Math.abs(x - xPrev) < 60) continue;
      }

      if (this.IsShowVertical) {
        this.Canvas.strokeStyle = this.VerticalInfo[i].LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ToFixedPoint(x), top);
        this.Canvas.lineTo(ToFixedPoint(x), bottom);
        this.Canvas.stroke();
      }

      if (this.VerticalInfo[i].Message[0] != null) {
        if (this.VerticalInfo[i].Font != null)
          this.Canvas.font = this.VerticalInfo[i].Font;

        this.Canvas.fillStyle = this.VerticalInfo[i].TextColor;
        var testWidth = this.Canvas.measureText(this.VerticalInfo[i].Message[0]).width;
        if (x < testWidth / 2) {
          this.Canvas.textAlign = "left";
          this.Canvas.textBaseline = "top";
        }
        else {
          this.Canvas.textAlign = "center";
          this.Canvas.textBaseline = "top";
        }

        if (this.XFontType == 1) {
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
  this.Snapshot = function () {
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

  this.SetSizeChage = function (sizeChange) {
    this.SizeChange = sizeChange;

    //画布的位置
    this.Position = {
      X: this.ChartBorder.UIElement.offsetLeft,
      Y: this.ChartBorder.UIElement.offsetTop,
      W: this.ChartBorder.UIElement.clientWidth,
      H: this.ChartBorder.UIElement.clientHeight
    };
  }
}

//旋转90度坐标
function Rotate90SimpleChartFrame() {
  this.newMethod = SimpleChartFrame;   //派生
  this.newMethod();
  delete this.newMethod;

  this.DrawFrame = function () {
    if (this.XPointCount > 0) {
      let dInterval = this.ChartBorder.GetHeightEx() / (10 * this.XPointCount); //分10份, 数据4 间距6
      this.DistanceWidth = 4 * dInterval;
      this.DataWidth = 6 * dInterval;

      if (this.DistanceWidth > this.MaxDistanceWidth) {
        this.DistanceWidth = this.MaxDistanceWidth;
        dInterval = this.ChartBorder.GetHeightEx() / this.XPointCount;
        this.DataWidth = dInterval - this.MaxDistanceWidth;
      }
    }

    this.SplitXYCoordinate();
    this.DrawHorizontal();
    this.DrawVertical();
  }

  this.GetXFromIndex = function (value) {
    if (value <= this.HorizontalMin) return this.ChartBorder.GetLeft();
    if (value >= this.HorizontalMax) return this.ChartBorder.GetRight();

    var width = this.ChartBorder.GetWidth() * (value - this.HorizontalMin) / (this.HorizontalMax - this.HorizontalMin);
    return this.ChartBorder.GetLeft() + width;
  }

  this.GetYFromData = function (index) {
    if (index < 0) index = 0;
    if (index > this.xPointCount - 1) index = this.xPointCount - 1;

    var offset = this.ChartBorder.GetBottom() - 2 - this.DistanceWidth / 2 - this.DataWidth / 2;
    for (var i = 1; i <= index; ++i) {
      offset -= this.DistanceWidth + this.DataWidth;
    }

    return offset;
  }

  //画Y轴
  this.DrawHorizontal = function () {
    var top = this.ChartBorder.GetTopEx();
    var bottom = this.ChartBorder.GetBottom();
    var right = this.ChartBorder.GetRight();
    var left = this.ChartBorder.GetLeft();

    var yPrev = null; //上一个坐标y的值
    for (var i in this.VerticalInfo) {
      let item = this.VerticalInfo[i];
      var y = this.GetYFromData(item.Value);
      if (y != null && yPrev != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

      if (item.Message[0] != null) {
        if (this.VerticalInfo[i].Font != null)
          this.Canvas.font = item.Font;

        this.Canvas.fillStyle = item.TextColor;
        this.Canvas.textAlign = "right";
        this.Canvas.textBaseline = "middle";
        this.Canvas.fillText(item.Message[0], left - 2, y);
      }
      yPrev = y;
    }
  }

  //画X轴
  this.DrawVertical = function () {
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
    for (var i in this.HorizontalInfo) {
      let item = this.HorizontalInfo[i];
      var x = this.GetXFromIndex(item.Value);
      if (x > right) break;
      if (xPrev != null && Math.abs(x - xPrev) < this.MinXDistance) continue;

      if (this.IsShowXLine) {
        this.Canvas.strokeStyle = item.LineColor;
        this.Canvas.beginPath();
        this.Canvas.moveTo(ToFixedPoint(x), top);
        this.Canvas.lineTo(ToFixedPoint(x), bottom);
        this.Canvas.stroke();
      }

      if (item.Message[0] != null) {
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

function TooltipData()              //提示信息
{
  this.ChartPaint;
  this.Data;
}

//缩放因子
var ZOOM_SEED = //0=柱子宽度  1=间距
[
    [48, 10], [44, 10],
    [40, 9], [36, 9],
    [32, 8], [28, 8],
    [24, 7], [20, 7],
    [18, 6], [16, 6],
    [14, 5], [12, 5],
    [8, 4],  [4, 4], [3, 3],
    [3, 1],  [2,1], [1,1], [1,0]
    /*
    [49, 10], [46, 9], [43, 8],
    [41, 7.5], [39, 7], [37, 6],
    [31, 5.5], [27, 5], [23, 4.5],
    [21, 4], [18, 3.5], [16, 3],
    [13, 2.5], [11, 2], [8, 1.5],
    [6, 1], [3, 0.6], [2.2, 0.5],
    */
    //太多了卡,
    //[1.1,0.3],
    //[0.9,0.2],	[0.7,0.15],
    //[0.6,0.12],	[0.5,0.1],	[0.4,0.08],
    //[0.3,0.06],	[0.2,0.04],	[0.1,0.02]
];



//分钟成交量
function ChartMinuteVolumBar() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.UpColor = g_JSChartResource.UpBarColor;
  this.DownColor = g_JSChartResource.DownBarColor;
  this.YClose;    //前收盘

  this.Draw = function () {
    var isHScreen = (this.ChartFrame.IsHScreen === true)
    var chartright = this.ChartBorder.GetRight();
    if (isHScreen) chartright = this.ChartBorder.GetBottom();
    var xPointCount = this.ChartFrame.XPointCount;
    var yBottom = this.ChartFrame.GetYFromData(0);
    var yPrice = this.YClose; //上一分钟的价格
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var item = this.Data.Data[i];
      if (!item || !item.Vol) continue;

      var y = this.ChartFrame.GetYFromData(item.Vol);
      var x = this.ChartFrame.GetXFromIndex(i);
      if (x > chartright) break;
      //价格>=上一分钟价格 红色 否则绿色
      this.Canvas.strokeStyle = item.Close >= yPrice ? this.UpColor : this.DownColor;
      this.Canvas.beginPath();
      if (isHScreen) {
        this.Canvas.moveTo(y, ToFixedPoint(x));
        this.Canvas.lineTo(yBottom, ToFixedPoint(x));
      }
      else {
        this.Canvas.moveTo(ToFixedPoint(x), y);
        this.Canvas.lineTo(ToFixedPoint(x), yBottom);
      }
      this.Canvas.stroke();
      yPrice = item.Close;
    }
  }

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = 0;
    range.Max = null;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var item = this.Data.Data[i];
      if (!item || !item.Vol) continue;
      if (range.Max == null) range.Max = item.Vol;
      if (range.Max < item.Vol) range.Max = item.Vol;
    }

    return range;
  }
}





//通达信语法 VOLSTICK 支持横屏
function ChartVolStick() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;
    this.HistoryData;               //历史数据
    this.KLineDrawType = 0;
    this.ClassName = 'ChartVolStick';

    this.Draw = function () 
    {
        if (this.ChartFrame.IsHScreen === true) 
        {
            this.HScreenDraw();
            return;
        }

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
        var chartright = this.ChartBorder.GetRight();
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
                if (right > chartright) break;

                var y = this.ChartFrame.GetYFromData(value);
                var bUp = false;
                if (kItem.Close >= kItem.Open)
                {
                    this.Canvas.fillStyle = this.UpColor;
                    bUp = true;
                }
                else
                {
                    this.Canvas.fillStyle = this.DownColor;
                }

                //高度调整为整数
                var height = ToFixedRect(yBottom - y);
                y = yBottom - height;
                if (bUp && (this.KLineDrawType == 1 || this.KLineDrawType == 2 || this.KLineDrawType == 3)) //空心柱子
                {
                    this.Canvas.strokeStyle = this.UpColor;
                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(left), ToFixedPoint(y), ToFixedRect(dataWidth), height);
                    this.Canvas.stroke();
                }
                else 
                {
                    this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(dataWidth), height);
                }
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
                if (x > chartright) break;

                if (kItem.Close > kItem.Open)
                    this.Canvas.strokeStyle = this.UpColor;
                else
                    this.Canvas.strokeStyle = this.DownColor;

                var x = this.ChartFrame.GetXFromIndex(j);
                this.Canvas.beginPath();
                this.Canvas.moveTo(ToFixedPoint(x), y);
                this.Canvas.lineTo(ToFixedPoint(x), yBottom);
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
                var bUp = false;

                if (kItem.Close >= kItem.Open)
                {
                    bUp = true;
                    this.Canvas.fillStyle = this.UpColor;
                }
                else
                {
                    this.Canvas.fillStyle = this.DownColor;
                }

                //高度调整为整数
                var height = ToFixedRect(y - yBottom);
                if (bUp && (this.KLineDrawType == 1 || this.KLineDrawType == 2 || this.KLineDrawType == 3)) //空心柱子
                {
                    this.Canvas.strokeStyle = this.UpColor;
                    this.Canvas.beginPath();
                    this.Canvas.rect(ToFixedPoint(yBottom), ToFixedPoint(left), height, ToFixedRect(dataWidth));
                    this.Canvas.stroke();
                }
                else 
                {
                    this.Canvas.fillRect(yBottom, ToFixedRect(left), height, ToFixedRect(dataWidth));
                }
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

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        range.Min = 0;
        range.Max = null;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (range.Max == null) range.Max = value;

            if (range.Max < value) range.Max = value;
        }

        return range;
    }
}

//线段 多数据(一个X点有多条Y数据) 支持横屏
function ChartLineMultiData() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Color = "rgb(255,193,37)"; //线段颜色

  this.Draw = function () {
    if (this.NotSupportMessage) {
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

      for (var index in aryValue) {
        var value = aryValue[index].Value;
        var y = this.ChartFrame.GetYFromData(value);

        if (bFirstPoint) {
          this.Canvas.strokeStyle = this.Color;
          this.Canvas.beginPath();
          if (isHScreen) this.Canvas.moveTo(y, x);
          else this.Canvas.moveTo(x, y);
          bFirstPoint = false;
        }
        else {
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


function ChartText() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.TextFont = "14px 微软雅黑";

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    if (!this.Data || !this.Data.Data) return;

    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartright = this.ChartBorder.GetRight();
    var xPointCount = this.ChartFrame.XPointCount;

    for (var i in this.Data.Data) {
      var value = this.Data.Data[i];
      if (value == null) continue;

      var price = value.Value;
      var position = value.Position;

      if (position == 'Left') {
        var x = this.ChartFrame.GetXFromIndex(0);
        var y = this.ChartFrame.GetYFromData(price);

        if (x > chartright) continue;

        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'middle';
        this.Canvas.fillStyle = value.Color;
        this.Canvas.font = this.TextFont;
        this.Canvas.fillText(value.Message, x, y);
      }

    }

  }

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = null;
    range.Max = null;

    if (!this.Data || !this.Data.Data) return range;

    for (var i in this.Data.Data) {
      var data = this.Data.Data[i];
      if (data == null || isNaN(data.Value)) continue;

      var value = data.Value;

      if (range.Max == null) range.Max = value;
      if (range.Min == null) range.Min = value;

      if (range.Max < value) range.Max = value;
      if (range.Min > value) range.Min = value;
    }

    return range;
  }
}



//直线 水平直线 只有1个数据 支持横屏
function ChartStraightLine() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Color = "rgb(255,193,37)";   //线段颜色

  this.Draw = function () {
    if (!this.Data || !this.Data.Data) return;
    if (this.Data.Data.length != 1) return;

    var isHScreen = this.ChartFrame.IsHScreen;
    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartright = this.ChartBorder.GetRight();
    if (isHScreen) chartright = this.ChartBorder.GetTop();
    var xPointCount = this.ChartFrame.XPointCount;

    var yValue = this.Data.Data[0];
    var y = this.ChartFrame.GetYFromData(yValue);
    var xLeft = this.ChartFrame.GetXFromIndex(0);
    var xRight = this.ChartFrame.GetXFromIndex(xPointCount - 1);

    var yFix = parseInt(y.toString()) + 0.5;
    this.Canvas.beginPath();
    if (isHScreen) {
      this.Canvas.moveTo(yFix, xLeft);
      this.Canvas.lineTo(yFix, xRight);
    }
    else {
      this.Canvas.moveTo(xLeft, yFix);
      this.Canvas.lineTo(xRight, yFix);
    }
    this.Canvas.strokeStyle = this.Color;
    this.Canvas.stroke();
  }

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = null;
    range.Max = null;

    if (!this.Data || !this.Data.Data) return range;
    if (this.Data.Data.length != 1) return range;

    range.Min = this.Data.Data[0];
    range.Max = this.Data.Data[0];

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
function ChartStraightArea() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Color = "rgb(255,193,37)";   //线段颜色
  this.Font = '11px 微软雅黑';

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    if (!this.Data || !this.Data.Data) return;

    if (this.ChartFrame.IsHScreen === true) {
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
    for (let i in this.Data.Data) {
      let item = this.Data.Data[i];
      if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
      if (item.Color == null) continue;

      let valueMax = Math.max(item.Value, item.Value2);
      let valueMin = Math.min(item.Value, item.Value2);

      let yTop = this.ChartFrame.GetYFromData(valueMax);
      let yBottom = this.ChartFrame.GetYFromData(valueMin);

      this.Canvas.fillStyle = item.Color;
      this.Canvas.fillRect(ToFixedRect(left), ToFixedRect(yTop), ToFixedRect(xRight - left), ToFixedRect(yBottom - yTop));
    }

    for (let i in this.Data.Data) {
      let item = this.Data.Data[i];
      if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
      if (item.Color == null) continue;

      let valueMax = Math.max(item.Value, item.Value2);
      let valueMin = Math.min(item.Value, item.Value2);

      let yTop = this.ChartFrame.GetYFromData(valueMax);
      let yBottom = this.ChartFrame.GetYFromData(valueMin);

      if (item.Title && item.TitleColor) {
        let x = xRight;
        if (item.Align == 'left') {
          this.Canvas.textAlign = 'left';
          x = left;
        }
        else {
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

  this.HScreenDraw = function () {
    var bottom = this.ChartBorder.GetBottom();
    var top = this.ChartBorder.GetTop();
    var height = this.ChartBorder.GetHeight();

    for (let i in this.Data.Data) {
      let item = this.Data.Data[i];
      if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;
      if (item.Color == null) continue;

      let valueMax = Math.max(item.Value, item.Value2);
      let valueMin = Math.min(item.Value, item.Value2);

      var yTop = this.ChartFrame.GetYFromData(valueMax);
      var yBottom = this.ChartFrame.GetYFromData(valueMin);

      this.Canvas.fillStyle = item.Color;
      this.Canvas.fillRect(ToFixedRect(yBottom), ToFixedRect(top), ToFixedRect(yTop - yBottom), ToFixedRect(height));

      if (item.Title && item.TitleColor) {
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

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = null;
    range.Max = null;

    if (!this.Data || !this.Data.Data) return range;

    for (let i in this.Data.Data) {
      let item = this.Data.Data[i];
      if (item == null || isNaN(item.Value) || isNaN(item.Value2)) continue;

      let valueMax = Math.max(item.Value, item.Value2);
      let valueMin = Math.min(item.Value, item.Value2);

      if (range.Max == null) range.Max = valueMax;
      if (range.Min == null) range.Min = valueMin;

      if (range.Max < valueMax) range.Max = valueMax;
      if (range.Min > valueMin) range.Min = valueMin;
    }

    return range;
  }
}

//分钟线
function ChartMinutePriceLine() 
{
    this.newMethod = ChartLine;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;
    this.IsDrawArea = true;    //是否画价格面积图
    this.AreaColor = 'rgba(0,191,255,0.1)';

    this.Draw = function () 
    {
        if (this.NotSupportMessage) 
        {
            this.DrawNotSupportmessage();
            return;
        }

        if (!this.IsShow) return;

        var isHScreen = (this.ChartFrame.IsHScreen === true);
        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
        var xPointCount = this.ChartFrame.XPointCount;
        var minuteCount = this.ChartFrame.MinuteCount;
        var bottom = this.ChartBorder.GetBottomEx();
        var left = this.ChartBorder.GetLeftEx();

        var bFirstPoint = true;
        var ptFirst = {}; //第1个点
        var drawCount = 0;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (bFirstPoint) 
            {
                this.Canvas.strokeStyle = this.Color;
                this.Canvas.beginPath();
                if (isHScreen) this.Canvas.moveTo(y, x);
                else this.Canvas.moveTo(x, y);
                bFirstPoint = false;
                ptFirst = { X: x, Y: y };
            }
            else 
            {
                if (isHScreen) this.Canvas.lineTo(y, x);
                else this.Canvas.lineTo(x, y);
            }

            ++drawCount;

            if (drawCount >= minuteCount) //上一天的数据和这天地数据线段要断开
            {
                bFirstPoint = true;
                this.Canvas.stroke();
                if (this.IsDrawArea)   //画面积
                {
                    if (isHScreen) 
                    {
                        this.Canvas.lineTo(left, x);
                        this.Canvas.lineTo(left, ptFirst.X);
                        this.SetFillStyle(this.AreaColor, this.ChartBorder.GetRightEx(), bottom, this.ChartBorder.GetLeftEx(), bottom);
                    }
                    else 
                    {
                        this.Canvas.lineTo(x, bottom);
                        this.Canvas.lineTo(ptFirst.X, bottom);
                        this.SetFillStyle(this.AreaColor, left, this.ChartBorder.GetTopEx(), left, bottom);
                    }
                    this.Canvas.fill();
                }
                drawCount = 0;
            }
        }

        if (drawCount > 0) 
        {
            this.Canvas.stroke();
            if (this.IsDrawArea)   //画面积
            {
                if (isHScreen) 
                {
                    this.Canvas.lineTo(left, x);
                    this.Canvas.lineTo(left, ptFirst.X);
                    this.SetFillStyle(this.AreaColor, this.ChartBorder.GetRightEx(), bottom, this.ChartBorder.GetLeftEx(), bottom);
                }
                else 
                {
                    this.Canvas.lineTo(x, bottom);
                    this.Canvas.lineTo(ptFirst.X, bottom);
                    this.SetFillStyle(this.AreaColor, left, this.ChartBorder.GetTopEx(), left, bottom);
                }
                this.Canvas.fill();
            }
        }
    }

    this.GetMaxMin = function () 
    {
        var xPointCount = this.ChartFrame.XPointCount;
        var range = {};
        if (this.YClose == null) return range;

        range.Min = this.YClose;
        range.Max = this.YClose;
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (!value) continue;

            if (range.Max == null) range.Max = value;
            if (range.Min == null) range.Min = value;

            if (range.Max < value) range.Max = value;
            if (range.Min > value) range.Min = value;
        }

        if (range.Max == this.YClose && range.Min == this.YClose) 
        {
            range.Max = this.YClose + this.YClose * 0.1;
            range.Min = this.YClose - this.YClose * 0.1;
            return range;
        }

        var distance = Math.max(Math.abs(this.YClose - range.Max), Math.abs(this.YClose - range.Min));
        range.Max = this.YClose + distance;
        range.Min = this.YClose - distance;

        return range;
    }
}

//分钟线叠加 支持横屏
function ChartOverlayMinutePriceLine() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Color = "rgb(65,105,225)";
  this.MainData;                  //主图数据
  this.MainYClose;                //主图股票的前收盘价

  this.Name = "ChartOverlayMinutePriceLine";
  this.Title;
  this.Symbol;                    //叠加的股票代码
  this.YClose;                    //叠加的股票前收盘

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    var isHScreen = (this.ChartFrame.IsHScreen === true);
    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartright = this.ChartBorder.GetRight();
    if (isHScreen === true) chartright = this.ChartBorder.GetBottom();
    var xPointCount = this.ChartFrame.XPointCount;
    var minuteCount = this.ChartFrame.MinuteCount;

    var bFirstPoint = true;
    var drawCount = 0;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var value = this.Data.Data[i].Close;
      if (value == null) continue;
      var showValue = value / this.YClose * this.MainYClose;

      var x = this.ChartFrame.GetXFromIndex(j);
      var y = this.ChartFrame.GetYFromData(showValue);

      if (bFirstPoint) {
        this.Canvas.strokeStyle = this.Color;
        this.Canvas.beginPath();
        if (isHScreen) this.Canvas.moveTo(y, x);
        else this.Canvas.moveTo(x, y);
        bFirstPoint = false;
      }
      else {
        if (isHScreen) this.Canvas.lineTo(y, x);
        else this.Canvas.lineTo(x, y);
      }

      ++drawCount;

      if (drawCount >= minuteCount) //上一天的数据和这天地数据线段要断开
      {
        bFirstPoint = true;
        this.Canvas.stroke();
        drawCount = 0;
      }
    }

    if (drawCount > 0) this.Canvas.stroke();
  }

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    if (this.YClose == null) return range;

    range.Min = this.MainYClose;
    range.Max = this.MainYClose;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var value = this.Data.Data[i].Close;
      if (value == null) continue;
      var value = value / this.YClose * this.MainYClose;
      if (range.Max == null) range.Max = value;
      if (range.Min == null) range.Min = value;

      if (range.Max < value) range.Max = value;
      if (range.Min > value) range.Min = value;
    }

    if (range.Max == this.MainYClose && range.Min == this.MainYClose) {
      range.Max = this.MainYClose + this.MainYClose * 0.1;
      range.Min = this.MainYClose - this.MainYClose * 0.1;
      return range;
    }

    var distance = Math.max(Math.abs(this.MainYClose - range.Max), Math.abs(this.MainYClose - range.Min));
    range.Max = this.MainYClose + distance;
    range.Min = this.MainYClose - distance;

    return range;
  }
}

//MACD森林线 支持横屏
function ChartMACD() 
{
    this.newMethod = IChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='ChartMACD';
    this.UpColor = g_JSChartResource.UpBarColor;
    this.DownColor = g_JSChartResource.DownBarColor;

    this.Draw = function () 
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

        var dataWidth = this.ChartFrame.DataWidth;
        var distanceWidth = this.ChartFrame.DistanceWidth;
        var chartright = this.ChartBorder.GetRight();
        var xPointCount = this.ChartFrame.XPointCount;

        var bFirstPoint = true;
        var drawCount = 0;
        var yBottom = this.ChartFrame.GetYFromData(0);
        for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) 
        {
            var value = this.Data.Data[i];
            if (value == null) continue;

            var x = this.ChartFrame.GetXFromIndex(j);
            var y = this.ChartFrame.GetYFromData(value);

            if (x > chartright) break;

            var xFix = parseInt(x.toString()) + 0.5;    //毛边修正
            this.Canvas.beginPath();
            this.Canvas.moveTo(xFix, yBottom);
            this.Canvas.lineTo(xFix, y);

            if (value >= 0) this.Canvas.strokeStyle = this.UpColor;
            else this.Canvas.strokeStyle = this.DownColor;
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
function ChartXYSubBar() {
  this.newMethod = ChartBar;   //派生
  this.newMethod();
  delete this.newMethod;

  this.BarID = 0;

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartTop = this.ChartBorder.GetTopEx();
    var xPointCount = this.ChartFrame.XPointCount;
    var yOffset = this.ChartBorder.GetBottom() - distanceWidth / 2.0 - 2.0;

    var xMiddle = this.ChartFrame.GetXFromIndex(0); //0 刻度

    if (dataWidth >= 4) {
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
      for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, yOffset -= (dataWidth + distanceWidth)) {
        var value = this.Data.Data[i];
        if (value == null || value == 0) continue;

        var yBottom = yOffset + subBarOffset;
        var yTop = yOffset + subBarOffset - dataWidth;
        if (yBottom < chartTop) break;

        var x = this.ChartFrame.GetXFromIndex(value);

        if (value > 0) {
          this.Canvas.fillStyle = this.UpBarColor;
          let barWidth = ToFixedRect(Math.abs(x - xMiddle));
          let barHeight = subBarWidth;
          if (Math.abs(chartTop - yBottom) < dataWidth) subBarWidth = Math.abs(chartTop - yBottom); //最后一根柱子可能会超出框架
          this.Canvas.fillRect(xMiddle, ToFixedRect(yTop), barWidth, ToFixedRect(barHeight + 0.5));
        }
        else {
          this.Canvas.fillStyle = this.DownBarColor;
          //高度调整为整数
          let barWidth = ToFixedRect(Math.abs(x - xMiddle));
          let barHeight = subBarWidth;
          if (Math.abs(chartTop - yBottom) < subBarWidth) barHeight = Math.abs(chartTop - yBottom); //最后一根柱子可能会超出框架
          this.Canvas.fillRect(xMiddle, ToFixedRect(yTop), -barWidth, ToFixedRect(barHeight + 0.5));
        }


      }
    }
    else    //太细了 直接画柱子
    {
      for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, yOffset -= (dataWidth + distanceWidth)) {
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

function ChartSubBar() {
  this.newMethod = ChartBar;   //派生
  this.newMethod();
  delete this.newMethod;

  this.BarID = 0;

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartright = this.ChartBorder.GetRight();
    var xPointCount = this.ChartFrame.XPointCount;
    var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;


    var yBottom = this.ChartFrame.GetYFromData(0);
    if (dataWidth >= 4) {
      var barCount = this.ChartFrame.BarCount;
      var subBarWidth = dataWidth;
      var subBarOffset = 0;
      if (barCount > 0)     //多柱子需要把框架柱子宽度的平均分割
      {
        subBarWidth = dataWidth / barCount;
        subBarOffset = subBarWidth * this.BarID;
        //console.log('[ChartSubBar::Draw] ', subBarWidth, this.BarID, subBarOffset);
      }

      yBottom = ToFixedRect(yBottom);   //调整为整数
      for (let i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
        var value = this.Data.Data[i];
        if (value == null || value == 0) continue;

        var left = xOffset + subBarOffset
        var right = xOffset + subBarOffset + subBarWidth;
        if (left > chartright) break;

        var x = this.ChartFrame.GetXFromIndex(j);
        var y = this.ChartFrame.GetYFromData(value);

        if (value > 0) {
          this.Canvas.fillStyle = this.UpBarColor;
          //高度调整为整数
          let height = ToFixedRect(Math.abs(yBottom - y));
          let barWidth = subBarWidth;
          if (chartright - left < subBarWidth) barWidth = chartright - left;
          if (yBottom - y > 0) y = yBottom - height;
          else y = yBottom + height;
          this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(barWidth), height);
        }
        else {
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
      for (let i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
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
function ChartBar() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.UpBarColor = g_JSChartResource.UpBarColor;
  this.DownBarColor = g_JSChartResource.DownBarColor;

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    var isHScreen = (this.ChartFrame.IsHScreen === true);
    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var chartright = this.ChartBorder.GetRight();
    if (isHScreen) chartright = this.ChartBorder.GetBottom();
    var xPointCount = this.ChartFrame.XPointCount;
    var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
    if (isHScreen) xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;

    var bFirstPoint = true;
    var drawCount = 0;
    var yBottom = this.ChartFrame.GetYFromData(0);
    if (dataWidth >= 4) {
      yBottom = ToFixedRect(yBottom);   //调整为整数
      for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
        var value = this.Data.Data[i];
        if (value == null || value == 0) continue;

        var left = xOffset;
        var right = xOffset + dataWidth;
        if (right > chartright) break;

        var x = this.ChartFrame.GetXFromIndex(j);
        var y = this.ChartFrame.GetYFromData(value);

        if (value > 0) {
          this.Canvas.fillStyle = this.UpBarColor;
          if (isHScreen) {
            let height = ToFixedRect(Math.abs(yBottom - y));  //高度调整为整数
            y = Math.min(yBottom, y);
            this.Canvas.fillRect(y, ToFixedRect(left), height, ToFixedRect(dataWidth));
          }
          else {
            let height = ToFixedRect(Math.abs(yBottom - y));  //高度调整为整数
            if (yBottom - y > 0) y = yBottom - height;
            else y = yBottom + height;
            this.Canvas.fillRect(ToFixedRect(left), y, ToFixedRect(dataWidth), height);
          }
        }
        else {
          this.Canvas.fillStyle = this.DownBarColor;
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
      for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
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
        if (isHScreen) {
          this.Canvas.moveTo(y, ToFixedPoint(x));
          this.Canvas.lineTo(yBottom, ToFixedPoint(x));
        }
        else {
          this.Canvas.moveTo(ToFixedPoint(x), y);
          this.Canvas.lineTo(ToFixedPoint(x), yBottom);
        }
        this.Canvas.stroke();
      }
    }
  }

  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = 0;
    range.Max = null;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var value = this.Data.Data[i];
      if (range.Max == null) range.Max = value;
      if (range.Max < value) range.Max = value;
      if (range.Min > value) range.Min = value;
    }

    return range;
  }
}
// 面积图
function ChartBand() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;
  this.IsDrawFirst = true;

  this.FirstColor = g_JSChartResource.Index.LineColor[0];
  this.SecondColor = g_JSChartResource.Index.LineColor[1];

  this.Draw = function () {
    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    var dataWidth = this.ChartFrame.DataWidth;
    var distanceWidth = this.ChartFrame.DistanceWidth;
    var xPointCount = this.ChartFrame.XPointCount;
    var xOffset = this.ChartBorder.GetLeft() + distanceWidth / 2.0 + 2.0;
    var x = 0;
    var y = 0;
    var y2 = 0;
    var firstlinePoints = [];
    var secondlinePoints = [];
    var lIndex = 0;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
      var value = this.Data.Data[i];
      if (value == null || value.Value == null || value.Value2 == null) continue;
      x = this.ChartFrame.GetXFromIndex(j);
      y = this.ChartFrame.GetYFromData(value.Value);
      y2 = this.ChartFrame.GetYFromData(value.Value2);
      firstlinePoints[lIndex] = { x: x, y: y };
      secondlinePoints[lIndex] = { x: x, y: y2 };
      lIndex++;
    }
    if (firstlinePoints.length > 1) {
      this.Canvas.save();
      this.Canvas.beginPath();
      for (var i = 0; i < firstlinePoints.length; ++i) {
        if (i == 0)
          this.Canvas.moveTo(firstlinePoints[i].x, firstlinePoints[i].y);
        else
          this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
      }
      for (var j = secondlinePoints.length - 1; j >= 0; --j) {
        this.Canvas.lineTo(secondlinePoints[j].x, secondlinePoints[j].y);
      }
      this.Canvas.closePath();
      this.Canvas.strokeStyle = "rgba(255,255,255,0)";
      this.Canvas.stroke();
      this.Canvas.clip();
      this.Canvas.beginPath();
      this.Canvas.moveTo(firstlinePoints[0].x, this.ChartBorder.GetBottom());
      for (var i = 0; i < firstlinePoints.length; ++i) {
        this.Canvas.lineTo(firstlinePoints[i].x, firstlinePoints[i].y);
      }
      this.Canvas.lineTo(firstlinePoints[firstlinePoints.length - 1].x, this.ChartBorder.GetBottom());
      this.Canvas.closePath();
      this.Canvas.fillStyle = this.FirstColor;
      this.Canvas.fill();
      this.Canvas.beginPath();
      this.Canvas.moveTo(secondlinePoints[0].x, this.ChartBorder.GetBottom());
      for (var i = 0; i < secondlinePoints.length; ++i) {
        this.Canvas.lineTo(secondlinePoints[i].x, secondlinePoints[i].y);
      }
      this.Canvas.lineTo(secondlinePoints[secondlinePoints.length - 1].x, this.ChartBorder.GetBottom());
      this.Canvas.closePath();
      this.Canvas.fillStyle = this.SecondColor;
      this.Canvas.fill();
      this.Canvas.restore();
    }
  }
  this.GetMaxMin = function () {
    var xPointCount = this.ChartFrame.XPointCount;
    var range = {};
    range.Min = null;
    range.Max = null;
    for (var i = this.Data.DataOffset, j = 0; i < this.Data.Data.length && j < xPointCount; ++i, ++j) {
      var value = this.Data.Data[i];
      if (value == null || value.Value == null || value.Value2 == null) continue;
      var maxData = value.Value > value.Value2 ? value.Value : value.Value2;
      var minData = value.Value < value.Value2 ? value.Value : value.Value2;
      if (range.Max == null)
        range.Max = maxData;
      else if (range.Max < maxData)
        range.Max = maxData;

      if (range.Min == null)
        range.Min = minData;
      else if (range.Min > minData)
        range.Min = minData;
    }

    return range;
  }
}

//锁  支持横屏
function ChartLock() {
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

  this.Draw = function () {
    this.LockRect = null;

    if (this.NotSupportMessage) {
      this.DrawNotSupportmessage();
      return;
    }

    if (this.ChartFrame.IsHScreen === true) {
      this.HScreenDraw();
      return;
    }

    var xOffset = this.ChartBorder.GetRight();
    var lOffsetWidth = 0;
    if (this.ChartFrame.Data != null) {
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
    if (lOffsetWidth == 0) {
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

  this.HScreenDraw = function () {
    var xOffset = this.ChartBorder.GetBottom();

    var lOffsetWidth = 0;
    if (this.ChartFrame.Data != null) {
      var dataWidth = this.ChartFrame.DataWidth;
      var distanceWidth = this.ChartFrame.DistanceWidth;
      xOffset = this.ChartBorder.GetTop() + distanceWidth / 2.0 + 2.0;
      var chartright = this.ChartBorder.GetBottom();
      var xPointCount = this.ChartFrame.XPointCount;
      //求最后1个数据的位置
      for (var i = this.ChartFrame.Data.DataOffset, j = 0; i < this.ChartFrame.Data.Data.length && j < xPointCount; ++i, ++j, xOffset += (dataWidth + distanceWidth)) {
        var data = this.ChartFrame.Data.Data[i];
        if (data.Open == null || data.High == null || data.Low == null || data.Close == null) continue;

        var left = xOffset;
        var right = xOffset + dataWidth;
        if (right > chartright) break;
      }
      lOffsetWidth = (dataWidth + distanceWidth) * this.LockCount;
    }
    if (lOffsetWidth == 0) {
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
  this.GetTooltipData = function (x, y, tooltip) {
    if (this.LockRect == null) return false;

    if (this.IsPointInRect(x, y, this.LockRect.Left, this.LockRect.Top, this.LockRect.Width, this.LockRect.Heigh)) {
      tooltip.Data = { ID: this.LockID, Callback: this.Callback, IndexName: this.IndexName };
      tooltip.ChartPaint = this;
      return true;
    }

    return false;
  }

  this.IsPointInRect = function (x, y, left, top, width, heigh) {
    if (x > left && x < left + width && y > top && y < top + heigh) return true;

    return false;
  }
}

////////////////////////////////////////////////////////////////////////////////
// 等待提示
function ChartSplashPaint() {
  this.newMethod = IChartPainting;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Font = g_JSChartResource.DefaultTextFont;            //字体
  this.TextColor = g_JSChartResource.DefaultTextColor;      //文本颜色
  this.IsEnableSplash = false;
  this.SplashTitle = '数据加载中.....';

  this.Draw = function () {
    if (!this.IsEnableSplash) return;

    if (this.Frame.IsHScreen === true) {
      this.HScreenDraw();
      return;
    }

    var xCenter = (this.Frame.ChartBorder.GetLeft() + this.Frame.ChartBorder.GetRight()) / 2;
    var yCenter = (this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.GetBottom()) / 2;
    this.Canvas.textAlign = 'center';
    this.Canvas.textBaseline = 'middle';
    this.Canvas.fillStyle = this.TextColor;
    this.Canvas.font = this.Font;
    this.Canvas.fillText(this.SplashTitle, xCenter, yCenter);
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

/////////////////////////////////////////////////////////////////////////////////
//
function IChangeStringFormat() {
  this.Data;
  this.Value;     //数据
  this.Text;      //输出字符串

  this.Operator = function () {
    return false;
  }
}


function HQPriceStringFormat() 
{
    this.newMethod = IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Symbol;
    this.FrameID;
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.PercentageText;    //百分比
    this.RValue;            //右边值
    this.RText;

    this.Operator = function () 
    {
        this.RText = null;
        if (IFrameSplitOperator.IsString(this.RValue)) this.RText = this.RValue;
        if (!this.Value) return false;

        var defaultfloatPrecision = 2;     //价格小数位数 
        if (this.FrameID == 0)    //第1个窗口显示原始价格
        {
            var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);
            this.Text = this.Value.toFixed(defaultfloatPrecision);
        }
        else 
        {
            this.Text = IFrameSplitOperator.FormatValueString(this.Value, defaultfloatPrecision, this.LanguageID);
        }

        return true;
    }
}

function HQDateStringFormat() 
{
    this.newMethod = IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Operator = function () 
    {
        if (!this.Value) return false;
        if (!this.Data) return false;

        var index = this.Value;
        index = parseInt(index.toFixed(0));
        if (this.Data.DataOffset + index >= this.Data.Data.length) return false;

        var currentData = this.Data.Data[this.Data.DataOffset + index];
        var date = currentData.Date;
        this.Text = IFrameSplitOperator.FormatDateString(date);
        if (ChartData.IsMinutePeriod(this.Data.Period, true)) // 分钟周期
        {
            var time = IFrameSplitOperator.FormatTimeString(currentData.Time);
            this.Text = this.Text + " " + time;
        }
        else if (ChartData.IsSecondPeriod(this.Data.Period))
        {
            var time = IFrameSplitOperator.FormatTimeString(currentData.Time,"HH:MM:SS");
            this.Text = this.Text + " " + time;
        }

        return true;
    }
}

function HQMinuteTimeStringFormat() 
{
    this.newMethod = IChangeStringFormat;   //派生
    this.newMethod();
    delete this.newMethod;

    this.Frame;
    this.Symbol;

    this.Operator = function () 
    {
        if (this.Value == null || isNaN(this.Value)) return false;

        var index = Math.abs(this.Value);
        index = parseInt(index.toFixed(0));
        var showIndex = index;
        if (this.Frame && this.Frame.MinuteCount) showIndex = index % this.Frame.MinuteCount;

        var timeStringData = JSCommonCoordinateData.MinuteTimeStringData;
        var timeData = timeStringData.GetTimeData(this.Symbol);
        if (!timeData) return false;

        if (showIndex < 0) showIndex = 0;
        else if (showIndex > timeData.length) showIndex = timeData.length - 1;
        if (this.Frame && index >= this.Frame.XPointCount)
        showIndex = timeData.length - 1;

        var time = timeData[showIndex];
        this.Text = IFrameSplitOperator.FormatTimeString(time);
        return true;
    }
}


/*
    画图工具
*/
function IChartDrawPicture() {
  this.Frame;
  this.Canvas;
  this.Point = new Array()                      //画图的点
  this.Value = new Array();                     //XValue,YValue
  this.PointCount = 2;                          //画点的个数
  this.Status = 0;                              //0 开始画 1 完成第1个点  2 完成第2个点    10 完成 20 移动
  this.MovePointIndex = null;                        //移动哪个点 0-10 对应Point索引  100 整体移动

  this.LineColor = g_JSChartResource.DrawPicture.LineColor[0];                            //线段颜色
  this.PointColor = g_JSChartResource.DrawPicture.PointColor[0];

  this.Draw = function () {

  }

  //Point => Value
  this.PointToValue = function () {
    if (!this.Frame) return false;
    var data = this.Frame.Data;
    if (!data) return false;

    for (var i in this.Point) {
      var item = this.Point[i];
      var xValue = parseInt(this.Frame.GetXData(item.X)) + data.DataOffset;
      var yValue = this.Frame.GetYData(item.Y);

      this.Value[i] = {};
      this.Value[i].XValue = xValue;
      this.Value[i].YValue = yValue;
    }

    return true;
  }

  this.IsPointIn = function (x, y) {
    return false;
  }

  //Value => Point
  this.ValueToPoint = function () {
    if (!this.Frame) return false;
    var data = this.Frame.Data;
    if (!data) return false;

    this.Point = [];
    for (var i in this.Value) {
      var item = this.Value[i];
      var pt = new Point();
      pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
      pt.Y = this.Frame.GetYFromData(item.YValue);
      this.Point[i] = pt;
    }
  }

  //xStep,yStep 移动的偏移量
  this.Move = function (xStep, yStep) {
    if (this.Status != 20) return fasle;
    if (!this.Frame) return false;
    var data = this.Frame.Data;
    if (!data) return false;

    if (this.MovePointIndex == 100)    //整体移动
    {
      for (var i in this.Point) {
        this.Point[i].X += xStep;
        this.Point[i].Y += yStep;
      }
    }
    else if (this.MovePointIndex == 0 || this.MovePointIndex == 1) {
      this.Point[this.MovePointIndex].X += xStep;
      this.Point[this.MovePointIndex].Y += yStep;
    }
  }

  this.ClipFrame = function () {
    var left = this.Frame.ChartBorder.GetLeft();
    var top = this.Frame.ChartBorder.GetTopEx();
    var width = this.Frame.ChartBorder.GetWidth();
    var height = this.Frame.ChartBorder.GetHeightEx();

    this.Canvas.save();
    this.Canvas.beginPath();
    this.Canvas.rect(left, top, width, height);
    this.Canvas.clip();
  }

  //计算需要画的点的坐标
  this.CalculateDrawPoint = function () {
    if (this.Status < 2) return null;
    if (!this.Point.length || !this.Frame) return null;

    var drawPoint = new Array();
    if (this.Status == 10) {
      var data = this.Frame.Data;
      if (!data) return null;

      for (var i in this.Value) {
        var item = this.Value[i];
        var pt = new Point();
        pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
        pt.Y = this.Frame.GetYFromData(item.YValue);
        drawPoint.push(pt);
      }
    }
    else {
      drawPoint = this.Point;
    }

    return drawPoint;
  }

  this.DrawPoint = function (aryPoint) {
    if (!aryPoint || aryPoint.length <= 0) return;

    //画点
    this.ClipFrame();
    for (var i in aryPoint) {
      var item = aryPoint[i];

      this.Canvas.beginPath();
      this.Canvas.arc(item.X, item.Y, 5, 0, 360, false);
      this.Canvas.fillStyle = this.PointColor;      //填充颜色
      this.Canvas.fill();                         //画实心圆
      this.Canvas.closePath();
    }

    this.Canvas.restore();
  }
}

/*
    画图工具-线段
*/

function ChartDrawPictureLine() {
  this.newMethod = IChartDrawPicture;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Draw = function () {
    var drawPoint = this.CalculateDrawPoint();
    if (!drawPoint) return;

    this.ClipFrame();

    for (var i in drawPoint) {
      var item = drawPoint[i];
      if (i == 0) {
        this.Canvas.beginPath();
        this.Canvas.moveTo(item.X, item.Y);
      }
      else {
        this.Canvas.lineTo(item.X, item.Y);
      }

    }

    this.Canvas.strokeStyle = this.LineColor;
    this.Canvas.stroke();
    this.Canvas.closePath();
    this.Canvas.restore();

    //画点
    this.DrawPoint(drawPoint);
  }


  //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
  this.IsPointIn = function (x, y) {
    if (!this.Frame || this.Status != 10) return -1;

    var data = this.Frame.Data;
    if (!data) return -1;

    //是否在点上
    var aryPoint = new Array();
    for (var i in this.Value) {
      var item = this.Value[i];
      var pt = new Point();
      pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
      pt.Y = this.Frame.GetYFromData(item.YValue);

      this.Canvas.beginPath();
      this.Canvas.arc(pt.X, pt.Y, 5, 0, 360);
      //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
      if (this.Canvas.isPointInPath(x, y))
        return i;

      aryPoint.push(pt);
    }

    //是否在线段上
    this.Canvas.beginPath();
    this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y + 5);
    this.Canvas.lineTo(aryPoint[0].X, aryPoint[0].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y + 5);
    this.Canvas.closePath();
    if (this.Canvas.isPointInPath(x, y))
      return 100;

    return -1;
  }
}

/*
    画图工具-射线
*/
function ChartDrawPictureHaflLine() {
  this.newMethod = IChartDrawPicture;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Draw = function () {
    var drawPoint = this.CalculateDrawPoint();
    if (!drawPoint || drawPoint.length != 2) return;

    this.ClipFrame();

    this.Canvas.beginPath();
    this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
    this.Canvas.lineTo(drawPoint[1].X, drawPoint[1].Y);

    var endPoint = this.CalculateEndPoint(drawPoint);
    this.Canvas.lineTo(endPoint.X, endPoint.Y);

    this.Canvas.strokeStyle = this.LineColor;
    this.Canvas.stroke();
    this.Canvas.closePath();
    this.Canvas.restore();

    //画点
    this.DrawPoint(drawPoint);
  }

  this.CalculateEndPoint = function (aryPoint) {
    var left = this.Frame.ChartBorder.GetLeft();
    var right = this.Frame.ChartBorder.GetRight();

    var a = aryPoint[1].X - aryPoint[0].X;
    var b = aryPoint[1].Y - aryPoint[0].Y;

    if (a > 0) {
      var a1 = right - aryPoint[0].X;
      var b1 = a1 * b / a;
      var y = b1 + aryPoint[0].Y;

      var pt = new Point();
      pt.X = right;
      pt.Y = y;
      return pt;
    }
    else {
      var a1 = aryPoint[0].X - left;
      var b1 = a1 * b / Math.abs(a);
      var y = b1 + aryPoint[0].Y;

      var pt = new Point();
      pt.X = left;
      pt.Y = y;
      return pt;
    }
  }


  //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
  this.IsPointIn = function (x, y) {
    if (!this.Frame || this.Status != 10) return -1;

    var data = this.Frame.Data;
    if (!data) return -1;

    //是否在点上
    var aryPoint = new Array();
    for (var i in this.Value) {
      var item = this.Value[i];
      var pt = new Point();
      pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
      pt.Y = this.Frame.GetYFromData(item.YValue);

      this.Canvas.beginPath();
      this.Canvas.arc(pt.X, pt.Y, 5, 0, 360);
      //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
      if (this.Canvas.isPointInPath(x, y))
        return i;

      aryPoint.push(pt);
    }

    //是否在线段上
    this.Canvas.beginPath();
    this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y + 5);
    this.Canvas.lineTo(aryPoint[0].X, aryPoint[0].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y + 5);
    this.Canvas.closePath();
    if (this.Canvas.isPointInPath(x, y))
      return 100;

    return -1;
  }
}

/*
    画图工具-矩形
*/
function ChartDrawPictureRect() {
  this.newMethod = IChartDrawPicture;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Draw = function () {
    var drawPoint = this.CalculateDrawPoint();
    if (!drawPoint || drawPoint.length != 2) return;

    this.ClipFrame();

    this.Canvas.beginPath();
    this.Canvas.rect(drawPoint[0].X, drawPoint[0].Y, drawPoint[1].X - drawPoint[0].X, drawPoint[1].Y - drawPoint[0].Y);

    this.Canvas.strokeStyle = this.LineColor;
    this.Canvas.stroke();
    this.Canvas.closePath();
    this.Canvas.restore();

    //画点
    this.DrawPoint(drawPoint);
  }

  //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
  this.IsPointIn = function (x, y) {
    if (!this.Frame || this.Status != 10) return -1;

    var data = this.Frame.Data;
    if (!data) return -1;

    //是否在点上
    var aryPoint = new Array();
    for (var i in this.Value) {
      var item = this.Value[i];
      var pt = new Point();
      pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
      pt.Y = this.Frame.GetYFromData(item.YValue);

      this.Canvas.beginPath();
      this.Canvas.arc(pt.X, pt.Y, 5, 0, 360);
      //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
      if (this.Canvas.isPointInPath(x, y))
        return i;

      aryPoint.push(pt);
    }

    //是否在矩形边框上
    var linePoint = [{ X: aryPoint[0].X, Y: aryPoint[0].Y }, { X: aryPoint[1].X, Y: aryPoint[0].Y }];
    if (this.IsPointInLine(linePoint, x, y))
      return 100;

    linePoint = [{ X: aryPoint[1].X, Y: aryPoint[0].Y }, { X: aryPoint[1].X, Y: aryPoint[1].Y }];
    if (this.IsPointInLine2(linePoint, x, y))
      return 100;

    linePoint = [{ X: aryPoint[1].X, Y: aryPoint[1].Y }, { X: aryPoint[0].X, Y: aryPoint[1].Y }];
    if (this.IsPointInLine(linePoint, x, y))
      return 100;

    linePoint = [{ X: aryPoint[0].X, Y: aryPoint[1].Y }, { X: aryPoint[0].X, Y: aryPoint[0].Y }];
    if (this.IsPointInLine2(linePoint, x, y))
      return 100;

    return -1;
  }

  //点是否在线段上 水平线段
  this.IsPointInLine = function (aryPoint, x, y) {
    this.Canvas.beginPath();
    this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y + 5);
    this.Canvas.lineTo(aryPoint[0].X, aryPoint[0].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y - 5);
    this.Canvas.lineTo(aryPoint[1].X, aryPoint[1].Y + 5);
    this.Canvas.closePath();
    if (this.Canvas.isPointInPath(x, y))
      return true;
  }

  //垂直线段
  this.IsPointInLine2 = function (aryPoint, x, y) {
    this.Canvas.beginPath();
    this.Canvas.moveTo(aryPoint[0].X - 5, aryPoint[0].Y);
    this.Canvas.lineTo(aryPoint[0].X + 5, aryPoint[0].Y);
    this.Canvas.lineTo(aryPoint[1].X + 5, aryPoint[1].Y);
    this.Canvas.lineTo(aryPoint[1].X - 5, aryPoint[1].Y);
    this.Canvas.closePath();
    if (this.Canvas.isPointInPath(x, y))
      return true;
  }
}

/*
    画图工具-弧形
*/
function ChartDrawPictureArc() {
  this.newMethod = IChartDrawPicture;   //派生
  this.newMethod();
  delete this.newMethod;

  this.Draw = function () {
    var drawPoint = this.CalculateDrawPoint();
    if (!drawPoint || drawPoint.length != 2) return;

    this.ClipFrame();

    //this.Canvas.beginPath();
    //this.Canvas.rect(drawPoint[0].X,drawPoint[0].Y,drawPoint[1].X-drawPoint[0].X,drawPoint[1].Y-drawPoint[0].Y);
    if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第一象限
    {
      var a = drawPoint[1].X - drawPoint[0].X;
      var b = drawPoint[0].Y - drawPoint[1].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var xcenter = drawPoint[0].X;
      var ycenter = drawPoint[1].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
      for (var i = 1.5 * Math.PI; i < 2 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
      for (var j = 0; j <= 0.5 * Math.PI; j += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(j), ycenter + b * Math.sin(j) * -1);
      }
    }
    else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y > drawPoint[1].Y) // 第二象限
    {
      var a = drawPoint[0].X - drawPoint[1].X;
      var b = drawPoint[0].Y - drawPoint[1].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var xcenter = drawPoint[1].X;
      var ycenter = drawPoint[0].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
      for (var i = 0; i <= Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
    }
    else if (drawPoint[0].X > drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第三象限
    {
      var a = drawPoint[0].X - drawPoint[1].X;
      var b = drawPoint[1].Y - drawPoint[0].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var xcenter = drawPoint[0].X;
      var ycenter = drawPoint[1].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
      for (var i = 0.5 * Math.PI; i <= 1.5 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
    }
    else if (drawPoint[0].X < drawPoint[1].X && drawPoint[0].Y < drawPoint[1].Y) // 第四象限
    {
      var a = drawPoint[1].X - drawPoint[0].X;
      var b = drawPoint[1].Y - drawPoint[0].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var xcenter = drawPoint[1].X;
      var ycenter = drawPoint[0].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(drawPoint[0].X, drawPoint[0].Y);
      for (var i = Math.PI; i <= 2 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
    }


    this.Canvas.strokeStyle = this.LineColor;
    this.Canvas.stroke();
    //this.Canvas.closePath();
    this.Canvas.restore();

    //画点
    this.DrawPoint(drawPoint);
  }

  //0-10 鼠标对应的点索引   100=鼠标在正个图形上  -1 鼠标不在图形上
  this.IsPointIn = function (x, y) {
    if (!this.Frame || this.Status != 10) return -1;

    var data = this.Frame.Data;
    if (!data) return -1;

    //是否在点上
    var aryPoint = new Array();
    for (var i in this.Value) {
      var item = this.Value[i];
      var pt = new Point();
      pt.X = this.Frame.GetXFromIndex(item.XValue - data.DataOffset);
      pt.Y = this.Frame.GetYFromData(item.YValue);

      this.Canvas.beginPath();
      this.Canvas.arc(pt.X, pt.Y, 5, 0, 360);
      //console.log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
      if (this.Canvas.isPointInPath(x, y))
        return i;

      aryPoint.push(pt);
    }

    //是否在弧线上
    var ArcPoint = [{ X: aryPoint[0].X, Y: aryPoint[0].Y }, { X: aryPoint[1].X, Y: aryPoint[1].Y }];
    if (this.IsPointInArc(ArcPoint, x, y))
      return 100;

    return -1;
  }
  this.IsPointInArc = function (aryPoint, x, y) {
    if (aryPoint.length != 2)
      return false;
    if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第一象限
    {
      var a = aryPoint[1].X - aryPoint[0].X;
      var b = aryPoint[0].Y - aryPoint[1].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var ainer = a * 0.8;
      var biner = b * 0.8;
      var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
      var xcenter = aryPoint[0].X;
      var ycenter = aryPoint[1].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
      for (var i = 1.5 * Math.PI; i < 2 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
      for (var j = 0; j <= 0.5 * Math.PI; j += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(j), ycenter + b * Math.sin(j) * -1);
      }
      for (var k = 0.5 * Math.PI; k >= 0; k -= stepiner) {
        this.Canvas.lineTo(xcenter + ainer * Math.cos(k), ycenter + biner * Math.sin(j) * -1);
      }
      for (var l = 2 * Math.PI; l >= 1.5 * Math.PI; l -= stepiner) {
        this.Canvas.lineTo(xcenter + ainer * Math.cos(l), ycenter + biner * Math.sin(l) * -1);
      }
      this.Canvas.closePath();
    }
    else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y > aryPoint[1].Y) // 第二象限
    {
      var a = aryPoint[0].X - aryPoint[1].X;
      var b = aryPoint[0].Y - aryPoint[1].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var ainer = a * 0.8;
      var biner = b * 0.8;
      var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
      var xcenter = aryPoint[1].X;
      var ycenter = aryPoint[0].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
      for (var i = 0; i <= Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
      for (var j = Math.PI; j >= 0; j -= stepiner) {
        this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner * Math.sin(j) * -1);
      }
      this.Canvas.closePath();
    }
    else if (aryPoint[0].X > aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第三象限
    {
      var a = aryPoint[0].X - aryPoint[1].X;
      var b = aryPoint[1].Y - aryPoint[0].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var ainer = a * 0.8;
      var biner = b * 0.8;
      var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
      var xcenter = aryPoint[0].X;
      var ycenter = aryPoint[1].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
      for (var i = 0.5 * Math.PI; i <= 1.5 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
      for (var j = 1.5 * Math.PI; j >= 0.5 * Math.PI; j -= stepiner) {
        this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner * Math.sin(j) * -1);
      }
      this.Canvas.closePath();
    }
    else if (aryPoint[0].X < aryPoint[1].X && aryPoint[0].Y < aryPoint[1].Y) // 第四象限
    {
      var a = aryPoint[1].X - aryPoint[0].X;
      var b = aryPoint[1].Y - aryPoint[0].Y;
      var step = (a > b) ? 1 / a : 1 / b;
      var ainer = a * 0.8;
      var biner = b * 0.8;
      var stepiner = (ainer > biner) ? 1 / ainer : 1 / biner;
      var xcenter = aryPoint[1].X;
      var ycenter = aryPoint[0].Y;
      this.Canvas.beginPath();
      this.Canvas.moveTo(aryPoint[0].X, aryPoint[0].Y);
      for (var i = Math.PI; i <= 2 * Math.PI; i += step) {
        this.Canvas.lineTo(xcenter + a * Math.cos(i), ycenter + b * Math.sin(i) * -1);
      }
      for (var j = 2 * Math.PI; j >= Math.PI; j -= stepiner) {
        this.Canvas.lineTo(xcenter + ainer * Math.cos(j), ycenter + biner * Math.sin(j) * -1);
      }
      this.Canvas.closePath();
    }
    if (this.Canvas.isPointInPath(x, y))
      return true;
    else
      return false;

  }

}

/*
    指标列表 指标信息都在这里,不够后面再加字段
*/
function JSIndexMap() {

}

JSIndexMap.Get = function (id) {
  var indexMap = new Map(
    [
      //公司自己的指标
      ["市场多空", { IsMainIndex: false, Create: function () { return new MarketLongShortIndex() } }],
      ["市场择时", { IsMainIndex: false, Create: function () { return new MarketTimingIndex() } }],
      ["市场关注度", { IsMainIndex: false, Create: function () { return new MarketAttentionIndex() } }],
      ["指数热度", { IsMainIndex: false, Create: function () { return new MarketHeatIndex() } }],
      ["自定义指数热度", { IsMainIndex: false, Create: function () { return new CustonIndexHeatIndex() }, Name: '自定义指数热度' }],
      ["财务粉饰", { IsMainIndex: false, Create: function () { return new BenfordIndex() } }],

      //能图指标
      //["能图-趋势", { IsMainIndex: false, Create: function () { return new LighterIndex1() }, Name: '大盘/个股趋势' }],
      //["能图-位置研判", { IsMainIndex: false, Create: function () { return new LighterIndex2() }, Name: '位置研判' }],
      //["能图-点位研判", { IsMainIndex: false, Create: function () { return new LighterIndex3() }, Name: '点位研判' }],
      //["能图-资金分析", { IsMainIndex: false, Create: function () { return new LighterIndex4() }, Name: '资金分析' }],
      //["能图-市场关注度", { IsMainIndex: false, Create: function () { return new LighterIndex5() }, Name: '市场关注度' }]
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
    var _self = this;
    this.newMethod = JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'KLineChartContainer';
    this.WindowIndex = new Array();
    this.ColorIndex;                    //五彩K线
    this.TradeIndex;                    //交易指标/专家系统
    this.Symbol;
    this.Name;
    this.Period = 0;                      //周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 9=季线 10=分笔线 11=120分钟 12=240分钟
    this.IsApiPeriod = false;             //使用API计算周期
    this.Right = 0;                       //复权 0 不复权 1 前复权 2 后复权
    this.SourceData;                    //原始的历史数据
    this.MaxReqeustDataCount = 3000;      //数据个数
    this.MaxRequestMinuteDayCount = 5;    //分钟数据请求的天数
    this.PageSize = 200;                  //每页数据个数
    this.KLineDrawType = 0;               //0=K线 1=收盘价线 2=美国线
    this.SplashTitle = '下载历史数据';
    this.IsAutoUpdate = false;                    //是否自动更新行情数据
    this.AutoUpdateFrequency = 30000;             //30秒更新一次数据
    this.AutoUpdateTimer;                         //自动定时器
    this.RightSpaceCount=1;
    this.SourceDataLimit = new Map();     //每个周期缓存数据最大个数 key=周期 value=最大个数  

    this.StepPixel = 4;                   //移动一个数据需要的像素
    this.ZoomStepPixel = 5;               //放大缩小手势需要的最小像素

    this.DragDownload = {
        Day: { Enable: false, IsEnd: false, Status: 0 },      //日线数据拖拽下载(暂不支持) Status: 0空闲 1 下载中
        Minute: { Enable: false, IsEnd: false, status: 0 }    //分钟数据拖拽下载
    };

    this.KLineApiUrl = g_JSChartResource.Domain + "/API/KLine2";                        //历史K线api地址
    this.MinuteKLineApiUrl = g_JSChartResource.Domain + '/API/KLine3';                  //历史分钟数据
    this.RealtimeApiUrl = g_JSChartResource.Domain + "/API/Stock";                      //实时行情api地址
    this.KLineMatchUrl = g_JSChartResource.Domain + "/API/KLineMatch";                  //形态匹配
    this.DragMinuteKLineApiUrl = g_JSChartResource.Domain + '/API/KLine4';              //拖动数据下载
    this.DragKLineApiUrl = g_JSChartResource.Domain + '/API/KLine5';                    //拖动日K数据下载

    this.BeforeBindMainData = null;   //function(funcName)   在BindMainData() 调用前回调用
    this.AfterBindMainData = null;    //function(funcName)   在BindMainData() 调用前后调用

    this.ResetDragDownload = function () 
    {
        this.DragDownload.Day.Status = 0;
        this.DragDownload.Day.IsEnd=false;
        
        this.DragDownload.Minute.Status = 0;
        this.DragDownload.Minute.isEnd=false;
    }

    this.ChartOperator = function (obj) //图形控制函数 {ID:JSCHART_OPERATOR_ID, ...参数 }
    {
        var id = obj.ID;
        if (id === JSCHART_OPERATOR_ID.OP_SCROLL_LEFT || id === JSCHART_OPERATOR_ID.OP_SCROLL_RIGHT)    //左右移动 { Step:移动数据个数 }
        {
            var isLeft = (id === JSCHART_OPERATOR_ID.OP_SCROLL_LEFT ? true : false);
            var step = 1;
            if (obj.Step > 0) step = obj.Step;
            if (this.DataMove(step * this.StepPixel, isLeft))    //每次移动一个数据
            {
                this.UpdataDataoffset();
                this.UpdatePointByCursorIndex();
                this.UpdateFrameMaxMin();
                this.ResetFrameXYSplit();
                this.Draw();
            }
        }
        else if (id === JSCHART_OPERATOR_ID.OP_ZOOM_IN || id === JSCHART_OPERATOR_ID.OP_ZOOM_OUT)       //缩放
        {
            var cursorIndex = {};
            cursorIndex.Index = parseInt(Math.abs(this.CursorIndex - 0.5).toFixed(0));
            if (id === JSCHART_OPERATOR_ID.OP_ZOOM_IN) 
            {
                if (!this.Frame.ZoomUp(cursorIndex)) return;
            }
            else 
            {
                if (!this.Frame.ZoomDown(cursorIndex)) return;
            }
            this.CursorIndex = cursorIndex.Index;
            this.UpdataDataoffset();
            this.UpdatePointByCursorIndex();
            this.UpdateFrameMaxMin();
            this.Draw();
        }
        else if (id === JSCHART_OPERATOR_ID.OP_GOTO_HOME) //返回最新
        {
            var hisData = null;
            if (!this.Frame.Data) hisData = this.Frame.Data;
            else hisData = this.Frame.SubFrame[0].Frame.Data;
            if (!hisData) return;  //数据还没有到达

            var showCount = this.PageSize;
            //var pageSize = this.GetMaxMinPageSize();
            //if (pageSize.Max < showCount) showCount = pageSize.Max;
            //else if (pageSize.Min > showCount) showCount = pageSize.Min;

            for (var i in this.Frame.SubFrame)   //设置一屏显示的数据个数
            {
                var item = this.Frame.SubFrame[i].Frame;
                item.XPointCount = showCount;
            }

            var index = hisData.Data.length - showCount;
            hisData.DataOffset = index;
            this.CursorIndex = 0;

            this.LastPoint.X = null;
            this.LastPoint.Y = null;

            console.log(`[KLineChartContainer::ChartOperator] OP_GOTO_HOME, dataOffset=${hisData.DataOffset} CursorIndex=${this.CursorIndex} PageSize=${showCount}`);

            this.UpdataDataoffset();           //更新数据偏移
            this.UpdateFrameMaxMin();          //调整坐标最大 最小值
            this.Frame.SetSizeChage(true);
            this.Draw();
            this.UpdatePointByCursorIndex();   //更新十字光标位子
        }
    }

    //创建windowCount 窗口个数
    this.Create = function (windowCount) 
    {
        this.UIElement.JSChartContainer = this;

        //创建十字光标
        this.ChartCorssCursor = new ChartCorssCursor();
        this.ChartCorssCursor.Canvas = this.Canvas;
        this.ChartCorssCursor.StringFormatX = new HQDateStringFormat();
        this.ChartCorssCursor.StringFormatY = new HQPriceStringFormat();
        this.ChartCorssCursor.StringFormatY.LanguageID = this.LanguageID;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.SplashTitle;

        //创建框架容器
        this.Frame = new HQTradeFrame();
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
            titlePaint.LanguageID = this.LanguageID;
            this.Frame.SubFrame[i].Frame.TitlePaint = titlePaint;
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

            var frame = new KLineFrame();
            frame.Canvas = this.Canvas;
            frame.ChartBorder = border;
            frame.Identify = i;                   //窗口序号
            frame.RightSpaceCount = this.RightSpaceCount; //右边

            frame.HorizontalMax = 20;
            frame.HorizontalMin = 10;

            if (i == 0) 
            {
                frame.YSplitOperator = new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
                frame.YSplitOperator.FrameSplitData2 = this.FrameSplitData.get('double');
                border.BottomSpace = 12;  //主图上下留空间
                border.TopSpace = 12;
            }
            else 
            {
                frame.YSplitOperator = new FrameSplitY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
                frame.YSplitOperator.LanguageID = this.LanguageID;
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
            if (i == 0) subFrame.Height = 20;
            else subFrame.Height = 10;

            this.Frame.SubFrame[i] = subFrame;
        }
    }

    this.CreateSubFrameItem = function (id) 
    {
        var border = new ChartBorder();
        border.UIElement = this.UIElement;

        var frame = new KLineFrame();
        frame.Canvas = this.Canvas;
        frame.ChartBorder = border;
        frame.Identify = id;                   //窗口序号

        if (this.ModifyIndexDialog) frame.ModifyIndexEvent = this.ModifyIndexDialog.DoModal;        //绑定菜单事件
        if (this.ChangeIndexDialog) frame.ChangeIndexEvent = this.ChangeIndexDialog.DoModal;

        frame.HorizontalMax = 20;
        frame.HorizontalMin = 10;
        frame.YSplitOperator = new FrameSplitY();
        frame.YSplitOperator.LanguageID = this.LanguageID;
        frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
        frame.YSplitOperator.Frame = frame;
        frame.YSplitOperator.ChartBorder = border;
        frame.XSplitOperator = new FrameSplitKLineX();
        frame.XSplitOperator.Frame = frame;
        frame.XSplitOperator.ChartBorder = border;
        frame.XSplitOperator.ShowText = false;

        //K线数据绑定
        var xPointCouont = this.Frame.SubFrame[0].Frame.XPointCount;
        frame.XPointCount = xPointCouont;
        frame.Data = this.ChartPaint[0].Data;

        for (var j = frame.HorizontalMin; j <= frame.HorizontalMax; j += 1) 
        {
            frame.HorizontalInfo[j] = new CoordinateInfo();
            frame.HorizontalInfo[j].Value = j;
            frame.HorizontalInfo[j].Message[1] = j.toString();
            frame.HorizontalInfo[j].Font = "14px 微软雅黑";
        }

        var subFrame = new SubFrameItem();
        subFrame.Frame = frame;
        subFrame.Height = 10;

        return subFrame;
    }

    //创建主图K线画法
    this.CreateMainKLine = function () 
    {
        var kline = new ChartKLine();
        kline.Canvas = this.Canvas;
        kline.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        kline.ChartFrame = this.Frame.SubFrame[0].Frame;
        kline.Name = "Main-KLine";
        kline.DrawType = this.KLineDrawType;

        this.ChartPaint[0] = kline;

        this.TitlePaint[0] = new DynamicKLineTitlePainting();
        this.TitlePaint[0].Frame = this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas = this.Canvas;
        this.TitlePaint[0].LanguageID = this.LanguageID;

        //主图叠加画法
        var paint = new ChartOverlayKLine();
        paint.Canvas = this.Canvas;
        paint.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame = this.Frame.SubFrame[0].Frame;
        paint.Name = "Overlay-KLine";
        paint.DrawType = this.KLineDrawType;
        this.OverlayChartPaint[0] = paint;

    }

    //绑定主图K线数据
    this.BindMainData = function (hisData, showCount) 
    {
        this.ChartPaint[0].Data = hisData;
        this.ChartPaint[0].Symbol = this.Symbol;
        for (var i in this.Frame.SubFrame) 
        {
            var item = this.Frame.SubFrame[i].Frame;
            item.XPointCount = showCount + this.RightSpaceCount;
            item.Data = this.ChartPaint[0].Data;

            item.XSplitOperator.Symbol = this.Symbol;
            item.XSplitOperator.Period = this.Period;
        }

        this.TitlePaint[0].Data = this.ChartPaint[0].Data;                    //动态标题
        this.TitlePaint[0].Symbol = this.Symbol;
        this.TitlePaint[0].Name = this.Name;
        this.TitlePaint[0].Period = this.Period;

        this.ChartCorssCursor.StringFormatX.Data = this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data = this.ChartPaint[0].Data;

        this.OverlayChartPaint[0].MainData = this.ChartPaint[0].Data;         //K线叠加

        var dataOffset = hisData.Data.length - showCount;
        if (dataOffset < 0) dataOffset = 0;
        this.ChartPaint[0].Data.DataOffset = dataOffset;

        this.ChartCorssCursor.StringFormatY.Symbol = this.Symbol;

        this.CursorIndex = showCount;
        if (this.CursorIndex + dataOffset >= hisData.Data.length) this.CursorIndex = hisData.Data.length - 1 - dataOffset;
        if (this.CursorIndex < 0) this.CursorIndex = 0; //不一定对啊
    }

    this.UpdateMainData = function (hisData, lastDataCount) //更新主图数据(不会放大缩小数据)
    {
        var frameHisdata = null;
        if (!this.Frame.Data) frameHisdata = this.Frame.Data;
        else if (this.Frame.SubFrame && this.Frame.SubFrame[0]) frameHisdata = this.Frame.SubFrame[0].Frame.Data;
        if (!frameHisdata) return;

        var newDataCount = 0;
        if (lastDataCount > 0 && hisData.Data.length > lastDataCount) 
        {
            newDataCount = hisData.Data.length - lastDataCount;
            console.log(`[KLineChartContainer::UpdateMainData]  [count=${lastDataCount}->${hisData.Data.length}], [newDataCount=${newDataCount}]`);
        }

        this.ChartPaint[0].Data = hisData;
        this.ChartPaint[0].Symbol = this.Symbol;
        this.ChartPaint[0].Data.DataOffset = frameHisdata.DataOffset + newDataCount;    //加上数据增加的个数
        for (var i in this.Frame.SubFrame) 
        {
            var item = this.Frame.SubFrame[i].Frame;
            item.Data = this.ChartPaint[0].Data;
            if (i==0)
            {
                item.YSplitOperator.Symbol = this.Symbol;
                item.YSplitOperator.Data = this.ChartPaint[0].Data;          //K线数据
                item.YSplitOperator.Period = this.Period;                    //周期
            }
        }

        this.TitlePaint[0].Data = this.ChartPaint[0].Data;                    //动态标题
        this.TitlePaint[0].Symbol = this.Symbol;
        this.TitlePaint[0].Name = this.Name;

        this.ChartCorssCursor.StringFormatX.Data = this.ChartPaint[0].Data;   //十字光标
        this.Frame.Data = this.ChartPaint[0].Data;

        for (var i in this.OverlayChartPaint)    //主图股票数据绑定到叠加股票上
        {
            var item = this.OverlayChartPaint[i];
            item.MainData = this.ChartPaint[0].Data;
        }

        this.ChartCorssCursor.StringFormatY.Symbol = this.Symbol;
    }

    //创建指定窗口指标
    this.CreateWindowIndex = function (windowIndex) 
    {
        this.WindowIndex[windowIndex].Create(this, windowIndex);
    }

    this.BindIndexData = function (windowIndex, hisData) 
    {
        if (!this.WindowIndex[windowIndex]) return;
        if (typeof (this.WindowIndex[windowIndex].RequestData) == "function")  //数据需要另外下载的.
        {
            this.WindowIndex[windowIndex].RequestData(this, windowIndex, hisData);
            return;
        }
        if (typeof (this.WindowIndex[windowIndex].ExecuteScript) == 'function')    //脚本指标
        {
            this.WindowIndex[windowIndex].ExecuteScript(this, windowIndex, hisData);
            return;
        }

        this.WindowIndex[windowIndex].BindData(this, windowIndex, hisData);
    }

    //执行指示(专家指示 五彩K线)
    this.BindInstructionIndexData = function (hisData) 
    {
        if (this.ColorIndex && typeof (this.ColorIndex.ExecuteScript) == 'function')   //五彩K线
        {
            this.ColorIndex.ExecuteScript(this, 0, hisData);
        }

        if (this.TradeIndex && typeof (this.TradeIndex.ExecuteScript) == 'function')   //交易指标
        {
            this.TradeIndex.ExecuteScript(this, 0, hisData);
        }
    }

    //获取子窗口的所有画法
    this.GetChartPaint = function (windowIndex) 
    {
        var paint = new Array();
        for (var i in this.ChartPaint) 
        {
            if (i == 0) continue; //第1个K线数据除外
            var item = this.ChartPaint[i];
            if (item.ChartFrame == this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    this.AutoUpdateEvent = function (bStart)   //自定更新事件, 是给websocket使用
    {
        var eventID = bStart ? JSCHART_EVENT_ID.RECV_START_AUTOUPDATE : JSCHART_EVENT_ID.RECV_STOP_AUTOUPDATE;
        if (!this.mapEvent.has(eventID)) return;

        var self = this;
        var event = this.mapEvent.get(eventID);
        var data = { Stock: { Symbol: this.Symbol, Name: this.Name, Right: this.Right, Period: this.Period } };
        if (bStart) 
        {
            data.Callback = function (data) //数据到达更新回调
            {
                if (ChartData.IsDayPeriod(self.Period, true)) self.RecvRealtimeData(data);
                else if (ChartData.IsMinutePeriod(self.Period, true)) self.RecvMinuteRealtimeData(data);
                else if (ChartData.IsSecondPeriod(self.Period)) self.RecvMinuteRealtimeData(data);
            }
        }
        event.Callback(event, data, this);
    }

    this.RequestHistoryData = function () 
    {
        var self = this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.ResetDragDownload();
        this.Draw();

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'KLineChartContainer::RequestHistoryData', //类名::
                Explain: '日K数据',
                Request: {
                    Url: self.KLineApiUrl, Type: 'POST',
                    Data: { symbol: self.Symbol, count: self.MaxReqeustDataCount, field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"] }
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistoryData(data);
                self.AutoUpdateEvent(true);
                self.AutoUpdate();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
        url: this.KLineApiUrl,
        data:
        {
            "field": ["name","symbol","yclose","open","price","high","low","vol"],
            "symbol": self.Symbol,
            "start": -1,
            "count": self.MaxReqeustDataCount
        },
        method: 'POST',
        dataType: 'json',
        success: function (data) {
            self.ChartSplashPaint.IsEnableSplash = false;
            self.RecvHistoryData(data);
            self.AutoUpdateEvent(true);
            self.AutoUpdate();
        }
        });
    }

    this.RecvHistoryData = function (recvData) 
    {
        var data = recvData.data;
        var aryDayData = KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = aryDayData;
        sourceData.DataType = 0;      //0=日线数据 1=分钟数据
        sourceData.Symbol = data.symbol;
        this.SourceData = sourceData;

        if (this.BeforeBindMainData) this.BeforeBindMainData("RecvHistoryData");

        //显示的数据
        var bindData = new ChartData();
        bindData.Data = aryDayData;
        bindData.Right = this.Right;
        bindData.Period = this.Period;
        bindData.DataType = 0;

        if (bindData.Right > 0 && !this.IsApiPeriod)    //复权
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if (ChartData.IsDayPeriod(bindData.Period, false) && !this.IsApiPeriod)   //周期数据
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        //绑定数据
        this.Symbol = data.symbol;
        this.Name = data.name;
        this.BindMainData(bindData, this.PageSize);
        if (this.AfterBindMainData) this.AfterBindMainData("RecvHistoryData");
        this.Frame.SetSizeChage(true);              //数据到达通知坐标框架
        this.BindInstructionIndexData(bindData);    //执行指示脚本
        
        var firstSubFrame;  //主窗口
        for (var i = 0; i < this.Frame.SubFrame.length; ++i)    //执行指标
        {
            if (i == 0) firstSubFrame = this.Frame.SubFrame[i].Frame;
            this.BindIndexData(i, bindData);
        }

        if (firstSubFrame && firstSubFrame.YSplitOperator)
        {
            firstSubFrame.YSplitOperator.Symbol = this.Symbol;                    //绑定代码
            firstSubFrame.YSplitOperator.Data = this.ChartPaint[0].Data;          //K线数据
        }

        //请求叠加数据 (主数据下载完再下载))
        this.RequestOverlayHistoryData();

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        if (this.mapEvent.has(JSCHART_EVENT_ID.RECV_HISTROY_DATA)) 
        {
            var event = this.mapEvent.get(JSCHART_EVENT_ID.RECV_HISTROY_DATA);
            var data = { HistoryData: bindData, Stock: { Symbol: this.Symbol, Name: this.Name } }
            event.Callback(event, data, this);
        }
        else    //老的回调暂时保留
        {
            if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistroyData', this);   //单词拼写错误, 请使用下面的回调
            if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistoryData', this);
        }
    }

    this.ReqeustHistoryMinuteData = function () 
    {
        var self = this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.ResetDragDownload();

        if (this.NetworkFilter)
        {
            var obj = 
            {
                Name: 'KLineChartContainer::ReqeustHistoryMinuteData', //类名
                Explain: '1分钟K线数据',
                Request: 
                {
                    Url: self.MinuteKLineApiUrl, Type: 'POST', Data: {
                        symbol: self.Symbol, count: self.MaxRequestMinuteDayCount,
                        field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"]
                    }
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteHistoryData(data);
                self.AutoUpdateEvent(true);
                self.AutoUpdate();
            });
            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.MinuteKLineApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol"],
                "symbol": self.Symbol,
                "start": -1,
                "count": self.MaxRequestMinuteDayCount
            },
            method: 'POST',
            dataType: "json",
            success: function (data) 
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteHistoryData(data);
                self.AutoUpdateEvent(true);
                self.AutoUpdate();
            }
        });
    }

    this.RecvMinuteHistoryData = function (recvData) 
    {
        var data = recvData.data;
        var aryDayData = KLineChartContainer.JsonDataToMinuteHistoryData(data);

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = aryDayData;
        sourceData.DataType = 1;      //0=日线数据 1=分钟数据
        sourceData.Symbol = data.symbol;
        this.SourceData = sourceData;
        if (this.BeforeBindMainData) this.BeforeBindMainData("RecvMinuteHistoryData");

        //显示的数据
        var bindData = new ChartData();
        bindData.Data = aryDayData;
        bindData.Right = this.Right;
        bindData.Period = this.Period;
        bindData.DataType = 1;
        bindData.Symbol = data.symbol;

        if (ChartData.IsMinutePeriod(bindData.Period, false) && !this.IsApiPeriod)   //周期数据
        {
            var periodData = sourceData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        //绑定数据
        this.Symbol = data.symbol;
        this.Name = data.name;
        this.BindMainData(bindData, this.PageSize);
        if (this.AfterBindMainData) this.AfterBindMainData("RecvMinuteHistoryData");
        this.Frame.SetSizeChage(true);
        this.BindInstructionIndexData(bindData);    //执行指示脚本
        
        var firstSubFrame;  //主窗口
        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            if (i == 0) firstSubFrame = this.Frame.SubFrame[i].Frame;
            this.BindIndexData(i, bindData);
        }

        if (firstSubFrame && firstSubFrame.YSplitOperator) 
        {
            firstSubFrame.YSplitOperator.Symbol = this.Symbol;                    //绑定代码
            firstSubFrame.YSplitOperator.Data = this.ChartPaint[0].Data;          //K线数据
        }

        this.OverlayChartPaint[0].Data = null; //分钟数据不支持叠加 清空

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        if (this.mapEvent.has(JSCHART_EVENT_ID.RECV_HISTROY_DATA)) 
        {
            var event = this.mapEvent.get(JSCHART_EVENT_ID.RECV_HISTROY_DATA);
            var data = { HistoryData: bindData, Stock: { Symbol: this.Symbol, Name: this.Name } }
            event.Callback(event, data, this);
        }
        else 
        {
            if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvMinuteHistoryData', this);
        }
    }

    //请求实时行情数据
    this.RequestRealtimeData = function () 
    {
        var self = this;

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'KLineChartContainer::RequestRealtimeData', //类名::函数名
                Explain: '当天最新日线数据',
                Request: 
                {
                    Url: self.RealtimeApiUrl, Data: {
                        symbol: [self.Symbol],
                        field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol", "amount", "date", "time"]
                    }, Type: 'POST'
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvRealtimeData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": ["name","symbol","yclose","open","price","high","low","vol","amount","date","time"],
                "symbol": [self.Symbol],
                "start": -1
            },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvRealtimeData(data);
                self.AutoUpdate();
            }
        });
    }

    this.RecvRealtimeData = function (recvdata) 
    {
        if (this.IsOnTouch == true) return;   //正在操作中不更新数据
        var data=recvdata.data;
        if (!data || !data.stock || !data.stock[0] || this.Symbol != data.stock[0].symbol) 
        {
            console.log('[KLineChartContainer::RecvRealtimeData] recvdata error', recvdata);
            return;
        }
        
        var realtimeData = KLineChartContainer.JsonDataToRealtimeData(data);
        var item = this.SourceData.Data[this.SourceData.Data.length - 1];   //最新的一条数据
        var lastDataCount = this.GetHistoryDataCount();                     //保存下上一次的数据个数

        if (item.Date == realtimeData.Date)   //实时行情数据更新
        {
            //console.log('[KLineChartContainer::RecvRealtimeData] update kline by minute data', realtimeData);
            item.Close = realtimeData.Close;
            item.High = realtimeData.High;
            item.Low = realtimeData.Low;
            item.Vol = realtimeData.Vol;
            item.Amount = realtimeData.Amount;
        }
        else if (item.Date < realtimeData.Date)   //新增加数据
        {
            console.log('[KLineChartContainer::RecvRealtimeData] insert kline by minute data', realtimeData);
            var newItem = new HistoryData();
            newItem.YClose = realtimeData.YClose;
            newItem.Open = realtimeData.Open;
            newItem.Close = realtimeData.Close;
            newItem.High = realtimeData.High;
            newItem.Low = realtimeData.Low;
            newItem.Vol = realtimeData.Vol;
            newItem.Amount = realtimeData.Amount;
            newItem.Date = realtimeData.Date;
            this.SourceData.Data.push(newItem);
        }
        else 
        {
            return;
        }

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period,true) && !this.IsApiPeriod)    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if (!this.IsApiPeriod)
        {
            if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据 (0= 日线,4=1分钟线 不需要处理)
            {
                var periodData = bindData.GetPeriodData(bindData.Period);
                bindData.Data = periodData;
            }
        }
        

        //绑定数据
        this.UpdateMainData(bindData, lastDataCount);
        this.Frame.SetSizeChage(true);
        this.BindInstructionIndexData(bindData);    //执行指示脚本

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) {
            this.BindIndexData(i, bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        this.SendKLineUpdateEvent(bindData);
    }

    this.GetHistoryDataCount = function () 
    {
        var frameHisdata = null;
        if (!this.Frame.Data) frameHisdata = this.Frame.Data;
        else if (this.Frame.SubFrame && this.Frame.SubFrame[0]) frameHisdata = this.Frame.SubFrame[0].Frame.Data;
        if (!frameHisdata) return -1;
        var lastDataCount = frameHisdata.Data.length;  //上一个的数据长度
        return lastDataCount;
    }

    this.RequestMinuteRealtimeData = function () 
    {
        var self = this;
        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'KLineChartContainer::RequestMinuteRealtimeData', //类名::
                Explain: '当天1分钟K线数据',
                Request: {
                    Url: self.RealtimeApiUrl, Data: {
                        symbol: [self.Symbol],
                        field: ["name", "symbol", "price", "yclose", "minutecount", "minute", "date", "time"]
                    }, Type: 'POST'
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvMinuteRealtimeData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.RealtimeApiUrl,
            data:
            {
                "field": ["name", "symbol", "price", "yclose", "minutecount", "minute", "date", "time"],
                "symbol": [self.Symbol],
                "start": -1
            },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvMinuteRealtimeData(data);
                self.AutoUpdate();
            }
        });
    }

    this.SetSourceDatatLimit = function (aryLimit) 
    {
        this.SourceDataLimit = new Map();
        for (var i in aryLimit) 
        {
            var item = aryLimit[i];
            this.SourceDataLimit.set(item.Period, item.MaxCount); //每个周期缓存数据最大个数 key=周期 value=最大个数 
            console.log(`[KLineChartContainer::SetSourceDatatLimit] Period=${item.Period}, MaxCount=${item.MaxCount}`);
        }
    } 

    this.ReduceSourceData = function () 
    {
        if (!this.SourceDataLimit) return;
        if (!this.SourceDataLimit.has(this.Period)) return;

        var limitCount = this.SourceDataLimit.get(this.Period);
        if (limitCount < 50) return;

        var frameHisdata = null;
        if (!this.Frame.Data) frameHisdata = this.Frame.Data;
        else if (this.Frame.SubFrame && this.Frame.SubFrame[0]) frameHisdata = this.Frame.SubFrame[0].Frame.Data;
        if (!frameHisdata) return;

        var dataOffset = frameHisdata.DataOffset;
        var removeCount = 0;
        while (this.SourceData.Data.length > limitCount) 
        {
            this.SourceData.Data.shift();
            --dataOffset;
            ++removeCount;
        }

        if (removeCount > 0) 
        {
            if (dataOffset < 0) dataOffset = 0;
            frameHisdata.DataOffset = dataOffset;
            console.log(`[KLineChartContainer::ReduceSourceData] remove data ${removeCount}, dataOffset=${dataOffset}`);
        }
    }      

    this.RecvMinuteRealtimeData = function (recvData) 
    {
        var data=recvData.data;
        if (this.IsOnTouch == true) return;   //正在操作中不更新数据
        if (data.ver == 2.0) 
        {
            this.RecvMinuteRealtimeDataV2(data);    //v2.0数据版本
            return;
        }

        if (!data.stock || !data.stock[0] || this.Symbol != data.stock[0].symbol) return;
        var realtimeData = KLineChartContainer.JsonDataToMinuteRealtimeData(data);
        if (!realtimeData) return;
        if (this.IsApiPeriod) this.ReduceSourceData();  //减少数据
        var lastDataCount = this.GetHistoryDataCount();   //保存下上一次的数据个数
        var lastSourceDataCount = this.SourceData.Data.length;
        if (!this.SourceData.MergeMinuteData(realtimeData)) return;
        console.log(`[KLineChartContainer::RecvMinuteRealtimeData] update kline by 1 minute data [${lastSourceDataCount}->${this.SourceData.Data.length}]`);

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period,true) && !this.IsApiPeriod)    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if (!this.IsApiPeriod)
        {
            if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据 (0= 日线,4=1分钟线 不需要处理)
            {
                var periodData = bindData.GetPeriodData(bindData.Period);
                bindData.Data = periodData;
            }
        }
        
        //绑定数据
        this.UpdateMainData(bindData, lastDataCount);
        this.Frame.SetSizeChage(true);
        this.BindInstructionIndexData(bindData);    //执行指示脚本

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) {
            this.BindIndexData(i, bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        this.SendKLineUpdateEvent(bindData);
    }

    this.RecvMinuteRealtimeDataV2 = function (data)    //新版本的
    {
        if (this.IsOnTouch == true) return;   //正在操作中不更新数据
        var aryMinuteData = KLineChartContainer.JsonDataToMinuteHistoryData(data);
        if (!aryMinuteData || aryMinuteData.length <= 0) return;
        if (this.IsApiPeriod) this.ReduceSourceData();  //减少数据
        var lastDataCount = this.GetHistoryDataCount();   //保存下上一次的数据个数

        if (!this.SourceData.MergeMinuteData(aryMinuteData)) return;

        console.log(`[KLineChartContainer::RecvMinuteRealtimeDataV2] update kline by 1 minute data [${lastDataCount}->${this.SourceData.Data.length}]`);

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period, true) && !this.IsApiPeriod)    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if ((ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false)) && !this.IsApiPeriod)   //周期数据 (0= 日线,4=1分钟线 不需要处理)
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        //绑定数据
        this.UpdateMainData(bindData, lastDataCount);
        this.Frame.SetSizeChage(true);
        this.BindInstructionIndexData(bindData);    //执行指示脚本

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) {
            this.BindIndexData(i, bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        this.SendKLineUpdateEvent(bindData);
    }

    this.SendKLineUpdateEvent = function (bindData)
    {
        var event = this.GetEvent(JSCHART_EVENT_ID.RECV_KLINE_UPDATE_DATA);
        if (event && event.Callback) 
        {
            var data = { HistoryData: bindData, Stock: { Symbol: this.Symbol, Name: this.Name } }
            event.Callback(event, data, this);
            return true;
        }

        return false;
    }

    //周期切换
    this.ChangePeriod = function (period, option) 
    {
        var isChangeKLineDrawType = false;
        if (option && option.KLine) 
        {
            if (IFrameSplitOperator.IsNumber(option.KLine.DrawType)) isChangeKLineDrawType = true;
        };

        if (this.Period == period) 
        {
            if (isChangeKLineDrawType) this.ChangeKLineDrawType(option.KLine.DrawType);
            return;
        }

        if (isChangeKLineDrawType) this.ChangeKLineDrawType(option.KLine.DrawType, false);   //切换K线类型, 不重绘
        
        var isDataTypeChange = false;
        var isDataTypeChange = false;
        if (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_START) 
        {
            if (this.SourceData.DataType != 0) isDataTypeChange = true;
        }
        else if ((period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END) || 
                    (period > CUSTOM_SECOND_PERIOD_START && period <= CUSTOM_SECOND_PERIOD_END)) 
        {
            if (this.SourceData.DataType != 1) isDataTypeChange = true;
        }
        else
        {
            switch (period) 
            {
            case 0:     //日线
            case 1:     //周
            case 2:     //月
            case 3:     //年
            case 21:    //双周
                if (this.SourceData.DataType != 0) isDataTypeChange = true;
                break;
            case 4:     //1分钟
            case 5:     //5分钟
            case 6:     //15分钟
            case 7:     //30分钟
            case 8:     //60分钟
            case 11:    //2小时
            case 12:    //4小时
                if (this.SourceData.DataType != 1) isDataTypeChange = true;
                break;
            }
        }

        this.Period = period;
        if (isDataTypeChange == false && !this.IsApiPeriod) 
        {
            this.Update();
            return;
        }

        if (ChartData.IsDayPeriod(this.Period, true)) 
        {
            this.CancelAutoUpdate();                    //先停止更新
            this.AutoUpdateEvent(false);
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period))
        {
            this.CancelAutoUpdate();                    //先停止更新
            this.AutoUpdateEvent(false);
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }
    }

    //复权切换
    this.ChangeRight = function (right) 
    {
        if (IsIndexSymbol(this.Symbol)) return; //指数没有复权

        if (right < 0 || right > 2) return;

        if (this.Right == right) return;

        this.Right = right;

        if (!this.IsApiPeriod)
        {
            this.Update();
            return;
        }
        else
        {
            if (ChartData.IsDayPeriod(this.Period, true)) 
            {
                this.CancelAutoUpdate();                    //先停止更新
                this.AutoUpdateEvent(false);
                this.RequestHistoryData();                  //请求日线数据
                this.ReqeustKLineInfoData();
            }
            else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period)) 
            {
                this.CancelAutoUpdate();                    //先停止更新
                this.AutoUpdateEvent(false);
                this.ReqeustHistoryMinuteData();            //请求分钟数据
            }
        }
    }

  //删除某一个窗口的指标
  this.DeleteIndexPaint = function (windowIndex) {
    let paint = new Array();  //踢出当前窗口的指标画法
    for (let i in this.ChartPaint) {
      let item = this.ChartPaint[i];

      if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame)
        paint.push(item);
    }

    
    this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = null;          //清空指定最大最小值
    this.Frame.SubFrame[windowIndex].Frame.IsLocked = false;                //解除上锁
    this.Frame.SubFrame[windowIndex].Frame.YSplitScale = null;              //清空固定刻度

    this.ChartPaint = paint;

    //清空东条标题
    var titleIndex = windowIndex + 1;
    this.TitlePaint[titleIndex].Data = [];
    this.TitlePaint[titleIndex].Title = null;
  }

  
    this.ShowKLine = function (isShow) //显示隐藏主图K线
    {
        if (this.ChartPaint.length <= 0 || !this.ChartPaint[0]) return;
        this.ChartPaint[0].IsShow = isShow;
    }

    this.SetInstructionData = function (type, instructionData) //设置指示数据
    {
        if (this.ChartPaint.length <= 0 || !this.ChartPaint[0]) return;
        if (type == 2) //五彩K线
        {
            this.ChartPaint[0].ColorData = instructionData.Data;
        }
        else if (type == 1)   //专家指示
        {
            this.ChartPaint[0].TradeData = { Sell: instructionData.Sell, Buy: instructionData.Buy };
        }
    }

    this.ChangeInstructionIndex = function (indexName) 
    {
        let scriptData = new JSIndexScript();
        let indexInfo = scriptData.Get(indexName);
        if (!indexInfo) return;
        if (indexInfo.InstructionType != 1 && indexInfo.InstructionType != 2) return;

        this.ChangeInstructionScriptIndex(indexInfo);

    }

    this.ChangeInstructionScriptIndex = function (indexData) 
    {
        if (indexData.InstructionType == 1)       //交易系统
        {
            this.TradeIndex = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行
        }
        else if (indexData.InstructionType == 2)  //五彩K线
        {
            this.ColorIndex = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行
        }
        else 
        {
            return;
        }
        
        var bindData = this.ChartPaint[0].Data;
        this.BindInstructionIndexData(bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    this.CancelInstructionIndex = function ()  //取消指示数据
    {
        if (this.ChartPaint.length <= 0 || !this.ChartPaint[0]) return;

        this.ColorIndex=null;
        this.TradeIndex=null;
        this.ChartPaint[0].ColorData = null;  //五彩K线数据取消掉
        this.ChartPaint[0].TradeData = null;  //交易系统数据取消

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //切换成 脚本指标
    this.ChangeScriptIndex = function (windowIndex, indexData) 
    {
        this.DeleteIndexPaint(windowIndex);
        this.WindowIndex[windowIndex] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行

        var bindData = this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex, bindData);   //执行脚本

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    //切换api指标
    this.ChangeAPIIndex = function (windowIndex, indexData) 
    {
        this.DeleteIndexPaint(windowIndex);
        //使用API挂接指标数据 API:{ Name:指标名字, Script:指标脚本可以为空, Args:参数可以为空, Url:指标执行地址 }
        var apiItem = indexData.API;
        this.WindowIndex[windowIndex] = new APIScriptIndex(apiItem.Name, apiItem.Script, apiItem.Args, indexData);

        var bindData = this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex, bindData);   //执行脚本

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }


    //切换指标 指定切换窗口指标
    this.ChangeIndex = function (windowIndex, indexName, option) 
    {
        if (option && option.API)   //切换api指标
            return this.ChangeAPIIndex(windowIndex, option);
            
        var indexItem = JSIndexMap.Get(indexName);
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
            let indexData = 
            { 
                Name: indexInfo.Name, Script: indexInfo.Script, Args: indexInfo.Args, ID: indexName,
                //扩展属性 可以是空
                KLineType: indexInfo.KLineType, YSpecificMaxMin: indexInfo.YSpecificMaxMin, YSplitScale: indexInfo.YSplitScale,
                FloatPrecision: indexInfo.FloatPrecision, StringFormat: indexInfo.StringFormat
            };

            if (option) 
            {
                if (option.FloatPrecision >= 0) indexData.FloatPrecision = option.FloatPrecision;
                if (option.StringFormat > 0) indexData.StringFormat = option.StringFormat;
                if (option.Args) indexData.Args = option.Args;
            }

            return this.ChangeScriptIndex(windowIndex, indexData);
        }

        //主图指标
        if (indexItem.IsMainIndex) 
        {
            if (windowIndex > 0) windowIndex = 0;  //主图指标只能在主图显示
        }
        else 
        {
            if (windowIndex == 0) windowIndex = 1;  //幅图指标,不能再主图显示
        }

        var paint = new Array();  //踢出当前窗口的指标画法
        for (var i in this.ChartPaint) 
        {
            var item = this.ChartPaint[i];
            if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame) paint.push(item);
        }

        //清空指定最大最小值
        this.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = null;
        this.Frame.SubFrame[windowIndex].Frame.YSplitScale=null;

        this.ChartPaint = paint;

        //清空东条标题
        var titleIndex = windowIndex + 1;
        this.TitlePaint[titleIndex].Data = [];
        this.TitlePaint[titleIndex].Title = null;

        this.WindowIndex[windowIndex] = indexItem.Create();
        this.CreateWindowIndex(windowIndex);

        var bindData = this.ChartPaint[0].Data;
        this.BindIndexData(windowIndex, bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    this.ChangeKLineDrawType = function (drawType, isDraw) 
    {
        if (this.KLineDrawType == drawType) return;

        this.KLineDrawType = drawType;
        for (var i in this.ChartPaint) 
        {
            var item = this.ChartPaint[i];
            if (i == 0) item.DrawType = this.KLineDrawType;
            else if (item.ClassName == 'ChartVolStick') item.KLineDrawType = this.KLineDrawType
        }

        if (this.OverlayChartPaint[0]) this.OverlayChartPaint[0].DrawType = this.KLineDrawType;   //叠加K线修改

        if (isDraw == false) return;

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //获取当天的显示的指标
    this.GetIndexInfo = function () 
    {
        var aryIndex = [];
        for (var i in this.WindowIndex) 
        {
            var item = this.WindowIndex[i];
            var info = { Name: item.Name };
            if (item.ID) info.ID = item.ID;
            aryIndex.push(info);
        }

        return aryIndex;
    }

    this.ChangeIndexTemplate = function (option)   //切换指标模板 可以设置指标窗口个数 每个窗口的指标
    {
        if (!option.Windows) return;
        var count = option.Windows.length;
        if (count <= 0) return;
        var currentLength = this.Frame.SubFrame.length;

        //清空所有的指标图型
        for (var i = 0; i < currentLength; ++i) 
        {
            this.DeleteIndexPaint(i);
            var frame = this.Frame.SubFrame[i];
            frame.YSpecificMaxMin = null;
            frame.IsLocked = false;
            frame.YSplitScale = null;
        }

        if (currentLength > count) 
        {
            this.Frame.SubFrame.splice(count, currentLength - count);
            this.WindowIndex.splice(count, currentLength - count);
        }
        else 
        {
            for (var i = currentLength; i < count; ++i)  //创建新的指标窗口
            {
                var subFrame = this.CreateSubFrameItem(i);
                this.Frame.SubFrame[i] = subFrame;
                var titlePaint = new DynamicChartTitlePainting();
                titlePaint.Frame = this.Frame.SubFrame[i].Frame;
                titlePaint.Canvas = this.Canvas;
                titlePaint.LanguageID = this.LanguageID;
                this.TitlePaint[i + 1] = titlePaint;
            }
        }

        var systemScript = new JSCommonIndexScript.JSIndexScript();
        var bindData = this.ChartPaint[0].Data;
        for (var i = 0; i < count; ++i) 
        {
            var windowIndex = i;
            var indexID = option.Windows[i].Index;
            var indexItem = JSIndexMap.Get(indexID);
            var titleIndex = windowIndex + 1;
            this.TitlePaint[titleIndex].Data = [];
            this.TitlePaint[titleIndex].Title = null;
            if (indexItem) 
            {
                this.WindowIndex[i] = indexItem.Create();
                this.CreateWindowIndex(windowIndex);
                this.BindIndexData(windowIndex, bindData);
            }
            else 
            {
                var indexInfo = systemScript.Get(indexID);
                if (indexInfo) 
                {
                    var args = indexInfo.Args;
                    if (option.Windows[i].Args) args = option.Windows[i].Args;
                    let indexData =
                    {
                        Name: indexInfo.Name, Script: indexInfo.Script, Args: args, ID: indexID,
                        //扩展属性 可以是空
                        KLineType: indexInfo.KLineType, YSpecificMaxMin: indexInfo.YSpecificMaxMin, YSplitScale: indexInfo.YSplitScale,
                        FloatPrecision: indexInfo.FloatPrecision, Condition: indexInfo.Condition
                    };

                    this.WindowIndex[i] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行
                    this.BindIndexData(windowIndex, bindData);   //执行脚本
                }
            }
        }

        //最后一个显示X轴坐标
        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            var item = this.Frame.SubFrame[i].Frame;
            if (i == this.Frame.SubFrame.length - 1) item.XSplitOperator.ShowText = true;
            else item.XSplitOperator.ShowText = false;
        }

        this.UpdataDataoffset();           //更新数据偏移
        this.Frame.SetSizeChage(true);
        this.ResetFrameXYSplit();
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

    this.CreateExtendChart = function (name, option)   //创建扩展图形
    {
        var chart;
        switch (name)
        {
            case 'KLineTooltip':
                if (option.Create && typeof(option.Create)=='function') chart=option.Create();
                else chart = new KLineTooltipPaint();
                chart.Canvas = this.Canvas;
                chart.ChartBorder = this.Frame.ChartBorder;
                chart.ChartFrame = this.Frame;
                chart.HQChart = this;
                option.LanguageID = this.LanguageID;
                chart.SetOption(option);
                this.ExtendChartPaint.push(chart);
                return chart;
            case '背景图':
                chart = new BackgroundPaint();
                chart.Canvas = this.Canvas;
                chart.ChartBorder = this.Frame.ChartBorder;
                chart.ChartFrame = this.Frame;
                chart.HQChart = this;
                chart.SetOption(option);
                this.ExtendChartPaint.push(chart);
                return chart;
            default:
                return null;
        }
    }

  //锁|解锁指标 { Index:指标名字,IsLocked:是否要锁上,Callback:回调 }
  this.LockIndex = function (lockData) {
    if (!lockData) return;
    if (!lockData.IndexName) return;

    for (let i in this.WindowIndex) {
      let item = this.WindowIndex[i];
      if (!item) conintue;
      if (item.Name == lockData.IndexName) {
        item.SetLock(lockData);
        this.Update();
        break;
      }
    }
  }

  this.TryClickLock = function (x, y) {
    for (let i in this.Frame.SubFrame) {
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

    this.StopAutoUpdate = function () 
    {
        this.IsAutoUpdate = false;
        this.CancelAutoUpdate();
        this.AutoUpdateEvent(false);
    }

    this.Update = function () 
    {
        if (!this.SourceData) return;
        if (this.BeforeBindMainData) this.BeforeBindMainData('Update');

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period, true))    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据 (0= 日线,4=1分钟线 不需要处理))
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        //绑定数据
        this.BindMainData(bindData, this.PageSize);
        if (this.AfterBindMainData) this.AfterBindMainData("Update");

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) {
            this.BindIndexData(i, bindData);
        }

        //叠加数据周期调整
        if (this.OverlayChartPaint[0].SourceData) 
        {
            if (ChartData.IsMinutePeriod(this.Period, true))  //分钟不支持 清空掉
            {
                this.OverlayChartPaint[0].Data = null;
            }
            else 
            {
                var bindData = new ChartData();
                bindData.Data = this.OverlayChartPaint[0].SourceData.Data;
                bindData.Period = this.Period;
                bindData.Right = this.Right;

                if (bindData.Right > 0 && !IsIndexSymbol(this.OverlayChartPaint[0].Symbol))       //复权数据
                {
                    var rightData = bindData.GetRightDate(bindData.Right);
                    bindData.Data = rightData;
                }

                var aryOverlayData = this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
                bindData.Data = aryOverlayData;

                if (ChartData.IsDayPeriod(bindData.Period, false))   //周期数据
                {
                    var periodData = bindData.GetPeriodData(bindData.Period);
                    bindData.Data = periodData;
                }

                this.OverlayChartPaint[0].Data = bindData;
            }
        }

        this.ReqeustKLineInfoData();

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //切换股票代码
    this.ChangeSymbol = function (symbol) 
    {
        this.CancelAutoUpdate();    //先停止更新
        this.AutoUpdateEvent(false);
        this.Symbol = symbol;
        if (IsIndexSymbol(symbol)) this.Right = 0;    //指数没有复权

        if (this.Frame && this.Frame.SubFrame) //清空指标
        {
            for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
                this.DeleteIndexPaint(i);
        }

        if (ChartData.IsDayPeriod(this.Period, true)) 
        {
            this.RequestHistoryData();                  //请求日线数据
            this.ReqeustKLineInfoData();
        }
        else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period))
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }
    }

    this.ReqeustKLineInfoData = function () 
    {
        if (this.ChartPaint.length > 0) 
        {
            var klinePaint = this.ChartPaint[0];
            klinePaint.InfoData = new Map();
        }

        //信息地雷信息
        for (var i in this.ChartInfo) 
        {
            this.ChartInfo[i].RequestData(this);
        }
    }

    //设置K线信息地雷
    this.SetKLineInfo = function (aryInfo, bUpdate) 
    {
        this.ChartInfo = [];  //清空信息地雷
        for (var i in aryInfo) 
        {
            var infoItem = JSKLineInfoMap.Get(aryInfo[i]);
            if (!infoItem) continue;
            var item = infoItem.Create();
            item.MaxReqeustDataCount = this.MaxReqeustDataCount;
            this.ChartInfo.push(item);
        }

        if (bUpdate == true) this.ReqeustKLineInfoData();
    }

    this.SetPolicyInfo = function (aryPolicy, bUpdate) 
    {
        if (!aryPolicy || !aryPolicy.length) return;
        var infoItem = JSKLineInfoMap.Get('策略选股');
        if (!infoItem) return;
        var policyInfo = infoItem.Create();
        policyInfo.SetPolicyList(aryPolicy);
        policyInfo.MaxReqeustDataCount = this.MaxReqeustDataCount;
        this.ChartInfo.push(policyInfo);

        if (bUpdate == true) this.ReqeustKLineInfoData();
    }

    //叠加股票
    this.OverlaySymbol = function (symbol,option) 
    {
        var paint = this.OverlayChartPaint[0];
        if (!paint.MainData) return false;

        paint.Symbol = symbol;
        if (option)
        {
            if (paint.Color) paint.Color = option.Color;
        }
        if (ChartData.IsDayPeriod(this.Period, true)) this.RequestOverlayHistoryData();                  //请求日线数据

        return true;
    }

    this.GetRequestDataCount = function () //K线请求数据个数　(由于可以拖拽下载历史数据,所有原来固定个数的就不能用了)
    {
        var result = { MaxRequestDataCount: this.MaxReqeustDataCount, MaxRequestMinuteDayCount: this.MaxRequestMinuteDayCount };

        if (!this.SourceData || !this.SourceData.Data || this.SourceData.Data.length <= 0) return result;

        if (ChartData.IsDayPeriod(this.Period, true)) 
        {
            var lCount = this.SourceData.Data.length;
            if (lCount > result.MaxRequestDataCount) result.MaxRequestDataCount = lCount;
        }
        else if (ChartData.IsMinutePeriod(this.Period, true)) 
        {

        }

        return result;
    }

    this.RequestOverlayHistoryData = function () 
    {
        if (!this.OverlayChartPaint.length) return;

        var symbol = this.OverlayChartPaint[0].Symbol;
        if (!symbol) return;

        var self = this;
        var dataCount = this.GetRequestDataCount();
        var firstDate = this.SourceData.Data[0].Date;
        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'KLineChartContainer::RequestOverlayHistoryData', //类名::
                Explain: '叠加股票日K线数据',
                Request: {
                    Url: self.KLineApiUrl, Data: {
                        symbol: symbol, count: dataCount.MaxRequestDataCount, "first": { date: firstDate },
                        field: ["name", "symbol", "yclose", "open", "price", "high", 'vol', 'amount']
                    }, Type: 'POST'
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvOverlayHistoryData(data);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        //请求数据
        wx.request({
            url: this.KLineApiUrl,
            data:
            {
                "field":["name","symbol","yclose","open","price","high"],
                "symbol": symbol,
                "start": -1,
                "count": this.MaxReqeustDataCount
            },
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvOverlayHistoryData(data);
            }
        });
    }

    this.RecvOverlayHistoryData = function (recvData) 
    {
        var data = recvData.data;
        var aryDayData = KLineChartContainer.JsonDataToHistoryData(data);

        //原始叠加数据
        var sourceData = new ChartData();
        sourceData.Data = aryDayData;

        var bindData = new ChartData();
        bindData.Data = aryDayData;
        bindData.Period = this.Period;
        bindData.Right = this.Right;

        if (bindData.Right > 0 && !IsIndexSymbol(data.symbol))    //复权数据 ,指数没有复权)
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        var aryOverlayData = this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
        bindData.Data = aryOverlayData;

        if (ChartData.IsDayPeriod(bindData.Period, false))   //周期数据
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        this.OverlayChartPaint[0].Data = bindData;
        this.OverlayChartPaint[0].SourceData = sourceData;
        this.OverlayChartPaint[0].Title = data.name;
        this.OverlayChartPaint[0].Symbol = data.symbol;
        this.Frame.SubFrame[0].Frame.YSplitOperator.CoordinateType = 1; //调整为百份比坐标

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    //取消叠加股票
    this.ClearOverlaySymbol = function () 
    {
        this.OverlayChartPaint[0].Symbol = null;
        this.OverlayChartPaint[0].Data = null;
        this.OverlayChartPaint[0].SourceData = null;
        this.OverlayChartPaint[0].TooltipRect = [];
        this.Frame.SubFrame[0].Frame.YSplitOperator.CoordinateType = 0; //调整一般坐标

        this.UpdateFrameMaxMin();
        this.Draw();
    }

  //创建画图工具
  this.CreateChartDrawPicture = function (name) {
    return false;
  }

  this.SetChartDrawPictureFirstPoint = function (x, y) {
    var drawPicture = this.CurrentChartDrawPicture;
    if (!drawPicture) return false;
    if (!this.Frame.SubFrame || this.Frame.SubFrame.length <= 0) return false;

    for (var i in this.Frame.SubFrame) {
      var frame = this.Frame.SubFrame[i].Frame;
      var left = frame.ChartBorder.GetLeft();
      var top = frame.ChartBorder.GetTopEx();
      var height = frame.ChartBorder.GetHeight();
      var width = frame.ChartBorder.GetWidth();

      this.Canvas.rect(left, top, width, height);
      if (this.Canvas.isPointInPath(x, y)) {
        drawPicture.Frame = frame;
        break;
      }
    }

    if (!drawPicture.Frame) return false;

    drawPicture.Point[0] = new Point();
    drawPicture.Point[0].X = x - this.UIElement.getBoundingClientRect().left;
    drawPicture.Point[0].Y = y - this.UIElement.getBoundingClientRect().top;
    drawPicture.Status = 1;   //第1个点完成
  }

  this.SetChartDrawPictureSecondPoint = function (x, y) {
    var drawPicture = this.CurrentChartDrawPicture;
    if (!drawPicture) return false;

    drawPicture.Point[1] = new Point();
    drawPicture.Point[1].X = x - this.UIElement.getBoundingClientRect().left;
    drawPicture.Point[1].Y = y - this.UIElement.getBoundingClientRect().top;

    drawPicture.Status = 2;   //设置第2个点
  }

  //xStep,yStep 移动的偏移量
  this.MoveChartDrawPicture = function (xStep, yStep) {
    var drawPicture = this.CurrentChartDrawPicture;
    if (!drawPicture) return false;

    //console.log("xStep="+xStep+" yStep="+yStep);
    drawPicture.Move(xStep, yStep);

    return true;
  }

  this.FinishChartDrawPicturePoint = function () {
    var drawPicture = this.CurrentChartDrawPicture;
    if (!drawPicture) return false;
    if (drawPicture.PointCount != drawPicture.Point.length) return false;

    drawPicture.Status = 10;  //完成
    drawPicture.PointToValue();

    this.ChartDrawPicture.push(drawPicture);
    this.CurrentChartDrawPicture = null;

    return true;
  }

  this.FinishMoveChartDrawPicture = function () {
    var drawPicture = this.CurrentChartDrawPicture;
    if (!drawPicture) return false;
    if (drawPicture.PointCount != drawPicture.Point.length) return false;

    drawPicture.Status = 10;  //完成
    drawPicture.PointToValue();

    this.CurrentChartDrawPicture = null;
    return true;
  }

  //清空所有的画线工具
  this.ClearChartDrawPicture = function (drawPicture) {
    if (!drawPicture) {
      this.ChartDrawPicture = [];
      this.Draw();
    }
    else {
      for (var i in this.ChartDrawPicture) {
        if (this.ChartDrawPicture[i] == drawPicture) {
          this.ChartDrawPicture.splice(i, 1);
          this.Draw();
        }
      }
    }
  }

  //更新信息地雷
  this.UpdataChartInfo = function () {
    //TODO: 根据K线数据日期来做map, 不在K线上的合并到下一个k线日期里面
    var mapInfoData = new Map();
    for (var i in this.ChartInfo) {
      var infoData = this.ChartInfo[i].Data;
      for (var j in infoData) {
        var item = infoData[j];
        if (mapInfoData.has(item.Date.toString())) {
          mapInfoData.get(item.Date.toString()).Data.push(item);
        }
        else {

          mapInfoData.set(item.Date.toString(), { Data: new Array(item) });
        }
      }
    }

    var klinePaint = this.ChartPaint[0];
    klinePaint.InfoData = mapInfoData;
    var titlePaint = this.TitlePaint[0];
    if (titlePaint) titlePaint.InfoData = mapInfoData;
  }

    //更新窗口指标
    this.UpdateWindowIndex = function (index) 
    {
        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;

        if (bindData.Right > 0)    //复权
        {
            var rightData = bindData.GetRightDate(bindData.Right);
            bindData.Data = rightData;
        }

        if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        this.WindowIndex[index].BindData(this, index, bindData);

        this.UpdataDataoffset();           //更新数据偏移
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();
    }

  //修改参数指标
  this.ChangeWindowIndexParam = function (index) {
    this.WindowIndex[index].Index[0].Param += 1;
    this.WindowIndex[index].Index[1].Param += 1;

    this.UpdateWindowIndex(index);
  }

    this.OnDoubleClick = function (x, y, e) 
    {
        var tooltip = new TooltipData();
        for (var i in this.ChartPaint) 
        {
            var item = this.ChartPaint[i];
            if (item.GetTooltipData(x, y, tooltip)) 
                break;
        }

        if (!tooltip.Data) return;
        e.data = { Chart: this, Tooltip: tooltip };
    }

    this.CancelAutoUpdate=function()    //关闭停止更新
    {
        if (typeof (this.AutoUpdateTimer) == 'number') 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = undefined;
        }
    }

    //数据自动更新
    this.AutoUpdate = function (waitTime)  //waitTime 更新时间
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;

        var self = this;
        var marketStatus = MARKET_SUFFIX_NAME.GetMarketStatus(this.Symbol);
        if (marketStatus == 0 || marketStatus == 3) return; //闭市,盘后
       
        var frequency = this.AutoUpdateFrequency;   
        if (marketStatus == 1) //盘前
        {
            this.AutoUpdateTimer=setTimeout(function () { self.AutoUpdate(); }, frequency);
        }
        else if (marketStatus == 2) //盘中
        {
            this.AutoUpdateTimer=setTimeout(function () 
            {
                if (ChartData.IsDayPeriod(self.Period, true)) 
                {
                    self.RequestRealtimeData();               //更新最新行情
                    //self.ReqeustKLineInfoData();
                }
                else if (ChartData.IsMinutePeriod(self.Period, true) || ChartData.IsSecondPeriod(self.Period)) 
                {
                    self.RequestMinuteRealtimeData();         //请求分钟数据
                }
            }, frequency);
        }
    }

    this.GetMaxPageSize = function () 
    {
        let width = this.Frame.ChartBorder.GetWidth();
        let barWidth = (ZOOM_SEED[ZOOM_SEED.length - 1][0] + ZOOM_SEED[ZOOM_SEED.length - 1][1]);
        let pageSize = parseInt(width / barWidth) - 8;
        console.log(`[KLineChartContainer::GetMaxPageSize] width=${width} barWidth=${barWidth} pageSize=${pageSize}`);
        return pageSize
    }

    //数据拖拽下载
    this.DragDownloadData = function () 
    {
        var data = null;
        if (!this.Frame.Data) data = this.Frame.Data;
        else data = this.Frame.SubFrame[0].Frame.Data;
        if (!data) return false;
        if (data.DataOffset > 0) return;

        if (ChartData.IsMinutePeriod(this.Period, true)) //下载分钟数据
        {
            console.log(`[KLineChartContainer.DragDownloadData] Minute:[Enable=${this.DragDownload.Minute.Enable}, IsEnd=${this.DragDownload.Minute.IsEnd}, Status=${this.DragDownload.Minute.Status}]`);
            if (!this.DragDownload.Minute.Enable) return;
            if (this.DragDownload.Minute.IsEnd) return; //全部下载完了
            if (this.DragDownload.Minute.Status != 0) return;
            this.RequestDragMinuteData();
        }
        else if (ChartData.IsDayPeriod(this.Period, true)) // 下载日线
        {
            console.log(`[KLineChartContainer.DragDownloadData] Day:[Enable=${this.DragDownload.Minute.Enable}, IsEnd=${this.DragDownload.Minute.IsEnd}, Status=${this.DragDownload.Minute.Status}]`);
            if (!this.DragDownload.Day.Enable) return;
            if (this.DragDownload.Day.IsEnd) return; //全部下载完了
            if (this.DragDownload.Day.Status != 0) return;
            this.RequestDragDayData();
        }
    }

    this.RequestDragMinuteData = function () 
    {
        var self = this;
        this.AutoUpdateEvent(false, 'KLineChartContainer::RequestDragMinuteData');   //停止自动更新
        this.CancelAutoUpdate();
        var download = this.DragDownload.Minute;
        download.Status = 1;
        var firstItem = this.SourceData.Data[0];   //最新的一条数据
        var postData =
        {
            "field": ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"],
            "symbol": self.Symbol,
            "enddate": firstItem.Date,
            "endtime": firstItem.Time,
            "count": self.MaxRequestMinuteDayCount,
            "first": { date: firstItem.Date, time: firstItem.Time }
        };

        if (this.NetworkFilter) {
            var obj =
            {
                Name: 'KLineChartContainer::RequestDragMinuteData', //类名::函数
                Explain: '拖拽1分钟K线数据下载',
                Request: { Url: this.DragMinuteKLineApiUrl, Type: 'POST', Data: postData },
                DragDownload: download,
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvDragMinuteData(data);
                download.Status = 0;
                self.AutoUpdateEvent(true, 'KLineChartContainer::RequestDragMinuteData');   //自动更新
                self.AutoUpdate();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.DragMinuteKLineApiUrl,
            data: postData,
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvDragMinuteData(data);
                download.Status = 0;
                self.AutoUpdateEvent(true, 'KLineChartContainer::RequestDragMinuteData');   //自动更新
                self.AutoUpdate();
            }
        });
    }

    this.RecvDragMinuteData = function (recvdata) 
    {
        var data=recvdata.data;
        var aryDayData = KLineChartContainer.JsonDataToMinuteHistoryData(data);
        var lastDataCount = this.GetHistoryDataCount();   //保存下上一次的数据个数

        for (var i in aryDayData)    //数据往前插
        {
            var item = aryDayData[i];
            this.SourceData.Data.splice(i, 0, item);
        }

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (!this.IsApiPeriod)
        {
            if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据 (0= 日线,4=1分钟线 不需要处理)
            {
                var periodData = bindData.GetPeriodData(bindData.Period);
                bindData.Data = periodData;
            }
        }
        
        //绑定数据
        this.UpdateMainData(bindData, lastDataCount);
        this.BindInstructionIndexData(bindData);    //执行指示脚本

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            this.BindIndexData(i, bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    this.RequestDragDayData = function () 
    {
        var self = this;
        this.AutoUpdateEvent(false, 'KLineChartContainer::RequestDragDayData');   //停止自动更新
        this.CancelAutoUpdate();
        var download = this.DragDownload.Day;
        download.Status = 1;
        var firstItem = this.SourceData.Data[0];   //最新的一条数据
        var postData =
        {
            "field": ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"],
            "symbol": self.Symbol,
            "enddate": firstItem.Date,
            "count": self.MaxReqeustDataCount,
            "first": { date: firstItem.Date }
        };

        if (this.NetworkFilter) {
            var obj =
            {
                Name: 'KLineChartContainer::RequestDragDayData', //类名::函数
                Explain: '拖拽日K数据下载',
                Request: { Url: this.DragKLineApiUrl, Type: 'POST', Data: postData },
                DragDownload: download,
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.RecvDragDayData(data);
                download.Status = 0;
                self.AutoUpdateEvent(true, 'KLineChartContainer::RequestDragDayData');   //自动更新
                self.AutoUpdate();
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.DragKLineApiUrl,
            data: postData,
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvDragDayData(data);
                download.Status = 0;
                self.AutoUpdateEvent(true, 'KLineChartContainer::RequestDragDayData');   //自动更新
                self.AutoUpdate();
            }
        });
    }

    this.RecvDragDayData = function (recvdata) 
    {
        var data = recvdata.data;
        var aryDayData = KLineChartContainer.JsonDataToHistoryData(data);
        var lastDataCount = this.GetHistoryDataCount();   //保存下上一次的数据个数

        for (var i in aryDayData)    //数据往前插
        {
            var item = aryDayData[i];
            this.SourceData.Data.splice(i, 0, item);
        }

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (!this.IsApiPeriod)
        {
            if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据 (0= 日线,4=1分钟线 不需要处理)
            {
                var periodData = bindData.GetPeriodData(bindData.Period);
                bindData.Data = periodData;
            }
        }

        //绑定数据
        this.UpdateMainData(bindData, lastDataCount);
        this.BindInstructionIndexData(bindData);    //执行指示脚本

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            this.BindIndexData(i, bindData);
        }

        //刷新画图
        this.UpdataDataoffset();           //更新数据偏移
        this.UpdatePointByCursorIndex();   //更新十字光标位子
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

    this.SetCustomVerical = function (windowId, data) 
    {
        if (!this.Frame) return;
        if (windowId >= this.Frame.SubFrame.length) return;

        var item = this.Frame.SubFrame[windowId];
        if (item.Frame) item.Frame.CustomVerticalInfo = data;
    }
}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToHistoryData = function (data) 
{
    var list = data.data;
    var aryDayData = new Array();
    if (!list) return aryDayData;

    var upperSymbol = null;
    if (data.symbol) upperSymbol = data.symbol.toUpperCase();
    var isFutures = false;    //是否是期货
    isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol);

    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, position = 8;
    for (var i = 0; i < list.length; ++i) 
    {
        var item = new HistoryData();
        var jsData = list[i];
        item.Date = jsData[date];
        item.Open = jsData[open];
        item.YClose = jsData[yclose];
        item.Close = jsData[close];
        item.High = jsData[high];
        item.Low = jsData[low];
        item.Vol = jsData[vol];    //原始单位股
        item.Amount = jsData[amount];
        if (IFrameSplitOperator.IsNumber(jsData[position])) item.Position = jsData[position];//期货持仓

        if (isNaN(item.Open) || item.Open <= 0) continue; //停牌的数据剔除

        aryDayData.push(item);
    }

    return aryDayData;
}

KLineChartContainer.JsonDataToRealtimeData = function (data) 
{
    var symbol = data.stock[0].symbol;
    var upperSymbol = symbol.toUpperCase();
    var isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);

    var item = new HistoryData();
    item.Date = data.stock[0].date;
    item.Open = data.stock[0].open;
    item.YClose = data.stock[0].yclose;
    item.High = data.stock[0].high;
    item.Low = data.stock[0].low;
    if (isSHSZ) item.Vol = data.stock[0].vol / 100; //原始单位股
    else data.stock[0].vol;
    item.Amount = data.stock[0].amount;
    item.Close = data.stock[0].price;
    if (IFrameSplitOperator.IsNumber(data.stock[0].position)) item.Position = data.stock[0].position; //持仓量
    return item;
}

KLineChartContainer.JsonDataToMinuteRealtimeData = function (data) 
{
    var symbol = data.stock[0].symbol;
    var upperSymbol = symbol.toUpperCase();
    var isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);
    var isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol);
    var aryMinuteData = new Array();
    var preClose = data.stock[0].yclose;      //前一个数据价格
    var date = data.stock[0].date;
    if (isFutures && data.stock[0].yclearing) preClose = data.stock[0].yclearing;  //期货使用昨结算价

    for (var i in data.stock[0].minute) 
    {
        var jsData = data.stock[0].minute[i];
        var item = new HistoryData();

        item.Close = jsData.price;
        item.Open = jsData.open;
        item.High = jsData.high;
        item.Low = jsData.low;
        if (isSHSZ) item.Vol = jsData.vol / 100; //沪深股票原始单位股
        else item.Vol = jsData.vol;
        item.Amount = jsData.amount;
        if (jsData.date > 0) item.Date = jsData.date;
        else item.Date = date;
        item.Time = jsData.time;
        item.YClose = preClose;
        if (IFrameSplitOperator.IsNumber(jsData.position)) item.Position = jsData.position; //持仓量

        if (!item.Close) //当前没有价格 使用上一个价格填充
        {
            item.Close = preClose;
            item.Open = item.High = item.Low = item.Close;
        }

        //价格是0的 都用空
        if (item.Open <= 0) item.Open = null;
        if (item.Close <= 0) item.Close = null;
        if (item.High <= 0) item.High = null;
        if (item.Low <= 0) item.Low = null;

        //上次价格
        if (jsData.price > 0) preClose = jsData.price;

        aryMinuteData[i] = item;
    }

    return aryMinuteData;
}

//API 返回数据 转化为array[]
KLineChartContainer.JsonDataToMinuteHistoryData = function (data) 
{
    var upperSymbol = null;
    if (data.symbol) upperSymbol = data.symbol.toUpperCase();
    var isSHSZ = false;
    if (upperSymbol) isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);
    var isFutures = false;    //是否是期货
    if (upperSymbol) isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol);

    var list = data.data;
    var aryDayData = new Array();
    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, time = 8, position = 9;;
    for (var i = 0; i < list.length; ++i) 
    {
        var item = new HistoryData();
        item.Date = list[i][date];
        item.Open = list[i][open];
        item.YClose = list[i][yclose];
        item.Close = list[i][close];
        item.High = list[i][high];
        item.Low = list[i][low];
        if (isSHSZ) item.Vol = list[i][vol] / 100;    //原始单位股
        else item.Vol = list[i][vol];    //原始单位股
        item.Amount = list[i][amount];
        item.Time = list[i][time];
        if (IFrameSplitOperator.IsNumber(list[i][position])) item.Position = list[i][position]; //期货持仓

        aryDayData.push(item);
    }

    // 无效数据处理
    for (var i = 0; i < aryDayData.length; ++i) 
    {
        var minData = aryDayData[i];
        if (minData == null) coninue;
        if (isNaN(minData.Open) || minData.Open <= 0 || isNaN(minData.High) || minData.High <= 0 || isNaN(minData.Low) || minData.Low <= 0
        || isNaN(minData.Close) || minData.Close <= 0 ) 
        {
            if (i == 0) 
            {
                if (minData.YClose > 0) 
                {
                    minData.Open = minData.YClose;
                    minData.High = minData.YClose;
                    minData.Low = minData.YClose;
                    minData.Close = minData.YClose;
                }
            }
            else // 用前一个有效数据填充
            {
                for (var j = i - 1; j >= 0; --j) 
                {
                    var minData2 = aryDayData[j];
                    if (minData2 == null) coninue;
                    if (minData2.Open > 0 && minData2.High > 0 && minData2.Low > 0 && minData2.Close > 0) 
                    {
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
    this.newMethod = JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'MinuteChartContainer';
    this.WindowIndex = new Array();
    this.Symbol;
    this.Name;
    this.SourceData;                          //原始的历史数据
    this.OverlaySourceData;                   //叠加的原始数据
    this.IsAutoUpdate = false;                    //是否自动更新行情数据
    this.AutoUpdateFrequency = 30000;             //30秒更新一次数据
    this.AutoUpdateTimer;                         //更新定时器
    this.TradeDate = 0;                           //行情交易日期
    this.SplashTitle = '下载分钟数据';
    this.UpdateUICallback;                    //数据到达回调

    this.DayCount = 1;                       //显示几天的数据
    this.DayData;                            //多日分钟数据

    this.MinuteApiUrl = g_JSChartResource.Domain + "/API/Stock";
    this.HistoryMinuteApiUrl = g_JSChartResource.Domain + "/API/StockMinuteData";   //历史分钟数据

  //手机拖拽
  this.ontouchstart = function (e) {
    this.IsOnTouch = true;
    var jsChart = this;
    if (jsChart.DragMode == 0) return;

    if (this.IsPhoneDragging(e)) {
      if (jsChart.TryClickLock) {
        var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
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

      var touches = this.GetToucheData(e, jsChart.IsForceLandscape);

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

  this.ontouchmove = function (e) {
    var jsChart = this;
    var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
    if (this.ChartCorssCursor.IsShow === true && this.IsPhoneDragging(e)) {
      var drag = jsChart.MouseDrag;
      if (drag == null) {
        var x = touches[0].clientX;
        var y = touches[0].clientY;
        jsChart.OnMouseMove(x, y, e);
      }
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
        this.ChartCorssCursor.StringFormatX = new HQMinuteTimeStringFormat();
        this.ChartCorssCursor.StringFormatY = new HQPriceStringFormat();
        this.ChartCorssCursor.StringFormatY.LanguageID = this.LanguageID;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.SplashTitle;

        //创建框架容器
        this.Frame = new HQTradeFrame();
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
            titlePaint.LanguageID = this.LanguageID;

            this.TitlePaint.push(titlePaint);
        }

        this.ChartCorssCursor.StringFormatX.Frame = this.Frame.SubFrame[0].Frame;
    }

    //创建子窗口
    this.CreateChildWindow = function (windowCount) 
    {
        for (var i = 0; i < windowCount; ++i) 
        {
            var border = new ChartBorder();
            border.UIElement = this.UIElement;

            var frame = new MinuteFrame();
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
                frame.YSplitOperator.LanguageID = this.LanguageID;
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
            if (i == 0) subFrame.Height = 20;
            else subFrame.Height = 10;

            this.Frame.SubFrame[i] = subFrame;
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

    this.CreateStockInfo = function () {
        this.ExtendChartPaint[0] = new StockInfoExtendChartPaint();
        this.ExtendChartPaint[0].Canvas = this.Canvas;
        this.ExtendChartPaint[0].ChartBorder = this.Frame.ChartBorder;
        this.ExtendChartPaint[0].ChartFrame = this.Frame;

        this.Frame.ChartBorder.Right = 300;
    }

    //创建主图K线画法
    this.CreateMainKLine = function () 
    {
        //分钟线
        var minuteLine = new ChartMinutePriceLine();
        minuteLine.Canvas = this.Canvas;
        minuteLine.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        minuteLine.ChartFrame = this.Frame.SubFrame[0].Frame;
        minuteLine.Name = "Minute-Line";
        minuteLine.Color = g_JSChartResource.Minute.PriceColor;
        minuteLine.AreaColor = g_JSChartResource.Minute.AreaPriceColor;
        this.ChartPaint[0] = minuteLine;

        //分钟线均线
        var averageLine = new ChartMinutePriceLine();
        averageLine.Canvas = this.Canvas;
        averageLine.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        averageLine.ChartFrame = this.Frame.SubFrame[0].Frame;
        averageLine.Name = "Minute-Average-Line";
        averageLine.Color = g_JSChartResource.Minute.AvPriceColor;
        averageLine.IsDrawArea = false;
        this.ChartPaint[1] = averageLine;

        //成交量柱子
        var chartVol = new ChartMinuteVolumBar();
        chartVol.Color = g_JSChartResource.Minute.VolBarColor;
        chartVol.Canvas = this.Canvas;
        chartVol.ChartBorder = this.Frame.SubFrame[1].Frame.ChartBorder;
        chartVol.ChartFrame = this.Frame.SubFrame[1].Frame;
        chartVol.Name = "Minute-Vol-Bar";
        this.ChartPaint[2] = chartVol;

        //持仓线
        var chartPosition=new ChartSubLine();
        chartPosition.Color = g_JSChartResource.Minute.PriceColor;
        chartPosition.Canvas = this.Canvas;
        chartPosition.ChartBorder = this.Frame.SubFrame[1].Frame.ChartBorder;
        chartPosition.ChartFrame = this.Frame.SubFrame[1].Frame;
        chartPosition.Name = "Minute-Position-Line";
        this.ChartPaint[3] = chartPosition;

        this.TitlePaint[0] = new DynamicMinuteTitlePainting();
        this.TitlePaint[0].Frame = this.Frame.SubFrame[0].Frame;
        this.TitlePaint[0].Canvas = this.Canvas;
        this.TitlePaint[0].LanguageID = this.LanguageID;

        //主图叠加画法
        var paint = new ChartOverlayMinutePriceLine();
        paint.Canvas = this.Canvas;
        paint.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        paint.ChartFrame = this.Frame.SubFrame[0].Frame;
        paint.Name = "Overlay-Minute";
        this.OverlayChartPaint[0] = paint;
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

    this.ChangeIndex = function (windowIndex, indexName, option) 
    {
        if (this.Frame.SubFrame.length < 3) return;

        //查找系统指标
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        let indexInfo = scriptData.Get(indexName);
        if (!indexInfo) return;
        if (windowIndex < 2) windowIndex = 2;
        if (windowIndex >= this.Frame.SubFrame.length) windowIndex = 2;

        let indexData =
        {
            Name: indexInfo.Name, Script: indexInfo.Script, Args: indexInfo.Args, ID: indexName,
            //扩展属性 可以是空
            KLineType: indexInfo.KLineType, YSpecificMaxMin: indexInfo.YSpecificMaxMin, YSplitScale: indexInfo.YSplitScale,
            FloatPrecision: indexInfo.FloatPrecision, Condition: indexInfo.Condition, StringFormat: indexInfo.StringFormat
        };

        if (option) 
        {
            if (option.FloatPrecision >= 0) indexData.FloatPrecision = option.FloatPrecision;
            if (option.StringFormat > 0) indexData.StringFormat = option.StringFormat;
            if (option.Args) indexData.Args = option.Args;
        }

        return this.ChangeScriptIndex(windowIndex, indexData);
    }

  //切换股票代码
  this.ChangeSymbol = function (symbol) {
    this.Symbol = symbol;
    this.ChartSplashPaint.IsEnableSplash = true;
    this.RequestData();
  }

  this.ChangeDayCount = function (count) {
    if (count < 0 || count > 10) return;
    this.DayCount = count;

    this.RequestData();
  }

    //叠加股票 只支持日线数据
    this.OverlaySymbol = function (symbol,option) 
    {
        var paint = this.OverlayChartPaint[0];
        if (!paint.MainData) return false;

        paint.Symbol = symbol;
        if (option)
        {
            if (option.Color) paint.Color=option.Color;
        }

        if (this.DayCount <= 1) this.RequestOverlayMinuteData();               //请求数据
        else this.RequestOverlayHistoryMinuteData();

        return true;
    }

  this.TryClickLock = function (x, y) {
    for (let i in this.Frame.SubFrame) {
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

    this.RequestData = function () 
    {
        if (this.DayCount <= 1) this.RequestMinuteData();
        else this.RequestHistoryMinuteData();              //请求数据
    }

    this.RecvMinuteDataEvent = function () 
    {
        if (!this.mapEvent.has(JSCHART_EVENT_ID.RECV_MINUTE_DATA)) return;

        var event = this.mapEvent.get(JSCHART_EVENT_ID.RECV_MINUTE_DATA);
        var data = { MinuteData: this.SourceData, Stock: { Symbol: this.Symbol, Name: this.Name } }
        event.Callback(event, data, this);
    }

    this.RequestHistoryMinuteData = function ()     //请求历史分钟数据
    {
        var self = this;
        this.ChartSplashPaint.IsEnableSplash = true;
        this.Draw();

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'MinuteChartContainer::RequestHistoryMinuteData', //类名::
                Explain: '多日分时数据',
                Request: { Url: self.HistoryMinuteApiUrl, Data: { daycount: self.DayCount, symbol: self.Symbol }, Type: 'POST' },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvHistoryMinuteData(data);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
        url: self.HistoryMinuteApiUrl,
        data:
        {
            "symbol": self.Symbol,
            "daycount": self.DayCount
        },
        method: "post",
        dataType: "json",
        success: function (data) {
            self.ChartSplashPaint.IsEnableSplash = false;
            self.RecvHistoryMinuteData(data);
        }
        });
    }

    this.RecvHistoryMinuteData = function (recvdata) 
    {
        var data = recvdata.data;
        if (data.code!=0) 
        {
            console.log('[MinuteChartContainer::RecvHistoryMinuteData] failed.',data);
            return;
        }
        this.DayData = MinuteChartContainer.JsonDataToMinuteDataArray(data);;
        this.Symbol = data.symbol;
        this.Name = data.name;

        this.UpdateHistoryMinuteUI();
        this.RecvMinuteDataEvent();
        this.RequestOverlayHistoryMinuteData();

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistoryMinuteData', this);

        this.AutoUpdate();
    }

    this.UpdateHistoryMinuteUI = function () 
    {
        var allMinuteData = this.HistoryMinuteDataToArray(this.DayData);

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = allMinuteData;

        this.SourceData = sourceData;
        this.TradeDate = this.DayData[0].Date;

        this.BindMainData(sourceData, this.DayData[0].YClose);
        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.Symbol)) this.ChartPaint[1].Data = null;   //期货均线暂时不用

        if (this.Frame.SubFrame.length > 2) 
        {
            var bindData = new ChartData();
            bindData.Data = allMinuteData;
            for (var i = 2; i < this.Frame.SubFrame.length; ++i) 
            {
                this.BindIndexData(i, bindData);
            }
        }

        for (let i in this.Frame.SubFrame) 
        {
            var item = this.Frame.SubFrame[i];
            item.Frame.XSplitOperator.Symbol = this.Symbol;
            item.Frame.XSplitOperator.DayCount = this.DayData.length;
            item.Frame.XSplitOperator.DayData = this.DayData;
            item.Frame.XSplitOperator.Operator();   //调整X轴个数
            item.Frame.YSplitOperator.Symbol = this.Symbol;
        }

        this.ChartCorssCursor.StringFormatY.Symbol = this.Symbol;
        this.ChartCorssCursor.StringFormatX.Symbol = this.Symbol;
        this.TitlePaint[0].IsShowDate = true;
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();
    }

  this.HistoryMinuteDataToArray = function (data) //把多日分钟数据转化为单数组
  {
    var result = [];
    for (var i = data.length - 1; i >= 0; --i) {
      var item = data[i];
      for (var j in item.Data) {
        result.push(item.Data[j]);
      }
    }
    return result;
  }

  this.UpdateLatestMinuteData = function (data, date)     //更新最新交易日的分钟数据
  {
    for (var i in this.DayData) {
      var item = this.DayData[i];
      if (item.Date === date) {
        item.Data = data;
        break;
      }
    }
  }

    //请求分钟数据
    this.RequestMinuteData = function () 
    {
        var self = this;

        var fields =
        [
            "name", "symbol",
            "yclose", "open", "price", "high", "low",
            "vol", "amount",
            "date", "time",
            "minute", "minutecount"
        ];

        var upperSymbol = this.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol)) //期货的需要加上结算价
        {
            fields.push("clearing");
            fields.push("yclearing");
        }

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'MinuteChartContainer::RequestMinuteData', //类名::函数名
                Explain: '最新分时数据',
                Request: { Url: self.MinuteApiUrl, Data: { field: fields, symbol: [self.Symbol] }, Type: 'POST' },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) 
            {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteData(data);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: this.MinuteApiUrl,
            data:
            {
                "field": fields,
                "symbol": [this.Symbol],
                "start": -1
            },
            method: "post",
            dataType: "json",
            success: function (data) {
                self.ChartSplashPaint.IsEnableSplash = false;
                self.RecvMinuteData(data);
            }
        });
    }

    this.RecvMinuteData = function (data) 
    {
        var aryMinuteData = MinuteChartContainer.JsonDataToMinuteData(data.data);

        if (this.DayCount > 1)    //多日走势图
        {
            this.UpdateLatestMinuteData(aryMinuteData, data.data.stock[0].date);
            this.UpdateHistoryMinuteUI();
            this.RecvMinuteDataEvent();
            this.RequestOverlayMinuteData();    //更新最新叠加数据
            if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvMinuteData', this);
            this.AutoUpdate();
            return;
        }

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = aryMinuteData;

        this.TradeDate = data.data.stock[0].date;

        this.SourceData = sourceData;
        this.Symbol = data.data.stock[0].symbol;
        this.Name = data.data.stock[0].name;
        var yClose = data.data.stock[0].yclose;
        var upperSymbol = this.Symbol.toUpperCase();
        var isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) || MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol);
        if (data.data.stock[0].yclearing && isFutures) yClose = data.data.stock[0].yclearing; //期货使用前结算价
        var extendData = { High: data.data.stock[0].high, Low: data.data.stock[0].low };
        this.BindMainData(sourceData, yClose, extendData);

        if (this.Frame.SubFrame.length > 2) 
        {
            var bindData = new ChartData();
            bindData.Data = aryMinuteData;
            for (var i = 2; i < this.Frame.SubFrame.length; ++i) 
            {
                this.BindIndexData(i, bindData);
            }
        }

        for (let i in this.Frame.SubFrame)  //把股票代码设置到X轴刻度类里
        {
            var item = this.Frame.SubFrame[i];
            item.Frame.XSplitOperator.Symbol = this.Symbol;
            item.Frame.XSplitOperator.DayCount = 1;
            item.Frame.XSplitOperator.Operator();   //调整X轴个数
            item.Frame.YSplitOperator.Symbol = this.Symbol;
        }

        this.ChartCorssCursor.StringFormatY.Symbol = this.Symbol;
        this.ChartCorssCursor.StringFormatX.Symbol = this.Symbol;

        var chartInfo = this.GetChartMinuteInfo();
        if (chartInfo) chartInfo.SourceData = this.SourceData;    //数据绑定到信息地雷上
        this.RecvMinuteDataEvent();
        this.RequestMinuteInfoData();
        this.RequestOverlayMinuteData();//请求叠加数据 (主数据下载完再下载)

        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Frame.SetSizeChage(true);
        this.Draw();

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvMinuteData', this);

        this.AutoUpdate();
    }

    //请求叠加数据 (主数据下载完再下载))
    this.RequestOverlayMinuteData = function () 
    {
        if (!this.OverlayChartPaint.length) return;

        var symbol = this.OverlayChartPaint[0].Symbol;
        if (!symbol) return;

        var self = this;
        var date = this.TradeDate;    //最后一个交易日期

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'MinuteChartContainer::RequestOverlayMinuteData', //类名::函数名
                Explain: '叠加股票最新分时数据',
                Request: { Url: self.HistoryMinuteApiUrl, Data: { days: [date], symbol: symbol }, Type: 'POST' },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) 
            {
                self.RecvOverlayMinuteData(data);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }


        //请求数据
        wx.request({
            url: self.HistoryMinuteApiUrl,
            data:
            {
                "symbol": symbol,
                "days": [date],
            },
            method: "post",
            dataType: "json",
            success: function (data) {
                self.RecvOverlayMinuteData(data);
            }
        });
    }

  this.RecvOverlayMinuteData = function (recvData) {
    var data = recvData.data;
    var aryMinuteData = MinuteChartContainer.JsonDataToMinuteDataArray(data);

    var sourceData = null;
    var yClose;
    if (this.DayCount > 1)    //多日数据
    {
      if (aryMinuteData.length <= 0) return;

      var minuteData = aryMinuteData[0];
      for (var i in this.OverlaySourceData) {
        var item = this.OverlaySourceData[i];
        if (item.Date == minuteData.Date) {
          this.OverlaySourceData[i] = minuteData;
          var allMinuteData = this.HistoryMinuteDataToArray(this.OverlaySourceData);
          var sourceData = new ChartData();
          sourceData.Data = allMinuteData;
          yClose = minuteData.YClose;
          break;
        }
      }
      if (sourceData == null) return;
    }
    else {
      if (aryMinuteData.length > 0) sourceData = aryMinuteData[0];
      else sourceData = new ChartData();
      yClose = sourceData.YClose;
    }

    this.OverlayChartPaint[0].Data = sourceData;
    this.OverlayChartPaint[0].Title = data.name;
    this.OverlayChartPaint[0].Symbol = data.symbol;
    this.OverlayChartPaint[0].YClose = yClose;

    this.UpdateFrameMaxMin();          //调整坐标最大 最小值
    this.Frame.SetSizeChage(true);
    this.Draw();

    if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvOverlayMinuteData', this);
  }

    this.RequestOverlayHistoryMinuteData = function () 
    {
        if (!this.OverlayChartPaint.length) return;
        var symbol = this.OverlayChartPaint[0].Symbol;
        if (!symbol) return;

        var self = this;
        var days = [];
        for (var i in this.DayData) 
        {
            var item = this.DayData[i];
            days.push(item.Date);
        }

        if (days.length <= 0) return;

        if (this.NetworkFilter) 
        {
            var obj =
            {
                Name: 'MinuteChartContainer::RequestOverlayHistoryMinuteData', //类名::函数名
                Explain: '叠加股票多日分时数据',
                Request: { Url: self.HistoryMinuteApiUrl, Data: { days: days, symbol: symbol }, Type: 'POST' },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) 
            {
                self.RecvOverlayHistoryMinuteData(data);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: self.HistoryMinuteApiUrl,
            data:
            {
                "symbol": symbol,
                "days": days
            },
            method: "post",
            dataType: "json",
            async: true,
            success: function (data) {
                self.RecvOverlayHistoryMinuteData(data);
            }
        });
    }

  this.RecvOverlayHistoryMinuteData = function (recvData)    //叠加历史的分钟数据
  {
    var data = recvData.data;
    var dayData = MinuteChartContainer.JsonDataToMinuteDataArray(data);
    var overlayDayData = [];
    for (var i in this.DayData) {
      var item = this.DayData[i];
      var bFind = false;
      for (var j in dayData) {
        if (item.Date == dayData[j].Date) {
          overlayDayData.push(dayData[i]);
          bFind = true;
          break;
        }
      }
      if (!bFind) //当天不存在叠加数据, 存空
      {
        var empytData = new ChartData();
        empytData.Date = item.Date;
      }
    }

    this.OverlaySourceData = overlayDayData;
    var allMinuteData = this.HistoryMinuteDataToArray(overlayDayData);

    //原始数据
    var sourceData = new ChartData();
    sourceData.Data = allMinuteData;

    var yClose = overlayDayData[0].YClose;
    this.OverlayChartPaint[0].Data = sourceData;
    this.OverlayChartPaint[0].Title = data.name;
    this.OverlayChartPaint[0].Symbol = data.symbol;
    this.OverlayChartPaint[0].YClose = yClose;

    this.UpdateFrameMaxMin();          //调整坐标最大 最小值
    this.Frame.SetSizeChage(true);
    this.Draw();

    if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvOverlayHistoryMinuteData', this);
  }

    this.CancelAutoUpdate = function ()    //关闭停止更新
    {
        if (typeof (this.AutoUpdateTimer) == 'number') 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = undefined;
        }
    }

    //数据自动更新
    this.AutoUpdate = function () 
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;

        var self = this;
        var marketStatus = MARKET_SUFFIX_NAME.GetMarketStatus(this.Symbol);
        if (marketStatus == 0 || marketStatus == 3) return; //闭市,盘后

        var frequency = this.AutoUpdateFrequency;
        if (marketStatus == 1) //盘前
        {
            this.AutoUpdateTimer=setTimeout(function () { self.AutoUpdate(); }, frequency);
        }
        else if (marketStatus == 2)   //盘中
        {
            this.AutoUpdateTimer=setTimeout(function () 
            { 
                //self.ResetOverlaySymbolStatus(); 
                self.RequestMinuteData(); 
            }, frequency);
        }
    }

    this.StopAutoUpdate = function () 
    {
        this.CancelAutoUpdate();
        this.IsAutoUpdate = false;
    }

    this.BindIndexData = function (windowIndex, hisData) 
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

        this.WindowIndex[windowIndex].BindData(this, windowIndex, hisData);
    }

   
    this.BindMainData = function (minuteData, yClose, extendData)  //绑定分钟数据
    {
        //分钟数据
        var bindData = new ChartData();
        bindData.Data = minuteData.GetClose();
        this.ChartPaint[0].Data = bindData;
        this.ChartPaint[0].YClose = yClose;
        this.ChartPaint[0].NotSupportMessage = null;

        this.Frame.SubFrame[0].Frame.YSplitOperator.YClose = yClose;
        this.Frame.SubFrame[0].Frame.YSplitOperator.Data = bindData;

        //均线
        bindData = new ChartData();
        bindData.Data = minuteData.GetMinuteAvPrice();
        this.ChartPaint[1].Data = bindData;

        this.Frame.SubFrame[0].Frame.YSplitOperator.AverageData = bindData;
        this.Frame.SubFrame[0].Frame.YSplitOperator.OverlayChartPaint = this.OverlayChartPaint;
        if (extendData) 
        {
            this.Frame.SubFrame[0].Frame.YSplitOperator.High = extendData.High;
            this.Frame.SubFrame[0].Frame.YSplitOperator.Low = extendData.Low;
        }

        //成交量
        this.ChartPaint[2].Data = minuteData;
        this.ChartPaint[2].YClose = yClose;

        var upperSymbol=this.Symbol.toUpperCase();
        var bFutures=MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol);
        var bSHO = MARKET_SUFFIX_NAME.IsSHO(upperSymbol);

        if (bFutures || bSHO)
        {
            this.ChartPaint[3].Data.Data = minuteData.GetPosition();
        }
        else
        {
            this.ChartPaint[3].Data.Data=null;
        }
        
        this.TitlePaint[0].Data = this.SourceData;                    //动态标题
        this.TitlePaint[0].Symbol = this.Symbol;
        this.TitlePaint[0].Name = this.Name;
        this.TitlePaint[0].YClose = yClose;

        if (this.ExtendChartPaint[0]) 
        {
            this.ExtendChartPaint[0].Symbol = this.Symbol;
            this.ExtendChartPaint[0].Name = this.Name;
        }

        this.OverlayChartPaint[0].MainData = this.ChartPaint[0].Data;         //叠加
        this.OverlayChartPaint[0].MainYClose = yClose;
    }

    //获取子窗口的所有画法
    this.GetChartPaint = function (windowIndex) 
    {
        var paint = new Array();
        for (var i in this.ChartPaint) 
        {
            if (i < 3) continue; //分钟 均线 成交量 3个线不能改
            var item = this.ChartPaint[i];
            if (item.ChartFrame == this.Frame.SubFrame[windowIndex].Frame)
                paint.push(item);
        }

        return paint;
    }

    //创建指定窗口指标
    this.CreateWindowIndex = function (windowIndex) 
    {
        this.WindowIndex[windowIndex].Create(this, windowIndex);
    }

    this.CreateExtendChart = function (name, option)   //创建扩展图形
    {
        var chart;
        switch (name) 
        {
            case 'MinuteTooltip':
                chart = new MinuteTooltipPaint();
                chart.Canvas = this.Canvas;
                chart.ChartBorder = this.Frame.ChartBorder;
                chart.ChartFrame = this.Frame;
                chart.HQChart = this;
                option.LanguageID = this.LanguageID;
                chart.SetOption(option);
                this.ExtendChartPaint.push(chart);
                return chart;
            default:
                return null;
        }
    }

    this.SetMinuteInfo = function (aryInfo, bUpdate) 
    {
        this.ChartInfo = [];  //先清空
        for (var i in aryInfo) 
        {
            var infoItem = JSMinuteInfoMap.Get(aryInfo[i]);
            if (!infoItem) continue;
            var item = infoItem.Create();
            this.ChartInfo.push(item);
        }

        if (bUpdate == true) this.RequestMinuteInfoData();
    }

    this.GetChartMinuteInfo = function () 
    {
        return this.ChartInfoPaint;
    }

    this.CreateMinuteInfo = function (option)  //在Create()以后 在调用
    {
        var chart = new ChartMinuteInfo();
        chart.Canvas = this.Canvas;
        chart.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        chart.ChartFrame = this.Frame.SubFrame[0].Frame;
        chart.ChartMinutePrice = this.ChartPaint[0];
        if (option && chart.SetOption) chart.SetOption(option);
        this.ChartInfoPaint = chart;
        return chart;
    }

    //信息地雷数据请求
    this.RequestMinuteInfoData = function () 
    {
        if (this.ChartInfo.length <= 0) return;

        var chart = this.GetChartMinuteInfo();
        if (!chart) chart = this.CreateMinuteInfo(null);  //不存在就创建 

        chart.SourceData = this.SourceData;

        //信息地雷信息
        for (var i in this.ChartInfo) {
            this.ChartInfo[i].RequestData(this);
        }
    }

    //更新信息地雷
    this.UpdataChartInfo = function () 
    {
        var chart = this.GetChartMinuteInfo();
        if (!chart) return;

        var infoMap = new Map();
        for (var i in this.ChartInfo) 
        {
            var infoData = this.ChartInfo[i].Data;
            for (var j in infoData) 
            {
                var item = infoData[j];
                var dateTime = `${item.Date} ${item.Time}`;
                if (infoMap.has(dateTime)) infoMap.get(dateTime).Data.push(item);
                else infoMap.set(dateTime, { Data: new Array(item) });
            }
        }

        chart.Data = infoMap;
    }
}

//API 返回数据 转化为array[]
MinuteChartContainer.JsonDataToMinuteData = function (data) 
{
    var upperSymbol = data.stock[0].symbol.toUpperCase();
    var isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);
    var isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) || MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol);
    var isSHO = MARKET_SUFFIX_NAME.IsSHO(upperSymbol);    //上海股票期权

    var preClose = data.stock[0].yclose;      //前一个数据价格
    var preAvPrice = data.stock[0].yclose;    //前一个均价
    var yClose = data.stock[0].yclose;
    if (isFutures && data.stock[0].yclearing) yClose = preClose = preAvPrice = data.stock[0].yclearing;  //期货使用昨结算价

    var date = data.stock[0].date;
    var aryMinuteData = new Array();
    for (var i in data.stock[0].minute) 
    {
        var jsData = data.stock[0].minute[i];
        var item = new MinuteData();

        if (jsData.price) preClose = jsData.price;
        if (jsData.avprice) preAvPrice = jsData.avprice;

        item.Close = jsData.price;
        item.Open = jsData.open;
        item.High = jsData.high;
        item.Low = jsData.low;
        if (isSHSZ) item.Vol = jsData.vol / 100; //原始单位股
        else item.Vol = jsData.vol;
        item.Amount = jsData.amount;
        item.Increase = jsData.increase;
        item.Risefall = jsData.risefall;
        item.AvPrice = jsData.avprice;

        if (!item.Close) //当前没有价格 使用上一个价格填充
        {
            item.Close = preClose;
            item.Open = item.High = item.Low = item.Close;
        }
        if (!item.AvPrice) item.AvPrice = preAvPrice;

        if (jsData.date > 0) date = jsData.date;    //分钟数据中有日期 优先使用
        item.DateTime = date.toString() + " " + jsData.time.toString();
        item.Date = data.stock[0].date;
        item.Time = jsData.time;
        if (isFutures || isSHO) item.Position = jsData.position;  //期货 期权有持仓

        if (i == 0)      //第1个数据 写死9：25
        {
            item.IsFristData = true;
            //if (isSHSZ) item.DateTime = data.stock[0].date.toString() + " 0925";
            if (item.Close <= 0) //第1分钟 没数据就用开盘价
            {
                item.Close = data.stock[0].open;
                item.High = item.Low = data.stock[0].open;
                item.AvPrice = data.stock[0].open;
                console.log('[MinuteChartContainer::JsonDataToMinuteData] first minute data is empty.', data.stock[0].symbol, jsData);
            }
        }

        //价格是0的 都用空
        if (item.Open <= 0) item.Open = null;
        if (item.Close <= 0) item.Close = null;
        if (item.AvPrice <= 0) item.AvPrice = null;
        if (item.High <= 0) item.High = null;
        if (item.Low <= 0) item.Low = null;

        if (yClose && item.Close) item.Increase = (item.Close - yClose) / yClose * 100; //涨幅 (最新价格-昨收)/昨收*10

        aryMinuteData[i] = item;
    }

    return aryMinuteData;
}

//多日日线数据API 转化成array[];
MinuteChartContainer.JsonDataToMinuteDataArray = function (data) 
{
    var upperSymbol = data.symbol.toUpperCase();
    var isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);
    var isFutures = MARKET_SUFFIX_NAME.IsChinaFutures(upperSymbol) || MARKET_SUFFIX_NAME.IsNYMEX(upperSymbol);
    var isSHO = MARKET_SUFFIX_NAME.IsSHO(upperSymbol);    //上海股票期权
    var result = [];
    for (var i in data.data) 
    {
        var minuteData = [];
        var dayData = data.data[i];
        var date = dayData.date;
        var yClose = dayData.yclose;        //前收盘 计算涨幅
        var preClose = yClose;              //前一个数据价格
        var preAvPrice=null;                //前一个均价
        for (var j in dayData.minute) 
        {
            var jsData = dayData.minute[j];
            if (jsData[2]) preClose = jsData[2];  //保存上一个收盘数据
            var item = new MinuteData();
            item.Close = jsData[2];
            item.Open = jsData[1];
            item.High = jsData[3];
            item.Low = jsData[4];
            item.Vol = jsData[5] / 100; //原始单位股
            item.Amount = jsData[6];

            if (7 < jsData.length && jsData[7] > 0) 
            {
                item.AvPrice = jsData[7];    //均价
                preAvPrice = jsData[7];
            }

            if (!item.Close)    //当前没有价格 使用上一个价格填充
            {
                item.Close = preClose;
                item.Open = item.High = item.Low = item.Close;
            }

            if (!item.AvPrice && preAvPrice) item.AvPrice = preAvPrice;

            if (item.Close && yClose) item.Increase = (item.Close - yClose) / yClose * 100;
            else item.Increase = null;

            item.DateTime = date.toString() + " " + jsData[0].toString();
            item.Date = date;
            item.Time = jsData[0];
            if ((isFutures || isSHO) && 9 < jsData.length) item.Position = jsData[9];  //持仓

            if (j == 0 )      
            {
                //if (isSHSZ) item.DateTime = date.toString() + " 0925";//第1个数据 写死9：25
                item.IsFristData = true;
            }

            //价格是0的 都用空
            if (item.Open <= 0) item.Open = null;
            if (item.Close <= 0) item.Close = null;
            if (item.AvPrice <= 0) item.AvPrice = null;
            if (item.High <= 0) item.High = null;
            if (item.Low <= 0) item.Low = null;
            if (item.AvPrice <= 0) item.AvPrice = null;

            minuteData[j] = item;
        }

        var newData = new ChartData();
        newData.Data = minuteData;
        newData.YClose = yClose;
        newData.Close = dayData.close;
        newData.Date = date;

        result.push(newData);
    }

    return result;
}

/*
    历史分钟走势图
*/
function HistoryMinuteChartContainer(uielement) {
  this.newMethod = MinuteChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.HistoryMinuteApiUrl = "https://opensourcecache.zealink.com/cache/minuteday/day/";


  //创建主图K线画法
  this.CreateMainKLine = function () {
    //分钟线
    var minuteLine = new ChartMinutePriceLine();
    minuteLine.Canvas = this.Canvas;
    minuteLine.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
    minuteLine.ChartFrame = this.Frame.SubFrame[0].Frame;
    minuteLine.Name = "Minute-Line";
    minuteLine.Color = g_JSChartResource.Minute.PriceColor;

    this.ChartPaint[0] = minuteLine;

    //分钟线均线
    var averageLine = new ChartLine();
    averageLine.Canvas = this.Canvas;
    averageLine.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
    averageLine.ChartFrame = this.Frame.SubFrame[0].Frame;
    averageLine.Name = "Minute-Average-Line";
    averageLine.Color = g_JSChartResource.Minute.AvPriceColor;
    this.ChartPaint[1] = averageLine;

    var averageLine = new ChartMinuteVolumBar();
    averageLine.Color = g_JSChartResource.Minute.VolBarColor;
    averageLine.Canvas = this.Canvas;
    averageLine.ChartBorder = this.Frame.SubFrame[1].Frame.ChartBorder;
    averageLine.ChartFrame = this.Frame.SubFrame[1].Frame;
    averageLine.Name = "Minute-Vol-Bar";
    this.ChartPaint[2] = averageLine;


    this.TitlePaint[0] = new DynamicMinuteTitlePainting();
    this.TitlePaint[0].Frame = this.Frame.SubFrame[0].Frame;
    this.TitlePaint[0].Canvas = this.Canvas;
    this.TitlePaint[0].IsShowDate = true;

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

  //设置交易日期
  this.ChangeTradeDate = function (trdateDate) {
    if (!trdateDate) return;

    this.TradeDate = trdateDate;
    this.RequestData(); //更新数据
  }

  this.RequestData = function () {
    var date = new Date();
    var nowDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    if (nowDate == this.TradeDate) this.RequestMinuteData();
    else this.RequestHistoryMinuteData();
  }

  //请求分钟数据
  this.RequestHistoryMinuteData = function () {
    var self = this;
    var url = this.HistoryMinuteApiUrl + this.TradeDate.toString() + "/" + this.Symbol + ".json";

    wx.request({
      url: url,
      method: "get",
      dataType: "json",
      success: function (data) {
        self.ChartSplashPaint.IsEnableSplash = false;
        self.RecvHistoryMinuteData(data);
      },
      error: function (reqeust) {
        self.ChartSplashPaint.IsEnableSplash = false;
        self.RecvHistoryMinuteError(reqeust);
      }
    });
  }

  this.RecvHistoryMinuteError = function (reqeust) {
    if (reqeust.status != 404) return;

    var sourceData = new ChartData();
    this.SourceData = sourceData;

    for (var i in this.ChartPaint) {
      this.ChartPaint[i].Data = sourceData;
      if (i == 0) this.ChartPaint[i].NotSupportMessage = '没有权限访问!';
    }

    this.TitlePaint[0].Data = this.SourceData;                    //动态标题
    this.TitlePaint[0].Symbol = this.Symbol;
    this.TitlePaint[0].Name = null;

    this.Draw();
  }

  this.RecvHistoryMinuteData = function (recvData) {
    if (recvData.statusCode != 200) {
      var sourceData = new ChartData();
      this.SourceData = sourceData;

      for (var i in this.ChartPaint) {
        this.ChartPaint[i].Data = sourceData;
        if (i == 0) this.ChartPaint[i].NotSupportMessage = '没有权限访问!';
      }

      this.TitlePaint[0].Data = this.SourceData;                    //动态标题
      this.TitlePaint[0].Symbol = this.Symbol;
      this.TitlePaint[0].Name = null;

      this.Draw();
      return;
    }

    var data = recvData.data;
    var aryMinuteData = HistoryMinuteChartContainer.JsonDataToMinuteData(data);

    //原始数据
    var sourceData = new ChartData();
    sourceData.Data = aryMinuteData;

    this.TradeDate = data.date;

    this.SourceData = sourceData;
    this.Symbol = data.symbol;
    this.Name = data.name;

    this.BindMainData(sourceData, data.day.yclose);

    if (this.Frame.SubFrame.length > 2) {
      var bindData = new ChartData();
      bindData.Data = aryMinuteData;
      for (var i = 2; i < this.Frame.SubFrame.length; ++i) {
        this.BindIndexData(i, bindData);
      }
    }

    this.UpdateFrameMaxMin();          //调整坐标最大 最小值
    this.Frame.SetSizeChage(true);
    this.Draw();

    //this.AutoUpdata();
  }

}

//API 返回数据 转化为array[]
HistoryMinuteChartContainer.JsonDataToMinuteData = function (data) 
{
    var aryMinuteData = new Array();
    for (var i in data.minute.time) 
    {
        var item = new MinuteData();
        if (data.minute.price[i] <= 0 && i > 0) //当前这一分钟价格为空,使用上一分钟的数据
        {
            item.Close = aryMinuteData[i - 1].Close;
            item.Open = aryMinuteData[i - 1].Close;
            item.High = item.Close;
            item.Low = item.Close;
            item.Vol = data.minute.vol[i] / 100; //原始单位股
            item.Amount = data.minute.amount[i];
            item.DateTime = data.date.toString() + " " + data.minute.time[i].toString();
            item.Date = data.date;
            item.Time = data.minute.time[i];
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice = aryMinuteData[i - 1].AvPrice;
        }
        else 
        {
            item.Close = data.minute.price[i];
            item.Open = data.minute.open[i];
            item.High = data.minute.high[i];
            item.Low = data.minute.low[i];
            item.Vol = data.minute.vol[i] / 100; //原始单位股
            item.Amount = data.minute.amount[i];
            item.DateTime = data.date.toString() + " " + data.minute.time[i].toString();
            item.Date = data.date;
            item.Time = data.minute.time[i];
            //item.Increate=jsData.increate;
            //item.Risefall=jsData.risefall;
            item.AvPrice = data.minute.avprice[i];
        }

        //价格是0的 都用空
        if (item.Open <= 0) item.Open = null;
        if (item.Close <= 0) item.Close = null;
        if (item.AvPrice <= 0) item.AvPrice = null;
        if (item.High <= 0) item.High = null;
        if (item.Low <= 0) item.Low = null;

        aryMinuteData[i] = item;
    }

    return aryMinuteData;
}

/////////////////////////////////////////////////////////////////////////////
//  自定义指数
//
function CustomKLineChartContainer(uielement) {
  this.newMethod = KLineChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.ClassName = 'CustomKLineChartContainer';
  this.ChangeRight = null;  //没有复权设置
  this.SplashTitle = '计算指数数据';

  this.CustomKLineApiUrl = g_JSChartResource.Domain + "/API/IndexCalculate";  //自定义指数计算地址
  this.CustomStock;   //成分
  this.QueryDate = { Start: 20180101, End: 20180627 };     //计算时间区间

  this.RequestHistoryData = function () {
    var self = this;
    this.ChartSplashPaint.IsEnableSplash = true;
    this.Draw();
    wx.request({
      url: this.CustomKLineApiUrl,
      data:
      {
        "stock": self.CustomStock,
        "Name": self.Symbol,
        "date": { "startdate": self.QueryDate.Start, "enddate": self.QueryDate.End }
      },
      method: 'POST',
      dataType: "json",
      async: true,
      success: function (data) {
        self.ChartSplashPaint.IsEnableSplash = false;
        self.RecvHistoryData(data);
      }
    });
  }

    this.RecvHistoryData = function (recvData) 
    {
        var data = recvData.data;
        var aryDayData = KLineChartContainer.JsonDataToHistoryData(data);

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = aryDayData;
        sourceData.DataType = 0;      //0=日线数据 1=分钟数据
        sourceData.Symbol = data.symbol;

        //显示的数据
        var bindData = new ChartData();
        bindData.Data = aryDayData;
        bindData.Right = 0;   //指数没有复权
        bindData.Period = this.Period;
        bindData.DataType = 0;
        bindData.Symbol = data.symbol;

        if (ChartData.IsDayPeriod(this.Period, false))   //周期数据
        {
            var periodData = sourceData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        //绑定数据
        this.SourceData = sourceData;
        this.Name = data.name;
        this.BindMainData(bindData, this.PageSize);

        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            this.BindIndexData(i, bindData);
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

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistoryData', this);
    }

}

////////////////////////////////////////////////////////////////////////////////
//  K线横屏显示
//
function KLineChartHScreenContainer(uielement) {
  this.newMethod = KLineChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.ClassName = 'KLineChartHScreenContainer';

  this.OnMouseMove = function (x, y, e) {
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

        jsChart.IsOnTouch = true;
        jsChart.PhonePinch = null;

        if (this.IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock) {
                var touches = this.GetToucheData(e);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            if (this.TouchTimer != null) clearTimeout(this.TouchTimer);
            if (this.ChartCorssCursor.IsShow == true) 
            {
                this.TouchTimer = setTimeout(function () {
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


            var drag = { "Click": {}, "LastMove": {}, };//最后移动的位置
            var touches = this.GetToucheData(e);

            drag.Click.X = touches[0].clientX;
            drag.Click.Y = touches[0].clientY;
            drag.LastMove.X = touches[0].clientX;
            drag.LastMove.Y = touches[0].clientY;

            jsChart.MouseDrag = drag;
        }
        else if (this.IsPhonePinching(e)) 
        {
            var phonePinch = { "Start": {}, "Last": {}};
            var touches = this.GetToucheData(e);

            phonePinch.Start = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };
            phonePinch.Last = { "X": touches[0].pageX, "Y": touches[0].pageY, "X2": touches[1].pageX, "Y2": touches[1].pageY };

            jsChart.PhonePinch = phonePinch;
        }
    }


  this.ontouchmove = function (e) {
    var jsChart = this;

    var touches = this.GetToucheData(e);

    if (this.IsPhoneDragging(e)) {
      var drag = jsChart.MouseDrag;
      if (drag == null) {
        var x = touches[0].clientX;
        var y = touches[0].clientY;
        jsChart.OnMouseMove(x, y, e);
      }
      else {
        var moveSetp = Math.abs(drag.LastMove.Y - touches[0].clientY);
        moveSetp = parseInt(moveSetp);
        if (jsChart.DragMode == 1)  //数据左右拖拽
        {
          if (moveSetp < 5) return;

          var isLeft = true;
          if (drag.LastMove.Y < touches[0].clientY) isLeft = false;//右移数据

          if (jsChart.DataMove(moveSetp, isLeft)) {
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
    else if (this.IsPhonePinching(e)) {
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

    if (this.JSChartContainer.TryClickLock) {
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

    uielement.ondblclick = function (e) {
      var x = e.clientX - this.getBoundingClientRect().left;
      var y = e.clientY - this.getBoundingClientRect().top;

      if (this.JSChartContainer)
        this.JSChartContainer.OnDoubleClick(x, y, e);
    }

    document.onmousemove = function (e) {
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

        if (this.JSChartContainer.DataMove(moveSetp, isLeft)) {
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

    document.onmouseup = function (e) {
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
  this.Create = function (windowCount) {
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
    for (var i in this.Frame.SubFrame) {
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
            frame.RightSpaceCount = this.RightSpaceCount; //右边

            if (this.ModifyIndexDialog) frame.ModifyIndexEvent = this.ModifyIndexDialog.DoModal;        //绑定菜单事件
            if (this.ChangeIndexDialog) frame.ChangeIndexEvent = this.ChangeIndexDialog.DoModal;

            frame.HorizontalMax = 20;
            frame.HorizontalMin = 10;

            if (i == 0) 
            {
                frame.YSplitOperator = new FrameSplitKLinePriceY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
                //主图上下间距
                border.TopSpace = 12;
                border.BottomSpace = 12;
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
function MinuteChartHScreenContainer(uielement) {
  this.newMethod = MinuteChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.ClassName = 'MinuteChartHScreenContainer';

  this.OnMouseMove = function (x, y, e) {
    this.LastPoint.X = x;
    this.LastPoint.Y = y;
    this.CursorIndex = this.Frame.GetXData(y);

    this.DrawDynamicInfo();
  }

  //创建
  //windowCount 窗口个数
  this.Create = function (windowCount) {
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
    for (var i in this.Frame.SubFrame) {
      var titlePaint = new DynamicChartTitlePainting();
      titlePaint.Frame = this.Frame.SubFrame[i].Frame;
      titlePaint.Canvas = this.Canvas;

      this.TitlePaint.push(titlePaint);
    }

    this.ChartCorssCursor.StringFormatX.Frame = this.Frame.SubFrame[0].Frame;
  }

  //创建子窗口
  this.CreateChildWindow = function (windowCount) {
    for (var i = 0; i < windowCount; ++i) {
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

      if (i == 0) {
        frame.YSplitOperator = new FrameSplitMinutePriceY();
        frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
      }
      else {
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

      for (var j in DEFAULT_HORIZONTAL) {
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
//  K线训练,包含横屏 
//
function KLineTrainChartContainer(uielement, bHScreen) 
{
    if (bHScreen === true) 
    {
        this.newMethod = KLineChartHScreenContainer;   //派生
        this.newMethod(uielement);
        delete this.newMethod;
    }
    else 
    {
        this.newMethod = KLineChartContainer;   //派生
        this.newMethod(uielement);
        delete this.newMethod;
    }

    this.ClassName2 = 'KLineTrainChartContainer';
    this.BuySellPaint;          //买卖点画法
    this.TrainDataCount = 300;    //训练数据个数
    this.AutoRunTimer = null;     //K线自动前进定时器
    this.BuySellData = [];        //模拟买卖数据 {Buy:{Price:价格,Date:日期,Time:时间} , Sell:{Price:价格,Date:日期,Time:时间} 
    this.TrainDataIndex;        //当前训练的数据索引
    this.TrainCallback;         //训练回调 (K线每前进一次就调用一次)
    this.DragMode = 1;

    this.TrainStartEnd = {};
    this.KLineSourceData;       //原始K线数据 对应 SourceData
    this.TrainInfo = { Start: {}, End: {} }; // Index:数据索引, Date:日期  Time:时间

    this.CreateBuySellPaint = function ()  //在主窗口建立以后 创建买卖点
    {
        var chart = new ChartBuySell();
        chart.Canvas = this.Canvas;
        chart.ChartBorder = this.Frame.SubFrame[0].Frame.ChartBorder;
        chart.ChartFrame = this.Frame.SubFrame[0].Frame;
        chart.Name = "KLine-Train-BuySell";
        this.ChartPaintEx[0] = chart;
    }

    this.GetKDataIndexByDateTime = function (kData, dateTime) 
    {
        if (!dateTime || !kData) return -1;

        for (var i in kData) 
        {
            var item = kData[i];
            if (ChartData.IsMinutePeriod(this.Period, true)) 
            {
                if (IFrameSplitOperator.IsNumber(this.TrainStartDate.Time)) 
                {
                    if (item.Date >= this.TrainStartDate.Date && item.Time >= this.TrainStartDate.Time)
                        return parseInt(i);
                }
                else 
                {
                    if (item.Date >= this.TrainStartDate.Date)
                        return parseInt(i);
                }
            }
            else if (ChartData.IsDayPeriod(this.Period, true) || ChartData.IsTickPeriod(this.Period)) 
            {
                if (item.Date >= this.TrainStartDate.Date)
                    return parseInt(i);
            }
        }

        return -1;
    }

    this.AfterBindMainData = function (funcName) 
    {
        if (!this.ChartPaintEx[0]) this.CreateBuySellPaint();

        var hisData = this.ChartPaint[0].Data;
        this.ChartPaintEx[0].Data = hisData;

        var showItem = hisData.Data[hisData.Data.length - 1];

        //最后一个显示数据
        this.TrainInfo.LastShowData = showItem;
        //最后一个原始数据
        this.TrainInfo.LastData = this.SourceData.Data[this.SourceData.Data.length - 1];

        if (funcName != 'Update')
            this.UpdateTrainUICallback("开始");
    }

    this.BeforeBindMainData = function (funcName) 
    {
        if (funcName == "Update") return;

        //全量数据 需要过滤
        this.KLineSourceData = new ChartData();
        this.KLineSourceData.Data = this.SourceData.Data.slice(0);
        var count = this.SourceData.Data.length;
        var lEnd = count - this.TrainDataCount - 20;
        var findIndex = this.GetKDataIndexByDateTime(this.SourceData.Data, this.TrainStartDate);
        if (findIndex >= 0) 
        {
            lEnd = findIndex + 1;
            if (count - lEnd < this.TrainDataCount) this.TrainDataCount = count - lEnd;
        }

        //训练起始日期
        var index = lEnd - 1;
        var kItem = this.SourceData.Data[index];
        this.TrainInfo.Start.Index = index;
        this.TrainInfo.Start.Date = kItem.Date;
        this.TrainInfo.Start.Time = kItem.Time;

        //训练结束日期
        this.TrainInfo.End.Index = index;
        this.TrainInfo.End.Date = kItem.Date;
        this.TrainInfo.End.Time = kItem.Time;

        //最后一个数据
        this.TrainInfo.LastData = kItem;

        //修改数据个数
        this.SourceData.Data.length = lEnd;
    }

    this.Run = function (option) 
    {
        if (this.AutoRunTimer) return;
        if (this.TrainDataCount <= 0) return;

        var self = this;
        this.AutoRunTimer = setInterval(function () {
            if (!self.MoveNextKLineData(option)) clearInterval(self.AutoRunTimer);
        }, 1000);
    }

    this.MoveNextKLineData = function (option)  //{PageSize:, Step:}
    {
        if (this.TrainDataCount <= 0) return false;

        var step = 1, moveStep=0;
        if (option && option.Step > 1) step = option.Step;
        for (var i = 0; i < step; ++i)
        {
            var index = this.TrainInfo.End.Index + 1;
            if (index >= this.KLineSourceData.Data.length) break;

            var kItem = this.KLineSourceData.Data[index];
            this.SourceData.Data.push(kItem);

            this.TrainInfo.End.Index = index;
            this.TrainInfo.End.Date = kItem.Date;
            this.TrainInfo.End.Time = kItem.Time;
            --this.TrainDataCount;
            ++moveStep;

            

            if (this.TrainDataCount <= 0) break;
        }
        
        if (moveStep == 0) return false;
        
        //使用当前页数据个数移动K线
        var pageSize = this.Frame.GetCurrentPageSize();
        if (IFrameSplitOperator.IsNumber(pageSize))
            this.PageSize = pageSize - this.RightSpaceCount;

        this.Update();

        if (this.TrainDataCount <= 0) 
        {
            this.FinishTrainData();
            this.UpdateTrainUICallback("结束");
            return false;
        }

        this.UpdateTrainUICallback("训练中");
        return true;
    }

    this.UpdateTrainUICallback = function (description) 
    {
        //新的监听事件
        if (!this.mapEvent.has(JSCHART_EVENT_ID.RECV_TRAIN_MOVE_STEP)) return;
        var item = this.mapEvent.get(JSCHART_EVENT_ID.RECV_TRAIN_MOVE_STEP);
        if (!item.Callback) return;

        var data =
        {
            TrainDataCount: this.TrainDataCount,
            BuySellData: this.BuySellData,
            KLine:
            {
                Start: { Index: this.TrainInfo.Start.Index, Date: this.TrainInfo.Start.Date },
                End: { Index: this.TrainInfo.End.Index, Date: this.TrainInfo.End.Date }
            },
            LastData: this.TrainInfo.LastData,
            LastShowData: this.TrainInfo.LastShowData
        };
        if (IFrameSplitOperator.IsNumber(this.TrainInfo.Start.Time)) data.KLine.Start.Time = this.TrainInfo.Start.Time;
        if (IFrameSplitOperator.IsNumber(this.TrainInfo.End.Time)) data.KLine.End.Time = this.TrainInfo.End.Time;
        if (description) data.Description = description

        if (this.TrainDataCount <= 0) 
        {
            data.Symbol = this.Symbol;
            data.Name = this.Name;
        }

        item.Callback(item, data, this);
    }

    this.FinishTrainData = function () 
    {
        
    }

    this.Stop = function () 
    {
        if (this.AutoRunTimer != null) clearInterval(this.AutoRunTimer);
        this.AutoRunTimer = null;
    }

    this.BuyOrSell = function (obj, bDraw)  //{ Price:价格, Vol:数量, Op: 买/卖 0=buy 1=sell, ID:单号 } bDraw是否立即绘制图标
    {
        var kItem = this.TrainInfo.LastShowData;
        if (!kItem) return false;

        var buySellPaint = this.ChartPaintEx[0];
        if (!buySellPaint) return false;

        var hisData = this.ChartPaint[0].Data;
        if (!hisData || hisData.Data.length <= 0) return false;

        var index = hisData.Data.length - 1;  //数据索引
        var buyItem = { Date: this.TrainInfo.End.Date, Time: this.TrainInfo.End.Time, Price: obj.Price, Vol: obj.Vol, Op: 0, ID: obj.ID };
        if (obj.Op == 1) buyItem.Op = 1;
        var key = index;
        buyItem.Key = key;

        this.BuySellData.push(buyItem);
        buySellPaint.AddTradeItem(buyItem);

        if (bDraw == true) this.Draw();
    }

    this.RestartTrain = function (option)  // { Symbol:, Period:周期, Right:复权, Train:{ DataCount:, DateTime: } }
    {
        console.log('[KLineTrainChartContainer::RestartTrain] option ', option);

        this.TrainInfo = { Start: {}, End: {} };
        this.BuySellData = [];
        this.KLineSourceData = null;

        var buySellPaint = this.ChartPaintEx[0];
        if (buySellPaint) 
        {
            buySellPaint.Data = null;
            buySellPaint.ClearTradeData();
        }

        if (option.Symbol) this.Symbol = option.Symbol;
        if (IFrameSplitOperator.IsNumber(option.Period)) this.Period = option.Period;
        if (IFrameSplitOperator.IsNumber(option.Right)) this.Right = option.Right;
        if (option.Train) 
        {
            if (option.Train.DataCount > 1) this.TrainDataCount = option.Train.DataCount;
            if (option.Train.DateTime) this.TrainStartDate = option.Train.DateTime;
        }

        var symbol = this.Symbol;
        this.ChangeSymbol(symbol);
    }
}


////////////////////////////////////////////////////////////////////////////////
//  简单的图形框架
//
function SimlpleChartContainer(uielement) {
  this.newMethod = JSChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.WindowIndex = new Array();
  this.MainDataControl;    //主数据类(对外的接口类)
  this.SubDataControl = new Array();
  this.FrameType = 0;       //框架类型

  this.YSplitCount = 4;

  //创建
  this.Create = function () {
    this.UIElement.JSChartContainer = this;

    //创建十字光标
    //this.ChartCorssCursor=new ChartCorssCursor();
    //this.ChartCorssCursor.Canvas=this.Canvas;
    //this.ChartCorssCursor.StringFormatX=new HQDateStringFormat();
    //this.ChartCorssCursor.StringFormatY=new HQPriceStringFormat();

    //创建等待提示
    this.ChartSplashPaint = new ChartSplashPaint();
    this.ChartSplashPaint.Canvas = this.Canvas;

    //创建框架容器
    if (this.FrameType == 1) this.Frame = new Rotate90SimpleChartFrame();
    else this.Frame = new SimpleChartFrame();
    this.Frame.ChartBorder = new ChartBorder();
    this.Frame.ChartBorder.UIElement = this.UIElement;
    this.Frame.ChartBorder.Top = 30;
    this.Frame.ChartBorder.Left = 5;
    this.Frame.ChartBorder.Bottom = 20;
    this.Frame.Canvas = this.Canvas;
    if (this.ChartCorssCursor) this.ChartCorssCursor.Frame = this.Frame; //十字光标绑定框架
    this.ChartSplashPaint.Frame = this.Frame;

    this.CreateMainChart();

  }

  this.SetMainDataConotrl = function (dataControl) {
    if (!dataControl) return;

    this.MainDataControl = dataControl;
    this.ChartPaint = []; //图形
    this.Frame.BarCount = 0;

    let yStringFormat = this.Frame.YSplitOperator.StringFormat;//保存配置

    this.CreateMainChart();
    this.Frame.YSplitOperator.StringFormat = yStringFormat;//还原配置
    this.Draw();
    this.RequestData();
  }

    //创建主数据画法
    this.CreateMainChart = function () 
    {
        if (!this.MainDataControl) return;

        let barIndex = 0;
        for (let i in this.MainDataControl.DataType) 
        {
            let item = this.MainDataControl.DataType[i];
            if (item.Type == "BAR") 
            {
                let chartItem;
                if (this.FrameType == 1) chartItem = new ChartXYSubBar();
                else chartItem = new ChartSubBar();

                chartItem.BarID = barIndex;
                chartItem.Canvas = this.Canvas;
                chartItem.ChartBorder = this.Frame.ChartBorder;
                chartItem.ChartFrame = this.Frame;
                chartItem.Name = item.Name;
                if (item.Color) chartItem.UpBarColor = item.Color;
                if (item.Color2) chartItem.DownBarColor = item.Color2;

                this.ChartPaint.push(chartItem);
                ++this.Frame.BarCount;
                ++barIndex;
            }
            else if (item.Type == "LINE") 
            {
                let chartItem = new ChartLine();
                chartItem.Canvas = this.Canvas;
                chartItem.ChartBorder = this.Frame.ChartBorder;
                chartItem.ChartFrame = this.Frame;
                chartItem.Name = item.Name;
                if (item.Color) chartItem.Color = item.Color;

                this.ChartPaint.push(chartItem);
            }
        }

        var floatPrecision = 2;     //设置纵坐标的小数位数 默认为2
        var ignoreYValue=null
        if (this.Frame.YSplitOperator) 
        {     
            floatPrecision = this.Frame.YSplitOperator.FloatPrecision;  //备份上次实例化的值
            if (this.Frame.YSplitOperator.IgnoreYValue) ignoreYValue = this.Frame.YSplitOperator.IgnoreYValue;
        }

        this.Frame.YSplitOperator = new FrameSplitY();
        this.Frame.YSplitOperator.FloatPrecision = floatPrecision;   //实例化纵坐标分割后 赋给备份的值
        this.Frame.YSplitOperator.IgnoreYValue = ignoreYValue;

        this.Frame.YSplitOperator.SplitCount = this.YSplitCount;
        this.Frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
        this.Frame.YSplitOperator.Frame = this.Frame;
        this.Frame.YSplitOperator.ChartBorder = this.Frame.ChartBorder;

        this.Frame.XSplitOperator = new FrameSplitXData();
        this.Frame.XSplitOperator.Frame = this.Frame;
        this.Frame.XSplitOperator.ChartBorder = this.Frame.ChartBorder;


        // this.TitlePaint[0]=new DynamicKLineTitlePainting();
        // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
        // this.TitlePaint[0].Canvas=this.Canvas;
    }

  this.RequestData = function () {
    if (!this.MainDataControl) return;

    this.MainDataControl.JSChartContainer = this;
    this.MainDataControl.RequestData();
  }

  this.UpdateMainData = function (dataControl) {
    let lCount = 0;
    for (let i in dataControl.Data) {
      let itemData = new ChartData();
      itemData.Data = dataControl.Data[i];
      this.ChartPaint[i].Data = itemData;
      if (lCount < itemData.Data.length) lCount = itemData.Data.length;
    }

    this.Frame.XPointCount = lCount;
    this.Frame.Data = this.ChartPaint[0].Data;
    this.Frame.XData = dataControl.XData;

    this.UpdateFrameMaxMin();               //调整坐标最大 最小值
    this.Frame.SetSizeChage(true);
    this.Draw();
  }

}

////////////////////////////////////////////////////////////////////////////////
//  饼图图形框架
//
function PieChartContainer(uielement) {
  this.Radius;    //半径
  this.newMethod = JSChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.MainDataControl;    //主数据类(对外的接口类)

  //鼠标移动
  this.OnMouseMove = function (x, y, e) { }

  //创建
  this.Create = function () {
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

  this.SetMainDataConotrl = function (dataControl) {
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
            else if (item.Type == 'CIRCLE') 
            {
                var chartItem = new ChartCircle();
                chartItem.Canvas = this.Canvas;
                chartItem.ChartBorder = this.Frame.ChartBorder;
                chartItem.ChartFrame = this.Frame;
                chartItem.Name = item.Name;

                this.ChartPaint.push(chartItem);
            }
            else if (item.Type == 'RADAR') //雷达图
            {
                var chartItem = new ChartRadar();
                chartItem.Canvas = this.Canvas;
                chartItem.ChartBorder = this.Frame.ChartBorder;
                chartItem.ChartFrame = this.Frame;
                chartItem.Name = item.Name;
                if (item.StartAngle) chartItem.StartAngle = item.StartAngle;
                if (item.TitleFont) chartItem.TitleFont = item.TitleFont;
                this.ChartPaint.push(chartItem);
            }
        }

    // this.TitlePaint[0]=new DynamicKLineTitlePainting();
    // this.TitlePaint[0].Frame=this.Frame.SubFrame[0].Frame;
    // this.TitlePaint[0].Canvas=this.Canvas;
  }

  this.RequestData = function () {
    if (!this.MainDataControl) return;

    this.MainDataControl.JSChartContainer = this;
    this.MainDataControl.RequestData();
  }

  this.UpdateMainData = function (dataControl) {
    for (let i in dataControl.Data) {
      let itemData = new ChartData();
      itemData.Data = dataControl.Data[i];
      this.ChartPaint[i].Data = itemData;
    }
    this.Frame.SetSizeChage(true);
    this.Draw();
  }

}

//地图
function MapChartContainer(uielement) {
  this.newMethod = JSChartContainer;   //派生
  this.newMethod(uielement);
  delete this.newMethod;

  this.MainDataControl;    //主数据类(对外的接口类)

  //鼠标移动
  this.OnMouseMove = function (x, y, e) {

  }

  //创建
  this.Create = function () {
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

  this.SetMainDataConotrl = function (dataControl) {
    if (!dataControl) return;

    this.MainDataControl = dataControl;
    this.ChartPaint = []; //图形

    this.CreateMainChart();
    this.Draw();
    this.RequestData();
  }

  //创建主数据画法
  this.CreateMainChart = function () {
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

  this.RequestData = function () {
    if (!this.MainDataControl) return;

    this.MainDataControl.JSChartContainer = this;
    this.MainDataControl.RequestData();
  }

  this.UpdateMainData = function (dataControl) {
    this.ChartPaint[0].Data = dataControl.Data[0];

    this.Frame.SetSizeChage(true);
    this.Draw();
  }
}

var HQ_DATA_TYPE =
{
    KLINE_ID: 0,         //K线
    MINUTE_ID: 2,        //当日走势图
    HISTORY_MINUTE_ID: 3,//历史分钟走势图
    MULTIDAY_MINUTE_ID: 4,//多日走势图
};


//脚本指标
//name=指标名字 args=参数名字 参数值
function ScriptIndex(name, script, args, option) 
{
    this.newMethod = BaseIndex;   //派生
    this.newMethod(name);
    delete this.newMethod;

    this.Script = script;
    this.Arguments = [];
    this.OutVar = [];
    this.ID;    //指标ID
    this.FloatPrecision = 2;    //小数位数
    this.StringFormat;
    this.KLineType = null;      //K线显示类型
    this.InstructionType;       //五彩K线, 交易指标
    this.YSpecificMaxMin = null;  //最大最小值
    this.YSplitScale = null;      //固定刻度
   
    //指标上锁配置信息
    this.IsLocked = false;    //是否锁住指标
    this.LockCallback = null;
    this.LockID = null;
    this.LockBG = null;       //锁背景色
    this.LockTextColor = null;
    this.LockText = null;
    this.LockFont = null;
    this.LockCount = 10;

    if (option) 
    {
        if (option.FloatPrecision >= 0) this.FloatPrecision = option.FloatPrecision;
        if (option.StringFormat > 0) this.StringFormat = option.StringFormat;
        if (option.ID) this.ID = option.ID;
        if (option.KLineType) this.KLineType = option.KLineType;
        if (option.InstructionType) this.InstructionType = option.InstructionType;
        if (option.YSpecificMaxMin) this.YSpecificMaxMin = option.YSpecificMaxMin;
        if (option.YSplitScale) this.YSplitScale = option.YSplitScale;
    }

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

    if (args) this.Arguments = args;

  this.SetLock = function (lockData) {
    if (lockData.IsLocked == true) {
      this.IsLocked = true;  //指标上锁
      if (lockData.Callback) this.LockCallback = lockData.Callback;    //锁回调
      if (lockData.ID) this.LockID = lockData.ID;                      //锁ID
      if (lockData.BG) this.LockBG = lockData.BG;
      if (lockData.TextColor) this.LockTextColor = lockData.TextColor;
      if (lockData.Text) this.LockText = lockData.Text;
      if (lockData.Font) this.LockFont = lockData.Font;
      if (lockData.Count) this.LockCount = lockData.Count;
    }
    else {   //清空锁配置信息
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

    this.ExecuteScript = function (hqChart, windowIndex, hisData) 
    {
        this.OutVar = [];
        let self = this;
        let param =
        {
            HQChart: hqChart,
            WindowIndex: windowIndex,
            HistoryData: hisData,
            Self: this
        };

        let hqDataType = 0;   //默认K线
        if (hqChart.ClassName === 'MinuteChartContainer') hqDataType = 2;   //分钟数据
        let option =
        {
            HQDataType: hqDataType,
            Symbol: hqChart.Symbol,
            Data: hisData,
            SourceData: hqChart.SourceData, //原始数据
            Callback: this.RecvResultData, CallbackParam: param,
            Async: true,
            MaxReqeustDataCount: hqChart.MaxReqeustDataCount,
            MaxRequestMinuteDayCount: hqChart.MaxRequestMinuteDayCount,
            Arguments: this.Arguments
        };

        if (hqChart.NetworkFilter) option.NetworkFilter = hqChart.NetworkFilter;

        let code = this.Script;
        let run = JSCommonComplier.JSComplier.Execute(code, option, hqChart.ScriptErrorCallback);
    }

    this.RecvResultData = function (outVar, param) 
    {
        let hqChart = param.HQChart;
        let windowIndex = param.WindowIndex;
        let hisData = param.HistoryData;
        param.Self.OutVar = outVar;
        param.Self.BindData(hqChart, windowIndex, hisData);

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

        var event = hqChart.GetIndexEvent();    //指标计算完成回调
        if (event) 
        {
            var self = param.Self;
            var data = {
                OutVar: self.OutVar, WindowIndex: windowIndex, Name: self.Name, Arguments: self.Arguments, HistoryData: hisData,
                Stock: { Symbol: hqChart.Symbol, Name: hqChart.Name }
            };
            event.Callback(event, data, self);
        }
    }

    this.CreateLine = function (hqChart, windowIndex, varItem, id) 
    {
        let line = new ChartLine();
        line.Canvas = hqChart.Canvas;
        line.DrawType = 1;  //无效数不画
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

        if (varItem.IsDotLine) line.IsDotLine = true; //虚线
        if (varItem.IsShow == false) line.IsShow = false;

        let titleIndex = windowIndex + 1;
        line.Data.Data = varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(line.Data, varItem.Name, line.Color);

        hqChart.ChartPaint.push(line);
    }

    this.CreateOverlayLine = function (hqChart, windowIndex, varItem, id) 
    {
        let line = new ChartSubLine();
        line.Canvas = hqChart.Canvas;
        line.DrawType = 1;  //无效数不画
        line.Name = varItem.Name;
        line.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) line.Color = this.GetColor(varItem.Color);
        else line.Color = this.GetDefaultColor(id);

        if (varItem.LineWidth) {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) line.LineWidth = width;
        }

        if (varItem.IsDotLine) line.IsDotLine = true; //虚线
        if (varItem.IsShow == false) line.IsShow = false;

        let titleIndex = windowIndex + 1;
        line.Data.Data = varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(line.Data, varItem.Name, line.Color);

        hqChart.ChartPaint.push(line);
    }

    //创建柱子
    this.CreateBar = function (hqChart, windowIndex, varItem, id) 
    {
        let bar = new ChartStickLine();
        bar.Canvas = hqChart.Canvas;
        if (varItem.Draw.Width > 0) bar.LineWidth = varItem.Draw.Width;
        else bar.LineWidth=1;

        bar.Name = varItem.Name;
        bar.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        bar.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) bar.Color = this.GetColor(varItem.Color);
        else bar.Color = this.GetDefaultColor(id);

        let titleIndex = windowIndex + 1;
        bar.Data.Data = varItem.Draw.DrawData;
        bar.BarType = varItem.Draw.Type;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        hqChart.ChartPaint.push(bar);
    }

    //创建文本
    this.CreateText = function (hqChart, windowIndex, varItem, id) 
    {
        let chartText = new ChartSingleText();
        chartText.Canvas = hqChart.Canvas;
        chartText.TextAlign='center';

        chartText.Name = varItem.Name;
        chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
        else chartText.Color = this.GetDefaultColor(id);

        let titleIndex = windowIndex + 1;
        chartText.Data.Data = varItem.Draw.DrawData;
        chartText.Text = varItem.Draw.Text;
        if (varItem.Draw.Direction > 0) chartText.Direction = varItem.Draw.Direction;
        if (varItem.Draw.YOffset > 0) chartText.YOffset = varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign = varItem.Draw.TextAlign;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
    }

  //COLORSTICK 
  this.CreateMACD = function (hqChart, windowIndex, varItem, id) {
    let chartMACD = new ChartMACD();
    chartMACD.Canvas = hqChart.Canvas;

    chartMACD.Name = varItem.Name;
    chartMACD.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chartMACD.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

    let titleIndex = windowIndex + 1;
    chartMACD.Data.Data = varItem.Data;
    hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chartMACD.Data, varItem.Name, this.GetDefaultColor(id));

    hqChart.ChartPaint.push(chartMACD);
  }

  this.CreatePointDot = function (hqChart, windowIndex, varItem, id) {
    let pointDot = new ChartPointDot();
    pointDot.Canvas = hqChart.Canvas;
    pointDot.Name = varItem.Name;
    pointDot.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    pointDot.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    if (varItem.Color) pointDot.Color = this.GetColor(varItem.Color);
    else pointDot.Color = this.GetDefaultColor(id);

    if (varItem.Radius) pointDot.Radius = varItem.Radius;

    if (varItem.LineWidth) {
      let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
      if (!isNaN(width) && width > 0) pointDot.Radius = width;
    }

    let titleIndex = windowIndex + 1;
    pointDot.Data.Data = varItem.Data;
    hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(pointDot.Data, varItem.Name, pointDot.Color);

    hqChart.ChartPaint.push(pointDot);
  }

  this.CreateStick = function (hqChart, windowIndex, varItem, id) {
    let chart = new ChartStick();
    chart.Canvas = hqChart.Canvas;
    chart.Name = varItem.Name;
    chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
    else chart.Color = this.GetDefaultColor(id);

    if (varItem.LineWidth) {
      let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
      if (!isNaN(width) && width > 0) chart.LineWidth = width;
    }

    let titleIndex = windowIndex + 1;
    chart.Data.Data = varItem.Data;
    hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chart.Data, varItem.Name, chart.Color);

    hqChart.ChartPaint.push(chart);
  }

  this.CreateLineStick = function (hqChart, windowIndex, varItem, id) {
    let chart = new ChartLineStick();
    chart.Canvas = hqChart.Canvas;
    chart.Name = varItem.Name;
    chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
    else chart.Color = this.GetDefaultColor(id);

    if (varItem.LineWidth) {
      let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
      if (!isNaN(width) && width > 0) chart.LineWidth = width;
    }

    let titleIndex = windowIndex + 1;
    chart.Data.Data = varItem.Data;
    hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chart.Data, varItem.Name, chart.Color);

    hqChart.ChartPaint.push(chart);
  }

  this.CreateStraightLine = function (hqChart, windowIndex, varItem, id) {
    let line = new ChartLine();
    line.DrawType = 1;
    line.Canvas = hqChart.Canvas;
    line.Name = varItem.Name;
    line.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    line.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    if (varItem.Color) line.Color = this.GetColor(varItem.Color);
    else line.Color = this.GetDefaultColor(id);

    if (varItem.LineWidth) {
      let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
      if (!isNaN(width) && width > 0) line.LineWidth = width;
    }

    let titleIndex = windowIndex + 1;
    line.Data.Data = varItem.Draw.DrawData;
    //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

    hqChart.ChartPaint.push(line);
  }

  this.CreateVolStick = function (hqChart, windowIndex, varItem, id, hisData) {
    let chart = new ChartVolStick();
    chart.Canvas = hqChart.Canvas;
    chart.Name = varItem.Name;
    chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    chart.KLineDrawType = hqChart.KLineDrawType;  //设置K线显示类型
    if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
    else chart.Color = this.GetDefaultColor(id);

    let titleIndex = windowIndex + 1;
    chart.Data.Data = varItem.Data;
    chart.HistoryData = hisData;
    hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chart.Data, varItem.Name, chart.Color);

    hqChart.ChartPaint.push(chart);
  }

  this.CreateBand = function (hqChart, windowIndex, varItem, id) {
    let chart = new ChartBand();
    chart.Canvas = hqChart.Canvas;
    chart.Name = varItem.Name;
    chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

    chart.FirstColor = varItem.Draw.Color[0];
    chart.SecondColor = varItem.Draw.Color[1];
    chart.Data.Data = varItem.Draw.DrawData;

    hqChart.ChartPaint.push(chart);
  }

  this.CreatePolyLine = function (hqChart, windowIndex, varItem, id) {
    let line = new ChartLine();
    line.Canvas = hqChart.Canvas;
    line.Name = varItem.Name;
    line.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    line.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
    if (varItem.Color) line.Color = this.GetColor(varItem.Color);
    else line.Color = this.GetDefaultColor(id);

    if (varItem.LineWidth) {
      let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
      if (!isNaN(width) && width > 0) line.LineWidth = width;
    }

    let titleIndex = windowIndex + 1;
    line.Data.Data = varItem.Draw.DrawData;
    //hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(line.Data, ' ', line.Color); //给一个空的标题

    hqChart.ChartPaint.push(line);
  }

  //创建K线图
  this.CreateKLine = function (hqChart, windowIndex, varItem, id) {
    let chart = new ChartKLine();
    chart.Canvas = hqChart.Canvas;
    chart.Name = varItem.Name;
    chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

    chart.Data.Data = varItem.Draw.DrawData;
    chart.IsShowMaxMinPrice = false;

    if (varItem.Color)  //如果设置了颜色,使用外面设置的颜色
      chart.UnchagneColor = chart.DownColor = chart.UpColor = this.GetColor(varItem.Color);

    hqChart.ChartPaint.push(chart);
  }

  this.CreateNumberText = function (hqChart, windowIndex, varItem, id) {
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
  this.CreateIcon = function (hqChart, windowIndex, varItem, id) {
    let chartText = new ChartSingleText();
    chartText.Canvas = hqChart.Canvas;
    chartText.TextAlign = 'center';

    chartText.Name = varItem.Name;
    chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
    chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

    let titleIndex = windowIndex + 1;
    chartText.Data.Data = varItem.Draw.DrawData;
    chartText.Text = varItem.Draw.Icon.Symbol;
    if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
    else if (varItem.Draw.Icon.Color) chartText.Color = varItem.Draw.Icon.Color;
    else chartText.Color = 'rgb(0,0,0)';

    //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

    hqChart.ChartPaint.push(chartText);
  }

    this.CreateRectangle = function (hqChart, windowIndex, varItem, i) 
    {
        let chart = new ChartRectangle();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Color = [varItem.Draw.DrawData.Color];
        chart.Rect = varItem.Draw.DrawData.Rect;
        if (varItem.Color) chart.BorderColor = this.GetColor(varItem.Color);
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiText = function (hqChart, windowIndex, varItem, i)
    {
        let chart = new ChartMultiText();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data = hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts = varItem.Draw.DrawData;
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiLine = function (hqChart, windowIndex, varItem, i) 
    {
        let chart = new ChartMultiLine();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data = hqChart.ChartPaint[0].Data;//绑定K线
        chart.Lines = varItem.Draw.DrawData;
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiBar = function (hqChart, windowIndex, varItem, i) 
    {
        let chart = new ChartMultiBar();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data = hqChart.ChartPaint[0].Data;//绑定K线
        chart.Bars = varItem.Draw.DrawData;
        hqChart.ChartPaint.push(chart);
    }

    //创建K线背景
    this.CreateSelfKLine = function (hqChart, windowIndex, hisData) 
    {
        let chart = new ChartKLine();
        chart.Canvas = hqChart.Canvas;
        chart.Name = "Self Kline"
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data = hisData
        chart.IsShowMaxMinPrice = false;
        chart.IsShowKTooltip = false;
        chart.DrawType = this.KLineType;

        hqChart.ChartPaint.push(chart);
    }

    this.BindInstructionData = function (hqChart, windowIndex, hisData)  //绑定指示指标
    {
        if (this.OutVar == null || this.OutVar.length < 0) return;
        if (this.InstructionType == 2) 
        {
            let varItem = this.OutVar[this.OutVar.length - 1]; //取最后一组数据作为指示数据
            hqChart.SetInstructionData(this.InstructionType, { Data: varItem.Data });       //设置指示数据
            return true;
        }
        else if (this.InstructionType == 1)   //交易系统
        {
            var buyData, sellData;
            for (var i in this.OutVar) 
            {
                let item = this.OutVar[i];
                if (item.Name == 'ENTERLONG') buyData = item.Data;
                else if (item.Name == 'EXITLONG') sellData = item.Data;
            }

            hqChart.SetInstructionData(this.InstructionType, { Buy: buyData, Sell: sellData });       //设置指示数据
            return true;
        }
    }


    this.BindData = function (hqChart, windowIndex, hisData) 
    {
        if (windowIndex == 0 && this.InstructionType) 
        {
            this.BindInstructionData(hqChart, windowIndex, hisData);
            return;
        }

        //清空指标图形
        hqChart.DeleteIndexPaint(windowIndex);
        if (windowIndex == 0) hqChart.ShowKLine(true);

        if (this.OutVar == null || this.OutVar.length < 0) return;

        //叠加一个K线背景
        if (this.KLineType != null) 
        {
            if (this.KLineType === 0 || this.KLineType === 1 || this.KLineType === 2) this.CreateSelfKLine(hqChart, windowIndex, hisData);
            else if (this.KLineType === -1 && windowIndex == 0) hqChart.ShowKLine(false);
        }

        if (windowIndex >= 1 && hqChart.Frame) 
        {
            hqChart.Frame.SubFrame[windowIndex].Frame.YSplitOperator.FloatPrecision = this.FloatPrecision;
            if (this.YSpecificMaxMin) hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = this.YSpecificMaxMin;  //最大最小值
            if (this.YSplitScale) hqChart.Frame.SubFrame[windowIndex].Frame.YSplitScale = this.YSplitScale;             //固定刻度
        }

        for (let i in this.OutVar) 
        {
            let item = this.OutVar[i];
            if (item.IsExData === true) continue; //扩展数据不显示图形

            if (item.Type == 0) 
            {
                if (item.IsOverlayLine) this.CreateOverlayLine(hqChart, windowIndex, item, i);
                else this.CreateLine(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 1) 
            {
                switch (item.Draw.DrawType) 
                {
                case 'STICKLINE':
                    this.CreateBar(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWTEXT':
                case 'SUPERDRAWTEXT':
                    this.CreateText(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWLINE':
                    this.CreateStraightLine(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWBAND':
                    this.CreateBand(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWKLINE':
                    this.CreateKLine(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWKLINE_IF':
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
                case 'DRAWRECTREL':
                    this.CreateRectangle(hqChart, windowIndex, item, i);
                    break;

                //第3方指标定制
                case 'MULTI_TEXT':
                    this.CreateMultiText(hqChart, windowIndex, item, i);
                    break;
                case 'MULTI_LINE':
                    this.CreateMultiLine(hqChart, windowIndex, item, i);
                    break;
                case 'MULTI_BAR':
                    this.CreateMultiBar(hqChart, windowIndex, item, i);
                    break;
                }
            }
            else if (item.Type == 2) 
            {
                this.CreateMACD(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 3) 
            {
                this.CreatePointDot(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 4) 
            {
                this.CreateLineStick(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 5) 
            {
                this.CreateStick(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 6) 
            {
                this.CreateVolStick(hqChart, windowIndex, item, i, hisData);
            }

            var titlePaint = hqChart.TitlePaint[windowIndex + 1];
            if (titlePaint && titlePaint.Data && i < titlePaint.Data.length) //设置标题数值 小数位数和格式
            {
                if (this.StringFormat > 0) titlePaint.Data[i].StringFormat = this.StringFormat;
                if (this.FloatPrecision >= 0) titlePaint.Data[i].FloatPrecision = this.FloatPrecision;
            }
        }

        let titleIndex = windowIndex + 1;
        hqChart.TitlePaint[titleIndex].Title = this.Name;

        let indexParam = '';
        for (let i in this.Arguments) 
        {
            let item = this.Arguments[i];
            if (indexParam.length > 0) indexParam += ',';
            indexParam += item.Value.toString();
        }

        if (indexParam.length > 0) hqChart.TitlePaint[titleIndex].Title = this.Name + '(' + indexParam + ')';

        if (hqChart.UpdateUICallback) hqChart.UpdateUICallback('ScriptIndex', this.OutVar,
            { WindowIndex: windowIndex, Name: this.Name, Arguments: this.Arguments, HistoryData: hisData });  //通知上层回调

        return true;
    }

    
    this.GetDefaultColor = function (id)   //给一个默认的颜色
    {
        let COLOR_ARRAY = g_JSChartResource.ColorArray;
        let number = parseInt(id);
        return COLOR_ARRAY[number % (COLOR_ARRAY.length - 1)];
    }

    
    this.GetColor = function (colorName)    //获取颜色
    {
        let COLOR_MAP = new Map([
            ['COLORBLACK', 'rgb(0,0,0)'],
            ['COLORBLUE', 'rgb(18,95,216)'],
            ['COLORGREEN', 'rgb(25,158,0)'],
            ['COLORCYAN', 'rgb(0,255,198)'],
            ['COLORRED', 'rgb(238,21,21)'],
            ['COLORMAGENTA', 'rgb(255,0,222)'],
            ['COLORBROWN', 'rgb(149,94,15)'],
            ['COLORLIGRAY', 'rgb(218,218,218)'],      //画淡灰色
            ['COLORGRAY', 'rgb(133,133,133)'],        //画深灰色
            ['COLORLIBLUE', 'rgb(94,204,255)'],       //淡蓝色
            ['COLORLIGREEN', 'rgb(183,255,190)'],      //淡绿色
            ['COLORLICYAN', 'rgb(154,255,242)'],      //淡青色
            ['COLORLIRED', 'rgb(255,172,172)'],       //淡红色
            ['COLORLIMAGENTA', 'rgb(255,145,241)'],   //淡洋红色
            ['COLORWHITE', 'rgb(255,255,255)'],       //白色
            ['COLORYELLOW', 'rgb(255,198,0)']
        ]);

        if (COLOR_MAP.has(colorName)) return COLOR_MAP.get(colorName);

        //COLOR 自定义色
        //格式为COLOR+“RRGGBB”：RR、GG、BB表示红色、绿色和蓝色的分量，每种颜色的取值范围是00-FF，采用了16进制。
        //例如：MA5：MA(CLOSE，5)，COLOR00FFFF　表示纯红色与纯绿色的混合色：COLOR808000表示淡蓝色和淡绿色的混合色。
        if (colorName.indexOf('COLOR') == 0) return '#' + colorName.substr(5);
        return 'rgb(30,144,255)';
    }
}





function APIScriptIndex(name, script, args, option)     //后台执行指标
{
    this.newMethod = ScriptIndex;   //派生
    this.newMethod(name, script, args, option);
    delete this.newMethod;

    this.ApiUrl;    //指标执行api地址
    this.HQDataType;

    if (option.API) 
    {
        if (option.API.Url) this.ApiUrl = option.API.Url;
        if (option.API.Name) this.Name = this.ID = option.API.Name;
        if (option.API.ID) this.ID = option.API.ID;
    }

    this.ExecuteScript = function (hqChart, windowIndex, hisData) 
    {
        console.log('[APIScriptIndex::ExecuteScript] name, Arguments ', this.Name, this.Arguments);

        //数据类型
        let hqDataType = HQ_DATA_TYPE.KLINE_ID;   //默认K线
        if (hqChart.ClassName === 'MinuteChartContainer' || hqChart.ClassName === 'MinuteChartHScreenContainer') 
        {
            if (hqChart.DayCount > 1) hqDataType = HQ_DATA_TYPE.MULTIDAY_MINUTE_ID; //多日分钟
            else hqDataType = HQ_DATA_TYPE.MINUTE_ID;                             //分钟数据
        }
        else if (hqChart.ClassName === 'HistoryMinuteChartContainer') 
        {
            hqDataType = HQ_DATA_TYPE.HISTORY_MINUTE_ID;   //历史分钟
        }

        var args = [];
        if (this.Arguments) 
        {
            for (var i in this.Arguments) 
            {
                var item = this.Arguments[i];
                args.push({ name: item.Name, value: item.Value });
            }
        }

        var requestCount = hqChart.GetRequestDataCount();
        var self = this;
        var postData =
        {
            indexname: this.ID, symbol: hqChart.Symbol, script: this.Script, args: args,
            period: hqChart.Period, right: hqChart.Right, maxdatacount: requestCount.MaxRequestDataCount, maxminutedaycount: requestCount.MaxRequestMinuteDayCount, hqdatatype: hqDataType
        };
        if (hqDataType == HQ_DATA_TYPE.MULTIDAY_MINUTE_ID || hqDataType == HQ_DATA_TYPE.MINUTE_ID) postData.daycount = hqChart.DayCount;
        this.HQDataType = hqDataType;

        if (hqChart.NetworkFilter) 
        {
            var obj =
            {
                Name: 'APIScriptIndex::ExecuteScript', //类名::
                Explain: '指标计算',
                Request: { Url: self.ApiUrl, Type: 'POST', Data: postData },
                Self: this,
                HQChart: hqChart,
                PreventDefault: false
            };

            hqChart.NetworkFilter(obj, function (data) 
            {
                self.RecvAPIData(data, hqChart, windowIndex, hisData);
            });

            if (obj.PreventDefault == true) return;   //已被上层替换,不调用默认的网络请求
        }

        wx.request({
            url: self.ApiUrl,
            data: postData,
            method: 'POST',
            dataType: "json",
            async: true,
            success: function (recvData) 
            {
                self.RecvAPIData(recvData, hqChart, windowIndex, hisData);
            },
            error: function (request) 
            {
                self.RecvError(request);
            }
        });
    }

    this.RecvAPIData = function (recvData, hqChart, windowIndex, hisData) 
    {
        var data=recvData.data;
        console.log('[APIScriptIndex::RecvAPIData] recv data ', this.Name, data);
        if (data.code != 0) return;

        if (data.outdata && data.outdata.name) this.Name = data.outdata.name;

        this.Arguments = [];
        if (data.outdata.args) 
        {
            for (var i in data.outdata.args) 
            {
                var item = data.outdata.args[i];
                this.Arguments.push({ Name: item.name, Value: item.value });
            }
        }

        if (this.HQDataType == HQ_DATA_TYPE.KLINE_ID) 
        {
            this.OutVar = this.FittingData(data.outdata, hqChart);
            console.log('[APIScriptIndex::RecvAPIData] conver to OutVar ', this.OutVar);
        }
        else 
        {
            this.OutVar = this.FittingMinuteData(data.outdata, hqChart);   //走势图数据
        }
        this.BindData(hqChart, windowIndex, hisData);

        if (this.IsLocked == false) //不上锁
        {
            hqChart.Frame.SubFrame[windowIndex].Frame.SetLock(null);
        }
        else    //上锁
        {
            let lockData = 
            {
                IsLocked: true, Callback: this.LockCallback, IndexName: this.Name, ID: this.LockID,
                BG: this.LockBG, Text: this.LockText, TextColor: this.LockTextColor, Font: this.LockFont, Count: this.LockCount, MinWidth: this.LockMinWidth
            };
            hqChart.Frame.SubFrame[windowIndex].Frame.SetLock(lockData);
        }

        hqChart.UpdataDataoffset();           //更新数据偏移
        hqChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        hqChart.Draw();

        if (hqChart.GetIndexEvent) 
        {
            var event = hqChart.GetIndexEvent();  //指标计算完成回调
            if (event) 
            {
                var self = param.Self;
                var data = 
                {
                    OutVar: self.OutVar, WindowIndex: windowIndex, Name: this.Name, Arguments: this.Arguments, HistoryData: hisData,
                    Stock: { Symbol: hqChart.Symbol, Name: hqChart.Name }
                };
                event.Callback(event, data, this);
            }
        }
    }

    this.FittingData = function (jsonData, hqChart) 
    {
        var outVar = jsonData.outvar;
        var date = jsonData.date;
        var time = jsonData.time;
        var kdata = hqChart.ChartPaint[0].Data;

        //把数据拟合到kdata上
        var result = [];

        for (var i in outVar) 
        {
            var item = outVar[i];
            var indexData = [];
            var outVarItem = { Name: item.name, Type: item.type };
            if (item.color) outVarItem.Color = item.color;
            if (item.data) 
            {
                outVarItem.Data = this.FittingArray(item.data, date, time, hqChart);

                if (item.color) outVarItem.Color = item.color;
                if (item.linewidth >= 1) outVarItem.LineWidth = item.linewidth;
                if (item.isshow == false) outVarItem.IsShow = false;
                if (item.isexdata == true) outVarItem.IsExData = true;

                result.push(outVarItem);
            }
            else if (item.Draw) 
            {
                var draw = item.Draw;
                var drawItem = {};
                if (draw.DrawType == 'DRAWICON')  //图标
                {
                    drawItem.Icon = draw.Icon;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingArray(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'DRAWTEXT') //文本
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingArray(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'STICKLINE')    //柱子
                {
                    drawItem.Name = draw.Name;
                    drawItem.Type = draw.Type;
                    drawItem.Width = draw.Width;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingArray(draw.DrawData, date, time, hqChart, 1);
                    outVarItem.Draw = drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_LINE') 
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiLine(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_BAR') 
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiLine(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_TEXT')
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiText(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;
                    result.push(outVarItem);
                }
            }
        }

        return result;
    }

    this.FittingArray = function (sourceData, date, time, hqChart, arrayType)  //arrayType 0=单值数组 1=结构体
    {
        var kdata = hqChart.ChartPaint[0].Data;   //K线

        var arySingleData = [];
        for (var i in sourceData) 
        {
            var value = sourceData[i];
            var indexItem = new SingleData(); //单列指标数据
            indexItem.Date = date[i];
            if (time && i < time.length) indexItem.Time = time[i];
            indexItem.Value = value;
            arySingleData.push(indexItem);
        }

        var aryFittingData;
        if (ChartData.IsDayPeriod(hqChart.Period,true))
            aryFittingData = kdata.GetFittingData(arySingleData);        //数据和主图K线拟合
        else
            aryFittingData = kdata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合

        var bindData = new ChartData();
        bindData.Data = aryFittingData;
        var result;
        if (arrayType == 1) result = bindData.GetObject();
        else result = bindData.GetValue();
        return result;
    }

    this.FittingMultiLine = function (sourceData, date, time, hqChart) 
    {
        var kdata = hqChart.ChartPaint[0].Data;   //K线

        if (ChartData.IsDayPeriod(hqChart.Period, true))  //日线
        {
            var aryPoint = [];
            for (var i in sourceData) 
            {
                var item = sourceData[i];
                for (var j in item.Point) 
                {
                    var point = item.Point[j];
                    aryPoint.push(point);
                }
            }

            aryPoint.sort(function (a, b) { return a.Date - b.Date; });
            kdata.GetDateIndex(aryPoint);
            return sourceData;
        } 
        else if (ChartData.IsMinutePeriod(hqChart.Period, true)) //分钟线
        {
            var aryPoint = [];
            for (var i in sourceData) 
            {
                var item = sourceData[i];
                for (var j in item.Point) 
                {
                    var point = item.Point[j];
                    aryPoint.push(point);
                }
            }

            aryPoint.sort(function (a, b) {
                if (a.Date == b.Date) return a.Time - b.Time;
                return a.Date - b.Date;
            });

            kdata.GetDateTimeIndex(aryPoint);
            return sourceData;
        }

        return null;
    }

    this.FittingMultiText = function (sourceData, date, time, hqChart) 
    {
        var kdata = hqChart.ChartPaint[0].Data;   //K线

        if (ChartData.IsDayPeriod(hqChart.Period, true))  //日线
        {
            sourceData.sort(function (a, b) { return a.Date - b.Date; });
            kdata.GetDateIndex(sourceData);
            return sourceData;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period, true)) //分钟线
        {
            sourceData.sort(function (a, b) {
                if (a.Date == b.Date) return a.Time - b.Time;
                return a.Date - b.Date;
            }
            );

            kdata.GetDateTimeIndex(sourceData);
            return sourceData;
        }

        return null;
    }
}

//市场多空
function MarketLongShortIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('市场多空');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo("多空指标", null),
    new IndexInfo("多头区域", null),
    new IndexInfo("空头区域", null)
  );

  this.Index[0].LineColor = g_JSChartResource.Index.LineColor[0];
  this.Index[1].LineColor = g_JSChartResource.UpBarColor;
  this.Index[2].LineColor = g_JSChartResource.DownBarColor;

  this.LongShortData; //多空数据

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = null;
      if (i == 0)
        paint = new ChartLine();
      else
        paint = new ChartStraightLine();

      paint.Color = this.Index[i].LineColor;
      paint.Canvas = hqChart.Canvas;
      paint.Name = this.Name + "-" + i.toString();
      paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
      paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

      hqChart.ChartPaint.push(paint);
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

    this.LongShortData = [];

    if (param.HQChart.Period > 0)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
      param.HQChart.Draw();
      return false;
    }

    //请求数据
    wx.request({
      url: g_JSChartResource.Index.MarketLongShortApiUrl,
      data:
      {

      },
      method: 'POST',
      dataType: "json",
      async: true,
      success: function (recvData) {
        self.RecvData(recvData, param);
      }
    });

    return true;
  }

  this.RecvData = function (recvData, param) {
    if (recvData.data.data.length <= 0) return;

    var aryData = new Array();
    for (var i in recvData.data.data) {
      var item = recvData.data.data[i];
      var indexData = new SingleData();
      indexData.Date = item[0];
      indexData.Value = item[1];
      aryData.push(indexData);
    }

    var aryFittingData = param.HistoryData.GetFittingData(aryData);

    var bindData = new ChartData();
    bindData.Data = aryFittingData;
    bindData.Period = param.HQChart.Period;   //周期
    bindData.Right = param.HQChart.Right;     //复权

    this.LongShortData = bindData.GetValue();
    this.BindData(param.HQChart, param.WindowIndex, param.HistoryData);

    param.HQChart.UpdataDataoffset();           //更新数据偏移
    param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
    param.HQChart.Draw();

  }


  this.BindData = function (hqChart, windowIndex, hisData) {
    var paint = hqChart.GetChartPaint(windowIndex);

    if (paint.length != this.Index.length) return false;

    //paint[0].Data.Data=SWLData;
    paint[0].Data.Data = this.LongShortData;
    paint[0].NotSupportMessage = null;
    paint[1].Data.Data[0] = 8;
    paint[2].Data.Data[0] = 1;

    //指定[0,9]
    hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 9, Min: 0, Count: 3 };

    var titleIndex = windowIndex + 1;

    for (var i in paint) {
      hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, this.Index[i].Name, this.Index[i].LineColor);
      if (i > 0) hqChart.TitlePaint[titleIndex].Data[i].DataType = "StraightLine";
    }

    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

    if (hqChart.UpdateUICallback) hqChart.UpdateUICallback('MarketLongShortIndex', paint, { WindowIndex: windowIndex, HistoryData: hisData });  //通知上层回调
    return true;
  }

}

//市场择时
function MarketTimingIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('市场择时');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo("因子择时", null)
  );

  this.TimingData; //择时数据
  this.TitleColor = g_JSChartResource.FrameSplitTextColor

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = new ChartMACD();
      paint.Canvas = hqChart.Canvas;
      paint.Name = this.Name + "-" + i.toString();
      paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
      paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

      hqChart.ChartPaint.push(paint);
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

    this.LongShortData = [];

    if (param.HQChart.Period > 0)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
      param.HQChart.Draw();
      return false;
    }

    //请求数据
    wx.request({
      url: g_JSChartResource.Index.MarketLongShortApiUrl,
      data:
      {

      },
      method: 'POST',
      dataType: "json",
      async: true,
      success: function (recvData) {
        self.RecvData(recvData, param);
      }
    });

    return true;
  }

  this.RecvData = function (recvData, param) {
    if (recvData.data.data.length <= 0) return;

    var aryData = new Array();
    for (var i in recvData.data.data) {
      var item = recvData.data.data[i];
      var indexData = new SingleData();
      indexData.Date = item[0];
      indexData.Value = item[2];
      aryData.push(indexData);
    }

    var aryFittingData = param.HistoryData.GetFittingData(aryData);

    var bindData = new ChartData();
    bindData.Data = aryFittingData;
    bindData.Period = param.HQChart.Period;   //周期
    bindData.Right = param.HQChart.Right;     //复权

    this.TimingData = bindData.GetValue();
    this.BindData(param.HQChart, param.WindowIndex, param.HistoryData);

    param.HQChart.UpdataDataoffset();           //更新数据偏移
    param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
    param.HQChart.Draw();
  }


  this.BindData = function (hqChart, windowIndex, hisData) {
    var paint = hqChart.GetChartPaint(windowIndex);

    if (paint.length != this.Index.length) return false;

    //paint[0].Data.Data=SWLData;
    paint[0].Data.Data = this.TimingData;
    paint[0].NotSupportMessage = null;

    var titleIndex = windowIndex + 1;

    for (var i in paint) {
      hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, this.Index[i].Name, this.TitleColor);
      hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.THOUSANDS;
      hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 0;
    }

    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

    if (hqChart.UpdateUICallback) hqChart.UpdateUICallback('MarketTimingIndex', paint, { WindowIndex: windowIndex, HistoryData: hisData });  //通知上层回调
    return true;
  }
}

//市场关注度
function MarketAttentionIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('市场关注度');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo("市场关注度指数", null)
  );

  this.Data; //关注度数据
  this.TitleColor = g_JSChartResource.FrameSplitTextColor;
  this.ApiUrl = g_JSChartResource.Index.MarketAttentionApiUrl;

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = new ChartBar();   //柱子
      paint.Canvas = hqChart.Canvas;
      paint.Name = this.Name + "-" + i.toString();
      paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
      paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
      paint.UpBarColor = paint.DownBarColor = 'rgb(243,152,0)';

      hqChart.ChartPaint.push(paint);
    }
  }

  //调整框架
  this.SetFrame = function (hqChart, windowIndex, hisData) {
    hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 6, Min: 0, Count: 3 };
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

    if (param.HQChart.Period > 0)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
      param.HQChart.Draw();
      return false;
    }

    //请求数据
    wx.request({
      url: this.ApiUrl,
      data:
      {
        "symbol": param.HQChart.Symbol,
        "startdate": 20100101,
      },
      method: 'POST',
      dataType: "json",
      success: function (recvData) {
        self.RecvData(recvData.data, param);
      }
    });

    return true;
  }

  this.RecvData = function (recvData, param) {
    if (recvData.date.length < 0) return;

    var aryData = new Array();
    for (var i in recvData.date) {
      var indexData = new SingleData();
      indexData.Date = recvData.date[i];
      indexData.Value = recvData.value[i];
      aryData.push(indexData);
    }

    var aryFittingData = param.HistoryData.GetFittingData(aryData);

    var bindData = new ChartData();
    bindData.Data = aryFittingData;
    bindData.Period = param.HQChart.Period;   //周期
    bindData.Right = param.HQChart.Right;     //复权

    this.Data = bindData.GetValue();
    this.BindData(param.HQChart, param.WindowIndex, param.HistoryData);
    this.SetFrame(param.HQChart, param.WindowIndex, param.HistoryData);

    param.HQChart.UpdataDataoffset();           //更新数据偏移
    param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
    param.HQChart.Draw();

    // if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistoryData', this);
  }


  this.BindData = function (hqChart, windowIndex, hisData) {
    var paint = hqChart.GetChartPaint(windowIndex);

    if (paint.length != this.Index.length) return false;

    //paint[0].Data.Data=SWLData;
    paint[0].Data.Data = this.Data;
    paint[0].NotSupportMessage = null;

    var titleIndex = windowIndex + 1;

    for (var i in paint) {
      hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, this.Index[i].Name, this.TitleColor);
      hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.THOUSANDS;
      hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 0;
    }

    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();
    return true;
  }
}


/*
    行业,指数热度
*/
function MarketHeatIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('指数/行业热度');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo("热度指数", 5),
    new IndexInfo('MA', 10),
    new IndexInfo('MA', null)
  );

  this.Data; //关注度数据

  this.ApiUrl = g_JSChartResource.Index.MarketHeatApiUrl;

  this.Index[0].LineColor = g_JSChartResource.FrameSplitTextColor;
  this.Index[1].LineColor = g_JSChartResource.Index.LineColor[0];
  this.Index[2].LineColor = g_JSChartResource.Index.LineColor[1];

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = null;
      if (i == 0) {
        paint = new ChartMACD();   //柱子
      }
      else {
        paint = new ChartLine();
        paint.Color = this.Index[i].LineColor;
      }

      paint.Canvas = hqChart.Canvas;
      paint.Name = this.Name + "-" + i.toString();
      paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
      paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

      hqChart.ChartPaint.push(paint);
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

    if (param.HQChart.Period > 0)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
      param.HQChart.Draw();
      return false;
    }

    //请求数据
    wx.request({
      url: this.ApiUrl,
      data:
      {
        "symbol": param.HQChart.Symbol,
        "startdate": 20100101,
      },
      method: 'POST',
      dataType: "json",
      success: function (recvData) {
        self.RecvData(recvData.data, param);
      }
    });

    return true;
  }

  this.RecvData = function (recvData, param) {
    if (recvData.date.length < 0) return;

    var aryData = new Array();
    for (var i in recvData.date) {
      var indexData = new SingleData();
      indexData.Date = recvData.date[i];
      indexData.Value = recvData.value[i];
      aryData.push(indexData);
    }

    var aryFittingData = param.HistoryData.GetFittingData(aryData);

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

    paint[0].Data.Data = this.Data;
    paint[0].NotSupportMessage = null;

    var MA = HQIndexFormula.MA(this.Data, this.Index[0].Param);
    paint[1].Data.Data = MA;

    var MA2 = HQIndexFormula.MA(this.Data, this.Index[1].Param);
    paint[2].Data.Data = MA2;

    var titleIndex = windowIndex + 1;

    for (var i in paint) {
      var name = "";    //显示的名字特殊处理
      if (i == 0)
        name = hqChart.Name + this.Index[i].Name;
      else
        name = "MA" + this.Index[i - 1].Param;

      hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, name, this.Index[i].LineColor);
      hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.DEFAULT;
      hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 2;
    }

    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

    return true;
  }

}

//自定义指数热度
function CustonIndexHeatIndex() {
  this.newMethod = BaseIndex;   //派生
  this.newMethod('Market-Heat');
  delete this.newMethod;

  this.Index = new Array(
    new IndexInfo('区域', 3),
    new IndexInfo("热度指数", 10),
    new IndexInfo('MA', 5),
    new IndexInfo('MA', 10)
  );

  this.Data; //热度数据

  this.ApiUrl = g_JSChartResource.Index.CustomIndexHeatApiUrl;

  this.Index[1].LineColor = g_JSChartResource.Index.LineColor[1];
  this.Index[2].LineColor = g_JSChartResource.Index.LineColor[2];
  this.Index[3].LineColor = g_JSChartResource.Index.LineColor[3];

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = null;
      if (i == 0) {
        paint = new ChartStraightArea();
      }
      else {
        paint = new ChartLine();
        paint.Color = this.Index[i].LineColor;
      }

      paint.Canvas = hqChart.Canvas;
      paint.Name = this.Name + "-" + i.toString();
      paint.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
      paint.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

      hqChart.ChartPaint.push(paint);
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

    if (param.HQChart.Period > 0)   //周期数据
    {
      this.NotSupport(param.HQChart, param.WindowIndex, "不支持周期切换");
      param.HQChart.Draw();
      return false;
    }

    //请求数据
    wx.request({
      url: this.ApiUrl,
      data:
      {
        "stock": param.HQChart.CustomStock,
        "date": { "startdate": param.HQChart.QueryDate.Start, "enddate": param.HQChart.QueryDate.End },
        "day": [this.Index[0].Param, this.Index[1].Param],
      },
      method: 'POST',
      dataType: "json",
      success: function (recvData) {
        self.RecvData(recvData, param);
      }
    });

    return true;
  }

  this.RecvData = function (recvData, param) {
    let data = recvData.data;
    if (data.data == null || data.data.length < 0) return;

    //console.log(recvData.data);
    let aryData = new Array();
    for (let i in data.data) {
      let item = data.data[i];
      let indexData = new SingleData();
      indexData.Date = item[0];
      indexData.Value = item[1];
      aryData.push(indexData);
    }

    var aryFittingData = param.HistoryData.GetFittingData(aryData);

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
    let paint = hqChart.GetChartPaint(windowIndex);

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

    let MA = HQIndexFormula.MA(this.Data, this.Index[2].Param);
    paint[2].Data.Data = MA;

    let MA2 = HQIndexFormula.MA(this.Data, this.Index[3].Param);
    paint[3].Data.Data = MA2;

    //指定框架最大最小[0,1]
    hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };

    let titleIndex = windowIndex + 1;

    for (let i = 1; i < paint.length; ++i) {
      let name = this.Index[i].Name;    //显示的名字特殊处理
      if (name == 'MA') name = "MA" + this.Index[i].Param;

      hqChart.TitlePaint[titleIndex].Data[i] = new DynamicTitleData(paint[i].Data, name, this.Index[i].LineColor);
      hqChart.TitlePaint[titleIndex].Data[i].StringFormat = STRING_FORMAT_TYPE.DEFAULT;
      hqChart.TitlePaint[titleIndex].Data[i].FloatPrecision = 2;
    }


    hqChart.TitlePaint[titleIndex].Title = '热度' + '(' + this.Index[0].Param + ',' + this.Index[1].Param + ',' + this.Index[2].Param + ',' + this.Index[3].Param + ')';

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

  this.Create = function (hqChart, windowIndex) {
    for (var i in this.Index) {
      var paint = null;
      if (i == 0)
        paint = new ChartStraightArea();
      else if (i == 1)
        paint = new ChartLineMultiData();

      if (paint) {
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

    paint[0].Data.Data =
      [
        // { Value: 0, Value2: 0.2, Color: 'rgb(50,205,50)', Title: '安全区', TitleColor: 'rgb(245,255 ,250)' },
        // { Value: 0.2, Value2: 0.4, Color: 'rgb(255,140,0)', Title: '预警区', TitleColor: 'rgb(245,255 ,250)' },
        // { Value: 0.4, Value2: 1, Color: 'rgb(255,106,106)', Title: '警示区', TitleColor: 'rgb(245,255 ,250)' }
        { Value: 0, Value2: 0.2, Color: 'rgb(219,255,193)', Title: '安全区', TitleColor: 'rgb(66,192,99)' },
        { Value: 0.2, Value2: 0.4, Color: 'rgb(255,228,170)', Title: '预警区', TitleColor: 'rgb(255,124,3)' },
        { Value: 0.4, Value2: 1, Color: 'rgb(254,219,212)', Title: '警示区', TitleColor: 'rgb(255,0,0)' }
      ];

    paint[1].Data.Data = this.Data;

    //指定框架最大最小[0,1]
    hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 1, Min: 0, Count: 3 };
    hqChart.Frame.SubFrame[windowIndex].Frame.YSplitScale = [0.2,0.4];

    var titleIndex = windowIndex + 1;

    hqChart.TitlePaint[titleIndex].Data[1] = new DynamicTitleData(paint[1].Data, this.Index[1].Name, this.Index[1].LineColor);
    hqChart.TitlePaint[titleIndex].Data[1].DataType = "MultiReport";

    hqChart.TitlePaint[titleIndex].Title = this.FormatIndexTitle();

    return true;
  }
}

//是否是指数代码
function IsIndexSymbol(symbol) {
  var upperSymbol = symbol.toUpperCase();
  if (upperSymbol.indexOf('.SH') > 0) {
    upperSymbol = upperSymbol.replace('.SH', '');
    if (upperSymbol.charAt(0) == '0' && parseInt(upperSymbol) <= 3000) return true;

  }
  else if (upperSymbol.indexOf('.SZ') > 0) {
    upperSymbol = upperSymbol.replace('.SZ', '');
    if (upperSymbol.charAt(0) == '3' && upperSymbol.charAt(1) == '9') return true;
  }
  else if (upperSymbol.indexOf('.CI') > 0)  //自定义指数
  {
    return true;
  }

  return false;
}

//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommon:
    {
        JSCanvasElement: JSCanvasElement,
        JSChart: JSChart,
        Guid: Guid,
        IFrameSplitOperator: IFrameSplitOperator,
        ChartData: ChartData,
        DataPlus: DataPlus,
        KLineTooltipPaint: KLineTooltipPaint,
        MARKET_SUFFIX_NAME: MARKET_SUFFIX_NAME,
        JSCommonCoordinateData, JSCommonCoordinateData,
        FrameSplitKLineX, FrameSplitKLineX,
        JSCHART_EVENT_ID:JSCHART_EVENT_ID,
    },
};



