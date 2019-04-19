
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath:'',
    tanchukuangBox:true
  },

  backHome:function(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  cancel:function(){
    var that = this
    that.setData({
      tanchukuangBox:true
    })
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  prewImg:function(){
    var that = this
    var imgPath = wx.getStorageSync('imgPath')
    var path = imgPath
    that.setData({
      tanchukuangBox: false
    })
    
    wx.downloadFile({
      url: path , //仅为示例，并非真实的资源
      success: function (res) {
        console.log(res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(rs) {
              
            },
            fail:function(e){
              console.log(e)
            }
          })
        }
      }
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
  onShow: function (option) {
    var that = this
    var useName = wx.getStorageSync('userName')
    that.setData({
      imgPath: wx.getStorageSync('imgPath')
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: ' 分享给',
      path: '/pages/ready3/ready3',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          success:function(){
            var setTimeo = setTimeout(function(){
              wx.switchTab({
                url: '/pages/home/home'
              })
            },1500)   
          }
        })
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  
})