// pages/webview/webview.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        urls: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //模板消息进入
        if (options.url) {
            this.setData({
                urls: options.url
            })
        } else {
            //点击悬浮进入
            this.getConfig(options.name)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    getConfig(e) {
        let that = this
        wx.request({
            url: app.appData.url + 'config?name=' + e,
            success(res) { 
                that.setData({
                    urls: res.data.data.value
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})