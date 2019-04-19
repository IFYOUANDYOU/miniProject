var imageUtil = require('../../imgshiying.js');
var openid 
var page = 1;
var app = getApp()

Page({
  data: {
  newsdata:[],
  newsdata1:[],
  id:"",
  },

  onLoad: function (options) {
    this.setData({ id: options.id })
    
    this.checkLogin()
  },

  checkLogin: function () {
    
    if(wx.showLoading){
      wx.showLoading({
        title: '加载中',
      })
    }
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

getlist: function(){
  var that = this
  var token = wx.getStorageSync('token');
  wx.request({
    url: app.globalData.requestUrl + '/mood/api/detail?id=' + that.data.id,
    data: { token: token },
    success: function (res) {
      that.setData({
        newsdata: res.data.current
      })
      if (wx.hideLoading){
        wx.hideLoading()
      }
    }
  })

  wx.request({
    url: app.globalData.requestUrl + '/wx/get_comment?id=' + that.data.id + '&page=1' + '&type=mood',
    data: {
      openid: openid
    },
    success: function (res) {
      // console.log(res)
      that.setData({
        newsdata1: res.data.data.data,
        newsdata2: res.data.data.total
      })
    }
  })

},

  imgSy: function (e) {
    var imageSize = imageUtil.imageUtil(e);
    var swiperConfig = this.data.newsdata;
    swiperConfig.imageheight = imageSize.imageHeight;
    this.setData({
      newsdata: swiperConfig
    })
  },

  click_skip: function (e) {
    var that = this;
    var newsdata = that.data.newsdata
    var src = newsdata.mood_img
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })

  },

  click_dianzan: function (e) {
   
    var that = this;
    var id = that.data.newsdata.id
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/love',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        var num = that.data.newsdata.is_like == 1 ? 2 : 1
        that.data.newsdata.is_like = num
        that.data.newsdata.good = num == 1 ? parseInt(that.data.newsdata.good) - parseInt(1) : parseInt(that.data.newsdata.good) + parseInt(1) 
        that.setData({ newsdata: that.data.newsdata })
        if( num == 2 ){
            wx.showToast({
                title: '点赞成功',
            })
        }else{
            wx.showToast({
                title: '取消点赞',
            })
        }
        
      }
    })
  },

  //***收藏 
  click_shouchang: function (e) {
    
    var that = this;
    var id = that.data.newsdata.id
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/collection',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        var num = that.data.newsdata.is_collect == 1 ? 2 : 1
        that.data.newsdata.is_collect = num
        that.setData({ newsdata: that.data.newsdata })
        if( num == 2 ){
            wx.showToast({
                title: '收藏成功',
            })
        }else{
            wx.showToast({
                title: '取消收藏',
            })
        }
      }
    })
  },

//长安复制
  touchtext:function(e){
    var that=this
    var text = that.data.newsdata.mood_word

    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '文字复制成功',
              icon: 'success',
              duration: 10000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          }
        })
      }
    })
  },

//发送评论
  formBindsubmit: function (e) {
    if(wx.showLoading){wx.showLoading({
      title: '评论中',
    })}
    var that = this
    var value = e.detail.value.content
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/comment',
      data: {
        id: that.data.newsdata.id,
        content: value,
        token: token
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 200) {
          try {
            wx.setStorageSync('is_success', 1)
          } catch (e1) {
          }
          wx.request({
            url: app.globalData.requestUrl + '/wx/get_comment?id=' + that.data.newsdata.id + '&page=1' + '&type=mood',  
            success: function (res) {
              page = 1
              that.setData({
                newsdata1: res.data.data.data,
                newsdata2: res.data.data.total,
                value: ''
              })
              if (wx.hideLoading){
                wx.hideLoading()
              }
            }
          })

          setTimeout(function () {
            wx.hideToast()
          }, 1000)

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })

        }
      }
    })

  },

  onReachBottom: function () {
    var that = this
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};
    wx.request({
      url: app.globalData.requestUrl + '/wx/get_comment?id=' + that.data.id + '&page=' + (page+1) + '&type=mood', 
      success: function (res) {
        page = page + 1;
        var resdata = res.data.data.data
        that.setData({
          newsdata1: that.data.newsdata1.concat(resdata)
        });
        if (wx.hideLoading){
          wx.hideLoading();
        }
      }
    })  
  },

  onShareAppMessage: function () {
  
  }
})