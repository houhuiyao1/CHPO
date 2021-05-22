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

  app.use(async(ctx,next) => {
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    ctx.body = {
      data:ctx.data
    }
    await next()
  })

  app.router("loadUserinfo",async(ctx,next)=>{
    let userList = await db.collection("userlist")
    .where({
      openid:event.userId
    })
    .get()
    .then(res=>{
      return res
    })
    ctx.body = userList
  })

  app.router('getUserinfo',async(ctx,next) => {
    await db.collection("userlist").add({
      data:{
        "nickName":event.nickName,
        "avatarUrl":event.avatarUrl,
        "openid": event.userInfo.openId
      }
    })
  })

  app.router('moreUserinfo',async(ctx,next) => {
    await db.collection("userlist").where({
      openid:event.openId
    }).update({
      data:{
        "status":event.status,
        "school":event.school,
        "introduce":event.introduce,
        "follow":[],
        "beFollow":[],
      }
    })
  })

  app.router("photoGraph",async(ctx,next)=>{
    let photographList = await db.collection("userlist")
    .where({
        status:"摄影师"
    })
    .get()
    .then(res=>{
     return res
    })

    ctx.body = photographList
  })

  app.router("schoolPhotograph",async(ctx,next)=>{
    let schoolPhotographList = await db.collection("userlist")
    .where({
        status:"摄影师",
        school:event.school
    })
    .get()
    .then(res=>{
     return res
    })

    ctx.body = schoolPhotographList
  })
  
  //取消关注
  app.router("nofollowUserlist",async(ctx,next)=>{
    await db.collection("userlist")
    .where({
      openid:event.openId
    })
    .update({
      data:{
        follow:event.followArr
      }
    })
  })
  //关注
  app.router("followUserlist",async(ctx,next)=>{
    await db.collection("userlist")
    .where({
      openid:event.openId
    })
    .update({
      data:{
        follow:_.push(event.userId)
      }
    })
  })
//被关注
  app.router("befollowUserlist",async(ctx,next)=>{
    await db.collection("userlist")
    .where({
      openid:event.userId
    })
    .update({
      data:{
        beFollow:_.push(event.openId)
      }
    })
  })
  //取消被关注
*-  app.router("nobefollowUserlist",async(ctx,next)=>{
    await db.collection("userlist")
    .where({
      openid:event.userId
    })
    .update({
      data:{
        beFollow:event.beFollowArr
      }
    })
  })

  //加载消息列表用户信息
  app.router("messageUserArr",async(ctx,next)=>{
    const UserArr = event.userArr
    let messageUserArr = []
    for(let i = 0;i < UserArr.length;i++){
      let list = await db.collection("userlist").where({
        openid:UserArr[i]
      })
      .get()
      .then(res=>{
        return res
      })
      messageUserArr.push(list)
    }

    ctx.body = messageUserArr
  })

  app.router("getUserList",async(ctx,next)=>{
    let uList = []
    let userArr = event.userList
    for(let j = 0;j < userArr.length;j++){
      let t = await db.collection("userlist").where({
        openid:userArr[j]
      })
      .get()
      .then(res =>{
        return res
      })
      uList.push(t)
    }

    ctx.body = uList
  })

  //获取搜索内容
  app.router("searchUserlist",async(ctx,next)=>{
    let searchList = await db.collection("userlist").where(
      _.or([
        {
            school:db.RegExp({
              regexp:'.*' +event.content,
              option:'i'
            })
        },
        {
            status:_.eq(event.content)
        },
        {
            nickName:db.RegExp({
              regexp:'.*' +event.content,
              option:'i'
            })
        }
      ])
    )
    .get()
    .then(res=>{
      return res
    })

    ctx.body = searchList
  })

  return app.serve()

}