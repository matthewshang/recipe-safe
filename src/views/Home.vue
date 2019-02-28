<template>
  <div>
    <h1>{{ page_title }}</h1>

    <div v-for="(entry, index) in entries" :key="entry.slug + '_' + index">
      <router-link :to="'/entries/' + entry.slug">
        <h2>{{ entry.name }}</h2>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      page_title: "Home",
      entries: [
        {
          name: "Fried Rice",
          slug: "fried-rice"
        },
        {
          name: "Dumplings",
          slug: "dumplings"
        }
      ]
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
  }
};
</script>
