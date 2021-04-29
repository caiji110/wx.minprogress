// 云函数入口文件
//这个云函数就是为了增删改查我的收藏以及发布
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db =  cloud.database()
// 云函数入口函数

exports.main = async (event, context) => {
  const _ = db.command
  const wxContext = cloud.getWXContext()
  //添加为我的收藏
  if(event.action=='push'){
    //先添加到共有信息
    await db.collection('showList').doc(event.id).update({
      //使用addtoset确保互斥
      data:{
        beloved:_.addToSet(wxContext.OPENID)
      }
    })
    await db.collection('privateList').doc(wxContext.OPENID).update({
      data:{
        [event.targetArr]:_.addToSet(event.id)
      }
    })
      
  }
  else if(event.action=='pull'){
    await db.collection('showList').doc(event.id).update({
      data:{
        beloved:_.pull(wxContext.OPENID)
      }
    })
    await db.collection('privateList').doc(wxContext.OPENID).update({
      data:{
        [event.targetArr]:_.pull(event.id)
      }
    })
      
  }

  return await db.collection('privateList').doc(wxContext.OPENID).field({
    myLoveIdArr:true
  }).get()


  
  }
 
