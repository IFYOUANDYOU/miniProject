// pages/sign_ok/sign_ok.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_img:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sign_img:wx.getStorageSync("img")
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
    return{
      title:"坚持每天签到，走上人生巅峰",
      path:"/pages/home/home"
    }
  },
  //保存图片
  save:function(){
    wx.showLoading({
      title: '正在保存至相册...',
    })
    wx.downloadFile({
      url: this.data.sign_img,
      success: function (pp) {
        if (pp.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: pp.tempFilePath,
            success:(res)=>{
              wx.hideLoading();
              wx.showToast({
                title: '保存成功！',
              })
            }
          })
        }
      }
    })
  }
  
})