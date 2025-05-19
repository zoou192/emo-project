<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 从本地存储获取第一步数据
const step1Data = ref(JSON.parse(localStorage.getItem('profileStep1') || '{}'))
const backgroundColor = computed(() => {
  return step1Data.value.gender === 'male' ? '#6426ff' : '#6426ff'
})

// 打字机效果
const sequence = ref(100)
const typewriterSequence = ref('')
const typewriterSpeed = 100 // 打字速度（毫秒）

const generateSequence = () => {
  sequence.value = Math.floor(Math.random() * 900) + 100
}

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

// 个人特质数据
const traits = ref({
  personality: [
    '乐观开朗', '沉稳内敛', '热情奔放', '理性冷静',
    '善解人意', '独立自主', '幽默风趣', '严谨认真',
    '富有同情心', '自信满满', '谦虚谨慎', '创新思维',
    '善于沟通', '专注执着', '灵活变通', '追求完美'
  ],
  interests: [
    '阅读', '音乐', '电影', '旅行',
    '美食', '摄影', '绘画', '写作',
    '运动', '游戏', '科技', '时尚',
    '手工', '园艺', '收藏', '舞蹈'
  ],
  skills: [
    '编程', '设计', '写作', '演讲',
    '烹饪', '摄影', '绘画', '音乐',
    '外语', '管理', '分析', '创新',
    '沟通', '领导', '组织', '规划'
  ]
})

// 当前选中的特质类别
const currentCategory = ref('personality')

// 已选择的特质
const selectedTraits = ref([])

// 切换特质类别
const switchCategory = (category) => {
  currentCategory.value = category
}

// 选择/取消选择特质
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

// 完成个人特质选择
const completeTraits = () => {
  if (selectedTraits.value.length === 0) {
    alert('请至少选择一个特质')
    return
  }

  // 保存个人特质数据
  const traitsData = {
    ...step1Data.value,
    traits: selectedTraits.value
  }
  localStorage.setItem('profileData', JSON.stringify(traitsData))
  
  // 跳转到欢迎页面
  router.push('/welcome')
}

onMounted(() => {
  // 如果没有第一步数据，返回创建页面
  if (!step1Data.value.avatar || !step1Data.value.nickname || !step1Data.value.gender) {
    router.push('/create-profile')
  }
  generateSequence()
  startTypewriter()
})
</script>

<template>
  <div class="personal-traits" :style="{ background: backgroundColor }">
    <div class="header">
      <h1 class="title">Ego</h1>
      <p class="slogan">每个自我，都是未完成的拼图，第&#8201;<span class="sequence">{{ typewriterSequence }}</span>&#8201;个人格正在上线</p>
    </div>

    <div class="traits-container">
      <div class="category-tabs">
        <div 
          class="tab" 
          :class="{ active: currentCategory === 'personality' }"
          @click="switchCategory('personality')"
        >
          性格
        </div>
        <div 
          class="tab" 
          :class="{ active: currentCategory === 'interests' }"
          @click="switchCategory('interests')"
        >
          兴趣
        </div>
        <div 
          class="tab" 
          :class="{ active: currentCategory === 'skills' }"
          @click="switchCategory('skills')"
        >
          技能
        </div>
      </div>

      <div class="traits-grid">
        <div 
          v-for="trait in traits[currentCategory]" 
          :key="trait"
          class="trait-item"
          :class="{ selected: selectedTraits.includes(trait) }"
          @click="toggleTrait(trait)"
        >
          {{ trait }}
        </div>
      </div>

      <div class="selected-traits" v-if="selectedTraits.length > 0">
        <div class="selected-title">已选择：</div>
        <div class="selected-list">
          <div 
            v-for="trait in selectedTraits" 
            :key="trait"
            class="selected-trait"
          >
            {{ trait }}
            <span class="remove-icon" @click.stop="toggleTrait(trait)">×</span>
          </div>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button class="back-btn" @click="goBack">返回</button>
      <button class="complete-btn" @click="completeTraits">完成</button>
    </div>
  </div>
</template>

<style scoped>
.personal-traits {
  min-height: 100vh;
  transition: background 0.3s ease;
  position: relative;
  padding: 20px 0;
}

.header {
  text-align: left;
  margin-bottom: 30px;
  padding: 0 20px;
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
}

.sequence {
  color: #fff;
  font-weight: 600;
  font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: inline-block;
  min-width: 3ch;
}

.traits-container {
  background: #fff;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  min-height: calc(100vh - 200px);
  position: relative;
  z-index: 1;
}

.category-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  color: #666;
  font-size: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.tab.active {
  color: #6426ff;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #6426ff;
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.trait-item {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.trait-item:hover {
  border-color: #6426ff;
  color: #6426ff;
}

.trait-item.selected {
  background: #6426ff;
  color: white;
  border-color: #6426ff;
}

.selected-traits {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.selected-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selected-trait {
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-icon {
  cursor: pointer;
  font-size: 16px;
  color: #999;
}

.button-container {
  padding: 0 20px;
  background: #fff;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.back-btn {
  height: 48px;
  padding: 0 20px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.back-btn:hover {
  background: #e0e0e0;
}

.complete-btn {
  height: 48px;
  padding: 0 20px;
  background: #6426ff;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
}

.complete-btn:hover {
  background: #5319ff;
}
</style> 