// pages/orderdetail/orderdetail.js
import { orderInfo, updateOrder } from '../../api/index.js'
import { ORDERSTATUS } from '../../utils/constant'
import { objectToString, formateDate } from '../../utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: [{
      title: '5厘米全杨油漆板',
      price: 4499.00,
      total: 10,
      count: 1,
      image: '/image/quick3.jpg'
    },
    {
      title: '阻燃中纤板',
      price: 124,
      count: 10,
      size: '15mm',
      image: '/image/quick3.jpg'
    }],
    id: '',
    orderInfo: {},
    orderStatusMap: ORDERSTATUS,
    bottomOperateText: '',
    showConfirmOperateOrder: false,
    conifrmDialogTitle: '',
    showAfterSales: false
  },

  contactMerchant() {
    wx.makePhoneCall({
      phoneNumber: '13377744329' //仅为示例，并非真实的电话号码
    })
  },
  opearteOrder() {
    if (this.data.bottomOperateText === '售后申请') {
      this.showAfterSales()
      return
    }
    this.setData({ showConfirmOperateOrder: true, conifrmDialogTitle: `确认${this.data.bottomOperateText}?` })
  },
  onCloseDialog() {
    this.setData({ showConfirmOperateOrder: false })
  },
  confirmUpdateOrder() {
    let orderInfo = this.data.orderInfo
    let id = orderInfo.id
    let status
    if (orderInfo.status === 1) {
      status = -1
    } else if (orderInfo.status === 2) {
      status = 3
    }
    updateOrder({ id, status })
      .then(res => {
        this.getOrderInfo(id)
        wx.showToast({
          title: `${this.data.bottomOperateText}成功`,
          icon: 'none',
          mask: true,
          duration: 2000
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getOrderInfo(id) {
    orderInfo({ id })
      .then(res => {
        res.createDateStr = formateDate(res.CreatedAt)
        res.order_item = res.order_item.map(item => {
          item.sizeDesc = objectToString(item.description)
          return item
        })
        res.pay_item = res.pay_item.map(item => {
          item.CreatedAt = formateDate(item.CreatedAt)
          return item
        })
        let doneMoey = res.pay_item.reduce((p, n) => p + n.Money, 0)
        res.remainMoney = res.total_price - doneMoey
        let bottomOperateText
        switch (res.status) {
          case 1:
            bottomOperateText = '取消订单'
            break;
          case 2:
            bottomOperateText = '已收货'
            break
          case 3:
          case 4:
          case 5:
            bottomOperateText = '售后申请'
            break;
        }
        // if (res.status === 1) {
        //   bottomOperateText = '取消订单'
        // } else if (res.status === 2) {
        //   bottomOperateText = '已收货'
        // } else {
        //   bottomOperateText = ''
        // }
        res.SendTime = formateDate(res.SendTime)
        res.GetTime = formateDate(res.GetTime)
        this.setData({ orderInfo: res, bottomOperateText })
      })
  },
  showAfterSales() {
    this.setData({ showAfterSales: true })
  },
  closeAfterSales() {
    this.setData({ showAfterSales: false })
  },
  onLoad: function (options) {
    let id = parseInt(options.id)
    this.setData({ id })
    this.getOrderInfo(id)
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})