const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    cardId: "",
    cards: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cardId = options.cardId;
    this.setData({
      cardId: cardId ? cardId:""
    })
    if (!cardId) {
      utils.showToast("找不到就诊记录");
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
    this.getPageData();
  },

  //获取页面所需的数据
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (cardId) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "DiagnosticcardDet/" + cardId;
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
              cards: res.data.data,
              statu: true
            })
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
        function (res) { 
          var timer = setTimeout(function () {
            wx.hideLoading();
            clearTimeout(timer);
          }, 500)
        }
      );
    }else{
      utils.showToast("找不到就诊记录");
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },
  //重新加载页面
  reload: function () {
    this.getPageData();
  },

  //点击查看详情
  viewCard: function(e){},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.sliderightshow(this, 'animation', 0, 1);
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