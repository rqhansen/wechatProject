const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = app.getUserInfo();
    // if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    // }
  },

  // 登录
  async getUserInfo(e) {
    const { detail: { userInfo } } = e;
    if (!userInfo) return;
    const openid = await app.getOpenid();
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    // 判断当前用户是否已注册
    const { result: { data } } = await wx.cloud.callFunction({ name: 'getUserInfo', data: { openid } });
    wx.hideLoading();
    if (!data.length) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          openid,
          userInfo
        }
      });
      wx.hideLoading();
      if (!result) {
        wx.showToast({
          title: '登录失败，请重新登录',
          icon: 'none',
          duration: 1000
        });
        return;
      }
    }
    this.setData({
      userInfo
    })
    app.storageUserInfo(userInfo);
  },

  goOrder() {
    const res = app.getUserInfo();
    if (!res) {
      wx.showToast({
        title: '登录后才能查看订单哦',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return;
    }
    wx.reLaunch({
      url: '/pages/order/order',
    });
  }
})