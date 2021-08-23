<template>
  <div id="app">
    <h1>黑马头条</h1>
    <div>
      <i class="iconfont icon-dianzan"></i>
    </div>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="chi"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="less">
.chi {
  width: 750px;
  height: 100px;
  background-color: blue;
}
</style>
