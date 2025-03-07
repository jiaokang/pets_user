import request from '@/utils/request'

// 获取宠物列表
export function getPets() {
  return request({
    url: '/api/pets/get',
    method: 'get'
  })
}

// 添加宠物
export function addPet(data) {
  return request({
    url: '/api/pets/add',
    method: 'post',
    data
  })
}
// 上传文件
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/api/avatar/uploadAvatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 更新宠物信息
export function updatePet(data) {
  return request({
    url: '/api/pets/update',
    method: 'post',
    data
  })
}

// 删除宠物
export function deletePet(id) {
  return request({
    url: '/api/pets/delete',
    method: 'post',
    data
  })
}

export default request