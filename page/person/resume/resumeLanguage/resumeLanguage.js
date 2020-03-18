var allData = require('../../../../config/data.js');
var util = require('../../../../config/global.js');
Page({
  data: {
    lanType: allData.lanType, //语种
    level: allData.level //熟练程度
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var that = this;

    //获取简历缓存
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          //修改
          var langRow = resumeRow.languageListInfo[index];
          if (langRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              languageid: langRow.languageid,
              langCert: langRow.langCert, //获得证书
              langSkillLevel: allData._level.indexOf(langRow.langSkillLevel), //熟练程度
              languageType: allData._lanType.indexOf(langRow.languageType) //语种
            });
            return;
          }
          swan.showToast({ title: '获取培训信息失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        //新增
        that.setData({
          index: -99,
          languageid: '',
          resumeRow: resumeRow,
          langCert: '',
          langSkillLevel: '',
          languageType: '',
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
    swan.setNavigationBarTitle({ 'title': '语言能力' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeLanguage/resumeLanguage");
  },
  bindLanTypeChange: function (e) {
    //语种
    this.setData({ languageType: e.detail.value });
  },
  bindLevelChange: function (e) {
    //熟练程度
    this.setData({ langSkillLevel: e.detail.value });
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var lanCert = e.detail.value.lanCert;
    var lanType = e.detail.value.lanType;
    var level = e.detail.value.level;

    //验证数据
    if (!lanType || lanType == 0) {
      swan.showToast({ title: '请选择语种', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!level || level == 0) {
      swan.showToast({ title: '请熟练程度', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!lanCert) {
      swan.showToast({ title: '请填写获得证书', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/m_person.api';
    var newData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'language_save',
      languageid: this.data.languageid,
      selLanguageType: allData._lanType[parseInt(lanType)],
      selLangSkillLevel: allData._level[parseInt(level)],
      selLangCert: lanCert,
      level: level,
      lanType: lanType
    };
    var func = function (res) {
      if (res.data.success == 'success') {
        var resumeRow = that.data.resumeRow;
        newData.languageid = res.data.langid;
        newData.langSkillLevelInfo = allData.level[parseInt(newData.level)], newData.languageTypeInfo = allData.lanType[parseInt(newData.lanType)], that.saveResumeRow(resumeRow, newData, that);
      }
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {

    var langRow = {
      langCert: decodeURI(newData.selLangCert),
      langSkillLevel: newData.selLangSkillLevel,
      langSkillLevelInfo: newData.langSkillLevelInfo,
      languageName: newData.languageTypeInfo,
      languageType: newData.selLanguageType,
      languageTypeInfo: newData.languageTypeInfo,
      languageid: newData.languageid,
      rid: getApp().data.uid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.languageListInfo.push(langRow);
    } else {
      //修改
      resumeRow.languageListInfo[index] = langRow;
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
      title: '删除语言能力',
      content: '您确定要删除当前语言能力',
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
    if (!resumeRow.languageListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/m_person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'del_Language',
      languageid: id,
      to_m: true
    };
    var func = function (res) {
      if (res.data.success == 'success') {
        var resumeRow = that.data.resumeRow;
        resumeRow.languageListInfo.splice(index, 1);
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