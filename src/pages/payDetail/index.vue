<template>
  <div class="payDetail borderBox">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <!-- 缴费详细 -->
    <div class="detailMsg">
      <div class="detailMsg_one">
        <div class="flexRow pay_succeed">
          <div class="pay_img">
            <img v-if="Confirm_payment" :src="imgUrl.weizhifu" />
            <img v-else :src="imgUrl.pay_success" />
          </div>
          <div class="pay_p1">
            <p class="pay_p2">{{payMsgList.trade_state}}</p>
            <p :class="['pay_p3',{pay_no: Confirm_payment}]">RMB：{{money}}元</p>
          </div>
        </div>
        <!-- 详情内容 -->
        <div class="for_pay">
          <div class="pay_center">
            <ul>
              <li class="flexRow pay_li" v-if="!Confirm_payment">
                <span>付款方式</span>
                <span>{{payMsgList.payment}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>商品说明</span>
                <span>微信余额</span>
              </li>
              <li class="flexRow pay_li">
                <span>账单分类</span>
                <span>微信余额</span>
              </li>
              <li class="flexRow pay_li">
                <span>积分奖励</span>
                <span>微信余额</span>
              </li>
            </ul>
          </div>
          <div class="pay_center">
            <ul>
              <li class="flexRow pay_li">
                <span>创建时间</span>
                <span>{{payMsgList.create_time}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>订单编号</span>
                <span>{{payMsgList.out_trade_no}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>进站点</span>
                <span>{{payMsgList.in_pos_id}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>进站时间</span>
                <span>{{payMsgList.in_time}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>出站点</span>
                <span>{{payMsgList.out_pos_id}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>出站时间</span>
                <span>{{payMsgList.out_time}}</span>
              </li>
              <li class="flexRow pay_li">
                <span>商户名称</span>
                <span>吉林省腾放科技有限公司</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 投诉列表 -->
      <div class="pay_footer">
        <!-- 弹出客服弹窗 -->
        <div class="pay_center1 flexRow" @click="showConfirmPhone">
          <span>对此订单由此疑问</span>
          <img :src="imgUrl.pay_right">
        </div>
        <!-- 跳转投诉列表 -->
        <a href="../complaint/main" class="pay_center1 flexRow pay_border">
          <span>投诉</span>
          <img :src="imgUrl.pay_right">
        </a>
      </div>
      <div v-if="Confirm_payment" class="Confirm_payment" @click="payMoneyBtn">确认支付</div>
    </div>
    <!-- confirm组件 -->
    <div class="confirmWin" v-if="conMask">
      <div class="mask"></div>
      <div class="confirmWinContnt">
        <!-- 头部 -->
        <div class="confirmWin_Top flexCol">
          <!-- 插入上方信息图片 -->
          <img :src="conImg_1" class="confirmTopImg">
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
// 导入图片
import pay_right from '@/assets/pay/pay_right.png'
import conKe from '@/assets/common/conKe.png'
import pay_success from '@/assets/pay/pay_success.png'
import weizhifu from '@/assets/pay/weizhifu.png'

export default {
  name: 'payDetail',
  data() {
    return {
      imgUrl: {
        pay_right,
        conKe,
        pay_success,
        weizhifu
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // 订单id
      detailId: null,
      // 支付额度
      money: "0",
      // confirm相关
      conMask: false,
      conImg_1: conKe,
      conTitle: '',
      conContent: '',
      conSubBtn: '拨打',
      // 支付相关
      payMsgList: [],
      Confirm_payment: true
    }
  },
  onLoad(option) {
    if (option.id) {
      this.detailId = option.id;
      this.money = option.money / 100;
      // 获取订单详细数据
      this.getPayDetail();
    }
  },
  methods: {
    // 显示客服电话弹窗
    showConfirmPhone() {
      this.conMask = true;
      this.conTitle = '客服电话';
      this.conContent = '0431-81872579';
      this.conSubBtn = '拨打';
    },
    conCancelBtn() {
      this.conMask = false;
    },
    // 客服电话
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: '0431-81872579'
      })
    },
    // 获取订单详细数据
    getPayDetail() {
      let that = this;
      // 获取订单详细数据
      this.$http.post(this.$api.payDetail, {
          log_id: this.detailId
        }, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 获取详细数据放在data中
          that.payMsgList = res.data.data;
          //判断是否支付成功
          if (res.data.data.trade_state == "支付成功") {
            that.Confirm_payment = false;
          }
          if (res.data.data.trade_state == "未支付") {
            that.Confirm_payment = true;
          }
        })
        .catch(function(err) {
          that.errShow = true;
          that.errTxt = '网络错误,请返回上一页';
          var errLoading = setTimeout(function() {
            that.errShow = false;
            that.errTxt = ''
            clearTimeout(errLoading);
          }, 2000);
        });
    },
    // 确认还款
    payMoneyBtn() {
      let that = this;
      // 获取支付相关数据
      this.$http.get(this.$api.getPayMsg, {
          ordernum: this.payMsgList.out_trade_no
        }, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 发起小程序微信支付
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function(ssdata) {
              // 重新获取订单详细数据
              that.getPayDetail();
            },
            'fail': function(sserr) {
              // 处理失败或取消支付的字符串
              let data = sserr.errMsg.replace('requestPayment:fail ', '');
              // 取消支付
              if (data == "cancel") {
                wx.showToast({
                  title: '取消支付',
                  icon: 'loading',
                  duration: 1500
                });
              }
              // 支付失败
              if (data != "cancel") {
                wx.showToast({
                  title: '支付失败',
                  icon: 'loading',
                  duration: 1500
                });
              }
            }
          })
        })
        .catch(function(err) {
          wx.showToast({
            title: '调用支付失败',
            icon: 'loading',
            duration: 1500
          });
        })
    }
  }
}
</script>
<style scoped>
.detailMsg {
  padding: 32rpx;
}

.detailMsg_one {
  border: 1px solid #ddd;
  border-radius: 9.6rpx;
}

.pay_succeed {
  justify-content: center;
  padding: 40rpx 0;
}

.pay_img {
  margin-right: 32rpx;
  margin-top: 16rpx;
}

.pay_img img {
  width: 66rpx;
  height: 66rpx;
}

.pay_p2 {
  font-size: 32rpx;
}

.pay_p3 {
  font-size: 32rpx;
  color: #22ac38;
}

.pay_center {
  padding: 20rpx;
  border-top: 1px solid #ddd;
}

.pay_center1 {
  padding: 20rpx;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
}

.pay_center1 img {
  width: 16rpx;
  height: 28rpx;
}

.pay_li {
  justify-content: space-between;
  font-size: 28rpx;
  line-height: 51.2rpx;
}

.pay_li:nth-child(1) {
  color: #a7a7a7;
}

.pay_footer {
  font-size: 28rpx;
  border: 1px solid #ddd;
  border-radius: 9.6rpx;
  margin-top: 32rpx;
}

.pay_border {
  border-top: 1px solid #ddd;
}

.pay_footer a {
  color: #333;
  font-size: 28rpx;
}

.Confirm_payment {
  font-size: 28rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: #f76149;
  border-radius: 9.6rpx;
  color: #fff;
  text-align: center;
  margin: 32rpx 0;
}

.pay_no {
  color: #E73838;
}
</style>
