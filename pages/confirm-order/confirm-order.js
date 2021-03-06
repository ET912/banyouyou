
import { getUserCoupon, newOrder, cartDel } from '../../api/index'
import { getConfirmOrderAddress } from '../../utils/index'
import { CONFRIMORDERGOODLIST, CONFIRMORDERADDRESS, MAXCOUNT, USERINFO } from '../../utils/constant'


Page({
    data: {
      address: {},
      // 用户信息用于获取vip折扣
      userInfo: {},
      // 订单总金额
      totalMoney: 0,
      // 优惠金额
      discountMoney: 0,
      // 去除vip折扣后
      vipDiscountMoney: 0,
      // 应付金额
      orderMoney: 0,
      // 当前使用优惠券，默认使用优惠金额最高的
      curCoupon: {},
      couponList: [],
      availableCouponList: [],
      orderAvailableCouponList: [],
      orderUnavailableCouponList: [],
      goodList: [],
      showCouponSelector: false,
      showPopup: false,
      // 留言
      message: ''
    },
    toSelectAddress() {
      let url = ''
      if (this.data.address.Id) {
        url = `/pages/selectAddress/selectAddress?id=${this.data.address.Id}`
      } else {
        url = '/pages/add-address/add-address'
      }
      wx.navigateTo({ url })
    },
    submitOrder() {
      if (!this.data.address.Id) {
        wx.showToast({ title: '请选择收货地址', icon: "none" });
        return
      }
      let address_id = this.data.address.Id
      let coupon_list = this.data.orderAvailableCouponList.filter(item => item.checked)
      coupon_list = coupon_list.map(item => item.UUID)
      let total_price = this.data.orderMoney
      let price_list = this.data.goodList.map(item => ({ id: item.priceId, number: item.count }))
      console.log(coupon_list)
      newOrder({ address_id, coupon_list, total_price, price_list, message: this.data.message })
        .then(res => {
          if (this.data.type === '2') {
            // 从购物车跳过来的
            let cartGoodIds = this.data.goodList.map(item => item.cartId)
            // 删除购物车
            cartDel({ id: cartGoodIds })
              .then(() => {
                // wx.redirectTo({ url: '/pages/my-orders/my-orders' })
              })
          } else {
            // wx.redirectTo({ url: '/pages/my-orders/my-orders' })
          }
          this.setData({ showPopup: true })
        })
    },
    goOrderDesc() {
      wx.redirectTo({ url: '/pages/my-orders/my-orders' })
    },
    closeCouponSelector() {
      this.setData({ showCouponSelector: false })
    },
    showCouponSelector() {
      this.setData({ showCouponSelector: true })
    },
    setCouponList(totalMoney, couTotalMoney,vipDiscountMoney) {
      // let cpTotalMoney = totalMoney
      getUserCoupon({ limit: MAXCOUNT, offset: 0, type: 0 })
      .then(res => {
        let list = res.list
        list = list.map(item => ({ ...item, checked: false }))
        let availableCouponList = list.filter(item => item.Status === 1)
        let orderAvailableCouponList = availableCouponList.filter(item => totalMoney >= item.FullPrice)
        let orderUnavailableCouponList = availableCouponList.filter(item => totalMoney < item.FullPrice)
        // set checked
        let discountMoney = 0
        let CouTotalMoney = couTotalMoney - vipDiscountMoney
        orderAvailableCouponList.map(item => {
          if (CouTotalMoney >= item.FullPrice) {
            item.checked = true
            discountMoney += item.Price
            CouTotalMoney -= item.FullPrice
          }
          return item
        })
        this.setData({
          discountMoney,
          orderMoney: totalMoney - discountMoney - vipDiscountMoney,
          availableCouponList,
          orderAvailableCouponList,
          orderUnavailableCouponList
        })
      })
    },
    selectCoupon(e) {
      let curCoupon = e.detail
      let { orderAvailableCouponList, totalMoney, vipDiscountMoney } = this.data
      let i = 0
      for (i; i < orderAvailableCouponList.length; i++) {
        if (orderAvailableCouponList[i].UUID === curCoupon.UUID) {
          break
        }
      }
      orderAvailableCouponList.splice(i, 1, curCoupon)
      let checkedCouponList = orderAvailableCouponList.filter(item => item.checked)
      let discountMoney = checkedCouponList.reduce((p, n) => p + n.Price, 0)
      this.setData({ orderAvailableCouponList, discountMoney, orderMoney: totalMoney - (vipDiscountMoney + discountMoney)  })
    },
    changeMessage(e) {
      this.setData({ message: e.detail.value })
    },
    onClose() {
      wx.switchTab({ url: '/pages/home/home' })
    },
    onLoad(options) {
      // type 1为立即购买 2购物车
      let type = options.type
      this.setData({ type })
    },
    async onShow() {
      let address = await getConfirmOrderAddress()
      try {
        var goodList = wx.getStorageSync(CONFRIMORDERGOODLIST)
        var userInfo = wx.getStorageSync(USERINFO)
        if (goodList) {
          let totalMoney = goodList.reduce((p, n) => p + n.price * n.count, 0)
          let couTotalMoney = goodList.reduce((p, n) => {
            let total = p
            if (!n.isSpecialOffer) {
              total = p + n.price * n.count
            }
            return total

          }, 0)
          // 服务端保存折扣是乘1000, 比如 997就是0.997
          let vipTotalMoney = Math.floor(totalMoney * (userInfo.Discount / 1000))
          let vipDiscountMoney = Math.ceil(parseInt(couTotalMoney * (1 - userInfo.Discount / 1000)))
          this.setCouponList(totalMoney, couTotalMoney, vipDiscountMoney)
          this.setData({
            userInfo,
            address,
            goodList,
            totalMoney,
            vipDiscountMoney
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    },
    onHide: function () {
      console.log('hide confirm page')
      wx.removeStorage({ key: CONFIRMORDERADDRESS })
    },
    onUnload: function () {
       // 首次加载选默认地址
       wx.removeStorageSync(CONFIRMORDERADDRESS)
    }
})