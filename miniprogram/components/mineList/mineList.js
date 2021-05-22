// components/mineList/mineList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myList:{
      type:Array,
      value:[]
    },
    s_leftList:{
      type:Array,
      value:[]
    },
    s_centerList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    app(e){
      wx.navigateTo({
        url: `/pages/indexDetail/indexDetail?id=${e.currentTarget.dataset.id}`,
      })
    },

    act(e){
      wx.navigateTo({
        url: `/pages/appiontmentDetail/appiontmentDetail?id=${e.currentTarget.dataset.id}`,
      })
    }
  }
})
