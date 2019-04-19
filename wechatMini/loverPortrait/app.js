//app.js
App({
  //使用户授权
  getUserInfo: function (cb) {
    var that = this
          wx.login({
            success: function (res) {
              wx.request({
                url: "https://avatar.zxles.com/index/weixin/wxlogin",
                method:'GET',
                data:{
                  code:res.code
                },
                success:(res)=>{
                  if(res.data.code==0){
                    wx.setStorageSync("token", res.data.token)
                    wx.getUserInfo({
                      withCredentials: false,
                      success: function (res) {
                        typeof cb == "function" && cb(res.userInfo)
                      },
                      fail: function (e) {
                        wx.openSetting({
                          success: (res) => {
                            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                              that.getUserInfo(function (user) {
                                typeof cb == "function" && cb(user)
                              });
                            }
                          }
                        })
                      }
                    })
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: '登录失败！',
                      showCancel:false
                    })
                  }

                }
              })
              
            }
          })
  },
  globalData: {
    userInfo: null,
    base_url: "https://avatar.zxles.com"
  }
})