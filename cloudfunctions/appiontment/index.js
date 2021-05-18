// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')

cloud.init('sandjk-4gpikkhgf73578d0')
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event
  })

  app.router("appiontment",async(ctx,next)=>{
    let appiontmentList = await db.collection("appiontment")
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res) => {
      return res
    })
    ctx.body = appiontmentList
  })

  app.router('appiontmentDetail',async(ctx,next)=>{
    let appiontmentDetail = await db.collection("appiontment")
    .where({_id:event.id})
    .get()
    .then((res) => {
      return res
    })
    //评论查询
    const appiontmentCount = await db.collection("appiontmentComment").count()
    const total = appiontmentCount.total
    let commentList = {
      data:[]
    }
    if(total > 0){
      const batchTimes = Math.ceil(total/100)
      console.log(batchTimes);
      
      const tasks = []
      for(let i = 0;i<batchTimes;i++){
        let promise = db.collection("appiontmentComment").skip(i*100).limit(100)
        .where({
          appiontmentId:event.id
        })
        .orderBy('createTime','desc')
        .get()
        tasks.push(promise)
      } 
      if(tasks.length > 0){
        commentList =  (await Promise.all(tasks)).reduce((acc,cur)=>{
          return {
            data:acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      appiontmentDetail,
      commentList
    }
  })

  app.router("myAppiontment",async(ctx,next)=>{
    let myAppiontmentList = await db.collection("appiontment")
    .where({
      _openid:event.openId,
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res
    })

    ctx.body = myAppiontmentList
  })

  app.router('appiontmentLike',async(ctx,next)=>{
    db.collection('appiontment').where({
      _id:event.appiontmentId
    }).update({
      data:{
        like:_.push(event.openId),
        islike:true
      }
    })
  })

  app.router('appiontmentNoLike',async(ctx,next)=>{
    db.collection('appiontment').where({
      _id:event.appiontmentId
    }).update({
      data:{
        like:event.islikeArr,
        islike:false
      }
    })
  })

  return app.serve()

}