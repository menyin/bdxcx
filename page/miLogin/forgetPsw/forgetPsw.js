var util = require("../../../config/global.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendCodeTitle: '获取验证码', //验证码标题
    sendCodeFlag: false //是否可以发送验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    swan.setNavigationBarTitle({ title: '修改密码-身份认证' });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  //获取手机号码
  changeMobile: function (e) {
    this.setData({ mobile: e.detail.value });
  },
  //获取验证码
  getCode: function (e) {
    var that = this;
    var mobile = e.target.dataset.mobile;
    if (!mobile || mobile.length != 11) {
      swan.showToast({ title: '手机号码错误', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/user/passwordAuthCode/';
    var data = {
      txtMobilPhone: mobile,
      noCheckCode: 1
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

  //下一步
  formSubmit: function (e) {
    var that = this;
    var textMobile = e.detail.value.textMobile;
    var textMobileCode = e.detail.value.textMobileCode;
    // var txtImgCode = e.detail.value.txtImgCode;

    if (!textMobile || textMobile.length != 11) {
      swan.showToast({ title: '手机号码错误', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    if (!textMobileCode) {
      swan.showToast({ title: '手机验证码错误', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var data = {
      "operate": "phone",
      "txtMobilPhone": textMobile,
      // "txtMobileCode": txtImgCode,
      "txtMobilPhoneCode": textMobileCode,
      // "facilityId":"",
      "noCheckCode": 1
    };
    var url = getApp().data.API_URL + "/web/user/byPassword/";
    var func = function (res) {
      if (res.data.status == 1) {
        //下一步
        swan.redirectTo({
          url: '/page/miLogin/forgetPsw2/forgetPsw2?textMobileCode=' + textMobileCode + '&textMobile=' + textMobile
        });
        return;
      }
      swan.showToast({ title: res.data.msg, mask: true, icon: 'success', duration: 1000 });
    };

    util.isPost(data, url, func);
  }
});