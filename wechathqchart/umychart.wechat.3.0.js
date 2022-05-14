/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    封装图形控件 (微信小程序版本)
*/

//日志
import { JSConsole } from "./umychart.console.wechat.js"

import { JSCommonElement_JSCanvasElement as JSCanvasElement } from "./umychart.element.wechart.js";

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
    JSCommon_JSCHART_EVENT_ID as JSCHART_EVENT_ID,
    JSCommon_PhoneDBClick as PhoneDBClick,
    JSCommon_OVERLAY_STATUS_ID as OVERLAY_STATUS_ID,
} from "./umychart.data.wechat.js";

import {
    JSCommon_JSKLineInfoMap as JSKLineInfoMap, 
    JSCommon_KLINE_INFO_TYPE as KLINE_INFO_TYPE, 
    JSCommon_JSMinuteInfoMap as JSMinuteInfoMap,
} from "./umychart.klineinfo.wechat.js";

import 
{ 
    JSCommonCoordinateData as JSCommonCoordinateData,
    JSCommonCoordinateData_MARKET_SUFFIX_NAME as MARKET_SUFFIX_NAME ,
    JSCommonCoordinateData_Global_FuturesTimeData as g_FuturesTimeData,
    JSCommonCoordinateData_Global_NYMEXTimeData as g_NYMEXTimeData,
    JSCommonCoordinateData_Global_COMEXTimeData as g_COMEXTimeData,
    JSCommonCoordinateData_Global_NYBOTTimeData as g_NYBOTTimeData,
    JSCommonCoordinateData_Global_LMETimeData as g_LMETimeData,
    JSCommonCoordinateData_Global_CBOTTimeData as g_CBOTTimeData,
    JSCommonCoordinateData_Global_TOCOMTimeData as g_TOCOMTimeData,
    JSCommonCoordinateData_Global_IPETimeData as g_IPETimeData,
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
    JSCommonChartPaint_ChartMACD as ChartMACD,
    JSCommonChartPaint_ChartSplashPaint as ChartSplashPaint,
    JSCommonChartPaint_ChartBackground as ChartBackground,
    JSCommonChartPaint_ChartMinuteVolumBar as ChartMinuteVolumBar,
    JSCommonChartPaint_ChartMultiHtmlDom as ChartMultiHtmlDom,
    JSCommonChartPaint_ChartLock as ChartLock,
    JSCommonChartPaint_ChartVolStick as ChartVolStick,
    JSCommonChartPaint_ChartBand as ChartBand,
    JSCommonChartPaint_ChartOverlayMinutePriceLine as ChartOverlayMinutePriceLine,
    JSCommonChartPaint_ChartLineMultiData as ChartLineMultiData,
    JSCommonChartPaint_ChartStraightLine as ChartStraightLine,
    JSCommonChartPaint_DepthChartCorssCursor as DepthChartCorssCursor,
    JSCommonChartPaint_ChartOrderbookDepth as ChartOrderbookDepth,
    JSCommonChartPaint_ChartMinutePriceLine as ChartMinutePriceLine,
    JSCommonChartPaint_ChartText as ChartText ,
    JSCommonChartPaint_ChartStraightArea as ChartStraightArea,
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
    JSCommonIndex_ScriptIndex as ScriptIndex,
    JSCommonIndex_APIScriptIndex as APIScriptIndex,
} from './umychart.index.wechat.js'

import{
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
    JSCommonResource_JSCHART_LANGUAGE_ID as JSCHART_LANGUAGE_ID,
    JSCommonResource_Global_JSChartLocalization as g_JSChartLocalization,
} from './umychart.resource.wechat.js'

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
    JSCommonSplit_FrameSplitXDepth as FrameSplitXDepth,

    JSCommonFormat_IChangeStringFormat as IChangeStringFormat,
    JSCommonFormat_HQPriceStringFormat as HQPriceStringFormat,
    JSCommonFormat_HQDateStringFormat as HQDateStringFormat,
    JSCommonFormat_HQMinuteTimeStringFormat as HQMinuteTimeStringFormat,
    JSCommonFormat_Global_DataFormat as g_DivTooltipDataForamt,
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



function JSChart(element) 
{
    this.JSChartContainer;              //画图控件
    this.CanvasElement = element;

    this.AddEventCallback = function (obj)   //事件回调  {event:事件id, callback:回调函数}
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.AddEventCallback) == 'function') 
        {
            JSConsole.Chart.Log('[JSChart:AddEventCallback] ', obj);
            this.JSChartContainer.AddEventCallback(obj);
        }
    }

    //设置语言 'EN', 'CN'
    this.SetLanguage=function(language)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.SetLanguage)=='function')
        {
            JSConsole.Chart.Log('[JSChart:SetLanguage] ', language);
            this.JSChartContainer.SetLanguage(language);
        }
    }

    this.OnSize = function (option) 
    {
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Width)) this.CanvasElement.Width=option.Width;
            if (IFrameSplitOperator.IsNumber(option.Height)) this.CanvasElement.Height=option.Height;
        }

        if (option && option.Redraw==false) return;

        if (this.JSChartContainer)
        {
            if (option && option.Type==1 && this.JSChartContainer.OnSize)
            {
                this.JSChartContainer.OnSize();
            }
            else
            {
                if (this.JSChartContainer.Frame) this.JSChartContainer.Frame.SetSizeChage(true);
                this.JSChartContainer.Draw();
            }
        }
    }

    this.SetChartBorder=function(chart, option)
    {
        if (!option.Border) return;
        
        var item=option.Border;
        if (IFrameSplitOperator.IsNumber(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
        else option.Border.Left=chart.Frame.ChartBorder.Left;
        if (IFrameSplitOperator.IsNumber(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
        else option.Border.Right=chart.Frame.ChartBorder.Right;
        if (IFrameSplitOperator.IsNumber(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
        else option.Border.Top=chart.Frame.ChartBorder.Top;
        if (IFrameSplitOperator.IsNumber(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
        else option.Border.Bottom=chart.Frame.ChartBorder.Bottom;

        if (item.AutoLeft) 
        {
            chart.Frame.AutoLeftBorder={ };
            if (IFrameSplitOperator.IsNumber(item.AutoLeft.Blank)) chart.Frame.AutoLeftBorder.Blank=item.AutoLeft.Blank;
            if (IFrameSplitOperator.IsNumber(item.AutoLeft.MinWidth)) chart.Frame.AutoLeftBorder.MinWidth=item.AutoLeft.MinWidth;
        }
        
        if (item.AutoRight) 
        {
            chart.Frame.AutoRightBorder={ };
            if (IFrameSplitOperator.IsNumber(item.AutoRight.Blank)) chart.Frame.AutoRightBorder.Blank=item.AutoRight.Blank;
            if (IFrameSplitOperator.IsNumber(item.AutoRight.MinWidth)) chart.Frame.AutoRightBorder.MinWidth=item.AutoRight.MinWidth;
        }
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
            if (option.KLine.RightSpaceCount >= 0) chart.RightSpaceCount = option.KLine.RightSpaceCount;
            if (option.KLine.DataWidth>=1) chart.KLineSize={ DataWidth:option.KLine.DataWidth };
            if (IFrameSplitOperator.IsNumber(option.KLine.RightFormula)) chart.RightFormula=option.KLine.RightFormula;
        }

        if (IFrameSplitOperator.IsString(option.SplashTitle)) chart.LoadDataSplashTitle = option.SplashTitle; //设置提示信息内容
        if (IFrameSplitOperator.IsBool(option.EnableZoomIndexWindow)) chart.EnableZoomIndexWindow=option.EnableZoomIndexWindow; //双击缩放附图
        if (!option.Windows || option.Windows.length <= 0) return null;

        if (option.Language) 
        {
            var value=g_JSChartLocalization.GetLanguageID(option.Language);
            if (IFrameSplitOperator.IsNumber(value)) chart.LanguageID=value;
        }

        if (option.SourceDatatLimit) chart.SetSourceDatatLimit(option.SourceDatatLimit);
        if (option.EnableZoomUpDown) chart.EnableZoomUpDown=option.EnableZoomUpDown;
        if (option.ZoomStepPixel>0) chart.ZoomStepPixel=option.ZoomStepPixel;
        if (IFrameSplitOperator.IsNumber(option.DrawMoveWaitTime)) chart.DrawMoveWaitTime=option.DrawMoveWaitTime;
        //创建子窗口
        chart.Create(option.Windows.length);

        this.SetChartBorder(chart, option);
    
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
            var item=option.CorssCursorInfo;
            if (!isNaN(option.CorssCursorInfo.Left)) chart.ChartCorssCursor.ShowTextMode.Left = option.CorssCursorInfo.Left;
            if (!isNaN(option.CorssCursorInfo.Right)) chart.ChartCorssCursor.ShowTextMode.Right = option.CorssCursorInfo.Right;
            if (!isNaN(option.CorssCursorInfo.Bottom)) chart.ChartCorssCursor.ShowTextMode.Bottom = option.CorssCursorInfo.Bottom;
            if (option.CorssCursorInfo.IsShowCorss === false) chart.ChartCorssCursor.IsShowCorss = option.CorssCursorInfo.IsShowCorss;
            if (option.CorssCursorInfo.IsShowClose == true) chart.ChartCorssCursor.IsShowClose = option.CorssCursorInfo.IsShowClose;    //Y轴显示收盘价
            if (IFrameSplitOperator.IsNumber(option.CorssCursorInfo.HPenType)) chart.ChartCorssCursor.HPenType = option.CorssCursorInfo.HPenType;
            if (option.CorssCursorInfo.VPenType > 0) chart.ChartCorssCursor.VPenType = option.CorssCursorInfo.VPenType;
            if (IFrameSplitOperator.IsNumber(item.DateFormatType)) chart.ChartCorssCursor.StringFormatX.DateFormatType=item.DateFormatType;
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
                if (item.IsShowYLine==false) chart.Frame.SubFrame[i].Frame.IsShowYLine=item.IsShowYLine;
                if (item.XMessageAlign == 'bottom') chart.Frame.SubFrame[i].Frame.XMessageAlign = item.XMessageAlign;
                if (item.IsShowTitle == false) chart.Frame.SubFrame[i].Frame.IsShowTitle = false;
                if (IFrameSplitOperator.IsBool(item.IsShowIndexTitle)) chart.Frame.SubFrame[i].Frame.IsShowTitle=item.IsShowIndexTitle;
                if (item.UpdateTitleUICallback && chart.Frame.SubFrame[i].Frame.TitlePaint) chart.Frame.SubFrame[i].Frame.TitlePaint.UpdateUICallback = item.UpdateTitleUICallback;
                if (item.IsShowLeftText === false || item.IsShowLeftText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[0] = item.IsShowLeftText;            //显示左边刻度
                if (item.IsShowRightText === false || item.IsShowRightText === true) chart.Frame.SubFrame[i].Frame.IsShowYText[1] = item.IsShowRightText;         //显示右边刻度 
                if (item.TopSpace >= 0) chart.Frame.SubFrame[i].Frame.ChartBorder.TopSpace = item.TopSpace;
                if (item.BottomSpace >= 0) chart.Frame.SubFrame[i].Frame.ChartBorder.BottomSpace = item.BottomSpace;
                if (item.Custom) chart.Frame.SubFrame[i].Frame.YSplitOperator.Custom = item.Custom;
                if (IFrameSplitOperator.IsNumber(item.SplitType)) chart.Frame.SubFrame[i].Frame.YSplitOperator.SplitType = item.SplitType;
                if (IFrameSplitOperator.IsNumber(item.FloatPrecision)) chart.Frame.SubFrame[i].Frame.YSplitOperator.FloatPrecision = item.FloatPrecision;   //强制指定小数位数(主图有效)
                if (IFrameSplitOperator.IsNumber(item.BorderLine)) chart.Frame.SubFrame[i].Frame.BorderLine=item.BorderLine;
                if (IFrameSplitOperator.IsNumber(item.YTextBaseline)) chart.Frame.SubFrame[i].Frame.YTextBaseline=item.YTextBaseline;
            }
        }

        if (option.KLine)
        {
            if (option.KLine.ShowKLine == false) chart.ChartPaint[0].IsShow = false;
            if (option.KLine.IsShowMaxMinPrice == false) chart.ChartPaint[0].IsShowMaxMinPrice = false;
        }

        if (option.KLineTitle) 
        {
            var item=option.KLineTitle;
            if (option.KLineTitle.IsShowName == false) chart.TitlePaint[0].IsShowName = false;
            if (option.KLineTitle.IsShowSettingInfo == false) chart.TitlePaint[0].IsShowSettingInfo = false;
            if (option.KLineTitle.IsShow == false) chart.TitlePaint[0].IsShow = false;
            if (option.KLineTitle.UpdateUICallback) chart.TitlePaint[0].UpdateUICallback = option.KLineTitle.UpdateUICallback
            if (option.KLineTitle.LineCount > 1) chart.TitlePaint[0].LineCount = option.KLineTitle.LineCount;
            if (IFrameSplitOperator.IsNumber(item.TextSpace)) chart.TitlePaint[0].TextSpace=item.TextSpace;
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

        for (var i=0; i<option.Windows.length; ++i) //创建子窗口的指标
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
                    if (item.TitleFont) indexInfo.TitleFont=item.TitleFont;
                    chart.WindowIndex[i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, args, indexInfo);    //脚本执行
                    if (item.StringFormat > 0) chart.WindowIndex[i].StringFormat = item.StringFormat;
                    if (item.FloatPrecision >= 0) chart.WindowIndex[i].FloatPrecision = item.FloatPrecision;
                }
            }

            if (item.Modify != null) chart.Frame.SubFrame[i].Frame.ModifyIndex = item.Modify;
            if (item.Change != null) chart.Frame.SubFrame[i].Frame.ChangeIndex = item.Change;
            if (item.IsDrawTitleBG==true)  chart.Frame.SubFrame[i].Frame.IsDrawTitleBG=item.IsDrawTitleBG;
            if (typeof (item.UpdateUICallback) == 'function') chart.WindowIndex[i].UpdateUICallback = item.UpdateUICallback;
            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[i].Frame.ChartBorder.TitleHeight = item.TitleHeight;
            if (item.IsShowIndexName == false) chart.Frame.SubFrame[i].Frame.IsShowIndexName = false;
            if (item.IndexParamSpace >= 0) chart.Frame.SubFrame[i].Frame.IndexParamSpace = item.IndexParamSpace;
            if (item.IndexTitleSpace >= 0) chart.Frame.SubFrame[i].Frame.IndexTitleSpace = item.IndexTitleSpace;
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
        if (option.EnableScrollUpDown==true) chart.EnableScrollUpDown=option.EnableScrollUpDown;

        if (option.Info && option.Info.length > 0) chart.SetMinuteInfo(option.Info, false);
        if (IFrameSplitOperator.IsString(option.SplashTitle)) chart.LoadDataSplashTitle = option.SplashTitle; //设置提示信息内容
        if (IFrameSplitOperator.IsBool(option.EnableZoomIndexWindow)) chart.EnableZoomIndexWindow=option.EnableZoomIndexWindow; //双击缩放附图
        if (IFrameSplitOperator.IsNumber(option.DrawMoveWaitTime)) chart.DrawMoveWaitTime=option.DrawMoveWaitTime;

        if (option.Language) 
        {
            var value=g_JSChartLocalization.GetLanguageID(option.Language);
            if (IFrameSplitOperator.IsNumber(value)) chart.LanguageID=value;
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
            if (IFrameSplitOperator.IsBool(option.CorssCursorInfo.IsFixXLastTime)) chart.ChartCorssCursor.IsFixXLastTime=option.CorssCursorInfo.IsFixXLastTime;
        }

        if (option.MinuteInfo) chart.CreateMinuteInfo(option.MinuteInfo);
        if (option.DayCount > 1) chart.DayCount = option.DayCount;

        this.SetChartBorder(chart, option);

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
                if (IFrameSplitOperator.IsNumber(item.BorderLine)) chart.Frame.SubFrame[i].Frame.BorderLine=item.BorderLine;
                if (IFrameSplitOperator.IsNumber(item.YTextBaseline)) chart.Frame.SubFrame[i].Frame.YTextBaseline=item.YTextBaseline;
                if (IFrameSplitOperator.IsBool(item.IsShowXLine)) chart.Frame.SubFrame[i].Frame.IsShowXLine = item.IsShowXLine;
                if (IFrameSplitOperator.IsBool(item.IsShowYLine)) chart.Frame.SubFrame[i].Frame.IsShowYLine=item.IsShowYLine;
            }

            chart.UpdateXShowText();
        }

        if (option.MinuteTitle) 
        {
            var item=option.MinuteTitle;
            if (option.MinuteTitle.IsShowName == false) chart.TitlePaint[0].IsShowName = false;
            if (option.MinuteTitle.IsShow == false) chart.TitlePaint[0].IsShow = false;
            if (option.MinuteTitle.UpdateUICallback) chart.TitlePaint[0].UpdateUICallback = option.MinuteTitle.UpdateUICallback
            if (option.MinuteTitle.LineCount > 1) chart.TitlePaint[0].LineCount = option.MinuteTitle.LineCount;
            if (IFrameSplitOperator.IsNumber(item.TextSpace)) chart.TitlePaint[0].TextSpace=item.TextSpace;
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
            if (option.MinuteLine.IsShowAveragePrice == false) 
            {
                chart.ChartPaint[1].IsShow = false;
                chart.TitlePaint[0].IsShowAveragePrice=false;   //标题栏均线也不显示
                for(var i in chart.ExtendChartPaint)
                {
                    var item=chart.ExtendChartPaint[i];
                    if (item.ClassName=="MinuteTooltipPaint") item.IsShowAveragePrice=false;
                }
            }

            if (option.MinuteLine.SplitType>0) chart.Frame.SubFrame[0].Frame.YSplitOperator.SplitType=option.MinuteLine.SplitType;
        }

        let scriptData = new JSCommonIndexScript.JSIndexScript();
        for (var i=0; i<option.Windows.length; ++i)   //分钟数据指标从第3个指标窗口设置
        {
            var index=i+2;
            var item = option.Windows[i];
            if (item.Script) 
            {
                chart.WindowIndex[2+i] = new ScriptIndex(item.Name, item.Script, item.Args, item);    //脚本执行
            }
            else if (item.API)  //使用API挂接指标数据 API:{ Name:指标名字, Script:指标脚本可以为空, Args:参数可以为空, Url:指标执行地址 }
            {
                var apiItem = item.API;
                chart.WindowIndex[2+i] = new APIScriptIndex(apiItem.Name, apiItem.Script, apiItem.Args, item);
            }
            else 
            {
                var indexItem = JSIndexMap.Get(item.Index);
                if (indexItem) 
                {
                    chart.WindowIndex[2+i] = indexItem.Create();       //创建子窗口的指标
                    chart.CreateWindowIndex(index);
                }
                else 
                {
                    let indexInfo = scriptData.Get(item.Index);
                    if (!indexInfo) continue;
                    var args = indexInfo.Args;
                    if (item.Args) args = item.Args;
                    if (item.Lock) indexInfo.Lock = item.Lock;
                    if (item.TitleFont) indexInfo.TitleFont=item.TitleFont;
                    chart.WindowIndex[2+i] = new ScriptIndex(indexInfo.Name, indexInfo.Script, args, indexInfo);    //脚本执行
                    if (item.StringFormat > 0) chart.WindowIndex[index].StringFormat = item.StringFormat;
                    if (item.FloatPrecision >= 0) chart.WindowIndex[index].FloatPrecision = item.FloatPrecision;
                }
            }

            if (!isNaN(item.TitleHeight)) chart.Frame.SubFrame[index].Frame.ChartBorder.TitleHeight = item.TitleHeight;   //指标标题高度
            if (IFrameSplitOperator.IsBool(item.IsDrawTitleBG))  chart.Frame.SubFrame[index].Frame.IsDrawTitleBG=item.IsDrawTitleBG;
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
        if (option.Type=="简单K线训练" || option.Type=="简单K线训练横屏")
        {
            var bHScreen=(option.Type=='简单K线训练横屏'? true:false);
            var chart=new KLineTrainSimpleChartContainer(this.CanvasElement,bHScreen);
        }
        else
        {
            var bHScreen = (option.Type == 'K线训练横屏' ? true : false);
            var chart = new KLineTrainChartContainer(this.CanvasElement, bHScreen);
        }

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

        this.SetChartBorder(chart, option);

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
            if (IFrameSplitOperator.IsBool(option.CorssCursorInfo.IsFixXLastTime)) chart.ChartCorssCursor.IsFixXLastTime=option.CorssCursorInfo.IsFixXLastTime;
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

        if (option.KLine)
        {
            if (option.KLine.ShowKLine == false) chart.ChartPaint[0].IsShow = false;
            if (option.KLine.IsShowMaxMinPrice == false) chart.ChartPaint[0].IsShowMaxMinPrice = false;
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

    //深度图
    this.CreateDepthChartContainer=function(option)
    {
        var chart=null;
        chart=new DepthChartContainer(this.CanvasElement);
        if (option.NetworkFilter) chart.NetworkFilter=option.NetworkFilter;

        if (option.EnableScrollUpDown==true) chart.EnableScrollUpDown=option.EnableScrollUpDown;
        if (IFrameSplitOperator.IsPlusNumber(option.MaxVolRate)) chart.MaxVolRate=option.MaxVolRate;
        if (option.ZoomStepPixel>0) chart.ZoomStepPixel=option.ZoomStepPixel;
        if (IFrameSplitOperator.IsString(option.SplashTitle)) chart.LoadDataSplashTitle = option.SplashTitle; //设置提示信息内容

        if (option.Language) 
        {
            var value=g_JSChartLocalization.GetLanguageID(option.Language);
            if (IFrameSplitOperator.IsNumber(value)) chart.LanguageID=value;
        }

        chart.Create(option.Listener);  

        if (option.Border)
        {
            if (IFrameSplitOperator.IsNumber(option.Border.Left)) chart.Frame.ChartBorder.Left=option.Border.Left;
            else option.Border.Left=chart.Frame.ChartBorder.Left;
            if (IFrameSplitOperator.IsNumber(option.Border.Right)) chart.Frame.ChartBorder.Right=option.Border.Right;
            else option.Border.Right=chart.Frame.ChartBorder.Right;
            if (IFrameSplitOperator.IsNumber(option.Border.Top)) chart.Frame.ChartBorder.Top=option.Border.Top;
            else option.Border.Top=chart.Frame.ChartBorder.Top;
            if (IFrameSplitOperator.IsNumber(option.Border.Bottom)) chart.Frame.ChartBorder.Bottom=option.Border.Bottom;
            else option.Border.Bottom=chart.Frame.ChartBorder.Bottom;
        }
        if (option.IsFullDraw == true) chart.IsFullDraw = option.IsFullDraw;
        
        if (option.CorssCursorTouchEnd===true) chart.CorssCursorTouchEnd = option.CorssCursorTouchEnd;

        if (option.CorssCursorInfo)
        {
            var item=option.CorssCursorInfo;
            if (IFrameSplitOperator.IsNumber(item.HPenType)) chart.ChartCorssCursor.HPenType=item.HPenType;
            if (IFrameSplitOperator.IsNumber(item.VPenType)) chart.ChartCorssCursor.VPenType=item.VPenType;
            if (IFrameSplitOperator.IsBool(item.IsShowTooltip)) chart.ChartCorssCursor.IsShowTooltip=item.IsShowTooltip;
        }
        
        if (option.Frame)
        {
            var item=option.Frame
            if (item.SplitCount) chart.Frame.YSplitOperator.SplitCount=item.SplitCount;
            if (IFrameSplitOperator.IsNumber(item.SplitType)) chart.Frame.YSplitOperator.SplitType=item.SplitType;
            if (IFrameSplitOperator.IsNumber(item.Height)) chart.Frame.Height = item.Height;
            if (IFrameSplitOperator.IsNumber(item.LineType)) chart.Frame.YSplitOperator.LineType=item.LineType;
            if (Array.isArray(item.IgnoreYValue)) chart.Frame.YSplitOperator.IgnoreYValue=item.IgnoreYValue;
            if (item.IsShowLeftText===false || item.IsShowLeftText===true) 
            {
                chart.Frame.IsShowYText[0]=item.IsShowLeftText;
                chart.Frame.YSplitOperator.IsShowLeftText=item.IsShowLeftText;            //显示左边刻度
            }
            if (item.IsShowRightText===false || item.IsShowRightText===true) 
            {
                chart.Frame.IsShowYText[1]=item.IsShowRightText;
                chart.Frame.YSplitOperator.IsShowRightText=item.IsShowRightText;          //显示右边刻度
            }

            if (item.IsShowXLine==false) chart.Frame.IsShowXLine=item.IsShowXLine;
            if (item.IsShowYLine==false) chart.Frame.IsShowYLine=item.IsShowYLine;

            if (IFrameSplitOperator.IsNumber(item.XSplitCount)) chart.Frame.XSplitOperator.SplitCount=item.XSplitCount;
        }

        return chart;
    }

    //根据option内容绘制图形
    this.SetOption = function (option) 
    {
        JSConsole.Chart.Log('[JSChart::SetOption]', option)
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
        case "简单K线训练":
        case "简单K线训练横屏":
            chart = this.CreateKLineTrainChartContainer(option);
            break;
        case "深度图":
            chart=this.CreateDepthChartContainer(option);
            break;
        default:
            return false;
        }

        if (!chart) return false;

        if (option.OnCreatedCallback) option.OnCreatedCallback(chart);

        //是否自动更新
        if (option.IsAutoUpdate == true || option.IsAutoUpate == true) chart.IsAutoUpdate = true;
        if (option.AutoUpdateFrequency > 0) chart.AutoUpdateFrequency = option.AutoUpdateFrequency;

        //注册事件
        for(var i in option.EventCallback)
        {
            var item=option.EventCallback[i];
            chart.AddEventCallback(item);
        }

        //设置股票代码
        if (!option.Symbol) return false;
        this.JSChartContainer = chart;

        chart.Draw();
        chart.ChangeSymbol(option.Symbol);

        this.JSChartContainer.Draw();

        if (!IFrameSplitOperator.IsBool(option.CheckLatestVerion) || !(option.CheckLatestVerion==false))
        {
            if (chart && this.CanvasElement.IsUniApp && typeof(chart.GetLatestVersion)=='function') chart.GetLatestVersion();
            //if (chart && typeof(chart.GetLatestVersion)=='function') chart.GetLatestVersion();
        }
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

    //增加一个指标窗口
    this.AddIndexWindow=function(indexName,option)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.AddIndexWindow)=='function')
            this.JSChartContainer.AddIndexWindow(indexName,option);
    }

    this.AddScriptIndexWindow=function(indexInfo, option)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.AddScriptIndexWindow)=='function')
            this.JSChartContainer.AddScriptIndexWindow(indexInfo,option);
    }

    this.AddAPIIndexWindow=function(indexData, option)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.AddAPIIndexWindow)=='function')
            this.JSChartContainer.AddAPIIndexWindow(indexData,option);
    }

    //删除一个指标窗口
    this.RemoveIndexWindow=function(id)
    {
        if (this.JSChartContainer && typeof(this.JSChartContainer.RemoveIndexWindow)=='function')
            this.JSChartContainer.RemoveIndexWindow(id);
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
            JSConsole.Chart.Log('[JSChart:ChangeIndexTemplate] ', option);
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
      JSConsole.Chart.Log("[JSChart::ForceLandscape] bForceLandscape=" + bForceLandscape);
      this.JSChartContainer.IsForceLandscape = bForceLandscape;
    }
  }

    //锁|解锁指标
    this.LockIndex = function (lockData) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.LockIndex) == 'function') 
        {
            JSConsole.Chart.Log('[JSChart:LockIndex] lockData', lockData);
            this.JSChartContainer.LockIndex(lockData);
        }
    }

    //历史分钟数据 更改日期
    this.ChangeTradeDate = function (tradeDate) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeTradeDate) == 'function') 
        {
            JSConsole.Chart.Log('[JSChart:ChangeTradeDate] date', tradeDate);
            this.JSChartContainer.ChangeTradeDate(tradeDate);
        }
    }

    //多日走势图
    this.ChangeDayCount = function (count) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChangeDayCount) == 'function') 
        {
            JSConsole.Chart.Log('[JSChart:ChangeDayCount] count', count);
            this.JSChartContainer.ChangeDayCount(count);
        }
    }

    this.StopAutoUpdate = function () 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.StopAutoUpdate) == 'function') {
            JSConsole.Chart.Log("[JSChart::StopAutoUpdate] Stop.");
            this.JSChartContainer.StopAutoUpdate();
        }
    }
    this.StopAutoUpdata = this.StopAutoUpdate;

    this.ChartDestory=function()
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.ChartDestory) == 'function') {
            JSConsole.Chart.Log("[JSChart::ChartDestory]");
            this.JSChartContainer.ChartDestory();
        }
    }

    this.OnTouchStart = function (e) 
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchstart(e);
    }

    this.OnTouchMove = function (e) 
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchmove(e);
    }

    this.OnTouchEnd = function (e) 
    {
        if (this.JSChartContainer) this.JSChartContainer.ontouchend(e);
    }

    this.SaveToImage = function (callback) 
    {
        if (this.JSChartContainer && typeof (this.JSChartContainer.SaveToImage) == 'function')
            this.JSChartContainer.SaveToImage(callback);
    }

    this.EnableSplashScreen=function(option)
    {
        if(this.JSChartContainer && typeof(this.JSChartContainer.EnableSplashScreen)=='function')
            this.JSChartContainer.EnableSplashScreen(option);
    }

}

JSChart.LastVersion=null;   //最新的版本号

//初始化
JSChart.Init = function (uielement) {
  JSConsole.Chart.Log('[JSChart.Init] uielement', uielement);
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

JSChart.GetMinuteTimeStringData=function()
{
    return JSCommonCoordinateData.MinuteTimeStringData;
}

JSChart.GetMinuteCoordinateData=function()
{
    return JSCommonCoordinateData.MinuteCoordinateData;
}

JSChart.GetKLineZoom = function () //K线缩放配置
{
    return ZOOM_SEED;
}

JSChart.SetUSATimeType=function(type)    //设置 0=标准时间 1=夏令时间 3=美国时间
{
    g_NYMEXTimeData.TimeType=type;
    g_COMEXTimeData.TimeType=type;
    g_NYBOTTimeData.TimeType=type;
    g_CBOTTimeData.TimeType=type;
}

JSChart.GetChinaFuturesTimeData=function()  //获取国内期货交易时间配置
{
    return g_FuturesTimeData;
}

JSChart.GetInternalTimeData=function(name)  //内置品种交易时间
{
    switch(name)
    {
        case "NYMEXTimeData":   //纽约商业交易所
            return g_NYMEXTimeData; 
        case "COMEXTimeData":   //纽约商品交易所
            return g_COMEXTimeData;
        case "NYBOTTimeData":   //纽约期货交易所
            return g_NYBOTTimeData;
        case "CBOTTimeData":    //芝加哥期货交易所
            return g_CBOTTimeData;
        case "LMETimeData":     //伦敦金属交易所
            return g_LMETimeData;
        case "FuturesTimeData": //国内期货
            return g_FuturesTimeData;
        case "TOCOMTimeData":   //东京商品交易所（TOCOM
            return g_TOCOMTimeData;
        case "IPETimeData":
            return g_IPETimeData;   //美国洲际交易所
        default:
            return null;
    }
}

JSChart.GetDivTooltipDataFormat=function()  //div tooltip数据格式化
{
    return g_DivTooltipDataForamt;
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
    this.LoadDataSplashTitle = '数据加载中';
    this.Canvas = uielement.GetContext("2d");         //画布
    this.UIElement = uielement;
    this.MouseDrag;
    this.DragMode = 1;                                //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
    this.PhoneTouchInfo;                              //手机手势信息 {Start:起始点, End:结束点}
    this.EnableScrollUpDown=false;                    //是否可以上下滚动图形(手机端才有)

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
    this.NetworkFilter;          //网络请求回调 function(data, callback);
    this.IsDestroy=false;        //是否已经销毁了

    //手势移动 十字光标
    this.LastMovePoint;
    this.DrawMoveTimer=null;
    this.DrawMoveWaitTime=60;

    //双击缩放附图窗口
    this.EnableZoomIndexWindow=false;               //是否支持双击缩放附图窗口
    this.PhoneDBClick=new PhoneDBClick();

    this.ChartDestory=function()    //销毁
    {
        this.IsDestroy=true;
        this.StopAutoUpdate();

        if (this.GetLatestVersionTimer!=null) 
        {
            clearTimeout(this.GetLatestVersionTimer);
            this.GetLatestVersionTimer=null;
        }
    }

    this.GetLatestVersionTimer=null;    //获取最新版本
    this.GetLatestVersion=function()
    {
        if (this.GetLatestVersionTimer!=null)
        {
            clearTimeout(this.GetLatestVersionTimer);
            this.GetLatestVersionTimer=null;
        }

        if (JSChart.LastVersion!=null) return;  //只请求一次
        
        var roundeTime=Math.floor(Math.random()*50); 
        var waittimer=1000*60*3+(roundeTime*1000);
        var value="aHR0cHM6Ly9ocWNoYXJ0LnplYWxpbmsuY29tL2FwaS9HZXRWZXJzaW9u";
        JSConsole.Chart.Log("[JSChartContainer::GetLatestVersion] wait for get hqchart latest version. ",waittimer);

        this.GetLatestVersionTimer = setTimeout(()=>
        {
            var width=0, height=0;
            if (this.Frame && this.Frame.ChartBorder)
            {
                width=this.Frame.ChartBorder.GetChartWidth();
                height=this.Frame.ChartBorder.GetChartHeight();
            }
            
            var url=`${atob(value)}?width=${width}&height=${height}&type=uniapp`;
            if (JSChart.LastVersion!=null) return;  //只请求一次

            wx.request({
                url: url,
                method:"get",
                dataType: "json",
                async:true,
                success:function(data)
                {
                    JSChart.LastVersion=data.data;
                    //TODO:判断是否是最新版本
                },
                fail:function(request, textStatus, errorThrown)
                {
                    JSConsole.Chart.Log("[JSChartContainer::GetLatestVersion] Get HQChart latest version failed.", request);
                }
            });

        }, waittimer);
    }

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

    this.GetEventCallback=this.GetEvent;
    
    this.GetIndexEvent = function () { return this.GetEvent(JSCHART_EVENT_ID.RECV_INDEX_DATA); }    //接收指标数据
    this.GetBarrageEvent=function() { return this.GetEvent(JSCHART_EVENT_ID.BARRAGE_PLAY_END);}     //获取弹幕事件
    this.GetEnableSplashEvent=function() { return this.GetEvent(JSCHART_EVENT_ID.ON_ENABLE_SPLASH_DRAW); }  //开启/关闭文字提示信息事件

    //判断是单个手指
    this.IsPhoneDragging = function (e) 
    {
        // JSConsole.Chart.Log(e);
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

    this.IsSingleTouch=function(e)  //是否是单点触屏
    {
        var touchCount=e.touches.length;
        return touchCount==1;
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

    this.ClearDrawMoveTimer=function()
    {
        if (this.DrawMoveTimer != null) 
        {
            clearTimeout(this.DrawMoveTimer);
            this.DrawMoveTimer=null;
        }
    }

    this.ClearTouchTimer=function()
    {
        if (this.TouchTimer != null) 
        {
            clearTimeout(this.TouchTimer);
            this.TouchTimer=null;
        }
    }

    //手机拖拽
    this.ontouchstart = function (e) 
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var jsChart = this;
        //if (jsChart.DragMode == 0) return;

        jsChart.IsOnTouch=true;
        jsChart.PhonePinch = null;

        if (this.IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock || this.TryClickIndexTitle) 
            {
                var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock && jsChart.TryClickLock(x, y)) return;
                if (jsChart.TryClickIndexTitle && jsChart.TryClickIndexTitle(x, y)) return;
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

            this.PhoneTouchInfo={ Start:{X:touches[0].clientX, Y:touches[0].clientY }, End:{ X:touches[0].clientX, Y:touches[0].clientY } };

            if (this.EnableZoomIndexWindow)
            {
                this.PhoneDBClick.AddTouchStart(touches[0].clientX, touches[0].clientY, Date.now());
                JSConsole.Chart.Log("[JSChartContainer::OnTouchStart] PhoneDBClick ", this.PhoneDBClick);
            }

            if (jsChart.IsClickShowCorssCursor) 
            {
                var x = drag.Click.X;
                var y = drag.Click.Y;
                jsChart.OnMouseMove(x, y, e,true);
            }

            this.TouchEvent({ EventID:JSCHART_EVENT_ID.ON_PHONE_TOUCH, FunctionName:"OnTouchStart"}, e);
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
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var jsChart = this;
        var touches = this.GetToucheData(e, jsChart.IsForceLandscape);

        if (this.IsPhoneDragging(e)) 
        {
            var drag = jsChart.MouseDrag;
            if (drag == null) 
            {
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                this.LastMovePoint={ X:x, Y:y };
                if (this.DrawMoveTimer) return;
                this.DrawMoveTimer=setTimeout(()=>
                {
                    if (!this.LastMovePoint) return;
                    this.OnMouseMove(this.LastMovePoint.X, this.LastMovePoint.Y, e);
                    this.DrawMoveTimer=null;
                }, this.DrawMoveWaitTime);

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

            if (this.PhoneTouchInfo)
            {
                this.PhoneTouchInfo.End.X=touches[0].clientX;
                this.PhoneTouchInfo.End.Y=touches[0].clientY;
            }
        }
        else if (this.IsPhonePinching(e))
        {
            var phonePinch = jsChart.PhonePinch;
            if (!phonePinch) return;

            if (this.EnableZoomUpDown && this.EnableZoomUpDown.Touch===false) return;

            var yHeight = Math.abs(touches[0].pageY - touches[1].pageY);
            var yLastHeight = Math.abs(phonePinch.Last.Y - phonePinch.Last.Y2);
            var yStep = yHeight - yLastHeight;
            var xHeight = Math.abs(touches[0].pageX - touches[1].pageX);
            var xLastHeight = Math.abs(phonePinch.Last.X - phonePinch.Last.X2);
            var xStep = xHeight - xLastHeight;
            var minStep=this.ZoomStepPixel;
            if (Math.abs(yStep) < minStep && Math.abs(xStep) < minStep) return;

            var step = yStep;
            if (Math.abs(yStep) < minStep) step = xStep;

            if (step > 0)    //放大
            {
                var cursorIndex = { IsLockRight:this.IsZoomLockRight };
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
                var cursorIndex = { IsLockRight:this.IsZoomLockRight };
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
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        if (this.EnableZoomIndexWindow)
        {
            var time=Date.now();
            this.PhoneDBClick.AddTouchEnd(time);
            if (this.PhoneDBClick.IsVaildDBClick())
            {
                this.OnTouchDBClick(this.PhoneDBClick.Start);
                this.PhoneDBClick.Clear();
            }
        }

        this.IsOnTouch = false;
        this.LastMovePoint=null;
        JSConsole.Chart.Log('[JSChartContainer:ontouchend] IsOnTouch=' + this.IsOnTouch +' LastDrawStatus=' + this.LastDrawStatus);
        this.ClearDrawMoveTimer();
        this.ClearTouchTimer();
        this.TouchEvent({ EventID:JSCHART_EVENT_ID.ON_PHONE_TOUCH, FunctionName:"OnTouchEnd"}, e);
        this.Draw();//手放开 重新绘制  
    }

    this.OnTouchDBClick=function(points)
    {
        var x=points[0].X, y=points[0].Y;
        JSConsole.Chart.Log('[JSChartContainer:OnTouchDBClick] Phone dbclick', x, y);

        var frameId=this.Frame.PtInFrame(x,y);
        JSConsole.Chart.Log("[JSChartContainer::OnTouchDBClick] frameId",frameId);
        if (frameId>=this.Frame.ZoomStartWindowIndex)
        {
            if (this.ZoomIndexWindow(frameId, {X:x, Y:y}))
            {
                this.Frame.SetSizeChage(true);
                this.Draw();
                return true;
            }
        }

        return false;
    }

    this.ZoomIndexWindow=function(frameID, option)   //最大化/最小化指标窗口 
    {
        if (frameID<0 || frameID>=this.Frame.SubFrame.length) return false;

        return this.Frame.ZoomIndexWindow(frameID, option);
    }

    this.TouchEvent=function(obj,e)
    {
        var eventID=obj.EventID;
        var event=this.GetEvent(eventID);
        if (!event || !event.Callback) return false;

        var drag=this.PhoneTouchInfo
        if (!drag || !drag.Start || !drag.End ) return false;

        var clientX=drag.End.X;
        var clientY=drag.End.Y;
        var x=drag.End.X;
        var y=drag.End.Y;

        var data= 
        { 
            X:clientX, Y:clientY, FrameID:-1, FunctionName:obj.FunctionName,
            Drag:
            { 
                Start:{ X:drag.Start.X, Y:drag.Start.Y }, 
                End:{ X:drag.End.X, Y:drag.End.Y } 
            } 
        };

        var isInClient=false;
        var rtClient = new Rect(this.Frame.ChartBorder.GetLeft(), this.Frame.ChartBorder.GetTop(), this.Frame.ChartBorder.GetWidth(), this.Frame.ChartBorder.GetHeight());
        isInClient = rtClient.IsPointIn(x, y);

        if (isInClient)
        {
            if (this.Frame && this.Frame.IsHScreen)
            {
                var yValueExtend={};
                var yValue=this.Frame.GetYData(x,yValueExtend);

                if (IFrameSplitOperator.IsNumber(yValueExtend.FrameID) && yValueExtend.FrameID>=0)
                {
                    var xValue=this.Frame.GetXData(y);
                    data.FrameID=yValueExtend.FrameID;
                    data.Data={ X:xValue, Y:yValue } ;
                }
            }
            else
            {
                var yValueExtend={};
                var yValue=this.Frame.GetYData(y,yValueExtend);
    
                if (IFrameSplitOperator.IsNumber(yValueExtend.FrameID) && yValueExtend.FrameID>=0)
                {
                    var xValue=this.Frame.GetXData(x);
                    data.FrameID=yValueExtend.FrameID;
                    data.Data={ X:xValue, Y:yValue } ;
                }
            }
        }

        event.Callback(event, data, this);
        return true;
    }

    this.FullDraw=function(drawType)
    {
        var self = this;
        this.Canvas.clearRect(0, 0, this.UIElement.Width, this.UIElement.Height);

        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash)  //动画
        {
            this.Frame.ClearCoordinateText();
            this.Frame.Draw({ IsEnableSplash:this.ChartSplashPaint.IsEnableSplash});  //框架 
            this.ChartSplashPaint.Draw();
            this.LastDrawStatus = 'FullDraw';
            this.Canvas.draw();
            return;
        }

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
        this.Frame.DrawLogo();
    
        var bOnTouchDraw=drawType == 'DrawDynamicInfo' || this.IsOnTouch;
        if (bOnTouchDraw)
        {
            if (self.ChartCorssCursor) //十字光标
            {
                self.ChartCorssCursor.LastPoint = self.LastPoint;
                self.ChartCorssCursor.CursorIndex = self.CursorIndex;
                self.ChartCorssCursor.Draw();
            }
        }

        var eventTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_TITLE_DRAW);
        var eventIndexTitleDraw = this.GetEvent(JSCHART_EVENT_ID.ON_INDEXTITLE_DRAW);
        for (var i in self.TitlePaint) //标题
        {
            var item = self.TitlePaint[i];
            if (!item.IsDynamic) continue;

            if (item.ClassName == 'DynamicChartTitlePainting') item.OnDrawEvent = eventIndexTitleDraw
            else item.OnDrawEvent = eventTitleDraw;

            item.CursorIndex = self.CursorIndex;
            if (!bOnTouchDraw)  //手势离开屏幕 去最后一个数据
            {
                if (this.ChartPaint[0] && this.ChartPaint[0].Data && this.ChartPaint[0].Data.Data)
                {
                    var lastDataIndex=this.GetLastDataIndex();
                    if (IFrameSplitOperator.IsNumber(lastDataIndex)) item.CursorIndex=lastDataIndex;
                }
            }

            if (item.FullDraw) item.FullDraw();
        }

        if (bOnTouchDraw)
        {
            for (var i in this.ExtendChartPaint)    //动态扩展图形   在动态标题以后画
            {
                var item = this.ExtendChartPaint[i];
                if (item.IsCallbackDraw) continue;
                item.LatestPoint={ X:this.LastPoint.X, Y:this.LastPoint.Y };
                if (item.IsDynamic && item.DrawAfterTitle) item.Draw();
            }
        }

        this.LastDrawStatus = 'FullDraw';
        this.Canvas.draw(false);
    }

    //获取最后一个数据的相对于当前屏的索引
    this.GetLastDataIndex=function()
    {
        if (!this.ChartPaint[0] || !this.ChartPaint[0].Data || !this.ChartPaint[0].Data.Data) return null;

        var hisData=this.ChartPaint[0].Data;
        var dataCount=hisData.Data.length;
        if (dataCount>0) return (dataCount-1)-hisData.DataOffset;

        return null;
    }

    this.Draw = function () 
    {
        if (this.IsDestroy) return;
        
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
        this.Frame.DrawLogo();

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
            //JSConsole.Chart.Log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw and save snapshot. DrawID=' + this.LastDrawID + ' .....');
            var lastDrawID=this.LastDrawID;
            this.Canvas.draw(false, function () 
            {
                //if (lastDrawID == self.LastDrawID) 
                self.Frame.Snapshot(self.SnapshotType);  //只保存最后一次的截图
                //JSConsole.Chart.Log('[JSChartContainer:Draw] finish. DrawID('+ lastDrawID +','+ self.LastDrawID +')');
            });
        }

        //JSConsole.Chart.Log('[JSChartContainer:Draw][ID=' + this.UIElement.ID + '] draw dynamic info ......');
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
                //JSConsole.Chart.Log("[DrawDynamicInfo] ScreenImagePath ", this.Frame.ScreenImagePath);
                if (!this.TempImage) this.TempImage= self.Canvas.DomNode.createImage();  //新版本的必须要装成image类 比较坑
                this.TempImage.src = this.Frame.ScreenImagePath;
                //JSConsole.Chart.Log("[DrawDynamicInfo] tempImage ", this.TempImage);
                this.TempImage.onload=()=>
                {
                    //JSConsole.Chart.Log("[DrawDynamicInfo] onload ", self.TempImage);
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
        JSConsole.Chart.Log('[JSChartContainer:DrawDynamicChart][ID=' + this.UIElement.ID + '] draw .....');
        self.Canvas.draw(bReserve, function () {
            JSConsole.Chart.Log('[JSChartContainer:DrawDynamicChart] finish.');
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
        JSConsole.Chart.Log('[JSChartContainer::StartAnimation] ', this.UIElement.WebGLCanvas);
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
        if ( this.ClassName=="KLineChartContainer" || this.ClassName=="KLineChartHScreenContainer" )
        {
            if (lastCursorIndex == this.CursorIndex && Math.abs(lastY - y) < 1) return;  //一个一个数据移动
        }
        else
        {
            if (parseInt(lastCursorIndex - 0.5) == parseInt(this.CursorIndex - 0.5) && Math.abs(lastY - y) < 1) return;  //一个一个数据移动
        }
        
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


    this.OnDoubleClick = function (x, y, e) 
    {
        //JSConsole.Chart.Log(e);
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

    this.ResetFrameXYSplit = function () 
    {
        if (typeof (this.Frame.ResetXYSplit) == 'function') this.Frame.ResetXYSplit();
    }

    this.UpdateFrameMaxMin = function () 
    {
        var frameMaxMinData = new Array();
        var chartPaint = new Array();

        for (var i in this.ChartPaint) 
        {
            var item=this.ChartPaint[i];
            if (item.IsShow==false) continue;   //隐藏的图形不计算
            chartPaint.push(item);
        }
        for (var i in this.OverlayChartPaint) 
        {
            chartPaint.push(this.OverlayChartPaint[i]);
        }

        for (var i in chartPaint) 
        {
            var paint = chartPaint[i];
            var range = paint.GetMaxMin();
            if (range == null || range.Max == null || range.Min == null) continue;
            var frameItem = null;
            for (var j in frameMaxMinData) 
            {
                if (frameMaxMinData[j].Frame == paint.ChartFrame) 
                {
                    frameItem = frameMaxMinData[j];
                    break;
                }
            }

            if (frameItem) 
            {
                if (frameItem.Range.Max < range.Max) frameItem.Range.Max = range.Max;
                if (frameItem.Range.Min > range.Min) frameItem.Range.Min = range.Min;
            }
            else 
            {
                frameItem = {};
                frameItem.Frame = paint.ChartFrame;
                frameItem.Range = range;
                frameMaxMinData.push(frameItem);
            }
        }

        for (var i in frameMaxMinData) 
        {
            var item = frameMaxMinData[i];
            if (!item.Frame || !item.Range) continue;
            if (item.Range.Max == null || item.Range.Min == null) continue;
            if (item.Frame.YSpecificMaxMin) 
            {
                item.Frame.HorizontalMax = item.Frame.YSpecificMaxMin.Max;
                item.Frame.HorizontalMin = item.Frame.YSpecificMaxMin.Min;
            }
            else 
            {
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

    //JSConsole.Chart.Log('x='+ x +' date='+data.Data[data.DataOffset+index].Date);
    return data.DataOffset + index;
  }

    this.SaveToImage = function (callback) 
    {
        let width = this.UIElement.Width;
        let height = this.UIElement.Height;;
        JSConsole.Chart.Log('[JSChartContainer::SaveToImage]', this.UIElement);

        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            canvasId: this.UIElement.ID,
            success: function (res) 
            {
                let data = { ImagePath: res.tempFilePath, Width: width, Height: height };
                if (typeof (callback) == 'function') callback(data);
            }
        })
    }

    //全屏提示信息 { Title:提示信息, Draw:false/true 是否立即重绘, }
    this.EnableSplashScreen=function(option)
    {
        if (!this.ChartSplashPaint) return;
        if (!option) return;

        if (IFrameSplitOperator.IsString(option.Title)) this.ChartSplashPaint.SetTitle(option.Title);
        this.ChartSplashPaint.EnableSplash(true);

        if (option.Draw===false) return;
        this.Draw();
    }

    this.AddNewSubFrame=function(option)
    {
        var index=this.Frame.SubFrame.length;
        var subFrame=this.CreateSubFrameItem(index);
        this.Frame.SubFrame[index]=subFrame;
        var titlePaint=new DynamicChartTitlePainting();
        titlePaint.Frame=this.Frame.SubFrame[index].Frame;
        titlePaint.Canvas=this.Canvas;
        titlePaint.LanguageID=this.LanguageID;
        titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        this.TitlePaint[index+1]=titlePaint;

        if (option)
        {
            if (option.Window)
            {
                var item=option.Window;
                if (item.IsDrawTitleBG==true)  subFrame.Frame.IsDrawTitleBG=item.IsDrawTitleBG;
            }
            
            if (IFrameSplitOperator.IsNumber(option.SplitCount)) subFrame.Frame.YSplitOperator.SplitCount=option.SplitCount;
            if (IFrameSplitOperator.IsNumber(option.TitleHeight)) subFrame.Frame.ChartBorder.TitleHeight=option.TitleHeight;
            if (IFrameSplitOperator.IsBool(option.IsShowTitleArraw)) subFrame.Frame.IsShowTitleArraw=option.IsShowTitleArraw;
            if (IFrameSplitOperator.IsBool(option.IsShowIndexName)) subFrame.Frame.IsShowIndexName=option.IsShowIndexName;
            if (IFrameSplitOperator.IsBool(option.IsShowOverlayIndexName)) subFrame.Frame.IsShowOverlayIndexName=option.IsShowOverlayIndexName;
            if (IFrameSplitOperator.IsNumber(option.IndexParamSpace)) subFrame.Frame.IndexParamSpace=option.IndexParamSpace;
            if (IFrameSplitOperator.IsNumber(option.IndexTitleSpace)) subFrame.Frame.IndexTitleSpace=option.IndexTitleSpace;
            if (IFrameSplitOperator.IsBool(option.IsShowXLine)) subFrame.Frame.IsShowXLine=option.IsShowXLine;
            if (IFrameSplitOperator.IsBool(option.IsShowYLine)) subFrame.Frame.IsShowYLine=option.IsShowYLine;
            if (IFrameSplitOperator.IsBool(option.IsShowIndexTitle)) subFrame.Frame.IsShowTitle=option.IsShowIndexTitle;

            if (IFrameSplitOperator.IsBool(option.IsShowLeftText)) subFrame.Frame.IsShowYText[0] = option.IsShowLeftText;         //显示左边刻度
            if (IFrameSplitOperator.IsBool(option.IsShowRightText)) subFrame.Frame.IsShowYText[1] = option.IsShowRightText;       //显示右边刻度 
        }

        //最后一个显示X轴坐标
        for(var i=0;i<this.Frame.SubFrame.length;++i)
        {
            var item=this.Frame.SubFrame[i].Frame;
            if (i==this.Frame.SubFrame.length-1) item.XSplitOperator.ShowText=true;
            else item.XSplitOperator.ShowText=false;
        }

        this.UpdataDataoffset();        //更新数据偏移  
        this.Frame.SetSizeChage(true);
        if (this.UpdateXShowText) this.UpdateXShowText();
        this.ResetFrameXYSplit();
        this.UpdateFrameMaxMin();          //调整坐标最大 最小值
        this.Draw();

        return index;
    }

     //增加一个指标窗口
    this.AddIndexWindow=function(indexName,option)
    {
        //查找系统指标
        let scriptData = new JSCommonIndexScript.JSIndexScript();
        let indexInfo = scriptData.Get(indexName);
        if (!indexInfo) return;

        var index=this.AddNewSubFrame(option);

        var indexData = 
        { 
            Name:indexInfo.Name, Script:indexInfo.Script, Args: indexInfo.Args, ID:indexName ,
            //扩展属性 可以是空
            KLineType:indexInfo.KLineType,  YSpecificMaxMin:indexInfo.YSpecificMaxMin,  YSplitScale:indexInfo.YSplitScale,
            FloatPrecision:indexInfo.FloatPrecision, Condition:indexInfo.Condition,StringFormat:indexInfo.StringFormat,
            OutName:indexInfo.OutName
        };

        if (option)
        {
            if (option.FloatPrecision>=0) indexData.FloatPrecision=option.FloatPrecision;
            if (option.StringFormat>0) indexData.StringFormat=option.StringFormat;
            if (option.Args) indexData.Args=option.Args;
        }

        this.WindowIndex[index] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args,indexData);    //脚本执行
        if (this.ClassName=="MinuteChartContainer" || this.ClassName=="MinuteChartHScreenContainer")
            var bindData=this.SourceData;
        else 
            var bindData=this.ChartPaint[0].Data;

        this.BindIndexData(index,bindData);     //执行脚本
    }

    //增加一个自定义指标窗口
    this.AddScriptIndexWindow=function(indexInfo, option)
    {
        if (!indexInfo || !indexInfo.Script || !indexInfo.Name) return;

        var index=this.AddNewSubFrame(option);

        this.WindowIndex[index] =  new ScriptIndex(indexInfo.Name, indexInfo.Script, indexInfo.Args, indexInfo)
        if (this.ClassName=="MinuteChartContainer" || this.ClassName=="MinuteChartHScreenContainer")
            var bindData=this.SourceData;
        else 
            var bindData=this.ChartPaint[0].Data;

        this.BindIndexData(index,bindData);     //执行脚本
    }

    //增加一个远程指标窗口
    this.AddAPIIndexWindow=function(indexInfo, option)
    {
        if (!indexInfo.API) return;
       
        var apiItem = indexInfo.API;
        var index=this.AddNewSubFrame(option);
        this.WindowIndex[index] = new APIScriptIndex(apiItem.Name, apiItem.Script, apiItem.Args, indexInfo);

        if (this.ClassName=="MinuteChartContainer" || this.ClassName=="MinuteChartHScreenContainer")
            var bindData=this.SourceData;
        else 
            var bindData=this.ChartPaint[0].Data;

        this.BindIndexData(index,bindData);     //执行脚本
    }

    this.SetLanguage=function(language)
    {
        var languageID=g_JSChartLocalization.GetLanguageID(language);
        if (!IFrameSplitOperator.IsNumber(languageID))
        {
            console.warn(`[JSChartContainer::SetLanguage] language=${language} error`);
            return;
        }

        if (this.LanguageID==languageID) return;
        
        this.LanguageID=languageID;
        if (this.ChartCorssCursor && this.ChartCorssCursor.StringFormatY) this.ChartCorssCursor.StringFormatY.LanguageID=this.LanguageID;

        for(var i=0; i<this.TitlePaint.length; ++i)
        {
            var item=this.TitlePaint[i];
            if (item) item.LanguageID=this.LanguageID;
        }

        for(var i=0; i<this.ExtendChartPaint.length; ++i) //tooltip 等扩展图形
        {
            var item=this.ExtendChartPaint[i];
            if (item) item.LanguageID=this.LanguageID;
        }

        if (this.Frame && this.Frame.SetLanguage) this.Frame.SetLanguage(this.LanguageID);

        this.Frame.SetSizeChage(true);
        this.Draw();
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
function ChartBorder() 
{
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

    this.LeftExtendWidth=0;      //左边扩展图形宽度
    this.RightExtendWidth=0;

    this.GetBorder=function()
    {
        var data=
        { 
            Left:this.Left, 
            LeftEx:this.Left+this.LeftExtendWidth,
            Right:this.UIElement.Width-this.Right,
            RightEx:this.UIElement.Width-this.Right-this.RightExtendWidth,

            Top:this.Top,
            TopEx:this.Top+this.TitleHeight+this.TopSpace,
            TopTitle:this.Top+this.TitleHeight,
            Bottom:this.UIElement.Height-this.Bottom,
            BottomEx:this.UIElement.Height-this.Bottom-this.BottomSpace,

            ChartWidth:this.UIElement.Width,
            ChartHeight:this.UIElement.Height
        };

        return data;
    }

    this.GetHScreenBorder=function()
    {
        var data=
        {
            Left:this.Left,
            LeftEx:this.Left+this.BottomSpace,

            Right:this.UIElement.Width-this.Right,
            RightEx:this.UIElement.Width-this.Right-this.TitleHeight- this.TopSpace,
            RightTitle:this.UIElement.Width-this.Right-this.TitleHeight,

            Top:this.Top,
            TopEx:this.Top+this.LeftExtendWidth,
            Bottom:this.UIElement.Height-this.Bottom,
            BottomEx:this.UIElement.Height-this.Bottom-this.RightExtendWidth,

            ChartWidth:this.UIElement.Width,
            ChartHeight:this.UIElement.Height
        };

        return data;
    }

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
    this.ClassName='IChartFramePainting';
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
    this.IndexTitleSpace=0;             //指标标题到参数之间的间距

    //上锁信息
    this.IsLocked = false;               //是否上锁
    this.LockPaint = null;

    this.BorderLine=null;               //1=上 2=下 4=左 8=右
    this.IsMinSize=false;               //窗口是否最小化

    this.LogoTextColor=g_JSChartResource.FrameLogo.TextColor;
    this.LogoTextFont=g_JSChartResource.FrameLogo.Font;

    this.Draw = function () 
    {
        this.DrawFrame();
        this.DrawBorder();

        this.SizeChange = false;
        this.XYSplit = false;
    }

    this.DrawFrame = function () { }

    this.GetBorder=function()
    {
        if (this.IsHScreen) return this.ChartBorder.GetHScreenBorder();
        else return this.ChartBorder.GetBorder();
    }

    this.ClearCoordinateText=function(option)
    {
        if (IFrameSplitOperator.IsNonEmptyArray(this.HorizontalInfo))
        {
            for(var i=0;i<this.HorizontalInfo.length;++i)
            {
                var item=this.HorizontalInfo[i];
                item.Message[0]=item.Message[1]=null;
            }
        }

        if (IFrameSplitOperator.IsNonEmptyArray(this.VerticalInfo))
        {
            for(var i=0;i<this.VerticalInfo.length;++i)
            {
                var item=this.VerticalInfo[i];
                item.Message[0]=item.Message[1]=null;
            }
        }
    }

    //画边框
    this.DrawBorder = function () 
    {
        if (!this.IsShowBorder) return;
        if (this.IsMinSize) return;

        var left = ToFixedPoint(this.ChartBorder.GetLeft());
        var top = ToFixedPoint(this.ChartBorder.GetTop());
        var right = ToFixedPoint(this.ChartBorder.GetRight());
        var bottom = ToFixedPoint(this.ChartBorder.GetBottom());
        var width = right - left;
        var height = bottom - top;
        if (this.BorderLine==null)
        {
            this.Canvas.strokeStyle = this.PenBorder;
            this.Canvas.strokeRect(left, top, width, height);
        }
        else if (IFrameSplitOperator.IsNumber(this.BorderLine))
        {
            this.Canvas.strokeStyle=this.PenBorder;
            this.Canvas.beginPath();
            
            if ((this.BorderLine&1)>0) //上
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(right,top);
            }

            if ((this.BorderLine&2)>0)  //下
            {
                this.Canvas.moveTo(left,bottom);
                this.Canvas.lineTo(right,bottom);
            }

            if ((this.BorderLine&4)>0)  //左
            {
                this.Canvas.moveTo(left,top);
                this.Canvas.lineTo(left,bottom);
            }

            if ((this.BorderLine&8)>0)    //右
            {
                this.Canvas.moveTo(right,top);
                this.Canvas.lineTo(right,bottom);
            }
              
            this.Canvas.stroke();
        }
    }

    //左右刻度文字宽度
    this.GetScaleTextWidth=function() { }

    //画标题背景色
    this.DrawTitleBG = function () 
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

    this.DrawLogo=function()
    {
        var border=this.GetBorder();
        var text=g_JSChartResource.FrameLogo.Text;
        if (!text) return;

        this.Canvas.fillStyle=this.LogoTextColor;
        this.Canvas.font=this.LogoTextFont;
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'bottom';
        if (this.IsHScreen)
        {
            var x=border.Left+5;
            var y=border.Top+5;
            this.Canvas.save();
            this.Canvas.translate(x,y);
            this.Canvas.rotate(90 * Math.PI / 180);
            this.Canvas.fillText(text,0,0);
            this.Canvas.restore();
        }
        else
        {
            var x=border.Left+5;
            var y=border.Bottom-5;
            this.Canvas.fillText(text,x,y);
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
function NoneFrame() 
{
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='NoneFrame';

    this.Snapshot = function () { }

    this.DrawInsideHorizontal = function () { }

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
    this.newMethod = IChartFramePainting;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='AverageWidthFrame';

    this.DataWidth = 50;
    this.DistanceWidth = 10;
    this.MinXDistance = 30;       //X轴刻度最小间距
    this.MinYDistance=10;
    this.XMessageAlign = 'top';   //X轴刻度文字上下对齐方式
    this.IsShowTitle = true;      //是否显示动态标题
    this.IsShowYText = [true, true];       //是否显示Y轴坐标坐标 [0=左侧] [1=右侧]
    this.XBottomOffset = g_JSChartResource.Frame.XBottomOffset;   //X轴文字显示向下偏移
    this.YTextTopOffset=g_JSChartResource.Frame.YTopOffset;         //Y轴顶部文字向下偏移
    this.YTextPosition=[0,0],       //是坐标否强制画在内部 [0=左侧] [1=右侧] 1=OUT" , 2=INSIDE
    this.YTextPadding=[g_JSChartResource.Frame.YTextPadding[0], g_JSChartResource.Frame.YTextPadding[1]],        //Y轴文字和边框间距 [0=左侧] [1=右侧]
    this.IsShowXLine=true;              //是否显示X轴刻度线
    this.IsShowYLine=true;
    this.YTextBaseline=0;  //0=居中 1=上部 (目前就支持内部刻度)

    this.ShortYLineLength=5;
    this.ShortXLineLength=5;
   
    this.DrawOtherChart;      //其他画法调用
    this.GetEventCallback;    //事件回调

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
        if (this.IsMinSize) return;
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
                if (!item) continue;
                var y = this.GetYFromData(item.Value);
                if (y != null && yPrev !=null && Math.abs(y - yPrev) < this.MinYDistance) continue;  //两个坐标在近了 就不画了

                //坐标信息 左边 间距小于10 画在内部
                if (item.Message[0] != null && borderLeft < 10 && this.IsShowYText[0] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "left";
                    var yText=y;
                    if (y >= bottom - 2) 
                    {
                        this.Canvas.textBaseline = 'bottom';
                    }
                    else if (y <= top + 2) 
                    {
                        this.Canvas.textBaseline = 'top';
                        yText+=this.YTextTopOffset;
                    }
                    else 
                    {
                        if (this.YTextBaseline==1) this.Canvas.textBaseline = "bottom";
                        else this.Canvas.textBaseline = "middle";
                    }
                    var textObj = { X: left, Y: yText, Text: { BaseLine: this.Canvas.textBaseline, Font: this.Canvas.font, Value: item.Message[0] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj)) this.Canvas.fillText(item.Message[0], left + 1, yText);
                }

                if (item.Message[1] != null && borderRight < 10 && this.IsShowYText[1] === true) 
                {
                    if (item.Font != null) this.Canvas.font = item.Font;
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.textAlign = "right";
                    var yText=y;
                    if (y >= bottom - 2) 
                    {
                        this.Canvas.textBaseline = 'bottom';
                    }
                    else if (y <= top + 2) 
                    {
                        this.Canvas.textBaseline = 'top';
                        yText+=this.YTextTopOffset;
                    }
                    else 
                    {
                        if (this.YTextBaseline==1) this.Canvas.textBaseline = "bottom";
                        else this.Canvas.textBaseline = "middle";
                    }
                    var textWidth = this.Canvas.measureText(item.Message[1]).width;
                    var textObj = { X: right - textWidth, Y: yText, Text: { BaseLine: this.Canvas.textBaseline, TextAlign: this.Canvas.textAlign, Font: this.Canvas.font, Value: item.Message[1] } };
                    if (!this.IsOverlayMaxMin || !this.IsOverlayMaxMin(textObj))
                        this.Canvas.fillText(item.Message[1], right - 1, yText);
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
        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从上往下画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && yPrev != null && Math.abs(y - yPrev) <this.MinYDistance) continue;  //两个坐标在近了 就不画了

            var yFixed=ToFixedPoint(y);
            if (bottom!=y && this.IsShowYLine) //和底部线段重叠了就不绘制
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (item.LineDash) this.Canvas.setLineDash(item.LineDash);
                    else this.Canvas.setLineDash([5,5]);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, yFixed);
                    this.Canvas.lineTo(right,yFixed);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType==3)  //只在刻度边上画一个短横线
                {

                }
                else if (item.LineType>0)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if(g_JSChartResource.FrameYLineDash)
                    {
                        this.Canvas.setLineDash(g_JSChartResource.FrameYLineDash);   //虚线
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(left, yFixed);
                        this.Canvas.lineTo(right, yFixed);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(left, yFixed);
                        this.Canvas.lineTo(right, yFixed);
                        this.Canvas.stroke();
                    }
                }
            }
            var yText=y;
            if (y >= bottom - 2) 
            {
                this.Canvas.textBaseline = 'bottom';
            }
            else if (y <= top + 2) 
            {
                this.Canvas.textBaseline = 'top';
                yText+=this.YTextTopOffset;
            }
            else 
            {
                this.Canvas.textBaseline = "middle";
            }

            //坐标信息 左边 间距小于10 不画坐标
            this.Canvas.fillStyle = item.TextColor;
            this.Canvas.strokeStyle = item.TextColor;
            if (item.Message[0] != null && borderLeft > 10 && this.IsShowYText[0] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;
                
                this.Canvas.textAlign = "right";
                this.Canvas.fillText(item.Message[0], left - this.YTextPadding[0], yText);
            }

            //坐标信息 右边 间距小于10 不画坐标
            if (item.Message[1] != null && borderRight > 10 && this.IsShowYText[1] === true) 
            {
                if (item.Font != null) this.Canvas.font = item.Font;

                var xText=right;
                if (item.LineType==3)
                {
                    var lineLength=this.ShortYLineLength;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xText,yFixed);
                    this.Canvas.lineTo(xText+lineLength,yFixed);
                    this.Canvas.stroke();

                    xText+=lineLength;
                }

                this.Canvas.textAlign = "left";
                this.Canvas.fillText(item.Message[1], xText + this.YTextPadding[1], yText);
            }

            yPrev = y;
        }

        this.Canvas.restore();
    }

    this.GetXFromIndex = function (index) 
    {
        var count = this.XPointCount;

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

    //画X轴
    this.DrawVertical = function ()
    {
        var top = this.ChartBorder.GetTopTitle();
        var bottom = this.ChartBorder.GetBottom();
        var right = this.ChartBorder.GetRight();

        if (this.ChartBorder.Bottom<=5) return;   //高度不够 不显示

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

            var item=this.VerticalInfo[i];
            var xFixed=ToFixedPoint(x);
            if (this.IsShowXLine && item.LineType > 0) 
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (item.LineDash) this.Canvas.setLineDash(item.LineDash);
                    else this.Canvas.setLineDash([5,5]);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xFixed, top);
                    this.Canvas.lineTo(xFixed, bottom);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType==3)
                {

                }
                else if (item.LineType>0)
                {
                    if(g_JSChartResource.FrameXLineDash)
                    {
                        this.Canvas.strokeStyle = item.LineColor;
                        this.Canvas.beginPath();
                        this.Canvas.setLineDash(g_JSChartResource.FrameXLineDash);
                        this.Canvas.moveTo(xFixed, top);
                        this.Canvas.lineTo(xFixed, bottom);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.strokeStyle = item.LineColor;
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(xFixed, top);
                        this.Canvas.lineTo(xFixed, bottom);
                        this.Canvas.stroke();
                    }
                }
                
            }

            if (this.VerticalInfo[i].Message[0] != null && this.ChartBorder.Bottom > 5) 
            {
                let xTextRight = null;
                let xTextLeft = null;
                if (this.VerticalInfo[i].Font != null)
                this.Canvas.font = this.VerticalInfo[i].Font;
                this.Canvas.fillStyle=item.TextColor;
                this.Canvas.strokeStyle=item.TextColor;

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

                var yText=bottom;
                if (item.LineType==3)
                {
                    var lineLength=this.ShortXLineLength;
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(xFixed,yText);
                    this.Canvas.lineTo(xFixed,yText+lineLength);
                    this.Canvas.stroke();

                    yText+=lineLength+2;
                }

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
        if (item.Value > this.HorizontalMax || item.Value < this.HorizontalMin) 
        {
            if (item.CountDown===true) this.SendDrawCountDownEvent( { IsShow:false } );
            return;
        }

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
            if (borderLeft < 10)    //左边
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
                    this.DrawLine(bgTop + textWidth, bottom, y, item.LineColor,item.LineType);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    var textLeft = left + 1;
                    this.Canvas.fillRect(textLeft, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[0], textLeft + 1, y);
                    this.DrawLine(textLeft + textWidth, right, y, item.LineColor,item.LineType);
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
                    this.DrawLine(bgTop + textWidth, bottom, y, item.LineColor,item.LineType);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(left - textWidth, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[0], left - 1, y);
                    this.DrawLine(left, right, y, item.LineColor,item.LineType);
                }
            }
        }
        else if (item.Message[1])   //右边
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
                    this.DrawLine(top, bgTop, y, item.LineColor,item.LineType);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    var textLeft = right - textWidth;
                    this.Canvas.fillRect(textLeft, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[1], textLeft + 1, y);
                    this.DrawLine(left, textLeft, y, item.LineColor,item.LineType);

                    if (item.CountDown===true)
                    {
                        if (this.GetEventCallback)
                        {
                            var bgTop=y + textHeight / 2 + 1;
                            var sendData=
                            { 
                                Top:bgTop, Right:right, Height:null, 
                                IsShow:true, BGColor:bgColor, TextColor:item.TextColor, Position:"Right", IsInside:true
                            };
                            this.SendDrawCountDownEvent(sendData);
                        }
                    }
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
                    this.DrawLine(top, bgTop, y, item.LineColor,item.LineType);
                }
                else
                {
                    var bgTop = y - textHeight / 2 - 1;
                    this.Canvas.fillRect(right, bgTop, textWidth, textHeight);
                    this.Canvas.fillStyle = item.TextColor;
                    this.Canvas.fillText(item.Message[1], right + 1, y);
                    this.DrawLine(left, right, y, item.LineColor,item.LineType);

                    if (item.CountDown===true)
                    {
                        if (this.GetEventCallback)
                        {
                            var bgTop=y + textHeight / 2 + 1;
                            var sendData=
                            { 
                                Top:bgTop, Left:right, Right:this.ChartBorder.GetChartWidth(), Height:null, 
                                IsShow:true, BGColor:item.LineColor, TextColor:item.TextColor, Position:"Right", IsInside:false
                            };
                            this.SendDrawCountDownEvent(sendData);
                        }
                    }
                }
            }
        }
    }

    this.SendDrawCountDownEvent=function(sendData)
    {
        if (!this.GetEventCallback) return false;
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_DRAW_COUNTDOWN);
        if (!event || !event.Callback) return false;

        event.Callback(event,sendData,this);
        return true;
    }

    this.DrawLine=function(left, right, y, color, lineType)
    {
        if (lineType==-1) return;

        if (lineType==0)
        {
            this.Canvas.strokeStyle = color;
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
        }
        else
        {
            this.DrawDotLine(left, right, y, color);
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

    this.GetScaleTextWidth=function()
    {
        var border=this.ChartBorder.GetBorder();
        if (this.IsHScreen)
        {
            var borderTop = this.ChartBorder.Top;
            var borderBottom = this.ChartBorder.Bottom;
            var isDrawLeft=borderTop>10 && this.IsShowYText[0]===true;
            var isDrawRight=borderBottom>10 && this.IsShowYText[1]===true;
        }
        else
        {
            var borderRight=this.ChartBorder.Right;
            var borderLeft=this.ChartBorder.Left;
            var isDrawLeft=borderLeft>10 && this.IsShowYText[0]===true;
            var isDrawRight=borderRight>10 && this.IsShowYText[1]===true;
        }
        
        var width={ Left:null, Right:null };
        if (!isDrawRight && !isDrawLeft) return width;

        for(var i=0;i<this.HorizontalInfo.length;++i)
        {
            var textWidth=null;
            var item=this.HorizontalInfo[i];
            if (!item) continue;
            if (item.Font!=null) this.Canvas.font=item.Font;

            if (item.Message[0]!=null && isDrawLeft)
            {
                textWidth=this.Canvas.measureText(item.Message[0]).width;
                if (width.Left==null || width.Left<textWidth)
                    width.Left=textWidth;
            }

            if (item.Message[1]!=null && isDrawRight)
            {
                textWidth=this.Canvas.measureText(item.Message[1]).width;
                if (width.Right==null || width.Right<textWidth)
                    width.Right=textWidth;
            }
        }

        if (IFrameSplitOperator.IsNumber(width.Left)) width.Left+=this.YTextPadding[0];
        if (IFrameSplitOperator.IsNumber(width.Right)) width.Right+=this.YTextPadding[1];
        
        return { TextWidth:width };
    }
}

function MinuteFrame() 
{
    this.newMethod = AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;
    this.ClassName='MinuteFrame';

    this.DataWidth=1;
    this.DistanceWidth=1;
    this.MinXDistance = 10;
    this.CustomHorizontalInfo = [];

    this.DrawFrame = function () 
    {
        if (this.IsMinSize) return;

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
        if (this.IsMinSize) return;
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

    this.ClassName='MinuteHScreenFrame';
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

        var count=this.XPointCount-1;
        return (y - this.ChartBorder.GetTop()) * (count * 1.0 / this.ChartBorder.GetHeight());
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

    this.ClassName='KLineFrame';
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
         if (this.IsMinSize) return;

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

        var offset = this.ChartBorder.GetLeft() + g_JSChartResource.FrameLeftMargin + this.DistanceWidth / 2 + this.DataWidth / 2;
        for (var i = 1; i <= index; ++i) { offset += this.DistanceWidth + this.DataWidth; }
        return offset;
    }

    //X坐标转x轴数值
    this.GetXData = function (x) 
    {
        if (x <= this.ChartBorder.GetLeft()) return 0;
        if (x >= this.ChartBorder.GetRight()) return this.XPointCount-1;

        var left=this.ChartBorder.GetLeft()+g_JSChartResource.FrameLeftMargin;
        var right=this.ChartBorder.GetRight()-g_JSChartResource.FrameRightMargin;
        var distanceWidth = this.DistanceWidth;
        var dataWidth = this.DataWidth;

        var index = 0;
        var xPoint = left + distanceWidth/2 + dataWidth + distanceWidth;
        while (xPoint < right && index < 10000 && index+1<this.XPointCount )  //自己算x的数值
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
        if (this.IsMinSize) return;
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

        if (this.ZoomIndex>=0 && this.LastCalculateStatus.Width==width && this.LastCalculateStatus.XPointCount==this.XPointCount) //宽度没变 尝试使用原来的柱子宽度
        {
            var caclWidth=(this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin)+(this.DataWidth + this.DistanceWidth)*(this.XPointCount-1);
            var caclWidth2=(this.DataWidth + this.DistanceWidth) * this.XPointCount;
            if (caclWidth<= width) //当前的柱子宽度够用 就不调整了
                return;
        }

        this.LastCalculateStatus.Width=width;
        this.LastCalculateStatus.XPointCount=this.XPointCount;

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

                JSConsole.Chart.Log(`[KLineFrame::CalculateDataWidth] ZoomIndex=${this.ZoomIndex} DataWidth=${this.DataWidth} DistanceWidth=${this.DistanceWidth}` );
                return;
            }
        }

        //太多了 就平均分了
        this.ZoomIndex = ZOOM_SEED.length - 1;
        this.DataWidth = width / this.XPointCount;
        this.DistanceWidth = 0;
    }

    this.OnSize=function(obj)
    {
        var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin;
        var xPointCount=0;
        var y=this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin+(this.DataWidth+this.DistanceWidth);
        for(;y<width; y+=(this.DataWidth+this.DistanceWidth), ++xPointCount) { }

        obj.CurCount=this.XPointCount;
        obj.CalcCount=xPointCount;
        obj.DataWidth=this.DataWidth;
        obj.DistanceWidth=this.DistanceWidth;
        obj.Changed=false;

        this.LastCalculateStatus.Width=width;
        if (obj.CurCount==obj.CalcCount) return obj;

        this.XPointCount=xPointCount;
        this.LastCalculateStatus.XPointCount=this.XPointCount;
        if (this.Data)
        {
            this.Data.DataOffset+=(obj.CurCount-obj.CalcCount);
            if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            obj.Changed=true;
        }
        return obj;
    }

    this.SetDataWidth=function(dataWidth)
    {
        var zoomIndex=ZOOM_SEED.length-1;
        for(var i in ZOOM_SEED)
        {
            var item=ZOOM_SEED[i];
            if (item[0]<=dataWidth) 
            {
                zoomIndex=parseInt(i)-1;
                break;
            }
        }

        this.ZoomIndex=zoomIndex;
        this.DataWidth=ZOOM_SEED[this.ZoomIndex][0];
        this.DistanceWidth=ZOOM_SEED[this.ZoomIndex][1];
        var width=this.GetFrameWidth()-g_JSChartResource.FrameMargin;
        var xPointCount=0;
        var y=this.DistanceWidth/2+g_JSChartResource.FrameLeftMargin+(this.DataWidth+this.DistanceWidth);
        for(;y<=width; y+=(this.DataWidth+this.DistanceWidth), ++xPointCount) { }

        this.XPointCount=xPointCount;
        this.LastCalculateStatus.XPointCount=this.XPointCount;
        this.LastCalculateStatus.Width=width;

        var obj={ XPointCount:this.XPointCount, DataWidth:this.DataWidth, DistanceWidth:this.DistanceWidth };
        return obj;
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

        while(true)
        {
            if((this.DistanceWidth + this.DataWidth) * this.XPointCount + this.DistanceWidth > width)
            {
                this.DistanceWidth -= 0.01;
                break;
            }
            this.DistanceWidth += 0.01;
        }
        /*
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
        */
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
        if (cursorIndex.IsLockRight==true) //固定右边
        {
            var rightDataIndex=this.Data.DataOffset + this.XPointCount;    //最右边的数据索引
            if (xPointCount>rightDataIndex)
            {
                xPointCount=rightDataIndex;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=0;
            }
            else
            {
                var dataOffset=lastDataIndex - (xPointCount-rightSpaceCount)+1;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=dataOffset;
                if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            }
        }
        else if (xPointCount >= maxDataCount) 
        {
            xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
            if (this.Data.DataOffset<0)  
            {
                JSConsole.Chart.Log(`[KLineFrame::ZoomDown] this.Data.DataOffset=${this.Data.DataOffset}, reset this.Data.DataOffset=0`);
                this.Data.DataOffset=0;
            }
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
        if (this.Data.DataOffset<=0 && cursorIndex.IsLockRight==true) return false;
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
        if (cursorIndex.IsLockRight==true) //固定右边
        {
            var rightDataIndex=this.Data.DataOffset + this.XPointCount;    //最右边的数据索引
            if (xPointCount>rightDataIndex)
            {
                xPointCount=rightDataIndex;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=0;
            }
            else
            {
                var dataOffset=lastDataIndex - (xPointCount-rightSpaceCount)+1;
                this.XPointCount=xPointCount;
                this.Data.DataOffset=dataOffset;
                if (this.Data.DataOffset<0) this.Data.DataOffset=0;
            }
        }
        else if (xPointCount >= maxDataCount) 
        {
            xPointCount = maxDataCount;
            this.XPointCount = xPointCount;
            this.Data.DataOffset = 0;
        }
        else 
        {
            this.XPointCount = xPointCount;
            this.Data.DataOffset = lastDataIndex - (this.XPointCount - rightSpaceCount) + 1;
            if (this.Data.DataOffset<0) 
            {
                JSConsole.Chart.Log(`[KLineFrame::ZoomDown] this.Data.DataOffset=${this.Data.DataOffset}, reset this.Data.DataOffset=0`);
                this.Data.DataOffset=0;
            }
               
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

    this.ClassName='KLineHScreenFrame';
    this.IsHScreen = true;        //是否是横屏

    this.DrawInsideHorizontal = function () 
    {
        if (this.IsMinSize) return;
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
    this.DrawHorizontal = function () 
    {
        var top = this.ChartBorder.GetTop();
        var bottom = this.ChartBorder.GetBottom();
        var borderTop = this.ChartBorder.Top;
        var borderBottom = this.ChartBorder.Bottom;
        var left=this.ChartBorder.GetLeft();

        var yPrev = null; //上一个坐标y的值
        for (var i = this.HorizontalInfo.length - 1; i >= 0; --i)  //从左往右画分割线
        {
            var item = this.HorizontalInfo[i];
            var y = this.GetYFromData(item.Value);
            if (y != null && Math.abs(y - yPrev) < 15) continue;  //两个坐标在近了 就不画了

            if (y!=left)
            {
                if (item.LineType==2)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    this.Canvas.setLineDash([5,5]);   //虚线
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(ToFixedPoint(y),top);
                    this.Canvas.lineTo(ToFixedPoint(y),bottom);
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else if (item.LineType>0)
                {
                    this.Canvas.strokeStyle = item.LineColor;
                    if (g_JSChartResource.FrameYLineDash)
                    {
                        this.Canvas.setLineDash(g_JSChartResource.FrameYLineDash);   //虚线
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y),top);
                        this.Canvas.lineTo(ToFixedPoint(y),bottom);
                        this.Canvas.stroke();
                        this.Canvas.setLineDash([]);
                    }
                    else
                    {
                        this.Canvas.beginPath();
                        this.Canvas.moveTo(ToFixedPoint(y), top);
                        this.Canvas.lineTo(ToFixedPoint(y), bottom);
                        this.Canvas.stroke();
                    }
                }
            }
            
            //坐标信息 左边 间距小于10 不画坐标
            if (item.Message[0] != null && borderTop > 10 && this.IsShowYText[0] === true) 
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
            if (item.Message[1] != null && borderBottom > 10 && this.IsShowYText[1] === true) 
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

        var offset = this.ChartBorder.GetTop() + g_JSChartResource.FrameLeftMargin + this.DistanceWidth / 2 + this.DataWidth / 2;
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
        var right = this.ChartBorder.GetRightTitle();
        var bottom = this.ChartBorder.GetBottom();

        var xPrev = null; //上一个坐标x的值
        for (var i in this.VerticalInfo) 
        {
            var x = this.GetXFromIndex(this.VerticalInfo[i].Value);
            if (x >= bottom) break;
            if (xPrev != null && Math.abs(x - xPrev) < 80) continue;
            var item=this.VerticalInfo[i];
            if (item.LineType==2)
            {
                this.Canvas.setLineDash([5,5]);
                this.Canvas.beginPath();
                this.Canvas.moveTo(left, ToFixedPoint(x));
                this.Canvas.lineTo(right, ToFixedPoint(x));
                this.Canvas.stroke();
                this.Canvas.setLineDash([]);
            }
            else if (item.LineType>0)
            {
                this.Canvas.strokeStyle = item.LineColor;
                if (g_JSChartResource.FrameXLineDash)
                {
                    this.Canvas.setLineDash(g_JSChartResource.FrameXLineDash);
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, ToFixedPoint(x));
                    this.Canvas.lineTo(right, ToFixedPoint(x));
                    this.Canvas.stroke();
                    this.Canvas.setLineDash([]);
                }
                else
                {
                    this.Canvas.beginPath();
                    this.Canvas.moveTo(left, ToFixedPoint(x));
                    this.Canvas.lineTo(right, ToFixedPoint(x));
                    this.Canvas.stroke();
                }
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

                var xText = left, yText = x;
                this.Canvas.save();
                this.Canvas.translate(xText, yText);
                this.Canvas.rotate(90 * Math.PI / 180);
                this.Canvas.fillText(this.VerticalInfo[i].Message[0], 0, this.XBottomOffset);
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
        if (y >= this.ChartBorder.GetBottom()) return this.XPointCount-1;

        var distanceWidth=this.DistanceWidth;
        var dataWidth=this.DataWidth;
        var left=this.ChartBorder.GetTop()+g_JSChartResource.FrameLeftMargin;
        var right=this.ChartBorder.GetBottom()-g_JSChartResource.FrameRightMargin;

        var index=0;
        var xPoint=left+distanceWidth/2+dataWidth+distanceWidth;
        while(xPoint<right && index<10000 && index+1<this.XPointCount)  //自己算x的数值
        {
            if (xPoint>=y) break;
            xPoint+=(dataWidth+distanceWidth);
            ++index;
        }

        return index;
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
    this.ClassName='HQTradeFrame';
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
    this.AutoLeftBorder=null;   //{ Blank:10 留白宽度, MinWidth:最小宽度 }
    this.AutoRightBorder=null;  //{ Blank:10 留白宽度, MinWidth:最小宽度 } 

    this.ZoomWindowsInfo=null;      //附图指标缩放,备份信息
    this.ZoomStartWindowIndex=1;    //允许缩放窗口起始位置

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

    this.GetScaleTextWidth=function()
    {
        var width={ Left:null, Right:null };
        for(var i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            if (item.Height<=0) continue;
            var frame=item.Frame;
            if (!frame) continue;
            if (!frame.XSplitOperator) continue; 
            
            var maxValue=frame.HorizontalMax;   //最大最小要还原
            var minValue=frame.HorizontalMin;

            frame.YSplitOperator.Operator();
            var value=frame.GetScaleTextWidth();

            frame.HorizontalMax=maxValue;
            frame.HorizontalMin=minValue;

            if (value && value.TextWidth)
            {
                var widthItem=value.TextWidth;
                if (IFrameSplitOperator.IsNumber(widthItem.Left))
                {
                    if (width.Left==null || width.Left<widthItem.Left) width.Left=widthItem.Left;
                }

                if (IFrameSplitOperator.IsNumber(widthItem.Right))
                {
                    if (width.Right==null || width.Right<widthItem.Right) width.Right=widthItem.Right;
                }
            }
        }

        return width;
    }

    this.IsFrameXYSplit=function()
    {
        for(var i in this.SubFrame)
        {
            if (this.SubFrame[i].Frame.XYSplit) return true;
        }
        return false;
    }

    this.Draw = function (option) 
    {
        if (this.SizeChange === true) this.CalculateChartBorder();

        var isSplash=false; //是否过场动画
        if (option && option.IsEnableSplash===true) isSplash=true;
        if (isSplash==false && (this.AutoLeftBorder || this.AutoRightBorder) &&this.IsFrameXYSplit())
        {
            var textWidth=this.GetScaleTextWidth();

            if (IFrameSplitOperator.IsNumber(textWidth.Left) && this.AutoLeftBorder)
            {
                var blank=0;
                if (IFrameSplitOperator.IsNumber(this.AutoLeftBorder.Blank)) blank=this.AutoLeftBorder.Blank;
                var value=textWidth.Left+blank;
                if (IFrameSplitOperator.IsNumber(this.AutoLeftBorder.MinWidth))
                {
                    if (this.AutoLeftBorder.MinWidth>value) value=this.AutoLeftBorder.MinWidth;
                }
                if (this.IsHScreen) this.ChartBorder.Top=value;
                else this.ChartBorder.Left=value;
                for(var i=0; i<this.SubFrame.length; ++i)
                {
                    var item=this.SubFrame[i];
                    if (this.IsHScreen) item.Frame.ChartBorder.Top=value;
                    else item.Frame.ChartBorder.Left=value;
                }
            }

            if (IFrameSplitOperator.IsNumber(textWidth.Right) && this.AutoRightBorder)
            {
                var blank=0;
                if (IFrameSplitOperator.IsNumber(this.AutoRightBorder.Blank)) blank=this.AutoRightBorder.Blank;
                var value=textWidth.Right+blank;
                if (IFrameSplitOperator.IsNumber(this.AutoRightBorder.MinWidth))
                {
                    if (this.AutoRightBorder.MinWidth>value) value=this.AutoRightBorder.MinWidth;
                }
                if (this.IsHScreen) this.ChartBorder.Bottom=value;
                else this.ChartBorder.Right=value;
                for(var i=0; i<this.SubFrame.length; ++i)
                {
                    var item=this.SubFrame[i];
                    if (this.IsHScreen) item.Frame.ChartBorder.Bottom=value;
                    else item.Frame.ChartBorder.Right=value;
                }
            }
        }

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

    this.DrawLogo=function()
    {
        for(var i=0;i<this.SubFrame.length;++i)
        {
            var item=this.SubFrame[i];
            if (item.Frame.DrawLogo)
            {
                item.Frame.DrawLogo();
                break;
            }
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

        //JSConsole.Chart.Log('[HQTradeFrame::SnapshotImageData][ID=' + this.ChartBorder.UIElement.ID + '] invoke canvasToTempFilePath' + '(width=' + width + ',height=' + height + ')' + ' SnapshotStatus='+ this.SnapshotStatus);
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
                    JSConsole.Chart.Log(`[HQTradeFrame::SnapshotImagePath] SnapshotID(${self.SnapshotID}, ${self.CurrentSnapshotID}), Path=${res.tempFilePath}`);
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
                    //JSConsole.Chart.Log('[HQTradeFrame::SnapshotImagePath] SnapshotID(' + self.SnapshotID + ',' + self.CurrentSnapshotID + ') Path ='+ res.tempFilePath);
                }
            })
        }
    }

    this.SnapshotImageData=function()
    {
        var self = this;
        var width = this.ChartBorder.GetChartWidth();
        var height = this.ChartBorder.GetChartHeight();

        JSConsole.Chart.Log(`[HQTradeFrame::SnapshotImageData][ID=${this.ChartBorder.UIElement.ID} invoke canvasGetImageData(${width}, ${height}) SnapshotStatus=${this.SnapshotStatus}`);
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
                JSConsole.Chart.Log(`[HQTradeFrame::SnapshotImageData] SnapshotID=${self.SnapshotID}, CurrentSnapshotID=${self.CurrentSnapshotID}, size=${res.data.length}`);
            }
        })
    }

    this.GetXData = function (x) { return this.SubFrame[0].Frame.GetXData(x); }

    this.GetYData = function (y, outObject) //outObject 可以保存返回的额外数据) 
    {
        var frame;
        for (var i=0; i<this.SubFrame.length; ++i) 
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

    this.PtInFrame=function(x,y)    //鼠标哪个指标窗口
    {
        for(var i=0; i<this.SubFrame.length; ++i)
        {
            var item=this.SubFrame[i];
            var left=item.Frame.ChartBorder.GetLeft();
            var top=item.Frame.ChartBorder.GetTop();
            var width=item.Frame.ChartBorder.GetWidth();
            var height=item.Frame.ChartBorder.GetHeight();

            var rtClient = new Rect(left, top, width, height);
            var isInClient = rtClient.IsPointIn(x, y);
            if (isInClient)
            {
                return i;   //转成整形
            }
        }

        return -1;
    }

    this.ZoomUp = function (cursorIndex) 
    {
        var result = this.SubFrame[0].Frame.ZoomUp(cursorIndex);
        this.UpdateAllFrame();

        return result;
    }

    this.ZoomDown = function (cursorIndex) 
    {
        var result = this.SubFrame[0].Frame.ZoomDown(cursorIndex);
        this.UpdateAllFrame();

        return result;
    }

    this.SetDataWidth=function(dataWidth)
    {
        var obj=this.SubFrame[0].Frame.SetDataWidth(dataWidth);
        this.UpdateAllFrame();
        return obj;
    }

    this.OnSize=function()
    {
        var obj={};
        this.SubFrame[0].Frame.OnSize(obj);
        this.UpdateAllFrame();
        return obj;
    }

    this.UpdateAllFrame=function()
    {
        var mainFrame=this.SubFrame[0].Frame;
        for (var i = 1; i < this.SubFrame.length; ++i) 
        {
            var item=this.SubFrame[i];
            item.Frame.XPointCount = mainFrame.XPointCount;
            item.Frame.ZoomIndex = mainFrame.ZoomIndex;
            item.Frame.DataWidth = mainFrame.DataWidth;
            item.Frame.DistanceWidth = mainFrame.DistanceWidth;
            item.Frame.LastCalculateStatus.Width=mainFrame.LastCalculateStatus.Width;
            item.Frame.LastCalculateStatus.XPointCount=mainFrame.LastCalculateStatus.XPointCount;
        }
    }

    //设置重新计算刻度坐标
    this.ResetXYSplit = function () 
    {
        for (let i in this.SubFrame) 
        {
            this.SubFrame[i].Frame.XYSplit = true;
        }
    }

    this.SetLanguage=function(languageID)
    {
        for(let i in this.SubFrame)
        {
            var item=this.SubFrame[i];
            if (item && item.Frame )
            {
                if (item.Frame.YSplitOperator) item.Frame.YSplitOperator.LanguageID=languageID;
                if (item.Frame.XSplitOperator) item.Frame.XSplitOperator.LanguageID=languageID;
            }
        }
    }

    this.GetCurrentPageSize = function ()  //获取当前页显示的数据个数
    {
        if (this.SubFrame.length <= 0) return null;
        var item = this.SubFrame[0];
        if (!item || !item.Frame) return null;

        return item.Frame.XPointCount;
    }

    this.ClearCoordinateText=function(option) //清空X，Y轴刻度文字， 线段保留
    {
        for(var i=0;i<this.SubFrame.length;++i)
        {
            var item=this.SubFrame[i];
            if (!item.Frame) continue;

            item.Frame.ClearCoordinateText(option);
        }
    }

    this.RestoreIndexWindows=function()
    {
        if (!this.ZoomWindowsInfo) return false;

        var subFrame=this.SubFrame[this.ZoomWindowsInfo.FrameID];
        for(var i=this.ZoomStartWindowIndex;i<this.ZoomWindowsInfo.Data.length; ++i)
        {
            var restoreItem=this.ZoomWindowsInfo.Data[i];
            var frameItem=this.SubFrame[i];
            frameItem.Height=restoreItem.Height;
            frameItem.Frame.IsMinSize=false;
            frameItem.Frame.XSplitOperator.ShowText=restoreItem.ShowXText;
            frameItem.Frame.XYSplit=true;
        }

        this.ZoomWindowsInfo=null;
        return true;
    }

    this.ZoomIndexWindow=function(frameID, option)
    {
        var subFrame=this.SubFrame[frameID];
        if (!subFrame) return false;
        if (this.ZoomWindowsInfo)   //还原
        {
            return this.RestoreIndexWindows();
        }
        else    //放大
        {
            var zoomInfo={ FrameID:frameID, Data:[] };    //备份下放大前各个窗口的高度
            for(var i=0; i<this.SubFrame.length; ++i)
            {
                var item=this.SubFrame[i];
                zoomInfo.Data[i]={ Height:item.Height, ShowXText:item.Frame.XSplitOperator.ShowText };
            }
            this.ZoomWindowsInfo=zoomInfo;

            var totalHeight=0;
            for(var i=this.ZoomStartWindowIndex;i<this.SubFrame.length;++i)
            {
                var item=this.SubFrame[i];
                var frame=item.Frame;
                frame.XYSplit=true;
                totalHeight+=item.Height;
                
                if (i!=frameID)
                {
                    item.Height=0;
                    frame.IsMinSize=true;  //最小化
                    frame.XSplitOperator.ShowText=false;
                }
            }
            subFrame.Height=totalHeight;
            subFrame.Frame.XSplitOperator.ShowText=true;

            return true;
        }
    }
}

//行情框架横屏
function HQTradeHScreenFrame() {
  this.newMethod = HQTradeFrame;   //派生
  this.newMethod();
  delete this.newMethod;

  this.ClassName='HQTradeHScreenFrame';
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

    this.GetYData = function (x, outObject) 
    {
        var frame;
        for (var i=0; i<this.SubFrame.length; ++i) 
        {
            var item = this.SubFrame[i];
            var left = item.Frame.ChartBorder.GetLeftEx();
            var top = item.Frame.ChartBorder.GetTop();
            var width = item.Frame.ChartBorder.GetWidthEx();
            var height = item.Frame.ChartBorder.GetHeight();

            var rtItem = new Rect(left, top, width, height);
            if (rtItem.IsPointIn(x, top)) 
            {
                frame = item.Frame;
                if (outObject) outObject.FrameID = i;
                break;
            }
        }

        if (frame != null) return frame.GetYData(x);
    }
}

//深度图框架
function DepthChartFrame()
{
    this.newMethod=AverageWidthFrame;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ScreenImageData;                   //截图
    this.Position;                          //画布的位置
    this.ClassName="DepthChartFrame";

    //X轴价格 最大,最小
    this.VerticalRange={ Max:null, Min:null, Center:null, MaxDiffer:null, Differ:null, Step:0.05 };
    this.AskPrice;
    this.BidPrice;
    this.MinZoom=0.05;  //最小缩放

    this.SetPriceList=function(aryAskPrice, aryBidPrice)
    {
        this.AskPrice=aryAskPrice;
        this.BidPrice=aryBidPrice;
    }

    this.SetDrawOtherChart = function (callback)  //在画完框架以后调用的扩展画法
    {
        
    }

    this.DrawFrame=function()
    {
        this.SplitXYCoordinate();
        this.DrawHorizontal();
        this.DrawVertical();
    }

    this.GetXFromIndex=function(value)
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var width=this.ChartBorder.GetWidth();
        var offset=width*(value-this.VerticalRange.Min)/(this.VerticalRange.Max-this.VerticalRange.Min);
        return left+offset;
    }

    this.GetXData=function(x)
    {
        var left=this.ChartBorder.GetLeft();
        var right=this.ChartBorder.GetRight();
        var width=this.ChartBorder.GetWidth();

        return (x-left)/width*(this.VerticalRange.Max-this.VerticalRange.Min)+this.VerticalRange.Min;
    }

    this.GetXFromPrice=function(price)
    {
        var isAskPrice=false;
        var find=this.GetPrice(this.BidPrice, price);
        if (find==null) 
        {
            find=this.GetPrice(this.AskPrice, price);
            isAskPrice=true;
        }

        if (find==null) 
        {
            if (this.BidPrice && Array.isArray(this.BidPrice) && this.BidPrice.length>0)
            {
                var minPrice=this.BidPrice[0];
                if (price<minPrice) 
                {
                    isAskPrice=false;
                    find= minPrice;
                }
            }
        }

        if (find==null)   
        {      
            if (this.AskPrice && Array.isArray(this.AskPrice) && this.AskPrice.length>0)
            {
                var maxPrice=this.AskPrice[this.AskPrice.length-1];
                if (price>maxPrice) 
                {
                    isAskPrice=true;
                    find=maxPrice;
                }
            }
        }

        if (find==null) return null;

        var x=this.GetXFromIndex(find);

        return { X:x, Price:find, IsAsk:isAskPrice };
    }

    this.GetPrice=function(aryPrice, price)
    {
        if (!aryPrice || !Array.isArray(aryPrice) || aryPrice.length<=0) return null;

        if (price<aryPrice[0] || price>aryPrice[aryPrice.length-1]) return null;

        var lastPrice=null;
        for(var i in aryPrice)
        {
            var item=aryPrice[i];
            if (price==item)
            {
                return item;
            }

            if (price<item)
                return lastPrice;

            lastPrice=item;
        }
    }

    //分割x,y轴坐标信息
    this.SplitXYCoordinate=function()
    {
        if (this.XYSplit==false) return;
        if (this.YSplitOperator!=null) this.YSplitOperator.Operator();
        if (this.XSplitOperator!=null) this.XSplitOperator.Operator();
    }

    //图形快照
    this.Snapshot=function()
    {
        this.ScreenImageData=this.Canvas.getImageData(0,0,this.ChartBorder.GetChartWidth(),this.ChartBorder.GetChartHeight());
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

    this.ZoomUp=function()  //放大
    {
        var xRange=this.VerticalRange;
        var differ=xRange.Differ;
        var minDiffer=xRange.MaxDiffer*this.MinZoom;
        if (differ<minDiffer) return false;

        var offsetDiffer=xRange.Differ*xRange.Step;
        differ-=offsetDiffer;
        xRange.Differ=differ;
        xRange.Min=xRange.Center-xRange.Differ;
        xRange.Max=xRange.Center+xRange.Differ;

        return true;
    }

    this.ZoomDown=function() //缩小
    {
        var xRange=this.VerticalRange;
        var differ=xRange.Differ;
        if (differ==xRange.MaxDiffer) return false;

        var offsetDiffer=xRange.Differ*xRange.Step;
        differ+=offsetDiffer;
        if (differ>xRange.MaxDiffer) differ=xRange.MaxDiffer;

        xRange.Differ=differ;
        xRange.Min=xRange.Center-xRange.Differ;
        xRange.Max=xRange.Center+xRange.Differ;

        return true;
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

    JSConsole.Chart.Log('[SimpleChartFrame::Snapshot][ID=' + this.ChartBorder.UIElement.ID + '] invoke canvasToTempFilePath' + '(width=' + width + ',height=' + height + ')');

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      canvasId: this.ChartBorder.UIElement.ID,
      success: function (res) {
        self.ScreenImagePath = res.tempFilePath;
        JSConsole.Chart.Log(res.tempFilePath)
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

        //JSConsole.Chart.Log('[AverageWidthFrame::DrawVertical]', this.Canvas.fillStyle,x, yText);

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
    [18, 6], [17, 6],
    [15, 5], [13, 5],
    [9, 4],  [5, 4], [3, 3],
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
        //JSConsole.Chart.Log('[ChartXYSubBar::Draw] ', subBarWidth, this.BarID, subBarOffset);
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
        //JSConsole.Chart.Log('[ChartSubBar::Draw] ', subBarWidth, this.BarID, subBarOffset);
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
      //JSConsole.Chart.Log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
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
      //JSConsole.Chart.Log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
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
      //JSConsole.Chart.Log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
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
      //JSConsole.Chart.Log('['+i+']'+'x='+x+' y='+y+' dataX='+pt.X+" dataY="+pt.Y);
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
    this.RightFormula=0                   //复权公式 0=简单复权, 1=复权因子复权
    this.IsApiPeriod = false;             //使用API计算周期
    this.Right = 0;                       //复权 0 不复权 1 前复权 2 后复权
    this.SourceData;                      //原始的历史数据
    this.MaxReqeustDataCount = 3000;      //数据个数
    this.MaxRequestMinuteDayCount = 5;    //分钟数据请求的天数
    this.PageSize = 200;                  //每页数据个数
    this.KLineDrawType = 0;               //0=K线 1=收盘价线 2=美国线
    this.LoadDataSplashTitle = '下载历史数据';
    this.IsAutoUpdate = false;                    //是否自动更新行情数据
    this.AutoUpdateFrequency = 30000;             //30秒更新一次数据
    this.AutoUpdateTimer=null;                         //自动定时器
    this.RightSpaceCount=1;
    this.SourceDataLimit = new Map();     //每个周期缓存数据最大个数 key=周期 value=最大个数  
    this.IsZoomLockRight=false; 
    this.KLineSize=null;                  //{ DataWidth:, }

    this.StepPixel = 4;                   //移动一个数据需要的像素
    this.ZoomStepPixel = 5;               //放大缩小手势需要的最小像素
    this.EnableZoomUpDown=null;         //是否手势/键盘/鼠标允许缩放{ Touch:true/false, Mouse:true/false, Keyboard:true/false, Wheel:true/false }

    this.DragDownload = {
        Day: { Enable: false, IsEnd: false, Status: 0 },      //日线数据拖拽下载(暂不支持) Status: 0空闲 1 下载中
        Minute: { Enable: false, IsEnd: false, Status: 0 }    //分钟数据拖拽下载
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
        this.DragDownload.Minute.IsEnd=false;
    }

    this.AddCustomKLine=function(kline, option)
    {
        var klineChart=this.ChartPaint[0];
        if (!klineChart) return;
        if (!kline) return;

        if (!klineChart.CustomKLine) klineChart.CustomKLine=new Map();

        if (Array.isArray(kline))
        {
            for(var i=0;i<kline.length;++i)
            {
                var item=kline[i];
                klineChart.CustomKLine.set(item.Key, item.Data);
            }
        }
        else if (kline)
        {
            klineChart.CustomKLine.set(kline.Key, kline.Data);
        }
        
        if (option && option.Draw==true) this.Draw();
    }

    this.ClearCustomKLine=function(option)
    {
        var klineChart=this.ChartPaint[0];
        if (!klineChart) return;

        klineChart.ClearCustomKLine();
        
        if (option && option.Draw==true) this.Draw();
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
            else
            {
                if (id===JSCHART_OPERATOR_ID.OP_SCROLL_RIGHT && this.DragDownloadData) 
                    this.DragDownloadData();
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
            var hisData = this.ChartOperator_Temp_GetHistroyData();
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

            JSConsole.Chart.Log(`[KLineChartContainer::ChartOperator] OP_GOTO_HOME, dataOffset=${hisData.DataOffset} CursorIndex=${this.CursorIndex} PageSize=${showCount}`);

            this.UpdataDataoffset();           //更新数据偏移
            this.UpdateFrameMaxMin();          //调整坐标最大 最小值
            this.Frame.SetSizeChage(true);
            this.Draw();
            this.UpdatePointByCursorIndex();   //更新十字光标位子
        }
    }

     //内部函数
     this.ChartOperator_Temp_GetHistroyData=function()
     {
         var hisData=null;
         if (!this.Frame.Data) hisData=this.Frame.Data;
         else hisData=this.Frame.SubFrame[0].Frame.Data;
         if (!hisData) return null;  //数据还没有到达
 
         return hisData;
     }

    //创建windowCount 窗口个数
    this.Create = function (windowCount) 
    {
        this.UIElement.JSChartContainer = this;

        //创建十字光标
        this.ChartCorssCursor = new ChartCorssCursor();
        this.ChartCorssCursor.Canvas = this.Canvas;
        this.ChartCorssCursor.StringFormatX = g_DivTooltipDataForamt.Create("CorssCursor_XStringFormat");
        this.ChartCorssCursor.StringFormatX.LanguageID=this.LanguageID;
        this.ChartCorssCursor.StringFormatY = g_DivTooltipDataForamt.Create("CorssCursor_YStringFormat");
        this.ChartCorssCursor.StringFormatY.LanguageID = this.LanguageID;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.LoadDataSplashTitle;
        this.ChartSplashPaint.HQChart=this;

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
            titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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
                frame.YSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
                frame.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
                border.BottomSpace = 12;  //主图上下留空间
                border.TopSpace = 12;
            }
            else 
            {
                frame.YSplitOperator = new FrameSplitY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
                frame.YSplitOperator.LanguageID = this.LanguageID;
                frame.YSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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
        frame.XSplitOperator.Period=this.Period;

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
        kline.GetEventCallback=(id)=>{ return this.GetEventCallback(id); };

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

        if (this.KLineSize)
        {
            if (this.KLineSize.DataWidth==null)
            {
                showCount=this.Frame.SubFrame[0].Frame.XPointCount-this.RightSpaceCount;
            }
            else
            {
                var obj=this.Frame.SetDataWidth(this.KLineSize.DataWidth);
                showCount=obj.XPointCount-this.RightSpaceCount;
                this.KLineSize.DataWidth=null;
            }
        }

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

        var xPointCount=this.Frame.SubFrame[0].Frame.XPointCount;   //当前一屏能显示的数据个数
        var newDataCount = 0;
        if (lastDataCount > 0 && hisData.Data.length > lastDataCount) 
        {
            newDataCount = hisData.Data.length - lastDataCount;
            JSConsole.Chart.Log(`[KLineChartContainer::UpdateMainData]  [count=${lastDataCount}->${hisData.Data.length}], [newDataCount=${newDataCount}], [Pagesize=${xPointCount}]`);
        }
        else if (lastDataCount==0 && hisData.Data.length>xPointCount)   //历史数据为空,当前收到数据大于一屏的数据,显示最新数据
        {
            newDataCount=hisData.Data.length-xPointCount;
            JSConsole.Chart.Log(`[KLineChartContainer::UpdateMainData] history data is empty. [count=${lastDataCount}->${hisData.Data.length}], [newDataCount=${newDataCount}], [Pagesize=${xPointCount}]`);
        }

        this.ChartPaint[0].Data = hisData;
        this.ChartPaint[0].Symbol = this.Symbol;
        if (hisData.Data.length>xPointCount) //不满一屏的, 不需要调整索引
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

    this.AutoUpdateEvent = function (bStart, explain)   //自定更新事件, 是给websocket使用
    {
        var eventID = bStart ? JSCHART_EVENT_ID.RECV_START_AUTOUPDATE : JSCHART_EVENT_ID.RECV_STOP_AUTOUPDATE;
        if (!this.mapEvent.has(eventID)) return;

        var self = this;
        var event = this.mapEvent.get(eventID);
        var data = { Stock: { Symbol: this.Symbol, Name: this.Name, Right: this.Right, Period: this.Period }, Explain:explain };
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
        this.CancelAutoUpdate();
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
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
                    Data: 
                    { 
                        symbol: self.Symbol, count: self.MaxReqeustDataCount, field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"] ,
                        period:this.Period,
                        right:this.Right
                    }
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvHistoryData(data);
                self.AutoUpdateEvent(true, "KLineChartContainer::RequestHistoryData");
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
            self.ChartSplashPaint.EnableSplash(false);
            self.RecvHistoryData(data);
            self.AutoUpdateEvent(true,"KLineChartContainer::RequestHistoryData");
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
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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
        this.ReqeustKLineInfoData({ FunctionName:"RecvHistoryData" });
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
        this.CancelAutoUpdate();
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
        this.ResetDragDownload();
        this.Draw();

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
                        field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol"],
                        period:this.Period,
                        right:this.Right
                    }
                },
                Self: this,
                PreventDefault: false
            };
            this.NetworkFilter(obj, function (data) {
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvMinuteHistoryData(data);
                self.AutoUpdateEvent(true,"KLineChartContainer::ReqeustHistoryMinuteData");
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
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvMinuteHistoryData(data);
                self.AutoUpdateEvent(true,"KLineChartContainer::ReqeustHistoryMinuteData");
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
                        field: ["name", "symbol", "yclose", "open", "price", "high", "low", "vol", "amount", "date", "time"],
                        period:this.Period,
                        right:this.Right
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
        var realtimeData = KLineChartContainer.JsonDataToRealtimeData(data, this.Symbol);
        if (!realtimeData) 
        {
            JSConsole.Chart.Log('[KLineChartContainer::RecvRealtimeData] recvdata error', recvdata);
            return;
        }
        var item = this.SourceData.Data[this.SourceData.Data.length - 1];   //最新的一条数据
        var lastDataCount = this.GetHistoryDataCount();                     //保存下上一次的数据个数

        if (this.SourceData.Data.length==0) //第1条数据
        {
            var newItem =new HistoryData();
            HistoryData.CopyTo(newItem, realtimeData);
            this.SourceData.Data.push(newItem);
        }
        else if (item.Date == realtimeData.Date)   //实时行情数据更新
        {
            JSConsole.Chart.Log('[KLineChartContainer::RecvRealtimeData] update kline by minute data', realtimeData);
            HistoryData.CopyTo(item, realtimeData);
        }
        else if (item.Date < realtimeData.Date)   //新增加数据
        {
            JSConsole.Chart.Log('[KLineChartContainer::RecvRealtimeData] insert kline by minute data', realtimeData);
            var newItem = new HistoryData();
            HistoryData.CopyTo(newItem, realtimeData);

            //没有前收盘就用上一个数据的收盘价
            if (!IFrameSplitOperator.IsNumber(newItem.YClose) && this.SourceData.Data.length>0)
                newItem.YClose=this.SourceData.Data[this.SourceData.Data.length-1].YClose;

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
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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
                        field: ["name", "symbol", "price", "yclose", "minutecount", "minute", "date", "time"],
                        period:this.Period,
                        right:this.Right
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
            JSConsole.Chart.Log(`[KLineChartContainer::SetSourceDatatLimit] Period=${item.Period}, MaxCount=${item.MaxCount}`);
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
            JSConsole.Chart.Log(`[KLineChartContainer::ReduceSourceData] remove data ${removeCount}, dataOffset=${dataOffset}`);
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
        JSConsole.Chart.Log(`[KLineChartContainer::RecvMinuteRealtimeData] update kline by 1 minute data [${lastSourceDataCount}->${this.SourceData.Data.length}]`);

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period,true) && !this.IsApiPeriod)    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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

        JSConsole.Chart.Log(`[KLineChartContainer::RecvMinuteRealtimeDataV2] update kline by 1 minute data [${lastDataCount}->${this.SourceData.Data.length}]`);

        var bindData = new ChartData();
        bindData.Data = this.SourceData.Data;
        bindData.Period = this.Period;
        bindData.Right = this.Right;
        bindData.DataType = this.SourceData.DataType;
        bindData.Symbol = this.Symbol;

        if (bindData.Right > 0 && ChartData.IsDayPeriod(bindData.Period, true) && !this.IsApiPeriod)    //复权(日线数据才复权)
        {
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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

    this.ClearIndexPaint=function() //清空指标
    {
        if (this.Frame && this.Frame.SubFrame)
        {
            for(var i=0;i<this.Frame.SubFrame.length;++i)
            {
                this.DeleteIndexPaint(i, true);
            }
        }
    }

    //周期切换
    this.ChangePeriod = function (period, option) 
    {
        var isChangeKLineDrawType = false;
        var right=null; //复权
        if (option && option.KLine) 
        {
            if (IFrameSplitOperator.IsNumber(option.KLine.DrawType)) isChangeKLineDrawType = true;
            if (IFrameSplitOperator.IsNumber(option.KLine.Right)) right=option.KLine.Right;
        };

        if (this.Period == period) 
        {
            if (isChangeKLineDrawType) this.ChangeKLineDrawType(option.KLine.DrawType);
            return;
        }

        if (isChangeKLineDrawType) this.ChangeKLineDrawType(option.KLine.DrawType, false);   //切换K线类型, 不重绘
        
        var isDataTypeChange = true;
        if (this.SourceData)
        {
            var isDataTypeChange=false;
            if (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END) 
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
        }
        
        this.Period = period;
        if (right!=null) this.Right=right;
        this.ClearCustomKLine();
        if (isDataTypeChange == false && !this.IsApiPeriod) 
        {
            this.Update();
            return;
        }

        if (ChartData.IsDayPeriod(this.Period, true)) 
        {
            this.ClearIndexPaint();
            this.CancelAutoUpdate();                    //先停止更新
            this.AutoUpdateEvent(false,"KLineChartContainer::ChangePeriod");
            this.RequestHistoryData();                  //请求日线数据
            //this.ReqeustKLineInfoData();
        }
        else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period))
        {
            this.ClearIndexPaint();
            this.CancelAutoUpdate();                    //先停止更新
            this.AutoUpdateEvent(false,"KLineChartContainer::ChangePeriod");
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }
    }

    //复权切换
    this.ChangeRight = function (right) 
    {
        if (!MARKET_SUFFIX_NAME.IsEnableRight(this.Period,this.Symbol)) return;

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
                this.AutoUpdateEvent(false,"KLineChartContainer::ChangeRight");
                this.RequestHistoryData();                  //请求日线数据
                //this.ReqeustKLineInfoData();
            }
            else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period)) 
            {
                this.CancelAutoUpdate();                    //先停止更新
                this.AutoUpdateEvent(false,"KLineChartContainer::ChangeRight");
                this.ReqeustHistoryMinuteData();            //请求分钟数据
            }
        }
    }

  //删除某一个窗口的指标 bCallDestory=是否调用图形销毁函数
    this.DeleteIndexPaint = function (windowIndex, bCallDestroy) 
    {
        let paint = new Array();  //踢出当前窗口的指标画法
        for (var i=0;i<this.ChartPaint.length; ++i) 
        {
            let item = this.ChartPaint[i];
            if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame)
            {
                paint.push(item);
            }
            else
            {
                if (bCallDestroy===true) 
                {
                    if (item && item.OnDestroy) item.OnDestroy();   //图形销毁
                }
            }
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
        let scriptData = new JSCommonIndexScript.JSIndexScript();
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
        this.DeleteIndexPaint(windowIndex, true);
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
        this.DeleteIndexPaint(windowIndex, true);
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
            let indexData = indexInfo;
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

        var period=null, right=null;
        if (option.KLine)
        {
            if (IFrameSplitOperator.IsNumber(option.KLine.Period) && option.KLine.Period!=this.Period) period=option.KLine.Period;  //周期
            if (IFrameSplitOperator.IsNumber(option.KLine.Right) && option.KLine.Right!=this.Right) right=option.KLine.Right;       //复权
        }

        var bRefreshData= (period!=null || right!=null);

        //清空所有的指标图型
        for (var i = 0; i < currentLength; ++i) 
        {
            this.DeleteIndexPaint(i, true);
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
                titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
                this.TitlePaint[i + 1] = titlePaint;
            }
        }

        var systemScript = new JSCommonIndexScript.JSIndexScript();
        var bindData = this.ChartPaint[0].Data;
        for (var i = 0; i < count; ++i) 
        {
            var windowIndex = i;
            var item=option.Windows[i];
            var frameItem=null;
            if(option.Frame && option.Frame.length>i) frameItem=option.Frame[i];
            var titleIndex = windowIndex + 1;
            this.TitlePaint[titleIndex].Data = [];
            this.TitlePaint[titleIndex].Title = null;

            if (item.Script)    //自定义指标
            {
                this.WindowIndex[i]=new ScriptIndex(item.Name,item.Script,item.Args,item);    //脚本执行
                if (!bRefreshData) this.BindIndexData(windowIndex,bindData);   //执行脚本
            }
            else
            {
                var indexID = item.Index;
                var indexItem = JSIndexMap.Get(indexID);
                if (indexItem) 
                {
                    this.WindowIndex[i] = indexItem.Create();
                    this.CreateWindowIndex(windowIndex);
                    if (!bRefreshData) this.BindIndexData(windowIndex, bindData);
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
                            FloatPrecision: indexInfo.FloatPrecision, Condition: indexInfo.Condition,
                            OutName:indexInfo.OutName
                        };

                        this.WindowIndex[i] = new ScriptIndex(indexData.Name, indexData.Script, indexData.Args, indexData);    //脚本执行
                        if (!bRefreshData) this.BindIndexData(windowIndex, bindData);   //执行脚本
                    }
                }
            }

            if (IFrameSplitOperator.IsNumber(item.IndexParamSpace)) this.Frame.SubFrame[i].Frame.IndexParamSpace = item.IndexParamSpace;
            if (IFrameSplitOperator.IsNumber(item.IndexTitleSpace)) this.Frame.SubFrame[i].Frame.IndexTitleSpace = item.IndexTitleSpace;
            
            if (item.IsDrawTitleBG==true)  this.Frame.SubFrame[i].Frame.IsDrawTitleBG=item.IsDrawTitleBG;

            if (frameItem)
            {
                if (frameItem.SplitCount) this.Frame.SubFrame[i].Frame.YSplitOperator.SplitCount = frameItem.SplitCount;
                if (frameItem.IsShowBorder == false) this.Frame.SubFrame[i].Frame.IsShowBorder = frameItem.IsShowBorder;
                if (frameItem.IsShowXLine === false || frameItem.IsShowXLine ===true) this.Frame.SubFrame[i].Frame.IsShowXLine = frameItem.IsShowXLine;
                if (frameItem.IsShowYLine===false ||frameItem.IsShowYLine===true) this.Frame.SubFrame[i].Frame.IsShowYLine=frameItem.IsShowYLine;
                
                if (frameItem.IsShowLeftText === false || item.IsShowLeftText === true) this.Frame.SubFrame[i].Frame.IsShowYText[0] = frameItem.IsShowLeftText;            //显示左边刻度
                if (frameItem.IsShowRightText === false || item.IsShowRightText === true) this.Frame.SubFrame[i].Frame.IsShowYText[1] = frameItem.IsShowRightText;         //显示右边刻度 
            }
        }

        //最后一个显示X轴坐标
        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            var item = this.Frame.SubFrame[i].Frame;
            if (i == this.Frame.SubFrame.length - 1) item.XSplitOperator.ShowText = true;
            else item.XSplitOperator.ShowText = false;
        }

        if (!bRefreshData)
        {
            this.UpdataDataoffset();           //更新数据偏移
            this.Frame.SetSizeChage(true);
            this.ResetFrameXYSplit();
            this.UpdateFrameMaxMin();          //调整坐标最大 最小值
            this.Draw();
        }
        else
        {
            this.Frame.SetSizeChage(true);
            if (period!=null) this.ChangePeriod(period, option);
            else if (right!=null) this.ChangeRight(right);
        }
    }

    this.RemoveIndexWindow=function(id)
    {
        JSConsole.Chart.Log('[KLineChartContainer::RemoveIndexWindow] remove id', id);
        if (id==0) return;
        if (!this.Frame.SubFrame) return;
        if (id>=this.Frame.SubFrame.length) return;

        var delFrame=this.Frame.SubFrame[id].Frame;
        this.DeleteIndexPaint(id, true);
        this.Frame.SubFrame.splice(id,1);
        this.WindowIndex.splice(id,1);
        this.TitlePaint.splice(id+1,1); //删除对应的动态标题

        for(var i=0;i<this.Frame.SubFrame.length;++i)
        {
            var item=this.Frame.SubFrame[i].Frame;
            if (i==this.Frame.SubFrame.length-1) item.XSplitOperator.ShowText=true;
            else item.XSplitOperator.ShowText=false;

            item.Identify=i;
        }

        if (this.ChartDrawPicture.length>0)
        {
            var aryDrawPicture=[];
            for(var i=0;i<this.ChartDrawPicture.length;++i)
            {
                var item=this.ChartDrawPicture[i];
                if (item.Frame==delFrame) continue;
                aryDrawPicture.push(item);
            }
            this.ChartDrawPicture=aryDrawPicture;
        }

        this.Frame.SetSizeChage(true);
        this.UpdateFrameMaxMin();
        this.ResetFrameXYSplit();
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

    this.TryClickIndexTitle=function(x,y)
    {
        for(var i in this.TitlePaint)
        {
            var item=this.TitlePaint[i];
            if (!item.IsClickTitle) continue;
            if (!item.IsClickTitle(x,y)) continue;

            var data={ Point:{X:x, Y:y}, Title:item.Title, FrameID:item.Frame.Identify };
            JSConsole.Chart.Log('[KLineChartContainer::TryClickIndexTitle] click title ', data);

            var event=this.GetEvent(JSCHART_EVENT_ID.ON_CLICK_INDEXTITLE);
            if (event && event.Callback) event.Callback(event,data,this);
            
            return true;
        }

        return false;
    }

    this.StopAutoUpdate = function () 
    {
        this.IsAutoUpdate = false;
        this.CancelAutoUpdate();
        this.AutoUpdateEvent(false,"KLineChartContainer::StopAutoUpdate");
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
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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

        var firstSubFrame=null;
        for (var i = 0; i < this.Frame.SubFrame.length; ++i) 
        {
            if (i==0) firstSubFrame=this.Frame.SubFrame[i].Frame;
            this.BindIndexData(i, bindData);
        }

        //绑定K线数据到Y轴分割
        if (firstSubFrame && firstSubFrame.YSplitOperator)  
        {
            firstSubFrame.YSplitOperator.Symbol=this.Symbol;
            firstSubFrame.YSplitOperator.Data=this.ChartPaint[0].Data;          //K线数据
            firstSubFrame.YSplitOperator.Period=this.Period;                    //周期
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
                    var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
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

        this.ReqeustKLineInfoData({FunctionName:"Update"});

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
        this.AutoUpdateEvent(false,"KLineChartContainer::ChangeSymbol");
        this.ClearCustomKLine();
        this.Symbol = symbol;
        if (IsIndexSymbol(symbol)) this.Right = 0;    //指数没有复权

        this.ClearIndexPaint();

        if (ChartData.IsDayPeriod(this.Period, true)) 
        {
            this.RequestHistoryData();                  //请求日线数据
            //this.ReqeustKLineInfoData();
        }
        else if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period))
        {
            this.ReqeustHistoryMinuteData();            //请求分钟数据
        }
    }

    this.ReqeustKLineInfoData = function (obj) 
    {
        if (obj && obj.FunctionName=="RecvDragDayData") //增量更新
        {
            obj.Update=true;
        }
        else
        {
            if (this.ChartPaint.length > 0) 
            {
                var klinePaint = this.ChartPaint[0];
                klinePaint.InfoData = new Map();
            }
            obj.Update=false;
        }

        //信息地雷信息
        for (var i in this.ChartInfo) 
        {
            this.ChartInfo[i].RequestData(this,obj);
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

        if (bUpdate == true) this.ReqeustKLineInfoData({ FunctionName:"SetKLineInfo" });
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

        var item=this.OverlayChartPaint[0];
        if (!item) return;
        var symbol = item.Symbol;
        if (!symbol) return;

        var self = this;
        var dataCount = this.GetRequestDataCount();
        var firstDate = this.SourceData.Data[0].Date;
        item.Status=OVERLAY_STATUS_ID.STATUS_REQUESTDATA_ID;
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
                item.Status=OVERLAY_STATUS_ID.STATUS_RECVDATA_ID;
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
                item.Status=OVERLAY_STATUS_ID.STATUS_RECVDATA_ID;
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
            var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
            bindData.Data = rightData;
        }

        var aryOverlayData = this.SourceData.GetOverlayData(bindData.Data);      //和主图数据拟合以后的数据
        bindData.Data = aryOverlayData;

        if (ChartData.IsDayPeriod(bindData.Period, false))   //周期数据
        {
            var periodData = bindData.GetPeriodData(bindData.Period);
            bindData.Data = periodData;
        }

        var paint=this.OverlayChartPaint[0];
        if (paint)
        {
            paint.Data = bindData;
            paint.SourceData = sourceData;
            paint.Title = data.name;
            paint.Symbol = data.symbol;
            paint.Status=OVERLAY_STATUS_ID.STATUS_FINISHED_ID;
            this.Frame.SubFrame[0].Frame.YSplitOperator.CoordinateType = 1; //调整为百份比坐标
        }
        
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

    //JSConsole.Chart.Log("xStep="+xStep+" yStep="+yStep);
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
    this.UpdataChartInfo = function () 
    {
        //TODO: 根据K线数据日期来做map, 不在K线上的合并到下一个k线日期里面
        var mapInfoData = new Map();
        if (this.Period==0) //日线数据 根据日期
        {
            for (var i in this.ChartInfo) 
            {
                var infoData = this.ChartInfo[i].Data;
                for (var j in infoData)
                {
                    var item = infoData[j];
                    if (mapInfoData.has(item.Date.toString())) 
                        mapInfoData.get(item.Date.toString()).Data.push(item);
                    else 
                        mapInfoData.set(item.Date.toString(), { Data: new Array(item) });
                }
            }
        }
        else if (ChartData.IsDayPeriod(this.Period,false))
        {
            mapInfoData=new Map();
            var hisData=this.ChartPaint[0].Data;
            if (hisData && hisData.Data && hisData.Data.length>0)
            {
                var fristKItem=hisData.Data[0];
                var aryInfo=[];
                for(var i in this.ChartInfo)
                {
                    var infoItem=this.ChartInfo[i];
                    for(var j in infoItem.Data)
                    {
                        var item=infoItem.Data[j];
                        if (item.Date>=fristKItem.Date) //在K线范围内的才显示
                            aryInfo.push(item);
                    }
                }
                aryInfo.sort(function(a,b) { return a.Date-b.Date });   //排序

                for(var i=0;i<hisData.Data.length;)
                {
                    var kItem=hisData.Data[i];  //K线数据
                    if (aryInfo.length<=0) break;

                    var infoItem=aryInfo[0];
                    if (kItem.Date<infoItem.Date) 
                    {
                        ++i;
                        continue;
                    }

                    //信息地雷日期<K线上的日期 就是属于这个K线上的
                    if (mapInfoData.has(kItem.Date.toString()))
                        mapInfoData.get(kItem.Date.toString()).Data.push(infoItem);
                    else
                        mapInfoData.set(kItem.Date.toString(),{Data:new Array(infoItem)});

                    aryInfo.shift();
                    //JSConsole.Chart.Log('[KLineChartContainer::UpdataChartInfo]',item);
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

        if (this.IsApiPeriod)
        {

        }
        else
        {
            if (bindData.Right > 0)    //复权
            {
                var rightData = bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
                bindData.Data = rightData;
            }
    
            if (ChartData.IsDayPeriod(bindData.Period, false) || ChartData.IsMinutePeriod(bindData.Period, false))   //周期数据
            {
                var periodData = bindData.GetPeriodData(bindData.Period);
                bindData.Data = periodData;
            }
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
        if (this.AutoUpdateTimer) 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    //数据自动更新
    this.AutoUpdate = function (waitTime)  //waitTime 更新时间
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;
        if (this.IsDestroy) return;

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
        JSConsole.Chart.Log(`[KLineChartContainer::GetMaxPageSize] width=${width} barWidth=${barWidth} pageSize=${pageSize}`);
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

        if (ChartData.IsMinutePeriod(this.Period, true) || ChartData.IsSecondPeriod(this.Period)) //下载分钟数据
        {
            JSConsole.Chart.Log(`[KLineChartContainer.DragDownloadData] Minute:[Enable=${this.DragDownload.Minute.Enable}, IsEnd=${this.DragDownload.Minute.IsEnd}, Status=${this.DragDownload.Minute.Status}, Period=${this.Period}]`);
            if (!this.DragDownload.Minute.Enable) return;
            if (this.DragDownload.Minute.IsEnd) return; //全部下载完了
            if (this.DragDownload.Minute.Status != 0) return;
            this.RequestDragMinuteData();
        }
        else if (ChartData.IsDayPeriod(this.Period, true)) // 下载日线
        {
            JSConsole.Chart.Log(`[KLineChartContainer.DragDownloadData] Day:[Enable=${this.DragDownload.Minute.Enable}, IsEnd=${this.DragDownload.Minute.IsEnd}, Status=${this.DragDownload.Minute.Status}]`);
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
            "first": { date: firstItem.Date, time: firstItem.Time },
        };

        if (this.NetworkFilter) {
            var obj =
            {
                Name: 'KLineChartContainer::RequestDragMinuteData', //类名::函数
                Explain: '拖拽分钟|秒K线数据下载',
                Request: { Url: this.DragMinuteKLineApiUrl, Type: 'POST', Data: postData, Period:this.Period, Right:this.Right },
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

        if (IFrameSplitOperator.IsNonEmptyArray(this.OverlayChartPaint))
        {
            postData.overlay=[];
            for(var i=0;i<this.OverlayChartPaint.length;++i)
            {
                var item=this.OverlayChartPaint[i];
                if (item.Symbol) postData.overlay.push( { symbol:item.Symbol } );
            }
        }

        if (this.NetworkFilter) {
            var obj =
            {
                Name: 'KLineChartContainer::RequestDragDayData', //类名::函数
                Explain: '拖拽日K数据下载',
                Request: { Url: this.DragKLineApiUrl, Type: 'POST', Data: postData , Period:this.Period, Right:this.Right },
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
        if (!aryDayData || aryDayData.length<=0)
        {
            this.DragDownload.Day.IsEnd=true;   //下完了
            return;
        }
        
        var lastDataCount = this.GetHistoryDataCount();   //保存下上一次的数据个数
        var firstData=this.SourceData.Data[0];
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
        this.UpdateOverlayDragDayData(data);
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

        //更新信息地雷
        this.ReqeustKLineInfoData( { FunctionName:"RecvDragDayData", StartDate:firstData.Date } );
    }

    //更新叠加数据
    this.UpdateOverlayDragDayData=function(data)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(this.OverlayChartPaint)) return;
        var aryRecvOverlayData=data.overlay;
        if (!IFrameSplitOperator.IsNonEmptyArray(aryRecvOverlayData)) return;

        for(var i=0;i<this.OverlayChartPaint.length; ++i)
        {
            var item=this.OverlayChartPaint[i];
            if (!item.Symbol) continue;

            if (!item.MainData) continue;   //等待主图股票数据未下载完
            if (item.Status!=OVERLAY_STATUS_ID.STATUS_FINISHED_ID) continue;

            var findData=null;
            for(var j=0;j<aryRecvOverlayData.length;++j)    //查找对应的叠加股票数据
            {
                var overlayItem=aryRecvOverlayData[j];
                if (overlayItem.symbol==item.Symbol)
                {
                    findData=overlayItem;
                    break;
                }
            }

            if (!findData) continue;

            var aryDayData=KLineChartContainer.JsonDataToHistoryData(findData);
            var sourceData=item.SourceData; //叠加股票的所有数据

            var firstData=sourceData.Data[0];
            var endIndex=null;
            for(var j=aryDayData.length-1;j>=0;--j)
            {
                var itemData=aryDayData[j];
                if (firstData.Date>itemData.Date) 
                {
                    endIndex=j;
                    break;
                }
                else if (firstData.Date==itemData.Date)
                {
                    firstData.YClose=itemData.YClose;
                    endIndex=j-1;
                    break;
                }
            }

            if (endIndex==null && endIndex<0) continue;
            
            for(var j=0; j<aryDayData.length && j<=endIndex;++j)    //数据往前插
            {
                var itemData=aryDayData[j];
                sourceData.Data.splice(j,0,itemData);
            }

            var bindData=new ChartData();
            bindData.Data=sourceData.Data;
            bindData.Period=this.Period;
            bindData.Right=this.Right;
            bindData.DataType=0;

            if (bindData.Right>0 && MARKET_SUFFIX_NAME.IsSHSZStockA(findData.symbol) && !this.IsApiPeriod)    //复权数据 ,A股才有有复权
            {
                var rightData=bindData.GetRightData(bindData.Right, { AlgorithmType: this.RightFormula });
                bindData.Data=rightData;
            }

            var aryOverlayData=this.SourceData.GetOverlayData(bindData.Data, this.IsApiPeriod);      //和主图数据拟合以后的数据
            bindData.Data=aryOverlayData;

            if (ChartData.IsDayPeriod(bindData.Period,false) && !this.IsApiPeriod)   //周期数据
            {
                var periodData=bindData.GetPeriodData(bindData.Period);
                bindData.Data=periodData;
            }

            item.Data=bindData;
        }
    }

    this.SetCustomVerical = function (windowId, data) 
    {
        if (!this.Frame) return;
        if (windowId >= this.Frame.SubFrame.length) return;

        var item = this.Frame.SubFrame[windowId];
        if (item.Frame) item.Frame.CustomVerticalInfo = data;
    }

    this.OnSize=function()
    {
        if (!this.Frame) return;
        if (!this.Frame.OnSize) return;

        var obj=this.Frame.OnSize();
        this.Frame.SetSizeChage(true);
        if (obj.Changed)
        {
            this.UpdataDataoffset();
            this.UpdatePointByCursorIndex();
            this.UpdateFrameMaxMin();
        }

        this.Draw();
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
    var fclose=9, yfclose=10;   //结算价, 前结算价
    var bfactor=11, afactor=12; //前, 后复权因子
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

        //可选配置
        if (IFrameSplitOperator.IsNumber(jsData[position])) item.Position = jsData[position];//期货持仓
        if (IFrameSplitOperator.IsNumber(jsData[fclose])) item.FClose=jsData[fclose];       //期货结算价
        if (IFrameSplitOperator.IsNumber(jsData[yfclose])) item.YFClose=jsData[yfclose];    //期货前结算价

        if (IFrameSplitOperator.IsNumber(jsData[bfactor])) item.BFactor=jsData[bfactor];    //前复权因子
        if (IFrameSplitOperator.IsNumber(jsData[afactor])) item.AFactor=jsData[afactor];    //后复权因子
        if (!IFrameSplitOperator.IsNumber(item.Open)) continue; 

        aryDayData.push(item);
    }

    return aryDayData;
}

KLineChartContainer.JsonDataToRealtimeData = function (data, symbol) 
{
    if (!data) return null;
    if (!IFrameSplitOperator.IsNonEmptyArray(data.stock)) return null;

    var stock=null;
    for(var i=0;i<data.stock.length;++i)
    {
        var item=data.stock[i];
        if (item && item.symbol==symbol)
        {
            stock=item;
            break;
        }
    }
    if (!stock) return null;

    var upperSymbol = symbol.toUpperCase();
    var isSHSZ = MARKET_SUFFIX_NAME.IsSHSZ(upperSymbol);

    var item = new HistoryData();
    item.Date = stock.date;
    item.Open = stock.open;
    item.YClose = stock.yclose;
    item.High = stock.high;
    item.Low = stock.low;
    item.Vol=stock.vol;    //单位股
    item.Amount = stock.amount;
    item.Close = stock.price;

    if (IFrameSplitOperator.IsNumber(stock.position)) item.Position = stock.position; //持仓量
    if (IFrameSplitOperator.IsNumber(stock.bfactor)) item.BFactor=stock.bfactor;    //前复权因子
    if (IFrameSplitOperator.IsNumber(stock.afactor)) item.AFactor=stock.afactor;    //后复权因子
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
        item.Vol = jsData.vol; //单位股
        item.Amount = jsData.amount;
        if (jsData.date > 0) item.Date = jsData.date;
        else item.Date = date;
        item.Time = jsData.time;
        item.YClose = preClose;
        if (IFrameSplitOperator.IsNumber(jsData.position)) item.Position = jsData.position; //持仓量

        if (!IFrameSplitOperator.IsNumber(item.Close)) //当前没有价格 使用上一个价格填充
        {
            item.Close = preClose;
            item.Open = item.High = item.Low = item.Close;
        }

        //价格是0的 都用空
        if (!IFrameSplitOperator.IsNumber(item.Open)) item.Open = null;
        if (!IFrameSplitOperator.IsNumber(item.Close)) item.Close = null;
        if (!IFrameSplitOperator.IsNumber(item.High)) item.High = null;
        if (!IFrameSplitOperator.IsNumber(item.Low)) item.Low = null;

        //上次价格
        if (IFrameSplitOperator.IsNumber(jsData.price)) preClose = jsData.price;

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
    var date = 0, yclose = 1, open = 2, high = 3, low = 4, close = 5, vol = 6, amount = 7, time = 8, position = 9;
    for (var i = 0; i < list.length; ++i) 
    {
        var item = new HistoryData();
        var jsData=list[i];
        item.Date = jsData[date];
        item.Open = jsData[open];
        item.YClose = jsData[yclose];
        item.Close = jsData[close];
        item.High = jsData[high];
        item.Low = jsData[low];
        item.Vol = jsData[vol];    //原始单位股
        item.Amount = jsData[amount];
        item.Time = jsData[time];
        if (IFrameSplitOperator.IsNumber(jsData[position])) item.Position = jsData[position]; //期货持仓

        aryDayData.push(item);
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
    this.AutoUpdateTimer=null;                         //更新定时器
    this.TradeDate = 0;                           //行情交易日期
    this.LoadDataSplashTitle = '下载分钟数据';
    this.UpdateUICallback;                    //数据到达回调

    this.DayCount = 1;                       //显示几天的数据
    this.DayData;                            //多日分钟数据

    this.MinuteApiUrl = g_JSChartResource.Domain + "/API/Stock";
    this.HistoryMinuteApiUrl = g_JSChartResource.Domain + "/API/StockMinuteData";   //历史分钟数据

    //手机拖拽
    this.ontouchstart = function (e) 
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        this.IsOnTouch = true;
        var jsChart = this;
        if (jsChart.DragMode == 0) return;

        if (this.IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock) 
            {
                var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock(x, y)) return;
            }

            //长按2秒,十字光标
            this.ClearTouchTimer();

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

            var T_ShowCorssCursor=()=>
            {
                if (this.ChartCorssCursor.IsShow === true)    //移动十字光标
                {
                    var x = drag.Click.X;
                    var y = drag.Click.Y;
                    if (jsChart.IsForceLandscape) y = jsChart.UIElement.Height - drag.Click.Y;    //强制横屏Y计算
                    jsChart.OnMouseMove(x, y, e);
                }
            }

            if (this.EnableZoomIndexWindow)
            {
                this.PhoneDBClick.AddTouchStart(touches[0].clientX, touches[0].clientY, Date.now());
                JSConsole.Chart.Log("[MinuteChartContainer::OnTouchStart] PhoneDBClick ", this.PhoneDBClick);
            }

            if (this.EnableScrollUpDown==true)
            {
                this.TouchTimer=setTimeout(()=>
                {
                    this.MouseDrag=null;
                    T_ShowCorssCursor();
                }, 800);
            }

            this.MouseDrag=drag;
            this.PhoneTouchInfo={ Start:{X:touches[0].clientX, Y:touches[0].clientY }, End:{ X:touches[0].clientX, Y:touches[0].clientY } };
            if (this.EnableScrollUpDown==false)
                T_ShowCorssCursor();

            this.TouchEvent({ EventID:JSCHART_EVENT_ID.ON_PHONE_TOUCH, FunctionName:"OnTouchStart"}, e);
        }
    }

    this.ontouchmove = function (e) 
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var jsChart = this;
        var drag = jsChart.MouseDrag;
        var touches = this.GetToucheData(e, jsChart.IsForceLandscape);
        if (this.ChartCorssCursor.IsShow === true && this.IsPhoneDragging(e)) 
        {
            if (drag == null) 
            {
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                this.LastMovePoint={ X:x, Y:y };

                if (this.DrawMoveTimer) return;
                this.DrawMoveTimer=setTimeout(()=>
                {
                    if (!this.LastMovePoint) return;
                    this.OnMouseMove(this.LastMovePoint.X, this.LastMovePoint.Y, e);
                    this.DrawMoveTimer=null;
                }, this.DrawMoveWaitTime);
            }
        }

        if (drag!=null)
        {
            //TODO:上下滚动
            this.ClearTouchTimer();

            this.MouseDrag=null;
            var x = touches[0].clientX;
            var y = touches[0].clientY;
            this.OnMouseMove(x,y,e);
        }

        if (this.PhoneTouchInfo)
        {
            this.PhoneTouchInfo.End.X=touches[0].clientX;
            this.PhoneTouchInfo.End.Y=touches[0].clientY;
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
        this.ChartSplashPaint.SplashTitle = this.LoadDataSplashTitle;
        this.ChartSplashPaint.HQChart=this;

        //创建框架容器
        this.Frame = new HQTradeFrame();
        this.Frame.ChartBorder = new ChartBorder();
        this.Frame.ChartBorder.UIElement = this.UIElement;
        this.Frame.ChartBorder.Top = 25;
        this.Frame.ChartBorder.Left = 50;
        this.Frame.ChartBorder.Bottom = 20;
        this.Frame.Canvas = this.Canvas;
        this.Frame.ZoomStartWindowIndex=2;
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
            titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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
            frame.Identify=i;
            if (i < 2) frame.ChartBorder.TitleHeight = 0;
            frame.XPointCount = 243;

            var DEFAULT_HORIZONTAL = [9, 8, 7, 6, 5, 4, 3, 2, 1];
            frame.HorizontalMax = DEFAULT_HORIZONTAL[0];
            frame.HorizontalMin = DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length - 1];

            if (i == 0) 
            {
                frame.YSplitOperator = new FrameSplitMinutePriceY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('price');
                frame.YSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
            }
            else 
            {
                frame.YSplitOperator = new FrameSplitY();
                frame.YSplitOperator.FrameSplitData = this.FrameSplitData.get('double');
                frame.YSplitOperator.LanguageID = this.LanguageID;
                frame.YSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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

    this.CreateSubFrameItem=function(id)
    {
        var border=new ChartBorder();
        border.UIElement=this.UIElement;

        var frame=new MinuteFrame();
        frame.Canvas=this.Canvas;
        frame.ChartBorder=border;
        frame.Identify=id;                   //窗口序号
        frame.XPointCount=243;

        if (id>=2)
        {
            if (this.ModifyIndexDialog) frame.ModifyIndexEvent=this.ModifyIndexDialog.DoModal;        //绑定菜单事件
            if (this.ChangeIndexDialog) frame.ChangeIndexEvent=this.ChangeIndexDialog.DoModal;
        }

        var DEFAULT_HORIZONTAL=[9,8,7,6,5,4,3,2,1];
        frame.HorizontalMax=DEFAULT_HORIZONTAL[0];
        frame.HorizontalMin=DEFAULT_HORIZONTAL[DEFAULT_HORIZONTAL.length-1];

        frame.YSplitOperator=new FrameSplitY();
        frame.YSplitOperator.LanguageID=this.LanguageID;
        frame.YSplitOperator.FrameSplitData=this.FrameSplitData.get('double');
        frame.YSplitOperator.Frame=frame;
        frame.YSplitOperator.ChartBorder=border;
        frame.XSplitOperator=new FrameSplitMinuteX();
        frame.XSplitOperator.Frame=frame;
        frame.XSplitOperator.ChartBorder=border;
        frame.XSplitOperator.ShowText=false;
        frame.XSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
        frame.YSplitOperator.GetEventCallback=(id)=> { return this.GetEventCallback(id); }

        //K线数据绑定
        var xPointCouont=this.Frame.SubFrame[0].Frame.XPointCount;
        frame.XPointCount=xPointCouont;
        frame.Data=this.ChartPaint[0].Data;

        for(var j in DEFAULT_HORIZONTAL)
        {
            frame.HorizontalInfo[j]= new CoordinateInfo();
            frame.HorizontalInfo[j].Value=DEFAULT_HORIZONTAL[j];
            frame.HorizontalInfo[j].Message[1]=DEFAULT_HORIZONTAL[j].toString();
            frame.HorizontalInfo[j].Font="14px 微软雅黑";
        }

        var subFrame=new SubFrameItem();
        subFrame.Frame=frame;
        subFrame.Height=10;

        return subFrame;
    }

    this.UpdateXShowText=function()
    {
        var bLastFrame=true;
        for(var i=this.Frame.SubFrame.length-1;i>=0;--i)
        {
            var item=this.Frame.SubFrame[i].Frame;
            var subFrame=this.Frame.SubFrame[i];

            if (bLastFrame)
            {
                item.XSplitOperator.ShowText=true;
                if (subFrame.Height>0) bLastFrame=false;
            }
            else
            {
                item.XSplitOperator.ShowText=false;
            }
        }
    }

    //删除某一个窗口的指标 bCallDestory=是否调用图形销毁函数
    this.DeleteIndexPaint = function (windowIndex, bCallDestroy) 
    {
        let paint = new Array();
        for (var i=0;i<this.ChartPaint.length;++i)  //踢出当前窗口的指标画法
        {
            let item = this.ChartPaint[i];
            if (i == 0 || item.ChartFrame != this.Frame.SubFrame[windowIndex].Frame)
            {
                paint.push(item);
            }
            else
            {
                if (bCallDestroy===true) 
                {
                    if (item && item.OnDestroy) item.OnDestroy();   //图形销毁
                }
            }
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
        this.DeleteIndexPaint(windowIndex, true);
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

    this.RemoveIndexWindow=function(id)
    {
        JSConsole.Chart.Log('[MinuteChartContainer::RemoveIndexWindow] remove id', id);

        if (id<2) return;
        if (!this.Frame.SubFrame) return;
        if (id>=this.Frame.SubFrame.length) return;

        var delFrame=this.Frame.SubFrame[id].Frame;
        this.DeleteIndexPaint(id, true);
        this.Frame.SubFrame.splice(id,1);
        this.WindowIndex.splice(id,1);
        this.TitlePaint.splice(id+1,1); //删除对应的动态标题

        for(var i=0;i<this.Frame.SubFrame.length;++i)
        {
            var item=this.Frame.SubFrame[i].Frame;
            if (i==this.Frame.SubFrame.length-1) item.XSplitOperator.ShowText=true;
            else item.XSplitOperator.ShowText=false;

            item.Identify=i;
        }

        this.Frame.SetSizeChage(true);
        this.UpdateFrameMaxMin();
        this.ResetFrameXYSplit();
        this.Draw();
    }

    this.ClearIndexPaint=function()
    {
        if (this.Frame && this.Frame.SubFrame)
        {
            for(var i=2;i<this.Frame.SubFrame.length;++i)
            {
                if (i>=2) this.DeleteIndexPaint(i, true);
            }
        }
    }

    //切换股票代码
    this.ChangeSymbol = function (symbol) 
    {
        this.Symbol = symbol;
        this.CancelAutoUpdate();    //先停止定时器
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
        this.ClearIndexPaint();
        this.RequestData();
    }

    this.ChangeDayCount = function (count) 
    {
        if (count < 0 || count > 10) return;
        this.DayCount = count;
        this.CancelAutoUpdate();    //先停止定时器
        this.ClearIndexPaint();
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
        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
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
                self.ChartSplashPaint.EnableSplash(false);
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
            self.ChartSplashPaint.EnableSplash(false);
            self.RecvHistoryMinuteData(data);
        }
        });
    }

    this.RecvHistoryMinuteData = function (recvdata) 
    {
        var data = recvdata.data;
        if (data.code!=0) 
        {
            JSConsole.Chart.Log('[MinuteChartContainer::RecvHistoryMinuteData] failed.',data);
            return;
        }
        this.DayData = MinuteChartContainer.JsonDataToMinuteDataArray(data);;
        this.Symbol = data.symbol;
        this.Name = data.name;

        this.CaclutateLimitPrice(this.DayData[0].YClose, data.data[0].limitprice); //计算涨停价格

        this.UpdateHistoryMinuteUI();
        this.RecvMinuteDataEvent();
        this.RequestOverlayHistoryMinuteData();

        if (typeof (this.UpdateUICallback) == 'function') this.UpdateUICallback('RecvHistoryMinuteData', this);

        this.AutoUpdate();
    }

    this.CaclutateLimitPrice=function(yClose, limitData)
    {
        this.LimitPrice=null;
        //var limitData=data.stock[0].limitprice;
        if (limitData && limitData.max>0 && limitData.min>0)    //API里带涨停价格 直接使用
        {
            this.LimitPrice={ Max:limitData.max, Min:limitData.min };
            return;
        }
        
        var range=MARKET_SUFFIX_NAME.GetLimitPriceRange(this.Symbol, this.Name);   //通过规则获取涨停价格
        if (!range) 
        {
            JSConsole.Chart.Log(`[MinuteChartContainer::CaclutateLimitPrice] ${this.Symbol} no limit price.`)
            return;
        }

        //var yClose=data.stock[0].yclose;
        if (yClose<=0) return;
        this.LimitPrice={ Max:yClose*(1+range.Max), Min:yClose*(1+range.Min) };

        JSConsole.Chart.Log(`[MinuteChartContainer::CaclutateLimitPrice] ${this.Symbol} yClose:${yClose} max:${this.LimitPrice.Max} min:${this.LimitPrice.Min}`);

        this.LimitPrice.Max=parseFloat(this.LimitPrice.Max.toFixed(2));
        this.LimitPrice.Min=parseFloat(this.LimitPrice.Min.toFixed(2));
        JSConsole.Chart.Log(`[MinuteChartContainer::CaclutateLimitPrice] ${this.Symbol} tofixed(2) max:${this.LimitPrice.Max} min:${this.LimitPrice.Min}`);
    }

    this.UpdateHistoryMinuteUI = function () 
    {
        var allMinuteData = this.HistoryMinuteDataToArray(this.DayData);

        //原始数据
        var sourceData = new ChartData();
        sourceData.Data = allMinuteData;

        this.SourceData = sourceData;
        this.TradeDate = this.DayData[0].Date;
        
        var upperSymbol=this.Symbol.toUpperCase();
        var yClose=this.DayData[0].YClose;
        var isFutures=MARKET_SUFFIX_NAME.IsFutures(upperSymbol);
        if (IFrameSplitOperator.IsNumber(this.DayData[0].YClearing) && isFutures) yClose=this.DayData[0].YClearing; //期货使用前结算价
        this.BindMainData(sourceData, yClose);
        //if (MARKET_SUFFIX_NAME.IsChinaFutures(this.Symbol)) this.ChartPaint[1].Data = null;   //期货均线暂时不用

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
                self.ChartSplashPaint.EnableSplash(false);
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
                self.ChartSplashPaint.EnableSplash(false);
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
        var isFutures = MARKET_SUFFIX_NAME.IsFutures(upperSymbol);
        if (data.data.stock[0].yclearing && isFutures) yClose = data.data.stock[0].yclearing; //期货使用前结算价
        this.CaclutateLimitPrice(yClose, data.data.stock[0].limitprice); //计算涨停价格
        var extendData = { High: data.data.stock[0].high, Low: data.data.stock[0].low };
        this.BindMainData(sourceData, yClose, extendData);

        for (let i in this.Frame.SubFrame)  //把股票代码设置到X轴刻度类里
        {
            var item = this.Frame.SubFrame[i];
            item.Frame.XSplitOperator.Symbol = this.Symbol;
            item.Frame.XSplitOperator.DayCount = 1;
            item.Frame.XSplitOperator.Operator();   //调整X轴个数
            item.Frame.YSplitOperator.Symbol = this.Symbol;
        }

        //计算指标
        if (this.Frame.SubFrame.length > 2) 
        {
            var bindData = new ChartData();
            bindData.Data = aryMinuteData;
            for (var i = 2; i < this.Frame.SubFrame.length; ++i) 
            {
                this.BindIndexData(i, bindData);
            }
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
        if (this.AutoUpdateTimer) 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    //数据自动更新
    this.AutoUpdate = function () 
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;
        if (this.IsDestroy) return;

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

        var upperSymbol=this.Symbol.toUpperCase();
        if (MARKET_SUFFIX_NAME.IsForeignExchange(upperSymbol))    //外汇没有均线
            this.ChartPaint[1].Data=null;
        else if (MARKET_SUFFIX_NAME.IsShowAvPrice && !MARKET_SUFFIX_NAME.IsShowAvPrice(upperSymbol))    //外部控制是否显示均线
            this.ChartPaint[1].Data=null;

        this.Frame.SubFrame[0].Frame.YSplitOperator.AverageData = bindData;
        this.Frame.SubFrame[0].Frame.YSplitOperator.OverlayChartPaint = this.OverlayChartPaint;
        this.Frame.SubFrame[0].Frame.YSplitOperator.LimitPrice=this.LimitPrice;
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
        var bSZO = MARKET_SUFFIX_NAME.IsSZO(upperSymbol);            //深证股票期权

        if (bFutures || bSHO || bSZO)
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

        if (this.ChartCorssCursor)
        {
            if (this.ChartCorssCursor.StringFormatY)
            {
                this.ChartCorssCursor.StringFormatY.YClose=yClose;
                this.ChartCorssCursor.StringFormatX.Data=this.ChartPaint[0].Data;       //十字光标
            }
        }

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
    var isSZO = MARKET_SUFFIX_NAME.IsSZO(upperSymbol);            //深证股票期权

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
        if (8<jsData.length && jsData[8]>0) 
        {
            item.Date=jsData[8];    //日期
            item.DateTime=item.Date.toString()+" "+jsData[0].toString();
        }
        if (isFutures || isSHO || isSZO) item.Position = jsData.position;  //期货 期权有持仓

        if (i == 0)      //第1个数据 写死9：25
        {
            item.IsFristData = true;
            //if (isSHSZ) item.DateTime = data.stock[0].date.toString() + " 0925";
            if (item.Close <= 0) //第1分钟 没数据就用开盘价
            {
                item.Close = data.stock[0].open;
                item.High = item.Low = data.stock[0].open;
                item.AvPrice = data.stock[0].open;
                JSConsole.Chart.Log('[MinuteChartContainer::JsonDataToMinuteData] first minute data is empty.', data.stock[0].symbol, jsData);
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
    var isSZO = MARKET_SUFFIX_NAME.IsSZO(upperSymbol);            //深证股票期权
    var result = [];
    for (var i in data.data) 
    {
        var minuteData = [];
        var dayData = data.data[i];
        var date = dayData.date;
        var yClose = dayData.yclose;        //前收盘 计算涨幅
        var preClose = yClose;              //前一个数据价格
        var yClearing=dayData.yclearing;    //昨结算价
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
            if(isSHSZ) item.Vol = jsData[5] / 100; //原始单位股
            else item.Vol = jsData[5];
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
            if (8<jsData.length && jsData[8]>0) 
            {
                item.Date=jsData[8];    //日期
                item.DateTime=item.Date.toString()+" "+jsData[0].toString();
            }
            if ((isFutures || isSHO || isSZO) && 9 < jsData.length) item.Position = jsData[9];  //持仓

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
        if (IFrameSplitOperator.IsNumber(yClearing)) newData.YClearing=yClearing;
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
        self.ChartSplashPaint.EnableSplash(false);
        self.RecvHistoryMinuteData(data);
      },
      error: function (reqeust) {
        self.ChartSplashPaint.EnableSplash(false);
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
  this.LoadDataSplashTitle = '计算指数数据';

  this.CustomKLineApiUrl = g_JSChartResource.Domain + "/API/IndexCalculate";  //自定义指数计算地址
  this.CustomStock;   //成分
  this.QueryDate = { Start: 20180101, End: 20180627 };     //计算时间区间

  this.RequestHistoryData = function () {
    var self = this;
    this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
    this.ChartSplashPaint.EnableSplash(true);
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
        self.ChartSplashPaint.EnableSplash(false);
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
function KLineChartHScreenContainer(uielement) 
{
    this.newMethod = KLineChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName = 'KLineChartHScreenContainer';

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
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var jsChart = this;
        if (jsChart.DragMode == 0) return;

        jsChart.IsOnTouch = true;
        jsChart.PhonePinch = null;

        if (this.IsPhoneDragging(e)) 
        {
            if (jsChart.TryClickLock || this.TryClickIndexTitle) 
            {
                var touches = this.GetToucheData(e);
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (jsChart.TryClickLock && jsChart.TryClickLock(x, y)) return;
                if (jsChart.TryClickIndexTitle && jsChart.TryClickIndexTitle(x, y)) return;
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
            this.PhoneTouchInfo={ Start:{X:touches[0].clientX, Y:touches[0].clientY }, End:{ X:touches[0].clientX, Y:touches[0].clientY } };
            this.TouchEvent({ EventID:JSCHART_EVENT_ID.ON_PHONE_TOUCH, FunctionName:"OnTouchStart"}, e);
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


    this.ontouchmove = function (e) 
    {
        if (this.ChartSplashPaint && this.ChartSplashPaint.IsEnableSplash == true) return;

        var jsChart = this;
        var touches = this.GetToucheData(e);

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
                    else
                    {
                        if (jsChart.DragDownloadData) jsChart.DragDownloadData();
                    }

                    drag.LastMove.X = touches[0].clientX;
                    drag.LastMove.Y = touches[0].clientY;
                }
            }

            if (this.PhoneTouchInfo)
            {
                this.PhoneTouchInfo.End.X=touches[0].clientX;
                this.PhoneTouchInfo.End.Y=touches[0].clientY;
            }
        }
        else if (this.IsPhonePinching(e)) 
        {
            var phonePinch = jsChart.PhonePinch;
            if (!phonePinch) return;

            if (this.EnableZoomUpDown && this.EnableZoomUpDown.Touch===false) return;

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

    //创建 windowCount 窗口个数
    this.Create = function (windowCount) 
    {
        this.UIElement.JSChartContainer = this;

        //创建十字光标
        this.ChartCorssCursor = new ChartCorssCursor();
        this.ChartCorssCursor.Canvas = this.Canvas;
        this.ChartCorssCursor.StringFormatX = g_DivTooltipDataForamt.Create("CorssCursor_XStringFormat");
        this.ChartCorssCursor.StringFormatX.LanguageID=this.LanguageID;
        this.ChartCorssCursor.StringFormatY = g_DivTooltipDataForamt.Create("CorssCursor_YStringFormat");
        this.ChartCorssCursor.StringFormatY.LanguageID=this.LanguageID;

        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.HQChart=this;

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
            titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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
                frame.YSplitOperator.FrameSplitData2 = this.FrameSplitData.get('double');
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

    //创建 windowCount 窗口个数
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
        this.ChartSplashPaint.SplashTitle = this.LoadDataSplashTitle;

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
            titlePaint.GetEventCallback=(id)=> { return this.GetEventCallback(id); }
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

        for (var i=0; i<kData.length; ++i) 
        {
            var item = kData[i];
            if (ChartData.IsMinutePeriod(this.Period, true)) 
            {
                if (IFrameSplitOperator.IsNumber(this.TrainStartDate.Time)) 
                {
                    if (item.Date >= this.TrainStartDate.Date && item.Time >= this.TrainStartDate.Time)
                        return i;
                }
                else 
                {
                    if (item.Date >= this.TrainStartDate.Date)
                        return i;
                }
            }
            else if (ChartData.IsDayPeriod(this.Period, true) || ChartData.IsTickPeriod(this.Period)) 
            {
                if (item.Date >= this.TrainStartDate.Date)
                    return i;
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
        JSConsole.Chart.Log('[KLineTrainChartContainer::RestartTrain] option ', option);

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

///////////////////////////////////////////////////////////////////////////////////
//  简单的K线图， 只计算一次
//
//////////////////////////////////////////////////////////////////////////////////
function KLineTrainSimpleChartContainer(uielement, bHScreen)
{
    this.newMethod=KLineTrainChartContainer;   //派生
    this.newMethod(uielement, bHScreen);
    delete this.newMethod;

    this.IsHScreen=bHScreen;
    this.IsZoomLockRight=true;
    this.RightSpaceCount=0;
    
    this.RecvFlowCapitalData=function(data)
    {
        this.Super_RecvFlowCapitalData(data);
    }

    this.BeforeBindMainData=function(funcName)
    {
        
    }

    this.UpdateLastDataIcon=function()
    {
        if (!this.ChartPaintEx[0]) return;

        var chart=this.ChartPaintEx[0];
        chart.LastDataIndex=this.TrainInfo.End.Index;
    }

    this.AfterBindMainData=function(funcName)
    {
        if (!this.ChartPaintEx[0]) 
        {
            this.CreateBuySellPaint();
            this.ChartPaintEx[0].LastDataDrawType=1;
        }

        if (funcName!="Update")
        {
            var hisData=this.ChartOperator_Temp_GetHistroyData();
            if (!hisData) return false;

            var count=hisData.Data.length;
            var lEnd=count-this.TrainDataCount-20;
            var xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
            var findIndex=this.GetKDataIndexByDateTime(hisData.Data, this.TrainStartDate);
            if (findIndex>=0)
            {
                lEnd=findIndex+1;
                if (count-lEnd<this.TrainDataCount) this.TrainDataCount=count-lEnd;
            }
            var xOffset=lEnd-xPointcount;
            hisData.DataOffset=xOffset;

            var index=lEnd-1;
            var kItem=hisData.Data[index];

            //最后一个显示数据
            this.TrainInfo.LastShowData=kItem;
            this.TrainInfo.LastData = kItem;

            //训练起始日期
            this.TrainInfo.Start.Index=index;
            this.TrainInfo.Start.Date=kItem.Date;
            this.TrainInfo.Start.Time=kItem.Time;

            //训练结束日期
            this.TrainInfo.End.Index=index;
            this.TrainInfo.End.Date=kItem.Date;
            this.TrainInfo.End.Time=kItem.Time;

            this.UpdateLastDataIcon();

            this.UpdateTrainUICallback("开始");
        }
    }

    this.Super_UpdataDataoffset=this.UpdataDataoffset;
    this.UpdataDataoffset=function()
    {
        this.Super_UpdataDataoffset();

        var hisData=this.ChartPaint[0].Data;
        this.ChartPaintEx[0].Data=hisData;
    }


    this.MoveNextKLineData=function(option) //{PageSize:, Step:}
    {
        if (this.TrainDataCount<=0) return false;
        var hisData=this.ChartOperator_Temp_GetHistroyData();
        if (!hisData) return false;

        var step=1;
        if (option && option.Step>1) step=option.Step;
        var count=hisData.Data.length;

        var moveStep=0;
        for(var i=0; i<step; ++i)
        {
            var index=this.TrainInfo.End.Index+1;
            if (index>=count) break;
    
            var kItem=hisData.Data[index];
            this.TrainInfo.End.Index=index;
            this.TrainInfo.End.Date=kItem.Date;
            this.TrainInfo.End.Time=kItem.Time;
            --this.TrainDataCount;
            ++moveStep;

            if (this.TrainDataCount<=0) break;
        }

        if (moveStep==0) return false;

        //最后一个显示数据
        this.TrainInfo.LastShowData=kItem;
        this.TrainInfo.LastData = kItem;

        //调整x轴索引位置
        var lEnd=this.TrainInfo.End.Index;
        var xPointcount=this.Frame.SubFrame[0].Frame.XPointCount;
        var xOffset=lEnd-xPointcount+1;
        hisData.DataOffset=xOffset;

        this.UpdateLastDataIcon();
        this.UpdataDataoffset();
        this.UpdateFrameMaxMin();
        this.Draw();

        if (this.TrainDataCount<=0) 
        {
            this.FinishTrainData();
            this.UpdateTrainUICallback("结束");
            return false;
        }

        this.UpdateTrainUICallback("训练中");
        return true;
    }

    this.BuyOrSell=function(obj, bDraw)  //{ Price:价格, Vol:数量, Op: 买/卖 0=buy 1=sell, ID:单号 } bDraw是否立即绘制图标
    {
        var kItem=this.TrainInfo.LastShowData;
        if (!kItem) return false;
        
        var buySellPaint=this.ChartPaintEx[0];
        if (!buySellPaint) return false;

        var hisData=this.ChartPaint[0].Data;
        if (!hisData || hisData.Data.length<=0) return false;

        var index=this.TrainInfo.End.Index;  //数据索引
        var buyItem={ Date:this.TrainInfo.End.Date, Time:this.TrainInfo.End.Time, Price:obj.Price, Vol:obj.Vol, Op:0, ID:obj.ID };
        if (obj.Op==1) buyItem.Op=1;
        var key=index;
        buyItem.Key=key;

        this.BuySellData.push(buyItem);
        buySellPaint.AddTradeItem(buyItem);

        if (bDraw==true) this.Draw();
    }

    this.DataMove=function(step,isLeft)
    {
        step=parseInt(step/this.StepPixel);
        if (step<=0) return false;

        var data = this.ChartOperator_Temp_GetHistroyData();
        if (!data) return false;

        var xPointcount = 0;
        if (this.Frame.XPointCount) xPointcount = this.Frame.XPointCount;
        else xPointcount = this.Frame.SubFrame[0].Frame.XPointCount;
        if (!xPointcount) return false;

        if (isLeft) //-->
        {
            if (this.RightSpaceCount > 0)
            {
                 //TODO: not support 
                if (xPointcount + data.DataOffset >= data.Data.length + this.RightSpaceCount - 1) return false;
                data.DataOffset += step;

                if (data.DataOffset + xPointcount >= data.Data.length + this.RightSpaceCount)
                    data.DataOffset = data.Data.length - (xPointcount - this.RightSpaceCount);
            }
            else
            {
                var end=this.TrainInfo.End.Index+1;
                if (xPointcount + data.DataOffset >= end) return false;

                data.DataOffset += step;
                if (data.DataOffset + xPointcount >= end)
                    data.DataOffset = end - xPointcount;
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

    //获取最后一个数据的相对于当前屏的索引
    this.GetLastDataIndex=function()
    {
        if (!this.ChartPaint[0] || !this.ChartPaint[0].Data || !this.ChartPaint[0].Data.Data) return null;

        var hisData=this.ChartPaint[0].Data;
        var dataCount=this.TrainInfo.End.Index+1
        if (dataCount>0) return (dataCount-1)-hisData.DataOffset;

        return null;
    }
}

/////////////////////////////////////////////////////////////////////////////////
//  深度图
//
function DepthChartContainer(uielement)
{
    this.newMethod=JSChartContainer;   //派生
    this.newMethod(uielement);
    delete this.newMethod;

    this.ClassName="DepthChartContainer";
    this.Symbol;
    
    //数据
    this.MapAsk=new Map();
    this.MapBid=new Map();

    this.IsAutoUpdate=false;                    //是否自动更新行情数据
    this.AutoUpdateFrequency=30000;             //30秒更新一次数据
    this.AutoUpdateTimer=null;

    this.DefaultZoom=0.8;       //默认显示80%的盘口 (0 - 1)
    this.MaxVolRate=1.1;

    this.Create=function(option)
    {
        this.UIElement.JSChartContainer=this;

        //创建十字光标
        this.ChartCorssCursor=new DepthChartCorssCursor();
        this.ChartCorssCursor.Canvas=this.Canvas;
        this.ChartCorssCursor.HQChart=this;
        //this.ChartCorssCursor.StringFormatX=g_DivTooltipDataForamt.Create("CorssCursor_XStringFormat");
        //this.ChartCorssCursor.StringFormatX.LanguageID=this.LanguageID;
        //this.ChartCorssCursor.StringFormatY=g_DivTooltipDataForamt.Create("CorssCursor_YStringFormat");
        //this.ChartCorssCursor.StringFormatY.LanguageID=this.LanguageID;


        //创建等待提示
        this.ChartSplashPaint = new ChartSplashPaint();
        this.ChartSplashPaint.Canvas = this.Canvas;
        this.ChartSplashPaint.SplashTitle = this.LoadDataSplashTitle;

        //创建框架
        this.Frame=new DepthChartFrame();
        this.Frame.ChartBorder=new ChartBorder();
        this.Frame.ChartBorder.UIElement=this.UIElement;
        this.Frame.ChartBorder.Top=30;
        this.Frame.ChartBorder.Left=5;
        this.Frame.ChartBorder.Bottom=20;
        this.Frame.ChartBorder.TitleHeight=0;
        this.Frame.Canvas=this.Canvas;

        var ySplitOper=new FrameSplitY();
        ySplitOper.FrameSplitData=this.FrameSplitData.get('double');
        ySplitOper.LanguageID=this.LanguageID;
        ySplitOper.Frame=this.Frame;
        ySplitOper.SplitCount=5;
        ySplitOper.IgnoreYValue=[0];
        ySplitOper.LineType=3;
        ySplitOper.ChartBorder=this.Frame.ChartBorder;
        this.Frame.YSplitOperator=ySplitOper;

        var xSplitOper=new FrameSplitXDepth();
        xSplitOper.Frame=this.Frame;;
        xSplitOper.ChartBorder=this.Frame.ChartBorder;;
        xSplitOper.LanguageID=this.LanguageID;
        xSplitOper.LineType=3;
        this.Frame.XSplitOperator=xSplitOper

        if (this.ChartCorssCursor) this.ChartCorssCursor.Frame=this.Frame; //十字光标绑定框架
        this.ChartSplashPaint.Frame = this.Frame;

        var chartItem=new ChartOrderbookDepth();
        chartItem.Canvas=this.Canvas;
        chartItem.ChartBorder=this.Frame.ChartBorder;
        chartItem.ChartFrame=this.Frame;
        chartItem.Name="深度图"
        this.ChartPaint.push(chartItem);
    }

    this.ontouchstart=function(e)
    {
        this.IsOnTouch=true;
        this.TouchDrawCount=0;
        this.PhonePinch=null;

        var isSingleTouch=this.IsSingleTouch(e);
        if (this.EnableScrollUpDown==false || !isSingleTouch) //多点触屏 
        {
           
        }

        if (this.IsPhoneDragging(e))
        {
            var drag=
            {
                "Click":{},
                "LastMove":{}  //最后移动的位置
            };

            var touches=this.GetToucheData(e,this.IsForceLandscape);

            drag.Click.X=touches[0].clientX;
            drag.Click.Y=touches[0].clientY;
            drag.LastMove.X=touches[0].clientX;
            drag.LastMove.Y=touches[0].clientY;

            this.MouseDrag=drag;

            var x = drag.Click.X;
            var y = drag.Click.Y;
            this.OnMouseMove(x, y, e);
        }
        else if (this.IsPhonePinching(e))
        {
            var phonePinch=
            {
                "Start":{},
                "Last":{}
            };

            var touches=this.GetToucheData(e,this.IsForceLandscape);

            phonePinch.Start={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
            phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};

            this.PhonePinch=phonePinch;
        }
    }

    this.ontouchmove=function(e)
    {
        var touches=this.GetToucheData(e,false);
        if (this.IsPhoneDragging(e))
        {
            var drag=this.MouseDrag;
            if (drag==null)
            {
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                this.OnMouseMove(x,y,e);
            }
            else
            {
                this.MouseDrag=null;
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                this.OnMouseMove(x,y,e);
            }
        }
        else if (this.IsPhonePinching(e))
        {
            var phonePinch=this.PhonePinch;
            if (!phonePinch) return;

            if (this.EnableZoomUpDown && this.EnableZoomUpDown.Touch===false) return;

            var yHeight = Math.abs(touches[0].pageY - touches[1].pageY);
            var yLastHeight = Math.abs(phonePinch.Last.Y - phonePinch.Last.Y2);
            var yStep = yHeight - yLastHeight;
            var xHeight = Math.abs(touches[0].pageX - touches[1].pageX);
            var xLastHeight = Math.abs(phonePinch.Last.X - phonePinch.Last.X2);
            var xStep = xHeight - xLastHeight;
            var minStep=this.ZoomStepPixel;
            if (Math.abs(yStep) <minStep  && Math.abs(xStep) < minStep) return;

            var step = yStep;
            if (Math.abs(yStep) < minStep) step = xStep;

            if (step>0)    //放大
            {
                if (!this.Frame.ZoomUp()) return;
                this.UpdateFrameMaxMin();
                this.Draw();
            }
            else        //缩小
            {
                if (!this.Frame.ZoomDown()) return;
                this.UpdateFrameMaxMin();
                this.Draw();
            }

            phonePinch.Last={"X":touches[0].pageX,"Y":touches[0].pageY,"X2":touches[1].pageX,"Y2":touches[1].pageY};
        }
    }

    this.ontouchend=function(e)
    {
        JSConsole.Chart.Log('[DepthChartContainer::OnTouchEnd]',e);
        this.IsOnTouch = false;
        this.Draw();
        this.TouchDrawCount=0;
    }

    this.OnMouseMove = function (x, y, e, bFullDraw) 
    {
        var lastY = this.LastPoint.Y;
        this.LastPoint.X = x;
        this.LastPoint.Y = y;
        this.FullDraw();
    }

    this.ChangeSymbol=function(symbol)
    {
        this.CancelAutoUpdate();    //先停止定时器
        this.Symbol=symbol;
        this.MapBid=new Map();
        this.MapAsk=new Map();
        this.Frame.VerticalRange.Differ=null;

        this.ChartSplashPaint.SetTitle(this.LoadDataSplashTitle);
        this.ChartSplashPaint.EnableSplash(true);
        this.Draw();

        this.RequestDepthData();
    }

    this.RequestDepthData=function()  //全量历史数据
    {
        var self=this;
        if (this.NetworkFilter)
        {
            var obj=
            {
                Name:'DepthChartContainer::RequestDepthData', //类名::
                Explain:'深度图数据',
                Request:{ Data: { symbol:self.Symbol } }, 
                Self:this,
                PreventDefault:false
            };
            this.NetworkFilter(obj, function(data) 
            { 
                self.ChartSplashPaint.EnableSplash(false);
                self.RecvDepthData(data);
                self.AutoUpdate();
            });

            if (obj.PreventDefault==true) return;   //已被上层替换,不调用默认的网络请求
        }
    }

    this.RecvDepthData=function(data)
    {
        this.UpdateAskAndBid(data);

        var aryAsk=Array.from(this.MapAsk.values());    //卖    右边
        aryAsk.sort((a,b)=> { return a.Price-b.Price; });
        var sumVol=0;
        for(var i in aryAsk)
        {
            var item=aryAsk[i];
            sumVol+=item.Vol;

            aryAsk[i]={Price:item.Price, Vol:sumVol };
        }

        var aryBid=Array.from(this.MapBid.values());    //买    左边
        aryBid.sort((a,b)=> { return b.Price-a.Price; });
        var sumVol=0;
        for(var i in aryBid)
        {
            var item=aryBid[i];
            sumVol+=item.Vol;

            aryBid[i]={Price:item.Price, Vol:sumVol };
        }

        var drawData={ Asks:aryAsk, Bids:aryBid };
        var chart=this.ChartPaint[0];
        chart.Data=drawData;

        this.Frame.XSplitOperator.Symbol=this.Symbol;
        this.ChartCorssCursor.Data=drawData;
        this.ChartCorssCursor.Symbol=this.Symbol;

        this.UpdateFramePriceList();
        this.UpdateFrameMaxMin();

        this.Draw();
    }

    this.UpdateAskAndBid=function(data) //更新数据
    {
        if(data.datatype=="snapshot") //全量数据
        {
            this.MapBid=new Map();
            this.MapAsk=new Map();
        }

        for(var i in data.asks)
        {
            var item=data.asks[i];
            var price=parseFloat(item[0]);
            var vol=parseFloat(item[1]);

            if (this.MapAsk.has(price))
            {
                var value=this.MapAsk.get(price);
                if (vol<=0) this.MapAsk.delete(price);
                else value.Vol=vol;
            }
            else
            {
                if (vol>0) this.MapAsk.set(price, { Price:price, Vol:vol});
            }
        }

        for(var i in data.bids)
        {
            var item=data.bids[i];
            var price=parseFloat(item[0]);
            var vol=parseFloat(item[1]);

            if (this.MapBid.has(price))
            {
                var value=this.MapBid.get(price);
                if (vol<=0) this.MapBid.delete(price);
                else value.Vol=vol;
            }
            else
            {
                if (vol>0) this.MapBid.set(price, { Price:price, Vol:vol});
            }
        }
    }

    this.UpdateFramePriceList=function()
    {
        var aryAskPrice=Array.from(this.MapAsk.keys());
        var aryBidPrice=Array.from(this.MapBid.keys());

        aryAskPrice.sort((a,b)=> { return a-b; });
        aryBidPrice.sort((a,b)=> { return a-b; });

        if (aryAskPrice.length>1 && aryBidPrice.length>1)
        {
            var askMin=aryAskPrice[0], askMax=aryAskPrice[aryAskPrice.length-1];
            var bidMin=aryBidPrice[0], bidMax=aryBidPrice[aryBidPrice.length-1];
            var askDifference=askMax-askMin;    //卖差值
            var bidDifference=bidMax-bidMin;    //买差值
            var difference=Math.max(askDifference, bidDifference);   //取最大的差值,2边调整

            var ask={Min:askMin, Max:askMin+difference};
            var bid={Max:bidMax, Min:bidMax-difference};
            var range={ Max:ask.Max, Min:bid.Min };
        }

        this.Frame.SetPriceList(aryAskPrice,aryBidPrice);
        var xRange=this.Frame.VerticalRange;
        xRange.Max=range.Max;
        xRange.Center=range.Min+(range.Max-range.Min)/2;
        xRange.Min=range.Min;
        xRange.MaxDiffer=difference;        //差值
        xRange.Ask=ask;
        xRange.Bid=bid;
        if (!IFrameSplitOperator.IsNumber(xRange.Differ)) 
            xRange.Differ=difference*this.DefaultZoom;
        
        xRange.Min=xRange.Center-xRange.Differ;
        xRange.Max=xRange.Center+xRange.Differ;
    }

    this.UpdateFrameMaxMin=function()
    {
        var range=this.ChartPaint[0].GetMaxMin();

        this.Frame.HorizontalMax=range.Max*this.MaxVolRate;
        this.Frame.HorizontalMin=0;
        this.Frame.XYSplit=true;
    }

    this.CancelAutoUpdate=function()    //关闭停止更新
    {
        if (this.AutoUpdateTimer) 
        {
            clearTimeout(this.AutoUpdateTimer);
            this.AutoUpdateTimer = null;
        }
    }

    this.StopAutoUpdate=function()
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        this.IsAutoUpdate=false;
    }

    this.AutoUpdate=function()  //数据自动更新
    {
        this.CancelAutoUpdate();
        if (!this.IsAutoUpdate) return;
        if (!this.Symbol) return;
        if (this.IsDestroy) return;

        var self = this;
        var marketStatus=MARKET_SUFFIX_NAME.GetMarketStatus(this.Symbol);
        if (marketStatus==0 || marketStatus==3) return; //闭市,盘后

        var frequency=this.AutoUpdateFrequency;
        if (marketStatus==1) //盘前
        {
            this.AutoUpdateTimer=setTimeout(function() 
            { 
                self.AutoUpdate(); 
            },frequency);
        }
        else if (marketStatus==2)   //盘中
        {
            this.AutoUpdateTimer=setTimeout(function()
            {
                self.RequestDepthData();
            },frequency);
        }
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

    //JSConsole.Chart.Log(recvData.data);
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
    JSConsole.Chart.Log(recvData);
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
        JSCommonCoordinateData:JSCommonCoordinateData,
        FrameSplitKLineX:FrameSplitKLineX,
        FrameSplitKLinePriceY:FrameSplitKLinePriceY,
        JSCHART_EVENT_ID:JSCHART_EVENT_ID
    },
};



