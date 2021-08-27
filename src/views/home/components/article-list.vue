<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshText"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/article-item'
import { getArticles } from '@/api/article.js'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isFreshLoading: false, // 控制下拉刷新的loading 状态
      refreshText: '刷新成功' // 刷新提示内容
    }
  },
  // computed () {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp || Date.now(), // 简单理解就是请求数据的页码
          // 请求第一页数据，当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // console.log(data)
        // 2.把请求结果数据放到 list 数组中
        const { results } = data.data
        this.list.push(...results) // 剩余函数-数组的展开操作符
        // 3.加载状态结束
        this.loading = false // 设置为false才能触发下次加载
        // 模拟测试失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('danadjslfj')
        // }
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true // 若没有更多数据，将其设置为true ，就不会触发加载
        }
      } catch (err) {
        // console.log('请求文章列表内容失败', err)
        // this.$toast('请求文章列表内容失败')
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading也需要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候触发调用该函数
    async onRefresh () {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1
        })
        // if (Math.random() > 0.2) {
        //   // 下拉刷新失败测试
        //   JSON.parse('danadjslfj')
        // }
        // 2.将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading状态
        this.isFreshLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshText = `刷新成功，成功更新了${results.length}条数据`
      } catch (err) {
        this.refreshText = '刷新失败'
        // console.log('请求失败')
        this.isFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
