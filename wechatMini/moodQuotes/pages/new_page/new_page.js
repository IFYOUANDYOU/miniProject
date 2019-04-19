var app = getApp()
var imageUtil = require('../../imgshiying.js');
Page({

  data: {
      praise_change:0,
      collect_change:0,
      detail: [],
      imgheight: 0,
      imgwidth: 0,
      newsdata: [],
      isshow: false,
      popView:0,
      ishide:0,
      windowHeight:0,
      canvas_img:'',

      isshow: false,
      username: '',
      id: 0,
  },
  
  onLoad: function (options) {
    var that = this 
    if(wx.showLoading){wx.showLoading({
      title: '加载中',
    })}
    
    this.setData({ id: options.id })
    this.checkLogin()

   
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeigh,
          id: options.id
        })
      },
    })

  },
  //图片自适应
   imgSy:function(e){
    var that = this
    var imgwidth = that.data.imgwidth
    var imgheight = that.data.imgheight
    var index= e.currentTarget.dataset.index;
    var imageSize = imageUtil.imageUtil(e);
    that.setData({
      imgwidth: imageSize.imageWidth,
      imgheight: imageSize.imageHeight,     
    })
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
              that.getData();
            }
          });
        }
        else
          that.setData({ username: res.data.data.nickName })
          that.getData();
      }
    })
  },

  getData: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    var formid = wx.getStorageSync('formId');
    console.log(formid)
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/detail',
      data: { token: token, id: that.data.id, formid: formid},
      success: function (res) {
        var data = res.data.current
        that.setData({
          detail: data,
          isshow: true
        });
        wx.setStorageSync('mood_img', data.mood_img)
        wx.setStorageSync('mood_word', data.mood_word)
        if (wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
    
  },

  //收藏 
  click_shouchang: function (e) {
    var that = this;
    var token = wx.getStorageSync('token')
    var is_collect = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/collection',
      data: { id: that.data.detail.id, token: token },
      method: 'POST',
      success: function (res) {
        var is_collect = that.data.detail.is_collect == 1 ? 2 : 1
        that.data.detail.is_collect = is_collect
        that.setData({ detail: that.data.detail })
        var title = is_collect == 2 ? '收藏成功！' : '取消成功'
        wx.showToast({
          title: title,
          icon: 'success',
        })
      }
    })
  },

  //点赞
  click_dianzan: function (e) {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/love',
      data: { id: that.data.detail.id, token: token },
      method: 'POST',
      success: function (res) {
        var is_like = that.data.detail.is_like == 1 ? 2 : 1
        that.data.detail.is_like = is_like
        that.setData({ detail: that.data.detail })
        var title = is_like == 2 ? '点赞成功！' : '取消成功'
        wx.showToast({
          title: title,
          icon: 'success',
        })
      }
    })
  },

  //支付
  click_pay:function(){
      wx.showModal({
          title: '提示',
          content: '此功能正在开发中，敬请期待...',
          showCancel:false
      })
  },

  tz_haibao: function(){
    wx.navigateTo({
      url: '/pages/a_new_haibao/a_new_haibao?id='+ this.data.detail.id,
    })
  },

  // 点击弹出底部
  click_popUp:function(){
    var that = this 
    that.setData({
      popView:1
    })
  },

  click_cancel:function(){
    
    var that = this 
    that.setData({
      popView: 0
    })
  },

  onShareAppMessage: function (res) {
    if(res.from == 'button'){
      
    }
    return {
      title: '分享到朋友圈',
      path: '',
      success: function (res) {
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  click_friend:function(){
    var that = this
    var ishide = that.data.ishide
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight:res.windowHeight
        })
      },
    })
    if (ishide == 0){
      
      wx.showLoading({
        title: '图片正在生成',
      })
      console.log(that.data.detail);
      wx.request({
        url: 'https://wx.jiqixing.com/wx/getPoster/',
        method: 'POST',
        data: {
          id: that.data.detail.id, detail_img: that.data.detail.mood_img, content: that.data.detail.mood_word, 
          nickname: that.data.detail.nickName, avatar: that.data.detail.avatarUrl,
        },
        success: function (rs) {
          console.log(rs);
          that.setData({
            canvas_img: rs.data.path,
            ishide: 1
          })
          wx.hideLoading()
          wx.downloadFile({
            url: rs.data.path,
            success: function (pp) {
              if (pp.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: pp.tempFilePath	,
                })
              }
            }
          })
        }
      })
        
    }else{
      that.setData({
        ishide:0
      })
    }

    


    
  },

 
})