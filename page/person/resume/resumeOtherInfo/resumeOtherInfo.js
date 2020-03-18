var util = require('../../../../config/global.js');
Page({
  data: {
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    var id = options.id;
    var index = options.index;
    var TopicContent1 = options.TopicContent1;
    var that = this;

    //获取简历缓存信息
    swan.getStorage({
      key: 'resumeRow' + getApp().data.uid,
      success: function (res) {
        var resumeRow = res.data;
        if (id) {
          //修改
          var otherRow = resumeRow.otherinfoListInfo[index];
          if (otherRow) {
            that.setData({
              delShow: true,
              btnStyle: '',
              index: index,
              resumeRow: resumeRow,
              TopicContent: otherRow.TopicContent, //内容
              TopicDesc: otherRow.TopicDesc, //主题
              otherinfoid: otherRow.otherinfoid,
              TopicContent1: TopicContent1 //内容(textarea暂时解决方案)
            });
            return;
          }
          swan.showToast({ title: '获取培训信息失败', mask: true, icon: 'success', duration: 2000 });
          return;
        }
        that.setData({
          index: -99,
          resumeRow: resumeRow,
          otherinfoid: '',
          TopicContent: '',
          TopicDesc: '',
          delShow: false,
          btnStyle: 'width:100%'
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
    // 设置标题
    swan.setNavigationBarTitle({ 'title': '其他信息' });
    //浏览记录
    getApp().addLog("/page/person/resume/resumeOtherInfo/resumeOtherInfo");
  },
  //提交
  formSubmit: function (e) {
    var that = this;
    var TopicContent = e.detail.value.TopicContent; //内容描述
    var TopicDesc = e.detail.value.TopicDesc; //主题
    console.log(TopicContent);
    //验证
    if (!TopicDesc) {
      swan.showToast({ title: '请填写主题', mask: true, icon: 'success', duration: 1000 });
      return;
    }
    if (!TopicContent) {
      swan.showToast({ title: '请填写内容描述', mask: true, icon: 'success', duration: 1000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var newData = {
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      fromWx: getApp().data.fromWx,
      act: 'otherinfo_save',
      append_id: this.data.otherinfoid,
      hidAppendType: '自定义',
      txtTopicDesc: TopicDesc,
      taTopicContent: TopicContent
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        newData.append_id = res.data.append_id;
        that.saveResumeRow(resumeRow, newData, that);
      }
    };
    util.isPost(newData, url, func);
  },
  //修改本地简历数据
  saveResumeRow: function (resumeRow, newData, that) {
    var otherRow = {
      rid: getApp().data.uid,
      AppendType: "自定义",
      TopicContent: decodeURI(newData.taTopicContent),
      TopicDesc: decodeURI(newData.txtTopicDesc),
      otherinfoid: newData.append_id
    };

    var index = that.data.index;
    if (index == -99) {
      //新增
      resumeRow.otherinfoListInfo.push(otherRow);
    } else {
      //修改
      resumeRow.otherinfoListInfo[index] = otherRow;
    }
    swan.setStorage({
      key: 'resumeRow' + getApp().data.uid,
      data: resumeRow,
      success: function (res) {
        swan.showToast({ title: '提交成功', mask: true, icon: 'success', duration: 2000 });
        setTimeout(function () {
          swan.navigateBack(); //返回
        }, 1000);
      },
      fail: function () {
        swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 2000 });
      }
    });
  },
  //是否要删除？
  canDel: function (e) {
    var that = this;
    swan.showModal({
      title: '删除其他信息',
      content: '您确定要删除当前其他信息',
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
    if (!resumeRow.otherinfoListInfo[index]) {
      swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 2000 });
      return;
    }

    var url = getApp().data.API_URL + '/web/person.api';
    var data = {
      fromWx: getApp().data.fromWx,
      SESSIONKEY: getApp().data.SESSIONKEY,
      token: getApp().data.token,
      act: 'otherinfo_del',
      append_id: id
    };
    var func = function (res) {
      if (res.data.status > 0) {
        var resumeRow = that.data.resumeRow;
        resumeRow.otherinfoListInfo.splice(index, 1);
        swan.setStorage({
          key: 'resumeRow' + getApp().data.uid,
          data: resumeRow,
          success: function () {
            swan.navigateBack();
          },
          fail: function () {
            swan.showToast({ title: '修改简历缓存失败', mask: true, icon: 'success', duration: 2000 });
          }
        });
        return;
      }
      swan.showToast({ title: res.data.msg ? res.data.msg : '删除失败', mask: true, icon: 'success', duration: 2000 });
    };
    util.isPost(data, url, func);
  }
});