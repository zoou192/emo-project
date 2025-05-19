App({
  globalData: {
    userInfo: null,
    characters: [
      {
        id: 1,
        name: '小明',
        avatar: '/images/avatar1.png',
        description: '活泼开朗的大学生'
      },
      {
        id: 2,
        name: '小红',
        avatar: '/images/avatar2.png',
        description: '温柔体贴的护士'
      }
    ],
    eventChannel: null
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化全局事件通道
    this.globalData.eventChannel = new wx.EventChannel()

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
}) 