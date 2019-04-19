const app = getApp();
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    step: 2,
    cardId: "",
    error: 0,

    scores: [0, 1, 2, 3, 4],
    normalStar: '/img/star.png',
    selectedStar: '/img/star-fill.png',

    hospital: {
      name: "",
      index: 5,
      all: [],
      sel: [],
      selIds: []
    },
    doctor: {
      name: "",
      index: 5,
      all: [],
      sel: [],
      selIds: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var cardId = options.cardId ? options.cardId : "";
    var error = options.error ? options.error : 0;
    _this.setData({
      cardId,
      error
    })
    _this.getTagData();
  },

  //获取所有第二步所需数据
  getTagData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    var error = _this.data.error;
    if (cardId) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "detDiaFoo/" + cardId + "/" + error;
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
              "hospital.name": res.data.data.hname,
              "hospital.all": res.data.data.hterm,
              "doctor.name": res.data.data.dname,
              "doctor.all": res.data.data.dterm,
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
  //删除 新增标签
  selectTag: function (e) {
    var _this = this, newarr = [], selIds = [];
    var hosSel = _this.data.hospital.sel, docSel = _this.data.doctor.sel;
    var tp = e.currentTarget.dataset.tp;
    var isadd = e.currentTarget.dataset.isadd;
    var value = e.currentTarget.dataset.value;
    var cid = e.currentTarget.dataset.cid;
    if (tp == "hos") {
      newarr = _this.manageTags(hosSel, cid, value, isadd).arr;
      selIds = _this.manageTags(hosSel, cid, value, isadd).arrIds;
      _this.setData({
        "hospital.sel": newarr,
        "hospital.selIds": selIds
      })
    } else {
      newarr = _this.manageTags(docSel, cid, value, isadd).arr;
      selIds = _this.manageTags(docSel, cid, value, isadd).arrIds;
      _this.setData({
        "doctor.sel": newarr,
        "doctor.selIds": selIds
      })
    }
  },
  //添加 删除数组数组
  manageTags: function (arr, cid, value, isadd) {
    var arrIds = [];
    for (var i in arr) {
      arrIds.push(arr[i].cid);
    }
    var item = { "cid": cid, "det": value };
    var index = arrIds.indexOf(cid);
    if (isadd == 1 && index == -1) {
      arr.push(item);
    }
    if (isadd == 0 && index != -1) {
      arr.splice(index, 1);
    }
    return { arr, arrIds };
  },
  /*评分 星星*/
  evalStar: function (e) {
    var key = e.currentTarget.dataset.key,
      types = e.currentTarget.dataset.types,
      count = key, grand;
    if (types == "hos") {
      this.setData({
        "hospital.index": key
      })
    } else {
      this.setData({
        "doctor.index": key
      })
    }
  },
  //第二步  对医院医生服务评价  打分、词条   提交
  evalCatch: function (e) {
    var _this = this;
    var cardId = _this.data.cardId;
    var userid = app.globalData.userId;
    var formId = e.detail.formId;
    var hospital = _this.data.hospital;
    var doctor = _this.data.doctor;

    if (!formId || !userid) {
      utils.showToast("数据丢失");
      return false;
    }
    if (formId == "the formId is a mock one") {
      utils.showToast("请在手机微信打开！");
      return false;
    }
    if (hospital.selIds.length == 0) {
      utils.showToast("请为医院选择评价词条");
      return false;
    }
    if (doctor.selIds.length == 0) {
      utils.showToast("请为医生选择评价词条");
      return false;
    }
    var url = app.globalData.apiurl + "submitDiaFoo";
    wx.showLoading({ title: "正在提交" });
    utils.requestUrl(
      url,
      {
        id: cardId,
        th_id: hospital.selIds,
        h_num: hospital.index,
        td_id: doctor.selIds,
        d_num: doctor.index
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.code != 200){
          utils.showToast(res.data.msg);
          return false;
        };
        _this.sendTemp(formId, res.data.msg);
        utils.showModals(
          "",
          res.data.data ? res.data.data : "积分已自动发送到您的账户,您在服药后可反馈用药体验!",
          0,
          function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: "/pages/index/index",
              })
            }
          }
        )
      },
      function (res) {
        utils.showToast(res.data.msg);
      },
      function (res) {}
    );
  },

  //发送模板消息
  sendTemp: function (formId) {
    var _this = this;
    var cardId = _this.data.cardId;
    var userid = app.globalData.userId;
    wx.showLoading({ title: "正在提交" });
    var url = app.globalData.apiurl + "getAccessToken";
    utils.requestUrl(
      url,
      {
        formId: formId,
        user_id: userid,
        card_id: cardId
      },
      null,
      null,
      null,
      function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.errcode != 0 || res.data.errmsg!="ok") return false;
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
  onReachBottom: function (e) {

  },

  onPageScroll: function (e) {
    var sTop = e.scrollTop;
  }
})