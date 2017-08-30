import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import GoodsList from '@/view/GoodsList'
import Cart from '@/view/Cart'

Vue.use(Router)

import '@/assets/css/base'
import '@/assets/css/checkout'
import '@/assets/css/login'
import '@/assets/css/product'

export default new Router({
  // mode: 'hash',
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
