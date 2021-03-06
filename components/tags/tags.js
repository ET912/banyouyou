// components/tags/tags.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tags: {
      type: Array,
      value: []
    },
    customStyle: {
      type: String,
      value: 'color: #000;background: #f2f2f2;'
    },
    activeStyle: {
      type: String,
      value: 'color: #fff;background: #f54045;border: 0;'
    },
    disableStyle: {
      type: String,
      value: 'color: #98999a;background: #f4f5f6;'
    },
    activeItem: {
      type: String,
      value: '先生'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    'activeIndex': ''
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.properties.tags.forEach((item, index) => {
        if (item.selected) {
          this.setData({
            activeIndex: index
          })
        }
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 两种用法1 传递字符串数组 2 传递对象数组
    clickTag(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        activeIndex: index
      })
      this.triggerEvent('changeValue', this.properties.tags[this.data.activeIndex])
    },
    computeStyle(tag) {
      let { customStyle, activeStyle, disableStyle } = this.properties
      let style = customStyle
      if (tag.disable) {
        style = disableStyle
      } else if(tag.selected) {
        style = activeStyle
      }
      return style
    }
  },
  attached () {
    if (this.properties.defaultIndex !== '') {
      this.setData({
        activeIndex: this.properties.defaultIndex
      })
    }
    console.log(this.properties.defaultIndex, this.data.activeIndex)
  }
})
