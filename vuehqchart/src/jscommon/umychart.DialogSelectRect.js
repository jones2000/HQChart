
/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   内置区间统计框 设置框
*/



function JSDialogSelectRect()
{
    this.DivDialog=null;
    this.DragTitle=null;
    this.HQChart=null;

    this.UpColor=g_JSChartResource.UpTextColor;
    this.DownColor=g_JSChartResource.DownTextColor;
    this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

    this.TitleColor=g_JSChartResource.DialogSelectRect.TitleColor;
    this.TitleBGColor=g_JSChartResource.DialogSelectRect.TitleBGColor;
    this.BGColor=g_JSChartResource.DialogSelectRect.BGColor;
    this.BorderColor=g_JSChartResource.DialogSelectRect.BorderColor;

    this.TextColor=g_JSChartResource.DialogSelectRect.TextColor;
    this.ValueColor=g_JSChartResource.DialogSelectRect.ValueColor;

    this.VolColor=g_JSChartResource.DialogSelectRect.VolColor;
    this.AmountColor=g_JSChartResource.DialogSelectRect.AmountColor;
    this.TurnoverRateColor=g_JSChartResource.DialogSelectRect.TurnoverRateColor;
    this.PositionColor=g_JSChartResource.DialogSelectRect.PositionColor;
    

    this.MaxRowCount=10;
    this.AryData=[];
    this.DateTimeBox={ Start:{ SpanText:null, SpanValue:null }, End:{ SpanText:null, SpanValue:null } };
    this.ShowData;
    this.SelectData;

    this.RestoreFocusDelay=800;

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;
        if (option)
        {
            
        }
    }

    this.Destroy=function()
    {
        this.AryData=[];
        this.ShowData=null;
        this.DateTimeBox={ Start:{ SpanText:null, SpanValue:null }, End:{ SpanText:null, SpanValue:null } };

        if (this.DivDialog) 
        {
            document.body.removeChild(this.DivDialog);
            this.DivDialog=null;
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement("div");
        divDom.className='UMyChart_SelectRect_Dialog_Div';

        var divTitle=document.createElement("div");
        divTitle.className='UMyChart_SelectRect_Title_Div';
        divTitle.onmousedown=(e)=>{   this.OnMouseDownTitle(e);}

        var divName=document.createElement("div");
        divName.className='UMyChart_SelectRect_Name_Div';
        divName.innerText="区间统计";
        divTitle.appendChild(divName);

        var divClose=document.createElement("div");
        divClose.className='UMyChart_SelectRect_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.Close(e); }
        divTitle.appendChild(divClose);

        divDom.appendChild(divTitle);

        var divDateTime=document.createElement("div");
        divDateTime.className='UMyChart_SelectRect_DateTime_Div';

        //起始日期
        var divStartDate=document.createElement("div");
        divDateTime.append(divStartDate);
        var spanText=document.createElement("span");
        spanText.className="UMyChart_SelectRect_DateTitle_Span";
        spanText.innerText="开始:";
        divStartDate.appendChild(spanText);
        this.DateTimeBox.Start.SpanText=spanText;

        var spanDate=document.createElement("span");
        spanDate.className="UMyChart_SelectRect_DateValue_Span";
        spanDate.innerText="--/--";
        divStartDate.appendChild(spanDate);
        this.DateTimeBox.Start.SpanValue=spanDate;

        var spanArrow=document.createElement("span");
        spanArrow.className="UMyChart_SelectRect_ArrowButton_Span";
        spanArrow.innerText="<";
        spanArrow.onmousedown=(e)=>{ this.MoveStartDate(-1); }
        divStartDate.appendChild(spanArrow);

        var spanArrow=document.createElement("span");
        spanArrow.className="UMyChart_SelectRect_ArrowButton_Span";
        spanArrow.innerText=">";
        spanArrow.onmousedown=(e)=>{ this.MoveStartDate(1); }
        divStartDate.appendChild(spanArrow);

        //结束日期
        var divEndDate=document.createElement("div");
        divDateTime.append(divEndDate);
        var spanText=document.createElement("span");
        spanText.className="UMyChart_SelectRect_DateTitle_Span";
        spanText.innerText="结束:";
        divEndDate.appendChild(spanText);
        this.DateTimeBox.End.SpanText=spanText;

        var spanDate=document.createElement("span");
        spanDate.className="UMyChart_SelectRect_DateValue_Span";
        spanDate.innerText="--/--";
        divEndDate.appendChild(spanDate);
        this.DateTimeBox.SpanEnd=spanDate;
        this.DateTimeBox.End.SpanValue=spanDate;

        var spanArrow=document.createElement("span");
        spanArrow.className="UMyChart_SelectRect_ArrowButton_Span";
        spanArrow.innerText="<";
        spanArrow.onmousedown=(e)=>{ this.MoveEndDate(-1); }
        divEndDate.appendChild(spanArrow);

        var spanArrow=document.createElement("span");
        spanArrow.className="UMyChart_SelectRect_ArrowButton_Span";
        spanArrow.innerText=">";
        spanArrow.onmousedown=(e)=>{ this.MoveEndDate(1); }
        divEndDate.appendChild(spanArrow);

        divDom.appendChild(divDateTime);


        var table=document.createElement("table");
        table.className="UMyChart_SelectRect_Table";
        divDom.appendChild(table);

        var tbody=document.createElement("tbody");
        tbody.className="UMyChart_SelectRect_Tbody";
        table.appendChild(tbody);


        for(var i=0;i<this.MaxRowCount;++i)
        {
            var rowItem={ Tr:null, AryItem:[] };

            var trDom=document.createElement("tr");
            trDom.className='UMyChart_SelectRect_Tr';
            tbody.appendChild(trDom);
            rowItem.Tr=trDom;

            for(var j=0;j<3;++j)
            {
                var item={ Td:null, LeftSpan:null, RightSpan:null };
                var tdDom=document.createElement("td");
                tdDom.className="UMyChart_SelectRect_Td";   //标题+数值
                item.Td=tdDom;
                trDom.appendChild(tdDom);

                var spanDom=document.createElement("span");
                spanDom.className='UMyChart_SelectRect_Item_Left_Span';
                spanDom.innerText='数值';
                item.LeftSpan=spanDom;
                tdDom.appendChild(spanDom);
                

                var spanDom=document.createElement("span");
                spanDom.className='UMyChart_SelectRect_Item_Right_Span';
                spanDom.innerText='--';
                item.RightSpan=spanDom;
                tdDom.appendChild(spanDom);

                rowItem.AryItem.push(item);
            }
                
            this.AryData.push(rowItem);
        }

        document.body.appendChild(divDom);

        this.DivDialog=divDom;

        this.UpdateStyle();
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style.visibility='hidden';
        this.ShowData=null;
        this.SelectData=null;

        if (this.HQChart) this.HQChart.RestoreFocus(this.RestoreFocusDelay);
    }

    this.MoveStartDate=function(step)
    {
        if (!this.DivDialog || !this.HQChart) return;
        if (step==0) return;
        if (!this.SelectData) return;

        var selectData=this.SelectData;
        var bUpdate=false;
        if (step>0)
        {
            var index=selectData.Start;
            var endIndex=selectData.End;
            for(i=0; i<step && index<endIndex; ++i)
            {
                ++index;
            }

            if (selectData.Start!=index)
            {
                selectData.Start=index;
                bUpdate=true;
            }
        }
        else
        {
            step=Math.abs(step);
            var index=selectData.Start
            var endIndex=selectData.End;
            for(var i=0;i<step && index>0;++i)
            {
                --index;
            }

            if (selectData.Start!=index)
            {
                selectData.Start=index;
                bUpdate=true;
            }
        }

        if (bUpdate) this.UpdateSelectRect(selectData);
    }

    this.MoveEndDate=function(step)
    {
        if (!this.DivDialog) return;
        if (step==0) return;
        if (!this.SelectData) return;

        var selectData=this.SelectData;
        var bUpdate=false;

        if (step>0)
        {
            var index=selectData.End;
            var startIndex=selectData.Start;
            for(i=0; i<step && index<this.ShowData.DataCount; ++i)
            {
                ++index;
            }

            if (selectData.End!=index)
            {
                selectData.End=index;
                bUpdate=true;
            }
        }
        else
        {
            step=Math.abs(step);
            var index=selectData.End;
            var startIndex=selectData.Start;
            for(var i=0;i<step && index>startIndex;++i)
            {
                --index;
            }

            if (selectData.End!=index)
            {
                selectData.End=index;
                bUpdate=true;
            }
        }

        if (bUpdate) this.UpdateSelectRect(selectData);
    }

    this.Show=function(x,y)
    {
        if (!this.DivDialog) return;
        if (!this.HQChart) return;

        /*
        if (!this.DivDialog.style.top || !this.DivDialog.style.left)    //上一次显示的位置
        {
            var top=this.HQChart.Frame.ChartBorder.GetTop();
            var left=this.HQChart.Frame.ChartBorder.GetLeft();
           
    
            var x=left+rtClient.left+5;
            var y=top+rtClient.top+10;
            this.DivDialog.style.top = y + "px";
            this.DivDialog.style.left = x + "px";
        }
        */

        if (this.HQChart) this.HQChart.ClearRestoreFocusTimer();
        
        var top=this.HQChart.Frame.ChartBorder.GetTop();
        var left=this.HQChart.Frame.ChartBorder.GetLeft();
        var rtClient=this.HQChart.UIElement.getBoundingClientRect();

        left=left+rtClient.left+5;
        top=top+rtClient.top+10;
        if (IFrameSplitOperator.IsNumber(x) && IFrameSplitOperator.IsNumber(y))
        {
            left=x;
            top=y;
        }

        var right=x+this.DivDialog.offsetWidth;
        var bottom=y+ this.DivDialog.offsetHeight;

        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=window.innerHeight) top=window.innerHeight-this.DivDialog.offsetHeight-5;

        this.DivDialog.style.top = top + "px";
        this.DivDialog.style.left = left + "px";
        this.DivDialog.style.visibility='visible';
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
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


    //配色修改
    this.ReloadResource=function(option)
    {
        this.UpColor=g_JSChartResource.UpTextColor;
        this.DownColor=g_JSChartResource.DownTextColor;
        this.UnchangeColor=g_JSChartResource.UnchagneTextColor;

        this.TitleColor=g_JSChartResource.DialogSelectRect.TitleColor;
        this.TitleBGColor=g_JSChartResource.DialogSelectRect.TitleBGColor;
        this.BGColor=g_JSChartResource.DialogSelectRect.BGColor;
        this.BorderColor=g_JSChartResource.DialogSelectRect.BorderColor;

        this.TextColor=g_JSChartResource.DialogSelectRect.TextColor;
        this.ValueColor=g_JSChartResource.DialogSelectRect.ValueColor;

        this.VolColor=g_JSChartResource.DialogSelectRect.VolColor;
        this.AmountColor=g_JSChartResource.DialogSelectRect.AmountColor;
        this.TurnoverRateColor=g_JSChartResource.DialogSelectRect.TurnoverRateColor;
        this.PositionColor=g_JSChartResource.DialogSelectRect.PositionColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();

        if (this.SelectData)
        {
            var selectData=this.SelectData;
            this.HQChart.UpdateSelectRect(selectData.Start,selectData.End);
            var showData=this.CalculateKLineData({ SelectData:selectData });
            this.FormatKLineText(showData);
            this.ShowData=showData;
            this.UpdateTableDOM(showData);
        }
        
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.DateTimeBox.Start)
        {
            var item=this.DateTimeBox.Start;
            item.SpanText.style["color"]=this.TextColor;
            item.SpanValue.style["color"]=this.ValueColor;
        }

        if (this.DateTimeBox.End)
        {
            var item=this.DateTimeBox.End;
            item.SpanText.style["color"]=this.TextColor;
            item.SpanValue.style["color"]=this.ValueColor;
        }

        //if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
    }


    this.UpdateTableDOM=function(showData)
    {
        var index=0;
        for(var index=0,j=0, dataIndex=0;index<this.AryData.length && dataIndex<showData.AryText.length;++index)
        {
            var rowItem=this.AryData[index];
            for(j=0;j<rowItem.AryItem.length;++j, ++dataIndex)
            {
                if (dataIndex>=showData.AryText.length) break;

                var item=rowItem.AryItem[j]
                var outItem=showData.AryText[dataIndex];

                item.LeftSpan.innerText=outItem.Title;
                item.LeftSpan.style.color=this.TextColor;

                item.RightSpan.innerText=outItem.Text;
                item.RightSpan.style.color=outItem.Color;
            }
            rowItem.Tr.style.display="";
        }

        for(; index<this.AryData.length;++index)
        {
            var rowItem=this.AryData[index];
            rowItem.Tr.style.display="none";
        }

        if (this.DateTimeBox.Start.SpanValue) this.DateTimeBox.Start.SpanValue.innerText=showData.Date.Start.Text;
        if (this.DateTimeBox.End.SpanValue) this.DateTimeBox.End.SpanValue.innerText=showData.Date.End.Text;
    }

    this.UpdateSelectRect=function(selectData)
    {
        this.HQChart.UpdateSelectRect(selectData.Start,selectData.End);
        var showData=null;
        if (this.HQChart.ClassName=='KLineChartContainer')
        {
            showData=this.CalculateKLineData({ SelectData:selectData });
            this.FormatKLineText(showData);
        }
        else if (this.HQChart.ClassName=='MinuteChartContainer')
        {
            showData=this.CalculateMinuteData({ SelectData:selectData });
            this.FormatMinuteText(showData);
        }
        
        if (showData)
        {
            this.ShowData=showData;
            this.UpdateTableDOM(showData);
        }
    }


    this.Update=function(data)
    {
        if (!this.DivDialog) return;

        var showData;
        if (this.HQChart.ClassName=='KLineChartContainer')
        {
            showData=this.CalculateKLineData(data);
            this.FormatKLineText(showData);
        }
        else if (this.HQChart.ClassName=='MinuteChartContainer')
        {
            showData=this.CalculateMinuteData(data);
            this.FormatMinuteText(showData);
        }

        if (!showData) return;

        this.ShowData=showData;
        this.SelectData=data.SelectData;
        this.UpdateTableDOM(showData);

        if (!this.IsShow()) this.Show(data.X, data.Y);
    }

    this.CreateEmptyShowData=function()
    {
        var showData=
        {
            Open:null,Close:null,High:null,Low:null, YClose:null,
            Vol:0, Amount:0, 
            Date:
            { 
                Start:{ Time:null, Date:null, Text:"" },
                End:{ Time:null, Date:null, Text:"" }
            }, 
            Count:0,
            KLine:{ Up:0,Down:0,Unchanged:0 },    //阳线|阴线|平线

            AryText:[],

            DataCount:0,
        };

        return showData;
    }

    this.CalculateKLineData=function(data)
    {
        var selectData=data.SelectData;
        var hisData=selectData.Data;
        var start=selectData.Start;
        var end=selectData.End;

        var showData=this.CreateEmptyShowData();
        showData.DataCount=hisData.Data.length;

        for(var i=start;i<hisData.Data.length && i<=end;++i)
        {
            var item=hisData.Data[i];
            ++showData.Count;

            if (!IFrameSplitOperator.IsNumber(showData.Open) && IFrameSplitOperator.IsNumber(item.Open)) showData.Open=item.Open;
            if (IFrameSplitOperator.IsNumber(item.Close)) showData.Close=item.Close;

            if (IFrameSplitOperator.IsNumber(item.Vol)) showData.Vol+=item.Vol;
            if (IFrameSplitOperator.IsNumber(item.Amount)) showData.Amount+=item.Amount;

            if (IFrameSplitOperator.IsNumber(item.High))
            {
                if (!IFrameSplitOperator.IsNumber(showData.High) || showData.High<item.High) 
                    showData.High=item.High;
            }
                
            if (IFrameSplitOperator.IsNumber(item.Low))
            {
                if (!IFrameSplitOperator.IsNumber(showData.Low) || showData.Low>item.Low) 
                    showData.Low=item.Low;
            } 

            if (IFrameSplitOperator.IsNumber(item.Open) && IFrameSplitOperator.IsNumber(item.Close))
            {
                if (item.Close>item.Open) ++showData.KLine.Up;
                else if (item.Close<item.Open) ++showData.KLine.Down;
                else ++showData.KLine.Unchanged;
            }

            if (IFrameSplitOperator.IsNumber(item.Date))
            {
                showData.Date.End.Date=item.Date;
                if (!IFrameSplitOperator.IsNumber(showData.Date.Start.Date)) showData.Date.Start.Date=item.Date;
            }

            if (IFrameSplitOperator.IsNumber(item.Time))
            {
                showData.Date.End.Time=item.Time;
                if (!IFrameSplitOperator.IsNumber(showData.Date.Start.Time)) showData.Date.Start.Time=item.Time;
            }
        }

        return showData;
    }

    //格式化K线数据
    this.FormatKLineText=function(showData)
    {
        if (!showData) return;

        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);

        if (ChartData.IsMinutePeriod(this.HQChart.Period,true))
        {
            showData.Date.Start.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.Start.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.Start.Time,"HH:MM")}`;
            showData.Date.End.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.End.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.End.Time,"HH:MM")}`;
        }
        else if (ChartData.IsSecondPeriod(this.HQChart.Period) || ChartData.IsTickPeriod(this.HQChart.Period))
        {
            showData.Date.Start.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.Start.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.Start.Time,"HH:MM:SS")}`;
            showData.Date.End.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.End.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.End.Time,"HH:MM:SS")}`;
        }
        else
        {
            showData.Date.Start.Text=IFrameSplitOperator.FormatDateString(showData.Date.Start.Date);
            showData.Date.End.Text=IFrameSplitOperator.FormatDateString(showData.Date.End.Date);
        }

        showData.AryText.push(this.ForamtPrice(showData.Open, showData.Open,defaultfloatPrecision, 'DialogSelectRect-StartPrice'));
        showData.AryText.push(this.ForamtPrice(showData.Close, showData.Open,defaultfloatPrecision, 'DialogSelectRect-EndPrice'));
        showData.AryText.push(this.FormatIncrease(showData.Close, showData.Open, 'DialogSelectRect-Increase'));

        showData.AryText.push(this.ForamtPrice(showData.High, showData.Open,defaultfloatPrecision, 'DialogSelectRect-High'));
        showData.AryText.push(this.ForamtPrice(showData.Low, showData.Open,defaultfloatPrecision, 'DialogSelectRect-Low'));
        showData.AryText.push(this.FormatAmplitude(showData.High, showData.Low, showData.Open, 'DialogSelectRect-Amplitude'));

        showData.AryText.push(this.FormatVol(showData.Vol, 'DialogSelectRect-Vol'));
        showData.AryText.push(this.FormatAmount(showData.Amount, 'DialogSelectRect-Amount'));
        showData.AryText.push(this.FormatNumber(showData.Count, null, 0, "DialogSelectRect-DataCount"));

        showData.AryText.push(this.FormatNumber(showData.KLine.Up, this.UpColor, 0, 'DialogSelectRect-Up'));
        showData.AryText.push(this.FormatNumber(showData.KLine.Down, this.DownColor, 0, 'DialogSelectRect-Down'));
        showData.AryText.push(this.FormatNumber(showData.KLine.Unchanged, this.UnchangeColor, 0, 'DialogSelectRect-Unchanged'));
    }


    this.CalculateMinuteData=function(data)
    {
        var selectData=data.SelectData;
        var hisData=selectData.Data;
        var start=selectData.Start;
        var end=selectData.End;

        var showData=this.CreateEmptyShowData();
        showData.DataCount=hisData.Data.length;

        for(var i=start;i<hisData.Data.length && i<=end;++i)
        {
            var item=hisData.Data[i];
            ++showData.Count;

            if (!IFrameSplitOperator.IsNumber(showData.Open) && IFrameSplitOperator.IsNumber(item.Open)) showData.Open=item.Open;
            if (IFrameSplitOperator.IsNumber(item.Close)) showData.Close=item.Close;

            if (IFrameSplitOperator.IsNumber(item.Vol)) showData.Vol+=item.Vol;
            if (IFrameSplitOperator.IsNumber(item.Amount)) showData.Amount+=item.Amount;

            if (IFrameSplitOperator.IsNumber(item.High))
            {
                if (!IFrameSplitOperator.IsNumber(showData.High) || showData.High<item.High) 
                    showData.High=item.High;
            }
                
            if (IFrameSplitOperator.IsNumber(item.Low))
            {
                if (!IFrameSplitOperator.IsNumber(showData.Low) || showData.Low>item.Low) 
                    showData.Low=item.Low;
            } 

            if (IFrameSplitOperator.IsNumber(item.Open) && IFrameSplitOperator.IsNumber(item.Close))
            {
                if (item.Close>item.Open) ++showData.KLine.Up;
                else if (item.Close<item.Open) ++showData.KLine.Down;
                else ++showData.KLine.Unchanged;
            }

            if (IFrameSplitOperator.IsNumber(item.Date))
            {
                showData.Date.End.Date=item.Date;
                if (!IFrameSplitOperator.IsNumber(showData.Date.Start.Date)) showData.Date.Start.Date=item.Date;
            }

            if (IFrameSplitOperator.IsNumber(item.Time))
            {
                showData.Date.End.Time=item.Time;
                if (!IFrameSplitOperator.IsNumber(showData.Date.Start.Time)) showData.Date.Start.Time=item.Time;
            }
        }
        
        return showData;      
    }

    this.FormatMinuteText=function(showData)
    {
        if (!showData) return;

        var defaultfloatPrecision=GetfloatPrecision(this.HQChart.Symbol);
        
        showData.Date.Start.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.Start.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.Start.Time,"HH:MM")}`;
        showData.Date.End.Text=`${IFrameSplitOperator.FormatDateString(showData.Date.End.Date)} ${IFrameSplitOperator.FormatTimeString(showData.Date.End.Time,"HH:MM")}`;
        
        showData.AryText.push(this.ForamtPrice(showData.Open, showData.Open,defaultfloatPrecision, 'DialogSelectRect-StartPrice'));
        showData.AryText.push(this.ForamtPrice(showData.Close, showData.Open,defaultfloatPrecision, 'DialogSelectRect-EndPrice'));
        showData.AryText.push(this.FormatIncrease(showData.Close, showData.Open, 'DialogSelectRect-Increase'));

        showData.AryText.push(this.ForamtPrice(showData.High, showData.Open,defaultfloatPrecision, 'DialogSelectRect-High'));
        showData.AryText.push(this.ForamtPrice(showData.Low, showData.Open,defaultfloatPrecision, 'DialogSelectRect-Low'));
        showData.AryText.push(this.FormatAmplitude(showData.High, showData.Low, showData.Open, 'DialogSelectRect-Amplitude'));

        showData.AryText.push(this.FormatVol(showData.Vol, 'DialogSelectRect-Vol'));
        showData.AryText.push(this.FormatAmount(showData.Amount, 'DialogSelectRect-Amount'));
        showData.AryText.push(this.FormatNumber(showData.Count, null, 0, "DialogSelectRect-DataCount"));
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

    this.FormatEmpty=function()
    {
        var item=
        { 
            Title:"",
            Text:"",
            Color:this.ValueColor
        };

        return item;
    }

    this.FormatNumber=function(value, color, defaultfloatPrecision, TitleID, format)
    {
        var item=
        { 
            Title:g_JSChartLocalization.GetText(TitleID, this.LanguageID),
            Text:"----",
            Color:this.ValueColor
        };

        if (!IFrameSplitOperator.IsNumber(value)) return item;

        item.Text=value.toFixed(defaultfloatPrecision);
        if (color) item.Color=color;

        return item;
    }

    
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

    this.FormatIncrease=function(price, yClose, TitleID,)
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
        var value=(diffValue)/yClose;
        item.Text=`${(value*100).toFixed(2)}%`;
       
        item.Color=this.GetColor(value,0);

        return item;
    }

    this.FormatAmplitude=function(high, low, yClose, TitleID)
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

}




