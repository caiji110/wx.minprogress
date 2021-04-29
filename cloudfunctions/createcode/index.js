// 云函数入口文件
const cloud = require('wx-server-sdk')
function gettime(){
  var myDate = new Date();  
  var y=  myDate.getFullYear();
  var m=  myDate.getMonth()+1;
  var d=  myDate.getDate(); 
  var h= myDate.getHours();
  console.log(y+"年"+m+'月'+d+"号"+h+"点");
  return y+"年"+m+'月'+d+"号"+h+"点"
 }
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
 const uploadfile = async function(arraybuffer,path){
   console.log('我被调用了');
   let {fileID} = await cloud.uploadFile({
     cloudPath:path,
     fileContent:arraybuffer
   })
   return fileID
 }
// 云函数入口函数
exports.main = async (event, context) => {

  //根据渠道名称进行数据库查询，如果存在(即二次点击)，则返回文件艾迪
   const db = cloud.database()
   let fileID =''
  // console.log(event.namevalue);
    
     //数据库查询不到该渠道,二维码即是第一次输入
 try {        
   let pathquery =  'pages/show/show?id='+ event.randomnum
  const {buffer} = await cloud.openapi.wxacode.createQRCode({
    path:pathquery,
    width: 430
  })
    // const {buffer} = await cloud.openapi.wxacode.getUnlimited({
    //     scene:'a=12234',
    //     lineColor:{"r":255,"g":0,"b":255}	
    //  //  page:pages/login/login
    //   })

      console.log('222');
      console.log(buffer);
     await db.collection('useinfo').where({
        namevalue:event.namevalue
       }).get().then(res => {   
         console.log(res);
        if(res.data[0]){
          console.log('woyijingcunzaile');
          //在数据库中渠道名称已经存在，返旧的二维码图片
          fileID =res.data[0].fileID
          //console.log("res.data[0]:"+fileID);
          //console.log('res.data');
          return res.data[0].fileID
        } 
      })
      if(fileID == ''){
         //往数据库里添加对应的信息
        console.log("fileID=='':"+fileID);
        let path = event.randomnum+".jpg"
        fileID = await uploadfile(buffer, path)
        db.collection("useinfo").add({
          data:{
            scancode:0,//扫码次数
            introducenum:0,//引流人数
            namevalue:event.namevalue,//渠道名称
            remarksvalue:event.remarksvalue,//备注
            onlyid:event.randomnum, //在用户扫码后用于识别渠道名称
            fileID:fileID, //二维码地址
            date:gettime()
            }
        }).then((res)=>{console.log('添加成功');})
      } 
     
    return fileID
  } catch (err) {
  
    return err
  }

}