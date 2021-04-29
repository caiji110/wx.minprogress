// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  let obj = {}
  await db.collection("useinfo").where({
    remarksvalue:event.newdata
  }).get().then((res)=>{
      obj = res.data[0]
    // console.log(res.data[0]);
  })
  return{
    obj:obj
  }
}