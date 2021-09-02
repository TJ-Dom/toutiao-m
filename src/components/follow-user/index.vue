<template>
  <van-button
    v-if="isFollowed"
    round
    size="small"
    :loading="followLoading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="followLoading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user/login'
export default {
  name: 'FollowUser',
  components: {},
  model: {
    prop: 'isFollowed',
    event: 'updata-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false // 控制关注加载
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onFollow () {
      this.followLoading = true // 展示关注按钮的loading状态
      try {
        if (this.isFollowed) {
          // 已关注状态，取消关注
          const data = await deleteFollow(this.user_id)
          if (data && data.status === 204) {
            this.$toast('取消关注成功')
          }
        } else {
          // 未关注状态，关注addFollow,
          const data = await addFollow(this.user_id)
          if (data && data.status === 201) {
            this.$toast('关注成功')
          }
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updata-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 401) {
          message = '您未登录，请登录'
        } else if (err.response && err.response.status === 507) {
          message = '数据异常，请稍后再试'
        } else if (err.response && err.response.status === 400) {
          message = '自己不能关注自己'
        }
        this.$toast(message)
      }
      this.followLoading = false // 关闭关注按钮的loading状态
    }
  }
}
</script>

<style scoped lang="less"></style>
