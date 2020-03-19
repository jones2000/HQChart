<template>
    <div id="app">
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
      document.title = "横屏行情";
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
  