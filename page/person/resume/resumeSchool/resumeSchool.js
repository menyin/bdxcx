var util = require("../../../../config/global.js");
Page({
  data: {
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var that = this;
    var PracticeDetail1 = options.PracticeDetail1;

    //获取简历缓存
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          //修改
          var schoolRow = resumeRow.practiceListInfo[index];
          if (schoolRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              practiceid: schoolRow.practiceid,
              PracticeName: schoolRow.PracticeName, //名称
              startDate: schoolRow._PracticeTimeStart, //开始时间
              endDate: schoolRow._PracticeTimeEnd ? schoolRow._PracticeTimeEnd : '', //结束时间
              PracticeDetail: schoolRow.PracticeDetail, //详细情况
              PracticeDetail1: PracticeDetail1 //详细情况(textarea暂时解决方案)
            });
            return;
          }
          swan.showToast({ title: '获取培训信息失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        //新增
        that.setData({
          index: -99,
          resumeRow: resumeRow,
          practiceid: '',
          PracticeName: '', //名称
          startDate: '', //开始时间
          endDate: '', //结束时间
          PracticeDetail: '', //详细情况
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
    //设置标题
    swan.setNavigationBarTitle({ 'title': '实践经历' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeSchool/resumeSchool");
  },
  bindStartDateChange: function (e) {
    //开始时间
    this.setData({ startDate: e.detail.value });
  },
  bindEndDateChange: function (e) {
    //结束时间
    this.setData({ endDate: e.detail.value });
  },
  //提交数据
  formSubmit: function (e) {
    var that = this;
    var PracticeDetail = e.detail.value.PracticeDetail;
    var PracticeName = e.detail.value.PracticeName;
    var endDate = e.detail.value.endDate;
    var startDate = e.detail.value.startDate;

    //验证
    if (!PracticeName) {
      swan.showToast({ title: '请填写实践名称', mask: true, icon: 'success', duration: 1000 });
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
    if (!PracticeDetail) {
      swan.showToast({ title: '请填写详细介绍', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'practice_save',
      practice_id: this.data.practiceid,
      txtPracticeName: PracticeName,
      ymStartTime1955582: startDate,
      ymEndTime1955582: endDate,
      taPracticeDetail: PracticeDetail
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        //修改本地简历信息
        newData.practice_id = res.data.practice_id;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改实践经历失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var practiceRow = {
      PracticeDetail: decodeURI(newData.taPracticeDetail),
      PracticeName: decodeURI(newData.txtPracticeName),
      _PracticeTimeEnd: newData.ymEndTime1955582 ? newData.ymEndTime1955582 : '',
      _PracticeTimeStart: newData.ymStartTime1955582,
      practiceid: newData.practice_id,
      rid: getApp().data.uid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.practiceListInfo.push(practiceRow);
    } else {
      //修改
      resumeRow.practiceListInfo[index] = practiceRow;
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
      title: '删除实践经历',
      content: '您确定要删除当前实践经历',
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
    if (!resumeRow.practiceListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'practice_del',
      practice_id: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.practiceListInfo.splice(index, 1);
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