import Vue from 'vue';
import Router from 'vue-router';
import Goods from '@/components/goods/goods';
import Ratings from '@/components/ratings/ratings';
import Seller from '@/components/seller/seller';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Goods,
      redirect: '/goods'
    },
    { 
      name: 'goods',
      path: '/goods',
      component: Goods
    },
    { 
      name: 'ratings',
      path: '/ratings',
      component: Ratings
    },
    { 
      name: 'seller',
      path: '/seller',
      component: Seller
    } 
  ]
});
