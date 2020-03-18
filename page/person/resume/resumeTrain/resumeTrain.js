var util = require("../../../../config/global.js");
Page({
  data: {
    // text:"这是一个页面"
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var trainDetail1 = options.trainDetail1;
    var that = this;

    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          //修改
          var trainRow = resumeRow.trainingListInfo[index];
          if (trainRow) {
            console.log(trainRow.trainDetail);
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              trainDetail: trainRow.trainDetail, //专业课程
              trainingBackGround: trainRow.trainingBackGround, //获得证书
              endDate: trainRow.trainingEndDate, //结束时间
              startDate: trainRow.trainingStartDate, //开始时间
              trainingName: trainRow.trainingName, //名称
              trainingSpecialty: trainRow.trainingSpecialty, //培训项目
              trainingid: trainRow.trainingid,
              trainDetail1: trainDetail1 //培训项目(textarea暂时解决方案)
            });
            return;
          }
          swan.showToast({ title: '获取培训信息失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        that.setData({
          index: -99,
          trainingid: '',
          resumeRow: resumeRow,
          trainDetail: '', //专业课程
          trainingBackGround: '', //获得证书
          endDate: '', //结束时间
          startDate: '', //开始时间
          trainingName: '', //名称
          trainingSpecialty: '', //培训项目
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
    swan.setNavigationBarTitle({ 'title': '培训经历' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeTrain/resumeTrain");
  },
  bindStartDateChange: function (e) {
    //入学时间
    this.setData({ startDate: e.detail.value });
  },
  bindEndDateChange: function (e) {
    //毕业时间
    this.setData({ endDate: e.detail.value });
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var endDate = e.detail.value.endDate;
    var startDate = e.detail.value.startDate;
    var trainDetail = e.detail.value.trainDetail; //专业课程
    var trainingBackGround = e.detail.value.trainingBackGround; //获得证书
    var trainingName = e.detail.value.trainingName; //名称
    var trainingSpecialty = e.detail.value.trainingSpecialty; //培训项目

    //验证数据
    if (!trainingName) {
      swan.showToast({ title: '请填写机构名称', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!startDate) {
      swan.showToast({ title: '请选择入学时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!endDate) {
      swan.showToast({ title: '请选择毕业时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!trainingSpecialty) {
      swan.showToast({ title: '请填写培训项目', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!trainingBackGround) {
      swan.showToast({ title: '请填写获得证书', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!trainDetail) {
      swan.showToast({ title: '请填写专业课程', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'training_save',
      trainingid: this.data.trainingid,
      ymStartTime1955582: startDate,
      ymEndTime1955582: endDate ? endDate : '',
      txtTrainingName: trainingName,
      txtTrainingSpecialty: trainingSpecialty,
      txtTrainingBackGround: trainingBackGround,
      taTrainDetail: trainDetail
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        //修改本地简历信息
        newData.trainingid = res.data.trainingid;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改培训经历失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var trainRow = {
      rid: getApp().data.uid,
      trainDetail: decodeURI(newData.taTrainDetail),
      trainingBackGround: decodeURI(newData.txtTrainingBackGround),
      trainingName: decodeURI(newData.txtTrainingName),
      trainingSpecialty: decodeURI(newData.txtTrainingSpecialty),
      trainingStartDate: newData.ymStartTime1955582,
      trainingEndDate: newData.ymEndTime1955582,
      trainingid: newData.trainingid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.trainingListInfo.push(trainRow);
    } else {
      //修改
      resumeRow.trainingListInfo[index] = trainRow;
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
      title: '删除培训经历',
      content: '您确定要删除当前培训经历',
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
    if (!resumeRow.trainingListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'training_del',
      trainingid: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.trainingListInfo.splice(index, 1);
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