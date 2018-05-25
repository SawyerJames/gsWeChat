<template>
  <div class="set borderBox">
    <ul>
      <a class="flexRow setting" v-for="(item,index) in list" :href="item.path + '?set_index=' + index">
        <div class="flexRow setting_one">
          <img :src="item.setting_img" class="sz_img">
          <span>{{item.option}}</span>
        </div>
        <div>
          <img :src="imgUrl.setting_img" class="sz_img">
        </div>
      </a>
    </ul>
  </div>
</template>
<script>
import setting_img from '@/assets/setting_img/sz_img.jpg'
import sz_cjwt_03 from '@/assets/setting_img/sz_cjwt_03.jpg'
import sz_xysm_15 from '@/assets/setting_img/sz_xysm_15.jpg'
import sz_syzn_09 from '@/assets/setting_img/sz_syzn_09.jpg'
import sz_wgzf_12 from '@/assets/setting_img/sz_wgzf_12.jpg'
export default {
  name: 'settingIndex',
  data() {
    return {
      imgUrl: {
        setting_img
      },
      list: [{
        option: '常见问题',
        path: '../FAQ/main',
        setting_img: sz_cjwt_03
      }, {
        option: '意见反馈',
        path: '../feedback/main',
        setting_img: sz_xysm_15
      }, {
        option: '使用指南',
        path: '../operating/main',
        setting_img: sz_syzn_09
      }, {
        option: '无感付介绍',
        path: '../noninductive/main',
        setting_img: sz_wgzf_12
      }, {
        option: '协议声明',
        path: '../statement/main',
        setting_img: sz_xysm_15
      }]
    }
  }
}
</script>
<style scoped>
.set {
  width: 100%;
  height: 100%;
  padding: 16rpx 5% 0;
  background: url(../../assets/common/commonBg.png) no-repeat bottom;
  background-size: contain;
}

.setting {
  height: 96rpx;
  font-size: 28rpx;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
}

.setting_one {
  -ms-align-items: center;
  align-items: center;
}

.setting_one span {
  margin-left: 32rpx;
}

.setting_one img {
  width: 48rpx;
  height: 48rpx;
}

.sz_img {
  width: 16rpx;
  height:26rpx;
}
</style>
