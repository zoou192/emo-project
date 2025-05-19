<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  console.log('App 组件已挂载')
  console.log('当前路由:', router.currentRoute.value)
})
</script>

<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: relative;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  width: 100%;
  height: 100vh;
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #ffffff;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  max-width: 500px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--border-color);
  z-index: 100;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: var(--text-secondary);
  font-size: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-item .icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform 0.3s ease;
}

.tab-item .text {
  font-size: 12px;
}

.tab-item.active {
  color: var(--primary-color);
}

.tab-item.active .icon {
  transform: scale(1.1);
}

/* 适配刘海屏 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tab-bar {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(60px + env(safe-area-inset-bottom));
  }
}

/* 防止页面横向滚动 */
html, body {
  overflow-x: hidden;
  width: 100%;
  position: relative;
}
</style>
