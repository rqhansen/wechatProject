import { envId, mchId } from '../../configs/constant.js';
import { storeLocation } from '../../configs/store_info.js';
import { random } from '../../utils/random.js';
import { uuid } from '../../utils/uuid.js';
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
    const totalMoney = this.data.dishInfo.totalMoney;
    const openid = await getApp().getOpenid();
    if (!totalMoney) return;
    const userInfo = app.getUserInfo();
    if (!userInfo) {
      wx.showLoading({ title: '加载中...' })
      // 判断当前用户是否注册
      const data = await this.isExistUser(openid);
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
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const outTradeNo = uuid(32,10);
    const totalFee = 1;
    // 调用微信的统一下单
    const result = await this.unifyOrder({ totalFee, outTradeNo });
    if (result.returnCode === 'FAIL') {
      wx.showToast({
        title: result.returnMsg,
        icon: 'none',
        duration: 1500,
        mask: true,
        complete: ()=>{
          this.hasClickToPay = false;
        }
      });
      return;
    }
    // 添加一个订单记录， 0表示未支付，1表示已支付
    const now = new Date().getTime();
    await this.addOrder({ 
      totalFee, 
      orderStatus: 0, 
      orderNo: outTradeNo, 
      foodList: this.data.dishInfo.productList,
      payment: result.payment
    });
    wx.hideLoading();
    const { nonceStr, package: payPackage, paySign, signType, timeStamp} = result.payment;
    const res = await app.requestPayment({
      timeStamp,
      nonceStr,
      package: payPackage,
      signType,
      paySign
    });
    this.hasClickToPay = false;
    if (res === 2) {
      wx.showToast({
        title: '支付异常，请稍后重试',
        icon: 'none',
        duration: 3000,
        mask: true,
      });
    }
    wx.reLaunch({
      url: '/pages/order/order',
    });
  },

  // 判断用户是否注册过
  async isExistUser(openid) {
    const { result: { data } } = await wx.cloud.callFunction({ name: 'getUserInfo', data: { openid } });
    return data;
  },

  // 下单
  async unifyOrder({ totalFee, outTradeNo }) {
    const { result } = await wx.cloud.callFunction({name: 'unifyOrder', data: {
      functionName: 'payCallBack',
      envId,
      subMchId: mchId, // 子商户id,仍填商户id
      nonceStr: random(32),
      body: '玉杰胡辣汤店-堂食付款',
      outTradeNo,
      tradeType: 'JSAPI',
      totalFee,
      spbillCreateIp: '127.0.0.1'
    }});
    return result;
  },

  // 添加订单
  async addOrder(orderInfo) {
    const res = await wx.cloud.callFunction({
      name: 'addOrder',
      data: orderInfo
    })
  }
})