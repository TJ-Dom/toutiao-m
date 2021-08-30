<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form class="search-form" action="/">
      <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :searchText="searchText" />

    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <SearchHistory
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
      @clear-search-history="searchHistories = []"
    />

    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  components: {
    SearchResult,
    SearchSuggestion,
    SearchHistory
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (val) {
      // console.log(val)
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求：不重复，最新排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
}
.search-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
</style>
