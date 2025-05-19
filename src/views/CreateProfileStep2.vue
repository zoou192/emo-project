<template>
  <div class="create-profile-step2" :style="{ background: backgroundColor }">
    <div class="header">
      <h1>完善个人特征</h1>
      <p>让我们继续完善你的社交形象</p>
    </div>

    <ProgressIndicator 
      :current-step="1"
      :steps="['基本信息', '个人特征']"
    />

    <div class="profile-form" v-motion-slide-visible-once-bottom>
      <!-- MBTI选择 -->
      <div class="form-group" v-motion-slide-visible-once-bottom>
        <label>MBTI性格</label>
        <div class="mbti-select">
          <select v-model="mbti">
            <option value="">请选择MBTI类型</option>
            <option v-for="type in mbtiTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- 个人特质选择 -->
      <div class="form-group" v-motion-slide-visible-once-bottom>
        <label>个人特质</label>
        
        <!-- 特质类别选择 -->
        <div class="trait-categories">
          <div 
            v-for="(traitsList, category) in traits" 
            :key="category"
            class="category-btn"
            :class="{ active: currentTraitCategory === category }"
            @click="currentTraitCategory = category"
          >
            {{ category === 'personality' ? '性格' : 
               category === 'interests' ? '兴趣' : '技能' }}
          </div>
        </div>

        <!-- 特质选择区域 -->
        <div class="traits-select">
          <div 
            v-for="trait in traits[currentTraitCategory]" 
            :key="trait"
            class="trait-tag"
            :class="{ active: selectedTraits.includes(trait) }"
            @click="toggleTrait(trait)"
          >
            {{ trait }}
          </div>
        </div>

        <!-- 已选特质展示 -->
        <div class="selected-traits" v-if="selectedTraits.length > 0">
          <div class="selected-traits-title">已选择 ({{ selectedTraits.length }}/3)</div>
          <div class="selected-traits-list">
            <div 
              v-for="trait in selectedTraits" 
              :key="trait"
              class="selected-trait-tag"
            >
              {{ trait }}
              <span class="remove-trait" @click="toggleTrait(trait)">×</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="navigation-buttons" v-motion-slide-visible-once-bottom>
        <button class="back-btn" @click="goBack">上一步</button>
        <button class="submit-btn" @click="submitProfile">完成创建</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProgressIndicator from '../components/ProgressIndicator.vue'
import { MotionPlugin } from '@vueuse/motion'

const router = useRouter()
const mbti = ref('')
const selectedTraits = ref([])
const currentTraitCategory = ref('personality')

// 从localStorage获取第一步的数据
const step1Data = computed(() => {
  const data = localStorage.getItem('profileStep1')
  return data ? JSON.parse(data) : {}
})

// 计算背景色
const backgroundColor = computed(() => {
  return step1Data.value.gender === 'male' 
    ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    : step1Data.value.gender === 'female'
    ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'
    : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
})

// MBTI类型列表
const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISTP', 'ESTJ', 'ESTP',
  'ISFJ', 'ISFP', 'ESFJ', 'ESFP'
]

// 个人特质列表
const traits = {
  personality: [
    '开朗', '内向', '理性', '感性',
    '幽默', '严肃', '热情', '冷静',
    '创新', '传统', '独立', '合群',
    '自信', '谦虚', '乐观', '谨慎'
  ],
  interests: [
    '运动', '阅读', '音乐', '电影',
    '旅行', '美食', '摄影', '绘画',
    '游戏', '科技', '时尚', '艺术',
    '写作', '舞蹈', '手工', '园艺'
  ],
  skills: [
    '领导力', '沟通力', '创造力', '执行力',
    '学习力', '适应力', '专注力', '观察力',
    '记忆力', '分析力', '表达力', '组织力',
    '决策力', '规划力', '协调力', '创新力'
  ]
}

// 切换特质选择
const toggleTrait = (trait) => {
  const index = selectedTraits.value.indexOf(trait)
  if (index === -1) {
    if (selectedTraits.value.length < 3) {
      selectedTraits.value.push(trait)
    }
  } else {
    selectedTraits.value.splice(index, 1)
  }
}

// 返回上一步
const goBack = () => {
  router.push('/create-profile')
}

// 提交个人资料
const submitProfile = () => {
  if (!mbti.value || selectedTraits.value.length === 0) {
    alert('请填写完整信息')
    return
  }

  const step1Profile = step1Data.value
  const profile = {
    ...step1Profile,
    mbti: mbti.value,
    traits: selectedTraits.value
  }

  // 保存完整个人资料
  localStorage.setItem('userProfile', JSON.stringify(profile))
  // 清除临时数据
  localStorage.removeItem('profileStep1')
  
  // 跳转到欢迎页
  router.push('/welcome')
}
</script>

<style scoped>
.create-profile-step2 {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  transition: background 0.3s ease;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.header p {
  color: #666;
}

.profile-form {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.trait-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.category-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
}

.category-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.traits-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.trait-tag {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.trait-tag.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.selected-traits {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.selected-traits-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.selected-traits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-trait-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #4CAF50;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.selected-trait-tag:hover {
  transform: translateY(-2px);
}

.remove-trait {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-trait:hover {
  opacity: 0.8;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.back-btn, .submit-btn {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: #f5f5f5;
  color: #666;
}

.back-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background: #45a049;
}

/* 添加过渡动画相关样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trait-tag:hover {
  transform: translateY(-2px);
}

.category-btn:hover {
  transform: translateY(-2px);
}

.back-btn:hover, .submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 