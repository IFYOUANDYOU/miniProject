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
    img_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var paths = options.paths;
    // console.log(paths);
    var opaths=paths.split(",");
    this.setData({
      img_list:opaths
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
  //选择发布图片
  choose_img:function(){
      if(this.data.img_list.length==9){
        wx.showModal({
          title: '提示',
          content: '一次最多只能发表9张图片哦！',
          showCancel:false
        })
        return;
      }
      wx.chooseImage({
        success: (res)=>{
          // console.log(res);
          var files_path = res.tempFilePaths;
          if (files_path.length + this.data.img_list.length>9){
            wx.showModal({
            title: '提示',
            content: '一次最多只能发表9张图片哦！',
            showCancel:false
          })
          return;
          }
          files_path = this.data.img_list.concat(files_path);
          this.setData({
            img_list:files_path
          })
          // console.log(this.data.img_list); 
        },
      })
  },
  //点击发送
  send_pic: function () {
    if (this.data.img_list.length == 0) {
      wx.showModal({
        title: '提示',
        content: '配精美图片,更容易通过审核哦！',
        showCancel: false
      })
      return;
    }
    var token = wx.getStorageSync("token");
    var content = this.data.content;
    var format = this.data.format;
    // console.log(token + "---" + content + "---" + format)
    var data = {
      path:this.data.img_list
    }
    var formdata={
      token,
      content,
      format
    }
    allfn.allfn.upload_many_img(data,formdata)
    
  },

  //删除图片
  delete_img:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.img_list;
    list.splice(index,1);
    this.setData({
      img_list:list
    })
    // console.log(this.data.img_list)
  }
})