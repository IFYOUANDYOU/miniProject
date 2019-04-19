//index.js
//获取应用实例
const app = getApp()
var imageUtil = require('../../utils/imageheight.js');

var allfn = require('../../utils/fn.js');


Page({
  data: {
    list: [
      // { name: "关注", index: 0 },

    ],

    height: "",
    current_index: 1,//轮播当前位置
    now_index: "item1",//顶部当前位置
    recomment_list: [],//推荐列表
    video_list: [],//视频列表
    care_list: [],//关注列表
    pic_list: [],//图片列表
    forge_list: [],//段子列表
    rank_list: [],//排行列表


    recomment_page: 0,
    video_page: 0,//视频列表
    care_page: 0,
    pic_page: 0,
    forge_page: 0,
    rank_page: 0,

    videoContext: "",//视频播放api


  },
  onLoad: function () {
    //检查登录状态
    wx.showLoading({
      title: '加载中...',
    })
    app.getUserInfo(function (token) {
      // console.log(token)
      wx.setStorageSync('token', token)
      app.getUserInfo()
    });

    this.get_recomment_list();
    this.get_video_list();
    this.get_pic_list();
    this.get_forge_list();
    this.get_rank_list();
    this.get_care_list();
  },
  onShow: function () {

  },
  //swiper滚动事件
  change_index: function (e) {
    var index = e.detail.current
    allfn.allfn.change_index(index, this);
  },
  // 顶部点击
  click_index: function (e) {
    var index = e.currentTarget.dataset.index;
    allfn.allfn.change_index(index, this);
  },
  //图片自适应
  getheight: function (e) {
    var oheight = imageUtil.imageUtil(e);
    this.setData({
      height: oheight
    })
  },
  //去详情页
  godetail: function (e) {
    var id = e.currentTarget.dataset.id;
    allfn.allfn.mjs_godetail(id);
    // console.log(allfn)
  },



  //获取推荐列表
  get_recomment_list: function () {
    var token = wx.getStorageSync("token");
    var type = 0;
    var format = 1;
    var page = ++this.data.recomment_page;
    allfn.allfn.get_list(token, type, page, format, this)

  },
  //获取段子列表
  get_forge_list: function () {
    var token = wx.getStorageSync("token");
    var type = 1;
    var format = 1;
    var page = ++this.data.forge_page
    allfn.allfn.get_list(token, type, page, format, this)
  },
  //获取图片列表
  get_pic_list: function () {
    var token = wx.getStorageSync("token");
    var type = 2;
    var format = 1;
    var page = ++this.data.pic_page
    allfn.allfn.get_list(token, type, page, format, this)
  },
  //获取视频列表
  get_video_list: function () {
    var token = wx.getStorageSync("token");
    var type = 3;
    var format = 1;
    var page = ++this.data.video_page
    allfn.allfn.get_list(token, type, page, format, this)
  },
  //获取排行
  get_rank_list: function () {
    var token = wx.getStorageSync("token");
    var type = 4;
    var format = 1;
    var page = ++this.data.rank_page
    allfn.allfn.get_list(token, type, page, format, this)
  },

  //获取关注
  get_care_list: function () {
    var token = wx.getStorageSync("token");
    var page = ++this.data.care_page;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/followList",
      method: "GET",
      data: {
        token,
        page,
      },
      success: (res) => {
        // console.log(res.data.data);

        if (res.data.data) {
          var list = this.data.care_list;
          list = list.concat(res.data.data)
          this.setData({
            care_list: list
          })
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
        // console.log(this.data.care_list)
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

  // 去他人中心
  go_other_detail: function (e) {
    // console.log(e)
    var userid = e.currentTarget.dataset.userid;
    // console.log("wwwww"+userid)
    wx.navigateTo({
      url: '/pages/other_msg/other_msg?userid=' + userid,
    })
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


          var list = this.data.forge_list

          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              forge_list: list
            })
          }


          var list = this.data.pic_list
          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              pic_list: list
            })
          }

          var list = this.data.video_list
          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              video_list: list
            })
          }

          var list = this.data.rank_list

          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                list[i].share_num++
              }
            }
            this.setData({
              rank_list: list
            })
          }
          wx.showToast({
            title: '分享成功',
          })
        }
      }
    })
  },



  //下拉刷新
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    });
    // token, type, page, format, that
    switch (this.data.current_index) {
      case 0:
        this.get_care_list();

        break;
      case 1:
        this.get_recomment_list();
        break;
      case 2:
        this.get_video_list();
        break;
      case 3:
        this.get_pic_list();
        break;
      case 4:
        this.get_forge_list();
        break;
      case 5:
        this.get_rank_list();
        break;
    }
  },

  //判定网络状态
  use: function () {

  },
  // myplay:function(e){
  //   console.log(e)
  //   var id = e.currentTarget.id;
  //   console.log(id);
  //   var video = wx.createVideoContext(id);

  //   this.setData({
  //     videoContext:video
  //   })
  //   this.data.videoContext.pause(); 
  //   if (!app.globalData.use_4g) {
  //     console.log(123)
  //     wx.getNetworkType({
  //       success: (res) => {
  //         console.log(res);
  //         if (res.networkType != "wifi") {
  //           wx.showModal({
  //             title: '提示',
  //             content: '当前网络状态不是WIFI，是否继续观看',
  //             success: (res) => {
  //               if(res.confirm){
  //                 this.data.videoContext.play(); 
  //                 app.globalData.use_4g=true;
  //               }else{
  //                 return;
  //               }
  //             }
  //           })
  //         }else{
  //           this.data.videoContext.play(); 
  //         }
  //       },
  //     })
  //   }else{
  //     this.data.videoContext.play(); 
  //   }
  // },
  myplay: function (e) {
    // console.log(e)
    var id = e.currentTarget.id;
    // console.log(id);
    var video = wx.createVideoContext(id);

    this.setData({
      videoContext: video
    })
    this.data.videoContext.play();

  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    switch (this.data.current_index) {
      case 0:
        this.setData({
          care_page: 0,
          care_list: [],
        })
        this.get_care_list();

        break;
      case 1:
        this.setData({
          recomment_page: 0,
          recomment_list: [],
        })
        this.get_recomment_list();
        break;
      case 2:
        this.setData({
          video_page: 0,
          video_list: [],
        })
        this.get_video_list();
        break;
      case 3:
        this.setData({
          pic_page: 0,
          pic_list: [],
        })
        this.get_pic_list();
        break;
      case 4:
        this.setData({
          forg_page: 0,
          forg_list: [],
        })
        this.get_forge_list();
        break;
      case 5:
        this.setData({
          rank_page: 0,
          rank_list: [],
        })
        this.get_rank_list();
        break;
    }
  },



})
