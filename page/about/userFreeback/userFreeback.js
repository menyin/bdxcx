var util = require("../../../config/global.js");
Page({
  data: {
    // text:"这是一个页面"
  },
  onReady: function () {
    swan.setNavigationBarTitle({ title: '反馈' });
    //浏览记录
    getApp().addLog("/page/about/userFreback/userFreback");
  },
  formSubmit: function (e) {
    var that = this;
    var idea = e.detail.value.idea; //建议
    var uEmail = e.detail.value.uEmail; //邮箱
    var uName = e.detail.value.uName; //名称
    var uTel = e.detail.value.uTel; //电话

    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY ? getApp().data.SESSIONKEY : '',
      act: 'savaAbout',
      perName: uName,
      email: uEmail,
      mobilePhone: uTel,
      suggest: idea,
      fromUrl: 'weixinxiaochengxu'
    };
    var func = function (res) {
      if (res.data.status > 0) {
        swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          swan.switchTab({
            url: '/page/index/index'
          });
        }, 2000);
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '提交失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  }
});