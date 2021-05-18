import formatTime from "../../utils/formatTime"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    appiontmentList:{
      type:Array,
      value:[]
    },
    likeArr:{
      type:Array,
      value:[]
    },
    likeArrcount:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time:'',
    likeUrl:"../../images/icon/like1.png",
    nolikeUrl:"../../images/icon/like.png",

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  goDetail(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/indexDetail/indexDetail?id=${this.data.appiontmentList[index]._id}`,
    })
  },

  // like(e){
  //   let index = e.currentTarget.dataset.index
  //   this.triggerEvent('like',index)
  // }
  }
})
