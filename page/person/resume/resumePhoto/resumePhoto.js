var util = require("../../../../config/global.js");
Page({
  data: {
    resumeImage: ""
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    var that = this;
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        that.setData({
          resumeRow: resumeRow,
          resumeImage: resumeRow.attachment ? res.data.attachment : '',
          isShowPhoto: parseInt(resumeRow.isShowPhoto)
        });
      },
      fail: function () {
        swan.showToast({ title: '获取简历信息失败', mask: true, icon: 'success', duration: 2000 });
      }
    });
  },
  onShow: function () {
    //是否登录
    var flag = getApp().checkLogin();
    if (!flag) return;
  },
  onReady: function () {
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      complete: function (res) {
        var resumeRow = '';
        if (res.data) resumeRow = res.data;
        //简历不存在，则跳转到创建简历页面
        if (!resumeRow) {
          // wx.redirectTo({
          //   url: '/page/person/resume/resumeBase/resumeBase'
          // })
          swan.switchTab({
            url: '/page/person/resume/index/index'
          });
        }
      }
    });
    //浏览记录
    getApp().addLog("/page/person/resume/resumePhoto/resumePhoto");
  },
  changeImage: function () {
    var that = this;
    swan.chooseImage({
      count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);

        //过滤文件类型
        var fileType = res.tempFilePaths[0].split('.').splice(-1);
        console.log(fileType);
        if (fileType[0] == 'jpg' || fileType[0] == 'jpeg' || fileType[0] == 'gif' || fileType[0] == 'png') {
          //上传图片
          swan.uploadFile({
            url: getApp().data.API_URL + '/web/uploadify.api',
            filePath: res.tempFilePaths[0],
            name: "Filedata",
            formData: {
              SESSIONKEY: getApp().data.SESSIONKEY,
              fromWx: getApp().data.fromWx,
              act: 'mobilePhoto'
            },
            header: { 'content-type': 'multipart/form-data' },
            success: function (res) {
              //微信小程序 wx.uploadFile方法 success返回值必须是字符串
              console.log(res);
              if (res.data) {
                that.setData({ resumeImage: res.data });

                //修改本地缓存
                var resumeRow = that.data.resumeRow;
                resumeRow.attachment = res.data;
                swan.setStorage({
                  key: 'resumeRow' + getApp().data.uid,
                  data: resumeRow,
                  success: function () {
                    swan.showToast({ title: '上传成功', mask: true, icon: 'success', ducation: 1000 });
                  },
                  fail: function () {
                    swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', ducation: 1000 });
                  }
                });
                return;
              }
              swan.showToast({ title: '上传失败1', icon: 'success', mask: true, ducation: 1000 });
            },
            fail: function () {
              swan.showToast({ title: '上传失败2', icon: 'success', mask: true, ducation: 1000 });
            }
          });
        } else {
          swan.showToast({ title: '上传文件类型错误', icon: 'success', mask: true, duration: 1000 });
        }
      }
    });
  },
  //照片是否显示
  changePhotoFlag: function () {
    var that = this;
    var flag = !this.data.isShowPhoto;
    var url = getApp().data.API_URL + '/web/mi.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'photoFlag',
      photoFlag: flag ? 1 : 0
    };
    var func = function (res) {
      if (res.data.code == 1) {
        that.setData({ isShowPhoto: data.photoFlag });
        //修改缓存
        var resumeRow = that.data.resumeRow;
        resumeRow.isShowPhoto = data.photoFlag;
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow
        });
        swan.showToast({ title: '设置成功', icon: 'success', mask: true, duration: 1000 });
        return;
      }
      swan.showToast({ title: '设置失败', icon: 'success', mask: true, duration: 1000 });
    };
    util.isPost(data, url, func);
  }
});