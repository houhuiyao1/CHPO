let openId = ''
let photographId = ""
let userInfo = ''
let moreUserinfo = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    check:["热门","同校"],
    list:[],
    schoollist:[],
    likeArr:[],
    likeCount:[],
    commentCount:[],
    schoollikeArr:[],
    schoollikeCount:[],
    schoolcommentCount:[]
  },

  change(e){
    this.setData({
      currentIndex:e.target.dataset.index
    })
  },

  goDetail(e){
    console.log(e);
    
    wx.navigateTo({
      url: `/pages/appiontmentDetail/appiontmentDetail?id=${e.currentTarget.dataset.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = wx.getStorageSync('userInfo')
    moreUserinfo = wx.getStorageSync('moreUserinfo')
    openId = wx.getStorageSync('openId')
    this.loadList()
    this.loadSchoolList()
  },

  //加载用户详情
  userDetail(e){
    
    wx.navigateTo({
      url: `/pages/user/user?userId=${e.currentTarget.dataset.userid}`,
    })
  },

  loadSchoolPhototgraph(){
    wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"schoolPhotograph",
        school:userInfo.school
      }
    }).then(res =>{

      this.setData({
        schoolPhotograph:res.result.data
      })
    })
  },

  loadPhototgraph(){
    wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"photoGraph"
      }
    }).then(res =>{
      console.log(res);
      
      this.setData({
        photograph:res.result.data
      })
    })
  },

  loadSchoolList(){
    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"schoolActive",
        school:moreUserinfo.school,
        start:this.data.schoollist.length,
        count:10
      }
    }).then(res=>{
      this.setData({
        schoollist:res.result.data
      })
    })
  },

  loadList(){
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"active",
        start:this.data.list.length,
        count:10
      }
    }).then((res)=>{
      console.log(res);
      
      this.setData({
        list:res.result.data
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
  onShow: function () {

    this.loadPhototgraph()
    this.loadSchoolPhototgraph()

    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"active",
        start:0,
        count:this.data.list.length
      }
    }).then((res)=>{
      let listarr = res.result.data
      let likeArr = []
      let likeCount = []
      let commentCount = []
      for(let i = 0;i < listarr.length;i++){
        commentCount.push(listarr[i].comment.length)
        likeCount.push(listarr[i].like.length)
        if(listarr[i].like.indexOf(openId) < 0){
          likeArr.push(false)
        }
        else{
          likeArr.push(true)
        }
      }
      this.setData({
        likeArr,
        likeCount,
        commentCount
      })
    })

    wx.cloud.callFunction({
      name:"active",
      data:{
        $url:"schoolActive",
        start:0,
        count:this.data.schoollist.length
      }
    }).then((res)=>{
      let schoollistarr = res.result.data
      let schoollikeArr = []
      let schoollikeCount = []
      let schoolcommentCount = []
      for(let i = 0;i < schoollistarr.length;i++){
        schoolcommentCount.push(schoollistarr[i].comment.length)
        schoollikeCount.push(schoollistarr[i].like.length)
        if(schoollistarr[i].like.indexOf(openId) < 0){
          schoollikeArr.push(false)
        }
        else{
          schoollikeArr.push(true)
        }
      }
      this.setData({
        schoollikeArr,
        schoollikeCount,
        schoolcommentCount
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