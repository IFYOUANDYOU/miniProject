// pages/classify/classify.js
var app = getApp();
var base_url = app.globalData.base_url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    list_page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var type = options.type
      this.setData({
        type
      })
      this.get_list(type);
  },

  //获取列表
  get_list:function(type){
    switch (type) {
      case "0":
        wx.setNavigationBarTitle({
          title: '原创头像',
        })
        wx.request({
          url: base_url +"/index/api/originalAvatar",
          method:"GET",
          data:{
            format:1,
            list_page:++this.data.list_page,
          },
          success:(res)=>{
            if(res.data.length){
              var list = res.data;
              list = list.concat(this.data.list)
              this.setData({
                list
              })
            }else{
              --this.data.list_page
            }

          }
        })
        break;
      case "1":
        wx.setNavigationBarTitle({
          title: '原创表情',
        })
        wx.request({
          url: base_url + "/index/api/originalExpression",
          method: "GET",
          data: {
            format: 1,
            list_page: ++this.data.list_page,
          },
          success: (res) => {
            if (res.data.length) {
              var list = res.data;
              list = list.concat(this.data.list)
              this.setData({
                list
              })
            } else {
              --this.data.list_page
            }

          }
        })
        break;
    }
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
  //去详情页
  go_detail: function (e) {
    wx.navigateTo({
      url: '/pages/big_img/big_img?src=' + e.currentTarget.dataset.src + "&id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  },
})