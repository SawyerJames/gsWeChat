<template>
  <div class="feedback">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <h1 class="validate" v-if="validate">{{validate}}</h1>
    <!-- 主容器 -->
    <div class="feedbackContent borderBox">
      <p class="feedback_headline">您有什么问题或建议想对我们说？</p>
      <!-- 反馈内容 -->
      <textarea autofocus class="text_field borderBox" v-model.trim="textareaVal" placeholder="您的宝贵意见，就是我们进步的源泉">
      </textarea>
      <!-- 投诉照片 -->
      <div class="imgContent flexRow">
        <!-- 图片上传组件 slot插槽增加样式 -->
        <img :src="imgUrl.add_1" @click="popBaseImg_1" class="imgContent_img">
      </div>
      <p class="feedback_ending">(*^_^*)请详细描述您遇到的问题，有助于我们快速定位并解决问题，或留 下您宝贵的建议或意见，我们会认真进行评估！
      </p>
      <!-- 立即提交 -->
      <div class="submitBtnContent flexRow">
        <button type="button" class="submitBtn" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import add_1 from '@/assets/common/add_2.png'
export default {
  name: 'feedback',
  data() {
    return {
      imgUrl: {
        add_1
      },
      // 报错弹窗
      errShow: false,
      errTxt: '',
      validate: "",
      // 投诉内容
      textareaVal: "",
      // 投诉照片
      fileArr: ""
    }
  },
  onLoad() {
    // 重置数据
    this.fileArr = '';
    this.textareaVal = '';
  },
  methods: {
    // 图片上传
    popBaseImg_1() {
      var that = this;
      wx.chooseImage({
        count: 1,
        success(res) {
          var tempFilePaths = res.tempFilePaths;
          that.imgUrl.add_1 = tempFilePaths[0];
          that.fileArr = tempFilePaths[0];
        }
      })
    },
    // 提交意见
    submit() {
      let that = this;
      var text_field = this.textareaVal;
      // 验证：内容是否为空
      if (text_field == '') {
        that.validate = '反馈问题不能为空'
        setTimeout(function() {
          that.validate = ''
        }, 1500);
      }
      // 不为空则发送数据
      else {
        if (this.fileArr) {
          wx.uploadFile({
            url: 'https://gs.jltengfang.com/index/mini/feedback',
            filePath: this.fileArr,
            name: 'file',
            header: {
              'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
            },
            formData: {
              'content': this.textareaVal
            },
            success: function(res) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500,
                success: function() {
                  setTimeout(function() {
                    // 重置数据
                    that.fileArr = '';
                    that.imgUrl.add_1 = add_1;
                    // 退回上一页
                    wx.reLaunch({
                      url: '../settingIndex/main'
                    })
                  }, 1500);
                }
              });
            }
          });
        } else {
          this.$http.post(this.$api.postOpinion, {
              content: this.textareaVal
            }, {
              headers: {
                'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
              }
            })
            .then(function() {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500,
                success: function() {
                  setTimeout(function() {
                    // 重置数据
                    that.fileArr = '';
                    that.imgUrl.add_1 = add_1;
                    // 退回上一页
                    wx.reLaunch({
                      url: '../settingIndex/main'
                    })
                  }, 1500);
                }
              });
            });
        }
      }
    }
  },
  components: {
    errAlert
  }
}
</script>
<style scoped>
.feedback {
  width: 100%;
  height: 100%;
  background: #fff;
}


/*主容器*/

.feedbackContent {
  width: 90%;
  height: 100%;
  font-size: 28rpx;
  margin: 0 auto;
  padding-top: 32rpx;
}


/*标题*/

.feedback_headline {
  color: #f8624a;
}


/*文本框*/

.text_field {
  width: 100%;
  height: 320rpx;
  margin-top: 30rpx;
  padding: 8rpx;
  border-radius: 5px;
  border: 1px solid #e0e0de;
  outline: none;
}


/*投诉图片*/

.imgContent {
  width: 100%;
  height: 96rpx;
  border-bottom: 1px solid #ddd;
  border-radius: 8rpx;
  -ms-align-items: center;
  align-items: center;
}

.imgContent_img {
  width: 60rpx;
  height: 50rpx;
  margin-right: 30rpx;
}


/*尾部*/

.feedback_ending {
  font-size: 24rpx;
  color: #999;
  margin-top: 32rpx;
}


/*提交*/

.submitBtnContent {
  width: 100%;
  height: 80rpx;
  margin: 32rpx 0;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.submitBtn {
  width: 90%;
  height: 64rpx;
  line-height: 64rpx;
  border: none;
  outline: none;
  color: #fff;
  border-radius: 16rpx;
  background: #f76149;
}
</style>
