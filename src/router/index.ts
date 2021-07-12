import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Step 1',
    component: () => import('../views/ChStep1.vue')
  },
  {
    path: '/step2/',
    name: 'Step 2',
    component: () => import('../views/ChStep2.vue')
  },
  {
    path: '/step3/',
    name: 'Step 3',
    component: () => import('../views/ChStep3.vue')
  },
  {
    path: '/step4/',
    name: 'Step 4',
    component: () => import('../views/ChStep4.vue')
  },
  {
    path: '/step5/',
    name: 'Step 5',
    component: () => import('../views/ChStep5.vue')
  },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
