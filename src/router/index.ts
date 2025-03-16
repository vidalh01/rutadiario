import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/Signup',
      component: () => import('../views/SignupView.vue'),
    },
  ],
})

export default router
