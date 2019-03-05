<template>
  <div>
    <h1>{{ page_title }}</h1>

    <b-container class="home-grid">
      <b-row>
        <b-col
          v-for="(entry, index) in entries"
          :key="entry.slug + '_' + index"
          class="m-0 col-xs-4"
        >
          <home-recipe-card :entry=entry></home-recipe-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Api from '../api.js'
import HomeRecipeCard from '../components/HomeRecipeCard.vue'

export default {
  name: "Home",
  components: {
    'home-recipe-card': HomeRecipeCard
  },
  data() {
    return {
      page_title: "Home",
      entries: null
    }
  },
  created () {
    Api
      .get('entries')
      .then(res => (this.entries = res.data))
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style>
</style>