// pages/background/background.js
const app = getApp()
const limit = 1;

Component({

  //告诉组件现在是主页还是管理员 type是变量名
  // /pages/index/index?paramA=123&paramB=xyz ，如果声明有属性 paramA 或 paramB ，则它们会被赋值为 123 或 xyz 。
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {
    type: String,
  },
  data: {
    kindArr: [],
    swiperArr: [],
    imgs: [], //显示数组
    imgArr: [], //一定是云数组
    nowEdit: false, //是否进入编辑状态
  },
  async attached() {
   this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */

 

  methods: {
    async getBackGroundData(detail){
      return  wx.cloud.callFunction({
         name:'background',
         data:{
           action:'get'
         }
       })
     },
     async updateBackGroundData(data){
       return wx.cloud.callFunction({
         name:'background',
         data:{data}
       })
     },
     
    onLoad: async function (options) {
      if (this.data.type == 'background') {

      }
      await this.selectComponent('#feed').init('normal'); //没有这个会异步
      this.selectComponent('#feed').render()
    },
   async init(){
 //初始化
 let a = app.judge()
 let obj = await this.getBackGroundData()

   let backgroundData  = obj.result.res.data[0]
   console.log(backgroundData)
 let ifVip = await a
 this.setData({
  //  ifVip:ifVip.result.ifVip,
  ifVip:true,
   kindArr: backgroundData.kindArr,
   swiperArr: backgroundData.swiperArr,
   imgs: backgroundData.imgs
 })
 //注意：这里添加到全局使用
 // app.globalData.kindArr = this.data.kindArr
 console.log(this.data)
 // console.log(app.globalData.kindArr)
    },
   async submitEdit(){
     if(!this.data.nowEdit) return
    let res = await this.updateBackGroundData(this.data)
    console.log(res)
    wx.showToast({
      title: '提交成功',
      duration: 800,
      icon: "success",
      mask: true,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
    this.setData({
      nowEdit:false
    })
   },
    popTips(){
      wx.showModal({
        title: '提示',
        content: '点击进入编辑状态 点击提交进行上传  编辑广告栏请长按 编辑信息请向左滑',
      })
    },
    changeEdit() {
      this.setData({
        nowEdit: !this.data.nowEdit
      })
    },
    editSwiper(e) {
      if(!this.data.nowEdit) return 
      console.log(e)
      let currentUrl = e.currentTarget.dataset.itemurl
      let currentIndex = e.currentTarget.dataset.itemindex
      const that = this
      wx.showActionSheet({
        itemList: ['删除', '在此后添加'],
        success(res) {
          console.log(res)
          if (res.tapIndex == 0) {
            if (that.data.swiperArr.length <= 1) {
              wx.showToast({
                icon: 'none',
                title: '请至少保留一张！',
              })
              return
            } else {
              wx.showModal({
                title: '提示',
                content: '确认删除？',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                     that.data.swiperArr.splice(currentIndex,1)
                     that.setData({
                       swiperArr:that.data.swiperArr
                     })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }

          } else if (res.tapIndex == 1) {
            console.log("用户想要添加")
            wx.chooseImage({
              sizeType: ['compressed'],
              count: limit,
              success: (res) => {
                let tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths)
                wx.cloud.uploadFile({
                  cloudPath: 'vip' + String(new Date().getTime()),
                  filePath: tempFilePaths[0], // 文件路径
                }).then(res => {
                  //这里得到云id 补到imgs上
                  console.log(res.fileID)
                  that.data.swiperArr.push(res.fileID)
                  that.setData({
                    swiperArr: that.data.swiperArr
                  })
                })

              },
              fail: (res) => {
                console.log(res)
              }
            })
          }

        }
      })
    },

    editHightLight(){
      if(!this.data.nowEdit)return
      const that = this
      wx.showActionSheet({
        itemList: ['发布资讯'],
        success (res) {
         console.log(res)
         if(res.tapIndex==0){
          wx.navigateTo({
            url: '../publish/publish?highLight=a',
          })
         }
       

        }
      })
    },
    async selectKind(e){
      

      console.log(e.currentTarget.dataset.kind)
       await this.selectComponent('#feed').init('kind',e.currentTarget.dataset.kind); 
      this.selectComponent('#feed').render()
    },
    addKind(){
      
      const that = this
      wx.showModal({
        editable:true,
        // cancelColor: 'cancelColor',
        // cancelText: 'cancelText',
        // confirmColor: '',
        confirmText: '确认',
        showCancel: true,
        title: '新增类别',
        success: (result) => {
          console.log(result.content)
          that.data.kindArr.push(result.content)
          that.setData({kindArr:that.data.kindArr})
        },
        fail: (res) => {},
        complete: (res) => {console.log(res)},
      })
    },
    editKind(e){
      if(!this.data.nowEdit)return

      const that = this
      console.log(e)
      let currentIndex =  e.currentTarget.dataset.index
      let currentKind = e.currentTarget.dataset.kind
      wx.showActionSheet({
        itemList: ['编辑','删除'],
        success: (res) => {
          if (res.tapIndex == 0)//选择编辑
          {
            wx.showModal({
              editable:true,
              // cancelColor: 'cancelColor',
              // cancelText: 'cancelText',
              // confirmColor: '',
              confirmText: '确认',
              showCancel: true,
              title: '将'+currentKind+'改为',
              success: (result) => {
                console.log(result.content)
                that.data.kindArr[currentIndex] = result.content
                that.setData({kindArr:that.data.kindArr})
              },
              fail: (res) => {},
              complete: (res) => {console.log(res)},
            })
          }
          else if(res.tapIndex == 1){//选择删除
            wx.showModal({
              title: '提示',
              content: '确认删除？',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                   that.data.kindArr.splice(currentIndex,1)
                   that.setData({
                     kindArr:that.data.kindArr
                   })
                   wx.showToast({
                     title: '删除成功',
                   })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: (res) => {return},
        complete: (res) => {},
      })
     
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */

    //每选一个就上传一个 并返回云路径
    chooseImg: function (detail) {
      if(!this.data.nowEdit)return

      const that = this

      wx.chooseImage({
        sizeType: ['compressed'],
        count: limit,
        success: (res) => {
          let tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          wx.showLoading({
            title: '上传中',
          })
          wx.cloud.uploadFile({
            cloudPath: 'vip' + String(new Date().getTime()),
            filePath: tempFilePaths[0], // 文件路径
          }).then(res => {
            wx.hideLoading({
              success: (res) => {},
            })
            //这里得到云id 补到imgs上
            console.log(res.fileID)
            that.data.imgs.push(res.fileID)
            this.setData({
              imgs: this.data.imgs
            })
          })

        },
        fail: (res) => {
          console.log(res)
        }
      })

    },

    // 预览
    previewImg: function (e) {
      console.log(e)
       wx.previewImage({
     
        urls: [e.currentTarget.dataset.itemurl],
      })
      // let index = e.currentTarget.dataset.index;
      // let imgs = this.data.imgs;
      // wx.previewImage({
      //   current: imgs[index],
      //   urls: imgs,
      // })
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
    toHightLight(){
      wx.navigateTo({
        url: "/pages/highLight/highLight"
      });
    },
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      //重新调用app.js
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
    onPullDownRefresh: async function () {
      console.log('sb')
      wx.showLoading({
        title: '刷新中...',
      })
      await this.selectComponent('#feed').init('normal'); //没有这个会异步
      this.selectComponent('#feed').render()
      wx.hideLoading();
      //隐藏导航条加载动画
      // wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this.selectComponent('#feed').render()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
  }
})