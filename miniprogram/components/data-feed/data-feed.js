// components/dataFeed.js
const app = getApp()
Component({
  //外部样式影响内部
  options: {
    styleIsolation: "shared"
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String
    }
  },
  //组件挂载后执行
  //必须是异步函数 不然不会等云函数返回
  attached: async function () {

  },
  /**
   * 组件的初始数据
   */
  data: {
    slideButtonsOne: [{
      text: '置顶',
      data: 'letTop'
    }, {
      text: '编辑',
      extClass: 'editButton',
      data: 'edit'
    }, {
      type: 'warn',
      text: '删除',
      data: 'delete'
    }],
    slideButtonsTwo: [{
      text: '取消置顶',
      data: 'letDown'
    }, {
      text: '编辑',
      extClass: 'editButton',
      data: 'edit'
    }, {
      type: 'warn',
      text: '删除',
      data: 'delete'
    }],
    //id快照
    _idList: [],
    //当前的显示数组
    showArr: [],
    //已经显示的数组量
    showArrLength: 0,
  },

  //监听现在数组长度
  observers: {
    'showArr': function (showArr) {
      console.log("捕捉到showArr变化")
      this.setData({
        showArrLength: showArr.length
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //核心逻辑2：获取ID快照,返回需要渲染的文章id
    async getList(kind, detail) {
      console.log('我getlist');
      let _idListObj = {}

      console.log(detail ? detail : '未传入详情')

      _idListObj = await wx.cloud.callFunction({
        name: 'getShowId',
        data: {
          kind,
          detail
        }
      })

      console.log("请求快照完毕 返回的数据为：")
      console.log(_idListObj.result)

      // if(Array.isArray(_idListObj.result.data))
      // return  _idListObj.result.data.map(v => v._id)

      return _idListObj.result //返回数据
    },
    //核心逻辑1:初始化渲染列表,调用getList获得需要渲染的文章id列表
    async init(renderKind, optionalDetail) {
      console.log("开始初始化 kind为" + renderKind + "其它信息为:"+ optionalDetail)
      //这里调用核心逻辑2 获得渲染ID快照数据
      console.log('我是init');
      let res = await this.getList(renderKind, optionalDetail)
      console.log('11');
       console.log(res);
      //组件初始化一下
      this.setData({
        //id快照
        _idList: [],
        //当前的显示数组
        showArr: [],
        //已经显示的数组量
        showArrLength: 0,
      })
      //如果能正常拿到快照ID
      if(Array.isArray(res))
      this.setData({
        _idList: res
      })
      else{
        wx.showToast({
          icon: 'none',
          title: '没有内容了噢',
        })
      }
    },
    //核心逻辑3:根据文章id数组进行渲染
    async render(params) {
      let num = undefined;
      if(params)  num=1
      //在收藏，浏览记录页面的排序应该是根据用户最近的浏览情况进行排序，不应该由文章发布的事件进行排序
      //用num进行区分
      console.log("now runing render")
      wx.showLoading();
      //分逻辑:根据前面获得的快照ID，跟云索取数据
      //由于限制，只能索取到100条
      let renderObj = await wx.cloud.callFunction({
        name: "getRenderList",
        data: {
          _idList: this.data._idList,//文章ID列表数组
          showArrLength: this.data.showArr.length,//已经渲染的文章ID用于跳过
          num:num
        }
      })
      // console.log(this.data._idList);
      // console.log(this.data.showArrLength);
       console.log(renderObj);
      //提取确切数据
      let renderArray = renderObj.result.detail.data

      if (!renderArray.length) {
        wx.showToast({
          icon: 'none',
          title: '没有内容了噢',
        })
        return 0
      }

      //转化时间的逻辑，作用在本地
      renderArray = this.timeChange(renderArray)
      // console.log('now change the time: ')
      console.log(renderArray)
      this.setData({
        showArr: this.data.showArr.concat(renderArray)
      })
      // console.log('now concated: ')
      wx.hideLoading({
        success: (res) => {
          console.log('hideLoading')
        },
      })
    },

    
    toDetail(e) {
      //current是预处理结果 
      console.log(e);
      let current = this.beforeDetail(e)
      console.log(current.currentShow)
      if(current.currentShow.ifFinished){
        wx.showToast({
          icon:"none",
          title: '抱歉！需求已完成',
        })
      }
      else{
         //浏览量增加
        app.editShowList(current.currentShow.timeMs, 'randomViews', 'addView')
        console.log(JSON.stringify(current));
        wx.navigateTo({
          //获取当前点击的showArr元素
          url: '/pages/detail/detail?data=' + JSON.stringify(current),
        });
      }
     
    
    },
    beforeDetail(e) {
      //这个处理会带上ifLoved属性
      let currentIndex = e.currentTarget.dataset.index
      let currentShow = this.data.showArr[currentIndex];
      let ifLoved = false
      if (currentShow.beloved)
        ifLoved = currentShow.beloved.includes(app.globalData.openId)
      // 浏览数叠加 取分钟数的自然对数*10
      currentShow.visualViews = Math.round(10 * Math.log((new Date().getTime() - currentShow.timeMs) / 60000 + 1)) + currentShow.randomViews
      let data = {
        currentShow,
        ifLoved
      }
      return data
    },
    //自带的方法
    //是为了能够移除我的收藏
    longTap(e) {
      // console.log(this.data.showArr[e.currentTarget.dataset.index])
      this.triggerEvent("triggerLongTap", this.data.showArr[e.currentTarget.dataset.index])

    },
    slideTap(e) {
      //获取当前操作
      console.log(e);
      let operator = e.detail.data
      //获取到当前的数据
      let currentShow = e.currentTarget.dataset.data
      console.log(currentShow)
       switch (operator) {
        case 'letTop':
          app.editShowList(currentShow._id, 'ifTop', true).then(e=>{
            wx.showToast({
              title: '置顶成功',
            })
            console.log(e)
          })
          break;
        case 'letDown':
          app.editShowList(currentShow._id, 'ifTop', false).then(e=>{
            wx.showToast({
              title: '取消置顶成功',
            })
            console.log(e)
          })
          break;
        case 'edit':
          wx.navigateTo({
            //获取当前点击的showArr元素
            url: '/pages/publish/publish?data=' + JSON.stringify(currentShow),
          });
          break;
        case 'delete':
           wx.cloud.callFunction({name:'deleter',data:{deleteArr:[currentShow.timeMs]}}).then(e=>{
             wx.showToast({
               title: '删除成功',
             })
           })
          break;
        default:
          break;
      }
      let that = this
      this.init('normal').then(()=>{that.render()})
      
    },
    //传入未转化的 返回转化好的
    timeChange(data) {
      //日期转化(数据处理) data必须是数组
      let Time = {

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
      for (let i = 0; i < data.length; i++) {
        data[i].timeVisual = /* await  */ Time.getFormatTime(data[i].timeMs)
      }
      //转化时间

      return data
    }
  }
})