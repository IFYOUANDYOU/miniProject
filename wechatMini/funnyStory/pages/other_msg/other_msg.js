// pages/index/index_4.js
var allfn = require("../../utils/fn.js");
var app = getApp();
var imageUtil = require('../../utils/imageheight.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    care_list:[],//用户关注
    recomment_list: [],//用户帖子,
    care_list:[],//用户收藏
    list: [
      { name: "帖子", index: 0 },
      { name: "收藏", index: 1 },
    ],
    current_index: 0,
    item:{},
    id:"",
    invitation_page:0,
    collection_page:0,
    write_name: true,
    new_name: "",
    videoContext: "",//视频播放api

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var userid = options.userid;
    // console.log(userid);
    this.setData({
      id:userid
    })
    wx.showLoading({
      title: '加载中...',
    })
    var token = wx.getStorageSync("token");
//获取用户信息
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/userinfo",
      method:"GET",
      data:{
        id:this.data.id,
        token
      },
      success:(res)=>{
        // console.log(res);
        this.setData({
          item:res.data
        })
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
    //获取用户帖子
    this.get_invitation();

    //获取用户收藏
    this.get_collection();

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
     wx.showLoading({
       title: '加载中...',
     })
     switch(this.data.current_index){
       case 0:
         this.get_invitation();
         break;
       case 0:
         this.get_collection();
         break;
        
     }
     
  },

  //分享段子
  onShareAppMessage: function (e) {
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
        // console.log(res)
        if (res.data.code == 0) {
          var list = this.data.recomment_list
          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              recomment_list: list
            })
          }


          var list = this.data.care_list
          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              care_list: list
            })
          }
          wx.showToast({
            title: '分享成功',
          })
        }
      }
    })
  },

  // //swiper滚动事件
  // change_index: function (e) {

  //   var index = e.detail.current;
  //   allfn.allfn.change_index(index,this);
  // },
  // 顶部点击
  click_index: function (e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    this.setData({
      current_index: index,
      now_index: "item" + index
    })
  },
  //图片自适应
  getheight: function (e) {
    var oheight = imageUtil.imageUtil(e);
    this.setData({
      height: oheight
    })
  },


  //获取帖子
  get_invitation:function(){
    var token = wx.getStorageSync("token");
    var user_id = this.data.id;
    var page = ++this.data.invitation_page
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/userJoke",
      method: "GET",
      data: {
        token,
        user_id,
        page
      },
      success:(res)=>{
        // console.log(res);
        if(res.data){
          var list = this.data.recomment_list;
          list = list.concat(res.data)
          this.setData({
            recomment_list: list
          })
        }else{
          this.setData({
            invitation_page:--this.data.invitation_page
          })
        }
        wx.hideLoading();
      }
    })
  },
  //获取用户收藏
  //获取帖子
  get_collection: function () {
    var token = wx.getStorageSync("token");
    var user_id = this.data.id;
    var page = ++this.data.collection_page
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/userCollection",
      method: "GET",
      data: {
        token,
        user_id,
        page
      },
      success: (res) => {
        // console.log(res);
        if (res.data) {
          var list = this.data.care_list;
          list = list.concat(res.data)
          this.setData({
            care_list: list
          })
        } else {
          this.setData({
            collection_page: --this.data.collection_page
          })
        }
        wx.hideLoading();

      }
    })
  },

 


  //点赞
  click_thumbs: function (e) {
    // console.log(e);
    var token = wx.getStorageSync("token");
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    // console.log(token+"---"+id+"---"+type)
    allfn.allfn.click_thumbs(token, id, type, this);
  },

  //点踩
  click_zandown: function (e) {
    var token = wx.getStorageSync("token");
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    allfn.allfn.click_zandown(token, id, type, this)
  },
  //点击输入段友名
  writeName: function () {
    this.setData({
      write_name: false
    });
  },
  //获取input框内容
  get_input: function (e) {
    // console.log(e.detail.value);
    this.setData({
      new_name: e.detail.value
    })
    // console.log(this.data.new_name + "---")
  },
  //修改段友名
  send_name: function () {
    if (!this.data.new_name) {
      wx.showModal({
        title: '提示',
        content: '不能修改空得段友名哦！',
        showCancel: false
      })
      return;
    }
    var token = wx.getStorageSync("token");
    var name = this.data.new_name;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/saveNick",
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        token,
        nickname: name
      },
      success: (res) => {
        // console.log(res);
        if (res.code == 0) {
          this.setData({
            "item.nickname": name,
            write_name: true
          })
          wx.showToast({
            title: '修改成功！',
          })
        } else {
          wx.showToast({
            title: '修改失败！',
          })
        }

      }
    })
  },
  //取消修改
  cancel: function () {
    this.setData({
      write_name: true
    })
  },
  // 关注用户
  care_user:function(e){
    var token = wx.getStorageSync("token");
    var to_user_id = e.currentTarget.dataset.id;
    var myid = wx.getStorageSync("user_id");
    if (to_user_id == myid) {
      wx.showModal({
        title: '提示',
        content: '不能自己关注自己哦！',
        showCancel: false
      })
      return;
    }
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/follow",
      method:"POST",
      data:{
        token,
        to_user_id
      },
      success:(res)=>{
        // console.log(res);
        var OK = this.data.item.isfollow ? false : true;
        if(res.data.code==0){
          this.setData({
            "item.isfollow": OK
          })
          wx.showToast({
            title: '操作成功！',
          })
        }else{
          wx.showToast({
            title: '操作失败',
          })
        }
      }
    })
  },
  //去详情页
  godetail: function (e) {
    var id = e.currentTarget.dataset.id;
    allfn.allfn.mjs_godetail(id);
    // console.log(allfn)
  },

  myplay: function (e) {
    // console.log(e)
    var id = e.currentTarget.id;
    // console.log(id);
    var video = wx.createVideoContext(id);

    this.setData({
      videoContext: video
    })
    this.data.videoContext.play();

  }
})