// pages/index/index_2.js
var animate1 = wx.createAnimation({
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
var animate2 = wx.createAnimation({
  duration: 1000,
  timingFunction: "ease",
  delay: 500
})
var animate3 = wx.createAnimation({
  duration: 1000,
  timingFunction: "ease",
  delay: 1000
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation1:"",
    animation2: "",
    animation3: "",
    
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
    animate1.translateY(0).scale(1,1).step();
    animate2.translateY(0).scale(1, 1).step();
    animate3.translateY(0).scale(1, 1).step();
    this.setData({
      animation1: animate1.export(),
      animation2: animate2.export(),
      animation3: animate3.export(),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    animate1.translateY(200).scale(0).step({duration:100,delay:0});
    animate2.translateY(200).scale(0).step({ duration: 100,delay:0 });
    animate3.translateY(200).scale(0).step({ duration: 100,delay:0 });
    this.setData({
      animation1: animate1.export(),
      animation2: animate2.export(),
      animation3: animate3.export(),
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(123);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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
  
  },

  //去发布段子
  go_send_forge:function(){
    wx.navigateTo({
      url: '/pages/send_forge/send_forge',
    })
  },
  //去发布视频
  go_send_video: function () {
    // wx.navigateTo({
    //   url: '/pages/send_video/send_video',
    // })

    //选择发布视频
      wx.chooseVideo({
        success: (res) => {
          var path = res.tempFilePath;
          wx.navigateTo({
            url: '/pages/send_video/send_video?path='+path,
          })
        }
      })
    
  },
  //去发布图片
  go_send_pic: function () {
    wx.chooseImage({
      success: (res) => {
        // console.log(res);
        var files_path = res.tempFilePaths;
        
        wx.navigateTo({
          url: '/pages/send_pic/send_pic?paths=' + files_path,
        })
      },
    })
   
  }

})