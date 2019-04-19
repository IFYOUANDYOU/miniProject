var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issuccess:false,
    userName:''
  },
  
  //input
  inputbind:function(e){
    var that = this
    var userName = e.detail.value
    var reg = /\s/; 
    // 名字只能为汉字的判断   var hanzi = /[^\u4E00-\u9FA5]/
    if (reg.test(userName)) {
      wx.showModal({
        title: '提示',
        content: '姓名不能含有空格',
        showCancel: false
      })
    } else if (!userName) {
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        showCancel:false
      })
    }else{
      that.setData({
        issuccess:true,
        userName: userName,
      })
    }
  } ,

  beginTest:function(){
    var that = this

    wx.showLoading({
      title: '测试中',
    })
    if (that.data.issuccess){
      wx.setStorageSync('userName', that.data.userName)
      wx.request({
        url: 'https://wx.jiqixing.com/mood/api/activity_qianren',
        method:'POST',
        data: { nickname: that.data.userName, token: wx.getStorageSync('token') },
        success:function(e){    
          if(e.data.code == 0 && wx.getStorageSync('token')){
            wx.hideLoading()
            wx.setStorageSync('imgPath', e.data.path)
            wx.navigateTo({
              url: '/pages/ready3/ready3'
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '网络错误，请稍后重试',
              showCancel:false
            })
          }    
        }
      })
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this 
    app.getUserInfo(function (token) {
      if (token.length > 0) {
        wx.setStorageSync('token', token)
      }
    });
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