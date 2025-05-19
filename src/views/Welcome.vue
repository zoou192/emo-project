<template>
  <div class="welcome-container">
    <h1>欢迎来到社交模拟器</h1>
    <p>在这里，你可以体验不同的社交场景和对话</p>
    <router-link to="/chat" class="start-button">
      开始体验
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.start-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #45a049;
}
</style> 