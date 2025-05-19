<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const metrics = ref({
  responseTime: 2.5,
  positiveWords: 75,
  socialEnergy: 80
})

const chartData = ref({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '社交能力得分',
      data: [65, 70, 75, 72, 78, 82, 85],
      borderColor: '#42b883',
      tension: 0.4
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
}

const wordCloud = ref([
  { word: '自信', weight: 8 },
  { word: '友好', weight: 7 },
  { word: '专业', weight: 6 },
  { word: '清晰', weight: 5 },
  { word: '积极', weight: 4 },
  { word: '耐心', weight: 3 },
  { word: '理解', weight: 2 }
])

const shareToCommunity = () => {
  // 实现分享功能
  alert('分享功能即将上线！')
}
</script>

<template>
  <div class="report-container">
    <h1 class="page-title">训练报告</h1>
    
    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>平均响应时间</h3>
        <div class="metric-value">{{ metrics.responseTime }}秒</div>
        <div class="metric-description">较上次提升 0.5秒</div>
      </div>
      
      <div class="metric-card">
        <h3>积极词汇占比</h3>
        <div class="metric-value">{{ metrics.positiveWords }}%</div>
        <div class="metric-description">较上次提升 5%</div>
      </div>
      
      <div class="metric-card">
        <h3>社交能量</h3>
        <div class="metric-value">{{ metrics.socialEnergy }}%</div>
        <div class="metric-description">较上次提升 8%</div>
      </div>
    </div>

    <!-- 详细数据区域 -->
    <div class="detailed-data">
      <div class="chart-container">
        <h3>历史得分趋势</h3>
        <div class="chart-wrapper">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="word-cloud-container">
        <h3>高频用词分析</h3>
        <div class="word-cloud">
          <span
            v-for="item in wordCloud"
            :key="item.word"
            class="word"
            :style="{ fontSize: `${item.weight * 2}px` }"
          >
            {{ item.word }}
          </span>
        </div>
      </div>
    </div>

    <!-- 分享按钮 -->
    <div class="share-section">
      <button class="share-button" @click="shareToCommunity">
        分享到社区
      </button>
    </div>
  </div>
</template>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.metric-card h3 {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.metric-value {
  font-size: 2.5rem;
  color: #42b883;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.metric-description {
  color: #666;
  font-size: 0.9rem;
}

.detailed-data {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-container,
.word-cloud-container {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.chart-container h3,
.word-cloud-container h3 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
}

.chart-wrapper {
  height: 300px;
}

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.word {
  color: #42b883;
  opacity: 0.8;
  transition: all 0.3s;
}

.word:hover {
  opacity: 1;
  transform: scale(1.1);
}

.share-section {
  text-align: center;
}

.share-button {
  background: #42b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.share-button:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.4);
}

@media (max-width: 768px) {
  .detailed-data {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 