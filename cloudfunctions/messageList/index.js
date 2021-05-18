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
  
  app.router("message",async(ctx,next)=>{
    let messageList = await db.collection("message").where({
      _openid:_.eq(event.openId).or(_.eq(event.userId))
    })
    .get()
    .then(res=>{
      return res
    })
    ctx.body = messageList
  })

  app.router("messageList",async(ctx,next)=>{
    let messageList = db.collection("message").where({
      _openid:event.openId
    }).get()
    .then(res=>{
      return res
    })

    ctx.body = messageList
  })

  return app.serve()
}