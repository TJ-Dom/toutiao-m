// 用户相关请求模块
import request from '../utils/requset.js'
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
