// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let arr = event.arr
  let showarr= []
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
 let res = [];
for(let i =0;i<arr.length;i++){
   const promise = db.collection('showList').where({
     _id:arr[i]
   }).get()
   showarr.push(promise)
}
 let c = await Promise.all(showarr)
 c.forEach(item => {
  res.push(...item.data)
})
 console.log(res);
  return {
   arr:res
  }
}