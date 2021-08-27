// 用户相关请求模块
import request from '../../utils/requset.js'
// import store from '../../store/index.js'
// 登录请求
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 获取验证码请求
export const sendSms = (mobile) =>
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
