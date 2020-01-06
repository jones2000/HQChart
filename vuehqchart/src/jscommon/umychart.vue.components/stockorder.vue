<!-- 
      个股排名
!-->

<template>
    <div class="rankingList" ref='rankingList' style='width:100%;height:100%;'>
        <table class='table'>
            <caption ref='caption'>{{TableCaption}}</caption>
            <tbody>
                <tr v-for='(ranking,index) in BlockData.TableData' :key='index' @click='selectCurrRow(index)' :class='{active:RowIndex == index}'>
                    <td>{{ranking.Name}}</td>
                    <td :class='ranking.Price.Color'>{{ranking.Price.Text}}</td>
                    <td :class='ranking.FieldValue.Color'>{{ranking.FieldValue.Text}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
 
import $ from 'jquery'
import JSCommonStock from '../umychart.vue/umychart.stock.vue.js'
import DataFormat from '../umychart.vue/stockstringformat.js'

function DefaultData(){}

DefaultData.GetBlockName=function(symbol)
{
    let mapName=new Map([
        ['CNA.ci','沪深A'],
        ['SHA.ci','上证A'],
        ['SZA.ci','深证A'],
        ['GEM.ci','创业板'],
        ['SME.ci','中小板'],
    ]);
    if (mapName.has(symbol)) return mapName.get(symbol);

    return '';
}

export default 
{
    name: 'StockOrder',

    props:
    [
        'DefaultOrderFiled',    //显示的周期
        'DefaultOrder',         //默认排序方向
        'DefaultSymbol',        //默认板块代码
        'DefaultOption',        //默认排序方向+板块代码 (尽量使用这个默认值)
    ],

    STOCK_FIELD_NAME:JSCommonStock.STOCK_FIELD_NAME,    //把字段类型导出
    
    data() 
    {
        let data =
        {
            OrderFiled:JSCommonStock.STOCK_FIELD_NAME.INCREASE,      //排序字段
            Symbol:'CNA.ci',    //板块代码
            Order:-1,           //排序方向 -1 /1
            JSStock: null,      //数据模块
            BlockData:{MateData:[],TableData:[]},
            TableCaption:'',
            RowIndex:-1,
            TableCount:15,
            IsRate:true
        }

        return data;
    },

    created() 
    {
        if (this.DefaultOrderFiled) this.OrderFiled=this.DefaultOrderFiled;
        if (this.DefaultOrder===-1 || this.DefaultOrder===1) this.Order=this.DefaultOrder;

        if (this.DefaultOption)
        {
            if (this.DefaultOption.OrderFiled) this.OrderFiled=this.DefaultOption.OrderFiled;
            if (this.DefaultOption.Order===-1 || this.DefaultOption.Order===1) this.Order=this.DefaultOption.Order;
        }

        if (this.DefaultSymbol) this.Symbol=this.DefaultSymbol;
    },

    mounted() 
    {
        this.OnSize();
        this.JSStock = JSCommonStock.JSStock.GetBlockMember(this.Symbol);
        this.InitalStock();
        this.JSStock.RequestData();
    },
    methods: 
    {
        selectCurrRow(index){
            this.RowIndex = index;
        },
        OnSize: function ()   //动态调整UI
        {
            var rankingList = this.$refs.rankingList;
            var height = rankingList.clientHeight;
            var width = rankingList.clientWidth;
            var captionHeight = 26;
            var mainHeight = height - captionHeight;
            var lineHeight = 20;
            this.TableCount = Math.floor(mainHeight / lineHeight);

            if(this.JSStock) 
            {
                var oldPageSize=this.JSStock.PageSize;
                if (this.TableCount>15) this.JSStock.PageSize=this.TableCount+5;
                else this.JSStock.PageSize=15;

                if (oldPageSize<this.TableCount) this.UpdateData(this.JSStock);
                else this.JSStock.RequestData(); //重新请求
            }
        },

        InitalStock:function()
        {
            this.JSStock.SetField([
                JSCommonStock.STOCK_FIELD_NAME.SYMBOL, JSCommonStock.STOCK_FIELD_NAME.PRICE, 
                JSCommonStock.STOCK_FIELD_NAME.NAME,JSCommonStock.STOCK_FIELD_NAME.YCLOSE,this.OrderFiled]);
            this.JSStock.SetOrder(this.OrderFiled, this.Order);
            this.JSStock.OrderNull=1;   //过滤掉null股票
            this.JSStock.PageSize=15;
            this.JSStock.UpdateUICallback = this.UpdateData;
        },

        ChangeSymbol:function(symbol)
        {
            console.log(`[stockorder::ChangeSymbol] symbol: ${symbol}`);
            if (this.Symbol==symbol) return;
            this.Symbol=symbol;
            if (this.JSStock) 
            {
                this.JSStock.Stop();
                this.JSStock.Symbol=this.Symbol;
                this.JSStock.IsAutoUpdate=true;
                this.JSStock.RequestData(); 
            }
        },

        //数据到达
        UpdateData: function (jsStock) 
        {
            console.log('[StockOrder::UpdateData] recv data', jsStock);
            var aryData=[];
            for(var i in jsStock.Data)
            {
                var item=jsStock.Data[i];
                var name=item.Name;         //股票名称
                var price=item.Price;       //最新价格
                var yClose=item.YClose;     //前收盘价
                var value;
                switch(this.OrderFiled)
                {
                    case JSCommonStock.STOCK_FIELD_NAME.INCREASE: //涨幅
                        this.TableCaption = '涨幅排名';
                        this.IsRate = true;
                        value=item.Increase;
                        break;

                    //分钟跌速
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_1:
                        this.TableCaption = '1分钟跌速排名';
                        this.IsRate = true;
                        value=item.RiseFallSpeed.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_3:
                        this.TableCaption = '3分钟跌速排名';
                        this.IsRate = true;
                        value=item.RiseFallSpeed.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_5:
                        this.TableCaption = '5分钟跌速排名';
                        this.IsRate = true;
                        value=item.RiseFallSpeed.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_10:
                        this.TableCaption = '10分钟跌速排名';
                        this.IsRate = true;
                        value=item.RiseFallSpeed.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.RISEFALLSPEED_15:
                        this.TableCaption = '15分钟跌速排名';
                        this.IsRate = true;
                        value=item.RiseFallSpeed.M15;
                        break;

                    //振幅
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_1:
                        this.TableCaption = '1分钟振幅排名';
                        this.IsRate = true;
                        value=item.MinuteAmplitude.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_3:
                        this.TableCaption = '3分钟振幅排名';
                        this.IsRate = true;
                        value=item.MinuteAmplitude.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_5:
                        this.IsRate = true;
                        this.TableCaption = '5分钟振幅排名';
                        value=item.MinuteAmplitude.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_10:
                        this.IsRate = true;
                        this.TableCaption = '10分钟振幅排名';
                        value=item.MinuteAmplitude.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMPLITUDE_15:
                        this.TableCaption = '15分钟振幅排名';
                        this.IsRate = true;
                        value=item.MinuteAmplitude.M15;
                        break;

                    //成交金额
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_1:
                        this.TableCaption = '1分钟成交金额排名';                    
                        this.IsRate = false;
                        value=item.MAmount.M1;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_3:
                        this.TableCaption = '3分钟成交金额排名';
                        this.IsRate = false;
                        value=item.MAmount.M3;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_5:
                        this.TableCaption = '5分钟成交金额排名';
                        this.IsRate = false;
                        value=item.MAmount.M5;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_10:
                        this.TableCaption = '10分钟成交金额排名';
                        this.IsRate = false;
                        value=item.MAmount.M10;
                        break;
                    case JSCommonStock.STOCK_FIELD_NAME.MINUTE_AMOUNT_15:
                        this.TableCaption = '15分钟成交金额排名';
                        this.IsRate = false;
                        value=item.MAmount.M15;
                        break;
                }

                this.TableCaption=DefaultData.GetBlockName(this.Symbol)+this.TableCaption;  //标题加上板块的名字
                // console.log(`[StockOrder::UpdateData] name:${name} price:${price} yClose:${yClose} value:${value}`);
                var item={ Name:'', Price:{Text:'',Color:''}, FieldValue:{Text:'',Color:''} };
                item.Name = name;
                item.Price.Text = DataFormat.StockStringFormat.FormatValueString(price,2);
                item.Price.Color = DataFormat.StockStringFormat.FormatValueColor(price,yClose);
                item.FieldValue.Text = this.IsRate ? DataFormat.StockStringFormat.FormatValueString(value,2) + '%' : DataFormat.StockStringFormat.FormatValueString(value,2);
                item.FieldValue.Color = DataFormat.StockStringFormat.FormatValueColor(value,0);
                aryData.push(item);

                //TODO:判断目前的数组高度是否大于表格高度
            }

            this.BlockData.MateData=aryData;
            this.BlockData.TableData = this.BlockData.MateData.slice(0,this.TableCount);
        }
    }
        
}


</script>

<style scoped lang='less'>
    * {margin: 0;padding: 0;}
    html,body,table {
        font: 14px 'Simsun';
        color: #333;
    }
    
    .rankingList {
        width: 100%;
        height: 100%;
        /* box-sizing: border-box;
        border-right: 1px solid #ccc; */

        .table {
            width: 100%;
            border-collapse:collapse;
            border-spacing: 0;
            caption 
            {
                /*border-top: 1px solid #ccc;*/
                border-bottom: 1px solid #ccc;
                line-height: 24px;
                background-color: #ebebeb;

            }
            tr.active {
                background-color: #edf1f3;
            }
            td,th {
                line-height: 20px;
                padding: 0 3px;
                width: 33%;
            }
            tr>td:nth-of-type(2),tr>td:nth-of-type(3){
                text-align: right;
            }
            /*tr>td:nth-of-type(3)
            {
                border-right: 1px solid #ccc;
            }*/
            .PriceUp {
                color: red;
            }
            .PriceDown{
                color: green;
            }
        }
    }
</style>