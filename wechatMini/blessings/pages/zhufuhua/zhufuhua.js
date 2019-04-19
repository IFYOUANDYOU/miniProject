// pages/zhufuhua/zhufuhua.js
var app = getApp();
var base_url = app.globalData.base_url;

/*2019-04-19新增*/
const head_list = [
  {
    id: 1,
    img: "https://img.52z.com/upload/news/image/20180419/20180419051254_75804.jpg",
    name: "这是一只猫"
  },
  {
    id: 2,
    img: "https://img.52z.com/upload/news/image/20180419/20180419051254_75804.jpg",
    name: "这是一只猫"
  }
]
/**************************/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    adtive:1,
    adtive1:1,
    send_name: "",
    
    /*2019-04-19 修改
    head_list: "",*/
    head_list: head_list,
    /**************************/

    show: false

    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //2019-04-19修改   取消getUserInfo()调用
    /*app.getUserInfo(function (token) {
      // console.log(token)
      wx.setStorageSync('token', token)
      // app.getUserInfo()
    });
    wx.request({
      url: base_url +"/index/api/people",
      method:"GET",
      success:(res)=>{
        // console.log(res);
        this.setData({
          head_list:res.data
        })
      }
    })
    wx.request({
      url: base_url + "/index/api/config",
      method: "GET",
      success: (res) => {
        // console.log(res);
        this.setData(
          {
            show: res.data.status == 1 ? true : false
          }
        )
      }
    })*/
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
    wx.removeStorageSync("content")
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
  adtive: function (e) {
    var num = e.currentTarget.dataset.num;
    var atv = this.data.adtive;
    if (num == atv) {
      num = num;
    }
    this.setData({
      adtive: num
    })
  },
  adtive1: function (e) {
    var num1 = e.currentTarget.dataset.num;
    var atv1 = this.data.adtive1;
    if (num1 == atv1) {
      num1 = num1;
    }
    this.setData({
      adtive1: num1
    })
  },
  //获取输入框信息
  get_name:function(e){

    var content = e.detail.value;

    this.setData({
      send_name:content
    })
  },
  //跳转到发送
  go_send:function(){
    // wx.setStorageSync("send_name", this.data.send_name);
    wx.navigateTo({
      url: '/pages/zhufuhua-txt/zhufuhua-txt?name=' + this.data.send_name + "&people_id=" + this.data.adtive +"&gender="+this.data.adtive1,
    })
  }
  
})