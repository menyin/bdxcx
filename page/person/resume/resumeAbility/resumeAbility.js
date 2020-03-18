var allData = require('../../../../config/data.js');
var util = require('../../../../config/global.js');
Page({
  data: {
    level: allData.level //熟练程度
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var that = this;

    //获取简历信息
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          //修改
          var skillRow = resumeRow.skillListInfo[index];
          if (skillRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              skillid: skillRow.skillid,
              SkillLevel: allData._lanType.indexOf(skillRow.SkillLevel), //熟练程度
              SkillName: skillRow.SkillName //名称
            });
            return;
          }
          swan.showToast({ title: '获取技能特长失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        that.setData({
          index: -99,
          skillid: '',
          SkillLevel: '', //熟练程度
          SkillName: '', //名称
          resumeRow: resumeRow,
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
    swan.setNavigationBarTitle({ 'title': '技能特长' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeAbility/resumeAbility");
  },
  bindLevelChange: function (e) {
    //熟练程度
    this.setData({ SkillLevel: e.detail.value });
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    var SkillName = e.detail.value.SkillName;
    var level = e.detail.value.level;

    //验证数据
    if (!SkillName) {
      swan.showToast({ title: '请填写技能名称', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!level || level == 0) {
      swan.showToast({ title: '请选择熟练程度', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/m_person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'skill_save',
      skillid: this.data.skillid,
      txtSkillName: SkillName,
      hidSkillLevel: allData._level[parseInt(level)],
      level: level
    };
    var func = function (res) {
      if (res.data.success == 'success') {
        //修改本地简历信息
        var resumeRow = that.data.resumeRow;
        newData.skillid = res.data.skillid;
        newData.SkillLevelInfo = allData.level[parseInt(newData.level)];
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改技能特长失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var skillRow = {
      SkillLevel: newData.hidSkillLevel,
      SkillLevelInfo: newData.SkillLevelInfo,
      SkillName: decodeURI(newData.txtSkillName),
      skillid: newData.skillid,
      rid: getApp().data.uid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.skillListInfo.push(skillRow);
    } else {
      //修改
      resumeRow.skillListInfo[index] = skillRow;
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
      title: '删除技能特长',
      content: '您确定要删除当前技能特长',
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
    if (!resumeRow.skillListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/m_person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'del_skill',
      skillid: id
    };
    var func = function (res) {
      if (res.data.success = 'success') {
        var resumeRow = that.data.resumeRow;
        resumeRow.skillListInfo.splice(index, 1);
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