<template>
  <section class="home">
    <header class="home-header">
      <a class="home-title-burger"><img src="../assets/burger.svg"></a>
      <h1 class="home-title">List of todos</h1>
      <button class="home-title-add" v-on:click="addVisible = true">+</button>
    </header>
    <main>
      <add-todo v-if="addVisible" v-on:add="todoAdded"></add-todo>
      <todo-list :todos="todos"></todo-list>
    </main>
  </section>
</template>

<script>
import axios from 'axios'
import TodoList from './TodoList'
import AddTodo from './AddTodo'

export default {
  name: 'Home',
  components: {TodoList, AddTodo},
  data () {
    return {
      todos: [],
      addVisible: false
    }
  },
  mounted () {
    this.loadTodos()
  },
  methods: {
    loadTodos: function () {
      axios({method: 'GET', url: '/api/todos'}).then(result => {
        this.todos = result.data
      }, error => {
        console.error(error)
      })
    },
    todoAdded: function (event) {
      this.addVisible = false
      this.loadTodos()
    }
  }
}
</script>

<style scoped>
.home-header {
  color: #fff;
  background-color: #70d0d9;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  padding: 0.3rem 0;
}

.home-title-burger {
  padding: 0.5rem 1rem;
}

.home-title {
  flex-grow: 1;
  text-transform: uppercase;
  padding: 0.5rem 0;
  text-align: center;
}

.home-title-add {
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1.5rem;
  background-color: #fff;
  color: #70d0d9;
  font-size: 1.2rem;
  margin: 0 1rem;
}
</style>
