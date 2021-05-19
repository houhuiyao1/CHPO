const MAX_image = 9
const db = wx.cloud.database()
const MAX_text = 150
let openId = ''
let content = ""
let userInfo = ""
let moreUserinfo = ""
let label = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    check:false,
    tag:true,
    textNums:0,
    imageList:[],
    selectImage:false,
    labelList:[
      {
        name:"毕业季",
        index:0,
        tag:false
      },
      {
        name:"跟拍",
        index:1,
        tag:false
      },
      {
        name:"人像",
        index:2,
        tag:false
      },
      {
        name:"风景",
        index:3,
        tag:false
      }
    ]
  },

  //获取内容
  getContent(e){
    content = e.detail.value  
    this.setData({
      textNums:content.length
    })
  },

  //添加图片
  addImage(){
    let max = MAX_image - this.data.imageList.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success :(res) =>{      
        this.setData({
          imageList:this.data.imageList.concat(res.tempFilePaths),        
        })
        max = MAX_image - this.data.imageList.length
        this.setData({
          selectImage:max <= 0?true:false
        })
      }
    })
  },

  //选择标签
  getlabel(e){
    let item = e.target.dataset.item
    let index = e.target.dataset.index
    
    this.data.labelList[index].tag = !this.data.labelList[index].tag
    this.setData({
      labelList:this.data.labelList
    })
  },

  //删除图片
  delectImage(e){
    this.data.imageList.splice(e.target.dataset.index,1)
    this.setData({
      imageList:this.data.imageList
    })
    if(this.data.imageList.length < MAX_image){
      this.setData({
        selectImage:false
      })
    }
  },

  //预览图片
  previewImage(e){
    wx.previewImage({
      urls: this.data.imageList,
      current:e.target.dataset.imagesrc
    })
  },

  addContent(e){
    if(content == ""){
      wx.showToast({
        title: '请输入内容',
        icon:"none"
      })
      return
    }
    if(this.data.imageList.length === 0){
      wx.showToast({
        title: '请选择图片',
        icon:"none"
      })
      return
    }

    label = []
    for(let it of this.data.labelList){
      it.tag === true?label.push(it.name):""
    }
    
    if(this.data.tag){
      this.setData({
        check:true
      })

      wx.showLoading({
        title: '正在发送',
        icon:"none"
      })

    let promiseArr = []
    let fileId = []
    for(let i = 0,len = this.data.imageList.length;i < len;i++){
      let p = new Promise((resolve,reject) => {
      let item = this.data.imageList[i]
      let suffix = /\.\w+$/.exec(item)[0]
      wx.cloud.uploadFile({
        cloudPath:`active/${Date.now()}-${Math.random()*1000}${suffix}`,
        filePath:item,
        success:(res)=>{ 
          fileId=fileId.concat(res.fileID)
          resolve()
        },
        fail:(err)=>{
          console.log(err); 
          reject()
        }
      })
      })
      promiseArr.push(p)      
    }
    Promise.all(promiseArr).then((res) => {
      db.collection('appiontment').add({
        data:{
          userInfo:userInfo,
          moreUserinfo,
          content,
          img:fileId,
          createTime:db.serverDate(),
          like:[],
          comment:[],
          label,
          islike:false
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
    }else if(!this.data.tag){
      this.setData({
        check:true
      })

      wx.showLoading({
        title: '正在发送',
        icon:"none"
      })

    let promiseArr = []
    let fileId = []
    for(let i = 0,len = this.data.imageList.length;i < len;i++){
      let p = new Promise((resolve,reject) => {
      let item = this.data.imageList[i]
      let suffix = /\.\w+$/.exec(item)[0]
      wx.cloud.uploadFile({
        cloudPath:`active/${Date.now()}-${Math.random()*1000}${suffix}`,
        filePath:item,
        success:(res)=>{
          fileId=fileId.concat(res.fileID)
          resolve()
        },
        fail:(err)=>{
          console.log(err); 
          reject()
        }
      })
      })
      promiseArr.push(p)      
    }
    Promise.all(promiseArr).then((res) => {
      db.collection('active').add({
        data:{
          userInfo:userInfo,
          moreUserinfo,
          content,
          img:fileId,
          createTime:db.serverDate(),
          like:[],
          comment:[],
          label,
          islike:false
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.reLaunch({
          url: '/pages/mphoto/mphoto'
        })
      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
          icon:'fail'
        })
      })
    })
    }
    
  },

  dongtai(){
    this.setData({
      tag:true
    })
  },

  yuepai(){
    this.setData({
      tag:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    openId = wx.getStorageSync('openId')
    userInfo = wx.getStorageSync('userInfo')
    moreUserinfo = wx.getStorageSync('moreUserinfo')
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