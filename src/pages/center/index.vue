<template>
  <div class="centerIndex">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <!-- alert组件 -->
    <alert :alert="alert" :title="title" :text="text"></alert>
    <!-- 用户信息 -->
    <div class="topIndex">
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
            <!-- 已绑定其他信息 -->
            <div class="user_Flag_content flexCol">
              <span class="nick_name">{{userInfo.nickname}}</span>
              <span class="car_number">车牌号：{{userInfo.car_number}}</span>
              <!-- <span class="phone">电话：{{userInfo.phone}}</span> -->
            </div>
          </div>
        </div>
        <!-- 未绑定时 -->
        <a :href="routerPath.register" v-else class="user_noFlag flexCol">
          <!-- 未绑定时上半部分 -->
          <div class="user_noFlag_top flexRow">
            <img :src="imgUrl.noFlag_bind" class="addIcon">
            <span class="user_noFlag_title">绑定您的爱车</span>
            <img :src="imgUrl.noFlag_icon" class="carIcon">
          </div>
          <!-- 人数标尺 -->
          <img :src="imgUrl.noFlag_number" class="numberIcon">
          <!-- 未绑定时下半部分 -->
          <span class="user_noFlag_sign sign">绑定后您将享受无感付更高水平的服务</span>
        </a>
      </div>
    </div>
    <!-- 选项 -->
    <div class="tabContent">
      <div @click="clickIntegral" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_1" class="tabIcon">
          <span>积分优惠</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </div>
      <a :href="routerPath.account" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_3" class="tabIcon">
          <span>账户信息</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </a>
      <a :href="routerPath.pay" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_4" class="tabIcon">
          <span>缴费明细</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </a>
      <div @click="clickIntegral" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_5" class="tabIcon">
          <span>发票打印</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </div>
      <div @click="showConfirmPhone" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_6" class="tabIcon">
          <span>客服电话</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </div>
      <a href="../settingIndex/main" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_7" class="tabIcon">
          <span>设置</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </a>
      <div v-if="userFlag == 1" @click="showConfirmUnbind" class="tabModule flexRow">
        <div class="flexRow">
          <img :src="imgUrl.tab_8" class="tabIcon">
          <span>立即解绑</span>
        </div>
        <img :src="imgUrl.arrow" class="arrawIcon">
      </div>
    </div>
    <!-- confirm组件 -->
    <div class="confirmWin" v-if="conMask">
      <div class="mask"></div>
      <div class="confirmWinContnt">
        <!-- 头部 -->
        <div class="confirmWin_Top flexCol">
          <!-- 插入上方信息图片 -->
          <img :src="imgUrl.conJie" v-if="conType == 0" class="confirmTopImg">
          <img :src="imgUrl.conKe" v-if="conType == 1" class="confirmTopImg">
          <span class="confirmTitle">{{conTitle}}</span>
        </div>
        <!-- 中间 -->
        <div class="confirmWin_middle flexRow">
          <div class="confirmMsg" v-html="conContent"></div>
        </div>
        <!-- 尾部 -->
        <div class="confirmWin_footer flexRow">
          <span class="confirm_cel" @click="conCancelBtn">取消</span>
          <span class="confirm_sub" @click="conSubmitBtn">{{conSubBtn}}</span>
        </div>
      </div>
    </div>
    <!-- 底部tapbar -->
    <div class="footerHack"></div>
    <div class="footer flexRow">
      <div @click="goIndex" class="flexCol">
        <img :src="imgUrl.footTabIndex">
        <span>首页</span>
      </div>
      <div class="flexCol">
        <img :src="imgUrl.footTabCenter_L">
        <span>个人中心</span>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import alert from '@/components/alert'
// 导入图片
import headerImg from '@/assets/common/headerImg.png'
import flag_rank from '@/assets/index/flag_rank.png'
import noFlag_bind from '@/assets/index/noFlag_bind.png'
import noFlag_icon from '@/assets/index/noFlag_icon.png'
import noFlag_number from '@/assets/index/noFlag_number.png'
import tab_1 from '@/assets/center/tab_1.png'
import tab_3 from '@/assets/center/tab_3.png'
import tab_4 from '@/assets/center/tab_4.png'
import tab_5 from '@/assets/center/tab_5.png'
import tab_6 from '@/assets/center/tab_6.png'
import tab_7 from '@/assets/center/tab_7.png'
import tab_8 from '@/assets/center/tab_8.png'
import arrow from '@/assets/center/arrow.png'
import conJie from '@/assets/common/conJie.png'
import conKe from '@/assets/common/conKe.png'
import footTabIndex from '@/assets/index/footTabIndex.png'
import footTabCenter_L from '@/assets/index/footTabCenter_L.png'
export default {
  name: 'centerIndex',
  data() {
    return {
      // 图片集
      imgUrl: {
        headerImg,
        flag_rank,
        noFlag_bind,
        noFlag_icon,
        noFlag_number,
        tab_1,
        tab_3,
        tab_4,
        tab_5,
        tab_6,
        tab_7,
        tab_8,
        arrow,
        conJie,
        conKe,
        footTabIndex,
        footTabCenter_L
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // confirm相关
      conMask: false,
      conTitle: '',
      conContent: '',
      conSubBtn: '确定',
      conType: 0,
      // alert相关
      alert: false,
      title: '小主别急',
      text: '此功能还在路上！',
      // 用户信息&绑定状态
      userFlag: 0,
      userInfo: {},
      userCheck: 0,
      // 路由变换组
      routerPath: {
        account: '../register/main',
        pay: '../register/main',
        setting: '../register/main',
        register: '../register/main'
      }
    }
  },
  onLoad() {
    let that = this;
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
        that.errTxt = '网络错误,请刷新重试';
      });
    // 加载用户绑定状态，更改路由变换组
    this.userFlag = wx.getStorageSync('userFlag');
    // 已经绑定的状态下
    if (this.userFlag == 1) {
      this.routerPath.account = '../account/main';
      this.routerPath.pay = '../pay/main';
      this.routerPath.setting = '../settingIndex/main';
    }
    // 未绑定的状态下
    else {
      this.userCheck = this.$store.state.userCheck;
      // 如果是老用户，跳转注册选择页
      if (this.userCheck != 0) {
        this.routerPath.account = '../registerChoose/main';
        this.routerPath.pay = '../registerChoose/main';
        this.routerPath.setting = '../registerChoose/main';
        this.routerPath.register = '../registerChoose/main';
      }
    }
  },
  methods: {
    // 跳转已开通业务
    goBusiness() {
      wx.redirectTo({
        url: '../business/main'
      })
    },
    // 点击非实现功能
    clickIntegral() {
      let that = this;
      this.alert = true;
      var hideAlert = setTimeout(function() {
        that.alert = false;
        clearTimeout(hideAlert);
      }, 1500)
    },
    // 显示解绑弹窗
    showConfirmUnbind() {
      this.conMask = true;
      this.conContent = this.userInfo.car_number;
      this.conSubBtn = '确定';
      this.conTitle = '您确定要解绑吗？';
      this.conType = 0;
    },
    // 显示客服电话弹窗
    showConfirmPhone() {
      this.conMask = true;
      this.conTitle = '客服电话';
      this.conContent = '0431-81872579';
      this.conSubBtn = '拨打';
      this.conType = 1;
    },
    conCancelBtn() {
      this.conMask = false;
    },
    // 弹窗确定事件
    conSubmitBtn() {
      let that = this;
      // 解绑用户信息
      if (this.conType == 0) {
        // 获取用户信息
        this.$http.get(this.$api.getUnbind, null, {
            headers: {
              'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
            }
          })
          .then(function(res) {
            // 解绑成功
            if (res.data.state == 0) {
              that.conMask = false;
              // wx.setStorageSync('userFlag', 0);
              wx.showToast({
                title: '解绑成功',
                icon: 'success',
                duration: 2000,
                success: function() {
                  setTimeout(function() {
                    wx.reLaunch({
                      url: '../loading/main'
                    });
                  }, 2000);
                }
              });
            };
            if (res.data.state == 621) {
              that.conMask = false;
              wx.showToast({
                title: res.data.msg,
                icon: 'loading',
                duration: 1500
              })
            };
          })
          .catch(function(err) {
            that.errTxt = '出现错误，请重新解绑'
            var errLoading = setTimeout(function() {
              that.errShow = false;
              that.errTxt = ''
              clearTimeout(errLoading);
              that.conMask = false;
            }, 2000);
          });
      };
      if (this.conType == 1) {
        // 客服电话
        wx.makePhoneCall({
          phoneNumber: '0431-81872579'
        })
      }
    },
    goIndex() {
      wx.reLaunch({
        url: '../index/main'
      })
    }
  },
  components: {
    errAlert,
    alert
  }
}
</script>
<style scoped>
/*上方主体*/

.topIndex {
  width: 100%;
  background: #f8624a;
}


/*用户状态栏*/

.userInfoContent {
  width: 100%;
  height: 384rpx;
  background: url(../../assets/index/userBg.png) no-repeat bottom;
  background-size: contain;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.userInfoContent_Flag {
  height: 320rpx;
  background: url(../../assets/index/userBg_flag.png) no-repeat bottom;
  background-size: contain;
}


/*绑定状态用户栏*/

.user_Flag {
  width: auto;
  height: auto;
  margin-bottom: 32rpx;
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
  height: 80rpx;
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
  font-size: 40rpx;
  letter-spacing: 1px;
  color: #fff;
}


/*人数标尺*/

.numberIcon {
  position: absolute;
  width: auto;
  height: 48rpx;
  top: -1.64rpx;
  right: -48rpx;
}


/*未绑定标语*/

.user_noFlag_sign {
  color: #fff;
  margin: 16rpx 0 !important;
}


/*选项栏*/

.tabContent {
  width: 95%;
  height: auto;
  margin: 0 auto;
}


/*每一个小选项模块*/

.tabModule {
  width: 100%;
  height: 96rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
}

.tabModule img {
  width: 48rpx;
  height: 48rpx;
}

.tabModule .arrawIcon {
  margin-right: 16rpx;
  width: 18rpx;
  height: 30rpx;
}

.tabModule span {
  margin-left: 24rpx;
}

.tabModule>div {
  -ms-align-items: center;
  align-items: center;
}


/*立即解绑*/

.submitBtnContent {
  width: 100%;
  height: 80rpx;
  margin: 32rpx 0;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.submitBtn {
  width: 90%;
  height: 64rpx;
  border: none;
  outline: none;
  color: #fff;
  border-radius: 16rpx;
  background: #f76149;
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
