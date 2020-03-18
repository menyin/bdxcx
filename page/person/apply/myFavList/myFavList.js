var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    favList: [], //职位收藏列表
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
    var count = this.data.favList.count ? this.data.favList.count : 0;
    // wx.setNavigationBarTitle({title:"职位收藏夹("+count+")"})
    swan.setNavigationBarTitle({ title: "职位收藏夹" });

    //浏览记录
    getApp().addLog("/page/person/apply/myFavList/myFavList");
  },
  //start  加载更多
  moreAndMore: function () {
    var page = this.data.favList.page + 1;
    this.getList(page);
  },
  getList: function (page) {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getFavList',
      page: page
    };
    var func = function (res) {
      var data = res.data;
      // if(!data.rows || data.rows.length<=0) return;
      var favList = that.data.favList;
      if (favList.rows && favList.rows.length > 0) {
        //获取更多
        for (var key in data.rows) {
          favList.rows.push(data.rows[key]); //push加入新数据
        }
        favList.page = data.page;
      } else {
        favList = data;
      }
      var moreHide = false;
      if (data.rows && data.rows.length < 10) {
        moreHide = true;
      }
      var listShow = true;
      if (favList.rows && favList.rows.length <= 0) listShow = false;
      that.setData({ listShow: listShow, favList: favList, moreHide: moreHide });
    };
    util.isPost(data, url, func);
  },
  //end  加载更多
  //到底部自动加下一页的数据载数据
  lower: function (e) {
    if (this.data.favList.pages > this.data.favList.page) {
      var page = this.data.favList.page + 1;
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
  },
  //触摸开始
  touchStart: function (e) {
    this.setData({ 'startTime': e.timeStamp });
  },
  //触摸结束
  touchEnd: function (e) {
    this.setData({ 'endTime': e.timeStamp });
  },
  //删除
  del: function (e) {
    var that = this;
    var _jid = e.currentTarget.dataset.jid; //加密的职位id
    var startTime = this.data.startTime;
    var endTime = this.data.endTime;
    if (endTime - startTime < 350) {
      //跳转
      swan.navigateTo({
        url: '/page/position/jobInfo/jobInfo?jobId=' + _jid
      });
    } else {
      //是否删除
      swan.showModal({
        title: '删除收藏的职位',
        content: '您确定要删除该条收藏的职位吗？',
        success: function (res) {
          if (res.confirm) {
            var url = getApp().data.API_URL + '/web/person.api';
            var data = {
              SESSIONKEY: getApp().data.SESSIONKEY,
              token: getApp().data.token,
              fromWx: getApp().data.fromWx,
              act: 'favourite_del',
              jid: _jid
            };
            var func = function (res) {
              swan.redirectTo({
                url: '../myFavList/myFavList'
              });
            };
            util.isPost(data, url, func);
          }
        }
      });
    };
  }
});