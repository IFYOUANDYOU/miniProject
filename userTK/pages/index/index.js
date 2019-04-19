//index.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");

Page({
  data: {
    statu: null,

    userId: "",
    userInfo: {},
    getUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    curPage: "home",

    banner: "",
    mrecords: []
  },
  
  onLoad: function (options) {

  },
  //用药信息的展开与收缩
  toggle: function (e) {
    var _this = this;
    var mrecords = _this.data.mrecords;
    var id = e.currentTarget.dataset.id;
    var istoggle = e.currentTarget.dataset.toggle;
    var isspot = e.currentTarget.dataset.isspot;
    if (!isspot) return;
    istoggle = !istoggle;
    for (var i in mrecords) {
      var item = mrecords[i];
      if (item.id == id) {
        item.judge = istoggle;
      }
    }
    _this.setData({
      mrecords
    })
  },
  //获取页面所需的数据
  getPageData: function(){
    var _this = this;
    var userId = app.globalData.userId;
    if (userId){
      wx.showLoading({ title: "加载中"});
      var url = app.globalData.apiurl + "Home/" + userId;
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          if (res.data.msg == "请先授权") {
            wx.reLaunch({ url: '/pages/authorize/authorize' })
          }
          if(res.data.code == 200){
            _this.setData({
              banner: res.data.data.banner,
              mrecords: res.data.data.diagnosticcard,
              statu: true
            })
            
          }else{
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
    }
  },

  //重新加载页面
  reload: function(){
    this.getPageData();
  },
  _homeEvent() {},
  _scanEvent(res) {
    var _this = this;
    var data = res.detail;
    _this.getPageData();
  },
  _userEvent() {},
  onShow: function(){
    var _this = this;
    var userId = app.globalData.userId;
    _this.setData({
      userId
    })
    if (userId) {
      _this.getPageData();
    } else {
      app.getUserId().then(function (res) {
        if (res.code == 200) {
          _this.getPageData();
        }
      }, function (res) {
        console.log(res);
      }).catch();
    }
  },
  //就诊记录判断 点击链接去向
  navto: function(e){
    var _this = this,link="";
    var step = e.currentTarget.dataset.step;
    var id = e.currentTarget.dataset.id;
    var random = Math.ceil(Math.random() * 10);//生成随机数
    if(step>=4){
      link = "/pages/visitDT/visitDT";
    } else if (step == 1){
      //随机数<=3进行随访方案B，否则A
      //link = random <= 3 ? "/pages/outpatient/outpatient" :"/pages/followup/followup";
      link = "/pages/followup/followup";
    } else if (step == 2){
      link = "/pages/step1/step1";
    } else if (step == 3){
      link = "/pages/step2/step2";
    }else if(step == 4){
      link = "/pages/step3/step3";
    }
    wx.navigateTo({
      url: link + "?cardId=" + id
    })
  },
  onReady: function(e){
    
  }
})
