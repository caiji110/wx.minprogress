// pages/publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // openid:app.globalData,
    ifEdit:false,
    //标题
    title:'',
    //可选种类
    // kinds: app.globalData.kindArr,
    kindIndex:0,
    kind:'请选择',
    imgs: [],
    imgArr: [],
    contain:"",
    makesureOnce: true,
    kinds: [],
    ifTop:false,
    ifFinished:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    const that = this
    //这句：请求网络把类别更新进去
    wx.cloud.callFunction({name:"getOpenId"}).then(res=>{console.log(res.result.kindArr);that.setData({kinds:res.result.kindArr}) })
    //如果是有传数据
    if(options.data){
      console.log(options.data)
      wx.showToast({
        icon:'none',
        title: '图片会自动保留',

      })
    
      let currentShow = JSON.parse(options.data)
      console.log(currentShow)
      //先全方位拷贝进来
      this.data = Object.assign(this.data, currentShow)
      this.setData({
        ifTop:currentShow.ifTop,
        ifEdit:true,
        contain:currentShow.contain,
        kind:currentShow.kind,
        title:currentShow.title,
        phoneNumber:currentShow.phoneNumber
      })
    }
    else if(options.highLight){console.log('现在是发布精选')
  this.setData({
    nowHighLight:true,
    kind:"精选"
  })}
console.log(this.data)
  },
  //改变文本时

  // 当改变类别时
  kindChange: function (e) {
    this.setData({
      kind: this.data.kinds[e.detail.value] 
    })
  },  containChange(e){
    console.log(e.detail.value)
    this.setData({
      contain:e.detail.value
    })
  },titleChange(e){
    console.log(e.detail.value)
    this.setData({
      title:e.detail.value
    })},phoneChange(e){
      console.log(e.detail.value)
      this.setData({
        phoneNumber:e.detail.value
    })
  },

  checked(){
   
    if(this.data.kind=='请选择'||this.data.title==''||this.data.contain=='') {
      wx.showToast({
        icon: "none",
        title: '请完整填写信息！',
      })
      
      return 0
    }
    else if(this.data.contain.length<=10){
      wx.showToast({
        icon: "none",
        title: '文字不足！',
      })
      return 0;
    }
    else return 1;
  },
//当按下发布
  submit: async function () {
    //必要的
    const  that = this;
    // 发布校验
    //    初始化正则表达式
    //    let reg = /1[0-9]{10}/
    //    if(reg.test(this.data.main) ){
    //     console.log("含有电话")
    //     let x = this.data.main.replace(reg,'xxxx')
    //     console.log(x)
    //    }
    //    else
    //    console.log("不含有")
    //确保不会有sb一直按发布
    if (!this.data.makesureOnce||!this.checked()) 
      return;

    //让人别乱发
    if (!app.globalData.ifVip) {
      await wx.showModal({
        title: '您不是管理员',
        content: '确认发布？（请勿发布无关内容）',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //这里是回调 不能用this
            that.submitAction();
          } else if (res.cancel) {
            console.log('用户点击取消')
            return;
          }
        }
      })
    }
    // 管理员可以发
    else
      that.submitAction(); 

  },
  // 上传操作
  submitAction: async function () {
    console.log(this.data)
    this.setData({
      makesureOnce: false
    })
    wx.showLoading({
      title: '加载中'
    })

    for (let i = 0; i < this.data.imgs.length; i++) {
      let imgObj = await wx.cloud.uploadFile({
        cloudPath: String(new Date().getTime()),
        filePath: this.data.imgs[i], // 文件路径
      })
      this.data.imgArr[i] = imgObj.fileID
    }
    console.log(this.data.imgArr)
    //调用云函数载入数据库
    let res = await wx.cloud.callFunction({
      name: 'submit',
      data: {
        title:this.data.title,//标题
        contain: this.data.contain, //主要文本内容
        kind: this.data.kind, //类别
        nickname: app.globalData.userInfo.nickName, //昵称
        imgArr: this.data.imgArr, //云储存的路径 用于image直接加载
        publishTime: String(new Date().toLocaleDateString() + new Date().toLocaleTimeString()), //最近编辑时间
        timeMs: this.data.ifEdit?this.data.timeMs:new Date().getTime(), //这是long型数据
        vip: this.data.nowHighLight, //是否精选
        randomViews:Math.ceil(Math.random()*10),//随机初始化浏览量
        realViews:0,//真实浏览量
        beloved:[],//被收藏夹
        phoneNumber:this.data.phoneNumber,//电话号码
        ifTop:this.data.ifTop,//是否置顶
        ifFinished:this.data.ifFinished
      }
    })    
    console.log(res)
    wx.hideLoading()
    wx.navigateBack({
      url: '/pages/show/show',
      suucess:async function(){
        await this.selectComponent('#feed').init('normal'); //没有这个会异步
        this.selectComponent('#feed').render()
      }
    })
  },
  // 业务逻辑：所有图片相对路径全部压到imgs数组里 拿来显示或者上传
  chooseImg: function () {
    let that = this;
/*     let len = this.data.imgs;
    if(len>=9){
        this.setData({
            lenMore: 1
        })
        return;
    } */
    wx.chooseImage({
      sizeType: ['compressed'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        let imgs = that.data.imgs;
        for (let i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length < 9) {
            imgs.push(tempFilePaths[i])
          } else {
            that.setData({
              imgs
            })
            wx.showModal({
              title: '提示',
              content: '最多只能有九张图片'
            })
            return;
          }
        }
        that.setData({
          imgs
        })
      }
    })
  },
  // 预览
  previewImg: function (e) {
    let index = e.currentTarget.dataset.index;
    let imgs = this.data.imgs;
    wx.previewImage({
      current: imgs[index],
      urls: imgs,
    })
  },
  // 删照片
  deleteImg: function (e) {
    let _index = e.currentTarget.dataset.index;
    let imgs = this.data.imgs;
    imgs.splice(_index, 1);
    this.setData({
      imgs
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