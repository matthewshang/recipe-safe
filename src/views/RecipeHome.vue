<template>
  <div id="recipe-home">
    <h1>{{ page_title }}</h1>

    <div
      v-for="(entry, index) in entries"
      :key="entry.slug + '_' + index">
      
      <router-link :to="'/' + entry.slug">
        <h2>{{ entry.name }}</h2>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recipe-home',
  data() {
    return {
      page_title: 'Home',
      entries: [
        {
          name: 'Fried Rice',
          slug: 'fried-rice'
        }
      ]
    };
  }
};
</script>
