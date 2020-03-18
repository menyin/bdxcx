var util = require("../../../config/global.js");
Page({
  data: {
    uid: '',
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    companyRow: [],
    hideAll: true
  },
  onLoad: function (options) {
    var that = this;
    //获取企业信息
    var cid = options.cid;
    var url = getApp().data.API_URL + '/web/mi.api?act=getCompanyInfo&cid=' + cid + '&isShowPic=1';
    var data = {
      act: 'getCompanyInfo',
      cid: cid,
      isShowPic: 1
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
    this.setData({ uid: getApp().data.uid, showBackIndex: showBackIndex });
  },
  onReady: function () {
    //设置标题
    if (this.data.companyRow.cname) {
      swan.setNavigationBarTitle({ title: this.data.companyRow.cname });
    }
    getApp().addLog("/page/position/showCompany/showCompany");
  },
  //展开
  changePHeight: function () {
    this.setData({ pHeight: 'auto', hide: ' hide' });
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: this.data.companyRow.cname,
      desc: this.data.companyRow.comInfo.substr(0, 100) + '...',
      path: '/page/position/showCompany/showCompany?cid=' + this.data.companyRow._cid + '&isShowPic=1'
    };
  }
});