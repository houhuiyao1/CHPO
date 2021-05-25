let openId = ""
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
let num = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    check:["动态","约拍"],
    userInfo:[],
    moreUserinfo:{},
    myList:[],
    rigthList:[],
    follow:[],
    beFollow:[],
    like:[],
    num:0
  },

  //查看点赞的人
  goLike(){
    wx.navigateTo({
      url: `/pages/like/like?userId=${wx.getStorageSync('openId')}`,
    })
  },

  //点击切换
  change(e){
    this.setData({
      currentIndex:e.target.dataset.index
    })
  },

  //滑动切换
  curChange(e){
    this.setData({
      currentIndex:e.detail.current
    })
  },
  
  //查看关注用户列表
  goFollowList(e){
    wx.navigateTo({
      url: `/pages/userList/userList?list=${e.currentTarget.dataset.follow}`,
    })
  },

  //查看被关注用户列表
  gobeFollowList(e){
    wx.navigateTo({
      url: `/pages/userList/userList?list=${e.currentTarget.dataset.befollow}`,
    })
  },

  getUserinfo(e){
  wx.getUserProfile({
    desc: '获取用户信息',
    success: (res) => {   
      const userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo)
      this.setData({
        userInfo
      })

      //向数据库增添用户
    wx.cloud.callFunction({
    name:"userList",
    data:{
      $url:"getUserinfo",
      nickName:this.data.userInfo.nickName,
      avatarUrl:this.data.userInfo.avatarUrl
    }
    }).then(res => {
      wx.setStorageSync('openId', res.result.data.openId)
      openId = wx.getStorageSync('openId')
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userInfo')
    openId = wx.getStorageSync('openId')
    if(userinfo !== ""){
      this.setData({
        userInfo:userinfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    db.collection("active").where({
      _openid:openId
    })
    .orderBy("createTime","desc")
    .watch({
      onChange: (snapshot)=> {
        this.setData({
          rightList:snapshot.docs
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

    db.collection("appiontment").where({
      _openid:openId
    })
    .orderBy("createTime","desc")
    .watch({
      onChange: (snapshot)=> {
        console.log(snapshot);
        
        this.setData({
          myList:snapshot.docs
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

    db.collection("userlist").where({
      openid:openId
    })
    .orderBy("createTime","desc")
    .watch({
      onChange: (snapshot)=> {
        let foo = snapshot.docs[0]
        this.setData({
          follow:foo.follow,
          beFollow:foo.beFollow
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

    new Promise((resolve,reject)=>{
      db.collection("appiontment").where({
        like:_.in([openId])
      }).watch({
        onChange: (snapshot)=> {
          console.log(snapshot.docs.length);
          num = 0
          num=num+snapshot.docs.length
          resolve()
        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })
    }).then(res=>{
      db.collection("active").where({
        like:_.in([openId])
      }).watch({
        onChange: (snapshot)=> {
          console.log(snapshot.docs.length);
          num=num+snapshot.docs.length
          this.setData({
            num
          })
        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })
    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var moreUserinfo = wx.getStorageSync('moreUserinfo')
    if(moreUserinfo !== ""){
      this.setData({
        moreUserinfo
      })
    }

    // wx.cloud.callFunction({
    //   name:"appiontment",
    //   data:{
    //     $url:"myAppiontment",
    //     openId,
    //     start:this.data.myList.length,
    //     count:10
    //   }
    // }).then(res=>{
    //   console.log(res);
    //   this.setData({
    //     myList:this.data.myList.concat(res.result.data)
    //   })
    // })
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