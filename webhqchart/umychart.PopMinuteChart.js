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
    this.DivInfoText=null;
    this.HQChart=null;
    this.DragTitle=null;
    this.Date=null;
    this.ID=Guid();

    this.Minute=
    {
        Option:JSPopMinuteChart.GetMinuteOption(),
        JSChart:null,
        Date:null,
    }

    this.Inital=function(hqchart)
    {
        this.HQChart=hqchart;
    }

    this.Create=function()
    {
        var divDom=document.createElement('div');
        divDom.className='jchart_pop_minute_dailog';
        divDom.id=this.ID;
        divDom.style["background-color"]=g_JSChartResource.PopMinuteChart.BGColor;
        divDom.style["border-color"]=g_JSChartResource.PopMinuteChart.BorderColor;

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

        this.DivDialog=divDom;

        var chart=JSChart.Init(divChart);
        this.Minute.JSChart=chart;
        //语言跟主图保持一致
        if (this.HQChart) this.Minute.Option.Language=g_JSChartLocalization.GetLanguageName(this.HQChart.LanguageID);
        this.Minute.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.Minute.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        chart.SetOption(this.Minute.Option);  //设置K线配置

        document.body.appendChild(divDom);
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
        this.DivInfoText=null;
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
        if (!data.Symbol || !IFrameSplitOperator.IsPlusNumber(data.Date));

        this.Date=data.Date;
        var name=data.Symbol;
        if (data.Name) name=data.Name;
        var title=`${name} ${IFrameSplitOperator.FormatDateString(data.Date)} 分时图`
        this.DivInfoText.innerText=title;

        if (this.Minute.JSChart)
        {
            this.Minute.JSChart.ChangeSymbol(data.Symbol);
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

    this.ReloadResource=function(option)
    {
        if (!this.DivDialog) return;

        this.DivDialog.style["background-color"]=g_JSChartResource.PopMinuteChart.BGColor;
        this.DivDialog.style["border-color"]=g_JSChartResource.PopMinuteChart.BorderColor;

        if (this.Minute.JSChart) this.Minute.JSChart.ReloadResource(option);
    }

    this.SetLanguage=function(language)
    {
        if (!this.DivDialog) return;

        if (this.Minute.JSChart) this.Minute.JSChart.SetLanguage(language);
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



