// page/ai/ai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    talkClass: 'talk'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    swan.setNavigationBarTitle({ title: 'ai体验版' });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  //开始录音
  startRecord: function () {
    var that = this;
    this.setData({ talkClass: 'talkOver' });
  },
  //结束录音
  endRecord: function () {
    //结束录音  
    this.setData({ talkClass: 'talk' });
  }
});