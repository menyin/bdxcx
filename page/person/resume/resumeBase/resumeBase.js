var allData = require('../../../../config/data.js');
var util = require('../../../../config/global.js');
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    gender: allData.gender, //性别
    degree: allData.degree, //学历
    jobState: allData.jobState, //求职状态
    joinTime: allData.joinTime, //到岗时间
    political: allData.political, //政治面貌
    marriage: allData.marriage, //婚姻状况
    baseData: [], //基本信息数据
    timeNow: getApp().data.yearNow + '-' + getApp().data.monthNow
  },
  onLoad: function () {
    console.log(this.data);
    //体重
    var avoirdupois = ['请选择'];
    for (var i = 1; i <= 150; i++) {
      avoirdupois[i] = i + 'kg';
    }
    //身高
    var height = ['请选择'];
    for (var i = 1; i < 250; i++) {
      height[i] = i + 'cm';
    }
    this.setData({ avoirdupois: avoirdupois, height: height });

    var that = this;
    //获取简历信息
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        console.log(resumeRow);
        if (resumeRow) {
          //简历存在
          var baseData = resumeRow.baseData;
        } else {
          //简历不存在
          var baseData = {
            name: '', //姓名
            birthday: '', //生日
            sex: 0, //性别
            hometownPC: '', //户籍id
            hometownPCName: '', //户籍name
            degree: 0, //最高学历
            maxEduInfo: 0,
            workBeginDate: '', //开始工作时间
            jobState: 0, //工作状态
            locationPC: '', //现居id
            locationPCName: '', //现居name
            address: '', //详细地址
            height: 150, //身高
            avoirdupois: 50, //体重
            political: 0, //政治面貌
            marriage: 0, //婚姻状况
            marriageInfo: '',
            cardNum: '', //身份证
            mobile: '', //手机号码
            email: '', //邮箱
            qq: '', //qq
            checkinDate: '' //到职时间
          };
          resumeRow = {};
          resumeRow.baseData = baseData;
          getApp().data.isCreate = true; //标示第一次创建简历
        }

        var indexXianJu = getApp().data.dataNames.indexOf('resumeAreaXianJu');
        if (indexXianJu == -1) {
          //现居
          getApp().data.dataNames.push('resumeAreaXianJu');
          indexXianJu = getApp().data.dataNames.indexOf('resumeAreaXianJu');
          var resumeAreaXianJu = '';
          if (baseData.locationPC && baseData.locationPCName) {
            resumeAreaXianJu = { ids: baseData.locationPC, names: baseData.locationPCName, hasSelect: [{ id: baseData.locationPC, name: baseData.locationPCName }] };
          } else {
            resumeAreaXianJu = { ids: '', names: '', hasSelect: [] };
          }
          getApp().data.selectData[indexXianJu] = resumeAreaXianJu;
        }

        var indexHuJi = getApp().data.dataNames.indexOf('resumeAreaHJ');
        if (indexHuJi == -1) {
          //户籍
          getApp().data.dataNames.push('resumeAreaHJ');
          indexHuJi = getApp().data.dataNames.indexOf('resumeAreaHJ');
          var resumeAreaHJ = '';
          if (baseData.hometownPC && baseData.hometownPCName) {
            resumeAreaHJ = { ids: baseData.hometownPC, names: baseData.hometownPCName, hasSelect: [{ id: baseData.hometownPC, name: baseData.hometownPCName }] };
          } else {
            resumeAreaHJ = { ids: '', names: '', hasSelect: [] };
          }
          getApp().data.selectData[indexHuJi] = resumeAreaHJ;
        }

        baseData.degree = allData._degree.indexOf(parseInt(baseData.degree));
        that.setData({
          resumeRow: resumeRow,
          baseData: baseData,
          hometownPC: baseData.hometownPC ? baseData.hometownPC : '',
          hometownPCName: baseData.hometownPCName ? baseData.hometownPCName : '',
          locationPC: baseData.locationPC ? baseData.locationPC : '',
          locationPCName: baseData.locationPCName ? baseData.locationPCName : ''
        });
      },
      fail: function () {
        that.setData({ errorHide: false, errorMsg: '简历缓存获取失败' });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;

    var indexXianJu = getApp().data.dataNames.indexOf('resumeAreaXianJu');
    var indexHuJi = getApp().data.dataNames.indexOf('resumeAreaHJ');
    this.setData({
      hometownPC: indexHuJi != -1 ? getApp().data.selectData[indexHuJi].ids : '',
      hometownPCName: indexHuJi != -1 ? getApp().data.selectData[indexHuJi].names : '',
      locationPC: indexXianJu != -1 ? getApp().data.selectData[indexXianJu].ids : '',
      locationPCName: indexXianJu != -1 ? getApp().data.selectData[indexXianJu].names : ''
    });
  },
  onReady: function () {
    //浏览记录
    getApp().addLog("/page/person/resume/resumeBase/resumeBase");
  },
  bindNameChange: function (e) {
    //改变name值
    var baseData = this.data.baseData;
    baseData.name = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindAddressChange: function (e) {
    //改变详细地址值
    var baseData = this.data.baseData;
    baseData.address = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindCardNumChange: function (e) {
    //改变身份证值
    var baseData = this.data.baseData;
    baseData.cardNum = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindEmailChange: function (e) {
    //改变email值
    var baseData = this.data.baseData;
    baseData.email = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindQQChange: function (e) {
    //改变qq值
    var baseData = this.data.baseData;
    baseData.qq = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindGenderChange: function (e) {
    //选择性别
    var baseData = this.data.baseData;
    baseData.sex = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindBirthdayChange: function (e) {
    //选择生日
    var baseData = this.data.baseData;
    baseData.birthday = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindDegreeChange: function (e) {
    //选择学历
    var baseData = this.data.baseData;
    baseData.degree = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindStartWorkingChange: function (e) {
    //开始工作时间
    var baseData = this.data.baseData;
    baseData.workBeginDate = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindJobStateChange: function (e) {
    //求职状态
    var baseData = this.data.baseData;
    baseData.jobState = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindJoinTimeChange: function (e) {
    //到岗时间
    var baseData = this.data.baseData;
    baseData.checkinDate = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindHeightChange: function (e) {
    //身高
    var baseData = this.data.baseData;
    baseData.height = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindAvoirdupoisChange: function (e) {
    //体重
    var baseData = this.data.baseData;
    baseData.avoirdupois = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindPoliticalChange: function (e) {
    //政治面貌
    var baseData = this.data.baseData;
    baseData.political = e.detail.value;
    this.setData({ baseData: baseData });
  },
  bindMarriageChange: function (e) {
    //婚姻状况
    var baseData = this.data.baseData;
    baseData.marriage = e.detail.value;
    this.setData({ baseData: baseData });
  },
  //提交数据
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    var name = data.name; //姓名
    var address = data.address; //地址
    var height = data.height; //身高
    var avoirdupois = data.avoirdupois; //体重
    var birthday = data.birthday; //生日
    var cardNum = data.cardNum; //身份证
    var degree = data.degree; //学历
    var email = data.email; //邮箱
    var gender = data.gender; //性别
    var hometownPC = data.hometownPC; //户籍ids
    var hometownPCName = data.hometownPCName; //户籍names
    var jobState = data.jobState; //工作状态
    var locationPC = data.locationPC; //现居ids
    var locationPCName = data.locationPCName; //现居name
    var marriage = data.marriage; //婚姻状态
    var political = data.political; //政治面貌
    var qq = data.qq;
    var startWorking = data.startWorking; //开始工作时间
    var hidAccessionTime = data.joinTime; //到岗时间

    hometownPC = hometownPC.replace('d', '');
    locationPC = locationPC.replace('d', '');

    //验证数据
    if (!name) {
      swan.showToast({ title: '请填写姓名', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!birthday) {
      swan.showToast({ title: '请选择出生日期', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!gender || gender == 0) {
      swan.showToast({ title: '请选择性别', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!locationPC) {
      swan.showToast({ title: '请选择现居', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!degree || degree == 0) {
      swan.showToast({ title: '请选择最高学历', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!startWorking) {
      swan.showToast({ title: '请选择开始工作时间', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!jobState || jobState == 0) {
      swan.showToast({ title: '请选择求职状态', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!hometownPC) {
      swan.showToast({ title: '请选择户籍', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!height) {
      swan.showToast({ title: '请选择身高', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var baseData = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'resume_save',
      source: 1,
      resumeType: 1,
      rid: getApp().data.uid,
      txtUserName: name,
      radSex: gender,
      txtBirthday: birthday,
      hidCurArea: locationPC,
      locationPCName: locationPCName,
      txtAddress: address,
      hidMaxEdu: allData._degree[parseInt(degree)],
      hddStartWork: startWorking,
      hidApplyStatus: jobState,
      // txtIDCardNumber: cardNum,
      hidNativePlace: hometownPC,
      hometownPCName: hometownPCName,
      hidMarriage: marriage,
      hidPolitical: political,
      txtStature: height,
      txtAvoirdupois: avoirdupois,
      // hidMobilePhone:,
      // txtMobilePhone:,
      // txtValidateCode:,
      txtEmail: email,
      txtQQ: qq,
      hidAccessionTime: hidAccessionTime,
      degree: degree
    };
    var func = function (res) {
      if (res.data.status > 0) {
        //修改简历storage
        var resumeRow = that.data.resumeRow;
        if (!resumeRow.applyData) {
          //第一次创建简历
          getApp().getResumeRow(getApp().data.uid, getApp().data.SESSIONKEY);
          getApp().data.isCreate = false;
          swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 1000 });
          setTimeout(function () {
            swan.navigateBack(); //返回
          }, 1000);
        } else {
          resumeRow.baseData = {
            address: baseData.txtAddress,
            avoirdupois: baseData.txtAvoirdupois,
            birthday: baseData.txtBirthday,
            cardNum: baseData.txtIDCardNumber,
            degree: allData._degree[parseInt(baseData.degree)],
            maxEduInfo: allData.degree[baseData.degree],
            email: baseData.txtEmail,
            height: baseData.txtStature,
            hometownPC: baseData.hidNativePlace,
            hometownPCName: baseData.hometownPCName,
            jobState: baseData.hidApplyStatus,
            locationPC: baseData.hidCurArea,
            locationPCName: baseData.locationPCName,
            marriage: baseData.hidMarriage,
            marriageInfo: allData.marriage[baseData.hidMarriage],
            mobile: that.data.baseData.mobile,
            name: baseData.txtUserName,
            political: baseData.hidPolitical,
            qq: baseData.txtQQ,
            sex: parseInt(baseData.radSex),
            workBeginDate: baseData.hddStartWork,
            checkinDate: baseData.hidAccessionTime
          };
          swan.setStorage({
            key: 'resumeRow' + getApp().data.uid,
            data: resumeRow,
            success: function () {
              swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 1000 });

              setTimeout(function () {
                swan.navigateBack(); //返回
              }, 1000);
            },
            fail: function () {
              swan.showToast({ title: '修改简历缓存错误', mask: true, icon: 'success', duration: 1000 });
            }
          });
        }

        return;
      }
      var errMsg = res.data.error ? res.data.error : res.data.msg;
      swan.showToast({ title: errMsg ? errMsg : '提交失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(baseData, url, func);
  },
  //关闭页面
  onUnload: function () {
    getApp().data.dataNames = [];
    getApp().data.selectData = [];
  }
});