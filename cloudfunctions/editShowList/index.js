const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db =  cloud.database()
// 云函数入口函数

exports.main = async (event, context) => {
  const _ = db.command
  const wxContext = cloud.getWXContext()
  
  if(event.detail=='addView'){
    await db.collection('showList').doc(event.id).update({
      data:{
       [event.target]:_.inc(Math.ceil(Math.random()*3))
      }
    })
  }
  //通用编辑 暂时没用到
  else {
    await db.collection('showList').doc(event.id).update({
      data:{
        [event.target]:event.detail
      }
    })
  }
  
  return {
    event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}