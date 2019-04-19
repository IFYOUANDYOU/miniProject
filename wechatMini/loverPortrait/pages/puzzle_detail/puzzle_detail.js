var app = getApp();
var base_url = app.globalData.base_url;
const ctx = wx.createCanvasContext('my_img');
ctx.scale(0.5, 0.5);
var img_height;
var img_width;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_list:[],
    id:"",
    banner_list:[],
    user:"",
    Davatar:"",
    now_index:-1,//当前使用图片
    c_width:'',
    c_height:'',
    now_img:"",//当前挂件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var that = this;
    var id = options.id;
    var user = wx.getStorageSync("user");
    this.setData({
      id:id,
      user:user
    })
    var avatar = this.data.user.avatarUrl;
    // console.log(avatar);
    //下载头像
    wx.request({
      url: base_url +'/index/api/downWxHead',
      method:"POST",
      data:{
        head: avatar
      },
      success:(res)=>{
          // console.log(res.data.head);
          // this.setData({
          //   Davatar: res.data.head
          // })
          // this.drawImage(res.data.head);
          wx.downloadFile({
            url: res.data.head,
            success: (res) => {
              // console.log(res);
              this.setData({
                Davatar: res.tempFilePath
              })
              var Davatar = this.data.Davatar;
              // console.log(Davatar);
              
              this.drawImage(Davatar);              
            }
          })
      }
    })
    
    
    wx.request({
      url: base_url +'/index/api/jigsawDetail',
      method:"POST",
      data:{
        cid:id
      },
      success:(res)=>{
        // console.log(res);
        if(res.data.code==200){
          this.setData({
            img_list:res.data.data.list,
            banner_list: res.data.data.banner
          })
          // console.log(this.data.banner_list)
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  //绘制头像
  drawImage: function (Davatar){
    var that =this;
    wx.getImageInfo({
      src: Davatar,
      success: function (res) {
        img_height = res.height;
        img_width = res.width;
        that.setData({
          c_width: img_width,
          c_height: img_width
        })
      }
    })
    // console.log(Davatar);
    //裁剪
    ctx.clearRect(0, 0, img_width, img_width)
    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(120, 120, 105.5, 0, 2 * Math.PI)
    // ctx.clip()
    ctx.drawImage(Davatar, 0, parseInt((img_height - img_width) / 2), img_width, img_width, 0, 0, img_width, img_width);
    // ctx.restore()
    ctx.draw()
  },
  //选择挂件
  select_img:function(e){
      var that = this;
      var id= e.currentTarget.dataset.id;
      var img = e.currentTarget.dataset.img;
      var coordinate = e.currentTarget.dataset.coordinate
      this.setData({
        now_index:id
      })
      //下载挂件
      wx.downloadFile({
        url:img,
        success:(res)=>{
          // console.log(res);
          var Dimg = res.tempFilePath;

          this.setData({
            now_img: res.tempFilePath
          })
          var Davatar = that.data.Davatar;

          that.drawImage(Davatar);
          that.draw_selcet(Dimg, coordinate);
        }
      })
  },
  //画挂件
  draw_selcet: function(oimg,coordinate){
    //开始画挂件
// 1:左上、2:右上、3:右下、4:左下
    var lio = parseInt(img_width * 212 / 480);
    if(coordinate=="1"){
      ctx.drawImage(oimg, 0, 0, lio, lio);
      ctx.draw(true);
      this.setData({
        top: "0",
        left: "0rpx",
      })
    }else if(coordinate=="2"){
      this.setData({
        top: "0",
        left: "268rpx",
      })
      ctx.drawImage(oimg, img_width - lio, 0, lio, lio);
      ctx.draw(true)
    }else if(coordinate=="3"){
      this.setData({
        top: "268rpx",
        left: "268rpx",
      })
      ctx.drawImage(oimg, img_width-lio, img_width-lio,lio, lio);
      ctx.draw(true)
    }else{
      this.setData({
        top: "268rpx",
        left: "0",
      })
      ctx.drawImage(oimg, 0, img_width-lio, lio, lio);
      ctx.draw(true)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){

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
    return {
      title: this.data.user.nickName+'@我快来跟我一起制作个性头像！',
      path: '/pages/puzzle/puzzle'
    }
  },
  // 保存到手机
  create_img:function(){
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: img_width,
      height: img_width,
      destWidth: img_width,
      destHeight: img_width,
      quality:1,
      // fileType:"jpg",
      canvasId: 'my_img',
      success:(res)=>{
        // console.log(res.tempFilePath)
        // wx.saveFile({
        //   tempFilePath: res.tempFilePath,
        //   success: function success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                wx.showToast({
                  title: '已保存到相册！',
                })
            //   }
            // })
          },
          complete: function fail(e){
            // console.log(e.errMsg);
          
          }
        })
        // this.setData({
        //   ooiimmgg: res.tempFilePath
        // })
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        //   success:(res)=>{
        //     wx.showToast({
        //       title: '已保存到相册！',
        //     })
        //   }
        // })
      }
    })

    // wx.request({
    //   url: 'https://avatar.zxles.com/index/api/test',
    //   method:"POST",
    //   data:{
    //     head:"https://wx.qlogo.cn/mmopen/vi_32/dxd9B6mia2H7Z9YwsfDklDLz4MOn9TibNOV0q7piccdD0NlLPR0rXpFTFoCicSJmicrCLfCicySwIApvyINichnIia3xvA/0",
    //     imgid:101
    //   },
    //   success:(res)=>{
    //     console.log(res);
    //   }
    // })
    
  },
  //选择相机图片或者拍照
  choose_img:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
          that.setData({
            Davatar: tempFilePath
          })
        that.drawImage(tempFilePath);
        var id = that.data.now_index;
        if(id!=-1){
          wx.downloadFile({
            url: that.data.img_list[id].img,
            success: (res) => {
              // console.log(res);
              var Dimg = res.tempFilePath;
              that.draw_selcet(Dimg, that.data.img_list[id].coordinate);
            }
          })
        }
        

      }
    })
  },
  //banner跳转
  go_app:function(e){

    var appid = e.currentTarget.dataset.appid;
    // console.log(appid);
    if(appid!="#"){
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },

  get_img:function(e){
    // console.log(e);
  }
})