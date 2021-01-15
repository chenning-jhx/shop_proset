import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import echarts from 'echarts'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入element-ui
import Element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

//导入阿里字体图标
import './assets/fonts/iconfont.css'

//导入nprogress进度条插件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false;

Vue.use(Element);
Vue.use(TreeTable);
Vue.use(VueQuillEditor);


Vue.prototype.$echarts = echarts

//配置请求根路径
Vue.prototype.$http = axios;

//axios 请求拦截器
axios.interceptors.request.use((config) => {
  // console.log(config);
  //请求头中添加Authorization 为token值
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在request拦截器中，显示nprogresss进度条，Nprogress.start()
  Nprogress.start()
  return config;
})

//axios 响应拦截器
axios.interceptors.response.use(config => {
  // 在response拦截器中，隐藏nprogress进度条，Nprogress.done()
  Nprogress.done()
  return config
})

//设置公共请求URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

//定义一个时间过滤器
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear() 
  // 月份从0开始,使她变成字符串,不足两位时,前面补个0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
