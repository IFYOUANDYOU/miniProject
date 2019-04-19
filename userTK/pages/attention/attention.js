const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    showAnimation: {},

    cur: {},
    doctors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  //获取页面所需的数据
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    if (userId) {
      wx.showLoading({ title: "加载中" })
      var url = app.globalData.apiurl + "followList/" + userId;
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
              doctors: res.data.data,
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
      wx.reLaunch({ url: '/pages/index/index' })
    }
  },
  //重新加载页面
  reload: function () {
    this.getPageData();
  },

  //发送消息
  sendMsg: function(e){
    var _this = this;
    //var doctorId = _this.data.cur.doctor_id;
    var doctorId = e.currentTarget.dataset.did;
    var userId = app.globalData.userId;
    if (!doctorId || !userId) return false;
    utils.showToast("加载中", "loading");
    var url = app.globalData.apiurl + "userNews/" + userId + "/" + doctorId;
    utils.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        console.log(res)
        if (res.data.code != 200) {
          utils.showToast("请求失败");
          return false;
        }
        var id = res.data.data;
        if (id.length!=0){
          wx.redirectTo({
            url: "/pages/chatroom/chatroom?id=" + id + "&doctorid=" + doctorId,
          })
        }else{
          console.log("创建ID失败");
        }
      },
      function (res) {
        utils.showToast("请求失败");
      },
      function (res) { }
    );
  },

  //点击查看医生详情
  toggleDoctor: function(e){
    var _this = this, cur;
    var tp = e.currentTarget.dataset.tp;
    var doctors = _this.data.doctors;
    var doctorId = e.currentTarget.dataset.id;
    var animation = wx.createAnimation({
      duration: 200,
      transformOrigin: "0 0 0"
    })
    if (tp == "1"){
      if (!doctorId) return false;
      for (var i in doctors) {
        if (doctors[i].doctor_id == doctorId) {
          cur = doctors[i];
        }
      }
      animation.scale(1).opacity(1).step();
    }else{
      cur = {};
      animation.scale(0).opacity(0).step();
    }
    _this.setData({
      showAnimation: animation.export(),
      cur
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