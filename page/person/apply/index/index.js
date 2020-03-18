var loginFunction = require('../../../loginTemplate/loginTemplate.js');
var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    applyCount: [],
    loginData: loginFunction.loginData
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

    this.setData({ uid: getApp().data.uid, wxUserInfo: getApp().data.wxUserInfo });
    this.getInfo();
  },
  onReady: function () {
    //浏览记录
    getApp().addLog("/page/person/apply/index/index");
  },
  //获取数据
  getInfo() {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getApplyManage'
    };
    var func = function (res) {
      that.setData({ applyCount: res.data });
    };
    util.isPost(data, url, func);
  }
});