var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    resumeRow: []
  },
  onLoad: function () {
    var that = this;
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        that.setData({ resumeRow: res.data, isAutoRefresh: res.data.isAutoRefresh });
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
    getApp().addLog("/page/person/resume/queryBaseInfo/queryBaseInfo");
  },
  //登录自动刷新
  switchChange: function (e) {
    var that = this;
    var isAutoRefresh = e.target.dataset.value == 1 ? 0 : 1;

    //修改状态
    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'isAutoRefresh',
      flag: isAutoRefresh
    };
    var func = function (res) {
      if (res.data.status == 1) {
        var resumeRow = that.data.resumeRow;
        resumeRow.isAutoRefresh = isAutoRefresh;

        that.setData({ isAutoRefresh: isAutoRefresh });
        //更新缓存
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow
        });
        return;
      }
      if (res.data.status == -2) {
        swan.showToast({
          title: '请先把简历设置为公开状态',
          mask: true,
          icon: 'success',
          duration: 2000,
          success: function (res) {
            setTimeout(function () {
              swan.navigateTo({
                url: '/page/person/resume/securitySetup/securitySetup'
              });
            }, 2000);
          }
        });
        return;
      }
      swan.showToast({ title: '设置刷新失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //立即刷新
  refreshChange: function () {
    var that = this;
    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      act: 'refresh_resume',
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx
    };
    var func = function (res) {
      if (res.data.status == 1) {
        var resumeRow = that.data.resumeRow;
        resumeRow.resumeUptime = res.data.nowTime;
        that.setData({ resumeRow: resumeRow });
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow
        });
        swan.showToast({ title: '刷新成功', mask: true, icon: 'success', duration: 1000 });
        return;
      }
      if (res.data.status >= 0) {
        swan.showToast({
          title: '请先把简历设置为公开状态',
          mask: true,
          icon: 'success',
          duration: 2000,
          success: function (res) {
            setTimeout(function () {
              swan.navigateTo({
                url: '/page/person/resume/securitySetup/securitySetup'
              });
            }, 2000);
          }
        });
        return;
      }
      var errorMsg = res.data.nextTime.replace(/<[^>]+>/g, "") + '后刷新';
      swan.showToast({ title: errorMsg, mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  }
});