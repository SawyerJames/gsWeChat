<template>
  <div class="registerNew" :class="{'registerOld': registerChooseState == 1}">
    <errAlert :errShow="errShow" :errTxt="errTxt"></errAlert>
    <!-- loading组件 -->
    <loading v-if="loading"></loading>
    <!-- 验证提示 -->
    <h1 class="validate" v-if="validate">{{validate}}</h1>
    <!-- 老用户信息 -->
    <div class="register-model flexRow" v-if="registerChooseState == 1">
      <span class="register-title">原有信息</span>
      <span class="register-msg oldUserMsg">{{car_number}}</span>
    </div>
    <!-- 车牌号输入框 -->
    <div class="car-content-number flexRow" v-if="registerChooseState == 0">
      <!-- 车牌标题名 -->
      <div class="car-content-title">
        <span>车牌号：</span>
      </div>
      <!-- 车牌显示容器 -->
      <div class="car-content-section flexRow">
        <!-- 车牌第一个字 -->
        <button id="font" class="flex-btn" @click="btnClickYue" :class="{isNumClick: isYue }">{{areaName}}</button>
        <!-- 车牌第二个字 -->
        <button id='letter' class="flex-btn" @click="btnClickA" :class="{isNumClick: isA}">{{areaLetter}}</button>
        <button id='numOne' @click="btnClickNum('one')" :class="{isNumClick: isNumOne}">{{numOne}}</button>
        <button id='numTwo' @click="btnClickNum('two')" :class="{isNumClick: isNumTwo}">{{numTwo}}</button>
        <button id='numThree' @click="btnClickNum('three')" :class="{isNumClick: isNumThree}">{{numThree}}</button>
        <button id='numFour' @click="btnClickNum('four')" :class="{isNumClick: isNumFour}">{{numFour}}</button>
        <button id='numFive' @click="btnClickNum('five')" :class="{isNumClick: isNumFive}">{{numFive}}</button>
        <!-- 新能源车牌特有标志 -->
        <button v-if="checkbox" id='numSix' @click="btnClickNum('six')" :class="{isNumClick: isNumSix == true}">{{numSix}}</button>
      </div>
      <!-- 新能源车牌 -->
      <label class="ze-checkbox flexRow">
        <!-- 小程序原生组件：复选框 -->
        <checkbox-group class="radio-group" @change="newEnergyChange">
          <checkbox :value="newEnergy.name" />
        </checkbox-group>
        <span class="ze-checkbox-text">新能源</span>
      </label>
    </div>
    <!-- 车牌颜色 -->
    <div class="carColorContent flexCol" v-if="registerChooseState == 0">
      <span class="carColorTitle">牌照颜色：</span>
      <!-- 车牌颜色容器：带车牌号 -->
      <div :class="['carColorContainer flexRow',{carColorBorder_1: carColorType==1,carColorBorder_2: carColorType==2,carColorBorder_3: carColorType==3,carColorBorder_4: carColorType==4,carColorBorder_5: carColorType==5}]">
        <div :class="['carColor-textContent flexRow',{carColor_1: carColorType==1,carColor_2: carColorType==2,carColor_3: carColorType==3,carColor_4: carColorType==4,carColor_5: carColorType==5}]">
          <span class="carColor-text">{{areaName}}</span>
          <span class="carColor-text">{{areaLetter}}</span>
          <span class="carColor-text">{{numOne}}</span>
          <span class="carColor-text">{{numTwo}}</span>
          <span class="carColor-text">{{numThree}}</span>
          <span class="carColor-text">{{numFour}}</span>
          <span class="carColor-text">{{numFive}}</span>
          <span class="carColor-text" v-if="numSix">{{numSix}}</span>
        </div>
      </div>
      <!-- 车牌颜色选择器 -->
      <div class="carColorList flexRow" v-if="carColorType != 5">
        <div @click='chooseCarColor(1)' class="carColorType_1 flexRow">
          <div class="carColorType_1_content"></div>
        </div>
        <div @click='chooseCarColor(2)' class="carColorType_2 flexRow">
          <div class="carColorType_2_content"></div>
        </div>
        <div @click='chooseCarColor(3)' class="carColorType_3 flexRow">
          <div class="carColorType_3_content"></div>
        </div>
        <div @click='chooseCarColor(4)' class="carColorType_4 flexRow">
          <div class="carColorType_4_content"></div>
        </div>
      </div>
    </div>
    <!-- 联系方式绑定 -->
    <div class="register-model flexRow">
      <span class="register-title">联系方式</span>
      <input type="number" maxlength="11" class="register-msg" v-model="user.phone" placeholder="请输入您的联系方式" />
    </div>
    <!-- 输入验证码 -->
    <div class="register-model flexRow">
      <span class="register-title">验证号码</span>
      <input type="tel" name="code" maxlength="6" placeholder="请输入验证码" v-model.trim="user.code"></input>
      <!-- 获取验证码按钮 -->
      <button type="button" @click="getCode()" :disabled="!showVer" class="verificationBtn borderBox">
        <span v-show="showVer">获取验证码</span>
        <span v-show="!showVer" class="count">重新获取({{count}}s)</span>
      </button>
    </div>
    <!-- 模拟键盘：附带动画 ：采用动画判断显隐，或使用v-if="keyboardShow" -->
    <div class="keyboard flexCol" :class='{animationDown:isDown,animationUp:keyboardShow}' v-if="registerChooseState == 0">
      <!-- 键盘完成键 -->
      <div class="keyboard-chooseContent borderBox flexRow">
        <button class="btn-cancel" @click="completeClick"><span>取消</span></button>
        <button class="btn-complete" @click="completeClick"><span>完成</span></button>
      </div>
      <!-- 键盘：牌照第一个字 -->
      <div class="keyboard-content flexCol" v-if="keyboard == 'txt'">
        <!-- 循环牌照类型 -->
        <div class="keyboard-row flexRow" v-for="(item,rows) in carTxt">
          <button class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}</button>
        </div>
        <!-- 新、临时牌照类型&删除按钮 -->
        <div class="keyboard-row flexRow">
          <button class="keyboard-row-item bottom" @click="btnBottomClick('新')">新</button>
          <button class="keyboard-row-item bottom" @click="btnBottomClick('临')">临</button>
          <button v-for="j in noneBottomtxt" class="none-botton">{{j}}</button>
          <div class="keyboard-clear flexRow" @click="clearClick">
            <img :src="imgUrl.del" alt="删除">
          </div>
        </div>
      </div>
      <!-- 键盘：牌照其他数字或字母 -->
      <div class="keyboard-content flexCol" v-if="keyboard == 'num'">
        <!-- 字母或数字 -->
        <div class="keyboard-row flexRow" v-for="(item,rows) in carNum">
          <button :disabled="!isSelectl?isDisable && i<10 :isDisable&& rows!=0 " class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)">{{i}}
          </button>
        </div>
        <!-- 港澳学及&删除按钮 -->
        <div class="keyboard-row flexRow">
          <button :disabled="isSelectl" v-for="item in carNumBottom" class="keyboard-row-item bottom" @click="btnBottomNumClick(item)">{{item}}</button>
          <button v-for="j in noneBottom" class="none-botton">{{j}}</button>
          <div class="keyboard-clear flexRow" @click="clearClick">
            <img :src="imgUrl.del" alt="删除">
          </div>
        </div>
      </div>
    </div>
    <!-- 用户协议 -->
    <div class="agreementContent flexCol" v-if="registerChooseState == 0">
      <div class="agreeChooseContent sign flexRow borderBox">
        <!-- <div class="agreeChooseInput flexRow"> -->
        <!-- 小程序原生组件：复选框 -->
        <checkbox-group class="agreeCheckbox" @change="agreeChange">
          <checkbox :value="userAgreement.name" />
        </checkbox-group>
        <span>我已阅读并同意</span>
        <!-- </div> -->
        <a href="../registerTxt/main" class="registerTxt">小K出行用户协议</a>
      </div>
    </div>
    <!-- 绑定按钮 -->
    <div class="submitBtnContent flexRow">
      <button type="button" class="submitBtn" @click="postMsg">绑定</button>
    </div>
  </div>
</template>
<script>
import errAlert from '@/components/errAlert'
import loading from '@/components/loading'
// 导入图片
import del from '@/assets/common/del.png'
export default {
  name: 'app',
  data() {
    return {
      // 新能源选项
      newEnergy: {
        name: '新能源'
      },
      checkbox: false,
      // 图片集
      imgUrl: {
        del
      },
      loading: false,
      // 用户协议
      userAgreement: {
        name: '同意'
      },
      checked: false,
      // 报错弹窗
      errShow: false,
      errTxt: '',
      // 用户信息
      user: {
        phone: '',
        code: ''
      },
      // 老用户信息
      userId: 0,
      car_number: '',
      registerChooseState: 0,
      // 校验
      validate: '',
      // 验证码
      showVer: true,
      count: '',
      timer: null,
      TIME_COUNT: 60,
      // 渲染的号码
      areaName: '',
      areaLetter: '',
      numOne: '',
      numTwo: '',
      numThree: '',
      numFour: '',
      numFive: '',
      numSix: '',
      // 号码样式判断
      isNumOne: false,
      isNumTwo: false,
      isNumThree: false,
      isNumFour: false,
      isNumFive: false,
      isNumSix: false,
      isYue: false,
      isA: false,
      key: '1',
      // 车牌颜色
      carColorType: 1,
      // 键盘显示
      selected: null,
      isSelectl: false,
      isSelectx: false,
      isDisable: false,
      isUp: false,
      isDown: false,
      isDisable: false,
      keyboardShow: false,
      keyboard: false,
      // 键盘字典
      carTxt: [{
        name: ['粤', '京', '冀', '沪', '津', '晋', '蒙', '辽', '吉', '黑']
      }, {
        name: ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '桂']
      }, {
        name: ['琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁']
      }],
      // 键盘数字字典
      carNum: [{
        name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
      }, {
        name: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
      }, {
        name: ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']
      }],
      carNumBottom: ['W', 'X', 'Y', 'Z'],
      // 无选择字典
      noneBottom: ['', '', '', ''],
      noneBottomtxt: ['', '', '', '', '', '']
    }
  },
  mounted() {
    let that = this;
    // 全局读取判别老用户是否选择了一键绑定,选择了则加载原有信息
    if (this.$store.state.registerChooseState == 1) {
      this.registerChooseState = 1;
      // 拉取老用户原有信息
      this.getOldUser();
    }
  },
  onShow() {
    // 试图获取注册选择页数据: 0 => 重新绑定， 1 => 一键绑定
    if (this.$store.state.registerChooseState == 1) {
      this.registerChooseState = 1;
      // 拉取老用户原有信息
      this.getOldUser();
    } else {
      this.registerChooseState = 0;
    }
    // 载入后初始化信息
    this.showVer = true;
    this.count = '';
    this.timer = null;
    this.TIME_COUNT = 60;
    this.user.code = '';
  },
  watch: {
    //监听是否为新能源
    checkbox: function(val, oldval) {
      let that = this;
      // 切换到普通车牌
      if (!val) {
        if (that.numFour) {
          that.isNumFive = true;
          that.key = 7;
        }
        // 切换到新能源车牌　
      } else {
        if (that.numFive) {
          that.isNumSix = true;
          that.key = 8;
        }
      }
    },
    //监听是否为普通车牌最后一位
    numFive: function(val) {
      if (!this.checkbox && val) {
        this.isUp = false;
        this.isDown = true;
        this.keyboardShow = false;
        this.isNumFive = false;
      }
    },
    //监听是否为新能源车牌最后一位
    numSix: function(val) {
      if (this.checkbox && val) {
        this.isUp = false;
        this.isDown = true;
        this.keyboardShow = false;
        this.isNumSix = false;
      }
    }
  },
  methods: {
    // 判断新老用户,拉取信息
    getOldUser() {
      let that = this;
      // 全局读取判别老用户是否选择了一键绑定,选择了则加载原有信息
      if (this.$store.state.registerChooseState == 1) {
        this.registerChooseState = 1;
        // 拉取老用户原有信息
        this.$http.get(this.$api.getOldUserMsg, null, {
            headers: {
              'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
            }
          })
          .then(function(res) {
            // 接口成功
            if (res.data.state == 0) {
              that.car_number = res.data.data.car_number;
              that.userId = res.data.data.id;
            }
          })
          .catch(function(err) {
            that.errShow = true;
            that.errTxt = '网络错误,请刷新重试';
          });
      }
    },
    // 获取验证码
    getCode() {
      let that = this;
      var phoneRe = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      // 获取验证码
      if (phoneRe.test(this.user.phone)) {
        // 如果不为空的定时器
        if (!this.timer) {
          // 开始计数
          this.count = this.TIME_COUNT;
          this.showVer = false;
          // 定时器读秒
          this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= this.TIME_COUNT) {
              this.count--;
            } else {
              this.showVer = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
          // 开始获取验证码
          this.$http.post(this.$api.getCode, {
              phone: this.user.phone
            }, {
              headers: {
                'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
              }
            })
            .then(function(res) {
              if (res.data.errmsg != "OK") {
                that.validate = '验证码发送失败'
                setTimeout(function() {
                  that.validate = ''
                }, 2000);
              }
            })
            .catch(function(err) {
              that.errShow = true;
              that.errTxt = '网络错误,请刷新重试';
              var errLoading = setTimeout(function() {
                that.errShow = false;
                that.errTxt = ''
                clearTimeout(errLoading);
              }, 2000);
            });
        }
      } else {
        this.validate = '手机号码格式不正确'
        setTimeout(function() {
          that.validate = ''
        }, 2000);
      }
    },
    // 选择车牌颜色
    chooseCarColor(type) {
      this.carColorType = type;
    },
    // 车辆类型选择
    newEnergyChange(e) {
      if (e.target.value[0] == '新能源') {
        this.checkbox = true;
        console.log(111);
      } else {
        this.checkbox = false;
      }
      this.carTypeChange();
    },
    carTypeChange() {
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      // 切换到普通车牌　
      if (this.checkbox == false) {
        this.carColorType = 1;
        this.numSix = '';
        this.key = 7;
      }
      // 切换到新能源车牌
      else {
        this.numSix = '';
        this.carColorType = 5;
        this.key = 8;
      }
    },
    // 车牌号第一位输入框选择
    btnClickYue() {
      this.isYue = true;
      this.isA = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = 'txt';
      this.key = 1;
    },
    // 车牌号第二位输入框选择
    btnClickA() {
      this.isDisable = true;
      this.isA = true;
      this.isYue = false;
      this.isUp = true;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.keyboardShow = true;
      this.keyboard = 'num';
      this.key = 2;
    },
    // 车牌号后五位或六位输入框选择
    btnClickNum(name) {
      if (this.isSelectl) {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
      this.keyboard = 'num';
      this.keyboardShow = true;
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = true;
      if (name === 'one') {　　　　　　
        this.isNumOne = true;　　　　　　
        this.key = 3;　　　　
      } else if (name === 'two') {　　　　　　
        this.isNumTwo = true;　　　　　　
        this.key = 4;　　　　
      } else if (name === 'three') {　　　　　　
        this.isNumThree = true;　　　　　　
        this.key = 5;　　　　
      } else if (name === 'four') {　　　　　　
        this.isNumFour = true;　　　　　　
        this.key = 6;　　　　
      } else if (name === 'five') {　　　　　　
        this.isNumFive = true;　　　　　　
        this.key = 7;　　　　
      } else if (name === 'six') {　　　　　　
        this.isNumSix = true;　　　　　
        this.key = 8;　　　　
      }　　　　
      if (name === 'five' || name === 'six') {　　　　　　
        this.carNumBottom = ['W', 'X', 'Y', 'Z', '港', '澳', '学'];　　　　　　
        this.noneBottom = [''];　　　　
      } else {　　　　　　
        this.carNumBottom = ['W', 'X', 'Y', 'Z'];　　　　　　
        this.noneBottom = ['', '', '', ''];　　　　
      }　　
    },
    // 键盘点击完成 或 取消
    completeClick() {
      this.isYue = false;
      this.isA = false;
      this.isNumOne = false;
      this.isNumTwo = false;
      this.isNumThree = false;
      this.isNumFour = false;
      this.isNumFive = false;
      this.isNumSix = false;
      this.isUp = false;
      this.isDown = true;
      this.keyboardShow = false;
    },
    // 键盘选择显示
    btnWordClick(rows, index, i) {
      this.selected = i;
      if (this.key === 1) {
        if (this.areaName === '临') {
          this.areaLetter = '';
          this.numOne = '';
          this.numTwo = '';
          this.numThree = '';
          this.numFour = '';
          this.numFive = '';
          this.numSix = '';
        }
        this.areaName = i;
        this.isSelectl = false;
        this.btnClickA();
      } else if (this.key === 2) {
        this.areaLetter = i;
        this.btnClickNum('one')
      } else if (this.key === 3) {
        this.numOne = i;
        this.btnClickNum('two')
      } else if (this.key === 4) {
        this.numTwo = i;
        this.btnClickNum('three')
      } else if (this.key === 5) {
        this.numThree = i;
        this.btnClickNum('four')
      } else if (this.key === 6) {
        this.numFour = i;
        this.btnClickNum('five')
      } else if (this.key === 7) {
        this.numFive = i;
        if (this.checkbox) {　　　　　　　　
          this.btnClickNum('six')
        }
      } else if (this.key === 8) {
        this.numSix = i;
      }
      if (this.key === 7 || this.key === 8) {
        this.carNumBottom = ['W', 'X', 'Y', 'Z', '港', '澳', '学'];
        this.noneBottom = [''];
      } else if (this.key === 3 || this.key === 4 || this.key === 5 || this.key === 6) {
        this.carNumBottom = ['W', 'X', 'Y', 'Z'];
        this.noneBottom = ['', '', '', ''];
      }
    },
    // 车牌第一位选择‘临’,’新‘后的键盘显示
    btnBottomClick(val) {
      if (val === '新') {
        if (this.areaName === '临') {
          this.areaLetter = '';
          this.numOne = '';
          this.numTwo = '';
          this.numThree = '';
          this.numFour = '';
          this.numFive = '';
          this.numSix = '';
        }
        this.areaName = '新';
        this.isSelectx = true;
        this.isSelectl = false;
        this.btnClickA();
      } else if (val === '临') {
        this.areaName = '临';
        this.isSelectl = true;
        this.isSelectx = false;
        this.isDisable = true;
        this.areaLetter = '';
        this.numOne = '';
        this.numTwo = '';
        this.numThree = '';
        this.numFour = '';
        this.numFive = '';
        this.numSix = '';
        this.btnClickA('isLin');
      }
    },
    // 键盘最后一行字母点击事件
    btnBottomNumClick(i) {　　　　
      this.selected = i;　　　　
      if (this.key === 2) {　　　　　　
        this.areaLetter = i;　　　　　　
        this.btnClickNum('one')
      } else if (this.key === 3) {　　　　　　
        this.numOne = i;　　　　　　
        this.btnClickNum('two')
      } else if (this.key === 4) {　　　　　　
        this.numTwo = i;　　　　　　
        this.btnClickNum('three')
      } else if (this.key === 5) {　　　　　　
        this.numThree = i;　　　　　　
        this.btnClickNum('four')
      } else if (this.key === 6) {　　　　　　
        this.numFour = i;　　　　　　
        this.btnClickNum('five')
      } else if (this.key === 7) {　　　　　　
        this.numFive = i;　　　　　　
        if (this.checkbox) {　　　　　　　　
          this.btnClickNum('six')
        }　　　　
      } else if (this.key === 8) {　　　　　　
        this.numSix = i;　　　　
      }
    },
    // 键盘点击‘删除图标’
    clearClick() {
      if (this.key === 1) {
        this.areaName = '';
      } else if (this.key === 2) {
        this.btnClickYue();
        this.areaLetter = '';
      } else if (this.key === 3) {
        this.btnClickA();
        this.numOne = '';
      } else if (this.key === 4) {
        this.btnClickNum('one')
        this.numTwo = '';
      } else if (this.key === 5) {
        this.btnClickNum('two')
        this.numThree = '';
      } else if (this.key === 6) {
        this.btnClickNum('three')
        this.numFour = '';
      } else if (this.key === 7) {
        this.btnClickNum('four')
        this.numFive = '';
      } else if (this.key === 8) {
        this.btnClickNum('five')
        this.numSix = '';
      }
    },
    // 用户协议
    agreeChange(e) {
      if (e.target.value[0] == '同意') {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    // 上传接口
    postMsg() {
      let that = this;
      // 拼接车牌号
      var carNumber = this.areaName + this.areaLetter + this.numOne + this.numTwo + this.numThree + this.numFour + this.numFive + this.numSix;
      // 获取用户信息
      var phone = this.user.phone,
        code = this.user.code;
      // 正则
      var phoneRe = /^[1][3,4,5,7,8,9][0-9]{9}$/,
        verificationRe = /^\d{6}$/;
      // 需要传递的参数
      var paramsData = 'plateNumber=' + carNumber + '&plateColor=' + this.carColorType + '&mobileNumber=' + phone + '&iCode=' + code;
      // 表单验证：手机号
      if (phoneRe.test(phone)) {
        // 验证码
        if (verificationRe.test(code)) {
          // 老用户直接发送手机号验证码，新用户需要填写驾驶证，用户协议
          if (this.$store.state.registerChooseState == 1) {
            // 如果是老用户,发送id,手机号及验证码
            this.$http.post(this.$api.bindOldUser, {
                id: this.userId,
                phone: this.user.phone,
                code: this.user.code
              }, {
                headers: {
                  'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
                }
              })
              .then(function(res) {
                // 跳转页面
                if (res.data.state == 0) {
                  wx.showToast({
                    title: '欢迎回来',
                    icon: 'success',
                    duration: 2000,
                    success: function() {
                      setTimeout(function() {
                        wx.reLaunch({
                          url: '../loading/main'
                        });
                      }, 2000);
                    }
                  });
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 2000
                  });
                }
              })
              .catch(function(err) {
                that.errShow = true;
                that.errTxt = '网络错误,请刷新重试';
                var errLoading = setTimeout(function() {
                  that.errShow = false;
                  that.errTxt = ''
                  clearTimeout(errLoading);
                }, 2000);
              });
          } else {
            // 行驶证信息：行驶证号码
            if (this.areaName != '' && this.areaLetter != '' && this.areaLetter != '' && this.numOne != '' && this.numTwo != '' && this.numThree != '' && this.numFour != '' && this.numFive != '') {
              // 新能源行驶证
              if (this.checkbox == true) {
                if (this.numSix == '') {
                  that.validate = '新能源车牌号格式不对'
                  setTimeout(function() {
                    that.validate = ''
                  }, 2000);
                } else {
                  // 用户协议
                  if (this.checked == true) {
                    this.validate = '';
                    this.loading = true;
                    // 发送数据
                    this.$http.post(this.$api.postRegister, paramsData, {
                        headers: {
                          'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
                        }
                      })
                      .then(function(res) {
                        that.loading = false;
                        // 接口调通
                        if (res.data.state == 0) {
                          wx.showToast({
                            title: '绑定成功',
                            icon: 'success',
                            duration: 2000,
                            success: function() {
                              setTimeout(function() {
                                wx.reLaunch({
                                  url: '../loading/main'
                                });
                              }, 2000);
                            }
                          });
                        }
                        // 如果信息不对
                        else {
                          that.loading = false;
                          that.validate = res.data.msg;
                          setTimeout(function() {
                            that.validate = ''
                          }, 2000);
                        }
                      })
                      .catch(function(err) {
                        that.errShow = true;
                        that.loading = false;
                        that.errTxt = '网络错误,请刷新重试';
                        var errLoading = setTimeout(function() {
                          that.errShow = false;
                          that.errTxt = ''
                          clearTimeout(errLoading);
                        }, 2000);
                      });
                  } else {
                    that.validate = '您未同意用户缴费协议'
                    setTimeout(function() {
                      that.validate = ''
                    }, 2000);
                  }
                }
              }
              // 普通驾驶证
              if (this.checkbox == false) {
                // 用户协议
                if (this.checked == true) {
                  this.validate = '';
                  // 发送数据
                  this.$http.post(this.$api.postRegister, paramsData, {
                      headers: {
                        'cookie': 'PHPSESSID=' + wx.getStorageSync('session_id')
                      }
                    })
                    .then(function(res) {
                      that.loading = false;
                      // 接口调通
                      if (res.data.state == 0) {
                        wx.showToast({
                          title: '绑定成功',
                          icon: 'success',
                          duration: 2000,
                          success: function() {
                            setTimeout(function() {
                              wx.reLaunch({
                                url: '../loading/main'
                              });
                            }, 2000);
                          }
                        });
                      }
                      // 如果信息不对
                      else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'loading',
                          duration: 2000
                        })
                      }
                    })
                    .catch(function(err) {
                      that.loading = false;
                      that.errShow = true;
                      that.errTxt = '网络错误,请刷新重试';
                      var errLoading = setTimeout(function() {
                        that.errShow = false;
                        that.errTxt = ''
                        clearTimeout(errLoading);
                      }, 2000);
                    });
                } else {
                  that.validate = '您未同意用户缴费协议'
                  setTimeout(function() {
                    that.validate = ''
                  }, 2000);
                }
              }
            } else {
              that.validate = '车牌号信息不完全'
              setTimeout(function() {
                that.validate = ''
              }, 2000);
            }
          }
        } else {
          that.validate = '验证码不正确'
          setTimeout(function() {
            that.validate = ''
          }, 2000);
        }
      } else {
        that.validate = '手机号码格式不正确'
        setTimeout(function() {
          that.validate = ''
        }, 2000);
      }
    }
  }
}
</script>
<style scoped>
.registerNew {
  width: 100%;
  height: 100%;
  background: #fff;
}


/*车牌样式：最外层容器*/

.car-content-number {
  width: 92%;
  height: 96rpx;
  margin: 0 auto;
  padding: 0 2%;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
}

.car-content-title {
  font-weight: bold;
}


/*车牌容器*/

.car-content-section {
  width: auto;
  height: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
}

.car-content-section button {
  width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  border: none;
  border-right: 1px solid #eee;
  background: none;
  outline: none;
}


/*当前车牌数字被点击*/

.car-content-section .isNumClick {
  border: 1px solid #f8624a;
}


/*新能源车牌*/

.ze-checkbox {
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.ze-checkStyle {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
  position: relative;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8rpx;
}

.chooseBox {
  background: #f8624a;
}

.ze-checkbox input {
  width: 32rpx;
  height: 32rpx;
  outline: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.ze-checkbox-text {
  color: #f8624a;
}


/*车牌颜色*/

.carColorContent {
  width: 92%;
  height: auto;
  margin: 16rpx auto;
  padding: 0 2% 32rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #ddd;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
}

.carColorTitle {
  width: 100%;
  margin-bottom: 16rpx;
}


/*车牌颜色中的车牌号容器*/

.carColorContainer {
  width: 272rpx;
  height: 80rpx;
  border-radius: 8rpx;
  border: 1px solid #1C63E1;
  background: #fff;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.carColor-textContent {
  width: 256rpx;
  height: 64rpx;
  border-radius: 8rpx;
  background: #1C63E1;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.carColor-text {
  font-size: 28rpx;
}


/*车牌颜色选择器*/

.carColorList {
  width: 100%;
  height: auto;
  margin: 32rpx 0;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
}

.carColorType_1,
.carColorType_2,
.carColorType_3,
.carColorType_4 {
  width: 140rpx;
  height: 60rpx;
  border-radius: 8rpx;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.carColorType_1_content,
.carColorType_2_content,
.carColorType_3_content,
.carColorType_4_content {
  width: 128rpx;
  height: 48rpx;
  border-radius: 8rpx;
}

.carColorType_1,
.carColorBorder_1 {
  border: 1px solid #1C63E1;
}

.carColorType_2,
.carColorBorder_2 {
  border: 1px solid #e8b305;
}

.carColorType_3,
.carColorBorder_3 {
  border: 1px solid #999;
}

.carColorType_4,
.carColorBorder_4 {
  border: 1px solid #000;
}

.carColorBorder_5 {
  border: 1px solid #059634;
}

.carColorType_1_content,
.carColor_1 {
  background: #1C63E1;
  color: #fff;
}

.carColorType_2_content,
.carColor_2 {
  background: #e8b305;
  color: #fff;
}

.carColorType_3_content,
.carColor_3 {
  background: #fff;
  color: #333;
}

.carColorType_4_content,
.carColor_4 {
  background: #000;
  color: #fff;
}

.carColor_5 {
  background: #059634;
  color: #fff;
}


/*键盘样式：最外层容器*/

.keyboard {
  width: 100%;
  height: 480rpx;
  position: fixed;
  bottom: -480rpx;
  background: #F2F2F2;
  border-top: 1px solid #ddd;
  z-index: 10;
  justify-content: space-around;
  -ms-align-items: flex-end;
  align-items: flex-end;
}

.animationDown {
  animation: slide_down .25s ease-out;
  animation-fill-mode: forwards;
}

.animationUp {
  animation: slide_up .25s ease-out;
  animation-fill-mode: forwards;
}


/*键盘主体*/

.keyboard-content {
  width: 100%;
  height: 384rpx;
  justify-content: space-around;
  -ms-align-items: center;
  align-items: center;
}


/*键盘横向每一组*/

.keyboard-row {
  width: 100%;
  height: auto;
  justify-content: space-around;
}


/*每一个小输入按钮*/

.keyboard-row-item,
.none-botton {
  width: 64rpx;
  height: 70rpx;
  font-size: 28rpx;
  border: 1px solid #D0D0D0;
  box-shadow: 0px 1px 0px 0px #D8D8D8;
  border-radius: 5px;
  background: #fff;
  outline: none;
}


/*无样式的小按钮及禁止点击的样式*/

.keyboard-row-item:disabled {
  background: #ddd;
}

.none-botton {
  border: 1px solid #F2F2F2;
  background: none;
  box-shadow: none;
}


/*按钮组*/

.keyboard-chooseContent {
  width: 100%;
  padding: 14rpx 6.4rpx;
  justify-content: space-between;
}


/*清除按钮*/

.keyboard-clear {
  width: 100rpx;
  height: 70rpx;
  background: #fff;
  border: 1px solid #D0D0D0;
  box-shadow: 0px 1px 0px 0px #D8D8D8;
  border-radius: 5px;
  justify-content: center;
  -ms-align-items: center;
  align-items: center;
}

.keyboard-clear img {
  width: 64rpx;
  height: 46rpx;
}


/*完成,取消按钮*/

.btn-complete,
.btn-cancel {
  width: 96rpx;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 28rpx;
  color: #333;
  border: none;
  border-radius: 5px;
  background: #c7c7c7;
  outline: none;
}

.btn-complete {
  background: #4385EE;
  color: #fff;
}


/*键盘动画*/

@keyframes slide_up {
  from {
    bottom: -480rpx;
  }
  to {
    bottom: 0;
  }
}

@keyframes slide_down {
  from {
    bottom: 0;
  }
  to {
    bottom: -480rpx;
  }
}


/*老用户页面*/

.registerOld {
  background: url(../../assets/common/commonBg.png) no-repeat bottom;
  background-size: contain;
}


/*基础模板*/

.register-model {
  width: 92%;
  margin: 0 auto;
  height: 96rpx;
  padding: 0 2%;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
  -ms-align-items: center;
  align-items: center;
}

.register-model:last-child,
.register-model.noBorder {
  border: none;
}


/*表单input 通用样式*/

.register-model .register-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  width: 128rpx;
}

.register-model input[type="text"],
.register-model input[type="tel"],
.register-model .register-msg {
  min-width: 192rpx;
  height: 64rpx;
  outline: none;
  border: none;
  background: #ECECEC;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #4F4F4F;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;
}

.register-model .register-msg {
  line-height: 64rpx;
}


/*老用户信息*/

.register-model .oldUserMsg {
  text-align: center;
  background: #fff;
  color: #333;
  border: 1px solid #999;
}


/*获取验证码 按钮*/

.verificationBtn {
  min-width: 192rpx;
  height: 64rpx;
  border: 1px solid #999;
  border-radius: 16rpx;
  margin: 0 16rpx;
  font-size: 24rpx;
  outline: none;
  background: #fff;
  text-align: center;
  color: #333;
}


/*用户协议*/

.sign {
  margin: .32rpx 0;
}

.agreeMsg {
  padding: 0 5%;
}


/*用户协议容器*/

.agreementContent {
  margin-top: 32rpx;
}

.agreeChooseContent {
  width: 100%;
  padding: 0 5%;
  margin-top: 16rpx;
  -ms-align-items: center;
  align-items: center;
}

.agreeChooseInput {
  -ms-align-items: center;
  align-items: center;
}

.agreeCheckbox {
  outline: none;
  margin-right: .64rpx;
  margin-top: -2px;
}

.registerTxt {
  color: #f76149;
  margin-left: 14rpx;
}


/*绑定按钮*/

.submitBtnContent {
  width: 100%;
  height: 90rpx;
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
  font-size: 28rpx;
  color: #fff;
  border-radius: 16rpx;
  background: #f76149;
}
</style>
