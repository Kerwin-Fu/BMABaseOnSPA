import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import axios from 'axios';
// 设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 无效 token 的处理
axios.interceptors.response.use((res) => {
  if (res.data.meta.msg === '无效token' && res.data.meta.status === 400) {
    location.href = '/#/login';
  }
  return res;
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
