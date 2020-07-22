// miniprogram/pages/index/index.js
import { storeLocation } from '../../configs/store_info.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    storePics: []
  },
  hasClick: false,

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
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
    const data = res.result.data.map(item => item.url);
    this.setData({
      storePics: data
    });
  },

  // 打开地图
  openMap() {
    if (this.hasClick) {
      return;
    }
    this.hasClick = true;
    wx.openLocation({
      latitude : storeLocation.latitude,
	    longitude : storeLocation.longitude, 
      scale: 16,
      name: '金记胡辣汤',
      address: '新城路北段路西',
      complete: ()=>{
        this.hasClick = false;
      }
    });
  },

  // 打电话
  callPhone() {
    if (this.hasClick) {
      return;
    }
    this.hasClick = true;
    wx.makePhoneCall({
      phoneNumber: '18939600055',
      complete: ()=>{
        this.hasClick = false;
      }
    });
  },

  // 去订单页面
  orderFood() {
    wx.navigateTo({
      url: '/pages/menu/menu'
    });
  },

  preViewImg(e) {
    if (this.hasClick) {
      return;
    }
    this.hasClick = true;
    const currIndex = e.currentTarget.dataset.index;
    const currImage = this.data.storePics[currIndex];
    wx.previewImage({
      current: currImage,
      urls: this.data.storePics,
      fail: (error)=>{
        console.log(error);
      },
      complete: ()=>{
        this.hasClick = false;
      }
    });
  }
})