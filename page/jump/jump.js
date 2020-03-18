// page/jump/jump.js
Page({
  data: {},
  onLoad: function (options) {
    // 中间跳转页， 为解决为获取到openid就已经跳转到用户管理中心
    var url = options.url;
    swan.showToast({ title: '加载中...', mask: true, icon: 'loading', duration: 1000 });
    setTimeout(function () {
      swan.redirectTo({
        url: url
      });
      swan.hideToast();
    }, 1000);
  }
});