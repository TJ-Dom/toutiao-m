// 评论请求模块
import request from '@/utils/request'

// 获取文章评论列表（评论或回复）
export const getComments = params =>
  request({
    method: 'GET',
    url: '/app/v1_0/comments',
    // GET 参数使用 Params 进行传递
    // 我们些的时候是对象，但是最终发给后端的数据是？
    // axios 会把 params 对象转为 key=value?key=value的格式放到 url中发送
    params
  })

// 点赞评论
export const addCommentLike = target =>
  request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })

// 取消对评论点赞
export const deleteCommentLike = target =>
  request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })

// 发布文章评论或评论回复
export const addComment = data =>
  request({
    method: 'POST',
    url: '/app/v1_0/comments',
    //
    data
  })
