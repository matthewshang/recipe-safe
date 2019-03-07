<template>
  <div>
    <b-container id="top-bar-container" class="my-3 pl-0 pr-2 d-flex">
      <b-form-input
        v-model="query"
        type="search"
        placeholder="Search for a recipe"
        id="top-search-box"
        class="mr-2"
      />
      <b-button v-b-modal.modal-entry variant="outline-primary" id="new-recipe-button">+</b-button>
    </b-container>

    <b-modal 
      id="modal-entry" 
      ref="modal"
      title="New Entry"
      @ok="onOk"
      @shown="onReset"
    >
      <b-nav justified pills class="mb-3">
        <b-nav-item active class="mx-auto">Manual Entry</b-nav-item>
        <b-nav-item class="mx-auto">From URL</b-nav-item>
      </b-nav>

      <b-form @submit.stop.prevent="onOk" @reset="onReset">
        <b-form-group label="Name of recipe:">
          <b-form-input type="text" v-model="form.name" required placeholder="Enter name"/>
        </b-form-group>

        <b-form-group label="Description:">
          <b-form-input type="text" v-model="form.description" placeholder="Describe the recipe. This is optional."/>
        </b-form-group>
      </b-form>
    </b-modal>

    <b-container>
      <b-row v-for="i in rowCount" :key="i" no-gutter>
        <b-col
          v-for="(entry, index) in entries.slice((i - 1) * itemsPerRow, i * itemsPerRow)"
          :key="entry.slug + '_' + index"
          class="my-1 mx-0 px-1 col-xs-4 grid-cols"
        >
          <home-recipe-card :entry="entry"></home-recipe-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Api from '../api.js';
import HomeRecipeCard from '../components/HomeRecipeCard.vue';

export default {
  name: 'Home',
  components: {
    'home-recipe-card': HomeRecipeCard
  },
  data() {
    return {
      page_title: 'Home',
      entries: null,
      itemsPerRow: 3,
      query: '',
      form: {
        name: '',
        description: ''
      }
    };
  },
  created() {
    Api.get('entries').then(res => (this.entries = res.data));
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
    },
    onOk(event) {
      event.preventDefault()
      if (!this.form.name) {
        alert('Please enter the name of the recipe')
      } else {
        this.submit()
      }
    },
    submit() {
      alert(JSON.stringify(this.form))
      this.$nextTick(() => {
        this.$refs.modal.hide()
      })
    },
    onReset(event) {
      event.preventDefault()

      this.form.name = ''
      this.form.description = ''
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
  width: 100%;
}

#new-recipe-button {
  margin-left: auto;
}
</style>