// miniprogram/pages/me/me.js
let openId = ""
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    moreUserinfo:{},
    myList:[]
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
console.log(openId);

    wx.cloud.callFunction({
      name:"appiontment",
      data:{
        $url:"myAppiontment",
        openId,
        start:this.data.myList.length,
        count:10
      }
    }).then(res=>{
      console.log(res);
      this.setData({
        myList:this.data.myList.concat(res.result.data)
      })
    })
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