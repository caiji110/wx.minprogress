//app.js
// onload会快于app.onlanch
App({
  globalData : { //编译后会清空!
  kindArr:[],
  // '诚聘','求职', '房屋', '店面','寻人', '热门','二手',
},
info:{},
  onLaunch: async function () {
    let that = this
    //初始化云能力
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    //获取openid鉴别用户
    let openidRes = await wx.cloud.callFunction({
      name: 'getOpenId',
    })
    console.log(openidRes)
    let res = await wx.getSetting({})
     console.log(res);
   await  wx.getStorage({
      key: 'userinfo',
    }).then(res => {
      that.globalData = { //编译后会清空!
        // kindArr:openidRes.result.kindArr,
              //是否管理员
        ifVip:  openidRes.result.ifVip,
        openId:  openidRes.result.openid,
        // 存昵称 头像
        userInfo: '',
        // 存显示数组
        //showArr: null,
        // 存我发布的数组 算了感觉还是要去云检索
        nickName:res.data.nickName,
        userimg:res.data.avatarUrl,
        hasUser:true,
        myArr: null,
        //存我收藏的数组
        loveArr: null
      }
      console.log(this.globalData);
      
    })
    //下面是别人写的我看不懂的getuserinfo 好处是快速加载 但是会延迟(不会现在打印出来)
    // if (res.authSetting['scope.userInfo']) {
    //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //   wx.getUserInfo({
    //     success: res => {
    //       // 可以将 res 发送给后台解码出 unionId 
    //       this.globalData.userInfo = res.userInfo
    //       console.log(res);
    //       if (this.userInfoReadyCallback) {
    //         this.userInfoReadyCallback(res)
    //       }
    //     }
    //   })
    // }

 
    
    console.log(this.globalData)
  },
   judge(){//.result.ifVip是结果
   let obj =    wx.cloud.callFunction({
      name: 'getOpenId'
    })
    return  obj
  },
  editShowList(id,target,detail){
    let cloudRes =  wx.cloud.callFunction({
      name: "editShowList",
      data: {
        id,
        //目标字段
        target,
        detail
      }
    })
    return cloudRes
  },
  
 privatePush(targetArr,id) {
   //注意 返回一个promise
    let cloudRes =  wx.cloud.callFunction({
      name: "editPrivateList",
      data: {
        
        //事件
        action:'push',
        //目标数组
        targetArr,
        //
        id,
      }
    })
    return cloudRes
  },
  privatePull(targetArr,id) {
    //注意 返回一个promise
     let cloudRes =  wx.cloud.callFunction({
       name: "editPrivateList",
       data: {
        
         //事件
         action:'pull',
         //目标数组
         targetArr,
         //
         id
       }
     })
     return cloudRes
   },
})

let Time = { //转化时间函数 还是不要在本地转化吧

  // Get the current timestamp

  getUnix: function () {

    let date = new Date()

    return date.getTime()

  },

  // Get the timestamp of today's 0:0:0

  getTodayUnix: function () {

    let date = new Date()

    date.setHours(0)

    date.setMinutes(0)

    date.setSeconds(0)

    date.setMilliseconds(0)

    return date.getTime()

  },

  // Get the timestamp of 0:00:0 on January 1 this year

  getYearUnix: function () {

    let date = new Date()

    date.setMonth(0)

    date.setDate(1)

    date.setHours(0)

    date.setMinutes(0)

    date.setSeconds(0)

    date.setMilliseconds(0)

    return date.getTime()

  },

  // Get the standard year and month

  getLastDate: function (time) {

    let date = new Date(time)

    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1

    let day = date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1

    return date.getFullYear() + '-' + month + '-' + day

  },

  // conversion time
  getFormatTime: function (timestamp) {

    let now = this.getUnix()

    let today = this.getTodayUnix()

    let year = this.getYearUnix()

    let timer = (now - timestamp) / 1000

    let tip = ''

    if (timer <= 0) {

      tip = '刚刚'

    } else if (Math.floor(timer / 60) <= 0) {

      tip = '刚刚'

    } else if (Math.floor(timer < 3600)) {

      tip = Math.floor(timer / 60) + '分钟前'

    } else if (timer >= 3600 && timer < 86400) {

      tip = Math.floor(timer / 3600) + '小时前'

    } else if (timer / 86400 <= 31) {

      tip = Math.floor(timer / 86400) + '天前'

    } else {

      tip = this.getLastDate(timestamp)

    }

    return tip

  },

}