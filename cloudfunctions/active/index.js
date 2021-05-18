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

  app.router("active",async(ctx,next)=>{
    let activeList = await db.collection("active")
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res) => {
      return res
    })

    ctx.body = activeList
  })

  app.router("schoolActive",async(ctx,next)=>{
    let schoolActiveList = await db.collection("active")
    .where({
      moreUserinfo:{
        school:event.school
      }
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res) => {
      return res
    })
    ctx.body = schoolActiveList
  })

  app.router('activeDetail',async(ctx,next)=>{
    let activeDetail = await db.collection("active")
    .where({_id:event.id})
    .get()
    .then((res) => {
      return res
    })
   
    ctx.body = {
      activeDetail
    }
  })

  

  app.router('activeLike',async(ctx,next)=>{
    db.collection('active').where({
      _id:event.activeId
    }).update({
      data:{
        like:_.push(event.openId),
        islike:true
      }
    })
  })

  app.router('activeNoLike',async(ctx,next)=>{
    db.collection('active').where({
      _id:event.activeId
    }).update({
      data:{
        like:event.islikeArr,
        islike:false
      }
    })
  })

  return app.serve()

}