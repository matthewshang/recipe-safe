<template>
  <div class="entry">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div v-if="entry" class="content">
      <h2>{{ entry.name }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entry',
  data () {
    return {
      loading: false,
      entry: null
    };
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.entry = null
      this.loading = true

      const entries = {
        'fried-rice': {
          name: 'Fried Rice'
        },
        'dumplings': {
          name: 'Dumplings'
        }
      }

      const slug = this.$route.params.slug
      this.loading = false
      if (slug in entries) {
        this.entry = entries[slug]
      } else {
        this.$router.push('/404')
      }
    }
  }
};
</script>

<style>
</style>
