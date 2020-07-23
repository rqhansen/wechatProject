import { timeStampToString } from '../../utils/formatDate.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { orderNo } = options;
    const res = await this.getOrderDetail(orderNo);
  },

  async getOrderDetail(orderNo) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const res = await wx.cloud.callFunction({
        name: 'queryOrderDetail',
        data: { orderNo }
      })
      wx.hideLoading();
      if (!res) {
        wx.showLoading({
          title: '获取订单详情失败，请稍后重试',
          mask: true
        });
        return;
      }
      const { result: { list: data } } = res;
      let order = data [0];
      order.createTime = timeStampToString(order.createTime);
      this.setData({
        orderDetail: order
      });
      if (order.orderStatus === 0 && !order.orderExpired) { //未过期
        const diffTime = order.expireTime - new Date().getTime();
        this.setCountTime(diffTime, order);
      }
  },

  // 计算倒计时
  setCountTime(diffTime, order) {
    let h = Math.floor(diffTime / (60 * 60 * 1000));
    h = h >= 10 ? h : `0${h}`;
    let m = Math.floor((diffTime % (60 * 60 * 1000)) / (60 * 1000));
    m = m >= 10 ? m : `0${m}`;
    let s = Math.floor(((diffTime % (60 * 60 * 1000)) % (60 * 1000)) / (1000));
    s = s >= 10 ? s : `0${s}`;
    order.timerArr = [h, m, s];
    this.setData({
      orderDetail: order
    });
    diffTime -= 1000;
    if (diffTime < 0) {
      clearTimeout(this.countTimer);
      return;
    }
    this.countTimer = setTimeout(() => {
      this.setCountTime(diffTime, order);
    },1000)
  },

  // 支付
  async pay(e) {
    const { payment } = e.currentTarget.dataset.order;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const res = await app.requestPayment({
      timeStamp: payment.timeStamp,
      nonceStr: payment.nonceStr,
      package: payment.package,
      signType: payment.signType,
      paySign: payment.paySign
    });
    wx.hideLoading();
    if (res === 0) {
      wx.reLaunch({
        url: '/pages/order/order'
      });
      return;
    }
    if (res === 2) {
      wx.showToast({
        title: '支付失败，请稍后重试',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  
  onUnload() {
    clearTimeout(this.countTimer);
  }
})