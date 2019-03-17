<template>
  <b-card
    no-body
    class="m-0 h-100 border border-primary home-recipe-card"
  >
    <b-card-img :src="imageUrl" bottom class="card-img-top"/>
    <b-card-body class="pt-3">
      <b-link :to="'/entries/' + entry.slug">
        <h6>{{ entry.name }}</h6>
      </b-link>
      <b-card-text class="card-descrip">
        {{ entry.desc }}
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import Api from '../api.js'

export default {
  name: 'HomeRecipeCard',
  props: {
    entry: {
      type: Object,
      default () {
        return {
          name: 'unknown',
          slug: 'not-found',
          imageId: ''
        }
      }
    }
  },
  data () {
    return {
      imageUrl: require(`@/assets/images/white.png`)
    }
  },
  created () {
    const id = this.$props.entry.imageId
    if (id) {
      Api.get('imagestatus/' + id)
        .then((res) => {
          if (res.data.exists) {
            this.imageUrl =  'http://localhost:3000/api/images/' + id
          }
        })
    }
  }
};
</script>

<style>
.home-recipe-card {
  text-align:center;
  margin: 0 auto;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  transition: .15s all ease-in-out;
}

.home-recipe-card:hover {
  transform: scale(1.025);
}

.card-descrip {
  font-size:90%;
  text-align:left;
}

.card-img-top {
  width: 100%;
  height: 10vw;
  object-fit: cover;
}
</style>
