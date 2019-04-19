// pages/zhufuhua-txt/zhufuhua-txt.js

var app = getApp();
var base_url = app.globalData.base_url;
var animation = wx.createAnimation({
  duration:1000,
  timingFunction:"ease",
  delay:0
});
var ctx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send_name:"",
    content:"",
    signature:"",
    bottom_animation:null,
    user:{},
    time:"",
    ch:44,
    en:40,
    show_img:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options);
    var user = wx.getStorageSync("user");
    this.setData({
      user,
      people_id: options.people_id,
      gender:options.gender
    })
    // var name = wx.getStorageSync("send_name")
    if(options.name){
      var name = options.name;
      this.setData({
        send_name:name
      })
    }



    var window = wx.getSystemInfoSync();
    // console.log(window);
    this.setData({
      width: window.windowWidth,
      height: window.windowHeight
    });

    
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
    var content = wx.getStorageSync("content");

    var time = new Date();
    
    time  = time.getFullYear()+"年"+time.getMonth()+1+"月"+time.getDate()+"日";
    // console.log(time);
    this.setData({
      time
    })
    if (content) {
      this.setData({
        content
      })
    } else {
      this.get_ocontent();
    }
  },

//随机获取祝福语
get_ocontent:function(){
  //随机获取一条祝福语
  var people_id = this.data.people_id;
  var gender = this.data.gender;
  wx.request({
    url: base_url+"/index/api/getContent",
    method: "GET",
    data: {
      people_id,
      gender
    },
    success: (res) => {
      // console.log(res);
      if (res.data.code == 0) {
        if (res.data.data) {
          this.setData({
            content: res.data.data.content,
          })
          wx.setStorageSync("content", res.data.data.content)
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '获取祝福语失败！',
        })
      }
    }
  })
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
    // console.log("4562")
    app.globalData.name=this.data.send_name;
    app.globalData.content = this.data.content;
    app.globalData.signature = this.data.signature
    app.globalData.time = this.data.time,
    app.globalData.user= this.data.user
    // console.log(app.globalData.name)
      return {
        title:"送你最真诚得祝福！",
        path: "pages/zhufuhua-share-txt/zhufuhua-share-txt"
      }
  },

  //获取名字输入框内容
  get_name:function(e){
    var name = e.detail.value;
    this.setData({
      send_name:name
    })
  },
  //获取祝福语输入框得内容
  get_content:function(e){
    // console.log(e);
    var content = e.detail.value;
    wx.setStorageSync("content",content);
    this.setData({
      content
    })
  },
  //获取落款
  get_signature:function(e){
    var signature = e.detail.value;
    this.setData({
      signature
    })
  },
  //选择发送方式
  choose_send_type:function(){
    // console.log(this.data.send_name + "---" + this.data.content + "---" + this.data.signature)
    if (!this.data.send_name){
      wx.showModal({
        title: '提示',
        content: '还没有发送对象哦!',
        showCancel:false
      })
      return;
    }
    if (!this.data.content) {
      wx.showModal({
        title: '提示',
        content: '再写点祝福语吧!',
        showCancel:false
      })
      return;
    }
    if (!this.data.signature) {
      wx.showModal({
        title: '提示',
        content: '请输入落款!',
        showCancel:false
      })
      return;
    }
    animation.translateY(0).step();
    this.setData({
      bottom_animation:animation.export()
    })
  },

  //隐藏底部弹出框
  hide_bottom:function(){
    animation.translateY(480).step();
    this.setData({
      bottom_animation: animation.export()
    })
  },

  //点击换句祝福语
  change_content:function(){
    this.get_ocontent()
  },

  //生成图片
  creat_img:function(){
    wx.showLoading({
      title: '生成图片中...',
    })
    var that = this;
    var token = wx.getStorageSync("token");
    var content = that.data.content;
    var to_name = that.data.send_name;
    var from_name = that.data.signature;
    
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log(2)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(){
              console.log(1);
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.request({
                url: base_url + "/index/api/savePreImg",
                method: "POST",
                data: {
                  token,
                  content,
                  to_name,
                  from_name,
                  type:1
                },
                success: (res) => {
                  console.log(res);


                  if (res.data.code == 0) {

                    wx.downloadFile({
                      url: res.data.path,
                      success: (rs) => {
                        console.log(rs);
                        wx.saveImageToPhotosAlbum({
                          filePath: rs.tempFilePath,
                          success: (re) => {
                            console.log(re);
                            wx.hideLoading();
                            that.setData({
                              path: res.data.path,
                              show_img: true
                            })
                          },
                          fail: (re) => {
                            wx.hideLoading();
                            wx.showToast({
                              title: '图片保存失败',
                              icon: "none"
                            })
                          }
                        })

                      },
                      fail: (res) => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '图片下载失败',
                          icon: "none"
                        })
                      }
                    })

                  } else {
                    wx.hideLoading();
                    wx.showToast({
                      title: '图片生成失败！',
                      icon: "none"
                    })
                  }
                }
              })
            },
            fail() {
              wx.openSetting({
                success: (res) => {
                  console.log(3)
                  if (!res.authSetting["scope.writePhotosAlbum"]) {
                   wx.hideLoading();
                  }else{
                    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                    wx.request({
                      url: base_url + "/index/api/savePreImg",
                      method: "POST",
                      data: {
                        token,
                        content,
                        to_name,
                        from_name,
                        type:1
                      },
                      success: (res) => {
                        console.log(res);


                        if (res.data.code == 0) {

                          wx.downloadFile({
                            url: res.data.path,
                            success: (rs) => {
                              console.log(rs);
                              wx.saveImageToPhotosAlbum({
                                filePath: rs.tempFilePath,
                                success: (re) => {
                                  console.log(re);
                                  wx.hideLoading();
                                  that.setData({
                                    path: res.data.path,
                                    show_img: true
                                  })
                                },
                                fail: (re) => {
                                  wx.hideLoading();
                                  wx.showToast({
                                    title: '图片保存失败',
                                    icon: "none"
                                  })
                                }
                              })

                            },
                            fail: (res) => {
                              wx.hideLoading();
                              wx.showToast({
                                title: '图片下载失败',
                                icon: "none"
                              })
                            }
                          })

                        } else {
                          wx.hideLoading();
                          wx.showToast({
                            title: '图片生成失败！',
                            icon: "none"
                          })
                        }
                      }
                    })
                  }
                },
                fail:(res)=>{
                  console.log(4)
                  wx.hideLoading();
                }
              })
            }
          })
        } else {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          wx.request({
            url: base_url + "/index/api/savePreImg",
            method: "POST",
            data: {
              token,
              content,
              to_name,
              from_name,
              type:1
            },
            success: (res) => {
              console.log(res);


              if (res.data.code == 0) {

                wx.downloadFile({
                  url: res.data.path,
                  success: (rs) => {
                    console.log(rs);
                    wx.saveImageToPhotosAlbum({
                      filePath: rs.tempFilePath,
                      success: (re) => {
                        console.log(re);
                        wx.hideLoading();
                        that.setData({
                          path: res.data.path,
                          show_img: true
                        })
                      },
                      fail: (re) => {
                        wx.hideLoading();
                        wx.showToast({
                          title: '图片保存失败',
                          icon: "none"
                        })
                      }
                    })

                  },
                  fail: (res) => {
                    wx.hideLoading();
                    wx.showToast({
                      title: '图片下载失败',
                      icon: "none"
                    })
                  }
                })

              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '图片生成失败！',
                  icon: "none"
                })
              }
            }
          })
        }
      }
    })


    
   
  },
  //隐藏蒙层
  hide_img:function(){
    this.setData({
      show_img:false
    })
  }
})