import Promise from 'promise-polyfill'
import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'codemirror/lib/codemirror.css'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'

if (!window.Promise) {  
  window.Promise = Promise;  
}  


Vue.use(ElementUI,{ locale })
Vue.use(VueCodemirror,)

new Vue({
  el: '#app',
  render: h => h(App)
})
