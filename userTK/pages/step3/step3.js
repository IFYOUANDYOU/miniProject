const app = getApp();
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    animation: {},

    step: 3,
    ttop: null,
    cardId: "",

    survey: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var cardId = options.cardId ? options.cardId : 1;
    _this.setData({
      cardId
    })
    _this.getQuesData();
  },
  //获取页面第三步所需数据
  getQuesData: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var cardId = _this.data.cardId;
    if (cardId) {
      wx.showLoading({ title: "加载中" });
      var url = app.globalData.apiurl + "goodsIndex/" + cardId;
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          if (res.statusCode != 200 || res.data.code != 200) {
            utils.showToast("请求出错");
            _this.setData({
              statu: false
            })
            return false;
          };
          wx.hideLoading();
          if (res.data.data == "已完成") {
            utils.showModals(
              "",
              "您已经完成了调查问卷!",
              0,
              function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: "/pages/index/index",
                  })
                }
              }
            )
          } else {
            _this.setData({
              survey: res.data.data.list,
              statu: true
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
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },
  //选项选择
  surveyChange: function (e) {
    var _this = this;
    var survey = _this.data.survey;
    var selvalue = e.detail.value;
    var fatherid = e.target.dataset.fid;
    for (var i in survey) {
      var item = survey[i];
      if (item.qaid == fatherid) {
        var options = survey[i].daan;
        for (var j in options) {
          options[j].judge = options[j].ask_answer == selvalue;
        }
      }
    }
    _this.data.survey = survey;
    _this.setData({
      survey
    });
  },
  //第三步 提交问卷
  submitCatch: function (e) {
    var _this = this, result=[];
    var step = _this.data.step;
    var service = e.detail.value.service;
    var survey = _this.data.survey;
    var cardId = _this.data.cardId;
    for (var i in survey) {
      for (var j in survey[i].daan) {
        var item = (survey[i].daan)[j];
        if (item.judge == true) {
          result.push({
            "wid": item.qid,
            "did": item.qaid
          })
        }
      }
    }
    if (result.length != survey.length) {
      utils.showToast("请回答完所有问题！");
      return false;
    }
    result = JSON.stringify(result);
    wx.showLoading({ title: "正在提交" });
    var url = app.globalData.apiurl + "submitGoodsFoo";
    utils.requestUrl(
      url,
      {
        cardId: cardId,
        result: result,
        service: service ? service : ''
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        if (res.data.code != 200){
          utils.showToast(res.data.msg);
          return false;
        };
        wx.hideLoading();
        utils.showModals(
          "",
          res.data.data ? res.data.data : "积分已自动发送到您的账户,祝您早日康复！",
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
    wx.reLaunch({
      url: "/pages/index/index",
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
  onReachBottom: function (e) {

  },

  onPageScroll: function (e) {
    var sTop = e.scrollTop;
  }
})