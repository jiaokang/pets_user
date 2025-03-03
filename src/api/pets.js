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