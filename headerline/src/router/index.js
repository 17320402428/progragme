import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/login.vue'
import Index from '../views/login/index.vue'

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
    component: Index
  }
]

const router = new VueRouter({
  routes
})

export default router
