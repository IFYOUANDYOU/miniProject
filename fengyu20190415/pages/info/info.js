// pages/info/info.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        otherArticle: [],
        position: 2,
        showShareMsg: false,
        showMore: false,
        params: null, //页面url参数
        innerAudioContext: null, //音频容器
        showFooter: 0, //是否显示快捷菜单
        winHeight: 0, //页面的滚动高度
        tpArticle: [],
        articleLength: 0,
        articles: [],
        listData: [],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            params: options,
        });
        this.getRecommend()
        //分享到群
        this.setTime()
        let that = this;

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //页面栈,用于页面层级过多的返回
        let wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
        let wxPrevPage = wxCurrPage[wxCurrPage.length - 1]; //获取上级页面的page对象
        let currentData = wxPrevPage.data.tpArticle;
        if (currentData.id) {
            this.setData({
                params: {
                    id: currentData.id,
                },
            });
        }
        getArticle(this);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.data.innerAudioContext.pause();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        this.data.innerAudioContext.destroy();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

        let that = this;
        let arr = wx.getStorageSync('datas');
        this.setData({
            shareListData: arr.sort(function() {
                return (0.5 - Math.random());
            }),
        })
        setTimeout(function() {
            that.setData({
                showMore: true,
            })
        }, 1000);
        return {
            title: this.data.tpArticle.title,
            path: 'pages/index/index?id=' + this.data.tpArticle.id + '&share=1',
            imageUrl: this.data.tpArticle.thumb
        }
    },

    goToHot() {

        wx.reLaunch({
            url: '/pages/index/index?hot=1&activeNum=1'
        });
    },
    goToIndex() {

        wx.reLaunch({
            url: '/pages/index/index?hot=0&activeNum=0'
        });
    }, 
    //暂停播放
    payMusic() {
        this.data.innerAudioContext.paused ? this.data.innerAudioContext.play() : this.data.innerAudioContext.pause();
    },
    //跳转页面
    goToArticle(e) {

        if (e.currentTarget.dataset.islink == 2) {
            wx.navigateTo({
                url: '/pages/webview/webview?url=' + e.currentTarget.dataset.thumb
            });
        } else {
            wx.navigateTo({
                url: '/pages/info/info?id=' + e.currentTarget.id,
            });
        }
    },
    //收集formID
    formInSign(e) {

        let userInfo = wx.getStorageSync('user');
        let formId = e.detail.formId;
        if (formId == 'the formId is a mock one') {
            return false;
        }
        if (formId && userInfo) {
            postFormId(userInfo.openid, formId);
        }
    },
    onPageScroll(ev) {
        if (ev.scrollTop > this.data.winHeight) {
            //向上滚动（显示）
            this.setData({
                showFooter: 1,
            });
        } else {
            //向下滚动（隐藏）
            this.setData({
                showFooter: 0,
            });
        }
        let that = this;
        setTimeout(function() {
            that.setData({
                winHeight: ev.scrollTop,
            });
        }, 1000);
    },
    getRecommend() {

        getInfoRec(this)
    },
    //关闭更多
    closeMore() {

        this.setData({
            showMore: false,
        })
    },
    //查看更多
    watchMore() {

        wx.reLaunch({
            url: '../index/index'
        })

    },
    watchMoreBack() {
        wx.reLaunch({
            url: '../index/index'
        }) 
    },

    //定时器
    setTime() {
        let that = this;
        let times =
            setInterval(function() {
                that.setData({
                    showShareMsg: true
                })
                clearInterval(times);
            }, 5000)
        setInterval(function() {
            that.setData({
                showShareMsg: false
            })
            clearInterval(times);
        }, 15000)
    },
})