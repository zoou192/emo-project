import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

console.log('开始初始化应用')

const app = createApp(App)

console.log('Vue 应用已创建')

app.use(router)
console.log('路由已配置')

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 错误:', err)
  console.error('错误信息:', info)
}

// 添加路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

app.mount('#app')
console.log('应用已挂载到 #app')
