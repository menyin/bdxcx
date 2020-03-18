// var areaData = require('../../config/area.js');
// var positionData = require('../../config/position.js');
// var industryData = require('../../config/industry.js');
var jobNameData = require('../../config/jobName.js');
var util = require("../../config/global.js");
var talkFunction = require('../talkTemplate/talkTemplate.js');
var app = getApp();
Page({
    data: {
        uid: app.data.uid, //用户id
        Phone400: app.data.Phone400, //400电话
        copyRight: app.data.copyRight, //版权
        kwType: '1', //搜索类型 1默认职位
        moreHide: true,
        showIcon: 'plus', //更多图表控制
        historyHide: true, //显示隐藏历史信息
        types: ["请选择", "职位", "企业", "全文"], //搜索类型
        industryList: [], //行业类别
        positionList: [], //职位类别
        jobList: [], //职位列表
        viewType: parseInt(app.data.uid) > 0 ? 1 : 0, //1智能推荐
        goTop: true,
        listShow: true,
        jobNameData: jobNameData.jobNameData,
        wxUserInfo: [],
        isShare: true, //分享向导显示隐藏
        isHideLoc: true, //定位信息显示隐藏
        imgUrls: [],
        _version: '', //微信版本号，6.5.8才能用页面按钮分享
        talkHide: true,
        talkClass: 'talk',
        yuyinImg: '../../images/yuyin.png',
        yuyinImg1: '../../images/yuyin.png',
        yuyinImg2: '../../images/yuyin1.gif'
    },
    onLoad: function (options) {
        var _version = getApp().data.sysInfo._version;
        this.setData({_version: _version});

        var that = this;
        var cityId = options.cityId; //城市id
        var cityName = options.cityName; //城市id
        //获取地址
        if (cityId && cityName) {
            var localCity = {'id': cityId, 'name': cityName};
            getApp().data.localCity = localCity;
            that.setData({localCity: localCity});
            //获取广告
            that.getAd(localCity.id);
        }

        //定位
        that.getLocationInfo();

        swan.login({
            success: function (res) {
                if (res.code) {
                    swan.getUserInfo({
                        success: function (res) {
                            that.setData({wxUserInfo: res.userInfo});
                        }
                    });
                }
            }
        });
    },
    onReady: function () {// 页面渲染完成
    },
    onShow: function () {
        //当小程序启动，或从后台进入前台显示，会触发 onShow
        var that = this;
        //历史搜索数据
        swan.getStorage({
            key: "searchHistory2",
            success: function (res) {
                if (res.data) {
                    var historyList = res.data;
                    that.setData({historyList: historyList});
                }
            }
        });

        //更多搜索
        var indexArea = app.data.dataNames.indexOf('indexArea');

        var jobLocIds = '';
        var jobLocNames = '';
        var areaList = '';

        if (indexArea == -1) {
        } else {
            jobLocIds = app.data.selectData[indexArea].ids;
            jobLocNames = app.data.selectData[indexArea].names;
            areaList = app.data.selectData[indexArea].hasSelect;
        }

        var localCity = {'id': '3502', 'name': '厦门'};
        if (getApp().data.localCity) localCity = getApp().data.localCity;
        that.setData({
            localCity: localCity,
            uid: getApp().data.uid,
            jobLocIds: jobLocIds,
            jobLocNames: jobLocNames,
            areaList: areaList
        });
        getApp().cache.sureBack = false;
        getApp().data.localCity = localCity;

        //头像动画
        var animation = swan.createAnimation({
            duration: 1000,
            timingFunction: 'ease-in'
        });
        this.animation = animation;
        animation.scale(1.5).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.scale(1).step();
            this.setData({
                animationData: animation.export()
            });
        }.bind(this), 1500);

        swan.getStorage({
            key: 'localCity',
            success: function (res) {
                var localCity = {'id': res.data.id, 'name': res.data.name};
                getApp().data.localCity = localCity;
                that.setData({localCity: localCity});
                //获取广告
                that.getAd(localCity.id);
            },
            fail: function (res) {
                var localCity = {'id': '3502', 'name': '厦门'};
                getApp().data.localCity = localCity;
                that.setData({localCity: localCity});
                //获取广告
                that.getAd(localCity.id);
            }
        });
    },
    bindKwTypeChange: function (e) {
        //变更搜索类型
        this.setData({kwType: e.detail.value});
    },
    moreChange: function () {
        //改变更多条件样式
        this.setData({
            moreHide: !this.data.moreHide,
            showIcon: this.data.moreHide ? 'minus' : 'plus'
        });
    },
    //搜索
    searchFormBtn: function (e) {
        var data = e.detail.value;

        swan.navigateTo({
            url: '../search/result/result?kwType=' + data.kwType + '&keyword=' + data.keyword + '&jobLocIds=' + data.jobLocIds + '&jobLocNames=' + data.jobLocNames + '&jobFun=' + data.jobFun + '&jobFunNames=' + data.jobFunNames + '&calling=' + data.calling + '&callingNames=' + data.callingNames
        });
    },
    changeHistoryHide: function () {
        //变更历史搜索显示状态
        this.setData({historyHide: !this.data.historyHide});
    },
    closeHistory: function () {
        //隐藏历史搜索
        this.setData({historyHide: true});
    },
    clearHistory: function () {
        //清除历史搜索
        var that = this;
        swan.showModal({
            title: '',
            content: '确定删除全部历史记录？',
            confirmText: '全部删除',
            confirmColor: '#38f',
            success: function (res) {
                if (res.confirm) {
                    swan.setStorage({
                        key: 'searchHistory2',
                        data: ''
                    });
                    that.setData({historyList: ''});
                }
            }
        });
    },
    //切换最新职位，智能推荐 1
    recomTitleChange: function (e) {
        var viewType = e.target.dataset.id ? e.target.dataset.id : 0;
        var cityId = this.data.jobLocIds;
        this.refreshPos({jobLocIds: cityId});
        this.setData({viewType: viewType});
    },
    //刷新职位列表
    refreshPos: function (params) {
        var that = this;
        var url = getApp().data.API_URL + '/web/mi.api?act=seachJObList';
        var data = {
            kwType: 1,
            keyword: params.keyword ? params.keyword : '',
            jobLocIds: params.jobLocIds ? params.jobLocIds : '',
            jobFun: params.jobFun ? params.jobFun : '',
            calling: params.calling ? params.calling : '',
            page: params.page ? params.page : 1
        };
        var func = function (res) {
            var arrs = res.data.rows;
            if (arrs.length <= 0) {
                arrs = [];
            }
            var listShow = true;
            if (arrs.length <= 0) listShow = false;
            that.setData({listShow: listShow, jobList: arrs});
        };
        util.isGet(data, url, func);
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
    },
    //滚动触发返回顶部的显示隐藏
    scroll: function (e) {
        if (e.detail.scrollTop > 200) {
            //触发gotop的显示条件
            this.setData({goTop: false});
        } else {
            this.setData({goTop: true});
        }
    },
    //返回顶部
    goToTop: function () {
        if (this.data.topNums == 1) {
            this.setData({topNums: 0});
        } else {
            this.setData({topNums: 1});
        }
    },
    //新选择城市
    selectCity: function () {
        swan.navigateTo({
            url: '/page/newArea/newArea'
        });
    },
    //点击头像跳到分享说明页
    showShare: function () {
        this.setData({isShare: false});
    },
    hideShare: function () {
        this.setData({isShare: true});
    },
    //判断一维数组是否存在于多维数组中
    inArray: function (array, arrays) {
        for (var key in arrays) {
            if (arrays[key].v == array.v) {
                return true;
            }
        }
        return false;
    },
    //分享
    onShareAppMessage: function () {
        var localCity = getApp().data.localCity;
        return {
            title: '597求职助手',
            desc: '597人才网是一家面向社会的专业招聘网站，海量的招聘信息，实时的信息反馈，尽在您的“掌”握中.',
            path: '/page/index/index?cityId=' + localCity.id + '&cityName=' + localCity.name
        };
    },
    //定位
    getLocationInfo: function () {
        var that = this;
        swan.getLocation({
            type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function (res) {
                var lat = res.latitude;
                var long = res.longitude;
                if (lat == 0 || long == 0) {
                    var isHideLoc = true;
                } else {
                    var isHideLoc = false;
                }

                that.setData({isHideLoc: isHideLoc});
                //保存全局
                getApp().data.isHideLoc = isHideLoc;
                getApp().data.lat = lat;
                getApp().data.long = long;
                swan.request({
                    url: getApp().data.API_URL + '/web/mi/zuobiaoGetCity/',
                    data: {
                        lat: lat,
                        long: long
                    },
                    method: 'GET',
                    success: function (res) {
                        if (res.data.status == 1) {
                            var cityId = res.data.row.region_id;
                            var cityName = res.data.row.region_name_short;
                            var localCity = {name: cityName, id: cityId};
                            that.setData({localtionNew: res.data.location});
                            console.log(res);

                            //只有开放城市
                            //if(that.inArray({'v':cityId, 'c':cityName},getApp().data.hotCity)){
                            //2017.07.27 改全国
                            if (res.data.row.region_domain) {
                                swan.getStorage({
                                    key: 'localCity',
                                    success: function (res) {
                                        if (res.data.id != cityId) {
                                            swan.showModal({
                                                title: '提示',
                                                content: '当前定位城市：' + cityName + "是否切换？",
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        that.setData({localCity: localCity});
                                                        getApp().getSelectCity(localCity);
                                                        //获取广告
                                                        that.getAd(localCity.id);
                                                        // getApp().data.localCity = localCity;
                                                        // wx.setStorage({
                                                        //   key: 'localCity',
                                                        //   data: localCity
                                                        // });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            swan.showToast({title: '定位失败，请手动选择城市', mask: true, icon: 'success', duration: 1000});
                        }
                    },
                    fail: function () {
                        swan.showToast({title: '定位失败，请手动选择城市', mask: true, icon: 'success', duration: 1000});
                    }
                });
            },
            fail: function (res) {
                that.setData({isHideLoc: true});
            }
        });
    },
    //跳转企业版小程序首页
    jumpCom: function () {
        swan.navigateToSmartProgram({
            appId: 'wx1e2155f7eaa0cad1',
            extarData: {
                myFrom: 'per'
            },
            envVersion: 'release',
            success(res) {
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    //跳转到ai
    toAi: function () {
        swan.navigateTo({
            url: '/page/ai/ai'
            // url:'/page/talkTemplate/talkTemplate'
        });
    },
    //隐藏智能语音
    talkhide: function () {
        talkFunction.talkhide(this);
    },
    //自能智能搜索
    talkSearch: function () {
        talkFunction.talkSearch(this);
    },
    //开始录音
    startRecord: function () {
        talkFunction.startRecord(this);
    },
    //结束录音
    endRecord: function () {
        talkFunction.endRecord(this);
    },
    //获取广告
    getAd: function (cityId) {
        var that = this;
        var url = app.data.API_URL + "/web/mi/getAdList/";
        var data = {
            cityId: cityId,
            positionId: 23
        };
        var func = function (res) {
            console.log(res);
            var rows = res.data.rows;
            var imgUrls = [];
            if (res.data.status == 1) {
                for (var i = 0; i < rows.length; i++) {
                    //rows[i]['url']
                    var aa = {'img': rows[i]['_pic'], 'url': rows[i]['url']};
                    imgUrls.push(aa);
                }
            }
            that.setData({imgUrls: imgUrls});
        };
        util.isGet(data, url, func);
    }
});