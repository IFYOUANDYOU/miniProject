const utils = require("/utils/util.js");

App({
  globalData: {
    usercode: "",
    userInfo: null,
    apiurl: "https://www.doctorlm.com/index.php/",
    openId: '',
    userId: "",
    unionId: "",
    dcodeId:"",
    getUserInfo: false,
    isx: false
  },
  onLaunch: function(options) {
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    _this.wxlogin();
    console.log(options)
    if (options.scene == 1007 || options.scene == 1008){
      wx.showLoading({
        title: '页面跳转中'
      })
      _this.getUserId().then(function (res) {
        if (res.code == 200) {
          wx.reLaunch({
            url: "/"+options.path
          })
        }
      }, function (res) {
        console.log(res);
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }).catch();
    }
    wx.getSystemInfo({
      success: function (res) {
        var model = res.model;
        console.log(res)
        if (model.indexOf("iPhone11,6") != -1 || model.indexOf("iPhone11,4") != -1 || model.indexOf("iPhone11,6") != -1 || model.indexOf("iPhone11,2") != -1 || model.indexOf("iPhone11,8") != -1) {
          _this.globalData.isx = true;
        }
      }
    })
    
    if (options.query.id && options.query.id!=""){
      _this.globalData.dcodeId = options.query.id;
    }
  },
  //微信登录
  wxlogin: function(e) {
    var _this = this;
    wx.login({
      success: res => {
        //登录成功设置res.code
        _this.globalData.usercode = res.code;
        _this.getUserSetting();
      }
    })
  },
  getUserIdCallback: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success: res => {
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
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                console.log(res)
                var resInfo = res.userInfo;
                /*设置全局变量userInfo*/
                var userInfo = res.userInfo;
                var code = _this.globalData.usercode;
                if (code) {
                  //console.log(_this.globalData.usercode, res.rawData, res.signature, res.encryptedData, res.iv)
                  utils.requestUrl(
                    _this.globalData.apiurl + "Login",
                    {
                      code: code,
                      rawData: res.rawData,
                      signature: res.signature,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    null,
                    "POST",
                    null,
                    function (res) {
                      var datas = res.data;
                      console.log(datas)
                      if (datas.code == 200) {
                        utils.showToast(datas.msg, "success");
                        _this.globalData.openId = datas.data.openId;
                        _this.globalData.userId = datas.data.user_id;
                        _this.globalData.unionId = datas.data.unionId;
                        _this.globalData.user = datas.data.user;
                        _this.globalData.userInfo = {
                          "nickName": datas.data.nickName,
                          "avatarUrl": datas.data.avatarUrl,
                          "gender": datas.data.gender,
                          "language": datas.data.language,
                          "province": datas.data.province,
                          "country": datas.data.country,
                          "city": datas.data.city
                        };
                        try {
                          wx.setStorageSync('usercode', code);
                          wx.setStorageSync('user', datas.data.user);
                          wx.setStorageSync('openId', datas.data.openId);
                          wx.setStorageSync('userId', datas.data.user_id);
                          wx.setStorageSync('unionId', datas.data.unionId);
                          wx.setStorageSync('userinfo', resInfo);
                        } catch (e) { }
                        _this.globalData.getUserInfo = true;
                        resolve(datas);
                      } else {
                        utils.showToast(res.data.msg);
                        console.log("登录接口调用成功，返回数据失败");
                        reject('登录失败');
                      }
                      if (_this.userInfoReadyCallback) {
                        _this.userInfoReadyCallback(res)
                      }
                    },
                    function (res) {
                      utils.showToast(res.data.msg);
                      console.log("登录接口调用失败");
                      reject('登录失败');
                    },
                    function (res) {
                      if (_this.globalData.dcodeId != "" && res.data.data.user_id != "") {
                        _this.bindDoctor(_this.globalData.dcodeId, res.data.data.user_id);
                      }
                    }
                  );
                } else {
                  console.log("获取微信登录码失败！");
                  reject('微信登录失败');
                }
              },
              fail(res){
                reject("用户未授权");
              }
            })
          }
        },
        fail: res => {
          reject("获取失败");
        }
      })
    })
  },
  //判断用户是否授权   没有授权跳转至授权页面
  getUserSetting: function(){
    var _this = this;
    wx.getSetting({
      success: res => {
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
            success: res => {},
            fail: res => {
              console.log(res);
              wx.reLaunch({
                url: '/pages/authorize/authorize',
              })
            }
          })
        }
      },
      fail: res => {
        console.log(res);
        utils.showToast("获取失败");
        wx.navigateBack({
          delta: -1
        })
      }
    })
  },
  //微信登录获取授权信息  =》  登录获取userId openId  和unionId
  getUserId: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success: res => {
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
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                var resInfo = res.userInfo;
                /*设置全局变量userInfo*/
                var userInfo = res.userInfo;
                var code = _this.globalData.usercode;
                if (code) {
                  //console.log(_this.globalData.usercode, res.rawData, res.signature, res.encryptedData, res.iv)
                  utils.requestUrl(
                    _this.globalData.apiurl + "Login",
                    {
                      code: code,
                      rawData: res.rawData,
                      signature: res.signature,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    null,
                    "POST",
                    null,
                    function (res) {
                      var datas = res.data;
                      console.log(datas)
                      if (datas.code == 200) {
                        utils.showToast(datas.msg, "success");
                        _this.globalData.openId = datas.data.openId;
                        _this.globalData.userId = datas.data.user_id;
                        _this.globalData.unionId = datas.data.unionId;
                        _this.globalData.user = datas.data.user;
                        _this.globalData.userInfo = {
                          "nickName": datas.data.nickName,
                          "avatarUrl": datas.data.avatarUrl,
                          "gender": datas.data.gender,
                          "language": datas.data.language,
                          "province": datas.data.province,
                          "country": datas.data.country,
                          "city": datas.data.city
                        };
                        try {
                          wx.setStorageSync('usercode', code);
                          wx.setStorageSync('user', datas.data.user);
                          wx.setStorageSync('openId', datas.data.openId);
                          wx.setStorageSync('userId', datas.data.user_id);
                          wx.setStorageSync('unionId', datas.data.unionId);
                          wx.setStorageSync('userinfo', resInfo);
                        } catch (e) { }
                        _this.globalData.getUserInfo = true;
                        resolve(datas);
                      } else {
                        utils.showToast(res.data.msg);
                        console.log("登录接口调用成功，返回数据失败");
                        reject('error');
                      }
                      if (_this.userInfoReadyCallback) {
                        _this.userInfoReadyCallback(res)
                      }
                    },
                    function (res) {
                      utils.showToast(res.data.msg);
                      console.log("登录接口调用失败");
                      reject('error');
                      wx.navigateBack({
                        delta: -1
                      })
                    },
                    function (res) { 
                      if (_this.globalData.dcodeId != "" && res.data.data.user_id!="") {
                        _this.bindDoctor(_this.globalData.dcodeId, res.data.data.user_id);
                      }
                    }
                  );
                } else {
                  console.log("获取微信登录码失败！");
                  reject('error');
                }
              }
            })
          }
        },
        fail: res=> {
          console.log(res)
          wx.navigateBack({
            delta: -1
          })
        }
      })
    })
  },
  //获取不到授权信息提示
  showModalNotice: function() {
    var _this = this;
    utils.showModals(
      "用户未授权",
      "如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。",
      0,
      function(res, cancel, confirm) {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    )
  },
  //医生ID绑定 就诊卡
  bindDoctor: function (doctorId, userId){
    var _this = this;
    var url = _this.globalData.apiurl + "Diagnosticcard";
    if (userId == "" || doctorId == "") return false;
    wx.showLoading({ title: "加载中" });
    utils.requestUrl(
      url,
      {
        user_id: userId,
        doctor_id: doctorId
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res)
        if (res.data.code != 200) {
          utils.showToast("请求错误");
          return false;
        }
        var id = res.data.data;
        if (id.length!=0){
          var link = "/pages/followup/followup";
          wx.navigateTo({
            url: link + "?cardId=" + id
          })
        }
        // var random = Math.ceil(Math.random() * 10);
        // //var link = random <= 3 ? "/pages/outpatient/outpatient" : "/pages/followup/followup";
      },
      function (res) {
        _this._showModals();
      },
      function (res) {
        var timer = setTimeout(function () {
          wx.hideLoading();
          clearTimeout(timer);
        }, 500)
      }
    );
  },
  //扫描出错重新扫描
  _showModals: function (con){
    utils.showModals(
      "",
      con ? con : "出问题了，请重新扫描",
      0,
      function (res) {
        if (res.confirm) {
          
        }
      }
    )
  },
  //渐入，渐出实现 
  show: function(that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    animation.opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
  },
  //滑动渐入渐出
  slideupshow: function(that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
  },
  //向右滑动渐入渐出
  sliderightshow: function(that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
  }
})