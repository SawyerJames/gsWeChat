<template>
  <div class="complaint">
    <!-- 投诉类型 -->
    <div class="complaintType flexCol">
      <div class="complaint_module typeSign flexRow">
        <span>请选择投诉商户的原因</span>
      </div>
      <a class="complaint_module flexRow" href="../complaintType/main?type=涉嫌返利、多级代理分销">
        <span>涉嫌返利、多级代理分销</span>
        <img :src="imgUrl.arrow">
      </a>
      <a class="complaint_module flexRow" href="../complaintType/main?type=涉及赌博、淫秽等传播信息">
        <span>涉及赌博、淫秽等传播信息</span>
        <img :src="imgUrl.arrow">
      </a>
      <a class="complaint_module flexRow" href="../complaintType/main?type=涉及套取金额">
        <span>涉及套取金额</span>
        <img :src="imgUrl.arrow">
      </a>
      <a class="complaint_module flexRow" href="../complaintType/main?type=其他">
        <span>其他</span>
        <img :src="imgUrl.arrow">
      </a>
    </div>
    <!-- 投诉须知 -->
    <a href="../complaintMsg/main" class="complaintBottom">
      <span>投诉须知</span>
    </a>
  </div>
</template>
<script>
import arrow from '@/assets/center/arrow.png'
export default {
  name: 'complaint',
  data() {
    return {
      imgUrl: {
        arrow
      }
    }
  }
}
</script>
<style scoped>
.complaint {
  width: 100%;
  height: 100%;
  background: url(../../assets/common/commonBg.png) no-repeat bottom;
  background-size: contain;
}

.complaintType {
  width: 100%;
  height: auto;
  padding-top: 32rpx;
  -ms-align-items: center;
  align-items: center;
}


/*每个投诉类型模型*/

.complaint_module {
  width: 90%;
  height: 80rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
}

.typeSign {
  color: #f8624a;
  font-weight: bold;
}

.complaint_module img {
  width: 16rpx;
  height: 28rpx;
}


/*投诉须知*/

.complaintBottom {
  width: 100%;
  height: auto;
  font-size: 28rpx;
  color: #999;
  text-align: center;
  position: fixed;
  bottom: 128rpx;
}
</style>
