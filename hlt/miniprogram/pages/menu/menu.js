
import showLoading from '../../utils/showLoading.js';
import throttle from '../../utils/throttle.js';

Page({
  data: {
    menuList: [],
    currIndex: 0,
    searchVal: '',
    boundHeights: [],
    scrollTop: 0,
    choiceProduct: {
      oldTotalMoney: 0,
      totalMoney: 0,
      totalCount: 0,
      productList: []
    },
    showPopup: false
  },
  scrollFromSwitchMenu: false,
  throttleScrollFn: '',
  openW: false,
  canSwitchPopup: true,
  newOpenPage: true,
  onLoad() {
    // 获取菜单列表
    const res = this._hasStorageData();
    if (!res) {
     this._getMenus();
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    this.setData({
      menuList: res
    },() => {
      wx.hideLoading();
    });
  },
  async onReady(){
    this._initAnimation();
    this._getBoundHeight();
  },

  // 判断是否缓存了菜品菜单
  _hasStorageData() {
    const menuData = wx.getStorageSync('menuData');
    if (!menuData) return false;
    const { menuList, startTime } = menuData;
    const diffMillisecond = Date.now() - startTime;
    if (diffMillisecond > 7 * 24 * 60 * 60 * 1000 ) {
      return false;
    }
    return menuList;
  },

  // 增加菜品
  plusDish(e) {
    let { dish, menuIndex, dishIndex} = e.currentTarget.dataset;
    dish.orderCount = ( dish.orderCount || 0 ) + 1;
    dish.orderMoney = dish.orderCount * dish.price;
    dish.dishIndex = dishIndex;
    dish.menuIndex = menuIndex;
    this._updateDishList({menuIndex, dishIndex, dish});
    const updatedOrderList = this._updateDishOrder(dish, 1);
    this.handleAddProAnimation();
    this.setData({
      choiceProduct: updatedOrderList
    })
  },

  // 减少菜品
  minusDish(e) {
    let { dish, menuIndex, dishIndex} = e.currentTarget.dataset;
    dish.orderCount = ( dish.orderCount || 0 ) - 1;
    dish.orderMoney = dish.orderCount * dish.price;
    dish.dishIndex = dishIndex;
    dish.menuIndex = menuIndex;
    this._updateDishList({menuIndex, dishIndex, dish});
    const updatedOrderList = this._updateDishOrder(dish, -1);
    const hasDish = updatedOrderList.productList.length;
    if (!hasDish) {
      this.clearAll();
    }
    this.handleAddProAnimation();
    this.setData({
      choiceProduct: updatedOrderList
    })
  },

  // 更新菜品列表
  _updateDishList({menuIndex, dishIndex, dish}) {
    let menuList = this.data.menuList;
    menuList[menuIndex].menuList[dishIndex] = dish;
    this.setData({
      menuList: menuList
    });
  },

  // 更新菜品订单
  _updateDishOrder(updatedDish, computeChar) {
    let choiceProduct = this.data.choiceProduct;
    choiceProduct.totalCount = choiceProduct.totalCount + computeChar;
    if (!choiceProduct.totalCount) {
      return { oldTotalMoney: 0, totalMoney: 0, totalCount: 0, productList: [] };
    }
    let updatedDishIndex = choiceProduct.productList.findIndex(item => item._id === updatedDish._id);
    if (updatedDishIndex === -1) {
      choiceProduct.productList.push(updatedDish);
      choiceProduct.totalMoney += updatedDish.price * 1;
      choiceProduct.oldTotalMoney += updatedDish.old_price * 1;
    } else {
      if (!updatedDish.orderCount) { 
        choiceProduct.productList.splice(updatedDishIndex,1);
      } else {
        choiceProduct.productList[updatedDishIndex] = updatedDish;
      }
      choiceProduct.totalMoney = choiceProduct.totalMoney + updatedDish.price * 1 * computeChar;
      choiceProduct.oldTotalMoney = choiceProduct.oldTotalMoney + updatedDish.old_price * 1 * computeChar;
    }
    return choiceProduct;
  },

  // 清空
  async clearAll() {
    if (!this.canSwitchPopup) return;
    let that = this;
    this.canSwitchPopup = false;
    const res = await _promiseSetData({ choiceProduct: { oldTotalMoney: 0, totalMoney: 0, totalCount: 0, productList: []}});
    await Promise.all([this._hidePop(),this._hideProductList()]);
    await _promiseSetData({ showPopup: false });
    this.canSwitchPopup = true;
    let menuList = this.data.menuList;
    menuList.forEach(item => {
      item.menuList.forEach(menu => {
      if (menu.orderCount) {
        delete menu.orderCount;
        delete menu.orderMoney;
        delete menu.oldOrderMoney;
        delete menu.dishIndex;
        delete menu.menuIndex;
      }
      })
    })
    await _promiseSetData({ menuList });
    function _promiseSetData(obj = {}) {
      return new Promise(resolve => {
        that.setData(obj, () => {
          resolve();
        })
      })
    }
  },

  _getBoundHeight() {
    let query = wx.createSelectorQuery();
    let boundHeights = [];
    query.selectAll('.menu-detail-item').boundingClientRect(res =>{
      res.forEach((item,idx) => {
        let height = item.height;
        if (idx > 0) {
          height = boundHeights[idx-1] + height;
        }
        boundHeights.push(height);
      })
      this.setData({
        boundHeights
      })
    }).exec();
  },
  
  touchstart() {
    this.scrollFromSwitchMenu = false;
  },

  // 监听滚动
  scrollMenu(e) {
    if (this.scrollFromSwitchMenu) return;
    let { scrollTop } = e.detail;
    let boundHeights = this.data.boundHeights;

    if (!this.throttleScrollFn) {
      this.throttleScrollFn = throttle(_handleScrollFn.bind(this),20);
    }

    this.throttleScrollFn(scrollTop);

    function _handleScrollFn() {
      let findIndex = 0;
      for (let i = boundHeights.length; i >= 0 ; i--) {
        let scrollTop = arguments[0][0];
        if (scrollTop > boundHeights[i]) {
          findIndex = i + 1;
          break;
        }
      }
      this.setData({
        currIndex: findIndex
      });
    };
  },

    // 切换菜单
  switchMenu(e) {
    const { switchindex } = e.currentTarget.dataset;
    if (this.data.currIndex === switchindex) return;
    this.setData({
      currIndex : switchindex
    });
    this.scrollFromSwitchMenu = true;

    let scrollToTop = this.data.boundHeights[switchindex - 1];
    this.setData({
      scrollTop: scrollToTop || 0,
      currIndex : switchindex
    });
  },

  // 获取菜单列表
  async _getMenus() {
    showLoading();
    const res = await wx.cloud.callFunction({name: 'getMenuList'});
    wx.hideLoading();
    if (!res) {
      return;
    }
    const list = res.result.list;
    this.setData({
      menuList: list
    });
    // 将数据存储到本地，7周后重新获取数据
    const storagedData = {
      menuList: list,
      startTime: `${Date.now()}`,
    };
    wx.setStorageSync('menuData',storagedData);
  },

  // 添加菜品动画
  handleAddProAnimation() {
    this.clearAnimation('.shopping-car-body',() => {
      _startproductAnimation.bind(this)();
    });
    function _startproductAnimation() {
      this.animate('.shopping-car-body',[
        { scale: [1,1]},
        { scale: [.7, .7]},
        { scale: [1,1]},
      ], 100, () => {
        this.clearAnimation('.shopping-car-body');
      })
    }
  },

  // 切换popup
  async switchPopup() {
    if (!this.canSwitchPopup) return;
    if (!this.data.choiceProduct.productList.length) {
      return;
    }
    this.canSwitchPopup = false;
    if (!this.data.showPopup) { // 显示
      this.setData({
        showPopup: true
      },async () => {
        await Promise.all([this._showPop(),this._showProductList()]);
        this.canSwitchPopup = true;
      });
      return;
    }
    // 隐藏popup
    await Promise.all([this._hidePop(),this._hideProductList()]);
    this.setData({
      showPopup: false
      }, () => {
      this.canSwitchPopup = true;
    });
  },

  _showPop() {
    return new Promise(resolve => {
      this.animate('.added-product-popup-wrap',[
        { opacity: 0 },
        { opacity: 1 }
      ],100, () => {
        resolve();
      })
    }) 
  },

  _showProductList() {
    return new Promise(resolve => {
      this.animate('.popup-product-list-wrap',[
        { translate3d: [0,'100%',0] },
        { translate3d: [0,0,0]}
      ], 100, () => {
        resolve();
      });
    })
  },

  _hidePop() {
    return new Promise(resolve => {
      this.animate('.added-product-popup-wrap',[
        { opacity: 1 },
        { opacity: 0 }
      ],100,() => {
        this.clearAnimation('.added-product-popup-wrap',() => {
          resolve();
        });
      })
    })
  },

  _hideProductList() {
    return new Promise(resolve =>{
      this.animate('.popup-product-list-wrap',[
        { translate3d: [0,0,0] },
        { translate3d: [0,'100%',0]}
      ],100,() =>{
        this.clearAnimation('.popup-product-list-wrap',() => {
          resolve();
        });
      })
    })
  },

  //跑马灯动画
  async _initAnimation() {
    const query = wx.createSelectorQuery();
    query.select('#marqueContent').boundingClientRect(res => {
      this.offsetLeft = parseInt(res.width);
      if (!this.offsetLeft) {
        return;
      }
      this.duration = parseInt(this.offsetLeft / 0.045);
      this._startAnimation();
    }).exec();
  },

  // 开始跑马灯动画
  _startAnimation() {
    this.animate('#marqueContent',[
      { ease: 'linear', translate3d:[100,0,0] },
      { ease: 'linear', translate3d:[-this.offsetLeft-50,0,0] }
    ], this.duration, () => {
        _proceedMarque.bind(this)();
     })

    function _proceedMarque() {
      this.animate('#marqueContent',[
        { ease: 'linear', translate3d:[this.offsetLeft+50,0,0] },
        { ease: 'linear', translate3d:[-this.offsetLeft-100,0,0] }
      ], this.duration * 2, () => {
          _proceedMarque.bind(this)();
      })
    }
  },

  previewImage(e) {
    if (this.openW) return;
    this.openW = true; 
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src],
      complete: ()=>{
        this.openW = false;
      }
    });
  },

  // 搜索
  search(e) {
    const val = e.detail.value;
    if (!val) return;
    const valArray = [...e.detail.value];
    let modeE = {
      currentTarget: {
        dataset: {
          switchindex: 0
        }
      }
    }
    outer:  for (let i = 0, valLength = valArray.length; i < valLength; i++) {
      for (let j = 0, len = this.data.menuList.length; j < len; j++) {
        if (this.data.menuList[j].title.includes(valArray[i])) {
          modeE.currentTarget.dataset.switchindex = j;
          break outer;
        }
      }
    }
    this.switchMenu(modeE);
  },

  // 选好了
  async choiceReady() {
    if (!this.data.choiceProduct.totalCount) {
      wx.showToast({
        title: '您还没选择菜品哦',
        icon: 'none',
        duration: 1000,
        mask: false,
      });
      return;
    }
    if (!this.canSwitchPopup) return;
    const strChoiceProduct = JSON.stringify(this.data.choiceProduct);
    wx.navigateTo({
      url: `/pages/confirmorder/confirmorder?dishList=${strChoiceProduct}`
    });
    if (!this.data.showPopup) return;
    await Promise.all([this._hidePop(),this._hideProductList()]);
    this.setData({
      showPopup: false
    }, () => {
      this.canSwitchPopup = true;
    })
  },

  onHide() {
    // console.log('hide');
    this.newOpenPage = false;
  },

  onUnload() {
    wx.removeStorageSync('choiceProduct');
  }
})