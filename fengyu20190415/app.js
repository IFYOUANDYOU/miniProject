//app.js
 
App({
    appData: {
        // honghua
        url: 'https://yuanyang.xiegangsir.com/honghua/',
    },
    onLaunch: function() {
        this.userInfoCallback()
    },
    userInfoCallback: function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            var user = wx.getStorageSync("user");
            if (user && user.openid) {
                resolve(user.openid);
            } else {
                wx.login({
                    success(res) {
                        if (res.code) {
                            //发起网络请求
                            wx.request({
                                method: 'POST',
                                url: that.appData.url + 'login',
                                data: {
                                    code: res.code
                                },
                                header: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                success: function(res) {
                                    wx.setStorageSync('user', res.data.data);
                                    resolve(res.data.data.openid);
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    globalData: {
        userInfo: null
    }
})