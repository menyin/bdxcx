/*微信公共数据 
列如： degree 微信数据
	 _degree 微信数据转为pc数据的中间值
*/

//性别
var gender = ['请选择', '男', '女'];
//结婚状态
var marriage = ['请选择', '未婚', '已婚未育', '已婚已育'];
//工作状态
var jobState = ['请选择', '不在职，正在找工作', '在职，打算近期换工作', '在职，有更好的机会才考虑', '不考虑换工作'];
//学历
var degree = ['请选择', '小学', '初中', '高中', '中技/中专', '专科', '本科', '硕士', '博士', '博士后'];
var _degree = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
//政治面貌
var political = ['请选择', '共产党员', '民主党派', '群众', '其他', '共青团员'];
//职位类型
var joinType = ['请选择', '全职', '兼职', '实习'];
var _joinType = [0, 1, 2, 5];
//到岗时间
var joinTime = ['请选择', '立即到岗', '7天内到岗', '15天内到岗', '1月内到岗', '2月内到岗', '3月内到岗', '半年内到岗'];
//企业性质	
var comProperty = ['请选择', '私营/民营', '国有企业', '合资', '外资', '政府机关', '事业单位', '非盈利机构', '其他'];
var _comProperty = [0, 1, 2, 3, 4, 5, 6, 7, 99];
//公司规模
var comSize = ['请选择', '50人以下', '51-100人', '101-500人', '501-1000人', '1000人以上'];
//期望薪资
var salarys = ['请选择', '1000及以上', '2000及以上', '3000及以上', '4000及以上', '5000及以上', '6000及以上', '7000及以上', '8000及以上', '9000及以上', '10000及以上', '12000及以上', '15000及以上', '20000及以上', '30000及以上'];
var _salarys = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 20000, 30000];
//熟练程度
var level = ['请选择', '入门', '熟练', '精通'];
var _level = ['0', '01', '02', '03'];
//职位语种
// var lanType = ['请选择', '英语', '日语', '韩语', '德语', '法语', '俄语', '西班牙语', '葡萄牙语', '意大利语', '阿拉伯语', '普通话', '粤语', "闽南语", "其他语种"];
// var _lanType = ['0', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '99'];
//简历语种
var lanType = ['请选择', '英语', '日语', '韩语', '德语', '法语', '俄语', '西班牙语', '葡萄牙语', '意大利语', '阿拉伯语', '普通话', '其他语种', '粤语'];
var _lanType = ['0', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'];

var lanCert = [[], ['大学英语四级', '大学英语六级', '专业英语四级', '专业英语八级', 'ETS-1', 'PETS-2', 'PETS-3', 'PETS-4', 'PETS-5', '剑桥商务英语 BEC Pre.', '剑桥商务英语 BEC Van.', '剑桥商务英语 BEC Hi.', 'TOEFL', 'IELTS', 'TOEIC', 'GRE', 'GMAT'], ['日语一级', '日语五级', '日语四级', '大学日语四级', '大学日语六级', '专业日语四级', '专业日语八级', '日本语能力测试JLPT-N1', '日本语能力测试JLPT-N2', '日本语能力测试JLPT-N3', '日本语能力测试JLPT-N4', '日本语能力测试JLPT-N5'], ['专业韩语四级', 'S-Topik 初级', 'S-Topik 中级', 'S-Topik 高级'], ['大学德语四级', '专业德语四级', 'DSH-1', 'DSH-2', 'DSH-3', 'TestDeF-N3', 'TestDeF-N4', 'TestDeF-N5'], ['大学法语四级', '专业法语四级', '专业法语八级', 'DELF-1', 'DELF-2', 'DALF', 'DELF-A1', 'DELF-A2', 'DELF-B1', 'DELF-B2', 'DALF-C1', 'DALF-C2', 'TEF-1', 'TEF-2', 'TEF-3', 'TEF-4', 'TEF-5', 'TEF-6', 'TCF-1', 'TCF-2', 'TCF-3', 'TCF-4', 'TCF-5', 'TCF-6'], ['大学俄语四级', '大学俄语六级', '专业俄语四级', '专业俄语八级'], ['专业西班牙语四级', '专业西班牙语八级', 'DELE-A1', 'DELE-A2', 'DELE-B1', 'DELE-B2', 'DELE-C1', 'DELE-C2'], ['CIPLE', 'DEPLE', 'DIPLE', 'DAPLE', 'DUPLE'], ['CILS-A1', 'CILS-A2', 'CILS-B1', 'CILS-B2', 'CILS-C1', 'CILS-C2', 'CELI-A1', 'CELI-A2', 'CELI-B1', 'CELI-B2', 'CELI-C1', 'CELI-C2', 'IT-A2', 'IT-B1', 'IT-B2', 'IT-C2', 'PLIDA-A1', 'PLIDA-A2', 'PLIDA-A2', 'PLIDA-B1', 'PLIDA-B2', 'PLIDA-C1', 'PLIDA-C2'], ['阿拉伯语专业四级'], ['普通话一级甲等', '普通话一级乙等', '普通话二级甲等', '普通话二级乙等', '普通话三级甲等', '普通话三级乙等'], [], []];

//福利
var fuli = ['不限', '五险', '住房公积金', '包吃', '包住', '周末双休', '单休', '大小周', '加班补助', '班车接送'];

module.exports.gender = gender;
exports.marriage = marriage;
exports.jobState = jobState;
exports.degree = degree;
exports._degree = _degree;
exports.political = political;
exports.joinType = joinType;
exports._joinType = _joinType;
exports.joinTime = joinTime;
exports.comProperty = comProperty;
exports._comProperty = _comProperty;
exports.comSize = comSize;
exports.salarys = salarys;
exports._salarys = _salarys;
exports.level = level;
exports._level = _level;
exports.lanType = lanType;
exports._lanType = _lanType;
exports.fuli = fuli;
exports.lanCert = lanCert;