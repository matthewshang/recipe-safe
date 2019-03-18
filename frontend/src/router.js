import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Entry from './views/Entry.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/entries/:slug',
      name: 'Entry',
      component: Entry
    },
    {
      path: '/not-found',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/not-found'
    }
  ]
})
