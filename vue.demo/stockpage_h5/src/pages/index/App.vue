<template>
    <div id="app">
      <StockHq></StockHq>
    </div>
  </template>
  
  <script>
  import StockHq from './components/stockHq.vue'
  export default {
    data () {
      return {
  
      }  
    },
    components:{
      StockHq
    },
    created(){
      document.title = "行情页面";
    }
  }
  </script>
  
  <style>
  body,#app{
    height: 100%;
    width: 100%;
  }
  html,body{
    font: 62.5% "PingFang-SC-Regular", 'Microsoft Yahei';
  }
  </style>
  