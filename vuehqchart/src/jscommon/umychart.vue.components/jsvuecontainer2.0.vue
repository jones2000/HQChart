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
                            <input type="radio" id='One' value='Dialog.ChoiceData[0].ClassName' v-model='BlockType'>
                            <label for='One'>{{Dialog.ChoiceData[0].TypeText}}</label>
                        </div>
                    </div>
                    <div class="choiceItem">
                        <div class="typeText">
                            <input type="radio" id='Two' value='Dialog.ChoiceData[1].ClassName' v-model='BlockType'>
                            <label for='Two'>{{Dialog.ChoiceData[1].TypeText}}</label>
                        </div>
                        <p class='choices'><span v-for='(choice,ind) in Dialog.ChoiceData[1].Tab1' :key='ind' @click='ChoicebBlock(Dialog.ChoiceData[1].Tab1,choice,ind)' :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                        <p class='choices' v-show='Dialog.ChoiceData[1].Tab2.length > 0'><span v-for='(choice,flag) in Dialog.ChoiceData[1].Tab2' :key='flag' @click='ChoicebBlock(Dialog.ChoiceData[1].Tab2,choice,flag)' :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    </div>
                    <div class="choiceItem">
                        <div class="typeText">
                            <input type="radio" id='Three' value='Dialog.ChoiceData[2].ClassName' v-model='BlockType'>
                            <label for='Three'>{{Dialog.ChoiceData[2].TypeText}}</label>
                        </div>
                        <p class='choices'><span v-for='(choice,ind) in Dialog.ChoiceData[2].Tab1' :key='ind' @click='ChoicebBlock(Dialog.ChoiceData[2].Tab1,choice,ind)' :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                        <p class='choices' v-show='Dialog.ChoiceData[2].Tab2.length > 0'><span v-for='(choice,flag) in Dialog.ChoiceData[2].Tab2' :key='flag' @click='ChoicebBlock(Dialog.ChoiceData[2].Tab2,choice,flag)' :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    </div>
                    <!-- <div class="choiceItem" v-for='(choiceItem,index) in Dialog.ChoiceData' :key='index'>
                        <p class="typeTitle">{{choiceItem.TypeText}}</p>
                        <p class='choices'><span v-for='(choice,ind) in choiceItem.Tab1' :key='ind' @click='ChoicebBlock(choiceItem.Tab1,choice,ind)' :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                        <p class='choices' v-show='choiceItem.Tab2.length > 0'><span v-for='(choice,flag) in choiceItem.Tab2' :key='flag' @click='ChoicebBlock(choiceItem.Tab2,choice,flag)' :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    </div> -->
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
    let data = [
                    {
                        TypeText:'走势图',                        
                        ClassName:'StockChart',
                        Tab1:[
                            {Text:'走势图',ActiveIndex:-1}
                        ],
                        Tab2:[],
                        IsShow:true,
                        IsGoAdding:false
                    },
                    {
                        TypeText:'k线图',              
                        ClassName:'StockChart',
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
                    {
                        TypeText:'行情数据',
                        ClassName:'StockOrder',
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
                ];
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
            console.log('[container::AddBlock]ChoiceData:',this.Dialog.ChoiceData);
            var addBlocks = [];//{}
            for(let i =0; i < this.Dialog.ChoiceData.length; i++){
                var typeText = this.Dialog.ChoiceData[i].TypeText;
                var tab1 = this.Dialog.ChoiceData[i].Tab1;
                var tab2 = this.Dialog.ChoiceData[i].Tab2;
                if(tab1.length > 0){
                    for(let j = 0; j < tab1.length; j++){
                        var item = tab1[j];
                        var optionText = item.Text;
                        if(item.ActiveIndex > -1){
                            this.ShowSelectedBlock(typeText,optionText)
                        }
                    }
                }
            }
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
        ChoicebBlock(tabItem,choice,index){
            for(let i = 0; i < tabItem.length; i++){
                var tabChoice = tabItem[i];
                if(i == index && tabChoice.ActiveIndex == -1){
                    tabChoice.ActiveIndex = index; //选中
                }else{
                    tabChoice.ActiveIndex = -1;  //取消选择
                }
            }
            
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