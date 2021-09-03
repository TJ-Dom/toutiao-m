<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
      :border="false"
    >
      <van-icon
        slot="left"
        name="cross"
        color="#000"
        @click="$emit('icon-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!--  当前评论项 -->
      <CommentItem :comment="comment" />
      <!-- /当前评论项 -->
      <!--  评论的回复列表 -->
      <van-cell title="所有回复" />
      <CommentList :source="comment.com_id" type="c" :list="commentList" />
      <!-- /评论的回复列表 -->
    </div>
    <!--  底部 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        round
        size="small"
        type="default"
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (data) {
      // console.log(data)
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 12%;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  .post-btn {
    width: 60%;
  }
}
</style>
