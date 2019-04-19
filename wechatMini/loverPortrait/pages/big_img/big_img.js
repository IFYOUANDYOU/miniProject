// pages/big_img/big_img.js
var app = getApp();
var base_url = app.globalData.base_url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"",
    show:false,
    share:false,
    type:"",
    platform:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var type = options.type;
    this.setData({
      img:options.src,
      id,
      type
    })
    
    //检查是否分享
    if(type==2){
      this.setData({
        share:false
      })
    }else{
      var token = wx.getStorageSync("token")
      wx.request({
        url: base_url +"/index/api/isShare",
        method:"POST",
        data:{
          token,
          type,
          id
        },
        success:(res)=>{
          if(res.data.code!=1){
            this.setData({
              share:true
            })
          }
        }
      })
    }

   var sys = wx.getSystemInfoSync();
  this.setData({
    platform: sys.platform

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
    wx.showShareMenu({
      withShareTicket:true
    })
    var that = this;
    var token = wx.getStorageSync("token");
    var type = this.data.type;
    var id = this.data.id;

    if (this.data.type == 0 || this.data.type == 1) {
      return {
        title: "发现原创！",
        path: "pages/index/head",
        success: (res) => {
          if (that.data.platform == "android") {
            wx.getShareInfo({
              shareTicket: res.shareTickets,
              success: (rs) => {
                wx.request({
                  url: base_url + "/index/api/shareLog",
                  method: "POST",
                  data: {
                    token,
                    type,
                    id
                  },
                  success: (res) => {
                    if (res.data.code == 0) {
                      this.setData({
                        share: false
                      })
                    }
                  }
                })
              },
              fail: (rs) => {

                wx.showToast({
                  title: '亲，分享的不是群哦！',
                  icon: "none"
                })
              }
            })
          } else {
            if (res.shareTickets) {
              wx.request({
                url: base_url + "/index/api/shareLog",
                method: "POST",
                data: {
                  token,
                  type,
                  id
                },
                success: (res) => {
                  if (res.data.code == 0) {
                    this.setData({
                      share: false
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '亲，分享的不是群哦！',
                icon: "none"
              })
            }
          }


        }
      }
    }else{
      return{
        title: "发现原创！",
        path: "pages/index/head",
      }
    }
   
  },

  //点击分享朋友圈
  shar_frinds:function(){
    wx.showLoading({
      title: '请稍后...',
    })

    wx.getSetting({
      success:(res)=>{
          wx.downloadFile({
            url: this.data.img,
            success: (res) => {
              var path = res.tempFilePath;
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: (res) => {
                  wx.hideLoading();
                  this.setData({
                    show: true
                  })
                },
                fail: (res) => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败！',
                    icon: "none"
                  })
                }
              })
            },
            fail: (res) => {
              wx.hideLoading();
              wx.showToast({
                title: '下载失败',
                icon: "none"
              })
            }
          })
      }
    })
  },
  //点击隐藏蒙层
  no_show:function(){
    this.setData({
      show:false
    })
  }
})