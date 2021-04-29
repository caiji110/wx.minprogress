// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command;
  const $ = db.command.aggregate
  const num = event.num;
  let message;
  if(num == 1){
 let arr =await db.collection('vipList').aggregate()
  .project({
    included: $.in([wxContext.OPENID, '$openIdArr'])
  })
  .end()

  console.log(arr.list);
  arr.list.map(item => {
    if(item._id == "vipOpenId"&&item.included==true){
      message = '已是管理员'
    }
  })
  if( message == '已是管理员'){
    return {
      message:message
    }
  }
  else {
    return{
      message:"非管理员"
    }
  }
  }
  if(num == 2){
    const res = await db.collection("secretkey").where({
      key: Number(event.key)
    }).get();
    //验证成功
    if(res.data[0]){
      await db.collection("vipList").doc("vipOpenId").update({
        data:{
           openIdArr:_.addToSet(wxContext.OPENID)
        }
      }).then(res => {
        console.log(res);
        message = '密匙验证正确，已添加为管理员'
      })
    }
    //验证失败
    else{
      message = '密匙验证失败，请重试'
    }
    return {
      message:message
     }
  }

  
}