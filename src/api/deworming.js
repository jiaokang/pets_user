import request from '@/utils/request'

// 获取驱虫记录列表
export function getDewormingRecords() {
  return request({
    url: '/deworming-records',
    method: 'get'
  })
}

// 创建驱虫记录
export function createDewormingRecord(data) {
  return request({
    url: '/deworming-records',
    method: 'post',
    data
  })
}

// 更新驱虫记录
export function updateDewormingRecord(data) {
  return request({
    url: `/deworming-records/${data.id}`,
    method: 'put',
    data
  })
}

// 删除驱虫记录
export function deleteDewormingRecord(id) {
  return request({
    url: `/deworming-records/${id}`,
    method: 'delete'
  })
} 