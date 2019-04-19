//app.js

App({
  appData: {
    // honghua
    // url: 'https://yuanyang.xiegangsir.com/honghua/',
    url: 'https://applet.632wp6.cn/',
  },
  onLaunch: function() {
    var _this = this;
    // _this.userInfoCallback().then(res => {
    //   _this.globalData.token = res.token;
    //   _this.globalData.openid = res.session.openid;
    //   _this.globalData.session_key = res.session.session_key;
    // }).catch(err => {
    //   console.log(err)
    // });
  },
  userInfoCallback: function(code) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      var user = wx.getStorageSync("user");
      if (user && user.openid) {
        resolve(user.openid);
      } else {
        wx.login({
          success(res) {
            if (res.code) {
              _this.globalData.usercode = res.code;
              //发起网络请求  登录
              wx.request({
                method: 'POST',
                url: _this.appData.url + 'login',
                data: {
                  code: res.code,
                  flag: _this.globalData.flag
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                  var resdata = res.data.data
                  if (res.data.data) {
                    _this.globalData.token = resdata.token;
                    _this.globalData.openid = resdata.session.openid;
                    _this.globalData.session_key = resdata.session.session_key;
                    wx.setStorageSync('token', resdata.token);
                    wx.setStorageSync('openid', resdata.session.openid);
                    wx.setStorageSync('session_key', resdata.session.session_key);
                    resolve(resdata);
                  }
                }
              });
            }
          }
        });
      }
    });
  },
  globalData: {
    userInfo: null,
    flag: "wechat_xiaomei",
    usercode: "",
    openid: "",
    session_key: "",
    token: ""
  }
})