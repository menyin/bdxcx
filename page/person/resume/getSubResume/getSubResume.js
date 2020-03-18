var loginFunction = require('../../../loginTemplate/loginTemplate.js');
var util = require("../../../../config/global.js");
Page({
  data: {
    finishCount: 0, //完成度
    loginData: loginFunction.loginData,
    goTop: true,
    resumeRow: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;

    var that = this;
    //获取简历数据
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        console.log(resumeRow);
        var finishCount = that.getFinished(resumeRow); //完成度
        that.setData({ resumeRow: resumeRow, finishCount: finishCount, uid: getApp().data.uid, wxUserInfo: getApp().data.wxUserInfo });
      },
      fail: function () {
        that.setData({ uid: getApp().data.uid, wxUserInfo: getApp().data.wxUserInfo });
      }
    });
  },
  onReady: function () {
    //设置标题
    swan.setNavigationBarTitle({ title: this.data.resumeRow.rTitle ? this.data.resumeRow.rTitle : '默认简历' });
    //浏览记录
    getApp().addLog("/page/person/resume/getSubResume/getSubResume");
  },
  //完成度检验
  getFinished: function (resumeRow) {
    var finishCount = 0;
    if (!resumeRow) return;
    if (resumeRow.baseData.name) finishCount += 25; //真实姓名
    if (resumeRow.applyData.applyAreaIds) finishCount += 5; //意向城市
    if (resumeRow.joinEvaluate) finishCount += 15; //评价
    if (resumeRow.workListInfo.length > 0) finishCount += 15; //工作经历
    if (resumeRow.eduListInfo.length > 0) finishCount += 5; //教育经历
    if (resumeRow.projectListInfo.length > 0) finishCount += 5; //项目
    if (resumeRow.languageListInfo.length > 0) finishCount += 5; //语言
    if (resumeRow.skillListInfo.length > 0) finishCount += 5; //能力
    if (resumeRow.certificateListInfo.length > 0) finishCount += 10; //证书
    if (resumeRow.otherinfoListInfo.length > 0) finishCount += 5; //其他信息
    if (resumeRow.practiceListInfo.length > 0) finishCount += 5; //实践
    return finishCount;
  },
  //滚动触发返回顶部的显示隐藏
  scroll: function (e) {
    if (e.detail.scrollTop > 300) {
      //触发gotop的显示条件  
      this.setData({ goTop: false });
    } else {
      this.setData({ goTop: true });
    }
  },
  //返回顶部
  goToTop: function () {
    if (this.data.topNums == 1) {
      this.setData({ topNums: 0 });
    } else {
      this.setData({ topNums: 1 });
    }
  }
});