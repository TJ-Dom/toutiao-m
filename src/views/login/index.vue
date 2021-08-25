<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="cross" size="18" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        center
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        center
        type="number"
        maxlength="6"
        class="codeLine"
        :rules="userFormRules.code"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <div class="sendBox">
            <!-- 发送验证码-倒计时 -->
            <van-count-down
              :time="1000 * 60"
              format=" ss 秒"
              v-if="isCountDownShow"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              round
              size="small"
              type="default"
              class="send-sms-btn"
              native-type="button"
              @click="onSendSms"
              >获取验证码</van-button
            >
          </div>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user/login.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern:
              /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入有效的手机号码'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的验证码'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.TODO 表单验证

      this.$toast.loading({
        // vant轻提示
        message: '登录中...',
        forbidClick: true, // 禁用点击
        duration: 0 // 持续展示 toast
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功', data) // vant轻提示
        // console.log('登录成功', res)
        // 登录成功，跳转回原来页面(暂时性，不严谨待后续优化)
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误') // vant轻提示
        } else {
          // console.log('登录失败，请稍后再试', err)
          this.$toast.fail('登录失败，请稍后再试') // vant轻提示
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // console.log('onSendSms')
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 验证通过，显示倒计时
      this.isCountDownShow = true // 是否展示倒计时
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        // 发送失败。关闭倒计时
        this.isCountDownShow = false
        if (err.request.status === 429) {
          this.$toast('发送过于频繁，请稍后再试')
        } else if (err.request.status === 404) {
          this.$toast('手机号不正确，请稍后再试')
        } else {
          this.$toast('服务器数据库异常，请稍后再试')
        }
        // this.$toast.success('登录成功', err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.iconfont {
  font-size: 37px;
  padding-right: 20px;
}
.sendBox {
  display: flex;
  justify-content: center;
  border-left: 2px solid #ededed;
  padding-left: 20px;
  .send-sms-btn {
    height: 46px;
    // line-height: 46px;
    color: #666;
    background-color: #ededed;
    font-size: 22px;
  }
}
.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    color: #fff;
    background-color: #6db4fb;
    border: none;
  }
}
</style>
