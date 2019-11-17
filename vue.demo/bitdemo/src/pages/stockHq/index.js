import Promise from 'promise-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'

if (!window.Promise) {  
  window.Promise = Promise;  
}  

Vue.use(ElementUI,{ locale })

new Vue({
  el: '#app',
  render: h => h(App)
})

