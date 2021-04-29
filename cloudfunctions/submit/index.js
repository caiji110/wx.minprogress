// 云函数入口文件
/* 这个云函数设计初衷是为了上传到showlist数据库
只是顺手上传到了private数据库作为我的发布 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db =  cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  const wxContext = cloud.getWXContext()
  
  await db.collection('privateList').doc(wxContext.OPENID).update({
    data: {
      myPublishId: _.push([event.timeMs])
    }
    //下面是否有必要？
}).then(res=>{
  if(!res.stats.updated)
   db.collection('privateList').add({
    data:{
      _id:wxContext.OPENID,
      myPublishId:[event.timeMs]
    }
  })
   
})

  await db.collection('showList').doc(event.timeMs).set({
    data: event
  }) 
 await db.collection('showList').doc(event.timeMs).update({
  data:{
    openId:wxContext.OPENID
  }
}) 
}
