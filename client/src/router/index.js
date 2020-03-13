import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "main" */ '../views/main.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
