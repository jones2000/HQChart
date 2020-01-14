<template>
  <div class="setindex-box">
    <div class="set-index">
      <div class="set-content">
        <div class="set-title">设置参数</div>
        <ul>
          <li v-for="(item,index) in IndexList" :key="index">
            <span>item.Text</span>
            <el-input-number v-model="item.Value"></el-input-number>
          </li>
        </ul>
      </div>
    </div>
  </div>  
</template>

<script>
  
  export default {
    name:'SetindexNum',
    props:[],
    data () {
      return {
        IndexList:[],    //参数
      }  
    },
    created(){
      
    },
    watch:{
      
    },
    mounted(){
      
    },
    methods:{
      
    },
  }
</script>

<style lang="less">
  body,#app{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
    overflow: hidden;
  }
  
  .setindex-box{
    .set-index{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      color: #333333;
      .set-content{
        position: absolute;
        top:calc((100% - 400px)/2);
        width: 100%;
        height: 400px;
        background-color:#ffffff;
      }
    }
  }

</style>