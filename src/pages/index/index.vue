<template>
  <div class="index">
    <!-- alert组件 -->
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <alert :alert="alert" :title="title" :text="text"></alert>
    <!-- 通告及个人说明主体 -->
    <div class="topIndex">
      <!-- 最新通告 -->
      <div class="notice">
        <div v-if="noticeList" class="activityContent flexRow boxBorder">
          <img :src="imgUrl.activity">
          <!-- 最新通告轮播 -->
          <swiper :indicator-dots="false" :autoplay="true" :interval="3500" class="swiper">
            <swiper-item class="swiperItem" v-for="item in noticeList" @click="goNoticeDetail(item.id)">
              <p>{{item.name}}</p>
            </swiper-item>
          </swiper>
        </div>
          <img :src="imgUrl.activity">
          <p class="activity_none">暂无最新公告</p>
        </div>
      </div>
      <!-- 个人信息栏: 1=>已绑定 -->
      <div :class="['flexRow userInfoContent',{userInfoContent_Flag: userFlag == 1}]">
        <!-- 已绑定 -->
        <div v-if="userFlag == 1" class="user_Flag">
          <div class="user_Flag flexRow">
            <!-- 已绑定头像与积分 -->
            <div class="user_Flag_img_content">
              <img class="user_Flag_img" background-size="cover" :src="userInfo.headimgurl">
              <div class="user_Flag_rank_content">
                <span>当前积分0</span>
              </div>
            </div>
            <!-- 业务标尺 -->
            <div class="rankIconContent" @click="goBusiness">
              <img :src="imgUrl.flag_rank" class="rankIcon">
              <span>已开通业务</span>
            </div>
            <!-- 已绑定其他信息 -->
            <div class="user_Flag_content flexCol">
              <span class="nick_name">{{userInfo.nickname}}</span>
              <span class="car_number">车牌号：{{userInfo.car_number}}</span>
              <!-- <span class="phone">电话：{{userInfo.phone}}</span> -->
            </div>
          </div>
        </div>
        <!-- 未绑定时 -->
        <a :href="flagRouterRegister" v-else class="user_noFlag flexCol">
          <!-- 未绑定时上半部分 -->
          <div class="user_noFlag_top flexRow">
            <img :src="imgUrl.noFlag_bind" class="addIcon">
            <span class="user_noFlag_title">绑定您的爱车</span>
            <img :src="imgUrl.noFlag_icon" class="carIcon">
          </div>
          <!-- 人数标尺 -->
          <div class="numberIconContent">
            <img :src="imgUrl.noFlag_number" class="numberIcon">
            <span>{{registerNumber}}人已绑定</span>
          </div>
          <!-- 未绑定时下半部分 -->
          <span class="user_noFlag_sign sign">绑定后您将享受无感付更高水平的服务</span>
        </a>
      </div>
    </div>
    <!-- 选项 -->
    <div class="tabBar flexRow">
      <a href="../map/main" class="tabBarChoose">无感支付</a>
      <div @click="noActivity">活动积分</div>
      <div @click="clickScan">不抬杆请扫码</div>
    </div>
    <!-- 其他选项 -->
    <div class="tabBar_map flexCol">
      <a href="../map/main" class="tabBar_map_module flexRow">
        <img :src="imgUrl.tab_1" class="tabIcon">
        <span>智慧高速</span>
        <img :src="imgUrl.arrow" class="arrowIcon">
      </a>
      <a href="../map/main" @click.native="noActivity" class="tabBar_map_module flexRow">
        <img :src="imgUrl.tab_2" class="tabIcon">
        <span>智慧加油</span>
        <img :src="imgUrl.arrow" class="arrowIcon">
      </a>
      <a href="../map/main" @click.native="noActivity" class="tabBar_map_module flexRow">
        <img :src="imgUrl.tab_3" class="tabIcon">
        <span>智慧停车</span>
        <img :src="imgUrl.arrow" class="arrowIcon">
      </a>
      <div @click="pay" class="tabBar_map_module flexRow" style="margin-bottom: 44rpx;">
        <img :src="imgUrl.tab_4" class="tabIcon">
        <span>创建订单</span>
        <img :src="imgUrl.arrow" class="arrowIcon">
      </div>
    </div>
    <!-- 动态二维码 -->
    <div v-if="showScan">
      <div v-if="showScan" class="mask" @click="closeScan"></div>
      <div class="showScanContent flexCol">
        <img v-if="scanImg" :src="scanImg" class="scanImg" alt="动态二维码">
        <span>二维码每5分钟自动刷新1次</span>
      </div>
    </div>
    <!-- 使用教程：仅限于新用户：userFlag => 0并且userCheck => 0  -->
    <div class="mask" v-if="tutoriaWin && userFlag == 0 && userCheck == 0"></div>
    <div class="tutorialWin" v-if="tutoriaWin && userFlag == 0 && userCheck == 0">
      <div class="tutoriaContent borderBox">
        <p class="tutorTitle">无感付介绍</p>
        <p>感谢您使用无感付，绑定后即可在试点站享受无感支付。</p>
        <p class="titleSign">——◆开通使用◆——</p>
        <p><span class="p_sign">第一步</span>、输入您的手机号，获取验证码并输入，点击下一步。</p>
        <p><span class="p_sign">第二步</span>、上传您的行驶证正反面，点击下一步。</p>
        <p><span class="p_sign">第三步</span>、审核通过，完成绑定！</p>
      </div>
      <div class="tutoriaFooter flexRow">
        <span @click="tutoriaWinBtn">我知道了</span>
      </div>
    </div>
    <!-- 底部tapbar -->
    <div class="footerHack"></div>
    <div class="footer flexRow">
      <div class="flexCol">
        <img :src="imgUrl.footTabIndex_L">
        <span>首页</span>
      </div>
      <div @click="goCenter" class="flexCol">
        <img :src="imgUrl.footTabCenter">
        <span>个人中心</span>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import alert from '@/components/alert'
// 导入图片
import activity from '@/assets/common/activity.png'
import headerImg from '@/assets/common/headerImg.png'
import flag_rank from '@/assets/index/flag_rank.png'
import noFlag_bind from '@/assets/index/noFlag_bind.png'
import noFlag_icon from '@/assets/index/noFlag_icon.png'
import noFlag_number from '@/assets/index/noFlag_number.png'
import tab_1 from '@/assets/index/tab_1.png'
import tab_2 from '@/assets/index/tab_2.png'
import tab_3 from '@/assets/index/tab_3.png'
import tab_4 from '@/assets/index/tab_4.png'
import arrow from '@/assets/index/arrow.png'
import footTabIndex_L from '@/assets/index/footTabIndex_L.png'
import footTabCenter from '@/assets/index/footTabCenter.png'
export default {
  name: "index",
  data() {
    return {
      // 图片集
      imgUrl: {
        activity,
        headerImg,
        flag_rank,
        noFlag_bind,
        noFlag_icon,
        noFlag_number,
        tab_1,
        tab_2,
        tab_3,
        tab_4,
        arrow,
        footTabIndex_L,
        footTabCenter
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // alert相关
      alert: false,
      title: '小主别急',
      text: '此功能还在路上！',
      // 判断是否绑定后的路由变化
      flagRouter: '/center',
      flagRouterRegister: '../register/main',
      // 动态二维码相关
      scanImg: '',
      showScan: false,
      // 使用教程
      tutoriaWin: false,
      // 最新通告
      noticeList: [],
      // 用户信息&绑定状态
      userFlag: 0,
      userCheck: 0,
      userInfo: {},
      // 注册人数
      registerNumber: 2000
    }
  },
  mounted() {
    let that = this;
    // 在未绑定判断是否为老用户
    if (wx.getStorageSync('userFlag') == 0) {
      // 改变绑定状态
      this.userFlag = 0;
      this.$http.get(this.$api.checkUser, null, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 接口获取成功
          if (res.data.state == 0) {
            // 判别当前用户是否为老用户
            that.userCheck = res.data.data.count;
            // 新用户开通使用教程
            if (that.userCheck == 0) {
              that.tutoriaWin = that.$store.state.tutoriaWin;
            }
            // 老用户跳转注册选择页
            else {
              that.flagRouterRegister = '../registerChoose/main';
            }
            // 判别状态存入全局中
            that.$store.state.userCheck = res.data.data.count;
          }
        })
        .catch(function(err) {
          that.errShow = true;
          that.errTxt = '网络错误';
        });
    };
    // 动态修改路由变化，更改绑定状态
    if (wx.getStorageSync('userFlag') == 1) {
      // 改变绑定状态
      this.userFlag = 1;
      // 改变路由状态：需求暂时变更，个人中心也可以查看，之前flagRoter默认为register
      // this.flagRouter = '/center';
      // 获取用户信息
      this.$http.get(this.$api.getUserInfo, null, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 接口获取成功
          if (res.data.state == 0) {
            that.userInfo = res.data.data;
          }
        })
        .catch(function(err) {
          that.errShow = true;
          that.errTxt = '网络错误';
        });
    };
    // 获取注册人数
    this.$http.get(this.$api.getRegisterNumber, null, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        // 接口获取成功
        if (res.data.state == 0) {
          // 如果绑定人数大于2000人，使用真实数据
          if (parseInt(res.data.data.sumUser) > 2000) {
            that.registerNumber = res.data.data.sumUser;
          }
        }
      });
  },
  onShow() {
    let that = this;
    // 获取最新公告
    this.$http.get(this.$api.getNotice, null, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        // 接口获取成功
        if (res.data.state == 0) {
          that.noticeList = res.data.data;
        }
      })
      .catch(function(err) {
        that.errShow = true;
        that.errTxt = '网络错误'
        var errLoading = setTimeout(function() {
          that.errShow = false;
          that.errTxt = ''
          clearTimeout(errLoading);
        }, 2000);
      });
  },
  methods: {
    // 跳转已开通业务
    goBusiness() {
      wx.navigateTo({
        url: '../business/main'
      })
    },
    // 使用指南
    tutoriaWinBtn() {
      this.tutoriaWin = false;
      this.$store.state.tutoriaWin = false;
    },
    // 点击最新公告跳转详情页
    goNoticeDetail(id) {
      wx.navigateTo({
        url: '../notice/main?id=' + id
      })
    },
    // 点击不抬杆扫码
    clickScan() {
      // 如果未绑定跳至注册页,如果绑定则获取动态验证码
      if (wx.getStorageSync('userFlag') == 1) {
        this.showScan = true;
        // 拉取二维码图片base64
        this.getScan();
        // 开启3分钟动态验证码获取
        this.$store.state.scan = setInterval(this.getScan, 18000000);
      }
      // 未绑定跳转注册，区分新老用户
      else {
        if (this.userCheck != 0) {
          wx.navigateTo({
            url: '../registerChoose/main'
          })
        } else {
          wx.navigateTo({
            url: '../register/main'
          })
        }
      }
    },
    // 关闭二维码并停止刷新二维码
    closeScan() {
      this.showScan = false;
      clearInterval(this.$store.state.scan);
    },
    // 获取动态二维码函数
    getScan() {
      var that = this;
      // 获取动态二维码:追加随机数，用来动态获取，权重为10000
      this.$http.get(this.$api.getScan + "?" + Math.random(0, 10000), null, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 接口获取成功
          that.scanImg = res.data.data.qrcode;
        })
        .catch(function(err) {
          that.errShow = true;
          that.errTxt = '网络错误'
          var errLoading = setTimeout(function() {
            that.errShow = false;
            that.errTxt = ''
            clearTimeout(errLoading);
          }, 2000);
        });
    },
    // alert弹窗：无活动
    noActivity() {
      let that = this;
      this.alert = true;
      var hideAlert = setTimeout(function() {
        that.alert = false;
        clearTimeout(hideAlert);
      }, 1500)
    },
    // 跳转个人中心
    goCenter() {
      wx.reLaunch({
        url: '../center/main'
      })
    },
    // 支付
    pay() {
      this.$http.get('order/index/test', null, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          console.log("成功", res);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  components: {
    errAlert,
    alert
  }
}
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
  background: #f4f5f9;
}


/*上方主体*/

.topIndex {
  width: 100%;
  min-height: 416rpx;
  background: #f8624a;
}


/*最新公告*/

.notice {
  /*  padding-top: 32rpx;*/
  height: auto;
}

.activityContent {
  height: 64rpx;
  background: #ea4f3d;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
  padding: 0 16rpx;
}

.activityContent>img {
  height: 32rpx;
  width: 32rpx;
  margin-right: 16rpx;
}

.swiper {
  display: block;
  height: 38rpx;
  width: 100%;
  line-height: 38rpx;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;
}

.swiperItem p {
  text-align: left;
  color: #fff;
  font-size: 24rpx;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;
}

.activity_none {
  text-align: left;
  color: #fff;
  font-size: 24rpx;
}


/*用户状态栏*/

.userInfoContent {
  width: 100%;
  height: 352rpx;
  background: url(../../assets/index/userBg.png) no-repeat bottom;
  background-size: contain;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.userInfoContent_Flag {
  background: url(../../assets/index/userBg_flag.png) no-repeat bottom;
  background-size: contain;
}


/*绑定状态用户栏*/

.user_Flag {
  width: auto;
  height: auto;
  margin-bottom: 16rpx;
  position: relative;
  color: #fff;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.user_Flag_img_content {
  width: auto;
  height: auto;
  position: relative;
}

.user_Flag_img {
  width: 121.6rpx;
  height: 121.6rpx;
  border-radius: 121.6rpx;
  border: 2px solid #fff;
  background: #fff;
  margin-right: 64rpx;
  overflow: hidden;
  display: block;
}

.user_Flag_rank_content {
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 16rpx;
  background: #f9e638;
  border-radius: 32rpx;
  position: absolute;
  bottom: -12rpx;
  left: -5rpx;
}

.user_Flag_rank_content span {
  font-size: 24rpx;
  color: #333;
}


/*已绑定用户信息*/

.user_Flag_content {
  justify-content: center;
  font-size: 28rpx;
}

.nick_name {
  font-size: 32rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 20rpx;
}


/*积分标尺*/

.rankIconContent {
  position: absolute;
  width: 160rpx;
  height: 42rpx;
  line-height: 42rpx;
  top: -32rpx;
  right: -64rpx;
}

.rankIcon {
  position: absolute;
  width: 100%;
  height: 42rpx;
  z-index: 0;
}

.rankIconContent span {
  width: 100%;
  text-align: center;
  font-size: 24rpx;
  color: #333;
  position: absolute;
  z-index: 1;
}


/*未绑定状态用户栏*/

.user_noFlag {
  width: auto;
  height: auto;
  margin-bottom: 32rpx;
  position: relative;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}


/*未绑定上方*/

.user_noFlag_top {
  width: 100%;
  height: auto;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.user_noFlag_top .addIcon {
  width: 64rpx;
  height: 64rpx;
  margin-right: 32rpx;
}

.user_noFlag_top .carIcon {
  width: 64rpx;
  height: auto;
  margin: 16rpx 0 0 32rpx;
}

.user_noFlag_title {
  font-size: 42rpx;
  letter-spacing: 1px;
  color: #fff;
}


/*人数标尺*/

.numberIconContent {
  min-width: 200rpx;
  height: 50rpx;
  line-height: 50rpx;
  top: -44rpx;
  right: -104rpx;
  position: absolute;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  padding: 0 4rpx;
}

.numberIconContent span {
  position: absolute;
  z-index: 1;
  font-size: 24rpx;
  margin-top: -4rpx;
  display: block;
  color: #ea4e3d;
  font-weight: bold;
}

.numberIcon {
  position: absolute;
  width: 100%;
  height: 100%;
}


/*未绑定标语*/

.user_noFlag_sign {
  color: #fff;
}

.user_noFlag_sign.sign {
  margin: 16rpx 0;
}


/* 选项卡 */

.tabBar {
  width: 100%;
  height: 112rpx;
  background: #fff;
  color: #7D7D7D;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  -webkit-box-shadow: 1px 1px 1px 1px #eee;
  box-shadow: 1px 1px 1px 1px #eee;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
}

.tabBarChoose {
  color: #f8624a;
  border-bottom: 1px solid #f8624a;
}


/*其他选项*/

.tabBar_map {
  width: 100%;
  height: auto;
  margin-top: 32rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.tabBar_map_module {
  width: 80%;
  height: 96rpx;
  margin: 16rpx 0;
  font-size: 28rpx;
  border-radius: 8rpx;
  border: 1px solid #EFEFEF;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
  background: #fff;
}

.tabBar_map_module .tabIcon {
  width: 60rpx;
  height: 60rpx;
}

.tabBar_map_module .arrowIcon {
  width: 30rpx;
  height: 30rpx;
}


/*二维码*/

.showScanContent {
  width: 448rpx;
  height: auto;
  left: 50%;
  top: 20%;
  margin-left: -224rpx;
  position: fixed;
  z-index: 999;
  border: 1px solid #f8624a;
  border-radius: 8rpx;
}

.showScanContent span {
  width: 100%;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 0 0 8rpx 8rpx;
  background: #f8624a;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
}

.scanImg {
  width: 100%;
  height: 448rpx;
  background: #fff;
  border-radius: 8rpx 8rpx 0 0;
}


/*使用教程*/

.tutorialWin {
  position: fixed;
  width: 80%;
  height: auto;
  font-size: 28rpx;
  padding: 32rpx 0;
  margin-left: -40%;
  border-radius: 8rpx;
  background: #fff;
  top: 18%;
  left: 50%;
  z-index: 999;
}

.tutoriaContent {
  width: 100%;
  height: 90%;
  padding: 0 32rpx 32rpx;
  border-radius: 8rpx 8rpx 0 0;
}

.tutoriaContent p {
  margin-top: 32rpx;
}

.tutorTitle {
  width: 100%;
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin: 0 0 32rpx 0;
}

.titleSign {
  width: 100%;
  text-align: center;
  color: #f8624a;
  font-weight: bold;
}

.p_sign {
  color: #f8624a;
  font-weight: bold;
}

.tutoriaFooter {
  height: 10%;
  color: #f8624a;
  margin-bottom: 16rpx;
  font-size: 32rpx;
  border-radius: 0 0 8rpx 8rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}


/*页脚*/

.footerHack {
  width: 100%;
  height: 128rpx;
  background: none;
}

.footer {
  width: 100%;
  height: 128rpx;
  background: #fff;
  color: #999;
  font-size: 28rpx;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
}

.footer div,
.footer a {
  text-decoration: none;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.footer img {
  width: 54rpx;
  height: 54rpx;
  margin-bottom: 8rpx;
}
</style>
