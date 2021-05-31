const db = wx.cloud.database()
const _ = db.command
let userInfo = ''
let moreUserinfo = ''
let openId = ''
let id = ''
let comment = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:comment,
    likeUrl:"../../images/icon/like1.png",
    nolikeUrl:"../../images/icon/like.png",
    islike:false,
    islikeArr:[],
    talkHeadphoto:"../../images/icon/noLogin.png",
    animation:'',
    black:''
  },

  //预览图片
  previewImage(e){
    wx.previewImage({
      urls: this.data.list[0].img,
      current:e.target.dataset.imagesrc
    })
  },

  //加载用户详情
  userDetail(e){
    wx.navigateTo({
      url: `/pages/user/user?userId=${e.currentTarget.dataset.userid}`,
    })
  },
  
  delect(){
    this.setData({
      animation:'',
      black:''
    })
  },

  islike(){
    if(openId == ''){
      this.setData({
        animation:'animation',
        black:'black'
      })
      return
    }

    this.setData({
      islike:!this.data.islike,
    })

    let like = this.data.islike
    if(like){
      wx.cloud.callFunction({
        name:"active",
        data:{
          $url:"activeLike",
          openId,
          activeId:id
        }
      })
    }else if(!like){
      for(let i = 0;i < this.data.list[0].like.length;i++){
        if(this.data.list[0].like[i] === openId){
          this.data.list[0].like.splice(i,1)
          this.setData({
            islikeArr:this.data.list[0].like
          })
        }
      }
      wx.cloud.callFunction({
        name:"active",
        data:{
          $url:"activeNoLike",
          islikeArr:this.data.islikeArr,
          activeId:id
        }
      })
    }

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

  //评论
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
    db.collection("active")
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
      name:"active",
      data:{
        $url:"activeDetail",
        id
      }
    }).then((res)=>{
      console.log(res);     
      let arr = res.result.activeDetail.data[0].comment
       for(let i = 0;i < arr.length;i++){
         arr[i].createTime = arr[i].createTime.substring(0,10)
       }
      this.setData({
        list:res.result.activeDetail.data,
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

  loadDetail(){
    wx.showLoading({
      title:"加载中"
    })
    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"activeDetail",
        id
      }
    }).then((res)=>{    
      console.log(res);
      
      let arr = res.result.activeDetail.data[0].comment
       for(let i = 0;i < arr.length;i++){
         arr[i].createTime = arr[i].createTime.substring(0,10)
       }

      let arrLike = res.result.activeDetail.data[0].like
      for(let j = 0;j< arrLike.length;j++){
        if(arrLike[j] === openId){
          this.setData({
            islike:true
          })
          break
        }else{
          this.setData({
            islike:false
          })
        }
      }

      this.setData({
        list:res.result.activeDetail.data,
        talkHeadphoto:userInfo.avatarUrl,
      })

      wx.hideLoading()
    })
  },

  //删除此列表
  delectDetail(e){
    wx.showModal({
      title: '是否要删除',
      icon:"none",
      success:(res)=>{
        if (res.confirm) {
          wx.cloud.callFunction({
            name:"active",
            data:{
              $url:"delectActive",
              id:e.currentTarget.dataset.id
            }
          })
          wx.reLaunch({
            url: '/pages/mphoto/mphoto',
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
    this.loadDetail()

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