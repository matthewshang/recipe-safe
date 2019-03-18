<template>
  <b-navbar type="dark" variant="primary"> 
    <b-navbar-brand :to="{ path: '/' }">RecipeSafe</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item :to="{ path: '/' }">Home</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  'name': 'BaseNavBar'
}
</script>

<style>
nav {
  font-size: 120%;
}
</style>