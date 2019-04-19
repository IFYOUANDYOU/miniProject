// pages/index/head.js

var app = getApp();
var base_url = app.globalData.base_url;

var recommend_page = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    expression_list:[],
    recommend_list:[],
    my_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    app.getUserInfo(function (user) {
      // console.log(token)
      wx.setStorageSync('user', user)
      that.get_expression_list();
      that.get_recommend_list();
      that.get_my_list();
    });


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
    this.get_recommend_list()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //获取头像列表
  get_expression_list:function(){
    wx.request({
      url: base_url +"/index/api/tagsList",
      method:"GET",
      data:{
        type:0
      },
      success:(res)=>{
        if(res.data){
          this.setData({
            expression_list:res.data
          })
        }else{
          --expression_page;
        }
      }
    })
  },
  //获取每日推荐
  get_recommend_list:function(){
    wx.request({
      url: base_url+"/index/api/avatarList",
      method:"GET",
      data: {
        page: ++recommend_page
      },
      success: (res) => {
        if (res.data) {
          var list = this.data.recommend_list;
          list = list.concat(res.data);
          this.setData({
            recommend_list: list
          })
        } else {
          --recommend_page;
        }
        wx.hideLoading();
      }
    })
  },
  //获取原创头像
  get_my_list: function () {
    wx.request({
      url: base_url + "/index/api/originalAvatar",
      method: "GET",
      data: {
        format:1,
        page: 1
      },
      success: (res) => {

        if (res.data) {
          var list = this.data.my_list;
          list = list.concat(res.data.slice(0,6));
          this.setData({
            my_list: list
          })
        } 
        wx.hideLoading();
      }
    })
  },

  //去搜索页
  go_search:function(){
    wx.navigateTo({
      url: '/pages/search/search?type=0',
    })
  },
  //去详情页
  go_detail: function (e) {
    wx.navigateTo({
      url: '/pages/big_img/big_img?src=' + e.currentTarget.dataset.src + "&id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  },
  //查看更多
  go_more:function(e){
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/classify/classify?type='+type,
    })
  },
  //去头像分类
  go_head_more:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/head_more/head_more?id='+id,
    })
  }
})