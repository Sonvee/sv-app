import request from '../request/index.js'

export function vipList() {
  return request({
    url: '/vip/vipList',
    method: 'POST',
  })
}

export function benefitList() {
  return request({
    url: '/vip/benefitList',
    method: 'POST',
  })
}

/**
 * 用户会员验证 实时事件驱动：建议在用户访问特定接口、页面、登录时等情况触发检查
 * @param {Object} data {user_id}
 */
export function vipVerify(data) {
  return request({
    url: '/vip/vipVerify',
    method: 'POST',
    data
  })
}

/**
 * cdkey激活
 * @param {Object} data {user_id, cdkey}
 */
export function cdkeyActive(data) {
  return request({
    url: '/vip/cdkeyActive',
    method: 'POST',
    data,
  })
}