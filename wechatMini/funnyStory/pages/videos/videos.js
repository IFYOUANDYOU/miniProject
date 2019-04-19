// pages/videos/videos.js
const app = getApp()
var imageUtil = require('../../utils/imageheight.js');
var allfn = require('../../utils/fn.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_list: [],//视频列表
    video_page: 0,//视频列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo((token)=> {
      // console.log(token)
      wx.setStorageSync('token', token)
      // app.getUserInfo()
      this.get_video_list();      
    });
  },
  //获取视频列表
  get_video_list: function () {
    var token = wx.getStorageSync("token");
    var type = 3;
    var format = 0;
    var page = ++this.data.video_page
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/getlist",
      method: "GET",
      data: {
        token,
        type,
        page,
        format,
        video:1,
        limit:6
      },
      success: (res) => {
        // console.log(res);
        var list = this.data.video_list;
        list = list.concat(res.data)
        this.setData({
          video_list: list
        })
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_video_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //去详情页
  go_detail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id='+id,
    })
  },
  
})