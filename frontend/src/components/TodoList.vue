<template>
  <table class="todoList">
      <thead>
        <tr>
          <th></th>
          <th>Task</th>
          <th>Due date</th>
          <th>Repeat</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(todo, index) in todoList">
          <tr class="todoList-task" :class="{'todoList-task--even': index % 2 === 0}" :key="todo.id">
            <td class="todoList-task-details todoList-task-details--checkbox">
              <input type="checkbox" :id="`todo-checkbox-${todo.id}`" v-on:click="check" :data-index="index" :checked="todo.status === 'DONE'">
              <label :for="`todo-checkbox-${todo.id}`" class="todoList-task-checkbox"></label>
            </td>
            <td class="todoList-task-details">{{todo.name}}</td>
            <td class="todoList-task-details">{{todo.dueDateFormatted}}</td>
            <td class="todoList-task-details">{{todo.repeat}}</td>
          </tr>
        </template>
      </tbody>
  </table>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'todo-list',
  props: ['todos'],
  computed: {
    todoList: function () {
      this.todos.forEach(todo => {
        if (todo.dueDate) todo.dueDateFormatted = moment(todo.dueDate).format('DD/MM/YYYY')
      })
      return this.todos
    }
  },
  methods: {
    check: function (event) {
      const index = event.target.dataset.index
      const todo = this.todoList[index]
      todo.status = event.target.checked ? 'DONE' : 'TODO'
      axios({method: 'PUT', url: `/api/todos/${todo.id}`, data: {...todo}}).then(result => {

      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
.todoList {
  width: 100%;
}

th {
  font-weight: 600;
  text-align: left;
}

.todoList-task {
  background-color: #fff;
}

.todoList-task:hover {
  background-color: #ddd;
  cursor: pointer;
}

.todoList-task-details {
  padding: 0.4rem 0;
}

.todoList-task-details--checkbox {
  position: relative;
  max-width: 1rem;
  padding-left: 0.5rem;
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
