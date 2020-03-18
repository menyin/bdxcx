//隐藏智能语音
var talkhide = function (that) {
  // talkFunction.hideAll();
  that.setData({
    talkHide: true
  });
};
//自能智能搜索
var talkSearch = function (that) {
  swan.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.record']) {
        swan.authorize({
          scope: 'scope.record',
          success: function (res) {
            that.setData({
              talkHide: false
            });
          },
          fail: function (res) {
            swan.openSetting();
          }
        });
      } else {
        that.setData({
          talkHide: false
        });
      }
    }
  });
};
//开始录音
var startRecord = function (that) {
  that.setData({ talkClass: 'talkOver', yuyinImg: that.data.yuyinImg2 });
};
//结束录音
var endRecord = function (that) {
  //结束录音  
  that.setData({ talkClass: 'talk', yuyinImg: that.data.yuyinImg1 });
};

module.exports = {
  talkhide: talkhide,
  talkSearch: talkSearch,
  startRecord: startRecord,
  endRecord: endRecord
};