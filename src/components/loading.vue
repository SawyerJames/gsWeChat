<template>
  <div class="loading">
    <div class="mask"></div>
    <img :src="loadingPage" class="lodImg">
  </div>
</template>
<script type="text/javascript">
import loadingPage from '@/assets/common/loadingPage.gif'
export default {
  data() {
    return {
      loadingPage
    }
  }
}
</script>
<style type="text/css" scoped>
.lodImg {
  position: fixed;
  width: 96rpx;
  height: 96rpx;
  margin-left: -80rpx;
  left: 50%;
  top: 30%;
  z-index: 9999;
}
</style>
