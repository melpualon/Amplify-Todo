<template>
  <div id="app">
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">
    <h1 v-if="message">{{ message }}</h1>
    <button @click="createTodo">Create Todo</button>
    <div v-for="todo in todos" :key="todo.id">
      <h3>{{ todo.name }}</h3>
      <p>{{ todo.description }}</p>
    </div>

  </div>
</template>
<script>
import { API } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { onCreateTodo } from './graphql/subscriptions'

export default {
  name: 'app',
  async created() {
    this.getTodos();
  },
  created() {
    this.getTodos();
    this.subscribe();
  },
  data() {
    return {
      name: '',
      description: '',
      todos: [],
      message: ''
    }
  },
  methods: {
    async createTodo() {
      const { name, description } = this

      if(!name || !description) {
        this.showMessage('Please fill all fields')
      }

      const todo = { name, description }
      await API.graphql({
        query: createTodo,
        variables: { input: todo }
      })
      this.name = ''
      this.description = ''
    },
    async getTodos() {
      const todos = await API.graphql({
        query: listTodos
      });
      this.todos = todos.data.listTodos.items
    },
    async showMessage() {
      setTimeout((message) => {
        this.message = message
      }, 3000)
    },

    subscribe() {
      API.graphql({ query: onCreateTodo })
        .subscribe({
          next: (eventData) => {
            let todo = eventData.value.data.onCreateTodo;
            if (this.todos.some(item => item.name === todo.name)) return; // remove duplications
            this.todos = [...this.todos, todo];
          }
        });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
