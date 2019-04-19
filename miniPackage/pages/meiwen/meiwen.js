const app = getApp();
let myTimer, vh;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    lists: [],
    barActive: 0,
    bar: [
      {
        id: 0,
        name: "首页",
        icon: "all"
      },
      {
        id: 2,
        name: "最热",
        icon: "hot"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hot){
      this.setData({
        barActive: options.hot || 0
      })
    }
    if (options.share){
      wx.navigateTo({url: '/pages/article/article?id=' + options.id})
    }
    wx.getSystemInfo({
      success(res) {
        vh = res.windowHeight;
      }
    })
    this.getPageData();
  },

  //获取页面所需的数据
  getPageData(){
    const _this = this;
    const data = _this.data;
    const parms = {
      hot: data.barActive,
      page: data.page
    }
    app.globalData.http.requestUrl(true, "articles", parms).then((res) => {
      if (res.data.code == 200){
        wx.setStorageSync("datas", res.data.data.list);
        _this.setData({
          lists: res.data.data.list
        })
        _this.lazyLoadImg();
      }
    }).catch((error) => {
      console.log(error)
    })
  },

  //列表点击跳转详情
  bindArticle(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({url: '/pages/article/article?id=' + id});
  },

  //底部菜单切换
  bingBarChange(e){
    var activeId = this.data.barActive;
    if (activeId == e.currentTarget.dataset.id) return;
    this.setData({
      barActive: e.currentTarget.dataset.id
    })
    this.returnTop();
  },

  //返回顶部
  returnTop(){
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  loadMore(){
    wx.showNavigationBarLoading();
    myTimer = setTimeout(function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
      clearTimeout(myTimer);
    }, 2000)
  },

  //图片懒加载
  lazyLoadImg(){
    const _this = this;
    const lists = _this.data.lists;
    //方案1  
    // wx.createSelectorQuery().selectAll('.article-item').boundingClientRect((ret) => {
    //   ret.forEach((item, index) => {
    //     if (item.top <= vh) {
    //       lists[index].show = true
    //     }
    //   })
    //   _this.setData({
    //     lists
    //   })
    // }).exec()

    //方案2
    for (let i in lists) {
      let observeObj = wx.createIntersectionObserver();
      //=> 创建并返回一个 IntersectionObserver 对象实例（推断某些节点是否可以被用户看见、有多大比例可以被用户看见）
      //=> 指定页面显示区域作为参照区域 
      //=> 指定目标节点并开始监听相交状态变化情况
      observeObj.relativeToViewport().observe('.item-' + i, (ret) => {
        if (ret.intersectionRatio > 0) {
          lists[i].show = true
        }
        _this.setData({
          lists
        })
      })
      if (i == lists.length){
        observeObj.disconnect()
      }
    }

  },

  onPageScroll(){
    this.lazyLoadImg();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadMore();
    //接口没有定义page这个参数，所有下拉刷新没有太大的意义
    // this.setData({
    //   page: 1,
    // });
    // this.getList(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉刷新与下拉差不多  实现方式
    this.loadMore();
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
  },

  onUnload(){
    clearTimeout(myTimer);
  }
})