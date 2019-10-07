<template>
    <div id="app2" >
        <div style="height:300px; width:500px;">
            <StockChart ref='hqchart' DefaultSymbol='000001.sz' :DefaultOption=this.Option />
        </div>
        <div style="height:300px; width:500px;">
            <StockChart ref='hqchart2' DefaultSymbol='000001.sz' :DefaultOption=this.Option2 />
        </div>
        <div style="height:300px; width:500px;">
            <StockChart ref='hqchart3' DefaultSymbol='000001.sz' :DefaultOption=this.Option3 />
        </div>
         <div style="height:300px; width:500px;">
            <StockChart ref='hqchart4' DefaultSymbol='000001.sz' :DefaultOption=this.Option4 />
        </div>
    </div>
</template>

<script>

import StockChart from '../../jscommon/umychart.vue.components/stockchart.vue'

export default 
{
    data () 
    {
        return {
            Option:{ 
                Type: '分钟走势图',
                DayCount:1,     //1 走势图 2,3,4,5 多日走势图
                Windows:        //指定指标
                [
                    //{ Index: "KDJ" }
                ] ,
                MinuteLine:
                {
                    //IsDrawAreaPrice:false,        //是否画价格面积图
                    //IsShowLead:false,             //是否显示领先指标
                    //SplitType:1,                  //0=默认值最大最小值 1=涨跌停作为最大最小值
                },
            },
            Option2:
            {
               Type: '历史K线图', 
            },
            Option3:
            {
               Type: '历史K线图', 
               IsShowCorssCursorInfo:false,
               KLine:
                {
                    Right:1,                    //复权 0 不复权 1 前复权 2 后复权
                    Period:1,                   //周期 0 日线 1 周线 2 月线 3 年线 
                }
            },
            Option4:
            {
               Type: '历史分钟走势图', 
               //IsShowCorssCursorInfo:false,
               HistoryMinute: {TradeDate:20190422}
            }

        }
    },   

    components: { StockChart },

    created:function()
    {
        
    },

    mounted:function()
    {
        this.OnSize();
    },


    methods:
    {
        OnChangeSymbol:function(symbol)
        {

        },
        
        OnSize:function()
        {
            var aryHQChart=[this.$refs.hqchart,this.$refs.hqchart2,this.$refs.hqchart3,this.$refs.hqchart4];
            for(var i in aryHQChart)
            {
                aryHQChart[i].OnSize();
            }
        }
    }
}

</script>

<style>

  
</style>
