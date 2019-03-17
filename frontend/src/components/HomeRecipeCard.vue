<template>
  <b-card
    no-body
    class="m-0 h-100 border border-primary home-recipe-card"
  >
    <b-card-img :src="imageUrl" bottom class="card-img-top"/>
    <b-card-body class="pt-3">
      <b-link :to="'/entries/' + entry.slug">
        <h5>{{ entry.name }}</h5>
      </b-link>
      <b-card-text>
        {{ entry.desc }}
      </b-card-text>
    </b-card-body>
    <b-card-footer>🕐{{ createdAt }}</b-card-footer>
  </b-card>
</template>

<script>
const moment = require('moment')

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
          imageId: '',
          updatedAt: ''
        }
      }
    }
  },
  computed: {
    createdAt () {
      return moment(this.entry.createdAt).format('MMM Do YY')
    },
    updatedAt () {
      return moment(this.entry.updatedAt).format('MMM Do YY')
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
  text-align: left;
  margin: 0 auto;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  transition: .15s all ease-in-out;
}

.home-recipe-card:hover {
  transform: scale(1.025);
}

.home-recipe-card .card-footer {
  font-size: 12pt;
}

.home-recipe-card .card-text {
  text-align: left;
  font-size: 12pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-recipe-card .card-img-top {
  width: 100%;
  height: 10vw;
  object-fit: cover;
}
</style>
