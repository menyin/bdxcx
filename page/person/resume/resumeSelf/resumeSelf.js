var util = require("../../../../config/global.js");
Page({
  data: {
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({ self1: options.self });
    var that = this;
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        that.setData({
          resumeRow: resumeRow,
          self: resumeRow.joinEvaluate
        });
        console.log(resumeRow);
      },
      fail: function () {
        swan.showToast({ title: '获取简历信息失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    // 页面渲染完成
    swan.setNavigationBarTitle({ 'title': '自我评价' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeSelf/resumeSelf");
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var careerDirection = e.detail.value.careerDirection; //自我评价
    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      token: getApp().data.token,
      SESSIONKEY: getApp().data.SESSIONKEY,
      act: 'resume_save',
      txtAppraise: careerDirection
    };
    var func = function (res) {
      if (res.status <= 0) {
        swan.showToast({ title: res.msg ? res.msg : '提交失败', mask: true, icon: 'success', duration: 1000 });
        return;
      }
      var resumeRow = that.data.resumeRow;
      var newData = { joinEvaluate: careerDirection };
      that.saveResumeRow(resumeRow, newData, that);
    };
    util.isPost(data, url, func);
  },
  //修改简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    resumeRow.joinEvaluate = newData.joinEvaluate;
    swan.setStorage({
      key: 'resumeRow' + getApp().data.uid,
      data: resumeRow,
      success: function (res) {
        swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          swan.navigateBack(); //返回
        }, 1000);
      },
      fail: function () {
        swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  }
});