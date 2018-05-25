<template>
  <div class="notice">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <!-- 公告标题 -->
    <h1 class="noticeTitle">{{noticeMsg.title}}</h1>
    <!-- 公告内容：v-html过滤内容标签 -->
    <div class="noticeContent" v-html="noticeMsg.content"></div>
    <!-- 底部背景 -->
    <div class="bgHack"></div>
    <img :src="imgUrl.commonBg" class="bottomBg">
  </div>
</template>
<script>
import commonBg from '@/assets/common/commonBg.png'
import errAlert from '@/components/errAlert'
export default {
  name: 'notice',
  data() {
    return {
      // 图片集
      imgUrl: {
        commonBg
      },
      noticeId: 0,
      noticeMsg: {
        title: '',
        content: ''
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
    }
  },
  onLoad(options) {
    let that = this;
    // 获取路由传递的通知公告id
    this.noticeId = options.id;
    // 由id获取详细数据
    this.$http.post(this.$api.getNoticeMsg, {
        id: this.noticeId
      }, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        // 接口获取成功
        if (res.data.state == 0) {
          that.noticeMsg.title = res.data.data.name;
          that.noticeMsg.content = res.data.data.content;
        }
      })
      .catch(function(err) {
        that.errShow = true;
        that.errTxt = '出现错误'
        var errLoading = setTimeout(function() {
          that.errShow = false;
          that.errTxt = ''
          clearTimeout(errLoading);
        }, 2000);
      });
  }
}
</script>
<style scoped>
.noticeTitle {
  width: 100%;
  height: auto;
  padding: 32rpx 0;
  text-align: center;
}

.noticeContent {
  width: 95%;
  margin: 0 auto;
  font-size: 28rpx;
}

.bottomBg {
  width: 100%;
  height: 96rpx;
  position: fixed;
  bottom: 0;
  left: 0;
}

.bgHack {
  width: 100%;
  height: 96rpx;
  background: none;
}
</style>
