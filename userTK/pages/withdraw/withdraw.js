const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    disabled: true,

    total: "",
    amount: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  //获取可提现金额
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    if (userId) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "getUserTk/" + userId;
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
              total: res.data.data.user_tk,
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
        function (res) { }
      );
    } else {
      utils.showToast("找不到用户");
      wx.reLaunch({url: '/pages/index/index'})
    }
  },

  //
  bindAmount: function (e) {
    var total = this.data.total;
    var disabled = e.detail.value > 0 ? false : true;
    this.setData({
      disabled
    })
  },

  //点击全部提现
  selAll: function (e) {
    var total = this.data.total;
    if (total <= 0) {
      utils.showToast("可提现积分不足");
      return false;
    }
    this.setData({
      amount: total,
      disabled: false
    })
  },

  formSubmit: function (e) {
    var _this = this;
    var userId = app.globalData.userId;
    var amount = e.detail.value.amount;
    var total = _this.data.total;
    if (amount == "" || amount < 1) {
      utils.showToast("请输入提现金额");
      return false;
    }
    if (amount > total) {
      utils.showToast("提现金额不能大于可提现积分");
      return false;
    }
    wx.showLoading({ title: "提交中" });
    var url = app.globalData.apiurl + "submitTk";
    utils.requestUrl(
      url,
      {
        user_id: userId,
        tk: amount
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        utils.showToast(res.data.msg);
        if (res.data.code != 200) return false;
        var aid = res.data.data;
        wx.hideLoading();
        wx.redirectTo({ url: "/pages/wdResult/wdResult?aid=" + aid });
      },
      function (res) {
        utils.showToast("请求出错");
      },
      function (res) { }
    );
  },

  //查看原因
  reason: function (e) {
    utils.showModals(
      "",
      "这是不可提现的原因解释！"
    )
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

  }
})