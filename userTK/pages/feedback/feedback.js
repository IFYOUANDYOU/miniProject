const app = getApp();
const utils = require("../../utils/util.js");

const upimgs = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,

    vh: 0,
    phoneNumber: "",
    inputPhone: null,
    prescrip: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    /*wx.createSelectorQuery().select('.upload').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res) {
      var wh = res.width;
      _this.setData({
        vh: wh / 3,
        statu: true
      })
    }).exec()*/
  },

  //选择图片 
  upload: function (e) {
    var _this = this;
    var prescrip = _this.data.prescrip;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        _this.uploadfiles(tempFilePaths);
      },
      fail(res) {
        utils.showToast("请重新上传");
      }
    })
  },
  //删除
  delimg: function (e) {
    var _this = this;
    var eq = e.currentTarget.dataset.index;
    var prescrip = _this.data.prescrip;
    prescrip.splice(eq, 1);
    _this.setData({
      prescrip
    })
  },
 
  //上传图片
  uploadfiles: function(file){
    var _this = this;
    var prescrip = _this.data.prescrip;
    wx.showLoading({ title: "图片正在上传" })
    wx.uploadFile({
      url: app.globalData.apiurl + "uploadImg",
      filePath: file,
      name: 'file',
      formData: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          var resdata = JSON.parse(res.data);
          if (resdata.code == 200){
            prescrip.push(resdata.data);
          }
          _this.setData({
            prescrip
          })
          wx.hideLoading();
        }
      },
      fail: function (res) {
        console.log(res);
        utils.showToast("图片上传失败");
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },
  //点击获取手机号码 所需的session_key
  getSessionKey: function (e) {
    var _this = this;
    var resdata = e.detail;
    if (!resdata.iv || !resdata.encryptedData) {
      utils.showToast("获取失败重新获取");
      _this.setData({
        inputPhone: true
      })
      return false;
    };
    wx.login({
      success: function (res) {
        var usercode = res.code;
        if (res.code) {
          var url = app.globalData.apiurl + "getopenId";
          utils.requestUrl(
            url,
            {
              code: res.code
            },
            null,
            "POST",
            null,
            function (res) {
              console.log(res)
              if (res.data.code == 200) {
                var session_key = res.data.data.session_key;
                _this.getPhoneNumber(session_key, resdata);
              } else {
                utils.showToast(res.data.msg);
              }
            },
            function (res) {
              utils.showToast(res.data.msg);
            },
            function (res) { }
          );
        }
      },
      fail: function (res) {
        utils.showToast("获取失败重新获取");
      }
    })
  },
  //通过session_key、encryptedData、iv 获取手机号码按钮
  getPhoneNumber: function (session_key, resdata) {
    var _this = this;
    console.log(resdata)
    wx.checkSession({
      success: function (res) {
        var ency = resdata.encryptedData;
        var iv = resdata.iv;
        if (resdata.errMsg == 'getPhoneNumber:fail user deny') {
          _this.setData({
            inputPhone: true
          });
        } else {
          //同意授权       
          var url = app.globalData.apiurl + "getPhoneNumber";
          utils.requestUrl(
            url,
            {
              encryptedData: ency,
              iv: iv,
              session_key: session_key,
              user_id: app.globalData.userId
            },
            null,
            "POST",
            null,
            function (res) {
              console.log(res)
              if (res.data.data.phoneNumber) {
                console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
                wx.setStorageSync('phoneNumber', res.data.data.phoneNumber);
                _this.setData({
                  phoneNumber: res.data.data.phoneNumber,
                  inputPhone: null
                })
              } else {
                utils.showToast(res.data.msg);
              }
            },
            function (res) {
              utils.showToast(res.data.msg);
            },
            function (res) { }
          );
        }
      }, fail: function () {
        console.log("session_key 已经失效，需要重新执行登录流程");
        utils.showToast("获取失败");
      }
    });
  },
  //提交用户反馈
  fbSubmit: function (e) {
    var _this = this, imgs = [];
    var content = e.detail.value.detail;
    var userId = app.globalData.userId;
    var prescrip = _this.data.prescrip;
    var phoneNumber = _this.data.phoneNumber;
    for (var i in prescrip){
      imgs.push(prescrip[i].img_url);
    }
    wx.showLoading({ title: "正在提交" })
    var url = app.globalData.apiurl + "submitFeedback";
    if (content == "" || phoneNumber.length == 0) {
      utils.showToast("请填写您的问题、意见并授权手机号码");
      return false;
    }
    utils.requestUrl(
      url,
      {
        text: content,
        user_id: userId
      },
      null,
      "POST",
      null,
      function (res) {
        console.log(res);
        if(res.data.code != 200){
          utils.showToast(res.data.msg);
          return false;
        }
        wx.hideLoading();
        _this.setData({
          prescrip: [],
          text: ""
        })
        utils.showModals(
          "",
          "感谢您的反馈，您的满意是我们前进的动力！",
          0,
          function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: "/pages/index/index",
              })
            }
          }
        ) 
      },
      function (res) {
        utils.showToast(res.data.msg);
      },
      function (res) {
        wx.hideLoading();
      }
    );
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

  }
})