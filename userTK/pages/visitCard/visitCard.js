const app = getApp();
const utils = require("../../utils/util.js");

Page({
  data: {
    statu: null,
    animation: {},

    ismove: false,
    scrollindex: 0,  //当前页面的索引值
    totalnum: 3,  //总共页面数
    startX: 0,  //开始的位置x
    endX: 0, //结束的位置y
    marginleft: 0,  //滑动下拉距离

    cardId: "",

    card: {},
    hospital: {},
    doctor: {},
    questions: [],
    remark: ""
  },
  onLoad: function (options) {
    var cardId = options.cardId ? options.cardId : "";
    var index = options.index ? options.index : 0;
    index = parseInt(index);
    var userId = app.globalData.userId;
    this.setData({
      cardId: cardId,
      scrollindex: index
    })
    if (!cardId){
      utils.showToast("找不到就诊记录");
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
    this.getStep1Data(cardId);
  },
  //获取第一步页面所需的数据
  getStep1Data: function (cardId) {
    var _this = this;
    wx.showLoading({ "title": "加载中" });
    var url = app.globalData.apiurl + "diaGoods/" + cardId;
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
            card: res.data.data,
            statu: true
          })
          wx.hideLoading();
          _this.getStep2Data(cardId);
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
  },
  //获取第二步页面所需的数据
  getStep2Data: function (cardId) {
    var _this = this;
    wx.showLoading({ "title": "加载中" });
    var url = app.globalData.apiurl + "diaHosDoc/" + cardId;
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
            hospital: res.data.data.hDet ? res.data.data.hDet : {},
            doctor: res.data.data.dDet ? res.data.data.dDet : {},
            statu: true
          })
          wx.hideLoading();
          _this.getStep3Data(cardId);
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
  },
  //获取第三步页面所需的数据
  getStep3Data: function (cardId) {
    var _this = this;
    wx.showLoading({ "title": "加载中" });
    var url = app.globalData.apiurl + "goodsCommentDet/" + cardId;
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
            questions: res.data.data.askList ? res.data.data.askList : [],
            remark: res.data.data.text ? res.data.data.text : "",
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
  },
  //重新加载页面
  reload: function () {
    this.getPageData();
  },
  //点击左右切换
  arrowBind: function (e) {
    var _this = this, wh;
    var scrollindex = _this.data.scrollindex;
    var pagex = e.touches[0].pageX;
    wx.getSystemInfo({
      success: function (res) {
        wh = res.windowWidth;
        if (pagex < wh / 2) {
          console.log("左滑");
          if (scrollindex < 0) return false;
          scrollindex -= 1;
        } else {
          console.log("右滑");
          if (scrollindex >= 2) return false;
          scrollindex += 1;
        }
      }
    })
    _this.setData({
      scrollindex
    })
  },
  //开始滑动view
  scrollTouchstart: function (e) {
    let pX = e.touches[0].pageX;
    this.setData({
      startX: pX
    })
  },
  //滑动view
  scrollTouchmove: function (e) {
    let pX = e.touches[0].pageX;
    let d = this.data;
    this.setData({
      endX: pX,
      ismove: true
    })
    if (pX - d.startX < 60 && pX - d.startX > -60) {
      this.setData({
        marginleft: pX - d.startX
      })
    }
  },
  //滑动离开view
  scrollTouchend: function (e) {
    let d = this.data;
    var index = d.scrollindex;
    var ismove = this.data.ismove;
    if (!ismove) return false;
    if (d.endX - d.startX > 60 && d.scrollindex > 0) {
      index -= 1;
    } else if (d.endX - d.startX < -60 && d.scrollindex < this.data.totalnum - 1) {
      index += 1;
    }
    this.setData({
      startX: 0,
      endX: 0,
      marginleft: 0,
      scrollindex: index,
      ismove: false
    })
  },
  onShow: function () {
    app.slideupshow(this, 'animation', 0, 1);
  }
})