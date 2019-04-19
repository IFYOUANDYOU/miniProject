// pages/mine/mine.js


var app = getApp();
var base_url = app.globalData.base_url;
var my_page = 0;
var other_page = 0;

//2019-04-19新增
const my_list = {
  sum_money: 1222,
  sum_num: 125,
  list: [{
      id: 4,
      type: 0,
      content: "这是新增的内容1",
      money: "12",
      time: "2019-04-19",
      get_num: 14,
      sum_num: 20
    },
    {
      id: 2,
      type: 1,
      content: "这是新增的内容2",
      money: "10",
      time: "2019-04-19",
      get_num: 4,
      sum_num: 5
    }
  ]
}
const other_list = {
  sum_money: 22,
  sum_num: 25,
  list: [{
      id: 4,
      avatar: "https://img.52z.com/upload/news/image/20180419/20180419051254_75804.jpg",
      nickname: "这是一只猫",
      money: "12",
      time: "2019-04-19"
    },
    {
      id: 2,
      avatar: "https://img.52z.com/upload/news/image/20180419/20180419051254_75804.jpg",
      nickname: "这是一只猫",
      money: "12",
      time: "2019-04-19"
    }
  ]
}
const user = {
  avatar: "https://img.52z.com/upload/news/image/20180419/20180419051254_75804.jpg",
  nickName: "这是一只猫",
  money: 25112
}
/**************************/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    show1: true,
    show2: false,

    /*修改于2019-04-19
    user: {},//用户信息  
    my_list: "",
    other_list: "",
    */
    user: user,
    my_list: my_list,
    other_list: other_list,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    my_page = 0;
    other_page = 0;
    // var user = wx.getStorageSync("user");
    var token = wx.getStorageSync("token")

    //获取个人信息
    wx.request({
      url: base_url + "/index/api/myMsg",
      method: "GET",
      data: {
        token
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            user: res.data.data
          })

        }
        // console.log(this.data.user)
      }
    })




    //获取发出的红包列表
    this.get_list(token, 0)

    //获取收到的红包列表
    this.get_list(token, 1)


  },
  //获取个人中心祝福列表
  get_list: function(token, type) {
    if (type == 0) {
      wx.request({
        url: base_url + "/index/api/wishesList",
        method: "GET",
        data: {
          token,
          type,
          page: ++my_page
        },
        success: (res) => {
          console.log(res)
          res.data.data.sum_money = res.data.data.sum_money.toFixed(2)
          this.setData({
            my_list: res.data.data
          })
          // console.log(this.data.my_list)



        }
      })
    } else {
      wx.request({
        url: base_url + "/index/api/wishesList",
        method: "GET",
        data: {
          token,
          type,
          page: ++other_page
        },
        success: (res) => {
          console.log(res)
          res.data.data.sum_money = res.data.data.sum_money.toFixed(2)
          this.setData({
            other_list: res.data.data
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  active: function(e) {
    var num = e.currentTarget.dataset.num;
    var atv = this.data.active;
    if (num == atv) {
      num = num;
    }
    if (num == 1) {
      // console.log(1);
      this.setData({
        show1: true,
        show2: false
      })

    } else if (num == 2) {
      this.setData({
        show1: false,
        show2: true
      })
    }
    this.setData({
      active: num
    })
  }

})