// pages/login/login.js
const MAX_num = 50
let openId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    array: ['模特', '摄影师'],
    index:0,
    status:"",
    school:"",
    introduce:"",
    length:0
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    this.setData({
      status:this.data.array[this.data.index]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync('openId')
    this.setData({
      userInfo:options
    })
  },

  getschool(e){
    this.setData({
      school:e.detail.value
    })
  },

  getintroduce(e){
    this.setData({
      introduce:e.detail.value,
      length:e.detail.value.length
    })
  },

  finish(){
    let m = this.data

    if(m.status == ""){
      wx.showToast({
        icon:"none",
        title: '请选择你的身份',
      })
    }else if(m.school == ""){
      wx.showToast({
        icon:"none",
        title: '请输入学校',
      })
    }else if(m.introduce == ""){
      wx.showToast({
        icon:"none",
        title: '介绍一下自己吧~',
      })
    }else{
    const moreUserinfo = {"status":m.status,"school":m.school,"introduce":m.introduce}
    wx.setStorageSync('moreUserinfo', moreUserinfo)
    var nickName = wx.getStorageSync('userInfo').nickName

    this.setData({
      nickName
    })

    wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"moreUserinfo",
        openId,
        "status":m.status,
        "school":m.school,
        "introduce":m.introduce
      }
    })

    wx.navigateBack({
      delta: 1,
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