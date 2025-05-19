import { createRouter, createWebHistory } from 'vue-router'

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
  history: createWebHistory('/'),
  routes
})

// 添加导航守卫进行调试
router.beforeEach((to, from, next) => {
  console.log('路由导航:', { to, from })
  next()
})

export default router 