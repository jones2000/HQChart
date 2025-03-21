/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com

   K线点击弹出指定日期分时图
*/


function JSPopMinuteChart()
{
    this.DivDialog=null;
    this.TitleBox=null; //{ DivTitle, DivName, DivName }
    this.HQChart=null;
    this.DragTitle=null;
    this.Date=null;
    this.ID=Guid();

    this.TitleColor=g_JSChartResource.PopMinuteChart.TitleColor;
    this.TitleBGColor=g_JSChartResource.PopMinuteChart.TitleBGColor;
    this.BGColor=g_JSChartResource.PopMinuteChart.BGColor;
    this.BorderColor=g_JSChartResource.PopMinuteChart.BorderColor;

    this.Minute=
    {
        Option:JSPopMinuteChart.GetMinuteOption(),
        JSChart:null,
        Date:null,
        Symbol:null,
        Name:null,
        Chart:null,
    }

    this.ClearCache=function()
    {
        this.Minute.Date=null;
        this.Minute.Symbol=null;
        this.Minute.Name=null;
        this.Minute.Chart=null;
    }

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;

        if (option)
        {
            if (IFrameSplitOperator.IsObject(option.Option)) 
            {
                var item=CloneData(option.Option);  //复制一份出来
                this.Minute.Option=Object.assign(this.Minute.Option,item);
            }

            if (option.EnableMarkBG)    //标记背景
            {
                this.HQChart.CreateExtendChart("MarkPopMinutePaint");
            }
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement('div');
        divDom.className='jchart_pop_minute_dailog';
        divDom.id=this.ID;

        var divTitle=document.createElement("div");
        divTitle.className='jschart_pop_minute_chart_Title_Div';
        divTitle.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }
        divDom.appendChild(divTitle);
       
        var divInfoText=document.createElement("div");
        divInfoText.className="jschart_pop_minute_chart_Title";
        divInfoText.innerText="分时图";
        this.DivInfoText=divInfoText;
        divTitle.appendChild(divInfoText);

        var divClose=document.createElement("div");
        divClose.className='jschart_pop_minute_chart_Close_Div';
        divClose.innerText="x";
        divClose.onmousedown=(e)=>{ this.Close(e); }
        divTitle.appendChild(divClose);


        var divChart=document.createElement('div');
        divChart.className='jschart_pop_minute_chart';
        divDom.appendChild(divChart);

        this.TitleBox={ DivTitle:divTitle, DivName:divInfoText, DivColor:divClose };
        this.DivDialog=divDom;

        var chart=JSChart.Init(divChart);
        this.Minute.JSChart=chart;
        //语言跟主图保持一致
        if (this.HQChart) this.Minute.Option.Language=g_JSChartLocalization.GetLanguageName(this.HQChart.LanguageID);
        this.Minute.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Minute.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }

        var keyDownEvent=
        {
            event:JSCHART_EVENT_ID.ON_KEYDOWN,  //键盘消息
            callback:(event, data, obj)=>{ this.OnKeyDown(event, data, obj); }
        };

        if (Array.isArray(this.Minute.Option.EventCallback))
        {
            this.Minute.Option.EventCallback.push(keyDownEvent);
        }
        else
        {
            this.Minute.Option.EventCallback=[keyDownEvent];
        }
        
        chart.SetOption(this.Minute.Option);  //设置K线配置

        document.body.appendChild(divDom);

        this.UpdateStyle();
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;

        if (this.TitleBGColor) this.TitleBox.DivTitle.style['background-color']=this.TitleBGColor;
        if (this.TitleColor) this.TitleBox.DivName.style['color']=this.TitleColor;
    }

    this.NetworkFilter=function(data, callback)
    {
        if (!this.HQChart || !this.HQChart.NetworkFilter) return;

        if (data) data.PopMinuteData={ Date:this.Date };    //弹出分时图额外数据
        
        if (data.Name== 'MinuteChartContainer::RequestMinuteData')  //分时图数据对接
        {
            data.Request.Data.date=this.Date;
            data.Name="MinuteChartContainer::RequestPopMinuteData";
            data.Explain="指定日期分时数据"
        };

        this.HQChart.NetworkFilter(data, callback);       
    }

    this.OnCreateHQChart=function(chart)
    {

    }

    this.Destroy=function()
    {
        if (this.DivDialog) document.body.removeChild(this.DivDialog);
        this.DivDialog=null;
        this.TitleBox=null;
        this.Minute.JSChart=null;
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }

    this.Show=function(data, x,y)
    {
        if (!this.DivDialog) this.Create();
        if (!data.Symbol || !IFrameSplitOperator.IsPlusNumber(data.Date)) return;

        this.Date=data.Date;
        this.Symbol=this.Name=data.Symbol;
        if (data.Name) this.Name=data.Name;
        this.Chart=data.Chart;
       
        this.UpdateDialogTitle();

        if (this.Minute.JSChart)
        {
            this.Minute.JSChart.ChangeSymbol(this.Symbol);
            this.MarkKLineBG();
        }

        if (!this.Minute.Option.EnableResize)
        {
            if (this.Minute.JSChart) this.Minute.JSChart.OnSize();
        }

        

        //超出窗口调整位置
        var height=this.DivDialog.offsetHeight;
        var width=this.DivDialog.offsetWidth;
        var xRight=window.innerWidth-5;
        var ybottom=window.innerHeight-5;
        if (x+width>xRight) x=xRight-width;
        if (y+height>ybottom) y=ybottom-height;

        this.DivDialog.style.visibility='visible';
        this.DivDialog.style.top = y + "px";
        this.DivDialog.style.left = x + "px";
    }

    this.UpdateDialogTitle=function()
    {
        var title=`${this.Name} ${IFrameSplitOperator.FormatDateString(this.Date)} 分时图 PageUp/PageDown翻页`;
        this.TitleBox.DivName.innerText=title;
    }

    this.Close=function(e)
    {
        if (!this.DivDialog) return;

        this.ClearCache();
        this.DivDialog.style.visibility='hidden';
        this.ClearMarkKLineBG();
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

    this.ReloadResource=function(option)
    {
        this.TitleColor=g_JSChartResource.PopMinuteChart.TitleColor;
        this.TitleBGColor=g_JSChartResource.PopMinuteChart.TitleBGColor;
        this.BGColor=g_JSChartResource.PopMinuteChart.BGColor;
        this.BorderColor=g_JSChartResource.PopMinuteChart.BorderColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();

        if (this.Minute.JSChart) this.Minute.JSChart.ReloadResource(option);
    }

    this.SetLanguage=function(language)
    {
        if (!this.DivDialog) return;

        if (this.Minute.JSChart) this.Minute.JSChart.SetLanguage(language);
    }


    this.OnKeyDown=function(event, data, obj)
    {
        switch(data.KeyID)
        {
            case 33:    //page up
                data.PreventDefault=true;
                var item=this.GetNextData(1);
                if (item) this.ChangeSymbol(item.Symbol, item.Date);
                break;
            case 34:    //page down
                data.PreventDefault=true;
                var item=this.GetNextData(-1);
                if (item) this.ChangeSymbol(item.Symbol, item.Date);
                break;
            default:
                return;
        }
    }

    this.GetNextData=function(step)
    {
        if (!this.Chart) return null;
        if (!IFrameSplitOperator.IsNumber(this.Date)) return null;
        if (step==0) return null;

        var kData=this.Chart.Data;
        if (!kData || !IFrameSplitOperator.IsNonEmptyArray(kData.Data)) return null;

        var index=-1;
        for(var i=0;i<kData.Data.length;++i)
        {
            var kItem=kData.Data[i];
            if (!kItem) continue;

            if (kItem.Date==this.Date)
            {
                index=i;
                break;
            }
        }

        if (index<0) return null;

        var date=null;
        var symbol=null;
        if (step>0)
        {
            for(var i=1, j=0;j<step && index+i<kData.Data.length;++i)
            {
                var kItem=kData.Data[index+i];
                if (!kItem || !IFrameSplitOperator.IsNumber(kItem.Date)) continue;

                date=kItem.Date;
                if (kItem.Symbol) symbol=kItem.Symbol;
                else symbol=null;
                ++j;
            }
        }
        else
        {
            step=Math.abs(step);
            for(var i=1, j=0;j<step && index-i>=0;++i)
            {
                var kItem=kData.Data[index-i];
                if (!kItem || !IFrameSplitOperator.IsNumber(kItem.Date)) continue;

                date=kItem.Date;
                if (kItem.Symbol) symbol=kItem.Symbol;
                else symbol=null;
                ++j;
            }
        }

        if (date==this.Date) return null;

        return { Date:date, Symbol:symbol };
    }

    //修改日期
    this.ChangeSymbol=function(symbol, date)
    {
        if (!this.Minute.JSChart) return;
        
        if (symbol) 
        {
            this.Symbol=symbol;
            this.Name=symbol;
        }

        if (IFrameSplitOperator.IsPlusNumber(date)) this.Date=date;

        this.UpdateDialogTitle();
        this.Minute.JSChart.ChangeSymbol(this.Symbol);
        this.MarkKLineBG();
    }

    this.MarkKLineBG=function()
    {
        if (!this.HQChart) return;

        var finder=this.HQChart.GetExtendChartByClassName("MarkPopMinutePaint");
        if (!finder || !finder.Chart) return;

        finder.Chart.SetDate([this.Date]);
        this.HQChart.Draw();

    }

    this.ClearMarkKLineBG=function()
    {
        if (!this.HQChart) return;

        var finder=this.HQChart.GetExtendChartByClassName("MarkPopMinutePaint");
        if (!finder || !finder.Chart) return;

        finder.Chart.ClearData();
        this.HQChart.Draw();
    }
}


JSPopMinuteChart.GetMinuteOption=function()
{
    var option=
    {
        Type:'分钟走势图',   //创建图形类型
        Windows: //窗口指标
        [
            //{ Index:"VOL" },
            //{ Index:"RSI" }
        ], 
                
        Symbol:null,         // cf1909.czc
        IsAutoUpdate:false,          //是自动更新数据
        AutoUpdateFrequency:10000,   //数据更新频率
        DayCount:1,                     //1 最新交易日数据 >1 多日走势图
        IsShowRightMenu:false,       //是否显示右键菜单
        
        EnableSelectRect:true,
        EnableZoomIndexWindow:true,
        EnableResize:false,

        //BeforeOpen:{IsShow:true, Width:120, IsShowMultiDay:true, MulitiDayWidth:100, },
        //AfterClose:{IsShow:true, Width:100, IsShowMultiDay:true, MulitiDayWidth:50,  ShareVol:2 }, //ShareVol:0=盘后成交量独立坐标, 1==盘后成交量主图共用 2==盘后成交量盘前共用

        CorssCursorInfo:{ Left:2, Right:1, Bottom:1 },
                
        MinuteLine:
        {
           
        },

        MinuteTitle:
        {
            IsShowTime:true,
            IsShowName:false,
            IsShowDate:true,
            IsShowVolTitle:true,
            //IsAlwaysShowLastData:true,
            IsTitleShowLatestData:true,
        },

        MinuteVol:
        {
            BarColorType:1,
        },

        //Language:'EN',
    
        Border: //边框
        {
            Left:20,    //左边间距
            Right:20,     //右边间距
            Top:25,
            Bottom:25,

            AutoLeft:{ Blank:10, MinWidth:60 },
            AutoRight:{ Blank:10, MinWidth:60 },
        },
                
        Frame:  //子框架设置
        [
            { SplitCount:5 },
            { SplitCount:3 },
            { SplitCount:3 },
        ],
    }

    return option;
}


///////////////////////////////////////////////////////
//  分时图提示信息
//
//////////////////////////////////////////////////////

function JSTooltipMinuteChart()
{
    this.DivDialog=null;
    this.HQChart=null;
    this.ID=Guid();

    this.BGColor=g_JSChartResource.PopMinuteChart.BGColor;
    this.BorderColor=g_JSChartResource.PopMinuteChart.BorderColor;
    this.OnCreatedCallback;

    this.Minute=
    {
        Option:JSTooltipMinuteChart.GetMinuteOption(),
        JSChart:null,
        Symbol:null,
        Date:null,
    }

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;

        if (option)
        {
            if (IFrameSplitOperator.IsObject(option.Option)) 
            {
                var item=CloneData(option.Option);  //复制一份出来
                this.Minute.Option=Object.assign(this.Minute.Option,item);

                if (IFrameSplitOperator.IsNonEmptyArray(option.Option.EventCallback)) this.Minute.Option.EventCallback=option.Option.EventCallback;
            }
            if (option.OnCreatedCallback) this.OnCreatedCallback=option.OnCreatedCallback;
            
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement('div');
        divDom.className='UMyChart_Tooltip_Minute_Div';
        divDom.id=this.ID;

        var divChart=document.createElement('div');
        divChart.className='UMyChart_Tooltip_Minute_Chart_Div';
        divDom.appendChild(divChart);

        this.DivDialog=divDom;

        var chart=JSChart.Init(divChart);
        this.Minute.JSChart=chart;

        //语言跟主图保持一致
        if (this.HQChart) this.Minute.Option.Language=g_JSChartLocalization.GetLanguageName(this.HQChart.LanguageID);
        this.Minute.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Minute.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        chart.SetOption(this.Minute.Option);  //设置K线配置

        document.body.appendChild(divDom);

        this.UpdateStyle();

        if (!this.Minute.Option.EnableResize)
        {
            if (this.Minute.JSChart) this.Minute.JSChart.OnSize();
        }
    }

    this.UpdateStyle=function()
    {
        if (!this.DivDialog) return;

        if (this.BGColor) this.DivDialog.style['background-color']=this.BGColor;
        if (this.BorderColor) this.DivDialog.style['border-color']=this.BorderColor;
    }

    this.NetworkFilter=function(data, callback)
    {
        if (!this.HQChart || !this.HQChart.NetworkFilter) return;

        /*
        if (data) data.PopMinuteData={ Date:this.Date };    //弹出分时图额外数据
        
        if (data.Name== 'MinuteChartContainer::RequestMinuteData')  //分时图数据对接
        {
            data.Request.Data.date=this.Date;
            data.Name="MinuteChartContainer::RequestPopMinuteData";
            data.Explain="指定日期分时数据"
        };
        */

        this.HQChart.NetworkFilter(data, callback);       
    }

    this.OnCreateHQChart=function(chart)
    {
        if (this.OnCreatedCallback) this.OnCreatedCallback(chart);
    }

    this.Destroy=function()
    {
        if (this.DivDialog) document.body.removeChild(this.DivDialog);
        this.DivDialog=null;
        this.TitleBox=null;
        if (!this.Minute.JSChart) this.Minute.JSChart.ChartDestory();
        this.Minute.JSChart=null;
    }

    this.IsShow=function()
    {
        if (!this.DivDialog) return false;
        
        return this.DivDialog.style.visibility==='visible';
    }

    this.Show=function(data, x, y)
    {
        if (!this.DivDialog) this.Create();
        if (!data || !data.Symbol) return;

        var symbol=data.Symbol;
        var date=null;
        if (IFrameSplitOperator.IsPlusNumber(data.Date)) date=data.Date;

        if (this.Minute.JSChart)
        {
            if (this.Minute.Symbol!=symbol || this.Minute.Date!=date)
            {
                this.Minute.Symbol=symbol;
                this.Minute.Date=date;
                this.Minute.JSChart.ChangeSymbol(symbol);
            }
        }

        if (IFrameSplitOperator.IsNumberV2(x,y))
        {

        }
        else if (data.Rect)
        {
            var rtCell=data.Rect;
            var pixelRatio=GetDevicePixelRatio();
            var rtItem={ Left:rtCell.Left/pixelRatio, Right:rtCell.Right/pixelRatio, Bottom:rtCell.Bottom/pixelRatio, Top:rtCell.Top/pixelRatio };
            rtItem.Width=rtItem.Right-rtItem.Left;
            rtItem.Height=rtItem.Bottom-rtItem.Top;

            //超出窗口调整位置
            var height=this.DivDialog.offsetHeight;
            var width=this.DivDialog.offsetWidth;
            var x=rtItem.Right+data.Offset.Left;
            var y=rtItem.Bottom+data.Offset.Top;

            var xRight=window.innerWidth-5;
            var ybottom=window.innerHeight-5;
            if (x+width>xRight) x=(rtItem.Left+data.Offset.Left)-width;
            if (y+height>ybottom) y=(rtItem.Top+data.Offset.Top)-height;

            this.DivDialog.style.visibility='visible';
            this.DivDialog.style.top = y + "px";
            this.DivDialog.style.left = x + "px";
        }
    }

    this.Hide=function()
    {
        if (!this.DivDialog) return;
        if (this.DivDialog.style.visibility!='hidden')
            this.DivDialog.style.visibility='hidden';
    }


    this.ReloadResource=function(option)
    {
        this.BGColor=g_JSChartResource.PopMinuteChart.BGColor;
        this.BorderColor=g_JSChartResource.PopMinuteChart.BorderColor;

        if (!this.DivDialog) return;

        this.UpdateStyle();

        if (this.Minute.JSChart) this.Minute.JSChart.ReloadResource(option);
    }

}

JSTooltipMinuteChart.GetMinuteOption=function()
{
    var option=
    {
        Type:'分钟走势图',   //创建图形类型
        Windows: //窗口指标
        [
            //{ Index:"VOL" },
            //{ Index:"RSI" }
        ], 
                
        Symbol:null,         // cf1909.czc
        IsAutoUpdate:false,          //是自动更新数据
        AutoUpdateFrequency:10000,   //数据更新频率
        DayCount:1,                     //1 最新交易日数据 >1 多日走势图
        IsShowRightMenu:false,       //是否显示右键菜单
        
        EnableSelectRect:true,
        EnableZoomIndexWindow:true,
        EnableResize:true,

        //BeforeOpen:{IsShow:true, Width:120, IsShowMultiDay:true, MulitiDayWidth:100, },
        //AfterClose:{IsShow:true, Width:100, IsShowMultiDay:true, MulitiDayWidth:50,  ShareVol:2 }, //ShareVol:0=盘后成交量独立坐标, 1==盘后成交量主图共用 2==盘后成交量盘前共用

        CorssCursorInfo:{ Left:2, Right:1, Bottom:1 },
                
        MinuteLine:
        {
           
        },

        MinuteTitle:
        {
            IsShowTime:true,
            IsShowName:true,
            IsShowDate:true,
            IsShowVolTitle:true,
            //IsAlwaysShowLastData:true,
            IsTitleShowLatestData:true,

            ShowPostion:{ Type:1 , Margin:{ Left:5*GetDevicePixelRatio(), Right:5*GetDevicePixelRatio() } }
        },

        MinuteVol:
        {
            BarColorType:1,
        },

        //Language:'EN',
    
        Border: //边框
        {
            Left:20,    //左边间距
            Right:120,     //右边间距
            Top:25,
            Bottom:25,

            AutoLeft:{ Blank:10, MinWidth:40 },
            AutoRight:{ Blank:10, MinWidth:40 },
        },
                
        Frame:  //子框架设置
        [
            { SplitCount:5 },
            { SplitCount:3 },
            { SplitCount:3 },
        ],
    }

    return option;
}


///////////////////////////////////////////////////////
// K线上标记选中

function MarkPopMinutePaint()
{
    this.newMethod=IExtendChartPainting;   //派生
    this.newMethod();
    delete this.newMethod;

    this.ClassName="MarkPopMinutePaint";
    this.MapDate;   //标记日期
    this.BGColor="rgba(100,100,100,0.2)";
    this.LineWidth=g_JSChartResource.PopMinuteChart.Mark.LineWidth;
    this.LineColor=g_JSChartResource.PopMinuteChart.Mark.LineColor;
    this.SubFrame;
    this.IsDynamic=true;
    this.IsShow=true;


    this.ReloadResource=function(resource)
    {
        this.LineWidth=g_JSChartResource.PopMinuteChart.Mark.LineWidth;
        this.LineColor=g_JSChartResource.PopMinuteChart.Mark.LineColor;
    }

    this.SetDate=function(aryDate)
    {
        this.MapDate=new Map();
        if (IFrameSplitOperator.IsNonEmptyArray(aryDate))
        {
            for(var i=0;i<aryDate.length;++i)
            {
                var date=aryDate[i];
                this.MapDate.set(date, { Date:date} );
            }
        }
    }

    this.ClearData=function()
    {
        this.MapDate=null;
    }

    this.Draw=function()
    {
        this.SubFrame=null;
        if (!this.IsShow) return;
        if (!this.HQChart) return;
        if (!this.ChartFrame || !IFrameSplitOperator.IsNonEmptyArray(this.ChartFrame.SubFrame)) return;
        if (!this.MapDate || this.MapDate.size<=0) return;

        var kData=this.HQChart.GetKData();
        if (!kData || !IFrameSplitOperator.IsNonEmptyArray(kData.Data)) return;
        this.SubFrame=this.ChartFrame.SubFrame[0].Frame;
        if (!this.SubFrame) return;

        var dataWidth=this.SubFrame.DataWidth;
        var distanceWidth=this.SubFrame.DistanceWidth;
        var xPointCount=this.SubFrame.XPointCount;
        var border=this.SubFrame.GetBorder();
        var xOffset=border.LeftEx+distanceWidth/2.0+g_JSChartResource.FrameLeftMargin;
        var chartright=border.RightEx;
       
        var startIndex=kData.DataOffset;
        var aryBG=[];
        for(var i=startIndex,j=0;i<kData.Data.length && j<xPointCount;++i,++j,xOffset+=(dataWidth+distanceWidth))
        {
            var kItem=kData.Data[i];
            if (!kItem) continue;
            if (!this.MapDate.has(kItem.Date)) continue
            
            var left=xOffset;
            var right=xOffset+dataWidth;
            var x=left+(right-left)/2;

            var bgItem={ Left:left, XCenter:x, Right:right, DataIndex:i, DataWidth:dataWidth };
            aryBG.push(bgItem);
        }

        if (IFrameSplitOperator.IsNonEmptyArray(aryBG))
        {
            this.Canvas.save();
            this.DrawBG(aryBG);
            this.Canvas.restore();
        }

        this.SubFrame=null;
    }

    this.DrawBG=function(aryBG)
    {
        var border=this.ChartFrame.ChartBorder.GetBorder();
        var pixelRatio=GetDevicePixelRatio();
        if (this.MapDate.size==1)   //标记一天
        {
            var item=aryBG[0];
            var lineWidth=this.LineWidth*pixelRatio;
            if (item.DataWidth<=4) lineWidth=1*pixelRatio;

            this.Canvas.lineWidth=lineWidth;
            this.Canvas.strokeStyle=this.LineColor;
            var x=ToFixedPoint2(lineWidth,item.XCenter);
            this.Canvas.beginPath();
            this.Canvas.moveTo(x,border.TopEx);
            this.Canvas.lineTo(x,border.BottomEx);
            this.Canvas.stroke();
        }
    }
}


JSChart.RegisterExtendChartClass("MarkPopMinutePaint", { Create:function() { return new MarkPopMinutePaint}} );







