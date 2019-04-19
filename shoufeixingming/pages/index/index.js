/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
  data: {
    showBtn: false,//底部按钮
    number:Math.floor(Math.random()*(876583-50000+1)+50000),
    userInfo: {},
    hasUserInfo: false,
    canIUse: swan.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    
  },
  onPageScroll(e) {
    if (e.scrollTop > 500) {
      this.setData({
        showBtn: true
      })
    } else {
      this.setData({
        showBtn: false
      })
    }
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
  }
})
