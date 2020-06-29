
import showLoading from '../../utils/showLoading.js';
import throttle from '../../utils/throttle.js';
Page({
  data: {
    menuList: [],
    currIndex: 0,
    boundHeights: [],
    scrollTop: 0
  },
  scrollFromSwitchMenu: false,
  throttleScrollFn: '',
  openW: false,
  totalMenus: 0,
  imageLength: 0,
  async onLoad() {
    // 获取菜单列表
    const res = this.hasStorageData();
    if (!res) {
      await this.getMenus();
      return;
    }
    showLoading();
    this.setData({
      menuList: res
    });
  },
  async onReady(){
    // 执行跑马灯
    this.initAnimation();
    let query = wx.createSelectorQuery();
    query.selectAll('.menu-detail-item').boundingClientRect(res => {
      const eleHeights = res.map(ele => ele.height);
      let boundHeights = [];
      eleHeights.forEach((height,idx) => {
        let itemHeight = height;
        if (idx !== 0) {
          itemHeight = boundHeights[idx-1] + height;
        }
        boundHeights.push(parseInt(itemHeight));
      });
      this.setData({
        boundHeights
      });
    }).exec();
  },

  touchstart() {
    console.log(111);
    this.scrollFromSwitchMenu = false;
  },

  // 监听滚动
  scrollMenu(e) {
    if (this.scrollFromSwitchMenu) return;
    let that = this;
    let { scrollTop } = e.detail;
    let boundHeights = this.data.boundHeights;

    if (!this.throttleScrollFn) {
      this.throttleScrollFn = throttle(handleScrollFn,50);
    }

    this.throttleScrollFn(scrollTop);

    function handleScrollFn() {
      let findIndex = 0;
      for (let i = boundHeights.length; i >= 0 ; i--) {
        let scrollTop = arguments[0][0];
        if (boundHeights[i] < scrollTop) {
          findIndex = i + 1;
          break;
        }
      }
      that.setData({
        currIndex: findIndex
      });
    }
  },

    // 切换菜单
  switchMenu(e) {
    const { switchindex } = e.currentTarget.dataset;
    
    if (this.data.currIndex === switchindex) return;
    this.scrollFromSwitchMenu = true;

    let scrollToTop = this.data.boundHeights[switchindex - 1];
    this.setData({
      scrollTop: scrollToTop || 0,
      currIndex : switchindex
    });
  },

  loadImage(e) {
    this.imageLength++;
    if (this.imageLength === this.totalMenus) {
      wx.hideLoading();
    }
  },

  // 判断是否存在缓存数据
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

  // 获取菜单列表
  async getMenus() {
    showLoading();
    const res = await wx.cloud.callFunction({name: 'getMenuList'});
    console.log(res);
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

  // 浏览图片大图
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

  // 初始化动画
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

  // 执行动画
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
      this.proceedMarque();
     })
  },

  // 再次执行动画
  proceedMarque() {
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
        this.proceedMarque();
     }
    )
  },

  search() {
    console.log('2');
  },

  onUnload() {
    console.log(1111);
  }
})