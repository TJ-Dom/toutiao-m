// 用户相关请求模块
import request from '../../utils/request.js'
// import store from '../../store/index.js'
// 登录请求
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 获取验证码请求
export const sendSms = mobile =>
  request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })

// 获取用户自己的信息
// console.log(store.state.user)
export const getUserInfo = () =>
  request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //     token的数据格式：Bearer token数据，注意：Bearer后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })

// 获取用户频道列表
export const getUserChannels = () =>
  request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })

// 关注用户
export const addFollow = target =>
  request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })

// 取消关注用户
export const deleteFollow = target =>
  request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`
  })

// 获取当前登录用户的个人资料
export const getUserProfile = () =>
  request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })

// 编辑更新个人资料
export const updateUserProfile = data =>
  request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })

// 更新用户照片照片
export const updateUserPhoto = data =>
  request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
