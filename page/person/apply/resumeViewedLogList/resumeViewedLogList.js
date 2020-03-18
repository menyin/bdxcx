var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    viewList: [], //简历被看列表
    goTop: true,
    listShow: true
  },
  onLoad: function (options) {
    var page = options.page ? options.page : 1;
    // this.getPage(page);
    this.getList(page);
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    var count = this.data.viewList.count ? this.data.viewList.count : 0;
    console.log(count);
    // wx.setNavigationBarTitle({title:'简历被查看记录('+count+')'})
    swan.setNavigationBarTitle({ title: '简历被查看记录' });
    //浏览记录
    getApp().addLog("/page/person/apply/resumeViewedLogList/resumeViewedLogList");
  },
  //start  加载更多
  moreAndMore: function () {
    var page = this.data.viewList.page + 1;
    this.getList(page);
  },
  getList: function (page) {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getViewList',
      page: page
    };
    var func = function (res) {
      console.log(res);
      var data = res.data;
      // if(data.rows && data.rows.length<=0) return;
      var viewList = that.data.viewList;
      if (viewList.rows && viewList.rows.length > 0) {
        //获取更多
        for (var key in data.rows) {
          viewList.rows.push(data.rows[key]); //push加入新数据
        }
        viewList.page = data.page;
      } else {
        viewList = data;
      }
      var moreHide = false;
      if (data.rows && data.rows.length < 10) {
        moreHide = true;
      }
      var listShow = true;
      if (viewList.rows && viewList.rows.length <= 0) listShow = false;
      that.setData({ listShow: listShow, viewList: viewList, moreHide: moreHide });
    };
    util.isPost(data, url, func);
  },
  //end  加载更多
  //到底部自动加下一页的数据载数据
  lower: function (e) {
    if (this.data.viewList.pages > this.data.viewList.page) {
      var page = this.data.viewList.page + 1;
      this.getList(page);
    }
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