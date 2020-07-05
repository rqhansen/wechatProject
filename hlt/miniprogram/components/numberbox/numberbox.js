// components/numberbox.js
Component({
  options: {
    styleIsolation: "page-apply-shared"
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showMinus: {
      type: Boolean
    },
    dishAmount: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    plus() {
        this.triggerEvent('plus');
    },

    minus() {
      this.triggerEvent('minus');
    }
  }
})
