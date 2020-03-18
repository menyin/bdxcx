var util = require("../../../config/global.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var textMobileCode = options.textMobileCode;
    var textMobile = options.textMobile;
    this.setData({
      textMobileCode: textMobileCode,
      textMobile: textMobile
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    swan.setNavigationBarTitle({ title: '修改密码-密码重置' });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  //密码重置
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    var textMobile = e.detail.value.textMobile;
    var textMobileCode = e.detail.value.textMobileCode;
    var textNewpwd = e.detail.value.textNewpwd;
    var textSurepwd = e.detail.value.textSurepwd;

    if (!textMobile || textMobile.length != 11) {
      swan.showToast({ title: '手机号码错误', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    if (!textMobileCode) {
      swan.showToast({ title: '手机验证码错误', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!textNewpwd) {
      swan.showToast({ title: '请输入新密码', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!textSurepwd) {
      swan.showToast({ title: '请输入确认密码', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    if (textNewpwd != textSurepwd) {
      swan.showToast({ title: '两个密码不同', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + "/web/user/modPassword/";
    var data = {
      'hidMobilePhone': textMobile,
      'hidAuthCode': textMobileCode,
      'txtPassword': textNewpwd,
      'txtRepeatPassword': textSurepwd
    };
    var func = function (res) {
      if (res.data.status == 1) {
        swan.showToast({ title: '密码重置成功', mask: true, icon: 'success', duration: 2000 });
        swan.switchTab({
          url: '/page/index/index'
        });
        return;
      }
      swan.showToast({ title: res.data.msg, mask: true, icon: 'success', duration: 1000 });
    };
    util.isPost(data, url, func);
  }

});