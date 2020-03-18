var loginFunction = require('../../../loginTemplate/loginTemplate.js');
var util = require("../../../../config/global.js");
Page({
  data: {
    resumeRow: {}, //简历信息
    isCheckName: '', //审核状态
    loginData: loginFunction.loginData
  },
  onLoad: function () {
    //公众号菜单刷新过来的，重新获取简历
    if (getApp().data.isGongZhonghao && getApp().data.uid && getApp().data.SESSIONKEY) {
      getApp().getResumeRow(getApp().data.uid, getApp().data.SESSIONKEY);
    }
  },
  onShow: function () {
    //微信公众菜单特别处理
    var tempBase = getApp().data.tempBase;
    var uid = getApp().data.uid;
    if (!uid && tempBase && tempBase.scene == 1035) {
      getApp().getUserLogion();
    } else {
      if (!getApp().checkLogin()) return; //验证是否登录
    }

    var that = this;
    that.setData({ uid: getApp().data.uid, wxUserInfo: getApp().data.wxUserInfo });

    //第一次创建简历 返回过来的，重新获取简历信息
    if (getApp().data.isCreate) {
      getApp().getResumeRow(getApp().data.uid, getApp().data.SESSIONKEY);
      getApp().data.isCreate = false;
    }

    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var isCheckName = '';
        if (res.data.isCheck == 0) isCheckName = '审核中';
        if (res.data.isCheck == 2) isCheckName = '审核不通过';
        that.setData({ resumeRow: res.data, isCheckName: isCheckName });
      },
      fail: function () {
        that.setData({ errorHide: false, errorMsg: '缓存获取失败' });
      }
    });
  },
  onReady: function () {
    //浏览记录
    getApp().addLog("/page/person/resume/index/index");
  }
});