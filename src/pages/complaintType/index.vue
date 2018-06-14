<template>
  <div class="complaintType">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <h1 class="validate" v-if="validate">{{validate}}</h1>
    <!-- 主容器 -->
    <div class="complaintContent borderBox">
      <p class="complaint_headline">请阐述您要投诉的内容</p>
      <!-- 投诉内容 -->
      <textarea autofocus class="text_field borderBox" v-model="textareaVal" placeholder="描述：可补商户信息，阐述交易过程">
      </textarea>
      <!-- 投诉照片 -->
      <div class="imgContent flexRow">
        <!-- 图片上传组件 slot插槽增加样式 -->
        <img :src="imgUrl.add_1" @click="popBaseImg_1" class="imgContent_img">
        <!-- 图片上传组件 slot插槽增加样式 -->
        <img :src="imgUrl.add_2" @click="popBaseImg_2" class="imgContent_img">
      </div>
      <p class="complaint_ending">可上传商户资料照片，以及其他证据</p>
      <a href="tel:0431-81872579" class="complaint_ending">紧急投诉电话：0431-81872579</a>
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
      // 投诉内容
      textareaVal: "",
      // 投诉照片
      file1: '',
      file_back: '',
      // alert弹窗
      alert: false,
      title: '提交成功',
      text: '您已提交成功<br/>我们会认真面对此事',
    }
  },
  onLoad(option) {
    // 接收投诉类型
    this.type = option.type;
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
    // 提交投诉
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
            url: 'https://gs.jltengfang.com/index/mini/complaint',
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
                      url: '../pay/main'
                    })
                  }, 1500);
                }
              });
            }
          });
        } else {
          this.$http.post(this.$api.postComplaint, {
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
                      url: '../pay/main'
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
.complaintType {
  width: 100%;
  height: 100%;
  background: #fff;
}


/*主容器*/

.complaintContent {
  width: 90%;
  margin: 0 auto;
  font-size: 28rpx;
}


/*标题*/

.complaint_headline {
  color: #f8624a;
  height: 70rpx;
  line-height: 88rpx;
}


/*文本框*/

.text_field {
  width: 100%;
  height: 320rpx;
  margin-top: 16rpx;
  padding: 8rpx;
  border-radius: 6rpx 6rpx 0 0;
  border: 1px solid #e0e0de;
  outline: none;
}


/*投诉图片*/

.imgContent {
  width: 100%;
  height: 96rpx;
  border-bottom: 1px solid #e0e0de;
  border-radius: 0 0 6rpx 6rpx;
  -ms-align-items: center;
  align-items: center;
}

.imgContent_img {
  width: 60rpx;
  height: 50rpx;
  margin-right: 30rpx;
}


/* 投诉尾部 */

.complaint_ending {
  font-size: 24rpx;
  color: #adadad;
  margin-top: 32rpx;
  text-align: left;
  text-decoration: none;
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
