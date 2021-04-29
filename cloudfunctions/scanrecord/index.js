// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  let num = event.num
  const _ = db.command;
  let res;
  if(num ==1){
    await db.collection("privateList").doc(wxContext.OPENID).update({
      data:{
        myScanIdArr:_.addToSet(event._id)
      }
    })
    return {
      message:"添加成功"
    }
  }
  if(num == 2){
   res = await db.collection("privateList").doc(wxContext.OPENID).get()
  }
  return {
    result:res
  }
}