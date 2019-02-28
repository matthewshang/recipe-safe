<template>
  <b-navbar> 
    <b-navbar-brand :to="{ path: '/' }">RecipeSafe</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item :to="{ path: '/about' }">About</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  'name': 'BaseNavBar'
}
</script>

<style>
</style>
