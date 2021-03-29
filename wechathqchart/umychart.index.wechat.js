/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    指标基类及定制指标
*/

import {
    JSCommonResource_Global_JSChartResource as g_JSChartResource,
} from './umychart.resource.wechat.js'

import { JSCommonComplier } from "./umychart.complier.wechat.js";     //通达信编译器

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
} from "./umychart.chartpaint.wechat.js";

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
//////////////////////////////////////////////////////////
//
//  指标信息
//
function IndexInfo(name, param) 
{
    this.Name = name;                 //名字
    this.Param = param;               //参数
    this.LineColor;                 //线段颜色
    this.ReqeustData = null;          //数据请求
}

function BaseIndex(name)
 {
    this.Index;               //指标阐述
    this.Name = name;         //指标名字
    this.UpdateUICallback;    //数据到达回调

    //默认创建都是线段
    this.Create = function (hqChart, windowIndex) 
    {
        for (var i in this.Index) 
        {
            if (!this.Index[i].Name) continue;

            var maLine = new ChartLine();
            maLine.Canvas = hqChart.Canvas;
            maLine.Name = this.Name + '-' + i.toString();
            maLine.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
            maLine.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
            maLine.Color = this.Index[i].LineColor;

            hqChart.ChartPaint.push(maLine);
        }
    }

    //指标不支持 周期/复权/股票等
    this.NotSupport = function (hqChart, windowIndex, message) 
    {
        var paint = hqChart.GetChartPaint(windowIndex);
        for (var i in paint) 
        {
            paint[i].Data.Data = [];    //清空数据
            if (i == 0) paint[i].NotSupportMessage = message;
        }
    }

    //格式化指标名字+参数
    //格式:指标名(参数1,参数2,参数3,...)
    this.FormatIndexTitle = function () 
    {
        var title = this.Name;
        var param = null;

        for (var i in this.Index) 
        {
            var item = this.Index[i];
            if (item.Param == null) continue;

            if (param) param += ',' + item.Param.toString();
            else param = item.Param.toString();
        }

        if (param) title += '(' + param + ')';

        return title;
    }

    this.InvokeUpdateUICallback = function (paint) 
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
    this.OutName=null;          //动态输出指标名字
   
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
        if (option.OutName) this.OutName=option.OutName;
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
        if (varItem.IsShow==false) line.IsShow=false;
        if (varItem.LineWidth) 
        {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) line.LineWidth = width;
        }

        if (varItem.IsDotLine) line.IsDotLine = true; //虚线
        if (varItem.IsShow == false) line.IsShow = false;

        let titleIndex = windowIndex + 1;
        line.Data.Data = varItem.Data;
        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {
        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {
        }
        else
        {
            hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(line.Data, (varItem.NoneName==true? null: varItem.Name) , line.Color);
        }
        
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
        chartText.TextAlign='left';

        chartText.Name = varItem.Name;
        chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();
        
        if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
        else chartText.Color = this.GetDefaultColor(id);

        let titleIndex = windowIndex + 1;
        if (varItem.Draw.Position) chartText.Position=varItem.Draw.Position;    //赋值坐标
        if (varItem.Draw.DrawData) chartText.Data.Data = varItem.Draw.DrawData;
        chartText.Text = varItem.Draw.Text;
        if (varItem.Draw.Direction > 0) chartText.Direction = varItem.Draw.Direction;
        if (varItem.Draw.YOffset > 0) chartText.YOffset = varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign = varItem.Draw.TextAlign;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
    }

    //COLORSTICK 
    this.CreateMACD = function (hqChart, windowIndex, varItem, id) 
    {
        let chartMACD = new ChartMACD();
        chartMACD.Canvas = hqChart.Canvas;

        chartMACD.Name = varItem.Name;
        chartMACD.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartMACD.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.LineWidth) 
        {
            var width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chartMACD.LineWidth=width;
        }

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
    chartText.ReloadResource();
    
    chartText.TextAlign="center";
    if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
    else chartText.Color = this.GetDefaultColor(id);
    if (varItem.IsDrawAbove) chartText.Direction=1;
    else chartText.Direction=2;

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

    this.CreateBackgroud=function(hqChart,windowIndex,varItem,id)
    {
        let chart=new ChartBackground();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Color=drawData.Color;
            chart.ColorAngle=drawData.Angle;

            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

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

    this.CreateMulitHtmlDom=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartMultiHtmlDom();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData;
        chart.DrawCallback= varItem.Draw.Callback;
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
                case 'DRAWTEXT_FIX':
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
                case 'DRAWGBK':
                case "DRAWGBK2":
                    this.CreateBackgroud(hqChart,windowIndex,item,i);
                    break;

                //第3方指标定制
                case 'MULTI_TEXT':
                    this.CreateMultiText(hqChart, windowIndex, item, i);
                    break;
                case "MULTI_HTMLDOM":
                    this.CreateMulitHtmlDom(hqChart,windowIndex,item,i);
                    break;
                case 'MULTI_LINE':
                    this.CreateMultiLine(hqChart, windowIndex, item, i);
                    break;
                case 'MULTI_BAR':
                    this.CreateMultiBar(hqChart, windowIndex, item, i);
                    break;
                case "KLINE_BG":
                    this.CreateBackgroud(hqChart,windowIndex,item,i);
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
                if (this.OutName && this.OutName.length>0 && this.Arguments && this.Arguments.length>0)
                {
                    titlePaint.SetDynamicOutName(this.OutName,this.Arguments);
                }
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





//市场多空
function MarketLongShortIndex() 
{
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



module.exports =
{
    JSCommonIndex:
    {
        IndexInfo: IndexInfo,
        BaseIndex: BaseIndex,
        ScriptIndex:ScriptIndex,
    },

    //单个类导出
    JSCommonIndex_IndexInfo: IndexInfo,
    JSCommonIndex_BaseIndex: BaseIndex,
    JSCommonIndex_ScriptIndex:ScriptIndex,
};
