// API子路径
const API = {
  // 引导页
  BootPage: 'way/user/getUserIsReg',
  // 用户信息
  getUserInfo: 'index/user/getUserInfo',
  // 检测是否黑名单
  checkBlackUser: 'index/user/checkBlackUser',
  // 最新通告
  getNotice: 'index/more/notice',
  getNoticeMsg: 'index/more/notice_details',
  // 获取注册人数
  getRegisterNumber: 'index/user/getCountUser',
  // 获取动态二维码
  getScan: 'index/index/qrcode',
  // 手机号修改
  postChangePhone: 'index/user/changePhone',
  // 注册
  postRegister_back: 'way/user/userBindCar',
  postRegister: 'way/user/bindUserWithVehicle',
  getCode: 'way/user/reccode',
  // 老用户已绑定信息
  getOldUserMsg: 'index/user/BindingsList',
  // 老用户一键绑定
  bindOldUser: 'index/user/bindings',
  // 检测新老用户标签
  checkUser: 'index/user/checkIsOldUser',
  // 解绑信息
  getUnbind: 'index/user/unbind',
  // 缴费明细
  getPay: 'parking/Payment_Records/paymentData',
  getPayMsg: 'index/mini/minipay',
  payDetail: 'details/details/paymentDetails',
  // 黑名单缴费明细
  blackUserPayment: 'parking/Payment_Records/blackUserPayment',
  getBlackPayMsg: 'index/mini/minipay',
  // 唤起微信支付
  postMoney: 'order/wxpay/repayment',
  // 意见反馈&投诉申请：
  postOpinion: 'index/mini/feedback',
  postComplaint: 'index/mini/complaint',
  // 常见问题：
  getFAQ: 'index/more/faq',
  getFAQDetail: 'index/more/faqDetails',
};
export default API;
