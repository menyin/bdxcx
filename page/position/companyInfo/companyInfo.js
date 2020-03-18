var util = require("../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    companyRow: [],
    hideAll: true,
    _version: '' //微信版本号，6.5.8才能用页面按钮分享
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var _version = getApp().data.sysInfo._version;
    this.setData({ _version: _version });

    ///获取企业信息
    var cid = options.cid;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'getCompanyInfo',
      cid: cid
    };
    var func = function (res) {
      that.setData({ companyRow: res.data, hideAll: false });
      if (res.data.comLongitude != '0' && res.data.comLatitude != '0') {
        that.changeZuoBiao();
      }
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
    getApp().addLog("/page/position/companyInfo/companyInfo");
  },
  //改变高度
  changePHeight: function () {
    this.setData({ pHeight: 'auto', hide: ' hide' });
  },
  //查看地图
  showMap: function () {
    swan.openLocation({
      longitude: Number(this.data.companyRow.comLongitude),
      latitude: Number(this.data.companyRow.comLatitude),
      name: this.data.companyRow.cname,
      address: this.data.companyRow.comAddress
    });
  },
  //百度地图坐标 转换为 腾讯地图坐标
  changeZuoBiao: function () {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'getZuoBiao',
      fromWx: getApp().data.fromWx,
      long: this.data.companyRow.comLongitude,
      lat: this.data.companyRow.comLatitude
    };
    var func = function (res) {
      console.log(res);
      if (!res.data || !res.data.locations) return;
      var a = res.data.locations;
      var lng = a[0].lng;
      var lat = a[0].lat;
      var companyRow = that.data.companyRow;
      companyRow.comLongitude = lng;
      companyRow.comLatitude = lat;
      that.setData({ companyRow: companyRow });
    };
    util.isGet(data, url, func);
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: this.data.companyRow.cname,
      desc: this.data.companyRow.comInfo.substr(0, 100) + '...',
      path: '/page/position/companyInfo/companyInfo?cid=' + this.data.companyRow._cid
    };
  }
});