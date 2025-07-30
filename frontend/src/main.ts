import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router';
import MainScreen from './screens/MainScreen.vue';
import LoginScreen from './screens/LoginScreen.vue';
import RegisterScreen from './screens/RegisterScreen.vue';

createApp(App)
  .use(createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: MainScreen },
      { path: '/login', component: LoginScreen },
      { path: '/register', component: RegisterScreen },
    ]
  }))
  .mount('#app')
