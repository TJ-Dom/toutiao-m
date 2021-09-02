<template>
  <van-icon
    :name="value ? 'star' : 'star-o'"
    :color="!value ? '#777' : '#e8b811'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
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
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏deleteCollect
          await deleteCollect(this.article_id)
        } else {
          // 未收藏，收藏addCollect
          await addCollect(this.article_id)
        }
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
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

<style scoped lang="less">
.collected {
  .van-icon {
    color: #e8b811;
  }
}
</style>
