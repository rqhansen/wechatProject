// miniprogram/pages/menu/menu.js
Page({

  data: {

  },
  onReady: function () {
      let selQuery = wx.createSelectorQuery();
      selQuery.select('#marqueContent').boundingClientRect(res => {
        this.offsetLeft = parseInt(res.width);
        if (!this.offsetLeft) {
          return;
        }
        this.duration = parseInt(this.offsetLeft / 0.045);
        this.startAnimation();
      }).exec();

  },

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