// pages/index/index_4.js
var allfn = require("../../utils/fn.js");
var app = getApp();
var imageUtil = require('../../utils/imageheight.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    list:[
      {name: "帖子", index: 0 },
      { name: "收藏", index: 1 },
      { name: "关注", index: 2 },
      // { name: "评论", index: 3 },
    ],
    current_index:0,
    write_name:true,
    new_name:"",
    recomment_list: [],//用户帖子,
    care_list: [],//用户收藏
    item_care:[],//用户关注
    invitation_page: 0,
    collection_page: 0,
    care_page:0,


    videoContext: "",//视频播放api

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var uid = wx.getStorageSync("user_id");
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/userinfo",
      method:"GET",
      data:{
        token,
        id:uid
      },
      success:(res)=>{
        // console.log(res);
        this.setData({
          item:res.data,
          avatar:res.data.avatar,
          username:res.data.username
        })
        
      }
    })
    wx.getLocation({
      success:(res)=>{
        // console.log(res);
        var longitude = res.longitude
        var latitude = res.latitude  
        var city = allfn.allfn.loadCity(longitude, latitude,this);
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
    this.setData({
      recomment_list: [],//用户帖子,
      care_list: [],//用户收藏
      item_care: [],//用户关注
      invitation_page: 0,
      collection_page: 0,
      care_page: 0,
    })
    //获取用户帖子
    this.get_invitation();

    //获取用户收藏
    this.get_collection();
   
    //获取用户关注
    this.get_care_list();
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
      });
      switch(this.data.current_index){
        case 0:
          this.get_invitation();
          break;
        case 1:
          this.get_collection();
          break;
        case 2:
          this.get_care_list();
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
//点击输入段友名
  writeName:function(){
    this.setData({
      write_name:false
    });
  },
//获取input框内容
  get_input:function(e){
    // console.log(e.detail.value);
    this.setData({
      new_name: e.detail.value
    })
    // console.log(this.data.new_name+"---")
  },
  //修改段友名
  send_name:function(){
    if(!this.data.new_name){
      wx.showModal({
        title: '提示',
        content: '不能修改空的或者相同的段友名哦！',
        showCancel:false
      })
      return;
    }
    var token = wx.getStorageSync("token");
    var name = this.data.new_name;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/saveNick",
      method:"POST",
      data:{
        token,
        nickname:name
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==0){
          this.setData({
              "item.nickname":name,
              write_name:true
          })
          wx.showToast({
            title: '修改成功！',
          })
        }else{
          wx.showToast({
            title: '修改失败！',
          })
        }
        
      }
    })
  },
  //取消修改
  cancel:function(){
    this.setData({
      write_name:true
    })
  },

  //获取帖子
  get_invitation: function () {
    var token = wx.getStorageSync("token");
    var user_id = wx.getStorageSync("user_id");;
    var page = ++this.data.invitation_page
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/userJoke",
      method: "GET",
      data: {
        token,
        user_id,
        page
      },
      success: (res) => {
        // console.log(res);
        if (res.data) {
          var list = this.data.recomment_list;
          list = list.concat(res.data);
          this.setData({
            recomment_list: list
          })
          // console.log(this.data.recomment_list)
        } else {
          this.setData({
            invitation_page: --this.data.invitation_page
          })
        }
        wx.hideLoading();
      }
    })
  },
  //获取用户收藏

  get_collection: function () {
    var token = wx.getStorageSync("token");
    var user_id = wx.getStorageSync("user_id");
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
          list = list.concat(res.data);
          this.setData({
            care_list:list
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
  //获取用户关注
  get_care_list: function () {
    var token = wx.getStorageSync("token");
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/myFollow",
      method: "GET",
      data: {
        token,
        page: ++this.data.care_page
      },
      success:(res)=>{
        // console.log(res);
        if(res.data){
          if (res.data) {
            var list = this.data.item_care;
            list = list.concat(res.data);
            this.setData({
              item_care: list
            })
            // console.log(this.data.item_care)
          } else {
            this.setData({
              care_page: --this.data.care_page
            })
          }
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


  //删除帖子
  delete_tiezi:function(e){
    var joke_id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync("token")
    wx.showModal({
      title: '提示',
      content: '你确定要删除这个作品吗？',
      success:(res)=>{
        // console.log(res)
          if(res.confirm){
            wx.request({
              url: "https://xh.jiqixing.com/xiaohua/deleteJoke",
              method: "POST",
              data: {
                joke_id,
                token
              },
              success: (res) => {
                // console.log(res);
                if (res.data.code == 0) {
                  var list = this.data.recomment_list;
                  for (var i = 0; i < list.length; i++) {
                    if (joke_id == list[i].id) {
                      list.splice(i, 1);
                    }
                  }
                  this.setData({
                    recomment_list: list
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '删除失败',
                    showCancel: false
                  })
                }
              }
            })
          }
      },

    })
  },
  //去详情页
  godetail: function (e) {
    // console.log(e);
    var  status = e.currentTarget.dataset.status;
    if(status==1){
      wx.showToast({
        title: '该贴还未审核！',
      })
    }else if(status==3){
      wx.showToast({
        title: '该贴审核未通过',
      })
    }else{
      var id = e.currentTarget.dataset.id;
      allfn.allfn.mjs_godetail(id);
    }
    
    // console.log(allfn)
  },
  //取消关注或者关注
  do_care:function(e){

  },
  //取消关注或者关注
  do_care:function(e){
    // console.log(e);
    var token = wx.getStorageSync("token");
    var to_user_id = e.currentTarget.dataset.id;
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/follow",
      method:"POST",
      data:{
        token,
        to_user_id
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==0){
          var list = this.data.item_care;

         for(var i=0;i<list.length;i++){
           if (list[i].id == to_user_id){
            list[i].isfollow=list[i].isfollow?false:true
           }
         }
         this.setData({
           item_care: list
         })
        }
      }

    })
  },
  go_other_detail: function (e) {
    // console.log(e)
    var userid = e.currentTarget.dataset.userid;
    // console.log("wwwww"+userid)
    wx.navigateTo({
      url: '/pages/other_msg/other_msg?userid=' + userid,
    })
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