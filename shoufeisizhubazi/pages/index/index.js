/**
 * @file index.js
 * @author swan
 */
const app = getApp()
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1940; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
let number = Math.floor(Math.random()*(876583-50000+1)+50000);
Page({
  data: {
    
    showBtn: false,//底部按钮
    number:number,//随机数
    value: [79, date.getMonth(), date.getDate() - 1, date.getHours()],//选中值
    years: years,//年
    month: months,//月
    day: days,//日
    time: ["00:00-00:59(子)", "01:00-01:59(丑)", "02:00-02:59(丑)", "03:00-03:59(寅)", "04:00-04:59(寅)", "05:00-05:59(卯)", "06:00-06:59(卯)", "07:00-07:59(辰)", "08:00-08:59(辰)", "09:00-09:59(巳)", "10:00-10:59(巳)", "11:00-11:59(午)", "12:00-12:59(午)", "13:00-13:59(未)", "14:00-14:59(未)", "15:00-15:59(申)", "16:00-16:59(申)", "17:00-17:59(酉)", "18:00-18:59(酉)", "19:00-19:59(戌)", "20:00-20:59(戌)", "21:00-21:59(亥)", "22:00-22:59(亥)", "23:00-23:59(子)", "未知",],//时间
    showPicker: false,//展示picker
    timeMan: "请选择",
    items: [
      { name: 'USA', value: '男', checked: true },
      { name: 'CHN', value: '女' },

    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: swan.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {

  },
  showPicker(e) {
    this.setData({
      who: e.currentTarget.dataset.id,
      showPicker: true
    })
  },
  closePicker() {
    if (this.data.onTime) {
      if (this.data.who == "1") {
        this.setData({
          timeMan: this.data.onTime,
          showPicker: false
        })
      }
      else {
        this.setData({
          timeWuMan: this.data.onTime,
          showPicker: false
        })
      }
    } else {
      let _year = this.data.years[this.data.value[0]];
      let _month = this.data.month[this.data.value[1]];
      let _day = this.data.day[this.data.value[2]];
      let _time = this.data.time[this.data.value[3]]; 
      this.setData({
          value: this.data.value,
          timeMan: _year + "-" + _month + "-" + _day + "-" + _time,
          showPicker: false
        })
    } 
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
          success: (res) => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
          },
          fail: () => {
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
  }
})
