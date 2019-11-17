// pages/memberData/memberData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: false,
    birthday: "未选择",
    title: ["设置姓名", "设置性别", "设置生日"],
    index: 0
  },

  showModal(e) {
    // 要去请求后台看看生日设置没，如果设置了就在点击生日选项不弹出modal框
    let index = e.currentTarget.dataset.index
    this.setData({
      showFlag: true,
      index
    })
  },

  cancelModal() {
    this.setData({
      showFlag: false
    })
  },

  formSubmit: function (e) {
    // 生日保存成功后就不允许修改
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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