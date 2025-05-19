const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName: '',
      gender: 'secret',
      mbti: '',
      personalityTags: [],
      hobbyTags: []
    },
    genderOptions: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '保密', value: 'secret' }
    ],
    mbtiOptions: [
      { label: 'INTJ', value: 'INTJ', selected: false },
      { label: 'INTP', value: 'INTP', selected: false },
      { label: 'ENTJ', value: 'ENTJ', selected: false },
      { label: 'ENTP', value: 'ENTP', selected: false },
      { label: 'INFJ', value: 'INFJ', selected: false },
      { label: 'INFP', value: 'INFP', selected: false },
      { label: 'ENFJ', value: 'ENFJ', selected: false },
      { label: 'ENFP', value: 'ENFP', selected: false },
      { label: 'ISTJ', value: 'ISTJ', selected: false },
      { label: 'ISFJ', value: 'ISFJ', selected: false },
      { label: 'ESTJ', value: 'ESTJ', selected: false },
      { label: 'ESFJ', value: 'ESFJ', selected: false },
      { label: 'ISTP', value: 'ISTP', selected: false },
      { label: 'ISFP', value: 'ISFP', selected: false },
      { label: 'ESTP', value: 'ESTP', selected: false },
      { label: 'ESFP', value: 'ESFP', selected: false }
    ],
    personalityTags: [
      { label: '开朗', value: 'cheerful', selected: false },
      { label: '内向', value: 'introverted', selected: false },
      { label: '理性', value: 'rational', selected: false },
      { label: '感性', value: 'emotional', selected: false },
      { label: '独立', value: 'independent', selected: false },
      { label: '依赖', value: 'dependent', selected: false },
      { label: '乐观', value: 'optimistic', selected: false },
      { label: '谨慎', value: 'cautious', selected: false }
    ],
    hobbyTags: [
      { label: '阅读', value: 'reading', selected: false },
      { label: '音乐', value: 'music', selected: false },
      { label: '运动', value: 'sports', selected: false },
      { label: '旅行', value: 'travel', selected: false },
      { label: '美食', value: 'food', selected: false },
      { label: '电影', value: 'movies', selected: false },
      { label: '游戏', value: 'games', selected: false },
      { label: '摄影', value: 'photography', selected: false }
    ]
  },

  onLoad() {
    // 获取用户信息
    this.getUserProfile();
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.userInfo.avatarUrl,
          'userInfo.nickName': res.userInfo.nickName
        });
      },
      fail: () => {
        // 用户拒绝授权，使用默认值
        this.setData({
          'userInfo.avatarUrl': 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
          'userInfo.nickName': '用户' + Math.floor(Math.random() * 10000)
        });
      }
    });
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.tempFilePaths[0]
        });
      }
    });
  },

  // 输入昵称
  onNicknameInput(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    });
  },

  // 选择性别
  onGenderChange(e) {
    this.setData({
      'userInfo.gender': e.detail.value
    });
  },

  // 选择MBTI
  onMbtiSelect(e) {
    const value = e.currentTarget.dataset.value;
    const mbtiOptions = this.data.mbtiOptions.map(item => {
      return {
        ...item,
        selected: item.value === value
      };
    });
    
    this.setData({
      mbtiOptions,
      'userInfo.mbti': value
    });
  },

  // 选择个人特质
  onTagSelect(e) {
    const value = e.currentTarget.dataset.value;
    const personalityTags = this.data.personalityTags.map(item => {
      if (item.value === value) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    const selectedTags = personalityTags
      .filter(item => item.selected)
      .map(item => item.value);
    
    this.setData({
      personalityTags,
      'userInfo.personalityTags': selectedTags
    });
  },

  // 选择兴趣爱好
  onHobbySelect(e) {
    const value = e.currentTarget.dataset.value;
    const hobbyTags = this.data.hobbyTags.map(item => {
      if (item.value === value) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    const selectedTags = hobbyTags
      .filter(item => item.selected)
      .map(item => item.value);
    
    this.setData({
      hobbyTags,
      'userInfo.hobbyTags': selectedTags
    });
  },

  // 提交资料
  submitProfile() {
    const { userInfo } = this.data;
    
    // 验证必填项
    if (!userInfo.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 保存用户信息
    wx.setStorageSync('userInfo', userInfo);
    
    // 跳转到会话页面
    wx.switchTab({
      url: '/pages/chat/chat'
    });
  },

  selectCharacter(e) {
    const characterId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/chat/chat?id=${characterId}`
    })
  }
}) 