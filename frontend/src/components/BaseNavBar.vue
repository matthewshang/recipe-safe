<template>
  <b-navbar type="dark" variant="primary"> 
    <b-navbar-brand :to="{ path: '/' }">RecipeSafe</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item :to="{ path: '/' }">Home</b-nav-item>
      <b-nav-item :to="{ path: '/import' }">Import</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown text="User" right>
        <b-dropdown-item :to="{ path: '/notfound' }">Account</b-dropdown-item>
        <b-dropdown-item :to="{ path: '/notfound' }">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
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