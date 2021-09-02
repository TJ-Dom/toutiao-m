// 请求模块
import axios from 'axios'
import store from '../store'
import jsonBig from 'json-bigint'
// JSONBig 可以处理数据中超出javascript 安全整数范围的问题
// JSONBig.parse() //把 JSON 格式的字符串转为 javascript 对象
// 使用时需要把 BigNumber 类型的数据转为字符串来使用
// JSONBig.stringify() //把 javascript 对象转为 JSON 格式的字符串

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 接口基础路径
  transformResponse: [
    // transformResponse 允许自定义原始的响应数据（字符串）
    function (data) {
      // data：后端返回的原始数据
      // Do whatever you want to transform the data
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data) // 将数据中超出js安全证书范围的问题
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return data // 相当于 return JSON.parse(data) >> axios 默认会在内部处理后端返回的数据
      }
    }
  ]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent在发送请求之前做些什么
    // config：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  },
  function (error) {
    // Do something with request error处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
// Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   return Promise.reject(error);
// });

export default request
