import { createRouter, createWebHistory } from 'vue-router';
import RocketList from '@/pages/RocketList.vue';
import RocketDetail from '@/pages/RocketDetail.vue';

const routes = [
  { path: '/', name: 'RocketList', component: RocketList },
  { path: '/rocket/:id', name: 'RocketDetail', component: RocketDetail }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
