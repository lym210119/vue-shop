import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import GoodsList from '@/view/GoodsList'

Vue.use(Router)

import '@/assets/css/base'
import '@/assets/css/checkout'
import '@/assets/css/login'
import '@/assets/css/product'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: GoodsList
    }
  ]
})
