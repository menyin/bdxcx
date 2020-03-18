var util = require("../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    jobRow: [], //职位信息
    hideAll: true,
    isHidePhone: true, //显示隐藏电话号码
    _version: '' //微信版本号，6.5.8才能用页面按钮分享
  },
  onLoad: function (options) {
    var that = this;
    var _version = getApp().data.sysInfo._version;
    this.setData({ _version: _version });

    //获取职位信息
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'getJobInfo',
      jobId: options.jobId,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx
    };
    var func = function (res) {
      that.setData({ jobRow: res.data, hideAll: false });
    };
    util.isPost(data, url, func);
  },
  onShow: function () {
    //显示隐藏返回首页
    var showBackIndex = true;
    if (getCurrentPages().length == 1) showBackIndex = false;
    this.setData({ showBackIndex: showBackIndex });
  },
  onReady: function () {
    getApp().addLog("/page/position/jobInfo/jobInfo");
  },
  //改变高度
  changePHeight: function () {
    this.setData({ pHeight: 'auto', hide: ' hide' });
  },
  //查看地图
  showMap: function (e) {
    var lat = e.target.dataset.lat; //维度
    var long = e.target.dataset.lng; //经度
    var address = e.target.dataset.address; //地址
    if (!lat || !long) {
      swan.showToast({ title: '未设置地图坐标', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    this.changeZuoBiao(lat, long, address);
  },
  //收藏
  addFavorite: function (e) {
    var that = this;
    var _jid = e.target.dataset.id;

    swan.request({
      url: getApp().data.API_URL + '/web/mi.api',
      data: {
        act: 'getFavRow',
        jid: _jid,
        SESSIONKEY: getApp().data.SESSIONKEY,
        token: getApp().data.token,
        fromWx: getApp().data.fromWx
      },
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" }, //content-type 需小写
      success: function (res) {
        if (res.data.status == -1) {
          swan.showToast({ title: '请先登录再收藏', mask: true, icon: 'success', duration: 1000 });
          setTimeout(function () {
            swan.navigateTo({
              url: '/page/miLogin/miLogin?isUser=yes&isIndex=true'
            });
          }, 1500);
          return;
        }
        //添加
        if (res.data.status == -88) {
          swan.request({
            url: getApp().data.API_URL + '/web/person.api',
            data: {
              act: 'favourite_save',
              jid: _jid,
              SESSIONKEY: getApp().data.SESSIONKEY,
              token: getApp().data.token,
              fromWx: getApp().data.fromWx
            },
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" }, //content-type 需小写
            success: function (res) {
              if (res.data.status <= 0) {
                swan.showToast({ title: res.data.msg ? res.data.msg : '收藏失败', mask: true, icon: 'success', duration: 1000 });
                return;
              }
              var jobRow = that.data.jobRow;
              jobRow.collect = 1;
              that.setData({ jobRow: jobRow });
              swan.showToast({ title: '收藏成功', mask: true, icon: 'success', duration: 1000 });
            }
          });
          return;
        }
        //删除
        if (res.data.status > 0) {
          swan.request({
            url: getApp().data.API_URL + '/web/person.api',
            data: {
              act: 'favourite_del',
              jid: _jid,
              SESSIONKEY: getApp().data.SESSIONKEY,
              token: getApp().data.token,
              fromWx: getApp().data.fromWx
            },
            method: 'POST',
            header: { "content-type": "application/x-www-form-urlencoded" }, //content-type 需小写
            success: function (res) {
              if (res.data.status <= 0) {
                swan.showToast({ title: res.data.msg ? res.data.msg : '取消收藏失败', mask: true, icon: 'success', duration: 1000 });
                return;
              }
              var jobRow = that.data.jobRow;
              jobRow.collect = 0;
              that.setData({ jobRow: jobRow });
              swan.showToast({ title: '取消收藏成功', mask: true, icon: 'success', duration: 1000 });
            }
          });
          return;
        }

        swan.showToast({ title: res.data.msg ? res.data.msg : '收藏失败', mask: true, icon: 'success', duration: 1000 });
      },
      fail: function () {
        swan.showToast({ title: '收藏失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  //投递
  addApplyPost: function (e) {
    var that = this;
    var _jid = e.target.dataset.id;
    var url = getApp().data.API_URL + '/web/job.api';
    var data = {
      act: 'join',
      jid: _jid,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx
    };
    var func = function (res) {
      if (res.data.status == -1) {
        swan.showToast({ title: '请先登录再投递', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          swan.navigateTo({
            url: '/page/miLogin/miLogin?isUser=yes&isIndex=true'
          });
        }, 1500);
        return;
      }
      if (res.data.status == -100) {
        swan.showToast({ title: '请完善求职意向', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          swan.switchTab({
            url: '/page/person/resume/index/index'
          });
        }, 1500);
        return;
      }
      swan.showToast({ title: res.data.msg, mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //百度地图坐标 转换为 腾讯地图坐标
  changeZuoBiao: function (lat, long, address) {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'getZuoBiao',
      fromWx: getApp().data.fromWx,
      lat: Number(lat),
      long: Number(long)
    };
    var func = function (res) {
      if (!res.data.locations) return;
      var a = res.data.locations;
      var lng = a[0].lng;
      var lat = a[0].lat;

      swan.openLocation({
        longitude: Number(lng),
        latitude: Number(lat),
        name: that.data.jobRow.companyRow.cname,
        address: address
      });
    };
    util.isGet(data, url, func);
  },
  //分享
  onShareAppMessage: function () {
    var jobContent = '';
    if (this.data.jobRow.jobContent.length > 0) jobContent = this.data.jobRow.jobContent;
    return {
      title: this.data.jobRow.jname,
      desc: jobContent.substr(0, 100),
      path: '/page/position/jobInfo/jobInfo?jobId=' + this.data.jobRow._jid
    };
  },
  //拨打电话
  callPhone: function (e) {
    var that = this;
    var phone = e.target.dataset.phone;
    swan.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        that.hidePhone();
      }
    });
  },
  //显示电话列表
  showPhone: function () {
    this.setData({ isHidePhone: false });
  },
  //隐藏电话列表
  hidePhone: function () {
    this.setData({ isHidePhone: true });
  }
});