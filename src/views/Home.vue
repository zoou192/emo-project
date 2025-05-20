<template>
  <div class="home">
    <h1>首页</h1>
    <p>欢迎来到我们的网站！</p>
    <div class="navigation">
      <router-link to="/about" class="nav-link">关于我们</router-link>
      <router-link to="/contact" class="nav-link">联系我们</router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.navigation {
  margin-top: 20px;
}

.nav-link {
  display: inline-block;
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #3aa876;
}
</style> 