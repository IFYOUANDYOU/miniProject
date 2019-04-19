const app = getApp();
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    inputMarBot: false,
    stop: 0,
    showAnimation: {},

    msg: "",
    newsid: "",
    uid: "",
    did: "",
    chat: [],

    ishsow: false,
    sleft: 0,
    upimgs: [
      "/img/share.jpg",
      "/img/share.jpg",
      "/img/share.jpg",
      "/img/share.jpg",
      "/img/share.jpg"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newsid = options.id ? options.id: "";
    var doctorid = options.doctorid ? options.doctorid:"";
    this.setData({
      newsid,
      did: doctorid
    })
    this.getPageData(1);
  },

  //获取页面所需的数据
  getPageData: function (tp) {
    var _this = this;
    var newsid = _this.data.newsid;
    if (newsid) {
      var url = app.globalData.apiurl + "newsDet/" + newsid + "/0";
      if (tp == 2) { wx.showLoading({"title":"正在发送"})}else{
        wx.showLoading({ "title": "正在获取" });
      };
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          var datas = res.data;
          if (datas.code != 200){
            utils.showToast("请求出错");
            _this.setData({
              statu: false
            })
            return false;
          }
          _this.setData({
            newsid: datas.data.id,
            did: datas.data.did,
            uid: datas.data.uid,
            chat: datas.data.list,
            statu: true
          })
          wx.hideLoading();
        },
        function (res) {
          utils.showToast("请求出错");
          _this.setData({
            statu: false
          })
        },
        function (res) {
          _this.pageScrollToBottom();
        }
      );
    }else{
      utils.showToast("找不到消息记录");
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },

  //发送聊天信息
  msgSubmit: function (e,img){
    var _this = this;
    var msg = e ? e.detail.value : img;
    var userId = app.globalData.userId ? app.globalData.userId : _this.data.uid;
    var doctorId = _this.data.did;
    wx.showLoading({ title: "正在发送" });
    var url = app.globalData.apiurl + "addNews";
    if (msg == "") {
      utils.showToast("请输入聊天内容");
      return false;
    }
    utils.requestUrl(
      url,
      {
        user_id: userId,
        doctor_id: doctorId,
        type: 0,
        news_text: msg
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res);
        utils.showToast(res.data.msg);
        _this.setData({
          msg: ""
        })
        wx.hideLoading();
        _this.getPageData(2);
      },
      function (res) {
        utils.showToast(res.data.msg);
      },
      function (res) {}
    );
  },

  //textFocus
  textFocus: function (e) {
    this.setData({
      inputMarBot: true
    })
  },
  //textBlur
  textBlur: function (e) {
    this.setData({
      inputMarBot: false
    })
  },

  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    var _this = this;
    var stop = 0;
    wx.createSelectorQuery().selectAll('.chat-item').boundingClientRect(function (rect) {
      for (var i in rect) {
        var height = rect[i].height;
        stop += height;
      }
      // 使页面滚动到底部
      _this.setData({
        stop
      })
    }).exec()
  },

  //获取处方单
  getImgs: function(e){
    var _this = this;
    var userId = app.globalData.userId;
    var upimgs = _this.data.upimgs;
    var ishsow = _this.data.ishsow;
    var animation = wx.createAnimation({
      duration: 300
    })
    utils.showToast("功能正在开发");
    return false;
    if (!userId) {
      utils.showToast("找不到记录");
      wx.reLaunch({ url: '/pages/index/index' });
      return false;
    }
    if (upimgs.length==0){
      var url = app.globalData.apiurl + "newsDet/" + newsid;
      wx.showLoading({ "title": "加载中" });
      utils.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          var datas = res.data;
          utils.showToast(datas.msg);
          if (datas.code != 200) {
            return false;
          }
          wx.hideLoading();
          if (datas.data.length == 0){
            utils.showToast("暂无处方单");
            return false;
          }
          _this.setData({
            upimgs: datas.data
          })
          _this.showImg();
        },
        function (res) {
          utils.showToast(res.data.msg);
        },
        function (res) { }
      );
    }
    if (ishsow){
      animation.height('0').step();
    }else{
      animation.height('250rpx').step();
    }
    _this.setData({
      showAnimation: animation.export(),
      ishsow: !ishsow
    })
  },
  //发送
  sendImg: function(e){
    var _this = this;
    var val = e.currentTarget.dataset;
    var item = val.item;
    var index = val.index;
    var sleft = _this.data.sleft;
    if (index+1>3){
      sleft = 200;
    }else{
      sleft = 0;
    }
    _this.setData({
      sleft
    })
    if(item){
      console.log(item)
      //_this.msgSubmit(null, item);
    }
  },

  //图片预览
  previewImg: function (e) {
    var cur = e.currentTarget.dataset.url;
    var list = [];
    list.push(cur);
    console.log(list)
    if (list.length != 0) {
      utils.previewImg(list, cur);
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