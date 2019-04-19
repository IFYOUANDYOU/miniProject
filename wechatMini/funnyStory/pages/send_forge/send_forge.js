// pages/sendforge/sendforge.js
var app = getApp();

var allfn = require("../../utils/fn.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    format:"2",
    content:"",
    loading:false,
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

  //选择发布方式
  change_format:function(e){
    // console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      format:index
    })
    // console.log(this.data.format)
  },
  //获得输入框得内容
  change_send_message:function(e){
    // console.log(e);
    var ocontent =  e.detail.value;
    this.setData({
      content:ocontent
    })
  },
  //点击发送
  send_forge:function(){
    if(this.data.loading){
      return;
    }
    if(this.data.content.length==0){
      wx.showModal({
        title: '提示',
        content: '再输入点内容吧！',
        showCancel:false
      })
      return;
    }

    this.setData({
      loading:true
    })
    var token = wx.getStorageSync("token");
    var content = this.data.content;
    var format = this.data.format;

    // console.log(token+"---"+content+"---"+format)
    wx.showLoading({
      title: '正在发布中...',
    })
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/saveText",
      method:"POST",
      header:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        token,
        content,
        format
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==0){
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
          })

          setTimeout(()=>{
            this.setData({
              loading:false
            })
            wx.switchTab({
              url: '/pages/index/index_4',
            })
          },1000)
          
          this.setData({
            content:""
          })
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '发布失败',
            showCancel:false
          })
        }
        
      }
    })
  }
})