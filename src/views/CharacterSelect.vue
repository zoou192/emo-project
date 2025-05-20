<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const characters = ref([
  {
    id: 1,
    name: 'Be Whatever You Want',
    image: '../../public/images/character1.png',
    difficulty: '简单',
    unlocked: true,
    description: '突破自我，展现真实的你',
    personality: '开放、积极、富有同理心'
  },
  {
    id: 2,
    name: 'Fill Up With Knowledge',
    image: '../../public/images/character2.png',
    difficulty: '中等',
    unlocked: true,
    description: '获取知识，提升自我',
    personality: '理性、专注、善于分析'
  },
  {
    id: 3,
    name: 'Share your Emotions',
    image: '../../public/images/character3.png',
    difficulty: '困难',
    unlocked: true,
    description: '学会表达，分享情感',
    personality: '感性、共情、善解人意'
  }
])

const startChat = (character) => {
  router.push({
    name: 'Chat',
    params: { 
      characterId: character.id 
    },
    state: {
      character: {
        name: character.name,
        personality: character.personality,
        image: character.image
      }
    }
  })
}
</script>

<template>
  <div class="character-select">
    <div class="nav-header">
      <div class="nav-left">
        <button class="nav-btn">
          <span class="nav-icon">←</span>
        </button>
      </div>
      <div class="nav-title">EGO</div>
      <div class="nav-right">
        <button class="nav-btn">
          <span class="nav-icon">⋮</span>
        </button>
      </div>
    </div>
    <div class="welcome-section">
      <h1 class="welcome-title">选择你的对话伙伴</h1>
      <p class="welcome-desc">每个角色都有独特的性格和专长，选择一个开始对话吧</p>
    </div>
    <div class="character-grid">
      <div
        v-for="character in characters"
        :key="character.id"
        class="character-card"
        :class="{ 'locked': !character.unlocked }"
        @click="startChat(character)"
      >
        <div class="card-content">
          <div class="character-image">
            <img :src="character.image" :alt="character.name">
            <div v-if="!character.unlocked" class="lock-overlay">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
          <div class="character-info">
            <h3>{{ character.name }}</h3>
            <p class="description">{{ character.description }}</p>
            <p class="personality">{{ character.personality }}</p>
          </div>
        </div>
        <button class="start-chat-btn">开始对话</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-select {
  width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background: #ffffff;
  overflow-x: hidden;
  position: relative;
}

.nav-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  letter-spacing: 1px;
}

.welcome-section {
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.welcome-desc {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
}

.nav-left, .nav-right {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.nav-btn:active {
  background-color: #f0f0f0;
}

.nav-icon {
  font-size: 1.2rem;
  color: #333;
}

.character-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.character-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 184, 169, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--border-color);
}

.character-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 184, 169, 0.1);
}

.card-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.character-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  border: 2px solid var(--primary-light);
}

.character-info {
  flex: 1;
}

.character-info h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.personality {
  color: var(--primary-color);
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

.start-chat-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.8rem;
  border-radius: 12px;
  width: 100%;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.start-chat-btn::after {
  content: '→';
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.start-chat-btn:active {
  background: var(--primary-dark);
}

.start-chat-btn:active::after {
  transform: translateX(4px);
}

.character-card:nth-child(1) {
  background: #ffffff;
}

.character-card:nth-child(2) {
  background: #ffffff;
}

.character-card:nth-child(3) {
  background: #ffffff;
}

@media (max-width: 375px) {
  .character-select {
    width: 100%;
  }
  
  .welcome-section {
    padding: 1.2rem 1rem;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .character-grid {
    padding: 0.8rem;
  }
  
  .character-card {
    padding: 1rem;
  }
  
  .character-image {
    width: 60px;
    height: 60px;
  }
  
  .character-info h3 {
    font-size: 1rem;
  }
  
  .description {
    font-size: 0.8rem;
  }
  
  .personality {
    font-size: 0.75rem;
  }
}
</style> 