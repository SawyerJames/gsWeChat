<template>
  <div class="blackPayment">
    <!-- 列表栏 -->
    <div class="listContent">
      <div class="list_module flexRow" v-for="(item,index) in payList.list">
        <div class="list_left">
          <p class="list_site">{{item.in_pos_id}}——{{item.out_pos_id}}</p>
          <ul class="list_ul">
            <li class="in_station">进站时间：{{item.in_time}}</li>
            <li class="out_station">进站时间：{{item.out_time}}</li>
          </ul>
        </div>
        <div class="list_right">
          <p class="list_site textRight">通行费用</p>
          <p class="list_money">{{item.pay_total_fee/100}}元</p>
          <p class="textRed list_site textRight">未支付</p>
        </div>
      </div>
      <div class="confirm" v-if="payTrue" @click="oneKeyPayment">一键还款</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'blackPayment',
  data() {
    return {
      // 代缴费列表
      payList: {},
      // 支付按钮
      payTrue: false
    }
  },
  onShow() {
    let that = this;
    // 获取黑名单时未交费列表
    this.$http.get(this.$api.blackUserPayment, null, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        that.payList = res.data.data;
        that.payTrue = true;
      })
      .catch(function(err) {
        wx.showToast({
          title: '获取列表失败',
          icon: 'loading',
          duration: 1500
        });
      });
  },
  methods: {
    // 一键还款
    oneKeyPayment() {
      let that = this;
      // 获取支付相关数据：传递订单编号组
      this.$http.post(this.$api.getBlackPayMsg, {
          ordernum: this.payList.merge_order
        }, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          console.log(res);
          // 发起小程序微信支付
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function(res) {
              // 支付成功后返回首页，首页会验证是否仍是黑名单
              wx.redirectTo({
                url: '../index/main'
              })
            },
            'fail': function(err) {
              // 处理失败或取消支付的字符串
              let data = err.errMsg.replace('requestPayment:fail ', '');
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
        });
    }
  },
}
</script>
<style scoped>
.listContent {
  width: 100%;
  box-sizing: border-box;
  padding: 32rpx;
}

.list_module {
  padding: 32rpx 16rpx 16rpx 16rpx;
  background: #ffffff;
  justify-content: space-between;
  border-radius: 16rpx;
  border: 1px solid #e0e0de;
  margin-bottom: 32rpx;
}

.list_left {
  width: 70%;
}

.list_right {
  width: 25%;
}

.list_site {
  font-size: 28rpx;
  color: #333;
}

.list_ul {
  margin-top: 10rpx;
}

.list_ul li {
  color: #a7a7a7;
  font-size: 24rpx;
  padding-left: 22rpx;
}

.textRight {
  text-align: right;
}

.list_money {
  margin-top: 10rpx;
  font-size: 28rpx;
  text-align: right;
  color: #22ac38
}

.list_examine {
  font-size: 28rpx;
  color: #f8624a;
  text-align: right;
}

.in_station {
  background: url(../../assets/pay/green.png) no-repeat left center;
}

.out_station {
  background: url(../../assets/pay/red.png) no-repeat left center;
}

.textRed {
  color: #f76149;
}

.confirm {
  font-size: 30rpx;
  text-align: center;
  background: #f76149;
  padding: 10rpx 0;
  border-radius: 30rpx;
  color: #fff;
  letter-spacing: 1px;
}
</style>
