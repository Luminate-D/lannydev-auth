import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import MainScreen from './screens/MainScreen.vue';
import LoginScreen from './screens/LoginScreen.vue';
import RegisterScreen from './screens/RegisterScreen.vue';
import ProfileScreen from './screens/ProfileScreen.vue';

createApp(App)
  .use(createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: MainScreen },
      { path: '/login', component: LoginScreen },
      { path: '/register', component: RegisterScreen },
      { path: '/profile', component: ProfileScreen }
    ]
  }))
  .mount('#app')
