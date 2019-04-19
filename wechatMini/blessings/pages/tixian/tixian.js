// pages/tixian/tixian.js
var app = getApp();
var base_url = app.globalData.base_url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:"",
    tixian_money:"",
    show_fail:false,//余额不足
    show_success:false,//提现成功
    shouxufei:"0.00",//手续费
    fo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var money = options.money;
    console.log(money);
    this.setData({
      money
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取输入框金额
  get_money:function(e){
    var money = parseFloat(e.detail.value);
    money = money.toFixed(2);
    console.log(money);
    this.setData({
      otixian_money:money
    })
  },
  //失去焦点
  set_money:function(){
    console.log(this.data.otixian_money)
    console.log(isNaN(this.data.otixian_money))
    if(isNaN(parseFloat(this.data.otixian_money))){
      wx.showModal({
        title: '提示',
        content: '请输入正确的提款金额！',
        showCancel:false
      })
      this.setData({
        tixian_money:""
      })
      return;
    }
    if(this.data.otixian_money>this.data.money){
      this.setData({
        show_fail:true
      })
      return;
    }
    this.setData({
      tixian_money:this.data.otixian_money,
      shouxufei: (this.data.otixian_money*1/100).toFixed(2),
    })
  },
  //隐藏余额不足提示框
  hide_fail:function(){
    this.setData({
      show_fail:false,
      tixian_money: ""
    })

  },
  //隐藏提现成功框
  hide_success:function(){
    this.setData({
      show_success:false
    })
  },
  //发起提现
  tixian:function(){
    if (isNaN(this.data.tixian_money)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的提款金额！',
      })
      this.setData({
        tixian_money: ""
      })
      return;
    } 
    if (this.data.tixian_money > this.data.money) {
      this.setData({
        show_fail: true
      })
      return;
    }
    console.log(this.data.tixian_money/100)
    if ((this.data.tixian_money-this.data.tixian_money*1/100)<1){
      wx.showModal({
        title: '提示',
        content: '提现金额扣除手续费不能少于1！',
      })
      this.setData({
        tixian_money: ""
      })
      return;
    }


    
      //发起提现
      wx.request({
        url: base_url + "/index/weixin/Withdrawals",
        method: "POST",
        data: {
          token: wx.getStorageSync("token"),
          money: this.data.tixian_money
        },
        success: (res) => {
          console.log(res);
          if(res.code==0){
            this.setData({
              show_success:true
            })
          }else if(res.code==5){
            this.setData({
              show_fail: true
            })
          }else{
            wx.showToast({
              title: '提现失败！',
              icon:"none"
            })
          }
          this.setData({
            shouxufei: "0.00",
            tixian_money: ""
          })
        }
      })
    
  },
  //全部提现
  all_tixian:function(){
    
    this.setData({
      tixian_money:this.data.money
    })
    
  }
})