const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {},
    recommend: [],
    bar: [
      {
        id: 0,
        name: "最新",
        icon: "all"
      },
      {
        id: 2,
        name: "热门",
        icon: "hot"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData(options.id);
  },

  //获取页面所需的数据
  getPageData(id) {
    const _this = this;
    const data = _this.data;
    const parms = {
      id: id
    }
    app.globalData.http.requestUrl(true, "article", parms).then((res) => {
      res = res.data;
      if (res.code == 200) {
        const reg = new RegExp('<img', 'gi');
        res.data.acticle.content = res.data.acticle.content.replace(reg, `<img style="max-width: 100%;margin: 10px 0;"`);
        _this.setData({
          article: res.data.acticle,
          recommend: wx.getStorageSync('datas') || []
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  },

  //顶部按钮点击事件
  bingTopChange(e){
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: "/pages/meiwen/meiwen?hot=" + id })
  },

  //相关推荐点击
  bindRecom(e){
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: "/pages/article/article?id=" + id })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const datas = wx.getStorageSync('datas');
    const num = Math.floor(Math.random() * datas.length);
    return {
      title: datas[num].title || '正月初八，太美太漂亮了，送给群里的每一位朋友！',
      path: 'pages/meiwen/meiwen?id=' + datas[num].id || 1 + '&share=1',
      imageUrl: datas[num].thumb || 'http://image109.360doc.com/DownloadImg/2019/02/1209/154018043_30_20190212094755460'
    }
  }
})