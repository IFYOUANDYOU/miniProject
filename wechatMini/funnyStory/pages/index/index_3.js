// pages/index/index_3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[
        {
          bgimg:"https://xh.jiqixing.com/Assets/index/images/find1.png",
          title:"内涵精选",
          explain:"点赞你就是我的人了",
          bgcolor:"rgba(16,26,54,0.75)"
        },
        {
          bgimg: "https://xh.jiqixing.com/Assets/index/images/find2.png",
          title: "本周精选",
          explain: "TOP 10",
          bgcolor: "rgba(5,116,125,0.75)"
        },
        {
          bgimg: "https://xh.jiqixing.com/Assets/index/images/find3.png",
          title: "视频精选",
          explain: "来不及解释了快上车",
          bgcolor: "rgba(228,74,72,0.75)"
        },
        {
          bgimg: "https://xh.jiqixing.com/Assets/index/images/find4.png",
          title: "美图欣赏",
          explain: "突然之间",
          bgcolor: "rgba(1,67,57,0.75)"
        },
        // {
        //   bgimg: "https://xh.jiqixing.com/Assets/index/images/find5.png",
        //   title: "联系我们",
        //   explain: "欢迎投稿",
        //   bgcolor: "rgba(20,116,175,0.75)"
        // },

      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    wx.stopPullDownRefresh();
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
  go:function(e){
 
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    switch(index){
      case 0:
      wx.navigateTo({
        url: "/pages/connotation_sift/connotation_sift",
      })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/this_sift/this_sift',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/video_sift/video_sift',
        });
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/pic_sift/pic_sift',
        });
        break;
    }
  }
})