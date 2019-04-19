const app = getApp();
const apiUrl = app.appData.url;
//request 请求
wxRequest = function(url, params, method) {
    method = method ? method : 'GET';
    return new Promise(function(resolve, reject) {
        wx.request({
            url: apiUrl + url,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: method,
            data: params,
            success: function(res) {
                resolve(res);
            }
        });
    });
}

//获取列表
getList = function(that) {
    if (that.data.datas) {
        //显示加载中
        wx.showLoading({
            title: '加载中...'
        })
    }
    wxRequest('article', {
        hot: that.data.hot
    }).then((res) => {
        if (res.data.code == 0) {
            //下拉刷新
            that.setData({
                datas: res.data.data,
            });
            wx.setStorage({
                key: "datas",
                data: res.data.data
            });
            // 隐藏加载中
            wx.hideLoading();
            wx.stopPullDownRefresh();
        }
    });
}

//收集formid
postFormId = function(openid, formId) {
    wxRequest('form', {
        openid: openid,
        formid: formId
    }, 'POST')
}
//webview获取值
getWebview = function(that) {
    wxRequest('article/info', that.data.params).then((res) => {
        that.setData({
            urls: res.data.data.link_url
        })
    })
}
getInfoRec = function(that) {

    wxRequest('article/list').then((res) => {
        that.setData({
            listData: res.data.data,
        });
    });
}
//获取文章详情接口
getArticle = function(that) {

    //显示加载中
    wx.showLoading({
        title: '跳转中...'
    })
    var user = wx.getStorageSync("user");
    that.data.params.openid = user.openid || 0;
    wxRequest('article/info', that.data.params).then((res) => {

        if (res.data.code == 0) {
            if (res.data.code == 0) {
                let result = res.data.data;
                const regex = new RegExp('<img', 'gi');
                result.content = result.content.replace(regex, `<img style="max-width: 100%;margin-top:-5px;"`);
                result.created_at = result.created_at.split('-')[0] + '年' + result.created_at.split('-')[1] + '月' + result.created_at.split('-')[2].trim().split(' ')[0] + '日';
                that.setData({
                    tpArticle: result,
                    articleLength: Object.keys(result).length,
                    innerAudioContext: wx.createInnerAudioContext()
                });
                that.data.innerAudioContext.src = that.data.tpArticle.music;
                that.data.innerAudioContext.autoplay = true;
                that.data.innerAudioContext.play();
                getRecommend(that);
            }
            // 隐藏加载中
            wx.hideLoading();
        }
    });
}
getRecommend = function(that) {

    wxRequest('article/list').then((res) => {
        that.setData({
            articles: res.data.data,

        });
    });
}
getNowFormatDate = function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}
module.exports = {
    getWebview: getWebview,
    wxRequest: wxRequest,
    getList: getList,
    postFormId: postFormId,
    getArticle: getArticle,
    getNowFormatDate: getNowFormatDate,
    getInfoRec: getInfoRec,
}