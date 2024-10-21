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
    this.Style=0;       //0=一行一个， 1=2行一个

    this.HQChart=null;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

    this.TitleColor=g_JSChartResource.DialogTooltip.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogTooltip.TitleBGColor;
    this.BGColor=g_JSChartResource.DialogTooltip.BGColor;
    this.BorderColor=g_JSChartResource.DialogTooltip.BorderColor;

    this.TextColor=g_JSChartResource.DialogTooltip.TextColor;
    this.ValueColor=g_JSChartResource.DialogTooltip.ValueColor;

    this.VolColor=g_JSChartResource.DialogTooltip.VolColor;
    this.AmountColor=g_JSChartResource.DialogTooltip.AmountColor;
    this.TurnoverRateColor=g_JSChartResource.DialogTooltip.TurnoverRateColor;
    this.PositionColor=g_JSChartResource.DialogTooltip.PositionColor;
    this.DateTimeColor=g_JSChartResource.DialogTooltip.DateTimeColor;
    this.LanguageID=JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;
    this.MaxRowCount=25;

    this.AryData=[];
    this.AryText=[];

    this.KItemCache=null;
    this.KItemCacheID=null;
    this.LastValueCache=null;    //最后的鼠标位置对应的数值
    this.LastValueCacheID=null;

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
        }
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
        if (this.Style==1)
        {
            for(var i=0;i<this.MaxRowCount;++i)
            {
                var rowItem={ Tr:null, TitleSpan:null, TextSpan:null, Tr2:null };

                var trDom=document.createElement("tr");
                trDom.className='UMyChart_Tooltip_Group_Tr';
                tbody.appendChild(trDom);
                rowItem.Tr=trDom;

                var tdDom=document.createElement("td");
                tdDom.className="UMyChart_Tooltip_Text_Sinlge_Td";   //标题
                trDom.appendChild(tdDom);

                var spanDom=document.createElement("span");
                spanDom.className='UMyChart_Tooltip_Title_Left_Span';
                spanDom.innerText='标题';
                tdDom.appendChild(spanDom);
                rowItem.TitleSpan=spanDom;

                var trDom=document.createElement("tr");
                trDom.className='UMyChart_Tooltip_Group_Tr';
                tbody.appendChild(trDom);
                rowItem.Tr2=trDom;

                var tdDom=document.createElement("td");
                tdDom.className="UMyChart_Tooltip_Text_Sinlge_Td";    //数值
                trDom.appendChild(tdDom);

                var spanDom=document.createElement("span");
                spanDom.className='UMyChart_Tooltip_Text_Span';
                spanDom.innerText='数值';
                tdDom.appendChild(spanDom);
                rowItem.TextSpan=spanDom;

                this.AryData.push(rowItem);
            }
        }
        else
        {
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
            var strLastValue=JSON.stringify(data.LastValue);
            var bUpdata=false;
            if (this.KItemCacheID!=strKItem)    //数据变动的才更新
            {
                this.KItemCache= JSON.parse(strKItem);
                this.KItemCacheID=strKItem;
                bUpdata=true;
            }
            if (data.LastValue && data.LastValue.Y && IFrameSplitOperator.IsNumber(data.LastValue.Y.Value) && this.LastValueCacheID!=strLastValue)
            {
                this.LastValueCache=JSON.parse(strLastValue);
                this.LastValueCacheID=strLastValue;
                bUpdata=true;
            }
            
            if (bUpdata) 
            {
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
            var strLastValue=JSON.stringify(data.LastValue);
            var bUpdata=false;
            if (this.KItemCacheID!=strKItem)    //数据变动的才更新
            {
                this.KItemCache= JSON.parse(strKItem);
                this.KItemCacheID=strKItem;
                bUpdata=true;
            }
            if (data.LastValue && data.LastValue.Y && IFrameSplitOperator.IsNumber(data.LastValue.Y.Value) && this.LastValueCacheID!=strLastValue)
            {
                this.LastValueCache=JSON.parse(strLastValue);
                this.LastValueCacheID=strLastValue;
                bUpdata=true;
            }

            if (bUpdata)
            {
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
            this.AryText=this.GetFormatKLineTooltipText(this.KItemCache);
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
            item.TitleSpan.style.color=this.TextColor;
            item.TextSpan.innerText=outItem.Text;
            item.TextSpan.style.color=outItem.Color;
            item.Tr.style.display="";
            if (item.Tr2) item.Tr2.style.display="";
        }

        for( ; index<this.MaxRowCount; ++index)
        {
            var item=this.AryData[index];
            item.Tr.style.display="none";
            if (item.Tr2) item.Tr2.style.display="none";
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

    this.Show=function(x, y)
    {
        if (this.IsShow()) return;

        if (!this.DivDialog) return;
        if (!this.HQChart) return;

       
        var top=this.HQChart.Frame.ChartBorder.GetTop();
        var left=this.HQChart.Frame.ChartBorder.GetLeft();
        var rtClient=this.HQChart.UIElement.getBoundingClientRect();

        var x=left+rtClient.left+5;
        var y=top+rtClient.top+10;
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
        

        this.DivDialog.style.visibility='visible';
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }


    this.GetFormatKLineTooltipText=function(data)
    {
        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var upperSymbol=this.HQChart.Symbol.toUpperCase();
        var priceFormat=0;
        if (this.Style==1) priceFormat=1;

        //日期
        var dateItem=this.ForamtDate(data.Date,"YYYY/MM/DD/W",'DialogTooltip-Date' );

        //时间
        var timeItem=null;
        if (IFrameSplitOperator.IsNumber(data.Time)) timeItem=this.FormatTime(data.Time, this.HQChart.Period, null, 'DialogTooltip-Time');
        
        var yClose=data.YClose; //昨收价|昨结算价
        var aryText=
        [
            this.ForamtPrice(data.Open,yClose, defaultfloatPrecision,'DialogTooltip-Open',priceFormat),
            this.ForamtPrice(data.High,yClose, defaultfloatPrecision,'DialogTooltip-High',priceFormat),
            this.ForamtPrice(data.Low,yClose, defaultfloatPrecision,'DialogTooltip-Low',priceFormat),
            this.ForamtPrice(data.Close,yClose, defaultfloatPrecision,'DialogTooltip-Close',priceFormat),
            this.FormatVol(data.Vol,'DialogTooltip-Vol' ),
            this.FormatAmount(data.Amount,'DialogTooltip-Amount' ),
            this.FormatIncrease(data.Close,yClose,defaultfloatPrecision,'DialogTooltip-Increase',priceFormat),
            this.FormatAmplitude(data.High,data.Low,yClose,defaultfloatPrecision,'DialogTooltip-Amplitude',priceFormat),
        ];

        if (this.LastValueCache && this.LastValueCache.Y)
        {
            var item=this.LastValueCache.Y;
            var rowItem=null;
            if (item.Extend.FrameID==0)
            {
                rowItem=this.ForamtPrice(item.Value,null, defaultfloatPrecision,'DialogTooltip-Value',2);
            }
            else
            {
                rowItem=this.ForamtValue(item.Value, 2,'DialogTooltip-Value');
            }

            if (rowItem) aryText.unshift(rowItem);
        }

        if (this.Style==1)
        {
            if (timeItem) aryText.unshift(timeItem);
            var dateItem=this.ForamtDate(data.Date,"YYYY/MM/DD",'DialogTooltip-Date' );
            aryText.unshift(dateItem);
        }
        else
        {
            if (timeItem) aryText.unshift(timeItem);
            aryText.unshift(dateItem);
        }

        

        //换手率
        if (MARKET_SUFFIX_NAME.IsSHSZStockA(upperSymbol) && data.FlowCapital>0)
        {
            aryText.push(this.FormatExchange(data.Vol,data.FlowCapital,'DialogTooltip-Exchange' ));
        }

        //持仓量 结算价
        if (MARKET_SUFFIX_NAME.IsFutures(upperSymbol))
        {
            aryText.push(this.FormatPosition(data.Position,'DialogTooltip-Position'));
            aryText.push(this.ForamtFClose(data.FClose, defaultfloatPrecision, 'DialogTooltip-FClose'));
        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_DIALOG_TOOLTIP_TEXT);
        if (event && event.Callback)
        {
            var sendData={ AryText:aryText, Data:data, Symbol:this.HQChart.Symbol, HQChart:this.HQChart, IsKLine:true };
            event.Callback(event, sendData, this);
        }

        return aryText;
    },

    this.GetFormatMinuteTooltipText=function(data)
    {
        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var aryText=[];
        if (data.Type==0) //连续交易
        {
            var item=data.Data;
            if (!item) item={ };

            aryText=
            [
                this.ForamtDate(item.Date,this.Style==1?"MM/DD/W":"YYYY/MM/DD/W",'DialogTooltip-Date' ),
                this.FormatTime(item.Time, null, "HH:MM", 'DialogTooltip-Time'),
                this.ForamtPrice(item.Close,item.YClose, defaultfloatPrecision,'DialogTooltip-Price', 1),
                this.ForamtPrice(item.AvPrice,item.YClose, defaultfloatPrecision,'DialogTooltip-AvPrice', 1),
                this.FormatRisefall(item.Close,item.YClose, defaultfloatPrecision,'DialogTooltip-Risefall'),
                this.FormatIncrease(item.Close,item.YClose,defaultfloatPrecision,'DialogTooltip-Increase', 1),
                this.FormatVol(item.Vol,'DialogTooltip-Vol' ),
                this.FormatAmount(item.Amount,'DialogTooltip-Amount' ),
            ];

            if (this.LastValueCache && this.LastValueCache.Y)
            {
                var item=this.LastValueCache.Y;
                var rowItem=null;
                if (item.Extend.FrameID==0)
                {
                    rowItem=this.ForamtPrice(item.Value,null, defaultfloatPrecision,'DialogTooltip-Value',2);
                }
                else
                {
                    rowItem=this.ForamtValue(item.Value, 2,'DialogTooltip-Value');
                }
    
                if (rowItem) aryText.splice(2,0,rowItem);
            }
        }
        else if (data.Type==1)  //集合竞价
        {
            var item=data.Data.Data;
            if (!item) item={ Vol:[] };

            var timeForamt="HH:MM:SS";
            if (item.Ver===1) timeForamt="HH:MM"
            aryText=
            [
                this.ForamtDate(item.Date,this.Style==1?"MM/DD/W":"YYYY/MM/DD/W",'DialogTooltip-Date' ),
                this.FormatTime(item.Time, null, timeForamt, 'DialogTooltip-Time'),
                this.ForamtPrice(item.Price,item.YClose, defaultfloatPrecision,'DialogTooltip-AC-Price',1),
                this.FormatIncrease(item.Price,item.YClose,defaultfloatPrecision,'DialogTooltip-AC-Increase',1),
                this.FormatVol(item.Vol[0],'DialogTooltip-AC-Vol' ),
            ];
        }
        else
        {

        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_DIALOG_TOOLTIP_TEXT);
        if (event && event.Callback)
        {
            var sendData={ AryText:aryText, Data:data, Symbol:this.HQChart.Symbol, HQChart:this.HQChart, IsMinute:true };
            event.Callback(event, sendData, this);
        }

        return aryText
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

        this.TextColor=g_JSChartResource.DialogTooltip.TextColor;
        this.ValueColor=g_JSChartResource.DialogTooltip.ValueColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
        if (this.TitleColor) this.TitleBox.DivName.style['color']=this.TitleColor;

        this.UpdateTableDOM();
    },


    /////////////////////////////////////////////////////////////////////////////////////////////
    //数据格式化 format=0  点差+涨幅 1=涨幅
    this.ForamtPrice=function(price, yClose, defaultfloatPrecision, TitleID, format)
    {
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID, this.LanguageID),
            Text:"--.--",
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(price)) return item;

        if (format==2)
        {
            item.Text=price.toFixed(defaultfloatPrecision);
            item.Color=this.ValueColor;
            return item;
        }

        if (IFrameSplitOperator.IsNumber(yClose) && format!=1)
        {
            var value=(price-yClose)/yClose*100;
            item.Text=`${price.toFixed(defaultfloatPrecision)}(${value.toFixed(2)}%)`;
        }
        else
        {
            item.Text=price.toFixed(defaultfloatPrecision);
        }

        
        item.Color=this.GetColor(price, yClose);

        return item;
    }

    this.ForamtValue=function(value, defaultfloatPrecision, TitleID)
    {
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID),
            Text:'--',
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(value)) return item;

        item.Text=IFrameSplitOperator.FormatValueStringV2(value,defaultfloatPrecision,2,this.LanguageID);
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

        item.Text=IFrameSplitOperator.FormatValueStringV2(vol,0,2,this.LanguageID);
        
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

    this.FormatIncrease=function(price, yClose, defaultfloatPrecision, TitleID, fromat)
    {
        //涨幅
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:"--.--",
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose)) return item;

      

        var diffValue=price-yClose;
        var value=(price-yClose)/yClose;
        if (fromat==1)
        {
            item.Text=`${(value*100).toFixed(2)}%`;
        }
        else
        {
            item.Text=`${diffValue.toFixed(defaultfloatPrecision)}(${(value*100).toFixed(2)}%)`;
        }
       
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
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var value=price-yClose;
        item.Text=`${value.toFixed(defaultfloatPrecision)}`;
        item.Color=this.GetColor(value,0);

        return item;
    }

    this.FormatAmplitude=function(high, low, yClose, defaultfloatPrecision, TitleID, fromat)
    {
        //振幅
        var item=
        {
            Title:g_JSChartLocalization.GetText(TitleID,this.LanguageID), 
            Text:"--.--",
            Color:this.ValueColor
        };


        if (!IFrameSplitOperator.IsNumber(high) || !IFrameSplitOperator.IsNumber(low) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var diffValue=high-low;
        var value=(high-low)/yClose;
        if (fromat==1) item.Text=`${(value*100).toFixed(2)}%`;
        else item.Text=`${diffValue.toFixed(defaultfloatPrecision)}(${(value*100).toFixed(2)}%)`;
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
    this.ForamtFClose=function(value, defaultfloatPrecision, TitleID)
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