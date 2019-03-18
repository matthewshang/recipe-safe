<template>
  <b-card
    no-body
    border-variant="primary"
    bg-variant="light"
    class="m-0 h-100 home-recipe-card"
  >
    <b-link :to="'/entries/' + entry.slug"/>
    <b-card-img v-if="hasImage" :src="imageUrl" bottom class="card-img-top"/>
    <b-card-body class="pt-3">
      <b-card-title class="text-truncate">{{ entry.name }}</b-card-title>
      <b-card-text>
        {{ description }}
      </b-card-text>
    </b-card-body>
    <b-card-footer class="p-2">🕐{{ createdAt }}</b-card-footer>
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
    },
    hasImage () {
      return this.imageUrl !== ''
    },
    description () {
      const s = this.entry.desc
      const len = this.hasImage ? 25 : 58 
      return s.substring(0, len) + ((s.length > len) ? '…' : '')
    }
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  created () {
    const id = this.$props.entry.imageId
    if (id) {
      Api.get('imagestatus/' + id)
        .then((res) => {
          if (res.data.exists) {
            this.imageUrl =  'http://localhost:3000/api/images/' + id + '.png'
          }
        })
    }
  }
};
</script>

<style>
.home-recipe-card > a {
  position: absolute;
  top: 0; left: 0;
  height: 100%; width: 100%;
}

.home-recipe-card h4 {
  font-size: 15pt;
}

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
  font-size: 11pt;
}

.home-recipe-card .card-text {
  text-align: left;
  font-size: 12pt;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}

.home-recipe-card .card-img-top {
  width: 100%;
  height: 10vw;
  object-fit: cover;
}
</style>
