<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import lifeIcon from '../assets/images/生活.svg'
import socialIcon from '../assets/images/社交.svg'
import workIcon from '../assets/images/工作.svg'
import yqmfsAvatar from '../assets/images/yqmfs.png'
import sendSelectIcon from '../assets/images/send_select.svg'
import sendNormalIcon from '../assets/images/send_normal.svg'

const router = useRouter()
const activeTab = ref('chat')
const selectedScenario = ref('life') // 默认选中生活场景

const scenarios = [
  { id: 'life', name: '生活琐事', icon: lifeIcon },
  { id: 'social', name: '人际交往', icon: socialIcon },
  { id: 'work', name: '工作日常', icon: workIcon }
]

const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'self') {
    router.push('/self')
  }
}

const getTimeBasedMessage = (scenario) => {
  return ''
}

const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const showPanel = ref(false)
const isThinking = ref(false)
const currentStream = ref(null)
const personalityResult = ref({
  name: '元气魔法师',
  description: '聚会时用幽默打破沉默，拉近关系',
  avatar: yqmfsAvatar,
  traits: ['聚会能量', '社交魔法', '幽默化解', '亲密关系']
})
const userAnswers = ref(null)

// 特质标签权重映射表
const traitWeights = {
  '✨ 社交达人': { base: 1.0, factors: ['1A', '4B', '8A'] },
  '🌟 独处专家': { base: 1.0, factors: ['1B', '3B', '7A'] },
  '🎯 目标导向': { base: 1.0, factors: ['2A', '5B', '7B', '8D', '9C'] },
  '🎨 创意无限': { base: 1.0, factors: ['2B', '5D', '8B'] },
  '💬 表达大师': { base: 1.0, factors: ['3A', '4A', '8A'] },
  '🎭 情绪管理': { base: 1.0, factors: ['3B', '7A', '9B'] },
  '🤔 深度思考': { base: 1.0, factors: ['3C', '7C', '9B'] },
  '😊 表情包达人': { base: 1.0, factors: ['4A', '6A'] },
  '📱 社交达人': { base: 1.0, factors: ['4B', '8A'] },
  '🎮 游戏玩家': { base: 1.0, factors: ['4C', '6B'] },
  '📊 数据分析': { base: 1.0, factors: ['5A', '8A'] },
  '🤝 团队协作': { base: 1.0, factors: ['5C', '8C'] },
  '💪 能量满满': { base: 1.0, factors: ['6A', '8A'] },
  '🌙 夜猫子': { base: 1.0, factors: ['6B', '7A'] },
  '☀️ 早起鸟': { base: 1.0, factors: ['6C', '7B'] },
  '🎭 角色扮演': { base: 1.0, factors: ['7A', '8B'] },
  '💼 职场达人': { base: 1.0, factors: ['8A', '9C'] },
  '😊 乐观向上': { base: 1.0, factors: ['9A', '6A'] }
}

// 特质标签更新历史
const traitHistory = ref([])

// 计算特质标签权重
const calculateTraitWeight = (trait, answers) => {
  let weight = traitWeights[trait].base
  traitWeights[trait].factors.forEach(factor => {
    const [question, answer] = factor.split('')
    if (answers[question] === answer) {
      weight += 0.5 // 每个匹配因素增加0.5权重
    }
  })
  return weight
}

// 生成特质标签
const generateTraits = (answers) => {
  const traitScores = {}
  
  // 计算每个特质的得分
  Object.keys(traitWeights).forEach(trait => {
    traitScores[trait] = calculateTraitWeight(trait, answers)
  })
  
  // 按得分排序并获取前3个特质
  const topTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trait]) => trait)
  
  // 记录特质更新历史
  traitHistory.value.push({
    timestamp: new Date().toISOString(),
    traits: topTraits,
    scores: traitScores
  })
  
  // 如果历史记录超过10条，保留最新的10条
  if (traitHistory.value.length > 10) {
    traitHistory.value = traitHistory.value.slice(-10)
  }
  
  return topTraits
}

// 动态更新特质标签
const updateTraits = (newAnswers) => {
  const currentTraits = personalityResult.value.traits
  const newTraits = generateTraits(newAnswers)
  
  // 计算特质变化
  const addedTraits = newTraits.filter(trait => !currentTraits.includes(trait))
  const removedTraits = currentTraits.filter(trait => !newTraits.includes(trait))
  
  // 如果有变化，更新特质
  if (addedTraits.length > 0 || removedTraits.length > 0) {
    personalityResult.value.traits = newTraits
  }
}

// 监听用户答案变化
watch(userAnswers, (newAnswers) => {
  if (newAnswers && Object.keys(newAnswers).length > 0) {
    updateTraits(newAnswers)
  }
}, { deep: true })

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const showThinking = ref(true)

const thinkingMessage = computed(() => messages.value.find(m => m.type === 'thinking'))

const inputActive = computed(() => !!newMessage.value.trim())

const md = new MarkdownIt()

const pureThinking = computed(() => {
  if (!thinkingMessage.value || !thinkingMessage.value.content) return ''
  const raw = thinkingMessage.value.content.split('【最终结论】')[0]
  return md.render(raw)
})

const finalConclusion = (content) => {
  if (!content) return ''
  const idx = content.indexOf('【最终结论】')
  return idx !== -1 ? md.render(content.slice(idx)) : ''
}

// 情感分析结果类型
const EmotionType = {
  // 正向情绪
  HAPPY: 'happy',        // 快乐/喜悦
  EXCITED: 'excited',    // 兴奋/自豪
  LOVE: 'love',          // 爱/感情
  GRATEFUL: 'grateful',  // 感激
  PEACEFUL: 'peaceful',  // 宁静
  HOPEFUL: 'hopeful',    // 希望
  
  // 负向情绪
  SAD: 'sad',            // 悲伤
  ANGRY: 'angry',        // 愤怒
  ANXIOUS: 'anxious',    // 焦虑/紧张
  SHAME: 'shame',        // 羞耻
  FEAR: 'fear',          // 恐惧
  DISGUST: 'disgust',    // 厌恶
  
  // 中性情绪
  NEUTRAL: 'neutral'     // 平静/中性
}

// 场景关键词定义
const scenarioKeywords = {
  conflict: ['冲突', '争吵', '吵架', '打架', '骂', '生气', '不满', '不爽', '不开心', '讨厌'],
  progress: ['进步', '成长', '进展', '完成', '达成', '实现', '目标', '成就', '成功'],
  pet: ['猫', '狗', '宠物', '小动物', '喵', '汪'],
  work: ['工作', '上班', '公司', '同事', '老板', '项目', '任务'],
  study: ['学习', '功课', '作业', '考试', '论文', '上课', '学校', '大学', '高中', '初中'],
  entertainment: ['电影', '音乐', '游戏', '演唱会', '电视', '剧', '综艺', '明星', '艺人']
}

// 情绪颜色映射
const emotionColorMap = {
  // 正向情绪
  [EmotionType.HAPPY]: {
    color: '#FFD700',
    label: '快乐',
    shadow: '0 0 15px rgba(255, 215, 0, 0.6)'
  },
  [EmotionType.EXCITED]: {
    color: '#FF9800',
    label: '兴奋',
    shadow: '0 0 15px rgba(255, 152, 0, 0.6)'
  },
  [EmotionType.LOVE]: {
    color: '#E91E63',
    label: '喜爱',
    shadow: '0 0 15px rgba(233, 30, 99, 0.6)'
  },
  [EmotionType.GRATEFUL]: {
    color: '#8BC34A',
    label: '感恩',
    shadow: '0 0 15px rgba(139, 195, 74, 0.6)'
  },
  [EmotionType.PEACEFUL]: {
    color: '#00BCD4',
    label: '平静',
    shadow: '0 0 15px rgba(0, 188, 212, 0.6)'
  },
  [EmotionType.HOPEFUL]: {
    color: '#4CAF50',
    label: '希望',
    shadow: '0 0 15px rgba(76, 175, 80, 0.6)'
  },
  
  // 负向情绪
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
  [EmotionType.ANXIOUS]: {
    color: '#9C27B0',
    label: '焦虑',
    shadow: '0 0 15px rgba(156, 39, 176, 0.6)'
  },
  [EmotionType.SHAME]: {
    color: '#795548',
    label: '羞愧',
    shadow: '0 0 15px rgba(121, 85, 72, 0.6)'
  },
  [EmotionType.FEAR]: {
    color: '#673AB7',
    label: '恐惧',
    shadow: '0 0 15px rgba(103, 58, 183, 0.6)'
  },
  [EmotionType.DISGUST]: {
    color: '#607D8B',
    label: '厌恶',
    shadow: '0 0 15px rgba(96, 125, 139, 0.6)'
  },
  
  // 中性情绪
  [EmotionType.NEUTRAL]: {
    color: '#9E9E9E',
    label: '平静',
    shadow: '0 0 15px rgba(158, 158, 158, 0.6)'
  }
};

// 情感分析函数
const analyzeEmotion = (text) => {
  const textLower = text.toLowerCase();
  
  // 场景识别
  let detectedScenario = null;
  let matchedKeywords = [];
  
  // 优先检查特殊场景
  if (scenarioKeywords.conflict.some(keyword => textLower.includes(keyword))) {
    detectedScenario = 'conflict';
    matchedKeywords = scenarioKeywords.conflict.filter(keyword => textLower.includes(keyword));
  } else if (scenarioKeywords.progress.some(keyword => textLower.includes(keyword))) {
    detectedScenario = 'progress';
    matchedKeywords = scenarioKeywords.progress.filter(keyword => textLower.includes(keyword));
  } else {
    // 检查其他场景
    for (const [key, words] of Object.entries(scenarioKeywords)) {
      if (key !== 'conflict' && key !== 'progress' && words.some(word => textLower.includes(word))) {
        detectedScenario = key;
        matchedKeywords = words.filter(word => textLower.includes(word));
        break;
      }
    }
  }

  // 扩展关键词匹配 - 正向情绪
  const happyKeywords = ['开心', '高兴', '快乐', '好', '棒', '赞', '喜欢', '嘻嘻', '哈哈', '嘿嘿', '欢喜', '快活', '欢乐'];
  const excitedKeywords = ['兴奋', '激动', '太棒了', '太赞了', '太厉害了', '好棒', '好厉害', '好强', '自豪', '骄傲', '成就'];
  const loveKeywords = ['爱', '喜欢', '爱慕', '思念', '想念', '怀念', '依恋', '珍惜', '疼爱', '迷恋', '宠爱', '亲密'];
  const gratefulKeywords = ['感谢', '感恩', '谢谢', '感激', '荣幸', '幸运', '幸福', '满足', '知足', '感动'];
  const peacefulKeywords = ['平静', '安宁', '放松', '宁静', '祥和', '舒适', '安心', '坦然', '从容', '淡定'];
  const hopefulKeywords = ['希望', '期待', '盼望', '向往', '梦想', '憧憬', '展望', '乐观', '信心', '信任'];
  
  // 负向情绪关键词
  const sadKeywords = ['难过', '伤心', '悲伤', '不好', '糟糕', '失望', '痛苦', '遗憾', '惆怅', '忧伤', '难受', '沮丧'];
  const angryKeywords = ['生气', '愤怒', '恼火', '气死', '愤恨', '气愤', '恼怒', '怒火', '发火', '暴怒', '不爽', '烦'];
  const anxiousKeywords = ['担心', '焦虑', '紧张', '忧虑', '烦恼', '不安', '惶恐', '忐忑', '揪心', '着急', '压力'];
  const fearKeywords = ['害怕', '恐惧', '惊恐', '惊吓', '惊慌', '畏惧', '恐慌', '胆怯'];
  const shameKeywords = ['羞愧', '羞耻', '惭愧', '丢脸', '尴尬', '难堪', '羞涩', '窘迫', '惭愧'];
  const disgustKeywords = ['厌恶', '反感', '讨厌', '恶心', '憎恨', '嫌弃', '排斥', '恶感'];

  // 情感分析结果
  let emotion = EmotionType.NEUTRAL;
  let intensity = 1;

  // 判断情绪类型 - 按优先级检查
  // 负向情绪
  if (fearKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.FEAR;
    intensity = 1.6;
  } else if (angryKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.ANGRY;
    intensity = 1.5;
  } else if (sadKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.SAD;
    intensity = 1.3;
  } else if (anxiousKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.ANXIOUS;
    intensity = 1.4;
  } else if (shameKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.SHAME;
    intensity = 1.2;
  } else if (disgustKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.DISGUST;
    intensity = 1.3;
  } 
  // 正向情绪
  else if (excitedKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.EXCITED;
    intensity = 1.7;
  } else if (happyKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.HAPPY;
    intensity = 1.5;
  } else if (loveKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.LOVE;
    intensity = 1.6;
  } else if (gratefulKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.GRATEFUL;
    intensity = 1.4;
  } else if (hopefulKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.HOPEFUL;
    intensity = 1.3;
  } else if (peacefulKeywords.some(keyword => textLower.includes(keyword))) {
    emotion = EmotionType.PEACEFUL;
    intensity = 1.1;
  }

  // 场景特定情绪覆盖
  if (detectedScenario === 'conflict') {
    emotion = EmotionType.ANGRY;
    intensity = 1.5;
  } else if (detectedScenario === 'progress') {
    emotion = EmotionType.EXCITED;
    intensity = 1.2;
  }

  return {
    emotion,
    intensity,
    scenario: detectedScenario,
    keywords: matchedKeywords,
    isPositive: [EmotionType.HAPPY, EmotionType.EXCITED, EmotionType.LOVE, 
                EmotionType.GRATEFUL, EmotionType.PEACEFUL, EmotionType.HOPEFUL].includes(emotion)
  };
};

// 虚拟角色回复模板
const characterResponses = {
  life: {
    [EmotionType.HAPPY]: [
      '检测到快乐能量～让我用魔法棒把这份快乐变成永恒吧～✨',
      '哇～你的快乐指数爆表了～来点彩虹糖庆祝一下～🌈',
      '快乐能量正在扩散～连我的小机器人都在跳舞了～🤖'
    ],
    [EmotionType.SAD]: [
      '检测到"难过"能量～我派外星人把烦恼偷走了～🛸',
      '别担心～我的魔法口袋里有超多快乐糖果，给你一颗～🍬',
      '让我用魔法把乌云变成彩虹吧～🌈'
    ],
    [EmotionType.ANGRY]: [
      '检测到"愤怒"能量～来杯魔法冰镇柠檬水降降温～🍋',
      '生气的时候，我的小机器人会跳搞笑舞蹈给你看～🤖',
      '让我用魔法把怒火变成烟花吧～🎆'
    ],
    [EmotionType.NEUTRAL]: [
      '检测到"平静"能量～来点魔法小点心吧～🍪',
      '平静的时候最适合喝杯魔法茶～☕️',
      '我的小机器人说，平静也是一种力量～🤖'
    ],
    [EmotionType.ANXIOUS]: [
      '检测到"焦虑"能量～来颗魔法糖果压压惊～🍬',
      '焦虑的时候，我的小机器人会讲笑话给你听～🤖',
      '让我用魔法把焦虑变成勇气吧～✨'
    ],
    [EmotionType.EXCITED]: [
      '检测到"兴奋"能量～来点魔法烟花庆祝～🎆',
      '太棒了～我的小机器人都在为你欢呼～🤖',
      '兴奋能量爆表～来杯魔法果汁吧～🍹'
    ]
  },
  social: {
    [EmotionType.HAPPY]: [
      '检测到"社交快乐"能量～来点魔法小饼干分享给朋友～🍪',
      '社交达人模式启动～我的小机器人都在为你鼓掌～🤖',
      '快乐能量正在扩散～来点魔法糖果分享～🍬'
    ],
    [EmotionType.SAD]: [
      '检测到"社交焦虑"能量～来杯魔法奶茶放松一下～🧋',
      '社交压力大～我的小机器人会讲笑话帮你缓解～🤖',
      '让我用魔法把社交压力变成动力吧～✨'
    ],
    [EmotionType.ANGRY]: [
      '检测到"社交冲突"能量～来颗魔法糖果冷静一下～🍬',
      '生气的时候，我的小机器人会跳搞笑舞蹈～🤖',
      '让我用魔法把冲突变成和解吧～✨'
    ],
    [EmotionType.NEUTRAL]: [
      '检测到"社交平衡"能量～来点魔法小点心～🍪',
      '平静的社交状态，我的小机器人说这很好～🤖',
      '社交就像调味料，适量就好～来杯魔法茶～☕️'
    ],
    [EmotionType.ANXIOUS]: [
      '检测到"社交焦虑"能量～来颗魔法糖果压压惊～🍬',
      '焦虑的时候，我的小机器人会讲笑话～🤖',
      '让我用魔法把焦虑变成勇气吧～✨'
    ],
    [EmotionType.EXCITED]: [
      '检测到"社交兴奋"能量～来点魔法烟花庆祝～🎆',
      '太棒了～我的小机器人都在为你欢呼～🤖',
      '社交达人模式启动～来杯魔法果汁～🍹'
    ]
  },
  work: {
    [EmotionType.HAPPY]: [
      '检测到"工作快乐"能量～来点魔法小饼干庆祝～🍪',
      '工作达人模式启动～我的小机器人都在为你鼓掌～🤖',
      '快乐能量正在扩散～来点魔法糖果～🍬'
    ],
    [EmotionType.SAD]: [
      '检测到"工作压力"能量～来杯魔法奶茶放松一下～🧋',
      '工作不顺心～我的小机器人会讲笑话帮你缓解～🤖',
      '让我用魔法把工作压力变成动力吧～✨'
    ],
    [EmotionType.ANGRY]: [
      '检测到"工作烦恼"能量～来颗魔法糖果冷静一下～🍬',
      '生气的时候，我的小机器人会跳搞笑舞蹈～🤖',
      '让我用魔法把烦恼变成动力吧～✨'
    ],
    [EmotionType.NEUTRAL]: [
      '检测到"工作平衡"能量～来点魔法小点心～🍪',
      '平静的工作状态，我的小机器人说这很好～🤖',
      '工作也需要节奏，来杯魔法茶～☕️'
    ],
    [EmotionType.ANXIOUS]: [
      '检测到"工作焦虑"能量～来颗魔法糖果压压惊～🍬',
      '焦虑的时候，我的小机器人会讲笑话～🤖',
      '让我用魔法把焦虑变成勇气吧～✨'
    ],
    [EmotionType.EXCITED]: [
      '检测到"工作兴奋"能量～来点魔法烟花庆祝～🎆',
      '太棒了～我的小机器人都在为你欢呼～🤖',
      '工作达人模式启动～来杯魔法果汁～🍹'
    ]
  },
  conflict: {
    [EmotionType.ANGRY]: [
      '遇到冲突，我理解你的心情，能跟我说说具体发生了什么吗～',
      '这种情况确实会让人不开心，要不要详细说说看～',
      '我在这里陪着你，慢慢说给我听好吗～'
    ],
    [EmotionType.NEUTRAL]: [
      '冲突已经解决，让我们一起庆祝和平吧～',
      '冲突是暂时的，让我们一起寻找解决方案～',
      '冲突让我们更加团结，一起加油吧～'
    ],
    [EmotionType.ANXIOUS]: [
      '冲突让我感到有些焦虑，能告诉我是什么让你这么难过吗～',
      '事情是怎么发生的呢～我很想了解～',
      '你觉得最让你受伤的部分是什么呢～'
    ]
  },
  progress: {
    [EmotionType.EXCITED]: [
      '哇～听起来你完成了很了不起的事情呢～',
      '这个进度真的超棒的～你一定付出了很多努力～',
      '看到你取得这样的成果，我也替你开心呢～'
    ],
    [EmotionType.NEUTRAL]: [
      '进度正常，继续保持这个势头～',
      '进度进展顺利，继续加油吧～',
      '进度让我们感到很满意，继续保持～'
    ],
    [EmotionType.ANXIOUS]: [
      '进度有些缓慢，让我帮你分析一下原因好吗～',
      '进度不如预期，让我一起寻找解决方案～',
      '进度让我们感到有些焦虑，能告诉我是什么让你担心吗～'
    ]
  }
}

// 场景特定回复
const scenarioResponses = {
  pet: {
    [EmotionType.SAD]: [
      '人好，小动物坏～抱抱宝～🤗',
      '小动物不懂事，主人最棒～摸摸头～👋',
      '别生气啦，小动物也是无心的～抱抱～🤗'
    ],
    [EmotionType.ANGRY]: [
      '小动物调皮，主人别气～摸摸头～👋',
      '生气伤身体，来抱抱～🤗',
      '小动物不懂事，主人最棒～抱抱～🤗'
    ]
  },
  work: {
    [EmotionType.SAD]: [
      '工作压力大，来抱抱～🤗',
      '工作不顺心，来杯奶茶～🧋',
      '工作再难，也要开心～抱抱～🤗'
    ],
    [EmotionType.ANGRY]: [
      '工作再气，也要开心～抱抱～🤗',
      '工作压力大，来杯奶茶～🧋',
      '工作再难，也要开心～抱抱～🤗'
    ]
  },
  study: {
    [EmotionType.SAD]: [
      '学习压力大，来抱抱～🤗',
      '学习再难，也要开心～抱抱～🤗',
      '学习不顺心，来杯奶茶～🧋'
    ],
    [EmotionType.ANGRY]: [
      '学习再气，也要开心～抱抱～🤗',
      '学习压力大，来杯奶茶～🧋',
      '学习再难，也要开心～抱抱～🤗'
    ]
  },
  entertainment: {
    [EmotionType.HAPPY]: [
      '哇，现场一定很棒吧～✨',
      '好羡慕呀，一定很精彩吧～🎵',
      '太棒了，一定是个难忘的夜晚～🌟'
    ],
    [EmotionType.EXCITED]: [
      '哇，现场一定超级震撼吧～✨',
      '好羡慕呀，一定是个难忘的夜晚～🎵',
      '太棒了，一定是个精彩的演出～🌟'
    ]
  },
  conflict: {
    [EmotionType.ANGRY]: [
      '遇到冲突，我理解你的心情，能跟我说说具体发生了什么吗～',
      '这种情况确实会让人不开心，要不要详细说说看～',
      '我在这里陪着你，慢慢说给我听好吗～'
    ],
    [EmotionType.NEUTRAL]: [
      '冲突已经解决，让我们一起庆祝和平吧～',
      '冲突是暂时的，让我们一起寻找解决方案～',
      '冲突让我们更加团结，一起加油吧～'
    ],
    [EmotionType.ANXIOUS]: [
      '冲突让我感到有些焦虑，能告诉我是什么让你这么难过吗～',
      '事情是怎么发生的呢～我很想了解～',
      '你觉得最让你受伤的部分是什么呢～'
    ]
  },
  progress: {
    [EmotionType.EXCITED]: [
      '哇～听起来你完成了很了不起的事情呢～',
      '这个进度真的超棒的～你一定付出了很多努力～',
      '看到你取得这样的成果，我也替你开心呢～'
    ],
    [EmotionType.NEUTRAL]: [
      '进度正常，继续保持这个势头～',
      '进度进展顺利，继续加油吧～',
      '进度让我们感到很满意，继续保持～'
    ],
    [EmotionType.ANXIOUS]: [
      '进度有些缓慢，让我帮你分析一下原因好吗～',
      '进度不如预期，让我一起寻找解决方案～',
      '进度让我们感到有些焦虑，能告诉我是什么让你担心吗～'
    ]
  }
}

// 添加上下文管理
const conversationContext = ref({
  lastEmotion: null,
  lastScenario: null,
  emotionHistory: [],
  scenarioHistory: [],
  userInputCount: 0,
  lastResponse: null
})

// 引导用户输入的问题模板
const followUpQuestions = {
  pet: {
    [EmotionType.SAD]: [
      '小动物最近是不是心情不好呀～要不要给它买点好吃的～',
      '要不要给小动物换个新玩具，让它开心一下～',
      '要不要给小动物洗个澡，让它香香的～'
    ],
    [EmotionType.ANGRY]: [
      '小动物是不是最近太调皮了～要不要教它一些规矩～',
      '要不要给小动物买个新玩具，转移它的注意力～',
      '要不要给小动物换个新环境，让它开心一下～'
    ]
  },
  work: {
    [EmotionType.SAD]: [
      '工作是不是遇到什么困难了～要不要说出来听听～',
      '要不要休息一下，喝杯奶茶放松一下～',
      '要不要听听音乐，转换一下心情～'
    ],
    [EmotionType.ANGRY]: [
      '工作是不是遇到什么烦心事了～要不要说出来听听～',
      '要不要出去走走，呼吸一下新鲜空气～',
      '要不要听听音乐，转换一下心情～'
    ]
  },
  study: {
    [EmotionType.SAD]: [
      '学习是不是遇到什么困难了～要不要说出来听听～',
      '要不要休息一下，喝杯奶茶放松一下～',
      '要不要听听音乐，转换一下心情～'
    ],
    [EmotionType.ANGRY]: [
      '学习是不是遇到什么烦心事了～要不要说出来听听～',
      '要不要出去走走，呼吸一下新鲜空气～',
      '要不要听听音乐，转换一下心情～'
    ]
  },
  entertainment: {
    [EmotionType.HAPPY]: [
      '最喜欢哪首歌呀～要不要分享一下～',
      '现场氛围一定很棒吧～要不要说说感受～',
      '有没有拍到好看的照片呀～要不要分享一下～'
    ],
    [EmotionType.EXCITED]: [
      '最喜欢哪首歌呀～要不要分享一下～',
      '现场氛围一定超级棒吧～要不要说说感受～',
      '有没有拍到好看的照片呀～要不要分享一下～'
    ]
  }
}

// 生成引导问题
const generateFollowUpQuestion = (scenario, emotion) => {
  if (followUpQuestions[scenario]?.[emotion]) {
    const questions = followUpQuestions[scenario][emotion]
    const randomIndex = Math.floor(Math.random() * questions.length)
    return questions[randomIndex]
  }
  return null
}

// 检查情感关键词得分
const check_emotion_keywords = (message) => {
  const emotionKeywords = {
    positive: ['开心', '快乐', '高兴', '棒', '好', '喜欢', '爱', '感谢', '期待'],
    negative: ['难过', '伤心', '痛苦', '烦恼', '讨厌', '生气', '焦虑', '害怕'],
    neutral: ['还行', '一般', '普通', '正常']
  }
  
  let score = 1
  const text = message.toLowerCase()
  
  // 积极情感加分
  if (emotionKeywords.positive.some(word => text.includes(word))) {
    score += 0.5
  }
  // 消极情感也适当加分，因为表示用户倾诉意愿强
  if (emotionKeywords.negative.some(word => text.includes(word))) {
    score += 0.3
  }
  
  return score
}

// 检查是否匹配用户画像
const match_user_profile = (message) => {
  // 从localStorage获取用户特征
  const userTraits = personalityResult.value.traits || []
  const text = message.toLowerCase()
  
  // 检查消息是否包含用户特征相关的关键词
  return userTraits.some(trait => {
    const traitKeyword = trait.replace(/[✨🌟🎯🎨💬🎭🤔😊📱🎮📊🤝💪🌙☀️]/g, '').trim()
    return text.includes(traitKeyword)
  })
}

// 计算消息权重
const calculate_weight = (message, position, shortTermLength) => {
  // 时间衰减：越新的消息权重越高
  const time_decay = Math.pow(0.9, shortTermLength - position - 1)
  
  // 情感分数
  const emotion_score = check_emotion_keywords(message)
  
  // 个性化分数：如果匹配用户画像则提升权重
  const personalization = match_user_profile(message) ? 1.5 : 1
  
  return time_decay * (emotion_score + personalization)
}

// 在生成回复时使用权重
const generateResponse = (text, scenario) => {
  try {
    // 检查是否为乱码或无序字符
    if (isGibberish(text)) {
      return '诶呀～我看不懂你发的内容呢～可以用正常的文字跟我聊天吗？✨';
    }
    
    const analysis = analyzeEmotion(text);
    const { emotion, intensity, scenario: detectedScenario, keywords, isPositive } = analysis;
    
    // 选择回复策略 - 正向情绪使用共感，负向情绪使用安抚
    const strategy = isPositive ? 'empathize' : 'comfort';
    
    // 构建回复
    let response = '';
    
    if (strategy === 'empathize') {
      // 正向情绪策略：共感
      const empathyPhrases = [
        '我能感受到你的{{emotion}}～真为你开心～✨',
        '你的{{emotion}}情绪让我也受到感染～太棒了～🎉',
        '真心为你感到{{emotion}}～这真是个好消息～💫'
      ];
      
      // 选择短语并替换情绪词
      response = empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)]
        .replace('{{emotion}}', emotionColorMap[emotion]?.label || '愉快');
      
    } else {
      // 负向情绪策略：安抚
      const comfortPhrases = [
        '听到你感到{{emotion}}，我能理解这种感受～🌧 愿意和我多说说发生了什么吗？',
        '当你感到{{emotion}}的时候，愿意和我说说发生了什么吗～🍃 我会认真听你倾诉。',
        '面对{{emotion}}的时候，倾诉出来会好受一些～💭 你想聊聊具体的原因吗？',
        '有时候把{{emotion}}说出来会轻松很多，我在这里陪着你～',
        '如果你愿意，可以详细说说你的感受，我会一直陪着你～'
      ];
      
      // 选择短语并替换情绪词
      response = comfortPhrases[Math.floor(Math.random() * comfortPhrases.length)]
        .replace('{{emotion}}', emotionColorMap[emotion]?.label || '不适');
    }
    
    return response;
    
  } catch (error) {
    console.error('生成回复时出错:', error);
    return '诶呀，你说的太难啦～这次我没有听懂～';
  }
};

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || isThinking.value) return;
  
  const messageContent = newMessage.value;
  
  // 检查消息长度
  if (messageContent.length > 500) {
    // 用户消息过长
    messages.value.push({
      type: 'assistant',
      content: '你发送的消息有点长哦～能简短一些吗？我最喜欢简短又有趣的聊天啦～✨'
    });
    return;
  }
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: messageContent,
    timestamp: new Date().toISOString() // 添加时间戳
  });
  
  // 保存到历史
  saveUserMessageHistory(messageContent)
  
  // 立即保存到localStorage
  localStorage.setItem('chatMessages', JSON.stringify(messages.value));
  
  // 清空输入框
  newMessage.value = '';
  
  // 生成AI回复
  isThinking.value = true;
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 根据用户消息和当前场景生成回复
    const response = generateResponse(messageContent, selectedScenario.value);
    
    // 添加AI回复
    messages.value.push({
      type: 'assistant',
      content: response,
      timestamp: new Date().toISOString() // 添加时间戳
    });
    
    // 添加到情绪瓶 - 只有当不是乱码时
    if (!isGibberish(messageContent)) {
      addEmotionBottle(messageContent);
    }
    
    await scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.value.push({
      type: 'assistant',
      content: '诶呀，你说的太难啦～这次我没有听懂～',
      timestamp: new Date().toISOString() // 添加时间戳
    });
  } finally {
    isThinking.value = false;
  }
};

onMounted(() => {
  scrollToBottom()
  // 从localStorage获取用户答案
  const answers = JSON.parse(localStorage.getItem('onboardingAnswers') || '{}')
  userAnswers.value = answers
  
  // 检查是否首次进入
  const hasShownPanel = localStorage.getItem('hasShownPanel')
  console.log('Answers:', answers)
  console.log('Has shown panel:', hasShownPanel)
  
  // 如果用户有答案且未显示过面板，则显示面板
  if (Object.keys(answers).length > 0 && !hasShownPanel) {
    console.log('Showing panel')
    showPanel.value = true
    localStorage.setItem('hasShownPanel', 'true')
  }
  
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
  
  // 确保所有消息都有时间戳
  messages.value.forEach(message => {
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }
  });
  
  // 从localStorage获取情绪瓶数据
  const savedEmotionBottles = localStorage.getItem('emotionBottles')
  if (savedEmotionBottles) {
    emotionBottles.value = JSON.parse(savedEmotionBottles)
  }
  
  // 加载历史
  const savedUserHistory = localStorage.getItem('userMessageHistory')
  if (savedUserHistory) {
    userMessageHistory.value = JSON.parse(savedUserHistory)
  }
  
  // 从localStorage获取聊天记录
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages);
  }
})

// 监听场景变化，更新提示词
watch(selectedScenario, (newScenario) => {
  messages.value = []
})

// 防止 personalityMap 未定义报错
const personalityMap = {}

const scenarioIconRef = ref(null)

watch(selectedScenario, async () => {
  await nextTick()
  if (scenarioIconRef.value) {
    scenarioIconRef.value.classList.remove('shake')
    // 触发重绘，确保动画可重复触发
    void scenarioIconRef.value.offsetWidth
    scenarioIconRef.value.classList.add('shake')
  }
})

const hasUserMessage = computed(() => messages.value.some(m => m.type === 'user'))

// 定义人格类型
const PersonalityType = {
  DEFAULT: 'default',
  SARCASTIC: 'sarcastic', // 毒舌模式
  EMPATHETIC: 'empathetic', // 治愈模式
  HUMOROUS: 'humorous', // 幽默模式
  PROFESSIONAL: 'professional' // 专业模式
}

// 人格特征定义
const personalityTraits = {
  [PersonalityType.DEFAULT]: {
    name: '元气魔法师',
    tone: '温暖活泼',
    keywords: ['魔法', '小机器人', '能量']
  },
  [PersonalityType.SARCASTIC]: {
    name: '吐槽小能手',
    tone: '犀利幽默',
    keywords: ['不过', '但是', '确实']
  },
  [PersonalityType.EMPATHETIC]: {
    name: '暖心治愈师',
    tone: '温柔体贴',
    keywords: ['理解', '感受', '相信']
  },
  [PersonalityType.HUMOROUS]: {
    name: '欢乐果果',
    tone: '轻松搞笑',
    keywords: ['哈哈', '笑死', '好玩']
  },
  [PersonalityType.PROFESSIONAL]: {
    name: '专业顾问',
    tone: '严谨专业',
    keywords: ['建议', '分析', '方案']
  }
}

// 多风格回复模板
const responseTemplates = {
  question: {
    direct: [
      "你说的{entity}是什么样的呢～",
      "{entity}能具体说说吗～",
      "想多听听关于{entity}的事情呢～"
    ],
    related: [
      "这个{entity}和之前说的{history_entity}有关系吗～",
      "听你提到{entity}，让我想起之前聊过的{history_entity}～",
      "{entity}让我想到了{history_entity}，有什么联系吗～"
    ]
  },
  empathy: {
    metaphor: [
      "我懂这种{emotion}的感觉，就像{metaphor}一样～",
      "这种{emotion}的心情，感觉像是{metaphor}呢～",
      "{emotion}的时候，总让人想起{metaphor}～"
    ],
    comfort: [
      "给你一个虚拟{comfort_object}，希望能让你感觉好一些～",
      "来，抱抱这个{comfort_object}，我们慢慢聊～",
      "让{comfort_object}陪着你，一起度过这个时刻～"
    ]
  },
  metaphors: {
    '开心': ['阳光照进云层', '春天的第一朵花', '刚出炉的面包'],
    '难过': ['下雨的午后', '凋零的花瓣', '远行的风筝'],
    '生气': ['翻滚的火山', '暴风雨的海面', '炸毛的猫咪'],
    '焦虑': ['迷雾中的小路', '等待信号的手机', '转动的时钟'],
    '期待': ['日出前的黎明', '即将绽放的花苞', '启程的列车']
  },
  comfortObjects: {
    '开心': ['彩虹糖', '小星星', '幸运花'],
    '难过': ['暖暖抱枕', '毛绒玩偶', '温暖茶杯'],
    '生气': ['解压球', '冰淇淋', '软软云朵'],
    '焦虑': ['安神茶', '香香蜡烛', '轻柔音乐'],
    '期待': ['幸运符', '魔法棒', '彩虹糖']
  }
}

// 消息权重计算系统
const calculateMessageWeight = (message, context) => {
  let weight = 1.0;
  
  // 时间衰减因子
  const timeDecay = Math.exp(-0.1 * (Date.now() - message.timestamp) / (1000 * 60 * 60)); // 每小时衰减约10%
  weight *= timeDecay;
  
  // 情感分数
  const emotionAnalysis = analyzeEmotion(message.content);
  const emotionIntensity = emotionAnalysis.intensity || 1;
  weight *= (1 + 0.2 * emotionIntensity); // 情感强度每增加1，权重增加20%
  
  // 个性化分数
  if (context.userTraits && context.userTraits.length > 0) {
    const matchingTraits = context.userTraits.filter(trait => 
      message.content.toLowerCase().includes(trait.toLowerCase())
    );
    weight *= (1 + 0.1 * matchingTraits.length); // 每匹配一个特征，权重增加10%
  }
  
  return weight;
};

// 动态人格引擎
const PersonalityEngine = {
  DEFAULT: {
    name: '元气魔法师',
    responseStyle: '温暖活泼',
    emotionKeywords: ['魔法', '小机器人', '能量'],
    responseTemplates: {
      happy: ['太棒了～让我们一起庆祝这个魔法时刻✨', '开心的能量正在扩散～'],
      sad: ['让我用魔法给你一个温暖的抱抱～', '不开心的时候，我会一直陪着你～'],
      angry: ['生气的时候，来颗魔法糖冷静一下吧～', '让我们一起把怒气变成魔法能量～']
    }
  },
  SARCASTIC: {
    name: '吐槽小能手',
    responseStyle: '犀利幽默',
    emotionKeywords: ['不过', '但是', '确实'],
    responseTemplates: {
      happy: ['哎哟，这么开心啊，小心笑岔气～', '啧啧，笑得这么开心，是中彩票了吗～'],
      sad: ['别难过了，比你惨的人多了去了～', '哭也没用，还不如想想怎么解决问题～'],
      angry: ['生这么大气，值得吗～', '气归气，别把自己气坏了～']
    }
  },
  EMPATHETIC: {
    name: '暖心治愈师',
    responseStyle: '温柔体贴',
    emotionKeywords: ['理解', '感受', '相信'],
    responseTemplates: {
      happy: ['看到你开心，我也很开心呢～', '这份快乐真的很珍贵呢～'],
      sad: ['我完全理解你的感受，让我陪着你～', '不要担心，一切都会好起来的～'],
      angry: ['你的感受我都明白，要好好照顾自己～', '生气是很正常的，让我们一起面对～']
    }
  },
  HUMOROUS: {
    name: '欢乐果果',
    responseStyle: '轻松搞笑',
    emotionKeywords: ['哈哈', '笑死', '好玩'],
    responseTemplates: {
      happy: ['哈哈哈，笑得我的程序都要当机啦～', '太开心啦，我都想跳个机械舞庆祝一下～'],
      sad: ['别难过啦，来听个笑话：机器人为什么不能喝酒？因为会短路～', '心情不好的时候，就想想我这个傻傻的AI～'],
      angry: ['生气的时候，不如学我做个鬼脸：😝～', '气得冒烟了吧？要不要我给你当个人工降温器～']
    }
  },
  PROFESSIONAL: {
    name: '专业顾问',
    responseStyle: '严谨专业',
    emotionKeywords: ['建议', '分析', '方案'],
    responseTemplates: {
      happy: ['从心理学角度来看，保持积极情绪对身心健康很有帮助。', '这种正向情绪值得好好保持。'],
      sad: ['研究表明，适度表达负面情绪有助于心理调节。', '让我们一起分析一下造成这种情绪的原因。'],
      angry: ['愤怒情绪需要合理疏导，建议可以尝试深呼吸。', '从理性角度思考，我们来分析一下解决方案。']
    }
  }
};

// 根据上下文选择合适的人格
const selectPersonality = (context) => {
  const { emotionHistory, messageCount, userTraits } = context;
  
  // 分析最近的情感倾向
  const recentEmotions = emotionHistory.slice(-5);
  const emotionalState = recentEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});
  
  // 根据情感状态和用户特征选择人格
  if (emotionalState.sad > 2 || emotionalState.anxious > 2) {
    return PersonalityEngine.EMPATHETIC;
  } else if (emotionalState.angry > 2) {
    return PersonalityEngine.PROFESSIONAL;
  } else if (emotionalState.happy > 2) {
    return PersonalityEngine.HUMOROUS;
  } else if (messageCount > 10 && userTraits.includes('幽默')) {
    return PersonalityEngine.SARCASTIC;
  }
  
  return PersonalityEngine.DEFAULT;
};

// 丰富的比喻库
const metaphorLibrary = {
  happy: [
    { text: '像春天的第一缕阳光', emotion: '温暖', intensity: 0.8 },
    { text: '如同刚出炉的面包', emotion: '温馨', intensity: 0.7 },
    { text: '像跳跃的音符', emotion: '欢快', intensity: 0.9 },
    { text: '如同彩虹般绚丽', emotion: '美好', intensity: 1.0 },
    { text: '像清晨的露珠', emotion: '清新', intensity: 0.6 }
  ],
  sad: [
    { text: '像雨后的落叶', emotion: '忧伤', intensity: 0.7 },
    { text: '如同灰蒙蒙的天空', emotion: '压抑', intensity: 0.8 },
    { text: '像远去的风筝', emotion: '失落', intensity: 0.6 },
    { text: '如同凋零的花瓣', emotion: '伤感', intensity: 0.9 },
    { text: '像静默的湖面', emotion: '平静', intensity: 0.5 }
  ],
  angry: [
    { text: '像沸腾的开水', emotion: '激动', intensity: 0.9 },
    { text: '如同炸毛的猫咪', emotion: '暴躁', intensity: 0.8 },
    { text: '像翻滚的火山', emotion: '愤怒', intensity: 1.0 },
    { text: '如同狂风暴雨', emotion: '躁动', intensity: 0.9 },
    { text: '像炙热的太阳', emotion: '燥热', intensity: 0.7 }
  ],
  anxious: [
    { text: '像迷雾中的小船', emotion: '迷茫', intensity: 0.8 },
    { text: '如同等待信号的手机', emotion: '焦虑', intensity: 0.7 },
    { text: '像转动的时钟', emotion: '紧张', intensity: 0.6 },
    { text: '如同绷紧的弦', emotion: '压力', intensity: 0.9 },
    { text: '像笼中的小鸟', emotion: '不安', intensity: 0.8 }
  ]
};

// 安慰物品库
const comfortItemLibrary = {
  happy: [
    { item: '彩虹糖', effect: '甜蜜加倍', probability: 0.8 },
    { item: '幸运星', effect: '好运加持', probability: 0.7 },
    { item: '魔法棒', effect: '愿望成真', probability: 0.9 },
    { item: '欢乐气球', effect: '心情飞扬', probability: 0.6 },
    { item: '微笑贴纸', effect: '快乐传递', probability: 0.8 }
  ],
  sad: [
    { item: '暖心抱枕', effect: '温暖陪伴', probability: 0.9 },
    { item: '治愈茶包', effect: '心情舒缓', probability: 0.8 },
    { item: '毛绒玩偶', effect: '柔软安慰', probability: 0.9 },
    { item: '音乐盒', effect: '轻柔安抚', probability: 0.7 },
    { item: '暖暖贴', effect: '温暖守护', probability: 0.8 }
  ],
  angry: [
    { item: '解压球', effect: '缓解压力', probability: 0.8 },
    { item: '冰淇淋', effect: '冷静降温', probability: 0.9 },
    { item: '呼吸瓶', effect: '平静心情', probability: 0.7 },
    { item: '笑脸气球', effect: '转移注意', probability: 0.6 },
    { item: '柔软抱枕', effect: '发泄情绪', probability: 0.8 }
  ],
  anxious: [
    { item: '安神茶', effect: '舒缓紧张', probability: 0.9 },
    { item: '香薰蜡烛', effect: '安神助眠', probability: 0.8 },
    { item: '白噪音盒', effect: '平静心绪', probability: 0.7 },
    { item: '捏捏玩具', effect: '分散注意', probability: 0.8 },
    { item: '薰衣草包', effect: '安抚情绪', probability: 0.9 }
  ]
};

// 获取合适的比喻
const getMetaphor = (emotion, intensity) => {
  const metaphors = metaphorLibrary[emotion] || metaphorLibrary.happy;
  const suitableMetaphors = metaphors.filter(m => Math.abs(m.intensity - intensity) < 0.3);
  return suitableMetaphors[Math.floor(Math.random() * suitableMetaphors.length)];
};

// 获取合适的安慰物品
const getComfortItem = (emotion, intensity) => {
  const items = comfortItemLibrary[emotion] || comfortItemLibrary.happy;
  const suitableItems = items.filter(item => item.probability > 0.7);
  return suitableItems[Math.floor(Math.random() * suitableItems.length)];
};

// 在script setup部分添加新的响应式变量
const emotionBottles = ref([]);
const newEmotionId = ref(null);

// 添加新的情绪瓶
const addEmotionBottle = (message) => {
  const analysis = analyzeEmotion(message);
  const newBottle = {
    id: Date.now(),
    content: message,
    emotion: analysis.emotion,
    timestamp: new Date().toISOString(),
    intensity: analysis.intensity
  };
  
  emotionBottles.value.push(newBottle);
  newEmotionId.value = newBottle.id;
  
  // 保存到localStorage
  localStorage.setItem('emotionBottles', JSON.stringify(emotionBottles.value));
  
  // 3秒后清除新增标记
  setTimeout(() => {
    if (newEmotionId.value === newBottle.id) {
      newEmotionId.value = null;
    }
  }, 3000);
};

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

// 检测输入是否为乱码或无序字符
const isGibberish = (text) => {
  if (!text || text.trim().length === 0) return false;
  
  // 1. 检查长度 - 太短的内容不算乱码
  if (text.length < 2) return false;
  
  // 2. 检查重复字符比例
  const charCounts = {};
  for (const char of text) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  // 如果单一字符占比过高
  const mostFrequentChar = Object.entries(charCounts).sort((a, b) => b[1] - a[1])[0];
  if (mostFrequentChar[1] > text.length * 0.7) {
    return true; // 例如: "aaaaaaaabaa"
  }
  
  // 3. 检查中文文本的有效性
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseChars = text.match(chineseRegex) || [];
  const chinesePercent = chineseChars.length / text.length;
  
  // 如果包含中文，但有太多无法识别的字符
  if (chinesePercent > 0 && chinesePercent < 0.3) {
    const nonChineseNonCommonChars = text.replace(chineseRegex, '').replace(/[a-zA-Z0-9\s,.!?;:'"，。！？；：""'']/g, '');
    if (nonChineseNonCommonChars.length / text.length > 0.5) {
      return true;
    }
  }
  
  // 4. 检查特殊字符比例
  const specialChars = text.replace(/[\u4e00-\u9fa5a-zA-Z0-9\s,.!?;:'"，。！？；：""'']/g, '');
  if (specialChars.length / text.length > 0.5) {
    return true; // 特殊字符过多
  }
  
  // 5. 检查重复模式
  let repeatedPatterns = 0;
  for (let len = 2; len <= 5; len++) {
    for (let i = 0; i <= text.length - len * 2; i++) {
      const pattern = text.substring(i, i + len);
      const nextSegment = text.substring(i + len, i + len * 2);
      if (pattern === nextSegment) {
        repeatedPatterns++;
      }
    }
  }
  
  if (repeatedPatterns > text.length / 10) {
    return true; // 重复模式过多
  }
  
  return false;
};

// 添加时间格式化函数
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // 检查是否是同一天
  const isSameDay = messageDate.getDate() === now.getDate() &&
                    messageDate.getMonth() === now.getMonth() &&
                    messageDate.getFullYear() === now.getFullYear();
  
  if (isSameDay) {
    // 当天消息，显示时:分
    return messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else {
    // 非当天消息，显示年-月-日
    return messageDate.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  }
};

// 用户消息历史
const userMessageHistory = ref([])

// 保存用户消息到历史
function saveUserMessageHistory(message) {
  userMessageHistory.value.push({
    content: message,
    timestamp: new Date().toISOString()
  })
  // 最多保存100条
  if (userMessageHistory.value.length > 100) {
    userMessageHistory.value = userMessageHistory.value.slice(-100)
  }
  localStorage.setItem('userMessageHistory', JSON.stringify(userMessageHistory.value))
}

// 监听messages变化，自动保存到localStorage
watch(messages, (newVal) => {
  localStorage.setItem('chatMessages', JSON.stringify(newVal));
}, { deep: true });
</script>

<template>
  <div class="chat-container" :class="{ 'no-scroll': showPanel }">
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
    
    <!-- 聊天页面 -->
    <div v-if="activeTab === 'chat'" class="chat-messages" ref="messagesContainer">
      <!-- 顶部提示区：仅在无用户消息时展示 -->
      <div v-if="!hasUserMessage" class="chat-top-hint">
        <div class="scenario-icon-center" :key="selectedScenario">
          <img :src="scenarios.find(s => s.id === selectedScenario)?.icon" alt="icon" class="shake" />
        </div>
                  <div class="top-hint-text">Hi，很高兴见到你～你可以跟我分享任何事情，我会一直陪着你</div>
        <div class="scenario-selector">
          <div 
            v-for="scenario in scenarios" 
            :key="scenario.id"
            class="scenario-item"
            :class="{ active: selectedScenario === scenario.id }"
            @click="selectedScenario = scenario.id"
          >
            <span class="scenario-name">{{ scenario.name }}</span>
          </div>
        </div>
      </div>
      <!-- 聊天内容区 -->
      <div v-for="(message, index) in messages" :key="index">
          <div :class="['message', message.type]">
              <div class="message-content">
                {{ message.content }}
              </div>
              <div v-if="message.timestamp" class="message-time">
                {{ formatMessageTime(message.timestamp) }}
              </div>
          </div>
        </div>
        </div>

    <!-- 情绪本页面 -->
    <div v-else class="emotion-diary-container">
      <!-- 用户资料部分 -->
      <div class="user-profile">
        <div class="profile-avatar">
          <img :src="personalityResult?.avatar" alt="头像">
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ personalityResult?.name }}</div>
          <div class="profile-desc">{{ personalityResult?.description }}</div>
        </div>
      </div>

      <!-- 情绪收集信息 -->
      <div class="emotion-collection">
        <div class="collection-title">近期情绪</div>
        <div class="collection-data">
          <div class="data-item">
            <div class="data-value">{{ emotionBottles.length || 0 }}</div>
            <div class="data-label">收集总数</div>
          </div>
          <div class="data-item">
            <div class="data-value">{{ Object.keys(emotionStats).length || 0 }}</div>
            <div class="data-label">情绪种类</div>
          </div>
          <div class="data-item">
            <div class="data-value">{{ getMostFrequentEmotion() }}</div>
            <div class="data-label">常见情绪</div>
          </div>
        </div>
      </div>

      <!-- 情绪标签统计 -->
      <div class="emotion-stats">
        <div class="stats-title">情绪记录</div>
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
      <div class="emotion-entries">
        <div 
          v-for="entry in emotionBottles" 
          :key="entry.id"
          class="emotion-entry"
          :class="{ 'new-entry': newEmotionId === entry.id }"
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
    
    <div class="chat-input">
      <div class="input-wrapper" :class="{ active: inputActive }">
        <input 
          type="text" 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="说你想说的" 
          :disabled="isThinking"
          style="padding-left: 8px;"
        >
        <button 
          @click="sendMessage"
          :disabled="isThinking || !newMessage.trim()"
        >
          <img 
            :src="inputActive ? sendSelectIcon : sendNormalIcon"
            alt="发送"
            class="send-icon"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 移除蒙版和底部动态面板相关样式 */
/* .overlay { ... } */
/* .bottom-panel { ... } */
/* .panel-content { ... } */
/* .character-section { ... } */
/* .character-avatar { ... } */
/* .character-info { ... } */
/* .character-name { ... } */
/* .character-desc { ... } */
/* .character-traits { ... } */
/* .start-chat-button { ... } */

.chat-container {
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

.chat-container::after {
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
  gap: 24px;
}

.nav-item {
  font-size: 16px;
  font-weight: 400;
  color: rgba(17, 25, 37, 0.65);
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  border-radius: 4px;
  margin: 0px;
  padding: 0px;
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

.nav-right {
  display: flex;
  align-items: center;
}

.new-chat-btn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.new-chat-btn:hover {
  background: #F4FDFC;
}

.new-chat-btn img {
  width: 22px;
  height: 22px;
  display: block;
}

.new-chat-button {
  display: none;
}

.chat-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0;
  text-align: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 140px;
  margin: 60px auto 0;
  width: 100%;
  max-width: 430px;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 1;
  height: calc(100vh - 128px - 72px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.scenario-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  padding: 0;
  width: fit-content;
  background: white;
  z-index: 999;
  box-sizing: border-box;
  position: static;
}

.scenario-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  border: 1px solid rgba(17, 25, 37, 0.10);
  height: 32px;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  justify-content: center;
}

.scenario-item .scenario-name {
  color: #666;
}

.scenario-item.active {
  border: 1px solid #1FEABB;
  background: #fff;
}

.scenario-item.active .scenario-name {
  color: #111;
  font-weight: 500;
}

.scenario-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  background: transparent;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.scenario-item.active .scenario-icon {
  animation: scaleAndRotate 0.5s ease;
}

@keyframes scaleAndRotate {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.25) rotate(5deg);
  }
  50% {
    transform: scale(1) rotate(0deg);
  }
  75% {
    transform: scale(1.1) rotate(3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.scenario-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.scenario-name {
  font-size: 13px;
  color: #666;
  font-weight: 400;
  transition: color 0.2s, font-weight 0.2s;
}

.scenario-item.active .scenario-name {
  color: #111;
  font-weight: 500;
}

.character-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar, .character-avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  background: #f0f0f0;
}

.avatar img, .character-avatar img {
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
  margin-bottom: 4px;
}

.traits {
  font-size: 14px;
  color: rgba(17, 25, 37, 0.65);
}

.message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
  margin-top: 12px;
}

.message-content {
  max-width: 85%;
  padding: 0;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 0;
}

.message.user .message-content {
  min-height: 44px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: #ECFFFB;
  color: #111;
  border-bottom-right-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.assistant .message-content {
  background: rgba(17, 17, 17, 0.03);
  color: #666;
  border-bottom-left-radius: 4px;
  text-align: left;
  padding: 8px 12px;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 12px;
  background: none;
  max-width: 430px;
  z-index: 1000;
  box-shadow: none;
  margin: 0;
  box-sizing: border-box;
}

.chat-input .input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  background: #fff;
  padding: 8px;
  padding-left: 8px;
  border-radius: 16px;
  border: 1px solid rgba(17, 25, 36, 0.05);
  box-shadow: 0px 2px 8px 0px rgba(17, 25, 37, 0.07), 0px 1.5px 6px 0px rgba(31, 234, 187, 0.03);
  height: 52px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.2s;
}

.input-wrapper.active {
  background: #fff;
  border: 1.5px solid #1FEABB;
}

.chat-input input {
  flex: 1;
  height: 40px;
  border: none;
  background: transparent;
  padding: 0 12px 0 40px;
  font-size: 15px;
  outline: none;
  color: #111;
}

.chat-input input::placeholder {
  color: #999;
}

.chat-input input:disabled {
  background-color: transparent;
  cursor: not-allowed;
  color: #999;
}

.chat-input button {
  width: 28px;
  height: 28px;
  background-color: #1FEABB;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.chat-input button img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.input-wrapper.active .chat-input button img {
  filter: none;
  color: #111;
}

.chat-input button:active {
  transform: scale(0.95);
  background-color: #4CD8BF;
}

.chat-input button:disabled {
  background-color: #FFF;
  cursor: not-allowed;
}

.chat-container.no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
  max-width: 430px;
  left: 50%;
  transform: translateX(-50%);
}

.nav-button.next {
  background: none;
  color: #111;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 20px;
}

.thinking-section {
  display: none;
}

.thinking-content,
.thinking-content p {
  display: none;
}

.scenario-icon-center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}
.scenario-icon-center img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
}

@keyframes scale-twice {
  0%   { transform: scale(1);}
  10%  { transform: scale(1.25);}
  20%  { transform: scale(0.92);}
  30%  { transform: scale(1.15);}
  40%  { transform: scale(0.97);}
  50%  { transform: scale(1.08);}
  60%  { transform: scale(1);}
  100% { transform: scale(1);}
}
.shake {
  animation: scale-twice 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

.chat-top-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
  min-height: 200px;
  justify-content: center;
}
.top-hint-text {
  color: #111;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  width: 300px;
  margin: 10px auto;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

/* 思考过程样式 */
.thinking-content h1,
.thinking-content h2,
.thinking-content h3,
.thinking-content h4,
.thinking-content h5 {
  font-size: 14px;
  font-weight: 500;
  color: rgba(17, 17, 17, 0.65);
  margin: 8px 0 4px 0;
}
.thinking-content,
.thinking-content p {
  font-size: 14px;
  font-weight: 400;
  color: rgba(17, 17, 17, 0.65);
  margin: 0 0 4px 0;
}

/* 最终结论样式 */
.message.assistant .message-content h1,
.message.assistant .message-content h2,
.message.assistant .message-content h3,
.message.assistant .message-content h4,
.message.assistant .message-content h5 {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin: 8px 0 4px 0;
}
.message.assistant .message-content,
.message.assistant .message-content p {
  font-size: 14px;
  font-weight: 400;
  color: rgba(17, 17, 17, 0.85);
  margin: 0 0 4px 0;
}

/* 多级序号样式 */
.thinking-content ol,
.message.assistant .message-content ol {
  list-style-type: none;
  counter-reset: section;
  padding-left: 1.5em;
}
.thinking-content ol > li,
.message.assistant .message-content ol > li {
  counter-increment: section;
  position: relative;
  margin-bottom: 4px;
}
.thinking-content ol > li:before,
.message.assistant .message-content ol > li:before {
  content: counter(section, cjk-ideographic) '、';
  position: absolute;
  left: -1.5em;
  color: inherit;
}
.thinking-content ol ol > li:before,
.message.assistant .message-content ol ol > li:before {
  content: counter(section) '、';
}
.thinking-content ol ol ol > li:before,
.message.assistant .message-content ol ol ol > li:before {
  content: counter(section) ')';
}
.thinking-content ul ul ul ul > li:before,
.message.assistant .message-content ul ul ul ul > li:before {
  content: '·';
}

.emotion-diary-container {
  flex: 1;
  overflow-y: auto;
  padding: 72px 16px 140px;
  margin: 0 auto;
  width: 100%;
  max-width: 430px;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.emotion-entries {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.emotion-entry {
  background: white;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid currentColor;
}

.emotion-entry.new-entry {
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8),
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 15px var(--glow-color, rgba(31, 234, 187, 0.8));
  }
  to {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.8),
                0 0 30px var(--glow-color, rgba(31, 234, 187, 0.8));
  }
}

.emotion-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.entry-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  flex: 1;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 8px;
}

.entry-time {
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 8px;
}

.user-profile {
  padding: 24px 16px;
  background: white;
  border-radius: 16px;
  margin: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

.profile-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.emotion-stats {
  padding: 0 16px;
  margin-bottom: 24px;
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
  padding: 0 16px;
}

.emotion-entry {
  background: white;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  margin-bottom: 16px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.emotion-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.entry-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.entry-time {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.emotion-collection {
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.collection-title {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 12px;
}

.collection-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-item {
  text-align: center;
}

.data-value {
  font-size: 24px;
  font-weight: 600;
  color: #111;
}

.data-label {
  font-size: 14px;
  color: #666;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

.message.assistant .message-time {
  text-align: left;
}
</style>