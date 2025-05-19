Page({
  data: {
    currentStep: 1,
    avatarUrl: '',
    nickname: '',
    age: '',
    gender: '',
    mbti: '',
    mbtiOptions: [
      { value: 'INTJ', label: 'INTJ' },
      { value: 'INTP', label: 'INTP' },
      { value: 'ENTJ', label: 'ENTJ' },
      { value: 'ENTP', label: 'ENTP' },
      { value: 'INFJ', label: 'INFJ' },
      { value: 'INFP', label: 'INFP' },
      { value: 'ENFJ', label: 'ENFJ' },
      { value: 'ENFP', label: 'ENFP' },
      { value: 'ISTJ', label: 'ISTJ' },
      { value: 'ISFJ', label: 'ISFJ' },
      { value: 'ESTJ', label: 'ESTJ' },
      { value: 'ESFJ', label: 'ESFJ' },
      { value: 'ISTP', label: 'ISTP' },
      { value: 'ISFP', label: 'ISFP' },
      { value: 'ESTP', label: 'ESTP' },
      { value: 'ESFP', label: 'ESFP' }
    ],
    traits: [
      { value: 'creative', label: '创意', selected: false },
      { value: 'friendly', label: '友善', selected: false },
      { value: 'confident', label: '自信', selected: false },
      { value: 'calm', label: '冷静', selected: false },
      { value: 'energetic', label: '活力', selected: false },
      { value: 'thoughtful', label: '深思', selected: false },
      { value: 'organized', label: '有条理', selected: false },
      { value: 'adventurous', label: '冒险', selected: false },
      { value: 'sensitive', label: '敏感', selected: false },
      { value: 'independent', label: '独立', selected: false }
    ]
  },

  onLoad: function() {
    // 检查是否已经创建过角色
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      // 自动生成一个随机昵称
      this.generateRandomNickname();
    }
  },

  // 上一步
  prevStep: function() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  // 下一步
  nextStep: function() {
    if (this.data.currentStep < 3) {
      // 验证当前步骤
      if (!this.validateCurrentStep()) {
        return;
      }
      this.setData({
        currentStep: this.data.currentStep + 1
      });
    }
  },

  // 验证当前步骤
  validateCurrentStep: function() {
    const { currentStep, gender, nickname, age, avatarUrl } = this.data;
    
    if (currentStep === 1 && !gender) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return false;
    }
    
    if (currentStep === 2) {
      if (!avatarUrl) {
        wx.showToast({
          title: '请上传头像',
          icon: 'none'
        });
        return false;
      }
      if (!nickname) {
        wx.showToast({
          title: '请输入昵称',
          icon: 'none'
        });
        return false;
      }
      if (!age) {
        wx.showToast({
          title: '请输入年龄',
          icon: 'none'
        });
        return false;
      }
      if (age < 18 || age > 100) {
        wx.showToast({
          title: '请输入有效年龄',
          icon: 'none'
        });
        return false;
      }
    }
    
    return true;
  },

  // 选择头像
  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 显示上传中提示
        wx.showLoading({
          title: '上传中...',
          mask: true
        });
        
        // 上传图片到服务器
        wx.uploadFile({
          url: 'http://localhost:3000/api/upload/avatar', // 开发环境使用本地服务器
          filePath: tempFilePath,
          name: 'avatar',
          success: (uploadRes) => {
            wx.hideLoading();
            
            try {
              const data = JSON.parse(uploadRes.data);
              if (data.success) {
                this.setData({
                  avatarUrl: data.url
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: data.error || '上传失败',
                  icon: 'none'
                });
              }
            } catch (e) {
              wx.showToast({
                title: '解析响应失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            wx.hideLoading();
            console.error('上传失败:', err);
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  // 输入昵称
  onNicknameInput: function(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  // 输入年龄
  onAgeInput: function(e) {
    this.setData({
      age: e.detail.value
    });
  },

  // 生成随机昵称
  generateRandomNickname: function() {
    const adjectives = ['快乐的', '聪明的', '可爱的', '温柔的', '活泼的', '优雅的', '神秘的', '独特的', '温暖的', '勇敢的'];
    const nouns = ['小猫', '小狗', '小兔', '小鸟', '小鹿', '小狐狸', '小熊猫', '小企鹅', '小海豚', '小松鼠'];
    const randomNum = Math.floor(Math.random() * 1000);
    const nickname = adjectives[Math.floor(Math.random() * adjectives.length)] +
                    nouns[Math.floor(Math.random() * nouns.length)] +
                    randomNum;
    this.setData({ nickname });
  },

  // 选择性别
  onGenderSelect: function(e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    });
  },

  // 选择MBTI
  onMbtiSelect: function(e) {
    this.setData({
      mbti: e.currentTarget.dataset.mbti
    });
  },

  // 切换个人特质
  toggleTrait: function(e) {
    const index = e.currentTarget.dataset.index;
    const traits = this.data.traits;
    traits[index].selected = !traits[index].selected;
    this.setData({ traits });
  },

  // 提交表单
  handleSubmit: function() {
    const { nickname, age, gender, mbti, traits } = this.data;
    
    // 表单验证
    if (!gender) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return;
    }
    if (!nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }
    if (!age) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none'
      });
      return;
    }
    if (!mbti) {
      wx.showToast({
        title: '请选择MBTI性格',
        icon: 'none'
      });
      return;
    }

    // 获取选中的特质
    const selectedTraits = traits.filter(trait => trait.selected).map(trait => trait.value);

    // 保存用户信息
    const userInfo = {
      nickname,
      age,
      gender,
      mbti,
      traits: selectedTraits
    };

    wx.setStorageSync('userInfo', userInfo);

    // 跳转到首页
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}); 