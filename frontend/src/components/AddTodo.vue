<template>
  <div>
    <ul v-if="errors.length > 0" class="errors">
      <li v-for="(error, index) in errors" :key="index">{{error}}</li>
    </ul>
    <form>
      <input type="text" v-model="name" placeholder="name">
      <input type="text" v-model="dueDate" placeholder="due date">
      <input type="text" v-model="repeat" placeholder="repeat">
      <button v-on:click="add">Add</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'add-todo',
  data () {
    return {
      name: '',
      dueDate: '',
      repeat: '',
      errors: []
    }
  },
  methods: {
    add: function (event) {
      axios({method: 'POST', url: '/api/todos', data: {name: this.name, dueDate: this.dueDate, repeat: this.repeat}}).then(result => {
        this.errors = []
        this.$emit('add')
      }, error => {
        this.errors = error.response.data.errors
      })
    }
  }
}
</script>

<style scoped>
.errors {
  background-color: #f55;
  padding: 0.5rem 0;
}
</style>
