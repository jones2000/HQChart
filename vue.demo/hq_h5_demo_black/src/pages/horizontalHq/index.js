import Promise from 'promise-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'
import HorizontalHq from "./components/horizontalHq.vue"

if (!window.Promise) {
  window.Promise = Promise;
}

Vue.use(ElementUI, { locale })
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/HorizontalHq' },
  { path: '/HorizontalHq', component: HorizontalHq },
]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

