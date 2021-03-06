const db = wx.cloud.database()
const _ = db.command
let userInfo = ''
let moreUserinfo = ''
let openId = ''
let id = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    list:[],
    talkHeadphoto:"",
    nolikeUrl:"../../images/icon/like.png",
    likeUrl:"../../images/icon/like1.png",
    islike:false,
    islikeArr:[],
    animation:'',
    black:'',
    talkHeadphoto:'../../images/icon/noLogin.png'
  },

  //预览图片
  previewImage(e){
    wx.previewImage({
      urls: this.data.list[0].img,
      current:e.target.dataset.imagesrc
    })
  },

  //到用户详情页
    goUserDetail(e){
      wx.navigateTo({
        url: `/pages/user/user?userId=${e.currentTarget.dataset.userid}`,
      })
    },

  //点赞
  islike(){
    if(openId == ''){
      this.setData({
        animation:'animation',
        black:'black'
      })
      return
    }

    this.setData({
      islike:!this.data.islike
    })

    let like = this.data.islike
    if(like){
      wx.cloud.callFunction({
        name:"appiontment",
        data:{
          $url:"appiontmentLike",
          openId,
          appiontmentId:this.data.id
        }
      })
    }else if(!like){
      for(let i = 0;i < this.data.islikeArr.length;i++){
        if(this.data.islikeArr[i] === openId){
          this.data.islikeArr.splice(i,1)
          this.setData({
            islikeArr:this.data.islikeArr
          })
        }
      }
      wx.cloud.callFunction({
        name:"appiontment",
        data:{
          $url:"appiontmentNoLike",
          islikeArr:this.data.islikeArr,
          appiontmentId:this.data.id
        }
      })
    }

  },

  //删除此列表
  delectDetail(e){
    wx.showModal({
      title: '是否要删除',
      icon:"none",
      success:(res)=>{
        if (res.confirm) {
          wx.cloud.callFunction({
            name:"appiontment",
            data:{
              $url:"delectAppiontment",
              id:e.currentTarget.dataset.id
            }
          })
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail:()=>{
        // wx.hideToast()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = wx.getStorageSync('userInfo')
    moreUserinfo = wx.getStorageSync('moreUserinfo')
    openId = wx.getStorageSync('openId')
    id = options.id
    this.setData({
      openId
    })
    //展示内容
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
     name:"appiontment",
     data:{
       $url:"appiontmentDetail",
       id:options.id,
       userInfo,
       moreUserinfo,
       openId
     }
    }).then((res)=>{
      console.log(res);
      
      let len = res.result.data[0].comment.length
      for(let i = 0;i < len;i++){
        res.result.data[0].comment[i].createTime = res.result.data[0].comment[i].createTime.substring(0,10)
      }
      this.setData({
        list:res.result.data,
        commentList:res.result.data.comment,
        id:options.id,
        islikeArr:res.result.data[0].like,
        talkHeadphoto:userInfo.avatarUrl
      })
      wx.hideLoading()
      for(let j = 0;j< this.data.islikeArr.length;j++){
        if(this.data.islikeArr[j] === openId){
          this.setData({
            islike:true
          })
          return
        }else{
          this.setData({
            islike:false
          })
        }
      }
    })
  },

  send(e){
    if(openId == ''){
      this.setData({
        animation:'animation',
        black:'black'
      })
      return
    }

    wx.showLoading({
      title: '正在发送',
    })
    db.collection("appiontment")
    .where({_id:id})
    .update({
      data:{
        comment:_.unshift({
          activeId:id,
          openId:openId,
          comment:e.detail.value,
          userInfo:userInfo,
          moreUserinfo:moreUserinfo,
          createTime:db.serverDate()
        })
      }
    })

    wx.cloud.callFunction({
      name:"appiontment",
      data:{
        $url:"appiontmentDetail",
        id
      }
    }).then((res)=>{
      console.log(res);     
      let arr = res.result.data[0].comment
       for(let i = 0;i < arr.length;i++){
         arr[i].createTime = arr[i].createTime.substring(0,10)
       }
      this.setData({
        list:res.result.data,
        talkHeadphoto:userInfo.avatarUrl,
        value:""
      })
      wx.hideLoading()
      wx.showToast({
        title: '评论成功',
        icon:"none"
      })
    })

  },

  delect(){
    this.setData({
      animation:'',
      black:''
    })
  },

  getUserinfo(e){
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {   
        const userInfo = res.userInfo
        wx.setStorageSync('userInfo', userInfo)

        const province = wx.getStorageSync('province')
        const city = wx.getStorageSync('city')
        this.setData({
          userInfo,
          animation:'',
          black:''
        })
        this.goLogin()

        //向数据库增添用户
      wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"getUserinfo",
        nickName:this.data.userInfo.nickName,
        avatarUrl:this.data.userInfo.avatarUrl,
        province,
        city
      }
      }).then(res => {
        wx.setStorageSync('openId', res.result.data.openId)
        openId = wx.getStorageSync('openId')
        this.onReady()
      })
      }
    })
  },

  //完善资料
  goLogin(){
    const headphoto = this.data.userInfo.avatarUrl
    const name = this.data.userInfo.nickName
    wx.navigateTo({
    url: `/pages/login/login?nickName=${name}&photo=${headphoto}`
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // let pages = getCurrentPages()
    // let prepage = pages[pages.length - 2]
    // prepage.onPullDownRefresh()
  //   wx.reLaunch({
  //     url: '/pages/index/index',
  //   })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})