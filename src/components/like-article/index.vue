<template>
  <van-icon
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :color="value === 1 ? '#e5645f' : '#777'"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    article_id: {
      type: [Object, String, Number],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLike () {
      this.loading = true
      try {
        let att = -1
        if (this.value === 1) {
          // 已收藏，取消收藏deleteCollect
          await deleteLike(this.article_id)
        } else {
          // 未收藏，收藏addCollect
          await addLike(this.article_id)
          att = 1
        }
        this.$emit('input', att)
        this.$toast.success(att === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        let message = '操作失败，请稍后再试'
        if (err.response && err.response.status === 401) {
          message = '登录已失效，请重新登录'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
