<template>
    <div id="app2" >
        <div style="height:600px;">
            <StockKLine ref='stockline' DefaultSymbol='000001.sz' DefaultPeriod='五日'></StockKLine>
        </div>
    </div>
</template>

<script>
import StockKLine from '../../jscommon/umychart.vue.components/stockkline.demo.vue'

export default 
{
    data () 
    {
        return {
          JSStock:null,  //共享的股票数据类
        }
    },   

    components: { StockKLine },

    created:function()
    {
        
    },

    mounted:function()
    {
        var stockKLine=this.$refs.stockline;
        var self=this;
        window.onresize = function() { self.OnSize() }
    },


    methods:
    {
        OnChangeSymbol:function(symbol)
        {

        },
        
        OnSize:function()
        {
            this.$refs.stockline.OnSize();
        }
    }
}

</script>

<style>

  
</style>
