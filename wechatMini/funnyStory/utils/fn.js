var allfn={
  //swiper滚动事件
  change_index: function (index,that) {
    that.setData({
      current_index: index,
      now_index: "item" + index
    })
  },
  // 顶部点击
  click_index: function (index,that) {
    // console.log(index);
    that.setData({
      current_index: index,
      now_index: "item" + index
    })
  },
  // 点赞：
  click_thumbs:function(token,id,type,that){
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/good",
      method:"POST",
      data:{
        token,
        id,
        type,
      },
      success:(res)=>{
        // console.log(res);
        // console.log(that.data.care_list)

        //改变界面显示
        // console.log(that.data.recomment_list)
        var list = that.data.recomment_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            recomment_list: list
          })
        }
        

        var list = that.data.care_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            care_list: list
          })
        }
        

        var list = that.data.forge_list

        if (list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            forge_list: list
          })
        }
        

        var list = that.data.pic_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            pic_list: list
          })
        }
       
        var list = that.data.video_list
        if (list) {
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            video_list: list
          })
        }
        
        var list = that.data.rank_list

        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isgood = list[i].isgood ? false : true;
              list[i].good_num = type == "cancel" ? --list[i].good_num : ++list[i].good_num
            }
          }
          that.setData({
            rank_list: list
          })
        }
        wx.showToast({
          title: '操作成功',
        })
        
      }
    })
  },
  // 点踩：
  click_zandown: function (token, id, type, that) {
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/bad ",
      method: "POST",
      data: {
        token,
        id,
        type,
      },
      success: (res) => {
        // console.log(res);
        // console.log(that.data.care_list)
        //改变界面显示
        var list = that.data.recomment_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            recomment_list: list
          })
        }
       

        var list = that.data.care_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            care_list: list
          })
        }
        

        var list = that.data.forge_list

        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            forge_list: list
          })
        }
        

        var list = that.data.pic_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            pic_list: list
          })
        }
        
        var list = that.data.video_list

        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            video_list: list
          })
        }
       
        var list = that.data.rank_list
        if(list){
          var len = list.length
          for (var i = 0; i < len; i++) {
            if (list[i].id == id) {
              list[i].isbad = list[i].isbad ? false : true;
              list[i].bad_num = type == "cancel" ? --list[i].bad_num : ++list[i].bad_num
            }
          }
          that.setData({
            rank_list: list
          })
        }
        
        wx.showToast({
          title: '操作成功',
        })

      }
    })
  },

  //收藏
  collection:function(){
     
  },
  mjs_godetail:function(id){
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  },
  //获取当前城市
  loadCity: function (longitude, latitude ,that) {
    // console.log(longitude, latitude)
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=jfDYj5Gg9etxMGSALzfaCcuzQ3NKt6h4&location=' + latitude + ',' + longitude + '&output=json',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        // console.log(city)
        that.setData({
          "item.city": city
        })
      },
      fail: function () {
      },

    })
  },


  //获取列表
  get_list: function (token, type, page, format,that){
    wx.request({
      url: "https://xh.jiqixing.com/xiaohua/getlist",
      method:"GET",
      data:{
        token,
        type,
        page,
        format
      },
      success:(res)=>{
        // console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if(res.data){
          switch (type) {
            case 0:
              var list = that.data.recomment_list;
              list = list.concat(res.data)
              // console.log(list);
              that.setData({
                recomment_list: list
              })
              break;
            case 1:
              var list = that.data.forge_list;

              list = list.concat(res.data)
              that.setData({
                forge_list: list
              })
              break;
            case 2:
              var list = that.data.pic_list;
              list = list.concat(res.data)
              that.setData({
                pic_list: list
              })
              
              break;
            case 3:
              var list = that.data.video_list;

              list = list.concat(res.data)
              that.setData({
                video_list:list
              })
              break;
            case 4:
              var list = that.data.rank_list;

              list = list.concat(res.data)
              that.setData({
                rank_list: list
              })
              break;
          }
        }
        
        
      }
    })
  },
  //多张图片上传
  upload_many_img:function(data,formdata){
    // console.log(data);
    // console.log(formdata);
      wx.showLoading({
      title: '正在发布中...',
    })
    var that= this,
    i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
wx.uploadFile({
  url: "https://xh.jiqixing.com/xiaohua/savePic",
  filePath: data.path[i],
  name: 'file',//这里根据自己的实际情况改
  formData: formdata,
  success: (res) => {
    // console.log(res)
    if(res.data.code==0){ 
      success++;
    }
    // console.log(i);
    //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
  },
  fail: (res) => {
    fail++;
    // console.log('fail:' + i + "fail:" + fail);
  },
  complete: () => {
    // console.log(i);
    i++;
    if (i == data.path.length) {   //当图片传完时，停止调用          
      // console.log('执行完毕');
      wx.hideLoading();
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index_4',
        })
      }, 1000)
      // console.log('成功：' + success + " 失败：" + fail);
    } else {//若图片还没有传完，则继续调用函数
      // console.log(i);
      data.i = i;
      data.success = success;
      data.fail = fail;
      that.upload_many_img(data,formdata);
    }

  }
});
    }
}


module.exports={
  allfn
}