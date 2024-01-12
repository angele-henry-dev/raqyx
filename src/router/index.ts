import { createRouter, createWebHistory } from '@ionic/vue-router';
// import GamePage from '@/views/GamePage.vue';
// import HomePage from '@/views/HomePage.vue';
import MainPage from '@/views/MainPage.vue';

const routes = [
  {
    path: '/',
    component: MainPage
  },
  // {
  //   path: '/homepage',
  //   component: HomePage
  // },
  // {
  //   path: '/newgame',
  //   component: GamePage
  // }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
