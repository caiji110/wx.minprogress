// pages/detail/detail.js
const app = getApp()

Page({


  /**
   * 页面的初始数据
   */
  data: {    
    showArr:[],
    showUnit_headImageUrl:'../../images//4.jpg',
    currentShow:{},
    modalHidden:true,
    ifLoved:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
    console.log('传入对象需要JSON化',JSON.parse(options.data));
   
    let data = JSON.parse(options.data)
    console.log(data);
   // data.currentShow._id?id= data.currentShow._id:id = data._id
   
    //获得文章id上传至数据库,用于查询浏览记录
     console.log(data);
     wx.cloud.callFunction({
      name:"scanrecord",
      data:{
        num:1,//没有实际用处只是用于告诉云函数自己需要往数据库添加东西
        _id: data.currentShow._id
      },
      success: res => {console.log(res);},
      fail:err => console.log(err)
    })
    this.setData({
      // 直接传数据进来
      currentShow:data.currentShow,
      ifLoved:data.ifLoved
    })
    console.log(this.data)
  },
  tapLove(){
    this.setData({
      ifLoved:!this.data.ifLoved
    })
  },
  previewImg:function(e){
    let index = e.currentTarget.dataset.index;
    let imgs = this.data.currentShow.imgArr;
    wx.previewImage({
        current: imgs[index],
        urls: imgs,
    })
},
showQR:function(){
  wx.showToast({
    title: 'title',
    image:'../../iconImg/QR.jpg'
  })
},
 /**
   * 显示弹窗
   */
  contactTap: function() {
    wx.vibrateShort({
      type:'medium',
    })
    this.setData({
      modalHidden: false
    })
    
  },
  wanna(){
    wx.showModal({
      title: '提示',
content: '目前仅可发布xxxx内容 其余内容请联系微信',
success (res) {
if (res.confirm) {
console.log('用户点击确定')
} else if (res.cancel) {
console.log('用户点击取消')
}
}
    })
  },
  /**
   * 点击取消
   */
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true
    })
    wx.setClipboardData({
      data: 'wxid_cjekyb1y7b5d22',
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
    console.log(this.data)
    if(this.data.ifLoved)
     app.privatePush('myLoveIdArr',this.data.currentShow.timeMs).then(res=>{
        console.log(res.result.data)
        
      })//异步的
   else{
    app.privatePull('myLoveIdArr',this.data.currentShow.timeMs).then(res=>{
      console.log(res.result.data)
    })//异步的
   }
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