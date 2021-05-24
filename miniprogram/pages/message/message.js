let openId = ''
let userArr = []
const db = wx.cloud.database()
const _ = db.command
let p = ''
let arr = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastMessage:[],
    messageUserList:[]
  },

  goSearch(){
    wx.navigateTo({
      url: `/pages/search/search?currentIndex=2`,
    })
  },

  loadmessageList(){
      userArr = []
      for(let it of arr){
        userArr.push(it.userId)
      }
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"messageUserArr",
          userArr
        }
      }).then(res=>{
        console.log(res);
        
        this.setData({
          messageUserList:res.result
        })
      })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync('openId')
    this.loadmessageList()
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
    
    p = new Promise((resolve,rejects)=>{
      wx.cloud.callFunction({
        name:"messageList",
        data:{
          $url:"messageList",
          openId
        }
      }).then(res=>{
        console.log( res);
        arr = res.result.data
        for(let item of arr){
          if(item._openid !== openId){
            let tmp = item.userId
            item.userId = item._openid
            item._openid = tmp
          }
        }
        this.setData({
          lastMessage:arr
        })
        resolve()
    })
  })
  console.log(p);
  p.then(res=>{
    this.loadmessageList()
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