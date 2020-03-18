var util = require("../../../../config/global.js");
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    setTimeout(function () {
      //刷新
      var url = getApp().data.API_URL + '/web/person.api';
      var data = {
        act: 'refresh_resume',
        SESSIONKEY: getApp().data.SESSIONKEY,
        token: getApp().data.token,
        fromWx: getApp().data.fromWx
      };
      var func = function (res) {
        if (res.data.status == 1) {
          getApp().data.isGongZhonghao = 1; //标记公众号刷新
          var title = '刷新成功';
        } else if (res.data.status > 1) {
          var title = '请先把简历设置为公开状态';
        } else if (res.data.status == 0) {
          var title = '请先登录';
        } else {
          var title = res.data.nextTime.replace(/<[^>]+>/g, "") + '后刷新';
        }
        swan.showToast({
          title: title,
          mask: true,
          icon: 'success',
          duration: 2000,
          success: function (res) {
            setTimeout(function () {
              swan.switchTab({
                url: '/page/person/resume/index/index'
              });
            }, 2000);
          }
        });
      };
      util.isPost(data, url, func);
    }, 2000);
  }
});