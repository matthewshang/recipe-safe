<template>
  <div>
    <b-container id="top-bar-container" class="my-3 d-flex">
      <b-input-group prepend="Search" class="mr-2">
        <b-form-input
          v-model="query"
          type="search"
          id="top-search-box"
        />
      </b-input-group>
      <b-dropdown text="Sort by" variant="outline-primary" class="mr-2">
        <b-dropdown-item @click="sortMode = 'date'">Date</b-dropdown-item>
        <b-dropdown-item @click="sortMode = 'name'">Name</b-dropdown-item>
      </b-dropdown>
      <b-button v-b-modal.modal-entry v-b-tooltip.hover title="Add entry" variant="outline-primary" id="new-recipe-button">+</b-button>
    </b-container>

    <b-modal 
      id="modal-entry" 
      ref="modal"
      title="New Entry"
      @ok="onModalOk"
      @shown="resetForm"
    >
      <b-nav justified pills class="mb-3">
        <b-nav-item :active="tab === 'manual'" @click="tab = 'manual'" class="mx-auto">Manual Entry</b-nav-item>
        <b-nav-item :active="tab === 'url'" @click="tab = 'url'" class="mx-auto">From URL</b-nav-item>
      </b-nav>

      <b-form @submit.stop.prevent="onModalOk" @reset="resetForm">
        <b-form-group label="Name of recipe:">
          <b-form-input type="text" v-model="form.name" required placeholder="Enter name"/>
        </b-form-group>

        <b-form-group v-if="tab === 'url'" label="Recipe URL:">
          <b-form-input type="url" v-model="form.url" placeholder="URL"/>
        </b-form-group>

        <b-form-group label="Description:">
          <b-form-input type="text" v-model="form.desc" placeholder="Describe the recipe. This is optional."/>
        </b-form-group>
      </b-form>
    </b-modal>

    <b-container>
      <b-row v-for="i in rowCount" :key="i" no-gutter>
        <b-col
          v-for="(entry, index) in filteredList.slice((i - 1) * itemsPerRow, i * itemsPerRow)"
          :key="entry.slug + '_' + index"
          class="my-1 mx-0 px-1 col-xs-3 grid-cols"
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
      itemsPerRow: 4,
      query: '',
      sortMode: 'date',
      form: {
        name: '',
        desc: '',
        url: ''
      },
      tab: 'manual'
    };
  },
  created() {
    this.refreshEntries()
  },
  beforeRouteUpdate (to, from, next) {
    this.refreshEntries()
    next()
  },
  computed: {
    rowCount() {
      if (this.entries === null) return 0
      return Math.ceil(this.entries.length / this.itemsPerRow)
    },
    filteredList() {
      const sortByName = ((a, b) => {
        const nA = a.name.toLowerCase(), nB = b.name.toLowerCase()
        if (nA < nB) return -1
        if (nA > nB) return 1
        return 0
      })
      const sortByDate = ((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
      return this.entries
      .filter((entry) => {
        return entry.name.toLowerCase().includes(this.query.toLowerCase())
      })
      .sort(this.sortMode === 'name' ? sortByName : sortByDate)
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    refreshEntries() {
      Api.get('entries').then(res => (this.entries = res.data));
    },
    onModalOk(event) {
      event.preventDefault()
      if (!this.form.name && !this.form.url) {
        alert(`Please enter the ${this.tab === 'manual' ? 'name' : 'url'} of the recipe`)
      } else {
        this.submitForm()
      }
    },
    submitForm() {
      Api.post('entries', this.form)
        .then((res) => {
          const slug = res.headers.slug
          this.$nextTick(() => {
            this.$refs.modal.hide()
          })
          this.$router.push({ name: 'Entry', params: { slug }})
        })
    },
    resetForm(event) {
      event.preventDefault()

      this.form.name = ''
      this.form.desc= ''
      this.form.url = ''
    },
    doSort() {
      this.entries.sort((a, b) => {
        if (this.sortMode === 'date') {
          return new Date(a.createdAt) - new Date(b.createdAt)
        } else {
          return a.name.toLowerCase() < b.name.toLowerCase()
        }
      })
    }
  }
};
</script>

<style>
.grid-cols {
  max-width: 25%;
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