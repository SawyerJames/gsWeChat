<template>
  <div class="statement borderBox">
    <!-- 循环常见问题列表 -->
    <div class="more_Ul" v-for="list in lists">
      <!-- 外部 -->
      <div>
        <a :href="list.path" class="more_li flexRow">
          <span class="span_Title">{{list.title}}</span>
          <transition name="my-trans">
            <img :src="imgUrl.setting_img" class="arrow">
          </transition>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import setting_img from '@/assets/setting_img/arrow.png'
export default {
  name: 'statement',
  data() {
    return {
      imgUrl: {
        setting_img
      },
      lists: [{
        title: '免责协议',
        path: '../disclaimer/main'
      }, {
        title: '隐私协议',
        path: '../privacy/main'
      }, {
        title: '服务条款',
        path: '../registerTxt/main'
      }]
    }
  }
}
</script>
<style scoped>
.statement {
  width: 100%;
  height: 100%;
  padding: 32rpx 16rpx;
  background: url(../../assets/common/commonBg.png) no-repeat bottom;
  background-size: 100%;
}

.more_Ul {
  border-bottom: 1px solid #e0e0de;
}


/*常见问题外层li*/

.more_li {
  padding: 0 24rpx;
  height: 73.6rpx;
  line-height: 73.6rpx;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
  font-size: 32rpx;
}


/*三角转换*/

.more_li .arrowTransform {
  width: 32rpx;
  height: 32rpx;
  transition: all 0.1s ease-out;
  transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -o-transform: rotate(0deg);
}

.arrow {
  width: 32rpx;
  height: 32rpx;
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
}


/*问题标题*/

.span_Title {
  width: 100%;
  display: block;
  font-size: 28rpx;
  color: #757575;
  font-weight: bold;
}


/*内部*/

.in_faq {
  line-height: 64rpx;
  padding-left: 80rpx;
  padding-right:16rpx;
  border-top: 1px solid #e0e0de;
  font-size: 28rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
</style>
