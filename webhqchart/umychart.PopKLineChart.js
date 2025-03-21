

/*
   Copyright (c) 2018 jones
 
   http://www.apache.org/licenses/LICENSE-2.0

   开源项目 https://github.com/jones2000/HQChart
 
   jones_2000@163.com
*/


///////////////////////////////////////////////////////
//  K线图提示信息
//
//////////////////////////////////////////////////////

function JSTooltipKLineChart()
{
    this.DivDialog=null;
    this.HQChart=null;
    this.ID=Guid();

    this.BGColor=g_JSChartResource.PopMinuteChart.BGColor;
    this.BorderColor=g_JSChartResource.PopMinuteChart.BorderColor;
    this.OnCreatedCallback=null;

    this.KLine=
    {
        Option:JSTooltipKLineChart.GetKLineOption(),
        JSChart:null,
        Symbol:null,
    }

    this.Inital=function(hqchart, option)
    {
        this.HQChart=hqchart;

        if (option)
        {
            if (IFrameSplitOperator.IsObject(option.Option)) 
            {
                var item=CloneData(option.Option);  //复制一份出来
                this.KLine.Option=Object.assign(this.KLine.Option,item);

                if (IFrameSplitOperator.IsNonEmptyArray(option.Option.EventCallback)) this.KLine.Option.EventCallback=option.Option.EventCallback;
            }
            if (option.OnCreatedCallback) this.OnCreatedCallback=option.OnCreatedCallback;
        }
    }

    this.Create=function()
    {
        var divDom=document.createElement('div');
        divDom.className='UMyChart_Tooltip_KLine_Div';
        divDom.id=this.ID;

        var divChart=document.createElement('div');
        divChart.className='UMyChart_Tooltip_KLine_Chart_Div';
        divDom.appendChild(divChart);

        this.DivDialog=divDom;

        var chart=JSChart.Init(divChart);
        this.KLine.JSChart=chart;

        //语言跟主图保持一致
        if (this.HQChart) this.KLine.Option.Language=g_JSChartLocalization.GetLanguageName(this.HQChart.LanguageID);
        this.KLine.Option.OnCreatedCallback=(chart)=>{ this.OnCreateHQChart(chart); }
        this.KLine.Option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
        chart.SetOption(this.KLine.Option);  //设置K线配置

        document.body.appendChild(divDom);

        this.UpdateStyle();

        if (!this.KLine.Option.EnableResize)
        {
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize({ Type:1 });
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
        if (!this.KLine.JSChart) this.KLine.JSChart.ChartDestory();
        this.KLine.JSChart=null;
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
        if (this.KLine.JSChart)
        {
            if (this.KLine.Symbol!=symbol)
            {
                this.KLine.Symbol=symbol;
                this.KLine.JSChart.ChangeSymbol(symbol);
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

        if (this.KLine.JSChart) this.KLine.JSChart.ReloadResource(option);
    }

}

JSTooltipKLineChart.GetKLineOption=function()
{
    var option=
    {
        Type:'历史K线图',   //创建图形类型
        Windows: //窗口指标
        [
            { Index:"MA",Change:false, Modify:false },
            { Index:"MACD", Close:false, Change:false, Modify:false,MaxMin:false,TitleWindow:false },
        ], 

        //Language:'EN',

        Symbol:null,
        IsAutoUpdate:false,       //是自动更新数据
        AutoUpdateFrequency:3000,   //数据更新频率
               

        SplashTitle:'加载数据中......',
        IsShowRightMenu:false,          //右键菜单
        CtrlMoveStep:10,
    
        KLine:  //K线设置
        {
            DragMode:1,                 //拖拽模式 0=禁止拖拽 1=数据拖拽 2=区间选择
            Right:1,                    //复权 0 不复权 1 前复权 2 后复权
            Period:0,                   //周期 0 日线 1 周线 2 月线 3 年线 
            MaxRequestDataCount:3000,   //数据个数
            MaxRequestMinuteDayCount:5, //分钟数据获取几天数据  默认取5天数据
            IsShowTooltip:false,                 //是否显示K线提示信息
            DrawType:0,      //K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
            KLineDoubleClick:false, //禁止双击弹框
            RightSpaceCount:0,
            ZoomType:0,
            DataWidth:2,
        },

        StepPixel:0,

        Listener:
        {
            KeyDown:false,
            Wheel:false
        },

                
    
        KLineTitle: //标题设置
        {
            IsShowName:true,        //不显示股票名称
            IsShowSettingInfo:true, //不显示周期/复权
            IsTitleShowLatestData:true,
        },
    
        Border: //边框
        {
            
            Left:1,         //左边间距
            Right:20,       //右边间距
            Bottom:25,      //底部间距
            Top:25,         //顶部间距

            AutoLeft:{ Blank:10, MinWidth:30 },
            AutoRight:{ Blank:5, MinWidth:30 },
        },
                
        Frame:  //子框架设置
        [
            {
                SplitCount:4,
                IsShowLeftText:false,
            },

            { SplitCount:3,IsShowLeftText:false, },
            { SplitCount:3, IsShowLeftText:false,}
        ],
    }

    return option;
}










