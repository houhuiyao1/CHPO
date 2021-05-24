const db = wx.cloud.database()
const _ = db.command
let userId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeList:[],
    centerList:[],
    leftList:[],
    app_height:0,
    act_height:0
  },

  loadAppiontmentList(){
    wx.cloud.callFunction({
      name:"appiontment",
      data:{
        $url:"likeList",
        userId,
        start:this.data.leftList.length,
        count:5
      }
    }).then(res=>{
      console.log(res.result.data);
      this.setData({
        leftList:this.data.leftList.concat(res.result.data),
        app_height:res.result.data.length * 315
      })
    })
  },

  loadActiveList(){
    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"likeList",
        userId,
        start:this.data.centerList.length,
        count:5
      }
    }).then(res=>{
      console.log(res);
      this.setData({
        centerList:this.data.centerList.concat(res.result.data),
        act_height:res.result.data.length * 315
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = options.userId
    this.loadAppiontmentList()
    this.loadActiveList()
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