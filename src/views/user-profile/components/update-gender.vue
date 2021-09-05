<template>
  <div class="update-gender">
    <!-- 滚动框 -->
    <van-picker
      title="性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
    />
    <!-- /滚动框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user/login'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
      const localGender = this.localGender
      try {
        const data = await updateUserProfile({
          gender: localGender
        })
        console.log(data)
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        let message = '更新失败，请稍后再试'
        if (err.response && err.response.status === 401) {
          message = '用户登录已超时，请重新登录！'
        }
        this.$toast(message)
      }
    },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less"></style>
