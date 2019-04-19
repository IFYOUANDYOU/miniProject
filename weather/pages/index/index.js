/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
  data: {
    list: [
      {
        "astroid": "1",
        "astroname": "白羊座",
        "date": "3.21~4.19",
        "pic": "../../images/xingzuo1.png"
      },
      {
        "astroid": "2",
        "astroname": "金牛座",
        "date": "4.20~5.20",
        "pic": "../../images/xingzuo2.png"
      },
      {
        "astroid": "3",
        "astroname": "双子座",
        "date": "5.21~6.21",
        "pic": "../../images/xingzuo3.png"
      },
      {
        "astroid": "4",
        "astroname": "巨蟹座",
        "date": "6.22~7.22",
        "pic": "../../images/xingzuo4.png"
      },
      {
        "astroid": "5",
        "astroname": "狮子座",
        "date": "7.23~8.22",
        "pic": "../../images/xingzuo5.png"
      },
      {
        "astroid": "6",
        "astroname": "处女座",
        "date": "8.23~9.22",
        "pic": "../../images/xingzuo6.png"
      },
      {
        "astroid": "7",
        "astroname": "天秤座",
        "date": "9.23~10.23",
        "pic": "../../images/xingzuo7.png"
      },
      {
        "astroid": "8",
        "astroname": "天蝎座",
        "date": "10.24~11.22",
        "pic": "../../images/xingzuo8.png"
      },
      {
        "astroid": "9",
        "astroname": "射手座",
        "date": "11.23~12.21",
        "pic": "../../images/xingzuo9.png"
      },
      {
        "astroid": "10",
        "astroname": "摩羯座",
        "date": "12.22~1.19",
        "pic": "../../images/xingzuo10.png"
      },
      {
        "astroid": "11",
        "astroname": "水瓶座",
        "date": "1.20~2.18",
        "pic": "../../images/xingzuo11.png"
      },
      {
        "astroid": "12",
        "astroname": "双鱼座",
        "date": "2.19~3.20",
        "pic": "../../images/xingzuo12.png"
      }
    ]
  },
  onLoad() {
     
  },
  goInfo(e) {
    //传递指定参数过去
    swan.navigateTo({
      url: '../conlist/conlist?id=' + e.currentTarget.dataset.index,
      success: () => { },
    });
  },
})
