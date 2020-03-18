var allData = require('../../../../config/data.js');
var util = require("../../../../config/global.js");
Page({
  data: {
    index: '',
    workid: '',
    comProperty: allData.comProperty,
    comSize: allData.comSize,
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var workContent1 = options.workContent1;
    var that = this;
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;

        if (id) {
          //修改
          var workRow = resumeRow.workListInfo[index];
          if (workRow) {
            //工作经历数据
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              workid: workRow.workid,
              startDate: workRow.workStartDate, //开始时间
              endDate: workRow.workEndDate, //结束时间
              comName: workRow.workName, //企业名称
              sizeIndex: workRow.WorkComSize, //公司规模
              proIndex: allData._comProperty.indexOf(parseInt(workRow.WorkComProperty)), //公司性质
              workIndustryIds: workRow.workIndustryId, //行业id
              workIndustryNames: workRow.workIndustry,
              workPositionIds: workRow.workJobClassId, //职位类型id
              workPositionNames: workRow.workJobClass,
              workOffice: workRow.workOffice, //担任职位
              workContent: workRow.workContent, //工作描述
              workContent1: workContent1 //工作描述1（微信textarea不让修改，占时解决方案）
            });

            //选择数据
            var indexIndustry = getApp().data.dataNames.indexOf('workIndustry');
            if (indexIndustry == -1) {
              //职业类别
              getApp().data.dataNames.push('workIndustry');
              indexIndustry = getApp().data.dataNames.indexOf('workIndustry');
              var workIndustry = { ids: workRow.workIndustryId, names: workRow.workIndustry, hasSelect: [{ id: workRow.workIndustryId, name: workRow.workIndustry }] };
              getApp().data.selectData[indexIndustry] = workIndustry;
            }

            var indexPosition = getApp().data.dataNames.indexOf('workPosition');
            if (indexPosition == -1) {
              //行业类别
              getApp().data.dataNames.push('workPosition');
              indexPosition = getApp().data.dataNames.indexOf('workPosition');
              if (workRow.workJobClassId && workRow.workJobClass) {
                var workPosition = { ids: workRow.workJobClassId, names: workRow.workJobClass, hasSelect: [{ id: workRow.workJobClassId, name: workRow.workJobClass }] };
              } else {
                var workPosition = { ids: '', names: '', hasSelect: [] };
              }

              getApp().data.selectData[indexPosition] = workPosition;
            }
            return;
          }
          swan.showToast({ title: '获取工作经历失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }

        //添加
        that.setData({
          index: -99,
          resumeRow: resumeRow,
          startDate: '', //开始时间
          endDate: '', //结束时间
          comName: '', //企业名称
          sizeIndex: '', //公司规模
          proIndex: '', //公司性质
          workIndustryIds: '', //行业id
          workIndustryNames: '',
          workPositionIds: '', //职位类型id
          workPositionNames: '',
          workOffice: '', //担任职位
          workContent: '', //工作描述
          delShow: false,
          btnStyle: 'width:100%'
        });
      },
      fail: function () {
        swan.showToast({ title: '获取简历信息失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;

    var indexIndustry = getApp().data.dataNames.indexOf('workIndustry');
    var indexPosition = getApp().data.dataNames.indexOf('workPosition');
    this.setData({
      workIndustryIds: indexIndustry != -1 ? getApp().data.selectData[indexIndustry].ids : '',
      workIndustryNames: indexIndustry != -1 ? getApp().data.selectData[indexIndustry].names : '',
      workPositionIds: indexPosition != -1 ? getApp().data.selectData[indexPosition].ids : '',
      workPositionNames: indexPosition != -1 ? getApp().data.selectData[indexPosition].names : ''
    });
  },
  onReady: function () {

    swan.setNavigationBarTitle({ 'title': '工作经历' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeWork/resumeWork");
  },
  bindStartDateChange: function (e) {
    //开始时间
    this.setData({ startDate: e.detail.value });
  },
  bindEndDateChange: function (e) {
    //结束时间
    this.setData({ endDate: e.detail.value });
  },
  bindcomSizeChange: function (e) {
    //公司规模
    this.setData({ sizeIndex: e.detail.value });
  },
  bindComPropertyChange: function (e) {
    //公司性质
    this.setData({ proIndex: e.detail.value });
  },
  //提交数据
  formSubmit: function (e) {
    var that = this;
    var comName = e.detail.value.comName; //公司名称
    var comProperty = e.detail.value.comProperty; //公司性质
    var comSize = e.detail.value.comSize; //公司规模
    var endDate = e.detail.value.endDate;
    var startDate = e.detail.value.startDate;
    var workDesc = e.detail.value.workDesc; //工作描述
    var workOffice = e.detail.value.workOffice; //担任职位
    var workIndustryIds = e.detail.value.workIndustryIds; //行业类别
    var workIndustryNames = e.detail.value.workIndustryNames;
    var workPositionIds = e.detail.value.workPositionIds; //职位类别
    var workPositionNames = e.detail.value.workPositionNames;

    //验证
    if (!startDate) {
      swan.showToast({ title: '请选择开始时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!endDate) {
      swan.showToast({ title: '请选择结束时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!comName) {
      swan.showToast({ title: '请填写公司名称', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!comSize || comSize == 0) {
      swan.showToast({ title: '请选择公司规模', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!comProperty || comProperty == 0) {
      swan.showToast({ title: '请选择公司性质', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!workIndustryIds) {
      swan.showToast({ title: '请选择行业类别', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!workPositionIds) {
      swan.showToast({ title: '请选择职位类别', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!workOffice) {
      swan.showToast({ title: '请填写担任职位', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!workDesc) {
      swan.showToast({ title: '请填写工作描述', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'work_save',
      workid: this.data.workid,
      txtWorkName: comName,
      hidWorkComSize: comSize,
      hidWorkComProperty: allData._comProperty[parseInt(comProperty)],
      hidCallingExpect: workIndustryIds,
      ymStartTime1955582: startDate,
      ymEndTime1955582: endDate,
      txtWorkOffice: workOffice,
      hidJobSortExpect: workPositionIds,
      txtContent: workDesc,
      workIndustryNames: workIndustryNames,
      workPositionNames: workPositionNames
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        //修改本地简历信息
        newData.workIndustryNames = newData.workIndustryNames;
        newData.workPositionNames = newData.workPositionNames, newData.workid = res.data.workid;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '修改教育经历失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var workRow = {
      WorkComProperty: newData.hidWorkComProperty,
      WorkComSize: newData.hidWorkComSize,
      workContent: decodeURI(newData.txtContent),
      workEndDate: newData.ymEndTime1955582,
      workIndustry: newData.workIndustryNames,
      workIndustryId: newData.hidCallingExpect,
      workJobClass: newData.workPositionNames,
      workJobClassId: newData.hidJobSortExpect,
      workName: decodeURI(newData.txtWorkName),
      workOffice: decodeURI(newData.txtWorkOffice),
      workStartDate: newData.ymStartTime1955582,
      workid: newData.workid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.workListInfo.push(workRow);
    } else {
      //修改
      resumeRow.workListInfo[index] = workRow;
    }
    swan.setStorage({
      key: 'resumeRow' + getApp().data.uid,
      data: resumeRow,
      success: function (res) {
        swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 2000 });
        setTimeout(function () {
          swan.navigateBack(); //返回
        }, 1000);
      },
      fail: function () {
        swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  //是否要删除？
  canDel: function (e) {
    var that = this;
    swan.showModal({
      title: '删除工作经历',
      content: '您确定要删除当前工作经历',
      success: function (res) {
        if (res.confirm) {
          that.del(e);
        }
      }
    });
  },
  //删除
  del: function (e) {
    var that = this;
    var id = e.target.dataset.id; //删除id
    var index = parseInt(e.target.dataset.index); //删除下标
    var resumeRow = this.data.resumeRow;
    //删除的信息不存在
    if (!resumeRow.workListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'work_del',
      workid: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.workListInfo.splice(index, 1);
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow,
          success: function () {
            swan.navigateBack();
          },
          fail: function () {
            swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
          }
        });
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '删除失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //关闭页面
  onUnload: function () {
    // getApp().data.dataNames=[];
    // getApp().data.selectData=[];
    var dataNames = getApp().data.dataNames; //已选择的数据
    var selectData = getApp().data.selectData;
    console.log(dataNames);
    var indexPosition = dataNames.indexOf('workPosition');
    var indexIndustry = dataNames.indexOf('workIndustry');
    dataNames.splice(indexPosition, 1);
    dataNames.splice(indexIndustry, 1);
    selectData.splice(indexPosition, 1);
    selectData.splice(indexIndustry, 1);
    console.log(dataNames);
    getApp().data.dataNames = dataNames;
    getApp().data.selectData = selectData;
  }
});