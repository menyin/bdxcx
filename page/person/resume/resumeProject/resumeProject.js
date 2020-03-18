var util = require("../../../../config/global.js");
Page({
  data: {
    // text:"这是一个页面"
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var projectExperience1 = options.projectExperience1;
    var that = this;

    //获取简历缓存
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          var projectRow = resumeRow.projectListInfo[index];
          if (projectRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              projectid: projectRow.projectid, //id
              projectName: projectRow.projectName, //项目名称
              startDate: projectRow.projectStart, //开始时间
              endDate: projectRow.projectEnd ? projectRow.projectEnd : '', //结束时间
              projectDuty: projectRow.projectDuty, //担任职务
              projectIntr: projectRow.projectIntr, //项目介绍
              projectExperience: projectRow.projectExperience, //项目经验
              projectExperience1: projectExperience1 //项目经验(textarea暂时解决方案)
            });
            return;
          }
          swan.showToast({ title: '获取培训信息失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        //添加
        that.setData({
          index: -99,
          resumeRow: resumeRow,
          projectName: '', //项目名称
          startDate: '', //开始时间
          endDate: '', //结束时间
          projectDuty: '', //担任职务
          projectIntr: '', //项目介绍
          projectExperience: '', //项目经验
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
  },
  onReady: function () {
    // 页面渲染完成
    swan.setNavigationBarTitle({ 'title': '项目经验' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeProject/resumeProject");
  },
  bindStartDateChange: function (e) {
    //开始时间
    this.setData({ startDate: e.detail.value });
  },
  bindEndDateChange: function (e) {
    //开始时间
    this.setData({ endDate: e.detail.value });
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var endDate = e.detail.value.endDate;
    var projectDuty = e.detail.value.projectDuty; //担任职务
    var projectIntr = e.detail.value.projectIntr; //项目介绍
    var projectName = e.detail.value.projectName; //项目名称
    var startDate = e.detail.value.startDate;
    var projectExperience = e.detail.value.projectExperience; //项目经验

    //验证
    if (!projectName) {
      swan.showToast({ title: '请填写项目名称', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!startDate) {
      swan.showToast({ title: '请选择开始时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!endDate) {
      swan.showToast({ title: '请选择结束时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!projectDuty) {
      swan.showToast({ title: '请填写担任职务', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!projectIntr) {
      swan.showToast({ title: '请填写项目介绍', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!projectExperience) {
      swan.showToast({ title: '请填写项目经验', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'project_save',
      project_id: this.data.projectid,
      txtProjectName: projectName,
      projectStartTime: startDate,
      projectEndTime: endDate ? endDate : '',
      txtDuty: projectDuty,
      taProjectIntr: projectIntr,
      taProjectExperience: projectExperience
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        //修改本地简历信息
        newData.project_id = res.data.project_id;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改实践经历失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var projectRow = {
      projectDuty: decodeURI(newData.txtDuty),
      projectEnd: newData.projectEndTime,
      projectExperience: decodeURI(newData.taProjectExperience),
      projectIntr: decodeURI(newData.taProjectIntr),
      projectName: decodeURI(newData.txtProjectName),
      projectStart: newData.projectStartTime,
      projectid: newData.project_id,
      rid: getApp().data.uid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.projectListInfo.push(projectRow);
    } else {
      //修改
      resumeRow.projectListInfo[index] = projectRow;
    }
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
  //是否要删除？
  canDel: function (e) {
    var that = this;
    swan.showModal({
      title: '删除项目经验',
      content: '您确定要删除当前项目经验',
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
    if (!resumeRow.projectListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'project_del',
      project_id: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.projectListInfo.splice(index, 1);
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
  }
});