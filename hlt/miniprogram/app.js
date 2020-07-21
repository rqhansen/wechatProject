//app.js
import { openid_expired_added } from './configs/constant.js';
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    // 每次进到页面检查openid
    this.getOpenid();
  },

  globalData: {},

  async getOpenid() {
    const openid = this.globalData.openid || wx.getStorageSync('openid') || await this.getCloudOpenid();
    return openid;
  },

  async getCloudOpenid() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    const openid = (await wx.cloud.callFunction({name: 'getOpenid'})).result.OPENID;
    wx.hideLoading();
    this.globalData.openid = openid;
    wx.setStorageSync('openid', openid);
    return openid;
  },

  getUserInfo() {
    return this.globalData.userInfo || wx.getStorageSync('userInfo');
  },

  storageUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  // 支付
  requestPayment(payment) {
    return new Promise((resolve,reject) => {
      wx.requestPayment({
        timeStamp: payment.timeStamp,
        nonceStr: payment.nonceStr,
        package: payment.package,
        signType: payment.signType,
        paySign: payment.paySign,
        success: (result)=>{
          resolve(0);
        },
        fail: (msg)=>{
          if (msg.errMsg === 'requestPayment:fail cancel') {
            resolve(1);
          } else {
            resolve(2);
          }
        },
        complete: () => {}
      });
    })
  }
})
