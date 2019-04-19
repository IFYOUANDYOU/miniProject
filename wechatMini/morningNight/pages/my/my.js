var app = getApp()

Page({

  data: {
    userInfo: []
  },

  onLoad: function () {

    if(wx.showLoading){wx.showLoading({
      title: '加载中',
    })}

    this.getData()
  },

  getData: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/checkLogin',
      data: { token: token },
      success: function (res) {
        var data = res.data;
        if (data.code != 200) {
          app.getUserInfo(function (token) {
            if (token.length > 0) {
              wx.setStorageSync('token', token)
              that.getData()
            }
            
          });
        }
        else {
          that.setData({
            userInfo: res.data.data
          })
          if (wx.hideLoading){
            wx.hideLoading()
          }
        }
      }
    })
  },

  onShow: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/getCountMsg',
      data: { token: token },
      success: function (res) {
        that.setData({
          msg: res.data
        });
      }
    })
  },

    tz_detail:function(){
        wx.navigateTo({
            url: '/pages/my_detail/my_detail',
        })
    },

    tz_project: function () {
      wx.navigateTo({
        url: '/pages/my_project/my_project',
      })
    },

    tz_collect: function () {
      wx.navigateTo({
        url: '/pages/my_collect/my_collect',
      })
    },
    tz_inform:function(){
        wx.navigateTo({
            url: '/pages/my_inform/my_inform',
        })
    },
})