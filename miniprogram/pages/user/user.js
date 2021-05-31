let userId = ''
let openId = ''
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
    userList:[],
    isfollow:false,
    nofollowUrl:"../../images/icon/follow(1).png",
    followUrl:"../../images/icon/follow(2).png",
    followArr:[],
    beFollowArr:[],
    follow:[],
    beFollow:[],
    like:[],
    backgroundImg:"../../images/one.jpg",
    animation:'',
    black:'',
    num : 0
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

  delect(){
    this.setData({
      animation:'',
      black:''
    })
  },
  
  follow(e){
    if(openId == ''){
      this.setData({
        animation:'animation',
        black:'black'
      })
      return
    }

    if(this.data.isfollow){
      this.setData({
        isfollow:!this.data.isfollow
      })
      
      let arr = this.data.followArr
      for(let i = 0;i< arr.length;i++){
        if(arr[i] === userId){
          arr.splice(i,1)
          this.setData({
            followArr:arr
          })
        }
      }
      //取消关注
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"nofollowUserlist",
          followArr:this.data.followArr,
          openId
        }
      })

      let bearr = this.data.beFollowArr
      for(let i = 0;i< bearr.length;i++){
        if(bearr[i] === openId){
          bearr.splice(i,1)
          this.setData({
            beFollowArr:bearr
          })
        }
      }

      //取消被关注
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"nobefollowUserlist",
          beFollowArr:bearr,
          userId
        }
      })

    }else if(!this.data.isfollow){
      this.data.followArr.push(userId)
      this.data.beFollowArr.push(openId)
      
      this.setData({
        isfollow:!this.data.isfollow,
        followArr:this.data.followArr,
        beFollowArr:this.data.beFollowArr
      })

      //关注
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"followUserlist",
          userId,
          openId
        }
      })

      //被关注
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"befollowUserlist",
          userId,
          openId
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

   //查看点赞的人
   goLike(){
    wx.navigateTo({
      url: `/pages/like/like?userId=${userId}`,
    })
  },

  goMessage(e){
    if(openId == ''){
      this.setData({
        animation:'animation',
        black:'black'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?userId=${e.target.dataset.userid}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.userId);
    
    userId = options.userId
    openId = wx.getStorageSync('openId')
    db.collection("userlist").where({
      openid:userId
    })
    .get()
    .then(res =>{
      this.setData({
        userList:res.data[0],
        backgroundImg:res.data[0].backgroundImg,
        beFollowArr:res.data[0].beFollow,
        backgroundImg:res.data[0].backgroundImg
      })
    })

    db.collection("userlist").where({
      openid:openId
    })
    .get()
    .then(res =>{
      if(res.data[0].follow.indexOf(userId) < 0){
        this.setData({
          followArr:res.data[0].follow,
          isfollow:false
        })
      }else{
        this.setData({
          followArr:res.data[0].follow,
          isfollow:true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    db.collection("active").where({
      _openid:userId
    }).watch({
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
      _openid:userId
    }).watch({
      onChange: (snapshot)=> {
        this.setData({
          myList:snapshot.docs
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

    db.collection("userlist").where({
      openid:userId
    }).watch({
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
        like:_.in([userId])
      }).watch({
        onChange: (snapshot)=> {
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
        like:_.in([userId])
      }).watch({
        onChange: (snapshot)=> {
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