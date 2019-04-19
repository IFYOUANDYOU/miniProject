// pages/rank/rank.js
var app = getApp();
var base_url = app.globalData.requestUrl;
var morning_page = 1;
var night_page = 1;
var morning_list = [];
var night_list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:1,
    list:[
    
      ],
    morning_list:[],
    night_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list("1");
    this.get_list("2");
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
    this.setData({
      morning_list,
      night_list
    })
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
    var select = this.data.select;
    this.get_list(select);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取排行榜
  get_list:function(type){

    var page = type==1?morning_page:night_page;
    // console.log(page)
    // console.log(type)
    if(page>5){
      return;
    }
    wx.request({
      url: base_url +'/sign/api/ranking',
      method:"POST",
      data:{
        type,
        page,
      },
      success:(res)=>{
        // console.log(res.data.data)
        // console.log(res.data.data.length);
        if(res.data.data.length){
         
          if(type==1){
            morning_page++;
            // console.log(1)
            var list =this.data.morning_list;
            list = list.concat(res.data.data);
            this.setData({
              morning_list:list
            })
            morning_list=list
            // console.log(this.data.morning_list)
          }else{
            // console.log(2)
            night_page++;
            var list = this.data.night_list;
            list = list.concat(res.data.data);
            this.setData({
              night_list: list
            })
            night_list = list
          }
        }
      }
    })
  },
  //点击顶部
  change:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      select:index
    })
  }
})