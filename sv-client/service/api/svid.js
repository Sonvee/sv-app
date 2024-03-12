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

export function userUpdate(data) {
  return request({
    url: '/svid/userUpdate',
    method: 'POST',
    data
  })
}