//app.js
App({
  //使用户授权
  getUserInfo: function (cb) {
    var that = this
    var token = wx.getStorageSync('token')
    
    wx.request({
      url: 'https://zfy.zxles.com/index/weixin/checklogin',
      method:"POST",
      data: { token: token },
      success: function (res) {
        // console.log(res.data.code)
        if (res.data.code == 0) {
          typeof cb == "function" && cb(token);
        }
        else if (res.data.code == 99) {

          wx.login({
            success: function (lrs) {
      
              wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                  // console.log(res);
                  wx.setStorageSync("user",res.userInfo)
                  wx.request({
                    url: 'https://zfy.zxles.com/index/weixin/wxlogin',
                    data: { code: lrs.code, userdata: res.userInfo,type:1},
                    method: 'POST',
                    success: function (rs) {
                    //  console.log(rs);
                     if(rs.data.code==0){
                       typeof cb == "function" && cb(rs.data.token)
                     }else{
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
            content: "未检测到用户！",
            showCancel: false
          })
          wx.hideLoading()
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    base_url: "https://zfy.zxles.com",
    name:"",
    content:"",
    signature:"",
    time:"",
    user:"",
    show:false,
  }
})