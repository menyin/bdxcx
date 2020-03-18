// page/newArea/newArea.js
Page({
  data: {
    hotCity: getApp().data.hotCity,
    localCity: {},
    fromSearch: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ fromSearch: options.fromSearch, keyword: options.keyword });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.setData({ localCity: getApp().data.localCity });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  citySearch: function (e) {
    var that = this;
    var v = e.target.dataset.v; //城市id
    var c = e.target.dataset.c; //城市名称
    var localCity = { 'id': v, 'name': c
      //获取城市下面的地区
    };getApp().getSelectCity(localCity);

    // getApp().data.localCity = localCity;
    // wx.setStorage({
    //   key: 'localCity',
    //   data: localCity
    // });
    setTimeout(function () {
      if (that.data.fromSearch) {
        swan.redirectTo({
          url: '/page/search/result/result?keyword=' + that.data.keyword
        });
      } else {
        swan.navigateBack();
      }
    }, 600);
  }
});