<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav"
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user/login'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        // vant轻提示
        message: '更新中...',
        forbidClick: true, // 禁用点击
        duration: 0 // 持续展示 toast
      })
      const localName = this.localName
      if (!localName.length) {
        this.$toast('昵称不能为空')
        return
      }
      try {
        const data = await updateUserProfile({
          name: this.localName
        })
        console.log(data)
        // 更新视图
        this.$emit('input', this.localName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        let message = '更新失败，请稍后再试'
        if (err.response && err.response.status === 401) {
          message = '用户登录已超时，请重新登录！'
        }
        this.$$toast(message)
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-name {
  .field-wrap {
    padding: 20px;
  }
}
</style>
