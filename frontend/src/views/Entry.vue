<template>
  <div> 
    <b-container v-if="entry" id="entry-content">
      <h1 class="my-3">{{ entry.name }}</h1>
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

      <div class="d-flex">
        <h2>Ingredients</h2>
        <b-button variant="outline-primary" @click="showAddIngre = !showAddIngre" class="ml-2 h-50">+</b-button>
        <b-form-input 
          v-show="showAddIngre" v-model="ingredient" type="text" 
          placeholder="Enter an ingredient"
          class="ml-2"
          @keyup.enter="addIngredient"/>
      </div>
      <div v-if="entry.ingredients.length != 0" class="mb-4">
        <b-list-group>
          <b-list-group-item v-for="(item, index) in entry.ingredients" :key="index">
            {{ item }}
          </b-list-group-item>
        </b-list-group>      
      </div>
      <p v-else>No ingredients stored.</p>

      <div class="d-flex">
        <h2>Steps</h2>
        <b-button variant="outline-primary" @click="showAddStep = !showAddStep" class="ml-2 h-50">+</b-button>
        <b-form-input 
          v-show="showAddStep" v-model="step" type="text" 
          placeholder="Enter a step"
          class="ml-2"
          @keyup.enter="addStep"/>
      </div>
      <div v-if="entry.steps.length != 0" class="mb-4">
        <ol>
          <li v-for="(step, index) in entry.steps" :key="index" class="my-2">
            {{ step }}
          </li>
        </ol>
      </div>
      <p v-else>No steps stored.</p>

    </b-container>
  </div>
</template>

<script>
import Api from '../api.js'

export default {
  name: 'Entry',
  data () {
    return {
      imageLoading: true,
      entry: null,
      showAddIngre: false,
      ingredient: '',
      showAddStep: false,
      step: ''
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
      this.imageLoading = true

      const slug = this.$route.params.slug
      Api.get('entries/' + slug)
        .then((res) => {
          this.entry = res.data
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
        .then((res) => {
          if (res.data.exists) {
            this.imageLoading = false
          } else {
            setTimeout(() => {
              this.refreshUntilImageExists()
            }, 500)
          }
        })
    },
    getImgUrl () {
      return "http://localhost:3000/api/images/" + this.entry.imageId
    },
    addIngredient() {
      this.showAddIngre = false
      if (this.ingredient) this.entry.ingredients.push(this.ingredient)
      this.ingredient = ''
    },
    addStep() {
      this.showAddStep = false
      if (this.step) this.entry.steps.push(this.step)
      this.step = ''
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