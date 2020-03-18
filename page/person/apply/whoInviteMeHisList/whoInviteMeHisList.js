var util = require("../../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    inviteList: [], //面试邀请列表
    goTop: true,
    listShow: true,
    isHideSan: true, //显示隐藏伞图标
    isHideWeather: false //显示隐藏天气
  },
  onLoad: function (options) {
    var that = this;

    var localCity = getApp().data.localCity;
    if (localCity && localCity.name) {
      //获取天气信息
      swan.request({
        url: 'https://api.map.baidu.com/telematics/v3/weather?location=' + localCity.name + '&output=json&ak=MRDBt1iGgVRgQz1Btlve3zFYkbeS3jID',
        data: {},
        method: 'GET',
        success: function (res) {
          // console.log(res);
          if (res.data && res.data.results && res.data.results[0]) {
            var cityName = res.data.results[0].currentCity;
            var today = res.data.results[0].weather_data[0].date;
            var weather = res.data.results[0].weather_data[0].weather;
            var temperature = res.data.results[0].weather_data[0].temperature;
            var weatherInfo = { cityName: cityName, today: today, weather: weather, temperature: temperature };
            var isHideSan = true;
            if (weather.indexOf('雨') >= 0) {
              isHideSan = false;
            }
            that.setData({ weatherInfo: weatherInfo, isHideSan: isHideSan });

            //雨伞动画
            var yusanChange = swan.createAnimation({
              duration: 2000,
              timingFunction: 'ease'
            });
            that.yusanChange = yusanChange;
            yusanChange.translateX(350).step();
            that.setData({
              yusanChange: yusanChange.export()
            });
            setTimeout(function () {
              yusanChange.translate3d(-20, -160, -30).step();
              // yusanChange.translateZ(20).step()
              yusanChange.scale(0.1).step();
              yusanChange.translateX(245).step();
              that.setData({
                yusanChange: yusanChange.export()
              });
            }.bind(that), 1000);
          }
        },
        fail: function (res) {
          that.setData({ isHideWeather: true });
        }
      });
    }

    this.getList(1);
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    var count = this.data.inviteList.count ? this.data.inviteList.count : 0;
    // wx.setNavigationBarTitle({title:'邀请面试记录('+count+')'})
    swan.setNavigationBarTitle({ title: '邀请面试记录' });
    //浏览记录
    getApp().addLog("/page/person/apply/whoInviteMeHisList/whoInviteMeHisList");
  },
  //start  加载更多
  moreAndMore: function () {
    var page = this.data.inviteList.page + 1;
    this.getList(page);
  },
  getList: function (page) {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getInviteList',
      page: page
    };
    var func = function (res) {
      var data = res.data;
      // if(data.rows && data.rows.length<=0) return;
      var inviteList = that.data.inviteList;
      if (inviteList.rows && inviteList.rows.length > 0) {
        //获取更多
        for (var key in data.rows) {
          inviteList.rows.push(data.rows[key]); //push加入新数据
        }
        inviteList.page = data.page;
      } else {
        inviteList = data;
      }
      var moreHide = false;
      if (res.data.rows && res.data.rows.length < 10) {
        moreHide = true;
      }
      var listShow = true;
      if (inviteList.rows && inviteList.rows.length <= 0) listShow = false;
      that.setData({ listShow: listShow, inviteList: inviteList, moreHide: moreHide });
    };
    util.isPost(data, url, func);
  },
  //end  加载更多
  //到底部自动加下一页的数据载数据
  lower: function (e) {
    if (this.data.inviteList.pages > this.data.inviteList.page) {
      var page = this.data.inviteList.page + 1;
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
  //隐藏天气
  hideWeather: function () {
    this.setData({ isHideWeather: true });
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
    var _inviteid = e.currentTarget.dataset.id; //加密的面试邀请id
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
        title: '删除面试邀请',
        content: '您确定要删除该条面试邀请吗？',
        success: function (res) {
          if (res.confirm) {
            var url = getApp().data.API_URL + '/web/person.api';
            var data = {
              SESSIONKEY: getApp().data.SESSIONKEY,
              token: getApp().data.token,
              fromWx: getApp().data.fromWx,
              act: 'invite_del',
              inviteid: _inviteid
            };
            var func = function (res) {
              swan.redirectTo({
                url: '../whoInviteMeHisList/whoInviteMeHisList'
              });
            };
            util.isPost(data, url, func);
          }
        }
      });
    };
  }
});