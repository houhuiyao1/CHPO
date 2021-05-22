Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    choose:["动态","约拍","用户"],
    content:"",
    leftList:[],
    centerList:[],
    rightList:[]
  },

  //获取输入内容
  getInput(e){
    console.log(e.detail.value);
    this.setData({
      content:e.detail.value
    })
  },

  //发送
  send(){
    
    wx.cloud.callFunction({
      name:"appiontment",
      data:{
        $url:"searchAppiontment",
        content:this.data.content
      }
    }).then(res=>{
      this.setData({
        leftList:res.result.data
      })
    })

    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"searchActive",
        content:this.data.content
      }
    }).then(res=>{
      this.setData({
        centerList:res.result.data
      })
    })

    wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"searchUserlist",
        content:this.data.content
      }
    }).then(res=>{
      this.setData({
        rightList:res.result.data
      })
    })

  },

  //选择搜索标签
  choose(e){
    this.setData({
      currentIndex:e.currentTarget.dataset.num
    })
  },

  changeCur(e){
    this.setData({
      currentIndex:e.detail.current
    })
  },

  back(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentIndex:options.currentIndex
    })
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