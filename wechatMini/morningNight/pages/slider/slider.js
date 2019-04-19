var imageUtil = require('../../imgshiying.js');
var userInfo = []
var page = 1;
var id;
var app = getApp()

Page({
  data: {
    Imgsrc: [
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      },
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "123金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      },
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "312金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      }
    ],
   
    newsdata: [],
    imgwidth: [],
    imgheight: [],
  },

  onShareAppMessage: function () {
    
  },

  onLoad: function (options) {
    if(wx.showLoading){wx.showLoading({
      title: '加载中',
    })}
    this.setData({ id: options.id })
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
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst?cate_id=' + that.data.id,
      data: { token: token, page: 1 },
      success: function (res) {
        var data = res.data;
        that.setData({
          newsdata: data,
        });
        if (wx.hideLoading){
          wx.hideLoading();
        }
      }
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
        that.setData({ newsdata: that.data.newsdata })
        if (is_collect == 2) {
            wx.showToast({
                title: '收藏成功',
            })
        } else {
            wx.showToast({
                title: '取消收藏',
            })
        }
      }
    })
  },

  //点赞
  click_dianzan: function (e) {
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
        if (is_like == 2) {
            wx.showToast({
                title: '点赞成功',
            })
        } else {
            wx.showToast({
                title: '取消点赞',
            })
        }
      }
    })
  },

  click_pl: function (e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + id,
    })
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
    var id = e.currentTarget.dataset.id;  
    wx.navigateTo({
      url: '/pages/new_page/new_page?id='+id,
    })
  },

  onReachBottom: function () {
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst?cate_id=' + that.data.id + '&page=' + (page + 1), 
      data: { token: token},
      success: function (res) {
        page = page + 1;
        var resdata = res.data
        for (var i = 0; i < resdata.length; i++) {
          resdata[i].judge = 0;
          resdata[i].judge1 = 0;
        }

        that.setData({
          newsdata: that.data.newsdata.concat(resdata)
        });
        if (wx.hideLoading){
          wx.hideLoading();
        }
      }
    })

  },
  
  onPullDownRefresh: function () {
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst?cate_id=' + that.data.id + '&page=1',
      data: { token: token },
      success: function (res) {
        that.setData({
          newsdata: res.data
        });
        if (wx.hideLoading){
          wx.hideLoading();
        }
      }
    })
  },

  tz_a_new_haibao: function (e) {
    wx.navigateTo({
      url: '/pages/a_new_haibao/a_new_haibao?id=' + e.currentTarget.dataset.id
    })
  }
  
})
