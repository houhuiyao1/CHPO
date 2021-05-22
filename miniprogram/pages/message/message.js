let openId = ''
let userArr = []
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
    wx.cloud.callFunction({
      name:"messageList",
      data:{
        $url:"messageList",
        openId
      }
    }).then(res=>{
      console.log( res.result.otherList.data);
      let arr = res.result.messageList.data
      for(let i = 0;i < arr.length;i++){
        arr[i].Message[arr[i].Message.length - 1].createTime = arr[i].Message[arr[i].Message.length - 1].createTime.substring(0,10)
      }     
      this.setData({
        lastMessage:arr
      })
      
      
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
        console.log(res.result);
        this.setData({
          messageUserList:res.result
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