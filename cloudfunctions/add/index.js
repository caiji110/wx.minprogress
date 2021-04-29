// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  db.collection('useinfo').add({
    data:{
    scancode:0,
    introducenum:0,
    namevalue:event.namevalue,
    remarksvalue:event.remarksvalue,
    onlyid:event.weiyiid
    },
    success:function(res){
      console.log(res);
    },
    fail:function(res){
           console.log(res);
    }
    
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}