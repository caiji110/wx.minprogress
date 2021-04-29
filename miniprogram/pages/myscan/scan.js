

// miniprogram/pages/myscan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    await this.selectComponent('#feed').init('scan'); //没有这个会异步
   
    this.selectComponent('#feed').render('normal')
   
  },
  onReachBottom: function () {
    this.selectComponent('#feed').render('normal')
  },
 
  
})