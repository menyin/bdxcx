var util = require("../../config/global.js");
Page({
  data: {
    isBindShow: true,
    isUser: false, //是否是注册用户
    sendCodeTitle: '获取验证码', //验证码标题
    sendCodeFlag: false, //是否可以发送验证码
    backUrl: '../index/index',
    backUrlTypes: { //登录成功或的返回路径
      shouye: '/page/index/index',
      jianli: '/page/person/resume/index/index',
      yingpin: '/page/person/apply/index/index',
      wo: '/page/person/index/index'
    }
  },
  onLoad: function (options) {
    var urlType = options.type;
    this.setData({
      backUrl: this.data.backUrlTypes[urlType],
      isIndex: options.isIndex, //标示首页过来
      ROOT_DOMAIN: getApp().data.ROOT_DOMAIN,
      wxUserInfo: getApp().data.wxUserInfo
    });

    if (options.isUser == "yes") {
      this.setData({ isUser: true });
    }
  },
  onShow: function () {},
  onReady: function () {
    // 页面渲染完成
    if (getApp().data.token.length > 0) {
      console.log(getCurrentPages().length);
      if (getCurrentPages().length > 1 || this.data.isIndex == 'true') {
        swan.navigateBack();
      } else {
        swan.redirectTo({
          url: '/page/index/index'
        });
      }
      return;
    }

    if (this.data.isUser) {
      swan.setNavigationBarTitle({ title: '登录' });
    } else {
      swan.setNavigationBarTitle({ title: '注册' });
    }

    //浏览记录
    getApp().addLog("/page/miLogin/miLogin");
  },
  changeMobile: function (e) {
    this.setData({ mobile: e.detail.value });
  },
  //获取验证码
  getCode: function (e) {
    var that = this;
    var mobile = e.target.dataset.mobile;
    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '请填写正确的手机号码', mask: true, icon: 'success', duration: 1000 });
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
        swan.showToast({ title: data.msg, mask: true, icon: 'succes', ducation: 1000 });
        return;
      }
      swan.showToast({ title: "验证码已发送！", mask: true, icon: 'succes', mask: 'true', ducation: 1000 });
      //获取成功 再次获取倒计时
      var phoneTime = 180;
      var inta = setInterval(function () {
        if (phoneTime <= 0) {
          that.setData({ sendCodeTitle: '再次获取验证码', sendCodeFlag: false });
          clearInterval(inta);
        } else {
          that.setData({ sendCodeTitle: phoneTime + '秒后可重新获取', sendCodeFlag: true });
        }
        phoneTime--;
      }, 1000);
    };
    util.isGet(data, url, func);
  },
  //切换注册、登录
  changeLoginReg: function () {
    this.setData({ isUser: !this.data.isUser });
    if (this.data.isUser) {
      swan.setNavigationBarTitle({ title: '登录' });
    } else {
      swan.setNavigationBarTitle({ title: '注册' });
    }
  },
  //提交注册
  formReg: function (e) {
    var that = this;
    var mobile = e.detail.value.mobile; //手机号码
    var mobileZym = e.detail.value.mobileZym; //验证码
    var password = e.detail.value.password; //密码

    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '请填写正确的手机号码', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (mobileZym.length <= 0) {
      swan.showToast({ title: '请填写正确的验证码', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (password.length < 6) {
      swan.showToast({ title: '密码不能小于6位数', mask: true, icon: 'success', duration: 1000 });
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
        // this.setData({isBindShow:false});
        //获取简历信息
        getApp().getResumeRow(res.data.status, res.data.SESSIONKEY);

        swan.showToast({ title: '注册成功', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          // wx.switchTab({
          //   url: '/page/person/index/index'
          // })
          swan.navigateBack();
        }, 1000);
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '注册失败', mask: true, icon: 'success', duration: 1000 });
    };

    util.isPost(data, url, func);
  },
  //提交登录
  formLogin: function (e) {
    var that = this;
    var name = e.detail.value.username; //用户名
    var password = e.detail.value.pwd; //密码

    if (name.length <= 0) {
      swan.showToast({ title: '用户名不能为空', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (password.length <= 0) {
      swan.showToast({ title: '密码不能为空', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      act: 'login',
      wxuid: getApp().data.wxuid,
      xcxOpenid: getApp().data.openid,
      hidThirdName: getApp().data.wxUserInfo.nickName,
      binding: 1,
      appType: 6,
      loginType: 6,
      userType: 1,
      username: name,
      password: password,
      cookieTime: 86400
    };
    var func = function (res) {
      if (parseInt(res.data.status) > 0) {
        // this.setData({isBindShow:false});
        getApp().data.uid = res.data.status;
        getApp().data.token = res.data.token;
        getApp().data.SESSIONKEY = res.data.SESSIONKEY;
        //获取简历信息
        getApp().getResumeRow(res.data.status, res.data.SESSIONKEY);

        swan.showToast({ title: '登录成功', mask: true, icon: 'success', duration: 1000 });
        setTimeout(function () {
          //  wx.switchTab({
          //   url: '/page/person/index/index'
          // })
          swan.navigateBack();
        }, 1000);
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '登录失败', mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  },
  //返回
  goBack: function () {
    swan.switchTab({ url: '/page/index/index' });
  }
});