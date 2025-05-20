<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是一个使用 Vue.js 构建的示例网站。</p>
    <div class="navigation">
      <router-link to="/" class="nav-link">返回首页</router-link>
      <router-link to="/contact" class="nav-link">联系我们</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
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