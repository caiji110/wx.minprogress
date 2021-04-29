// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,

})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch(event.action){
    case 'get':
      res = await db.collection('vipList').where({
        _id:'backgroundData'
      }).get()
      break;
      default:
        res = await db.collection('vipList').doc('backgroundData').set({
          data:event.data
        })
        break;
  }
  return {
    // ifVip:res.data.vipArr.indexOf(wxContext.OPENID) != -1,
    res,
    event,
  }
}