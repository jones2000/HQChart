<template>
    <div class="divorders" ref='divorders' style='width:100%;height:100%;'>
        <div ref='divstockorder' class='divstockorder' v-for='(orderField,index) in OrderFileds.CurrentFileds' :key='index'>
            <StockOrder ref='stockorder' :DefaultSymbol='Symbol' :DefaultOrderFiled='orderField.OrderFiled' :DefaultOrder='orderField.Order' />
        </div>
        <div ref='divideline' class='divideline' v-for='item in DivideLine' :key='item.ID'/>
    </div>
</template>

<script>
    import StockOrder from './stockorder.vue'
    export default {
        name:'StockMultiOrder',
        data() 
        {
            var data=
            {
                OrderFileds: {MetaFileds:[],CurrentFileds:[]},
                Symbol: 'SHA.ci',
                DivideLine:[],          //分割线
            };

            return data;
        },

        props: ['DefaultSymbol', 'DefaultOrderFileds'],

        components: { StockOrder },

        STOCK_FIELD_NAME:StockOrder.STOCK_FIELD_NAME,

        methods:
         {
            ChangeSymbol(symbol)
            {
                var stockorders = this.$refs.stockorder;
                for(let i = 0; i < stockorders.length; i++)
                {
                    stockorders[i].ChangeSymbol(symbol);
                }
            },
            CalculateTableSize: function () //计算布局
            {
                var divorders = this.$refs.divorders;
                var height = divorders.offsetHeight;
                var width = divorders.offsetWidth; //获取外层div的大小
                console.log(`[StockMultiOrder::CalculateTableSize] height=${height} width=${width}`);

                var itemHeight = 0;
                var itemWidth = 0;
                var count = this.OrderFileds.CurrentFileds.length;
                
                var rowCount = 0; //一行放几个图

                if (count == 9) 
                {
                    itemHeight = parseInt(height/3);
                    itemWidth = parseInt(width/3);
                    rowCount = 3;
                } 
                else if (count == 6) 
                {
                    itemHeight = parseInt(height/3);
                    itemWidth = parseInt(width/2);
                    rowCount = 2;
                } 
                else if (count == 4) 
                {
                    itemHeight = parseInt(height/2);
                    itemWidth = parseInt(width/2);
                    rowCount = 2;
                }
                else
                {
                    itemHeight = height;
                    itemWidth = parseInt(width/count);
                    rowCount = count;
                }

                //调整div位置
                var divstockorders = this.$refs.divstockorder;
                var top=0;
                for (let i = 0; i < divstockorders.length;) 
                {
                    var left=0;
                    var divHeight=itemHeight;
                    if (top+itemHeight>=height) divHeight=height-top-2;

                    for(var j=0;j<rowCount && i<divstockorders.length;++j,++i)
                    {
                        var divstockorder = divstockorders[i];
                        var divWidth=itemWidth;
                        if (left+itemWidth>=width || j==rowCount-1) divWidth=width-left-2; //最后1个需要减去边框的宽度

                        divstockorder.style.left = left + 'px';
                        divstockorder.style.top = top + 'px';
                        divstockorder.style.width = divWidth + 'px';
                        divstockorder.style.height = itemHeight + 'px';

                        left+=itemWidth;
                    }

                    top+=itemHeight;
                }

                //分割线
                var left=0;
                for(let i=0;i<rowCount && i<this.$refs.divideline.length;++i)
                {
                    left+=itemWidth;
                    var divideLine=this.$refs.divideline[i];
                    divideLine.style.left=left + 'px';
                }
            },
            OnSize() 
            {
                this.CalculateTableSize();
                var stockorders = this.$refs.stockorder;
                for(let i = 0; i < stockorders.length; i++)
                {
                    stockorders[i].OnSize();
                }
            }
        },
        created() 
        {
            if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol;
            if (this.DefaultOrderFileds) this.OrderFileds.MetaFileds = this.DefaultOrderFileds;
            var count = this.OrderFileds.MetaFileds.length;
            if(count >= 4 && count < 6)
            {
                count = 4;
                this.DivideLine=[1];
            }else if(count >=6 && count < 9)
            {
                count = 6;
                this.DivideLine=[1,2];
            }else if(count >= 9)
            {
                count = 9;
                this.DivideLine=[1,2];
            }
            console.log(`[StockMultiOrder::created]count:${count}`);
            this.OrderFileds.CurrentFileds = this.OrderFileds.MetaFileds.slice(0,count);
        },
        mounted() 
        {
            this.OnSize();
        }

    }
</script>
<style scoped lang='less'>
.divorders 
{
    position: relative;
    border: 1px solid #ccc;

    .divstockorder 
    {
        position: absolute;
    }
}

.divideline
{
    width:1px;
    top:0px;
    left:1px;
    height:100%;
    position: absolute;
    background-color: #ccc;
}
</style>