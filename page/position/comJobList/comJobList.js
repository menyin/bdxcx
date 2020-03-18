var util = require("../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    companyRow: [],
    hideAll: true,
    _version: '' //微信版本号，6.5.8才能用页面按钮分享
  },
  onLoad: function (options) {
    var that = this;
    var _version = getApp().data.sysInfo._version;
    this.setData({ _version: _version });

    //获取企业信息
    var cid = options.cid;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'getComJobList',
      cid: cid
    };
    var func = function (res) {
      that.setData({ companyRow: res.data, hideAll: false });
    };
    util.isGet(data, url, func);
  },
  onShow: function () {
    //显示隐藏返回首页
    var showBackIndex = true;
    if (getCurrentPages().length == 1) showBackIndex = false;
    this.setData({ showBackIndex: showBackIndex });
  },
  onReady: function () {
    // 页面渲染完成
    var count = this.data.companyRow.allCount ? '(' + this.data.companyRow.allCount + ')' : '';
    swan.setNavigationBarTitle({ title: '在招职位' + count });
    //浏览记录
    getApp().addLog("/page/position/conJobList/conJobList");
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: this.data.companyRow.cname,
      desc: this.data.companyRow.comInfo.substr(0, 100) + '...',
      path: '/page/position/comJobList/comJobList?cid=' + this.data.companyRow._cid
    };
  }
});