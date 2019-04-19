// pages/zhufuhongbao/zhufuhongbao.js

let app = getApp();
let base_url = app.globalData.base_url
const recorderManager = wx.getRecorderManager() 
var omoney
const options = {
  duration:12000,
  format:"mp3",
  frameSize:50
} 
const audioContext =wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send_type:true,//true-文字，false-语音
    content:"",//文本框信息
    fixed_or_random:true,//true-随机金额，false-固定金额
    money:"",//红包金额
    num:"",//红包个数
    show_money:"0.00",
    show_tishi:false,
    playing:false,//播放gif
    ready:true,//是否录制完成  true--未完成
    path:"",
    show_success:false,//支付成功显示
    audio_path:false,//录音上传得服务器地址
    up_file:true,//录音是否全部上传完成
    pray_now:false,//是否正在支付
    order_id:"",//订单id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var content = wx.getStorageSync("content");
    if(content){
      this.setData({
        content
      })
    }
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
  
  },

  //改变发送类型
  change_type:function(){
    var that = this;
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.setData({
                send_type: that.data.send_type ? false : true,
                path:""
              })
            },
            fail() {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.record"]) {
                    app.getUserInfo(function (token) {
                      typeof cb == "function" && cb(token)
                    });
                  }
                }
              })
            }
          })
        } else {
          that.setData({
            send_type: that.data.send_type ? false : true,
            path:""
          })
        }
      }
    })

    
  },
  //获取文本信息
  get_content:function(e){
    var content = e.detail.value;
    this.setData({
      content
    })
  },
  //点击开始录音
  star_record:function(){
    var that = this
    console.log(1);
    recorderManager.start(options);
    recorderManager.onStart((res)=>{
      console.log("开始了")
      this.setData({
        playing:true
      })
      recorderManager.onFrameRecorded((res) => {
          console.log(res);

          var MD5 = that.randomString(32)
          wx.request({
            url: base_url + '/index/api/record?onlyname=' + MD5 + "&isLastFrame=" + res.isLastFrame,
            method: 'POST',
            data:res.frameBuffer,
            success: (rs)=>{
              console.log(res)
              console.log(MD5);
              console.log(res.isLastFrame);
              console.log(res.frameBuffer)
              console.log("录音分片", rs.data)
              if (rs.data.code != 0) {
                that.setData({
                  up_file:false
                })
              }
              if(rs.data.code==0 &&res.isLastFrame){
                that.setData({
                  audio_path: base_url+rs.data.path,
                  mypath: base_url + rs.data.path,
                })
              }
            }
          })
      })
    });
    
  },
  //录音结束
  end_record:function(){
    console.log(2);
    recorderManager.stop();
    recorderManager.onStop((res)=>{
      console.log("结束了")
      this.setData({
        playing: false
      })
      console.log(res);
      var path = res.tempFilePath;
      var duration = res.duration;
      
      this.setData({
        path,
        ready:this.data.ready?false:true
      })

    })
  },
  //点击试听
  listen:function(){
    console.log(22)
    var path = this.data.path;
    console.log(this.data.mypath);
    audioContext.src = path;
    audioContext.play();
    audioContext.onPlay((res)=>{
      console.log("star")
      this.setData({
        playing:true
      })
    })
    audioContext.onEnded((res) => {
      console.log("stop")
      this.setData({
        playing: false
      })
    })
  },
  //点击重新录制
  repeal:function(){
    audioContext.stop();
    this.setData({
      path:"",
      ready:this.data.reay?false:true,
      playing:false
    })
  },

  //改变发送红包类型
  change_num_type:function(){
    this.setData({
      fixed_or_random: this.data.fixed_or_random?false:true,
      show_money:"0.00",
      money:"",
      num:""
    })
  },

  //获取红包金额
  get_money:function(e){
    var money = e.detail.value;
    if(money){
      money = parseFloat(money);
      money = money.toFixed(2);
      console.log(money);
      omoney = money
    } else {
      omoney=0
    }
    console.log(omoney);
  },
  
  //检查金额输入
  inspect_money:function(){
    if(omoney){
      if (isNaN(omoney) || omoney <= 0) {
        wx.showModal({
          title: '提示',
          content: '红包金额输入有误！',
          showCancel: false
        })
      }else {
        this.setData({
          money: omoney,
        })
        if (this.data.fixed_or_random == false && this.data.num){
          this.setData({
            show_money: parseFloat(omoney * this.data.num).toFixed(2)
          })
        } else if (this.data.fixed_or_random == true){
          this.setData({
            show_money: omoney
          })
        }
        console.log(this.data.show_money)
      }
    }else{
        this.setData({
          show_money: "0.00",
          money:""
        })
    }
  },
  //获得红包个数
  get_num:function(e){
    var num = parseInt(e.detail.value);
    this.setData({
      show_tishi: false,
    })
    if(num){
        this.setData({
          num
        })
        if (this.data.money && this.data.fixed_or_random==false) {
          this.setData({
            show_money: parseFloat(this.data.money * num).toFixed(2)
          })
        }
    }else{
      if (this.data.fixed_or_random == false){
        this.setData({
          show_money: "0.00"
        })
      }
      
    }
    
   
  },



  //发红包
  send:function(e){
    console.log(e);
    if (!Number(this.data.show_money)) {
      wx.showModal({
        title: '提示',
        content: '请检查你的金额',
      })
      return;
    }

    if (!this.data.num) {
      console.log(this.data.num)
      this.setData({
        show_tishi: true,
      })
      return;
    }
    var token = wx.getStorageSync("token");
    //发送form_id
    wx.request({
      url: base_url +"/index/api/formid",
      method:"POST",
      data:{
        token,
        type_id:2,
        formid:e.detail.formId
      },
      success:(res)=>{
        console.log(res);
      }
    })


    //获取发布数据
    
    
    var content = this.data.content;
    var fee =parseFloat(this.data.show_money);
    var num = this.data.num;
    var isequal = this.data.fixed_or_random ? 1 : 0;
    console.log(token+ "--" + content + "--" + fee + "--" + num + "--" + isequal)
    wx.showLoading({
      title: '请稍后...',
      icon: "none"
    })
    if (this.data.send_type){
      // 文字红包
     
      if(!this.data.content){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '请输入你的口令或祝福!',
        })
  
      }else{
        if (this.data.pray_now) {
          return;
        } else {
          this.setData({
            pray_now: true
          })
        }
        //发出请求
        wx.request({
          url: base_url+"/index/weixin/pay",
          method: "POST",
          data: {
            token,
            content,
            money:fee,
            sum:num,
            format:isequal
          },
          success:(res)=>{
            console.log(res);
            if(res.data.code==0){
              // var time = new Date();
              // time = Date.parse(time);
              // console.log(time);
              wx.hideLoading();
              this.setData({
                order_id:res.data.order_id
              })
              console.log(this.data.order_id);
              //调起微信支付
              res.data.data = JSON.parse(res.data.data)
              console.log(res.data.data.timeStamp)
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success:(res)=>{
                  console.log(res)
                  this.setData({
                    show_success:true
                  })
                  this.setData({
                    pray_now: false
                  })
                  var user = wx.getStorageSync("user")
                  var data = {
                    content,
                    num,
                    fee
                  }
                  setTimeout(()=>{
                    this.setData({
                      show_success:false
                    })
                    wx.navigateTo({
                      url: '/pages/zhufuhongbao-fa/zhufuhongbao-fa?id=' + this.data.order_id,
                    })
                  },1000)
                },
                fail:(res)=>{
                  this.setData({
                    pray_now: false
                  })
                  wx.showToast({
                    title: '支付失败！',
                    icon:"none"
                  })
                  
                }
              })
            }
            else if (res.data.code==1){
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false
              })
              this.setData({
                pray_now: false
              })
            }
            else{
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '调取支付接口失败！',
                showCancel:false
              })
     
                this.setData({
                  pray_now: false
                })
              
            }
          }
        })
      }
    }
    else{
      //发布语音
      if (!this.data.up_file){
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '语音上传失败，请重新录制!',
          showCancel
        })
    
      } else {
        if (this.data.pray_now) {
          return;
        } else {
          this.setData({
            pray_now: true
          })
        }
        var content = this.data.audio_path;
        //发出请求
        wx.request({
          url: base_url + "/index/weixin/pay",
          method: "POST",
          data: {
            token,
            content,
            money: fee,
            sum: num,
            format: isequal
          },
          success: (res) => {
            console.log("请求结果")
            console.log(res);
            if (res.data.code == 0) {
              // var time = new Date();
              // time = Date.parse(time);
              // console.log(time);
              wx.hideLoading();
              this.setData({
                order_id: res.data.order_id
              })
              console.log(this.data.order_id);
              //调起微信支付
              res.data.data = JSON.parse(res.data.data)
              console.log(res.data.data.timeStamp)
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: (res) => {
                  console.log("支付结果")
                  console.log(res)
                  this.setData({
                    show_success: true
                  })
                  this.setData({
                    pray_now: false
                  })
                  var user = wx.getStorageSync("user")
                  var data = {
                    content,
                    num,
                    fee
                  }
                  setTimeout(() => {
                    this.setData({
                      show_success: false
                    })
                    
                    wx.navigateTo({
                      url: '/pages/zhufuhongbao-fa/zhufuhongbao-fa?id='+this.data.order_id,
                    })
                  }, 1000)
                },
                fail: (res) => {
                  this.setData({
                    pray_now: false
                  })
                  wx.showToast({
                    title: '支付失败！',
                    icon: "none"
                  })
                }
              })
            } else {
              this.setData({
                pray_now: false
              })
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '调取支付接口失败！',
                showCancel: false
              })
            }
          }
        })
      }

    }
  },

  // 前端版本加密算法 
  randomString: function (len) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    len = len || 32;
    var $chars = 'abcdefghjk';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd + timestamp;
  },

})