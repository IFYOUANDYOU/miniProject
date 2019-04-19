// pages/zhufuhongbao-detial/zhfuhongbao-detial.js
var app = getApp();
let base_url = app.globalData.base_url;
var audio = wx.createInnerAudioContext();
var animation = wx.createAnimation({
  duration:2000,
})
var ooanimation = wx.createAnimation({
  duration: 2000,
});
var index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    data:{},
    key:"",
    liuyan:false,
    txt_num:0,
    txt:"",
    lingquhongbao:"",
    liuyan_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order_id = options.order_id;
    var key = options.key;
    this.setData({
      order_id,
      key:key
    })
    var that = this;
    app.getUserInfo(function (token) {
      wx.setStorageSync('token', token);
      wx.request({
        url: base_url +"/index/api/wishesDetail",
        method:"GET",
        data:{
          token,
          order_id: that.data.order_id,
          key: that.data.key
        },
        success:(res)=>{
          if(res.data.code==0){

            var list = res.data.data.list;
            
            for (var i = 0; i < list.length; i++) {
              var ani = animation.translateX(-300).step()
              list[i].oanimation = ani.export();
            }
            console.log(list)
          
            res.data.data.list=list
            that.setData({
              data: res.data.data,
           
          })
          }
          console.log(res);
        }
      })

      that.get_liuyan();
    });
    


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
    audio.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    audio.stop();
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
    var oindex = index;
    if (oindex + 1 > this.data.data.key_list.length) {
      wx.showToast({
        title: '你的红包已经分享完了！',
        icon: "none"
      })
      return;
    } else {
      index++;
      return {
        title: "快来领取我的红包！",
        path: "/pages/zhufuhongbao-detial/zhufuhongbao-detial?order_id=" + this.data.order_id + "&key=" + this.data.data.key_list[oindex]
      }
    }
  },

  //获取留言
  get_liuyan:function(){
    console.log(this.data.order_id)
      wx.request({
        url: base_url +"/index/api/chatList",
        method:"GET",
        data:{
          order_id:this.data.order_id
        },
        success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          this.setData({
            liuyan_list:res.data.data
          })
        }
        }
      })
  },
  //没有红包了
  no_num:function(){
    wx.showToast({
      title: '亲，来晚了哦！',
      icon:"none"
    })
  },
  //领取红包
  get_num:function(){
    var that =this;
    if(this.data.data.wishes.is_mine){
      wx.showModal({
        title: '提示',
        content: '亲,不能自己领取自己的红包哦！',
        showCancel:false
      })
      return;
    }
    var token = wx.getStorageSync("token");
    var order_id = this.data.order_id;
    var key = this.data.key;
    console.log(token,key,order_id);

    ooanimation.rotateY(360).step()
    this.setData({
      lingquhongbao:ooanimation.export()
    })
    wx.request({
      url: base_url +"/index/api/ReceiveRed",
      method:"POST",
      data:{
        token,
        order_id,
        key
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          var token = wx.getStorageSync("token")
          wx.request({
            url: base_url + "/index/api/wishesDetail",
            method: "GET",
            data: {
              token,
              order_id: this.data.order_id,
              key: this.data.key
            },
            success: (res) => {
              if (res.data.code== 0) {
                var list = res.data.data.list;
                for (var i = 0; i < list.length; i++) {
                  var animation = wx.createAnimation({
                    duration: 5000,
                    timingFunction: 'linear',
                    delay: 2000
                  })
                  var ani = animation.translateX(-50).step().export();
                  list[i].animation = ani;
                }
                res.data.data.list = list
                that.setData({
                  data: res.data.data,
                })
              }
              console.log(res);
            }
          })
        }else{
          wx.showToast({
            title: '领取失败！',
            icon:"none"
          })
        }
      }

    })
  },
  //显示留言框
  show_liuyan:function(){
    this.setData({
      liuyan:true
    })
  },
  //点击隐藏留言框
  hide_liuyan:function(){
    this.setData({
      liuyan:false,
      txt:"",
      txt_num:0
      })
  },
  //我要发
  go_fa:function(){
    wx.navigateTo({
      url: "/pages/zhufuhongbao/zhufuhongbao",
    })
  },
  //获取输入字数
  get_txt_num:function(e){
    console.log(e)
    var str = e.detail.value;
    this.setData({
      txt_num:str.length,
      txt:str
    })
  },
  //发送留言
  send_liuyan:function(){
    var token = wx.getStorageSync("token");
    var order_id= this.data.order_id;
    var txt = this.data.txt;
    var user = wx.getStorageSync("user")
    wx.request({
      url: base_url +"/index/api/chat",
      method:"POST",
      data:{
        token,
        order_id,
        content:txt
      },
      success:(res)=>{
        console.log(res);
        if(res.data.code==0){
          this.hide_liuyan();
          wx.showToast({
            title: '留言成功！',
            icon:"none"
          })
          var obj = {
            avatar:user.avatarUrl,
            content:txt
          }
          var list = this.data.liuyan_list;
          console.log(list)
          list.push(obj);
          this.setData({
            liuyan_list: list
          })
        }
      }
    })
  },
  //收听
  listen:function(e){
    var src = e.currentTarget.dataset.src;
    audio.src = src;
    audio.play();
  }
})