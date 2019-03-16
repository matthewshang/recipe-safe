<template>
  <div> 
    <p v-if="loading">Loading...</p>
    <b-container v-else id="entry-content">
      <h4 class="my-3">{{ entry.name }}</h4>
      <p>{{ entry.desc }}</p>
      <div v-if="hasImage()" class="d-flex justify-content-center">
        <b-spinner v-if="imageLoading" 
          label="Loading image..."/> 
        <b-container v-else id="image-container">
          <b-img
            :src="getImgUrl()" alt="Screenshot of recipe" 
            fluid center rounded/>
        </b-container>
      </div>
    </b-container>
  </div>
</template>

<script>
import Api from '../api.js'

export default {
  name: 'Entry',
  data () {
    return {
      loading: true,
      imageLoading: true,
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
      this.imageLoading = true

      const slug = this.$route.params.slug
      Api.get('entries/' + slug)
        .then((res) => {
          this.entry = res.data
          this.loading = false
          if (this.hasImage()) {
            this.refreshUntilImageExists()
          }
        })
        .catch(() => {
          this.$router.replace('/not-found')
        })
    },
    hasImage () {
      return !!this.entry.imageId
    },
    refreshUntilImageExists () {
      Api.get('imagestatus/' + this.entry.imageId)
        .then(() => {
          this.imageLoading = false
        })
        .catch(() => {
          setTimeout(() => {
            this.refreshUntilImageExists()
          }, 500)
        })
    },
    getImgUrl () {
      return "http://localhost:3000/api/images/" + this.entry.imageId
    }
  }
};
</script>

<style>
#entry-content > p {
  text-align: left;
  font-size: 14pt;
}
</style>