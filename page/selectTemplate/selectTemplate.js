Page({
  data: {
    getType: getApp().data.getType,
    cacheSelect: [], //选择的数据
    types: '', //选择类型
    nameIndex: '', //选择类型下标
    selectBase: [] //选择类型的基础信息
  },
  onLoad: function (options) {
    //重置返回
    if (getApp().cache.sureBack) {
      getApp().cache.sureBack = false;
      getApp().cache.locUrlCount = 0;
    }

    //获取行业类别列表
    var types = options.type; //选择框类型
    var p = parseInt(options.p); //数据id
    var maxCount = parseInt(options.maxCount); //最大选择数
    var dataName = options.name; //存放数据的名称

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
      swan.showToast({ title: '加载失败，请返回重新选择', mask: true, icon: 'loading', duration: 2000 });
      return;
    }

    var title = '';
    var url = '';
    var key = '';
    if (types == 'area') {
      key = 'areaData';
      //  url = 'http://m.597.com/region.php?act=nextList';
      url = 'https://api.597.com/web/mi.api?act=nextAreaList';
      title = '地区';
    }
    if (types == 'position') {
      key = 'positionData';
      url = 'https://api.597.com/web/jobclass.api?act=jobSort';
      title = '职位类别';
    }
    if (types == 'industry') {
      key = 'industryData';
      url = 'https://api.597.com/web/industry.api?act=calling';
      title = '行业类别';
    }

    var selectBase = { title: title, maxCount: maxCount, url: url }; //获取选择类型的基础信息
    getApp().cache.nameIndex = nameIndex;
    getApp().cache.selectBase = selectBase;
    var that = this;

    if (that.data.getType == "storage") {
      // 本地storage获取数据
      swan.getStorage({
        key: key,
        success: function (res) {
          var data = res.data[p].s;
          var rows = [];
          for (var key in data) {
            if (res.data[data[key]]) {
              rows[key] = { "label": res.data[data[key]].c, "value": res.data[data[key]].v, "isNext": res.data[data[key]].s ? true : false };
            }
          }
          that.setData({ areaList: rows });
          getApp().cache.locUrlCount = getApp().cache.locUrlCount + 1;
        },
        fail: function () {
          swan.showToast({ title: '加载失败，请返回重新选择', mask: true, icon: 'loading', duration: 2000 });
        }
      });
    } else {
      //异步获取数据
      swan.request({
        url: url + '&p=' + p,
        method: 'GET',
        success: function (res) {
          var data = res.data;
          if (!data) {
            swan.showToast({ title: '加载失败，请返回重新选择', mask: true, icon: 'loading', duration: 2000 });
            return;
          }
          that.setData({ areaList: data });
          getApp().cache.locUrlCount = getApp().cache.locUrlCount + 1;
        }
      });
    }

    that.setData({ types: types, dataName: dataName, maxCount: maxCount, nameIndex: nameIndex, selectBase: selectBase });
  },
  onShow: function () {
    if (getApp().cache.sureBack) {
      //true 自动返回
      if (getApp().cache.locUrlCount > 0) {
        swan.navigateBack();
      }
    }

    //显示已选择的数据
    var cacheSelect = [];
    cacheSelect = getApp().data.selectData[getApp().cache.nameIndex].hasSelect;
    console.log(cacheSelect);
    this.setData({ cacheSelect: cacheSelect });
  },
  onReady: function () {
    swan.setNavigationBarTitle({ title: getApp().cache.selectBase.title }); //设置标题
  },
  //添加选择的行业类别
  addVal: function (e) {
    var data = e.target.dataset; //当前选择的数据
    var cacheSelect = this.data.cacheSelect; //已选择的数据
    if (this.inArray(data, cacheSelect)) {
      //已经添加,不再添加
      return;
    }
    var maxCount = this.data.selectBase.maxCount; //最大选择数
    if (cacheSelect.length >= maxCount) {
      swan.showToast({ title: '最多只能选' + maxCount + '个', mask: true, icon: 'success', duration: 2000 });
      return;
    }
    cacheSelect.push({ id: data.id, name: data.name });
    this.setData({ cacheSelect: cacheSelect });
    getApp().data.selectData[this.data.nameIndex].hasSelect = cacheSelect;
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

    swan.navigateBack();
  },
  //删除已选择的数据
  delAdd: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var cacheSelect = this.data.cacheSelect; //已选择的数据
    cacheSelect.splice(index, 1);
    this.setData({ cacheSelect: cacheSelect });
    getApp().data.selectData[this.data.nameIndex].hasSelect = cacheSelect;
  },
  //判断一维数组是否存在于多维数组中
  inArray: function (array, arrays) {
    for (var key in arrays) {
      if (arrays[key].id == array.id) {
        return true;
      }
    }
    return false;
  },
  // 页面关闭
  onUnload: function () {
    getApp().cache.locUrlCount = getApp().cache.locUrlCount - 1;
  }
});