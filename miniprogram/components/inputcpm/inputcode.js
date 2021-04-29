

// components/inputcpm/inputcode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    namevalue:'',
    remarksvalue:"",
    aa:""
  },
 lifetimes:{
   attached:()=>{
      console.log(Math.random().toString().slice(2))
   },
 },

  /**
   * 组件的方法列表
   */
  methods: {
    saveimg(){
        wx.previewImage({      
          urls: [this.data.aa] // 需要预览的图片http链接列表
        })
       
    },
    datasubmit:function(e) {
     this.setData({
      namevalue:e.detail.value.namevalue,
      remarksvalue:e.detail.value.remarksvalue
     })
     wx.cloud.callFunction({
      name:"createcode",
      data:{
        namevalue:this.data.namevalue,
        remarksvalue:this.data.remarksvalue,
        randomnum:Math.random().toString().slice(2)
      },
      success:(res) =>{
        console.log(res)
         this.setData({
            aa:res.result,
         })
      //  console.log(res.result);
        //sconsole.log(this.data.aa);
       
      },
      fail:(res) => {
        console.log(res);
      }
    })
     // console.log(e);
      //console.log(this.data.namevalue);
     
    },
  }
})
