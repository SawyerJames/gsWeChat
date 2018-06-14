import Vue from 'vue';
import App from './App';
import api from '@/utils/api'
import Vuex from 'vuex'

// 引入mpvue库的toast
import mpvueToastRegistry from 'mptoast/registry';

// 使用Vuex全局数据
Vue.use(Vuex)

// vuex全局存储
Vue.prototype.$store = new Vuex.Store({
  state: {
    // 存储全局变量
    scan: Object,
    userCheck: null,
    registerChooseState: 0,
    tutoriaWin: true,
    session_id: null
  }
})

// 引入fly网络请求库
var Http = require("flyio/dist/npm/wx")
var flyHttp = new Http(); //创建fly实例
//配置请求基地址
flyHttp.config.baseURL = "https://gs.jltengfang.com/";
flyHttp.config.headers = { 'Custom-Program': 'MiniProgram' };

Vue.prototype.$http = flyHttp;
// 接口地址
Vue.prototype.$api = api;
// 注册toast
mpvueToastRegistry(Vue);

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/account/main',
      '^pages/bindUser/main',
      'pages/blackPayment/main',
      'pages/center/main',
      'pages/closeApp/main',
      'pages/complaint/main',
      'pages/complaintMsg/main',
      'pages/complaintType/main',
      'pages/disclaimer/main',
      'pages/FAQ/main',
      'pages/feedback/main',
      'pages/index/main',
      'pages/loading/main',
      'pages/map/main',
      'pages/noninductive/main',
      'pages/notice/main',
      'pages/operating/main',
      'pages/particulars/main',
      'pages/pay/main',
      'pages/payDetail/main',
      'pages/privacy/main',
      'pages/register/main',
      'pages/registerChoose/main',
      'pages/registerTxt/main',
      'pages/settingIndex/main',
      'pages/statement/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ea4e3d',
      navigationBarTitleText: '无感付',
      navigationBarTextStyle: '#ffffff'
    }
  }
}
