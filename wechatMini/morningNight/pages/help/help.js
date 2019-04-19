Page({
  data:{
    view_state : 'display-none',
    view_states : 'display-none',
    view_state1 : 'display-none',
    view_state2 : 'display-none',
    view_state3 : 'display-none',
    view_state4 : 'display-none',
    view_state5 : 'display-none'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    // return {
    //   title: '一句话经典语录', // 分享标题
    //   desc: 'desc', // 分享描述
    //   path: 'path' // 分享路径
    // }
  },  
//   点击显示
clickshow:function(e){
  var that = this;
  var new_state="";
  var view_state=that.data.view_state;
  view_state == 'display-block';
  if(view_state == 'display-none'){
    new_state = "display-block";
  }else{
    new_state = "display-none";
  }
  that.setData({
      view_state : new_state
  });

},clickshow1:function(e){
  var that = this;
  var new_states="";
  var view_states=that.data.view_states;
  if(view_states == 'display-none'){
    new_states = "display-block";
  }else{
    new_states = "display-none";
  }
  that.setData({
      view_states : new_states
  });

},
clickshow2:function(e){
  var that = this;
  var new_state1="";
  var view_state1=that.data.view_state1;
  if(view_state1 == 'display-none'){
    new_state1 = "display-block";
  }else{
    new_state1 = "display-none";
  }
  that.setData({
      view_state1 : new_state1
  });

},
clickshow3:function(e){
  var that = this;
  var new_state2="";
  var view_state2=that.data.view_state2;
  if(view_state2 == 'display-none'){
    new_state2 = "display-block";
  }else{
    new_state2 = "display-none";
  }
  that.setData({
      view_state2 : new_state2
  });

},
clickshow4:function(e){
  var that = this;
  var new_state3="";
  var view_state3=that.data.view_state3;
  if(view_state3 == 'display-none'){
    new_state3 = "display-block";
  }else{
    new_state3 = "display-none";
  }
  that.setData({
      view_state3 : new_state3
  });

},
clickshow5:function(e){
  var that = this;
  var new_state4="";
  var view_state4=that.data.view_state4;
  if(view_state4 == 'display-none'){
    new_state4 = "display-block";
  }else{
    new_state4 = "display-none";
  }
  that.setData({
      view_state4 : new_state4
  });

},
clickshow6:function(e){
  var that = this;
  var new_state5="";
  var view_state5=that.data.view_state5;
  if(view_state5 == 'display-none'){
    new_state5 = "display-block";
  }else{
    new_state5 = "display-none";
  }
  that.setData({
      view_state5 : new_state5
  });

}
})