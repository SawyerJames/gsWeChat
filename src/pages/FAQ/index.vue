<template>
  <div class="FAQ borderBox">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <div class="ulContainer">
      <!-- 循环常见问题列表 -->
      <div class="more_Ul" v-for="(list,index) in lists">
        <ul>
          <li class="more_li flexRow" @click="zhankai(index)">
            <span class="span_Title">{{list.title}}</span>
            <transition name="my-trans">
              <img :src="imgUrl.setting_img" ref="rotate" :class="currentIndex === index ?'arrowTransform':'arrow'">
            </transition>
          </li>
        </ul>
        <ul>
          <li v-for="(listChild,idx) in list.childer" v-if="currentIndex == index" class="in_faq" @click="goFAQlPage(listChild.id,listChild.title)">
            {{listChild.title}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import setting_img from '@/assets/setting_img/arrow.png'
export default {
  name: 'FAQ',
  data() {
    return {
      imgUrl: {
        setting_img
      },
      lists: [],
      currentIndex: null,
      currentFlag: false,
      // 报错弹窗
      errShow: false,
      errTxt: ''
    }
  },
  mounted() {
    let that = this;
    // 获取常见问题列表
    this.$http.get(this.$api.getFAQ, null, {
        headers: {
          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
        }
      })
      .then(function(res) {
        that.lists = res.data.data;
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
  methods: {
    // 展开列表
    zhankai(index) {
      if (this.currentIndex != index) {
        this.currentIndex = index;
      } else {
        this.currentIndex = null;
      }
    },
    // 跳转详细页，传递参数id，title
    goFAQlPage(id, title) {
      wx.navigateTo({
        url: '../particulars/main?id=' + id + '&title=' + title
      })
    },
  },
  components: {
    errAlert
  }
}
</script>
<style scoped>
.FAQ {
  width: 100%;
  height: 100%;
  padding: 32rpx 16rpx;
  background: url(../../assets/common/commonBg.png) no-repeat bottom;
  background-size: 100%;
}

.ulContainer {
  width: 100%;
  height: 90%;
  overflow: auto;
}

.more_Ul {
  border-bottom: 1px solid #e0e0de;
}


/*常见问题外层li*/

.more_li {
  padding: 0 24rpx;
  height: 96rpx;
  line-height: 96rpx;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
  font-size: 28rpx;
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
  padding-right: 16rpx;
  border-top: 1px solid #e0e0de;
  font-size: 28rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
</style>
