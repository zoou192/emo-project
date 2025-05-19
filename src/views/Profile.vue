<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profile = ref({
  avatar: '/images/default-avatar.svg',
  nickname: '',
  selectedTags: []
})

// 系统提供的昵称列表
const systemNicknames = [
  '阳光小王子', '快乐小精灵', '微笑天使', '温暖如春', '活力四射',
  '温柔似水', '智慧之星', '勇敢之心', '善良使者', '乐观达人'
]

// 生成随机昵称
const generateRandomNickname = () => {
  const randomIndex = Math.floor(Math.random() * systemNicknames.length)
  return systemNicknames[randomIndex]
}

const tagCategories = [
  {
    name: 'MBTI',
    tags: [
      { id: 'mbti-1', name: 'INTJ', selected: false, color: '#FF6B6B' },
      { id: 'mbti-2', name: 'INTP', selected: false, color: '#4ECDC4' },
      { id: 'mbti-3', name: 'ENTJ', selected: false, color: '#45B7D1' },
      { id: 'mbti-4', name: 'ENTP', selected: false, color: '#96CEB4' },
      { id: 'mbti-5', name: 'INFJ', selected: false, color: '#FFEEAD' },
      { id: 'mbti-6', name: 'INFP', selected: false, color: '#D4A5A5' },
      { id: 'mbti-7', name: 'ENFJ', selected: false, color: '#9B59B6' },
      { id: 'mbti-8', name: 'ENFP', selected: false, color: '#3498DB' },
      { id: 'mbti-9', name: 'ISTJ', selected: false, color: '#E74C3C' },
      { id: 'mbti-10', name: 'ISFJ', selected: false, color: '#2ECC71' },
      { id: 'mbti-11', name: 'ESTJ', selected: false, color: '#F1C40F' },
      { id: 'mbti-12', name: 'ESFJ', selected: false, color: '#1ABC9C' },
      { id: 'mbti-13', name: 'ISTP', selected: false, color: '#E67E22' },
      { id: 'mbti-14', name: 'ISFP', selected: false, color: '#27AE60' },
      { id: 'mbti-15', name: 'ESTP', selected: false, color: '#D35400' },
      { id: 'mbti-16', name: 'ESFP', selected: false, color: '#16A085' }
    ]
  },
  {
    name: '个人特质',
    tags: [
      { id: 'trait-1', name: '乐观开朗', selected: false },
      { id: 'trait-2', name: '安静内向', selected: false },
      { id: 'trait-3', name: '理性思考', selected: false },
      { id: 'trait-4', name: '感性直觉', selected: false },
      { id: 'trait-5', name: '创意十足', selected: false },
      { id: 'trait-6', name: '执行力强', selected: false }
    ]
  },
  {
    name: '爱好',
    tags: [
      { id: 'hobby-1', name: '阅读', selected: false },
      { id: 'hobby-2', name: '音乐', selected: false },
      { id: 'hobby-3', name: '运动', selected: false },
      { id: 'hobby-4', name: '旅行', selected: false },
      { id: 'hobby-5', name: '摄影', selected: false },
      { id: 'hobby-6', name: '美食', selected: false }
    ]
  },
  {
    name: '特殊经历',
    tags: [
      { id: 'exp-1', name: '志愿者', selected: false },
      { id: 'exp-2', name: '创业', selected: false },
      { id: 'exp-3', name: '留学', selected: false },
      { id: 'exp-4', name: '支教', selected: false },
      { id: 'exp-5', name: '实习', selected: false },
      { id: 'exp-6', name: '比赛', selected: false }
    ]
  }
]

onMounted(() => {
  // 从本地存储加载用户信息
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    const parsed = JSON.parse(savedProfile)
    profile.value = parsed
    
    // 更新标签选中状态
    tagCategories.forEach(category => {
      category.tags.forEach(tag => {
        tag.selected = profile.value.selectedTags.includes(tag.name)
      })
    })
  } else {
    // 如果没有保存的昵称，自动生成一个
    profile.value.nickname = generateRandomNickname()
  }
})

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const toggleTag = (tag) => {
  tag.selected = !tag.selected
  if (tag.selected) {
    profile.value.selectedTags.push(tag.name)
  } else {
    const index = profile.value.selectedTags.indexOf(tag.name)
    if (index > -1) {
      profile.value.selectedTags.splice(index, 1)
    }
  }
}

const refreshNickname = () => {
  profile.value.nickname = generateRandomNickname()
}

const saveProfile = () => {
  if (!profile.value.nickname || profile.value.selectedTags.length === 0) {
    alert('请完善个人信息')
    return
  }
  
  // 保存用户信息到本地存储
  localStorage.setItem('userProfile', JSON.stringify(profile.value))
  alert('保存成功')
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>个人中心</h1>
    </div>
    
    <div class="profile-content">
      <div class="user-info-section">
        <div class="avatar-container">
          <img :src="profile.avatar" alt="用户头像" class="user-avatar">
          <div class="edit-avatar">
            <span>更换头像</span>
          </div>
        </div>
        <h2 class="user-name">{{ profile.nickname }}</h2>
        <p class="user-id">ID: {{ profile.id }}</p>
      </div>
      
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.messageCount }}</div>
          <div class="stat-label">消息数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.favoriteCount }}</div>
          <div class="stat-label">收藏数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.daysActive }}</div>
          <div class="stat-label">活跃天数</div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="section-title">设置</h3>
        
        <div class="settings-list">
          <div class="settings-item" @click="navigateTo('account')">
            <div class="settings-icon">👤</div>
            <div class="settings-text">账号设置</div>
            <div class="settings-arrow">›</div>
          </div>
          
          <div class="settings-item" @click="navigateTo('notification')">
            <div class="settings-icon">🔔</div>
            <div class="settings-text">通知设置</div>
            <div class="settings-arrow">›</div>
          </div>
          
          <div class="settings-item" @click="navigateTo('privacy')">
            <div class="settings-icon">🔒</div>
            <div class="settings-text">隐私设置</div>
            <div class="settings-arrow">›</div>
          </div>
          
          <div class="settings-item" @click="navigateTo('about')">
            <div class="settings-icon">ℹ️</div>
            <div class="settings-text">关于我们</div>
            <div class="settings-arrow">›</div>
          </div>
        </div>
      </div>
      
      <div class="logout-section">
        <button class="logout-button" @click="logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
  height: 60px;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.profile-header h1 {
  font-size: 18px;
  font-weight: 500;
}

.profile-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4CAF50;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
  padding: 4px 0;
  text-align: center;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .edit-avatar {
  opacity: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.user-id {
  font-size: 14px;
  color: #999;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  background-color: white;
  border-radius: 12px;
  padding: 20px 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.settings-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-icon {
  font-size: 20px;
  margin-right: 15px;
}

.settings-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.settings-arrow {
  font-size: 20px;
  color: #999;
}

.logout-section {
  margin-top: 30px;
  padding: 0 20px;
}

.logout-button {
  width: 100%;
  height: 50px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style> 