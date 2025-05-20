<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressIndicator from '../components/ProgressIndicator.vue'
import { MotionPlugin } from '@vueuse/motion'

const router = useRouter()
const fileInput = ref(null)
const avatarUrl = ref('')
const nickname = ref('')
const gender = ref('')
const sequence = ref(100)
const avatarStyle = ref('default')

// 计算属性：根据性别返回背景色
const backgroundColor = computed(() => {
  switch (gender.value) {
    case 'male':
      return '#6426ff'
    case 'female':
      return '#6426ff'
    default:
      return '#6426ff'
  }
})

// 生成3D头像
const generate3DAvatar = () => {
  // 这里使用一个示例的3D头像URL，实际项目中可以替换为真实的3D头像生成服务
  const baseUrl = 'https://api.dicebear.com/7.x/3d-avatar/svg'
  const seed = Math.random().toString(36).substring(7)
  avatarUrl.value = `${baseUrl}?seed=${seed}&backgroundColor=b6e3f4`
  avatarStyle.value = '3d'
}

// 生成随机昵称
const generateNickname = () => {
  const adjectives = ['快乐的', '聪明的', '可爱的', '温柔的', '活泼的']
  const nouns = ['小猫', '小狗', '小兔', '小鸟', '小鹿']
  const randomNum = Math.floor(Math.random() * 1000)
  nickname.value = adjectives[Math.floor(Math.random() * adjectives.length)] +
                   nouns[Math.floor(Math.random() * nouns.length)] +
                   randomNum
}

// 生成随机序列号
const generateSequence = () => {
  sequence.value = Math.floor(Math.random() * 900) + 100
}

// 打字机效果
const typewriterSequence = ref('')
const typewriterSpeed = 100 // 打字速度（毫秒）

const startTypewriter = () => {
  typewriterSequence.value = ''
  const targetSequence = sequence.value.toString()
  let currentIndex = 0

  const type = () => {
    if (currentIndex < targetSequence.length) {
      typewriterSequence.value += targetSequence[currentIndex]
      currentIndex++
      setTimeout(type, typewriterSpeed)
    }
  }

  type()
}

onMounted(() => {
  generateSequence()
  startTypewriter()
  // 默认生成3D头像
  generate3DAvatar()
})

// 进入下一步
const goToNextStep = () => {
  if (!avatarUrl.value || !nickname.value || !gender.value) {
    alert('请填写完整信息')
    return
  }

  // 保存第一步数据
  const step1Data = {
    avatar: avatarUrl.value,
    nickname: nickname.value,
    gender: gender.value
  }
  localStorage.setItem('profileStep1', JSON.stringify(step1Data))
  
  // 跳转到个人特质选择页面
  router.push('/personal-traits')
}
</script>

<template>
  <div class="create-profile" :style="{ background: backgroundColor }">
    <div class="header">
      <h1 class="title">Ego</h1>
      <p class="slogan">每个自我，都是未完成的拼图，第&#8201;<span class="sequence">{{ typewriterSequence }}</span>&#8201;个人格正在上线</p>
    </div>

    <div class="profile-form">
      <div class="avatar-display">
        <img :src="avatarUrl" alt="Avatar" v-if="avatarUrl" class="avatar-img">
        <div class="camera-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
      </div>

      <div class="form-content">
        <div class="input-group">
          <input
            type="text"
            v-model="nickname"
            class="nickname-input"
            placeholder="输入昵称"
          >
          <button class="random-btn" @click="generateRandomNickname">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>随机生成</span>
          </button>
        </div>

        <div class="gender-select">
          <div 
            class="gender-option" 
            :class="{ active: gender === 'male' }"
            @click="gender = 'male'"
          >
            <img src="../assets/images/boy.png" alt="男" class="gender-icon">
            <span>男生</span>
          </div>
          <div 
            class="gender-option" 
            :class="{ active: gender === 'female' }"
            @click="gender = 'female'"
          >
            <img src="../assets/images/girl.png" alt="女" class="gender-icon">
            <span>女生</span>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button class="next-btn" @click="goToNextStep">下一步</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-profile {
  min-height: 100vh;
  padding: 40px 20px 0;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 700;
  font-style: italic;
  text-transform: capitalize;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.slogan {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
}

.sequence {
  color: #fff;
  font-weight: 600;
  font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: inline-block;
  min-width: 3ch;
}

.profile-form {
  background: #fff;
  padding: 24px 20px 0;
  border-radius: 16px 16px 0 0;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.avatar-display {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-icon {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.form-content {
  flex: 1;
  padding: 0 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.nickname-input {
  flex: 1;
  height: 48px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
}

.random-btn {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 15px;
  background: #fff;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.random-btn:hover {
  background: #f5f5f5;
}

.gender-select {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.gender-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.gender-option {
  flex: 1;
  height: 60px;
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gender-option span {
  font-size: 16px;
  font-weight: 500;
}

.gender-option.active {
  background: #6426ff;
  border-color: #6426ff;
  color: white;
}

.gender-option:hover {
  background: #6426ff;
  border-color: #6426ff;
  color: white;
}

.button-container {
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  padding: 0 20px;
  background: #fff;
  z-index: 10;
}

.next-btn {
  width: 100%;
  height: 48px;
  background: #6426ff;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.next-btn:hover {
  background: #5319ff;
}
</style> 