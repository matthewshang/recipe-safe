import Vue from 'vue'
import Router from 'vue-router'
import RecipeHome from './views/RecipeHome.vue'
import RecipeEntry from './views/RecipeEntry.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: RecipeHome
    },
    {
      path: '/:slug',
      name: 'recipe-entry',
      component: RecipeEntry
    }
  ]
})
