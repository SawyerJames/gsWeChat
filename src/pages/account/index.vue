<template>
  <div class="account">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <!-- 验证提示 -->
    <h1 class="validate" v-if="validate">{{validate}}</h1>
    <!-- alert组件 -->
    <alert :alert="alert" :title="title" :text="text"></alert>
    <!-- 用户信息 -->
    <div class="topIndex">
      <div class="flexRow userInfoContent_Flag">
        <div class="user_Flag flexRow">
          <!-- 已绑定头像与积分 -->
          <div class="user_Flag_img_content">
            <open-data class="user_Flag_img" type="userAvatarUrl" background-size="cover"></open-data>
            <div class="user_Flag_rank_content">
              <span>当前积分0</span>
            </div>
          </div>
          <!-- 个人信息 -->
          <div class="user_Flag_content flexCol">
            <open-data class="nick_name" type="userNickName"></open-data>
            <div class="car_phoneContent flexRow">
              <span class="phone">电话：{{userInfo.phone}}</span>
              <span class="modPhoneBtn" @click="modPhone">修改</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改手机号弹窗 -->
    <div class="mask" v-if="mask" @click="closeMask"></div>
    <div class="modPhoneWin" v-if="mask">
      <div class="modPhoneModule flexRow">
        <span class="modPhoneTitle">联系方式</span>
        <input class="flex_1" type="number" maxlength="11" v-model="mod_phone.phone" />
      </div>
      <div class="modPhoneModule flexRow">
        <span class="modPhoneTitle">验证号码</span>
        <input type="tel" class="flex_1" name="verification" maxlength="6" placeholder="请输入验证码" v-model.trim="mod_phone.verification"></input>
        <!-- 获取验证码按钮 -->
        <button class="modPhoneVate" type="button" @click="getCode()" :disabled="!showVer">
          <span v-show="showVer">获取验证码</span>
          <span v-show="!showVer">重新获取({{count}}s)</span>
        </button>
      </div>
      <div class="modPhoneModule flexRow noBorder">
        <button class="modPhonePostBtn" type="button" @click="postPhone">提交</button>
      </div>
    </div>
    <!-- 车辆信息栏 -->
    <div class="carContent">
      <!-- 车辆信息模块，每一项判断是否检测到信息 -->
      <div class="carModule flexRow">
        <span class="carModule_left">车牌号:</span>
        <span class="carModule_right" v-if="userInfo.car_number">{{userInfo.car_number}}</span>
        <span class="carModule_right" v-else>暂未检测到信息</span>
      </div>
      <div class="carModule flexRow">
        <span class="carModule_left">车辆类型:</span>
        <span class="carModule_right" v-if="userInfo.car_type">{{userInfo.car_type}}</span>
        <span class="carModule_right" v-else>暂未检测到信息</span>
      </div>
      <div class="carModule flexRow">
        <span class="carModule_left">核定载人数:</span>
        <span class="carModule_right" v-if="userInfo.load_number">{{userInfo.load_number}}</span>
        <span class="carModule_right" v-else>暂未检测到信息</span>
      </div>
      <div class="carModule flexRow">
        <span class="carModule_left">发动机号:</span>
        <span class="carModule_right" v-if="userInfo.engine">{{userInfo.engine}}</span>
        <span class="carModule_right" v-else>暂未检测到信息</span>
      </div>
      <div class="carModule flexRow">
        <span class="carModule_left">车辆识别号码:</span>
        <span class="carModule_right" v-if="userInfo.frame_num">{{userInfo.frame_num}}</span>
        <span class="carModule_right" v-else>暂未检测到信息</span>
      </div>
    </div>
    <!-- 报错 -->
    <div class="errorBtnContent flexRow">
      <button type="button" class="errorBtn" @click="showConfirmPhone">报错</button>
    </div>
    <!-- confirm组件 -->
    <div class="confirmWin" v-if="conMask">
      <div class="mask"></div>
      <div class="confirmWinContnt">
        <!-- 头部 -->
        <div class="confirmWin_Top flexCol">
          <!-- 插入上方信息图片 -->
          <img :src="conImg_2" class="confirmTopImg">
          <span class="confirmTitle">{{conTitle}}</span>
        </div>
        <!-- 中间 -->
        <div class="confirmWin_middle flexRow">
          <div class="confirmMsg" v-html="conContent"></div>
        </div>
        <!-- 尾部 -->
        <div class="confirmWin_footer flexRow">
          <span class="confirm_cel" @click="conCancelBtn">取消</span>
          <span class="confirm_sub" @click="callPhone">{{conSubBtn}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import alert from '@/components/alert'
// 导入图片
import headerImg from '@/assets/common/headerImg.png'
export default {
  name: 'account',
  data() {
    return {
      imgUrl: {
        headerImg
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // confirm相关
      conMask: false,
      conImg_2: require('../../assets/common/conKe.png'),
      conTitle: '',
      conContent: '',
      conSubBtn: '确定',
      // alert相关
      alert: false,
      title: '温馨提示',
      text: '',
      // 验证
      validate: '',
      // 用户信息修改
      mask: false,
      mod_name: false,
      // 修改手机
      mod_phone: {
        phone: '',
        verification: ''
      },
      // 验证码
      showVer: true,
      count: '',
      timer: null,
      TIME_COUNT: 60,
      // 用户信息&绑定状态
      userInfo: {}
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
        that.errTxt = '网络错误';
      })
  },
  methods: {
    // 修改手机
    modPhone() {
      this.mask = true;
    },
    closeMask() {
      this.mask = false;
      // 数据置零
      this.mod_phone.phone = '';
      this.mod_phone.verification = '';
      this.showVer = true;
      this.count = '';
      this.timer = null;
      this.TIME_COUNT = 60;
    },
    // 获取验证码
    getCode() {
      let that = this;
      var phone = this.mod_phone.phone,
        phoneRe = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (phoneRe.test(phone)) {
        // 如果不为空的定时器
        if (!this.timer) {
          // 开始计数
          this.count = this.TIME_COUNT;
          this.showVer = false;
          // 定时器读秒
          this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= this.TIME_COUNT) {
              this.count--;
            } else {
              this.showVer = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
          // 开始获取验证码
          this.$http.post(this.$api.getCode, {
              phone: this.mod_phone.phone,
            }, {
              headers: {
                'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
              }
            })
            .then(function(res) {
              if (res.data.errmsg != "OK") {
                that.validate = '验证码获取失败'
                setTimeout(function() {
                  that.validate = ''
                }, 1500);
              }
            })
            .catch(function(err) {
              that.errShow = true;
              that.errTxt = '网络错误,请重新获取';
              var errLoading = setTimeout(function() {
                that.errShow = false;
                that.errTxt = '';
                that.showVer = true;
                that.count = '';
                that.timer = null;
                that.TIME_COUNT = 60;
                clearTimeout(errLoading);
              }, 2000);
            });
        }
      } else {
        that.validate = '手机号码格式不正确'
        setTimeout(function() {
          that.validate = ''
        }, 1500);
      }
    },
    // 修改手机号
    postPhone() {
      let that = this;
      // 获取用户信息
      var phone = this.mod_phone.phone,
        verification = this.mod_phone.verification;
      // 正则
      var phoneRe = /^[1][3,4,5,7,8,9][0-9]{9}$/,
        verificationRe = /^\d{6}$/;
      // 表单验证
      if (phoneRe.test(phone)) {
        if (verificationRe.test(verification)) {
          this.validate = '';
          this.$http.post(this.$api.postChangePhone, {
              phone: this.mod_phone.phone,
              code: this.mod_phone.verification
            }, {
              headers: {
                'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
              }
            })
            .then(function(res) {
              // 成功通过接口后判断是否正确修改手机号
              if (res.data.state != 0) {
                that.mask = false;
                that.alert = true;
                that.text = res.data.msg;
                var hideAlert = setTimeout(function() {
                    that.alert = false;
                    clearTimeout(hideAlert);
                  }, 1500)
                  // 清空填写的手机号及验证码信息
                that.mod_phone.phone = '';
                that.mod_phone.verification = '';
              }
              // 手机号修改正常情况下
              else {
                that.mask = false;
                that.alert = true;
                that.text = res.data.data;
                var hideAlert = setTimeout(function() {
                  that.alert = false;
                  clearTimeout(hideAlert);
                }, 1500)
                that.userInfo.phone = that.mod_phone.phone;
                // 清空填写的手机号及验证码信息
                that.mod_phone.phone = '';
                that.mod_phone.verification = '';
              }
            })
            .catch(function(err) {
              that.errShow = true;
              that.errTxt = '网络错误,请重新修改';
              var errLoading = setTimeout(function() {
                that.errShow = false;
                that.errTxt = '';
                that.showVer = true;
                that.count = '';
                that.timer = null;
                that.TIME_COUNT = 60;
                clearTimeout(errLoading);
              }, 2000);
            });
        } else {
          that.validate = '验证码不正确'
          setTimeout(function() {
            that.validate = ''
          }, 1500);
        }
      } else {
        that.validate = '手机号码格式不正确'
        setTimeout(function() {
          that.validate = ''
        }, 1500);
      }
    },
    // 显示客服电话弹窗
    showConfirmPhone() {
      this.conMask = true;
      this.conTitle = '客服电话';
      this.conContent = '0431-81872579';
      this.conSubBtn = '拨叫';
    },
    conCancelBtn() {
      this.conMask = false;
    },
    // 客服电话
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: '0431-81872579'
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
.validate {
  z-index: 9999;
}


/*用户信息栏*/

.topIndex {
  width: 100%;
  min-height: 352rpx;
  background: #f8624a;
}

.userInfoContent_Flag {
  width: 100%;
  height: 352rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
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
  display: block;
  overflow: hidden;
}

.user_Flag_rank_content {
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 16rpx;
  background: #f9e638;
  border-radius: 32rpx;
  position: absolute;
  bottom: 0;
  left: -.64rpx;
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
  margin-bottom: 16rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}


/*手机修改弹窗*/

.car_phoneContent {
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.phone {
  margin-right: 16rpx;
}

.modPhoneBtn {
  border-radius: 8rpx;
  padding: 0 16rpx;
  background: #da472f;
}

.modPhoneWin {
  width: 80%;
  height: auto;
  background: #f8624a;
  border-radius: 8rpx;
  margin: 32rpx 0 0 -42%;
  padding: 16rpx;
  position: fixed;
  z-index: 999;
  color: #fff;
  left: 50%;
}


/*修改手机弹窗，每一个小模块*/

.modPhoneModule {
  height: 80rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #C43B25;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
}

.modPhoneTitle {
  margin-right: 16rpx;
}

.modPhoneModule input {
  width: 192rpx;
  height: 57.6rpx;
  border: none;
  outline: none;
  border-radius: 8rpx;
  background: #fff;
  color: #333;
}

.modPhoneVate {
  margin-left: 16rpx;
  width: 192rpx;
  height: 57.6rpx;
  line-height: 57.6rpx;
  border: none;
  outline: none;
  border-radius: 8rpx;
  background: #C43B25;
  color: #fff;
}

.modPhonePostBtn {
  width: 70%;
  margin: 0 auto;
  height: 57.6rpx;
  line-height: 57.6rpx;
  border: none;
  outline: none;
  border-radius: 8rpx;
  background: #800000;
  color: #fff;
}


/*状态信息栏*/

.carContent {
  width: 95%;
  height: auto;
  border-radius: 8rpx;
  border: 1px solid #ddd;
  margin: 32rpx auto;
}

.carModule {
  padding: 0 16rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  -ms-align-items: center;
  align-items: center;
}

.carModule_left {
  height: 32rpx;
  line-height: 32rpx;
  border-left: 2px solid #ddd;
  padding-left: 12rpx;
  width: 224rpx;
}


/*报错*/

.errorBtnContent {
  width: 100%;
  height: 80rpx;
  margin-top: 32rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.errorBtn {
  width: 90%;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 28rpx;
  border: none;
  outline: none;
  color: #fff;
  border-radius: 16rpx;
  background: #f76149;
}
</style>
