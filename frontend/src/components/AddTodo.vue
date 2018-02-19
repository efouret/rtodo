<template>
  <div>
    <ul v-if="errors.length > 0" class="errors">
      <li v-for="(error, index) in errors" :key="index">{{error}}</li>
    </ul>
    <form autocomplete="off">
      <div class="input">
        <label for="name">Name</label>
        <input type="text" v-model="name" id="name">
      </div>

      <div class="input">
        <label for="dueDate">Due date</label>
        <input type="text" v-model="dueDate" id="dueDate">
      </div>

      <div class="input">
        <label for="repeat">Repeat</label>
        <input type="text" v-model="repeat" id="repeat">
      </div>

      <div class="input">
        <label for="repeatFrom">Repeat from</label>
        <select v-model="repeatFrom" id="repeatFrom">
          <option></option>
          <option value="completion">Completion date</option>
          <option value="due">Due date</option>
        </select>
      </div>

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
      repeatFrom: null,
      errors: []
    }
  },
  methods: {
    add: function (event) {
      axios({method: 'POST', url: '/api/todos', data: {name: this.name, dueDate: this.dueDate, repeat: this.repeat, repeatFrom: this.repeatFrom}}).then(result => {
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
  background-color: #e65;
  color: #fff;
  padding: 0.5rem;
}

form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  padding: 0.5rem;
}

.input {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

input {
  height: 1.125rem;
}

select {
  height: 1.5rem;
}

button {
  grid-column: 1 / span 2;
}

@media (min-width: 800px) {
  form {
    grid-template-columns: repeat(5, 1fr);
  }

 button {
    grid-column: auto;
  }
}
</style>
