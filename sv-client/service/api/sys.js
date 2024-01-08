import request from '../request/index.js'

/**
 * 字典
 */
export function dictList(data) {
  return request({
    url: '/sys/dictList',
    method: 'POST',
    data
  })
}