var imageUtil = require('../../imgshiying.js');
var page = 1;
var app = getApp()
var index = 0;

Page({
  data: {
    newsdata: [],
    imgwidth: [],
    imgheight: [],
    page: 0,
    isshow: false
  },

  onLoad: function (options) {
    if(wx.showLoading){wx.showLoading({
      title: '加载中',
    })}
    this.checkLogin()
  },

  checkLogin: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/checkLogin',
      data: { token: token, page: 1 },
      success: function (res) {
        var data = res.data;
        if (data.code != 200) {
          app.getUserInfo(function (token) {
            if (token.length > 0) {
              wx.setStorageSync('token', token)
              that.getlist();
            }
          });
        }
        else
          that.getlist();
      }
    })
  },

  getlist: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    var page = that.data.page + 1
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/mycollect',
      data: { token: token, page: page },
      success: function (res) {
        var data = res.data;
        that.setData({
          newsdata: that.data.newsdata.concat(data),
          page: page,
          isshow: true
        });
        if (wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
  },

  click_pl: function (e) {
    var that = this
    var openid = that.data.openid
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + id + '&openid=' + openid,
    })

  },

  //收藏 
  click_shouchang: function (e) {
   
    var that = this;
    var is_collect = e.currentTarget.dataset.is_collect
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/collection',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_collect = is_collect == 1 ? 2 : 1
        that.data.newsdata[index].is_collect = is_collect
        
        if( is_collect == 2 ){
            wx.showToast({
                title: '收藏成功',
            })
        }else{
          that.data.newsdata.splice(index,1)
            wx.showToast({
                title: '取消收藏',
            })
        }
        that.setData({ newsdata: that.data.newsdata })
      }
    })
  },

  //点赞
  click_dianzan: function (e) {
    if(wx.showLoading){wx.showLoading({
      title: '处理中',
    })}
    var that = this;
    var is_like = e.currentTarget.dataset.is_like
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/love',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_like = is_like == 1 ? 2 : 1
        that.data.newsdata[index].is_like = is_like
        that.data.newsdata[index].good = is_like == 1 ? parseInt(that.data.newsdata[index].good) - parseInt(1) : parseInt(that.data.newsdata[index].good) + parseInt(1)
        that.setData({ newsdata: that.data.newsdata })
        if (wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
  },

  onPullDownRefresh: function () {
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};
    this.setData({ page: 0 })
    this.getlist()
    wx.stopPullDownRefresh();
  },

//   imgSy: function (e) {
//     var index = e.currentTarget.dataset.index;
//     var imageSize = imageUtil.imageUtil(e);
//     var swiperConfig = this.data.newsdata;
//     var imgObj = swiperConfig[index];
//     imgObj.imageheight = imageSize.imageHeight;

//     this.setData({
//       newsdata: swiperConfig
//     })
//   },

  click_skip: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/new_page/new_page?id=' + id,
    })
  },

  onReachBottom: function (e) {
    var that = this;
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};
    this.getlist()
  },

  tz_a_new_haibao: function (e) {
    wx.navigateTo({
      url: '/pages/a_new_haibao/a_new_haibao?id=' + e.currentTarget.dataset.id
    })
  }

})
