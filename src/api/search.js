// 获取搜索相关数据
import request from '@/utils/request'

// 获取联想建议列表
export const getSearchSuggestions = params =>
  request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })

// 获取搜索结果
export const getSearchResult = params =>
  request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
