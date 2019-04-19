// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    camera: false,
    prescripimg: "",
    showcamera: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.createCameraContext()) {
      this.cameraContext = wx.createCameraContext('myCamera');
      this.setData({
        camera: false
      })
    }
  },

  //删除
  delimg: function (e) {
    var _this = this;
    var prescripimg = _this.data.prescripimg;
    _this.setData({
      prescripimg: ""
    })
  },

  getcamera:function(e){
    var _this = this;
    var camera = _this.data.camera;
    if (camera){
      _this.setData({
        showcamera: true
      })
    }else{
      _this.upload();
    }
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        if (res.tempImagePath){
          this.setData({
            prescripimg: res.tempImagePath,
            showcamera: false
          })
        }

      }
    })
  },
  error(e) {
    console.log(e.detail)
  },

  //上传处方
  upload: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        _this.uploadfiles(tempFilePaths);
      },
      fail(res) {
        utils.showToast("请重新上传");
      }
    })
  },
  //上传图片
  uploadfiles: function (file) {
    var _this = this;
    var prescrip = _this.data.prescrip;
    var cardId = _this.data.cardId;
    wx.showLoading({ title: "图片正在上传" })
    wx.uploadFile({
      url: app.globalData.apiurl + "addPrescriptionImg",
      filePath: file,
      name: 'file',
      formData: {
        "id": cardId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          var resdata = JSON.parse(res.data);
          utils.showToast(resdata.msg);
          if (resdata.code != 200) return false;
          prescrip.push(resdata.data);
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

  }
})