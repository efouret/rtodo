<template>
  <section class="home">
    <header class="home-header">
      <a class="home-title-burger"><img src="../assets/burger.svg"></a>
      <h1 class="home-title">List of todos</h1>
      <button class="home-title-add">+</button>
    </header>
    <main>
      <todo-list></todo-list>
    </main>
  </section>
</template>

<script>
import TodoList from './TodoList'

export default {
  name: 'Home',
  components: {TodoList}
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
