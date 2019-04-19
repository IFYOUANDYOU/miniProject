//app.js
App({

  globalData: {
    userInfo: null,
    use_4g:false
  },
//使用户授权
  getUserInfo: function (cb) {
    var that = this
    var token = wx.getStorageSync('token')
    // console.log(token)
    wx.request({
      url: 'https://xh.jiqixing.com/xiaohua/checkLogin',
      data: { token: token },
      success: function (res) {
        // console.log(res);
        if (res.data.code == 0) {
          typeof cb == "function" && cb(token)
        }
        else if (res.data.code == 99) {
          wx.login({
            success: function (lrs) {
              
              wx.getUserInfo({
                withCredentials: false,

                success: function (res) {
                  
                  wx.setStorageSync("nickName",res.userInfo.nickName);
                  wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
                  wx.request({
                    url: 'https://xh.jiqixing.com/xiaohua/wxlogin',
                    data: { code: lrs.code,userdata: res.userInfo },
                    method: 'GET',
                    success: function (rs) {
                      // console.log(rs)
                      wx.setStorageSync("user_id", rs.data.user_id)
                      typeof cb == "function" && cb(rs.data.token)
                    }
                  })
                },
                fail: function (e) {
                  wx.openSetting({
                    success: (res) => {
                      if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                        that.getUserInfo(function (token) {
                          typeof cb == "function" && cb(token)
                        });
                      }
                    }
                  })
                }
              })
            }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
          wx.hideLoading()
        }
      }
    })

  },

  //时间转换
  getTime:function(time){
    // console.log(time)
    var timer = Number(time)
    // var timer = new Date();
    
    // timer = Date.parse(timer);

    timer= new Date(timer);
    // console.log(timer);

    var year = timer.getFullYear();
    var month = timer.getMonth()+1;
    var date = timer.getDate();
    var hour = timer.getHours();
    var minutes = timer.getMinutes();

    // console.log(year);
    // console.log(month);
    // console.log(date);
    // console.log(hour);
    // console.log(minutes);
 
    return (year+"-"+month+"-"+date+" "+hour+":"+minutes);
  }
})