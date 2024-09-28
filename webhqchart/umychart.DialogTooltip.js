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
    this.MaxRowCount=10;

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
        if (!data.KItem || !data.IsShowCorss || data.ClientPos<0) return;

        this.LanguageID=this.HQChart.LanguageID;
        this.TitleBox.DivName.innerText=data.Name;

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
       
        if (!this.IsShow()) this.Show();
    }

    this.UpdateTableDOM=function()
    {
        if (!this.KItemCache) return;

        this.AryText=this.GetFormatKlineTooltipText(this.KItemCache);

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

        //日期
        var dateItem=
        { 
            Title:g_JSChartLocalization.GetText('DialogTooltip-Date',this.LanguageID), 
            Text:IFrameSplitOperator.FormatDateString(data.Date,"YYYY/MM/DD/W"),
            Color:this.DateTimeColor
        }

        //时间
        var timeItem=null;
        var timeFormat=null;
        if (ChartData.IsMinutePeriod(this.HQChart.Period,true)) timeFormat='HH:MM'; // 分钟周期
        else if (ChartData.IsSecondPeriod(this.HQChart.Period)) timeFormat='HH:MM:SS';
        else if (ChartData.IsMilliSecondPeriod(this.HQChart.Period)) timeFormat='HH:MM:SS.fff';

        if (timeFormat)
        {
            timeItem=
            { 
                Title:g_JSChartLocalization.GetText('DialogTooltip-Time',this.LanguageID), 
                Text:IFrameSplitOperator.FormatTimeString(data.Time,timeFormat),
                Color:this.DateTimeColor
            }
        }

        //涨幅
        var increaseItem=
        {
            Title:g_JSChartLocalization.GetText('DialogTooltip-Increase',this.LanguageID), 
            Text:"--.--",
            Color:this.TitleColor
        };
        if (IFrameSplitOperator.IsNumber(data.YClose) && IFrameSplitOperator.IsNumber(data.Close))
        {
            var value=(data.Close-data.YClose)/data.YClose;
            increaseItem.Text=`${(value*100).toFixed(2)}%`;
            increaseItem.Color=this.GetColor(value,0);
        }

        //涨幅
        var amplitudeItem=
        {
            Title:g_JSChartLocalization.GetText('DialogTooltip-Amplitude',this.LanguageID), 
            Text:"--.--",
            Color:this.TitleColor
        }
        if (IFrameSplitOperator.IsNumber(data.YClose) && IFrameSplitOperator.IsNumber(data.High) && IFrameSplitOperator.IsNumber(data.Low))
        {
            var value=(data.High-data.Low)/data.YClose;
            amplitudeItem.Text=`${(value*100).toFixed(2)}%`;
            amplitudeItem.Color=this.GetColor(value,0);
        }

        var aryText=
        [
            { 
                Title:g_JSChartLocalization.GetText('DialogTooltip-Open',this.LanguageID), 
                Text:IFrameSplitOperator.IsNumber(data.Open)? data.Open.toFixed(defaultfloatPrecision):'--',
                Color:this.GetPriceColor(data.Open,data.YClose),
            },
            {
                Title:g_JSChartLocalization.GetText('DialogTooltip-High',this.LanguageID),
                Text:IFrameSplitOperator.IsNumber(data.High)? data.High.toFixed(defaultfloatPrecision):'--',
                Color:this.GetPriceColor(data.High,data.YClose)
            },
            {
                Title:g_JSChartLocalization.GetText('DialogTooltip-Low',this.LanguageID),
                Text:IFrameSplitOperator.IsNumber(data.Low)? data.Low.toFixed(defaultfloatPrecision):'--',
                Color:this.GetPriceColor(data.Low,data.YClose)
            },
            {
                Title:g_JSChartLocalization.GetText('DialogTooltip-Close',this.LanguageID),
                Text:IFrameSplitOperator.IsNumber(data.Close)? data.Close.toFixed(defaultfloatPrecision):'--',
                Color:this.GetPriceColor(data.Close,data.YClose)
            },
            {
                Title:g_JSChartLocalization.GetText('DialogTooltip-Vol',this.LanguageID),
                Text:IFrameSplitOperator.IsNumber(data.Vol)? IFrameSplitOperator.FormatValueString(data.Vol,2,this.LanguageID):'--',
                Color:this.VolColor
            },
            {
                Title:g_JSChartLocalization.GetText('DialogTooltip-Amount',this.LanguageID),
                Text:IFrameSplitOperator.IsNumber(data.Amount)? IFrameSplitOperator.FormatValueString(data.Amount,2,this.LanguageID):'--',
                Color:this.AmountColor
            },
            increaseItem,
            amplitudeItem
        ];

        if (timeItem) aryText.unshift(timeItem);
        aryText.unshift(dateItem);

        return aryText;
    },

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
    }

}