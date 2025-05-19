<template>
  <div class="guide-container">
    <!-- 进度指示器 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
      </div>
      <div class="progress-text">{{ currentStep }}/{{ totalSteps }}</div>
    </div>

    <!-- 问卷内容区域 -->
    <div class="question-container">
      <!-- 步骤1: 能量充能站 -->
      <div v-if="currentStep === 1" class="question-step">
        <h2 class="question-title">能量充能站</h2>
        <p class="question-subtitle">🔋 选择你的「社交充电」场景：</p>
        <div class="battery-container">
          <div class="battery" :class="{ 'battery-high': energyLevel === 'high', 'battery-low': energyLevel === 'low' }">
            <div class="battery-level" :style="{ height: energyLevel === 'high' ? '80%' : '20%' }"></div>
          </div>
        </div>
        <div class="options-container">
          <div 
            class="option" 
            :class="{ 'selected': energyLevel === 'high' }"
            @click="selectEnergyLevel('high')"
          >
            <span class="option-letter">A</span>
            <span class="option-text">朋友聚会后元气满满</span>
          </div>
          <div 
            class="option" 
            :class="{ 'selected': energyLevel === 'low' }"
            @click="selectEnergyLevel('low')"
          >
            <span class="option-letter">B</span>
            <span class="option-text">独自看场电影才能回血</span>
          </div>
        </div>
      </div>

      <!-- 步骤2: 决策天平 -->
      <div v-if="currentStep === 2" class="question-step">
        <h2 class="question-title">决策天平</h2>
        <p class="question-subtitle">⚖️ 拖动指针定位你的习惯：</p>
        <div class="decision-scale">
          <div class="scale-labels">
            <span class="scale-label">直觉派：跟着感觉走</span>
            <span class="scale-label">分析家：必须列清单</span>
          </div>
          <div class="scale-container" :style="{ background: `linear-gradient(to right, ${getScaleBackground()})` }">
            <div class="scale-pointer" :style="{ left: `${decisionScale}%` }" @mousedown="startDragging"></div>
          </div>
        </div>
      </div>

      <!-- 步骤3: 冲突剧场 -->
      <div v-if="currentStep === 3" class="question-step">
        <h2 class="question-title">冲突剧场</h2>
        <p class="question-subtitle">🎭 当朋友多次爽约，你会：</p>
        <div class="options-container">
          <div 
            v-for="(option, index) in conflictOptions" 
            :key="index"
            class="option" 
            :class="{ 'selected': conflictChoice === index }"
            @click="selectConflict(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
        <div v-if="showConflictAnimation" class="conflict-animation" :class="`animation-${conflictChoice}`"></div>
      </div>

      <!-- 步骤4: 信息消化器 -->
      <div v-if="currentStep === 4" class="question-step">
        <h2 class="question-title">信息消化器</h2>
        <p class="question-subtitle">📥 最让你头大的表达方式是：</p>
        <div class="info-bins">
          <div 
            v-for="(bin, index) in infoBins" 
            :key="index"
            class="info-bin" 
            :class="{ 'selected': infoDigestion === index }"
            @click="selectInfoDigestion(index)"
          >
            <div class="bin-icon">{{ bin.icon }}</div>
            <div class="bin-label">{{ bin.label }}</div>
          </div>
        </div>
      </div>

      <!-- 步骤5: 痛点扫描仪 -->
      <div v-if="currentStep === 5" class="question-step">
        <h2 class="question-title">痛点扫描仪</h2>
        <p class="question-subtitle">🔥 拖拽你最想攻克的3个场景：</p>
        <div class="pain-points">
          <div 
            v-for="(point, index) in painPoints" 
            :key="index"
            class="pain-point" 
            :class="{ 'selected': selectedPainPoints.includes(index) }"
            @click="togglePainPoint(index)"
          >
            <div class="point-text">{{ point }}</div>
            <div v-if="selectedPainPoints.includes(index)" class="fire-effect"></div>
          </div>
        </div>
        <div class="selection-limit" :class="{ 'limit-reached': selectedPainPoints.length >= 3 }">
          已选择 {{ selectedPainPoints.length }}/3
        </div>
      </div>

      <!-- 步骤6: 人格面具库 -->
      <div v-if="currentStep === 6" class="question-step">
        <h2 class="question-title">人格面具库</h2>
        <p class="question-subtitle">🎭 完成这句话：</p>
        <p class="question-text">当我说错话时，最希望别人觉得我______</p>
        <div class="options-container">
          <div 
            v-for="(option, index) in personalityMasks" 
            :key="index"
            class="option typewriter-option" 
            :class="{ 'selected': personalityMask === index }"
            @click="selectPersonalityMask(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
      </div>

      <!-- 步骤7: 社交X光机 -->
      <div v-if="currentStep === 7" class="question-step">
        <h2 class="question-title">社交X光机</h2>
        <p class="question-subtitle">👀 观看15秒模拟对话视频，判断对方情绪：</p>
        <div class="video-container">
          <div class="video-placeholder">
            <div class="video-timer">{{ videoTimer }}s</div>
            <div class="video-controls">
              <button @click="toggleVideo" class="video-button">
                {{ isVideoPlaying ? '暂停' : '播放' }}
              </button>
            </div>
          </div>
        </div>
        <div class="options-container">
          <div 
            v-for="(option, index) in emotionOptions" 
            :key="index"
            class="option" 
            :class="{ 'selected': emotionChoice === index }"
            @click="selectEmotion(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
        <div v-if="showHeatmap" class="heatmap-container">
          <div class="heatmap"></div>
        </div>
      </div>

      <!-- 步骤8: 压力词库安检 -->
      <div v-if="currentStep === 8" class="question-step">
        <h2 class="question-title">压力词库安检</h2>
        <p class="question-subtitle">⚠️ 快速点击让你焦虑的社交关键词：</p>
        <div class="timer">{{ pressureTimer }}s</div>
        <div class="pressure-words">
          <div 
            v-for="(word, index) in pressureWords" 
            :key="index"
            class="pressure-word" 
            :class="{ 'clicked': clickedPressureWords.includes(index) }"
            @click="clickPressureWord(index)"
          >
            {{ word }}
          </div>
        </div>
      </div>

      <!-- 步骤9: 人格进化论 -->
      <div v-if="currentStep === 9" class="question-step">
        <h2 class="question-title">人格进化论</h2>
        <p class="question-subtitle">🚀 你希望模拟器帮你成为：</p>
        <div class="evolution-options">
          <div 
            v-for="(option, index) in evolutionOptions" 
            :key="index"
            class="evolution-option" 
            :class="{ 'selected': evolutionChoice === index }"
            @click="selectEvolution(index)"
          >
            <div class="evolution-icon">{{ option.icon }}</div>
            <div class="evolution-text">{{ option.text }}</div>
          </div>
        </div>
      </div>

      <!-- 步骤10: 隐藏人设 -->
      <div v-if="currentStep === 10" class="question-step">
        <h2 class="question-title">隐藏人设</h2>
        <p class="question-subtitle">🔮 最后一步！随机抽取你的初始人格卡：</p>
        <div class="personality-card" :class="{ 'card-revealed': cardRevealed }">
          <div class="card-front" v-if="!cardRevealed">
            <div class="card-pattern"></div>
            <button class="draw-card-button" @click="drawCard">抽取人格卡</button>
          </div>
          <div class="card-back" v-else>
            <div class="card-title">{{ personalityCard.title }}</div>
            <div class="card-description">{{ personalityCard.description }}</div>
          </div>
        </div>
      </div>

      <!-- 结果页面 -->
      <div v-if="currentStep === 11" class="result-step">
        <h2 class="result-title">社交人格诊断报告</h2>
        <div class="report-container">
          <div class="report-section">
            <h3 class="report-subtitle">你的沟通形态</h3>
            <div class="report-value">{{ personalityReport.communicationStyle }}</div>
          </div>
          <div class="report-section">
            <h3 class="report-subtitle">高敏雷区</h3>
            <div class="report-value">{{ personalityReport.sensitivityArea }}</div>
            <div class="sensitivity-meter">
              <div class="meter-fill" :style="{ width: `${personalityReport.sensitivityValue}%` }"></div>
            </div>
          </div>
          <div class="report-section">
            <h3 class="report-subtitle">推荐练习场景</h3>
            <div class="report-value">{{ personalityReport.recommendedScenario }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <button 
        v-if="currentStep > 1 && currentStep <= 10" 
        class="nav-button prev-button" 
        @click="prevStep"
      >
        上一步
      </button>
      <button 
        v-if="currentStep < 11" 
        class="nav-button next-button" 
        @click="nextStep"
        :disabled="!canProceed"
      >
        {{ currentStep === 10 ? '查看报告' : '下一步' }}
      </button>
      <button 
        v-if="currentStep === 11" 
        class="nav-button start-button" 
        @click="startApp"
      >
        开始使用
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentStep = ref(1);
const totalSteps = 11; // 10个问题 + 1个结果页

// 步骤1: 能量充能站
const energyLevel = ref(null);

// 步骤2: 决策天平
const decisionScale = ref(50);
const isDragging = ref(false);

// 步骤3: 冲突剧场
const conflictOptions = [
  '直接问："你是不是不重视我？"',
  '发个"等得花都谢了"表情包',
  '默默取消下次约定'
];
const conflictChoice = ref(null);
const showConflictAnimation = ref(false);

// 步骤4: 信息消化器
const infoBins = [
  { icon: '📝', label: '纯文字小作文' },
  { icon: '🎤', label: '60秒语音方阵' },
  { icon: '😶', label: '没有表情包的对话' }
];
const infoDigestion = ref(null);

// 步骤5: 痛点扫描仪
const painPoints = [
  '被同事当众质疑',
  '相亲冷场窒息时刻',
  '拒绝朋友借钱',
  '家族群长辈说教'
];
const selectedPainPoints = ref([]);

// 步骤6: 人格面具库
const personalityMasks = [
  '幽默感救场王',
  '真诚但笨拙',
  '根本不在意'
];
const personalityMask = ref(null);

// 步骤7: 社交X光机
const emotionOptions = [
  '假笑敷衍',
  '真心认可',
  '隐藏不满'
];
const emotionChoice = ref(null);
const isVideoPlaying = ref(false);
const videoTimer = ref(15);
const showHeatmap = ref(false);
let videoInterval = null;

// 步骤8: 压力词库安检
const pressureWords = ['被比较', '必须回应', '客套话', '冷场'];
const clickedPressureWords = ref([]);
const pressureTimer = ref(5);
let pressureInterval = null;

// 步骤9: 人格进化论
const evolutionOptions = [
  { icon: '💼', text: '职场沟通高手' },
  { icon: '❤️', text: '亲密关系达人' },
  { icon: '🛡️', text: '社交恐惧免疫者' }
];
const evolutionChoice = ref(null);

// 步骤10: 隐藏人设
const personalityCards = [
  { title: '毒舌暖男', description: '表面毒舌，内心温暖，用幽默化解尴尬' },
  { title: '佛系捧场王', description: '随遇而安，善于倾听，不争不抢' },
  { title: '高冷梗王', description: '外表高冷，实则幽默，用梗化解社交压力' },
  { title: '社交变色龙', description: '适应力强，能根据不同场合调整社交风格' },
  { title: '温暖治愈系', description: '善解人意，能给予他人情感支持' }
];
const cardRevealed = ref(false);
const personalityCard = ref({ title: '', description: '' });

// 结果页面
const personalityReport = ref({
  communicationStyle: '刺猬型防御者',
  sensitivityArea: '被比较',
  sensitivityValue: 92,
  recommendedScenario: '家族群长辈说教模拟器'
});

// 计算属性：是否可以进入下一步
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return energyLevel.value !== null;
    case 2: return true; // 决策天平总是可以进入下一步
    case 3: return conflictChoice.value !== null;
    case 4: return infoDigestion.value !== null;
    case 5: return selectedPainPoints.value.length > 0;
    case 6: return personalityMask.value !== null;
    case 7: return emotionChoice.value !== null;
    case 8: return clickedPressureWords.value.length > 0;
    case 9: return evolutionChoice.value !== null;
    case 10: return cardRevealed.value;
    default: return true;
  }
});

// 方法：选择能量水平
const selectEnergyLevel = (level) => {
  energyLevel.value = level;
};

// 方法：开始拖动决策天平
const startDragging = (e) => {
  isDragging.value = true;
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  updateDecisionScale(e);
};

// 方法：处理拖动
const handleDragging = (e) => {
  if (isDragging.value) {
    updateDecisionScale(e);
  }
};

// 方法：停止拖动
const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDragging);
  document.removeEventListener('mouseup', stopDragging);
};

// 方法：更新决策天平位置
const updateDecisionScale = (e) => {
  const container = document.querySelector('.scale-container');
  if (container) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    decisionScale.value = percentage;
  }
};

// 方法：获取决策天平背景
const getScaleBackground = () => {
  const leftColor = '#e6f7ff'; // 水墨风格
  const rightColor = '#f0f0f0'; // 数据网格风格
  return `${leftColor}, ${rightColor}`;
};

// 方法：选择冲突处理方式
const selectConflict = (index) => {
  conflictChoice.value = index;
  showConflictAnimation.value = true;
  setTimeout(() => {
    showConflictAnimation.value = false;
  }, 500);
};

// 方法：选择信息消化方式
const selectInfoDigestion = (index) => {
  infoDigestion.value = index;
};

// 方法：切换痛点选择
const togglePainPoint = (index) => {
  const position = selectedPainPoints.value.indexOf(index);
  if (position === -1) {
    if (selectedPainPoints.value.length < 3) {
      selectedPainPoints.value.push(index);
    }
  } else {
    selectedPainPoints.value.splice(position, 1);
  }
};

// 方法：选择人格面具
const selectPersonalityMask = (index) => {
  personalityMask.value = index;
};

// 方法：切换视频播放状态
const toggleVideo = () => {
  isVideoPlaying.value = !isVideoPlaying.value;
  if (isVideoPlaying.value) {
    startVideoTimer();
  } else {
    clearInterval(videoInterval);
  }
};

// 方法：开始视频计时器
const startVideoTimer = () => {
  videoTimer.value = 15;
  videoInterval = setInterval(() => {
    videoTimer.value--;
    if (videoTimer.value <= 0) {
      clearInterval(videoInterval);
      isVideoPlaying.value = false;
      showHeatmap.value = true;
    }
  }, 1000);
};

// 方法：选择情绪判断
const selectEmotion = (index) => {
  emotionChoice.value = index;
};

// 方法：点击压力词
const clickPressureWord = (index) => {
  if (!clickedPressureWords.value.includes(index)) {
    clickedPressureWords.value.push(index);
  }
};

// 方法：开始压力词计时器
const startPressureTimer = () => {
  pressureTimer.value = 5;
  pressureInterval = setInterval(() => {
    pressureTimer.value--;
    if (pressureTimer.value <= 0) {
      clearInterval(pressureInterval);
    }
  }, 1000);
};

// 方法：选择进化方向
const selectEvolution = (index) => {
  evolutionChoice.value = index;
};

// 方法：抽取人格卡
const drawCard = () => {
  // 根据前面的选择确定人格卡
  const cardIndex = Math.floor(Math.random() * personalityCards.length);
  personalityCard.value = personalityCards[cardIndex];
  cardRevealed.value = true;
};

// 方法：生成人格报告
const generateReport = () => {
  // 这里可以根据前面的选择生成更个性化的报告
  // 简化版本使用固定报告
};

// 方法：上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 方法：下一步
const nextStep = () => {
  if (currentStep.value < totalSteps && canProceed.value) {
    if (currentStep.value === 7) {
      clearInterval(videoInterval);
    }
    if (currentStep.value === 8) {
      clearInterval(pressureInterval);
    }
    currentStep.value++;
    
    if (currentStep.value === 8) {
      startPressureTimer();
    }
    
    if (currentStep.value === 11) {
      generateReport();
    }
  }
};

// 方法：开始应用
const startApp = () => {
  // 设置引导页已查看的标记
  localStorage.setItem('guideViewed', 'true');
  // 保存用户问卷结果
  localStorage.setItem('personalityReport', JSON.stringify(personalityReport.value));
  // 跳转到会话页
  router.push('/chat');
};

// 生命周期钩子
onMounted(() => {
  // 初始化
});

onUnmounted(() => {
  // 清理定时器
  clearInterval(videoInterval);
  clearInterval(pressureInterval);
});
</script>

<style scoped>
.guide-container {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.progress-container {
  padding: 20px;
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}

.question-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.question-step, .result-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.question-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.question-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.question-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* 步骤1: 能量充能站 */
.battery-container {
  margin: 20px 0;
}

.battery {
  width: 100px;
  height: 200px;
  border: 5px solid #333;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.battery::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 10px;
  background-color: #333;
  border-radius: 5px 5px 0 0;
}

.battery-level {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #4CAF50;
  transition: height 0.5s ease;
}

.battery-high .battery-level {
  background-color: #4CAF50;
}

.battery-low .battery-level {
  background-color: #f44336;
}

.options-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.option.selected {
  background-color: #e8f5e9;
  border: 2px solid #4CAF50;
}

.option-letter {
  width: 30px;
  height: 30px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.option-text {
  flex: 1;
  font-size: 16px;
}

/* 步骤2: 决策天平 */
.decision-scale {
  width: 100%;
  margin: 20px 0;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.scale-label {
  font-size: 14px;
  color: #666;
}

.scale-container {
  height: 20px;
  background: linear-gradient(to right, #e6f7ff, #f0f0f0);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
}

.scale-pointer {
  position: absolute;
  top: -10px;
  width: 20px;
  height: 40px;
  background-color: #4CAF50;
  border-radius: 10px;
  transform: translateX(-50%);
  cursor: grab;
}

.scale-pointer:active {
  cursor: grabbing;
}

/* 步骤3: 冲突剧场 */
.conflict-animation {
  width: 100%;
  height: 100px;
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.animation-0 {
  background-color: #ffebee;
  animation: shake 0.5s;
}

.animation-1 {
  background-color: #e8f5e9;
  animation: bounce 0.5s;
}

.animation-2 {
  background-color: #e3f2fd;
  animation: fade 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* 步骤4: 信息消化器 */
.info-bins {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.info-bin {
  width: 80px;
  height: 120px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.info-bin:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.info-bin.selected {
  background-color: #e8f5e9;
  border: 2px solid #4CAF50;
}

.bin-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.bin-label {
  font-size: 12px;
  text-align: center;
  padding: 0 5px;
}

/* 步骤5: 痛点扫描仪 */
.pain-points {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.pain-point {
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pain-point:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pain-point.selected {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
}

.fire-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(to top, #ff5722, transparent);
  animation: flicker 1s infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.selection-limit {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.selection-limit.limit-reached {
  color: #f44336;
  font-weight: bold;
}

/* 步骤6: 人格面具库 */
.typewriter-option .option-text {
  font-family: 'Courier New', monospace;
  position: relative;
  overflow: hidden;
}

.typewriter-option.selected .option-text::after {
  content: '';
  position: absolute;
  right: 0;
  width: 2px;
  height: 100%;
  background-color: #333;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 步骤7: 社交X光机 */
.video-container {
  width: 100%;
  height: 200px;
  background-color: #333;
  border-radius: 10px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.video-timer {
  font-size: 24px;
  margin-bottom: 10px;
}

.video-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.heatmap-container {
  width: 100%;
  height: 100px;
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.heatmap {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #ffebee, #e8f5e9, #e3f2fd);
  opacity: 0.7;
}

/* 步骤8: 压力词库安检 */
.timer {
  font-size: 24px;
  font-weight: bold;
  color: #f44336;
  margin: 10px 0;
  text-align: center;
}

.pressure-words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.pressure-word {
  padding: 10px 15px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pressure-word:hover {
  transform: scale(1.05);
}

.pressure-word.clicked {
  background-color: #ffebee;
  color: #f44336;
  animation: explode 0.5s;
}

@keyframes explode {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 步骤9: 人格进化论 */
.evolution-options {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.evolution-option {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.evolution-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.evolution-option.selected {
  background-color: #e8f5e9;
  border: 2px solid #4CAF50;
}

.evolution-icon {
  font-size: 30px;
  margin-right: 15px;
}

.evolution-text {
  font-size: 16px;
}

/* 步骤10: 隐藏人设 */
.personality-card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
  margin: 20px 0;
}

.card-front, .card-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  transition: transform 0.6s;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card-front {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
}

.card-pattern {
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.draw-card-button {
  padding: 10px 20px;
  background-color: white;
  color: #6a11cb;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.draw-card-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-back {
  background-color: white;
  transform: rotateY(180deg);
  text-align: center;
}

.card-revealed .card-front {
  transform: rotateY(180deg);
}

.card-revealed .card-back {
  transform: rotateY(0);
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 结果页面 */
.result-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.report-container {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.report-section {
  margin-bottom: 20px;
}

.report-section:last-child {
  margin-bottom: 0;
}

.report-subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.report-value {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.sensitivity-meter {
  height: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background-color: #f44336;
  transition: width 0.5s ease;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.nav-button {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-button {
  background-color: #f5f5f5;
  color: #666;
}

.next-button {
  background-color: #4CAF50;
  color: white;
}

.next-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.start-button {
  background-color: #4CAF50;
  color: white;
  width: 100%;
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style> 