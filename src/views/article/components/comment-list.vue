<template>
  <!-- 只有List 在可视范围内才会检查滚动位置触发 onload -->
  <!-- 有评论的文章 -->
  <!-- http://localhost:8083/#/article/132559 -->
  <van-list
    class="comment-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check="false"
  >
    <!-- immediate-check是否在初始化时立即执行滚动位置检查 -->
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Object, Number, String],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],上面⬆️
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记～ last_id - 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
      limit: 10
    }
  },
  computed: {},
  watch: {},
  created () {
    // 当你手动初始 onload 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别死接口参数不同
        //    type
        //      a 文章的评论
        //      c 评论的回复
        //    source
        //      文章的评论，则传递文章的ID
        //      评论的回复，则传递评论的ID
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit
        })
        // console.log(data)
        // 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 传文章评论结果
        this.$emit('onload-success', data.data)
        // 加载状态结束
        this.loading = false
        // 判断数据是否全部加载完成
        if (results.length !== 0) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.$toast('评论列表请求失败，请稍后再试')
      }
      // 异步更新数据
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1000)
      // this.error = true
    }
  }
}
</script>

<style scoped lang="less"></style>
