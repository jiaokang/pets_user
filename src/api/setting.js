import request from "@/utils/request"


// 获取设置项目
export function getSetting() {
    return request({
        url: '/api/setting/get',
        method: 'get',
    })
}

// 修改设置项目
export function setSetting(data) {
    return request({
        url: '/api/setting/set',
        method: 'post',
        data
    })
}



export default request 