/*get提交
    data json 提交的数据
    url string 提交的url
    func function 请求成功处理返回数据方法
    that   obj    
    useData json 提交成功后需要在func中改变的数据
*/
function isGet(data, url, func, that, useData = {}, count = 1) {
  swan.showToast({ title: '加载中...', mask: true, icon: 'loading', duration: 10000 });
  data['appType'] = 6;
  swan.request({
    url: url,
    data: data,
    method: 'GET',
    success: function (res) {
      swan.hideToast();
      setTimeout(function () {
        func(res, that, useData);
      }, 1000);
    },
    fail: function () {
      if (count <= getApp().data.repeatCount) {
        count = parseInt(count) + 1;
        isPost(data, url, func, that, useData, count);
        return;
      }
      swan.showToast({ title: '网络请求失败', mask: true, icon: 'success', duration: 1000 });
    }
  });
}

/*POST提交
    data json 提交的数据
    url string 提交的url
    func function 请求成功处理返回数据方法
    that   obj 
    useData json 提交成功后需要在func中使用的数据
*/
function isPost(data, url, func, that, useData = {}, count = 1) {
  swan.showToast({ title: '加载中...', mask: true, icon: 'loading', duration: 10000 });
  data['appType'] = 6;
  swan.request({
    url: url,
    data: json2Form(data),
    method: 'POST',
    header: { "content-type": "application/x-www-form-urlencoded" }, //content-type 需小写
    success: function (res) {
      //成功
      swan.hideToast();
      setTimeout(function () {
        func(res, that, useData);
      }, 300);
    },
    fail: function () {
      //失败 重新获取三次
      if (count <= getApp().data.repeatCount) {
        count = parseInt(count) + 1;
        isPost(data, url, func, that, useData, count);
        return;
      }
      swan.showToast({ title: '网络请求失败', mask: true, icon: 'success', duration: 300 });
    }
  });
}

//使用这个转post数据。 不用则token中的加号post提交后会变成空格
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

module.exports = {
  isGet: isGet,
  isPost: isPost
};