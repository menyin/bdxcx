// page/search/search.js
var configData = require("../../config/data.js");
var talkFunction = require('../talkTemplate/talkTemplate.js');
Page({
  data: {
    talkHide: true,
    talkClass: 'talk',
    yuyinImg: '../../images/yuyin.png',
    yuyinImg1: '../../images/yuyin.png',
    yuyinImg2: '../../images/yuyin1.gif',
    hotList: [],
    autoWordList: [],
    isHideLoc: true,
    autoHide: true,
    types: ['搜索类型', '职位', '企业', '全文'], //搜索类型
    nearbyList: [{ id: 0, name: '不限' }, { id: 500, name: '500米内' }, { id: 1000, name: '1000米内' }, { id: 2000, name: '2000米内' }, { id: 3000, name: '3000米内' }, { id: 4000, name: '4000米内' }, { id: 5000, name: '5000米内' }], //附近职位距离
    nearbyVal: 0, //附近职位距离下标
    sortList: [{ id: 11, name: '活跃度↑' }, { id: 10, name: '活跃度↓' }, { id: 9, name: '相关度↑' }, { id: 8, name: '相关度↓' }, { id: 7, name: '创建时间↑' }, { id: 6, name: '创建时间↓' }, { id: 5, name: '工龄↑' }, { id: 4, name: '工龄↓' }, { id: 3, name: '薪资↑' }, { id: 2, name: '薪资↓' }, { id: 0, name: '更新时间' }], //排序
    joinTypeList: [{ id: 0, name: '不限' }, { id: 1, name: '全职' }, { id: 2, name: '兼职' }, { id: 5, name: '实习' }], //职位类型
    workYearList: [{ id: 0, name: '不限' }, { id: 99, name: '应届毕业生' }, { id: 1, name: '1年以上' }, { id: 2, name: '2年以上' }, { id: 3, name: '3年以上' }, { id: 4, name: '4年以上' }, { id: 5, name: '5年以上' }, { id: 6, name: '6年以上' }, { id: 7, name: '7年以上' }, { id: 8, name: '8年以上' }, { id: 9, name: '9年以上' }, { id: 10, name: '10年以上' }], //工作年限
    comPropertyList: [{ id: 0, name: '不限' }, { id: 1, name: '国有企业' }, { id: 2, name: '外商独资、外企办事处' }, { id: 3, name: '中外合资(合营、合作)' }, { id: 4, name: '民营、私营公司' }, { id: 5, name: '上市公司' }, { id: 6, name: '股份制企业' }, { id: 7, name: '集体企业' }, { id: 8, name: '乡镇企业' }, { id: 9, name: '行政机关' }, { id: 10, name: '社会团体、非盈利机构' }, { id: 11, name: '事业单位' }, { id: 12, name: '跨国企业(集团)' }, { id: 13, name: '其他' }],
    comSizeList: [{ id: 0, name: '不限' }, { id: 9, name: '10人以下' }, { id: 49, name: '10～50人' }, { id: 199, name: '50～200人' }, { id: 499, name: '200～500人' }, { id: 999, name: '500～1000人' }, { id: 1000, name: '1000人以上' }, { id: 10000, name: '10000人以上' }],
    salarys: ['不限', '1k及以上', '2k及以上', '3k及以上', '4k及以上', '5k及以上', '6k及以上', '7k及以上', '8k及以上', '9k及以上', '10k及以上', '12k及以上', '15k及以上', '20k及以上', '30k及以上'], //期望薪资
    fuli: [{ id: '1', name: '五险' }, { id: '2', name: '住房公积金' }, { id: '3', name: '包吃' }, { id: '4', name: '包住' }, { id: '5', name: '周末双休' }, { id: '6', name: '单休' }, { id: '7', name: '大小周' }, { id: '8', name: '加班补助' }, { id: '9', name: '班车接送' }],
    degree: [{ id: '10', name: '小学' }, { id: '20', name: '初中' }, { id: '30', name: '高中' }, { id: '40', name: '中技/中专' }, { id: '50', name: '专科' }, { id: '60', name: '本科' }, { id: '70', name: '硕士' }, { id: '80', name: '博士' }, { id: '90', name: '博士后' }] //学历
  },
  onLoad: function (options) {
    console.log(options);
    //配置文件数据
    var gender = configData.gender; //性别
    gender[0] = '不限';
    this.setData({ gender: gender });

    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    swan.getStorage({ //缓存上获取
      key: 'autoWord',
      success: function (res) {
        that.setData({ autoWordList: res.data });
      },
      fail: function () {
        swan.request({ //服务器上获取
          url: 'https://cdn.597.com/data/auto.min.json',
          method: 'GET',
          success: function (res) {
            if (res.data) {
              swan.setStorage({ //把数据存在本地
                key: 'autoWord',
                data: res.data
              });
              that.setData({ autoWordList: res.data });
            }
          }
        });
      }
    });

    //获取热门职位
    swan.request({
      url: 'https://api.597.com/web/job/hotJobClass/',
      method: 'GET',
      success: function (res) {
        that.setData({ hotList: res.data.hotNames });
      }
    });

    //获取城市信息
    swan.getStorage({
      key: 'localCity',
      success: function (res) {
        that.setData({ localCity: res.data });
      },
      fail: function (res) {
        // getApp().getSelectCity();
        var localCity = { 'id': '3502', 'name': '厦门' };
        var cityId = localCity.id;
        swan.request({
          url: getApp().data.API_URL + '/web/region.api?id=' + cityId,
          data: {},
          method: 'GET',
          success: function (res) {
            localCity.s = res.data;
            getApp().data.localCity = localCity;
            that.setData({ localCity: localCity });
            swan.setStorage({
              key: 'localCity',
              data: localCity
            });
          }
        });
      }
    });

    var that = this;
    //历史关键词搜索数据
    swan.getStorage({
      key: "searchHistory2",
      success: function (res) {
        if (res.data) {
          var historyList = res.data;
          that.setData({ historyList: historyList });
        }
      }
    });
    var searchVal = options.searchVal;
    var isFocus = true;
    if (searchVal == undefined || searchVal == 'undefined') searchVal = '';
    this.setData({ searchVal: searchVal, isFocus: isFocus });
  },
  onReady: function () {
    //设置标题
    swan.setNavigationBarTitle({
      title: '高级搜索'
    });
    //浏览记录
    getApp().addLog("/page/search/search");
  },
  onShow: function () {
    var searchData = {
      page: 1,
      moreSearch: false,
      kwType: 3,
      keyword: '',
      jobLocIds: '',
      jobLocNames: '',
      jobFun: '',
      jobFunNames: '',
      calling: '',
      callingNames: '',
      distance: '', //距离
      distanceName: '',
      comLatitude: '', //维度
      comLongitude: '', //经度
      order: 10, //排序
      orderName: '',
      minSalary: '', //薪资
      minSalaryName: '',
      Reward: '', //福利
      Degree: '', //学历
      selGender: '', //性别
      joinType: '', //工作类型
      workYear: '', //工作年限
      comProperty: '', //公司类型
      comSize: '' //工作规模
    };
    this.setData({ searchData: searchData });
  },
  //清除历史搜索
  clearHistory: function () {
    var that = this;
    swan.showModal({
      title: '',
      content: '确定删除全部历史记录？',
      confirmText: '全部删除',
      confirmColor: '#38f',
      success: function (res) {
        if (res.confirm) {
          swan.setStorage({
            key: 'searchHistory2',
            data: ''
          });
          that.setData({ historyList: '' });
        }
      }
    });
  },
  //获取搜索值
  searchVal: function (e) {
    var val = e.detail.value;
    var autoWordList = this.data.autoWordList;
    var rows = [];
    var i = 10; //只显示10个
    for (var key in autoWordList) {
      if (val.length <= 0) break;
      if (i <= 0) break;
      var c = autoWordList[key].c;
      var p = autoWordList[key].p;
      var s = autoWordList[key].s;
      if (c.indexOf(val) >= 0 || p.indexOf(val) >= 0 || s.indexOf(val) >= 0) {
        rows.push(autoWordList[key].c);
        i--;
        continue;
      }
    }
    var autoHide = true;
    if (rows.length > 0) {
      autoHide = false;
    }

    this.setData({ searchVal: val, rows: rows, autoHide: autoHide });
  },
  hideAll: function () {
    this.setData({ autoHide: true });
  },
  //触摸开始
  touchStart: function (e) {
    this.setData({ 'startTime': e.timeStamp });
  },
  //触摸结束
  touchEnd: function (e) {
    this.setData({ 'endTime': e.timeStamp });
  },
  toSearch: function (e) {
    var key = e.currentTarget.dataset.key;
    this.search(key);
  },
  //删除
  del: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.key;
    var startTime = this.data.startTime;
    var endTime = this.data.endTime;
    if (endTime - startTime < 350) {
      //跳转
      this.search(key);
    } else {
      //是否删除
      swan.showModal({
        title: '',
        content: '您确定要删除该条搜索记录吗？',
        success: function (res) {
          if (res.confirm) {
            swan.getStorage({
              key: 'searchHistory2',
              success: function (res) {
                if (!res.data) res.data = [];
                res.data.forEach(function (val, index, array) {
                  if (val.name == key.toLowerCase()) {
                    res.data.splice(index, 1);
                  }
                });
                console.log(res.data);
                swan.setStorage({
                  key: "searchHistory2",
                  data: res.data
                });
                that.setData({ historyList: res.data });
              }
            });
          }
        }
      });
    }
  },
  //跳转到搜索列表页
  search: function (key) {
    if (!key || key.length <= 0) key = '';

    var searchData = this.data.searchData; //筛选数据
    var url = "/page/search/result/result?kwType=" + searchData.kwType + "&keyword=" + key + "&jobLocIds=" + searchData.jobLocIds + "&jobLocNames=" + searchData.jobLocNames + "&jobFun=" + searchData.jobFun + "&jobFunNames=" + searchData.jobFunNames + "&calling=" + searchData.calling + "&callingNames=" + searchData.callingNames + "&distance=" + searchData.distance + "&distanceName=" + searchData.distanceName + "&comLatitude=" + searchData.comLatitude + "&comLongitude=" + searchData.comLongitude + "&order=" + searchData.order + "&orderName=" + searchData.orderName + "&minSalary=" + searchData.minSalary + "&minSalaryName=" + searchData.minSalaryName + "&Reward=" + searchData.Reward + "&Degree=" + searchData.Degree + "&selGender=" + searchData.selGender + "&joinType=" + searchData.joinType + "&workYear=" + searchData.workYear + "&comProperty=" + searchData.comProperty + "&comSize=" + searchData.comSize;

    this.setData({ autoHide: true });
    // wx.navigateTo({url:url})
    swan.redirectTo({
      url: url
    });
  },
  //返回
  toBack: function () {
    swan.navigateBack();
  },
  //清楚数据
  clearVal: function () {
    this.setData({ searchVal: '', rows: [], isFocus: true, autoHide: true });
  },
  //回车触发
  huichechufa: function (e) {
    var val = e.detail.value;
    this.search(val);
  },
  // //附近职位
  // jumpToSearch:function(){
  //   var distance = 2000;
  //   var comLatitude = getApp().data.lat;
  //   var comLongitude = getApp().data.long;
  //   var url = '/page/search/result/result?kwType=3&distance='+distance+'&comLatitude='+comLatitude+'&comLongitude='+comLongitude+'&fromXCX=1';
  //   console.log(url);
  //   wx.redirectTo({
  //     url: url
  //   })
  // }
  //改变城市
  bindCitysChange: function (e) {
    var cityId = e.currentTarget.dataset.id;
    var cityName = e.currentTarget.dataset.name;

    var searchData = this.data.searchData;
    //不限
    if (!cityId || !cityName) {
      searchData.jobLocIds = '';
      searchData.jobLocNames = '';
      // this.setData({ searchData: searchData });
      // return;
    }

    //多选处理
    //id处理
    var cityStr = "";
    if (searchData.jobLocIds) {
      var cityIds = searchData.jobLocIds.split(",");
      var idIndex = cityIds.indexOf(cityId);
      if (idIndex != '-1') {
        //已经存在的删除
        cityIds.splice(idIndex, 1);
      } else {
        //不存在的添加
        if (cityIds.length >= 5) {
          swan.showToast({ title: '最多只能选择5个', icon: 'success', duration: 1000 });
          return;
        }
        cityIds.push(cityId);
      }
      var cityStr = cityIds.join(",");
    } else {
      cityStr = cityId;
      cityIds = [cityId];
    }
    //name处理
    var cityNameStr = "";
    if (searchData.jobLocNames) {
      var cityNames = searchData.jobLocNames.split(",");
      var nameIndex = cityNames.indexOf(cityName);
      if (nameIndex != '-1') {
        //已经存在的删除
        cityNames.splice(nameIndex, 1);
      } else {
        //不存在的添加
        if (cityNames.length >= 5) {
          swan.showToast({ title: '最多只能选择5个', icon: 'success', duration: 1000 });
          return;
        }
        cityNames.push(cityName);
      }
      var cityNameStr = cityNames.join(",");
    } else {
      cityNameStr = cityName;
    }

    //多选显示
    var localCity = this.data.localCity;
    var myCitys = localCity.s;
    for (var key in myCitys) {
      myCitys[key].selected = '';
      if (cityIds && cityIds.length > 0) {
        for (var k in cityIds) {
          if (myCitys[key].area_id == cityIds[k]) {
            myCitys[key].selected = 1;
          }
        }
      }
    }

    localCity.s = myCitys;

    //重新获取数据
    searchData.jobLocIds = cityStr;
    searchData.jobLocNames = cityNameStr;
    this.setData({ searchData: searchData, localCity: localCity });
  },
  //附近职位
  bindNearbyChange: function (e) {
    var nearbyVal = e.currentTarget.dataset.id;
    var nearbyName = e.currentTarget.dataset.name;

    //重新获取数据
    var searchData = this.data.searchData;
    searchData.comLatitude = getApp().data.lat;
    searchData.comLongitude = getApp().data.long;
    searchData.distance = nearbyVal;
    searchData.distanceName = nearbyName;
    this.setData({ nearbyVal: nearbyVal, searchData: searchData });
  },
  //改变排序
  bindSortChange: function (e) {
    var sortId = e.currentTarget.dataset.id;
    var sortName = e.currentTarget.dataset.name;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.order = sortId;
    searchData.orderName = sortName;
    this.setData({ searchData: searchData });
  },
  //改变性别
  bindGenderChange: function (e) {
    var sexId = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.selGender = sexId;
    this.setData({ searchData: searchData });
  },
  //改变薪资
  bindSalaryChange: function (e) {
    var minSalary = e.currentTarget.dataset.id;
    var minSalaryName = e.currentTarget.dataset.name;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.minSalary = minSalary;
    searchData.minSalaryName = minSalaryName;
    this.setData({ searchData: searchData });
  },
  //改变学历
  bindDegreeChange: function (e) {
    var Degree = e.currentTarget.dataset.id;

    //不限
    var searchData = this.data.searchData;
    if (!Degree) {
      searchData.Degree = '';
      // this.setData({ searchData: searchData});
      // return;
    }

    //重新获取数据
    var idStr = "";
    if (searchData.Degree) {
      var ids = searchData.Degree.split(",");
      var idIndex = ids.indexOf(Degree);
      if (idIndex != '-1') {
        //已经存在的删除
        ids.splice(idIndex, 1);
      } else {
        ids.push(Degree);
      }
      idStr = ids.join(",");
    } else {
      idStr = Degree;
      ids = [Degree];
    }
    console.log(ids);

    var myData = this.data.degree;
    for (var key in myData) {
      myData[key].selected = '';
      if (ids && ids.length > 0) {
        for (var k in ids) {
          if (myData[key].id == ids[k]) {
            myData[key].selected = 1;
          }
        }
      }
    }

    searchData.Degree = idStr;
    this.setData({ searchData: searchData, degree: myData });
  },
  //改变福利
  bindRewardChange: function (e) {
    var Reward = e.currentTarget.dataset.id;
    //不限
    var searchData = this.data.searchData;
    if (!Reward) {
      searchData.Reward = '';
      // this.setData({ searchData: searchData });
      // return;
    }

    //重新获取数据
    var idStr = "";
    if (searchData.Reward) {
      var ids = searchData.Reward.split(",");
      var idIndex = ids.indexOf(Reward);
      if (idIndex != '-1') {
        //已经存在的删除
        ids.splice(idIndex, 1);
      } else {
        ids.push(Reward);
      }
      idStr = ids.join(",");
    } else {
      idStr = Reward;
      ids = [Reward];
    }
    console.log(ids);

    var myData = this.data.fuli;
    for (var key in myData) {
      myData[key].selected = '';
      if (ids && ids.length > 0) {
        for (var k in ids) {
          if (myData[key].id == ids[k]) {
            myData[key].selected = 1;
          }
        }
      }
    }

    searchData.Reward = idStr;
    this.setData({ searchData: searchData, fuli: myData });
  },
  //改变工作类型
  bindJoinTypeChange: function (e) {
    var joinType = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.joinType = joinType;
    this.setData({ searchData: searchData });
  },
  //改变工作经验
  bindWorkYearChange: function (e) {
    var workYear = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.workYear = workYear;
    this.setData({ searchData: searchData });
  },
  //改变公司性质
  bindComPropertyChange: function (e) {
    var comProperty = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.comProperty = comProperty;
    this.setData({ searchData: searchData });
  },
  //改变公司规模
  bindComSizeChange: function (e) {
    var comSize = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.comSize = comSize;
    this.setData({ searchData: searchData });
  },
  //隐藏智能语音
  talkhide: function () {
    talkFunction.talkhide(this);
  },
  //自能智能搜索
  talkSearch: function () {
    talkFunction.talkSearch(this);
  },
  //开始录音
  startRecord: function () {
    talkFunction.startRecord(this);
  },
  //结束录音
  endRecord: function () {
    talkFunction.endRecord(this);
  }
});