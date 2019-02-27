import Vue from 'vue'
import Router from 'vue-router'
import RecipeHome from './views/RecipeHome.vue'
import RecipeEntry from './views/RecipeEntry.vue'
import RecipeAbout from './views/RecipeAbout.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'RecipeHome',
      component: RecipeHome
    },
    {
      path: '/about',
      name: 'RecipeAbout',
      component: RecipeAbout
    },
    {
      path: '/entries/:slug',
      name: 'RecipeEntry',
      component: RecipeEntry
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
