let userInfo = ''
let moreUserinfo = ''
let openId = ''
let userId = ''
let messageId = ''
let content = ''
const db = wx.cloud.database()
const _ = db.command
let fileId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    messageList:[],
    toView:0,
    sendHeight:0,
    img:''
  },

  //点击输入框
  foucs(e){
    console.log(e.detail.height);
    this.setData({
      sendHeight:e.detail.height + 300,
      scrollHeight:`calc(100vh - 240rpx - 55rpx - ${e.detail.height + 300}rpx)`
    })
  },

  //发送后
  blur(e){
    this.setData({
      sendHeight:0,
      scrollHeight:`height: calc(100vh - 240rpx - 55rpx)`
    })
  },

//返回
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },

//创建聊天
  loadMessage(){
    wx.cloud.callFunction({
      name:"messageList",
      data:{
        $url:"message",
        openId,
        userId
      }
    }).then(res=>{
      console.log(res);
      
      this.setData({
        allMessage:res.result.data
      })
      let arr = this.data.allMessage
      if(arr.length === 0){
        wx.cloud.database().collection("message")
          .add({
            data:{
              Message:[],
              userId,
            }}
          )
      }else{
        for(let i = 0;i<=arr.length;i++){
          if(arr[i]._openid === openId && arr[i].userId === userId || arr[i]._openid === userId && arr[i].userId === openId){
            return
          }else{
          wx.cloud.database().collection("message")
            .add({
              data:{
              Message:[],
              userId,
              }}
            )
          }
        }
      }
    })
  },
 
  //获取聊天对象信息
  loadUserinfo(){
    wx.cloud.callFunction({
      name:"userList",
      data:{
        $url:"loadUserinfo",
        userId
      }
    }).then(res=>{
      this.setData({
        leftUserinfo:res.result.data[0]
      })
    })
  },

  //发送消息
  send(e){
    content = e.detail.value
    this.setData({
      content:""
    })

    db.collection("message")
      .where({
        _openid:_.eq(openId).or(_.eq(userId)),
        userId:_.eq(openId).or(_.eq(userId))
      })
      .update({
        data:{
          Message:_.push({
            openId,
            userInfo,
            content,
            createTime:db.serverDate(),
            type:"text"
          })
        }
      })
  },

  //发送图片
  sendImage(e){
    let p = new Promise((resolve,reject)=>{
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success :(res) =>{      
          console.log(res.tempFilePaths);
          this.setData({
            img:res.tempFilePaths[0]
          })
          resolve()
        }
      })
    })

    p.then(res=>{
      let item = this.data.img
      let suffix = /\.\w+$/.exec(item)
      wx.cloud.uploadFile({
        cloudPath:`active/${Date.now()}-${Math.random()*1000}${suffix}`,
        filePath:item,
        success:(res)=>{ 
          fileId=res.fileID
          console.log(fileId);
          db.collection("message")
          .where({
            _openid:_.eq(openId).or(_.eq(userId)),
            userId:_.eq(openId).or(_.eq(userId))
          })
          .update({
            data:{
              Message:_.push({
                openId,
                userInfo,
                content:fileId,
                createTime:db.serverDate(),
                type:"image"
              })
            }
          })
        },
        fail:(err)=>{
          console.log(err); 
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    userInfo = wx.getStorageSync('userInfo')
    moreUserinfo = wx.getStorageSync('moreUserinfo')
    openId = wx.getStorageSync('openId')
    userId = options.userId
    this.setData({
      openId,
      userId
    })

    this.loadMessage()
    this.loadUserinfo()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let watch = db.collection('message')
    .where({
      _openid:_.eq(openId).or(_.eq(userId)),
      userId:_.eq(openId).or(_.eq(userId))
    })
    .watch({
      onChange: (snapshot)=> {
        console.log(snapshot.docs[0].Message);
        
        this.setData({
          messageList:snapshot.docs[0].Message,
          toView: 'msg_' + (snapshot.docs[0].Message.length - 1)
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
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