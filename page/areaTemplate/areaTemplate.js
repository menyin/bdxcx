// page/areaTemplate/areaTemplate.js
Page({
  data: {
    cacheSelect: [],
    hotCity: getApp().data.hotCity
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    //设置高度
    swan.getSystemInfo({
      success: function (res) {
        var iheight = res.windowHeight;
        that.setData({
          iheight: iheight - 180 + 'px'
        });
      }
    });

    //获取行业类别列表
    var types = options.type; //选择框类型
    var p = parseInt(options.p); //数据id
    var maxCount = parseInt(options.maxCount); //最大选择数
    var dataName = options.name; //存放数据的名称
    var isSearch = options.isSearch ? options.isSearch : false; //选择完是否跳转跳转
    var areaSearch = options.areaSearch ? options.areaSearch : false; //城市搜索

    var dataNames = getApp().data.dataNames;
    var nameIndex = dataNames.indexOf(dataName); //获取数据名的下标
    if (nameIndex == -1) {
      //选择框名称不存在缓存中
      dataNames.push(dataName);
      getApp().data.dataNames = dataNames;

      nameIndex = dataNames.indexOf(dataName);
      getApp().data.selectData[nameIndex] = { ids: '', names: '', hasSelect: [] };
    }

    if (nameIndex == -1) {
      swan.showToast({ title: '加载失败，请返回重新选择', icon: 'loading', duration: 2000 });
      return;
    }
    getApp().cache.nameIndex = nameIndex;

    var title = '';
    var url = '';
    var key = '';
    if (types == 'area') {
      key = 'areaData';
      url = '';
      title = '地区';
    }
    if (types == 'position') {
      key = 'positionData';
      url = '';
      title = '职位类别';
    }
    if (types == 'industry') {
      key = 'industryData';
      url = '';
      title = '行业类别';
    }

    // 本地storage获取数据
    swan.getStorage({
      key: key,
      success: function (res) {
        // var data = res.data;
        var allData = res.data; //全部数据
        var data = {};
        data[p] = allData[p]; //顶层数据
        console.log(data);
        if (areaSearch) {
          //2017.01.17只显示福建
          data[p].s = [3500]; //福建
          data[1100] = allData[1100]; //北京
          data[1100].s = [];
          data[3307] = allData[3307]; //金华市
          data[3307].s = [];
          data[330782] = allData[330782]; //义乌市
          for (var key in allData[3500].s) {
            var keyVal = allData[3500].s[key];
            if (allData[keyVal]) {
              allData[keyVal].s = [];
              data[keyVal] = allData[keyVal];
            }
          }
        }
        for (var key in data[p].s) {
          //子类数据
          var keyVal = data[p].s[key];
          if (allData[keyVal]) data[keyVal] = allData[keyVal];
        }

        that.setData({ areaList: data });
      },
      fail: function () {
        swan.showToast({ title: '加载失败，请返回重新选择', icon: 'loading', duration: 2000 });
      }
    });

    var selectBase = { title: title, maxCount: maxCount, url: url, key: key }; //获取选择类型的基础信息
    that.setData({ areaSearch: areaSearch, isSearch: isSearch, p: p, types: types, dataName: dataName, maxCount: maxCount, nameIndex: nameIndex, selectBase: selectBase });
  },
  onReady: function () {
    // 页面渲染完成
    swan.setNavigationBarTitle({ title: this.data.selectBase.title }); //设置标题
  },
  onShow: function () {
    // 页面显示
    //显示已选择的数据
    var cacheSelect = [];
    cacheSelect = getApp().data.selectData[getApp().cache.nameIndex].hasSelect;
    this.setData({ cacheSelect: cacheSelect });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //第一层
  levelOne: function (e) {
    var that = this;
    var pv = e.currentTarget.dataset.pv;
    if (that.data.areaSearch) {
      //2017.01.17只显示福建
      that.setData({ pv: pv });
    } else {
      that.setData({ pv: pv, cv: '', tv: '' });
    }

    if (pv && (pv == 0 || pv == 'hot')) return;
    // 本地storage获取数据
    swan.getStorage({
      key: that.data.selectBase.key,
      success: function (res) {
        var allData = res.data; //全部数据
        var areaList = that.data.areaList; //数据
        var data = allData[pv];
        if (data.s && data.s.length > 0) {
          for (var key in data.s) {
            //子类数据
            var keyVal = data.s[key];
            if (allData[keyVal]) {
              if (that.data.areaSearch) allData[keyVal].s = []; //2017.01.17只显示福建
              areaList[keyVal] = allData[keyVal];
            }
          }
          // console.log(areaList);
          that.setData({ areaList: areaList });
        }
      },
      fail: function () {
        swan.showToast({ title: '加载失败，请返回重新选择', icon: 'loading', duration: 2000 });
      }
    });
  },
  //第二层
  levelTow: function (e) {
    var that = this;
    var cv = e.currentTarget.dataset.cv; //id
    that.setData({ cv: cv });

    // 本地storage获取数据
    swan.getStorage({
      key: that.data.selectBase.key,
      success: function (res) {
        if (cv && cv != 0) {
          if (!that.data.areaSearch) {
            //2017.01.17只显示福建
            var allData = res.data; //全部数据
            var areaList = that.data.areaList; //数据
            var data = allData[cv];
            areaList[cv] = data;
            if (data.s && data.s.length > 0) {
              for (var key in data.s) {
                //子类数据
                var keyVal = data.s[key];
                if (allData[keyVal]) areaList[keyVal] = allData[keyVal];
              }
              that.setData({ areaList: areaList });
            }
          }
          that.add(cv);
        } else {
          that.setData({ cacheSelect: [{ id: 0, name: '不限' }] });
        }
      },
      fail: function () {
        swan.showToast({ title: '加载失败，请返回重新选择', icon: 'loading', duration: 2000 });
      }
    });
  },
  //第三层
  levelThree: function (e) {
    var tv = e.currentTarget.dataset.tv;
    this.add(tv);
    this.setData({ tv: tv });
  },
  //全
  myIsAll: function (e) {
    console.log(e);
    var pv = e.currentTarget.dataset.pv; //id
    var cv = e.currentTarget.dataset.cv; //id
    var valData = "";
    if (pv) {
      //二级全选
      var data = { pv: pv };
      valData = pv;
    }
    if (cv) {
      //三级全选
      var data = { cv: cv };
      valData = cv;
    }
    this.add(valData, true);
    this.setData(data);
  },
  //缓存选择的数据 val是id， isAll是否全选某个城市
  add: function (val, isAll = false) {
    var allData = this.data.areaList; //全部数据
    var cacheSelect = this.data.cacheSelect; //选择的数据
    // console.log(cacheSelect);
    var row = allData[val]; //点击的数据
    // console.log(row);
    if (row.s && row.s.length > 0 && !isAll) return;

    var data = { id: row.v, name: row.c }; //新增数据

    if (this.inArray({ id: 0, name: '不限' }, cacheSelect)) {
      cacheSelect = [];
    }
    if (this.inArray(data, cacheSelect)) {
      //已经添加,不再添加
      return;
    }
    //去掉全选下面的子类
    if (isAll && row.s && row.s.length > 0) {
      for (var key in row.s) {
        for (var k in cacheSelect) {
          if (row.s[key] == cacheSelect[k].id) {
            cacheSelect.splice(k, 1);
            break;
          }
        }
      }
    }
    //去掉父类
    if (!isAll) {
      console.log(cacheSelect);
      for (var key in cacheSelect) {
        if (allData[val].p == cacheSelect[key].id) {
          cacheSelect.splice(key, 1);
          break;
        }
      }
    }
    var maxCount = this.data.selectBase.maxCount; //最大选择数
    if (cacheSelect.length >= maxCount) {
      swan.showToast({ title: '最多只能选' + maxCount + '个', icon: 'success', duration: 2000 });
      return;
    }
    if (!cacheSelect) cacheSelect = [];
    cacheSelect.push(data);
    this.setData({ cacheSelect: cacheSelect });
  },
  //删除已选择的数据
  delAdd: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var cacheSelect = this.data.cacheSelect; //已选择的数据
    cacheSelect.splice(index, 1);
    this.setData({ cacheSelect: cacheSelect });
    // getApp().data.selectData[this.data.nameIndex].hasSelect = cacheSelect;
  },
  //清空（不限）
  clearAll: function () {
    this.setData({ cacheSelect: [], pv: '', cv: '', tv: '' });
  },
  //隐藏遮蔽层
  hideShadeBox: function () {
    this.setData({ cv: '', tv: '' });
  },
  //确认提交
  sureAdd: function () {
    var cacheSelect = this.data.cacheSelect; //已选择的数据
    var ids = '';
    var names = '';
    for (var item in cacheSelect) {
      if (cacheSelect[item].id) ids += cacheSelect[item].id + ',';
      if (cacheSelect[item].name) names += cacheSelect[item].name + ',';
    }

    //去掉末尾的，
    ids = ids.substr(0, ids.length - 1);
    names = names.substr(0, names.length - 1);

    getApp().data.selectData[this.data.nameIndex].hasSelect = cacheSelect; //缓存选择的数据
    getApp().data.selectData[this.data.nameIndex].ids = ids; //缓存ids
    getApp().data.selectData[this.data.nameIndex].names = names; //缓存names
    getApp().cache.sureBack = true;
    getApp().data.isSearch = this.data.isSearch;
    swan.navigateBack();
  },
  //判断一维数组是否存在于多维数组中
  inArray: function (array, arrays) {
    for (var key in arrays) {
      if (arrays[key].id == array.id) {
        return true;
      }
    }
    return false;
  }
});