Page({
    data: {
        fenxi: [{ name: "星座基础分析中", state: 0, }, { name: "爱情运势分析中", state: 0, }, { name: "财富运势分析中", state: 0, }, { name: "事业运势分析中", state: 0, },],//分析数据
        showBg: false,//生成报告
        showBtn: false,//显示底部付款按钮
        showStar: false,
        timeEnd:'2:0:0'
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数 
        let i = 0;
        let that = this;
        var timerId = setInterval(() => {
            let obj = that.data.fenxi;
            switch (i) {
                case 0:
                    obj[0].name = "星座基础分析完成";
                    obj[0].state = 1;
                    that.setData({
                        fenxi: obj,
                    })
                    break;
                case 1:
                    obj[1].name = "爱情运势分析完成";
                    obj[1].state = 1;
                    that.setData({
                        fenxi: obj,
                    })
                    break;
                case 2:
                    obj[2].name = "财富运势分析完成";
                    obj[2].state = 1;
                    that.setData({
                        fenxi: obj,
                    })
                    break;
                case 3:
                    obj[3].name = "事业运势分析完成";
                    obj[3].state = 1;
                    that.setData({
                        fenxi: obj,
                        showBg: true,
                    })
                    break;
            }
            i++
            if (i == 5) {
                that.setData({
                    showStar: true
                })
                clearInterval(timerId)
            }
        }, 700)
        //倒计时　
        let maxtime = 60 * 60*2; //一个小时，按秒计算，自己调整!  
        let daojishi = setInterval(() => { 
            if (maxtime >= 0) {
                 let house = Math.floor(maxtime / 60/60);
                let minutes = Math.floor(maxtime / 60/2);
                let seconds = Math.floor(maxtime % 60); 
                maxtime--;
                that.setData({
                    timeEnd:house+':'+minutes+":"+seconds
                }) 
            } else {
                clearInterval(daojishi); 
            }
        }, 1000)
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    onPageScroll(e) {

        if (e.scrollTop <= 1100) {
            this.setData({
                showBtn: false
            })
        } else {
            this.setData({
                showBtn: true
            })
        }
    },
    goInfo() {
        swan.navigateTo({
            url: '../order/order'
        });
    }
});