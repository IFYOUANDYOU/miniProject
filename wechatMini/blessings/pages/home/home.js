// pages/home/home.js
var app = getApp();
var base_url = app.globalData.base_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo(function (token) {
      // console.log(token)
      wx.setStorageSync('token', token)
      // app.getUserInfo()
    });

    wx.request({
      url: base_url+ "/index/api/config",
      method:"GET",
      success:(res)=>{
        // console.log(res);
        this.setData(
          {
            show:res.data.status==1?true:false
          }
        )
      }
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