// page/logout/logout.js
var util = require("../../config/global.js");
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    setTimeout(function () {
      var url = getApp().data.API_URL + '/web/mi.api';
      var data = {
        fromWx: getApp().data.fromWx,
        SESSIONKEY: getApp().data.SESSIONKEY,
        token: getApp().data.token,
        wxuid: getApp().data.wxuid,
        act: 'unbind'
      };
      var func = function (res) {
        if (res.data.status <= 0) {
          swan.showToast({ title: res.data.msg ? res.data.msg : '解绑失败', icon: 'success', mask: 'true', duration: 1000 });
          return;
        }
        getApp().data.token = '';
        getApp().data.uid = '';
        getApp().data.SESSIONKEY = '';
        that.setData({ uid: 0 });
        swan.switchTab({
          url: '/page/person/index/index'
        });
      };
      util.isPost(data, url, func);
    }, 2000);
  }
});