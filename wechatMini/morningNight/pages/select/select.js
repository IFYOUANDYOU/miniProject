// pages/select/select.js
var app = getApp();
var base_url = app.globalData.requestUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    content:"",
    type:"",
    index:0,
    swiper_list:[],
    show:true,
    sign_img:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    // console.log(type)
    this.setData({
      type
    })
    //获取系统时间
    var date = new Date();
    var day = this.db_num(date.getDate()); 
    var month = this.db_num(date.getMonth()+1); 
    var year = this.db_num(date.getFullYear()); 
    var xiqi = this.get_day(date.getDay()); 
     this.setData({
       day,
       month,
       year,
       xiqi
     })

    wx.request({
      url: base_url +'/sign/api/getTemplate',
      method:"POST",
      data:{
        type
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==200){
          this.setData({
            swiper_list:res.data.data
          })
        }
      }
    })
  },
  //两位数不足补全
  db_num:function(num){
    if(num<10){
      num = "0"+num;
    }
    return num;
  },
  //获取星期
  get_day:function(num){
    switch(num){
      case 0:
      return "星期天"
      case 1:
        return "星期一"
      case 2:
        return "星期二"
      case 3:
        return "星期三"
      case 4:
        return "星期四"
      case 5:
        return "星期五"
      case 6:
        return "星期六"
      default:
      break;
    }
  },
  //滑块滑动
  change:function(e){
    // console.log(e);
    this.setData({
      index:e.detail.current
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //选中框发生改变
  box_name_change:function(e){
    // console.log(e);
  },
  //确认模版
  affirm:function(){
    this.setData({
      show:false
    })
  },
  //名字输入框
  get_name:function(e){
    // console.log(e);
    this.setData({
      name:e.detail.value
    })
  },
  //内容输入框
  get_content: function (e) {
    // console.log(e);
    this.setData({
      content: e.detail.value
    })
  },
  //生成日签
  ok:function(e){
    wx.showLoading({
      title: '正在生成日签...',
      mask:true,
    })
    var sign_type = this.data.type;
    var content = this.data.content;
    var name = this.data.name;
    var template_id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync("token");
    wx.request({
      url: base_url +'/sign/api/sign',
      method:"POST",
      data:{
        sign_type,
        content,
        name,
        template_id,
        token
      },
      success:(res)=>{
        // console.log(res)
        wx.hideLoading();
        if(res.data.code==200){
          this.setData({
            sign_img:res.data.data.sign_img
          })
          // console.log(this.data.sign_img)
          wx.setStorageSync("img",this.data.sign_img)
          wx.navigateTo({
            url: '/pages/sign_ok/sign_ok?',
          })
        } else if (res.data.code==411){
          wx.showToast({
            title: '已经签过到了！',
          })
        }else{
          wx.showToast({
            title: '请检查字数！',
            icon:"none"
          })
        }
      }
    })
  }

})