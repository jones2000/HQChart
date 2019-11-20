import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-default/index.css';
import App from './app.vue'

Vue.use(ElementUI, { locale })

new Vue({
  el: '#app',
  render: h => h(App)
})