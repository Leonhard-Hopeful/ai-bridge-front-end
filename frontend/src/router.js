import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue' // Add this
import BridgeView from './views/BridgeView.vue'
import ClerkView from './views/ClerkView.vue'
import ExpertsView from './views/ExpertsView.vue'

const routes = [
  { path: '/', component: HomeView }, // Home is now the default
  { path: '/bridge', component: BridgeView },
  { path: '/clerk', component: ClerkView },
  { path: '/experts', component: ExpertsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router