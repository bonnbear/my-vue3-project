// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../App.vue'), // 👈 异步懒加载
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;