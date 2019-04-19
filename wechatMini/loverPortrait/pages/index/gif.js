// pages/index/gif.js
var app = getApp();
var base_url = app.globalData.base_url;

var gif_page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      gif_list:[
       
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_gif_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_gif_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取gif列表
  get_gif_list:function(){
    wx.request({
      url: base_url +"/index/api/gifList",
      method:"GET",
      data:{
        page:++gif_page
      },
      success:(res)=>{
        if(res.data){
          var list = this.data.gif_list;
          list = list.concat(res.data);
          this.setData({
            gif_list:list
          })
        }else{
          --gif_page
        }
        wx.hideLoading();
      }
    })
  },
  //去详情页
  go_detail:function(e){
    wx.navigateTo({
      url: '/pages/big_img/big_img?src=' + e.currentTarget.dataset.src + "&id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  }
})