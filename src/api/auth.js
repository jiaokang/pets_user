import request from '@/utils/request'
// 登录相关API
export function loginByAccount(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function loginByEmail(data) {
  return request({
    url: '/api/auth/login/email',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

export function sendEmailCode(email, type = 'login') {
  return request({
    url: '/api/auth/email/code',
    method: 'post',
    data: {
      email,
      type // 可以是 'login' 或 'register'
    }
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post',
  })
}

export default request 