import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import StartGame from '@/views/StartGame.vue';
import HomePage from '@/views/HomePage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/homepage'
  },
  {
    path: '/homepage',
    component: HomePage
  },
  {
    path: '/newgame',
    component: StartGame
  },
  {
    path: '/continuegame',
    component: StartGame
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
