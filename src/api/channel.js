// 频道请求模块
import request from '../utils/request'
// 获取所有频道列表
export const getAllChannels = () =>
  request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })

// 添加用户频道
export const addUserChannel = channels =>
  request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })

// 删除用户指定频道
export const deleteUserChannel = channelId =>
  request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
