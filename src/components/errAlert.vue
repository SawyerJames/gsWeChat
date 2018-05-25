<template>
    <!-- 错误提示弹窗 -->
    <div>
        <div class="mask maskError" v-if="errShow"></div>
        <div class="errorWin" v-if="errShow">
            <img :src="ErrLoading">
            <p>{{errTxt}}</p>
        </div>
    </div>
</template>
<script type="text/javascript">
import ErrLoading from '@/assets/common/ErrLoading.gif'
export default {
    props: ['errShow', 'errTxt'],
    data () {
      return {
        ErrLoading
      }
    }
}
</script>
