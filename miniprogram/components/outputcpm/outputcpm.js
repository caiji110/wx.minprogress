// components/outputcpm/outputcpm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   propdata:{
       type:Object,
       observer:function(data){
  
         this.setData({
           cpmdata:data
         })
       }
   }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cpmdata:{}
  },
  /**
   * 组件的方法列表
   */
  lifetimes:{
  attached(){
   // console.log(this.data.cpmdata);
  }
  },

  methods: {
    //实现二维码点击放大功能2.2.3 起支持云文件ID。	
   save(e){
    wx.previewImage({
     
      urls: [e.currentTarget.dataset.id] // 需要预览的图片http链接列表
    })
     console.log(e.currentTarget.dataset.id);
   }
  }
})
