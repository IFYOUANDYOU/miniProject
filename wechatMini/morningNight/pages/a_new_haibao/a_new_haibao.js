var app = getApp()

Page({

  data: {
    isshow: false,
    username: '',
    id :0,
  },

  onLoad: function (options) {
    
    if(wx.showLoading){wx.showLoading({
      title: '加载中',
    })}

    var that = this
    var id = options.id
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeigh,
          id: options.id
        })
      }
    })

    this.checkLogin()
  },

  checkLogin: function(){
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.requestUrl + '/mood/api/checkLogin',
      data: { token: token },
      success: function (res) {
        var data = res.data;
        if (data.code != 200) {
          app.getUserInfo(function (token) {
            if (token.length > 0) {
              wx.setStorageSync('token', token)
              that.getData()
            }
          });
        }
        else {
          that.setData({ username: res.data.data.nickName })
          that.getData()
        }
      }
    })
  },

  getData: function(){
    var that = this
    var id = that.data.id;
    wx.request({
      url: app.globalData.requestUrl + '/wx/getWxaCode',
      method: 'POST',
      data: { id: id },
      success: function (res) {
        if (res.data.code == 200) { 
          that.getDetail(res.data.data);
        }
      }
    })

  },

  getDetail: function (wxaCode_img) {
    var that = this
    var mood_word = wx.getStorageSync('mood_word')
    var mood_img = wx.getStorageSync('mood_img')
    wx.getImageInfo({
      src: mood_img,
      success: function (img) {
        img.height = img.height > 280 ? 280 : img.height;
        img.height = img.height < 200 ? 280 : img.height
        that.setData({ height_style: img.height + 250 });
        that.downloadFile(mood_img, mood_word, img.height, wxaCode_img);
      }
    })
  },

  downloadFile: function (src, text, height, wxaCode_img){
    var that = this
    wx.downloadFile({
      url: src,
      success: function (res) {
        that.create_canvas(res.tempFilePath, text, height, wxaCode_img);
      }
    })
  },
  
  create_canvas: function (src, text, height, wxaCode_img){
    var that = this
    wx.downloadFile({
      url: wxaCode_img,
      success: function (res) {
       
        var wxaCode_img = res.tempFilePath
        const ctx = wx.createCanvasContext('myCanvas')
        
        var bg_left_px = 20 // 背景图片到左边像素
        var img_width = that.data.windowWidth - bg_left_px * 2 // 图片宽度
        ctx.drawImage(src, bg_left_px, 10, img_width, height - 40)

        var left_text_px = bg_left_px + 35 // 文字到左边的像素
        var hang_text_px = 20 //每行字数高度（像素）
        var bg_img_width = that.data.windowWidth - (bg_left_px + 10) * 2
        var hang_text_num = Math.floor((that.data.windowWidth - left_text_px * 2) / 15) // 每行字数

        var str = that.changeStr(text, hang_text_num * 2);
        var str_arr = str.split('\n')
        var bg_height = str_arr.length * hang_text_px + 60 //底部白色背景高度

        
        ctx.setFillStyle('rgba(0 , 0, 0,.5)') 
        ctx.fillRect(bg_left_px + 10, height - bg_height+20, bg_img_width, bg_height - 50)
        ctx.setFillStyle('white') 
        ctx.setFontSize(16)
        for (var i = 0; i < str_arr.length; i++) {
          var text_height = height - bg_height + hang_text_px * (i + 1) + 20
          ctx.fillText(str_arr[i], left_text_px, text_height)
        }
        
        var arc_half = 70 //圆半径
        ctx.setGlobalAlpha(1)
        ctx.save() 
        ctx.setFillStyle('white')
        ctx.arc(that.data.windowWidth / 2, height + arc_half, arc_half+2, 0, 2 * Math.PI)
        // ctx.clip(); 
        
        ctx.drawImage(wxaCode_img, that.data.windowWidth / 2 - arc_half, height, arc_half * 2, arc_half*2)
        ctx.restore(); 

        ctx.setFontSize(12)
        ctx.setFillStyle('rgb(157 , 157, 157)')

        //昵称
        var username = that.data.username
        if(username.length > 0) {
          var username_length_half = username.length / 2
          ctx.fillText(username, that.data.windowWidth / 2 - username_length_half * 10 + username_length_half, height + arc_half + 90)
        }
        
        ctx.fillText('心情语录@小程序生成', that.data.windowWidth / 2 - 50 - 15, height + arc_half + 110)

        ctx.setStrokeStyle('black')
        ctx.moveTo(40, 1)
        ctx.lineTo(that.data.windowWidth - 40, 1)
        ctx.lineTo(that.data.windowWidth - 40, 500)
        ctx.lineTo(40, 500)
        ctx.lineTo(40, 1)
        ctx.closePath()
        ctx.stroke()
        ctx.draw()
      
        that.setData({ isshow: true })
        if (wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
  },

  changeStr: function (str, len) {
    if (str == null || str == "") {
      return "";
    }
    if (len == null) {
      len = 10;
    }
    var result = "";
    var curlen = 0;
    var patten = /.*[\u4e00-\u9fa5]+.*$/;
    var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    for (var i = 0; i < str.length; i++) {
      if (patten.test(str[i]) || reg.test(str[i])) {
        curlen += 2;
      } else {
        curlen++;
      }
      
      if (curlen >= len) {
        curlen = 0;
        result += "\n";
      }

      result += str[i];
    }

    return result;
  },

  save: function(){
	if(wx.showLoading){wx.showLoading({
      title: '保存中',
    })}

    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          complete: function(){
            if (wx.hideLoading){
              wx.hideLoading()
            }
          },
          fail: function (err) {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
					if(wx.openSetting){
						wx.openSetting({
							success: (res) => {
							}
						  })
					}
                }
              }
            })
          },
        })
      }
    })
  },
  
  onShareAppMessage: function () {
  
  },
 
})