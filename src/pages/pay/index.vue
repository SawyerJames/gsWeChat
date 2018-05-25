<template>
  <div class="pay">
    <!-- 报错 -->
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <div class="pay_one">
      <!-- 筛选栏 -->
      <div class="search flexRow">
        <picker class="selectType" @change="changeType" :value="typeIndex" :range="typeArray">
          <view class="picker">
            {{typeArray[typeIndex]}}
          </view>
        </picker>
        <picker class="group flexRow" mode="date" fields="month" :value="dataValue" start="2018-01" :end="dataValue" @change="changeGetData">
          <view class="picker">{{dataValue}}</view>
        </picker>
      </div>
      <!-- 列表栏：scroller下拉刷新 payFlag为数据是否为空 -->
      <div class="scrollView">
        <!-- 列表栏容器 -->
        <div class="listContent">
          <div tag="div" class="list_module flexRow" v-for="(item,index) in payList" @click="goDetailPage(item.id,item.pay_total_fee)">
            <div class="list_left">
              <p>{{item.in_pos_id}}——{{item.out_pos_id}}</p>
              <ul class="list_ul">
                <li class="in_station">进站时间：{{item.in_time}}</li>
                <li class="out_station">进站时间：{{item.out_time}}</li>
              </ul>
            </div>
            <div class="list_right">
              <p class="right">通行费用</p>
              <p class="list_money">{{item.pay_total_fee/100}}元</p>
              <p v-bind:class="item.is_pay==='已支付'?'blackColor':'redColor'" class="right">{{item.is_pay}}</p>
              <p class="list_examine">查看详情</p>
            </div>
          </div>
        </div>
        <div class="onReachBottomContent">
          <div v-if="hasMore" class="reachContent">
            <icon type="waiting" size="20" />
            <text>奋力加载中...</text>
          </div>
          <div v-else class="reachContent">
            <text>没有更多内容了</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from "@/components/errAlert";
export default {
  name: 'pay',
  data() {
    return {
      // 类别
      typeArray: ['高速', '停车', '出行'],
      typeIndex: 0,
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // 日期筛选
      dataValue: '',
      maxYear: null,
      // 缴费明细
      payList: [],
      // 缴费明细数据是否为空
      payFlag: 1,
      // 页数
      page: 1,
      // 上拉提示
      hasMore: false
    }
  },
  onShow() {
    let that = this;
    // 格式化日期
    let datetime = new Date();
    let month = datetime.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    let formatData = datetime.getFullYear() + '-' + month;
    this.dataValue = formatData;
    // 进入后获取当月缴费数据
    this.page = 1;
    this.getPayMsg();
  },
  methods: {
    // 携带ID跳转至详情页
    goDetailPage(id, money) {
      wx.navigateTo({
        url: '../payDetail/main?id=' + id + '&money=' + money
      })
    },
    // 改变类别
    changeType(e) {
      this.typeIndex = e.mp.detail.value;
      // 重置页数
      this.page = 1;
      this.getPayMsg();
    },
    // 页面加载时&改变日期，类别时获取缴费数据
    getPayMsg() {
      let that = this;
      this.$http.post(this.$api.getPay, {
          page: this.page,
          type: this.typeIndex + 1,
          time: this.dataValue
        }, {
          headers: {
            'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
          }
        })
        .then(function(res) {
          // 如果页数为1，初始加载
          if (that.page == 1) {
            // 有数据的情况下
            if (res.data.data.length > 0) {
              let resPayList = res.data.data;
              that.payList = resPayList;
            }
            // 没有数据的情况下
            else {
              that.payList = [];
            }
          }
          // 如果页数为2以上，上拉加载
          if (that.page >= 2) {
            // 有数据的情况下
            if (res.data.data.length > 0) {
              let resPayList = res.data.data;
              // 追加数据
              for (let item in resPayList) {
                that.payList.push(resPayList[item]);
              }
              // 关闭下拉刷新提示
              setTimeout(function() {
                wx.hideLoading();
              }, 2000);
            }
            // 没有数据
            else {
              that.hasMore = false;
              wx.hideLoading();
            }
          }
        })
        .catch(function(err) {
          console.log(err);
          that.errShow = true;
          that.errTxt = '网络错误,请刷新重试';
          var errLoading = setTimeout(function() {
            that.errShow = false;
            that.errTxt = ''
            clearTimeout(errLoading);
          }, 2000);
        })
    },
    // 改变日期获取缴费信息
    changeGetData(e) {
      // 重置页数
      this.page = 1;
      // 存入更新的日期
      this.dataValue = e.mp.detail.value;
      this.getPayMsg();
    },
  },
  // 上拉加载更多
  onReachBottom() {
    this.page += 1;
    this.hasMore = true;
    this.getPayMsg();
  },
  components: {
    errAlert
  }
}
</script>
<style scoped>
/*页面背景*/

.pay {
  /*height: 100%;*/
  background: #fafafa;
}

.pay_one {
  /*height: 100%;*/
  background: #fafafa;
  display: flex;
  flex-direction: column;
}


/*搜索*/

.search {
  width: 100%;
  background: #f8624a;
  height: 60rpx;
  padding: 24rpx 0;
  justify-content: space-around;
}


/* 日期筛选 */

.group {
  width: 70%;
  background: #ffffff;
  border-radius: 8rpx;
  color: #a7a7a7;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  font-size: 28rpx;
}

.datetime {
  text-decoration: none;
}


/*类型筛选*/

.selectType {
  width: 25%;
  border: 0;
  text-align: center;
  border-radius: 8rpx;
  background: #fff;
  color: #a7a7a7;
  outline: none;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}


/*暂无数据提示*/

.signContent {
  width: 100%;
  height: 32rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}


/*滚动容器*/

.scrollView {
  width: 100%;
}


/*列表容器*/

.listContent {
  padding: 0 32rpx;
  margin-top: 32rpx;
}

.list_module {
  padding: 32rpx 20rpx 16rpx 20rpx;
  background: #ffffff;
  justify-content: space-between;
  border-radius: 8rpx;
  border: 1px solid #e0e0de;
  margin-bottom: 32rpx
}

.list_module:last-child {
  margin-bottom: 0;
}

.list_left {
  width: 70%;
  font-size: 28rpx;
}

.list_right {
  width: 25%;
  font-size: 28rpx;
}

.list_ul {
  margin-top: 9.6rpx;
}

.list_ul li {
  color: #a7a7a7;
  font-size: 24rpx;
  padding-left: 20rpx;
}

.right {
  text-align: right;
}

.list_money {
  font-size: 32rpx;
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


/*支付配色*/

.redColor {
  color: #E73838;
}

.blackColor {
  color: #999;
}


/*上拉刷新容器*/

.onReachBottomContent {
  width: 100%;
  height: 80rpx;
}

.reachContent {
  width: 100%;
  height: 80rpx;
  display: flex;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
  font-size: 24rpx;
}

.reachContent text {
  margin-left: 20rpx;
}
</style>
