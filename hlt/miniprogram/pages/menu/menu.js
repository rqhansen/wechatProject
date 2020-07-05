
import showLoading from '../../utils/showLoading.js';
import throttle from '../../utils/throttle.js';
Page({
  data: {
    menuList: [],
    currIndex: 0,
    boundHeights: [],
    scrollTop: 0,
    choiceProduct: {
      productList: []
    },
    showPopup: false
  },
  scrollFromSwitchMenu: false,
  throttleScrollFn: '',
  openW: false,
  totalMenus: 0,
  canSwitchPopup: true,
  async onLoad() {
    // 获取菜单列表
    const res = this.hasStorageData();
    if (!res) {
      wx.showLoading()
      await this.getMenus();
      wx.hideLoading();
      return;
    }
    this.setData({
      menuList: res
    });

  },
  async onReady(){
    this.initAnimation();
    this.getBoundHeight();
  },

  // 判断是否缓存了菜品菜单
  hasStorageData() {
    const res = wx.getStorageSync('menuData');
    if (!res) return false;
    const { menuList, startTime } = JSON.parse(res);
    const diffMillisecond = Date.now() - startTime;
    if (diffMillisecond > 7 * 24 * 60 * 60 * 1000 ) {
      return false;
    }
    return menuList;
  },

  // 增加菜品
  plusDish(e) {
    this.updateDish(e, 'plusDish');
  },

  // 减少菜品
  minusDish(e) {
    this.updateDish(e, 'minusDish');
  },

  updateDish(e,flag) {
    this.handleAddProAnimation();
    let { dish, menuIndex, dishIndex} = e.currentTarget.dataset;
    let orderCount = dish.orderCount || 0;
    if (flag === 'plusDish') {
      orderCount++;
    } else if (flag === 'minusDish') {
      orderCount--;
    }
    // 更新单个菜品数目和金额
    dish.orderCount = orderCount;
    dish.orderMoney = orderCount * dish.price;
    dish.dishIndex = dishIndex;
    dish.menuIndex = menuIndex;
    this.data.menuList[menuIndex].menuList[dishIndex] = dish;
    this.setData({
      menuList: this.data.menuList
    });
    // 更新总菜品的订单数和总金额
    this.updateDishToOrder(dish,flag);
  },

  updateDishToOrder(dish,flag) {
    let choiceProduct = this.data.choiceProduct;
    choiceProduct.totalCount = choiceProduct.totalCount || 0;
    choiceProduct.totalMoney = choiceProduct.totalMoney || 0;
    if (flag === 'plusDish') {
      choiceProduct.totalCount++;
    } else if (flag === 'minusDish'){
      choiceProduct.totalCount--;
    }
    if (!choiceProduct.productList.length) { // 添加第一个菜品
      choiceProduct.totalMoney = dish.orderMoney;
      choiceProduct.productList.push(dish);
      this.setData({
        choiceProduct: choiceProduct
      });
      return;
    }

    for (let i = 0, len = this.data.choiceProduct.productList.length; i < len; i++) {
      let produce = this.data.choiceProduct.productList[i];
      if (produce._id === dish._id) {
        choiceProduct.productList[i] = dish;
        if (flag === 'plusDish') {
          choiceProduct.totalMoney += dish.price * 1;
        } else if (flag === 'minusDish') {
          choiceProduct.totalMoney -= dish.price * 1;
        }
        break;
      } 
      if (i === len - 1) {
        choiceProduct.productList.push(dish);
        choiceProduct.totalMoney += dish.price * 1;
      }
    }
    this.setData({
      choiceProduct: choiceProduct
    });
  },

  clearAll() {
    if (!this.canSwitchPopup) return;
    this.canSwitchPopup = false;
    this.setData({
      choiceProduct: {
        productList: []
      },
    },async () => {
      await Promise.all([this.hidePop(),this.hideProductList()]);
      this.setData({
        showPopup: false
      }, () => {
        this.canSwitchPopup = true;
        let menuList = this.data.menuList;
        menuList.forEach((item,idx) => {
          item.menuList.forEach((menu,menuIndex) => {
          if (menu.orderCount) {
            delete menu.orderCount;
            delete menu.orderMoney;
            menuList[idx].menuList[menuIndex] = menu;
          }
          })
        })
        this.setData({
          menuList
        });
      })
    });
  },

  getBoundHeight() {
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
      this.throttleScrollFn = throttle(handleScrollFn.bind(this),20);
    }

    this.throttleScrollFn(scrollTop);

    function handleScrollFn() {
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
  async getMenus() {
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
    wx.setStorageSync('menuData',JSON.stringify(storagedData));
    list.forEach(item => {
      this.totalMenus += item.menuList.length;
    })
  },

  // 添加菜品动画
  handleAddProAnimation() {
    this.clearAnimation('.shopping-car-body',() => {
      startproductAnimation.bind(this)();
    });
    function startproductAnimation() {
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
        await Promise.all([this.showPop(),this.showProductList()]);
        this.canSwitchPopup = true;
      });
      return;
    }
    // 隐藏popup
    await Promise.all([this.hidePop(),this.hideProductList()]);
    this.setData({
      showPopup: false
      }, () => {
      this.canSwitchPopup = true;
    });
  },

  showPop() {
    return new Promise(resolve => {
      this.animate('.added-product-popup-wrap',[
        { opacity: 0 },
        { opacity: 1 }
      ],100, () => {
        resolve();
      })
    }) 
  },

  showProductList() {
    return new Promise(resolve => {
      this.animate('.popup-product-list-wrap',[
        { translate3d: [0,'100%',0] },
        { translate3d: [0,0,0]}
      ], 100, () => {
        resolve();
      });
    })
  },

  hidePop() {
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

  hideProductList() {
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
  async initAnimation() {
    const query = wx.createSelectorQuery();
    query.select('#marqueContent').boundingClientRect(res => {
      this.offsetLeft = parseInt(res.width);
      if (!this.offsetLeft) {
        return;
      }
      this.duration = parseInt(this.offsetLeft / 0.045);
      this.startAnimation();
    }).exec();
  },

  // 开始跑马灯动画
  startAnimation() {
    this.animate('#marqueContent',[
      {
        ease: 'linear',
        translate3d:[100,0,0]
      },
      {
        ease: 'linear',
        translate3d:[-this.offsetLeft-50,0,0]
      },
    ], this.duration, () => {
      proceedMarque.bind(this)();
     })

    function proceedMarque() {
      this.animate('#marqueContent',[
        {
          ease: 'linear',
          translate3d:[this.offsetLeft+50,0,0]
        },
        {
          ease: 'linear',
          translate3d:[-this.offsetLeft-100,0,0]
        },
      ], this.duration * 2, () => {
          proceedMarque.bind(this)();
      }
      )
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

  search() {
    console.log('2');
  },

  onUnload() {
    console.log(1111);
  }
})