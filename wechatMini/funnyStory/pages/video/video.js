// pages/video/video.js
const app = getApp()
var imageUtil = require('../../utils/imageheight.js');

var allfn = require('../../utils/fn.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_item: {},
    can:true,
    danmuList: [],
      banner:[],
      show:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


      this.setData({
        id:options.id
      })
      var id = options.id;
      var token = wx.getStorageSync("token")
      //获取当前视频
      wx.request({
        url: "https://xh.jiqixing.com/xiaohua/detail",
        method: "GET",
        data: {
          token,
          id
        },
        success: (res) => { 
          // console.log(res);
          this.setData({
            video_item: res.data
          })
        }
      })
      

      //获取弹幕
      wx.request({
        url: 'https://xh.jiqixing.com/xiaohua/getBarrageList',
        method:"POST",
        success:(res)=>{
          // console.log(res);
          if (res.data.data[0].status==1){
            this.setData({
              danmuList: res.data.data
            })
          }
          // console.log(this.data.danmuList)
          }
      })
      //获取广告图
      wx.request({
        url: 'https://xh.jiqixing.com/xiaohua/getSoftwareList',
        method:"POST",
        data:{
        },
        success:(res)=>{
          console.log(res);
          this.setData({
            banner:res.data.data
          })
        }
      })
  },
  //获取视频列表
  get_video_list: function () {
    if(!this.data.can){
      return;
    }
    this.setData({
      can:false
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'https://xh.jiqixing.com/xiaohua/getNextJoke',
      method:"GET",
      data:{
        joke_id:this.data.id,
        type:3
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==200){
          this.setData({
            video_item:res.data.data,
            id:res.data.data.id
          })
          wx.pageScrollTo({
            scrollTop: 0,
            duration:100,
          })

          var timer = setTimeout(()=>{
            clearTimeout(timer)
            this.setData({
              can:true
            })
          },1000)
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      show:false
    })
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.get_video_list()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  //评论
  pinglun:function(e){
    var id = this.data.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  },
  //回到首页
  go_home:function(){
    wx.switchTab({
      url:"/pages/index/index"
    })
  },
  //点赞
  dianzan:function(){
    // console.log("dainzan ")
    var type = this.data.video_item.isgood?"cancel":"good";
    var token = wx.getStorageSync("token");
    var id = this.data.id;
    wx.request({
      url: 'https://xh.jiqixing.com/xiaohua/good',
      method:"POST",
      data:{
        type,
        token,
        id,
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==0){
          wx.showToast({
            title: '操作成功！',
          })
          this.setData({
            "video_item.good_num":1+ Number(this.data.video_item.good_num),            
            "video_item.isgood":true,
          })
        }else{
          wx.showToast({
            title: '您已点赞',
          })
        }
      }
    })
  },
  //去app
  go_app:function(e){
    var appid = e.currentTarget.dataset.id;
    wx.navigateToMiniProgram({
      appId: appid,
    })
  },
  //视频开始播放
  play:function(){
    var time = 0;
    if(this.banner.length==0){
      return;
    }
    var timer = setInterval(() => {
      time++;
      if (time == this.data.banner[0].time) {
        clearInterval(timer)
        this.setData({
          "banner[0].status": 0
        })
      }
    }, 1000)
  },
  share_img:function(res){
    wx.showToast({
      title: '惦记了',
    })
  }
})