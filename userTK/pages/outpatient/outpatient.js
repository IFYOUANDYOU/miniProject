const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,

    cardId: "",

    doctor: {},
    disIndex: 0,
    disId: "",
    dis: "",
    disease: [],
    notice: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var cardId = options.cardId ? options.cardId:"";
    _this.setData({
      cardId
    })
    _this.getPageData();
  },

  //获取页面所需的数据
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (cardId) {
      wx.showLoading({ title: "加载中" })
      var url = app.globalData.apiurl + "getFollowUpInfo/" + cardId;
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
              disease: res.data.data.dList,
              doctor: res.data.data.list,
              notice: res.data.data.zysx,
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
    }else{
      utils.showToast("找不到就诊记录");
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },

  //选择疾病之前判断
  bindDisBefore: function (e) {
    var disease = this.data.disease;
    if (disease.length == 0) {
      utils.showToast("暂无疾病信息");
      return
    }
  },
  //选择疾病
  bindDisChange: function (e) {
    var _this = this;
    var val = e.detail.value;
    var disease = _this.data.disease;
    var disid = disease[val].id;
    _this.setData({
      disIndex: val,
      disId: disid,
      dis: disease[val].name
    })
  },

  //表单提交
  formSubmit: function(e){
    var _this = this;
    var username = e.detail.value.username;
    var dis = _this.data.dis;
    var disId = _this.data.disId;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (username == ""){
      utils.showToast("请输入患者姓名");
      return false;
    }
    if (disId == "") {
      utils.showToast("请选择确诊疾病");
      return false;
    }
    var url = app.globalData.apiurl +"addDiagnosticcard";
    utils.requestUrl(
      url,
      {
        user_id: userId,
        visit_name: username,
        did: disId,
        id: cardId
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.redirectTo({ url: "/pages/step1/step1?cardId=" + cardId });
        }
        utils.showToast(res.data.msg);
      },
      function (res) {
        utils.showToast(res.data.msg);
      },
      function (res) { }
    );
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