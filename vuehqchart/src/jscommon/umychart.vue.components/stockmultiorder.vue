<template>
    <div class="divorders" ref='divorders' style='width:100%;height:100%;'>
        <div ref='divstockorder' class='divstockorder' v-for='(orderField,index) in OrderFileds.CurrentFileds' :key='index'>
            <StockOrder ref='stockorder' :DefaultSymbol='Symbol' :DefaultOrderFiled='orderField.OrderFiled' :DefaultOrder='orderField.Order'></StockOrder>
        </div>
    </div>

</template>

<script>
    import StockOrder from './stockorder.vue'
    export default {
        name:'StockMultiOrder',
        data() {
            return {
                OrderFileds: {MetaFileds:[],CurrentFileds:[]},
                Symbol: 'SHA.ci'
            };
        },
        props: ['DefaultSymbol', 'DefaultOrderFileds'],
        components: {
            StockOrder
        },
        STOCK_FIELD_NAME:StockOrder.STOCK_FIELD_NAME,
        methods: {
            ChangeSymbol(symbol){
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

                if (count == 9) {
                    itemHeight = height / 3;
                    itemWidth = width / 3;
                    rowCount = 3;
                } else if (count == 6) {
                    itemHeight = height / 3;
                    itemWidth = width / 2;
                    rowCount = 2;
                } else if (count == 4) {
                    itemHeight = height / 2;
                    itemWidth = width / 2;
                    rowCount = 2;
                }else{
                    itemHeight = height;
                    itemWidth = width / count;
                    rowCount = count;
                }

                //调整div位置
                var divstockorders = this.$refs.divstockorder;
                for (let i = 0; i < divstockorders.length; i++) {
                    var divstockorder = divstockorders[i];
                    var rowIndex = i % rowCount;
                    var colIndex = Math.floor(i / rowCount);
                    divstockorder.style.left = itemWidth * rowIndex + 'px';
                    divstockorder.style.top = itemHeight * colIndex + 'px';
                    divstockorder.style.width = itemWidth + 'px';
                    divstockorder.style.height = itemHeight + 'px';
                }
            },
            OnSize() {
                this.CalculateTableSize();
                var stockorders = this.$refs.stockorder;
                for(let i = 0; i < stockorders.length; i++)
                {
                    stockorders[i].OnSize();
                }
            }
        },
        created() {
            if (this.DefaultSymbol) this.Symbol = this.DefaultSymbol;
            if (this.DefaultOrderFileds) this.OrderFileds.MetaFileds = this.DefaultOrderFileds;
            var count = this.OrderFileds.MetaFileds.length;
            if(count >= 4 && count < 6){
                count = 4
            }else if(count >=6 && count < 9){
                count = 6
            }else if(count >= 9){
                count = 9;
            }
            console.log(`[StockMultiOrder::created]count:${count}`);
            this.OrderFileds.CurrentFileds = this.OrderFileds.MetaFileds.slice(0,count);

        },
        mounted() {
            this.OnSize();
        }

    }
</script>
<style scoped lang='scss'>
    .divorders {
        position: relative;

        .divstockorder {
            position: absolute;
        }
    }
</style>