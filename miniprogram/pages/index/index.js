// miniprogram/pages/index/index.js
let openId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appiontmentList:[],
    likeArr:[],
    likeArrcount:[],
    commentCount:[]
  },

  //去搜索页面
  goSearch(){
    wx.navigateTo({
      url: `/pages/search/search?currentIndex=0`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.loadAppiontmentList()
  },


  loadAppiontmentList(start=0,count=4){
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name:'appiontment',
      data:{
        $url:"appiontment",
        start:this.data.appiontmentList.length,
        count:4
      }
    }).then((res)=>{
      let len = res.result.data.length
      for(let i = 0;i < len;i++){
        res.result.data[i].createTime = res.result.data[i].createTime.substring(0,10)
      }     
      this.setData({
        appiontmentList:this.data.appiontmentList.concat(res.result.data)
      })
      wx.hideLoading()
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
  onShow: function (e) {
    openId = wx.getStorageSync('openId')
    wx.cloud.callFunction({
      name:'appiontment',
      data:{
        $url:"appiontment",
        start:0,
        count:this.data.appiontmentList.length
      }
    }).then((res)=>{
      console.log(res);
      
      let arr = res.result.data
      let likeArr= []
      let likeArrcount = []
      let commentCount = []
      for(let i = 0;i < arr.length;i++){
        commentCount.push(arr[i].comment.length)
        res.result.data[i].createTime = res.result.data[i].createTime.substring(0,10)
        likeArrcount.push(arr[i].like.length)
          if(arr[i].like.indexOf(openId) < 0){
            likeArr.push(false)
          }else{
            likeArr.push(true)
          }
      }   
      this.setData({
        likeArr,
        likeArrcount,
        commentCount
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
    this.loadAppiontmentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})