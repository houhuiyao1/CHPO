let openId = ''
let userArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageUserList:[]
  },

  loadmessageList(){
    wx.cloud.callFunction({
      name:"messageList",
      data:{
        $url:"messageList",
        openId
      }
    }).then(res=>{
      let arr = res.result.data
      for(let it of arr){
        console.log(it.userId);
        userArr.push(it.userId)
      }
      console.log(userArr);
      wx.cloud.callFunction({
        name:"userList",
        data:{
          $url:"messageUserArr",
          userArr
        }
      }).then(res=>{
        console.log(res.result[0].data);
        this.setData({
          messageUserList:res.result[0].data
        })
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