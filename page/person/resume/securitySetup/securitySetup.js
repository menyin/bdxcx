var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    resumeRow: [], //简历信息
    checked: 1 //1公开， 0保密
  },
  onLoad: function (options) {
    var that = this;
    //获取简历
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        that.setData({ resumeRow: res.data, checked: parseInt(res.data.display) });
      },
      fail: function () {
        swan.showToast({ title: '缓存获取失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    //浏览记录
    getApp().addLog("/page/person/resume/securitySetup/securitySetup");
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var display = e.detail.value.status;
    var resumeRow = this.data.resumeRow;
    var url = getApp().data.API_URL + '/web/resumes.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'privacy',
      display: display
    };
    var func = function (res) {
      if (res.data.status == 1) {
        var resumeRow = that.data.resumeRow;
        resumeRow.display = display;
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow
        });
        swan.showToast({ title: '修改成功', mask: true, icon: 'success', duration: 1000 });
      }
    };
    util.isPost(data, url, func);
  },
  //修改选择样式
  changeChecked: function (e) {
    var checked = e.currentTarget.dataset.val;
    this.setData({ checked: checked });
  }
});