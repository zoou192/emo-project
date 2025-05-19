<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const messages = ref([])
const inputText = ref('')
const isRecording = ref(false)
const characterEmotion = ref('neutral')

// 模拟情绪数据
const emotionData = ref({
  confidence: 75,
  empathy: 60,
  clarity: 80,
  engagement: 70
})

const startRecording = () => {
  isRecording.value = true
  // 这里添加录音逻辑
}

const stopRecording = () => {
  isRecording.value = false
  // 这里添加停止录音和语音转文字逻辑
}

const sendMessage = () => {
  if (!inputText.value.trim()) return
  
  messages.value.push({
    type: 'user',
    content: inputText.value,
    timestamp: new Date()
  })
  
  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      type: 'ai',
      content: '这是一个模拟的AI回复消息。',
      timestamp: new Date()
    })
    updateEmotion()
  }, 1000)
  
  inputText.value = ''
}

const updateEmotion = () => {
  // 模拟情绪变化
  const emotions = ['happy', 'neutral', 'concerned']
  characterEmotion.value = emotions[Math.floor(Math.random() * emotions.length)]
}

const finishTraining = () => {
  router.push('/report')
}
</script>

<template>
  <div class="training-container">
    <!-- 角色立绘区域 -->
    <div class="character-display">
      <img 
        :src="`/images/character-${characterEmotion}.gif`" 
        alt="Character"
        class="character-image"
      >
    </div>

    <!-- 对话区域 -->
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ new Date(message.timestamp).toLocaleTimeString() }}
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <button
          class="record-button"
          @mousedown="startRecording"
          @mouseup="stopRecording"
          @mouseleave="stopRecording"
        >
          🎤
        </button>
        <input
          v-model="inputText"
          type="text"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        >
        <button class="send-button" @click="sendMessage">发送</button>
      </div>
    </div>

    <!-- 侧边反馈面板 -->
    <div class="feedback-panel">
      <h3>实时反馈</h3>
      <div class="emotion-radar">
        <div class="radar-chart">
          <!-- 这里将使用Chart.js绘制雷达图 -->
        </div>
        <div class="metrics">
          <div class="metric">
            <span>自信度</span>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: `${emotionData.confidence}%` }"
              ></div>
            </div>
          </div>
          <div class="metric">
            <span>共情能力</span>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: `${emotionData.empathy}%` }"
              ></div>
            </div>
          </div>
          <div class="metric">
            <span>表达清晰度</span>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: `${emotionData.clarity}%` }"
              ></div>
            </div>
          </div>
          <div class="metric">
            <span>互动参与度</span>
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ width: `${emotionData.engagement}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <button class="finish-button" @click="finishTraining">
        完成训练
      </button>
    </div>
  </div>
</template>

<style scoped>
.training-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  height: 100vh;
  padding: 2rem;
  background: #f5f7fa;
}

.character-display {
  grid-column: 1 / -1;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.character-image {
  height: 180px;
  object-fit: contain;
}

.chat-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  background: #e3f2fd;
  color: #1976d2;
}

.message.user .message-content {
  background: #42b883;
  color: white;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
  text-align: right;
}

.input-area {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 0 0 15px 15px;
}

.record-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #ff4081;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.record-button:active {
  background: #f50057;
}

input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
}

.send-button {
  padding: 0.8rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.feedback-panel {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feedback-panel h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.emotion-radar {
  margin-bottom: 2rem;
}

.radar-chart {
  width: 100%;
  height: 200px;
  margin-bottom: 1.5rem;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #42b883;
  transition: width 0.3s ease;
}

.finish-button {
  width: 100%;
  padding: 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
}

.finish-button:hover {
  background: #3aa876;
}
</style> 