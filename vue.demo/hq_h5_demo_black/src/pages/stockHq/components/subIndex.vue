<template>
  <div class="subindex" >
    <ul v-show="FrameId == 1">
      <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li>
      <li v-for="(item,index) in FrameList" :key="index" :class="{active:ActiveIndex1==index}" @click="ChangeSubindex(item)">{{item}}</li>
    </ul>
    <ul v-show="FrameId == 2">
      <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li>
      <li v-for="(item,index) in FrameList" :key="index" :class="{active:ActiveIndex2==index}" @click="ChangeSubindex(item)">{{item}}</li>
    </ul>
    <ul v-show="FrameId == 3">
      <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li>
      <li v-for="(item,index) in FrameList" :key="index" :class="{active:ActiveIndex3==index}" @click="ChangeSubindex(item)">{{item}}</li>
    </ul>
    <ul v-show="FrameId == 4">
      <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li>
      <li v-for="(item,index) in FrameList" :key="index" :class="{active:ActiveIndex4==index}" @click="ChangeSubindex(item)">{{item}}</li>
    </ul>
    <ul v-show="FrameId == 5">
      <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li>
      <li v-for="(item,index) in FrameList" :key="index" :class="{active:ActiveIndex5==index}" @click="ChangeSubindex(item)">{{item}}</li>
    </ul>
  </div>  
</template>

<script>

  export default {
    name:'subIndex',
    props:[
      'FrameID',
      'FrameTitle'
    ],
    data () {
      return {
        FrameId: this.FrameID,     //当前窗口
        FrameList:['MACD','VOL','RSI','KDJ','DMA','BIAS','DMI','WR','PSY','ATR','VR','FSL'],   //窗口指标
        ActiveIndex1:0,  //窗口1选中指标
        ActiveIndex2:0,  //窗口2选中指标
        ActiveIndex3:0,  //窗口3选中指标
        ActiveIndex4:0,  //窗口4选中指标
        ActiveIndex5:0,  //窗口5选中指标
      }  
    },
    created(){
      
    },
    watch:{
      FrameID(val){
        this.FrameId = val;
      },
      FrameTitle(val){
        var index = this.FrameList.indexOf(val);
        if(this.FrameId == 1){
          this.ActiveIndex1 = index;
        }else if(this.FrameId == 2){
          this.ActiveIndex2 = index;
        }else if(this.FrameId == 3){
          this.ActiveIndex3 = index;
        }else if(this.FrameId == 4){
          this.ActiveIndex4 = index;
        }else if(this.FrameId == 5){
          this.ActiveIndex5 = index;
        }
      },
    },
    methods:{
      CloseModal(){
        this.FrameId = 0;
        this.$emit('GetWindowID',0);
      },
      ChangeSubindex(item){
        this.$emit('ChangeSubindex',this.FrameId,item);
        this.FrameId = 0;
        this.$emit('GetWindowID',0);
      },
    },
  }
</script>

<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
  }
  .active{
    color: #217cd9;
  }

  .subindex{
    ul{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      padding-top: 40px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      color: #333333;
      li{
        text-align: center;
        line-height: 40px;
        border-bottom: 1px solid #ececec;
      }
      .close-icon{
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 24px;
      }
    }
  }
</style>