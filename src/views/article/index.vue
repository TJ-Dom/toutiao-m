<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
            >关注</van-button
          > -->
          <!-- 模版中的$event是事件参数 -->
          <!-- 当我们传递子组件的数据既要使用还要修改
                传递：props
                  :isFollowed="article.is_followed"
                修改：自定义事件
                  @updata-is_followed="article.is_followed = $event"
              简写方式：在组件上使用 v-model
                相等于-> value="article.is_followed"
                        @input="article.is_followed = $event"
              如果需要修改 v-model 的规则名称，可以通过自组件的model属性自定义model: {prop: 'isFollowed',event: 'updata-is_followed'}

              一个组件上只能使用一次 v-model
              如果有多个数据需要实现类似于 v-model 的效果，咋办？
              可以使用属性的 .sync 修饰符-->
          <FollowUser
            v-model="article.is_followed"
            class="follow-btn"
            :user_id="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容  markdown-body-->
        <div
          class="article-content markdown-body "
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <van-cell title="全部评论" class="commentTitle" :border="false" />
        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplyClick"
        />
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostshow = true"
            >写评论</van-button
          >
          <van-icon
            name="comment-o"
            :badge="totalCommentCount"
            color="#777"
          ></van-icon>
          <!-- <van-icon color="#777" name="star-o" /> -->
          <CollectArticle
            v-model="article.is_collected"
            :article_id="article.art_id"
          />
          <LikeArticle
            v-model="article.attitude"
            :article_id="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostshow" position="bottom">
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
        <!-- /发布评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else @click="loadArticle">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出层 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <!-- v-if 条件渲染 - true:渲染元素节点 false:不渲染 -->
      <CommentReply
        v-if="isReplyShow"
        @icon-close="isReplyShow = false"
        :comment="currentComment"
      />
    </van-popup>
    <!-- /评论回复弹出层 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object], // 点击文章列表进入是数字，直接输入网址进入是字符串,而经过JSONBig转译是对象
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading 状态
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0,
      isPostshow: false, // 控制发布评论的显示状态
      commentList: [],
      isReplyShow: false, // 控制评论回复的显示状态
      currentComment: {} // 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 展示 loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        // 模拟失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dfjhskjdfhkjfhsf')
        // }
        // 数据驱动视图这事不是立即的，所以要得到refs的需要使用定时器延迟
        this.article = data.data
        // 初始化图片点击预览
        // console.log(this.$refs['article-content']);
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('请求失败！', err)
      }
      // 无论成功与否，都需要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(this.$refs['article-content']);
      // 获取所有img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },
    onClickLeft () {
      this.$router.back()
    },
    // async onFollow () {
    //   this.followLoading = true // 展示关注按钮的loading状态
    //   try {
    //     if (this.article.is_followed) {
    //       // 已关注状态，取消关注
    //       const data = await deleteFollow(this.article.aut_id)
    //       if (data && data.status === 204) {
    //         this.$toast('取消关注成功')
    //       }
    //     } else {
    //       // 未关注状态，关注addFollow,
    //       const data = await addFollow(this.article.aut_id)
    //       if (data && data.status === 201) {
    //         this.$toast('关注成功')
    //       }
    //     }
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败，请重试'
    //     if (err.response && err.response.status === 401) {
    //       message = '您未登录，请登录'
    //     } else if (err.response && err.response.status === 507) {
    //       message = '数据异常，请稍后再试'
    //     } else if (err.response && err.response.status === 400) {
    //       message = '自己不能关注自己'
    //     }
    //     this.$toast(message)
    //   }
    //   this.followLoading = false // 关闭关注按钮的loading状态
    // }
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostshow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .commentTitle {
    font-size: 30px;
  }
}
</style>
