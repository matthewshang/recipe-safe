<template>
  <div>
    <b-container id="top-bar-container" class="my-3 mx-auto d-flex">
      <b-form-input
        v-model="query"
        type="search"
        placeholder="Search for a recipe"
        id="top-search-box"
        class="mr-2"
      />
      <b-button id="new-recipe-button">+</b-button>
    </b-container>
    <b-container>
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
import Api from "../api.js";
import HomeRecipeCard from "../components/HomeRecipeCard.vue";

export default {
  name: "Home",
  components: {
    "home-recipe-card": HomeRecipeCard
  },
  data() {
    return {
      page_title: "Home",
      entries: null,
      itemsPerRow: 3,
      query: ""
    };
  },
  created() {
    Api.get("entries").then(res => (this.entries = res.data));
  },
  computed: {
    rowCount() {
      if (this.entries === null) return 0;
      return Math.ceil(this.entries.length / this.itemsPerRow);
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
  max-width: 33%;
}

#top-search-box {
  width: 50%;
}

#top-bar-container {
}

#new-recipe-button {
  margin-left: auto;
}
</style>