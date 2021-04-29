// components/scanrecord/scanrecord.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propdata:{
      type:Object,
      observer: function (newVal, oldVal){
       this.setData({
         item:newVal
       })
    }
  },
 
 },
  /**
   * 组件的初始数据
   */
  data: {
   item:{},
   img:""
  },
  /**
   * 组件的方法列表
   */
  methods: {
  
  }
})
