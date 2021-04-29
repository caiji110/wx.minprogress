// 云函数入口文件
const cloud = require('wx-server-sdk')
const lim = 10
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('showList').where({
    _id: _.in(event.deleteArr)
  }).remove()

}