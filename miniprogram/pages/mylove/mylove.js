// pages/mylove/mylove.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: async function (options) {
    await this.selectComponent('#feed').init('love'); //没有这个会异步
     this.selectComponent('#feed').render('normal')// 传入参数用于区分是在浏览页面的渲染，不进行特殊排序只根据浏览的顺序进行排序
  },
  handleLongTap(e){
    const that = this
   console.log(e.detail)
    wx.showActionSheet({
      itemList: ['移除'],
      success (res) {
        wx.showModal({
          title: '提示',
          content: '确认移除？',
           async success (res) {
            if (res.confirm) {
              console.log( await app.privatePull('myLoveIdArr',e.detail.timeMs))
              console.log('用户点击确定')
              that.onLoad()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
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
    this.selectComponent('#feed').render('normal')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})