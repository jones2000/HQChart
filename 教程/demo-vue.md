# VUE用例
## VUE创建走势图用例
```js
<template>

    <div id="app2">
        <div id="minute" ref="minute" ></div>
    </div>

</template>

<script>

import HQChart from 'hqchart'

function DefaultData(){}

DefaultData.GetMinuteOption=function()
{
    var option= 
    {
        Type:'分钟走势图',   //创建图形类型
            
        Windows: //窗口指标
        [
            
        ], 
            
        IsAutoUpdate:true,       //是自动更新数据
        DayCount:1,                 //1 最新交易日数据 >1 多日走势图
        IsShowCorssCursorInfo:true, //是否显示十字光标的刻度信息
        IsShowRightMenu:true,       //是否显示右键菜单
        CorssCursorTouchEnd:true,

        MinuteLine:
        {
            //IsDrawAreaPrice:false,      //是否画价格面积图
        },

        Border: //边框
        {
            Left:1,    //左边间距
            Right:1,   //右边间距
            Top:20,
            Bottom:20
        },
            
        Frame:  //子框架设置
        [
            {SplitCount:3,StringFormat:0},
            {SplitCount:2,StringFormat:0},
            {SplitCount:3,StringFormat:0},
        ],

        ExtendChart:    //扩展图形
        [
            //{Name:'MinuteTooltip' }  //手机端tooltip
        ],
    };

    return option;
}


export default 
{
    data() 
    {
        var data=
        {
            Symbol:'600000.sh',

            Minute:
            {
                JSChart:null,
                Option:DefaultData.GetMinuteOption(),
            }
        };

        return data;

    },

    created()
    {
        
    },

    mounted()
    {
        this.OnSize();

        window.onresize = ()=> { this.OnSize(); }

        this.CreateMinuteChart();
    },
        
    methods:
    {
        OnSize()
        {
            var chartHeight = window.innerHeight-30;
            var chartWidth = window.innerWidth-30;


            var minute=this.$refs.minute;
            minute.style.width=chartWidth+'px';
            minute.style.height=chartHeight+'px';

            if (this.Minute.JSChart) this.Minute.JSChart.OnSize();
        },

        CreateMinuteChart() //创建日线图
        {
            if (this.Minute.JSChart) return;
            this.Minute.Option.Symbol=this.Symbol;
            let chart=HQChart.Chart.JSChart.Init(this.$refs.minute);
            chart.SetOption(this.Minute.Option);
            this.Minute.JSChart=chart;
        },
    }
}

```

## VUE创建K线图用例

```js
<template>

    <div id="app2">
        <div id="kline" ref='kline'></div>
    </div>

</template>

<script>
  
import HQChart from 'hqchart'

function DefaultData(){}

DefaultData.GetKLineOption = function () 
{
    let data = 
    {
        Type: '历史K线图', 
        
        Windows: //窗口指标
        [
            {Index:"MA",Modify: false, Change: false}, 
            {Index:"VOL",Modify: false, Change: false}
        ], 

        IsShowCorssCursorInfo:true,

        Border: //边框
        {
            Left:   1,
            Right:  1, //右边间距
            Top:    25,
            Bottom: 25,
        },

        KLine:
        {
            Right:1,                            //复权 0 不复权 1 前复权 2 后复权
            Period:0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
            PageSize:70,
            IsShowTooltip:true
        },
        
    };

    return data;
}

export default 
{
    data() 
    {
        var data=
        {
            Symbol:'600000.sh',
            KLine: 
            {
                JSChart:null,
                Option:DefaultData.GetKLineOption(),
            },

        };

        return data;

    },

    created()
    {
        
    },

    mounted()
    {
        this.OnSize();

        window.onresize = ()=> { this.OnSize(); }

       this.CreateKLineChart(); 
    },
        
    methods:
    {
        OnSize()
        {
            var chartHeight = window.innerHeight-30;
            var chartWidth = window.innerWidth-30;

            var kline=this.$refs.kline;
            kline.style.width=chartWidth+'px';
            kline.style.height=chartHeight+'px';
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize();
        },

        CreateKLineChart()  //创建K线图
        {
            if (this.KLine.JSChart) return;
            this.KLine.Option.Symbol=this.Symbol;
            let chart=HQChart.Chart.JSChart.Init(this.$refs.kline);
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart=chart;
        },

    }
}

```