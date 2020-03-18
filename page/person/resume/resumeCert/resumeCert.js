var util = require('../../../../config/global.js');
Page({
  data: {
    // text:"这是一个页面"
    timeNow: getApp().data.yearNow
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
          var certRow = resumeRow.certificateListInfo[index];
          if (certRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              CertGainTimeYear: certRow.CertGainTimeYear, //年限
              certificateName: certRow.certificateName, //名称
              certificateid: certRow.certificateid
            });
            return;
          }
          swan.showToast({ title: '获取证书信息失败', mask: true, icon: 'success', duration: 1000 });
          return;
        }
        that.setData({
          index: -99,
          certificateid: '',
          CertGainTimeYear: '', //年限
          certificateName: '', //名称
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
    swan.setNavigationBarTitle({ 'title': '证书' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeCert/resumeCert");
  },
  bindGainTimeChange: function (e) {
    //获得时间
    console.log(e);
    this.setData({ CertGainTimeYear: e.detail.value });
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var certName = e.detail.value.certName; //证书
    var gainTime = e.detail.value.gainTime; //获得时间

    //验证数据
    if (!certName) {
      swan.showToast({ title: '请填写证书', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!gainTime) {
      swan.showToast({ title: '请选择获得时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/m_person.api';
    var newData = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'certificate_save',
      certificateid: this.data.certificateid,
      txtCertificateName: certName,
      gain_time: gainTime
    };
    var func = function (res) {
      if (res.data.success == 'success') {
        var resumeRow = that.data.resumeRow;
        //修改本地简历信息
        newData.certificateid = res.data.certificateid;
        that.saveResumeRow(resumeRow, newData, that);
        return;
      }
      swan.showToast({ title: '修改证书失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var certRow = {
      CertGainTimeYear: newData.gain_time,
      certificateName: decodeURI(newData.txtCertificateName),
      certificateid: newData.certificateid,
      rid: getApp().data.uid
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.certificateListInfo.push(certRow);
    } else {
      //修改
      resumeRow.certificateListInfo[index] = certRow;
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
      title: '删除证书',
      content: '您确定要删除当前证书',
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
    if (!resumeRow.certificateListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    //删除
    var url = getApp().data.API_URL + '/web/m_person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'certificate_del',
      certificateid: id
    };
    var func = function (res) {
      if (res.data.success == 'success') {
        var resumeRow = that.data.resumeRow;
        resumeRow.certificateListInfo.splice(index, 1);
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