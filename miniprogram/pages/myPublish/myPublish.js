// pages/myPublish/myPublsh.js
const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    ifDisplay:'notDisplay',
    wannaDelete:[],
    showUnit_headImageUrl: '../../images//4.jpg',//头像
    showArr: '',//显示数组
    nowHaveShow: 0,//以及拿到的数据条数
    serachFor:'',//搜索字符串
   // myPublishOpenId:null,//
   // myLove:null
    vip:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.selectComponent('#feed').init('myPublish'); //没有这个会异步
    this.selectComponent('#feed').render()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  handleLongTap(e){
    const that = this
   console.log(e.detail)
    wx.showActionSheet({
      itemList: ['移除','标记已完成'],
      success (res) {
       if(res.tapIndex==0)
        wx.showModal({
          title: '提示',
          content: '确认移除？',
           async success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
             app.privatePull('myPublishId',e.detail.timeMs)
              console.log( await wx.cloud.callFunction({name:'deleter',data:{deleteArr:[e.detail.timeMs]}}))
              that.onLoad()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        else if(res.tapIndex==1)
        {
          wx.showModal({
            title: '提示',
            content: '确认标记？标记后不可取消',
             async success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                await app.editShowList(e.detail.timeMs,'ifFinished',true)
                that.onLoad()
                wx.showToast({
                  title: '标记成功',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
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
  onReachBottom: async function () {
    this.selectComponent('#feed').render()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})