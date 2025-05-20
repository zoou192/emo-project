<template>
  <div class="contact">
    <h1>联系我们</h1>
    <p>如果您有任何问题，请随时联系我们。</p>
    <div class="contact-info">
      <p>邮箱：example@example.com</p>
      <p>电话：123-456-7890</p>
    </div>
    <div class="navigation">
      <router-link to="/" class="nav-link">返回首页</router-link>
      <router-link to="/about" class="nav-link">关于我们</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact'
}
</script>

<style scoped>
.contact {
  text-align: center;
  padding: 20px;
}

.contact-info {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
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