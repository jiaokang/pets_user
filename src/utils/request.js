import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // API的基础URL
  timeout: 10000, // 请求超时时间
  withCredentials: true // 跨域请求时发送cookies
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前可以进行一些处理，例如添加token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 这里假设后端返回的数据格式为 { code: '00000', message: 'xxx', data: xxx }
    if (res.code === '00000') {
      return res
    } else {
      // 处理业务错误
      Message({
        message: res.message || '操作失败',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error(res.message || '操作失败'))
    }
  },
  error => {
    console.error('请求错误:', error)
    // 处理HTTP错误
    let message = '请求失败'
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // 可以在这里处理登录过期的情况
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data.message || `请求失败: ${error.response.status}`
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message = '网络错误，请检查网络连接'
    } else {
      // 请求配置出错
      message = error.message
    }

    Message({
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 