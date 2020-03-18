var areaData = require('./config/area.js');
var positionData = require('./config/position.js');
var industryData = require('./config/industry.js');
var util = require("./config/global.js");
App({
  //初始数据
  data: {
    // ROOT_DOMAIN: '597.cs',//域名
    // API_URL: 'http://api.597.cs',//api url
    // upImageUrl: 'http://pic.597.cs',//上传图片url
    ROOT_DOMAIN: '597.com',
    API_URL: 'https://api.597.com',
    upImageUrl: 'https://pic.597.com',
    AppName: '597人才网',
    Phone400: '400-810-8597',
    copyRight: '厦门才盛人才服务有限公司版权所有 ©2017',
    wxUserInfo: [], //微信用户信息
    wxuid: '', //微信unionId
    fromWx: '597597597',
    token: '',
    uid: '', //2380958,
    sysInfo: '', //系统信息
    isGreate: false, //标示第一次创建简历
    //0地区，1职位类别，2行业类别
    selectType: ['area', 'position', 'industry'],
    dataNames: [], //选择器的名称
    selectData: [], //选择的数据
    getType: 'storage', //'storage',//用什么方式获取选择框数据, storage把数据缓存本地,''空为从服务器上回去数据
    repeatCount: 3, //重复request次数
    isSearch: false, //是否搜索列表页面过来的。
    isHideLoc: true, //定位信息显示隐藏
    hotCity: [{ v: "1100", c: "北京" }, { v: "3502", c: "厦门" }, { v: "3505", c: "泉州" }, { v: "3507", c: "南平" }, { v: "3501", c: "福州" }, { v: "3506", c: "漳州" }, { v: "3503", c: "莆田" }, { v: "3508", c: "龙岩" }, { v: "3504", c: "三明" }, { v: "3509", c: "宁德" }, { v: "3307", c: "金华" }, { v: "330782", c: "义乌" }, { v: "4206", c: "襄阳" }] //开放城市
  },
  cache: { //缓存
    historyList: [], //搜索记录
    sureBack: false, //是否返回
    locUrlCount: 0, //返回次数
    nameIndex: '', //下标
    selectBase: [] //基础信息
  },
  onLaunch: function (tempBase) {
    var that = this;
    that.data.tempBase = tempBase;

    if (that.data.getType == "storage") {
      //把选择数据存入storage
      swan.getStorage({ //获取职位类型数据
        key: 'positionData',
        fail: function () {
          swan.setStorage({
            key: 'positionData',
            data: positionData.positionData,
            fail: function () {
              swan.showToast({ title: '获取职位类型数据失败', mask: true, icon: 'loading', duration: 1000 });
            }
          });
        }
      });
      swan.getStorage({ //获取行业类型数据
        key: 'industryData',
        fail: function () {
          swan.setStorage({
            key: 'industryData',
            data: industryData.industryData,
            fail: function () {
              swan.showToast({ title: '获取行业类型数据失败', mask: true, icon: 'loading', duration: 1000 });
            }
          });
        }
      });
      swan.getStorage({ //获取地区数据
        key: 'areaData',
        fail: function () {
          swan.setStorage({
            key: 'areaData',
            data: areaData.areaData,
            fail: function () {
              swan.showToast({ title: '获取地区数据失败', mask: true, icon: 'loading', duration: 1000 });
            }
          });
        }
      });
    }

    //获取浏览手机的系统信息
    // var getSystemInfoSync = wx.getSystemInfoSync();
    // console.log(getSystemInfoSync);
    // var systemInfo = getSystemInfoSync.system;
    // var mobileSys = '';//系统
    // if(systemInfo.search(/android/i)>=0){
    //   mobileSys = 'android';
    // }
    // if(systemInfo.search(/ios/i)>=0){
    //   mobileSys = 'ios';
    // }
    // var macStr =  '';

    that.getUserLogion();

    //获取当前时间
    var date = new Date();
    var yearNow = date.getFullYear(); //年
    var monthNow = date.getMonth() + 1; //月
    var dayNow = date.getDate(); //日日
    that.data.yearNow = yearNow;
    that.data.monthNow = monthNow;
    that.data.dayNow = dayNow;
    this.getSys();
  },
  onShow: function (tempBase) {},
  //用户登录
  getUserLogion: function () {
    var that = this;
    swan.getStorage({ //获取unionid
      key: 'unionId',
      success: function (res) {
        that.data.wxuid = res.data;
        swan.getStorage({
          key: 'openid',
          success: function (res1) {
            that.data.openid = res1.data;

            that.getUserInfo(); //获取wx用户信息信息
            that.get597User(res.data, res1.data); //获取597用户信息
          }
        });
      },
      fail: function () {
        that.getUnionID(); //获取用户UnionID
      }
    });
  },
  //获取用户UnionID
  getUnionID: function () {
    var that = this;
    //1、login获取code
    //2、用code获取session_key
    //3、wx.getUserInfo获取encryptedData 和 iv
    //4、用 session_key 、 encryptedData 和 iv 获取unionId
    //5、用 unionId 获取597用户信息
    swan.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          //2
          swan.request({
            url: getApp().data.API_URL + '/web/mi.api',
            data: {
              act: 'wxGetOpenid',
              code: code
            },
            method: 'GET',
            success: function (res) {
              if (res.data.status == 1) {
                var sessionKey = res.data.sessionKey;
                var openid = res.data.wxOpenid; //openid
                swan.setStorage({
                  key: 'openid',
                  data: openid
                });
                //3
                swan.getUserInfo({
                  success: function (res) {
                    that.data.wxUserInfo = res.userInfo;
                    //4
                    swan.request({
                      url: getApp().data.API_URL + '/wechat/xcx.api',
                      data: {
                        session_id: sessionKey,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                      },
                      method: 'GET',
                      success: function (res) {
                        if (res.data.status <= 0) return;
                        var unionId = res.data.unionId;
                        if (unionId) that.data.wxuid = unionId;
                        if (openid) that.data.openid = openid;
                        //获取597用户信息
                        that.get597User(unionId, openid);
                        //保存unionId在本地
                        // console.log(openid);
                        swan.setStorage({
                          key: 'unionId',
                          data: unionId
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  },
  onHide: function () {
    var tempBase = this.data.tempBase;
    //1035公众号自定义菜单(特别处理)
    if (tempBase && tempBase.scene == 1035) {
      swan.switchTab({
        url: '/' + tempBase.path
      });
    }
  },
  //获取简历
  getResumeRow: function (uid, SESSIONKEY) {
    var that = this;
    swan.getStorage({
      key: 'resumeUpTime' + uid,
      complete: function (res) {
        var resumeUpTime = ''; //简历的刷新时间
        if (res.data) resumeUpTime = res.data;

        var url = getApp().data.API_URL + '/web/mi.api?act=getResumeRow';
        var data = {
          fromWx: getApp().data.fromWx,
          SESSIONKEY: SESSIONKEY,
          resumeUpTime: resumeUpTime
        };
        var func = function (res, that) {
          var uid = getApp().data.uid;
          if (res.data.status == 1) {
            getApp().data.nickname = res.data.resumeRow.baseData.name;
            swan.setStorage({ key: 'resumeRow' + uid, data: res.data.resumeRow }); //缓存简历信息
            if (res.data.resumeRow) swan.setStorage({ key: 'resumeUpTime' + uid, data: res.data.resumeRow.updateTime }); //缓存简历的刷新时间
          }
          if (res.data.status == -8) {
            //简历不存在
            swan.setStorage({ key: 'resumeRow' + uid, data: '' });
            swan.removeStorage({ key: 'resumeUpTime' + uid });
          }
        };
        util.isPost(data, url, func);
      }
    });
  },
  //获取wx用户基本信息
  getUserInfo: function () {
    var that = this;
    swan.login({
      success: function (res) {
        if (res.code) {
          swan.getUserInfo({
            success: function (res) {
              that.data.wxUserInfo = res.userInfo;
            }
          });
        }
      }
    });
  },
  //通过openid来获取597用户，存在则登录
  get597User: function (wxuid, wxOpenid) {
    var that = this;
    if (!wxuid) return;
    var url = this.data.API_URL + '/web/mi.api';
    var data = {
      act: 'wxLogin',
      wxuid: wxuid,
      wxOpenid: wxOpenid
    };
    var func = function (res, that) {
      var uid = '';
      var token = '';
      var SESSIONKEY = '';
      if (res.data.status > 0) {
        uid = res.data.status;
        token = res.data.token;
        SESSIONKEY = res.data.SESSIONKEY;
        getApp().data.uid = uid;
        getApp().data.token = token;
        getApp().data.SESSIONKEY = SESSIONKEY;

        //把SESSIONKEY存入storage
        swan.setStorage({
          key: 'SESSIONKEY',
          data: SESSIONKEY
        });

        //获取简历
        getApp().getResumeRow(uid, SESSIONKEY);
      }
    };
    util.isGet(data, url, func);
  },
  //验证是否登录
  checkLogin: function () {
    var SESSIONKEY = getApp().data.SESSIONKEY;
    if (!getApp().data.SESSIONKEY) {
      setTimeout(function () {
        swan.switchTab({
          url: '/page/person/index/index'
        });
        return false;
      }, 400);
    }
    return true;
  },
  //记录用户浏览记录
  addLog: function (page = '') {
    // var openid = getApp().data.openid;
    // wx.request({
    //   url: 'https://api.597.com/web/mi/xcxVisitLog/',
    //   data: {openid:openid,page:page},
    //   method: 'GET',
    //   success: function(res){
    //   }
    // })
  },
  //获取城市下面的地区
  getSelectCity: function (localCity = { 'id': '3502', 'name': '厦门' }) {
    var that = this;
    var cityId = localCity.id;
    swan.request({
      url: getApp().data.API_URL + '/web/region.api?id=' + cityId,
      data: {},
      method: 'GET',
      success: function (res) {
        localCity.s = res.data;
        getApp().data.localCity = localCity;
        swan.setStorage({
          key: 'localCity',
          data: localCity
        });
      }
    });
  },
  //获取系统信息
  getSys: function () {
    var that = this;
    swan.getSystemInfo({
      success: function (res) {
        res._version = res.version.replace('.', '');
        res._version = res._version.replace('.', '');
        that.data.sysInfo = res;
      }
    });
  }
});