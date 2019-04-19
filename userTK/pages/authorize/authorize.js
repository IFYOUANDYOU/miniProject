const app = getApp();
const utils = require("../../utils/util.js");
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var _this = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true,
          "scope.address": true,
          "scope.invoiceTitle": true,
          "scope.werun": true,
          "scope.record": true,
          "scope.writePhotosAlbum": true,
          "scope.camera": true
        }
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //用户已经授权过
              wx.reLaunch({
                url: '/pages/index/index'
              })
            },
            fail: function(res){
              utils.showToast("用户未授权");
            }
          });
        }else{
          utils.showToast("用户未授权");
        }
      },
      fail: function(){
        utils.showToast("获取用户信息失败");
      }
    })
  },
  bindGetUserInfo: function (e) {
    var _this = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.showLoading({ title: "登录中" });
      //插入登录的用户的相关信息到数据库
      var url = app.globalData.apiurl + "Login";
      utils.requestUrl(
        url,
        {
          code: app.globalData.usercode,
          rawData: e.detail.rawData,
          signature: e.detail.signature,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        null,
        "POST",
        null,
        function (res) {
          console.log(res)
          if (res.data.code == 200) {
            var datas = res.data;
            utils.showToast(datas.msg, "success");
            app.globalData.openId = datas.data.openId;
            app.globalData.userId = datas.data.user_id;
            app.globalData.unionId = datas.data.unionId;
            app.globalData.user = datas.data.user;
            app.globalData.userInfo = {
              "nickName": datas.data.nickName,
              "avatarUrl": datas.data.avatarUrl,
              "gender": datas.data.gender,
              "language": datas.data.language,
              "province": datas.data.province,
              "country": datas.data.country,
              "city": datas.data.city
            };
            app.globalData.getUserInfo = true;
            console.log("登录成功！");
            wx.hideLoading();
            //授权成功后，跳转进入小程序首页
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }else{
            utils.showToast("登录失败");
          }
        },
        function(res){
          wx.navigateBack({
            delta: -1
          })
        },
        function (res) { }
      );
    } else {
      //用户按了拒绝按钮
      utils.showModals(
        '警告',
        '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        0,
        function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      )
    }
  }
})
