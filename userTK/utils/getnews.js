const app = getApp();
const utils = require("util.js");

var getnews = (userid,comfun) => {
  var userid = app.globalData.userId;
  var url = "",hasread = null;
  url = app.globalData.apiurl + "getread/" + userid+"/0";
  utils.requestUrl(
    url,
    null,
    null,
    null,
    null,
    function (res) {
      if (res.data.code != 200) return false;
      comfun(res.data);
    },
    function (res) {
      utils.showToast(res.data.msg);
    },
    function (res) {

    }
  );
}

module.exports = {
  getnews: getnews
}