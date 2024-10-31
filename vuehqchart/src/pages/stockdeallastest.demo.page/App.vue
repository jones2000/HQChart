<template>
    <div id="app2" ref='app2'>
        <div ref="dealwrap">
            <StockDeal ref='stockdeal' :DealSymbol='Symbol' :DefaultStyle="Style"></StockDeal>
        </div>
        
    </div>
</template>
    
<script>
    import StockDeal from '../../jscommon/umychart.vue.components/stockchartV2.vue'    
    
    export default 
    {
        data () 
        {
            var data=
            {
              Symbol:'300219.sz',
              Style:0,
            };

            return data;
        },   
    
        components: {StockDeal },
    
        created:function()
        {
            var symbol = this.GetURLParams('symbol');
            if (symbol != null) this.Symbol = symbol;

            var style=this.GetURLParams("style");
            if (style=="black") this.Style=1;
        },
    
        mounted:function()
        {   
            this.OnSize();
    
            var self=this;
            window.onresize = function() { self.OnSize() }
        },
    
    
        methods:
        {
            OnSize:function()
            {
                var width = window.innerWidth;
                var height = window.innerHeight;
                var dealwrap = this.$refs.dealwrap;
                dealwrap.style.width = width + 'px';
                dealwrap.style.height = height + 'px';
                this.$refs.stockdeal.OnSize();
            },

            GetURLParams:function(name) 
            {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURI(r[2]);
                return null;
            }
        }
    }
    
    </script>
    
    <style>
    
      
    </style>
    