import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 使用环境变量
  timeout: 10000, // 请求超时时间
  withCredentials: true // 跨域请求时发送cookies
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前可以进行一些处理，例如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
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
    // 判断HTTP状态码
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      console.error('HTTP错误:', response.statusText)
      return Promise.reject(new Error(response.statusText || '请求失败'))
    }
  },
  error => {
    // 处理HTTP错误
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('HTTP错误:', error.response.status, error.response.statusText)
      return Promise.reject(new Error(error.response.statusText || `HTTP错误 ${error.response.status}`))
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误:', error.message)
      return Promise.reject(new Error('网络错误,请检查网络连接'))
    } else {
      // 请求配置出错
      console.error('请求错误:', error.message)
      return Promise.reject(error)
    }
  }
)

// 登录相关API
export function loginByAccount(data) {
  return service({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function loginByEmail(data) {
  return service({
    url: '/api/auth/login/email',
    method: 'post',
    data
  })
}

export function register(data) {
  return service({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

export function sendEmailCode(email, type = 'login') {
  return service({
    url: '/api/auth/email/code',
    method: 'post',
    data: {
      email,
      type // 可以是 'login' 或 'register'
    }
  })
}

export function logout() {
  return service({
    url: '/api/auth/logout',
    method: 'post',
  })
}

export default service 