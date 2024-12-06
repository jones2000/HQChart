import Promise from 'promise-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VueRouter from 'vue-router'
import App from './App.vue'

if (!window.Promise) {  
  window.Promise = Promise;  
}  


Vue.use(ElementUI,{ locale })

Vue.use(VueRouter)

const routes = [
//   { path: '/', redirect:'/App' },
//   { path: '/Bar', component: Bar },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

