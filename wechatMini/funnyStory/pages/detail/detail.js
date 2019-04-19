// pages/detail/detail.js
var app = getApp();
var imageUtil = require('../../utils/imageheight.js');
var allfn = require("../../utils/fn.js");
const recorderManager = wx.getRecorderManager();
var timer = null;
var time=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    id:"",
    send_type:true,//发送类型
    send_content:"",//评论内容
    send_name:"",
    comment_page:0,
    comment_list:[],
    duration:0,
    path:"",
    send_id:"",
    pid:0,
    videoContext: "",//视频播放api


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    // console.log(options);
    wx.showLoading({
      title: '加载中...',
    })
    var myid = wx.getStorageSync("user_id");
    this.setData({
      id:id
    })
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/detail",
      method:"GET",
      data:{
        token,
        id
      },
      success:(res)=>{
        console.log(res);
        this.setData({
          item:res.data
        })
        console.log(this.data.item);
        wx.hideLoading()
      }
    })
    this.get_comment();
    
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
    wx.setStorageSync("detail", )
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
    wx.showLoading({
      title: '加载中...',
    })
    this.get_comment();
  },

  //分享段子
  onShareAppMessage: function (e) {
    console.log(e)
    var id = e.target.dataset.id;
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/shareJoke",
      method: "POST",
      data: {
        token,
        joke_id: id
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          this.setData({
            "item.share_num":++this.data.item.share_num
          })
        
          wx.showToast({
            title: '分享成功',
          })
        }
      }
    })
  },

  //获取评论列表
  get_comment:function(){
    var token = wx.getStorageSync("token");
    var id =this.data.id;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/getComment",
      method: "GET",
      data: {
        token,
        id,
        page: ++this.data.comment_page
      },
      success: (res) => {
        console.log(res)
        if (res.data.data) {
          var list = this.data.comment_list;
          list = list.concat(res.data.data)
          for(var i=0;i<list.length;i++){
            if(list[i].child.length>2){
              list[i].more=true;
            }
          }
          this.setData({
            comment_list: list
          })
        } else {
          --this.data.comment_page
        }
        console.log(this.data.comment_list)
        wx.hideLoading();
      }
    })
  },
  

  // 点赞：
  click_thumbs: function (e) {
    var token = wx.getStorageSync("token");
    var id = this.data.id;
    var type = e.currentTarget.dataset.type;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/good",
      method: "POST",
      data: {
        token,
        id,
        type,
      },
      success: (res) => {
        // console.log(res);
        // console.log(that.data.care_list)
          this.setData({
            "item.isgood":this.data.item.isgood?false:true,
            "item.good_num":type=="cancel"?--this.data.item.good_num:++this.data.item.good_num
          })
        wx.showToast({
          title: '操作成功',
        })

      }
    })
  },
  // 点踩：
  click_zandown: function (e) {
    var token = wx.getStorageSync("token");
    var id = this.data.id;
    var type = e.currentTarget.dataset.type;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/bad ",
      method: "POST",
      data: {
        token,
        id,
        type,
      },
      success: (res) => {
        this.setData({
          "item.isbad": this.data.item.isbad ? false : true,
          "item.bad_num": type == "cancel" ? --this.data.item.bad_num : ++this.data.item.bad_num
        })
        wx.showToast({
          title: '操作成功',
        })

      }
    })
  },
//关注
 care:function(){
    var token = wx.getStorageSync("token");
    var id = this.data.item.user_id;
    var myid = wx.getStorageSync("user_id");
    if(id==myid){
      wx.showModal({
        title: '提示',
        content: '不能自己关注自己哦！',
        showCancel:false
      })
      return;
    }
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/follow",
      method:"POST",
      data:{
        token,
        to_user_id:id,
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          this.setData({
            "item.isfollow":this.data.item.isfollow?false:true
          })
        }
        wx.showToast({
          title: '操作成功！',
        })
      },
    })
 },
  //收藏或者取消收藏
  collection:function(e){
    console.log(e)

    var token = wx.getStorageSync("token");
    var joke_id = e.currentTarget.dataset.id;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/collection",
      method:"POST",
      data:{
        token,
        joke_id
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          this.setData({
            "item.collection_num": this.data.item.iscollection ? --this.data.item.collection_num : ++this.data.item.collection_num,
            "item.iscollection": this.data.item.iscollection?false:true,
            
          })

          wx.showToast({
            title: '操作成功！',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '操作失败',
            showCancel:false
          })
        }

      }
    })
  },
  //获取输入框内容
  get_content:function(e){
    console.log(e)
    var content = e.detail.value;
    this.setData({
      send_content: content
    })
  },
  //改变发送方式
  change_type:function(){
    this.setData({
      send_type:this.data.send_type?false:true
    })
  },

  //发送
  send:function(){
    var token = wx.getStorageSync("token")
    var joke_id = this.data.id;
    var pid = this.data.pid;

    if (!this.data.send_content){
      wx.showModal({
        title: '提示',
        content: '再写点内容吧！',
        showCancel:false
      })
      return;
    }
    if (this.data.send_type){
      wx.request({
        url: "https://xh.jiqixing.com/xiaohua/saveComment",
        method: "POST",
        data: {
          token,
          joke_id,
          pid,
          content: this.data.send_content
        },
        success: (res) => {
          console.log(res);
          this.setData({
            comment_page:0,
            comment_list: [],
            send_content:""
          })
          this.get_comment();
          wx.showToast({
            title: '发布成功！',
          })
        }
      })
    }else{
      
    }

  },

  //开始录音
  on_start:function(){
    console.log(123)
    recorderManager.start();
    recorderManager.onStart((res)=>{
      console.log(res);
      timer = setInterval((res)=>{
        time++
        console.log(time)
      },1000)
    })
  },
  //结束录音
  on_end:function(){
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log(res);
      var long = parseInt(res.duration / 1000);

      if(long<1){
        wx.showModal({
          title: '提示',
          content: '录音时间过短！',
        })
        return;
      }
      this.setData({
        duration:long,
        path:res.tempFilePath
      })
      wx.showToast({
        title: "正在发布...",
      })
      clearInterval(timer)

      var token = wx.getStorageSync("token");
      var joke_id = this.data.id;
      var pid = 0;
 
    wx.uploadFile({
      url: 'https://xh.jiqixing.com/xiaohua/saveComment',
      filePath: path,
      name: 'file',
      formData:{
        token,
        joke_id,
        pid,
        duration: this.data.duration,
      },
      success:(res)=>{}
    })


     
    })
  },



  //赞评论
  comment_up:function(e){
    console.log(123)
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/good_comment",
      method:"POST",
      data:{
        id,
        type,
        token
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          var list = this.data.comment_list;
          for(var i=0;i<list.length;i++){
            if(list[i].id==id){
              list[i].good_num = list[i].isgood ? --list[i].good_num : ++list[i].good_num ;
              list[i].isgood = list[i].isgood?false:true;
            }
          }
          this.setData({
            comment_list:list
          })

        }
      }
    })
    
  },
  //踩评论
  comment_down:function(e){
    console.log(123)
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/bad_comment",
      method: "POST",
      data: {
        id,
        type,
        token
      },
      success: (res) => {
        console.log(res);
        var list = this.data.comment_list;
        for (var i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            list[i].bad_num = list[i].isbad ? --list[i].bad_num : ++list[i].bad_num;
            list[i].isbad = list[i].isbad ? false : true;
          }
        }
        this.setData({
          comment_list: list
        })

      }
        
    })
  },


  //评论他人
  change_sendname:function(e){
    console.log(e);
    var pid = e.currentTarget.dataset.id;
    this.setData({
      pid,
      send_name:"回复："+e.currentTarget.dataset.name
    })
  },
  //图片自适应
  getheight: function (e) {
    var oheight = imageUtil.imageUtil(e);
    this.setData({
      height: oheight
    })
  },
  // 失去焦点判定
  onblur:function(){
    console.log("sss")
    if (!this.data.send_content){
      this.setData({
        pid:0,
        send_name:""
      })
    }
  },

  myplay: function (e) {
    console.log(e)
    var id = e.currentTarget.id;
    console.log(id);
    var video = wx.createVideoContext(id);

    this.setData({
      videoContext: video
    })
    this.data.videoContext.play();

  },
  show_more:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var list = this.data.comment_list
    for(var i=0;i<list.length;i++){
      if(id==list[i].id){
        list[i].more=false;
      }
    }
    this.setData({
      comment_list:list
    })
  }


})