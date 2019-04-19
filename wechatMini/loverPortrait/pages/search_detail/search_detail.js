// pages/search_detail/search_detail.js
var search_page= 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key_words:"",
    have:false,

    search_list:[],
    type:""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var words = options.key;
    var type = options.type
    this.setData({
      key_words:words,
      type
    })

    wx.request({
      url: "https://avatar.zxles.com/index/api/search",
      method: "GET",
      data: {
        keywords: this.data.key_words,
        page: ++search_page
      },
      success: (res) => {
        if (res.data.length) {
          var list = this.data.search_list ;
          list = list.concat(res.data)
          this.setData({
            search_list: list
          })
        } else {
          --search_page
          this.setData({
            have:true
          })
        }

      }
    })
    
  },
  //获取搜索结果
  get_search_list:function(){
    wx.request({
      url: "https://avatar.zxles.com/index/api/search",
      method: "GET",
      data: {
        keywords: this.data.key_words,
        page: ++search_page
      },
      success:(res)=>{
        if(res.data.length){
          var list = res.data;
          list = list.concat(this.data.search_list)
          this.setData({
            search_list: list
          })
        }else{
          --search_page
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
    this.get_search_list();
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

  }
})