var imageUtil = require('../../imgshiying.js');
var page = 1;
var app = getApp()
var base_url = app.globalData.requestUrl;
Page({
  data: {
    Imgsrc: [
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      },
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "123金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      },
      {
        img: "../../images/jpg/timg.jpg",
        img_text: "312金樽清酒斗十千,玉盘珍羞直万钱.停杯投箸不能食, 拔剑四顾心茫然.欲渡黄河冰塞川,将登太行雪满山.闲来垂钓碧溪上,忽复乘舟梦"
      }
    ],
    banner: [],
    popView: 0,
    ishide: 0,
    newsdata: [],
    imgwidth: [],
    imgheight: [],
    scrolltop: 0,
    share_my_img: "https://wx.jiqixing.com/Upload/20180320/78119665b4009c3da67c2dfc982a300f5.jpg",
    share_txt: "若无缘 请别再说想念",
    openid: '',
    form_send: 'form_send',
    detail: {

    },
    user: "",//用户信息
    sign_data: "",//签到数据
  },

  onShareAppMessage: function () {
    var that = this
    that.setData({
      popView: 0
    })
    // console.log(this.data.detail.mood_img);
    if (that.data.this.data.detail.id != -1) {
      return {
        title: "来跟我一起记录每天的心情吧！",
        path: "/pages/pinglun/pinglun?id=" + this.data.detail.id,
        imageUrl: that.data.detail.mood_img,
        success: (res) => {
          that.setData({
            "detail.id": -1
          })
        },
        fail: (res) => {
          that.setData({
            "detail.id": -1
          })
        },
      }
    } else {
      return {
        title: "来跟我一起记录每天的心情吧！",
        path: "/pages/index/index",
      }
    }

  },

  form_send: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync("token")
    var form_id = e.detail.formId;

    wx.request({
      url: app.globalData.requestUrl + '/mood/api/detail',
      data: { token: token, id, formid: form_id },
      success: function (res) {
        //  console.log(res);
      }
    })
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + id,
    })
  },

  onShow: function (options) {
  },
  onLoad: function (options) {
    var that = this;
    // if(wx.showLoading){wx.showLoading({
    //   title: "加载中"
    // })}; 
    this.checkLogin()
    var that = this
    that.setData({
      issend: 1
    });

    //请求banner图
    // wx.request({
    //   url: 'https://wx.jiqixing.com/mood/api/banner',
    //   method: "GET",
    //   success: (res) => {
    //     this.setData({
    //       banner:res.data
    //     })

    //   }
    // })

    var user = wx.getStorageSync("user");
    this.setData({
      user
    })
    this.getlist();
    that.get_sign();
    //获取系统时间
    var date = new Date();
    var minutes = this.db_num(date.getMinutes());
    var hour = this.db_num(date.getHours());
    var day = this.db_num(date.getDate());
    var month = this.db_num(date.getMonth() + 1);
    this.setData({
      minutes,
      hour,
      day,
      month
    })
  },
  checkLogin: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/checkLogin',
      //   https://wx.jiqixing.com/mood/api/checkLogin
      data: { token: token, page: 1 },
      success: function (res) {
        var data = res.data;
        if (data.code != 200) {
          app.getUserInfo(function (token) {
            if (token.length > 0) {
              wx.setStorageSync('token', token);
              that.get_sign();
              // console.log(token)
              // that.getlist();
            }
          });
        }
        // else
        // that.getlist();
      }
    })
  },
  get_sign: function () {
    wx.request({
      url: base_url + '/sign/api/getSignInfo',
      method: "POST",
      data: {
        token: wx.getStorageSync("token")
      },
      success: (res) => {
        // console.log(res);
        this.setData({
          sign_data: res.data.data
        })
      }
    })
  },
  //两位数不足补全
  db_num: function (num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  },
  getlist: function () {

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst',
      data: { token: token, page: 1 },
      success: function (res) {
        var data = res.data;
        that.setData({
          newsdata: data
        });

        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },

  //收藏 
  click_shouchang: function (e) {
    var that = this;
    var is_collect = e.currentTarget.dataset.is_collect
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/collection',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_collect = is_collect == 1 ? 2 : 1
        that.data.newsdata[index].is_collect = is_collect
        that.setData({
          newsdata: that.data.newsdata,

        })

        if (is_collect == 2) {
          wx.showToast({
            title: '收藏成功',
          })
        } else {
          wx.showToast({
            title: '取消成功',
          })
        }
      }
    })
  },

  //点赞
  click_dianzan: function (e) {

    var that = this;
    var is_like = e.currentTarget.dataset.is_like
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/love',
      data: { id: id, token: token },
      method: 'POST',
      success: function (res) {
        is_like = is_like == 1 ? 2 : 1
        that.data.newsdata[index].is_like = is_like
        that.data.newsdata[index].good = is_like == 1 ? parseInt(that.data.newsdata[index].good) - parseInt(1) : parseInt(that.data.newsdata[index].good) + parseInt(1)
        that.setData({ newsdata: that.data.newsdata })
        if (is_like == 2) {
          wx.showToast({
            title: '点赞成功',
          })
        } else {
          wx.showToast({
            title: '取消点赞',
          })
        }
      }
    })
  },

  click_pl: function (e) {
    var that = this
    var id = e.currentTarget.id
    // console.log(e);
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + id,
    })
  },



  onReachBottom: function () {
    if (wx.showLoading) {
      wx.showLoading({
        title: "加载中"
      })
    };

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst?page=' + (page + 1),
      data: { token: token },
      success: function (res) {
        page = page + 1;

        var resdata = res.data
        for (var i = 0; i < resdata.length; i++) {
          resdata[i].judge = 0;
          resdata[i].judge1 = 0;
        }
        //console.log(resdata)
        that.setData({
          newsdata: that.data.newsdata.concat(resdata)
        });
        //console.log(that.data.newsdata)
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })

  },

  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    if (wx.showLoading) {
      wx.showLoading({
        title: "加载中"
      })
    };

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/lst?page=1',
      data: { token: token },
      success: function (res) {
        that.setData({
          newsdata: res.data
        });
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        wx.stopPullDownRefresh();
      }
    })
  },

  tz_a_new_haibao: function (e) {
    wx.navigateTo({
      url: '/pages/a_new_haibao/a_new_haibao?id=' + e.currentTarget.dataset.id
    })
  },
  goread(e) {

    var bannerId = e.currentTarget.dataset.id;
    wx.request({
      url: "https://wx.jiqixing.com/mood/api/click_banner",
      method: "POST",
      data: { id: bannerId },
      //  success:(res)=>{
      //    console.log("记录成功！")
      //  }
    })
    wx.previewImage({
      urls: ["https://wx.jiqixing.com/mood/ads/ads1.png"],
    });

  },

  // 点击弹出底部
  click_popUp: function (e) {
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    var mood_img = e.currentTarget.dataset.img;
    var mood_word = e.currentTarget.dataset.word;
    var nickName = e.currentTarget.dataset.nickname;
    var avatarUrl = e.currentTarget.dataset.avatarurl;
    var that = this;
    that.setData({
      popView: 1,
    })
    this.data.detail.id = id;
    this.data.detail.mood_img = mood_img;
    this.data.detail.mood_word = mood_word;
    this.data.detail.nickName = nickName;
    this.data.detail.avatarUrl = avatarUrl;
    this.setData({
      "detail.mood_img": mood_img,
      "detail.id": id,
      "detail.mood_word": mood_word,
    })

  },
  //点击取消
  click_cancel: function () {
    var that = this
    that.setData({
      popView: 0,
      "detail.id": -1
    })
  },
  //监听页面滚动
  onPageScroll: function (e) {
    // console.log(e);
    this.setData({
      scrolltop: e.scrollTop
    })
    // console.log(this.data.scrolltop)
  },

  //分享朋友圈
  click_friend: function () {
    var that = this
    this.setData({
      popView: 0,
      "detail.id": -1
    })
    var ishide = that.data.ishide
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    if (ishide == 0) {

      wx.showLoading({
        title: '图片正在生成',
      })
      // console.log(that.data.detail);
      wx.request({
        url: 'https://wx.jiqixing.com/wx/getPoster/',
        method: 'POST',
        data: {
          id: that.data.detail.id, detail_img: that.data.detail.mood_img, content: that.data.detail.mood_word,
          nickname: that.data.detail.nickName, avatar: that.data.detail.avatarUrl,
        },
        success: function (rs) {
          // console.log(rs);
          that.setData({
            canvas_img: rs.data.path,
            ishide: 1
          })
          wx.hideLoading()
          wx.downloadFile({
            url: rs.data.path,
            success: function (pp) {
              if (pp.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: pp.tempFilePath,
                })
              }
            }
          })
        }
      })

    } else {
      that.setData({
        ishide: 0
      })
    }
  },

  //去选择模版
  go_sign: function (e) {
    var type = e.currentTarget.dataset.type;
    // console.log(type);
    wx.navigateTo({
      url: '/pages/select/select?type=' + type,
    })
  },
  //去其他app
  go_app: function () {
    wx.navigateToMiniProgram({
      appId: this.data.sign_data.software[0].appid,
    })
  }
})
