// 文章请求模块
import request from '@/utils/requset'

// 请求获取文章列表数据
export const getArticles = (params) =>
  request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
