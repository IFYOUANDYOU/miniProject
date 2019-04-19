// pages/new_page/new_page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      praise_change:0,
      collect_change:0,
      
  },

  //点赞
  click_praise:function(){
    var that = this
    var praise_change = that.data.praise_change
    if (praise_change == 0) {
        that.setData({
            praise_change: 1
        })
        wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1500
        })
    } else {
        that.setData({
            praise_change: 0
        })
        wx.showToast({
            title: '取消点赞',
            icon: 'loading',
            duration: 1500
        })
    }  
    
  },
  //收藏
  click_collect: function () {
      var that = this
      var collect_change = that.data.collect_change
      if (collect_change == 0){
        that.setData({
            collect_change: 1
        })
        wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1500
        })
      }else{
        that.setData({
            collect_change: 0
        })
        wx.showToast({
            title: '取消收藏',
            icon: 'loading',
            duration: 1500
        })
      }
      
  },
  //支付
  click_pay:function(){
      wx.showModal({
          title: '提示',
          content: '支付功能暂未开放',
          showCancel:false
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})