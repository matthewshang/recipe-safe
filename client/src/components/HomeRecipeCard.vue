<template>
  <b-card
    no-body
    :img-src="require(`@/assets/images/friedrice.jpg`)"
    class="m-0 border border-primary home-recipe-card"
  >
    <b-card-body>
      <b-link :to="'/entries/' + entry.slug">
        <h4>{{ entry.name }}</h4>
      </b-link>
      <b-card-text class="card-descrip">
        {{ entry.desc }}
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'HomeRecipeCard',
  props: {
    entry: {
      type: Object,
      default () {
        return {
          name: 'unknown',
          slug: 'not-found'
        }
      }
    }
  }
};
</script>

<style>
.home-recipe-card {
  text-align:center;
  margin: 0 auto;
  width: 100%;
}
.card-descrip {
  font-size:100%;
  text-align:left;
}
</style>
