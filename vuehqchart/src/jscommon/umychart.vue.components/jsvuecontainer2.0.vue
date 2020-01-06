<!-- 
    控件容器 
    Control: 自控件数组 { ClassName=控件名字, Size=控件长宽 ,默认值只使用 DefaultSymbol=股票代码 , DefaultOption=配置信息全部放在这个结构里面{} }
!-->

<template>
    <div class="jsvuecontainer" ref='jsvuecontainer' style="width:100%;height:100%">
        <div class="controlsWrap">
            <div class='divcontrol' ref='divcontrol' v-for='item in Control' :key='item.ID' v-bind:style="{width:item.Size.Width+'px', height:item.Size.Height+'px'}" >
                <JSLoader ref='control' :DefaultSymbol=item.Symbol :DefaultOption=item.Option :ClassName=item.ClassName :CreateComplete=item.CreateComplete />
            </div>
            <div class="emptyBlock" ref='emptyBlock' @click='ShowDialog'>
                <p>+</p>
            </div>
        </div>
        

        <div class='divJSLoaderAddDialog' v-show='Dialog.IsShow'>
            <JSLoaderAddDialog @closedialog='CloseDialog' @addblock='AddBlock'></JSLoaderAddDialog>
        </div>
    </div>
</template>


<script>

import JSLoader from './jsloader.vue'
import JSLoaderAddDialog from './jsloader.adddialog.vue'


function DefaultData() { };

DefaultData.ID=10;

DefaultData.CreateID=function()
{
    ++DefaultData.ID;
    return DefaultData.ID;
}

DefaultData.GetMinuteChartOption = function(){
    let option = {
                    Type: '分钟走势图', 
                    IsShowCorssCursorInfo:false,
                    Windows:        //指定指标
                    [
                        //{ Index: "KDJ" }
                    ]
                };
    return option;
}

DefaultData.GetKLineChartOption = function() {
    let option = {

    }
    return option;
}


export default 
{
    name:'JSVueContainer',

    components: {JSLoader,JSLoaderAddDialog},

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
            Dialog:{
                IsShow:false,
                ChoiceData:null
            },
            BlockType:''
            
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
        ChangeSymbol(){
            var controls = this.$refs.control;
            for(let i = 0; i < controls.length; i++){
                controls[i].ChangeSymbol(this.Symbol);
            }
        },
        CloseDialog(){
            this.Dialog.IsShow = false;
        },
        AddBlock(blocktype,choiceData){  //增加板块
            this.Dialog.IsShow = false;
            this.BlockType = blocktype;
            if(this.BlockType == '') return;
            var type = this.BlockType;
            var ID = this.CreateID();
            var symbol = this.Symbol;
            var controlObj = {};
            switch(type){
                case '走势图':
                    controlObj = { ClassName:'StockChart', ID:ID,Symbol:symbol, 
                                Option:DefaultData.GetMinuteChartOption(), 
                                Size:{ Width:this.MinSize.Width, Height:this.MinSize.Height }
                            };
                    break;
                case 'K线图':
                    controlObj = this.GetkLineOption(ID,symbol,choiceData);
                    break;
                case '综合排名':
                    controlObj = this.GetHqOption(ID,choiceData);
                    break;
            }
            console.log('[container::AddBlock ]controlObj:',controlObj);
            this.Control.push(controlObj);
           
        },
        GetHqOption(ID,choiceData){
            var controlObj = {};
            var symbol = '';
            var orderFiled = 0;
            var tab1 = choiceData.HqData.Tab1;
            var tab2 = choiceData.HqData.Tab2;
            for(let i = 0; i < tab1.length; i++){
                var symbolText = tab1[i];
                if(symbolText.ActiveIndex > -1){
                    var text = symbolText.Text;
                    switch(text){
                        case '沪深A股':
                            symbol='CNA.ci';
                            break;
                        case '上证A股':
                            symbol='SHA.ci';
                            break;
                        case '深证A股':
                            symbol='SZA.ci';
                            break;
                        case '创业板':
                            symbol='GEM.ci';
                            break;
                    }
                }
            }
            for(let j=0; j < tab2.length; j++){
                var riseText = tab2[j];
                if(riseText.ActiveIndex > -1){
                    var text = riseText.Text;
                    switch(text){
                        case '涨幅排名':
                            orderFiled = 11;
                            break;
                        case '跌幅排名':
                            orderFiled = 39 //3分钟跌速排名
                            break;
                    }
                }
            }
            var that = this;
            controlObj = { ClassName:'StockOrder', ID:ID,Symbol:symbol, Option: { OrderFiled:orderFiled, Order:-1 } , 
                Size:{ Width:this.MinSize.Width, Height:this.MinSize.Height },
                CreateComplete:function(jsLoader) { that.OnControlCreateCompete(jsLoader); }
            }
            return controlObj;
        },
        GetkLineOption(ID,symbol,choiceData){
            //获取复权
            //获取周期
            console.log('[::GetkLineOption]symbol:',symbol);
            var controlObj = {};
            var right = 0;
            var period = 0;
            // var kline = {Right:null,Period:null};
            var tab1 = choiceData.KLineChoice.Tab1;
            var tab2 = choiceData.KLineChoice.Tab2;
            for(let i = 0; i < tab1.length; i++){
                var rightText = tab1[i];
                if(rightText.ActiveIndex > -1){
                    var text = rightText.Text;
                    if(text == '复权'){
                        right = 1;
                    }else if(text == '不复权'){
                        right = 0;
                    }
                }
                
            }
            for(let j = 0; j < tab2.length; j++){
                var periodText = tab2[j];
                if(periodText.ActiveIndex > -1){
                    var text = periodText.Text;
                    switch(text){
                        case '日线':
                            period = 0;
                            break;
                        case '周线':
                            period = 1;
                            break;
                        case '月线':
                            period = 2;
                            break;
                        case '1分钟':
                            period = 4;
                            break;
                        case '5分钟':
                            period = 5;
                            break;
                        case '15分钟':
                            period = 6;
                            break;
                    }
                }
            }
            
            var that = this;
            controlObj = { ClassName:'StockChart', ID:ID,Symbol:symbol, 
                Option:
                    {
                    Type: '历史K线图', 
                    IsShowCorssCursorInfo:false,
                    KLine:
                        {
                            Right:right,                    //复权 0 不复权 1 前复权 2 后复权
                            Period:period,                   //周期 0 日线 1 周线 2 月线 3 年线 
                        }
                    }, 
                Size:{ Width:this.MinSize.Width, Height:this.MinSize.Height},
                CreateComplete:function(jsLoader) { that.OnControlCreateCompete(jsLoader); }
            };
            return controlObj;
        },
        ShowSelectedBlock(typeText,optionText){
            var ID = this.CreateID();
            var symbol = this.Symbol;
            var controlObj = {};
            switch(typeText){
                case '走势图':
                    controlObj = { ClassName:'StockChart', ID:ID,Symbol:symbol, 
                                    Option:
                                        {
                                        Type: '分钟走势图', 
                                        IsShowCorssCursorInfo:false,
                                        Windows:        //指定指标
                                        [
                                            //{ Index: "KDJ" }
                                        ]
                                        }, 
                                    Size:{ Width:this.MinSize.Width, Height:this.MinSize.Height }
                                };
                    
                    break;
                case 'k线图':
                    break;
                case '行情数据':
                    break;
            }
            this.Control.push(controlObj);
        },
        
        
        ShowDialog(){
            this.Dialog.IsShow = true;
        },
        CreateID:DefaultData.CreateID,

        //单个控件创建完成事件
        OnControlCreateCompete(jsLoader)
        {
            console.log('[JSVueContainer::OnControlCreateCompete]', jsLoader); 
            this.OnSize();
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

            this.MinSize.Width = parseInt(width/3-0.5) - marginW - borderW;   //3等份
            this.MinSize.Height = this.MinSize.Width*3/4;    //width:height = 4:3

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
                item.GetControl().OnSize();
            }
        }
    }
}

</script>

<style scoped lang='less'>
    * {margin: 0; padding: 0;}
    .jsvuecontainer{
        font: 14px 'Microsoft Yahei';
        position: relative;
        .controlsWrap {
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
                    cursor: default;
                }
            }
        }
        .controlsWrap::after{
            content: '';
            width: 0;
            height: 0;
            display: block;
            clear: both;
        }
        .divJSLoaderAddDialog{
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        
    }
</style>