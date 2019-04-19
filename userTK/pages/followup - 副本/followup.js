const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    vh: 0,
    prescrip: [],
    cardId: "",
    doctor: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var cardId = options.cardId ? options.cardId:"";
    wx.createSelectorQuery().select('.upload').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res) {
      var wh = res.width;
      _this.setData({
        vh: wh/3,
        cardId: cardId
      })
      _this.getPageData();
    }).exec()
  },

  //获取页面所需的数据
  getPageData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (cardId) {
      wx.showLoading({title: "加载中"})
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
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },

  //上传处方
  upload: function(e){
    var _this = this;
    var prescrip = _this.data.prescrip;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        _this.uploadfiles(tempFilePaths);
      },
      fail(res){
        utils.showToast("请重新上传");
      }
    })
  },
  //上传图片
  uploadfiles: function (file) {
    var _this = this;
    var prescrip = _this.data.prescrip;
    var cardId = _this.data.cardId;
    wx.showLoading({ title: "图片正在上传" })
    wx.uploadFile({
      url: app.globalData.apiurl + "addPrescriptionImg",
      filePath: file,
      name: 'file',
      formData: {
        "id": cardId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          var resdata = JSON.parse(res.data);
          utils.showToast(resdata.msg);
          if (resdata.code != 200) return false;
          prescrip.push(resdata.data);
          _this.setData({
            prescrip
          })
          wx.hideLoading();
        }
      },
      fail: function (res) {
        console.log(res);
        utils.showToast("图片上传失败");
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },

  //删除
  delimg: function(e){
    var _this = this;
    var eq = e.currentTarget.dataset.index;
    var prescrip = _this.data.prescrip;
    prescrip.splice(eq, 1);
    _this.setData({
      prescrip
    })
  },

  //提交处方单
  cfSubmit: function (e) {
    var _this = this,imgs=[];
    var cardId = _this.data.cardId;
    var prescrip = _this.data.prescrip;
    for (var i in prescrip) {
      imgs.push(prescrip[i].img_url);
    }
    if (imgs.length == 0) {
      utils.showToast("请上传您的处方单");
      return false;
    }
    wx.showLoading({ title: "正在提交" })
    var url = app.globalData.apiurl + "submitPrescription";
    utils.requestUrl(
      url,
      {
        id: cardId,
        field: imgs
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res);
        if (res.data.code != 200) {
          utils.showToast(res.data.msg);
          return false;
        }
        wx.hideLoading();
        wx.redirectTo({
          url: "/pages/step1/step1?cardId=" + cardId+"&tp=A",
        })
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