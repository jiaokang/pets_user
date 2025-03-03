import request from '@/utils/request'

// 获取疫苗接种记录列表
export function getVaccineRecords(petId) {
  return request({
    url: '/api/vaccine/get',
    method: 'get',
    params: { petId } 
  })
}

// 创建疫苗接种记录
export function createVaccineRecord(data) {
  return request({
    url: '/api/vaccine/add',
    method: 'post',
    data
  })
}

// 更新疫苗接种记录
export function updateVaccineRecord(data) {
  return request({
    url: '/api/vaccine/update',
    method: 'post',
    data
  })
}

// 删除疫苗接种记录
export function deleteVaccineRecord(data) {
  return request({
    url: '/api/vaccine/delete',
    method: 'post',
    data
  })
} 