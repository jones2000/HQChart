<!-- 
    添加动态加载组件对话框
-->
<template>
    <div class='dialogContainer'>
        <div class="dialogWrap">
            <div class="title">添加模块<span class='clostBtn' @click='CloseDialog'><i
                        class='iconfont icon-drawicon_close'></i></span></div>
            <div class="content">
                <div class="choiceItem">
                    <div class="typeText">
                        <input type="radio" id='One' :value='Dialog.ChoiceData.MinutChartChoice.TypeText'
                            v-model='BlockType'>
                        <label for='One'>{{Dialog.ChoiceData.MinutChartChoice.TypeText}}</label>
                    </div>
                </div>
                <div class="choiceItem">
                    <div class="typeText">
                        <input type="radio" id='Two' :value='Dialog.ChoiceData.KLineChoice.TypeText'
                            v-model='BlockType'>
                        <label for='Two'>{{Dialog.ChoiceData.KLineChoice.TypeText}}</label>
                    </div>
                    <p class='choices' v-show='Dialog.ChoiceData.KLineChoice.Tab1.length > 0'><span
                            v-for='(choice,ind) in Dialog.ChoiceData.KLineChoice.Tab1' :key='ind'
                            @click='ChoicebBlock(Dialog.ChoiceData.KLineChoice,Dialog.ChoiceData.KLineChoice.Tab1,ind)'
                            :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    <p class='choices' v-show='Dialog.ChoiceData.KLineChoice.Tab2.length > 0'><span
                            v-for='(choice,flag) in Dialog.ChoiceData.KLineChoice.Tab2' :key='flag'
                            @click='ChoicebBlock(Dialog.ChoiceData.KLineChoice,Dialog.ChoiceData.KLineChoice.Tab2,flag)'
                            :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                </div>
                <div class="choiceItem">
                    <div class="typeText">
                        <input type="radio" id='Three' :value='Dialog.ChoiceData.HqData.TypeText' v-model='BlockType'>
                        <label for='Three'>{{Dialog.ChoiceData.HqData.TypeText}}</label>
                    </div>
                    <p class='choices'><span v-for='(choice,ind) in Dialog.ChoiceData.HqData.Tab1' :key='ind'
                            @click='ChoicebBlock(Dialog.ChoiceData.HqData,Dialog.ChoiceData.HqData.Tab1,ind)'
                            :class='{seleCur:ind == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                    <p class='choices' v-show='Dialog.ChoiceData.HqData.Tab2.length > 0'><span
                            v-for='(choice,flag) in Dialog.ChoiceData.HqData.Tab2' :key='flag'
                            @click='ChoicebBlock(Dialog.ChoiceData.HqData,Dialog.ChoiceData.HqData.Tab2,flag)'
                            :class='{seleCur:flag == choice.ActiveIndex}'>{{choice.Text}}</span></p>
                </div>
            </div>
            <div class="btns"><button type="button" @click='AddBlock'>确定</button></div>
        </div>
    </div>

</template>





<script>
    import '../umychart.resource/font/iconfont.css'

    function DefaultData() { }
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
    export default {
        name: 'JSLoaderAddDialog',
        data() {
            return {
                Dialog:{
                    ChoiceData:DefaultData.BlockData()
                },
                BlockType:''
            };
        },

        props: [],

        //创建
        created: function () {

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

        mounted: function () {

        },

        methods: {
            CloseDialog(){
                this.$emit('closedialog','');
            },
            BackToNotSelect(tabItem){ //设置选项为灰色
                // console.log();
                for(let i = 0; i < tabItem.length; i++){
                    var choice = tabItem[i];
                    choice.ActiveIndex = -1;  //取消选择
                }
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
            AddBlock(){
                this.$emit('addblock',this.BlockType,this.Dialog.ChoiceData);
            }
        }
    }
</script>

<style scoped lang='less'>
    .dialogContainer {
        font: 14px 'Microsoft Yahei';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;

        .dialogWrap {
            width: 490px;
            height: 532px;
            box-sizing: border-box;
            position: absolute;
            border: 5px solid rgba(0, 0, 0, .2);
            background-color: #fff;
            left: 50%;
            margin-left: -245px;
            top: 50%;
            margin-top: -266px;

            .title {
                font-size: 16px;
                font-weight: 700;
                height: 40px;
                line-height: 40px;
                color: #fff;
                text-align: center;
                position: relative;
                width: 100%;
                background: #4192fe;
                background: -webkit-linear-gradient(#71bafe, #4192fe);
                background: -o-linear-gradient(#71bafe, #4192fe);
                background: -moz-linear-gradient(#71bafe, #4192fe);
                background: linear-gradient(#71bafe, #4192fe);

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

            .content {
                padding: 10px;
                margin-bottom: 15px;

                .choiceItem {
                    margin-bottom: 10px;

                    .typeText {
                        height: 30px;

                        >label {
                            display: inline-block;
                            height: 30px;
                            line-height: 30px;
                            color: #ea5405;
                            font-size: 16px;
                            font-weight: 700;
                        }
                    }

                    .choices {
                        height: 26px;
                        margin-bottom: 8px;
                        padding-left: 15px;

                        >span {
                            padding: 0 15px;
                            height: 26px;
                            line-height: 26px;
                            color: #474747;
                            font-size: 14px;
                            margin-right: 10px;
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

            .btns {
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
                    background: -webkit-linear-gradient(left top, #3098fe, #067ff6);
                    background: -o-linear-gradient(bottom right, #3098fe, #067ff6);
                    background: -moz-linear-gradient(bottom right, #3098fe, #067ff6);
                    background: linear-gradient(to bottom right, #3098fe, #067ff6);
                    color: #fff;
                    border-radius: 18px;
                    font: 16px 'Microsoft Yahei';
                }

                >button:hover {
                    background: #ea5405;
                }
            }
        }
    }
</style>