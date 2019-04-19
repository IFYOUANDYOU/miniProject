//时间转换 YYYY/MM/DD 16:53:17
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//转换字符类型
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 显示提示(文本提示，成功提示，加载提示)
const showToast = (text, icon, durations, successfn, failfn) => {
  wx.showToast({
    title: text,
    mask: true,
    duration: durations ? durations : 2000,
    icon: icon ? icon : "none",
    success: function (res) {
      if (successfn) successfn(res);
    },
    fail: function (res) {
      if (failfn) failfn(res);
    }
  })
}
//显示模态对话框
const showModals = (tt, dt, isDel, successfn, failfn, delText, conText) => {
  var cancel = delText ? delText : "取消";
  var confirm = conText ? conText : "确定";
  wx.showModal({
    title: tt ? tt : "温馨提示",
    content: dt ? dt : "",
    showCancel: isDel == 0 ? false : true,
    cancelText: cancel,
    confirmText: confirm,
    success: function (res) {
      if (successfn) successfn(res, cancel, confirm);
    },
    fail: function (res) {
      if (failfn) failfn(res);
    }
  })
}
//判断获取联网状态
const getNetwork = (successfn, failfn) => {
  var isnet = false;
  wx.getNetworkType({
    success: function (res) {
      if (res.networkType != "none") {
        isnet = true;
      }
    },
    fail: function (res) {

    }
  })
  return isnet;
}
//接口请求
const requestUrl = (url, datas, header, method, dataType, successfn, errorfn, completefn) => {
  wx.request({
    url: url,
    data: datas,
    header: {
      'content-type': method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    method: method,
    dataType: dataType,
    success: function (res) {
      successfn(res)
    },
    fail: function (res) {
      errorfn(res)
    },
    complete: function (res) {
      completefn(res)
    }
  })
}
//采用正则表达式获取地址栏参数
const GetQueryString = (url, paramName) => {
  var paramValue = "", isFound = !1;
  if (url.indexOf("?") != 0 && url.indexOf("=") > 1) {
    var arrSource = unescape(url).substring(1, url.length).split("?"), i = 0;
    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
  }
  return paramValue == "" && (paramValue = null), paramValue
}

//身份证验证
const IdentityCodeValid = code => {
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  }
  else if (!city[code.substr(0, 2)]) {
    tip = "身份证号码地址编码错误";
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "身份证号码校验位错误";
        pass = false;
      }
    }
  }
  if (!pass) {
    console.log(tip)
  };
  return pass;
}
//多维数组判断是否存在某值
const isInArray = (array, element) => {
  for (var el of array){
    return (el.id == element.id);
  }
}
//图片预览
const previewImg = (list, cur) => {
  if (!list) return false;
  wx.previewImage({
    current: cur ? cur : "",
    urls: list,
    success: function (e) {
      console.log("图片预览api调用成功");
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  showToast: showToast,
  showModals: showModals,
  getNetwork: getNetwork,
  IdentityCodeValid: IdentityCodeValid,
  requestUrl: requestUrl,
  GetQueryString: GetQueryString,
  isInArray: isInArray,
  previewImg: previewImg
}
