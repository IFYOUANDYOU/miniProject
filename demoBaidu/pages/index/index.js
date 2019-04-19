/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: swan.canIUse('button.open-type.getUserInfo'),
    asks: [
      {},
      {},
      {},
      {},
      {}
    ],
    len: 0
  },
  onLoad() {
    var that = this;
    that.setData('len',that.data.asks.length)
  },
  getUserInfo(e) {
    swan.login({
      success: () => {
        swan.getUserInfo({
            success:(res)=> {
                this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                });
            },
            fail: ()=> {
              this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
              });
            }
        });
      },
      fail: () => {
        swan.showModal({
          title: '未登录',
          showCancel: false
        });
      }
    });
  },
  swiperBind(e){
    var that = this;
    if(e.detail.current + 1 == that.data.asks.length){
      return false;
    }
  }
})
