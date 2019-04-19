const app = getApp();
const utils = require("../../utils/util.js");
const gn = require("../../utils/getnews.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curPage: {
      type: String,
    },
    hasUserInfo: { type: Boolean }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curPage: "",
    isx: false,
    hasnews: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _homeEvent() {
      console.log('你点击了首页');
      if (this.data.curPage == "home") return;
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    _scanEvent() {
      var _this = this;
      var userId = app.globalData.userId;
      console.log('你点击了扫一扫');
      wx.scanCode({
        scanType: ["barCode","qrCode"],
        success: (res) => {
          console.log(res)
          if (res.path && res.path.indexOf("id")!=-1){
            var path = res.path;
            var doctorId = utils.GetQueryString(path, "id");
            app.bindDoctor(doctorId, userId);
          } else if (res.result.indexOf("https")==-1){
            var scanCode = res.result;
            //根据扫码内容跳转药品详情页面
            wx.navigateTo({
              url: '/pages/drugDT/drugDT?drugid=' + scanCode
            })
          }else{
            app._showModals("找不到您要内容，请重新扫描");
          }
          //_this.triggerEvent("scanEvent", res);
        },
        fail: (res) => {
          app._showModals();
        }
      })
    },
    _userEvent(e) {
      console.log('你点击了我的');
      var userId = app.globalData.userId;
      if (this.data.curPage == "user") return;
      if (userId=="") {
        utils.showToast("您需要授权");
        return;
      }
      wx.redirectTo({
        url: '/pages/user/user',
      })
    }
  },
  attached: function () {
    var _this = this;
    var isx = app.globalData.isx;
    var hasread = null;
    gn.getnews(app.globalData.userId, function (res) {
      console.log(res)
      hasread = res.data.is_read;
      wx.setStorageSync("hasread", hasread);
      _this.setData({
        hasread
      })
    });
    _this.setData({
      isx: isx ? isx : false
    })
  }
})