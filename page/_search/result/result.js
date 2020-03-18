var util = require("../../../config/global.js");
var configData = require("../../../config/data.js");
var talkFunction = require('../../talkTemplate/talkTemplate.js');
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    kwType: 1, //搜索类型
    searchData: [], //搜索参数
    jobList: [], //职位列表
    moreSearchHide: true,
    title: '',
    goTop: true,
    types: ['搜索类型', '职位', '企业', '全文'], //搜索类型
    nearbyList: [{ id: 0, name: '不限' }, { id: 500, name: '500米内' }, { id: 1000, name: '1000米内' }, { id: 2000, name: '2000米内' }, { id: 3000, name: '3000米内' }, { id: 4000, name: '4000米内' }, { id: 5000, name: '5000米内' }], //附近职位距离
    nearbyVal: 0, //附近职位距离下标
    sortList: [{ id: 11, name: '活跃度↑' }, { id: 10, name: '活跃度↓' }, { id: 9, name: '相关度↑' }, { id: 8, name: '相关度↓' }, { id: 7, name: '创建时间↑' }, { id: 6, name: '创建时间↓' }, { id: 5, name: '工龄↑' }, { id: 4, name: '工龄↓' }, { id: 3, name: '薪资↑' }, { id: 2, name: '薪资↓' }, { id: 0, name: '更新时间' }], //排序
    joinTypeList: [{ id: 0, name: '不限' }, { id: 1, name: '全职' }, { id: 2, name: '兼职' }, { id: 5, name: '实习' }], //职位类型
    workYearList: [{ id: 0, name: '不限' }, { id: 99, name: '应届毕业生' }, { id: 1, name: '1年以上' }, { id: 2, name: '2年以上' }, { id: 3, name: '3年以上' }, { id: 4, name: '4年以上' }, { id: 5, name: '5年以上' }, { id: 6, name: '6年以上' }, { id: 7, name: '7年以上' }, { id: 8, name: '8年以上' }, { id: 9, name: '9年以上' }, { id: 10, name: '10年以上' }], //工作年限
    comPropertyList: [{ id: 0, name: '不限' }, { id: 1, name: '国有企业' }, { id: 2, name: '外商独资、外企办事处' }, { id: 3, name: '中外合资(合营、合作)' }, { id: 4, name: '民营、私营公司' }, { id: 5, name: '上市公司' }, { id: 6, name: '股份制企业' }, { id: 7, name: '集体企业' }, { id: 8, name: '乡镇企业' }, { id: 9, name: '行政机关' }, { id: 10, name: '社会团体、非盈利机构' }, { id: 11, name: '事业单位' }, { id: 12, name: '跨国企业(集团)' }, { id: 13, name: '其他' }],
    comSizeList: [{ id: 0, name: '不限' }, { id: 9, name: '10人以下' }, { id: 49, name: '10～50人' }, { id: 199, name: '50～200人' }, { id: 499, name: '200～500人' }, { id: 999, name: '500～1000人' }, { id: 1000, name: '1000人以上' }, { id: 10000, name: '10000人以上' }],
    isHideLoc: true, //显示隐藏附近职位
    listShow: true,
    areaHide: true, //隐藏城市下级
    xinziHide: true, //薪资显示隐藏
    fujinHide: true, //附近显示隐藏
    paixuHide: true, //排序显示隐藏
    backHide: true,
    autoWordList: [], //关联词语
    autoHide: true, //隐藏关联词语
    shaixuanHide: true, //隐藏筛选层
    talkHide: true,
    talkClass: 'talk',
    yuyinImg: '../../../images/yuyin.png',
    yuyinImg1: '../../../images/yuyin.png',
    yuyinImg2: '../../../images/yuyin1.gif'
  },
  onLoad: function (options) {
    //配置文件数据
    var gender = configData.gender; //性别
    gender[0] = '不限';
    var degree = configData.degree; //学历
    degree[0] = '不限';
    var salarys = ['不限', '1k及以上', '2k及以上', '3k及以上', '4k及以上', '5k及以上', '6k及以上', '7k及以上', '8k及以上', '9k及以上', '10k及以上', '12k及以上', '15k及以上', '20k及以上', '30k及以上']; //期望薪资
    var fuli = configData.fuli;
    this.setData({ gender: gender, degree: degree, salarys: salarys, fuli: fuli });

    //获取关联词
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

    // 页面初始化 options为页面跳转所带来的参数
    var nearbyVal = 0;
    if (options.distance) nearbyVal = 4;
    this.setData({ kwType: options.kwType, nearbyVal: nearbyVal });
    var areaIds = options.jobLocIds;
    if (areaIds && areaIds.indexOf('d') == 0) areaIds = areaIds.replace('d', '');
    //搜索数据
    var dataVal = {
      page: 1,
      moreSearch: false,
      kwType: options.kwType,
      keyword: options.keyword,
      jobLocIds: areaIds ? areaIds : '',
      jobLocNames: options.jobLocNames ? options.jobLocNames : '',
      jobFun: options.jobFun ? options.jobFun : '',
      jobFunNames: options.jobFunNames ? options.jobFunNames : '',
      calling: options.calling ? options.calling : '',
      callingNames: options.callingNames ? options.callingNames : '',
      distance: options.distance ? options.distance : '', //距离
      distanceName: options.distanceName ? options.distanceName : '附近',
      comLatitude: options.comLatitude ? options.comLatitude : '', //维度
      comLongitude: options.comLongitude ? options.comLongitude : '', //经度
      order: options.order ? options.order : '10', //排序
      orderName: options.orderName ? options.orderName : '排序',
      minSalary: options.minSalary ? options.minSalary : '', //薪资
      minSalaryName: options.minSalaryName ? options.minSalaryName : '薪资',
      Reward: options.Reward ? options.Reward : '', //福利
      Degree: options.Degree ? options.Degree : '', //学历
      selGender: options.selGender ? options.selGender : '', //性别
      joinType: options.joinType ? options.joinType : '', //工作类型
      workYear: options.workYear ? options.workYear : '', //工作年限
      comProperty: options.comProperty ? options.comProperty : '', //公司类型
      comSize: options.comSize ? options.comSize : '' //工作规模
    };
    //缓存搜索数据
    if (dataVal['keyword']) {
      swan.getStorage({
        key: 'searchHistory1',
        success: function (res) {
          if (!res.data) res.data = [];
          if (res.data.indexOf(dataVal['keyword']) != -1) return;
          if (res.data.length >= 12) res.data.pop(); //数据大于等于3时，把最后一个数据删掉
          res.data.unshift(dataVal['keyword']); //将新搜索数据添加在数据的开头
          swan.setStorage({
            key: "searchHistory1",
            data: res.data
          });
        },
        fail: function () {
          //storage不存在数据
          var searchData = [];
          searchData.unshift(dataVal['keyword']);
          swan.setStorage({
            key: "searchHistory1",
            data: searchData
          });
        }
      });
    }

    //分享，没城市，则定位
    if (options.isShare && !dataVal.jobLocIds) {
      //默认厦门
      dataVal.jobLocIds = '3502';
      dataVal.jobLocNames = '厦门';
      swan.getLocation({
        type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          var lat = res.latitude;
          var long = res.longitude;
          if (lat == 0 || long == 0) {
            var isHideLoc = true;
          } else {
            var isHideLoc = false;
          }
          that.setData({ isHideLoc: isHideLoc });
          //保存全局
          getApp().data.isHideLoc = isHideLoc;
          getApp().data.lat = lat;
          getApp().data.long = long;

          swan.request({
            url: getApp().data.API_URL + '/web/mi/zuobiaoGetCity/',
            data: {
              lat: lat,
              long: long
            },
            method: 'GET',
            success: function (res) {
              if (res.data.status == 1) {
                var cityId = res.data.row.region_id;
                var cityName = res.data.row.region_name_short;
                if (that.inArray({ 'v': cityId, 'c': cityName }, getApp().data.hotCity)) {
                  dataVal.jobLocIds = cityId;
                  dataVal.jobLocNames = cityName;
                }
              }

              var localCity = { 'id': dataVal.jobLocIds, 'name': dataVal.jobLocNames };
              getApp().data.localCity = localCity;
              swan.setStorage({
                key: 'localCity',
                data: localCity
              });
              that.setData({ searchData: dataVal, searchVal: options.keyword });
              //搜索获取职位数据
              that.searchList(dataVal);
            },
            fail: function () {
              getApp().data.localCity = { 'id': dataVal.jobLocIds, 'name': dataVal.jobLocNames };
              that.setData({ searchData: dataVal, searchVal: options.keyword });
              //搜索获取职位数据
              that.searchList(dataVal);
            }
          });
        },
        fail: function (res) {
          getApp().data.localCity = { 'id': dataVal.jobLocIds, 'name': dataVal.jobLocNames };
          that.setData({ searchData: dataVal, searchVal: options.keyword });
          //搜索获取职位数据
          that.searchList(dataVal);
        }
      });
    } else {
      if (getApp().data.localCity) {
        if (!dataVal.jobLocIds) {
          dataVal.jobLocIds = getApp().data.localCity.id;
          dataVal.jobLocNames = getApp().data.localCity.name;
        }
      } else {
        if (!dataVal.jobLocIds) {
          dataVal.jobLocIds = '3502';
          dataVal.jobLocNames = '厦门';
          getApp().data.localCity = { 'id': '3502', 'name': '厦门' };
        } else {
          var id = dataVal.jobLocIds.substr(0, 4);
          var name = dataVal.jobLocNames;
          getApp().data.localCity = { 'id': id, 'name': name };
        }
      }
      this.setData({ searchData: dataVal, searchVal: options.keyword });
      //搜索获取职位数据
      this.searchList(dataVal);
    }
  },
  onShow: function () {
    //显示隐藏返回首页
    var showBackIndex = true;
    if (getCurrentPages().length == 1) showBackIndex = false;
    var isHideLoc = getApp().data.isHideLoc;
    var show80 = '';
    if (!isHideLoc) show80 = 'show80';
    this.setData({ showBackIndex: showBackIndex, isHideLoc: isHideLoc, show80: show80 });

    //地区，职位，行业
    if (getApp().data.isSearch) {
      var data = this.data.searchData; //搜索字段
      // var indexArea = getApp().data.dataNames.indexOf('indexArea');
      var indexPosition = getApp().data.dataNames.indexOf('indexPosition');
      var IndexIndustry = getApp().data.dataNames.indexOf('IndexIndustry');
      // var jobLocIds = indexArea!=-1?getApp().data.selectData[indexArea].ids:'';
      // var jobLocNames = indexArea!=-1?getApp().data.selectData[indexArea].names:'';
      var jobFun = indexPosition != -1 ? getApp().data.selectData[indexPosition].ids : '';
      var jobFunNames = indexPosition != -1 ? getApp().data.selectData[indexPosition].names : '';
      var calling = IndexIndustry != -1 ? getApp().data.selectData[IndexIndustry].ids : '';
      var callingNames = IndexIndustry != -1 ? getApp().data.selectData[IndexIndustry].names : '';

      getApp().data.isSearch = false;
      var url = '/page/search/result/result?kwType=' + data.kwType + '&keyword=' + data.keyword + '&jobLocIds=' + data.jobLocIds + '&jobLocNames=' + data.jobLocNames + '&jobFun=' + jobFun + '&jobFunNames=' + jobFunNames + '&calling=' + calling + '&callingNames=' + callingNames + '&order=' + data.order + '&minSalary=' + data.minSalary + '&Reward=' + data.Reward + '&Degree=' + data.Degree + '&selGender=' + data.selGender + '&joinType=' + data.joinType + '&workYear=' + data.workYear + '&comProperty=' + data.comProperty + '&comSize=' + data.comSize;

      swan.redirectTo({
        url: url
      });
      // this.setData({
      //   localCity: {'id':data.jobLocIds, 'name':data.jobLocNames}
      // });
    }
  },
  onReady: function () {
    // 页面渲染完成
    // wx.setNavigationBarTitle({title:this.data.title?this.data.title:"职位搜索"})
    swan.setNavigationBarTitle({ title: '招聘信息列表' });
    //浏览记录
    getApp().addLog("/page/search/result/result");
  },
  //返回搜索页面
  backSearchPage: function () {
    if (getCurrentPages().length > 2) {
      swan.navigateBack();
    } else {
      swan.navigateTo({
        url: '/page/search/search'
      });
    };
  },
  //修改搜索类型
  kwTypeChange: function (e) {
    var kwType = e.target.dataset.kwtype;
    this.setData({ jobList: [], kwType: kwType });

    //重新获取数据
    var searchData = this.data.searchData;
    searchData.kwType = kwType;
    searchData.moreSearch = false;
    searchData.page = 1;
    this.searchList(searchData);
  },
  //搜索获取职位数据
  searchList: function (params) {
    var that = this;
    if (params.jobLocIds) {
      var hasSelect = [];
      var ids = params.jobLocIds.split(',');
      var names = params.jobLocNames.split(',');
      for (var item in ids) {
        hasSelect[item] = { id: ids[item], name: names[item] };
      }
      //改变城市缓存
      swan.setStorage({
        key: 'cityInfo',
        data: { name: params.jobLocNames, id: params.jobLocIds, hasSelect: hasSelect }
      });
    }

    //去掉加载更多的标示
    if (params.page == 1) params.moreSearch = false;

    var url = getApp().data.API_URL + '/web/mi.api?act=seachJObList';
    var data = {
      kwType: params.kwType ? params.kwType : 1,
      keyword: params.keyword ? params.keyword : '',
      jobLocIds: params.jobLocIds ? params.jobLocIds : getApp().data.localCity.id,
      jobFun: params.jobFun ? params.jobFun : '',
      calling: params.calling ? params.calling : '',
      page: params.page ? params.page : 1,
      distance: params.distance,
      comLatitude: params.comLatitude,
      comLongitude: params.comLongitude,
      fromXCX: 1, //转换坐标的标示
      order: params.order,
      minSalary: params.minSalary ? configData._salarys[params.minSalary] : '',
      Reward: params.Reward,
      Degree: params.Degree ? params.Degree : '',
      selGender: params.selGender,
      joinType: params.joinType,
      comProperty: params.comProperty,
      comSize: params.comSize,
      workYear: params.workYear
    };
    var func = function (res, useData) {
      debugger;
      var data = res.data.rows;
      var jobList = [];
      var moreSearchHide = true;

      if (data) {
        if (data.length >= 20) moreSearchHide = false;
        if (params.moreSearch) {
          //加载更多
          jobList = that.data.jobList; //原先数据
          for (var key in data) {
            jobList.push(data[key]); //push加入新数据
          }
        } else {
          jobList = data;
        }
      }
      var listShow = true;
      if (jobList.length <= 0) listShow = false;
      that.setData({ listShow: listShow, jobList: jobList, moreSearchHide: moreSearchHide, title: res.data.title });
    };

    util.isGet(data, url, func);
  },
  //更多搜索
  moreSearch: function () {
    if (!this.data.moreSearchHide) {
      var searchData = this.data.searchData;
      searchData.page = parseInt(searchData.page) + 1;
      searchData.moreSearch = true;
      this.searchList(searchData);
    }
  },
  //到底部自动加下一页的数据载数据
  lower: function (e) {
    if (!this.data.moreSearchHide) {
      var searchData = this.data.searchData;
      searchData.page = parseInt(searchData.page) + 1;
      searchData.moreSearch = true;
      this.searchList(searchData);
    }
  },
  //滚动触发返回顶部的显示隐藏
  scroll: function (e) {
    if (e.detail.scrollTop > 200) {
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
  //分享（2017.12.18  王总说去掉）
  // onShareAppMessage:function(){
  //   var searchData = this.data.searchData;
  //   //介绍
  //   var str = '';
  //   if(searchData.keyword) str += searchData.keyword+'+';
  //   if(searchData.jobLocNames) str += searchData.jobLocNames+'+';
  //   if(searchData.jobFunNames) str += searchData.jobFunNames+'+';
  //   if(searchData.callingNames) str += searchData.callingNames+'+';
  //   if(str.length>0) str = str.substring(0, str.length - 1);
  //   //链接
  //   var path = "/page/search/result/result?kwType="+searchData.kwType
  //   +"&keyword="+searchData.keyword+"&jobLocIds="+searchData.jobLocIds+"&jobLocNames="+searchData.jobLocNames+"&jobFun="+searchData.jobFun+"&jobFunNames="+searchData.jobFunNames+"&calling="+searchData.calling+"&callingNames="+searchData.callingNames+"&order="+searchData.order+"&minSalary="+searchData.minSalary+"&Reward="+searchData.Reward+"&Degree="+searchData.Degree+"&selGender="+searchData.selGender+"&joinType="+searchData.joinType+"&workYear="+searchData.workYear+"&comProperty="+searchData.comProperty+"&comSize="+searchData.comSize+"&isShare=1";

  //   return {
  //     title: '招聘信息列表',
  //     desc: str+'的搜索结果',
  //     path: path
  //   }
  // },
  //返回到首页
  backIndex: function () {
    swan.switchTab({
      url: '/page/index/index'
    });
  },
  //改变搜索类型
  bindPickerChange: function (e) {
    var kwType = e.detail.value;
    this.setData({ kwType: kwType });
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.kwType = kwType;
    searchData.moreSearch = false;
    searchData.page = 1;
    this.searchList(searchData);
  },
  //选择城市
  selectArea: function () {
    var that = this;
    var localCity = getApp().data.localCity;
    var cityId = localCity.id;
    this.hideAll();
    swan.request({
      url: getApp().data.API_URL + '/web/region.api?id=' + cityId,
      data: {},
      method: 'GET',
      success: function (res) {
        var cityIds = that.data.searchData.jobLocIds.split(",");
        var myCitys = res.data;
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
        that.setData({
          autoHide: true, //隐藏关联词语
          shaixuanHide: true, //隐藏筛选层
          areaHide: false,
          backHide: false,
          selectAreaList: myCitys
        });
      }
    });
  },
  //关闭所有弹出层层
  hideAll: function () {
    this.setData({
      areaHide: true,
      fujinHide: true,
      xinziHide: true,
      paixuHide: true,
      backHide: true,
      autoHide: true,
      shaixuanHide: true
    });
  },
  //监听下拉动作
  onReachBottom: function () {
    this.lower();
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
    // searchData.jobLocIds = '';//去掉城市信息
    searchData.moreSearch = false;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ nearbyVal: nearbyVal, searchData: searchData });
    this.hideAll();
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
    if (rows.length > 0) autoHide = false;
    this.setData({ searchVal: val, rows: rows, autoHide: autoHide, shaixuanHide: true, areaHide: true, backHide: true });
  },
  //按确定搜索
  toSearch: function (e) {
    var key = e.currentTarget.dataset.key; //关键词
    this.setData({ searchVal: key, rows: [] });
    this.hideAll();
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.keyword = key;
    searchData.moreSearch = false;
    searchData.page = 1;
    this.searchList(searchData);
  },
  //清除数据
  clearVal: function () {
    this.setData({ searchVal: '', rows: [] });
    this.hideAll();
  },
  //回车触发
  huichechufa: function (e) {
    var key = e.detail.value;
    this.setData({ searchVal: key });
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.keyword = key;
    searchData.moreSearch = false;
    searchData.page = 1;
    this.searchList(searchData);
    this.hideAll();
  },
  //显示筛选层
  showShaixuan: function () {
    // this.hideAll();
    this.setData({ shaixuanHide: !this.data.shaixuanHide, autoHide: true, areaHide: true, backHide: true });
  },
  //改变城市值(单个)
  bindCityChange: function (e) {
    var cityId = e.currentTarget.dataset.id;
    var cityName = e.currentTarget.dataset.name;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.jobLocIds = cityId;
    searchData.jobLocNames = cityName;
    searchData.distance = 0;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData, nearbyVal: 0 });
    this.hideAll();
  },
  //改变城市值(多选)
  bindCityChange_more: function (e) {
    var cityId = e.currentTarget.dataset.id;
    var cityName = e.currentTarget.dataset.name;

    var searchData = this.data.searchData;
    //不限
    if (!cityId || !cityName) {
      searchData.jobLocIds = '';
      searchData.jobLocNames = '';
    }

    //多选处理
    //id处理
    var cityStr = "";
    if (searchData.jobLocIds) {
      var cityIds = searchData.jobLocIds.split(",");
      var idIndex = cityIds.indexOf(cityId);
      var pidIndex = cityIds.indexOf(getApp().data.localCity.id);
      if (pidIndex != '-1') {
        //删除父类
        cityIds.splice(pidIndex, 1);
      }
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
      cityStr = cityIds.join(",");
    } else {
      cityStr = cityId;
      cityIds = [cityId];
    }
    //name处理
    var cityNameStr = "";
    if (searchData.jobLocNames) {
      var cityNames = searchData.jobLocNames.split(",");
      var nameIndex = cityNames.indexOf(cityName);
      var pNameIndex = cityNames.indexOf(getApp().data.localCity.name);
      if (pNameIndex != '-1') {
        //删除父类
        cityNames.splice(pNameIndex, 1);
      }
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
    var selectAreaList = this.data.selectAreaList;
    var myCitys = selectAreaList;
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

    selectAreaList = myCitys;

    //重新获取数据
    searchData.jobLocIds = cityStr;
    searchData.jobLocNames = cityNameStr;
    this.setData({ searchData: searchData, selectAreaList: selectAreaList });
  },
  sureSearch: function () {
    this.searchList(this.data.searchData);
    this.hideAll();
  },
  //改变排序
  bindSortChange: function (e) {
    var sortId = e.currentTarget.dataset.id;
    var sortName = e.currentTarget.dataset.name;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.order = sortId;
    searchData.orderName = sortName;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变性别
  bindGenderChange: function (e) {
    var sexId = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.selGender = sexId;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变薪资
  bindSalaryChange: function (e) {
    var minSalary = e.currentTarget.dataset.id;
    var minSalaryName = e.currentTarget.dataset.name;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.minSalary = minSalary;
    searchData.minSalaryName = minSalaryName;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变学历
  bindDegreeChange: function (e) {
    var Degree = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.Degree = Degree;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变福利
  bindRewardChange: function (e) {
    var Reward = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.Reward = Reward;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变工作类型
  bindJoinTypeChange: function (e) {
    var joinType = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.joinType = joinType;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变工作经验
  bindWorkYearChange: function (e) {
    var workYear = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.workYear = workYear;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变公司性质
  bindComPropertyChange: function (e) {
    var comProperty = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.comProperty = comProperty;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  //改变公司规模
  bindComSizeChange: function (e) {
    var comSize = e.currentTarget.dataset.id;
    //重新获取数据
    var searchData = this.data.searchData;
    searchData.comSize = comSize;
    searchData.page = 1;
    this.searchList(searchData);
    this.setData({ searchData: searchData });
    this.hideAll();
  },
  inArray: function (array, arrays) {
    for (var key in arrays) {
      if (arrays[key].v == array.v) {
        return true;
      }
    }
    return false;
  },
  showXinzi: function () {
    this.hideAll();
    this.setData({ xinziHide: false, autoHide: false });
  },
  showFujin: function () {
    this.hideAll();
    this.setData({ fujinHide: false, autoHide: false });
  },
  showPaixu: function () {
    this.hideAll();
    this.setData({ paixuHide: false, autoHide: false });
  },
  //跳转到选择城市页面
  toSelectCity: function () {
    swan.redirectTo({
      url: '/page/newArea/newArea?fromSearch=1'
    });
  },
  //页面注销时执行
  onUnload: function () {
    // var indexArea = getApp().data.dataNames.indexOf('indexArea');
    // var indexPosition = getApp().data.dataNames.indexOf('indexPosition');
    // var IndexIndustry = getApp().data.dataNames.indexOf('IndexIndustry');
    // if(indexArea!=-1){
    //   getApp().data.selectData[indexArea].ids = '';
    //   getApp().data.selectData[indexArea].names = '';
    //   getApp().data.selectData[indexArea].hasSelect = '';
    // }
    // if(indexPosition!=-1){
    //   getApp().data.selectData[indexPosition].ids = '';
    //   getApp().data.selectData[indexPosition].names = '';
    //   getApp().data.selectData[indexPosition].hasSelect = '';
    // }
    // if(IndexIndustry!=-1){
    //   getApp().data.selectData[IndexIndustry].ids = '';
    //   getApp().data.selectData[IndexIndustry].names = '';
    //   getApp().data.selectData[IndexIndustry].hasSelect = '';
    // }
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