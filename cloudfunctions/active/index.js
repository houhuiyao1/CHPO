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

  //获取点赞内容
  app.router("likeList",async(ctx,next)=>{
    let likeList = await db.collection("active").where({
      like:_.in([event.userId])
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy("createTime","desc")
    .get()
    .then(res=>{
      return res
    })
    ctx.body = likeList
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

  //获取搜索内容
  app.router("searchActive",async(ctx,next)=>{
    let searchList = await db.collection("active").where(
      _.or([
        {
          moreUserinfo:{
            school:db.RegExp({
              regexp:'.*' +event.content,
              option:'i'
            })
          }
        },
        {
          moreUserinfo:{
            status:_.eq(event.content)
          }
        },
        {
          userInfo:{
            nickName:db.RegExp({
              regexp:'.*' +event.content,
              option:'i'
            })
          }
        },
        {
          content:db.RegExp({
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

  app.router("delectActive",async(ctx,next)=>[
    await db.collection("active").where({
      _id:event.id
    }).remove()
  ])

  return app.serve()

}