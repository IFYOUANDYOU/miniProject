// pages/my_inform/my_inform.js
var app = getApp()
var Time = new Date()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nav_title:[
          { title: '收到的评论', zd_num: 0,border:''},
          { title: '发出的评论', zd_num: 1,border:''},
          { title: '系统消息',  zd_num: 2}
      ],
      zd_index:0,
      judge_nav_a: 1,
      judge_nav_b: 0,
      judge_nav_c: 0,
      comdata:[],
      deliverdata:[],
      judge_receive:1,
      isshow:true,
      p1:1,
      p2:1,
      p3:1
  },
  //导航切换
  click_nav_a:function(){
    var that = this
    var judge_nav_a = that.data.judge_nav_a
    var judge_nav_b = that.data.judge_nav_b
    var judge_nav_c = that.data.judge_nav_c
    that.setData({
        judge_nav_a: 1, 
        judge_nav_b: 0,
        judge_nav_c: 0
    })
  },
  click_nav_b: function () {
      var that = this
      var judge_nav_a = that.data.judge_nav_a
      var judge_nav_b = that.data.judge_nav_b
      var judge_nav_c = that.data.judge_nav_c
      that.setData({
          judge_nav_a: 0,
          judge_nav_b: 1,
          judge_nav_c: 0
      })
      that.deliver()
  },
  click_nav_c: function () {
      var that = this
      var judge_nav_a = that.data.judge_nav_a
      var judge_nav_b = that.data.judge_nav_b
      var judge_nav_c = that.data.judge_nav_c
      that.setData({
          judge_nav_a: 0,
          judge_nav_b: 0,
          judge_nav_c: 1
      })
  },
  click_skip: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/new_page/new_page?id=' + id,
    })
  },
  click_pl: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + id,
    })
  },
  receive: function(){
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/receive',
      data: { 
        page: that.data.p1,
        token: token
       },
      success: function (res) {
        if(res.data == ''){
        }else{
          that.data.p1 = that.data.p1 + 1
          var com = res.data.com
          var art = res.data.art
          var user = res.data.user
          for (var i in com) {
            com[i].mood = art[com[i].artid].mood
            if (!com[i].mood) continue;
            com[i].mood = com[i].mood.replace(/[\r\n]/g, '');
            com[i].name = user[com[i].uid].name
            com[i].img = user[com[i].uid].img
            var timefor = new Date(that.strToDate(com[i].time));
            if (timefor.getDate() == Time.getDate()) {
              com[i].time = timefor.getHours() + ':' + timefor.getMinutes()
            } else {
              com[i].time = (timefor.getMonth()+1) + '-' + timefor.getDate()
            }
            that.data.comdata.push(com[i])
          }
          that.setData({
            comdata: that.data.comdata
          }); 
        }
      }
    })
  },
//   发出
  deliver: function(){
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/deliver',
      data: { 
        page: that.data.p2,
        token: token
      },
      success: function (res) {
        if(res.data == ''){

        }else{
          that.data.p2 = that.data.p2 + 1
          var com = res.data.com
          var qwer = ''
          for (var k in com) {
            com[k].mood = res.data.art[com[k].artid]
            if (!com[k].mood) continue;
            com[k].mood = com[k].mood.replace(/[\r\n]/g,'');
            com[k].name = res.data.user.name
            com[k].img = res.data.user.img
            var timefor = new Date(that.strToDate(com[k].time));
            if(timefor.getDate() == Time.getDate()){
              com[k].time = timefor.getHours()+':'+timefor.getMinutes()
            }else{
              com[k].time = (timefor.getMonth()+1) + '-' + timefor.getDate()
            }
            that.data.deliverdata.push(com[k])
          }
          that.setData({
            deliverdata: that.data.deliverdata,
          });
        }
      }
    })
  },
  strToDate(dateObj) {
    dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
    dateObj = dateObj.slice(0, dateObj.indexOf("."))
    return new Date(dateObj)
  },
  //滑动切换页面
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.receive()
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
    if(wx.showLoading){wx.showLoading({
      title: "加载中"
    })};
    
    var that = this
    if (that.data.judge_nav_a){
      that.receive()
      
    }
    if (that.data.judge_nav_b){
      that.deliver()
    }
    if (that.data.judge_nav_c){

    }
    if (wx.hideLoading){
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})