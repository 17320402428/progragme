import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui'
import '@/assets/css/global.css'
import axios from 'axios'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(elementUi)
// 配置请求拦截器，添加请求参数
axios.interceptors.request.use(
  function (config) {
    // userinfo并不是始终存在的，要做判断使用
    let userinfo = window.localStorage.getItem('user')
    if (userinfo) {
      let token = JSON.parse(userinfo).token
      // 给axios请求头配置token
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  }
)
// 配置响应拦截器，判断身份是否过期
axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (err) {
    if (err.response.status === 401) {
      router.push('/')
    }
    return Promise.reject(err)
  }
)
// 配置数据转换器，将超过整型的数据处理
axios.defaults.transformResponse = function (data) {
  // data是服务器端给客户端返回的第一手数据，其是String字符串
  // console.log(typeof data) // string
  // 对服务器端返回的数据做json-bigint处理
  // 服务器端会返回 实体字符串 和 空字符串 两种信息，所以要做判断处理
  if (data) {
    return JSONBig.parse(data)
  } else {
    return data
  }
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
