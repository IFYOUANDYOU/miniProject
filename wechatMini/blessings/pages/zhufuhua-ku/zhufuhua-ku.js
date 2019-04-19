// pages/zhufuhua-ku/zhufuhua-ku.js

var app = getApp();

var base_url = app.globalData.base_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    type_list:[],
    list_page:0,
    type_page:0,
    current_index:10,
    bg_img:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_type_list();
    this.get_list();
    this.setData({
      bg_img: base_url +"/static/images/zhufuhua-ku-bg.png"
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
  //获取顶部列表
  get_type_list: function () {
    wx.request({
      url: base_url +"/index/api/festival",
      method: "GET",
      success: (res) => {
        if(res.data){
          this.setData({
            type_list:res.data
          })
        }
      }

    })
  },

  //点击显示操作框
  show:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var len = list.length
    
    for(var i=0;i<len;i++){
      if(index==i){
        list[index].show = true
      }else{
        list[i].show=false
      }
    }
    this.setData({
      list
    })
  },
  //选择祝福语
  choose:function(e){
    var content = e.currentTarget.dataset.content;
    wx.setStorageSync("content",content);
    wx.navigateBack()
  },
  //复制祝福语
  copy:function(e){
    var content = e.currentTarget.dataset.content;
    var index = e.currentTarget.dataset.index;
    if (wx.setClipboardData) {
      wx.setClipboardData({
        data: content,
        success:(res)=>{
          var list = this.data.list;
          list[index].show = false;
          this.setData({
            list
          })
          wx.showToast({
            title: '复制成功！',
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
   
  },





  //点击改变顶部节日并触发刷新
  change_currrent: function (e) {
    this.data.list_page = 0;
    this.setData({
      current_index: e.currentTarget.dataset.id,
      list:[]
    })
    this.get_list();
  },

  //获取底部内容区
  get_list:function(){
    var festival_id = this.data.current_index;
    var page = ++this.data.list_page;
    console.log(this.data.list_page);
    wx.request({
      url: base_url +"/index/api/contentList",
      method:"GET",
      data:{
        festival_id,
        page
      },
      success:(res)=>{
        console.log(res);
        if(res.data){
          var list = res.data;
          list = list.concat(this.data.list);
          this.setData({
              list
          })

        }else{
          --this.data.list_page
        }
      }

    })
  }

})