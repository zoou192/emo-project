<template>
  <div id="app">
    <!-- <nav class="nav">
      <router-link to="/" class="nav-item">首页</router-link>
      <router-link to="/about" class="nav-item">关于</router-link>
      <router-link to="/contact" class="nav-item">联系</router-link>
    </nav> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.title = 'Ego_情绪盒子'
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;
  background-color: #f8f9fa;
}

.nav-item {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0px;
  padding: 0px;
  border-radius: 4px;
}

.nav-item:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
  background-color: #e8f5e9;
}
</style> 