import request from '../request/index.js'

export function vipList() {
  return request({
    url: '/vip/vipList',
    method: 'POST',
  })
}