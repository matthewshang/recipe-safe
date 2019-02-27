<template>
  <div id="recipe-entry">
    <h1>{{ entry.name }}</h1>
  </div>
</template>

<script>
export default {
  name: 'RecipeEntry',
  data() {
    return {
      entry: {
        name: 'Fried Rice'
      }
    };
  }
};
</script>

<style>
</style>
