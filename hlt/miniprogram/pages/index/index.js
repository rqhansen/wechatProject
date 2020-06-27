// miniprogram/pages/index/index.js
import { storeLocation, bannerList, storePics } from '../../configs/store_info.js';

let hasClick = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    storePics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getBanners();
      this.getStorePics();
  },

  // 获取轮播图
  async getBanners() {
    const res = await wx.cloud.callFunction({name: 'getBanners'});
    if (!res) {
      wx.showToast({
        title: '获取数据失败，请稍后重试',
        icon: 'none',
        mask: false
      });
      return;
    }
    this.setData({
      bannerList: res.result
    })
  },

  // 获取门店照片
  async getStorePics() {
    const res  = await wx.cloud.callFunction({name: 'getStorePictures'});
    if (!res) {
      wx.showToast({
        title: '获取数据失败，请稍后重试',
        icon: 'none',
        duration: 1500,
        mask: false
      });
      return;
    }
    const data = res.result.data;
    this.setData({
      storePics: data
    });
  },

  // 打开地图
  openMap() {
    if (hasClick) {
      return;
    }
    hasClick = true;
    wx.openLocation({
      latitude : storeLocation.latitude,
	    longitude : storeLocation.longitude, 
      scale: 16,
      name: '金记胡辣汤',
      address: '新城路北段路西',
      complete: ()=>{
        hasClick = false;
      }
    });
  },

  // 打电话
  callPhone() {
    if (hasClick) {
      return;
    }
    hasClick = true;
    wx.makePhoneCall({
      phoneNumber: '18939600055',
      success: (result)=>{
        
      },
      complete: ()=>{
        hasClick = false;
      }
    });
  },

  // 去订单页面
  orderFood() {
    wx.navigateTo({
      url: '/pages/menu/menu',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  preViewImg(e) {
    if (hasClick) {
      return;
    }
    hasClick = true;
    const currIndex = e.currentTarget.dataset.index;
    const currImage = this.data.storePics[currIndex];
    wx.previewImage({
      current: currImage,
      urls: this.data.storePics,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{
        hasClick = false;
      }
    });
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