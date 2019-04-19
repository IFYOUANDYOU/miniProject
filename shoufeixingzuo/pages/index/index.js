/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: swan.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    
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
  goInfo(e){
    swan.navigateTo({
      url: '../analysis/analysis'
    });
  }
})
