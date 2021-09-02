// 文章请求模块
import request from '@/utils/request'

// 请求获取文章列表数据
export const getArticles = params =>
  request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })

// 获取文章
export const getArticleById = articleId =>
  request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })

// 收藏文章
export const addCollect = target =>
  request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }
  })

// 取消收藏文章
export const deleteCollect = target =>
  request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`
  })

// 点赞文章
export const addLike = target =>
  request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })

// 取消点赞文章
export const deleteLike = target =>
  request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
