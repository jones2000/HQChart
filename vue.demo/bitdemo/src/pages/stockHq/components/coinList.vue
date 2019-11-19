<template>
    <!--品种列表-->
    <div class="tab_cont">
        <dl class="head">
            <dd>
                <span>代币名称</span>
            </dd>
            <dd>
                <span>现市价</span>
            </dd>
            <dd>
                <span>交易金额</span>
            </dd>
        </dl>
        <dl class="c_list" @click="ClickSymbol(item)" :key="item.Symbol" v-for="item in BitList">
            <dd>
                <span class="full-name">{{item.Name}}</span>
                <span class="short-name">{{item.Symbol}}</span>
            </dd>
            <dd>
                <span>{{item.Price.Text}}</span>
            </dd>
            <dd>
                <span>{{item.Vol.Text}}</span>
            </dd>
        </dl>
    </div>
</template>

<script>
import $ from 'jquery'

function keepTwoDecimal(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        return num;
    }
    result = Math.round(num * 100) / 100;
    return result;
};

function numberFormat(value) {
    var param = {};
    var k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i,
        result;
    if(value < k){
        result = keepTwoDecimal(value, 2);
    }else{
        i = Math.floor(Math.log(value) / Math.log(k)); 
    
        result = ((value / Math.pow(k, i))).toFixed(2) + sizes[i];
    }
    return result;
}

function DefaultData() { }

DefaultData.BitList=function()
{
    var data=
    [
        { Name:'以太币', Symbol:"ETH/BTC", FloatPrecision:8, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'莱特币', Symbol:"LTC/BTC", FloatPrecision:8, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null }},

        { Name:'比特币', Symbol:"BTC/KRW", FloatPrecision:0, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null }},
        { Name:'瑞波币', Symbol:"XRP/KRW", FloatPrecision:0, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null }},

        { Name:'TMTG', Symbol:"TMTG/KRW", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
        { Name:'LBXC', Symbol:"LBXC/KRW", FloatPrecision:2, Vol:{Text:'', Value:null}, Price:{Text:'', Value:null } },
    ];

    return data;
}

export default 
{
    name:'BitList',

    data()
    {
        var data=
        {
            BitList:DefaultData.BitList(),
        };

        return data;
    },

    created()
    {
        this.LoadMarketData();
    },

    methods: 
    {
        ClickSymbol(item) 
        {
            this.$emit('ChangeSymbol', item.Symbol, item.Name, item.FloatPrecision)
        },

        LoadMarketData() 
        {
            $.ajax({
                url: 'https://api2.coinzeus.io/ticker/publicSignV2',
                type: 'post',
                success: (res) => { this.RecvMarketData(res); }
            })
        },

        RecvMarketData(recvData)
        {
            var data=recvData.data;
            for(var i in this.BitList)
            {
                var item=this.BitList[i];
                //清空数据
                item.Vol.Text='';
                item.Vol.Value=null;
                item.Price.Text='',
                item.Price.Value=null;

                var dataItem=data[item.Symbol];
                if (!dataItem) continue;

                item.Price.Value=parseFloat(dataItem.nowPrice);
                item.Price.Text=dataItem.nowPrice

                item.Vol.Value=parseFloat(dataItem.tradingValue24);
                var unit = item.Symbol.split('/')[1] === 'BTC' ? 'BTC' : '韩元';
                item.Vol.Text=numberFormat(dataItem.tradingValue24) + unit
            }  
        }
    }
}

</script>

<style lang="less">
/*品种列表*/
.tab_cont{
    border-top: 1px solid #ddd;
    font-size: 14px;
    .head{
        font-weight: bold;
        padding: 4px 0;
    }
    .c_list{
        &:nth-child(even){
            background: #fff;
        }
        dd:nth-child(1){
            color: initial;
        }
        .short-name {
            display: block;
            color: #c4c4c4;
            font-size: 14px;
        }
    }
    dl{
        display: flex;
        align-items: center;
        dd:nth-child(1){
            width: 40%;
            text-align: center;
        }
        dd:nth-child(2){
            width: 32%;
        }
        dd:nth-child(3){
            width: 28%;
        }
    }
}
</style>