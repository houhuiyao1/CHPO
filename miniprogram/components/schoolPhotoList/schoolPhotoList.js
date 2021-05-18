// components/photoList/photoList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    schoollist:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0
    },
    schoollikeArr:{
      type:Array,
      value:[]
    },
    schoollikeCount:{
      type:Array,
      value:[]
    },
    schoolcommentCount:{
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
