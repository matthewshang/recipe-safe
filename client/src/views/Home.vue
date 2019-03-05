<template>
  <div>
    <b-container class="home-grid">
      <b-row v-for="i in rowCount" :key="i" no-gutter> 
        <b-col
          v-for="(entry, index) in entries.slice((i - 1) * itemsPerRow, i * itemsPerRow)"
          :key="entry.slug + '_' + index"
          class="m-0 col-xs-4 grid-cols"
        >
          <home-recipe-card :entry="entry"></home-recipe-card>
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
      entries: null,
      itemsPerRow: 3
    }
  },
  created () {
    Api
      .get('entries')
      .then(res => (this.entries = res.data))
  },
  computed: {
    rowCount() {
      if (this.entries === null) return 0
      return Math.ceil(this.entries.length / this.itemsPerRow)
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style>
.grid-cols {
  max-width:33%;
}
</style>