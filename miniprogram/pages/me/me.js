//index.js



//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hasUser:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showsecret:false,
    secretkey:"",//输入的密匙
    message:"",//调用云函数后返回的消息
    administer:false,//是否为管理员账号
    nickName:undefined,
    userimg:undefined,
  },

  onLoad: function() {
    //读取本地缓存的个人数据进行渲染
    if(this.data.nickName==undefined) {
      this.setData({
        administer:false
      })
    }
    //也可以直接根据app.globalData的值来判断用户的信息，但有可能但用户进入到me.js时app.globadata还没有 完成赋值
    //可以通过对象的数据劫持来进行数据的监听
    wx.getStorage({
      key: 'userinfo',
      success :(res) =>  {
        this.setData({
          nickName:res.data.nickName,
          userimg:res.data.avatarUrl,
          hasUser:true
        })
      //  console.log(res.data)
      }
    })
    // // console.log(this.data.canIUse)//判断版本号是否支持
    // console.log(app.globalData.userInfo)
    // //这里首次未授权会打印null 授权后 app.js得到权限 每次都会自动拿Info所以接下来都会正常打印
    // if (app.globalData.userInfo) {
    //   // console.log()
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    //   //console.log(this.data.userInfo)
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       console.log(res)
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
         this.yanzhen()
  },
       //验证是否为管理员账号
  yanzhen(){
  
       wx.cloud.callFunction({
        name:"judgesecretkey",
        data:{
          num:1 //无实际意义，用于告诉云函数是在查询该用户是否为管理员
        },
       success:res => {
         console.log(res.result.message);
         if(res.result.message == '已是管理员'&&this.data.nickName!=undefined){
          this.setData({
            administer:true
          })
         }    
       }
      })
  },
   //获取个人信息，并设置在本地缓存中
  getinfo(e){
   
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success:(res) => {
        console.log(res);
        wx.setStorage({
          key:"userinfo",
          data:JSON.parse(res.rawData) 
        })
        this.setData({
          nickName:res.userInfo.nickName,
          userimg:res.userInfo.avatarUrl,
          hasUser:true
        })
       this.yanzhen()
  },
})
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo !== undefined) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }

  },
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
  byebye(){
    wx.navigateTo({
      url: '../background/background',
    })
  },
  QRcode(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  myPublish:function(){
    wx.navigateTo({
      url:'/pages/myPublish/myPublish',
    })
  },
  myLove:function(){
    wx.navigateTo({
      url: "/pages/mylove/mylove"
    });

  },
  secretkey(){
    this.setData({
      showsecret:true
    })
  },
  btncancel(){
    this.setData({
      showsecret:false
    })
  },
  //进行密匙验证
  btnconfirm(){
    if (!this.data.secretkey) return -1;
    wx.cloud.callFunction({
      name:"judgesecretkey",
      data:{
        num:2,
        key:this.data.secretkey
      },
      success:(res) => {
        console.log(res);
        this.setData({
          message:res.result.message
        })
        if(this.data.message=='密匙验证正确，已添加为管理员'){
          wx.showToast({
            title: this.data.message,
            icon: 'success',
            duration: 1000,
            success:(res) => {
              console.log('111');
              this.setData({
                showsecret:false,
                administer:true
              })
            }
          })
        }
        else{
          wx.showToast({
            title: this.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail:err => {console.log(err);}
    })
   console.log(this.data.secretkey);
  }
})