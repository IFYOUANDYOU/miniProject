// pages/sendforge/sendforge.js
var app = getApp();

var allfn = require("../../utils/fn.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    format: "2",
    content: "",
    video_src: "",
    up_num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.path);
    this.setData({
      video_src:options.path
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
  change_format: function (e) {
    // console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      format: index
    })
    // console.log(this.data.format)
  },
  //获得输入框得内容
  change_send_message: function (e) {
    // console.log(e);
    var ocontent = e.detail.value;
    this.setData({
      content: ocontent
    })
  },
  //选择发布视频
  choose_video: function () {
   
    wx.chooseVideo({
      success:(res)=>{
        var path = res.tempFilePath;
        this.setData({
          video_src:path
        })
      }
    })
  },
  //点击发送
  send_pic: function () {
    // console.log(wx.canIUse("uploadFile.return"))
    // var info=wx.getSystemInfoSync()
    // console.log(info)
    if (!this.data.video_src) {
      wx.showModal({
        title: '提示',
        content: '配上搞笑视频,更容易通过审核哦！',
        showCancel: false
      })
      return;
    }
    var that = this;
    var token = wx.getStorageSync("token");
    var content = this.data.content;
    var format = this.data.format;
    // console.log(this.data.video_src);
    // console.log(token + "---" + content + "---" + format);
    var uploadTask=wx.uploadFile({
      url: 'https://xh.jiqixing.com/xiaohua/saveVideo',
      filePath: that.data.video_src,
      name: 'file',
      formData:{
        token,
        content,
        format
      },
      success:(res)=>{
        // console.log(res);
        wx.showToast({
          title: '发布成功！',
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index_4',
          })
        }, 1000)
      },
      fail:(res)=>{
        // console.log(res);
      }
    })
   
    uploadTask.onProgressUpdate((res)=>{
      this.setData({
        up_num: res.progress
      })
    })

  },

  // //删除图片
  // delete_img: function (e) {
  //   var index = e.currentTarget.dataset.index;
  //   var list = this.data.img_list;
  //   list.splice(index, 1);
  //   this.setData({
  //     img_list: list
  //   })
  //   console.log(this.data.img_list)
  // }
})