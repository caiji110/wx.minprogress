// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     
  },

  QRlogin(options){
    console.log('跳转');
    //拿到二维码里的参数，用于数据库查询
    // this.setData({
    //   id:options.id
    // })
    //调用云函数login登录并拿到该用户的openid
   wx.cloud.callFunction({
    name:"login",
    success:(res) => {
      //console.log(res);
      //将openid传给云函数judge判断用户是否第一次进入该小程序
      wx.cloud.callFunction({
        name:"judge",
        data:{
          opid:res.result.openid,
          id:options.id
        },
        success:function(res){
         // console.log(res);
        },
        fail:function(res){
         //console.log(res);
        }
      })
      //console.log(res.result.openid);
    },
    fail:(res) => {
      console.log(res);
    }
  })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id)
    this.QRlogin(options);
    
    

   
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