const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currIndex: 0,
    tabs: [
      {
        title: '全部',
        id: 0
      },
      {
        title: '待付款',
        id: 1
      },
      {
        title: '已付款',
        id: 2
      },
      {
        title: '待评价',
        id: 3
      }
    ],
    currOrderList: [],
    scrollTop: 0
  },
  hasClickPay: false,
  orderLists: [],
  oldScrollTops: [],
  isSwitchTab: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const res = await this.getOrderRecored();
    this.orderLists[0] = res;
  },

  async onShow() {
    const isFromMenu = wx.getStorageSync('from');
    if (isFromMenu) {
      const res = await this.getOrderRecored();
      this.orderLists[0] = res;
      this.setData({
        currIndex: 0,
        scrollTop: 0
      })
      wx.removeStorageSync('from');
    }
  },
  // 获取订单记录
  async getOrderRecored(query) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const res  = await wx.cloud.callFunction({
      name: 'queryOrder',
      data: query
    });
    wx.hideLoading();
    if (!res) {
      wx.showToast({
        title: '数据加载失败，请稍后重试',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
    const { data } = res.result;
    this.setData({
      currOrderList: data
    });
    return data;
  },
  // 切换tab
  async switchTab(e) {
    const { tabindex } = e.currentTarget.dataset;
    if (tabindex === this.data.currIndex) return;
    if (tabindex === 3) {
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 500,
        mask: true,
      });
      return;
    }
    this.isSwitchTab = true;
    const cacheScrollTop = this.oldScrollTops[tabindex];
    let res = this.orderLists[tabindex];
    this.setData({
      currIndex: tabindex
    });
    if (!res) {
      res = await this.getOrderRecored({
        orderStatus: tabindex - 1
      });
      this.orderLists[tabindex] = res;
    }
    this.setData({
      currOrderList: res
    },() => {
      this.setData({
        scrollTop: cacheScrollTop || 0
      })
    });
  },

  // 去付款
  async toPay(e) {
    if (this.hasClickPay ) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    this.hasClickPay = true;
    const { payment: { timeStamp, nonceStr, package: payPackage, signType, paySign } } = e.currentTarget.dataset;
    const res = await app.requestPayment({
      timeStamp,
      nonceStr,
      package: payPackage,
      signType,
      paySign
    });
    wx.hideLoading();
    this.hasClickPay = false;
    if (res === 0) {
      wx.reLaunch({
        url: '/pages/order/order',
      });
    } else if (res === 2) {
      wx.showToast({
        title: '支付失败，请稍后重试',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
  },

  // 去订单详情
  goOrderDetail(e) {
    const { orderno } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderNo=${orderno}`,
    });
  },

  //监听滚动
  scroll(e) {
    if (this.isSwitchTab) {
      return;
    }
    const { scrollTop } = e.detail;
    this.oldScrollTops[this.data.currIndex] = scrollTop;
  },

  touchstart() {
    this.isSwitchTab = false;
  },

  // 再来一单
  orderAgain() {
    wx.navigateTo({
      url: '/pages/menu/menu',
    });
  },

  // 去首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})