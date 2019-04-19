// pages/index/expression.js
var app = getApp();
var base_url = app.globalData.base_url;

var selction_page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label_list:[],
    selection_list: [],
    my_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取标签
    wx.request({
      url: base_url +"/index/api/keywords",
      method:"GET",
      success:(res)=>{
        this.setData({
          label_list:res.data
        })
      }
    })
    this.get_my_list();
    this.get_selection_list();
  },
  //获取原创头像
  get_my_list: function () {
    wx.request({
      url: base_url + "/index/api/originalExpression",
      method: "GET",
      data: {
        format: 1,
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
  //获取热门推荐
  get_selection_list:function(){
    wx.request({
      url: base_url +"/index/api/expressionList",
      method:"GET",
      data:{
        page: ++selction_page
      },
      success:(res)=>{
  
        if(res.data){
          var list = this.data.selection_list;
          list = list.concat(res.data);
          this.setData({
            selection_list: list
          })
        }else{
          --selction_page
        }
        wx.hideLoading();
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
    wx.showLoading({
      title: '加载中...',
    })
    this.get_selection_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  //预览图片
  look_img:function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.src],
    })
  },
  //去搜索页
  go_search: function () {
    wx.navigateTo({
      url: '/pages/search/search?type=1',
    })
  },
  //点击文字搜索
  txt_search: function (e) {
    var txt = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/search_detail/search_detail?key=' + txt+"&type=1",
    })

  },
  //去详情页
  go_detail: function (e) {
    wx.navigateTo({
      url: '/pages/big_img/big_img?src=' + e.currentTarget.dataset.src + "&id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  },
  //查看更多
  go_more: function (e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/classify/classify?type=' + type,
    })
  }
})