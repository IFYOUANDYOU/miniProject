const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    drugCode: "",
    drug: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var drugCode = options.drugid;
    _this.setData({
      drugCode
    })
    _this.getPageData();
  },

  //获取页面所需的数据
  getPageData: function () {
    var _this = this;
    var drugCode = _this.data.drugCode;
    if (drugCode) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "getGoodsInfo/" + drugCode;
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
              drug: res.data.data,
              statu: true
            })
            wx.hideLoading();
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
        function (res) {}
      );
    }else{
      utils.showToast("找不到药品信息");
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },
  //重新加载页面
  reload: function () {
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.slideupshow(this, 'animation', 0, 1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})