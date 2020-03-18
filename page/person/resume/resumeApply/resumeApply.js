var allData = require('../../../../config/data.js');
var util = require('../../../../config/global.js');
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    joinType: allData.joinType, //职位类型
    joinTime: allData.joinTime, //到岗时间
    salarys: allData.salarys //期望薪资
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    var that = this;
    //获取简历信息
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;

        //意向职位
        var indexPosition = getApp().data.dataNames.indexOf('applyPosition');
        if (indexPosition == -1) {
          getApp().data.dataNames.push('applyPosition');
          indexPosition = getApp().data.dataNames.indexOf('applyPosition');
          var hasSelect = [];
          var ids = resumeRow.applyData.applyPositionIds.split(',');
          var name = resumeRow.applyData.applyPositionNames.split(',');
          for (var item in ids) {
            hasSelect[item] = { id: ids[item], name: name[item] };
          }
          var applyPosition = '';
          if (resumeRow.applyData.applyPositionIds && resumeRow.applyData.applyPositionNames) {
            applyPosition = { ids: resumeRow.applyData.applyPositionIds, names: resumeRow.applyData.applyPositionNames, hasSelect: hasSelect };
          } else {
            applyPosition = { ids: '', names: '', hasSelect: [] };
          }

          getApp().data.selectData[indexPosition] = applyPosition;
        }

        //意向行业
        var indexIndustry = getApp().data.dataNames.indexOf('applyIndustry');
        if (indexIndustry == -1) {
          getApp().data.dataNames.push('applyIndustry');
          indexIndustry = getApp().data.dataNames.indexOf('applyIndustry');
          var hasSelect = [];
          var ids = resumeRow.applyData.applyIndustryIds.split(',');
          var name = resumeRow.applyData.applyIndustryNames.split(',');
          for (var item in ids) {
            hasSelect[item] = { id: ids[item], name: name[item] };
          }
          var applyIndustry = '';
          if (resumeRow.applyData.applyIndustryIds && resumeRow.applyData.applyIndustryNames) {
            applyIndustry = { ids: resumeRow.applyData.applyIndustryIds, names: resumeRow.applyData.applyIndustryNames, hasSelect: hasSelect };
          } else {
            applyIndustry = { ids: '', names: '', hasSelect: [] };
          }
          getApp().data.selectData[indexIndustry] = applyIndustry;
        }

        //意向地区
        var indexArea = getApp().data.dataNames.indexOf('applyArea');
        if (indexArea == -1) {
          getApp().data.dataNames.push('applyArea');
          indexArea = getApp().data.dataNames.indexOf('applyArea');
          var hasSelect = [];
          var ids = resumeRow.applyData.applyAreaIds.split(',');
          var name = resumeRow.applyData.applyAreaNames.split(',');
          for (var item in ids) {
            hasSelect[item] = { id: ids[item], name: name[item] };
          }
          var applyArea = '';
          if (resumeRow.applyData.applyAreaIds && resumeRow.applyData.applyAreaNames) {
            applyArea = { ids: resumeRow.applyData.applyAreaIds, names: resumeRow.applyData.applyAreaNames, hasSelect: hasSelect };
          } else {
            applyArea = { ids: '', names: '', hasSelect: [] };
          }
          getApp().data.selectData[indexArea] = applyArea;
        }

        resumeRow.applyData.salary = allData._salarys.indexOf(parseInt(resumeRow.applyData.salary)); //薪资
        resumeRow.applyData.joinType = allData._joinType.indexOf(parseInt(resumeRow.applyData.joinType)); //职位类型
        that.setData({
          resumeRow: resumeRow,
          applyData: resumeRow.applyData,
          applyPositionIds: resumeRow.applyData.applyPositionIds ? resumeRow.applyData.applyPositionIds : '',
          applyPositionNames: resumeRow.applyData.applyPositionNames ? resumeRow.applyData.applyPositionNames : '',
          applyAreaIds: resumeRow.applyData.applyAreaIds ? resumeRow.applyData.applyAreaIds : '',
          applyAreaNames: resumeRow.applyData.applyAreaNames ? resumeRow.applyData.applyAreaNames : '',
          applyIndustryIds: resumeRow.applyData.applyIndustryIds ? resumeRow.applyData.applyIndustryIds : '',
          applyIndustryNames: resumeRow.applyData.applyIndustryNames ? resumeRow.applyData.applyIndustryNames : ''
        });
      },
      fail: function () {
        that.setData({ errorHide: false, errorMsg: '缓存获取失败' });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;

    var indexPostion = getApp().data.dataNames.indexOf('applyPosition');
    var indexIndustry = getApp().data.dataNames.indexOf('applyIndustry');
    var indexArea = getApp().data.dataNames.indexOf('applyArea');
    this.setData({
      applyPositionIds: indexPostion != -1 ? getApp().data.selectData[indexPostion].ids : '',
      applyPositionNames: indexPostion != -1 ? getApp().data.selectData[indexPostion].names : '',
      applyIndustryIds: indexIndustry != -1 ? getApp().data.selectData[indexIndustry].ids : '',
      applyIndustryNames: indexIndustry != -1 ? getApp().data.selectData[indexIndustry].names : '',
      applyAreaIds: indexArea != -1 ? getApp().data.selectData[indexArea].ids : '',
      applyAreaNames: indexArea != -1 ? getApp().data.selectData[indexArea].names : ''
    });
  },
  onReady: function () {
    //设置标题
    swan.setNavigationBarTitle({ 'title': '求职意向' });
  },
  bindJoinTypeChange: function (e) {
    //职位类型
    var applyData = this.data.applyData;
    applyData.joinType = e.detail.value;
    this.setData({ applyData: applyData });
  },
  bindJobSeeking1Change: function (e) {
    var applyData = this.data.applyData;
    applyData.jobSeeking1 = e.detail.value;
    this.setData({ applyData: applyData });
  },
  bindJoinTimeChange: function (e) {
    //到岗时间
    var applyData = this.data.applyData;
    applyData.checkinDate = e.detail.value;
    this.setData({ applyData: applyData });
  },
  bindSalarysChange: function (e) {
    //期望月薪
    var applyData = this.data.applyData;
    applyData.salary = e.detail.value;
    this.setData({ applyData: applyData });
  },
  //提交数据
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    var salary = data.salary; //薪资id
    var applyAreaIds = data.applyAreaIds; //城市ids
    var applyAreaNames = data.applyAreaNames; //城市names
    var applyIndustryIds = data.applyIndustryIds; //行业ids
    var applyIndustryNames = data.applyIndustryNames; //行业names
    var applyPositionIds = data.applyPositionIds; //意向职位类型ids
    var applyPositionNames = data.applyPositionNames; //意向职位类型names
    var jobSeeking1 = data.jobSeeking1; //期望职位
    // var joinTime = data.joinTime;//到岗id
    var joinType = data.joinType; //职位类型id

    if (!applyPositionIds) {
      swan.showToast({ title: '请选择意向职位', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!jobSeeking1) {
      swan.showToast({ title: '请填写期望职位', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!applyAreaIds) {
      swan.showToast({ title: '请选择意向地区', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!joinType || joinType == 0) {
      swan.showToast({ title: '请选择职位类型', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!applyIndustryIds) {
      swan.showToast({ title: '请选择意向行业', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    // if(!joinTime || joinTime==0){
    //   wx.showToast({title:'请选择到岗时间', mask:true, icon:'success', duration:1000});
    //   return;
    // }
    if (!salary || salary == 0) {
      swan.showToast({ title: '请选择期望月薪', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    //提交
    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'join_save',
      resume_id: getApp().data.uid,
      txtJoinOffice: jobSeeking1,
      radJoinType: allData._joinType[joinType],
      hidJobSortExpect: applyPositionIds,
      hidCallingExpect: applyIndustryIds,
      hidCurAreaBasic: applyAreaIds,
      txtJoinSalary: allData._salarys[salary],
      // joinTime: joinTime,
      applyPositionNames: applyPositionNames,
      applyIndustryNames: applyIndustryNames,
      applyAreaNames: applyAreaNames
    };
    var func = function (res) {
      //提交成功
      if (res.data.status == 1) {
        //修改缓存
        var resumeRow = that.data.resumeRow;
        // newData._joinTime = allData.joinTime[joinTime];
        that.saveResumeRow(resumeRow, newData, that);
      }
    };
    util.isPost(newData, url, func);
  },
  //修改数据
  saveResumeRow: function (resumeRow, newData, that) {
    //新数据
    var applyData = {
      applyPositionIds: newData.hidJobSortExpect, //意向职位
      applyPositionNames: newData.applyPositionNames,
      applyAreaIds: newData.hidCurAreaBasic, //意向地区
      applyAreaNames: newData.applyAreaNames,
      applyIndustryIds: newData.hidCallingExpect, //意向行业
      applyIndustryNames: newData.applyIndustryNames,
      // checkinDate: newData.joinTime,//到职时间
      _joinTime: newData._joinTime,
      jobSeeking1: decodeURI(newData.txtJoinOffice), //意向职位
      salary: newData.txtJoinSalary, //薪资
      joinSalaryInfo: newData.txtJoinSalary + '及以上',
      otherRequirement: "", //其他要求
      joinType: newData.radJoinType //职位类型
    };
    resumeRow.applyData = applyData;
    // resumeRow.baseData.checkinDate = newData.joinTime;
    swan.setStorage({
      key: 'resumeRow' + getApp().data.uid,
      data: resumeRow,
      success: function (res) {
        swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          swan.navigateBack(); //返回
        }, 1000);
      },
      fail: function () {
        swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      }
    });
  },
  //关闭页面
  onUnload: function () {
    getApp().data.dataNames = [];
    getApp().data.selectData = [];
  }

});