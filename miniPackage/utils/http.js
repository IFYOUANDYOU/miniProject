const apiurl = "https://applet.632wp6.cn/";
const api = "http://localhost:3000/api/";
const header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': null
}

const requestUrl = function(loading, url, datas, method, dataType, responseType){

  if (loading){
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
  }

  var paramSession = [
    {},
    //{ 'content-type': 'application/json', 'Cookie': 'JSESSIONID=' + sessionId },
    //{ 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + sessionId },
    //{ 'content-type': method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json' }
  ]

  method = method || 'GET';
  if (!url) return false;
  if (!!!datas) datas = null;
  dataType = dataType || 'json';
  responseType = responseType || 'text';
  return new Promise(function(resolve,reject){
    wx.request({
      url: api + url,
      data: datas,
      header,
      method,
      dataType,
      responseType,
      success(res) {
        resolve(res);
      },
      fail(err){
        err = err || '数据请求失败';
        reject(err)
      },
      complete(res){
        if (loading) {
          wx.hideToast();
        }
      }
    })
  })
  
}

module.exports = {
  header: header,
  requestUrl: requestUrl
}  


//在app.js中引入  var http = require('../utils/http.js');
//修改header参数  http.header.Authorization = 'Bearer ' + '';
//在app.js中调用  http.requestUrl().then(res=>{}).catch(err=>{})
//在其他页面调用   app.http.requestUrl().then(res=>{}).catch(err=>{})