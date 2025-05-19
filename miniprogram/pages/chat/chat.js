const app = getApp()

Page({
  data: {
    character: {},
    messages: [],
    inputValue: '',
    scrollToMessage: '',
    userInfo: {}
  },

  onLoad(options) {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
    
    // 如果有传入角色ID，则加载该角色
    if (options.id) {
      this.loadCharacter(parseInt(options.id))
    } else {
      // 默认加载第一个角色
      this.loadCharacter(1)
    }
    
    // 加载历史消息
    this.loadMessages()
  },
  
  onShow() {
    // 监听角色选择事件
    const eventChannel = app.globalData.eventChannel
    if (eventChannel) {
      eventChannel.on('selectCharacter', (data) => {
        this.loadCharacter(data.characterId)
      })
    }
  },
  
  loadCharacter(characterId) {
    // 从全局数据中获取角色信息
    const character = app.globalData.characters.find(c => c.id === characterId) || {
      id: 1,
      name: '小明',
      avatar: '/images/avatar1.png',
      description: '活泼开朗的大学生'
    }
    
    this.setData({ character })
  },

  loadMessages() {
    // 模拟加载消息
    const messages = [
      {
        id: 1,
        type: 'character',
        content: '你好！很高兴认识你！'
      }
    ]
    this.setData({ messages })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) return

    const messages = [...this.data.messages]
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: this.data.inputValue
    }
    messages.push(newMessage)

    this.setData({
      messages,
      inputValue: '',
      scrollToMessage: `msg-${newMessage.id}`
    })

    // 模拟角色回复
    setTimeout(() => {
      const characterReply = {
        id: messages.length + 1,
        type: 'character',
        content: '我明白了，让我想想...'
      }
      messages.push(characterReply)
      this.setData({
        messages,
        scrollToMessage: `msg-${characterReply.id}`
      })
    }, 1000)
  }
}) 