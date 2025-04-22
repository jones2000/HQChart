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
    CloneData
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

function ToFixedPoint(value) 
{
    //return value;
    return parseInt(value) + 0.5;
}

function ToFixedRect(value) 
{
    var rounded;
    return rounded = (0.5 + value) << 0;
}

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
    this.ColumnCount=4;         //列， 多行才使用


    this.SpaceWidth = 1;        //空格宽度  
    this.TextSpace=-1;          //文字之间的间距

    this.DateTimeSpace=2;       //日期时间向后间距
    this.PeriodSpace=1;         //周期向后间距
    this.NameSpace=1;           //名字向后间距

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

    this.ShowPositionConfig={ Margin:{ Bottom:2 } };        //显示位置高级配置 { Type:1 左对齐, Margin:{ Left, Right, Bottom } }

    this.Symbol;
    this.UpperSymbol;
    this.Name;
    this.InfoData;
    this.InfoTextHeight = 15;
    this.InfoTextColor = g_JSChartResource.KLine.Info.TextColor;
    this.InfoTextBGColor = g_JSChartResource.KLine.Info.TextBGColor;

    this.IsShowName = true;           //是否显示股票名称
    this.IsShowSettingInfo = true;    //是否显示设置信息(周期 复权)
    this.IsShowDateTime=true;
    this.HQChart;

    this.GetVolUnit=function()
    {
        var upperSymbol;
        if (this.Symbol) upperSymbol=this.Symbol.toUpperCase();
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);

        return unit;
    }

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
        if (!MARKET_SUFFIX_NAME.IsEnableRight(periodID, this.Symbol, this.HQChart.RightFormula)) return null;

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

        var left=this.GetLeft(isHScreen);
        var right=this.GetRight(isHScreen);
        var width = right-left;

        var top=this.GetTop(isHScreen);
        var bottom=this.GetBottom(isHScreen);
        var height = bottom-top;

        var itemHeight = height / this.LineCount;
        var itemWidth = width / this.ColumnCount;
       
        if (isHScreen) 
        {
            var yText=left, xText=top+itemHeight;
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
            xText=0,yText=0;
        }
        else
        {
            var yText=itemHeight, xText=left;
        }

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var titleData=this.GetFormatMulitLineTitle({ Data:item });
        if (titleData && IFrameSplitOperator.IsNonEmptyArray(titleData.AryText))
        {
            var cellCount= this.LineCount *this.ColumnCount;    
           
            for(var i=0;i<titleData.AryText.length && i<cellCount;++i)
            {
                var item=titleData.AryText[i];
                if (i%this.ColumnCount==0 && i>0) //换行
                {
                    if (isHScreen)
                    {
                        xText=0;
                        yText -= itemHeight;
                    }
                    else
                    {
                        yText += itemHeight;  
                        xText=left;
                    }
                     
                }

                if (item.Text)
                {
                    this.Canvas.fillStyle = item.Color;
                    this.Canvas.fillText(item.Text, xText, yText, itemWidth);
                }

                xText += itemWidth;
            }
        }
    }

    this.FormatPrice=function(price, yClose, defaultfloatPrecision, TitleID)
    {
        var item={  Text:'--', Color:this.UnchagneColor };
        if (!IFrameSplitOperator.IsNumber(price)) return item;

        item.Color = this.GetColor(price, yClose);
        item.Text = `${g_JSChartLocalization.GetText(TitleID, this.LanguageID)}${price.toFixed(defaultfloatPrecision)}`;
        return item;
    }

    this.FormatVol=function(vol, TitleID)
    {
        var item={  Text:'--', Color:this.VolColor };
        if (!IFrameSplitOperator.IsNumber(vol)) return item;

        item.Text = `${g_JSChartLocalization.GetText(TitleID, this.LanguageID)}${IFrameSplitOperator.FormatValueString(vol, 2, this.LanguageID)}`;
        return item;
    }

    this.FormatAmount=function(value, TitleID)
    {
        var item={  Text:'--', Color:this.AmountColor };
        if (!IFrameSplitOperator.IsNumber(value)) return item;

        item.Text = `${g_JSChartLocalization.GetText(TitleID, this.LanguageID)}${IFrameSplitOperator.FormatValueString(value, 2, this.LanguageID)}`;
        return item;
    }

    this.FormatIncrease=function(price, yClose, TitleID)
    {
        var item={  Text:'--', Color:this.UnchagneColor };
        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose) || yClose===0) return item;

        var value=(price-yClose)/yClose;
        item.Color=this.GetColor(value,0);
        item.Text=`${g_JSChartLocalization.GetText(TitleID, this.LanguageID)}${(value*100).toFixed(2)}%`;
        return item;
    }

    this.ForamtTime=function(time, TitleID)
    {
        var item={  Text:null, Color:this.DateTimeColor };
        if (!IFrameSplitOperator.IsNumber(time)) return item;

        if (ChartData.IsMinutePeriod(this.Period, true))
            item.Text = IFrameSplitOperator.FormatTimeString(time,"HH:MM");
        else if (ChartData.IsSecondPeriod(this.Period) )
            item.Text = IFrameSplitOperator.FormatTimeString(time, "HH:MM:SS");
                
        return item;  
    }

    this.GetFormatMulitLineTitle=function(data)
    {
        if (!data || !data.Data) return null;
        var unit=this.GetVolUnit();
        var aryText=[];
        var item=data.Data;
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);//价格小数位数

        aryText.push({Text:IFrameSplitOperator.FormatDateString(item.Date), Color:this.DateTimeColor });    //日期
        aryText.push(this.FormatPrice(item.Close, item.YClose,defaultfloatPrecision, 'KTitle-Close'));      //收
        //aryText.push(this.FormatPrice(item.Open, item.YClose,defaultfloatPrecision, 'KTitle-Open'));      //开
        aryText.push(this.FormatPrice(item.High, item.YClose,defaultfloatPrecision, 'KTitle-High'));        //高
        aryText.push(this.FormatPrice(item.Low, item.YClose,defaultfloatPrecision, 'KTitle-Low'));          //低
        aryText.push(this.ForamtTime(item.Time));                                                           //时间 分钟K线才有
        aryText.push(this.FormatIncrease(item.Close, item.YClose, "KTitle-Increase"));                      //涨幅
        aryText.push(this.FormatVol(item.Vol/unit, "KTitle-Vol"));      //量
        aryText.push(this.FormatAmount(item.Amount,"KTitle-Amount"));   //额
        
        /*
        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.UpperSymbol) && IFrameSplitOperator.IsNumber(item.Position))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Position', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            aryText.push({Text:text, Color:this.PositionColor});
        }
        */

        return { AryText:aryText };
    }

    this.GetFormatTitle=function(data)
    {
        if (!data || !data.Data) return null;
        var unit=this.GetVolUnit();
        var aryText=[];
        var item=data.Data;
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);//价格小数位数

        if (this.IsShowName) //名称
            aryText.push({Text:this.Name, Color:this.NameColor, LeftSpace:this.NameSpace});

        if (this.IsShowSettingInfo) //周期 复权信息
        {
            var periodName = this.GetPeriodName(this.Data.Period);
            var rightName = this.GetRightName(this.Data.Right,this.Data.Period);
            var text = "(" + periodName + ")";
            if (rightName) text = "(" + periodName + " " + rightName + ")";
            aryText.push({Text:text, Color:this.SettingColor, LeftSpace:this.PeriodSpace});
        }

        if (this.IsShowDateTime)    //日期 时间
        {
            var text = IFrameSplitOperator.FormatDateString(item.Date); //日期
            if (ChartData.IsDayPeriod(this.Period, true))
            {
                aryText.push({Text:text, Color:this.DateTimeColor, LeftSpace:this.DateTimeSpace});
            }
            else if (ChartData.IsMinutePeriod(this.Period, true))
            {
                if (IFrameSplitOperator.IsNumber(item.Time))
                {
                    var timeText = IFrameSplitOperator.FormatTimeString(item.Time,"HH:MM");
                    text=`${text} ${timeText}`;
                }
                
                aryText.push({Text:text, Color:this.DateTimeColor, LeftSpace:this.DateTimeSpace});
            }
            else if (ChartData.IsSecondPeriod(this.Period) )
            {
                if (IFrameSplitOperator.IsNumber(item.Time))
                {
                    var timeText = IFrameSplitOperator.FormatTimeString(item.Time, "HH:MM:SS");
                    text=`${text} ${timeText}`;
                }
                
                aryText.push({Text:text, Color:this.DateTimeColor, LeftSpace:this.DateTimeSpace});
            }
        }

        //开
        if (IFrameSplitOperator.IsNumber(item.Open))
        {
            var color = this.GetColor(item.Open, item.YClose);
            var text = g_JSChartLocalization.GetText('KTitle-Open', this.LanguageID) + item.Open.toFixed(defaultfloatPrecision);
            aryText.push({Text:text, Color:color});
        }

        //高
        if (IFrameSplitOperator.IsNumber(item.High))
        {
            var color = this.GetColor(item.High, item.YClose);
            var text = g_JSChartLocalization.GetText('KTitle-High', this.LanguageID) + item.High.toFixed(defaultfloatPrecision);
            aryText.push({Text:text, Color:color});
        }

        //低
        if (IFrameSplitOperator.IsNumber(item.Low))
        {
            var color = this.GetColor(item.Low, item.YClose);
            var text = g_JSChartLocalization.GetText('KTitle-Low', this.LanguageID) + item.Low.toFixed(defaultfloatPrecision);
            aryText.push({Text:text, Color:color});
        }
       
        //收
        if (IFrameSplitOperator.IsNumber(item.Close))
        {
            var color = this.GetColor(item.Close, item.YClose);
            var text = g_JSChartLocalization.GetText('KTitle-Close', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
            aryText.push({Text:text, Color:color});
        }

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Vol', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Vol/unit, 2, this.LanguageID);
            aryText.push({Text:text, Color:this.VolColor});
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
            aryText.push({Text:text, Color:this.AmountColor});
        }

        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.UpperSymbol) && IFrameSplitOperator.IsNumber(item.Position))
        {
            var text = g_JSChartLocalization.GetText('KTitle-Position', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            aryText.push({Text:text, Color:this.PositionColor});
        }

        return { AryText:aryText };
    }

    this.GetLeft=function(isHScreen)
    {
        if (isHScreen)
        {
            var left=this.Frame.ChartBorder.GetTop();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Type===1) left=0;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Left)) left+=item.Margin.Left;
            }
            return left;
        }
        else
        {
            var left=this.Frame.ChartBorder.GetLeft();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Type===1) left=0;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Left)) left+=item.Margin.Left;
            }
            return left;
        }
    }

    this.GetRight=function(isHScreen)
    {
        if (isHScreen)
        {
            var right = this.Frame.ChartBorder.GetHeight();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Type===1) right=this.Frame.ChartBorder.GetChartHeight();
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Right)) right-=item.Margin.Right;
            }
    
            return right;
        }
        else
        {
            var right = this.Frame.ChartBorder.GetRight();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Type===1) right=this.Frame.ChartBorder.GetChartWidth();
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Right)) right-=item.Margin.Right;
            }
    
            return right;
        }
        
    }

    this.GetBottom=function(isHScreen)
    {
        if (isHScreen)
        {
            var bottom=this.Frame.ChartBorder.GetRight();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Bottom)) bottom+=item.Margin.Bottom;
            }
            return bottom;
        }
        else
        {
            var bottom = this.Frame.ChartBorder.GetTop();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Bottom)) bottom-=item.Margin.Bottom;
            }
            return bottom;
        }
    }

    this.GetTop=function(isHScreen)
    {
        if (isHScreen)
        {
            var top=this.Frame.ChartBorder.GetChartWidth();
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Top)) top-=item.Margin.Top;
            }
            return top;
        }
        else
        {
            var top = 0;
            if (this.ShowPositionConfig)
            {
                var item=this.ShowPositionConfig;
                if (item.Margin && IFrameSplitOperator.IsNumber(item.Margin.Top)) top+=item.Margin.Top;
            }
            return top;
        }
    }

    this.DrawSingleLine = function (item,bDrawTitle)  //画单行
    {
        var isHScreen = this.Frame.IsHScreen === true;
        var left=this.GetLeft(isHScreen);
        var right=this.GetRight(isHScreen);
        var bottom =this.GetBottom(isHScreen);
       
        if (isHScreen) 
        {
            if (this.Frame.ChartBorder.Right < 5) return;
            var xText = bottom;
            var yText = left;
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
            left = bottom=0;
        }
        else 
        {
            if (this.Frame.ChartBorder.Top<5) return;
        }

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;

        var position = { Left: left, MaxRight:right, Bottom: bottom, IsHScreen: isHScreen };
        var titleData=this.GetFormatTitle({ Data:item });

        if (titleData && IFrameSplitOperator.IsNonEmptyArray(titleData.AryText))
        {
            for(var i=0;i<titleData.AryText.length;++i)
            {
                var item=titleData.AryText[i];
                if (!this.DrawText(item.Text, item.Color, position, bDrawTitle==true)) break;
                if (IFrameSplitOperator.IsNumber(item.LeftSpace))  position.Left+=item.LeftSpace;
            }
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

    this.DrawText=function(title,color, position, isShow)
    {
        if (!title) return true;

        var isHScreen = this.Frame.IsHScreen === true;
        var right = this.Frame.ChartBorder.GetRight();
        if (isHScreen) right = this.Frame.ChartBorder.GetHeight();
        if (IFrameSplitOperator.IsNumber(position.MaxRight)) right=position.MaxRight;

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

    this.GetFormatMulitLineTitle=function(data)
    {
        if (!data || !data.Data) return null;
        var unit=this.GetVolUnit();
        var aryText=[];
        var item=data.Data;
        var defaultfloatPrecision = JSCommonCoordinateData.GetfloatPrecision(this.Symbol);//价格小数位数

        aryText.push({Text:IFrameSplitOperator.FormatDateString(item.Date), Color:this.DateTimeColor });    //日期
        aryText.push(this.FormatPrice(item.Close, item.YClose,defaultfloatPrecision, 'KTitle-Close'));      //收
        aryText.push(this.FormatPrice(item.High, item.YClose,defaultfloatPrecision, 'KTitle-High'));        //高
        aryText.push(this.FormatPrice(item.Low, item.YClose,defaultfloatPrecision, 'KTitle-Low'));          //低
       
        aryText.push({Text:IFrameSplitOperator.FormatDateTimeString(item.DateTime, 'HH-MM'), Color:this.DateTimeColor });    //时间
        aryText.push(this.FormatIncrease(item.Close, item.YClose, "KTitle-Increase"));                      //涨幅
        aryText.push(this.FormatVol(item.Vol/unit, "KTitle-Vol"));      //量
        aryText.push(this.FormatAmount(item.Amount,"KTitle-Amount"));   //额
        
        return { AryText:aryText };
    }

    this.GetFormatTitle=function(data)
    {
        if (!data || !data.Data) return null;

        var item=data.Data;
        var defaultfloatPrecision = this.GetDecimal(this.Symbol);    //价格小数位数
        var upperSymbol=this.Symbol.toUpperCase();
        var isFutures=MARKET_SUFFIX_NAME.IsFutures(upperSymbol);    //期货
        var unit=this.GetVolUnit();
        var aryText=[];
        var yClose=item.YClose;
        if (isFutures && IFrameSplitOperator.IsNumber(item.YClearing)) yClose=item.YClearing;
        if (this.IsShowName) aryText.push({ Text:this.Name, Color:this.NameColor });

        var text = IFrameSplitOperator.FormatDateTimeString(item.DateTime, this.IsShowDate ? 'YYYY-MM-DD HH-MM' : 'HH-MM');
        aryText.push({ Text:text, Color:this.DateTimeColor });

        if (IFrameSplitOperator.IsNumber(item.Close)) 
        {
            var color = this.GetColor(item.Close, yClose);
            var text = g_JSChartLocalization.GetText('MTitle-Close', this.LanguageID) + item.Close.toFixed(defaultfloatPrecision);
            aryText.push({ Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Increase)) 
        {
            var color = this.GetColor(item.Increase, 0);
            var text = g_JSChartLocalization.GetText('MTitle-Increase', this.LanguageID) + item.Increase.toFixed(2) + '%';
            aryText.push({ Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.AvPrice) && this.IsShowAveragePrice==true)
        {
            var color = this.GetColor(item.AvPrice, yClose);
            var text = g_JSChartLocalization.GetText('MTitle-AvPrice', this.LanguageID) + item.AvPrice.toFixed(defaultfloatPrecision);
            aryText.push({ Text:text, Color:color });
        }

        if (IFrameSplitOperator.IsNumber(item.Vol))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Vol', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Vol/unit, 2, this.LanguageID);
            aryText.push({ Text:text, Color:this.VolColor });
        }

        if (IFrameSplitOperator.IsNumber(item.Amount))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Amount', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Amount, 2, this.LanguageID);
            aryText.push({ Text:text, Color:this.AmountColor });
        }

        if (MARKET_SUFFIX_NAME.IsChinaFutures(this.UpperSymbol) && IFrameSplitOperator.IsNumber(item.Position))
        {
            var text = g_JSChartLocalization.GetText('MTitle-Position', this.LanguageID) + IFrameSplitOperator.FormatValueString(item.Position, 2, this.LanguageID);
            aryText.push({ Text:text, Color:this.VolColor });
        }

        return { AryText:aryText };
    }

    this.DrawItem = function (item) 
    {
        var isHScreen = this.Frame.IsHScreen === true;
        var left=this.GetLeft(isHScreen);
        var right=this.GetRight(isHScreen);
        var bottom =this.GetBottom(isHScreen);

        if (isHScreen) 
        {
            if (this.Frame.ChartBorder.Right < 5) return;
            var xText = bottom;
            var yText = left;
            this.Canvas.translate(xText, yText);
            this.Canvas.rotate(90 * Math.PI / 180);
            left=bottom=0;
        }
        else 
        {
            if (this.Frame.ChartBorder.Top<5) return;
        }

        this.Canvas.textAlign = "left";
        this.Canvas.textBaseline = "bottom";
        this.Canvas.font = this.Font;
        var position = { Left: left, MaxRight:right, Bottom: bottom, IsHScreen: isHScreen };
        var titleData=this.GetFormatTitle({ Data:item });

        if (titleData && IFrameSplitOperator.IsNonEmptyArray(titleData.AryText))
        {
            for(var i=0;i<titleData.AryText.length;++i)
            {
                var item=titleData.AryText[i];
                if (!this.DrawText(item.Text, item.Color, position, true)) break;
                if (IFrameSplitOperator.IsNumber(item.LeftSpace))  position.Left+=item.LeftSpace;
            }
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

        if (this.Frame.IsHScreen === true) 
        {
            this.Canvas.save();
            if (this.LineCount > 1) this.DrawMulitLine(item);
            else this.DrawSingleLine(item, true);
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
    this.BGBorderColor=g_JSChartResource.IndexTitleBorderColor;
    this.TitleButtonConfig=
    { 
        Mergin:
        { 
            Left:g_JSChartResource.IndexTitleButton.Mergin.Left, Top:g_JSChartResource.IndexTitleButton.Mergin.Top, 
            Bottom:g_JSChartResource.IndexTitleButton.Mergin.Bottom, Right:g_JSChartResource.IndexTitleButton.Mergin.Right
        }, 
        Font:g_JSChartResource.IndexTitleButton.Font,
        RightSpace:g_JSChartResource.IndexTitleButton.RightSpace
    };

    this.TitleColor = g_JSChartResource.IndexTitleColor;   //指标名字颜色
    this.ArgumentsText;         //参数信息

    this.IsShowIndexName = true;     //是否显示指标名字
    this.IsShowNameArrow=false;
    this.NameArrowConfig=CloneData(g_JSChartResource.IndexTitle.NameArrow);
    this.ParamSpace = 2;             //参数显示的间距
    this.TitleSpace=2;              //指标名字和参数之间的间距
    this.OutName=null;               //动态标题
    this.IsFullDraw=true;            //手势离开屏幕以后是否显示最后的价格

    this.IsShowUpDownArrow=true;   //指标数据是否显示 上涨下跌箭头
    this.TitleArrowType=0;         //指标数据上涨下跌箭头类型 0=独立颜色 1=跟指标颜色一致

    this.OverlayIndex=new Map();        //叠加指标 key=Identify value={ Data:数据, Title:标题, Identify:标识}
    this.IsShowOverlayIndexName=true;
    this.OverlayIndexType={ LineSpace:1, BGColor:g_JSChartResource.OverlayIndexTitleBGColor };        //Position 0=主图指标后面显示 1=叠加指标单行显示

    this.DynamicTitle={ OutName:null, OutValue:null };
    this.OverlayDynamicTitle=new Map();  //key , value={ OutName, OutValue }

    this.IsShowMainIndexTitle=true; //是否显示主图指标标题

    this.UpDownArrowConfig=
    {
        UpColor:g_JSChartResource.IndexTitle.UpDownArrow.UpColor,
        DownColor:g_JSChartResource.IndexTitle.UpDownArrow.DownColor,
        UnchangeColor:g_JSChartResource.IndexTitle.UpDownArrow.UnchangeColor
    };

    this.ReloadResource=function()
    {
        this.BGColor=g_JSChartResource.IndexTitleBGColor;   //指标名字背景颜色
        this.BGBorderColor=g_JSChartResource.IndexTitleBorderColor;
        this.TitleColor = g_JSChartResource.IndexTitleColor;   //指标名字颜色
    }

    this.SetDynamicTitleData=function(outName, args, data)
    {
        if (!data.OutName) data.OutName=new Map();
        else data.OutName.clear();

        if (!data.OutValue) data.OutValue=new Map();
        else data.OutValue.clear();

        var mapArgs=new Map();
        for(var i in args)
        {
            var item=args[i];
            mapArgs.set(`{${item.Name}}`, item);
        }

        for(var i in outName)
        {
            var item=outName[i];
            if (item.DynamicName)
            {
                var aryFond = item.DynamicName.match(/{\w*}/i);
                if (!aryFond || aryFond.length<=0) 
                {
                    data.OutName.set(item.Name, item.DynamicName);
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
    
                    if (bFind) data.OutName.set(item.Name, dyName);
                }
    
            }

            if (item.DynamicValue)
            {
                data.OutValue.set(item.Name, item.DynamicValue);
            }
        }
    }

    this.SetDynamicTitle=function(outName, args, overlayID)
    {
        if (IFrameSplitOperator.IsString(overlayID))
        {
            var dynamicTitle=null;
            if (this.OverlayDynamicTitle.has(overlayID)) 
            {
                dynamicTitle=this.OverlayDynamicTitle.get(overlayID);
            }
            else
            {
                dynamicTitle={ OutName:null, OutValue:null };
                this.OverlayDynamicTitle.set(overlayID, dynamicTitle);
            }

            this.SetDynamicTitleData(outName, args, dynamicTitle); 
        }
        else
        {
            this.SetDynamicTitleData(outName, args, this.DynamicTitle);    
        }
    }

    this.GetDynamicOutName=function(key, overlayID)
    {
        if (IFrameSplitOperator.IsString(overlayID))
        {
            if (!this.OverlayDynamicTitle.has(overlayID)) return null;
            var dynamicTitle=this.OverlayDynamicTitle.get(overlayID);
            var outName=dynamicTitle.OutName;
        }
        else
        {
            var outName=this.DynamicTitle.OutName;
        }

        if (!outName || outName.size<=0) return null;
        if (!outName.has(key)) return null;

        return outName.get(key);
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
        if (!IFrameSplitOperator.IsNonEmptyArray(data)) return null;

        var text = "";
        for(var i=0; i<data.length; ++i)
        {
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
    this.FormatStackedBarTitle=function(aryBar, dataInfo)
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
        this.IsShowNameArrow=this.Frame.IsShowNameArrow;
        this.ParamSpace = this.Frame.IndexParamSpace;
        this.TitleSpace=this.Frame.IndexTitleSpace;
        this.IsShowUpDownArrow=this.Frame.IsShowTitleArrow;
        this.TitleArrowType=this.Frame.TitleArrowType;

        if (this.Frame.IsHScreen === true) 
        {
            var rtText={ };
            this.Canvas.save();
            this.DrawItem(true,true,rtText);
            this.DrawOverlayIndexSingleLine();
            this.Canvas.restore();

             /*
             //测试用
             if (this.TitleRect)
             {
                 this.Canvas.strokeStyle='rgba(200,0,50,1)';
                 this.Canvas.strokeRect(ToFixedPoint(this.TitleRect.Left),ToFixedPoint(this.TitleRect.Top),ToFixedRect(this.TitleRect.Width),ToFixedRect(this.TitleRect.Height));
             }
             */

            return;
        }

        var rtText={ };
        this.DrawItem(true,true,rtText);
        this.DrawOverlayIndexSingleLine(rtText);
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
        this.IsShowNameArrow=this.Frame.IsShowNameArrow;
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

    this.GetTitleItem=function(item, isShowLastData, titleIndex)
    {
        if (!item || !item.Data || !item.Data.Data) return null;
        if (item.Data.Data.length <= 0) return null;
        if (item.IsShow==false) return null;
    
        var valueText = null;
        var aryText=null;

        var value = null;
        var dataIndex=-1;

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
            var dataIndex=item.Data.DataOffset+index;
            if (dataIndex >= item.Data.Data.length) return null;
            if (dataIndex>=0 && item.Data && IFrameSplitOperator.IsNonEmptyArray(item.Data.Data)) value=item.Data.Data[dataIndex];
            
            if (this.GetEventCallback)
            {
                var event=this.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_INDEX_OUT_TEXT);
                if (event)
                {
                    var sendData=
                    { 
                        Item:item, Index:titleIndex, Data:this.Data, FrameID:this.Frame.Identify,
                        DataIndex:dataIndex, Value:value, PreventDefault:false, Out:null
                     };
                    event.Callback(event,sendData,this);
                    if (sendData.Out) return sendData.Out;
                    if (sendData.PreventDefault) return sendData.Out;
                }
            }

            if (item.DataType == "MultiReport") 
            {
                valueText = this.FormatMultiReport(value, item);
                if (!valueText) return;
            }
            else if (item.DataType=="ChartStackedBar")
            {
                aryText=this.FormatStackedBarTitle(value, item);
                if (!aryText) return null;
            }
            else 
            {
                if (value == null) return null;
                var arrowSuper=null;    //独立颜色
                if (this.IsShowUpDownArrow)
                {
                    var preValue=null;
                    if (dataIndex-1>=0) preValue=item.Data.Data[dataIndex-1];
                    if (IFrameSplitOperator.IsNumber(preValue))
                    {
                        if (preValue>value) arrowSuper={ Text:'↓', TextColor:this.UpDownArrowConfig.DownColor };
                        else if (preValue<value) arrowSuper={ Text:'↑', TextColor:this.UpDownArrowConfig.UpColor};
                        else arrowSuper={ Text:'→', TextColor:this.UpDownArrowConfig.UnchangeColor };

                        if (this.TitleArrowType==1) arrowSuper.TextColor=item.Color;
                    }
                }

                if (item.GetTextCallback) valueText = item.GetTextCallback(value, item);
                else valueText = this.FormatValue(value, item);

                if (arrowSuper)
                {
                    var outItem={ Name:null, Text:valueText, Color:item.Color, TextEx:[arrowSuper] };
                    if (item.Name) 
                    {
                        var text=item.Name;
                        var dyTitle=this.GetDynamicOutName(item.Name);  //动态标题
                        if (dyTitle) text=dyTitle;
                        outItem.Name=text;
                    }
                    //outItem.BG='rgb(100,100,100)';
                    aryText=[outItem];
                    valueText=null;
                }
            }
        }

        if (!valueText && !aryText) return null;
        
        return { Text:valueText, ArrayText:aryText };
    }

    this.DrawItem=function(bDrawTitle, bDrawValue, rtText)
    {
        var isHScreen=(this.Frame.IsHScreen === true);
        var left = this.Frame.ChartBorder.GetLeft() + 1;
        var bottom = this.Frame.ChartBorder.GetTop() + this.Frame.ChartBorder.TitleHeight / 2;    //上下居中显示
        if (this.TitleAlign == 'bottom') bottom = this.Frame.ChartBorder.GetTopEx() - this.TitleBottomDistance;
        var right = this.Frame.ChartBorder.GetRight();
        var lineHeight=this.Canvas.measureText("擎").width+2;
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

        if (this.TitleBG && this.Title && this.IsShowMainIndexTitle) //指标名称
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

        if (this.Title && this.IsShowIndexName && this.IsShowMainIndexTitle) //指标参数
        {
            const metrics = this.Canvas.measureText(this.Title);
            textWidth = metrics.width + 2;
            if (bDrawTitle)
            {
                if (this.IsDrawTitleBG) //绘制指标名背景色
                {
                    if (this.TitleButtonConfig.Font)  this.Canvas.font=this.TitleButtonConfig.Font;
                    var title=this.Title;
                    var textWidth=this.Canvas.measureText(title).width;
                    var titleWidth=textWidth+this.TitleButtonConfig.Mergin.Left+this.TitleButtonConfig.Mergin.Right;
                    var arrowWidth=0;
                    if (this.IsShowNameArrow && this.NameArrowConfig)
                    {
                        arrowWidth=this.Canvas.measureText(this.NameArrowConfig.Symbol).width;
                        titleWidth+=arrowWidth;
                        if (IFrameSplitOperator.IsNumber(this.NameArrowConfig.Space)) titleWidth+=this.NameArrowConfig.Space;
                    }
                   
                    var textHeight=this.Canvas.measureText("擎").width;
                    var bgHeight=textHeight+this.TitleButtonConfig.Mergin.Top+this.TitleButtonConfig.Mergin.Bottom;
                    var bgWidth=titleWidth;

                    this.Canvas.fillStyle=this.BGColor;
                    if (isHScreen)
                    {
                        this.TitleRect= 
                        {
                            Top:this.Frame.ChartBorder.GetTop(),
                            Left:this.Frame.ChartBorder.GetRightTitle()+this.Frame.ChartBorder.TitleHeight/2-bgHeight/2,
                            Width:bgHeight ,Height:bgWidth
                        };   //保存下标题的坐标
                        let drawRect={Left:left, Top:-bgHeight-2, Width:bgWidth, Height:bgHeight};
                        this.Canvas.fillRect(drawRect.Left,drawRect.Top,drawRect.Width,drawRect.Height);

                        if (this.BGBorderColor)
                        {
                            this.Canvas.strokeStyle=this.BGBorderColor;
                            this.Canvas.strokeRect(ToFixedPoint(drawRect.Left),ToFixedPoint(drawRect.Top),ToFixedRect(drawRect.Width),ToFixedRect(drawRect.Height));
                        }
                    }
                    else
                    {
                        this.TitleRect={ Left:left, Top:bottom-textHeight/2-this.TitleButtonConfig.Mergin.Top, Width:bgWidth, Height:bgHeight };    //保存下标题的坐标
                        this.Canvas.fillRect(this.TitleRect.Left,this.TitleRect.Top,this.TitleRect.Width,this.TitleRect.Height);

                        if (this.BGBorderColor)
                        {
                            this.Canvas.strokeStyle=this.BGBorderColor;
                            this.Canvas.strokeRect(ToFixedPoint(this.TitleRect.Left),ToFixedPoint(this.TitleRect.Top),ToFixedRect(this.TitleRect.Width),ToFixedRect(this.TitleRect.Height));
                        }
                    }
                    var xText= left+this.TitleButtonConfig.Mergin.Left;
                    var yText=bottom-this.TitleButtonConfig.Mergin.Bottom;
                    this.Canvas.fillStyle = this.TitleColor;
                    this.Canvas.fillText(title, xText, yText, textWidth);
                    xText+=textWidth;
                    if (this.IsShowNameArrow && this.NameArrowConfig)
                    {
                        if (IFrameSplitOperator.IsNumber(this.NameArrowConfig.Space)) xText+=this.NameArrowConfig.Space;
                        this.Canvas.fillStyle=this.NameArrowConfig.Color;
                        this.Canvas.fillText(this.NameArrowConfig.Symbol,xText,yText,arrowWidth);
                    }

                    textWidth=bgWidth+this.TitleButtonConfig.RightSpace;
                    this.Canvas.font=this.Font;
                }
                else
                {
                    this.Canvas.fillStyle = this.TitleColor;
                    this.Canvas.fillText(this.Title, left, bottom, textWidth);
                }
            }
            left += textWidth;
            left+=this.TitleSpace;
        }

        //指标参数
        if (this.ArgumentsText && this.IsShowIndexName && this.IsShowMainIndexTitle)
        {
            var textWidth=this.Canvas.measureText(this.ArgumentsText).width+2;
            this.Canvas.fillStyle=this.TitleColor;
            this.Canvas.fillText(this.ArgumentsText, left, bottom, textWidth);

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
            for (var i=0; i<this.Data.length && this.IsShowMainIndexTitle; ++i) 
            {
                var item = this.Data[i];
                var outText=this.GetTitleItem(item, false, i);
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
    
                        var textWidth=this.Canvas.measureText(text).width 
                        if ((left+textWidth)>right) //换行
                        {
                            left=this.Frame.ChartBorder.GetLeft() + 3;
                            bottom+=lineHeight;
                        }
    
                        this.Canvas.fillStyle=titleItem.Color;
                        this.Canvas.fillText(text,left,bottom,textWidth);
                        left+=textWidth;

                        if (IFrameSplitOperator.IsNonEmptyArray(titleItem.TextEx))
                        {
                            for(var n=0; n<titleItem.TextEx.length; ++n)
                            {
                                var outItem=titleItem.TextEx[n];
                                this.Canvas.fillStyle=outItem.TextColor;
                                outItem.Width=this.Canvas.measureText(outItem.Text).width+2;
                                if ((left+outItem.Width)>right) break;

                                this.Canvas.fillText(outItem.Text,left,bottom,outItem.Width);
                                left+=outItem.Width;
                            }
                        }

                        left+=this.ParamSpace;
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
                    if (textWidth+left>right)   //换行
                    {
                        left=this.Frame.ChartBorder.GetLeft() + 3;
                        bottom+=lineHeight;
                    }

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

        if (rtText) 
        {
            if (this.TitleAlign=="middle")  rtText.Bottom=bottom+lineHeight/2+1;
            else rtText.Bottom=bottom+1;
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

    this.DrawOverlayIndexSingleLine=function(rtText)   //叠加指标1个指标一行
    {
        if (this.OverlayIndex.size<=0) return;

        var isHScreen=(this.Frame.IsHScreen === true);
        var border=this.Frame.GetBorder();

        var lineSpace=this.OverlayIndexType.LineSpace;
        this.Canvas.textAlign="left";
        this.Canvas.textBaseline="middle";
        this.Canvas.font=this.Font;
        var fontHeight=this.Canvas.measureText("擎").width;
        
        if (isHScreen)
        {
            var left = 1;
            var top = lineSpace;    //上下居中显示
            if (!this.IsShowMainIndexTitle) top-=this.Frame.ChartBorder.TitleHeight;
            var right = this.Frame.ChartBorder.GetHeight();
        }
        else
        {
            var top=border.TopTitle+2;
            if (rtText && IFrameSplitOperator.IsNumber(rtText.Bottom) && rtText.Bottom>top) top=rtText.Bottom;
            if (!this.IsShowMainIndexTitle) top=this.Frame.ChartBorder.GetTop()+2;
            var left=border.Left+1;
            var right=border.Right;
            var bottom=border.Bottom;
        }
      
        var x=left, y=top;
        y=top+fontHeight/2;
        for(var item of this.OverlayIndex)
        {
            var overlayItem=item[1];
            var overlayID=item[0];
            x=left;

            if (!overlayItem.IsShowIndexTitle) continue;

            if (overlayItem.Title && this.IsShowOverlayIndexName)
            {
                var textWidth=this.Canvas.measureText(overlayItem.Title).width+2;
                if ((x+textWidth)<right) 
                {
                    if (this.OverlayIndexType.BGColor)
                    {
                        this.Canvas.fillStyle=this.OverlayIndexType.BGColor;
                        var rtBG={Left:x, Top:y-fontHeight/2, Width:textWidth, Height: fontHeight+lineSpace };    //保存下标题的坐标
                        this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                    } 

                    this.Canvas.fillStyle=this.TitleColor;
                    this.Canvas.fillText(overlayItem.Title,x,y,textWidth);
                }
                x+=textWidth;
            }

            for(var i=0; i<overlayItem.Data.length; ++i)
            {
                var item=overlayItem.Data[i];
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
                        this.Canvas.fillText(text,x,y,textWidth);
                        x+=textWidth;
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

                    if (this.OverlayIndexType.BGColor)
                    {
                        this.Canvas.fillStyle=this.OverlayIndexType.BGColor;
                        var rtBG={Left:x, Top:y-fontHeight/2, Width:textWidth, Height: fontHeight+lineSpace };    //保存下标题的坐标
                        this.Canvas.fillRect(rtBG.Left,rtBG.Top,rtBG.Width,rtBG.Height);
                    } 

                    this.Canvas.fillStyle = item.Color;
                    this.Canvas.fillText(text, x, y, textWidth);
                    x += textWidth;
                }
            }

            y+=fontHeight+lineSpace;

        }
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