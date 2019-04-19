// pages/head_more/head_more.js

var app = getApp();
var base_url = app.globalData.base_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    list_page:0,
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id
    })
    this.get_list()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  //获取列表
  get_list:function(){
    var id = this.data.id;
    wx.request({
      url: base_url+"/index/api/avatarList",
      method:"GET",
      data:{
        tags_id:id,
        page:++this.data.list_page
      },
      success:(res)=>{

        if(res.data.length){
          var list = this.data.list;
          list = list.concat(res.data);
          this.setData({
            list
          })
        }else{
          --this.data.list_page
        }
        wx.hideLoading();
      }
    })
  },

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
    this.get_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //去详情页
  go_detail: function (e) {
    wx.navigateTo({
      url: '/pages/big_img/big_img?src=' + e.currentTarget.dataset.src + "&id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  },
})