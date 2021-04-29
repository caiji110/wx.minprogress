// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database()

//请求快照后 根据置顶情况重新排序

exports.main = async (event, context) => {
  console.log('wobeidiaoyongle');
  const _ = db.command;
  const MAX_limit = 100;
  let count;
  const wxContext = cloud.getWXContext()
  let res
  switch (event.kind) {
    case 'normal':
     count = (await db.collection("showList").count()).total;
     let objarry=[];
     res =[];
    let times = Math.ceil((count/MAX_limit));
    times>5?times=5:times=times;
    console.log(times);
    for (let i = 0; i < times; i++) {
      //降序查找
      const promise = db.collection('showList').orderBy("_id", 'desc').field({
        _id: true,
        ifTop:true,
       publishTime:true,
      }).skip(i * MAX_limit).limit(MAX_limit).get()

      objarry.push(promise)
    }
    //拿到的是嵌套数组，将其扁平化处理
    let c= await Promise.all(objarry);
    console.log(c);
    c.forEach(item => {
      res.push(...item.data)
    })
    res = res.map(v => v._id);
    //   res = await db.collection('showList').field({
    //     _id: true,
    //     ifTop:true,
    //     publishTime:true,
    //   }).get()
    // res = res.data.map(v => v._id)
      break;
    case 'search':
      res = await db.collection('showList').where(_.or(
        [{
          contain: new db.RegExp({
            regexp: event.detail,
            options: 'i',
          })
        }, {
          kind:  new db.RegExp({
            regexp: event.detail,
            options: 'i',
          })
        }, {
          title:  new db.RegExp({
            regexp: event.detail,
            options: 'i',
          })
        }]
      )).field({
        _id: true,
      }).get()
      res = res.data.map(v => v._id)
      break;
    case 'kind':
      res = await db.collection('showList').where({
        kind: event.detail
      }).field({
        _id: true,
      }).get()
      console.log(res);
      res = res.data.map(v => v._id)
      break;
    case 'love':
      //不知道为什么不能做到只返回该用户doc的回来
      res = await db.collection('privateList').doc(wxContext.OPENID).field({
        myLoveIdArr: true,
      }).get()
      res = res.data.myLoveIdArr
      break;
    case 'myPublish':
      res = await db.collection('privateList').doc(wxContext.OPENID).field({
        myPublishId: true,
      }).get()
      res = res.data.myPublishId
      break;
    case 'hightLight':
        res = await db.collection('showList').where({
          vip:true
        }).field({
          _id: true,
        }).get()
        res = res.data.map(v => v._id)
        break;
    case 'scan':
          console.log('wobeizhixingle');
          res = await db.collection('privateList').doc(wxContext.OPENID).field({
            myScanIdArr: true,
          }).get()
          console.log(res);
          res = (res.data.myScanIdArr).reverse()//反转数组，最后看到的排在最前面
          console.log(res);
          break;
    default:
      break;
  }

  return res
}