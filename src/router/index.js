import { createRouter, createWebHashHistory } from 'vue-router'
// 直接导入组件，不使用懒加载
import Onboarding from '../views/Onboarding.vue'
import Chat from '../views/Chat.vue'
import Self from '../views/Self.vue'

const routes = [
  {
    path: '/',
    redirect: '/onboarding'
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/self',
    name: 'self',
    component: Self
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router 