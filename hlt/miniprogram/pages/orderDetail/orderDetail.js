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
      const { result: { data } } = res;
      data[0].createTime = timeStampToString(data[0].createTime);
      this.setData({
        orderDetail: data[0]
      })
  },

  // 支付
  async pay(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const { payment } = e.currentTarget.dataset;
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
  }
})