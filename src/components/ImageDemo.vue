<template>
  <div class="image-demo">
    <h2>图片展示示例</h2>
    <div class="image-container">
      <!-- 使用 require 导入图片 -->
      <img :src="require('@/assets/images/logo.png')" alt="Logo" class="demo-image">
      <p>使用 require 导入的图片</p>
    </div>
    <div class="image-container">
      <!-- 使用动态导入图片 -->
      <img :src="imageUrl" alt="Dynamic Image" class="demo-image">
      <p>使用动态导入的图片</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageDemo',
  data() {
    return {
      imageUrl: require('@/assets/images/logo.png')
    }
  }
}
</script>

<style scoped>
.image-demo {
  padding: 20px;
  text-align: center;
}

.image-container {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.demo-image {
  max-width: 200px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

p {
  margin-top: 10px;
  color: #666;
}
</style> 