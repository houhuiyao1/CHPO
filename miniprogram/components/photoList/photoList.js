// components/photoList/photoList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0
    },
    likeArr:{
      type:Array,
      value:[]
    },
    likeCount:{
      type:Array,
      value:[]
    },
    commentCount:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    likeUrl:"../../images/icon/like1.png",
    nolikeUrl:"../../images/icon/like.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
