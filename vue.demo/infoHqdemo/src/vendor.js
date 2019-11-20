import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI,{ locale })

if (!window.Promise) {  
    window.Promise = Promise;  
}