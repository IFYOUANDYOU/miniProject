const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    mode: 2,
    arecords: [],
    curlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  //获取页面数据  账单记录
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    if (userId) {
      wx.showLoading({ title: "加载中" })
      var url = app.globalData.apiurl + "tkList/" + userId+"/0";
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          if (res.data.code == 200) {
            _this.setData({
              arecords: res.data.data,
              statu: true
            })
            wx.hideLoading();
            _this.getCurlist();
          } else {
            utils.showToast("请求出错");
            _this.setData({
              statu: false
            })
          }
        },
        function (res) {
          utils.showToast("请求出错");
          _this.setData({
            statu: false
          })
        },
        function (res) { }
      );
    }else{
      wx.reLaunch({ url: '/pages/index/index' })
    }
  },

  getCurlist: function(e){
    var _this = this, curlist = [];
    var mode = e ? e.currentTarget.dataset.mode : _this.data.mode;
    var arecords = _this.data.arecords;
    if (mode == 2) {
      curlist = arecords;
    } else {
      for (var i in arecords) {
        var item = arecords[i];
        if (mode == item.type){
          curlist.push(item);
        }
      }
    }
    _this.setData({
      curlist,
      mode
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
    app.show(this, 'animation', 1);
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

  }
})