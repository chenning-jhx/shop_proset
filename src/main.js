import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入element-ui
import Element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

//导入阿里字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false;

Vue.use(Element);
Vue.use(TreeTable);

//配置请求根路径
Vue.prototype.$http = axios;

//axios 请求拦截器
axios.interceptors.request.use((config) => {
  // console.log(config);
  //请求头中添加Authorization 为token值
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

//设置公共请求URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
