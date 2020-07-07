// miniprogram/pages/userauth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断小程序的API,回调，参数，组件等是否在当前版本可用
    canIuse: wx.canIUse('button.open-type.getUserInfo')
  },

  async getUserInfo(e) {
    const { detail: { userInfo } } = e;
    if (!userInfo) {
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return;
    }
    // 注册用户
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    const openid = await getApp().getOpenid();
    const { result } = await wx.cloud.callFunction({
      name: "register",
      data: {
        openid,
        userInfo
      }
    });
    wx.hideLoading();
    if (!result) {
      wx.showToast({
        title: '登录失败，请重新登录',
      })
      return;
    }
    wx.setStorageSync('userInfo', userInfo);
    if (result) {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})