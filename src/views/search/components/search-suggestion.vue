<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="hightLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
// 按需加载有好处，只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 监听变化，若有，就会调用 handler 函数
      // handler (value) {
      //   // 注意：handler函数名称是固定的
      //   this.loadSearchSuggestions(value)
      // },
      handler: debounce(function (value) {
        // debounce函数
        // 参数1:一个函数
        // 参数2:延迟时间，单位是毫秒
        // 返回值：防抖之后的函数
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立刻调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (val) {
      try {
        const { data } = await getSearchSuggestions({
          q: val
        })
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('搜索联想建议数据获取失败，请稍后再试！')
      }
    },
    hightLight (text) {
      const hightLightStr = `<span class='active'>${this.searchText}</span>`
      // 正则表达式内的内容会当作是匹配的字符，而不是数据变量
      // 如果要传入变量，使用new RegExp
      // RegExp 正则表达式构造函数
      //       参数1：匹配模式字符串，他会根据这个字符串创建正则对象
      //       参数2: 匹配模式，要写到字符串中（g:表示匹配全部  i:表示忽略大小写）
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightLightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
