import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 设置axios默认值
axios.defaults.baseURL = 'http://localhost:3000/api'

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-auth-token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      // 如果是认证错误，重定向到登录页
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      // 显示错误信息
      if (error.response.data.message) {
        Vue.prototype.$message.error(error.response.data.message)
      }
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 