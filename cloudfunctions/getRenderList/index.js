// 云函数入口文件
//这个函数只接收_idList和现在已经显示的数量 返回下一个分页的数据
const cloud = require('wx-server-sdk')
const lim = 10
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // orderBy('ifTop', 'desc').orderBy('timeMs', 'desc')
  if( event.num == 1){
    //用于区分是进行正常渲染还是进行浏览页面和收藏页面的渲染
    detail = await db.collection('showList').where({
      timeMs: db.command.in(event._idList),
      
    }).skip(event.showArrLength).limit(lim).get()
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      detail,
    }
  }
  detail = await db.collection('showList').where({
    timeMs: db.command.in(event._idList),
    
  }).orderBy('ifTop', 'desc').orderBy('timeMs', 'desc').skip(event.showArrLength).limit(lim).get()
 
  
  // // 承载所有读操作的 promise 的数组
  // const tasks = []
  // const MAX_LIMIT = 1
  // for (let i = 0; i < lim; i++) {
  //   const promise = db.collection('todos').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()


  //   tasks.push(promise)
  // }


  // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => {
  //   return {
  //     data: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //   }
  // })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    detail,
  }
}