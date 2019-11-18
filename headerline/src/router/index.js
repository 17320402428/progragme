import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/login.vue'
import Index from '../views/login/index.vue'
import Welcome from '../views/WelCome/index.vue'
import Article from '../views/article/index.vue'
import artAdd from '../views/atricleAdd/index.vue'
import artEdtior from '../views/articleeditor/index.vue'
import Account from '@/views/account/index.vue'
import Materail from '@/views/material/index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/index', redirect: '/wel' },
      {
        path: '/wel',
        name: 'wel',
        component: Welcome
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/artadd',
        name: 'artadd',
        component: artAdd
      },
      {
        path: '/artedor/:eid',
        name: 'artedor',
        component: artEdtior
      },
      {
        path: '/account',
        name: 'account',
        component: Account
      },
      {
        path: '/material',
        name: 'material',
        component: Materail
        // component: () => import('@/views/material')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 设置守卫，强制登录
router.beforeEach((to, from, next) => {
  let userStor = window.localStorage.getItem('user')
  if (!userStor && to.path === '/index') {
    next('/')
  } else {
    next()
  }
})

export default router
