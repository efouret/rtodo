<template>
  <table class="todoList">
      <tbody>
        <template v-for="(todo, index) in todos">
          <tr class="todoList-task" v-bind:class="{'todoList-task--even': index % 2 === 0}" :key="todo.id">
            <td class="todoList-task-details todoList-task-details--checkbox">
              <input type="checkbox" v-bind:id="`todo-checkbox-${todo.id}`" checked>
              <label v-bind:for="`todo-checkbox-${todo.id}`" class="todoList-task-checkbox"></label>
            </td>
            <td class="todoList-task-details">{{todo.name}}</td>
            <td class="todoList-task-details">{{todo.dueDate}}</td>
            <td class="todoList-task-details">{{todo.repeat}}</td>
          </tr>
        </template>
      </tbody>
  </table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'todo-list',
  data () {
    return {
      todos: []
    }
  },
  mounted () {
    axios({method: 'GET', url: '/api/todos'}).then(result => {
      this.todos = result.data
    }, error => {
      console.error(error)
    })
  }
}
</script>

<style scoped>
.todoList {
  width: 100%;
}

.todoList-task {
  background-color: #fff;
}

.todoList-task:hover {
  background-color: #ddd;
  cursor: pointer;
}

.todoList-task-details {
  padding: 0.4rem 0.5rem;
}

.todoList-task-details--checkbox {
  position: relative;
  max-width: 1rem;
}

.todoList-task-details--checkbox input[type="checkbox"] {
  display: none;
}

.todoList-task-checkbox {
  content: '';
  border: 1px solid #70d0d9;
  border-radius: 1rem;
  width: 1rem;
  height: 1rem;
  position: absolute;
}

.todoList-task-details--checkbox input[type="checkbox"]:checked + label {
  background-color: #70d0d9;
}
</style>
