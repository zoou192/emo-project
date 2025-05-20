<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import yqmfsAvatar from '../assets/images/yqmfs.png'

const router = useRouter()
const activeTab = ref('self')

const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'chat') {
    router.push('/chat')
  }
}

const personalityResult = ref({
  name: '元气魔法师',
  description: '聚会时用幽默打破沉默，拉近关系',
  avatar: yqmfsAvatar,
  traits: ['聚会能量', '社交魔法', '幽默化解', '亲密关系']
})

// 随机选择3个特质标签
const randomTraits = computed(() => {
  const traits = [...personalityResult.value.traits]
  const result = []
  for (let i = 0; i < 3 && traits.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * traits.length)
    result.push(traits[randomIndex])
    traits.splice(randomIndex, 1)
  }
  return result
})

// 情感分析结果类型
const EmotionType = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  NEUTRAL: 'neutral',
  ANXIOUS: 'anxious',
  EXCITED: 'excited'
}

// 情绪颜色映射
const emotionColorMap = {
  [EmotionType.HAPPY]: {
    color: '#FFD700',
    label: '开心',
    shadow: '0 0 15px rgba(255, 215, 0, 0.6)'
  },
  [EmotionType.SAD]: {
    color: '#2196F3',
    label: '难过',
    shadow: '0 0 15px rgba(33, 150, 243, 0.6)'
  },
  [EmotionType.ANGRY]: {
    color: '#F44336',
    label: '生气',
    shadow: '0 0 15px rgba(244, 67, 54, 0.6)'
  },
  [EmotionType.NEUTRAL]: {
    color: '#9E9E9E',
    label: '平静',
    shadow: '0 0 15px rgba(158, 158, 158, 0.6)'
  },
  [EmotionType.ANXIOUS]: {
    color: '#9C27B0',
    label: '焦虑',
    shadow: '0 0 15px rgba(156, 39, 176, 0.6)'
  },
  [EmotionType.EXCITED]: {
    color: '#FF9800',
    label: '兴奋',
    shadow: '0 0 15px rgba(255, 152, 0, 0.6)'
  }
};

// 情绪瓶收集
const emotionBottles = ref([]);

// 计算情绪统计数据
const emotionStats = computed(() => {
  const stats = {};
  emotionBottles.value.forEach(entry => {
    stats[entry.emotion] = (stats[entry.emotion] || 0) + 1;
  });
  return stats;
});

const getMostFrequentEmotion = () => {
  const stats = emotionStats.value;
  let mostFrequent = null;
  let maxCount = 0;
  for (const emotion in stats) {
    if (stats[emotion] > maxCount) {
      mostFrequent = emotion;
      maxCount = stats[emotion];
    }
  }
  return mostFrequent ? emotionColorMap[mostFrequent]?.label || '暂无' : '暂无';
};

// 添加判断常见情绪是否为负向情绪的函数
const getMostFrequentEmotionType = computed(() => {
  const stats = emotionStats.value;
  let mostFrequent = null;
  let maxCount = 0;
  
  for (const emotion in stats) {
    if (stats[emotion] > maxCount) {
      mostFrequent = emotion;
      maxCount = stats[emotion];
    }
  }
  
  return mostFrequent;
});

// 判断是否为负向情绪
const isNegativeEmotion = computed(() => {
  const mostFrequentEmotion = getMostFrequentEmotionType.value;
  return mostFrequentEmotion === EmotionType.SAD || 
         mostFrequentEmotion === EmotionType.ANGRY || 
         mostFrequentEmotion === EmotionType.ANXIOUS;
});

// 判断是否为正向情绪
const isPositiveEmotion = computed(() => {
  const mostFrequentEmotion = getMostFrequentEmotionType.value;
  return mostFrequentEmotion === EmotionType.HAPPY ||
         mostFrequentEmotion === EmotionType.EXCITED ||
         mostFrequentEmotion === EmotionType.NEUTRAL;
});

// 正向情绪安抚文案
const positiveMessages = [
  "今天的你，像阳光一样温暖！",
  "保持好心情，快乐每一天！",
  "你的笑容是最美的风景～",
  "继续加油，生活会越来越好！",
  "幸福其实很简单，正如现在的你～"
];

// 负向情绪安抚文案（原comfortMessages）
const comfortMessages = [
  "心情不好时，深呼吸，告诉自己：这只是暂时的～",
  "每一种情绪都有它存在的意义，接纳它，然后放手～",
  "愿你的心情如花般绽放，阴霾终将散去～",
  "给自己一个拥抱，你比想象中更坚强～",
  "今天的乌云，孕育着明天的彩虹～"
];

// 随机获取安抚文案
const randomComfortMessage = computed(() => {
  if (isPositiveEmotion.value) {
    const index = Math.floor(Math.random() * positiveMessages.length);
    return positiveMessages[index];
  } else {
    const index = Math.floor(Math.random() * comfortMessages.length);
    return comfortMessages[index];
  }
});

// 舒缓音乐列表
const calmingMusic = computed(() => {
  if (isPositiveEmotion.value) {
    return [
      { name: "猪猪侠", url: "https://music.163.com/song/media/outer/url?id=34324641.mp3" }
    ];
  } else {
    return [
      { name: "篝火", url: "https://music.163.com/song/media/outer/url?id=1497056948.mp3" }
    ];
  }
});

// 选中的音乐
const selectedMusic = ref(null);
// 选中的音乐索引
const selectedMusicIndex = ref(0);

// 音频播放器引用
const audioPlayer = ref(null);
// 新增播放状态变量
const isPlaying = ref(false);

// 选择音乐
const selectMusic = () => {
  selectedMusic.value = calmingMusic.value[selectedMusicIndex.value];
  if (audioPlayer.value) {
    audioPlayer.value.src = selectedMusic.value.url;
    audioPlayer.value.play().then(() => {
      isPlaying.value = true;
    }).catch(error => {
      isPlaying.value = false;
      console.error('音频播放失败:', error);
    });
  }
};

// 播放/暂停当前音乐
const toggleCurrentMusic = () => {
  if (!selectedMusic.value) {
    selectedMusic.value = calmingMusic.value[selectedMusicIndex.value];
  }
  if (audioPlayer.value) {
    if (audioPlayer.value.paused) {
      audioPlayer.value.src = selectedMusic.value.url;
      audioPlayer.value.play().then(() => {
        isPlaying.value = true;
      }).catch(error => {
        isPlaying.value = false;
        console.error('音频播放失败:', error);
      });
    } else {
      audioPlayer.value.pause();
      isPlaying.value = false;
    }
  }
};

// 播放/暂停音乐（旧方法，保留向后兼容）
const toggleMusic = (music) => {
  if (selectedMusic.value === music && audioPlayer.value && !audioPlayer.value.paused) {
    audioPlayer.value.pause();
    selectedMusic.value = null;
  } else {
    selectedMusic.value = music;
    selectedMusicIndex.value = calmingMusic.value.findIndex(m => m.name === music.name);
    if (audioPlayer.value) {
      audioPlayer.value.src = music.url;
      audioPlayer.value.play().catch(error => {
        console.error('音频播放失败:', error);
      });
    }
  }
};

// 添加音量控制
const volume = ref(80);

// 更新音量
const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100;
  }
};

// 星星动效相关
const stars = ref([])

function createStar() {
  const left = Math.random() * 100 // 百分比
  const duration = 1.5 + Math.random() * 1.5 // 1.5~3s
  const size = 18 + Math.random() * 10 // px
  const rotate = Math.random() * 360
  const id = Date.now() + Math.random()
  const symbol = Math.random() < 0.5 ? '✨' : '🌟'
  stars.value.push({ left, duration, size, rotate, id, symbol })
}

function startStarAnimation() {
  let interval = 180 // 初始间隔，较慢
  let count = 0
  const maxCount = 40
  function drop() {
    if (count >= maxCount) return
    createStar()
    count++
    // 逐渐变快
    interval = Math.max(20, interval - 4)
    setTimeout(drop, interval)
  }
  drop()
  // 3.5秒后清理所有星星
  setTimeout(() => { stars.value = [] }, 3500)
}

onMounted(() => {
  // 从localStorage获取用户答案
  const answers = JSON.parse(localStorage.getItem('onboardingAnswers') || '{}')
  if (Object.keys(answers).length > 0) {
    const answerKey = Object.values(answers).join('')
    const result = personalityMap[answerKey]
    if (result) {
      personalityResult.value = {
        ...result,
        traits: generateTraits(answers)
      }
    }
  }
  
  // 从localStorage获取情绪瓶数据
  const savedEmotionBottles = localStorage.getItem('emotionBottles')
  
  if (savedEmotionBottles) {
    emotionBottles.value = JSON.parse(savedEmotionBottles)
  }
  
  // 初始化音量和默认选中音乐
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100;
    audioPlayer.value.addEventListener('play', () => { isPlaying.value = true; });
    audioPlayer.value.addEventListener('pause', () => { isPlaying.value = false; });
    audioPlayer.value.addEventListener('ended', () => { isPlaying.value = false; });
  }
  
  // 默认选择第一首音乐
  selectedMusic.value = calmingMusic.value[selectedMusicIndex.value];
  startStarAnimation()
})

// 防止 personalityMap 未定义报错
const personalityMap = {}

// 添加底部面板控制变量
const showBottomPanel = ref(false);
const panelType = ref('stats'); // 'stats' 或 'entries'

// 打开底部面板
const openBottomPanel = (type) => {
  panelType.value = type;
  showBottomPanel.value = true;
};

// 关闭底部面板
const closeBottomPanel = () => {
  showBottomPanel.value = false;
};
</script>

<template>
  <div class="self-container">
    <!-- 星星动效层 -->
    <div class="star-fall-layer">
      <span
        v-for="star in stars"
        :key="star.id"
        class="falling-star"
        :style="{
          left: star.left + '%',
          fontSize: star.size + 'px',
          animationDuration: star.duration + 's',
          transform: `rotate(${star.rotate}deg)`
        }"
      >{{ star.symbol }}</span>
    </div>
    <div class="chat-header">
      <div class="nav-left">
        <div 
          class="nav-item" 
          :class="{ active: activeTab === 'chat' }"
          @click="switchTab('chat')"
        >说说</div>
        <div 
          class="nav-item" 
          :class="{ active: activeTab === 'self' }"
          @click="switchTab('self')"
        >情绪瓶</div>
      </div>
    </div>
    
    <div class="self-content">
      <!-- <div class="user-profile">
        <div class="avatar">
          <img :src="personalityResult.avatar" alt="用户头像">
        </div>
        <div class="info">
          <div class="name">{{ personalityResult.name }}</div>
          <div class="traits">
            <span v-for="trait in randomTraits" :key="trait" class="trait-tag">
              {{ trait }}
            </span>
          </div>
        </div>
      </div> -->
      
      <!-- 情绪收集信息 -->
      <div class="emotion-collection">
        <div class="collection-header">
          <img src="../assets/images/bottle.png" alt="情绪瓶" class="bottle-image">
        </div>
      </div>
      <!-- @click="openBottomPanel('entries')"  @click="openBottomPanel('stats')"  @click="openBottomPanel('stats')"-->
      <!-- 负面情绪安抚组件 -->
      <div
           class="comfort-section">
        <div class="collection-data-container">
          <div class="card-item">
            <div class="card-icon-label-row">
              <div class="card-icon">📝</div>
              <div class="card-label">收集总数</div>
            </div>
            <div class="card-value">{{ emotionBottles.length || 0 }}</div>
          </div>
          <div class="card-item">
            <div class="card-icon-label-row">
              <div class="card-icon">🌈</div>
              <div class="card-label">情绪种类</div>
            </div>
            <div class="card-value">{{ Object.keys(emotionStats).length || 0 }}</div>
          </div>
          <div class="card-item">
            <div class="card-icon-label-row">
              <div class="card-icon">⭐</div>
              <div class="card-label">常见情绪</div>
            </div>
            <div class="card-value"
                 :class="{ 'emotion-angry': getMostFrequentEmotionType === EmotionType.ANGRY }">
              {{ getMostFrequentEmotion() }}
            </div>
          </div>
        </div>
        <div class="comfort-message">
          <div class="message-divider"></div>
          <div class="message-text">{{ randomComfortMessage }}</div>
        </div>
        <div class="music-section">
          <!-- 当前播放信息 -->
          <div class="player-container">
            <div class="now-playing">
              <div class="player-content">
                <div class="cd-container" :class="{ 'rotating': isPlaying }">
                  <img src="../assets/images/cd.webp" alt="CD" class="cd-image">
                </div>
                <div class="player-info">
                  <div class="player-title">
                    <span>{{ selectedMusic ? selectedMusic.name : '篝火' }}</span>
                  </div>
                  <div class="player-controls">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      v-model="volume" 
                      @input="updateVolume" 
                      class="volume-slider"
                    >
                    <button class="control-button" @click="toggleCurrentMusic">
                      <span v-if="audioPlayer && !audioPlayer.paused">⏸️</span>
                      <span v-else>▶️</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 音频播放器 -->
        <audio ref="audioPlayer" loop></audio>
      </div>
    </div>

    <!-- 底部动态面板 -->
    <div class="bottom-panel-container" v-if="showBottomPanel">
      <div class="panel-overlay" @click="closeBottomPanel"></div>
      <div class="bottom-panel">
        <div class="panel-header">
          <div class="panel-title">{{ panelType === 'stats' ? '情绪统计' : '情绪记录' }}</div>
          <div class="close-button" @click="closeBottomPanel">×</div>
        </div>
        
        <!-- 情绪标签统计 -->
        <div class="panel-content" v-if="panelType === 'stats' && Object.keys(emotionStats).length > 0">
          <div class="emotion-tags">
            <div 
              v-for="(count, emotion) in emotionStats" 
              :key="emotion"
              class="emotion-tag"
              :style="{
                backgroundColor: emotionColorMap[emotion]?.color + '20',
                color: emotionColorMap[emotion]?.color
              }"
            >
              <span class="tag-label">{{ emotionColorMap[emotion]?.label }}</span>
              <span class="tag-count">{{ count }}</span>
            </div>
          </div>
        </div>
        
        <!-- 情绪日记列表 -->
        <div class="panel-content" v-if="panelType === 'entries' && emotionBottles.length > 0">
          <div 
            v-for="entry in emotionBottles" 
            :key="entry.id"
            class="emotion-entry"
            :style="{
              borderLeftColor: emotionColorMap[entry.emotion]?.color
            }"
          >
            <div class="emotion-label" :style="{ color: emotionColorMap[entry.emotion]?.color }">
              {{ emotionColorMap[entry.emotion]?.label }}
            </div>
            <div class="entry-content">{{ entry.content }}</div>
            <div class="entry-time">{{ new Date(entry.timestamp).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.self-container {
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  background-color: #F8FBFF;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(to bottom, rgba(31, 234, 187, 0.05) 0px, rgba(31, 234, 187, 0) 100px);
  background-size: 100% 100px;
  background-position: top;
  background-repeat: no-repeat;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.self-container::after {
  content: '';
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 0;
}

.chat-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(31, 234, 187, 0.02) 0%, rgba(31, 234, 187, 0) 100%);
  z-index: 100;
  padding: 0 16px;
  z-index: 100;
}

.nav-left {
  display: flex;
  gap: 0px;
}

.nav-item {
  font-size: 16px;
  font-weight: 400;
  color: rgba(17, 25, 37, 0.65);
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.nav-item.active {
  color: #111;
  font-weight: 600;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 4px;
  background: #1FEABB !important;
  border-radius: 2px;
}

.self-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 56px;
  position: relative;
  z-index: 1;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  margin-bottom: 24px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  background: #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.traits {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow: hidden;
}

.trait-tag {
  font-size: 12px;
  color: #666;
  background: rgba(17, 17, 17, 0.03);
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 8px;
  white-space: nowrap;
}

.emotion-collection {
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 24px;
}

.collection-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.collection-title {
  font-size: 16px;
  font-weight: 500;
  color: #111;
}

.bottle-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.collection-data-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 12px;
}

.card-item {
  text-align: center;
  border-radius: 16px;
  padding: 6px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-item:active {
  transform: scale(0.98);
}

.card-icon-label-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.card-icon {
  font-size: 14px;
  margin-bottom: 0;
}

.card-label {
  font-size: 13px;
  color: rgba(17, 17, 17, 0.45);
  margin-bottom: 0;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #111;
}

.emotion-stats {
  padding: 16px;
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-title {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 12px;
}

.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.emotion-tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-count {
  font-weight: 500;
}

.emotion-entries {
  margin-top: 16px;
}

.emotion-entry {
  background: white;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  margin-bottom: 16px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.emotion-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.entry-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-top: 8px;
}

.entry-time {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: right;
}

.comfort-section {
  padding: 16px;
  background: linear-gradient(to bottom, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.03));
  border-radius: 16px;
  margin-top: 16px;
}

.comfort-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 8px;
}

.message-divider {
  width: 100%;
  height: 1px;
  background: rgba(17, 17, 17, 0.03);
  margin-top: 10px;
  margin-bottom: 20px;
}

.message-text {
  font-size: 14px;
  color: rgba(17, 17, 17, 0.65);
  line-height: 1.5;
  text-align: center;
  width: 100%;
}

.music-section {
  margin-top: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 12px;
}

.music-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.music-item {
  cursor: pointer;
  background: #F8FBFF;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: calc(50% - 12px);
  transition: all 0.3s ease;
  border: 1px solid rgba(31, 234, 187, 0.1);
}

.music-item.active {
  background: rgba(31, 234, 187, 0.1);
  border: 1px solid #1FEABB;
}

.music-icon {
  font-size: 20px;
  color: #1FEABB;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(31, 234, 187, 0.2);
}

.icon.playing {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.music-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.player-container {
  margin-top: 0;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.now-playing {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-title {
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: -2px;
}

.control-button {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
  outline: none;
}

.control-button:focus {
  outline: none !important;
  box-shadow: none !important;
}

.control-button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.control-button:active {
  outline: none !important;
  box-shadow: none !important;
}

.prev-button, .next-button {
  font-size: 14px;
  width: 32px;
  height: 32px;
}

.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, #2196F3, rgba(33, 150, 243, 0.3));
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}

.player-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cd-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(33, 150, 243, 0.2);
  flex-shrink: 0;
}

.cd-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.player-info {
  flex: 1;
}

.player-title {
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0;
}

.rotating {
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bottom-panel-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 1001;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 18px;
  font-weight: 500;
  color: #111;
}

.close-button {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.panel-content {
  margin-top: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.emotion-angry {
  font-size: 18px !important;
}

.star-fall-layer {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;
}
.falling-star {
  position: absolute;
  top: -30px;
  animation: star-fall linear forwards;
  opacity: 0.85;
  filter: drop-shadow(0 2px 6px #fff6);
}
@keyframes star-fall {
  0% {
    top: -30px;
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    /* 停在情绪瓶底部，约320px（瓶200+上方margin等120） */
    top: 320px;
    opacity: 0;
  }
}
</style> 