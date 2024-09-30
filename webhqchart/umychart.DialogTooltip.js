/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置K线提示信息
*/


function JSDialogTooltip()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.TitleBox=null; //{ DivTitle, DivName, DivName }

    this.HQChart=null;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

    this.TitleColor=g_JSChartResource.DialogTooltip.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogTooltip.TitleBGColor;
    this.BGColor=g_JSChartResource.DialogTooltip.BGColor;
    this.BorderColor=g_JSChartResource.DialogTooltip.BorderColor;

    this.VolColor=g_JSChartResource.DialogTooltip.VolColor;
    this.AmountColor=g_JSChartResource.DialogTooltip.AmountColor;
    this.TurnoverRateColor=g_JSChartResource.DialogTooltip.TurnoverRateColor;
    this.PositionColor=g_JSChartResource.DialogTooltip.PositionColor;
    this.DateTimeColor=g_JSChartResource.DialogTooltip.DateTimeColor;
    this.LanguageID=JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.MaxRowCount=18;

    this.AryData=[];
    this.AryText=[];

    this.KItemCache=null;
    this.KItemCacheID=null;

    this.Inital=function(hqchart)
    {
       this.HQChart=hqchart;
    }

    this.Destroy=function()
    {
        this.AryData=[];
        this.AryText=[];
        this.KItemCache=null;
        this.KItemCacheID=null;

        if (this.DivDialog) 
        {
            document.body.removeChild(this.DivDialog);
            this.DivDialog=null;
        }
    }

    this.OnClickColseButton=function(e)
    {
        this.Close(e);

        if (this.HQChart && this.HQChart.ChartCorssCursor)
        {
            var chart=this.HQChart.ChartCorssCursor;
            if (!chart.IsShowCorss) return;

            chart.IsShowCorss=false;
            this.HQChart.Draw();
            this.HQChart.SetFocus();
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_Tooltip_Dialog_Div';

        var divTitle=document.createElement("div");
        divTitle.className='UMyChart_Tooltip_Title_Div';
        divTitle.onmousedown=(e)=>{   this.OnMouseDownTitle(e);}

        var divName=document.createElement("div");
        divName.className='UMyChart_Tooltip_Name_Div';
        divName.innerText="----";
        divTitle.appendChild(divName);

        var divClose=document.createElement("div");
        divClose.className='UMyChart_Tooltip_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.OnClickColseButton(e); }
        divTitle.appendChild(divClose);

        divDom.appendChild(divTitle);

        var table=document.createElement("table");
        table.className="UMyChart_Tooltip_Table";
        divDom.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_Tooltip_Tbody";
        table.appendChild(tbody);

        this.AryData=[];
        for(var i=0;i<this.MaxRowCount;++i)
        {
            var rowItem={ Tr:null, TitleSpan:null, TextSpan:null };

            var trDom=document.createElement("tr");
            trDom.className='UMyChart_Tooltip_Group_Tr';
            tbody.appendChild(trDom);
            rowItem.Tr=trDom;

            var tdDom=document.createElement("td");
            tdDom.className="UMyChart_Tooltip_Title_Td";   //标题
            trDom.appendChild(tdDom);

            var spanDom=document.createElement("span");
            spanDom.className='UMyChart_Tooltip_Title_Span';
            spanDom.innerText='标题';
            tdDom.appendChild(spanDom);
            rowItem.TitleSpan=spanDom;

            var tdDom=document.createElement("td");
            tdDom.className="UMyChart_Tooltip_Text_Td";    //数值
            trDom.appendChild(tdDom);

            var spanDom=document.createElement("span");
            spanDom.className='UMyChart_Tooltip_Text_Span';
            spanDom.innerText='数值';
            tdDom.appendChild(spanDom);
            rowItem.TextSpan=spanDom;

            this.AryData.push(rowItem);
        }
        

        document.body.appendChild(divDom);

        this.DivName=divName;
        this.DivDialog=divDom;
        this.TitleBox={ DivTitle:divTitle, DivName:divName, DivColor:divClose };

        this.UpdateStyle();
    }

    this.Update=function(data)
    {
        if (!this.DivDialog ||  !this.TitleBox) return;
        if ((!data.KItem && !data.MinItem) || !data.IsShowCorss || data.ClientPos<0) return;

        this.LanguageID=this.HQChart.LanguageID;
        
        if (this.HQChart.ClassName=='KLineChartContainer')
        {
            var strKItem=JSON.stringify(data.KItem);
            if (this.KItemCacheID!=strKItem)    //数据变动的才更新
            {
                this.KItemCache= JSON.parse(strKItem);
                this.KItemCacheID=strKItem;
                this.UpdateTableDOM();
            }
            else
            {
                //JSConsole.Chart.Log(`[JSDialogTooltip::Update] save as KItemCache and  KItem`);
            }
        }
        else if (this.HQChart.ClassName=='MinuteChartContainer')
        {
            var strKItem=JSON.stringify(data.MinItem);
            if (this.KItemCacheID!=strKItem)    //数据变动的才更新
            {
                this.KItemCache= JSON.parse(strKItem);
                this.KItemCacheID=strKItem;
                this.UpdateTableDOM();
            }
        }
        else
        {
            return;
        }
        
        this.TitleBox.DivName.innerText=data.Name;

       
        if (!this.IsShow()) this.Show();
    }

    this.UpdateTableDOM=function()
    {
        if (!this.KItemCache) return;

        if (this.HQChart.ClassName=='KLineChartContainer')
            this.AryText=this.GetFormatKlineTooltipText(this.KItemCache);
        else if (this.HQChart.ClassName=='MinuteChartContainer')
            this.AryText=this.GetFormatMinuteTooltipText(this.KItemCache);
        else
            return;

        var index=0;
        for(index=0;index<this.AryText.length && index<this.MaxRowCount;++index)
        {
            var outItem=this.AryText[index];
            var item=this.AryData[index];

            item.TitleSpan.innerText=outItem.Title;
            item.TitleSpan.style.color=this.TitleColor;
            item.TextSpan.innerText=outItem.Text;
            item.TextSpan.style.color=outItem.Color;
            item.Tr.style.display="";
        }

        for( ; index<this.MaxRowCount; ++index)
        {
            var item=this.AryData[index];
            item.Tr.style.display="none";
        }
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';
    }

    this.OnMouseDownTitle=function(e)
    {
        if (!this.DivDialog) return;

        var dragData={ X:e.clientX, Y:e.clientY };
        dragData.YOffset=e.clientX - this.DivDialog.offsetLeft;
        dragData.XOffset=e.clientY - this.DivDialog.offsetTop;
        this.DragTitle=dragData;

        document.onmousemove=(e)=>{ this.DocOnMouseMoveTitle(e); }
        document.onmouseup=(e)=>{ this.DocOnMouseUpTitle(e); }
    }

    this.DocOnMouseMoveTitle=function(e)
    {
        if (!this.DragTitle) return;

        var left = e.clientX - this.DragTitle.YOffset;
        var top = e.clientY - this.DragTitle.XOffset;

        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+ this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=window.innerHeight) top=window.innerHeight-this.DivDialog.offsetHeight-5;

        this.DivDialog.style.left = left + 'px';
        this.DivDialog.style.top = top + 'px';

        if(e.preventDefault) e.preventDefault();
    }

    this.DocOnMouseUpTitle=function(e)
    {
        this.DragTitle=null;
        this.onmousemove = null;
        this.onmouseup = null;
    }

    this.Show=function()
    {
        if (!this.DivDialog) return;
        if (!this.HQChart) return;

        if (!this.DivDialog.style.top || !this.DivDialog.style.left)    //上一次显示的位置
        {
            var top=this.HQChart.Frame.ChartBorder.GetTop();
            var left=this.HQChart.Frame.ChartBorder.GetLeft();
            var rtClient=this.HQChart.UIElement.getBoundingClientRect();
    
            var x=left+rtClient.left+5;
            var y=top+rtClient.top+10;
            this.DivDialog.style.top = y + "px";
            this.DivDialog.style.left = x + "px";
        }

        this.DivDialog.style.visibility='visible';
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }


    this.GetFormatKlineTooltipText=function(data)
    {
        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var upperSymbol=this.HQChart.Symbol.toUpperCase();
        //日期
        var dateItem=this.ForamtDate(data.Date,"YYYY/MM/DD/W",'DialogTooltip-Date' );

        //时间
        var timeItem=null;
        if (IFrameSplitOperator.IsNumber(data.Time)) timeItem=this.FormatTime(data.Time, this.HQChart.Period, null, 'DialogTooltip-Time');
        
        var yClose=data.YClose; //昨收价|昨结算价
        var aryText=
        [
            this.ForamtPrice(data.Open,yClose, defaultfloatPrecision,'DialogTooltip-Open'),
            this.ForamtPrice(data.High,yClose, defaultfloatPrecision,'DialogTooltip-High'),
            this.ForamtPrice(data.Low,yClose, defaultfloatPrecision,'DialogTooltip-Low'),
            this.ForamtPrice(data.Close,yClose, defaultfloatPrecision,'DialogTooltip-Close'),
            this.FormatVol(data.Vol,'DialogTooltip-Vol' ),
            this.FormatAmount(data.Amount,'DialogTooltip-Amount' ),
            this.FormatIncrease(data.Close,yClose,'DialogTooltip-Increase'),
            this.FormatAmplitude(data.High,data.Low,yClose,'DialogTooltip-Amplitude'),
        ];

        if (timeItem) aryText.unshift(timeItem);
        aryText.unshift(dateItem);

        //换手率
        if (MARKET_SUFFIX_NAME.IsSHSZStockA(upperSymbol) && data.FlowCapital>0)
        {
            aryText.push(this.FormatExchange(data.Vol,data.FlowCapital,'DialogTooltip-Exchange' ));
        }

        //持仓量
        if (MARKET_SUFFIX_NAME.IsFutures(upperSymbol))
        {
            aryText.push(this.FormatPosition(data.Position,'DialogTooltip-Position'));
            aryText.push(this.ForamtYClose(data.YClose, defaultfloatPrecision, 'DialogTooltip-YClose'));
        }

        return aryText;
    },

    this.GetFormatMinuteTooltipText=function(data)
    {
        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);//价格小数位数

        if (data.Type==0) //连续交易
        {
            var item=data.Data;
            if (!item) item={ };

            var aryText=
            [
                this.ForamtDate(item.Date,"YYYY/MM/DD/W",'DialogTooltip-Date' ),
                this.FormatTime(item.Time, null, "HH:MM", 'DialogTooltip-Time'),
                this.ForamtPrice(item.Close,item.YClose, defaultfloatPrecision,'DialogTooltip-Price'),
                this.FormatRisefall(item.Close,item.YClose, defaultfloatPrecision,'DialogTooltip-Risefall'),
                this.FormatIncrease(item.Close,item.YClose,'DialogTooltip-Increase'),
                this.FormatVol(item.Vol,'DialogTooltip-Vol' ),
                this.FormatAmount(item.Amount,'DialogTooltip-Amount' ),
            ];

            return aryText;
        }
        else if (data.Type==1)  //集合竞价
        {
            var item=data.Data.Data;
            if (!item) item={ Vol:[] };

            var timeForamt="HH:MM:SS";
            if (item.Ver===1) timeForamt="HH:MM"
            var aryText=
            [
                this.ForamtDate(item.Date,"YYYY/MM/DD/W",'DialogTooltip-Date' ),
                this.FormatTime(item.Time, null, timeForamt, 'DialogTooltip-Time'),
                this.ForamtPrice(item.Price,item.YClose, defaultfloatPrecision,'DialogTooltip-AC-Price'),
                this.FormatIncrease(item.Price,item.YClose,'DialogTooltip-AC-Increase'),
                this.FormatVol(item.Vol[0],'DialogTooltip-AC-Vol' ),
            ];

            return aryText;
        }

        return [];
    }

    this.GetColor=function(price,yClose)
    {
        if(price>yClose) return this.UpColor;
        else if (price<yClose) return this.DownColor;
        else return this.UnchangeColor;
    }

    this.GetPriceColor=function(price, yClose)
    {
        var color=this.GetColor(price, yClose);
        return color;
    }

    //配色修改
    this.ReloadResource=function(option)
    {
        this.UpColor=g_JSChartResource.UpTextColor;
        this.DownColor=g_JSChartResource.DownTextColor;
        this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

        this.TitleColor=g_JSChartResource.DialogTooltip.TitleColor;
        this.TitleBGColor=g_JSChartResource.DialogTooltip.TitleBGColor;
        this.BGColor=g_JSChartResource.DialogTooltip.BGColor;
        this.BorderColor=g_JSChartResource.DialogTooltip.BorderColor;

        this.VolColor=g_JSChartResource.DialogTooltip.VolColor;
        this.AmountColor=g_JSChartResource.DialogTooltip.AmountColor;
        this.TurnoverRateColor=g_JSChartResource.DialogTooltip.TurnoverRateColor;
        this.PositionColor=g_JSChartResource.DialogTooltip.PositionColor;
        this.DateTimeColor=g_JSChartResource.DialogTooltip.DateTimeColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;

        this.UpdateTableDOM();
    },


    /////////////////////////////////////////////////////////////////////////////////////////////
    //数据格式化
    this.ForamtPrice=function(price, yClose, defaultfloatPrecision, TitleID)
    {
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID, this.LanguageID),
            Text:"--.--",
            Color:this.TitleColor
        };

        if (!IFrameSplitOperator.IsNumber(price)) return item;

        item.Text=price.toFixed(defaultfloatPrecision);
        item.Color=this.GetColor(price, yClose);

        return item;
    }

    this.FormatVol=function(vol, TitleID)
    {
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID),
            Text:'--',
            Color:this.VolColor
        };

        if (!IFrameSplitOperator.IsNumber(vol)) return item;

        item.Text=IFrameSplitOperator.FormatValueString(vol,2,this.LanguageID);
        
        return item;
    }

    this.FormatAmount=function(amount, TitleID)
    {
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID),
            Text:'--',
            Color:this.AmountColor
        };

        if (!IFrameSplitOperator.IsNumber(amount)) return item;

        item.Text=IFrameSplitOperator.FormatValueString(amount,2,this.LanguageID);
        
        return item;
    }

    this.FormatIncrease=function(price, yClose, TitleID)
    {
        //涨幅
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:"--.--",
            Color:this.TitleColor
        };

        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var value=(price-yClose)/yClose;
        item.Text=`${(value*100).toFixed(2)}%`;
        item.Color=this.GetColor(value,0);

        return item;
    }

    this.FormatRisefall=function(price, yClose, defaultfloatPrecision, TitleID)
    {
        //涨跌
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:"--.--",
            Color:this.TitleColor
        };

        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var value=price-yClose;
        item.Text=`${value.toFixed(defaultfloatPrecision)}`;
        item.Color=this.GetColor(value,0);

        return item;
    }

    this.FormatAmplitude=function(high, low, yClose, TitleID)
    {
        //涨幅
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:"--.--",
            Color:this.TitleColor
        };


        if (!IFrameSplitOperator.IsNumber(high) || !IFrameSplitOperator.IsNumber(low) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var value=(high-low)/yClose;
        item.Text=`${(value*100).toFixed(2)}%`;
        item.Color=this.GetColor(value,0);
        
        return item;
    }

    this.ForamtDate=function(date, format, TitleID)
    {
        //日期
        var item=
        { 
            Title:g_JSChartLocalization.GetText('DialogTooltip-Date',this.LanguageID), 
            Text:"----/--/--",
            Color:this.DateTimeColor
        }

        if (!IFrameSplitOperator.IsNumber(date)) return item;

        item.Text=IFrameSplitOperator.FormatDateString(date,format);

        return item;
    }

    this.FormatTime=function(time, period, format, TitleID)
    {
        //时间
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:'--:--',
            Color:this.DateTimeColor
        };

        if (!IFrameSplitOperator.IsNumber(time)) return item;
        if (!format)
        {
            format="HH:MM";
            if (ChartData.IsMinutePeriod(period,true)) timeFormat='HH:MM'; // 分钟周期
            else if (ChartData.IsSecondPeriod(period)) timeFormat='HH:MM:SS';
            else if (ChartData.IsMilliSecondPeriod(period)) timeFormat='HH:MM:SS.fff';
        }

        item.Text=IFrameSplitOperator.FormatTimeString(time,format);

        return item;
    }

    //换手率 成交量/流通股本
    this.FormatExchange=function(vol, flowCapital, TitleID)
    {
        //换手率
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:'--.--',
            Color:this.DateTimeColor
        };

        if (!IFrameSplitOperator.IsNumber(vol) || !IFrameSplitOperator.IsNumber(flowCapital) || flowCapital==0) return item;

        var value=vol/flowCapital*100;
        item.Text=value.toFixed(2)+'%';

        return item;
    }


    //持仓
    this.FormatPosition=function(position, TitleID)
    {
        //持仓
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:'--.--',
            Color:this.PositionColor
        };

        if (!IFrameSplitOperator.IsNumber(position)) return item;

        item.Text=position.toFixed(0);

        return item;
    }

    //结算价
    this.ForamtYClose=function(value, defaultfloatPrecision, TitleID)
    {
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:'--.--',
            Color:this.DateTimeColor
        };

        if (!IFrameSplitOperator.IsNumber(value)) return item;

        item.Text=value.toFixed(defaultfloatPrecision);

        return item;
    }


}