/*
    copyright (c) 2018 jones

    http://www.apache.org/licenses/LICENSE-2.0

    开源项目 https://github.com/jones2000/HQChart

    jones_2000@163.com
    
    标题画法
*/

import 
{
    g_JSChartResource,
    JSCHART_LANGUAGE_ID,
    g_JSChartLocalization,
} from './umychart.resource.wechat.js'

import 
{
    ChartData, HistoryData,
    SingleData, MinuteData,
    CUSTOM_DAY_PERIOD_START,
    CUSTOM_DAY_PERIOD_END,
    CUSTOM_MINUTE_PERIOD_START,
    CUSTOM_MINUTE_PERIOD_END,
    CUSTOM_SECOND_PERIOD_START,
    CUSTOM_SECOND_PERIOD_END,
    JSCHART_EVENT_ID,
} from "./umychart.data.wechat.js";

import 
{ 
    JSCommonCoordinateData 
} from "./umychart.coordinatedata.wechat.js";

import 
{
    KLINE_INFO_TYPE,
} from "./umychart.klineinfo.wechat.js";

import 
{
    IFrameSplitOperator,
} from './umychart.framesplit.wechat.js'

var MARKET_SUFFIX_NAME = JSCommonCoordinateData.MARKET_SUFFIX_NAME;

//标题画法基类
function IChartTitlePainting() 
{
    this.Frame;
    this.Data = new Array();
    this.Canvas;                        //画布
    this.IsDynamic = false;               //是否是动态标题
    this.Position = 0;                    //标题显示位置 0 框架里的标题  1 框架上面
    this.CursorIndex;                   //数据索引
    this.Font = g_JSChartResource.DynamicTitleFont;//"12px 微软雅黑";
    this.Title;                         //固定标题(可以为空)
    this.TitleColor = g_JSChartResource.DefaultTextColor;
    this.LanguageID = JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.UpdateUICallback;              //通知外面更新标题(老接口废弃)
    this.OnDrawEvent;                   //外部事件通知
    this.GetEventCallback;              //事件回调,新的版本同意都用这个
}

var PERIOD_NAME = ["日线", "周线", "月线", "年线", "1分", "5分", "15分", "30分", "60分", "季线", "分笔", "2小时", "4小时", "", ""];
var RIGHT_NAME = ['不复权', '前复权', '后复权'];
//K线标题
function DynamicKLineTitlePainting() 
{
    this.newMethod = IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName ='DynamicKLineTitlePainting';
    this.IsDynamic = true;
    this.IsShow = true;       //是否显示
    this.LineCount = 1;         //默认显示1行
    this.SpaceWidth = 1;        //空格宽度  
    this.TextSpace=-1;           //文字之间的间距
    this.Period;                //周期  

    this.UpColor = g_JSChartResource.UpTextColor;
    this.DownColor = g_JSChartResource.DownTextColor;
    this.UnchagneColor = g_JSChartResource.UnchagneTextColor;

    this.VolColor=g_JSChartResource.Title.VolColor;
    this.AmountColor=g_JSChartResource.Title.AmountColor;
    this.DateTimeColor=g_JSChartResource.Title.DateTimeColor;
    this.NameColor = g_JSChartResource.Title.NameColor;
    this.SettingColor=g_JSChartResource.Title.SettingColor;   //周期 复权
    this.PositionColor=g_JSChartResource.Title.PositionColor;   //持仓

    this.Symbol;
    this.UpperSymbol;
    this.Name;
    this.InfoData;
    this.InfoTextHeight = 15;
    this.InfoTextColor = g_JSChartResource.KLine.Info.TextColor;
    this.InfoTextBGColor = g_JSChartResource.KLine.Info.TextBGColor;

    this.IsShowName = true;           //是否显示股票名称
    this.IsShowSettingInfo = true;    //是否显示设置信息(周期 复权)

    this.GetCurrentKLineData = function () //获取当天鼠标位置所在的K线数据
    {
        if (this.CursorIndex == null || !this.Data) return null;
        if (this.Data.length <= 0) return null;

        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;
        if (dataIndex < 0) return null;

        var item = this.Data.Data[dataIndex];
        return item;
    }

    this.GetDataIndex=function()
    {
        if (this.CursorIndex == null || !this.Data) return null;
        if (this.Data.length <= 0) return null;

        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;
        if (dataIndex < 0) return null;

        return dataIndex;
    }

    this.SendUpdateUIMessage = function (funcName) //通知外面 标题变了
    {
        if (!this.UpdateUICallback) return;

        var sendData = {
            TitleName: 'K线标题', CallFunction: funcName, Stock: { Name: this.Name, Symbol: this.Symbol, },
            Rect:
            {
                Left: this.Frame.ChartBorder.GetLeft(), Right: this.Frame.ChartBorder.GetRight(),
                Top: 0, Bottom: this.Frame.ChartBorder.GetTop(),
            }
        };

        //有数据
        if (this.Data && this.Data.Data && this.Data.Data.length > 0) {
            let index = this.Data.Data.length - 1;    //默认最后一天的数据
            if (this.CursorIndex) {
                let cursorIndex = Math.abs(this.CursorIndex - 0.5);
                cursorIndex = parseInt(cursorIndex.toFixed(0));
                index = this.Data.DataOffset + cursorIndex;
                if (index >= this.Data.Data.length) index = this.Data.Data.length - 1;
            }

            if (index >= 0) {
                let item = this.Data.Data[index];
                sendData.Stock.Data =
                    {
                        Date: item.Date,
                        YClose: item.YClose, Open: item.Open, High: item.High, Low: item.Low, Close: item.Close,
                        Vol: item.Vol, Amount: item.Amount
                    }
                if (item.Time) sendData.Stock.Time = item.Time;  //分钟K线才有时间
            }

            if (this.Data.Period != null) sendData.Stock.PeriodName = this.GetPeriodName(this.Data.Period);   //周期名字
            if (this.Data.Right != null) sendData.Stock.RightName = RIGHT_NAME[this.Data.Right];       //复权名字
        }

        //console.log('[DynamicKLineTitlePainting::SendUpdateUIMessage', sendData);
        this.UpdateUICallback(sendData);
    }

    this.GetPeriodName = function (period) 
    {
        var name = '';
        if (period > CUSTOM_MINUTE_PERIOD_START && period <= CUSTOM_MINUTE_PERIOD_END)
            name = (period - CUSTOM_MINUTE_PERIOD_START) + g_JSChartLocalization.GetText('自定义分钟', this.LanguageID);
        else if (period > CUSTOM_DAY_PERIOD_START && period <= CUSTOM_DAY_PERIOD_END)
            name = (period - CUSTOM_DAY_PERIOD_START) + g_JSChartLocalization.GetText('自定义日线',this.LanguageID);
        else if (period > CUSTOM_SECOND_PERIOD_START && period <= CUSTOM_SECOND_PERIOD_END)
            name = (period - CUSTOM_SECOND_PERIOD_START) + g_JSChartLocalization.GetText('自定义秒', this.LanguageID);
        else
            name = g_JSChartLocalization.GetText(ChartData.GetPeriodName(period), this.LanguageID);
        return name;
    }

    this.GetRightName = function (rightID, periodID)
    {
        if (!MARKET_SUFFIX_NAME.IsEnableRight(periodID, this.Symbol)) return null;

        var rightName = RIGHT_NAME[rightID];
        return rightName
    }

    this.FullDraw=function()
    {
        if (!this.IsShow) return;
        this.UpperSymbol=this.Symbol ? this.Symbol.toUpperCase():'';
        if (this.CursorIndex == null || !this.Data || this.Data.length <= 0) 
        {
            this.OnDrawEventCallback(null, 'DynamicKLineTitlePainting::FullDraw');
            return;
        }

        if (this.TextSpace>=0) 
		{
			this.SpaceWidth=this.TextSpace;
		}
        else  
		{
			this.Canvas.font = this.Font;
			this.SpaceWidth = this.Canvas.measureText(' ').width;
		}
        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex=-1;
        if (dataIndex < 0) 
        {
            this.OnDrawEventCallback(null, 'DynamicKLineTitlePainting::FullDraw');
            return;
        }

        var item = this.Data.Data[dataIndex];
        this.OnDrawEventCallback(item, 'DynamicKLineTitlePainting::FullDraw');

        //console.log('[FullDraw]', item);

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            if (this.LineCount > 1) this.DrawMulitLine(item);
            else this.DrawSingleLine(item,true);
            this.Canvas.restore();
            if (!item.Time && item.Date && this.InfoData) this.HSCreenKLineInfoDraw(item.Date);
        }
        else 
        {
            if (this.LineCount > 1) this.DrawMulitLine(item);
            else this.DrawSingleLine(item, true);
            if (!item.Time && item.Date && this.InfoData) this.KLineInfoDraw(item.Date);
        }
    }

    this.DrawTitle = function () 
    {
        this.UpperSymbol=this.Symbol ? this.Symbol.toUpperCase():'';
        this.SendUpdateUIMessage('DrawTitle');
        this.OnDrawEventCallback(null, 'DynamicKLineTitlePainting::DrawTitle');

        if (!this.IsShow) return;
        if (!this.IsShowName && !this.IsShowSettingInfo) return;
        if (this.LineCount > 1) return;

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
        if (bottom < 5) return;

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;
        var position = { Left: left, Bottom: bottom, IsHScreen: false };

        if (this.IsShowName && this.Name) 
        {
            if (!this.DrawKLineText(this.Name, this.NameColor, position)) return;
        }

        if (this.IsShowSettingInfo && this.Data.Period != null && this.Data.Right != null) 
        {
            var periodName = this.GetPeriodName(this.Data.Period);
            var rightName = this.GetRightName(this.Data.Right,this.Data.Period);
            var text = "(" + periodName + ")";
            if (rightName) text = "(" + periodName + " " + rightName + ")";
            if (!this.DrawKLineText(text, this.SettingColor, position)) return;
        }
    }

    this.HScreenDrawTitle = function () 
    {
        var xText = this.Frame.ChartBorder.GetRight();
        var yText = this.Frame.ChartBorder.GetTop();
        var right = this.Frame.ChartBorder.GetHeight();
        if (this.Frame.ChartBorder.Right < 10) return;

        this.Canvas.translate(xText, yText);
        this.Canvas.rotate(90 * Math.PI / 180);

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var left = 2;
        var bottom = -2;
        var position = { Left: left, Bottom: bottom, IsHScreen: false };
        if (this.IsShowName && this.Name) 
        {
            if (!this.DrawKLineText(this.Name, this.NameColor, position)) return;
        }

        if (this.IsShowSettingInfo && this.Data.Period != null && this.Data.Right != null) 
        {
            var periodName = this.GetPeriodName(this.Data.Period);
            var rightName = this.GetRightName(this.Data.Right,this.Data.Period);
            var text = "(" + periodName + ")";
            if (rightName) text = "(" + periodName + " " + rightName + ")";
            if (!this.DrawKLineText(text, this.SettingColor, position)) return;
        }
    }

    this.DrawMulitLine = function (item) //画多行
    {
        var isHScreen = this.Frame.IsHScreen === true;
        var leftSpace = 1;
        var bottomSpace = 1;
        var left = this.Frame.ChartBorder.GetLeft() + leftSpace;;
        var width = this.Frame.ChartBorder.GetWidth();
        var height = this.Frame.ChartBorder.GetTop();
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);//价格小数位数
        if (isHScreen) 
        {
            var left = leftSpace;;
            var width = this.Frame.ChartBorder.GetHeight();
            var height = this.Frame.ChartBorder.Right;
            var xText = this.Frame.ChartBorder.GetChartWidth();
            var yText = this.Frame.ChartBorder.GetTop();

            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
        }

        var itemHeight = (height - bottomSpace) / this.LineCount;
        var itemWidth = (width - leftSpace) / 4;
        var bottom = itemHeight;

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var text = IFrameSplitOperator.FormatDateString(item.Date);
        this.Canvas.fillStyle = this.DateTimeColor;
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        this.Canvas.textAlign = "left";
        this.Canvas.fillStyle = this.GetColor(item.Open, item.YClose);
        var text = g_JSChartLocalization.GetText('Tooltip-Open', this.LanguageID) + item.Open.toFixed(defaultfloatPrecision);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        this.Canvas.fillStyle = this.GetColor(item.High, item.YClose);
        var text = g_JSChartLocalization.GetText('Tooltip-High', this.LanguageID) + item.High.toFixed(defaultfloatPrecision);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        var value = (item.Close - item.YClose) / item.YClose * 100;
        this.Canvas.fillStyle = this.GetColor(value, 0);
        var text = g_JSChartLocalization.GetText('Tooltip-Increase', this.LanguageID) + value.toFixed(2) + '%';
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        bottom += itemHeight;   //换行
        var left = this.Frame.ChartBorder.GetLeft() + leftSpace;
        if (isHScreen) left = leftSpace;
        if (ChartData.IsMinutePeriod(this.Period, true) && item.Time)
        {
            this.Canvas.fillStyle = this.DateTimeColor;
            var text = IFrameSplitOperator.FormatTimeString(item.Time);
            this.Canvas.fillText(text, left, bottom, itemWidth);
        }
        else if (ChartData.IsSecondPeriod(this.Period) && item.Time)
        {
            this.Canvas.fillStyle = this.SettingColor;
            var text = IFrameSplitOperator.FormatTimeString(item.Time, 'HH:MM:SS');
            this.Canvas.fillText(text, left, bottom, itemWidth);
        }
        left += itemWidth;

        this.Canvas.fillStyle = this.GetColor(item.Close, item.YClose);
        var text = g_JSChartLocalization.GetText('Tooltip-Close', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        this.Canvas.fillStyle = this.GetColor(item.Low, item.YClose);
        var text = g_JSChartLocalization.GetText('Tooltip-Low', this.LanguageID) + item.Low.toFixed(defaultfloatPrecision);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        this.Canvas.fillStyle = this.AmountColor;
        var text = g_JSChartLocalization.GetText('Tooltip-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;
    }

    this.DrawSingleLine = function (item,bDrawTitle)  //画单行
    {
        var isHScreen = this.Frame.IsHScreen === true;
        var left = this.Frame.ChartBorder.GetLeft();
        //var bottom=this.Frame.ChartBorder.GetTop()-this.Frame.ChartBorder.Top/2;
        var bottom = this.Frame.ChartBorder.GetTop();
        var right = this.Frame.ChartBorder.GetRight();
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);//价格小数位数

        if (isHScreen) 
        {
            right = this.Frame.ChartBorder.GetHeight();
            if (this.Frame.ChartBorder.Right < 5) return;
            left = 2;
            bottom = -2;
            var xText = this.Frame.ChartBorder.GetRight();
            var yText = this.Frame.ChartBorder.GetTop();
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
        }
        else 
        {
            if (bottom < 5) return;
        }

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var position = { Left: left, Bottom: bottom, IsHScreen: isHScreen };

        if (this.IsShowName) //名称
        {
            if (!this.DrawKLineText(this.Name, this.NameColor, position, bDrawTitle==true)) return;
        }

        if (this.IsShowSettingInfo) //周期 复权信息
        {
            var periodName = this.GetPeriodName(this.Data.Period);
            var rightName = this.GetRightName(this.Data.Right,this.Data.Period);
            var text = "(" + periodName + ")";
            if (rightName) text = "(" + periodName + " " + rightName + ")";
            if (!this.DrawKLineText(text, this.SettingColor, position, bDrawTitle==true)) return;
        }

        var text = IFrameSplitOperator.FormatDateString(item.Date); //日期
        if (!this.DrawKLineText(text, this.DateTimeColor, position)) return;

        //时间
        //console.log(`[DrawSingleLine] ${this.Period} ${item.Time} ${item.Date}`);
        if (ChartData.IsMinutePeriod(this.Period, true) && IFrameSplitOperator.IsNumber(item.Time))
        {
            var text = IFrameSplitOperator.FormatTimeString(item.Time,"HH:MM");
            if (!this.DrawKLineText(text, this.DateTimeColor, position)) return;
        }
        else if (ChartData.IsSecondPeriod(this.Period) && IFrameSplitOperator.IsNumber(item.Time))
        {
            var text = IFrameSplitOperator.FormatTimeString(item.Time, "HH:MM:SS");
            if (!this.DrawKLineText(text, this.DateTimeColor, position)) return;
        }

        var color = this.GetColor(item.Open, item.YClose);
        var text = g_JSChartLocalization.GetText('KTitle-Open', this.LanguageID) + item.Open.toFixed(defaultfloatPrecision);
        if (!this.DrawKLineText(text, color, position)) return;

        var color = this.GetColor(item.High, item.YClose);
        var text = g_JSChartLocalization.GetText('KTitle-High', this.LanguageID) + item.High.toFixed(defaultfloatPrecision);
        if (!this.DrawKLineText(text, color, position)) return;

        var color = this.GetColor(item.Low, item.YClose);
        var text = g_JSChartLocalization.GetText('KTitle-Low', this.LanguageID) + item.Low.toFixed(defaultfloatPrecision);
        if (!this.DrawKLineText(text, color, position)) return;

        var color = this.GetColor(item.Close, item.YClose);
        var text = g_JSChartLocalization.GetText('KTitle-Close', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
        if (!this.DrawKLineText(text, color, position)) return;

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Vol', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Vol, 2, this.LanguageID);
            if (!this.DrawKLineText(text, this.VolColor, position)) return;
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
            if (!this.DrawKLineText(text, this.AmountColor, position)) return;
        }

        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.UpperSymbol) && IFrameSplitOperator.IsNumber(item.Position))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Position', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            if (!this.DrawKLineText(text, this.PositionColor, position)) return;
        }
    }

    this.OnDrawEventCallback = function (drawData, explain) 
    {
        if (!this.OnDrawEvent || !this.OnDrawEvent.Callback) return;
        var data = { Draw: drawData, Name: this.ClassName, Explain: explain };
        if (this.Data && this.Data.Data)
        {
            if (IFrameSplitOperator.IsNumber(this.CursorIndex))
            {
                var index = this.CursorIndex;
                index = parseInt(index.toFixed(0));
                var dataIndex = this.Data.DataOffset + index;
            }
            else
            {
                dataIndex=this.Data.Data.length-1;
            }
            
            var dataCount=this.Data.Data.length;
            data.DataIndex=dataIndex;
            data.DataCount=dataCount;
        }
        this.OnDrawEvent.Callback(this.OnDrawEvent, data, this);
    }

    this.Draw = function () 
    {
        this.UpperSymbol = this.Symbol ? this.Symbol.toUpperCase() : '';
        this.SendUpdateUIMessage('Draw');

        if (!this.IsShow) return;
        if (this.CursorIndex == null || !this.Data || this.Data.length <= 0) 
        {
            this.OnDrawEventCallback(null, 'DynamicKLineTitlePainting::Draw');
            return;
        }
        
        this.SpaceWidth = this.Canvas.measureText(' ').width;
        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;
        if (dataIndex < 0) 
        {
            this.OnDrawEventCallback(null, 'DynamicKLineTitlePainting::Draw');
            return;
        }

        var item = this.Data.Data[dataIndex];
        this.OnDrawEventCallback(item, 'DynamicKLineTitlePainting::Draw');

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            if (this.LineCount > 1) this.DrawMulitLine(item);
            else this.DrawSingleLine(item);
            this.Canvas.restore();
            if (!item.Time && item.Date && this.InfoData) this.HSCreenKLineInfoDraw(item.Date);
        }
        else 
        {
            if (this.LineCount > 1) this.DrawMulitLine(item);
            else this.DrawSingleLine(item);

            if (!item.Time && item.Date && this.InfoData) this.KLineInfoDraw(item.Date);
        }
    }


    this.KLineInfoDraw = function (date) {
        var info = this.InfoData.get(date.toString());
        if (!info) return;
        var invesotrCount = 0;    //互动易统计
        var researchCouunt = 0;
        var reportCount = 0;
        var blockTradeCount = 0;  //大宗交易次数
        var tradeDetailCount = 0; //龙虎榜上榜次数
        var policyData = null;
        var reportTitle = null, pforecastTitle = null;
        //console.log(info);
        for (var i in info.Data) {
            var item = info.Data[i];
            switch (item.InfoType) {
                case KLINE_INFO_TYPE.INVESTOR:
                    ++invesotrCount;
                    break;
                case KLINE_INFO_TYPE.PFORECAST:
                    pforecastTitle = item.Title;
                    break;
                case KLINE_INFO_TYPE.ANNOUNCEMENT:
                    ++reportCount;
                    break;
                case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_1:
                case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_2:
                case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_3:
                case KLINE_INFO_TYPE.ANNOUNCEMENT_QUARTER_4:
                    reportTitle = item.Title;
                    break;
                case KLINE_INFO_TYPE.RESEARCH:
                    ++researchCouunt;
                    break;
                case KLINE_INFO_TYPE.BLOCKTRADING:
                    ++blockTradeCount;
                    break;
                case KLINE_INFO_TYPE.TRADEDETAIL:
                    ++tradeDetailCount;
                    break;
                case KLINE_INFO_TYPE.POLICY:
                    policyData = item;
                    break;
            }
        }

        var isHScreen = (this.Frame.IsHScreen === true);
        var right = this.Frame.ChartBorder.GetRight() - 4;
        var top = this.Frame.ChartBorder.GetTopEx();
        if (isHScreen) {
            right = this.Frame.ChartBorder.GetBottom() - 4;
            top = this.Frame.ChartBorder.GetRightEx();
            this.Canvas.translate(top, right);
            this.Canvas.rotate(90 * Math.PI / 180);
            right = 0; top = 0;
        }

        this.Canvas.font = this.Font;

        var aryTitle = [];
        var position = { Top: top, Right: right, IsHScreen: isHScreen };

        aryTitle.push(IFrameSplitOperator.FormatDateString(date));
        if (reportTitle) aryTitle.push(reportTitle);        //季报
        if (pforecastTitle) aryTitle.push(pforecastTitle);  //业绩预告  
        if (reportCount > 0) aryTitle.push('公告数量:' + reportCount);
        if (researchCouunt > 0) aryTitle.push('机构调研次数:' + researchCouunt);
        if (tradeDetailCount > 0) aryTitle.push('龙虎榜上榜次数:' + tradeDetailCount);
        if (invesotrCount > 0) aryTitle.push('互动易数量:' + invesotrCount);
        if (blockTradeCount > 0) aryTitle.push('大宗交易次数:' + blockTradeCount);
        if (policyData) //策略选股
        {
            for (let i in policyData.ExtendData)    //显示满足的策略
            {
                aryTitle.push(policyData.ExtendData[i].Name);
            }
        }

        var maxWidth = 0, textBGHeight = 0;
        for (let i in aryTitle) {
            var item = aryTitle[i];
            var textWidth = this.Canvas.measureText(item).width + 2;    //后空2个像素
            if (maxWidth < textWidth) maxWidth = textWidth;
            textBGHeight += this.InfoTextHeight;
        }

        this.Canvas.fillStyle = this.InfoTextBGColor;
        if (isHScreen) this.Canvas.fillRect(position.Right - maxWidth, position.Top, maxWidth + 2, textBGHeight + 2);
        else this.Canvas.fillRect(position.Right - maxWidth, position.Top, maxWidth + 2, textBGHeight + 2);

        for (let i in aryTitle) {
            var item = aryTitle[i];
            this.DrawInfoText(item, position);
        }
    }

    this.HSCreenKLineInfoDraw = function (date) {
        this.Canvas.save();
        this.KLineInfoDraw(date);
        this.Canvas.restore();
    }

    this.GetColor = function (price, yclse) {
        if (price > yclse) return this.UpColor;
        else if (price < yclse) return this.DownColor;
        else return this.UnchagneColor;
    }

    this.DrawInfoText = function (title, position) {
        if (!title) return true;

        this.Canvas.textAlign = "right";
        this.Canvas.textBaseline = "top";
        this.Canvas.fillStyle = this.InfoTextColor;
        this.Canvas.fillText(title, position.Right, position.Top);
        position.Top += this.InfoTextHeight;
        return true;
    }

    this.DrawKLineText = function (title, color, position, isShow) 
    {
        if (!title) return true;

        var isHScreen = this.Frame.IsHScreen === true;
        var right = this.Frame.ChartBorder.GetRight();
        if (isHScreen) right = this.Frame.ChartBorder.GetHeight();

        this.Canvas.fillStyle = color;
        var textWidth = this.Canvas.measureText(title).width;
        if (position.Left + textWidth > right) return false;
        if (!(isShow === false)) this.Canvas.fillText(title, position.Left, position.Bottom, textWidth);

        position.Left += textWidth + this.SpaceWidth;
        return true;
    }

}

//分时图标题
function DynamicMinuteTitlePainting() 
{
    this.newMethod = DynamicKLineTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.YClose;
    this.IsShowDate = false;  //标题是否显示日期
    this.IsShowName = true;   //标题是否显示股票名字
    this.Symbol;
    this.UpperSymbol;
    this.LastShowData;  //保存最后显示的数据 给tooltip用
    this.ClassName ='DynamicMinuteTitlePainting';
    this.SpaceWidth = 2;
    this.IsShowAveragePrice=true;   //是否显示均线价格

    this.GetCurrentKLineData = function () //获取当天鼠标位置所在的K线数据
    {
        if (this.LastShowData) return this.LastShowData;
        if (this.CursorIndex == null || !this.Data) return null;
        if (this.Data.length <= 0) return null;

        var index = Math.abs(this.CursorIndex);
        index = parseInt(index.toFixed(0));
        var dataIndex = this.Data.DataOffset + index;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;
        if (dataIndex < 0) return null;

        var item = this.Data.Data[dataIndex];
        return item;
    }

    this.SendUpdateUIMessage = function (funcName) //通知外面 标题变了
    {
        if (!this.UpdateUICallback) return;

        var sendData =
        {
            TitleName: '分钟标题', CallFunction: funcName, Stock: { Name: this.Name, Symbol: this.Symbol, },
            Rect:
            {
                Left: this.Frame.ChartBorder.GetLeft(), Right: this.Frame.ChartBorder.GetRight(),
                Top: 0, Bottom: this.Frame.ChartBorder.GetTop(),
            }
        };

        //有数据
        if (this.Data && this.Data.Data && this.Data.Data.length > 0) {
            let index = this.Data.Data.length - 1;    //默认最后1分钟的数据
            if (this.CursorIndex) {
                let cursorIndex = Math.abs(this.CursorIndex - 0.5);
                cursorIndex = parseInt(cursorIndex.toFixed(0));
                index = this.Data.DataOffset + cursorIndex;
                if (index >= this.Data.Data.length) index = this.Data.Data.length - 1;
            }

            if (index >= 0) {
                let item = this.Data.Data[index];
                this.LastShowData = item;
                sendData.Stock.Data =
                    {
                        Time: item.Time, Close: item.Close, AvPrice: item.AvPrice,
                        Vol: item.Vol, Amount: item.Amount
                    }
                if (item.Time) sendData.Stock.Time = item.Time;  //分钟K线才有时间
            }
        }
        this.UpdateUICallback(sendData);
    }

    this.DrawTitle = function () 
    {
        this.UpperSymbol = this.Symbol ? this.Symbol.toUpperCase() : '';
        this.SendUpdateUIMessage('DrawTitle');
        this.OnDrawEventCallback(null, "DynamicMinuteTitlePainting::DrawTitle");
    }

    this.GetDecimal = function (symbol) 
    {
        return JSCommonCoordinateData.GetfloatPrecision(symbol);//价格小数位数
    }

    this.DrawMulitLine = function (item) //画多行
    {
        var leftSpace = 5;
        var bottomSpace = 2;
        var left = this.Frame.ChartBorder.GetLeft() + leftSpace;;
        var right = this.Frame.ChartBorder.GetRight();
        var width = this.Frame.ChartBorder.GetWidth();
        var height = this.Frame.ChartBorder.GetTop();

        var defaultfloatPrecision = this.GetDecimal(this.Symbol);    //价格小数位数
        var itemHeight = (height - bottomSpace) / this.LineCount;
        var bottom = itemHeight;

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;
        this.Canvas.fillStyle = this.UnchagneColor;

        this.Canvas.fillStyle = this.UnchagneColor;
        var text = IFrameSplitOperator.FormatDateTimeString(item.DateTime, this.IsShowDate ? 'YYYY-MM-DD' : 'HH-MM');
        var timeWidth = this.Canvas.measureText(text).width + 5;    //后空5个像素
        this.Canvas.fillText(text, left, bottom, timeWidth);

        if (this.IsShowDate) {
            var text = IFrameSplitOperator.FormatDateTimeString(item.DateTime, 'HH-MM');
            this.Canvas.fillText(text, left, bottom + itemHeight, timeWidth);
        }

        var itemWidth = (width - leftSpace - timeWidth) / 2;
        left += timeWidth;

        if (item.Close != null) {
            this.Canvas.fillStyle = this.GetColor(item.Close, this.YClose);
            var text = g_JSChartLocalization.GetText('Tooltip-Price', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
            this.Canvas.fillText(text, left, bottom, itemWidth);
            left += itemWidth;
        }

        if (item.Increase != null) {
            this.Canvas.fillStyle = this.GetColor(item.Increase, 0);
            var text = g_JSChartLocalization.GetText('Tooltip-Increase', this.LanguageID) + item.Increase.toFixed(2) + '%';
            this.Canvas.fillText(text, left, bottom, itemWidth);
            left += itemWidth;
        }

        bottom += itemHeight;   //换行
        var left = this.Frame.ChartBorder.GetLeft() + leftSpace + timeWidth;

        this.Canvas.fillStyle = this.VolColor;
        var text = g_JSChartLocalization.GetText('Tooltip-Vol', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Vol, 2, this.LanguageID);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;

        this.Canvas.fillStyle = this.AmountColor;
        var text = g_JSChartLocalization.GetText('Tooltip-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
        this.Canvas.fillText(text, left, bottom, itemWidth);
        left += itemWidth;
    }

    this.DrawItem = function (item) 
    {
        var isHScreen = this.Frame.IsHScreen === true;
        var left = this.Frame.ChartBorder.GetLeft();;
        var bottom = this.Frame.ChartBorder.GetTop() - this.Frame.ChartBorder.Top / 2;
        var right = this.Frame.ChartBorder.GetRight();
        var defaultfloatPrecision = this.GetDecimal(this.Symbol);    //价格小数位数

        if (isHScreen) 
        {
            if (this.Frame.ChartBorder.Right < 5) return;
            var left = 2;
            var bottom = this.Frame.ChartBorder.Right / 2;    //上下居中显示
            var right = this.Frame.ChartBorder.GetHeight();
            var xText = this.Frame.ChartBorder.GetChartWidth();
            var yText = this.Frame.ChartBorder.GetTop();
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
        }
        else 
        {
            if (bottom < 5) return;
        }

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "middle";
        this.Canvas.font = this.Font;
        var position = { Left: left, Bottom: bottom, IsHScreen: isHScreen };

        if (this.IsShowName) 
        {
            if (!this.DrawMinuteText(this.Name, this.NameColor, position, true)) return;
        }

        this.Canvas.fillStyle = this.UnchagneColor;
        var text = IFrameSplitOperator.FormatDateTimeString(item.DateTime, this.IsShowDate ? 'YYYY-MM-DD HH-MM' : 'HH-MM');
        if (!this.DrawMinuteText(text, this.DateTimeColor, position)) return;

        if (IFrameSplitOperator.IsNumber(item.Close)) 
        {
            var color = this.GetColor(item.Close, this.YClose);
            var text = g_JSChartLocalization.GetText('MTitle-Close', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
            if (!this.DrawMinuteText(text, color, position)) return;
        }

        if (IFrameSplitOperator.IsNumber(item.Increase)) 
        {
            var color = this.GetColor(item.Increase, 0);
            var text = g_JSChartLocalization.GetText('MTitle-Increase', this.LanguageID) + item.Increase.toFixed(2) + '%';
            if (!this.DrawMinuteText(text, color, position)) return;
        }

        if (IFrameSplitOperator.IsNumber(item.AvPrice) && this.IsShowAveragePrice==true)
        {
            var color = this.GetColor(item.AvPrice, this.YClose);
            var text = g_JSChartLocalization.GetText('MTitle-AvPrice', this.LanguageID) + item.AvPrice.toFixed(defaultfloatPrecision);
            if (!this.DrawMinuteText(text, color, position)) return;
        }

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Vol', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Vol, 2, this.LanguageID);
            if (!this.DrawMinuteText(text, this.VolColor, position)) return;
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
            if (!this.DrawMinuteText(text, this.AmountColor, position)) return;
        }

        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.UpperSymbol) && IFrameSplitOperator.IsNumber(item.Position))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Position', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            if (!this.DrawMinuteText(text, this.VolColor, position)) return;
        }
        
    }

    this.FullDraw=function()
    {
        this.Draw();
    }

    this.Draw = function () 
    {
        this.UpperSymbol = this.Symbol ? this.Symbol.toUpperCase() : '';
        this.LastShowData = null;
        this.SendUpdateUIMessage('Draw');
        if (!this.IsShow) return;
        if (this.CursorIndex == null || !this.Data || !this.Data.Data || this.Data.Data.length <= 0) 
        {
            this.OnDrawEventCallback(null,"DynamicMinuteTitlePainting::Draw");
            return;
        }

        if (this.TextSpace>=0) 
		{
			this.SpaceWidth=this.TextSpace;
		}
        else  
		{
			this.Canvas.font = this.Font;
			this.SpaceWidth = this.Canvas.measureText(' ').width;
		}
        
        var index = this.CursorIndex;
        index = parseInt(index.toFixed(0));
        var dataIndex = index + this.Data.DataOffset;
        if (dataIndex >= this.Data.Data.length) dataIndex = this.Data.Data.length - 1;

        var item = this.Data.Data[dataIndex];
        this.LastShowData = item;
        this.OnDrawEventCallback(item, "DynamicMinuteTitlePainting::Draw");

        if (this.LineCount > 1 && !(this.Frame.IsHScreen === true)) 
        {
            this.DrawMulitLine(item);
            return;
        }

        this.Canvas.save();
        this.DrawItem(item);
        this.Canvas.restore();
    }

    this.DrawMinuteText = function (title, color, position, isShow) 
    {
        if (!title) return true;

        var isHScreen = this.Frame.IsHScreen === true;
        var right = this.Frame.ChartBorder.GetRight();
        if (isHScreen) right = this.Frame.ChartBorder.GetHeight();

        this.Canvas.fillStyle = color;
        var textWidth = this.Canvas.measureText(title).width;
        if (position.Left + textWidth > right) return false;
        if (!(isShow === false)) this.Canvas.fillText(title, position.Left, position.Bottom, textWidth);

        position.Left += textWidth + this.SpaceWidth;
        return true;
    }
}

//字符串输出格式
var STRING_FORMAT_TYPE =
{
    DEFAULT: 1,     //默认 2位小数 单位自动转化 (万 亿)
    ORIGINAL: 2,     //原始数据
    THOUSANDS: 21,   //千分位分割
};

function DynamicTitleData(data, name, color)    //指标标题数据
{
    this.Data = data;
    this.Name = name;
    this.Color = color;   //字体颜色
    this.DataType;         //数据类型
    this.ChartClassName;
    this.StringFormat = STRING_FORMAT_TYPE.DEFAULT;   //字符串格式
    this.FloatPrecision = 2;                          //小数位数
    this.GetTextCallback;                             //自定义数据转文本回调
    this.IsShow=true;
}

//指标标题
function DynamicChartTitlePainting() 
{
    this.newMethod = IChartTitlePainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.IsDynamic = true;
    this.Data = new Array();
    this.Explain;
    this.TitleBG;             //标题背景色
    this.TitleBGHeight = 20;  //标题背景色高度
    this.TitleAlign = 'middle';//对其方式
    this.TitleBottomDistance = 1; //标题靠底部输出的时候 字体和底部的间距
    this.Text = new Array();  //副标题 Text:'文本', Color:'颜色'
    this.EraseRect;
    this.EraseColor = g_JSChartResource.BGColor;  //用来擦出的背景色

    this.TitleRect;              //指标名字显示区域
    this.IsDrawTitleBG=false;    //是否绘制指标名字背景色
    this.BGColor=g_JSChartResource.IndexTitleBGColor;   //指标名字背景颜色
    this.TitleColor = g_JSChartResource.IndexTitleColor;   //指标名字颜色

    this.IsShowIndexName = true;     //是否显示指标名字
    this.ParamSpace = 2;             //参数显示的间距
    this.TitleSpace=2;              //指标名字和参数之间的间距
    this.OutName=null;               //动态标题
    this.IsFullDraw=true;            //手势离开屏幕以后是否显示最后的价格

    this.SetDynamicOutName=function(outName, args)
    {
        if (!this.OutName) this.OutName=new Map();
        else this.OutName.clear();

        var mapArgs=new Map();
        for(var i in args)
        {
            var item=args[i];
            mapArgs.set(`{${item.Name}}`, item);
        }

        for(var i in outName)
        {
            var item=outName[i];
            var aryFond = item.DynamicName.match(/{\w*}/i);
            if (!aryFond || aryFond.length<=0) 
            {
                this.OutName.set(item.Name, item.DynamicName);
            }
            else
            {
                var dyName=item.DynamicName;
                var bFind=true;
                for(var j=0;j<aryFond.length;++j)
                {
                    var findItem=aryFond[j];
                    if (mapArgs.has(findItem))
                    {
                        var value=mapArgs.get(findItem).Value;
                        dyName=dyName.replace(findItem,value.toString());
                    }
                    else
                    {
                        bFind=false;
                        break;
                    }
                }

                if (bFind) this.OutName.set(item.Name, dyName);
            }
        }
    }

    this.GetDynamicOutName=function(outName)
    {
        if (!this.OutName || this.OutName.size<=0) return null;
        if (!this.OutName.has(outName)) return null;

        return this.OutName.get(outName);
    }

    this.IsClickTitle=function(x,y) //是否点击了指标标题
    {
        if (!this.TitleRect) return false;

        if (x>this.TitleRect.Left && x<this.TitleRect.Left+this.TitleRect.Width && y>this.TitleRect.Top && y<this.TitleRect.Top+this.TitleRect.Height)
        {
            return true;
        }

        return false;
    }

    this.FormatValue = function (value, item) 
    {
        if (item.StringFormat == STRING_FORMAT_TYPE.DEFAULT)
            return IFrameSplitOperator.FormatValueString(value, item.FloatPrecision, this.LanguageID);
        else if (item.StringFormat = STRING_FORMAT_TYPE.THOUSANDS)
            return IFrameSplitOperator.FormatValueThousandsString(value, item.FloatPrecision);
        else if (item.StringFormat == STRING_FORMAT_TYPE.ORIGINAL)
            return value.toFixed(item.FloatPrecision).toString();
    }

    this.FormatMultiReport = function (data, format) 
    {
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

    //多变量输出
    this.FromatStackedBarTitle=function(aryBar, dataInfo)
    {
        if (!IFrameSplitOperator.IsNonEmptyArray(aryBar)) return null;
        if (!IFrameSplitOperator.IsNonEmptyArray(dataInfo.Color)) return null;

        var aryText=[];
        for(var i=0;i<aryBar.length;++i)
        {
            var value=aryBar[i];
            if (!IFrameSplitOperator.IsNumber(value)) continue;

            var item={ Text:value.toFixed(2) };
            if (dataInfo.Name && dataInfo.Name[i]) item.Name=dataInfo.Name[i];
            item.Color=dataInfo.Color[i];

            aryText.push(item);
        }

        if (aryText.length<=0) return null;

        return aryText;
    }

    this.SendUpdateUIMessage = function (funcName) //通知外面 标题变了
    {
        if (!this.UpdateUICallback) return;

        var sendData = {
            TitleName: '指标标题', CallFunction: funcName,
            TitleData: { Title: this.Title, Identify: this.Frame.Identify, Data: [] },
            Rect:   //标题的位置
            {
                Top: this.Frame.ChartBorder.GetTop(), Left: this.Frame.ChartBorder.GetLeft(),
                Right: this.Frame.ChartBorder.GetRight(), Bottom: this.Frame.ChartBorder.GetBottom()
            }
        };

        for (var i in this.Data) {
            var item = this.Data[i];
            if (!item || !item.Data || !item.Data.Data) continue;
            if (item.Data.Data.length <= 0) continue;

            var titleItem = { Name: item.Name, Color: item.Color };
            if (item.DataType) titleItem.DataType = item.DataType;

            if (item.DataType == "StraightLine")  //直线只有1个数据
            {
                titleItem.Value = item.Data.Data[0];
            }
            else {
                var index = item.Data.Data.length - 1;
                if (this.CursorIndex != null) {
                    var cursorIndex = Math.abs(this.CursorIndex - 0.5);
                    cursorIndex = parseInt(cursorIndex.toFixed(0));
                    index = item.Data.DataOffset + cursorIndex
                }
                if (index >= item.Data.Data.length) index = item.Data.Data.length - 1;

                titleItem.Value = item.Data.Data[index];
            }

            sendData.TitleData.Data.push(titleItem);
        }

        //console.log('[DynamicChartTitlePainting::SendUpdateUIMessage', sendData);
        this.UpdateUICallback(sendData);
    }

    this.FullDraw=function()
    {
        this.EraseRect = null;
        this.TitleRect=null;
        if (this.Frame.IsMinSize) return;

        this.OnDrawTitleEvent();

        if (this.Frame.ChartBorder.TitleHeight < 5) return;
        if (this.Frame.IsShowTitle == false) return;
        this.IsDrawTitleBG=this.Frame.IsDrawTitleBG;
        this.IsShowIndexName = this.Frame.IsShowIndexName;
        this.ParamSpace = this.Frame.IndexParamSpace;
        this.TitleSpace=this.Frame.IndexTitleSpace;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.DrawItem(true,true);
            this.Canvas.restore();
            return;
        }

        this.DrawItem(true,true);
    }

    this.DrawTitle = function () 
    {
        this.IsDrawTitleBG=this.Frame.IsDrawTitleBG;
        this.EraseRect = null;
        this.TitleRect=null;
        this.SendUpdateUIMessage('DrawTitle');
        if (this.Frame.ChartBorder.TitleHeight < 5) return;
        if (this.Frame.IsShowTitle == false) return;

        this.IsShowIndexName = this.Frame.IsShowIndexName;
        this.ParamSpace = this.Frame.IndexParamSpace;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.DrawItem(true,false);
            this.Canvas.restore();
            return;
        }

        this.DrawItem(true,false);
    }

    this.EraseTitle = function () 
    {
        if (!this.EraseRect) return;
        this.Canvas.fillStyle = this.EraseColor;
        this.Canvas.fillRect(this.EraseRect.Left, this.EraseRect.Top, this.EraseRect.Width, this.EraseRect.Height);
    }

    this.Draw = function () 
    {
        this.TitleRect=null;
        this.SendUpdateUIMessage('Draw');

        if (this.CursorIndex == null) return;
        if (!this.Data) return;
        if (this.Frame.ChartBorder.TitleHeight < 5) return;
        if (this.Frame.IsShowTitle == false) return;

        this.IsShowIndexName = this.Frame.IsShowIndexName;
        this.ParamSpace = this.Frame.IndexParamSpace;
        this.TitleSpace=this.Frame.IndexTitleSpace;

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            this.DrawItem(false,true);
            this.Canvas.restore();
            return;
        }

        this.DrawItem(false,true);
    }

    this.GetTitleItem=function(item, isShowLastData)
    {
        if (!item || !item.Data || !item.Data.Data) return null;
        if (item.Data.Data.length <= 0) return null;
        if (item.IsShow==false) return null;
    
        var valueText = null;
        var aryText=null;

        var value = null;
        if (item.DataType == "StraightLine")  //直线只有1个数据
        {
            value = item.Data.Data[0];
            valueText = this.FormatValue(value, item);
        }
        else 
        {
            var index = this.CursorIndex - 0.5;
            if (index<0) index=0;
            index = parseInt(index.toFixed(0));
            if (item.Data.DataOffset + index >= item.Data.Data.length) return null;

            value = item.Data.Data[item.Data.DataOffset + index];
            if (value == null) return null;

            if (item.DataType == "HistoryData-Vol") 
            {
                value = value.Vol;
                valueText = this.FormatValue(value, item);
            }
            else if (item.DataType == "MultiReport") 
            {
                valueText = this.FormatMultiReport(value, item);
            }
            else if (item.DataType=="ChartStackedBar")
            {
                aryText=this.FromatStackedBarTitle(value, item);
                if (!aryText) return null;
            }
            else 
            {
                if (item.GetTextCallback) valueText = item.GetTextCallback(value, item);
                else valueText = this.FormatValue(value, item);
            }
        }

        if (!valueText && !aryText) return null;
        
        return { Text:valueText, ArrayText:aryText };
    }

    this.DrawItem=function(bDrawTitle, bDrawValue)
    {
        var isHScreen=(this.Frame.IsHScreen === true);
        var left = this.Frame.ChartBorder.GetLeft() + 1;
        var bottom = this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.TitleHeight / 2;    //上下居中显示
        if (this.TitleAlign == 'bottom') bottom = this.Frame.ChartBorder.GetTopEx() - this.TitleBottomDistance;
        var right = this.Frame.ChartBorder.GetRight();
        var textWidth;

        if (isHScreen)
        {
            let xText = this.Frame.ChartBorder.GetRightTitle();
            let yText = this.Frame.ChartBorder.GetTop();
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
            left = 1;
            bottom = -(this.Frame.ChartBorder.TitleHeight / 2);    //上下居中显示
            if (this.TitleAlign == 'bottom') bottom = -this.TitleBottomDistance;
            right = this.Frame.ChartBorder.GetHeight();
        }

        this.EraseTitle();

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = this.TitleAlign;
        this.Canvas.font = this.Font;

        if (this.TitleBG && this.Title) //指标名称
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
            if (bDrawTitle)
            {
                this.Canvas.fillStyle = this.TitleBG;
                this.Canvas.fillRect(left, top, textWidth, height);
            }
        }

        if (this.Title && this.IsShowIndexName) //指标参数
        {
            const metrics = this.Canvas.measureText(this.Title);
            textWidth = metrics.width + 2;
            if (bDrawTitle)
            {
                if (this.IsDrawTitleBG) //绘制指标名背景色
                {
                    var spaceSize=1;
                    this.Canvas.fillStyle=this.BGColor;
                    if (isHScreen)
                    {
                        this.TitleRect= {Left:this.Frame.ChartBorder.GetRightTitle(),Top:this.Frame.ChartBorder.GetTop(),Width:this.Frame.ChartBorder.TitleHeight ,Height:textWidth};   //保存下标题的坐标
                        let drawRect={Left:left, Top:-this.Frame.ChartBorder.TitleHeight+spaceSize, Width:textWidth, Height:this.Frame.ChartBorder.TitleHeight-(spaceSize*2)};
                        this.Canvas.fillRect(drawRect.Left,drawRect.Top,drawRect.Width,drawRect.Height);
                    }
                    else
                    {
                        this.TitleRect={Left:left, Top:this.Frame.ChartBorder.GetTop()+spaceSize, Width:textWidth, Height:this.Frame.ChartBorder.TitleHeight-(spaceSize*2)};    //保存下标题的坐标
                        this.Canvas.fillRect(this.TitleRect.Left,this.TitleRect.Top,this.TitleRect.Width,this.TitleRect.Height);
                    }
                }
                this.Canvas.fillStyle = this.TitleColor;
                this.Canvas.fillText(this.Title, left, bottom, textWidth);
            }
            left += textWidth;
            left+=this.TitleSpace;
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

        if (bDrawValue)
        {
            for (var i in this.Data) 
            {
                var item = this.Data[i];
                var outText=this.GetTitleItem(item, false);
                if (!outText) continue;

                var valueText=outText.Text;
                var aryText=outText.ArrayText;

                if (aryText)
                {
                    var text;
                    for(var k=0;k<aryText.length;++k)
                    {
                        var titleItem=aryText[k];
                        if (titleItem.Name) text=titleItem.Name+":"+titleItem.Text;
                        else text=titleItem.Text;
    
                        var textWidth=this.Canvas.measureText(text).width+this.ParamSpace; 
                        if ((left+textWidth)>right) break;
    
                        this.Canvas.fillStyle=titleItem.Color;
                        this.Canvas.fillText(text,left,bottom,textWidth);
                        left+=textWidth;
                    }
                }
                else
                {
                    var text=valueText;
                    if (item.Name) 
                    {
                        var dyTitle=this.GetDynamicOutName(item.Name);
                        if (dyTitle) text=dyTitle+ ":" + valueText;
                        else text = item.Name + ":" + valueText;
                    }
                    
                    textWidth = this.Canvas.measureText(text).width + this.ParamSpace;    //后空2个像素
                    if (textWidth+left>right) break;    //画不下了就不画了
                    this.Canvas.fillStyle = item.Color;
                    this.Canvas.fillText(text, left, bottom, textWidth);
                    left += textWidth;
                }
               
            }
        }
        else
        {
            left += 4;
            var eraseRight = left, eraseLeft = left;
            for (var i in this.Data) 
            {
                var item = this.Data[i];
                if (!item || !item.Data || !item.Data.Data) continue;
                if (item.Data.Data.length <= 0) continue;
    
                var indexName = '●' + item.Name;
                this.Canvas.fillStyle = item.Color;
                textWidth = this.Canvas.measureText(indexName).width + this.ParamSpace;
                if (left + textWidth >= right) break;
                this.Canvas.fillText(indexName, left, bottom, textWidth);
                left += textWidth;
                eraseRight = left;
            }
    
            if (eraseRight > eraseLeft) 
            {
                if (isHScreen)
                {
                    this.EraseRect = 
                    { 
                        Left: eraseLeft, Right: eraseRight, Top: -(this.Frame.ChartBorder.TitleHeight - 1), 
                        Width: eraseRight - eraseLeft, Height: this.Frame.ChartBorder.TitleHeight - 2 
                    };
                }
                else
                {
                    this.EraseRect = 
                    { 
                        Left: eraseLeft, Right: eraseRight, Top: (this.Frame.ChartBorder.GetTop() + 1), 
                        Width: eraseRight - eraseLeft, Height: this.Frame.ChartBorder.TitleHeight - 2 
                    };
                }
            }
        }
    }

    this.OnDrawTitleEvent=function()
    {
        var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_INDEXTITLE_DRAW);
        if (!event) return;
        
        var data={ Index:null, Data:this.Data ,Title:this.Title, FrameID:this.Frame.Identify };
        if (IFrameSplitOperator.IsNumber(this.CursorIndex))
        {
            var index=Math.abs(this.CursorIndex);
            index=parseInt(index.toFixed(0));
            data.Index=index;   //当前屏数据索引
        }

        var border=this.Frame.GetBorder();
        data.Left=border.LeftEx;
        data.Top=border.Top;
        data.Right=border.RightEx;

        event.Callback(event,data,this);
    }
}



//导出统一使用JSCommon命名空间名
export
{
    IChartTitlePainting, 
    DynamicKLineTitlePainting,
    DynamicMinuteTitlePainting,
    DynamicChartTitlePainting,
    DynamicTitleData,
    STRING_FORMAT_TYPE,
};
/*
module.exports =
{
    JSCommonChartTitle:
    {
        IChartTitlePainting: IChartTitlePainting,
        DynamicKLineTitlePainting: DynamicKLineTitlePainting,
        DynamicMinuteTitlePainting: DynamicMinuteTitlePainting,
        DynamicChartTitlePainting: DynamicChartTitlePainting,
        DynamicTitleData: DynamicTitleData,
        STRING_FORMAT_TYPE: STRING_FORMAT_TYPE,
    },

    //单个类导出
    JSCommonChartTitle_IChartTitlePainting: IChartTitlePainting, 
    JSCommonChartTitle_DynamicKLineTitlePainting: DynamicKLineTitlePainting,
    JSCommonChartTitle_DynamicMinuteTitlePainting: DynamicMinuteTitlePainting,
    JSCommonChartTitle_DynamicChartTitlePainting: DynamicChartTitlePainting,
    JSCommonChartTitle_DynamicTitleData: DynamicTitleData,
    JSCommonChartTitle_STRING_FORMAT_TYPE: STRING_FORMAT_TYPE,
};
*/