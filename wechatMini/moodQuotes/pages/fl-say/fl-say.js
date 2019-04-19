var page=1;
var imageUtil = require('../../imgshiying.js');
var app = getApp()

Page({
  data:{
    newsdata:[],
    Activeindex:[]
  },

  onShareAppMessage: function () {
    
  },    
  
  onLoad:function(options){
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/category',
      data: { token: token },
      success: function (res) {

          that.setData({
              newsdata:res.data
          });      
          if (wx.hideLoading){
            wx.hideLoading()
          }
      }
    })    
  },
  
  showArticle:function(e){   
      wx.navigateTo({
        url: '../slider/slider?id=' + e.currentTarget.dataset.id+'&value='+e.target.id,
      })
  }  

})
