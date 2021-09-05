<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user/login'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1921, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
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
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      try {
        const data = await updateUserProfile({
          birthday: currentDate
        })
        console.log(data)
        // 更新视图
        this.$emit('input', currentDate)
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
    }
  }
}
</script>

<style scoped lang="less"></style>
