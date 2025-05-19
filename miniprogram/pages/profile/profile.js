const app = getApp()

Page({
  data: {
    userInfo: {},
    genderOptions: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '保密', value: 'secret' }
    ],
    mbtiOptions: [
      { label: 'INTJ', value: 'INTJ' },
      { label: 'INTP', value: 'INTP' },
      { label: 'ENTJ', value: 'ENTJ' },
      { label: 'ENTP', value: 'ENTP' },
      { label: 'INFJ', value: 'INFJ' },
      { label: 'INFP', value: 'INFP' },
      { label: 'ENFJ', value: 'ENFJ' },
      { label: 'ENFP', value: 'ENFP' },
      { label: 'ISTJ', value: 'ISTJ' },
      { label: 'ISFJ', value: 'ISFJ' },
      { label: 'ESTJ', value: 'ESTJ' },
      { label: 'ESFJ', value: 'ESFJ' },
      { label: 'ISTP', value: 'ISTP' },
      { label: 'ISFP', value: 'ISFP' },
      { label: 'ESTP', value: 'ESTP' },
      { label: 'ESFP', value: 'ESFP' }
    ]
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  onGenderChange(e) {
    const gender = e.detail.value
    const userInfo = { ...this.data.userInfo, gender }
    this.setData({ userInfo })
    wx.setStorageSync('userInfo', userInfo)
    
    // 检查是否已选择MBTI，如果已选择则跳转到会话页面
    if (userInfo.mbti) {
      this.navigateToChat()
    }
  },

  onMbtiChange(e) {
    const mbti = e.detail.value
    const userInfo = { ...this.data.userInfo, mbti }
    this.setData({ userInfo })
    wx.setStorageSync('userInfo', userInfo)
    
    // 检查是否已选择性别，如果已选择则跳转到会话页面
    if (userInfo.gender) {
      this.navigateToChat()
    }
  },
  
  // 新增跳转到会话页面的方法
  navigateToChat() {
    // 默认选择第一个角色进行对话
    const defaultCharacterId = 1
    wx.switchTab({
      url: '/pages/chat/chat',
      success: () => {
        // 使用全局事件通信，通知聊天页面加载指定角色
        const eventChannel = getApp().globalData.eventChannel
        if (eventChannel) {
          eventChannel.emit('selectCharacter', { characterId: defaultCharacterId })
        }
      }
    })
  },

  navigateToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },

  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          this.setData({
            userInfo: {}
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
}) 