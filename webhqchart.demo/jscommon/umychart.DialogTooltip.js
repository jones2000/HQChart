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
    this.MaxRowCount=20;

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

    this.Show=function(x, y)
    {
        if (!this.DivDialog) return;
        if (!this.HQChart) return;

        var rtClient=this.HQChart.UIElement.getBoundingClientRect();
        var left=x+rtClient.left,top=y+rtClient.top;
        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=left-this.DivDialog.offsetWidth;
        if ((bottom+5)>=window.innerHeight) top=0;
       
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
    
            if (tooltipData.Type==0)
            {
                this.UpdateKLineToolitp(data);
            }
        }
        else if (data.DataType==2)  //更新实时行情数据
        {
            this.UpdateRealtimeHQTooltip(data);
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
            bUpdata=true;
        }

        if (bUpdata) 
        {
            this.UpdateTableDOM();
        }
    }

    this.UpdateKLineToolitp=function(data)
    {
        var tooltipData=data.Tooltip;
        var symbol=data.Symbol;
        var name=data.Name;
        var bOverlay=false; //是否是叠加指标
        if (tooltipData.ChartPaint.Name=="Overlay-KLine")
        {
            symbol=tooltipData.ChartPaint.Symbol;
            name=tooltipData.ChartPaint.Title;
            bOverlay=true;
        }

        var kItem={ Symbol:symbol, Name:name, Item:CloneData(tooltipData.Data), IsOverlay:bOverlay };
        var strKItem=JSON.stringify(kItem);
        var bUpdata=false;
        if (this.KItemCacheID!=strKItem)    //数据变动的才更新
        {
            this.KItemCache= kItem;
            this.KItemCacheID=strKItem;
            bUpdata=true;
        }
        
        if (bUpdata) 
        {
            this.UpdateTableDOM();
        }

        if (data.Point)
        {
            var x=data.Point.X;
            var y=data.Point.Y+data.Point.YMove;
            this.Show(x, y);
        }
    }

    this.UpdateTableDOM=function()
    {
        if (!this.KItemCache) return;

        if (this.HQChart.ClassName=='KLineChartContainer')
            this.AryText=this.GetFormatKLineTooltipText(this.KItemCache);
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

            if (outItem.ClassName) 
            {
                item.TextSpan.className=outItem.ClassName;
            }
            else
            {
                if (item.TextSpan.className!="UMyChart_Tooltip_Float_Text_Span") item.TextSpan.className="UMyChart_Tooltip_Float_Text_Span"
            }
           
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

    this.GetFormatKLineTooltipText=function(kItem)
    {
        var data=kItem.Item;
        var symbol=kItem.Symbol;
        var upperSymbol=symbol.toUpperCase();
        var defaultfloatPrecision=GetfloatPrecision(symbol);//价格小数位数

        //日期
        var dateItem=this.ForamtDate(data.Date,"YYYY/MM/DD/W",'FloatTooltip-Date' );

        //时间
        var timeItem=null;
        if (IFrameSplitOperator.IsNumber(data.Time)) timeItem=this.FormatTime(data.Time, this.HQChart.Period, null, 'FloatTooltip-Time');

        var overlayItem=null;
        if (kItem.IsOverlay)
            overlayItem={ Title:"", Text:kItem.Name, Color:this.TextColor, ClassName:"UMyChart_Tooltip_Float_Text2_Span" };
        
        
        var yClose=data.YClose; //昨收价|昨结算价
        var aryText=
        [
            this.ForamtPrice(data.Open,yClose, defaultfloatPrecision,'FloatTooltip-Open'),
            this.ForamtPrice(data.High,yClose, defaultfloatPrecision,'FloatTooltip-High'),
            this.ForamtPrice(data.Low,yClose, defaultfloatPrecision,'FloatTooltip-Low'),
            this.ForamtPrice(data.Close,yClose, defaultfloatPrecision,'FloatTooltip-Close'),
            this.ForamtPrice(data.YClose,data.YClose, defaultfloatPrecision,'FloatTooltip-YClose'),
            this.FormatVol(data.Vol,'FloatTooltip-Vol' ),
            this.FormatAmount(data.Amount,'FloatTooltip-Amount' ),
            this.FormatIncrease(data.Close,yClose,defaultfloatPrecision,'FloatTooltip-Increase'),
            this.FormatAmplitude(data.High,data.Low,yClose,defaultfloatPrecision,'FloatTooltip-Amplitude'), 
        ];

        if (timeItem) aryText.unshift(timeItem);
        aryText.unshift(dateItem);
        if (overlayItem) aryText.unshift(overlayItem);
        
        //换手率
        if (MARKET_SUFFIX_NAME.IsSHSZStockA(upperSymbol) && data.FlowCapital>0)
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