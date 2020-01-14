<template>
  <div class="subindex" >
    <div v-show="FrameId == 1">
      <div class="close"><i class="close-icon el-icon-close" @click="CloseModal"></i></div>
      <ul :style="{width: Height + 'px',height: Height+ 'px'}">
        <li v-for="(item,index) in FrameList" :key="index" :class="{activeL:ActiveIndex1==index}" @click="ChangeSubindex(item)">{{item}}</li>
      </ul>
    </div>    
    <div v-show="FrameId == 2">
      <div class="close"><i class="close-icon el-icon-close" @click="CloseModal"></i></div>
      <ul :style="{width: Height + 'px',height: Height+ 'px'}">
        <!-- <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li> -->
        <li v-for="(item,index) in FrameList" :key="index" :class="{activeL:ActiveIndex2==index}" @click="ChangeSubindex(item)">{{item}}</li>
      </ul>
    </div>
    <div v-show="FrameId == 3">
      <div class="close"><i class="close-icon el-icon-close" @click="CloseModal"></i></div>
      <ul :style="{width: Height + 'px',height: Height+ 'px'}">
        <!-- <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li> -->
        <li v-for="(item,index) in FrameList" :key="index" :class="{activeL:ActiveIndex3==index}" @click="ChangeSubindex(item)">{{item}}</li>
      </ul>
    </div>
    <div v-show="FrameId == 4">
      <div class="close"><i class="close-icon el-icon-close" @click="CloseModal"></i></div>
      <ul :style="{width: Height + 'px',height: Height+ 'px'}">
        <!-- <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li> -->
        <li v-for="(item,index) in FrameList" :key="index" :class="{activeL:ActiveIndex4==index}" @click="ChangeSubindex(item)">{{item}}</li>
      </ul>
    </div>
    <div v-show="FrameId == 5">
      <div class="close"><i class="close-icon el-icon-close" @click="CloseModal"></i></div>
      <ul :style="{width: Height + 'px',height: Height+ 'px'}">
        <!-- <li><i class="close-icon el-icon-close" @click="CloseModal"></i></li> -->
        <li v-for="(item,index) in FrameList" :key="index" :class="{activeL:ActiveIndex5==index}" @click="ChangeSubindex(item)">{{item}}</li>
      </ul>
    </div>
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
        Height:0,
        Width:0,
      }  
    },
    created(){
      var width = window.innerWidth;
      var height = window.innerHeight;
      
      this.Height = width;
      this.Width = height;
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
  .activeL{
    color: #f29702!important;
  }

  .subindex{
    >div{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      .close{
        position: absolute;
        bottom: 20px;
        right: 5px;
        width: 41px;
        height:41px;
        font-size: 26px;
        color: #ffffff;
      }
      ul{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        // padding-top: 40px;
        // box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        color: #333333;
        transform:rotate(90deg);
        transform-origin:center 50%;
        overflow: auto;
        // border-radius: 0px 15px 15px 0px;
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
  }
</style>