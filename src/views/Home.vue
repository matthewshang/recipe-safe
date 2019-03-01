<template>
  <div>
    <h1>{{ page_title }}</h1>

    <b-container class="home-grid">
      <b-row>
        <b-col
          v-for="(entry, index) in entries"
          :key="entry.slug + '_' + index"
          class="col-xs-4"
        >
          <b-card
            :title="entry.name"
            class="home-grid-card"
          >
            <b-card-text>
              Some quick example
            </b-card-text>

          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
        },
        {
          name: "Pizza",
          slug: "pizza"
        }
      ]
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style>
.home-grid-card {
  text-align: center;
}
</style>