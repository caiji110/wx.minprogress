// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

exports.main = async (event, context) => {
  
  const db = cloud.database()
  const _ = db.command
  //用于判断用户是否使用过该小程序
  await db.collection('user').where({
    userid:event.opid
  }).get().then( res => {
    console.log(res);
    if(res.data[0]){
      //用户之前登录过
      console.log('不为空');
      test = true
    }
    else{
      //用户第一次登
        console.log('空');
        test = false
    }
  })
  //用户是第一次登录将其Openid添加到数据库中
  if(test == false){   
    console.log('wozaitianjiashu');
   await db.collection('user').add({
      data:{
        userid:event.opid
      }
     }).then((res) => console.log(res))
    //根据传过来的id进行数据库查询并相应的记录引流人数加1
   await db.collection("useinfo").where({
      onlyid : event.id
    }).update({
      data:{
        //引流人数加1
        introducenum:_.inc(1)
      },
      success:function(res){
        console.log('数据添加成功');
      },
      fail:function(res){
        console.log(res);
      }
    })

  }
  //无论是否登录过，只要扫码过都扫码次数加1
    await db.collection("useinfo").where({
      onlyid : event.id
    }).update({
      data:{
        //扫码人数加1
        scancode:_.inc(1)
      }
    })
  

  return  {
    ok:'ok'
  }
}