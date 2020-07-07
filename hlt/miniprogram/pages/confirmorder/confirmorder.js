import { storeLocation } from '../../configs/store_info.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeLocation,
    markers: [
      {
        id: 1,
        latitude: storeLocation.latitude,
        longitude: storeLocation.longitude,
        name: '金记胡辣汤',
        width: 50,
        height: 50,
        label: {
          content: '金记胡辣汤',
          color: '#438CFF',
          fontSize: 18,
          anchorX: -10,
          anchorY: -55
        }
      }
    ],
    dishInfo: {}
  },

  hasClickToPay: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dishList = options.dishList;
    if (!dishList) return;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    this.setData({
      dishInfo: JSON.parse(dishList)
    },() => {
      wx.hideLoading();
    })
  },

  // 去支付
  async requestPay() {
    if (this.hasClickToPay) return; 
    this.hasClickToPay = true;
    if (!this.data.dishInfo.totalMoney) return;
    const userInfo = app.getUserInfo();
    if (!userInfo) {
      wx.showLoading({ title: '加载中...' })
      const openid = await getApp().getOpenid();
      // 判断当前用户是否注册
      const { result: { data } } = await wx.cloud.callFunction({ name: 'getUserInfo', data: { openid } });
      wx.hideLoading();
      // 用户不存在则跳到授权登录页面
      if (!data.length) {
        wx.navigateTo({ url: '/pages/userauth/userauth' });
        this.hasClickToPay = false;
        return;
      }
      const userInfo = data[0].userInfo;
      app.storageUserInfo(userInfo);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})