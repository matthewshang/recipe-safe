<template>
  <div class="entry">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div v-if="entry" class="entry-content">
      <h2>{{ entry.name }}</h2>
      <p>{{ entry.desc }}</p>
    </div>
  </div>
</template>

<script>
import Api from '../api.js'

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

      const slug = this.$route.params.slug
      this.loading = false
      Api.get('entries/' + slug)
        .then((res) => {
          this.entry = res.data
        })
        .catch((err) => {
          console.log(err)
          this.$router.replace('/not-found')
        })
    }
  }
};
</script>

<style>
</style>