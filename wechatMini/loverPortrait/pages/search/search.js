// pages/search/search.js

var app = getApp();
var base_url = app.globalData.base_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      
    ],
    list2: [
      { name: "篮球" },
      { name: "动漫" },

      { name: "帅哥" },
      { name: "美女" }
      ],
      type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    wx.request({
      url:base_url+"/index/api/keywords",
      method:"GET",
      success:(res)=>{

        var list = this.data.list2;
        list = list.concat(res.data)
        this.setData({
          list2:list
        })
      }
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //搜索
  search:function(e){
    wx.navigateTo({
      url: '/pages/search_detail/search_detail?key='+e.detail.value+"&type="+this.data.type,
    })
  },
  //点击文字搜索
  txt_search:function(e){
    var txt = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/search_detail/search_detail?key=' + txt + "&type=" + this.data.type,
    })

  }
})