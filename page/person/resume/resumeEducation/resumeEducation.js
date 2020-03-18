var allData = require('../../../../config/data.js');
var util = require('../../../../config/global.js');
Page({
  data: {
    index: '',
    eduid: '',
    degree: allData.degree,
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = parseInt(options.id); //数据id
    var index = options.index ? parseInt(options.index) : ''; //数据下标
    var that = this;

    //获取简历缓存数据
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data; //简历信息
        if (id) {
          //修改
          var eduRow = resumeRow.eduListInfo[index];
          if (eduRow) {
            that.setData({
              resumeRow: resumeRow,
              index: index,
              delShow: true,
              btnStyle: '',
              eduName: eduRow.eduName,
              eduSpecialty: eduRow.eduSpecialty,
              eduid: eduRow.eduid,
              degreeIndex: allData._degree.indexOf(parseInt(eduRow.eduBackGround)), //学历
              startData: eduRow.eduStartDate, //入学时间
              endData: eduRow.eduEndDate //毕业时间
            });
            return;
          }
          swan.showToast({ title: '学历信息获取失败', mask: true, icon: 'success', duration: 1000 });
        } else {
          //添加
          that.setData({
            index: -99,
            resumeRow: resumeRow,
            eduName: '',
            eduSpecialty: '',
            eduid: '',
            degreeIndex: '', //学历
            startData: '', //入学时间
            endData: '', //毕业时间
            delShow: false,
            btnStyle: 'width:100%'
          });
        }
      },
      fail: function () {
        swan.showToast({ title: '简历缓存获取失败', mask: true, icon: 'success', duration: 1000 });
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
    swan.setNavigationBarTitle({ 'title': '教育经历' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeEducation/resumeEducation");
  },
  bindDegreeChange: function (e) {
    //选择学历
    this.setData({ degreeIndex: e.detail.value });
  },
  bindStartDateChange: function (e) {
    //选择入学时间
    this.setData({ startData: e.detail.value });
  },
  bindEndDateChange: function (e) {
    //选择毕业时间
    this.setData({ endData: e.detail.value });
  },
  //提交数据
  formSubmit: function (e) {
    var that = this;
    var school = e.detail.value.school; //名称
    var degree = allData._degree[parseInt(e.detail.value.degree)]; //学历
    var endData = e.detail.value.endData; //结束时间
    var speciality = e.detail.value.speciality; //专业
    var startData = e.detail.value.startData; //开始时间

    //验证数据
    if (!school) {
      swan.showToast({ title: '请填写学校名称', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!speciality) {
      swan.showToast({ title: '请填写专业', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!degree || degree == 0) {
      swan.showToast({ title: '请选择学历', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!startData) {
      swan.showToast({ title: '请选择入学时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!endData) {
      swan.showToast({ title: '请选择毕业时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'edu_save',
      eduid: this.data.eduid,
      txtEduName: school,
      ymStartTime1955582: startData,
      ymEndTime1955582: endData,
      selEduBackGround: degree,
      txtEduSpecialty: speciality,
      degree: e.detail.value.degree
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;

        //修改本地简历信息
        newData.eduBackGroundInfo = allData.degree[newData.degree]; //学历name
        newData.eduid = res.data.eduid;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改教育经历失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var eduRow = {
      eduBackGround: newData.selEduBackGround,
      eduBackGroundInfo: decodeURI(newData.eduBackGroundInfo),
      // eduDateEnd:"2015-01-01",
      // eduDateStart:"2013-01-01",
      // eduDetail:"阿萨德",
      eduEndDate: newData.ymEndTime1955582,
      eduName: decodeURI(newData.txtEduName),
      eduSpecialty: decodeURI(newData.txtEduSpecialty),
      eduStartDate: newData.ymStartTime1955582,
      eduid: newData.eduid,
      rid: getApp().data.uid
    };

    var index = this.data.index;
    if (index == -99) {
      //新增
      resumeRow.eduListInfo.push(eduRow);
    } else {
      //修改
      resumeRow.eduListInfo[index] = eduRow;
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
      title: '删除教育经历',
      content: '您确定要删除当前教育经历',
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
    if (!resumeRow.eduListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'edu_del',
      eduid: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.eduListInfo.splice(index, 1);
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