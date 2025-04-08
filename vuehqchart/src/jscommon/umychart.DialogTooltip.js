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
    this.LastValueCache=null;       //最后的鼠标位置对应的数值
    this.LastValueCacheID=null;     //鼠标信息
    this.DataID=null;               //当前显示的数据时间{ Symbol:, Date:, Time: }

    this.RestoreFocusDelay=800;

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

    //data={ Symbol, Date, Time}
    this.IsEqualDataID=function(data)
    {
        if (!this.DataID) return false;
        if (!data) return false;

        if (this.DataID.Symbol!=data.Symbol) return false;
        if (this.DataID.Date!=data.Date) return false;
        if (IFrameSplitOperator.IsNumber(this.DataID.Time))
        {
            if (this.DataID.Time!=data.Time) return false;
        }

        return true;
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

    //更新实时数据
    this.UpdateKLineData=function(data)
    {
        if (!data.KItem|| !data.IsShowCorss) return;

        this.LanguageID=this.HQChart.LanguageID;

        if (this.HQChart.ClassName=='KLineChartContainer')
        {
            var strKItem=JSON.stringify(data.KItem);
            var bUpdata=false;
            if (this.KItemCacheID!=strKItem)    //数据变动的才更新
            {
                this.KItemCache= JSON.parse(strKItem);
                this.KItemCacheID=strKItem;
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
    }

    //更新实时分时数据
    this.UpdateMinuteData=function(data)
    {
        if (!data.MinItem || !data.IsShowCorss) return;

        var strKItem=JSON.stringify(data.MinItem);
        var bUpdata=false;
        if (this.KItemCacheID!=strKItem)    //数据变动的才更新
        {
            this.KItemCache= JSON.parse(strKItem);
            this.KItemCacheID=strKItem;
            bUpdata=true;
        }

        if (bUpdata)
        {
            this.UpdateTableDOM();
        }
    }

    this.Update=function(data)
    {
        if (!this.DivDialog ||  !this.TitleBox) return;

        //实时数据更新
        if (data.DataType==1)
        {
            this.UpdateKLineData(data);
            return;
        }
        else if (data.DataType==2)
        {
            this.UpdateMinuteData(data);
            return;
        }


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
                this.UpdateDataID(data);
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
                this.UpdateDataID(data);
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

    this.UpdateDataID=function(data)
    {
        if (this.HQChart.ClassName=='KLineChartContainer')
        {
            var kItem=data.KItem;
            this.DataID={ Symbol:data.Symbol, Date:kItem.Date, Time:null };
            if (IFrameSplitOperator.IsNumber(kItem.Time)) this.DataID.Time=kItem.Time;
        }
        else if (this.HQChart.ClassName=='MinuteChartContainer')
        {
            var minItem=data.MinItem;
            if (minItem.Type==0) //连续交易
            {
                var item=minItem.Data;
                if (item) this.DataID={ Symbol:data.Symbol, Date:item.Date, Time:item.Time };
            }
            else if (minItem.Type==1)   //集合竞价
            {
                var item=minItem.Data.Data;
                if (item) this.DataID={ Symbol:data.Symbol, Date:item.Date, Time:item.Time };
            }
            
        }
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';

        if (this.HQChart) this.HQChart.RestoreFocus(this.RestoreFocusDelay);
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
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);
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
            this.FormatVol(data.Vol/unit,'DialogTooltip-Vol' ),
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
        if (IFrameSplitOperator.IsNumber(data.FlowCapital))
        {
            aryText.push(this.FormatExchange(data.Vol,data.FlowCapital,'DialogTooltip-Exchange' ));
        }

        //持仓量 结算价
        if (MARKET_SUFFIX_NAME.IsFutures(upperSymbol))
        {
            aryText.push(this.FormatPosition(data.Position,'DialogTooltip-Position'));
            aryText.push(this.ForamtFClose(data.FClose, defaultfloatPrecision, 'DialogTooltip-FClose'));
        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_DIALOG_TOOLTIP);
        if (event && event.Callback)
        {
            var sendData={ AryText:aryText, Data:data, Symbol:this.HQChart.Symbol, HQChart:this.HQChart, IsKLine:true };
            event.Callback(event, sendData, this);
        }

        return aryText;
    }

    this.GetFormatMinuteTooltipText=function(data)
    {
        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);//价格小数位数
        var upperSymbol=this.HQChart.Symbol.toUpperCase();
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);
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
                this.FormatVol(item.Vol/unit,'DialogTooltip-Vol' ),
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
                this.FormatVol(item.Vol[0]/unit,'DialogTooltip-AC-Vol' ),
            ];
        }
        else
        {

        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_DIALOG_TOOLTIP);
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
    }


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
            if (ChartData.IsMinutePeriod(period,true)) format='HH:MM'; // 分钟周期
            else if (ChartData.IsSecondPeriod(period)) format='HH:MM:SS';
            else if (ChartData.IsMilliSecondPeriod(period)) format='HH:MM:SS.fff';
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

//浮动K线提示信息
function JSFloatTooltip()
{
    this.DivDialog=null;
    this.Style=0;       //0=一行一个， 1=2行一个

    this.HQChart=null;
    this.MaxRowCount=25;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

    this.BGColor=g_JSChartResource.FloatTooltip.BGColor;
    this.BorderColor=g_JSChartResource.FloatTooltip.BorderColor;

    this.TextColor=g_JSChartResource.FloatTooltip.TextColor;
    this.ValueColor=g_JSChartResource.FloatTooltip.ValueColor;

    this.VolColor=g_JSChartResource.FloatTooltip.VolColor;
    this.AmountColor=g_JSChartResource.FloatTooltip.AmountColor;
    this.TurnoverRateColor=g_JSChartResource.FloatTooltip.TurnoverRateColor;
    this.PositionColor=g_JSChartResource.FloatTooltip.PositionColor;
    this.DateTimeColor=g_JSChartResource.FloatTooltip.DateTimeColor;
    this.LanguageID=JSCHART_LANGUAGE_ID.LANGUAGE_CHINESE_ID;

    this.ValueAlign=
    {
        Left:"UMyChart_Tooltip_Float_Text2_Span",       //左对齐
        MarginLeft:'UMyChart_Tooltip_Float_Text3_Span',
        Right:"UMyChart_Tooltip_Float_Text_Span",
    }

    this.AryData=[];    //输出文字信息
    this.AryText=[];    //表格tr

    this.KItemCache=null;   //{ Symbol:, Item:, Name }
    this.KItemCacheID=null;

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            if (IFrameSplitOperator.IsNumber(option.Style)) this.Style=option.Style;
            if (IFrameSplitOperator.IsNumber(option.MaxRowCount)) this.MaxRowCount=option.MaxRowCount;
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

    this.Show=function(x, y, option)
    {
        if (!this.DivDialog) return;
        if (!this.HQChart) return;

        var rtClient=this.HQChart.UIElement.getBoundingClientRect();
        var yMove=0;
        if (option && IFrameSplitOperator.IsNumber(option.YMove)) yMove=option.YMove;

        var left=x+rtClient.left,top=y+rtClient.top+yMove;
        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=left-this.DivDialog.offsetWidth;
        if ((bottom+5)>=window.innerHeight) 
        {
            top=(y+rtClient.top)-this.DivDialog.offsetHeight;
        }
       
        this.DivDialog.style.top = top + "px";
        this.DivDialog.style.left = left + "px";
        
        if (this.DivDialog.style.visibility!='visible')
            this.DivDialog.style.visibility='visible';
    }

    this.Hide=function()
    {
        if (!this.DivDialog) return;

        this.KItemCache=null;
        this.KItemCacheID=null;

        if (this.DivDialog.style.visibility!='hidden') this.DivDialog.style.visibility='hidden';
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_Tooltip_Float_Div';

        var table=document.createElement("table");
        table.className="UMyChart_Tooltip_Float_Table";
        divDom.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_Tooltip_Float_Tbody";
        table.appendChild(tbody);

        this.AryData=[];
        
        for(var i=0;i<this.MaxRowCount;++i)
        {
            var rowItem={ Tr:null, TitleSpan:null, TextSpan:null, TitleTd:null, TextTd:null };

            var trDom=document.createElement("tr");
            trDom.className='UMyChart_Tooltip_Float_Group_Tr';
            tbody.appendChild(trDom);
            rowItem.Tr=trDom;

            var tdDom=document.createElement("td");
            tdDom.className="UMyChart_Tooltip_Float_Title_Td";   //标题
            trDom.appendChild(tdDom);
            rowItem.TitleTd=tdDom;

            var spanDom=document.createElement("span");
            spanDom.className='UMyChart_Tooltip_Float_Title_Span';
            spanDom.innerText='标题';
            tdDom.appendChild(spanDom);
            rowItem.TitleSpan=spanDom;

            var tdDom=document.createElement("td");
            tdDom.className="UMyChart_Tooltip_Float_Text_Td";    //数值
            trDom.appendChild(tdDom);
            rowItem.TextTd=tdDom;

            var spanDom=document.createElement("span");
            spanDom.className='UMyChart_Tooltip_Float_Text_Span';
            spanDom.innerText='数值';
            tdDom.appendChild(spanDom);
            rowItem.TextSpan=spanDom;

            this.AryData.push(rowItem);
        }
        
        document.body.appendChild(divDom);

        this.DivDialog=divDom;
        
        this.UpdateStyle();
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }

    //data={ Symbol, Date, Time} 是否是同一条K线
    this.IsEqualHQID=function(data)
    {
        if (!this.KItemCache) return false;
        if (!data) return false;
        if (!this.KItemCache.Item) return false;

        var kItem=this.KItemCache.Item;
        if (this.KItemCache.Symbol!=data.Symbol) return false;
        if (kItem.Date!=data.Date) return false;
        if (IFrameSplitOperator.IsNumber(kItem.Time))
        {
            if (kItem.Time!=data.Time) return false;
        }

        return true;
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        //this.UpdateTableDOM();
    }

    //更新数据
    this.Update=function(data)
    {
        if (!this.DivDialog) return;
        this.LanguageID=this.HQChart.LanguageID;

        if (data.DataType==1)
        {
            var tooltipData=data.Tooltip;
            if (!tooltipData) return;
    
            if (tooltipData.Type==0)    //K线信息
            {
                this.UpdateKLineToolitp(data);
            }
            else if (tooltipData.Type==1)   //信息地雷
            {
                this.UpdateKLineInfoTooltip(data);
            }
            else if (tooltipData.Type==2)   //交易指标
            {
                this.UpdateTradeIndexTooltip(data);
            }
            else if (tooltipData.Type==3)   //分时图异动信息
            {
                this.UpdateMinuteInfoTooltip(data);
            }
            else if (tooltipData.Type==4)   //ChartMultiSVGIconV2 图标信息
            {
                this.UpdatMultiSVGIconV2Tooltip(data);
            }
            else if (tooltipData.Type==5)   //ChartOX 信息
            {
                this.UpdatChartOXTooltip(data);
            }
            else if (tooltipData.Type==6)   //散点图
            {
                this.UpdatChartScatterPlotTooltip(data);
            }
            else if (tooltipData.Type==7)   //ChartDrawSVG 老版本 单行
            {
                this.UpdateChartDrawSVGTooltip(data);
            }
            else if (tooltipData.Type==8)   //ChartDrawSVG 新版本
            {
                this.UpdateChartDrawSVGV2Tooltip(data);
            }
            else if (tooltipData.Type==9)   //ChartKLineTable
            {
                this.UpdateChartKLineTableTooltip(data);
            }
           
        }
        else if (data.DataType==2)  //更新实时行情数据
        {
            this.UpdateRealtimeHQTooltip(data);
        }
        else if (data.DataType==3)  //报价列表
        {
            var tooltipData=data.Tooltip;
            if (!tooltipData) return;

            if (tooltipData.Type==2)  //报价列表表头图标提示信息
            {
                this.ReportHeaderIconTooltip(data);
            }
            else if (tooltipData.Type==1)   //单元格截断内容
            {
                this.ReportCellTruncateTooltip(data);
            }
        }
        else if (data.DataType==4)  //T型报价
        {
            var tooltipData=data.Tooltip;
            if (!tooltipData) return;

            if (tooltipData.Type==2 || tooltipData.Type==3)
            {
                this.TReportIconTooltip(data);
            }
        }
    }

    this.UpdateRealtimeHQTooltip=function(data)
    {
        if (!this.KItemCache) return;

        var kItem={ Symbol:data.Symbol, Name:this.KItemCache.Name, Item:data.Data, IsOverlay:this.KItemCache.IsOverlay };
        var strKItem=JSON.stringify(kItem);

        var bUpdata=false;
        if (this.KItemCacheID!=strKItem)    //数据变动的才更新
        {
            this.KItemCache= kItem;
            this.KItemCacheID=strKItem;
            this.AryText=this.GetFormatKLineTooltipText(this.KItemCache);
            bUpdata=true;
        }

        if (bUpdata) 
        {
            this.UpdateTableDOM();
        }
    }

    this.ShowTooltip=function(data)
    {
        if (!data.Point) return;

        var x=data.Point.X;
        var y=data.Point.Y;
        this.Show(x, y, { YMove:data.Point.YMove });
    }

    //K线提示信息
    this.UpdateKLineToolitp=function(data)
    {
        var tooltipData=data.Tooltip;
        var symbol=data.Symbol;
        var name=data.Name;
        var bOverlay=false; //是否是叠加指标
        var bIndexKLine=false;
        if (tooltipData.ChartPaint.Name=="Overlay-KLine")
        {
            symbol=tooltipData.ChartPaint.Symbol;
            name=tooltipData.ChartPaint.Title;
            bOverlay=true;
        }
        else if (tooltipData.ChartPaint.Name=="DRAWKLINE")
        {
            symbol=tooltipData.ChartPaint.Symbol;
            name=tooltipData.ChartPaint.Title;
            bIndexKLine=true;
        }

        var kItem={ Symbol:symbol, Name:name, Item:CloneData(tooltipData.Data), IsOverlay:bOverlay, IsIndexKLine:bIndexKLine };
        var strKItem=JSON.stringify(kItem);
        var bUpdata=false;
        if (this.KItemCacheID!=strKItem)    //数据变动的才更新
        {
            this.KItemCache= kItem;
            this.KItemCacheID=strKItem;
            this.AryText=this.GetFormatKLineTooltipText(this.KItemCache);
            bUpdata=true;
        }
        
        if (bUpdata) 
        {
            this.UpdateTableDOM();
        }

        this.ShowTooltip(data);
    }

    //ChartDrawSVG 老版本 单行
    this.UpdateChartDrawSVGTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Item || !tooltipData.Data.Item.Tooltip) return;
        var item=tooltipData.Data.Item.Tooltip;

        var aryText=[]
        var rowItem={ Text:"", HTMLTitle:item.Text, Color:this.ValueColor, IsMergeCell:true };
        aryText.push(rowItem);

        this.AryText=aryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //ChartDrawSVG 新版本
    this.UpdateChartDrawSVGV2Tooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Item || !tooltipData.Data.Item.Tooltip) return;
        var aryData=tooltipData.Data.Item.Tooltip.AryText;
        if (!IFrameSplitOperator.IsNonEmptyArray(aryData)) return;
        var aryText=[];
        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            var rowItem={ Title:"", Text:"", Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
            if (item.TextColor) rowItem.Color=item.TextColor;
            if (item.Title) rowItem.Title=item.Title;
            if (item.Text) rowItem.Text=item.Text;

            aryText.push(rowItem);
        }

        this.AryText=aryText;

        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }
    

    this.UpdateChartKLineTableTooltip=function(data)
    {
        this.UpdateChartDrawSVGV2Tooltip(data);
    }

    //交易指标
    this.UpdateTradeIndexTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Data) return;

        var item=tooltipData.Data.Data;
        var kItem=item.KData;
        var aryText=[];

        var rowItem={ Title:"日期",Text:IFrameSplitOperator.FormatDateString(kItem.Date,"YYYY-MM-DD"), Color:this.ValueColor };
        aryText.push(rowItem);

        if (IFrameSplitOperator.IsNumber(kItem.Time))
        {
            var format="HH:MM";
            var rowItem={ Title:"时间",Text:IFrameSplitOperator.FormatTimeString(kItem.Time,format), Color:this.ValueColor };
            aryText.push(rowItem);
        }

        var rowItem={ Title:"指标名称:", Text:`${item.Name}${item.Param}`, Color:this.ValueColor };
        aryText.push(rowItem);

        var rowItem={ Title:"买卖方向:", Text:`${item.Type==1?"买入":"卖出"}`, Color:item.Type==1?this.UpColor:this.DownColor };
        aryText.push(rowItem);

        var rowItem={  };
        
        this.AryText=aryText;

        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //分时图异动信息
    this.UpdateMinuteInfoTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Data || !tooltipData.Data.Data.Item) return;
        var item=tooltipData.Data.Data.Item;

        var aryText=[];
        var rowItem={ Title:"日期",Text:IFrameSplitOperator.FormatDateString(item.Date,"YYYY-MM-DD"), Color:this.ValueColor };
        aryText.push(rowItem);

        var format="HH:MM";
        var rowItem={ Title:"时间",Text:IFrameSplitOperator.FormatTimeString(item.Time,format), Color:this.ValueColor };
        aryText.push(rowItem);

        var rowItem={ Title:"异动", Text:item.Title, Color:this.ValueColor };
        aryText.push(rowItem);
        
        this.AryText=aryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //ChartMultiSVGIconV2 图标信息
    this.UpdatMultiSVGIconV2Tooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Item) return;

        var item=tooltipData.Data.Item;
        var aryText=[];
        if (item && IFrameSplitOperator.IsObject(item.Text))
        {
            var tooltipData=item.Text;
            if (IFrameSplitOperator.IsNonEmptyArray(tooltipData.AryText))
            {
                for(var i=0;i<tooltipData.AryText.length;++i)
                {
                    var tooltipItem=tooltipData.AryText[i];
                    var textItem={ Title:tooltipItem.Title, Text:tooltipItem.Text, Color:this.ValueColor };
                    if (tooltipItem.Color) textItem.Color=tooltipItem.Color;
                    if (tooltipItem.Align=="Left") tooltipItem.ClassName=this.ValueAlign.Left;

                    aryText.push(tooltipItem);
                }
            }
        }
        else
        {
            var rowItem={ Text:"", HTMLTitle:item.Text, Color:this.ValueColor, IsMergeCell:true };
            aryText.push(rowItem);
        }
        

        this.AryText=aryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //ChartOX 信息
    this.UpdatChartOXTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Data) return;

        var item=tooltipData.Data.Data;
        var period=this.HQChart.Period;
        var aryText=[];
        if (ChartData.IsDayPeriod(period, true))
        {
            var strStartDate=IFrameSplitOperator.FormatDateString(item.Start.Date,"YYYY-MM-DD");
            var strEndDate=IFrameSplitOperator.FormatDateString(item.End.Date,"YYYY-MM-DD");
           
            aryText.push({ Title:"起始时间",Text:strStartDate, Color:this.ValueColor });
            aryText.push({ Title:"结束时间",Text:strEndDate, Color:this.ValueColor });
        }
        else if (ChartData.IsMinutePeriod(period, true))
        {
            var strStartDate=IFrameSplitOperator.FormatDateString(item.Start.Date);
            var strStartTime=IFrameSplitOperator.FormatTimeString(item.Start.Time,"HH:MM");

            var strEndDate=IFrameSplitOperator.FormatDateString(item.End.Date);
            var strEndTime=IFrameSplitOperator.FormatTimeString(item.End.Time,"HH:MM");

            aryText.push({ Title:"起始时间",Text:`${strStartDate} ${strStartTime}`, Color:this.ValueColor });
            aryText.push({ Title:"结束时间",Text:`${strEndDate} ${strEndTime}`, Color:this.ValueColor });
        }

        this.AryText=aryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //表头图标
    this.ReportHeaderIconTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !IFrameSplitOperator.IsNonEmptyArray(tooltipData.Data.AryText)) return;
        
        this.AryText=tooltipData.Data.AryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    //表格单元格截断内容
    this.ReportCellTruncateTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !IFrameSplitOperator.IsNonEmptyArray(tooltipData.Data.AryText)) return;
        
        var item=tooltipData.Data.AryText[0];
        if (!item.Text) return;
        
        this.AryText=[ { Title:item.Text, IsMergeCell:true } ];

        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    this.TReportIconTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !IFrameSplitOperator.IsNonEmptyArray(tooltipData.Data.AryText)) return;
        
        this.AryText=tooltipData.Data.AryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }
 
    this.UpdateTableDOM=function()
    {
        var index=0;
        for(index=0;index<this.AryText.length && index<this.MaxRowCount;++index)
        {
            var outItem=this.AryText[index];
            var item=this.AryData[index];

            if (outItem.HTMLTitle) item.TitleSpan.innerHTML=outItem.HTMLTitle
            else item.TitleSpan.innerText=outItem.Title;

            item.TitleSpan.style.color=this.TextColor;

            if (outItem.HTMLText) item.TextSpan.innerHTML=outItem.HTMLText
            else item.TextSpan.innerText=outItem.Text;

            item.TextSpan.style.color=outItem.Color;
            item.TextTd.style.color=outItem.Color;

            if (outItem.ClassName) 
            {
                item.TextSpan.className=outItem.ClassName;
            }
            else
            {
                if (item.TextSpan.className!=this.ValueAlign.Right) item.TextSpan.className=this.ValueAlign.Right;
            }

            if (outItem.IsMergeCell)    //合并单元格
            {
                item.TitleTd.colspan=2;
                item.TextTd.style.display="none";
            }
            else
            {
                if (item.TitleTd.colspan!=1) item.TitleTd.colspan=1;
                item.TextTd.style.display="";
            }
           
            item.Tr.style.display="";
            if (item.Tr2) item.Tr2.style.display="none";

        }

        for( ; index<this.MaxRowCount; ++index)
        {
            var item=this.AryData[index];
            item.Tr.style.display="none";
            if (item.Tr2) item.Tr2.style.display="none";
        }
    }

    
    this.GetFormatKLineTooltipText=function(kItem)
    {
        var data=kItem.Item;
        var symbol=kItem.Symbol;
        if (data && data.Symbol) symbol=symbol;
        var upperSymbol="";
        if (symbol) upperSymbol=symbol.toUpperCase();
        
        var defaultfloatPrecision=GetfloatPrecision(symbol);//价格小数位数
        var unit=MARKET_SUFFIX_NAME.GetVolUnit(upperSymbol);

        //日期
        var dateItem=this.ForamtDate(data.Date,"YYYY/MM/DD/W",'FloatTooltip-Date' );

        //时间
        var timeItem=null;
        if (IFrameSplitOperator.IsNumber(data.Time)) timeItem=this.FormatTime(data.Time, this.HQChart.Period, null, 'FloatTooltip-Time');

        var overlayItem=null;
        if (kItem.IsOverlay)
            overlayItem={ Title:"", Text:kItem.Name, Color:this.TextColor, ClassName:this.ValueAlign.Left };
        else if (kItem.IsIndexKLine)
        {
            if (kItem.Name)
                overlayItem={ Title:"", Text:kItem.Name, Color:this.TextColor, ClassName:this.ValueAlign.Left };
            else if (data && data.Name )
                overlayItem={ Title:"", Text:data.Name, Color:this.TextColor, ClassName:this.ValueAlign.Left };
        }
        
        
        var yClose=data.YClose; //昨收价|昨结算价
        var aryText=
        [
            this.ForamtPrice(data.Open,yClose, defaultfloatPrecision,'FloatTooltip-Open'),
            this.ForamtPrice(data.High,yClose, defaultfloatPrecision,'FloatTooltip-High'),
            this.ForamtPrice(data.Low,yClose, defaultfloatPrecision,'FloatTooltip-Low'),
            this.ForamtPrice(data.Close,yClose, defaultfloatPrecision,'FloatTooltip-Close'),
            this.ForamtPrice(data.YClose,data.YClose, defaultfloatPrecision,'FloatTooltip-YClose'),
            this.FormatVol(data.Vol/unit,'FloatTooltip-Vol' ),
            this.FormatAmount(data.Amount,'FloatTooltip-Amount' ),
            this.FormatIncrease(data.Close,yClose,defaultfloatPrecision,'FloatTooltip-Increase'),
            this.FormatAmplitude(data.High,data.Low,yClose,defaultfloatPrecision,'FloatTooltip-Amplitude'), 
        ];

        if (timeItem) aryText.unshift(timeItem);
        aryText.unshift(dateItem);
        if (overlayItem) aryText.unshift(overlayItem);
        
        //换手率
        if (IFrameSplitOperator.IsNumber(data.FlowCapital))
        {
            aryText.push(this.FormatExchange(data.Vol,data.FlowCapital,'FloatTooltip-Exchange' ));
        }

        //持仓量 结算价
        if (MARKET_SUFFIX_NAME.IsFutures(upperSymbol))
        {
            aryText.push(this.FormatPosition(data.Position,'FloatTooltip-Position'));
            aryText.push(this.ForamtFClose(data.FClose, defaultfloatPrecision, 'FloatTooltip-FClose'));
            aryText.push(this.ForamtFClose(data.YFClose, defaultfloatPrecision, 'FloatTooltip-YSettlePrice'));
            
        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_KLINE_FLOAT_TOOLTIP);
        if (event && event.Callback)
        {
            var sendData={ AryText:aryText, Data:kItem, HQChart:this.HQChart };
            event.Callback(event, sendData, this);
        }
        
        return aryText;
    }


    //信息地雷
    this.UpdateKLineInfoTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        var symbol=data.Symbol;
        var defaultfloatPrecision=GetfloatPrecision(symbol);//价格小数位数

        var aryData=tooltipData.Data.Data;
        var aryText=[]; //输出内容
        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            var infoType=item.InfoType;
            switch(infoType)
            {
                case KLINE_INFO_TYPE.BLOCKTRADING:
                    this.FormatBlockTradingText(item, defaultfloatPrecision, aryText);
                    break;
                case KLINE_INFO_TYPE.TRADEDETAIL:
                    this.FormatTradeDetailText(item,defaultfloatPrecision,aryText);
                    break;
                case KLINE_INFO_TYPE.RESEARCH:
                    this.FormatResearchText(item, aryText);
                    break;
                case KLINE_INFO_TYPE.PFORECAST:
                    this.FormatPerformanceForecastText(item,aryText);
                    break;
                default:
                    this.FormatDefaultKLineInfoText(item, aryText);
                    break;
            }
        }

        var event=this.HQChart.GetEventCallback(JSCHART_EVENT_ID.ON_FORMAT_KLINE_INFO_FLOAT_TOOLTIP);
        if (event && event.Callback)
        {
            var sendData={ AryText:aryText, Data:data, HQChart:this.HQChart };
            event.Callback(event, sendData, this);
        }

        this.AryText=aryText;

        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }

    this.UpdatChartScatterPlotTooltip=function(data)
    {
        var tooltipData=data.Tooltip;
        if (!tooltipData.Data || !tooltipData.Data.Data || !tooltipData.Data.Data.Tooltip) return;
        var aryData=tooltipData.Data.Data.Tooltip;
        var aryText=[]; //输出内容

        for(var i=0;i<aryData.length;++i)
        {
            var item=aryData[i];
            if (!item.Text && !item.Title) continue;
            var rowItem={ Title:"", Text:"", Color:this.ValueColor };
            if (item.Title) rowItem.Title=item.Title;
            if (item.Text) rowItem.Text=item.Text;
            if (item.TextColor) rowItem.Color=item.TextColor;

            aryText.push(rowItem);
        }

        this.AryText=aryText;
        this.UpdateTableDOM();

        this.ShowTooltip(data);
    }


    /////////////////////////////////////////////////////////////////////////////////////////////
    // 公告数据格式化

    this.FormatDefaultKLineInfoText=function(item, aryOut)
    {
        var title;
        var strDate=IFrameSplitOperator.FormatDateString(item.Date,"YYYY-MM-DD");
        if (IFrameSplitOperator.IsNumber(item.Time)) 
        {
            var strTime=IFrameSplitOperator.FormatTimeString(item.Time);
            title=`${strDate} ${strTime}`;
        }
        else
        {
            title=strDate;
        }

        var item=
        { 
            Title:title,        //日期
            Text:item.Title,    //标题
            Color:this.ValueColor,
            ClassName:this.ValueAlign.MarginLeft
        };

        aryOut.push(item);
    }

    //大宗交易
    this.FormatBlockTradingText=function(data, floatPrecision, aryOut)
    {
        var item={ Title:"", Text:"大宗交易", Color:this.TextColor, ClassName:this.ValueAlign.Left };
        aryOut.push(item);

        var item={ Title:"日期",Text:IFrameSplitOperator.FormatDateString(data.Date,"YYYY-MM-DD"), Color:this.ValueColor };
        aryOut.push(item);

        var extendata = data.ExtendData;
        var item={ Title:"成交价:", Text:extendata.Price.toFixed(floatPrecision), Color:this.ValueColor };
        aryOut.push(item);

        var item={ Title:"收盘价:", Text:extendata.ClosePrice.toFixed(floatPrecision), Color:this.ValueColor };
        aryOut.push(item);

        var item={ Title:"溢折价率:", Text:extendata.Premium.toFixed(2), Color:this.GetColor(extendata.Premium,0) };
        aryOut.push(item);

        var item={ Title:"成交量:", Text:IFrameSplitOperator.FormatValueStringV2(extendata.Vol,0,2,this.LanguageID), Color:this.VolColor };
        aryOut.push(item);
    }

    //龙虎榜
    this.FormatTradeDetailText=function(data, floatPrecision, aryOut)
    {
        if (!data.ExtendData) return;
        var extendata = data.ExtendData;
        if (!IFrameSplitOperator.IsNonEmptyArray(extendata.Detail)) return;

        var item={ Title:"日期",Text:IFrameSplitOperator.FormatDateString(data.Date,"YYYY-MM-DD"), Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
        aryOut.push(item);

        for(var i=0;i<extendata.Detail.length;++i)
        {
            var resItem=extendata.Detail[i];
            if (i==0)
                var item={ Title:"上榜原因:",Text:resItem.TypeExplain, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
            else
                var item={ Title:"",Text:resItem.TypeExplain, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };

            aryOut.push(item);
        }

        if (extendata.FWeek)
        {
            var value=extendata.FWeek.Week1;
            if (IFrameSplitOperator.IsNumber(value))
            {
                var item={ Title:"一周后涨幅:",Text:`${value.toFixed(2)}%`, Color:this.GetColor(value,0), ClassName:this.ValueAlign.MarginLeft };
                aryOut.push(item);
            }

            var value=extendata.FWeek.Week4;
            if (IFrameSplitOperator.IsNumber(value))
            {
                var item={ Title:"四周后涨幅:",Text:`${value.toFixed(2)}%`, Color:this.GetColor(value,0), ClassName:this.ValueAlign.MarginLeft };
                aryOut.push(item);
            }
        }
    }

    //调研
    this.FormatResearchText=function(data,aryOut)
    {
        if (!data.ExtendData) return;
        var extendata = data.ExtendData;

        var item={ Title:"日期",Text:IFrameSplitOperator.FormatDateString(data.Date,"YYYY-MM-DD"), Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
        aryOut.push(item);

        if (IFrameSplitOperator.IsNonEmptyArray(extendata.Level))
        {
            var strLevel="";
            for(var i=0;i<extendata.Level.length;++i)
            {
                var value=extendata.Level[i];
                if (strLevel.length>0) strLevel+=",";
                if(value==0) strLevel+="证券代表";
                else if(value==1) strLevel+="董秘";
                else if(value==2) strLevel+="总经理";
                else if(value==3) strLevel+="董事长";
            }

            var item={ Title:"接待人员:",Text:strLevel, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
            aryOut.push(item);
        }
        else
        {
            var item={ Title:"接待人员",Text:"----", Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
            aryOut.push(item);
        }

        if (extendata.Type)
        {
            var item={ Title:"", Text:extendata.Type, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
            aryOut.push(item);
        }
        
    }

    //业绩预告
    this.FormatPerformanceForecastText=function(data,aryOut)
    {
        if (!data.ExtendData) return;
        var extendata = data.ExtendData;
        var reportDate=extendata.ReportDate;
        if (!reportDate) return;

        var year=parseInt(reportDate/10000);  //年份
        var day=reportDate%10000;             //日期
        var reportType="----";
        if(day == 1231) reportType = '年报';
        else if(day == 331) reportType ='一季度报';
        else if(day == 630) reportType = "半年度报";
        else if(day == 930) reportType = "三季度报";

        var item={ Title:"业绩预告:",Text:data.Title, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
        aryOut.push(item);

        var item={ Title:"年份:",Text:`${year}`, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
        aryOut.push(item);

        var item={ Title:"类型:",Text:reportType, Color:this.ValueColor, ClassName:this.ValueAlign.MarginLeft };
        aryOut.push(item);
    }

    
    /////////////////////////////////////////////////////////////////////////////////////////////
    //数据格式化
    this.ForamtPrice=function(price, yClose, defaultfloatPrecision, TitleID)
    {
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID, this.LanguageID),
            Text:"--.--",
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(price)) return item;
        
        item.Text=price.toFixed(defaultfloatPrecision);
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

    this.FormatIncrease=function(price, yClose, defaultfloatPrecision, TitleID)
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
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(price) || !IFrameSplitOperator.IsNumber(yClose)) return item;

        var value=price-yClose;
        item.Text=`${value.toFixed(defaultfloatPrecision)}`;
        item.Color=this.GetColor(value,0);

        return item;
    }

    this.FormatAmplitude=function(high, low, yClose, defaultfloatPrecision, TitleID)
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
        var value=(diffValue)/yClose;
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
            if (ChartData.IsMinutePeriod(period,true)) format='HH:MM'; // 分钟周期
            else if (ChartData.IsSecondPeriod(period)) format='HH:MM:SS';
            else if (ChartData.IsMilliSecondPeriod(period)) format='HH:MM:SS.fff';
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

    this.GetColor=function(price,yClose)
    {
        if(price>yClose) return this.UpColor;
        else if (price<yClose) return this.DownColor;
        else return this.UnchangeColor;
    }


    //配色修改
    this.ReloadResource=function(option)
    {
        this.UpColor=g_JSChartResource.UpTextColor;
        this.DownColor=g_JSChartResource.DownTextColor;
        this.UnchangeColor=g_JSChartResource.UnchagneTextColor;
    
        this.BGColor=g_JSChartResource.FloatTooltip.BGColor;
        this.BorderColor=g_JSChartResource.FloatTooltip.BorderColor;
    
        this.TextColor=g_JSChartResource.FloatTooltip.TextColor;
        this.ValueColor=g_JSChartResource.FloatTooltip.ValueColor;
    
        this.VolColor=g_JSChartResource.FloatTooltip.VolColor;
        this.AmountColor=g_JSChartResource.FloatTooltip.AmountColor;
        this.TurnoverRateColor=g_JSChartResource.FloatTooltip.TurnoverRateColor;
        this.PositionColor=g_JSChartResource.FloatTooltip.PositionColor;
        this.DateTimeColor=g_JSChartResource.FloatTooltip.DateTimeColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();
    }
}