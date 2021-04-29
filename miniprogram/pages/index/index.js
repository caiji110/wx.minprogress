Page({

  /**
   * 页面的初始数据
   */
   data:{
    alldata:[],
    value:'',
    newdata:undefined
   },
  /**
   * 生命周期函数--监听页面加载
   */
  finddata:function(){
     wx.cloud.callFunction({
       name:"findarry",
       data:{
         newdata:this.data.value
       },
       success:(res) =>{
        this.setData({
          newdata:res.result.obj
        })
       // console.log(this.data.newdata);
       },
       fail:function(res){
         console.log(res);
       }
     })
  },

  onLoad: function () {
  
      //页面一加载把数据库的数据渲染出来
      wx.cloud.callFunction({
        name:"alldata",
        success:(res) => {
          this.setData({
            alldata: res.result.data.reverse()
          })
        //  console.log(res.result.data);
          //console.log(this.data.alldata);
         // console.log(this.data.alldata);
        },
        fail:(res) => {
          console.log(res);
        }
      })
    
  },
  
  //输入新的数据更新alldata数组
  dataupdate:function(){
    wx.cloud.callFunction({
      name:"alldata",
      success:(res) => {
        this.setData({
          alldata: res.result.data.reverse()
        })
        console.log(res.result.data);
        console.log(this.data.alldata);
       // console.log(this.data.alldata);
      },
      fail:(res) => {
        console.log(res);
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})