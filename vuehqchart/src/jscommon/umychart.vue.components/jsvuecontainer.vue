<!-- 
    控件容器 
    Control: 自控件数组 { ClassName=控件名字, Size=控件长宽 ,默认值只使用 DefaultSymbol=股票代码 , DefaultOption=配置信息全部放在这个结构里面{} }
!-->

<template>
    <div class="jsvuecontainer" ref='jsvuecontainer' style="width:100%;height:100%">
        <div class='divcontrol' ref='divcontrol' v-for='item in Control' :key='item.ID' :style="{width:item.Size.Width+'px', height:item.Size.Height+'px'}">
            <component v-bind:is=item.ClassName ref='control' :DefaultSymbol=item.Symbol :DefaultOption=item.Option ></component>
        </div>
        <div class="emptyBlock" ref='emptyBlock' @click='ShowDialog'>
            <p>+</p>
        </div>
    </div>
</template>


<script>

import StockChart from './stockchart.vue'
import StockOrder from './stockorder.vue'

function DefaultData() { };

DefaultData.ID=10;

DefaultData.CreateID=function()
{
    ++DefaultData.ID;
    return DefaultData.ID;
}


export default 
{
    name:'JSVueContainer',

    components: {StockChart,StockOrder},

    props: 
    [
        'DefaultSymbol',     //默认股票
    ],

    ControlID:10,

    data() 
    {
        return {
            Symbol:"000001.sz",

            Control:
            [
                { ClassName:'StockChart', ID:DefaultData.CreateID()},
                { ClassName:'StockChart', ID:DefaultData.CreateID()},
                { ClassName:'StockOrder', ID:DefaultData.CreateID()}
            ],

            MinSize: { Width:500, Height:300 },    //单个控件最小的大小 (在Onsize动态计算)
        };
    },

    created:function()
    {
        //处理默认传入的参数
        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol; //默认股票
        for(var i in this.Control)
        {
            var item=this.Control[i];
            if (item.ClassName==='StockChart') item.Symbol=this.Symbol;

            item.Size={ Width:this.MinSize.Width,Height:this.MinSize.Height };
        }
    },

    mounted:function()
    {
        this.OnSize();
    },

    methods: 
    {
        CreateID:DefaultData.CreateID,
        ShowDialog(){

        },
        
        OnSize() 
        {
            var contaniner=this.$refs.jsvuecontainer;
            var marginW = 10*2;
            var borderW = 1*2;
            var height= contaniner.offsetHeight;
            var width = contaniner.offsetWidth;
            console.log(`[JSVueContainer::OnSize] width=${width} height=${height}`); 
            if (height<=0 || width<=0) return;

            this.MinSize.Width = parseInt(width/3) - marginW - borderW;   //3等份
            this.MinSize.Height = height - marginW - borderW;

            for(var i in this.$refs.divcontrol)
            {
                var item=this.$refs.divcontrol[i];
                item.style.width=this.MinSize.Width+'px';
                item.style.height=this.MinSize.Height+'px';
            }
            var emptyBlock = this.$refs.emptyBlock;
            emptyBlock.style.width=this.MinSize.Width+'px';
            emptyBlock.style.height=this.MinSize.Height+'px';

            for(var i in this.$refs.control)
            {
                var item=this.$refs.control[i];
                item.OnSize();
            }
        }
    }
}

</script>

<style scoped lang='less'>
    * {margin: 0; padding: 0;}
    .jsvuecontainer{
        font: 14px 'Microsoft Yahei';
        .divcontrol {
            margin: 10px;
            border: 1px solid #ccc;
            float: left;
        }
        .emptyBlock{
            border:1px solid #ccc;
            margin: 10px;
            float: left;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            >p {
                border: 5px dashed #ccc;
                width: 45px;
                height: 45px;
                border-radius: 5px;
                line-height: 38px;
                font-size: 45px;
                color: #ccc;
                font-weight: 700;
                text-align: center;
            }
        }
    }
    .divcontrol::after {
            content: '';
            width: 0;
            height: 0;
            display: block;
            clear: both;
        }
</style>