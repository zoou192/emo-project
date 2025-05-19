<template>
  <div class="onboarding">
    <div class="header-container">
      <div class="left-content">
        <h1>Ego</h1>
        <div class="slogan">每个自我，都是未完成的拼图<br>第 <span class="number-container">
          <span class="number" :key="randomNumber">{{ randomNumber }}</span>
        </span> 个人格生成中...</div>
      </div>
      <div class="grid-container">
        <div 
          class="grid-item" 
          v-for="i in 4" 
          :key="i"
          :class="{
            'active': i === currentStep + 1,
            'completed': i < currentStep + 1
          }"
        >
          <div class="shape-container">
            <div :class="['shape', shapes[i-1]]"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="onboarding-content">
      <!-- 问题卡片 -->
      <div class="question-card" v-if="currentStep < questions.length">
        <h2 class="question-title">
          <div class="dots-container">
            <div 
              class="dot" 
              v-for="i in questions.length" 
              :key="i"
              :class="{
                'completed': i < currentStep + 1,
                'active': i === currentStep + 1
              }"
            ></div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center;">
            <span class="title-text">{{ questions[currentStep].title }}</span>
            <span v-if="questions[currentStep].multiple" class="multiple-tag">(多选)</span>
          </div>
        </h2>
        
        <!-- 单选题 -->
        <div v-if="!questions[currentStep].multiple" class="options-list">
          <div 
            v-for="option in questions[currentStep].options" 
            :key="option.value"
            class="option-item"
            :class="{ selected: selectedAnswers[currentStep] === option.value }"
            @click="selectAnswer(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
        
        <!-- 多选题 -->
        <div v-else class="options-list">
          <div 
            v-for="option in questions[currentStep].options" 
            :key="option.value"
            class="option-item"
            :class="{ selected: selectedAnswers[currentStep]?.includes(option.value) }"
            @click="toggleMultiAnswer(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
      
      <!-- 结果页面 -->
      <div v-else class="result-card">
        <div class="personality-card" :class="personalityClass">
          <h2>你的初始人格是</h2>
          <div class="personality-name">{{ personalityResult.name }}</div>
          <div class="personality-traits">
            <div v-for="trait in personalityResult.traits" :key="trait" class="trait-tag">
              {{ trait }}
            </div>
          </div>
          <button class="start-button" @click="startChat">开始对话</button>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <div v-if="currentStep > 0" class="prev-text-button" @click="prevStep">
        上一题
      </div>
      <button 
        class="nav-button next" 
        @click="handleNextStep"
        :disabled="!canProceed"
      >
        <span>{{ currentStep === questions.length - 1 ? '开始收集' : '下一题' }}</span>
      </button>
    </div>

    <!-- 人格角色弹窗 -->
    <div class="personality-modal" v-if="showPersonalityModal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>你的初始人格是</h3>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="personality-name">{{ personalityResult.name }}</div>
          <div class="personality-traits">
            <div v-for="trait in personalityResult.traits" :key="trait" class="trait-tag">
              {{ trait }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="start-button" @click="startChat">开始对话</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const selectedAnswers = ref({})
const randomNumber = ref(123)
const shapes = ref([])
const showPersonalityModal = ref(false)

onMounted(() => {
  console.log('Onboarding 组件已挂载')
  // 生成1000-9999之间的随机数
  randomNumber.value = Math.floor(Math.random() * 9000) + 1000
  // 生成4个交替的图形
  const shapeTypes = ['spade', 'heart', 'club', 'diamond']
  const grid = Array(4).fill(null)
  for (let i = 0; i < 4; i++) {
    grid[i] = shapeTypes[i % 4]
  }
  shapes.value = grid
})

const questions = [


  {
    title: '🌌 你更易被哪种世界观治愈？',
    options: [
      { label: '赛博朋克都市', value: 'A' },
      { label: '魔法森林', value: 'B' },
      { label: '宇宙航行', value: 'C' },
      { label: '童话王国', value: 'D' }
    ]
  },


  {
    title: '🤖 现在你的身体感觉更像？',
    options: [
      { label: '电力耗尽的机器人', value: 'A' },
      { label: '随风飘摇的树叶', value: 'B' },
      { label: '即将喷发的火山', value: 'C' },
      { label: '闪烁的星尘', value: 'D' }
    ]
  },
  {
    title: '🌊 近让你情绪波动的事件通常发生在？',
    multiple: true,
    options: [
      { label: '工作/学习场景', value: 'A' },
      { label: '家庭关系', value: 'B' },
      { label: '社交互动', value: 'C' },
      { label: '自我成长', value: 'D' },
      { label: '随机日常', value: 'E' }
    ]
  },
  {
    title: '🌟 你希望树洞守护者用哪种方式回应？',
    options: [
      { label: '毒舌但治愈的吐槽', value: 'A' },
      { label: '充满想象力的故事', value: 'B' },
      { label: '温柔肯定的鼓励', value: 'C' },
      { label: '提供解决攻略', value: 'D' }
    ]
  }
]

// 根据答案计算人格类型
const personalityResult = computed(() => {
  const answers = selectedAnswers.value
  // 这里可以根据答案组合返回不同的人格类型
  const personalities = [
    {
      name: '毒舌暖男',
      traits: ['机智幽默', '一针见血', '内心柔软'],
      class: 'personality-warm'
    },
    {
      name: '佛系捧场王',
      traits: ['随和包容', '善解人意', '佛系心态'],
      class: 'personality-peace'
    },
    {
      name: '高冷梗王',
      traits: ['冷面笑匠', '语出惊人', '反差萌'],
      class: 'personality-cool'
    }
  ]
  
  // 简单算法：根据第一题和最后一题的答案选择人格
  const firstAnswer = answers[0]
  const lastAnswer = answers[3]
  const index = (firstAnswer?.charCodeAt(0) || 0 + lastAnswer?.charCodeAt(0) || 0) % personalities.length
  return personalities[index]
})

const personalityClass = computed(() => personalityResult.value?.class || '')

const canProceed = computed(() => {
  const currentQuestion = questions[currentStep.value]
  if (!currentQuestion) return true
  
  const answer = selectedAnswers.value[currentStep.value]
  if (currentQuestion.multiple) {
    // 第5题和第8题需要选择3个选项
    return answer && answer.length === 3
  }
  return !!answer
})

const selectAnswer = (value) => {
  selectedAnswers.value[currentStep.value] = value
  console.log('选择答案:', value)
  
  // 检查是否可以进入下一题
  if (canProceed.value && currentStep.value < questions.length - 1) {
    // 如果不是最后一题，延迟一小段时间后自动进入下一题
    setTimeout(() => {
      handleNextStep()
    }, 300)
  }
}

const toggleMultiAnswer = (value) => {
  if (!selectedAnswers.value[currentStep.value]) {
    selectedAnswers.value[currentStep.value] = []
  }
  
  const index = selectedAnswers.value[currentStep.value].indexOf(value)
  if (index === -1) {
    // 第5题和第8题最多只能选择3个选项
    if (selectedAnswers.value[currentStep.value].length < 3) {
      selectedAnswers.value[currentStep.value].push(value)
    }
  } else {
    selectedAnswers.value[currentStep.value].splice(index, 1)
  }
  console.log('多选答案:', selectedAnswers.value[currentStep.value])
  
  // 检查是否可以进入下一题
  if (canProceed.value) {
    // 延迟一小段时间后自动进入下一题，让用户能看到选择效果
    setTimeout(() => {
      handleNextStep()
    }, 300)
  }
}

const nextStep = () => {
  if (currentStep.value < questions.length - 1) {
    currentStep.value++
    console.log('下一步:', currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    console.log('上一步:', currentStep.value)
  }
}

const handleNextStep = () => {
  if (currentStep.value === questions.length - 1) {
    // 如果是最后一题，直接跳转到会话页面
    startChat()
  } else {
    // 否则进入下一题
    nextStep()
  }
}

const closeModal = () => {
  showPersonalityModal.value = false
}

const startChat = () => {
  // 保存用户答案和人格类型
  localStorage.setItem('onboardingAnswers', JSON.stringify(selectedAnswers.value))
  localStorage.setItem('personalityType', JSON.stringify(personalityResult.value))
  console.log('开始对话')
  router.push('/chat')
}
</script>

<style scoped>
/* 移动端适配 */
@media screen and (max-width: 375px) {
  .onboarding {
    width: 100%;
    margin: 0;
    padding: 28px 0 0 0;
  }

  .header-container {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 24px;
  }

  .left-content {
    width: 100%;
  }

  .grid-container {
    width: 72px;
    height: 72px;
    margin-top: 0px;
    margin-left: auto;
  }

  .navigation-buttons {
    width: 100%;
    left: 0;
    transform: none;
    padding: 0;
  }

  .onboarding-content {
    border-radius: 20px 20px 0 0;
    margin-top: 20px;
  }
}

/* 桌面端居中显示 */
@media screen and (min-width: 376px) {
  .onboarding {
    width: 375px;
    margin: 0 auto;
    padding: 28px 0 0 0;
  }

  .header-container {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 24px;
  }

  .left-content {
    flex: 1;
  }

  .grid-container {
    width: 72px;
    height: 72px;
    margin-left: 20px;
  }

  .navigation-buttons {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;
  }

  .onboarding-content {
    border-radius: 20px 20px 0 0;
    margin-top: 20px;
  }
}

.onboarding {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: linear-gradient(135deg, #F8FBFF 0%, #E6FBFA 100%);
  background-size: 100% 50vh;
  background-repeat: no-repeat;
  position: relative;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  width: 100%;
  margin-bottom: 40px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
}

.left-content {
  display: flex;
  flex-direction: column;
  width: 65%;
  position: relative;
  padding-right: 20px;
  align-items: flex-start;
}

h1 {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 12px;
  color: #111;
  align-self: flex-start;
  transform: skew(-5deg);
  display: inline-block;
  font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ego-subtitle {
  font-size: 14px;
  color: #111;
  margin-left: 4px;
  font-weight: normal;
}

.slogan {
  font-size: 14px;
  color: #888;
  margin-bottom: 0;
  text-align: left;
  align-self: flex-start;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 4px;
  width: 76px;
  height: 76px;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  padding: 4px;
  box-sizing: border-box;
  position: relative;
  margin-left: 20px;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: rotateX(0deg) rotateY(0deg);
}

.grid-item {
  background-color: white;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0.5;
  transform-style: preserve-3d;
  border: none;
}

.grid-item.active {
  opacity: 1;
  background-color: #e6fbfa;
  transform: translateZ(5px);
  box-shadow: 0 0 15px rgba(31, 234, 187, 0.2);
  border: none;
}

.grid-item.completed {
  opacity: 1;
  background-color: #54F3D7;
  transform: translateZ(2px);
  box-shadow: 0 0 8px rgba(84, 243, 215, 0.15), 0 0 12px rgba(84, 243, 215, 0.05);
  border: none;
}

.grid-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
}

.grid-item:hover {
  transform: translateZ(8px) scale(1.05);
  z-index: 1;
  box-shadow: 0 0 12px rgba(31, 234, 187, 0.15), 0 0 20px rgba(31, 234, 187, 0.05);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
}

.grid-item.completed:hover {
  transform: none;
  box-shadow: none;
  background-color: #54F3D7;
  border: none;
}

.grid-item:hover::before {
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%);
  border: none;
}

.grid-item.completed:hover::before {
  background: linear-gradient(135deg, rgba(84, 243, 215, 0.4) 0%, rgba(84, 243, 215, 0.1) 100%);
}

.grid-item:hover::after {
  background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.5));
}

/* 添加魔方边框效果 */
.grid-container::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  pointer-events: none;
  box-shadow: 0 0 12px rgba(31, 234, 187, 0.2), 0 0 24px rgba(31, 234, 187, 0.08);
}

/* 添加魔方侧面效果 */
.grid-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  border-radius: 4px;
  pointer-events: none;
}

/* 添加魔方高光效果 */
.grid-item.active::before {
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}

.grid-item.completed::before {
  background: linear-gradient(135deg, rgba(84, 243, 215, 0.4) 0%, rgba(84, 243, 215, 0.1) 100%);
}

.onboarding-content {
  width: 100%;
  margin: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255) 15%);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 12px 30px rgba(31, 234, 187, 0.15), 0 8px 20px rgba(31, 234, 187, 0.1);
  padding: 0 0 12px 0;
  position: relative;
  box-sizing: border-box;
  flex: 1;
  margin-top: auto;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.2px solid #fff;
  min-height: 60vh;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000;
  -webkit-perspective: 1000;
}

.onboarding-content::after {
  content: '';
  position: absolute;
  bottom: 53px;
  left: 0;
  right: 0;
  height: 160px;
  background-image: none;
  background-size: 100% auto;
  background-position: center bottom;
  background-repeat: no-repeat;
  opacity: 0.8;
  z-index: 0;
  pointer-events: none;
}

.question-card, .result-card {
  position: relative;
  z-index: 1;
  padding: 28px 24px;
}

.question-card {
  padding: 0;
  margin-bottom: 24px;
  transform: translateZ(0);
  will-change: transform;
}

.question-title {
  font-size: 17px;
  font-weight: 600;
  color: #111;
  margin: 12px 0 24px 0;
  text-align: center;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.title-text {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.multiple-tag {
  font-size: 14px;
  color: #888;
  font-weight: normal;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  margin-top: 0;
  margin-bottom: 0;
}

.dots-container {
  display: flex;
  gap: 3px;
  margin-top: 0;
  margin-bottom: 20px;
  justify-content: center;
}

.dot {
  width: 3px;
  height: 3px;
  background-color: rgba(17, 25, 37, 0.15);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.dot.completed {
  background-color: #1FEABB;
  width: 3px;
  height: 3px;
}

.dot.active {
  background-color: rgba(17, 25, 37, 0.45);
  width: 3px;
  height: 3px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  padding: 0 16px;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000;
  -webkit-perspective: 1000;
}

.option-item {
  height: 48px;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #555;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.option-item:active {
  transform: scale(0.98);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.option-item.selected {
  color: #111;
  border: 1.5px solid #54F3D7;
  background-color: rgba(84, 243, 215, 0.1);
  font-weight: 500;
}

.option-item.multiple-selected {
  color: #111;
  border: 1.5px solid #54F3D7;
  background-color: rgba(84, 243, 215, 0.1);
  font-weight: 500;
}

.result-card {
  text-align: center;
  padding: 40px 20px;
}

.personality-card {
  padding: 30px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.personality-name {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0;
  color: #1FEABB;
}

.personality-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.trait-tag {
  padding: 8px 16px;
  background-color: #e6fbfa;
  color: #1FEABB;
  border-radius: 20px;
  font-size: 14px;
}

.start-button {
  margin-top: 30px;
  padding: 15px 40px;
  background-color: #1FEABB;
  color: #111;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover {
  background-color: #1ad5a8;
  transform: translateY(-2px);
}

/* 人格卡片样式 */
.personality-warm {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}

.personality-peace {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.personality-cool {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
}

.navigation-buttons {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  width: 375px;
  background: transparent;
  box-sizing: border-box;
  z-index: 2;
  isolation: isolate;
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.prev-text-button {
  font-size: 14px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 0;
  text-align: center;
  width: 100%;
  margin-left: 2px;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.prev-text-button:active {
  color: #555;
}

.nav-button.next {
  background: #54F3D7;
  color: #111;
  box-shadow: 0 2px 8px rgba(84, 243, 215, 0.3);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border: none;
  outline: none;
  isolation: isolate;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  padding: 12px 30px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 88%;
  max-width: none;
  margin-bottom: env(safe-area-inset-bottom, 20px);
  -webkit-tap-highlight-color: transparent;
}

.nav-button.next:disabled {
  background: rgba(84, 243, 215, 0.35);
  color: rgba(17, 17, 17, 0.35);
  box-shadow: none;
  cursor: not-allowed;
}

.nav-button.prev {
  background: #f5f5f5;
  color: #111;
  border: 1px solid #ddd;
  display: none;
}

.number-container {
  display: inline-block;
  position: relative;
  height: 20px;
  overflow: hidden;
  vertical-align: middle;
}

.number {
  font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #111;
  display: block;
  animation: numberFlip 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes numberFlip {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.shape-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

.shape {
  width: 14px;
  height: 14px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #B2FFED;
  opacity: 1;
}

.shape.spade::before {
  content: '♠';
  font-size: 18px;
}

.shape.heart::before {
  content: '♥';
  font-size: 18px;
}

.shape.club::before {
  content: '♣';
  font-size: 18px;
}

.shape.diamond::before {
  content: '♦';
  font-size: 18px;
}

.grid-item.active .shape {
  color: #B2FFED;
  opacity: 1;
}

.grid-item.completed .shape {
  color: #fff;
  opacity: 1;
}

/* 弹窗样式 */
.personality-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  width: 100vw;
  height: 100vh;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 320px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 24px 20px;
  text-align: center;
  overflow-y: auto;
  flex: 1;
}

.modal-body .personality-name {
  font-size: 24px;
  font-weight: 700;
  color: #1FEABB;
  margin-bottom: 16px;
}

.modal-body .personality-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 0 auto;
  max-width: 280px;
}

.modal-body .trait-tag {
  padding: 6px 12px;
  background-color: rgba(31, 234, 187, 0.1);
  color: #1FEABB;
  border-radius: 16px;
  font-size: 14px;
}

.modal-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.modal-footer .start-button {
  width: 100%;
  padding: 12px 0;
  background-color: #1FEABB;
  color: #111;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-footer .start-button:active {
  transform: scale(0.98);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-item.multiple-selected {
  background: rgba(84, 243, 215, 0.1);
  border-color: #54F3D7;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.multiple-tag {
  font-size: 12px;
  color: rgba(17, 25, 37, 0.45);
}

.character-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.character-name {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.character-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  text-align: center;
  max-width: 200px;
}

.grid-item.completed .shape-container {
  background: #B2FFED;
}

.message.user {
  align-items: flex-end;
  margin-bottom: 16px;
}

.comfort-section {
  background: linear-gradient(to bottom, rgba(17,17,17,0.03) 0%, rgba(17,17,17,0) 100%);
}
</style> 