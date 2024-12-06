<template>
    <div style="width:100%;height:100%">
        <div ref='toptoolbar'>
            <button class="1D" @click="OnChangeKLinePeriod(0)">日</button>
            <button class="1D" @click="OnChangeKLinePeriod(1)">周</button>
            <button class="1D" @click="OnChangeKLinePeriod(2)">月</button>
            <button class="1D" @click="OnChangeKLinePeriod(4)">1分钟</button>
            <button class="1D" @click="OnChangeKLinePeriod(5)">5分钟</button>
            <button class="1D" @click="OnChangeMinute()">分时</button>


            <button class="1D" @click="OnChangeChartCount(4)">4图</button>
            <button class="1D" @click="OnChangeChartCount(6)">6图</button>
            <button class="1D" @click="OnChangeChartCount(9)">9图</button>

            <button class="1D" @click="OnNextPage()">下一页</button>
            <button class="1D" @click="OnPrevPage()">上一页</button>
        </div>
        <div class="klinelist" ref='klinelist'>
            <div class='kline' ref='kline' v-for='item in HQChartList' :key='item.ID'>
            </div>
        </div>

        <div ref='bottomtoolbar'>
            <button class="1D" @click="OnChangeKLineIndex(0, 'MA')">MA2</button>
            <button class="1D" @click="OnChangeKLineIndex(1, 'MACD')">MACD</button>
            <button class="1D" @click="OnChangeKLineIndex(1, 'RSI')">RSI</button>
        </div>
    </div>
</template>

<script>

import $ from 'jquery'
import HQChart from 'hqchart'
import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
import HQData from "hqchart/src/jscommon/umychart.vue.testdataV2/umychart.NetworkFilterTest.vue.js"


//源码调试用
//import Chart from './jscommon/umychart.vue/umychart.vue.js'
//var HQChart={ Chart:Chart };

function DefaultData() { }

DefaultData.GetKLineOption=function()
{
    //K线配置信息
    var option= 
    {
        Type:'历史K线图',   //创建图形类型
        
        Windows: //窗口指标
        [
            {Index:"MA8" , Modify:false,Change:false},
            {Index:"VOL", Modify:false,Change:false}, 
        ], 

        IsAutoUpdate:true,            //是自动更新数据(不自动更新由外部更新)
        IsShowRightMenu:false,          //右键菜单

        CorssCursorInfo:{ IsShowCorss:false },  //不显示十字光标线

        KLine:  //K线设置
        {
            DragMode:1,                   //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right:1,                      //复权 0 不复权 1 前复权 2 后复权
            Period:0,                     //周期 0 日线 1 周线 2 月线 3 年线 
            MaxReqeustDataCount:2000,     //数据个数
            MaxRequestMinuteDayCount:10,  //分钟数据取5天
            PageSize:30,                  //一屏显示多少数据
            IsShowTooltip:false,           //是否显示 div K线提示信息 (手机端要填false)
            DrawType:0,                   //K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
            RightSpaceCount:2
        },


        Listener:   //去掉内置的滚动条和键盘事件
        {
            KeyDown:false,
            Wheel:false
        },

        /*
        DragDownload: 
        { 
            Minute: { Enable:true },    //开启分钟数据拖拽下载
            Day: { Enable:true }        //开启日线数据拖拽下载
        },
        */

        KLineTitle: //标题设置
        {
            IsShowName:true,       //不显示股票名称
            IsShowSettingInfo:true //不显示周期/复权
        },

        Border: //边框
        {
            Left:1,         //左边间距
            Right:60,       //右边间距
            Bottom:25,      //底部间距
            Top:25           //顶部间距
        },
        
        Frame:  //子框架设置
        [
            { SplitCount:3,IsShowLeftText:false },
            { SplitCount:2,IsShowLeftText:false },
            { SplitCount:2,IsShowLeftText:false }
        ],

        ExtendChart:    //扩展图形
        [
            //{Name:'KLineTooltip' }  //手机端tooltip
        ],
    };

    return option;
}


DefaultData.GetMinuteOption=function()
{
     //分时图配置信息
    var option= 
    {
        Type:'分钟走势图',   //创建图形类型

        Windows: //窗口指标
        [
            //{Index:"MACD", Modify:false, Change:false, Close:false }
            //{Index:"涨跌趋势", Modify:false,Change:false},
        ], 
        
        Symbol:'000001.sz',              
        IsAutoUpdate:true,              //是自动更新数据
        DayCount:1,                     //1 最新交易日数据 >1 多日走势图
        IsShowRightMenu:false,          //是否显示右键菜单

        CorssCursorInfo:{ IsShowCorss:false},

        MinuteLine:
        {
            IsDrawAreaPrice:false,       //是否画价格面积图
            IsShowAveragePrice:true,   //不显示均线
        },

        Listener:   //去掉内置的滚动条和键盘事件
        {
            KeyDown:false,
            Wheel:false
        },

        Border: //边框
        {
            Left:60,    //左边间距
            Right:60,     //右边间距
            Top:25,
            Bottom:25
        },
    };

    return option;
}

export default 
{ 
    name: 'MultiKLine',

    data() 
    {
        let data =
        {
            HQChartList: [],    //{ Symbol: ,Chart:null , ID:} 
            Period:0,   //周期
            HQChartType:0,  //0=K线  1=分时图

            SymbolList:
            {
                List:
                [
                    "600000.sh",
                    "000001.sz",
                    "000030.sz",
                    "000001.sh",
                    "600999.sh",
                    "000042.sz",
                    "000021.sz",
                    "000030.sz",
                    "000031.sz",
                    "000032.sz",
                    "000034.sz",
                    "000030.sz",
                    "000031.sz",
                ],
                Index:0,
            },
        }
        return data;
    },


    created()
    {
        this.HQChartList=[];
        for(var i=0;i<4; ++i)
        {
            var item={Symbol:this.SymbolList.List[i],Chart:null , ID:HQChart.Chart.JSChart.CreateGuid()};
            this.HQChartList.push(item);
        }
    },

    mounted()
    {
        console.log(`[MultiKLine::mounted]`);

        //黑色风格
        var blackStyle=HQChart.Chart.HQChartStyle.GetStyleConfig(HQChart.Chart.STYLE_TYPE_ID.BLACK_ID);
        HQChart.Chart.JSChart.SetStyle(blackStyle);

        //局部修改颜色
        //var resource=HQChart.JSChart.GetResource(); //获取全局资源
        //resource.FrameSplitTextFont='30px 微软雅黑';
        
        window.onresize = ()=>{ this.OnSize() }
        this.OnSize();  
        this.CreateChart();

        this.$refs.klinelist.addEventListener("keydown", (e)=>{ this.OnKeyDown(e); }, true); 
        this.$refs.klinelist.addEventListener("wheel", (e)=>{ this.OnWheel(e); }, true); 
    },

    methods:
    {
        CreateKLineChart()
        {
            for(var i in this.$refs.kline)
            {
                var item=this.$refs.kline[i];
                let chart=HQChart.Chart.JSChart.Init(item);
                let option=DefaultData.GetKLineOption();
                option.KLine.Period=this.Period;
                option.Symbol=this.HQChartList[i].Symbol;
                option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
                chart.SetOption(option);

                this.HQChartList[i].Chart=chart;
            }
        },

        CreateMinuteChart()
        {
            for(var i in this.$refs.kline)
            {
                var item=this.$refs.kline[i];
                let chart=HQChart.Chart.JSChart.Init(item);
                let option=DefaultData.GetMinuteOption();
                option.Symbol=this.HQChartList[i].Symbol;
                option.NetworkFilter=(data, callback)=>{ this.NetworkFilter(data, callback); }
                chart.SetOption(option);

                this.HQChartList[i].Chart=chart;
            }
        },

        CreateChart()
        {
            if (this.HQChartType==0) this.CreateKLineChart();
            else this.CreateMinuteChart();
        },

        OnSize()
        {
            this.CalculateChartSize();

            for(var i in this.$refs.kline)
            {
                var klineItem=this.HQChartList[i];
                if (klineItem && klineItem.Chart) klineItem.Chart.OnSize();
            }
        },

        OnKeyDown(e)
        {
            console.log("[MultiKLine::OnKeyDown]", e);

            var keyID = e.keyCode ? e.keyCode :e.which;
            switch(keyID)
            {
                case 38:   //up
                case 40:   //down
                    this.ZoomUpDownChart(e);
                    break;
            } 
        },

        OnWheel(e)
        {
            var wheelValue=e.wheelDelta;
            if (!HQChart.Chart.IFrameSplitOperator.IsObjectExist(e.wheelDelta))
                wheelValue=e.deltaY* -0.01;

            console.log("[MultiKLine::OnWheel] e, wheelValue ", e, wheelValue);

            if (wheelValue<0)
            {
                this.OnNextPage();
            }
            else if ( wheelValue>0)
            {
                this.OnPrevPage();
            }
        },

        OnChangeKLinePeriod(period)  //周期切换
        {
            this.Period=period;
            if (this.HQChartType!=0)
            {
                this.HQChartType=0;
                this.DeleteChart();
                this.CreateChart(); 
            }
            else
            {
                for(var i in this.HQChartList)
                {
                    var item=this.HQChartList[i];
                    if (!item.Chart) continue;

                    item.Chart.ChangePeriod(period);
                }
            }
        },

        OnChangeMinute()
        {
            if (this.HQChartType!=1)
            {
                this.HQChartType=1;
                this.DeleteChart();
                this.CreateChart(); 
            }
        },

        OnChangeChartCount(count)   //窗口个数
        {
            if (this.HQChartList.length==count) return;

            this.DeleteChart();

            this.HQChartList=[];
            for(var i=0;i<count;++i)
            {
                var index=this.SymbolList.Index+i;
                var item={ Symbol:this.SymbolList.List[index], Chart:null , ID:HQChart.Chart.JSChart.CreateGuid() };
                this.HQChartList.push(item);
            }

            this.$nextTick(() => {
                this.OnSize();
                this.CreateChart(); 
            })
        },

        OnChangeKLineIndex(id, name)
        {
            if (this.HQChartType!=0) return;    //only kline has index

            for(var i in this.HQChartList)
            {
                var item=this.HQChartList[i];
                if (!item.Chart) continue;

                item.Chart.ChangeIndex(id, name);
            }
        },

        OnNextPage()
        {
            if (this.SymbolList.Index+this.HQChartList.length>this.SymbolList.List.length) return;

            var start=this.SymbolList.Index+this.HQChartList.length;
            for(var i=0;i<this.HQChartList.length;++i)
            {
                var item=this.HQChartList[i];
                var index=start+i;
                if (index<this.SymbolList.List.length) 
                {
                    this.HQChartList[i].Symbol=this.SymbolList.List[index];
                    item.Chart.ChangeSymbol(this.SymbolList.List[index]);
                }
                else 
                {
                    this.HQChartList[i].Symbol=null;
                    item.Chart.ChangeSymbol(null);
                }
            }

            this.SymbolList.Index+=this.HQChartList.length;
        },

        OnPrevPage()
        {
            if (this.SymbolList.Index<=0) return;

            var start=this.SymbolList.Index-this.HQChartList.length;
            if (start<0) start=0;
            for(var i=0;i<this.HQChartList.length;++i)
            {
                var item=this.HQChartList[i];
                var index=start+i;
                if (index<this.SymbolList.List.length) 
                {
                    this.HQChartList[i].Symbol=this.SymbolList.List[index];
                    item.Chart.ChangeSymbol(this.SymbolList.List[index]);
                }
                else 
                {
                    this.HQChartList[i].Symbol=null;
                    item.Chart.ChangeSymbol(null);
                }
            }

            this.SymbolList.Index=start;
        },

        //
        //内部方法
        //

        CalculateChartSize()   //计算布局
        {
            var divList=this.$refs.klinelist;
            var height= divList.offsetHeight;
            var width = divList.offsetWidth; //获取外层div的大小
            var top=this.$refs.toptoolbar.offsetHeight;
            height-=top;
            console.log(`[MultiKLine::CalculateChartSize] height=${height} width=${width}, top=${top}`);

            var itemHeight = 0;
            var itemWidth = 0;
            var count = this.HQChartList.length;
            var rowCount = 0;  //一行放几个图

            if(count == 9)
            {
                itemHeight = height / 3;
                itemWidth = width / 3;
                rowCount = 3;
            }
            else if(count == 6)
            {
                itemHeight = height / 3;
                itemWidth = width / 2;
                rowCount = 2;
            }
            else if(count == 4)
            {
                itemHeight = height / 2;
                itemWidth = width / 2;
                rowCount = 2;
            }

            //调整div位置
            var aryKLine=this.$refs.kline;
            for(let i = 0; i < aryKLine.length; i++)
            {
                var divKLine=aryKLine[i];
                var rowIndex = i % rowCount;
                var colIndex = Math.floor(i / rowCount);
                divKLine.style.left = itemWidth * rowIndex + 'px';
                divKLine.style.top = (itemHeight*colIndex+top) + 'px';
                divKLine.style.width = itemWidth + 'px';
                divKLine.style.height = itemHeight + 'px';
            }
        },

        ZoomUpDownChart(e)      //上下缩放K线图
        {
            for(var i in this.HQChartList)
            {
                var item=this.HQChartList[i];
                if (!item.Chart) continue;

                item.Chart.JSChartContainer.OnKeyDown(e);
            }
        },


        DeleteChart()
        {
            for(var i in this.$refs.kline)
            {
                var divKLine=this.$refs.kline[i];
                 while (divKLine.hasChildNodes()) 
                {
                    divKLine.removeChild(divKLine.lastChild);
                }　
            }

            for(var i in this.HQChartList)
            {
                var item=this.HQChartList[i];
                if (item.Chart)
                {
                    item.Chart.StopAutoUpdate();    //停止定时器
                    item.Chart=null;
                }
            }
        },

        NetworkFilter(data, callback)
        {
            HQData.HQData.NetworkFilter(data, callback);
        }
    }
}

</script>

<style>

.kline
{
  position: absolute;
  background-color: black;
}

.klinelist
{
    width:100%;
    height:80%;
}
</style>

