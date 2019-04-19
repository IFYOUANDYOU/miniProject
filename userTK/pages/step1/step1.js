const app = getApp();
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    step: 1,
    ttop: null,
    cardId: "",
    tp: "",
    haserror: 0,

    drugs: [],
    drugids: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var cardId = options.cardId ? options.cardId : "";
    var tp = options.tp ? options.tp : "";
    _this.setData({
      cardId,
      statu: true,
      tp
    })
    if (tp == "A"){
      _this.getAdata();
    }
  },

  //上传处方单之后获取处方单上面的药品信息
  getAdata: function(e){
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (cardId) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "getDiaGoods/" + cardId;
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
              drugs: res.data.data,
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
      utils.showToast("找不到就诊记录");
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },

  //扫码录入药品
  entryDrug: function () {
    var _this = this;
    var drugs = _this.data.drugs;
    var drugids = _this.data.drugids;
    wx.scanCode({
      scanType: ["barCode"],
      success: (res) => {
        var scanCode = res.result;
        var scanType = res.scanType;
        if (!scanCode) return false;
        wx.showLoading({ title: "加载中" });
        var url = app.globalData.apiurl + "getGoods/" + scanCode;
        //根据扫码内容获取药品信息  并添加至数组drugs
        utils.requestUrl(
          url,
          null,
          null,
          null,
          null,
          function (res) {
            console.log(res)
            if (res.data.code == 200) {
              if (res.data.data.length == 0){
                utils.showToast("读取失败，重新扫描");
                return false;
              }
              var items = res.data.data;
              if (drugids.indexOf(scanCode)==-1){
                drugids.push(scanCode);
                drugs.push(items);
              }else{
                for (var i in drugs) {
                  var drug = drugs[i];
                  if (drug.goods_code == items.goods_code && drug.id == items.id) {
                    drug.goods_num += 1;
                  }
                }
              }
              _this.setData({
                drugs,
                drugids
              })
              wx.hideLoading();
            } else {
              utils.showToast(res.data.msg ? res.data.msg : '录入失败，重新扫描');
            }
          },
          function (res) {
            utils.showToast(res.data.msg);
          },
          function (res) { }
        );
      },
      fail: (res) => {
        wx.showModal({
          title: '温馨提示',
          content: '出问题了，是否重新扫描？',
          success: function (res) {
            if (res.confirm) {
              _this.entryDrug();
            }
          }
        })
      }
    })
  },

  //第一步 添加药品   提交
  addCatch: function (e) {
    var _this = this;
    var drugs = _this.data.drugs, drugIds = [];
    var cardId = _this.data.cardId;
    wx.showLoading({ title: "加载中" });
    var url = app.globalData.apiurl + "submitDiaGoods";
    for (var i in drugs) {
      drugIds.push({
        "id": drugs[i].id,
        "num": drugs[i].goods_num
      });
    }
    drugIds = JSON.stringify(drugIds);
    utils.requestUrl(
      url,
      {
        goods_ids: drugIds,
        id: cardId
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        utils.showToast(res.data.msg);
        if (res.data.code==200){
          wx.redirectTo({
            url: '/pages/step2/step2?cardId=' + cardId,
          })
          wx.hideLoading();
        }
      },
      function (res) {
        utils.showToast(res.data.msg);
      },
      function (res) { }
    );
  },

  //录入的药品错误信息提交
  subError: function(e){
    var _this = this;
    utils.showModals(
      "温馨提示",
      "处方单识别错误？点击确定提交",
      0,
      function (res, cancel, confirm) {
        if (res.confirm) {
          _this.setData({
            haserror: 1
          })
        }
      }
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