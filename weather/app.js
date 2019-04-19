/**
 * @file app.js
 * @author swan
 */
const url="http://www.applet.bh"
App({
    onLaunch(options) {
        // do something when launch 

    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    },
    request(url, param, method) {//封装请求
        method = method ? method : 'GET';
        return new Promise(function (resolve, reject) {
            return swan.request({
                url: url,
                method: method,
                dataType: 'json',
                data: param,
                header: {
                    'content-type': 'application/json' 
                },
                success: function (res) {
                    resolve(res);
                }
            })
        })　
    },
    getList(that, id) {//获取列表页 
        this.request(url+'/xingzuo',{astroid:id}).then((res) => { 
            swan.setNavigationBarTitle({
                title: res.data.data.astroname
            })
            that.setData({
                xingzuo: res.data.data.astroid,
                obj: res.data.data,
                objMsg: res.data.data.today,
                bojdis: res.data.data.week,
            })
        }); 
    }, 
});
