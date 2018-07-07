import Vue from 'vue';
import Router from 'vue-router';
import {
  Home,
  Err
} from './asyncComponents';
Vue.use(Router)
export default new Router({
  mode: "hash",
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/err',
      name: 'error',
      component: Err,
    },
    {
      path: '*',
      redirect: { name: 'error' }
    }
  ]
})
