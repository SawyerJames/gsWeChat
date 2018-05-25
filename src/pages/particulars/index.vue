<template>
  <div class="FAQ_particulars">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <div class="content borderBox">
      <p class="FAQ_title">{{faq_tittle}}</p>
      <div v-html="faq_content"></div>
    </div>
    <general></general>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import general from '@/components/general'
export default {
  name: 'particulars',
  data() {
    return {
      particulars: null,
      faq_content: '',
      faq_tittle: '',
      // 报错弹窗
      errShow: false,
      errTxt: ''
    }
  },
  onLoad(option) {
    let that = this;
    // 获取上一页的参数
    this.particulars = option.id;
    this.faq_tittle = option.title;
    // 获取常见问题详细数据
    this.$http.post(this.$api.getFAQDetail, {
        id: this.particulars
      }, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        var faq_data = res.data;
        that.faq_content = faq_data.data.content;
      })
      .catch(function(err) {
        that.errShow = true;
        that.errTxt = '网络错误,请返回上一页';
        var errLoading = setTimeout(function() {
          that.errShow = false;
          that.errTxt = ''
          clearTimeout(errLoading);
        }, 2000);
      })
  },
  components: {
    errAlert,
    general
  }
}
</script>
<style scoped>
.content {
  width: 100%;
  height: auto;
  padding: 32rpx;
  font-size: 28rpx !important;
}

.content div,
.content div p {
  text-indent: 56rpx;
}

.FAQ_title {
  font-weight: bold;
  margin-bottom: 30rpx;
}
</style>
