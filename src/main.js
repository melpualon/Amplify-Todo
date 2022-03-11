import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'
import './assets/tailwind.css'
import './assets/main.css'

Amplify.configure(awsExports)

createApp(App).use(router).mount('#app')
