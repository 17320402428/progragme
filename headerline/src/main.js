import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui'
import '@/assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(elementUi)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
