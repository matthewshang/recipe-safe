<template>
  <div id="app">
    <base-nav-bar></base-nav-bar>
    <router-view/>
  </div>
</template>

<script>
  import BaseNavBar from './components/BaseNavBar.vue'
  export default {
    data() {
      return {
        myToggle: false
      }
    },
    methods: {
    },
    components: {
      'base-nav-bar': BaseNavBar
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

body {
  overflow-y: scroll;
  /* background-color: #41B3A3; */
}
</style>
