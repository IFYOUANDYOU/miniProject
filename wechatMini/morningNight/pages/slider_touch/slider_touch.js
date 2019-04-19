var imageUtil = require('../../imgshiying.js');
var Hq_index="";
var app = getApp()

Page({
  data:{
    bg_gray_judge: 0,
    hide_page: 0,
    hide_page2: 0,
    img_judge: 0,
    img_judge2: 0,
    count:[],
    current:0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 400,
    CUrrent:[],
    newsdata:[],
    Hq_index:[],
    Index_text:[],
    windowHeight:[],
    page:1,
    cate_id:[]
  },
  
  onShareAppMessage: function () {
    
  },  

  onLoad: function(options){
    var that = this
    wx.getSystemInfo({
      success: function(res) {
          that.setData({
            windowHeight:res.windowHeight
          });
      }
    });
   
    this.checkLogin(options)
  },

  checkLogin: function (options) {
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
              that.getlist(options);
            }
          });
        }
        else
          that.getlist(options);
      }
    })
  },

  getlist: function (options){
    var that = this
    var token = wx.getStorageSync('token')
    var Hq_index = parseInt(options.index) + 1
    var page = options.page
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst',
      data: { token: token, cate_id: options.cate_id, page: page },
      success: function (res) {
        var newsdata = res.data;
        var len = newsdata.length;
        var Index_text = (parseInt(options.index) - parseInt(len * (page - 1)))

        for (var i = 0; i < len; i++) {
          newsdata[i].slider_foot = 1
        }
        var CUrrent = parseInt(options.index) - parseInt(len * (page - 1))
        that.setData({
          newsdata: newsdata,
          swiper_data: newsdata[options.index],
          Hq_index: Hq_index - (len * (page - 1)),
          CUrrent: CUrrent,
          Index_text: Index_text,
          page: options.page,
          cate_id: options.cate_id
        })
      },
    })

  },

  click_swiper: function (e) {
    var that = this;
    var newsdata = that.data.newsdata
    var index = e.currentTarget.dataset.index
    var slider_foot = newsdata[index].slider_foot
    if (slider_foot == 1) {
      newsdata[index].slider_foot = 2
    } else {
      newsdata[index].slider_foot = 1
    }
    
    that.setData({
      newsdata: newsdata
    })
  },

  slider_fz: function (e) {
    var that = this;
    var newsdata = that.data.newsdata
    var index = e.currentTarget.dataset.index
    wx.setClipboardData({
      data: newsdata[index].mood_word,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
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

  slider_xz: function (e) {
    var that = this;
    var newsdata = that.data.newsdata
    var index = e.currentTarget.dataset.index
    var src = newsdata[index].mood_img
    wx.previewImage({
      current: src,
      urls: [src] 
    })

  },

  imgSy:function(e){
    var index= e.currentTarget.dataset.index;
    var imageSize = imageUtil.imageUtil(e); 
  
    var swiperConfig = this.data.newsdata;
    var imgObj=swiperConfig[index];
    imgObj.imageheight=imageSize.imageHeight ;   
    this.setData({
      newsdata:swiperConfig
    })
  },

  //收藏 
  click_shouchang: function (e) {
    if(wx.showLoading){wx.showLoading({
      title: '处理中',
    })}
    var that = this;
    var id = that.data.swiper_data.id
    var is_collect = that.data.swiper_data.is_collect
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/collection',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_collect = is_collect == 1 ? 2 : 1
        that.data.swiper_data.is_collect = is_collect
        that.setData({ swiper_data: that.data.swiper_data })
        if (wx.hideLoading){
          wx.hideLoading();
        }

      }
    })
  },

  //点赞
  click_zan: function (e) {
    if(wx.showLoading){wx.showLoading({
      title: '处理中',
    })}
    var that = this;
    var id = that.data.swiper_data.id
    var is_like = that.data.swiper_data.is_like
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/love',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_like = is_like == 1 ? 2 : 1
        that.data.swiper_data.is_like = is_like
        that.setData({ swiper_data: that.data.swiper_data })
        if (wx.hideLoading){
          wx.hideLoading();
        }

      }
    })
  },

  swiperChange: function(e){
     var that = this
    var Hq_index=parseInt(e.detail.current)+1
    var Index_text=e.detail.current
    var newsdata = that.data.newsdata

    for (var i = 0; i < newsdata.length; i++) {
      newsdata[i].slider_foot = 1
    }
    this.setData({
      Hq_index: Hq_index,
      Index_text:Index_text,
      newsdata: newsdata,
      swiper_data: that.data.newsdata[e.detail.current]
    })
  },
  
  produce_haibao: function (e) {
      wx.redirectTo({
        url: '/pages/a_new_haibao/a_new_haibao?id=' + this.data.swiper_data.id,
      })
  },

  click_pay: function () {
      var that = this
      var hide_page = that.data.hide_page
      if (hide_page == 0) {
          that.setData({
              hide_page: 1
          })
      }
  },
  cancel_: function () {
      var that = this
      var hide_page = that.data.hide_page
      if (hide_page == 1) {
          that.setData({
              hide_page: 0
          })
      }
  },
  click_others_price: function () {
      var that = this
      var hide_page2 = that.data.hide_page2
      if (hide_page2 == 0) {
          that.setData({
              hide_page2: 1,
              bg_gray_judge: 1,
          })
      }
  },
  cancel_2: function () {
      var that = this
      var hide_page2 = that.data.hide_page2
      if (hide_page2 == 1) {
          that.setData({
              hide_page2: 0,
              bg_gray_judge: 0,
          })
      }
  },
})