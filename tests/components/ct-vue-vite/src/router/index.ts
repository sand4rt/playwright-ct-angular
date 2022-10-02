import Dashboard from '../pages/Dashboard.vue';
import Login from '../pages/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/dashboard', component: Dashboard },
  ],
})
