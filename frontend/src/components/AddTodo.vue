<template>
  <div>
    <form>
      <input type="text" v-model="name" placeholder="name">
      <input type="date" v-model="dueDate" placeholder="due">
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
      repeat: ''
    }
  },
  methods: {
    add: function (event) {
      axios({method: 'POST', url: '/api/todos', data: {name: this.name, dueDate: this.dueDate, repeat: this.repeat}}).then(result => {
        this.$emit('add')
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
