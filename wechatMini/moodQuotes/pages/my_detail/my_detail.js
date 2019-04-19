var app = getApp()

Page({

  data: {
    judge_textarea: 0,
    index: 0,
    judge_hide: 0,
    src: '',
    disabled: false,
    isfalse:false,
    judge_text:1
  },
  b_confirm:function(){
   var that = this
   that.setData({
       judge_text:0
   })
  }, 
  
  click_entry: function () {
    var that = this
    var judge_textarea = that.data.judge_textarea
    var isfalse = that.data.isfalse
    if (judge_textarea == 0) {
      that.setData({
        judge_textarea: 1,
        isfalse:true
      })
    }
  },
  
  onLoad: function (options) {

    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/category',
      data: { token: token },
      success: function (res) {
        that.setData({
          catlist: res.data
        });
        if (wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
  },

  choose_img: function () {
    var that = this
    var judge_hide = that.data.judge_hide
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({ judge_hide: 1, src: tempFilePaths[0] })
      }
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that = this
    var content = e.detail.value.content
    content = content.replace(/(^\s*)|(\s*$)|( )/g, "");
    //检测是否含有非法字符
    //电话验证
    var tel = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/;
    //网址
    var url = /((https|http|ftp|rtsp|mms)[^:]*?:[^\/]*?\/\/)/;
    //域名
    var doname = /(www)*?[^\.]*?\.([a-z0-9][a-z0-9\-]*?\.(?:com|cn|net|org|gov|info|la|cc|co)(?:\.(?:cn|jp))?)[ \/]*?/;
    //其他非法字符
    var illegal = /(<|>|<\?|\?>)/;
    if (tel.test(content) || url.test(content) || illegal.test(content) || doname.test(content)){
      wx.showModal({
        title: '提示',
        content: '内容含有非法字符',
        showCancel: false
      })
    }else if (content.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false
      })
    }
    else if (content.length > 100) {
      wx.showModal({
        title: '提示',
        content: '内容不得操作100字符',
        showCancel: false
      })
    }
    else if (that.data.src.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        showCancel: false
      })
    }
    else {
      if(wx.showLoading){wx.showLoading({
        title: '上传中',
      })}
      that.setData({ disabled: true })
      var token = wx.getStorageSync('token')
      wx.uploadFile({
        url: app.globalData.requestUrl + '/mood/api/addMood',
        filePath: that.data.src,
        name: 'file',
        formData: { token: token, mood_word: content, cate_id: that.data.catlist[that.data.index].id },
        success: function (res) {
          var data = res.data
          if (typeof data === 'string') data = JSON.parse(data.trim());
          if (data.code == 200) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
            })

            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
          else {
            wx.showModal({
              title: '提示',
              content: data.info,
              showCancel: false
            })
          }
        }
      })
    }
  },

})