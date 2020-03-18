var loginFunction = require('../../loginTemplate/loginTemplate.js');
var util = require("../../../config/global.js");
Page({
  data: {
    ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
    Phone400: getApp().data.Phone400, //400电话
    copyRight: getApp().data.copyRight, //版权
    userName: "", //用户名
    email: "", //邮箱
    phone: "", //手机号码
    userPhoto: 'https://cdn.597.com/wx/images/personal_ico.png',
    errorFlag: true, //错误提示
    errorMeg: "", //错误提示
    maskFlag: true, //遮罩层状态
    changeNameFlag: true, //修改用户名弹窗显示状态
    changePwdFlag: true, //修改密码弹窗显示状态
    changeMailFlag: true, //修改邮箱弹窗显示状态
    changePhoneFlag: true, //修改手机号码弹窗显示状态
    // codeUrl: getApp().data.API_URL+'/web/authCode.api?key=updEmail',//验证码链接
    sendCodeTitle: '获取验证码',
    sendCodeFlag: false,
    changePhone: '',
    loginData: loginFunction.loginData,
    nullVal: '',
    nickname: ''
  },
  onLoad: function (options) {},
  onShow: function () {
    //微信公众菜单特别处理
    var tempBase = getApp().data.tempBase;
    var uid = getApp().data.uid;
    if (!uid && tempBase && tempBase.scene == 1035) {
      getApp().getUserLogion();
    }

    var that = this;
    that.setData({
      uid: uid,
      nickname: getApp().data.nickname,
      wxUserInfo: getApp().data.wxUserInfo
    });
    console.log(getApp().data.nickname);

    that.getInfo();
  },
  onReady: function () {
    //浏览记录
    getApp().addLog("/page/person/index/index");
  },
  //获取页面所需数据
  getInfo: function () {
    var that = this;
    //获取简历信息
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        that.setData({
          resumeRow: res.data,
          userPhoto: res.data.attachment ? res.data.attachment : that.data.userPhoto
        });
      }
    });

    //获取面试邀请数量...
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getApplyManage'
    };
    var func = function (res) {
      that.setData({ applyCount: res.data });
    };
    util.isPost(data, url, func);

    //获取用户信息
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'getUserInfo'
    };
    var func = function (res) {
      that.setData({
        userName: res.data.username ? res.data.username : '',
        email: res.data.email ? res.data.email : '',
        phone: res.data.mobile ? res.data.mobile : '',
        changePhone: res.data.mobile ? res.data.mobile : ''
      });
    };
    util.isPost(data, url, func);
  },
  showChangeName: function () {
    //显示修改用户名弹窗
    this.setData({
      maskFlag: false,
      changeNameFlag: false
    });
  },
  showChangePwd: function () {
    //显示修改密码弹窗
    this.setData({
      maskFlag: false,
      changePwdFlag: false
    });
  },
  showChangeMail: function () {
    //显示修改邮箱弹窗
    this.setData({
      maskFlag: false,
      changeMailFlag: false
    });
  },
  showChangePhone: function () {
    //显示修改手机号码弹窗
    this.setData({
      maskFlag: false,
      changePhoneFlag: false
    });
  },
  hideAll: function () {
    //隐藏所有弹出框
    this.setData({
      changePhone: this.data.phone,
      maskFlag: true,
      changeNameFlag: true,
      changePwdFlag: true,
      changeMailFlag: true,
      changePhoneFlag: true,
      errorFlag: true
    });
  },
  //提交修改用户名
  submitChangeName: function (e) {
    var that = this;
    var pwdLogin = e.detail.value.pwdLogin;
    var userName = e.detail.value.userName;
    if (!pwdLogin) {
      this.setData({ errorMeg: "请填写登录密码", errorFlag: false });
      return;
    }
    if (!userName) {
      this.setData({ errorMeg: "请填写用户名", errorFlag: false });
      return;
    }
    if (userName == this.data.userName) {
      this.setData({ errorMeg: "修改的用户名不能和原本的一样", errorFlag: false });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'modUserInfo',
      loginPassword: pwdLogin,
      newUsername: userName,
      'type': 'uname'
    };
    var func = function (res) {
      if (res.data.status > 0) {
        that.setData({
          fromWx: getApp().data.fromWx,
          SESSIONKEY: getApp().data.SESSIONKEY,
          userName: userName,
          maskFlag: true,
          changeNameFlag: true,
          errorFlag: true,
          nullVal: ''
        });
        swan.showToast({ title: '修改成功', icon: 'success', mask: 'true', duration: 1000 });
        return;
      }
      that.setData({ errorMeg: res.data.msg ? res.data.msg : '修改用户名失败', errorFlag: false });
    };
    util.isPost(data, url, func);
  },
  //提交修改密码
  submitChangepwd: function (e) {
    var that = this;
    var oldpwd = e.detail.value.oldpwd;
    var newpwd = e.detail.value.newpwd;
    var confirmpwd = e.detail.value.confirmpwd;
    if (!oldpwd) {
      this.setData({ errorMeg: "原密码不能为空", errorFlag: false });
      return;
    }
    if (!newpwd) {
      this.setData({ errorMeg: "新密码不能为空", errorFlag: false });
      return;
    }
    if (!confirmpwd) {
      this.setData({ errorMeg: "确认密码不能为空", errorFlag: false });
      return;
    }
    if (confirmpwd != newpwd) {
      this.setData({ errorMeg: "新密码和确认密码不一致", errorFlag: false });
      return;
    }

    //提交
    var url = getApp().data.API_URL + '/web/user.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'psw',
      txtOldPwd: oldpwd,
      txtNewPwd: newpwd,
      txtRepeatPwd: confirmpwd
    };
    var func = function (res) {
      if (res.data.status > 0) {
        that.setData({
          maskFlag: true,
          changePwdFlag: true,
          errorFlag: true,
          uid: 0,
          nullVal: ''
        });
        //密码变了，salt就变了， token也就变了 所有要重新登录
        getApp().data.uid = 0;
        getApp().data.token = '';
        getApp().data.SESSIONKEY = '', swan.showToast({ title: '您修改了密码，需重新登录', mask: 'true', icon: 'success', duration: 2000 });
        return;
      }
      that.setData({ errorMeg: res.data.error ? res.data.error : '修改密码失败', errorFlag: false });
    };
    util.isPost(data, url, func);
  },
  //提交修改邮箱
  submitChangeMail: function (e) {
    var that = this;
    var email = e.detail.value.email;
    var yzm = e.detail.value.yzm;
    var pwd = e.detail.value.pwd;
    if (!email) {
      this.setData({ errorMeg: "邮箱不能为空", errorFlag: false });
      return;
    }
    if (!pwd) {
      this.setData({ errorMeg: "登录密码不能为空", errorFlag: false });
      return;
    }

    //用登录密码 修改邮箱
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'usePwdUpEmail',
      pwd: pwd,
      email: email
    };
    var func = function (res) {
      if (res.data.status > 0) {
        that.setData({
          email: email,
          maskFlag: true,
          changeMailFlag: true,
          errorFlag: true,
          nullVal: ''
        });
        swan.showToast({ title: '修改成功', icon: 'success', mask: 'true', duration: 1000 });

        //修改缓存数据
        var resumeRow = that.data.resumeRow;
        if (resumeRow.baseData) {
          resumeRow.baseData.email = email;
          swan.setStorage({
            key: 'resumeRow' + getApp().data.uid,
            data: resumeRow
          });
        }
        return;
      }
      that.setData({ errorMeg: res.data.msg ? res.data.msg : '修改邮箱失败', errorFlag: false });
    };
    util.isPost(data, url, func);
  },
  //提交修改电话
  submitChangePhone: function (e) {
    var that = this;
    var mobile = e.detail.value.mobile;
    var mobileZym = e.detail.value.mobileZym;
    if (!mobile) {
      this.setData({ errorMeg: "手机号码不能为空", errorFlag: false });
      return;
    }
    if (!mobile || mobile.length != 11) {
      this.setData({ errorMeg: "手机号码必须为11位", errorFlag: false });
      return;
    }
    if (!mobileZym) {
      this.setData({ errorMeg: "手机验证码不能为空", errorFlag: false });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'modUserInfo',
      txtMobile: mobile,
      txtValidateCode: mobileZym,
      'type': 'mobile'
    };
    var func = function (res) {
      if (res.data.status > 0) {
        that.setData({
          phone: mobile,
          changePhone: mobile,
          maskFlag: true,
          changePhoneFlag: true,
          errorFlag: true,
          nullVal: ''
        });
        swan.showToast({ title: '修改成功', icon: 'success', mask: 'true', duration: 1000 });

        //修改缓存数据
        var resumeRow = that.data.resumeRow;
        if (resumeRow.baseData) {
          resumeRow.baseData.mobile = mobile;
          swan.setStorage({
            key: 'resumeRow' + getApp().data.uid,
            data: resumeRow
          });
        }
        return;
      }
      that.setData({ errorMeg: res.data.msg ? res.data.msg : '修改失败', errorFlag: false });
    };
    util.isPost(data, url, func);
  },
  //变更验证码
  changeCode: function () {
    this.setData({ codeUrl: getApp().data.API_URL + '/web/authCode.api?key=updEmail&a=' + Math.random() });
  },
  changeIndexMobile: function (e) {
    this.setData({ changePhone: e.detail.value });
  },
  //获取验证码
  getIndexCode: function (e) {
    var that = this;
    var mobile = e.target.dataset.mobile;
    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '请填写正确的手机号码', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/user.api';
    var data = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'mobileCheck',
      _txtMobile: mobile
    };
    var func = function (res) {
      var data = res.data;
      if (data.status <= 0) {
        //获取失败
        swan.showToast({ title: data.msg, icon: 'succes', mask: 'true', ducation: 1000 });
        return;
      }
      swan.showToast({ title: "验证码已发送！", icon: 'succes', mask: 'true', ducation: 1000 });
      //获取成功 再次获取倒计时
      var phoneTime = 180;
      var inta = setInterval(function () {
        if (phoneTime <= 0) {
          that.setData({ sendCodeTitle: '再次获取验证码', sendCodeFlag: false });
          clearInterval(inta);
        } else {
          that.setData({ sendCodeTitle: phoneTime + '秒后重新获取', sendCodeFlag: true });
        }
        phoneTime--;
      }, 1000);
    };
    util.isPost(data, url, func);
  },
  //退出
  logout: function () {
    var that = this;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      wxuid: getApp().data.wxuid,
      act: 'unbind'
    };
    var func = function (res) {
      if (res.data.status <= 0) {
        swan.showToast({ title: res.data.msg ? res.data.msg : '解绑失败', icon: 'success', mask: 'true', duration: 1000 });
        return;
      }
      getApp().data.token = '';
      getApp().data.uid = '';
      getApp().data.SESSIONKEY = '';
      that.setData({ uid: 0 });
      swan.switchTab({
        url: '/page/index/index'
      });
    };
    util.isPost(data, url, func);
  },
  //登录function
  //切换注册、登录
  changeLoginReg: function () {
    var loginData = this.data.loginData;
    loginData.isUser = !loginData.isUser;
    this.setData({ loginData: loginData });
  },
  //改变电话号码
  changeMobile: function (e) {
    var loginData = this.data.loginData;
    loginData.mobile = e.detail.value;
    this.setData({ loginData: loginData });
  },
  //获取验证码
  getCode: function (e) {
    var that = this;
    var mobile = e.target.dataset.mobile;
    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '请填写正确的手机号码', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/user.api';
    var data = {
      act: 'mobile_check_reg',
      type: 'reg',
      _txtMobile: mobile
    };
    var func = function (res) {
      var data = res.data;
      if (data.status <= 0) {
        //获取失败
        swan.showToast({ title: data.msg, icon: 'succes', mask: 'true', ducation: 1000 });
        return;
      }
      swan.showToast({ title: "验证码已发送！", icon: 'succes', mask: 'true', ducation: 1000 });
      //获取成功 再次获取倒计时
      var phoneTime = 180;
      var inta = setInterval(function () {
        if (phoneTime <= 0) {
          var loginData = that.data.loginData;
          loginData.sendCodeTitle = '再次获取验证码';
          loginData.sendCodeFlag = false;
          that.setData({ loginData: loginData });
          clearInterval(inta);
        } else {
          var loginData = that.data.loginData;
          loginData.sendCodeTitle = phoneTime + '秒后可重新获取';
          loginData.sendCodeFlag = true;
          that.setData({ loginData: loginData });
        }
        phoneTime--;
      }, 1000);
    };
    util.isGet(data, url, func);
  },
  //提交注册
  formReg: function (e) {
    var that = this;
    var mobile = e.detail.value.mobile; //手机号码
    var mobileZym = e.detail.value.mobileZym; //验证码
    var password = e.detail.value.password; //密码

    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '请填写正确的手机号码', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }
    if (mobileZym.length <= 0) {
      swan.showToast({ title: '请填写正确的验证码', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }
    if (password.length < 6) {
      swan.showToast({ title: '密码不能小于6位数', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      act: 'register_m',
      wxuid: getApp().data.wxuid,
      xcxOpenid: getApp().data.openid,
      hidThirdLoginType: 'wechat',
      txtMobile: mobile,
      txtMobileCode: mobileZym,
      txtPwd: password,
      appType: 6,
      hidThirdName: getApp().data.wxUserInfo.nickName,
      source: 50,
      cookieTime: 86400
    };
    var func = function (res) {
      if (parseInt(res.data.status) > 0) {
        getApp().data.uid = res.data.status;
        getApp().data.token = res.data.token;
        getApp().data.SESSIONKEY = res.data.SESSIONKEY;
        //获取简历信息
        getApp().getResumeRow(res.data.status, res.data.SESSIONKEY);
        that.setData({ uid: res.data.status });
        that.getInfo();
        swan.showToast({ 'title': '注册成功', icon: 'success', mask: 'true', duration: 1000 });
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '注册失败', icon: 'success', mask: 'true', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //提交登录
  formLogin: function (e) {
    var that = this;
    var name = e.detail.value.username; //用户名
    var password = e.detail.value.pwd; //密码

    if (name.length <= 0) {
      swan.showToast({ title: '用户名不能为空', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }
    if (password.length <= 0) {
      swan.showToast({ title: '密码不能为空', icon: 'success', mask: 'true', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      act: 'login',
      wxuid: getApp().data.wxuid ? getApp().data.wxuid : '',
      xcxOpenid: getApp().data.openid ? getApp().data.openid : '',
      hidThirdName: getApp().data.wxUserInfo.nickName ? getApp().data.wxUserInfo.nickName : '',
      binding: 1,
      appType: 6,
      loginType: getApp().data.openid ? 6 : 0,
      userType: 1,
      username: name,
      password: password,
      cookieTime: 1
    };
    var func = function (res) {
      if (parseInt(res.data.status) > 0) {
        getApp().data.uid = res.data.status;
        getApp().data.token = res.data.token;
        getApp().data.SESSIONKEY = res.data.SESSIONKEY;
        getApp().data.nickname = res.data.nickname;
        //获取简历信息
        getApp().getResumeRow(res.data.status, res.data.SESSIONKEY);
        that.setData({ uid: res.data.status, nickname: res.data.nickname });
        //获取各种信息的数量
        that.getInfo();
        swan.showToast({ title: '登录成功', icon: 'success', mask: 'true', duration: 1000 });
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '登录失败', mask: 'true', icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //拨打电话
  callPhone: function (e) {
    var phone = e.target.dataset.phone;
    swan.makePhoneCall({
      phoneNumber: phone
    });
  },
  //意见反馈
  suggest: function () {
    swan.navigateTo({
      url: '/page/about/userFreeback/userFreeback'
    });
  }
});