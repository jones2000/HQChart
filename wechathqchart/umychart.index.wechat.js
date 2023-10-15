/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com

    指标基类及定制指标
*/

import {
    g_JSChartResource,
} from './umychart.resource.wechat.js'

import { JSCommonComplier } from "./umychart.complier.wechat.js";     //通达信编译器

//日志
import { JSConsole } from "./umychart.console.wechat.js"

import {
    ChartData, HistoryData,
    SingleData, MinuteData,
    JSCHART_EVENT_ID,
} from "./umychart.data.wechat.js";

//图形库
import {
    IChartPainting, 
    ChartSingleText, 
    ChartDrawIcon,
    ChartDrawText,
    ChartDrawNumber,
    ChartKLine,
    ChartColorKline,
    ChartLine,
    ChartArea,
    ChartSubLine,
    ChartPointDot, 
    ChartStick,
    ChartLineStick,
    ChartStickLine,
    ChartOverlayKLine,
    ChartMinuteInfo,
    ChartRectangle,
    ChartMultiText,
    ChartMultiLine,
    ChartMultiPoint,
    ChartMultiBar,
    ChartPie,
    ChartCircle,
    ChartChinaMap,
    ChartRadar,
    ChartCorssCursor,
    ChartBuySell,
    ChartMACD,
    ChartSplashPaint,
    ChartBackground,
    ChartMinuteVolumBar,
    ChartMultiHtmlDom,
    ChartLock,
    ChartVolStick,
    ChartBand,
    ChartLineMultiData,
    ChartStraightLine,
    ChartStackedBar,
    ChartStepLine,
    ChartBackgroundDiv,
} from "./umychart.chartpaint.wechat.js";

import 
{ 
    CoordinateInfo,
    IFrameSplitOperator,
    FrameSplitKLinePriceY,
    FrameSplitY,
    FrameSplitKLineX,
    FrameSplitMinutePriceY,
    FrameSplitMinuteX,
    FrameSplitXData,
    SplitData,
    PriceSplitData,
} from './umychart.framesplit.wechat.js'

import
{
    IChartTitlePainting, 
    DynamicKLineTitlePainting,
    DynamicMinuteTitlePainting,
    DynamicChartTitlePainting,
    DynamicTitleData,
    STRING_FORMAT_TYPE,
} from './umychart.charttitle.wechat.js'

import { HQIndexFormula } from "./umychart.hqIndexformula.wechat.js";     //通达信编译器

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

// 图形指标名字
var SCRIPT_CHART_NAME=
{
    OVERLAY_BARS:"OVERLAY_BARS"     //叠加柱子图
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
    this.YSplitType;
   
    //指标上锁配置信息
    this.IsLocked = false;    //是否锁住指标
    this.LockCallback = null;
    this.LockID = null;
    this.LockBG = null;       //锁背景色
    this.LockTextColor = null;
    this.LockText = null;
    this.LockFont = null;
    this.LockCount = 10;
    this.TitleFont=g_JSChartResource.DynamicTitleFont;      //标题字体
    this.IsShortTitle=false;                                //是否显示指标参数

    this.IsShow=true;       //是否显示图形

    if (option) 
    {
        if (option.FloatPrecision >= 0) this.FloatPrecision = option.FloatPrecision;
        if (option.StringFormat > 0) this.StringFormat = option.StringFormat;
        if (option.ID) this.ID = option.ID;
        if (option.KLineType) this.KLineType = option.KLineType;
        if (option.InstructionType) this.InstructionType = option.InstructionType;
        if (option.YSpecificMaxMin) this.YSpecificMaxMin = option.YSpecificMaxMin;
        if (option.YSplitScale) this.YSplitScale = option.YSplitScale;
        if (option.TitleFont) this.TitleFont=option.TitleFont;
        if (IFrameSplitOperator.IsNumber(option.IsShortTitle)) this.IsShortTitle=option.IsShortTitle;
        if (option.OutName) this.OutName=option.OutName;
        if (IFrameSplitOperator.IsNumber(option.YSplitType)) this.YSplitType=option.YSplitType;
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
        if (hqChart.ClassName === 'MinuteChartContainer' || hqChart.ClassName==='MinuteChartHScreenContainer') 
        {
            if (hqChart.DayCount>1) hqDataType=HQ_DATA_TYPE.MULTIDAY_MINUTE_ID; //多日分钟
            else hqDataType=HQ_DATA_TYPE.MINUTE_ID;          
        }
        else if (hqChart.ClassName==='HistoryMinuteChartContainer') 
        {
            hqDataType=HQ_DATA_TYPE.HISTORY_MINUTE_ID;   //历史分钟
        }

        let option =
        {
            HQDataType: hqDataType,
            Symbol: hqChart.Symbol,
            Data: hisData,
            SourceData: hqChart.SourceData, //原始数据
            Callback: this.RecvResultData, CallbackParam: param,
            Async: true,
            MaxRequestDataCount: hqChart.MaxRequestDataCount,
            MaxRequestMinuteDayCount: hqChart.MaxRequestMinuteDayCount,
            Arguments: this.Arguments,
            IsApiPeriod:hqChart.IsApiPeriod,
        };

        if (hqDataType===HQ_DATA_TYPE.HISTORY_MINUTE_ID) option.TrateDate=hqChart.TradeDate;
        if (hqDataType===HQ_DATA_TYPE.MULTIDAY_MINUTE_ID) option.DayCount=hqChart.DayCount;
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

    //给图形设置指标名字
    this.SetChartIndexName=function(chart)
    {
        if (this.Name) chart.IndexName=this.Name;
        else if (this.ID) chart.IndexName==this.ID;

        if (this.ID) chart.IndexID=this.ID;

        chart.Script=this;  //指标内容绑定上去
    }

    //设置标题数据
    this.SetTitleData=function(titleData, chart)
    {
        titleData.ChartClassName=chart.ClassName;
        titleData.IsVisible=chart.IsVisible;
    }

    //自定义图形配色
    this.ReloadChartResource=function(hqChart, windowIndex, chart)
    {
        var event=hqChart.GetEventCallback(JSCHART_EVENT_ID.ON_RELOAD_INDEX_CHART_RESOURCE);  //指标计算完成回调
        if (!event || !event.Callback) return;
        
        var sendData={ Chart:chart, IndexName:this.Name,IndexID:this.ID,  HQChart:hqChart, WindowIndex:windowIndex };
        event.Callback(event,sendData,this);
    }

    this.CreateLine = function (hqChart, windowIndex, varItem, id, lineType) 
    {
        if (lineType==7) var line=new ChartStepLine();
        else var line = new ChartLine();
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

        this.ReloadChartResource(hqChart,windowIndex,line);

        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {
        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {
        }
        else
        {
            var titleData=new DynamicTitleData(line.Data, (varItem.NoneName==true? null: varItem.Name) , line.Color);
            hqChart.TitlePaint[titleIndex].Data[id] = titleData;
            this.SetTitleData(titleData,line);
        }

        this.SetChartIndexName(line);
        hqChart.ChartPaint.push(line);
    }

    this.CreateArea=function(hqChart, windowIndex, varItem, id)
    {
        var line=new ChartArea();

        line.Canvas=hqChart.Canvas;
        line.DrawType=1;
        line.Name=varItem.Name;
        line.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        line.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        line.Identify=this.Guid;
        if (varItem.Color) line.Color=this.GetColor(varItem.Color);
        else line.Color=this.GetDefaultColor(id);
        if (varItem.DownColor) 
        {
            line.AreaColor=varItem.DownColor;
        }
        else if (varItem.UpColor)
        {
            line.AreaColor=varItem.UpColor;
            line.AreaDirection=1;
        }

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) line.LineWidth=width;
        }

        if (IFrameSplitOperator.IsNonEmptyArray(varItem.LineDash)) line.LineDash=varItem.LineDash; //虚线
        if (varItem.IsShow==false) line.IsShow=false;
        
        let titleIndex=windowIndex+1;
        line.Data.Data=varItem.Data;
        if (varItem.IsShowTitle===false)    //NOTEXT 不绘制标题
        {

        }
        else if (IFrameSplitOperator.IsString(varItem.Name) && varItem.Name.indexOf("NOTEXT")==0) //标题中包含NOTEXT不绘制标题
        {

        }
        else
        {
            if (varItem.NoneName) 
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,null,line.Color);
            else
                hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

            hqChart.TitlePaint[titleIndex].Data[id].ChartClassName=line.ClassName;
        }
        
        this.SetChartIndexName(line);
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

    //DRAWTEXT
    this.CreateDrawTextV2=function(hqChart, windowIndex, varItem, id)
    {
        var chartText = new ChartDrawText();
        chartText.Canvas = hqChart.Canvas;
        chartText.TextAlign='left';

        chartText.Name = varItem.Name;
        chartText.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();
        
        if (varItem.Color) chartText.Color = this.GetColor(varItem.Color);
        else chartText.Color = this.GetDefaultColor(id);

        if (varItem.Draw.DrawData) chartText.Data.Data = varItem.Draw.DrawData;
        chartText.Text = varItem.Draw.Text;
        if (varItem.Draw.YOffset > 0) chartText.YOffset = varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign = varItem.Draw.TextAlign;

         //指定输出位置
         if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
         else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;

        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chartText.ShowOffset.Y=varItem.YOffset;
        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chartText.ShowOffset.X=varItem.XOffset;

        //var titleIndex = windowIndex + 1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
    }

    //DRAWNUMBER
    this.CreateDrawNumber=function(hqChart,windowIndex,varItem,id)
    {
        var chartText=new ChartDrawNumber();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.TextBaseline='bottom'
        if (varItem.IsDrawBelow===true) chartText.TextBaseline='top';

        chartText.Data.Data=varItem.Draw.DrawData.Value;
        chartText.Text=varItem.Draw.DrawData.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;

        //指定输出位置
        if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
        else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;
        
        //let titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        hqChart.ChartPaint.push(chartText);
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

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.Direction=1;
            else if (varItem.DrawVAlign==1) chartText.Direction=0;
            else if (varItem.DrawVAlign==2) chartText.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
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
        var clrTitle=this.GetDefaultColor(id);
        if (varItem.Color) clrTitle= this.GetColor(varItem.Color);

        if (varItem.UpColor) chartMACD.UpColor=varItem.UpColor;
        if (varItem.DownColor) chartMACD.DownColor=varItem.DownColor;

        this.ReloadChartResource(hqChart,windowIndex,chartMACD);

        hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chartMACD.Data, varItem.Name, clrTitle);

        this.SetChartIndexName(chartMACD);
        hqChart.ChartPaint.push(chartMACD);
    }

    this.CreatePointDot = function (hqChart, windowIndex, varItem, id, hisData) 
    {
        let pointDot = new ChartPointDot();
        pointDot.Canvas = hqChart.Canvas;
        pointDot.Name = varItem.Name;
        pointDot.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        pointDot.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) pointDot.Color = this.GetColor(varItem.Color);
        else pointDot.Color = this.GetDefaultColor(id);

        if (varItem.Radius) pointDot.Radius = varItem.Radius;

        if (varItem.LineWidth) 
        {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) pointDot.Radius = width;
        }

        if (IFrameSplitOperator.IsBool(varItem.UpDownDot)) 
        {
            pointDot.EnableUpDownColor=varItem.UpDownDot;
            pointDot.HistoryData=hisData;
        }

        let titleIndex = windowIndex + 1;
        pointDot.Data.Data = varItem.Data;
        hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(pointDot.Data, varItem.Name, pointDot.Color);

        hqChart.ChartPaint.push(pointDot);
    }

    this.CreateStick = function (hqChart, windowIndex, varItem, id) 
    {
        let chart = new ChartStick();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
        else chart.Color = this.GetDefaultColor(id);

        if (varItem.LineWidth)
        {
            let width = parseInt(varItem.LineWidth.replace("LINETHICK", ""));
            if (!isNaN(width) && width > 0) chart.LineWidth = width;
        }

        let titleIndex = windowIndex + 1;
        chart.Data.Data = varItem.Data;
        this.ReloadChartResource(hqChart,windowIndex,chart);

        hqChart.TitlePaint[titleIndex].Data[id] = new DynamicTitleData(chart.Data, varItem.Name, chart.Color);

        this.SetChartIndexName(chart);
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

    this.CreateVolStick = function (hqChart, windowIndex, varItem, id, hisData) 
    {
        let chart = new ChartVolStick();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.KLineDrawType = hqChart.KLineDrawType;  //设置K线显示类型
        if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
        else chart.Color = this.GetDefaultColor(id);

        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;

        let titleIndex = windowIndex + 1;
        chart.Data.Data = varItem.Data;
        chart.HistoryData = hisData;
        this.ReloadChartResource(hqChart,windowIndex,chart);

        var titleData=new DynamicTitleData(chart.Data, varItem.Name, chart.Color);
        hqChart.TitlePaint[titleIndex].Data[id] = titleData;
        this.SetTitleData(titleData,chart);

        this.SetChartIndexName(chart);
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
    this.CreateKLine = function (hqChart, windowIndex, varItem, id) 
    {
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

    this.CreateDrawColorKLine=function(hqChart,windowIndex,varItem,i)
    {
        let chart=new ChartColorKline();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.DrawName="DRAWCOLORKLINE";
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data=varItem.Draw.DrawData;
        if (IFrameSplitOperator.IsBool(varItem.Draw.IsEmptyBar)) chart.IsEmptyBar=varItem.Draw.IsEmptyBar;
        if (varItem.Draw.Color) chart.Color=varItem.Draw.Color;
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

    this.CreateDrawIcon=function(hqChart, windowIndex, varItem, id, drawCallback)
    {
        var chart = new ChartDrawIcon();
        chart.Canvas = hqChart.Canvas;
        chart.TextAlign = 'center';
        chart.Identify=id;
        chart.DrawCallback=drawCallback;

        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data.Data = varItem.Draw.DrawData;
        chart.IconID=varItem.Draw.IconID;
        if (varItem.Color) chart.Color = this.GetColor(varItem.Color);
        else chart.Color = 'rgb(0,0,0)';

        if (varItem.Draw.MarkID) chart.MarkID=varItem.Draw.MarkID;  //外部指定ID

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chart.TextBaseline="top";
            else if (varItem.DrawVAlign==1) chart.TextBaseline="middle";
            else if (varItem.DrawVAlign==2) chart.TextBaseline="bottom";
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chart.TextAlign="left";
            else if (varItem.DrawAlign==1) chart.TextAlign="center";
            else if (varItem.DrawAlign==2) chart.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chart.FixedIconSize=varItem.DrawFontSize;

        hqChart.ChartPaint.push(chart);
    }

    //创建图标
    this.CreateIcon = function (hqChart, windowIndex, varItem, id) 
    {
        var event=hqChart.GetEventCallback(JSCHART_EVENT_ID.ON_BIND_DRAWICON);
        if (event && event.Callback)
        {
            var sendData={ FrameID:windowIndex, ID:id, Data:varItem, Callback:null };
            if (varItem.Draw.MarkID) sendData.MarkID=varItem.Draw.MarkID;  //外部指定ID
            event.Callback(event, sendData,this);
            if (sendData.Callback)
            {
                this.CreateDrawIcon(hqChart, windowIndex, varItem, id, sendData.Callback);
                return;
            }
        }

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

       

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.Direction=1;
            else if (varItem.DrawVAlign==1) chartText.Direction=0;
            else if (varItem.DrawVAlign==2) chartText.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }
        
        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
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

    this.CreateDrawText=function(hqChart,windowIndex,varItem,id)
    {
        let chartText=new ChartSingleText();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chartText.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chartText.ReloadResource();
        
        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawAbove) chartText.Direction=1;
        else chartText.Direction=0;

        if (varItem.DrawFontSize>0) chartText.TextFont=`${varItem.DrawFontSize}px 微软雅黑`;    //临时用下吧

        let titleIndex=windowIndex+1;
        chartText.DrawData=varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        hqChart.ChartPaint.push(chartText);
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

    this.CreateBackgroundDiv=function(hqChart,windowIndex,varItem,id)
    {
        var chart=new ChartBackgroundDiv();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;

        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.AryColor=drawData.AryColor;
            chart.ColorType=drawData.ColorType;
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

    this.CreateStackedBar=function(hqChart,windowIndex,varItem,i)
    {
        var chart=new ChartStackedBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame=hqChart.Frame.SubFrame[windowIndex].Frame;
        chart.HQChart=hqChart;

        chart.Data.Data=varItem.Draw.DrawData;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarColor)) chart.BarColor=varItem.Draw.BarColor;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarName)) chart.BarName=varItem.Draw.BarName;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.BarType)) chart.BarType=varItem.Draw.BarType;
        hqChart.ChartPaint.push(chart);

        var titleIndex=windowIndex+1;

        var titleData=new DynamicTitleData(chart.Data,chart.BarName,chart.BarColor);
        titleData.DataType="ChartStackedBar";
        hqChart.TitlePaint[titleIndex].Data[i]=titleData;
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
        if (varItem.Draw.Name) chart.Name=varItem.Draw.Name;
        if (varItem.Draw.LineDash) chart.LineDash=varItem.Draw.LineDash;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;

        if(varItem.Draw.Arrow)  //箭头配置
        {
            var item=varItem.Draw.Arrow;
            if (item.Start==true) chart.Arrow.Start=true;
            if (item.End==true) chart.Arrow.End=true;
            if (IFrameSplitOperator.IsNumber(item.Angle)) chart.ArrawAngle=item.Angle;
            if (IFrameSplitOperator.IsNumber(item.Length)) chart.ArrawLength=item.Length;
            if (IFrameSplitOperator.IsNumber(item.LineWidth)) chart.ArrawLineWidth=item.LineWidth;
        }
        
        hqChart.ChartPaint.push(chart);
    }

    this.CreateMultiPoint = function (hqChart, windowIndex, varItem, i) 
    {
        let chart = new ChartMultiPoint();
        chart.Canvas = hqChart.Canvas;
        chart.Name = varItem.Name;
        chart.ChartBorder = hqChart.Frame.SubFrame[windowIndex].Frame.ChartBorder;
        chart.ChartFrame = hqChart.Frame.SubFrame[windowIndex].Frame;

        chart.Data = hqChart.ChartPaint[0].Data;//绑定K线
        chart.PointGroup = varItem.Draw.DrawData;
        if (varItem.Draw.Name) chart.Name=varItem.Draw.Name;
       
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

        if (IFrameSplitOperator.IsNumber(this.YSplitType)) hqChart.Frame.SubFrame[windowIndex].Frame.YSplitOperator.SplitType=this.YSplitType;

        for (var i=0 ;i<this.OutVar.length;++i ) 
        {
            let item = this.OutVar[i];
            if (item.IsExData === true) continue; //扩展数据不显示图形
            if (item.Type==1000 || item.Type==1001) continue;      //数据集合, 字符串

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
                    this.CreateDrawTextV2(hqChart, windowIndex, item, i);
                    break;
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
                case "DRAWKLINE1":
                    this.CreateKLine(hqChart, windowIndex, item, i);
                    break;
                case "DRAWCOLORKLINE":
                    this.CreateDrawColorKLine(hqChart,windowIndex,item,i);
                    break;
                case 'DRAWKLINE_IF':
                    this.CreateKLine(hqChart, windowIndex, item, i);
                    break;
                case 'POLYLINE':
                    this.CreatePolyLine(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWNUMBER':
                    this.CreateDrawNumber(hqChart, windowIndex, item, i);
                    break;
                case 'DRAWICON':
                    this.CreateIcon(hqChart, windowIndex, item, i);
                    break;
                case "ICON":
                    this.CreateIcon(hqChart,windowIndex,item,i);
                    break;
                case 'DRAWRECTREL':
                    this.CreateRectangle(hqChart, windowIndex, item, i);
                    break;
                case "DRAWTEXTABS":
                case "DRAWTEXTREL":
                    this.CreateDrawText(hqChart,windowIndex,item,i);
                    break;
                case 'DRAWGBK':
                case "DRAWGBK2":
                    this.CreateBackgroud(hqChart,windowIndex,item,i);
                    break;
                case "DRAWGBK_DIV":
                    this.CreateBackgroundDiv(hqChart,windowIndex,item,i);
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
                case "MULTI_POINT":
                    this.CreateMultiPoint(hqChart,windowIndex,item,i);
                    break;
                case 'MULTI_BAR':
                    this.CreateMultiBar(hqChart, windowIndex, item, i);
                    break;
                case "KLINE_BG":
                    this.CreateBackgroud(hqChart,windowIndex,item,i);
                    break;
                case SCRIPT_CHART_NAME.OVERLAY_BARS:
                    this.CreateStackedBar(hqChart,windowIndex,item,i);
                    break;
                }
            }
            else if (item.Type == 2) 
            {
                this.CreateMACD(hqChart, windowIndex, item, i);
            }
            else if (item.Type == 3) 
            {
                this.CreatePointDot(hqChart, windowIndex, item, i, hisData);
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
            else if (item.Type==7)
            {
                this.CreateLine(hqChart, windowIndex, item, i, 7);
            }
            else if (item.Type==9)
            {
                this.CreateArea(hqChart,windowIndex,item,i);
            }

            var titlePaint = hqChart.TitlePaint[windowIndex + 1];
            if (titlePaint && titlePaint.Data && i < titlePaint.Data.length) //设置标题数值 小数位数和格式
            {
                if (this.StringFormat > 0) titlePaint.Data[i].StringFormat = this.StringFormat;
                if (this.FloatPrecision >= 0) titlePaint.Data[i].FloatPrecision = this.FloatPrecision;

                if (this.OutName && this.OutName.length>0 && this.Arguments && this.Arguments.length>0)
                {
                    titlePaint.SetDynamicTitle(this.OutName,this.Arguments);
                }
            }
        }

        let titleIndex = windowIndex + 1;
        hqChart.TitlePaint[titleIndex].Title = this.Name;
        hqChart.TitlePaint[titleIndex].ArgumentsText = null;

        if (!this.IsShortTitle)
        {
            let indexParam = '';
            for (let i=0; i<this.Arguments.length; ++i) 
            {
                let item = this.Arguments[i];
                if (indexParam.length > 0) indexParam += ',';
                indexParam += item.Value.toString();
            }

            if (indexParam.length > 0) hqChart.TitlePaint[titleIndex].ArgumentsText =`(${indexParam})`;
        }
        
        if (this.TitleFont) hqChart.TitlePaint[titleIndex].Font=this.TitleFont;
        
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
        if (colorName.indexOf("RGB(")==0) return colorName.toLowerCase();
        if (colorName.indexOf('rgb(')==0)return colorName;
        if (colorName.indexOf("RGBA(")==0) return colorName.toLowerCase();
        if (colorName.indexOf("rgba(")==0) return colorName;

        var color=JSCommonComplier.JSComplier.ColorVarToRGB(colorName);
        if (color) return color;

        return 'rgb(30,144,255)';

        /*
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
        */
    }

    //给图形设置指标名字
    this.SetChartIndexName=function(chart)
    {
        if (this.Name) chart.IndexName=this.Name;
        else if (this.ID) chart.IndexName==this.ID;

        if (this.ID) chart.IndexID=this.ID;
        
        chart.Script=this;  //指标内容绑定上去
    }
}

var HQ_DATA_TYPE =
{
    KLINE_ID: 0,         //K线
    MINUTE_ID: 2,        //当日走势图
    HISTORY_MINUTE_ID: 3,//历史分钟走势图
    MULTIDAY_MINUTE_ID: 4,//多日走势图
};

function OverlayScriptIndex(name,script,args,option)
{
    this.newMethod=ScriptIndex;   //派生
    this.newMethod(name,script,args,option);
    delete this.newMethod;

    this.ClassName="OverlayScriptIndex";
    //叠加指标
    this.OverlayIndex=null; // { IsOverlay:true, Identify:overlayFrame.Identify, WindowIndex:windowIndex, Frame:overlayFrame }

    //显示指标不符合条件
    this.ShowConditionError=function(param,msg)
    {
        var hqChart=param.HQChart;
        var windowIndex=param.WindowIndex;

        var message='指标不支持当前品种或周期';
        if (msg) message=msg;

        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        frame.ChartPaint=[];
        
        var chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.NotSupportMessage=message;
        frame.ChartPaint.push(chart);
        hqChart.Draw();
    }

    this.BindData=function(hqChart,windowIndex,hisData)
    {
        if (!this.OverlayIndex || this.OverlayIndex.IsOverlay!=true) return;

        this.OverlayIndex.Frame.ChartPaint=[];
        if (!IFrameSplitOperator.IsNonEmptyArray(this.OutVar)) return;

        //修改Y轴分割方式
        if (IFrameSplitOperator.IsNumber(this.YSplitType)) this.OverlayIndex.Frame.Frame.YSplitOperator.SplitType=this.YSplitType;
        
        //指标名字
        var titleInfo={ Data:[], Title:this.Name };
        let indexParam='';
        for(var i in this.Arguments)
        {
            let item=this.Arguments[i];
            if (indexParam.length>0) indexParam+=',';
            indexParam+=item.Value.toString();
        }
        if (indexParam.length>0) titleInfo.Title=this.Name+'('+indexParam+')';

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.set(this.OverlayIndex.Identify,titleInfo);
        this.OverlayIndex.Frame.Frame.Title=titleInfo.Title;    //给子框架设置标题
        if (this.OutName && this.OutName.length>0 && this.Arguments && this.Arguments.length>0)
        {
            titlePaint.SetDynamicTitle(this.OutName,this.Arguments, this.OverlayIndex.Identify);
        }

        for(var i in this.OutVar)
        {
            let item=this.OutVar[i];
            if (item.IsExData===true) continue; //扩展数据不显示图形

            if (item.Type==0)  
            {
                this.CreateLine(hqChart,windowIndex,item,i,item.Type);
            }
            else if (item.Type==1)
            {
                switch(item.Draw.DrawType)
                {
                    case 'STICKLINE':
                        this.CreateBar(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT':
                        this.CreateDrawTextV2(hqChart,windowIndex,item,i);
                        break;
                    case 'SUPERDRAWTEXT':
                        this.CreateText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWLINE':
                        this.CreateStraightLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWBAND':
                        this.CreateBand(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE':
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWKLINE_IF':
                        this.CreateKLine(hqChart,windowIndex,item,i);
                        break;
                    case 'POLYLINE':
                        this.CreatePolyLine(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWNUMBER':
                    case "DRAWNUMBER_FIX":  
                    case 'DRAWTEXT_FIX':  
                        this.CreateNumberText(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWICON':
                        this.CreateIcon(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWCHANNEL':
                        this.CreateChannel(hqChart,windowIndex,item,i);
                        break;
                    case 'DRAWTEXT_LINE':
                        this.CreateTextLine(hqChart,windowIndex,item,i);
                        break;
                    case "VERTLINE":
                        this.CreateChartVericaltLine(hqChart,windowIndex,item,i);
                        break;
                    case "HORLINE":
                        this.CreateChartHorizontalLine(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_LINE':
                        this.CreateMultiLine(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_POINT":
                        this.CreateMultiPoint(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_BAR':
                        this.CreateMultiBar(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_TEXT':
                        this.CreateMultiText(hqChart,windowIndex,item,i);
                        break;
                    case 'MULTI_SVGICON':
                        this.CreateMultiSVGIcon(hqChart,windowIndex,item,i);
                        break;
                    case "DRAWSVG":
                        this.CreateChartDrawSVG(hqChart,windowIndex,item,i);
                        break;
                    case "MULTI_HTMLDOM":
                        this.CreateMulitHtmlDom(hqChart,windowIndex,item,i);
                        break;

                    case "KLINE_BG":
                        this.CreateBackgroud(hqChart,windowIndex,item,i);
                        break;

                    case 'PARTLINE':
                        this.CreatePartLine(hqChart,windowIndex,item,i);
                        break;

                    case "DRAWTEXTABS":
                    case "DRAWTEXTREL":
                        this.CreateDrawText(hqChart,windowIndex,item,i);
                        break;

                    case SCRIPT_CHART_NAME.OVERLAY_BARS:
                        this.CreateStackedBar(hqChart,windowIndex,item,i);
                        break;

                    default:
                        {
                            var find=g_ScriptIndexChartFactory.Get(item.Draw.DrawType);  //外部挂接
                            if (find && find.CreateChartCallback)
                                find.CreateChartCallback(hqChart,windowIndex,item,i, this);
                        }
                        break;
                }
            }
            else if (item.Type==2)
            {
                this.CreateMACD(hqChart,windowIndex,item,i);
            }
            else if (item.Type==3)
            {
                this.CreatePointDot(hqChart,windowIndex,item,i, hisData);
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
            else if (item.Type==7)
            {
                this.CreateLine(hqChart,windowIndex,item,i,item.Type);
            }
            else if (item.Type==8)
            {
                this.CreateLine(hqChart,windowIndex,item,i, item.Type);
            }
            else if (item.Type==9)
            {
                this.CreateArea(hqChart,windowIndex,item,i);
            }
        }

        return true;
    }

    //指标执行完成
    this.RecvResultData=function(outVar,param)
    {
        let hqChart=param.HQChart;
        let windowIndex=param.WindowIndex;
        let hisData=param.HistoryData;
        param.Self.OutVar=outVar;
        param.Self.BindData(hqChart,windowIndex,hisData);

        param.HQChart.UpdataDataoffset();           //更新数据偏移
        param.HQChart.UpdateFrameMaxMin();          //调整坐标最大 最小值
        param.HQChart.Draw();

        var event=hqChart.GetOverlayIndexEvent();  //指标计算完成回调
        if (event)
        {
            var self=param.Self;
            var data={ OutVar:self.OutVar, WindowIndex: windowIndex, Name: self.Name, Arguments: self.Arguments, HistoryData: hisData, 
                    Identify:self.OverlayIndex.Identify,
                    Stock: {Symbol:hqChart.Symbol,Name:hqChart.Name} };
            event.Callback(event,data,self);
        }
    }

    //自定义图形配色
    this.ReloadChartResource=function(hqChart, windowIndex, chart)
    {
        var event=hqChart.GetEventCallback(JSCHART_EVENT_ID.ON_RELOAD_OVERLAY_INDEX_CHART_RESOURCE);  //指标计算完成回调
        if (!event || !event.Callback) return;
        
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var script=frame.Script;

        var sendData={ Chart:chart, IndexName:script.Name,IndexID:script.ID, HQChart:hqChart, WindowIndex:windowIndex, Guid:overlayIndex.Identify };
        event.Callback(event,sendData,this);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //  图形创建
    /////////////////////////////////////////////////////////////////////////////////////
    this.CreateLine=function(hqChart,windowIndex,varItem,id,lineType)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        if (lineType==7) var chart=new ChartStepLine();
        else var chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.DrawType=1;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (lineType==8)
        {
            chart.DrawType=2;
            chart.BreakPoint=varItem.BreakPoint;
        }

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        if (varItem.IsShow==false) chart.IsShow=false;
       
        chart.Data.Data=varItem.Data;
        this.ReloadChartResource(hqChart, windowIndex, chart);

        let titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);
        this.SetTitleData(titleData,chart);

        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    //创建柱子
    this.CreateBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStickLine();
        chart.Canvas=hqChart.Canvas;
        if (varItem.Draw.Width>0) chart.Width=varItem.Draw.Width;
        else chart.Width=1;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);
        
        chart.Data.Data=varItem.Draw.DrawData;

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateDrawText=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.IsDrawAbove) chart.Direction=1;
        else chart.Direction=0;

        chart.DrawData=varItem.Draw.DrawData;
        if (varItem.DrawFontSize>0) chart.TextFont=`${varItem.DrawFontSize*GetDevicePixelRatio()}px 微软雅黑`;    //临时用下吧

        frame.ChartPaint.push(chart);
    }

    //DRAWTEXT
    this.CreateDrawTextV2=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        var chartText=new ChartDrawText();
        chartText.Canvas=hqChart.Canvas;
        chartText.Name=varItem.Name;
        chartText.ChartBorder=frame.Frame.ChartBorder;
        chartText.ChartFrame=frame.Frame;
        chartText.Identify=overlayIndex.Identify;
        chartText.ReloadResource();

        if (varItem.Color) chartText.Color=this.GetColor(varItem.Color);
        else chartText.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawCenter===true) chartText.TextAlign='center';
        if (varItem.IsDrawAbove===true) chartText.TextBaseline='bottom'
        if (varItem.IsDrawBelow===true) chartText.TextBaseline='top';

        if (varItem.Draw.DrawData) chartText.Data.Data=varItem.Draw.DrawData;
        chartText.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chartText.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chartText.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chartText.TextAlign=varItem.Draw.TextAlign;
        //指定输出位置
        if (varItem.Draw.FixedPosition==="TOP") chartText.FixedPosition=1;
        else if (varItem.Draw.FixedPosition==="BOTTOM") chartText.FixedPosition=2;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chartText.TextBaseline='top';
            else if (varItem.DrawVAlign==1) chartText.TextBaseline='middle';
            else if (varItem.DrawVAlign==2) chartText.TextBaseline='bottom';
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chartText.TextAlign="left";
            else if (varItem.DrawAlign==1) chartText.TextAlign="center";
            else if (varItem.DrawAlign==2) chartText.TextAlign='right';
        }

        if (varItem.DrawFontSize>0) chartText.FixedFontSize=varItem.DrawFontSize;
        if (varItem.Background) chartText.TextBG=varItem.Background;
        if (varItem.VerticalLine) chartText.VerticalLine=varItem.VerticalLine;
        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chartText.ShowOffset.X=varItem.XOffset;
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chartText.ShowOffset.Y=varItem.YOffset;
        
        //let titleIndex=windowIndex+1;
        frame.ChartPaint.push(chartText);
    }

    //创建文本
    this.CreateText=function(hqChart,windowIndex,varItem,id, drawName)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        let titleIndex=windowIndex+1;
        if (varItem.Draw.Position) chart.Position=varItem.Draw.Position;    //赋值坐标
        if (varItem.Draw.DrawData) chart.Data.Data=varItem.Draw.DrawData;
        chart.Text=varItem.Draw.Text;
        if (varItem.Draw.Direction>0) chart.Direction=varItem.Draw.Direction;
        if (varItem.Draw.YOffset>0) chart.YOffset=varItem.Draw.YOffset;
        if (varItem.Draw.TextAlign) chart.TextAlign=varItem.Draw.TextAlign;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        frame.ChartPaint.push(chart);
    }

    //COLORSTICK 
    this.CreateMACD=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMACD();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var clrTitle=this.GetDefaultColor(id);
        if (varItem.Color) clrTitle=this.GetColor(varItem.Color);
        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;

        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,clrTitle);

        frame.ChartPaint.push(chart);
    }

    this.CreatePointDot=function(hqChart,windowIndex,varItem,id,hisData)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartPointDot();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.Radius) chart.Radius=varItem.Radius;

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.Radius=width;
        }

        if (IFrameSplitOperator.IsBool(varItem.UpDownDot)) 
        {
            chart.EnableUpDownColor=varItem.UpDownDot;
            chart.HistoryData=hisData;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateStick=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateLineStick=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLineStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateStraightLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLine();
        chart.DrawType=1;
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(line.Data,varItem.Name,line.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateVolStick=function(hqChart,windowIndex,varItem,id,hisData)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartVolStick();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.KLineDrawType=hqChart.KLineDrawType;  //设置K线显示类型
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.UpColor) chart.UpColor=varItem.UpColor;
        if (varItem.DownColor) chart.DownColor=varItem.DownColor;

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Data;
        chart.HistoryData=hisData;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(chart.Data,varItem.Name,chart.Color);

        this.SetChartIndexName(chart);
        frame.ChartPaint.push(chart);
    }

    this.CreateBand=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartBand();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.FirstColor = varItem.Draw.Color[0];
        chart.SecondColor = varItem.Draw.Color[1];
        chart.Data.Data=varItem.Draw.DrawData;

        frame.ChartPaint.push(chart);
    }

    //创建K线图
    this.CreateKLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartKLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data.Data=varItem.Draw.DrawData;
        chart.IsShowMaxMinPrice=false;
        chart.IsShowKTooltip=false;

        if (varItem.Color)  //如果设置了颜色,使用外面设置的颜色
            chart.UnchagneColor=chart.DownColor=chart.UpColor=this.GetColor(varItem.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreatePolyLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);

        if (varItem.LineWidth) 
        {
            let width=parseInt(varItem.LineWidth.replace("LINETHICK",""));
            if (!isNaN(width) && width>0) chart.LineWidth=width;
        }
        
        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=new DynamicTitleData(line.Data,' ',line.Color); //给一个空的标题

        frame.ChartPaint.push(chart);
    }

    this.CreateNumberText=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.ReloadResource();

        chart.TextAlign="center";
        if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
        else chart.Color=this.GetDefaultColor(id);
        if (varItem.IsDrawAbove) chart.Direction=1;
        else chart.Direction=2;

        if (varItem.Draw.Position) chart.Position=varItem.Draw.Position;    //赋值坐标

        let titleIndex=windowIndex+1;
        chart.Data.Data=varItem.Draw.DrawData.Value;
        chart.Text=varItem.Draw.DrawData.Text;

        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);

        frame.ChartPaint.push(chart);
    }

    this.CreateTextLine=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartTextLine();
        chart.Canvas=hqChart.Canvas;

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Text=drawData.Text;
            chart.Line=drawData.Line;
            chart.Price=drawData.Price;
        }

        frame.ChartPaint.push(chart);
    }

    this.CreateStackedBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartStackedBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarColor)) chart.BarColor=varItem.Draw.BarColor;
        if (IFrameSplitOperator.IsNonEmptyArray(varItem.Draw.BarName)) chart.BarName=varItem.Draw.BarName;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.BarType)) chart.BarType=varItem.Draw.BarType;

        chart.Data.Data=varItem.Draw.DrawData;

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData(chart.Data,chart.BarName,chart.BarColor);
        titleData.DataType="ChartStackedBar";
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;
        
        frame.ChartPaint.push(chart);
    }

    //创建图标
    this.CreateIcon=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartSingleText();
        chart.Canvas=hqChart.Canvas;
        chart.TextAlign='center';

        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (varItem.DrawVAlign>=0)
        {
            if (varItem.DrawVAlign==0) chart.Direction=1;
            else if (varItem.DrawVAlign==1) chart.Direction=0;
            else if (varItem.DrawVAlign==2) chart.Direction=2;
        }

        if (varItem.DrawAlign>=0)
        {
            if (varItem.DrawAlign==0) chart.TextAlign="left";
            else if (varItem.DrawAlign==1) chart.TextAlign="center";
            else if (varItem.DrawAlign==2) chart.TextAlign='right';
        }

        if (IFrameSplitOperator.IsNumber(varItem.XOffset)) chart.ShowOffset.X=varItem.XOffset;
        if (IFrameSplitOperator.IsNumber(varItem.YOffset)) chart.ShowOffset.Y=varItem.YOffset;
       
        chart.Data.Data=varItem.Draw.DrawData;
        var icon=varItem.Draw.Icon;
        if (icon.IconFont==true)
        {
            chart.IconFont={ Family:icon.Family, Text:icon.Symbol, Color:icon.Color };
        }
        else
        {
            chart.Text=icon.Symbol;
            if (varItem.Color) chart.Color=this.GetColor(varItem.Color);
            else if (icon.Color) chart.Color=icon.Color;
            else chart.Color='rgb(0,0,0)';
        }
        

        //var titleIndex=windowIndex+1;
        //hqChart.TitlePaint[titleIndex].Data[id]=new DynamicTitleData(bar.Data,varItem.Name,bar.Color);
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiLine=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Lines=varItem.Draw.DrawData; 
        if (varItem.Draw.LineDash) chart.LineDash=varItem.Draw.LineDash;
        if (IFrameSplitOperator.IsNumber(varItem.Draw.LineWidth)) chart.LineWidth=varItem.Draw.LineWidth;
        if(varItem.Draw.Arrow)  //箭头配置
        {
            var item=varItem.Draw.Arrow;
            if (item.Start==true) chart.Arrow.Start=true;
            if (item.End==true) chart.Arrow.End=true;
            if (IFrameSplitOperator.IsNumber(item.Angle)) chart.ArrawAngle=item.Angle;
            if (IFrameSplitOperator.IsNumber(item.Length)) chart.ArrawLength=item.Length;
            if (IFrameSplitOperator.IsNumber(item.LineWidth)) chart.ArrawLineWidth=item.LineWidth;
        }
        frame.ChartPaint.push(chart);
    }

    this.CreateMultiPoint=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiLine();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.PointGroup=varItem.Draw.DrawData; 
        
        frame.ChartPaint.push(chart);
    }

    this.CreateBackgroud=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartBackground();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        if (varItem.Draw && varItem.Draw.DrawData)
        {
            var drawData=varItem.Draw.DrawData;
            chart.Color=drawData.Color;
            chart.ColorAngle=drawData.Angle;

            if (drawData.Data) chart.Data.Data=drawData.Data;
        }

        frame.ChartPaint.push(chart);
    }

    this.CreateMultiBar=function(hqChart,windowIndex,varItem,id)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiBar();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Bars=varItem.Draw.DrawData; 

        var titleIndex=windowIndex+1;
        var titlePaint=hqChart.TitlePaint[titleIndex];
        var titleData=new DynamicTitleData({ KData:chart.Data, BarData:chart.Bars },varItem.Name,null);
        titleData.IsShow=false;
        titleData.DataType="MULTI_BAR";
        titlePaint.OverlayIndex.get(overlayIndex.Identify).Data[id]=titleData;

        frame.ChartPaint.push(chart);
    }

    this.CreateMultiText=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiText();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData; 
        frame.ChartPaint.push(chart);
    }

    this.CreateMulitHtmlDom=function(hqChart,windowIndex,varItem,i)
    {
        var overlayIndex=this.OverlayIndex;
        var frame=overlayIndex.Frame;
        let chart=new ChartMultiHtmlDom();
        chart.Canvas=hqChart.Canvas;
        chart.Name=varItem.Name;
        chart.ChartBorder=frame.Frame.ChartBorder;
        chart.ChartFrame=frame.Frame;
        chart.Identify=overlayIndex.Identify;
        chart.HQChart=hqChart;

        chart.Data=hqChart.ChartPaint[0].Data;//绑定K线
        chart.Texts=varItem.Draw.DrawData;
        chart.DrawCallback= varItem.Draw.Callback;
        frame.ChartPaint.push(chart);
    }

    //给一个默认的颜色
    this.GetDefaultColor=function(id)
    {
        let COLOR_ARRAY=
        [
            "rgb(24,71,178)",
            "rgb(42,230,215)",
            "rgb(252,96,154)",
            "rgb(0,128,255)",
            "rgb(229,0,79)",
            "rgb(68,114,196)",
            "rgb(255,174,0)",
            "rgb(25,199,255)",
            "rgb(175,95,162)",
            "rgb(236,105,65)",
        ];

        let number=parseInt(id);
        return COLOR_ARRAY[number%(COLOR_ARRAY.length-1)];
    }
}


function APIScriptIndex(name, script, args, option, isOverlay)     //后台执行指标
{
    if (isOverlay) this.newMethod=OverlayScriptIndex;   
    else this.newMethod = ScriptIndex;   //派生
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

    //接收到订阅指标数据
    this.RecvSubscribeData=function(data, hqChart, windowIndex, hisData)
    {
        this.RecvAPIData(data,hqChart,windowIndex,hisData);
    }

    this.ExecuteScript = function (hqChart, windowIndex, hisData) 
    {
        JSConsole.Chart.Log('[APIScriptIndex::ExecuteScript] name, Arguments ', this.Name, this.Arguments);

        //数据类型
        let hqDataType = HQ_DATA_TYPE.KLINE_ID;   //默认K线
        var dateRange=null;
        if (hqChart.ClassName === 'MinuteChartContainer' || hqChart.ClassName === 'MinuteChartHScreenContainer') 
        {
            if (hqChart.DayCount > 1) hqDataType = HQ_DATA_TYPE.MULTIDAY_MINUTE_ID; //多日分钟
            else hqDataType = HQ_DATA_TYPE.MINUTE_ID;                             //分钟数据

            dateRange=hisData.GetDateRange();
        }
        else if (hqChart.ClassName === 'HistoryMinuteChartContainer') 
        {
            hqDataType = HQ_DATA_TYPE.HISTORY_MINUTE_ID;   //历史分钟
        }
        else
        {
            dateRange=hisData.GetDateRange();
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

        var requestCount;
        if (hqChart.GetRequestDataCount) requestCount= hqChart.GetRequestDataCount();
        var self = this;
        var postData =
        {
            indexname: this.ID, symbol: hqChart.Symbol, script: this.Script, args: args,
            period: hqChart.Period, right: hqChart.Right, hqdatatype: hqDataType
        };

        if (dateRange) postData.DateRange=dateRange;
        if (requestCount)
        {
            postData.maxdatacount=requestCount.MaxRequestDataCount;
            postData.maxminutedaycount=requestCount.MaxRequestMinuteDayCount;
        }

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
        JSConsole.Chart.Log('[APIScriptIndex::RecvAPIData] recv data ', this.Name, data);
        if (data.code != 0) return;

        if (data.outdata && data.outdata.name) this.Name = data.outdata.name;

        if (data.outdata.args)  //外部修改显示参数
        {
            this.Arguments = [];
            for (var i in data.outdata.args) 
            {
                var item = data.outdata.args[i];
                this.Arguments.push({ Name: item.name, Value: item.value });
            }
        }

        if (this.HQDataType == HQ_DATA_TYPE.KLINE_ID) 
        {
            this.OutVar = this.FittingData(data.outdata, hqChart);
            JSConsole.Chart.Log('[APIScriptIndex::RecvAPIData] conver to OutVar ', this.OutVar);
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
                var data = 
                {
                    OutVar: this.OutVar, WindowIndex: windowIndex, Name: this.Name, Arguments: this.Arguments, HistoryData: hisData,
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
                    //小程序不支持svg, 只能转文字
                    if (IFrameSplitOperator.IsNumber(draw.IconType))
                        drawItem.Icon=JSCommonComplier.g_JSComplierResource.GetDrawTextIcon(draw.IconType);
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
                else if (draw.DrawType=="DRAWBAND")
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    drawItem.Color=draw.Color;  
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_LINE') 
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiLine(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;
                    if (IFrameSplitOperator.IsNonEmptyArray(drawItem.DrawData))
                    {
                        for(var k=0; k<drawItem.DrawData.length; ++k)
                        {
                            this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                        }
                    }

                    if (draw.LineDash) drawItem.LineDash=draw.LineDash;
                    if (draw.Arrow) drawItem.Arrow=draw.Arrow;
                    if (IFrameSplitOperator.IsNumber(draw.LineWidth)) drawItem.LineWidth=draw.LineWidth;
                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_POINT') 
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiLine(draw.DrawData, date, time, hqChart);
                    outVarItem.Draw = drawItem;
                    if (IFrameSplitOperator.IsNonEmptyArray(drawItem.DrawData))
                    {
                        for(var k=0; k<drawItem.DrawData.length; ++k)
                        {
                            this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                        }
                    }

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
                else if (draw.DrawType==SCRIPT_CHART_NAME.OVERLAY_BARS)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.BarName=draw.BarName;
                    drawItem.BarColor=draw.BarColor;
                    drawItem.LineWidth=draw.LineWidth;
                    drawItem.BarType=draw.BarType;
                    drawItem.DrawData=this.FittingArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType == 'MULTI_TEXT')
                {
                    drawItem.Text = draw.Text;
                    drawItem.Name = draw.Name;
                    drawItem.DrawType = draw.DrawType;
                    drawItem.DrawData = this.FittingMultiText(draw.DrawData, date, time, hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw = drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=="MULTI_HTMLDOM")    //外部自己创建dom
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.Callback=draw.Callback;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=="KLINE_BG")
                {
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ Color:draw.Color, Angle:draw.Angle };
                    drawItem.DrawData.Data=this.FittingKLineBG(draw.DrawData, hqChart);

                    outVarItem.Draw=drawItem;
                    outVarItem.Name=draw.DrawType;
                    result.push(outVarItem);
                }
            }
        }

        return result;
    }

    // h, high, low l.
    this.GetKLineData=function(data,hqChart)
    {
        if (!data) return;
        if (!Array.isArray(data)) return;
        var kData=hqChart.ChartPaint[0].Data;   //K线

        for(var i in data)
        {
            var item=data[i];
            if (!IFrameSplitOperator.IsString(item.Value)) continue;
            if(!IFrameSplitOperator.IsNumber(item.Index)) continue;
            if (item.Index<0 || item.Index>=kData.Data.length) continue;
            var valueName=item.Value.toUpperCase();
            var kItem=kData.Data[item.Index];
            switch(valueName)
            {
                case "HIGH":
                case "H":
                    item.Value=kItem.High;
                    break;
                case "L":
                case "LOW":
                    item.Value=kItem.Low;
                    break;
            }
        }
    }

    this.FittingKLineBG=function(data, hqChart)
    {
        var kData=hqChart.ChartPaint[0].Data;   //K线
        var result=[];
        if (ChartData.IsDayPeriod(hqChart.Period,true))  //日线
        {
            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length;)
            {
                result[i]=0;
                var kItem=kData.Data[i];
                if (j>=data.length) 
                {
                    ++i;
                    continue;
                }
                var dataItem=data[j];

                if (dataItem.Date<kItem.Date)
                {
                    ++j;
                }
                else if (dataItem.Date>kItem.Date)
                {
                    ++i;
                }
                else
                {
                    bFill=true;
                    result[i]=1;
                    ++j;
                    ++i;
                }
            }

            if (bFill) return result;
        }
        else if (ChartData.IsMinutePeriod(hqChart.Period,true)) //分钟线
        {
            var bFill=false;
            for(var i=0,j=0;i<kData.Data.length;)
            {
                result[i]=0;
                var kItem=kData.Data[i];
                if (j>=data.length) 
                {
                    ++i;
                    continue;
                }
                var dataItem=data[j];

                if (dataItem.Date<kItem.Date || (dataItem.Date==kItem.Date && dataItem.Time<kItem.Time))
                {
                    ++j;
                }
                else if (dataItem.Date>kItem.Date || (dataItem.Date==kItem.Date && dataItem.Time>kItem.Time))
                {
                    ++i;
                }
                else
                {
                    bFill=true;
                    result[i]=1;
                    ++j;
                    ++i;
                }
            }

            if (bFill) return result;
        }
        
        return null;
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

    this.FittingMinuteData=function(jsonData, hqChart)
    {
        var outVar=jsonData.outvar;
        var date=jsonData.date;
        var time=jsonData.time;
        var result=[];
        
        for(var i in outVar)
        {
            var item=outVar[i];
            var outVarItem={Name:item.name,Type:item.type}
            if (item.data)
            {
                outVarItem.Data=this.FittingMinuteArray(item.data,date,time,hqChart);
                if (item.color) outVarItem.Color=item.color;
                if (item.linewidth>=1) outVarItem.LineWidth=item.linewidth;
                if (item.isshow==false) outVarItem.IsShow = false;
                if (item.isexdata==true) outVarItem.IsExData = true;

                result.push(outVarItem);
            }
            else if (item.Draw)
            {
                var draw=item.Draw;
                var drawItem={};
                if (draw.DrawType=='DRAWICON')  //图标
                {
                    drawItem.Icon=draw.Icon;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='DRAWTEXT') //文本
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='STICKLINE')    //柱子
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.Width=draw.Width;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType==SCRIPT_CHART_NAME.OVERLAY_BARS)
                {
                    drawItem.Name=draw.Name;
                    drawItem.Type=draw.Type;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.BarName=draw.BarName;
                    drawItem.BarColor=draw.BarColor;
                    drawItem.LineWidth=draw.LineWidth;
                    drawItem.DrawData=this.FittingMinuteArray(draw.DrawData,date,time,hqChart,1);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_LINE')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    for(var k in drawItem.DrawData)
                    {
                        this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                    }
                    
                    outVarItem.Draw=drawItem;
                    if (draw.LineDash) drawItem.LineDash=draw.LineDash;
                    if (draw.Arrow) drawItem.Arrow=draw.Arrow;
                    if (IFrameSplitOperator.IsNumber(draw.LineWidth)) drawItem.LineWidth=draw.LineWidth;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_POINT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiLine(draw.DrawData,date,time,hqChart);
                    for(var k in drawItem.DrawData)
                    {
                        this.GetKLineData(drawItem.DrawData[k].Point, hqChart);
                    }
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_TEXT')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;
                    result.push(outVarItem);
                }
                else if (draw.DrawType=='MULTI_SVGICON')
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.DrawData={ Icon:this.FittingMultiText(draw.DrawData.Icon,date,time,hqChart), Family:draw.DrawData.Family };
                    this.GetKLineData(drawItem.DrawData.Icon, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
                else if (draw.DrawType=="MULTI_HTMLDOM")    //外部自己创建dom
                {
                    drawItem.Text=draw.Text;
                    drawItem.Name=draw.Name;
                    drawItem.DrawType=draw.DrawType;
                    drawItem.Callback=draw.Callback;
                    drawItem.DrawData=this.FittingMultiText(draw.DrawData,date,time,hqChart);
                    this.GetKLineData(drawItem.DrawData, hqChart);
                    outVarItem.Draw=drawItem;

                    result.push(outVarItem);
                }
            }
        }

        return result;
    }

    this.FittingMinuteArray=function(sourceData,date,time,hqChart)
    {
        var minutedata=hqChart.SourceData;;   //分钟线

        var arySingleData=[];
        for(var i in sourceData)
        {
            var value=sourceData[i];
            var indexItem=new SingleData(); //单列指标数据
            indexItem.Date=date[i];
            if (time && i<time.length) indexItem.Time=time[i];
            indexItem.Value=value;
            arySingleData.push(indexItem);
        }

        var aryFittingData=minutedata.GetMinuteFittingData(arySingleData);  //数据和主图K线拟合
        var bindData=new ChartData();
        bindData.Data=aryFittingData;
        var result=bindData.GetValue();
        return result;
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
  
//市场择时
function MarketTimingIndex() 
{
    this.newMethod = BaseIndex;   //派生
    this.newMethod('市场择时');
    delete this.newMethod;

    this.Index = new Array(
        new IndexInfo("因子择时", null)
    );

    this.TimingData; //择时数据
    this.TitleColor = g_JSChartResource.FrameSplitTextColor

    this.Create = function (hqChart, windowIndex) 
    {
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
    this.RequestData = function (hqChart, windowIndex, hisData) 
    {
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
        JSNetwork.HttpRequest({
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

    this.RecvData = function (recvData, param) 
    {
        if (recvData.data.data.length <= 0) return;

        var aryData = new Array();
        for (var i in recvData.data.data) 
        {
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

    this.BindData = function (hqChart, windowIndex, hisData)
     {
        var paint = hqChart.GetChartPaint(windowIndex);

        if (paint.length != this.Index.length) return false;

        //paint[0].Data.Data=SWLData;
        paint[0].Data.Data = this.TimingData;
        paint[0].NotSupportMessage = null;

        var titleIndex = windowIndex + 1;

        for (var i in paint) 
        {
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
function MarketAttentionIndex() 
{
    this.newMethod = BaseIndex;   //派生
    this.newMethod('市场关注度');
    delete this.newMethod;
  
    this.Index = new Array(
      new IndexInfo("市场关注度指数", null)
    );
  
    this.Data; //关注度数据
    this.TitleColor = g_JSChartResource.FrameSplitTextColor;
    this.ApiUrl = g_JSChartResource.Index.MarketAttentionApiUrl;
  
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
  
    //调整框架
    this.SetFrame = function (hqChart, windowIndex, hisData) 
    {
        hqChart.Frame.SubFrame[windowIndex].Frame.YSpecificMaxMin = { Max: 6, Min: 0, Count: 3 };
    }
  
    //请求数据
    this.RequestData = function (hqChart, windowIndex, hisData) 
    {
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
        JSNetwork.HttpRequest({
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
  
    this.RecvData = function (recvData, param) 
    {
        if (recvData.date.length < 0) return;
  
        var aryData = new Array();
        for (var i in recvData.date) 
        {
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
  
  
    this.BindData = function (hqChart, windowIndex, hisData) 
    {
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
function MarketHeatIndex() 
{
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
  
    this.Create = function (hqChart, windowIndex) 
    {
        for (var i in this.Index)
            {
            var paint = null;
            if (i == 0) 
            {
                paint = new ChartMACD();   //柱子
            }
            else 
            {
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
    this.RequestData = function (hqChart, windowIndex, hisData) 
    {
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
      JSNetwork.HttpRequest({
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
  
    this.RecvData = function (recvData, param) 
    {
         if (recvData.date.length < 0) return;
  
        var aryData = new Array();
        for (var i in recvData.date) 
        {
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
  
  
    this.BindData = function (hqChart, windowIndex, hisData)
    {
        var paint = hqChart.GetChartPaint(windowIndex);
    
        if (paint.length != this.Index.length) return false;
    
        paint[0].Data.Data = this.Data;
        paint[0].NotSupportMessage = null;
    
        var MA = HQIndexFormula.MA(this.Data, this.Index[0].Param);
        paint[1].Data.Data = MA;
    
        var MA2 = HQIndexFormula.MA(this.Data, this.Index[1].Param);
        paint[2].Data.Data = MA2;
    
        var titleIndex = windowIndex + 1;
  
        for (var i in paint) 
        {
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
function CustonIndexHeatIndex() 
{
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
  
    this.Create = function (hqChart, windowIndex) 
    {
        for (var i in this.Index) 
        {
            var paint = null;
            if (i == 0) 
            {
                paint = new ChartStraightArea();
            }
            else 
            {
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
    this.RequestData = function (hqChart, windowIndex, hisData) 
    {
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
        JSNetwork.HttpRequest({
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
  
    this.RecvData = function (recvData, param) 
    {
        let data = recvData.data;
        if (data.data == null || data.data.length < 0) return;
    
        //JSConsole.Chart.Log(recvData.data);
        let aryData = new Array();
        for (let i in data.data) 
        {
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
  
  
    this.BindData = function (hqChart, windowIndex, hisData) 
    {
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
    
        for (let i = 1; i < paint.length; ++i) 
        {
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
function BenfordIndex() 
{
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
            else if (i == 1)
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
    this.RequestData = function (hqChart, windowIndex, hisData) 
    {
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
        JSNetwork.HttpRequest({
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
  
    this.JsonDataToMapSingleData = function (recvData) 
    {
        var stockData = recvData.stock[0].stockday;
        var mapData = new Map();
        for (var i in stockData) 
        {
            var item = stockData[i];
            var indexData = new SingleData();
            indexData.Date = item.date;
            indexData.Value = new Array();
            if (item.finance1 != null && item.announcement1 != null) 
            {
                let year = item.announcement1.year;
                let quarter = item.announcement1.quarter;
                let value = item.finance1.benford;
                indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
            }
            if (item.finance2 != null && item.announcement2 != null) 
            {
                let year = item.announcement2.year;
                let quarter = item.announcement2.quarter;
                let value = item.finance2.benford;
                indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
            }
            if (item.finance3 != null && item.announcement3 != null) 
            {
                let year = item.announcement3.year;
                let quarter = item.announcement3.quarter;
                let value = item.finance3.benford;
                indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
            }
            if (item.finance4 != null && item.announcement4 != null) 
            {
                let year = item.announcement4.year;
                let quarter = item.announcement4.quarter;
                let value = item.finance4.benford;
                indexData.Value.push({ Year: year, Quarter: quarter, Value: value });
            }
  
            mapData.set(indexData.Date, indexData);
        }
  
        var aryData = new Array();
        for (var item of mapData) 
        {
            aryData.push(item[1]);
        }
  
        return aryData;
    }
  
    this.RecvData = function (recvData, param) 
    {
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
  
  
    this.BindData = function (hqChart, windowIndex, hisData) 
    {
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

export
{
    IndexInfo,
    BaseIndex,
    ScriptIndex,
    APIScriptIndex,
    OverlayScriptIndex,

    MarketLongShortIndex,
    MarketTimingIndex,
    MarketAttentionIndex,
    MarketHeatIndex,
    CustonIndexHeatIndex,
    BenfordIndex,
}

/*
module.exports =
{
    JSCommonIndex:
    {
        IndexInfo: IndexInfo,
        BaseIndex: BaseIndex,
        ScriptIndex:ScriptIndex,
        APIScriptIndex:APIScriptIndex,
    },

    //单个类导出
    JSCommonIndex_IndexInfo: IndexInfo,
    JSCommonIndex_BaseIndex: BaseIndex,
    JSCommonIndex_ScriptIndex:ScriptIndex,
    JSCommonIndex_APIScriptIndex:APIScriptIndex,
};
*/
