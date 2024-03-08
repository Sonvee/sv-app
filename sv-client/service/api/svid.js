import request from '../request/index.js'

/**
 * 用户
 */
export function userInfo(data) {
  return request({
    url: '/svid/userInfo',
    method: 'POST',
    data
  })
}

export function vipList() {
  return request({
    url: '/svid/vipList',
    method: 'POST',
  })
}