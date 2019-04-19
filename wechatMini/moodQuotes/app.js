//app.js
App({
  getUserInfo: function (cb) {
    var that = this
    wx.getUserInfo({
      withCredentials: false,
      lang:"zh_CN",
      success: function (res) {
        // console.log(res);
        wx.setStorageSync("user", res.userInfo);
        that.wxlogin(function (rs) {
          that.saveUserInfo(res.userInfo, rs.openid, function (r){
            typeof cb == "function" && cb(rs.rd_session)
          });
        });
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '必须授权才能操作呢！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
				if(wx.openSetting){
					wx.openSetting({
						success: (res) => {
              if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"] || !res.authSetting["scope.writePhotosAlbum"]) {
							that.getUserInfo();
						  }
						}
					  })
				}
            }
          }
        })
      }
    })
  },

  wxlogin: function (cb) {
    var that = this
    wx.login({
      success: function (res) {
       
        if (res.code) {
          wx.request({
            url: that.globalData.requestUrl + '/wx/wxlogin',
            data: { code: res.code },
            success: function (res) {
              // console.log(res)
              if(res.data.code == 0)
                typeof cb == "function" && cb(res.data)
            }
          })
        } else {
          // console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  saveUserInfo: function (member, openid, cb) {
    var that = this
    wx.request({
      url: that.globalData.requestUrl + '/wx/saveUser',
      data: { member: member, openid: openid },
      success: function (res) {
        typeof cb == "function" && cb(res.data)
      }
    })
  },

  globalData: {
    requestUrl: 'https://wx.jiqixing.com',
    isupdateFormid:false
  }
})
