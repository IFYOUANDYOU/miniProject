// pages/puzzle/puzzle.js
var  app = getApp();
var base_url = app.globalData.base_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_list:[],
    type_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: base_url +'/index/api/bannerPic',
      method:"POST",
      success:(res)=>{
        // console.log(res);
        if(res.data.code==200){

          this.setData({
            // banner_list:res.data.data.banner,
            type_list: res.data.data.cat
          })
          // console.log(this.data.type_list)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (){
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getUserInfo(function (user) {
      // console.log(token)
      wx.setStorageSync('user', user)

    });
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
  //发送formID
  send_formID:function(e){

    console.log(e)
  },

  //进入拼图页面
  go_detail:function(e){

    var id = e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '/pages/puzzle_detail/puzzle_detail?id='+id,
    })
  }
})