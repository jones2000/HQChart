<!-- 
    控件容器 
    Control: 自控件数组 { ClassName=控件名字, Size=控件长宽 ,默认值只使用 DefaultSymbol=股票代码 , DefaultOption=配置信息全部放在这个结构里面{} }
!-->

<template>
    <div class="jsvuecontainer" ref='jsvuecontainer' style="width:100%;height:100%">
        <div class="controlsWrap">
            <div class='divcontrol' ref='divcontrol' v-for='item in Control' :key='item.ID' v-bind:style="{width:item.Size.Width+'px', height:item.Size.Height+'px'}" >
                <JSLoader  ref='control' :DefaultSymbol=item.Symbol :DefaultOption=item.Option :ClassName=item.ClassName :CreateComplete=item.CreateComplete />
            </div>
            <div class="emptyBlock" ref='emptyBlock' @click='ShowDialog'>
                <p>+</p>
            </div>
        </div>
        

        <div class='dialogContainer' v-show='Dialog.IsShow'>
            <div class="dialogWrap">
                <div class="title">添加模块<span class='clostBtn' @click='CloseDialog'><i class='iconfont icon-drawicon_close'></i></span></div>
                <div class="content">
                    <div class="choiceItem">
                        <div class="typeText">
                            <input type="radio" id='One' :value='Dialog.ChoiceData.MinutChartChoice.TypeText' v-model='BlockType'>
                            <label for='One'>{{Dialog.ChoiceData.MinutChartChoice.TypeText}}</label>
                        </div>
                    </div>
                    <div class="choiceItem">
                        <div class="typeText">
                            <input type="radio" id='Two' :value='Dialog.ChoiceData.KLineChoice.TypeText' v-model='BlockType'>
                            <label for='Two'>{{Dialog.ChoiceData.KLineChoice.TypeText}}</label>
                        </div>
                        <p class='choices' v-show='Dialog.ChoiceData.KLineChoice.Tab1.length > 0'><span v-for='(choice,ind) in Dialog.ChoiceData.KLineChoice.Tab1' :key='ind' @click='ChoicebBlock(Dialog.ChoiceData.KLineChoice,Dialog.ChoiceData.KLineChoice.Tab1,ind)' :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                        <p class='choices' v-show='Dialog.ChoiceData.KLineChoice.Tab2.length > 0'><span v-for='(choice,flag) in Dialog.ChoiceData.KLineChoice.Tab2' :key='flag' @click='ChoicebBlock(Dialog.ChoiceData.KLineChoice,Dialog.ChoiceData.KLineChoice.Tab2,flag)' :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    </div>
                    <div class="choiceItem">
                        <div class="typeText">
                            <input type="radio" id='Three' :value='Dialog.ChoiceData.HqData.TypeText' v-model='BlockType'>
                            <label for='Three'>{{Dialog.ChoiceData.HqData.TypeText}}</label>
                        </div>
                        <p class='choices'><span v-for='(choice,ind) in Dialog.ChoiceData.HqData.Tab1' :key='ind' @click='ChoicebBlock(Dialog.ChoiceData.HqData,Dialog.ChoiceData.HqData.Tab1,ind)' :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                        <p class='choices' v-show='Dialog.ChoiceData.HqData.Tab2.length > 0'><span v-for='(choice,flag) in Dialog.ChoiceData.HqData.Tab2' :key='flag' @click='ChoicebBlock(Dialog.ChoiceData.HqData,Dialog.ChoiceData.HqData.Tab2,flag)' :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    </div>
                </div>
                <div class="btns"><button type="button" @click='AddBlock'>确定</button></div>
            </div>
        </div>
    </div>
</template>


<script>

import JSLoader from './jsloader.vue'
import '../umychart.resource/font/iconfont.css'

function DefaultData() { };

DefaultData.ID=10;

DefaultData.CreateID=function()
{
    ++DefaultData.ID;
    return DefaultData.ID;
}
DefaultData.BlockData=function(){
    let data = {
                MinutChartChoice:{
                        TypeText:'走势图',                        
                        ClassName:'StockChart',
                        RadioId:'One',
                        Tab1:[
                            // {Text:'走势图',ActiveIndex:-1}
                        ],
                        Tab2:[],
                        IsShow:true,
                        IsGoAdding:false
                    },
                KLineChoice:{
                        TypeText:'K线图',              
                        ClassName:'StockChart',
                        RadioId:'Two',
                        Tab1:[
                            {Text:'复权',ActiveIndex:-1},
                            {Text:'不复权',ActiveIndex:-1}
                        ],
                        Tab2:[
                            {Text:'日线',ActiveIndex:-1},
                            {Text:'周线',ActiveIndex:-1},
                            {Text:'月线',ActiveIndex:-1},
                            {Text:'1分钟',ActiveIndex:-1},
                            {Text:'5分钟',ActiveIndex:-1},
                            {Text:'15分钟',ActiveIndex:-1}
                        ],
                        IsShow:true,
                        IsGoAdding:false
                    },
                    HqData:{
                        TypeText:'综合排名',
                        ClassName:'StockOrder',
                        RadioId:'Three',
                        Tab1:[
                            {Text:'沪深A股',ActiveIndex:-1},
                            {Text:'上证A股',ActiveIndex:-1},
                            {Text:'深证A股',ActiveIndex:-1},
                            {Text:'创业板',ActiveIndex:-1}
                        ],
                        Tab2:[
                            {Text:'涨幅排名',ActiveIndex:-1},
                            {Text:'跌幅排名',ActiveIndex:-1}
                        ],
                        IsShow:true,
                        IsGoAdding:false
                    }
                };
    return data;
}

export default 
{
    name:'JSVueContainer',

    components: {JSLoader},

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
                ChoiceData:DefaultData.BlockData()
            },
            BlockType:''
        };
    },

    watch:{
        BlockType:function(val){
            switch(val){
                case 'K线图':
                    var tab1 = this.Dialog.ChoiceData.HqData.Tab1;
                    var tab2 = this.Dialog.ChoiceData.HqData.Tab2;
                    this.BackToNotSelect(tab1);
                    this.BackToNotSelect(tab2);
                    break;
                case '综合排名':
                    var tab1 = this.Dialog.ChoiceData.KLineChoice.Tab1;
                    var tab2 = this.Dialog.ChoiceData.KLineChoice.Tab2;
                    this.BackToNotSelect(tab1);
                    this.BackToNotSelect(tab2);
                    break;
            }
        }
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
        CloseDialog(){
            this.Dialog.IsShow = false;
        },
        AddBlock(){  //增加板块
            this.Dialog.IsShow = false;
            if(this.BlockType == '') return;
            console.log('[container::AddBlock]BlockType:',this.BlockType);
            var type = this.BlockType;
            var ID = this.CreateID();
            var symbol = this.Symbol;
            var controlObj = {};
            switch(type){
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
                case 'K线图':
                    controlObj = this.GetkLineOption(ID,symbol);
                    break;
                case '综合排名':
                    controlObj = this.GetHqOption(ID);
                    break;
            }
            console.log('[container::AddBlock ]controlObj:',controlObj);
            this.Control.push(controlObj);

           
        },
        GetHqOption(ID){
            var controlObj = {};
            var symbol = '';
            var orderFiled = 0;
            var tab1 = this.Dialog.ChoiceData.HqData.Tab1;
            var tab2 = this.Dialog.ChoiceData.HqData.Tab2;
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
        GetkLineOption(ID,symbol){
            //获取复权
            //获取周期
            var controlObj = {};
            var right = 0;
            var period = 0;
            // var kline = {Right:null,Period:null};
            var tab1 = this.Dialog.ChoiceData.KLineChoice.Tab1;
            var tab2 = this.Dialog.ChoiceData.KLineChoice.Tab2;
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
        ChoicebBlock(choicetItem,tabItem,index){
            console.log('[container::ChoicebBlock]index:',index);
            var type = this.BlockType;
            if(type == choicetItem.TypeText){
                for(let i = 0; i < tabItem.length; i++){
                    var choice = tabItem[i];
                    if(i == index && choice.ActiveIndex == -1){
                        choice.ActiveIndex = index; //选中
                    }else{
                        choice.ActiveIndex = -1;  //取消选择
                    }
                }
                
            }else{
                this.BackToNotSelect(tabItem);
            }
            
            
        },
        BackToNotSelect(tabItem){ //设置选项为灰色
            // console.log();
            for(let i = 0; i < tabItem.length; i++){
                var choice = tabItem[i];
                choice.ActiveIndex = -1;  //取消选择
            }
            // console.log('回到默认',this.Dialog.ChoiceData.KLineChoice);
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

<style scoped lang='scss'>
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
        .dialogContainer {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            .dialogWrap{
                width: 490px;
                height: 532px;
                box-sizing: border-box;
                position: absolute;
                border:5px solid rgba(0,0,0,.2);
                background-color: #fff;
                left: 50%;
                margin-left: -245px;
                top: 50%;
                margin-top: -266px;
                .title{
                    font-size: 16px;
                    font-weight: 700;
                    height: 40px;
                    line-height: 40px;
                    color: #fff;
                    text-align: center;
                    position: relative;
                    width: 100%;
                    background: #4192fe;
                    background: -webkit-linear-gradient(#71bafe,#4192fe);
                    background: -o-linear-gradient(#71bafe,#4192fe);
                    background: -moz-linear-gradient(#71bafe,#4192fe);
                    background: linear-gradient(#71bafe,#4192fe);
                    .clostBtn {
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        position: absolute;
                        top: 0;
                        right: 0;
                        cursor: pointer;
                    }
                }
                .content{
                    padding: 10px;
                    margin-bottom: 15px;
                    .choiceItem{
                        margin-bottom: 10px;
                        .typeText {
                            height: 30px;
                            >label{
                                display: inline-block;
                                height: 30px;
                                line-height: 30px;
                                color: #ea5405;
                                font-size: 16px;
                                font-weight: 700;
                            }
                        }
                        
                        .choices{
                            height: 26px;
                            margin-bottom: 8px;
                            padding-left: 15px;
                            >span {
                                padding: 0 15px;
                                height: 26px;
                                line-height: 26px;
                                color: #474747;
                                font-size: 14px;
                                margin-right:10px;
                                float: left;
                                background: #eee;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            >span.seleCur {
                                background: #ea5405;
                                color: #fff;
                            }
                            >span:hover {
                                background: #ea5405;
                                color: #fff;
                            }
                        }
                    }
                }
                .btns{
                    height: 36px;
                    >button {
                        width: 156px;
                        height: 36px;
                        line-height: 36px;
                        display: block;
                        margin: 0 auto;
                        background: #067ff6;
                        border: none;
                        outline: none;
                        background: -webkit-linear-gradient(left top,#3098fe,#067ff6);
                        background: -o-linear-gradient(bottom right,#3098fe,#067ff6);
                        background: -moz-linear-gradient(bottom right,#3098fe,#067ff6);
                        background: linear-gradient(to bottom right,#3098fe,#067ff6);
                        color: #fff;
                        border-radius: 18px;
                        font: 16px 'Microsoft Yahei';
                    }
                    >button:hover{
                        background: #ea5405;
                    }
                }
            }
        }
        
    }
</style>