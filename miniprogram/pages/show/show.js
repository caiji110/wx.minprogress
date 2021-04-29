// pages/show/show.js
const app = getApp()
Page({

  data: {
    searchHolder: '搜索',
    ifDisplay: 'notDisplay',
    showUnit_headImageUrl: '../../images//4.jpg', //头像
    showArr: '', //显示数组
    nowHaveShow: 0, //以及拿到的数据条数
    searchFor: '', //搜索字符串
    loveImg: '../../iconImg/love1.png',
    vip: '',
    loveArr: [],
    region: ['新亨'],
    kindArr:[],
    featurePicArr: ['../../test/1.JPG', '../../test/2.JPG', '../../test/3.JPG']
  },

  onLoad: async function (options) {
    if(options.id)
    this.QRlogin(options)
    await this.selectComponent('#feed').init('normal'); //没有这个会异步
    this.selectComponent('#feed').render()
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

  chooseLocation: function () {
    wx.showToast({
      icon: 'none',
      title: '暂时仅可选择此地区',
    })
  },
 
  // 点击发布跳转
  toPublish: function () {
    wx.getUserInfo({
      // 用户已经授权
      success(e) {
        console.log("success", e);
        wx.navigateTo({
          url: "/pages/publish/publish"
        });
      },
      // 用户还没有授权
      fail(e) {
        // // 提示尚未获取授权
        wx.showModal({
          title: "尚未授权",
          content: "请到个人页面手动授权",
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
              // 自动跳转到个人页面去授权
              wx.switchTab({
                url: '/pages/me/me'
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
        console.log("fail", e);
      }
    });
  },
  whenInput: function (e) {

    this.setData({
      searchFor: e.detail.value,
    })
    console.log(this.data.searchFor)
  },
  confirm: async function () {
    if (!this.data.searchFor)
      return
    else {
      await this.selectComponent('#feed').init('search',this.data.searchFor); //没有这个会异步
       this.selectComponent('#feed').render()
    }
  },
  cancel: function () {
    wx.hideKeyboard();
    this.setData({
      searchFor: ''
    })
  },
  async selectKind(e){
    console.log(e.currentTarget.dataset.kind)
     await this.selectComponent('#feed').init('kind',e.currentTarget.dataset.kind); 
    this.selectComponent('#feed').render()
  },
 
  onReady: function () {

  },

  onShow: function () {



  },

  onHide: function () {},


  onUnload: function () {

  },

  async Refresh1(){
    await this.selectComponent('#feed').init('normal');
    this.selectComponent('#feed').render()
  },
  async Refresh2(){
    await this.selectComponent('#background').init(); 
  },
  onPullDownRefresh: async function () {
    wx.showLoading({
      title: '刷新中...',
    })
   this.Refresh1()
   this.Refresh2()
    wx.hideLoading();
    //隐藏导航条加载动画
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },

  onReachBottom: async function () {

    this.selectComponent('#feed').render()
  },

  onShareAppMessage: function (e) {

  },
})