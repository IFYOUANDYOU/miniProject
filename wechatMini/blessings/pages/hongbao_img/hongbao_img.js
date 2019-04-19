// pages/hongbao_img/hongbao_img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:"",
    height:"",
    ch:32,
    en:12,
    och:"",
    oen:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var window =wx.getSystemInfoSync();
    console.log(window);
    this.setData({
      width:window.windowWidth,
      height:window.windowHeight
    });
    var obj = this.get_size(this.data.ch,this.data.en);
    console.log(obj)
    this.setData({
      och: obj.width,
      oen:obj.height
    }
    )


     

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var obj = this.get_size(750,655);
    var ctx = wx.createCanvasContext("mycanvas", this);
    ctx.drawImage("/pages/image/zhufuhongbao-sbg.png", 0, 0, obj.width,obj.height);
    ctx.draw();
    var user = wx.getStorageSync("user");
    var obj = this.get_size(174,174);
    console.log(obj)
    ctx.save();
    var oobj = this.get_size(288, 42);
    ctx.beginPath()
    ctx.arc(oobj.width + obj.width / 2, oobj.height + obj.height / 2, obj.height/2 , 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(user.avatar, oobj.width, oobj.height, obj.width, obj.height);
    ctx.restore()
    ctx.draw(true);
    var ooobj = this.get_size(8, 8);
    ctx.setStrokeStyle("black")
    ctx.arc(oobj.width + obj.width / 2, oobj.height + obj.height / 2, obj.height / 2, 0, 2 * Math.PI);
    ctx.setLineWidth(ooobj.width);
    ctx.strokeStyle = "black";
    ctx.stroke();//画空心圆
    ctx.draw(true);


    //画名字
    var username = user.username; 
    var name_width = this.get_name_size("小草亲亲 发起了一个红包祝福");
    console.log(this.data.width)
    var oheight = this.get_size(1452,260);
    ctx.setFillStyle("#EAB11F")
    var txt_obj = this.get_size(32, 215);
    ctx.setFontSize(txt_obj.width);
    console.log(this.data.width / 2 - name_width / 2)
    ctx.fillText("小草亲亲 发起了一个祝福红包", this.data.width/2-name_width/2, oheight.height)
    ctx.draw(true);

    //画祝福语
    var obj = this.get_size(9,320);
    var oobj = this.get_size(733,215);
    var txt_oobj = this.get_size(127, 360)
    ctx.drawImage("/pages/image/zhufuhongbao-fa-de.png",obj.width,obj.height,oobj.width,oobj.height);
    ctx.setFontSize(txt_obj.width);
    ctx.setFillStyle("#DB2727")
    var arr = this.get_txt_arr("撒打算大苏打短发撒上发顺丰暗示法说法是否暗示法说法是否暗示大叔大婶暗示大叔大婶暗示法说法是否暗示法说法是否")
    for(var i=0;i<arr.length;i++){
      ctx.fillText(arr[i], txt_oobj.width, txt_oobj.height+20*i)
      ctx.draw(true);
      
    }

    //画二维码
    ctx.setFillStyle("#DB2727")
    var obj = this.get_size(180,690);
    var oobj = this.get_size(394,394)
    ctx.drawImage("/pages/image/my.png", obj.width, obj.height, oobj.width, oobj.height);
    ctx.setFontSize(txt_obj.width);
    ctx.setFillStyle("#DB2727");
    var bottom_txt = this.get_size(266,34);
    ctx.fillText("长00000ds按领取祝福红包", this.data.width/2-bottom_txt.width/2, obj.height+oobj.height+40)
    ctx.draw(true);
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //获取名字长度
  get_name_size:function(name){
    
    var reg = /^[a-z]$/
    // var reg = getRegExp(); 
    var width = 0;
    for(var i=0;i<name.length;i++){
     
      if(reg.test(name[i])){
        width+=this.data.oen;
        
      }else{
        width+=this.data.och;
      }
    }
    return width
  },

  get_size:function(width,height){
      var imageSize = {};
      var originalWidth = width;//图片原始宽 
      var originalHeight = height;//图片原始高 
      var originalScale = originalHeight / originalWidth;//图片高宽比 
      //console.log('originalWidth: ' + originalWidth) 
      //console.log('originalHeight: ' + originalHeight) 
      //获取屏幕宽高 
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          var windowHeight = res.windowHeight;
          var windowscale = windowHeight / windowWidth;//屏幕高宽比 
          //console.log('windowWidth: ' + windowWidth) 
          //console.log('windowHeight: ' + windowHeight) 
          var owidth = width / 750 * windowWidth;
          var oheight = owidth*height/width;
          imageSize.width = owidth;
          imageSize.height = oheight;
          console.log(imageSize);
        }
      })
      // console.log('缩放后的宽: ' + imageSize.imageWidth) 
      // console.log('缩放后的高: ' + imageSize.imageHeight) 
      return imageSize;
  },

//获得文字数组
  get_txt_arr:function(txt){
    var len = txt.length;
    var txt_arr = [];
    var i=1;
    var j=0;
    while(i){
      if(len>15){
        var item = txt.substr(15*j,15);
        txt_arr.push(item);
        len-=15
        j++;
      }else{
        var item = txt.substr(15 * j);
        txt_arr.push(item);
        len -= 15
        i=0;
      }
    }
    console.log(txt_arr)
    return txt_arr
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