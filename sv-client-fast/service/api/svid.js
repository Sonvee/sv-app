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
