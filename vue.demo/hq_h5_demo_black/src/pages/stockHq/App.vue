<template>
    <div id="app" v-cloak>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  
  export default {
    data () {
      return {
  
      }  
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
  