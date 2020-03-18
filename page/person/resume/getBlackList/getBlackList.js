var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    blackList: [], //拉黑企业
    companyList: []
  },
  onLoad: function (options) {
    var that = this;
    //获取拉黑的企业列表
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'banComList',
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx
    };
    var func = function (res) {
      that.setData({ blackList: res.data.rows });
    };
    util.isPost(data, url, func);
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    // 页面渲染完成
    swan.setNavigationBarTitle({ title: '黑名单（编辑）' });
    //浏览记录
    getApp().addLog("/page/person/resume/getBlackList/getBlackList");
  },
  //搜索企业
  formSubmit: function (res) {
    var that = this;
    var data = res.detail.value.addBlackListText;
    if (!data) {
      swan.showToast({ title: '请输入关键字', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      act: 'search_company',
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      val: data
    };
    var func = function (res) {
      var companyList = [];
      if (res.data.status == 1) {
        var companyList = res.data.company;
      }
      that.setData({ companyList: companyList });
    };
    util.isPost(data, url, func);
  },
  //删除拉黑企业
  delChange: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'banComDel',
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      cid: id
    };
    var func = function (res) {
      var blackList = that.data.blackList;
      blackList.splice(index, 1); //移除删掉的数据
      that.setData({ blackList: blackList });
      swan.showToast({ title: res.data.msg ? res.data.msg : '删除失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //添加拉黑企业
  addChange: function (e) {
    var that = this;
    var id = e.target.dataset.id; //数据id
    var index = e.target.dataset.index; //数据下标
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      act: 'banComAdd',
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      cid: id
    };
    var func = function (res) {
      if (res.data.status == 1) {
        //搜索列表移除该数据
        var companyList = that.data.companyList;
        companyList.splice(index, 1);

        //拉黑列表添加该数据
        var blackList = that.data.blackList;
        if (blackList.length <= 0) blackList = [];
        blackList.push(res.data.row);
        that.setData({ companyList: companyList, blackList: blackList });
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '添加失败', mask: true, icon: 'success', dutation: 1000 });
    };
    util.isPost(data, url, func);
  }
});