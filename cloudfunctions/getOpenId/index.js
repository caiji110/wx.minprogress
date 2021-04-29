// 云函数入口文件
const cloud = require('wx-server-sdk')
const lim = 10
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 /*  const $ = db.command.aggregate//利用聚合操作符判断是否为管理员 */
  const wxContext = cloud.getWXContext()
  let vipObj =  await db.collection('vipList').doc('vipOpenId').get()
  let kindArr = await db.collection('vipList').doc('backgroundData').get()
  //let ifVip = $.in('wxContext.OPENID','$vipObj.data.vipList')
  // (await db.collection("vipList").where({openId:wxContext.OPENID}).count() != 0)
  return {
    ifVip:  vipObj.data.openIdArr.indexOf(wxContext.OPENID) != -1,
    kindArr: kindArr.data.kindArr,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}