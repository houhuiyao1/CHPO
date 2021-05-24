let userId = ''
let openId = ''
const db = wx.cloud.database()
const _ = db.command
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
    like:[]
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

  
  follow(e){
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

  goMessage(e){

    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?userId=${e.target.dataset.userid}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = options.userId
    openId = wx.getStorageSync('openId')
    db.collection("userlist").where({
      openid:userId
    })
    .get()
    .then(res =>{
      this.setData({
        userList:res.data[0],
        beFollowArr:res.data[0].beFollow
      })
    })

    db.collection("userlist").where({
      openid:openId
    })
    .get()
    .then(res =>{
      console.log(res);
      
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
        console.log(snapshot.docs);
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
        console.log(snapshot.docs);
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