const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    curPage: "user",
    loadcom: false,

    news: "",
    name: "", 
    avatar: "", 
    income: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
  },

  //获取页面所需数据
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    if (userId) {
      wx.showLoading({ title: "加载中" })
      var url = app.globalData.apiurl + "getUserCore/" + userId;
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          if (res.data.code == 200) {
            var datas = res.data.data;
            if (datas.countNes==0){
              wx.setStorageSync("hasnews", false);
            }else{
              wx.setStorageSync("hasnews", true);
            }
            if(res.data.msg=="请先授权"){
              wx.reLaunch({ url: '/pages/authorize/authorize' })
            }
            _this.setData({
              news: datas.countNes,
              name: datas.user_name,
              avatar: datas.user_img,
              income: datas.user_tk,
              loadcom: true,
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
      utils.showToast("用户获取失败");
      wx.reLaunch({url: '/pages/index/index'})
    }
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
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loadcom: false
    })
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