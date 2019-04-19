//index.js
//获取应用实例
const app = getApp()
var imageUtil = require('../../utils/imageheight.js');

var allfn = require('../../utils/fn.js');


Page({
  data: {
    height: "",
    pic_list: [],//推荐列表
    recomment_page: 0,
  },
  onLoad: function () {


  },
  onShow: function () {

    this.get_recomment_list();


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
    var type = 2;
    var format = 0;
    var page = ++this.data.recomment_page;
    allfn.allfn.get_list(token, type, page, format, this)
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

          var list = this.data.pic_list
          if (list) {
            var len = list.length
            for (var i = 0; i < len; i++) {
              if (list[i].id == id) {
                ++list[i].share_num
              }
            }
            this.setData({
              pic_list: list
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
    this.get_recomment_list();
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  }

})
