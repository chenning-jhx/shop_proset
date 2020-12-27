import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/login/Login')
const Home = () => import('@/views/home/Home')
const Welcome = () => import('@/views/home/Welcome')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login 
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
        { path: '/welcome', component: Welcome }
    ]
  }
]

const router = new VueRouter ({
  routes,
})

//为router挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //判断是否进入登录页面
  if(to.path === '/login') return next();
  //不是登录页面进入，取出token
  const tokenStr = window.sessionStorage.getItem('token');
  //判断token是否有效
  if(!tokenStr) return next('/login');
  next()
})


export default router;
