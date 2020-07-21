// miniprogram/pages/orderDetail.js
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
      data[0].createTime = this.timeStampToString(data[0].createTime);
      this.setData({
        orderDetail: data[0]
      })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  timeStampToString(timeStamp){
    const dt = new Date(timeStamp);
    const y = dt.getFullYear();

    let m = dt.getMonth();
    m = m >= 10 ? m : `0${m}`;

    let d = dt.getDate();
    d = d >= 10 ? d : `0${d}`;

    let h = dt.getHours();
    h = h >= 10 ? h : `0${h}`;

    let minute = dt.getMinutes();
    minute = minute >= 10 ? minute : `0${minute}`;

    let s = dt.getSeconds();
    s = s >= 10 ? s : `0${s}`;
    return `${y}-${m}-${d} ${h}:${minute}:${s}`;
  }
})