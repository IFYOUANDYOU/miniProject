// pages/zhufuhongbao-fa/zhufuhongbao-fa.js
let app = getApp();
let base_url = app.globalData.base_url
var audioCtx = wx.createInnerAudioContext();
var index=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    data:{},
    width: "",
    height: "",
    show_img:false,
    path:"",//导出图片得路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    var id = options.id
    this.setData({
      order_id:id
    })
    wx.request({
      url: base_url + "/index/api/getWishes",
      method:"GET",
      data:{
        order_id:id
      },
      success:(res)=>{
        console.log(res);
        this.setData({
          data:res.data.data,
          key: res.data.data.key_list
        });
        console.log(res.data.data)
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
    var oindex = index;
    
    if (oindex+1>this.data.key.length){
      wx.showToast({
        title: '你的红包已经分享完了！',
        icon:"none"
      })
      return;
    }else{
      index++;
      return {
        title: "快来领取我的红包！",
        path: "/pages/zhufuhongbao-detial/zhufuhongbao-detial?order_id=" + this.data.order_id + "&key=" + this.data.key[oindex]
      }
    }
    
  },




  //生成图片
  creat_img:function(){
    wx.showLoading({
      title: '生成图片中...',
    })
    this.save_img();

  },
  //导出图片
  save_img: function () {
    var that = this;
    wx.showLoading({
      title: '生成图片中...',
    })
    var that = this;
    var token = wx.getStorageSync("token");
    var type = this.data.data.type;
    var content = that.data.data.content;
    var key = this.data.key[index];
    ++index;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log(2)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log(1);
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.request({
                url: base_url + "/index/api/savePreImg",
                method: "POST",
                data: {
                  token,
                  content,
                  type:++type,
                  key,
                  order_id:that.data.order_id
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
                          title: '你的红包已经分享完了！',
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
                  } else {

                    wx.request({
                      url: base_url + "/index/api/savePreImg",
                      method: "POST",
                      data: {
                        token,
                        content,
                        type: ++type,
                        key,
                        order_id: that.data.order_id
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
                                title: '你的红包已经分享完了！',
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
                fail: (res) => {
                  console.log(4)
                  wx.hideLoading();
                }
              })
            }
          })
        } else {
      
          wx.request({
            url: base_url + "/index/api/savePreImg",
            method: "POST",
            data: {
              token,
              content,
              type: ++type,
              key,
              order_id: that.data.order_id
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
                      title: '你的红包已经分享完了！',
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

  //隐藏canvas图片
  hide_img:function(){
    this.setData({
      show_img:false
    })
  },
  //试听语音
  listen:function(e){
    var id = e.currentTarget.dataset.src;
    console.log(id);
    
    audioCtx.src=id;
    audioCtx.play();
    audioCtx.onPlay(()=>{
      console.log("KAISHI")
    })
    audioCtx.onStop(() => {
      console.log("jieshu")
    })
  }


})