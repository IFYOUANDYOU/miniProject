//index.js
//获取应用实例 
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    otherArticle: [],
    position: 1,
    tabs: [{
      id: 1,
      name: "首页"
    },
    {
      id: 2,
      name: "热门"
    }
    ],
    page: 1, //页码
    datas: [], //页面数据
    hot: 0,//默认首页
    allPage: 0 //总页码
  },
  onLoad: function (e) {
    var listData = wx.getStorageSync('datas') || [];
    this.setData({
      hot: e.hot || 0
    })
    if (listData.length){
      this.setData({
        datas: listData,
      });
    }else{
      app.userInfoCallback().then(res => {
        util.getList(this)
      }).catch(err => {
        console.log(err)
      });
    }

    //是否分享或模板消息进入
    if(e.url){
      //模板消息进入公众号形式直接附链接形式
      wx.navigateTo({
        url: '../webview/webview?url=' + e.url
      })
    } else if (e.id){
      wx.navigateTo({
        url: '../info/info?id=' + e.id + (e.share ? '&share=1' : '')
      })
    }
    /*if (e.id) {
      //分享进入
      if (e.share) {
        wx.navigateTo({
          url: '../info/info?id=' + e.id + e.share?'&share=1':''
        })
      } else {
        //模板消息进入
        wx.navigateTo({
          url: '../info/info?id=' + e.id
        })
      }
    } else if (e.url) {
      wx.navigateTo({
        url: '../webview/webview?url=' + e.url
      })
    }*/
  },

  //下拉刷新页面
  onPullDownRefresh() {
    this.setData({
      page: 1,
    });
    util.getList(this);
  },
  //上拉加载更多
  onReachBottom() {
    if (this.data.page < this.data.allPage) {
      this.setData({
        page: this.data.page + 1
      })
      util.getList(this);
    } else {
      wx.showToast({
        title: '请刷新或换一换',
        image: '../img/notdata.png',
      });
    }
  },
  onShareAppMessage() {
    let that = this;
    let arr = wx.getStorageSync('datas');
    this.setData({
      shareListData: arr.sort(function () {
        return (0.5 - Math.random());
      }),
    })
    let _data = this.data.datas[0];
    return {
      title: _data.title,
      path: 'pages/index/index?id=' + _data.id + '&share=1',
      imageUrl: _data.thumb
    }
  },
  //刷新方法并提示
  replace() {
    app.aldstat.sendEvent('首页换一换', {
      name: '首页换一换'
    })
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      page: 1,
    });
    util.getList(this);
  },
  //跳转详情
  goToPage(e) {
    wx.navigateTo({
      url: '/pages/info/info?id=' + e.target.id
    });
  },
  //收集formID
  formInSign(e) {
    let userInfo = wx.getStorageSync('user');
    let formId = e.detail.formId;
    if (formId == 'the formId is a mock one') {
      return false;
    }
    if (formId && userInfo) {
      postFormId(userInfo.openid, formId);
    }
  },

  //关闭更多
  closeMore() {
    app.aldstat.sendEvent('首页分享关闭', {
      name: '首页分享关闭'
    })
    this.setData({
      showMore: false,
    })
  },
  //查看更多
  watchMore() {
    wx.reLaunch({
      url: '../index/index'
    })

  },
  getMsg(e) {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      hot: e.currentTarget.dataset.id || 0
    })
    util.getList(this);
  },
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  // setALD(e) {
  //     switch (e.currentTarget.dataset.id) {
  //         case '0':
  //             app.aldstat.sendEvent('首页第一个悬浮', {
  //                 name: '首页第一个悬浮'
  //             })
  //             break;
  //         case '1':
  //             app.aldstat.sendEvent('首页第二个悬浮', {
  //                 name: '首页第二个悬浮'
  //             })
  //             break;
  //         default:
  //             break;
  //     }
  // },
})