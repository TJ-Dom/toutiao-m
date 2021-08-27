<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        round
        size="small"
        icon="search"
        type="info"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs v-model="active" class="channel-tabs" animated swipeable>
      <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
      <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <ArticleList :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 为汉堡按钮占位 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 插入汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user/login.js'
import ArticleList from '@/views/home/components/article-list.vue'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  // props:{},
  data () {
    return {
      active: 0,
      channels: [] // 频道列表
    }
  },
  // computed:{},
  // watch:{},
  created () {
    this.loadChannels()
  },
  // mounted(){},
  methods: {
    async loadChannels () {
      try {
        const { data } = await getUserChannels()
        // console.log(data)
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('获取频道列表失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 176px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    //深度获取/deep/或::v-deep
    //深获取
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    line-height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 2;
      left: 0;
      right: 0;
      border-bottom: 1px solid #edeff3;
      .van-tabs__nav--line {
        padding: 0;
      }
    }
    .van-tab {
      border-left: 1px solid #edeff3;
      min-width: 200px;
      height: 84px;
      .van-tab__text {
        font-size: 30px;
        color: #777;
      }
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .van-tabs__nav--line {
      padding-bottom: 0;
    }
    .van-tabs__content {
      background-color: #fff;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      .icon-gengduo {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}
</style>
